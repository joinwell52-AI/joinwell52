#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const RUNTIME_ROOT = join(ROOT, 'research/runtime')
const GENERATED_RUNTIME = join(ROOT, 'docs/.vitepress/generated/runtime-records.json')
const OUTPUT = join(ROOT, 'docs/.vitepress/generated/runtime-legacy-records.json')

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function slash(path) {
  return relative(ROOT, path).split(sep).join('/')
}

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
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

function parseMarkdownRecord(path) {
  const normalized = readFileSync(path, 'utf8').replace(/\r\n/g, '\n')
  if (!normalized.startsWith('---\n')) throw new Error(`${slash(path)} has no frontmatter`)
  const end = normalized.indexOf('\n---\n', 4)
  if (end < 0) throw new Error(`${slash(path)} has invalid frontmatter`)
  const data = {}
  for (const line of normalized.slice(4, end).split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue
    const match = /^([a-z0-9_]+):\s*(.*)$/i.exec(line)
    if (match) data[match[1]] = decode(match[2])
  }
  return { data, body: normalized.slice(end + 5), path }
}

function weekday(date) {
  return new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Shanghai', weekday: 'long' })
    .format(new Date(`${date}T04:00:00.000Z`))
}

const TASKS = {
  engine: {
    id: 'engine', family: 'daily', name: 'Research Runtime Engine', name_zh: '研究运行引擎',
    schedule: { kind: 'daily', time: '09:00', cron: '' },
    input: 'Governed Research OS lifecycle state.', input_zh: '受治理的 Research OS 生命周期状态。',
    work: 'Advance one eligible object by one governed transition.', work_zh: '将一个合格对象推进一个受治理状态。',
    output: 'Lifecycle transition and durable research artifact.', output_zh: '生命周期转换与持久化研究产物。'
  },
  queue: {
    id: 'queue', family: 'daily', name: 'Research Runtime Queue', name_zh: '研究运行队列',
    schedule: { kind: 'daily', time: '10:00', cron: '' },
    input: 'Official signals and current queue state.', input_zh: '官方信号与当前队列状态。',
    work: 'Discover, score, select, defer or reject research candidates.', work_zh: '发现、评分、选择、延期或拒绝研究候选。',
    output: 'Research Queue and three-column plan.', output_zh: '研究队列与三栏计划。'
  },
  knowledge: {
    id: 'knowledge', family: 'daily', name: 'Research Runtime Knowledge', name_zh: '研究运行知识',
    schedule: { kind: 'daily', time: '11:00', cron: '' },
    input: 'Completed evidence-validated Research Notes.', input_zh: '已完成证据核验的研究笔记。',
    work: 'Maintain knowledge links and architecture candidates.', work_zh: '维护知识关联与架构候选。',
    output: 'Knowledge records and architecture candidates.', output_zh: '知识记录与架构候选。'
  },
  architecture: {
    id: 'architecture', family: 'daily', name: 'Research Runtime Architecture', name_zh: '研究运行架构评审',
    schedule: { kind: 'weekly', time: '12:00', days: ['Monday'], cron: '' },
    input: 'Evidence-backed architecture candidates.', input_zh: '具备证据支持的架构候选。',
    work: 'Make governed architecture and lifecycle decisions.', work_zh: '作出受治理的架构与生命周期决定。',
    output: 'Architecture disposition.', output_zh: '架构处置结果。'
  },
  production: {
    id: 'production', family: 'daily', name: 'Research Runtime Production', name_zh: '研究运行生产',
    schedule: { kind: 'daily', time: '15:00', cron: '' },
    input: 'Eligible analyzed research objects.', input_zh: '合格的已分析研究对象。',
    work: 'Run writing, visualization, evidence and editing gates.', work_zh: '执行写作、配图、证据与编辑门禁。',
    output: 'Publication Candidate batch.', output_zh: '出版候选批次。'
  },
  publication: {
    id: 'publication', family: 'daily', name: 'Research Runtime Publication', name_zh: '研究运行发布',
    schedule: { kind: 'daily', time: '20:00', cron: '' },
    input: 'Complete Publication Candidates.', input_zh: '完整出版候选。',
    work: 'Release, commit and verify.', work_zh: '发版、提交并验证。',
    output: 'Released publication.', output_zh: '正式发布结果。'
  },
  weekly: {
    id: 'weekly', family: 'daily', name: 'Research Runtime Weekly', name_zh: '研究运行每周综合',
    schedule: { kind: 'weekly', time: '20:30', days: ['Sunday'], cron: '' },
    input: 'The week’s validated Daily Research.', input_zh: '本周已验证 Daily Research。',
    work: 'Produce new weekly synthesis.', work_zh: '形成新的每周综合。',
    output: 'Weekly Publication.', output_zh: '每周发布。'
  },
  academic: {
    id: 'academic', family: 'daily', name: 'Research Runtime Academic', name_zh: '研究运行学术研究',
    schedule: { kind: 'weekly', time: '10:00', days: ['Wednesday'], cron: '' },
    input: 'Paper, benchmark, specification or institution.', input_zh: '论文、基准、规范或机构对象。',
    work: 'Execute the academic research pipeline.', work_zh: '执行学术研究流程。',
    output: 'Academic Publication.', output_zh: '学术发布。'
  }
}

