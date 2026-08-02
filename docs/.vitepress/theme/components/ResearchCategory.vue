<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as allNotes } from './research-notes.data'
import type { ResearchCategory, ResearchNoteRecord } from './research-notes.data'

const props = withDefaults(defineProps<{ lang?: 'en' | 'zh'; category: ResearchCategory }>(), { lang: 'en' })
const zh = computed(() => props.lang === 'zh')
const labels = computed(() => ({
  daily: zh.value ? '每日研究' : 'Daily Research',
  weekly: zh.value ? '每周综合' : 'Weekly Synthesis',
  academic: zh.value ? '学术观察' : 'Academic Observation'
}))
const descriptions = computed(() => ({
  daily: zh.value ? '数字研究员每日完成的研究笔记，按日期倒序展示。' : 'Daily research notes produced by the Research Analyst, newest first.',
  weekly: zh.value ? '跨越每日研究形成的新判断、新观点与架构综合。' : 'New judgments, viewpoints, and architecture synthesis across daily research.',
  academic: zh.value ? '围绕论文、基准、规范、会议与研究机构形成的学术观察。' : 'Academic observations on papers, benchmarks, specifications, conferences, and institutions.'
}))
const columns: Record<string, { zh: string; en: string }> = {
  'digital-employee': { zh: '数字员工', en: 'Digital Employee' },
  'industry-architecture': { zh: '行业架构', en: 'Industry Architecture' },
  'open-source-engineering': { zh: '开源工程', en: 'Open-source Engineering' }
}
const notes = computed(() => (allNotes as ResearchNoteRecord[])
  .filter(note => note.lang === props.lang && note.category === props.category)
  .sort((a, b) => b.date.localeCompare(a.date)))
</script>

<template>
  <main class="category-shell">
    <header>
      <span>RESEARCH NOTES</span>
      <h1>{{ labels[category] }}</h1>
      <p>{{ descriptions[category] }}</p>
      <strong>{{ notes.length }} {{ zh ? '篇' : 'notes' }}</strong>
    </header>
    <nav>
      <a :href="withBase(zh ? '/zh/research/daily/' : '/en/research/daily/')">{{ zh ? '每日研究' : 'Daily' }}</a>
      <a :href="withBase(zh ? '/zh/research/weekly/' : '/en/research/weekly/')">{{ zh ? '每周综合' : 'Weekly' }}</a>
      <a :href="withBase(zh ? '/zh/research/papers/' : '/en/research/papers/')">{{ zh ? '学术观察' : 'Academic' }}</a>
      <a :href="withBase(zh ? '/zh/research/' : '/en/research/')">{{ zh ? '全部研究笔记' : 'All notes' }}</a>
    </nav>
    <section v-if="notes.length" class="note-list">
      <a v-for="(note,index) in notes" :key="note.url" :href="withBase(note.url)">
        <b>{{ String(index + 1).padStart(2,'0') }}</b>
        <time>{{ note.date }}</time>
        <div><small>{{ zh ? columns[note.column]?.zh : columns[note.column]?.en }}</small><h2>{{ note.title }}</h2><p v-if="note.summary">{{ note.summary }}</p></div>
        <i>→</i>
      </a>
    </section>
    <section v-else class="empty">{{ zh ? '该类别暂时没有研究笔记。' : 'No research notes in this category yet.' }}</section>
  </main>
</template>

<style scoped>
.category-shell{max-width:1100px;margin:22px auto 80px;padding:0 18px}header{position:relative;padding:48px;border-radius:30px;overflow:hidden;color:#fff;background:radial-gradient(circle at 85% 20%,rgba(113,92,255,.5),transparent 34%),linear-gradient(135deg,#081225,#172542)}header span{font:800 10px/1 ui-monospace,monospace;letter-spacing:.16em;color:#8fe9f3}header h1{margin:14px 0 12px;font-size:clamp(46px,7vw,76px);line-height:1;letter-spacing:-.055em}header p{max-width:720px;margin:0;color:#c6d1df;line-height:1.7}header strong{display:block;margin-top:28px;font-size:14px;color:#aaa1ff}nav{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 30px;padding:8px;border:1px solid var(--vp-c-divider);border-radius:16px;background:var(--vp-c-bg-soft)}nav a{padding:11px 15px;border-radius:11px;color:inherit;text-decoration:none;font-size:13px;font-weight:750}nav a:hover{background:var(--vp-c-bg)}.note-list{border-top:1px solid var(--vp-c-divider)}.note-list>a{display:grid;grid-template-columns:42px 110px 1fr 30px;gap:18px;align-items:start;padding:26px 8px;border-bottom:1px solid var(--vp-c-divider);color:inherit;text-decoration:none}.note-list>a:hover h2{color:var(--vp-c-brand-1)}.note-list>b,.note-list time{color:var(--vp-c-text-3);font:700 11px/1.5 ui-monospace,monospace}.note-list small{color:var(--vp-c-brand-1);font-size:11px;font-weight:800}.note-list h2{margin:7px 0 7px;font-size:24px;line-height:1.25;letter-spacing:-.025em}.note-list p{margin:0;color:var(--vp-c-text-2);font-size:14px;line-height:1.6}.note-list i{font-style:normal;font-size:22px}.empty{padding:60px 0;text-align:center;color:var(--vp-c-text-2)}@media(max-width:680px){header{padding:32px 24px}.note-list>a{grid-template-columns:34px 1fr 24px}.note-list time{grid-column:2}.note-list div{grid-column:2}.note-list i{grid-column:3;grid-row:1/4}.note-list h2{font-size:20px}}
</style>