import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
export const root=fileURLToPath(new URL('.',import.meta.url)).replaceAll('\\','/');
const require=createRequire(import.meta.url); export const esbuild=require('esbuild');
export const read=p=>fs.readFile(root+p,'utf8');
export function between(s,a,b){const start=s.indexOf(a),end=s.indexOf(b,start);if(start<0||end<0)throw Error('source anchors missing '+a);return s.slice(start,end);}
export async function compile(code,dir=root,plugins=[]){const b=await esbuild.build({stdin:{contents:code,resolveDir:dir,loader:'ts'},bundle:true,write:false,format:'esm',platform:'node',banner:{js:"import {createRequire as probeCreateRequire} from 'node:module'; const require=probeCreateRequire("+JSON.stringify(root+'package.json')+");"},nodePaths:[root+'node_modules'],plugins,logLevel:'silent'});return import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));}
export const moduleAt=async(p,plugins=[])=>compile(`export * from ${JSON.stringify('./'+p.split('/').pop())}`,root+p.slice(0,p.lastIndexOf('/')),plugins);
