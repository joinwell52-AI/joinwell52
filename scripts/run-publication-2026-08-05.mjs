#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const DATE = '2026-08-05'
const RECORD = `research/runtime/records/daily/2026/08/${DATE}-daily-runtime.json`
const LEDGER = `research/runtime/2026/08/${DATE}-runtime.md`
const SCHEDULER = 'research/runtime/SCHEDULER.json'
const BATCH = `research/runtime/candidates/2026/08/${DATE}-candidates.json`
const SELF = 'scripts/run-publication-2026-08-05.mjs'
const WORKFLOW = '.github/workflows/run-publication-2026-08-05.yml'
const sections = {
  'digital-employee': 'digital-employee',
  'industry-architecture': 'industry',
  'open-source-engineering': 'engineering'
}
const columnNames = {
  'digital-employee': { zh: '数字员工', en: 'Digital Employee' },
  'industry-architecture': { zh: '行业架构', en: 'Industry Architecture' },
  'open-source-engineering': { zh: '开源工程', en: 'Open-source Engineering' }
}

function sh(command, capture = false) {
  return execSync(command, { encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit' }).trim()
}
function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')) }
function writeJson(file, value) { fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`) }
function nowShanghai() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date()).filter(x => x.type !== 'literal').map(x => [x.type, x.value]))
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}+08:00`
}
function appendEvent(record, event, status, detail, time = nowShanghai()) {
  record.timeline ||= []
  record.timeline.push({ time, task: 'publication', event, status, detail })
  return time
}
function renderLedger() {
  sh(`node scripts/runtime-markdown.mjs render --date ${DATE}`)
  if (!fs.existsSync(LEDGER)) throw new Error(`Missing rendered ledger ${LEDGER}`)
}
function verifyProjection(record, markdown) {
  for (const item of record.timeline || []) {
    if (!markdown.includes(item.time)) throw new Error(`Markdown omitted timeline time ${item.time}`)
    if (!markdown.includes(item.event)) throw new Error(`Markdown omitted timeline event ${item.event}`)
  }
  for (const result of Object.values(record.results || {})) {
    for (const key of ['input', 'workResult', 'output', 'next']) {
      if (!result?.[key]) continue
      if (!markdown.includes(result[key]) && !(result[`${key}_zh`] && markdown.includes(result[`${key}_zh`]))) {
        throw new Error(`Markdown omitted ${result.task}.${key}`)
      }
    }
  }
}
function commitPush(message, selected = null) {
  if (selected) {
    for (const file of selected) sh(`git add -- ${JSON.stringify(file)}`)
  } else {
    sh('git add -A')
  }
  const staged = sh('git diff --cached --name-only', true)
  if (!staged) throw new Error(`No staged changes for ${message}`)
  sh(`git commit -m ${JSON.stringify(message)}`)
  const sha = sh('git rev-parse HEAD', true)
  sh('git push origin HEAD:main')
  sh('git fetch origin main')
  const remote = sh('git rev-parse origin/main', true)
  if (remote !== sha) throw new Error(`Remote main mismatch: ${remote} != ${sha}`)
  return sha
}
function verifyRecordCommit(sha, publicationStatus, event) {
  const jsonText = sh(`git show ${sha}:${RECORD}`, true)
  const markdown = sh(`git show ${sha}:${LEDGER}`, true)
  const record = JSON.parse(jsonText)
  if (record.taskStatus?.publication !== publicationStatus) throw new Error(`Publication status mismatch at ${sha}`)
  if (event && !(record.timeline || []).some(x => x.task === 'publication' && x.event === event)) throw new Error(`Missing ${event} at ${sha}`)
  verifyProjection(record, markdown)
  return record
}
function parseCandidate(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error('Candidate lacks frontmatter')
  const meta = {}
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!m) continue
    let value = m[2].trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
    if (value === 'true') value = true
    if (value === 'false') value = false
    meta[m[1]] = value
  }
  const body = match[2].trim()
  const title = body.match(/^#\s+(.+)$/m)?.[1]?.trim()
  const summary = body.split(/\n\s*\n/).map(x => x.trim()).find(x => x && !x.startsWith('#') && !x.startsWith('<') && !x.startsWith('>')) || ''
  return { meta, body, title, summary }
}
function q(value) { return JSON.stringify(String(value)) }
function makePublic(parsed, candidate, lang, coverUrl, languageHref) {
  const names = columnNames[candidate.column]
  const title = parsed.title
  const summary = parsed.summary.replace(/\n/g, ' ')
  const kicker = lang === 'zh' ? `${names.zh} · 每日研究` : `${names.en} · Daily Research`
  const label = lang === 'zh' ? 'English' : '中文'
  const body = parsed.body
    .replace(/^>\s*编辑状态：.*尚未发布。\s*$/m, '')
    .replace(/^>\s*Editing status:.*not published.*$/mi, '')
    .trim()
  const frontmatter = [
    '---',
    `title: ${q(title)}`,
    `date: '${DATE}'`,
    `column: ${candidate.column}`,
    'category: daily',
    `summary: ${q(summary)}`,
    `item_id: ${candidate.itemId}`,
    `source_research_object: ${q(parsed.meta.source_research_object)}`,
    `source_reading_result: ${q(parsed.meta.source_reading_result)}`,
    'lifecycle: Published',
    'evidence_status: Completed',
    'citation_status: Completed',
    'editing_status: Completed',
    'publication_authorized: true',
    'outline: deep',
    '---'
  ].join('\n')
  const cover = [
    '<ArticleCover',
    `  image=${q(coverUrl)}`,
    `  kicker=${q(kicker)}`,
    `  title=${q(title)}`,
    `  summary=${q(summary)}`,
    `  version=${q(candidate.itemId)}`,
    `  status=${q(`Daily Runtime V5 · ${DATE}`)}`,
    `  languageHref=${q(languageHref)}`,
    `  languageLabel=${q(label)}`,
    '/>'
  ].join('\n')
  return `${frontmatter}\n\n${cover}\n\n${body}\n`
}
function validateCandidate(candidate, record) {
  if (!sections[candidate.column]) throw new Error(`${candidate.itemId}: unknown column`)
  if (candidate.lifecycle !== 'Publication Candidate') throw new Error(`${candidate.itemId}: lifecycle gate failed`)
  if (candidate.evidenceStatus !== 'Completed' || candidate.editingStatus !== 'Completed') throw new Error(`${candidate.itemId}: batch gate failed`)
  for (const file of [candidate.zhPath, candidate.enPath, candidate.coverPath]) if (!fs.existsSync(file)) throw new Error(`${candidate.itemId}: missing ${file}`)
  const zh = parseCandidate(fs.readFileSync(candidate.zhPath, 'utf8'))
  const en = parseCandidate(fs.readFileSync(candidate.enPath, 'utf8'))
  const required = ['date','column','item_id','lifecycle','source_research_object','source_reading_result','visualization','visualization_decision','evidence_status','citation_status','editing_status','publication_authorized']
  for (const article of [zh, en]) {
    for (const key of required) if (article.meta[key] === undefined || article.meta[key] === '') throw new Error(`${candidate.itemId}: missing metadata ${key}`)
    if (article.meta.date !== DATE || article.meta.column !== candidate.column || article.meta.item_id !== candidate.itemId) throw new Error(`${candidate.itemId}: metadata identity mismatch`)
    if (article.meta.lifecycle !== 'Publication Candidate' || article.meta.publication_authorized !== false) throw new Error(`${candidate.itemId}: candidate state gate failed`)
    if (article.meta.evidence_status !== 'Completed' || article.meta.citation_status !== 'Completed' || article.meta.editing_status !== 'Completed') throw new Error(`${candidate.itemId}: evidence/citation/editing gate failed`)
    if (article.meta.visualization !== candidate.coverPath || !String(article.meta.visualization_decision).startsWith('Required')) throw new Error(`${candidate.itemId}: visualization metadata gate failed`)
    if (!article.title || !article.summary) throw new Error(`${candidate.itemId}: title/summary gate failed`)
  }
  for (const key of ['date','column','item_id','source_research_object','source_reading_result','visualization']) if (zh.meta[key] !== en.meta[key]) throw new Error(`${candidate.itemId}: bilingual pair mismatch ${key}`)
  const svg = fs.readFileSync(candidate.coverPath, 'utf8')
  if (!svg.includes('<svg') || !svg.includes('</svg>')) throw new Error(`${candidate.itemId}: invalid SVG`)
  if (record.taskStatus?.production !== 'Completed' || record.results?.production?.status !== 'Completed') throw new Error('Production gate is not Completed')
  return { zh, en, svg }
}

sh('git config user.name "Research Runtime Publication"')
sh('git config user.email "actions@users.noreply.github.com"')
sh('git checkout main')
sh('git pull --ff-only origin main')

let record = readJson(RECORD)
if (record.date !== DATE || record.schema !== 'daily-runtime-record/v1') throw new Error('Daily Runtime Record identity mismatch')
if (record.taskStatus?.publication === 'Completed') process.exit(0)
if (record.taskStatus?.publication !== 'Waiting') throw new Error(`Publication is not Waiting: ${record.taskStatus?.publication}`)

record.status = 'Running'
record.taskStatus.publication = 'Running'
appendEvent(record, 'Execution Slot Opened', 'Running', 'Research Runtime Publication opened by Scheduler V3.0; release work may begin only after this synchronized JSON and Markdown start state is committed and verified.')
writeJson(RECORD, record)
renderLedger()
const startSha = commitPush('runtime(publication): open 2026-08-05 execution slot', [RECORD, LEDGER])
verifyRecordCommit(startSha, 'Running', 'Execution Slot Opened')

sh('git pull --ff-only origin main')
record = readJson(RECORD)
appendEvent(record, 'GitHub Commit Verified', 'Running', `Fetched and verified start-state commit ${startSha} containing synchronized Daily Runtime JSON and Markdown ledger.`)
writeJson(RECORD, record)
renderLedger()
const checkpointSha = commitPush('runtime(publication): verify 2026-08-05 start state', [RECORD, LEDGER])
verifyRecordCommit(checkpointSha, 'Running', 'GitHub Commit Verified')

sh('git pull --ff-only origin main')
const scheduler = readJson(SCHEDULER)
const publicationTask = scheduler.tasks?.find(x => x.id === 'publication' && x.family === 'daily')
if (!publicationTask || scheduler.version !== '3.0' || scheduler.resultContract !== 'runtime-shift-result/v2') throw new Error('Scheduler V3.0 Publication contract missing')
for (const item of ['New research','Substantive rewriting','Evidence repair']) if (!publicationTask.prohibitions?.includes(item)) throw new Error(`Missing prohibition ${item}`)
const batch = readJson(BATCH)
record = readJson(RECORD)
if (batch.date !== DATE || batch.status !== 'Completed' || batch.sourceTask !== 'Research Runtime Production') throw new Error('Publication Candidate batch gate failed')

const eligible = []
const rejected = []
for (const candidate of batch.candidates || []) {
  try { eligible.push({ candidate, ...validateCandidate(candidate, record) }) }
  catch (error) { rejected.push({ itemId: candidate.itemId || 'unknown', reason: error.message }) }
}

let releaseSha = null
const released = []
if (eligible.length) {
  for (const item of eligible) {
    const { candidate, zh, en, svg } = item
    const base = path.basename(candidate.zhPath).replace(/\.zh\.md$/, '')
    const slug = base.startsWith(`${DATE}-`) ? base.slice(DATE.length + 1) : base
    const section = sections[candidate.column]
    const zhTarget = `docs/zh/${section}/${DATE}-${slug}.md`
    const enTarget = `docs/en/${section}/${DATE}-${slug}.md`
    const coverTarget = `docs/public/assets/covers/daily-${DATE}-${slug}.svg`
    const coverUrl = `/assets/covers/daily-${DATE}-${slug}.svg`
    if (fs.existsSync(zhTarget) || fs.existsSync(enTarget) || fs.existsSync(coverTarget)) throw new Error(`Refusing to overwrite public artifact for ${candidate.itemId}`)
    fs.writeFileSync(zhTarget, makePublic(zh, candidate, 'zh', coverUrl, `/en/${section}/${DATE}-${slug}`))
    fs.writeFileSync(enTarget, makePublic(en, candidate, 'en', coverUrl, `/zh/${section}/${DATE}-${slug}`))
    fs.writeFileSync(coverTarget, svg)
    released.push({ itemId: candidate.itemId, zhPath: zhTarget, enPath: enTarget, coverPath: coverTarget })
  }
  sh('npm run runtime:validate')
  sh('npm run runtime:markdown:validate')
  sh('npm run docs:build')
  releaseSha = commitPush(`publish(runtime): release ${released.length} Daily Research items`)
  for (const item of released) for (const file of [item.zhPath,item.enPath,item.coverPath]) if (!sh(`git show ${releaseSha}:${file}`, true)) throw new Error(`Release commit missing ${file}`)
}

sh('git pull --ff-only origin main')
record = readJson(RECORD)
const count = released.length
record.taskStatus.publication = 'Completed'
record.status = Object.values(record.taskStatus).every(x => x === 'Completed') ? 'Completed' : 'Running'
record.results.publication = {
  schema: 'runtime-shift-result/v2',
  task: 'publication',
  status: 'Completed',
  input: count ? `${count} complete same-day Publication Candidates produced by the Completed Production shift, together with Scheduler V3.0 and the data-driven bilingual Research Notes website surfaces.` : 'The completed same-day Publication Candidate batch and Scheduler V3.0 Publication contract.',
  input_zh: count ? `由已完成 Production 班次生成的 ${count} 份完整当日 Publication Candidate，以及 Scheduler V3.0 和数据驱动的双语 Research Notes 网站表面。` : '已完成的当日 Publication Candidate 批次与 Scheduler V3.0 Publication 契约。',
  workResult: count ? `Validated Production, evidence, citation, publication editing, bilingual pairing, metadata and visualization gates for all ${count} candidates. Published only authorized candidate text and SVG assets to required Chinese and English column paths; data-driven indexes and website loaders now surface the releases. No new research, substantive rewriting or evidence repair was performed.` : 'Validated the complete candidate batch and found no candidate satisfying every Publication gate. No article or visualization was invented or released.',
  workResult_zh: count ? `已验证全部 ${count} 份候选的 Production、证据、引用、出版编辑、双语配对、元数据与可视化门禁。仅将获准候选文本和 SVG 资产发布到规定的中英文栏目路径；数据驱动索引与网站加载器现已展示这些发布项。未开展新研究、实质性改写或证据修复。` : '已核验完整候选批次，但没有候选同时满足全部 Publication 门禁；未虚构或发布任何文章与可视化。',
  output: count ? `Released ${count} Daily Research items as ${count * 2} bilingual public article files and ${count} visualization assets. Release commit: ${releaseSha}.` : 'No Eligible Publication Candidate; zero releases.',
  output_zh: count ? `已发布 ${count} 项 Daily Research，共 ${count * 2} 个双语公开文章文件与 ${count} 个可视化资产。发布提交：${releaseSha}。` : 'No Eligible Publication Candidate；发布数量为 0。',
  next: 'The Daily Runtime is closed for 2026-08-05. The next Daily Runtime begins with the next scheduled Discovery slot; future synthesis must consume durable released research rather than staging candidates.',
  next_zh: '2026-08-05 Daily Runtime 已关闭。下一轮 Daily Runtime 从下一次计划内 Discovery 时段开始；后续综合应消费已持久发布的研究成果，而不是 staging 候选。',
  metrics: [
    { label: 'Eligible Publication Candidates', label_zh: '符合条件的出版候选', value: String(count) },
    { label: 'Released Daily Research items', label_zh: '已发布 Daily Research 项目', value: String(count) },
    { label: 'Public bilingual article files', label_zh: '公开双语文章文件', value: String(count * 2) },
    { label: 'Published visualization assets', label_zh: '已发布可视化资产', value: String(count) },
    { label: 'New research performed', label_zh: '开展新研究', value: '0' },
    { label: 'Substantive rewrites', label_zh: '实质性改写', value: '0' },
    { label: 'Evidence repairs', label_zh: '证据修复', value: '0' }
  ],
  evidence: [
    { label: 'Scheduler V3.0', label_zh: 'Scheduler V3.0', source: SCHEDULER },
    { label: 'Publication Candidate batch', label_zh: 'Publication Candidate 批次', source: BATCH }
  ],
  artifacts: [
    { label: 'Verified Publication start-state commit', label_zh: '已验证 Publication 启动状态提交', commit: startSha },
    { label: 'Verified Publication start checkpoint', label_zh: '已验证 Publication 启动检查点', commit: checkpointSha },
    ...(releaseSha ? [{ label: 'Verified Daily Research release commit', label_zh: '已验证 Daily Research 发布提交', commit: releaseSha }] : []),
    ...released.flatMap(item => [
      { label: `${item.itemId} Chinese public article`, label_zh: `${item.itemId} 中文公开文章`, path: item.zhPath },
      { label: `${item.itemId} English public article`, label_zh: `${item.itemId} 英文公开文章`, path: item.enPath },
      { label: `${item.itemId} public visualization`, label_zh: `${item.itemId} 公开可视化`, path: item.coverPath }
    ])
  ]
}
appendEvent(record, 'Publication Completed', 'Completed', count ? `Validated all Publication gates and released ${count} Daily Research items as ${count * 2} bilingual articles and ${count} visualizations without new research, substantive rewriting or evidence repair.` : 'No Eligible Publication Candidate; Publication completed with zero releases and no invented publication.')
appendEvent(record, 'GitHub Commit Verified', 'Completed', releaseSha ? `Fetched and verified release commit ${releaseSha} containing all authorized bilingual public paths, visualization assets and website surface updates.` : 'Candidate eligibility decision verified; no release commit was required because zero candidates were eligible.')
writeJson(RECORD, record)
renderLedger()
sh('npm run runtime:validate')
sh('npm run runtime:build')
sh('node scripts/vitepress-build-strict.mjs')
if (fs.existsSync(WORKFLOW)) fs.rmSync(WORKFLOW)
if (fs.existsSync(SELF)) fs.rmSync(SELF)
const finalSha = commitPush(`runtime(publication): complete ${DATE} release record`)
const finalRecord = verifyRecordCommit(finalSha, 'Completed', 'Publication Completed')
if (finalRecord.results?.publication?.schema !== 'runtime-shift-result/v2' || finalRecord.results?.publication?.status !== 'Completed') throw new Error('Final Publication result verification failed')
console.log(JSON.stringify({ startSha, checkpointSha, releaseSha, finalSha, released, rejected, finalStatus: finalRecord.status }, null, 2))
