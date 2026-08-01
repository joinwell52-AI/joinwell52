<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { withBase } from 'vitepress'
import { data as allNotes } from './research-notes.data'
import type { ResearchCategory, ResearchColumn, ResearchNoteRecord } from './research-notes.data'

const props = withDefaults(defineProps<{
  lang?: 'en' | 'zh'
  column?: ResearchColumn
}>(), {
  lang: 'en',
  column: undefined
})

const activeCategory = ref<'all' | ResearchCategory>('all')
const selectedDate = ref('')

watch(() => props.column, () => {
  activeCategory.value = 'all'
  selectedDate.value = ''
})

const zh = computed(() => props.lang === 'zh')

const columns: Array<{
  key: ResearchColumn
  en: string
  zh: string
  enDescription: string
  zhDescription: string
  enPath: string
  zhPath: string
}> = [
  {
    key: 'digital-employee',
    en: 'Digital Employee',
    zh: '数字员工',
    enDescription: 'Position, responsibility, workflow, runtime, governance, evaluation and managed digital work.',
    zhDescription: '岗位、职责、工作流、Runtime、治理、评估与受管理的数字工作。',
    enPath: '/en/digital-employee/',
    zhPath: '/zh/digital-employee/'
  },
  {
    key: 'industry-architecture',
    en: 'Industry Architecture',
    zh: '行业架构',
    enDescription: 'Enterprise digital workforce, agent platforms, control planes and work-management architecture.',
    zhDescription: '企业数字劳动力、Agent 平台、控制平面与工作管理架构。',
    enPath: '/en/industry/',
    zhPath: '/zh/industry/'
  },
  {
    key: 'open-source-engineering',
    en: 'Open-source Engineering',
    zh: '开源工程观察',
    enDescription: 'Runtime, workflow, recovery, tools, skills, observability and governance mechanisms.',
    zhDescription: 'Runtime、Workflow、Recovery、Tool、Skill、Observability 与 Governance 工程机制。',
    enPath: '/en/engineering/',
    zhPath: '/zh/engineering/'
  }
]

