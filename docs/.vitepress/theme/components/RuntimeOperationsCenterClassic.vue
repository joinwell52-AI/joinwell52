<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import runtimeData from '../../generated/runtime-records.json'
import intelligenceData from '../../generated/research-intelligence.json'
import legacyData from '../../generated/runtime-legacy-records.json'

type Status = 'Running' | 'Completed' | 'Blocked' | 'Failed' | 'Skipped' | 'Waiting'
type Task = {
  id: string
  family: string
  name: string
  name_zh: string
  schedule: { kind: string; time: string; days?: string[]; cron: string }
  input: string
  work: string
  output: string
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
type RecordItem = {
  runtimeFamily: string
  date: string
  status: Status
  taskStatus: Record<string, Status>
  results: Record<string, Result>
  timeline: Array<{ time: string; task: string; event: string; status: Status; detail: string }>
  githubCommit: string
  commitVerify: Status
}
type RuntimeData = {
  today: string
  timezone: string
  schedulerVersion: string
  centerVersion: string
  schedule: Task[]
  todayDaily: RecordItem
  records: { daily: RecordItem[] }
  columns: Array<{ id: string; name: string; name_zh: string }>
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
type IntelligenceData = {
  currentRun: { date: string; status: Status; columns: Column[] }
}
type LegacyHistoryData = {
  records: Array<{ date: string; status: Status }>
}
type HistoryItem = { date: string; status: Status }

const runtime = runtimeData as RuntimeData
const intelligence = intelligenceData as IntelligenceData
const legacyHistory = legacyData as LegacyHistoryData
const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })
const zh = computed(() => props.lang === 'zh')
const liveRecord = ref<RecordItem | null>(null)
const record = computed(() => liveRecord.value || runtime.todayDaily)

const refreshLiveRecord = async () => {
  if (typeof window === 'undefined') return
  const [year, month] = runtime.today.split('-')
  const path = `research/runtime/records/daily/${year}/${month}/${runtime.today}-daily-runtime.json`
  const url = `https://raw.githubusercontent.com/joinwell52-AI/joinwell52/main/${path}?t=${Date.now()}`
  try {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) return
    const next = await response.json() as RecordItem
    if (next.date === runtime.today) liveRecord.value = next
  } catch {
    // Preserve the build-time projection while GitHub is temporarily unavailable.
  }
}

const RUNNING_REFRESH_MS = 60_000
const IDLE_REFRESH_MS = 300_000
let liveRefreshTimer: ReturnType<typeof setTimeout> | undefined

const scheduleLiveRefresh = () => {
  if (typeof document === 'undefined') return
  if (liveRefreshTimer) clearTimeout(liveRefreshTimer)
  if (document.hidden) {
    liveRefreshTimer = undefined
    return
  }
  const isWorking = Object.values(record.value.taskStatus || {}).includes('Running')
  const delay = isWorking ? RUNNING_REFRESH_MS : IDLE_REFRESH_MS
  liveRefreshTimer = setTimeout(async () => {
    await refreshLiveRecord()
    scheduleLiveRefresh()
  }, delay)
}

const handleVisibilityChange = () => {
  if (typeof document === 'undefined') return
  if (document.hidden) {
    if (liveRefreshTimer) clearTimeout(liveRefreshTimer)
    liveRefreshTimer = undefined
    return
  }
  void refreshLiveRecord().finally(scheduleLiveRefresh)
}

onMounted(() => {
  void refreshLiveRecord().finally(scheduleLiveRefresh)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})
