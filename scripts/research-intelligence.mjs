#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REGISTRY_PATH = join(ROOT, 'research/intelligence/REGISTRY.json')
const RUN_ROOT = join(ROOT, 'research/intelligence/runs')
const PLAN_ROOT = join(ROOT, 'research/runtime/plans')
const GENERATED_PATH = join(ROOT, 'docs/.vitepress/generated/research-intelligence.json')

const PIPELINE_IDS = ['ai-platform', 'github-engineering', 'published-research']
const COLUMN_IDS = ['digital-employee', 'industry-architecture', 'open-source-engineering']
const STATUSES = new Set(['Waiting', 'Running', 'Completed', 'Blocked', 'Failed', 'Skipped'])
const DECISIONS = new Set(['Waiting', 'Selected', 'No Selection'])
const EFFECTIVE_TERMINAL = new Set(['Completed', 'Blocked', 'Failed', 'Skipped'])

function die(message) {
  throw new Error(`Research Intelligence: ${message}`)
}

function readJson(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')) }
  catch (error) { die(`${relative(ROOT, path)} is invalid JSON: ${error.message}`) }
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

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

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

function relativePath(path) {
  return relative(ROOT, path).split(sep).join('/')
}

function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function datePath(root, date, suffix) {
  const [year, month] = date.split('-')
  return join(root, year, month, `${date}-${suffix}.json`)
}

function validateRegistry(registry) {
  if (registry.schema !== 'research-intelligence-registry/v1') die('invalid registry schema')
  if (registry.version !== '1.0') die('registry version must be 1.0')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(registry.effectiveDate || '')) die('effectiveDate is invalid')
  if (registry.timezone !== 'Asia/Shanghai') die('registry timezone must be Asia/Shanghai')

  const columnIds = (registry.columns || []).map((column) => column.id)
  if (JSON.stringify(columnIds) !== JSON.stringify(COLUMN_IDS)) {
    die(`registry columns must be ${COLUMN_IDS.join(', ')}`)
  }

  const pipelineIds = (registry.pipelines || []).map((pipeline) => pipeline.id)
  if (JSON.stringify(pipelineIds) !== JSON.stringify(PIPELINE_IDS)) {
    die(`registry pipelines must be ${PIPELINE_IDS.join(', ')}`)
  }

  for (const pipeline of registry.pipelines) {
    if (!text(pipeline.name) || !text(pipeline.name_zh) || !text(pipeline.skill)) {
      die(`${pipeline.id}: name, name_zh and skill are required`)
    }
    if (JSON.stringify(pipeline.serviceColumns) !== JSON.stringify(COLUMN_IDS)) {
      die(`${pipeline.id}: all three service columns are required`)
    }
  }

  const platform = registry.pipelines.find((pipeline) => pipeline.id === 'ai-platform')
  const requiredPlatforms = ['openai', 'anthropic-claude', 'google-gemini', 'cursor', 'github-copilot', 'microsoft-copilot-platform']
  const actualPlatforms = (platform.sources || []).filter((source) => source.tier === 'P0').map((source) => source.id)
  if (JSON.stringify(actualPlatforms) !== JSON.stringify(requiredPlatforms)) {
    die(`AI platform P0 sources must be ${requiredPlatforms.join(', ')}`)
  }
  for (const source of platform.sources) {
    if (!Array.isArray(source.channels) || !source.channels.length) die(`${source.id}: channels are required`)
    if (source.tier === 'P0' && !source.channels.some((channel) => String(channel.type).includes('community'))) {
      die(`${source.id}: a P0 platform requires an official forum or community channel`)
    }
    for (const channel of source.channels) {
      if (!text(channel.id) || !text(channel.type) || !/^https:\/\//.test(channel.url || '')) {
        die(`${source.id}: invalid source channel`)
      }
    }
  }

  const github = registry.pipelines.find((pipeline) => pipeline.id === 'github-engineering')
  const repositories = github.repositories || []
  if (new Set(repositories.map((item) => item.repository)).size !== repositories.length) {
    die('GitHub repository watchlist contains duplicates')
  }
  for (const item of repositories) {
    if (!/^[^/\s]+\/[^/\s]+$/.test(item.repository || '')) die(`invalid repository ${item.repository}`)
    if (!['P0', 'P1', 'P2'].includes(item.tier)) die(`${item.repository}: invalid tier`)
    if (!Array.isArray(item.columns) || !item.columns.length) die(`${item.repository}: columns are required`)
  }

  const research = registry.pipelines.find((pipeline) => pipeline.id === 'published-research')
  if (!Array.isArray(research.sources) || !research.sources.length) die('published research sources are required')
  if (!Array.isArray(research.topics) || research.topics.length < 10) die('published research topics are incomplete')

  return registry
}

