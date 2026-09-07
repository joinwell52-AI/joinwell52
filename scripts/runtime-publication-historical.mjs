import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import cp from 'node:child_process'
import { appendScheduledEvent } from './runtime-v5.mjs'

const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const git = (...args) => cp.execFileSync('git', args)
const clock = () => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map(p => [p.type,p.value]))
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}:${p.second}` }
}
function fail(message) { throw new Error(`Historical Publication recovery: ${message}`) }
function durable(p) {
  if (typeof p !== 'string' || p.includes('..') || p.includes('\\') || !p.startsWith('research/runtime/')) fail('unsafe request path')
  if (!git('show', `origin/main:${p}`).equals(fs.readFileSync(p))) fail(`not exact fetched-main bytes: ${p}`)
}

export function validateHistoricalPublication({ requestPath, date, wake, requireClaim = true }) {
  if (!requestPath?.startsWith('research/runtime/publication-recovery-requests/') || !requestPath.endsWith('.json')) fail('invalid request path')
  durable(requestPath)
  const request = read(requestPath)
  const now = clock()
  if (request.schema !== 'runtime-publication-historical-recovery/v1' || request.source !== 'manual-recovery' || request.requestMode !== 'terminal-recovery' || request.allowTerminalReopen !== true) fail('explicit recovery authorization missing')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(request.date) || request.date >= now.date || request.date !== date || request.wakeReceipt !== wake) fail('historical date/wake mismatch')
  if (!request.reason?.trim() || !/^[0-9a-f]{40}$/.test(request.sourceCommit)) fail('missing source or reason')
  git('merge-base','--is-ancestor',request.sourceCommit,'origin/main')
  const scheduler = read('research/runtime/SCHEDULER.json')
  const control = read(scheduler.workerControlManifest)
  const task = control.tasks.publication
  if (scheduler.timezone !== 'Asia/Shanghai' || control.state !== 'active' || control.sourceBranch !== 'main' || !control.allowedBranches.includes('main') || !control.allowedWakeSources.includes('manual-recovery') || task.state !== 'active' || !task.directPublicationAllowed || !task.requireSameRunDateInputs) fail('control admission denied')
  const prompt = task.prompt
  for (const k of ['path','version','sha256']) if (request.promptIdentity?.[k] !== prompt[k]) fail('stale request prompt')
  if (hash(fs.readFileSync(prompt.path)) !== prompt.sha256) fail('prompt SHA mismatch')
  for (const p of ['research/runtime/SCHEDULER.json', scheduler.workerControlManifest, prompt.path, ...prompt.requiredSources]) { durable(p); fs.readFileSync(p) }
  const age = Date.now() - Date.parse(request.requestedAt)
  if (!Number.isFinite(age) || age < 0 || age > task.maxRunMinutes * 60000) fail('recovery request expired')
  durable(wake)
  const receipt = read(wake)
  if (receipt.schema !== 'runtime-wake-receipt/v1' || receipt.date !== now.date || receipt.recoveryRuntimeDate !== date || receipt.source !== 'manual-recovery' || receipt.nominalTask !== 'publication' || receipt.nominalTime !== '20:00' || receipt.status !== 'Received' || receipt.timezone !== scheduler.timezone) fail('actual-time wake mismatch')
  const [y,m] = date.split('-')
  const recordPath = `${scheduler.recordRoots.daily}/${y}/${m}/${date}-daily-runtime.json`
  const record = read(recordPath)
  const production = record.results.production
  if (record.taskStatus.production !== 'Completed' || production?.status !== 'Completed' || production.runtimeDate !== date || production.commitVerify !== 'Completed') fail('Production is not verified Completed')
  git('merge-base','--is-ancestor',production.githubCommit,'origin/main')
  if (!record.timeline.some(e=>e.task==='production' && e.event==='GitHub Commit Verified' && e.detail.includes(production.githubCommit))) fail('missing Production verification event')
  const day = new Intl.DateTimeFormat('en-US',{weekday:'long',timeZone:scheduler.timezone}).format(new Date(`${date}T12:00:00+08:00`))
  for (const t of scheduler.tasks.filter(t=>t.schedule.time<'20:00' && (t.schedule.kind==='daily'||t.schedule.days.includes(day)))) {
    const r=read(`${scheduler.recordRoots[t.family]}/${y}/${m}/${date}-${t.family}-runtime.json`)
    if (!['Completed','Blocked','Failed','Skipped'].includes(r.taskStatus[t.id])) fail(`earlier task ${t.id} remains unfinished`)
  }
  for (const d of new Set([date,now.date])) for (const family of scheduler.runtimeFamilies) {
    const [year,month]=d.split('-'), p=`${scheduler.recordRoots[family.id]}/${year}/${month}/${d}-${family.id}-runtime.json`
    if (fs.existsSync(p)) for (const [id,status] of Object.entries(read(p).taskStatus)) {
      if (status==='Running' && !(d===date&&id==='publication'&&requireClaim)) fail(`parallel active task ${d}/${id}`)
    }
  }
  const batchPath=`research/runtime/candidates/${y}/${m}/${date}-candidates.json`
  durable(batchPath)
  if(hash(fs.readFileSync(batchPath))!==request.candidateBatchSha256) fail('candidate batch changed')
  const batch=read(batchPath)
  if(batch.date!==date||batch.status!=='Completed'||batch.candidates.length>task.maxOutputItems) fail('invalid same-date batch')
  const recoveryClaims=record.timeline.filter(e=>e.task==='publication'&&e.event==='Worker Claimed'&&e.detail.includes('Historical Publication recovery'))
  if(recoveryClaims.length > task.maxRecoveryAttempts || (!requireClaim&&recoveryClaims.length>=task.maxRecoveryAttempts)) fail('recovery attempts exhausted')
  if (requireClaim) {
    durable(recordPath)
    if(record.taskStatus.publication!=='Running') fail('Publication is not Running')
    const start=record.timeline.findLastIndex(e=>e.task==='publication'&&e.event==='Execution Slot Opened'&&e.status==='Running')
    const claim=record.timeline.slice(start+1).find(e=>e.task==='publication'&&e.event==='Worker Claimed'&&e.status==='Running'&&e.detail.includes(requestPath)&&e.detail.includes(wake))
    if(start<0||!claim||Date.parse(claim.time)<Date.parse(request.requestedAt)||Date.now()-Date.parse(claim.time)>task.maxRunMinutes*60000) fail('fresh request-bound claim missing')
  } else if(!['Waiting','Blocked','Failed'].includes(record.taskStatus.publication)) fail('Publication is not reopenable')
  return {request,record,recordPath,now,scheduler}
}

if (process.argv[1] && path.resolve(process.argv[1])===path.resolve(import.meta.filename)) {
  const requestPath=process.argv[process.argv.indexOf('--request')+1]
  const request=read(requestPath)
  const {record,recordPath,now,scheduler}=validateHistoricalPublication({requestPath,date:request.date,wake:request.wakeReceipt,requireClaim:false})
  appendScheduledEvent(record,scheduler.tasks.find(t=>t.id==='publication'),now,{reopenTerminal:true})
  record.timeline.at(-1).detail=`Historical Publication recovery opened under explicit owner authorization ${requestPath}; original runtime date ${request.date}, actual execution date ${now.date}.`
  record.timeline.push({time:`${now.date}T${now.time}+08:00`,task:'publication',event:'Worker Claimed',status:'Running',detail:`Historical Publication recovery worker claimed the verified candidate release under ${requestPath}, actual wake ${request.wakeReceipt}; no research or rewriting authorized.`})
  fs.writeFileSync(recordPath,`${JSON.stringify(record,null,2)}\n`)
  console.log(`Historical Publication claimed for ${request.date} at ${now.date}T${now.time}+08:00`)
}