onBeforeUnmount(() => {
  if (liveRefreshTimer) clearTimeout(liveRefreshTimer)
  if (typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
})
const tasks = computed(() => runtime.schedule
  .filter((task) => task.family === 'daily')
  .sort((a, b) => a.schedule.time.localeCompare(b.schedule.time)))
const columns = computed(() => intelligence.currentRun.columns || [])
const rows = computed(() => tasks.value.map((task) => ({
  task,
  status: record.value.taskStatus?.[task.id] || 'Waiting',
  result: record.value.results?.[task.id] || null
})))
const completedCount = computed(() => rows.value.filter((row) => row.status === 'Completed').length)
const progress = computed(() => rows.value.length ? Math.round(completedCount.value / rows.value.length * 100) : 0)
const risk = computed(() => rows.value.some((row) => row.status === 'Blocked' || row.status === 'Failed'))
const activeRow = computed(() => rows.value.find((row) => row.status === 'Running') || rows.value.find((row) => row.status === 'Waiting') || null)
const productionResult = computed(() => record.value.results?.production || null)
const publicationResult = computed(() => record.value.results?.publication || null)
const history = computed<HistoryItem[]>(() => {
  const current = record.value
  const currentV5History = (runtime.records?.daily || [])
    .filter((item) => item.date !== current.date && item.date >= '2026-08-05')
    .map((item) => ({ date: item.date, status: item.status }))
  const frozenMarkdownHistory = (legacyHistory.records || [])
    .filter((item) => item.date !== current.date && item.date < '2026-08-05')
    .map((item) => ({ date: item.date, status: item.status }))

  return [{ date: current.date, status: current.status }, ...currentV5History, ...frozenMarkdownHistory]
    .filter((item, index, items) => items.findIndex((candidate) => candidate.date === item.date) === index)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7)
})

const copy = computed(() => zh.value ? {
  kicker: 'RESEARCH RUNTIME CENTER V5.0 · 数字研究员运营中心',
  title: '数字工场运营中心',
  lead: '三个栏目分别选题；上午完成发现、阅读与分析，15:00 形成完整出版候选，20:00 只负责 GitHub 与网站发版。',
  badge: 'Research Runtime Scheduler V3.0',
  charter: '查看 V5.0 运行规范',
  operations: '今日运营概况',
  progress: '完成进度',
  dayStatus: '全天状态',
  current: '当前工作',
  nextTask: '下一任务',
  inProgress: '进行中',
  completed: '已完成',
  attention: '存在风险',
  waiting: '待执行',
  noMore: '今日计划已结束',
  plan: '今日三栏研究计划',
  planHint: '10:00 Queue 必须对三个栏目分别作出“已选题”或“未选题”决定。',
  selected: '已选题',
  noSelection: '未选题',
  pendingDecision: '待决定',
  decision: '选题判断',
  signals: '信号',
  candidates: '候选',
  shifts: '今日班次与工作成果',
  shiftsHint: '每个班次汇报输入、工作成果、输出、下一步与证据。',
  input: '输入',
  workResult: '工作成果',
  output: '输出',
  next: '下一步',
  metrics: '量化结果',
  evidence: '成果与证据',
  pending: '任务尚未执行；完成后自动显示工作成果。',
  working: '任务正在执行，查询与成果整理尚未完成。',
  production: '15:00 下午生产',
  productionLead: 'Skill 05 写作 → 06 配图 → 07 证据与引用 → 08 出版编辑',
  noCandidate: '尚未形成出版候选',
  release: '20:00 晚间发版',
  releaseLead: '只消费完整出版候选，更新中英文文章、索引、网站并验证 GitHub 提交。',
  noRelease: '尚未执行发布',
  verify: '运行证据',
  github: 'GitHub 验证',
  commit: '最新提交',
  record: '运行记录',
  history: '近期运营记录',
  report: '查看记录',
  principle: '数字员工不能只汇报“任务执行了”；每个班次必须交付可读、可追溯、可验证的工作成果。',
  status: { Running: '工作中', Completed: '已完成', Blocked: '已阻塞', Failed: '失败', Skipped: '已跳过', Waiting: '待执行' } as Record<Status, string>
} : {
  kicker: 'RESEARCH RUNTIME CENTER V5.0 · DIGITAL RESEARCHER OPERATIONS',
  title: 'Digital Works Operations Center',
  lead: 'The three columns make separate topic decisions; discovery, reading and analysis complete before 15:00 Production, while 20:00 performs release only.',
  badge: 'Research Runtime Scheduler V3.0',
  charter: 'Read the V5.0 Runtime Specification',
  operations: "Today's Operations",
  progress: 'Completion',
  dayStatus: 'Day Status',
  current: 'Current Work',
  nextTask: 'Next Task',
  inProgress: 'In Progress',
  completed: 'Completed',
  attention: 'Attention Required',
  waiting: 'Waiting',
  noMore: "Today's plan has ended",
  plan: "Today's Three-Column Research Plan",
  planHint: 'The 10:00 Queue shift must decide Selected or No Selection for every column.',
  selected: 'Selected',
  noSelection: 'No Selection',
  pendingDecision: 'Waiting',
  decision: 'Decision',
  signals: 'Signals',
  candidates: 'Candidates',
  shifts: "Today's Shifts and Outcomes",
  shiftsHint: 'Every shift reports input, work result, output, next action and evidence.',
  input: 'Input',
  workResult: 'Work Result',
  output: 'Output',
  next: 'Next',
  metrics: 'Metrics',
  evidence: 'Artifacts & Evidence',
  pending: 'The task has not run. Its work result will appear here after execution.',
  working: 'The task is working; retrieval and artifact preparation are still in progress.',
  production: '15:00 Production Shift',
  productionLead: 'Skill 05 Writing → 06 Visualization → 07 Evidence & Citation → 08 Publication Editing',
  noCandidate: 'No Publication Candidate yet',
  release: '20:00 Release Shift',
  releaseLead: 'Consumes complete candidates only, updates bilingual articles, indexes and website, then verifies the GitHub commit.',
  noRelease: 'Release has not run',
  verify: 'Runtime Evidence',
  github: 'GitHub Verification',
  commit: 'Latest Commit',
  record: 'Runtime Record',
  history: 'Recent Operations',
  report: 'View record',
  principle: 'A Digital Employee must not report only that a task ran; every shift must deliver readable, traceable and verifiable work results.',
  status: { Running: 'Running', Completed: 'Completed', Blocked: 'Blocked', Failed: 'Failed', Skipped: 'Skipped', Waiting: 'Waiting' } as Record<Status, string>
})

