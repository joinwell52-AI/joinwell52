const APP_VERSION='0.2.5';
const DEV_API='https://dev.to/api';
const MM_API='https://api.mymemory.translated.net/get';
const STABLE_CACHE_KEY='cl-translate-cache-v1';
let remoteVersion=APP_VERSION;

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

function loadTranslationCache(){
  const merged=new Map();
  const keys=[STABLE_CACHE_KEY,'cl-cache','cl-cache-0.2.0','cl-cache-0.2.1','cl-cache-0.2.2','cl-cache-0.2.3','cl-cache-0.2.4'];
  for(const key of keys){
    try{
      const rows=JSON.parse(localStorage.getItem(key)||'[]');
      if(!Array.isArray(rows))continue;
      for(const row of rows){
        if(!Array.isArray(row)||row.length<2)continue;
        const src=typeof row[0]==='string'?row[0]:'';
        const dst=typeof row[1]==='string'?row[1]:'';
        if(!src||!dst||dst==='[object Object]'||dst.includes('__CL_'))continue;
        merged.set(src,dst);
      }
    }catch{}
  }
  return merged;
}

const savedUsername=localStorage.getItem('cl-dev-username')||'';
const state={
  articles:[],myArticles:[],currentArticle:null,feed:'popular',
  showChinese:localStorage.getItem('cl-language')!=='en',
  cache:loadTranslationCache(),
  username:/^[A-Za-z0-9_-]+$/.test(savedUsername)?savedUsername:'joinwell52',
  lastError:''
};
if(!savedUsername)localStorage.setItem('cl-dev-username','joinwell52');

function textValue(v){
  if(typeof v==='string')return v;
  if(v==null)return '';
  if(typeof v==='number'||typeof v==='boolean')return String(v);
  if(typeof v==='object')for(const k of ['text','value','name','title'])if(typeof v[k]==='string')return v[k];
  return '';
}
function normalizeArticle(a){return {...a,title:textValue(a?.title),description:textValue(a?.description),path:textValue(a?.path)}}
function esc(s=''){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function fmtDate(s){try{return new Intl.DateTimeFormat('zh-CN',{month:'numeric',day:'numeric'}).format(new Date(s))}catch{return''}}
function hasEnglish(t){return /[A-Za-z]{2}/.test(String(t||''))}
function currentTitle(a){return state.showChinese?(textValue(a?._zhTitle)||textValue(a?.title)):textValue(a?.title)}
function currentDesc(a){return state.showChinese?(textValue(a?._zhDesc)||textValue(a?.description)):textValue(a?.description)}

function saveCache(){
  try{localStorage.setItem(STABLE_CACHE_KEY,JSON.stringify([...state.cache].slice(-2000)))}catch{}
}
function byteChunks(text,max=400){
  const out=[];let cur='';
  for(const ch of String(text||'')){
    const next=cur+ch;
    if(new Blob([next]).size>max){if(cur)out.push(cur);cur=ch}else cur=next;
  }
  if(cur)out.push(cur);
  return out;
}
async function fetchWithTimeout(url,ms=9000){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),ms);
  try{return await fetch(url,{cache:'no-store',credentials:'omit',signal:controller.signal})}
  finally{clearTimeout(timer)}
}

// 恢复最初可工作的翻译链路：只使用 MyMemory，不再经过 Lingva/LibreTranslate。
async function translateText(value){
  const text=textValue(value).trim();
  if(!text||text.length<2||!hasEnglish(text))return text;
  const cached=state.cache.get(text);
  if(typeof cached==='string'&&cached&&cached!=='[object Object]'&&!cached.includes('__CL_'))return cached;

  let result='';
  for(const chunk of byteChunks(text)){
    const u=new URL(MM_API);
    u.searchParams.set('q',chunk);
    u.searchParams.set('langpair','en|zh-CN');
    const r=await fetchWithTimeout(u.toString());
    if(!r.ok)throw new Error(`MyMemory HTTP ${r.status}`);
    const j=await r.json();
    const translated=textValue(j?.responseData?.translatedText).trim();
    if(!translated||translated==='[object Object]')throw new Error('MyMemory 未返回译文');
    if(j?.responseStatus&&Number(j.responseStatus)>=400)throw new Error(`MyMemory ${j.responseStatus}`);
    result+=translated;
  }
  if(!result||result==='[object Object]')throw new Error('翻译结果无效');
  state.cache.set(text,result);
  saveCache();
  return result;
}

