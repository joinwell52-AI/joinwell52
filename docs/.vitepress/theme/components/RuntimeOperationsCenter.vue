<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import runtimeData from '../../generated/runtime-records.json'

type Status = 'Running' | 'Completed' | 'Blocked' | 'Failed' | 'Skipped' | 'Waiting'
type Task = {
  id: string
  name: string
  time: string
  kind: 'daily' | 'weekly'
  days: string[]
  responsibility: string
  output: string
  prohibitions: string[]
  skillsRequired: boolean
}
type Metric = { label: string; label_zh: string; value: string }
type Artifact = {
  label: string
  label_zh: string
  path?: string
  commit?: string
  url?: string
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
  output: string
  tasks: Record<string, Status>
  results?: Record<string, TaskResult>
  log: Log[]
}
type Data = {
  today: string
  timezone: string
  schedulerVersion: string
  centerVersion: string
  operationsCenterVersion?: string
  resultContract?: string
  schedule: Task[]
  todayTasks: string[]
  records: RecordItem[]
}

const data = runtimeData as Data
const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })
const zh = computed(() => props.lang === 'zh')
const currentRecord = computed(() => data.records.find((record) => record.date === data.today) || null)
const todayTasks = computed(() => data.schedule
  .filter((task) => data.todayTasks.includes(task.id))
  .sort((a, b) => a.time.localeCompare(b.time)))

const text = computed(() => zh.value ? {
  kicker: '数字员工运营中心 · 工作成果汇报',
  title: '数字工场运营中心',
  lead: '这里不只显示“任务已运行”，而是逐项汇报每个定时任务的输入、实际成果、输出文件、下一步和 GitHub 证据。',
  badge: '数字员工工场', charter: '查看运行调度规范',
  overview: '今日运营概况', progress: '完成进度', dayState: '全天状态', current: '当前工作', next: '下一任务',
  inProgress: '进行中', completed: '已完成', endedIncomplete: '当日已结束（未全部完成）', risk: '进行中（存在风险）',
  waiting: '等待下一任务', noPlan: '今日没有计划任务', noMore: '今日计划已结束',
  report: '定时任务工作成果', reportHint: '每项任务完成后，必须在运行记录中提交结构化成果汇报。',
  input: '输入', result: '工作成果', output: '输出', nextStep: '下一步', reason: '原因', artifacts: '成果与证据',
  pendingTitle: '等待执行', pendingBody: '任务完成后，这里将自动展示输入、成果、输出、下一步和证据。',
  missingTitle: '缺少成果汇报', missingBody: '任务状态已经结束，但运行记录没有提供结构化成果；该任务不能视为完整汇报。',
  evidence: '运行证据', github: 'GitHub 提交验证', commit: '最新提交', record: '运行记录', contract: '成果汇报规范',
  verified: '已提交并校验', pending: '等待提交', open: '查看',
  log: '工作日志', history: '近期工作汇报', source: '数据来源：运行记录',
  completedTasks: '完成任务', publication: '发布结果', noPublication: '未产生正式发布',
  principle: '每个定时任务都必须汇报实际工作成果；状态、过程和日志只作为成果的可验证证据。'
} : {
  kicker: 'DIGITAL EMPLOYEE OPERATIONS · WORK OUTCOME REPORT',
  title: "Today's Digital Researcher Work Report",
  lead: 'This center reports what every scheduled task actually produced—its inputs, outcomes, outputs, next action, and GitHub evidence—not merely that a task ran.',
  badge: 'DIGITAL EMPLOYEE WORKS', charter: 'View Runtime Scheduler',
  overview: "Today's Operations", progress: 'Completion', dayState: 'Day Status', current: 'Current Work', next: 'Next Task',
  inProgress: 'In Progress', completed: 'Completed', endedIncomplete: 'Day Ended — Incomplete', risk: 'In Progress — Attention Required',
  waiting: 'Waiting for the next task', noPlan: 'No tasks are scheduled today', noMore: "Today's plan has ended",
  report: 'Scheduled Task Outcomes', reportHint: 'Every completed task must submit a structured work-result report to the Runtime Record.',
  input: 'Input', result: 'Work Outcome', output: 'Output', nextStep: 'Next', reason: 'Reason', artifacts: 'Artifacts & Evidence',
  pendingTitle: 'Waiting', pendingBody: 'After execution, this card will report the input, outcome, output, next action, and evidence.',
  missingTitle: 'Outcome Report Missing', missingBody: 'The task has ended, but its Runtime Record lacks a structured outcome report.',
  evidence: 'Runtime Evidence', github: 'GitHub Verification', commit: 'Latest Commit', record: 'Runtime Record', contract: 'Result Contract',
  verified: 'Committed and verified', pending: 'Commit pending', open: 'Open',
  log: 'Work Log', history: 'Recent Work Reports', source: 'Source: Runtime Record',
  completedTasks: 'Completed Tasks', publication: 'Publication Result', noPublication: 'No formal publication',
  principle: 'Every scheduled task must report its actual work outcome; status, process, and logs are evidence supporting that outcome.'
})

