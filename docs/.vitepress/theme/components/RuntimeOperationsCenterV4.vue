<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import runtimeData from '../../generated/runtime-records.json'

type Status = 'Running' | 'Completed' | 'Blocked' | 'Failed' | 'Skipped' | 'Waiting'
type Task = {
  id: string
  name: string
  introduced: string
  time: string
  kind: 'daily' | 'weekly'
  days: string[]
  responsibility: string
  output: string
  prohibitions: string[]
  skillsRequired: boolean
  skills: string[]
}
type Metric = { label: string; label_zh: string; value: string }
type Artifact = {
  label: string
  label_zh: string
  path?: string
  commit?: string
  url?: string
  column?: string
}
type TaskResult = {
  task: string
  status: Status
  input: string
  input_zh: string
  summary: string
  summary_zh: string
  output: string
  output_zh: string
  next: string
  next_zh: string
  reason?: string
  reason_zh?: string
  metrics: Metric[]
  artifacts: Artifact[]
}
type Log = { time: string; runtime: string; event: string; status: Status; detail: string }
type RecordItem = {
  path: string
  date: string
  status: Status
  latestTask: string
  repository: string
  commit: string
  githubStatus: Status
  commitVerify: Status
  publicationStatus: Status
  tasks: Record<string, Status>
  results?: Record<string, TaskResult>
  log: Log[]
}
type ColumnPlanItem = {
  id: string
  label: string
  label_zh: string
  selectionStatus: 'Waiting' | 'Selected' | 'Researching' | 'No Selection' | 'Publication Candidate' | 'Released'
  itemId: string
  title: string
  title_zh: string
  priority: string
  lifecycle: string
  source: string
  source_zh: string
  reason: string
  reason_zh: string
  next: string
  next_zh: string
}
type DailyPlan = {
  schema: string
  date: string
  timezone: string
  status: Status
  sourceTask: string
  sourceRecord: string
  updatedAt: string
  githubCommit: string
  columns: ColumnPlanItem[]
}
type Candidate = {
  column: string
  itemId: string
  title: string
  title_zh: string
  zhPath: string
  enPath: string
  coverPath?: string
  lifecycle: string
  evidenceStatus: string
  editingStatus: string
}
type CandidateBatch = {
  schema: string
  date: string
  timezone: string
  status: Status
  sourceTask: string
  sourceRecord: string
  updatedAt: string
  githubCommit: string
  reason: string
  reason_zh: string
  candidates: Candidate[]
}
type Data = {
  today: string
  timezone: string
  schedulerVersion: string
  centerVersion: string
  operationsCenterVersion: string
  columns: Array<{ id: string; name: string; name_zh: string; description: string; description_zh: string }>
  schedule: Task[]
  todayTasks: string[]
  records: RecordItem[]
  dailyPlan: DailyPlan
  publicationCandidates: CandidateBatch
  plans?: Record<string, DailyPlan>
  candidateBatches?: Record<string, CandidateBatch>
}

const data = runtimeData as Data
const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })
const zh = computed(() => props.lang === 'zh')
const currentRecord = computed(() => data.records.find((record) => record.date === data.today) || null)
const todayTasks = computed(() => data.schedule
  .filter((task) => data.todayTasks.includes(task.id))
  .sort((a, b) => a.time.localeCompare(b.time)))

