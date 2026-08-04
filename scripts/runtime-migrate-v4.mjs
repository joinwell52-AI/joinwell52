#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const MANIFEST_PATH = join(ROOT, 'research/runtime/SCHEDULER.json')

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function clock(timezone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date()).map((part) => [part.type, part.value]))
  return `${parts.year}-${parts.month}-${parts.day}`
}

function upsert(lines, key, value, afterKey) {
  const next = `${key}: ${JSON.stringify(String(value))}`
  const index = lines.findIndex((line) => line.startsWith(`${key}:`))
  if (index >= 0) {
    lines[index] = next
    return
  }
  const after = lines.findIndex((line) => line.startsWith(`${afterKey}:`))
  lines.splice(after >= 0 ? after + 1 : lines.length, 0, next)
}

const manifest = readJson(MANIFEST_PATH)
const date = clock(manifest.timezone)
if (date < manifest.effectiveDate) {
  console.log(`Runtime V4 migration not active before ${manifest.effectiveDate}.`)
  process.exit(0)
}

const [year, month] = date.split('-')
const recordPath = join(ROOT, `research/runtime/${year}/${month}/${date}-runtime.md`)
if (!existsSync(recordPath)) {
  console.log(`No current Runtime Record at ${recordPath}; migration deferred to Scheduler.`)
  process.exit(0)
}

const normalized = readFileSync(recordPath, 'utf8').replace(/\r\n/g, '\n')
const end = normalized.indexOf('\n---\n', 4)
if (!normalized.startsWith('---\n') || end < 0) {
  throw new Error(`Invalid Runtime Record frontmatter: ${recordPath}`)
}

const lines = normalized.slice(4, end).split('\n')
upsert(lines, 'runtime_version', manifest.version, 'schema')
upsert(lines, 'center_version', manifest.centerVersion, 'runtime_version')
upsert(lines, 'result_contract', manifest.resultContract, 'center_version')
upsert(lines, 'plan_contract', manifest.columnPlanContract, 'result_contract')
upsert(lines, 'plan_path', `research/runtime/plans/${year}/${month}/${date}-plan.json`, 'plan_contract')
upsert(lines, 'candidate_contract', manifest.publicationCandidateContract, 'plan_path')
upsert(lines, 'candidate_path', `research/runtime/candidates/${year}/${month}/${date}-candidates.json`, 'candidate_contract')

const activeIds = new Set(manifest.tasks
  .filter((task) => {
    if (task.introduced > date) return false
    if (task.schedule.kind === 'daily') return true
    const weekday = new Intl.DateTimeFormat('en-US', {
      timeZone: manifest.timezone,
      weekday: 'long'
    }).format(new Date(`${date}T04:00:00.000Z`))
    return (task.schedule.days || []).includes(weekday)
  })
  .map((task) => task.id))

for (const task of manifest.tasks.filter((task) => task.introduced <= date)) {
  const key = `task_${task.id}`
  const existing = lines.findIndex((line) => line.startsWith(`${key}:`))
  if (existing >= 0) continue
  const anchorIndex = manifest.tasks.findIndex((item) => item.id === task.id)
  const previous = manifest.tasks.slice(0, anchorIndex).reverse()
    .find((item) => lines.some((line) => line.startsWith(`task_${item.id}:`)))
  upsert(lines, key, activeIds.has(task.id) ? 'Waiting' : 'Skipped', previous ? `task_${previous.id}` : 'output')
}

const upgraded = `---\n${lines.join('\n')}\n---\n${normalized.slice(end + 5)}`
if (upgraded !== normalized) {
  writeFileSync(recordPath, upgraded)
  console.log(`Upgraded current Runtime Record to Scheduler ${manifest.version} / Operations Center ${manifest.operationsCenterVersion}.`)
} else {
  console.log('Current Runtime Record already uses Runtime V4 fields.')
}