const taskCopy: Record<string, { zh: string; en: string }> = {
  engine: { zh: '研究运行引擎', en: 'Research Runtime Engine' },
  queue: { zh: '研究运行队列', en: 'Research Runtime Queue' },
  knowledge: { zh: '研究运行知识', en: 'Research Runtime Knowledge' },
  architecture: { zh: '研究运行架构评审', en: 'Research Runtime Architecture' },
  publication: { zh: '研究运行每日发布', en: 'Research Runtime Publication' },
  weekly: { zh: '研究运行每周综合', en: 'Research Runtime Weekly' },
  academic: { zh: '研究运行学术研究', en: 'Research Runtime Academic' }
}

const statusLabel = (status: Status) => zh.value
  ? ({ Running: '运行中', Completed: '已完成', Blocked: '已阻塞', Failed: '失败', Skipped: '已跳过', Waiting: '待执行' } as Record<Status, string>)[status]
  : status
const cls = (status?: string) => `s-${String(status || 'Waiting').toLowerCase()}`
const taskName = (task: Task) => zh.value ? (taskCopy[task.id]?.zh || task.name) : (taskCopy[task.id]?.en || task.name)
const resultText = (result: TaskResult, field: 'input' | 'summary' | 'output' | 'next' | 'reason') => {
  const localized = (result as unknown as Record<string, string>)[`${field}_zh`]
  return zh.value && localized ? localized : (result as unknown as Record<string, string>)[field] || ''
}
const metricLabel = (metric: Metric) => zh.value ? metric.label_zh : metric.label
const artifactLabel = (artifact: Artifact) => zh.value ? artifact.label_zh : artifact.label

const taskHasLog = (task: Task, record = currentRecord.value) => Boolean(record?.log.some((entry) => entry.runtime === task.name))
const taskResult = (task: Task, record = currentRecord.value) => record?.results?.[task.id] || null
const taskStatus = (task: Task, record = currentRecord.value): Status => {
  const result = taskResult(task, record)
  if (result) return result.status
  const raw = record?.tasks?.[task.id] || 'Waiting'
  if (raw === 'Skipped' && !taskHasLog(task, record)) return 'Waiting'
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
  if (runningRow.value) return `${statusLabel('Running')}：${taskName(runningRow.value.task)}`
  if (nextRow.value) return `${text.value.waiting}：${nextRow.value.task.time} ${taskName(nextRow.value.task)}`
  return totalCount.value ? text.value.noMore : text.value.noPlan
})

