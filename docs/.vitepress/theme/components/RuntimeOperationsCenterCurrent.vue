<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import runtimeData from '../../generated/runtime-records.json'
import intelligenceData from '../../generated/research-intelligence.json'
import legacyData from '../../generated/runtime-legacy-records.json'
import RuntimeOperationsCenterClassic from './RuntimeOperationsCenterClassic.vue'
import RuntimeOperationsCenterLegacy from './RuntimeOperationsCenterLegacy.vue'

type Lang = 'en' | 'zh'
type DatedRecord = { date: string }
type RuntimeData = { today: string; records: { daily: DatedRecord[] }; todayDaily: DatedRecord }
type IntelligenceData = { effectiveDate: string }
type LegacyData = { records: DatedRecord[] }

const props = withDefaults(defineProps<{ lang?: Lang }>(), { lang: 'en' })
const runtime = runtimeData as RuntimeData
const intelligence = intelligenceData as IntelligenceData
const legacy = legacyData as LegacyData
const effectiveDate = intelligence.effectiveDate || '2026-08-05'

const KEY_ZH: Record<string, string> = {
  scheduler: '调度器', skill: 'Skill', signalPool: '信号池', signalCount: '信号数', plan: '研究计划',
  queueStatus: 'Queue 状态', discoveryStatus: 'Discovery 状态', selectedObjects: '已选对象', priorCheckpoint: '上次检查点',
  intelligenceRegistry: '情报源 Registry', profiles: '情报 Profile', task: '下一任务', scheduledTime: '计划时间',
  artifact: '成果文件', type: '类型', readingResultCount: 'Reading Result 数量', columnDecisions: '栏目决策数',
  selectedCount: '已选数', noSelectionCount: '未选题数', selectionCount: '选题数'
}
const TYPE_ZH: Record<string, string> = {
  'Signal Pool': '信号池', "Today's Research Plan": '今日研究计划', 'Reading Results': '深读结果',
  'Research Objects': '研究对象', 'Publication Candidates': '出版候选'
}
const METRIC_ZH: Record<string, string> = {
  signal_pool_count: '信号池数量', topic_selection_count: '选题数量', column_decisions: '栏目决策数',
  selected_objects: '已选对象数', candidate_signals: '候选信号数', rejected_signals: '拒绝信号数',
  no_selection_decisions: '未选题决策数', queue_start_events: 'Queue 启动事件数', reading_results: 'Reading Results 数量',
  inaccessible_sources: '受限来源数', failed_sources: '失败来源数', reading_start_events: 'Reading 启动事件数'
}

function compactValue(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(compactValue).filter(Boolean).join(', ')
  return ''
}

function structuralSummary(value: any, lang: Lang, field: string): string {
  const parts: string[] = []
  for (const [key, item] of Object.entries(value || {})) {
    if (key.endsWith('_zh') || key === 'controlPlane' || key === 'summary' || key === 'instruction' || typeof item === 'object') continue
    let rendered = compactValue(item)
    if (!rendered) continue
    if (lang === 'zh' && key === 'type') rendered = TYPE_ZH[rendered] || rendered
    parts.push(`${lang === 'zh' ? (KEY_ZH[key] || key) : key}: ${rendered}`)
  }
  if (field === 'output' && value?.type && !parts.some((item) => item.startsWith(lang === 'zh' ? '类型:' : 'type:'))) {
    parts.unshift(`${lang === 'zh' ? '类型' : 'type'}: ${lang === 'zh' ? (TYPE_ZH[value.type] || value.type) : value.type}`)
  }
  return parts.join(' · ')
}

function summarizeObject(value: any, lang: Lang, field: string): string {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return compactValue(value)
  if (lang === 'zh') {
    if (value.summary_zh) return String(value.summary_zh)
    if (value.instruction_zh) return String(value.instruction_zh)
    return structuralSummary(value, lang, field) || '该字段已记录结构化事实；请查看证据与成果文件。'
  }
  if (value.summary) return String(value.summary)
  if (value.instruction) return String(value.instruction)
  return structuralSummary(value, lang, field) || 'Structured facts recorded; see Evidence and Artifacts.'
}

function resultField(result: any, field: string, lang: Lang): string {
  if (lang === 'zh') {
    const localized = result?.[`${field}_zh`]
    if (typeof localized === 'string' && localized.trim()) return localized.trim()
  }
  const value = result?.[field]
  if (lang === 'en' && typeof value === 'string' && value.trim()) return value.trim()
  return summarizeObject(value, lang, field)
}

