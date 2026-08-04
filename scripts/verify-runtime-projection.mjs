#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve('.')
const LEGACY_PATH = join(ROOT, 'docs/.vitepress/generated/runtime-legacy-records.json')
const DIST_PATH = join(ROOT, 'docs/.vitepress/dist')

function die(message) {
  throw new Error(`Runtime projection verification failed: ${message}`)
}

function readJson(path) {
  if (!existsSync(path)) die(`${path} does not exist`)
  return JSON.parse(readFileSync(path, 'utf8'))
}

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

const legacy = readJson(LEGACY_PATH)
const august4 = (legacy.records || []).find((record) => record.date === '2026-08-04')
if (!august4) die('2026-08-04 legacy Runtime Record is missing')

const productionStatus = august4.taskStatus?.production
const productionResult = august4.results?.production
if (productionStatus !== 'Completed') {
  die(`2026-08-04 Production taskStatus is ${productionStatus}, expected Completed`)
}
if (productionResult?.status !== 'Completed') {
  die(`2026-08-04 Production result is ${productionResult?.status}, expected Completed`)
}
if (august4.completedTasks !== 4 || august4.totalTasks !== 5) {
  die(`2026-08-04 progress is ${august4.completedTasks}/${august4.totalTasks}, expected 4/5`)
}
if (!productionResult.workResult_zh.includes('Completed') || !productionResult.workResult_zh.includes('0 个出版候选')) {
  die('Chinese Production work result does not describe Completed with zero Publication Candidates')
}
if (productionResult.workResult_zh.includes('Skipped') || productionResult.output_zh.includes('Skipped')) {
  die('legacy projection still contains Skipped in the corrected Production result')
}

if (process.argv.includes('--dist')) {
  const text = walk(DIST_PATH)
    .filter((path) => /\.(html|js|json)$/.test(path))
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n')

  if (!text.includes('该班次以 Completed 结束，并生成 0 个出版候选')) {
    die('built site does not contain the corrected Chinese Production outcome')
  }
  if (!text.includes('Completed the governed Production eligibility review for all three columns')) {
    die('built site does not contain the corrected English Production outcome')
  }
  if (text.includes('因此正确生成 0 个出版候选，并以 Skipped 结束')) {
    die('built site still contains the obsolete Chinese Skipped Production wording')
  }
  if (text.includes('Production correctly created zero candidates and returned Skipped')) {
    die('built site still contains the obsolete English Skipped Production wording')
  }
}

console.log('Runtime legacy projection verified: 2026-08-04 Production Completed, progress 4/5, candidates 0.')
