import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const assets='docs/public/assets/verification-evidence-20260909';
const ids=['01-deterministic-conflict','02-verification-ownership','03-output-is-not-effect','04-effect-and-delivery'];
const expected=[8,6,8,6], reviewed=[];
for(const [i,id] of ids.entries()){
 const source=await fs.readFile(`${assets}/${id}.png`), meta=await sharp(source).metadata();
 assert.ok(Math.abs(meta.width/meta.height-16/9)<.01);
 await sharp(source).resize(320,180,{fit:'contain',background:'#fffaf0'}).png().toFile(`${assets}/${id}-thumb.png`);
 for(const lang of ['zh','en']){
  const s=await fs.readFile(`docs/${lang}/engineering/2026-09-09-${id.slice(3)}.md`,'utf8');
  assert.equal((s.match(/^# /gm)||[]).length,1);
  assert.equal((s.match(/^\|/gm)||[]).length,expected[i]+2);
  assert.ok(s.includes('2026-09-09-verification-evidence'));
  assert.ok(!/[DC]:[\\/]/.test(s));
 }
 reviewed.push({id,width:meta.width,height:meta.height,sha256:createHash('sha256').update(source).digest('hex'),thumbnail:`${id}-thumb.png`});
}
const files=JSON.parse(await fs.readFile(`${assets}/evidence/files.json`,'utf8'));
for(const file of files){const b=await fs.readFile(`${assets}/evidence/${file.name}`);assert.equal(createHash('sha256').update(b).digest('hex'),file.sha256);JSON.parse(b);}
await fs.writeFile('research/manual-runs/2026-09-09-verification-evidence/check-results.json',JSON.stringify({at:new Date().toISOString(),articles:8,table_rows:expected,observation_files:files.length,covers:reviewed,scope:'Integrity and layout input checks, not independent scientific QA'},null,2)+'\n');
console.log(JSON.stringify({articles:8,covers:4,observation_files:files.length,checks:'PASS'}));
