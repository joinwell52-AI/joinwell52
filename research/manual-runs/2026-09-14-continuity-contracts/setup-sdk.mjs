import{execFileSync}from'node:child_process';
import{readFileSync,mkdirSync,existsSync}from'node:fs';
import{fileURLToPath}from'node:url';
const root=fileURLToPath(new URL('./',import.meta.url)),p=JSON.parse(readFileSync(root+'sources/openai-agents-python-5000.json'));
const repo=process.env.RESEARCH_SDK_CACHE||root+'external/sdk-git',dest=root+'external/sdk-pinned';
mkdirSync(root+'external',{recursive:true});if(!existsSync(repo))execFileSync('git',['clone','--depth','1','https://github.com/openai/openai-agents-python.git',repo],{stdio:'inherit'});
execFileSync('git',['fetch','--depth','1','origin',p.head],{cwd:repo,stdio:'inherit'});
execFileSync('git',['archive','--format=tar','--output='+root+'external/sdk.tar',p.head],{cwd:repo});
mkdirSync(dest,{recursive:true});execFileSync('tar',['-xf',root+'external/sdk.tar','-C',dest,'--exclude=CLAUDE.md']);console.log(dest);
