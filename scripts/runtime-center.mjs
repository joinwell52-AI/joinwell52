#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const MANIFEST_PATH = join(ROOT, 'research/runtime/SCHEDULER.json')
const GENERATED_PATH = join(ROOT, 'docs/.vitepress/generated/runtime-records.json')

function die(message) {
  throw new Error(`Runtime Center: ${message}`)
}

function readJson(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')) }
  catch (error) { die(`${relative(ROOT, path)} is invalid JSON: ${error.message}`) }
}

const manifest = readJson(MANIFEST_PATH)
const TASK_IDS = manifest.tasks.map((task) => task.id)
const statuses = new Set(manifest.statuses || [])
const BASE_REQUIRED = [
  'schema', 'runtime_version', 'center_version', 'date', 'timezone', 'overall_status',
  'latest_task', 'start_time', 'github_repository', 'github_commit', 'github_status',
  'commit_verify', 'publication_status', 'queue_status', 'engine_status', 'lifecycle', 'output'
]
const ORDER = [
  'schema', 'runtime_version', 'center_version', 'result_contract', 'plan_contract', 'plan_path',
  'candidate_contract', 'candidate_path', 'date', 'timezone', 'overall_status',
  'latest_task', 'start_time', 'end_time', 'duration', 'github_repository', 'github_commit',
  'github_status', 'commit_verify', 'publication_status', 'queue_status', 'engine_status',
  'lifecycle', 'output', ...TASK_IDS.map((id) => `task_${id}`)
]

function argsOf(argv) {
  const result = { _: [] }
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) { result._.push(token); continue }
    const key = token.slice(2)
    const value = argv[index + 1]
    if (!value || value.startsWith('--')) result[key] = true
    else { result[key] = value; index += 1 }
  }
  return result
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
    if (!match) die(`${path} has unsupported frontmatter: ${line}`)
    data[match[1]] = decode(match[2])
  }
  return { data, body: normalized.slice(end + 5) }
}

function serialize({ data, body }) {
  const seen = new Set()
  const lines = []
  for (const key of ORDER) {
    if (!(key in data)) continue
    lines.push(`${key}: ${JSON.stringify(String(data[key] ?? ''))}`)
    seen.add(key)
  }
  for (const key of Object.keys(data).sort()) {
    if (!seen.has(key)) lines.push(`${key}: ${JSON.stringify(String(data[key] ?? ''))}`)
  }
  return `---\n${lines.join('\n')}\n---\n\n${body.trim()}\n`
}

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

function records() {
  return walk(join(ROOT, 'research/runtime'))
    .filter((path) => /\d{4}-\d{2}-\d{2}-runtime\.md$/.test(path))
    .sort()
    .map((path) => ({ path, ...parseRecord(readFileSync(path, 'utf8'), relative(ROOT, path)) }))
}

function logRows(body) {
  const start = body.indexOf('## Runtime Log')
  if (start < 0) return []
  return body.slice(start).split(/\r?\n/).flatMap((line) => {
    if (!line.trim().startsWith('|')) return []
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim())
    if (cells.length !== 5 || cells[0] === 'Time' || /^-+$/.test(cells[0])) return []
    return [{ time: cells[0], runtime: cells[1], event: cells[2], status: cells[3], detail: cells[4] }]
  })
}

function appendLog(body, row) {
  if (!body.includes('## Runtime Log')) {
    body = `${body.trim()}\n\n## Runtime Log\n\n| Time | Runtime | Event | Status | Detail |\n|---|---|---|---|---|`
  }
  const clean = (value) => String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')
  return `${body.trimEnd()}\n| ${clean(row.time)} | ${clean(row.runtime)} | ${clean(row.event)} | ${clean(row.status)} | ${clean(row.detail)} |\n`
}

function clock(date = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: manifest.timezone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'long', hourCycle: 'h23'
  }).formatToParts(date).map((part) => [part.type, part.value]))
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
    second: `${parts.hour}:${parts.minute}:${parts.second}`,
    weekday: parts.weekday
  }
}

function weekday(date) {
  return clock(new Date(`${date}T04:00:00.000Z`)).weekday
}

function introduced(task, date) {
  return !task.introduced || task.introduced <= date
}

