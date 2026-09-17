const CHINESE_LAYER_PATCH_VERSION='0.5.3';

function devLiveUrl(pathname, params={}){
  const u=new URL(`${DEV_API}${pathname}`);
  for(const [key,value] of Object.entries(params))u.searchParams.set(key,String(value));
  u.searchParams.set('_cl',`${Date.now()}-${Math.random().toString(36).slice(2)}`);
  return u.toString();
}

async function fetchDevJson(url){
  const r=await fetch(url,{cache:'no-store',credentials:'omit'});
  if(!r.ok)throw new Error(`DEV API ${r.status}`);
  return await r.json();
}

async function fetchDevLiveList(url){
  const rows=await fetchDevJson(url);
  return Array.isArray(rows)?rows:[];
}

function applyCachedList(rows){
  return (Array.isArray(rows)?rows:[]).map(normalizeArticle);
}

async function fallbackHomeFromCache(status){
  try{
    const cache=await loadServerCache(true);
    state.articles=applyCachedList(state.feed==='latest'?cache.latest:cache.popular);
    renderHomeArticles();
    status.textContent='DEV 实时读取暂不可用 · 已显示最近中文缓存';
    return true;
  }catch{return false}
}

async function fallbackMineFromCache(username){
  try{
    if(username!=='joinwell52')return false;
    const cache=await loadServerCache(true);
    state.myArticles=applyCachedList(cache.mine).sort((a,b)=>new Date(b.published_at)-new Date(a.published_at));
    if(!state.myArticles.length)return false;
    renderProfile(username);
    renderMyArticles();
    $('#meStatus').textContent=`${state.myArticles.length} 篇公开文章 · DEV 实时读取暂不可用 · 已显示最近中文缓存`;
    return true;
  }catch{return false}
}

loadArticles=async function(){
  const status=$('#status');
  state.lastError='';
  status.textContent='正在实时读取 DEV…';
  try{
    const rows=await fetchDevLiveList(state.feed==='latest'
      ?devLiveUrl('/articles/latest',{per_page:12})
      :devLiveUrl('/articles',{per_page:12}));
    state.articles=rows.map(normalizeArticle);
    try{
      const cache=await loadServerCache(true);
      mergeCachedTranslations(state.articles,state.feed==='latest'?cache.latest:cache.popular);
    }catch{}
    renderHomeArticles();
    status.textContent='DEV 已实时刷新 · 中文缓存仅用于加速';
    await translateArticleList(state.articles,{descriptions:true,statusEl:status,render:renderHomeArticles,label:'DEV'});
    renderHomeArticles();
    status.textContent=state.lastError?'DEV 已实时刷新 · 个别新文本暂未翻译':'DEV 已实时刷新 · 中文浏览';
  }catch(e){
    const ok=await fallbackHomeFromCache(status);
    if(!ok){state.articles=[];renderHomeArticles();status.textContent=`DEV 实时读取失败：${e.message}`}
  }
};

loadMe=async function(){
  const username=(state.username||'joinwell52').trim().replace(/^@/,'');
  state.lastError='';
  $('#meSetup').classList.add('hidden');
  $('#meContent').classList.remove('hidden');
  $('#meStatus').textContent='正在实时读取我的 DEV…';
  try{
    const primaryPromise=fetchDevLiveList(devLiveUrl('/articles',{username,state:'all',per_page:1000,page:1}));
    const latestPromise=fetchDevLiveList(devLiveUrl('/articles/latest',{per_page:100}));
    const [primaryResult,latestResult]=await Promise.allSettled([primaryPromise,latestPromise]);
    const primary=primaryResult.status==='fulfilled'?primaryResult.value:[];
    const latest=latestResult.status==='fulfilled'?latestResult.value:[];
    if(!primary.length&&primaryResult.status==='rejected')throw primaryResult.reason;
    const merged=new Map();
    for(const article of primary)merged.set(String(article.id),article);
    for(const article of latest){
      if(String(article?.user?.username||'').toLowerCase()===username.toLowerCase())merged.set(String(article.id),article);
    }
    const raw=[...merged.values()];
    if(!raw.length)throw new Error(`找不到 @${username} 的文章`);
    state.myArticles=raw.map(normalizeArticle).sort((a,b)=>new Date(b.published_at||b.created_at)-new Date(a.published_at||a.created_at));
    try{
      const cache=await loadServerCache(true);
      if(username==='joinwell52')mergeCachedTranslations(state.myArticles,cache.mine);
    }catch{}
    renderProfile(username);
    renderMyArticles();
    const latestAdded=Math.max(0,state.myArticles.length-primary.length);
    $('#meStatus').textContent=`${state.myArticles.length} 篇文章 · 已实时刷新${latestAdded?` · 补获 ${latestAdded} 篇最新文章`:''}`;
    await translateArticleList(state.myArticles.slice(0,30),{statusEl:$('#meStatus'),render:renderMyArticles,label:'我的文章'});
    renderMyArticles();
    $('#meStatus').textContent=state.lastError
      ?`${state.myArticles.length} 篇文章 · 已实时刷新 · 个别标题暂未翻译`
      :`${state.myArticles.length} 篇文章 · 已实时刷新 · 中文浏览`;
  }catch(e){
    const ok=await fallbackMineFromCache(username);
    if(!ok){state.myArticles=[];renderMyArticles();$('#meStatus').textContent=`DEV 实时读取失败：${e.message}`}
  }
};

openArticle=async function(a){
  state.currentArticle=a;
  const reader=$('#reader'),content=$('#readerContent');
  reader.classList.remove('hidden');
  reader.setAttribute('aria-hidden','false');
  content.innerHTML=`<h1>${esc(currentTitle(a))}</h1><p class="muted">正在读取 DEV 原文结构…</p>`;
  try{
    const d=normalizeArticle(await fetchDevJson(devLiveUrl(`/articles/${a.id}`)));
    state.currentArticle={...a,...d};
    content.innerHTML=`<div class="reader-author">${esc(d.user?.name||'DEV')} · ${fmtDate(d.published_at)}</div><h1>${esc(state.showChinese?(a._zhTitle||d.title):d.title)}</h1>${d.body_html||''}`;
    if(state.showChinese){
      state.lastError='';
      await translateDom(content);
      if(state.lastError){
        const note=document.createElement('p');
        note.className='muted';
        note.textContent='部分新文本暂未翻译，原文结构已保留。';
        content.prepend(note);
      }
    }
  }catch(e){
    content.innerHTML+=`<p>读取失败：${esc(e.message)}</p>`;
  }
};

const baseIsNewerVersion=isNewerVersion;
isNewerVersion=(remote)=>baseIsNewerVersion(remote,CHINESE_LAYER_PATCH_VERSION);
try{localStorage.setItem('cl-last-app-version',APP_VERSION)}catch{}
if(typeof hideUpdateBanner==='function')hideUpdateBanner();

function markChineseLayerPatchVersion(){
  document.querySelectorAll('#versionBadge,#launcherVersion').forEach(el=>{el.textContent=`v${CHINESE_LAYER_PATCH_VERSION}`});
}
markChineseLayerPatchVersion();
document.addEventListener('DOMContentLoaded',markChineseLayerPatchVersion);
