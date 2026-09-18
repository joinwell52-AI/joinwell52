// Public static assets only. Does not authenticate, read mail or change production data.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base='https://joinwell52-ai.github.io/joinwell52/chinese-layer/';
const root='docs/public/chinese-layer/';
const {version}=JSON.parse(await fs.readFile(root+'version.json','utf8'));
const names=['index.html','app.js','launcher.js','dev-live-refresh-0.5.2.js','gmail-config.js','gmail.js','ios-pwa-hotfix-0.6.1.js','styles.css','manifest.webmanifest','sw.js','version.json'];
const checks=[];
for(const name of names){
  const local=await fs.readFile(root+name);
  const u=new URL(name==='index.html'?'./':name,base);
  u.searchParams.set('v',version);u.searchParams.set('_verify',String(Date.now()));
  const response=await fetch(u,{cache:'no-store',signal:AbortSignal.timeout(30000)});
  assert.ok(response.ok,`${name}: HTTP ${response.status}`);
  const live=Buffer.from(await response.arrayBuffer());
  assert.ok(local.equals(live),`${name}: live bytes differ from checked-out candidate`);
  checks.push({name,status:response.status,sha256:createHash('sha256').update(live).digest('hex')});
}
console.log(JSON.stringify({status:'PASS',version,url:base,checks,validation:'public deployed asset bytes only',realIphoneInteraction:'NOT_RUN',realGmailOAuth:'NOT_RUN'},null,2));