async function mapLimit(items,limit,fn,fallback){
  const ret=new Array(items.length);let cursor=0;
  const workers=Array.from({length:Math.min(limit,Math.max(1,items.length))},async()=>{
    while(cursor<items.length){
      const idx=cursor++;
      try{ret[idx]=await fn(items[idx],idx)}catch(e){ret[idx]=fallback?fallback(items[idx],idx,e):null}
    }
  });
  await Promise.all(workers);return ret;
}

function versionParts(v){return String(v||'').replace(/^v/,'').split('.').map(x=>parseInt(x,10)||0)}
function isNewerVersion(remote,current){
  const a=versionParts(remote),b=versionParts(current),n=Math.max(a.length,b.length);
  for(let i=0;i<n;i++){const av=a[i]||0,bv=b[i]||0;if(av>bv)return true;if(av<bv)return false}
  return false;
}
function showUpdateBanner(text,buttonText='立即更新'){
  const b=$('#updateBanner');if(!b)return;
  $('#updateText').textContent=text;$('#updateNow').textContent=buttonText;b.classList.remove('hidden');
}
function hideUpdateBanner(){const b=$('#updateBanner');if(b)b.classList.add('hidden')}
async function checkForUpdate(){
  try{
    const r=await fetch(`./version.json?ts=${Date.now()}`,{cache:'no-store'});if(!r.ok)return;
    const meta=await r.json();remoteVersion=String(meta.version||APP_VERSION);
    if(isNewerVersion(remoteVersion,APP_VERSION)){showUpdateBanner(`发现新版本 v${remoteVersion}`,'立即更新');return}
    const previous=localStorage.getItem('cl-last-app-version');
    if(previous&&previous!==APP_VERSION)showUpdateBanner(`已更新到 v${APP_VERSION}`,'知道了');
    localStorage.setItem('cl-last-app-version',APP_VERSION);
  }catch{}
}
function forceUpdate(){
  if(!isNewerVersion(remoteVersion,APP_VERSION)){hideUpdateBanner();return}
  const u=new URL(location.href);u.searchParams.set('version',remoteVersion);u.searchParams.set('_',Date.now());location.replace(u.toString());
}

async function loadArticles(){
  const status=$('#status');
  status.textContent='正在读取 DEV 内容…';
  try{
    const endpoint=state.feed==='latest'?`${DEV_API}/articles/latest?per_page=12`:`${DEV_API}/articles?per_page=12`;
    const r=await fetch(endpoint,{headers:{Accept:'application/vnd.forem.api-v1+json'},cache:'no-store'});
    if(!r.ok)throw new Error('DEV API 请求失败');
    const raw=await r.json();
    state.articles=Array.isArray(raw)?raw.map(normalizeArticle):[];
    renderHomeArticles();

    status.textContent='正在翻译标题…';
    for(let i=0;i<state.articles.length;i++){
      const a=state.articles[i];
      try{a._zhTitle=await translateText(a.title)}catch(e){state.lastError=e.message;a._zhTitle=a.title}
      if(i===0||(i+1)%3===0){renderHomeArticles();status.textContent=`正在翻译标题… ${i+1}/${state.articles.length}`}
    }
    renderHomeArticles();

    status.textContent='标题已完成，正在翻译摘要…';
    for(let i=0;i<Math.min(6,state.articles.length);i++){
      const a=state.articles[i];
      if(!a.description)continue;
      try{a._zhDesc=await translateText(a.description)}catch(e){state.lastError=e.message;a._zhDesc=a.description}
      renderHomeArticles();
    }
    status.textContent=state.lastError?`部分翻译完成 · MyMemory（${state.lastError}）`:'已中文化 · MyMemory';
  }catch(e){
    state.lastError=e.message;
    status.textContent=`翻译失败：${e.message}`;
    renderHomeArticles();
  }
}

