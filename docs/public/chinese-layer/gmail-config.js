// Public OAuth application identifier, never a client secret or an access token.
const CL_GMAIL_CLIENT_ID='1090696367470-f5opcehk6g7rj3s0b08n5ibit8kgv209.apps.googleusercontent.com';
try{localStorage.setItem('cl-gmail-client-id-v1',CL_GMAIL_CLIENT_ID)}catch{}

const gmailPrivacyStyle=document.createElement('style');
gmailPrivacyStyle.textContent=`
.mail-reader-body img[data-cl-remote-src]:not([src]),.mail-reader-body img.mail-cid-image:not([src]){display:none!important}
.mail-topbar .brand,.mail-topbar .brand>div:last-child,.mail-main,.mail-row-top,.mail-from{min-width:0}
.mail-topbar .brand{flex:1}.mail-logo{flex:none}.mail-account{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
.mail-top-actions{flex:none}.mail-topbar .eyebrow{letter-spacing:.04em}.mail-topbar .version-badge{margin-left:3px}
.mail-shell button,.launcher-shell button{min-height:44px;touch-action:manipulation}
.mail-shell input.text-input{font-size:16px}.mail-consent-row input{width:22px;height:22px;flex:none}
.mail-reader-card h1,.mail-row h2{overflow-wrap:anywhere}.mail-reader-body{max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}
.mail-reader-body>*{max-width:100%}.mail-reader-body table{display:block;overflow-x:auto}.mail-reader-body pre{max-width:100%;overflow-x:auto}
#updateBanner{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:100;max-width:760px;margin:0 auto}
.launcher-topbar{display:flex;align-items:center;justify-content:space-between;gap:10px}
@media(max-width:600px){
 .mail-topbar{flex-wrap:wrap;top:env(safe-area-inset-top);gap:8px}.mail-topbar .brand{min-width:180px}
 .mail-topbar .mail-top-actions{margin-left:auto}.mail-reader-card{padding:16px}.mail-reader-card h1{font-size:24px;line-height:1.4}
 .mail-reader-body{font-size:17px;line-height:1.8}.mail-row{padding:16px 14px}.mail-row h2{font-size:18px;line-height:1.45}
 .mail-row p,.mail-consent-row{font-size:15px;line-height:1.55}.mail-from{font-size:16px}.mail-time{font-size:13px}
 .mail-setup-card{padding:16px}.mail-reader-bar{position:sticky;top:105px;background:var(--bg);padding:8px 0;z-index:4}
 .mail-reader-bar button{white-space:nowrap}.catalog-card{grid-template-columns:48px minmax(0,1fr)}
 .catalog-card .app-card-icon{width:48px;height:48px}.catalog-add{grid-column:1/-1}.app-card-title-row{flex-wrap:wrap}
}
`;
document.head.appendChild(gmailPrivacyStyle);

// Runs before gmail.js binds its UI listeners (this script is loaded first).
document.addEventListener('DOMContentLoaded',()=>{
  for(const id of ['launcherVersion','versionBadge','mailVersion']){const el=document.getElementById(id);if(el)el.textContent=`v${APP_VERSION}`}
  const banner=document.querySelector('#updateBanner');
  if(banner)document.body.appendChild(banner);

  // All entry points use app.js; no adapter overrides or independent version baselines.
  const checkButton=document.createElement('button');
  checkButton.id='pwaCheckUpdate';checkButton.className='ghost-btn';checkButton.textContent='检查更新';
  checkButton.addEventListener('click',()=>checkForUpdate(true));
  document.querySelector('.launcher-topbar')?.appendChild(checkButton);

  // Use Google Identity Services token popup on every browser, including iPhone Home Screen PWA.
  // Do not build a custom OAuth redirect URI in this static app.
  connectGmail=function(){
    const input=mail$('#gmailClientId');
    const clientId=CL_GMAIL_CLIENT_ID;
    if(input)input.value=clientId;
    if(!/^[0-9]+-[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/.test(clientId)){setMailSetupStatus('应用登录配置不正确。');return}
    mailState.translateConsent=Boolean(mail$('#mailTranslateConsent')?.checked);
    try{localStorage.setItem(GMAIL_CLIENT_ID_KEY,clientId);localStorage.setItem(MAIL_TRANSLATE_CONSENT_KEY,mailState.translateConsent?'yes':'no')}catch{}
    if(!window.google?.accounts?.oauth2){
      setMailSetupStatus('正在准备 Google 登录，请稍候…');
      waitForGoogleIdentity().then(()=>setMailSetupStatus('Google 登录已就绪，请再点一次“连接 Gmail”。')).catch(()=>setMailSetupStatus('Google 登录组件无法加载，请检查网络后重试。'));
      return;
    }
    const client=google.accounts.oauth2.initTokenClient({
      client_id:clientId,scope:GMAIL_SCOPE,
      error_callback:error=>setMailSetupStatus(error?.type==='popup_closed'?'你已关闭登录窗口，可重新连接。':'登录窗口未打开，请再次点击连接 Gmail。'),
      callback:async response=>{
        if(response?.error){setMailSetupStatus(`Google 授权失败：${response.error}`);return}
        if(!response?.access_token||!google.accounts.oauth2.hasGrantedAllScopes(response,GMAIL_SCOPE)){setMailSetupStatus('未获得 Gmail 只读权限，请重新连接并确认授权。');return}
        mailState.token=response.access_token;
        mailState.tokenExpiresAt=Date.now()+Number(response.expires_in||3600)*1000;
        setMailSetupStatus('授权成功，正在读取收件箱…');await showMailInbox();
      }
    });
    mailState.tokenClient=client;setMailSetupStatus('正在打开 Google 授权…');
    try{client.requestAccessToken({prompt:''})}catch{setMailSetupStatus('登录窗口未打开，请再点一次连接 Gmail。')}
  };

  toggleMailLanguage=function(){
    mailState.showChinese=!mailState.showChinese;
    mail$('#mailLanguage').textContent=mailState.showChinese?'中文':'原文';renderMailList();
    if(!mail$('#mailReader').classList.contains('hidden')&&mailState.current)openMailMessage(mailState.current.id);
  };
  const originalDisconnect=disconnectGmail;
  disconnectGmail=function(){
    originalDisconnect();
    for(const id of ['mailList','mailReaderBody','mailReaderSubject','mailReaderFrom','mailReaderMeta']){const el=mail$(`#${id}`);if(el)el.replaceChildren()}
    mail$('#mailAccount').textContent='Gmail';
  };
  const originalSetup=showMailSetup;
  showMailSetup=function(){
    originalSetup();
    const input=mail$('#gmailClientId');if(input)input.value=CL_GMAIL_CLIENT_ID;
    const label=document.querySelector('label[for="gmailClientId"]');
    if(label)label.classList.add('hidden');input?.classList.add('hidden');
    const note=document.querySelector('.mail-setup-note');
    if(note)note.textContent='应用 OAuth Client 已固定。点击“连接 Gmail”，Google 登录会以安全弹窗完成，不使用自定义回调地址。';
  };
});
