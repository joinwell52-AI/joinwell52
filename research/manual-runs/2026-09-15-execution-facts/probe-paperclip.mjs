import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const esbuild=require('esbuild');
const root=path.dirname(fileURLToPath(import.meta.url));
const results=[];
for(const mode of ['base','head']) {
 const budgets=fs.readFileSync(`${root}/external/paperclip-13443-${mode}/server/src/services/budgets.ts`,'utf8');
 const service=fs.readFileSync(`${root}/external/paperclip-13443-${mode}/server/src/services/recovery/service.ts`,'utf8');
 const arrow=budgets.slice(budgets.indexOf('getInvocationBlock: async (')+'getInvocationBlock: '.length,budgets.indexOf('\n    resolveIncident: async (')).trim().replace(/,$/,'');
 const section=service.slice(service.indexOf('async function reconcileStrandedAssignedIssues'));
 const marker=mode==='head'?'const invocationBlock = await readInvocationBlock(issue, agentId);':'if (await isInvocationBudgetBlocked(issue, agentId))';
 if(!section.includes(marker))throw Error('Missing recovery branch');
 const block=section.slice(section.indexOf(marker),section.indexOf('const nativeUnblockAction',section.indexOf(marker)));
 let precheck='',helper='';
 if(mode==='head') {
  const begin=service.indexOf('async function isCompanyPaused(');
  helper=service.slice(begin,service.indexOf('\n  }',begin)+4);
  const beginCheck=section.indexOf('if (await isCompanyPaused(issue.companyId))');
  precheck=section.slice(beginCheck,section.indexOf('\n      }',beginCheck)+8);
  if(!precheck.includes('continue;'))throw Error('Missing live pause check');
 }
 if(mode==='base') {const begin=service.indexOf('async function isInvocationBudgetBlocked(');helper=service.slice(begin,service.indexOf('\n  }',begin)+4);}
 const source=`export async function probe(env){const {db,agents,companies,budgetPolicies,projects,eq,and,notFound,computeObservedAmount,result,issue,agentId,readAfterBlock,afterPrecheck,escalateStrandedAssignedIssue}=env;const getInvocationBlock=${arrow};${helper}
 const readInvocationBlock=async(i,a)=>{const b=await getInvocationBlock(i.companyId,a);env.block=b;readAfterBlock();return b;};
 const budgets={getInvocationBlock:async(c,a,context)=>{const b=await getInvocationBlock(c,a,context);env.block=b;readAfterBlock();return b;}};
 const latestRun={};const classifyContinuationFailure=()=>({kind:'ordinary_failure'});const readDispositionRepairAttempt=()=>false;const reconcileDispositionRepair=()=>{throw Error('unreached');};const EXECUTION_REVIEW_PARTICIPANT_RECOVERY_REASON='review';
 for(const issue of [env.issue]){${precheck}afterPrecheck();${block}result.clear++;}return result;}`;
 const built=await esbuild.transform(source,{loader:'ts',format:'esm'});
 const mod=await import('data:text/javascript;base64,'+Buffer.from(built.code).toString('base64'));
 for(const scenario of ['already-paused','pause-after-precheck','resume-after-block','active-company-budget','active-agent-budget','unblocked','company-paused-by-budget']) {
  let company={name:'Synthetic company',status:scenario.startsWith('already')||scenario==='resume-after-block'||scenario==='company-paused-by-budget'?'paused':'active',pauseReason:scenario==='company-paused-by-budget'?'budget':null};
  // To reach the block-observation/resume race, the early check sees active.
  if(scenario==='resume-after-block')company.status='active';
  const agent={name:'Synthetic agent',companyId:'co',status:scenario==='active-agent-budget'?'paused':'idle',pauseReason:scenario==='active-agent-budget'?'budget':null};
  const tables=Object.fromEntries(['agents','companies','budgetPolicies','projects'].map(name=>[name,new Proxy({table:name},{get:(t,p)=>p==='table'?name:`${name}.${String(p)}`})]));
  const env={...tables,result:{skipped:0,escalated:0,issueIds:[],clear:0},issue:{id:'issue-1',companyId:'co',status:'in_progress'},agentId:'agent-1',block:null,
   eq:(key,value)=>({key,value}),and:(...conditions)=>conditions,notFound:m=>Error(m),computeObservedAmount:async()=>100,
   afterPrecheck:()=>{if(['pause-after-precheck','resume-after-block'].includes(scenario))company.status='paused';},
   readAfterBlock:()=>{if(scenario==='resume-after-block')company.status='active';},
   escalateStrandedAssignedIssue:async()=>{env.result.persistedStatus='blocked';return {id:'issue-1'};}
  };
  env.db={select:()=>({from:table=>({where:conditions=>Promise.resolve(table.table==='agents'?[{...agent}]:table.table==='companies'?[{...company}]:table.table==='budgetPolicies'&&scenario==='active-company-budget'&&conditions.some(c=>c.key==='budgetPolicies.scopeType'&&c.value==='company')?[{hardStopEnabled:true,amount:100}]:[])})})};
  const observed=await mod.probe(env);
  results.push({mode,scenario,block:env.block,companyStatusAfter:company.status,observed});
 }
}
console.log(JSON.stringify({method:'Extracted unchanged getInvocationBlock arrow, recovery invocation-block branch, and candidate live-pause precheck from pinned source; TypeScript transformed by esbuild. Scripted in-memory database rows and escalation recorder. This does not run the full recovery service, PostgreSQL, transactions, or concurrent workers.',results},null,2));
