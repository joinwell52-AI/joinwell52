import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.dirname(fileURLToPath(import.meta.url));
const index=JSON.parse(fs.readFileSync(path.join(root,'sources/index.json')));
for(const name of ['openai-agents-python-5029','crewAI-7458','orca-20723','paperclip-13443']){
 const p=index.find(s=>s.name===name);const repo=path.join(root,'external',name+'-git');fs.mkdirSync(repo,{recursive:true});
 if(!fs.existsSync(path.join(repo,'.git'))){execFileSync('git',['init'],{cwd:repo,stdio:'ignore'});execFileSync('git',['remote','add','origin',`https://github.com/${p.repo}.git`],{cwd:repo});}
 for(const mode of ['base','head']){
  execFileSync('git',['fetch','--depth=1','origin',p[mode]],{cwd:repo,stdio:'pipe',timeout:180000});
  const target=path.join(root,'external',`${name}-${mode}`);fs.mkdirSync(target,{recursive:true});const tar=target+'.tar';
  const files=name==='paperclip-13443'?['server/src/services/budgets.ts','server/src/services/recovery/service.ts']:name==='crewAI-7458'?['lib/crewai/src/crewai/tools/tool_usage.py']:[];
  execFileSync('git',['archive','--format=tar','--output='+tar,p[mode],...files],{cwd:repo});
  execFileSync('tar',['-xf',tar,'-C',target,'--exclude=CLAUDE.md','--exclude=.claude/skills'],{timeout:60000});
  console.log(name,mode,p[mode]);
 }
}
