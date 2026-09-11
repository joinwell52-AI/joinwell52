import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('./',import.meta.url);
const specs={
 'orca-19946':['src/main/claude/claude-structured-options.ts','src/main/claude/claude-structured-session-options.ts','src/main/claude/claude-structured-model-preflight.test.ts'],
 'superset-7408':['packages/shared/src/sandbox-access-token.ts','packages/host-service/src/providers/host-auth/SandboxAccessHostAuthProvider/SandboxAccessHostAuthProvider.ts'],
 'paperclip-10972':['server/src/security/board-key-owner-authority.ts','packages/shared/src/board-api-key-scope.ts','doc/BOARD-API-KEY-AUDIT-BOUNDARY.md'],
 'modelcontextprotocol-2127':['seps/2127-mcp-server-cards.md'],
 'codex-44617':['codex-rs/ext/guardian-v2/src/async_scorer/extension.rs']};
const jobs=[];
for(const [key,files] of Object.entries(specs)){
 const p=JSON.parse(await readFile(new URL(`sources/${key}.json`,root),'utf8'));
 for(const side of key.startsWith('orca')?['base','head']:['head'])for(const path of files){
  if(side==='base'&&path.endsWith('.test.ts'))continue;
  jobs.push({key,repo:p.repo,sha:p[`${side}_sha`],side,path});
 }
}
const manifest=await Promise.all(jobs.map(async j=>{
 const url=`https://raw.githubusercontent.com/${j.repo}/${j.sha}/${j.path}`;
 const r=await fetch(url);if(!r.ok)throw Error(`${r.status} ${url}`);const body=await r.text();
 const local=`sources/code/${j.key}/${j.side}/${j.path}`;
 await mkdir(new URL(local+'/..',root),{recursive:true});await writeFile(new URL(local,root),body);
 return {...j,url,local,sha256:createHash('sha256').update(body).digest('hex')};
}));
await writeFile(new URL('sources/code-manifest.json',root),JSON.stringify(manifest,null,2)+'\n');
console.log(`Pinned ${manifest.length} source files`);
