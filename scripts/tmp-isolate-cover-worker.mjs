#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

function readText(relative) {
  return readFileSync(path.join(ROOT, relative), 'utf8').replace(/\r\n/g, '\n')
}

function writeText(relative, content) {
  const target = path.join(ROOT, relative)
  mkdirSync(path.dirname(target), { recursive: true })
  writeFileSync(target, content.endsWith('\n') ? content : `${content}\n`, 'utf8')
}

function readJson(relative) {
  return JSON.parse(readText(relative))
}

function writeJson(relative, value) {
  writeText(relative, JSON.stringify(value, null, 2))
}

function mustReplace(text, before, after, label) {
  if (!text.includes(before)) throw new Error(`Missing patch anchor: ${label}`)
  return text.replace(before, after)
}

const receiptContractPath = 'research/runtime/COVER-GENERATION-RECEIPT-V1.md'
const receiptContract = `# Isolated Article Cover Generation Contract V1

## Purpose

Article Cover image generation is executed outside the Research Runtime Production conversation. Production owns article writing, Cover Brief creation, candidate assembly and every final gate. The isolated cover worker owns only one article-cover generation request at a time.

This boundary exists because a cloud image tool can absorb surrounding conversation context even when the immediate image prompt is article-only. The isolated worker invocation therefore must not receive Runtime, Scheduler, recovery, checkpoint, GitHub, completion-report, batch, dashboard or other control-plane narrative.

## Canonical paths

For one eligible Research Object:

\`\`\`text
research/runtime/production-work/YYYY/MM/DD/<itemId>/cover-brief.json
research/runtime/production-work/YYYY/MM/DD/<itemId>/accepted-cover.png|webp|jpg|jpeg
research/runtime/production-work/YYYY/MM/DD/<itemId>/cover-generation-receipt.json
\`\`\`

The accepted cover is a pre-candidate Production asset. Production copies the verified raster bytes into the candidate's canonical \`staging/publication-candidates/...-cover.*\` path only when it assembles the atomic candidate bundle.

## Article Cover Brief

The brief uses \`article-cover-brief/v1\` and is persisted by Production before image generation. It contains only article-level visual semantics plus destination metadata:

\`\`\`json
{
  "schema": "article-cover-brief/v1",
  "runDate": "YYYY-MM-DD",
  "itemId": "Q-...",
  "briefId": "YYYY-MM-DD:Q-...:cover-v1",
  "sanitizedPrompt": "Positive article-only physical scene plus rich editorial art direction.",
  "reviewExclusions": ["post-generation review criteria only"],
  "acceptedAssetPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../accepted-cover.png",
  "receiptPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../cover-generation-receipt.json"
}
\`\`\`

\`sanitizedPrompt\` contains one dominant visual metaphor plus hero subject, environment, foreground/midground/background depth, camera framing, refined material language, cinematic key/rim/volumetric lighting, restrained palette, atmospheric depth, sophisticated technology-editorial composition, intentional negative space and thumbnail-scale focal clarity. Review exclusions are never appended to the image prompt.

## Isolated worker input boundary

The isolated cover worker is a separate invocation/context. For one article it may read only:

1. that article's \`cover-brief.json\`;
2. this contract;
3. the minimum destination metadata already inside the brief.

It must not read the Runtime record, Production result, recovery history, Scheduler, Worker Control, generated Production Prompt, article body, another article's brief, batch metadata, GitHub status or any completion/report text before image generation.

The image tool receives exactly the positive \`sanitizedPrompt\`. The worker may inspect the resulting image and retry within the governed attempt limit, but retry text must remain a newly composed positive article scene and must not describe the failed output or surrounding Runtime context.

## Receipt contract

After accepting a real raster image, the isolated worker persists \`cover-generation-receipt/v1\`:

\`\`\`json
{
  "schema": "cover-generation-receipt/v1",
  "status": "Accepted",
  "workerContext": "isolated-cover-worker",
  "runDate": "YYYY-MM-DD",
  "itemId": "Q-...",
  "briefId": "YYYY-MM-DD:Q-...:cover-v1",
  "briefPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../cover-brief.json",
  "briefSha256": "64 lowercase hex characters",
  "sanitizedPrompt": "Exact positive prompt actually sent to image generation.",
  "generationAttempts": 1,
  "acceptedAssetPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../accepted-cover.png",
  "assetSha256": "64 lowercase hex characters",
  "semanticReview": "PASS",
  "editorialThumbnailReview": "PASS",
  "createdAt": "ISO-8601 timestamp"
}
\`\`\`

The receipt and accepted asset are committed and remotely verified before Production consumes them.

## Production consumption gate

For Production dates on or after 2026-08-15, a cover cannot pass merely because a raster file exists. Production must verify all of the following:

- brief, receipt and accepted asset belong to the same \`runDate\` and \`itemId\`;
- \`briefId\` matches exactly and is date-bound;
- \`briefSha256\` equals the current Cover Brief bytes;
- receipt \`sanitizedPrompt\` equals the brief's positive \`sanitizedPrompt\` and contains no Runtime/control/exclusion contamination;
- \`generationAttempts\` is within the governed 1..3 range;
- \`semanticReview=PASS\` and \`editorialThumbnailReview=PASS\`;
- accepted asset is a real PNG, JPEG or WebP under the same item's Production-work directory;
- \`assetSha256\` equals the accepted asset bytes;
- the candidate cover copied by Production is byte-identical to the accepted asset;
- receipt and candidate cover are bound into Production result/checkpoint artifacts.

Stale, prior-date, unmatched, non-raster, missing or failed receipts are rejected. No prose claim can substitute for the receipt.

## Authority boundary

A receipt proves only that the isolated cover worker accepted one article-specific raster asset under this contract. It does not complete Production. Production still owns Research Value, Independence, Evidence, Structure, Language, Bilingual Consistency, Cover, Inline Visual, Layout, candidate-bundle, validator and terminal-proof gates.

Inline Figures remain optional \`0..N\` article-body assets and are not part of this isolated Article Cover contract.
`
writeText(receiptContractPath, receiptContract)

