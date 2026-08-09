<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import runtimeData from '../../generated/runtime-records.json'

type Lang = 'en' | 'zh'
type RawStatus = 'Running' | 'Completed' | 'Blocked' | 'Failed' | 'Skipped' | 'Waiting'
type Task = {
  id: string
  family: 'daily' | 'weekly' | 'academic' | 'program'
  name: string
  name_zh: string
  schedule: { kind: string; time: string; days?: string[] }
}
type RecordShape = {
  date: string
  taskStatus?: Record<string, RawStatus>
  results?: Record<string, any>
}
type RuntimeData = {
  today: string
  timezone: string
  schedule: Task[]
  todayDaily: RecordShape
  latest: Record<string, RecordShape | null>
}

type DisplayState = 'completed' | 'running' | 'catching-up' | 'overdue' | 'waiting-dependency' | 'recoverable' | 'order-error' | 'future' | 'failed' | 'skipped'

const props = withDefaults(defineProps<{ lang?: Lang }>(), { lang: 'en' })
const data = runtimeData as RuntimeData
const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null

const dependencyOf: Record<string, string> = {
  queue: 'discovery',
  reading: 'queue',
  analysis: 'reading',
  production: 'analysis',
  publication: 'production',
  weekly: 'publication'
}

const text = computed(() => props.lang === 'zh' ? {
  title: 'V2.0 顺序恢复进程',
  lead: '到点只触发检查；前面欠班必须先补完并通过自检，后面的工作才允许启动。',
  completed: '已完成',
  current: '当前处理',
  next: '下一环',
  none: '无',
  states: {
    completed: '已完成', running: '运行中', 'catching-up': '补班中', overdue: '欠班待补',
    'waiting-dependency': '等待前置', recoverable: '待恢复', 'order-error': '顺序异常', future: '未到时间', failed: '失败', skipped: '已跳过'
  } as Record<DisplayState, string>,
  orderError: '检测到后置任务在前置未完成时已经 Running。Scheduler 会在下一次 reconcile 自动退回 Waiting，并保留纠正事件。',
  idle: '当前没有需要补的工作；系统等待下一正式时间点。',
  waiting: '正在等待前置阶段完成。',
  overdue: '存在已到时间但尚未完成的工作，Scheduler 会从最早可执行的一环开始补。'
} : {
  title: 'V2.0 Ordered Recovery Progress',
  lead: 'Clock time triggers reconciliation only. Earlier missed work must complete and pass checks before downstream work may start.',
  completed: 'Completed',
  current: 'Current',
  next: 'Next',
  none: 'None',
  states: {
    completed: 'Completed', running: 'Running', 'catching-up': 'Catching up', overdue: 'Overdue',
    'waiting-dependency': 'Waiting prerequisite', recoverable: 'Ready to recover', 'order-error': 'Order violation', future: 'Not due', failed: 'Failed', skipped: 'Skipped'
  } as Record<DisplayState, string>,
  orderError: 'A downstream task is Running before its prerequisite completed. The next Scheduler reconcile will return it to Waiting and preserve a correction event.',
  idle: 'No catch-up work is currently required; waiting for the next formal time.',
  waiting: 'Waiting for the prerequisite stage to complete.',
  overdue: 'Due work is incomplete. Scheduler will recover the oldest runnable stage first.'
})

function zonedParts(date: Date) {
  return Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: data.timezone,
    year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(date).map((part) => [part.type, part.value])) as Record<string, string>
}

const parts = computed(() => zonedParts(now.value))
const nowMinutes = computed(() => Number(parts.value.hour) * 60 + Number(parts.value.minute))
const weekday = computed(() => parts.value.weekday)

const tasksToday = computed(() => data.schedule
  .filter((task) => task.family === 'daily' || (task.id === 'weekly' && task.schedule.days?.includes(weekday.value)))
  .sort((a, b) => a.schedule.time.localeCompare(b.schedule.time)))

function recordFor(task: Task): RecordShape | null {
  if (task.family === 'daily') return data.todayDaily
  const record = data.latest?.[task.family]
  return record?.date === data.today ? record : null
}

function rawStatus(task: Task): RawStatus {
  return recordFor(task)?.taskStatus?.[task.id] || 'Waiting'
}

function scheduledMinutes(task: Task) {
  const [hour, minute] = task.schedule.time.split(':').map(Number)
  return hour * 60 + minute
}

function dependencyReady(task: Task) {
  const dependency = dependencyOf[task.id]
  if (!dependency) return true
  const prerequisite = tasksToday.value.find((item) => item.id === dependency)
  return prerequisite ? rawStatus(prerequisite) === 'Completed' : false
}

function displayState(task: Task): DisplayState {
  const status = rawStatus(task)
  const due = scheduledMinutes(task) <= nowMinutes.value
  const dependency = dependencyOf[task.id]
  const ready = dependencyReady(task)

  if (status === 'Completed') return 'completed'
  if (status === 'Failed') return 'failed'
  if (status === 'Skipped') return 'skipped'
  if (status === 'Running') {
    if (dependency && !ready) return 'order-error'
    return nowMinutes.value - scheduledMinutes(task) > 5 ? 'catching-up' : 'running'
  }
  if (status === 'Blocked') return ready ? 'recoverable' : 'waiting-dependency'
  if (!due) return 'future'
  if (!ready) return 'waiting-dependency'
  return 'overdue'
}

