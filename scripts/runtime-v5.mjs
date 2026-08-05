#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const MANIFEST_PATH = join(ROOT, 'research/runtime/SCHEDULER.json')
const GENERATED_PATH = join(ROOT, 'docs/.vitepress/generated/runtime-records.json')
const TERMINAL = new Set(['Completed', 'Blocked', 'Failed', 'Skipped'])

function die(message) {
  throw new Error(`Runtime V5: ${message}`)
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    die(`${relative(ROOT, path)} is invalid JSON: ${error.message}`)
  }
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

function argsOf(argv) {
  const args = { _: [] }
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) {
      args._.push(token)
      continue
    }
    const key = token.slice(2)
    const next = argv[index + 1]
    if (!next || next.startsWith('--')) args[key] = true
    else {
      args[key] = next
      index += 1
    }
  }
  return args
}

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

function slash(path) {
  return relative(ROOT, path).split(sep).join('/')
}

function clock(timezone, value = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'long',
    hourCycle: 'h23'
  }).formatToParts(value).map((part) => [part.type, part.value]))

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
    weekday: parts.weekday
  }
}

function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function familyById(manifest, familyId) {
  const family = manifest.runtimeFamilies.find((item) => item.id === familyId)
  if (!family) die(`unknown runtime family ${familyId}`)
  return family
}

function taskById(manifest, taskId) {
  const task = manifest.tasks.find((item) => item.id === taskId)
  if (!task) die(`unknown Runtime task ${taskId}`)
  return task
}

function recordPath(manifest, familyId, date) {
  const root = manifest.recordRoots[familyId]
  if (!root) die(`missing record root for ${familyId}`)
  const [year, month] = date.split('-')
  return join(ROOT, root, year, month, `${date}-${familyId}-runtime.json`)
}

function defaultRecord(manifest, familyId, date) {
  const family = familyById(manifest, familyId)
  return {
    schema: manifest.recordContracts[familyId],
    runtimeVersion: manifest.centerVersion,
    schedulerVersion: manifest.version,
    runtimeFamily: familyId,
    runtimeFamilyName: family.name,
    runtimeFamilyName_zh: family.name_zh,
    date,
    timezone: manifest.timezone,
    repository: manifest.repository,
    status: 'Waiting',
    taskStatus: Object.fromEntries(family.taskIds.map((id) => [id, 'Waiting'])),
    results: {},
    timeline: [],
    metrics: [],
    evidence: [],
    artifacts: [],
    githubCommit: 'pending',
    commitVerify: 'Waiting',
    updatedAt: ''
  }
}

