import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'
import {
  canonicalBytes,
  createReader,
  finalizeObject,
  sha256
} from '../research/conformance/tmpa-core-s1.0/reader.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

async function json(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'))
}

async function digest(relativePath) {
  return sha256(await readFile(path.join(root, relativePath)))
}

const objectSchemaPath = 'docs/public/spec/tmpa/s1.0/governance-object.schema.json'
const readerSchemaPath = 'docs/public/spec/tmpa/s1.0/reader-result.schema.json'
const profilePath = 'research/conformance/tmpa-core-s1.0/profile.json'
const canonicalizationPath = 'research/conformance/tmpa-core-s1.0/canonicalization-profile.json'

const [objectSchema, readerResultSchema, lifecycleProfile, canonicalizationProfile] = await Promise.all([
  json(objectSchemaPath),
  json(readerSchemaPath),
  json(profilePath),
  json(canonicalizationPath)
])

const [objectSchemaDigest, profileDigest, canonicalizationDigest] = await Promise.all([
  digest(objectSchemaPath),
  digest(profilePath),
  digest(canonicalizationPath)
])

const versioned = (id, version, valueDigest) => ({ id, version, digest: valueDigest })
const profileBundle = {
  conformance_profile: versioned(lifecycleProfile.id, lifecycleProfile.version, profileDigest),
  object_schema: versioned(objectSchema.$id, 'S1.0', objectSchemaDigest),
  type_registry: versioned('tmpa-s1.0-case-types', '1.0.0', profileDigest),
  lifecycle_registry: versioned(lifecycleProfile.id, lifecycleProfile.version, profileDigest),
  role_registry: versioned('tmpa-s1.0-case-roles', '1.0.0', profileDigest),
  relation_registry: versioned('tmpa-s1.0-case-relations', '1.0.0', profileDigest),
  integrity_profile: versioned(`${canonicalizationProfile.id}-integrity`, canonicalizationProfile.version, canonicalizationDigest),
  canonicalization_profile: versioned(canonicalizationProfile.id, canonicalizationProfile.version, canonicalizationDigest)
}

const reader = createReader({ objectSchema, readerResultSchema, lifecycleProfile, profileBundle })

function governanceObject(overrides = {}) {
  const id = overrides.id
  const workId = 'demo-release-42'
  const carrierId = 'task-release-42'
  const value = {
    tmpa_version: 'S1.0',
    id,
    type: overrides.type ?? 'TASK',
    governed_work: { id: workId, primary_carrier_id: carrierId },
    stream: { id: overrides.stream, sequence: overrides.sequence },
    creator: overrides.creator,
    role: overrides.role,
    created_at: overrides.createdAt,
    lifecycle: { profile: lifecycleProfile.id, state: overrides.state },
    references: structuredClone(overrides.references ?? []),
    content: {
      media_type: 'application/json',
      body: structuredClone(overrides.body ?? {})
    },
    integrity: {
      canonicalization: 'tmpa-s1.0-stable-json-1',
      hash_algorithm: 'sha256',
      digest: ''
    }
  }
  if (overrides.transition) value.lifecycle.transition = structuredClone(overrides.transition)
  return finalizeObject(value)
}

function source(value) {
  return {
    source_id: `demo/${value.id}.json`,
    media_type: 'application/json',
    bytes: canonicalBytes(value)
  }
}

