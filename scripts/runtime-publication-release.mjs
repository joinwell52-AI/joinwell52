#!/usr/bin/env node

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const COLUMN_DIR = {
  'digital-employee': 'digital-employee',
  'industry-architecture': 'industry',
  'open-source-engineering': 'engineering'
}
const KICKER = {
  'digital-employee': { zh: '数字员工 · 每日研究', en: 'Digital Employee · Daily Research' },
  'industry-architecture': { zh: '行业架构 · 每日研究', en: 'Industry Architecture · Daily Research' },
  'open-source-engineering': { zh: '开源工程 · 每日研究', en: 'Open-source Engineering · Daily Research' }
}

function fail(message) { throw new Error(`Runtime Publication release: ${message}`) }
function readJson(file) { return JSON.parse(readFileSync(path.join(ROOT, file), 'utf8')) }
function writeJson(file, value) {
  const target = path.join(ROOT, file)
  mkdirSync(path.dirname(target), { recursive: true })
  writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`)
}
function argsOf(argv) {
  const args = {}
  for (let i = 2; i < argv.length; i += 1) {
    if (!argv[i].startsWith('--')) continue
    const key = argv[i].slice(2)
    const value = argv[i + 1]
    if (!value || value.startsWith('--')) args[key] = true
    else { args[key] = value; i += 1 }
  }
  return args
}
function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  if (!match) fail(`missing ${key} in candidate frontmatter`)
  const value = match[1].trim()
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }
  return value
}
function attr(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
}
function publishArticle({ sourcePath, targetPath, publicCover, item, language, slug, date }) {
  const source = readFileSync(path.join(ROOT, sourcePath), 'utf8').replaceAll('\r\n', '\n')
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) fail(`invalid frontmatter in ${sourcePath}`)
  const originalFrontmatter = match[1]
  const title = scalar(originalFrontmatter, 'title')
  const summary = scalar(originalFrontmatter, 'summary')
  const frontmatter = originalFrontmatter
    .split('\n')
    .filter((line) => !/^schema:/.test(line) && !/^cover:/.test(line))
  frontmatter.push(
    `item_id: "${item.itemId}"`,
    'lifecycle: "Published"',
    `cover: "/assets/covers/${publicCover}"`,
    'evidence_status: "Completed"',
    'citation_status: "Completed"',
    'editing_status: "Completed"',
    'publication_authorized: true'
  )

  const otherLanguage = language === 'zh' ? 'en' : 'zh'
  const body = match[2].replace(
    /^\n?!\[[^\n]*\]\([^\n]+\)\n\n(?:\*[^\n]*\*\n\n)?/,
    ''
  )
  const cover = [
    '<ArticleCover',
    `  image="/assets/covers/${publicCover}"`,
    `  kicker="${attr(KICKER[item.column][language])}"`,
    `  title="${attr(title)}"`,
    `  summary="${attr(summary)}"`,
    `  version="${item.itemId}"`,
    `  status="Daily Runtime V5 · ${date}"`,
    `  languageHref="/${otherLanguage}/${COLUMN_DIR[item.column]}/${slug}"`,
    `  languageLabel="${language === 'zh' ? 'English' : '中文'}"`,
    '/>',
    ''
  ].join('\n')

  const target = path.join(ROOT, targetPath)
  mkdirSync(path.dirname(target), { recursive: true })
  writeFileSync(target, `---\n${frontmatter.join('\n')}\n---\n\n${cover}\n${body}`)
}

const args = argsOf(process.argv)
const date = String(args.date || '')
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail('required --date YYYY-MM-DD')
const [year, month] = date.split('-')
const candidatePath = `research/runtime/candidates/${year}/${month}/${date}-candidates.json`
const batch = readJson(candidatePath)
if (batch.schema !== 'runtime-publication-candidate/v2' || batch.status !== 'Completed') {
  fail(`${candidatePath} is not a completed V2 candidate batch`)
}
if (!Array.isArray(batch.candidates) || batch.candidates.length < 1) fail('candidate batch has no candidates')

const releasedItems = []
for (const item of batch.candidates) {
  const targetDir = COLUMN_DIR[item.column]
  if (!targetDir) fail(`unsupported column ${item.column}`)
  for (const gate of [...Object.values(item.gates || {}), item.coverGate, item.inlineVisualGate, item.layoutGate]) {
    if (gate !== 'PASS') fail(`${item.itemId} has a non-PASS publication gate`)
  }
  if (item.lifecycle !== 'Publication Candidate' || item.evidenceStatus !== 'Completed' || item.editingStatus !== 'Completed') {
    fail(`${item.itemId} is not a complete Publication Candidate`)
  }
  if (item.communityEdition?.decision === 'generated') fail(`${item.itemId} Community Edition release is not implemented by this Research Center-only command`)
  for (const file of [item.zhPath, item.enPath, item.coverPath]) {
    if (!file || !existsSync(path.join(ROOT, file))) fail(`${item.itemId} missing ${file || 'artifact path'}`)
  }

  const slug = path.basename(item.enPath).replace(/\.en\.md$/, '')
  const publicCover = `daily-${path.basename(item.coverPath)}`
  const zh = `docs/zh/${targetDir}/${slug}.md`
  const en = `docs/en/${targetDir}/${slug}.md`
  const cover = `docs/public/assets/covers/${publicCover}`
  publishArticle({ sourcePath: item.zhPath, targetPath: zh, publicCover, item, language: 'zh', slug, date })
  publishArticle({ sourcePath: item.enPath, targetPath: en, publicCover, item, language: 'en', slug, date })
  mkdirSync(path.dirname(path.join(ROOT, cover)), { recursive: true })
  copyFileSync(path.join(ROOT, item.coverPath), path.join(ROOT, cover))
  releasedItems.push({ itemId: item.itemId, column: item.column, zh, en, cover })
}

const manifestPath = `research/runtime/releases/${date}-publication.json`
writeJson(manifestPath, {
  schema: 'runtime-publication-release/v1',
  date,
  timezone: 'Asia/Shanghai',
  status: 'Released',
  sourceCandidates: candidatePath,
  sourceProductionResult: `research/runtime/results/${year}/${month}/${date}-production-result.json`,
  wakeReceipt: String(args['wake-receipt'] || ''),
  workerClaimRecord: `research/runtime/records/daily/${year}/${month}/${date}-daily-runtime.json`,
  workerClaimCommit: String(args['worker-claim-commit'] || 'pending'),
  startStateCommit: String(args['start-state-commit'] || 'pending'),
  releaseContentCommit: 'pending',
  schedulerFallback: true,
  releasedItems,
  metrics: {
    eligibleCandidates: batch.candidates.length,
    releasedItems: releasedItems.length,
    bilingualArticleFiles: releasedItems.length * 2,
    coverAssets: releasedItems.length,
    inlineFigureAssets: batch.candidates.reduce((sum, item) => sum + (item.inlineFigures?.length || 0), 0),
    communityEditions: 0,
    visualizationAssets: releasedItems.length
  },
  prohibitionsObserved: { newResearch: 0, substantiveRewriting: 0, evidenceRepair: 0 }
})

console.log(`Prepared ${releasedItems.length} bilingual Research Center release item(s) for ${date}.`)
console.log(manifestPath)
