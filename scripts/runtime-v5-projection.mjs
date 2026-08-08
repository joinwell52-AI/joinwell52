#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const MANIFEST_PATH = join(ROOT, 'research/runtime/SCHEDULER.json')
const GENERATED_PATH = join(ROOT, 'docs/.vitepress/generated/runtime-records.json')

const KEY_ZH = {
  scheduler: '调度器', skill: 'Skill', signalPool: '信号池', signalCount: '信号数', plan: '研究计划',
  queueStatus: 'Queue 状态', discoveryStatus: 'Discovery 状态', selectedObjects: '已选对象', priorCheckpoint: '上次检查点',
  intelligenceRegistry: '情报源 Registry', profiles: '情报 Profile', task: '下一任务', scheduledTime: '计划时间',
  artifact: '成果文件', artifacts: '成果文件', type: '类型', readingResultCount: 'Reading Result 数量',
  columnDecisions: '栏目决策数', selectedCount: '已选数', noSelectionCount: '未选题数', selectionCount: '选题数'
}

const TYPE_ZH = {
  'Signal Pool': '信号池',
  "Today's Research Plan": '今日研究计划',
  'Reading Results': '深读结果',
  'Research Objects': '研究对象',
  'Publication Candidates': '出版候选'
}

const METRIC_ZH = {
  platform_channels_due: '平台渠道应检查数', platform_channels_checked: '平台渠道已检查数',
  platform_channels_inaccessible: '平台渠道受限数', platform_channels_failed: '平台渠道失败数',
  github_repositories_due: 'GitHub 仓库应检查数', github_repositories_checked: 'GitHub 仓库已检查数',
  research_sources_due: '研究来源应检查数', research_sources_checked: '研究来源已检查数',
  signal_pool_count: '信号池数量', topic_selection_count: '选题数量', column_decisions: '栏目决策数',
  selected_objects: '已选对象数', candidate_signals: '候选信号数', rejected_signals: '拒绝信号数',
  no_selection_decisions: '未选题决策数', queue_start_events: 'Queue 启动事件数', reading_results: 'Reading Results 数量',
  primary_source_groups: '主要来源组数', inaccessible_sources: '受限来源数', failed_sources: '失败来源数',
  reading_start_events: 'Reading 启动事件数', research_analysis_objects: '研究分析对象数', article_drafts: '文章草稿数'
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
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

function clock(timezone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date()).map((part) => [part.type, part.value]))
  return { date: `${parts.year}-${parts.month}-${parts.day}` }
}

function familyById(manifest, familyId) {
  return manifest.runtimeFamilies.find((item) => item.id === familyId)
}

function defaultRecord(manifest, familyId, date) {
  const family = familyById(manifest, familyId)
  return {
    schema: manifest.recordContracts[familyId], runtimeVersion: manifest.centerVersion, schedulerVersion: manifest.version,
    runtimeFamily: familyId, runtimeFamilyName: family.name, runtimeFamilyName_zh: family.name_zh, date,
    timezone: manifest.timezone, repository: manifest.repository, status: 'Waiting',
    taskStatus: Object.fromEntries(family.taskIds.map((id) => [id, 'Waiting'])), results: {}, timeline: [], metrics: [],
    evidence: [], artifacts: [], githubCommit: 'pending', commitVerify: 'Waiting', updatedAt: ''
  }
}

function compactValue(value) {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(compactValue).filter(Boolean).join(', ')
  return ''
}

function structuralSummary(value, lang, field) {
  const parts = []
  for (const [key, item] of Object.entries(value || {})) {
    if (key.endsWith('_zh') || key === 'controlPlane' || key === 'summary' || key === 'instruction' || typeof item === 'object') continue
    let rendered = compactValue(item)
    if (!rendered) continue
    if (lang === 'zh' && key === 'type') rendered = TYPE_ZH[rendered] || rendered
    const label = lang === 'zh' ? (KEY_ZH[key] || key) : key
    parts.push(`${label}: ${rendered}`)
  }
  if (field === 'output' && value?.type && !parts.some((item) => item.startsWith(lang === 'zh' ? '类型:' : 'type:'))) {
    parts.unshift(`${lang === 'zh' ? '类型' : 'type'}: ${lang === 'zh' ? (TYPE_ZH[value.type] || value.type) : value.type}`)
  }
  return parts.join(' · ')
}

