const APP_VERSION='0.2.4';
const DEV_API='https://dev.to/api';
const LIBRE_INSTANCES=[
  'https://translate.flossboxin.org.in',
  'https://translate.argosopentech.com',
  'https://libretranslate.de',
  'https://lt.blitzw.in'
];
const MM_API='https://api.mymemory.translated.net/get';
const CACHE_KEY=`cl-cache-${APP_VERSION}`;
let remoteVersion=APP_VERSION;

const savedUsername=localStorage.getItem('cl-dev-username')||'';
const validSavedUsername=/^[A-Za-z0-9_-]+$/.test(savedUsername)?savedUsername:'';
const state={
  articles:[],myArticles:[],currentArticle:null,feed:'popular',
  showChinese:localStorage.getItem('cl-language')!=='en',
  cache:new Map(JSON.parse(localStorage.getItem(CACHE_KEY)||'[]')),
  username:validSavedUsername||'joinwell52',
  lastProvider:'',lastError:'',preferredLibre:localStorage.getItem('cl-libre-provider')||''
};
if(!validSavedUsername)localStorage.setItem('cl-dev-username','joinwell52');

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

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

function textValue(v){
  if(typeof v==='string')return v;
  if(v==null)return '';
  if(typeof v==='number'||typeof v==='boolean')return String(v);
  if(typeof v==='object')for(const k of ['text','value','name','title'])if(typeof v[k]==='string')return v[k];
  return '';
}
function normalizeArticle(a){return {...a,title:textValue(a?.title),description:textValue(a?.description),path:textValue(a?.path)}}
function saveCache(){try{localStorage.setItem(CACHE_KEY,JSON.stringify([...state.cache].slice(-1800)))}catch{}}
function hasEnglish(t){return /[A-Za-z]{2}/.test(t)}
function hasChinese(t){return /[\u3400-\u9fff]/.test(t)}
function esc(s=''){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]))}
function fmtDate(s){try{return new Intl.DateTimeFormat('zh-CN',{month:'numeric',day:'numeric'}).format(new Date(s))}catch{return''}}
function currentTitle(a){return state.showChinese?(textValue(a?._zhTitle)||textValue(a?.title)):textValue(a?.title)}
function currentDesc(a){return state.showChinese?(textValue(a?._zhDesc)||textValue(a?.description)):textValue(a?.description)}
function byteChunks(text,max=430){
  const out=[];let cur='';
  for(const ch of String(text||'')){
    const next=cur+ch;
    if(new Blob([next]).size>max){if(cur)out.push(cur);cur=ch}else cur=next;
  }
  if(cur)out.push(cur);return out;
}
async function fetchWithTimeout(url,options={},ms=6500){
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),ms);
  try{return await fetch(url,{...options,signal:controller.signal})}finally{clearTimeout(timer)}
}
function validTranslation(source,out){
  const s=textValue(source).trim(),t=textValue(out).trim();
  if(!t||t==='[object Object]')return false;
  if(t!==s)return true;
  return !hasEnglish(s)||hasChinese(t);
}
async function libreTranslate(text){
  const ordered=[state.preferredLibre,...LIBRE_INSTANCES].filter((v,i,a)=>v&&a.indexOf(v)===i);
  let lastErr=null;
  for(const base of ordered){
    for(const target of ['zh','zh-CN']){
      try{
        const r=await fetchWithTimeout(`${base}/translate`,{
          method:'POST',cache:'no-store',credentials:'omit',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({q:text,source:'en',target,format:'text'})
        },7000);
        if(!r.ok)throw new Error(`${new URL(base).hostname} ${r.status}`);
        const j=await r.json();const out=textValue(j?.translatedText).trim();
        if(!validTranslation(text,out))throw new Error(`${new URL(base).hostname} empty`);
        state.preferredLibre=base;localStorage.setItem('cl-libre-provider',base);
        state.lastProvider=`LibreTranslate · ${new URL(base).hostname}`;state.lastError='';
        return out;
      }catch(e){lastErr=e}
    }
  }
  throw lastErr||new Error('LibreTranslate unavailable');
}
async function myMemoryTranslate(text){
  let result='';
  for(const chunk of byteChunks(text)){
    const u=new URL(MM_API);u.searchParams.set('q',chunk);u.searchParams.set('langpair','en|zh-CN');
    const r=await fetchWithTimeout(u.toString(),{cache:'no-store',credentials:'omit'},7000);
    if(!r.ok)throw new Error(`MyMemory ${r.status}`);
    const j=await r.json();
    if(j?.responseStatus&&Number(j.responseStatus)>=400)throw new Error(`MyMemory ${j.responseStatus}`);
    const out=textValue(j?.responseData?.translatedText).trim();
    if(!out)throw new Error('MyMemory empty');
    result+=out;
  }
  if(!validTranslation(text,result))throw new Error('MyMemory 没有返回中文');
  state.lastProvider='MyMemory';state.lastError='';return result;
}
async function translateText(value){
  const text=textValue(value).trim();
  if(!text||text.length<2||!hasEnglish(text))return text;
  if(state.cache.has(text))return state.cache.get(text);
  let out='';let errors=[];
  try{out=await libreTranslate(text)}catch(e){errors.push(e?.message||String(e))}
  if(!out){try{out=await myMemoryTranslate(text)}catch(e){errors.push(e?.message||String(e))}}
  out=textValue(out).trim();
  if(!validTranslation(text,out)){
    state.lastError=errors.join(' / ')||'没有可用翻译服务';
    throw new Error(state.lastError);
  }
  state.cache.set(text,out);saveCache();return out;
}
async function mapLimit(items,limit,fn,fallback){
  const ret=new Array(items.length);let cursor=0;
  const workers=Array.from({length:Math.min(limit,Math.max(1,items.length))},async()=>{
    while(cursor<items.length){const idx=cursor++;try{ret[idx]=await fn(items[idx],idx)}catch(e){ret[idx]=fallback?fallback(items[idx],idx,e):null}}
  });
  await Promise.all(workers);return ret;
}
async function translateArticleCards(items,{descriptions=true,onProgress}={}){
  const titles=await mapLimit(items,2,async(a,i)=>{const t=await translateText(a.title);if(onProgress)onProgress(i,t);return t},a=>a.title);
  items.forEach((a,i)=>a._zhTitle=textValue(titles[i])||a.title);
  if(!descriptions)return;
  const targets=items.slice(0,8);
  const descs=await mapLimit(targets,1,a=>translateText(a.description||''),a=>a.description||'');
  targets.forEach((a,i)=>a._zhDesc=textValue(descs[i])||a.description||'');
}