function runs(task, date) {
  if (!introduced(task, date)) return false
  return task.schedule.kind === 'daily' || (task.schedule.days || []).includes(weekday(date))
}

function tasksFor(date) {
  return manifest.tasks.filter((task) => runs(task, date))
}

function taskFieldsFor(date) {
  return manifest.tasks.filter((task) => introduced(task, date))
}

function recordPath(date) {
  const [year, month] = date.split('-')
  return join(ROOT, `research/runtime/${year}/${month}/${date}-runtime.md`)
}

function planPath(date) {
  const [year, month] = date.split('-')
  return `research/runtime/plans/${year}/${month}/${date}-plan.json`
}

function candidatePath(date) {
  const [year, month] = date.split('-')
  return `research/runtime/candidates/${year}/${month}/${date}-candidates.json`
}

function exactStatusList() {
  return ['Running', 'Completed', 'Blocked', 'Failed', 'Skipped', 'Waiting']
}

function validateManifest(errors) {
  if (manifest.schema !== 'research-runtime-scheduler/v2') errors.push('invalid scheduler schema')
  if (manifest.version !== '2.0') errors.push('scheduler version must be 2.0')
  if (manifest.centerVersion !== '3.0') errors.push('center version must be 3.0')
  if (manifest.operationsCenterVersion !== '4.0') errors.push('operations center version must be 4.0')
  if (manifest.timezone !== 'Asia/Shanghai') errors.push('timezone must be Asia/Shanghai')
  if (JSON.stringify(manifest.statuses) !== JSON.stringify(exactStatusList())) {
    errors.push('statuses must be the exact six Runtime statuses')
  }
  if (!Array.isArray(manifest.columns) || manifest.columns.length !== 3) {
    errors.push('scheduler must define exactly three research columns')
  }
  const expectedColumns = ['digital-employee', 'industry-architecture', 'open-source-engineering']
  if (JSON.stringify((manifest.columns || []).map((column) => column.id)) !== JSON.stringify(expectedColumns)) {
    errors.push('research columns must be digital-employee, industry-architecture and open-source-engineering')
  }
  if (!Array.isArray(manifest.tasks) || manifest.tasks.length !== 8) {
    errors.push('scheduler must contain exactly eight Runtime tasks')
  }
  if (new Set(TASK_IDS).size !== TASK_IDS.length) errors.push('task ids must be unique')
  const production = manifest.tasks.find((task) => task.id === 'production')
  if (!production || production.schedule?.time !== '15:00' || production.schedule?.cron !== '0 7 * * *') {
    errors.push('production task must run daily at 15:00 Asia/Shanghai')
  }
  for (const task of manifest.tasks || []) {
    if (!task.name?.startsWith('Research Runtime ')) errors.push(`invalid task name ${task.name}`)
    if (!/^\d{2}:\d{2}$/.test(task.schedule?.time || '') || !task.schedule?.cron) {
      errors.push(`invalid schedule for ${task.id}`)
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(task.introduced || '')) errors.push(`invalid introduced date for ${task.id}`)
  }
}

function validate() {
  const errors = []
  validateManifest(errors)
  const list = records()
  if (!list.length) errors.push('at least one Runtime Record is required')

  for (const record of list) {
    const path = relative(ROOT, record.path).split(sep).join('/')
    for (const key of BASE_REQUIRED) if (!(key in record.data)) errors.push(`${path}: missing ${key}`)
    if (record.data.schema !== 'research-runtime-record/v1') errors.push(`${path}: invalid schema`)
    if (!['1.0', '2.0'].includes(record.data.runtime_version)) {
      errors.push(`${path}: unsupported runtime_version=${record.data.runtime_version}`)
    }
    if (!path.endsWith(`${record.data.date}-runtime.md`)) errors.push(`${path}: date and filename differ`)

    const statusKeys = [
      'overall_status', 'github_status', 'commit_verify', 'publication_status',
      'queue_status', 'engine_status'
    ]
    for (const task of taskFieldsFor(record.data.date)) {
      const key = `task_${task.id}`
      if (!(key in record.data)) errors.push(`${path}: missing ${key}`)
      else statusKeys.push(key)
    }
    for (const key of statusKeys) {
      if (!statuses.has(record.data[key])) errors.push(`${path}: invalid ${key}=${record.data[key]}`)
    }

    if (record.data.runtime_version === '2.0') {
      const expected = {
        result_contract: manifest.resultContract,
        plan_contract: manifest.columnPlanContract,
        plan_path: planPath(record.data.date),
        candidate_contract: manifest.publicationCandidateContract,
        candidate_path: candidatePath(record.data.date)
      }
      for (const [key, value] of Object.entries(expected)) {
        if (record.data[key] !== value) errors.push(`${path}: invalid ${key}=${record.data[key]}`)
      }
    }

    if (!record.body.includes('## Runtime Log')) errors.push(`${path}: missing Runtime Log`)
    for (const row of logRows(record.body)) {
      if (!statuses.has(row.status)) errors.push(`${path}: invalid log status ${row.status}`)
    }
  }

  if (errors.length) die(`validation failed\n- ${errors.join('\n- ')}`)
  console.log(`Runtime validation passed: ${manifest.tasks.length} tasks, ${manifest.columns.length} columns, ${list.length} record(s).`)
  return list
}

