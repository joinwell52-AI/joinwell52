<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { withBase } from 'vitepress'
import { data as allNotes } from './research-notes.data'
import type { ResearchCategory, ResearchColumn, ResearchNoteRecord } from './research-notes.data'
import { articleTypeLabel } from './article-types'
import { editorialRating } from './editorial-rating'

const props = withDefaults(defineProps<{
  lang?: 'en' | 'zh'
  column?: ResearchColumn
}>(), {
  lang: 'en',
  column: undefined
})

const activeCategory = ref<'all' | ResearchCategory>('all')
const selectedDate = ref('')
const currentPage = ref(1)
const pageSize = 10

watch(() => props.column, () => {
  activeCategory.value = 'all'
  selectedDate.value = ''
  currentPage.value = 1
})

watch([activeCategory, selectedDate], () => {
  currentPage.value = 1
})

const zh = computed(() => props.lang === 'zh')

const columns: Array<{
  key: ResearchColumn
  en: string
  zh: string
  code: string
  enDescription: string
  zhDescription: string
  enPath: string
  zhPath: string
}> = [
  {
    key: 'digital-employee', code: 'DE',
    en: 'Digital Employee', zh: '数字员工',
    enDescription: 'Position, responsibility, workflow, runtime, governance, evaluation and managed digital work.',
    zhDescription: '岗位、职责、工作流、Runtime、治理、评估与受管理的数字工作。',
    enPath: '/en/digital-employee/', zhPath: '/zh/digital-employee/'
  },
  {
    key: 'industry-architecture', code: 'IA',
    en: 'Industry Architecture', zh: '行业架构',
    enDescription: 'Enterprise digital workforce, agent platforms, control planes and work-management architecture.',
    zhDescription: '企业数字劳动力、Agent 平台、控制平面与工作管理架构。',
    enPath: '/en/industry/', zhPath: '/zh/industry/'
  },
  {
    key: 'open-source-engineering', code: 'OE',
    en: 'Open-source Engineering', zh: '开源工程观察',
    enDescription: 'Runtime, workflow, recovery, tools, skills, observability and governance mechanisms.',
    zhDescription: 'Runtime、Workflow、Recovery、Tool、Skill、Observability 与 Governance 工程机制。',
    enPath: '/en/engineering/', zhPath: '/zh/engineering/'
  }
]

const categories: Array<{ key: 'all' | ResearchCategory; en: string; zh: string }> = [
  { key: 'all', en: 'All notes', zh: '全部笔记' },
  { key: 'daily', en: 'Daily Observation', zh: '每日观察' },
  { key: 'weekly', en: 'Weekly Synthesis', zh: '每周综合' },
  { key: 'academic', en: 'Academic Observation', zh: '学术观察' }
]

const localizedNotes = computed(() =>
  (allNotes as ResearchNoteRecord[]).filter(note => note.lang === props.lang)
)

const currentColumn = computed(() => columns.find(item => item.key === props.column))

const notesForColumn = (column: ResearchColumn) =>
  localizedNotes.value.filter(note => note.column === column)

const categoryCount = (column: ResearchColumn, category: ResearchCategory) =>
  notesForColumn(column).filter(note => note.category === category).length

const currentColumnNotes = computed(() =>
  props.column ? notesForColumn(props.column) : []
)

const metricCount = (key: 'all' | ResearchCategory) => {
  if (!props.column) return 0
  return key === 'all' ? currentColumnNotes.value.length : categoryCount(props.column, key)
}

const visibleNotes = computed(() => {
  let notes = props.column ? notesForColumn(props.column) : [...localizedNotes.value]

  if (activeCategory.value !== 'all') {
    notes = notes.filter(note => note.category === activeCategory.value)
  }

  if (selectedDate.value) {
    notes = notes.filter(note => note.date === selectedDate.value)
  }

  return notes
})

const totalPages = computed(() => Math.max(1, Math.ceil(visibleNotes.value.length / pageSize)))

const displayedNotes = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return visibleNotes.value.slice(start, start + pageSize)
})

const visiblePageNumbers = computed(() => {
  const total = totalPages.value
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)

  const pages = new Set([1, total, currentPage.value - 1, currentPage.value, currentPage.value + 1])
  return [...pages].filter(page => page >= 1 && page <= total).sort((a, b) => a - b)
})

