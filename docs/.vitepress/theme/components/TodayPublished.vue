<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as allNotes } from './research-notes.data'
import type { ResearchNoteRecord } from './research-notes.data'

const props = withDefaults(defineProps<{ lang?: 'zh' | 'en' }>(), { lang: 'zh' })
const zh = computed(() => props.lang === 'zh')

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
  <section v-if="notes.length" class="today-published">
    <header>
      <div>
        <small>TODAY · {{ today }}</small>
        <h2>{{ zh ? '今日发布' : "Today's releases" }}</h2>
        <p>{{ zh ? `今天已正式发布 ${notes.length} 篇研究文章，以下内容已进入公开索引。` : `${notes.length} research articles have been formally released today and are visible in the public index.` }}</p>
      </div>
      <strong>{{ notes.length }}</strong>
    </header>

    <div class="today-grid">
      <a v-for="note in notes" :key="note.url" :href="withBase(note.url)">
        <span>{{ columnName(note.column) }}</span>
        <h3>{{ note.title }}</h3>
        <p v-if="note.summary">{{ note.summary }}</p>
        <b>{{ zh ? '阅读全文' : 'Read article' }} →</b>
      </a>
    </div>
  </section>
</template>

<style scoped>
.today-published{max-width:1120px;margin:18px auto 30px;padding:0 18px}.today-published>header{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:14px;padding:22px 24px;border-radius:22px;background:linear-gradient(135deg,var(--vp-c-brand-soft),var(--vp-c-bg-soft));border:1px solid var(--vp-c-divider)}.today-published small{font-size:10px;font-weight:850;letter-spacing:.14em;color:var(--vp-c-brand-1)}.today-published h2{margin:5px 0 5px;font-size:30px;letter-spacing:-.04em}.today-published header p{margin:0;color:var(--vp-c-text-2);font-size:13px}.today-published header>strong{font-size:54px;line-height:.85;letter-spacing:-.08em}.today-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.today-grid>a{display:flex;flex-direction:column;min-height:220px;padding:22px;border:1px solid var(--vp-c-divider);border-radius:20px;background:var(--vp-c-bg);color:inherit!important;text-decoration:none!important;transition:.18s ease}.today-grid>a:hover{transform:translateY(-2px);border-color:var(--vp-c-brand-1);box-shadow:0 18px 42px rgba(15,23,42,.08)}.today-grid span{font-size:10px;font-weight:800;color:var(--vp-c-brand-1)}.today-grid h3{margin:10px 0 9px;font-size:20px;line-height:1.3;letter-spacing:-.025em}.today-grid p{margin:0;color:var(--vp-c-text-2);font-size:12px;line-height:1.65}.today-grid b{margin-top:auto;padding-top:18px;font-size:12px;color:var(--vp-c-brand-1)}@media(max-width:760px){.today-published{padding:0 12px}.today-published>header{align-items:flex-start}.today-grid{grid-template-columns:1fr}.today-grid>a{min-height:0}.today-published header>strong{font-size:42px}}
</style>
