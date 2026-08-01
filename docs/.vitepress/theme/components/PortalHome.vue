<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as allNotes } from './research-notes.data'
import type { ResearchCategory, ResearchColumn, ResearchNoteRecord } from './research-notes.data'

const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })
const zh = computed(() => props.lang === 'zh')

const t = computed(() => zh.value ? {
  eyebrow: '独立 · 工程驱动的 AI 研究',
  title1: '建设可治理的', title2: 'AI 工作系统。',
  intro: 'Research OS 持续产出研究笔记；GitHub 保存唯一事实；网站依据元数据自动组织数字员工、行业架构与开源工程研究。',
  explore: '进入研究笔记', publications: '阅读出版物',
  notesKicker: '01 / 研究笔记', notesTitle: '三个长期研究栏目', notesLead: '研究笔记是网站每天增长的核心资产。篇数、类别和顺序全部来自 Markdown 元数据。',
  latestKicker: '02 / 最新研究', latestTitle: '最近发布', latestLead: '按日期自动排序，不再维护首页文章清单。',
  programsKicker: '03 / 研究计划', programsTitle: '理论、协议、Runtime 与应用', programsLead: '研究笔记提供持续输入，研究计划形成长期架构与工程成果。',
  pubKicker: '04 / 出版中心', pubTitle: 'TMPA 正式出版体系', pubLead: 'TMPA 论文、核心规范与工程案例由独立论文任务维护。',
  timelineKicker: '05 / 研究生命周期', timelineTitle: '从笔记到正式发布',
  manifesto: '不要把 AI 包装成确定性。', manifesto2: '让不确定的智能进入可治理的工作系统。',
  allNotes: '全部研究笔记', openColumn: '进入栏目', readNote: '阅读笔记', switchText: 'Switch to English'
} : {
  eyebrow: 'INDEPENDENT · ENGINEERING-DRIVEN AI RESEARCH',
  title1: 'Building governed', title2: 'AI work systems.',
  intro: 'Research OS produces continuous research notes; GitHub preserves the single source of truth; the site organizes Digital Employee, Industry Architecture and Open-source Engineering work directly from metadata.',
  explore: 'Explore Research Notes', publications: 'Read publications',
  notesKicker: '01 / RESEARCH NOTES', notesTitle: 'Three long-term research columns', notesLead: 'Research Notes are the site’s continuously growing core assets. Counts, categories and order all come from Markdown metadata.',
  latestKicker: '02 / LATEST RESEARCH', latestTitle: 'Recently published', latestLead: 'Automatically sorted by date, with no manually maintained homepage list.',
  programsKicker: '03 / PROGRAMS', programsTitle: 'Theory, protocol, runtime and application', programsLead: 'Research Notes provide continuous input; research programs turn it into durable architecture and engineering outputs.',
  pubKicker: '04 / PUBLICATION CENTER', pubTitle: 'TMPA publication system', pubLead: 'The TMPA paper, Core specification and implementation case are maintained by the dedicated publication task.',
  timelineKicker: '05 / RESEARCH LIFECYCLE', timelineTitle: 'From note to formal release',
  manifesto: 'Do not pretend AI is deterministic.', manifesto2: 'Build systems that govern intelligent uncertainty.',
  allNotes: 'All Research Notes', openColumn: 'Open column', readNote: 'Read note', switchText: '切换到简体中文'
})

const base = (path: string) => withBase(path)
const p = (en: string, zhPath: string) => zh.value ? zhPath : en

const localizedNotes = computed(() =>
  (allNotes as ResearchNoteRecord[]).filter(note => note.lang === props.lang)
)

const columns: Array<{
  key: ResearchColumn
  labelEn: string
  labelZh: string
  descriptionEn: string
  descriptionZh: string
  pathEn: string
  pathZh: string
  code: string
}> = [
  {
    key: 'digital-employee',
    labelEn: 'Digital Employee', labelZh: '数字员工', code: 'DE',
    descriptionEn: 'Position, responsibility, workflow, runtime, governance and evaluation.',
    descriptionZh: '岗位、职责、工作流、Runtime、治理与评估。',
    pathEn: '/en/digital-employee/', pathZh: '/zh/digital-employee/'
  },
  {
    key: 'industry-architecture',
    labelEn: 'Industry Architecture', labelZh: '行业架构', code: 'IA',
    descriptionEn: 'Enterprise digital workforce, control planes and work-management systems.',
    descriptionZh: '企业数字劳动力、控制平面与工作管理系统。',
    pathEn: '/en/industry/', pathZh: '/zh/industry/'
  },
  {
    key: 'open-source-engineering',
    labelEn: 'Open-source Engineering', labelZh: '开源工程观察', code: 'OE',
    descriptionEn: 'Runtime, workflow, recovery, skills, tools and observability mechanisms.',
    descriptionZh: 'Runtime、Workflow、Recovery、Skill、Tool 与 Observability。',
    pathEn: '/en/engineering/', pathZh: '/zh/engineering/'
  }
]

