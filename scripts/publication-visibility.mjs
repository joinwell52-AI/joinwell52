#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const dist = path.join(root, 'docs', '.vitepress', 'dist')
const docsDir = path.join(root, 'docs')
const releasesDir = path.join(root, 'research', 'runtime', 'releases')
const researchNotesComponent = path.join(root, 'docs', '.vitepress', 'theme', 'components', 'ResearchNotes.vue')

function fail(message) {
  console.error(`[publication-visibility] FAIL: ${message}`)
  process.exitCode = 1
}

function shanghaiDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date())
}

function relativeRouteForDoc(docPath) {
  return docPath.replace(/^docs\//, '').replace(/\.md$/, '')
}

function htmlPathForDoc(docPath) {
  // VitePress cleanUrls=true emits foo/bar.html while serving /foo/bar.
  return path.join(dist, `${relativeRouteForDoc(docPath)}.html`)
}

function routeNeedle(docPath) {
  return relativeRouteForDoc(docPath)
}

function read(file) {
  return fs.readFileSync(file, 'utf8')
}

function walkMarkdown(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.vitepress' || entry.name === 'public') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walkMarkdown(full))
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(full)
  }
  return out
}

function frontmatterScalar(block, key) {
  const line = block.split(/\r?\n/).find((value) => value.startsWith(`${key}:`))
  if (!line) return ''
  let value = line.slice(key.length + 1).trim()
  if (
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
  ) {
    value = value.slice(1, -1)
  }
  return value
}

function noteInventory() {
  const columns = new Set(['digital-employee', 'industry-architecture', 'open-source-engineering'])
  const categories = new Set(['daily', 'weekly', 'academic', 'manifesto', 'visual-essay'])
  const notes = []

  for (const file of walkMarkdown(docsDir)) {
    const src = read(file)
    const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
    if (!match) continue

    const block = match[1]
    const title = frontmatterScalar(block, 'title')
    const date = frontmatterScalar(block, 'date')
    const column = frontmatterScalar(block, 'column')
    const category = frontmatterScalar(block, 'category')
    if (!title || !date || !columns.has(column) || !categories.has(category)) continue

    const docPath = path.relative(root, file).split(path.sep).join('/')
    const needle = routeNeedle(docPath)
    notes.push({
      title,
      date,
      column,
      needle,
      lang: needle.startsWith('zh/') ? 'zh' : 'en'
    })
  }

  return notes.sort((a, b) => {
    const byDate = b.date.localeCompare(a.date)
    return byDate || a.title.localeCompare(b.title)
  })
}

function resolvePageSize() {
  if (!fs.existsSync(researchNotesComponent)) {
    fail('ResearchNotes.vue is missing; cannot verify paginated index discoverability.')
    return null
  }
  const match = read(researchNotesComponent).match(/\bconst\s+pageSize\s*=\s*(\d+)/)
  if (!match) {
    fail('ResearchNotes.vue pageSize could not be resolved; refusing to guess pagination behavior.')
    return null
  }
  return Number(match[1])
}

function verifyPaginatedIndex({ itemId, lang, needle, html, notes, pageSize, scope }) {
  if (html.includes(needle)) return

  const index = notes.findIndex((note) => note.lang === lang && note.needle === needle)
  if (index < 0) {
    fail(`${itemId} ${lang} is absent from the ResearchNotes loader inventory (${needle})`)
    return
  }

  // ResearchNotes SSR renders page 1 only. A note beyond page 1 remains discoverable
  // through the component's client-side pagination, so absence from index.html alone is
  // not a visibility failure. Conversely, a page-1 note missing from SSR is a real defect.
  if (index < pageSize) {
    fail(`${itemId} ${lang} should be on page 1 of ${scope} but is absent from generated HTML (${needle})`)
    return
  }

  const page = Math.floor(index / pageSize) + 1
  console.log(`[publication-visibility] ${itemId} ${lang} is discoverable on ${scope} page ${page} (${needle})`)
}

if (!fs.existsSync(dist)) {
  fail('VitePress dist directory does not exist. Run docs:build first.')
  process.exit()
}

if (!fs.existsSync(releasesDir)) {
  console.log('[publication-visibility] no release directory; nothing to verify')
  process.exit()
}

const releaseFiles = fs.readdirSync(releasesDir)
  .filter((name) => /^\d{4}-\d{2}-\d{2}-publication\.json$/.test(name))
  .sort()

if (!releaseFiles.length) {
  console.log('[publication-visibility] no publication release manifests; nothing to verify')
  process.exit()
}

const latestName = releaseFiles.at(-1)
const releasePath = path.join(releasesDir, latestName)
const release = JSON.parse(read(releasePath))
const today = shanghaiDate()

if (release.status !== 'Released') {
  fail(`${latestName} status is ${release.status}, expected Released`)
  process.exit()
}

if (release.date > today) {
  fail(`${latestName} has future release date ${release.date} while Shanghai today is ${today}`)
  process.exit()
}

const items = Array.isArray(release.releasedItems) ? release.releasedItems : []
if (!items.length) {
  fail(`${latestName} has no releasedItems`)
  process.exit()
}

const researchIndexHtml = {
  zh: read(path.join(dist, 'zh', 'research', 'index.html')),
  en: read(path.join(dist, 'en', 'research', 'index.html'))
}

const columnIndex = {
  'digital-employee': { zh: 'zh/digital-employee/index.html', en: 'en/digital-employee/index.html' },
  'industry-architecture': { zh: 'zh/industry/index.html', en: 'en/industry/index.html' },
  'open-source-engineering': { zh: 'zh/engineering/index.html', en: 'en/engineering/index.html' }
}

const notes = noteInventory()
const pageSize = resolvePageSize()
if (!pageSize) process.exit()

for (const item of items) {
  for (const lang of ['zh', 'en']) {
    const docPath = item[lang]
    if (!docPath || !fs.existsSync(path.join(root, docPath))) {
      fail(`${item.itemId} missing ${lang} source document: ${docPath || '(empty)'}`)
      continue
    }

    const generated = htmlPathForDoc(docPath)
    if (!fs.existsSync(generated)) {
      fail(`${item.itemId} missing generated public route: ${generated}`)
      continue
    }

    const needle = routeNeedle(docPath)
    const localizedNotes = notes.filter((note) => note.lang === lang)
    verifyPaginatedIndex({
      itemId: item.itemId,
      lang,
      needle,
      html: researchIndexHtml[lang],
      notes: localizedNotes,
      pageSize,
      scope: 'Research index'
    })

    const columnRoute = columnIndex[item.column]?.[lang]
    if (!columnRoute) {
      fail(`${item.itemId} has unsupported column ${item.column}`)
      continue
    }
    const columnHtmlPath = path.join(dist, columnRoute)
    if (!fs.existsSync(columnHtmlPath)) {
      fail(`${item.itemId} missing generated column index: ${columnRoute}`)
      continue
    }
    const columnHtml = read(columnHtmlPath)
    const columnNotes = localizedNotes.filter((note) => note.column === item.column)
    verifyPaginatedIndex({
      itemId: item.itemId,
      lang,
      needle,
      html: columnHtml,
      notes: columnNotes,
      pageSize,
      scope: `${item.column} index`
    })
  }

  if (item.cover && !fs.existsSync(path.join(root, item.cover))) {
    fail(`${item.itemId} missing cover asset: ${item.cover}`)
  }
}

if (!process.exitCode) {
  console.log(`[publication-visibility] PASS ${release.date}: ${items.length} released items are routable and discoverable from paginated Research and column indexes in both languages; homepage promotion is optional; pageSize=${pageSize}; Shanghai today=${today}.`)
}