function renderHomeArticles(){
  const root=$('#articleList');root.innerHTML='';
  for(const a of state.articles){
    const c=document.createElement('article');c.className='feed-card';
    const cover=a.cover_image||a.social_image||'';
    c.innerHTML=`<div class="feed-author"><span>${esc(a.user?.name||a.user?.username||'DEV')}</span><span>${fmtDate(a.published_at)}</span></div>${cover?`<img class="feed-cover" src="${esc(cover)}" alt="" loading="lazy" />`:''}<div class="feed-body"><h2>${esc(currentTitle(a))}</h2>${currentDesc(a)?`<p>${esc(currentDesc(a))}</p>`:''}<div class="tagline">${(a.tag_list||[]).slice(0,4).map(t=>`<span class="tag">#${esc(t)}</span>`).join('')}</div><div class="feed-stats"><span>♡ ${a.positive_reactions_count||0}</span><span>◯ ${a.comments_count||0}</span></div></div>`;
    c.addEventListener('click',()=>openArticle(a));
    root.appendChild(c);
  }
}

function renderMyArticles(){
  const root=$('#myArticleList');root.innerHTML='';
  if(!state.myArticles.length){root.innerHTML='<div class="empty-state">还没有公开文章。</div>';return}
  for(const a of state.myArticles){
    const c=document.createElement('article');c.className='my-article-card';
    const editUrl=a.path?`https://dev.to${a.path}/edit`:'https://dev.to/dashboard';
    c.innerHTML=`<h2>${esc(currentTitle(a))}</h2><div class="my-meta">已发布：${fmtDate(a.published_at)} <span>语言：English</span></div><div class="my-actions"><span>♡ ${a.positive_reactions_count||0}</span><span>◯ ${a.comments_count||0}</span><a href="https://dev.to/dashboard" target="_blank" rel="noopener">管理</a><a href="${esc(editUrl)}" target="_blank" rel="noopener">编辑</a></div>`;
    c.addEventListener('click',()=>openArticle(a));
    c.querySelectorAll('a').forEach(el=>el.addEventListener('click',e=>e.stopPropagation()));
    root.appendChild(c);
  }
}

async function loadMe(){
  const username=(state.username||'joinwell52').trim().replace(/^@/,'');
  $('#meSetup').classList.add('hidden');$('#meContent').classList.remove('hidden');$('#meStatus').textContent='正在读取我的 DEV…';
  try{
    const articlesUrl=`${DEV_API}/articles?username=${encodeURIComponent(username)}&per_page=100`;
    const r=await fetch(articlesUrl,{cache:'no-store'});
    if(!r.ok)throw new Error('读取我的文章失败');
    const raw=await r.json();
    if(!Array.isArray(raw)||!raw.length)throw new Error(`找不到 @${username} 的公开文章`);
    state.myArticles=raw.map(normalizeArticle).sort((a,b)=>new Date(b.published_at)-new Date(a.published_at));
    const au=state.myArticles[0].user||{};
    $('#profileCard').innerHTML=`<div class="profile-top">${au.profile_image_90?`<img class="avatar" src="${esc(au.profile_image_90)}" alt="" />`:''}<div class="profile-id"><h2>${esc(au.name||username)}</h2><div class="muted">@${esc(au.username||username)}</div></div></div>`;
    renderMyArticles();

    const count=Math.min(20,state.myArticles.length);
    for(let i=0;i<count;i++){
      const a=state.myArticles[i];
      $('#meStatus').textContent=`正在翻译我的文章标题… ${i+1}/${count}`;
      try{a._zhTitle=await translateText(a.title)}catch(e){state.lastError=e.message;a._zhTitle=a.title}
      renderMyArticles();
    }
    $('#meStatus').textContent=state.lastError?`已显示 ${state.myArticles.length} 篇 · 前 ${count} 篇已尝试翻译 · ${state.lastError}`:`${state.myArticles.length} 篇公开文章 · 前 ${count} 篇已中文化 · MyMemory`;
  }catch(e){
    $('#meStatus').textContent=`读取失败：${e.message}`;$('#profileCard').innerHTML='';$('#myArticleList').innerHTML='';
  }
}

