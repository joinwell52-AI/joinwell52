import {execFileSync} from 'node:child_process';
import {readFileSync,mkdirSync,writeFileSync,existsSync} from 'node:fs';
const root=new URL('./',import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1');
const p=JSON.parse(readFileSync(root+'sources/openai-agents-python-4947.json','utf8'));
const repo=root+'external/agents-sdk',dest=root+'external/sdk-pinned';
if(!existsSync(repo)){mkdirSync(root+'external',{recursive:true});execFileSync('git',['clone','--depth','1','https://github.com/openai/openai-agents-python.git',repo],{stdio:'inherit'});}
execFileSync('git',['fetch','--depth','1','origin',p.head_sha],{cwd:repo,stdio:'inherit'});
execFileSync('git',['archive','--format=tar','--output='+root+'external/sdk-pinned.tar',p.head_sha],{cwd:repo});
mkdirSync(dest,{recursive:true});
execFileSync('tar',['-xf',root+'external/sdk-pinned.tar','-C',dest,'--exclude=CLAUDE.md']);
const url=`https://raw.githubusercontent.com/${p.repo}/${p.base_sha}/src/agents/run_internal/agent_runner_helpers.py`;
const r=await fetch(url);if(!r.ok)throw Error(r.status);writeFileSync(root+'sources/sdk-base-helper.py',await r.text());
console.log(JSON.stringify({head:p.head_sha,base:p.base_sha,dest}));
