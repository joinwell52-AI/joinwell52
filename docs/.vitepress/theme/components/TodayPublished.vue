<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { withBase } from 'vitepress'
import { data as allNotes } from './research-notes.data'
import type { ResearchNoteRecord } from './research-notes.data'

const props = withDefaults(defineProps<{ lang?: 'zh' | 'en' }>(), { lang: 'zh' })
const zh = computed(() => props.lang === 'zh')
const local = ref(false), syncStatus = ref('Waiting')
let refreshTimer: ReturnType<typeof setInterval> | undefined
async function refreshSync() {
  try { const response = await fetch('/api/local-classic'); if(response.ok) { const state=await response.json();syncStatus.value=state.runtime?.todayDaily?.publicSyncStatus || 'Waiting' } } catch {}
}
onMounted(() => {
  local.value=['127.0.0.1','localhost'].includes(location.hostname)
  if(local.value) { refreshSync();refreshTimer=setInterval(refreshSync,10000) }
})
onBeforeUnmount(() => { if(refreshTimer)clearInterval(refreshTimer) })

function shanghaiDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date())
}

const today = shanghaiDate()
const notes = computed(() => (allNotes as ResearchNoteRecord[])
  .filter((note) => note.lang === props.lang && note.date === today && note.category === 'daily')
  .sort((a, b) => a.column.localeCompare(b.column)))

const columnName = (column: ResearchNoteRecord['column']) => {
  const labels = zh.value ? {
    'digital-employee': '数字员工',
    'industry-architecture': '行业架构',
    'open-source-engineering': '开源工程观察'
  } : {
    'digital-employee': 'Digital Employee',
    'industry-architecture': 'Industry Architecture',
    'open-source-engineering': 'Open-source Engineering'
  }
  return labels[column]
}
</script>

<template>
  <section class="today-published" :class="{ 'is-empty': !notes.length }">
    <header>
      <div>
        <small>{{ zh ? '今天' : 'TODAY' }} · {{ today }}</small>
        <h2>{{ local ? (zh ? '今日文章 · 本地预览' : "Today's articles · Local preview") : (zh ? '今日发布' : "Today's releases") }}</h2>
        <p v-if="notes.length && local">{{ zh ? `本地已完成 ${notes.length} 篇研究文章，可直接阅读全文。公开同步：${syncStatus === 'Sent' ? '已同步' : '待同步'}。` : `${notes.length} research articles are ready to read locally. Public sync: ${syncStatus === 'Sent' ? 'Synced' : 'Pending'}.` }}</p>
        <p v-else-if="notes.length">{{ zh ? `今天已正式发布 ${notes.length} 篇研究文章，以下内容已进入公开索引。` : `${notes.length} research articles have been formally released today and are visible in the public index.` }}</p>
        <p v-else>{{ local ? (zh ? '今天尚无已构建的文章，请在运营中心查看本地任务进度。' : 'No articles have been built today. Check the local operations center for progress.') : (zh ? '今天尚无已同步到公开网站的研究文章。' : 'No research articles have been synced to the public site today.') }}</p>
      </div>
      <strong>{{ notes.length }}</strong>
    </header>

    <div v-if="notes.length" class="today-grid">
      <a v-for="note in notes" :key="note.url" :href="withBase(note.url)">
        <img v-if="note.cover" class="today-thumbnail" :src="withBase(note.thumbnail || note.cover)" :alt="note.title" width="480" height="270" loading="lazy" decoding="async">
        <span>{{ columnName(note.column) }}</span>
        <h3>{{ note.title }}</h3>
        <p v-if="note.summary">{{ note.summary }}</p>
        <b>{{ zh ? '阅读全文' : 'Read article' }} →</b>
      </a>
    </div>

    <div v-else class="today-empty">
      <b>{{ zh ? '今日尚未发布' : 'No releases yet today' }}</b>
      <span>{{ zh ? '可在下方浏览历次研究文章。' : 'Browse previous research articles below.' }}</span>
    </div>
  </section>
</template>

<style scoped>
.today-thumbnail{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;margin-bottom:14px;}
.today-published{max-width:1120px;margin:18px auto 30px;padding:0 18px}.today-published>header{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:14px;padding:22px 24px;border-radius:22px;background:linear-gradient(135deg,var(--vp-c-brand-soft),var(--vp-c-bg-soft));border:1px solid var(--vp-c-divider)}.today-published small{font-size:10px;font-weight:850;letter-spacing:.14em;color:var(--vp-c-brand-1)}.today-published h2{margin:5px 0 5px;font-size:30px;letter-spacing:-.04em}.today-published header p{margin:0;color:var(--vp-c-text-2);font-size:13px}.today-published header>strong{font-size:54px;line-height:.85;letter-spacing:-.08em}.today-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.today-grid>a{display:flex;flex-direction:column;min-height:220px;padding:22px;border:1px solid var(--vp-c-divider);border-radius:20px;background:var(--vp-c-bg);color:inherit!important;text-decoration:none!important;transition:.18s ease}.today-grid>a:hover{transform:translateY(-2px);border-color:var(--vp-c-brand-1);box-shadow:0 18px 42px rgba(15,23,42,.08)}.today-grid span{font-size:10px;font-weight:800;color:var(--vp-c-brand-1)}.today-grid h3{margin:10px 0 9px;font-size:20px;line-height:1.3;letter-spacing:-.025em}.today-grid p{margin:0;color:var(--vp-c-text-2);font-size:12px;line-height:1.65}.today-grid b{margin-top:auto;padding-top:18px;font-size:12px;color:var(--vp-c-brand-1)}.today-empty{display:flex;justify-content:space-between;gap:18px;padding:18px 22px;border:1px dashed var(--vp-c-divider);border-radius:18px;background:var(--vp-c-bg-soft);color:var(--vp-c-text-2)}.today-empty b{color:var(--vp-c-text-1)}@media(max-width:760px){.today-published{padding:0 12px}.today-published>header{align-items:flex-start}.today-grid{grid-template-columns:1fr}.today-grid>a{min-height:0}.today-published header>strong{font-size:42px}.today-empty{flex-direction:column}}
</style>
