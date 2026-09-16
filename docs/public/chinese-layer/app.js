const DEV_API='https://dev.to/api';
const MM_API='https://api.mymemory.translated.net/get';
const state={
  articles:[],
  myArticles:[],
  currentArticle:null,
  feed:'popular',
  showChinese:localStorage.getItem('cl-language')!=='en',
  cache:new Map(JSON.parse(localStorage.getItem('cl-cache')||'[]')),
  protectTerms:localStorage.getItem('cl-protect-terms')!=='0',
  username:localStorage.getItem('cl-dev-username')||''
};
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const TECH=['Agent','MCP','API','GitHub','runtime','Runtime','commit','PR','Python','Swift','JavaScript','TypeScript','Next.js','React','LLM','AI','OpenAI','GPT','repository','repo','HTTP','JSON','OAuth','CLI','SDK','npm','Node.js','DEV','Forem'];

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
  const descTargets=items.slice(0,10);
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
    status.textContent='正在翻译标题…';
    await translateArticleCards(state.articles);
    renderArticles(state.articles,$('#articleList'));
    status.textContent=state.feed==='latest'?'DEV 最新内容 · 已中文化':'DEV 热门内容 · 已中文化';
  }catch(e){status.textContent=`载入失败：${e.message}。可稍后重试。`}
}

function renderArticles(items,root){
  root.innerHTML='';
  if(!items.length){root.innerHTML='<div class="empty-state">这里还没有文章。</div>';return}
  for(const a of items){
    const c=document.createElement('article');
    c.className='article-card';
    const author=a.user?.username||'';
    c.innerHTML=`
      <div class="article-meta">
        <button class="author-link" data-author="${esc(author)}">${esc(a.user?.name||author||'DEV')}</button>
        <span>${fmtDate(a.published_at)}</span>
      </div>
      <h2 class="article-title">${esc(currentTitle(a))}</h2>
      <p class="article-desc">${esc(currentDesc(a))}</p>
      <div class="tagline">${(a.tag_list||[]).slice(0,4).map(t=>`<span class="tag">#${esc(t)}</span>`).join('')}</div>`;
    c.addEventListener('click',()=>openArticle(a));
    const authorBtn=c.querySelector('.author-link');
    if(authorBtn&&author){authorBtn.addEventListener('click',e=>{e.stopPropagation();openPublicProfile(author)})}
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
    const d=await r.json();
    state.currentArticle={...a,...d};
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

function setReaderLanguage(chinese){
  state.showChinese=chinese;
  localStorage.setItem('cl-language',chinese?'zh':'en');
  $('#readerLang').textContent=chinese?'中文':'EN';
  $('#langToggle').textContent=chinese?'中文':'EN';
  $('#defaultChinese').checked=chinese;
  const c=$('#readerContent');
  if(!$('#reader').classList.contains('hidden')){
    if(chinese){translateDom(c)}else{
      for(const el of c.querySelectorAll('[data-original-text]'))el.textContent=el.dataset.originalText;
      const h=c.querySelector('h1[data-original]');if(h)h.textContent=h.dataset.original;
    }
  }
  renderArticles(state.articles,$('#articleList'));
  if(state.myArticles.length)renderArticles(state.myArticles,$('#myArticleList'));
}

async function openPublicProfile(username){
  state.username=username;
  localStorage.setItem('cl-dev-username',username);
  switchView('meView','我的 DEV');
  await loadMe();
}

async function loadMe(){
  const username=(state.username||'').trim().replace(/^@/,'');
  if(!username){
    $('#meSetup').classList.remove('hidden');$('#meContent').classList.add('hidden');return;
  }
  $('#meSetup').classList.add('hidden');$('#meContent').classList.remove('hidden');
  $('#meStatus').textContent='正在读取你的 DEV 公开主页…';
  try{
    const [userRes,articlesRes]=await Promise.all([
      fetch(`${DEV_API}/users/${encodeURIComponent(username)}`,{headers:{Accept:'application/vnd.forem.api-v1+json'}}),
      fetch(`${DEV_API}/articles?username=${encodeURIComponent(username)}&per_page=30`,{headers:{Accept:'application/vnd.forem.api-v1+json'}})
    ]);
    if(!userRes.ok)throw new Error('找不到这个 DEV 用户名');
    const user=await userRes.json();
    const articles=articlesRes.ok?await articlesRes.json():[];
    state.myArticles=articles;
    const summaryZh=user.summary?await translateText(user.summary).catch(()=>user.summary):'';
    $('#profileCard').innerHTML=`
      <div class="profile-top">
        ${user.profile_image?`<img class="avatar" src="${esc(user.profile_image)}" alt="" />`:''}
        <div class="profile-id"><h2>${esc(user.name||user.username)}</h2><div class="muted">@${esc(user.username)}</div></div>
      </div>
      ${summaryZh?`<p>${esc(state.showChinese?summaryZh:user.summary)}</p>`:''}
      <div class="profile-facts">${user.location?`<span>${esc(user.location)}</span>`:''}${user.joined_at?`<span>加入 ${esc(user.joined_at)}</span>`:''}</div>
      <a class="profile-open" href="https://dev.to/${encodeURIComponent(user.username)}" target="_blank" rel="noopener">在 DEV 原站打开</a>`;
    $('#meStatus').textContent='正在翻译我的文章…';
    await translateArticleCards(state.myArticles);
    renderArticles(state.myArticles,$('#myArticleList'));
    $('#meStatus').textContent=`@${user.username} · ${state.myArticles.length} 篇公开文章`;
  }catch(e){
    $('#meStatus').textContent=e.message;
    $('#profileCard').innerHTML='';$('#myArticleList').innerHTML='';
  }
}

function switchView(viewId,title){
  $$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===viewId));
  $$('.view').forEach(v=>v.classList.toggle('active',v.id===viewId));
  $('#pageTitle').textContent=title||'DEV 中文层';
  if(viewId==='meView')loadMe();
}

