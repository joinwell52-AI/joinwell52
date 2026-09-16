import fs from 'node:fs';import {createRequire} from 'node:module';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),esbuild=require('esbuild'),root=decodeURIComponent(new URL('.',import.meta.url).pathname).replace(/^\/(\w:)/,'$1').replace(/\/$/,'');
const rows=[];
for(const mode of ['base','head']){
 const source=fs.readFileSync(`${root}/external/paperclip-13494-${mode}/server/src/services/recovery/service.ts`,'utf8');
 for(const name of ['escalateStrandedAssignedIssue','escalateStrandedRecoveryIssueInPlace','escalateDispositionRepair']){
  const start=source.indexOf('async function '+name+'('),end=source.indexOf('if (!updated) return null;',start);assert(start>=0&&end>start);const fragment=source.slice(start,end)+'return updated; }';
  const code=`export async function probe(env){const {issuesSvc,existingUnresolvedBlockerIssueIds,ensureSourceScopedStrandedRecoveryAction,ensureProviderQuotaWaitRecoveryMonitor,resolveStrandedRecoveryCause,db}=env;const isStrandedIssueRecoveryIssue=()=>false;const ensureDispositionRepairAction=async()=>({id:'action',evidence:{}});const issueRecoveryActions={id:'id',companyId:'company'};const eq=()=>true,and=()=>true;const DISPOSITION_REPAIR_MAX_ATTEMPTS=2,STRANDED_BOARD_ESCALATION_POLICY='board';${fragment}return ${name}(env.input);}`;
  const built=await esbuild.transform(code,{loader:'ts',format:'esm'});const {probe}=await import('data:text/javascript;base64,'+Buffer.from(built.code).toString('base64'));
  for(const scenario of name==='escalateStrandedAssignedIssue'?['no-blocker','formal-blocker','quota-monitor']:['ordinary']){
   let monitor=0,payload;const issue={id:'synthetic-task',companyId:'synthetic-company',assigneeAgentId:'unable-agent',status:'in_progress'};
   const env={input:{issue,previousStatus:'in_progress',latestRun:null,fingerprint:'synthetic',attemptCount:2,terminalReason:'synthetic-failure'},issuesSvc:{update:async(id,p)=>{payload=p;return {...issue,...p}}},existingUnresolvedBlockerIssueIds:async()=>scenario==='formal-blocker'?['blocker-task']:[],ensureSourceScopedStrandedRecoveryAction:async()=>({id:'recovery',nextAction:'Inspect and explicitly retry or reassign',ownerAgentId:null,returnOwnerAgentId:scenario==='quota-monitor'?'unable-agent':null}),ensureProviderQuotaWaitRecoveryMonitor:async()=>{monitor++},resolveStrandedRecoveryCause:()=>scenario==='quota-monitor'?'provider_quota':'ordinary',db:{update:()=>({set:()=>({where:async()=>{}})})}};
   await probe(env);rows.push({mode,function:name,scenario,write:payload,quotaMonitorRequests:monitor});
  }
 }
}
const routable=fs.readFileSync(`${root}/external/paperclip-13494-head/server/src/services/routable-blocked.ts`,'utf8');const b=await esbuild.transform(routable,{loader:'ts',format:'esm'});const r=await import('data:text/javascript;base64,'+Buffer.from(b.code).toString('base64'));const notification=[];
for(const owner of ['board',{agentId:'available-agent'}]){let wakes=0;const delivered=await r.deliverAgentUnblockNotification({issue:{id:'synthetic-task',status:'blocked',blockedTransitionAt:new Date('2026-09-16T00:00:00Z'),unblockDescriptor:{owner,action:'Inspect'}},wakeup:async()=>{wakes++},markNotified:async()=>{}});notification.push({owner,delivered,wakes});}
assert.equal(rows.filter(r=>r.mode==='head'&&r.write.unblockDescriptor?.owner==='board').length,3);assert.equal(rows.filter(r=>r.mode==='base'&&r.write.unblockDescriptor).length,0);assert.equal(notification[0].wakes,0);assert.equal(notification[1].wakes,1);
console.log(JSON.stringify({method:'Pinned unchanged escalation function prefixes through the first issue update; collaborators record writes, not PostgreSQL. Complete original notification function with wake recorder. Three recovery sites, not fourth heartbeat site or real board queue.',rows,notification},null,2));
