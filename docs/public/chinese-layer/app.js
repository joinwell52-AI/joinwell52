const APP_VERSION='0.2.2';
const DEV_API='https://dev.to/api';
const GOOGLE_API='https://translate.googleapis.com/translate_a/single';
const MM_API='https://api.mymemory.translated.net/get';
const CACHE_KEY=`cl-cache-${APP_VERSION}`;
let remoteVersion=APP_VERSION;

const savedUsername=localStorage.getItem('cl-dev-username')||'';
const validSavedUsername=/^[A-Za-z0-9_-]+$/.test(savedUsername)?savedUsername:'';
const state={
  articles:[],
  myArticles:[],
  currentArticle:null,
  feed:'popular',
  showChinese:localStorage.getItem('cl-language')!=='en',
  cache:new Map(JSON.parse(localStorage.getItem(CACHE_KEY)||'[]')),
  username:validSavedUsername||'joinwell52',
  lastProvider:''
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
  const banner=$('#updateBanner');
  if(!banner)return;
  $('#updateText').textContent=text;
  $('#updateNow').textContent=buttonText;
  banner.classList.remove('hidden');
}
function hideUpdateBanner(){const b=$('#updateBanner');if(b)b.classList.add('hidden')}
async function checkForUpdate(){
  try{
    const r=await fetch(`./version.json?ts=${Date.now()}`,{cache:'no-store'});
    if(!r.ok)return;
    const meta=await r.json();
    remoteVersion=String(meta.version||APP_VERSION);
    if(isNewerVersion(remoteVersion,APP_VERSION)){
      showUpdateBanner(`发现新版本 v${remoteVersion}`,'立即更新');
      return;
    }
    const previous=localStorage.getItem('cl-last-app-version');
    if(previous&&previous!==APP_VERSION)showUpdateBanner(`已更新到 v${APP_VERSION}`,'知道了');
    localStorage.setItem('cl-last-app-version',APP_VERSION);
  }catch{}
}
function forceUpdate(){
  if(!isNewerVersion(remoteVersion,APP_VERSION)){hideUpdateBanner();return}
  const u=new URL(location.href);
  u.searchParams.set('version',remoteVersion);
  u.searchParams.set('_',Date.now());
  location.replace(u.toString());
}

