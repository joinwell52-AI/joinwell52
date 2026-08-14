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
    writeJson(resultFile, {
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
    })
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

console.log('Runtime shift terminal finalization tests passed for Completed, Failed, Blocked and Skipped.')