function normalizeLiveRecord(record: any) {
  if (!record || typeof record !== 'object') return record
  const results = Object.fromEntries(Object.entries(record.results || {}).map(([id, raw]) => {
    const result: any = raw
    if (!result || result.schema !== 'runtime-shift-result/v2') return [id, result]
    const normalizeMetric = (item: any) => {
      const name = String(item?.name || '')
      const label = item?.label || name.replaceAll('_', ' ') || 'metric'
      return { label, label_zh: item?.label_zh || METRIC_ZH[name] || label, value: String(item?.value ?? '') }
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
      input: resultField(result, 'input', 'en'), input_zh: resultField(result, 'input', 'zh'),
      workResult: resultField(result, 'workResult', 'en'), workResult_zh: resultField(result, 'workResult', 'zh'),
      output: resultField(result, 'output', 'en'), output_zh: resultField(result, 'output', 'zh'),
      next: resultField(result, 'next', 'en'), next_zh: resultField(result, 'next', 'zh'),
      reason: resultField(result, 'reason', 'en'), reason_zh: resultField(result, 'reason', 'zh'),
      metrics: (result.metrics || []).map(normalizeMetric), evidence: (result.evidence || []).map(normalizeEvidence),
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
      if (!response.ok || !/raw\.githubusercontent\.com\/joinwell52-AI\/joinwell52\/main\/research\/runtime\/records\//.test(url)) return response
      try {
        const data = normalizeLiveRecord(await response.clone().json())
        return new Response(JSON.stringify(data), { status: response.status, statusText: response.statusText, headers: response.headers })
      } catch {
        return response
      }
    }
    host[marker] = true
  }
}

const v5Dates = (runtime.records?.daily || []).map((item) => item.date).filter((date) => date >= effectiveDate)
const legacyDates = (legacy.records || []).map((item) => item.date).filter((date) => date < effectiveDate)
const availableDates = [...new Set([runtime.todayDaily?.date, ...v5Dates, ...legacyDates].filter(Boolean))].sort((a, b) => a.localeCompare(b))
const availableDateSet = new Set(availableDates)
const v5DateSet = new Set(v5Dates)
const legacyDateSet = new Set(legacyDates)

const selectedDate = ref(availableDateSet.has(runtime.today) ? runtime.today : availableDates.at(-1) || runtime.today)
const dateError = ref('')
const selectedIndex = computed(() => availableDates.indexOf(selectedDate.value))
const previousDate = computed(() => selectedIndex.value > 0 ? availableDates[selectedIndex.value - 1] : '')
const nextDate = computed(() => selectedIndex.value >= 0 && selectedIndex.value < availableDates.length - 1 ? availableDates[selectedIndex.value + 1] : '')
const useClassic = computed(() => v5DateSet.has(selectedDate.value))
const useLegacy = computed(() => legacyDateSet.has(selectedDate.value))
const minDate = computed(() => availableDates[0] || runtime.today)
const maxDate = computed(() => availableDates.at(-1) || runtime.today)
const copy = computed(() => props.lang === 'zh' ? { unavailable: '该日期没有 Runtime Record。' } : { unavailable: 'No Runtime Record exists for that date.' })

function syncUrl(date: string, mode: 'push' | 'replace' = 'push') {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  url.searchParams.set('date', date)
  window.history[mode === 'push' ? 'pushState' : 'replaceState']({ runtimeDate: date }, '', url)
}
function selectDate(date: string, mode: 'push' | 'replace' = 'push') {
  if (!availableDateSet.has(date)) { dateError.value = copy.value.unavailable; return }
  dateError.value = ''; selectedDate.value = date; syncUrl(date, mode)
}
function applyLocationDate(mode: 'replace' | 'none' = 'none') {
  if (typeof window === 'undefined') return
  const requested = new URLSearchParams(window.location.search).get('date')
  if (requested && availableDateSet.has(requested)) { selectedDate.value = requested; dateError.value = ''; return }
  if (requested) dateError.value = copy.value.unavailable
  if (mode === 'replace') syncUrl(selectedDate.value, 'replace')
}
function handlePopState() { applyLocationDate() }
onMounted(() => { applyLocationDate('replace'); window.addEventListener('popstate', handlePopState) })
onBeforeUnmount(() => { if (typeof window !== 'undefined') window.removeEventListener('popstate', handlePopState) })
</script>

<template>
  <RuntimeOperationsCenterClassic v-if="useClassic" :key="`v5-${selectedDate}`" :lang="props.lang" :selected-date="selectedDate" :previous-date="previousDate" :next-date="nextDate" :min-date="minDate" :max-date="maxDate" :today-date="availableDateSet.has(runtime.today) ? runtime.today : ''" :date-error="dateError" @select-date="selectDate" @date-input="selectDate" />
  <RuntimeOperationsCenterLegacy v-else-if="useLegacy" :key="`legacy-${selectedDate}`" :lang="props.lang" :selected-date="selectedDate" :previous-date="previousDate" :next-date="nextDate" :min-date="minDate" :max-date="maxDate" :today-date="availableDateSet.has(runtime.today) ? runtime.today : ''" :date-error="dateError" @select-date="selectDate" @date-input="selectDate" />
  <div v-else class="runtime-date-empty">{{ copy.unavailable }}</div>
</template>

<style scoped>
.runtime-date-empty{padding:90px 24px;text-align:center;color:var(--vp-c-text-2)}
</style>
