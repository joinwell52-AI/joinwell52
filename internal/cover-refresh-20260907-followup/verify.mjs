import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';

const live = process.argv.includes('--live');
const base = 'https://joinwell52-ai.github.io/joinwell52/';
const items = [
  ['research/weekly/weekly-008', 'weekly-008-authority-is-a-relation-editorial-v3.webp'],
  ['digital-employee/2026-09-06-risk-does-not-choose-protocol', 'daily-2026-09-06-risk-does-not-choose-protocol-editorial-v3.webp']
];
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const get = async route => {
  const r = await fetch(base + route);
  if (!r.ok) throw new Error(`${r.status} ${route}`);
  return Buffer.from(await r.arrayBuffer());
};
const read = route => live ? get(route) : fs.readFile('docs/.vitepress/dist/' + route);
for (const [route, file] of items) {
  for (const lang of ['zh', 'en']) {
    const sourcePath = `docs/${lang}/${route}.md`;
    const source = await fs.readFile(sourcePath, 'utf8');
    const prior = execFileSync('git', ['show', `4d30abbd:${sourcePath}`], {encoding:'utf8'});
    const normalize = s => s.replaceAll('-editorial-v3.webp', '-editorial-v2.webp').replaceAll('\r\n', '\n');
    if (normalize(source) !== normalize(prior)) throw new Error('Unexpected prose change: '+sourcePath);
    const html = (await read(`${lang}/${route}.html`)).toString();
    if (!html.includes(file)) throw new Error('Missing new cover: '+route);
    const index = (await read(`${lang}/research/index.html`)).toString();
    if (!index.includes('cover-thumbnails/'+file)) throw new Error('Missing index thumbnail: '+file);
  }
  const bytes = await read('assets/covers/'+file);
  const original = await fs.readFile('docs/public/assets/covers/'+file);
  if (hash(bytes) !== hash(original)) throw new Error('Cover hash mismatch: '+file);
  const thumb = await read('assets/cover-thumbnails/'+file);
  const meta = await sharp(thumb).metadata();
  if (meta.width !== 336 || meta.height !== 189) throw new Error('Wrong thumbnail size');
  console.log(JSON.stringify({file, sha256:hash(bytes), bytes:bytes.length, thumbnailBytes:thumb.length, thumbnail:'336x189', bilingualPages:true, bilingualIndex:true, articleProseUnchanged:true}));
}
console.log(JSON.stringify({mode:live?'live':'build',checkedAt:new Date().toISOString(),result:'PASS'}));