// Scheduler: Production prepares briefs and consumes isolated receipts; it no longer generates images itself.
const schedulerPath = 'research/runtime/SCHEDULER.json'
const scheduler = readJson(schedulerPath)
const productionTask = scheduler.tasks.find((task) => task.id === 'production')
if (!productionTask) throw new Error('Missing production Scheduler task')
productionTask.work = 'Write complete bilingual V2 candidates using a selected article type and dynamic modules; classify claim identities and project relevance; persist one same-date Article Cover Brief per eligible object; consume only same-date isolated cover-worker receipts and accepted raster assets; decide and contextually insert 0..N Inline Figures; pass six editorial gates plus Cover, Inline Visual and Article Layout gates; and record an optional Community Edition decision.'
for (const prohibition of ['Calling image generation from the Production Runtime conversation', 'Accepting an Article Cover without a valid isolated cover-worker receipt']) {
  if (!productionTask.prohibitions.includes(prohibition)) productionTask.prohibitions.push(prohibition)
}
writeJson(schedulerPath, scheduler)

// Worker prompt config: v2.9.0 removes direct image-generation capability from Production.
const configPath = 'research/runtime/worker-prompts/CONFIG.json'
const config = readJson(configPath)
const production = config.tasks.find((task) => task.task === 'production')
if (!production) throw new Error('Missing production worker prompt config')
production.version = '2.9.0'
production.effectiveDate = '2026-08-15'
production.requiredCapabilities = []
production.rules = [
  'Produce complete bilingual V2 Publication Candidates only from completed same-run-date Research Objects.',
  'Apply dynamic article architecture, independent evidence grading, Research Center and Community Edition separation, and every declared gate.',
  'Persist one article-cover-brief/v1 per eligible Research Object before any cover is accepted. Production must never call image generation from the Runtime conversation.',
  'Consume Article Covers only through same-date cover-generation-receipt/v1 records created by a separate isolated cover-worker invocation. The isolated worker receives one article positive visual brief plus minimum destination metadata and no Runtime or recovery narrative.',
  'Reject stale, prior-date, mismatched, missing, non-raster or failed cover receipts/assets. Brief hash, itemId, briefId, accepted asset hash and candidate cover bytes must bind exactly.',
  'A cover-worker receipt PASS is necessary but not sufficient: Production remains responsible for all editorial, evidence, bilingual, Cover, Inline Visual, Layout, candidate-bundle and terminal-proof gates.',
  'Resume only from the latest same-run-date checkpoint committed on main. If its Prompt identity is stale, reject that checkpoint as resumable progress and re-execute the earliest unproved node under current control; stale checkpoint rejection must not terminate an explicitly authorized recovery by itself.',
  'Verify the current Prompt directly when hashing is available. Otherwise require CONTROL and MANIFEST agreement plus a successful Validate Research Center 3.0 / build run for the exact pinned main HEAD, and record promptVerificationMode=exact-head-ci with the Actions run URL.',
  'For an explicitly authorized same-day recovery of Failed or Blocked Production, persist runtime-process-kick/v2 with requestMode=terminal-recovery, nominalTask=production and allowTerminalReopen=true. Ordinary v1 kicks and timer wakes must never reopen terminal state.',
  'A Completed result with eligible inputs must declare productionMode=candidate-batch and pass npm run runtime:production:proof. If the Worker lacks command execution, Research Runtime Shift Finalization V2.1 must run that proof and persist the remotely verified terminal result before Completed may be reported.',
  'The final task response is plain text only. Never create a Runtime report image, dashboard, poster, status summary or execution evidence.',
  'Build every candidate outside the canonical staging path until its Chinese article, English article, verified isolated cover receipt and source raster, candidate cover copy, optional Inline Figures and completed candidate-batch record are all ready.',
  'Stage and commit the complete candidate bundle exactly once. Before commit run npm run publication:bundle:staged plus every declared validator; never commit one language, an article without its referenced assets, or an incomplete candidate batch.',
  'Do not bypass the repository pre-commit hook, use --no-verify, or write candidate files directly through the GitHub Contents API. Stage candidates only; Production never publishes.'
]
if (!production.requiredSources.includes(receiptContractPath)) {
  const at = production.requiredSources.indexOf('research/runtime/PUBLICATION-CANDIDATE-SCHEMA.md')
  production.requiredSources.splice(at >= 0 ? at + 1 : production.requiredSources.length, 0, receiptContractPath)
}
writeJson(configPath, config)

