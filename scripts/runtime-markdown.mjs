#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SCHEDULER = join(ROOT, 'research/runtime/SCHEDULER.json')
const DAILY_ROOT = join(ROOT, 'research/runtime/records/daily')
const READABLE_ROOT = join(ROOT, 'research/runtime')
const V5_START = '2026-08-05'
const MARKER = '<!-- generated-by: scripts/runtime-markdown.mjs -->'

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
  return typeof value === 'string' ? value.trim() : String(value ?? '').trim()
}

function yaml(value) {
  return JSON.stringify(text(value))
}

function cell(value) {
  return (text(value) || '—').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>')
}

function status(value) {
  const raw = text(value) || 'Unknown'
  return `${STATUS_ZH[raw] || raw} / ${raw}`
}

function recordSourcePath(date) {
  const [year, month] = date.split('-')
  return `research/runtime/records/daily/${year}/${month}/${date}-daily-runtime.json`
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
    const zh = text(item?.label_zh)
    const en = text(item?.label)
    const label = zh && en && zh !== en ? `${zh} / ${en}` : zh || en || 'Evidence'
    const url = href(repository, item)
    return url ? `- [${label}](${url})` : `- ${label}`
  }).join('\n')
}

function metricsTable(metrics) {
  if (!Array.isArray(metrics) || !metrics.length) return '无 / None'
  return [
    '| 指标 | Metric | 数值 / Value |',
    '|---|---|---:|',
    ...metrics.map((item) => `| ${cell(item.label_zh)} | ${cell(item.label)} | ${cell(item.value)} |`)
  ].join('\n')
}

function isV5Daily(record) {
  return record?.runtimeFamily === 'daily' && record?.runtimeVersion === '5.0' && text(record.date) >= V5_START
}

