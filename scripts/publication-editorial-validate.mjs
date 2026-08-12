#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CONFIG_PATH = join(ROOT, 'research/editorial/EDITORIAL-ARCHITECTURE.json')
const FIXTURE_PATH = join(ROOT, 'research/production-tests/editorial-architecture-v2/manifest.json')
const SELF_PROJECT_PATTERN = /\b(?:TMPA|FCoP|CodeFlowMu)\b/i
const errors = []
let candidateCount = 0
let fixtureCount = 0
let communityCount = 0
let claimCount = 0

function slash(path) {
  return relative(ROOT, path).split(sep).join('/')
}

function fail(context, message) {
  errors.push(`${context}: ${message}`)
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    fail(slash(path), `invalid JSON: ${error.message}`)
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

function resolveRepoPath(path, context) {
  if (!String(path || '').trim()) {
    fail(context, 'missing repository path')
    return null
  }
  const target = join(ROOT, path)
  if (!existsSync(target)) {
    fail(context, `file does not exist: ${path}`)
    return null
  }
  return target
}

function frontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return null
  const values = {}
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/)
    if (!field) continue
    values[field[1]] = field[2].trim().replace(/^['"]|['"]$/g, '')
  }
  return values
}

function headings(markdown) {
  return [...markdown.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => match[1].trim())
}

