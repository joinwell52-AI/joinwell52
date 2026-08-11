#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const LAYOUT_EFFECTIVE_DATE = '2026-08-10'
const INLINE_CONTRACT_EFFECTIVE_DATE = '2026-08-12'
const FORBIDDEN_IMAGE_HEADINGS = new Set([
  'Cover', 'Figure', 'Visualization', '题图', '文中图', '解释图', '可视化'
])
const PUBLIC_COLUMN_ROOTS = [
  'docs/zh/digital-employee',
  'docs/zh/industry',
  'docs/zh/engineering',
  'docs/en/digital-employee',
  'docs/en/industry',
  'docs/en/engineering'
]

const errors = []
let articleCount = 0
let candidateBatchCount = 0
let inlineFigureCount = 0

function slash(path) {
  return relative(ROOT, path).split(sep).join('/')
}

function walk(path) {
  if (!existsSync(path)) return []
  return readdirSync(path).flatMap((entry) => {
    const target = join(path, entry)
    return statSync(target).isDirectory() ? walk(target) : [target]
  })
}

function fail(path, message) {
  errors.push(`${slash(path)}: ${message}`)
}

function frontmatter(markdown, path) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) {
    fail(path, 'missing YAML frontmatter')
    return { bodyStart: 0, values: {} }
  }
  const values = {}
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/)
    if (!field) continue
    values[field[1]] = field[2].trim().replace(/^['"]|['"]$/g, '')
  }
  return { bodyStart: match[0].length, values }
}

function resolveArticleAsset(articlePath, source) {
  if (source.startsWith('/assets/')) return join(ROOT, 'docs/public', source.slice(1))
  if (source.startsWith('./') || source.startsWith('../')) return resolve(dirname(articlePath), source)
  if (source.startsWith('staging/') || source.startsWith('docs/')) return join(ROOT, source)
  return null
}

function images(markdown) {
  return [...markdown.matchAll(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/gm)].map((match) => ({
    alt: match[1],
    source: match[2],
    index: match.index,
    end: match.index + match[0].length
  }))
}

function headings(markdown) {
  return [...markdown.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => ({
    label: match[1].trim(),
    index: match.index
  }))
}

function captionAfter(markdown, image) {
  const tail = markdown.slice(image.end)
  const next = tail.match(/^\s*\r?\n\s*(\*[^\r\n]+\*)/)
  return next?.[1] || ''
}

function validateInlineFigure(articlePath, markdown, image, firstSectionIndex) {
  inlineFigureCount += 1
  const asset = resolveArticleAsset(articlePath, image.source)
  if (!asset || !existsSync(asset)) fail(articlePath, `Inline Figure does not exist: ${image.source}`)
  if (image.index < firstSectionIndex) fail(articlePath, `Inline Figure is mechanically placed before the first body section: ${image.source}`)

  const caption = captionAfter(markdown, image)
  if (!caption) {
    fail(articlePath, `Inline Figure is missing an adjacent italic caption: ${image.source}`)
    return
  }
  const isChinese = slash(articlePath).includes('/zh/') || articlePath.endsWith('.zh.md')
  if (isChinese) {
    if (!/^\*图\s*\d+[：:]/.test(caption)) fail(articlePath, `Chinese caption must begin with 图 N： for ${image.source}`)
    if (!caption.includes('来源：')) fail(articlePath, `Chinese caption must include 来源： for ${image.source}`)
  } else {
    if (!/^\*Figure\s+\d+\./.test(caption)) fail(articlePath, `English caption must begin with Figure N. for ${image.source}`)
    if (!caption.includes('Source:')) fail(articlePath, `English caption must include Source: for ${image.source}`)
  }
}

