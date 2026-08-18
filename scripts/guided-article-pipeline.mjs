#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

const SCHEMA = 'guided-article-pipeline/v2'
const PROPOSAL_SCHEMA = 'guided-topic-proposals/v2'
const READING_SCHEMA = 'first-party-reading-record/v1'
const REQUIRED_READING_ROLES = new Set([
  'positioning',
  'normative',
  'implementation',
  'field-evidence',
  'research-history',
  'recent-content'
])
const APPROVAL_STATUSES = new Set(['NotRequested', 'Pending', 'Approved', 'Rejected'])
const CHECKPOINTS = new Set([
  'AwaitingTopicSelection',
  'WritingInProgress',
  'AwaitingWritingApproval',
  'VisualsInProgress',
  'AwaitingVisualApproval',
  'AwaitingPublicationApproval',
  'Publishing',
  'Published',
  'Rejected'
])

const WRITING_PATHS = [
  'sourceRegisterPath',
  'factMatrixPath',
  'articleBriefPath',
  'zhDraftPath',
  'enDraftPath',
  'independentReviewPath'
]
const VISUAL_PATHS = ['coverPath', 'visualReviewPath', 'previewPath']
const PUBLICATION_PATHS = ['publicationRecordPath']

function fail(message) {
  throw new Error(`Guided article pipeline: ${message}`)
}

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'))
}

function repoPath(value) {
  return String(value || '').replaceAll('\\', '/')
}

function absolute(root, value) {
  const normalized = repoPath(value)
  if (!normalized || normalized.startsWith('/') || normalized.startsWith('../') || normalized.includes('://')) {
    fail(`path must be repository-relative: ${value || '(empty)'}`)
  }
  const resolved = path.resolve(root, normalized)
  if (repoPath(path.relative(root, resolved)).startsWith('../')) fail(`path escapes repository: ${value}`)
  return resolved
}

function assertText(value, label) {
  if (!String(value || '').trim()) fail(`${label} is required`)
}

function assertApproval(approval, label) {
  if (!approval || !APPROVAL_STATUSES.has(approval.status)) fail(`${label}.status is invalid`)
  if (approval.status === 'Approved') {
    if (approval.by !== 'user') fail(`${label}.by must be user`)
    assertText(approval.at, `${label}.at`)
  }
}

function assertArtifact(root, runPrefix, relative, label) {
  const normalized = repoPath(relative)
  if (!normalized.startsWith(`${runPrefix}/`)) fail(`${label} must stay under ${runPrefix}/`)
  const file = absolute(root, normalized)
  if (!existsSync(file)) fail(`${label} is missing: ${normalized}`)
  return file
}

function assertArtifactGroup(root, state, names, label) {
  for (const name of names) {
    assertArtifact(root, state.runDirectory, state.artifacts?.[name], `${label}.${name}`)
  }
}

