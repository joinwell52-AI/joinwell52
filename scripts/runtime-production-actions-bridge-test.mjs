import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { materializeItem, markValidated, stageBatch } from './runtime-production-actions-bridge.mjs'

const root = mkdtempSync(path.join(tmpdir(), 'production-actions-bridge-'))
const date = '2026-08-18'
const itemId = 'Q-20260818-01'
const work = `research/runtime/production-work/2026/08/18/${itemId}`
const promptIdentity = {
  path: 'research/runtime/worker-prompts/generated/production.prompt.md',
  version: '2.13.0',
  sha256: 'a'.repeat(64)
}

function write(relative, value) {
  const target = path.join(root, relative)
  mkdirSync(path.dirname(target), { recursive: true })
  writeFileSync(target, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`)
}

try {
  mkdirSync(path.join(root, 'scripts'), { recursive: true })
  copyFileSync(path.resolve('scripts/generate-baseline-cover.mjs'), path.join(root, 'scripts/generate-baseline-cover.mjs'))
  write(`${work}/article-brief.json`, { schema: 'article-brief/v1', date, itemId })
  write(`${work}/argument-architecture.json`, { schema: 'argument-architecture/v1', date, itemId })
  write(`${work}/figure-plan.json`, { schema: 'article-figure-plan/v1', date, itemId })
  write(`${work}/draft.zh.md`, `---\ntitle: 测试\n---\n\n# 测试\n\n${'中文工程证据。'.repeat(80)}`)
  write(`${work}/draft.en.md`, `---\ntitle: Test\n---\n\n# Test\n\n${'Durable engineering evidence. '.repeat(50)}`)

  const itemRequest = {
    schema: 'runtime-production-action-request/v1',
    mode: 'materialize-item',
    date,
    timezone: 'Asia/Shanghai',
    task: 'production',
    sourceCommit: 'b'.repeat(40),
    promptIdentity,
    orderedItemIds: [itemId],
    item: {
      itemId,
      column: 'digital-employee',
      title: 'Selective Fail-Closed Boundaries',
      articleBriefPath: `${work}/article-brief.json`,
      argumentArchitecturePath: `${work}/argument-architecture.json`,
      figurePlanPath: `${work}/figure-plan.json`,
      zhDraftPath: `${work}/draft.zh.md`,
      enDraftPath: `${work}/draft.en.md`,
      baselineCoverPath: `${work}/baseline-cover.png`
    }
  }
  const itemResult = materializeItem({ root, request: itemRequest })
  if (itemResult.nextItemId !== null || !existsSync(path.join(root, `${work}/baseline-cover.png`))) throw new Error('item materialization failed')

  const candidateSource = 'research/runtime/production-work/2026/08/18/candidate-batch.json'
  const candidateTarget = 'research/runtime/candidates/2026/08/2026-08-18-candidates.json'
  write(candidateSource, {
    schema: 'runtime-publication-candidate/v2',
    date,
    timezone: 'Asia/Shanghai',
    status: 'Completed',
    candidates: [{
      itemId,
      zhPath: 'staging/publication-candidates/2026-08-18-test.zh.md',
      enPath: 'staging/publication-candidates/2026-08-18-test.en.md',
      coverPath: 'staging/publication-candidates/2026-08-18-test-cover.png'
    }]
  })
  const stageResult = stageBatch({ root, request: {
    schema: 'runtime-production-action-request/v1',
    mode: 'stage-batch',
    date,
    timezone: 'Asia/Shanghai',
    task: 'production',
    sourceCommit: 'b'.repeat(40),
    promptIdentity,
    candidateBatchSource: candidateSource,
    candidateBatchTarget: candidateTarget
  } })
  if (stageResult.candidates !== 1 || !existsSync(path.join(root, candidateTarget))) throw new Error('batch staging failed')
  markValidated({ root, date })
  const checkpoint = JSON.parse(readFileSync(path.join(root, 'research/runtime/checkpoints/2026/08/2026-08-18-production.json'), 'utf8'))
  if (checkpoint.node !== 'validators-passed' || checkpoint.status !== 'Completed') throw new Error('validated checkpoint was not persisted')
  console.log('runtime-production-actions-bridge: passed item, batch and validation transitions')
} finally {
  rmSync(root, { recursive: true, force: true })
}
