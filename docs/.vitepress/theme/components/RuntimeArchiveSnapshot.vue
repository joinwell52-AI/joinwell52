<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import snapshot from '../../generated/runtime-v6-public-snapshot.json'
import RuntimeOperationsCenterClassic from './RuntimeOperationsCenterClassic.vue'
import RuntimeOperationsCenterCurrent from './RuntimeOperationsCenterCurrent.vue'
import LocalRuntimeBridge from './LocalRuntimeBridge.vue'

const props = withDefaults(defineProps<{ lang?: 'zh' | 'en' }>(), { lang: 'en' })
const requested = ref('')
const local = ref(false)
const cutoff = '2026-09-18'
const operations = (snapshot as any).operations
const selected = computed(() => requested.value || snapshot.snapshotDate || cutoff)
const archive = computed(() => selected.value <= cutoff)
const available = computed(() => selected.value === snapshot.snapshotDate && operations?.runtime)
function readLocation() {
  requested.value = new URLSearchParams(window.location.search).get('date') || ''
  local.value = ['127.0.0.1', 'localhost'].includes(window.location.hostname)
    && new URLSearchParams(window.location.search).get('view') !== 'public'
}
function selectDate(date: string) {
  const url = new URL(window.location.href)
  if (date) url.searchParams.set('date', date)
  else url.searchParams.delete('date')
  window.history.pushState({}, '', url)
  readLocation()
}
onMounted(() => { readLocation(); window.addEventListener('popstate', readLocation) })
onBeforeUnmount(() => { if (typeof window !== 'undefined') window.removeEventListener('popstate', readLocation) })
</script>

<template>
  <LocalRuntimeBridge v-if="local && (!requested || requested >= '2026-09-30')" :lang="props.lang" :date="requested" @select-date="selectDate" />
  <RuntimeOperationsCenterCurrent v-else-if="archive" :key="selected" :lang="props.lang" />
  <RuntimeOperationsCenterClassic v-else-if="available" :key="selected" :lang="props.lang"
    :local-runtime="operations.runtime" :local-intelligence="operations.intelligence" snapshot-mode
    :selected-date="selected" :previous-date="cutoff" :next-date="''" min-date="2026-08-05"
    :max-date="snapshot.snapshotDate || ''" :today-date="snapshot.snapshotDate || ''"
    @select-date="selectDate" @date-input="selectDate" />
  <div v-else class="runtime-date-empty">
    <p>{{ selected }} · {{ props.lang === 'zh' ? '该日期没有公开运行记录。迁移区间不补造数据。' : 'No public runtime record exists for this date.' }}</p>
    <button @click="selectDate('')">{{ props.lang === 'zh' ? '返回最近运营记录' : 'Latest operations' }}</button>
  </div>
</template>

<style scoped>
.runtime-date-empty{padding:90px 24px;text-align:center;color:var(--vp-c-text-2)}
</style>
