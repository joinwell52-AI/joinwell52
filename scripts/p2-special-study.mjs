import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REGISTRY_PATH = join(ROOT, 'research/intelligence/REGISTRY.json')
const RUN_ROOT = join(ROOT, 'research/intelligence/p2-runs')
const STUDY_ROOT = join(ROOT, 'research/intelligence/p2-studies')
const REVIEW_ROOT = join(ROOT, 'research/intelligence/p2-reviews')
const GENERATED_PATH = join(ROOT, 'docs/.vitepress/generated/p2-special-study.json')
const REVIEW_DECISIONS = new Set([
  'Approved Internal',
  'Revision Required',
  'Promote to Article Candidate',
  'Archived'
])
const OUTCOMES = new Set([
  'Waiting',
  'No Material Change',
  'Continue Watching',
  'Special Study Candidate',
  'Experiment Candidate',
  'Risk Alert',
  'Not Due',
  'Blocked',
  'Failed'
])
const ITEM_STATUSES = new Set(['Waiting', 'Completed', 'Blocked', 'Failed', 'Not Due'])
const RUN_STATUSES = new Set(['Waiting', 'Running', 'Completed', 'Blocked', 'Failed', 'Skipped'])
const TERMINAL_ITEM_STATUSES = new Set(['Completed', 'Blocked', 'Failed'])
const TRIGGER_DECISIONS = new Set(['Waiting', 'Matched', 'Not Matched', 'Indeterminate', 'Not Due'])

function die(message) {
  throw new Error(`P2 Special Study: ${message}`)
}

function readJson(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')) }
  catch (error) { die(`${relativePath(path)} is invalid JSON: ${error.message}`) }
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

function relativePath(path) {
  return relative(ROOT, path).split(sep).join('/')
}

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

function argsOf(argv) {
  const result = { _: [] }
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) { result._.push(token); continue }
    const key = token.slice(2)
    const value = argv[index + 1]
    if (!value || value.startsWith('--')) result[key] = true
    else { result[key] = value; index += 1 }
  }
  return result
}

function assertDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) die('date must be YYYY-MM-DD')
  const parsed = new Date(`${date}T12:00:00Z`)
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date) die(`invalid date ${date}`)
}

function datePath(date) {
  const [year, month] = date.split('-')
  return join(RUN_ROOT, year, month, `${date}-p2-special.json`)
}

function weekday(date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`))
}

function daysBetween(earlier, later) {
  return Math.floor((new Date(`${later}T12:00:00Z`) - new Date(`${earlier}T12:00:00Z`)) / 86400000)
}

function p2Objects(registry) {
  const objects = []
  for (const pipeline of registry.pipelines || []) {
    for (const item of pipeline.repositories || []) {
      if (item.tier !== 'P2') continue
      objects.push({
        id: `github:${item.repository}`,
        pipeline: pipeline.id,
        type: 'github-repository',
        name: item.repository,
        sourceUrl: `https://github.com/${item.repository}`,
        frequency: item.frequency,
        category: item.category,
        category_zh: item.category_zh,
        watchFor: item.watchFor,
        watchFor_zh: item.watchFor_zh,
        specialStudyTrigger: item.specialStudyTrigger,
        specialStudyTrigger_zh: item.specialStudyTrigger_zh,
        columns: item.columns
      })
    }
    for (const item of pipeline.sources || []) {
      if (item.tier !== 'P2') continue
      objects.push({
        id: `source:${item.id}`,
        pipeline: pipeline.id,
        type: 'research-source',
        name: item.name || item.id,
        sourceUrl: item.url,
        frequency: item.frequency,
        category: item.category || item.id,
        category_zh: item.category_zh || item.name_zh || item.name || item.id,
        watchFor: item.focus || item.sourceTypes || [],
        watchFor_zh: item.focus_zh || item.sourceTypes || [],
        specialStudyTrigger: item.specialStudyTrigger,
        specialStudyTrigger_zh: item.specialStudyTrigger_zh,
        columns: item.columns || []
      })
    }
  }
  return objects
}