function summarizeObject(value, lang = 'en', field = '') {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return compactValue(value)

  if (lang === 'zh') {
    if (value.summary_zh) return String(value.summary_zh)
    if (value.instruction_zh) return String(value.instruction_zh)
    const structural = structuralSummary(value, lang, field)
    return structural || '该字段已记录结构化事实；请查看证据与成果文件。'
  }

  if (value.summary) return String(value.summary)
  if (value.instruction) return String(value.instruction)
  const structural = structuralSummary(value, lang, field)
  return structural || 'Structured facts recorded; see Evidence and Artifacts.'
}

function resultField(result, field, lang) {
  if (lang === 'zh') {
    const localized = result?.[`${field}_zh`]
    if (typeof localized === 'string' && localized.trim()) return localized.trim()
  }
  const value = result?.[field]
  if (lang === 'en' && typeof value === 'string' && value.trim()) return value.trim()
  return summarizeObject(value, lang, field)
}

function metricLabel(name = '') {
  return String(name).replaceAll('_', ' ')
}

function normalizeMetric(item) {
  if (item && typeof item === 'object') {
    const name = String(item.name || '')
    const label = item.label || metricLabel(name)
    return { label, label_zh: item.label_zh || METRIC_ZH[name] || label, value: String(item.value ?? '') }
  }
  return { label: 'metric', label_zh: '指标', value: String(item ?? '') }
}

function normalizeEvidence(item) {
  if (typeof item === 'string') {
    const label = /^https?:\/\//.test(item) ? item.replace(/^https?:\/\//, '').split('/')[0] : basename(item)
    return { label, label_zh: label, source: item }
  }
  return item
}

function normalizeArtifact(item) {
  if (typeof item === 'string') {
    const label = basename(item)
    return { label, label_zh: label, path: item }
  }
  return item
}

function normalizeResult(result) {
  if (!result || typeof result !== 'object' || result.schema !== 'runtime-shift-result/v2') return result
  return {
    ...result,
    input: resultField(result, 'input', 'en'), input_zh: resultField(result, 'input', 'zh'),
    workResult: resultField(result, 'workResult', 'en'), workResult_zh: resultField(result, 'workResult', 'zh'),
    output: resultField(result, 'output', 'en'), output_zh: resultField(result, 'output', 'zh'),
    next: resultField(result, 'next', 'en'), next_zh: resultField(result, 'next', 'zh'),
    reason: resultField(result, 'reason', 'en'), reason_zh: resultField(result, 'reason', 'zh'),
    metrics: (result.metrics || []).map(normalizeMetric), evidence: (result.evidence || []).map(normalizeEvidence),
    artifacts: (result.artifacts || []).map(normalizeArtifact)
  }
}

function normalizeRecord(record) {
  return { ...record, results: Object.fromEntries(Object.entries(record.results || {}).map(([id, result]) => [id, normalizeResult(result)])) }
}

const manifest = readJson(MANIFEST_PATH)
const records = Object.fromEntries(manifest.runtimeFamilies.map((family) => {
  const root = join(ROOT, manifest.recordRoots[family.id])
  const items = walk(root)
    .filter((path) => path.endsWith(`-${family.id}-runtime.json`)).sort()
    .map((path) => normalizeRecord(readJson(path))).sort((a, b) => b.date.localeCompare(a.date))
  return [family.id, items]
}))

const now = clock(manifest.timezone)
const payload = {
  schema: 'research-runtime-center-data/v5', generatedAt: new Date().toISOString(), today: now.date,
  timezone: manifest.timezone, schedulerVersion: manifest.version, centerVersion: manifest.centerVersion,
  operationsCenterVersion: manifest.operationsCenterVersion, architectureStatus: manifest.architectureStatus,
  statuses: manifest.statuses, columns: manifest.columns, programs: manifest.programs, runtimeFamilies: manifest.runtimeFamilies,
  schedule: manifest.tasks,
  todayDaily: records.daily.find((record) => record.date === now.date) || defaultRecord(manifest, 'daily', now.date),
  latest: Object.fromEntries(manifest.runtimeFamilies.map((family) => [family.id, records[family.id][0] || null])), records
}

writeJson(GENERATED_PATH, payload)
console.log(`Generated ${slash(GENERATED_PATH)} with bilingual runtime-shift-result/v2 UI projection.`)