const text = computed(() => zh.value ? {
  kicker: 'RESEARCH RUNTIME CENTER V4 · 数字研究员运营中心',
  title: '今天研究什么，下午生产什么，晚上发布什么。',
  lead: '三个栏目分别做选题；09:00–11:00 完成研究推进，15:00 形成完整出版候选，20:00 只负责 GitHub 与网站发版。',
  badge: 'Research Runtime Scheduler V2.0',
  charter: '查看 V4 运行规范',
  plan: '今日三栏研究计划',
  planHint: '10:00 队列任务必须对三个栏目分别作出“选题”或“未选题”决定。',
  selected: '已选题',
  researching: '研究中',
  noSelection: '未选题',
  waiting: '待决定',
  candidate: '出版候选',
  released: '已发布',
  why: '选题判断',
  source: '主要来源',
  next: '下一步',
  shifts: '今日班次与工作成果',
  shiftsHint: '每个定时任务汇报输入、成果、输出、下一步与证据。',
  input: '输入',
  result: '工作成果',
  output: '输出',
  metrics: '量化结果',
  evidence: '成果与证据',
  pending: '任务尚未执行；完成后自动显示工作成果。',
  missing: '任务已结束，但缺少结构化成果汇报。',
  production: '15:00 下午生产',
  productionLead: 'Skill 05 写作 → 06 配图 → 07 证据与引用 → 08 出版编辑',
  publicationCandidate: '完整出版候选',
  noCandidate: '尚未形成出版候选',
  release: '20:00 晚间发版',
  releaseLead: '只消费完整出版候选，更新中英文文章、索引、网站并验证 GitHub 提交。',
  noRelease: '尚未执行发布',
  operations: '今日运营概况',
  progress: '完成进度',
  dayStatus: '全天状态',
  current: '当前工作',
  nextTask: '下一任务',
  inProgress: '进行中',
  completed: '已完成',
  endedIncomplete: '当日已结束（未全部完成）',
  risk: '存在风险',
  noPlan: '今日没有计划任务',
  noMore: '今日计划已结束',
  verify: '运行证据',
  github: 'GitHub 验证',
  commit: '最新提交',
  runtimeRecord: '运行记录',
  planFile: '三栏计划',
  candidateFile: '出版候选批次',
  verified: '已提交并校验',
  pendingCommit: '等待提交',
  log: '工作日志',
  history: '近期运营记录',
  report: '查看记录',
  principle: '数字员工不能只汇报“任务执行了”；每个班次必须交付可读、可追溯、可验证的工作成果。'
} : {
  kicker: 'RESEARCH RUNTIME CENTER V4 · DIGITAL RESEARCHER OPERATIONS',
  title: 'What is researched today, produced at 15:00, and released at 20:00.',
  lead: 'The three columns make separate topic decisions; morning shifts advance research, the 15:00 shift creates complete Publication Candidates, and 20:00 performs release only.',
  badge: 'Research Runtime Scheduler V2.0',
  charter: 'Read the V4 Runtime Specification',
  plan: "Today's Three-Column Research Plan",
  planHint: 'The 10:00 Queue shift must decide Selected or No Selection for every column.',
  selected: 'Selected',
  researching: 'Researching',
  noSelection: 'No Selection',
  waiting: 'Waiting',
  candidate: 'Publication Candidate',
  released: 'Released',
  why: 'Decision',
  source: 'Primary source',
  next: 'Next',
  shifts: "Today's Shifts and Outcomes",
  shiftsHint: 'Every scheduled task reports input, outcome, output, next action, and evidence.',
  input: 'Input',
  result: 'Work Outcome',
  output: 'Output',
  metrics: 'Metrics',
  evidence: 'Artifacts & Evidence',
  pending: 'The task has not run. Its work outcome will appear here after execution.',
  missing: 'The task ended without a structured work-outcome report.',
  production: '15:00 Production Shift',
  productionLead: 'Skill 05 Writing → 06 Visualization → 07 Evidence & Citation → 08 Publication Editing',
  publicationCandidate: 'Complete Publication Candidate',
  noCandidate: 'No Publication Candidate yet',
  release: '20:00 Release Shift',
  releaseLead: 'Consumes complete candidates only, updates bilingual articles, indexes and website, then verifies the GitHub commit.',
  noRelease: 'Release has not run',
  operations: "Today's Operations",
  progress: 'Completion',
  dayStatus: 'Day Status',
  current: 'Current Work',
  nextTask: 'Next Task',
  inProgress: 'In Progress',
  completed: 'Completed',
  endedIncomplete: 'Day Ended — Incomplete',
  risk: 'Attention Required',
  noPlan: 'No tasks scheduled today',
  noMore: "Today's plan has ended",
  verify: 'Runtime Evidence',
  github: 'GitHub Verification',
  commit: 'Latest Commit',
  runtimeRecord: 'Runtime Record',
  planFile: 'Column Plan',
  candidateFile: 'Candidate Batch',
  verified: 'Committed and verified',
  pendingCommit: 'Commit pending',
  log: 'Work Log',
  history: 'Recent Operations',
  report: 'View record',
  principle: 'A Digital Employee must not report only that a task ran; every shift must deliver readable, traceable, and verifiable work outcomes.'
})

const taskCopy: Record<string, { zh: string; en: string }> = {
  engine: { zh: '09:00 研究运行引擎', en: '09:00 Research Runtime Engine' },
  queue: { zh: '10:00 研究运行队列', en: '10:00 Research Runtime Queue' },
  knowledge: { zh: '11:00 研究运行知识', en: '11:00 Research Runtime Knowledge' },
  architecture: { zh: '12:00 研究运行架构评审', en: '12:00 Research Runtime Architecture' },
  production: { zh: '15:00 研究运行生产', en: '15:00 Research Runtime Production' },
  publication: { zh: '20:00 研究运行发布', en: '20:00 Research Runtime Publication' },
  weekly: { zh: '20:30 研究运行每周综合', en: '20:30 Research Runtime Weekly' },
  academic: { zh: '10:00 研究运行学术研究', en: '10:00 Research Runtime Academic' }
}

