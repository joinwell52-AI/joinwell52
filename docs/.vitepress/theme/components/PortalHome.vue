<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as allNotes } from './research-notes.data'
import type { ResearchCategory, ResearchColumn, ResearchNoteRecord } from './research-notes.data'

const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })
const zh = computed(() => props.lang === 'zh')

const t = computed(() => zh.value ? {
  eyebrow: 'RESEARCH CENTER 2.0 · 持续运行的 AI 研究中心',
  title1: '一个正在工作的', title2: '数字研究员。',
  intro: '研究报告生产机 V1.0 运行于 ChatGPT，通过 Research OS、Research Skills、Research Queue 与 GitHub-first Workflow 持续发现、研究、验证并发布成果。',
  primary: '查看 V1.0 正式发布', secondary: '进入观察笔记',
  osKicker: '01 / RESEARCH OPERATING SYSTEM', osTitle: '研究不是文章生成，而是一套持续运行的系统', osLead: 'Research OS 统一管理 Signal、Queue、Reading、Analysis、Publication 与 Release。Skills 是执行引擎，GitHub 是唯一事实源。',
  employeeKicker: '02 / DIGITAL RESEARCH EMPLOYEE', employeeTitle: '研究报告生产机 V1.0', employeeLead: '一个基于 ChatGPT 的 Research Analyst 岗位：有职责、有技能、有工作队列、有发布门禁，也有可验证的工作记录。',
  programsKicker: '03 / 研究计划', programsTitle: '理论、协议、Runtime 与应用', programsLead: '数字研究员持续提供研究输入，长期计划把研究沉淀为架构、协议、Runtime 与产品。',
  notesKicker: '04 / 观察笔记', notesTitle: '三个长期观察栏目', notesLead: '观察笔记是数字员工运行时留下的高频记录。篇数、类别和顺序全部来自 GitHub Markdown 元数据。',
  latestKicker: '05 / 最新研究', latestTitle: '最近发布', latestLead: '按日期自动排序，不维护第二套首页文章清单。',
  pubKicker: '06 / 出版中心', pubTitle: '能力、论文、规范与工程证据', pubLead: '研究报告生产机作为正式数字员工能力发布；TMPA 论文、核心规范与工程案例继续独立维护。',
  timelineKicker: '07 / 研究生命周期', timelineTitle: '从 Signal 到可验证 Release',
  manifesto: '数字员工不是一个会聊天的 AI。', manifesto2: '它拥有岗位、技能、流程、标准和可验证成果。',
  allNotes: '全部观察笔记', openColumn: '进入栏目', release: '正式发布', evidence: '生产证据',
  publicationCenter: '进入出版中心', switchText: 'Switch to English'
} : {
  eyebrow: 'RESEARCH CENTER 2.0 · CONTINUOUSLY OPERATING AI RESEARCH',
  title1: 'A working', title2: 'Digital Research Employee.',
  intro: 'Research Report Production Engine V1.0 runs on ChatGPT and continuously discovers, studies, verifies and publishes research through Research OS, Research Skills, Research Queue and a GitHub-first workflow.',
  primary: 'View the V1.0 release', secondary: 'Explore Observation Notes',
  osKicker: '01 / RESEARCH OPERATING SYSTEM', osTitle: 'Research is not article generation. It is an operating system.', osLead: 'Research OS governs Signal, Queue, Reading, Analysis, Publication and Release. Skills are the execution engine; GitHub is the single source of truth.',
  employeeKicker: '02 / DIGITAL RESEARCH EMPLOYEE', employeeTitle: 'Research Report Production Engine V1.0', employeeLead: 'A Research Analyst position built on ChatGPT—with responsibilities, skills, a work queue, publication gates and verifiable operating records.',
  programsKicker: '03 / PROGRAMS', programsTitle: 'Theory, protocol, runtime and application', programsLead: 'The Digital Research Employee supplies continuous research input; long-term programs turn it into architecture, protocols, runtimes and products.',
  notesKicker: '04 / OBSERVATION NOTES', notesTitle: 'Three long-term observation columns', notesLead: 'Observation Notes are high-frequency records left by the Digital Employee while it operates. Counts, categories and order come directly from GitHub Markdown metadata.',
  latestKicker: '05 / LATEST RESEARCH', latestTitle: 'Recently published', latestLead: 'Automatically sorted by date, with no second homepage article database.',
  pubKicker: '06 / PUBLICATION CENTER', pubTitle: 'Capabilities, papers, specifications and engineering evidence', pubLead: 'The Research Report Production Engine is released as a formal Digital Employee capability; TMPA publications remain independently maintained.',
  timelineKicker: '07 / RESEARCH LIFECYCLE', timelineTitle: 'From Signal to a verifiable Release',
  manifesto: 'A Digital Employee is not a chatbot.', manifesto2: 'It has a position, skills, workflow, standards and verifiable work.',
  allNotes: 'All Observation Notes', openColumn: 'Open column', release: 'Formal release', evidence: 'Production evidence',
  publicationCenter: 'Publication center', switchText: '切换到简体中文'
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

const capabilities = computed(() => [
  {
    code: 'OS',
    title: 'Research Operating System',
    meta: zh.value ? '唯一研究运行规范' : 'Single research operating standard',
    description: zh.value
      ? '统一 Research、Skills、Queue、Automation、Publication 与 Lifecycle。'
      : 'Unifies Research, Skills, Queue, Automation, Publication and Lifecycle.'
  },
  {
    code: '08',
    title: 'Research Skills',
    meta: zh.value ? '八项受治理能力' : 'Eight governed capabilities',
    description: zh.value
      ? '从 Source Discovery 到 Publication Editing，Skill 而不是文章生成负责执行。'
      : 'From Source Discovery to Publication Editing, skills—not article generation—perform the work.'
  },
  {
    code: 'Q',
    title: 'Research Queue',
    meta: 'Candidate · Priority · Status',
    description: zh.value
      ? '发现不直接进入写作；候选对象先评分、选择、延迟或拒绝。'
      : 'Discovery does not go directly to writing; candidates are scored, selected, deferred or rejected.'
  },
  {
    code: 'Git',
    title: 'GitHub First',
    meta: zh.value ? '唯一事实源' : 'Single source of truth',
    description: zh.value
      ? 'Markdown、Commit、PR、CI 与 Diff 共同构成正式出版和运行历史。'
      : 'Markdown, commits, PRs, CI and diffs form the authoritative publication and operating history.'
  }
])

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
            <a class="primary" :href="p('/en/publications/research-report-production-engine-v1.0', '/zh/publications/research-report-production-engine-v1.0')">{{ t.primary }} <span>↗</span></a>
            <a class="secondary" :href="p('/en/research/', '/zh/research/')">{{ t.secondary }} <span>→</span></a>
          </div>
          <div class="rcv5-meta">
            <span>Research OS</span><span>Digital Research Employee</span><span>GitHub First</span>
          </div>
        </div>

        <div class="rcv5-system" aria-label="Research Report Production Engine">
          <div class="rcv5-system-label">DIGITAL RESEARCH EMPLOYEE</div>
          <div class="rcv5-engine-version">
            <strong>V1.0</strong>
            <span><b>PRODUCTION VERIFIED</b><small>{{ zh ? '基于 ChatGPT 的数字研究员' : 'Digital Research Employee built on ChatGPT' }}</small></span>
          </div>
          <div class="rcv5-node"><span class="rcv5-system-index">01</span><span><b>Position</b><small>Research Analyst</small></span></div>
          <i></i>
          <div class="rcv5-node"><span class="rcv5-system-index">08</span><span><b>Research Skills</b><small>{{ zh ? '受治理的研究能力与 Queue' : 'Governed capabilities and Queue' }}</small></span></div>
          <i></i>
          <div class="rcv5-node"><span class="rcv5-system-index">Git</span><span><b>Publication</b><small>GitHub main · CI verified</small></span></div>
          <div class="rcv5-outcome">RESEARCH REPORT PRODUCTION ENGINE</div>
          <a class="rcv5-system-link" :href="p('/en/publications/research-report-production-engine-v1.0', '/zh/publications/research-report-production-engine-v1.0')">{{ t.evidence }} →</a>
        </div>
      </div>
    </section>

    <div class="rcv5-shell">
      <section class="rcv5-dashboard">
        <div><b>V1.0</b><span>{{ zh ? '正式能力发布' : 'Capability release' }}</span></div>
        <div><b>08</b><span>Research Skills</span></div>
        <div><b>06</b><span>{{ zh ? '生产测试对象' : 'Production test objects' }}</span></div>
        <div><b>main</b><span>{{ zh ? 'GitHub 权威分支' : 'Authoritative GitHub branch' }}</span></div>
      </section>

      <section class="rcv5-section rcv5-os-section">
        <div class="rcv5-heading">
          <div><span>{{ t.osKicker }}</span><h2>{{ t.osTitle }}</h2><p>{{ t.osLead }}</p></div>
          <a :href="p('/en/publications/research-report-production-engine-v1.0', '/zh/publications/research-report-production-engine-v1.0')">{{ t.release }} →</a>
        </div>

        <div class="rcv5-capability-grid">
          <article v-for="capability in capabilities" :key="capability.title" class="rcv5-capability-card">
            <div><span>{{ capability.code }}</span><small>{{ capability.meta }}</small></div>
            <h3>{{ capability.title }}</h3>
            <p>{{ capability.description }}</p>
          </article>
        </div>

        <div class="rcv5-operating-chain" aria-label="Research lifecycle">
          <span><b>Signal</b><small>Source Discovery</small></span><i>→</i>
          <span><b>Queue</b><small>Triage & Priority</small></span><i>→</i>
          <span><b>Reading</b><small>Primary Sources</small></span><i>→</i>
          <span><b>Analysis</b><small>Observation & Judgment</small></span><i>→</i>
          <span><b>Research Note</b><small>Writing & Visualization</small></span><i>→</i>
          <span><b>Publication</b><small>Evidence & CI</small></span><i>→</i>
          <span><b>Release</b><small>GitHub main</small></span>
        </div>
      </section>

      <section class="rcv5-section rcv5-employee-section">
        <div class="rcv5-heading">
          <div><span>{{ t.employeeKicker }}</span><h2>{{ t.employeeTitle }}</h2><p>{{ t.employeeLead }}</p></div>
        </div>

        <div class="rcv5-employee-layout">
          <article class="rcv5-employee-profile">
            <div class="rcv5-employee-status"><span>POSITION 001</span><b>● {{ zh ? '运行中' : 'RUNNING' }}</b></div>
            <small>CHATGPT APPLICATION · DIGITAL EMPLOYEE</small>
            <h3>Research Analyst</h3>
            <p>{{ zh ? '持续发现、阅读、分析、撰写、验证并发布与数字员工、行业架构、开源工程、TMPA 和 CodeFlowMu 有关的研究成果。' : 'Continuously discovers, reads, analyzes, writes, verifies and publishes research on Digital Employee, Industry Architecture, Open-source Engineering, TMPA and CodeFlowMu.' }}</p>
            <dl>
              <div><dt>{{ zh ? '工作系统' : 'Work system' }}</dt><dd>Research OS</dd></div>
              <div><dt>{{ zh ? '工作队列' : 'Work queue' }}</dt><dd>Research Queue</dd></div>
              <div><dt>{{ zh ? '输出标准' : 'Output standard' }}</dt><dd>Research Note V1.1</dd></div>
              <div><dt>{{ zh ? '事实源' : 'System of record' }}</dt><dd>GitHub</dd></div>
            </dl>
            <div class="rcv5-employee-actions">
              <a :href="p('/en/publications/research-report-production-engine-v1.0', '/zh/publications/research-report-production-engine-v1.0')">{{ t.release }} ↗</a>
              <a href="https://github.com/joinwell52-AI/joinwell52/tree/main/research/production-tests/production-test-v1">{{ t.evidence }} ↗</a>
            </div>
          </article>

          <div class="rcv5-employee-work">
            <div class="rcv5-responsibility-grid">
              <article><span>01–02</span><h3>{{ zh ? '发现与筛选' : 'Discover & Triage' }}</h3><p>{{ zh ? '寻找真正值得研究的同行、论文、产品与工程，并进入 Queue 评分。' : 'Find relevant peers, papers, products and engineering work, then score them through the Queue.' }}</p></article>
              <article><span>03–04</span><h3>{{ zh ? '阅读与分析' : 'Read & Analyze' }}</h3><p>{{ zh ? '阅读一手资料，区分 Facts、Claims、Observation 与 Research Judgment。' : 'Read primary material and separate facts, claims, observation and Research Judgment.' }}</p></article>
              <article><span>05–06</span><h3>{{ zh ? '写作与可视化' : 'Write & Visualize' }}</h3><p>{{ zh ? '生产独立中英文观察笔记、Cover、Diagram、Table 与 Timeline。' : 'Produce independent English and Chinese Observation Notes, covers, diagrams, tables and timelines.' }}</p></article>
              <article><span>07–08</span><h3>{{ zh ? '证据与发布' : 'Evidence & Publish' }}</h3><p>{{ zh ? '校验引用、Metadata、语言链接和 Build Gate，并发布到 GitHub main。' : 'Validate references, metadata, language links and build gates, then publish to GitHub main.' }}</p></article>
            </div>
            <article class="rcv5-production-proof">
              <span>PRODUCTION TEST V1 · PASS</span>
              <strong>3 Daily + 3 Academic</strong>
              <p>{{ zh ? '12 篇双语 Markdown、6 张独立 Cover、23 个新增文件；第一次 CI 发现真实 YAML 缺陷，修复后第二次 Build 通过并 Merge 到 main。' : '12 bilingual Markdown publications, 6 dedicated covers and 23 additive files; the first CI run caught a real YAML defect, the second build passed, and the release merged to main.' }}</p>
              <a href="https://github.com/joinwell52-AI/joinwell52/blob/main/research/production-tests/production-test-v1/REPORT.md">{{ zh ? '查看完整测试报告' : 'Read the complete production report' }} →</a>
            </article>
          </div>
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
        <div class="rcv5-heading"><div><span>{{ t.pubKicker }}</span><h2>{{ t.pubTitle }}</h2><p>{{ t.pubLead }}</p></div><a :href="p('/en/publications/', '/zh/publications/')">{{ t.publicationCenter }} →</a></div>
        <div class="rcv5-pubs">
          <a class="rcv5-engine-publication" :href="p('/en/publications/research-report-production-engine-v1.0', '/zh/publications/research-report-production-engine-v1.0')"><img :src="base('/assets/covers/research-report-production-engine-v1.svg')" alt="Research Report Production Engine V1.0"><div><span>DIGITAL EMPLOYEE CAPABILITY · V1.0</span><h3>{{ zh ? '研究报告生产机 V1.0' : 'Research Report Production Engine V1.0' }}</h3><p>{{ zh ? '一个经过生产验证、基于 ChatGPT 的数字研究员。' : 'A production-verified Digital Research Employee built on ChatGPT.' }}</p><b>{{ t.release }} · {{ t.evidence }} →</b></div></a>
          <a :href="p('/en/publications/tmpa-architecture-paper-a0.5', '/zh/publications/tmpa-architecture-paper-a0.5')"><img :src="base('/assets/covers/tmpa-paper.svg')" alt="TMPA Architecture Paper"><div><span>PAPER · A0.5</span><h3>TMPA Architecture Paper</h3><p>{{ zh ? '学术论文形态研究稿。' : 'Academic-form research paper.' }}</p><b>Read · Cite · Versions →</b></div></a>
          <a :href="p('/en/publications/tmpa-core-specification-s0.4', '/zh/publications/tmpa-core-specification-s0.4')"><img :src="base('/assets/covers/tmpa-spec.svg')" alt="TMPA Core Specification"><div><span>SPEC · S0.4</span><h3>TMPA Core Specification</h3><p>{{ zh ? 'RFC 风格可实现核心规范。' : 'Implementation-ready RFC-style Core specification.' }}</p><b>Read · Cite · Versions →</b></div></a>
          <a :href="p('/en/publications/implementation-case-i0.4', '/zh/publications/implementation-case-i0.4')"><img :src="base('/assets/covers/implementation-case.svg')" alt="Implementation Case"><div><span>CASE · I0.4</span><h3>Implementation Case Report</h3><p>{{ zh ? 'S0.4 Reference Reader 与 FCoP、CodeFlowMu、小典 AI 工程证据。' : 'S0.4 Reference Reader and engineering evidence from FCoP, CodeFlowMu and XiaoDian AI.' }}</p><b>Read · Cite · Versions →</b></div></a>
        </div>
      </section>

      <section class="rcv5-section">
        <div class="rcv5-heading"><div><span>{{ t.timelineKicker }}</span><h2>{{ t.timelineTitle }}</h2></div></div>
        <div class="rcv5-timeline">
          <div class="active"><i></i><span>SIGNAL</span><h3>{{ zh ? '研究信号' : 'Research Signal' }}</h3><p>{{ zh ? '发现来源，建立 Candidate。' : 'Discover sources and create candidates.' }}</p></div>
          <div class="active"><i></i><span>QUEUE</span><h3>Research Queue</h3><p>{{ zh ? '评分、优先级、Selected 与 Rejected。' : 'Score, prioritize, select, defer or reject.' }}</p></div>
          <div class="active"><i></i><span>RESEARCH</span><h3>{{ zh ? '阅读与分析' : 'Reading & Analysis' }}</h3><p>{{ zh ? '区分 Facts、Claims、Observation 与 Judgment。' : 'Separate facts, claims, observation and judgment.' }}</p></div>
          <div class="active"><i></i><span>PUBLISH</span><h3>{{ zh ? 'GitHub 发布' : 'GitHub Publication' }}</h3><p>{{ zh ? '中英文 Markdown、证据、PR 与 CI。' : 'Bilingual Markdown, evidence, PR and CI.' }}</p></div>
          <div class="active"><i></i><span>RELEASE</span><h3>{{ zh ? '正式发布' : 'Formal Release' }}</h3><p>{{ zh ? 'main、Commit Verification 与网站展示。' : 'main, commit verification and site presentation.' }}</p></div>
        </div>
      </section>

      <section class="rcv5-manifesto"><span>POSITION · SKILLS · WORKFLOW · EVIDENCE · GITHUB FIRST</span><h2>{{ t.manifesto }}<br>{{ t.manifesto2 }}</h2><div><a :href="p('/en/publications/research-report-production-engine-v1.0', '/zh/publications/research-report-production-engine-v1.0')">{{ t.release }} ↗</a><a :href="zh ? '/' : '/zh/'">{{ t.switchText }} →</a></div></section>
    </div>
  </div>
</template>

<style scoped>
.rcv5-engine-version{display:flex;align-items:center;gap:18px;margin:28px 0 20px;padding:18px 20px;border-radius:18px;background:linear-gradient(120deg,rgba(109,93,252,.17),rgba(54,203,232,.12));border:1px solid rgba(255,255,255,.11);position:relative;z-index:2}.rcv5-engine-version>strong{font-size:54px;line-height:.9;letter-spacing:-.07em;color:#fff}.rcv5-engine-version span{display:block}.rcv5-engine-version b{display:block;font-size:10px;letter-spacing:.13em;color:#8ee6f0}.rcv5-engine-version small{display:block;margin-top:6px;color:#9aa8c6;font-size:10px;line-height:1.4}.rcv5-system-link{position:relative;z-index:2;display:block;text-align:center;margin-top:14px;color:#90e0ed!important;font-size:11px;font-weight:800;letter-spacing:.08em}.rcv5-os-section{padding-top:92px}.rcv5-capability-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.rcv5-capability-card{min-height:250px;padding:26px;border:1px solid var(--rcv5-line);border-radius:25px;background:linear-gradient(145deg,#fff,#f8faff);display:flex;flex-direction:column}.rcv5-capability-card>div{display:flex;justify-content:space-between;align-items:center;gap:12px}.rcv5-capability-card>div>span{display:grid;place-items:center;min-width:44px;height:44px;padding:0 10px;border-radius:14px;background:linear-gradient(135deg,rgba(109,93,252,.14),rgba(54,203,232,.13));color:var(--rcv5-violet);font-size:11px;font-weight:850;letter-spacing:.08em}.rcv5-capability-card>div>small{font-size:9px;line-height:1.45;text-align:right;color:var(--rcv5-muted)}.rcv5-capability-card h3{font-size:25px;line-height:1.08;letter-spacing:-.035em;margin:42px 0 14px}.rcv5-capability-card p{margin:0;color:var(--rcv5-muted);font-size:13px;line-height:1.7}.rcv5-operating-chain{margin-top:20px;padding:22px;border-radius:24px;border:1px solid rgba(109,93,252,.17);background:linear-gradient(120deg,rgba(109,93,252,.055),rgba(54,203,232,.045));display:flex;align-items:center;justify-content:space-between;gap:10px}.rcv5-operating-chain>span{min-width:0;text-align:center}.rcv5-operating-chain b{display:block;font-size:13px}.rcv5-operating-chain small{display:block;color:var(--rcv5-muted);font-size:8px;margin-top:4px;white-space:nowrap}.rcv5-operating-chain>i{font-style:normal;color:var(--rcv5-violet);font-weight:800}.rcv5-employee-layout{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:20px}.rcv5-employee-profile{position:relative;overflow:hidden;border-radius:30px;padding:34px;color:#fff;background:radial-gradient(circle at 85% 12%,rgba(54,203,232,.2),transparent 28%),linear-gradient(145deg,#091225,#1b275a 62%,#0b5662);min-height:570px;display:flex;flex-direction:column}.rcv5-employee-profile:after{content:'';position:absolute;width:340px;height:340px;border-radius:50%;right:-180px;bottom:-170px;border:1px solid rgba(255,255,255,.13);box-shadow:0 0 0 52px rgba(255,255,255,.025),0 0 0 104px rgba(54,203,232,.025)}.rcv5-employee-status{position:relative;z-index:2;display:flex;justify-content:space-between;gap:12px;align-items:center}.rcv5-employee-status span,.rcv5-employee-status b{font-size:9px;letter-spacing:.13em}.rcv5-employee-status span{color:#8ee6f0}.rcv5-employee-status b{color:#86efac}.rcv5-employee-profile>small{position:relative;z-index:2;margin-top:70px;color:#8795b5;font-size:9px;letter-spacing:.14em;font-weight:800}.rcv5-employee-profile h3{position:relative;z-index:2;font-size:56px;line-height:1;letter-spacing:-.055em;margin:18px 0}.rcv5-employee-profile>p{position:relative;z-index:2;color:#bbc7dd;font-size:15px;line-height:1.8;margin:0}.rcv5-employee-profile dl{position:relative;z-index:2;display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:auto 0 0}.rcv5-employee-profile dl>div{padding:14px;border-radius:15px;border:1px solid rgba(255,255,255,.09);background:rgba(4,9,22,.24)}.rcv5-employee-profile dt{font-size:8px;color:#7f8dac;text-transform:uppercase;letter-spacing:.1em}.rcv5-employee-profile dd{margin:5px 0 0;font-size:12px;font-weight:750}.rcv5-employee-actions{position:relative;z-index:2;display:flex;gap:18px;flex-wrap:wrap;margin-top:22px}.rcv5-employee-actions a{color:#fff!important;font-size:11px;font-weight:750;border-bottom:1px solid rgba(255,255,255,.28);padding-bottom:4px}.rcv5-employee-work{display:grid;grid-template-rows:auto 1fr;gap:20px}.rcv5-responsibility-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.rcv5-responsibility-grid article{padding:24px;border:1px solid var(--rcv5-line);border-radius:24px;background:#fff}.rcv5-responsibility-grid span{font-size:9px;color:var(--rcv5-violet);font-weight:850;letter-spacing:.12em}.rcv5-responsibility-grid h3{font-size:21px;margin:20px 0 9px}.rcv5-responsibility-grid p{margin:0;color:var(--rcv5-muted);font-size:12px;line-height:1.65}.rcv5-production-proof{padding:30px;border-radius:27px;background:linear-gradient(135deg,rgba(109,93,252,.11),rgba(54,203,232,.1));border:1px solid rgba(109,93,252,.18);display:flex;flex-direction:column}.rcv5-production-proof>span{font-size:9px;color:var(--rcv5-violet);font-weight:850;letter-spacing:.14em}.rcv5-production-proof strong{font-size:37px;letter-spacing:-.045em;margin:20px 0 10px}.rcv5-production-proof p{color:var(--rcv5-muted);font-size:13px;line-height:1.7;margin:0}.rcv5-production-proof a{margin-top:auto;padding-top:22px;color:var(--rcv5-ink)!important;font-size:12px;font-weight:800}.rcv5-system-index{display:grid;place-items:center;flex:0 0 42px;height:42px;border-radius:13px;background:linear-gradient(135deg,rgba(109,93,252,.28),rgba(54,203,232,.18));border:1px solid rgba(255,255,255,.12);font-size:10px;font-weight:850;letter-spacing:.08em;color:#a9e9f4}.rcv5-notes-section{padding-top:110px}.rcv5-notes-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.rcv5-note-column{position:relative;display:flex;flex-direction:column;min-height:420px;padding:30px;border:1px solid var(--rcv5-line);border-radius:30px;overflow:hidden;background:#fff;color:var(--rcv5-ink)!important;transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease}.rcv5-note-column:before{content:'';position:absolute;inset:0 0 auto;height:7px;background:linear-gradient(90deg,#6d5dfc,#36cbe8)}.rcv5-note-column.is-industry-architecture:before{background:linear-gradient(90deg,#1d8e8a,#55c7c1)}.rcv5-note-column.is-open-source-engineering:before{background:linear-gradient(90deg,#315db4,#76a1ff)}.rcv5-note-column:after{content:'';position:absolute;width:220px;height:220px;border-radius:50%;right:-120px;top:-120px;border:1px solid rgba(109,93,252,.12);box-shadow:0 0 0 34px rgba(109,93,252,.025),0 0 0 68px rgba(54,203,232,.018)}.rcv5-note-column:hover{transform:translateY(-5px);border-color:rgba(109,93,252,.3);box-shadow:0 26px 70px rgba(22,31,69,.12)}.rcv5-note-column-top{position:relative;z-index:1;display:flex;align-items:flex-start;justify-content:space-between}.rcv5-note-column-top>span{display:grid;place-items:center;width:48px;height:48px;border-radius:15px;background:var(--rcv5-panel);font-size:11px;letter-spacing:.1em;font-weight:850;color:var(--rcv5-violet)}.rcv5-note-column-top strong{font-size:58px;line-height:.9;letter-spacing:-.08em}.rcv5-note-column>div:nth-child(2){position:relative;z-index:1;margin-top:58px}.rcv5-note-column small{font-size:9px;letter-spacing:.13em;color:var(--rcv5-muted);font-weight:800}.rcv5-note-column h3{font-size:34px;line-height:1.05;letter-spacing:-.045em;margin:13px 0 14px}.rcv5-note-column p{margin:0;color:var(--rcv5-muted);font-size:14px;line-height:1.7}.rcv5-note-counts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:auto;padding-top:28px}.rcv5-note-counts span{padding:12px 8px;border-radius:14px;background:var(--rcv5-panel);font-size:10px;color:var(--rcv5-muted);text-align:center}.rcv5-note-counts b{display:block;color:var(--rcv5-ink);font-size:18px}.rcv5-note-column-link{display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:17px;border-top:1px solid var(--rcv5-line);font-size:12px;font-weight:750}.rcv5-editorial-list{border-top:1px solid var(--rcv5-line)}.rcv5-editorial-list>a{display:grid;grid-template-columns:48px 105px minmax(0,1fr) 30px;gap:22px;align-items:center;padding:25px 4px;border-bottom:1px solid var(--rcv5-line);color:var(--rcv5-ink)!important;transition:padding .2s ease,background .2s ease}.rcv5-editorial-list>a:hover{padding-left:14px;padding-right:14px;background:linear-gradient(90deg,rgba(109,93,252,.045),transparent)}.rcv5-note-no{font-size:11px;color:var(--rcv5-violet);font-weight:850;letter-spacing:.12em}.rcv5-editorial-list time{font-size:12px;color:var(--rcv5-muted);font-variant-numeric:tabular-nums}.rcv5-note-tags{display:flex;gap:7px;flex-wrap:wrap}.rcv5-note-tags span{padding:5px 9px;border-radius:999px;background:var(--rcv5-panel);color:var(--rcv5-muted);font-size:9px;font-weight:750}.rcv5-note-main h3{font-size:22px;line-height:1.25;margin:8px 0 5px;letter-spacing:-.025em}.rcv5-note-main p{margin:0;color:var(--rcv5-muted);font-size:13px;line-height:1.55}.rcv5-note-arrow{font-size:22px;color:var(--rcv5-violet)}.rcv5-engine-publication{grid-column:1/-1!important;display:grid!important;grid-template-columns:34% 66%}.rcv5-engine-publication img{height:100%!important;min-height:340px}.rcv5-engine-publication>div{display:flex;flex-direction:column;justify-content:center;padding:40px!important}.rcv5-engine-publication h3{font-size:36px!important;letter-spacing:-.045em}.rcv5-timeline{grid-template-columns:repeat(5,minmax(0,1fr))}.dark .rcv5-capability-card,.dark .rcv5-responsibility-grid article,.dark .rcv5-note-column{background:#101529}.dark .rcv5-capability-card{background:linear-gradient(145deg,#101529,#0e1325)}.dark .rcv5-production-proof{background:linear-gradient(135deg,rgba(109,93,252,.13),rgba(54,203,232,.08))}.dark .rcv5-note-column-top>span,.dark .rcv5-note-counts span,.dark .rcv5-note-tags span{background:#171d34}@media(max-width:1000px){.rcv5-capability-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.rcv5-operating-chain{flex-wrap:wrap;justify-content:center}.rcv5-operating-chain>span{min-width:120px}.rcv5-employee-layout{grid-template-columns:1fr}.rcv5-employee-profile{min-height:520px}.rcv5-timeline{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:900px){.rcv5-notes-grid{grid-template-columns:1fr}.rcv5-note-column{min-height:340px}.rcv5-note-column>div:nth-child(2){margin-top:34px}.rcv5-editorial-list>a{grid-template-columns:40px 92px minmax(0,1fr) 24px;gap:14px}.rcv5-engine-publication{grid-template-columns:1fr}.rcv5-engine-publication img{height:300px!important;min-height:0}}@media(max-width:640px){.rcv5-capability-grid,.rcv5-responsibility-grid{grid-template-columns:1fr}.rcv5-capability-card{min-height:210px}.rcv5-operating-chain{display:grid;grid-template-columns:1fr}.rcv5-operating-chain>i{transform:rotate(90deg);text-align:center}.rcv5-employee-profile{padding:26px;min-height:560px}.rcv5-employee-profile h3{font-size:43px}.rcv5-employee-profile dl{grid-template-columns:1fr}.rcv5-production-proof strong{font-size:31px}.rcv5-note-column{padding:24px;border-radius:24px}.rcv5-note-column h3{font-size:29px}.rcv5-editorial-list>a{grid-template-columns:34px 1fr 22px;gap:10px;padding:20px 2px}.rcv5-editorial-list time{grid-column:2/3;grid-row:1}.rcv5-note-main{grid-column:2/3}.rcv5-note-arrow{grid-column:3;grid-row:1/3;align-self:center}.rcv5-note-no{grid-row:1/3}.rcv5-note-main h3{font-size:19px}.rcv5-note-main p{font-size:12px}.rcv5-note-counts{gap:6px}.rcv5-note-counts span{padding:10px 5px}.rcv5-engine-publication>div{padding:26px!important}.rcv5-engine-publication h3{font-size:28px!important}.rcv5-timeline{grid-template-columns:1fr}}
</style>
