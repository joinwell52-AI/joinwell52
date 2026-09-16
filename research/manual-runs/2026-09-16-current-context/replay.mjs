import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=path.dirname(fileURLToPath(import.meta.url));
for(const [file,expected] of Object.entries(JSON.parse(readFileSync(path.join(root,'source-hashes.json'),'utf8')))){
 const actual=createHash('sha256').update(readFileSync(path.join(root,file))).digest('hex');
 assert.equal(actual,expected,'Source hash mismatch: '+file);
}
mkdirSync(path.join(root,'replay-results'),{recursive:true});
for(const name of ['anywhere','sdk','orca','credential','blocked','binary','superset']){
 const command=name==='anywhere'?(process.env.PYTHON||'python'):process.execPath;
 const script='probe-'+name+(name==='anywhere'?'.py':'.mjs');
 const actual=JSON.parse(execFileSync(command,[path.join(root,script)],{cwd:root,encoding:'utf8',maxBuffer:4*1024*1024}));
 writeFileSync(path.join(root,'replay-results',name+'.json'),JSON.stringify(actual,null,2)+'\n');
 assert.deepEqual(actual,JSON.parse(readFileSync(path.join(root,'results',name+'.json'),'utf8')),name+' changed');
 console.log(name+': exact saved-result match');
}
