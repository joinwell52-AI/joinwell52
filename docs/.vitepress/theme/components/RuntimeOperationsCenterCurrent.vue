<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import runtimeData from '../../generated/runtime-records.json'
import intelligenceData from '../../generated/research-intelligence.json'
import legacyData from '../../generated/runtime-legacy-records.json'
import RuntimeOperationsCenterClassic from './RuntimeOperationsCenterClassic.vue'
import RuntimeOperationsCenterLegacy from './RuntimeOperationsCenterLegacy.vue'

type Lang = 'en' | 'zh'
type DatedRecord = { date: string }
type RuntimeData = {
  today: string
  records: { daily: DatedRecord[] }
  todayDaily: DatedRecord
}
type IntelligenceData = { effectiveDate: string }
type LegacyData = { records: DatedRecord[] }

const props = withDefaults(defineProps<{ lang?: Lang }>(), { lang: 'en' })
const runtime = runtimeData as RuntimeData
const intelligence = intelligenceData as IntelligenceData
const legacy = legacyData as LegacyData
const effectiveDate = intelligence.effectiveDate || '2026-08-05'

const v5Dates = (runtime.records?.daily || [])
  .map((item) => item.date)
  .filter((date) => date >= effectiveDate)
const legacyDates = (legacy.records || [])
  .map((item) => item.date)
  .filter((date) => date < effectiveDate)
const availableDates = [...new Set([runtime.todayDaily?.date, ...v5Dates, ...legacyDates].filter(Boolean))]
  .sort((a, b) => a.localeCompare(b))
const availableDateSet = new Set(availableDates)
const v5DateSet = new Set(v5Dates)
const legacyDateSet = new Set(legacyDates)

const selectedDate = ref(availableDateSet.has(runtime.today) ? runtime.today : availableDates.at(-1) || runtime.today)
const dateError = ref('')
const selectedIndex = computed(() => availableDates.indexOf(selectedDate.value))
const previousDate = computed(() => selectedIndex.value > 0 ? availableDates[selectedIndex.value - 1] : '')
const nextDate = computed(() => selectedIndex.value >= 0 && selectedIndex.value < availableDates.length - 1
  ? availableDates[selectedIndex.value + 1]
  : '')
const useClassic = computed(() => v5DateSet.has(selectedDate.value))
const useLegacy = computed(() => legacyDateSet.has(selectedDate.value))
const minDate = computed(() => availableDates[0] || runtime.today)
const maxDate = computed(() => availableDates.at(-1) || runtime.today)

const copy = computed(() => props.lang === 'zh' ? {
  archive: '每日运行档案',
  hint: '选择有 Runtime Record 的日期，整页切换当天真实工作。',
  today: '今天',
  unavailable: '该日期没有 Runtime Record。'
} : {
  archive: 'Daily Runtime Archive',
  hint: 'Choose a date with a Runtime Record to switch the complete operations page.',
  today: 'Today',
  unavailable: 'No Runtime Record exists for that date.'
})

function syncUrl(date: string, mode: 'push' | 'replace' = 'push') {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  url.searchParams.set('date', date)
  window.history[mode === 'push' ? 'pushState' : 'replaceState']({ runtimeDate: date }, '', url)
}

function selectDate(date: string, mode: 'push' | 'replace' = 'push') {
  if (!availableDateSet.has(date)) {
    dateError.value = copy.value.unavailable
    return
  }
  dateError.value = ''
  selectedDate.value = date
  syncUrl(date, mode)
}

function handleDateInput(event: Event) {
  const input = event.target as HTMLInputElement
  const requested = input.value
  if (!availableDateSet.has(requested)) {
    dateError.value = copy.value.unavailable
    input.value = selectedDate.value
    return
  }
  selectDate(requested)
}

function applyLocationDate(mode: 'replace' | 'none' = 'none') {
  if (typeof window === 'undefined') return
  const requested = new URLSearchParams(window.location.search).get('date')
  if (requested && availableDateSet.has(requested)) {
    selectedDate.value = requested
    dateError.value = ''
    return
  }
  if (requested) dateError.value = copy.value.unavailable
  if (mode === 'replace') syncUrl(selectedDate.value, 'replace')
}

function handlePopState() {
  applyLocationDate()
}

onMounted(() => {
  applyLocationDate('replace')
  window.addEventListener('popstate', handlePopState)
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('popstate', handlePopState)
})
</script>

