// Synthetic fixtures only. No Gmail credentials or real mailbox content are used.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const {webkit,chromium}=await import(pathToFileURL(process.env.CL_PLAYWRIGHT_MODULE).href);
const root=path.resolve('docs/public/chinese-layer');
const {version:expectedVersion}=JSON.parse(await fs.readFile(path.join(root,'version.json'),'utf8'));
assert.match(expectedVersion,/^\d+\.\d+\.\d+$/);
const nextVersion=expectedVersion.split('.').map((n,i)=>i===2?Number(n)+1:n).join('.');
const appSource=await fs.readFile(path.join(root,'app.js'),'utf8');
const htmlSource=await fs.readFile(path.join(root,'index.html'),'utf8');
assert.ok(appSource.includes(`const APP_VERSION='${expectedVersion}';`));
for(const match of htmlSource.matchAll(/(?:src|href)="\.\/[^"?]+\?(?:v=)([^"&]+)/g))assert.equal(match[1],expectedVersion,'asset version parity');
assert.equal((htmlSource.match(new RegExp(`>v${expectedVersion.replaceAll('.','\\.')}<`,'g'))||[]).length,3,'static badge parity');
for(const file of ['dev-live-refresh-0.5.2.js','gmail-config.js','ios-pwa-hotfix-0.6.1.js']){
  const source=await fs.readFile(path.join(root,file),'utf8');
  assert.doesNotMatch(source,/\bisNewerVersion\s*=|\bcheckForUpdate\s*=|\bshowUpdateBanner\s*=/,`${file} must not override updates`);
}
const server=http.createServer(async(req,res)=>{
  try{
    const pathname=new URL(req.url,'http://localhost').pathname;
    const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!file.startsWith(root+path.sep))throw new Error('Invalid path');
    const ext=path.extname(file);const types={'.js':'application/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json'};
    const body=await fs.readFile(file);
    res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream','Cache-Control':'no-store'});res.end(body);
  }catch{res.writeHead(404);res.end('not found')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const fixtureHtml='<p>Hello from the test message.</p><table><tr><td>Table example</td></tr></table><pre><code>const untouched = true;</code></pre><p><a href="https://example.com/topic">Visit topic</a></p><img src="https://images.example.com/test.png" alt="Test image">';
const metadata={id:'test-message-1',threadId:'test-thread-1',internalDate:'1789641600000',labelIds:['INBOX','UNREAD'],snippet:'Synthetic private message snippet.',payload:{headers:[{name:'Subject',value:'Synthetic inbox translation test'},{name:'From',value:'Test Sender <sender@example.com>'},{name:'Date',value:'Thu, 17 Sep 2026 12:00:00 +0000'}]}};
const devArticle={id:123,title:'DEV synthetic test',description:'DEV description',path:'/demo/test',published_at:'2026-09-17T12:00:00Z',tag_list:[],user:{username:'joinwell52',name:'Demo'},body_html:'<h2>DEV heading</h2><p>DEV text</p>'};
const reports=[];
try{
  for(const [engine,width] of [[webkit,375],[webkit,390],[webkit,430],[chromium,375]]){
    const browser=await engine.launch({headless:true});
    const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,locale:'zh-CN',serviceWorkers:'block'});
    const page=await context.newPage();const errors=[];let translations=0;let gmailReads=0;let remoteImages=0;let remoteVersion=expectedVersion;let versionError=false;let simulatePreviousBuild=false;let redirectClientId='';let redirectUri='';let redirectCount=0;
    page.on('pageerror',error=>errors.push(error.message));
    await page.addInitScript(()=>{
      Object.defineProperty(navigator,'standalone',{value:true,configurable:true});
      localStorage.setItem('cl-last-app-version','0.5.1');
      localStorage.setItem('cl-gmail-client-id-v1','999999-stale.apps.googleusercontent.com');
      window.__clUpdateIntervals=[];
      const original=window.setInterval;
      window.setInterval=function(callback,delay,...args){
        if(delay===120000)window.__clUpdateIntervals.push(callback);
        return original.call(window,callback,delay,...args);
      };
    });
    await page.route('**/*',async route=>{
      const request=route.request(),u=new URL(request.url());
      const json=body=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
      if(u.origin===origin){
        if(u.pathname==='/version.json')return versionError?route.fulfill({status:503,body:'unavailable'}):json({version:remoteVersion});
        if(u.pathname==='/cache.json')return json({schema:'chinese-layer-cache/v1',latest:[],popular:[],mine:[]});
        if(u.pathname==='/app.js'&&simulatePreviousBuild)return route.fulfill({contentType:'application/javascript',body:appSource.replace(`const APP_VERSION='${expectedVersion}';`,"const APP_VERSION='0.6.1';")});
        return route.continue();
      }
      if(u.hostname==='accounts.google.com'){
        if(u.pathname==='/o/oauth2/v2/auth'){
          redirectCount++;
          redirectClientId=u.searchParams.get('client_id')||'';
          redirectUri=u.searchParams.get('redirect_uri')||'';
          const state=u.searchParams.get('state')||'';
          const scope=u.searchParams.get('scope')||'';
          const back=new URL(redirectUri);
          back.hash=new URLSearchParams({access_token:'SYNTHETIC_ONLY_TOKEN',expires_in:'3600',scope,state}).toString();
          return route.fulfill({contentType:'text/html',body:`<!doctype html><script>location.replace(${JSON.stringify(back.toString())})<\/script>`});
        }
        return route.fulfill({contentType:'application/javascript',body:`window.google={accounts:{oauth2:{hasGrantedAllScopes:()=>true,revoke:(token,cb)=>cb({successful:true}),initTokenClient(config){window.__oauthClientId=config.client_id;const client={...config,requestAccessToken(){window.__oauthHadUserGesture=navigator.userActivation?.isActive!==false;setTimeout(()=>client.callback({access_token:'SYNTHETIC_ONLY_TOKEN',expires_in:3600,scope:config.scope}),10)}};return client}}}};`});
      }
      if(u.hostname==='gmail.googleapis.com'){
        gmailReads++;assert.equal(request.method(),'GET');assert.equal(request.headers().authorization,'Bearer SYNTHETIC_ONLY_TOKEN');
        if(u.pathname.endsWith('/profile'))return json({emailAddress:'mobile-test@example.com'});
        if(u.pathname.endsWith('/messages'))return json({messages:[{id:metadata.id}],resultSizeEstimate:1});
        if(u.searchParams.get('format')==='full')return json({...metadata,payload:{...metadata.payload,mimeType:'text/html',body:{data:Buffer.from(fixtureHtml).toString('base64url')}}});
        return json(metadata);
      }
      if(u.hostname==='translate.googleapis.com'){translations++;return json([[['中文测试内容',u.searchParams.get('q')]]])}
      if(u.hostname==='dev.to')return json(/\/articles\/123$/.test(u.pathname)?devArticle:[devArticle]);
      if(u.hostname==='images.example.com'){remoteImages++;return route.fulfill({status:200,contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>'})}
      return route.abort();
    });
    const withinScreen=async label=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),`${engine.name()} ${width} horizontal overflow: ${label}`);
    const checkHidden=async()=>{
      await page.evaluate(()=>checkForUpdate());
      assert.equal(await page.locator('#updateBanner').isVisible(),false,'same or older version must not prompt');
    };
    try{
      await page.goto(origin,{waitUntil:'domcontentloaded'});
      await page.locator('#pwaCheckUpdate').waitFor();await withinScreen('launcher');
      await checkHidden();
      assert.equal(await page.evaluate(()=>APP_VERSION),expectedVersion);
      assert.deepEqual(await page.evaluate(()=>[
        typeof CHINESE_LAYER_VERSION,
        typeof MAIL_VERSION,
        typeof CL_RUNTIME_VERSION,
        typeof CHINESE_LAYER_PATCH_VERSION,
        typeof HOTFIX_VERSION
      ]),Array(5).fill('undefined'),'legacy version globals must not exist');
      for(const id of ['launcherVersion','versionBadge','mailVersion'])assert.equal(await page.locator(`#${id}`).textContent(),`v${expectedVersion}`);
      assert.equal(await page.evaluate(()=>isNewerVersion('0.6.1','0.6.1')),false,'explicit current argument must be respected');
      assert.equal(await page.evaluate(()=>isNewerVersion('0.6.2','0.6.1')),true);
      assert.equal(await page.evaluate(()=>isNewerVersion('0.6.1','0.6.2')),false);
      assert.equal(await page.evaluate(()=>localStorage.getItem('cl-last-app-version')),expectedVersion);
      await page.locator('#pwaCheckUpdate').tap();
      await page.waitForFunction(v=>document.querySelector('#updateText').textContent===`当前已是 v${v}`,expectedVersion);
      assert.equal(await page.locator('#updateNow').textContent(),'知道了');
      const beforeDismiss=page.url();
      await page.locator('#updateNow').tap();
      assert.equal(await page.locator('#updateBanner').isVisible(),false);assert.equal(page.url(),beforeDismiss);
      await page.evaluate(async()=>{if(!window.__clUpdateIntervals.length)throw new Error('missing update interval');for(const fn of window.__clUpdateIntervals)await fn()});
      assert.equal(await page.locator('#updateBanner').isVisible(),false,'saved interval must not revive stale banner');
      await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await checkHidden();
      remoteVersion='0.6.0';await checkHidden();remoteVersion=expectedVersion;

      await page.locator('#openCatalog').tap();await page.locator('.catalog-add[data-app="mail"]').tap();await withinScreen('catalog');
      await page.locator('#catalogBack').tap();await page.locator('.browse-app[data-app="mail"]').tap();
      await page.locator('#mailSetup').waitFor({state:'visible'});await withinScreen('Mail setup');
      assert.equal(await page.locator('#mailVersion').textContent(),`v${expectedVersion}`,'Mail must not fall back to an adapter version');
      assert.equal(await page.locator('#mailTranslateConsent').isChecked(),false);
      assert.equal(await page.locator('#gmailClientId').inputValue(),'1090696367470-f5opcehk6g7rj3s0b08n5ibit8kgv209.apps.googleusercontent.com');
      assert.equal(await page.evaluate(()=>localStorage.getItem('cl-gmail-client-id-v1')),'1090696367470-f5opcehk6g7rj3s0b08n5ibit8kgv209.apps.googleusercontent.com','stale local OAuth client must be migrated');
      await page.locator('#mailTranslateConsent').check();await page.locator('#gmailConnect').tap();
      await page.locator('.mail-row').waitFor();await page.waitForFunction(()=>document.querySelector('.mail-row h2').textContent.includes('中文'));
      assert.ok(redirectCount>0,'iOS standalone must use a full-page Google redirect');
      assert.equal(redirectClientId,'1090696367470-f5opcehk6g7rj3s0b08n5ibit8kgv209.apps.googleusercontent.com','redirect must use the pinned production client');
      assert.equal(redirectUri,`${origin}/`,'redirect URI must return to the exact app root in this test');
      assert.equal(new URL(page.url()).hash,'','OAuth token fragment must be cleared after return');
      await withinScreen('inbox');await page.screenshot({path:`/tmp/cl-mobile-${engine.name()}-${width}-inbox.png`});
      await page.locator('.mail-row').first().tap();
      await page.waitForFunction(()=>document.querySelector('#mailReaderBody p')?.textContent.includes('中文'));
      assert.equal(await page.locator('#mailReaderBody code').textContent(),'const untouched = true;');
      assert.equal(await page.locator('#mailReaderBody a').getAttribute('href'),'https://example.com/topic');
      assert.equal(await page.locator('#mailReaderBody img').getAttribute('src'),null);
      assert.equal(await page.locator('#mailReaderBody img').isVisible(),false);
      await withinScreen('reader');await page.screenshot({path:`/tmp/cl-mobile-${engine.name()}-${width}-reader.png`});
      await page.locator('#mailRemoteImages').tap();await page.waitForFunction(()=>document.querySelector('#mailReaderBody img')?.hasAttribute('src'));
      await page.locator('#mailLanguage').tap();await page.waitForFunction(()=>document.querySelector('#mailReaderBody p')?.textContent==='Hello from the test message.');
      await page.locator('#mailReaderBack').tap();await page.locator('#mailLanguage').tap();
      assert.equal(await page.locator('#mailInbox').isVisible(),true);assert.equal(await page.locator('#mailReader').isVisible(),false);
      const beforeRefresh=gmailReads;await page.locator('#mailRefresh').tap();await page.waitForFunction(()=>document.querySelector('#mailStatus').textContent.includes('中文浏览'));
      assert.ok(gmailReads>beforeRefresh);
      await page.locator('#mailDisconnect').tap();assert.equal(await page.locator('#mailSetup').isVisible(),true);
      const stored=await page.evaluate(()=>JSON.stringify({...localStorage}));
      assert.ok(!stored.includes('SYNTHETIC_ONLY_TOKEN')&&!stored.includes('Synthetic inbox')&&!stored.includes('Synthetic private'));
      assert.equal(await page.locator('#mailList').textContent(),'');
      await page.locator('#mailBackApps').tap();

      remoteVersion=nextVersion;await page.locator('#pwaCheckUpdate').tap();
      await page.waitForFunction(v=>document.querySelector('#updateText').textContent===`发现新版本 v${v}`,nextVersion);
      assert.equal(await page.locator('#updateNow').textContent(),'立即更新');await withinScreen('update notice');
      versionError=true;await page.locator('#pwaCheckUpdate').tap();
      await page.waitForFunction(()=>document.querySelector('#updateText').textContent.includes('暂时无法检查更新'));
      const beforeFailureDismiss=page.url();await page.locator('#updateNow').tap();
      assert.equal(page.url(),beforeFailureDismiss);assert.equal(await page.locator('#updateBanner').isVisible(),false);
      versionError=false;remoteVersion=expectedVersion;await checkHidden();
      // A late response from an earlier check must not restore a stale update notice.
      await page.evaluate(async()=>{
        const originalFetch=window.fetch;let release;let calls=0;
        window.fetch=async(...args)=>{
          if(String(args[0]).includes('version.json')){
            calls++;
            if(calls===1)return new Promise(resolve=>{release=()=>resolve({ok:true,json:async()=>({version:'99.0.0'})})});
            return {ok:true,json:async()=>({version:APP_VERSION})};
          }
          return originalFetch(...args);
        };
        try{const older=checkForUpdate();await checkForUpdate();release();await older}finally{window.fetch=originalFetch}
      });
      assert.equal(await page.locator('#updateBanner').isVisible(),false);
      // Simulate the older build, then serve the real candidate after clicking update.
      simulatePreviousBuild=true;await page.reload({waitUntil:'domcontentloaded'});
      await page.waitForFunction(v=>document.querySelector('#updateText').textContent===`发现新版本 v${v}`,expectedVersion);
      assert.equal(await page.evaluate(()=>APP_VERSION),'0.6.1');
      simulatePreviousBuild=false;
      await Promise.all([page.waitForURL(u=>u.searchParams.get('version')===expectedVersion),page.locator('#updateNow').tap()]);
      await page.locator('#pwaCheckUpdate').waitFor();await checkHidden();
      assert.equal(await page.evaluate(()=>APP_VERSION),expectedVersion);
      assert.equal(await page.locator('#launcherVersion').textContent(),`v${expectedVersion}`);
      await page.screenshot({path:`/tmp/cl-mobile-${engine.name()}-${width}-updated.png`});
      assert.deepEqual(errors,[]);assert.ok(translations>0&&gmailReads>0);
      reports.push({engine:engine.name(),width,result:'PASS',oauth:'SIMULATED_IOS_FULL_PAGE_REDIRECT',mailbox:'SYNTHETIC',checks:['version source parity','explicit comparator argument','same-version automatic silence','same-version manual dismissal','saved interval','visibility resume','older metadata','newer metadata','failed-check dismissal','stale response rejection','simulated upgrade and reload','launcher','catalog','setup','inbox','reader','code/link preservation','image opt-in','language toggle','back','refresh','disconnect','no sensitive localStorage','no page errors']});
    }finally{await context.close();await browser.close()}
  }
  const swBrowser=await chromium.launch({headless:true});
  const swContext=await swBrowser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'allow'});
  const swPage=await swContext.newPage();
  await swPage.route('https://accounts.google.com/**',route=>route.fulfill({contentType:'application/javascript',body:'window.google={accounts:{oauth2:{}}};'}));
  try{
    await swPage.goto(origin,{waitUntil:'domcontentloaded'});
    await swPage.evaluate(()=>navigator.serviceWorker.ready);
    await swPage.reload({waitUntil:'domcontentloaded'});
    await swPage.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
    const swState=await swPage.evaluate(async()=>{
      const registration=await navigator.serviceWorker.getRegistration('./');
      const version=await fetch('./version.json',{cache:'no-store'}).then(r=>r.json()).then(x=>x.version);
      return {
        controlled:Boolean(navigator.serviceWorker.controller),
        scriptURL:navigator.serviceWorker.controller?.scriptURL||'',
        updateViaCache:registration?.updateViaCache||'',
        version
      };
    });
    assert.equal(swState.controlled,true);
    assert.ok(swState.scriptURL.endsWith('/sw.js'));
    assert.equal(swState.updateViaCache,'none');
    assert.equal(swState.version,expectedVersion);
    reports.push({engine:'chromium',width:390,result:'PASS',pwa:'SERVICE_WORKER_CONTROLLED',checks:['service worker registration','controller takeover','updateViaCache none','version.json network path']});
  }finally{await swContext.close();await swBrowser.close()}

  console.log(JSON.stringify({status:'PASS',version:expectedVersion,realIphoneOAuth:'NOT_RUN',customRedirectOAuth:'SIMULATED_AND_RETURNED',reports},null,2));
}finally{server.close()}
