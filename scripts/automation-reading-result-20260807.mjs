import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

const date = '2026-08-07'
const recordPath = `research/runtime/records/daily/2026/08/2026-08-07-daily-runtime.json`
const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'))
if (record.date !== date) throw new Error('wrong runtime date')
if (record.status !== 'Running' || record.taskStatus?.reading !== 'Running') throw new Error('Reading control-plane state is not Running')
const starts = (record.timeline || []).filter((e) => e.task === 'reading' && e.event === 'Execution Slot Opened' && e.status === 'Running' && String(e.time || '').startsWith(date))
if (starts.length !== 1) throw new Error(`expected exactly one Reading start event, found ${starts.length}`)
if (record.results?.reading) throw new Error('refusing to overwrite existing Reading result')
if (record.taskStatus?.queue !== 'Completed' || !record.results?.queue || record.results.queue.status !== 'Completed') throw new Error('Queue is incomplete')

const readingArtifacts = [
  'research/reading/Q-20260807-01-argus-verification-gated-runtime.md',
  'research/reading/Q-20260807-02-agentic-workflow-server-architecture.md',
  'research/reading/Q-20260807-03-deferred-environment-provisioning.md'
]
for (const artifact of readingArtifacts) if (!fs.existsSync(artifact)) throw new Error(`missing Reading artifact ${artifact}`)

