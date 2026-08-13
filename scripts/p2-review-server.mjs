import { createServer } from 'node:http'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const UI_ROOT = join(ROOT, 'internal/p2-review')
const REGISTRY_PATH = join(ROOT, 'research/intelligence/REGISTRY.json')
const CONTRACT_PATH = join(ROOT, 'research/intelligence/P2-SPECIAL-STUDY-CONTRACT.md')
const RUN_ROOT = join(ROOT, 'research/intelligence/p2-runs')
const STUDY_ROOT = join(ROOT, 'research/intelligence/p2-studies')
const REVIEW_ROOT = join(ROOT, 'research/intelligence/p2-reviews')
const HOST = '127.0.0.1'
const PORT = Number(process.env.P2_REVIEW_PORT || 4174)
const DECISIONS = new Set(['Approved Internal', 'Revision Required', 'Promote to Article Candidate', 'Archived'])

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

function repoPath(path) {
  return relative(ROOT, path).split(sep).join('/')
}

function within(base, path) {
  const root = `${resolve(base)}${sep}`
  const target = resolve(path)
  return target === resolve(base) || target.startsWith(root)
}

function allowedContentPath(input) {
  const path = resolve(ROOT, String(input || ''))
  if (path === CONTRACT_PATH || within(STUDY_ROOT, path)) return path
  throw new Error('path is outside the P2 review surface')
}

function p2Objects(registry) {
  return (registry.pipelines || []).flatMap((pipeline) => [
    ...(pipeline.repositories || []).filter((item) => item.tier === 'P2').map((item) => ({
      id: `github:${item.repository}`,
      name: item.repository,
      frequency: item.frequency,
      category: item.category_zh || item.category,
      trigger: item.specialStudyTrigger_zh || item.specialStudyTrigger,
      url: `https://github.com/${item.repository}`
    })),
    ...(pipeline.sources || []).filter((item) => item.tier === 'P2').map((item) => ({
      id: `source:${item.id}`,
      name: item.name_zh || item.name || item.id,
      frequency: item.frequency,
      category: item.category_zh || item.category || item.id,
      trigger: item.specialStudyTrigger_zh || item.specialStudyTrigger,
      url: item.url
    }))
  ])
}

function studyTitle(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : fallback
}

function loadReviews() {
  return Object.fromEntries(walk(REVIEW_ROOT)
    .filter((path) => path.endsWith('.review.json'))
    .map((path) => {
      const review = readJson(path)
      return [review.studyPath, { ...review, path: repoPath(path) }]
    }))
}

function state() {
  const registry = readJson(REGISTRY_PATH)
  const reviews = loadReviews()
  const studies = walk(STUDY_ROOT)
    .filter((path) => path.endsWith('.md'))
    .map((path) => {
      const markdown = readFileSync(path, 'utf8')
      const pathInRepo = repoPath(path)
      return {
        path: pathInRepo,
        title: studyTitle(markdown, basename(path, '.md')),
        date: basename(path).slice(0, 10),
        review: reviews[pathInRepo] || null
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
  const runs = walk(RUN_ROOT)
    .filter((path) => path.endsWith('-p2-special.json'))
    .map((path) => ({ ...readJson(path), path: repoPath(path) }))
    .sort((a, b) => b.date.localeCompare(a.date))
  return {
    schema: 'p2-review-center-data/v1',
    generatedAt: new Date().toISOString(),
    contractPath: repoPath(CONTRACT_PATH),
    objects: p2Objects(registry),
    studies,
    runs,
    counts: {
      objects: p2Objects(registry).length,
      pending: studies.filter((item) => !item.review || item.review.currentDecision === 'Revision Required').length,
      approved: studies.filter((item) => item.review?.currentDecision === 'Approved Internal').length,
      promoted: studies.filter((item) => item.review?.currentDecision === 'Promote to Article Candidate').length
    }
  }
}

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  })
  res.end(type.startsWith('application/json') ? JSON.stringify(body) : body)
}

function mime(path) {
  return ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' })[extname(path)] || 'text/plain; charset=utf-8'
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    let body = ''
    req.setEncoding('utf8')
    req.on('data', (chunk) => {
      body += chunk
      if (body.length > 65536) reject(new Error('request body is too large'))
    })
    req.on('end', () => {
      try { resolveBody(JSON.parse(body || '{}')) }
      catch { reject(new Error('request body is not valid JSON')) }
    })
    req.on('error', reject)
  })
}

function reviewPath(studyPath) {
  const source = allowedContentPath(studyPath)
  if (!within(STUDY_ROOT, source) || !existsSync(source)) throw new Error('study does not exist')
  const relativeStudy = relative(STUDY_ROOT, source)
  return join(REVIEW_ROOT, dirname(relativeStudy), `${basename(relativeStudy, '.md')}.review.json`)
}

function saveReview(input) {
  const studyPath = repoPath(allowedContentPath(input.studyPath))
  if (!DECISIONS.has(input.decision)) throw new Error('invalid review decision')
  const notes = String(input.notes || '').trim()
  const reviewer = String(input.reviewer || 'Manual Reviewer').trim().slice(0, 100)
  if (notes.length > 5000) throw new Error('review notes exceed 5000 characters')
  const path = reviewPath(studyPath)
  const existing = existsSync(path) ? readJson(path) : null
  const event = { decision: input.decision, notes, reviewer, reviewedAt: new Date().toISOString() }
  const review = {
    schema: 'p2-special-study-review/v1',
    version: '1.0',
    studyPath,
    currentDecision: input.decision,
    updatedAt: event.reviewedAt,
    history: [...(existing?.history || []), event]
  }
  mkdirSync(dirname(path), { recursive: true })
  const temporary = `${path}.tmp`
  writeFileSync(temporary, `${JSON.stringify(review, null, 2)}\n`, 'utf8')
  renameSync(temporary, path)
  execFileSync(process.execPath, [join(ROOT, 'scripts/p2-special-study.mjs'), 'build'], {
    cwd: ROOT,
    stdio: 'ignore'
  })
  return { ...review, path: repoPath(path) }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${HOST}:${PORT}`)
    if (req.method === 'GET' && url.pathname === '/api/state') return send(res, 200, state())
    if (req.method === 'GET' && url.pathname === '/api/content') {
      const path = allowedContentPath(url.searchParams.get('path'))
      if (!existsSync(path)) return send(res, 404, { error: 'content not found' })
      return send(res, 200, readFileSync(path, 'utf8'), 'text/markdown; charset=utf-8')
    }
    if (req.method === 'POST' && url.pathname === '/api/review') {
      const input = await readBody(req)
      return send(res, 200, { ok: true, review: saveReview(input) })
    }
    if (req.method !== 'GET') return send(res, 405, { error: 'method not allowed' })
    const assetName = url.pathname === '/' ? 'index.html' : url.pathname.slice(1)
    const assetPath = resolve(UI_ROOT, assetName)
    if (!within(UI_ROOT, assetPath) || !existsSync(assetPath) || statSync(assetPath).isDirectory()) {
      return send(res, 404, 'Not found', 'text/plain; charset=utf-8')
    }
    return send(res, 200, readFileSync(assetPath), mime(assetPath))
  } catch (error) {
    return send(res, 400, { error: error.message })
  }
})

server.listen(PORT, HOST, () => {
  console.log(`P2 internal review center: http://${HOST}:${PORT}`)
  console.log('This local-only server is not part of the GitHub Pages build.')
})
