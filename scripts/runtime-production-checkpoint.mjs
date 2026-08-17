#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const READY_PATH_FIELDS = [
  'articleBriefPath',
  'argumentArchitecturePath',
  'figurePlanPath',
  'zhDraftPath',
  'enDraftPath',
  'baselineCoverPath'
]
const ITEM_STATUSES = new Set(['Waiting', 'Planning', 'Ready'])

function fail(message) {
  throw new Error(`Runtime production checkpoint: ${message}`)
}

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'))
}

function repoPath(value) {
  return String(value || '').replaceAll('\\', '/')
}

function absolute(root, value) {
  const normalized = repoPath(value)
  if (!normalized || normalized.startsWith('/') || normalized.startsWith('../') || normalized.includes('://')) {
    fail(`path must be repository-relative: ${value || '(empty)'}`)
  }
  const resolved = path.resolve(root, normalized)
  if (repoPath(path.relative(root, resolved)).startsWith('../')) fail(`path escapes repository: ${value}`)
  return resolved
}

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex')
}

function assertRaster(file, relative) {
  const bytes = readFileSync(file)
  const png = bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  if (path.extname(relative).toLowerCase() !== '.png' || !png) fail(`${relative} must be a real PNG`)
}

function assertPlanningArtifact(file, schema, date, itemId, label) {
  const value = readJson(file)
  if (value.schema !== schema) fail(`${label} schema must be ${schema}`)
  if (value.date !== date || value.itemId !== itemId) fail(`${label} must match ${date} and ${itemId}`)
}

export function validateProductionCheckpoint({ root = process.cwd(), checkpoint, date }) {
  if (checkpoint?.schema !== 'runtime-production-checkpoint/v2') fail('schema must be runtime-production-checkpoint/v2')
  if (checkpoint.runDate !== date) fail(`runDate must be ${date}`)
  if (!['Running', 'Completed', 'Blocked', 'Failed'].includes(checkpoint.status)) fail(`invalid status ${checkpoint.status}`)
  if (!checkpoint.promptIdentity || checkpoint.promptIdentity.path !== 'research/runtime/worker-prompts/generated/production.prompt.md') {
    fail('authoritative Production prompt identity is required')
  }
  if (!String(checkpoint.promptIdentity.version || '').trim() || !/^[0-9a-f]{64}$/.test(checkpoint.promptIdentity.sha256 || '')) {
    fail('Production prompt version and SHA-256 are required')
  }
  if (!/^[0-9a-f]{40}$/.test(checkpoint.sourceCommit || '')) fail('sourceCommit must be a full commit SHA')
  if (!Array.isArray(checkpoint.items) || checkpoint.items.length === 0) fail('items must not be empty')

  const ids = new Set()
  let firstIncomplete = null
  for (const item of checkpoint.items) {
    if (!/^Q-\d{8}-\d{2}$/.test(item.itemId || '')) fail(`invalid itemId ${item.itemId || '(missing)'}`)
    if (ids.has(item.itemId)) fail(`duplicate itemId ${item.itemId}`)
    ids.add(item.itemId)
    if (!ITEM_STATUSES.has(item.status)) fail(`${item.itemId}: invalid status ${item.status}`)
    if (item.status !== 'Ready') {
      firstIncomplete ??= item.itemId
      continue
    }

    const prefix = `research/runtime/production-work/${date.replaceAll('-', '/')}/${item.itemId}/`
    for (const field of READY_PATH_FIELDS) {
      const relative = repoPath(item[field])
      if (!relative.startsWith(prefix)) fail(`${item.itemId}.${field} must stay under ${prefix}`)
      const file = absolute(root, relative)
      if (!existsSync(file)) fail(`${item.itemId}.${field} is missing: ${relative}`)
      if (item.artifactHashes?.[relative] !== sha256(file)) fail(`${item.itemId}.${field} SHA-256 mismatch`)
    }
    assertPlanningArtifact(absolute(root, item.articleBriefPath), 'article-brief/v1', date, item.itemId, `${item.itemId} Article Brief`)
    assertPlanningArtifact(absolute(root, item.argumentArchitecturePath), 'argument-architecture/v1', date, item.itemId, `${item.itemId} Argument Architecture`)
    assertPlanningArtifact(absolute(root, item.figurePlanPath), 'article-figure-plan/v1', date, item.itemId, `${item.itemId} Figure Plan`)
    assertRaster(absolute(root, item.baselineCoverPath), item.baselineCoverPath)
  }

  if ((checkpoint.nextItemId || null) !== firstIncomplete) {
    fail(`nextItemId must be ${firstIncomplete || 'null'}`)
  }
  if (checkpoint.status === 'Completed' && firstIncomplete) fail('Completed checkpoint cannot contain incomplete items')
  return { items: checkpoint.items.length, ready: checkpoint.items.filter((item) => item.status === 'Ready').length, nextItemId: firstIncomplete }
}

function argsOf(argv) {
  const args = {}
  for (let index = 2; index < argv.length; index += 1) {
    if (!argv[index].startsWith('--')) continue
    args[argv[index].slice(2)] = argv[index + 1]
    index += 1
  }
  return args
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const args = argsOf(process.argv)
  if (!args.checkpoint || !args.date) fail('--checkpoint <json-file> and --date <YYYY-MM-DD> are required')
  const summary = validateProductionCheckpoint({
    root: process.cwd(),
    checkpoint: readJson(absolute(process.cwd(), args.checkpoint)),
    date: args.date
  })
  console.log(`Runtime production checkpoint passed: ${JSON.stringify(summary)}`)
}
