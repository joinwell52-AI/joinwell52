<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as allNotes } from './research-notes.data'
import type { ResearchCategory, ResearchColumn, ResearchNoteRecord } from './research-notes.data'

const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })
const zh = computed(() => props.lang === 'zh')

const t = computed(() => zh.value ? {
  languageCurrent: '中文', languageOther: 'EN', languageLink: '/',
  eyebrow: '独立 · 工程驱动的 AI 研究',
  title1: '建设可治理的', title2: 'AI 工作系统。',
  intro: '研究 AI 工作数据、正式协作、数字员工与可落地多 Agent 系统；以 FCoP 和 CodeFlowMu 的真实工程证据为基础。',
  explore: '进入研究笔记', publications: '阅读出版物',
  programsKicker: '01 / 研究计划', programsTitle: '官方研究计划', programsLead: '一个门户连接理论、协议、运行工程与最终应用方向。',
  hierarchyKicker: '02 / 研究笔记', hierarchyTitle: '三个长期研究栏目', hierarchyLead: '所有研究文章由 column、category 与 date 元数据自动分类、统计和排序。',
  latestKicker: '03 / 最新研究', latestTitle: '最新研究笔记', latestLead: '列表直接由 GitHub Markdown 元数据生成，不维护手工首页文章清单。',
  pubKicker: '04 / 出版中心', pubTitle: '版本化公开成果', pubLead: '论文、规范与工程案例均具有明确版本、状态、阅读与引用路径。',
  timelineKicker: '05 / 研究生命周期', timelineTitle: '从研究笔记，到正式发表',
  manifesto: '不要把 AI 包装成确定性。', manifesto2: '让不确定的智能进入可治理的工作系统。',
  switchText: 'Switch to English',
} : {
  languageCurrent: 'EN', languageOther: '中文', languageLink: '/zh/',
  eyebrow: 'INDEPENDENT · ENGINEERING-DRIVEN AI RESEARCH',
  title1: 'Building governed', title2: 'AI work systems.',
  intro: 'Research on AI work data, formal coordination, Digital Employees and practical multi-agent systems — grounded in FCoP and CodeFlowMu engineering evidence.',
  explore: 'Explore Research Notes', publications: 'Read publications',
  programsKicker: '01 / PROGRAMS', programsTitle: 'Official research programs', programsLead: 'One portal connecting theory, protocol, runtime engineering and the final application direction.',
  hierarchyKicker: '02 / RESEARCH NOTES', hierarchyTitle: 'Three long-term research columns', hierarchyLead: 'Every research article is classified, counted and sorted automatically from column, category and date metadata.',
  latestKicker: '03 / LATEST RESEARCH', latestTitle: 'Latest Research Notes', latestLead: 'This list is generated directly from GitHub Markdown metadata; no manual homepage article list is maintained.',
  pubKicker: '04 / PUBLICATION CENTER', pubTitle: 'Versioned public work', pubLead: 'Papers, specifications and case reports with explicit status, reading and citation paths.',
  timelineKicker: '05 / RESEARCH LIFECYCLE', timelineTitle: 'From research notes to formal publication',
  manifesto: 'Do not pretend AI is deterministic.', manifesto2: 'Build systems that govern intelligent uncertainty.',
  switchText: '切换到简体中文',
})

const base = (path: string) => withBase(path)
const p = (en: string, zhPath: string) => zh.value ? zhPath : en

const latestNotes = computed(() =>
  (allNotes as ResearchNoteRecord[])
    .filter(note => note.lang === props.lang)
    .slice(0, 3)
)

