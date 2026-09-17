const HOTFIX_VERSION='0.6.1';

function hotfixSetVersionLabels(){
  ['#launcherVersion','#versionBadge','#mailVersion'].forEach(sel=>{
    const el=document.querySelector(sel);if(el)el.textContent=`v${HOTFIX_VERSION}`;
  });
  try{localStorage.setItem('cl-last-app-version',HOTFIX_VERSION)}catch{}
  document.querySelector('#updateBanner')?.classList.add('hidden');
}

const hotfixOriginalShowUpdate=typeof window.showUpdateBanner==='function'?window.showUpdateBanner:null;
if(hotfixOriginalShowUpdate){
  window.showUpdateBanner=function(){ /* 0.5.1 legacy updater is suppressed by 0.6.1 */ };
}

async function hotfixCheckForUpdate(){
  try{
    const r=await fetch(`./version.json?ts=${Date.now()}`,{cache:'no-store'});if(!r.ok)return;
    const meta=await r.json();
    const remote=String(meta?.version||'');
    const parts=v=>v.replace(/^v/,'').split('.').map(x=>parseInt(x,10)||0);
    const newer=(a,b)=>{const x=parts(a),y=parts(b),n=Math.max(x.length,y.length);for(let i=0;i<n;i++){if((x[i]||0)>(y[i]||0))return true;if((x[i]||0)<(y[i]||0))return false}return false};
    if(newer(remote,HOTFIX_VERSION)&&hotfixOriginalShowUpdate)hotfixOriginalShowUpdate(`发现新版本 v${remote}`,'立即更新');
  }catch{}
}

function hotfixOpenMail(){
  document.querySelector('#launcherShell')?.classList.add('hidden');
  document.querySelector('#devShell')?.classList.add('hidden');
  document.querySelector('#mailShell')?.classList.remove('hidden');
  if(typeof window.loadMailApp==='function')window.loadMailApp();
  window.scrollTo(0,0);
}

async function hotfixConnectGmail(){
  const status=document.querySelector('#mailSetupStatus');
  const input=document.querySelector('#gmailClientId');
  const clientId=(input?.value||localStorage.getItem('cl-gmail-client-id-v1')||'').trim();
  if(!clientId){if(status)status.textContent='Gmail 配置缺失，请刷新应用。';return}
  const consent=Boolean(document.querySelector('#mailTranslateConsent')?.checked);
  try{
    localStorage.setItem('cl-gmail-client-id-v1',clientId);
    localStorage.setItem('cl-mail-translate-consent-v1',consent?'yes':'no');
    if(typeof mailState!=='undefined')mailState.translateConsent=consent;
  }catch{}
  if(!window.google?.accounts?.oauth2){if(status)status.textContent='Google 登录组件正在载入，请再点一次“连接 Gmail”。';return}
  if(status)status.textContent='正在连接 Gmail…';
  let finished=false;
  const client=google.accounts.oauth2.initTokenClient({
    client_id:clientId,
    scope:'https://www.googleapis.com/auth/gmail.readonly',
    callback:async response=>{
      finished=true;
      if(response?.error){if(status)status.textContent=`Google 授权失败：${response.error}`;return}
      const token=response?.access_token||'';
      if(!token){if(status)status.textContent='Google 已登录，但没有返回 Gmail 授权令牌。请再点一次连接。';return}
      if(typeof mailState!=='undefined'){
        mailState.token=token;
        mailState.tokenExpiresAt=Date.now()+(Number(response.expires_in||3600)*1000);
        mailState.tokenClient=client;
      }
      if(status)status.textContent='授权成功，正在读取收件箱…';
      if(typeof showMailInbox==='function')await showMailInbox();
    },
  });
  if(typeof mailState!=='undefined')mailState.tokenClient=client;
  client.requestAccessToken({prompt:''});
  setTimeout(()=>{
    if(!finished&&status)status.textContent='Google 已完成登录，但授权结果没有返回中文层。请回到中文层后再点一次“连接 Gmail”，无需重新输入密码。';
  },12000);
}

document.addEventListener('click',event=>{
  const mailBrowse=event.target.closest?.('.browse-app[data-app="mail"]');
  if(mailBrowse){event.preventDefault();event.stopImmediatePropagation();hotfixOpenMail();return}
  const connect=event.target.closest?.('#gmailConnect');
  if(connect){event.preventDefault();event.stopImmediatePropagation();hotfixConnectGmail();}
},true);

document.addEventListener('DOMContentLoaded',()=>{
  hotfixSetVersionLabels();
  hotfixCheckForUpdate();
});

document.addEventListener('visibilitychange',()=>{if(!document.hidden){hotfixSetVersionLabels();hotfixCheckForUpdate()}});
