#!/usr/bin/env node

import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { validateProductionCompletion } from './runtime-production-proof.mjs'

const repositoryRoot = process.cwd()
const completeScript = path.join(repositoryRoot, 'scripts/runtime-shift-complete.mjs')
const verifyScript = path.join(repositoryRoot, 'scripts/runtime-shift-verify.mjs')

function shanghaiDate() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date()).map((part) => [part.type, part.value]))
  return `${parts.year}-${parts.month}-${parts.day}`
}

function run(script, args, cwd) {
  const result = spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' })
  if (result.status !== 0) {
    throw new Error(`${path.basename(script)} failed:\n${result.stdout}\n${result.stderr}`)
  }
}

function writeJson(file, value) {
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function writeCompletedProductionProof(root, date, result) {
  const [year, month] = date.split('-')
  const compact = date.replaceAll('-', '')
  const itemId = `Q-${compact}-01`
  const slug = `${date}-proof-candidate`
  const zhPath = `staging/publication-candidates/${slug}.zh.md`
  const enPath = `staging/publication-candidates/${slug}.en.md`
  const coverPath = `staging/publication-candidates/${slug}-cover.png`
  const batchPath = `research/runtime/candidates/${year}/${month}/${date}-candidates.json`
  const checkpointPath = `research/runtime/checkpoints/${year}/${month}/${date}-production.json`

  const article = (language) => `---\nschema: "publication-candidate-article/v2"\ntitle: "Proof ${language}"\ndate: "${date}"\ncover: "${coverPath}"\n---\n\n![Cover](${coverPath})\n\n# Proof ${language}\n`
  const analysis = `---\nschema: "research-analysis/v1"\nid: "AN-${compact}-01"\ndate: "${date}"\nqueue_item: "${itemId}"\nstatus: "ReadyForProduction"\nproduction_input_authorized: true\n---\n\n# Input\n`
  mkdirSync(path.dirname(path.join(root, zhPath)), { recursive: true })
  writeFileSync(path.join(root, zhPath), article('ZH'))
  writeFileSync(path.join(root, enPath), article('EN'))
  writeFileSync(path.join(root, coverPath), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]))
  mkdirSync(path.join(root, 'research/analysis'), { recursive: true })
  writeFileSync(path.join(root, `research/analysis/${itemId}-proof.md`), analysis)
  writeJson(path.join(root, batchPath), {
    schema: 'runtime-publication-candidate/v2',
    date,
    timezone: 'Asia/Shanghai',
    status: 'Completed',
    candidates: [{
      itemId, zhPath, enPath, coverPath,
      gates: { researchValue: 'PASS', evidence: 'PASS' },
      coverGate: 'PASS', inlineVisualGate: 'PASS', layoutGate: 'PASS'
    }]
  })
  writeJson(path.join(root, checkpointPath), {
    schema: 'runtime-production-checkpoint/v1',
    runDate: date,
    node: 'validators-passed',
    status: 'Completed',
    artifacts: [batchPath, coverPath],
    evidence: [],
    sourceCommit: 'b'.repeat(40),
    updatedAt: `${date}T16:00:00+08:00`
  })
  result.productionMode = 'candidate-batch'
  result.coverEvidence = [{
    itemId,
    briefId: `${date}:${itemId}:cover-v1`,
    coverPath,
    sanitizedPrompt: 'Cinematic editorial landscape photography of one durable illuminated bridge crossing a dark interrupted valley, restrained steel blue and amber palette, strong focal hierarchy, wide sixteen by nine composition.',
    generationAttempts: 1,
    semanticReview: 'PASS'
  }]
  result.artifacts = [batchPath, coverPath]
}

