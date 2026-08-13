#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve('.')
const LEGACY_PATH = join(ROOT, 'docs/.vitepress/generated/runtime-legacy-records.json')
const RUNTIME_PATH = join(ROOT, 'docs/.vitepress/generated/runtime-records.json')
const INTELLIGENCE_PATH = join(ROOT, 'docs/.vitepress/generated/research-intelligence.json')
const SCHEDULER_PATH = join(ROOT, 'research/runtime/SCHEDULER.json')
const DIST_PATH = join(ROOT, 'docs/.vitepress/dist')
const RAW_DAILY_ROOT = join(ROOT, 'research/runtime/records/daily')
const RESULT_FIELDS = ['input', 'workResult', 'output', 'next']

function die(message) { throw new Error(`Runtime projection verification failed: ${message}`) }
function readJson(path) { if (!existsSync(path)) die(`${path} does not exist`); return JSON.parse(readFileSync(path, 'utf8')) }
function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}
function assertReadable(label, value) {
  if (typeof value !== 'string') die(`${label} is not a string after projection`)
  if (value.includes('[object Object]')) die(`${label} contains [object Object]`)
  if (/^\s*\{.*\}\s*$/s.test(value)) die(`${label} leaked a raw JSON object`)
}

const runtime = readJson(RUNTIME_PATH)
if (runtime.schema !== 'research-runtime-center-data/v5') die(`unexpected Runtime schema ${runtime.schema}`)
const scheduler = readJson(SCHEDULER_PATH)
if (runtime.effectiveDate !== scheduler.effectiveDate) {
  die(`Runtime effective date ${runtime.effectiveDate} does not match Scheduler ${scheduler.effectiveDate}`)
}

for (const [family, records] of Object.entries(runtime.records || {})) {
  const seen = new Set()
  for (const record of records || []) {
    if (!record?.date) die(`${family} contains a record without date`)
    if (seen.has(record.date)) die(`${family} contains duplicate date ${record.date}`)
    seen.add(record.date)
    for (const [taskId, result] of Object.entries(record.results || {})) {
      if (result?.schema !== 'runtime-shift-result/v2') continue
      for (const field of RESULT_FIELDS) {
        assertReadable(`${family}/${record.date}/${taskId}.${field}`, result[field] ?? '')
        assertReadable(`${family}/${record.date}/${taskId}.${field}_zh`, result[`${field}_zh`] ?? '')
      }
      for (const metric of result.metrics || []) {
        if (typeof metric?.label !== 'string' || typeof metric?.label_zh !== 'string') die(`${family}/${record.date}/${taskId} has an unprojected metric`)
      }
      for (const item of [...(result.evidence || []), ...(result.artifacts || [])]) {
        if (!item || typeof item !== 'object') die(`${family}/${record.date}/${taskId} has an unprojected evidence/artifact item`)
      }
    }
  }
}

const rawDailyFiles = walk(RAW_DAILY_ROOT).filter((path) => path.endsWith('-daily-runtime.json'))
for (const path of rawDailyFiles) {
  const raw = readJson(path)
  const projected = (runtime.records?.daily || []).find((item) => item.date === raw.date)
  if (!projected) die(`generated data is missing Daily Runtime ${raw.date}`)
  for (const [taskId, sourceResult] of Object.entries(raw.results || {})) {
    if (sourceResult?.schema !== 'runtime-shift-result/v2') continue
    const targetResult = projected.results?.[taskId]
    if (!targetResult) die(`generated data is missing ${raw.date}/${taskId}`)
    for (const field of RESULT_FIELDS) {
      const localized = sourceResult?.[`${field}_zh`]
      if (typeof localized === 'string' && localized.trim() && targetResult[`${field}_zh`] !== localized.trim()) {
        die(`${raw.date}/${taskId}.${field}_zh did not preserve the durable localized source field`)
      }
    }
  }
}