$('#refreshBtn').addEventListener('click',loadArticles);
$('#langToggle').addEventListener('click',()=>setReaderLanguage(!state.showChinese));
$('#readerLang').addEventListener('click',()=>setReaderLanguage(!state.showChinese));
$('#readerBack').addEventListener('click',()=>{$('#reader').classList.add('hidden');$('#reader').setAttribute('aria-hidden','true')});
$('#openOriginal').addEventListener('click',()=>{const u=state.currentArticle?.url||state.currentArticle?.canonical_url;if(u)window.open(u,'_blank','noopener')});
$('#protectTerms').checked=state.protectTerms;
$('#protectTerms').addEventListener('change',e=>{state.protectTerms=e.target.checked;localStorage.setItem('cl-protect-terms',e.target.checked?'1':'0')});
$('#defaultChinese').checked=state.showChinese;
$('#defaultChinese').addEventListener('change',e=>setReaderLanguage(e.target.checked));
$('#saveUsername').addEventListener('click',()=>{
  const v=$('#devUsername').value.trim().replace(/^@/,'');
  if(!v)return;
  state.username=v;localStorage.setItem('cl-dev-username',v);loadMe();
});
$('#changeUsername').addEventListener('click',()=>{
  state.username='';localStorage.removeItem('cl-dev-username');$('#devUsername').value='';
  $('#meContent').classList.add('hidden');$('#meSetup').classList.remove('hidden');
});
$$('.feed-tab').forEach(b=>b.addEventListener('click',()=>{
  $$('.feed-tab').forEach(x=>x.classList.toggle('active',x===b));state.feed=b.dataset.feed;loadArticles();
}));
$$('.nav-btn').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view,b.dataset.title)));

$('#langToggle').textContent=state.showChinese?'中文':'EN';
$('#readerLang').textContent=state.showChinese?'中文':'EN';
loadArticles();