async function loadArticles(){
  const status=$('#status');status.textContent='正在读取 DEV 内容…';
  try{
    const endpoint=state.feed==='latest'?`${DEV_API}/articles/latest?per_page=16`:`${DEV_API}/articles?per_page=16`;
    const r=await fetch(endpoint,{headers:{Accept:'application/vnd.forem.api-v1+json'},cache:'no-store'});if(!r.ok)throw new Error('DEV API 请求失败');
    const raw=await r.json();state.articles=Array.isArray(raw)?raw.map(normalizeArticle):[];renderHomeArticles();
    status.textContent='正在翻译标题…';
    let done=0;
    const titles=await mapLimit(state.articles,2,async(a,i)=>{const t=await translateText(a.title);done++;a._zhTitle=t;if(done===1||done%4===0){renderHomeArticles();status.textContent=`正在翻译标题… ${done}/${state.articles.length}`};return t},a=>a.title);
    state.articles.forEach((a,i)=>a._zhTitle=textValue(titles[i])||a.title);
    renderHomeArticles();
    const targets=state.articles.slice(0,8);
    status.textContent='标题已中文化，正在翻译摘要…';
    const descs=await mapLimit(targets,1,a=>translateText(a.description||''),a=>a.description||'');
    targets.forEach((a,i)=>a._zhDesc=textValue(descs[i])||a.description||'');renderHomeArticles();
    status.textContent=`${state.feed==='latest'?'DEV 最新内容':'DEV 发现'} · 已中文化 · ${state.lastProvider||'缓存'}`;
  }catch(e){
    renderHomeArticles();
    status.textContent=`翻译服务不可用：${state.lastError||e.message}。已保留英文，点刷新可重试。`;
  }
}
function renderHomeArticles(){
  const root=$('#articleList');root.innerHTML='';
  for(const a of state.articles){
    const c=document.createElement('article');c.className='feed-card';const cover=a.cover_image||a.social_image||'';
    c.innerHTML=`<div class="feed-author"><span>${esc(a.user?.name||a.user?.username||'DEV')}</span><span>${fmtDate(a.published_at)}</span></div>${cover?`<img class="feed-cover" src="${esc(cover)}" alt="" loading="lazy" />`:''}<div class="feed-body"><h2>${esc(currentTitle(a))}</h2>${currentDesc(a)?`<p>${esc(currentDesc(a))}</p>`:''}<div class="tagline">${(a.tag_list||[]).slice(0,4).map(t=>`<span class="tag">#${esc(t)}</span>`).join('')}</div><div class="feed-stats"><span>♡ ${a.positive_reactions_count||0}</span><span>◯ ${a.comments_count||0}</span></div></div>`;
    c.addEventListener('click',()=>openArticle(a));root.appendChild(c);
  }
}
function renderMyArticles(){
  const root=$('#myArticleList');root.innerHTML='';
  if(!state.myArticles.length){root.innerHTML='<div class="empty-state">还没有公开文章。</div>';return}
  for(const a of state.myArticles){
    const c=document.createElement('article');c.className='my-article-card';
    const editUrl=a.path?`https://dev.to${a.path}/edit`:'https://dev.to/dashboard';
    c.innerHTML=`<h2>${esc(currentTitle(a))}</h2><div class="my-meta">已发布：${fmtDate(a.published_at)} <span>语言：English</span></div><div class="my-actions"><span>♡ ${a.positive_reactions_count||0}</span><span>◯ ${a.comments_count||0}</span><a href="https://dev.to/dashboard" target="_blank" rel="noopener">管理</a><a href="${esc(editUrl)}" target="_blank" rel="noopener">编辑</a></div>`;
    c.addEventListener('click',()=>openArticle(a));c.querySelectorAll('a').forEach(el=>el.addEventListener('click',e=>e.stopPropagation()));root.appendChild(c);
  }
}

