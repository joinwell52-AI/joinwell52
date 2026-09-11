import {mkdir,writeFile} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec=promisify(execFile),root=new URL('./',import.meta.url);
const api=async p=>JSON.parse((await exec('gh',['api',p],{encoding:'utf8',maxBuffer:40*1024*1024})).stdout);
await mkdir(new URL('sources/',root),{recursive:true});
const inputs=[['modelcontextprotocol/modelcontextprotocol',2127],['openai/codex',44617],['openai/codex',44655],['openai/codex',44675],['superset-sh/superset',7408],['superset-sh/superset',7367],['paperclipai/paperclip',10972],['openai/openai-agents-python',4947],['stablyai/orca',19946]];
const results=await Promise.all(inputs.map(async([repo,id])=>{
 const p=await api(`repos/${repo}/pulls/${id}`);let files=[];
 for(let page=1;;page++){const f=await api(`repos/${repo}/pulls/${id}/files?per_page=100&page=${page}`);files.push(...f);if(f.length<100)break;}
 const r={read_at:new Date().toISOString(),repo,id,url:p.html_url,title:p.title,state:p.state,draft:p.draft,merged_at:p.merged_at,updated_at:p.updated_at,head_sha:p.head.sha,base_sha:p.base.sha,merge_commit_sha:p.merge_commit_sha,author:p.user.login,body:p.body,files:files.map(f=>({filename:f.filename,sha:f.sha,patch:f.patch,status:f.status}))};
 const file=`sources/${repo.split('/')[1]}-${id}.json`;
 await writeFile(new URL(file,root),JSON.stringify(r,null,2)+'\n');
 return {...r,body:undefined,files:r.files.map(f=>f.filename),file};
}));
await writeFile(new URL('sources/index.json',root),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results.map(({repo,id,state,merged_at,head_sha,files})=>({repo,id,state,merged_at,head_sha,files})),null,2));
