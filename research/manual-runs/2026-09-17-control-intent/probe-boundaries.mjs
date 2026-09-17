import assert from 'node:assert/strict';
import {read,between,compile,moduleAt,root} from './probe-lib.mjs';
process.on('uncaughtException',e=>{console.error(e.name+': '+e.message);process.exit(1)});
const rows={quota:[],manual:[],revoke:[],callback:[]};
for(const mode of ['base','head']){
 const s=await read(`external/quota-${mode}/server/src/services/recovery/service.ts`);
 const u=await read(`external/quota-${mode}/packages/adapter-utils/src/server-utils.ts`);
 const parse=between(u,'export function parseObject(', '\nexport function ');
 const helper=between(s,'function readNonEmptyString(', '\nfunction ');
 const chunk=between(s,'export const PROVIDER_QUOTA_RECOVERY_DEFAULT_BACKOFF_MS','type ContinuationRetryClassification');
 const {classifyAdapterFailureForRecovery:classify}=await compile(parse+'\n'+helper+'\n'+chunk);
 const now=new Date('2026-09-16T04:50:00Z');
 const cases=[['session-limit','acpx_turn_failed',"You've hit your session limit · resets 9:20pm (Pacific/Auckland)",{}],['plain-failure','acpx_turn_failed','socket closed',{}],['missing-key','acpx_turn_failed','missing API key',{}],['adapter-missing','adapter_failed','missing API key',{}],['quota-no-clock','acpx_turn_failed','usage limit reached',{}],['structured-time','acpx_turn_failed','quota exceeded',{retryNotBefore:'2026-09-16T12:00:00Z'}],['unknown-code','another_failed','quota exceeded',{}],['invalid-zone','acpx_turn_failed','usage limit reached resets 9pm (Not/AZone)',{}],['negated-wording','acpx_turn_failed','No quota exceeded. Socket failed.',{}]];
 for(const [name,errorCode,error,resultJson]of cases)rows.quota.push({mode,case:name,observed:classify({errorCode,error,resultJson},now)});
}
for(const mode of ['base','head']){
 const dir=`external/manual-${mode}/src/main/codex/`;
 const plugin={name:'narrow-error-import',setup(b){b.onResolve({filter:/^\.\/codex-app-server-connection$/},()=>({path:root+dir+'codex-app-server-request-error.ts'}));}};
 const {openCodexThread}=await moduleAt(dir+'codex-structured-thread-open.ts',[plugin]);
 let policyFn;if(mode==='head')policyFn=(await moduleAt(dir+'codex-structured-permission-policy.ts')).codexStructuredPermissionPolicyForSettings;
 for(const posture of ['Manual','Yolo','Unset','Quoted'])for(const resume of [false,true]){
  const args={Manual:'',Yolo:'--dangerously-bypass-approvals-and-sandbox',Quoted:'--config "note=--dangerously-bypass-approvals-and-sandbox only text"'};
  const settings=posture==='Unset'?{}:{agentDefaultArgs:{codex:args[posture]}};const policy=policyFn?.(settings);
  const calls=[];const connection={request:async(method,params)=>{calls.push({method,params});return {thread:{id:'thread-fixture'},approvalPolicy:'never',sandbox:'dangerFullAccess'};}};
  const result=await openCodexThread(connection,{cwd:'C:/synthetic',resumeThreadId:resume?'thread-fixture':null,...(policy?{permissionPolicy:policy}:{})},1000);
  rows.manual.push({mode,posture,resume,request:calls[0],mismatchedPolicyReplyAccepted:result.threadId==='thread-fixture'});
 }
}
const rp='external/revoke-head/';
const rewire={name:'original-schema',setup(b){b.onResolve({filter:/^@paperclipai\/shared$/},()=>({path:root+rp+'packages/shared/src/validators/secret.ts'}));}};
const rev=await moduleAt(rp+'server/src/services/agent-secret-bindings.ts',[rewire]);
const id='11111111-1111-4111-8111-111111111111',second='22222222-2222-4222-8222-222222222222';
const ref=secretId=>({type:'secret_ref',secretId});
const original={env:{DEMO:ref(id),KEEP:ref(second)},top:ref(id),ordinary:'keep'};
let projection=[];const sync=async config=>rev.syncAgentAdapterEnvBindings({companyId:'fixture',agentId:'fixture',adapterConfig:config,secretsSvc:{syncSecretRefsForTarget:async(c,t,refs)=>{projection=structuredClone(refs);}}});
await sync(original);projection=projection.filter(x=>x.configPath!=='env.DEMO');await sync(original);rows.revoke.push({case:'delete-projection-only',returned:projection.some(x=>x.configPath==='env.DEMO'),remaining:projection.map(x=>x.configPath)});
for(const path of ['env.DEMO','top','env.MISSING']){const next=rev.removeSecretRefAtConfigPath(original,path);await sync(next);rows.revoke.push({case:'remove-source:'+path,remaining:projection.map(x=>x.configPath),originalUnchanged:original.env.DEMO.secretId===id,lookup:rev.getSecretRefAtConfigPath(next,path)});}
const cp=await read('external/callback-head/apps/api/src/app/api/integrations/slack/events/process-agent-completion/process-agent-completion.ts');
const {agentTurnState}=await compile(between(cp,'export function agentTurnState(', '\nasync function probeAgentTurn('));
for(const kind of ['Stop','Failed','PermissionRequest','Start','ended-binding','no-terminal','process-running','process-stopped']){
 const input=['Stop','Failed','PermissionRequest','Start'].includes(kind)?{binding:{terminalId:'t',lastEventType:kind}}:kind==='ended-binding'?{binding:{terminalId:'t',lastEventType:'Stop',endedAt:1}}:kind==='no-terminal'?{}:{terminal:{terminalId:'t',exited:false},processRunning:kind==='process-running'};
 rows.callback.push({case:kind,input,result:agentTurnState(input)});
}
assert.equal(rows.quota[0].observed,null);assert.equal(rows.quota[9].observed.retryAt.toISOString(),'2026-09-16T09:20:00.000Z');
assert.equal(rows.manual.find(r=>r.mode==='head'&&r.posture==='Manual').request.params.approvalPolicy,'on-request');
assert.equal(rows.revoke[0].returned,true);assert.equal(rows.revoke[1].lookup,null);
console.log(JSON.stringify({method:{quota:'Exact classifier block and its original parsing helpers extracted by checked source anchors; no recovery scheduler or provider invoked.',manual:'Complete original thread-open and permission modules; request recording seam returns a deliberately mismatched effective policy. No real Codex provider or model call.',revoke:'Complete original binding module and original Zod schema; sync sink is an in-memory projection substitute, not database or authenticated revoke route.',callback:'Exact original agentTurnState function; synthetic host snapshots, not Slack delivery.'},rows},null,2));