function loadRuns() {
  return walk(RUN_ROOT)
    .filter((path) => path.endsWith('-p2-special.json'))
    .map((path) => ({ path, run: readJson(path) }))
    .sort((a, b) => a.run.date.localeCompare(b.run.date))
}

function loadStudies() {
  return walk(STUDY_ROOT)
    .filter((path) => path.endsWith('.md'))
    .map((path) => ({ path, date: relativePath(path).match(/\d{4}-\d{2}-\d{2}/)?.[0] || '' }))
    .sort((a, b) => a.date.localeCompare(b.date) || relativePath(a.path).localeCompare(relativePath(b.path)))
}

function loadReviews() {
  return walk(REVIEW_ROOT)
    .filter((path) => path.endsWith('.review.json'))
    .map((path) => ({ path, review: readJson(path) }))
    .sort((a, b) => (a.review.updatedAt || '').localeCompare(b.review.updatedAt || ''))
}

function artifactPath(artifact) {
  if (typeof artifact === 'string') return artifact
  return artifact?.path || artifact?.href || ''
}

function completedHistory(runs, objectId, beforeDate) {
  return runs
    .filter(({ run }) => run.date < beforeDate)
    .flatMap(({ run }) => run.objects || [])
    .filter((item) => item.objectId === objectId && item.status === 'Completed')
    .sort((a, b) => (a.checkedAt || '').localeCompare(b.checkedAt || ''))
}

function latestFullReview(history) {
  return [...history].reverse().find((item) => [
    'baseline', 'biweekly-review', 'monthly-review', 'release-triggered-study'
  ].includes(item.reviewMode)) || null
}

function planObject(object, date, runs) {
  const history = completedHistory(runs, object.id, date)
  const lastCheck = history.at(-1) || null
  const lastFull = latestFullReview(history)
  let due = false
  let reviewMode = 'not-due'
  let cadenceReason = 'The object is not due in this weekly P2 run.'
  let cadenceReason_zh = '该对象在本周 P2 运行中尚未到期。'

  if (!lastCheck) {
    due = true
    reviewMode = 'baseline'
    cadenceReason = 'No completed P2 checkpoint exists; establish the governed baseline.'
    cadenceReason_zh = '尚无已完成的 P2 检查点；本次建立受控基线。'
  } else if (object.frequency === 'biweekly-or-release') {
    due = true
    const fullReviewDue = !lastFull || daysBetween(lastFull.checkedAt.slice(0, 10), date) >= 14
    reviewMode = fullReviewDue ? 'biweekly-review' : 'release-check'
    cadenceReason = fullReviewDue
      ? 'The biweekly full-review interval is due; also inspect releases and material commits.'
      : 'Perform the weekly release and material-commit check between full reviews.'
    cadenceReason_zh = fullReviewDue
      ? '双周完整复查已到期；同时检查版本和实质提交。'
      : '在两次完整复查之间执行每周版本与实质提交检查。'
  } else if (object.frequency === 'monthly') {
    const fullMonth = lastFull?.checkedAt?.slice(0, 7) || ''
    due = fullMonth !== date.slice(0, 7)
    if (due) {
      reviewMode = 'monthly-review'
      cadenceReason = 'No completed full review exists for the current month.'
      cadenceReason_zh = '本月尚无已完成的完整复查。'
    }
  }

  return {
    objectId: object.id,
    name: object.name,
    pipeline: object.pipeline,
    type: object.type,
    sourceUrl: object.sourceUrl,
    frequency: object.frequency,
    category: object.category,
    category_zh: object.category_zh,
    watchFor: object.watchFor,
    watchFor_zh: object.watchFor_zh,
    specialStudyTrigger: object.specialStudyTrigger,
    specialStudyTrigger_zh: object.specialStudyTrigger_zh,
    columns: object.columns,
    due,
    reviewMode,
    cadenceReason,
    cadenceReason_zh,
    previousCheckpoint: lastCheck ? {
      checkedAt: lastCheck.checkedAt,
      ...lastCheck.currentCheckpoint
    } : null,
    currentCheckpoint: {
      release: '',
      tag: '',
      mainCommit: '',
      keyFileHashes: [],
      issueRefs: [],
      pullRequestRefs: [],
      datasetVersion: '',
      benchmarkVersion: '',
      sourceRef: ''
    },
    status: due ? 'Waiting' : 'Not Due',
    triggerDecision: due ? 'Waiting' : 'Not Due',
    outcome: due ? 'Waiting' : 'Not Due',
    triggerScore: {
      relevance: 0,
      changeMagnitude: 0,
      evidenceQuality: 0,
      actionValue: 0,
      total: 0
    },
    changeSummary: '',
    changeSummary_zh: '',
    judgment: '',
    judgment_zh: '',
    evidence: [],
    artifacts: [],
    checkedAt: ''
  }
}

