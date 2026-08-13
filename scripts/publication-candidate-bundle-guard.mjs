#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { dirname, posix } from 'node:path'

const CANDIDATE_PATTERN = /^staging\/publication-candidates\/(\d{4})-(\d{2})-(\d{2})-(.+)\.(zh|en)\.md$/

function git(args, options = {}) {
  return execFileSync('git', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', options.quiet ? 'ignore' : 'pipe']
  })
}

function gitPathList(args) {
  return git([...args, '-z']).split('\0').filter(Boolean).map((value) => value.replaceAll('\\', '/'))
}

function indexExists(path) {
  try { git(['cat-file', '-e', `:${path}`], { quiet: true }); return true }
  catch { return false }
}

function headExists(path) {
  try { git(['cat-file', '-e', `HEAD:${path}`], { quiet: true }); return true }
  catch { return false }
}

function indexRead(path) {
  return git(['show', `:${path}`])
}

function frontmatterValue(markdown, key) {
  const block = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || ''
  const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  return (match?.[1] || '').trim().replace(/^['"]|['"]$/g, '')
}

function imageSources(markdown) {
  return [...markdown.matchAll(/^!\[[^\]]*\]\(([^)]+)\)\s*$/gm)].map((match) => match[1].trim())
}

function normalizeRepoPath(path) {
  const normalized = posix.normalize(String(path || '').replaceAll('\\', '/'))
  if (!normalized || normalized.startsWith('../') || normalized.startsWith('/') || normalized.includes('://')) {
    throw new Error(`asset path must be repository-relative: ${path || '(empty)'}`)
  }
  return normalized
}

function counterpart(path, language) {
  return path.replace(`.${language}.md`, language === 'zh' ? '.en.md' : '.zh.md')
}

function validateStaged() {
  const staged = new Set(gitPathList(['diff', '--cached', '--name-only', '--diff-filter=ACM']))
  const added = new Set(gitPathList(['diff', '--cached', '--name-only', '--diff-filter=A']))
  const stagedCandidates = [...staged].filter((path) => CANDIDATE_PATTERN.test(path))
  const errors = []

  for (const articlePath of stagedCandidates) {
    const match = articlePath.match(CANDIDATE_PATTERN)
    const [, year, month, day, , language] = match
    const markdown = indexRead(articlePath)
    const cover = frontmatterValue(markdown, 'cover')
    const assets = new Set([cover, ...imageSources(markdown)].filter(Boolean))

    for (const source of assets) {
      try {
        const assetPath = normalizeRepoPath(source)
        if (!indexExists(assetPath)) errors.push(`${articlePath}: referenced asset is absent from the commit index: ${assetPath}`)
        if (!headExists(assetPath) && !staged.has(assetPath)) errors.push(`${articlePath}: new asset must be committed in the same atomic bundle: ${assetPath}`)
      } catch (error) {
        errors.push(`${articlePath}: ${error.message}`)
      }
    }

    if (added.has(articlePath)) {
      const pairedPath = counterpart(articlePath, language)
      if (!staged.has(pairedPath) || !indexExists(pairedPath)) {
        errors.push(`${articlePath}: a new candidate must commit its bilingual counterpart in the same bundle: ${pairedPath}`)
      }

      const batchPath = `research/runtime/candidates/${year}/${month}/${year}-${month}-${day}-candidates.json`
      if (!staged.has(batchPath) || !indexExists(batchPath)) {
        errors.push(`${articlePath}: a new candidate must commit its completed batch record in the same bundle: ${batchPath}`)
      } else {
        try {
          const batch = JSON.parse(indexRead(batchPath))
          const listed = (batch.candidates || []).some((candidate) => candidate.zhPath === (language === 'zh' ? articlePath : pairedPath)
            && candidate.enPath === (language === 'en' ? articlePath : pairedPath)
            && candidate.coverPath === cover)
          if (batch.status !== 'Completed' || !listed) {
            errors.push(`${articlePath}: completed batch record does not bind the bilingual pair and cover as one candidate`)
          }
        } catch (error) {
          errors.push(`${batchPath}: invalid candidate batch JSON: ${error.message}`)
        }
      }
    }
  }

  if (errors.length) {
    console.error(`Publication Candidate atomic bundle guard failed with ${errors.length} error(s):`)
    for (const error of errors) console.error(`- ${error}`)
    process.exitCode = 1
    return
  }
  console.log(`Publication Candidate atomic bundle guard passed: ${stagedCandidates.length} staged candidate article(s).`)
}

const command = process.argv[2] || 'staged'
if (command !== 'staged') {
  console.error(`Unknown command: ${command}`)
  process.exitCode = 1
} else {
  validateStaged()
}
