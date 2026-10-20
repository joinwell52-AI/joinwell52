import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),dist=path.join(root,'docs/.vitepress/dist');
for(const route of ['zh','en','zh/runtime','en/runtime','zh/research','en/research','zh/publications','en/publications'])assert.ok(fs.existsSync(path.join(dist,route,'index.html')),'Missing route '+route);
for(const lang of ['zh','en']){const html=fs.readFileSync(path.join(dist,lang,'runtime/index.html'),'utf8');assert.ok(html.includes('Public Snapshot'));assert.ok(html.includes('not a live control plane')||html.includes('不是实时控制面'));}
console.log('Public site route and snapshot verification passed.');