function validateManifest(manifest) {
  if (manifest.schema !== 'research-runtime-scheduler/v3') die('scheduler schema must be research-runtime-scheduler/v3')
  if (manifest.version !== '3.0') die('scheduler version must be 3.0')
  if (manifest.centerVersion !== '5.0' || manifest.operationsCenterVersion !== '5.0') {
    die('centerVersion and operationsCenterVersion must be 5.0')
  }
  if (manifest.architectureStatus !== 'frozen') die('V5 architectureStatus must be frozen')
  if (manifest.timezone !== 'Asia/Shanghai') die('timezone must be Asia/Shanghai')
  if (manifest.resultContract !== 'runtime-shift-result/v2') die('invalid result contract')

  const expectedFamilies = ['daily', 'weekly', 'academic', 'program']
  const familyIds = manifest.runtimeFamilies?.map((item) => item.id) || []
  if (JSON.stringify(familyIds) !== JSON.stringify(expectedFamilies)) {
    die(`runtime families must be ${expectedFamilies.join(', ')}`)
  }

  const expectedDaily = [
    ['discovery', '09:00'],
    ['queue', '10:00'],
    ['reading', '11:00'],
    ['analysis', '13:00'],
    ['production', '15:00'],
    ['publication', '20:00']
  ]
  const daily = familyById(manifest, 'daily')
  if (JSON.stringify(daily.taskIds) !== JSON.stringify(expectedDaily.map(([id]) => id))) {
    die('Daily Runtime must contain Discovery, Queue, Reading, Analysis, Production and Publication in order')
  }
  for (const [id, time] of expectedDaily) {
    const task = taskById(manifest, id)
    if (task.family !== 'daily' || task.schedule?.time !== time) die(`${id} must run at ${time}`)
  }

  if (manifest.tasks.length !== 9) die('Scheduler V3.0 must define exactly nine formal tasks')
  if (new Set(manifest.tasks.map((task) => task.id)).size !== manifest.tasks.length) die('task ids must be unique')
  if (manifest.columns?.length !== 3) die('exactly three Daily Research columns are required')
  if (manifest.programs?.length !== 5) die('exactly five formal Research Programs are required')

  for (const task of manifest.tasks) {
    familyById(manifest, task.family)
    for (const field of ['id', 'name', 'name_zh', 'input', 'work', 'output']) {
      if (!text(task[field])) die(`${task.id || 'task'} missing ${field}`)
    }
    if (!/^\d{2}:\d{2}$/.test(task.schedule?.time || '') || !text(task.schedule?.cron)) {
      die(`${task.id} has invalid schedule`)
    }
    if (!Array.isArray(task.skills) || !Array.isArray(task.prohibitions)) {
      die(`${task.id} must define skills and prohibitions arrays`)
    }
  }

  return manifest
}

function validateMetric(metric, where) {
  if (!metric || typeof metric !== 'object' || Array.isArray(metric)) die(`${where}: metric must be an object`)
  if (!text(metric.label) || !text(metric.label_zh) || !text(String(metric.value ?? ''))) {
    die(`${where}: metric requires label, label_zh and value`)
  }
}

function validateEvidence(item, where) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) die(`${where}: evidence must be an object`)
  if (!text(item.label) || !text(item.label_zh) || !text(item.source)) {
    die(`${where}: evidence requires label, label_zh and source`)
  }
}

function validateArtifact(item, where) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) die(`${where}: artifact must be an object`)
  if (!text(item.label) || !text(item.label_zh)) die(`${where}: artifact requires label and label_zh`)
  if (![item.path, item.url, item.commit].some((value) => text(value))) {
    die(`${where}: artifact requires path, url or commit`)
  }
}

function validateResult(result, where, taskIds, statuses) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) die(`${where}: result must be an object`)
  if (!taskIds.has(result.task)) die(`${where}: invalid task ${result.task}`)
  if (!statuses.has(result.status)) die(`${where}: invalid status ${result.status}`)

  const required = [
    'input', 'input_zh', 'workResult', 'workResult_zh',
    'output', 'output_zh', 'next', 'next_zh'
  ]
  for (const field of required) if (!text(result[field])) die(`${where}: missing ${field}`)
  if (result.status === 'Skipped' && (!text(result.reason) || !text(result.reason_zh))) {
    die(`${where}: Skipped result requires reason and reason_zh`)
  }
  for (const field of ['metrics', 'evidence', 'artifacts']) {
    if (!Array.isArray(result[field])) die(`${where}: ${field} must be an array`)
  }
  result.metrics.forEach((item, index) => validateMetric(item, `${where} metric ${index + 1}`))
  result.evidence.forEach((item, index) => validateEvidence(item, `${where} evidence ${index + 1}`))
  result.artifacts.forEach((item, index) => validateArtifact(item, `${where} artifact ${index + 1}`))
}

