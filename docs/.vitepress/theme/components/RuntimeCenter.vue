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
  queueStatus: Status
  engineStatus: Status
  output: string
  tasks: Record<string, Status>
  log: Log[]
}
type Data = {
  today: string
  timezone: string
  schedulerVersion: string
  centerVersion: string
  schedule: Task[]
  todayTasks: string[]
  latest: RecordItem | null
  records: RecordItem[]
}

const data = runtimeData as Data
const props = withDefaults(defineProps<{ lang?: 'en' | 'zh'; compact?: boolean }>(), {
  lang: 'en',
  compact: false
})
const zh = computed(() => props.lang === 'zh')

function shanghaiClock() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: data.timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', weekday: 'long', hourCycle: 'h23'
  }).formatToParts(new Date()).map((part) => [part.type, part.value]))
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
    weekday: parts.weekday
  }
}

const clock = shanghaiClock()
const currentRecord = computed(() => data.records.find((record) => record.date === clock.date) || null)
const history = computed(() => data.records.slice(0, props.compact ? 3 : 12))
const todayTasks = computed(() => data.schedule
  .filter((task) => task.kind === 'daily' || task.days.includes(clock.weekday))
  .sort((a, b) => a.time.localeCompare(b.time)))

const text = computed(() => zh.value ? {
  kicker: '研究运行中心 · 数字研究员工作记录',
  title: '研究运行中心',
  lead: '这里展示数字研究员 RA 当天的计划、执行进度、下一项工作和可验证证据。页面依据调度清单与运行记录自动计算，不把尚未开始的任务误报为已跳过或已完成。',
  center: `研究中心 ${data.centerVersion}`,
  open: '进入研究运行中心', charter: '查看运行调度规范',
  overview: '今日运行概况', progress: '今日进度', dayStatus: '全天状态', current: '当前状态', next: '下一任务',
  inProgress: '进行中', completed: '已完成', endedIncomplete: '当日已结束（未全部完成）', risk: '进行中（存在风险）',
  waitingNext: '等待下一任务', noMore: '今日计划已全部结束', noPlan: '今日没有计划任务',
  tasks: '今日任务清单', evidence: '运行证据', timeline: '工作日志', source: '数据来源：运行记录',
  githubVerify: 'GitHub 验证', commit: '最新提交', publicationGate: '发布门禁', runtimeRecord: '运行记录',
  verified: '已提交并校验', pending: '等待提交', notStarted: '尚未开始', published: '已完成发布', noEligible: '已运行，无合格发布内容',
  schedule: '调度清单', scheduleNote: '全部七类运行任务；今日只显示每日任务和星期匹配的周期任务。',
  output: '输出', boundary: '边界', history: '运行历史', record: '查看记录', empty: '尚无运行记录。',
  principle: '正式发布必须由研究运行系统驱动并生成运行记录；没有运行记录的发布，不属于正式运行结果。'
} : {
  kicker: 'RESEARCH RUNTIME CENTER · DIGITAL RESEARCHER WORK RECORD',
  title: 'Research Runtime Center',
  lead: 'This page shows the Research Analyst’s daily plan, execution progress, next action and verifiable evidence. Status is resolved from the scheduler and Runtime Records, so future tasks are never reported as skipped or completed.',
  center: `RESEARCH CENTER ${data.centerVersion}`,
  open: 'Open Runtime Center', charter: 'View Runtime Scheduler',
  overview: 'Today’s Overview', progress: 'Today’s Progress', dayStatus: 'Day Status', current: 'Current State', next: 'Next Task',
  inProgress: 'In Progress', completed: 'Completed', endedIncomplete: 'Day Ended — Incomplete', risk: 'In Progress — Attention Required',
  waitingNext: 'Waiting for the next task', noMore: 'Today’s plan has ended', noPlan: 'No tasks are scheduled today',
  tasks: 'Today’s Task List', evidence: 'Runtime Evidence', timeline: 'Work Log', source: 'Source: Runtime Record',
  githubVerify: 'GitHub Verification', commit: 'Latest Commit', publicationGate: 'Publication Gate', runtimeRecord: 'Runtime Record',
  verified: 'Committed and verified', pending: 'Commit pending', notStarted: 'Not started', published: 'Publication completed', noEligible: 'Run completed without an eligible publication',
  schedule: 'Scheduler Manifest', scheduleNote: 'All seven Runtime tasks. Today includes daily tasks plus weekday-matched recurring tasks.',
  output: 'Output', boundary: 'Boundary', history: 'Runtime History', record: 'View record', empty: 'No Runtime Record is available.',
  principle: 'Every official publication must be driven by Research Runtime and produce a Runtime Record. A publication without a Runtime Record is not an official runtime output.'
})

