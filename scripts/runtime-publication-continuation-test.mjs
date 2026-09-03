#!/usr/bin/env node

import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

function shanghaiParts(value = new Date()) {
  return Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(value).map((part) => [part.type, part.value]))
}
function dateString(value = new Date()) {
  const p = shanghaiParts(value)
  return `${p.year}-${p.month}-${p.day}`
}
function isoShanghai(value) {
  const p = shanghaiParts(value)
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}+08:00`
}
function writeJson(file, value) {
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
function run(script, args, cwd) {
  return spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' })
}

const root = mkdtempSync(path.join(os.tmpdir(), 'runtime-publication-continuation-'))
const resolver = path.resolve('scripts/runtime-publication-continuation.mjs')
const watchdog = path.resolve('scripts/runtime-running-watchdog.mjs')
const workerClaim = path.resolve('scripts/runtime-worker-claim.mjs')

try {
  const date = dateString()
  const [year, month] = date.split('-')
  const recordFile = path.join(root, `research/runtime/records/daily/${year}/${month}/${date}-daily-runtime.json`)
  const wakeFile = path.join(root, `research/runtime/wakes/${year}/${month}/${date}/publication-200001.json`)
  const productionResult = path.join(root, `research/runtime/results/${year}/${month}/${date}-production-result.json`)
  const candidateBatch = path.join(root, `research/runtime/candidates/${year}/${month}/${date}-candidates.json`)

  writeJson(path.join(root, 'research/runtime/SCHEDULER.json'), {
    timezone: 'Asia/Shanghai',
    recordRoots: { daily: 'research/runtime/records/daily' },
    runtimeFamilies: [{ id: 'daily', taskIds: ['production', 'publication'] }],
    tasks: [
      { id: 'production', family: 'daily', name: 'Research Runtime Production' },
      { id: 'publication', family: 'daily', name: 'Research Runtime Publication' }
    ]
  })
  writeJson(productionResult, { schema: 'runtime-shift-result/v2', task: 'production', runtimeDate: date, status: 'Completed' })
  writeJson(candidateBatch, { schema: 'runtime-publication-candidate/v2', date, status: 'Completed', candidates: [] })
  writeJson(wakeFile, {
    schema: 'runtime-wake-receipt/v1',
    date,
    timezone: 'Asia/Shanghai',
    nominalTask: 'publication',
    nominalTime: '20:00',
    wakeTime: '20:00:01',
    source: 'chatgpt-scheduled-task',
    status: 'Received'
  })

  writeJson(recordFile, {
    status: 'Waiting',
    taskStatus: { production: 'Completed', publication: 'Waiting' },
    results: { production: { status: 'Completed' } },
    timeline: []
  })
  const eligible = run(resolver, ['--date', date, '--now', '21:00:00'], root)
  assert.equal(eligible.status, 0, eligible.stderr)
  const eligibleResult = JSON.parse(eligible.stdout.trim())
  assert.equal(eligibleResult.eligible, true)
  assert.match(eligibleResult.wakeReceipt, /publication-200001\.json$/)

  const openAt = isoShanghai(new Date(Date.now() - 10 * 60_000))
  writeJson(recordFile, {
    status: 'Running',
    taskStatus: { production: 'Completed', publication: 'Running' },
    results: { production: { status: 'Completed' } },
    timeline: [
      { time: openAt, task: 'publication', event: 'Execution Slot Opened', status: 'Running', detail: 'test' }
    ]
  })
  const expired = run(watchdog, [], root)
  assert.equal(expired.status, 0, expired.stderr)
  const expiredRecord = JSON.parse(readFileSync(recordFile, 'utf8'))
  assert.equal(expiredRecord.taskStatus.publication, 'Waiting')
  assert.equal(expiredRecord.timeline.at(-1).event, 'Unclaimed Execution Slot Expired')

  const recentOpen = isoShanghai(new Date(Date.now() - 10 * 60_000))
  const recentClaim = isoShanghai(new Date(Date.now() - 2 * 60_000))
  writeJson(recordFile, {
    status: 'Running',
    taskStatus: { production: 'Completed', publication: 'Running' },
    results: { production: { status: 'Completed' } },
    timeline: [
      { time: recentOpen, task: 'publication', event: 'Execution Slot Opened', status: 'Running', detail: 'test' },
      { time: recentClaim, task: 'publication', event: 'Worker Claimed', status: 'Running', detail: 'test' }
    ]
  })
  const retained = run(watchdog, [], root)
  assert.equal(retained.status, 0, retained.stderr)
  const retainedRecord = JSON.parse(readFileSync(recordFile, 'utf8'))
  assert.equal(retainedRecord.taskStatus.publication, 'Running')

  writeJson(recordFile, {
    status: 'Running',
    taskStatus: { production: 'Completed', publication: 'Running' },
    results: { production: { status: 'Completed' } },
    timeline: [
      { time: isoShanghai(new Date()), task: 'publication', event: 'Execution Slot Opened', status: 'Running', detail: 'test' }
    ]
  })
  const claim = run(workerClaim, [
    '--task', 'publication', '--date', date,
    '--receipt', path.relative(root, wakeFile).split(path.sep).join('/'),
    '--worker', 'github-deferred-publication-continuation'
  ], root)
  assert.equal(claim.status, 0, claim.stderr)
  const claimedRecord = JSON.parse(readFileSync(recordFile, 'utf8'))
  assert.match(claimedRecord.timeline.at(-1).detail, /GitHub deferred Publication continuation worker/)

  const alreadyClaimed = run(resolver, ['--date', date, '--now', '21:00:00'], root)
  assert.equal(alreadyClaimed.status, 0, alreadyClaimed.stderr)
  const alreadyClaimedResult = JSON.parse(alreadyClaimed.stdout.trim())
  assert.equal(alreadyClaimedResult.eligible, false)
  assert.match(alreadyClaimedResult.reason, /already has a Worker Claimed event/)

  const forbidden = run(workerClaim, [
    '--task', 'production', '--date', date,
    '--receipt', path.relative(root, wakeFile).split(path.sep).join('/'),
    '--worker', 'github-deferred-publication-continuation'
  ], root)
  assert.notEqual(forbidden.status, 0)
  assert.match(forbidden.stderr, /restricted to the mechanical Publication stage/)
} finally {
  rmSync(root, { recursive: true, force: true })
}

console.log('Runtime deferred Publication continuation tests passed: wake-gated continuation, five-minute unclaimed-slot expiry, claimed lease preservation, and Publication-only GitHub worker identity.')
