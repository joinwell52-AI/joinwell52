const GMAIL_SCOPE='https://www.googleapis.com/auth/gmail.readonly';
const GMAIL_API='https://gmail.googleapis.com/gmail/v1/users/me';
const GMAIL_CLIENT_ID_KEY='cl-gmail-client-id-v1';
const MAIL_TRANSLATE_CONSENT_KEY='cl-mail-translate-consent-v1';
const MAIL_TRANSLATE_ENDPOINT='https://translate.googleapis.com/translate_a/single';

const mailState={
  token:'',
  tokenExpiresAt:0,
  tokenClient:null,
  profile:null,
  messages:[],
  current:null,
  memoryTranslations:new Map(),
  translateConsent:localStorage.getItem(MAIL_TRANSLATE_CONSENT_KEY)==='yes',
  showChinese:true,
  remoteImagesAllowed:false,
};

const mail$=s=>document.querySelector(s);
const mailEsc=(value='')=>String(value??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const mailSleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function mailClientId(){return (localStorage.getItem(GMAIL_CLIENT_ID_KEY)||'').trim()}
function setMailStatus(message){const el=mail$('#mailStatus');if(el)el.textContent=message}
function setMailSetupStatus(message){const el=mail$('#mailSetupStatus');if(el)el.textContent=message}
function mailTokenValid(){return Boolean(mailState.token&&Date.now()<mailState.tokenExpiresAt-30000)}

function waitForGoogleIdentity(timeoutMs=10000){
  if(window.google?.accounts?.oauth2)return Promise.resolve();
  return new Promise((resolve,reject)=>{
    const start=Date.now();
    const timer=setInterval(()=>{
      if(window.google?.accounts?.oauth2){clearInterval(timer);resolve();return}
      if(Date.now()-start>timeoutMs){clearInterval(timer);reject(new Error('Google 登录组件载入失败'))}
    },120);
  });
}

function buildTokenClient(clientId){
  mailState.tokenClient=google.accounts.oauth2.initTokenClient({
    client_id:clientId,
    scope:GMAIL_SCOPE,
    callback:()=>{},
  });
  return mailState.tokenClient;
}

async function connectGmail(){
  const input=mail$('#gmailClientId');
  const clientId=(input?.value||mailClientId()).trim();
  if(!clientId){setMailSetupStatus('请先填写 Google OAuth Client ID。');input?.focus();return}
  if(!/\.apps\.googleusercontent\.com$/i.test(clientId)){setMailSetupStatus('Client ID 格式不正确，应以 .apps.googleusercontent.com 结尾。');return}
  localStorage.setItem(GMAIL_CLIENT_ID_KEY,clientId);
  const consent=Boolean(mail$('#mailTranslateConsent')?.checked);
  mailState.translateConsent=consent;
  localStorage.setItem(MAIL_TRANSLATE_CONSENT_KEY,consent?'yes':'no');
  setMailSetupStatus('正在打开 Google 授权…');
  try{
    await waitForGoogleIdentity();
    const client=buildTokenClient(clientId);
    client.callback=async response=>{
      if(response?.error){setMailSetupStatus(`Google 授权失败：${response.error}`);return}
      mailState.token=response.access_token||'';
      mailState.tokenExpiresAt=Date.now()+(Number(response.expires_in||3600)*1000);
      if(!mailState.token){setMailSetupStatus('Google 没有返回访问令牌。');return}
      setMailSetupStatus('授权成功，正在读取收件箱…');
      await showMailInbox();
    };
    client.requestAccessToken({prompt:'consent'});
  }catch(error){setMailSetupStatus(error?.message||String(error))}
}

async function gmailFetch(path,options={}){
  if(!mailTokenValid())throw new Error('Gmail 授权已过期，请重新连接。');
  const url=path.startsWith('http')?path:`${GMAIL_API}${path}`;
  const response=await fetch(url,{
    ...options,
    cache:'no-store',
    headers:{...(options.headers||{}),Authorization:`Bearer ${mailState.token}`},
  });
  if(response.status===401){mailState.token='';mailState.tokenExpiresAt=0;throw new Error('Gmail 授权已过期，请重新连接。')}
  if(!response.ok){const text=await response.text();throw new Error(`Gmail API ${response.status}: ${text.slice(0,120)}`)}
  return await response.json();
}

function headerValue(message,name){
  const headers=message?.payload?.headers||[];
  return String(headers.find(h=>String(h?.name||'').toLowerCase()===name.toLowerCase())?.value||'');
}

function formatMailDate(message){
  const value=Number(message?.internalDate||0);
  if(!value)return '';
  const date=new Date(value);
  const now=new Date();
  const sameDay=date.toDateString()===now.toDateString();
  return new Intl.DateTimeFormat('zh-CN',sameDay?{hour:'2-digit',minute:'2-digit'}:{month:'numeric',day:'numeric'}).format(date);
}

function normalizeMailMetadata(message){
  return {
    id:String(message?.id||''),
    threadId:String(message?.threadId||''),
    subject:headerValue(message,'Subject')||'(无主题)',
    from:headerValue(message,'From')||'(未知发件人)',
    to:headerValue(message,'To'),
    date:headerValue(message,'Date'),
    internalDate:String(message?.internalDate||''),
    snippet:String(message?.snippet||''),
    unread:Array.isArray(message?.labelIds)&&message.labelIds.includes('UNREAD'),
    labelIds:Array.isArray(message?.labelIds)?message.labelIds:[],
  };
}

async function mapMailLimit(items,limit,fn){
  const out=new Array(items.length);let cursor=0;
  const workers=Array.from({length:Math.min(limit,Math.max(1,items.length))},async()=>{
    while(cursor<items.length){const i=cursor++;out[i]=await fn(items[i],i)}
  });
  await Promise.all(workers);return out;
}

async function listInbox(){
  const list=await gmailFetch('/messages?labelIds=INBOX&maxResults=30');
  const refs=Array.isArray(list?.messages)?list.messages:[];
  if(!refs.length)return [];
  const details=await mapMailLimit(refs,6,ref=>gmailFetch(`/messages/${encodeURIComponent(ref.id)}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`));
  return details.map(normalizeMailMetadata);
}

async function loadGmailProfile(){
  try{mailState.profile=await gmailFetch('/profile')}catch{mailState.profile=null}
  const el=mail$('#mailAccount');
  if(el)el.textContent=mailState.profile?.emailAddress||'Gmail';
}

async function showMailInbox(){
  mail$('#mailSetup')?.classList.add('hidden');
  mail$('#mailInbox')?.classList.remove('hidden');
  mail$('#mailReader')?.classList.add('hidden');
  setMailStatus('正在实时读取 Gmail 收件箱…');
  try{
    await loadGmailProfile();
    mailState.messages=await listInbox();
    renderMailList();
    setMailStatus(`${mailState.messages.length} 封邮件 · Gmail 已实时刷新`);
    if(mailState.translateConsent){
      await translateMailList();
      renderMailList();
      setMailStatus(`${mailState.messages.length} 封邮件 · Gmail 已实时刷新 · 中文浏览`);
    }else{
      setMailStatus(`${mailState.messages.length} 封邮件 · 原文模式 · 开启翻译需在设置中授权`);
    }
  }catch(error){
    setMailStatus(error?.message||String(error));
    if(!mailTokenValid())showMailSetup();
  }
}

function renderMailList(){
  const root=mail$('#mailList');if(!root)return;
  if(!mailState.messages.length){root.innerHTML='<div class="empty-state">收件箱为空。</div>';return}
  root.innerHTML=mailState.messages.map(message=>{
    const subject=mailState.showChinese?(message._zhSubject||message.subject):message.subject;
    const snippet=mailState.showChinese?(message._zhSnippet||message.snippet):message.snippet;
    return `<article class="mail-row ${message.unread?'mail-unread':''}" data-mail-id="${mailEsc(message.id)}">
      <div class="mail-row-top"><strong class="mail-from">${mailEsc(message.from)}</strong><span class="mail-time">${mailEsc(formatMailDate(message))}</span></div>
      <h2>${mailEsc(subject)}</h2>
      <p>${mailEsc(snippet)}</p>
    </article>`;
  }).join('');
  root.querySelectorAll('[data-mail-id]').forEach(el=>el.addEventListener('click',()=>openMailMessage(el.dataset.mailId)));
}

async function mailTranslateOne(value){
  const source=String(value||'').trim();
  if(!source||!/[A-Za-z]{2}/.test(source))return source;
  if(mailState.memoryTranslations.has(source))return mailState.memoryTranslations.get(source);
  const u=new URL(MAIL_TRANSLATE_ENDPOINT);
  u.searchParams.set('client','gtx');u.searchParams.set('sl','auto');u.searchParams.set('tl','zh-CN');u.searchParams.set('dt','t');u.searchParams.set('q',source);
  const response=await fetch(u,{cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'});
  if(!response.ok)throw new Error(`翻译服务 ${response.status}`);
  const json=await response.json();
  const translated=Array.isArray(json?.[0])?json[0].map(row=>Array.isArray(row)?(row[0]||''):'').join('').trim():'';
  if(!translated)throw new Error('翻译结果为空');
  mailState.memoryTranslations.set(source,translated);
  return translated;
}

async function translateMailList(){
  const targets=mailState.messages.slice(0,20);
  await mapMailLimit(targets,2,async message=>{
    try{message._zhSubject=await mailTranslateOne(message.subject)}catch{message._zhSubject=message.subject}
    try{message._zhSnippet=await mailTranslateOne(message.snippet)}catch{message._zhSnippet=message.snippet}
    renderMailList();
    await mailSleep(60);
  });
}

function decodeBase64Url(data=''){
  const normalized=String(data).replace(/-/g,'+').replace(/_/g,'/');
  const padded=normalized+'='.repeat((4-normalized.length%4)%4);
  const binary=atob(padded);
  const bytes=Uint8Array.from(binary,ch=>ch.charCodeAt(0));
  return new TextDecoder('utf-8',{fatal:false}).decode(bytes);
}

function collectMailBodies(part,out={html:[],plain:[]}){
  if(!part)return out;
  const mime=String(part.mimeType||'').toLowerCase();
  const data=part?.body?.data;
  if(data){
    const decoded=decodeBase64Url(data);
    if(mime==='text/html')out.html.push(decoded);
    else if(mime==='text/plain')out.plain.push(decoded);
  }
  for(const child of part.parts||[])collectMailBodies(child,out);
  return out;
}

function sanitizeMailHtml(html){
  const doc=new DOMParser().parseFromString(String(html||''),'text/html');
  doc.querySelectorAll('script,style,form,input,button,textarea,select,option,object,embed,iframe,meta,link,base').forEach(el=>el.remove());
  doc.querySelectorAll('*').forEach(el=>{
    for(const attr of [...el.attributes]){
      const name=attr.name.toLowerCase();const value=attr.value||'';
      if(name.startsWith('on'))el.removeAttribute(attr.name);
      if(name==='style'&&/(url\s*\(|expression\s*\(|javascript:|@import)/i.test(value))el.removeAttribute(attr.name);
      if(['href','src','xlink:href','action','formaction'].includes(name)&&/^\s*javascript:/i.test(value))el.removeAttribute(attr.name);
    }
    if(el.tagName==='A'){
      el.setAttribute('target','_blank');el.setAttribute('rel','noopener noreferrer');
    }
    if(el.tagName==='IMG'){
      const src=el.getAttribute('src')||'';
      el.setAttribute('referrerpolicy','no-referrer');
      el.setAttribute('loading','lazy');
      if(/^https?:\/\//i.test(src)){
        el.setAttribute('data-cl-remote-src',src);
        el.removeAttribute('src');
        el.classList.add('mail-remote-image');
        if(!el.getAttribute('alt'))el.setAttribute('alt','远程图片已隐藏');
      }else if(/^cid:/i.test(src)){
        el.removeAttribute('src');
        el.classList.add('mail-cid-image');
        if(!el.getAttribute('alt'))el.setAttribute('alt','内嵌图片');
      }
    }
  });
  return doc.body.innerHTML;
}

function plainTextToHtml(text){return `<div class="mail-plain">${mailEsc(text).replace(/\n/g,'<br>')}</div>`}

function shouldTranslateMailNode(node){
  const parent=node.parentElement;if(!parent)return false;
  if(parent.closest('script,style,pre,code,kbd,samp,svg,button,a'))return false;
  const value=node.nodeValue.trim();
  if(value.length<2||!/[A-Za-z]{2}/.test(value))return false;
  if(/^https?:\/\/\S+$/i.test(value)||/^\S+@\S+\.\S+$/.test(value))return false;
  return true;
}

async function translateMailDom(root){
  if(!mailState.translateConsent)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>shouldTranslateMailNode(n)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  await mapMailLimit(nodes,2,async node=>{
    try{node.nodeValue=await mailTranslateOne(node.nodeValue)}catch{}
    await mailSleep(40);
  });
}

async function openMailMessage(id){
  const meta=mailState.messages.find(item=>item.id===id);if(!meta)return;
  mail$('#mailInbox')?.classList.add('hidden');
  mail$('#mailReader')?.classList.remove('hidden');
  mail$('#mailReaderBody').innerHTML='<div class="mail-loading">正在读取 Gmail 原邮件结构…</div>';
  mail$('#mailReaderSubject').textContent=mailState.showChinese?(meta._zhSubject||meta.subject):meta.subject;
  mail$('#mailReaderFrom').textContent=meta.from;
  mail$('#mailReaderMeta').textContent=meta.date||'';
  try{
    const full=await gmailFetch(`/messages/${encodeURIComponent(id)}?format=full`);
    mailState.current={...meta,full};
    const bodies=collectMailBodies(full.payload);
    const source=bodies.html[0]?sanitizeMailHtml(bodies.html[0]):plainTextToHtml(bodies.plain.join('\n\n')||full.snippet||'');
    const body=mail$('#mailReaderBody');body.innerHTML=source||'<p>这封邮件没有可显示的正文。</p>';
    mailState.remoteImagesAllowed=false;
    updateRemoteImagesButton();
    if(mailState.showChinese&&mailState.translateConsent){
      setMailStatus('正在生成邮件中文视图…');
      await translateMailDom(body);
      setMailStatus('Gmail 实时原文 · 中文仅作为显示层');
    }
  }catch(error){mail$('#mailReaderBody').innerHTML=`<p class="mail-error">${mailEsc(error?.message||String(error))}</p>`}
}

function updateRemoteImagesButton(){
  const button=mail$('#mailRemoteImages');if(!button)return;
  const count=mail$('#mailReaderBody')?.querySelectorAll('img[data-cl-remote-src]').length||0;
  button.classList.toggle('hidden',count===0);
  button.textContent=mailState.remoteImagesAllowed?'已显示远程图片':`显示图片${count?` (${count})`:''}`;
}

function showRemoteImages(){
  const body=mail$('#mailReaderBody');if(!body)return;
  body.querySelectorAll('img[data-cl-remote-src]').forEach(img=>{if(!img.src)img.src=img.dataset.clRemoteSrc||''});
  mailState.remoteImagesAllowed=true;updateRemoteImagesButton();
}

function toggleMailLanguage(){
  mailState.showChinese=!mailState.showChinese;
  const button=mail$('#mailLanguage');if(button)button.textContent=mailState.showChinese?'中文':'原文';
  renderMailList();
  if(mailState.current)openMailMessage(mailState.current.id);
}

function showMailSetup(){
  mail$('#mailInbox')?.classList.add('hidden');
  mail$('#mailReader')?.classList.add('hidden');
  mail$('#mailSetup')?.classList.remove('hidden');
  const input=mail$('#gmailClientId');if(input)input.value=mailClientId();
  const consent=mail$('#mailTranslateConsent');if(consent)consent.checked=mailState.translateConsent;
  setMailSetupStatus(mailClientId()?'已保存 Client ID，连接 Gmail 即可。':'首次使用需要一个 Google OAuth Client ID。');
}

function disconnectGmail(){
  const token=mailState.token;
  mailState.token='';mailState.tokenExpiresAt=0;mailState.messages=[];mailState.current=null;mailState.profile=null;mailState.memoryTranslations.clear();
  if(token&&window.google?.accounts?.oauth2?.revoke){try{google.accounts.oauth2.revoke(token,()=>{})}catch{}}
  showMailSetup();
}

function loadMailApp(){
  mail$('#mailVersion').textContent=`v${APP_VERSION}`;
  if(mailTokenValid())showMailInbox();else showMailSetup();
}

function bindMailEvents(){
  mail$('#gmailConnect')?.addEventListener('click',connectGmail);
  mail$('#mailRefresh')?.addEventListener('click',showMailInbox);
  mail$('#mailDisconnect')?.addEventListener('click',disconnectGmail);
  mail$('#mailReaderBack')?.addEventListener('click',()=>{mail$('#mailReader')?.classList.add('hidden');mail$('#mailInbox')?.classList.remove('hidden');setMailStatus(`${mailState.messages.length} 封邮件 · Gmail 已实时刷新`)});
  mail$('#mailLanguage')?.addEventListener('click',toggleMailLanguage);
  mail$('#mailRemoteImages')?.addEventListener('click',showRemoteImages);
  mail$('#mailSettings')?.addEventListener('click',showMailSetup);
  mail$('#mailTranslateConsent')?.addEventListener('change',event=>{
    mailState.translateConsent=Boolean(event.target.checked);
    localStorage.setItem(MAIL_TRANSLATE_CONSENT_KEY,mailState.translateConsent?'yes':'no');
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  bindMailEvents();
  const version=mail$('#mailVersion');if(version)version.textContent=`v${APP_VERSION}`;
});
window.loadMailApp=loadMailApp;
