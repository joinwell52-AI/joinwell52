import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const RUBRIC_PATH = join(ROOT, 'research/editorial/OBSERVATION-SCORE-RUBRIC.json')
const RECORD_ROOT = join(ROOT, 'research/editorial/scorecards')
const OUTPUT_PATH = join(ROOT, 'docs/.vitepress/generated/editorial-scorecard.json')
const mode = process.argv[2] || 'validate'

const readJson = async path => JSON.parse(await readFile(path, 'utf8'))
const rubric = await readJson(RUBRIC_PATH)
const errors = []
const fail = message => errors.push(message)
const levelFor = score => rubric.levels.find(level => score >= level.min && score <= level.max)

const dimensionMeta = {
  evidenceRigor: { zh: '证据与严谨性', en: 'evidence and rigor', max: 35, improveZh: '补充更独立、可追溯的证据或更明确的限制说明', improveEn: 'add more independent traceable evidence or sharper limitation statements' },
  originalJudgment: { zh: '原创判断', en: 'original judgment', max: 25, improveZh: '把综合结论进一步压缩成可证伪、可迁移的独立判断', improveEn: 'sharpen the synthesis into a more falsifiable and transferable independent judgment' },
  structureExpression: { zh: '结构与表达', en: 'structure and expression', max: 20, improveZh: '压缩重复段落并强化论点之间的层级与过渡', improveEn: 'compress repetition and strengthen hierarchy and transitions between claims' },
  engineeringUsefulness: { zh: '工程实用性', en: 'engineering usefulness', max: 20, improveZh: '增加可执行的验收条件、测试办法或落地边界', improveEn: 'add more executable acceptance checks, test methods, or implementation boundaries' }
}

const backfillDimensions = score => {
  const weighted = rubric.scoring.dimensions.map((dimension, index) => {
    const raw = score * dimension.maxScore / 100
    return { dimension, index, score: Math.floor(raw), remainder: raw - Math.floor(raw) }
  })
  let remaining = score - weighted.reduce((sum, item) => sum + item.score, 0)
  for (const item of [...weighted].sort((a, b) => b.remainder - a.remainder || a.index - b.index)) {
    if (remaining <= 0) break
    item.score += 1
    remaining -= 1
  }
  return Object.fromEntries(weighted.map(({ dimension, score: dimensionScore }) => [dimension.id, {
    score: dimensionScore,
    reason: '历史总分按当前四项权重归一回填；下一次完整周评将按文章证据重新校准。 / Normalized from the legacy total using the current rubric weights; the next full review will recalibrate against article evidence.',
    evidence: ['legacy-total-score']
  }]))
}

const normalizedDimensions = (record, item) => {
  if (item.dimensions && !Array.isArray(item.dimensions)) return item.dimensions
  if (!Array.isArray(item.dimensionScores)) return null
  return Object.fromEntries(rubric.scoring.dimensions.map((dimension, index) => {
    const reasonRef = item.reasonRefs?.[index] || record.defaultReasonRefs?.[index]
    const evidenceRef = item.evidenceRefs?.[index] || record.defaultEvidenceRefs?.[index]
    return [dimension.id, {
      score: item.dimensionScores[index],
      reason: record.reasonLegend?.[reasonRef] || '',
      evidence: evidenceRef ? [evidenceRef] : []
    }]
  }))
}

const topicFor = path => {
  const slug = String(path || '').split('/').filter(Boolean).at(-1) || 'article'
  return slug.replace(/^\d{4}-\d{2}-\d{2}-/, '').replaceAll('-', ' ')
}

