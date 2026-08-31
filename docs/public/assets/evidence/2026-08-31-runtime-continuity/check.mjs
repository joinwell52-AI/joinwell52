import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {digest,readAt,naiveRead} from './reader.mjs';
const root=dirname(fileURLToPath(import.meta.url)),read=p=>JSON.parse(readFileSync(join(root,p),'utf8'));
const restarts=read('fixtures/restart.json').variants;
assert.equal(restarts.length,3);
assert.equal(new Set(restarts.map(r=>r.variant)).size,3);
for(const r of restarts){
 assert.equal(r.separate_processes,true);assert.equal(r.before_retry.effects,1);assert.equal(r.before_retry.status,'failed');
 assert.equal(r.after_retry.effects,r.variant==='non-idempotent'?2:1);
 assert.equal(r.after_retry.calls,r.variant==='changed-digest'?1:2);
 assert.equal(r.after_retry.error,r.variant==='changed-digest'?'APPROVAL_STALE':null);
 const last=r.observations.at(-1);assert.equal(last.effects.length,r.after_retry.effects);assert.equal(last.executor_calls,r.after_retry.calls);
}
const auth=read('fixtures/authorization.json').rows;
assert.equal(new Set(auth.map(r=>r.variant)).size,11);
const repeats=read('fixtures/repeatability.json');assert.ok(repeats.length>=2);
assert.deepEqual(repeats[0].variants,repeats[1].variants);
assert.equal(auth.length,11);assert.equal(auth.filter(r=>r.accepted).length,2);
for(const r of auth){assert.equal(r.accepted,['same-session','resumed-session'].includes(r.variant));
 if(r.accepted)assert.equal(r.second_error,'APPROVAL_ALREADY_CONSUMED');}
