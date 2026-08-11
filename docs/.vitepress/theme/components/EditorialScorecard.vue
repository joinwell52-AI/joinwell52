<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as allNotes } from './research-notes.data'
import type { ResearchColumn, ResearchNoteRecord } from './research-notes.data'

const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })
const zh = computed(() => props.lang === 'zh')

interface Rating {
  path: string
  score: number
  zh: string
  en: string
}

const ratings: Rating[] = [
  { path: '/research/weekly/weekly-001', score: 72, zh: '方向判断清楚，但篇幅短、没有直接引用，更接近研究宣言。', en: 'Clear direction, but brief and uncited; it reads more like a research manifesto.' },
  { path: '/research/weekly/weekly-002', score: 78, zh: '两层架构很实用，但依据主要来自前期专题，外部证据呈现不足。', en: 'The two-layer architecture is useful, but the external evidence remains underexposed.' },
  { path: '/digital-employee/2026-08-02-position-ownership-authority', score: 86, zh: '三家企业产品交叉印证充分；“岗位先于 Agent”有价值，但仍偏厂商资料综合。', en: 'Strong cross-vendor synthesis; the position-before-agent thesis is valuable but vendor-led.' },
  { path: '/digital-employee/2026-08-02-control-plane-work-runtime', score: 88, zh: '分层、接口和 SME 落地路线完整；与相邻文章有少量重复。', en: 'Complete layering, interfaces, and SME path, with some repetition across adjacent notes.' },
  { path: '/digital-employee/2026-08-02-computer-use-action-state-loop', score: 90, zh: '动作、授权、执行、状态与验收拆分准确；来源覆盖面稍窄。', en: 'Excellent separation of action, authority, execution, state, and acceptance; source coverage is narrow.' },
  { path: '/digital-employee/2026-08-02-osworld-execution-verification', score: 93, zh: '准确抓住 OSWorld 的 Evaluator 价值，版本与外推边界处理优秀。', en: 'Correctly centers OSWorld on evaluation; versioning and extrapolation limits are excellent.' },
  { path: '/research/weekly/weekly-003', score: 95, zh: '将 GUI、协议和编排统一到所有权模型，原创综合度很高；篇幅稍长。', en: 'A highly original synthesis of GUI, protocol, and orchestration through ownership; slightly long.' },
  { path: '/digital-employee/2026-08-05-verifiable-completion', score: 84, zh: '紧凑且边界明确，但关键数据和论证留在上游研究对象。', en: 'Compact and bounded, but key data and reasoning remain in upstream research objects.' },
  { path: '/digital-employee/2026-08-05-universal-verifier-completion-contract', score: 96, zh: '数据、版本差异、反证和可迁移边界都交代清楚，全站最强之一。', en: 'Data, version differences, counterevidence, and transfer limits are all handled exceptionally well.' },
  { path: '/digital-employee/2026-08-06-governed-revisable-work-graph', score: 88, zh: '“依赖就绪不等于授权就绪”很有洞察；事实来源主要封装在上游对象。', en: '“Dependency-ready is not authority-ready” is insightful; primary facts sit upstream.' },
  { path: '/digital-employee/2026-08-07-verification-gated-state-admission', score: 91, zh: '历史耐久与权威耐久的区分重要，反例和投影过期问题处理得好。', en: 'The history-versus-authority durability split is important and supported by strong counterexamples.' },
  { path: '/digital-employee/2026-08-08-pause-preserving-budget-admission', score: 89, zh: '把预算提升为运行时准入状态，实用性强；证据基础相对单一。', en: 'Turns budget into runtime admission state with strong practical value; evidence is relatively narrow.' },
  { path: '/digital-employee/2026-08-09-revocation-coupled-run-reconciliation', score: 92, zh: '清楚区分数据库撤销、Worker 停止、租约与副作用补偿。', en: 'Clearly separates database revocation, worker stopping, leases, and side-effect compensation.' },
  { path: '/research/weekly/weekly-004', score: 96, zh: '15 篇文章收敛为权限生命周期，体系完整；仍可进一步压缩。', en: 'Fifteen notes converge into a coherent authority lifecycle; comprehensive but compressible.' },
  { path: '/digital-employee/2026-08-10-governed-input-admission-boundary', score: 94, zh: '直接落到 Issue、PR 与 Commit，输入身份和外部副作用边界准确。', en: 'Grounded in issue, PR, and commit evidence with precise input-identity and side-effect boundaries.' },

  { path: '/industry/servicenow', score: 70, zh: '框架清楚、易读，但没有公开引用，主要属于产品解读。', en: 'Clear and readable, but uncited and primarily a product interpretation.' },
  { path: '/industry/workday', score: 74, zh: 'Registry 投影实用、控制面定位准确；缺少直接来源和反证。', en: 'Useful registry projection and accurate control-plane framing, but light on sources and counterevidence.' },
  { path: '/industry/2026-08-02-enterprise-agent-governance-control-plane', score: 87, zh: '三平台能力矩阵有价值，也主动排除营销主张；独立验证不足。', en: 'Valuable three-platform matrix that excludes marketing claims; independent validation is limited.' },
  { path: '/industry/2026-08-02-from-systems-of-record-to-systems-of-execution', score: 88, zh: '记录系统与受治理执行系统的判断有战略价值，比较完整。', en: 'The record-system plus governed-execution thesis is strategically useful and well compared.' },
  { path: '/industry/2026-08-02-a2a-mcp-interoperability-boundaries', score: 92, zh: '以工作和控制权划分 A2A/MCP，而非停留在功能列表，判断成熟。', en: 'Distinguishes A2A and MCP by work and control ownership rather than feature lists.' },
  { path: '/industry/2026-08-02-nist-ai-rmf-operating-loop', score: 94, zh: '对 Govern、Map、Measure、Manage 的工程翻译优秀，限制充分。', en: 'Excellent engineering translation of Govern, Map, Measure, and Manage, with strong limitations.' },
  { path: '/industry/2026-08-05-governed-model-routing', score: 83, zh: '判断正确且简洁，但数据和具体案例较少，更像架构备忘录。', en: 'Correct and concise, but light on data and cases; closer to an architecture memo.' },
  { path: '/industry/2026-08-06-enterprise-agent-decision-envelope', score: 89, zh: '“配置权威不等于执行一致性”切中要害；独立可读性略受上游依赖影响。', en: 'Configuration authority versus enforcement consistency is incisive; upstream dependence reduces standalone readability.' },
  { path: '/industry/2026-08-07-role-aware-agent-resource-plane', score: 91, zh: '使用负向运行点避免过度推广，资源优化与信任治理分层稳健。', en: 'Uses negative operating points to avoid overclaiming and cleanly separates optimization from trust.' },
  { path: '/industry/2026-08-08-lifecycle-revalidated-policy-plane', score: 90, zh: '历史状态可保留、历史权限不可永久继承，结论清晰。', en: 'Clearly argues that historical state may persist while historical authority must not.' },
  { path: '/industry/2026-08-09-rotating-assertion-short-lived-credential', score: 91, zh: '身份、交换、短期凭据和传播四层准确，并否定“短期即安全”。', en: 'Precisely separates identity, exchange, credential lease, and propagation without equating short-lived with safe.' },
  { path: '/industry/2026-08-10-authority-plane-cascade-containment', score: 94, zh: 'Retry 与语义修复分离准确，对实验信息优势和外推限制说明充分。', en: 'Accurately separates retry from semantic repair and explains experimental information advantages.' },

  { path: '/research/daily/2026-08-01', score: 62, zh: '更像门户建设决议和信息架构说明，不是完整研究论证。', en: 'More portal decision record and information architecture than a complete research argument.' },
  { path: '/engineering/openhands', score: 72, zh: '产品差异化判断不错，但无直接引用和版本信息，证据薄弱。', en: 'Useful differentiation, but weak evidence due to missing citations and version context.' },
  { path: '/engineering/2026-08-02-durable-agent-runtime', score: 88, zh: '四框架 Runtime 能力矩阵实用；横向比较来自文档而非实测。', en: 'A useful four-framework runtime matrix, though the comparison is documentary rather than empirical.' },
  { path: '/engineering/2026-08-02-agent-capability-packaging', score: 87, zh: 'Skill Contract 可操作，但并列比较多种抽象时略有概念跨度。', en: 'The skill contract is actionable, though comparing several abstractions creates conceptual stretch.' },
  { path: '/engineering/2026-08-02-manager-handoff-ownership-models', score: 93, zh: '会话、权限、Guardrail 和完成权拆解精确，是优秀的 SDK 到架构推导。', en: 'A precise SDK-to-architecture derivation across conversation, authority, guardrails, and completion.' },
  { path: '/engineering/2026-08-02-swe-bench-verified-quality', score: 95, zh: '把 Benchmark、环境、测试和评审作为同一工程系统，全面且克制。', en: 'Treats benchmark, environment, tests, and review as one engineering system with rigor and restraint.' },
  { path: '/engineering/2026-08-05-guardrail-persistence-state-machine', score: 85, zh: '状态划分实用；正文略像浓缩设计说明。', en: 'Useful state taxonomy, though the article reads like a compressed design note.' },
  { path: '/engineering/2026-08-06-semantic-migration-recovery', score: 90, zh: '语义重放、单文件原子性和跨存储可恢复性的边界严谨。', en: 'Rigorous boundaries among semantic replay, single-file atomicity, and cross-store recoverability.' },
  { path: '/engineering/2026-08-06-codeflowmu-multi-agent-fact-checking', score: 95, zh: '真实案例、证据包、SHA、测试和权限边界完整；正文重复稍多。', en: 'A complete field case with evidence pack, SHA, tests, and authority boundaries; somewhat repetitive.' },
  { path: '/engineering/2026-08-07-stable-identity-provisioning-gate', score: 92, zh: 'Stable Identity、Lifecycle 与分布式耐久边界处理专业。', en: 'Professional treatment of stable identity, lifecycle, and distributed durability boundaries.' },
  { path: '/engineering/2026-08-08-correlated-multistream-host-contract', score: 91, zh: '跨流乱序、Finality、Ack 与 Watermark 说明准确，但门槛较高。', en: 'Accurate on cross-stream ordering, finality, acknowledgements, and watermarks, with a high reading threshold.' },
  { path: '/engineering/2026-08-09-executed-conformance-migration-safety', score: 93, zh: '“输出正确但机制退化”洞察突出，历史 Reader 与 CI Skip 分析扎实。', en: 'Strong insight that correct output can hide degraded mechanisms; solid reader and CI-skip analysis.' },
  { path: '/engineering/2026-08-10-serialized-tool-lifecycle-authority', score: 94, zh: '追到 Issue、PR、Commit，并清楚区分串行化、取消安全、超时与 Fencing。', en: 'Traces issue, PR, and commit while separating serialization, cancellation safety, timeout, and fencing.' }
]

