#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const MANIFEST_PATH = join(ROOT, 'research/runtime/SCHEDULER.json')
const RECORD_ROOT = join(ROOT, 'research/runtime')
const GENERATED_PATH = join(ROOT, 'docs/.vitepress/generated/runtime-records.json')
const CONTRACT = 'runtime-task-result/v1'
const TERMINAL = new Set(['Completed', 'Skipped', 'Blocked', 'Failed'])
const STATUSES = new Set(['Running', 'Completed', 'Blocked', 'Failed', 'Skipped', 'Waiting'])

function die(message) {
  throw new Error(`Runtime Results: ${message}`)
}

function readJson(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')) }
  catch (error) { die(`${relative(ROOT, path)} is invalid JSON: ${error.message}`) }
}

function decode(value) {
  const text = value.trim()
  if (!text) return ''
  if (text.startsWith('"') && text.endsWith('"')) {
    try { return JSON.parse(text) } catch { return text.slice(1, -1) }
  }
  if (text.startsWith("'") && text.endsWith("'")) return text.slice(1, -1).replace(/''/g, "'")
  return text
}

function parseRecord(content, path) {
  const normalized = content.replace(/\r\n/g, '\n')
  if (!normalized.startsWith('---\n')) die(`${path} must start with YAML frontmatter`)
  const end = normalized.indexOf('\n---\n', 4)
  if (end < 0) die(`${path} has unterminated frontmatter`)
  const data = {}
  for (const line of normalized.slice(4, end).split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue
    const match = /^([a-z0-9_]+):\s*(.*)$/i.exec(line)
    if (!match) continue
    data[match[1]] = decode(match[2])
  }
  return { data, body: normalized.slice(end + 5) }
}

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

function recordFiles() {
  return walk(RECORD_ROOT)
    .filter((path) => /\d{4}-\d{2}-\d{2}-runtime\.md$/.test(path))
    .sort()
}

function weekday(date, timezone) {
  const value = new Date(`${date}T04:00:00.000Z`)
  return new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'long' }).format(value)
}

function tasksFor(date, manifest) {
  const day = weekday(date, manifest.timezone)
  return manifest.tasks.filter((task) => task.schedule.kind === 'daily' || (task.schedule.days || []).includes(day))
}

function textField(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function validateMetric(metric, where) {
  if (!metric || typeof metric !== 'object' || Array.isArray(metric)) die(`${where}: every metric must be an object`)
  if (!textField(metric.label) || !textField(metric.label_zh) || !textField(String(metric.value ?? ''))) {
    die(`${where}: metrics require label, label_zh and value`)
  }
}

function validateArtifact(artifact, where) {
  if (!artifact || typeof artifact !== 'object' || Array.isArray(artifact)) die(`${where}: every artifact must be an object`)
  if (!textField(artifact.label) || !textField(artifact.label_zh)) die(`${where}: artifacts require label and label_zh`)
  if (![artifact.path, artifact.commit, artifact.url].some((value) => textField(value))) {
    die(`${where}: every artifact requires path, commit or url`)
  }
}

function validateResult(result, where, taskIds) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) die(`${where}: result block must be a JSON object`)
  if (!taskIds.has(result.task)) die(`${where}: unknown task ${result.task}`)
  if (!STATUSES.has(result.status)) die(`${where}: invalid status ${result.status}`)

  const required = ['input', 'input_zh', 'summary', 'summary_zh', 'output', 'output_zh', 'next', 'next_zh']
  for (const key of required) if (!textField(result[key])) die(`${where}: missing ${key}`)
  if (result.status === 'Skipped' && (!textField(result.reason) || !textField(result.reason_zh))) {
    die(`${where}: a skipped result requires reason and reason_zh`)
  }

  if (!Array.isArray(result.metrics)) die(`${where}: metrics must be an array`)
  if (!Array.isArray(result.artifacts)) die(`${where}: artifacts must be an array`)
  result.metrics.forEach((metric, index) => validateMetric(metric, `${where} metric ${index + 1}`))
  result.artifacts.forEach((artifact, index) => validateArtifact(artifact, `${where} artifact ${index + 1}`))
}

function taskResults(body, path, taskIds) {
  const results = {}
  const pattern = /```runtime-result\s*\n([\s\S]*?)\n```/g
  let match
  while ((match = pattern.exec(body))) {
    let result
    try { result = JSON.parse(match[1]) }
    catch (error) { die(`${path}: invalid runtime-result JSON: ${error.message}`) }
    validateResult(result, `${path} task result`, taskIds)
    if (results[result.task]) die(`${path}: duplicate result for ${result.task}`)
    results[result.task] = result
  }
  return results
}

function validateRecord(record, manifest, taskIds) {
  const path = relative(ROOT, record.path).split(sep).join('/')
  const results = taskResults(record.body, path, taskIds)
  if (record.data.result_contract !== CONTRACT) return results

  for (const task of tasksFor(record.data.date, manifest)) {
    const status = record.data[`task_${task.id}`]
    if (!STATUSES.has(status)) die(`${path}: invalid task_${task.id}=${status}`)
    if (TERMINAL.has(status) && !results[task.id]) die(`${path}: terminal task ${task.id} requires a runtime-result block`)
    if (results[task.id] && results[task.id].status !== status) {
      die(`${path}: ${task.id} result status ${results[task.id].status} does not match frontmatter ${status}`)
    }
  }

  return results
}

function loadRecords(manifest) {
  const taskIds = new Set(manifest.tasks.map((task) => task.id))
  return recordFiles().map((path) => {
    const record = { path, ...parseRecord(readFileSync(path, 'utf8'), relative(ROOT, path)) }
    return { record, results: validateRecord(record, manifest, taskIds) }
  })
}

function validate() {
  const manifest = readJson(MANIFEST_PATH)
  if (manifest.resultContract !== CONTRACT) die(`SCHEDULER.json resultContract must be ${CONTRACT}`)
  if (manifest.operationsCenterVersion !== '3.0') die('SCHEDULER.json operationsCenterVersion must be 3.0')
  const list = loadRecords(manifest)
  console.log(`Runtime task result validation passed: ${list.length} record(s).`)
  return { manifest, list }
}

function build() {
  const { manifest, list } = validate()
  if (!existsSync(GENERATED_PATH)) die('runtime-records.json is missing; run runtime-center.mjs build first')
  const generated = readJson(GENERATED_PATH)
  const resultByPath = new Map(list.map(({ record, results }) => [relative(ROOT, record.path).split(sep).join('/'), results]))

  generated.operationsCenterVersion = manifest.operationsCenterVersion
  generated.resultContract = manifest.resultContract
  generated.records = (generated.records || []).map((record) => ({
    ...record,
    results: resultByPath.get(record.path) || {}
  }))
  generated.latest = generated.records[0] || null

  writeFileSync(GENERATED_PATH, `${JSON.stringify(generated, null, 2)}\n`)
  console.log(`Injected task results into ${relative(ROOT, GENERATED_PATH)}.`)
}

const command = process.argv[2] || 'build'
try {
  if (command === 'validate') validate()
  else if (command === 'build') build()
  else die(`unknown command ${command}`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
