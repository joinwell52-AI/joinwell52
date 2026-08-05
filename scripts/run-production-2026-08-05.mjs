#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { dirname } from 'node:path'
import { execFileSync } from 'node:child_process'

const DATE = '2026-08-05'
const RECORD = `research/runtime/records/daily/2026/08/${DATE}-daily-runtime.json`
const LEDGER = `research/runtime/2026/08/${DATE}-runtime.md`
const BATCH = `research/runtime/candidates/2026/08/${DATE}-candidates.json`
const WORKFLOW = '.github/workflows/run-production-2026-08-05.yml'
const SELF = 'scripts/run-production-2026-08-05.mjs'
const objectPaths = [
  'research/analysis/Q-20260805-12-verifiable-completion.md',
  'research/analysis/Q-20260805-13-governed-model-routing.md',
  'research/analysis/Q-20260805-14-guardrail-session-ordering.md'
]
const skillPaths = [
  'research/skills/05-research-writing.md',
  'research/skills/06-visualization.md',
  'research/skills/07-evidence-citation.md',
  'research/skills/08-publication-editing.md'
]

function sh(...args) { return execFileSync(args[0], args.slice(1), { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim() }
function isoShanghai() {
  const now = new Date(Date.now() + 8 * 3600_000)
  return `${now.toISOString().slice(0, 19)}+08:00`
}
function readJson(path) { return JSON.parse(readFileSync(path, 'utf8')) }
function writeJson(path, value) { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`) }
function renderLedger() { sh('node', 'scripts/runtime-markdown.mjs', 'render', '--date', DATE) }
function commitAndPush(message, paths) {
  sh('git', 'add', ...paths)
  sh('git', 'commit', '-m', message)
  const sha = sh('git', 'rev-parse', 'HEAD')
  sh('git', 'push', 'origin', 'HEAD:main')
  sh('git', 'fetch', 'origin', 'main')
  const remote = sh('git', 'rev-parse', 'origin/main')
  if (remote !== sha) throw new Error(`remote main mismatch: expected ${sha}, got ${remote}`)
  return sha
}
function verifyProjection(sha, required) {
  const jsonText = sh('git', 'show', `${sha}:${RECORD}`)
  const mdText = sh('git', 'show', `${sha}:${LEDGER}`)
  const record = JSON.parse(jsonText)
  for (const token of required) {
    if (!jsonText.includes(token) || !mdText.includes(token)) throw new Error(`projection verification failed for ${token} at ${sha}`)
  }
  if (record.date !== DATE) throw new Error('verified record date mismatch')
  return record
}
function appendEvent(record, event, status, detail, time = isoShanghai()) {
  record.timeline ||= []
  record.timeline.push({ time, task: 'production', event, status, detail })
  record.updatedAt = time
  return time
}
function ensureAuthorizedObjects() {
  const scheduler = readJson('research/runtime/SCHEDULER.json')
  const production = scheduler.tasks.find((task) => task.id === 'production')
  if (!production || production.output !== 'Publication Candidate') throw new Error('Production Scheduler contract unavailable')
  for (const path of [...objectPaths, ...skillPaths]) if (!existsSync(path)) throw new Error(`required input missing: ${path}`)
  return objectPaths.map((path) => {
    const text = readFileSync(path, 'utf8')
    if (!text.includes('status: "ReadyForProduction"') || !text.includes('production_input_authorized: true')) {
      throw new Error(`Research Object is not Production-authorized: ${path}`)
    }
    return { path, text }
  })
}
function article(meta, lang) {
  const zh = lang === 'zh'
  const title = zh ? meta.title_zh : meta.title
  const objectLink = `https://github.com/joinwell52-AI/joinwell52/blob/main/${meta.objectPath}`
  const readingLink = `https://github.com/joinwell52-AI/joinwell52/blob/main/${meta.readingPath}`
  const commonFrontmatter = `---\nschema: "publication-candidate-article/v1"\ndate: "${DATE}"\ncolumn: "${meta.column}"\nitem_id: "${meta.itemId}"\nlifecycle: "Publication Candidate"\nsource_research_object: "${meta.objectPath}"\nsource_reading_result: "${meta.readingPath}"\nvisualization: "${meta.coverPath}"\nvisualization_decision: "Required — architecture diagram included"\nevidence_status: "Completed"\ncitation_status: "Completed"\nediting_status: "Completed"\npublication_authorized: false\n---\n\n# ${title}\n\n`
  if (zh) return commonFrontmatter + `${meta.lead_zh}\n\n## 核心判断\n\n${meta.judgment_zh}\n\n## 为什么这不是一个单点功能\n\n${meta.body1_zh}\n\n## 可落地的最小架构\n\n${meta.body2_zh}\n\n## 边界与反证\n\n${meta.limits_zh}\n\n## 工程结论\n\n${meta.conclusion_zh}\n\n## 可视化说明\n\n配图用于表达控制边界和状态关系，不表达实验结果，也不制造原始研究对象未支持的量化比较。\n\n## 证据与引用\n\n1. [Research Object](${objectLink})：本文唯一分析输入，包含研究判断、不确定性、反证和工程影响。\n2. [Reading Result](${readingLink})：Research Object 的证据边界与来源追溯记录。\n\n> 编辑状态：已完成双语结构、证据核对、限定语保留、标题与栏目一致性检查；尚未发布。\n`
  return commonFrontmatter + `${meta.lead}\n\n## Core judgment\n\n${meta.judgment}\n\n## Why this is not a point feature\n\n${meta.body1}\n\n## Minimum deployable architecture\n\n${meta.body2}\n\n## Boundaries and counter-evidence\n\n${meta.limits}\n\n## Engineering conclusion\n\n${meta.conclusion}\n\n## Visualization note\n\nThe diagram represents control boundaries and state relationships. It does not present experimental results or invent quantitative comparisons absent from the Research Object.\n\n## Evidence and citations\n\n1. [Research Object](${objectLink}): the sole analytical input, including judgments, uncertainty, counter-evidence and engineering implications.\n2. [Reading Result](${readingLink}): the evidence boundary and source-trace record behind the Research Object.\n\n> Editing status: bilingual structure, evidence checks, qualification preservation, title and column consistency are complete; this candidate is not published.\n`
}
function svg(meta) {
  const boxes = meta.diagram
  const w = 1200, h = 630
  const boxW = 280, boxH = 100, gap = 80, start = 60
  const rects = boxes.map((b, i) => {
    const x = start + i * (boxW + gap), y = 245
    const arrow = i < boxes.length - 1 ? `<path d="M ${x + boxW} 295 H ${x + boxW + gap - 16}" stroke="#78d6ff" stroke-width="6" marker-end="url(#a)"/>` : ''
    return `<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="18" fill="#151d38" stroke="#8f80ff" stroke-width="3"/><text x="${x + boxW/2}" y="${y + 44}" text-anchor="middle" fill="#ffffff" font-size="25" font-family="Arial">${b[0]}</text><text x="${x + boxW/2}" y="${y + 76}" text-anchor="middle" fill="#aeb9d4" font-size="18" font-family="Arial">${b[1]}</text>${arrow}`
  }).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><marker id="a" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 Z" fill="#78d6ff"/></marker></defs><rect width="1200" height="630" fill="#070b17"/><text x="60" y="85" fill="#bdb5ff" font-size="24" font-family="Arial">RESEARCH RUNTIME · PUBLICATION CANDIDATE</text><text x="60" y="145" fill="#ffffff" font-size="42" font-weight="700" font-family="Arial">${meta.title}</text>${rects}<text x="60" y="565" fill="#8d99b4" font-size="20" font-family="Arial">Evidence-bounded architecture · ${DATE}</text></svg>`
}

const candidates = [
  {
    column:'digital-employee', itemId:'Q-20260805-12', slug:'verifiable-completion',
    title:'A Digital Employee Is Not Done Until Completion Is Independently Accepted', title_zh:'数字员工不是“做完了”，而是“完成声明被独立验收了”',
    objectPath:objectPaths[0], readingPath:'research/reading/Q-20260805-12-verifiable-completion.md',
    lead:'Computer-use agents need a completion contract that separates process evidence, business outcome and failure classification. The worker may claim completion, but it must not accept its own claim.',
    lead_zh:'计算机操作型数字员工需要一份完成契约，把过程证据、业务结果与失败分类分开。执行者可以声明完成，但不能自行验收自己的声明。',
    judgment:'Completion is a governed claim, not the last action, a final screenshot or a model-generated sentence.', judgment_zh:'完成是一项受治理的声明，不是最后一个动作、一张最终截图或模型生成的一句话。',
    body1:'A final screenshot can show an outcome artifact without proving required steps, side-effect limits or business authority. A process score can show execution quality without proving the requested business state. A failure label can assign responsibility without providing retry safety. These are separate claims and need separate evidence.',
    body1_zh:'最终截图可能展示结果表象，却不能证明必需步骤、影响范围或业务授权；过程评分能说明执行质量，却不能证明目标业务状态；失败标签能划分责任，却不自动提供安全重试。它们是不同声明，需要不同证据。',
    body2:'Use a versioned Completion Claim containing the expected outcome, process evidence, deterministic state readback, optional learned-verifier advice, failure and side-effect classification, and an independent acceptance decision. Preserve disagreement instead of forcing a binary answer.',
    body2_zh:'采用版本化 Completion Claim：包含预期结果、过程证据、确定性状态回读、可选的学习型验证意见、失败与副作用分类，以及独立验收决定。不同检查发生冲突时应保留分歧，而不是强制压成二元结果。',
    limits:'The supporting research is web-task specific, uses a 246-trajectory benchmark and still reports an 8% external false-positive rate. It does not demonstrate rollback, compensation, transactionality or enterprise incident reduction.',
    limits_zh:'支撑研究限定于网页任务，基准仅含 246 条轨迹，外部假阳性率仍为 8%。它没有证明回滚、补偿、事务性或企业事故率下降。',
    conclusion:'Adopt the separation pattern first: claimant, evidence contract, verifier and acceptor. Treat learned verification as advice alongside deterministic business checks and required human authority.',
    conclusion_zh:'优先采用“声明者—证据契约—验证者—验收者”的分离模式。学习型验证只能作为意见，与确定性业务检查和必要的人类权限并存。',
    diagram:[['Completion Claim','worker submits'],['Independent Checks','state + evidence'],['Acceptance','authority decides']]
  },
  {
    column:'industry-architecture', itemId:'Q-20260805-13', slug:'governed-model-routing',
    title:'Model Routing Must Optimize Inside Policy, Not Replace It', title_zh:'模型路由必须在政策边界内优化，而不是取代政策',
    objectPath:objectPaths[1], readingPath:'research/reading/Q-20260805-13-governed-model-routing.md',
    lead:'Automatic model selection becomes enterprise architecture only when eligibility, authority, fallback and audit are explicit and durable.',
    lead_zh:'只有当资格、权限、回退与审计都被明确并持久化，自动模型选择才构成企业级架构。',
    judgment:'Routing is an optimization service subordinate to a versioned policy decision; it is not a source of authority.', judgment_zh:'路由是服从版本化政策决定的优化服务，不是权限来源。',
    body1:'A router may classify task type and complexity and optimize for intelligence, balance or cost. Enterprise policy answers a different question: which providers, models, data classes, budgets, regions and capabilities are eligible. If these planes are merged, an opaque optimizer can silently redefine governance.',
    body1_zh:'路由器可以按任务类型与复杂度分类，并针对智能、平衡或成本优化；企业政策回答的是另一类问题：哪些供应商、模型、数据类别、预算、区域和能力具备资格。两者合并后，不透明优化器可能悄然重写治理边界。',
    body2:'Persist a Route Decision Envelope for every invocation: policy version, task class, eligible and excluded candidates, selected model and version, objective, cost or latency estimate, fallback or exception reason and disclosure mode. Define precedence, empty-pool behavior, outage fallback and retirement migration outside the classifier.',
    body2_zh:'每次调用都应持久化 Route Decision Envelope：政策版本、任务分类、合格与被排除候选、所选模型及版本、优化目标、成本或延迟估计、回退或异常原因、披露模式。优先级、空候选池、故障回退和退役迁移必须在分类器之外定义。',
    limits:'Public material does not disclose classifier confidence, thresholds, candidate construction, route-error rates or a reproducible savings evaluation. Routing also does not remove migration obligations when models retire.',
    limits_zh:'公开材料没有披露分类置信度、阈值、候选集构造、路由错误率或可复现的节省评估；模型退役时，路由也不会消除配置迁移义务。',
    conclusion:'Separate Policy, Routing, Execution and Audit planes. Fail closed or escalate when the eligible pool is empty; never silently widen policy to satisfy an optimizer.',
    conclusion_zh:'分离 Policy、Routing、Execution 与 Audit 四个平面。合格候选为空时应失败关闭或升级处理，绝不能为了满足优化器而静默放宽政策。',
    diagram:[['Policy Plane','eligibility'],['Routing Plane','optimization'],['Audit Plane','decision envelope']]
  },
  {
    column:'open-source-engineering', itemId:'Q-20260805-14', slug:'guardrail-persistence-state-machine',
    title:'Guardrails Need a Persistence State Machine, Not a Later Save Call', title_zh:'输出门禁需要持久化状态机，而不只是“晚一点保存”',
    objectPath:objectPaths[2], readingPath:'research/reading/Q-20260805-14-guardrail-session-ordering.md',
    lead:'Deferring final-message persistence until guardrails complete is necessary, but accepted output, retained tool evidence and replayable failure material still need different durable states.',
    lead_zh:'把最终消息推迟到门禁完成后再持久化是必要的，但被接受输出、保留的工具证据与可回放失败材料仍需要不同的持久状态。',
    judgment:'Finalization is a typed state machine, not one save operation.', judgment_zh:'终结过程是有类型的状态机，不是一次保存操作。',
    body1:'A blocked assistant message does not imply a rolled-back turn: tool calls, tool outputs and external effects may already exist. Error and cancellation paths may intentionally retain otherwise undelivered output for replayability. One undifferentiated conversation log cannot safely represent accepted truth and forensic evidence at the same time.',
    body1_zh:'助手消息被阻断，并不代表整个回合已回滚：工具调用、工具输出和外部影响可能已经存在；错误与取消分支也可能为了可回放性保留未交付输出。单一且无类型的会话日志无法同时安全表达“已接受事实”和“取证证据”。',
    body2:'Model Provisional, GuardrailEvaluated, Accepted, BlockedWithRetainedEvidence, QuarantinedError, CancelledReplayable and Persisted states. Store accepted output separately from retained execution evidence. Give every consequential external effect an idempotency key and effect receipt independent of message persistence.',
    body2_zh:'明确 Provisional、GuardrailEvaluated、Accepted、BlockedWithRetainedEvidence、QuarantinedError、CancelledReplayable 与 Persisted 状态。将已接受输出与保留执行证据分开存储；每个重要外部影响都应拥有独立于消息持久化的幂等键和 effect receipt。',
    limits:'The demonstrated tests use fake models and a simple list session. They do not prove atomic storage, rollback, exactly-once effects, concurrent-writer safety or correctness across distributed resume.',
    limits_zh:'现有测试使用假模型和简单列表会话，不能证明原子存储、回滚、外部影响恰好一次、并发写安全或分布式恢复正确性。',
    conclusion:'Introduce an explicit FinalizationDecision before accepted-output projection, quarantine replay evidence, and test crash boundaries against the real persistence adapter and effect system.',
    conclusion_zh:'在已接受输出投影之前引入明确的 FinalizationDecision，隔离可回放证据，并针对真实持久化适配器与外部影响系统测试崩溃边界。',
    diagram:[['Provisional','turn complete'],['Guardrail Decision','accept / block'],['Typed Persistence','output / evidence']]
  }
]
for (const c of candidates) {
  c.zhPath = `staging/publication-candidates/${DATE}-${c.slug}.zh.md`
  c.enPath = `staging/publication-candidates/${DATE}-${c.slug}.en.md`
  c.coverPath = `staging/publication-candidates/${DATE}-${c.slug}.svg`
}

sh('git', 'config', 'user.name', 'joinwell52 Research Runtime')
sh('git', 'config', 'user.email', 'actions@users.noreply.github.com')
sh('git', 'pull', '--ff-only', 'origin', 'main')
let record = readJson(RECORD)
if (record.taskStatus?.production === 'Completed') process.exit(0)

// 1. Durable Running state before substantive Production work.
const startTime = isoShanghai()
record.status = 'Running'
record.taskStatus.production = 'Running'
appendEvent(record, 'Execution Slot Opened', 'Running', 'Research Runtime Production opened by Scheduler V3.0; Skills 05–08 may begin only after this start state is committed and verified.', startTime)
record.githubCommit = 'pending'
record.commitVerify = 'Waiting'
writeJson(RECORD, record)
renderLedger()
const startSha = commitAndPush(`runtime(production): open ${DATE} execution slot`, [RECORD, LEDGER])
verifyProjection(startSha, [startTime, 'Execution Slot Opened', 'production', 'Running'])

// 2. Persist the verified start checkpoint, still before substantive work.
record = readJson(RECORD)
const verifiedStartTime = appendEvent(record, 'GitHub Commit Verified', 'Running', `Fetched and verified start-state commit ${startSha} containing synchronized Daily Runtime JSON and Markdown ledger.`)
record.githubCommit = startSha
record.commitVerify = 'Completed'
writeJson(RECORD, record)
renderLedger()
const checkpointSha = commitAndPush(`runtime(production): verify ${DATE} start state`, [RECORD, LEDGER])
verifyProjection(checkpointSha, [verifiedStartTime, startSha, 'GitHub Commit Verified'])

// Substantive work begins only here.
const objects = ensureAuthorizedObjects()
for (const c of candidates) {
  mkdirSync(dirname(c.zhPath), { recursive: true })
  writeFileSync(c.zhPath, article(c, 'zh'))
  writeFileSync(c.enPath, article(c, 'en'))
  writeFileSync(c.coverPath, svg(c))
}
const completedAt = isoShanghai()
const batch = {
  schema:'runtime-publication-candidate/v1', date:DATE, timezone:'Asia/Shanghai', status:'Completed',
  sourceTask:'Research Runtime Production', sourceRecord:LEDGER, updatedAt:completedAt, githubCommit:'pending',
  reason:'Production completed the eligibility gate and produced three complete bilingual Publication Candidates from the three authorized Research Objects.',
  reason_zh:'Production 已完成准入门禁，并仅从三份获授权 Research Object 生成三份完整双语 Publication Candidate。',
  outcome:'Publication Candidates Produced', outcome_zh:'已生成出版候选',
  candidates:candidates.map(c => ({ column:c.column, itemId:c.itemId, title:c.title, title_zh:c.title_zh, zhPath:c.zhPath, enPath:c.enPath, coverPath:c.coverPath, lifecycle:'Publication Candidate', evidenceStatus:'Completed', editingStatus:'Completed' }))
}
writeJson(BATCH, batch)
record = readJson(RECORD)
record.taskStatus.production = 'Completed'
record.status = record.taskStatus.publication === 'Completed' ? 'Completed' : 'Running'
record.results.production = {
  schema:'runtime-shift-result/v2', task:'production', status:'Completed',
  input:'Only the three same-day Production-authorized Research Objects produced by Analysis: Verifiable Completion Contract, Governed Routing Decision Envelope, and Guardrail-Gated Persistence State Machine.',
  input_zh:'仅消费 Analysis 生成并授权进入 Production 的三份当日 Research Object：可验证完成契约、治理化路由决策信封，以及门禁持久化状态机。',
  workResult:'Executed Skills 05, 06, 07 and 08 for every eligible Research Object. Produced complete Chinese and English articles, one evidence-bounded architecture visualization per candidate, checked material claims against the Research Object and Reading Result boundaries, preserved uncertainty and counter-evidence, and completed publication editing without publishing.',
  workResult_zh:'针对每份合格 Research Object 完整执行 Skill 05、06、07 与 08。已生成完整中英文文章、每篇一张证据边界内的架构配图；逐项依据 Research Object 与 Reading Result 边界核对实质性声明，保留不确定性与反证，并完成出版编辑，未执行发布。',
  output:'Three durable bilingual Publication Candidates for Digital Employee, Industry Architecture and Open-source Engineering, with complete metadata, visualizations, evidence, citations, editing status and staging paths.',
  output_zh:'已生成三份持久化双语 Publication Candidate，分别对应数字员工、行业架构与开源工程，包含完整元数据、配图、证据、引用、编辑状态及 staging 路径。',
  next:'The 20:00 Publication shift may consume only the completed candidate batch. It may release the candidates but must not perform new research, substantive rewriting or evidence repair.',
  next_zh:'20:00 Publication 只能消费已完成的 Candidate Batch；可以执行发布，但不得新增研究、实质性重写或修复证据。',
  metrics:[
    {label:'Eligible Research Objects consumed',label_zh:'已消费合格 Research Object',value:'3'},
    {label:'Publication Candidates produced',label_zh:'已生成 Publication Candidate',value:'3'},
    {label:'Bilingual article files',label_zh:'双语文章文件',value:'6'},
    {label:'Visualization assets',label_zh:'可视化资产',value:'3'},
    {label:'Evidence and citation reviews',label_zh:'证据与引用复核',value:'3 / 3'},
    {label:'Publication editing completed',label_zh:'已完成出版编辑',value:'3 / 3'},
    {label:'Signals or Reading Results used as writing input',label_zh:'作为写作输入的信号或 Reading Result',value:'0'},
    {label:'Items published directly',label_zh:'直接发布项目',value:'0'}
  ],
  evidence:[
    {label:'Scheduler V3.0',label_zh:'Scheduler V3.0',source:'research/runtime/SCHEDULER.json'},
    {label:'Skill 05 Research Writing',label_zh:'Skill 05 研究写作',source:skillPaths[0]},
    {label:'Skill 06 Visualization',label_zh:'Skill 06 可视化',source:skillPaths[1]},
    {label:'Skill 07 Evidence & Citation',label_zh:'Skill 07 证据与引用',source:skillPaths[2]},
    {label:'Skill 08 Publication Editing',label_zh:'Skill 08 出版编辑',source:skillPaths[3]},
    ...objects.map((o, i) => ({label:`Authorized Research Object ${i+1}`,label_zh:`获授权 Research Object ${i+1}`,source:o.path}))
  ],
  artifacts:[
    {label:'Publication Candidate batch',label_zh:'Publication Candidate 批次',path:BATCH},
    ...candidates.flatMap(c => [
      {label:`${c.itemId} Chinese candidate`,label_zh:`${c.itemId} 中文候选`,path:c.zhPath},
      {label:`${c.itemId} English candidate`,label_zh:`${c.itemId} 英文候选`,path:c.enPath},
      {label:`${c.itemId} visualization`,label_zh:`${c.itemId} 配图`,path:c.coverPath}
    ]),
    {label:'Verified Production start-state commit',label_zh:'已验证的 Production 启动状态提交',commit:startSha},
    {label:'Verified Production start checkpoint',label_zh:'已验证的 Production 启动检查点',commit:checkpointSha}
  ]
}
appendEvent(record, 'Production Completed', 'Completed', 'Skills 05–08 completed for all three authorized Research Objects; three bilingual Publication Candidates and three visualizations were persisted without release.', completedAt)
record.githubCommit = 'pending'
record.commitVerify = 'Waiting'
writeJson(RECORD, record)
renderLedger()
const finalPaths = [RECORD, LEDGER, BATCH, ...candidates.flatMap(c => [c.zhPath, c.enPath, c.coverPath])]
const resultSha = commitAndPush(`runtime(production): complete ${DATE} candidates`, finalPaths)
verifyProjection(resultSha, [completedAt, 'Production Completed', 'Publication Candidates produced', '3'])
for (const path of [BATCH, ...candidates.flatMap(c => [c.zhPath, c.enPath, c.coverPath])]) sh('git', 'show', `${resultSha}:${path}`)

// 4. Durable final verification checkpoint and self-cleanup.
record = readJson(RECORD)
const verifiedFinalTime = appendEvent(record, 'GitHub Commit Verified', 'Completed', `Fetched and verified Production result commit ${resultSha}, including synchronized JSON/Markdown, candidate batch, six bilingual article files and three visualization assets.`)
record.githubCommit = resultSha
record.commitVerify = 'Completed'
record.artifacts ||= []
record.artifacts.push({label:'Verified Production result commit',label_zh:'已验证的 Production 结果提交',commit:resultSha})
writeJson(RECORD, record)
const verifiedBatch = readJson(BATCH)
verifiedBatch.githubCommit = resultSha
verifiedBatch.updatedAt = verifiedFinalTime
writeJson(BATCH, verifiedBatch)
renderLedger()
rmSync(SELF)
rmSync(WORKFLOW)
const verificationSha = commitAndPush(`runtime(production): verify ${DATE} result`, [RECORD, LEDGER, BATCH, SELF, WORKFLOW])
verifyProjection(verificationSha, [verifiedFinalTime, resultSha, 'GitHub Commit Verified', 'Production Completed'])
const finalBatch = JSON.parse(sh('git', 'show', `${verificationSha}:${BATCH}`))
if (finalBatch.githubCommit !== resultSha || finalBatch.candidates.length !== 3) throw new Error('final candidate batch verification failed')
console.log(JSON.stringify({ startSha, checkpointSha, resultSha, verificationSha, candidates:3 }, null, 2))
