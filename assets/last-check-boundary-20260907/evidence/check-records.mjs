import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const sha=b=>createHash('sha256').update(b).digest('hex');
const manifest=JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8'));
for(const entry of manifest.files){assert.equal(path.basename(entry.path),entry.path);const b=await readFile(path.join(root,entry.path));assert.equal(b.length,entry.bytes);assert.equal(sha(b),entry.sha256);}
const data=JSON.parse(await readFile(path.join(root,'observations.json'),'utf8'));
assert.equal(data.rows.length,12);assert.equal(data.pilot_included,false);
assert.equal(new Set(data.rows.map(r=>r.id+':'+r.round)).size,12);
const expected=[['succeeded','new-target',1],['failed','old-target',1],['succeeded','source-before',1],['succeeded','source-before',1],['stale','old-target',0],['succeeded','source-after',1]];
for(let i=0;i<6;i++)for(const round of [1,2]){
 const row=data.rows.find(r=>r.id===`E${i}`&&r.round===round);assert.ok(row);
 assert.deepEqual([row.status,row.target_bytes,row.callback_calls],expected[i]);assert.equal(row.record_overwrite,i>=4);
 assert.equal(row.target_digest,'sha256:'+sha(row.target_bytes));
 if(i>=2)assert.equal(row.approved_source_digest,'sha256:'+sha('source-before'));
 if(i===1)assert.equal(row.error,'target_exists_and_overwrite_is_false');
 if(i===3)assert.equal(row.source_exists,false);
 if(i===4)assert.equal(row.error,'APPROVAL_STALE');
 if(i===5){assert.notEqual(row.target_digest,row.approved_source_digest);assert.ok(row.injection);}
}
const sources=JSON.parse(await readFile(path.join(root,'sources.json'),'utf8'));
assert.equal(sources.length,13);assert.equal(sources.filter(s=>s.merged).length,5);
console.log(JSON.stringify({result:'EVIDENCE_RECORD_CHECK_PASS',observations:12,manifest_files:manifest.files.length,product_rerun:false,independent_qa:false}));
