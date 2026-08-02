<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import runtimeData from '../../generated/runtime-records.json'

type Status = 'Running' | 'Completed' | 'Blocked' | 'Failed' | 'Skipped' | 'Waiting'
type Task = { id: string; name: string; time: string; kind: 'daily' | 'weekly'; days: string[]; responsibility: string; output: string; prohibitions: string[]; skillsRequired: boolean }
type Log = { time: string; runtime: string; event: string; status: Status; detail: string }
type RecordItem = { path: string; date: string; status: Status; latestTask: string; repository: string; commit: string; githubStatus: Status; publicationStatus: Status; queueStatus: Status; engineStatus: Status; output: string; tasks: Record<string, Status>; log: Log[] }
type Data = { today: string; timezone: string; schedulerVersion: string; centerVersion: string; schedule: Task[]; todayTasks: string[]; latest: RecordItem | null; records: RecordItem[] }

const data = runtimeData as Data
const props = withDefaults(defineProps<{ lang?: 'en' | 'zh'; compact?: boolean }>(), { lang: 'en', compact: false })
const zh = computed(() => props.lang === 'zh')
const latest = computed(() => data.latest)
const todayTasks = computed(() => data.schedule.filter((task) => data.todayTasks.includes(task.id)))
const logs = computed(() => latest.value?.log.slice(props.compact ? -6 : -12) || [])
const history = computed(() => data.records.slice(0, props.compact ? 3 : 12))

const text = computed(() => zh.value ? {
  kicker: 'RESEARCH RUNTIME CENTER · 运行控制平面',
  lead: 'Research Runtime Scheduler V1.0 统一调度、记录并验证 Research Operating System 的全部正式运行。Dashboard、Timeline 与 History 全部由 Runtime Record 自动生成。',
  open: '进入 Runtime Center', charter: '查看 Runtime Charter', today: '今日任务', timeline: 'Runtime Timeline',
  architecture: '七个正式 Runtime 任务', history: 'Runtime History', status: 'Runtime Status', github: 'GitHub Status',
  publication: 'Publication Status', queue: 'Queue Status', engine: 'Engine Status', output: '输出', boundary: '边界',
  record: '查看记录', source: '数据来源：Runtime Record', empty: '尚无运行记录。',
  principle: '任何正式 Publication 都必须由 Runtime 驱动并生成 Runtime Record；没有 Runtime Record 的发布，不属于正式运行结果。'
} : {
  kicker: 'RESEARCH RUNTIME CENTER · OPERATIONAL CONTROL PLANE',
  lead: 'Research Runtime Scheduler V1.0 schedules, records and verifies every formal execution of the Research Operating System. Dashboard, Timeline and History are generated from Runtime Records.',
  open: 'Open Runtime Center', charter: 'View Runtime Charter', today: "Today's Tasks", timeline: 'Runtime Timeline',
  architecture: 'Seven formal Runtime tasks', history: 'Runtime History', status: 'Runtime Status', github: 'GitHub Status',
  publication: 'Publication Status', queue: 'Queue Status', engine: 'Engine Status', output: 'Output', boundary: 'Boundary',
  record: 'View record', source: 'Source: Runtime Record', empty: 'No Runtime Record is available.',
  principle: 'Every official Publication must be driven by Runtime and produce a Runtime Record. A publication without a Runtime Record is not an official runtime output.'
})