const august8 = (runtime.records?.daily || []).find((record) => record.date === '2026-08-08')
const analysis = august8?.results?.analysis
if (analysis) {
  const expectedZh = '仅在持久化 Analysis Running 状态完成 fetch 与核验后消费 2026-08-08 当日三份已完成 Reading Results。Scheduler fallback 启动提交：396257e1dc517f0bce51a9a648798c6305a79377。'
  if (analysis.input_zh !== expectedZh) die('2026-08-08 Analysis Chinese input is not preserved')
  if (!analysis.workResult_zh.includes('形成三份 Research Objects')) die('2026-08-08 Analysis Chinese work result is missing')
  if (!analysis.output_zh.includes('三份可作为 Production 唯一合法输入')) die('2026-08-08 Analysis Chinese output is missing')
  if (!analysis.next_zh.includes('15:00 Production 只能消费')) die('2026-08-08 Analysis Chinese next step is missing')
}

const intelligence = readJson(INTELLIGENCE_PATH)
for (const [date, run] of Object.entries(intelligence.runs || {})) {
  if (run?.date !== date) die(`Research Intelligence historical run key ${date} points to ${run?.date}`)
}

const legacy = readJson(LEGACY_PATH)
const august4 = (legacy.records || []).find((record) => record.date === '2026-08-04')
if (!august4) die('2026-08-04 legacy Runtime Record is missing')
const productionResult = august4.results?.production
const publicationResult = august4.results?.publication
if (august4.taskStatus?.production !== 'Completed' || productionResult?.status !== 'Completed') die('2026-08-04 Production must remain Completed')
if (august4.taskStatus?.publication !== 'Completed' || publicationResult?.status !== 'Completed') die('2026-08-04 Publication must remain Completed')
if (august4.completedTasks !== 5 || august4.totalTasks !== 5) die(`2026-08-04 progress is ${august4.completedTasks}/${august4.totalTasks}, expected 5/5`)
if (!productionResult.workResult_zh.includes('Completed') || !productionResult.workResult_zh.includes('0 个出版候选')) die('Chinese legacy Production result is incorrect')
if (productionResult.workResult_zh.includes('Skipped') || productionResult.output_zh.includes('Skipped')) die('legacy Production projection still contains Skipped')
if (!publicationResult.workResult_zh.includes('Completed') || !publicationResult.workResult_zh.includes('发布 0 个')) die('Chinese legacy Publication result is incorrect')

if (process.argv.includes('--dist')) {
  const required = ['zh/runtime/index.html', 'en/runtime/index.html', 'zh/runtime/intelligence-sources.html', 'en/runtime/intelligence-sources.html']
  for (const route of required) if (!existsSync(join(DIST_PATH, route))) die(`built site is missing ${route}`)

  const text = walk(DIST_PATH).filter((path) => /\.(html|js|json)$/.test(path)).map((path) => readFileSync(path, 'utf8')).join('\n')
  if (analysis) {
    if (!text.includes(analysis.input_zh)) die('built site does not contain the Chinese 2026-08-08 Analysis input')
    if (!text.includes(analysis.workResult_zh)) die('built site does not contain the Chinese 2026-08-08 Analysis result')
    if (!text.includes(analysis.input)) die('built site does not contain the English 2026-08-08 Analysis input')
  }
  if (!text.includes('Microsoft Research') || !text.includes('Autonomous Agents and Multi-Agent Systems') || !text.includes('Journal of Systems and Software') || !text.includes('Zenodo')) die('built source-detail pages do not contain the required intelligence sources')
  if (!text.includes('该班次以 Completed 结束，并生成 0 个出版候选')) die('built site does not contain the corrected Chinese legacy Production outcome')
  if (!text.includes('Completed the governed Production eligibility review for all three columns')) die('built site does not contain the corrected English legacy Production outcome')
}

console.log('Runtime Projection Contract verified: bilingual V2 fields, readable objects, date isolation, source-detail routes, and legacy history invariants.')
