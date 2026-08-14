#!/usr/bin/env node

import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { appendScheduledEvent } from './runtime-v5.mjs'

function shanghaiDateParts() {
  return Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date()).map((part) => [part.type, part.value]))
}

function writeJson(file, value) {
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

const task = { id: 'production', name: 'Research Runtime Production' }
const now = { date: '2026-08-14', time: '23:55:00' }
const terminalRecord = {
  status: 'Failed',
  taskStatus: { production: 'Failed' },
  results: { production: { status: 'Failed' } },
  timeline: []
}

assert.equal(appendScheduledEvent(structuredClone(terminalRecord), task, now), false)
const reopened = structuredClone(terminalRecord)
assert.equal(appendScheduledEvent(reopened, task, now, { reopenTerminal: true }), true)
assert.equal(reopened.taskStatus.production, 'Running')
assert.equal(reopened.results.production, undefined)
assert.match(reopened.timeline.at(-1).detail, /explicit governed terminal-recovery authorization/)

const completed = structuredClone(terminalRecord)
completed.status = 'Completed'
completed.taskStatus.production = 'Completed'
completed.results.production.status = 'Completed'
assert.equal(appendScheduledEvent(completed, task, now, { reopenTerminal: true }), false)

const root = mkdtempSync(path.join(os.tmpdir(), 'runtime-recovery-reconcile-'))
try {
  const parts = shanghaiDateParts()
  const date = `${parts.year}-${parts.month}-${parts.day}`
  writeJson(path.join(root, 'research/runtime/SCHEDULER.json'), {
    timezone: 'Asia/Shanghai',
    recordRoots: { daily: 'research/runtime/records/daily' },
    tasks: [
      { id: 'discovery', name: 'Discovery', family: 'daily', schedule: { kind: 'daily', time: '00:00' } },
      { id: 'queue', name: 'Queue', family: 'daily', schedule: { kind: 'daily', time: '00:01' } },
      { id: 'reading', name: 'Reading', family: 'daily', schedule: { kind: 'daily', time: '00:02' } },
      { id: 'analysis', name: 'Analysis', family: 'daily', schedule: { kind: 'daily', time: '00:03' } },
      { id: 'production', name: 'Production', family: 'daily', schedule: { kind: 'daily', time: '00:04' } },
      { id: 'publication', name: 'Publication', family: 'daily', schedule: { kind: 'daily', time: '00:05' } }
    ]
  })
  writeJson(path.join(root, `research/runtime/records/daily/${parts.year}/${parts.month}/${date}-daily-runtime.json`), {
    taskStatus: { discovery: 'Completed', queue: 'Completed', reading: 'Completed', analysis: 'Completed', production: 'Failed', publication: 'Waiting' },
    results: { discovery: { status: 'Completed' }, queue: { status: 'Completed' }, reading: { status: 'Completed' }, analysis: { status: 'Completed' }, production: { status: 'Failed' } },
    timeline: []
  })
  const reconcile = path.resolve('scripts/runtime-reconcile.mjs')
  const ordinary = spawnSync(process.execPath, [reconcile], { cwd: root, encoding: 'utf8' })
  assert.equal(ordinary.status, 0)
  assert.match(ordinary.stdout, /No runnable task/)
  const recovery = spawnSync(process.execPath, [reconcile, '--recover', 'production'], { cwd: root, encoding: 'utf8' })
  assert.equal(recovery.status, 0, recovery.stderr)
  assert.match(recovery.stdout, /Selected earliest due unfinished task production/)

  const kickResolver = path.resolve('scripts/runtime-kick-resolve.mjs')
  const ordinaryKickPath = path.join(root, 'ordinary-kick.json')
  writeJson(ordinaryKickPath, { schema: 'runtime-process-kick/v1', nominalTask: 'production' })
  const ordinaryKick = spawnSync(process.execPath, [kickResolver, ordinaryKickPath], { encoding: 'utf8' })
  assert.equal(ordinaryKick.status, 0)
  assert.equal(ordinaryKick.stdout, '')

  const recoveryKickPath = path.join(root, 'recovery-kick.json')
  writeJson(recoveryKickPath, {
    schema: 'runtime-process-kick/v2',
    requestMode: 'terminal-recovery',
    nominalTask: 'production',
    allowTerminalReopen: true
  })
  const recoveryKick = spawnSync(process.execPath, [kickResolver, recoveryKickPath], { encoding: 'utf8' })
  assert.equal(recoveryKick.status, 0)
  assert.equal(recoveryKick.stdout, 'production')
} finally {
  rmSync(root, { recursive: true, force: true })
}

console.log('Runtime terminal recovery tests passed: ordinary wakes stay closed and explicit recovery reopens Failed Production.')
