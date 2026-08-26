#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CANDIDATE_ROOT = join(ROOT, 'research/runtime/candidates')
const EFFECTIVE_DATE = '2026-08-27'

function walk(path) {
  if (!existsSync(path)) return []
  return readdirSync(path).flatMap((entry) => {
    const target = join(path, entry)
    return statSync(target).isDirectory() ? walk(target) : [target]
  })
}

function slash(path) {
  return relative(ROOT, path).split(sep).join('/')
}

function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  if (!match) return ''
  const raw = match[1].trim()
  if (raw.startsWith('"')) {
    try { return JSON.parse(raw) } catch { return raw.slice(1, -1) }
  }
  if (raw.startsWith("'") && raw.endsWith("'")) return raw.slice(1, -1)
  return raw
}

function normalizeMarkdown(raw) {
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  const selectedFrontmatter = fm
    ? ['title', 'summary', 'research_question'].map((key) => scalar(fm[1], key)).filter(Boolean).join('\n')
    : ''
  let body = fm ? raw.slice(fm[0].length) : raw
  body = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<ArticleCover[\s\S]*?\/>/g, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/<[^>]+>/g, '')
  return `${selectedFrontmatter}\n${body}`
}

const ENGLISH_TERM = /`([A-Za-z][A-Za-z0-9+._/#-]{2,})`|\b((?:[A-Z][A-Za-z0-9+._/#-]*)(?:[ \t]+(?:[A-Z][A-Za-z0-9+._/#-]*)){0,3})\b/g
const CHINESE_EXPLANATION = /^(?:\s|\*|_|~)*（[^）]*[\u3400-\u9fff][^）]*）/

function termKey(term) {
  return term.replace(/[`*_~]/g, '').replace(/\s+/g, ' ').trim().toLowerCase()
}

function aliasTokens(term) {
  return term.replace(/[`*_~]/g, '').split(/\s+/).filter((token) => /^[A-Z][A-Z0-9+._/#-]{1,}$/.test(token))
}

function contextAt(text, index) {
  return text.slice(Math.max(0, index - 32), Math.min(text.length, index + 90)).replace(/\s+/g, ' ').trim()
}

function insideChineseParenthetical(text, index) {
  const open = text.lastIndexOf('（', index)
  const close = text.lastIndexOf('）', index)
  return open > close
}

export function validateChineseTechnicalProse(raw, context = '(document)') {
  const text = normalizeMarkdown(raw)
  const errors = []
  const defined = new Set()
  let match

  while ((match = ENGLISH_TERM.exec(text)) !== null) {
    if (insideChineseParenthetical(text, match.index)) continue

    const term = match[1] || match[2] || ''
    const key = termKey(term)
    if (!key || defined.has(key)) continue

    const after = text.slice(match.index + match[0].length)
    if (!CHINESE_EXPLANATION.test(after)) {
      errors.push(`${context}: first Chinese-prose occurrence of English technical term "${term}" must be followed immediately by a full-width Chinese explanation, e.g. ${term}（中文解释）; near: ${contextAt(text, match.index)}`)
      defined.add(key)
      continue
    }

    defined.add(key)
    for (const alias of aliasTokens(term)) defined.add(termKey(alias))
  }

  const paragraphs = text.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean)
  for (const paragraph of paragraphs) {
    const densityText = paragraph.replace(/（[^）]*）/g, '（）')
    const chinese = (densityText.match(/[\u3400-\u9fff]/g) || []).length
    const latin = (densityText.match(/[A-Za-z]/g) || []).length
    if (chinese < 20 || latin < 30) continue
    const ratio = latin / (latin + chinese)
    if (ratio > 0.28) {
      errors.push(`${context}: Chinese paragraph is English-heavy (${Math.round(ratio * 100)}% Latin letters among CJK+Latin letters); rewrite concepts into natural Chinese instead of chaining English terminology; near: ${paragraph.slice(0, 120).replace(/\s+/g, ' ')}`)
    }
  }

  return errors
}

function main() {
  const errors = []
  let checked = 0
  for (const batchPath of walk(CANDIDATE_ROOT).filter((item) => item.endsWith('-candidates.json'))) {
    let batch
    try { batch = JSON.parse(readFileSync(batchPath, 'utf8')) } catch { continue }
    if (batch?.schema !== 'runtime-publication-candidate/v2' || batch?.status !== 'Completed') continue
    if (String(batch.date || '') < EFFECTIVE_DATE) continue

    for (const candidate of batch.candidates || []) {
      const zhPath = candidate.zhPath ? join(ROOT, candidate.zhPath) : null
      if (!zhPath || !existsSync(zhPath)) continue
      checked += 1
      errors.push(...validateChineseTechnicalProse(readFileSync(zhPath, 'utf8'), `${slash(batchPath)}#${candidate.itemId || 'unknown'}:${candidate.zhPath}`))
    }
  }

  if (errors.length) {
    console.error(`Chinese technical prose validation failed with ${errors.length} error(s):`)
    for (const error of errors) console.error(`- ${error}`)
    process.exitCode = 1
  } else {
    console.log(`Chinese technical prose validation passed: ${checked} candidate(s) checked from ${EFFECTIVE_DATE}.`)
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