const statusLabel = (status: Status) => zh.value
  ? ({ Running: '运行中', Completed: '已完成', Blocked: '已阻塞', Failed: '失败', Skipped: '已跳过', Waiting: '待执行' } as Record<Status, string>)[status]
  : status
const statusClass = (status?: string) => `s-${String(status || 'Waiting').toLowerCase()}`
const taskName = (task: Task) => zh.value ? taskCopy[task.id]?.zh || task.name : taskCopy[task.id]?.en || task.name
const resultText = (result: TaskResult, field: 'input' | 'summary' | 'output' | 'next' | 'reason') => {
  const values = result as unknown as Record<string, string>
  return zh.value && values[`${field}_zh`] ? values[`${field}_zh`] : values[field] || ''
}
const metricLabel = (metric: Metric) => zh.value ? metric.label_zh : metric.label
const artifactLabel = (artifact: Artifact) => zh.value ? artifact.label_zh : artifact.label
const planText = (item: ColumnPlanItem, field: 'label' | 'title' | 'source' | 'reason' | 'next') => {
  const values = item as unknown as Record<string, string>
  return zh.value && values[`${field}_zh`] ? values[`${field}_zh`] : values[field] || ''
}
const candidateText = (item: Candidate, field: 'title') => {
  const values = item as unknown as Record<string, string>
  return zh.value && values[`${field}_zh`] ? values[`${field}_zh`] : values[field]
}
const planStatusLabel = (status: ColumnPlanItem['selectionStatus']) => {
  const labels = {
    Waiting: text.value.waiting,
    Selected: text.value.selected,
    Researching: text.value.researching,
    'No Selection': text.value.noSelection,
    'Publication Candidate': text.value.candidate,
    Released: text.value.released
  }
  return labels[status]
}
const planStatusClass = (status: ColumnPlanItem['selectionStatus']) => {
  if (status === 'No Selection') return 's-skipped'
  if (status === 'Released') return 's-completed'
  if (status === 'Publication Candidate') return 's-running'
  if (status === 'Selected' || status === 'Researching') return 's-running'
  return 's-waiting'
}

const hasLog = (task: Task, record = currentRecord.value) => Boolean(record?.log?.some((entry) => entry.runtime === task.name))
const taskResult = (task: Task, record = currentRecord.value) => record?.results?.[task.id] || null
const taskStatus = (task: Task, record = currentRecord.value): Status => {
  const result = taskResult(task, record)
  if (result) return result.status
  const raw = record?.tasks?.[task.id] || 'Waiting'
  if (raw === 'Skipped' && !hasLog(task, record)) return 'Waiting'
  return raw
}
const taskRows = computed(() => todayTasks.value.map((task) => ({
  task,
  status: taskStatus(task),
  result: taskResult(task)
})))
const completedCount = computed(() => taskRows.value.filter((row) => row.status === 'Completed').length)
const totalCount = computed(() => taskRows.value.length)
const progress = computed(() => totalCount.value ? Math.round(completedCount.value / totalCount.value * 100) : 0)
const hasRisk = computed(() => taskRows.value.some((row) => ['Blocked', 'Failed'].includes(row.status)))
const allTerminal = computed(() => taskRows.value.length > 0 && taskRows.value.every((row) => ['Completed', 'Skipped', 'Blocked', 'Failed'].includes(row.status)))
const dayState = computed(() => {
  if (!totalCount.value) return text.value.noPlan
  if (completedCount.value === totalCount.value) return text.value.completed
  if (allTerminal.value) return text.value.endedIncomplete
  if (hasRisk.value) return text.value.risk
  return text.value.inProgress
})
const runningRow = computed(() => taskRows.value.find((row) => row.status === 'Running') || null)
const nextRow = computed(() => runningRow.value || taskRows.value.find((row) => row.status === 'Waiting') || null)
const currentState = computed(() => {
  if (runningRow.value) return taskName(runningRow.value.task)
  if (nextRow.value) return `${nextRow.value.task.time} · ${taskName(nextRow.value.task).replace(/^\d{2}:\d{2}\s*/, '')}`
  return totalCount.value ? text.value.noMore : text.value.noPlan
})

const productionTask = computed(() => data.schedule.find((task) => task.id === 'production') || null)
const publicationTask = computed(() => data.schedule.find((task) => task.id === 'publication') || null)
const productionStatus = computed<Status>(() => productionTask.value ? taskStatus(productionTask.value) : data.publicationCandidates.status)
const publicationStatus = computed<Status>(() => publicationTask.value ? taskStatus(publicationTask.value) : 'Waiting')
const publicationResult = computed(() => publicationTask.value ? taskResult(publicationTask.value) : null)

const recordUrl = (record: RecordItem) => `https://github.com/${record.repository}/blob/main/${record.path}`
const repoPathUrl = (path: string, record = currentRecord.value) => record
  ? `https://github.com/${record.repository}/blob/main/${path}`
  : '#'