function publicRecord(record) {
  const d = record.data
  return {
    path: relative(ROOT, record.path).split(sep).join('/'),
    date: d.date,
    runtimeVersion: d.runtime_version,
    status: d.overall_status,
    latestTask: d.latest_task,
    startTime: d.start_time,
    endTime: d.end_time,
    duration: d.duration,
    repository: d.github_repository,
    commit: d.github_commit,
    githubStatus: d.github_status,
    commitVerify: d.commit_verify,
    publicationStatus: d.publication_status,
    queueStatus: d.queue_status,
    engineStatus: d.engine_status,
    lifecycle: d.lifecycle,
    output: d.output,
    planPath: d.plan_path || '',
    candidatePath: d.candidate_path || '',
    tasks: Object.fromEntries(TASK_IDS.map((id) => {
      const task = manifest.tasks.find((item) => item.id === id)
      if (task && !introduced(task, d.date)) return [id, 'Skipped']
      return [id, d[`task_${id}`] || 'Waiting']
    })),
    log: logRows(record.body)
  }
}

function build() {
  const list = validate().map(publicRecord).sort((a, b) => b.date.localeCompare(a.date))
  const now = clock()
  const payload = {
    schema: 'research-runtime-center-data/v2',
    generatedAt: new Date().toISOString(),
    today: now.date,
    timezone: manifest.timezone,
    schedulerVersion: manifest.version,
    centerVersion: manifest.centerVersion,
    operationsCenterVersion: manifest.operationsCenterVersion,
    statuses: manifest.statuses,
    columns: manifest.columns,
    schedule: manifest.tasks.map((task) => ({
      id: task.id,
      name: task.name,
      introduced: task.introduced,
      time: task.schedule.time,
      kind: task.schedule.kind,
      days: task.schedule.days || [],
      cron: task.schedule.cron,
      responsibility: task.responsibility,
      output: task.output,
      prohibitions: task.prohibitions || [],
      skillsRequired: Boolean(task.skillsRequired),
      skills: task.skills || []
    })),
    todayTasks: tasksFor(now.date).map((task) => task.id),
    latest: list[0] || null,
    records: list
  }
  mkdirSync(dirname(GENERATED_PATH), { recursive: true })
  writeFileSync(GENERATED_PATH, `${JSON.stringify(payload, null, 2)}\n`)
  console.log(`Generated ${relative(ROOT, GENERATED_PATH)}.`)
}

function upgradeRecord(record, date) {
  record.data.runtime_version = manifest.version
  record.data.center_version = manifest.centerVersion
  record.data.result_contract = manifest.resultContract
  record.data.plan_contract = manifest.columnPlanContract
  record.data.plan_path = planPath(date)
  record.data.candidate_contract = manifest.publicationCandidateContract
  record.data.candidate_path = candidatePath(date)

  const active = new Set(tasksFor(date).map((task) => task.id))
  for (const task of taskFieldsFor(date)) {
    const key = `task_${task.id}`
    if (!(key in record.data)) record.data[key] = active.has(task.id) ? 'Waiting' : 'Skipped'
  }
}

