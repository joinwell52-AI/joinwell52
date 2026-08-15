import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (p) => readFileSync(path.join(root, p), 'utf8').replace(/\r\n/g, '\n')
const write = (p, s) => writeFileSync(path.join(root, p), s.endsWith('\n') ? s : `${s}\n`, 'utf8')
const readJson = (p) => JSON.parse(read(p))
const writeJson = (p, value) => write(p, `${JSON.stringify(value, null, 2)}\n`)

function mustReplace(text, pattern, replacement, label) {
  const next = text.replace(pattern, replacement)
  if (next === text) throw new Error(`cover-resilience patch: replacement not found for ${label}`)
  return next
}

// 1. Scheduler: 15:00 owns a complete baseline candidate; 16:00 is optional quality enhancement.
{
  const p = 'research/runtime/SCHEDULER.json'
  const scheduler = readJson(p)
  const production = scheduler.tasks.find((task) => task.id === 'production')
  if (!production) throw new Error('cover-resilience patch: production task missing')
  production.work = 'Write complete bilingual V2 candidates using a selected article type and dynamic modules; classify claim identities and project relevance; create one simple deterministic baseline raster Article Cover per candidate inside the same Production run; optionally persist one same-date Article Cover Brief for later quality upgrade; decide and contextually insert 0..N Inline Figures; pass six editorial gates plus Cover, Inline Visual and Article Layout gates; and record an optional Community Edition decision.'
  production.prohibitions = [
    'Writing from signals or Reading Results',
    'Publishing directly',
    'Universal body outline',
    'Forced TMPA/FCoP/CodeFlowMu section',
    'Publication-to-validation inference',
    'Implementation-to-general-validity inference',
    'Using technical diagrams as covers',
    'Fixed Cover or Figure image-container sections',
    'Manufacturing unnecessary figures',
    'Copied or promotional Community Edition',
    'Blocking Production on the optional 16:00 Cover Upgrade',
    'Reopening or downgrading Completed Production because an optional cover upgrade failed'
  ]
  scheduler.auxiliaryWorkers = [{
    id: 'cover-upgrade-worker',
    name: 'Article Cover Upgrade Worker',
    name_zh: '文章题图升级工作器',
    ownerTask: 'production',
    role: 'post-production-quality-upgrade',
    schedule: { kind: 'daily', time: '16:00', cron: '0 8 * * *' },
    prompt: 'research/runtime/worker-prompts/cover-upgrade-worker.prompt.md',
    inputContract: 'research/runtime/COVER-UPGRADE-INPUT-V1.json',
    upgradeContract: 'research/runtime/COVER-UPGRADE-V1.md',
    inputRoot: 'research/runtime/candidates/YYYY/MM',
    output: 'optional cover-upgrade-receipt/v1 plus replacement raster at the existing candidate coverPath',
    chatgptWake: true,
    formalRuntimeStage: false,
    blocking: false,
    requiresProductionStatus: 'Completed',
    mayChangeProductionState: false
  }]
  writeJson(p, scheduler)
}

