import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

// WORKER-CONTRACT-V3 defines Blocked for unavailable authority. Such a worker
// cannot truthfully supply an execution slot or claim as completion evidence.
export function validateAdmissionDenial({ root, date, taskId, result, record }) {
  if (result.executionMode !== 'admission-denied') return false
  const fail = message => { throw new Error(`Runtime admission denial: ${message}`) }
  if (result.status !== 'Blocked') fail('only Blocked may close without execution authority')
  if ((record.timeline || []).some(e => e.task === taskId && ['Execution Slot Opened', 'Worker Claimed'].includes(e.event))) {
    fail('an execution epoch already exists; use normal execution finalization')
  }
  const relative = result.admissionEvidence
  if (typeof relative !== 'string' || !relative.startsWith('research/runtime/evidence/') || !relative.endsWith('.json') || relative.includes('..') || relative.includes('\\')) fail('invalid admission evidence path')
  if (!(result.evidence || []).includes(relative)) fail('result must bind admission evidence')
  const evidence = JSON.parse(readFileSync(path.join(root, relative), 'utf8'))
  if (evidence.schema !== 'research-runtime-worker-admission/v1' || evidence.decision !== 'Denied' || evidence.task !== taskId || evidence.runtimeDate !== date) fail('wrong denial identity')
  if (!Array.isArray(evidence.reasons) || !evidence.reasons.some(r => typeof r === 'string' && r.trim())) fail('missing denial reason')
  if (!/^[0-9a-f]{40}$/.test(evidence.sourceCommit || '')) fail('missing pinned main commit')
  const scheduler = JSON.parse(readFileSync(path.join(root, 'research/runtime/SCHEDULER.json'), 'utf8'))
  const control = JSON.parse(readFileSync(path.join(root, scheduler.workerControlManifest), 'utf8'))
  const prompt = control.tasks[taskId].prompt
  for (const key of ['path', 'version', 'sha256']) if (evidence.prompt?.[key] !== prompt[key]) fail('stale prompt identity')
  if (createHash('sha256').update(readFileSync(path.join(root, prompt.path))).digest('hex') !== prompt.sha256) fail('prompt hash drift')
  const wakePath = evidence.wakeReceipt
  if (typeof wakePath !== 'string' || !wakePath.startsWith('research/runtime/wakes/') || wakePath.includes('..') || wakePath.includes('\\')) fail('invalid wake path')
  const wake = JSON.parse(readFileSync(path.join(root, wakePath), 'utf8'))
  if (wake.schema !== 'runtime-wake-receipt/v1' || wake.status !== 'Received' || wake.date !== evidence.runDate || wake.nominalTask !== taskId || wake.source !== evidence.wakeSource || wake.timezone !== scheduler.timezone || !control.allowedWakeSources.includes(wake.source)) fail('denial wake mismatch')
  if (evidence.runDate !== date && wake.recoveryRuntimeDate !== date) fail('historical recovery date is not bound to the actual wake')
  if (result.startedAt) fail('denied admission must not claim execution started')
  return true
}
