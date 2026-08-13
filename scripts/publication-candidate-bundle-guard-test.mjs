#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const guard = join(root, 'scripts/publication-candidate-bundle-guard.mjs')
const fixture = mkdtempSync(join(tmpdir(), 'publication-bundle-guard-'))
const date = '2099-01-01'
const slug = `${date}-atomic-guard`
const candidateRoot = join(fixture, 'staging/publication-candidates')
const batchRoot = join(fixture, 'research/runtime/candidates/2099/01')
const enPath = `staging/publication-candidates/${slug}.en.md`
const zhPath = `staging/publication-candidates/${slug}.zh.md`
const coverPath = `staging/publication-candidates/${slug}-cover.svg`
const batchPath = `research/runtime/candidates/2099/01/${date}-candidates.json`

function runGit(args) {
  return execFileSync('git', args, { cwd: fixture, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
}

function write(path, value) {
  const absolute = join(fixture, path)
  mkdirSync(resolve(absolute, '..'), { recursive: true })
  writeFileSync(absolute, value, 'utf8')
}

function article(language) {
  return `---\nschema: publication-candidate-article/v2\ntitle: "Atomic ${language}"\ndate: '${date}'\ncover: "${coverPath}"\n---\n\n![Cover](${coverPath})\n\n# Atomic ${language}\n`
}

try {
  runGit(['init', '--quiet'])
  write(enPath, article('English'))
  runGit(['add', enPath])

  let rejected = false
  try {
    execFileSync(process.execPath, [guard, 'staged'], { cwd: fixture, stdio: 'pipe' })
  } catch {
    rejected = true
  }
  if (!rejected) throw new Error('partial candidate bundle was not rejected')

  write(zhPath, article('Chinese'))
  write(coverPath, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>\n')
  write(batchPath, `${JSON.stringify({
    schema: 'runtime-publication-candidate/v2',
    date,
    status: 'Completed',
    candidates: [{ zhPath, enPath, coverPath }]
  }, null, 2)}\n`)
  runGit(['add', zhPath, coverPath, batchPath])
  execFileSync(process.execPath, [guard, 'staged'], { cwd: fixture, stdio: 'pipe' })
  console.log('Publication Candidate atomic bundle guard regression passed: partial rejected, complete bundle accepted.')
} finally {
  rmSync(fixture, { recursive: true, force: true })
}
