<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import legacyData from '../../generated/runtime-legacy-records.json'

type Status = 'Running' | 'Completed' | 'Blocked' | 'Failed' | 'Skipped' | 'Waiting'
type Task = {
  id: string
  name: string
  name_zh: string
  schedule: { time: string }
  input: string
  input_zh: string
  work: string
  work_zh: string
  output: string
  output_zh: string
}
type Metric = { label: string; label_zh: string; value: string }
type Evidence = { label: string; label_zh: string; source: string }
type Artifact = { label: string; label_zh: string; path?: string; url?: string; commit?: string }
type Result = {
  task: string
  status: Status
  input: string
  input_zh: string
  workResult: string
  workResult_zh: string
  output: string
  output_zh: string
  next: string
  next_zh: string
  reason?: string
  reason_zh?: string
  metrics: Metric[]
  evidence: Evidence[]
  artifacts: Artifact[]
}
type Column = {
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
type RecordItem = {
  runtimeFamily: 'legacy'
  date: string
  status: Status
  taskStatus: Record<string, Status>
  results: Record<string, Result>
  githubCommit: string
  commitVerify: Status
  recordPath: string
  tasks: Task[]
  columns: Column[]
  totalTasks: number
  completedTasks: number
}
type Data = {
  today: string
  timezone: string
  current: RecordItem | null
  records: RecordItem[]
}

const data = legacyData as Data
const props = withDefaults(defineProps<{ lang?: 'en' | 'zh'; selectedDate?: string }>(), { lang: 'en', selectedDate: '' })
const zh = computed(() => props.lang === 'zh')
const record = computed(() => data.records.find((item) => item.date === props.selectedDate) || data.current)
const rows = computed(() => (record.value?.tasks || []).map((task) => ({
  task,
  status: record.value?.taskStatus?.[task.id] || 'Waiting',
  result: record.value?.results?.[task.id] || null
})))
const completedCount = computed(() => rows.value.filter((row) => row.status === 'Completed').length)
const totalCount = computed(() => rows.value.length)
const progress = computed(() => totalCount.value ? Math.round(completedCount.value / totalCount.value * 100) : 0)
const risk = computed(() => rows.value.some((row) => row.status === 'Blocked' || row.status === 'Failed'))
const currentRow = computed(() => rows.value.find((row) => row.status === 'Running') || rows.value.find((row) => row.status === 'Waiting') || null)
const production = computed(() => record.value?.results?.production || null)
const publication = computed(() => record.value?.results?.publication || null)

const copy = computed(() => zh.value ? {
  kicker: 'RESEARCH RUNTIME CENTER · 数字研究员运营中心',
  title: '数字工场运营中心',
  lead: '今天研究什么，下午生产什么，晚上发布什么。',
  badge: '历史 Runtime Record · 真实数据',
  charter: '查看 V5.0 运行规范',
  operations: '今日运营概况',
  progress: '完成进度',
  dayStatus: '全天状态',
  current: '当前工作',
  nextTask: '下一任务',
  completed: '已完成',
  inProgress: '进行中',
  attention: '存在风险',
  ended: '今日班次已结束',
  plan: '今日三栏研究计划',
  planHint: '兼容读取当天原始三栏计划，不倒填 V5 Intelligence 结果。',
  selected: '已选题',
  noSelection: '未选题',
  waiting: '待决定',
  decision: '选题判断',
  shifts: '今日班次与工作成果',
  shiftsHint: '班次总数按当天星期与当时生效的 Scheduler 动态计算。',
  input: '输入',
  work: '工作成果',
  output: '输出',
  next: '下一步',
  pending: '该班次没有结构化成果块；请查看原始 Runtime Record。',
  production: '15:00 下午生产',
  release: '20:00 晚间发版',
  noCandidate: '没有形成 Publication Candidate',
  noRelease: '尚未执行发布',
  verify: '运行证据',
  github: 'GitHub 验证',
  commit: '最新提交',
  record: '原始 Runtime Record',
  history: '近期运营记录',
  report: '查看记录',
  status: { Running: '运行中', Completed: '已完成', Blocked: '已阻塞', Failed: '失败', Skipped: '已跳过', Waiting: '待执行' } as Record<Status, string>
} : {
  kicker: 'RESEARCH RUNTIME CENTER · DIGITAL RESEARCHER OPERATIONS',
  title: 'Digital Works Operations Center',
  lead: 'What is researched today, produced in the afternoon, and released at night.',
  badge: 'Historical Runtime Record · Authentic Data',
  charter: 'Read the V5.0 Runtime Specification',
  operations: "Today's Operations",
  progress: 'Completion',
  dayStatus: 'Day Status',
  current: 'Current Work',
  nextTask: 'Next Task',
  completed: 'Completed',
  inProgress: 'In Progress',
  attention: 'Attention Required',
  ended: 'Today’s shifts have ended',
  plan: "Today's Three-Column Research Plan",
  planHint: 'Reads the original plan without manufacturing a retrospective V5 Intelligence result.',
  selected: 'Selected',
  noSelection: 'No Selection',
  waiting: 'Waiting',
  decision: 'Decision',
  shifts: "Today's Shifts and Outcomes",
  shiftsHint: 'The task total is calculated from the weekday and the Scheduler effective on that date.',
  input: 'Input',
  work: 'Work Result',
  output: 'Output',
  next: 'Next',
  pending: 'No structured result block exists for this shift; open the original Runtime Record.',
  production: '15:00 Production Shift',
  release: '20:00 Release Shift',
  noCandidate: 'No Publication Candidate was created',
  noRelease: 'Publication has not run',
  verify: 'Runtime Evidence',
  github: 'GitHub Verification',
  commit: 'Latest Commit',
  record: 'Original Runtime Record',
  history: 'Recent Operations',
  report: 'View record',
  status: { Running: 'Running', Completed: 'Completed', Blocked: 'Blocked', Failed: 'Failed', Skipped: 'Skipped', Waiting: 'Waiting' } as Record<Status, string>
})

const statusLabel = (status: Status) => copy.value.status[status]
const statusClass = (status?: Status) => `s-${String(status || 'Waiting').toLowerCase()}`
const taskName = (task: Task) => zh.value ? task.name_zh : task.name
const local = (value: Record<string, unknown>, field: string) => String(zh.value && value[`${field}_zh`] ? value[`${field}_zh`] : value[field] || '')
const columnName = (item: Column) => zh.value ? item.label_zh : item.label
const columnTitle = (item: Column) => zh.value ? item.selectedTitle_zh : item.selectedTitle
const columnReason = (item: Column) => zh.value ? item.reason_zh : item.reason
const columnStatus = (item: Column) => item.decision === 'Selected' ? copy.value.selected : item.decision === 'No Selection' ? copy.value.noSelection : copy.value.waiting
const dayState = computed(() => {
  if (risk.value) return copy.value.attention
  if (rows.value.length && rows.value.every((row) => ['Completed', 'Skipped', 'Blocked', 'Failed'].includes(row.status))) return copy.value.ended
  return copy.value.inProgress
})
const currentName = computed(() => currentRow.value ? taskName(currentRow.value.task) : copy.value.ended)
const currentTime = computed(() => currentRow.value?.task.schedule.time || '—')
const recordUrl = (item: RecordItem) => `https://github.com/joinwell52-AI/joinwell52/blob/main/${item.recordPath}`
const artifactHref = (item: Artifact) => item.url || (item.path
  ? `https://github.com/joinwell52-AI/joinwell52/blob/main/${item.path}`
  : item.commit
    ? `https://github.com/joinwell52-AI/joinwell52/commit/${item.commit}`
    : '#')
const evidenceHref = (item: Evidence) => /^https?:\/\//.test(item.source)
  ? item.source
  : `https://github.com/joinwell52-AI/joinwell52/blob/main/${item.source}`
const shortCommit = computed(() => record.value?.githubCommit && record.value.githubCommit !== 'pending'
  ? record.value.githubCommit.slice(0, 10)
  : copy.value.waiting)
</script>

<template>
  <main v-if="record" class="legacy-runtime">
    <div class="shell">
      <header class="hero">
        <div>
          <span class="kicker">{{ copy.kicker }}</span>
          <h1>{{ copy.title }}</h1>
          <p>{{ copy.lead }}</p>
        </div>
        <div class="hero-actions">
          <b>{{ copy.badge }}</b>
          <a :href="withBase(`/${props.lang}/runtime/v5`)">{{ copy.charter }} →</a>
        </div>
      </header>

      <section class="panel">
        <div class="section-title"><div><span>01</span><h2>{{ copy.operations }}</h2></div><small>{{ record.date }} · {{ data.timezone }}</small></div>
        <div class="overview-grid">
          <article><span>{{ copy.progress }}</span><strong>{{ completedCount }} <i>/ {{ totalCount }}</i></strong><div class="bar"><i :style="{ width: `${progress}%` }"></i></div><small>{{ progress }}%</small></article>
          <article><span>{{ copy.dayStatus }}</span><strong :class="risk ? 's-failed' : 's-running'">{{ dayState }}</strong><small>{{ statusLabel(record.status) }}</small></article>
          <article><span>{{ copy.current }}</span><strong>{{ currentName }}</strong><small>{{ currentRow ? statusLabel(currentRow.status) : copy.ended }}</small></article>
          <article><span>{{ copy.nextTask }}</span><strong>{{ currentTime }}</strong><small>{{ currentName }}</small></article>
        </div>
      </section>

      <section class="panel">
        <div class="section-title"><div><span>02</span><h2>{{ copy.plan }}</h2></div><small>{{ copy.planHint }}</small></div>
        <div class="column-grid">
          <article v-for="column in record.columns" :key="column.id" :class="`column-${column.id}`">
            <div class="card-head"><div><small>{{ column.id.replaceAll('-', ' ').toUpperCase() }}</small><h3>{{ columnName(column) }}</h3></div><b :class="column.decision === 'Selected' ? 's-running' : column.decision === 'No Selection' ? 's-skipped' : 's-waiting'">{{ columnStatus(column) }}</b></div>
            <h4>{{ column.decision === 'Selected' ? `${column.selectedItemId} · ${columnTitle(column)}` : columnStatus(column) }}</h4>
            <p>{{ columnReason(column) }}</p>
          </article>
        </div>
      </section>

      <section class="panel">
        <div class="section-title"><div><span>03</span><h2>{{ copy.shifts }}</h2></div><small>{{ copy.shiftsHint }}</small></div>
        <div class="shift-list">
          <article v-for="row in rows" :key="row.task.id" class="shift-card">
            <div class="shift-head"><div><time>{{ row.task.schedule.time }}</time><h3>{{ taskName(row.task) }}</h3></div><b :class="statusClass(row.status)">{{ statusLabel(row.status) }}</b></div>
            <template v-if="row.result">
              <div class="result-grid">
                <div><span>{{ copy.input }}</span><p>{{ local(row.result as unknown as Record<string, unknown>, 'input') }}</p></div>
                <div class="outcome"><span>{{ copy.work }}</span><p>{{ local(row.result as unknown as Record<string, unknown>, 'workResult') }}</p></div>
                <div><span>{{ copy.output }}</span><p>{{ local(row.result as unknown as Record<string, unknown>, 'output') }}</p></div>
                <div><span>{{ copy.next }}</span><p>{{ local(row.result as unknown as Record<string, unknown>, 'next') }}</p></div>
              </div>
              <div v-if="row.result.metrics.length" class="metric-grid"><div v-for="metric in row.result.metrics" :key="metric.label"><strong>{{ metric.value }}</strong><span>{{ zh ? metric.label_zh : metric.label }}</span></div></div>
              <div v-if="row.result.artifacts.length || row.result.evidence.length" class="links"><a v-for="item in row.result.artifacts" :key="item.label" :href="artifactHref(item)">{{ zh ? item.label_zh : item.label }} ↗</a><a v-for="item in row.result.evidence" :key="item.label" :href="evidenceHref(item)">{{ zh ? item.label_zh : item.label }} ↗</a></div>
            </template>
            <div v-else class="contract"><p>{{ zh ? row.task.work_zh : row.task.work }}</p><a :href="recordUrl(record)">{{ copy.pending }} ↗</a></div>
          </article>
        </div>
      </section>

      <section class="production-grid">
        <article class="panel"><div class="section-title"><div><span>04</span><h2>{{ copy.production }}</h2></div><b :class="statusClass(record.taskStatus.production)">{{ statusLabel(record.taskStatus.production || 'Waiting') }}</b></div><div v-if="production" class="focus"><strong>{{ local(production as unknown as Record<string, unknown>, 'workResult') }}</strong><p>{{ local(production as unknown as Record<string, unknown>, production.status === 'Skipped' ? 'reason' : 'output') }}</p></div><div v-else class="empty">{{ copy.noCandidate }}</div></article>
        <article class="panel"><div class="section-title"><div><span>05</span><h2>{{ copy.release }}</h2></div><b :class="statusClass(record.taskStatus.publication)">{{ statusLabel(record.taskStatus.publication || 'Waiting') }}</b></div><div v-if="publication" class="focus"><strong>{{ local(publication as unknown as Record<string, unknown>, 'workResult') }}</strong><p>{{ local(publication as unknown as Record<string, unknown>, publication.status === 'Skipped' ? 'reason' : 'output') }}</p></div><div v-else class="empty">{{ copy.noRelease }}</div></article>
      </section>

      <section class="panel">
        <div class="section-title"><div><span>06</span><h2>{{ copy.verify }}</h2></div></div>
        <div class="evidence-grid"><article><span>{{ copy.github }}</span><strong :class="statusClass(record.commitVerify)">{{ statusLabel(record.commitVerify) }}</strong></article><article><span>{{ copy.commit }}</span><strong>{{ shortCommit }}</strong></article><article><span>{{ copy.record }}</span><a :href="recordUrl(record)">{{ copy.report }} ↗</a></article></div>
      </section>

      <section class="panel">
        <div class="section-title"><div><span>07</span><h2>{{ copy.history }}</h2></div></div>
        <div class="history-list"><a v-for="item in data.records" :key="item.date" :href="recordUrl(item)"><strong>{{ item.date }}</strong><span>{{ item.completedTasks }} / {{ item.totalTasks }}</span><b :class="statusClass(item.status)">{{ statusLabel(item.status) }}</b><small>{{ copy.report }} ↗</small></a></div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.legacy-runtime{--panel:#10162a;--line:rgba(148,163,184,.2);--text:#f5f7ff;--muted:#94a0b7;--accent:#8f80ff;--blue:#72d6ff;--green:#77e5a7;width:100vw;margin-left:calc(50% - 50vw);min-height:100vh;color:var(--text);background:radial-gradient(circle at 75% 0%,rgba(88,72,210,.2),transparent 32%),linear-gradient(180deg,#060812,#080b18)}.shell{width:min(1280px,calc(100% - 52px));margin:auto;padding:54px 0 84px}.hero{display:flex;justify-content:space-between;align-items:flex-end;gap:36px;padding:34px;background:linear-gradient(145deg,rgba(18,25,46,.98),rgba(8,12,26,.97));border:1px solid var(--line);border-radius:24px}.kicker{display:block;margin-bottom:14px;color:#bdb5ff;font:750 11px/1.3 ui-monospace,monospace;letter-spacing:.14em}.hero h1{max-width:860px;margin:0;font-size:clamp(42px,6vw,74px);line-height:1.04;letter-spacing:-.055em}.hero p{max-width:820px;margin:20px 0 0;color:#b5bfd1;font-size:16px;line-height:1.75}.hero-actions{display:flex;min-width:260px;flex-direction:column;gap:12px;align-items:flex-end}.hero-actions a{color:#a9deff;text-decoration:none}.panel{margin-top:16px;padding:26px;background:linear-gradient(145deg,rgba(18,25,46,.98),rgba(8,12,26,.97));border:1px solid var(--line);border-radius:20px}.section-title{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:20px}.section-title>div{display:flex;align-items:center;gap:12px}.section-title>div>span{color:#9487ff;font:800 11px/1 ui-monospace,monospace}.section-title h2{margin:0;font-size:23px}.section-title small{color:#7f8ca2}.overview-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.overview-grid article,.evidence-grid article{padding:18px;background:#080d1c;border:1px solid var(--line);border-radius:15px}.overview-grid span,.evidence-grid span{display:block;margin-bottom:12px;color:#77849a;font-size:11px}.overview-grid strong{display:block;font-size:20px}.overview-grid i{color:#78849a;font-style:normal;font-size:13px}.overview-grid small{display:block;margin-top:8px;color:#7f8ca2}.bar{height:6px;margin-top:14px;overflow:hidden;background:#202941;border-radius:999px}.bar i{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--blue))}.column-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.column-grid article{padding:20px;background:rgba(5,9,21,.62);border:1px solid var(--line);border-radius:17px}.card-head,.shift-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.card-head small{color:#748198;font:700 9px/1.3 ui-monospace,monospace}.card-head h3{margin:8px 0 0}.card-head>b,.shift-head>b,.section-title>b,.history-list b{padding:7px 10px;border:1px solid currentColor;border-radius:999px;font-size:10px}.column-grid h4{margin:20px 0 10px}.column-grid p{color:#96a2b6;font-size:13px;line-height:1.6}.shift-list{display:grid;gap:12px}.shift-card{padding:20px;background:#080d1c;border:1px solid var(--line);border-radius:17px}.shift-head time{color:#bdb5ff;font-weight:800}.shift-head h3{margin:6px 0 0;font-size:20px}.result-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:16px}.result-grid>div{padding:14px;background:#0d1426;border-radius:12px}.result-grid .outcome{background:#151c35}.result-grid span{display:block;margin-bottom:7px;color:#77849a;font-size:10px}.result-grid p{margin:0;color:#c2cad8;font-size:13px;line-height:1.55}.metric-grid{display:flex;flex-wrap:wrap;gap:9px;margin-top:12px}.metric-grid>div{padding:10px 12px;background:#0d1426;border-radius:10px}.metric-grid strong{display:block}.metric-grid span{color:#77849a;font-size:10px}.links{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.links a,.contract a{color:#a9deff;text-decoration:none;font-size:12px}.contract{margin-top:16px;color:#96a2b6}.production-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.focus strong{font-size:18px}.focus p,.empty{color:#96a2b6;line-height:1.65}.evidence-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.evidence-grid a{color:#a9deff}.history-list{display:grid;gap:9px}.history-list a{display:grid;grid-template-columns:1fr auto auto auto;align-items:center;gap:14px;padding:14px 16px;color:inherit;text-decoration:none;background:#080d1c;border:1px solid var(--line);border-radius:13px}.history-list span,.history-list small{color:#7f8ca2}.s-waiting{color:#c4b5fd!important}.s-running{color:var(--blue)!important}.s-completed{color:var(--green)!important}.s-blocked{color:#f8c56a!important}.s-failed{color:#fca5a5!important}.s-skipped{color:#a2acbd!important}@media(max-width:900px){.overview-grid,.result-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.column-grid,.production-grid{grid-template-columns:1fr}.hero{align-items:flex-start;flex-direction:column}.hero-actions{align-items:flex-start}}@media(max-width:620px){.shell{width:calc(100% - 28px);padding:28px 0 60px}.hero,.panel{padding:20px}.hero h1{font-size:42px}.overview-grid,.result-grid,.evidence-grid{grid-template-columns:1fr}.history-list a{grid-template-columns:1fr auto}.history-list small{grid-column:1/-1}}
</style>
