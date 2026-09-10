import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=new URL('./',import.meta.url),sha=x=>createHash('sha256').update(x).digest('hex');
const sourcePath='src/renderer/src/components/terminal-pane/terminal-pane-recovery.ts';
const lookupPath='src/renderer/src/store/slices/worktrees/session/worktree-slice-lookups.ts';
const prepare=raw=>stripTypeScriptTypes(raw,{mode:'transform'}).replace(/^import[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm,'').replace(/^export /gm,'');
async function load(phase){
 const [raw,lookup]=await Promise.all([sourcePath,lookupPath].map(p=>readFile(new URL(`sources/code/orca-19745/${phase}/${p}`,root),'utf8')));
 let time=0,count=0,timer=0;const timers=new Map(),crumbs=[];
 let state={tabsByWorktree:{w:[{id:'tab',generation:0}]},unifiedTabsByWorktree:{w:[{id:'tab'}]},pendingStartupByTabId:{},terminalLayoutsByTabId:{}};
 const set=fn=>Object.assign(state,typeof fn==='function'?fn(state):fn),get=()=>state;
 const ctx=vm.createContext({console:{warn(){}},Date:{now:()=>time},setTimeout:(fn,ms)=>{timers.set(++timer,{fn,ms});return timer;},clearTimeout:id=>timers.delete(id),useAppStore:{getState:get},recordRendererCrashBreadcrumb:(event,data)=>crumbs.push({event,data}),_resetTerminalInputQuarantineForTests(){},armTerminalInputQuarantine(){},getTerminalActivationSpawnSuppression:()=>false,FLOATING_TERMINAL_WORKTREE_ID:'floating'});
 vm.runInContext(prepare(lookup),ctx);vm.runInContext(prepare(raw),ctx);
 const remount=ctx.createRemountTerminalTabForRecovery(set,get);
 state.remountTerminalTabForRecovery=id=>{const yes=remount(id);if(yes)count++;return yes;};
 state.getTab=id=>Object.values(state.unifiedTabsByWorktree).flat().find(t=>t.id===id)??null;
 if(phase==='head')state.hasTerminalTabForRecovery=ctx.createHasTerminalTabForRecovery(set,get);
 async function cycle(){const generation=ctx.captureTerminalPaneRecoveryGeneration('tab');const instance=ctx.registerTerminalPaneRecoveryInstance('tab');const admitted=await ctx.requestTerminalPaneRecovery({tabId:'tab',ptyId:'synthetic-pty',reason:'reattach-unverifiable',terminalRecoveryGeneration:generation,terminalRecoveryInstanceId:instance.id});instance.unregister();return admitted;}
 return {ctx,state,cycle,setTime:v=>time=v,count:()=>count,timers,hashes:{recovery:sha(raw),lookup:sha(lookup)},crumbs};
}
let rows=[];
for(const phase of ['base','head'])for(const scenario of ['consistent-fast','drift-fast','drift-spaced','genuine-close','window-expiry','stale-generation']){
 const h=await load(phase);let attempts=0;
 if(scenario.startsWith('drift'))h.state.unifiedTabsByWorktree={};
 if(scenario.endsWith('fast')||scenario==='drift-spaced'){
  attempts=scenario==='drift-spaced'?10:200;
  for(let i=0;i<attempts;i++){h.setTime(i*(scenario==='drift-spaced'?16000:10));await h.cycle();}
  const expected=scenario==='consistent-fast'?1:phase==='base'?attempts:scenario==='drift-spaced'?3:1;
  assert.equal(h.count(),expected);
 }else if(scenario==='genuine-close'){
  await h.cycle();const instance=h.ctx.registerTerminalPaneRecoveryInstance('tab');h.state.tabsByWorktree={};h.state.unifiedTabsByWorktree={};instance.unregister();
  assert.equal(h.ctx.captureTerminalPaneRecoveryGeneration('tab'),0);
  h.state.tabsByWorktree={w:[{id:'tab',generation:0}]};h.state.unifiedTabsByWorktree={w:[{id:'tab'}]};await h.cycle();assert.equal(h.count(),2);attempts=2;
 }else if(scenario==='window-expiry'){
  for(const t of [0,16000,32000,48000,300001]){h.setTime(t);await h.cycle();}assert.equal(h.count(),4);attempts=5;
 }else{
  const instance=h.ctx.registerTerminalPaneRecoveryInstance('tab');const req={tabId:'tab',ptyId:null,reason:'reattach-unverifiable',terminalRecoveryGeneration:0,terminalRecoveryInstanceId:instance.id};
  assert.equal(await h.ctx.requestTerminalPaneRecovery(req),true);h.setTime(16000);assert.equal(await h.ctx.requestTerminalPaneRecovery(req),false);instance.unregister();assert.equal(h.count(),1);attempts=2;
 }
 assert.equal(h.timers.size,0);
 rows.push({phase,scenario,attempts,remounts:h.count(),source_sha256:h.hashes});
}
const round=process.argv[2]??'1';await mkdir(new URL('runs/',root),{recursive:true});
await writeFile(new URL(`runs/orca-${round}.json`,root),JSON.stringify({kind:'full original recovery and lookup modules; types/imports removed; fixture store/time/timers/PTY; no Electron or real crash',node:process.version,harness_sha256:sha(await readFile(new URL(import.meta.url))),rows},null,2)+'\n');
console.log(JSON.stringify(rows.map(({phase,scenario,attempts,remounts})=>({phase,scenario,attempts,remounts})),null,2));
