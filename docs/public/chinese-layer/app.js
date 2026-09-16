const APP_VERSION='0.2.0';
const DEV_API='https://dev.to/api';
const MM_API='https://api.mymemory.translated.net/get';
let remoteVersion=APP_VERSION;
const savedUsername=localStorage.getItem('cl-dev-username')||'';
const validSavedUsername=/^[A-Za-z0-9_-]+$/.test(savedUsername)?savedUsername:'';
const state={
  articles:[],
  myArticles:[],
  currentArticle:null,
  feed:'popular',
  showChinese:localStorage.getItem('cl-language')!=='en',
  cache:new Map(JSON.parse(localStorage.getItem('cl-cache')||'[]')),
  protectTerms:true,
  username:validSavedUsername||'joinwell52'
};
if(!validSavedUsername)localStorage.setItem('cl-dev-username','joinwell52');
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const TECH=['Agent','MCP','API','GitHub','runtime','Runtime','commit','PR','Python','Swift','JavaScript','TypeScript','Next.js','React','LLM','AI','OpenAI','GPT','repository','repo','HTTP','JSON','OAuth','CLI','SDK','npm','Node.js','DEV','Forem'];

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
    if(previous&&previous!==APP_VERSION){
      showUpdateBanner(`已更新到 v${APP_VERSION}`,'知道了');
    }
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

function saveCache(){try{localStorage.setItem('cl-cache',JSON.stringify([...state.cache].slice(-800)))}catch{}}
function protect(text){
  if(!state.protectTerms)return{text,map:[]};
  let out=text,map=[];
  TECH.forEach((term,i)=>{
    if(!out.includes(term))return;
    const key=`__CL_${i}_${map.length}__`;
    out=out.split(term).join(key);
    map.push([key,term]);
  });
  return{text:out,map};
}
function restore(text,map){let out=text;for(const [k,v] of map)out=out.split(k).join(v);return out}
function byteChunks(text,max=430){
  const out=[];let cur='';
  for(const ch of text){const next=cur+ch;if(new Blob([next]).size>max){if(cur)out.push(cur);cur=ch}else cur=next}
  if(cur)out.push(cur);return out;
}
async function translateText(text){
  text=(text||'').trim();
  if(!text||text.length<2)return text;
  if(state.cache.has(text))return state.cache.get(text);
  const {text:masked,map}=protect(text);
  let result='';
  for(const chunk of byteChunks(masked)){
    const u=new URL(MM_API);
    u.searchParams.set('q',chunk);
    u.searchParams.set('langpair','en|zh-CN');
    const r=await fetch(u);
    if(!r.ok)throw new Error('翻译服务暂时不可用');
    const j=await r.json();
    result+=j?.responseData?.translatedText||chunk;
  }
  result=restore(result,map);
  state.cache.set(text,result);saveCache();return result;
}
async function mapLimit(items,limit,fn){
  const ret=[];let i=0;
  const workers=Array.from({length:Math.min(limit,Math.max(1,items.length))},async()=>{
    while(i<items.length){const idx=i++;try{ret[idx]=await fn(items[idx],idx)}catch{ret[idx]=items[idx]}}
  });
  await Promise.all(workers);return ret;
}
function fmtDate(s){try{return new Intl.DateTimeFormat('zh-CN',{month:'numeric',day:'numeric'}).format(new Date(s))}catch{return''}}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function currentTitle(a){return state.showChinese?(a._zhTitle||a.title):a.title}
function currentDesc(a){return state.showChinese?(a._zhDesc||a.description||''):(a.description||'')}

async function translateArticleCards(items){
  const titles=await mapLimit(items,3,a=>translateText(a.title));
  items.forEach((a,i)=>a._zhTitle=titles[i]);
  const descTargets=items.slice(0,12);
  const descs=await mapLimit(descTargets,2,a=>translateText(a.description||''));
  descTargets.forEach((a,i)=>a._zhDesc=descs[i]);
}

async function loadArticles(){
  const status=$('#status');
  status.textContent='正在读取 DEV 内容…';
  try{
    const endpoint=state.feed==='latest'?`${DEV_API}/articles/latest?per_page=16`:`${DEV_API}/articles?per_page=16`;
    const r=await fetch(endpoint,{headers:{Accept:'application/vnd.forem.api-v1+json'}});
    if(!r.ok)throw new Error('DEV API 请求失败');
    state.articles=await r.json();
    status.textContent='正在翻译…';
    await translateArticleCards(state.articles);
    renderHomeArticles();
    status.textContent=state.feed==='latest'?'DEV 最新内容 · 已中文化':'DEV 发现 · 已中文化';
  }catch(e){status.textContent=`载入失败：${e.message}`}
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
    c.addEventListener('click',()=>openArticle(a));root.appendChild(c);
  }
}