// Production template: replace direct image-generation section with the isolated-worker handoff.
const productionTemplatePath = 'research/runtime/worker-prompts/templates/production.prompt.md'
let prompt = readText(productionTemplatePath)
const coverStart = prompt.indexOf('Create one dedicated professional editorial Article Cover for each candidate and place it before the H1 title.')
const inlineStart = prompt.indexOf('Inline Figures are optional `0..N`.')
if (coverStart < 0 || inlineStart < 0 || inlineStart <= coverStart) throw new Error('Production cover-section anchors not found')
const isolatedCoverSection = `## Isolated Article Cover boundary

Production owns the article and Cover Brief, but it does not invoke image generation. For every eligible candidate, first persist a same-\`runDate\` \`article-cover-brief/v1\` at \`research/runtime/production-work/YYYY/MM/DD/<itemId>/cover-brief.json\`. The brief contains the candidate's title/core proposition for internal derivation, one unique physical or spatial visual metaphor, the complete positive-only \`sanitizedPrompt\`, post-generation \`reviewExclusions\`, and exact accepted-asset/receipt destination paths defined by \`research/runtime/COVER-GENERATION-RECEIPT-V1.md\`.

The positive \`sanitizedPrompt\` must remain visually rich: one dominant concept; hero subject; surrounding environment; foreground/midground/background relationship; camera viewpoint and framing; depth and scale; refined material language; cinematic key, rim/edge and volumetric lighting when appropriate; controlled contrast; restrained two- or three-family palette; premium enterprise-technology editorial photography or cinematic 3D editorial rendering; sophisticated magazine-cover composition; intentional negative space; landscape framing; and thumbnail-scale focal clarity. The semantic concept stays simple while the visual production language stays rich.

After all same-date briefs are durably committed and verified, Production reaches the \`cover-briefs-persisted\` checkpoint. It must not call ChatGPT image generation from this Runtime conversation. If a valid receipt is not yet available, persist the checkpoint and stop substantive Production work without fabricating a cover PASS. The actual image call belongs to a separate isolated cover-worker invocation whose effective context is restricted by the Cover Generation Receipt V1 contract to exactly one article brief plus minimum destination metadata.

The isolated cover worker writes a real raster pre-candidate asset and \`cover-generation-receipt/v1\` under the same item's Production-work directory. Production resumes only by reading those durable same-date receipts. It must verify date, itemId, briefId, current brief SHA-256, exact positive \`sanitizedPrompt\`, attempt count, raster signature, accepted-asset SHA-256, semantic review and editorial-thumbnail review. Stale, prior-date, mismatched, missing, non-raster or failed receipts/assets are invalid.

For a valid receipt, Production copies the accepted raster bytes into the candidate's canonical \`staging/publication-candidates/...-cover.*\` path while assembling the atomic candidate bundle and records \`coverBriefPath\` and \`coverReceiptPath\` in candidate metadata. Candidate cover bytes must be identical to the receipt-bound accepted asset. The receipt is necessary evidence for \`coverGate\`, but it does not complete Production; Production still runs every Research Value, Independence, Evidence, Structure, Language, Bilingual Consistency, Cover, Inline Visual, Layout, bundle, validator and terminal-proof gate.

For recovery, preserve historical failed image attempts as audit evidence only. Never reuse a superseded contaminated image or prompt. A recovery under this Prompt resumes from the earliest unproved node and consumes only current-brief isolated receipts.

`
prompt = `${prompt.slice(0, coverStart)}${isolatedCoverSection}${prompt.slice(inlineStart)}`
writeText(productionTemplatePath, prompt)

