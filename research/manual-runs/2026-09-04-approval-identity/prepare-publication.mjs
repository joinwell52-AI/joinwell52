import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=process.cwd(), source=resolve(process.argv[2]);
const slug='2026-09-04-approval-operation-identity';
const base='/assets/approval-identity-20260904';
const origin='https://joinwell52-ai.github.io/joinwell52';
const evidencePage='2026-09-04-approval-operation-identity';
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
function put(p,s){mkdirSync(dirname(p),{recursive:true});writeFileSync(p,s);}
const manifest=JSON.parse(readFileSync(join(source,'evidence/manifest.json'),'utf8'));
for(const f of [...manifest.files,{file:'manifest.json',sha256:hash(join(source,'evidence/manifest.json'))}]){
 const src=resolve(source,'evidence',f.file);
 assert.equal(hash(src),f.sha256);
 const dest=resolve(root,'docs/public',base.slice(1),'evidence',f.file);
 assert.ok(dest.startsWith(resolve(root,'docs/public',base.slice(1))));
 mkdirSync(dirname(dest),{recursive:true});copyFileSync(src,dest);
}
const checks=[];
for(const lang of ['zh','en']){
 const raw=readFileSync(join(source,`${slug}.${lang}.md`),'utf8');
 const title=JSON.parse(raw.match(/^title: (.+)$/m)[1]);
 const summary=JSON.parse(raw.match(/^summary: (.+)$/m)[1]);
 const other=lang==='zh'?'en':'zh';
 const cover=`${base}/assets/approval-identity-cover-v2.png`;
 let body=raw.replace(/^---[\s\S]*?\n---\s*/,'');
 body=body.replace(/^\[!\[.*?\]\(assets\/approval-identity-cover-v2.png\)\]\(assets\/approval-identity-cover-v2.png\)\r?\n/gm,'');
 body=body.replaceAll('(evidence/README.'+lang+'.md)',`(/${lang}/research/evidence/${evidencePage})`);
 body=body.replaceAll('(assets/',`(${origin}${base}/assets/`);
 const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;');
 const question=lang==='zh'?'实际工具入口是否保留了批准必须绑定的动作区别，并将会话上下文与动作身份正确分开？':'Does the real tool entry preserve approval-relevant operation distinctions while separating session context from operation identity?';
 const header=`---\nschema: publication-candidate-article/v2\ntitle: ${JSON.stringify(title)}\ndate: "2026-09-04"\npublished_date: "2026-09-04"\ncolumn: open-source-engineering\ncategory: daily\narticle_type: experiment-report\nedition: research-center\nresearch_question: ${JSON.stringify(question)}\nsummary: ${JSON.stringify(summary)}\ncover: ${JSON.stringify(cover)}\nlanguage: ${lang==='zh'?'zh-CN':'en'}\nlifecycle: Published\npublication_authorized: true\nevidence_status: "Controlled experiments on a fixed baseline; no fix or independent QA claimed"\nsources:\n  - https://github.com/openai/codex/pull/42588\n  - https://github.com/openai/codex/pull/42579\n---\n\n<ArticleCover\n  image="${cover}"\n  kicker="${lang==='zh'?'开源工程观察 · 受控实验':'Open-source engineering · Controlled experiment'}"\n  title="${esc(title)}"\n  summary="${esc(summary)}"\n  version="2026-09-04"\n  languageHref="/${other}/engineering/${slug}"\n  languageLabel="${other==='en'?'English':'中文'}"\n/>\n\n<ArticleTableScroll language="${lang}" />\n\n`;
 const articlePath=`docs/${lang}/engineering/${slug}.md`;
 put(join(root,articlePath),header+body.trim()+'\n');
 assert.equal((body.match(/^## /gm)||[]).length,6);
 assert.equal((body.match(/\[!\[/g)||[]).length,2);
 assert.equal((body.match(/^\|/gm)||[]).length,(raw.match(/^\|/gm)||[]).length);
 assert.ok(!/[A-Z]:[\\/]/.test(body));
 let guide=readFileSync(join(source,`evidence/README.${lang}.md`),'utf8');
 guide=guide.replaceAll(`../${slug}.${lang}.md`,`/${lang}/engineering/${slug}`);
 guide=guide.replaceAll(`README.${other}.md`,`/${other}/research/evidence/${evidencePage}`);
 for(const name of ['observations.json','sources.json','manifest.json','check-evidence.mjs'])guide=guide.replaceAll(`](${name})`,`](${origin}${base}/evidence/${name})`);
 guide+=lang==='zh'?`\n## 下载后离线检查\n\n[下载完整配套包（ZIP）](${origin}${base}/approval-identity-evidence.zip)，解压后进入 evidence 目录运行 \`node check-evidence.mjs\`。请保留完整目录结构；单独下载脚本不足以完成文件完整性检查。\n`:`\n## Offline check\n\n[Download the complete companion ZIP](${origin}${base}/approval-identity-evidence.zip), extract it, enter the evidence directory and run \`node check-evidence.mjs\`. Keep the complete directory structure; downloading the script alone is insufficient for the integrity check.\n`;
 put(join(root,`docs/${lang}/research/evidence/${evidencePage}.md`),`---\ntitle: ${JSON.stringify(lang==='zh'?'证据包：批准对象与动作身份':'Evidence: approval scope and operation identity')}\noutline: deep\n---\n\n<ArticleTableScroll language="${lang}" />\n\n`+guide);
 checks.push({article:articlePath,source_sha256:hash(join(source,`${slug}.${lang}.md`)),published_sha256:hash(join(root,articlePath)),sections:6,inline_figures:2,table_rows_preserved:true});
}
put(join(root,'research/manual-runs/2026-09-04-approval-identity/preflight.json'),JSON.stringify({status:'LOCAL_CONTENT_CHECKS_PASS',kind:'manual-user-authorized-publication',checks,cover_user_approved:true,cover_sha256:hash(join(source,'assets/approval-identity-cover-v2.png')),public_dataset_status:'RECORDED EVIDENCE CONSISTENT; PRODUCT COUNTEREXAMPLES REMAIN',independent_qa:false},null,2)+'\n');
console.log(JSON.stringify(checks,null,2));