const normalizePath = (url: string) => url.replace(/^\/(?:zh|en)/, '').replace(/\/$/, '')
const localizedNotes = computed(() => (allNotes as ResearchNoteRecord[]).filter(note => note.lang === props.lang))
const reviewedNotes = computed(() => ratings.flatMap((rating, index) => {
  const note = localizedNotes.value.find(item => normalizePath(item.url) === rating.path)
  return note ? [{ ...rating, index: index + 1, note }] : []
}))

const average = computed(() => {
  if (!reviewedNotes.value.length) return '—'
  return (reviewedNotes.value.reduce((sum, item) => sum + item.score, 0) / reviewedNotes.value.length).toFixed(1)
})

const median = computed(() => {
  const scores = reviewedNotes.value.map(item => item.score).sort((a, b) => a - b)
  if (!scores.length) return '—'
  const middle = Math.floor(scores.length / 2)
  return scores.length % 2 ? String(scores[middle]) : String((scores[middle - 1] + scores[middle]) / 2)
})

const columns: Array<{ key: ResearchColumn; code: string; zh: string; en: string }> = [
  { key: 'digital-employee', code: 'DE', zh: '数字员工', en: 'Digital Employee' },
  { key: 'industry-architecture', code: 'IA', zh: '行业架构', en: 'Industry Architecture' },
  { key: 'open-source-engineering', code: 'OE', zh: '开源工程', en: 'Open-source Engineering' }
]