function dueCount(pipeline) {
  if (pipeline.id === 'ai-platform') {
    return pipeline.sources
      .filter((source) => source.tier === 'P0')
      .reduce((total, source) => total + source.channels.length, 0)
  }
  if (pipeline.id === 'github-engineering') {
    return pipeline.repositories.filter((item) => item.tier === 'P0').length
  }
  return pipeline.sources.filter((source) => source.tier === 'P0').length
}

function defaultRun(date, registry) {
  return {
    schema: 'research-intelligence-run/v1',
    version: '1.0',
    date,
    timezone: registry.timezone,
    status: 'Waiting',
    registryVersion: registry.version,
    sourceTask: 'Research Runtime Queue',
    updatedAt: '',
    githubCommit: 'pending',
    reason: 'Research Runtime Queue has not completed the three intelligence pipelines.',
    reason_zh: '研究运行队列尚未完成三条情报发现管线。',
    pipelines: registry.pipelines.map((pipeline) => ({
      id: pipeline.id,
      label: pipeline.name,
      label_zh: pipeline.name_zh,
      status: 'Waiting',
      due: dueCount(pipeline),
      checked: 0,
      inaccessible: [],
      failed: [],
      signals: 0,
      candidates: 0,
      selected: 0,
      rejected: 0,
      coveragePercent: 0,
      reason: 'The pipeline has not run.',
      reason_zh: '该情报管线尚未执行。'
    })),
    columns: registry.columns.map((column) => ({
      id: column.id,
      label: column.name,
      label_zh: column.name_zh,
      decision: 'Waiting',
      signals: 0,
      candidates: 0,
      selectedItemId: '',
      selectedTitle: '',
      selectedTitle_zh: '',
      reason: 'Waiting for discovery and triage.',
      reason_zh: '等待情报发现与研究筛选。'
    })),
    signals: []
  }
}

function validatePipeline(result, path) {
  if (!PIPELINE_IDS.includes(result.id)) die(`${path}: unknown pipeline ${result.id}`)
  if (!STATUSES.has(result.status)) die(`${path}: invalid pipeline status ${result.status}`)
  for (const key of ['due', 'checked', 'signals', 'candidates', 'selected', 'rejected', 'coveragePercent']) {
    if (!Number.isFinite(result[key]) || result[key] < 0) die(`${path}: ${result.id} invalid ${key}`)
  }
  if (!Array.isArray(result.inaccessible) || !Array.isArray(result.failed)) {
    die(`${path}: ${result.id} inaccessible and failed must be arrays`)
  }
  for (const entry of [...result.inaccessible, ...result.failed]) {
    if (!text(entry.source) || !text(entry.reason)) die(`${path}: ${result.id} access failure requires source and reason`)
  }
  const resolved = result.checked + result.inaccessible.length + result.failed.length
  if (resolved > result.due) die(`${path}: ${result.id} resolved sources exceed due sources`)
  if (result.status === 'Completed' && resolved !== result.due) {
    die(`${path}: ${result.id} Completed requires every due source to be resolved`)
  }
  if (['Blocked', 'Failed', 'Skipped'].includes(result.status) && !text(result.reason)) {
    die(`${path}: ${result.id} terminal non-completed status requires reason`)
  }
}

