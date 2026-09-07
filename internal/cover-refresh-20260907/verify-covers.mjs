import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';

const manifest = JSON.parse(fs.readFileSync('internal/cover-refresh-20260907/delivery-manifest.json', 'utf8'));
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const results = [];
for (const e of manifest.entries) {
  const cover = `docs/public/assets/covers/${e.new}`;
  const thumb = `docs/public/assets/cover-thumbnails/${e.new}`;
  const m = await sharp(cover).metadata();
  const t = await sharp(thumb).metadata();
  if(m.width !== 1600 || m.height !== 900 || t.width !== 336 || t.height !== 189) throw Error(`Dimensions: ${e.key}`);
  for(const lang of ['zh','en']) {
    const source = `docs/${lang}/${e.dir}/${e.slug}.md`;
    const before = execFileSync('git',['show',`HEAD:${source}`],{encoding:'utf8'});
    const after = fs.readFileSync(source,'utf8');
    if(before.replaceAll(e.old,e.new).replaceAll('\r','') !== after.replaceAll('\r','')) throw Error(`Unexpected prose change: ${source}`);
    const html = fs.readFileSync(`docs/.vitepress/dist/${lang}/${e.dir}/${e.slug}.html`,'utf8');
    if(!html.includes(e.new)) throw Error(`Missing built hero: ${source}`);
    const index = fs.readFileSync(`docs/.vitepress/dist/${lang}/research/index.html`,'utf8');
    if(!index.includes(`cover-thumbnails/${e.new}`)) throw Error(`Missing built list thumbnail: ${source}`);
  }
  if(e.key !== 'weekly-008') {
    if(sha(`staging/publication-candidates/${e.slug}-cover.png`) !== sha(e.sourcePath)) throw Error(`Canonical raster mismatch: ${e.key}`);
    if(sha(`docs/public/assets/covers/${e.old}`) !== sha(e.sourcePath)) throw Error(`Compatibility raster mismatch: ${e.key}`);
  } else if (sha('internal/cover-refresh-20260907/weekly-008-user-approved-original.png') !== sha(e.sourcePath)) throw Error('Frozen approved pixels changed');
  results.push({itemId:e.key,sourceSha256:sha(e.sourcePath),asset:cover,assetSha256:sha(cover),assetBytes:fs.statSync(cover).size,thumbnail:thumb,thumbnailSha256:sha(thumb),thumbnailBytes:fs.statSync(thumb).size,reviewThumbnail:e.thumbnail,reviewThumbnailSha256:sha(e.thumbnail),sourceAndBuiltPages:'PASS',unchangedProse:'PASS'});
}
console.log(JSON.stringify({result:'PASS',articlePairs:6,sourcePages:12,results},null,2));