const artifactHref = (artifact: Artifact, record = currentRecord.value) => {
  if (artifact.url) return artifact.url
  if (artifact.path && record) return `https://github.com/${record.repository}/blob/main/${artifact.path}`
  if (artifact.commit && record) return `https://github.com/${record.repository}/commit/${artifact.commit}`
  return '#'
}
const artifactCommitHref = (artifact: Artifact, record = currentRecord.value) => artifact.commit && record
  ? `https://github.com/${record.repository}/commit/${artifact.commit}` : ''
const recordUrl = (record: RecordItem) => `https://github.com/${record.repository}/blob/main/${record.path}`
const commitUrl = computed(() => currentRecord.value?.commit && currentRecord.value.commit !== 'pending'
  ? `https://github.com/${currentRecord.value.repository}/commit/${currentRecord.value.commit}` : '')

const eventMap: Record<string, string> = {
  'Runtime Started': '运行开始', 'Runtime Scheduled': '任务已调度', 'Queue Loaded': '队列已加载',
  'Eligibility Decision': '资格判断', 'Deep Reading': '深度阅读', 'Lifecycle Transition': '生命周期转换',
  'Commit Verify': '提交验证', 'Official Source Discovery': '官方来源发现', 'Candidate Scoring': '候选评分',
  'Selection Decision': '选题决策', 'Existing Queue Enrichment': '现有队列补充', 'Queue State Commit': '队列状态提交',
  'Evidence Admission': '证据准入', 'Knowledge Linking': '知识关联', 'Recurring Findings': '重复发现提炼',
  'Architecture Candidates': '架构候选登记', 'Knowledge State Commit': '知识状态提交', 'Publication Eligibility': '发布资格检查'
}
const localEvent = (entry: Log) => zh.value ? (eventMap[entry.event] || entry.event) : entry.event
const localRuntime = (entry: Log) => {
  const task = data.schedule.find((item) => item.name === entry.runtime)
  return task ? taskName(task) : entry.runtime
}
const logs = computed(() => (currentRecord.value?.log || []).slice(-12))

function weekday(date: string) {
  return new Intl.DateTimeFormat('en-US', { timeZone: data.timezone, weekday: 'long' })
    .format(new Date(`${date}T04:00:00.000Z`))
}
function scheduledFor(record: RecordItem) {
  const day = weekday(record.date)
  return data.schedule.filter((task) => task.kind === 'daily' || task.days.includes(day))
}
function publicationResult(record: RecordItem) {
  const result = ['publication', 'weekly', 'academic']
    .map((id) => record.results?.[id])
    .find(Boolean)
  if (result) return resultText(result, result.status === 'Skipped' ? 'reason' : 'summary')
  return text.value.noPublication
}
const historyRows = computed(() => data.records.slice(0, 8).map((record) => {
  const scheduled = scheduledFor(record)
  const completed = scheduled.filter((task) => taskStatus(task, record) === 'Completed').length
  return { record, completed, total: scheduled.length, publication: publicationResult(record) }
}))

const schedulerPath = computed(() => zh.value ? '/zh/publications/research-runtime-scheduler-v1.0' : '/en/publications/research-runtime-scheduler-v1.0')
</script>