function validateColumn(result, path) {
  if (!COLUMN_IDS.includes(result.id)) die(`${path}: unknown column ${result.id}`)
  if (!DECISIONS.has(result.decision)) die(`${path}: invalid decision ${result.decision}`)
  for (const key of ['signals', 'candidates']) {
    if (!Number.isFinite(result[key]) || result[key] < 0) die(`${path}: ${result.id} invalid ${key}`)
  }
  if (!text(result.reason) || !text(result.reason_zh)) die(`${path}: ${result.id} bilingual reason is required`)
  if (result.decision === 'Selected') {
    if (!text(result.selectedItemId) || !text(result.selectedTitle) || !text(result.selectedTitle_zh)) {
      die(`${path}: selected column ${result.id} requires selected item and bilingual title`)
    }
  }
}

function validateSignal(signal, path, registry) {
  if (!text(signal.id) || !PIPELINE_IDS.includes(signal.pipeline)) die(`${path}: invalid signal identity`)
  if (!COLUMN_IDS.includes(signal.primaryColumn)) die(`${path}: invalid signal primaryColumn`)
  if (!Array.isArray(signal.secondaryColumns)) die(`${path}: secondaryColumns must be an array`)
  if (signal.secondaryColumns.includes(signal.primaryColumn)) die(`${path}: primaryColumn repeated as secondary`)
  if (!text(signal.title) || !text(signal.sourceUrl) || !/^https:\/\//.test(signal.sourceUrl)) {
    die(`${path}: signal requires title and canonical sourceUrl`)
  }
  if (!(registry.evidenceLevels || []).includes(signal.evidenceLevel)) die(`${path}: invalid evidenceLevel`)
  if (!['signal', 'candidate', 'selected', 'rejected'].includes(signal.triageStatus)) {
    die(`${path}: invalid signal triageStatus`)
  }
}

function validateRun(run, path, registry) {
  if (run.schema !== 'research-intelligence-run/v1') die(`${path}: invalid schema`)
  if (run.version !== '1.0' || run.registryVersion !== registry.version) die(`${path}: invalid version`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(run.date || '')) die(`${path}: invalid date`)
  if (run.timezone !== registry.timezone) die(`${path}: invalid timezone`)
  if (!STATUSES.has(run.status)) die(`${path}: invalid status ${run.status}`)
  if (!Array.isArray(run.pipelines) || run.pipelines.length !== 3) die(`${path}: exactly three pipelines are required`)
  if (JSON.stringify(run.pipelines.map((item) => item.id)) !== JSON.stringify(PIPELINE_IDS)) {
    die(`${path}: pipeline order must be ${PIPELINE_IDS.join(', ')}`)
  }
  run.pipelines.forEach((result) => validatePipeline(result, path))

  if (!Array.isArray(run.columns) || run.columns.length !== 3) die(`${path}: exactly three columns are required`)
  if (JSON.stringify(run.columns.map((item) => item.id)) !== JSON.stringify(COLUMN_IDS)) {
    die(`${path}: column order must be ${COLUMN_IDS.join(', ')}`)
  }
  run.columns.forEach((result) => validateColumn(result, path))

  if (!Array.isArray(run.signals)) die(`${path}: signals must be an array`)
  run.signals.forEach((signal) => validateSignal(signal, path, registry))
  if (new Set(run.signals.map((signal) => signal.id)).size !== run.signals.length) {
    die(`${path}: duplicate signal ids`)
  }

  if (run.status === 'Completed') {
    if (!run.pipelines.every((pipeline) => pipeline.status === 'Completed')) {
      die(`${path}: completed run requires all pipelines Completed`)
    }
    if (!run.columns.every((column) => ['Selected', 'No Selection'].includes(column.decision))) {
      die(`${path}: completed run requires a decision for all three columns`)
    }
  }
  if (EFFECTIVE_TERMINAL.has(run.status) && run.status !== 'Completed' && !text(run.reason)) {
    die(`${path}: terminal run requires reason`)
  }
  return run
}

