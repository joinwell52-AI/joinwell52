#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CANDIDATE_ROOT = join(ROOT, 'research/runtime/candidates')
const EFFECTIVE_DATE = '2026-08-17'
const errors = []
let checked = 0

function slash(path) {
  return relative(ROOT, path).split(sep).join('/')
}

function fail(context, message) {
  errors.push(`${context}: ${message}`)
}

function readJson(path, context = slash(path)) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    fail(context, `invalid JSON: ${error.message}`)
    return null
  }
}

function walk(path) {
  if (!existsSync(path)) return []
  return readdirSync(path).flatMap((entry) => {
    const target = join(path, entry)
    return statSync(target).isDirectory() ? walk(target) : [target]
  })
}

function resolveRepoPath(value, context, field) {
  if (!String(value || '').trim()) {
    fail(context, `missing ${field}`)
    return null
  }
  const target = join(ROOT, value)
  if (!existsSync(target)) {
    fail(context, `${field} does not exist: ${value}`)
    return null
  }
  return target
}

function validatePlanningArtifact(candidate, batchDate, context) {
  const briefPath = resolveRepoPath(candidate.articleBriefPath, context, 'articleBriefPath')
  const argumentPath = resolveRepoPath(candidate.argumentArchitecturePath, context, 'argumentArchitecturePath')
  const figurePath = resolveRepoPath(candidate.figurePlanPath, context, 'figurePlanPath')
  if (!briefPath || !argumentPath || !figurePath) return

  const brief = readJson(briefPath, context)
  const argument = readJson(argumentPath, context)
  const figures = readJson(figurePath, context)
  if (!brief || !argument || !figures) return

  for (const [name, value, schema] of [
    ['Article Brief', brief, 'article-brief/v1'],
    ['Argument Architecture', argument, 'argument-architecture/v1'],
    ['Figure Plan', figures, 'article-figure-plan/v1']
  ]) {
    if (value.schema !== schema) fail(context, `${name} schema must be ${schema}`)
    if (value.date !== batchDate) fail(context, `${name} date must match candidate batch date ${batchDate}`)
    if (value.itemId !== candidate.itemId) fail(context, `${name} itemId must match candidate itemId`)
  }

  if (brief.editorialDecision !== 'PASS') fail(context, 'Article Brief editorialDecision must be PASS for a formal candidate')
  if (!String(brief.targetAudience?.primary || '').trim()) fail(context, 'Article Brief requires targetAudience.primary')
  if (!String(brief.targetAudience?.readerProblem || '').trim()) fail(context, 'Article Brief requires targetAudience.readerProblem')
  if (!String(brief.whyNow || '').trim()) fail(context, 'Article Brief requires whyNow')
  if (!String(brief.coreProposition || '').trim()) fail(context, 'Article Brief requires coreProposition')
  if (!String(brief.originalValue?.description || '').trim()) fail(context, 'Article Brief requires originalValue.description')

  if (candidate.coreProposition !== brief.coreProposition) fail(context, 'candidate.coreProposition must match Article Brief coreProposition')
  if (argument.coreProposition !== brief.coreProposition) fail(context, 'Argument Architecture coreProposition must match Article Brief coreProposition')
  if (figures.cover?.coreProposition !== brief.coreProposition) fail(context, 'Figure Plan cover.coreProposition must match Article Brief coreProposition')

  if (!Array.isArray(argument.argumentNodes) || argument.argumentNodes.length < 2) {
    fail(context, 'Argument Architecture requires at least two argumentNodes')
    return
  }

  const nodeIds = new Set()
  for (const node of argument.argumentNodes) {
    if (!String(node.nodeId || '').trim()) fail(context, 'argument node is missing nodeId')
    else if (nodeIds.has(node.nodeId)) fail(context, `duplicate argument nodeId: ${node.nodeId}`)
    else nodeIds.add(node.nodeId)
    if (!String(node.claim || '').trim()) fail(context, `${node.nodeId || '(node)'} is missing claim`)
    if (!String(node.readerProgress || '').trim()) fail(context, `${node.nodeId || '(node)'} is missing readerProgress`)
    if (!['none', 'optional', 'material'].includes(node.visualNeed)) fail(context, `${node.nodeId || '(node)'} has invalid visualNeed`)
  }

  const planned = new Map()
  for (const figure of figures.inlineFigures || []) {
    if (!String(figure.figureId || '').trim()) fail(context, 'Figure Plan contains figure without figureId')
    else if (planned.has(figure.figureId)) fail(context, `duplicate planned figureId: ${figure.figureId}`)
    else planned.set(figure.figureId, figure)
    if (!nodeIds.has(figure.argumentNodeId)) fail(context, `${figure.figureId || '(figure)'} references missing argumentNodeId ${figure.argumentNodeId}`)
    if (!String(figure.purpose || '').trim()) fail(context, `${figure.figureId || '(figure)'} is missing purpose`)
    if (!String(figure.productionMethod || '').trim()) fail(context, `${figure.figureId || '(figure)'} is missing productionMethod`)
  }

  const candidateFigures = candidate.inlineFigures || []
  if (!Array.isArray(candidateFigures)) fail(context, 'candidate.inlineFigures must be an array')
  else {
    for (const figure of candidateFigures) {
      const id = typeof figure === 'string' ? figure : figure.figureId
      if (!String(id || '').trim()) fail(context, 'candidate inline figure is missing figureId')
      else if (!planned.has(id)) fail(context, `candidate contains orphan Inline Figure ${id}`)
      else {
        const node = typeof figure === 'object' ? figure.argumentNodeId : null
        if (node && node !== planned.get(id).argumentNodeId) fail(context, `${id} argumentNodeId disagrees with Figure Plan`)
      }
    }
  }

  for (const gate of ['editorialValue', 'researchValue', 'independence', 'evidence', 'structure', 'narrative', 'language', 'bilingualConsistency', 'visualArgument']) {
    if (candidate.gates?.[gate] !== 'PASS') fail(context, `${gate} gate must be PASS for Editorial Architecture 2.1`)
  }
}

for (const path of walk(CANDIDATE_ROOT).filter((item) => item.endsWith('-candidates.json'))) {
  const batch = readJson(path)
  if (!batch || batch.schema !== 'runtime-publication-candidate/v2' || batch.status !== 'Completed') continue
  if (String(batch.date || '') < EFFECTIVE_DATE) continue

  for (const candidate of batch.candidates || []) {
    checked += 1
    validatePlanningArtifact(candidate, batch.date, `${slash(path)}#${candidate.itemId || 'unknown'}`)
  }
}

if (errors.length) {
  console.error(`Publication Editorial V2.1 validation failed with ${errors.length} error(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`Publication Editorial V2.1 validation passed: ${checked} candidate(s) checked from ${EFFECTIVE_DATE}.`)
}
