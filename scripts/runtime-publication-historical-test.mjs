import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import cp from 'node:child_process'
import crypto from 'node:crypto'
import { validateHistoricalPublication } from './runtime-publication-historical.mjs'

const original=process.cwd(), root=fs.mkdtempSync(path.join(os.tmpdir(),'historical-publication-'))
const hash=b=>crypto.createHash('sha256').update(b).digest('hex')
const put=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,`${JSON.stringify(v,null,2)}\n`)}
const git=(...args)=>cp.execFileSync('git',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim()
try {
  process.chdir(root)
  git('init');git('config','user.name','Runtime test');git('config','user.email','test@example.invalid');git('config','core.autocrlf','false')
  git('commit','--allow-empty','-m','seed')
  const seed=git('rev-parse','HEAD')
  const now=new Date(), today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)
  const date=new Date(new Date(`${today}T12:00:00Z`).valueOf()-86400000).toISOString().slice(0,10), [y,m]=date.split('-')
  const rp=`research/runtime/records/daily/${y}/${m}/${date}-daily-runtime.json`, wp=`research/runtime/wakes/${today.slice(0,4)}/${today.slice(5,7)}/${today}/publication-000000.json`
  const qp='research/runtime/publication-recovery-requests/test.json', bp=`research/runtime/candidates/${y}/${m}/${date}-candidates.json`, pp='research/runtime/prompt.md', ctrl='research/runtime/control.json'
  fs.mkdirSync('research/runtime',{recursive:true});fs.writeFileSync(pp,'fixed test prompt\n')
  const prompt={path:pp,version:'test',sha256:hash(fs.readFileSync(pp)),requiredSources:[]}
  put('research/runtime/SCHEDULER.json',{timezone:'Asia/Shanghai',workerControlManifest:ctrl,recordRoots:{daily:'research/runtime/records/daily'},runtimeFamilies:[{id:'daily'}],tasks:[{id:'production',family:'daily',schedule:{time:'15:00',kind:'daily'}},{id:'publication',name:'Publication',family:'daily',schedule:{time:'20:00',kind:'daily'}}]})
  put(ctrl,{state:'active',sourceBranch:'main',allowedBranches:['main'],allowedWakeSources:['manual-recovery'],tasks:{publication:{state:'active',directPublicationAllowed:true,requireSameRunDateInputs:true,prompt,maxRunMinutes:120,maxOutputItems:3,maxRecoveryAttempts:2}}})
  const record={date,taskStatus:{production:'Completed',publication:'Blocked'},results:{production:{status:'Completed',runtimeDate:date,commitVerify:'Completed',githubCommit:seed},publication:{status:'Blocked'}},timeline:[{task:'production',event:'GitHub Commit Verified',detail:seed}]}
  put(rp,record);put(bp,{date,status:'Completed',candidates:[{itemId:'test'}]})
  put(wp,{schema:'runtime-wake-receipt/v1',date:today,recoveryRuntimeDate:date,source:'manual-recovery',nominalTask:'publication',nominalTime:'20:00',status:'Received',timezone:'Asia/Shanghai'})
  const request={schema:'runtime-publication-historical-recovery/v1',date,source:'manual-recovery',requestMode:'terminal-recovery',allowTerminalReopen:true,reason:'Owner requested the existing candidate release',sourceCommit:seed,requestedAt:now.toISOString(),promptIdentity:prompt,wakeReceipt:wp,candidateBatchSha256:hash(fs.readFileSync(bp))}
  function persist(){git('add','.');git('commit','--allow-empty','-m','fixture');git('update-ref','refs/remotes/origin/main',git('rev-parse','HEAD'))}
  put(qp,request);persist()
  const args={requestPath:qp,date,wake:wp,requireClaim:false}
  validateHistoricalPublication(args)
  for(const patch of [{source:'chatgpt-scheduled-task'},{promptIdentity:{...prompt,sha256:'0'.repeat(64)}},{candidateBatchSha256:'0'.repeat(64)},{requestedAt:'2000-01-01T00:00:00Z'},{allowTerminalReopen:false}]){
    put(qp,{...request,...patch});persist();assert.throws(()=>validateHistoricalPublication(args))
  }
  put(qp,request);put(rp,{...record,taskStatus:{...record.taskStatus,publication:'Completed'}});persist();assert.throws(()=>validateHistoricalPublication(args),/not reopenable/)
  put(rp,{...record,taskStatus:{...record.taskStatus,production:'Running'}});persist();assert.throws(()=>validateHistoricalPublication(args),/Production is not verified/)
  put(rp,record);persist()
  cp.execFileSync(process.execPath,[path.join(original,'scripts/runtime-publication-historical.mjs'),'--request',qp],{encoding:'utf8'})
  assert.throws(()=>validateHistoricalPublication({...args,requireClaim:true}),/not exact fetched-main/)
  persist();validateHistoricalPublication({...args,requireClaim:true})
  assert.throws(()=>validateHistoricalPublication(args),/parallel active|not reopenable/)
  console.log('Historical Publication tests passed: explicit admission, date preservation, stale/replay guards, durable fresh claim, and no ordinary-timer authority.')
} finally {process.chdir(original);fs.rmSync(root,{recursive:true,force:true})}