const runtimePath = computed(() => zh.value ? '/zh/runtime/' : '/en/runtime/')
const releasePath = computed(() => zh.value ? '/zh/publications/research-runtime-scheduler-v1.0' : '/en/publications/research-runtime-scheduler-v1.0')
const cls = (status?: string) => `s-${String(status || 'Waiting').toLowerCase()}`
const taskStatus = (task: Task): Status => latest.value?.date === data.today ? (latest.value.tasks[task.id] || 'Waiting') : 'Waiting'
const schedule = (task: Task) => task.kind === 'daily' ? `${task.time} · ${zh.value ? '每日' : 'Daily'}` : `${task.time} · ${(task.days || []).join(' / ').replace('Monday', zh.value ? '周一' : 'Monday').replace('Wednesday', zh.value ? '周三' : 'Wednesday').replace('Sunday', zh.value ? '周日' : 'Sunday')}`
const boundary = (task: Task) => {
  const map: Record<string, string> = { 'Direct publication': '禁止直接发布', 'Direct research': '禁止直接研究', 'Copying Daily Research': '禁止复制 Daily', 'Ordinary news': '禁止普通新闻' }
  const values = task.prohibitions.map((item) => zh.value ? (map[item] || item) : item)
  if (task.skillsRequired) values.push(zh.value ? '必须使用 Research Skills' : 'Research Skills required')
  return values.join(' · ') || (zh.value ? '受 Scheduler Manifest 约束' : 'Governed by Scheduler Manifest')
}
const recordUrl = (record: RecordItem) => `https://github.com/${record.repository}/blob/main/${record.path}`
const commitUrl = (record: RecordItem) => record.commit && record.commit !== 'pending' ? `https://github.com/${record.repository}/commit/${record.commit}` : ''
</script>

<template>
  <section class="runtime" :class="{ compact }">
    <header>
      <div>
        <span class="kicker">{{ text.kicker }}</span>
        <h2>Research Runtime Center <em>V{{ data.schedulerVersion }}</em></h2>
        <p>{{ text.lead }}</p>
      </div>
      <div class="actions">
        <b>RESEARCH CENTER {{ data.centerVersion }}</b>
        <a :href="withBase(compact ? runtimePath : releasePath)">{{ compact ? text.open : text.charter }} →</a>
      </div>
    </header>

    <div class="status-grid">
      <article><span>{{ text.status }}</span><strong :class="cls(latest?.status)">{{ latest?.status || 'Waiting' }}</strong><small>{{ latest?.latestTask || 'Research Runtime Scheduler' }}</small></article>
      <article><span>{{ text.github }}</span><strong :class="cls(latest?.githubStatus)">{{ latest?.githubStatus || 'Waiting' }}</strong><small><a v-if="latest && commitUrl(latest)" :href="commitUrl(latest)">{{ latest.commit.slice(0, 8) }} ↗</a><template v-else>Commit pending</template></small></article>
      <article><span>{{ text.publication }}</span><strong :class="cls(latest?.publicationStatus)">{{ latest?.publicationStatus || 'Waiting' }}</strong><small>Runtime Gate</small></article>
      <article><span>{{ text.queue }}</span><strong :class="cls(latest?.queueStatus)">{{ latest?.queueStatus || 'Waiting' }}</strong><small>Candidate · Priority · Lifecycle</small></article>
      <article><span>{{ text.engine }}</span><strong :class="cls(latest?.engineStatus)">{{ latest?.engineStatus || 'Waiting' }}</strong><small>Signal → Release</small></article>
    </div>

    <div class="two-col">
      <section class="panel">
        <div class="panel-title"><h3>{{ text.today }}</h3><small>{{ data.today }} · {{ data.timezone }}</small></div>
        <div class="task-list">
          <article v-for="task in todayTasks" :key="task.id">
            <time>{{ task.time }}</time><div><strong>{{ task.name }}</strong><p>{{ task.responsibility }}</p></div><b :class="cls(taskStatus(task))">{{ taskStatus(task) }}</b>
          </article>
        </div>
      </section>

      <section class="panel timeline">
        <div class="panel-title"><h3>{{ text.timeline }}</h3><small>{{ text.source }}</small></div>
        <ol v-if="logs.length">
          <li v-for="(entry, index) in logs" :key="`${entry.time}-${index}`"><time>{{ entry.time }}</time><i></i><div><strong>{{ entry.event }}</strong><span>{{ entry.runtime }}</span><small>{{ entry.detail }}</small></div><b :class="cls(entry.status)">{{ entry.status }}</b></li>
        </ol>
        <p v-else class="empty">{{ text.empty }}</p>
      </section>
    </div>

    <template v-if="!compact">
      <section class="panel wide">
        <div class="panel-title"><h3>{{ text.architecture }}</h3><small>Scheduler Manifest · Single Source</small></div>
        <div class="architecture">
          <article v-for="task in data.schedule" :key="task.id"><div class="task-head"><span>{{ task.id.toUpperCase() }}</span><time>{{ schedule(task) }}</time></div><h4>{{ task.name }}</h4><p>{{ task.responsibility }}</p><dl><div><dt>{{ text.output }}</dt><dd>{{ task.output }}</dd></div><div><dt>{{ text.boundary }}</dt><dd>{{ boundary(task) }}</dd></div></dl></article>
        </div>
      </section>

      <section class="panel wide">
        <div class="panel-title"><h3>{{ text.history }}</h3><small>{{ text.source }}</small></div>
        <div v-if="history.length" class="history">
          <article v-for="record in history" :key="record.path"><time>{{ record.date }}</time><div><strong>{{ record.latestTask }}</strong><p>{{ record.output }}</p></div><b :class="cls(record.status)">{{ record.status }}</b><a :href="recordUrl(record)">{{ text.record }} ↗</a></article>
        </div>
        <p v-else class="empty">{{ text.empty }}</p>
      </section>
      <blockquote>{{ text.principle }}</blockquote>
    </template>
  </section>