const commitUrl = (sha: string, record = currentRecord.value) => record && sha && sha !== 'pending'
  ? `https://github.com/${record.repository}/commit/${sha}`
  : '#'
const artifactHref = (artifact: Artifact) => {
  if (artifact.url) return artifact.url
  if (artifact.path) return repoPathUrl(artifact.path)
  if (artifact.commit) return commitUrl(artifact.commit)
  return '#'
}

const eventMap: Record<string, string> = {
  'Runtime Started': '运行开始',
  'Runtime Scheduled': '任务已调度',
  'Lifecycle Transition': '生命周期转换',
  'Official Source Discovery': '官方来源发现',
  'Candidate Scoring': '候选评分',
  'Selection Decision': '三栏选题决定',
  'Evidence Admission': '证据准入',
  'Candidate Review': '候选复核',
  'Production Started': '生产开始',
  'Publication Candidate Created': '出版候选已生成',
  'Publication Eligibility': '发布资格检查',
  'Commit Verify': '提交验证'
}
const localEvent = (entry: Log) => zh.value ? eventMap[entry.event] || entry.event : entry.event
const localRuntime = (entry: Log) => {
  const task = data.schedule.find((item) => item.name === entry.runtime)
  return task ? taskName(task) : entry.runtime
}
const logs = computed(() => (currentRecord.value?.log || []).slice(-12))

function scheduledFor(record: RecordItem) {
  const day = new Intl.DateTimeFormat('en-US', { timeZone: data.timezone, weekday: 'long' })
    .format(new Date(`${record.date}T04:00:00.000Z`))
  return data.schedule.filter((task) =>
    task.introduced <= record.date &&
    (task.kind === 'daily' || task.days.includes(day))
  )
}
const historyRows = computed(() => data.records.slice(0, 7).map((record) => {
  const scheduled = scheduledFor(record)
  const completed = scheduled.filter((task) => taskStatus(task, record) === 'Completed').length
  const production = record.results?.production
  const publication = record.results?.publication
  return {
    record,
    completed,
    total: scheduled.length,
    production: production ? resultText(production, production.status === 'Skipped' ? 'reason' : 'summary') : text.value.noCandidate,
    publication: publication ? resultText(publication, publication.status === 'Skipped' ? 'reason' : 'summary') : text.value.noRelease
  }
}))

const v4Path = computed(() => zh.value
  ? '/zh/publications/research-runtime-center-v4'
  : '/en/publications/research-runtime-center-v4')
</script>

