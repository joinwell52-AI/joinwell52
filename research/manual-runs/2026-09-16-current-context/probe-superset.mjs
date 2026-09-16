import fs from 'node:fs';import {createRequire} from 'node:module';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),esbuild=require('esbuild'),root=decodeURIComponent(new URL('.',import.meta.url).pathname).replace(/^\/(\w:)/,'$1').replace(/\/$/,'');
const src=fs.readFileSync(root+'/external/superset-7564-head/packages/cli/src/lib/cloud-workspaces/resolveWorkspaceHost.ts','utf8');
const flags=fs.readFileSync(root+'/external/superset-7564-head/packages/cli/src/lib/host-target/resolveHostFlags.ts','utf8');
const strip=s=>s.replace(/^import[\s\S]*?;\r?\n/gm,'');
const compiled=await esbuild.transform(`export async function probe(env){const {existsSync,readFileSync,writeFileSync,Date,AbortSignal}=env; const join=(...v)=>v.join('/');const SUPERSET_HOME_DIR='/synthetic';const getHostId=()=> 'LOCAL';class CLIError extends Error{};${strip(flags).replace(/export /g,'')}${strip(src).replace(/export /g,'')}return resolveWorkspaceHost(env.flags,env.api,'org');}`,{loader:'ts',format:'esm'});
const {probe}=await import('data:text/javascript;base64,'+Buffer.from(compiled.code).toString('base64'));const rows=[];
for(const name of ['uncached-online-yes','uncached-online-no','uncached-offline','fresh-positive-offline','expired-positive-offline','fresh-negative-online-yes','explicit-local','explicit-host']){
 const now=10000000;let calls=0;const cached=name.startsWith('fresh-positive')?{available:true,checkedAt:now-1000}:name.startsWith('expired')?{available:true,checkedAt:now-3600001}:name.startsWith('fresh-negative')?{available:false,checkedAt:now-1000}:null;
 const env={flags:name==='explicit-local'?{local:true}:name==='explicit-host'?{host:'REMOTE'}:{},existsSync:()=>!!cached,readFileSync:()=>JSON.stringify({org:cached}),writeFileSync:()=>{},Date:{now:()=>now},AbortSignal,api:{cloudWorkspace:{available:{query:async()=>{calls++;if(name.includes('offline'))throw Error('synthetic offline');return {available:!name.endsWith('-no')};}}}}};
 const result=await probe(env);rows.push({scenario:name,selected:result??'CLOUD',apiCalls:calls});
}
assert.equal(rows[2].selected,'LOCAL');assert.equal(rows[3].selected,'CLOUD');assert.equal(rows[3].apiCalls,0);assert.equal(rows[4].selected,'LOCAL');
console.log(JSON.stringify({method:'Pinned complete resolver and flag functions, imports replaced by controlled filesystem/clock/API collaborators. Selection only; no paid sandbox or actual network operation.',rows},null,2));