const taskName = (task: Task) => zh.value ? task.name_zh : task.name
const statusLabel = (status: Status) => copy.value.status[status]
const statusClass = (status: Status | undefined) => `s-${String(status || 'Waiting').toLowerCase()}`
const local = (value: Record<string, unknown>, field: string) => {
  const localized = value[`${field}_zh`]
  return String(zh.value && localized ? localized : value[field] || '')
}
const columnName = (column: Column) => zh.value ? column.label_zh : column.label
const columnTitle = (column: Column) => zh.value ? column.selectedTitle_zh : column.selectedTitle
const columnReason = (column: Column) => zh.value ? column.reason_zh : column.reason
const columnStatus = (column: Column) => column.decision === 'Selected'
  ? copy.value.selected
  : column.decision === 'No Selection'
    ? copy.value.noSelection
    : copy.value.pendingDecision
const columnClass = (column: Column) => column.decision === 'Selected'
  ? 's-running'
  : column.decision === 'No Selection'
    ? 's-skipped'
    : 's-waiting'
const dayState = computed(() => {
  if (completedCount.value === rows.value.length && rows.value.length) return copy.value.completed
  if (risk.value) return copy.value.attention
  return copy.value.inProgress
})
const recordPath = (item: { date: string }) => {
  const [year, month] = item.date.split('-')
  return `research/runtime/${year}/${month}/${item.date}-runtime.md`
}
const recordUrl = (item: { date: string }) => `https://github.com/joinwell52-AI/joinwell52/blob/main/${recordPath(item)}`
const artifactHref = (artifact: Artifact) => artifact.url || (artifact.path
  ? `https://github.com/joinwell52-AI/joinwell52/blob/main/${artifact.path}`
  : artifact.commit
    ? `https://github.com/joinwell52-AI/joinwell52/commit/${artifact.commit}`
    : '#')
const evidenceHref = (item: Evidence) => /^https?:\/\//.test(item.source)
  ? item.source
  : `https://github.com/joinwell52-AI/joinwell52/blob/main/${item.source}`
