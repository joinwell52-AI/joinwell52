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
function fail(message) { throw new Error(`Runtime worker claim: ${message}`) }
function readJson(file) { return JSON.parse(readFileSync(file, 'utf8')) }
function writeJson(file, value) { writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`) }
function clock() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: manifest.timezone,
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date()).map((part) => [part.type, part.value]))
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}:${parts.second}` }
}
function recordPath(task, date) {
  const [year, month] = date.split('-')
  return path.join(ROOT, manifest.recordRoots[task.family], year, month, `${date}-${task.family}-runtime.json`)
}

const args = argsOf(process.argv)
const taskId = String(args.task || '')
const date = String(args.date || '')
const receipt = String(args.receipt || '')
const worker = String(args.worker || 'chatgpt-automation')
const allowedWorkers = new Set(['chatgpt-automation', 'github-deferred-publication-continuation'])
const task = manifest.tasks.find((item) => item.id === taskId)
if (!task) fail(`unknown task ${taskId}`)
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(`invalid date ${date}`)
if (!allowedWorkers.has(worker)) fail(`invalid worker ${worker}`)
if (worker === 'github-deferred-publication-continuation' && taskId !== 'publication') {
  fail('GitHub deferred continuation is restricted to the mechanical Publication stage')
}
if (worker === 'github-deferred-publication-continuation' && !receipt) {
  fail('GitHub deferred Publication continuation requires the original formal Wake Receipt')
}
const now = clock()
if (date !== now.date) fail(`claim date ${date} is not active Shanghai date ${now.date}`)
if (receipt && !/^research\/runtime\/wakes\/.+\.json$/.test(receipt)) fail(`invalid wake receipt path ${receipt}`)
if (receipt && !existsSync(path.join(ROOT, receipt))) fail(`wake receipt does not exist: ${receipt}`)

const file = recordPath(task, date)
if (!existsSync(file)) fail(`runtime record not found for ${taskId} on ${date}`)
const record = readJson(file)
if (record.taskStatus?.[taskId] !== 'Running') fail(`taskStatus.${taskId} must be Running, got ${record.taskStatus?.[taskId]}`)
record.timeline = Array.isArray(record.timeline) ? record.timeline : []
let latestStart = -1
for (let i = record.timeline.length - 1; i >= 0; i -= 1) {
  const event = record.timeline[i]
  if (event.task === taskId && event.event === 'Execution Slot Opened' && event.status === 'Running' && String(event.time || '').startsWith(date)) {
    latestStart = i
    break
  }
}
if (latestStart < 0) fail(`missing current-day Execution Slot Opened for ${taskId}`)
const existingClaim = record.timeline.slice(latestStart + 1).find((event) =>
  event.task === taskId &&
  event.event === 'Worker Claimed' &&
  event.status === 'Running' &&
  String(event.time || '').startsWith(date) &&
  (!receipt || String(event.detail || '').includes(receipt))
)
if (existingClaim) {
  console.log(`Worker claim already present for latest ${taskId} execution epoch at ${existingClaim.time}${receipt ? ` bound to ${receipt}` : ''}.`)
  process.exit(0)
}
const claimedAt = `${now.date}T${now.time}+08:00`
const detail = worker === 'github-deferred-publication-continuation'
  ? `GitHub deferred Publication continuation worker claimed ${task.name} after verifying the original formal Wake Receipt ${receipt}, Production=Completed, and current execution authority on main. This worker is restricted to mechanical Publication release work and may not perform research, substantive rewriting or evidence repair.`
  : receipt
    ? `ChatGPT Automation claimed ${task.name} after verifying ${receipt} and the current execution authority on main.`
    : `ChatGPT Automation claimed ${task.name} after verifying the current execution authority on main.`
record.timeline.push({
  time: claimedAt,
  task: taskId,
  event: 'Worker Claimed',
  status: 'Running',
  detail
})
record.updatedAt = claimedAt
record.githubCommit = 'pending'
record.commitVerify = 'Waiting'
writeJson(file, record)
console.log(`Recorded Worker Claimed for ${taskId} ${date} at ${claimedAt}${receipt ? ` bound to ${receipt}` : ''} by ${worker}.`)
