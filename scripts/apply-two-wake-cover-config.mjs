#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')
const write = (p, content) => fs.writeFileSync(path.join(root, p), content.endsWith('\n') ? content : `${content}\n`, 'utf8')
const readJson = (p) => JSON.parse(read(p))
const writeJson = (p, value) => write(p, JSON.stringify(value, null, 2))

const schedulerPath = 'research/runtime/SCHEDULER.json'
const scheduler = readJson(schedulerPath)
scheduler.auxiliaryWorkers = [{
  id: 'isolated-cover-worker',
  name: 'Isolated Article Cover Worker',
  name_zh: '隔离题图工作器',
  ownerTask: 'production',
  role: 'production-auxiliary',
  schedule: { kind: 'daily', time: '16:00', cron: '0 8 * * *' },
  prompt: 'research/runtime/worker-prompts/isolated-cover-worker.prompt.md',
  inputContract: 'research/runtime/COVER-WORKER-INPUT-V1.json',
  receiptContract: 'research/runtime/COVER-GENERATION-RECEIPT-V1.md',
  inputRoot: 'research/runtime/production-work/YYYY/MM/DD',
  output: 'cover-generation-receipt/v1 plus accepted raster asset',
  finalizationWorkflow: '.github/workflows/research-production-cover-finalization.yml',
  chatgptWake: true,
  formalRuntimeStage: false
}]
writeJson(schedulerPath, scheduler)

const configPath = 'research/runtime/worker-prompts/CONFIG.json'
const config = readJson(configPath)
const production = config.tasks.find((entry) => entry.task === 'production')
if (!production) throw new Error('Production prompt config not found')
production.version = '2.10.0'
production.rules = [
  'Produce complete bilingual V2 Publication Candidates only from completed same-run-date Research Objects.',
  'Apply dynamic article architecture, independent evidence grading, Research Center and Community Edition separation, and every declared gate.',
  'At the 15:00 Production Preparation wake, persist complete bilingual pre-candidate drafts, one article-cover-brief/v1 per eligible Research Object, and production-prepared-bundle/v1; then persist the awaiting-isolated-covers checkpoint and stop. Production must never call image generation.',
  'The separate 16:00 isolated cover worker reads one worker-safe contract and one article brief at a time, generates only that cover, and persists same-date cover-generation-receipt/v1 evidence plus the accepted raster asset.',
  'Reject stale, prior-date, mismatched, missing, non-raster or failed cover receipts/assets. Brief hash, itemId, briefId, accepted asset hash and candidate cover bytes must bind exactly.',
  'After all receipts are durable, GitHub deterministic cover finalization mechanically assembles the already-prepared candidate bundle, runs validators and creates the Production completion request; no third ChatGPT wake is required.',
  'A cover-worker receipt PASS is necessary but not sufficient: Production Preparation remains the semantic owner of article content, non-cover gates and candidate intent; deterministic finalization may only project those prepared facts after receipt validation.',
  'Resume only from the latest same-run-date checkpoint committed on main. If its Prompt identity is stale, reject that checkpoint as resumable progress and re-execute the earliest unproved node under current control; stale checkpoint rejection must not terminate an explicitly authorized recovery by itself.',
  'Verify the current Prompt directly when hashing is available. Otherwise require CONTROL and MANIFEST agreement plus a successful Validate Research Center 3.0 / build run for the exact pinned main HEAD, and record promptVerificationMode=exact-head-ci with the Actions run URL.',
  'For an explicitly authorized same-day recovery of Failed or Blocked Production, persist runtime-process-kick/v2 with requestMode=terminal-recovery, nominalTask=production and allowTerminalReopen=true. Ordinary v1 kicks and timer wakes must never reopen terminal state.',
  'A Completed result with eligible inputs must declare productionMode=candidate-batch and pass npm run runtime:production:proof. Research Runtime Shift Finalization V2.1 persists and remotely verifies the terminal state.',
  'The final task response is plain text only. Never create a Runtime report image, dashboard, poster, status summary or execution evidence.',
  'Build every candidate outside the canonical staging path until its Chinese article, English article, verified isolated cover receipt and source raster, candidate cover copy, optional Inline Figures and completed candidate-batch record are all ready.',
  'Do not bypass the repository pre-commit hook, use --no-verify, or write candidate files directly through the GitHub Contents API. Production never publishes.'
]
writeJson(configPath, config)

