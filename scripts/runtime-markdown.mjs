#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SCHEDULER = join(ROOT, 'research/runtime/SCHEDULER.json')
const READABLE_ROOT = join(ROOT, 'research/runtime')
const V5_START = '2026-08-05'
const MARKER = '<!-- generated-by: scripts/runtime-markdown.mjs -->'
const TERMINAL = new Set(['Completed', 'Blocked', 'Failed', 'Skipped'])

const STATUS_ZH = {
  Waiting: '待执行',
  Running: '工作中',
  Completed: '已完成',
  Blocked: '已阻塞',
  Failed: '失败',
  Skipped: '已跳过'
}

function fail(message) {
  throw new Error(`Runtime Markdown: ${message}`)
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    fail(`${rel(path)} is invalid JSON: ${error.message}`)
  }
}

function rel(path) {
  return relative(ROOT, path).split(sep).join('/')
}

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

function text(value) {
  if (typeof value === 'string') return value.trim()
  if (value && typeof value === 'object') return JSON.stringify(value)
  return String(value ?? '').trim()
}

function yaml(value) {
  return JSON.stringify(text(value))
}

function cell(value) {
  return (text(value) || '—').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>')
}

function narrative(value, language = 'en') {
  if (typeof value === 'string') return value.trim()
  if (!value || typeof value !== 'object' || Array.isArray(value)) return text(value)
  const preferred = language === 'zh'
    ? ['summary_zh', 'instruction_zh', 'description_zh', 'summary', 'instruction', 'description', 'type']
    : ['summary', 'instruction', 'description', 'type', 'summary_zh', 'instruction_zh', 'description_zh']
  for (const key of preferred) {
    if (typeof value[key] === 'string' && value[key].trim()) return value[key].trim()
  }
  return JSON.stringify(value)
}

function status(value) {
  const raw = text(value) || 'Unknown'
  return `${STATUS_ZH[raw] || raw} / ${raw}`
}

function familyRecordSourcePath(scheduler, family, date) {
  const root = scheduler.recordRoots?.[family]
  if (!root) fail(`missing record root for ${family}`)
  const [year, month] = date.split('-')
  return `${root}/${year}/${month}/${date}-${family}-runtime.json`
}

function familyRecordPath(scheduler, family, date) {
  return join(ROOT, familyRecordSourcePath(scheduler, family, date))
}

function readablePath(date) {
  const [year, month] = date.split('-')
  return join(READABLE_ROOT, year, month, `${date}-runtime.md`)
}

function href(repository, item) {
  if (!item || typeof item !== 'object') return ''
  if (text(item.url)) return text(item.url)
  if (text(item.path)) return `https://github.com/${repository}/blob/main/${text(item.path)}`
  if (text(item.commit)) return `https://github.com/${repository}/commit/${text(item.commit)}`
  if (text(item.source)) {
    const source = text(item.source)
    return /^https?:\/\//.test(source)
      ? source
      : `https://github.com/${repository}/blob/main/${source}`
  }
  return ''
}

function linkedList(repository, items) {
  if (!Array.isArray(items) || !items.length) return '- 无 / None'
  return items.map((item) => {
    if (typeof item === 'string') {
      const raw = item.trim()
      if (!raw) return '- Evidence'
      const url = /^https?:\/\//.test(raw) ? raw : `https://github.com/${repository}/blob/main/${raw}`
      return `- [${raw}](${url})`
    }
    const zh = text(item?.label_zh)
    const en = text(item?.label)
    const label = zh && en && zh !== en ? `${zh} / ${en}` : zh || en || text(item?.source) || text(item?.path) || text(item?.url) || text(item?.commit) || 'Evidence'
    const url = href(repository, item)
    return url ? `- [${label}](${url})` : `- ${label}`
  }).join('\n')
}
function metricsTable(metrics) {
  if (!Array.isArray(metrics) || !metrics.length) return '无 / None'
  return [
    '| 指标 | Metric | 数值 / Value |',
    '|---|---|---:|',
    ...metrics.map((item) => {
      const en = item.label || item.name || '—'
      const zh = item.label_zh || item.label || item.name || '—'
      return `| ${cell(zh)} | ${cell(en)} | ${cell(item.value)} |`
    })
  ].join('\n')
}
function weekdayForDate(date) {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
    new Date(`${date}T12:00:00Z`).getUTCDay()
  ]
}

