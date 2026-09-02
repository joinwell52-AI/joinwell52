#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import cp from 'node:child_process'

function arg(name) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : ''
}
const date = arg('date')
const wake = arg('wake')
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Invalid --date')
if (!/^research\/runtime\/wakes\/.+\.json$/.test(wake)) throw new Error('Invalid --wake')
const [year, month] = date.split('-')
const recordPath = `research/runtime/records/daily/${year}/${month}/${date}-daily-runtime.json`
const productionResultPath = `research/runtime/results/${year}/${month}/${date}-production-result.json`
const batchPath = `research/runtime/candidates/${year}/${month}/${date}-candidates.json`
const resultPath = `research/runtime/results/${year}/${month}/${date}-publication-result.json`
const releasePath = `research/runtime/releases/${date}-publication.json`

const scheduler = JSON.parse(fs.readFileSync('research/runtime/SCHEDULER.json', 'utf8'))
if (scheduler.schema !== 'research-runtime-scheduler/v3' || scheduler.version !== '3.0' || scheduler.timezone !== 'Asia/Shanghai') throw new Error('Unexpected Scheduler identity')
const control = JSON.parse(fs.readFileSync(scheduler.workerControlManifest, 'utf8'))
const task = control.tasks?.publication
if (control.state !== 'active' || control.failClosed !== true || control.sourceBranch !== 'main' || !control.allowedBranches.includes('main') || !Array.isArray(control.allowedWakeSources) || control.allowedWakeSources.length === 0) throw new Error('Publication admission denied')
if (!task || task.state !== 'active' || task.family !== 'daily' || task.directPublicationAllowed !== true || task.requireSameRunDateInputs !== true || task.prompt?.version !== '2.0.0') throw new Error('Publication task not active')
const promptHash = crypto.createHash('sha256').update(fs.readFileSync(task.prompt.path)).digest('hex')
if (promptHash !== task.prompt.sha256) throw new Error(`Publication prompt SHA mismatch ${promptHash}`)
for (const source of task.prompt.requiredSources || []) {
  if (!fs.existsSync(source)) throw new Error(`Missing required source ${source}`)
  fs.readFileSync(source)
}
const receipt = JSON.parse(fs.readFileSync(wake, 'utf8'))
if (receipt.schema !== 'runtime-wake-receipt/v1' || receipt.date !== date || receipt.timezone !== 'Asia/Shanghai' || receipt.nominalTask !== 'publication' || receipt.nominalTime !== '20:00' || !control.allowedWakeSources.includes(receipt.source) || receipt.status !== 'Received') throw new Error('Wake Receipt invalid')
const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'))
if (record.date !== date || record.taskStatus?.production !== 'Completed' || record.taskStatus?.publication !== 'Running') throw new Error('Publication Runtime authority absent')
const timeline = record.timeline || []
let start = -1
for (let i = timeline.length - 1; i >= 0; i -= 1) {
  const e = timeline[i]
  if (e.task === 'publication' && e.event === 'Execution Slot Opened' && e.status === 'Running' && String(e.time || '').startsWith(date)) { start = i; break }
}
if (start < 0) throw new Error('Missing Publication Execution Slot Opened')
const claim = timeline.slice(start + 1).reverse().find(e => e.task === 'publication' && e.event === 'Worker Claimed' && e.status === 'Running' && String(e.time || '').startsWith(date) && String(e.detail || '').includes(wake))
if (!claim) throw new Error('Missing fresh Publication Worker Claimed bound to Wake Receipt')
const production = JSON.parse(fs.readFileSync(productionResultPath, 'utf8'))
if (production.schema !== 'runtime-shift-result/v2' || production.task !== 'production' || production.runtimeDate !== date || production.status !== 'Completed') throw new Error('Production result invalid')
const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'))
const editorial = JSON.parse(fs.readFileSync('research/editorial/EDITORIAL-ARCHITECTURE.json', 'utf8'))
if (batch.schema !== 'runtime-publication-candidate/v2' || batch.date !== date || batch.status !== 'Completed' || !Array.isArray(batch.candidates) || batch.candidates.length > task.maxOutputItems) throw new Error('Candidate batch invalid')
for (const c of batch.candidates) {
  if (!String(c.itemId || '').startsWith(`Q-${date.replaceAll('-', '')}-`)) throw new Error(`Wrong-date candidate ${c.itemId}`)
  for (const gate of editorial.v21RequiredGates || []) if (c.gates?.[gate] !== 'PASS') throw new Error(`${c.itemId} gate ${gate} failed`)
  if (c.coverGate !== 'PASS' || c.inlineVisualGate !== 'PASS' || c.layoutGate !== 'PASS' || c.evidenceStatus !== 'Completed' || c.editingStatus !== 'Completed') throw new Error(`${c.itemId} release gate failed`)
  for (const p of [c.zhPath, c.enPath, c.coverPath, c.articleBriefPath, c.argumentArchitecturePath, c.figurePlanPath]) if (!p || !fs.existsSync(p)) throw new Error(`Missing candidate artifact ${p}`)
  const brief = JSON.parse(fs.readFileSync(c.articleBriefPath, 'utf8'))
  const argument = JSON.parse(fs.readFileSync(c.argumentArchitecturePath, 'utf8'))
  const figure = JSON.parse(fs.readFileSync(c.figurePlanPath, 'utf8'))
  if (brief.schema !== 'article-brief/v1' || brief.date !== date || brief.itemId !== c.itemId || brief.editorialDecision !== 'PASS') throw new Error(`Invalid Article Brief ${c.itemId}`)
  if (argument.schema !== 'argument-architecture/v1' || argument.date !== date || argument.itemId !== c.itemId || argument.coreProposition !== c.coreProposition || new Set((argument.argumentNodes || []).map(n => n.nodeId)).size < 2) throw new Error(`Invalid Argument Architecture ${c.itemId}`)
  if (figure.schema !== 'article-figure-plan/v1' || figure.date !== date || figure.itemId !== c.itemId) throw new Error(`Invalid Figure Plan ${c.itemId}`)
  const nodeIds = new Set((argument.argumentNodes || []).map(n => n.nodeId))
  for (const f of figure.inlineFigures || []) if (!nodeIds.has(f.argumentNodeId)) throw new Error(`Orphan planned figure ${c.itemId}`)
  if (c.communityEdition?.decision === 'generated') throw new Error(`Community Edition requires separate authorization ${c.itemId}`)
}

