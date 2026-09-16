import fs from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import {createRequire} from 'node:module';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),esbuild=require('esbuild'),root=decodeURIComponent(new URL('.',import.meta.url).pathname).replace(/^\/(\w:)/,'$1').replace(/\/$/,'');
const source=await fs.readFile(root+'/external/paperclip-13498-head/packages/adapter-utils/src/acpx-engine/session-store.ts','utf8');const built=await esbuild.transform(source,{loader:'ts',format:'esm'});const {createCredentialSafeSessionStore:wrap}=await import('data:text/javascript;base64,'+Buffer.from(built.code).toString('base64'));
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'research-session-'));const rows=[];
try{
 for(const scenario of ['raw-control','safe-new-save','safe-legacy-load','save-after-legacy-load','other-field-control']){
  const file=path.join(temp,scenario+'.json');const store={save:async r=>fs.writeFile(file,JSON.stringify(r)),load:async()=>JSON.parse(await fs.readFile(file,'utf8'))};
  const old='SYNTHETIC_OLD_VALUE',current='SYNTHETIC_CURRENT_VALUE';const record={sessionId:'fixture',history:['retained'],acpx:{session_options:{env:{DEMO_API_KEY:old},mode:'resume'}}};if(scenario==='other-field-control')record.debug={arbitrary:old};
  const safe=wrap({persisted:store,launchEnv:{DEMO_API_KEY:current}});const original=JSON.stringify(record);
  if(['raw-control','safe-legacy-load','save-after-legacy-load'].includes(scenario))await store.save(record);else await safe.save(record);
  const loaded=await safe.load('fixture');if(scenario==='save-after-legacy-load')await safe.save(loaded);
  const disk=await fs.readFile(file,'utf8');const onDisk=JSON.parse(disk);rows.push({scenario,oldSyntheticValueOnDisk:disk.includes(old),currentSyntheticValueOnDisk:disk.includes(current),persistedEnvPresent:!!onDisk.acpx?.session_options?.env,resumeUsesCurrent:loaded.acpx.session_options.env.DEMO_API_KEY===current,historyRetained:loaded.history[0]==='retained',callerRecordUnchanged:JSON.stringify(record)===original});
 }
}finally{const relative=path.relative(path.resolve(os.tmpdir()),path.resolve(temp));assert(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative)&&path.basename(temp).startsWith('research-session-'));await fs.rm(temp,{recursive:true,force:true});}
assert.equal(rows[1].oldSyntheticValueOnDisk,false);assert.equal(rows[2].oldSyntheticValueOnDisk,true);assert.equal(rows[3].oldSyntheticValueOnDisk,false);assert.equal(rows[4].oldSyntheticValueOnDisk,true);
console.log(JSON.stringify({method:'Unchanged candidate credential-store wrapper with a real temporary JSON-file store and synthetic non-secret values. Raw-store negative control; not real ACPX process or cross-seat exploit. Other-field case is artificial and not evidence of a production write path.',rows},null,2));
