#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

const CHECKPOINT_ORDER = [
  'admission-and-inputs-verified',
  'bilingual-drafts-persisted',
  'cover-briefs-persisted',
  'covers-generated-and-reviewed',
  'candidate-bundle-staged',
  'validators-passed',
  'terminal-result-verified'
]
const RASTER_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])
const CONTROL_CONTEXT = /\b(?:runtime|recovery|checkpoint|github|worker|control|status|completed|blocked|dashboard|report)\b|执行报告|运行控制|仪表盘|状态看板/i

function fail(message) {
  throw new Error(`Runtime production proof: ${message}`)
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
  const relative = repoPath(path.relative(root, resolved))
  if (relative.startsWith('../')) fail(`path escapes repository: ${value}`)
  return resolved
}

function frontmatter(markdown) {
  const body = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || ''
  return Object.fromEntries(body.split(/\r?\n/).map((line) => {
    const match = line.match(/^([A-Za-z0-9_]+):\s*(.*?)\s*$/)
    if (!match) return null
    return [match[1], match[2].replace(/^['"]|['"]$/g, '')]
  }).filter(Boolean))
}

function eligibleInputs(root, date) {
  const directory = path.join(root, 'research/analysis')
  const compact = date.replaceAll('-', '')
  if (!existsSync(directory)) return []
  return readdirSync(directory)
    .filter((name) => name.startsWith(`Q-${compact}-`) && name.endsWith('.md'))
    .map((name) => {
      const file = path.join(directory, name)
      const metadata = frontmatter(readFileSync(file, 'utf8'))
      return { file, metadata }
    })
    .filter(({ metadata }) => metadata.date === date
      && metadata.status === 'ReadyForProduction'
      && metadata.production_input_authorized === 'true')
    .map(({ metadata }) => metadata.queue_item)
    .filter(Boolean)
    .sort()
}

function assertRaster(file, relative) {
  const extension = path.extname(relative).toLowerCase()
  if (!RASTER_EXTENSIONS.has(extension)) fail(`${relative} is not an allowed raster cover`)
  const bytes = readFileSync(file)
  const png = bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  const jpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  const webp = bytes.length >= 12 && bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP'
  if (!png && !jpeg && !webp) fail(`${relative} is not a real PNG, JPEG or WebP asset`)
}

function artifactPaths(result) {
  const paths = new Set()
  for (const artifact of result.artifacts || []) {
    if (typeof artifact === 'string') paths.add(repoPath(artifact))
    else if (artifact && typeof artifact === 'object') {
      for (const key of ['path', 'coverPath', 'batchPath']) {
        if (artifact[key]) paths.add(repoPath(artifact[key]))
      }
    }
  }
  return paths
}

function containsControlContext(prompt) {
  const cleaned = String(prompt || '')
    .replace(/\b(?:no|without)\s+(?:dashboard|report|table|ui|admin panel|workflow chart|status board)\b/gi, '')
    .replace(/无(?:仪表盘|报告|表格|界面|状态看板)/g, '')
  return CONTROL_CONTEXT.test(cleaned)
}

export function validateProductionCompletion({ root = process.cwd(), date, result, timezone = 'Asia/Shanghai' }) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) fail(`invalid run date ${date || '(missing)'}`)
  if (result?.status !== 'Completed') fail('proof validation applies only to Completed Production results')
  if (result.runtimeDate !== date) fail(`result runtimeDate ${result.runtimeDate || '(missing)'} does not match ${date}`)

  const inputs = eligibleInputs(root, date)
  if (inputs.length === 0) {
    if (result.productionMode !== 'zero-output') fail('zero eligible inputs require productionMode=zero-output')
    return { mode: 'zero-output', eligibleInputs: 0, candidates: 0 }
  }
  if (result.productionMode !== 'candidate-batch') {
    fail(`${inputs.length} eligible same-date inputs require productionMode=candidate-batch`)
  }

  const [year, month] = date.split('-')
  const batchPath = `research/runtime/candidates/${year}/${month}/${date}-candidates.json`
  const batchFile = absolute(root, batchPath)
  if (!existsSync(batchFile)) fail(`missing same-date candidate batch ${batchPath}`)
  const batch = readJson(batchFile)
  if (batch.schema !== 'runtime-publication-candidate/v2') fail(`${batchPath}: invalid schema ${batch.schema}`)
  if (batch.date !== date) fail(`${batchPath}: date ${batch.date} does not match ${date}`)
  if (batch.timezone !== timezone) fail(`${batchPath}: timezone ${batch.timezone} does not match ${timezone}`)
  if (batch.status !== 'Completed') fail(`${batchPath}: status must be Completed`)
  if (!Array.isArray(batch.candidates) || batch.candidates.length === 0) fail(`${batchPath}: candidates must not be empty`)

  const actualIds = batch.candidates.map((candidate) => candidate.itemId).sort()
  if (JSON.stringify(actualIds) !== JSON.stringify(inputs)) {
    fail(`${batchPath}: candidate IDs ${actualIds.join(',') || 'none'} do not match eligible inputs ${inputs.join(',')}`)
  }

  const evidence = new Map((result.coverEvidence || []).map((item) => [item.itemId, item]))
  const artifacts = artifactPaths(result)
  if (!artifacts.has(batchPath)) fail(`result artifacts do not bind ${batchPath}`)
  const requiredCheckpointArtifacts = new Set([batchPath])

  for (const candidate of batch.candidates) {
    for (const key of ['zhPath', 'enPath', 'coverPath']) {
      const relative = repoPath(candidate[key])
      if (!relative.startsWith(`staging/publication-candidates/${date}-`)) {
        fail(`${candidate.itemId}.${key} does not belong to run date ${date}: ${relative}`)
      }
      const file = absolute(root, relative)
      if (!existsSync(file)) fail(`${candidate.itemId}.${key} does not exist: ${relative}`)
    }
    for (const articlePath of [candidate.zhPath, candidate.enPath]) {
      const metadata = frontmatter(readFileSync(absolute(root, articlePath), 'utf8'))
      if (metadata.schema !== 'publication-candidate-article/v2') fail(`${articlePath}: invalid article schema`)
      if (metadata.date !== date) fail(`${articlePath}: article date ${metadata.date || '(missing)'} does not match ${date}`)
      if (repoPath(metadata.cover) !== repoPath(candidate.coverPath)) fail(`${articlePath}: cover does not match candidate batch`)
    }
    assertRaster(absolute(root, candidate.coverPath), candidate.coverPath)
    if (candidate.coverGate !== 'PASS' || candidate.inlineVisualGate !== 'PASS' || candidate.layoutGate !== 'PASS') {
      fail(`${candidate.itemId}: visual and layout gates must all PASS`)
    }
    if (Object.values(candidate.gates || {}).some((value) => value !== 'PASS')) fail(`${candidate.itemId}: editorial gates must all PASS`)

    const cover = evidence.get(candidate.itemId)
    if (!cover) fail(`${candidate.itemId}: missing structured coverEvidence`)
    if (repoPath(cover.coverPath) !== repoPath(candidate.coverPath)) fail(`${candidate.itemId}: coverEvidence path mismatch`)
    if (cover.semanticReview !== 'PASS') fail(`${candidate.itemId}: semanticReview must be PASS`)
    if (!Number.isInteger(cover.generationAttempts) || cover.generationAttempts < 1 || cover.generationAttempts > 3) {
      fail(`${candidate.itemId}: generationAttempts must be between 1 and 3`)
    }
    if (!String(cover.briefId || '').startsWith(`${date}:`)) fail(`${candidate.itemId}: briefId must be bound to ${date}`)
    if (!String(cover.sanitizedPrompt || '').trim()) fail(`${candidate.itemId}: sanitizedPrompt is required`)
    if (containsControlContext(cover.sanitizedPrompt)) fail(`${candidate.itemId}: sanitizedPrompt contains Runtime/report control context`)
    if (!artifacts.has(repoPath(candidate.coverPath))) fail(`result artifacts do not bind ${candidate.coverPath}`)
    requiredCheckpointArtifacts.add(repoPath(candidate.coverPath))
  }

  const checkpointPath = `research/runtime/checkpoints/${year}/${month}/${date}-production.json`
  const checkpointFile = absolute(root, checkpointPath)
  if (!existsSync(checkpointFile)) fail(`missing same-date checkpoint ${checkpointPath}`)
  const checkpoint = readJson(checkpointFile)
  if (checkpoint.schema !== 'runtime-production-checkpoint/v1') fail(`${checkpointPath}: invalid schema`)
  if (checkpoint.runDate !== date || checkpoint.status !== 'Completed') fail(`${checkpointPath}: runDate/status mismatch`)
  if (CHECKPOINT_ORDER.indexOf(checkpoint.node) < CHECKPOINT_ORDER.indexOf('validators-passed')) {
    fail(`${checkpointPath}: latest durable node ${checkpoint.node} is before validators-passed`)
  }
  if (!/^[0-9a-f]{40}$/.test(checkpoint.sourceCommit || '')) fail(`${checkpointPath}: sourceCommit must be a full commit SHA`)
  const checkpointArtifacts = new Set((checkpoint.artifacts || []).map(repoPath))
  for (const required of requiredCheckpointArtifacts) {
    if (!checkpointArtifacts.has(required)) fail(`${checkpointPath}: artifacts do not bind ${required}`)
  }

  return { mode: 'candidate-batch', eligibleInputs: inputs.length, candidates: batch.candidates.length, batchPath, checkpointPath }
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
  const resultPath = args.result
  if (!resultPath) fail('--result <json-file> is required')
  const manifest = readJson(path.join(process.cwd(), 'research/runtime/SCHEDULER.json'))
  const summary = validateProductionCompletion({
    root: process.cwd(),
    date: args.date,
    result: readJson(absolute(process.cwd(), resultPath)),
    timezone: manifest.timezone
  })
  console.log(`Runtime production proof passed: ${JSON.stringify(summary)}`)
}
