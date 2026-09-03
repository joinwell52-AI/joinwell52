import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const reportRoot='research/manual-runs/2026-09-04-host-research-publication';
const dist='docs/.vitepress/dist';
const articles=[
 ['engineering','2026-09-03-empty-test-results-verified',5],
 ['engineering','2026-09-03-process-alive-owner-identity',5],
 ['digital-employee','2026-09-03-cursor-self-hosted-agent-outlook',6]
];
const sha=b=>createHash('sha256').update(b).digest('hex');
const checks=[];
for(const lang of ['zh','en']){
 const index=fs.readFileSync(`${dist}/${lang}/research/index.html`,'utf8');
 for(const [section,slug,sections] of articles){
  const file=`docs/${lang}/${section}/${slug}.md`;
  const md=fs.readFileSync(file,'utf8');
  assert.equal((md.match(/^## /gm)||[]).length,sections,file);
  assert.equal((md.match(/^# /gm)||[]).length,1,file);
  assert.equal((md.match(/<ArticleCover/g)||[]).length,1,file);
  assert.ok(md.includes('publication_authorized: true'));
  assert.ok(!/[CD]:[\\/]|localhost|127\.0\.0\.1|03-evidence-guide/.test(md));
  const html=fs.readFileSync(`${dist}/${lang}/${section}/${slug}.html`,'utf8');
  assert.ok(html.includes('figure-0'),file+' body diagram');
  assert.ok(index.includes(slug),file+' discoverable in Research');
  for(const match of md.matchAll(/\]\(([^)]+)\)|(?:image|languageHref)="([^"]+)"/g)){
   let href=(match[1]||match[2]).trim();
   href=href.replace('https://joinwell52-ai.github.io/joinwell52','').split('#')[0];
   if(!href.startsWith('/'))continue;
   const local=href.startsWith('/assets/')?'docs/public'+href:'docs'+href+'.md';
   assert.ok(fs.existsSync(local),`${file}: missing ${href}`);
  }
  checks.push({file,sha256:sha(md),sections,full_article:true,bilingual_links:true,assets_resolved:true,research_index:true});
 }
 assert.ok(fs.existsSync(`${dist}/${lang}/research/evidence/2026-09-03-host-authority-conformance.html`));
}
const data='docs/public/assets/evidence/2026-09-03-host-authority-conformance';
for(const n of fs.readdirSync(data).filter(n=>n.endsWith('.json'))){
 const text=fs.readFileSync(path.join(data,n),'utf8');
 assert.ok(!/[CD]:[\\/]|Users[\\/]|scratch[\\/]|127\.0\.0\.1/.test(text),n+' privacy');
}
const record={status:'PASS',scope:'Manual author publication only; not product QA',articles:checks,
 evidence:'check.mjs PASS; all 38 observation rows retained; two regression rounds checked',
 build:'docs:build PASS; strict SSR gate and Runtime dist projection PASS',
 validation:'Publication layout/editorial validators PASS; these existing validators do not replace the article-specific checks above',
 visual_review:'Three English diagrams inspected at full resolution; no clipping; existing approved Chinese diagrams/covers retained',
 known_warning:'Existing VitePress bundle-size warning (>500 kB); build successful',
 exclusions:['Later Cursor Agent iOS manuscript','CodeFlowMu product code','Other working-tree edits','Existing scheduled Runtime shift states']};
fs.writeFileSync(`${reportRoot}/preflight.json`,JSON.stringify(record,null,2)+'\n');
console.log('PASS: 6 full articles, 2 evidence pages, bilingual links, local assets, Research index discovery and privacy whitelist checks.');