function freshRecord(date, now) {
  const active = new Set(tasksFor(date).map((task) => task.id))
  const data = {
    schema: 'research-runtime-record/v1',
    runtime_version: manifest.version,
    center_version: manifest.centerVersion,
    result_contract: manifest.resultContract,
    plan_contract: manifest.columnPlanContract,
    plan_path: planPath(date),
    candidate_contract: manifest.publicationCandidateContract,
    candidate_path: candidatePath(date),
    date,
    timezone: manifest.timezone,
    overall_status: 'Waiting',
    latest_task: 'Research Runtime Scheduler',
    start_time: now.time,
    end_time: '',
    duration: '',
    github_repository: manifest.repository,
    github_commit: 'pending',
    github_status: 'Waiting',
    commit_verify: 'Waiting',
    publication_status: active.has('publication') || active.has('weekly') || active.has('academic') ? 'Waiting' : 'Skipped',
    queue_status: active.has('queue') ? 'Waiting' : 'Skipped',
    engine_status: active.has('engine') ? 'Waiting' : 'Skipped',
    lifecycle: 'Signal → Candidate → Queue → Selected → Reading → Analysis → Publication Candidate → Publication → Release',
    output: 'Runtime execution slots created; Digital Research Employee worker pending.'
  }
  for (const task of taskFieldsFor(date)) data[`task_${task.id}`] = active.has(task.id) ? 'Waiting' : 'Skipped'
  return {
    data,
    body: `# Research Runtime Record — ${date}\n\n## Runtime Summary\n\nGenerated by Research Runtime Scheduler V2.0.\n\n## Runtime Task Results\n\n## Runtime Log\n\n| Time | Runtime | Event | Status | Detail |\n|---|---|---|---|---|`
  }
}

function githubOutput(values) {
  if (!process.env.GITHUB_OUTPUT) return
  writeFileSync(
    process.env.GITHUB_OUTPUT,
    Object.entries(values)
      .map(([key, value]) => `${key}=${String(value).replace(/\r?\n/g, ' ')}`)
      .join('\n') + '\n',
    { flag: 'a' }
  )
}

function schedule(args) {
  const now = clock()
  const date = args.date || now.date
  let selected
  if (args.task) selected = manifest.tasks.filter((task) => task.id === args.task || task.name === args.task)
  else if (args.cron) selected = manifest.tasks.filter((task) => task.schedule.cron === args.cron && runs(task, date))
  else selected = manifest.tasks.filter((task) => task.schedule.time === now.time && runs(task, date))
  if (!selected.length) die('no Runtime task matches this trigger')

  const path = recordPath(date)
  mkdirSync(dirname(path), { recursive: true })
  const record = existsSync(path)
    ? parseRecord(readFileSync(path, 'utf8'), relative(ROOT, path))
    : freshRecord(date, now)
  upgradeRecord(record, date)

  for (const task of selected) {
    if (!runs(task, date)) continue
    const key = `task_${task.id}`
    const previous = record.data[key]
    if (!['Completed', 'Running'].includes(previous)) record.data[key] = 'Waiting'
    record.data.latest_task = task.name
    record.data.overall_status = record.data.overall_status === 'Failed' ? 'Failed' : 'Waiting'
    record.data.output = `${task.name} execution slot created; Digital Research Employee worker pending.`
    if (task.id === 'queue') record.data.queue_status = record.data[key]
    if (task.id === 'engine') record.data.engine_status = record.data[key]
    if (['publication', 'weekly', 'academic'].includes(task.id)) record.data.publication_status = record.data[key]
    record.body = appendLog(record.body, {
      time: now.time,
      runtime: task.name,
      event: previous === 'Completed' ? 'Schedule Observed' : 'Runtime Scheduled',
      status: previous === 'Completed' ? 'Completed' : 'Waiting',
      detail: `Scheduled ${task.schedule.time} ${manifest.timezone}; GitHub run ${process.env.GITHUB_RUN_ID || 'manual'}.`
    })
  }

  writeFileSync(path, serialize(record))
  validate()
  const names = selected.map((task) => task.name).join(' + ')
  githubOutput({
    task_names: names,
    runtime_date: date,
    record_path: relative(ROOT, path).split(sep).join('/'),
    plan_path: planPath(date),
    candidate_path: candidatePath(date)
  })
  console.log(`Scheduled ${names}.`)
}

