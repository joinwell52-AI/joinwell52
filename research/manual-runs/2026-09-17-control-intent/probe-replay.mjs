import fs from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';
import {compile,root} from './probe-lib.mjs';
process.on('uncaughtException',e=>{console.error(e.name+': '+e.message);process.exit(1)});
const o=await compile(`export * from './src/main/runtime/agent-session-record-store';export * from './src/main/runtime/rpc/methods/agent-launch-replay';export * from './src/main/native-chat/agent-session-wire/structured-agent-session-registry';export * from './src/shared/agent-launch-operation';`,root+'external/replay-head');
const directory=await fs.mkdtemp(path.join(os.tmpdir(),'research-replay-'));const rows=[];
let store=await o.AgentSessionRecordStore.open({directory,hostId:'local'});o.setStructuredAgentSessionHost({deps:{store}});
const context={runtime:{ensureStructuredAgentSessionHost:async()=>{}},clientKind:'mobile',pairedDeviceId:'synthetic-device',clientId:'token-a'};
const intent={agent:'claude',target:{kind:'existing',worktree:'id:synthetic'}};
const fp=o.computeAgentLaunchFingerprint(intent);const now=Date.now();const id=n=>`${now}-${n.toString(16).padStart(32,'0')}`;
const admit=(n,ctx=context,fingerprint=fp)=>o.admitAgentLaunchOperation(ctx,{...intent,operationId:id(n)},fingerprint,now);
const result={outcome:{kind:'terminal',handle:'synthetic-terminal'},worktreeId:'synthetic-workspace',receipt:{mode:'terminal',preferred:'structured',reason:'fixture',detail:'synthetic effect result'}};
try{
 const a=await admit(1);assert.equal(a.decision,'execute');await a.settle(result);rows.push({case:'initial-settled',decision:a.decision});
 const retry=await admit(1);assert.deepEqual(retry.result,result);rows.push({case:'lost-response-retry',decision:retry.decision,exactResult:JSON.stringify(retry.result)===JSON.stringify(result)});
 store=await o.AgentSessionRecordStore.open({directory,hostId:'local'});o.setStructuredAgentSessionHost({deps:{store}});
 const restarted=await admit(1);rows.push({case:'store-reopen',decision:restarted.decision,exactResult:JSON.stringify(restarted.result)===JSON.stringify(result)});
 const changed=await admit(1,context,o.computeAgentLaunchFingerprint({...intent,prompt:{text:'different',delivery:'submit'}}));rows.push({case:'changed-intent',decision:changed.decision,code:changed.refusal?.code});
 const rotated=await admit(1,{...context,clientId:'token-b'});rows.push({case:'rotated-bearer-same-device',decision:rotated.decision});
 const second=await admit(1,{...context,pairedDeviceId:'another-device'});rows.push({case:'different-device',decision:second.decision});
 await admit(2);store=await o.AgentSessionRecordStore.open({directory,hostId:'local'});o.setStructuredAgentSessionHost({deps:{store}});const unknown=await admit(2);rows.push({case:'unsettled-store-reopen',decision:unknown.decision,code:unknown.refusal?.code});
 const parallel=await Promise.all(Array.from({length:8},()=>admit(3)));rows.push({case:'eight-concurrent-admissions',execute:parallel.filter(x=>x.decision==='execute').length,refuseUnknown:parallel.filter(x=>x.refusal?.code==='agent_session_operation_unknown').length});
 const failure=await admit(4);await failure.fail('worktree_not_found');const failed=await admit(4);rows.push({case:'recorded-failure',decision:failed.decision,code:failed.refusal?.code});
 let missing;try{await admit(5,{...context,pairedDeviceId:undefined})}catch(e){missing=e.message}rows.push({case:'remote-identity-missing',error:missing});
 const oldId=`${now-7*24*3600000}-${'f'.repeat(32)}`;const expired=await o.admitAgentLaunchOperation(context,{...intent,operationId:oldId},fp,now);rows.push({case:'old-unseen-id',decision:expired.decision,code:expired.refusal?.code});
 assert.equal(rows.find(r=>r.case==='eight-concurrent-admissions').execute,1);assert.equal(unknown.refusal.code,'agent_session_operation_unknown');
 console.log(JSON.stringify({method:'Unmodified original durable record store plus original launch admission and fingerprint functions, real Windows temporary files and file locks. Store reopened in same process to exercise disk reload; no forced process crash, mobile client, RPC handler live-join or real Agent/Workspace launch. Eight concurrent calls directly to admission: one owner, seven conservative unknown refusals; public handler may join live retries above this boundary.',rows},null,2));
}finally{o.setStructuredAgentSessionHost(null);const rel=path.relative(os.tmpdir(),directory);assert(rel&&!rel.startsWith('..')&&!path.isAbsolute(rel)&&path.basename(directory).startsWith('research-replay-'));await fs.rm(directory,{recursive:true,force:true});}
