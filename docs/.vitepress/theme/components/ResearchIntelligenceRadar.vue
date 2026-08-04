<script setup lang="ts">
import { computed } from 'vue'
import intelligenceData from '../../generated/research-intelligence.json'

type Status = 'Waiting' | 'Running' | 'Completed' | 'Blocked' | 'Failed' | 'Skipped'
type PipelineResult = {
  id: string
  label: string
  label_zh: string
  status: Status
  due: number
  checked: number
  inaccessible: Array<{ source: string; reason: string }>
  failed: Array<{ source: string; reason: string }>
  signals: number
  candidates: number
  selected: number
  rejected: number
  coveragePercent: number
  reason: string
  reason_zh: string
}
type ColumnResult = {
  id: string
  label: string
  label_zh: string
  decision: 'Waiting' | 'Selected' | 'No Selection'
  signals: number
  candidates: number
  selectedItemId: string
  selectedTitle: string
  selectedTitle_zh: string
  reason: string
  reason_zh: string
}
type Run = {
  date: string
  status: Status
  reason: string
  reason_zh: string
  pipelines: PipelineResult[]
  columns: ColumnResult[]
}
type Data = {
  today: string
  timezone: string
  registryVersion: string
  effectiveDate: string
  registryPath: string
  currentRun: Run
}

const data = intelligenceData as Data
const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })
const zh = computed(() => props.lang === 'zh')
const run = computed(() => data.currentRun)

const copy = computed(() => zh.value ? {
  kicker: 'RESEARCH INTELLIGENCE SYSTEM V1.0',
  title: '研究情报雷达',
  lead: 'AI 平台、GitHub 工程、论文与研究成果三条情报管线，共同服务数字员工、行业架构和开源工程三个板块。',
  pipelines: '三条情报管线',
  columns: '三栏选题结果',
  due: '应检查',
  checked: '已检查',
  inaccessible: '受限',
  signals: '信号',
  candidates: '候选',
  selected: '入选',
  noSelection: '未选题',
  waiting: '待执行',
  registry: '来源 Registry',
  run: '今日扫描记录',
  effective: '生效日期',
  sourceNote: '完成标准是覆盖率和可追溯结果，不是强行找到一篇文章。',
  status: { Waiting: '待执行', Running: '运行中', Completed: '已完成', Blocked: '已阻塞', Failed: '失败', Skipped: '已跳过' }
} : {
  kicker: 'RESEARCH INTELLIGENCE SYSTEM V1.0',
  title: 'Research Intelligence Radar',
  lead: 'AI Platform, GitHub Engineering, and Published Research intelligence jointly serve the Digital Employee, Industry Architecture, and Open-source Engineering columns.',
  pipelines: 'Three Intelligence Pipelines',
  columns: 'Three-Column Decisions',
  due: 'Due',
  checked: 'Checked',
  inaccessible: 'Restricted',
  signals: 'Signals',
  candidates: 'Candidates',
  selected: 'Selected',
  noSelection: 'No Selection',
  waiting: 'Waiting',
  registry: 'Source Registry',
  run: "Today's Scan Record",
  effective: 'Effective',
  sourceNote: 'Completion is measured by source coverage and traceable outcomes, not by forcing an article.',
  status: { Waiting: 'Waiting', Running: 'Running', Completed: 'Completed', Blocked: 'Blocked', Failed: 'Failed', Skipped: 'Skipped' }
})

const statusLabel = (status: Status) => copy.value.status[status]
const statusClass = (status: Status) => `s-${status.toLowerCase()}`
const pipelineName = (item: PipelineResult) => zh.value ? item.label_zh : item.label
const pipelineReason = (item: PipelineResult) => zh.value ? item.reason_zh : item.reason
const columnName = (item: ColumnResult) => zh.value ? item.label_zh : item.label
const columnReason = (item: ColumnResult) => zh.value ? item.reason_zh : item.reason
const columnTitle = (item: ColumnResult) => zh.value ? item.selectedTitle_zh : item.selectedTitle
const columnStatus = (item: ColumnResult) => item.decision === 'Selected'
  ? copy.value.selected
  : item.decision === 'No Selection'
    ? copy.value.noSelection
    : copy.value.waiting