// Visualization skill: move the image call to the isolated worker and keep exclusions review-only.
const visualSkillPath = 'research/skills/06-research-visualization.md'
let visual = readText(visualSkillPath)
visual = mustReplace(
  visual,
  'The Article Cover is a generated raster editorial asset, not a code-drawn visual. Production must use ChatGPT cloud built-in image generation and save the accepted cover as `.png`, `.webp`, `.jpg` or `.jpeg`; it does not call the OpenAI Image API or require an API-key Secret. If cloud image generation is unavailable, the shift closes as `Blocked`; Production must not substitute a hand-authored SVG, CSS composition, diagram or icon card and must not mark `coverGate` as `PASS`.',
  'The Article Cover is a generated raster editorial asset, not a code-drawn visual. Production persists the article-specific Cover Brief, while a separate isolated cover-worker invocation uses ChatGPT cloud built-in image generation and persists the accepted raster plus `cover-generation-receipt/v1`; neither path calls the OpenAI Image API or requires an API-key Secret. Production never invokes image generation from its Runtime conversation. If the isolated worker cannot produce a valid receipt and raster asset, Production cannot mark `coverGate` as `PASS` and must follow governed recovery/terminal policy rather than substituting a hand-authored SVG, CSS composition, diagram or icon card.',
  'visualization direct image-generation paragraph'
)
visual = mustReplace(
  visual,
  '4. Write an image-generation brief: proposition, real or physically credible subject, editorial mood, hierarchy, palette, exact optional text, language, intended canvas and explicit negative constraints (`no cartoon`, `no comic`, `no diagram`, `no flat icon`, `no text` unless required).\n5. Invoke ChatGPT cloud built-in image generation with only this article\'s Brief. Do not send Runtime Dashboard or control-plane context as the prompt, draw the cover in SVG, HTML, CSS or canvas, or convert an explanatory diagram into a raster file merely to satisfy the extension gate.\n6. Inspect the generated image itself and reject cartoon, comic, illustration-card, diagrammatic, generic-template or visibly synthetic failures.\n7. Run the Thumbnail acceptance test.\n8. Render the actual article page and approve the cover only after responsive QA.',
  '4. Write an article-cover brief with one positive physical/spatial visual scene plus complete editorial art direction. Keep negative constraints only in `reviewExclusions`; never append them to `sanitizedPrompt`. Persist the brief under the same-date Production-work path.\n5. Hand exactly one persisted brief to a separate isolated cover-worker invocation. That worker may read only the brief, the Cover Generation Receipt V1 contract and destination metadata; it must not receive Runtime, recovery or batch context.\n6. The isolated worker invokes ChatGPT cloud built-in image generation with exactly the positive `sanitizedPrompt`, inspects the generated image and performs bounded article-only retries when necessary.\n7. The isolated worker runs the Thumbnail acceptance test and persists the accepted raster plus `cover-generation-receipt/v1`.\n8. Production verifies the receipt, current brief hash, raster signature and accepted-asset hash, then copies the exact accepted bytes into the candidate cover path.\n9. Render the actual article page and approve the cover only after responsive QA.',
  'article-cover workflow'
)
writeText(visualSkillPath, visual)

