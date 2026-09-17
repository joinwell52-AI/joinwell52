import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const root='docs/public/chinese-layer/';
const app=await fs.readFile(root+'app.js','utf8');
const meta=JSON.parse(await fs.readFile(root+'version.json','utf8'));
const start=app.indexOf('function versionParts(');
const end=app.indexOf('function switchView(',start);
assert.ok(start>0&&end>start,'locate the actual update controller');
const elements=new Map();
const query=id=>{
  if(!elements.has(id)){
    const classes=new Set(['hidden']);
    elements.set(id,{textContent:'',dataset:{},classList:{add:c=>classes.add(c),remove:c=>classes.delete(c),contains:c=>classes.has(c)}});
  }
  return elements.get(id);
};
const stored=new Map([['cl-last-app-version','0.5.1']]);
let remote=meta.version;let failed=false;const navigations=[];
const context=vm.createContext({
  $:query,text:v=>v==null?'':String(v),URL,Date,
  fetch:async()=>({ok:!failed,json:async()=>({version:remote})}),
  localStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)},
  location:{href:'https://example.test/chinese-layer/',replace:u=>navigations.push(u)}
});
const versionLine=app.match(/^const APP_VERSION='[^']+';/m)?.[0];
assert.ok(versionLine);assert.ok(versionLine.includes(meta.version));
vm.runInContext(`${versionLine}\nconst state={remoteVersion:APP_VERSION};\n${app.slice(start,end)}`,context);
const run=code=>vm.runInContext(code,context);
const hidden=()=>query('#updateBanner').classList.contains('hidden');
assert.equal(run("isNewerVersion('0.6.1','0.6.1')"),false);
assert.equal(run("isNewerVersion('0.6.2','0.6.1')"),true);
assert.equal(run("isNewerVersion('0.6.1','0.6.2')"),false);
assert.equal(run("isNewerVersion('0.10.0','0.9.9')"),true);
await run('checkForUpdate()');assert.ok(hidden());assert.equal(stored.get('cl-last-app-version'),meta.version);
await run('checkForUpdate(true)');assert.equal(query('#updateText').textContent,`当前已是 v${meta.version}`);
run('forceUpdate()');assert.ok(hidden());assert.equal(navigations.length,0);
remote='0.5.1';await run('checkForUpdate()');assert.ok(hidden());
remote='99.0.0';await run('checkForUpdate()');assert.ok(!hidden());
assert.equal(query('#updateNow').dataset.action,'update');
failed=true;await run('checkForUpdate(true)');assert.equal(query('#updateNow').dataset.action,'dismiss');
run('forceUpdate()');assert.ok(hidden());assert.equal(navigations.length,0);
failed=false;await run('checkForUpdate()');run('forceUpdate()');assert.equal(navigations.length,1);
assert.equal(new URL(navigations[0]).searchParams.get('version'),'99.0.0');
remote=meta.version;await run('checkForUpdate()');assert.ok(hidden());
await run(`(async()=>{
  const original=fetch;let release;let calls=0;
  fetch=async()=>++calls===1?new Promise(resolve=>{release=()=>resolve({ok:true,json:async()=>({version:'99.0.0'})})}):({ok:true,json:async()=>({version:APP_VERSION})});
  try{const old=checkForUpdate();await checkForUpdate();release();await old}finally{fetch=original}
})()`);
assert.ok(hidden());
console.log(JSON.stringify({status:'PASS',version:meta.version,source:'actual app.js controller',checks:16,realIphoneOAuth:'NOT_RUN'}));
