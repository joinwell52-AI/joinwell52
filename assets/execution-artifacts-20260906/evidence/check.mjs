import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const read=p=>fs.readFileSync(path.join(dir,p),'utf8');
const o=JSON.parse(read('observations.json'));
assert.equal(o.boundaries.length,24);assert.equal(o.adapter.length,6);
assert.equal(o.baseline,'c008d9db91a21136fc61a4f60314e22db395d5d2');
assert.equal(new Set(o.boundaries.map(r=>r.round+':'+r.id)).size,24);
for(const round of [1,2]){
 const r=id=>o.boundaries.find(r=>r.round===round&&r.id.startsWith(id+'-'));
 for(const row of o.boundaries.filter(x=>x.round===round))assert.equal(row.probe_status,'completed');
 assert.equal(r('A0').effect_count,1);assert.equal(r('A0').replay,'APPROVAL_ALREADY_CONSUMED');
 assert.equal(r('A1').cancel_accepted,true);assert.equal(r('A1').effect_count,0);assert.equal(r('A1').status,'cancelled');
 assert.equal(r('A2').status,'expired');assert.equal(r('A2').effect_count,0);
 assert.equal(r('A3').status,'succeeded');assert.equal(r('A3').effect_count,1);
 assert.ok(Date.parse(r('A3').execution_started_at)>Date.parse(r('A3').expires_at));
 for(const id of ['A4','A5','A6']){assert.equal(r(id).cancel_accepted,false);assert.equal(r(id).cancel_error,'APPROVAL_NOT_PENDING');}
 assert.equal(r('A4').effect_count,1);assert.equal(r('A5').effect_count,0);assert.equal(r('A5').status,'failed');assert.equal(r('A6').effect_count,1);
 assert.equal(r('B0').equal,true);assert.equal(r('B1').error,'APPROVAL_STALE');assert.equal(r('B1').effect_count,0);
 assert.equal(r('B2').same_content,true);assert.equal(r('B2').equal,false);assert.equal(r('B3').equal,false);
 assert.equal(r('B4').history_status,'succeeded');assert.equal(r('B4').current_target_exists,false);assert.equal(r('B4').preserved_copy_exists,true);
 assert.equal(r('B4').child_read.digest,r('B4').receipt_after_digest);
 const a=o.adapter.filter(r=>r.round===round);assert.equal(a.length,3);
 for(const v of a)assert.equal(v.responses.length,v.scenario==='normal'?1:0);
 const log=read(`baseline-${round}.log`);for(const s of ['tests 39','pass 39','fail 0','skipped 0'])assert.ok(log.includes(s));
}
const manifest=JSON.parse(read('manifest.json'));
for(const e of manifest.files){
 assert.ok(!e.path.includes('..')&&!path.isAbsolute(e.path));
 const b=fs.readFileSync(path.join(dir,e.path));
 assert.equal(b.length,e.bytes,e.path);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),e.sha256,e.path);
}
console.log(JSON.stringify({result:'PASS',observations:30,baseline_rounds:2,baseline_tests_per_round:39,manifest_files:manifest.files.length,scope:'Exported records and integrity only; not product rerun or independent QA'},null,2));