async function openArticle(a){
  state.currentArticle=a;
  const reader=$('#reader'),content=$('#readerContent');
  reader.classList.remove('hidden');reader.setAttribute('aria-hidden','false');
  content.innerHTML=`<h1>${esc(currentTitle(a))}</h1><p class="muted">正在读取正文…</p>`;
  try{
    const r=await fetch(`${DEV_API}/articles/${a.id}`,{headers:{Accept:'application/vnd.forem.api-v1+json'},cache:'no-store'});
    if(!r.ok)throw new Error('正文读取失败');
    const d=normalizeArticle(await r.json());state.currentArticle={...a,...d};
    content.innerHTML=`<div class="reader-author">${esc(d.user?.name||'DEV')} · ${fmtDate(d.published_at)}</div><h1 data-original="${esc(d.title)}">${esc(state.showChinese?(a._zhTitle||d.title):d.title)}</h1>${d.body_html||''}`;
    if(state.showChinese)await translateDom(content);
  }catch(e){content.innerHTML+=`<p>读取/翻译失败：${esc(e.message)}</p>`}
}

async function translateDom(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){
    const p=n.parentElement;
    if(!p||['SCRIPT','STYLE','PRE','CODE','KBD','SAMP','SVG','BUTTON'].includes(p.tagName))return NodeFilter.FILTER_REJECT;
    const t=n.nodeValue.trim();
    return hasEnglish(t)&&t.length>2?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
  }});
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const n of nodes){
    if(!n.parentElement.dataset.originalText)n.parentElement.dataset.originalText=n.nodeValue;
    try{const t=await translateText(n.nodeValue);if(t)n.nodeValue=t}catch{}
  }
}

function setLanguage(chinese){
  state.showChinese=chinese;localStorage.setItem('cl-language',chinese?'zh':'en');
  $('#langToggle').textContent=chinese?'中文':'EN';$('#readerLang').textContent=chinese?'中文':'EN';
  if(!$('#reader').classList.contains('hidden')){
    const c=$('#readerContent');
    if(chinese)translateDom(c);else{
      for(const el of c.querySelectorAll('[data-original-text]'))el.textContent=el.dataset.originalText;
      const h=c.querySelector('h1[data-original]');if(h)h.textContent=h.dataset.original;
    }
  }
  renderHomeArticles();if(state.myArticles.length)renderMyArticles();
}
function switchView(viewId,title){
  $$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===viewId));
  $$('.view').forEach(v=>v.classList.toggle('active',v.id===viewId));
  $('#pageTitle').textContent=title||'DEV 中文';
  if(viewId==='meView')loadMe();
}

$('#langToggle').addEventListener('click',()=>setLanguage(!state.showChinese));
$('#readerLang').addEventListener('click',()=>setLanguage(!state.showChinese));
$('#readerBack').addEventListener('click',()=>{$('#reader').classList.add('hidden');$('#reader').setAttribute('aria-hidden','true')});
$('#openOriginal').addEventListener('click',()=>{const u=state.currentArticle?.url||state.currentArticle?.canonical_url;if(u)window.open(u,'_blank','noopener')});
$('#saveUsername').addEventListener('click',()=>{const v=$('#devUsername').value.trim().replace(/^@/,'');if(!v)return;state.username=v;localStorage.setItem('cl-dev-username',v);loadMe()});
$('#changeUsername').addEventListener('click',()=>{state.username='';localStorage.removeItem('cl-dev-username');$('#devUsername').value='';$('#meContent').classList.add('hidden');$('#meSetup').classList.remove('hidden')});
$$('.feed-tab').forEach(b=>b.addEventListener('click',()=>{$$('.feed-tab').forEach(x=>x.classList.toggle('active',x===b));state.feed=b.dataset.feed;loadArticles()}));
$$('.nav-btn').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view,b.dataset.title)));
$('#updateNow').addEventListener('click',forceUpdate);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkForUpdate()});
setInterval(checkForUpdate,120000);
$('#versionBadge').textContent=`v${APP_VERSION}`;
$('#langToggle').textContent=state.showChinese?'中文':'EN';
$('#readerLang').textContent=state.showChinese?'中文':'EN';
checkForUpdate();
loadArticles();
