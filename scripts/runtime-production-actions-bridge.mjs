#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOT = process.cwd()
const PROMPT_PATH = 'research/runtime/worker-prompts/generated/production.prompt.md'
const REQUEST_SCHEMA = 'runtime-production-action-request/v1'

function fail(message) {
  throw new Error(`Production Actions Bridge: ${message}`)
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

function readJson(root, relative) {
  return JSON.parse(readFileSync(absolute(root, relative), 'utf8'))
}

function writeJson(root, relative, value) {
  const target = absolute(root, relative)
  mkdirSync(path.dirname(target), { recursive: true })
  writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`)
}

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex')
}

function nowShanghai() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date()).map((part) => [part.type, part.value]))
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+08:00`
}

function validateBase(request) {
  if (request.schema !== REQUEST_SCHEMA) fail(`schema must be ${REQUEST_SCHEMA}`)
  if (!['materialize-item', 'stage-batch'].includes(request.mode)) fail(`unsupported mode ${request.mode || '(missing)'}`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(request.date || '')) fail('date must be YYYY-MM-DD')
  if (request.timezone !== 'Asia/Shanghai') fail('timezone must be Asia/Shanghai')
  if (request.task !== 'production') fail('task must be production')
  if (!/^[0-9a-f]{40}$/.test(request.sourceCommit || '')) fail('sourceCommit must be a full commit SHA')
  if (request.promptIdentity?.path !== PROMPT_PATH) fail('authoritative Production prompt path is required')
  if (!String(request.promptIdentity?.version || '').trim()) fail('promptIdentity.version is required')
  if (!/^[0-9a-f]{64}$/.test(request.promptIdentity?.sha256 || '')) fail('promptIdentity.sha256 must be SHA-256')
}

function checkpointPath(date) {
  const [year, month] = date.split('-')
  return `research/runtime/checkpoints/${year}/${month}/${date}-production.json`
}

function assertItemPath(date, itemId, field, value) {
  const prefix = `research/runtime/production-work/${date.replaceAll('-', '/')}/${itemId}/`
  const normalized = repoPath(value)
  if (!normalized.startsWith(prefix)) fail(`${field} must stay under ${prefix}`)
  return normalized
}

function assertPlanning(root, relative, schema, date, itemId, label) {
  if (!existsSync(absolute(root, relative))) fail(`${label} is missing: ${relative}`)
  const value = readJson(root, relative)
  if (value.schema !== schema || value.date !== date || value.itemId !== itemId) {
    fail(`${label} must be ${schema} for ${date} ${itemId}`)
  }
}

function initialCheckpoint(request) {
  return {
    schema: 'runtime-production-checkpoint/v2',
    runDate: request.date,
    node: 'article-progress-persisted',
    status: 'Running',
    promptIdentity: request.promptIdentity,
    items: request.orderedItemIds.map((itemId) => ({ itemId, status: 'Waiting' })),
    nextItemId: request.orderedItemIds[0],
    sourceCommit: request.sourceCommit,
    updatedAt: nowShanghai()
  }
}

function validateOrderedIds(request) {
  const expectedDate = request.date.replaceAll('-', '')
  if (!Array.isArray(request.orderedItemIds) || request.orderedItemIds.length < 1 || request.orderedItemIds.length > 3) {
    fail('orderedItemIds must contain one to three items')
  }
  if (new Set(request.orderedItemIds).size !== request.orderedItemIds.length) fail('orderedItemIds must be unique')
  for (const itemId of request.orderedItemIds) {
    if (!new RegExp(`^Q-${expectedDate}-\\d{2}$`).test(itemId)) fail(`itemId does not match request date: ${itemId}`)
  }
}

export function materializeItem({ root = ROOT, request }) {
  validateBase(request)
  if (request.mode !== 'materialize-item') fail('materializeItem requires mode=materialize-item')
  validateOrderedIds(request)
  const item = request.item || {}
  if (!request.orderedItemIds.includes(item.itemId)) fail('item.itemId must appear in orderedItemIds')
  if (!String(item.column || '').trim() || !String(item.title || '').trim()) fail('item column and English title are required')

  const pathFields = [
    'articleBriefPath', 'argumentArchitecturePath', 'figurePlanPath',
    'zhDraftPath', 'enDraftPath', 'baselineCoverPath'
  ]
  for (const field of pathFields) item[field] = assertItemPath(request.date, item.itemId, field, item[field])
  assertPlanning(root, item.articleBriefPath, 'article-brief/v1', request.date, item.itemId, 'Article Brief')
  assertPlanning(root, item.argumentArchitecturePath, 'argument-architecture/v1', request.date, item.itemId, 'Argument Architecture')
  assertPlanning(root, item.figurePlanPath, 'article-figure-plan/v1', request.date, item.itemId, 'Figure Plan')
  for (const field of ['zhDraftPath', 'enDraftPath']) {
    const file = absolute(root, item[field])
    if (!existsSync(file) || readFileSync(file, 'utf8').trim().length < 200) fail(`${field} must contain a substantive draft`)
  }

  const generator = path.join(root, 'scripts/generate-baseline-cover.mjs')
  const generated = spawnSync(process.execPath, [generator,
    '--output', absolute(root, item.baselineCoverPath),
    '--item', item.itemId,
    '--column', item.column,
    '--title', item.title
  ], { cwd: root, encoding: 'utf8' })
  if (generated.status !== 0) fail(`baseline generator failed: ${generated.stderr || generated.stdout}`)

  const checkpointRelative = checkpointPath(request.date)
  let checkpoint
  if (existsSync(absolute(root, checkpointRelative))) {
    checkpoint = readJson(root, checkpointRelative)
    if (checkpoint.schema !== 'runtime-production-checkpoint/v2' || checkpoint.runDate !== request.date) fail('existing checkpoint is incompatible')
    if (JSON.stringify(checkpoint.promptIdentity) !== JSON.stringify(request.promptIdentity)) fail('existing checkpoint prompt identity is stale')
    const existingIds = checkpoint.items.map((entry) => entry.itemId)
    if (JSON.stringify(existingIds) !== JSON.stringify(request.orderedItemIds)) fail('existing checkpoint item order differs from request')
  } else {
    checkpoint = initialCheckpoint(request)
  }

  const hashes = Object.fromEntries(pathFields.map((field) => {
    const relative = item[field]
    return [relative, sha256(absolute(root, relative))]
  }))
  const ready = {
    itemId: item.itemId,
    status: 'Ready',
    articleBriefPath: item.articleBriefPath,
    argumentArchitecturePath: item.argumentArchitecturePath,
    figurePlanPath: item.figurePlanPath,
    zhDraftPath: item.zhDraftPath,
    enDraftPath: item.enDraftPath,
    baselineCoverPath: item.baselineCoverPath,
    artifactHashes: hashes,
    persistedAt: nowShanghai()
  }
  checkpoint.items = checkpoint.items.map((entry) => entry.itemId === item.itemId ? ready : entry)
  checkpoint.nextItemId = checkpoint.items.find((entry) => entry.status !== 'Ready')?.itemId || null
  checkpoint.node = 'article-progress-persisted'
  checkpoint.status = 'Running'
  checkpoint.sourceCommit = request.sourceCommit
  checkpoint.updatedAt = nowShanghai()
  writeJson(root, checkpointRelative, checkpoint)
  return { checkpoint: checkpointRelative, itemId: item.itemId, nextItemId: checkpoint.nextItemId }
}

function assertCanonicalTarget(value, prefix, label) {
  const normalized = repoPath(value)
  if (!normalized.startsWith(prefix)) fail(`${label} must stay under ${prefix}`)
  return normalized
}

export function stageBatch({ root = ROOT, request }) {
  validateBase(request)
  if (request.mode !== 'stage-batch') fail('stageBatch requires mode=stage-batch')
  const workPrefix = `research/runtime/production-work/${request.date.replaceAll('-', '/')}/`
  const source = assertCanonicalTarget(request.candidateBatchSource, workPrefix, 'candidateBatchSource')
  const [year, month] = request.date.split('-')
  const expectedTarget = `research/runtime/candidates/${year}/${month}/${request.date}-candidates.json`
  if (repoPath(request.candidateBatchTarget) !== expectedTarget) fail(`candidateBatchTarget must be ${expectedTarget}`)

  const checkpointRelative = checkpointPath(request.date)
  if (!existsSync(absolute(root, checkpointRelative))) fail('same-date checkpoint is missing')
  const checkpoint = readJson(root, checkpointRelative)
  if (checkpoint.schema !== 'runtime-production-checkpoint/v2' || checkpoint.runDate !== request.date) fail('checkpoint is incompatible')
  if (JSON.stringify(checkpoint.promptIdentity) !== JSON.stringify(request.promptIdentity)) fail('checkpoint prompt identity is stale')
  if (!checkpoint.items.length || checkpoint.items.some((entry) => entry.status !== 'Ready')) fail('every checkpoint item must be Ready')

  const batch = readJson(root, source)
  if (batch.schema !== 'runtime-publication-candidate/v2' || batch.date !== request.date || batch.status !== 'Completed') {
    fail('candidate batch source must be a completed same-date runtime-publication-candidate/v2')
  }
  if (!Array.isArray(batch.candidates) || batch.candidates.length !== checkpoint.items.length) fail('candidate count must match checkpoint item count')
  const candidateIds = batch.candidates.map((candidate) => candidate.itemId)
  const checkpointIds = checkpoint.items.map((entry) => entry.itemId)
  if (JSON.stringify(candidateIds) !== JSON.stringify(checkpointIds)) fail('candidate order must match checkpoint order')

  const artifacts = [request.candidateBatchTarget]
  for (const candidate of batch.candidates) {
    const item = checkpoint.items.find((entry) => entry.itemId === candidate.itemId)
    const zhTarget = assertCanonicalTarget(candidate.zhPath, 'staging/publication-candidates/', `${candidate.itemId}.zhPath`)
    const enTarget = assertCanonicalTarget(candidate.enPath, 'staging/publication-candidates/', `${candidate.itemId}.enPath`)
    const coverTarget = assertCanonicalTarget(candidate.coverPath, 'staging/publication-candidates/', `${candidate.itemId}.coverPath`)
    if (!zhTarget.endsWith('.zh.md') || !enTarget.endsWith('.en.md') || !coverTarget.endsWith('.png')) fail(`${candidate.itemId}: invalid canonical extensions`)
    for (const [sourcePath, targetPath] of [[item.zhDraftPath, zhTarget], [item.enDraftPath, enTarget], [item.baselineCoverPath, coverTarget]]) {
      const target = absolute(root, targetPath)
      mkdirSync(path.dirname(target), { recursive: true })
      copyFileSync(absolute(root, sourcePath), target)
      artifacts.push(targetPath)
    }
  }
  writeJson(root, request.candidateBatchTarget, batch)
  checkpoint.node = 'candidate-bundle-staged'
  checkpoint.status = 'Running'
  checkpoint.nextItemId = null
  checkpoint.artifacts = artifacts
  checkpoint.updatedAt = nowShanghai()
  writeJson(root, checkpointRelative, checkpoint)
  return { checkpoint: checkpointRelative, candidates: batch.candidates.length, artifacts }
}

export function markValidated({ root = ROOT, date }) {
  const relative = checkpointPath(date)
  const checkpoint = readJson(root, relative)
  if (checkpoint.schema !== 'runtime-production-checkpoint/v2' || checkpoint.runDate !== date) fail('checkpoint is incompatible')
  if (checkpoint.node !== 'candidate-bundle-staged' || checkpoint.items.some((entry) => entry.status !== 'Ready')) {
    fail('only a completely staged batch may become validators-passed')
  }
  checkpoint.node = 'validators-passed'
  checkpoint.status = 'Completed'
  checkpoint.updatedAt = nowShanghai()
  writeJson(root, relative, checkpoint)
  return { checkpoint: relative, node: checkpoint.node }
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
  if (args.request) {
    const request = readJson(ROOT, args.request)
    const result = request.mode === 'materialize-item'
      ? materializeItem({ root: ROOT, request })
      : stageBatch({ root: ROOT, request })
    console.log(JSON.stringify(result))
  } else if (args['mark-validated'] && args.date) {
    console.log(JSON.stringify(markValidated({ root: ROOT, date: args.date })))
  } else {
    fail('use --request <path> or --mark-validated true --date <YYYY-MM-DD>')
  }
}