</template>

<style scoped>
.runtime{--bg:#080b18;--panel:#11172b;--line:rgba(148,163,184,.18);--muted:#97a3b8;--text:#f4f7ff;--accent:#8b7cff;position:relative;margin:0 auto;padding:72px max(24px,calc((100vw - 1220px)/2));overflow:hidden;color:var(--text);background:radial-gradient(circle at 82% 8%,rgba(101,80,255,.18),transparent 32%),var(--bg);border-block:1px solid var(--line)}
.runtime header{display:flex;justify-content:space-between;align-items:flex-end;gap:42px;margin-bottom:30px}.kicker{display:block;margin-bottom:13px;color:#bbb3ff;font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.15em}.runtime h2{margin:0;color:var(--text);font-size:clamp(36px,5vw,62px);line-height:1;letter-spacing:-.045em}.runtime h2 em{color:var(--accent);font-style:normal;font-weight:500}.runtime header p{max-width:760px;margin:19px 0 0;color:#b5bfd1;font-size:16px;line-height:1.7}.actions{display:flex;flex-direction:column;align-items:flex-end;gap:12px}.actions b{padding:8px 11px;color:#7ee7ba;background:rgba(34,197,94,.08);border:1px solid rgba(74,222,128,.2);border-radius:999px;font:700 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace}.actions a,.history a{color:#c8c2ff;text-decoration:none;font-weight:700}
.status-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-bottom:16px}.status-grid article,.panel{background:linear-gradient(145deg,rgba(21,28,52,.96),rgba(10,14,29,.94));border:1px solid var(--line);box-shadow:0 20px 60px rgba(0,0,0,.16)}.status-grid article{min-height:126px;padding:19px;border-radius:16px}.status-grid span{display:block;color:var(--muted);font-size:11px;letter-spacing:.07em;text-transform:uppercase}.status-grid strong{display:block;margin:14px 0 9px;font:700 20px/1 ui-monospace,SFMono-Regular,Menlo,monospace}.status-grid small{color:#8491a7}.status-grid small a{color:inherit;text-decoration:none}.s-running{color:#7dd3fc!important}.s-completed{color:#86efac!important}.s-blocked{color:#fbbf24!important}.s-failed{color:#fca5a5!important}.s-skipped{color:#94a3b8!important}.s-waiting{color:#c4b5fd!important}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px}.panel{padding:25px;border-radius:18px}.wide{margin-top:16px}.panel-title{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:20px}.panel-title h3{margin:0;color:var(--text);font-size:20px}.panel-title small{color:#77849a}.task-list article{display:grid;grid-template-columns:58px minmax(0,1fr) auto;gap:13px;align-items:center;padding:14px 0;border-top:1px solid var(--line)}.task-list article:first-child{border-top:0}.task-list time{color:#d8d4ff;font:700 13px/1 ui-monospace,SFMono-Regular,Menlo,monospace}.task-list strong,.timeline strong,.history strong{color:var(--text);font-size:13px}.task-list p,.history p{margin:5px 0 0;color:#8491a7;font-size:12px;line-height:1.45}.task-list b,.timeline b,.history b{padding:6px 8px;border:1px solid currentColor;border-radius:999px;font:700 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace}
.timeline ol{list-style:none;margin:0;padding:0}.timeline li{display:grid;grid-template-columns:44px 11px minmax(0,1fr) auto;gap:9px;min-height:62px}.timeline time{color:#a8b2c5;font:600 12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace}.timeline i{position:relative;width:7px;height:7px;margin-top:5px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px rgba(139,124,255,.12)}.timeline i:after{content:'';position:absolute;top:11px;left:3px;width:1px;height:43px;background:var(--line)}.timeline li:last-child i:after{display:none}.timeline span,.timeline small{display:block;margin-top:3px;color:#8e9ab0;font-size:12px}.timeline small{color:#6f7c93}.architecture{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.architecture article{padding:19px;background:rgba(7,11,25,.68);border:1px solid var(--line);border-radius:14px}.task-head{display:flex;justify-content:space-between;gap:10px}.task-head span{color:var(--accent);font:700 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace}.task-head time{color:#7f8ba1;font-size:11px}.architecture h4{margin:17px 0 9px;color:var(--text)}.architecture>article>p{min-height:56px;margin:0 0 14px;color:#97a3b8;font-size:12px;line-height:1.5}.architecture dl{margin:0}.architecture dl div{padding:9px 0;border-top:1px solid var(--line)}.architecture dt{color:#6f7c93;font-size:10px;text-transform:uppercase}.architecture dd{margin:5px 0 0;color:#b4bed0;font-size:11px;line-height:1.45}.history article{display:grid;grid-template-columns:100px minmax(0,1fr) auto auto;gap:15px;align-items:center;padding:14px 0;border-top:1px solid var(--line)}.history article:first-child{border-top:0}.history time{color:#c6cfdf;font:600 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace}.history a{font-size:12px}.runtime blockquote{margin:16px 0 0;padding:23px 27px;color:#dce0ef;background:linear-gradient(90deg,rgba(139,124,255,.16),rgba(139,124,255,.04));border:1px solid rgba(139,124,255,.24);border-left:3px solid var(--accent);border-radius:12px;font-size:16px;line-height:1.7}.empty{color:#7f8ba1}.compact{padding-block:64px}.compact header{margin-bottom:27px}
@media(max-width:980px){.runtime header{align-items:flex-start;flex-direction:column}.actions{align-items:flex-start}.status-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.two-col{grid-template-columns:1fr}.architecture{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:640px){.runtime{padding:50px 18px}.runtime h2{font-size:38px}.status-grid{grid-template-columns:1fr 1fr}.status-grid article:first-child{grid-column:1/-1}.panel{padding:18px}.panel-title{align-items:flex-start;flex-direction:column}.task-list article{grid-template-columns:50px 1fr}.task-list article>b{grid-column:2;justify-self:start}.timeline li{grid-template-columns:40px 10px 1fr}.timeline b{grid-column:3;justify-self:start}.architecture{grid-template-columns:1fr}.history article{grid-template-columns:1fr auto}.history article>div,.history a{grid-column:1/-1}}
</style>