const dirs = { 'digital-employee': 'digital-employee', 'industry-architecture': 'industry', 'open-source-engineering': 'engineering' }
const kickerEn = { 'digital-employee': 'Digital Employee · Daily Research', 'industry-architecture': 'Industry Architecture · Daily Research', 'open-source-engineering': 'Open-source Engineering · Daily Research' }
const kickerZh = { 'digital-employee': '数字员工 · 每日研究', 'industry-architecture': '行业架构 · 每日研究', 'open-source-engineering': '开源工程 · 每日研究' }
function scalar(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  if (!m) throw new Error(`Missing frontmatter ${key}`)
  const raw = m[1].trim()
  if (raw.startsWith('"')) return JSON.parse(raw)
  if (raw.startsWith("'")) return raw.slice(1, -1)
  return raw
}
function sources(fm) {
  const lines = fm.split(/\r?\n/)
  const i = lines.findIndex(line => /^sources:\s*$/.test(line))
  if (i < 0) throw new Error('Missing sources')
  const out = []
  for (let j = i + 1; j < lines.length; j += 1) {
    const m = lines[j].match(/^\s{2}-\s+(.+)$/)
    if (!m) break
    out.push(m[1].trim())
  }
  if (!out.length) throw new Error('Empty sources')
  return out
}
const escapeAttr = s => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
function render(c, language, publicCover, otherRoute) {
  const sourcePath = language === 'en' ? c.enPath : c.zhPath
  const raw = fs.readFileSync(sourcePath, 'utf8')
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!match) throw new Error(`Missing frontmatter ${sourcePath}`)
  const fm = match[1]
  let body = raw.slice(match[0].length)
  body = body.replace(/^\s*!\[[^\]]*\]\([^\n]+\)\s*/, '').replace(/^\s+/, '')
  const title = scalar(fm, 'title')
  const summary = scalar(fm, 'summary')
  const articleType = scalar(fm, 'article_type')
  const srcs = sources(fm)
  const frontmatter = ['---', `title: ${JSON.stringify(title)}`, `date: '${date}'`, `column: ${c.column}`, 'category: daily', `article_type: ${articleType}`, 'edition: research-center', `research_question: ${JSON.stringify(c.researchQuestion)}`, `summary: ${JSON.stringify(summary)}`, 'sources:', ...srcs.map(s => `  - ${s}`), `item_id: ${JSON.stringify(c.itemId)}`, 'lifecycle: "Published"', `cover: ${JSON.stringify(publicCover)}`, 'evidence_status: "Completed"', 'citation_status: "Completed"', 'editing_status: "Completed"', 'publication_authorized: true', '---', ''].join('\n')
  const component = ['<ArticleCover', `  image="${escapeAttr(publicCover)}"`, `  kicker="${escapeAttr(language === 'en' ? kickerEn[c.column] : kickerZh[c.column])}"`, `  title="${escapeAttr(title)}"`, `  summary="${escapeAttr(summary)}"`, `  version="${escapeAttr(c.itemId)}"`, `  status="Daily Runtime V5 · ${date}"`, `  languageHref="${escapeAttr(otherRoute)}"`, `  languageLabel="${language === 'en' ? '中文' : 'English'}"`, '/>', '', ''].join('\n')
  return `${frontmatter}\n${component}${body}`
}

