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
  if (record.defaultEditorialNote) fail(`${path}: Completed scorecards may not use defaultEditorialNote.`)

  const seen = new Set()
  const editorialNotesZh = new Map()
  const editorialNotesEn = new Map()
  const bannedZh = [/本轮/, /本次周评/, /相对强项/, /最值得继续提升/, /下一轮建议/, /按当前正文/, /重校/]
  const bannedEn = [/this review/i, /relative strength/i, /improvement area/i, /next, /recalibrat/i]

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

    if (!item.editorialNote?.zh || !item.editorialNote?.en) {
      fail(`${path}: ${item.path} requires a persisted bilingual article-level editorialNote; projection code may not derive one.`)
      continue
    }
    const zh = item.editorialNote.zh.trim()
    const en = item.editorialNote.en.trim()
    if (zh.length < 25 || zh.length > 95) fail(`${path}: ${item.path} Chinese editorialNote should be a concise editor comment.`)
    if (en.length < 45 || en.length > 260) fail(`${path}: ${item.path} English editorialNote should be a concise editor comment.`)
    if (bannedZh.some(pattern => pattern.test(zh)) || bannedEn.some(pattern => pattern.test(en))) fail(`${path}: ${item.path} editorialNote contains score-explanation/template language.`)
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
    editorialNote: item.editorialNote || null,
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