<template>
  <main class="runtime-v4">
    <div class="shell">
      <header class="hero">
        <div>
          <span class="kicker">{{ text.kicker }}</span>
          <h1>{{ text.title }}</h1>
          <p>{{ text.lead }}</p>
        </div>
        <div class="hero-actions">
          <b>{{ text.badge }}</b>
          <a :href="withBase(v4Path)">{{ text.charter }} →</a>
        </div>
      </header>

      <section class="panel overview">
        <div class="section-title">
          <div><span>01</span><h2>{{ text.operations }}</h2></div>
          <small>{{ data.today }} · {{ data.timezone }}</small>
        </div>
        <div class="overview-grid">
          <article class="progress-card">
            <span>{{ text.progress }}</span>
            <strong>{{ completedCount }} <i>/ {{ totalCount }}</i></strong>
            <div class="progress-bar"><i :style="{ width: `${progress}%` }"></i></div>
            <small>{{ progress }}%</small>
          </article>
          <article>
            <span>{{ text.dayStatus }}</span>
            <strong :class="hasRisk ? 's-failed' : completedCount === totalCount && totalCount ? 's-completed' : 's-running'">{{ dayState }}</strong>
            <small>{{ currentState }}</small>
          </article>
          <article>
            <span>{{ text.current }}</span>
            <strong>{{ runningRow ? taskName(runningRow.task) : (nextRow ? text.waiting : text.noMore) }}</strong>
            <small>{{ currentState }}</small>
          </article>
          <article>
            <span>{{ text.nextTask }}</span>
            <strong>{{ nextRow ? nextRow.task.time : '—' }}</strong>
            <small>{{ nextRow ? taskName(nextRow.task).replace(/^\d{2}:\d{2}\s*/, '') : text.noMore }}</small>
          </article>
        </div>
      </section>

      <section class="panel plan-panel">
        <div class="section-title">
          <div><span>02</span><h2>{{ text.plan }}</h2></div>
          <small>{{ text.planHint }}</small>
        </div>
        <div class="column-grid">
          <article
            v-for="item in data.dailyPlan.columns"
            :key="item.id"
            :class="['column-card', `column-${item.id}`]"
          >
            <div class="column-head">
              <div>
                <span>{{ item.id.replaceAll('-', ' ').toUpperCase() }}</span>
                <h3>{{ planText(item, 'label') }}</h3>
              </div>
              <b :class="planStatusClass(item.selectionStatus)">{{ planStatusLabel(item.selectionStatus) }}</b>
            </div>
            <div class="topic">
              <small v-if="item.itemId">{{ item.itemId }} · {{ item.priority }} · {{ item.lifecycle }}</small>
              <h4>{{ planText(item, 'title') }}</h4>
            </div>
            <dl>
              <div>
                <dt>{{ text.why }}</dt>
                <dd>{{ planText(item, 'reason') }}</dd>
              </div>
              <div v-if="planText(item, 'source')">
                <dt>{{ text.source }}</dt>
                <dd>{{ planText(item, 'source') }}</dd>
              </div>
              <div>
                <dt>{{ text.next }}</dt>
                <dd>{{ planText(item, 'next') }}</dd>
              </div>
            </dl>
          </article>
        </div>
      </section>

      <section class="panel shifts-panel">
        <div class="section-title">
          <div><span>03</span><h2>{{ text.shifts }}</h2></div>
          <small>{{ text.shiftsHint }}</small>
        </div>
        <div class="shift-list">
          <article v-for="row in taskRows" :key="row.task.id" class="shift-card">
            <div class="shift-head">
              <div>
                <time>{{ row.task.time }}</time>
                <h3>{{ taskName(row.task).replace(/^\d{2}:\d{2}\s*/, '') }}</h3>
              </div>
              <b :class="statusClass(row.status)">{{ statusLabel(row.status) }}</b>
            </div>

            <template v-if="row.result">
              <div class="result-grid">
                <div><span>{{ text.input }}</span><p>{{ resultText(row.result, 'input') }}</p></div>
                <div class="outcome"><span>{{ text.result }}</span><p>{{ resultText(row.result, 'summary') }}</p></div>
                <div><span>{{ text.output }}</span><p>{{ resultText(row.result, 'output') }}</p></div>
                <div><span>{{ text.next }}</span><p>{{ resultText(row.result, 'next') }}</p></div>
              </div>
              <div v-if="row.result.metrics.length" class="metric-grid">
                <div v-for="metric in row.result.metrics" :key="`${row.task.id}-${metric.label}`">
                  <strong>{{ metric.value }}</strong><span>{{ metricLabel(metric) }}</span>
                </div>
              </div>
              <div v-if="row.result.artifacts.length" class="artifact-list">
                <a v-for="artifact in row.result.artifacts" :key="`${row.task.id}-${artifact.label}`" :href="artifactHref(artifact)">
                  <span>{{ artifactLabel(artifact) }}</span><b>↗</b>
                </a>
              </div>
            </template>
            <p v-else-if="row.status === 'Waiting' || row.status === 'Running'" class="pending">{{ text.pending }}</p>
            <p v-else class="missing">{{ text.missing }}</p>
          </article>
        </div>
      </section>

      <section class="production-release">
        <article class="panel production-card">
          <div class="section-title">
            <div><span>04</span><h2>{{ text.production }}</h2></div>
            <b :class="statusClass(productionStatus)">{{ statusLabel(productionStatus) }}</b>
          </div>
          <p class="section-lead">{{ text.productionLead }}</p>
          <div v-if="data.publicationCandidates.candidates.length" class="candidate-list">
            <article v-for="candidate in data.publicationCandidates.candidates" :key="candidate.itemId">
              <small>{{ candidate.column }} · {{ candidate.itemId }}</small>
              <h3>{{ candidateText(candidate, 'title') }}</h3>
              <span>{{ text.publicationCandidate }}</span>
              <div>
                <a :href="repoPathUrl(candidate.zhPath)">中文 ↗</a>
                <a :href="repoPathUrl(candidate.enPath)">English ↗</a>
              </div>
            </article>
          </div>
          <div v-else class="empty-state">
            <strong>{{ text.noCandidate }}</strong>
            <p>{{ zh ? data.publicationCandidates.reason_zh : data.publicationCandidates.reason }}</p>
          </div>
        </article>

        <article class="panel release-card">
          <div class="section-title">
            <div><span>05</span><h2>{{ text.release }}</h2></div>
            <b :class="statusClass(publicationStatus)">{{ statusLabel(publicationStatus) }}</b>
          </div>
          <p class="section-lead">{{ text.releaseLead }}</p>
          <template v-if="publicationResult">
            <div class="release-result">
              <strong>{{ resultText(publicationResult, 'summary') }}</strong>
              <p>{{ resultText(publicationResult, publicationResult.status === 'Skipped' ? 'reason' : 'output') }}</p>
              <a v-for="artifact in publicationResult.artifacts" :key="artifact.label" :href="artifactHref(artifact)">
                {{ artifactLabel(artifact) }} ↗
              </a>
            </div>
          </template>
          <div v-else class="empty-state">
            <strong>{{ text.noRelease }}</strong>
            <p>{{ text.releaseLead }}</p>
          </div>
        </article>
      </section>

      <div class="evidence-log">
        <aside class="panel evidence-panel">
          <div class="section-title"><div><span>06</span><h2>{{ text.verify }}</h2></div></div>
          <dl>
            <div>
              <dt>{{ text.github }}</dt>
              <dd :class="statusClass(currentRecord?.commitVerify)">{{ currentRecord?.commitVerify === 'Completed' ? text.verified : text.pendingCommit }}</dd>
            </div>
            <div>
              <dt>{{ text.commit }}</dt>
              <dd><a v-if="currentRecord?.commit && currentRecord.commit !== 'pending'" :href="commitUrl(currentRecord.commit)">{{ currentRecord.commit.slice(0, 10) }} ↗</a><span v-else>{{ text.pendingCommit }}</span></dd>
            </div>
            <div>
              <dt>{{ text.runtimeRecord }}</dt>
              <dd><a v-if="currentRecord" :href="recordUrl(currentRecord)">{{ currentRecord.date }} ↗</a><span v-else>—</span></dd>
            </div>
            <div>
              <dt>{{ text.planFile }}</dt>
              <dd><a :href="repoPathUrl(`research/runtime/plans/${data.today.slice(0,4)}/${data.today.slice(5,7)}/${data.today}-plan.json`)">{{ data.dailyPlan.schema }} ↗</a></dd>
            </div>
            <div>
              <dt>{{ text.candidateFile }}</dt>
              <dd><a :href="repoPathUrl(`research/runtime/candidates/${data.today.slice(0,4)}/${data.today.slice(5,7)}/${data.today}-candidates.json`)">{{ data.publicationCandidates.schema }} ↗</a></dd>
            </div>
          </dl>
        </aside>

        <section class="panel log-panel">
          <div class="section-title"><div><span>07</span><h2>{{ text.log }}</h2></div><small>{{ data.today }}</small></div>
          <ol v-if="logs.length">
            <li v-for="(entry, index) in logs" :key="`${entry.time}-${index}`">
              <time>{{ entry.time }}</time><i></i>
              <div><strong>{{ localEvent(entry) }}</strong><span>{{ localRuntime(entry) }}</span></div>
              <b :class="statusClass(entry.status)">{{ statusLabel(entry.status) }}</b>
            </li>
          </ol>
          <p v-else class="pending">{{ text.pending }}</p>
        </section>
      </div>

      <section class="panel history-panel">
        <div class="section-title"><div><span>08</span><h2>{{ text.history }}</h2></div></div>
        <div class="history-list">
          <article v-for="row in historyRows" :key="row.record.path">
            <time>{{ row.record.date }}</time>
            <div><strong>{{ row.completed }}/{{ row.total }}</strong><span>{{ text.completed }}</span></div>
            <div><small>{{ text.production }}</small><p>{{ row.production }}</p></div>
            <div><small>{{ text.release }}</small><p>{{ row.publication }}</p></div>
            <a :href="recordUrl(row.record)">{{ text.report }} ↗</a>
          </article>
        </div>
      </section>

      <blockquote>{{ text.principle }}</blockquote>
    </div>
  </main>
