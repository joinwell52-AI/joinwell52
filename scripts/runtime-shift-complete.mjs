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

function fail(message) { throw new Error(`Runtime shift completion: ${message}`) }
function readJson(file) { return JSON.parse(readFileSync(file, 'utf8')) }
function writeJson(file, value) { writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`) }
function text(value) { return typeof value === 'string' ? value.trim() : '' }
function meaningful(value) {
  if (typeof value === 'string') return Boolean(text(value))
  if (value && typeof value === 'object' && !Array.isArray(value)) return Object.keys(value).length > 0
  return value !== undefined && value !== null
}
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
function validateResult(result, taskId) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) fail('result must be an object')
  if (result.schema !== manifest.resultContract) fail(`result schema must be ${manifest.resultContract}`)
  if (text(result.task) && result.task !== taskId) fail(`result task ${result.task} does not match ${taskId}`)
  if ((result.status || 'Completed') !== 'Completed') fail('this command currently accepts Completed results only')
  for (const field of ['input', 'workResult', 'output', 'next']) {
    if (!meaningful(result[field])) fail(`result missing ${field}`)
    if (typeof result[field] === 'string' && !text(result[`${field}_zh`])) fail(`flat result missing ${field}_zh`)
  }
  for (const field of ['metrics', 'evidence', 'artifacts']) {
    if (!Array.isArray(result[field])) fail(`result ${field} must be an array`)
  }
}
function aggregateStatus(record) {
  const statuses = Object.values(record.taskStatus || {})
  if (statuses.includes('Running')) return 'Running'
  if (statuses.includes('Failed')) return 'Failed'
  if (statuses.includes('Blocked')) return 'Blocked'
  if (statuses.every((status) => status === 'Completed' || status === 'Skipped')) return 'Completed'
  return 'Waiting'
}

const args = argsOf(process.argv)
const taskId = String(args.task || '')
const resultFile = String(args.result || '')
const now = clock()
const date = String(args.date || now.date)
const task = manifest.tasks.find((item) => item.id === taskId)
if (!task) fail(`unknown task ${taskId}`)
if (!resultFile) fail('--result <json-file> is required')
const absoluteResult = path.resolve(ROOT, resultFile)
if (!existsSync(absoluteResult)) fail(`result file not found: ${resultFile}`)
const file = recordPath(task, date)
if (!existsSync(file)) fail(`runtime record not found for ${taskId} on ${date}`)
const record = readJson(file)
if (record.taskStatus?.[taskId] !== 'Running') fail(`taskStatus.${taskId} must be Running, got ${record.taskStatus?.[taskId]}`)

const result = readJson(absoluteResult)
validateResult(result, taskId)
const opened = [...(record.timeline || [])].reverse().find((event) => event.task === taskId && event.event === 'Execution Slot Opened' && event.status === 'Running')
result.task = taskId
result.family = task.family
result.status = 'Completed'
if (!result.startedAt && opened?.time) result.startedAt = opened.time
result.completedAt = `${now.date}T${now.time}+08:00`
record.results = record.results || {}
record.results[taskId] = result
record.taskStatus[taskId] = 'Completed'
record.status = aggregateStatus(record)
record.timeline = Array.isArray(record.timeline) ? record.timeline : []
record.timeline.push({
  time: result.completedAt,
  task: taskId,
  event: 'Shift Completed',
  status: 'Completed',
  detail: `${task.name} completed through governed Runtime shift completion after durable result validation.`
})
record.updatedAt = result.completedAt
record.githubCommit = 'pending'
record.commitVerify = 'Waiting'
writeJson(file, record)
console.log(`Completed ${taskId} for ${date}; overall status ${record.status}; record ${path.relative(ROOT, file)}.`)
