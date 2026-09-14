import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('./',import.meta.url),index=JSON.parse(readFileSync(new URL('sources/index.json',root))),manifest=[];
const selection={
 '3c94f459fa942727bbbf0a51ad1967d235096bc7':['skills/prun/scripts/dispatch-task-agy.py','skills/implement-review/scripts/dispatch-gemini.py','tests/test_dispatch_task_agy.py','tests/test_dispatch_gemini.py'],
 '050ee0bd91c5d05c28f6f6b7c196a8d222328a4b':['skills/prun/scripts/dispatch-task-agy.py','tests/test_dispatch_task_agy.py'],
 '5000':['src/agents/memory/openai_responses_compaction_session.py','tests/memory/test_openai_responses_compaction_session.py'],
 '13345':['packages/adapter-utils/src/server-utils.ts','server/src/services/execution-continuation.ts'],
 '13374':['server/src/services/heartbeat.ts'],
};
for(const item of index){
 const paths=selection[item.id];if(!paths)continue;
 for(const version of ['head','base'])for(const path of paths){
  const url=`https://raw.githubusercontent.com/${item.repo}/${item[version]}/${path}`,r=await fetch(url);
  if(!r.ok){console.log(`SKIP ${r.status} ${url}`);continue;}
  const bytes=Buffer.from(await r.arrayBuffer()),local=`sources/code/${String(item.id).slice(0,7)}/${version}/${path}`;
  mkdirSync(new URL(local.substring(0,local.lastIndexOf('/')),root),{recursive:true});writeFileSync(new URL(local,root),bytes);
  manifest.push({repo:item.repo,revision:item[version],path,local,url,sha256:createHash('sha256').update(bytes).digest('hex')});
 }
}
writeFileSync(new URL('sources/code-manifest.json',root),JSON.stringify(manifest,null,2)+'\n');console.log(`Pinned ${manifest.length} files`);