const notesForColumn = (column: ResearchColumn) =>
  localizedNotes.value.filter(note => note.column === column)

const categoryCount = (column: ResearchColumn, category: ResearchCategory) =>
  notesForColumn(column).filter(note => note.category === category).length

const latestNotes = computed(() => localizedNotes.value.slice(0, 5))

const columnLabel = (column: ResearchColumn) => {
  const item = columns.find(entry => entry.key === column)
  return zh.value ? item?.labelZh : item?.labelEn
}

const categoryLabel = (category: ResearchCategory) => {
  const labels = {
    daily: ['Daily Research', '每日研究'],
    weekly: ['Weekly Synthesis', '每周综合'],
    academic: ['Academic Observation', '学术观察']
  } as const
  return labels[category][zh.value ? 1 : 0]
}
</script>

<template>
  <div class="rcv5">
    <section class="rcv5-hero">
      <div class="rcv5-grid"></div>
      <div class="rcv5-glow rcv5-glow-a"></div>
      <div class="rcv5-glow rcv5-glow-b"></div>
      <div class="rcv5-hero-inner">
        <div class="rcv5-hero-copy">
          <div class="rcv5-eyebrow">{{ t.eyebrow }}</div>
          <h1>{{ t.title1 }}<br><em>{{ t.title2 }}</em></h1>
          <p>{{ t.intro }}</p>
          <div class="rcv5-actions">
            <a class="primary" :href="p('/en/research/', '/zh/research/')">{{ t.explore }} <span>↗</span></a>
            <a class="secondary" :href="p('/en/publications/', '/zh/publications/')">{{ t.publications }} <span>→</span></a>
          </div>
          <div class="rcv5-meta">
            <span>Research OS</span><span>GitHub First</span><span>Metadata Driven</span>
          </div>
        </div>

        <div class="rcv5-system" aria-label="Research Notes operating system">
          <div class="rcv5-system-label">RESEARCH OPERATING SYSTEM</div>
          <div class="rcv5-node"><span class="rcv5-system-index">01</span><span><b>Research OS</b><small>{{ zh ? '持续产出研究笔记' : 'Continuous note production' }}</small></span></div>
          <i></i>
          <div class="rcv5-node"><span class="rcv5-system-index">02</span><span><b>GitHub Markdown</b><small>{{ zh ? '唯一事实源' : 'Single source of truth' }}</small></span></div>
          <i></i>
          <div class="rcv5-node"><span class="rcv5-system-index">03</span><span><b>Metadata Views</b><small>{{ zh ? '自动统计、分类与排序' : 'Automatic count, classify and sort' }}</small></span></div>
          <div class="rcv5-outcome">RESEARCH NOTES</div>
        </div>
      </div>
    </section>

    <div class="rcv5-shell">
      <section class="rcv5-dashboard">
        <div><b>{{ localizedNotes.length }}</b><span>{{ zh ? '当前研究笔记' : 'Current research notes' }}</span></div>
        <div><b>03</b><span>{{ zh ? '长期研究栏目' : 'Research columns' }}</span></div>
        <div><b>03</b><span>{{ zh ? '内容类别' : 'Content categories' }}</span></div>
        <div><b>Git</b><span>{{ zh ? '唯一事实源' : 'Single source' }}</span></div>
      </section>

      <section class="rcv5-section rcv5-notes-section">
        <div class="rcv5-heading">
          <div><span>{{ t.notesKicker }}</span><h2>{{ t.notesTitle }}</h2><p>{{ t.notesLead }}</p></div>
          <a :href="p('/en/research/', '/zh/research/')">{{ t.allNotes }} →</a>
        </div>

        <div class="rcv5-notes-grid">
          <a
            v-for="column in columns"
            :key="column.key"
            :class="['rcv5-note-column', `is-${column.key}`]"
            :href="p(column.pathEn, column.pathZh)"
          >
            <div class="rcv5-note-column-top">
              <span>{{ column.code }}</span>
              <strong>{{ notesForColumn(column.key).length }}</strong>
            </div>
            <div>
              <small>{{ column.key.replaceAll('-', ' ').toUpperCase() }}</small>
              <h3>{{ zh ? column.labelZh : column.labelEn }}</h3>
              <p>{{ zh ? column.descriptionZh : column.descriptionEn }}</p>
            </div>
            <div class="rcv5-note-counts">
              <span><b>{{ categoryCount(column.key, 'daily') }}</b>{{ zh ? '每日' : 'Daily' }}</span>
              <span><b>{{ categoryCount(column.key, 'weekly') }}</b>{{ zh ? '每周' : 'Weekly' }}</span>
              <span><b>{{ categoryCount(column.key, 'academic') }}</b>{{ zh ? '学术' : 'Academic' }}</span>
            </div>
            <div class="rcv5-note-column-link">{{ t.openColumn }} <b>↗</b></div>
          </a>
        </div>
      </section>

      <section class="rcv5-section rcv5-latest-section">
        <div class="rcv5-heading">
          <div><span>{{ t.latestKicker }}</span><h2>{{ t.latestTitle }}</h2><p>{{ t.latestLead }}</p></div>
          <a :href="p('/en/research/', '/zh/research/')">{{ t.allNotes }} →</a>
        </div>

        <div class="rcv5-editorial-list">
          <a v-for="(note, index) in latestNotes" :key="note.url" :href="base(note.url)">
            <span class="rcv5-note-no">{{ String(index + 1).padStart(2, '0') }}</span>
            <time>{{ note.date }}</time>
            <div class="rcv5-note-main">
              <div class="rcv5-note-tags"><span>{{ columnLabel(note.column) }}</span><span>{{ categoryLabel(note.category) }}</span></div>
              <h3>{{ note.title }}</h3>
              <p v-if="note.summary">{{ note.summary }}</p>
            </div>
            <span class="rcv5-note-arrow">→</span>
          </a>
        </div>
      </section>

      <section class="rcv5-section">
        <div class="rcv5-heading"><div><span>{{ t.programsKicker }}</span><h2>{{ t.programsTitle }}</h2><p>{{ t.programsLead }}</p></div></div>
        <div class="rcv5-program-grid">
          <a class="rcv5-program tmpa" :href="p('/en/publications/', '/zh/publications/')">
            <div class="rcv5-program-cover"><span>GOVERNANCE</span><strong>T○</strong><i></i></div>
            <div class="rcv5-program-body"><small>TEXTUAL MULTI-AGENT GOVERNANCE</small><h3>TMPA</h3><p>{{ zh ? '文本化多智能体流程架构：以持久治理对象、单写者串行流、异步协作与确定性重建组织 AI 工作。' : 'A textual multi-agent process architecture built on durable governance objects, single-writer streams, asynchronous collaboration and deterministic reconstruction.' }}</p><b>{{ zh ? '论文与规范' : 'Paper & specification' }} ↗</b></div>
          </a>
          <a class="rcv5-program fcop-program" href="https://joinwell52-ai.github.io/FCoP/">
            <div class="rcv5-program-cover"><span>COORDINATION</span><img src="https://raw.githubusercontent.com/joinwell52-AI/FCoP/main/assets/fcop-logo-256.png" alt="FCoP logo"><i></i></div>
            <div class="rcv5-program-body"><small>FORMAL COLLABORATION PROTOCOL</small><h3>FCoP</h3><p>{{ zh ? '多 Agent 正式责任交接与生命周期闭环。' : 'Formal responsibility handoffs and lifecycle closure.' }}</p><b>{{ zh ? '访问正式官网' : 'Official site' }} ↗</b></div>
          </a>
          <a class="rcv5-program codeflow" href="https://github.com/joinwell52-AI/CodeFlowMu-open">
            <div class="rcv5-program-cover"><span>RUNTIME</span><strong>Cμ</strong><i></i></div>
            <div class="rcv5-program-body"><small>DIGITAL EMPLOYEE RUNTIME</small><h3>CodeFlowMu</h3><p>{{ zh ? '数字员工开发与工作 Runtime。' : 'Digital Employee development and work runtime.' }}</p><b>{{ zh ? '工程项目' : 'Engineering project' }} ↗</b></div>
          </a>
          <a class="rcv5-program employee" :href="p('/en/digital-employee/architecture', '/zh/digital-employee/architecture')">
            <div class="rcv5-program-cover"><span>APPLICATION</span><div class="rcv5-people"><i></i><i></i><i></i></div></div>
            <div class="rcv5-program-body"><small>GOVERNED AI WORKFORCE</small><h3>Digital Employee</h3><p>{{ zh ? '面向组织岗位的受治理数字劳动力。' : 'Governed digital workforce organized around positions.' }}</p><b>{{ zh ? '纲领性架构' : 'Governing architecture' }} →</b></div>
          </a>
        </div>
      </section>

      <section class="rcv5-section">
        <div class="rcv5-heading"><div><span>{{ t.pubKicker }}</span><h2>{{ t.pubTitle }}</h2><p>{{ t.pubLead }}</p></div><a :href="p('/en/publications/', '/zh/publications/')">{{ zh ? '进入出版中心' : 'Publication center' }} →</a></div>
        <div class="rcv5-pubs">
          <a :href="p('/en/publications/tmpa-architecture-paper-a0.4', '/zh/publications/tmpa-architecture-paper-a0.4')"><img :src="base('/assets/covers/tmpa-paper.svg')" alt="TMPA Architecture Paper"><div><span>PAPER · A0.4</span><h3>TMPA Architecture Paper</h3><p>{{ zh ? '正式研究论文。' : 'Formal research paper.' }}</p><b>Read · Cite · Versions →</b></div></a>
          <a :href="p('/en/publications/tmpa-core-specification-s0.3', '/zh/publications/tmpa-core-specification-s0.3')"><img :src="base('/assets/covers/tmpa-spec.svg')" alt="TMPA Core Specification"><div><span>SPEC · S0.3</span><h3>TMPA Core Specification</h3><p>{{ zh ? 'RFC 风格核心规范。' : 'RFC-style Core specification.' }}</p><b>Read · Cite · Versions →</b></div></a>
          <a :href="p('/en/publications/implementation-case-i0.3', '/zh/publications/implementation-case-i0.3')"><img :src="base('/assets/covers/implementation-case.svg')" alt="Implementation Case"><div><span>CASE · I0.3</span><h3>Implementation Case Report</h3><p>{{ zh ? 'FCoP、CodeFlowMu 与小典 AI 工程证据。' : 'Engineering evidence from FCoP, CodeFlowMu and XiaoDian AI.' }}</p><b>Read · Cite · Versions →</b></div></a>
        </div>
      </section>

      <section class="rcv5-section">
        <div class="rcv5-heading"><div><span>{{ t.timelineKicker }}</span><h2>{{ t.timelineTitle }}</h2></div></div>
        <div class="rcv5-timeline">
          <div class="active"><i></i><span>NOTE</span><h3>{{ zh ? '研究笔记' : 'Research Note' }}</h3><p>{{ zh ? '持续观察与工程判断。' : 'Continuous observation and engineering judgment.' }}</p></div>
          <div class="active"><i></i><span>SYNTHESIS</span><h3>{{ zh ? '综合分析' : 'Synthesis' }}</h3><p>{{ zh ? '跨来源形成稳定判断。' : 'Cross-source consolidation into stable judgments.' }}</p></div>
          <div><i></i><span>STABLE</span><h3>{{ zh ? '版本收口' : 'Version closure' }}</h3><p>{{ zh ? '实验、图表、引用与复核。' : 'Experiments, figures, citations and review.' }}</p></div>
          <div><i></i><span>PUBLISH</span><h3>{{ zh ? '正式发布' : 'Formal release' }}</h3><p>{{ zh ? '论文、规范与工程报告。' : 'Papers, specifications and implementation reports.' }}</p></div>
        </div>
      </section>

      <section class="rcv5-manifesto"><span>GITHUB FIRST · METADATA DRIVEN · CONTINUOUSLY REVISED</span><h2>{{ t.manifesto }}<br>{{ t.manifesto2 }}</h2><div><a :href="p('/en/research/', '/zh/research/')">{{ t.explore }} ↗</a><a :href="zh ? '/' : '/zh/'">{{ t.switchText }} →</a></div></section>
    </div>
  </div>
