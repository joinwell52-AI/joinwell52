import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const origin='https://joinwell52-ai.github.io/joinwell52';
const base='/assets/read-effects-order-20260905';
const checks=[];
const digest=b=>createHash('sha256').update(b).digest('hex');
async function get(path){const r=await fetch(origin+path,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200,path);return Buffer.from(await r.arrayBuffer())}
for(const lang of ['zh','en']){
 for(const slug of ['2026-09-05-get-request-effect-boundary','2026-09-05-acceptance-order-replay']){
  const path=`/${lang}/engineering/${slug}`,html=(await get(path)).toString('utf8');
  assert.ok(html.includes(`/${lang==='zh'?'en':'zh'}/engineering/${slug}`));
  assert.ok(html.includes('2026-09-05-read-effects-acceptance-order'));
  assert.ok(html.includes(base+'/assets/'));
  checks.push({url:origin+path,status:200,locale_evidence_image_links:true});
 }
 const path=`/${lang}/research/evidence/2026-09-05-read-effects-acceptance-order`;
 assert.ok((await get(path)).toString('utf8').includes('read-effects-order-evidence.zip'));
 checks.push({url:origin+path,status:200,evidence_download_link:true});
}
const m=JSON.parse(readFileSync('docs/public'+base+'/evidence/manifest.json','utf8'));
const images=JSON.parse(readFileSync('research/manual-runs/2026-09-06-read-effects-order/preflight.json','utf8')).images;
for(const relative of [...m.files.map(f=>'evidence/'+f.file),'evidence/manifest.json','read-effects-order-evidence.zip',...images.map(f=>'assets/'+f.file)]){
 const path=base+'/'+relative, remote=await get(path),local=readFileSync('docs/public'+path);
 assert.equal(digest(remote),digest(local),path);
 checks.push({url:origin+path,status:200,sha256:digest(remote),matches_local_bytes:true});
}
const result={status:'LIVE_PUBLICATION_VERIFIED',verified_at:new Date().toISOString(),deployment_run:'https://github.com/joinwell52-AI/joinwell52/actions/runs/34009534845',content_commit:'c90e2f08ef73a0bc92dd629184cb7e83bd3b2df7',checks,product_experiments_rerun:false,independent_qa:false};
writeFileSync('research/manual-runs/2026-09-06-read-effects-order/live-verification.json',JSON.stringify(result,null,2)+'\n');
console.log(`PASS: ${checks.length} live pages/downloads; all evidence and image bytes match local publication files.`);
