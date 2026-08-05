import fs from 'node:fs'
import path from 'node:path'
import { execFileSync, execSync } from 'node:child_process'

const DATE = '2026-08-05'
const repo = path.resolve(process.argv[2] || '.')
const reportPath = path.resolve(process.argv[3] || 'runtime-publication-result.json')
const recordPath = `research/runtime/records/daily/2026/08/${DATE}-daily-runtime.json`
const ledgerPath = `research/runtime/2026/08/${DATE}-runtime.md`
const schedulerPath = 'research/runtime/SCHEDULER.json'
const batchPath = `research/runtime/candidates/2026/08/${DATE}-candidates.json`
const sectionMap = {
  'digital-employee': 'digital-employee',
  'industry-architecture': 'industry',
  'open-source-engineering': 'engineering'
}
const columnNames = {
  'digital-employee': { zh: '数字员工', en: 'Digital Employee' },
  'industry-architecture': { zh: '行业架构', en: 'Industry Architecture' },
  'open-source-engineering': { zh: '开源工程', en: 'Open-source Engineering' }
}

function run(command, options = {}) {
  return execSync(command, { cwd: repo, encoding: 'utf8', stdio: options.capture ? 'pipe' : 'inherit', ...options }).trim()
}
function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(repo, rel), 'utf8'))
}
function writeJson(rel, value) {
  fs.writeFileSync(path.join(repo, rel), `${JSON.stringify(value, null, 2)}\n`)
}
function exists(rel) {
  return fs.existsSync(path.join(repo, rel))
}
function sha256(text) {
  return (await import('node:crypto')).createHash('sha256').update(text).digest('hex')
}
function nowShanghai() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date()).filter(p => p.type !== 'literal').map(p => [p.type, p.value]))
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+08:00`
}
function appendTimeline(record, task, event, status, detail, time = nowShanghai()) {
  record.timeline ||= []
  record.timeline.push({ time, task, event, status, detail })
  return time
}
function renderLedger() {
  run(`node scripts/runtime-markdown.mjs render --date ${DATE}`)
  if (!exists(ledgerPath)) throw new Error(`Ledger was not rendered: ${ledgerPath}`)
}
function validateLedgerProjection(record, markdown) {
  for (const point of record.timeline || []) {
    if (!markdown.includes(point.time)) throw new Error(`Ledger omitted timeline timepoint ${point.time}`)
    if (!markdown.includes(point.event)) throw new Error(`Ledger omitted timeline event ${point.event}`)
  }
  for (const result of Object.values(record.results || {})) {
    for (const key of ['input', 'workResult', 'output', 'next']) {
      if (result?.[key] && !markdown.includes(result[key])) {
        const zh = result[`${key}_zh`]
        if (!zh || !markdown.includes(zh)) throw new Error(`Ledger omitted result field ${result.task}.${key}`)
      }
    }
  }
}
function commitAndPush(message, paths = null) {
  if (paths) {
    for (const rel of paths) run(`git add -- ${JSON.stringify(rel)}`)
  } else {
    run('git add -A')
  }
  const staged = run('git diff --cached --name-only', { capture: true })
  if (!staged) throw new Error(`No staged changes for commit: ${message}`)
  run(`git commit -m ${JSON.stringify(message)}`)
  const sha = run('git rev-parse HEAD', { capture: true })
  run('git push origin HEAD:main')
  return sha
}
function verifyRecordCommit(sha, expectedPublicationStatus, expectedEvent = null) {
  run('git fetch origin main')
  const remote = run('git rev-parse origin/main', { capture: true })
  if (remote !== sha) throw new Error(`Remote main ${remote} does not match expected commit ${sha}`)
  const jsonText = run(`git show ${sha}:${recordPath}`, { capture: true })
  const markdown = run(`git show ${sha}:${ledgerPath}`, { capture: true })
  const record = JSON.parse(jsonText)
  if (record.taskStatus?.publication !== expectedPublicationStatus) {
    throw new Error(`Publication status at ${sha} is ${record.taskStatus?.publication}, expected ${expectedPublicationStatus}`)
  }
  if (expectedEvent && !(record.timeline || []).some(item => item.task === 'publication' && item.event === expectedEvent)) {
    throw new Error(`Missing ${expectedEvent} in ${sha}`)
  }
  validateLedgerProjection(record, markdown)
  return { record, jsonText, markdown }
}
function parseCandidate(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error('Candidate article lacks frontmatter')
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
  const h1 = body.match(/^#\s+(.+)$/m)?.[1]?.trim()
  const paragraphs = body.split(/\n\s*\n/).map(v => v.trim()).filter(Boolean)
  const summary = paragraphs.find(p => !p.startsWith('#') && !p.startsWith('<') && !p.startsWith('>')) || ''
  return { meta, body, h1, summary }
}
function yamlScalar(value) {
  return JSON.stringify(String(value))
}
function publicArticle(parsed, candidate, lang, coverUrl, languageHref) {
  const title = parsed.h1
  const summary = parsed.summary.replace(/\n/g, ' ')
  const names = columnNames[candidate.column]
  const kicker = lang === 'zh' ? `${names.zh} · 每日研究` : `${names.en} · Daily Research`
  const languageLabel = lang === 'zh' ? 'English' : '中文'
  let body = parsed.body
    .replace(/^>\s*编辑状态：.*尚未发布。\s*$/m, '')
    .replace(/^>\s*Editing status:.*not yet published\.\s*$/mi, '')
    .trim()
  const frontmatter = [
    '---',
    `title: ${yamlScalar(title)}`,
    `date: '${DATE}'`,
    `column: ${candidate.column}`,
    'category: daily',
    `summary: ${yamlScalar(summary)}`,
    `item_id: ${candidate.itemId}`,
    `source_research_object: ${yamlScalar(parsed.meta.source_research_object)}`,
    `source_reading_result: ${yamlScalar(parsed.meta.source_reading_result)}`,
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
    `  image=${yamlScalar(coverUrl)}`,
    `  kicker=${yamlScalar(kicker)}`,
    `  title=${yamlScalar(title)}`,
    `  summary=${yamlScalar(summary)}`,
    `  version=${yamlScalar(candidate.itemId)}`,
    `  status=${yamlScalar(`Daily Runtime V5 · ${DATE}`)}`,
    `  languageHref=${yamlScalar(languageHref)}`,
    `  languageLabel=${yamlScalar(languageLabel)}`,
    '/>'
  ].join('\n')
  return `${frontmatter}\n\n${cover}\n\n${body}\n`
}
function assertCandidate(candidate, record) {
  const requiredCandidate = ['column', 'itemId', 'zhPath', 'enPath', 'coverPath']
  for (const key of requiredCandidate) if (!candidate[key]) throw new Error(`Candidate missing ${key}`)
  if (!sectionMap[candidate.column]) throw new Error(`Unknown candidate column ${candidate.column}`)
  if (candidate.lifecycle !== 'Publication Candidate') throw new Error(`${candidate.itemId} lifecycle gate failed`)
  if (candidate.evidenceStatus !== 'Completed') throw new Error(`${candidate.itemId} evidence gate failed`)
  if (candidate.editingStatus !== 'Completed') throw new Error(`${candidate.itemId} editing gate failed`)
  for (const rel of [candidate.zhPath, candidate.enPath, candidate.coverPath]) if (!exists(rel)) throw new Error(`${candidate.itemId} missing artifact ${rel}`)
  const zh = parseCandidate(fs.readFileSync(path.join(repo, candidate.zhPath), 'utf8'))
  const en = parseCandidate(fs.readFileSync(path.join(repo, candidate.enPath), 'utf8'))
  const requiredMeta = ['date', 'column', 'item_id', 'lifecycle', 'source_research_object', 'source_reading_result', 'visualization', 'visualization_decision', 'evidence_status', 'citation_status', 'editing_status', 'publication_authorized']
  for (const parsed of [zh, en]) {
    for (const key of requiredMeta) if (parsed.meta[key] === undefined || parsed.meta[key] === '') throw new Error(`${candidate.itemId} metadata gate missing ${key}`)
    if (parsed.meta.date !== DATE || parsed.meta.column !== candidate.column || parsed.meta.item_id !== candidate.itemId) throw new Error(`${candidate.itemId} metadata identity mismatch`)
    if (parsed.meta.lifecycle !== 'Publication Candidate') throw new Error(`${candidate.itemId} article lifecycle gate failed`)
    if (parsed.meta.evidence_status !== 'Completed' || parsed.meta.citation_status !== 'Completed' || parsed.meta.editing_status !== 'Completed') throw new Error(`${candidate.itemId} evidence/citation/editing gate failed`)
    if (parsed.meta.publication_authorized !== false) throw new Error(`${candidate.itemId} candidate authorization state is not false before Publication`)
    if (parsed.meta.visualization !== candidate.coverPath || !String(parsed.meta.visualization_decision).startsWith('Required')) throw new Error(`${candidate.itemId} visualization gate failed`)
    if (!parsed.h1 || !parsed.summary) throw new Error(`${candidate.itemId} title/summary metadata gate failed`)
  }
  for (const key of ['date', 'column', 'item_id', 'source_research_object', 'source_reading_result', 'visualization']) {
    if (zh.meta[key] !== en.meta[key]) throw new Error(`${candidate.itemId} bilingual pairing mismatch: ${key}`)
  }
  const svg = fs.readFileSync(path.join(repo, candidate.coverPath), 'utf8')
  if (!svg.includes('<svg') || !svg.includes('</svg>')) throw new Error(`${candidate.itemId} visualization is not a complete SVG`)
  if (record.taskStatus?.production !== 'Completed' || record.results?.production?.status !== 'Completed') throw new Error('Production gate is not Completed')
  return { zh, en, svg }
}

const report = { date: DATE, startedAt: nowShanghai(), commits: {}, outcome: null, released: [] }
try {
  process.chdir(repo)
  run('git config user.name "Research Runtime Publication"')
  run('git config user.email "actions@users.noreply.github.com"')
  run('git checkout main')
  run('git pull --ff-only origin main')

  let record = readJson(recordPath)
  if (record.date !== DATE || record.schema !== 'daily-runtime-record/v1') throw new Error('Daily Runtime Record identity/schema mismatch')
  if (record.taskStatus?.publication === 'Completed') {
    report.outcome = 'Already Completed'
    report.finalStatus = 'Completed'
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
    process.exit(0)
  }
  if (record.taskStatus?.publication !== 'Waiting') throw new Error(`Publication is not Waiting: ${record.taskStatus?.publication}`)

  record.status = 'Running'
  record.taskStatus.publication = 'Running'
  const openedAt = appendTimeline(record, 'publication', 'Execution Slot Opened', 'Running', 'Research Runtime Publication opened by Scheduler V3.0; release work may begin only after this synchronized JSON and Markdown start state is committed and verified.')
  writeJson(recordPath, record)
  renderLedger()
  const startSha = commitAndPush('runtime(publication): open 2026-08-05 execution slot', [recordPath, ledgerPath])
  report.commits.start = startSha
  report.openedAt = openedAt
  verifyRecordCommit(startSha, 'Running', 'Execution Slot Opened')

  run('git pull --ff-only origin main')
  record = readJson(recordPath)
  const verifiedAt = appendTimeline(record, 'publication', 'GitHub Commit Verified', 'Running', `Fetched and verified start-state commit ${startSha} containing synchronized Daily Runtime JSON and Markdown ledger.`)
  writeJson(recordPath, record)
  renderLedger()
  const checkpointSha = commitAndPush('runtime(publication): verify durable start state', [recordPath, ledgerPath])
  report.commits.startCheckpoint = checkpointSha
  report.startVerifiedAt = verifiedAt
  verifyRecordCommit(checkpointSha, 'Running', 'GitHub Commit Verified')

  run('git pull --ff-only origin main')
  const scheduler = readJson(schedulerPath)
  const publicationTask = scheduler.tasks?.find(item => item.id === 'publication' && item.family === 'daily')
  if (!publicationTask || scheduler.version !== '3.0' || scheduler.resultContract !== 'runtime-shift-result/v2') throw new Error('Scheduler V3.0 Publication contract missing')
  const requiredProhibitions = ['New research', 'Substantive rewriting', 'Evidence repair']
  for (const item of requiredProhibitions) if (!publicationTask.prohibitions?.includes(item)) throw new Error(`Scheduler Publication prohibition missing: ${item}`)
  const batch = readJson(batchPath)
  record = readJson(recordPath)
  if (batch.date !== DATE || batch.status !== 'Completed' || batch.sourceTask !== 'Research Runtime Production') throw new Error('Publication Candidate batch gate failed')

  const eligible = []
  for (const candidate of batch.candidates || []) {
    try {
      eligible.push({ candidate, ...assertCandidate(candidate, record) })
    } catch (error) {
      report.released.push({ itemId: candidate.itemId || 'unknown', eligible: false, reason: error.message })
    }
  }

  let releaseSha = null
  const publicPaths = []
  if (eligible.length) {
    for (const item of eligible) {
      const { candidate, zh, en, svg } = item
      const base = path.basename(candidate.zhPath).replace(/\.zh\.md$/, '')
      const slug = base.startsWith(`${DATE}-`) ? base.slice(DATE.length + 1) : base
      const section = sectionMap[candidate.column]
      const zhTarget = `docs/zh/${section}/${DATE}-${slug}.md`
      const enTarget = `docs/en/${section}/${DATE}-${slug}.md`
      const coverTarget = `docs/public/assets/covers/daily-${DATE}-${slug}.svg`
      const coverUrl = `/assets/covers/daily-${DATE}-${slug}.svg`
      const zhHref = `/zh/${section}/${DATE}-${slug}`
      const enHref = `/en/${section}/${DATE}-${slug}`
      for (const target of [zhTarget, enTarget, coverTarget]) {
        if (exists(target)) throw new Error(`Refusing to overwrite existing public artifact ${target}`)
        fs.mkdirSync(path.dirname(path.join(repo, target)), { recursive: true })
      }
      fs.writeFileSync(path.join(repo, zhTarget), publicArticle(zh, candidate, 'zh', coverUrl, enHref))
      fs.writeFileSync(path.join(repo, enTarget), publicArticle(en, candidate, 'en', coverUrl, zhHref))
      fs.writeFileSync(path.join(repo, coverTarget), svg)
      publicPaths.push(zhTarget, enTarget, coverTarget)
      report.released.push({ itemId: candidate.itemId, eligible: true, zhPath: zhTarget, enPath: enTarget, coverPath: coverTarget })
    }
    run('npm run runtime:validate')
    run('npm run runtime:markdown:validate')
    run('npm run docs:build')
    releaseSha = commitAndPush(`publish(runtime): release ${eligible.length} Daily Research items`)
    report.commits.release = releaseSha
    run('git fetch origin main')
    if (run('git rev-parse origin/main', { capture: true }) !== releaseSha) throw new Error('Release commit was not durable on main')
    for (const rel of publicPaths) {
      const committed = run(`git show ${releaseSha}:${rel}`, { capture: true })
      if (!committed) throw new Error(`Release commit missing ${rel}`)
    }
  }

  run('git pull --ff-only origin main')
  record = readJson(recordPath)
  const completedAt = nowShanghai()
  const releases = eligible.length
  const articleCount = releases * 2
  const visualizationCount = releases
  record.taskStatus.publication = 'Completed'
  record.status = Object.values(record.taskStatus).every(value => value === 'Completed') ? 'Completed' : 'Running'
  record.results.publication = {
    schema: 'runtime-shift-result/v2',
    task: 'publication',
    status: 'Completed',
    input: releases
      ? `${releases} complete same-day Publication Candidates produced by the Completed Production shift, together with Scheduler V3.0 and the data-driven bilingual Research Notes website surfaces.`
      : 'The completed same-day Publication Candidate batch and Scheduler V3.0 Publication contract.',
    input_zh: releases
      ? `由已完成 Production 班次生成的 ${releases} 份完整当日 Publication Candidate，以及 Scheduler V3.0 和数据驱动的双语 Research Notes 网站表面。`
      : '已完成的当日 Publication Candidate 批次与 Scheduler V3.0 Publication 契约。',
    workResult: releases
      ? `Validated Production, evidence, citation, publication editing, bilingual pairing, metadata and visualization gates for all ${releases} candidates. Published only the authorized candidate text and SVG assets to the required Chinese and English column paths; data-driven indexes and website loaders now surface the releases. No new research, substantive rewriting or evidence repair was performed.`
      : 'Validated the complete candidate batch and found no candidate satisfying every Publication gate. No article or visualization was invented or released.',
    workResult_zh: releases
      ? `已验证全部 ${releases} 份候选的 Production、证据、引用、出版编辑、双语配对、元数据与可视化门禁。仅将获准候选文本和 SVG 资产发布到规定的中英文栏目路径；数据驱动索引与网站加载器现已展示这些发布项。未开展新研究、实质性改写或证据修复。`
      : '已核验完整候选批次，但没有候选同时满足全部 Publication 门禁；未虚构或发布任何文章与可视化。',
    output: releases
      ? `Released ${releases} Daily Research items as ${articleCount} bilingual public articles and ${visualizationCount} visualization assets. Release commit: ${releaseSha}.`
      : 'No Eligible Publication Candidate; zero releases.',
    output_zh: releases
      ? `已发布 ${releases} 项 Daily Research，共 ${articleCount} 个双语公开文章文件与 ${visualizationCount} 个可视化资产。发布提交：${releaseSha}。`
      : 'No Eligible Publication Candidate；发布数量为 0。',
    next: 'The Daily Runtime is closed for 2026-08-05. The next Daily Runtime begins with the next scheduled Discovery slot; future synthesis must consume the durable released research rather than the staging candidates.',
    next_zh: '2026-08-05 Daily Runtime 已关闭。下一轮 Daily Runtime 从下一次计划内 Discovery 时段开始；后续综合应消费已持久发布的研究成果，而不是 staging 候选。',
    metrics: [
      { label: 'Eligible Publication Candidates', label_zh: '符合条件的出版候选', value: String(releases) },
      { label: 'Released Daily Research items', label_zh: '已发布 Daily Research 项目', value: String(releases) },
      { label: 'Public bilingual article files', label_zh: '公开双语文章文件', value: String(articleCount) },
      { label: 'Published visualization assets', label_zh: '已发布可视化资产', value: String(visualizationCount) },
      { label: 'New research performed', label_zh: '开展新研究', value: '0' },
      { label: 'Substantive rewrites', label_zh: '实质性改写', value: '0' },
      { label: 'Evidence repairs', label_zh: '证据修复', value: '0' }
    ],
    evidence: [
      { label: 'Scheduler V3.0', label_zh: 'Scheduler V3.0', source: schedulerPath },
      { label: 'Publication Candidate batch', label_zh: 'Publication Candidate 批次', source: batchPath }
    ],
    artifacts: [
      { label: 'Verified Publication start-state commit', label_zh: '已验证 Publication 启动状态提交', commit: startSha },
      { label: 'Verified Publication start checkpoint', label_zh: '已验证 Publication 启动检查点', commit: checkpointSha },
      ...(releaseSha ? [{ label: 'Verified Daily Research release commit', label_zh: '已验证 Daily Research 发布提交', commit: releaseSha }] : []),
      ...report.released.filter(item => item.eligible).flatMap(item => [
        { label: `${item.itemId} Chinese public article`, label_zh: `${item.itemId} 中文公开文章`, path: item.zhPath },
        { label: `${item.itemId} English public article`, label_zh: `${item.itemId} 英文公开文章`, path: item.enPath },
        { label: `${item.itemId} public visualization`, label_zh: `${item.itemId} 公开可视化`, path: item.coverPath }
      ])
    ]
  }
  appendTimeline(record, 'publication', 'Publication Completed', 'Completed', releases
    ? `Validated all Publication gates and released ${releases} Daily Research items as ${articleCount} bilingual articles and ${visualizationCount} visualizations without new research, substantive rewriting or evidence repair.`
    : 'No Eligible Publication Candidate; Publication completed with zero releases and no invented publication.', completedAt)
  appendTimeline(record, 'publication', 'GitHub Commit Verified', 'Completed', releaseSha
    ? `Fetched and verified release commit ${releaseSha} containing all authorized bilingual public paths, visualization assets and website surface updates.`
    : 'Candidate eligibility decision verified; no release commit was required because zero candidates were eligible.')
  writeJson(recordPath, record)
  renderLedger()
  run('npm run runtime:validate')
  run('npm run runtime:build')
  run('node scripts/vitepress-build-strict.mjs')
  const finalSha = commitAndPush(`runtime(publication): complete ${DATE} release record`)
  report.commits.final = finalSha
  const finalVerified = verifyRecordCommit(finalSha, 'Completed', 'Publication Completed')
  if (finalVerified.record.results?.publication?.schema !== 'runtime-shift-result/v2' || finalVerified.record.results?.publication?.status !== 'Completed') throw new Error('Final Publication result contract verification failed')
  report.outcome = releases ? 'Released Daily Research' : 'No Eligible Publication Candidate'
  report.finalStatus = finalVerified.record.status
  report.completedAt = nowShanghai()
  report.releaseCount = releases
  report.articleFileCount = articleCount
  report.visualizationCount = visualizationCount
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
} catch (error) {
  report.outcome = 'Failed'
  report.error = error.stack || error.message || String(error)
  report.failedAt = nowShanghai()
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  throw error
}