</template>

<style scoped>
.rcv5-system-index{display:grid;place-items:center;flex:0 0 42px;height:42px;border-radius:13px;background:linear-gradient(135deg,rgba(109,93,252,.28),rgba(54,203,232,.18));border:1px solid rgba(255,255,255,.12);font-size:10px;font-weight:850;letter-spacing:.08em;color:#a9e9f4}.rcv5-notes-section{padding-top:92px}.rcv5-notes-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.rcv5-note-column{position:relative;display:flex;flex-direction:column;min-height:420px;padding:30px;border:1px solid var(--rcv5-line);border-radius:30px;overflow:hidden;background:#fff;color:var(--rcv5-ink)!important;transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease}.rcv5-note-column:before{content:'';position:absolute;inset:0 0 auto;height:7px;background:linear-gradient(90deg,#6d5dfc,#36cbe8)}.rcv5-note-column.is-industry-architecture:before{background:linear-gradient(90deg,#1d8e8a,#55c7c1)}.rcv5-note-column.is-open-source-engineering:before{background:linear-gradient(90deg,#315db4,#76a1ff)}.rcv5-note-column:after{content:'';position:absolute;width:220px;height:220px;border-radius:50%;right:-120px;top:-120px;border:1px solid rgba(109,93,252,.12);box-shadow:0 0 0 34px rgba(109,93,252,.025),0 0 0 68px rgba(54,203,232,.018)}.rcv5-note-column:hover{transform:translateY(-5px);border-color:rgba(109,93,252,.3);box-shadow:0 26px 70px rgba(22,31,69,.12)}.rcv5-note-column-top{position:relative;z-index:1;display:flex;align-items:flex-start;justify-content:space-between}.rcv5-note-column-top>span{display:grid;place-items:center;width:48px;height:48px;border-radius:15px;background:var(--rcv5-panel);font-size:11px;letter-spacing:.1em;font-weight:850;color:var(--rcv5-violet)}.rcv5-note-column-top strong{font-size:58px;line-height:.9;letter-spacing:-.08em}.rcv5-note-column>div:nth-child(2){position:relative;z-index:1;margin-top:58px}.rcv5-note-column small{font-size:9px;letter-spacing:.13em;color:var(--rcv5-muted);font-weight:800}.rcv5-note-column h3{font-size:34px;line-height:1.05;letter-spacing:-.045em;margin:13px 0 14px}.rcv5-note-column p{margin:0;color:var(--rcv5-muted);font-size:14px;line-height:1.7}.rcv5-note-counts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:auto;padding-top:28px}.rcv5-note-counts span{padding:12px 8px;border-radius:14px;background:var(--rcv5-panel);font-size:10px;color:var(--rcv5-muted);text-align:center}.rcv5-note-counts b{display:block;color:var(--rcv5-ink);font-size:18px}.rcv5-note-column-link{display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:17px;border-top:1px solid var(--rcv5-line);font-size:12px;font-weight:750}.rcv5-editorial-list{border-top:1px solid var(--rcv5-line)}.rcv5-editorial-list>a{display:grid;grid-template-columns:48px 105px minmax(0,1fr) 30px;gap:22px;align-items:center;padding:25px 4px;border-bottom:1px solid var(--rcv5-line);color:var(--rcv5-ink)!important;transition:padding .2s ease,background .2s ease}.rcv5-editorial-list>a:hover{padding-left:14px;padding-right:14px;background:linear-gradient(90deg,rgba(109,93,252,.045),transparent)}.rcv5-note-no{font-size:11px;color:var(--rcv5-violet);font-weight:850;letter-spacing:.12em}.rcv5-editorial-list time{font-size:12px;color:var(--rcv5-muted);font-variant-numeric:tabular-nums}.rcv5-note-tags{display:flex;gap:7px;flex-wrap:wrap}.rcv5-note-tags span{padding:5px 9px;border-radius:999px;background:var(--rcv5-panel);color:var(--rcv5-muted);font-size:9px;font-weight:750}.rcv5-note-main h3{font-size:22px;line-height:1.25;margin:8px 0 5px;letter-spacing:-.025em}.rcv5-note-main p{margin:0;color:var(--rcv5-muted);font-size:13px;line-height:1.55}.rcv5-note-arrow{font-size:22px;color:var(--rcv5-violet)}.dark .rcv5-note-column{background:#101529}.dark .rcv5-note-column-top>span,.dark .rcv5-note-counts span,.dark .rcv5-note-tags span{background:#171d34}@media(max-width:900px){.rcv5-notes-grid{grid-template-columns:1fr}.rcv5-note-column{min-height:340px}.rcv5-note-column>div:nth-child(2){margin-top:34px}.rcv5-editorial-list>a{grid-template-columns:40px 92px minmax(0,1fr) 24px;gap:14px}}@media(max-width:640px){.rcv5-note-column{padding:24px;border-radius:24px}.rcv5-note-column h3{font-size:29px}.rcv5-editorial-list>a{grid-template-columns:34px 1fr 22px;gap:10px;padding:20px 2px}.rcv5-editorial-list time{grid-column:2/3;grid-row:1}.rcv5-note-main{grid-column:2/3}.rcv5-note-arrow{grid-column:3;grid-row:1/3;align-self:center}.rcv5-note-no{grid-row:1/3}.rcv5-note-main h3{font-size:19px}.rcv5-note-main p{font-size:12px}.rcv5-note-counts{gap:6px}.rcv5-note-counts span{padding:10px 5px}}
</style>