function assertNoDownstreamFiles(root, state, maxStage) {
  const runDir = absolute(root, state.runDirectory)
  if (!existsSync(runDir)) fail(`runDirectory is missing: ${state.runDirectory}`)
  for (const entry of readdirSync(runDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue
    const match = /^(\d{2})-/.exec(entry.name)
    if (match && Number(match[1]) > maxStage) {
      fail(`${entry.name} belongs to a later stage than checkpoint ${state.checkpoint}`)
    }
  }
}

function validateFirstPartyReading(root, state) {
  const readingFile = assertArtifact(root, state.runDirectory, state.artifacts?.firstPartyReadingPath, 'artifacts.firstPartyReadingPath')
  const reading = readJson(readingFile)
  if (reading.schema !== READING_SCHEMA) fail(`first-party reading schema must be ${READING_SCHEMA}`)
  if (reading.runId !== state.runId || reading.runDate !== state.runDate) fail('first-party reading record must match state runId and runDate')
  if (reading.status !== 'Completed') fail('first-party reading must be Completed before topic proposals are valid')
  assertText(reading.completedAt, 'firstPartyReading.completedAt')
  if (!Array.isArray(reading.sources) || reading.sources.length < REQUIRED_READING_ROLES.size) {
    fail(`first-party reading requires at least ${REQUIRED_READING_ROLES.size} sources`)
  }

  const sourceIds = new Set()
  const roles = new Set()
  const sourceRoles = new Map()
  reading.sources.forEach((source, index) => {
    const label = `firstPartyReading.sources[${index}]`
    assertText(source?.id, `${label}.id`)
    if (sourceIds.has(source.id)) fail(`duplicate first-party source id ${source.id}`)
    sourceIds.add(source.id)
    if (!REQUIRED_READING_ROLES.has(source?.role)) fail(`${label}.role is invalid`)
    roles.add(source.role)
    sourceRoles.set(source.id, source.role)
    assertText(source?.path, `${label}.path`)
    if (!existsSync(source.path)) fail(`${label}.path does not exist: ${source.path}`)
    if (source.readCompletely !== true) fail(`${label}.readCompletely must be true`)
    assertText(source?.supports, `${label}.supports`)
    assertText(source?.doesNotSupport, `${label}.doesNotSupport`)
  })
  for (const role of REQUIRED_READING_ROLES) if (!roles.has(role)) fail(`first-party reading is missing role ${role}`)
  return { reading, sourceIds, sourceRoles }
}

function validateProposal(proposal, index, readingContext) {
  const label = `proposals[${index}]`
  assertText(proposal?.id, `${label}.id`)
  assertText(proposal?.title, `${label}.title`)
  assertText(proposal?.targetAudience, `${label}.targetAudience`)
  assertText(proposal?.readerProblem, `${label}.readerProblem`)
  assertText(proposal?.coreQuestion, `${label}.coreQuestion`)
  assertText(proposal?.coreProposition, `${label}.coreProposition`)
  assertText(proposal?.whyNow, `${label}.whyNow`)
  assertText(proposal?.readerAction, `${label}.readerAction`)
  assertText(proposal?.expectedResult, `${label}.expectedResult`)
  if (proposal?.articleType !== 'project-research') fail(`${label}.articleType must be project-research for this guided pipeline`)
  if (proposal?.framing !== 'first-party-strength') fail(`${label}.framing must be first-party-strength`)
  if (!Array.isArray(proposal?.researchObjects) || proposal.researchObjects.length < 1) fail(`${label}.researchObjects must identify at least one first-party project`)
  if (!Array.isArray(proposal?.verifiedStrengths) || proposal.verifiedStrengths.length < 1) fail(`${label}.verifiedStrengths must contain at least one strength`)
  proposal.verifiedStrengths.forEach((strength, strengthIndex) => {
    const strengthLabel = `${label}.verifiedStrengths[${strengthIndex}]`
    assertText(strength?.claim, `${strengthLabel}.claim`)
    assertText(strength?.readerValue, `${strengthLabel}.readerValue`)
    if (!Array.isArray(strength?.sourceRefs) || strength.sourceRefs.length < 2) fail(`${strengthLabel}.sourceRefs must contain at least two first-party sources`)
    for (const sourceRef of strength.sourceRefs) {
      if (!readingContext.sourceIds.has(sourceRef)) fail(`${strengthLabel}.sourceRefs contains unknown source ${sourceRef}`)
    }
    const evidenceRoles = new Set(strength.sourceRefs.map((sourceRef) => readingContext.sourceRoles.get(sourceRef)))
    if (!evidenceRoles.has('implementation') && !evidenceRoles.has('field-evidence')) {
      fail(`${strengthLabel} must cite implementation or field evidence, not documents alone`)
    }
  })
  if (!Array.isArray(proposal?.outline) || proposal.outline.length < 5) fail(`${label}.outline must contain at least five nodes`)
  if (!Array.isArray(proposal?.evidencePlan?.requiredSourceIdentities) || proposal.evidencePlan.requiredSourceIdentities.length < 2) {
    fail(`${label}.evidencePlan requires at least two source identities`)
  }
  assertText(proposal?.visualPlan?.coverConcept, `${label}.visualPlan.coverConcept`)
  if (!Array.isArray(proposal?.visualPlan?.inlineFigures)) fail(`${label}.visualPlan.inlineFigures must be an array`)
}

function validateTopicSelection(root, state) {
  const readingContext = validateFirstPartyReading(root, state)
  const proposalsFile = assertArtifact(root, state.runDirectory, state.artifacts?.topicProposalsPath, 'artifacts.topicProposalsPath')
  assertArtifact(root, state.runDirectory, state.artifacts?.topicPreviewPath, 'artifacts.topicPreviewPath')
  const proposals = readJson(proposalsFile)
  if (proposals.schema !== PROPOSAL_SCHEMA) fail(`topic proposals schema must be ${PROPOSAL_SCHEMA}`)
  if (proposals.runId !== state.runId || proposals.runDate !== state.runDate) fail('topic proposals must match state runId and runDate')
  if (!Array.isArray(proposals.proposals) || proposals.proposals.length < 1 || proposals.proposals.length > 3) {
    fail('topic proposals must contain between one and three choices')
  }
  const ids = new Set()
  proposals.proposals.forEach((proposal, index) => {
    validateProposal(proposal, index, readingContext)
    if (ids.has(proposal.id)) fail(`duplicate proposal id ${proposal.id}`)
    ids.add(proposal.id)
  })
  return proposals
}

function assertSelection(state, proposals) {
  const selected = state.approvals.topic.selectedProposalIds
  if (!Array.isArray(selected) || selected.length < 1 || selected.length > 3) fail('topic approval must select between one and three proposals')
  const known = new Set(proposals.proposals.map((proposal) => proposal.id))
  for (const id of selected) if (!known.has(id)) fail(`topic approval selected unknown proposal ${id}`)
}

export function validateGuidedArticlePipeline({ root = process.cwd(), state }) {
  if (state?.schema !== SCHEMA) fail(`schema must be ${SCHEMA}`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(state.runDate || '')) fail('runDate must be YYYY-MM-DD')
  if (!/^[a-z0-9][a-z0-9-]+$/.test(state.runId || '')) fail('runId must be a lowercase slug')
  if (state.runDirectory !== `research/manual-runs/${state.runId}`) fail('runDirectory must match research/manual-runs/<runId>')
  if (!CHECKPOINTS.has(state.checkpoint)) fail(`invalid checkpoint ${state.checkpoint}`)

  for (const name of ['topic', 'writing', 'visuals', 'publication']) assertApproval(state.approvals?.[name], `approvals.${name}`)
  const proposals = validateTopicSelection(root, state)

  const topicApproved = state.approvals.topic.status === 'Approved'
  const writingApproved = state.approvals.writing.status === 'Approved'
  const visualsApproved = state.approvals.visuals.status === 'Approved'
  const publicationApproved = state.approvals.publication.status === 'Approved'

  if (writingApproved && !topicApproved) fail('writing cannot be approved before topic selection')
  if (visualsApproved && !writingApproved) fail('visuals cannot be approved before writing')
  if (publicationApproved && !visualsApproved) fail('publication cannot be approved before visuals')
  if (topicApproved) assertSelection(state, proposals)

  const checkpoint = state.checkpoint
  if (checkpoint === 'AwaitingTopicSelection') {
    if (state.approvals.topic.status !== 'Pending') fail('AwaitingTopicSelection requires pending topic approval')
    if (state.approvals.writing.status !== 'NotRequested' || state.approvals.visuals.status !== 'NotRequested' || state.approvals.publication.status !== 'NotRequested') {
      fail('later approvals must not be requested before topic selection')
    }
    for (const name of [...WRITING_PATHS, ...VISUAL_PATHS, ...PUBLICATION_PATHS]) {
      if (state.artifacts?.[name]) fail(`${name} cannot exist before topic approval`)
    }
    assertNoDownstreamFiles(root, state, 1)
  } else if (checkpoint === 'WritingInProgress') {
    if (!topicApproved || state.approvals.writing.status !== 'NotRequested') fail('WritingInProgress requires an approved topic and no writing approval request yet')
    assertNoDownstreamFiles(root, state, 2)
  } else if (checkpoint === 'AwaitingWritingApproval') {
    if (!topicApproved || state.approvals.writing.status !== 'Pending') fail('AwaitingWritingApproval requires approved topic and pending writing approval')
    assertArtifactGroup(root, state, WRITING_PATHS, 'writing')
    assertNoDownstreamFiles(root, state, 2)
  } else if (checkpoint === 'VisualsInProgress') {
    if (!writingApproved || state.approvals.visuals.status !== 'NotRequested') fail('VisualsInProgress requires approved writing')
    assertArtifactGroup(root, state, WRITING_PATHS, 'writing')
    assertNoDownstreamFiles(root, state, 3)
  } else if (checkpoint === 'AwaitingVisualApproval') {
    if (!writingApproved || state.approvals.visuals.status !== 'Pending') fail('AwaitingVisualApproval requires approved writing and pending visual approval')
    assertArtifactGroup(root, state, WRITING_PATHS, 'writing')
    assertArtifactGroup(root, state, VISUAL_PATHS, 'visuals')
    assertNoDownstreamFiles(root, state, 3)
  } else if (checkpoint === 'AwaitingPublicationApproval') {
    if (!visualsApproved || state.approvals.publication.status !== 'Pending') fail('AwaitingPublicationApproval requires approved visuals and pending publication approval')
    assertArtifactGroup(root, state, [...WRITING_PATHS, ...VISUAL_PATHS], 'publication preview')
    assertNoDownstreamFiles(root, state, 3)
  } else if (checkpoint === 'Publishing') {
    if (!publicationApproved) fail('Publishing requires explicit user publication approval')
    assertArtifactGroup(root, state, [...WRITING_PATHS, ...VISUAL_PATHS], 'publishing')
    assertNoDownstreamFiles(root, state, 4)
  } else if (checkpoint === 'Published') {
    if (!publicationApproved) fail('Published requires explicit user publication approval')
    assertArtifactGroup(root, state, [...WRITING_PATHS, ...VISUAL_PATHS, ...PUBLICATION_PATHS], 'published')
  }

  return {
    runId: state.runId,
    checkpoint,
    proposals: proposals.proposals.length,
    selected: state.approvals.topic.selectedProposalIds?.length || 0,
    nextUserAction: checkpoint === 'AwaitingTopicSelection' ? 'Select or revise one to three topic proposals.' : null
  }
}

function argsOf(argv) {
  const args = { command: argv[2] }
  for (let index = 3; index < argv.length; index += 1) {
    if (!argv[index].startsWith('--')) continue
    args[argv[index].slice(2)] = argv[index + 1]
    index += 1
  }
  return args
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const args = argsOf(process.argv)
  if (args.command !== 'validate' || !args.state) fail('usage: validate --state <pipeline-state.json>')
  const stateFile = absolute(process.cwd(), args.state)
  const summary = validateGuidedArticlePipeline({ root: process.cwd(), state: readJson(stateFile) })
  console.log(`Guided article pipeline passed: ${JSON.stringify(summary)}`)
}
