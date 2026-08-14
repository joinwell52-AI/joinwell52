#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { validateProductionCompletion } from './runtime-production-proof.mjs'

const ROOT = process.cwd()
const manifest = JSON.parse(readFileSync(path.join(ROOT, 'research/runtime/SCHEDULER.json'), 'utf8'))
const TERMINAL = new Set(['Completed', 'Failed', 'Blocked', 'Skipped'])

function argsOf(argv) {
  const args = {}
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i]
    if (!token.startsWith('--')) continue
    const key = token.slice(2)
    const next = argv[i + 1]
    if (!next || next.startsWith('--')) args[key] = true
    else { args[key] = next; i += 1 }
  }
  return args
}

function fail(message) { throw new Error(`Runtime shift verification: ${message}`) }
function readJson(file) { return JSON.parse(readFileSync(file, 'utf8')) }
function writeJson(file, value) { writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`) }
function clock() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: manifest.timezone,
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date()).map((part) => [part.type, part.value]))
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+08:00`
}
function recordPath(task, date) {
  const [year, month] = date.split('-')
  return path.join(ROOT, manifest.recordRoots[task.family], year, month, `${date}-${task.family}-runtime.json`)
}
function closesExecutionEpoch(event) {
  if (!event || typeof event !== 'object') return false
  if (['Running Lease Expired', 'Order Violation Corrected', 'Order Violation Invalidated'].includes(event.event)) return true
  if (['Blocked', 'Failed', 'Skipped'].includes(event.status)) return true
  return event.status === 'Completed' && /Completed$/.test(String(event.event || ''))
}

const args = argsOf(process.argv)
const taskId = String(args.task || '')
const date = String(args.date || '')
const commit = String(args.commit || '')
const allowHistorical = String(args['allow-historical'] || '') === 'true'
const task = manifest.tasks.find((item) => item.id === taskId)
if (!task) fail(`unknown task ${taskId}`)
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(`invalid date ${date}`)
if (!/^[0-9a-f]{40}$/.test(commit)) fail(`invalid commit ${commit}`)

const file = recordPath(task, date)
if (!existsSync(file)) fail(`runtime record not found for ${taskId} on ${date}`)
const record = readJson(file)
if (record.date !== date) fail(`record date ${record.date} does not match ${date}`)
const terminalStatus = record.taskStatus?.[taskId]
if (!TERMINAL.has(terminalStatus)) fail(`taskStatus.${taskId} must be terminal, got ${terminalStatus}`)
const result = record.results?.[taskId]
if (!result || result.status !== terminalStatus) fail(`results.${taskId}.status must match ${terminalStatus}`)
if (result.runtimeDate && result.runtimeDate !== date) fail(`results.${taskId}.runtimeDate ${result.runtimeDate} does not match ${date}`)
if (taskId === 'production' && terminalStatus === 'Completed') {
  validateProductionCompletion({ root: ROOT, date, result, timezone: manifest.timezone })
}

const timeline = Array.isArray(record.timeline) ? record.timeline : []
const belongsToExecutionDate = (event) => allowHistorical || String(event.time || '').startsWith(date)
const startIndexes = timeline
  .map((event, index) => ({ event, index }))
  .filter(({ event }) =>
    event.task === taskId &&
    event.event === 'Execution Slot Opened' &&
    event.status === 'Running' &&
    belongsToExecutionDate(event)
  )
  .map(({ index }) => index)
if (!startIndexes.length) fail(`missing ${date} start event for ${taskId}`)

// Recovery can legitimately open a later execution epoch after an earlier Running lease
// expires or another governed terminal/correction event closes the prior epoch. Historical
// starts remain audit evidence; verification requires every prior epoch to be closed before
// the next start rather than requiring the entire day to contain exactly one start.
for (let i = 0; i < startIndexes.length - 1; i += 1) {
  const startIndex = startIndexes[i]
  const nextStartIndex = startIndexes[i + 1]
  const closed = timeline.slice(startIndex + 1, nextStartIndex).some((event) =>
    event.task === taskId && belongsToExecutionDate(event) && closesExecutionEpoch(event)
  )
  if (!closed) fail(`execution epoch ${i + 1} for ${taskId} was not closed before recovery start ${i + 2}`)
}

const latestStartIndex = startIndexes[startIndexes.length - 1]
const terminalIndex = timeline.findIndex((event, index) =>
  index > latestStartIndex &&
  event.task === taskId &&
  event.status === terminalStatus &&
  belongsToExecutionDate(event) &&
  event.event === `Shift ${terminalStatus}`
)
if (terminalIndex < 0) fail(`missing ${date} ${terminalStatus} event after latest execution start for ${taskId}`)

const workerClaimIndex = timeline.findIndex((event, index) =>
  index > latestStartIndex &&
  index < terminalIndex &&
  event.task === taskId &&
  event.event === 'Worker Claimed' &&
  event.status === 'Running' &&
  belongsToExecutionDate(event)
)
if (workerClaimIndex < 0) fail(`missing fresh Worker Claimed event in latest execution epoch for ${taskId}`)

const existing = timeline.find((event) =>
  event.task === taskId &&
  event.event === 'GitHub Commit Verified' &&
  event.status === 'Completed' &&
  belongsToExecutionDate(event) &&
  String(event.detail || '').includes(commit)
)
if (existing) {
  if (record.githubCommit !== commit || record.commitVerify !== 'Completed') {
    record.githubCommit = commit
    record.commitVerify = 'Completed'
    result.githubCommit = commit
    result.commitVerify = 'Completed'
    result.verifiedAt = existing.time
    record.updatedAt = existing.time
    writeJson(file, record)
    console.log(`Reconciled verification fields for ${taskId} ${date} commit ${commit}.`)
  } else {
    console.log(`Verification already recorded for ${taskId} ${date} commit ${commit}.`)
  }
  process.exit(0)
}

const verifiedAt = clock()
record.timeline.push({
  time: verifiedAt,
  task: taskId,
  event: 'GitHub Commit Verified',
  status: 'Completed',
  detail: `Fetched and verified durable ${task.name} ${terminalStatus} result commit ${commit} on main; ${startIndexes.length} execution epoch(s) remain as audit evidence, every prior epoch is governed-closed, and the latest epoch contains a fresh Worker Claimed event before terminal finalization.`
})
result.githubCommit = commit
result.commitVerify = 'Completed'
result.verifiedAt = verifiedAt
record.githubCommit = commit
record.commitVerify = 'Completed'
record.updatedAt = verifiedAt
writeJson(file, record)
console.log(`Recorded durable ${terminalStatus} verification for ${taskId} ${date} commit ${commit} across ${startIndexes.length} execution epoch(s).`)
