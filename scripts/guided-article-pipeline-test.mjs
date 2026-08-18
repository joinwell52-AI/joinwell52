#!/usr/bin/env node

import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { validateGuidedArticlePipeline } from './guided-article-pipeline.mjs'

const root = mkdtempSync(join(tmpdir(), 'guided-article-pipeline-'))
const runId = '2099-01-01-guided-article-pipeline'
const runDirectory = `research/manual-runs/${runId}`

function write(relative, value) {
  const file = join(root, relative)
  mkdirSync(join(file, '..'), { recursive: true })
  writeFileSync(file, value, 'utf8')
  return relative
}

function approval(status, extra = {}) {
  return { status, by: null, at: null, note: '', ...extra }
}

try {
  const topicProposalsPath = write(`${runDirectory}/01-topic-proposals.json`, `${JSON.stringify({
    schema: 'guided-topic-proposals/v2',
    runId,
    runDate: '2099-01-01',
    proposals: [{
      id: 'T1',
      articleType: 'project-research',
      framing: 'first-party-strength',
      researchObjects: ['Example Runtime'],
      title: 'Make agent work visible',
      targetAudience: 'Platform engineers',
      readerProblem: 'Agent work is difficult to inspect and hand off.',
      coreQuestion: 'How can one shared work surface make agent work inspectable?',
      coreProposition: 'A shared, durable work surface improves inspection and handoff.',
      whyNow: 'Long-running agent work needs visible handoffs.',
      readerAction: 'Build one inspectable task cycle.',
      expectedResult: 'A reproducible task and review walkthrough.',
      verifiedStrengths: [{
        claim: 'The implementation persists inspectable work artifacts.',
        readerValue: 'Readers can reproduce one visible task cycle.',
        sourceRefs: ['S2', 'S3']
      }],
      evidencePlan: { requiredSourceIdentities: ['independent protocol comparison', 'independent usability evidence'] },
      outline: ['Problem', 'Shared surface', 'Mechanism', 'Walkthrough', 'Reader checklist'],
      visualPlan: { coverConcept: 'One concentrated task path', inlineFigures: [] }
    }]
  }, null, 2)}\n`)
  const topicPreviewPath = write(`${runDirectory}/01-topic-proposals.md`, '# Topic proposals\n')
  const firstPartyPaths = Array.from({ length: 6 }, (_, index) => join(root, write(`first-party/source-${index + 1}.md`, `# Source ${index + 1}\n`)))
  const firstPartyReadingPath = write(`${runDirectory}/01-first-party-reading.json`, `${JSON.stringify({
    schema: 'first-party-reading-record/v1',
    runId,
    runDate: '2099-01-01',
    status: 'Completed',
    completedAt: '2099-01-01T09:00:00Z',
    sources: [
      { id: 'S1', role: 'positioning', path: firstPartyPaths[0], readCompletely: true, supports: 'Positioning', doesNotSupport: 'Implementation' },
      { id: 'S2', role: 'normative', path: firstPartyPaths[1], readCompletely: true, supports: 'Contract', doesNotSupport: 'Runtime result' },
      { id: 'S3', role: 'implementation', path: firstPartyPaths[2], readCompletely: true, supports: 'Implemented behavior', doesNotSupport: 'General validity' },
      { id: 'S4', role: 'field-evidence', path: firstPartyPaths[3], readCompletely: true, supports: 'Observed case', doesNotSupport: 'Universal outcome' },
      { id: 'S5', role: 'research-history', path: firstPartyPaths[4], readCompletely: true, supports: 'Research state', doesNotSupport: 'New result' },
      { id: 'S6', role: 'recent-content', path: firstPartyPaths[5], readCompletely: true, supports: 'Overlap screen', doesNotSupport: 'External novelty' }
    ]
  }, null, 2)}\n`)
  const state = {
    schema: 'guided-article-pipeline/v2',
    runId,
    runDate: '2099-01-01',
    runDirectory,
    checkpoint: 'AwaitingTopicSelection',
    approvals: {
      topic: approval('Pending', { selectedProposalIds: [] }),
      writing: approval('NotRequested'),
      visuals: approval('NotRequested'),
      publication: approval('NotRequested')
    },
    artifacts: { firstPartyReadingPath, topicProposalsPath, topicPreviewPath }
  }

  assert.deepEqual(validateGuidedArticlePipeline({ root, state }), {
    runId,
    checkpoint: 'AwaitingTopicSelection',
    proposals: 1,
    selected: 0,
    nextUserAction: 'Select or revise one to three topic proposals.'
  })

  const skippedWriting = structuredClone(state)
  skippedWriting.checkpoint = 'WritingInProgress'
  assert.throws(() => validateGuidedArticlePipeline({ root, state: skippedWriting }), /requires an approved topic/)

  write(`${runDirectory}/02-draft.zh.md`, '# Premature draft\n')
  assert.throws(() => validateGuidedArticlePipeline({ root, state }), /later stage/)

  const skippedPublication = structuredClone(state)
  skippedPublication.checkpoint = 'Publishing'
  skippedPublication.approvals.topic = approval('Approved', { by: 'user', at: '2099-01-01T10:00:00Z', selectedProposalIds: ['T1'] })
  skippedPublication.approvals.publication = approval('Approved', { by: 'user', at: '2099-01-01T10:01:00Z' })
  assert.throws(() => validateGuidedArticlePipeline({ root, state: skippedPublication }), /publication cannot be approved before visuals/)

  console.log('Guided article pipeline tests passed: stage-one validation and three skip-path rejections.')
} finally {
  rmSync(root, { recursive: true, force: true })
}