const currentTime = computed(() => activeRow.value?.task.schedule.time || '—')
const currentName = computed(() => activeRow.value ? taskName(activeRow.value.task) : copy.value.noMore)
const shortCommit = computed(() => record.value.githubCommit && record.value.githubCommit !== 'pending'
  ? record.value.githubCommit.slice(0, 10)
  : copy.value.waiting)
</script>

<template>
  <main class="runtime-classic">
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

      <section class="panel overview">
        <div class="section-title">
          <div><span>01</span><h2>{{ copy.operations }}</h2></div>
          <small>{{ runtime.today }} · {{ runtime.timezone }}</small>
        </div>
        <div class="overview-grid">
          <article class="progress-card">
            <span>{{ copy.progress }}</span>
            <strong>{{ completedCount }} <i>/ {{ rows.length }}</i></strong>
            <div class="progress-bar"><i :style="{ width: `${progress}%` }"></i></div>
            <small>{{ progress }}%</small>
          </article>
          <article>
            <span>{{ copy.dayStatus }}</span>
            <strong :class="risk ? 's-failed' : completedCount === rows.length && rows.length ? 's-completed' : 's-running'">{{ dayState }}</strong>
            <small>{{ statusLabel(record.status) }}</small>
          </article>
          <article>
            <span>{{ copy.current }}</span>
            <strong>{{ currentName }}</strong>
            <small>{{ activeRow ? statusLabel(activeRow.status) : copy.noMore }}</small>
          </article>
          <article>
            <span>{{ copy.nextTask }}</span>
            <strong>{{ currentTime }}</strong>
            <small>{{ currentName }}</small>
          </article>
        </div>
      </section>

      <section class="panel plan-panel">
        <div class="section-title">
          <div><span>02</span><h2>{{ copy.plan }}</h2></div>
          <small>{{ copy.planHint }}</small>
        </div>
        <div class="column-grid">
          <article v-for="column in columns" :key="column.id" :class="['column-card', `column-${column.id}`]">
            <div class="column-head">
              <div><span>{{ column.id.replaceAll('-', ' ').toUpperCase() }}</span><h3>{{ columnName(column) }}</h3></div>
              <b :class="columnClass(column)">{{ columnStatus(column) }}</b>
            </div>
            <div class="topic">
              <small v-if="column.selectedItemId">{{ column.selectedItemId }}</small>
              <h4>{{ column.decision === 'Selected' ? columnTitle(column) : columnReason(column) }}</h4>
            </div>
            <dl>
              <div><dt>{{ copy.decision }}</dt><dd>{{ columnReason(column) }}</dd></div>
            </dl>
            <div class="mini-metrics">
              <span><strong>{{ column.signals }}</strong>{{ copy.signals }}</span>
              <span><strong>{{ column.candidates }}</strong>{{ copy.candidates }}</span>
            </div>
          </article>
        </div>
      </section>

      <section class="panel shifts-panel">
        <div class="section-title">
          <div><span>03</span><h2>{{ copy.shifts }}</h2></div>
          <small>{{ copy.shiftsHint }}</small>
        </div>
        <div class="shift-list">
          <article v-for="row in rows" :key="row.task.id" class="shift-card">
            <div class="shift-head">
              <div><time>{{ row.task.schedule.time }}</time><h3>{{ taskName(row.task) }}</h3></div>
              <b :class="statusClass(row.status)">{{ statusLabel(row.status) }}</b>
            </div>
            <template v-if="row.result">
              <div class="result-grid">
                <div><span>{{ copy.input }}</span><p>{{ local(row.result as unknown as Record<string, unknown>, 'input') }}</p></div>
                <div class="outcome"><span>{{ copy.workResult }}</span><p>{{ local(row.result as unknown as Record<string, unknown>, 'workResult') }}</p></div>
                <div><span>{{ copy.output }}</span><p>{{ local(row.result as unknown as Record<string, unknown>, 'output') }}</p></div>
                <div><span>{{ copy.next }}</span><p>{{ local(row.result as unknown as Record<string, unknown>, 'next') }}</p></div>
              </div>
              <div v-if="row.result.metrics.length" class="metric-grid">
                <div v-for="metric in row.result.metrics" :key="`${row.task.id}-${metric.label}`">
                  <strong>{{ metric.value }}</strong><span>{{ zh ? metric.label_zh : metric.label }}</span>
                </div>
              </div>
              <div v-if="row.result.artifacts.length || row.result.evidence.length" class="artifact-list">
                <a v-for="artifact in row.result.artifacts" :key="artifact.label" :href="artifactHref(artifact)">{{ zh ? artifact.label_zh : artifact.label }} ↗</a>
                <a v-for="item in row.result.evidence" :key="item.label" :href="evidenceHref(item)">{{ zh ? item.label_zh : item.label }} ↗</a>
              </div>
            </template>
            <p v-else class="pending">{{ row.status === 'Running' ? copy.working : copy.pending }}</p>
          </article>
        </div>
      </section>

      <section class="production-release">
        <article class="panel production-card">
          <div class="section-title">
            <div><span>04</span><h2>{{ copy.production }}</h2></div>
            <b :class="statusClass(record.taskStatus?.production)">{{ statusLabel(record.taskStatus?.production || 'Waiting') }}</b>
          </div>
          <p class="section-lead">{{ copy.productionLead }}</p>
          <div v-if="productionResult" class="release-result">
            <strong>{{ local(productionResult as unknown as Record<string, unknown>, 'workResult') }}</strong>
            <p>{{ local(productionResult as unknown as Record<string, unknown>, productionResult.status === 'Skipped' ? 'reason' : 'output') }}</p>
            <a v-for="artifact in productionResult.artifacts" :key="artifact.label" :href="artifactHref(artifact)">{{ zh ? artifact.label_zh : artifact.label }} ↗</a>
          </div>
          <div v-else class="empty-state"><strong>{{ record.taskStatus?.production === 'Running' ? copy.working : copy.noCandidate }}</strong><p>{{ copy.productionLead }}</p></div>
        </article>

        <article class="panel release-card">
          <div class="section-title">
            <div><span>05</span><h2>{{ copy.release }}</h2></div>
            <b :class="statusClass(record.taskStatus?.publication)">{{ statusLabel(record.taskStatus?.publication || 'Waiting') }}</b>
          </div>
          <p class="section-lead">{{ copy.releaseLead }}</p>
          <div v-if="publicationResult" class="release-result">
            <strong>{{ local(publicationResult as unknown as Record<string, unknown>, 'workResult') }}</strong>
            <p>{{ local(publicationResult as unknown as Record<string, unknown>, publicationResult.status === 'Skipped' ? 'reason' : 'output') }}</p>
            <a v-for="artifact in publicationResult.artifacts" :key="artifact.label" :href="artifactHref(artifact)">{{ zh ? artifact.label_zh : artifact.label }} ↗</a>
          </div>
          <div v-else class="empty-state"><strong>{{ record.taskStatus?.publication === 'Running' ? copy.working : copy.noRelease }}</strong><p>{{ copy.releaseLead }}</p></div>
        </article>
      </section>

      <section class="panel evidence-panel">
        <div class="section-title"><div><span>06</span><h2>{{ copy.verify }}</h2></div></div>
        <div class="evidence-grid">
          <article><span>{{ copy.github }}</span><strong :class="statusClass(record.commitVerify)">{{ statusLabel(record.commitVerify) }}</strong></article>
          <article><span>{{ copy.commit }}</span><strong>{{ shortCommit }}</strong></article>
          <article><span>{{ copy.record }}</span><a :href="recordUrl(record)">{{ copy.report }} ↗</a></article>
        </div>
      </section>

      <section class="panel history-panel">
        <div class="section-title"><div><span>07</span><h2>{{ copy.history }}</h2></div></div>
        <div v-if="history.length" class="history-list">
          <a v-for="item in history" :key="item.date" :href="recordUrl(item)">
            <strong>{{ item.date }}</strong><b :class="statusClass(item.status)">{{ statusLabel(item.status) }}</b><span>{{ copy.report }} ↗</span>
          </a>
        </div>
        <div v-else class="empty-state"><strong>{{ runtime.today }}</strong><p>{{ copy.pending }}</p></div>
      </section>

      <p class="principle">{{ copy.principle }}</p>
    </div>
  </main>
</template>

