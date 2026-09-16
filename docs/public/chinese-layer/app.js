const APP_VERSION='0.4.0';
const DEV_API='https://dev.to/api';
const GOOGLE_TRANSLATE='https://translate.googleapis.com/translate_a/single';
const CACHE_KEY='cl-translate-cache-v4';
const IS_MOBILE=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent||'');
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

function text(v){return typeof v==='string'?v:(v==null?'':String(v))}
function esc(s=''){return text(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function fmtDate(s){try{return new Intl.DateTimeFormat('zh-CN',{month:'numeric',day:'numeric'}).format(new Date(s))}catch{return''}}
function hasEnglish(s){return /[A-Za-z]{2}/.test(text(s))}
function normalizeArticle(a){return {...a,title:text(a?.title),description:text(a?.description),path:text(a?.path)}}
function paragraphHtml(value){return text(value).split(/\n{2,}/).map(p=>p.trim()).filter(Boolean).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('')}

function loadLocalCache(){
  const merged=new Map();
  const keys=[CACHE_KEY,'cl-translate-cache-v3','cl-translate-cache-v2','cl-translate-cache-v1','cl-cache'];
  for(const key of keys){
    try{
      const rows=JSON.parse(localStorage.getItem(key)||'[]');
      if(!Array.isArray(rows))continue;
      for(const row of rows){if(Array.isArray(row)&&typeof row[0]==='string'&&typeof row[1]==='string'&&row[0].trim()&&row[1].trim())merged.set(row[0].trim(),row[1].trim())}
    }catch{}
  }
  return merged;
}
function saveLocalCache(){try{localStorage.setItem(CACHE_KEY,JSON.stringify([...state.localCache].slice(-4000)))}catch{}}

const savedUsername=localStorage.getItem('cl-dev-username')||'';
const state={articles:[],myArticles:[],currentArticle:null,feed:'popular',showChinese:localStorage.getItem('cl-language')!=='en',username:/^[A-Za-z0-9_-]+$/.test(savedUsername)?savedUsername:'joinwell52',localCache:loadLocalCache(),serverCache:null,serverCachePromise:null,remoteVersion:APP_VERSION,provider:IS_MOBILE?'服务端中文缓存':'Google Translate',lastError:''};
if(!savedUsername)localStorage.setItem('cl-dev-username','joinwell52');
function currentTitle(a){return state.showChinese?(text(a?._zhTitle)||text(a?.title)):text(a?.title)}
function currentDesc(a){return state.showChinese?(text(a?._zhDesc)||text(a?.description)):text(a?.description)}

async function loadServerCache(){
  if(state.serverCache)return state.serverCache;
  if(state.serverCachePromise)return state.serverCachePromise;
  state.serverCachePromise=(async()=>{
    const r=await fetch(`./cache.json?ts=${Date.now()}`,{cache:'no-store'});
    if(!r.ok)throw new Error(`中文缓存 HTTP ${r.status}`);
    const data=await r.json();
    if(data?.schema!=='chinese-layer-cache/v1')throw new Error('中文缓存格式不正确');
    state.serverCache=data;return data;
  })();
  try{return await state.serverCachePromise}finally{state.serverCachePromise=null}
}

function chunksByLength(value,max=900){const s=text(value);if(s.length<=max)return[s];const out=[];let rest=s;while(rest.length>max){let cut=Math.max(rest.lastIndexOf('. ',max),rest.lastIndexOf('! ',max),rest.lastIndexOf('? ',max),rest.lastIndexOf('\n',max));if(cut<max*0.45)cut=max;out.push(rest.slice(0,cut+1));rest=rest.slice(cut+1)}if(rest)out.push(rest);return out}
async function fetchJsonWithTimeout(url,ms=10000){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),ms);try{const r=await fetch(url,{cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal});if(!r.ok)throw new Error(`HTTP ${r.status}`);return await r.json()}finally{clearTimeout(timer)}}
async function translatePart(part){const u=new URL(GOOGLE_TRANSLATE);u.searchParams.set('client','gtx');u.searchParams.set('sl','auto');u.searchParams.set('tl','zh-CN');u.searchParams.set('dt','t');u.searchParams.set('q',part);const j=await fetchJsonWithTimeout(u.toString());const segments=Array.isArray(j?.[0])?j[0]:[];const piece=segments.map(x=>Array.isArray(x)&&typeof x[0]==='string'?x[0]:'').join('').trim();if(!piece)throw new Error('空译文');return piece}
async function googleTranslateOne(value){const src=text(value).trim();if(!src||!hasEnglish(src))return src;const cached=state.localCache.get(src);if(cached)return cached;let translated='';for(const part of chunksByLength(src)){translated+=await translatePart(part);await sleep(80)}if(!translated)throw new Error('翻译结果为空');state.localCache.set(src,translated);saveLocalCache();return translated}
async function mapLimit(items,limit,fn,onProgress,fallback){const ret=new Array(items.length);let cursor=0,done=0;const workers=Array.from({length:Math.min(limit,Math.max(1,items.length))},async()=>{while(cursor<items.length){const i=cursor++;try{ret[i]=await fn(items[i],i)}catch(e){state.lastError=e?.message||String(e);ret[i]=fallback?fallback(items[i],i):null}done++;if(onProgress)onProgress(done,i,ret[i])}});await Promise.all(workers);return ret}

