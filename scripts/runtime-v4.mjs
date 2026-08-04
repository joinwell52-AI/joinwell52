#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const MANIFEST_PATH = join(ROOT, 'research/runtime/SCHEDULER.json')
const GENERATED_PATH = join(ROOT, 'docs/.vitepress/generated/runtime-records.json')
const PLAN_ROOT = join(ROOT, 'research/runtime/plans')
const CANDIDATE_ROOT = join(ROOT, 'research/runtime/candidates')
const PLAN_STATUSES = new Set(['Waiting', 'Selected', 'Researching', 'No Selection', 'Publication Candidate', 'Released'])
const RUNTIME_STATUSES = new Set(['Running', 'Completed', 'Blocked', 'Failed', 'Skipped', 'Waiting'])

function die(message) {
  throw new Error(`Runtime V4: ${message}`)
}

function readJson(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')) }
  catch (error) { die(`${relative(ROOT, path)} is invalid JSON: ${error.message}`) }
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

function datePath(root, date, suffix) {
  const [year, month] = date.split('-')
  return join(root, year, month, `${date}-${suffix}.json`)
}

function relativePath(path) {
  return relative(ROOT, path).split(sep).join('/')
}

function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function validateManifest(manifest) {
  if (manifest.schema !== 'research-runtime-scheduler/v2') die('scheduler schema must be research-runtime-scheduler/v2')
  if (manifest.version !== '2.0') die('scheduler version must be 2.0')
  if (manifest.operationsCenterVersion !== '4.0') die('operationsCenterVersion must be 4.0')
  if (manifest.columnPlanContract !== 'runtime-column-plan/v1') die('invalid columnPlanContract')
  if (manifest.publicationCandidateContract !== 'runtime-publication-candidate/v1') die('invalid publicationCandidateContract')
  if (!Array.isArray(manifest.columns) || manifest.columns.length !== 3) die('exactly three research columns are required')
}

function validatePlan(plan, path, manifest) {
  if (plan.schema !== manifest.columnPlanContract) die(`${path}: invalid schema`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(plan.date || '')) die(`${path}: invalid date`)
  if (plan.timezone !== manifest.timezone) die(`${path}: invalid timezone`)
  if (!RUNTIME_STATUSES.has(plan.status)) die(`${path}: invalid status ${plan.status}`)
  if (!text(plan.sourceTask) || !text(plan.sourceRecord)) die(`${path}: sourceTask and sourceRecord are required`)
  if (!Array.isArray(plan.columns) || plan.columns.length !== 3) die(`${path}: exactly three column entries are required`)

  const expected = manifest.columns.map((column) => column.id)
  const actual = plan.columns.map((column) => column.id)
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    die(`${path}: column order must be ${expected.join(', ')}`)
  }

  for (const column of plan.columns) {
    if (!PLAN_STATUSES.has(column.selectionStatus)) die(`${path}: invalid selectionStatus ${column.selectionStatus}`)
    for (const key of ['label', 'label_zh', 'reason', 'reason_zh', 'next', 'next_zh']) {
      if (!text(column[key])) die(`${path}: ${column.id} missing ${key}`)
    }
    if (column.selectionStatus !== 'Waiting' && column.selectionStatus !== 'No Selection') {
      for (const key of ['itemId', 'title', 'title_zh', 'priority', 'lifecycle', 'source', 'source_zh']) {
        if (!text(column[key])) die(`${path}: selected column ${column.id} missing ${key}`)
      }
    }
  }
  return plan
}

function validateCandidate(candidate, path, manifest) {
  if (candidate.schema !== manifest.publicationCandidateContract) die(`${path}: invalid schema`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate.date || '')) die(`${path}: invalid date`)
  if (candidate.timezone !== manifest.timezone) die(`${path}: invalid timezone`)
  if (!RUNTIME_STATUSES.has(candidate.status)) die(`${path}: invalid status ${candidate.status}`)
  if (!text(candidate.sourceTask) || !text(candidate.sourceRecord)) die(`${path}: sourceTask and sourceRecord are required`)
  if (!Array.isArray(candidate.candidates)) die(`${path}: candidates must be an array`)

  const columnIds = new Set(manifest.columns.map((column) => column.id))
  for (const item of candidate.candidates) {
    if (!columnIds.has(item.column)) die(`${path}: invalid candidate column ${item.column}`)
    for (const key of ['itemId', 'title', 'title_zh', 'zhPath', 'enPath', 'lifecycle', 'evidenceStatus', 'editingStatus']) {
      if (!text(item[key])) die(`${path}: candidate missing ${key}`)
    }
    if (item.lifecycle !== 'Publication Candidate') die(`${path}: candidate lifecycle must be Publication Candidate`)
  }
  if (candidate.status === 'Completed' && !candidate.candidates.length) {
    die(`${path}: Completed production requires at least one Publication Candidate`)
  }
  if (candidate.status === 'Skipped' && (!text(candidate.reason) || !text(candidate.reason_zh))) {
    die(`${path}: Skipped production requires bilingual reason`)
  }
  return candidate
}