function normalizedBody(markdown) {
  return markdown
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function hasPublicationValidationLeap(text) {
  const sentences = String(text || '').split(/(?<=[.!?。！？])\s+|\r?\n/)
  const statusEn = /\b(?:doi|zenodo|publication|published|archived|indexed|peer[- ]review(?:ed)?|citation|cited)\b/i
  const leapEn = /\b(?:proves?|validates?|confirms?\s+(?:the\s+)?(?:theory|general validity)|demonstrates?\s+general validity|academic\s+(?:recognition|endorsement))\b/i
  const negatedEn = /\b(?:not|never|cannot|can't|does not|doesn't|is not|isn't|no automatic|without)\b|≠/i
  const statusZh = /(?:DOI|Zenodo|发表|发布|归档|收录|同行评审|引用)/i
  const leapZh = /(?:证明(?:了|其)?|验证(?:了)?(?:该)?理论|普遍有效|获得(?:了)?学术认可|学术界认可)/
  const negatedZh = /(?:不等于|并不|不能|不可|并非|不代表|未证明|未验证|尚需|没有)|≠/
  return sentences.some((sentence) => (
    statusEn.test(sentence) && leapEn.test(sentence) && !negatedEn.test(sentence)
  ) || (
    statusZh.test(sentence) && leapZh.test(sentence) && !negatedZh.test(sentence)
  ))
}

const config = readJson(CONFIG_PATH)
if (!config) process.exit(1)

const registeredTypes = new Set(Object.keys(config.articleTypes || {}))
const registeredModules = new Set(Object.keys(config.modules || {}))
const projectStatuses = new Set(config.projectRelevanceStatuses || [])
const requiredGates = config.requiredGates || []

function validateArticle(pathValue, candidate, language, context) {
  const path = resolveRepoPath(pathValue, context)
  if (!path) return null
  const markdown = readFileSync(path, 'utf8')
  const meta = frontmatter(markdown)
  if (!meta) {
    fail(context, `${language} article is missing YAML frontmatter`)
    return { path, markdown, headings: headings(markdown) }
  }
  if (meta.schema !== 'publication-candidate-article/v2') fail(context, `${language} article schema must be publication-candidate-article/v2`)
  if (meta.article_type !== candidate.articleType) fail(context, `${language} article_type does not match candidate articleType`)
  if (meta.edition !== 'research-center') fail(context, `${language} Research Center article must declare edition: research-center`)
  if (meta.research_question !== candidate.researchQuestion) fail(context, `${language} research_question does not match the shared candidate question`)

  const articleHeadings = headings(markdown)
  for (const section of candidate.sections || []) {
    const expected = language === 'zh' ? section.heading_zh : section.heading
    if (!articleHeadings.includes(expected)) fail(context, `${language} article is missing declared heading: ${expected}`)
  }
  if (hasPublicationValidationLeap(markdown)) fail(context, `${language} article contains a publication/DOI/review status to validation leap`)
  return { path, markdown, headings: articleHeadings }
}

function validateCommunityEdition(community, candidate, mainArticles, context) {
  const allowed = new Set(['generated', 'not-generated', 'deferred'])
  if (!community || !allowed.has(community.decision)) {
    fail(context, 'communityEdition.decision must be generated, not-generated, or deferred')
    return
  }
  if (!String(community.rationale || '').trim() && community.decision !== 'generated') fail(context, 'non-generated Community Edition requires a rationale')
  if (community.decision !== 'generated') return

  communityCount += 1
  for (const field of ['targetCommunity', 'title', 'title_zh', 'angle', 'discussionQuestion', 'enPath', 'zhPath']) {
    if (!String(community[field] || '').trim()) fail(context, `generated Community Edition is missing ${field}`)
  }
  if (community.title === candidate.title || community.title_zh === candidate.title_zh) fail(context, 'Community Edition title must differ from the Research Center title in both languages')

  const enPath = resolveRepoPath(community.enPath, context)
  const zhPath = resolveRepoPath(community.zhPath, context)
  if (!enPath || !zhPath) return
  const en = readFileSync(enPath, 'utf8')
  const zh = readFileSync(zhPath, 'utf8')
  for (const [language, markdown] of [['en', en], ['zh', zh]]) {
    const meta = frontmatter(markdown)
    if (!meta || meta.edition !== 'community') fail(context, `${language} Community Edition must declare edition: community`)
    if (hasPublicationValidationLeap(markdown)) fail(context, `${language} Community Edition contains a publication/DOI/review status to validation leap`)
  }
  if (mainArticles.en && normalizedBody(mainArticles.en.markdown) === normalizedBody(en)) fail(context, 'English Community Edition is an identical copy of the Research Center article')
  if (mainArticles.zh && normalizedBody(mainArticles.zh.markdown) === normalizedBody(zh)) fail(context, 'Chinese Community Edition is an identical copy of the Research Center article')
  if (mainArticles.en && headings(en).join('|') === mainArticles.en.headings.join('|')) fail(context, 'English Community Edition must use a different section structure')
  if (mainArticles.zh && headings(zh).join('|') === mainArticles.zh.headings.join('|')) fail(context, 'Chinese Community Edition must use a different section structure')
}

function validateCandidate(candidate, context) {
  candidateCount += 1
  for (const field of ['itemId', 'articleType', 'researchQuestion', 'title', 'title_zh', 'zhPath', 'enPath', 'endingModule']) {
    if (!String(candidate[field] || '').trim()) fail(context, `missing ${field}`)
  }

  if (!registeredTypes.has(candidate.articleType)) {
    const definition = candidate.articleTypeDefinition
    if (!definition || !String(definition.purpose || '').trim() || !String(definition.defaultProjectRole || '').trim()) {
      fail(context, `unregistered article type ${candidate.articleType} requires articleTypeDefinition`)
    }
  }

  if (!Array.isArray(candidate.sections) || candidate.sections.length < 2) {
    fail(context, 'sections[] must contain at least two content-bearing dynamic modules')
  } else {
    const seen = new Set()
    for (const section of candidate.sections) {
      if (!String(section.module || '').trim()) fail(context, 'section is missing module')
      if (seen.has(section.module)) fail(context, `duplicate module: ${section.module}`)
      seen.add(section.module)
      if (!registeredModules.has(section.module) && !String(candidate.moduleDefinitions?.[section.module] || '').trim()) {
        fail(context, `unregistered module ${section.module} requires moduleDefinitions entry`)
      }
      if (!String(section.heading || '').trim() || !String(section.heading_zh || '').trim()) fail(context, `${section.module} requires bilingual natural headings`)
    }
    if (candidate.endingModule !== candidate.sections.at(-1)?.module) fail(context, 'endingModule must equal the final dynamic section module')
  }

  if (!Array.isArray(candidate.evidenceClaims) || candidate.evidenceClaims.length === 0) {
    fail(context, 'evidenceClaims[] must contain at least one material claim')
  } else {
    const claimIds = new Set()
    for (const claim of candidate.evidenceClaims) {
      claimCount += 1
      if (!String(claim.id || '').trim() || claimIds.has(claim.id)) fail(context, `claim id is missing or duplicated: ${claim.id || '(empty)'}`)
      claimIds.add(claim.id)
      const strengths = config.evidenceIdentities?.[claim.identity]
      if (!strengths) fail(context, `unknown evidence identity: ${claim.identity}`)
      else if (!strengths.includes(claim.strength)) fail(context, `${claim.identity} does not allow strength ${claim.strength}`)
      for (const field of ['claim', 'claim_zh', 'source']) {
        if (!String(claim[field] || '').trim()) fail(context, `${claim.id || '(claim)'} is missing ${field}`)
      }
      if (claim.identity === 'internal-experimental-evidence') {
        if (claim.independent !== false) fail(context, `${claim.id} internal evidence must set independent=false`)
        if (!/internal/i.test(claim.claim || '') || !/内部/.test(claim.claim_zh || '')) fail(context, `${claim.id} internal evidence must be explicitly labeled internal in both languages`)
      }
      if (claim.identity === 'independent-evidence') {
        if (claim.independent !== true) fail(context, `${claim.id} independent evidence must set independent=true`)
        if (!/^https?:\/\//.test(claim.source || '')) fail(context, `${claim.id} independent evidence must identify an external source URL`)
      }
      if (hasPublicationValidationLeap(`${claim.claim} ${claim.claim_zh}`)) fail(context, `${claim.id} contains a publication/DOI/review status to validation leap`)
    }
  }

  const relevance = candidate.projectRelevance
  if (!relevance || !projectStatuses.has(relevance.status)) fail(context, 'projectRelevance.status is invalid')
  else {
    if (!Array.isArray(relevance.projects)) fail(context, 'projectRelevance.projects must be an array')
    if (!String(relevance.rationale || '').trim()) fail(context, 'projectRelevance.rationale is required')
    if (relevance.status === 'none' && relevance.projects.length) fail(context, 'projectRelevance.status=none requires an empty projects array')
    if (candidate.articleType === 'project-research' && relevance.status !== 'research-object') fail(context, 'project-research must declare projectRelevance.status=research-object')
  }

  for (const gate of requiredGates) {
    if (candidate.gates?.[gate] !== 'PASS') fail(context, `${gate} gate must be PASS`)
  }

  const mainArticles = {
    en: validateArticle(candidate.enPath, candidate, 'en', context),
    zh: validateArticle(candidate.zhPath, candidate, 'zh', context)
  }
  if (relevance?.status === 'none') {
    for (const [language, article] of Object.entries(mainArticles)) {
      if (article && SELF_PROJECT_PATTERN.test(article.markdown)) fail(context, `${language} article declares no project relevance but contains TMPA, FCoP, or CodeFlowMu`)
    }
  }
  validateCommunityEdition(candidate.communityEdition, candidate, mainArticles, context)

  if (candidate.category === 'weekly') {
    const weekly = candidate.weeklySynthesis
    for (const field of config.weeklyResearch?.requiredReasoning || []) {
      if (!Array.isArray(weekly?.[field]) || weekly[field].length === 0) fail(context, `Weekly Research requires non-empty ${field}`)
    }
  }

  return (candidate.sections || []).map((section) => section.module).join('>')
}

for (const path of walk(join(ROOT, 'research/runtime/candidates')).filter((item) => item.endsWith('-candidates.json'))) {
  const batch = readJson(path)
  if (!batch || batch.schema !== 'runtime-publication-candidate/v2' || batch.status !== 'Completed') continue
  for (const candidate of batch.candidates || []) validateCandidate(candidate, `${slash(path)}#${candidate.itemId || 'unknown'}`)
}

if (existsSync(FIXTURE_PATH)) {
  const fixture = readJson(FIXTURE_PATH)
  if (fixture) {
    const signatures = []
    for (const candidate of fixture.candidates || []) {
      fixtureCount += 1
      signatures.push(validateCandidate(candidate, `${slash(FIXTURE_PATH)}#${candidate.itemId || 'unknown'}`))
    }
    if (fixture.expectDistinctStructures && new Set(signatures).size !== signatures.length) fail(slash(FIXTURE_PATH), 'regression articles must have distinct dynamic module sequences')
    for (const test of fixture.claimLanguageCases || []) {
      const actual = hasPublicationValidationLeap(test.text)
      if (actual !== test.expectLeap) fail(slash(FIXTURE_PATH), `claim-language case ${test.id} expected leap=${test.expectLeap} but received ${actual}`)
    }
  }
}

if (errors.length) {
  console.error(`Publication Editorial validation failed with ${errors.length} error(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`Publication Editorial validation passed: ${candidateCount} V2 candidates (${fixtureCount} regression fixtures), ${claimCount} evidence claims, ${communityCount} Community Editions.`)
}
