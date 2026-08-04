<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import runtimeData from '../../generated/runtime-records.json'

type Status = 'Running' | 'Completed' | 'Blocked' | 'Failed' | 'Skipped' | 'Waiting'
type View = 'center' | 'daily' | 'weekly' | 'academic' | 'program'
type Task = {
  id: string
  family: View
  name: string
  name_zh: string
  schedule: { kind: string; time: string; cron: string; days?: string[] }
  input: string
  work: string
  output: string
  skills: string[]
  prohibitions: string[]
}
type Metric = { label: string; label_zh: string; value: string }
type Evidence = { label: string; label_zh: string; source: string }
type Artifact = { label: string; label_zh: string; path?: string; url?: string; commit?: string }
type ShiftResult = {
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
type RuntimeRecord = {
  runtimeFamily: View
  date: string
  status: Status
  taskStatus: Record<string, Status>
  results: Record<string, ShiftResult>
  timeline: Array<{ time: string; task: string; event: string; status: Status; detail: string }>
  githubCommit: string
  commitVerify: Status
}
type Family = {
  id: View
  name: string
  name_zh: string
  purpose: string
  purpose_zh: string
  taskIds: string[]
}
type Data = {
  today: string
  timezone: string
  schedulerVersion: string
  centerVersion: string
  architectureStatus: string
  columns: Array<{ id: string; name: string; name_zh: string }>
  programs: Array<{ id: string; name: string; name_zh: string }>
  runtimeFamilies: Family[]
  schedule: Task[]
  todayDaily: RuntimeRecord
  latest: Record<View, RuntimeRecord | null>
  records: Record<View, RuntimeRecord[]>
}

const data = runtimeData as Data
const props = withDefaults(defineProps<{ lang?: 'en' | 'zh'; view?: View }>(), {
  lang: 'en',
  view: 'center'
})
const zh = computed(() => props.lang === 'zh')
const view = computed(() => props.view)

const copy = computed(() => zh.value ? {
  kicker: 'RESEARCH RUNTIME CENTER V5.0 · 已冻结架构',
  title: '四套运行体系，互不混合。',
  lead: 'Daily 负责当天发现、研究、生产与发布；Weekly、Academic、Program 分别独立运行。',
  scheduler: 'Research Runtime Scheduler V3.0',
  frozen: 'V5.0 架构冻结',
  entrances: '独立运行入口',
  dailyTitle: 'Daily Runtime · 当天闭环',
  dailyLead: 'Discovery → Queue → Reading → Analysis → Production → Publication',
  columns: '三个 Daily Research 栏目',
  result: '工作成果',
  input: '输入',
  work: '工作',
  output: '输出',
  next: '下一步',
  metrics: '指标',
  evidence: '证据',
  artifacts: '产物',
  pending: '尚未执行。Scheduler 只打开执行槽，不代表工作完成。',
  latest: '最近运行记录',
  history: '运行历史',
  noRecord: '尚无 V5 运行记录',
  programs: '独立 Research Programs',
  boundary: '运行边界',
  record: '查看 GitHub Record',
  back: '返回 Runtime Center',
  weeklyTitle: 'Weekly Runtime',
  weeklyLead: '只综合本周已验证 Daily Research，形成新的趋势、架构、工程与预测判断。',
  academicTitle: 'Academic Runtime',
  academicLead: '只处理 Paper、Benchmark、Specification 与 Institution；普通新闻禁止进入。',
  programTitle: 'Research Program Runtime',
  programLead: '长期 Program 拥有自己的 Queue、Research、Review 与 Publication，不占用 Daily Runtime。',
  statuses: { Running: '运行中', Completed: '已完成', Blocked: '已阻塞', Failed: '失败', Skipped: '已跳过', Waiting: '待执行' } as Record<Status, string>
} : {
  kicker: 'RESEARCH RUNTIME CENTER V5.0 · FROZEN ARCHITECTURE',
  title: 'Four runtime systems. No mixed execution.',
  lead: 'Daily owns same-day discovery, research, production and publication. Weekly, Academic and Program run independently.',
  scheduler: 'Research Runtime Scheduler V3.0',
  frozen: 'V5.0 Architecture Frozen',
  entrances: 'Independent Runtime Entrances',
  dailyTitle: 'Daily Runtime · Same-Day Closure',
  dailyLead: 'Discovery → Queue → Reading → Analysis → Production → Publication',
  columns: 'Three Daily Research Columns',
  result: 'Work Result',
  input: 'Input',
  work: 'Work',
  output: 'Output',
  next: 'Next',
  metrics: 'Metrics',
  evidence: 'Evidence',
  artifacts: 'Artifacts',
  pending: 'Not executed. A scheduler slot is not evidence that work completed.',
  latest: 'Latest Runtime Record',
  history: 'Runtime History',
  noRecord: 'No V5 Runtime Record yet',
  programs: 'Independent Research Programs',
  boundary: 'Runtime Boundary',
  record: 'Open GitHub Record',
  back: 'Back to Runtime Center',
  weeklyTitle: 'Weekly Runtime',
  weeklyLead: 'Synthesizes validated Daily Research into new trend, architecture, engineering and prediction judgments.',
  academicTitle: 'Academic Runtime',
  academicLead: 'Paper, Benchmark, Specification and Institution only. Ordinary news is excluded.',
  programTitle: 'Research Program Runtime',
  programLead: 'Long-term Programs own Queue, Research, Review and Publication without consuming Daily Runtime.',
  statuses: { Running: 'Running', Completed: 'Completed', Blocked: 'Blocked', Failed: 'Failed', Skipped: 'Skipped', Waiting: 'Waiting' } as Record<Status, string>
})

const families = computed(() => data.runtimeFamilies)
const family = computed(() => families.value.find((item) => item.id === view.value) || null)
const tasksFor = (familyId: View) => data.schedule
  .filter((task) => task.family === familyId)
  .sort((a, b) => a.schedule.time.localeCompare(b.schedule.time))
const dailyTasks = computed(() => tasksFor('daily'))
const currentDaily = computed(() => data.todayDaily)
const currentRecord = computed(() => view.value === 'daily' || view.value === 'center'
  ? currentDaily.value
  : data.latest[view.value])
const currentTasks = computed(() => view.value === 'center' ? dailyTasks.value : tasksFor(view.value))
const history = computed(() => view.value === 'center'
  ? (data.records.daily || []).slice(0, 7)
  : (data.records[view.value] || []).slice(0, 12))

const statusLabel = (status: Status) => copy.value.statuses[status]
const statusClass = (status: Status) => `status-${status.toLowerCase()}`
const taskName = (task: Task) => zh.value ? task.name_zh : task.name
const familyName = (item: Family) => zh.value ? item.name_zh : item.name
const familyPurpose = (item: Family) => zh.value ? item.purpose_zh : item.purpose
const local = (value: { [key: string]: string }, field: string) => zh.value && value[`${field}_zh`] ? value[`${field}_zh`] : value[field]
const taskStatus = (task: Task, record = currentRecord.value): Status => record?.taskStatus?.[task.id] || 'Waiting'
const taskResult = (task: Task, record = currentRecord.value) => record?.results?.[task.id] || null
const familyHref = (id: View) => withBase(`/${props.lang}/runtime/${id === 'center' ? '' : id}`)
const recordPath = (record: RuntimeRecord) => {
  const [year, month] = record.date.split('-')
  return `research/runtime/records/${record.runtimeFamily}/${year}/${month}/${record.date}-${record.runtimeFamily}-runtime.json`
}
const recordHref = (record: RuntimeRecord) => `https://github.com/joinwell52-AI/joinwell52/blob/main/${recordPath(record)}`
const artifactHref = (item: Artifact) => item.url || (item.path
  ? `https://github.com/joinwell52-AI/joinwell52/blob/main/${item.path}`
  : item.commit
    ? `https://github.com/joinwell52-AI/joinwell52/commit/${item.commit}`
    : '#')
const formatTaskSchedule = (task: Task) => {
  const days = task.schedule.days?.join(', ')
  return days ? `${days} · ${task.schedule.time}` : task.schedule.time
}
const sectionTitle = computed(() => {
  if (view.value === 'weekly') return copy.value.weeklyTitle
  if (view.value === 'academic') return copy.value.academicTitle
  if (view.value === 'program') return copy.value.programTitle
  return copy.value.dailyTitle
})
const sectionLead = computed(() => {
  if (view.value === 'weekly') return copy.value.weeklyLead
  if (view.value === 'academic') return copy.value.academicLead
  if (view.value === 'program') return copy.value.programLead
  return copy.value.dailyLead
})
</script>

<template>
  <main class="runtime-v5">
    <div class="runtime-shell">
      <header class="runtime-hero">
        <div>
          <span>{{ copy.kicker }}</span>
          <h1>{{ copy.title }}</h1>
          <p>{{ copy.lead }}</p>
        </div>
        <aside>
          <b>{{ copy.scheduler }}</b>
          <strong>{{ copy.frozen }}</strong>
          <small>{{ data.today }} · {{ data.timezone }}</small>
        </aside>
      </header>

      <section class="family-nav">
        <div class="section-head">
          <div><small>01</small><h2>{{ copy.entrances }}</h2></div>
        </div>
        <div class="family-grid">
          <a
            v-for="item in families"
            :key="item.id"
            :href="familyHref(item.id)"
            :class="['family-card', { active: view === item.id || (view === 'center' && item.id === 'daily') }]"
          >
            <span>{{ item.id.toUpperCase() }}</span>
            <h3>{{ familyName(item) }}</h3>
            <p>{{ familyPurpose(item) }}</p>
            <b>→</b>
          </a>
        </div>
      </section>

      <section class="runtime-panel">
        <div class="section-head">
          <div><small>02</small><h2>{{ sectionTitle }}</h2></div>
          <p>{{ sectionLead }}</p>
        </div>

        <div v-if="view === 'center' || view === 'daily'" class="column-strip">
          <span>{{ copy.columns }}</span>
          <b v-for="column in data.columns" :key="column.id">{{ zh ? column.name_zh : column.name }}</b>
        </div>

        <div class="task-list">
          <article v-for="task in currentTasks" :key="task.id" class="task-card">
            <header>
              <div><time>{{ formatTaskSchedule(task) }}</time><h3>{{ taskName(task) }}</h3></div>
              <b :class="statusClass(taskStatus(task))">{{ statusLabel(taskStatus(task)) }}</b>
            </header>

            <template v-if="taskResult(task)">
              <div class="result-grid">
                <div><span>{{ copy.input }}</span><p>{{ local(taskResult(task)!, 'input') }}</p></div>
                <div class="work-result"><span>{{ copy.result }}</span><p>{{ local(taskResult(task)!, 'workResult') }}</p></div>
                <div><span>{{ copy.output }}</span><p>{{ local(taskResult(task)!, 'output') }}</p></div>
                <div><span>{{ copy.next }}</span><p>{{ local(taskResult(task)!, 'next') }}</p></div>
              </div>
              <div v-if="taskResult(task)!.metrics.length" class="metric-grid">
                <div v-for="metric in taskResult(task)!.metrics" :key="metric.label">
                  <strong>{{ metric.value }}</strong><span>{{ zh ? metric.label_zh : metric.label }}</span>
                </div>
              </div>
              <div v-if="taskResult(task)!.evidence.length" class="link-list">
                <span>{{ copy.evidence }}</span>
                <a v-for="item in taskResult(task)!.evidence" :key="item.label" :href="item.source">
                  {{ zh ? item.label_zh : item.label }} ↗
                </a>
              </div>
              <div v-if="taskResult(task)!.artifacts.length" class="link-list">
                <span>{{ copy.artifacts }}</span>
                <a v-for="item in taskResult(task)!.artifacts" :key="item.label" :href="artifactHref(item)">
                  {{ zh ? item.label_zh : item.label }} ↗
                </a>
              </div>
            </template>

            <div v-else class="task-contract">
              <dl>
                <div><dt>{{ copy.input }}</dt><dd>{{ task.input }}</dd></div>
                <div><dt>{{ copy.work }}</dt><dd>{{ task.work }}</dd></div>
                <div><dt>{{ copy.output }}</dt><dd>{{ task.output }}</dd></div>
              </dl>
              <p>{{ copy.pending }}</p>
            </div>
          </article>
        </div>
      </section>

      <section v-if="view === 'program'" class="program-panel">
        <div class="section-head">
          <div><small>03</small><h2>{{ copy.programs }}</h2></div>
        </div>
        <div class="program-grid">
          <article v-for="program in data.programs" :key="program.id">
            <span>{{ program.id }}</span>
            <h3>{{ zh ? program.name_zh : program.name }}</h3>
            <p>Queue → Research → Review → Publication</p>
          </article>
        </div>
      </section>

      <section class="history-panel">
        <div class="section-head">
          <div><small>{{ view === 'program' ? '04' : '03' }}</small><h2>{{ copy.history }}</h2></div>
          <a v-if="view !== 'center'" :href="familyHref('center')">← {{ copy.back }}</a>
        </div>
        <div v-if="history.length" class="history-list">
          <a v-for="record in history" :key="`${record.runtimeFamily}-${record.date}`" :href="recordHref(record)">
            <div><strong>{{ record.date }}</strong><span>{{ record.runtimeFamily.toUpperCase() }}</span></div>
            <b :class="statusClass(record.status)">{{ statusLabel(record.status) }}</b>
            <small>{{ copy.record }} ↗</small>
          </a>
        </div>
        <div v-else class="empty-history">{{ copy.noRecord }}</div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.runtime-v5{--ink:#10131a;--muted:#667085;--line:rgba(16,19,26,.12);--panel:rgba(255,255,255,.84);--accent:#2463eb;--soft:#eef4ff;min-height:100vh;background:radial-gradient(circle at 15% 0%,rgba(36,99,235,.12),transparent 36%),linear-gradient(180deg,#f8fafc,#eef2f7);color:var(--ink);padding:42px 20px 80px}.runtime-shell{max-width:1240px;margin:0 auto}.runtime-hero{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:28px;align-items:end;padding:38px;border:1px solid var(--line);border-radius:28px;background:rgba(255,255,255,.74);box-shadow:0 24px 70px rgba(15,23,42,.08);backdrop-filter:blur(18px)}.runtime-hero>div>span{font-size:12px;font-weight:800;letter-spacing:.14em;color:var(--accent)}.runtime-hero h1{margin:14px 0 12px;font-size:clamp(36px,5vw,68px);line-height:1.02;letter-spacing:-.045em}.runtime-hero p{max-width:760px;margin:0;color:var(--muted);font-size:18px;line-height:1.7}.runtime-hero aside{display:flex;flex-direction:column;gap:10px;padding:22px;border-radius:20px;background:#10131a;color:white}.runtime-hero aside b{font-size:17px}.runtime-hero aside strong{color:#92b5ff}.runtime-hero aside small{color:#aab2c2}.family-nav,.runtime-panel,.program-panel,.history-panel{margin-top:24px;padding:30px;border:1px solid var(--line);border-radius:24px;background:var(--panel);box-shadow:0 16px 50px rgba(15,23,42,.05)}.section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:22px}.section-head>div{display:flex;align-items:center;gap:12px}.section-head small{font-weight:900;color:var(--accent)}.section-head h2{margin:0;font-size:26px;letter-spacing:-.025em}.section-head p{max-width:680px;margin:0;color:var(--muted);text-align:right}.section-head>a{font-weight:700}.family-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.family-card{position:relative;min-height:190px;padding:20px;border:1px solid var(--line);border-radius:18px;color:inherit;text-decoration:none;background:white;transition:.2s ease}.family-card:hover,.family-card.active{transform:translateY(-2px);border-color:rgba(36,99,235,.5);box-shadow:0 16px 34px rgba(36,99,235,.12)}.family-card>span{font-size:11px;font-weight:900;letter-spacing:.14em;color:var(--accent)}.family-card h3{margin:16px 0 10px;font-size:20px}.family-card p{margin:0;color:var(--muted);font-size:14px;line-height:1.55}.family-card>b{position:absolute;right:18px;bottom:14px;font-size:22px;color:var(--accent)}.column-strip{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:18px;padding:14px 16px;border-radius:16px;background:var(--soft)}.column-strip>span{margin-right:auto;font-size:12px;font-weight:800;color:var(--accent)}.column-strip b{padding:8px 11px;border-radius:999px;background:white;font-size:13px}.task-list{display:grid;gap:14px}.task-card{padding:22px;border:1px solid var(--line);border-radius:20px;background:white}.task-card>header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.task-card time{display:block;font-weight:900;color:var(--accent)}.task-card h3{margin:5px 0 0;font-size:21px}.task-card header>b,.history-list>a>b{padding:7px 10px;border-radius:999px;font-size:12px}.status-completed{background:#e8f7ee;color:#18794e}.status-running{background:#eaf1ff;color:#245ec7}.status-waiting{background:#f2f4f7;color:#667085}.status-skipped{background:#fff3df;color:#9a6700}.status-blocked,.status-failed{background:#ffebee;color:#b42318}.task-contract dl,.result-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:18px 0 0}.result-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.task-contract dl>div,.result-grid>div{padding:14px;border-radius:14px;background:#f7f9fc}.result-grid .work-result{background:var(--soft)}dt,.result-grid span,.link-list>span{display:block;margin-bottom:7px;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}dd,.result-grid p{margin:0;font-size:14px;line-height:1.55}.task-contract>p{margin:14px 0 0;color:var(--muted);font-size:13px}.metric-grid{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}.metric-grid>div{min-width:120px;padding:12px 14px;border-radius:14px;background:#10131a;color:white}.metric-grid strong{display:block;font-size:20px}.metric-grid span{font-size:11px;color:#cbd5e1}.link-list{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:14px}.link-list>span{margin:0 8px 0 0}.link-list a{padding:8px 10px;border-radius:10px;background:#f1f5f9;font-size:13px;font-weight:700}.program-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}.program-grid article{padding:18px;border:1px solid var(--line);border-radius:16px;background:white}.program-grid span{font-size:11px;font-weight:900;color:var(--accent)}.program-grid h3{margin:12px 0 8px;font-size:18px}.program-grid p{margin:0;color:var(--muted);font-size:12px}.history-list{display:grid;gap:10px}.history-list>a{display:grid;grid-template-columns:1fr auto auto;gap:14px;align-items:center;padding:14px 16px;border:1px solid var(--line);border-radius:14px;color:inherit;text-decoration:none;background:white}.history-list>a>div{display:flex;gap:12px;align-items:center}.history-list span,.history-list small{color:var(--muted);font-size:12px}.empty-history{padding:28px;border-radius:16px;background:#f7f9fc;color:var(--muted);text-align:center}@media (max-width:900px){.runtime-hero{grid-template-columns:1fr}.family-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.result-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.program-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.section-head{align-items:flex-start;flex-direction:column}.section-head p{text-align:left}}@media (max-width:620px){.runtime-v5{padding:18px 12px 54px}.runtime-hero,.family-nav,.runtime-panel,.program-panel,.history-panel{padding:20px;border-radius:20px}.runtime-hero h1{font-size:40px}.runtime-hero p{font-size:16px}.family-grid,.task-contract dl,.result-grid,.program-grid{grid-template-columns:1fr}.family-card{min-height:160px}.task-card>header{align-items:flex-start}.history-list>a{grid-template-columns:1fr auto}.history-list>a>small{grid-column:1/-1}.column-strip>span{width:100%;margin-right:0}}
</style>
