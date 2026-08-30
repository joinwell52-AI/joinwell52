import { access, readFile, readdir, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SCORECARD_ROOT = join(ROOT, 'research', 'editorial', 'scorecards')
const REVIEW_ROOT = join(ROOT, 'research', 'editorial', 'reviews')
const INVENTORY_SCRIPT = join(ROOT, 'scripts', 'editorial-scorecard-inventory.mjs')

const exists = async path => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}
const readJson = async path => JSON.parse(await readFile(path, 'utf8'))
const shanghaiDate = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
}).format(new Date())
const runDate = process.env.SCORECARD_DATE || shanghaiDate()
const [year, month] = runDate.split('-')
const draftPath = join(SCORECARD_ROOT, year, month, `observation-scorecard-${runDate}T2130+0800.json`)
const weeklyRuntimePath = join(ROOT, 'research', 'runtime', 'records', 'weekly', year, month, `${runDate}-weekly-runtime.json`)
const reviewPath = join(REVIEW_ROOT, year, month, `${runDate}-weekly-007-review.json`)

if (!(await exists(draftPath))) {
  console.log(`No scorecard draft for ${runDate}; nothing to finalize.`)
  process.exit(0)
}

const current = await readJson(draftPath)
if (current.status === 'Completed') {
  console.log(`Scorecard ${runDate} is already Completed.`)
  process.exit(0)
}
if (!(await exists(weeklyRuntimePath))) {
  console.log(`Weekly Runtime ${runDate} is not present; scorecard remains Draft.`)
  process.exit(0)
}
const weekly = await readJson(weeklyRuntimePath)
const weeklyResult = weekly.results?.weekly
if (weekly.status !== 'Completed' || weekly.taskStatus?.weekly !== 'Completed' || weeklyResult?.status !== 'Completed' || weeklyResult?.commitVerify !== 'Completed') {
  console.log(`Weekly Runtime ${runDate} is not durably verified Completed; scorecard remains Draft.`)
  process.exit(0)
}

const inventoryOutput = execFileSync(process.execPath, [INVENTORY_SCRIPT], { cwd: ROOT, encoding: 'utf8' })
const marker = 'OBSERVATION_SCORECARD_INVENTORY='
const inventoryLine = inventoryOutput.split(/\r?\n/).find(line => line.startsWith(marker))
if (!inventoryLine) throw new Error('Inventory script did not emit OBSERVATION_SCORECARD_INVENTORY.')
const inventory = JSON.parse(inventoryLine.slice(marker.length))

const walkJson = async directory => {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return walkJson(path)
    return entry.isFile() && entry.name.endsWith('.json') ? [path] : []
  }))
  return nested.flat()
}

const formal = []
for (const path of await walkJson(SCORECARD_ROOT)) {
  if (path === draftPath) continue
  const record = await readJson(path)
  if (record.schema === 'observation-scorecard/v1' && record.status === 'Completed' && record.reviewDate < runDate) {
    formal.push({ path, record })
  }
}
formal.sort((a, b) => b.record.reviewDate.localeCompare(a.record.reviewDate))
const prior = formal[0]?.record
if (!prior) throw new Error(`No prior Completed observation-scorecard/v1 exists before ${runDate}.`)

const priorByPath = new Map((prior.items || []).map(item => [item.path, item]))
const reviewedByPath = new Map((current.items || []).map(item => [item.path, item]))
if (await exists(reviewPath)) {
  const supplement = await readJson(reviewPath)
  for (const item of supplement.items || []) reviewedByPath.set(item.path, item)
}

const resolved = []
let direct = 0
let audited = 0
let inherited = 0
const unresolved = []
for (const inventoryItem of inventory.items) {
  const reviewed = reviewedByPath.get(inventoryItem.path)
  if (reviewed && (!reviewed.contentHash || reviewed.contentHash === inventoryItem.contentHash)) {
    const item = {
      ...reviewed,
      contentHash: inventoryItem.contentHash
    }
    if (item.audited || item.scoringMode === 'audited') audited += 1
    else direct += 1
    resolved.push(item)
    continue
  }

  const previous = priorByPath.get(inventoryItem.path)
  if (previous?.contentHash === inventoryItem.contentHash) {
    resolved.push({
      ...previous,
      scoringMode: 'inherited',
      inheritedFrom: prior.reviewDate
    })
    inherited += 1
    continue
  }
  unresolved.push(inventoryItem.path)
}

if (unresolved.length) {
  throw new Error(`Unresolved new/content-changed observations require article-level review: ${unresolved.join(', ')}`)
}
if (resolved.length !== inventory.eligible) throw new Error(`Resolved ${resolved.length} items but inventory has ${inventory.eligible}.`)

const completed = {
  schema: 'observation-scorecard/v1',
  status: 'Completed',
  reviewDate: runDate,
  window: { type: 'weekly', through: runDate },
  rubricVersion: current.rubricVersion,
  reviewer: current.reviewer,
  mode: 'weekly-incremental',
  prerequisite: {
    name: 'Research Runtime Weekly',
    date: runDate,
    requiredStatus: 'Completed',
    observedStatus: 'Completed',
    githubCommit: weeklyResult.githubCommit,
    commitVerify: weeklyResult.commitVerify,
    verifiedAt: weeklyResult.verifiedAt
  },
  reasonLegend: current.reasonLegend,
  defaultReasonRefs: current.defaultReasonRefs,
  defaultEvidenceRefs: current.defaultEvidenceRefs,
  coverage: {
    eligible: inventory.eligible,
    reviewed: direct + audited,
    inherited,
    audited,
    rate: 1
  },
  items: resolved
}

await writeFile(draftPath, `${JSON.stringify(completed, null, 2)}\n`, 'utf8')
console.log(`Finalized ${relative(ROOT, draftPath)}: eligible=${inventory.eligible}, direct=${direct}, audited=${audited}, inherited=${inherited}.`)