const taskCopy: Record<string, { zh: string; en: string; zhDescription: string; zhOutput: string; zhBoundary: string }> = {
  engine: {
    zh: '研究运行引擎', en: 'Research Runtime Engine',
    zhDescription: '推进研究操作系统状态机，每次只完成一个受治理的生命周期转换。',
    zhOutput: '研究生命周期状态', zhBoundary: '不得跳过生命周期阶段'
  },
  queue: {
    zh: '研究运行队列', en: 'Research Runtime Queue',
    zhDescription: '发现信号、登记候选、评分排序并维护研究队列。',
    zhOutput: '候选、优先级与队列生命周期', zhBoundary: '禁止直接发布'
  },
  knowledge: {
    zh: '研究运行知识', en: 'Research Runtime Knowledge',
    zhDescription: '连接已验证研究成果，沉淀知识关系和架构候选。',
    zhOutput: '知识记录与架构候选', zhBoundary: '证据不足不得晋级'
  },
  architecture: {
    zh: '研究运行架构评审', en: 'Research Runtime Architecture',
    zhDescription: '评审架构候选并决定是否进入架构、规范或发布阶段。',
    zhOutput: '架构决策与生命周期裁定', zhBoundary: '单一观察不得成为架构决策'
  },
  publication: {
    zh: '研究运行每日发布', en: 'Research Runtime Publication',
    zhDescription: '发布已完成研究与验证的每日研究笔记，并完成 GitHub 提交校验。',
    zhOutput: '每日研究、索引、网站与提交验证', zhBoundary: '禁止在发布阶段直接研究'
  },
  weekly: {
    zh: '研究运行每周综合', en: 'Research Runtime Weekly',
    zhDescription: '综合过去七天已验证研究，形成新的跨主题判断。',
    zhOutput: '每周综合与工程判断', zhBoundary: '禁止复制或拼接每日研究'
  },
  academic: {
    zh: '研究运行学术研究', en: 'Research Runtime Academic',
    zhDescription: '研究论文、基准、规范、会议与机构成果。',
    zhOutput: '学术观察与正式研究笔记', zhBoundary: '禁止普通新闻'
  }
}

const statusLabel = (status: Status) => {
  if (!zh.value) return status
  return ({ Running: '运行中', Completed: '已完成', Blocked: '已阻塞', Failed: '失败', Skipped: '已跳过', Waiting: '待执行' } as Record<Status, string>)[status]
}
const cls = (status?: string) => `s-${String(status || 'Waiting').toLowerCase()}`
const taskName = (task: Task | string) => {
  const id = typeof task === 'string' ? task : task.id
  return zh.value ? (taskCopy[id]?.zh || id) : (taskCopy[id]?.en || (typeof task === 'string' ? task : task.name))
}
const taskDescription = (task: Task) => zh.value ? (taskCopy[task.id]?.zhDescription || '') : task.responsibility
const taskOutput = (task: Task) => zh.value ? (taskCopy[task.id]?.zhOutput || '') : task.output
const taskBoundary = (task: Task) => zh.value ? (taskCopy[task.id]?.zhBoundary || '') : (task.prohibitions.join(' · ') || 'Governed by Scheduler Manifest')