const categories: Array<{ key: 'all' | ResearchCategory; en: string; zh: string }> = [
  { key: 'all', en: 'All notes', zh: '全部笔记' },
  { key: 'daily', en: 'Daily Research', zh: '每日研究' },
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

const visibleNotes = computed(() => {
  let notes = props.column
    ? notesForColumn(props.column)
    : [...localizedNotes.value]

  if (activeCategory.value !== 'all') {
    notes = notes.filter(note => note.category === activeCategory.value)
  }

  if (selectedDate.value) {
    notes = notes.filter(note => note.date === selectedDate.value)
  }

  return notes
})

const latestNotes = computed(() => visibleNotes.value.slice(0, props.column ? undefined : 12))

const columnPath = (column: typeof columns[number]) =>
  withBase(zh.value ? column.zhPath : column.enPath)

const categoryLabel = (category: ResearchCategory) => {
  const item = categories.find(entry => entry.key === category)
  return zh.value ? item?.zh : item?.en
}

const clearDate = () => {
  selectedDate.value = ''
}
</script>

<template>
  <div class="rn-shell">
    <section class="rn-hero">
      <div>
        <span>RESEARCH NOTES</span>
        <h1 v-if="currentColumn">{{ zh ? currentColumn.zh : currentColumn.en }}</h1>
        <h1 v-else>{{ zh ? '研究笔记' : 'Research Notes' }}</h1>
        <p v-if="currentColumn">{{ zh ? currentColumn.zhDescription : currentColumn.enDescription }}</p>
        <p v-else>{{ zh
          ? '研究笔记是 Research Center 每天持续增长的核心资产。所有文章由 column、category 与 date 元数据自动组织。'
          : 'Research Notes are the continuously growing core assets of the Research Center. Every article is organized automatically by column, category and date metadata.'
        }}</p>
      </div>
      <a v-if="currentColumn" :href="withBase(zh ? '/zh/research/' : '/en/research/')">
        {{ zh ? '返回研究笔记' : 'Back to Research Notes' }} →
      </a>
    </section>

    <template v-if="!currentColumn">
      <section class="rn-columns" aria-label="Research columns">
        <a v-for="columnItem in columns" :key="columnItem.key" :href="columnPath(columnItem)" class="rn-column-card">
          <div class="rn-column-head">
            <span>{{ columnItem.key.replaceAll('-', ' ').toUpperCase() }}</span>
            <strong>{{ notesForColumn(columnItem.key).length }}</strong>
          </div>
          <h2>{{ zh ? columnItem.zh : columnItem.en }}</h2>
          <p>{{ zh ? columnItem.zhDescription : columnItem.enDescription }}</p>
          <div class="rn-breakdown">
            <span>{{ zh ? '每日' : 'Daily' }} {{ categoryCount(columnItem.key, 'daily') }}</span>
            <span>{{ zh ? '每周' : 'Weekly' }} {{ categoryCount(columnItem.key, 'weekly') }}</span>
            <span>{{ zh ? '学术' : 'Academic' }} {{ categoryCount(columnItem.key, 'academic') }}</span>
          </div>
          <b>{{ zh ? '进入栏目' : 'Open column' }} →</b>
        </a>
      </section>

      <div class="rn-section-title">
        <div>
          <span>{{ zh ? 'LATEST' : 'LATEST' }}</span>
          <h2>{{ zh ? '最新研究笔记' : 'Latest Research Notes' }}</h2>
        </div>
        <small>{{ zh ? '按日期倒序' : 'Newest first' }}</small>
      </div>
    </template>

    <template v-else>
      <section class="rn-metrics">
        <button
          v-for="category in categories"
          :key="category.key"
          type="button"
          :class="{ active: activeCategory === category.key }"
          @click="activeCategory = category.key"
        >
          <strong>{{ category.key === 'all'
            ? notesForColumn(props.column!).length
            : categoryCount(props.column!, category.key as ResearchCategory)
          }}</strong>
          <span>{{ zh ? category.zh : category.en }}</span>
        </button>
      </section>

      <section class="rn-toolbar">
        <div>
          <b>{{ zh ? '按日期浏览' : 'Browse by date' }}</b>
          <span>{{ zh ? '默认按日期倒序排列' : 'Sorted by date, newest first' }}</span>
        </div>
        <label>
          <span>{{ zh ? '日历搜索' : 'Calendar search' }}</span>
          <input v-model="selectedDate" type="date">
          <button v-if="selectedDate" type="button" @click="clearDate">{{ zh ? '清除' : 'Clear' }}</button>
        </label>
      </section>
    </template>

    <section v-if="latestNotes.length" class="rn-list">
      <a v-for="note in latestNotes" :key="note.url" :href="withBase(note.url)">
        <time>{{ note.date }}</time>
        <div>
          <div class="rn-tags">
            <span>{{ categoryLabel(note.category) }}</span>
            <span v-if="!currentColumn">{{ zh
              ? columns.find(item => item.key === note.column)?.zh
              : columns.find(item => item.key === note.column)?.en
            }}</span>
          </div>
          <h3>{{ note.title }}</h3>
          <p v-if="note.summary">{{ note.summary }}</p>
        </div>
        <b>→</b>
      </a>
    </section>

    <section v-else class="rn-empty">
      <strong>{{ zh ? '没有匹配的研究笔记' : 'No matching research notes' }}</strong>
      <p>{{ zh ? '清除日期筛选，或等待 Research OS 生成新的研究笔记。' : 'Clear the date filter or wait for the Research OS to publish a new note.' }}</p>
    </section>
  </div>
</template>

<style scoped>
.rn-shell{margin:8px 0 48px}.rn-hero{display:flex;justify-content:space-between;gap:28px;align-items:flex-end;margin:16px 0 28px;padding:30px;border-radius:24px;background:radial-gradient(circle at 80% 20%,rgba(90,104,255,.36),transparent 35%),linear-gradient(135deg,#081427,#12334f);color:#fff}.rn-hero>div{max-width:760px}.rn-hero span,.rn-section-title span{font-size:12px;letter-spacing:.14em;font-weight:800;color:#79deef}.rn-hero h1{margin:10px 0 9px;font-size:clamp(32px,5vw,52px);line-height:1.05}.rn-hero p{margin:0;color:#cdd9e7;line-height:1.75}.rn-hero a{flex:none;color:#fff!important;text-decoration:none!important;font-weight:750}.rn-columns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:0 0 38px}.rn-column-card{display:flex;flex-direction:column;min-height:300px;padding:24px;border:1px solid var(--vp-c-divider);border-radius:20px;background:var(--vp-c-bg-soft);color:inherit!important;text-decoration:none!important;transition:.2s ease}.rn-column-card:hover{transform:translateY(-3px);border-color:var(--vp-c-brand-1);box-shadow:0 14px 34px rgba(15,23,42,.1)}.rn-column-head{display:flex;align-items:center;justify-content:space-between;gap:16px}.rn-column-head span{font-size:11px;letter-spacing:.1em;color:var(--vp-c-text-2);font-weight:800}.rn-column-head strong{font-size:32px;font-variant-numeric:tabular-nums}.rn-column-card h2{margin:20px 0 8px}.rn-column-card p{margin:0;color:var(--vp-c-text-2);line-height:1.7}.rn-column-card>b{margin-top:auto;padding-top:20px;color:var(--vp-c-brand-1)}.rn-breakdown{display:flex;flex-wrap:wrap;gap:7px;margin-top:18px}.rn-breakdown span,.rn-tags span{padding:5px 9px;border-radius:999px;background:var(--vp-c-bg);font-size:12px;color:var(--vp-c-text-2)}.rn-section-title{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin:30px 0 10px}.rn-section-title h2{margin:5px 0 0}.rn-section-title small{color:var(--vp-c-text-2)}.rn-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:0 0 24px}.rn-metrics button{display:flex;flex-direction:column;align-items:flex-start;padding:18px;border:1px solid var(--vp-c-divider);border-radius:16px;background:var(--vp-c-bg-soft);color:inherit;cursor:pointer}.rn-metrics button.active{border-color:var(--vp-c-brand-1);box-shadow:inset 0 0 0 1px var(--vp-c-brand-1);background:var(--vp-c-brand-soft)}.rn-metrics strong{font-size:28px}.rn-metrics span{color:var(--vp-c-text-2)}.rn-toolbar{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:16px 0 14px;border-bottom:1px solid var(--vp-c-divider)}.rn-toolbar>div{display:flex;flex-direction:column}.rn-toolbar>div span{font-size:13px;color:var(--vp-c-text-2)}.rn-toolbar label{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--vp-c-text-2)}.rn-toolbar input{padding:8px 10px;border:1px solid var(--vp-c-divider);border-radius:10px;background:var(--vp-c-bg);color:inherit}.rn-toolbar button{border:0;background:none;color:var(--vp-c-brand-1);cursor:pointer}.rn-list{border-top:1px solid var(--vp-c-divider)}.rn-list>a{display:grid;grid-template-columns:110px 1fr auto;gap:20px;align-items:center;padding:22px 4px;border-bottom:1px solid var(--vp-c-divider);color:inherit!important;text-decoration:none!important}.rn-list>a:hover h3{color:var(--vp-c-brand-1)}.rn-list time{color:var(--vp-c-text-2);font-variant-numeric:tabular-nums}.rn-list h3{margin:7px 0 5px}.rn-list p{margin:0;color:var(--vp-c-text-2);line-height:1.6}.rn-tags{display:flex;gap:7px;flex-wrap:wrap}.rn-list>a>b{font-size:20px;color:var(--vp-c-brand-1)}.rn-empty{margin-top:18px;padding:30px;border:1px dashed var(--vp-c-divider);border-radius:18px;text-align:center}.rn-empty p{margin:8px 0 0;color:var(--vp-c-text-2)}@media(max-width:900px){.rn-columns{grid-template-columns:1fr}.rn-column-card{min-height:0}.rn-metrics{grid-template-columns:repeat(2,1fr)}}@media(max-width:640px){.rn-hero{display:block;padding:24px}.rn-hero a{display:block;margin-top:20px}.rn-toolbar{align-items:flex-start;flex-direction:column}.rn-toolbar label{width:100%;flex-wrap:wrap}.rn-list>a{grid-template-columns:1fr auto}.rn-list time{grid-column:1/-1}.rn-metrics{grid-template-columns:1fr 1fr}}
</style>