function validateArticle(articlePath, kind) {
  const markdown = readFileSync(articlePath, 'utf8')
  const metadata = frontmatter(markdown, articlePath)
  const date = metadata.values.date || articlePath.match(/\d{4}-\d{2}-\d{2}/)?.[0] || ''
  if (date < LAYOUT_EFFECTIVE_DATE) return
  if (kind === 'published' && metadata.values.category !== 'daily') return

  articleCount += 1
  const articleHeadings = headings(markdown)
  for (const heading of articleHeadings) {
    if (FORBIDDEN_IMAGE_HEADINGS.has(heading.label)) fail(articlePath, `forbidden image-container heading: ## ${heading.label}`)
  }

  const h1Index = markdown.search(/^#\s+/m)
  const firstSectionIndex = articleHeadings[0]?.index ?? Number.POSITIVE_INFINITY
  const articleImages = images(markdown)
  let coverSource = metadata.values.cover || ''
  let inlineImages = articleImages

  if (kind === 'published') {
    const coverComponent = markdown.match(/<ArticleCover[\s\S]*?\bimage="([^"]+)"[\s\S]*?\/>/)
    if (!coverComponent) fail(articlePath, 'missing page-level <ArticleCover>')
    else {
      coverSource = coverComponent[1]
      if (coverComponent.index > h1Index) fail(articlePath, '<ArticleCover> must appear before the article H1')
    }
  } else {
    const topCover = articleImages.find((image) => image.index < h1Index)
    if (!topCover) fail(articlePath, 'candidate cover image must appear before the article H1')
    else {
      coverSource = topCover.source
      inlineImages = articleImages.filter((image) => image !== topCover)
    }
  }

  if (!coverSource) fail(articlePath, 'cover is not declared')
  else {
    const coverAsset = resolveArticleAsset(articlePath, coverSource)
    if (!coverAsset || !existsSync(coverAsset)) fail(articlePath, `cover does not exist: ${coverSource}`)
  }

  for (const image of inlineImages) {
    if (image.source === coverSource) fail(articlePath, `cover is reused as an Inline Figure: ${image.source}`)
    validateInlineFigure(articlePath, markdown, image, firstSectionIndex)
  }
}

function validateCandidateBatch(batchPath) {
  const batch = JSON.parse(readFileSync(batchPath, 'utf8'))
  if ((batch.date || '') < LAYOUT_EFFECTIVE_DATE || batch.status !== 'Completed') return
  candidateBatchCount += 1
  for (const candidate of batch.candidates || []) {
    const coverPath = candidate.coverPath ? join(ROOT, candidate.coverPath) : null
    if (!coverPath || !existsSync(coverPath)) fail(batchPath, `${candidate.itemId}: coverPath does not exist`)

    const hasNewContract = Array.isArray(candidate.inlineFigures)
    if (batch.date >= INLINE_CONTRACT_EFFECTIVE_DATE && !hasNewContract) {
      fail(batchPath, `${candidate.itemId}: new Production candidates require inlineFigures[]`)
    }
    const figureEntries = hasNewContract
      ? candidate.inlineFigures
      : candidate.figurePath
        ? [{ path: candidate.figurePath, legacy: true }]
        : []

    for (const figure of figureEntries) {
      if (!figure.path || !existsSync(join(ROOT, figure.path))) fail(batchPath, `${candidate.itemId}: Inline Figure path does not exist: ${figure.path || '(empty)'}`)
      if (candidate.coverPath === figure.path) fail(batchPath, `${candidate.itemId}: coverPath equals Inline Figure path`)
      if (!figure.legacy) {
        for (const field of ['placement', 'caption', 'caption_zh', 'source', 'source_zh']) {
          if (!String(figure[field] || '').trim()) fail(batchPath, `${candidate.itemId}: Inline Figure missing ${field}`)
        }
      }
    }

    if (batch.date >= INLINE_CONTRACT_EFFECTIVE_DATE) {
      if (candidate.coverGate !== 'PASS') fail(batchPath, `${candidate.itemId}: coverGate must be PASS`)
      if (candidate.inlineVisualGate !== 'PASS') fail(batchPath, `${candidate.itemId}: inlineVisualGate must be PASS`)
      if (candidate.layoutGate !== 'PASS') fail(batchPath, `${candidate.itemId}: layoutGate must be PASS`)
    }
  }
}

for (const root of PUBLIC_COLUMN_ROOTS) {
  for (const articlePath of walk(join(ROOT, root)).filter((path) => /\d{4}-\d{2}-\d{2}-.*\.md$/.test(path))) {
    validateArticle(articlePath, 'published')
  }
}

for (const articlePath of walk(join(ROOT, 'staging/publication-candidates')).filter((path) => /\d{4}-\d{2}-\d{2}-.*\.(zh|en)\.md$/.test(path))) {
  validateArticle(articlePath, 'candidate')
}

for (const batchPath of walk(join(ROOT, 'research/runtime/candidates')).filter((path) => /\d{4}-\d{2}-\d{2}-candidates\.json$/.test(path))) {
  validateCandidateBatch(batchPath)
}

if (errors.length) {
  console.error(`Research Publication Layout validation failed with ${errors.length} error(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`Research Publication Layout validation passed: ${articleCount} article files, ${inlineFigureCount} Inline Figures, ${candidateBatchCount} candidate batches.`)
}