const parts = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
}).formatToParts(new Date()).reduce((out, part) => (out[part.type] = part.value, out), {})
const now = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+08:00`

record.results.reading = {
  schema: 'runtime-shift-result/v2',
  task: 'reading',
  status: 'Completed',
  input: 'The durably verified Scheduler-fallback Reading start state in commit 896f0632856652869715b30b9dd7bea0d7983a69, Research Runtime Scheduler V3.0, Skill 03 Deep Reading, and the completed 2026-08-07 Research Plan containing exactly three same-day Selected objects: Q-20260807-01, Q-20260807-02 and Q-20260807-03.',
  input_zh: '提交 896f0632856652869715b30b9dd7bea0d7983a69 中已持久化核验的 Reading Scheduler 回退启动状态、Research Runtime Scheduler V3.0、Skill 03 深度阅读，以及包含且仅包含三个当日 Selected 对象 Q-20260807-01、Q-20260807-02 与 Q-20260807-03 的已完成 2026-08-07 Research Plan。',
  workResult: 'Executed Skill 03 only for all three same-day Selected objects after the durable Running state was fetched and verified. Read the full primary Argus technical report; the primary arXiv HTML and PDF for the Microsoft Azure agentic-workflow architecture study, including visual inspection of its architecture and results tables; and the merged openai/codex maintainer commit, implementation and regression tests. Extracted facts, research results, mechanisms, evidence, limitations, comparisons, contradictions, unresolved questions and source traceability. No Research Analysis, recommendation, article drafting, Production or Publication work was performed.',
  workResult_zh: '仅在持久化 Running 状态完成拉取与核验后，对三个当日 Selected 对象执行 Skill 03。已阅读 Argus 完整主要技术报告；Microsoft Azure Agentic Workflow 架构研究的主要 arXiv HTML 与 PDF，并对架构及结果表进行可视核查；以及 openai/codex 已合并维护者提交、实现代码与回归测试。已提取事实、研究结果、机制、证据、限制、比较、矛盾、未决问题与来源追溯；未开展 Research Analysis、建议、文章撰写、Production 或 Publication。',
  output: 'Three durable Reading Records: verification-guided persistent campaigns with role-owned state admission in Argus; production and controlled evidence for role-aware CPU-GPU agentic server architecture; and the report-and-materialize lifecycle for deferred environment provisioning in openai/codex.',
  output_zh: '已形成三份持久化 Reading Record：Argus 中采用角色所有权状态准入的验证引导持久 Campaign；角色感知 CPU-GPU Agentic Server 架构的生产与受控实验依据；以及 openai/codex 中延迟环境 Provisioning 的报告—实体化生命周期。',
  next: 'Research Runtime Analysis at 13:00 may consume only these three Reading Records and must preserve their evidence classes, negative operating points, contradictions, source boundaries and unresolved questions. Reading itself must not be expanded into analysis or publication text.',
  next_zh: '13:00 Research Runtime Analysis 只能消费这三份 Reading Record，并必须保留其中的证据类别、负向运行点、矛盾、来源边界与未决问题；Reading 本身不得扩展为分析或出版文本。',
  metrics: [
    { label: 'Selected objects consumed', label_zh: '已消费 Selected 对象', value: '3' },
    { label: 'Durable Reading Results', label_zh: '持久化 Reading Result', value: '3' },
    { label: 'Columns completed', label_zh: '已完成栏目', value: '3 / 3' },
    { label: 'Primary research objects', label_zh: '主要研究对象', value: '2' },
    { label: 'Merged maintainer changes', label_zh: '已合并维护者变更', value: '1' },
    { label: 'Explicit source-access limitations', label_zh: '明确记录的来源访问限制', value: '0' },
    { label: 'Research Analysis objects', label_zh: 'Research Analysis 对象', value: '0' },
    { label: 'Article drafts', label_zh: '文章草稿', value: '0' }
  ],
  evidence: [
    { label: 'Scheduler V3.0', label_zh: 'Scheduler V3.0', source: 'research/runtime/SCHEDULER.json' },
    { label: 'Verified Reading fallback start commit', label_zh: '已核验的 Reading 回退启动提交', commit: '896f0632856652869715b30b9dd7bea0d7983a69', source: 'https://github.com/joinwell52-AI/joinwell52/commit/896f0632856652869715b30b9dd7bea0d7983a69' },
    { label: "Today's Research Plan", label_zh: '今日研究计划', source: 'research/runtime/plans/2026/08/2026-08-07-plan.json' },
    { label: 'Skill 03 Deep Reading', label_zh: 'Skill 03 深度阅读', source: 'research/skills/03-deep-reading.md' },
    { label: 'Argus primary technical report', label_zh: 'Argus 主要技术报告', source: 'https://arxiv.org/abs/2608.05144' },
    { label: 'Agentic AI architecture primary paper', label_zh: 'Agentic AI 架构主要论文', source: 'https://arxiv.org/abs/2608.04458' },
    { label: 'openai/codex deferred provisioning commit', label_zh: 'openai/codex 延迟 Provisioning 提交', commit: 'f8ac8fa6c6ac99dd81f02bf1fd947e76c287b219', source: 'https://github.com/openai/codex/commit/f8ac8fa6c6ac99dd81f02bf1fd947e76c287b219' },
    { label: 'openai/codex merged provisioning PR', label_zh: 'openai/codex 已合并 Provisioning PR', source: 'https://github.com/openai/codex/pull/37340' }
  ],
  artifacts: [
    { label: 'Digital Employee Reading Record', label_zh: '数字员工 Reading Record', path: readingArtifacts[0] },
    { label: 'Industry Architecture Reading Record', label_zh: '行业架构 Reading Record', path: readingArtifacts[1] },
    { label: 'Open-source Engineering Reading Record', label_zh: '开源工程 Reading Record', path: readingArtifacts[2] },
    { label: 'Daily Runtime Record', label_zh: '每日运行机器记录', path: recordPath },
    { label: 'Human-readable Runtime ledger', label_zh: '人类可读运行账本', path: 'research/runtime/2026/08/2026-08-07-runtime.md' }
  ]
}
record.taskStatus.reading = 'Completed'
record.status = 'Waiting'
record.timeline.push({
  time: now,
  task: 'reading',
  event: 'Reading Completed',
  status: 'Completed',
  detail: 'Skill 03 completed all three same-day Selected objects after verified Scheduler-fallback start commit 896f0632856652869715b30b9dd7bea0d7983a69; three Reading Records were persisted with source traceability and no Research Analysis or article drafting.'
})
record.githubCommit = 'pending'
record.commitVerify = 'Waiting'
record.updatedAt = now
fs.writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`)
execFileSync('node', ['scripts/runtime-markdown.mjs', 'render', '--date', date], { stdio: 'inherit' })
execFileSync('node', ['scripts/runtime-markdown.mjs', 'validate', '--date', date], { stdio: 'inherit' })

const verify = JSON.parse(fs.readFileSync(recordPath, 'utf8'))
const finalStarts = verify.timeline.filter((e) => e.task === 'reading' && e.event === 'Execution Slot Opened' && e.status === 'Running' && String(e.time || '').startsWith(date))
const completions = verify.timeline.filter((e) => e.task === 'reading' && e.event === 'Reading Completed' && e.status === 'Completed' && String(e.time || '').startsWith(date))
if (finalStarts.length !== 1 || completions.length !== 1) throw new Error('Reading timeline cardinality failed')
if (verify.taskStatus.reading !== 'Completed' || verify.results.reading?.status !== 'Completed') throw new Error('Reading completion state failed')
if (verify.results.discovery?.status !== 'Completed' || verify.results.queue?.status !== 'Completed') throw new Error('prior results were not preserved')
