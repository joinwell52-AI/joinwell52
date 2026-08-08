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

function compactValue(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(compactValue).filter(Boolean).join(', ')
  return ''
}

function summarizeObject(value: any, lang: Lang, field: string): string {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return compactValue(value)
  const summary = lang === 'zh' ? value.summary_zh : value.summary
  if (summary) return String(summary)
  if (value.instruction) return String(value.instruction)
  if (field === 'output' && value.type) {
    const parts = [String(value.type)]
    if (value.artifact) parts.push(String(value.artifact))
    for (const key of ['signalCount', 'columnDecisions', 'selectedCount', 'noSelectionCount']) {
      if (value[key] !== undefined) parts.push(`${key}: ${value[key]}`)
    }
    return parts.join(' · ')
  }
  const parts: string[] = []
  for (const [key, item] of Object.entries(value)) {
    if (key.endsWith('_zh') || key === 'controlPlane' || typeof item === 'object') continue
    const rendered = compactValue(item)
    if (rendered) parts.push(`${key}: ${rendered}`)
  }
  return parts.length ? parts.join(' · ') : JSON.stringify(value)
}

function normalizeLiveRecord(record: any) {
  if (!record || typeof record !== 'object') return record
  const results = Object.fromEntries(Object.entries(record.results || {}).map(([id, raw]) => {
    const result: any = raw
    if (!result || result.schema !== 'runtime-shift-result/v2') return [id, result]
    const normalizeMetric = (item: any) => {
      const label = item?.label || String(item?.name || 'metric').replaceAll('_', ' ')
      return { label, label_zh: item?.label_zh || label, value: String(item?.value ?? '') }
    }
    const normalizeEvidence = (item: any) => {
      if (typeof item !== 'string') return item
      const label = /^https?:\/\//.test(item) ? item.replace(/^https?:\/\//, '').split('/')[0] : item.split('/').at(-1) || item
      return { label, label_zh: label, source: item }
    }
    const normalizeArtifact = (item: any) => {
      if (typeof item !== 'string') return item
      const label = item.split('/').at(-1) || item
      return { label, label_zh: label, path: item }
    }
    return [id, {
      ...result,
      input: summarizeObject(result.input, 'en', 'input'),
      input_zh: summarizeObject(result.input, 'zh', 'input'),
      workResult: summarizeObject(result.workResult, 'en', 'workResult'),
      workResult_zh: summarizeObject(result.workResult, 'zh', 'workResult'),
      output: summarizeObject(result.output, 'en', 'output'),
      output_zh: summarizeObject(result.output, 'zh', 'output'),
      next: summarizeObject(result.next, 'en', 'next'),
      next_zh: summarizeObject(result.next, 'zh', 'next'),
      reason: summarizeObject(result.reason, 'en', 'reason'),
      reason_zh: summarizeObject(result.reason, 'zh', 'reason'),
      metrics: (result.metrics || []).map(normalizeMetric),
      evidence: (result.evidence || []).map(normalizeEvidence),
      artifacts: (result.artifacts || []).map(normalizeArtifact)
    }]
  }))
  return { ...record, results }
}

if (typeof window !== 'undefined') {
  const marker = '__runtimeV2FetchCompatInstalled__'
  const host = window as typeof window & { [key: string]: unknown }
  if (!host[marker]) {
    const originalFetch = window.fetch.bind(window)
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const response = await originalFetch(...args)
      const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : ''
      if (!response.ok || !/raw\.githubusercontent\.com\/joinwell52-AI\/joinwell52\/main\/research\/runtime\/records\//.test(url)) {
        return response
      }
      try {
        const data = normalizeLiveRecord(await response.clone().json())
        return new Response(JSON.stringify(data), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        })
      } catch {
        return response
      }
    }
    host[marker] = true
  }
}

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
