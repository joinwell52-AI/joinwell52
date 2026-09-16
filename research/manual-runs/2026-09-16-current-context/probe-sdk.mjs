import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';import {execFileSync} from 'node:child_process';
const require=createRequire(import.meta.url),esbuild=require('esbuild'),root=decodeURIComponent(new URL('.',import.meta.url).pathname).replace(/^\/(\w:)/,'$1').replace(/\/$/,'');
const head=root+'/external/openai-agents-js-1938-head',base=root+'/external/openai-agents-js-1938-base';
const main=`import {Agent,run,MemorySession,Usage,setTracingDisabled} from '${head}/packages/agents-core/src/index.ts';
import {ScriptedModel,assistantMessage,modelResponse} from '${head}/packages/agents-core/src/testing/index.ts';
async function main(){setTracingDisabled(true);
class AppendOnly {items=[];async getSessionId(){return 'synthetic'} async getItems(){return structuredClone(this.items)} async addItems(items){this.items.push(...structuredClone(items))}async popItem(){return this.items.pop()}async clearSession(){this.items=[]}}
const rows=[];
for(const stream of [false,true])for(const appendOnly of [false,true])for(const verdict of ['pass','trip','error','pass-then-error']){
 const session=appendOnly?new AppendOnly():new MemorySession();await session.addItems([{role:'user',content:'prior question'},assistantMessage('prior accepted')]);
 const error=new Error('synthetic evaluator unavailable');const guard=(name,action)=>({name,execute:action});
 const guards=verdict==='pass-then-error'?[guard('pass',async()=>({tripwireTriggered:false})),guard('throws',async()=>{throw error})]:[guard('check',async()=>{if(verdict==='error')throw error;return {tripwireTriggered:verdict==='trip'}})];
 const model=new ScriptedModel([modelResponse({output:[assistantMessage('UNVETTED_SENTINEL')],usage:new Usage()})]);const agent=new Agent({name:'synthetic',model,outputGuardrails:guards});
 let failure=null;try{const result=await run(agent,'current question',{session,stream});if(stream)await result.completed;}catch(e){failure=e.name}
 const stored=JSON.stringify(await session.getItems());const replay=new ScriptedModel([modelResponse({output:[assistantMessage('follow up answer')],usage:new Usage()})]);await run(new Agent({name:'follow-up',model:replay}),'follow up',{session});
 rows.push({stream,appendOnly,verdict,error:failure,persisted:stored.includes('UNVETTED_SENTINEL'),replayed:JSON.stringify(replay.calls).includes('UNVETTED_SENTINEL'),priorRetained:stored.includes('prior accepted'),userRetained:stored.includes('current question')});
}console.log(JSON.stringify(rows));}main().catch(e=>{console.error(e);process.exitCode=1});`;
const results=[];
for(const mode of ['base-guardrail','head']){
 const output=await esbuild.build({stdin:{contents:main,resolveDir:head,loader:'ts'},bundle:true,write:false,platform:'node',format:'cjs',target:'node24',alias:{'@openai/agents-core/_shims/config':head+'/packages/agents-core/src/shims/config-node.ts','@openai/agents-core/_shims':head+'/packages/agents-core/src/shims/shims-node.ts'},plugins:mode==='base-guardrail'?[{name:'pinned-base-guardrails',setup(build){build.onLoad({filter:/runner[\\/]guardrails\.ts$/},()=>({contents:fs.readFileSync(base+'/packages/agents-core/src/runner/guardrails.ts','utf8'),loader:'ts',resolveDir:head+'/packages/agents-core/src/runner'}))}}]:[]});
 // Compiled transient executable contains only the synthetic harness and pinned public source.
 const file=root+'/sdk-'+mode+'.cjs';fs.writeFileSync(file,'(async()=>{'+output.outputFiles[0].text+'})().catch(e=>{console.error(e);process.exitCode=1})');
 results.push({mode,rows:JSON.parse(execFileSync(process.execPath,[file],{encoding:'utf8',maxBuffer:1024*1024}))});
}
console.log(JSON.stringify({method:'Public run API, scripted models, real MemorySession and append-only session. Head vs exact base guardrails.ts (the only changed production module). No live LLM API or external database. Sixteen scenarios per version.',results},null,2));