// Publication Candidate contract: bind candidate metadata to the isolated brief and receipt.
const candidateSchemaPath = 'research/runtime/PUBLICATION-CANDIDATE-SCHEMA.md'
let candidateSchema = readText(candidateSchemaPath)
candidateSchema = mustReplace(
  candidateSchema,
  '  "coverPath": "staging/publication-candidates/...-cover.webp",\n  "inlineFigures": [],',
  '  "coverPath": "staging/publication-candidates/...-cover.webp",\n  "coverBriefPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../cover-brief.json",\n  "coverReceiptPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../cover-generation-receipt.json",\n  "inlineFigures": [],',
  'candidate visual metadata example'
)
candidateSchema = mustReplace(
  candidateSchema,
  '## Visual contract\n\nThe Article Cover and optional Inline Figures retain the V1.1 role separation and gates. Visuals do not determine article modules. `inlineFigures: []` is valid.',
  '## Visual contract\n\nThe Article Cover and optional Inline Figures retain the V1.1 role separation and gates. Visuals do not determine article modules. `inlineFigures: []` is valid.\n\nFor Production dates on or after 2026-08-15, every candidate also records `coverBriefPath` and `coverReceiptPath`. The receipt must conform to `research/runtime/COVER-GENERATION-RECEIPT-V1.md`, bind the current same-date brief by SHA-256, bind a real accepted raster asset by SHA-256, and pass semantic plus editorial-thumbnail review. Production must not create the image itself or infer PASS from file existence alone.',
  'candidate visual contract'
)
candidateSchema = mustReplace(
  candidateSchema,
  '- the Article Cover, Inline Visual, and Layout Gates pass;',
  '- the Article Cover is backed by a same-date valid isolated cover-worker receipt, and the Cover, Inline Visual, and Layout Gates pass;',
  'candidate completion cover gate'
)
candidateSchema = mustReplace(
  candidateSchema,
  'A new candidate is one indivisible commit bundle: the Chinese article, English article, dedicated cover, optional Inline Figures, and the completed same-date candidate-batch record. Production must build the bundle outside the canonical staging path, move all members into place together, stage them together, and run:',
  'A new candidate is one indivisible candidate commit bundle: the Chinese article, English article, candidate cover copy, optional Inline Figures, and the completed same-date candidate-batch record. The isolated worker\'s accepted pre-candidate raster and receipt are committed and remotely verified earlier under `research/runtime/production-work/`; Production verifies them, copies the exact accepted raster bytes into the candidate cover path, then builds the remaining candidate bundle outside the canonical staging path, moves all candidate members into place together, stages them together, and runs:',
  'candidate atomic bundle paragraph'
)
writeText(candidateSchemaPath, candidateSchema)

