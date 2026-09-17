// Synthetic fixtures only. No Gmail credentials or real mailbox content are used.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const {webkit,chromium}=await import(pathToFileURL(process.env.CL_PLAYWRIGHT_MODULE).href);
const root=path.resolve('docs/public/chinese-layer');
const server=http.createServer(async(req,res)=>{
  try{
    const pathname=new URL(req.url,'http://localhost').pathname;
    const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!file.startsWith(root+path.sep))throw new Error('Invalid path');
    const ext=path.extname(file);const types={'.js':'application/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json'};
    res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream','Cache-Control':'no-store'});res.end(await fs.readFile(file));
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
    const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,locale:'zh-CN'});
    const page=await context.newPage();const errors=[];let translations=0;let gmailReads=0;let remoteImages=0;let remoteVersion='0.6.0';
    page.on('pageerror',error=>errors.push(error.message));
    await page.addInitScript(()=>Object.defineProperty(navigator,'standalone',{value:true,configurable:true}));
    await page.route('**/*',async route=>{
      const request=route.request(),u=new URL(request.url());
      const json=body=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
      if(u.origin===origin){
        if(u.pathname==='/version.json')return json({version:remoteVersion});
        if(u.pathname==='/cache.json')return json({schema:'chinese-layer-cache/v1',latest:[],popular:[],mine:[]});
        return route.continue();
      }
      if(u.hostname==='accounts.google.com')return route.fulfill({contentType:'application/javascript',body:`window.google={accounts:{oauth2:{hasGrantedAllScopes:()=>true,revoke:(token,cb)=>cb({successful:true}),initTokenClient(config){const client={...config,requestAccessToken(){window.__oauthHadUserGesture=navigator.userActivation?.isActive!==false;setTimeout(()=>client.callback({access_token:'SYNTHETIC_ONLY_TOKEN',expires_in:3600,scope:config.scope}),10)}};return client}}}};`});
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
    try{
      await page.goto(origin,{waitUntil:'domcontentloaded'});
      await page.locator('#pwaCheckUpdate').waitFor();await withinScreen('launcher');
      await page.locator('#openCatalog').tap();await page.locator('.catalog-add[data-app="mail"]').tap();await withinScreen('catalog');
      await page.locator('#catalogBack').tap();await page.locator('.browse-app[data-app="mail"]').tap();
      await page.locator('#mailSetup').waitFor({state:'visible'});await withinScreen('Mail setup');
      assert.equal(await page.locator('#mailTranslateConsent').isChecked(),false);
      assert.equal(await page.locator('#gmailClientId').inputValue(),'1090696367470-f5opcehk6g7rj3s0b08n5ibit8kgv209.apps.googleusercontent.com');
      await page.locator('#mailTranslateConsent').check();await page.locator('#gmailConnect').tap();
      await page.locator('.mail-row').waitFor();await page.waitForFunction(()=>document.querySelector('.mail-row h2').textContent.includes('中文'));
      assert.equal(await page.evaluate(()=>window.__oauthHadUserGesture),true);
      await withinScreen('inbox');await page.screenshot({path:`/tmp/cl-mobile-${engine.name()}-${width}-inbox.png`});
      const beforeImages=remoteImages;await page.locator('.mail-row').first().tap();
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
      await page.locator('#mailBackApps').tap();remoteVersion='0.6.1';await page.locator('#pwaCheckUpdate').tap();await page.locator('#updateBanner').waitFor({state:'visible'});
      assert.ok((await page.locator('#updateBanner').textContent()).includes('0.6.1'));await withinScreen('update notice');
      assert.deepEqual(errors,[]);assert.ok(translations>0&&gmailReads>0);
      reports.push({engine:engine.name(),width,result:'PASS',oauth:'SIMULATED_USER_GESTURE',mailbox:'SYNTHETIC',checks:['launcher','catalog','setup','inbox','reader','code/link preservation','image opt-in','language toggle','back','refresh','disconnect','no sensitive localStorage','global update notice','no page errors']});
    }finally{await context.close();await browser.close()}
  }
  console.log(JSON.stringify({status:'PASS',realIphoneOAuth:'NOT_RUN',reports},null,2));
}finally{server.close()}