const columnStats = computed(() => columns.map(column => {
  const notes = reviewedNotes.value.filter(item => item.note.column === column.key)
  const score = notes.length ? (notes.reduce((sum, item) => sum + item.score, 0) / notes.length).toFixed(1) : '—'
  return { ...column, count: notes.length, score }
}))

const topNotes = computed(() => [...reviewedNotes.value].sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 5))

const copy = computed(() => zh.value ? {
  eyebrow: 'AI 编辑评审 · 2026-08-10', title: '40 篇观察笔记评分',
  lead: '使用同一把尺子逐篇评估文章质量：证据与严谨性 35%、原创判断 25%、结构表达 20%、工程实用性 20%。',
  average: '总平均分', median: '中位数', rated: '已评分', unit: '篇',
  top: '最高分文章', full: '查看 40 篇完整评分', hide: '收起完整评分',
  article: '文章', score: '评分', comment: '编辑短评',
  boundary: '评分评价文章的公开表达、论证与证据设计，不构成对全部底层事实的独立复核，也不等同于同行评审。',
  reviewer: '评审者：Codex · AI Editorial Review'
} : {
  eyebrow: 'AI EDITORIAL REVIEW · 2026-08-10', title: 'All 40 Observation Notes, scored',
  lead: 'One consistent rubric across every article: evidence and rigor 35%, original judgment 25%, structure 20%, and engineering usefulness 20%.',
  average: 'Overall average', median: 'Median', rated: 'Rated', unit: 'notes',
  top: 'Highest-rated notes', full: 'View all 40 scores', hide: 'Hide all scores',
  article: 'Article', score: 'Score', comment: 'Editorial note',
  boundary: 'Scores evaluate public writing, argument, and evidence design. They are not a full independent verification of every underlying claim or peer review.',
  reviewer: 'Reviewer: Codex · AI Editorial Review'
})
</script>