function textValue(value){
  if(typeof value==='string')return value;
  if(value==null)return '';
  if(typeof value==='number'||typeof value==='boolean')return String(value);
  if(typeof value==='object'){
    for(const key of ['text','value','name','title']){
      if(typeof value[key]==='string')return value[key];
    }
    return '';
  }
  return '';
}
function titleOf(a){return textValue(a?.title)}
function descOf(a){return textValue(a?.description)}
function saveCache(){try{localStorage.setItem(CACHE_KEY,JSON.stringify([...state.cache].slice(-1200)))}catch{}}
function hasEnglish(text){return /[A-Za-z]{2}/.test(text)}
function hasChinese(text){return /[\u3400-\u9fff]/.test(text)}
function byteChunks(text,max=1200){
  const out=[];let cur='';
  for(const ch of String(text||'')){
    const next=cur+ch;
    if(new Blob([next]).size>max){if(cur)out.push(cur);cur=ch}else cur=next;
  }
  if(cur)out.push(cur);
  return out;
}
async function googleTranslate(text){
  const u=new URL(GOOGLE_API);
  u.searchParams.set('client','gtx');
  u.searchParams.set('sl','en');
  u.searchParams.set('tl','zh-CN');
  u.searchParams.set('dt','t');
  u.searchParams.set('q',text);
  const r=await fetch(u,{cache:'no-store'});
  if(!r.ok)throw new Error(`Google ${r.status}`);
  const j=await r.json();
  const translated=Array.isArray(j?.[0])?j[0].map(x=>Array.isArray(x)?x[0]:'').filter(x=>typeof x==='string').join(''):'';
  if(!translated.trim())throw new Error('Google empty');
  state.lastProvider='Google';
  return translated;
}
async function myMemoryTranslate(text){
  const u=new URL(MM_API);
  u.searchParams.set('q',text);
  u.searchParams.set('langpair','en|zh-CN');
  const r=await fetch(u,{cache:'no-store'});
  if(!r.ok)throw new Error(`MyMemory ${r.status}`);
  const j=await r.json();
  const translated=j?.responseData?.translatedText;
  if(typeof translated!=='string'||!translated.trim())throw new Error('MyMemory empty');
  state.lastProvider='MyMemory';
  return translated;
}
async function translateChunk(text){
  let firstError=null;
  try{
    const out=await googleTranslate(text);
    if(out!==text&&(hasChinese(out)||!hasEnglish(out)))return out;
  }catch(e){firstError=e}
  try{
    const out=await myMemoryTranslate(text);
    if(out!==text&&(hasChinese(out)||!hasEnglish(out)))return out;
    return out;
  }catch(e){throw firstError||e}
}
async function translateText(value){
  const text=textValue(value).trim();
  if(!text||text.length<2||!hasEnglish(text))return text;
  if(state.cache.has(text))return state.cache.get(text);
  let result='';
  for(const chunk of byteChunks(text))result+=await translateChunk(chunk);
  result=textValue(result).trim();
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
      try{ret[idx]=await fn(items[idx],idx)}catch(err){ret[idx]=fallback?fallback(items[idx],idx,err):null}
    }
  });
  await Promise.all(workers);
  return ret;
}
function fmtDate(s){try{return new Intl.DateTimeFormat('zh-CN',{month:'numeric',day:'numeric'}).format(new Date(s))}catch{return''}}
function esc(s=''){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function currentTitle(a){
  const original=titleOf(a);
  const translated=textValue(a?._zhTitle);
  return state.showChinese?(translated||original):original;
}
function currentDesc(a){
  const original=descOf(a);
  const translated=textValue(a?._zhDesc);
  return state.showChinese?(translated||original):original;
}

async function translateArticleCards(items,{descriptions=true,onProgress}={}){
  const titles=await mapLimit(items,3,async(a,i)=>{
    const t=await translateText(titleOf(a));
    if(onProgress)onProgress(i,t);
    return t;
  },a=>titleOf(a));
  items.forEach((a,i)=>{a._zhTitle=textValue(titles[i])||titleOf(a)});
  if(!descriptions)return;
  const targets=items.slice(0,16);
  const descs=await mapLimit(targets,2,a=>translateText(descOf(a)),a=>descOf(a));
  targets.forEach((a,i)=>{a._zhDesc=textValue(descs[i])||descOf(a)});
}

async function loadArticles(){
  const status=$('#status');
  status.textContent='正在读取 DEV 内容…';
  try{
    const endpoint=state.feed==='latest'?`${DEV_API}/articles/latest?per_page=16`:`${DEV_API}/articles?per_page=16`;
    const r=await fetch(endpoint,{headers:{Accept:'application/vnd.forem.api-v1+json'},cache:'no-store'});
    if(!r.ok)throw new Error('DEV API 请求失败');
    state.articles=await r.json();
    renderHomeArticles();
    status.textContent='正在翻译为中文…';
    await translateArticleCards(state.articles);
    renderHomeArticles();
    status.textContent=`${state.feed==='latest'?'DEV 最新内容':'DEV 发现'} · 已中文化${state.lastProvider?` · ${state.lastProvider}`:''}`;
  }catch(e){status.textContent=`翻译/载入失败：${e.message}`}
}

function renderHomeArticles(){
  const root=$('#articleList');root.innerHTML='';
  for(const a of state.articles){
    const c=document.createElement('article');c.className='feed-card';
    const cover=a.cover_image||a.social_image||'';
    c.innerHTML=`
      <div class="feed-author"><span>${esc(a.user?.name||a.user?.username||'DEV')}</span><span>${fmtDate(a.published_at)}</span></div>
      ${cover?`<img class="feed-cover" src="${esc(cover)}" alt="" loading="lazy" />`:''}
      <div class="feed-body">
        <h2>${esc(currentTitle(a))}</h2>
        ${currentDesc(a)?`<p>${esc(currentDesc(a))}</p>`:''}
        <div class="tagline">${(a.tag_list||[]).slice(0,4).map(t=>`<span class="tag">#${esc(t)}</span>`).join('')}</div>
        <div class="feed-stats"><span>♡ ${a.positive_reactions_count||0}</span><span>◯ ${a.comments_count||0}</span></div>
      </div>`;
    c.addEventListener('click',()=>openArticle(a));
    root.appendChild(c);
  }
}

function renderMyArticles(){
  const root=$('#myArticleList');root.innerHTML='';
  if(!state.myArticles.length){root.innerHTML='<div class="empty-state">还没有公开文章。</div>';return}
  for(const a of state.myArticles){
    const c=document.createElement('article');c.className='my-article-card';
    const path=textValue(a.path);
    const editUrl=path?`https://dev.to${path}/edit`:'https://dev.to/dashboard';
    c.innerHTML=`
      <h2>${esc(currentTitle(a))}</h2>
      <div class="my-meta">已发布：${fmtDate(a.published_at)} <span>语言：English</span></div>
      <div class="my-actions"><span>♡ ${a.positive_reactions_count||0}</span><span>◯ ${a.comments_count||0}</span><a href="https://dev.to/dashboard" target="_blank" rel="noopener">管理</a><a href="${esc(editUrl)}" target="_blank" rel="noopener">编辑</a></div>`;
    c.addEventListener('click',()=>openArticle(a));
    c.querySelectorAll('a').forEach(el=>el.addEventListener('click',e=>e.stopPropagation()));
    root.appendChild(c);
  }
}

async function openArticle(a){
  state.currentArticle=a;
  const reader=$('#reader'),content=$('#readerContent');
  reader.classList.remove('hidden');reader.setAttribute('aria-hidden','false');
  content.innerHTML=`<h1>${esc(currentTitle(a))}</h1><p class="muted">正在读取正文并翻译…</p>`;
  try{
    const r=await fetch(`${DEV_API}/articles/${a.id}`,{headers:{Accept:'application/vnd.forem.api-v1+json'},cache:'no-store'});
    if(!r.ok)throw new Error('正文读取失败');
    const d=await r.json();state.currentArticle={...a,...d};
    content.innerHTML=`<div class="reader-author">${esc(d.user?.name||'DEV')} · ${fmtDate(d.published_at)}</div><h1 data-original="${esc(titleOf(d))}">${esc(state.showChinese?(textValue(a._zhTitle)||titleOf(d)):titleOf(d))}</h1>${d.body_html||''}`;
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
  await mapLimit(nodes,2,async n=>{
    if(!n.parentElement.dataset.originalText)n.parentElement.dataset.originalText=n.nodeValue;
    const translated=await translateText(n.nodeValue);
    if(translated)n.nodeValue=translated;
    return translated;
  },n=>n.nodeValue);
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
  renderHomeArticles();
  if(state.myArticles.length)renderMyArticles();
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
    const articles=await articlesRes.json();
    if(!Array.isArray(articles)||!articles.length)throw new Error(`找不到 DEV 用户 @${username} 的公开文章`);
    state.myArticles=articles.sort((a,b)=>new Date(b.published_at)-new Date(a.published_at));
    let user=userRes.ok?await userRes.json():null;
    if(!user||typeof user!=='object'||Array.isArray(user)){
      const au=state.myArticles[0].user||{};
      user={username:au.username||username,name:au.name||username,profile_image:au.profile_image_90||au.profile_image||''};
    }
    $('#profileCard').innerHTML=`<div class="profile-top">${user.profile_image?`<img class="avatar" src="${esc(user.profile_image)}" alt="" />`:''}<div class="profile-id"><h2>${esc(user.name||username)}</h2><div class="muted">@${esc(user.username||username)}</div></div></div>`;
    renderMyArticles();
    $('#meStatus').textContent='正在翻译我的文章标题…';
    let done=0;
    await translateArticleCards(state.myArticles,{descriptions:false,onProgress:(i,t)=>{
      state.myArticles[i]._zhTitle=t;
      done++;
      if(done===1||done%5===0){renderMyArticles();$('#meStatus').textContent=`正在翻译我的文章标题… ${done}/${state.myArticles.length}`}
    }});
    renderMyArticles();
    $('#meStatus').textContent=`${state.myArticles.length} 篇公开文章 · 已中文化${state.lastProvider?` · ${state.lastProvider}`:''}`;
  }catch(e){
    $('#meStatus').textContent=`读取/翻译失败：${e.message}`;
    $('#profileCard').innerHTML='';$('#myArticleList').innerHTML='';
  }
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