const releasedItems = []
const publicArtifacts = []
let inlineFigureAssets = 0
for (const c of batch.candidates) {
  const dir = dirs[c.column]
  if (!dir) throw new Error(`Unknown column ${c.column}`)
  const enBase = path.basename(c.enPath).replace(/\.en\.md$/, '')
  const zhBase = path.basename(c.zhPath).replace(/\.zh\.md$/, '')
  if (enBase !== zhBase) throw new Error(`Bilingual slug mismatch ${c.itemId}`)
  const slug = enBase
  const en = `docs/en/${dir}/${slug}.md`
  const zh = `docs/zh/${dir}/${slug}.md`
  const cover = `docs/public/assets/covers/daily-${slug}-cover.png`
  const publicCover = `/assets/covers/daily-${slug}-cover.png`
  fs.mkdirSync(path.dirname(en), { recursive: true })
  fs.mkdirSync(path.dirname(zh), { recursive: true })
  fs.mkdirSync(path.dirname(cover), { recursive: true })
  fs.writeFileSync(en, render(c, 'en', publicCover, `/zh/${dir}/${slug}`))
  fs.writeFileSync(zh, render(c, 'zh', publicCover, `/en/${dir}/${slug}`))
  fs.copyFileSync(c.coverPath, cover)
  const inlineFigures = []
  for (const fig of c.inlineFigures || []) {
    const source = fig.path || fig.assetPath || fig.source
    if (!source || !fs.existsSync(source)) throw new Error(`Missing inline figure ${c.itemId}`)
    const ext = path.extname(source)
    const out = `docs/public/assets/figures/daily-${slug}-${inlineFigures.length + 1}${ext}`
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.copyFileSync(source, out)
    inlineFigures.push(out)
    publicArtifacts.push(out)
    inlineFigureAssets += 1
  }
  releasedItems.push({ itemId: c.itemId, column: c.column, zh, en, cover, inlineFigures })
  publicArtifacts.push(zh, en, cover)
}

fs.mkdirSync(path.dirname(releasePath), { recursive: true })
const release = {
  schema: 'runtime-publication-release/v1', date, timezone: 'Asia/Shanghai', status: 'Released',
  sourceCandidates: batchPath, sourceProductionResult: productionResultPath, wakeReceipt: wake,
  workerClaimRecord: recordPath,
  workerClaimCommit: cp.execFileSync('git', ['log', '-1', '--format=%H', '--', recordPath], { encoding: 'utf8' }).trim(),
  startStateCommit: cp.execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  releaseContentCommit: 'pending', schedulerFallback: false, editorialArchitectureVersion: '2.1', releasedItems,
  metrics: { eligibleCandidates: batch.candidates.length, releasedItems: releasedItems.length, bilingualArticleFiles: releasedItems.length * 2, coverAssets: releasedItems.length, inlineFigureAssets, communityEditions: 0, visualizationAssets: releasedItems.length + inlineFigureAssets },
  prohibitionsObserved: { newResearch: 0, substantiveRewriting: 0, evidenceRepair: 0 }
}
fs.writeFileSync(releasePath, `${JSON.stringify(release, null, 2)}\n`)
const result = {
  schema: 'runtime-shift-result/v2', task: 'publication', family: 'daily', runtimeDate: date, status: 'Completed',
  input: { candidateBatch: batchPath, productionResult: productionResultPath, wakeReceipt: wake, executionType: 'scheduled-same-day-publication' },
  workResult: {
    summary: `Mechanically released ${releasedItems.length} complete same-date Editorial Architecture 2.1 candidates as ${releasedItems.length * 2} bilingual Research Center articles and ${releasedItems.length} existing canonical raster covers. No new research, substantive rewriting or evidence repair was performed.`,
    summary_zh: `机械发布同日 ${releasedItems.length} 组完整 Editorial Architecture 2.1 Candidate，形成 ${releasedItems.length * 2} 篇双语 Research Center 文章和 ${releasedItems.length} 张既有规范栅格题图。全程未开展新研究、实质性改写或证据修复。`
  },
  output: { type: 'Released Daily Research', outcome: 'Released', releaseManifest: releasePath, releasedItems: releasedItems.length, bilingualArticleFiles: releasedItems.length * 2, coverAssets: releasedItems.length, inlineFigureAssets, communityEditions: 0 },
  next: { instruction: 'Finalize Publication only after required validators, site build, release visibility and durable main verification pass.', instruction_zh: '仅在必需校验、网站构建、发布可见性与 main 持久核验全部通过后，才收口 Publication。' },
  metrics: [
    { name: 'eligible_publication_candidates', value: batch.candidates.length },
    { name: 'released_items', value: releasedItems.length },
    { name: 'bilingual_article_files', value: releasedItems.length * 2 },
    { name: 'cover_assets', value: releasedItems.length },
    { name: 'inline_figure_assets', value: inlineFigureAssets },
    { name: 'new_research_actions', value: 0 },
    { name: 'substantive_rewrites', value: 0 },
    { name: 'evidence_repairs', value: 0 },
    { name: 'revision_rounds_used', value: 0 }
  ],
  evidence: [batchPath, productionResultPath, task.prompt.path, wake, recordPath],
  artifacts: [...publicArtifacts, releasePath, resultPath],
  startedAt: claim.time
}
fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`)
console.log(`Publication materialized: ${releasedItems.length} items; prompt SHA-256 ${promptHash}; Worker Claimed ${claim.time}.`)