function duration(start, end) {
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(start || '') || !/^\d{2}:\d{2}(:\d{2})?$/.test(end || '')) return ''
  const seconds = (value) => {
    const [h, m, s = 0] = value.split(':').map(Number)
    return h * 3600 + m * 60 + s
  }
  let delta = seconds(end) - seconds(start)
  if (delta < 0) delta += 86400
  return [Math.floor(delta / 3600), Math.floor((delta % 3600) / 60), delta % 60]
    .map((n) => String(n).padStart(2, '0'))
    .join(':')
}

function overallStatus(statusList) {
  if (statusList.includes('Failed')) return 'Failed'
  if (statusList.includes('Blocked')) return 'Blocked'
  if (statusList.includes('Running')) return 'Running'
  if (statusList.includes('Waiting')) return 'Waiting'
  if (statusList.length && statusList.every((status) => status === 'Completed')) return 'Completed'
  if (statusList.some((status) => status === 'Skipped')) return 'Skipped'
  return 'Waiting'
}

function update(args) {
  const now = clock()
  const date = args.date || now.date
  const task = manifest.tasks.find((item) => item.id === args.task || item.name === args.task)
  if (!task || !statuses.has(args.status)) die('update requires a valid --task and --status')
  const path = recordPath(date)
  if (!existsSync(path)) die(`missing Runtime Record for ${date}`)

  const record = parseRecord(readFileSync(path, 'utf8'), relative(ROOT, path))
  upgradeRecord(record, date)
  const status = args.status
  record.data[`task_${task.id}`] = status
  record.data.latest_task = task.name
  if (args.commit) record.data.github_commit = args.commit
  if (args['github-status']) record.data.github_status = args['github-status']
  if (args['commit-verify']) record.data.commit_verify = args['commit-verify']
  if (args.output) record.data.output = args.output
  if (task.id === 'queue') record.data.queue_status = status
  if (task.id === 'engine') record.data.engine_status = status
  if (['publication', 'weekly', 'academic'].includes(task.id)) record.data.publication_status = status
  if (['Completed', 'Blocked', 'Failed', 'Skipped'].includes(status)) {
    record.data.end_time = args['end-time'] || now.time
    record.data.duration = duration(record.data.start_time, record.data.end_time)
  }

  const active = tasksFor(date).map((item) => record.data[`task_${item.id}`])
  record.data.overall_status = overallStatus(active)
  record.body = appendLog(record.body, {
    time: args.time || now.time,
    runtime: task.name,
    event: args.event || `Runtime ${status}`,
    status,
    detail: args.detail || args.output || 'Runtime Record updated.'
  })
  writeFileSync(path, serialize(record))
  validate()
  console.log(`Updated ${task.name} to ${status}.`)
}

function gate(args) {
  const base = args.base || process.env.RUNTIME_BASE_SHA
  if (!base) {
    console.log('Runtime publication gate skipped: no base SHA.')
    return
  }
  let changed
  try {
    changed = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], {
      cwd: ROOT,
      encoding: 'utf8'
    }).trim().split(/\r?\n/).filter(Boolean)
  } catch (error) {
    die(`cannot inspect publication diff: ${error.message}`)
  }

  const publication = changed.filter((path) =>
    /^docs\/(en|zh)\/(digital-employee|industry|engineering|research|publications)\/.+\.md$/.test(path) ||
    /^docs\/public\/assets\/covers\/.+\.(svg|png|jpg|jpeg|webp)$/.test(path) ||
    /^research\/releases\//.test(path)
  )
  if (!publication.length) {
    console.log('Runtime publication gate passed: no formal publication change.')
    return
  }
  const record = changed.some((path) => /^research\/runtime\/\d{4}\/\d{2}\/\d{4}-\d{2}-\d{2}-runtime\.md$/.test(path))
  if (!record) die(`formal publication requires a Runtime Record: ${publication.join(', ')}`)
  console.log(`Runtime publication gate passed: ${publication.length} publication path(s).`)
}

const args = argsOf(process.argv.slice(2))
const command = args._[0] || 'build'
try {
  if (command === 'validate') validate()
  else if (command === 'build') build()
  else if (command === 'schedule') schedule(args)
  else if (command === 'update') update(args)
  else if (command === 'gate') gate(args)
  else die(`unknown command ${command}`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