function taskRunsOnDate(task, date) {
  if (task.schedule?.kind === 'daily') return true
  if (task.schedule?.kind !== 'weekly') return false
  return (task.schedule.days || []).includes(weekdayForDate(date))
}

function tasksForDate(scheduler, date) {
  return (scheduler.tasks || [])
    .filter((task) => taskRunsOnDate(task, date))
    .sort((a, b) => {
      const byTime = text(a.schedule?.time).localeCompare(text(b.schedule?.time))
      return byTime || text(a.id).localeCompare(text(b.id))
    })
}

function loadFamilyRecords(scheduler, date, tasks) {
  const families = [...new Set(tasks.map((task) => task.family))]
  return Object.fromEntries(families.map((family) => {
    const path = familyRecordPath(scheduler, family, date)
    return [family, existsSync(path) ? readJson(path) : null]
  }))
}

function taskStatus(task, familyRecords) {
  return familyRecords[task.family]?.taskStatus?.[task.id] || 'Waiting'
}

function taskResult(task, familyRecords) {
  return familyRecords[task.family]?.results?.[task.id] || null
}

function mergedTimeline(tasks, familyRecords) {
  const taskIds = new Set(tasks.map((task) => task.id))
  return Object.values(familyRecords)
    .filter(Boolean)
    .flatMap((record) => Array.isArray(record.timeline) ? record.timeline : [])
    .filter((event) => taskIds.has(event.task))
    .sort((a, b) => text(a.time).localeCompare(text(b.time)))
}

function recordMoment(record) {
  if (!record) return ''
  const times = [
    text(record.updatedAt),
    ...(Array.isArray(record.timeline) ? record.timeline.map((event) => text(event.time)) : [])
  ].filter(Boolean)
  return times.sort().at(-1) || ''
}

function overallStatus(tasks, familyRecords) {
  const statuses = tasks.map((task) => taskStatus(task, familyRecords))
  if (statuses.includes('Running')) return 'Running'
  if (statuses.includes('Failed')) return 'Failed'
  if (statuses.includes('Blocked')) return 'Blocked'
  if (statuses.length && statuses.every((item) => TERMINAL.has(item))) return 'Completed'
  return 'Waiting'
}

function aggregateCommitVerify(familyRecords) {
  const records = Object.values(familyRecords).filter(Boolean)
  if (!records.length) return 'Waiting'
  if (records.some((record) => record.commitVerify === 'Failed')) return 'Failed'
  if (records.some((record) => record.commitVerify === 'Running')) return 'Running'
  if (records.every((record) => record.commitVerify === 'Completed')) return 'Completed'
  return 'Waiting'
}

function effectiveCommit(record) {
  if (!record) return ''
  const commits = Object.values(record.results || {})
    .flatMap((result) => Array.isArray(result?.artifacts) ? result.artifacts : [])
    .map((item) => text(item?.commit))
    .filter(Boolean)
  return commits.at(-1) || text(record.githubCommit)
}

function latestRecord(familyRecords) {
  return Object.values(familyRecords)
    .filter(Boolean)
    .sort((a, b) => recordMoment(a).localeCompare(recordMoment(b)))
    .at(-1) || null
}

