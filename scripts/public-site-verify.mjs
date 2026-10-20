import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),dist=path.join(root,'docs/.vitepress/dist');
for(const route of ['zh','en','zh/runtime','en/runtime','zh/research','en/research','zh/publications','en/publications'])assert.ok(fs.existsSync(path.join(dist,route,'index.html')),'Missing route '+route);
for(const lang of ['zh','en']){
  const html=fs.readFileSync(path.join(dist,lang,'runtime/index.html'),'utf8');
  assert.ok(html.includes('runtime-classic'),'Original operations-center component missing');
  assert.ok(html.includes('column-grid'),'Original three-column research plan missing');
  assert.ok(html.includes('shift-list'),'Original chronological shift results missing');
  assert.ok(html.includes(lang==='zh'?'公开快照（非实时）':'Public Snapshot (not live)'));
  assert.ok(!html.includes('class="archive-snapshot"'),'Replaced archive table must not return');
}
console.log('Public site route and snapshot verification passed.');
