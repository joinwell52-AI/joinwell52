import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const article=dirname(fileURLToPath(import.meta.url)),root=dirname(article),out=join(article,'evidence');
mkdirSync(out,{recursive:true});
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const researchManifest=JSON.parse(readFileSync(join(root,'evidence-manifest.json'),'utf8'));
const inputs=['runs/baseline-results.json','runs/probe-2026-09-04T05-41-19-249Z.json','runs/causal-2026-09-04T06-05-11-964Z.json'];
const raw=inputs.map(p=>{assert.equal(hash(join(root,p)),researchManifest.files.find(f=>f.file===p)?.sha256,p);return JSON.parse(readFileSync(join(root,p),'utf8'));});
const [baseline,probe,causal]=raw;
const roots=new Set();
function gather(v){if(!v||typeof v!=='object')return;for(const [k,x]of Object.entries(v)){if(['fixture','projectRoot','workspace','project_root_realpath'].includes(k)&&typeof x==='string'&&/^[A-Z]:[\\/]/i.test(x))roots.add(x);gather(x);}}
gather(probe);gather(causal);
const replacements=[...roots].sort().map((r,i)=>[r,`<SYNTHETIC_FIXTURE_${String(i+1).padStart(3,'0')}>`]).sort((a,b)=>b[0].length-a[0].length);
function sanitize(v){if(typeof v==='string'){for(const [a,b]of replacements)v=v.split(a).join(b);return v;}if(Array.isArray(v))return v.map(sanitize);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).filter(([k])=>k!=='pid'&&k!=='parent_pid').map(([k,x])=>[k,sanitize(x)]));return v;}
const data={schema_version:'1.0',baseline:baseline.baseline,experiment_date:'2026-09-04',status:'OBSERVED_COUNTEREXAMPLES; NOT_FIXED; NOT_QA_ACCEPTANCE',external_effectful_calls:0,baseline_tests:{tests:baseline.tests,runs:baseline.runs.map(r=>({started:r.started,finished:r.finished,exit_code:r.exit_code,counts:r.counts,raw_log_sha256:r.sha256}))},approval_matrix:sanitize(probe.authorization),assertion_failures:sanitize(probe.failures),probe_exit_code:1,field_comparisons:sanitize(causal.comparisons),codex_resolution:sanitize(causal.codex_resolution),lineage_controls:sanitize(probe.lineage),source_records:inputs.map(p=>({file:p,sha256:hash(join(root,p))})),redaction:{fixture_paths:'Replaced with consistent synthetic fixture labels; labels are not executable paths.',process_ids:'Omitted; cross-process execution is implemented by the source research runner.',operation_digests:'Original observed values retained. Do not recompute from path-redacted inputs.',ordering:'Array order, rounds, timestamps, outcomes and failures retained.',excluded:'Privacy side experiment and incomplete authoring/debug runs are outside the article dataset.'}};
writeFileSync(join(out,'observations.json'),JSON.stringify(data,null,2)+'\n');
const sources=JSON.parse(readFileSync(join(root,'sources/manifest.json'),'utf8'));
const selected=sources.sources.filter(s=>s.repo==='openai/codex'&&[42588,42579].includes(s.id)).map(s=>({repo:s.repo,id:s.id,url:`https://github.com/${s.repo}/pull/${s.id}`,title:s.title,state:s.state,merged_at:s.merged_at,head_sha:s.head_sha,merge_sha:s.merge_sha,source_snapshot_sha256:s.sha256}));
writeFileSync(join(out,'sources.json'),JSON.stringify({checked_at:sources.collected_at,sources:selected,local_baseline:baseline.baseline,local_sources:researchManifest.product_sources},null,2)+'\n');
for(const file of ['observations.json','sources.json'])assert.ok(!/[A-Z]:[\\/]/.test(readFileSync(join(out,file),'utf8')),`local path remained: ${file}`);
const files=readdirSync(out).filter(f=>f!=='manifest.json');
files.push('../2026-09-04-approval-operation-identity.zh.md','../2026-09-04-approval-operation-identity.en.md','../article-brief.md','../export-evidence.mjs');
files.push(...['approval-identity-cover-v2.png','approval-identity-cover-v2-thumb.png','cover-brief-v2.json','cover-review-v2.md','operation-collapse.zh.svg','operation-collapse.zh.png','operation-collapse.en.svg','operation-collapse.en.png','nested-session.zh.svg','nested-session.zh.png','nested-session.en.svg','nested-session.en.png'].map(f=>'../assets/'+f));
writeFileSync(join(out,'manifest.json'),JSON.stringify({schema_version:'1.0',created_at:new Date().toISOString(),purpose:'Integrity of the prepared bilingual article package, not independent verification of the product',files:files.map(file=>({file,sha256:hash(join(out,file))}))},null,2)+'\n');
console.log(JSON.stringify({exported:true,observations:out,fixture_labels:replacements.length,files:files.length}));