function render(date, scheduler, familyRecords) {
  const tasks = tasksForDate(scheduler, date)
  const daily = familyRecords.daily
  if (!daily) fail(`no V5 Daily Runtime Record found for ${date}`)

  const repository = text(daily.repository) || text(scheduler.repository) || 'joinwell52-AI/joinwell52'
  const taskById = new Map((scheduler.tasks || []).map((task) => [task.id, task]))
  const timeline = mergedTimeline(tasks, familyRecords)
  const latest = latestRecord(familyRecords)
  const updatedAt = [recordMoment(latest), ...timeline.map((event) => text(event.time))].filter(Boolean).sort().at(-1) || ''
  const sourceRecords = [...new Set(tasks.map((task) => task.family))]
    .map((family) => familyRecordSourcePath(scheduler, family, date))
    .filter((source) => existsSync(join(ROOT, source)))
  const sourceLinks = sourceRecords.map((source) => `[${source.split('/').at(-1)}](https://github.com/${repository}/blob/main/${source})`)
  const dayStatus = overallStatus(tasks, familyRecords)
  const commitVerify = aggregateCommitVerify(familyRecords)
  const githubCommit = effectiveCommit(latest) || 'pending'
  const out = []

  out.push('---')
  out.push('schema: "research-runtime-readable-record/v2"')
  out.push('source_schema: "composite-runtime-day/v1"')
  out.push(`runtime_version: ${yaml(daily.runtimeVersion)}`)
  out.push(`scheduler_version: ${yaml(daily.schedulerVersion)}`)
  out.push('runtime_family: "composite-day"')
  out.push(`source_record: ${yaml(familyRecordSourcePath(scheduler, 'daily', date))}`)
  out.push(`source_records: ${JSON.stringify(sourceRecords)}`)
  out.push(`date: ${yaml(date)}`)
  out.push(`timezone: ${yaml(daily.timezone || scheduler.timezone)}`)
  out.push(`overall_status: ${yaml(dayStatus)}`)
  out.push(`github_commit: ${yaml(githubCommit)}`)
  out.push(`commit_verify: ${yaml(commitVerify)}`)
  out.push(`updated_at: ${yaml(updatedAt)}`)
  out.push('---')
  out.push('')
  out.push(MARKER)
  out.push('')
  out.push(`# Research Runtime Record — ${date}`)
  out.push('')
  out.push(`> **人类可读复合运行账本 / Human-readable composite runtime ledger.** 当天账本由 ${sourceLinks.join('、')} 共同投影；各 Family JSON 仍是权威机器事实源。`)
  out.push('')
  out.push('## 运行概况 / Runtime Summary')
  out.push('')
  out.push(`- **日期 / Date:** ${date}`)
  out.push(`- **星期 / Weekday:** ${weekdayForDate(date)}`)
  out.push(`- **时区 / Timezone:** ${daily.timezone || scheduler.timezone}`)
  out.push(`- **当天任务数 / Tasks Today:** ${tasks.length}`)
  out.push(`- **全天状态 / Overall Status:** **${status(dayStatus)}**`)
  out.push(`- **GitHub Commit:** ${githubCommit}`)
  out.push(`- **Commit Verify:** ${status(commitVerify)}`)
  out.push(`- **最后更新 / Updated:** ${updatedAt || '—'}`)
  out.push('')
  out.push('| 时间 | 班次 | Shift | Family | 状态 | 工作成果摘要 |')
  out.push('|---:|---|---|---|---|---|')

  for (const task of tasks) {
    const currentStatus = taskStatus(task, familyRecords)
    const result = taskResult(task, familyRecords)
    const summary = result ? (narrative(result.workResult_zh || result.workResult, 'zh') || '尚未生成成果块 / No result block yet') : '尚未生成成果块 / No result block yet'
    out.push(`| ${cell(task.schedule?.time)} | ${cell(task.name_zh)} | ${cell(task.name)} | ${cell(task.family)} | ${cell(status(currentStatus))} | ${cell(summary)} |`)
  }

  out.push('')
  out.push('## 完整事件时间线 / Complete Event Timeline')
  out.push('')
  out.push('> Daily 与命中星期的独立周任务统一按真实时点合并；不得只记录最终状态。')
  out.push('')
  out.push('| 时点 | 任务 | Family | 事件 | 状态 | 说明 |')
  out.push('|---|---|---|---|---|---|')
  if (timeline.length) {
    for (const event of timeline) {
      const task = taskById.get(event.task)
      const taskName = task ? `${task.name_zh} / ${task.name}` : event.task
      out.push(`| ${cell(event.time)} | ${cell(taskName)} | ${cell(task?.family || '—')} | ${cell(event.event)} | ${cell(status(event.status))} | ${cell(event.detail)} |`)
    }
  } else {
    out.push('| — | — | — | — | — | 尚无时间线事件 / No timeline event yet |')
  }

  for (const task of tasks) {
    const currentStatus = taskStatus(task, familyRecords)
    const result = taskResult(task, familyRecords)
    out.push('')
    out.push(`## ${task.schedule?.time || '—'} · ${task.name_zh || task.id} / ${task.name || task.id}`)
    out.push('')
    out.push(`- **Family:** ${task.family}`)
    out.push(`- **状态 / Status:** **${status(currentStatus)}**`)
    out.push('')

    if (!result) {
      out.push(currentStatus === 'Running'
        ? '任务已经启动，成果块尚未完成；启动时点已记录在上方完整事件时间线。 / The shift has started; its result block is not complete yet.'
        : '任务尚未执行，暂无成果块。 / The shift has not run and has no result block yet.')
      continue
    }

    out.push('### 输入 / Input')
    out.push('')
    out.push(narrative(result.input_zh || result.input, 'zh') || '—')
    out.push('')
    out.push(`> ${narrative(result.input, 'en') || '—'}`)
    out.push('')
    out.push('### 工作成果 / Work Result')
    out.push('')
    out.push(narrative(result.workResult_zh || result.workResult, 'zh') || '—')
    out.push('')
    out.push(`> ${narrative(result.workResult, 'en') || '—'}`)
    out.push('')
    out.push('### 输出 / Output')
    out.push('')
    out.push(narrative(result.output_zh || result.output, 'zh') || '—')
    out.push('')
    out.push(`> ${narrative(result.output, 'en') || '—'}`)
    out.push('')
    out.push('### 下一步 / Next')
    out.push('')
    out.push(narrative(result.next_zh || result.next, 'zh') || '—')
    out.push('')
    out.push(`> ${narrative(result.next, 'en') || '—'}`)
    if (result.reason || result.reason_zh) {
      out.push('')
      out.push('### 原因 / Reason')
      out.push('')
      out.push(result.reason_zh || '—')
      out.push('')
      out.push(`> ${result.reason || '—'}`)
    }
    out.push('')
    out.push('### 量化结果 / Metrics')
    out.push('')
    out.push(metricsTable(result.metrics))
    out.push('')
    out.push('### 证据 / Evidence')
    out.push('')
    out.push(linkedList(repository, result.evidence))
    out.push('')
    out.push('### 成果文件 / Artifacts')
    out.push('')
    out.push(linkedList(repository, result.artifacts))
  }

  for (const [family, record] of Object.entries(familyRecords)) {
    if (!record) continue
    if (!(record.metrics || []).length && !(record.evidence || []).length && !(record.artifacts || []).length) continue
    out.push('')
    out.push(`## ${family} Family 汇总 / ${family} Family Summary`)
    out.push('')
    out.push('### Metrics')
    out.push('')
    out.push(metricsTable(record.metrics))
    out.push('')
    out.push('### Evidence')
    out.push('')
    out.push(linkedList(repository, record.evidence))
    out.push('')
    out.push('### Artifacts')
    out.push('')
    out.push(linkedList(repository, record.artifacts))
  }

  out.push('')
  return `${out.join('\n')}\n`
}

