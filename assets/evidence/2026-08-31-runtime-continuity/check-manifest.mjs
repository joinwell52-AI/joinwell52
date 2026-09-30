import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,dirname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=dirname(fileURLToPath(import.meta.url));
const manifest=JSON.parse(readFileSync(resolve(root,'manifest.json'),'utf8'));
for(const entry of manifest.files){
 const path=resolve(root,entry.path);
 assert.ok(path.startsWith(root+sep),'manifest path leaves package');
 const actual=createHash('sha256').update(readFileSync(path)).digest('hex');
 assert.equal(actual,entry.sha256,'changed file: '+entry.path);
}
console.log(JSON.stringify({result:'PASS',files:manifest.files.length,scope:'Integrity relative to included manifest, not independent attestation'}));
