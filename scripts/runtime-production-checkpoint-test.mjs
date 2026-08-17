#!/usr/bin/env node

import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { validateProductionCheckpoint } from './runtime-production-checkpoint.mjs'

const root = mkdtempSync(join(tmpdir(), 'production-checkpoint-'))
const date = '2026-08-17'
const itemId = 'Q-20260817-01'
const base = `research/runtime/production-work/2026/08/17/${itemId}`

function write(relative, value, binary = false) {
  const file = join(root, relative)
  mkdirSync(join(file, '..'), { recursive: true })
  writeFileSync(file, value, binary ? undefined : 'utf8')
  return relative
}

function digest(relative) {
  return createHash('sha256').update(readFileSync(join(root, relative))).digest('hex')
}

try {
  const paths = {
    articleBriefPath: write(`${base}/article-brief.json`, `${JSON.stringify({ schema: 'article-brief/v1', date, itemId })}\n`),
    argumentArchitecturePath: write(`${base}/argument-architecture.json`, `${JSON.stringify({ schema: 'argument-architecture/v1', date, itemId })}\n`),
    figurePlanPath: write(`${base}/figure-plan.json`, `${JSON.stringify({ schema: 'article-figure-plan/v1', date, itemId })}\n`),
    zhDraftPath: write(`${base}/draft.zh.md`, '# 中文草稿\n'),
    enDraftPath: write(`${base}/draft.en.md`, '# English draft\n'),
    baselineCoverPath: write(`${base}/baseline-cover.png`, Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]), true)
  }
  const checkpoint = {
    schema: 'runtime-production-checkpoint/v2',
    runDate: date,
    node: 'article-progress-persisted',
    status: 'Running',
    promptIdentity: {
      path: 'research/runtime/worker-prompts/generated/production.prompt.md',
      version: '2.12.0',
      sha256: 'a'.repeat(64)
    },
    items: [{ itemId, status: 'Ready', ...paths, artifactHashes: Object.fromEntries(Object.values(paths).map((relative) => [relative, digest(relative)])) }],
    nextItemId: null,
    sourceCommit: 'b'.repeat(40),
    updatedAt: '2026-08-17T17:00:00+08:00'
  }
  assert.deepEqual(validateProductionCheckpoint({ root, checkpoint, date }), { items: 1, ready: 1, nextItemId: null })

  const broken = structuredClone(checkpoint)
  broken.items[0].artifactHashes[broken.items[0].zhDraftPath] = '0'.repeat(64)
  assert.throws(() => validateProductionCheckpoint({ root, checkpoint: broken, date }), /SHA-256 mismatch/)

  const resumable = structuredClone(checkpoint)
  resumable.items.push({ itemId: 'Q-20260817-02', status: 'Waiting' })
  resumable.nextItemId = 'Q-20260817-02'
  assert.deepEqual(validateProductionCheckpoint({ root, checkpoint: resumable, date }), { items: 2, ready: 1, nextItemId: 'Q-20260817-02' })
  console.log('Runtime Production checkpoint V2 tests passed: ready artifacts, hash rejection and resumable next item.')
} finally {
  rmSync(root, { recursive: true, force: true })
}
