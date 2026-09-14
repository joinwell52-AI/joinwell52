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
   if(!entry.isFile()||p==='file-manifest.json'||/release-record|prepare-public/.test(p))continue;
   if(/\.(md|json|mjs|py|log)$/.test(p))files.push({path:p,sha256:hash(read(p))});
  }
 }
 writeFileSync(new URL('file-manifest.json',root),JSON.stringify(files,null,2)+'\n');
}
for(const f of json('file-manifest.json'))assert.equal(hash(read(f.path)),f.sha256,f.path);
const d=json('runs/dispatch.json').observations,s=json('runs/sdk.json').outcomes,b=json('runs/brief.json').observations;
for(const [v,n,pass] of [['base',5,2],['head',5,5],['quota-head',11,11]]){const rows=d.filter(x=>x.version===v);assert.equal(rows.length,n);assert.equal(rows.filter(x=>x.passed).length,pass);assert(rows.every(x=>x.errors===0));}
assert.equal(s.length,2);for(const [i,n]of [[0,5],[1,1]]){assert.equal(s[i].cases.length,5);assert.equal(s[i].cases.filter(x=>x.passed).length,n);assert.equal(s[i].exit_code,i);}
assert.equal(b.length,14);for(const id of ['ordinary-resume-after-edit','second-ordinary-resume']){assert.equal(b.find(x=>x.id===id&&x.version==='base').actual,'task ID only');assert.equal(b.find(x=>x.id===id&&x.version==='head').actual,'CURRENT BRIEF revision 2');}
assert.equal(json('sources/index.json').length,16);assert.equal(json('sources/code-manifest.json').length,22);
if(process.argv.includes('--sources'))for(const f of json('sources/code-manifest.json'))assert.equal(hash(read(f.local)),f.sha256,f.local);
for(const f of json('covers/manifest.json'))assert.equal(hash(read(f.path)),f.sha256,f.path);
console.log('PASS: frozen hashes and saved observations agree; this does not rerun experiments.');