<template>
  <section class="scorecard" aria-labelledby="scorecard-title">
    <header class="scorecard__header">
      <div>
        <span>{{ copy.eyebrow }}</span>
        <h3 id="scorecard-title">{{ copy.title }}</h3>
        <p>{{ copy.lead }}</p>
      </div>
      <div class="scorecard__total" aria-label="overall score">
        <strong>{{ average }}</strong><span>/100</span><small>{{ copy.average }}</small>
      </div>
    </header>

    <div class="scorecard__metrics">
      <article v-for="column in columnStats" :key="column.key">
        <span>{{ column.code }}</span><b>{{ column.score }}</b><small>{{ zh ? column.zh : column.en }} · {{ column.count }}</small>
      </article>
      <article><span>MED</span><b>{{ median }}</b><small>{{ copy.median }}</small></article>
    </div>

    <div class="scorecard__top">
      <span>{{ copy.top }}</span>
      <ol>
        <li v-for="item in topNotes" :key="item.path">
          <a :href="withBase(item.note.url)"><b>{{ item.score }}</b><span>{{ item.note.title }}</span><i>↗</i></a>
        </li>
      </ol>
    </div>

    <details class="scorecard__details">
      <summary><span class="show">{{ copy.full }}</span><span class="hide">{{ copy.hide }}</span><b>{{ reviewedNotes.length }}/40</b></summary>
      <div class="scorecard__table-wrap">
        <table>
          <thead><tr><th>#</th><th>{{ copy.article }}</th><th>{{ copy.score }}</th><th>{{ copy.comment }}</th></tr></thead>
          <tbody>
            <tr v-for="item in reviewedNotes" :key="item.path">
              <td>{{ String(item.index).padStart(2, '0') }}</td>
              <td><a :href="withBase(item.note.url)">{{ item.note.title }} <span>↗</span></a></td>
              <td><strong>{{ item.score }}</strong></td>
              <td>{{ zh ? item.zh : item.en }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>

    <footer><span>{{ copy.reviewer }}</span><p>{{ copy.boundary }}</p></footer>
  </section>
</template>

<style scoped>
.scorecard{--scorecard-row:#fff;--scorecard-row-alt:#f3f4f6;--scorecard-table-text:#25324a;--scorecard-table-muted:#63718a;--scorecard-table-index:#53627a;margin-top:28px;border:1px solid rgba(255,255,255,.16);background:linear-gradient(145deg,#111b31,#171438 58%,#0c3541);color:#fff;box-shadow:0 24px 70px rgba(0,0,0,.24)}
:global(html.dark .scorecard){--scorecard-row:#10192d;--scorecard-row-alt:#151d33;--scorecard-table-text:#f4f7fc;--scorecard-table-muted:#aab5c8;--scorecard-table-index:#7d8ca7}
.scorecard__header{display:grid;grid-template-columns:minmax(0,1fr) 190px;gap:42px;align-items:end;padding:32px;border-bottom:1px solid rgba(255,255,255,.14)}
.scorecard__header>div>span,.scorecard__top>span{display:block;color:#62deed;font:800 10px/1 ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase}
.scorecard__header h3{margin:12px 0 10px;font-size:clamp(29px,4vw,44px);line-height:1.04;letter-spacing:-.045em}
.scorecard__header p{max-width:760px;margin:0;color:#aebbd1;font-size:13px;line-height:1.7}
.scorecard__total{text-align:right}
.scorecard__total strong{font-size:70px;line-height:.82;letter-spacing:-.085em}
.scorecard__total>span{color:#7f90ad;font:700 14px/1 ui-monospace,monospace}
.scorecard__total small{display:block;margin-top:12px;color:#aebbd1;font-size:11px}
.scorecard__metrics{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid rgba(255,255,255,.14)}
.scorecard__metrics article{display:grid;grid-template-columns:auto 1fr;gap:5px 14px;align-items:center;min-height:112px;padding:22px 26px;border-right:1px solid rgba(255,255,255,.12)}
.scorecard__metrics article:last-child{border-right:0}
.scorecard__metrics span{grid-row:1/3;display:grid;width:34px;height:34px;place-items:center;color:#0d1b27;background:#62deed;font:850 9px/1 ui-monospace,monospace}
.scorecard__metrics b{font-size:27px;line-height:1}
.scorecard__metrics small{color:#8391aa;font-size:10px}
.scorecard__top{display:grid;grid-template-columns:150px 1fr;gap:24px;padding:28px 32px}
.scorecard__top>span{padding-top:10px}
.scorecard__top ol{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin:0;padding:0;list-style:none}
.scorecard__top a{display:grid;grid-template-columns:auto 1fr auto;gap:9px;align-items:start;min-height:88px;padding:14px;color:#fff!important;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09)}
.scorecard__top a:hover{border-color:#62deed;background:rgba(98,222,237,.09)}
.scorecard__top a b{color:#62deed;font-size:18px}
.scorecard__top a span{font-size:11px;line-height:1.45}
.scorecard__top a i{color:#70819f;font-style:normal}
.scorecard__details{border-top:1px solid rgba(255,255,255,.14)}
.scorecard__details summary{display:flex;align-items:center;justify-content:space-between;min-height:58px;padding:0 32px;color:#fff;cursor:pointer;font-size:12px;font-weight:800;list-style:none}
.scorecard__details summary::-webkit-details-marker{display:none}
.scorecard__details summary:before{content:'+';margin-right:12px;color:#62deed;font-size:20px;font-weight:400}
.scorecard__details summary>b{margin-left:auto;color:#73839f;font:700 10px/1 ui-monospace,monospace}
.scorecard__details .hide{display:none}
.scorecard__details[open] summary:before{content:'−'}
.scorecard__details[open] .show{display:none}
.scorecard__details[open] .hide{display:inline}
.scorecard__table-wrap{max-height:590px;overflow:auto;border-top:1px solid rgba(255,255,255,.1)}
table{width:100%;border-collapse:collapse;font-size:11px}
tbody tr{color:var(--scorecard-table-text);background:var(--scorecard-row)!important}
tbody tr:nth-child(even){background:var(--scorecard-row-alt)!important}
th,td{padding:15px 14px;border-bottom:1px solid rgba(255,255,255,.09);text-align:left;vertical-align:top}
th{position:sticky;top:0;z-index:1;color:#8997af;background:#11172a;font:800 9px/1 ui-monospace,monospace;letter-spacing:.09em;text-transform:uppercase}
th:first-child,td:first-child{width:44px;padding-left:32px;color:var(--scorecard-table-index);font-family:ui-monospace,monospace}
th:nth-child(2),td:nth-child(2){width:30%}
th:nth-child(3),td:nth-child(3){width:70px;text-align:center}
td a{color:var(--scorecard-table-text)!important;font-weight:750;line-height:1.45}
td a span{color:#62deed}
td strong{color:#62deed;font-size:17px}
td:last-child{color:var(--scorecard-table-muted);line-height:1.55}
.scorecard footer{display:grid;grid-template-columns:220px 1fr;gap:24px;padding:20px 32px;color:#8290a9;border-top:1px solid rgba(255,255,255,.12);font-size:10px;line-height:1.55}
.scorecard footer span{color:#aebbd1;font-weight:760}
.scorecard footer p{margin:0}
@media(max-width:900px){
  .scorecard__header{grid-template-columns:1fr 150px}.scorecard__metrics{grid-template-columns:repeat(2,1fr)}.scorecard__metrics article:nth-child(2){border-right:0}.scorecard__metrics article:nth-child(-n+2){border-bottom:1px solid rgba(255,255,255,.12)}
  .scorecard__top{grid-template-columns:1fr}.scorecard__top ol{grid-template-columns:repeat(2,1fr)}.scorecard__top li:last-child{grid-column:1/-1}.scorecard footer{grid-template-columns:1fr}
}
@media(max-width:620px){
  .scorecard{margin-top:20px}.scorecard__header{grid-template-columns:1fr;padding:24px}.scorecard__total{text-align:left}.scorecard__total strong{font-size:58px}.scorecard__metrics article{min-height:94px;padding:17px}.scorecard__top{padding:24px}.scorecard__top ol{grid-template-columns:1fr}.scorecard__top li:last-child{grid-column:auto}.scorecard__top a{min-height:72px}.scorecard__details summary{padding:0 24px}
  .scorecard__table-wrap{max-height:520px}table,tbody,tr,td{display:block}thead{display:none}tr{position:relative;padding:17px 22px 17px 58px;border-bottom:1px solid rgba(255,255,255,.1)}td,td:first-child,td:nth-child(2),td:nth-child(3){width:auto;padding:0;border:0;text-align:left}td:first-child{position:absolute;left:22px;top:20px}td:nth-child(2){padding-right:54px}td:nth-child(3){position:absolute;right:22px;top:17px}td:last-child{margin-top:8px}.scorecard footer{padding:19px 24px}
}
</style>