// 2. Worker control source: Production 2.11 is self-contained again.
{
  const p = 'research/runtime/worker-prompts/CONFIG.json'
  const config = readJson(p)
  const production = config.tasks.find((task) => task.task === 'production')
  if (!production) throw new Error('cover-resilience patch: production config missing')
  production.version = '2.11.0'
  production.effectiveDate = '2026-08-15'
  production.rules = [
    'Produce complete bilingual V2 Publication Candidates only from completed same-run-date Research Objects.',
    'Apply dynamic article architecture, independent evidence grading, Research Center and Community Edition separation, and every declared gate.',
    'At 15:00, create one simple deterministic baseline PNG for every eligible candidate with scripts/generate-baseline-cover.mjs. Baseline generation is part of Production and does not call cloud image generation.',
    'A baseline cover is intentionally simple: it must be a real raster, visually clean, distinct by article identity/column, readable at thumbnail scale, and not a Runtime dashboard or technical diagram. Cinematic complexity is not required for baseline PASS.',
    'Production may persist article-cover-brief/v1 as optional metadata for the later 16:00 Cover Upgrade, but Production completion never depends on that worker, an upgrade receipt, or an awaiting-isolated-covers checkpoint.',
    'The separate 16:00 Cover Upgrade may replace the exact existing candidate coverPath only after a better article-specific raster passes upgrade review. Upgrade failure leaves the baseline bytes untouched and never reopens, downgrades or Blocks Completed Production.',
    'Same-day Deadline Recovery recovers only genuinely incomplete 15:00 Production work. Missing, failed or not-yet-run Cover Upgrade activity is never an unfinished Production node.',
    'Resume only from the latest same-run-date checkpoint committed on main. If its Prompt identity is stale, re-execute the earliest unproved Production node under current control; historical isolated-cover checkpoints remain audit evidence only.',
    'Verify the current Prompt directly when hashing is available. Otherwise require CONTROL and MANIFEST agreement plus a successful Validate Research Center 3.0 / build run for the exact pinned main HEAD, and record promptVerificationMode=exact-head-ci with the Actions run URL.',
    'For an explicitly authorized same-day recovery of Failed or Blocked Production, persist runtime-process-kick/v2 with requestMode=terminal-recovery, nominalTask=production and allowTerminalReopen=true. Ordinary v1 kicks and timer wakes must never reopen terminal state.',
    'A Completed result with eligible inputs must declare productionMode=candidate-batch and pass npm run runtime:production:proof. Research Runtime Shift Finalization V2.1 persists and remotely verifies the terminal state.',
    'The final task response is plain text only. Never create a Runtime report image, dashboard, poster, status summary or execution evidence.',
    'Build every candidate outside the canonical staging path until its Chinese article, English article, deterministic baseline PNG, optional Inline Figures and completed candidate-batch record are all ready.',
    'Stage and commit the complete candidate bundle exactly once. Before commit run npm run publication:bundle:staged plus every declared validator; never commit one language, an article without its referenced assets, or an incomplete candidate batch.',
    'Do not bypass the repository pre-commit hook, use --no-verify, or write candidate members directly through the GitHub Contents API. Production never publishes.'
  ]
  production.requiredSources = production.requiredSources.filter((source) => source !== 'research/runtime/COVER-GENERATION-RECEIPT-V1.md')
  if (!production.requiredSources.includes('research/runtime/COVER-UPGRADE-V1.md')) {
    production.requiredSources.splice(4, 0, 'research/runtime/COVER-UPGRADE-V1.md')
  }
  writeJson(p, config)
}