function tasksFor(date) {
  const day = weekday(date)
  const ids = ['engine', 'queue', 'knowledge']
  if (day === 'Monday') ids.push('architecture')
  if (date >= '2026-08-04') ids.push('production')
  ids.push('publication')
  if (day === 'Sunday') ids.push('weekly')
  if (day === 'Wednesday') ids.push('academic')
  return ids.map((id) => TASKS[id]).sort((a, b) => a.schedule.time.localeCompare(b.schedule.time))
}

function parseResults(body) {
  const results = {}
  const pattern = /```runtime-result\s*\n([\s\S]*?)\n```/g
  let match
  while ((match = pattern.exec(body))) {
    let source
    try { source = JSON.parse(match[1]) } catch { continue }
    results[source.task] = {
      task: source.task,
      status: source.status,
      input: source.input || '',
      input_zh: source.input_zh || '',
      workResult: source.workResult || source.summary || '',
      workResult_zh: source.workResult_zh || source.summary_zh || '',
      output: source.output || '',
      output_zh: source.output_zh || '',
      next: source.next || '',
      next_zh: source.next_zh || '',
      reason: source.reason || '',
      reason_zh: source.reason_zh || '',
      metrics: Array.isArray(source.metrics) ? source.metrics : [],
      evidence: Array.isArray(source.evidence) ? source.evidence : [],
      artifacts: Array.isArray(source.artifacts) ? source.artifacts : []
    }
  }
  return results
}

function parseTimeline(body) {
  const start = body.indexOf('## Runtime Log')
  if (start < 0) return []
  return body.slice(start).split(/\r?\n/).flatMap((line) => {
    if (!line.trim().startsWith('|')) return []
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim())
    if (cells.length !== 5 || cells[0] === 'Time' || /^-+$/.test(cells[0])) return []
    return [{ time: cells[0], task: cells[1], event: cells[2], status: cells[3], detail: cells[4] }]
  })
}

function planFor(date) {
  const [year, month] = date.split('-')
  const path = join(RUNTIME_ROOT, 'plans', year, month, `${date}-plan.json`)
  if (!existsSync(path)) return []
  const plan = readJson(path)
  return (plan.columns || []).map((column) => ({
    id: column.id,
    label: column.label,
    label_zh: column.label_zh,
    decision: column.selectionStatus === 'No Selection'
      ? 'No Selection'
      : column.selectionStatus === 'Waiting'
        ? 'Waiting'
        : 'Selected',
    signals: 0,
    candidates: column.selectionStatus === 'No Selection' ? 0 : 1,
    selectedItemId: column.itemId || '',
    selectedTitle: column.title || '',
    selectedTitle_zh: column.title_zh || '',
    reason: column.reason || '',
    reason_zh: column.reason_zh || ''
  }))
}

function recordFrom(parsed) {
  const { data, body, path } = parsed
  const tasks = tasksFor(data.date)
  const taskStatus = Object.fromEntries(tasks.map((task) => [task.id, data[`task_${task.id}`] || 'Waiting']))
  const completedTasks = Object.values(taskStatus).filter((status) => status === 'Completed').length
  return {
    runtimeFamily: 'legacy',
    date: data.date,
    status: data.overall_status || 'Waiting',
    taskStatus,
    results: parseResults(body),
    timeline: parseTimeline(body),
    githubCommit: data.github_commit || 'pending',
    commitVerify: data.commit_verify || 'Waiting',
    recordPath: slash(path),
    tasks,
    columns: planFor(data.date),
    totalTasks: tasks.length,
    completedTasks
  }
}

const runtime = readJson(GENERATED_RUNTIME)
const legacyRecords = walk(RUNTIME_ROOT)
  .filter((path) => /research[\\/]runtime[\\/]\d{4}[\\/]\d{2}[\\/]\d{4}-\d{2}-\d{2}-runtime\.md$/.test(path))
  .map(parseMarkdownRecord)
  .map(recordFrom)
  .sort((a, b) => b.date.localeCompare(a.date))

const payload = {
  schema: 'research-runtime-legacy-projection/v1',
  generatedAt: new Date().toISOString(),
  today: runtime.today,
  timezone: runtime.timezone,
  current: legacyRecords.find((record) => record.date === runtime.today) || null,
  records: legacyRecords
}

mkdirSync(dirname(OUTPUT), { recursive: true })
writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`)
console.log(`Generated ${slash(OUTPUT)} with ${legacyRecords.length} legacy Runtime record(s).`)