const columnClass = (item: ColumnResult) => item.decision === 'Selected'
  ? 's-completed'
  : item.decision === 'No Selection'
    ? 's-skipped'
    : 's-waiting'

const repoUrl = (path: string) => `https://github.com/joinwell52-AI/joinwell52/blob/main/${path}`
const runPath = computed(() =>
  `research/intelligence/runs/${run.value.date.slice(0, 4)}/${run.value.date.slice(5, 7)}/${run.value.date}-intelligence.json`
)
</script>

<template>
  <section class="intel-radar">
    <div class="intel-shell">
      <header>
        <div>
          <span class="kicker">{{ copy.kicker }}</span>
          <h2>{{ copy.title }}</h2>
          <p>{{ copy.lead }}</p>
        </div>
        <div class="meta">
          <b :class="statusClass(run.status)">{{ statusLabel(run.status) }}</b>
          <span>{{ run.date }} · {{ data.timezone }}</span>
        </div>
      </header>

      <section class="panel">
        <div class="section-title">
          <h3>{{ copy.pipelines }}</h3>
          <small>{{ copy.sourceNote }}</small>
        </div>
        <div class="pipeline-grid">
          <article v-for="item in run.pipelines" :key="item.id">
            <div class="card-head">
              <div><small>{{ item.id.toUpperCase() }}</small><h4>{{ pipelineName(item) }}</h4></div>
              <b :class="statusClass(item.status)">{{ statusLabel(item.status) }}</b>
            </div>
            <div class="coverage">
              <span><strong>{{ item.checked }}</strong>{{ copy.checked }}</span>
              <span><strong>{{ item.due }}</strong>{{ copy.due }}</span>
              <span><strong>{{ item.inaccessible.length + item.failed.length }}</strong>{{ copy.inaccessible }}</span>
            </div>
            <div class="bar"><i :style="{ width: `${item.coveragePercent}%` }"></i></div>
            <div class="metrics">
              <span><strong>{{ item.signals }}</strong>{{ copy.signals }}</span>
              <span><strong>{{ item.candidates }}</strong>{{ copy.candidates }}</span>
              <span><strong>{{ item.selected }}</strong>{{ copy.selected }}</span>
            </div>
            <p>{{ pipelineReason(item) }}</p>
          </article>
        </div>
      </section>

      <section class="panel columns-panel">
        <div class="section-title"><h3>{{ copy.columns }}</h3><small>{{ copy.effective }} · {{ data.effectiveDate }}</small></div>
        <div class="column-grid">
          <article v-for="item in run.columns" :key="item.id" :class="`column-${item.id}`">
            <div class="card-head">
              <div><small>{{ item.id.replaceAll('-', ' ').toUpperCase() }}</small><h4>{{ columnName(item) }}</h4></div>
              <b :class="columnClass(item)">{{ columnStatus(item) }}</b>
            </div>
            <h5 v-if="item.decision === 'Selected'">{{ item.selectedItemId }} · {{ columnTitle(item) }}</h5>
            <p>{{ columnReason(item) }}</p>
            <div class="metrics">
              <span><strong>{{ item.signals }}</strong>{{ copy.signals }}</span>
              <span><strong>{{ item.candidates }}</strong>{{ copy.candidates }}</span>
            </div>
          </article>
        </div>
      </section>

      <footer>
        <a :href="repoUrl(data.registryPath)">{{ copy.registry }} ↗</a>
        <a :href="repoUrl(runPath)">{{ copy.run }} ↗</a>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.intel-radar{--bg:#070914;--panel:#10162a;--line:rgba(148,163,184,.2);--text:#f5f7ff;--muted:#94a0b7;--accent:#8f80ff;--blue:#72d6ff;--green:#77e5a7;position:relative;width:100vw;margin-left:calc(50% - 50vw);color:var(--text);background:linear-gradient(180deg,#060812,#080b18);border-top:1px solid var(--line)}
.intel-shell{width:min(1280px,calc(100% - 52px));margin:auto;padding:70px 0 80px}.intel-radar header{display:flex;justify-content:space-between;align-items:flex-end;gap:36px;margin-bottom:18px}.kicker{display:block;margin-bottom:13px;color:#bdb5ff;font:750 11px/1.3 ui-monospace,monospace;letter-spacing:.14em}.intel-radar h2{margin:0;font-size:clamp(38px,5vw,64px);letter-spacing:-.05em}.intel-radar header p{max-width:800px;margin:18px 0 0;color:#b5bfd1;font-size:16px;line-height:1.7}.meta{display:flex;flex-direction:column;align-items:flex-end;gap:10px}.meta b,.card-head>b{padding:7px 10px;border:1px solid currentColor;border-radius:999px;font:750 10px/1 ui-monospace,monospace}.meta span{color:#7f8ca2;font-size:12px}
.panel{padding:26px;background:linear-gradient(145deg,rgba(18,25,46,.98),rgba(8,12,26,.97));border:1px solid var(--line);border-radius:20px}.columns-panel{margin-top:16px}.section-title{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:20px}.section-title h3{margin:0;font-size:21px}.section-title small{color:#7f8ca2}.pipeline-grid,.column-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.pipeline-grid article,.column-grid article{padding:20px;background:rgba(5,9,21,.62);border:1px solid var(--line);border-radius:17px}.card-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.card-head small{color:#748198;font:700 9px/1.3 ui-monospace,monospace}.card-head h4{margin:8px 0 0;font-size:19px}.coverage,.metrics{display:flex;gap:9px;margin-top:20px}.coverage span,.metrics span{flex:1;padding:10px;background:#0a1020;border:1px solid var(--line);border-radius:10px;color:#7f8ca2;font-size:9px}.coverage strong,.metrics strong{display:block;margin-bottom:4px;color:#e9e7ff;font-size:17px}.bar{height:6px;margin-top:11px;overflow:hidden;background:#202941;border-radius:999px}.bar i{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--blue));border-radius:999px}.pipeline-grid p,.column-grid p{margin:16px 0 0;color:#96a2b6;font-size:12px;line-height:1.6}.column-grid article{position:relative;overflow:hidden}.column-grid article:before{content:'';position:absolute;inset:0 auto 0 0;width:3px;background:var(--accent)}.column-industry-architecture:before{background:var(--blue)!important}.column-open-source-engineering:before{background:var(--green)!important}.column-grid h5{margin:22px 0 0;font-size:18px;line-height:1.4}.intel-radar footer{display:flex;flex-wrap:wrap;gap:12px;margin-top:16px}.intel-radar footer a{padding:10px 14px;color:#cbc6ff;background:#0a1020;border:1px solid var(--line);border-radius:999px;text-decoration:none;font-size:12px;font-weight:720}
.s-waiting{color:#c4b5fd!important}.s-running{color:var(--blue)!important}.s-completed{color:var(--green)!important}.s-blocked{color:#f8c56a!important}.s-failed{color:#fca5a5!important}.s-skipped{color:#a2acbd!important}
@media(max-width:1000px){.intel-radar header{align-items:flex-start;flex-direction:column}.meta{align-items:flex-start}.pipeline-grid,.column-grid{grid-template-columns:1fr}.section-title{align-items:flex-start;flex-direction:column}}
@media(max-width:680px){.intel-shell{width:calc(100% - 28px);padding:54px 0 64px}.intel-radar h2{font-size:42px}.panel{padding:18px;border-radius:16px}.coverage,.metrics{flex-wrap:wrap}.coverage span,.metrics span{min-width:90px}}
</style>