<template>
  <main class="operations-center">
    <div class="shell">
      <header class="hero">
        <div>
          <span class="kicker">{{ text.kicker }}</span>
          <h1>{{ text.title }} <em>V{{ data.operationsCenterVersion || '3.0' }}</em></h1>
          <p>{{ text.lead }}</p>
        </div>
        <div class="hero-actions">
          <b>{{ text.badge }}</b>
          <a :href="withBase(schedulerPath)">{{ text.charter }} →</a>
        </div>
      </header>

      <section class="overview panel">
        <div class="section-title"><div><span>01</span><h2>{{ text.overview }}</h2></div><small>{{ data.today }} · {{ data.timezone }}</small></div>
        <div class="overview-grid">
          <article class="progress-card">
            <span>{{ text.progress }}</span>
            <strong>{{ completedCount }} <i>/ {{ totalCount }}</i></strong>
            <div class="progress-bar"><i :style="{ width: `${progress}%` }"></i></div>
            <small>{{ progress }}%</small>
          </article>
          <article><span>{{ text.dayState }}</span><strong :class="hasRisk ? 's-failed' : completedCount === totalCount && totalCount ? 's-completed' : 's-running'">{{ dayState }}</strong><small>{{ currentState }}</small></article>
          <article><span>{{ text.current }}</span><strong>{{ runningRow ? taskName(runningRow.task) : (nextRow ? text.waiting : text.noMore) }}</strong><small>{{ runningRow ? statusLabel('Running') : currentState }}</small></article>
          <article><span>{{ text.next }}</span><strong>{{ nextRow ? nextRow.task.time : '—' }}</strong><small>{{ nextRow ? taskName(nextRow.task) : text.noMore }}</small></article>
        </div>
      </section>

      <section class="report panel">
        <div class="section-title"><div><span>02</span><h2>{{ text.report }}</h2></div><small>{{ text.reportHint }}</small></div>
        <div class="result-list">
          <article v-for="row in taskRows" :key="row.task.id" class="result-card" :class="cls(row.status)">
            <div class="result-head">
              <div class="task-time"><time>{{ row.task.time }}</time><i></i></div>
              <div class="task-title"><small>{{ row.task.id.toUpperCase() }}</small><h3>{{ taskName(row.task) }}</h3></div>
              <b>{{ statusLabel(row.status) }}</b>
            </div>

            <template v-if="row.result">
              <p class="result-summary">{{ resultText(row.result, 'summary') }}</p>
              <div v-if="row.result.metrics.length" class="metrics">
                <div v-for="metric in row.result.metrics" :key="`${row.task.id}-${metric.label}`"><span>{{ metricLabel(metric) }}</span><strong>{{ metric.value }}</strong></div>
              </div>
              <div class="result-details">
                <div><span>{{ text.input }}</span><p>{{ resultText(row.result, 'input') }}</p></div>
                <div><span>{{ text.result }}</span><p>{{ resultText(row.result, 'summary') }}</p></div>
                <div><span>{{ text.output }}</span><p>{{ resultText(row.result, 'output') }}</p></div>
                <div><span>{{ text.nextStep }}</span><p>{{ resultText(row.result, 'next') }}</p></div>
              </div>
              <div v-if="row.result.reason" class="reason"><span>{{ text.reason }}</span><p>{{ resultText(row.result, 'reason') }}</p></div>
              <div v-if="row.result.artifacts.length" class="artifacts">
                <span>{{ text.artifacts }}</span>
                <div>
                  <a v-for="artifact in row.result.artifacts" :key="`${row.task.id}-${artifact.label}-${artifact.path || artifact.commit || artifact.url}`" :href="artifactHref(artifact)">
                    {{ artifactLabel(artifact) }} ↗
                    <small v-if="artifact.commit && artifact.path"><a :href="artifactCommitHref(artifact)">{{ artifact.commit.slice(0, 8) }}</a></small>
                  </a>
                </div>
              </div>
            </template>

            <div v-else-if="row.status === 'Waiting' || row.status === 'Running'" class="pending-result">
              <strong>{{ row.status === 'Running' ? statusLabel('Running') : text.pendingTitle }}</strong>
              <p>{{ text.pendingBody }}</p>
            </div>
            <div v-else class="missing-result">
              <strong>{{ text.missingTitle }}</strong><p>{{ text.missingBody }}</p>
            </div>
          </article>
        </div>
      </section>

      <div class="support-grid">
        <section class="panel evidence">
          <div class="section-title"><div><span>03</span><h2>{{ text.evidence }}</h2></div></div>
          <dl>
            <div><dt>{{ text.github }}</dt><dd :class="cls(currentRecord?.commitVerify)">{{ currentRecord?.commitVerify === 'Completed' ? text.verified : text.pending }}</dd></div>
            <div><dt>{{ text.commit }}</dt><dd><a v-if="commitUrl && currentRecord" :href="commitUrl">{{ currentRecord.commit.slice(0, 8) }} ↗</a><span v-else>{{ text.pending }}</span></dd></div>
            <div><dt>{{ text.record }}</dt><dd><a v-if="currentRecord" :href="recordUrl(currentRecord)">{{ currentRecord.date }} ↗</a><span v-else>{{ text.pending }}</span></dd></div>
            <div><dt>{{ text.contract }}</dt><dd><code>{{ data.resultContract || 'runtime-task-result/v1' }}</code></dd></div>
          </dl>
        </section>

        <section class="panel work-log">
          <div class="section-title"><div><span>04</span><h2>{{ text.log }}</h2></div><small>{{ text.source }}</small></div>
          <ol v-if="logs.length">
            <li v-for="(entry, index) in logs" :key="`${entry.time}-${index}`"><time>{{ entry.time }}</time><i></i><div><strong>{{ localEvent(entry) }}</strong><span>{{ localRuntime(entry) }}</span></div><b :class="cls(entry.status)">{{ statusLabel(entry.status) }}</b></li>
          </ol>
          <p v-else class="empty">{{ text.pending }}</p>
        </section>
      </div>

      <section class="history panel">
        <div class="section-title"><div><span>05</span><h2>{{ text.history }}</h2></div><small>{{ text.source }}</small></div>
        <div class="history-list">
          <article v-for="row in historyRows" :key="row.record.path">
            <time>{{ row.record.date }}</time>
            <div><span>{{ text.completedTasks }}</span><strong>{{ row.completed }} / {{ row.total }}</strong></div>
            <div class="publication-cell"><span>{{ text.publication }}</span><p>{{ row.publication }}</p></div>
            <a :href="recordUrl(row.record)">{{ text.open }} ↗</a>
          </article>
        </div>
      </section>

      <blockquote>{{ text.principle }}</blockquote>
    </div>
  </main>
