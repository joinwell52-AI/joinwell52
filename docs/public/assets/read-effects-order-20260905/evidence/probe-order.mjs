import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, open, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const exec=promisify(execFile);
function evaluate(records,mode,cutoff=Infinity) {
  let selected=records.filter(r=>r.accepted!==false);
  if(mode==='acceptance') {
    if(selected.some(r=>!Number.isSafeInteger(r.acceptance_seq)) || new Set(selected.map(r=>r.acceptance_seq)).size!==selected.length) return 'unknown';
    selected=selected.filter(r=>r.acceptance_seq<=cutoff).sort((a,b)=>a.acceptance_seq-b.acceptance_seq);
  }
  let authorized=false;
  for(const r of selected) {
    if(r.op==='allow') authorized=true;
    if(r.op==='revoke') authorized=false;
  }
  return authorized?'allow':'deny';
}
if(process.argv[2]==='replay') {
  const records=(await readFile(process.argv[3],'utf8')).trim().split('\n').map(JSON.parse);
  console.log(JSON.stringify({pid:process.pid,record_order:records.map(r=>r.id),recording:evaluate(records,'recording'),acceptance:evaluate(records,'acceptance'),at_first_acceptance:evaluate(records,'acceptance',1)}));
} else {
  await mkdir(path.join(here,'fixtures'),{recursive:true});await mkdir(path.join(here,'runs'),{recursive:true});
  const cases=[
    {id:'O0-order-preserved',ops:['allow','revoke'],schedule:[0,1],expected:['deny','deny']},
    {id:'O1-allow-then-revoke-inverted',ops:['allow','revoke'],schedule:[1,0],expected:['allow','deny']},
    {id:'O2-revoke-then-allow-inverted',ops:['revoke','allow'],schedule:[1,0],expected:['deny','allow']},
    {id:'O3-same-operation-control',ops:['revoke','revoke'],schedule:[1,0],expected:['deny','deny']},
    {id:'O4-rejected-input',ops:['revoke','allow'],schedule:[0,1],reject:1,expected:['deny','deny']},
    {id:'O5-missing-sequence',ops:['allow','revoke'],schedule:[1,0],missing:0,expected:['allow','unknown']},
    {id:'O6-duplicate-sequence',ops:['allow','revoke'],schedule:[1,0],duplicate:true,expected:['allow','unknown']},
  ];
  const rows=[];
  for(let round=1;round<=2;round++) for(const c of cases) {
    const root=await mkdtemp(path.join(here,'fixtures','order-'));
    const records=c.ops.map((op,i)=>({id:`input-${i+1}`,op,acceptance_seq:c.duplicate?1:i+1,accepted:c.reject!==i}));
    if(c.missing!==undefined) delete records[c.missing].acceptance_seq;
    // Acceptance journal and persisted order are intentionally different artifacts.
    await writeFile(path.join(root,'accepted.json'),JSON.stringify(records,null,2));
    const log=path.join(root,'persisted.jsonl');
    const h=await open(log,'wx');
    for(const i of c.schedule) {await h.write(JSON.stringify(records[i])+'\n');await h.sync();}
    await h.close();
    const result=JSON.parse((await exec(process.execPath,[fileURLToPath(import.meta.url),'replay',log],{windowsHide:true})).stdout);
    assert.notEqual(result.pid,process.pid);assert.deepEqual([result.recording,result.acceptance],c.expected);
    const first=records.filter(r=>r.accepted!==false).find(r=>r.acceptance_seq===1);
    const expectedCutoff=c.missing!==undefined || c.duplicate ? 'unknown' : first?.op==='allow' ? 'allow':'deny';
    assert.equal(result.at_first_acceptance,expectedCutoff);
    rows.push({round,id:c.id,fixture:root,received_order:records.map(r=>r.id),accepted_order:records.filter(r=>r.accepted!==false).map(r=>r.id),persistence_schedule:c.schedule,...result});
  }
  const out=path.join(here,'runs',`order-${Date.now()}.json`);
  await writeFile(out,JSON.stringify({created_at:new Date().toISOString(),method:'deterministically forced completion order; fresh-process replay; synthetic reducer, NOT CodeFlowMu recovery',rows},null,2));
  console.log(JSON.stringify({out,rows},null,2));
}
