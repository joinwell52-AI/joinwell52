// Mechanical adaptation of the existing manual publication workflow; no prose rewriting.
import {readFileSync,writeFileSync,mkdirSync,copyFileSync,readdirSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=process.cwd(), source=resolve(process.argv[2]);
const run='research/manual-runs/2026-09-06-read-effects-order';
const base='/assets/read-effects-order-20260905', origin='https://joinwell52-ai.github.io/joinwell52';
const evidenceSlug='2026-09-05-read-effects-acceptance-order';
const dest=join(root,'docs/public',base.slice(1));
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const put=(p,s)=>{mkdirSync(dirname(p),{recursive:true});writeFileSync(p,s)};
const copy=(a,b)=>{mkdirSync(dirname(b),{recursive:true});copyFileSync(a,b);assert.equal(hash(a),hash(b))};
execFileSync(process.execPath,[join(source,'evidence/check.mjs')],{stdio:'inherit'});
for(const name of readdirSync(join(source,'evidence'))) copy(join(source,'evidence',name),join(dest,'evidence',name));
const specs=[['get-request-effect-boundary','get-effect-cover-v1.png','engineering-case-study'],['acceptance-order-replay','acceptance-order-cover-v1.png','research-methodology']];
const images=['get-effect-cover-v1.png','acceptance-order-cover-v1.png','get-redirect-effect-inline-v1.png','acceptance-replay-inline-v1.png'];
for(const name of images)copy(join(source,'assets',name),join(dest,'assets',name));
const checks=[];
for(const [suffix,coverName,type] of specs) for(const lang of ['zh','en']){
 const slug='2026-09-05-'+suffix, other=lang==='zh'?'en':'zh';
 const input=join(source,`${slug}.${lang}.md`),raw=readFileSync(input,'utf8');
 const field=k=>JSON.parse(raw.match(new RegExp('^'+k+': (.+)$','m'))[1]);
 const title=field('title'),summary=field('summary'),cover=base+'/assets/'+coverName;
 let body=raw.replace(/^---[\s\S]*?\n---\s*/,'').replace(/^!\[.*?\]\(assets\/[^)]+\)\s*/,'');
 body=body.replaceAll(`(evidence/README.${lang}.md)`,`(/${lang}/research/evidence/${evidenceSlug})`);
 body=body.replace(/^!\[([^\]]*)\]\(assets\/([^)]*)\)$/gm,(_,alt,file)=>`[![${alt}](${origin}${base}/assets/${file})](${origin}${base}/assets/${file})`);
 body=body.replace(/^图 1｜(.*)$/gm,'*图 1：$1 来源：本文受控实验的机制示意，非原始观测截图。点击图片查看高清原图。*');
 body=body.replace(/^Figure 1 \| (.*)$/gm,'*Figure 1. $1 Source: mechanism illustration of this article’s controlled experiment, not a raw observation screenshot. Click for the full-resolution image.*');
 const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;');
 const header=`---\nschema: publication-candidate-article/v2\ntitle: ${JSON.stringify(title)}\ndate: "2026-09-05"\npublished_date: "2026-09-06"\ncolumn: open-source-engineering\ncategory: daily\narticle_type: ${type}\nedition: research-center\nsummary: ${JSON.stringify(summary)}\ncover: ${JSON.stringify(cover)}\nlanguage: ${lang==='zh'?'zh-CN':'en'}\nlifecycle: Published\npublication_authorized: true\nevidence_status: ${JSON.stringify(field('evidence_status'))}\npageClass: read-effects-article\n---\n\n<ArticleCover image="${cover}" kicker="${lang==='zh'?'开源工程观察 · 受控实验':'Open-source engineering · Controlled experiment'}" title="${esc(title)}" summary="${esc(summary)}" version="2026-09-05" languageHref="/${other}/engineering/${slug}" languageLabel="${other==='en'?'English':'中文'}" />\n\n<ArticleTableScroll language="${lang}" />\n\n# ${title}\n\n<style>.read-effects-article .vp-doc h1[id] { display: none; }</style>\n\n[${lang==='zh'?'查看题图原图':'View original cover'}](${origin}${cover})\n\n`;
 const output=`docs/${lang}/engineering/${slug}.md`;
 put(join(root,output),header+body.trim()+'\n');
 assert.equal((body.match(/^\|/gm)||[]).length,(raw.match(/^\|/gm)||[]).length);
 assert.equal((body.match(/^## /gm)||[]).length,(raw.match(/^## /gm)||[]).length);
 assert.equal((body.match(/\[!\[/g)||[]).length,1);
 assert.ok(!/[A-Z]:[\\/]/.test(body));
 checks.push({output,source_sha256:hash(input),published_sha256:hash(join(root,output)),table_rows_preserved:true,section_count:(body.match(/^## /gm)||[]).length});
}
for(const lang of ['zh','en']){
 const other=lang==='zh'?'en':'zh';
 const name=`README.${lang}.md`;
 let guide=readFileSync(join(dest,'evidence',name),'utf8');
 guide=guide.replace(/^状态：.*$/m,'状态：用户已于 2026-09-06 授权随中英文文章公开发布。这是研究证据包，不是产品安全验收或独立 QA。');
 guide=guide.replace(/^Status:.*$/m,'Status: authorized by the user for bilingual publication on September 6, 2026. This is research evidence, not product safety acceptance or independent QA.');
 put(join(dest,'evidence',name),guide);
 const links=readdirSync(join(dest,'evidence')).map(n=>`- [${n}](${origin}${base}/evidence/${n})`).join('\n');
 const extra=lang==='zh'?`\n## 下载与双语阅读\n\n[English](/en/research/evidence/${evidenceSlug}) · [完整证据包 ZIP](${origin}${base}/read-effects-order-evidence.zip)。解压后进入 evidence 目录运行 \`node check.mjs\`；请保留完整目录，不要只下载脚本。\n\n`:`\n## Download and language\n\n[中文](/zh/research/evidence/${evidenceSlug}) · [Complete evidence ZIP](${origin}${base}/read-effects-order-evidence.zip). Extract, enter the evidence directory, and run \`node check.mjs\`. Keep the complete directory; the script alone is insufficient.\n\n`;
 put(join(root,`docs/${lang}/research/evidence/${evidenceSlug}.md`),`---\ntitle: ${JSON.stringify(lang==='zh'?'证据包：读取效果与接受顺序':'Evidence: read effects and acceptance order')}\noutline: deep\n---\n\n<ArticleTableScroll language="${lang}" />\n\n`+guide+extra+links+'\n');
}
execFileSync(process.execPath,[join(dest,'evidence/check.mjs'),'--seal'],{stdio:'inherit'});
execFileSync(process.execPath,[join(dest,'evidence/check.mjs')],{stdio:'inherit'});
execFileSync('tar',['-a','-cf','read-effects-order-evidence.zip','evidence'],{cwd:dest,stdio:'inherit'});
assert.equal(hash(join(source,'evidence/observations.json')),hash(join(dest,'evidence/observations.json')));
put(join(root,run,'preflight.json'),JSON.stringify({status:'LOCAL_CONTENT_CHECKS_PASS',kind:'manual-user-authorized-publication',published_date:'2026-09-06',checks,images:images.map(n=>({file:n,sha256:hash(join(dest,'assets',n))})),observations_unchanged:true,product_experiments_rerun:false,independent_qa:false},null,2)+'\n');
// Register only GitHub pages: other-platform publication is not authorized by this request.
for(const [readme,lang,start,anchor] of [['README.md','en',15,'Additional reference:'],['README.zh-CN.md','zh',40,'补充参考：']]){
 let text=readFileSync(join(root,readme),'utf8');
 const rows=specs.map(([suffix],i)=>{const slug='2026-09-05-'+suffix;const raw=readFileSync(join(source,`${slug}.${lang}.md`),'utf8');const title=JSON.parse(raw.match(/^title: (.+)$/m)[1]);return `| ${start+i} | **${title}** | [中文](${origin}/zh/engineering/${slug}) · [English](${origin}/en/engineering/${slug}) · [${lang==='zh'?'双语证据':'Bilingual evidence'}](${origin}/${lang}/research/evidence/${evidenceSlug}) | ${lang==='zh'?'受控实验；保留反例、复跑条件与证据限制。':'Controlled experiments with counterexamples, rerun requirements, and explicit evidence limits.'} |`;}).join('\n');
 if(!text.includes('/engineering/2026-09-05-get-request-effect-boundary'))text=text.replace(anchor,rows+'\n\n'+anchor);
 put(join(root,readme),text);
}
console.log(JSON.stringify(checks,null,2));
