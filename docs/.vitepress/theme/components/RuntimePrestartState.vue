<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import runtimeData from '../../generated/runtime-records.json'

type Task = { id:string; name:string; name_zh:string; schedule:{ kind:string; time:string; days?:string[] } }
type RuntimeData = { today:string; schedule:Task[]; records?:{ daily?:Array<{date:string}> } }
const props = withDefaults(defineProps<{ lang?:'zh'|'en' }>(), { lang:'en' })
const runtime = runtimeData as RuntimeData
const activated = ref(false)
const requestedDate = ref('')
let timer: ReturnType<typeof setInterval> | undefined

const weekday = (date:string) => ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date(`${date}T12:00:00Z`).getUTCDay()]
const runsToday = (task:Task) => task.schedule.kind === 'daily' || (task.schedule.kind === 'weekly' && (task.schedule.days || []).includes(weekday(runtime.today)))
const tasks = computed(() => (runtime.schedule || []).filter(runsToday).sort((a,b)=>a.schedule.time.localeCompare(b.schedule.time)))
const hasBuiltRecord = computed(() => (runtime.records?.daily || []).some(item => item.date === runtime.today))
const isTodayRequest = computed(() => !requestedDate.value || requestedDate.value === runtime.today)
const visible = computed(() => isTodayRequest.value && !hasBuiltRecord.value && !activated.value)
const zh = computed(() => props.lang === 'zh')

async function checkActivation(){
  if (typeof window === 'undefined' || !visible.value) return
  const [year,month] = runtime.today.split('-')
  const url = `https://raw.githubusercontent.com/joinwell52-AI/joinwell52/main/research/runtime/records/daily/${year}/${month}/${runtime.today}-daily-runtime.json?t=${Date.now()}`
  try {
    const response = await fetch(url,{cache:'no-store'})
    if (!response.ok) return
    const record = await response.json()
    if (record?.date === runtime.today) {
      activated.value = true
      window.location.reload()
    }
  } catch {}
}

onMounted(()=>{
  requestedDate.value = new URLSearchParams(window.location.search).get('date') || runtime.today
  void checkActivation()
  timer = setInterval(checkActivation,60_000)
})
onBeforeUnmount(()=>{ if(timer) clearInterval(timer) })
</script>

<template>
  <section v-if="visible" class="runtime-prestart" aria-live="polite">
    <div class="prestart-inner">
      <span class="eyebrow">RESEARCH RUNTIME · {{ runtime.today }}</span>
      <h1>{{ zh ? '今日研究运行尚未启动' : "Today's Research Runtime has not started" }}</h1>
      <p>{{ zh ? '今天的 Daily Runtime Record 还没有生成，这是 09:00 调度启动前的正常状态。页面会自动检查启动记录。' : 'The Daily Runtime Record has not been created yet. This is the normal pre-start state before the 09:00 scheduler slot. The page will check automatically for activation.' }}</p>
      <div class="next-shift" v-if="tasks.length">
        <small>{{ zh ? '首个计划班次' : 'First scheduled shift' }}</small>
        <strong>{{ tasks[0].schedule.time }}</strong>
        <b>{{ zh ? tasks[0].name_zh : tasks[0].name }}</b>
      </div>
      <div class="schedule" v-if="tasks.length">
        <span v-for="task in tasks" :key="task.id"><b>{{task.schedule.time}}</b>{{ zh ? task.name_zh : task.name }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.runtime-prestart{width:100%;padding:34px 0 16px;background:var(--vp-c-bg)}
.prestart-inner{width:min(1280px,calc(100% - 52px));margin:auto;padding:32px;border:1px solid var(--vp-c-divider);border-radius:22px;background:var(--vp-c-bg-soft)}
.eyebrow{color:var(--vp-c-brand-1);font:800 12px/1.4 ui-monospace,monospace;letter-spacing:.08em}.prestart-inner h1{margin:12px 0 0;font-size:clamp(32px,5vw,54px);line-height:1.08}.prestart-inner p{max-width:820px;margin:18px 0;color:var(--vp-c-text-2);font-size:16px;line-height:1.7}.next-shift{display:grid;grid-template-columns:auto auto 1fr;gap:10px;align-items:center;margin-top:22px;padding:16px;border:1px solid var(--vp-c-divider);border-radius:14px;background:var(--vp-c-bg)}.next-shift small{color:var(--vp-c-text-2)}.next-shift strong{font:900 24px/1 ui-monospace,monospace;color:var(--vp-c-brand-1)}.next-shift b{font-size:16px}.schedule{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.schedule span{display:flex;gap:7px;align-items:center;padding:8px 10px;border:1px solid var(--vp-c-divider);border-radius:999px;color:var(--vp-c-text-2);font-size:12px;background:var(--vp-c-bg)}.schedule b{color:var(--vp-c-text-1);font-family:ui-monospace,monospace}
:global(body:has(.runtime-prestart) .runtime-date-empty){display:none!important}
@media(max-width:699px){.runtime-prestart{padding:18px 0 8px}.prestart-inner{width:calc(100% - 24px);padding:20px;border-radius:17px}.prestart-inner h1{font-size:32px}.prestart-inner p{font-size:14px}.next-shift{grid-template-columns:1fr auto}.next-shift small{grid-column:1/-1}.next-shift strong{font-size:22px}.next-shift b{text-align:right}.schedule{display:grid;grid-template-columns:1fr 1fr}.schedule span{border-radius:12px;align-items:flex-start;flex-direction:column}}
</style>