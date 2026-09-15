import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const esbuild=require('esbuild');
const root=path.dirname(fileURLToPath(import.meta.url));
async function load(mode,file){const b=await esbuild.build({entryPoints:[`${root}/external/orca-20723-${mode}/${file}`],bundle:true,platform:'node',format:'esm',write:false,logLevel:'silent'});return import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));}
const results=[];
for(const mode of ['base','head']){
 const rec=await load(mode,'src/main/native-chat/agent-session-journal/journal-submission-reconciler.ts');
 const send=await load(mode,'src/shared/structured-agent-session-send-disposition.ts');
 const outbox=await load(mode,'src/shared/structured-agent-session-outbox.ts');
 const submission={clientMessageId:'cm-1',fence:1,payloadFingerprint:'same-payload',dispatchState:'unknown',providerItemId:null,reason:null,submittedAt:10,resolvedAt:null};
 const item={providerItemId:'provider-item',clientMessageId:'cm-1',payloadFingerprint:'same-payload',identity:{provider:'claude',sessionId:'session-1',uuid:'uuid-1'}};
 const scenarios=[['positive-id',[item],true,false],['empty-consistent',[],true,false],['empty-inconsistent',[],false,false],['in-flight',[],true,true],['ambiguous-payload',[{...item,clientMessageId:null},{...item,providerItemId:'provider-item-2',clientMessageId:null}],true,false]];
 for(const [scenario,items,boundaryConsistent,turnInFlight] of scenarios){results.push({mode,kind:'reconciliation',scenario,observed:rec.reconcileSubmissions({submissions:[submission],history:{items,boundaryConsistent,turnInFlight}})});}
 const entry=outbox.createStructuredAgentSessionOutboxEntry({clientMessageId:'cm-1',sessionId:'session-1',text:'synthetic',attachments:[],queuedAt:1});
 for(const [scenario,dispatchState,recovered] of [['direct-rejection','rejected',false],['recovered-rejection','rejected',true],['recovered-unknown','unknown',true],['unknown','unknown',false],['accepted','accepted',false]]){
  const d=send.disposeStructuredAgentSessionSendResult({entries:[entry],entry,blockedClientMessageId:null,result:{ok:true,value:{submission:{...submission,dispatchState,recovered,reason:dispatchState==='rejected'?'not_delivered':null}}},createOperationId:()=> 'synthetic-new-id'});
  results.push({mode,kind:'send-disposition',scenario,observed:{entryState:d.entries[0]?.state??'removed',retryWithFreshClientMessageId:d.retryWithFreshClientMessageId,retryAfterUnknownSubmittedAt:d.entries[0]?.retryAfterUnknownSubmittedAt}});
 }
}
console.log(JSON.stringify({method:'Bundled complete pinned production modules and their real local imports; synthetic in-memory journal rows. No Claude process, wire transport, persisted journal or actual resend.',results},null,2));
