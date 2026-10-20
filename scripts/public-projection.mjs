import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..'),generated=path.join(root,'docs/.vitepress/generated');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>{const s=JSON.stringify(v,null,2)+'\n';if(!fs.existsSync(p)||fs.readFileSync(p,'utf8')!==s)fs.writeFileSync(p,s);};
const walk=p=>!fs.existsSync(p)?[]:fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);
const cutoff='2026-09-18';
function latest(){
  const result={schema:'latest-published-article/v1',zh:null,en:null};
  for(const lang of ['zh','en']){
    const notes=walk(path.join(root,'docs',lang)).filter(p=>p.endsWith('.md')).map(p=>{const text=fs.readFileSync(p,'utf8'),fm=text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1]||'';const get=k=>fm.match(new RegExp('^'+k+':\\s*["\']?([^\\r\\n"\']+)','m'))?.[1];return {title:get('title'),date:get('date'),column:get('column'),category:get('category'),summary:get('summary')||get('description')||'',url:'/'+path.relative(path.join(root,'docs'),p).replaceAll('\\','/').replace(/\.md$/,'')};}).filter(n=>n.title&&n.date&&['digital-employee','industry-architecture','open-source-engineering'].includes(n.column)&&['daily','weekly','academic','manifesto','visual-essay'].includes(n.category)).sort((a,b)=>b.date.localeCompare(a.date)||a.title.localeCompare(b.title));result[lang]=notes[0]||null;
  }
  write(path.join(generated,'latest-article.json'),result);
}
function archive(){
  const scheduler=read(path.join(root,'research/runtime/SCHEDULER.json'));
  const records=Object.fromEntries(scheduler.runtimeFamilies.map(f=>[f.id,walk(path.join(root,scheduler.recordRoots[f.id])).filter(p=>p.endsWith(`-${f.id}-runtime.json`)).map(read).filter(r=>r.date<=cutoff).sort((a,b)=>b.date.localeCompare(a.date))]));
  assert.equal(records.daily[0].date,cutoff);
  const old=fs.existsSync(path.join(generated,'runtime-records.json'))?read(path.join(generated,'runtime-records.json')):{};
  const payload={...old,schema:'research-runtime-center-data/v5',today:cutoff,generatedAt:'2026-09-18T23:59:59+08:00',timezone:scheduler.timezone,effectiveDate:scheduler.effectiveDate,schedulerVersion:scheduler.version,centerVersion:scheduler.centerVersion,operationsCenterVersion:scheduler.operationsCenterVersion,architectureStatus:scheduler.architectureStatus,statuses:scheduler.statuses,archive:true,v5PublicCutoff:cutoff,legacyOnly:true,schedule:scheduler.tasks,columns:scheduler.columns,programs:scheduler.programs,runtimeFamilies:scheduler.runtimeFamilies,todayDaily:records.daily[0],latest:Object.fromEntries(Object.entries(records).map(([f,list])=>[f,list[0]||null])),records};
  write(path.join(generated,'runtime-records.json'),payload);
}
function validate(){
  const a=read(path.join(generated,'runtime-records.json')),s=read(path.join(generated,'runtime-v6-public-snapshot.json')),l=read(path.join(generated,'latest-article.json'));
  assert.equal(a.today,cutoff);assert.equal(a.records.daily[0].date,cutoff);for(const records of Object.values(a.records))assert.ok(records.every(r=>r.date<=cutoff));assert.equal(s.notice,'Not a live control plane');assert.equal(l.schema,'latest-published-article/v1');assert.ok(!/(?<![A-Za-z])[A-Za-z]:[\\/]|Bearer\s+|github_pat_/.test(JSON.stringify(s)));
  const home=fs.readFileSync(path.join(root,'docs/.vitepress/theme/components/ResearchCenterHome.vue'),'utf8');assert.ok(!/runtimeData|runtimeLatest|LIVE RECORD|runtime-records\.json/.test(home));assert.ok(home.includes('latest-article.json'));
}
const command=process.argv[2]||'validate';if(command==='build'){execFileSync(process.execPath,[path.join(root,'scripts/research-intelligence.mjs'),'build'],{cwd:root,stdio:'pipe',windowsHide:true});archive();latest();validate();}else if(command==='latest'){latest();}else validate();console.log('Public projections '+command+' passed.');