function defaultRun(date, registry, runs) {
  const objects = p2Objects(registry).map((object) => planObject(object, date, runs))
  const due = objects.filter((item) => item.due).length
  return {
    schema: 'p2-special-study-run/v1',
    version: '1.0',
    date,
    weekday: weekday(date),
    timezone: registry.timezone,
    status: 'Waiting',
    registryVersion: registry.version,
    sourceTask: 'Research Runtime Weekly',
    policy: {
      scheduledDay: 'Sunday',
      scheduledTime: '20:30',
      scanAllDueObjects: true,
      maxFullStudies: 1,
      directPublicationAllowed: false,
      triggerThreshold: 5,
      triggerScoreMaximum: 10,
      outcomes: [...OUTCOMES].filter((value) => !['Waiting', 'Not Due'].includes(value))
    },
    coverage: { due, resolved: 0, percent: due === 0 ? 100 : 0 },
    selection: {
      selectedObjectId: '',
      reason: 'No full special study has been selected.',
      reason_zh: '尚未选择完整专项研究对象。'
    },
    objects,
    summary: 'The P2 special-study run has not started.',
    summary_zh: 'P2 专项研究运行尚未开始。',
    artifacts: [],
    githubCommit: 'pending',
    updatedAt: ''
  }
}

function validateRegistry(registry) {
  if (registry.schema !== 'research-intelligence-registry/v1') die('invalid Registry schema')
  if (registry.timezone !== 'Asia/Shanghai') die('Registry timezone must be Asia/Shanghai')
  const objects = p2Objects(registry)
  if (!objects.length) die('Registry must contain at least one P2 object')
  if (new Set(objects.map((item) => item.id)).size !== objects.length) die('P2 object ids must be unique')
  for (const object of objects) {
    if (!['biweekly-or-release', 'monthly'].includes(object.frequency)) die(`${object.id}: invalid frequency`)
    if (!object.category || !object.category_zh) die(`${object.id}: bilingual category is required`)
    if (!object.specialStudyTrigger || !object.specialStudyTrigger_zh) die(`${object.id}: bilingual trigger is required`)
    if (!Array.isArray(object.watchFor) || !object.watchFor.length) die(`${object.id}: watchFor is required`)
  }
  return registry
}