function loadPlans(manifest) {
  return walk(PLAN_ROOT)
    .filter((path) => /\d{4}-\d{2}-\d{2}-plan\.json$/.test(path))
    .sort()
    .map((path) => validatePlan(readJson(path), relativePath(path), manifest))
}

function loadCandidates(manifest) {
  return walk(CANDIDATE_ROOT)
    .filter((path) => /\d{4}-\d{2}-\d{2}-candidates\.json$/.test(path))
    .sort()
    .map((path) => validateCandidate(readJson(path), relativePath(path), manifest))
}

function defaultPlan(date, manifest) {
  return {
    schema: manifest.columnPlanContract,
    date,
    timezone: manifest.timezone,
    status: 'Waiting',
    sourceTask: 'Research Runtime Queue',
    sourceRecord: `research/runtime/${date.slice(0, 4)}/${date.slice(5, 7)}/${date}-runtime.md`,
    updatedAt: '',
    githubCommit: 'pending',
    columns: manifest.columns.map((column) => ({
      id: column.id,
      label: column.name,
      label_zh: column.name_zh,
      selectionStatus: 'Waiting',
      itemId: '',
      title: 'Waiting for Queue selection',
      title_zh: '等待队列选题',
      priority: '',
      lifecycle: 'Queue',
      source: '',
      source_zh: '',
      reason: 'The 10:00 Queue task has not submitted a column decision.',
      reason_zh: '10:00 队列任务尚未提交该栏目的选题决定。',
      next: 'Wait for Research Runtime Queue.',
      next_zh: '等待研究运行队列执行。'
    }))
  }
}

function defaultCandidates(date, manifest) {
  return {
    schema: manifest.publicationCandidateContract,
    date,
    timezone: manifest.timezone,
    status: 'Waiting',
    sourceTask: 'Research Runtime Production',
    sourceRecord: `research/runtime/${date.slice(0, 4)}/${date.slice(5, 7)}/${date}-runtime.md`,
    updatedAt: '',
    githubCommit: 'pending',
    reason: 'The 15:00 Production task has not run.',
    reason_zh: '15:00 生产任务尚未执行。',
    candidates: []
  }
}

function initialize(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) die('initialize requires --date YYYY-MM-DD')
  const manifest = readJson(MANIFEST_PATH)
  validateManifest(manifest)
  const plan = datePath(PLAN_ROOT, date, 'plan')
  const candidate = datePath(CANDIDATE_ROOT, date, 'candidates')
  mkdirSync(dirname(plan), { recursive: true })
  mkdirSync(dirname(candidate), { recursive: true })
  if (!existsSync(plan)) writeFileSync(plan, `${JSON.stringify(defaultPlan(date, manifest), null, 2)}\n`)
  if (!existsSync(candidate)) writeFileSync(candidate, `${JSON.stringify(defaultCandidates(date, manifest), null, 2)}\n`)
  validate()
  console.log(`Initialized V4 plan and candidate artifacts for ${date}.`)
}

function validate() {
  const manifest = readJson(MANIFEST_PATH)
  validateManifest(manifest)
  const plans = loadPlans(manifest)
  const candidates = loadCandidates(manifest)
  console.log(`Runtime V4 validation passed: ${plans.length} plan(s), ${candidates.length} candidate batch(es).`)
  return { manifest, plans, candidates }
}

function build() {
  const { manifest, plans, candidates } = validate()
  if (!existsSync(GENERATED_PATH)) die('runtime-records.json is missing; run runtime-center and runtime-results build first')
  const generated = readJson(GENERATED_PATH)
  const plansByDate = Object.fromEntries(plans.map((plan) => [plan.date, plan]))
  const candidatesByDate = Object.fromEntries(candidates.map((candidate) => [candidate.date, candidate]))
  generated.operationsCenterVersion = manifest.operationsCenterVersion
  generated.columnPlanContract = manifest.columnPlanContract
  generated.publicationCandidateContract = manifest.publicationCandidateContract
  generated.columns = manifest.columns
  generated.dailyPlan = plansByDate[generated.today] || defaultPlan(generated.today, manifest)
  generated.publicationCandidates = candidatesByDate[generated.today] || defaultCandidates(generated.today, manifest)
  generated.plans = plansByDate
  generated.candidateBatches = candidatesByDate
  writeFileSync(GENERATED_PATH, `${JSON.stringify(generated, null, 2)}\n`)
  console.log(`Injected V4 column plan and Publication Candidates into ${relativePath(GENERATED_PATH)}.`)
}

const args = argsOf(process.argv.slice(2))
const command = args._[0] || 'build'
try {
  if (command === 'initialize') initialize(args.date)
  else if (command === 'validate') validate()
  else if (command === 'build') build()
  else die(`unknown command ${command}`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
