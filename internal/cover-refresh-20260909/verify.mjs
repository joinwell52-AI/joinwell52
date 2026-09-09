import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';
const live=process.argv.includes('--live');
const sourceOnly=process.argv.includes('--source-only');
const items=[
  {
    "stem": "one-effect-across-surfaces",
    "route": "engineering/2026-09-08-one-effect-across-surfaces",
    "file": "daily-2026-09-08-one-effect-across-surfaces-editorial-v2.webp",
    "old": "daily-2026-09-08-one-effect-across-surfaces-cover.png"
  },
  {
    "stem": "role-match-is-not-team-fit",
    "route": "industry/2026-09-08-role-match-is-not-team-fit",
    "file": "daily-2026-09-08-role-match-is-not-team-fit-editorial-v2.webp",
    "old": "daily-2026-09-08-role-match-is-not-team-fit-cover.png"
  },
  {
    "stem": "memory-must-be-readmitted",
    "route": "digital-employee/2026-09-08-memory-must-be-readmitted",
    "file": "daily-2026-09-08-memory-must-be-readmitted-editorial-v2.webp",
    "old": "daily-2026-09-08-memory-must-be-readmitted-cover.png"
  },
  {
    "stem": "project-truth-survives-context",
    "route": "engineering/2026-09-07-project-truth-survives-context",
    "file": "daily-2026-09-07-project-truth-survives-context-editorial-v2.webp",
    "old": "daily-2026-09-07-project-truth-survives-context-cover.png"
  },
  {
    "stem": "local-safety-does-not-close-path",
    "route": "digital-employee/2026-09-07-local-safety-does-not-close-path",
    "file": "daily-2026-09-07-local-safety-does-not-close-path-editorial-v2.webp",
    "old": "daily-2026-09-07-local-safety-does-not-close-path-cover.png"
  },
  {
    "stem": "visibility-is-not-enforcement",
    "route": "industry/2026-09-07-visibility-is-not-enforcement",
    "file": "daily-2026-09-07-visibility-is-not-enforcement-editorial-v2.webp",
    "old": "daily-2026-09-07-visibility-is-not-enforcement-cover.png"
  }
];
const base='https://joinwell52-ai.github.io/joinwell52/';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=async route=>{
 if(!live) return fs.readFile('docs/.vitepress/dist/'+route);
 const r=await fetch(base+route,{signal:AbortSignal.timeout(30000)});
 if(!r.ok) throw new Error(r.status+' '+route);
 return Buffer.from(await r.arrayBuffer());
};
for(const {route,file,old} of items) {
 for(const lang of ['zh','en']) {
  const p='docs/'+lang+'/'+route+'.md';
  const s=await fs.readFile(p,'utf8');
  const prior=execFileSync('git',['show','685f9c90:'+p],{encoding:'utf8'});
  if(s.replaceAll(file,old).replaceAll('\r\n','\n')!==prior.replaceAll('\r\n','\n')) throw new Error('Unexpected prose change: '+p);
  if((s.match(new RegExp(file.replaceAll('.','\\.'),'g'))||[]).length!==2) throw new Error('Cover reference count: '+p);
  if(!sourceOnly) {
   if(!(await read(lang+'/'+route+'.html')).toString().includes(file)) throw new Error('Missing article cover: '+p);
   const index=(await read(lang+'/research/index.html')).toString();
   // ResearchNotes renders ten rows server-side; later rows live in the loaded data bundle.
   const themePath=index.match(/assets\/chunks\/theme\.[^"<>\s]+\.js/)?.[0];
   if(!themePath) throw new Error('Missing research data bundle');
   const theme=(await read(themePath)).toString();
   const binding='"thumbnail":"/assets/cover-thumbnails/'+file+'","url":"/'+lang+'/'+route+'","lang":"'+lang+'"';
   if(!theme.includes(binding)) throw new Error('Missing language-bound list thumb: '+file);
  }
 }
 const original=await fs.readFile('docs/public/assets/covers/'+file);
 const meta=await sharp(original).metadata();
 if(meta.width!==1600||meta.height!==900) throw new Error('Wrong cover size');
 let thumbnailBytes=null;
 if(!sourceOnly) {
  if(hash(await read('assets/covers/'+file))!==hash(original)) throw new Error('Cover hash mismatch: '+file);
  const t=await read('assets/cover-thumbnails/'+file), m=await sharp(t).metadata();
  if(m.width!==336||m.height!==189) throw new Error('Wrong thumbnail size');
  thumbnailBytes=t.length;
 }
 console.log(JSON.stringify({file,sha256:hash(original),bytes:original.length,thumbnailBytes,articleProseUnchanged:true,bilingualPages:true}));
}
console.log(JSON.stringify({mode:sourceOnly?'source':live?'live':'build',checkedAt:new Date().toISOString(),result:'PASS'}));