const taskHasLog = (task: Task) => Boolean(currentRecord.value?.log.some((entry) => entry.runtime === task.name))
const taskStatus = (task: Task): Status => {
  const raw = currentRecord.value?.tasks[task.id] || 'Waiting'
  if (raw === 'Skipped' && !taskHasLog(task)) return 'Waiting'
  return raw
}

const taskRows = computed(() => todayTasks.value.map((task) => ({ task, status: taskStatus(task) })))
const completedCount = computed(() => taskRows.value.filter((row) => row.status === 'Completed').length)
const totalCount = computed(() => taskRows.value.length)
const progress = computed(() => totalCount.value ? Math.round(completedCount.value / totalCount.value * 100) : 0)
const hasRisk = computed(() => taskRows.value.some((row) => ['Blocked', 'Failed'].includes(row.status)))
const allTerminal = computed(() => taskRows.value.length > 0 && taskRows.value.every((row) => ['Completed', 'Skipped', 'Blocked', 'Failed'].includes(row.status)))
const dayState = computed(() => {
  if (!totalCount.value) return 'noPlan'
  if (completedCount.value === totalCount.value) return 'completed'
  if (allTerminal.value) return 'endedIncomplete'
  if (hasRisk.value) return 'risk'
  return 'inProgress'
})
const dayStateLabel = computed(() => text.value[dayState.value as 'noPlan' | 'completed' | 'endedIncomplete' | 'risk' | 'inProgress'])
const nextRow = computed(() => taskRows.value.find((row) => row.status !== 'Completed') || null)
const currentStateLabel = computed(() => {
  const running = taskRows.value.find((row) => row.status === 'Running')
  if (running) return `${statusLabel('Running')}：${taskName(running.task)}`
  if (nextRow.value) return `${text.value.waitingNext}：${nextRow.value.task.time} ${taskName(nextRow.value.task)}`
  return totalCount.value ? text.value.noMore : text.value.noPlan
})

const publicationRows = computed(() => taskRows.value.filter((row) => ['publication', 'weekly', 'academic'].includes(row.task.id)))
const publicationStatus = computed<Status>(() => {
  if (!publicationRows.value.length) return 'Waiting'
  if (publicationRows.value.some((row) => row.status === 'Running')) return 'Running'
  if (publicationRows.value.some((row) => ['Failed', 'Blocked'].includes(row.status))) return publicationRows.value.find((row) => ['Failed', 'Blocked'].includes(row.status))!.status
  if (publicationRows.value.every((row) => row.status === 'Completed')) return 'Completed'
  if (publicationRows.value.every((row) => ['Completed', 'Skipped'].includes(row.status))) return 'Skipped'
  return 'Waiting'
})
const publicationDetail = computed(() => {
  if (publicationStatus.value === 'Completed') return text.value.published
  if (publicationStatus.value === 'Skipped') return text.value.noEligible
  const next = publicationRows.value.find((row) => row.status === 'Waiting')
  return next ? `${next.task.time} · ${text.value.notStarted}` : statusLabel(publicationStatus.value)
})

const logs = computed(() => (currentRecord.value?.log || []).slice(props.compact ? -5 : -12))
const eventMap: Record<string, string> = {
  'Runtime Started': '运行开始', 'Queue Loaded': '队列已加载', 'Eligibility Decision': '资格判断',
  'Deep Reading': '深度阅读', 'Lifecycle Transition': '生命周期转换', 'Commit Verify': '提交验证',
  'Official Source Discovery': '官方来源发现', 'Candidate Scoring': '候选评分', 'Selection Decision': '选择决策',
  'Existing Queue Enrichment': '现有队列补充', 'Queue State Commit': '队列状态提交',
  'Evidence Admission': '证据准入', 'Knowledge Linking': '知识关联', 'Recurring Findings': '重复发现提炼',
  'Architecture Candidates': '架构候选登记', 'Knowledge State Commit': '知识状态提交',
  'Root Cause Confirmed': '根因确认', 'Publication Surfaces Generated': '发布页面已生成', 'Pull Request Validation': '拉取请求验证'
}
const localEvent = (entry: Log) => zh.value ? (eventMap[entry.event] || entry.event) : entry.event
const localRuntime = (entry: Log) => {
  const found = data.schedule.find((task) => task.name === entry.runtime)
  if (found) return taskName(found)
  if (!zh.value) return entry.runtime
  return entry.runtime === 'Research Category Lists Repair' ? '研究类别列表修复' : entry.runtime
}

