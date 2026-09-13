// Read-only checker for exported observations; does not launch CodeFlowMu or an Agent.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=n=>JSON.parse(fs.readFileSync(path.join(root,n),'utf8'));
const manifest=read('manifest.json');
for(const f of manifest.files){
 assert.equal(path.basename(f.file),f.file,'Manifest path must be a basename');
 const bytes=fs.readFileSync(path.join(root,f.file));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),f.sha256,f.file);
}
const e1=read('observations-e1.json').results,e2=read('observations-e2.json').results,reg=read('regressions.json');
assert.equal(e1.length,32);
const bad=new Set(['empty','partial','duplicate','unknown-id']);
for(const host of ['cursor','codex']) for(const repeat of [1,2]) {
 const rows=e1.filter(r=>r.host===host&&r.repeat===repeat);
 assert.equal(rows.length,8);
 assert.deepEqual(rows.map(r=>r.kind).sort(),['full','empty','partial','duplicate','unknown-id','blocked','failed','throws'].sort());
 for(const r of rows){
  assert.equal(r.plan.length,4);
  assert.equal(r.probe_calls,1);
  const ids=r.provided_results.map(x=>x.test_id);
  const complete=ids.length===r.plan.length&&new Set(ids).size===ids.length&&ids.every(id=>r.plan.includes(id));
  if(bad.has(r.kind)){ assert.equal(complete,false); assert.equal(r.assertion,'COUNTEREXAMPLE'); }
  if(r.kind==='full') assert.equal(complete,true);
  if(bad.has(r.kind)||r.kind==='full'){assert.equal(r.actual_verified,true);assert.equal(r.run.status,'PASS');assert.equal(r.run.admission_decision,'VERIFIED');}
  else assert.equal(r.actual_verified,false);
  if(r.kind==='empty'){assert.equal(ids.length,0);assert.equal(r.progress.completed,0);}
  if(r.kind==='blocked'){assert.equal(r.run.status,'BLOCKED');assert.equal(r.run.admission_decision,'PENDING');}
  if(r.kind==='failed'){assert.equal(r.run.status,'FAIL');assert.equal(r.run.admission_decision,'PENDING');}
  if(r.kind==='throws'){assert.equal(r.run,null);assert.equal(r.error,'CONTROLLED_PROBE_EXCEPTION');}
 }
}
assert.equal(e1.filter(r=>r.assertion==='COUNTEREXAMPLE').length,16);
assert.equal(e2.length,6);
for(const repeat of [1,2]){
 const rows=e2.filter(r=>r.repeat===repeat);
 assert.deepEqual(rows.map(r=>r.kind).sort(),['live-current','dead-old','reused-pid-fixture'].sort());
 for(const r of rows){
  assert.equal(r.external_executor_calls,0);
  assert.equal(r.approval_status,r.kind==='dead-old'?'partial_failed':'executing');
  assert.equal(r.writer_lock_would_treat_same_identity_as_stale,r.kind!=='live-current');
  if(r.kind==='reused-pid-fixture'){assert.equal(r.owner_probe.state,'running');assert.ok(r.owner_probe.started_at_ms>Date.parse(r.execution_started_at));}
 }
}
assert.equal(reg.source_unchanged,true);
assert.equal(reg.baseline.sha,'5c94d8c3b0147b779b17f620b811c6a17cc65288');
assert.equal(reg.results.length,14);
for(const round of [1,2]){
 const rows=reg.results.filter(r=>r.round===round);
 assert.equal(rows.length,7);
 assert.equal(rows.reduce((sum,r)=>sum+r.pass,0),41);
 for(const r of rows){assert.equal(r.exit_code,0);assert.equal(r.fail,0);assert.equal(r.skip,0);}
}
console.log('PASS / 通过: package hashes; E1 32 observations / 16 counterexamples; E2 6 observations / 0 executor calls; regressions 41 pass, 0 fail, 0 skip per round.');
console.log('Observation consistency only—not a product rerun or independent QA. 仅核对公开观察数据，不是产品复跑或独立 QA。');
