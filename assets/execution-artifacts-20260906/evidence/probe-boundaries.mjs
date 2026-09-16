import assert from 'node:assert/strict';
import {mkdir,mkdtemp,writeFile,readFile,rename} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
const {OperationApprovalService,computeOperationDigest} = await import(pathToFileURL(path.join(process.env.CODEFLOWMU_SOURCE_ROOT ?? (()=>{throw Error('Set CODEFLOWMU_SOURCE_ROOT to authorized fixed-baseline source');})(), 'packages/codeflowmu-runtime/src/approval/OperationApprovalService.ts')).href);
const {buildWorkspaceOperationApprovalInput} = await import(pathToFileURL(path.join(process.env.CODEFLOWMU_SOURCE_ROOT ?? (()=>{throw Error('Set CODEFLOWMU_SOURCE_ROOT to authorized fixed-baseline source');})(), 'packages/codeflowmu-runtime/src/approval/WorkspaceOperationApproval.ts')).href);
const {executeWorkspaceOperation} = await import(pathToFileURL(path.join(process.env.CODEFLOWMU_SOURCE_ROOT ?? (()=>{throw Error('Set CODEFLOWMU_SOURCE_ROOT to authorized fixed-baseline source');})(), 'codeflowmu-shell/src/workspace-controlled-executors.ts')).href);