const runtimePath = computed(() => zh.value ? '/zh/runtime/' : '/en/runtime/')
const releasePath = computed(() => zh.value ? '/zh/publications/research-runtime-scheduler-v1.0' : '/en/publications/research-runtime-scheduler-v1.0')
const recordUrl = (record: RecordItem) => `https://github.com/${record.repository}/blob/main/${record.path}`
const commitUrl = computed(() => currentRecord.value?.commit && currentRecord.value.commit !== 'pending'
  ? `https://github.com/${currentRecord.value.repository}/commit/${currentRecord.value.commit}` : '')
const scheduleLabel = (task: Task) => task.kind === 'daily'
  ? `${task.time} · ${zh.value ? '每日' : 'Daily'}`
  : `${task.time} · ${task.days.map((day) => zh.value ? ({ Monday: '周一', Wednesday: '周三', Sunday: '周日' } as Record<string, string>)[day] || day : day).join(' / ')}`
</script>

<template>
  <section class="runtime-v2" :class="{ compact }">
    <div class="shell">
      <header>
        <div>
          <span class="kicker">{{ text.kicker }}</span>
          <h1>{{ text.title }} <em>V{{ data.schedulerVersion }}</em></h1>
          <p>{{ text.lead }}</p>
        </div>
        <div class="actions">
          <b>{{ text.center }}</b>
          <a :href="withBase(compact ? runtimePath : releasePath)">{{ compact ? text.open : text.charter }} →</a>
        </div>
      </header>

      <section class="overview panel">
        <div class="overview-head">
          <div><span>01</span><h2>{{ text.overview }}</h2></div>
          <small>{{ clock.date }} · {{ data.timezone }}</small>
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
            <strong :class="hasRisk ? 's-failed' : completedCount === totalCount && totalCount ? 's-completed' : 's-running'">{{ dayStateLabel }}</strong>
            <small>{{ currentStateLabel }}</small>
          </article>
          <article>
            <span>{{ text.next }}</span>
            <strong>{{ nextRow ? nextRow.task.time : '—' }}</strong>
            <small>{{ nextRow ? taskName(nextRow.task) : text.noMore }}</small>
          </article>
          <article>
            <span>{{ text.publicationGate }}</span>
            <strong :class="cls(publicationStatus)">{{ statusLabel(publicationStatus) }}</strong>
            <small>{{ publicationDetail }}</small>
          </article>
        </div>
      </section>

      <div class="main-grid">
        <section class="panel tasks-panel">
          <div class="panel-title"><div><span>02</span><h2>{{ text.tasks }}</h2></div><small>{{ completedCount }}/{{ totalCount }}</small></div>
          <div class="task-list">
            <article v-for="row in taskRows" :key="row.task.id" :class="cls(row.status)">
              <time>{{ row.task.time }}</time>
              <i></i>
              <div><strong>{{ taskName(row.task) }}</strong><p>{{ taskDescription(row.task) }}</p></div>
              <b>{{ statusLabel(row.status) }}</b>
            </article>
          </div>
        </section>

        <aside class="panel evidence-panel">
          <div class="panel-title"><div><span>03</span><h2>{{ text.evidence }}</h2></div></div>
          <dl>
            <div>
              <dt>{{ text.githubVerify }}</dt>
              <dd :class="cls(currentRecord?.commitVerify)">{{ currentRecord?.commitVerify === 'Completed' ? text.verified : text.pending }}</dd>
            </div>
            <div>
              <dt>{{ text.commit }}</dt>
              <dd><a v-if="commitUrl && currentRecord" :href="commitUrl">{{ currentRecord.commit.slice(0, 8) }} ↗</a><span v-else>{{ text.pending }}</span></dd>
            </div>
            <div>
              <dt>{{ text.publicationGate }}</dt>
              <dd :class="cls(publicationStatus)">{{ publicationDetail }}</dd>
            </div>
            <div>
              <dt>{{ text.runtimeRecord }}</dt>
              <dd><a v-if="currentRecord" :href="recordUrl(currentRecord)">{{ currentRecord.date }} ↗</a><span v-else>{{ text.empty }}</span></dd>
            </div>
          </dl>
        </aside>
      </div>

      <section class="panel timeline-panel">
        <div class="panel-title"><div><span>04</span><h2>{{ text.timeline }}</h2></div><small>{{ text.source }}</small></div>
        <ol v-if="logs.length">
          <li v-for="(entry, index) in logs" :key="`${entry.time}-${index}`">
            <time>{{ entry.time }}</time><i></i>
            <div><strong>{{ localEvent(entry) }}</strong><span>{{ localRuntime(entry) }}</span><small v-if="!zh">{{ entry.detail }}</small></div>
            <b :class="cls(entry.status)">{{ statusLabel(entry.status) }}</b>
          </li>
        </ol>
        <p v-else class="empty">{{ text.empty }}</p>
      </section>

      <template v-if="!compact">
        <section class="panel schedule-panel">
          <div class="panel-title"><div><span>05</span><h2>{{ text.schedule }}</h2></div><small>{{ text.scheduleNote }}</small></div>
          <div class="schedule-grid">
            <article v-for="task in data.schedule" :key="task.id">
              <div class="task-head"><span>{{ task.id.toUpperCase() }}</span><time>{{ scheduleLabel(task) }}</time></div>
              <h3>{{ taskName(task) }}</h3><p>{{ taskDescription(task) }}</p>
              <dl><div><dt>{{ text.output }}</dt><dd>{{ taskOutput(task) }}</dd></div><div><dt>{{ text.boundary }}</dt><dd>{{ taskBoundary(task) }}</dd></div></dl>
            </article>
          </div>
        </section>

        <section class="panel history-panel">
          <div class="panel-title"><div><span>06</span><h2>{{ text.history }}</h2></div><small>{{ text.source }}</small></div>
          <div v-if="history.length" class="history-list">
            <article v-for="record in history" :key="record.path">
              <time>{{ record.date }}</time>
              <div><strong>{{ zh ? (data.schedule.find((task) => task.name === record.latestTask) ? taskName(data.schedule.find((task) => task.name === record.latestTask)!) : '研究运行记录') : record.latestTask }}</strong><p v-if="!zh">{{ record.output }}</p></div>
              <b :class="cls(record.status)">{{ statusLabel(record.status) }}</b>
              <a :href="recordUrl(record)">{{ text.record }} ↗</a>
            </article>
          </div>
          <p v-else class="empty">{{ text.empty }}</p>
        </section>
        <blockquote>{{ text.principle }}</blockquote>
      </template>
    </div>
  </section>