function validateRun(run, path) {
  const where = relativePath(path)
  if (run.schema !== 'p2-special-study-run/v1' || run.version !== '1.0') die(`${where}: invalid schema or version`)
  assertDate(run.date)
  if (run.timezone !== 'Asia/Shanghai') die(`${where}: invalid timezone`)
  if (!RUN_STATUSES.has(run.status)) die(`${where}: invalid status ${run.status}`)
  if (run.policy?.maxFullStudies !== 1 || run.policy?.directPublicationAllowed !== false) {
    die(`${where}: P2 policy must allow at most one full study and no direct publication`)
  }
  if (!Array.isArray(run.objects) || !run.objects.length) die(`${where}: objects are required`)
  if (new Set(run.objects.map((item) => item.objectId)).size !== run.objects.length) die(`${where}: duplicate object ids`)
  for (const item of run.objects) {
    if (!ITEM_STATUSES.has(item.status)) die(`${where}/${item.objectId}: invalid status`)
    if (!OUTCOMES.has(item.outcome)) die(`${where}/${item.objectId}: invalid outcome`)
    if (!TRIGGER_DECISIONS.has(item.triggerDecision)) die(`${where}/${item.objectId}: invalid trigger decision`)
    if (!Array.isArray(item.evidence) || !Array.isArray(item.artifacts)) die(`${where}/${item.objectId}: evidence and artifacts arrays are required`)
    const checkpoint = item.currentCheckpoint || {}
    if (!Array.isArray(checkpoint.keyFileHashes) || !Array.isArray(checkpoint.issueRefs) || !Array.isArray(checkpoint.pullRequestRefs)) {
      die(`${where}/${item.objectId}: checkpoint arrays are required`)
    }
    const score = item.triggerScore || {}
    const dimensions = [score.relevance, score.changeMagnitude, score.evidenceQuality, score.actionValue]
    if (!dimensions.every((value) => Number.isInteger(value) && value >= 0)) die(`${where}/${item.objectId}: trigger score dimensions must be non-negative integers`)
    if (score.relevance > 3 || score.changeMagnitude > 2 || score.evidenceQuality > 3 || score.actionValue > 2) {
      die(`${where}/${item.objectId}: trigger score dimension exceeds its maximum`)
    }
    if (score.total !== dimensions.reduce((sum, value) => sum + value, 0)) die(`${where}/${item.objectId}: trigger score total is invalid`)
    if (['Special Study Candidate', 'Experiment Candidate', 'Risk Alert'].includes(item.outcome) && score.total < 5) {
      die(`${where}/${item.objectId}: study outcomes require trigger score 5 or higher`)
    }
    if (!item.due && (item.status !== 'Not Due' || item.outcome !== 'Not Due')) die(`${where}/${item.objectId}: non-due object must remain Not Due`)
    if (item.status === 'Completed') {
      if (!item.checkedAt) die(`${where}/${item.objectId}: completed object requires checkedAt`)
      if (!checkpoint.mainCommit && !checkpoint.release && !checkpoint.tag && !checkpoint.sourceRef) {
        die(`${where}/${item.objectId}: completed object requires a durable checkpoint identity`)
      }
    }
  }
  const selected = run.selection?.selectedObjectId || ''
  if (selected && !run.objects.some((item) => item.objectId === selected && item.due)) die(`${where}: selected object must be due`)
  if (run.status === 'Completed') {
    const due = run.objects.filter((item) => item.due)
    const resolved = due.filter((item) => TERMINAL_ITEM_STATUSES.has(item.status))
    if (resolved.length !== due.length) die(`${where}: completed run contains unresolved due objects`)
    if (run.coverage?.due !== due.length || run.coverage?.resolved !== resolved.length || run.coverage?.percent !== 100) {
      die(`${where}: completed coverage must be 100 percent`)
    }
    if (!run.updatedAt || !run.summary || !run.summary_zh) die(`${where}: completed run requires bilingual summary and updatedAt`)
    if (selected) {
      const studyArtifact = (run.artifacts || []).map(artifactPath).find((value) => value.startsWith('research/intelligence/p2-studies/'))
      if (!studyArtifact || !existsSync(join(ROOT, studyArtifact))) {
        die(`${where}: a completed selected study requires an existing internal study artifact`)
      }
    }
  }
  return run
}

function validateReview(review, path, studyPaths) {
  const where = relativePath(path)
  if (review.schema !== 'p2-special-study-review/v1' || review.version !== '1.0') die(`${where}: invalid schema or version`)
  if (!studyPaths.has(review.studyPath)) die(`${where}: studyPath does not reference an existing P2 study`)
  if (!REVIEW_DECISIONS.has(review.currentDecision)) die(`${where}: invalid currentDecision`)
  if (!Array.isArray(review.history) || !review.history.length) die(`${where}: review history is required`)
  for (const event of review.history) {
    if (!REVIEW_DECISIONS.has(event.decision) || !event.reviewedAt || !event.reviewer) die(`${where}: invalid review event`)
  }
  const latest = review.history.at(-1)
  if (latest.decision !== review.currentDecision || latest.reviewedAt !== review.updatedAt) {
    die(`${where}: current review state must match the latest history event`)
  }
}

