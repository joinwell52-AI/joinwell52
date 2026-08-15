#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const RASTER = new Set(['.png', '.jpg', '.jpeg', '.webp'])
const CONTAMINATION = /\b(?:runtime|recovery|checkpoint|github|worker|control|status|completed|blocked|dashboard|report|table|ui|admin|workflow|logo|text|agent network|node diagram|no|without|avoid|exclude|forbid)\b|执行报告|运行控制|仪表盘|状态看板|不要|禁止|排除|避免|无文字|无标志/i

function fail(message) {
  throw new Error(`Production cover finalization: ${message}`)
}

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'))
}

function writeJson(file, value) {
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function sha(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex')
}

function repo(value) {
  return String(value || '').replaceAll('\\', '/')
}

function absolute(value) {
  const normalized = repo(value)
  if (!normalized || normalized.startsWith('/') || normalized.startsWith('../') || normalized.includes('://')) {
    fail(`invalid repository path ${value}`)
  }
  const resolved = path.resolve(ROOT, normalized)
  if (repo(path.relative(ROOT, resolved)).startsWith('../')) fail(`path escapes repository ${value}`)
  return resolved
}

function ensureParent(file) {
  mkdirSync(path.dirname(file), { recursive: true })
}

function copy(source, target) {
  ensureParent(target)
  copyFileSync(source, target)
}

function argsOf(argv) {
  const out = {}
  for (let index = 2; index < argv.length; index += 1) {
    if (!argv[index].startsWith('--')) continue
    out[argv[index].slice(2)] = argv[index + 1]
    index += 1
  }
  return out
}

function assertRaster(file, relative) {
  if (!RASTER.has(path.extname(relative).toLowerCase())) fail(`${relative} is not an allowed raster extension`)
  const bytes = readFileSync(file)
  const png = bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  const jpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  const webp = bytes.length >= 12 && bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP'
  if (!png && !jpeg && !webp) fail(`${relative} is not a real PNG/JPEG/WebP`)
}

function frontmatter(markdown, key) {
  const body = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || ''
  const match = body.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  return (match?.[1] || '').trim().replace(/^['"]|['"]$/g, '')
}

const args = argsOf(process.argv)
const date = String(args.date || '')
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail('--date YYYY-MM-DD is required')

const [year, month, day] = date.split('-')
const workRoot = `research/runtime/production-work/${year}/${month}/${day}`
const preparedPath = `${workRoot}/prepared-bundle.json`
if (!existsSync(absolute(preparedPath))) {
  console.log(`No prepared bundle for ${date}; nothing to finalize.`)
  process.exit(0)
}

const prepared = readJson(absolute(preparedPath))
if (prepared.schema !== 'production-prepared-bundle/v1' || prepared.runDate !== date || prepared.status !== 'AwaitingIsolatedCovers') {
  fail('prepared bundle identity/status mismatch')
}
if (!Array.isArray(prepared.items) || prepared.items.length === 0) fail('prepared bundle has no items')
if (!prepared.resultBase || typeof prepared.resultBase !== 'object') fail('prepared bundle resultBase is required')

const seen = new Set()
const candidates = []
const receiptPaths = []
const targetPaths = []

for (const item of prepared.items) {
  if (!item.itemId || seen.has(item.itemId)) fail('duplicate or missing itemId')
  seen.add(item.itemId)
  const prefix = `${workRoot}/${item.itemId}/`
  for (const [label, value] of Object.entries({
    zhDraftPath: item.zhDraftPath,
    enDraftPath: item.enDraftPath,
    coverBriefPath: item.coverBriefPath,
    coverReceiptPath: item.coverReceiptPath
  })) {
    if (!repo(value).startsWith(prefix)) fail(`${item.itemId}: ${label} must stay under item Production-work directory`)
  }
  for (const inputPath of [item.zhDraftPath, item.enDraftPath, item.coverBriefPath]) {
    if (!existsSync(absolute(inputPath))) fail(`${item.itemId}: missing prepared input ${inputPath}`)
  }
  if (!existsSync(absolute(item.coverReceiptPath))) {
    console.log(`Awaiting isolated cover receipt for ${item.itemId}.`)
    process.exit(0)
  }

  const brief = readJson(absolute(item.coverBriefPath))
  const receipt = readJson(absolute(item.coverReceiptPath))
  if (brief.schema !== 'article-cover-brief/v1' || brief.runDate !== date || brief.itemId !== item.itemId) {
    fail(`${item.itemId}: brief mismatch`)
  }
  if (!String(brief.sanitizedPrompt || '').trim() || CONTAMINATION.test(brief.sanitizedPrompt)) {
    fail(`${item.itemId}: brief prompt is not positive article imagery`)
  }
  if (receipt.schema !== 'cover-generation-receipt/v1' || receipt.status !== 'Accepted' || receipt.workerContext !== 'isolated-cover-worker') {
    fail(`${item.itemId}: receipt schema/status/context mismatch`)
  }
  if (receipt.runDate !== date || receipt.itemId !== item.itemId || receipt.briefId !== brief.briefId || repo(receipt.briefPath) !== repo(item.coverBriefPath)) {
    fail(`${item.itemId}: receipt identity mismatch`)
  }
  if (receipt.briefSha256 !== sha(absolute(item.coverBriefPath))) fail(`${item.itemId}: brief SHA mismatch`)
  if (receipt.sanitizedPrompt !== brief.sanitizedPrompt || CONTAMINATION.test(receipt.sanitizedPrompt)) {
    fail(`${item.itemId}: receipt prompt mismatch`)
  }
  if (!Number.isInteger(receipt.generationAttempts) || receipt.generationAttempts < 1 || receipt.generationAttempts > 3) {
    fail(`${item.itemId}: invalid generationAttempts`)
  }
  if (receipt.semanticReview !== 'PASS' || receipt.editorialThumbnailReview !== 'PASS') {
    fail(`${item.itemId}: cover reviews must PASS`)
  }

  const acceptedPath = repo(receipt.acceptedAssetPath)
  if (!acceptedPath.startsWith(prefix) || !existsSync(absolute(acceptedPath))) {
    fail(`${item.itemId}: accepted asset missing/outside item directory`)
  }
  assertRaster(absolute(acceptedPath), acceptedPath)
  if (receipt.assetSha256 !== sha(absolute(acceptedPath))) fail(`${item.itemId}: asset SHA mismatch`)

  for (const target of [item.targetZhPath, item.targetEnPath, item.targetCoverPath]) {
    if (!repo(target).startsWith(`staging/publication-candidates/${date}-`)) {
      fail(`${item.itemId}: final target is not same-date staging`)
    }
  }

  copy(absolute(item.zhDraftPath), absolute(item.targetZhPath))
  copy(absolute(item.enDraftPath), absolute(item.targetEnPath))
  copy(absolute(acceptedPath), absolute(item.targetCoverPath))

  for (const articlePath of [item.targetZhPath, item.targetEnPath]) {
    const markdown = readFileSync(absolute(articlePath), 'utf8')
    if (repo(frontmatter(markdown, 'cover')) !== repo(item.targetCoverPath)) {
      fail(`${item.itemId}: prepared article cover frontmatter mismatch`)
    }
  }

  const candidate = structuredClone(item.candidate || {})
  if (candidate.itemId !== item.itemId) fail(`${item.itemId}: prepared candidate identity mismatch`)
  Object.assign(candidate, {
    zhPath: repo(item.targetZhPath),
    enPath: repo(item.targetEnPath),
    coverPath: repo(item.targetCoverPath),
    coverBriefPath: repo(item.coverBriefPath),
    coverReceiptPath: repo(item.coverReceiptPath),
    coverGate: 'PASS',
    layoutGate: 'PASS'
  })
  if (Object.values(candidate.gates || {}).some((value) => value !== 'PASS')) {
    fail(`${item.itemId}: non-cover editorial gates were not prepared as PASS`)
  }
  if (candidate.inlineVisualGate !== 'PASS') fail(`${item.itemId}: inlineVisualGate was not prepared as PASS`)

  candidates.push(candidate)
  receiptPaths.push(repo(item.coverReceiptPath))
  targetPaths.push(repo(item.targetZhPath), repo(item.targetEnPath), repo(item.targetCoverPath))
}

const batchPath = `research/runtime/candidates/${year}/${month}/${date}-candidates.json`
const batch = {
  ...(prepared.batchBase || {}),
  schema: 'runtime-publication-candidate/v2',
  date,
  timezone: prepared.timezone || 'Asia/Shanghai',
  status: 'Completed',
  candidates,
  updatedAt: new Date().toISOString(),
  githubCommit: 'pending'
}
writeJson(absolute(batchPath), batch)

const resultPath = `research/runtime/results/${year}/${month}/${date}-production-result.json`
const result = structuredClone(prepared.resultBase)
Object.assign(result, {
  schema: 'runtime-shift-result/v2',
  task: 'production',
  family: 'daily',
  runtimeDate: date,
  status: 'Completed',
  productionMode: 'candidate-batch'
})
result.artifacts = [...new Set([...(result.artifacts || []), batchPath, ...targetPaths, ...receiptPaths])]
writeJson(absolute(resultPath), result)

const checkpointPath = `research/runtime/checkpoints/${year}/${month}/${date}-production.json`
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
writeJson(absolute(checkpointPath), {
  schema: 'runtime-production-checkpoint/v1',
  runDate: date,
  node: 'validators-passed',
  status: 'Completed',
  lastCompletedNode: 'validators-passed',
  artifacts: [batchPath, ...targetPaths.filter((value) => /cover\.(?:png|jpe?g|webp)$/i.test(value)), ...receiptPaths],
  evidence: [{ type: 'isolated-cover-finalization', preparedBundle: preparedPath }],
  sourceCommit,
  updatedAt: new Date().toISOString()
})

const requestPath = `research/runtime/completion-requests/production-${date.replaceAll('-', '')}-isolated-covers.json`
writeJson(absolute(requestPath), {
  schema: 'runtime-shift-completion-request/v1',
  task: 'production',
  date,
  resultPath,
  allowHistorical: false
})

console.log(`Prepared deterministic Production finalization for ${date}: ${candidates.length} candidate(s).`)
