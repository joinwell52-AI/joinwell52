import fs from 'node:fs';import {createRequire} from 'node:module';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),esbuild=require('esbuild');
const root=decodeURIComponent(new URL('.',import.meta.url).pathname).replace(/^\/(\w:)/,'$1').replace(/\/$/,'');
const source=fs.readFileSync(root+'/external/orca-20914-head/mobile/src/transport/generation-scoped-request-owner.ts','utf8');
const rows=[];const defer=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve}};
for(const variant of ['original','without-generation-check']){
 const code=variant==='original'?source:source.replace(/if \(state\.generation !== this\.currentGeneration\) \{\s*return 'retired-generation'\s*\}/,'');
 assert(variant==='original'||code!==source);
 const built=await esbuild.transform(code,{loader:'ts',format:'esm'});const {GenerationScopedRequestOwner:Owner}=await import('data:text/javascript;base64,'+Buffer.from(built.code).toString('base64')+'#'+variant);
 for(const schedule of ['aba','same-scope-reset','epoch-included','epoch-omitted','scope-unnoticed','foreign-owner','same-generation']){
  const o=new Owner(),d=defer(),scope=['A',0],params={query:''};const p=o.load(scope,params,()=>d.promise);let current=scope;
  if(schedule==='aba'){o.read(['B',0],params);o.read(scope,params);}
  if(schedule==='same-scope-reset')o.reset();
  if(schedule==='epoch-included'){current=['A',1];o.read(current,params);}
  if(schedule==='epoch-omitted'){current=scope;/* real-world epoch changed but caller did not include it */}
  if(schedule==='scope-unnoticed')current=['B',0];
  d.resolve('OLD');const loaded=await p;const verdict=(schedule==='foreign-owner'?new Owner():o).commit(loaded.lease,loaded.value);const visible=o.read(current,params)??null;
  rows.push({variant,schedule,verdict,visible});
 }
 const o=new Owner(),old=defer(),fresh=defer(),s=['A'],p={query:'x'};const a=o.load(s,p,()=>old.promise);o.reset();const b=o.load(s,p,()=>fresh.promise);old.resolve('OLD');await a;let duplicateLoads=0;const c=o.load(s,p,()=>{duplicateLoads++;return Promise.resolve('DUPLICATE')});fresh.resolve('FRESH');const bresult=await b;await c;rows.push({variant,schedule:'stale-cleanup',samePromise:b===c,duplicateLoads,verdict:o.commit(bresult.lease,bresult.value),visible:o.read(s,p)});
}
assert.equal(rows.find(r=>r.variant==='original'&&r.schedule==='aba').verdict,'retired-generation');
assert.equal(rows.find(r=>r.variant==='without-generation-check'&&r.schedule==='aba').visible,'OLD');
assert.equal(rows.find(r=>r.variant==='original'&&r.schedule==='epoch-omitted').visible,'OLD');
assert.equal(rows.find(r=>r.variant==='original'&&r.schedule==='scope-unnoticed').visible,null);
console.log(JSON.stringify({method:'Complete pinned TypeScript owner module; deterministic Promise schedules. Counterfactual removes only generation comparison, not an old production version. No mobile UI or RPC network.',rows},null,2));