function validateRecord(manifest, record, path) {
  const family = familyById(manifest, record.runtimeFamily)
  if (record.schema !== manifest.recordContracts[family.id]) die(`${path}: invalid record schema`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.date || '')) die(`${path}: invalid date`)
  if (record.timezone !== manifest.timezone) die(`${path}: invalid timezone`)
  if (record.schedulerVersion !== manifest.version || record.runtimeVersion !== manifest.centerVersion) {
    die(`${path}: invalid Runtime or Scheduler version`)
  }

  const statuses = new Set(manifest.statuses)
  if (!statuses.has(record.status)) die(`${path}: invalid overall status ${record.status}`)
  const taskIds = new Set(family.taskIds)
  for (const taskId of family.taskIds) {
    const status = record.taskStatus?.[taskId]
    if (!statuses.has(status)) die(`${path}: invalid taskStatus.${taskId}`)
    const result = record.results?.[taskId]
    if (result) {
      validateResult(result, `${path} result ${taskId}`, taskIds, statuses)
      if (result.status !== status) die(`${path}: ${taskId} result status does not match taskStatus`)
    } else if (TERMINAL.has(status)) {
      die(`${path}: terminal task ${taskId} requires a complete shift result`)
    }
  }

  if (!Array.isArray(record.timeline) || !Array.isArray(record.metrics) || !Array.isArray(record.evidence) || !Array.isArray(record.artifacts)) {
    die(`${path}: timeline, metrics, evidence and artifacts must be arrays`)
  }
  return record
}

function loadRecords(manifest) {
  return Object.fromEntries(manifest.runtimeFamilies.map((family) => {
    const root = join(ROOT, manifest.recordRoots[family.id])
    const records = walk(root)
      .filter((path) => path.endsWith(`-${family.id}-runtime.json`))
      .sort()
      .map((path) => validateRecord(manifest, readJson(path), slash(path)))
    return [family.id, records]
  }))
}

function validate() {
  const manifest = validateManifest(readJson(MANIFEST_PATH))
  const records = loadRecords(manifest)
  const counts = Object.fromEntries(Object.entries(records).map(([key, items]) => [key, items.length]))
  console.log(`Runtime V5 validation passed: ${manifest.tasks.length} tasks; records ${JSON.stringify(counts)}.`)
  return { manifest, records }
}

function ensureRecord(manifest, familyId, date) {
  const path = recordPath(manifest, familyId, date)
  const record = existsSync(path) ? readJson(path) : defaultRecord(manifest, familyId, date)
  validateRecord(manifest, record, slash(path))
  return { path, record }
}

function appendScheduledEvent(record, task, now) {
  const currentStatus = record.taskStatus?.[task.id] || 'Waiting'
  if (TERMINAL.has(currentStatus) && record.results?.[task.id]) {
    return false
  }
  const duplicate = currentStatus === 'Running' && record.timeline.some((entry) =>
    entry.task === task.id &&
    entry.event === 'Execution Slot Opened' &&
    entry.status === 'Running' &&
    entry.time?.startsWith(now.date)
  )

  record.taskStatus[task.id] = 'Running'
  delete record.results[task.id]
  record.status = 'Running'
  record.githubCommit = 'pending'
  record.commitVerify = 'Waiting'

  if (!duplicate) {
    record.timeline.push({
      time: `${now.date}T${now.time}+08:00`,
      task: task.id,
      event: 'Execution Slot Opened',
      status: 'Running',
      detail: `${task.name} started by Research Runtime Scheduler V3.0.`
    })
  }
  record.updatedAt = `${now.date}T${now.time}+08:00`
  return true
}

function githubOutput(values) {
  const path = process.env.GITHUB_OUTPUT
  if (!path) return
  const lines = Object.entries(values).map(([key, value]) => `${key}=${String(value).replace(/\r?\n/g, ' ')}`)
  writeFileSync(path, `${lines.join('\n')}\n`, { flag: 'a' })
}