async function openArticle(a){
  state.currentArticle=a;const reader=$('#reader'),content=$('#readerContent');
  reader.classList.remove('hidden');reader.setAttribute('aria-hidden','false');content.innerHTML=`<h1>${esc(currentTitle(a))}</h1><p class="muted">正在读取正文并翻译…</p>`;
  try{
    const r=await fetch(`${DEV_API}/articles/${a.id}`,{headers:{Accept:'application/vnd.forem.api-v1+json'},cache:'no-store'});if(!r.ok)throw new Error('正文读取失败');
    const d=normalizeArticle(await r.json());state.currentArticle={...a,...d};
    content.innerHTML=`<div class="reader-author">${esc(d.user?.name||'DEV')} · ${fmtDate(d.published_at)}</div><h1 data-original="${esc(d.title)}">${esc(state.showChinese?(textValue(a._zhTitle)||d.title):d.title)}</h1>${d.body_html||''}`;
    if(state.showChinese)await translateDom(content);
  }catch(e){content.innerHTML+=`<p>读取/翻译失败：${esc(state.lastError||e.message)}</p>`}
}
async function translateDom(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){const p=n.parentElement;if(!p||['SCRIPT','STYLE','PRE','CODE','KBD','SAMP','SVG','BUTTON'].includes(p.tagName))return NodeFilter.FILTER_REJECT;const t=n.nodeValue.trim();return hasEnglish(t)&&t.length>2?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  await mapLimit(nodes,1,async n=>{if(!n.parentElement.dataset.originalText)n.parentElement.dataset.originalText=n.nodeValue;const t=await translateText(n.nodeValue);if(t)n.nodeValue=t;return t},n=>n.nodeValue);
}
function setLanguage(chinese){
  state.showChinese=chinese;localStorage.setItem('cl-language',chinese?'zh':'en');$('#langToggle').textContent=chinese?'中文':'EN';$('#readerLang').textContent=chinese?'中文':'EN';
  if(!$('#reader').classList.contains('hidden')){const c=$('#readerContent');if(chinese)translateDom(c);else{for(const el of c.querySelectorAll('[data-original-text]'))el.textContent=el.dataset.originalText;const h=c.querySelector('h1[data-original]');if(h)h.textContent=h.dataset.original}}
  renderHomeArticles();if(state.myArticles.length)renderMyArticles();
}