// 3. Production template: baseline is deterministic and terminal; upgrade is explicitly non-blocking.
{
  const p = 'research/runtime/worker-prompts/templates/production.prompt.md'
  let text = read(p)
  const section = `## Baseline Article Cover and optional 16:00 upgrade boundary

Production owns a complete baseline Article Cover and must be able to complete without the 16:00 worker. For every eligible candidate, choose the final candidate \`coverPath\` as a same-date \`.png\` path and run:

\`node scripts/generate-baseline-cover.mjs --output <coverPath> --item <itemId> --column <column> --title <English title>\`

This baseline is deliberately simple and deterministic. It is a clean landscape editorial raster keyed to article identity and column, not a claim that a high-end generated illustration was produced. Simplicity, restrained geometry, conservative composition, or lack of cinematic detail are never reasons to fail the baseline cover. The baseline passes \`coverGate\` when it is a real PNG at the declared same-date path, visually distinct from the other baseline covers, usable at thumbnail scale, and not a technical diagram, Runtime dashboard, monitoring screen or report board.

Record baseline cover evidence in the Production result using the existing structured \`coverEvidence[]\` shape. Bind \`itemId\`, a run-date-prefixed \`briefId\`, \`coverPath\`, a short positive article visual descriptor in \`sanitizedPrompt\`, \`generationAttempts=1\`, \`semanticReview=PASS\`, plus \`coverRole=baseline\` and \`generator=deterministic-baseline-v1\`. The deterministic generator is the Production cover mechanism; do not wait for a cloud-image receipt.

Production may also persist a same-date \`article-cover-brief/v1\` under \`research/runtime/production-work/YYYY/MM/DD/<itemId>/cover-brief.json\` for later quality enhancement. That Brief is upgrade metadata only. It may contain the article title/core proposition, one richer visual metaphor, a positive \`sanitizedPrompt\`, review exclusions and the candidate \`coverPath\` as the intended replacement target. A missing Brief does not invalidate an otherwise complete baseline candidate.

After the baseline covers, bilingual articles, candidate batch and all validators pass, advance the Production checkpoint through \`covers-generated-and-reviewed\`, \`candidate-bundle-staged\` and \`validators-passed\`, then follow the normal governed completion path. Never persist \`awaiting-isolated-covers\` as a required node and never leave Production open for the 16:00 worker.

The separate 16:00 Cover Upgrade Worker is a non-blocking post-Production quality pass. It may read a Completed same-date candidate, its optional Cover Brief and the current upgrade contract, then try to generate a better article-specific raster. Only after the replacement passes semantic/editorial review may it overwrite the exact existing candidate \`coverPath\` and persist an audit receipt. If generation, validation or persistence fails, it must leave the baseline file byte-for-byte intact. It must not edit Production status/result, reopen a terminal execution epoch, create a Production completion request, or make Publication ineligible.

Publication consumes the candidate's current \`coverPath\` at release time. Therefore a successful 16:00 replacement is automatically used, while an unsuccessful or absent upgrade leaves the valid 15:00 baseline in place.

`
  text = mustReplace(text, /## Isolated Article Cover boundary[\s\S]*?(?=Inline Figures are optional)/, section, 'Production cover section')
  text = text.replace('the image tool is reserved exclusively for the individual article covers.', 'the 15:00 baseline cover is deterministic; cloud image generation is reserved for the optional 16:00 Cover Upgrade and must never be used to create Runtime execution evidence.')
  write(p, text)
}

// 4. Visualization skill: baseline first, enhancement later.
{
  const p = 'research/skills/06-research-visualization.md'
  let text = read(p)
  text = mustReplace(
    text,
    /The Article Cover is a generated raster editorial asset, not a code-drawn visual\.[\s\S]*?SVG remains valid for an Inline Figure when the article needs a precise explanatory diagram\. It is forbidden as the page-level Article Cover\./,
    `The 15:00 Production baseline Article Cover is a deterministic raster editorial asset produced by \`scripts/generate-baseline-cover.mjs\`. Its job is reliability: every complete candidate has a clean, simple, same-date PNG before Production closes. It does not call cloud image generation and must not be judged by high-end illustration standards.\n\nA separate 16:00 Cover Upgrade may replace that PNG with a higher-quality ChatGPT-generated article-specific raster. The upgrade is optional and non-blocking: failure leaves the baseline untouched and never changes a Completed Production state.\n\nSVG remains valid for an Inline Figure when the article needs a precise explanatory diagram. The baseline Article Cover itself is PNG so the later quality upgrade can replace the same canonical path without changing article or candidate metadata.`,
    'visualization cover ownership'
  )
  text = mustReplace(
    text,
    /## Article-cover workflow[\s\S]*?(?=## Mandatory safe area)/,
    `## Article-cover workflow\n\n1. Extract a short article-level visual descriptor and select the canonical same-date \`.png\` cover path.\n2. During 15:00 Production, run \`scripts/generate-baseline-cover.mjs\` with item ID, column and English title.\n3. Verify the output is a real PNG, visually distinct at thumbnail scale and not a technical diagram or Runtime/report surface. Treat a clean simple result as valid baseline cover quality.\n4. Optionally persist a richer Article Cover Brief for the 16:00 Cover Upgrade.\n5. Complete Production using the baseline; never wait for the upgrade.\n6. At 16:00, the separate Cover Upgrade Worker may use ChatGPT built-in image generation with only the article-specific positive scene description.\n7. Replace the existing canonical cover path only after the upgraded raster passes article relevance and editorial-thumbnail review.\n8. If the upgrade fails for any reason, preserve the baseline bytes and do not alter Production state.\n9. Render the actual article page and approve the currently active cover during Publication QA.\n\n`,
    'visualization cover workflow'
  )
  write(p, text)
}

// 5. Candidate contract: baseline is the completion requirement; upgrade is same-path optional replacement.
{
  const p = 'research/runtime/PUBLICATION-CANDIDATE-SCHEMA.md'
  let text = read(p)
  text = text.replace('  "coverReceiptPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../cover-generation-receipt.json",\n', '  "coverRole": "baseline",\n')
  text = mustReplace(
    text,
    /For Production dates on or after 2026-08-15,[\s\S]*?Production must not create the image itself or infer PASS from file existence alone\./,
    `For Production dates on or after 2026-08-15, every candidate must have a same-date canonical PNG \`coverPath\` before Production can complete. The 15:00 Production worker creates that baseline with \`scripts/generate-baseline-cover.mjs\` and records structured \`coverEvidence[]\` with \`coverRole=baseline\` and \`generator=deterministic-baseline-v1\`. \`coverBriefPath\` is optional upgrade metadata, not a completion dependency.\n\nThe 16:00 Cover Upgrade Worker may later replace the exact same \`coverPath\` with a better article-specific generated raster and may record \`cover-upgrade-receipt/v1\`. The upgrade receipt is audit evidence only; it is never required for Production completion.`,
    'candidate visual contract'
  )
  text = text.replace('- the Article Cover is backed by a same-date valid isolated cover-worker receipt, and the Cover, Inline Visual, and Layout Gates pass;', '- the same-date baseline PNG exists and the Cover, Inline Visual, and Layout Gates pass; an optional later Cover Upgrade is not a completion dependency;')
  text = mustReplace(
    text,
    /A new candidate is one indivisible candidate commit bundle:[\s\S]*?Production must not bypass the hook, use `--no-verify`, split a candidate bundle by language, or write candidate members directly through the GitHub Contents API\./,
    `A new candidate is one indivisible candidate commit bundle: the Chinese article, English article, deterministic baseline PNG, optional Inline Figures, and the completed same-date candidate-batch record. Production builds the bundle outside the canonical staging path, moves all members into place together, stages them together, and runs:\n\n\`\`\`text\nnpm run publication:bundle:staged\n\`\`\`\n\nThe repository pre-commit hook rejects a new candidate when its bilingual counterpart, referenced asset, or completed batch record is absent from the same Git index. Production must not bypass the hook, use \`--no-verify\`, split a candidate bundle by language, or write candidate members directly through the GitHub Contents API. A later 16:00 Cover Upgrade is allowed to replace only the already-declared canonical cover file after Production is Completed; it does not rebuild the candidate bundle or change article text.`,
    'candidate atomic gate'
  )
  text = text.replace('Publication may copy complete Research Center and authorized Community Edition artifacts to their target surfaces, update metadata and indexes, commit, verify, and release.', 'Publication reads each candidate\'s current canonical coverPath at execution time, so a successful 16:00 same-path upgrade is used automatically and a failed upgrade leaves the baseline in force. Publication may copy complete Research Center and authorized Community Edition artifacts to their target surfaces, update metadata and indexes, commit, verify, and release.')
  write(p, text)
}

// 6. Proof/terminal tests: restore the last direct-cover proof boundary, which requires real raster + coverEvidence but no receipt.
for (const target of ['scripts/runtime-production-proof.mjs', 'scripts/runtime-shift-terminal-test.mjs']) {
  const historical = execFileSync('git', ['show', `e18f97b1bc6e78cac53117de034161bcb2032434:${target}`], { cwd: root })
  writeFileSync(path.join(root, target), historical)
}

// 7. Remove the obsolete deterministic receipt finalizer from the hard Production path.
{
  const p = 'package.json'
  const pkg = readJson(p)
  delete pkg.scripts['runtime:cover:finalize']
  writeJson(p, pkg)
}
for (const obsolete of ['.github/workflows/research-production-cover-finalization.yml', 'scripts/runtime-production-cover-finalize.mjs']) {
  const file = path.join(root, obsolete)
  if (existsSync(file)) rmSync(file)
}

// 8. Deterministic baseline PNG generator. No image model, no API key, no secret.
write('scripts/generate-baseline-cover.mjs', String.raw`#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { deflateSync } from 'node:zlib'

function argsOf(argv) {
  const out = {}
  for (let i = 2; i < argv.length; i += 1) {
    if (!argv[i].startsWith('--')) continue
    out[argv[i].slice(2)] = argv[i + 1] || ''
    i += 1
  }
  return out
}

const args = argsOf(process.argv)
if (!args.output || !args.item || !args.column || !args.title) {
  throw new Error('usage: node scripts/generate-baseline-cover.mjs --output <png> --item <id> --column <column> --title <title>')
}
if (path.extname(args.output).toLowerCase() !== '.png') throw new Error('baseline cover output must be .png')

const width = 1600
const height = 900
const rgba = Buffer.alloc(width * height * 4)
const seed = createHash('sha256').update([args.item, args.column, args.title].join('|')).digest()
const palettes = {
  'digital-employee': [[28, 25, 56], [94, 72, 210], [79, 211, 221], [238, 239, 255]],
  'industry-architecture': [[18, 38, 45], [36, 118, 109], [90, 205, 179], [231, 249, 244]],
  'open-source-engineering': [[20, 31, 50], [48, 102, 178], [229, 145, 62], [239, 245, 255]]
}
const palette = palettes[args.column] || [[24, 29, 43], [75, 93, 154], [74, 184, 194], [240, 244, 252]]

function mix(a, b, t) { return Math.round(a + (b - a) * t) }
function setPixel(x, y, color, alpha = 1) {
  if (x < 0 || y < 0 || x >= width || y >= height) return
  const i = (y * width + x) * 4
  const inv = 1 - alpha
  rgba[i] = Math.round(rgba[i] * inv + color[0] * alpha)
  rgba[i + 1] = Math.round(rgba[i + 1] * inv + color[1] * alpha)
  rgba[i + 2] = Math.round(rgba[i + 2] * inv + color[2] * alpha)
  rgba[i + 3] = 255
}
function rect(x0, y0, x1, y1, color, alpha = 1) {
  x0 = Math.max(0, Math.floor(x0)); y0 = Math.max(0, Math.floor(y0)); x1 = Math.min(width, Math.ceil(x1)); y1 = Math.min(height, Math.ceil(y1))
  for (let y = y0; y < y1; y += 1) for (let x = x0; x < x1; x += 1) setPixel(x, y, color, alpha)
}
function circle(cx, cy, r, color, alpha = 1) {
  const rr = r * r
  for (let y = Math.max(0, Math.floor(cy - r)); y < Math.min(height, Math.ceil(cy + r)); y += 1) {
    const dy = y - cy
    const dx = Math.sqrt(Math.max(0, rr - dy * dy))
    const start = Math.max(0, Math.floor(cx - dx)); const end = Math.min(width, Math.ceil(cx + dx))
    for (let x = start; x < end; x += 1) setPixel(x, y, color, alpha)
  }
}
function line(x0, y0, x1, y1, thickness, color, alpha = 1) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))
  for (let s = 0; s <= steps; s += 1) {
    const t = steps === 0 ? 0 : s / steps
    circle(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, thickness / 2, color, alpha)
  }
}

for (let y = 0; y < height; y += 1) {
  const t = y / (height - 1)
  const vignette = 0.08 + 0.18 * Math.abs(t - 0.5)
  for (let x = 0; x < width; x += 1) {
    const h = x / (width - 1)
    const glow = Math.max(0, 1 - Math.hypot(h - 0.68, t - 0.42) * 1.4)
    const c = [0, 1, 2].map((k) => Math.max(0, Math.min(255, mix(palette[0][k], palette[1][k], 0.22 * h + 0.16 * t + 0.12 * glow) - 255 * vignette)))
    const i = (y * width + x) * 4
    rgba[i] = c[0]; rgba[i + 1] = c[1]; rgba[i + 2] = c[2]; rgba[i + 3] = 255
  }
}

const a = seed[0] / 255, b = seed[1] / 255, c = seed[2] / 255
const horizon = 590 + Math.round((a - 0.5) * 70)
rect(0, horizon, width, height, palette[0], 0.28)
line(100, horizon - 10, 1500, horizon - 80 - Math.round(b * 90), 10, palette[2], 0.34)
line(180, 760, 1320, 240 + Math.round(c * 120), 4, palette[3], 0.16)

const motif = seed[3] % 3
if (motif === 0) {
  rect(230, 180, 420, 690, palette[1], 0.58)
  rect(520, 130, 790, 720, palette[2], 0.22)
  rect(900, 220, 1190, 650, palette[1], 0.42)
  circle(1260, 430, 105, palette[2], 0.74)
} else if (motif === 1) {
  circle(380, 420, 190, palette[1], 0.42)
  circle(780, 360, 125, palette[2], 0.72)
  circle(1180, 470, 220, palette[1], 0.38)
  line(440, 470, 1120, 470, 18, palette[3], 0.20)
} else {
  rect(220, 260, 560, 620, palette[1], 0.42)
  rect(620, 210, 960, 670, palette[2], 0.28)
  rect(1020, 300, 1370, 600, palette[1], 0.52)
  line(330, 660, 1260, 180, 12, palette[2], 0.48)
}

// Article-specific accent marks generated from the content hash.
for (let i = 0; i < 6; i += 1) {
  const x = 150 + (seed[4 + i] / 255) * 1300
  const y = 130 + (seed[10 + i] / 255) * 620
  circle(x, y, 10 + (seed[16 + i] % 24), palette[3], 0.16 + (seed[22 + i] / 255) * 0.22)
}

const crcTable = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n += 1) {
    let c = n
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
    table[n] = c >>> 0
  }
  return table
})()
function crc32(buf) {
  let c = 0xffffffff
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crc])
}

const raw = Buffer.alloc((width * 4 + 1) * height)
for (let y = 0; y < height; y += 1) {
  const offset = y * (width * 4 + 1)
  raw[offset] = 0
  rgba.copy(raw, offset + 1, y * width * 4, (y + 1) * width * 4)
}
const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0
const meta = Buffer.from('joinwell52-baseline\0' + args.item + ' | ' + args.column + ' | ' + args.title, 'utf8')
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('tEXt', meta),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
])
mkdirSync(path.dirname(args.output), { recursive: true })
writeFileSync(args.output, png)
console.log(JSON.stringify({ output: args.output, item: args.item, column: args.column, width, height, bytes: png.length }))
`)

// 9. New non-blocking 16:00 upgrade contract and prompt.
write('research/runtime/COVER-UPGRADE-INPUT-V1.json', JSON.stringify({
  schema: 'cover-upgrade-worker-input/v1',
  version: '1.0.0',
  repository: 'joinwell52-AI/joinwell52',
  timezone: 'Asia/Shanghai',
  requiredProductionStatus: 'Completed',
  candidateContract: 'runtime-publication-candidate/v2',
  briefSchema: 'article-cover-brief/v1',
  receiptSchema: 'cover-upgrade-receipt/v1',
  blocking: false,
  mayChangeProductionState: false,
  targetRule: 'Replace only the exact existing candidate coverPath after the upgraded raster passes review; otherwise preserve the baseline bytes.',
  imageInstruction: 'For one article at a time, send only its positive article-specific visual scene to ChatGPT built-in image generation.',
  acceptance: 'Accept a replacement only when it is clearly article-specific, attractive at thumbnail scale, a real raster, and materially better than the baseline. Simple baseline quality is already valid and is never a reason to force replacement.'
}, null, 2))

write('research/runtime/COVER-UPGRADE-V1.md', `# Cover Upgrade Contract V1\n\n## Status\n\nThis is a non-blocking post-Production quality contract. It is not a Production gate.\n\n## Preconditions\n\n- same-date Production is already durably \`Completed\`;\n- the same-date \`runtime-publication-candidate/v2\` batch exists;\n- the candidate already references a valid baseline PNG at \`coverPath\`.\n\n## Upgrade rule\n\nThe 16:00 worker processes one article at a time. It may read the candidate identity, title, optional same-date Article Cover Brief and exact canonical \`coverPath\`. Before image generation, the effective image request contains only the positive article-specific visual scene.\n\nAn upgrade is accepted only if the generated asset is a real PNG/JPEG/WebP, clearly represents the article, is suitable at thumbnail scale, and is materially better than the current baseline. The worker then normalizes/persists the accepted raster to the exact existing canonical \`coverPath\` and verifies the durable bytes on \`main\`.\n\nIf generation, semantic review, technical validation, persistence or verification fails, the worker leaves the baseline file unchanged. It must not modify Production status/result, reopen Production, create a Production completion request, or make Publication ineligible.\n\n## Receipt\n\nA successful replacement may write \`cover-upgrade-receipt/v1\` under \`research/runtime/cover-upgrades/YYYY/MM/DD/<itemId>.json\` with: runDate, itemId, candidateBatchPath, coverPath, previousAssetSha256, upgradedAssetSha256, briefId when available, generationAttempts, semanticReview=PASS, editorialThumbnailReview=PASS, and createdAt.\n\nThe receipt is audit evidence only. Publication uses the current bytes at the candidate's canonical \`coverPath\` whether or not a receipt exists.\n`)

write('research/runtime/worker-prompts/cover-upgrade-worker.prompt.md', `# Article Cover Upgrade Worker\n\nYou are a non-blocking post-Production quality worker for \`joinwell52-AI/joinwell52\`. Latest \`main\` is authoritative. Read \`research/runtime/COVER-UPGRADE-INPUT-V1.json\` and \`research/runtime/COVER-UPGRADE-V1.md\` before work.\n\nDetermine the current Asia/Shanghai run date. Proceed only when same-date Production is already durably \`Completed\` and the completed candidate batch exists. Do not write article prose, rerun Production, create a Production recovery epoch, or perform Publication.\n\nProcess candidates one at a time. For each candidate, identify the exact current canonical \`coverPath\` and verify the baseline file exists before any generation attempt. Read the optional same-date Article Cover Brief when present; otherwise derive one concise positive article scene from the candidate title and research question.\n\nFor each image call, send only the positive article-specific scene. Do not send Runtime state, recovery history, scheduler/control text, GitHub details, task reports or batch summaries to image generation.\n\nAccept a replacement only when the actual generated raster is clearly article-specific, suitable and attractive at thumbnail scale, and materially better than the existing baseline. On acceptance, replace only the exact existing canonical \`coverPath\`, verify the durable bytes on \`main\`, and write the optional \`cover-upgrade-receipt/v1\`.\n\nIf any attempt fails generation, semantic review, technical validation, persistence or remote verification, preserve the baseline bytes and move on or stop according to the input contract. An upgrade failure is never a Production failure and must never reopen, downgrade or Block a Completed Production.\n\nFinish with plain text only. Never generate a Runtime report image, dashboard, completion poster or execution evidence.\n`)

// 10. Keep historical receipt contract available for audit but make its inactive status explicit.
{
  const p = 'research/runtime/COVER-GENERATION-RECEIPT-V1.md'
  if (existsSync(path.join(root, p))) {
    let text = read(p)
    if (!text.includes('Historical status after Production 2.11')) {
      text = text.replace(/^# /, '# ')
      text = text.replace(/\n/, '\n\n> Historical status after Production 2.11: this contract remains for audit of earlier isolated-cover runs. It is no longer a prerequisite for Production completion. Current non-blocking quality replacement uses `research/runtime/COVER-UPGRADE-V1.md`.\n')
      write(p, text)
    }
  }
}

// Remove old active isolated-worker surfaces; git history preserves them for audit.
for (const obsolete of ['research/runtime/COVER-WORKER-INPUT-V1.json', 'research/runtime/worker-prompts/isolated-cover-worker.prompt.md']) {
  const file = path.join(root, obsolete)
  if (existsSync(file)) rmSync(file)
}

console.log('cover-resilience patch applied')