const rows = computed(() => tasksToday.value.map((task) => ({ task, state: displayState(task), status: rawStatus(task) })))
const completedCount = computed(() => rows.value.filter((row) => row.status === 'Completed' || row.status === 'Skipped').length)
const orderError = computed(() => rows.value.some((row) => row.state === 'order-error'))
const firstOpen = computed(() => rows.value.find((row) => !['completed', 'skipped'].includes(row.state)) || null)
const currentRow = computed(() => rows.value.find((item) => ['running', 'catching-up', 'order-error'].includes(item.state)) || firstOpen.value)
const currentLabel = computed(() => currentRow.value ? (props.lang === 'zh' ? currentRow.value.task.name_zh : currentRow.value.task.name) : text.value.none)
const nextLabel = computed(() => {
  const currentIndex = currentRow.value ? rows.value.findIndex((row) => row.task.id === currentRow.value?.task.id) : -1
  const next = currentIndex >= 0 ? rows.value.slice(currentIndex + 1).find((row) => !['completed', 'skipped'].includes(row.state)) : null
  return next ? (props.lang === 'zh' ? next.task.name_zh : next.task.name) : text.value.none
})
const summary = computed(() => {
  if (orderError.value) return text.value.orderError
  if (rows.value.some((row) => ['overdue', 'recoverable', 'catching-up'].includes(row.state))) return text.value.overdue
  if (rows.value.some((row) => row.state === 'waiting-dependency')) return text.value.waiting
  return text.value.idle
})

onMounted(() => {
  now.value = new Date()
  timer = setInterval(() => { now.value = new Date() }, 60_000)
})
onBeforeUnmount(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <section class="recovery-progress" :class="{ danger: orderError }">
    <header>
      <div>
        <small>RECONCILE · {{ data.timezone }}</small>
        <h2>{{ text.title }}</h2>
        <p>{{ text.lead }}</p>
      </div>
      <strong>{{ completedCount }}/{{ rows.length }} {{ text.completed }}</strong>
    </header>

    <div class="recovery-summary">
      <div><span>{{ text.current }}</span><b>{{ currentLabel }}</b></div>
      <div><span>{{ text.next }}</span><b>{{ nextLabel }}</b></div>
      <p>{{ summary }}</p>
    </div>

    <div class="recovery-chain">
      <article v-for="row in rows" :key="row.task.id" :class="`state-${row.state}`">
        <time>{{ row.task.schedule.time }}</time>
        <b>{{ props.lang === 'zh' ? row.task.name_zh : row.task.name }}</b>
        <span>{{ text.states[row.state] }}</span>
      </article>
    </div>
  </section>
</template>

<style scoped>
.recovery-progress{max-width:1180px;margin:18px auto 22px;padding:20px;border:1px solid var(--vp-c-divider);border-radius:18px;background:var(--vp-c-bg-soft)}
.recovery-progress.danger{border-color:var(--vp-c-danger-1)}
.recovery-progress header{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}
.recovery-progress header small{font-size:11px;letter-spacing:.12em;color:var(--vp-c-text-2)}
.recovery-progress h2{margin:5px 0 6px;font-size:22px}
.recovery-progress header p{margin:0;color:var(--vp-c-text-2);max-width:760px}
.recovery-progress header>strong{white-space:nowrap;padding:8px 12px;border-radius:999px;background:var(--vp-c-bg);border:1px solid var(--vp-c-divider)}
.recovery-summary{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;margin:16px 0}
.recovery-summary>div{padding:12px;border-radius:12px;background:var(--vp-c-bg)}
.recovery-summary span{display:block;font-size:12px;color:var(--vp-c-text-2);margin-bottom:3px}
.recovery-summary p{grid-column:1/-1;margin:0;padding:10px 12px;border-left:3px solid var(--vp-c-brand-1);background:var(--vp-c-bg)}
.danger .recovery-summary p{border-left-color:var(--vp-c-danger-1)}
.recovery-chain{display:grid;grid-template-columns:repeat(auto-fit,minmax(132px,1fr));gap:8px}
.recovery-chain article{display:flex;flex-direction:column;gap:3px;min-height:92px;padding:11px;border-radius:12px;border:1px solid var(--vp-c-divider);background:var(--vp-c-bg)}
.recovery-chain time{font-size:12px;color:var(--vp-c-text-2)}
.recovery-chain b{font-size:13px;line-height:1.25}
.recovery-chain span{margin-top:auto;font-size:12px;font-weight:700}
.state-completed{opacity:.72}
.state-running,.state-catching-up{border-color:var(--vp-c-brand-1)!important}
.state-overdue,.state-recoverable{border-color:var(--vp-c-warning-1)!important}
.state-order-error{border-color:var(--vp-c-danger-1)!important;background:color-mix(in srgb,var(--vp-c-danger-soft) 45%,var(--vp-c-bg))!important}
.state-waiting-dependency,.state-future{opacity:.78}
@media(max-width:700px){.recovery-progress{margin:12px 12px 18px;padding:15px}.recovery-progress header{flex-direction:column}.recovery-summary{grid-template-columns:1fr}.recovery-summary p{grid-column:1}.recovery-chain{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style>