function validate({ silent = false } = {}) {
  const registry = validateRegistry(readJson(REGISTRY_PATH))
  const runs = loadRuns()
  const studies = loadStudies()
  const reviews = loadReviews()
  for (const { path, run } of runs) validateRun(run, path)
  const studyPaths = new Set(studies.map(({ path }) => relativePath(path)))
  for (const { path, review } of reviews) validateReview(review, path, studyPaths)
  if (new Set(reviews.map(({ review }) => review.studyPath)).size !== reviews.length) die('each P2 study may have only one review record')
  if (!silent) console.log(`P2 Special Study validation passed: ${p2Objects(registry).length} object(s), ${runs.length} run(s), ${studies.length} study/studies, ${reviews.length} review(s).`)
  return { registry, runs, studies, reviews }
}

function due(date) {
  assertDate(date)
  const { registry, runs } = validate({ silent: true })
  const run = defaultRun(date, registry, runs)
  console.log(JSON.stringify({
    date,
    weekday: run.weekday,
    scheduled: run.weekday === run.policy.scheduledDay,
    due: run.coverage.due,
    objects: run.objects.filter((item) => item.due).map((item) => ({
      objectId: item.objectId,
      name: item.name,
      reviewMode: item.reviewMode,
      cadenceReason: item.cadenceReason
    }))
  }, null, 2))
}

function initialize(date) {
  assertDate(date)
  const { registry, runs } = validate({ silent: true })
  const path = datePath(date)
  if (!existsSync(path)) writeJson(path, defaultRun(date, registry, runs))
  validate()
  console.log(`Initialized ${relativePath(path)}.`)
}

function build() {
  const { registry, runs, studies, reviews } = validate({ silent: true })
  const sorted = runs.map(({ run }) => run).sort((a, b) => b.date.localeCompare(a.date))
  const reviewsByStudy = new Map(reviews.map(({ review }) => [review.studyPath, review]))
  const reportStates = studies.map(({ path, date }) => {
    const review = reviewsByStudy.get(relativePath(path))
    return {
      date,
      status: review ? 'Processed' : 'Pending',
      decision: review?.currentDecision || '',
      reviewedAt: review?.updatedAt || ''
    }
  }).sort((a, b) => b.date.localeCompare(a.date) || b.reviewedAt.localeCompare(a.reviewedAt))
  const pending = reportStates.filter((item) => item.status === 'Pending').length
  const processed = reportStates.length - pending
  writeJson(GENERATED_PATH, {
    schema: 'p2-special-study-public-status/v1',
    generatedAt: new Date().toISOString(),
    timezone: registry.timezone,
    schedule: { carrierTask: 'weekly', kind: 'weekly', day: 'Sunday', time: '20:30' },
    policy: {
      biweeklyOrRelease: 'Weekly release check plus a full review at least every 14 days.',
      monthly: 'One full review in each calendar month.',
      triggerScore: 'Relevance 0..3 + change magnitude 0..2 + evidence quality 0..3 + action value 0..2; 5 starts a study.',
      triggerThreshold: 5,
      maxFullStudiesPerRun: 1,
      directPublicationAllowed: false
    },
    objectCount: p2Objects(registry).length,
    runCount: sorted.length,
    latestRun: sorted[0] ? {
      date: sorted[0].date,
      status: sorted[0].status,
      due: sorted[0].coverage?.due || 0,
      resolved: sorted[0].coverage?.resolved || 0,
      selected: Boolean(sorted[0].selection?.selectedObjectId)
    } : null,
    review: {
      status: reportStates.length === 0 ? 'No Report' : pending > 0 ? 'Pending' : 'Processed',
      reports: reportStates.length,
      pending,
      processed,
      latest: reportStates[0] || null
    }
  })
  console.log(`Generated ${relativePath(GENERATED_PATH)}.`)
}

const args = argsOf(process.argv.slice(2))
const command = args._[0] || 'validate'
try {
  if (command === 'validate') validate()
  else if (command === 'due') due(args.date)
  else if (command === 'initialize') initialize(args.date)
  else if (command === 'build') build()
  else die(`unknown command ${command}`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