// Production completion proof: require isolated receipts for 2026-08-15 onward while preserving historical compatibility.
const proofPath = 'scripts/runtime-production-proof.mjs'
let proof = readText(proofPath)
proof = mustReplace(
  proof,
  "import { existsSync, readFileSync, readdirSync } from 'node:fs'\nimport path from 'node:path'",
  "import { createHash } from 'node:crypto'\nimport { existsSync, readFileSync, readdirSync } from 'node:fs'\nimport path from 'node:path'",
  'proof crypto import'
)
proof = mustReplace(
  proof,
  "const RASTER_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])\nconst PROMPT_CONTAMINATION =",
  "const RASTER_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])\nconst ISOLATED_COVER_EFFECTIVE_DATE = '2026-08-15'\nconst PROMPT_CONTAMINATION =",
  'proof effective date'
)
proof = mustReplace(
  proof,
  "function containsPromptContamination(prompt) {\n  return PROMPT_CONTAMINATION.test(String(prompt || ''))\n}\n",
  `function containsPromptContamination(prompt) {\n  return PROMPT_CONTAMINATION.test(String(prompt || ''))\n}\n\nfunction sha256File(file) {\n  return createHash('sha256').update(readFileSync(file)).digest('hex')\n}\n\nfunction assertWorkPath(relative, date, itemId, label) {\n  const [year, month, day] = date.split('-')\n  const prefix = \`research/runtime/production-work/\${year}/\${month}/\${day}/\${itemId}/\`\n  if (!repoPath(relative).startsWith(prefix)) fail(\`\${itemId}: \${label} must stay under \${prefix}\`)\n}\n\nfunction validateIsolatedCoverReceipt({ root, date, candidate, artifacts, requiredCheckpointArtifacts }) {\n  const briefPath = repoPath(candidate.coverBriefPath)\n  const receiptPath = repoPath(candidate.coverReceiptPath)\n  if (!briefPath || !receiptPath) fail(\`\${candidate.itemId}: isolated coverBriefPath and coverReceiptPath are required\`)\n  assertWorkPath(briefPath, date, candidate.itemId, 'coverBriefPath')\n  assertWorkPath(receiptPath, date, candidate.itemId, 'coverReceiptPath')\n\n  const briefFile = absolute(root, briefPath)\n  const receiptFile = absolute(root, receiptPath)\n  if (!existsSync(briefFile)) fail(\`\${candidate.itemId}: missing cover brief \${briefPath}\`)\n  if (!existsSync(receiptFile)) fail(\`\${candidate.itemId}: missing cover receipt \${receiptPath}\`)\n  const brief = readJson(briefFile)\n  const receipt = readJson(receiptFile)\n\n  if (brief.schema !== 'article-cover-brief/v1') fail(\`\${candidate.itemId}: invalid cover brief schema\`)\n  if (brief.runDate !== date || brief.itemId !== candidate.itemId) fail(\`\${candidate.itemId}: cover brief date/item mismatch\`)\n  if (!String(brief.briefId || '').startsWith(\`\${date}:\`)) fail(\`\${candidate.itemId}: cover briefId must be date-bound\`)\n  if (!String(brief.sanitizedPrompt || '').trim() || containsPromptContamination(brief.sanitizedPrompt)) {\n    fail(\`\${candidate.itemId}: cover brief sanitizedPrompt must be positive-only article imagery\`)\n  }\n\n  if (receipt.schema !== 'cover-generation-receipt/v1' || receipt.status !== 'Accepted') fail(\`\${candidate.itemId}: invalid isolated cover receipt\`)\n  if (receipt.workerContext !== 'isolated-cover-worker') fail(\`\${candidate.itemId}: cover receipt workerContext must be isolated-cover-worker\`)\n  if (receipt.runDate !== date || receipt.itemId !== candidate.itemId) fail(\`\${candidate.itemId}: cover receipt date/item mismatch\`)\n  if (receipt.briefId !== brief.briefId || repoPath(receipt.briefPath) !== briefPath) fail(\`\${candidate.itemId}: cover receipt does not bind current brief identity/path\`)\n  if (receipt.briefSha256 !== sha256File(briefFile)) fail(\`\${candidate.itemId}: cover receipt briefSha256 does not match current brief bytes\`)\n  if (receipt.sanitizedPrompt !== brief.sanitizedPrompt || containsPromptContamination(receipt.sanitizedPrompt)) {\n    fail(\`\${candidate.itemId}: cover receipt sanitizedPrompt must equal the positive-only current brief prompt\`)\n  }\n  if (!Number.isInteger(receipt.generationAttempts) || receipt.generationAttempts < 1 || receipt.generationAttempts > 3) {\n    fail(\`\${candidate.itemId}: isolated generationAttempts must be between 1 and 3\`)\n  }\n  if (receipt.semanticReview !== 'PASS' || receipt.editorialThumbnailReview !== 'PASS') {\n    fail(\`\${candidate.itemId}: isolated semantic and editorial thumbnail reviews must PASS\`)\n  }\n\n  const acceptedAssetPath = repoPath(receipt.acceptedAssetPath)\n  assertWorkPath(acceptedAssetPath, date, candidate.itemId, 'acceptedAssetPath')\n  const acceptedAssetFile = absolute(root, acceptedAssetPath)\n  if (!existsSync(acceptedAssetFile)) fail(\`\${candidate.itemId}: accepted isolated cover asset is missing\`)\n  assertRaster(acceptedAssetFile, acceptedAssetPath)\n  const acceptedSha = sha256File(acceptedAssetFile)\n  if (!/^[0-9a-f]{64}$/.test(String(receipt.assetSha256 || '')) || receipt.assetSha256 !== acceptedSha) {\n    fail(\`\${candidate.itemId}: accepted isolated cover assetSha256 mismatch\`)\n  }\n  if (sha256File(absolute(root, candidate.coverPath)) !== acceptedSha) {\n    fail(\`\${candidate.itemId}: candidate cover bytes do not match receipt-bound accepted asset\`)\n  }\n  if (!artifacts.has(receiptPath)) fail(\`result artifacts do not bind \${receiptPath}\`)\n  requiredCheckpointArtifacts.add(receiptPath)\n  requiredCheckpointArtifacts.add(repoPath(candidate.coverPath))\n}\n`,
  'proof isolated receipt helper'
)
proof = mustReplace(
  proof,
  '  const evidence = new Map((result.coverEvidence || []).map((item) => [item.itemId, item]))',
  '  const legacyEvidence = new Map((result.coverEvidence || []).map((item) => [item.itemId, item]))',
  'proof legacy evidence map'
)
const legacyBlockStart = proof.indexOf('    const cover = evidence.get(candidate.itemId)')
const legacyBlockEndMarker = '    requiredCheckpointArtifacts.add(repoPath(candidate.coverPath))\n'
const legacyBlockEnd = proof.indexOf(legacyBlockEndMarker, legacyBlockStart)
if (legacyBlockStart < 0 || legacyBlockEnd < 0) throw new Error('Proof legacy cover block anchors not found')
const isolatedBranch = `    if (date >= ISOLATED_COVER_EFFECTIVE_DATE) {\n      validateIsolatedCoverReceipt({ root, date, candidate, artifacts, requiredCheckpointArtifacts })\n    } else {\n      const cover = legacyEvidence.get(candidate.itemId)\n      if (!cover) fail(\`\${candidate.itemId}: missing structured coverEvidence\`)\n      if (repoPath(cover.coverPath) !== repoPath(candidate.coverPath)) fail(\`\${candidate.itemId}: coverEvidence path mismatch\`)\n      if (cover.semanticReview !== 'PASS') fail(\`\${candidate.itemId}: semanticReview must be PASS\`)\n      if (!Number.isInteger(cover.generationAttempts) || cover.generationAttempts < 1 || cover.generationAttempts > 3) {\n        fail(\`\${candidate.itemId}: generationAttempts must be between 1 and 3\`)\n      }\n      if (!String(cover.briefId || '').startsWith(\`\${date}:\`)) fail(\`\${candidate.itemId}: briefId must be bound to \${date}\`)\n      if (!String(cover.sanitizedPrompt || '').trim()) fail(\`\${candidate.itemId}: sanitizedPrompt is required\`)\n      if (containsPromptContamination(cover.sanitizedPrompt)) {\n        fail(\`\${candidate.itemId}: sanitizedPrompt must be positive-only article imagery without control, exclusion or negation language\`)\n      }\n      requiredCheckpointArtifacts.add(repoPath(candidate.coverPath))\n    }\n`
proof = `${proof.slice(0, legacyBlockStart)}${isolatedBranch}${proof.slice(legacyBlockEnd + legacyBlockEndMarker.length)}`
writeText(proofPath, proof)