function schedule(args) {
  const manifest = validateManifest(readJson(MANIFEST_PATH))
  const now = clock(manifest.timezone)
  let tasks = []
  if (args.task) tasks = [taskById(manifest, args.task)]
  else if (args.cron) tasks = manifest.tasks.filter((task) => task.schedule.cron === args.cron)
  else die('schedule requires --task <id> or --cron <expression>')
  if (!tasks.length) die('no Runtime task matches the requested schedule')

  const paths = []
  for (const task of tasks) {
    const { path, record } = ensureRecord(manifest, task.family, now.date)
    const changed = appendScheduledEvent(record, task, now)
    if (changed) writeJson(path, record)
    else console.log(`${task.name} is already terminal for ${now.date}; delayed or duplicate scheduling cannot reopen it.`)
    paths.push(slash(path))
  }

  const taskIds = tasks.map((task) => task.id).join(',')
  const taskNames = tasks.map((task) => task.name).join(', ')
  const families = [...new Set(tasks.map((task) => task.family))].join(',')
  githubOutput({
    runtime_date: now.date,
    task_ids: taskIds,
    task_names: taskNames,
    runtime_family: families,
    record_paths: paths.join(',')
  })
  console.log(`Opened ${taskNames} for ${now.date}: ${paths.join(', ')}`)
}

function initialize(args) {
  const manifest = validateManifest(readJson(MANIFEST_PATH))
  const date = args.date
  const familyId = args.family
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) die('initialize requires --date YYYY-MM-DD')
  if (!familyId) die('initialize requires --family daily|weekly|academic|program')
  const { path, record } = ensureRecord(manifest, familyId, date)
  writeJson(path, record)
  console.log(`Initialized ${slash(path)}.`)
}

function build() {
  const { manifest, records } = validate()
  const now = clock(manifest.timezone)
  const sorted = Object.fromEntries(Object.entries(records).map(([familyId, items]) => [
    familyId,
    items.slice().sort((a, b) => b.date.localeCompare(a.date))
  ]))

  const payload = {
    schema: 'research-runtime-center-data/v5',
    generatedAt: new Date().toISOString(),
    today: now.date,
    timezone: manifest.timezone,
    schedulerVersion: manifest.version,
    centerVersion: manifest.centerVersion,
    operationsCenterVersion: manifest.operationsCenterVersion,
    architectureStatus: manifest.architectureStatus,
    statuses: manifest.statuses,
    columns: manifest.columns,
    programs: manifest.programs,
    runtimeFamilies: manifest.runtimeFamilies,
    schedule: manifest.tasks,
    todayDaily: sorted.daily.find((record) => record.date === now.date) || defaultRecord(manifest, 'daily', now.date),
    latest: Object.fromEntries(manifest.runtimeFamilies.map((family) => [family.id, sorted[family.id][0] || null])),
    records: sorted
  }
  writeJson(GENERATED_PATH, payload)
  console.log(`Generated ${slash(GENERATED_PATH)}.`)
}

function gate(args) {
  const base = args.base
  if (!base) die('gate requires --base <commit>')
  let output = ''
  try {
    output = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], { cwd: ROOT, encoding: 'utf8' })
  } catch (error) {
    die(`unable to inspect changed files: ${error.message}`)
  }
  const files = output.split(/\r?\n/).filter(Boolean)
  const publicationChange = files.some((path) =>
    /^docs\/(en|zh)\/(research|weekly|academic)\//.test(path) ||
    /^research\/(publications|weekly|academic)\//.test(path)
  )
  if (!publicationChange) {
    console.log('Runtime V5 gate passed: no formal research publication changed.')
    return
  }
  const recordChange = files.some((path) => /^research\/runtime\/records\/(daily|weekly|academic|program)\//.test(path))
  if (!recordChange) die('formal research publication changed without a V5 Runtime Record')
  console.log('Runtime V5 gate passed: publication change includes a V5 Runtime Record.')
}

const args = argsOf(process.argv.slice(2))
const command = args._[0] || 'build'

try {
  if (command === 'validate') validate()
  else if (command === 'build') build()
  else if (command === 'schedule') schedule(args)
  else if (command === 'initialize') initialize(args)
  else if (command === 'gate') gate(args)
  else die(`unknown command ${command}`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