for (const terminalStatus of ['Completed', 'Failed', 'Blocked', 'Skipped']) {
  const root = mkdtempSync(path.join(os.tmpdir(), `runtime-${terminalStatus.toLowerCase()}-`))
  try {
    const date = shanghaiDate()
    const [year, month] = date.split('-')
    const recordFile = path.join(root, 'research/runtime/records/daily', year, month, `${date}-daily-runtime.json`)
    const resultPath = `research/runtime/results/${year}/${month}/${date}-production-result.json`
    const resultFile = path.join(root, resultPath)
    writeJson(path.join(root, 'research/runtime/SCHEDULER.json'), {
      timezone: 'Asia/Shanghai',
      statuses: ['Waiting', 'Running', 'Completed', 'Failed', 'Blocked', 'Skipped'],
      resultContract: 'runtime-shift-result/v2',
      recordRoots: { daily: 'research/runtime/records/daily' },
      tasks: [{ id: 'production', family: 'daily', name: 'Research Runtime Production' }]
    })
    writeJson(recordFile, {
      date,
      timezone: 'Asia/Shanghai',
      status: 'Running',
      taskStatus: { production: 'Running' },
      results: {},
      timeline: [
        { time: `${date}T15:00:01+08:00`, task: 'production', event: 'Execution Slot Opened', status: 'Running' },
        { time: `${date}T15:00:02+08:00`, task: 'production', event: 'Worker Claimed', status: 'Running' }
      ]
    })
    const result = {
      schema: 'runtime-shift-result/v2',
      task: 'production',
      status: terminalStatus,
      runtimeDate: date,
      input: 'Test input.', input_zh: '测试输入。',
      workResult: 'Test result.', workResult_zh: '测试结果。',
      output: 'Test output.', output_zh: '测试输出。',
      next: 'No next action.', next_zh: '没有后续操作。',
      reason: terminalStatus === 'Completed' ? undefined : `Test ${terminalStatus} terminal state.`,
      metrics: [], evidence: [], artifacts: []
    }
    if (terminalStatus === 'Completed') writeCompletedProductionProof(root, date, result)
    writeJson(resultFile, result)
    run(completeScript, ['--task', 'production', '--date', date, '--result', resultPath], root)
    let record = JSON.parse(readFileSync(recordFile, 'utf8'))
    assert.equal(record.taskStatus.production, terminalStatus)
    assert.equal(record.results.production.status, terminalStatus)
    assert.ok(record.timeline.some((event) => event.event === `Shift ${terminalStatus}` && event.status === terminalStatus))

    // A scheduler-expired unclaimed slot is closed; an arbitrary Waiting event is not.
    record.timeline.unshift(
      { time: `${date}T14:00:01+08:00`, task: 'production', event: 'Execution Slot Opened', status: 'Running' },
      { time: `${date}T14:05:02+08:00`, task: 'production', event: 'Unclaimed Execution Slot Expired', status: 'Waiting' }
    )
    writeJson(recordFile, record)
    const commit = 'a'.repeat(40)
    const invalidRecord = structuredClone(record)
    invalidRecord.timeline[1].event = 'Wake Received'
    writeJson(recordFile, invalidRecord)
    const rejectedEpoch = spawnSync(process.execPath, [verifyScript, '--task', 'production', '--date', date, '--commit', commit], { cwd: root, encoding: 'utf8' })
    assert.notEqual(rejectedEpoch.status, 0)
    assert.match(rejectedEpoch.stderr, /was not closed before recovery start/)
    writeJson(recordFile, record)
    run(verifyScript, ['--task', 'production', '--date', date, '--commit', commit], root)
    record = JSON.parse(readFileSync(recordFile, 'utf8'))
    assert.equal(record.taskStatus.production, terminalStatus)
    assert.equal(record.results.production.commitVerify, 'Completed')
    assert.equal(record.githubCommit, commit)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

{
  const root = mkdtempSync(path.join(os.tmpdir(), 'runtime-contaminated-cover-prompt-'))
  try {
    const date = shanghaiDate()
    const result = {
      schema: 'runtime-shift-result/v2',
      task: 'production',
      status: 'Completed',
      runtimeDate: date,
      metrics: [], evidence: [], artifacts: []
    }
    writeCompletedProductionProof(root, date, result)
    result.coverEvidence[0].sanitizedPrompt = 'No dashboard, no report, no text; show one bridge.'
    assert.throws(
      () => validateProductionCompletion({ root, date, result }),
      /positive-only article imagery/
    )
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

{
  const root = mkdtempSync(path.join(os.tmpdir(), 'runtime-stale-production-'))
  try {
    const date = shanghaiDate()
    const [year, month] = date.split('-')
    const recordFile = path.join(root, 'research/runtime/records/daily', year, month, `${date}-daily-runtime.json`)
    const resultPath = `research/runtime/results/${year}/${month}/${date}-production-result.json`
    const resultFile = path.join(root, resultPath)
    writeJson(path.join(root, 'research/runtime/SCHEDULER.json'), {
      timezone: 'Asia/Shanghai',
      statuses: ['Waiting', 'Running', 'Completed', 'Failed', 'Blocked', 'Skipped'],
      resultContract: 'runtime-shift-result/v2',
      recordRoots: { daily: 'research/runtime/records/daily' },
      tasks: [{ id: 'production', family: 'daily', name: 'Research Runtime Production' }]
    })
    writeJson(recordFile, {
      date,
      timezone: 'Asia/Shanghai',
      status: 'Running',
      taskStatus: { production: 'Running' },
      results: {},
      timeline: [
        { time: `${date}T17:00:01+08:00`, task: 'production', event: 'Execution Slot Opened', status: 'Running' },
        { time: `${date}T17:00:02+08:00`, task: 'production', event: 'Worker Claimed', status: 'Running' }
      ]
    })
    const result = {
      schema: 'runtime-shift-result/v2',
      task: 'production',
      status: 'Completed',
      runtimeDate: date,
      input: 'Test input.', input_zh: 'Test input zh.',
      workResult: 'Test result.', workResult_zh: 'Test result zh.',
      output: 'Test output.', output_zh: 'Test output zh.',
      next: 'No next action.', next_zh: 'No next action zh.',
      metrics: [], evidence: [], artifacts: []
    }
    writeCompletedProductionProof(root, date, result)
    const batchPath = path.join(root, `research/runtime/candidates/${year}/${month}/${date}-candidates.json`)
    const batch = JSON.parse(readFileSync(batchPath, 'utf8'))
    batch.candidates[0].coverPath = 'staging/publication-candidates/2025-07-06-stale-cover.png'
    writeJson(batchPath, batch)
    writeJson(resultFile, result)

    const rejected = spawnSync(process.execPath, [completeScript, '--task', 'production', '--date', date, '--result', resultPath], {
      cwd: root,
      encoding: 'utf8'
    })
    assert.notEqual(rejected.status, 0)
    assert.match(`${rejected.stdout}\n${rejected.stderr}`, /does not belong to run date/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

{
  const root = mkdtempSync(path.join(os.tmpdir(), 'runtime-denied-admission-'))
  try {
    const today = shanghaiDate()
    const date = new Date(new Date(`${today}T12:00:00Z`).valueOf() - 86400000).toISOString().slice(0, 10)
    const [year, month] = date.split('-')
    const taskId = 'publication'
    const recordFile = path.join(root, `research/runtime/records/daily/${year}/${month}/${date}-daily-runtime.json`)
    const resultPath = `research/runtime/results/${year}/${month}/${date}-publication-result.json`
    const evidencePath = `research/runtime/evidence/${year}/${month}/denied.json`
    const wakePath = 'research/runtime/wakes/test/publication.json'
    const scheduler = JSON.parse(readFileSync(path.join(repositoryRoot, 'research/runtime/SCHEDULER.json'), 'utf8'))
    const control = JSON.parse(readFileSync(path.join(repositoryRoot, scheduler.workerControlManifest), 'utf8'))
    const prompt = control.tasks.publication.prompt
    writeJson(path.join(root, 'research/runtime/SCHEDULER.json'), scheduler)
    writeJson(path.join(root, scheduler.workerControlManifest), control)
    mkdirSync(path.dirname(path.join(root, prompt.path)), { recursive: true })
    writeFileSync(path.join(root, prompt.path), readFileSync(path.join(repositoryRoot, prompt.path)))
    writeJson(path.join(root, wakePath), { schema: 'runtime-wake-receipt/v1', date: today, recoveryRuntimeDate: date, timezone: 'Asia/Shanghai', nominalTask: taskId, status: 'Received', source: 'manual-recovery' })
    const evidence = { schema: 'research-runtime-worker-admission/v1', decision: 'Denied', task: taskId, runtimeDate: date, runDate: today, reasons: ['Historical claim denied'], sourceCommit: 'b'.repeat(40), prompt, wakeReceipt: wakePath, wakeSource: 'manual-recovery' }
    writeJson(path.join(root, evidencePath), evidence)
    const initial = { date, taskStatus: { publication: 'Waiting' }, results: {}, timeline: [] }
    writeJson(recordFile, initial)
    const result = { schema: 'runtime-shift-result/v2', task: taskId, runtimeDate: date, status: 'Blocked', executionMode: 'admission-denied', admissionEvidence: evidencePath, reason: 'Unavailable historical execution authority', input: { date }, workResult: { denied: true }, output: { released: 0 }, next: { action: 'Governed recovery' }, metrics: [], evidence: [evidencePath], artifacts: [evidencePath] }
    const completeArgs = ['--task', taskId, '--date', date, '--result', resultPath, '--allow-historical', 'true']
    for (const invalid of [ { ...result, status: 'Completed' }, { ...result, evidence: [] }, { ...result, startedAt: `${date}T20:00:00+08:00` } ]) {
      writeJson(path.join(root, resultPath), invalid)
      const rejected = spawnSync(process.execPath, [completeScript, ...completeArgs], { cwd: root, encoding: 'utf8' })
      assert.notEqual(rejected.status, 0, 'invalid admission denial must not finalize')
      assert.deepEqual(JSON.parse(readFileSync(recordFile, 'utf8')), initial)
    }
    writeJson(path.join(root, resultPath), result)
    run(completeScript, completeArgs, root)
    run(verifyScript, ['--task', taskId, '--date', date, '--commit', 'a'.repeat(40), '--allow-historical', 'true'], root)
    const closed = JSON.parse(readFileSync(recordFile, 'utf8'))
    assert.equal(closed.taskStatus.publication, 'Blocked')
    assert.equal(closed.commitVerify, 'Completed')
    assert.equal(closed.timeline.filter(e => e.event === 'Worker Claimed' || e.event === 'Execution Slot Opened').length, 0)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

console.log('Runtime shift terminal tests passed, including expired unclaimed epochs and denied-admission historical closure.')
