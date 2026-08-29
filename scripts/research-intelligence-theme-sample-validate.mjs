#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const RUN_ROOT = join(ROOT, 'research/intelligence/runs')
const EFFECTIVE_DATE = '2026-08-30'

const SIGNAL_ROLES = new Set([
  'sample-change-trigger',
  'failure-evidence',
  'research-finding',
  'mechanism-evidence',
  'benchmark-evidence',
  'industry-application-evidence',
  'incident-or-regression-evidence',
  'comparative-evidence'
])

const FAMILY_IDS = [
  'product-governance',
  'multi-agent-mechanism',
  'research-benchmark-industry'
]

function die(message) {
  throw new Error(`Theme-Sample Intelligence: ${message}`)
}

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

function rel(path) {
  return relative(ROOT, path).split(sep).join('/')
}

function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    die(`${rel(path)} is invalid JSON: ${error.message}`)
  }
}

function validateCheckedList(value, path, familyId) {
  if (!Array.isArray(value) || value.length < 2) {
    die(`${path}: researchCoverage.sampleFamilies.${familyId}.checked requires at least two inspected samples`)
  }
  const normalized = value.map(text)
  if (normalized.some((item) => !item)) {
    die(`${path}: ${familyId}.checked contains an empty sample id`)
  }
  if (new Set(normalized).size !== normalized.length) {
    die(`${path}: ${familyId}.checked must contain distinct samples`)
  }
}

function validateCoverage(run, path) {
  const coverage = run.researchCoverage
  if (!coverage || coverage.policy !== 'theme-sample-v1') {
    die(`${path}: Completed run requires researchCoverage.policy=theme-sample-v1`)
  }
  if (!Number.isInteger(coverage.rollingResearchWindowDays) || coverage.rollingResearchWindowDays < 30) {
    die(`${path}: rollingResearchWindowDays must be at least 30`)
  }
  if (!coverage.sampleFamilies || typeof coverage.sampleFamilies !== 'object') {
    die(`${path}: researchCoverage.sampleFamilies is required`)
  }
  for (const familyId of FAMILY_IDS) {
    const family = coverage.sampleFamilies[familyId]
    if (!family || typeof family !== 'object') {
      die(`${path}: missing sample family ${familyId}`)
    }
    validateCheckedList(family.checked, path, familyId)
    if (!Number.isInteger(family.qualifiedSignals) || family.qualifiedSignals < 0) {
      die(`${path}: ${familyId}.qualifiedSignals must be a non-negative integer`)
    }
  }
}

function validateSignal(signal, path) {
  if (!SIGNAL_ROLES.has(signal.signalRole)) {
    die(`${path}: ${signal.id || '(unknown signal)'} requires a valid signalRole`)
  }
  if (!Array.isArray(signal.researchThemes) || signal.researchThemes.length === 0 || signal.researchThemes.some((item) => !text(item))) {
    die(`${path}: ${signal.id} requires non-empty researchThemes`)
  }
  if (!Array.isArray(signal.sampleIds) || signal.sampleIds.length === 0 || signal.sampleIds.some((item) => !text(item))) {
    die(`${path}: ${signal.id} requires non-empty sampleIds`)
  }
  if (!signal.researchValue || typeof signal.researchValue !== 'object') {
    die(`${path}: ${signal.id} requires researchValue`)
  }

  if (signal.signalRole !== 'sample-change-trigger') {
    const substantive = ['failure', 'finding', 'mechanism', 'implication']
      .some((key) => text(signal.researchValue[key]))
    if (!substantive) {
      die(`${path}: ${signal.id} non-trigger evidence requires Failure, Finding, Mechanism or Implication value`)
    }
  }
}

function validateRun(run, path) {
  if (run.schema !== 'research-intelligence-run/v1') return
  if (!text(run.date) || run.date < EFFECTIVE_DATE) return
  if (run.status !== 'Completed') return

  validateCoverage(run, path)

  if (!Array.isArray(run.signals)) {
    die(`${path}: signals must be an array`)
  }

  run.signals.forEach((signal) => validateSignal(signal, path))

  const triggerCount = run.signals.filter((signal) => signal.signalRole === 'sample-change-trigger').length
  if (run.signals.length > 0 && triggerCount * 2 > run.signals.length) {
    die(`${path}: pure sample-change-trigger signals exceed 50% (${triggerCount}/${run.signals.length})`)
  }
}

const runFiles = walk(RUN_ROOT).filter((path) => /\d{4}-\d{2}-\d{2}-intelligence\.json$/.test(path))
for (const path of runFiles) {
  validateRun(readJson(path), rel(path))
}

console.log(`theme-sample intelligence: validated ${runFiles.length} run file(s); policy effective ${EFFECTIVE_DATE}`)
