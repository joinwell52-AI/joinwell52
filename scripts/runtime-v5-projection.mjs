#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const MANIFEST_PATH = join(ROOT, 'research/runtime/SCHEDULER.json')
const GENERATED_PATH = join(ROOT, 'docs/.vitepress/generated/runtime-records.json')

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

function compactValue(value) {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(compactValue).filter(Boolean).join(', ')
  return ''
}

function summarizeObject(value, lang = 'en', field = '') {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return compactValue(value)

  const localized = lang === 'zh' ? value.summary_zh : value.summary
  if (localized) return String(localized)
  if (value.instruction) return String(value.instruction)

  if (field === 'output' && value.type) {
    const parts = [String(value.type)]
    if (value.artifact) parts.push(String(value.artifact))
    for (const key of ['signalCount', 'columnDecisions', 'selectedCount', 'noSelectionCount']) {
      if (value[key] !== undefined) parts.push(`${key}: ${value[key]}`)
    }
    return parts.join(' · ')
  }

  const parts = []
  for (const [key, item] of Object.entries(value)) {
    if (key.endsWith('_zh') || key === 'controlPlane' || typeof item === 'object') continue
    const rendered = compactValue(item)
    if (rendered) parts.push(`${key}: ${rendered}`)
  }
  if (parts.length) return parts.join(' · ')

  return JSON.stringify(value)
}

function metricLabel(name = '') {
  return String(name).replaceAll('_', ' ')
}

function normalizeMetric(item) {
  if (item && typeof item === 'object') {
    const label = item.label || metricLabel(item.name)
    return {
      label,
      label_zh: item.label_zh || label,
      value: String(item.value ?? '')
    }
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
  if (!result || typeof result !== 'object') return result
  if (result.schema !== 'runtime-shift-result/v2') return result
  return {
    ...result,
    input: summarizeObject(result.input, 'en', 'input'),
    input_zh: summarizeObject(result.input, 'zh', 'input'),
    workResult: summarizeObject(result.workResult, 'en', 'workResult'),
    workResult_zh: summarizeObject(result.workResult, 'zh', 'workResult'),
    output: summarizeObject(result.output, 'en', 'output'),
    output_zh: summarizeObject(result.output, 'zh', 'output'),
    next: summarizeObject(result.next, 'en', 'next'),
    next_zh: summarizeObject(result.next, 'zh', 'next'),
    reason: summarizeObject(result.reason, 'en', 'reason'),
    reason_zh: summarizeObject(result.reason, 'zh', 'reason'),
    metrics: (result.metrics || []).map(normalizeMetric),
    evidence: (result.evidence || []).map(normalizeEvidence),
    artifacts: (result.artifacts || []).map(normalizeArtifact)
  }
}

function normalizeRecord(record) {
  return {
    ...record,
    results: Object.fromEntries(Object.entries(record.results || {}).map(([id, result]) => [id, normalizeResult(result)]))
  }
}

const manifest = readJson(MANIFEST_PATH)
const records = Object.fromEntries(manifest.runtimeFamilies.map((family) => {
  const root = join(ROOT, manifest.recordRoots[family.id])
  const items = walk(root)
    .filter((path) => path.endsWith(`-${family.id}-runtime.json`))
    .sort()
    .map((path) => normalizeRecord(readJson(path)))
    .sort((a, b) => b.date.localeCompare(a.date))
  return [family.id, items]
}))

const now = clock(manifest.timezone)
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
  todayDaily: records.daily.find((record) => record.date === now.date) || defaultRecord(manifest, 'daily', now.date),
  latest: Object.fromEntries(manifest.runtimeFamilies.map((family) => [family.id, records[family.id][0] || null])),
  records
}

writeJson(GENERATED_PATH, payload)
console.log(`Generated ${slash(GENERATED_PATH)} with runtime-shift-result/v2 UI projection.`)
