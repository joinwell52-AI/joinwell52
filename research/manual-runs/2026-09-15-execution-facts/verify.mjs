import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex');
if(fs.existsSync(path.join(root,'file-manifest.json')))for(const e of read('file-manifest.json'))assert.equal(hash(e.path),e.sha256,e.path);
if(process.argv.includes('--sources'))for(const e of read('sources/code-hashes.json'))assert.equal(hash(e.path),e.sha256,e.path);
const sdk=read('runs/sdk.json');assert.equal(sdk.length,2);
for(const run of sdk){const rows=JSON.parse(run.output.split('\n').find(s=>s.startsWith('MATRIX_JSON=')).slice(12));assert.equal(rows.length,10);const head=run.mode==='head';for(const key of ['string-always','integer-one','null','object']){const row=rows.find(r=>r.setting===key);assert.equal(row.tool_invocations,head?0:1);if(head)assert.equal(row.error.type,'UserError');}assert.equal(rows.find(r=>r.setting==='callable-null').tool_invocations,1);assert.equal(rows.find(r=>r.setting==='true').pending_approvals,1);assert.match(run.output,head?/31 passed/:/1 failed, 30 passed/);assert.equal(run.exit_code,head?0:1);}
const crew=read('runs/crew.json').results;assert.equal(crew.length,16);for(const r of crew){const expected=r.scenario==='effect-then-error'?r.attempt_limit*(r.mode==='base'?2:1):1;assert.equal(r.invocations,expected);assert.equal(r.committed_rows,expected);}
const orca=read('runs/orca.json').results;assert.equal(orca.length,20);
const get=(mode,kind,scenario)=>orca.find(r=>r.mode===mode&&r.kind===kind&&r.scenario===scenario).observed;
assert.deepEqual(get('base','reconciliation','empty-consistent'),[{clientMessageId:'cm-1',outcome:'rejected',reason:'not_delivered'}]);
assert.deepEqual(get('head','reconciliation','empty-consistent'),[{clientMessageId:'cm-1',outcome:'unknown',reason:'unmatched'}]);
for(const mode of ['base','head']){const r=get(mode,'send-disposition','recovered-rejection');assert.equal(r.entryState,mode==='base'?'queued':'unconfirmed');assert.equal(Boolean(r.retryWithFreshClientMessageId),mode==='base');assert.equal(get(mode,'send-disposition','accepted').entryState,'removed');}
const paper=read('runs/paperclip.json').results;assert.equal(paper.length,14);for(const r of paper){const paused=['already-paused','pause-after-precheck','resume-after-block','company-paused-by-budget'].includes(r.scenario);assert.equal(r.observed.escalated,r.scenario==='unblocked'||(r.mode==='head'&&paused)?0:1);assert.equal(r.observed.skipped,r.mode==='head'&&paused?1:0);}
console.log('Saved evidence verified: SDK 20 input observations + original 31-test comparisons; CrewAI 16; Orca 20; Paperclip 14. This is not a rerun of experiments.');
