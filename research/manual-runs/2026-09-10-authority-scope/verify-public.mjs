import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('./',import.meta.url),json=async p=>JSON.parse(await readFile(new URL(p,root),'utf8')),hash=x=>createHash('sha256').update(x).digest('hex');
for(const name of ['ag2','openhands','orca','paperclip']){
 const a=await json(`runs/${name}-1.json`),b=await json(`runs/${name}-2.json`);
 assert.deepEqual(a.rows??a.observations,b.rows??b.observations,name);
 const p=`probe-${name}.${['ag2','openhands'].includes(name)?'py':'mjs'}`;
 if(a.harness_sha256)assert.equal(hash(await readFile(new URL(p,root))),a.harness_sha256,p);
}
if(process.argv.includes('--sources'))for(const s of await json('sources/code-manifest.json'))if(s.file)assert.equal(hash(await readFile(new URL(s.file,root))),s.sha256,s.file);
console.log('PASS: two saved rounds agree; published probe hashes match. This is a consistency check, not a new experiment run.');