const columnLabel = (column: ResearchColumn) => {
  const labels = {
    'digital-employee': ['Digital Employee', '数字员工'],
    'industry-architecture': ['Industry Architecture', '行业架构'],
    'open-source-engineering': ['Open-source Engineering', '开源工程观察']
  } as const
  return labels[column][zh.value ? 1 : 0]
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

        <div class="rcv5-system" aria-label="TMPA FCoP CodeFlowMu Digital Employee system">
          <div class="rcv5-system-label">RESEARCH SYSTEM</div>
          <a class="rcv5-node" :href="p('/en/publications/', '/zh/publications/')"><b>TMPA</b><small>Governance</small></a>
          <i></i>
          <a class="rcv5-node fcop" href="https://joinwell52-ai.github.io/FCoP/"><img src="https://raw.githubusercontent.com/joinwell52-AI/FCoP/main/assets/fcop-logo-256.png" alt="FCoP"><span><b>FCoP</b><small>Coordination</small></span></a>
          <i></i>
          <a class="rcv5-node" href="https://github.com/joinwell52-AI/CodeFlowMu-open"><b>CodeFlowMu</b><small>Runtime</small></a>
          <div class="rcv5-outcome">DIGITAL EMPLOYEE</div>
        </div>
      </div>
    </section>

    <div class="rcv5-shell">
      <section class="rcv5-dashboard">
        <div><b>03</b><span>{{ zh ? '长期研究栏目' : 'Research columns' }}</span></div>
        <div><b>03</b><span>{{ zh ? '研究内容类别' : 'Content categories' }}</span></div>
        <div><b>03</b><span>{{ zh ? 'TMPA 正式文档' : 'TMPA documents' }}</span></div>
        <div><b>Git</b><span>{{ zh ? '唯一事实源' : 'Single source' }}</span></div>
      </section>

      <section class="rcv5-section">
        <div class="rcv5-heading"><div><span>{{ t.programsKicker }}</span><h2>{{ t.programsTitle }}</h2><p>{{ t.programsLead }}</p></div></div>
        <div class="rcv5-program-grid">
          <a class="rcv5-program tmpa" :href="p('/en/publications/', '/zh/publications/')">
            <div class="rcv5-program-cover"><span>GOVERNANCE</span><strong>T○</strong><i></i></div>
            <div class="rcv5-program-body"><small>AI WORK DATA & GOVERNANCE</small><h3>TMPA</h3><p>{{ zh ? 'AI 工作数据与治理架构，覆盖 Profile、Event、Message、Index 与 Knowledge。' : 'AI work data and governance architecture across Profile, Event, Message, Index and Knowledge.' }}</p><b>{{ zh ? '论文与规范' : 'Paper & specification' }} ↗</b></div>
          </a>
          <a class="rcv5-program fcop-program" href="https://joinwell52-ai.github.io/FCoP/">
            <div class="rcv5-program-cover"><span>COORDINATION</span><img src="https://raw.githubusercontent.com/joinwell52-AI/FCoP/main/assets/fcop-logo-256.png" alt="FCoP logo"><i></i></div>
            <div class="rcv5-program-body"><small>FORMAL COLLABORATION PROTOCOL</small><h3>FCoP</h3><p>{{ zh ? '面向多 Agent 正式责任交接与生命周期闭环的协作协议。' : 'Formal responsibility handoffs and lifecycle closure for multi-agent work.' }}</p><b>{{ zh ? '访问正式官网' : 'Official site' }} ↗</b></div>
          </a>
          <a class="rcv5-program codeflow" href="https://github.com/joinwell52-AI/CodeFlowMu-open">
            <div class="rcv5-program-cover"><span>RUNTIME</span><strong>Cμ</strong><i></i></div>
            <div class="rcv5-program-body"><small>DIGITAL EMPLOYEE RUNTIME</small><h3>CodeFlowMu</h3><p>{{ zh ? '负责调度、Session、工具、恢复、证据与完成门禁的数字员工 Runtime。' : 'Digital Employee runtime for scheduling, sessions, tools, recovery, evidence and completion gates.' }}</p><b>{{ zh ? '工程项目' : 'Engineering project' }} ↗</b></div>
          </a>
          <a class="rcv5-program employee" :href="p('/en/digital-employee/architecture', '/zh/digital-employee/architecture')">
            <div class="rcv5-program-cover"><span>APPLICATION</span><div class="rcv5-people"><i></i><i></i><i></i></div></div>
            <div class="rcv5-program-body"><small>GOVERNED AI WORKFORCE</small><h3>Digital Employee</h3><p>{{ zh ? '对外是岗位，对内是由受治理 Runtime 执行的受管理工作团队。' : 'Externally a Position; internally a managed work team executed by a governed runtime.' }}</p><b>{{ zh ? '纲领性架构' : 'Governing architecture' }} →</b></div>
          </a>
        </div>
      </section>

      <section class="rcv5-section">
        <div class="rcv5-heading"><div><span>{{ t.hierarchyKicker }}</span><h2>{{ t.hierarchyTitle }}</h2><p>{{ t.hierarchyLead }}</p></div><a :href="p('/en/research/', '/zh/research/')">{{ zh ? '全部研究笔记' : 'All Research Notes' }} →</a></div>
        <div class="rcv5-taxonomy">
          <div class="rcv5-tax-card"><span>DIGITAL EMPLOYEE</span><h3>{{ zh ? '数字员工' : 'Digital Employee' }}</h3><a :href="p('/en/digital-employee/', '/zh/digital-employee/')"><b>{{ zh ? '进入研究笔记' : 'Open Research Notes' }}</b><small>Position · Workflow · Runtime · Governance</small></a></div>
          <div class="rcv5-tax-card"><span>INDUSTRY ARCHITECTURE</span><h3>{{ zh ? '行业架构' : 'Industry Architecture' }}</h3><a :href="p('/en/industry/', '/zh/industry/')"><b>{{ zh ? '进入研究笔记' : 'Open Research Notes' }}</b><small>{{ zh ? '企业数字劳动力与控制面' : 'Enterprise workforce and control planes' }}</small></a></div>
          <div class="rcv5-tax-card"><span>OPEN-SOURCE ENGINEERING</span><h3>{{ zh ? '开源工程观察' : 'Open-source Engineering' }}</h3><a :href="p('/en/engineering/', '/zh/engineering/')"><b>{{ zh ? '进入研究笔记' : 'Open Research Notes' }}</b><small>Runtime · Recovery · Skill · Observability</small></a></div>
        </div>
      </section>

      <section class="rcv5-section">
        <div class="rcv5-heading"><div><span>{{ t.latestKicker }}</span><h2>{{ t.latestTitle }}</h2><p>{{ t.latestLead }}</p></div><a :href="p('/en/research/', '/zh/research/')">{{ zh ? '研究笔记' : 'Research Notes' }} →</a></div>
        <div class="rcv5-taxonomy">
          <div v-for="note in latestNotes" :key="note.url" class="rcv5-tax-card">
            <span>{{ columnLabel(note.column).toUpperCase() }}</span>
            <h3>{{ note.title }}</h3>
            <a :href="base(note.url)"><b>{{ categoryLabel(note.category) }}</b><small>{{ note.date }} · {{ note.summary }}</small></a>
          </div>
        </div>
      </section>

      <section class="rcv5-section">
        <div class="rcv5-heading"><div><span>{{ t.pubKicker }}</span><h2>{{ t.pubTitle }}</h2><p>{{ t.pubLead }}</p></div><a :href="p('/en/publications/', '/zh/publications/')">{{ zh ? '进入出版中心' : 'Publication center' }} →</a></div>
        <div class="rcv5-pubs">
          <a :href="p('/en/publications/tmpa-architecture-paper-a0.4', '/zh/publications/tmpa-architecture-paper-a0.4')"><img :src="base('/assets/covers/tmpa-paper.svg')" alt="TMPA Architecture Paper"><div><span>PAPER · A0.4</span><h3>TMPA Architecture Paper</h3><p>{{ zh ? '研究问题、设计贡献、评估与局限。' : 'Research framing, design contribution, evaluation and limitations.' }}</p><b>Read · Cite · Versions →</b></div></a>
          <a :href="p('/en/publications/tmpa-core-specification-s0.3', '/zh/publications/tmpa-core-specification-s0.3')"><img :src="base('/assets/covers/tmpa-spec.svg')" alt="TMPA Core Specification"><div><span>SPEC · S0.3</span><h3>TMPA Core Specification</h3><p>{{ zh ? '可实现契约与存储无关语义。' : 'Implementable contracts and storage-independent semantics.' }}</p><b>Read · Cite · Versions →</b></div></a>
          <a :href="p('/en/publications/implementation-case-i0.3', '/zh/publications/implementation-case-i0.3')"><img :src="base('/assets/covers/implementation-case.svg')" alt="Implementation Case"><div><span>CASE · I0.3</span><h3>Implementation Case Report</h3><p>{{ zh ? '生命周期、恢复、门禁与多角色闭环的工程证据。' : 'Evidence from lifecycle, recovery, gates and multi-role closure.' }}</p><b>Read · Cite · Versions →</b></div></a>
        </div>
      </section>

      <section class="rcv5-section">
        <div class="rcv5-heading"><div><span>{{ t.timelineKicker }}</span><h2>{{ t.timelineTitle }}</h2></div></div>
        <div class="rcv5-timeline">
          <div class="active"><i></i><span>NOTE</span><h3>{{ zh ? '研究笔记' : 'Research Note' }}</h3><p>{{ zh ? '由栏目、类别与日期元数据组织。' : 'Organized by column, category and date metadata.' }}</p></div>
          <div class="active"><i></i><span>SYNTHESIS</span><h3>{{ zh ? '综合判断' : 'Synthesis' }}</h3><p>{{ zh ? '形成判断并反哺架构。' : 'Judgment and architecture updates.' }}</p></div>
          <div><i></i><span>STABLE</span><h3>{{ zh ? '版本收口' : 'Version closure' }}</h3><p>{{ zh ? '图表、实验与引用。' : 'Figures, experiments and citations.' }}</p></div>
          <div><i></i><span>PUBLISH</span><h3>{{ zh ? '正式发布' : 'Formal release' }}</h3><p>{{ zh ? '预印本、DOI 与投稿。' : 'Preprint, DOI and venue submission.' }}</p></div>
        </div>
      </section>

      <section class="rcv5-manifesto"><span>GITHUB FIRST · METADATA DRIVEN · CONTINUOUSLY REVISED</span><h2>{{ t.manifesto }}<br>{{ t.manifesto2 }}</h2><div><a :href="p('/en/research/', '/zh/research/')">{{ zh ? '浏览研究笔记' : 'Browse Research Notes' }} ↗</a><a :href="t.languageLink">{{ t.switchText }} →</a></div></section>
    </div>
  </div>
</template>
