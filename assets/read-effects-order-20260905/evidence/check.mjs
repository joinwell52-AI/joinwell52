import assert from 'node:assert/strict';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const obs=JSON.parse(await readFile(path.join(here,'observations.json'),'utf8'));
assert.equal(obs.http.length,26);assert.equal(obs.order.length,14);
const norm=rs=>rs.map(({round,...r})=>r).sort((a,b)=>a.id.localeCompare(b.id));
assert.deepEqual(norm(obs.http.filter(r=>r.round===1)),norm(obs.http.filter(r=>r.round===2)));
assert.deepEqual(norm(obs.order.filter(r=>r.round===1)),norm(obs.order.filter(r=>r.round===2)));
for(const round of [1,2]) {
  const h=Object.fromEntries(obs.http.filter(r=>r.round===round).map(r=>[r.id,r]));
  assert.equal(Object.keys(h).length,13);
  for(const id of ['G1-shell-get','G6-explicit-shell-capability']){assert.equal(h[id].gate_decision,'ALLOW');assert.equal(h[id].state_change_count,1);assert.equal(h[id].effect_facts.complete,false);}
  assert.equal(h['G2-shell-post'].gate_decision,'REQUIRE_APPROVAL');
  for(const id of ['G3-unknown-http-get','G4-unknown-web-fetch','G5-missing-active-capability'])assert.equal(h[id].gate_decision,'ROLE_CAPABILITY_DENIED');
  const o=Object.fromEntries(obs.order.filter(r=>r.round===round).map(r=>[r.id,r]));
  assert.equal(Object.keys(o).length,7);
  assert.deepEqual([o['O1-allow-then-revoke-inverted'].recording,o['O1-allow-then-revoke-inverted'].acceptance],['allow','deny']);
  assert.deepEqual([o['O2-revoke-then-allow-inverted'].recording,o['O2-revoke-then-allow-inverted'].acceptance],['deny','allow']);
  assert.equal(obs.baseline.find(r=>r.round===round).exit_code,0);
}
const files=[];
for(const name of (await readdir(here)).sort()) {
  if(!/\.(?:json|mjs|md|log)$/.test(name)||name==='manifest.json')continue;
  const bytes=await readFile(path.join(here,name));files.push({file:name,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
if(process.argv.includes('--seal'))await writeFile(path.join(here,'manifest.json'),JSON.stringify({source_commit:obs.source_commit,files},null,2));
else {const manifest=JSON.parse(await readFile(path.join(here,'manifest.json'),'utf8'));assert.deepEqual(files,manifest.files);}
console.log('PASS: evidence consistency and file integrity; not product safety acceptance');
