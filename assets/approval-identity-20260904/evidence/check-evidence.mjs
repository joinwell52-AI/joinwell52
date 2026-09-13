import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root=dirname(fileURLToPath(import.meta.url));
const load=f=>JSON.parse(readFileSync(resolve(root,f),'utf8'));
const manifest=load('manifest.json');
for(const f of manifest.files)assert.equal(createHash('sha256').update(readFileSync(resolve(root,f.file))).digest('hex'),f.sha256,f.file);
const d=load('observations.json');
assert.equal(d.external_effectful_calls,0);
assert.equal(d.baseline_tests.runs.length,2);
for(const r of d.baseline_tests.runs){assert.equal(r.exit_code,0);assert.deepEqual(r.counts,{tests:31,pass:31,fail:0,skipped:0});}
assert.equal(d.approval_matrix.length,22);assert.equal(d.assertion_failures.length,4);assert.equal(d.probe_exit_code,1);
for(const round of [1,2]){
  const rows=d.approval_matrix.filter(x=>x.round===round);assert.equal(new Set(rows.map(x=>x.name)).size,11);
  for(const name of ['same-session','different-target']){const r=rows.find(x=>x.name===name);assert.equal(r.first.decision,'ALLOW');assert.equal(r.first.authorization.status,'consumed');assert.equal(r.replay.code,'APPROVAL_ALREADY_CONSUMED');}
  for(const name of ['delivered-resume','other-session','missing-session','different-agent','different-task','different-thread','different-project','different-source-channel','cancelled'])assert.equal(rows.find(x=>x.name===name).first.decision,'REQUIRE_APPROVAL');
  const comparisons=d.field_comparisons.filter(x=>x.round===round);assert.equal(comparisons.length,7);
  for(const name of ['branch','remote','force','delete']){const r=comparisons.find(x=>x.name===name);assert.equal(r.original_fingerprint,r.changed_fingerprint);assert.equal(r.original_digest,r.changed_digest);assert.deepEqual(r.request_differences,[]);}
  const session=comparisons.find(x=>x.name==='new-session');assert.equal(session.original_fingerprint,session.changed_fingerprint);assert.notEqual(session.original_digest,session.changed_digest);assert.equal(session.counterfactual_nested_session_removed_digest_matches,true);
  const task=comparisons.find(x=>x.name==='other-task');assert.notEqual(task.original_digest,task.changed_digest);
  const codex=d.codex_resolution.filter(x=>x.round===round);assert.equal(codex.length,2);for(const r of codex){assert.equal(r.actual.allow,true);assert.equal(r.after_authorization.status,'consumed');}
  const lineage=d.lineage_controls.filter(x=>x.round===round);assert.equal(lineage.length,6);for(const r of lineage)assert.equal(r.actual.decision??r.actual.disposition,r.expected);
}
console.log('RECORDED EVIDENCE CONSISTENT; PRODUCT COUNTEREXAMPLES REMAIN');