function renderHomeArticles(){const root=$('#articleList');root.innerHTML='';if(!state.articles.length){root.innerHTML='<div class="empty-state">没有内容。</div>';return}for(const a of state.articles){const card=document.createElement('article');card.className='feed-card';const cover=a.cover_image||a.social_image||'';card.innerHTML=`<div class="feed-author"><span>${esc(a.user?.name||a.user?.username||'DEV')}</span><span>${fmtDate(a.published_at)}</span></div>${cover?`<img class="feed-cover" src="${esc(cover)}" alt="" loading="lazy" />`:''}<div class="feed-body"><h2>${esc(currentTitle(a))}</h2>${currentDesc(a)?`<p>${esc(currentDesc(a))}</p>`:''}<div class="tagline">${(a.tag_list||[]).slice(0,4).map(t=>`<span class="tag">#${esc(t)}</span>`).join('')}</div><div class="feed-stats"><span>♡ ${a.positive_reactions_count||0}</span><span>◯ ${a.comments_count||0}</span></div></div>`;card.addEventListener('click',()=>openArticle(a));root.appendChild(card)}}

async function loadArticles(){
  const status=$('#status');state.lastError='';status.textContent='正在读取 DEV 内容…';
  if(IS_MOBILE){
    try{const cache=await loadServerCache();const rows=state.feed==='latest'?cache.latest:cache.popular;state.articles=(Array.isArray(rows)?rows:[]).map(normalizeArticle);renderHomeArticles();status.textContent=`已中文化 · 服务端缓存 · ${new Date(cache.generatedAt).toLocaleString('zh-CN')}`;return}catch(e){state.articles=[];renderHomeArticles();status.textContent=`手机中文缓存暂不可用：${e.message}`;return}
  }
  try{const endpoint=state.feed==='latest'?`${DEV_API}/articles/latest?per_page=12`:`${DEV_API}/articles?per_page=12`;const r=await fetch(endpoint,{headers:{Accept:'application/vnd.forem.api-v1+json'},cache:'no-store'});if(!r.ok)throw new Error(`DEV API ${r.status}`);const raw=await r.json();state.articles=Array.isArray(raw)?raw.map(normalizeArticle):[];renderHomeArticles();status.textContent=`正在翻译标题… 0/${state.articles.length}`;const titles=await mapLimit(state.articles,2,a=>googleTranslateOne(a.title),(done,i,v)=>{state.articles[i]._zhTitle=text(v)||state.articles[i].title;renderHomeArticles();status.textContent=`正在翻译标题… ${done}/${state.articles.length}`},a=>a.title);state.articles.forEach((a,i)=>a._zhTitle=text(titles[i])||a.title);renderHomeArticles();const targets=state.articles.slice(0,6);status.textContent='标题已中文化，正在翻译摘要…';const descs=await mapLimit(targets,1,a=>googleTranslateOne(a.description||''),(done,i,v)=>{targets[i]._zhDesc=text(v)||targets[i].description||'';renderHomeArticles()},a=>a.description||'');targets.forEach((a,i)=>a._zhDesc=text(descs[i])||a.description||'');renderHomeArticles();status.textContent=state.lastError?`已翻译大部分内容 · 个别失败：${state.lastError}`:'已中文化 · Google Translate'}catch(e){renderHomeArticles();status.textContent=`翻译失败：${e.message}`}
}

function renderMyArticles(){const root=$('#myArticleList');root.innerHTML='';if(!state.myArticles.length){root.innerHTML='<div class="empty-state">还没有公开文章。</div>';return}for(const a of state.myArticles){const card=document.createElement('article');card.className='my-article-card';const editUrl=a.path?`https://dev.to${a.path}/edit`:'https://dev.to/dashboard';card.innerHTML=`<h2>${esc(currentTitle(a))}</h2><div class="my-meta">已发布：${fmtDate(a.published_at)} <span>语言：English</span></div><div class="my-actions"><span>♡ ${a.positive_reactions_count||0}</span><span>◯ ${a.comments_count||0}</span><a href="https://dev.to/dashboard" target="_blank" rel="noopener">管理</a><a href="${esc(editUrl)}" target="_blank" rel="noopener">编辑</a></div>`;card.addEventListener('click',()=>openArticle(a));card.querySelectorAll('a').forEach(el=>el.addEventListener('click',e=>e.stopPropagation()));root.appendChild(card)}}

function renderProfile(username){const au=state.myArticles[0]?.user||{};$('#profileCard').innerHTML=`<div class="profile-top">${au.profile_image_90?`<img class="avatar" src="${esc(au.profile_image_90)}" alt="" />`:''}<div class="profile-id"><h2>${esc(au.name||username)}</h2><div class="muted">@${esc(au.username||username)}</div></div></div>`}

async function loadMe(){
  const username=(state.username||'joinwell52').trim().replace(/^@/,'');state.lastError='';$('#meSetup').classList.add('hidden');$('#meContent').classList.remove('hidden');$('#meStatus').textContent='正在读取我的 DEV…';
  if(IS_MOBILE&&username==='joinwell52'){
    try{const cache=await loadServerCache();state.myArticles=(Array.isArray(cache.mine)?cache.mine:[]).map(normalizeArticle);if(!state.myArticles.length)throw new Error('我的文章缓存为空');renderProfile(username);renderMyArticles();$('#meStatus').textContent=`${state.myArticles.length} 篇公开文章 · 已中文化 · 服务端缓存`;return}catch(e){state.myArticles=[];renderMyArticles();$('#meStatus').textContent=`手机中文缓存暂不可用：${e.message}`;return}
  }
  try{const r=await fetch(`${DEV_API}/articles?username=${encodeURIComponent(username)}&per_page=100`,{cache:'no-store'});if(!r.ok)throw new Error(`DEV API ${r.status}`);const raw=await r.json();if(!Array.isArray(raw)||!raw.length)throw new Error(`找不到 @${username} 的公开文章`);state.myArticles=raw.map(normalizeArticle).sort((a,b)=>new Date(b.published_at)-new Date(a.published_at));renderProfile(username);renderMyArticles();const count=Math.min(30,state.myArticles.length),subset=state.myArticles.slice(0,count);$('#meStatus').textContent=`正在翻译我的文章标题… 0/${count}`;const titles=await mapLimit(subset,2,a=>googleTranslateOne(a.title),(done,i,v)=>{subset[i]._zhTitle=text(v)||subset[i].title;renderMyArticles();$('#meStatus').textContent=`正在翻译我的文章标题… ${done}/${count}`},a=>a.title);subset.forEach((a,i)=>a._zhTitle=text(titles[i])||a.title);renderMyArticles();$('#meStatus').textContent=state.lastError?`${state.myArticles.length} 篇文章 · 已翻译大部分标题 · 个别失败：${state.lastError}`:`${state.myArticles.length} 篇公开文章 · 前 ${count} 篇已中文化 · Google Translate`}catch(e){$('#meStatus').textContent=`读取/翻译失败：${e.message}`}
}

async function openArticle(a){
  state.currentArticle=a;const reader=$('#reader'),content=$('#readerContent');reader.classList.remove('hidden');reader.setAttribute('aria-hidden','false');content.innerHTML=`<h1>${esc(currentTitle(a))}</h1><p class="muted">正在读取正文并翻译…</p>`;
  if(IS_MOBILE&&state.showChinese){
    try{const cache=await loadServerCache();const body=cache.bodies?.[String(a.id)];if(!body?.bodyZh)throw new Error('这篇正文的中文缓存还未生成');state.currentArticle={...a,canonical_url:body.canonical_url||a.canonical_url,url:body.canonical_url||a.url};content.innerHTML=`<div class="reader-author">${esc(a.user?.name||'DEV')} · ${fmtDate(a.published_at)}</div><h1>${esc(body.titleZh||a._zhTitle||a.title)}</h1><div class="translated-body">${paragraphHtml(body.bodyZh)}</div>`;return}catch(e){content.innerHTML=`<h1>${esc(currentTitle(a))}</h1><p>手机正文翻译暂不可用：${esc(e.message)}</p>`;return}
  }
  try{const r=await fetch(`${DEV_API}/articles/${a.id}`,{headers:{Accept:'application/vnd.forem.api-v1+json'},cache:'no-store'});if(!r.ok)throw new Error(`正文读取失败 ${r.status}`);const d=normalizeArticle(await r.json());state.currentArticle={...a,...d};content.innerHTML=`<div class="reader-author">${esc(d.user?.name||'DEV')} · ${fmtDate(d.published_at)}</div><h1 data-original="${esc(d.title)}">${esc(state.showChinese?(a._zhTitle||d.title):d.title)}</h1>${d.body_html||''}`;if(state.showChinese)await translateDom(content)}catch(e){content.innerHTML+=`<p>读取/翻译失败：${esc(e.message)}</p>`}
}

async function translateDom(root){const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){const p=n.parentElement;if(!p||['SCRIPT','STYLE','PRE','CODE','KBD','SAMP','SVG','BUTTON'].includes(p.tagName))return NodeFilter.FILTER_REJECT;const t=n.nodeValue.trim();return hasEnglish(t)&&t.length>2?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(n=>{if(!n.parentElement.dataset.originalText)n.parentElement.dataset.originalText=n.nodeValue});await mapLimit(nodes,2,n=>googleTranslateOne(n.nodeValue),(done,i,v)=>{if(typeof v==='string'&&v)nodes[i].nodeValue=v},n=>n.nodeValue)}

function setLanguage(chinese){state.showChinese=chinese;localStorage.setItem('cl-language',chinese?'zh':'en');$('#langToggle').textContent=chinese?'中文':'EN';$('#readerLang').textContent=chinese?'中文':'EN';renderHomeArticles();if(state.myArticles.length)renderMyArticles();if(!$('#reader').classList.contains('hidden')&&state.currentArticle)openArticle(state.currentArticle)}
function versionParts(v){return text(v).replace(/^v/,'').split('.').map(x=>parseInt(x,10)||0)}
function isNewerVersion(remote,current){const a=versionParts(remote),b=versionParts(current),n=Math.max(a.length,b.length);for(let i=0;i<n;i++){if((a[i]||0)>(b[i]||0))return true;if((a[i]||0)<(b[i]||0))return false}return false}
function showUpdateBanner(message,button='立即更新'){$('#updateText').textContent=message;$('#updateNow').textContent=button;$('#updateBanner').classList.remove('hidden')}
function hideUpdateBanner(){$('#updateBanner').classList.add('hidden')}
async function checkForUpdate(){try{const r=await fetch(`./version.json?ts=${Date.now()}`,{cache:'no-store'});if(!r.ok)return;const meta=await r.json();state.remoteVersion=text(meta.version||APP_VERSION);if(isNewerVersion(state.remoteVersion,APP_VERSION)){showUpdateBanner(`发现新版本 v${state.remoteVersion}`);return}const previous=localStorage.getItem('cl-last-app-version');if(previous&&previous!==APP_VERSION)showUpdateBanner(`已更新到 v${APP_VERSION}`,'知道了');localStorage.setItem('cl-last-app-version',APP_VERSION)}catch{}}
function forceUpdate(){if(!isNewerVersion(state.remoteVersion,APP_VERSION)){hideUpdateBanner();return}const u=new URL(location.href);u.searchParams.set('version',state.remoteVersion);u.searchParams.set('_',Date.now());location.replace(u.toString())}
function switchView(viewId,title){$$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===viewId));$$('.view').forEach(v=>v.classList.toggle('active',v.id===viewId));$('#pageTitle').textContent=title||'DEV 中文';if(viewId==='meView')loadMe()}

