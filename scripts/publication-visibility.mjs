#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const dist = path.join(root, 'docs', '.vitepress', 'dist')
const releasesDir = path.join(root, 'research', 'runtime', 'releases')

function fail(message) {
  console.error(`[publication-visibility] FAIL: ${message}`)
  process.exitCode = 1
}

function htmlPathForDoc(docPath) {
  const relative = docPath.replace(/^docs\//, '').replace(/\.md$/, '')
  return path.join(dist, relative, 'index.html')
}

function publicHrefForDoc(docPath) {
  return `/${docPath.replace(/^docs\//, '').replace(/\.md$/, '')}`
}

function read(file) {
  return fs.readFileSync(file, 'utf8')
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

// Verify the latest formal Daily Publication release. Older releases remain immutable evidence;
// the latest release is the one a user must be able to discover immediately after deployment.
const latestName = releaseFiles.at(-1)
const releasePath = path.join(releasesDir, latestName)
const release = JSON.parse(read(releasePath))

if (release.status !== 'Released') {
  fail(`${latestName} status is ${release.status}, expected Released`)
  process.exit()
}

const items = Array.isArray(release.releasedItems) ? release.releasedItems : []
if (!items.length) {
  fail(`${latestName} has no releasedItems`)
  process.exit()
}

const indexHtml = {
  zh: read(path.join(dist, 'zh', 'research', 'index.html')),
  en: read(path.join(dist, 'en', 'research', 'index.html'))
}

const columnIndex = {
  'digital-employee': { zh: 'zh/digital-employee/index.html', en: 'en/digital-employee/index.html' },
  'industry-architecture': { zh: 'zh/industry/index.html', en: 'en/industry/index.html' },
  'open-source-engineering': { zh: 'zh/engineering/index.html', en: 'en/engineering/index.html' }
}

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

    const href = publicHrefForDoc(docPath)
    // VitePress uses the configured base at render time; matching the base-independent
    // tail protects both local builds and GitHub Pages deployments.
    const hrefTail = href.replace(/^\/(zh|en)\//, '/')
    if (!indexHtml[lang].includes(hrefTail) && !indexHtml[lang].includes(href)) {
      fail(`${item.itemId} ${lang} is not discoverable from the Research index (${href})`)
    }

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
    if (!columnHtml.includes(hrefTail) && !columnHtml.includes(href)) {
      fail(`${item.itemId} ${lang} is not discoverable from its column index (${columnRoute})`)
    }
  }

  if (item.cover && !fs.existsSync(path.join(root, item.cover))) {
    fail(`${item.itemId} missing cover asset: ${item.cover}`)
  }
}

if (!process.exitCode) {
  console.log(`[publication-visibility] PASS ${release.date}: ${items.length} released items are routable and discoverable in both languages.`)
}