const contractPath = 'research/runtime/COVER-GENERATION-RECEIPT-V1.md'
let contract = read(contractPath)
if (!contract.includes('## Production preparation bundle')) {
  contract += `\n## Production preparation bundle\n\nThe 15:00 Production Preparation wake persists \`research/runtime/production-work/YYYY/MM/DD/prepared-bundle.json\` using \`production-prepared-bundle/v1\`. It contains the complete same-date semantic Production decision before raster covers exist: one item per eligible Research Object, pre-candidate Chinese and English draft paths, final staging article/cover paths, current Cover Brief and expected Receipt paths, complete candidate metadata with all non-cover gates decided by Production Preparation, and a meaningful \`resultBase\`. Production then persists checkpoint node \`awaiting-isolated-covers\` and leaves the formal Production shift open.\n\n## Deterministic cover finalization\n\nAfter all required same-date receipts are durable, \`.github/workflows/research-production-cover-finalization.yml\` runs \`scripts/runtime-production-cover-finalize.mjs\`. The script performs no research or writing. It validates every current brief/receipt/asset binding, copies the already-prepared bilingual drafts and accepted raster bytes into final staging paths, creates the completed candidate batch, advances the checkpoint to \`validators-passed\`, writes the prepared Production result as \`Completed\`, and creates the governed Production completion request. The workflow runs bundle, layout, editorial, Production proof and Runtime validators before committing. The existing Shift Finalization workflow then persists the terminal transition and remote verification. No additional ChatGPT wake is used.\n`
}
write(contractPath, contract)

const templatePath = 'research/runtime/worker-prompts/templates/production.prompt.md'
let template = read(templatePath)
const oldBlock = `After all same-date briefs are durably committed and verified, Production reaches the \`cover-briefs-persisted\` checkpoint. It must not call ChatGPT image generation from this Runtime conversation. If a valid receipt is not yet available, persist the checkpoint and stop substantive Production work without fabricating a cover PASS. The actual image call belongs to a separate isolated cover-worker invocation whose effective context is restricted by the Cover Generation Receipt V1 contract to exactly one article brief plus minimum destination metadata.\n\nThe isolated cover worker writes a real raster pre-candidate asset and \`cover-generation-receipt/v1\` under the same item's Production-work directory. Production resumes only by reading those durable same-date receipts. It must verify date, itemId, briefId, current brief SHA-256, exact positive \`sanitizedPrompt\`, attempt count, raster signature, accepted-asset SHA-256, semantic review and editorial-thumbnail review. Stale, prior-date, mismatched, missing, non-raster or failed receipts/assets are invalid.\n\nFor a valid receipt, Production copies the accepted raster bytes into the candidate's canonical \`staging/publication-candidates/...-cover.*\` path while assembling the atomic candidate bundle and records \`coverBriefPath\` and \`coverReceiptPath\` in candidate metadata. Candidate cover bytes must be identical to the receipt-bound accepted asset. The receipt is necessary evidence for \`coverGate\`, but it does not complete Production; Production still runs every Research Value, Independence, Evidence, Structure, Language, Bilingual Consistency, Cover, Inline Visual, Layout, bundle, validator and terminal-proof gate.\n`
const newBlock = `After all same-date briefs and complete bilingual pre-candidate drafts are durably committed and verified, Production writes \`research/runtime/production-work/YYYY/MM/DD/prepared-bundle.json\` as \`production-prepared-bundle/v1\`. The bundle binds every eligible item to its pre-candidate Chinese/English draft, final staging paths, current Cover Brief/expected receipt paths, complete candidate metadata, all non-cover semantic/editorial gate decisions, and a meaningful \`resultBase\`. Production then persists checkpoint node \`awaiting-isolated-covers\`, leaves the formal Production shift open, and stops substantive work. It must not call image generation and must not fabricate a cover PASS or terminal result.\n\nThe separate 16:00 isolated cover worker follows \`research/runtime/worker-prompts/isolated-cover-worker.prompt.md\` and \`research/runtime/COVER-WORKER-INPUT-V1.json\`, processes one article at a time, and writes one real raster pre-candidate asset plus one \`cover-generation-receipt/v1\` per article.\n\nWhen all current same-date receipts are durable, \`.github/workflows/research-production-cover-finalization.yml\` performs deterministic repository finalization. It validates the receipt-to-current-brief binding and raster hashes, copies the already-prepared drafts and accepted raster bytes into canonical staging paths, projects the prepared candidate batch/result, runs bundle/editorial/layout/Production-proof/Runtime validators, and creates the governed completion request. No third ChatGPT wake is permitted for this mechanical finalization. Stale, prior-date, mismatched, missing, non-raster or failed receipts/assets are invalid.\n\nThe receipt is necessary evidence for \`coverGate\`, but it does not create article meaning. Production Preparation remains the semantic owner of Research Value, Independence, Evidence, Structure, Language, Bilingual Consistency, Inline Visual and candidate intent; deterministic finalization may only project those prepared facts after receipt validation.\n`
if (!template.includes(oldBlock) && !template.includes('production-prepared-bundle/v1')) throw new Error('Production template isolation block not found')
if (template.includes(oldBlock)) template = template.replace(oldBlock, newBlock)
write(templatePath, template)

const packagePath = 'package.json'
const pkg = readJson(packagePath)
pkg.scripts['runtime:cover:finalize'] = 'node scripts/runtime-production-cover-finalize.mjs'
writeJson(packagePath, pkg)

console.log('Applied two-wake Production configuration.')