const changePage = (page: number) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
  if (typeof window !== 'undefined') {
    window.requestAnimationFrame(() => {
      document.querySelector('.rn-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}

const columnPath = (column: typeof columns[number]) =>
  withBase(zh.value ? column.zhPath : column.enPath)

const categoryLabel = (category: ResearchCategory) => {
  const item = categories.find(entry => entry.key === category)
  return zh.value ? item?.zh : item?.en
}

const noteColumnLabel = (column: ResearchColumn) => {
  const item = columns.find(entry => entry.key === column)
  return zh.value ? item?.zh : item?.en
}

const noteRating = (url: string) => editorialRating(url, props.lang)

const clearDate = () => {
  selectedDate.value = ''
}
</script>

<template>
  <div class="rn-shell">
    <section class="rn-hero">
      <div class="rn-hero-copy">
        <span>OBSERVATION NOTES</span>
        <h1 v-if="currentColumn">{{ zh ? currentColumn.zh : currentColumn.en }}</h1>
        <h1 v-else>{{ zh ? '观察笔记' : 'Observation Notes' }}</h1>
        <p v-if="currentColumn">{{ zh ? currentColumn.zhDescription : currentColumn.enDescription }}</p>
        <p v-else>{{ zh
          ? '数字员工在持续工作中记录外部动态与工作判断；GitHub 保存唯一事实，网站依据 column、category 与 date 元数据自动组织和展示。'
          : 'The Digital Employee records external developments and working judgments while operating. GitHub preserves the single source of truth, and the site organizes notes from column, category, and date metadata.'
        }}</p>
      </div>
      <div class="rn-hero-stat">
        <strong>{{ currentColumn ? currentColumnNotes.length : localizedNotes.length }}</strong>
        <span>{{ zh ? '篇观察笔记' : 'observation notes' }}</span>
      </div>
    </section>

    <nav class="rn-column-nav" :aria-label="zh ? '观察栏目' : 'Observation columns'">
      <a :class="{ active: !currentColumn }" :href="withBase(zh ? '/zh/research/' : '/en/research/')">
        <span>ALL</span><b>{{ zh ? '全部' : 'All notes' }}</b>
      </a>
      <a
        v-for="columnItem in columns"
        :key="columnItem.key"
        :class="{ active: currentColumn?.key === columnItem.key }"
        :href="columnPath(columnItem)"
      >
        <span>{{ columnItem.code }}</span><b>{{ zh ? columnItem.zh : columnItem.en }}</b>
      </a>
    </nav>

    <template v-if="!currentColumn">
      <section class="rn-columns" aria-label="Observation columns">
        <a
          v-for="columnItem in columns"
          :key="columnItem.key"
          :href="columnPath(columnItem)"
          :class="['rn-column-card', `is-${columnItem.key}`]"
        >
          <div class="rn-column-head">
            <span>{{ columnItem.code }}</span>
            <strong>{{ notesForColumn(columnItem.key).length }}</strong>
          </div>
          <small>{{ columnItem.key.replaceAll('-', ' ').toUpperCase() }}</small>
          <h2>{{ zh ? columnItem.zh : columnItem.en }}</h2>
          <p>{{ zh ? columnItem.zhDescription : columnItem.enDescription }}</p>
          <div class="rn-breakdown">
            <span><b>{{ categoryCount(columnItem.key, 'daily') }}</b>{{ zh ? '每日' : 'Daily' }}</span>
            <span><b>{{ categoryCount(columnItem.key, 'weekly') }}</b>{{ zh ? '每周' : 'Weekly' }}</span>
            <span><b>{{ categoryCount(columnItem.key, 'academic') }}</b>{{ zh ? '学术' : 'Academic' }}</span>
          </div>
          <div class="rn-open">{{ zh ? '进入栏目' : 'Open column' }} <b>↗</b></div>
        </a>
      </section>

      <div class="rn-section-title">
        <div><span>LATEST</span><h2>{{ zh ? '最新观察笔记' : 'Latest Observation Notes' }}</h2></div>
        <small>{{ zh ? '按日期倒序' : 'Newest first' }}</small>
      </div>
    </template>

    <template v-else>
      <section class="rn-filter-panel">
        <div class="rn-metrics">
          <button
            v-for="category in categories"
            :key="category.key"
            type="button"
            :class="{ active: activeCategory === category.key }"
            @click="activeCategory = category.key"
          >
            <strong>{{ metricCount(category.key) }}</strong>
            <span>{{ zh ? category.zh : category.en }}</span>
          </button>
        </div>

        <div class="rn-toolbar">
          <div>
            <b>{{ zh ? '观察笔记列表' : 'Observation note list' }}</b>
            <span>{{ zh ? `当前显示 ${visibleNotes.length} 篇，默认按日期倒序` : `${visibleNotes.length} shown, sorted newest first` }}</span>
          </div>
          <label>
            <span>{{ zh ? '按日期查找' : 'Find by date' }}</span>
            <input v-model="selectedDate" type="date">
            <button v-if="selectedDate" type="button" @click="clearDate">{{ zh ? '清除' : 'Clear' }}</button>
          </label>
        </div>
      </section>
    </template>

    <section v-if="displayedNotes.length" class="rn-list">
      <a
        v-for="(note, index) in displayedNotes"
        :key="note.url"
        :href="withBase(note.url)"
        :class="{ 'has-cover': note.cover }"
      >
        <span class="rn-index">{{ String((currentPage - 1) * pageSize + index + 1).padStart(2, '0') }}</span>
        <time>{{ note.date }}</time>
        <div class="rn-main">
          <div class="rn-tags">
            <span>{{ categoryLabel(note.category) }}</span>
            <span v-if="note.articleType" class="rn-article-type">{{ articleTypeLabel(note.articleType, zh) }}</span>
            <span v-if="!currentColumn">{{ noteColumnLabel(note.column) }}</span>
            <span
              class="rn-rating"
              :class="[`rating-${noteRating(note.url).level}`, { pending: noteRating(note.url).pending }]"
              :title="noteRating(note.url).score === null ? noteRating(note.url).label : `${noteRating(note.url).label} · ${noteRating(note.url).score}/100`"
            >{{ noteRating(note.url).label }}</span>
          </div>
          <h3>{{ note.title }}</h3>
          <p v-if="note.summary">{{ note.summary }}</p>
        </div>
        <div v-if="note.cover" class="rn-thumb" aria-hidden="true">
          <img :src="withBase(note.thumbnail || note.cover)" alt="" loading="lazy" decoding="async" width="336" height="189">
        </div>
        <b class="rn-arrow">→</b>
      </a>
    </section>

    <nav v-if="displayedNotes.length && totalPages > 1" class="rn-pagination" :aria-label="zh ? '观察笔记分页' : 'Observation notes pagination'">
      <button type="button" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        <span>←</span>{{ zh ? '上一页' : 'Previous' }}
      </button>
      <div class="rn-pagination__pages">
        <template v-for="(page, index) in visiblePageNumbers" :key="page">
          <span v-if="index > 0 && page - visiblePageNumbers[index - 1] > 1" class="rn-pagination__ellipsis">…</span>
          <button type="button" :class="{ active: currentPage === page }" :aria-current="currentPage === page ? 'page' : undefined" @click="changePage(page)">{{ page }}</button>
        </template>
      </div>
      <button type="button" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
        {{ zh ? '下一页' : 'Next' }}<span>→</span>
      </button>
    </nav>

    <section v-else class="rn-empty">
      <strong>{{ zh ? '没有匹配的观察笔记' : 'No matching observation notes' }}</strong>
      <p>{{ zh ? '清除日期或类别筛选，或等待数字员工发布新的观察笔记。' : 'Clear the date or category filter, or wait for the Digital Employee to publish a new Observation Note.' }}</p>
    </section>
  </div>
</template>

<style scoped>
.rn-shell{max-width:1120px;margin:0 auto 72px;padding:0 18px}.rn-hero{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:36px;align-items:end;margin:18px 0 18px;padding:44px;border-radius:30px;overflow:hidden;background:radial-gradient(circle at 84% 18%,rgba(89,105,255,.4),transparent 31%),radial-gradient(circle at 12% 90%,rgba(54,203,232,.18),transparent 34%),linear-gradient(135deg,#071225,#102f4a);color:#fff}.rn-hero:after{content:'';position:absolute;width:300px;height:300px;border-radius:50%;right:-160px;bottom:-180px;border:1px solid rgba(255,255,255,.12);box-shadow:0 0 0 45px rgba(255,255,255,.025),0 0 0 90px rgba(255,255,255,.018)}.rn-hero-copy{position:relative;z-index:1;max-width:780px}.rn-hero-copy>span,.rn-section-title span{font-size:10px;letter-spacing:.16em;font-weight:850;color:#80e2f1}.rn-hero h1{margin:12px 0 12px;font-size:clamp(40px,6vw,68px);line-height:1;letter-spacing:-.055em}.rn-hero p{margin:0;color:#c9d6e6;line-height:1.75;font-size:15px}.rn-hero-stat{position:relative;z-index:1;min-width:132px;text-align:right}.rn-hero-stat strong{display:block;font-size:72px;line-height:.85;letter-spacing:-.09em}.rn-hero-stat span{display:block;margin-top:12px;color:#9eb0c7;font-size:11px;text-transform:uppercase;letter-spacing:.08em}.rn-column-nav{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:0 0 34px;padding:8px;border:1px solid var(--vp-c-divider);border-radius:18px;background:var(--vp-c-bg-soft)}.rn-column-nav a{display:flex;align-items:center;gap:10px;min-width:0;padding:12px 14px;border-radius:12px;color:inherit!important;text-decoration:none!important}.rn-column-nav a:hover,.rn-column-nav a.active{background:var(--vp-c-bg);box-shadow:0 8px 20px rgba(15,23,42,.06)}.rn-column-nav span{display:grid;place-items:center;flex:0 0 32px;height:32px;border-radius:10px;background:var(--vp-c-brand-soft);color:var(--vp-c-brand-1);font-size:9px;font-weight:850;letter-spacing:.08em}.rn-column-nav b{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rn-columns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:0 0 44px}.rn-column-card{position:relative;display:flex;flex-direction:column;min-height:390px;padding:28px;border:1px solid var(--vp-c-divider);border-radius:26px;overflow:hidden;background:var(--vp-c-bg);color:inherit!important;text-decoration:none!important;transition:.22s ease}.rn-column-card:before{content:'';position:absolute;inset:0 0 auto;height:6px;background:linear-gradient(90deg,#6d5dfc,#36cbe8)}.rn-column-card.is-industry-architecture:before{background:linear-gradient(90deg,#168f8b,#5ed4cd)}.rn-column-card.is-open-source-engineering:before{background:linear-gradient(90deg,#315db4,#82a9ff)}.rn-column-card:after{content:'';position:absolute;width:220px;height:220px;border-radius:50%;right:-130px;top:-130px;border:1px solid rgba(109,93,252,.12);box-shadow:0 0 0 38px rgba(109,93,252,.02),0 0 0 76px rgba(54,203,232,.014)}.rn-column-card:hover{transform:translateY(-4px);border-color:var(--vp-c-brand-1);box-shadow:0 24px 60px rgba(15,23,42,.1)}.rn-column-head{position:relative;z-index:1;display:flex;align-items:flex-start;justify-content:space-between}.rn-column-head span{display:grid;place-items:center;width:46px;height:46px;border-radius:14px;background:var(--vp-c-bg-soft);color:var(--vp-c-brand-1);font-size:10px;font-weight:850;letter-spacing:.08em}.rn-column-head strong{font-size:54px;line-height:.9;letter-spacing:-.08em}.rn-column-card>small{position:relative;z-index:1;margin-top:48px;font-size:9px;letter-spacing:.13em;color:var(--vp-c-text-2);font-weight:800}.rn-column-card h2{position:relative;z-index:1;margin:12px 0 10px;font-size:31px;line-height:1.08;letter-spacing:-.04em}.rn-column-card p{position:relative;z-index:1;margin:0;color:var(--vp-c-text-2);line-height:1.65;font-size:13px}.rn-breakdown{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:auto;padding-top:24px}.rn-breakdown span{padding:11px 6px;border-radius:12px;background:var(--vp-c-bg-soft);font-size:9px;color:var(--vp-c-text-2);text-align:center}.rn-breakdown b{display:block;color:var(--vp-c-text-1);font-size:17px}.rn-open{display:flex;justify-content:space-between;margin-top:14px;padding-top:15px;border-top:1px solid var(--vp-c-divider);font-size:11px;font-weight:750;color:var(--vp-c-brand-1)}.rn-section-title{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin:36px 0 8px}.rn-section-title h2{margin:6px 0 0;font-size:32px;letter-spacing:-.035em}.rn-section-title small{color:var(--vp-c-text-2)}.rn-filter-panel{margin-bottom:8px;padding:18px;border:1px solid var(--vp-c-divider);border-radius:24px;background:var(--vp-c-bg-soft)}.rn-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.rn-metrics button{display:flex;flex-direction:column;align-items:flex-start;padding:16px;border:1px solid transparent;border-radius:15px;background:var(--vp-c-bg);color:inherit;cursor:pointer;transition:.18s ease}.rn-metrics button:hover,.rn-metrics button.active{border-color:var(--vp-c-brand-1);box-shadow:0 8px 22px rgba(15,23,42,.06)}.rn-metrics button.active{background:var(--vp-c-brand-soft)}.rn-metrics strong{font-size:27px;letter-spacing:-.05em}.rn-metrics span{font-size:11px;color:var(--vp-c-text-2)}.rn-toolbar{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-top:14px;padding:15px 4px 0;border-top:1px solid var(--vp-c-divider)}.rn-toolbar>div{display:flex;flex-direction:column}.rn-toolbar>div span{font-size:11px;color:var(--vp-c-text-2)}.rn-toolbar label{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--vp-c-text-2)}.rn-toolbar input{padding:8px 10px;border:1px solid var(--vp-c-divider);border-radius:9px;background:var(--vp-c-bg);color:inherit}.rn-toolbar button{border:0;background:none;color:var(--vp-c-brand-1);cursor:pointer}.rn-list{border-top:1px solid var(--vp-c-divider)}.rn-list>a{display:grid;grid-template-columns:44px 100px minmax(0,1fr) 28px;gap:18px;align-items:center;padding:23px 4px;border-bottom:1px solid var(--vp-c-divider);color:inherit!important;text-decoration:none!important;transition:.18s ease}.rn-list>a:hover{padding-left:12px;padding-right:12px;background:linear-gradient(90deg,var(--vp-c-brand-soft),transparent)}.rn-index{font-size:10px;color:var(--vp-c-brand-1);font-weight:850;letter-spacing:.1em}.rn-list time{font-size:12px;color:var(--vp-c-text-2);font-variant-numeric:tabular-nums}.rn-tags{display:flex;gap:6px;flex-wrap:wrap}.rn-tags span{padding:4px 8px;border-radius:999px;background:var(--vp-c-bg-soft);font-size:9px;color:var(--vp-c-text-2);font-weight:700}.rn-main h3{margin:7px 0 4px;font-size:21px;line-height:1.25;letter-spacing:-.025em}.rn-main p{margin:0;color:var(--vp-c-text-2);line-height:1.55;font-size:12px}.rn-arrow{font-size:20px;color:var(--vp-c-brand-1)}.rn-empty{margin-top:18px;padding:34px;border:1px dashed var(--vp-c-divider);border-radius:18px;text-align:center}.rn-empty p{margin:8px 0 0;color:var(--vp-c-text-2)}@media(max-width:900px){.rn-columns{grid-template-columns:1fr}.rn-column-card{min-height:330px}.rn-column-card>small{margin-top:28px}.rn-column-nav{grid-template-columns:repeat(2,1fr)}.rn-metrics{grid-template-columns:repeat(2,1fr)}.rn-list>a{grid-template-columns:38px 88px minmax(0,1fr) 24px;gap:12px}}@media(max-width:640px){.rn-shell{padding:0 12px}.rn-hero{grid-template-columns:1fr;padding:27px 24px;border-radius:24px}.rn-hero h1{font-size:38px}.rn-hero-stat{text-align:left}.rn-hero-stat strong{font-size:48px}.rn-column-nav{grid-template-columns:1fr 1fr;padding:6px}.rn-column-nav a{padding:10px}.rn-column-nav b{font-size:11px}.rn-column-card{padding:23px;border-radius:22px}.rn-column-card h2{font-size:28px}.rn-toolbar{align-items:flex-start;flex-direction:column}.rn-toolbar label{width:100%;flex-wrap:wrap}.rn-list>a{grid-template-columns:32px minmax(0,1fr) 20px;gap:9px;padding:19px 2px}.rn-list time{grid-column:2;grid-row:1}.rn-main{grid-column:2}.rn-index{grid-row:1/3}.rn-arrow{grid-column:3;grid-row:1/3;align-self:center}.rn-main h3{font-size:18px}.rn-main p{font-size:11px}.rn-breakdown{gap:5px}.rn-breakdown span{padding:9px 4px}.rn-metrics button{padding:13px}.rn-metrics strong{font-size:23px}}
.rn-pagination{display:flex;align-items:center;justify-content:space-between;gap:18px;margin:28px 0 8px;padding-top:22px;border-top:1px solid var(--vp-c-divider)}.rn-pagination>button,.rn-pagination__pages button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:0 15px;border:1px solid var(--vp-c-divider);border-radius:12px;background:var(--vp-c-bg);color:var(--vp-c-text-1);font-size:12px;font-weight:750;cursor:pointer;transition:.18s ease}.rn-pagination>button:hover:not(:disabled),.rn-pagination__pages button:hover,.rn-pagination__pages button.active{border-color:var(--vp-c-brand-1);color:var(--vp-c-brand-1);background:var(--vp-c-brand-soft)}.rn-pagination>button:disabled{opacity:.38;cursor:not-allowed}.rn-pagination__pages{display:flex;align-items:center;justify-content:center;gap:7px}.rn-pagination__pages button{width:40px;padding:0}.rn-pagination__ellipsis{display:grid;width:24px;place-items:center;color:var(--vp-c-text-3)}@media(max-width:620px){.rn-pagination{gap:8px}.rn-pagination>button{padding:0 10px;font-size:0}.rn-pagination>button span{font-size:14px}.rn-pagination__pages{gap:4px}.rn-pagination__pages button{width:36px;min-height:36px}}
.rn-tags .rn-article-type{border:1px solid color-mix(in srgb,var(--vp-c-brand-1) 35%,transparent);background:var(--vp-c-brand-soft);color:var(--vp-c-brand-1)}
.rn-tags .rn-rating{border:1px solid transparent;font-weight:850}.rn-tags .rn-rating.rating-benchmark{border-color:rgba(249,115,22,.58);background:rgba(249,115,22,.13);color:#c2410c}.rn-tags .rn-rating.rating-excellent{border-color:rgba(242,201,76,.62);background:rgba(242,201,76,.14);color:#c28a00}.rn-tags .rn-rating.rating-quality{border-color:rgba(94,234,212,.52);background:rgba(94,234,212,.12);color:#159c91}.rn-tags .rn-rating.rating-passing{border-color:rgba(96,165,250,.5);background:rgba(96,165,250,.11);color:#347bd1}.rn-tags .rn-rating.rating-foundation{border-color:rgba(148,163,184,.46);background:rgba(148,163,184,.1);color:#64748b}.rn-tags .rn-rating.pending{border-style:dashed;color:var(--vp-c-text-3)}:global(.dark .rn-rating.rating-benchmark){color:#fb923c}:global(.dark .rn-rating.rating-excellent){color:#f2c94c}:global(.dark .rn-rating.rating-quality){color:#5eead4}:global(.dark .rn-rating.rating-passing){color:#7db8ff}:global(.dark .rn-rating.rating-foundation){color:#aab6c7}

/* Article-list cover thumbnails */
.rn-list>a.has-cover{grid-template-columns:44px 100px minmax(0,1fr) 168px 28px}
.rn-thumb{aspect-ratio:16/9;overflow:hidden;border:1px solid var(--vp-c-divider);border-radius:12px;background:var(--vp-c-bg-soft);box-shadow:0 8px 24px rgba(15,23,42,.08)}
.rn-thumb img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .28s ease}
.rn-list>a:hover .rn-thumb img{transform:scale(1.035)}
@media(max-width:900px){.rn-list>a.has-cover{grid-template-columns:38px 88px minmax(0,1fr) 136px 24px}}
@media(max-width:640px){.rn-list>a.has-cover{width:100%;max-width:calc(100vw - 24px);grid-template-columns:32px minmax(0,1fr) 88px;box-sizing:border-box;overflow:hidden}.rn-list>a.has-cover .rn-main{min-width:0}.rn-list>a.has-cover .rn-main h3,.rn-list>a.has-cover .rn-main p{overflow-wrap:anywhere}.rn-thumb{grid-column:3;grid-row:1/3;align-self:center;border-radius:9px}.rn-list>a.has-cover .rn-arrow{display:none}}
</style>
