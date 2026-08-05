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
  unavailable: '该日期没有 Runtime Record。'
} : {
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
  <RuntimeOperationsCenterClassic
    v-if="useClassic"
    :key="`v5-${selectedDate}`"
    :lang="props.lang"
    :selected-date="selectedDate"
    :previous-date="previousDate"
    :next-date="nextDate"
    :min-date="minDate"
    :max-date="maxDate"
    :today-date="availableDateSet.has(runtime.today) ? runtime.today : ''"
    :date-error="dateError"
    @select-date="selectDate"
    @date-input="selectDate"
  />
  <RuntimeOperationsCenterLegacy
    v-else-if="useLegacy"
    :key="`legacy-${selectedDate}`"
    :lang="props.lang"
    :selected-date="selectedDate"
    :previous-date="previousDate"
    :next-date="nextDate"
    :min-date="minDate"
    :max-date="maxDate"
    :today-date="availableDateSet.has(runtime.today) ? runtime.today : ''"
    :date-error="dateError"
    @select-date="selectDate"
    @date-input="selectDate"
  />
  <div v-else class="runtime-date-empty">{{ copy.unavailable }}</div>
</template>

<style scoped>
.runtime-date-empty{padding:90px 24px;text-align:center;color:var(--vp-c-text-2)}
</style>