</template>

<style scoped>
.runtime-v2{--bg:#070a14;--panel:#10172a;--panel-2:#0c1222;--line:rgba(148,163,184,.18);--muted:#8f9cb2;--text:#f5f7ff;--accent:#8b7cff;--green:#78e6aa;--blue:#72d4ff;position:relative;width:100vw;margin-left:calc(50% - 50vw);box-sizing:border-box;overflow:hidden;color:var(--text);background:radial-gradient(circle at 82% 4%,rgba(105,86,255,.18),transparent 30%),linear-gradient(180deg,#080b17,#060912);border-block:1px solid var(--line)}
.shell{width:min(1240px,calc(100% - 48px));margin:auto;padding:68px 0 76px}.runtime-v2 header{display:flex;justify-content:space-between;align-items:flex-end;gap:48px;margin-bottom:24px}.kicker{display:block;margin-bottom:14px;color:#bdb5ff;font:750 11px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.runtime-v2 h1{margin:0;font-size:clamp(40px,5vw,66px);line-height:1;letter-spacing:-.052em}.runtime-v2 h1 em{color:var(--accent);font-style:normal;font-weight:500}.runtime-v2 header p{max-width:760px;margin:20px 0 0;color:#b7c1d3;font-size:16px;line-height:1.75}.actions{display:flex;flex-direction:column;align-items:flex-end;gap:12px}.actions b{padding:8px 12px;color:var(--green);background:rgba(34,197,94,.08);border:1px solid rgba(74,222,128,.2);border-radius:999px;font:750 11px/1 ui-monospace,monospace}.actions a,.runtime-v2 a{color:#c9c4ff;text-decoration:none;font-weight:700}
.panel{padding:26px;background:linear-gradient(145deg,rgba(18,25,46,.98),rgba(9,13,27,.97));border:1px solid var(--line);border-radius:20px;box-shadow:0 22px 70px rgba(0,0,0,.18)}.overview{margin-bottom:16px}.overview-head,.panel-title{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:22px}.overview-head>div,.panel-title>div{display:flex;align-items:center;gap:12px}.overview-head span,.panel-title span{color:var(--accent);font:750 10px/1 ui-monospace,monospace}.overview h2,.panel-title h2{margin:0;font-size:21px;letter-spacing:-.02em}.overview-head small,.panel-title small{color:#75839a}.overview-grid{display:grid;grid-template-columns:1.15fr 1fr 1fr 1fr;gap:12px}.overview-grid article{min-height:142px;padding:20px;background:rgba(5,9,21,.58);border:1px solid var(--line);border-radius:16px}.overview-grid article>span{display:block;color:var(--muted);font-size:11px;letter-spacing:.06em}.overview-grid article>strong{display:block;margin:18px 0 12px;font-size:21px;line-height:1.2}.overview-grid article>small{display:block;color:#8491a7;line-height:1.5}.progress-card strong{font-size:42px!important;letter-spacing:-.06em}.progress-card strong i{color:#728097;font-size:19px;font-style:normal}.progress-bar{height:7px;margin:8px 0 10px;overflow:hidden;background:#202941;border-radius:999px}.progress-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--blue));border-radius:999px}.s-running{color:var(--blue)!important}.s-completed{color:var(--green)!important}.s-blocked{color:#fbbf24!important}.s-failed{color:#fca5a5!important}.s-skipped{color:#94a3b8!important}.s-waiting{color:#c4b5fd!important}
.main-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(300px,.65fr);gap:16px}.task-list article{display:grid;grid-template-columns:64px 13px minmax(0,1fr) auto;gap:14px;align-items:center;min-height:82px;padding:13px 0;border-top:1px solid var(--line)}.task-list article:first-child{border-top:0}.task-list time{color:#d8d4ff;font:750 14px/1 ui-monospace,monospace}.task-list article>i{width:10px;height:10px;border-radius:50%;background:currentColor;box-shadow:0 0 0 5px color-mix(in srgb,currentColor 15%,transparent)}.task-list strong{font-size:14px}.task-list p{margin:6px 0 0;color:#8491a7;font-size:12px;line-height:1.5}.task-list b,.timeline-panel b,.history-list b{padding:7px 9px;border:1px solid currentColor;border-radius:999px;font:750 10px/1 ui-monospace,monospace;white-space:nowrap}.evidence-panel dl{margin:0}.evidence-panel dl>div{padding:17px 0;border-top:1px solid var(--line)}.evidence-panel dl>div:first-child{border-top:0}.evidence-panel dt{color:#79869c;font-size:11px}.evidence-panel dd{margin:7px 0 0;color:#d9deea;font-size:13px;line-height:1.5}
.timeline-panel,.schedule-panel,.history-panel{margin-top:16px}.timeline-panel ol{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 30px;list-style:none;margin:0;padding:0}.timeline-panel li{display:grid;grid-template-columns:46px 12px minmax(0,1fr) auto;gap:10px;min-height:72px}.timeline-panel time{color:#a8b2c5;font:650 12px/1.5 ui-monospace,monospace}.timeline-panel li>i{position:relative;width:8px;height:8px;margin-top:5px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px rgba(139,124,255,.13)}.timeline-panel li>i:after{content:'';position:absolute;top:12px;left:3px;width:1px;height:48px;background:var(--line)}.timeline-panel strong{display:block;font-size:13px}.timeline-panel span,.timeline-panel small{display:block;margin-top:4px;color:#8d99ad;font-size:12px}.timeline-panel small{color:#6f7c93}.schedule-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.schedule-grid article{padding:20px;background:rgba(5,9,21,.58);border:1px solid var(--line);border-radius:15px}.task-head{display:flex;justify-content:space-between;gap:12px}.task-head span{color:var(--accent);font:750 10px/1 ui-monospace,monospace}.task-head time{color:#79869c;font-size:11px}.schedule-grid h3{margin:18px 0 10px;font-size:16px}.schedule-grid>article>p{min-height:58px;margin:0 0 14px;color:#929fb3;font-size:12px;line-height:1.55}.schedule-grid dl{margin:0}.schedule-grid dl div{padding:10px 0;border-top:1px solid var(--line)}.schedule-grid dt{color:#6f7c93;font-size:10px}.schedule-grid dd{margin:5px 0 0;color:#b7c0d1;font-size:11px;line-height:1.45}.history-list article{display:grid;grid-template-columns:100px minmax(0,1fr) auto auto;gap:16px;align-items:center;padding:15px 0;border-top:1px solid var(--line)}.history-list article:first-child{border-top:0}.history-list time{color:#c6cfdf;font:650 12px/1 ui-monospace,monospace}.history-list strong{font-size:13px}.history-list p{margin:5px 0 0;color:#8491a7;font-size:12px}.history-list a{font-size:12px}.runtime-v2 blockquote{margin:16px 0 0;padding:23px 27px;color:#dce0ef;background:linear-gradient(90deg,rgba(139,124,255,.16),rgba(139,124,255,.04));border:1px solid rgba(139,124,255,.24);border-left:3px solid var(--accent);border-radius:13px;font-size:15px;line-height:1.7}.empty{color:#7f8ba1}.compact .shell{padding-block:58px}.compact .schedule-panel,.compact .history-panel,.compact blockquote{display:none}
@media(max-width:1000px){.runtime-v2 header{align-items:flex-start;flex-direction:column}.actions{align-items:flex-start}.overview-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.main-grid{grid-template-columns:1fr}.timeline-panel ol{grid-template-columns:1fr}.schedule-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:640px){.shell{width:calc(100% - 32px);padding:48px 0 56px}.runtime-v2 h1{font-size:40px}.runtime-v2 header p{font-size:15px}.panel{padding:18px}.overview-head,.panel-title{align-items:flex-start;flex-direction:column}.overview-grid{grid-template-columns:1fr}.task-list article{grid-template-columns:50px 10px 1fr}.task-list article>b{grid-column:3;justify-self:start}.timeline-panel li{grid-template-columns:40px 10px 1fr}.timeline-panel b{grid-column:3;justify-self:start}.schedule-grid{grid-template-columns:1fr}.history-list article{grid-template-columns:1fr auto}.history-list article>div,.history-list a{grid-column:1/-1}}
</style>
