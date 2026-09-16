import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {PassThrough} from 'node:stream';
import {mkdir,mkdtemp,writeFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
const {CodexAppServerRunHandle} = await import(pathToFileURL(path.join(process.env.CODEFLOWMU_SOURCE_ROOT ?? (()=>{throw Error('Set CODEFLOWMU_SOURCE_ROOT to authorized fixed-baseline source');})(), 'packages/codeflowmu-runtime/src/session/CodexAppServerRunHandle.ts')).href);
const here=path.dirname(fileURLToPath(import.meta.url));
await mkdir(path.join(here,'fixtures'),{recursive:true});
const rows=[];
const settle=()=>new Promise(r=>setImmediate(r));
async function fixture(){
 const root=await mkdtemp(path.join(here,'fixtures','codex-adapter-'));
 const messages=[],events=[];let kills=0;
 const child=new EventEmitter();child.stdin=new PassThrough();child.stdout=new PassThrough();child.stderr=new PassThrough();child.kill=()=>{kills++;return true;};
 let buffer='';
 child.stdin.on('data',chunk=>{buffer+=chunk.toString();while(buffer.includes('\n')){
  const i=buffer.indexOf('\n'),msg=JSON.parse(buffer.slice(0,i));buffer=buffer.slice(i+1);messages.push(msg);
  if(!msg.method||msg.id===undefined)continue;
  const result=msg.method==='thread/start'?{thread:{id:'synthetic-thread'}}:msg.method==='turn/start'?{turn:{id:'synthetic-turn'}}:{};
  queueMicrotask(()=>child.stdout.write(JSON.stringify({id:msg.id,result})+'\n'));
 }});
 const handle=new CodexAppServerRunHandle({sessionId:'synthetic-session',agentId:'DEV-01',provider:'openai-chatgpt-subscription',model:'unused-synthetic-model',workspace:root,text:'fixture only'});
 handle.onEvent(e=>events.push(e));handle.attachProcess(child);await handle.whenReady();
 return {handle,messages,events,root,child,kills:()=>kills,request(id){handle.acceptMessageForTest({id,method:'item/commandExecution/requestApproval',params:{command:'git status --short',cwd:root}});}};
}
for(let round=1;round<=2;round++)for(const scenario of ['normal','cancel-during-async-resolution','request-after-cancel']){
 const f=await fixture();const id=9000+round;
 if(scenario==='request-after-cancel')await f.handle.cancel('synthetic cancel before request');
 f.request(id);
 if(scenario==='cancel-during-async-resolution')await f.handle.cancel('synthetic cancel before resolution microtask');
 await settle();await settle();
 const responses=f.messages.filter(m=>m.id===id&&!m.method);
 assert.equal(responses.length,scenario==='normal'?1:0);
 if(scenario==='normal')assert.equal(responses[0].result.decision,'accept');
 await f.handle.cancel('fixture cleanup');
 rows.push({round,scenario,responses,kill_calls:f.kills(),settled:(await f.handle.whenSettled()).status,root:f.root,transport:'in-memory fake process attached to real CFM RunHandle; no actual Codex child or tool execution'});
 f.child.stdout.end();f.child.stderr.end();
}
await mkdir(path.join(here,'runs'),{recursive:true});
const out=path.join(here,'runs',`adapter-${Date.now()}.json`);await writeFile(out,JSON.stringify({at:new Date().toISOString(),rows},null,2));console.log(JSON.stringify({out,rows},null,2));
