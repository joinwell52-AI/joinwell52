import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import assert from 'node:assert/strict';
const root=new URL('./',import.meta.url);
const p=JSON.parse(readFileSync(new URL('sources/orca-19946.json',root),'utf8'));
class AgentSessionOptionRejectedError extends Error {}
class ClaudeControlRequestError extends Error {}
function load(side,name,bindings){
 const source=readFileSync(new URL(`sources/code/orca-19946/${side}/src/main/claude/${name}.ts`,root),'utf8');
 const body=stripTypeScriptTypes(source.replace(/^import\s[\s\S]*?from\s+'[^']+'\s*$/gm,''),{mode:'transform'}).replace(/\bexport /g,'');
 const names=[...body.matchAll(/(?:async )?function (\w+)\(/g)].map(x=>x[1]);
 return new Function(...Object.keys(bindings),body+`;return {${names.join(',')}}`)(...Object.values(bindings));
}
const rows=[{value:'default',resolvedModel:'claude-opus-5'},{value:'sonnet',resolvedModel:'claude-sonnet-5'},{value:'haiku',resolvedModel:'claude-haiku-4-5-20251001'}];
const cases=[
 {id:'unlisted-change',catalog:rows,value:'not-a-real-model-xyz',reject:true},
 {id:'retired-restore',catalog:rows,value:'claude-opus-4-retired',restore:true,reject:true},
 {id:'listed-alias',catalog:rows,value:'haiku'},
 {id:'resolved-id',catalog:rows,value:'claude-sonnet-5'},
 {id:'catalog-unavailable',catalog:'unavailable',value:'sonnet'},
 {id:'catalog-empty',catalog:[],value:'sonnet'},
 {id:'only-default-row',catalog:[rows[0]],value:'sonnet'},
 {id:'listed-restore',catalog:rows,value:'haiku',restore:true}
];
const observations=[];
for(const side of ['base','head']){
 const helpers=load(side,'claude-structured-session-options',{CLAUDE_SESSION_OPTION_CATALOG:{models:[]}});
 const options=load(side,'claude-structured-options',{...helpers,AgentSessionOptionRejectedError,ClaudeControlRequestError,isAgentSessionOptionRejectedError:e=>e instanceof AgentSessionOptionRejectedError});
 for(const c of cases){
  const calls=[];const session={options:new Map(),reportedOptions:{model:'claude-sonnet-5'},optionMutationSequence:0,reportedModelMutation:0,confirmedOptions:new Set(),restoreSkippedOptions:new Set(),connection:{
   supportedModels:async()=>{calls.push({method:'supportedModels'});if(c.catalog==='unavailable')throw Error('unavailable');return c.catalog;},
   setModel:async value=>{calls.push({method:'setModel',value});}
  }};
  let error=null;
  if(c.restore)session.options.set('model',c.value);
  try{if(c.restore)await options.restoreClaudeStructuredSessionOptions(session);else await options.setClaudeStructuredOption(session,{key:'model',value:c.value});}catch(e){error=e.message;}
  const writes=calls.filter(x=>x.method==='setModel').length;
  assert.equal(writes,side==='head'&&c.reject?0:1,c.id);
  if(side==='head'&&c.reject&&c.restore)assert.deepEqual([...session.restoreSkippedOptions],['model']);
  if(side==='head'&&c.reject&&!c.restore)assert.match(error,/does not list/);
  observations.push({side,case:c.id,writes,error,calls,options:Object.fromEntries(session.options),skipped:[...session.restoreSkippedOptions]});
 }
}
mkdirSync(new URL('runs/',root),{recursive:true});
const result={time:new Date().toISOString(),node:process.version,head:p.head_sha,base:p.base_sha,method:'Unmodified upstream function bodies; TypeScript stripped by Node. Imports injected. Connection and error classes are explicit test doubles; seed catalog unused. No real Claude process or model request.',checks:observations.length,observations};
writeFileSync(new URL('runs/orca.json',root),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(observations.map(({side,case:id,writes,error,skipped})=>({side,id,writes,error,skipped})),null,2));