$('#langToggle').addEventListener('click',()=>setLanguage(!state.showChinese));$('#readerLang').addEventListener('click',()=>setLanguage(!state.showChinese));$('#readerBack').addEventListener('click',()=>{$('#reader').classList.add('hidden');$('#reader').setAttribute('aria-hidden','true')});$('#openOriginal').addEventListener('click',()=>{const u=state.currentArticle?.url||state.currentArticle?.canonical_url;if(u)window.open(u,'_blank','noopener')});$('#saveUsername').addEventListener('click',()=>{const v=$('#devUsername').value.trim().replace(/^@/,'');if(!v)return;state.username=v;localStorage.setItem('cl-dev-username',v);loadMe()});$('#changeUsername').addEventListener('click',()=>{state.username='';localStorage.removeItem('cl-dev-username');$('#devUsername').value='';$('#meContent').classList.add('hidden');$('#meSetup').classList.remove('hidden')});$$('.feed-tab').forEach(b=>b.addEventListener('click',()=>{$$('.feed-tab').forEach(x=>x.classList.toggle('active',x===b));state.feed=b.dataset.feed;loadArticles()}));$$('.nav-btn').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view,b.dataset.title)));$('#updateNow').addEventListener('click',forceUpdate);document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkForUpdate()});setInterval(checkForUpdate,120000);$('#versionBadge').textContent=`v${APP_VERSION}`;$('#langToggle').textContent=state.showChinese?'中文':'EN';$('#readerLang').textContent=state.showChinese?'中文':'EN';checkForUpdate();loadArticles();
