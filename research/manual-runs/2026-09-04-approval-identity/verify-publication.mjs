import {readFileSync,existsSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const slug='2026-09-04-approval-operation-identity',base='docs/public/assets/approval-identity-20260904';
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
assert.equal(hash(base+'/assets/approval-identity-cover-v2.png'),'a1db383c2b58beaf9cd66be5ad768ea2dcf4e1ddb953ce88833f055133e4a6b8');
for(const lang of ['zh','en']){
 const md=readFileSync(`docs/${lang}/engineering/${slug}.md`,'utf8');
 const html=readFileSync(`docs/.vitepress/dist/${lang}/engineering/${slug}.html`,'utf8');
 assert.ok(html.includes('computeOperationDigest'));
 assert.ok(html.includes('article-v5-cover'));
 for(const img of ['operation-collapse','nested-session']){
  const file=`${base}/assets/${img}.${lang}.png`,buf=readFileSync(file);
  assert.equal(buf.readUInt32BE(16),2560);assert.equal(buf.readUInt32BE(20),1440);
  assert.ok(html.includes(`${img}.${lang}.png`));
  assert.ok(md.includes(`](${`https://joinwell52-ai.github.io/joinwell52/assets/approval-identity-20260904/assets/${img}.${lang}.png`})`));
 }
 assert.ok(existsSync(`docs/.vitepress/dist/${lang}/research/evidence/${slug}.html`));
}
execFileSync(process.execPath,[base+'/evidence/check-evidence.mjs'],{stdio:'inherit'});
const report={status:'PASS',checks:['bilingual pages rendered','cover approved bytes unchanged','four inline PNGs 2560x1440','clickable full resolution images','bilingual evidence pages rendered','recorded evidence integrity and counterexamples retained'],site_build:'PASS; existing large-chunk warning only',independent_product_qa:false};
writeFileSync('research/manual-runs/2026-09-04-approval-identity/validation.json',JSON.stringify(report,null,2)+'\n');
console.log(report);
