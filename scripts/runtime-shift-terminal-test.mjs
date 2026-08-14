#!/usr/bin/env node

import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

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
    sanitizedPrompt: 'A cinematic editorial landscape showing one durable bridge across a dark interruption, no dashboard, no report, no text.',
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

    const commit = 'a'.repeat(40)
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

console.log('Runtime shift terminal finalization tests passed for Completed, Failed, Blocked and Skipped, including stale-date rejection.')
