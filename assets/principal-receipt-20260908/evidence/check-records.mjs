import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import path from 'node:path';
const root=import.meta.dirname;
const load=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const manifest=load('manifest.json');
for(const entry of manifest.files){
  const bytes=fs.readFileSync(path.join(root,entry.file));
  assert.equal(bytes.length,entry.bytes,entry.file);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),entry.sha256,entry.file);
}
const runs=Array.from({length:6},(_,i)=>load(`observations-${i+1}.json`));
const row=(i,id)=>runs[i].rows.find(r=>r.id===id);
for(const [i,n] of [[0,18],[1,18],[2,8],[3,8],[4,4],[5,4]])assert.equal(runs[i].rows.length,n);
// Compare stable observation fields, not timestamps, source-byte hashes or machine process IDs.
const stable=r=>Object.fromEntries(Object.entries(r).filter(([k])=>!['source_sha256','process_count'].includes(k)));
for(const [a,b] of [[0,1],[2,3],[4,5]])assert.deepEqual(runs[a].rows.map(stable),runs[b].rows.map(stable));
for(const i of [0,1]){
  assert.equal(row(i,'A1-actor-change').calls,0);
  assert.equal(row(i,'A1-actor-change').error,'APPROVAL_STALE');
  assert.equal(row(i,'A2-session-change').calls,1);
  assert.equal(row(i,'A4-command-actor-change').second_reason,'idempotency_key_conflict');
  assert.equal(row(i,'R2-completion-corrupt').total_synthetic_callback_calls,2);
  assert.equal(row(i,'R8-lower-executor-dedup').total_synthetic_effects,1);
}
for(const i of [2,3]){
  for(let j=0;j<7;j++){assert.equal(row(i,`I${j}`).total_sdk_send_calls,1);assert.equal(row(i,`I${j}`).attempt_count,1);}
  assert.equal(row(i,'I7').total_sdk_send_calls,2); assert.equal(row(i,'I7').attempt_count,2);
  assert.equal(row(i,'I3').process_count,2);
  assert.equal(row(i,'I6').second_reason.length,8);
  assert(row(i,'I6').second_reason.every(r=>r==='task_already_dispatched'));
}
for(const i of [4,5]){
  assert.equal(row(i,'J1').trigger_chat_id,'CHAT-SYNTHETIC-001');assert.equal(row(i,'J2').trigger_chat_id,null);
  assert.equal(row(i,'J1').logical_execution_id,row(i,'J2').logical_execution_id);
  assert.equal(row(i,'J3').actor_change_digest_changed,true);
}
const h=load('history.json').datasets;
assert.deepEqual(h.map(d=>d.records),[1,10,25]);assert.equal(h[1].grain.unique_keys,5);assert.equal(h[2].nonempty_field_counts.session_id,9);
console.log('PASS: public file hashes, 60 saved observations, paired stable outcomes and article controls. NOT a new product run or independent QA.');
