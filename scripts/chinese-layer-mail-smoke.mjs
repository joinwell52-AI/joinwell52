import fs from 'node:fs/promises';

function assert(condition,message){if(!condition)throw new Error(message)}

const [gmail,index,launcher,versionText]=await Promise.all([
  fs.readFile('docs/public/chinese-layer/gmail.js','utf8'),
  fs.readFile('docs/public/chinese-layer/index.html','utf8'),
  fs.readFile('docs/public/chinese-layer/launcher.js','utf8'),
  fs.readFile('docs/public/chinese-layer/version.json','utf8'),
]);
const version=JSON.parse(versionText);

assert(version.version==='0.6.0','version.json is not 0.6.0');
assert(gmail.includes("GMAIL_SCOPE='https://www.googleapis.com/auth/gmail.readonly'"),'gmail.readonly scope missing');
assert(gmail.includes('https://gmail.googleapis.com/gmail/v1/users/me'),'Gmail API base missing');
assert(gmail.includes('/messages?labelIds=INBOX&maxResults=30'),'Inbox list call missing');
assert(gmail.includes('?format=metadata&metadataHeaders=Subject'),'metadata message reads missing');
assert(gmail.includes('?format=full'),'full message body read missing');
assert(gmail.includes('Authorization:`Bearer ${mailState.token}`'),'Bearer authorization missing');
assert(gmail.includes("localStorage.setItem(GMAIL_CLIENT_ID_KEY"),'Client ID persistence missing');
assert(!/localStorage\.setItem\([^\n]*(token|message|mailState\.messages|mailState\.current)/i.test(gmail),'Sensitive Gmail token/message persistence detected');
assert(gmail.includes("doc.querySelectorAll('script,style,form,input,button,textarea,select,option,object,embed,iframe,meta,link,base')"),'Mail HTML sanitizer gate missing');
assert(gmail.includes("data-cl-remote-src"),'Remote image privacy gate missing');
assert(gmail.includes('memoryTranslations:new Map()'),'Mail translations are not memory-only');
assert(index.includes('https://accounts.google.com/gsi/client'),'Google Identity Services script missing');
assert(index.includes('./gmail.js?v=0.6.0'),'Gmail adapter script not wired');
assert(index.includes('id="mailList"')&&index.includes('id="mailReaderBody"'),'Inbox/reader UI missing');
assert(launcher.includes("badge:'Gmail 已接入'")&&launcher.includes("ready:true"),'Mail launcher not enabled');
assert(launcher.includes("if(typeof loadMailApp==='function')loadMailApp()"),'Mail launcher does not boot adapter');
console.log('MAIL_STATIC_GATES_OK');

async function fetchWithRetry(url,attempts=3){
  let last;
  for(let i=0;i<attempts;i++){
    try{
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),12000);
      const response=await fetch(url,{signal:controller.signal,cache:'no-store'});
      clearTimeout(timer);
      if(!response.ok)throw new Error(`${url} -> HTTP ${response.status}`);
      return response;
    }catch(error){last=error;if(i<attempts-1)await new Promise(r=>setTimeout(r,700*(i+1)))}
  }
  throw last;
}

// accounts.google.com/gsi/client may intentionally return 403 to non-browser CI bots.
// Its exact browser script URL is checked statically above; the public Gmail REST discovery
// endpoint remains a live network gate here.
const discovery=await fetchWithRetry('https://gmail.googleapis.com/$discovery/rest?version=v1');
const discoveryJson=await discovery.json();
assert(discoveryJson?.name==='gmail','Gmail discovery document unavailable');
assert(discoveryJson?.resources?.users?.resources?.messages?.methods?.list,'Gmail messages.list missing from discovery');
assert(discoveryJson?.resources?.users?.resources?.messages?.methods?.get,'Gmail messages.get missing from discovery');
console.log('MAIL_PUBLIC_ENDPOINTS_OK');
console.log('CHINESE_LAYER_MAIL_SMOKE_PASS');