</template>

<style scoped>
.operations-center{--bg:#070a14;--panel:#10172a;--line:rgba(148,163,184,.18);--muted:#8f9cb2;--text:#f5f7ff;--accent:#8b7cff;--green:#78e6aa;--blue:#72d4ff;position:relative;width:100vw;margin-left:calc(50% - 50vw);overflow:hidden;color:var(--text);background:radial-gradient(circle at 82% 3%,rgba(105,86,255,.2),transparent 30%),linear-gradient(180deg,#080b17,#060912);border-block:1px solid var(--line)}
.shell{width:min(1260px,calc(100% - 48px));margin:auto;padding:70px 0 78px}.hero{display:flex;justify-content:space-between;align-items:flex-end;gap:48px;margin-bottom:24px}.kicker{display:block;margin-bottom:14px;color:#bdb5ff;font:750 11px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.hero h1{max-width:900px;margin:0;font-size:clamp(42px,5.2vw,70px);line-height:1;letter-spacing:-.055em}.hero h1 em{color:var(--accent);font-style:normal;font-weight:500}.hero p{max-width:820px;margin:20px 0 0;color:#b7c1d3;font-size:16px;line-height:1.75}.hero-actions{display:flex;flex-direction:column;align-items:flex-end;gap:12px}.hero-actions b{padding:8px 12px;color:var(--green);background:rgba(34,197,94,.08);border:1px solid rgba(74,222,128,.2);border-radius:999px;font:750 11px/1 ui-monospace,monospace}.operations-center a{color:#c9c4ff;text-decoration:none;font-weight:700}
.panel{padding:27px;background:linear-gradient(145deg,rgba(18,25,46,.98),rgba(9,13,27,.97));border:1px solid var(--line);border-radius:21px;box-shadow:0 22px 70px rgba(0,0,0,.18)}.section-title{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:22px}.section-title>div{display:flex;align-items:center;gap:12px}.section-title>div>span{color:var(--accent);font:750 10px/1 ui-monospace,monospace}.section-title h2{margin:0;font-size:22px;letter-spacing:-.025em}.section-title small{max-width:620px;color:#75839a;line-height:1.5;text-align:right}.overview{margin-bottom:16px}.overview-grid{display:grid;grid-template-columns:1.15fr 1fr 1fr 1fr;gap:12px}.overview-grid article{min-height:146px;padding:20px;background:rgba(5,9,21,.58);border:1px solid var(--line);border-radius:16px}.overview-grid article>span{display:block;color:var(--muted);font-size:11px;letter-spacing:.06em}.overview-grid article>strong{display:block;margin:18px 0 12px;font-size:20px;line-height:1.25}.overview-grid article>small{display:block;color:#8491a7;line-height:1.5}.progress-card strong{font-size:43px!important;letter-spacing:-.06em}.progress-card strong i{color:#728097;font-size:19px;font-style:normal}.progress-bar{height:7px;margin:8px 0 10px;overflow:hidden;background:#202941;border-radius:999px}.progress-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--blue));border-radius:999px}.s-running{color:var(--blue)!important}.s-completed{color:var(--green)!important}.s-blocked{color:#fbbf24!important}.s-failed{color:#fca5a5!important}.s-skipped{color:#94a3b8!important}.s-waiting{color:#c4b5fd!important}
.report{margin-bottom:16px}.result-list{display:grid;gap:13px}.result-card{padding:22px;background:rgba(5,9,21,.62);border:1px solid var(--line);border-left:3px solid currentColor;border-radius:17px}.result-head{display:grid;grid-template-columns:80px minmax(0,1fr) auto;gap:16px;align-items:center}.task-time{display:flex;align-items:center;gap:12px}.task-time time{color:#d8d4ff;font:800 16px/1 ui-monospace,monospace}.task-time i{width:10px;height:10px;border-radius:50%;background:currentColor;box-shadow:0 0 0 5px color-mix(in srgb,currentColor 15%,transparent)}.task-title small{display:block;color:#68768d;font:750 9px/1 ui-monospace,monospace;letter-spacing:.12em}.task-title h3{margin:6px 0 0;color:var(--text);font-size:19px}.result-head>b{padding:7px 10px;border:1px solid currentColor;border-radius:999px;font:750 10px/1 ui-monospace,monospace;white-space:nowrap}.result-summary{margin:21px 0 0;color:#e7ebf7;font-size:17px;line-height:1.65}.metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:18px}.metrics div{padding:15px;background:rgba(255,255,255,.035);border:1px solid var(--line);border-radius:13px}.metrics span{display:block;color:#7f8ca2;font-size:10px}.metrics strong{display:block;margin-top:8px;color:#eef1fa;font-size:17px;line-height:1.25;overflow-wrap:anywhere}.result-details{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:12px}.result-details>div,.reason{padding:16px;background:rgba(255,255,255,.025);border:1px solid var(--line);border-radius:13px}.result-details span,.reason span,.artifacts>span{display:block;color:#8e9bb0;font-size:10px;letter-spacing:.06em}.result-details p,.reason p{margin:8px 0 0;color:#c2cad8;font-size:12px;line-height:1.6}.reason{margin-top:12px;border-color:rgba(251,191,36,.25)}.artifacts{margin-top:15px}.artifacts>div{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.artifacts a{display:inline-flex;align-items:center;gap:8px;padding:9px 11px;background:rgba(139,124,255,.08);border:1px solid rgba(139,124,255,.2);border-radius:999px;font-size:11px}.artifacts a small{padding-left:8px;border-left:1px solid var(--line)}.pending-result,.missing-result{margin-top:18px;padding:18px;border:1px dashed var(--line);border-radius:13px}.pending-result strong,.missing-result strong{color:#ddd8ff}.pending-result p,.missing-result p{margin:7px 0 0;color:#8996aa;font-size:12px;line-height:1.55}.missing-result{border-color:rgba(252,165,165,.3)}.missing-result strong{color:#fca5a5}
.support-grid{display:grid;grid-template-columns:minmax(300px,.7fr) minmax(0,1.3fr);gap:16px}.evidence dl{margin:0}.evidence dl>div{padding:17px 0;border-top:1px solid var(--line)}.evidence dl>div:first-child{border-top:0}.evidence dt{color:#79869c;font-size:11px}.evidence dd{margin:7px 0 0;color:#d9deea;font-size:13px;line-height:1.5}.evidence code{font-size:11px}.work-log ol{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 24px;list-style:none;margin:0;padding:0}.work-log li{display:grid;grid-template-columns:46px 12px minmax(0,1fr) auto;gap:10px;min-height:68px}.work-log time{color:#a8b2c5;font:650 12px/1.5 ui-monospace,monospace}.work-log li>i{position:relative;width:8px;height:8px;margin-top:5px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px rgba(139,124,255,.13)}.work-log li>i:after{content:'';position:absolute;top:12px;left:3px;width:1px;height:43px;background:var(--line)}.work-log strong{display:block;font-size:12px}.work-log span{display:block;margin-top:4px;color:#8d99ad;font-size:11px}.work-log b{padding:6px 8px;border:1px solid currentColor;border-radius:999px;font:750 9px/1 ui-monospace,monospace;white-space:nowrap}.history{margin-top:16px}.history-list article{display:grid;grid-template-columns:110px 130px minmax(0,1fr) auto;gap:18px;align-items:center;padding:16px 0;border-top:1px solid var(--line)}.history-list article:first-child{border-top:0}.history-list time{color:#c6cfdf;font:650 12px/1 ui-monospace,monospace}.history-list span{display:block;color:#75839a;font-size:10px}.history-list strong{display:block;margin-top:6px}.publication-cell p{margin:6px 0 0;color:#b9c2d1;font-size:12px;line-height:1.5}.history-list>a{font-size:12px}.operations-center blockquote{margin:16px 0 0;padding:23px 27px;color:#dce0ef;background:linear-gradient(90deg,rgba(139,124,255,.16),rgba(139,124,255,.04));border:1px solid rgba(139,124,255,.24);border-left:3px solid var(--accent);border-radius:13px;font-size:15px;line-height:1.7}.empty{color:#7f8ba1}
@media(max-width:1050px){.hero{align-items:flex-start;flex-direction:column}.hero-actions{align-items:flex-start}.overview-grid,.metrics,.result-details{grid-template-columns:repeat(2,minmax(0,1fr))}.support-grid{grid-template-columns:1fr}.work-log ol{grid-template-columns:1fr}}
@media(max-width:680px){.shell{width:calc(100% - 30px);padding:54px 0 66px}.hero h1{font-size:43px}.hero p{font-size:15px}.panel{padding:19px;border-radius:17px}.section-title{align-items:flex-start;flex-direction:column}.section-title small{text-align:left}.overview-grid{grid-template-columns:1fr 1fr}.overview-grid article{min-height:130px;padding:16px}.overview-grid article>strong{font-size:17px}.progress-card strong{font-size:34px!important}.result-head{grid-template-columns:1fr auto}.task-time{grid-column:1/-1}.task-title h3{font-size:17px}.metrics,.result-details{grid-template-columns:1fr 1fr}.history-list article{grid-template-columns:1fr auto}.history-list article>div,.history-list article>a{grid-column:1/-1}.work-log li{grid-template-columns:42px 10px minmax(0,1fr)}.work-log b{grid-column:3;justify-self:start}.artifacts a{width:100%;justify-content:space-between}}
@media(max-width:430px){.overview-grid,.metrics,.result-details{grid-template-columns:1fr}.hero h1{font-size:38px}.result-card{padding:17px}.result-summary{font-size:15px}}
</style>
