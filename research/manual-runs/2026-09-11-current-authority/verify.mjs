import {readFileSync,existsSync,readdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('./',import.meta.url),read=p=>readFileSync(new URL(p,root)),json=p=>JSON.parse(read(p));
const hash=x=>createHash('sha256').update(x).digest('hex');
if(process.argv.includes('--freeze')){
 const files=[];
 for(const dir of ['','runs/','sources/','covers/']){
  if(!existsSync(new URL(dir,root)))continue;
  for(const entry of readdirSync(new URL(dir,root),{withFileTypes:true})){
   const p=dir+entry.name;
   if(!entry.isFile()||p==='file-manifest.json'||/release-record|prepare-public|package-public|sdk-base-helper/.test(p))continue;
   if(/\.(md|json|mjs|py|log)$/.test(p))files.push({path:p,sha256:hash(read(p))});
  }
 }
 writeFileSync(new URL('file-manifest.json',root),JSON.stringify(files,null,2)+'\n');
}
for(const f of json('file-manifest.json'))assert.equal(hash(read(f.path)),f.sha256,f.path);
const sdk=json('runs/sdk.json'),orca=json('runs/orca.json'),sup=json('runs/superset.json');
assert.equal(sdk.outcomes[0].cases.length,10);assert.equal(sdk.outcomes[0].exit_code,0);assert(sdk.outcomes[0].cases.every(x=>!x.failed));
assert.equal(sdk.outcomes[1].cases.length,10);assert.equal(sdk.outcomes[1].exit_code,1);assert(sdk.outcomes[1].cases.every(x=>x.failed&&/call.missing/i.test(x.message)));
assert.equal(orca.observations.length,16);assert.equal(sup.observations.length,9);assert(sup.observations.every(x=>x.actual===x.expected));
assert.equal(json('sources/index.json').length,9);
if(process.argv.includes('--sources'))for(const f of json('sources/code-manifest.json'))assert.equal(hash(read(f.local)),f.sha256,f.local);
console.log('PASS: saved observations and frozen file hashes agree. This verification does not rerun experiments.');
