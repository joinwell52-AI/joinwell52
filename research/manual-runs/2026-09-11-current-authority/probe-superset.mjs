import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import assert from 'node:assert/strict';
const root=new URL('./',import.meta.url);
const p=JSON.parse(readFileSync(new URL('sources/superset-7408.json',root),'utf8'));
const source=readFileSync(new URL('sources/code/superset-7408/head/packages/shared/src/sandbox-access-token.ts',root),'utf8');
const mod=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(source,{mode:'transform'})).toString('base64'));
const keys=mod.generateSandboxAccessKeyPair(),other=mod.generateSandboxAccessKeyPair();
const now=1800000000000;
const {token,expiresAt}=mod.signSandboxAccessToken({privateKey:keys.privateKey,audience:'workspace-a',ttlMs:600000,now});
const parts=token.split('.');
const changedBody=Buffer.from(JSON.stringify({aud:'workspace-b',iat:now/1000,exp:now/1000+600})).toString('base64url');
const cases=[
 {id:'correct-workspace',expected:true},
 {id:'different-workspace',audience:'workspace-b',expected:false},
 {id:'one-ms-before-expiry',now:expiresAt.getTime()-1,expected:true},
 {id:'at-expiry',now:expiresAt.getTime(),expected:false},
 {id:'wrong-signing-key',publicKey:other.publicKey,expected:false},
 {id:'tampered-audience',audience:'workspace-b',token:`${parts[0]}.${changedBody}.${parts[2]}`,expected:false},
 {id:'missing-token',token:'',expected:false},
 {id:'malformed-token',token:'v1.x.x',expected:false},
 {id:'same-workspace-after-simulated-process-restart',now:now+60000,expected:true,note:'A second verifier call with unchanged audience and key. The API has no process-generation input; no real sandbox restart performed.'}
];
const observations=cases.map(c=>{
 const actual=mod.verifySandboxAccessToken({publicKey:c.publicKey??keys.publicKey,token:c.token??token,audience:c.audience??'workspace-a',now:c.now??now});
 assert.equal(actual,c.expected,c.id);return {id:c.id,expected:c.expected,actual,note:c.note};
});
mkdirSync(new URL('runs/',root),{recursive:true});
writeFileSync(new URL('runs/superset.json',root),JSON.stringify({time:new Date().toISOString(),node:process.version,head:p.head_sha,method:'Exact upstream signing/verifying functions; real ephemeral Ed25519 keys; controlled clock; no cloud network calls, HTTP middleware, mobile or sandbox execution.',observations},null,2)+'\n');
console.log(JSON.stringify(observations,null,2));
