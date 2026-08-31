import assert from 'node:assert/strict';
import {mkdirSync,mkdtempSync,readFileSync,writeFileSync,appendFileSync,renameSync,existsSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {spawnSync,execFileSync} from 'node:child_process';

const source=resolve(process.argv[2]), out=resolve(process.argv[3]);
mkdirSync(out,{recursive:true});
const mod=async (p:string)=>import(pathToFileURL(join(source,'packages/codeflowmu-runtime/src',p)).href);
const {OperationApprovalService}=await mod('approval/OperationApprovalService.ts');
const {ControlledExecutorRegistry}=await mod('approval/ControlledExecutorRegistry.ts');
const save=(p:string,v:any)=>writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const lines=(p:string)=>existsSync(p)?readFileSync(p,'utf8').trim().split('\n').filter(Boolean).map(v=>JSON.parse(v)):[];
const request=(root:string,agent=false)=>({
 subject:{actor:agent?'DEV-01':'ADMIN',role:agent?'DEV':'ADMIN',project_id:'fixture-project',
 ...(agent?{agent_id:'DEV-01',session_id:'session-1',task_id:'TASK-1'}:{})},
 action:{capability:'git.remote.push',operation:'push_branch',executor:'git.push'},
 resource:{type:'fixture',targets:['fixture-target'],scope:{revision:'fixture-1'}},
 context:{workspace:root,environment:'research',initiated_by:agent?'agent':'user',authorization_source:'none'},
 effect:{external_write:true},snapshot:{revision:'fixture-1'},
});
const prep=(r:any)=>({request:r,reason:'isolated fixture',effects:['local file only'],non_effects:['no network effect'],recovery:'retain all artifacts'});
const catchError=async(fn:()=>any)=>{try{await fn();return null;}catch(e:any){return {name:e.name,code:e.code??null,message:e.message};}};

// Each phase is a separate process. This is controlled exit/restart, not a killed process.
if(process.argv[4]==='phase'){
 const variant=process.argv[5], phase=process.argv[6], root=out;
 const id='APPROVAL-RESEARCH',audit=join(root,'.codeflowmu/operation-approvals/audit.jsonl');
 const effect=join(root,'effects.jsonl'),calls=join(root,'calls.jsonl');
 const recordPath=join(root,'.codeflowmu/operation-approvals/records',id+'.json');
 const r=request(root),service=new OperationApprovalService({projectRoot:root,idFactory:()=>id});
 const snapshot=(stage:string,seq:number)=>{
   const row=read(recordPath);
   save(join(root,stage+'.json'),{stage,seq,owner:'fixture-run-'+variant,
     approval:{approval_id:id,status:row.status,execution_status:row.execution?.status??null,
       evidence:row.execution?.evidence??[]},effects:lines(effect),executor_calls:lines(calls).length});
 };
 const registry=new ControlledExecutorRegistry(true).register({name:'git.push',
   prepare:()=>prep(r),preview:()=>({synthetic:true}),recovery:()=>({retain:true}),
   recomputeRequest:()=> variant==='changed-digest'&&phase==='resume'
      ? {...r,snapshot:{revision:'fixture-2'}}:r,
   execute:async()=>{
     appendFileSync(calls,JSON.stringify({phase})+'\n');
     if(variant!=='idempotent'||lines(effect).length===0)
       appendFileSync(effect,JSON.stringify({effect_id:'E'+(lines(effect).length+1),operation_key:'fixture-key',kind:'local-marker'})+'\n');
     if(phase==='fault'){
       snapshot('01-effect-observed',1);
       renameSync(audit,audit+'.saved');mkdirSync(audit);
     }
     return {evidence:[{kind:'local-marker',observed_count:lines(effect).length}]};
   }});
 let error:any=null;
 if(phase==='fault'){
   const prepared=service.prepare(await registry.prepare('git.push',{}));
   assert.equal(prepared.decision,'REQUIRE_APPROVAL');
   const approved=service.approve(id,'ADMIN','fixture approval');snapshot('00-approved',0);
   error=await catchError(()=>service.execute(id,approved.execution_token,r,row=>registry.execute(row)));
   assert.equal(error?.code,'EISDIR');assert.equal(read(recordPath).status,'failed');
   snapshot('02-failed-return',2);
   renameSync(audit,audit+'.fault-directory');renameSync(audit+'.saved',audit);
 }else{
   const prior=service.get(id);const current=await registry.recomputeRequest(prior);
   error=await catchError(()=>service.resumeApprovedManualExecution(id,current,row=>registry.execute(row)));
   snapshot('03-resume-return',3);
 }
 save(join(root,phase+'-process.json'),{pid:process.pid,phase,variant,error,
   effects:lines(effect).length,calls:lines(calls).length,status:read(recordPath).status});
 console.log(JSON.stringify({variant,phase,effects:lines(effect).length,error_code:error?.code??null}));
 process.exit(0);
}

const runRoot=mkdtempSync(join(out,'run-'));
const loader=pathToFileURL(join(source,'packages/codeflowmu-runtime/node_modules/tsx/dist/loader.mjs')).href;
const restarts:any[]=[];
for(const variant of ['non-idempotent','idempotent','changed-digest']){
 const root=join(runRoot,variant);mkdirSync(root);
 for(const phase of ['fault','resume']){
   const args=['--import',loader,fileURLToPath(import.meta.url),source,root,'phase',variant,phase];
   const p=spawnSync(process.execPath,args,{encoding:'utf8',timeout:60000});
   writeFileSync(join(root,phase+'.stdout.log'),p.stdout??'');writeFileSync(join(root,phase+'.stderr.log'),p.stderr??'');
   assert.equal(p.status,0,p.stderr);assert.equal(p.error,undefined);
 }
 const fault=read(join(root,'fault-process.json')),resume=read(join(root,'resume-process.json'));
 assert.notEqual(fault.pid,resume.pid);assert.equal(fault.effects,1);
 assert.equal(resume.effects,variant==='non-idempotent'?2:1);
 assert.equal(resume.calls,variant==='changed-digest'?1:2);
 if(variant==='changed-digest')assert.ok(resume.error);else assert.equal(resume.error,null);
 restarts.push({variant,fault,resume,fixture:root});
}

const authorization:any[]=[];
const variants=['same-session','resumed-session','project','agent','task','thread','role','fingerprint','empty-session','target','snapshot'];
for(const variant of variants){
 const root=join(runRoot,'authorization-'+variant);mkdirSync(root);
 const service=new OperationApprovalService({projectRoot:root,idFactory:()=> 'APPROVAL-'+variant});
 const r=request(root,true),p=service.prepare({...prep(r),operation_fingerprint:'sha256:fixture',thread_key:'thread-1'});
 assert.equal(p.decision,'REQUIRE_APPROVAL');service.approve(p.approval.approval_id,'ADMIN','fixture');
 const context:any={project_id:'fixture-project',operation_fingerprint:'sha256:fixture',agent_id:'DEV-01',
 session_id:'session-1',task_id:'TASK-1',thread_key:'thread-1',role:'DEV'};
 const current:any=structuredClone(r);
 const key:any={project:'project_id',agent:'agent_id',task:'task_id',thread:'thread_key',role:'role',fingerprint:'operation_fingerprint'};
 if(key[variant])context[key[variant]]='different';
 if(variant==='resumed-session'){context.session_id='session-2';current.subject.session_id='session-2';}
 if(variant==='empty-session'){context.session_id='';current.subject.session_id='';}
 if(variant==='target')current.resource.targets=['another-target'];
 if(variant==='snapshot')current.snapshot={revision:'fixture-2'};
 const result=service.consumeApprovedAuthorization(current,context),allowed=['same-session','resumed-session'].includes(variant);
 assert.equal(Boolean(result),allowed);
 const again=allowed?await catchError(()=>service.consumeApprovedAuthorization(current,context)):null;
 if(allowed)assert.equal(again?.code,'APPROVAL_ALREADY_CONSUMED');
 authorization.push({variant,accepted:Boolean(result),authorization_status:result?.authorization?.status??null,
   consumed_session:result?.authorization?.consumed_by?.session_id??null,second_error:again?.code??null});
 save(join(root,'observation.json'),authorization.at(-1));
}

const {SessionStore}=await mod('session/SessionStore.ts');
const {maybeRecordPlaybookSkillFromToolCall,resetPlaybookSkillDedupeForTests}=await mod('pm/SkillInvocationFromToolCall.ts');
const {skillInvocationJournalPath,verifySkillInvocationIntegrity}=await mod('pm/SkillInvocationJournal.ts');
const bindings:any[]=[];
for(const variant of ['verified','resumed-verified','unregistered','wrong-agent','wrong-task','wrong-thread','sessionless','missing-reason']){
 resetPlaybookSkillDedupeForTests();
 const root=join(runRoot,'skill-'+variant);mkdirSync(join(root,'docs/skills'),{recursive:true});
 save(join(root,'docs/skills/agent-skills.manifest.json'),{version:1,pm_playbook_skills:[{id:'pm-tech-scope',display_name:'fixture skill',skill_package:'skills/pm-tech-scope/SKILL.md',doc:'docs/skills/pm-playbook/tech-scope.md'}]});
 const store=new SessionStore({dir:join(root,'.codeflowmu/state/sessions')});
 for(const id of ['session-1','session-2'])await store.save({protocol:{session_id:id,agent_id:'PM-01',task_id:'TASK-1',
 started_at:new Date().toISOString(),status:'running',runs:[]},runtime_thread_key:'thread-1'});
 const input:any={projectRoot:root,sessionStore:store,agent_id:'PM-01',session_id:'session-1',task_id:'TASK-1',thread_key:'thread-1',
 payload:{raw:{path:'skills/pm-tech-scope/SKILL.md'}}};
 if(variant==='resumed-verified')input.session_id='session-2';
 if(variant==='unregistered')input.session_id='unregistered';
 if(variant==='wrong-agent')input.agent_id='PM-OTHER';
 if(variant==='wrong-task')input.task_id='TASK-OTHER';
 if(variant==='wrong-thread')input.thread_key='thread-other';
 if(['sessionless','missing-reason'].includes(variant))delete input.session_id;
 if(variant==='sessionless')input.sessionless_reason='fixture-system-operation';
 await maybeRecordPlaybookSkillFromToolCall(input);
 const entry=lines(skillInvocationJournalPath(root)).at(-1);assert.ok(entry);
 const expected=variant.includes('verified')?'verified':variant==='sessionless'?'not_applicable':'invalid_claim';
 assert.equal(entry.session_binding,expected);
 const integrity_verified=await verifySkillInvocationIntegrity(root,entry);
 const tampered_rejected=!(await verifySkillInvocationIntegrity(root,{...entry,task_id:'tampered-task'}));
 assert.equal(integrity_verified,true);assert.equal(tampered_rejected,true);
 bindings.push({variant,session_binding:entry.session_binding,binding_reason:entry.binding_reason,
 session_id:entry.session_id??null,task_id:entry.task_id??null,thread_key:entry.thread_key??null,
 integrity_verified,tampered_rejected});
 save(join(root,'observation.json'),bindings.at(-1));
}
const result={schema_version:1,created_at:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8'}).trim(),
 runRoot,method:'Actual product services, synthetic local executors; no HTTP, provider login, or external side effects.',
 restarts,authorization,bindings};
save(join(runRoot,'results.json'),result);save(join(out,'latest-run.json'),{runRoot});
console.log(JSON.stringify({runRoot,restarts:restarts.map(r=>({variant:r.variant,effects:r.resume.effects,error:r.resume.error?.code})),authorization,bindings},null,2));