const derivedEditorialNote = (item, dimensions) => {
  const ranked = Object.entries(dimensionMeta).map(([key, meta]) => ({
    key,
    ...meta,
    score: dimensions?.[key]?.score ?? 0,
    ratio: (dimensions?.[key]?.score ?? 0) / meta.max
  })).sort((a, b) => b.ratio - a.ratio || b.score - a.score)
  const strongest = ranked[0]
  const weakest = ranked.at(-1)
  const topic = topicFor(item.path)
  return {
    zh: `《${topic}》本轮 ${item.score}/100。${strongest.zh}是相对强项（${strongest.score}/${strongest.max}），${weakest.zh}是最值得继续提升的部分（${weakest.score}/${weakest.max}）；下一轮建议优先${weakest.improveZh}。`,
    en: `“${topic}” scores ${item.score}/100 in this review. ${strongest.en} is the relative strength (${strongest.score}/${strongest.max}), while ${weakest.en} is the clearest improvement area (${weakest.score}/${weakest.max}); next, ${weakest.improveEn}.`
  }
}

const resolvedEditorialNote = (item, dimensions) => {
  if (item.editorialNote?.zh && item.editorialNote?.en) return item.editorialNote
  return derivedEditorialNote(item, dimensions)
}

const validateRubric = () => {
  const dimensions = rubric.scoring?.dimensions || []
  if (dimensions.reduce((sum, item) => sum + item.maxScore, 0) !== 100) fail('Rubric dimension maximums must sum to 100.')
  const covered = new Set()
  for (const level of rubric.levels || []) {
    for (let score = level.min; score <= level.max; score += 1) {
      if (covered.has(score)) fail(`Rubric levels overlap at ${score}.`)
      covered.add(score)
    }
  }
  for (let score = 0; score <= 100; score += 1) if (!covered.has(score)) fail(`Rubric levels do not cover ${score}.`)
  if (rubric.publicDisplay?.hide?.includes('internal') !== true) fail('Internal level codes must be hidden from public display.')
}

const walkJson = async directory => {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return walkJson(path)
    return entry.isFile() && entry.name.endsWith('.json') ? [path] : []
  }))
  return nested.flat()
}

const validateBaseline = (record, path) => {
  if (record.status !== 'Completed') fail(`${path}: baseline must be Completed.`)
  const seen = new Set()
  for (const item of record.items || []) {
    if (!item.path?.startsWith('/')) fail(`${path}: item path must be canonical.`)
    if (seen.has(item.path)) fail(`${path}: duplicate path ${item.path}.`)
    seen.add(item.path)
    if (!Number.isInteger(item.score) || item.score < 0 || item.score > 100) fail(`${path}: invalid score for ${item.path}.`)
  }
}

const validateFormal = (record, path) => {
  if (record.status !== 'Completed') return
  if (record.rubricVersion !== rubric.version) fail(`${path}: rubricVersion must equal ${rubric.version}.`)
  if (record.coverage?.rate !== 1) fail(`${path}: a Completed scorecard requires 100% coverage.`)
  if (record.coverage?.eligible !== record.items?.length) fail(`${path}: eligible count must equal item count.`)

  const seen = new Set()
  const editorialNotesZh = new Map()
  const editorialNotesEn = new Map()
  for (const item of record.items || []) {
    if (seen.has(item.path)) fail(`${path}: duplicate path ${item.path}.`)
    seen.add(item.path)
    if (!item.path?.startsWith('/')) fail(`${path}: item path must be canonical.`)
    if (!/^[a-f0-9]{64}$/.test(item.contentHash || '')) fail(`${path}: ${item.path} requires a SHA-256 contentHash.`)
    const dimensions = normalizedDimensions(record, item)
    const scores = rubric.scoring.dimensions.map(dimension => dimensions?.[dimension.id]?.score)
    rubric.scoring.dimensions.forEach((dimension, index) => {
      const score = scores[index]
      if (!Number.isInteger(score) || score < 0 || score > dimension.maxScore) fail(`${path}: invalid ${dimension.id} score for ${item.path}.`)
      if (!dimensions?.[dimension.id]?.reason) fail(`${path}: ${item.path} requires a ${dimension.id} reason.`)
      if (!dimensions?.[dimension.id]?.evidence?.length) fail(`${path}: ${item.path} requires ${dimension.id} evidence pointers.`)
    })
    const total = scores.reduce((sum, score) => sum + (Number.isInteger(score) ? score : 0), 0)
    if (item.score !== total) fail(`${path}: ${item.path} total must equal the four dimension scores.`)
    const level = levelFor(item.score)
    if (!level || (item.internalLevel && item.internalLevel !== level.internal) || item.publicLabel !== level.publicLabel || (item.publicLabel_en && item.publicLabel_en !== level.publicLabel_en)) {
      fail(`${path}: ${item.path} level fields do not match score ${item.score}.`)
    }

    const note = resolvedEditorialNote(item, dimensions)
    const zh = note.zh.trim()
    const en = note.en.trim()
    if (zh.length < 20 || en.length < 35) fail(`${path}: ${item.path} editorialNote is too generic/short.`)
    if (editorialNotesZh.has(zh)) fail(`${path}: ${item.path} duplicates Chinese editorialNote used by ${editorialNotesZh.get(zh)}.`)
    else editorialNotesZh.set(zh, item.path)
    if (editorialNotesEn.has(en)) fail(`${path}: ${item.path} duplicates English editorialNote used by ${editorialNotesEn.get(en)}.`)
    else editorialNotesEn.set(en, item.path)
  }
}