function render(record, scheduler) {
  const repository = text(record.repository) || text(scheduler.repository) || 'joinwell52-AI/joinwell52'
  const taskById = new Map((scheduler.tasks || []).map((task) => [task.id, task]))
  const taskIds = scheduler.runtimeFamilies?.find((item) => item.id === 'daily')?.taskIds || Object.keys(record.taskStatus || {})
  const sourcePath = recordSourcePath(record.date)
  const sourceUrl = `https://github.com/${repository}/blob/main/${sourcePath}`
  const out = []

  out.push('---')
  out.push('schema: "research-runtime-readable-record/v2"')
  out.push(`source_schema: ${yaml(record.schema)}`)
  out.push(`runtime_version: ${yaml(record.runtimeVersion)}`)
  out.push(`scheduler_version: ${yaml(record.schedulerVersion)}`)
  out.push('runtime_family: "daily"')
  out.push(`source_record: ${yaml(sourcePath)}`)
  out.push(`date: ${yaml(record.date)}`)
  out.push(`timezone: ${yaml(record.timezone)}`)
  out.push(`overall_status: ${yaml(record.status)}`)
  out.push(`github_commit: ${yaml(record.githubCommit || 'pending')}`)
  out.push(`commit_verify: ${yaml(record.commitVerify || 'Waiting')}`)
  out.push(`updated_at: ${yaml(record.updatedAt || '')}`)
  out.push('---')
  out.push('')
  out.push(MARKER)
  out.push('')
  out.push(`# Research Runtime Record — ${record.date}`)
  out.push('')
  out.push(`> **人类可读运行账本 / Human-readable runtime ledger.** 权威机器记录为 [Daily Runtime JSON](${sourceUrl})。本文件逐时点同步 JSON，不替代机器事实源。`)
  out.push('')
  out.push('## 运行概况 / Runtime Summary')
  out.push('')
  out.push(`- **日期 / Date:** ${record.date}`)
  out.push(`- **时区 / Timezone:** ${record.timezone}`)
  out.push(`- **全天状态 / Overall Status:** **${status(record.status)}**`)
  out.push(`- **GitHub Commit:** ${text(record.githubCommit) || 'pending'}`)
  out.push(`- **Commit Verify:** ${status(record.commitVerify)}`)
  out.push(`- **最后更新 / Updated:** ${text(record.updatedAt) || '—'}`)
  out.push('')
  out.push('| 时间 | 班次 | Shift | 状态 | 工作成果摘要 |')
  out.push('|---:|---|---|---|---|')

  for (const id of taskIds) {
    const task = taskById.get(id) || { id, name: id, name_zh: id, schedule: { time: '—' } }
    const taskStatus = record.taskStatus?.[id] || 'Waiting'
    const result = record.results?.[id]
    const summary = result?.workResult_zh || result?.workResult || '尚未生成成果块 / No result block yet'
    out.push(`| ${cell(task.schedule?.time)} | ${cell(task.name_zh)} | ${cell(task.name)} | ${cell(status(taskStatus))} | ${cell(summary)} |`)
  }

  out.push('')
  out.push('## 完整事件时间线 / Complete Event Timeline')
  out.push('')
  out.push('> 每一次执行槽打开、状态变化、完成和提交验证都必须保留；不得只记录最终状态。')
  out.push('')
  out.push('| 时点 | 任务 | 事件 | 状态 | 说明 |')
  out.push('|---|---|---|---|---|')
  if (Array.isArray(record.timeline) && record.timeline.length) {
    for (const event of record.timeline) {
      const task = taskById.get(event.task)
      const taskName = task ? `${task.name_zh} / ${task.name}` : event.task
      out.push(`| ${cell(event.time)} | ${cell(taskName)} | ${cell(event.event)} | ${cell(status(event.status))} | ${cell(event.detail)} |`)
    }
  } else {
    out.push('| — | — | — | — | 尚无时间线事件 / No timeline event yet |')
  }

  for (const id of taskIds) {
    const task = taskById.get(id) || { id, name: id, name_zh: id, schedule: { time: '—' } }
    const taskStatus = record.taskStatus?.[id] || 'Waiting'
    const result = record.results?.[id]
    out.push('')
    out.push(`## ${task.schedule?.time || '—'} · ${task.name_zh || id} / ${task.name || id}`)
    out.push('')
    out.push(`**状态 / Status:** **${status(taskStatus)}**`)
    out.push('')

    if (!result) {
      out.push(taskStatus === 'Running'
        ? '任务已经启动，成果块尚未完成；启动时点已记录在上方完整事件时间线。 / The shift has started; its result block is not complete yet.'
        : '任务尚未执行，暂无成果块。 / The shift has not run and has no result block yet.')
      continue
    }

    out.push('### 输入 / Input')
    out.push('')
    out.push(result.input_zh || '—')
    out.push('')
    out.push(`> ${result.input || '—'}`)
    out.push('')
    out.push('### 工作成果 / Work Result')
    out.push('')
    out.push(result.workResult_zh || '—')
    out.push('')
    out.push(`> ${result.workResult || '—'}`)
    out.push('')
    out.push('### 输出 / Output')
    out.push('')
    out.push(result.output_zh || '—')
    out.push('')
    out.push(`> ${result.output || '—'}`)
    out.push('')
    out.push('### 下一步 / Next')
    out.push('')
    out.push(result.next_zh || '—')
    out.push('')
    out.push(`> ${result.next || '—'}`)
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

  if ((record.metrics || []).length || (record.evidence || []).length || (record.artifacts || []).length) {
    out.push('')
    out.push('## 日级汇总 / Day-level Summary')
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

function recordsFor(args) {
  const files = walk(DAILY_ROOT).filter((path) => path.endsWith('-daily-runtime.json')).sort()
  const records = files.map((path) => readJson(path)).filter(isV5Daily)
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
  const records = recordsFor(args)
  if (args.date && records.length !== 1) fail(`no V5 Daily Runtime Record found for ${args.date}`)

  for (const record of records) {
    const path = readablePath(record.date)
    const expected = render(record, scheduler)
    if (args.command === 'validate') {
      if (!existsSync(path)) fail(`${rel(path)} is missing`)
      if (readFileSync(path, 'utf8') !== expected) fail(`${rel(path)} is not synchronized with its Daily Runtime JSON`)
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