</template>

<style scoped>
.runtime-v4{--bg:#070914;--panel:#10162a;--panel2:#0b1121;--line:rgba(148,163,184,.2);--text:#f5f7ff;--muted:#94a0b7;--accent:#8f80ff;--blue:#72d6ff;--green:#77e5a7;--amber:#f8c56a;position:relative;width:100vw;margin-left:calc(50% - 50vw);color:var(--text);background:radial-gradient(circle at 80% 0,rgba(105,86,255,.2),transparent 30%),linear-gradient(180deg,#080b18,#060812);border-block:1px solid var(--line)}
.shell{width:min(1280px,calc(100% - 52px));margin:auto;padding:68px 0 80px}.hero{display:flex;justify-content:space-between;align-items:flex-end;gap:48px;margin-bottom:22px}.kicker{display:block;margin-bottom:15px;color:#bdb5ff;font:750 11px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.hero h1{max-width:920px;margin:0;font-size:clamp(42px,5.6vw,76px);line-height:.98;letter-spacing:-.055em}.hero p{max-width:820px;margin:22px 0 0;color:#b6c0d2;font-size:17px;line-height:1.75}.hero-actions{display:flex;flex-direction:column;align-items:flex-end;gap:12px}.hero-actions b{padding:8px 12px;color:var(--green);background:rgba(34,197,94,.08);border:1px solid rgba(74,222,128,.22);border-radius:999px;font:750 11px/1 ui-monospace,monospace}.runtime-v4 a{color:#cbc6ff;text-decoration:none;font-weight:720}
.panel{padding:26px;background:linear-gradient(145deg,rgba(18,25,46,.98),rgba(8,12,26,.97));border:1px solid var(--line);border-radius:20px;box-shadow:0 24px 72px rgba(0,0,0,.18)}.panel+.panel,.plan-panel,.shifts-panel,.history-panel{margin-top:16px}.section-title{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:22px}.section-title>div{display:flex;align-items:center;gap:12px}.section-title>div>span{color:var(--accent);font:750 10px/1 ui-monospace,monospace}.section-title h2{margin:0;font-size:21px;letter-spacing:-.025em}.section-title>small{max-width:560px;color:#7f8ca2;text-align:right}.section-title>b,.shift-head>b,.column-head>b{padding:7px 10px;border:1px solid currentColor;border-radius:999px;font:750 10px/1 ui-monospace,monospace;white-space:nowrap}.s-running{color:var(--blue)!important}.s-completed{color:var(--green)!important}.s-blocked{color:var(--amber)!important}.s-failed{color:#fca5a5!important}.s-skipped{color:#a2acbd!important}.s-waiting{color:#c4b5fd!important}
.overview-grid{display:grid;grid-template-columns:1.15fr repeat(3,1fr);gap:12px}.overview-grid article{min-height:140px;padding:20px;background:rgba(5,9,21,.6);border:1px solid var(--line);border-radius:16px}.overview-grid article>span{display:block;color:var(--muted);font-size:11px}.overview-grid article>strong{display:block;margin:18px 0 11px;font-size:21px;line-height:1.25}.overview-grid article>small{color:#8491a7;line-height:1.5}.progress-card strong{font-size:42px!important;letter-spacing:-.06em}.progress-card strong i{color:#748198;font-size:19px;font-style:normal}.progress-bar{height:7px;margin:8px 0 10px;overflow:hidden;background:#202941;border-radius:999px}.progress-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--blue));border-radius:999px}
.column-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.column-card{position:relative;min-height:410px;padding:22px;background:rgba(5,9,21,.62);border:1px solid var(--line);border-radius:18px;overflow:hidden}.column-card:before{content:'';position:absolute;inset:0 auto 0 0;width:3px;background:var(--accent)}.column-industry-architecture:before{background:var(--blue)}.column-open-source-engineering:before{background:var(--green)}.column-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.column-head span{color:#758198;font:700 9px/1.3 ui-monospace,monospace;letter-spacing:.08em}.column-head h3{margin:8px 0 0;font-size:22px}.topic{margin:34px 0 22px}.topic small{color:#9e94ff;font:700 11px/1.4 ui-monospace,monospace}.topic h4{margin:9px 0 0;font-size:24px;line-height:1.2;letter-spacing:-.03em}.column-card dl{margin:0}.column-card dl>div{padding:14px 0;border-top:1px solid var(--line)}.column-card dt,.evidence-panel dt{color:#727f96;font-size:10px;letter-spacing:.05em}.column-card dd,.evidence-panel dd{margin:7px 0 0;color:#b8c1d1;font-size:12px;line-height:1.6}
.shift-list{display:grid;gap:12px}.shift-card{padding:22px;background:rgba(5,9,21,.6);border:1px solid var(--line);border-radius:17px}.shift-head{display:flex;justify-content:space-between;align-items:flex-start;gap:18px}.shift-head time{display:block;color:#a99fff;font:750 12px/1 ui-monospace,monospace}.shift-head h3{margin:8px 0 0;font-size:19px}.result-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:20px}.result-grid>div{min-height:125px;padding:15px;background:rgba(255,255,255,.025);border:1px solid var(--line);border-radius:13px}.result-grid span{color:#748198;font-size:10px}.result-grid p{margin:8px 0 0;color:#b8c1d1;font-size:12px;line-height:1.55}.result-grid .outcome{background:linear-gradient(145deg,rgba(139,124,255,.12),rgba(255,255,255,.025));border-color:rgba(139,124,255,.3)}.metric-grid{display:flex;flex-wrap:wrap;gap:9px;margin-top:11px}.metric-grid div{min-width:130px;padding:11px 13px;background:#0a1020;border:1px solid var(--line);border-radius:11px}.metric-grid strong{display:block;color:#e9e7ff;font-size:17px}.metric-grid span{display:block;margin-top:4px;color:#7f8ca2;font-size:10px}.artifact-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:11px}.artifact-list a{display:flex;align-items:center;gap:12px;padding:9px 12px;background:#0a1020;border:1px solid var(--line);border-radius:999px;font-size:11px}.pending,.missing{margin:18px 0 0;padding:15px;color:#9aa6ba;background:rgba(255,255,255,.025);border:1px dashed var(--line);border-radius:12px}.missing{color:#f5c7c7}
.production-release{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}.section-lead{margin:-8px 0 20px;color:#909db2;font-size:13px;line-height:1.6}.candidate-list{display:grid;gap:10px}.candidate-list article{padding:18px;background:#080e1d;border:1px solid var(--line);border-radius:14px}.candidate-list small{color:#8e82ff}.candidate-list h3{margin:9px 0;font-size:19px}.candidate-list span{color:var(--green);font-size:11px}.candidate-list article>div{display:flex;gap:12px;margin-top:13px}.candidate-list a,.release-result a{font-size:12px}.empty-state{padding:24px;background:rgba(255,255,255,.025);border:1px dashed var(--line);border-radius:14px}.empty-state strong{font-size:20px}.empty-state p{margin:9px 0 0;color:#8f9cb0;line-height:1.6}.release-result{padding:20px;background:rgba(119,229,167,.05);border:1px solid rgba(119,229,167,.2);border-radius:14px}.release-result strong{font-size:19px}.release-result p{color:#9eabbf;line-height:1.6}.release-result a{display:inline-block;margin:10px 12px 0 0}
.evidence-log{display:grid;grid-template-columns:minmax(280px,.65fr) minmax(0,1.35fr);gap:16px;margin-top:16px}.evidence-panel dl{margin:0}.evidence-panel dl>div{padding:15px 0;border-top:1px solid var(--line)}.evidence-panel dl>div:first-child{border-top:0}.log-panel ol{list-style:none;margin:0;padding:0}.log-panel li{display:grid;grid-template-columns:48px 12px minmax(0,1fr) auto;gap:10px;min-height:62px}.log-panel time{color:#a8b2c5;font:650 12px/1.5 ui-monospace,monospace}.log-panel li>i{position:relative;width:8px;height:8px;margin-top:5px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px rgba(139,124,255,.13)}.log-panel li>i:after{content:'';position:absolute;top:12px;left:3px;width:1px;height:38px;background:var(--line)}.log-panel li:last-child>i:after{display:none}.log-panel strong{display:block;font-size:13px}.log-panel span{display:block;margin-top:4px;color:#8794a9;font-size:11px}.log-panel li>b{font:700 10px/1 ui-monospace,monospace}
.history-list article{display:grid;grid-template-columns:96px 90px minmax(0,1fr) minmax(0,1fr) auto;gap:16px;align-items:center;padding:16px 0;border-top:1px solid var(--line)}.history-list article:first-child{border-top:0}.history-list time{color:#c5cede;font:650 12px/1 ui-monospace,monospace}.history-list article>div>strong{font-size:18px}.history-list article>div>span,.history-list small{display:block;color:#748198;font-size:10px}.history-list p{margin:5px 0 0;color:#9aa6b9;font-size:11px;line-height:1.5}.history-list a{font-size:11px}.runtime-v4 blockquote{margin:16px 0 0;padding:23px 27px;color:#dce0ef;background:linear-gradient(90deg,rgba(139,124,255,.16),rgba(139,124,255,.04));border:1px solid rgba(139,124,255,.24);border-left:3px solid var(--accent);border-radius:13px;font-size:15px;line-height:1.7}
@media(max-width:1050px){.hero{align-items:flex-start;flex-direction:column}.hero-actions{align-items:flex-start}.overview-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.column-grid{grid-template-columns:1fr}.column-card{min-height:auto}.result-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.production-release,.evidence-log{grid-template-columns:1fr}.history-list article{grid-template-columns:90px 80px 1fr}.history-list article>div:nth-of-type(3),.history-list a{grid-column:3}}
@media(max-width:680px){.shell{width:calc(100% - 28px);padding:52px 0 64px}.hero h1{font-size:42px}.hero p{font-size:15px}.panel{padding:18px;border-radius:16px}.section-title{align-items:flex-start;flex-direction:column}.section-title>small{text-align:left}.overview-grid{grid-template-columns:1fr 1fr}.overview-grid article{min-height:126px;padding:15px}.overview-grid article>strong{font-size:17px}.progress-card strong{font-size:34px!important}.result-grid{grid-template-columns:1fr}.shift-head{align-items:flex-start}.history-list article{grid-template-columns:1fr auto}.history-list article>div,.history-list article>div:nth-of-type(3),.history-list a{grid-column:1/-1}.log-panel li{grid-template-columns:42px 10px 1fr}.log-panel li>b{grid-column:3;justify-self:start}.column-head{flex-direction:column}.topic h4{font-size:21px}}
</style>
