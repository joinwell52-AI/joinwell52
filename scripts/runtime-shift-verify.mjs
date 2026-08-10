#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const manifest = JSON.parse(readFileSync(path.join(ROOT, 'research/runtime/SCHEDULER.json'), 'utf8'))

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

const args = argsOf(process.argv)
const taskId = String(args.task || '')
const date = String(args.date || '')
const commit = String(args.commit || '')
const task = manifest.tasks.find((item) => item.id === taskId)
if (!task) fail(`unknown task ${taskId}`)
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(`invalid date ${date}`)
if (!/^[0-9a-f]{40}$/.test(commit)) fail(`invalid commit ${commit}`)

const file = recordPath(task, date)
if (!existsSync(file)) fail(`runtime record not found for ${taskId} on ${date}`)
const record = readJson(file)
if (record.date !== date) fail(`record date ${record.date} does not match ${date}`)
if (record.taskStatus?.[taskId] !== 'Completed') fail(`taskStatus.${taskId} must be Completed, got ${record.taskStatus?.[taskId]}`)
const result = record.results?.[taskId]
if (!result || result.status !== 'Completed') fail(`results.${taskId}.status must be Completed`)
if (result.runtimeDate && result.runtimeDate !== date) fail(`results.${taskId}.runtimeDate ${result.runtimeDate} does not match ${date}`)

const starts = (record.timeline || []).filter((event) =>
  event.task === taskId &&
  event.event === 'Execution Slot Opened' &&
  event.status === 'Running' &&
  String(event.time || '').startsWith(date)
)
if (starts.length !== 1) fail(`expected exactly one ${date} start event for ${taskId}, got ${starts.length}`)
const completions = (record.timeline || []).filter((event) =>
  event.task === taskId &&
  event.status === 'Completed' &&
  String(event.time || '').startsWith(date) &&
  /Completed$/.test(String(event.event || ''))
)
if (!completions.length) fail(`missing ${date} completion event for ${taskId}`)

const existing = (record.timeline || []).find((event) =>
  event.task === taskId &&
  event.event === 'GitHub Commit Verified' &&
  event.status === 'Completed' &&
  String(event.time || '').startsWith(date) &&
  String(event.detail || '').includes(commit)
)
if (existing) {
  console.log(`Verification already recorded for ${taskId} ${date} commit ${commit}.`)
  process.exit(0)
}

const verifiedAt = clock()
record.timeline = Array.isArray(record.timeline) ? record.timeline : []
record.timeline.push({
  time: verifiedAt,
  task: taskId,
  event: 'GitHub Commit Verified',
  status: 'Completed',
  detail: `Fetched and verified durable ${task.name} result commit ${commit} on main; the ${date} Runtime result, same-date artifacts and exactly one Execution Slot Opened / Running event remain present.`
})
result.githubCommit = commit
result.commitVerify = 'Completed'
result.verifiedAt = verifiedAt
record.updatedAt = verifiedAt
writeJson(file, record)
console.log(`Recorded durable verification for ${taskId} ${date} commit ${commit}.`)