function dailyRecordsFor(scheduler, args) {
  const dailyRoot = join(ROOT, scheduler.recordRoots?.daily || 'research/runtime/records/daily')
  const files = walk(dailyRoot).filter((path) => path.endsWith('-daily-runtime.json')).sort()
  const records = files
    .map((path) => readJson(path))
    .filter((record) => record?.runtimeFamily === 'daily' && record?.runtimeVersion === '5.0' && text(record.date) >= V5_START)
  if (args.date) return records.filter((record) => record.date === args.date)
  return records
}

function argsOf(argv) {
  const args = { command: 'render', all: false, date: '' }
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token === 'render' || token === 'validate') args.command = token
    else if (token === '--all') args.all = true
    else if (token === '--date') args.date = argv[++i] || ''
  }
  return args
}

function main() {
  const args = argsOf(process.argv.slice(2))
  if (!args.all && !args.date) args.all = true
  if (args.date && !/^\d{4}-\d{2}-\d{2}$/.test(args.date)) fail('--date requires YYYY-MM-DD')
  const scheduler = readJson(SCHEDULER)
  const dailyRecords = dailyRecordsFor(scheduler, args)
  if (args.date && dailyRecords.length !== 1) fail(`no V5 Daily Runtime Record found for ${args.date}`)

  for (const daily of dailyRecords) {
    const tasks = tasksForDate(scheduler, daily.date)
    const familyRecords = loadFamilyRecords(scheduler, daily.date, tasks)
    const path = readablePath(daily.date)
    const expected = render(daily.date, scheduler, familyRecords)
    if (args.command === 'validate') {
      if (!existsSync(path)) fail(`${rel(path)} is missing`)
      if (readFileSync(path, 'utf8') !== expected) fail(`${rel(path)} is not synchronized with its composite Runtime records`)
      console.log(`Verified ${rel(path)}.`)
    } else {
      mkdirSync(dirname(path), { recursive: true })
      writeFileSync(path, expected)
      console.log(`Generated ${rel(path)}.`)
    }
  }
}

try {
  main()
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
