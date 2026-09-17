const CHINESE_LAYER_PATCH_VERSION='0.5.2';

function devLiveUrl(pathname, params={}){
  const u=new URL(`${DEV_API}${pathname}`);
  for(const [key,value] of Object.entries(params))u.searchParams.set(key,String(value));
  u.searchParams.set('_cl',`${Date.now()}-${Math.random().toString(36).slice(2)}`);
  return u.toString();
}

async function fetchDevLiveList(url){
  const r=await fetch(url,{headers:{Accept:'application/vnd.forem.api-v1+json','Cache-Control':'no-cache'},cache:'no-store'});
  if(!r.ok)throw new Error(`DEV API ${r.status}`);
  const rows=await r.json();
  return Array.isArray(rows)?rows:[];
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
    state.articles=[];
    renderHomeArticles();
    status.textContent=`DEV 实时读取失败：${e.message}`;
  }
};

loadMe=async function(){
  const username=(state.username||'joinwell52').trim().replace(/^@/,'');
  state.lastError='';
  $('#meSetup').classList.add('hidden');
  $('#meContent').classList.remove('hidden');
  $('#meStatus').textContent='正在实时读取我的 DEV…';
  try{
    const primaryPromise=fetchDevLiveList(devLiveUrl('/articles',{username,per_page:100,page:1}));
    const freshPromise=fetchDevLiveList(devLiveUrl('/articles/latest',{per_page:100}));
    const [primaryResult,freshResult]=await Promise.allSettled([primaryPromise,freshPromise]);
    const primary=primaryResult.status==='fulfilled'?primaryResult.value:[];
    const fresh=freshResult.status==='fulfilled'?freshResult.value:[];
    if(!primary.length&&primaryResult.status==='rejected')throw primaryResult.reason;
    const merged=new Map();
    for(const article of primary)merged.set(String(article.id),article);
    for(const article of fresh){
      if(String(article?.user?.username||'').toLowerCase()===username.toLowerCase())merged.set(String(article.id),article);
    }
    const raw=[...merged.values()];
    if(!raw.length)throw new Error(`找不到 @${username} 的公开文章`);
    state.myArticles=raw.map(normalizeArticle).sort((a,b)=>new Date(b.published_at)-new Date(a.published_at));
    try{
      const cache=await loadServerCache(true);
      if(username==='joinwell52')mergeCachedTranslations(state.myArticles,cache.mine);
    }catch{}
    renderProfile(username);
    renderMyArticles();
    const freshAdded=Math.max(0,state.myArticles.length-primary.length);
    $('#meStatus').textContent=`${state.myArticles.length} 篇公开文章 · 已实时刷新${freshAdded?` · 补获 ${freshAdded} 篇最新文章`:''}`;
    await translateArticleList(state.myArticles.slice(0,30),{statusEl:$('#meStatus'),render:renderMyArticles,label:'我的文章'});
    renderMyArticles();
    $('#meStatus').textContent=state.lastError
      ?`${state.myArticles.length} 篇公开文章 · 已实时刷新 · 个别标题暂未翻译`
      :`${state.myArticles.length} 篇公开文章 · 已实时刷新 · 中文浏览`;
  }catch(e){
    state.myArticles=[];
    renderMyArticles();
    $('#meStatus').textContent=`DEV 实时读取失败：${e.message}`;
  }
};

function markChineseLayerPatchVersion(){
  document.querySelectorAll('#versionBadge,#launcherVersion').forEach(el=>{el.textContent=`v${CHINESE_LAYER_PATCH_VERSION}`});
}
markChineseLayerPatchVersion();
document.addEventListener('DOMContentLoaded',markChineseLayerPatchVersion);
