// Repackaged from the completed 2026-10-27 internal Analysis experiment.
// Same constructed cases and equations; not upstream benchmark implementation.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const realistic=metrics=>Object.values(metrics).every(x=>typeof x==='number'&&Number.isFinite(x)&&x!==-1)&&Object.values(metrics).some(x=>x>0);
const cases=[['positive-control',{rmse:0.2},true],['target-fail-control',{rmse:2},false],['zero-perfect-error',{rmse:0},true],['negative-impossible-error',{rmse:-0.5,positive_aux:1},true],['sentinel',{rmse:-1},true],['nonfinite',{rmse:Infinity},false],['nonnumeric',{rmse:'0.2'},false]];
const filterRows=cases.map(([id,metrics,targetPass])=>({id,metrics:Object.fromEntries(Object.entries(metrics).map(([k,v])=>[k,Number.isFinite(v)?v:String(v)])),targetPass,realistic:realistic(metrics),score:realistic(metrics)&&targetPass?1:0}));
const decompose=xs=>{const good=xs.filter(x=>x.realistic);return {queries:xs.length,coverage:good.length/xs.length,conditionalPass:good.length?good.reduce((a,x)=>a+x.pass,0)/good.length:0,score:xs.reduce((a,x)=>a+(x.realistic?x.pass:0),0)/xs.length}};
const pass={realistic:true,pass:1},fail={realistic:true,pass:0},missing={realistic:false,pass:0};
const equalHeadline=[decompose([pass,pass,fail,fail]),decompose([pass,pass,missing,missing])];
const tasks=[decompose([pass]),decompose(Array(9).fill(fail))];
const weighting={tasks,macroAverage:tasks.reduce((s,t)=>s+t.score,0)/tasks.length,pooledQueryAverage:tasks.reduce((s,t)=>s+t.score*t.queries,0)/tasks.reduce((s,t)=>s+t.queries,0),headlineSum:tasks.reduce((s,t)=>s+t.score,0)};
const fallback=[];
for(const sanity of [0,1])for(const target of [0,1]){const literal=.4*sanity+.6*target,proportional=.2*sanity+.8*target;fallback.push({sanity,target,literal,proportional,difference:literal-proportional});}
const stored=JSON.parse(fs.readFileSync(new URL('./experiment-stbench.json',import.meta.url)));
for(const [key,value] of Object.entries({filterRows,equalHeadline,weighting,fallback}))assert.deepEqual(value,stored[key],key+' differs from original internal result');
console.log('All four packaged calculation groups match the completed same-date internal experiment. No upstream benchmark executed.');
