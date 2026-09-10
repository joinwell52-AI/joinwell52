import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('./',import.meta.url),manifest=JSON.parse(await readFile(new URL('sources/code-manifest.json',root),'utf8'));
for(const s of manifest){if(!s.file)continue;const target=new URL(s.file,root);let data;try{data=await readFile(target);}catch{}if(!data||createHash('sha256').update(data).digest('hex')!==s.sha256){const r=await fetch(s.url);if(!r.ok)throw Error(`HTTP ${r.status}: ${s.url}`);data=Buffer.from(await r.arrayBuffer());if(createHash('sha256').update(data).digest('hex')!==s.sha256)throw Error(`Hash mismatch: ${s.file}`);await mkdir(new URL('./',target),{recursive:true});await writeFile(target,data);}}
console.log('Pinned upstream sources verified.');
