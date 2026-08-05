from pathlib import Path

path = Path('docs/.vitepress/theme/components/RuntimeOperationsCenterClassic.vue')
text = path.read_text(encoding='utf-8')

start = text.index("const liveRecord = ref<RecordItem | null>(null)")
end = text.index("const tasks = computed", start)
replacement = r'''const liveRecord = ref<RecordItem | null>(null)
const refreshing = ref(false)
const record = computed(() => liveRecord.value || runtime.todayDaily)
let liveEtag = ''

const decodeBase64Utf8 = (value: string) => {
  const binary = atob(value.replace(/\s/g, ''))
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

const refreshLiveRecord = async () => {
  if (typeof window === 'undefined' || refreshing.value) return
  const [year, month] = runtime.today.split('-')
  const path = `research/runtime/records/daily/${year}/${month}/${runtime.today}-daily-runtime.json`
  const url = `https://api.github.com/repos/joinwell52-AI/joinwell52/contents/${path}?ref=main`
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  }
  if (liveEtag) headers['If-None-Match'] = liveEtag

  refreshing.value = true
  try {
    const response = await fetch(url, { cache: 'no-store', headers })
    if (response.status === 304) return
    if (!response.ok) return
    const payload = await response.json() as { content?: string; encoding?: string }
    if (payload.encoding !== 'base64' || !payload.content) return
    const next = JSON.parse(decodeBase64Utf8(payload.content)) as RecordItem
    if (next.date === runtime.today) {
      liveRecord.value = next
      liveEtag = response.headers.get('etag') || liveEtag
    }
  } catch {
    // Preserve the latest known record while GitHub is temporarily unavailable.
  } finally {
    refreshing.value = false
  }
}

const ACTIVE_REFRESH_MS = 60_000
const IDLE_REFRESH_MS = 300_000
const WINDOW_BEFORE_MINUTES = 2
const WINDOW_AFTER_MINUTES = 20
let liveRefreshTimer: ReturnType<typeof setTimeout> | undefined

const shanghaiMinuteOfDay = () => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: runtime.timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(new Date()).map((part) => [part.type, part.value]))
  return Number(parts.hour) * 60 + Number(parts.minute) + Number(parts.second) / 60
}

const scheduleWindow = () => {
  const now = shanghaiMinuteOfDay()
  let active = false
  let minutesUntilNextWindow = Number.POSITIVE_INFINITY
  for (const task of runtime.schedule.filter((item) => item.family === 'daily')) {
    const [hour, minute] = task.schedule.time.split(':').map(Number)
    const scheduled = hour * 60 + minute
    const windowStart = scheduled - WINDOW_BEFORE_MINUTES
    const windowEnd = scheduled + WINDOW_AFTER_MINUTES
    if (now >= windowStart && now <= windowEnd) active = true
    let untilStart = windowStart - now
    if (untilStart <= 0) untilStart += 24 * 60
    minutesUntilNextWindow = Math.min(minutesUntilNextWindow, untilStart)
  }
  return {
    active,
    nextWindowMs: Number.isFinite(minutesUntilNextWindow)
      ? Math.max(1_000, Math.ceil(minutesUntilNextWindow * 60_000))
      : IDLE_REFRESH_MS
  }
}

const scheduleLiveRefresh = () => {
  if (typeof document === 'undefined') return
  if (liveRefreshTimer) clearTimeout(liveRefreshTimer)
  if (document.hidden) {
    liveRefreshTimer = undefined
    return
  }
  const isWorking = Object.values(record.value.taskStatus || {}).includes('Running')
  const window = scheduleWindow()
  const delay = isWorking || window.active
    ? ACTIVE_REFRESH_MS
    : Math.min(IDLE_REFRESH_MS, window.nextWindowMs)
  liveRefreshTimer = setTimeout(async () => {
    await refreshLiveRecord()
    scheduleLiveRefresh()
  }, delay)
}

const manualRefresh = () => {
  void refreshLiveRecord().finally(scheduleLiveRefresh)
}

const handleVisibilityChange = () => {
  if (typeof document === 'undefined') return
  if (document.hidden) {
    if (liveRefreshTimer) clearTimeout(liveRefreshTimer)
    liveRefreshTimer = undefined
    return
  }
  manualRefresh()
}

onMounted(() => {
  manualRefresh()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})
onBeforeUnmount(() => {
  if (liveRefreshTimer) clearTimeout(liveRefreshTimer)
  if (typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
})
'''
text = text[:start] + replacement + text[end:]

text = text.replace(
    "  waiting: '待执行',\n  noMore: '今日计划已结束',",
    "  waiting: '待执行',\n  refresh: '立即刷新状态',\n  refreshing: '正在刷新…',\n  noMore: '今日计划已结束',"
)
text = text.replace(
    "  waiting: 'Waiting',\n  noMore: \"Today's plan has ended\",",
    "  waiting: 'Waiting',\n  refresh: 'Refresh status',\n  refreshing: 'Refreshing…',\n  noMore: \"Today's plan has ended\","
)

old_title = '''        <div class="section-title">
          <div><span>01</span><h2>{{ copy.operations }}</h2></div>
          <small>{{ runtime.today }} · {{ runtime.timezone }}</small>
        </div>'''
new_title = '''        <div class="section-title">
          <div><span>01</span><h2>{{ copy.operations }}</h2></div>
          <div class="status-tools">
            <small>{{ runtime.today }} · {{ runtime.timezone }}</small>
            <button type="button" :disabled="refreshing" @click="manualRefresh">
              {{ refreshing ? copy.refreshing : copy.refresh }}
            </button>
          </div>
        </div>'''
if old_title not in text:
    raise SystemExit('overview title block not found')
text = text.replace(old_title, new_title, 1)

css_anchor = ".section-title small,.section-lead{color:#7f8ca2}"
css_extra = ".section-title small,.section-lead{color:#7f8ca2}.status-tools{display:flex;align-items:center;gap:12px}.status-tools button{padding:8px 12px;color:#c8e9ff;background:#0a1020;border:1px solid var(--line);border-radius:999px;font:700 11px/1 ui-monospace,monospace;cursor:pointer}.status-tools button:hover{border-color:#72d6ff}.status-tools button:disabled{opacity:.55;cursor:wait}"
if css_anchor not in text:
    raise SystemExit('CSS anchor not found')
text = text.replace(css_anchor, css_extra, 1)

checks = [
    'api.github.com/repos/joinwell52-AI/joinwell52/contents/',
    "headers['If-None-Match'] = liveEtag",
    'WINDOW_BEFORE_MINUTES = 2',
    'WINDOW_AFTER_MINUTES = 20',
    'Math.min(IDLE_REFRESH_MS, window.nextWindowMs)',
    '立即刷新状态',
    '@click="manualRefresh"'
]
for check in checks:
    if check not in text:
        raise SystemExit(f'missing expected implementation: {check}')

path.write_text(text, encoding='utf-8')