validateRubric()
const paths = await walkJson(RECORD_ROOT)
const records = []
for (const path of paths) {
  const record = await readJson(path)
  const shortPath = relative(ROOT, path).replaceAll('\\', '/')
  if (record.schema === 'observation-scorecard-manual-baseline/v1') validateBaseline(record, shortPath)
  else if (record.schema === 'observation-scorecard/v1') validateFormal(record, shortPath)
  else fail(`${shortPath}: unknown scorecard schema ${record.schema}.`)
  records.push({ path: shortPath, record })
}

if (errors.length) {
  console.error(errors.map(error => `- ${error}`).join('\n'))
  process.exit(1)
}

const formal = records
  .filter(({ record }) => record.schema === 'observation-scorecard/v1' && record.status === 'Completed')
  .sort((a, b) => b.record.reviewDate.localeCompare(a.record.reviewDate))[0]
const baseline = records.find(({ record }) => record.schema === 'observation-scorecard-manual-baseline/v1')
const selected = formal || baseline

const items = (selected?.record.items || []).map(item => {
  const level = levelFor(item.score)
  const dimensions = selected?.record.schema === 'observation-scorecard-manual-baseline/v1'
    ? (item.dimensions || backfillDimensions(item.score))
    : normalizedDimensions(selected.record, item)
  return {
    path: item.path,
    score: item.score,
    publicLabel: level?.publicLabel || '',
    publicLabel_en: level?.publicLabel_en || '',
    editorialNote: resolvedEditorialNote(item, dimensions),
    dimensions,
    scoringMode: item.scoringMode || (selected?.record.schema === 'observation-scorecard-manual-baseline/v1' ? 'legacy-weighted-backfill' : selected.record.mode)
  }
})

const projection = {
  schema: 'observation-scorecard-public-projection/v1',
  status: selected ? 'Completed' : 'AwaitingReview',
  sourceMode: formal ? 'weekly' : selected?.record.mode || null,
  sourceRecord: selected?.path || null,
  reviewDate: selected?.record.reviewDate || null,
  rubricVersion: formal ? rubric.version : 'legacy',
  coverageRate: formal ? selected.record.coverage.rate : null,
  cadence: rubric.cadence,
  levels: rubric.levels.map(({ internal: _internal, ...publicLevel }) => publicLevel),
  items
}

if (mode === 'build') {
  await writeFile(OUTPUT_PATH, `${JSON.stringify(projection, null, 2)}\n`, 'utf8')
  console.log(`Built ${relative(ROOT, OUTPUT_PATH)} from ${projection.sourceRecord || 'no completed review'}.`)
} else if (mode !== 'validate') {
  console.error('Usage: node scripts/editorial-scorecard.mjs [validate|build]')
  process.exit(1)
} else {
  console.log(`Validated rubric and ${records.length} scorecard record(s).`)
}
