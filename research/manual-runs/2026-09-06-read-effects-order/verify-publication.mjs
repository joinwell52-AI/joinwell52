import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd(),source=process.argv[2];
const slugs=['2026-09-05-get-request-effect-boundary','2026-09-05-acceptance-order-replay'];
const plain=s=>s.replace(/^---[\s\S]*?\n---\s*/,'').split(/\r?\n/).filter(l=>l.trim()&&!/^!\[|^\[!\[|^图 1｜|^Figure 1 \|/.test(l));
for(const slug of slugs)for(const lang of ['zh','en']){
 const raw=readFileSync(join(source,`${slug}.${lang}.md`),'utf8');
 const published=readFileSync(`docs/${lang}/engineering/${slug}.md`,'utf8');
 for(const line of plain(raw))assert.ok(published.includes(line.replaceAll(`(evidence/README.${lang}.md)`,`(/${lang}/research/evidence/2026-09-05-read-effects-acceptance-order)`)),`Missing unchanged line: ${line}`);
 const html=readFileSync(`docs/.vitepress/dist/${lang}/engineering/${slug}.html`,'utf8');
 assert.ok(html.includes('read-effects-order-20260905/assets/'));
 assert.ok(html.includes(`/${lang==='zh'?'en':'zh'}/engineering/${slug}`));
 assert.ok(html.includes('2026-09-05-read-effects-acceptance-order'));
 assert.ok(published.includes('publication_authorized: true'));
 const index=readFileSync(`docs/.vitepress/dist/${lang}/engineering/index.html`,'utf8');
 assert.ok(index.includes(slug));
}
for(const lang of ['zh','en'])assert.ok(existsSync(`docs/.vitepress/dist/${lang}/research/evidence/2026-09-05-read-effects-acceptance-order.html`));
console.log('PASS: all original prose/table lines retained; four built article routes, locale/evidence/image links, and both indexes checked. Not a product experiment rerun.');