const bindings=read('fixtures/session-binding.json').rows;
assert.equal(bindings.length,8);
assert.equal(new Set(bindings.map(r=>r.variant)).size,8);
for(const r of bindings){
 assert.equal(r.session_binding,r.variant.includes('verified')?'verified':r.variant==='sessionless'?'not_applicable':'invalid_claim');
 assert.equal(r.integrity_verified,true);assert.equal(r.tampered_rejected,true);
}
const historical=read('fixtures/historical-probes.json');assert.equal(historical.length,2);
const tap=readFileSync(join(root,'fixtures/existing-tests.log'),'utf8');
assert.match(tap,/# tests 28/);assert.match(tap,/# pass 28/);assert.match(tap,/# fail 0/);assert.match(tap,/# skipped 0/);
for(const baseline of historical){
 const p0=baseline.rows.find(r=>r.id==='P0'),p3=baseline.rows.find(r=>r.id==='P3');
 assert.equal(p0.effects,1);assert.equal(p0.retry_code,'APPROVAL_ALREADY_CONSUMED');
 assert.equal(p3.effectsBeforeRetry,1);assert.equal(p3.effectsAfterRetry,2);
 const p1=baseline.rows.find(r=>r.id==='P1'),p2=baseline.rows.find(r=>r.id==='P2');
 assert.equal(p1.status,'approved');assert.equal(p1.effects,0);assert.equal(p1.approvedEventPresent,false);
 assert.equal(p2.status,'executing');assert.equal(p2.effects,0);
 assert.equal(p1.error_code,'EISDIR');assert.equal(p2.error_code,'EISDIR');
}
const bench=read('fixtures/benchmark-summary.json');assert.equal(Object.values(bench.sources).reduce((a,b)=>a+b,0),1187);
assert.equal(bench.pooled.length,11);assert.equal(bench.pooled.find(r=>r.method==='flag_all').f1,.601);
assert.equal(bench.pooled.find(r=>r.method==='owasp_asi_combined').f1,.654);
const timeline=read('fixtures/timeline.json');const {owner,manifest,envelopes}=timeline;
assert.equal(envelopes.length,7);assert.equal(new Set(envelopes.map(e=>e.id)).size,7);
assert.equal(envelopes.filter(e=>e.kind==='approval-snapshot').length,4);
assert.equal(envelopes.filter(e=>e.kind==='effect-snapshot').length,3);
for(const e of envelopes)assert.equal(digest(e),manifest[e.id]);
const evaluate=(xs,cutoff,customManifest=manifest)=>readAt(xs,{owner,cutoff,manifest:customManifest});
const cases=[];
for(const cutoff of [0,1,2,3]){
 const result=evaluate(envelopes,cutoff);
 assert.equal(result.effect_count,[null,1,1,2][cutoff]);
 cases.push({id:'T'+cutoff,result});
}
const onlyRecords=envelopes.filter(e=>e.kind==='approval-snapshot');
const missing=evaluate(onlyRecords,2);assert.equal(missing.effect_observed,'unknown');
cases.push({id:'N1-missing-effect',result:missing});
const foreign=structuredClone(envelopes.find(e=>e.id==='effects-3'));
foreign.id='foreign-effects';foreign.owner='another-run';foreign.available_at=2;
const foreignInput=[...onlyRecords,foreign];
const foreignResult=evaluate(foreignInput,2,{...manifest,[foreign.id]:digest(foreign)});
assert.equal(foreignResult.effect_observed,'unknown');assert.ok(foreignResult.rejected.some(r=>r.reason==='wrong_owner'));
assert.equal(naiveRead(foreignInput).duplicate_observed,'yes');
cases.push({id:'N2-foreign-owner',result:foreignResult,naive:naiveRead(foreignInput)});
const futureResult=evaluate(envelopes,2);assert.equal(futureResult.duplicate_observed,'not_observed');
assert.equal(naiveRead(envelopes).duplicate_observed,'yes');
cases.push({id:'N3-future-evidence',result:futureResult,naive:naiveRead(envelopes)});
const tampered=structuredClone(envelopes.find(e=>e.id==='effects-2'));tampered.body.effects.push({effect_id:'forged'});
const badResult=evaluate([...onlyRecords,tampered],2);assert.equal(badResult.effect_observed,'unknown');
assert.ok(badResult.rejected.some(r=>r.reason==='integrity_or_unregistered'));
cases.push({id:'N4-tampered',result:badResult});

// Article-specific first-party counterexamples, not a product reliability score.
const failed=restarts.find(r=>r.variant==='non-idempotent').observations.find(o=>o.seq===2);
const resumed=restarts.find(r=>r.variant==='non-idempotent').observations.find(o=>o.seq===3);
assert.equal(failed.approval.status,'failed');assert.equal(failed.approval.execution_status,'failed');
assert.deepEqual(failed.approval.evidence,[{kind:'local-marker',observed_count:1}]);
assert.deepEqual(failed.effects.map(e=>e.effect_id),['E1']);
assert.deepEqual(resumed.effects.map(e=>e.effect_id),['E1','E2']);
assert.equal(new Set(resumed.effects.map(e=>e.operation_key)).size,1);
const nullSession=bindings.filter(r=>r.session_id===null);
assert.equal(nullSession.length,6);
assert.equal(nullSession.filter(r=>r.session_binding==='invalid_claim').length,5);
assert.equal(nullSession.filter(r=>r.session_binding==='not_applicable').length,1);
const t2=evaluate(envelopes,2),t3=evaluate(envelopes,3);
assert.equal(t2.accepted.length,5);assert.equal(t2.rejected.length,2);
assert.ok(t2.rejected.every(r=>r.reason==='after_cutoff'));
const snapshotRowSum=envelopes.filter(e=>e.kind==='effect-snapshot').reduce((sum,e)=>sum+e.body.effects.length,0);
assert.equal(snapshotRowSum,4);assert.equal(t3.effect_count,2);
console.log(JSON.stringify({result:'PASS',scope:'Captured-result consistency + executable research Reader, NOT independent product QA',
 restart_variants:3,authorization_cases:11,binding_cases:8,reader_cases:cases.length,benchmark_configs:1187,
 first_party_details:{failed_record_preserves_effect_evidence:true,resumed_distinct_effects_same_operation:2,
 authorization_accepted:2,authorization_not_accepted:9,binding_verified:2,binding_invalid_claim:5,binding_not_applicable:1,
 null_sessions:6,null_session_invalid_claim:5,null_session_not_applicable:1,
 timeline_envelopes:7,t2_admitted:5,t2_rejected_future:2,effect_snapshot_row_sum:4,t3_distinct_effects:2},cases},null,2));