<template>
  <div class="runtime-date-frame">
    <nav class="runtime-date-nav" aria-label="Runtime date navigation">
      <div class="runtime-date-copy">
        <span aria-hidden="true">CAL</span>
        <div><strong>{{ copy.archive }}</strong><small>{{ copy.hint }}</small></div>
      </div>
      <div class="runtime-date-controls">
        <button type="button" :disabled="!previousDate" :aria-label="previousDate || copy.archive" @click="previousDate && selectDate(previousDate)">‹</button>
        <label>
          <span class="sr-only">{{ copy.archive }}</span>
          <input
            type="date"
            :value="selectedDate"
            :min="minDate"
            :max="maxDate"
            @change="handleDateInput"
          >
        </label>
        <button type="button" :disabled="!nextDate" :aria-label="nextDate || copy.archive" @click="nextDate && selectDate(nextDate)">›</button>
        <button v-if="availableDateSet.has(runtime.today)" type="button" class="today-button" :disabled="selectedDate === runtime.today" @click="selectDate(runtime.today)">{{ copy.today }}</button>
      </div>
      <p v-if="dateError" class="runtime-date-error">{{ dateError }}</p>
    </nav>
  </div>

  <RuntimeOperationsCenterClassic
    v-if="useClassic"
    :key="`v5-${selectedDate}`"
    :lang="props.lang"
    :selected-date="selectedDate"
  />
  <RuntimeOperationsCenterLegacy
    v-else-if="useLegacy"
    :key="`legacy-${selectedDate}`"
    :lang="props.lang"
    :selected-date="selectedDate"
  />
  <div v-else class="runtime-date-empty">{{ copy.unavailable }}</div>
</template>

<style scoped>
.runtime-date-frame{position:relative;z-index:8;width:100vw;margin-left:calc(50% - 50vw);padding-top:18px;background:var(--rt-page-bg,var(--vp-c-bg))}.runtime-date-nav{position:relative;display:flex;align-items:center;justify-content:space-between;gap:20px;width:min(1280px,calc(100% - 52px));margin:0 auto -36px;padding:14px 16px;background:var(--rt-panel-bg,var(--vp-c-bg));border:1px solid var(--rt-line,var(--vp-c-divider));border-radius:16px;box-shadow:0 12px 34px rgba(28,35,70,.08)}.runtime-date-copy{display:flex;align-items:center;gap:12px;min-width:0}.runtime-date-copy>span{display:grid;width:38px;height:38px;place-items:center;color:var(--rt-accent,#6557ff);background:var(--rt-card-accent,rgba(101,87,255,.1));border:1px solid color-mix(in srgb,var(--rt-accent,#6557ff) 28%,transparent);border-radius:11px;font:900 9px/1 ui-monospace,monospace;letter-spacing:.08em}.runtime-date-copy strong{display:block;color:var(--rt-text,var(--vp-c-text-1));font-size:15px}.runtime-date-copy small{display:block;margin-top:3px;color:var(--rt-muted,var(--vp-c-text-2));font-size:12px}.runtime-date-controls{display:flex;align-items:center;gap:8px;flex-shrink:0}.runtime-date-controls button,.runtime-date-controls input{height:38px;color:var(--rt-text,var(--vp-c-text-1));background:var(--rt-card-bg,var(--vp-c-bg));border:1px solid var(--rt-line,var(--vp-c-divider));border-radius:10px;font-weight:760}.runtime-date-controls button{min-width:38px;padding:0 11px;cursor:pointer}.runtime-date-controls button:disabled{cursor:not-allowed;opacity:.38}.runtime-date-controls input{padding:0 12px;font:800 14px/1 ui-monospace,monospace}.runtime-date-controls .today-button{color:var(--rt-link,var(--vp-c-brand-1));padding:0 14px}.runtime-date-error{position:absolute;right:16px;top:100%;margin:5px 0 0;color:var(--rt-failed,#bf2f45);font-size:12px;font-weight:700}.runtime-date-empty{padding:90px 24px;text-align:center;color:var(--vp-c-text-2)}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}@media(max-width:760px){.runtime-date-frame{padding-top:12px}.runtime-date-nav{align-items:flex-start;flex-direction:column;width:calc(100% - 28px);margin-bottom:-24px;padding:13px}.runtime-date-copy small{max-width:280px}.runtime-date-controls{width:100%}.runtime-date-controls label{flex:1}.runtime-date-controls input{width:100%}.runtime-date-controls .today-button{display:none}}
</style>