function renderMyArticles(){
  const root=$('#myArticleList');root.innerHTML='';
  if(!state.myArticles.length){root.innerHTML='<div class="empty-state">还没有公开文章。</div>';return}
  for(const a of state.myArticles){
    const c=document.createElement('article');c.className='my-article-card';
    const editUrl=`https://dev.to${a.path||''}/edit`;
    c.innerHTML=`
      <h2>${esc(currentTitle(a))}</h2>
      <div class="my-meta">已发布：${fmtDate(a.published_at)} <span>语言：English</span></div>
      <div class="my-actions"><span>♡ ${a.positive_reactions_count||0}</span><span>◯ ${a.comments_count||0}</span><span>◉ ${a.public_reactions_count||a.positive_reactions_count||0}</span><a href="https://dev.to/dashboard" target="_blank" rel="noopener">管理</a><a href="${esc(editUrl)}" target="_blank" rel="noopener">编辑</a></div>`;
    c.addEventListener('click',()=>openArticle(a));
    c.querySelectorAll('a').forEach(ael=>ael.addEventListener('click',e=>e.stopPropagation()));
    root.appendChild(c);
  }
}

async function openArticle(a){
  state.currentArticle=a;
  const reader=$('#reader'),content=$('#readerContent');
  reader.classList.remove('hidden');reader.setAttribute('aria-hidden','false');
  content.innerHTML=`<h1>${esc(currentTitle(a))}</h1><p class="muted">正在读取正文…</p>`;
  try{
    const r=await fetch(`${DEV_API}/articles/${a.id}`,{headers:{Accept:'application/vnd.forem.api-v1+json'}});
    if(!r.ok)throw new Error('正文读取失败');
    const d=await r.json();state.currentArticle={...a,...d};
    content.innerHTML=`<div class="reader-author">${esc(d.user?.name||'DEV')} · ${fmtDate(d.published_at)}</div><h1 data-original="${esc(d.title)}">${esc(state.showChinese?(a._zhTitle||d.title):d.title)}</h1>${d.body_html||''}`;
    if(state.showChinese)await translateDom(content);
  }catch(e){content.innerHTML+=`<p>${esc(e.message)}</p>`}
}

async function translateDom(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){
    const p=n.parentElement;
    if(!p||['SCRIPT','STYLE','PRE','CODE','KBD','SAMP','SVG','BUTTON'].includes(p.tagName))return NodeFilter.FILTER_REJECT;
    const t=n.nodeValue.trim();
    return /[A-Za-z]{3}/.test(t)&&t.length>2?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
  }});
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  await mapLimit(nodes,3,async n=>{
    if(!n.parentElement.dataset.originalText)n.parentElement.dataset.originalText=n.nodeValue;
    try{n.nodeValue=await translateText(n.nodeValue)}catch{}
  });
}

function setLanguage(chinese){
  state.showChinese=chinese;localStorage.setItem('cl-language',chinese?'zh':'en');
  $('#langToggle').textContent=chinese?'中文':'EN';$('#readerLang').textContent=chinese?'中文':'EN';
  if(!$('#reader').classList.contains('hidden')){
    const c=$('#readerContent');
    if(chinese){translateDom(c)}else{
      for(const el of c.querySelectorAll('[data-original-text]'))el.textContent=el.dataset.originalText;
      const h=c.querySelector('h1[data-original]');if(h)h.textContent=h.dataset.original;
    }
  }
  renderHomeArticles();if(state.myArticles.length)renderMyArticles();
}

async function loadMe(){
  const username=(state.username||'').trim().replace(/^@/,'');
  if(!username){$('#meSetup').classList.remove('hidden');$('#meContent').classList.add('hidden');return}
  $('#meSetup').classList.add('hidden');$('#meContent').classList.remove('hidden');$('#meStatus').textContent='正在读取我的 DEV…';
  try{
    const profileUrl=`${DEV_API}/users/by_username?url=${encodeURIComponent(username)}`;
    const articlesUrl=`${DEV_API}/articles?username=${encodeURIComponent(username)}&per_page=100`;
    const [userRes,articlesRes]=await Promise.all([fetch(profileUrl),fetch(articlesUrl)]);
    const articles=articlesRes.ok?await articlesRes.json():[];
    if(!userRes.ok && !articles.length)throw new Error(`找不到 DEV 用户 @${username}`);
    let user=userRes.ok?await userRes.json():null;
    if(!user && articles.length){
      const au=articles[0].user||{};
      user={username:au.username||username,name:au.name||username,profile_image:au.profile_image_90||au.profile_image||'',summary:'',location:'',joined_at:''};
    }
    state.myArticles=articles;
    const summaryZh=user?.summary?await translateText(user.summary).catch(()=>user.summary):'';
    $('#profileCard').innerHTML=`<div class="profile-top">${user?.profile_image?`<img class="avatar" src="${esc(user.profile_image)}" alt="" />`:''}<div class="profile-id"><h2>${esc(user?.name||username)}</h2><div class="muted">@${esc(user?.username||username)}</div></div></div>${summaryZh?`<p>${esc(state.showChinese?summaryZh:user.summary)}</p>`:''}<div class="profile-facts">${user?.location?`<span>${esc(user.location)}</span>`:''}${user?.joined_at?`<span>加入 ${esc(user.joined_at)}</span>`:''}</div>`;
    $('#meStatus').textContent='正在翻译我的文章…';
    await translateArticleCards(state.myArticles);renderMyArticles();
    $('#meStatus').textContent=`${state.myArticles.length} 篇公开文章 · 最近创建优先`;
  }catch(e){$('#meStatus').textContent=e.message;$('#profileCard').innerHTML='';$('#myArticleList').innerHTML=''}
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
$('#langToggle').textContent=state.showChinese?'中文':'EN';$('#readerLang').textContent=state.showChinese?'中文':'EN';
checkForUpdate();
loadArticles();