const here=path.dirname(fileURLToPath(import.meta.url));
await mkdir(path.join(here,'fixtures'),{recursive:true});
await mkdir(path.join(here,'runs'),{recursive:true});
const digest=b=>'sha256:'+createHash('sha256').update(b).digest('hex');
const rows=[];
function deferred(){let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};}
async function setup(id){
 const root=await mkdtemp(path.join(here,'fixtures',id+'-'));
 let now=new Date('2026-09-06T00:00:00Z');
 const service=new OperationApprovalService({projectRoot:root,now:()=>now});
 const input={projectRoot:root,executor:'workspace.fs.write',target:'output.txt',content:'synthetic-original',subject:{actor:'DEV-01',role:'DEV',project_id:'research',agent_id:'DEV-01',session_id:'synthetic-session',task_id:'TASK-SYNTHETIC'}};
 const prepInput=buildWorkspaceOperationApprovalInput(input);
 const prepared=service.prepare({...prepInput,expires_in_seconds:30});
 assert.equal(prepared.decision,'REQUIRE_APPROVAL');
 const approvalId=prepared.approval.approval_id;
 let executorInvocations=0,effectCount=0;
 const execute=async record=>{executorInvocations++;const result=await executeWorkspaceOperation(record);effectCount++;return result;};
 return {root,input,service,approvalId,request:prepInput.request,execute,approve:()=>service.approve(approvalId,'ADMIN','synthetic research authorization'),advance:()=>now=new Date(now.getTime()+31000),counts:()=>({executor_invocations:executorInvocations,effect_count:effectCount})};
}
async function capture(round,id,fn){try{rows.push({round,id,...await fn(),probe_status:'completed'});}catch(e){rows.push({round,id,probe_status:'unexpected_error',error:String(e),stack:e.stack});}}
for(let round=1;round<=2;round++){
 await capture(round,'A0-normal-and-replay',async()=>{
  const f=await setup('a0');const approved=f.approve();
  const done=await f.service.execute(f.approvalId,approved.execution_token,f.request,f.execute);
  let replay;try{await f.service.execute(f.approvalId,approved.execution_token,f.request,f.execute);}catch(e){replay=e.code;}
  assert.equal(done.status,'succeeded');assert.equal(replay,'APPROVAL_ALREADY_CONSUMED');assert.equal(f.counts().effect_count,1);
  return {...f.counts(),status:done.status,replay,root:f.root};
 });
 await capture(round,'A1-cancel-pending',async()=>{
  const f=await setup('a1');const cancelled=f.service.cancel(f.approvalId,'ADMIN','synthetic cancel');let error;
  try{await f.service.execute(f.approvalId,'not-an-issued-token',f.request,f.execute);}catch(e){error=e.code;}
  assert.equal(cancelled.status,'cancelled');assert.equal(f.counts().effect_count,0);
  return {...f.counts(),cancel_accepted:true,status:cancelled.status,error,root:f.root};
 });
 await capture(round,'A2-expire-pending',async()=>{
  const f=await setup('a2');f.advance();let error;try{f.approve();}catch(e){error=e.code;}
  const state=f.service.get(f.approvalId);assert.equal(state.status,'expired');
  return {...f.counts(),status:state.status,error,root:f.root};
 });
 await capture(round,'A3-expire-after-approval',async()=>{
  const f=await setup('a3');const approved=f.approve();f.advance();let error,done;
  try{done=await f.service.execute(f.approvalId,approved.execution_token,f.request,f.execute);}catch(e){error=e.code;}
  return {...f.counts(),status:done?.status??f.service.get(f.approvalId).status,error:error??null,expires_at:approved.approval.expires_at,execution_started_at:done?.execution.started_at??null,root:f.root};
 });
 for(const guarded of [false,true])await capture(round,guarded?'A5-wait-explicit-abort-control':'A4-wait-cancel-api',async()=>{
  const f=await setup(guarded?'a5':'a4');const approved=f.approve();const entered=deferred(),release=deferred();let abort=false,callbacks=0;
  const pending=f.service.execute(f.approvalId,approved.execution_token,f.request,async record=>{
   callbacks++;entered.resolve();await release.promise;
   if(guarded&&abort)throw Error('SYNTHETIC_ABORT_BEFORE_EFFECT');
   return f.execute(record);
  });
  await entered.promise;let cancelError=null;try{f.service.cancel(f.approvalId,'ADMIN','synthetic waiting cancel');}catch(e){cancelError=e.code;}
  const waitingStatus=f.service.get(f.approvalId).status;abort=true;release.resolve();const done=await pending;
  assert.equal(cancelError,'APPROVAL_NOT_PENDING');assert.equal(f.counts().effect_count,guarded?0:1);
  return {...f.counts(),callback_invocations:callbacks,cancel_accepted:cancelError===null,cancel_error:cancelError,waiting_status:waitingStatus,status:done.status,guard:guarded?'research callback only; not product implementation':'no injected guard',root:f.root};
 });
 await capture(round,'A6-cancel-after-effect',async()=>{
  const f=await setup('a6');const approved=f.approve();const effected=deferred(),finish=deferred();
  const pending=f.service.execute(f.approvalId,approved.execution_token,f.request,async record=>{const result=await f.execute(record);effected.resolve();await finish.promise;return result;});
  await effected.promise;let error=null;try{f.service.cancel(f.approvalId,'ADMIN','synthetic after-effect cancel');}catch(e){error=e.code;}
  finish.resolve();const done=await pending;assert.equal(f.counts().effect_count,1);
  return {...f.counts(),cancel_accepted:error===null,cancel_error:error,status:done.status,root:f.root};
 });
 await capture(round,'B0-same-request-stable',async()=>{
  const f=await setup('b0');const a=computeOperationDigest(f.request),b=computeOperationDigest(buildWorkspaceOperationApprovalInput(f.input).request);assert.equal(a,b);
  return {equal:true,digest:a,root:f.root};
 });
 await capture(round,'B1-target-drift-before-execute',async()=>{
  const f=await setup('b1');const approved=f.approve();await writeFile(path.join(f.root,'output.txt'),'synthetic-intervening');
  const current=buildWorkspaceOperationApprovalInput(f.input).request;let error;
  try{await f.service.execute(f.approvalId,approved.execution_token,current,f.execute);}catch(e){error=e.code;}
  assert.equal(error,'APPROVAL_STALE');assert.equal(f.counts().effect_count,0);
  return {...f.counts(),error,old_digest:computeOperationDigest(f.request),new_digest:computeOperationDigest(current),root:f.root};
 });
 await capture(round,'B2-same-bytes-other-workspace',async()=>{
  const f=await setup('b2');const second=await mkdtemp(path.join(here,'fixtures','b2-other-'));
  const a=buildWorkspaceOperationApprovalInput(f.input).request,b=buildWorkspaceOperationApprovalInput({...f.input,projectRoot:second}).request;
  assert.notEqual(computeOperationDigest(a),computeOperationDigest(b));
  return {equal:false,root:f.root,other_root:second,first:computeOperationDigest(a),second:computeOperationDigest(b),same_content:a.resource.scope.content_hash===b.resource.scope.content_hash};
 });
 await capture(round,'B3-other-task',async()=>{
  const f=await setup('b3');const other=buildWorkspaceOperationApprovalInput({...f.input,subject:{...f.input.subject,task_id:'TASK-OTHER'}}).request;
  assert.notEqual(computeOperationDigest(f.request),computeOperationDigest(other));return {equal:false,root:f.root};
 });
 await capture(round,'B4-history-versus-current-artifact',async()=>{
  const f=await setup('b4');const approved=f.approve();const done=await f.service.execute(f.approvalId,approved.execution_token,f.request,f.execute);
  const before=await readFile(path.join(f.root,'output.txt'));assert.equal(done.execution.evidence[0].after.sha256,digest(before));
  const child=`const fs=require('node:fs'),c=require('node:crypto');let b=fs.readFileSync(process.argv[1]);console.log(JSON.stringify({pid:process.pid,digest:'sha256:'+c.createHash('sha256').update(b).digest('hex')}))`;
  const reread=JSON.parse(execFileSync(process.execPath,['-e',child,path.join(f.root,'output.txt')],{encoding:'utf8',windowsHide:true}));
  assert.notEqual(reread.pid,process.pid);assert.equal(reread.digest,digest(before));
  // Recoverable rename within this generated fixture, not deletion or real workspace loss.
  await rename(path.join(f.root,'output.txt'),path.join(f.root,'output-preserved.txt'));
  const historical=new OperationApprovalService({projectRoot:f.root}).get(f.approvalId);
  return {...f.counts(),history_status:historical.status,current_target_exists:existsSync(path.join(f.root,'output.txt')),preserved_copy_exists:true,child_read:reread,receipt_after_digest:done.execution.evidence[0].after.sha256,root:f.root,interpretation:'historical execution receipt, not current artifact availability adjudication'};
 });
}
const output={schema_version:1,at:new Date().toISOString(),scope:'actual CFM approval + actual local workspace executor; injected callback waiting; no real Host or remote sandbox',rows};
const out=path.join(here,'runs',`boundaries-${Date.now()}.json`);await writeFile(out,JSON.stringify(output,null,2));
console.log(JSON.stringify({out,rows:rows.map(({root,other_root,...r})=>r)},null,2));
if(rows.some(r=>r.probe_status==='unexpected_error'))process.exitCode=1;
