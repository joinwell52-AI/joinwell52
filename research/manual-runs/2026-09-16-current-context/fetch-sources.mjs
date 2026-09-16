import {execFileSync} from 'node:child_process';
import {readFileSync,mkdirSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const sources=JSON.parse(readFileSync(path.join(root,'sources.json'),'utf8'));
const indices=[0,1,7,12,13,14,15,16];
for(const index of indices){
 const s=sources[index],name=s.repo.split('/')[1]+'-'+s.id,repo=path.join(root,'external',name+'-git');
 mkdirSync(repo,{recursive:true});
 if(!existsSync(path.join(repo,'.git')))execFileSync('git',['init'],{cwd:repo,stdio:'ignore'});
 for(const mode of ['head','base']){
  if(mode==='base'&&[1,12,13,15,16].includes(index))continue;
  const target=path.join(root,'external',name+'-'+mode),sha=s[mode];
  if(!/^[0-9a-f]{40}$/.test(sha))throw Error('Invalid immutable source ref');
  execFileSync('git',['fetch','--depth=1','https://github.com/'+s.repo+'.git',sha],{cwd:repo,stdio:'inherit',timeout:240000});
  mkdirSync(target,{recursive:true});const archive=path.join(root,'external',name+'-'+mode+'.tar');
  execFileSync('git',['archive','--format=tar','--output='+archive,sha],{cwd:repo});
  execFileSync('tar',['-xf',archive,'-C',target,'--exclude=CLAUDE.md','--exclude=.claude','--exclude=.codex','--exclude=.cursor'],{timeout:90000});
  console.log(name,mode,sha);
 }
}