function loadRuns(registry) {
  return walk(RUN_ROOT)
    .filter((path) => /\d{4}-\d{2}-\d{2}-intelligence\.json$/.test(path))
    .sort()
    .map((path) => validateRun(readJson(path), relativePath(path), registry))
}

function validatePlanLink(runs, registry) {
  const byDate = new Map(runs.map((run) => [run.date, run]))
  for (const path of walk(PLAN_ROOT).filter((item) => /\d{4}-\d{2}-\d{2}-plan\.json$/.test(item))) {
    const plan = readJson(path)
    if (plan.date < registry.effectiveDate || plan.status !== 'Completed') continue
    const run = byDate.get(plan.date)
    if (!run || run.status !== 'Completed') {
      die(`${relativePath(path)}: completed Queue plan requires a completed Research Intelligence run`)
    }
    const decisions = Object.fromEntries(run.columns.map((column) => [column.id, column]))
    for (const column of plan.columns || []) {
      const decision = decisions[column.id]
      if (!decision) die(`${relativePath(path)}: missing intelligence decision for ${column.id}`)
      const planSelected = column.selectionStatus !== 'No Selection'
      const intelligenceSelected = decision.decision === 'Selected'
      if (planSelected !== intelligenceSelected) {
        die(`${relativePath(path)}: Queue plan and intelligence decision disagree for ${column.id}`)
      }
      if (planSelected && column.itemId !== decision.selectedItemId) {
        die(`${relativePath(path)}: selected item mismatch for ${column.id}`)
      }
    }
  }
}

function validate() {
  const registry = validateRegistry(readJson(REGISTRY_PATH))
  const runs = loadRuns(registry)
  validatePlanLink(runs, registry)
  console.log(`Research Intelligence validation passed: ${registry.pipelines.length} pipelines, ${runs.length} run(s).`)
  return { registry, runs }
}

function initialize(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) die('initialize requires --date YYYY-MM-DD')
  const registry = validateRegistry(readJson(REGISTRY_PATH))
  const path = datePath(RUN_ROOT, date, 'intelligence')
  if (!existsSync(path)) writeJson(path, defaultRun(date, registry))
  validate()
  console.log(`Initialized ${relativePath(path)}.`)
}

function currentDate(timezone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date()).map((part) => [part.type, part.value]))
  return `${parts.year}-${parts.month}-${parts.day}`
}

function build() {
  const { registry, runs } = validate()
  const today = currentDate(registry.timezone)
  const runByDate = Object.fromEntries(runs.map((run) => [run.date, run]))
  const payload = {
    schema: 'research-intelligence-center-data/v1',
    generatedAt: new Date().toISOString(),
    today,
    timezone: registry.timezone,
    registryVersion: registry.version,
    effectiveDate: registry.effectiveDate,
    registryPath: relativePath(REGISTRY_PATH),
    columns: registry.columns,
    pipelines: registry.pipelines.map((pipeline) => ({
      id: pipeline.id,
      name: pipeline.name,
      name_zh: pipeline.name_zh,
      skill: pipeline.skill,
      due: dueCount(pipeline)
    })),
    currentRunRecorded: Boolean(runByDate[today]),
    currentRun: runByDate[today] || defaultRun(today, registry),
    runs: runByDate
  }
  writeJson(GENERATED_PATH, payload)
  console.log(`Generated ${relativePath(GENERATED_PATH)}.`)
}

const args = argsOf(process.argv.slice(2))
const command = args._[0] || 'build'
try {
  if (command === 'validate') validate()
  else if (command === 'initialize') initialize(args.date)
  else if (command === 'build') build()
  else die(`unknown command ${command}`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