async function loadMe(){
  const username=(state.username||'').trim().replace(/^@/,'');
  if(!username){$('#meSetup').classList.remove('hidden');$('#meContent').classList.add('hidden');return}
  $('#meSetup').classList.add('hidden');$('#meContent').classList.remove('hidden');$('#meStatus').textContent='正在读取我的 DEV…';
  try{
    const articlesUrl=`${DEV_API}/articles?username=${encodeURIComponent(username)}&per_page=100`;
    const profileUrl=`${DEV_API}/users/by_username?url=${encodeURIComponent(username)}`;
    const [articlesRes,userRes]=await Promise.all([fetch(articlesUrl,{cache:'no-store'}),fetch(profileUrl,{cache:'no-store'})]);
    if(!articlesRes.ok)throw new Error('读取我的文章失败');
    const raw=await articlesRes.json();if(!Array.isArray(raw)||!raw.length)throw new Error(`找不到 DEV 用户 @${username} 的公开文章`);
    state.myArticles=raw.map(normalizeArticle).sort((a,b)=>new Date(b.published_at)-new Date(a.published_at));
    let user=userRes.ok?await userRes.json():null;
    if(!user||typeof user!=='object'||Array.isArray(user)){const au=state.myArticles[0].user||{};user={username:au.username||username,name:au.name||username,profile_image:au.profile_image_90||au.profile_image||''}}
    $('#profileCard').innerHTML=`<div class="profile-top">${user.profile_image?`<img class="avatar" src="${esc(user.profile_image)}" alt="" />`:''}<div class="profile-id"><h2>${esc(user.name||username)}</h2><div class="muted">@${esc(user.username||username)}</div></div></div>`;
    renderMyArticles();$('#meStatus').textContent='正在翻译我的文章标题…';let done=0;
    const titles=await mapLimit(state.myArticles,1,async(a,i)=>{const t=await translateText(a.title);state.myArticles[i]._zhTitle=t;done++;if(done===1||done%5===0){renderMyArticles();$('#meStatus').textContent=`正在翻译我的文章标题… ${done}/${state.myArticles.length}`};return t},a=>a.title);
    state.myArticles.forEach((a,i)=>a._zhTitle=textValue(titles[i])||a.title);
    renderMyArticles();$('#meStatus').textContent=`${state.myArticles.length} 篇公开文章 · 已中文化 · ${state.lastProvider||'缓存'}`;
  }catch(e){
    renderMyArticles();$('#meStatus').textContent=`翻译服务不可用：${state.lastError||e.message}`;
  }
}

function switchView(viewId,title){$$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===viewId));$$('.view').forEach(v=>v.classList.toggle('active',v.id===viewId));$('#pageTitle').textContent=title||'DEV 中文';if(viewId==='meView')loadMe()}
$('#langToggle').addEventListener('click',()=>setLanguage(!state.showChinese));
$('#readerLang').addEventListener('click',()=>setLanguage(!state.showChinese));
$('#readerBack').addEventListener('click',()=>{$('#reader').classList.add('hidden');$('#reader').setAttribute('aria-hidden','true')});
$('#openOriginal').addEventListener('click',()=>{const u=state.currentArticle?.url||state.currentArticle?.canonical_url;if(u)window.open(u,'_blank','noopener')});
$('#saveUsername').addEventListener('click',()=>{const v=$('#devUsername').value.trim().replace(/^@/,'');if(!v)return;state.username=v;localStorage.setItem('cl-dev-username',v);loadMe()});
$('#changeUsername').addEventListener('click',()=>{state.username='';localStorage.removeItem('cl-dev-username');$('#devUsername').value='';$('#meContent').classList.add('hidden');$('#meSetup').classList.remove('hidden')});
$$('.feed-tab').forEach(b=>b.addEventListener('click',()=>{$$('.feed-tab').forEach(x=>x.classList.toggle('active',x===b));state.feed=b.dataset.feed;loadArticles()}));
$$('.nav-btn').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view,b.dataset.title)));
$('#updateNow').addEventListener('click',forceUpdate);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkForUpdate()});setInterval(checkForUpdate,120000);
$('#versionBadge').textContent=`v${APP_VERSION}`;$('#langToggle').textContent=state.showChinese?'中文':'EN';$('#readerLang').textContent=state.showChinese?'中文':'EN';checkForUpdate();loadArticles();