// Terminal regression tests: synthesize valid isolated brief/receipt/asset evidence for current dates.
const terminalTestPath = 'scripts/runtime-shift-terminal-test.mjs'
let terminalTest = readText(terminalTestPath)
terminalTest = mustReplace(
  terminalTest,
  "import assert from 'node:assert/strict'\nimport { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'",
  "import assert from 'node:assert/strict'\nimport { createHash } from 'node:crypto'\nimport { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'",
  'terminal test crypto import'
)
const fnStart = terminalTest.indexOf('function writeCompletedProductionProof(root, date, result) {')
const loopStart = terminalTest.indexOf('\nfor (const terminalStatus of', fnStart)
if (fnStart < 0 || loopStart < 0) throw new Error('Terminal test proof fixture anchors not found')
const newFixture = `function writeCompletedProductionProof(root, date, result) {\n  const [year, month, day] = date.split('-')\n  const compact = date.replaceAll('-', '')\n  const itemId = \`Q-\${compact}-01\`\n  const slug = \`\${date}-proof-candidate\`\n  const zhPath = \`staging/publication-candidates/\${slug}.zh.md\`\n  const enPath = \`staging/publication-candidates/\${slug}.en.md\`\n  const coverPath = \`staging/publication-candidates/\${slug}-cover.png\`\n  const workDir = \`research/runtime/production-work/\${year}/\${month}/\${day}/\${itemId}\`\n  const coverBriefPath = \`\${workDir}/cover-brief.json\`\n  const acceptedAssetPath = \`\${workDir}/accepted-cover.png\`\n  const coverReceiptPath = \`\${workDir}/cover-generation-receipt.json\`\n  const batchPath = \`research/runtime/candidates/\${year}/\${month}/\${date}-candidates.json\`\n  const checkpointPath = \`research/runtime/checkpoints/\${year}/\${month}/\${date}-production.json\`\n  const sanitizedPrompt = 'Cinematic editorial landscape photography of one durable illuminated bridge crossing a dark interrupted valley, restrained steel blue and amber palette, strong focal hierarchy, wide sixteen by nine composition.'\n\n  const article = (language) => \`---\\nschema: "publication-candidate-article/v2"\\ntitle: "Proof \${language}"\\ndate: "\${date}"\\ncover: "\${coverPath}"\\n---\\n\\n![Cover](\${coverPath})\\n\\n# Proof \${language}\\n\`\n  const analysis = \`---\\nschema: "research-analysis/v1"\\nid: "AN-\${compact}-01"\\ndate: "\${date}"\\nqueue_item: "\${itemId}"\\nstatus: "ReadyForProduction"\\nproduction_input_authorized: true\\n---\\n\\n# Input\\n\`\n  mkdirSync(path.dirname(path.join(root, zhPath)), { recursive: true })\n  writeFileSync(path.join(root, zhPath), article('ZH'))\n  writeFileSync(path.join(root, enPath), article('EN'))\n  const coverBytes = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0])\n  mkdirSync(path.dirname(path.join(root, acceptedAssetPath)), { recursive: true })\n  writeFileSync(path.join(root, acceptedAssetPath), coverBytes)\n  writeFileSync(path.join(root, coverPath), coverBytes)\n  mkdirSync(path.join(root, 'research/analysis'), { recursive: true })\n  writeFileSync(path.join(root, \`research/analysis/\${itemId}-proof.md\`), analysis)\n\n  const brief = {\n    schema: 'article-cover-brief/v1',\n    runDate: date,\n    itemId,\n    briefId: \`\${date}:\${itemId}:cover-v1\`,\n    sanitizedPrompt,\n    reviewExclusions: ['review-only'],\n    acceptedAssetPath,\n    receiptPath: coverReceiptPath\n  }\n  const briefText = \`\${JSON.stringify(brief, null, 2)}\\n\`\n  writeFileSync(path.join(root, coverBriefPath), briefText)\n  writeJson(path.join(root, coverReceiptPath), {\n    schema: 'cover-generation-receipt/v1',\n    status: 'Accepted',\n    workerContext: 'isolated-cover-worker',\n    runDate: date,\n    itemId,\n    briefId: brief.briefId,\n    briefPath: coverBriefPath,\n    briefSha256: createHash('sha256').update(briefText).digest('hex'),\n    sanitizedPrompt,\n    generationAttempts: 1,\n    acceptedAssetPath,\n    assetSha256: createHash('sha256').update(coverBytes).digest('hex'),\n    semanticReview: 'PASS',\n    editorialThumbnailReview: 'PASS',\n    createdAt: \`\${date}T16:00:00+08:00\`\n  })\n\n  writeJson(path.join(root, batchPath), {\n    schema: 'runtime-publication-candidate/v2',\n    date,\n    timezone: 'Asia/Shanghai',\n    status: 'Completed',\n    candidates: [{\n      itemId, zhPath, enPath, coverPath, coverBriefPath, coverReceiptPath,\n      gates: { researchValue: 'PASS', evidence: 'PASS' },\n      coverGate: 'PASS', inlineVisualGate: 'PASS', layoutGate: 'PASS'\n    }]\n  })\n  writeJson(path.join(root, checkpointPath), {\n    schema: 'runtime-production-checkpoint/v1',\n    runDate: date,\n    node: 'validators-passed',\n    status: 'Completed',\n    artifacts: [batchPath, coverPath, coverReceiptPath],\n    evidence: [],\n    sourceCommit: 'b'.repeat(40),\n    updatedAt: \`\${date}T16:00:00+08:00\`\n  })\n  result.productionMode = 'candidate-batch'\n  result.artifacts = [batchPath, coverPath, coverReceiptPath]\n}\n`
terminalTest = `${terminalTest.slice(0, fnStart)}${newFixture}${terminalTest.slice(loopStart)}`
const contamStart = terminalTest.indexOf("{\n  const root = mkdtempSync(path.join(os.tmpdir(), 'runtime-contaminated-cover-prompt-'))")
const staleStart = terminalTest.indexOf("{\n  const root = mkdtempSync(path.join(os.tmpdir(), 'runtime-stale-production-'))", contamStart)
if (contamStart < 0 || staleStart < 0) throw new Error('Terminal test contamination block anchors not found')
const newContam = `{\n  const root = mkdtempSync(path.join(os.tmpdir(), 'runtime-contaminated-cover-prompt-'))\n  try {\n    const date = shanghaiDate()\n    const [year, month] = date.split('-')\n    const result = {\n      schema: 'runtime-shift-result/v2',\n      task: 'production',\n      status: 'Completed',\n      runtimeDate: date,\n      metrics: [], evidence: [], artifacts: []\n    }\n    writeCompletedProductionProof(root, date, result)\n    const batch = JSON.parse(readFileSync(path.join(root, \`research/runtime/candidates/\${year}/\${month}/\${date}-candidates.json\`), 'utf8'))\n    const receiptFile = path.join(root, batch.candidates[0].coverReceiptPath)\n    const receipt = JSON.parse(readFileSync(receiptFile, 'utf8'))\n    receipt.sanitizedPrompt = 'No dashboard, no report, no text; show one bridge.'\n    writeJson(receiptFile, receipt)\n    assert.throws(\n      () => validateProductionCompletion({ root, date, result }),\n      /positive-only current brief prompt/\n    )\n  } finally {\n    rmSync(root, { recursive: true, force: true })\n  }\n}\n\n`
terminalTest = `${terminalTest.slice(0, contamStart)}${newContam}${terminalTest.slice(staleStart)}`
terminalTest = terminalTest.replace(
  "console.log('Runtime shift terminal finalization tests passed for terminal states, stale-date rejection and positive-only cover prompts.')",
  "console.log('Runtime shift terminal finalization tests passed for terminal states, stale-date rejection and isolated cover receipt validation.')"
)
writeText(terminalTestPath, terminalTest)

console.log('Prepared isolated Article Cover worker boundary patch. Run worker-prompts:build and repository validators next.')