function buildScenario(reviewer) {
  const task = governanceObject({
    id: 'task-release-42',
    stream: 'pm-stream',
    sequence: 1,
    creator: 'alice',
    role: 'PM',
    state: 'created',
    createdAt: '2026-08-12T08:00:00Z',
    body: { title: 'Release build 42', acceptance: 'tests pass and QA accepts' }
  })
  const start = governanceObject({
    id: 'transition-start',
    type: 'TRANSITION',
    stream: 'pm-stream',
    sequence: 2,
    creator: 'alice',
    role: 'PM',
    state: 'active',
    createdAt: '2026-08-12T08:05:00Z',
    transition: { from: 'created', action: 'start', to: 'active' }
  })
  const report = governanceObject({
    id: 'report-build-42',
    type: 'REPORT',
    stream: 'dev-stream',
    sequence: 1,
    creator: 'bob',
    role: 'DEV',
    state: 'active',
    createdAt: '2026-08-12T09:00:00Z',
    body: { claim: 'done', tests: '24 passed', artifact: 'build-42.zip' }
  })
  const submit = governanceObject({
    id: 'transition-submit',
    type: 'TRANSITION',
    stream: 'dev-stream',
    sequence: 2,
    creator: 'bob',
    role: 'DEV',
    state: 'review',
    createdAt: '2026-08-12T09:01:00Z',
    references: [
      { relation: 'depends_on', target: start.id },
      { relation: 'reports', target: report.id }
    ],
    transition: { from: 'active', action: 'submit', to: 'review' }
  })
  const review = governanceObject({
    id: reviewer === 'bob' ? 'transition-self-approve' : 'transition-independent-approve',
    type: 'TRANSITION',
    stream: 'qa-stream',
    sequence: 1,
    creator: reviewer,
    role: 'QA',
    state: 'done',
    createdAt: '2026-08-12T09:10:00Z',
    references: [
      { relation: 'depends_on', target: submit.id },
      { relation: 'reviews', target: submit.id },
      { relation: 'accepts', target: submit.id }
    ],
    body: { decision: 'approve' },
    transition: { from: 'review', action: 'approve', to: 'done' }
  })
  return [task, start, report, submit, review].map(source)
}

function summarize(name, result) {
  const workId = 'demo-release-42'
  return {
    scenario: name,
    agent_claim: 'done',
    reviewer: name === 'self-approval' ? 'bob (same actor)' : 'carol (independent QA)',
    reconstructed_state: result.extensions.summary.work_state[workId],
    responsibility: result.extensions.summary.responsibility[workId],
    acceptance: result.extensions.summary.acceptance_state[workId],
    judgment: result.judgment,
    view_state: result.view_state,
    issues: result.issues.map((issue) => issue.code)
  }
}

const rejected = summarize('self-approval', reader.read(buildScenario('bob')))
const accepted = summarize('independent-approval', reader.read(buildScenario('carol')))

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify({ rejected, accepted }, null, 2)}\n`)
  process.exit(0)
}

const color = process.stdout.isTTY
const paint = (code, value) => color ? `\u001b[${code}m${value}\u001b[0m` : value
const line = (label, value) => `  ${label.padEnd(22)} ${value}`

console.log(paint('1;36', '\nTMPA S1.0 · Agent handoff demo'))
console.log('Reader reconstructs governance state from five durable objects.\n')

console.log(paint('1;31', 'CASE 1 · The developer reviews its own “done” claim'))
console.log(line('Agent claim', rejected.agent_claim))
console.log(line('Reviewer', rejected.reviewer))
console.log(line('Reconstructed state', rejected.reconstructed_state))
console.log(line('Acceptance', rejected.acceptance))
console.log(line('View', `${rejected.view_state} / ${rejected.judgment}`))
console.log(line('Issue', rejected.issues.join(', ')))

console.log(paint('2', '\n  Add an independent QA review; keep every prior object unchanged.\n'))

console.log(paint('1;32', 'CASE 2 · Independent QA accepts the same delivery'))
console.log(line('Agent claim', accepted.agent_claim))
console.log(line('Reviewer', accepted.reviewer))
console.log(line('Reconstructed state', accepted.reconstructed_state))
console.log(line('Acceptance', accepted.acceptance))
console.log(line('View', `${accepted.view_state} / ${accepted.judgment}`))
console.log(line('Issues', accepted.issues.length ? accepted.issues.join(', ') : 'none'))

console.log(paint('1;36', '\nTrace said “done” in both cases. Governance accepted only one.\n'))
