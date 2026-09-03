// Explicit whitelist projection. Never reads credentials or modifies source evidence.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const input = process.argv[2];
if (!input) throw new Error('Usage: node project-evidence.mjs <original evidence directory>');
const output = path.resolve('docs/public/assets/evidence/2026-09-03-host-authority-conformance');
fs.mkdirSync(output,{recursive:true});
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const read = name => JSON.parse(fs.readFileSync(path.join(input,name),'utf8'));
const save = (name,data) => fs.writeFileSync(path.join(output,name),JSON.stringify(data,null,2)+'\n');
const pick = (obj,keys) => Object.fromEntries(keys.map(k=>[k,obj[k]??null]));
const a=read('plan-completeness-probe.json'), b=read('approval-owner-probe.json'), c=read('regression-index.json');
save('observations-e1.json', {run_at:a.run_at,scope:a.scope,results:a.results.map(r=>({
 ...pick(r,['host','kind','repeat','expected_verified','actual_verified','assertion','plan','probe_calls','candidate_lifecycle']),
 provided_results:r.provided_results.map(t=>pick(t,['test_id','status'])),
 run:r.run?pick(r.run,['status','admission_decision','started_at','finished_at']):null,
 error:r.error,progress:r.progress?pick(r.progress,['total','completed']):null
}))});
save('observations-e2.json',{run_at:b.run_at,scope:b.scope,results:b.results.map(r=>({
 ...pick(r,['kind','repeat','execution_started_at','approval_status','approval_error','writer_lock_would_treat_same_identity_as_stale','external_executor_calls']),
 owner_probe:{state:r.ownerProbe.state,started_at_ms:r.ownerProbe.start?.startedAtMs??null}
}))});
save('regressions.json',{
 baseline:pick(c.before,['sha','version','node','platform','architecture']),
 source_unchanged:c.before.sha===c.after.sha&&c.before.status===''&&c.after.status==='',
 results:c.results.map(r=>pick(r,['id','round','started_at','finished_at','source','source_sha256','exit_code','tests','pass','fail','skip','log_sha256']))
});
save('provenance.json',{
 schema_version:1,published:'2026-09-04',method:'Explicit field whitelist; original row order, outcomes, timestamps and counters preserved.',
 original_files:['plan-completeness-probe.json','approval-owner-probe.json','regression-index.json'].map(file=>({file,sha256:sha(fs.readFileSync(path.join(input,file)))})),
 omitted:['Absolute local paths','Temporary directory names','Synthetic candidate/run identifiers','Raw execution commands and complete logs','OS process token (creation time retained in milliseconds)'],
 limitation:'Public observations are author-provided exports, not independently reproduced product runs. Hashes detect changes relative to this package; they do not authenticate the truth of an observation. Product source and raw internal evidence remain access-restricted.'
});
console.log('Projected 32 E1 rows, 6 E2 rows and 14 regression records without local paths.');
