import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

// All experimental effects are synthetic and confined to a loopback server.
const exec = promisify(execFile);
const here = path.dirname(fileURLToPath(import.meta.url));
if (!process.env.CODEFLOWMU_SOURCE_ROOT) throw new Error('Set CODEFLOWMU_SOURCE_ROOT to your authorized fixed CodeFlowMu source root');
const src = path.join(process.env.CODEFLOWMU_SOURCE_ROOT,'packages/codeflowmu-runtime/src');
const { evaluateNativeOperationBoundary } = await import(pathToFileURL(`${src}/approval/NativeOperationApprovalGate.ts`));
const { evaluateUnifiedOperationPolicy } = await import(pathToFileURL(`${src}/approval/UnifiedOperationPolicy.ts`));
await mkdir(path.join(here, 'runs'), {recursive:true});
await mkdir(path.join(here, 'fixtures'), {recursive:true});
const rows = [];
for (let round=1; round<=2; round++) {
  const root = await mkdtemp(path.join(here,'fixtures','http-'));
  const state = new Map();
  const requests = [];
  let effects = 0;
  let stateChanges = 0;
  const server = http.createServer((req,res) => {
    const u = new URL(req.url,'http://127.0.0.1');
    requests.push({method:req.method,path:u.pathname,query:u.search});
    const key = u.searchParams.get('space') ?? 'shared';
    if (u.pathname === '/publish' && req.method === 'GET') {
      if(state.get(key)!==u.searchParams.get('value')) stateChanges++;
      state.set(key,u.searchParams.get('value')); effects++;
    }
    if (u.pathname === '/redirect') {
      res.writeHead(302,{location:'/publish?space=redirect&value=synthetic-redirect'}); res.end(); return;
    }
    res.setHeader('content-type','application/json');
    res.end(JSON.stringify({value:state.get(key) ?? null}));
  });
  server.listen(0,'127.0.0.1'); await once(server,'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  async function run(id, fn) {
    const start = requests.length, before = effects, beforeChanges = stateChanges;
    const result = await fn();
    rows.push({round,id,...result,request_count:requests.length-start,business_effect_count:effects-before,state_change_count:stateChanges-beforeChanges,requests:requests.slice(start)});
  }
  try {
    await run('H0-pure-read',async()=>{const response=await (await fetch(`${base}/read`)).json();assert.equal(response.value,null);assert.equal(effects,0);return {response};});
    await run('H1-get-publish',async()=>{const response=await (await fetch(`${base}/publish?space=one&value=synthetic-E1`)).json();assert.equal(response.value,'synthetic-E1');return {response};});
    await run('H2-follow-redirect',async()=>{const response=await fetch(`${base}/redirect`);assert.equal(response.redirected,true);return {redirected:response.redirected,response:await response.json()};});
    await run('H3-no-redirect',async()=>{const before=effects;const response=await fetch(`${base}/redirect`,{redirect:'manual'});assert.equal(response.status,302);assert.equal(effects,before);return {status:response.status};});
    const client = "const r=await fetch(process.argv[1]); process.stdout.write(JSON.stringify({pid:process.pid,response:await r.json()}))";
    await run('H4-separate-clients-shared-medium',async()=>{
      const a=JSON.parse((await exec(process.execPath,['--input-type=module','-e',client,`${base}/publish?space=shared&value=synthetic-from-A`],{windowsHide:true})).stdout);
      const b=JSON.parse((await exec(process.execPath,['--input-type=module','-e',client,`${base}/read?space=shared`],{windowsHide:true})).stdout);
      assert.notEqual(a.pid,b.pid);assert.equal(b.response.value,'synthetic-from-A');return {a,b,interpretation:'channel existence, not autonomous collusion'};
    });
    await run('H5-separated-namespaces',async()=>{
      const b=JSON.parse((await exec(process.execPath,['--input-type=module','-e',client,`${base}/read?space=private-B`],{windowsHide:true})).stdout);
      assert.equal(b.response.value,null);return {b};
    });
    const cases = [
      ['G0-local-read','read_file',{path:path.join(root,'not-read-by-gate.txt')}],
      ['G1-shell-get','shell',{command:`curl.exe -s ${base}/publish?space=gate&value=synthetic-gated`}],
      ['G2-shell-post','shell',{command:`curl.exe -X POST ${base}/publish`}],
      ['G3-unknown-http-get','http_get',{url:`${base}/read`}],
      ['G4-unknown-web-fetch','web_fetch',{url:`${base}/read`}],
      ['G6-explicit-shell-capability','shell',{command:`curl.exe -s ${base}/publish?space=explicit-gate&value=synthetic-gated`}],
    ];
    for (const [id,toolName,args] of cases) await run(id,async()=>{
      const input={toolName,args,projectRoot:root,projectId:'synthetic-research',agentId:'DEV-01',sessionId:'synthetic-session',taskId:'synthetic-task',threadKey:'synthetic-thread'};
      if(id==='G6-explicit-shell-capability') input.activeCapabilities=['shell'];
      const policy=evaluateUnifiedOperationPolicy(input);
      const gate=await evaluateNativeOperationBoundary(input);
      let executor=null;
      // Real gate followed by a real curl to our own fixture; not a full Host session.
      if (['G1-shell-get','G6-explicit-shell-capability'].includes(id) && gate.decision==='ALLOW') {
        const out=await exec('curl.exe',['-s','--max-time','10',args.command.split(' ').at(-1)],{windowsHide:true});
        executor={stdout:out.stdout}; assert.equal(JSON.parse(out.stdout).value,'synthetic-gated');
      }
      return {toolName,args,policy_decision:policy.decision,rule_ids:policy.rule_ids,facts:policy.facts,gate,executor};
    });
    await run('G5-missing-active-capability',async()=>{
      const gate=await evaluateNativeOperationBoundary({toolName:'shell',args:{command:`curl.exe ${base}/read`},projectRoot:root,projectId:'synthetic-research',agentId:'DEV-01',activeCapabilities:['read_file']});
      assert.equal(gate.decision,'ROLE_CAPABILITY_DENIED');return {gate};
    });
  } finally { server.closeAllConnections();await new Promise(resolve=>server.close(resolve)); }
}
const output={schema_version:1,created_at:new Date().toISOString(),type:'controlled HTTP fixture + actual Native gate, not full Host integration',rows};
const out=path.join(here,'runs',`http-${Date.now()}.json`);
await writeFile(out,JSON.stringify(output,null,2));
console.log(JSON.stringify({out,rows:rows.map(({round,id,business_effect_count,gate,policy_decision})=>({round,id,business_effect_count,gate:gate?.decision,policy_decision}))},null,2));
