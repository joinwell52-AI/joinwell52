import{readFileSync,writeFileSync,mkdirSync}from'node:fs';import{stripTypeScriptTypes}from'node:module';import vm from'node:vm';import assert from'node:assert/strict';
const root=new URL('./',import.meta.url),observations=[];
const extract=(text,name)=>{const i=text.indexOf('export function '+name+'(');assert(i>=0,name);const e=text.indexOf('\n}',i);return text.slice(i,e+2).replace('export ','');};
const cases=[
 {id:'fresh',resumed:false,wake:{reason:'issue_commented'},full:'CURRENT BRIEF revision 2',compact:'task ID only'},
 {id:'ordinary-resume-after-edit',resumed:true,wake:{reason:'issue_commented'},full:'CURRENT BRIEF revision 2',compact:'task ID only'},
 {id:'second-ordinary-resume',resumed:true,wake:{reason:'status_changed'},full:'CURRENT BRIEF revision 2',compact:'task ID only'},
 {id:'assignment-resume',resumed:true,wake:{reason:'issue_assigned'},full:'CURRENT BRIEF revision 2',compact:'task ID only'},
 {id:'recovery-resume',resumed:true,wake:{reason:'source_scoped_recovery_action'},full:'CURRENT BRIEF revision 2',compact:'task ID only'},
 {id:'no-compact',resumed:true,wake:{reason:'issue_commented'},full:'CURRENT BRIEF revision 2',compact:''},
 {id:'empty-full',resumed:true,wake:{reason:'issue_commented'},full:'',compact:'task ID only'}
];
for(const version of ['base','head']){
 const src=readFileSync(new URL(`sources/code/13345/${version}/packages/adapter-utils/src/server-utils.ts`,root),'utf8');
 const names=['asString','isAssignmentShapedPaperclipWakeReason','isPaperclipRecoveryWakePayload','selectPaperclipTaskMarkdown'];
 const constant=src.match(/const ASSIGNMENT_SHAPED_PAPERCLIP_WAKE_REASONS = new Set\(\[[\s\S]*?\]\);/)[0];
 // Only normalization is substituted: inputs below stand for already normalized wake records.
 const code=stripTypeScriptTypes(constant+'\n'+names.map(n=>extract(src,n)).join('\n'));
 const ctx=vm.createContext({normalizePaperclipWakePayload:x=>x??null});vm.runInContext(code,ctx);
 for(const c of cases){const actual=ctx.selectPaperclipTaskMarkdown({paperclipTaskMarkdown:c.full,paperclipTaskMarkdownCompact:c.compact,paperclipWake:c.wake},{resumedSession:c.resumed});const expected=version==='base'&&['ordinary-resume-after-edit','second-ordinary-resume'].includes(c.id)?c.compact:c.full;assert.equal(actual,expected);observations.push({version,id:c.id,actual,contains_current_brief:actual.includes('CURRENT BRIEF')});}
}
mkdirSync(new URL('runs/',root),{recursive:true});writeFileSync(new URL('runs/brief.json',root),JSON.stringify({node:process.version,method:'Original selector and string/classification helpers; normalized-wake identity double. No DB objective-selection or provider execution; second resume is a repeated selector input, not an end-to-end resumed run.',observations},null,2)+'\n');console.log(JSON.stringify(observations));
