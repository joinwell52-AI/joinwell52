<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import ResponsiveTitle from './ResponsiveTitle.vue'
import ResearchSkillGlyph from './ResearchSkillGlyph.vue'
import EditorialScorecard from './EditorialScorecard.vue'
import { data as allNotes } from './research-notes.data'
import type { ResearchColumn, ResearchNoteRecord } from './research-notes.data'
import { editorialRating } from './editorial-rating'
import runtimeData from '../../generated/runtime-records.json'

const props = withDefaults(defineProps<{ lang?: 'en' | 'zh'; preview?: boolean }>(), { lang: 'en', preview: false })
const zh = computed(() => props.lang === 'zh')
const { isDark } = useData()
const toggleAppearance = () => { isDark.value = !isDark.value }

const copy = computed(() => zh.value ? {
  currentLanguage: '中文', otherLanguage: 'EN', otherPath: '/',
  eyebrow: '数字员工工场 · 持续生产',
  heroLabel: '让通用 AI 成为数字员工',
  heroWide: ['让通用 AI', '成为数字员工'],
  heroCompact: ['让通用 AI', '成为数字员工'],
  heroMobile: ['让通用 AI', '成为数字员工'],
  heroLead: '让 AI 拥有岗位、职责、技能和工作流程，持续完成真实任务，并留下可核验的工作成果。',
  primary: '观看 60 秒产品演示', secondary: '查看生产线', tertiary: '进入观察笔记',
  ledger: '运行状态', live: '正在生产', ledgerRows: [
    ['生产岗位', '研究分析员'], ['工作入口', '任务队列'], ['交付门禁', 'GitHub + VitePress'], ['事实来源', 'main 分支']
  ],
  latestRelease: '数字员工生产线', ledgerMark: 'RA', ledgerDetail: '岗位 · 工作链 · 交付证据', inspected: '可检查 · 可引用 · 可重建',
  tmpaLabel: '03 · 独立理论层',
  tmpaTitle: 'TMPA 论文体系 独立自证',
  tmpaWide: ['TMPA 论文体系', '独立自证'],
  tmpaCompact: ['TMPA 论文体系', '独立自证'],
  tmpaMobile: ['TMPA', '论文体系', '独立自证'],
  tmpaLead: 'TMPA（文本化多智能体流程架构）是独立维护的理论与规范层，不与高频观察笔记共用可信度标准。主论文解释架构，核心规范固定对象与读者行为，工程案例公开实现证据及其边界。',
  publications: [
    { version:'A1.0', kind:'主论文', title:['TMPA','架构论文'], status:'V1.0 稳定研究论文', path:'/zh/publications/tmpa-architecture-paper-a1.0', tone:'paper' },
    { version:'S1.0', kind:'核心规范', title:['TMPA','核心规范'], status:'稳定规范 · Reference 14/14', path:'/zh/publications/tmpa-core-specification-s1.0', tone:'spec' },
    { version:'I1.0', kind:'工程案例', title:['TMPA–FCoP–','CodeFlowMu','实施案例'], status:'V1.8.0 · S1.0 14/14', path:'/zh/publications/implementation-case-i1.0', tone:'case' }
  ],
  readPublication: '阅读正式文档',
  tmpaArchiveStatus: 'V1.0 · Zenodo DOI 已登记',
  tmpaPaperAddress: '架构论文地址',
  tmpaArchiveLink: 'Zenodo 正式归档',
  engineLabel: '01 · 数字员工生产线',
  engineTitle: '一个生产岗位 一条可核验产线',
  engineWide: ['一个生产岗位', '一条可核验产线'],
  engineCompact: ['一个生产岗位', '一条可核验', '产线'],
  engineMobile: ['一个生产岗位', '一条可核验', '产线'],
  engineLead: '研究报告生产机持有 Research Analyst 岗位，持续接收任务并交付观察笔记、运行记录与正式出版物。来源、分析、配图、证据、审阅和提交跨会话保留。',
  position: '岗位', positionName: '研究分析员', worker: '数字研究员工', verified: '生产验证通过',
  skills: ['来源发现','研究筛选','深度阅读','研究分析','研究写作','研究配图','证据与引用','出版编辑'],
  skillStages: ['发现','发现','理解','理解','生产','生产','出版','出版'],
  workflowLabel: '数字员工工作链', workflowLive: '正在运行', currentStep: '当前步骤',
  engineLink: '查看研究报告生产机 V1.0',
  governanceTitle: '采用 TMPA 的单写者生命周期治理子集',
  governanceText: '这条产线使用生命周期状态、门禁、证据保留、Git 提交与 Reader 重建；它不演示多智能体角色分离，也不以单写者生产记录宣称覆盖 TMPA 的全部机制。',
  fieldLabel: '02 · 能力底座',
  fieldTitle: '从数字员工 到运行与协议',
  fieldWide: ['从数字员工', '到运行与协议'],
  fieldCompact: ['从数字员工', '到运行与协议'],
  fieldMobile: ['从数字员工', '到运行', '与协议'],
  fieldLead: '工场生产数字员工；数字员工能力建立在 CodeFlowMu 与 FCoP 之上；其治理理论与规范边界记录在 TMPA 论文体系中。产品、工程与理论分别接受与自身相称的验证。',
  systems: [
    { no:'01', kind:'理论', role:'文本化多智能体流程架构', name:['TMPA'], description:'独立记录治理理论、规范对象与 Reader 行为，通过 Core 与 FCoP 指导 CodeFlowMu 工程落实，但不把工程结果自动当作理论证明。', path:'/zh/publications/tmpa-architecture-paper-a1.0', logo:'/logo.svg?v=tmpa-20260807-5', tone:'tmpa', cta:'论文与规范' },
    { no:'02', kind:'协议', role:'基于文件的协同协议', name:['FCoP'], description:'以项目可见文件承载任务、报告、审阅与生命周期证据，为 CodeFlowMu 与数字员工提供可重建的协同事实。', path:'https://joinwell52-ai.github.io/FCoP/', logo:'https://raw.githubusercontent.com/joinwell52-AI/FCoP/main/assets/fcop-logo-256.png', tone:'fcop', cta:'打开 FCoP 官网' },
    { no:'03', kind:'运行', role:'数字员工开发与工作 Runtime', name:['CodeFlowMu'], description:'承载数字员工开发、受治理执行、恢复与持久工作证据，是工场能力的运行层与开源参考环境。', path:'https://github.com/joinwell52-AI/CodeFlowMu-open', logo:'/assets/logos/codeflowmu.png', tone:'codeflow', cta:'打开 GitHub' },
    { no:'04', kind:'产品', role:'工场直接生产的数字劳动力', name:['Digital','Employee'], description:'面向组织岗位、权限、工作流、成果与评价的受治理数字劳动力，是工场的产品与交付对象。', path:'/zh/digital-employee/', tone:'employee', cta:'查看产品层' },
    { no:'05', kind:'应用', role:'企业 AI 应用 · PWA DEMO', name:['小典','AI'], description:'源于早期企业 AI 应用实践，并促成对多角色开发、业务治理与数字员工架构的持续探索。现开放 PWA Demo 供交互体验；这是体验入口，不是生产服务。', path:'https://demo.chedian.cc', mark:'XD', tone:'xiaodian', cta:'打开 PWA Demo' }
  ],
  researchLabel: '04 · 工场观察',
  researchTitle: '观察笔记 持续更新',
  researchWide: ['观察笔记', '持续更新'],
  researchCompact: ['观察笔记', '持续更新'],
  researchMobile: ['观察笔记', '持续更新'],
  researchLead: '数字员工在持续工作中记录看到的行业动态、论文、基准与工程变化。这些高频内容是产线运行证据和工作判断，不冒充新的学术结论。',
  streams: [
    { column:'digital-employee' as ResearchColumn, index:'A', title:['数字员工'], description:'岗位、权限、工作流、Runtime 与评价。', path:'/zh/digital-employee/' },
    { column:'industry-architecture' as ResearchColumn, index:'B', title:['行业架构'], description:'企业 AI 工作的组织、治理与系统边界。', path:'/zh/industry/' },
    { column:'open-source-engineering' as ResearchColumn, index:'C', title:['开源工程'], description:'Agent、Skill、Tool、Recovery 与可观测性。', path:'/zh/engineering/' }
  ],
  latest: '最新观察', allResearch: '查看全部观察',
  articleStream: '最新观察流', autoSwitch: '自动切换', enterNotes: '进入观察笔记',
  workLog: 'RA 工作日志', raLine: ['我正在工作', '一起参与吗'],
  raNote: '任务、证据、提交与交付记录持续写入工场运行中心。', enterRuntime: '进入工场运行中心',
  latestTask: '当前工作', runtimeStatus: '运行状态', runtimeCommit: '提交记录',
  footerAbout: '让通用 AI 成为数字员工，持续完成真实任务，并留下可核验的工作成果。观察笔记记录外部动态与工作判断，TMPA 论文体系独立维护。',
  footerCode: '代码', footerRead: '阅读', footerCite: '引用',
  repository: 'GitHub 仓库', fcop: 'FCoP 协议', codeflow: 'CodeFlowMu Runtime',
  researchNotes: '观察笔记', publicationCenter: '出版中心', runtimeCenter: '工场运行中心',
  citationFile: 'CITATION.cff', license: '许可说明', licenseName: '保留所有权利',
  authorLabel: '作者', authorName: '朱卫', authorMeta: 'joinwell52-AI',
  copyright: '© 2026 JOINWELL52',
  licenseSummary: '公开阅读与规范引用；复制、再发布、改编或商业使用需事先获得书面授权。'
} : {
  currentLanguage: 'EN', otherLanguage: '中文', otherPath: '/zh/',
  eyebrow: 'DIGITAL EMPLOYEE WORKS · CONTINUOUS PRODUCTION',
  heroLabel: 'Turn general-purpose AI into Digital Employees',
  heroWide: ['Turn general-purpose AI', 'into Digital Employees'],
  heroCompact: ['Turn general-purpose AI', 'into Digital', 'Employees'],
  heroMobile: ['Turn general-purpose AI', 'into Digital', 'Employees'],
  heroLead: 'Give AI a position, responsibilities, skills, and a workflow so it can continuously complete real tasks and leave verifiable work results.',
  primary: 'Watch the 60-second demo', secondary: 'Inspect the production line', tertiary: 'Explore Observation Notes',
  ledger: 'Runtime status', live: 'IN PRODUCTION', ledgerRows: [
    ['Production position', 'Research Analyst'], ['Work intake', 'Task Queue'], ['Delivery gate', 'GitHub + VitePress'], ['Source of truth', 'main branch']
  ],
  latestRelease: 'Digital Employee production line', ledgerMark: 'RA', ledgerDetail: 'Position · Workflow · Delivery evidence', inspected: 'Inspectable · Citable · Reconstructable',
  tmpaLabel: '03 · INDEPENDENT THEORY LAYER',
  tmpaTitle: 'The TMPA publication suite stands on its own evidence',
  tmpaWide: ['The TMPA publication suite', 'stands on its own evidence'],
  tmpaCompact: ['The TMPA publication suite', 'stands on its', 'own evidence'],
  tmpaMobile: ['The TMPA', 'publication suite', 'stands on its', 'own evidence'],
  tmpaLead: 'TMPA is an independently maintained theory and specification layer, not a high-frequency Observation Notes stream. Its paper explains the architecture, its Core fixes normative objects and reader behavior, and its case report publishes bounded implementation evidence.',
  publications: [
    { version:'A1.0', kind:'PRIMARY PAPER', title:['TMPA','Architecture Paper'], status:'Stable V1.0 research paper', path:'/en/publications/tmpa-architecture-paper-a1.0', tone:'paper' },
    { version:'S1.0', kind:'CORE SPECIFICATION', title:['TMPA Core','Specification'], status:'Stable specification · Reference 14/14', path:'/en/publications/tmpa-core-specification-s1.0', tone:'spec' },
    { version:'I1.0', kind:'ENGINEERING CASE', title:['TMPA–FCoP–','CodeFlowMu','Implementation Case'], status:'V1.8.0 · S1.0 14/14', path:'/en/publications/implementation-case-i1.0', tone:'case' }
  ],
  readPublication: 'Read formal document',
  tmpaArchiveStatus: 'V1.0 · Zenodo DOI registered',
  tmpaPaperAddress: 'Architecture paper',
  tmpaArchiveLink: 'Zenodo archival record',
  engineLabel: '01 · DIGITAL EMPLOYEE PRODUCTION LINE',
  engineTitle: 'One production position One verifiable line',
  engineWide: ['One production position', 'One verifiable line'],
  engineCompact: ['One production position', 'One verifiable', 'line'],
  engineMobile: ['One production', 'position', 'One verifiable', 'line'],
  engineLead: 'The Research Report Production Engine holds the Research Analyst position, continuously receives work, and delivers Observation Notes, runtime records, and formal publications. Sources, analysis, visuals, evidence, review, and commits persist across sessions.',
  position: 'Position', positionName: 'Research Analyst', worker: 'Digital Research Employee', verified: 'PRODUCTION VERIFIED',
  skills: ['Source Discovery','Research Triage','Deep Reading','Research Analysis','Research Writing','Research Visualization','Evidence & Citation','Publication Editing'],
  skillStages: ['DISCOVER','DISCOVER','UNDERSTAND','UNDERSTAND','PRODUCE','PRODUCE','PUBLISH','PUBLISH'],
  workflowLabel: 'DIGITAL EMPLOYEE WORKFLOW', workflowLive: 'RUNNING', currentStep: 'CURRENT STEP',
  engineLink: 'Inspect Research Report Production Engine V1.0',
  governanceTitle: 'Uses the single-writer lifecycle-governance subset of TMPA',
  governanceText: 'This production line uses lifecycle states, gates, evidence retention, Git commits, and Reader reconstruction. It does not demonstrate multi-agent role separation or claim that a single-writer production record exercises all TMPA mechanisms.',
  fieldLabel: '02 · CAPABILITY FOUNDATION',
  fieldTitle: 'From Digital Employee to Runtime and protocol',
  fieldWide: ['From Digital Employee', 'to Runtime and protocol'],
  fieldCompact: ['From Digital Employee', 'to Runtime', 'and protocol'],
  fieldMobile: ['From Digital Employee', 'to Runtime', 'and protocol'],
  fieldLead: 'The Works produces Digital Employees. Their capabilities are built on CodeFlowMu and FCoP, while the governing theory and specification boundaries are recorded independently in TMPA. Product, engineering, and theory are validated by standards appropriate to each layer.',
  systems: [
    { no:'01', kind:'THEORY', role:'TEXTUAL MULTI-AGENT PROCESS ARCHITECTURE', name:['TMPA'], description:'Independently records governance theory, normative objects, and Reader behavior. Through Core and FCoP it guides CodeFlowMu engineering without treating implementation results as automatic proof of theory.', path:'/en/publications/tmpa-architecture-paper-a1.0', logo:'/logo.svg?v=tmpa-20260807-5', tone:'tmpa', cta:'Paper & specification' },
    { no:'02', kind:'PROTOCOL', role:'FILE-BASED COORDINATION PROTOCOL', name:['FCoP'], description:'Project-visible files carry tasks, reports, reviews, and lifecycle evidence, providing reconstructable coordination facts for CodeFlowMu and Digital Employees.', path:'https://joinwell52-ai.github.io/FCoP/', logo:'https://raw.githubusercontent.com/joinwell52-AI/FCoP/main/assets/fcop-logo-256.png', tone:'fcop', cta:'Open FCoP site' },
    { no:'03', kind:'RUNTIME', role:'DIGITAL EMPLOYEE DEVELOPMENT AND WORK RUNTIME', name:['CodeFlowMu'], description:'The runtime layer for Digital Employee development, governed execution, recovery, and durable work evidence, with an open-source reference environment.', path:'https://github.com/joinwell52-AI/CodeFlowMu-open', logo:'/assets/logos/codeflowmu.png', tone:'codeflow', cta:'Open GitHub' },
    { no:'04', kind:'PRODUCT', role:'DIGITAL WORKFORCE PRODUCED BY THE WORKS', name:['Digital','Employee'], description:'Governed digital labor organized around positions, authority, workflows, deliverables, and evaluation—the product and delivery object of the Works.', path:'/en/digital-employee/', tone:'employee', cta:'View product layer' },
    { no:'05', kind:'APPLICATION', role:'ENTERPRISE AI APPLICATION · PWA DEMO', name:['Xiaodian','AI'], description:'An early enterprise AI application that helped surface the need for multi-role development, business governance, and the Digital Employee architecture. Its PWA demo is open for hands-on exploration; it is an experience entry point, not a production service.', path:'https://demo.chedian.cc', mark:'XD', tone:'xiaodian', cta:'Open PWA Demo' }
  ],
  researchLabel: '04 · FACTORY OBSERVATION',
  researchTitle: 'Observation Notes Always updating',
  researchWide: ['Observation Notes', 'Always updating'],
  researchCompact: ['Observation Notes', 'Always updating'],
  researchMobile: ['Observation Notes', 'Always updating'],
  researchLead: 'While working, the Digital Employee records industry developments, papers, benchmarks, and engineering changes. These high-frequency notes are evidence that the line is operating and records of working judgment—not claims of new academic knowledge.',
  streams: [
    { column:'digital-employee' as ResearchColumn, index:'A', title:['Digital Employee'], description:'Position, authority, workflow, runtime, and evaluation.', path:'/en/digital-employee/' },
    { column:'industry-architecture' as ResearchColumn, index:'B', title:['Industry','Architecture'], description:'Organization, governance, and system boundaries for enterprise AI work.', path:'/en/industry/' },
    { column:'open-source-engineering' as ResearchColumn, index:'C', title:['Open-source','Engineering'], description:'Agents, skills, tools, recovery, and observability.', path:'/en/engineering/' }
  ],
  latest: 'Latest observations', allResearch: 'View all observations',
  articleStream: 'Latest observation stream', autoSwitch: 'Auto switching', enterNotes: 'Enter Observation Notes',
  workLog: 'RA work log', raLine: ['I am working', 'Want to take part'],
  raNote: 'Tasks, evidence, commits, and delivery records continue into the Factory Runtime Center.', enterRuntime: 'Enter Factory Runtime Center',
  latestTask: 'Current work', runtimeStatus: 'Runtime status', runtimeCommit: 'Commit record',
  footerAbout: 'A Works that turns general-purpose AI into Digital Employees, continuously completing real tasks and leaving verifiable work results. Observation Notes record external developments and working judgments; the TMPA publication suite is maintained independently.',
  footerCode: 'Code', footerRead: 'Read', footerCite: 'Cite',
  repository: 'GitHub repository', fcop: 'FCoP protocol', codeflow: 'CodeFlowMu Runtime',
  researchNotes: 'Observation Notes', publicationCenter: 'Publication center', runtimeCenter: 'Factory Runtime Center',
  citationFile: 'CITATION.cff', license: 'License notice', licenseName: 'All rights reserved',
  authorLabel: 'Author', authorName: 'Zhu Wei', authorMeta: 'joinwell52-AI',
  copyright: '© 2026 JOINWELL52',
  licenseSummary: 'Public reading and proper citation are encouraged. Reproduction, redistribution, adaptation, or commercial use requires prior written permission.'
})

const link = (path: string) => path.startsWith('http') ? path : withBase(path)
const publicationOverview = computed(() => zh.value ? '/zh/publications/' : '/en/publications/')
const researchOverview = computed(() => zh.value ? '/zh/research/' : '/en/research/')
const runtimePath = computed(() => zh.value ? '/zh/runtime/' : '/en/runtime/')
const pairedHomePath = computed(() => props.preview
  ? (zh.value ? '/en/preview/research-center-home' : '/zh/preview/research-center-home')
  : copy.value.otherPath
)

const localizedNotes = computed(() => (allNotes as ResearchNoteRecord[]).filter(note => note.lang === props.lang))
const activeColumn = ref<ResearchColumn>('digital-employee')
const activeStream = computed(() => copy.value.streams.find(stream => stream.column === activeColumn.value) ?? copy.value.streams[0])
const activeNotes = computed(() => localizedNotes.value.filter(note => note.column === activeColumn.value).slice(0, 3))
const noteRating = (url: string) => editorialRating(url, props.lang)
const runtimeLatest = runtimeData.latest
const runtimeTaskLabelsZh: Record<string, string> = {
  'Research Runtime Engine': '研究运行引擎',
  'Research Runtime Queue': '研究运行队列',
  'Research Runtime Knowledge': '研究运行知识',
  'Research Runtime Architecture': '研究运行架构评审',
  'Research Runtime Publication': '研究运行每日发布',
  'Research Runtime Weekly': '研究运行每周综合',
  'Research Runtime Academic': '研究运行学术研究',
  'Research Runtime Scheduler V1.0 Upgrade': '研究运行调度器升级'
}
const runtimeStatusLabelsZh: Record<string, string> = {
  Completed: '已完成', Running: '运行中', Blocked: '受阻', Failed: '失败', Skipped: '已跳过', Waiting: '等待中'
}
const runtimeTaskLabel = computed(() => zh.value
  ? (runtimeTaskLabelsZh[runtimeLatest.latestTask] ?? runtimeLatest.latestTask)
  : runtimeLatest.latestTask
)
const runtimeStatusLabel = computed(() => zh.value
  ? (runtimeStatusLabelsZh[runtimeLatest.status] ?? runtimeLatest.status)
  : runtimeLatest.status
)
let researchRotation: ReturnType<typeof setInterval> | undefined
const activeSkill = ref(0)
let skillRotation: ReturnType<typeof setInterval> | undefined
const videoDialogOpen = ref(false)
const fullVideo = ref<HTMLVideoElement>()

const openFullVideo = async () => {
  videoDialogOpen.value = true
  await nextTick()
  fullVideo.value?.play().catch(() => undefined)
}

const closeFullVideo = () => {
  fullVideo.value?.pause()
  videoDialogOpen.value = false
}

const handleVideoKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && videoDialogOpen.value) closeFullVideo()
}

const startResearchRotation = () => {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (researchRotation) clearInterval(researchRotation)
  researchRotation = setInterval(() => {
    const columns = copy.value.streams.map(stream => stream.column)
    activeColumn.value = columns[(columns.indexOf(activeColumn.value) + 1) % columns.length]
  }, 6500)
}

const selectResearchColumn = (column: ResearchColumn) => {
  activeColumn.value = column
  startResearchRotation()
}

const startSkillRotation = () => {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (skillRotation) clearInterval(skillRotation)
  skillRotation = setInterval(() => { activeSkill.value = (activeSkill.value + 1) % copy.value.skills.length }, 1450)
}

const selectSkill = (index: number) => {
  activeSkill.value = index
  startSkillRotation()
}

const categoryLabel = (category: ResearchNoteRecord['category']) => zh.value
  ? ({ daily: '每日观察', weekly: '每周综合', academic: '学术观察' }[category])
  : ({ daily: 'Daily observation', weekly: 'Weekly synthesis', academic: 'Academic observation' }[category])

onMounted(() => {
  startResearchRotation()
  startSkillRotation()
  window.addEventListener('keydown', handleVideoKeydown)
})
onBeforeUnmount(() => {
  if (researchRotation) clearInterval(researchRotation)
  if (skillRotation) clearInterval(skillRotation)
  window.removeEventListener('keydown', handleVideoKeydown)
})
</script>

<template>
  <main class="rc-home" :class="{ 'is-zh': zh }">
    <section class="rc-hero">
      <div class="rc-controls" :aria-label="zh ? '语言与明暗风格' : 'Language and appearance'">
          <nav class="rc-language" :aria-label="zh ? '语言选择' : 'Language selection'">
            <template v-if="zh"><strong>中文</strong><a :href="link(pairedHomePath)">EN</a></template>
            <template v-else><a :href="link(pairedHomePath)">中文</a><strong>EN</strong></template>
          </nav>
          <button
            class="rc-appearance"
            type="button"
            :aria-pressed="isDark"
            :aria-label="zh ? (isDark ? '切换为明亮风格' : '切换为暗色风格') : (isDark ? 'Switch to light theme' : 'Switch to dark theme')"
            @click="toggleAppearance"
          >
            <span aria-hidden="true">{{ isDark ? '☾' : '☀' }}</span>
            <b>{{ zh ? (isDark ? '暗色' : '明亮') : (isDark ? 'Dark' : 'Light') }}</b>
          </button>
      </div>

      <div class="rc-shell rc-hero__layout">
        <div class="rc-hero__copy">
          <p class="rc-kicker"><span></span>{{ copy.eyebrow }}</p>
          <ResponsiveTitle
            tag="h1"
            class="rc-hero__title"
            :label="copy.heroLabel"
            :wide="copy.heroWide"
            :compact="copy.heroCompact"
            :mobile="copy.heroMobile"
            :accent-from="1"
          />
          <p class="rc-hero__lead">{{ copy.heroLead }}</p>
          <div class="rc-actions">
            <button class="rc-button rc-button--primary" type="button" @click="openFullVideo">{{ copy.primary }} <span>▶</span></button>
            <a class="rc-button" href="#production-line">{{ copy.secondary }} <span>↓</span></a>
            <a class="rc-text-link" :href="link(researchOverview)">{{ copy.tertiary }} <span>↗</span></a>
          </div>
        </div>

        <button
          class="rc-hero-video"
          type="button"
          :aria-label="zh ? '播放 CodeFlowMu 60 秒正式产品介绍' : 'Play the 60-second CodeFlowMu product introduction'"
          @click="openFullVideo"
        >
          <video
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            :poster="link('/assets/video/codeflowmu-product-intro-zh-poster.jpg')"
            aria-hidden="true"
          >
            <source :src="link('/assets/video/codeflowmu-product-teaser-zh.mp4')" type="video/mp4">
          </video>
          <span class="rc-hero-video__shade" aria-hidden="true"></span>
          <span class="rc-hero-video__top"><b>CODEFLOWMU</b><i>{{ zh ? '12 秒预告 · 静音播放' : '12s teaser · muted' }}</i></span>
          <span class="rc-hero-video__play" aria-hidden="true">▶</span>
          <span class="rc-hero-video__caption">
            <strong>{{ zh ? '多 AI 自动工作，最终由人类审批' : 'Multiple AI agents work; humans give final approval' }}</strong>
            <small>{{ zh ? '点击观看 60 秒完整演示（有声音）' : 'Watch the full 60-second demo with sound' }}</small>
          </span>
          <span class="rc-hero-video__url">github.com/joinwell52-AI</span>
        </button>
      </div>

      <div class="rc-shell rc-hero__index">
        <div><span>01</span><b>{{ zh ? '岗位' : 'POSITION' }}</b><small>{{ zh ? '数字员工' : 'DIGITAL EMPLOYEE' }}</small></div>
        <div><span>02</span><b>{{ zh ? '工作链' : 'WORKFLOW' }}</b><small>{{ zh ? '持续运行' : 'CONTINUOUS' }}</small></div>
        <div><span>03</span><b>{{ zh ? '证据' : 'EVIDENCE' }}</b><small>{{ zh ? '可检查可重建' : 'RECONSTRUCTABLE' }}</small></div>
        <div><span>04</span><b>{{ zh ? '交付' : 'DELIVERY' }}</b><small>{{ zh ? '生产验证通过' : 'PRODUCTION VERIFIED' }}</small></div>
      </div>
    </section>

    <div
      v-if="videoDialogOpen"
      class="rc-video-modal"
      role="dialog"
      aria-modal="true"
      :aria-label="zh ? 'CodeFlowMu 正式产品介绍' : 'CodeFlowMu product introduction'"
      @click.self="closeFullVideo"
    >
      <div class="rc-video-modal__panel">
        <header>
          <div><span>CODEFLOWMU · PRODUCT DEMO</span><strong>{{ zh ? '多 AI 真实协作 · 60 秒' : 'Real multi-agent collaboration · 60 seconds' }}</strong></div>
          <button type="button" :aria-label="zh ? '关闭视频' : 'Close video'" @click="closeFullVideo">×</button>
        </header>
        <video
          ref="fullVideo"
          controls
          playsinline
          preload="metadata"
          :poster="link('/assets/video/codeflowmu-product-intro-zh-poster.jpg')"
        >
          <source :src="link('/assets/video/codeflowmu-product-intro-zh.mp4')" type="video/mp4">
        </video>
        <footer>
          <span>{{ zh ? '手机发起 · PM 拆解 · 多角色并行 · 人类终审' : 'Mobile intake · PM decomposition · Parallel roles · Human final approval' }}</span>
          <a href="https://github.com/joinwell52-AI/CodeFlowMu-open">CodeFlowMu Open ↗</a>
        </footer>
      </div>
    </div>

    <section id="production-line" class="rc-section rc-engine">
      <div class="rc-shell">
        <div class="rc-section__intro">
          <div>
            <p class="rc-kicker rc-kicker--dark">{{ copy.engineLabel }}</p>
            <ResponsiveTitle tag="h2" class="rc-section__title" :label="copy.engineTitle" :wide="copy.engineWide" :compact="copy.engineCompact" :mobile="copy.engineMobile" />
          </div>
          <p>{{ copy.engineLead }}</p>
        </div>
        <div class="rc-engine__grid">
          <article class="rc-position-card">
            <header><span>{{ copy.position }}</span><b>{{ copy.verified }}</b></header>
            <div class="rc-position-card__mark">RA</div>
            <h3>{{ copy.positionName }}</h3><p>{{ copy.worker }}</p>
            <div class="rc-position-card__live">
              <span><i></i>{{ copy.workflowLive }}</span>
              <b>{{ String(activeSkill + 1).padStart(2, '0') }} / 08</b>
              <strong><small>{{ copy.currentStep }}</small>{{ copy.skills[activeSkill] }}</strong>
            </div>
            <a :href="link(zh ? '/zh/publications/research-report-production-engine-v1.0' : '/en/publications/research-report-production-engine-v1.0')">{{ copy.engineLink }} <span>↗</span></a>
          </article>
          <div class="rc-skill-flow" :class="`is-step-${activeSkill + 1}`">
            <header><b>{{ copy.workflowLabel }}</b><span><i></i>{{ copy.workflowLive }} · {{ String(activeSkill + 1).padStart(2, '0') }}/08</span></header>
            <div class="rc-skill-flow__map">
              <svg viewBox="0 0 1000 470" preserveAspectRatio="none" aria-hidden="true">
                <path class="rc-skill-flow__rail" d="M250 58H750Q790 58 790 98V136Q790 176 750 176H250Q210 176 210 216V254Q210 294 250 294H750Q790 294 790 334V372Q790 412 750 412H250" />
                <path class="rc-skill-flow__pulse" d="M250 58H750Q790 58 790 98V136Q790 176 750 176H250Q210 176 210 216V254Q210 294 250 294H750Q790 294 790 334V372Q790 412 750 412H250" />
              </svg>
              <span class="rc-work-pass" aria-hidden="true"><b>RA</b><i></i></span>
              <ol class="rc-skills">
                <li v-for="(skill, index) in copy.skills" :key="skill" :class="{ 'is-active': activeSkill === index }">
                  <button type="button" :aria-pressed="activeSkill === index" @click="selectSkill(index)">
                    <span class="rc-office-lamp" aria-hidden="true"></span>
                    <span class="rc-office-sign" aria-hidden="true"><ResearchSkillGlyph :step="index" :active="activeSkill === index" :label="skill" /></span>
                    <span class="rc-office-door">
                      <span class="rc-skill-copy"><small>{{ String(index + 1).padStart(2, '0') }} · {{ copy.skillStages[index] }}</small><b>{{ skill }}</b></span>
                      <i class="rc-office-handle" aria-hidden="true"></i>
                    </span>
                  </button>
                </li>
              </ol>
            </div>
          </div>
        </div>
        <aside class="rc-governance-note">
          <span>{{ zh ? '治理边界' : 'GOVERNANCE BOUNDARY' }}</span>
          <h3>{{ copy.governanceTitle }}</h3>
          <p>{{ copy.governanceText }}</p>
        </aside>
      </div>
    </section>

    <section class="rc-section rc-field">
      <div class="rc-shell">
        <div class="rc-section__intro">
          <div>
            <p class="rc-kicker rc-kicker--dark">{{ copy.fieldLabel }}</p>
            <ResponsiveTitle tag="h2" class="rc-section__title" :label="copy.fieldTitle" :wide="copy.fieldWide" :compact="copy.fieldCompact" :mobile="copy.fieldMobile" />
          </div>
          <p>{{ copy.fieldLead }}</p>
        </div>
        <div class="rc-programs">
          <a
            v-for="system in copy.systems"
            :key="system.no"
            class="rc-program"
            :class="`rc-program--${system.tone}`"
            :href="link(system.path)"
            :target="system.path.startsWith('http') ? '_blank' : undefined"
            :rel="system.path.startsWith('http') ? 'noopener noreferrer' : undefined"
          >
            <div class="rc-program__cover">
              <span>{{ system.kind }}</span>
              <img v-if="system.logo" :src="link(system.logo)" :alt="`${system.name.join(' ')} logo`" loading="lazy" />
              <strong v-else-if="system.mark">{{ system.mark }}</strong>
              <div v-else class="rc-program__workforce" aria-hidden="true"><i></i><i></i><i></i></div>
              <b>{{ system.no }}</b>
            </div>
            <div class="rc-program__body">
              <small>{{ system.role }}</small>
              <h3 :aria-label="system.name.join(' ')"><span v-for="lineItem in system.name" :key="lineItem">{{ lineItem }}</span></h3>
              <p>{{ system.description }}</p>
              <b>{{ system.cta }} <span>↗</span></b>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="rc-section rc-codeflow-video">
      <div class="rc-shell">
        <div class="rc-section__intro rc-section__intro--light">
          <div>
            <p class="rc-kicker">{{ zh ? 'CODEFLOWMU · 产品介绍' : 'CODEFLOWMU · PRODUCT OVERVIEW' }}</p>
            <h2 class="rc-section__title">{{ zh ? '看见多 AI 团队，如何完成一次真实协作' : 'See a multi-agent team complete real work' }}</h2>
          </div>
          <p>{{ zh ? '60 秒真实产品演示：手机发起任务、PM 自动拆解、多个角色并行工作、PC 全局观察、报告回流，以及最终人类审批。片尾说明 TMPA、FCoP 与 CodeFlowMu 从理论、协议到运行产品的关系。' : 'A 60-second real product demonstration: mobile task entry, automatic PM decomposition, parallel roles, full PC observation, report return, and final human approval. Chinese narration with on-screen product context.' }}</p>
        </div>
        <div class="rc-codeflow-video__frame">
          <video
            controls
            playsinline
            preload="metadata"
            :poster="link('/assets/video/codeflowmu-product-intro-zh-poster.jpg')"
            :aria-label="zh ? 'CodeFlowMu 正式产品介绍视频' : 'CodeFlowMu formal product introduction video in Chinese'"
          >
            <source :src="link('/assets/video/codeflowmu-product-intro-zh.mp4')" type="video/mp4">
          </video>
        </div>
        <div class="rc-codeflow-video__meta">
          <span>{{ zh ? '真实 PC + 手机录屏 · 中文旁白 · 1080p' : 'Real PC + mobile captures · Chinese narration · 1080p' }}</span>
          <nav>
            <a href="https://github.com/joinwell52-AI">GitHub ↗</a>
            <a href="https://github.com/joinwell52-AI/CodeFlowMu-open">CodeFlowMu Open ↗</a>
          </nav>
        </div>
      </div>
    </section>

    <section class="rc-section rc-tmpa">
      <div class="rc-shell">
        <div class="rc-section__intro rc-section__intro--light">
          <div>
            <p class="rc-kicker">{{ copy.tmpaLabel }}</p>
            <ResponsiveTitle tag="h2" class="rc-section__title" :label="copy.tmpaTitle" :wide="copy.tmpaWide" :compact="copy.tmpaCompact" :mobile="copy.tmpaMobile" />
          </div>
          <p>{{ copy.tmpaLead }}</p>
        </div>
        <div class="rc-tmpa__archive" aria-label="TMPA V1.0 Zenodo archive">
          <a class="rc-doi-badge" href="https://doi.org/10.5281/zenodo.21888488">
            <span>DOI</span>
            <strong>10.5281/zenodo.21888488</strong>
            <i>↗</i>
          </a>
          <div class="rc-tmpa__archive-meta">
            <b>{{ copy.tmpaArchiveStatus }}</b>
            <nav>
              <a :href="link(zh ? '/zh/publications/tmpa-architecture-paper-a1.0' : '/en/publications/tmpa-architecture-paper-a1.0')">{{ copy.tmpaPaperAddress }} <span>↗</span></a>
              <a href="https://zenodo.org/records/21888488">{{ copy.tmpaArchiveLink }} <span>↗</span></a>
            </nav>
          </div>
        </div>
        <div class="rc-publications">
          <a v-for="publication in copy.publications" :key="publication.version" :class="`rc-publication rc-publication--${publication.tone}`" :href="link(publication.path)">
            <div class="rc-publication__art"><span>{{ publication.kind }}</span><b>{{ publication.version }}</b><i></i></div>
            <div class="rc-publication__body">
              <p>{{ publication.status }}</p>
              <h3 :aria-label="publication.title.join(' ')"><span v-for="lineItem in publication.title" :key="lineItem">{{ lineItem }}</span></h3>
              <b>{{ copy.readPublication }} <span>↗</span></b>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="rc-section rc-research">
      <div class="rc-shell">
        <div class="rc-section__intro rc-section__intro--light">
          <div>
            <p class="rc-kicker">{{ copy.researchLabel }}</p>
            <ResponsiveTitle tag="h2" class="rc-section__title" :label="copy.researchTitle" :wide="copy.researchWide" :compact="copy.researchCompact" :mobile="copy.researchMobile" />
          </div>
          <p>{{ copy.researchLead }}</p>
        </div>

        <div class="rc-note-marquee">
          <header><a :href="link(researchOverview)"><b><i></i>{{ copy.articleStream }}</b><span>{{ localizedNotes.length }} NOTES ↗</span></a></header>
          <div class="rc-note-marquee__viewport">
            <div class="rc-note-marquee__track">
              <div v-for="repeat in 2" :key="repeat" class="rc-note-marquee__group" :aria-hidden="repeat === 2 ? 'true' : undefined">
                <a v-for="note in localizedNotes.slice(0, 12)" :key="`${repeat}-${note.url}`" :href="link(researchOverview)" :tabindex="repeat === 2 ? -1 : undefined">
                  <time>{{ note.date }}</time><span>{{ categoryLabel(note.category) }}</span><strong>{{ note.title }}</strong><i>↗</i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="rc-note-browser">
          <nav class="rc-note-tabs" role="tablist" :aria-label="zh ? '观察栏目切换' : 'Observation column switcher'">
            <button
              v-for="stream in copy.streams"
              :id="`research-tab-${stream.column}`"
              :key="stream.column"
              type="button"
              role="tab"
              :aria-selected="activeColumn === stream.column"
              :aria-controls="`research-panel-${stream.column}`"
              :class="{ 'is-active': activeColumn === stream.column }"
              @click="selectResearchColumn(stream.column)"
            >
              <span>{{ stream.index }}</span><b>{{ stream.title.join(' ') }}</b><small>{{ localizedNotes.filter(note => note.column === stream.column).length }}</small>
            </button>
          </nav>

          <Transition name="rc-note-panel" mode="out-in">
            <article
              :id="`research-panel-${activeColumn}`"
              :key="activeColumn"
              class="rc-note-panel"
              role="tabpanel"
              :aria-labelledby="`research-tab-${activeColumn}`"
            >
              <header>
                <div><small>{{ copy.autoSwitch }} · {{ activeStream.index }}</small><h3>{{ activeStream.title.join(' ') }}</h3><p>{{ activeStream.description }}</p></div>
                <a :href="link(activeStream.path)">{{ copy.enterNotes }} <span>↗</span></a>
              </header>
              <ol>
                <li v-for="(note, index) in activeNotes" :key="note.url">
                  <a :href="link(note.url)">
                    <span>{{ String(index + 1).padStart(2, '0') }}</span>
                    <div><small>{{ note.date }} · {{ categoryLabel(note.category) }} · <em :class="`rating-${noteRating(note.url).level}`">{{ noteRating(note.url).label }}</em></small><b>{{ note.title }}</b><p>{{ note.summary }}</p></div>
                    <i>↗</i>
                  </a>
                </li>
              </ol>
            </article>
          </Transition>
        </div>

        <aside class="rc-original-article">
          <div>
            <small>{{ zh ? '推荐原创文章' : 'FEATURED ORIGINAL ARTICLE' }}</small>
            <h3>{{ zh ? '一个 Agent 说“完成了”，团队为什么没放行？' : 'One Agent Said “Done.” Why Didn’t the Team Release It?' }}</h3>
          </div>
          <nav :aria-label="zh ? '推荐原创文章发布地址' : 'Featured original article publication links'">
            <a href="https://blog.csdn.net/m0_51507544/article/details/163676669"><span>{{ zh ? '中文地址 · CSDN' : 'Chinese · CSDN' }}</span><b>↗</b></a>
            <a href="https://dev.to/joinwell52/one-agent-said-done-why-didnt-the-team-release-it-518j"><span>{{ zh ? '英文地址 · DEV' : 'English · DEV' }}</span><b>↗</b></a>
          </nav>
        </aside>

        <EditorialScorecard :lang="props.lang" />

        <aside class="rc-ra-log">
          <header><span><i></i>RA · {{ copy.workLog }}</span><b>{{ runtimeLatest.date }} · LIVE RECORD</b></header>
          <div class="rc-ra-log__statement">
            <small>RESEARCH ANALYST</small>
            <h3><span v-for="lineItem in copy.raLine" :key="lineItem">{{ lineItem }}</span></h3>
            <p>{{ copy.raNote }}</p>
          </div>
          <dl>
            <div><dt>{{ copy.latestTask }}</dt><dd>{{ runtimeTaskLabel }}</dd></div>
            <div><dt>{{ copy.runtimeStatus }}</dt><dd><i></i>{{ runtimeStatusLabel }}</dd></div>
            <div><dt>{{ copy.runtimeCommit }}</dt><dd><a :href="`https://github.com/joinwell52-AI/joinwell52/commit/${runtimeLatest.commit}`">{{ runtimeLatest.commit.slice(0, 7) }} ↗</a></dd></div>
          </dl>
          <a class="rc-ra-log__cta" :href="link(runtimePath)">{{ copy.enterRuntime }} <span>→</span></a>
        </aside>

        <a class="rc-all-research" :href="link(researchOverview)">{{ copy.allResearch }} <span>→</span></a>
      </div>
    </section>

    <footer class="rc-site-footer">
      <div class="rc-shell rc-site-footer__grid">
        <div class="rc-site-footer__brand">
          <div class="rc-product-mark rc-product-mark--footer" aria-label="TMPA, FCoP, CodeFlowMu">
            <a :href="link(zh ? '/zh/publications/tmpa-architecture-paper-a1.0' : '/en/publications/tmpa-architecture-paper-a1.0')" title="TMPA"><img src="/logo.svg?v=tmpa-20260807-5" alt="TMPA logo"><span>TMPA</span></a>
            <a href="https://joinwell52-ai.github.io/FCoP/" title="FCoP"><img src="https://raw.githubusercontent.com/joinwell52-AI/FCoP/main/assets/fcop-logo-256.png" alt="FCoP logo"><span>FCoP</span></a>
            <a href="https://github.com/joinwell52-AI/CodeFlowMu-open" title="CodeFlowMu"><img src="/assets/logos/codeflowmu.png" alt="CodeFlowMu logo"><span>CodeFlowMu</span></a>
          </div>
          <h2>{{ zh ? '数字员工工场' : 'Digital Employee Works' }}</h2>
          <p>{{ copy.footerAbout }}</p>
        </div>
        <nav><h3>{{ copy.footerCode }}</h3><a href="https://github.com/joinwell52-AI/joinwell52">{{ copy.repository }} ↗</a><a href="https://joinwell52-ai.github.io/FCoP/">{{ copy.fcop }} ↗</a><a href="https://github.com/joinwell52-AI/CodeFlowMu-open">{{ copy.codeflow }} ↗</a></nav>
        <nav><h3>{{ copy.footerRead }}</h3><a :href="link(researchOverview)">{{ copy.researchNotes }} →</a><a :href="link(publicationOverview)">{{ copy.publicationCenter }} →</a><a :href="link(runtimePath)">{{ copy.runtimeCenter }} →</a></nav>
        <nav><h3>{{ copy.footerCite }}</h3><a href="https://github.com/joinwell52-AI/joinwell52/blob/main/CITATION.cff">{{ copy.citationFile }} ↗</a><a href="https://github.com/joinwell52-AI/joinwell52/blob/main/LICENSE.md">{{ copy.license }} ↗</a><b>{{ copy.licenseName }}</b></nav>
      </div>
      <div class="rc-shell rc-site-footer__legal">
        <div class="rc-site-footer__owner"><span>{{ copy.copyright }}</span><a href="https://github.com/joinwell52-AI">{{ copy.authorLabel }} {{ copy.authorName }} · {{ copy.authorMeta }}</a></div>
        <p>{{ copy.licenseSummary }}</p>
      </div>
    </footer>
  </main>
</template>

<style scoped>
:global(.portal-v5-page .VPContent) { padding-top: 0 !important; }
:global(.portal-v5-page .VPHome) { max-width: none; padding-bottom: 0; }
:global(.portal-v5-page .VPHomeHero), :global(.portal-v5-page .VPFeatures) { display: none; }
:global(.portal-v5-page .VPFooter) { display: none; }
:global(.portal-v5-page .VPNavBar) { border-bottom: 1px solid #e1e5ed; background: rgba(255, 255, 255, .92); backdrop-filter: blur(16px); }
:global(.portal-v5-page .VPNavBar .container) { width: min(1220px, calc(100% - 72px)); max-width: none; margin-inline: auto; padding-inline: 0; }
:global(.portal-v5-page .VPNavBarTitle .title) { display: grid; align-content: center; gap: 3px; min-width: max-content; color: transparent; background: linear-gradient(112deg, #090d18 0%, #293653 42%, #5b4cf0 76%, #31b8d4 100%); background-clip: text; -webkit-background-clip: text; font-family: "Arial Black", "Noto Sans SC", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif; font-size: 20px; font-weight: 950; line-height: .92; letter-spacing: -.085em; text-shadow: 0 1px 0 rgba(255,255,255,.5); filter: drop-shadow(0 4px 9px rgba(79,70,229,.15)); transform: skewX(-4deg); transform-origin: left center; }
:global(.portal-v5-page .VPNavBarTitle .title::after) { content: \"DIGITAL EMPLOYEE WORKS\"; color: #69748a; -webkit-text-fill-color: #69748a; font: 800 7px/1 ui-sans-serif, system-ui, sans-serif; letter-spacing: .16em; transform: skewX(4deg); transform-origin: left center; }
:global(.portal-v5-page .VPNavBarSearch .DocSearch-Button) { border-color: #dfe4ee; background: #f4f6fa; }
:global(.portal-v5-page .VPNavBarAppearance) { display: none; }
:global(.dark .portal-v5-page .VPNavBar) { border-bottom-color: rgba(255,255,255,.1); background: rgba(8, 11, 22, .94); }
:global(.dark .portal-v5-page .VPNavBarTitle .title) { background: linear-gradient(105deg, #ffffff 0%, #b8c6e5 52%, #8b7cff 100%); background-clip: text; -webkit-background-clip: text; }
:global(.dark .portal-v5-page .VPNavBarTitle .title::after) { color: #8d9ab5; -webkit-text-fill-color: #8d9ab5; }
:global(.dark .portal-v5-page .VPNavBarSearch .DocSearch-Button) { border-color: rgba(255,255,255,.12); background: #12172a; }

.rc-home {
  --rc-paper: #f7f9fc;
  --rc-paper-2: #eef2f7;
  --rc-surface: #ffffff;
  --rc-ink: #0d1225;
  --rc-night: #080e1c;
  --rc-muted: #657089;
  --rc-line: #dfe4ee;
  --rc-signal: #6d5dfc;
  --rc-field: #121c3b;
  --rc-field-border: #2a3761;
  --rc-field-soft: #a9b4d0;
  --rc-red: #176b82;
  --rc-lime: #58d9ec;
  --rc-watermark: rgba(126, 139, 174, .13);
  color: var(--rc-ink);
  background: var(--rc-paper);
  font-family: Inter, "Noto Sans SC", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif;
  overflow: hidden;
}

:global(.dark .rc-home) {
  --rc-paper: #080b16;
  --rc-paper-2: #0e1221;
  --rc-surface: #101529;
  --rc-ink: #f4f6fb;
  --rc-night: #070b16;
  --rc-muted: #9ca8c2;
  --rc-line: rgba(255,255,255,.1);
  --rc-signal: #8b7cff;
  --rc-field: #131d3d;
  --rc-field-border: #2c3b65;
  --rc-field-soft: #aeb8d4;
  --rc-red: #24758c;
  --rc-lime: #62deed;
  --rc-watermark: rgba(255,255,255,.06);
}

.rc-home, .rc-home * { box-sizing: border-box; }
.rc-home a { text-decoration: none !important; }
.rc-shell { width: min(1220px, calc(100% - 72px)); margin-inline: auto; }

.rc-hero { position: relative; min-height: 770px; color: #fff; border-bottom: 1px solid rgba(255,255,255,.1); background: radial-gradient(circle at 82% 10%, rgba(54,203,232,.18), transparent 28%), radial-gradient(circle at 17% 82%, rgba(109,93,252,.2), transparent 32%), linear-gradient(135deg, #070d1a 0%, #101a36 56%, #072333 100%); }
.rc-hero::before { content: "WORKS"; position: absolute; right: -34px; top: 38px; color: transparent; -webkit-text-stroke: 1px var(--rc-watermark); font-size: clamp(110px, 16vw, 230px); font-weight: 900; letter-spacing: -.08em; line-height: 1; pointer-events: none; }
.rc-product-mark { display: inline-flex; align-items: center; gap: 12px; }
.rc-product-mark a { display: grid; width: 36px; height: 36px; place-items: center; opacity: .82; transition: opacity .18s ease, transform .18s ease; }
.rc-product-mark a:hover { opacity: 1; transform: translateY(-2px); }
.rc-product-mark img { width: 34px; height: 34px; object-fit: contain; border-radius: 9px; }
.rc-product-mark span { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.rc-controls { position: fixed; z-index: 100; top: 11px; right: max(36px, calc((100vw - 1220px) / 2)); display: flex; align-items: center; gap: 4px; min-height: 42px; padding: 4px; color: #172039; background: rgba(255,255,255,.96); border: 1px solid #dfe4ee; border-radius: 24px; box-shadow: 0 8px 24px rgba(16,25,54,.12); backdrop-filter: blur(16px); }
.rc-language { display: grid; grid-template-columns: repeat(2, minmax(44px, auto)); align-items: center; padding-right: 4px; border-right: 1px solid #dfe4ee; font: 760 12px/1 ui-sans-serif, system-ui, sans-serif; }
.rc-language strong,
.rc-language a { display: grid; min-height: 32px; padding: 0 10px; place-items: center; border-radius: 18px; }
.rc-language strong { color: #fff; background: #121a34; }
.rc-language a { color: #4c5670 !important; }
.rc-language a:hover { color: #4f46e5 !important; background: #eef0ff; }
.rc-appearance { display: flex; align-items: center; gap: 6px; min-height: 32px; padding: 0 11px; color: #242d45; background: transparent; border: 0; border-radius: 18px; cursor: pointer; font: 760 12px/1 ui-sans-serif, system-ui, sans-serif; }
.rc-appearance:hover { background: #eef2f7; }
.rc-appearance span { font-size: 15px; line-height: 1; }
.rc-appearance b { font-weight: 760; }
:global(.dark .rc-controls) { color: #fff; background: rgba(14,19,38,.96); border-color: rgba(255,255,255,.14); box-shadow: 0 8px 24px rgba(0,0,0,.28); }
:global(.dark .rc-language) { border-right-color: rgba(255,255,255,.14); }
:global(.dark .rc-language strong) { color: #11182e; background: #fff; }
:global(.dark .rc-language a) { color: #b9c2d8 !important; }
:global(.dark .rc-language a:hover),
:global(.dark .rc-appearance:hover) { color: #fff !important; background: rgba(255,255,255,.1); }
:global(.dark .rc-appearance) { color: #fff; }
.rc-hero__layout { position: relative; display: grid; grid-template-columns: minmax(390px, .88fr) minmax(500px, 1.12fr); gap: 44px; align-items: center; padding-top: 82px; }
.rc-home:not(.is-zh) .rc-hero__layout { grid-template-columns: minmax(390px, .88fr) minmax(500px, 1.12fr); gap: 44px; }
.rc-kicker { display: flex; align-items: center; gap: 13px; margin: 0 0 22px; color: #f0f4ff; font: 800 13px/1.4 "Noto Sans SC", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif; letter-spacing: .025em; }
.rc-kicker span { width: 30px; height: 2px; background: var(--rc-red); }
.rc-kicker--dark { color: var(--rc-ink); }
.rc-hero .rc-kicker { color: #80e2f1; }
.rc-hero__title { margin: 0; font-size: clamp(66px, 5.8vw, 84px); font-weight: 860; line-height: .93; letter-spacing: -.068em; }
.rc-home:not(.is-zh) .rc-hero__title { font-size: clamp(66px, 5.15vw, 74px); }
.rc-hero__title :deep(.is-accent) { color: transparent; background: linear-gradient(100deg, #9b8cff 5%, #6882ff 48%, #54d9ee 96%); background-clip: text; -webkit-background-clip: text; }
.rc-hero__lead { max-width: 740px; margin: 32px 0 0; color: #aeb8d4; font-size: 17px; line-height: 1.75; }
.rc-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin-top: 36px; }
.rc-button { display: inline-flex; align-items: center; justify-content: space-between; min-height: 48px; gap: 24px; padding: 0 18px; border: 1px solid rgba(255,255,255,.2); color: #fff !important; background: transparent; cursor: pointer; font: 760 13px/1.2 ui-sans-serif, system-ui, sans-serif; }
.rc-button--primary { color: #fff !important; background: linear-gradient(120deg, #6d5dfc, #477fe9); border-color: transparent; box-shadow: 0 16px 38px rgba(83,78,235,.28); }
.rc-text-link { margin-left: 8px; color: #fff !important; font-size: 12px; font-weight: 760; border-bottom: 1px solid rgba(255,255,255,.45); }
.rc-hero-video { position: relative; display: block; width: 100%; aspect-ratio: 16 / 9; padding: 0; overflow: hidden; color: #fff; text-align: left; background: #020711; border: 1px solid rgba(118,215,238,.32); border-radius: 24px; box-shadow: 0 34px 90px rgba(0,0,0,.42), 14px 14px 0 rgba(7,12,27,.72); cursor: pointer; isolation: isolate; }
.rc-hero-video::after { position: absolute; inset: 10px; z-index: 3; border: 1px solid rgba(255,255,255,.18); border-radius: 16px; content: ''; pointer-events: none; }
.rc-hero-video video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.2,.8,.2,1); }
.rc-hero-video:hover video { transform: scale(1.025); }
.rc-hero-video__shade { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(1,6,17,.46) 0%, transparent 38%, rgba(1,6,17,.9) 100%); }
.rc-hero-video__top { position: absolute; z-index: 4; top: 24px; right: 26px; left: 26px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.rc-hero-video__top b { color: #80e2f1; font: 850 11px/1 ui-monospace, monospace; letter-spacing: .12em; }
.rc-hero-video__top i { padding: 7px 10px; color: #eafaff; background: rgba(3,11,27,.58); border: 1px solid rgba(255,255,255,.18); border-radius: 999px; font: 720 10px/1 ui-sans-serif, system-ui, sans-serif; font-style: normal; backdrop-filter: blur(10px); }
.rc-hero-video__play { position: absolute; z-index: 4; top: 50%; left: 50%; display: grid; width: 72px; height: 72px; padding-left: 5px; place-items: center; color: #07101f; background: rgba(128,226,241,.94); border: 7px solid rgba(255,255,255,.18); border-radius: 50%; box-shadow: 0 16px 42px rgba(0,0,0,.38); font-size: 22px; transform: translate(-50%, -50%); transition: transform .2s ease, background .2s ease; }
.rc-hero-video:hover .rc-hero-video__play { background: #fff; transform: translate(-50%, -50%) scale(1.08); }
.rc-hero-video__caption { position: absolute; z-index: 4; right: 26px; bottom: 30px; left: 26px; display: flex; flex-direction: column; gap: 7px; padding-right: 170px; }
.rc-hero-video__caption strong { font-size: 18px; line-height: 1.32; letter-spacing: -.025em; }
.rc-hero-video__caption small { color: #b9c8dc; font-size: 11px; line-height: 1.4; }
.rc-hero-video__url { position: absolute; z-index: 4; right: 26px; bottom: 31px; color: #80e2f1; font: 720 10px/1.4 ui-monospace, monospace; }
.rc-video-modal { position: fixed; inset: 0; z-index: 500; display: grid; padding: 34px; place-items: center; overflow-y: auto; background: rgba(1,5,14,.88); backdrop-filter: blur(18px); }
.rc-video-modal__panel { width: min(1180px, 100%); padding: 16px; color: #fff; background: #050b16; border: 1px solid rgba(118,215,238,.34); border-radius: 26px; box-shadow: 0 40px 120px rgba(0,0,0,.62); }
.rc-video-modal__panel > header { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 2px 4px 14px 10px; }
.rc-video-modal__panel > header div { display: flex; align-items: baseline; gap: 14px; }
.rc-video-modal__panel > header span { color: #80e2f1; font: 820 10px/1 ui-monospace, monospace; letter-spacing: .1em; }
.rc-video-modal__panel > header strong { color: #d9e5f5; font-size: 13px; }
.rc-video-modal__panel > header button { display: grid; width: 38px; height: 38px; padding: 0; place-items: center; color: #fff; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.18); border-radius: 50%; cursor: pointer; font-size: 25px; line-height: 1; }
.rc-video-modal__panel > video { display: block; width: 100%; aspect-ratio: 16 / 9; background: #000; border-radius: 16px; }
.rc-video-modal__panel > footer { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 15px 8px 3px; color: #9fb0c9; font-size: 11px; }
.rc-video-modal__panel > footer a { color: #80e2f1 !important; font-weight: 760; }
.rc-ledger { position: relative; min-height: 442px; color: #fff; background: linear-gradient(145deg, rgba(22,31,63,.9), rgba(9,17,38,.92)); border: 1px solid rgba(255,255,255,.12); padding: 26px; box-shadow: 18px 18px 0 rgba(0,0,0,.34); }
.rc-ledger::before { content: ""; position: absolute; inset: 0; opacity: .14; background-image: linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px); background-size: 54px 54px; pointer-events: none; }
.rc-ledger > * { position: relative; }
.rc-ledger header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,.4); font: 750 12px/1.35 "Noto Sans SC", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif; letter-spacing: .02em; }
.rc-ledger header b { display: flex; align-items: center; gap: 7px; }
.rc-ledger header i, .rc-mobile-ledger i { width: 7px; height: 7px; border-radius: 50%; background: var(--rc-lime); box-shadow: 0 0 0 4px rgba(88,217,236,.16); }
.rc-ledger__release { padding: 30px 0 24px; border-bottom: 1px solid rgba(255,255,255,.4); }
.rc-ledger__release small { display: block; color: #aebddd; font: 700 12px/1.4 "Noto Sans SC", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif; letter-spacing: .02em; }
.rc-ledger__release strong { display: block; margin-top: 12px; font-size: 70px; line-height: .95; letter-spacing: -.07em; }
.rc-ledger__release p { margin: 10px 0 0; font-size: 14px; font-weight: 720; }
.rc-ledger dl { margin: 10px 0 0; }
.rc-ledger dl div { display: flex; justify-content: space-between; gap: 16px; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,.18); }
.rc-ledger dt { color: #aebddd; font-size: 12px; line-height: 1.35; }
.rc-ledger dd { margin: 0; color: #fff; font: 750 12px/1.35 "Noto Sans SC", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif; letter-spacing: .01em; }
.rc-ledger footer { display: flex; justify-content: space-between; gap: 18px; padding-top: 17px; font: 720 11px/1.4 "Noto Sans SC", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif; letter-spacing: .01em; }
.rc-ledger footer b { color: #fff; font-size: 12px; }
.rc-mobile-ledger { display: none; }
.rc-hero__index { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: 78px; border-top: 1px solid rgba(255,255,255,.14); }
.rc-hero__index div { display: grid; grid-template-columns: 26px auto 1fr; align-items: center; gap: 12px; min-height: 78px; padding: 0 18px; border-right: 1px solid rgba(255,255,255,.12); }
.rc-hero__index div:first-child { padding-left: 0; }
.rc-hero__index div:last-child { border-right: 0; }
.rc-hero__index span { color: #a5afc7; font: 700 10px/1 ui-monospace, monospace; }
.rc-hero__index b { font-size: 20px; letter-spacing: -.04em; }
.rc-hero__index small { color: #a5afc7; font: 700 11px/1.2 ui-sans-serif, system-ui, sans-serif; letter-spacing: .03em; }

.rc-section { padding: 112px 0; border-bottom: 1px solid var(--rc-line); }
.rc-section__intro { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(300px, .65fr); gap: 72px; align-items: end; }
.rc-section__intro > p { margin: 0 0 5px; color: var(--rc-muted); font-size: 15px; line-height: 1.75; }
.rc-section__title { margin: 0; font-size: clamp(48px, 5vw, 72px); line-height: .98; letter-spacing: -.06em; font-weight: 840; }
.rc-section__intro--light > p { color: #aeb4ae; }

.rc-codeflow-video { color: #fff; background: radial-gradient(circle at 82% 14%, rgba(54,203,232,.14), transparent 32%), radial-gradient(circle at 12% 82%, rgba(109,93,252,.16), transparent 34%), #07101f; border-color: #23334d; }
.rc-codeflow-video__frame { margin-top: 56px; padding: 14px; overflow: hidden; background: #020711; border: 1px solid rgba(118,215,238,.28); border-radius: 30px; box-shadow: 0 34px 90px rgba(0,0,0,.34); }
.rc-codeflow-video__frame video { display: block; width: 100%; aspect-ratio: 16 / 9; background: #000; border-radius: 20px; }
.rc-codeflow-video__meta { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-top: 20px; color: #9fb0c9; font: 720 11px/1.4 ui-sans-serif, system-ui, sans-serif; letter-spacing: .035em; }
.rc-codeflow-video__meta nav { display: flex; gap: 10px; }
.rc-codeflow-video__meta a { padding: 11px 14px; color: #e9fbff !important; border: 1px solid rgba(118,215,238,.3); border-radius: 999px; }
.rc-codeflow-video__meta a:hover { color: #07101f !important; background: #76d7ee; border-color: #76d7ee; }

.rc-tmpa, .rc-research { color: #fff; background: var(--rc-night); border-color: #313631; }
.rc-research { padding-bottom: 0; }
.rc-tmpa__archive { display: flex; align-items: stretch; margin-top: 34px; background: #101511; border: 1px solid #3f443f; }
.rc-doi-badge { display: flex; align-items: center; gap: 14px; min-width: 330px; padding: 17px 20px; color: #fff !important; background: #1682d4; }
.rc-doi-badge span { padding-right: 14px; border-right: 1px solid rgba(255,255,255,.42); font: 850 12px/1 ui-sans-serif, system-ui, sans-serif; letter-spacing: .08em; }
.rc-doi-badge strong { font: 800 15px/1.2 ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: -.025em; }
.rc-doi-badge i { margin-left: auto; font-style: normal; }
.rc-tmpa__archive-meta { display: flex; flex: 1; align-items: center; justify-content: space-between; gap: 24px; padding: 14px 18px; }
.rc-tmpa__archive-meta > b { color: #d9dfd9; font: 760 11px/1.3 ui-sans-serif, system-ui, sans-serif; letter-spacing: .04em; }
.rc-tmpa__archive-meta nav { display: flex; align-items: center; gap: 8px; }
.rc-tmpa__archive-meta a { padding: 9px 11px; color: #fff !important; border: 1px solid #4b514c; font: 750 11px/1.2 ui-sans-serif, system-ui, sans-serif; }
.rc-tmpa__archive-meta a:hover { color: var(--rc-night) !important; background: var(--rc-lime); border-color: var(--rc-lime); }
.rc-tmpa__archive + .rc-publications { margin-top: 34px; }
.rc-publications { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 70px; }
.rc-publication { display: grid; grid-template-rows: 250px 1fr; min-height: 560px; color: var(--rc-ink) !important; background: var(--rc-paper); border: 1px solid #3f443f; }
.rc-publication__art { position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 24px; overflow: hidden; color: #fff; background: var(--rc-signal); }
.rc-publication--spec .rc-publication__art { background: var(--rc-red); }
.rc-publication--case .rc-publication__art { color: var(--rc-night); background: var(--rc-lime); }
.rc-publication__art::after { content: ""; position: absolute; width: 190px; height: 190px; right: -56px; bottom: -82px; border: 1px solid currentColor; border-radius: 50%; box-shadow: 0 0 0 34px transparent, 0 0 0 35px currentColor; opacity: .18; }
.rc-publication__art span { font: 750 11px/1.2 ui-sans-serif, system-ui, sans-serif; letter-spacing: .05em; }
.rc-publication__art b { font-size: 76px; line-height: .9; letter-spacing: -.08em; }
.rc-publication__art i { position: absolute; top: 0; bottom: 0; right: 31%; width: 1px; background: currentColor; opacity: .2; }
.rc-publication__body { display: flex; flex-direction: column; padding: 28px; }
.rc-publication__body > p { margin: 0; color: var(--rc-muted); font: 700 11px/1.2 ui-sans-serif, system-ui, sans-serif; letter-spacing: .04em; }
.rc-publication__body h3 { margin: 28px 0 24px; font-size: 31px; line-height: 1.04; letter-spacing: -.045em; }
.rc-publication__body h3 span { display: block; white-space: nowrap; }
.rc-publication__body > b { display: flex; justify-content: space-between; margin-top: auto; padding-top: 18px; border-top: 1px solid var(--rc-line); font-size: 11px; }

.rc-engine { background: var(--rc-paper-2); }
.rc-engine__grid { display: grid; grid-template-columns: .74fr 1.26fr; gap: 18px; margin-top: 68px; }
.rc-governance-note { display: grid; grid-template-columns: .42fr 1.1fr 1.48fr; gap: 28px; align-items: start; margin-top: 18px; padding: 24px 28px; color: #dbe7f3; background: #111c30; border: 1px solid #273b55; }
.rc-governance-note > span { color: #62deed; font: 780 10px/1.3 ui-monospace, monospace; letter-spacing: .08em; }
.rc-governance-note h3 { margin: 0; color: #fff; font-size: 19px; line-height: 1.28; letter-spacing: -.025em; }
.rc-governance-note p { margin: 0; color: #aebed0; font-size: 13px; line-height: 1.7; }
.rc-position-card { position: relative; min-height: 470px; padding: 28px; color: #fff; background: linear-gradient(145deg, #171d3d, #102c43); }
.rc-position-card header { display: flex; justify-content: space-between; font: 750 11px/1 ui-sans-serif, system-ui, sans-serif; letter-spacing: .04em; }
.rc-position-card header b { color: var(--rc-lime); }
.rc-position-card__mark { margin-top: 74px; font-size: 126px; font-weight: 900; line-height: .8; letter-spacing: -.1em; }
.rc-position-card h3 { margin: 34px 0 5px; font-size: 30px; }
.rc-position-card p { margin: 0; color: var(--rc-field-soft); font-size: 13px; }
.rc-position-card__live { display: grid; grid-template-columns: 1fr auto; gap: 10px 16px; margin-top: 24px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,.18); }
.rc-position-card__live > span { display: flex; align-items: center; gap: 8px; color: #9ae7cf; font: 780 10px/1 ui-sans-serif, system-ui, sans-serif; letter-spacing: .07em; }
.rc-position-card__live > span i { width: 7px; height: 7px; background: #7ee2c0; border-radius: 50%; box-shadow: 0 0 0 5px rgba(126,226,192,.12); animation: rc-live-dot 1.45s ease-in-out infinite; }
.rc-position-card__live > b { font: 760 11px/1 ui-monospace, monospace; }
.rc-position-card__live > strong { grid-column: 1 / -1; display: flex; align-items: baseline; justify-content: space-between; gap: 16px; font-size: 15px; }
.rc-position-card__live > strong small { color: #8e9bb4; font-size: 10px; font-weight: 700; letter-spacing: .04em; }
.rc-position-card a { position: absolute; left: 28px; right: 28px; bottom: 28px; display: flex; justify-content: space-between; padding-top: 16px; color: #fff !important; border-top: 1px solid rgba(255,255,255,.45); font-size: 11px; font-weight: 750; }
.rc-skill-flow { display: grid; grid-template-rows: 58px 1fr; min-height: 470px; padding: 0; background: #dfe4ec; border: 1px solid #cbd3df; }
.rc-skill-flow > header { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 0 20px; color: #414b5d; background: rgba(247,249,252,.7); border-bottom: 1px solid #cbd3df; }
.rc-skill-flow > header b { font-size: 14px; letter-spacing: .01em; }
.rc-skill-flow > header span { display: flex; align-items: center; gap: 8px; font: 760 11px/1 ui-monospace, monospace; letter-spacing: .035em; }
.rc-skill-flow > header span i { width: 7px; height: 7px; background: #7ee2c0; border-radius: 50%; box-shadow: 0 0 0 5px rgba(126,226,192,.14); animation: rc-live-dot 1.45s ease-in-out infinite; }
.rc-skill-flow__map { position: relative; min-height: 0; padding: 12px; overflow: hidden; background: linear-gradient(90deg, transparent calc(50% - 25px), rgba(255,255,255,.42) calc(50% - 25px), rgba(255,255,255,.42) calc(50% + 25px), transparent calc(50% + 25px)), linear-gradient(rgba(74,86,105,.07) 1px, transparent 1px); background-size: auto, 100% 25%; }
.rc-skill-flow__map > svg { position: absolute; inset: 12px; z-index: 0; width: calc(100% - 24px); height: calc(100% - 24px); overflow: visible; }
.rc-skill-flow__rail,
.rc-skill-flow__pulse { fill: none; vector-effect: non-scaling-stroke; }
.rc-skill-flow__rail { stroke: rgba(95,108,128,.2); stroke-width: 11; stroke-linecap: round; }
.rc-skill-flow__pulse { stroke: #58d9ec; stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 3 19; animation: rc-flow-pulse 2.7s linear infinite; }
.rc-skills { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(4, 1fr); gap: 14px 50px; height: 100%; min-height: 0; padding: 0; margin: 0; list-style: none; }
.rc-skills li { position: relative; min-width: 0; min-height: 0; }
.rc-skills button { position: relative; display: grid; grid-template-columns: 62px minmax(0, 1fr); gap: 13px; align-items: stretch; width: 100%; height: 100%; min-height: 0; padding: 8px 10px; overflow: visible; color: var(--office-ink); text-align: left; background: var(--office-room); border: 1px solid var(--office-edge); box-shadow: 0 3px 0 var(--office-threshold); cursor: pointer; transition: transform .24s ease, box-shadow .24s ease, border-color .24s ease, background .24s ease; }
.rc-skills button::after { position: absolute; right: 12px; bottom: 6px; width: 4px; height: 4px; background: var(--office-ink); border-radius: 50%; opacity: .55; content: ''; }
.rc-skills li:nth-child(3) { grid-column: 2; grid-row: 2; }
.rc-skills li:nth-child(4) { grid-column: 1; grid-row: 2; }
.rc-skills li:nth-child(5) { grid-column: 1; grid-row: 3; }
.rc-skills li:nth-child(6) { grid-column: 2; grid-row: 3; }
.rc-skills li:nth-child(7) { grid-column: 2; grid-row: 4; }
.rc-skills li:nth-child(8) { grid-column: 1; grid-row: 4; }
.rc-skills li:nth-child(1) { --office-room: #f5f7fa; --office-ink: #344858; --office-edge: #cad2dc; --office-threshold: #9aa8b4; }
.rc-skills li:nth-child(2) { --office-room: #eef2f6; --office-ink: #334c5b; --office-edge: #c6d0da; --office-threshold: #92a2af; }
.rc-skills li:nth-child(3) { --office-room: #f2f0f6; --office-ink: #554c69; --office-edge: #cec9d8; --office-threshold: #9e95ad; }
.rc-skills li:nth-child(4) { --office-room: #ebe8f1; --office-ink: #524662; --office-edge: #c8c2d2; --office-threshold: #9489a3; }
.rc-skills li:nth-child(5) { --office-room: #f1edf5; --office-ink: #5a4965; --office-edge: #cec6d5; --office-threshold: #9c90a7; }
.rc-skills li:nth-child(6) { --office-room: #e9e6f0; --office-ink: #54445f; --office-edge: #c8c1d1; --office-threshold: #93869f; }
.rc-skills li:nth-child(7) { --office-room: #eef1f5; --office-ink: #404b59; --office-edge: #c8cfd8; --office-threshold: #959faa; }
.rc-skills li:nth-child(8) { --office-room: #e7ebf0; --office-ink: #394552; --office-edge: #c2cad4; --office-threshold: #8995a2; }
.rc-office-lamp { position: absolute; top: -5px; left: 14px; z-index: 3; width: 58px; height: 4px; background: #8792a1; opacity: .38; transition: background .24s ease, box-shadow .24s ease, opacity .24s ease; }
.rc-office-sign { display: grid; align-self: center; width: 62px; height: 50px; padding: 6px; place-items: center; color: #dce5f1; background: #152136; border: 1px solid #273a56; border-radius: 3px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.035); transition: color .24s ease, background .24s ease, transform .24s ease; }
.rc-office-door { position: relative; display: flex; min-width: 0; padding: 8px 18px 8px 10px; align-items: center; border-left: 1px solid color-mix(in srgb, var(--office-ink) 18%, transparent); }
.rc-skill-copy { min-width: 0; }
.rc-skill-copy small { display: block; margin-bottom: 8px; color: var(--office-ink); font: 780 10.5px/1 ui-monospace, monospace; letter-spacing: .035em; opacity: .72; }
.rc-skill-copy b { display: block; overflow: hidden; color: #111827; font-size: 16px; line-height: 1.15; text-overflow: ellipsis; white-space: nowrap; }
.rc-office-handle { position: absolute; top: 50%; right: 2px; width: 5px; height: 5px; background: var(--office-ink); border-radius: 50%; opacity: .62; transform: translateY(-50%); }
.rc-skills li.is-active { z-index: 2; }
.rc-skills li.is-active button { background: #f6fcfd; border-color: #58d9ec; box-shadow: 0 10px 24px rgba(20,83,97,.15), 0 0 0 2px #58d9ec, 0 3px 0 #259eb0; transform: translateY(-2px); }
.rc-skills li.is-active .rc-office-lamp { background: #7ee2c0; box-shadow: 0 0 8px #7ee2c0, 0 0 20px rgba(126,226,192,.62); opacity: 1; animation: rc-live-dot 1.45s ease-in-out infinite; }
.rc-skills li.is-active .rc-office-sign { color: #fff; background: #0f4558; border-color: #58d9ec; transform: translateY(-1px); }
.rc-work-pass { position: absolute; top: 12%; left: 50%; z-index: 4; display: grid; width: 30px; height: 24px; place-items: center; color: #fff; background: #18233a; border: 1px solid rgba(255,255,255,.72); box-shadow: 0 5px 14px rgba(31,40,58,.26); transform: translate(-50%, -50%); transition: top .32s cubic-bezier(.2,.8,.2,1); }
.rc-work-pass b { font: 820 9px/1 ui-monospace, monospace; letter-spacing: .03em; }
.rc-work-pass i { position: absolute; right: -4px; bottom: 3px; width: 8px; height: 3px; background: #58d9ec; }
.rc-skill-flow.is-step-3 .rc-work-pass,
.rc-skill-flow.is-step-4 .rc-work-pass { top: 37%; }
.rc-skill-flow.is-step-5 .rc-work-pass,
.rc-skill-flow.is-step-6 .rc-work-pass { top: 63%; }
.rc-skill-flow.is-step-7 .rc-work-pass,
.rc-skill-flow.is-step-8 .rc-work-pass { top: 88%; }
:global(.dark .rc-skill-flow) { background: #101a2a; border-color: #293a50; }
:global(.dark .rc-skill-flow > header) { color: #b9c8d8; background: #111d30; border-bottom-color: #293a50; }
:global(.dark .rc-skill-flow__map) { background: linear-gradient(90deg, transparent calc(50% - 25px), rgba(90,126,153,.1) calc(50% - 25px), rgba(90,126,153,.1) calc(50% + 25px), transparent calc(50% + 25px)), linear-gradient(rgba(117,150,176,.06) 1px, transparent 1px); background-size: auto, 100% 25%; }
:global(.dark .rc-skills li:nth-child(1)) { --office-room: #18283a; --office-ink: #b9cad8; --office-edge: #30465c; --office-threshold: #3a5369; }
:global(.dark .rc-skills li:nth-child(2)) { --office-room: #172638; --office-ink: #b7cad8; --office-edge: #2e4459; --office-threshold: #385166; }
:global(.dark .rc-skills li:nth-child(3)) { --office-room: #1b273b; --office-ink: #c5cbe0; --office-edge: #34435b; --office-threshold: #43536d; }
:global(.dark .rc-skills li:nth-child(4)) { --office-room: #1d293e; --office-ink: #c9cee2; --office-edge: #36465e; --office-threshold: #465670; }
:global(.dark .rc-skills li:nth-child(5)) { --office-room: #1a2a3f; --office-ink: #c2d0df; --office-edge: #34495f; --office-threshold: #405b71; }
:global(.dark .rc-skills li:nth-child(6)) { --office-room: #19283c; --office-ink: #c0cedd; --office-edge: #32475d; --office-threshold: #3e586e; }
:global(.dark .rc-skills li:nth-child(7)) { --office-room: #162536; --office-ink: #b7c7d5; --office-edge: #2d4256; --office-threshold: #384f63; }
:global(.dark .rc-skills li:nth-child(8)) { --office-room: #172638; --office-ink: #bac9d6; --office-edge: #2e4358; --office-threshold: #394f65; }
:global(.dark .rc-skill-copy b) { color: #f5f7fb; }
:global(.dark .rc-office-sign) { color: #dce7f1; background: #0b1627; border-color: #354a63; }
:global(.dark .rc-skills li.is-active button) { background: #102b33; border-color: #62deed; box-shadow: 0 10px 24px rgba(0,0,0,.32), 0 0 0 2px #62deed, 0 3px 0 #2498aa; }
:global(.dark .rc-skills li.is-active .rc-office-sign) { color: #fff; background: #0e4758; border-color: #62deed; }
:global(.dark .rc-skill-flow__rail) { stroke: rgba(255,255,255,.12); }
:global(.dark .rc-skill-flow__pulse) { stroke: #62deed; }

@keyframes rc-live-dot { 0%, 100% { opacity: .48; transform: scale(.82); } 50% { opacity: 1; transform: scale(1); } }
@keyframes rc-flow-pulse { to { stroke-dashoffset: -52; } }

.rc-field { background: var(--rc-surface); }
.rc-programs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; margin-top: 70px; }
.rc-program { display: grid; grid-template-columns: 44% 56%; min-height: 330px; overflow: hidden; color: var(--rc-ink) !important; background: var(--rc-paper); border: 1px solid var(--rc-line); border-radius: 28px; transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
.rc-program:hover { transform: translateY(-4px); border-color: color-mix(in srgb, var(--rc-signal) 58%, var(--rc-line)); box-shadow: 0 22px 50px rgba(18, 28, 59, .1); }
.rc-program__cover { position: relative; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; padding: 24px; overflow: hidden; isolation: isolate; color: #fff; }
.rc-program__cover::before,
.rc-program__cover::after { position: absolute; z-index: -1; border: 1px solid rgba(255,255,255,.18); border-radius: 50%; content: ''; }
.rc-program__cover::before { right: -40%; bottom: -19%; width: 106%; aspect-ratio: 1; }
.rc-program__cover::after { right: -16%; bottom: -48%; width: 106%; aspect-ratio: 1; }
.rc-program--tmpa .rc-program__cover { background: linear-gradient(145deg, #171c4c, #6352ff); }
.rc-program--fcop .rc-program__cover { background: linear-gradient(145deg, #07131f, #15465a); }
.rc-program--codeflow .rc-program__cover { background: linear-gradient(145deg, #111936, #2858ad); }
.rc-program--employee .rc-program__cover { background: linear-gradient(145deg, #181534, #7843aa); }
.rc-program--xiaodian { grid-column: 1 / -1; }
.rc-program--xiaodian .rc-program__cover { background: linear-gradient(145deg, #10251f, #147d6f); }
.rc-program__cover > span,
.rc-program__cover > b { position: relative; z-index: 1; font: 800 10px/1 ui-monospace, monospace; letter-spacing: .08em; }
.rc-program__cover > b { align-self: flex-end; color: rgba(255,255,255,.62); }
.rc-program__cover > strong { position: relative; z-index: 1; align-self: center; font-size: 78px; font-weight: 300; line-height: 1; letter-spacing: -.12em; }
.rc-program__cover img { position: relative; z-index: 1; align-self: center; width: 112px; height: 112px; object-fit: contain; filter: drop-shadow(0 14px 20px rgba(0,0,0,.28)); }
.rc-program__body { display: flex; flex-direction: column; min-width: 0; padding: 31px; }
.rc-program__body small { color: var(--rc-signal); font: 800 11px/1.3 ui-sans-serif, system-ui, sans-serif; letter-spacing: .04em; }
.rc-program__body h3 { margin: 22px 0 13px; font-size: 34px; line-height: .93; letter-spacing: -.055em; }
.rc-program__body h3 span { display: block; white-space: nowrap; }
.rc-program__body p { margin: 0; color: var(--rc-muted); font-size: 13px; line-height: 1.65; }
.rc-program__body > b { display: flex; justify-content: space-between; margin-top: auto; padding-top: 20px; color: var(--rc-ink); border-top: 1px solid var(--rc-line); font-size: 10px; }
.rc-program__workforce { position: relative; z-index: 1; display: flex; gap: 9px; align-items: flex-end; justify-content: center; height: 112px; }
.rc-program__workforce i { display: block; width: 36px; border-radius: 20px 20px 8px 8px; background: linear-gradient(180deg, #fff, #60dfec); }
.rc-program__workforce i:nth-child(1) { height: 64px; }
.rc-program__workforce i:nth-child(2) { height: 98px; background: linear-gradient(180deg, #fff, #8d76ff); }
.rc-program__workforce i:nth-child(3) { height: 64px; }

.rc-note-marquee { margin-top: 68px; border-block: 1px solid rgba(255,255,255,.16); }
.rc-note-marquee > header { min-height: 52px; color: #a9b4d0; font-size: 11px; }
.rc-note-marquee > header > a { display: flex; align-items: center; justify-content: space-between; min-height: 52px; color: #a9b4d0 !important; }
.rc-note-marquee > header > a:hover { color: #fff !important; }
.rc-note-marquee > header b { display: flex; align-items: center; gap: 9px; color: #fff; font-weight: 760; }
.rc-note-marquee > header i,
.rc-ra-log header i,
.rc-ra-log dd i { width: 7px; height: 7px; border-radius: 50%; background: var(--rc-lime); box-shadow: 0 0 0 4px rgba(88,217,236,.15); }
.rc-note-marquee__viewport { overflow: hidden; border-top: 1px solid rgba(255,255,255,.12); }
.rc-note-marquee__track { display: flex; width: max-content; animation: rc-note-scroll 54s linear infinite; }
.rc-note-marquee:hover .rc-note-marquee__track { animation-play-state: paused; }
.rc-note-marquee__group { display: flex; flex: none; }
.rc-note-marquee__group a { display: grid; grid-template-columns: 82px 92px minmax(280px, 430px) 20px; gap: 12px; align-items: center; min-height: 76px; padding: 0 22px; color: #fff !important; border-right: 1px solid rgba(255,255,255,.12); }
.rc-note-marquee__group time,
.rc-note-marquee__group span { color: #8e9ab4; font-size: 10px; }
.rc-note-marquee__group strong { overflow: hidden; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
.rc-note-marquee__group i { color: var(--rc-lime); font-style: normal; }
@keyframes rc-note-scroll { to { transform: translateX(-50%); } }

.rc-note-browser { margin-top: 28px; border: 1px solid rgba(255,255,255,.18); background: linear-gradient(145deg, rgba(18,28,59,.45), rgba(8,14,28,.62)); }
.rc-note-tabs { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid rgba(255,255,255,.18); }
.rc-note-tabs button { position: relative; display: grid; grid-template-columns: 26px 1fr auto; gap: 12px; align-items: center; min-height: 76px; padding: 0 22px; color: #8f9bb4; text-align: left; border-right: 1px solid rgba(255,255,255,.14); }
.rc-note-tabs button:last-child { border-right: 0; }
.rc-note-tabs button::after { position: absolute; right: 0; bottom: -1px; left: 0; height: 3px; background: linear-gradient(90deg, #8b7cff, #58d9ec); transform: scaleX(0); transform-origin: left; transition: transform .3s ease; content: ''; }
.rc-note-tabs button.is-active { color: #fff; background: rgba(255,255,255,.045); }
.rc-note-tabs button.is-active::after { transform: scaleX(1); }
.rc-note-tabs span,
.rc-note-tabs small { color: #74819d; font: 700 10px/1 ui-monospace, monospace; }
.rc-note-tabs b { font-size: 15px; }
.rc-note-panel { min-height: 520px; padding: 34px; }
.rc-note-panel > header { display: grid; grid-template-columns: 1fr auto; gap: 48px; align-items: end; padding-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,.16); }
.rc-note-panel > header small { color: var(--rc-lime); font-size: 10px; font-weight: 760; }
.rc-note-panel > header h3 { margin: 14px 0 10px; font-size: 42px; line-height: 1; letter-spacing: -.05em; }
.rc-note-panel > header p { max-width: 670px; margin: 0; color: #a9b4d0; font-size: 13px; }
.rc-note-panel > header a { display: flex; align-items: center; justify-content: space-between; gap: 34px; min-width: 188px; padding: 15px 0; color: #fff !important; border-bottom: 1px solid rgba(255,255,255,.45); font-size: 12px; font-weight: 760; }
.rc-note-panel ol { margin: 0; padding: 0; list-style: none; }
.rc-note-panel li > a { display: grid; grid-template-columns: 36px 1fr 24px; gap: 18px; align-items: start; min-height: 114px; padding: 22px 0; color: #fff !important; border-bottom: 1px solid rgba(255,255,255,.13); }
.rc-note-panel li > a > span { padding-top: 4px; color: #66738f; font: 700 10px/1 ui-monospace, monospace; }
.rc-note-panel li small { display: block; color: #8090ad; font-size: 10px; }
.rc-note-panel li small em { display: inline-block; padding: 2px 6px; border: 1px solid transparent; border-radius: 999px; font-style: normal; font-weight: 800; }
.rc-note-panel li small em.rating-benchmark { border-color: rgba(249,115,22,.58); background: rgba(249,115,22,.13); color: #fb923c; }
.rc-note-panel li small em.rating-excellent { border-color: rgba(242,201,76,.62); background: rgba(242,201,76,.14); color: #f2c94c; }
.rc-note-panel li small em.rating-quality { border-color: rgba(94,234,212,.52); background: rgba(94,234,212,.12); color: #5eead4; }
.rc-note-panel li small em.rating-passing { border-color: rgba(96,165,250,.5); background: rgba(96,165,250,.11); color: #7db8ff; }
.rc-note-panel li small em.rating-foundation { border-color: rgba(148,163,184,.46); background: rgba(148,163,184,.1); color: #aab6c7; }
.rc-note-panel li b { display: block; margin-top: 8px; font-size: 16px; line-height: 1.4; }
.rc-note-panel li p { display: -webkit-box; margin: 7px 0 0; overflow: hidden; color: #939eb6; font-size: 12px; line-height: 1.5; -webkit-box-orient: vertical; -webkit-line-clamp: 1; }
.rc-note-panel li i { padding-top: 4px; color: var(--rc-lime); font-style: normal; }
.rc-note-panel-enter-active,
.rc-note-panel-leave-active { transition: opacity .24s ease, transform .24s ease; }
.rc-note-panel-enter-from { opacity: 0; transform: translateX(18px); }
.rc-note-panel-leave-to { opacity: 0; transform: translateX(-18px); }

.rc-ra-log { display: grid; grid-template-columns: 1.15fr .85fr; margin-top: 28px; overflow: hidden; color: #fff; background: radial-gradient(circle at 82% 18%, rgba(88,217,236,.2), transparent 30%), linear-gradient(135deg, #151a43, #30245f 57%, #0c4252); border: 1px solid rgba(255,255,255,.18); }
.rc-ra-log > header { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; min-height: 58px; padding: 0 28px; border-bottom: 1px solid rgba(255,255,255,.2); color: #a9b4d0; font: 700 10px/1 ui-monospace, monospace; }
.rc-ra-log > header span { display: flex; align-items: center; gap: 10px; color: #fff; }
.rc-ra-log__statement { grid-row: span 2; min-height: 380px; padding: 42px; border-right: 1px solid rgba(255,255,255,.18); }
.rc-ra-log__statement small { color: var(--rc-lime); font: 750 10px/1 ui-monospace, monospace; letter-spacing: .08em; }
.rc-ra-log__statement h3 { margin: 52px 0 24px; font-size: 54px; line-height: .96; letter-spacing: -.06em; }
.rc-ra-log__statement h3 span { display: block; white-space: nowrap; }
.rc-ra-log__statement p { max-width: 510px; margin: 0; color: #b2bdd2; font-size: 14px; line-height: 1.7; }
.rc-ra-log dl { margin: 0; padding: 28px 30px 0; }
.rc-ra-log dl > div { display: flex; align-items: center; justify-content: space-between; gap: 22px; padding: 17px 0; border-bottom: 1px solid rgba(255,255,255,.16); }
.rc-ra-log dt { color: #91a0bb; font-size: 11px; }
.rc-ra-log dd { display: flex; align-items: center; gap: 9px; margin: 0; text-align: right; font-size: 11px; font-weight: 750; }
.rc-ra-log dd a { color: #fff !important; }
.rc-ra-log__cta { display: flex; align-items: center; justify-content: space-between; align-self: end; margin: 26px 30px 30px; padding: 16px 18px; color: #0c1430 !important; background: var(--rc-lime); font-size: 12px; font-weight: 820; }
.rc-all-research { display: flex; justify-content: space-between; margin-top: 20px; padding: 18px 0; color: #fff !important; border-bottom: 1px solid rgba(255,255,255,.26); font-size: 12px; font-weight: 750; }
.rc-original-article { display: grid; grid-template-columns: minmax(0, 1fr) minmax(360px, .82fr); gap: 38px; align-items: center; margin-top: 26px; padding: 30px 32px; color: #fff; border: 1px solid rgba(255,255,255,.18); background: linear-gradient(135deg, rgba(78,62,160,.34), rgba(20,112,126,.25)); }
.rc-original-article small { color: var(--rc-lime); font: 760 10px/1 ui-monospace, monospace; letter-spacing: .08em; }
.rc-original-article h3 { margin: 12px 0 0; font-size: 22px; line-height: 1.3; letter-spacing: -.025em; }
.rc-original-article nav { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.rc-original-article a { display: flex; align-items: center; justify-content: space-between; gap: 18px; min-height: 54px; padding: 0 16px; color: #fff !important; border: 1px solid rgba(255,255,255,.25); background: rgba(8,14,28,.35); font-size: 12px; font-weight: 720; }
.rc-original-article a:hover { border-color: var(--rc-lime); background: rgba(88,217,236,.1); }
.rc-original-article a b { color: var(--rc-lime); }

.rc-site-footer { position: relative; overflow: hidden; color: #fff; background: #070c18; }
.rc-site-footer::before { position: absolute; inset: 0; opacity: .13; background-image: linear-gradient(rgba(88,217,236,.28) 1px, transparent 1px), linear-gradient(90deg, rgba(88,217,236,.28) 1px, transparent 1px); background-size: 72px 72px; content: ''; pointer-events: none; }
.rc-site-footer > * { position: relative; }
.rc-site-footer__grid { display: grid; grid-template-columns: 1.45fr repeat(3, 1fr); gap: 52px; padding-block: 72px 58px; }
.rc-site-footer__brand h2 { margin: 26px 0 12px; font-size: 25px; }
.rc-site-footer__brand > p { max-width: 310px; margin: 0; color: #97a4bd; font-size: 13px; line-height: 1.7; }
.rc-product-mark--footer { gap: 14px; }
.rc-product-mark--footer a { width: 40px; height: 40px; }
.rc-product-mark--footer img { width: 38px; height: 38px; }
.rc-site-footer nav { display: flex; flex-direction: column; align-items: flex-start; }
.rc-site-footer nav h3 { margin: 8px 0 24px; font-size: 13px; }
.rc-site-footer nav a,
.rc-site-footer nav > b { margin-bottom: 14px; color: #9eabc2 !important; font-size: 12px; font-weight: 520; }
.rc-site-footer nav a:hover { color: #fff !important; }
.rc-site-footer nav > b { color: #58d9ec !important; }
.rc-site-footer__legal { display: grid; grid-template-columns: minmax(max-content, 1.1fr) minmax(0, 1.5fr); gap: 40px; align-items: start; padding-block: 28px 42px; border-top: 1px solid rgba(255,255,255,.16); }
.rc-site-footer__owner { display: flex; flex-wrap: nowrap; gap: 7px 12px; align-items: baseline; white-space: nowrap; font-size: 11px; }
.rc-site-footer__owner span { color: #fff; font-weight: 700; }
.rc-site-footer__owner a { color: #8794ac !important; }
.rc-site-footer__owner a:hover { color: #fff !important; }
.rc-site-footer__legal p { margin: 0; color: #8794ac; font-size: 11px; line-height: 1.7; }

@media (prefers-reduced-motion: reduce) {
  .rc-note-marquee__track { animation: none; }
  .rc-note-marquee__group:nth-child(2) { display: none; }
  .rc-note-marquee__viewport { overflow-x: auto; }
  .rc-skill-flow__pulse,
  .rc-position-card__live > span i,
  .rc-skill-flow > header span i,
  .rc-skills li.is-active .rc-office-lamp { animation: none; }
}

@media (max-width: 1199px) {
  .rc-shell { width: min(100% - 56px, 940px); }
  .rc-hero { min-height: 768px; }
  .rc-hero__layout { grid-template-columns: minmax(340px, .9fr) minmax(450px, 1.1fr); gap: 30px; padding-top: 64px; }
  .rc-hero__title { font-size: 62px; }
  .rc-home:not(.is-zh) .rc-hero__layout { grid-template-columns: minmax(340px, .9fr) minmax(450px, 1.1fr); gap: 30px; }
  .rc-home:not(.is-zh) .rc-hero__title { font-size: 56px; }
  .rc-hero__lead { max-width: 560px; font-size: 15px; }
  .rc-ledger { min-height: 418px; padding: 22px; box-shadow: 12px 12px 0 var(--rc-ink); }
  .rc-ledger__release strong { font-size: 60px; }
  .rc-hero__index { margin-top: 64px; }
  .rc-hero__index div { grid-template-columns: 22px auto; gap: 8px; padding-inline: 12px; }
  .rc-hero__index small { grid-column: 2; padding-bottom: 12px; }
  .rc-section { padding: 94px 0; }
  .rc-section__intro { grid-template-columns: minmax(0, 1.25fr) minmax(260px, .75fr); gap: 45px; }
  .rc-section__title { font-size: 57px; }
  .rc-publication { grid-template-rows: 210px 1fr; min-height: 505px; }
  .rc-publication__art b { font-size: 62px; }
  .rc-publication__body { padding: 22px; }
  .rc-publication__body h3 { font-size: 25px; }
  .rc-engine__grid { grid-template-columns: .78fr 1.22fr; }
  .rc-governance-note { grid-template-columns: .45fr 1fr 1.45fr; }
  .rc-position-card { min-height: 450px; }
  .rc-position-card__mark { font-size: 105px; }
  .rc-skills { gap-inline: 42px; }
  .rc-skills button { grid-template-columns: 54px minmax(0, 1fr); gap: 10px; padding: 8px; }
  .rc-office-sign { width: 54px; height: 46px; }
  .rc-office-door { padding-left: 8px; }
  .rc-skill-copy small { font-size: 9.5px; }
  .rc-skill-copy b { font-size: 15px; }
  .rc-program { min-height: 310px; }
  .rc-program__cover { padding: 20px; }
  .rc-program__body { padding: 25px; }
  .rc-program__body h3 { font-size: 29px; }
  .rc-program__cover img { width: 94px; height: 94px; }
  .rc-note-marquee__group a { grid-template-columns: 74px 80px minmax(240px, 350px) 18px; }
  .rc-note-tabs button { grid-template-columns: 22px 1fr auto; padding-inline: 16px; }
  .rc-note-tabs b { font-size: 13px; }
  .rc-note-panel { padding: 28px; }
  .rc-note-panel > header h3 { font-size: 36px; }
  .rc-ra-log__statement { padding: 34px; }
  .rc-ra-log__statement h3 { font-size: 46px; }
  .rc-site-footer__grid { grid-template-columns: 1.35fr repeat(3, 1fr); gap: 30px; }
}

@media (max-width: 699px) {
  :global(.portal-v5-page .VPNavBar) { background: rgba(244, 241, 232, .97); }
  :global(.dark .portal-v5-page .VPNavBar) { background: rgba(8, 11, 22, .97); }
  :global(.portal-v5-page .VPNavBarTitle .title) { font-size: 15px; letter-spacing: -.065em; transform: none; }
  :global(.portal-v5-page .VPNavBarTitle .title::after) { display: none; }
  .rc-shell { width: calc(100% - 34px); }
  .rc-hero { min-height: auto; }
  .rc-hero::before { top: 75px; right: -10px; font-size: 92px; }
  .rc-product-mark { gap: 9px; }
  .rc-product-mark img { width: 30px; height: 30px; }
  .rc-product-mark a { width: 32px; height: 32px; }
  .rc-controls { top: 66px; right: 12px; min-height: 38px; padding: 3px; }
  .rc-language { grid-template-columns: repeat(2, minmax(38px, auto)); padding-right: 3px; font-size: 12px; }
  .rc-language strong,
  .rc-language a { min-height: 30px; padding-inline: 8px; }
  .rc-appearance { min-height: 30px; padding-inline: 9px; font-size: 12px; }
  .rc-hero__layout { display: block; padding-top: 54px; }
  .rc-kicker { margin-bottom: 17px; font-size: 11px; line-height: 1.4; letter-spacing: .015em; }
  .rc-kicker span { width: 20px; }
  .rc-hero__title { font-size: 49px; line-height: .91; letter-spacing: -.062em; }
  .rc-home:not(.is-zh) .rc-hero__title { font-size: 40px; line-height: .93; letter-spacing: -.052em; }
  .rc-hero__lead { margin-top: 26px; font-size: 14px; line-height: 1.7; }
  .rc-actions { display: grid; grid-template-columns: 1fr; margin-top: 28px; }
  .rc-button { width: 100%; min-height: 47px; }
  .rc-text-link { width: max-content; margin: 8px 0 0; }
  .rc-ledger { display: none; }
  .rc-hero-video { margin-top: 34px; border-radius: 17px; box-shadow: 0 24px 60px rgba(0,0,0,.38), 7px 7px 0 rgba(7,12,27,.72); }
  .rc-hero-video::after { inset: 6px; border-radius: 12px; }
  .rc-hero-video__top { top: 15px; right: 16px; left: 16px; }
  .rc-hero-video__top i { font-size: 8px; }
  .rc-hero-video__play { width: 54px; height: 54px; border-width: 5px; font-size: 17px; }
  .rc-hero-video__caption { right: 16px; bottom: 17px; left: 16px; gap: 3px; padding-right: 0; }
  .rc-hero-video__caption strong { font-size: 13px; }
  .rc-hero-video__caption small { display: none; }
  .rc-hero-video__url { display: none; }
  .rc-video-modal { padding: 12px; }
  .rc-video-modal__panel { padding: 8px; border-radius: 17px; }
  .rc-video-modal__panel > header { padding: 4px 2px 10px 6px; }
  .rc-video-modal__panel > header div { display: block; }
  .rc-video-modal__panel > header strong { display: block; margin-top: 5px; font-size: 11px; }
  .rc-video-modal__panel > header button { width: 34px; height: 34px; }
  .rc-video-modal__panel > video { border-radius: 10px; }
  .rc-video-modal__panel > footer { align-items: flex-start; flex-direction: column; gap: 9px; padding: 12px 5px 4px; }
  .rc-mobile-ledger { display: grid; grid-template-columns: auto 1fr; gap: 9px 12px; align-items: center; margin-top: 40px; padding: 17px; color: #fff; background: linear-gradient(145deg, #171d3d, #102c43); box-shadow: 8px 8px 0 rgba(0,0,0,.34); }
  .rc-mobile-ledger span { display: flex; align-items: center; gap: 7px; font: 700 10px/1 ui-sans-serif, system-ui, sans-serif; }
  .rc-mobile-ledger b { text-align: right; font-size: 13px; }
  .rc-mobile-ledger small { grid-column: 1 / -1; padding-top: 10px; border-top: 1px solid rgba(255,255,255,.35); font: 720 11px/1.4 "Noto Sans SC", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif; letter-spacing: .01em; }
  .rc-hero__index { grid-template-columns: 1fr 1fr; margin-top: 52px; }
  .rc-hero__index div { min-height: 68px; border-bottom: 1px solid var(--rc-line); }
  .rc-hero__index div:nth-child(2) { border-right: 0; }
  .rc-hero__index div:nth-child(n+3) { border-bottom: 0; }
  .rc-hero__index div:nth-child(3) { padding-left: 0; }
  .rc-hero__index b { font-size: 17px; }
  .rc-hero__index small { font-size: 9px; }
  .rc-section { padding: 76px 0; }
  .rc-section__intro { display: block; }
  .rc-section__intro > p { margin-top: 27px; font-size: 13px; }
  .rc-section__title { font-size: 41px; line-height: .98; }
  .rc-tmpa__archive { display: block; margin-top: 30px; }
  .rc-doi-badge { min-width: 0; padding: 15px 16px; }
  .rc-doi-badge strong { font-size: 12px; }
  .rc-tmpa__archive-meta { display: block; padding: 15px 16px; }
  .rc-tmpa__archive-meta nav { margin-top: 12px; }
  .rc-tmpa__archive-meta a { flex: 1; text-align: center; }
  .rc-tmpa__archive + .rc-publications { margin-top: 24px; }
  .rc-publications { grid-template-columns: 1fr; gap: 13px; margin-top: 44px; }
  .rc-publication { grid-template-columns: 112px 1fr; grid-template-rows: 1fr; min-height: 250px; }
  .rc-publication__art { padding: 16px; }
  .rc-publication__art span { font-size: 9px; writing-mode: vertical-rl; }
  .rc-publication__art b { font-size: 35px; }
  .rc-publication__body { padding: 20px; }
  .rc-publication__body h3 { margin-top: 28px; font-size: 23px; }
  .rc-publication__body h3 span { white-space: nowrap; }
  .rc-publication__body > b { font-size: 10px; }
  .rc-engine__grid { grid-template-columns: 1fr; margin-top: 44px; }
  .rc-governance-note { grid-template-columns: 1fr; gap: 10px; padding: 22px; }
  .rc-position-card { min-height: 405px; }
  .rc-position-card__mark { margin-top: 62px; font-size: 98px; }
  .rc-skill-flow { min-height: 0; }
  .rc-skill-flow__map { padding: 13px; }
  .rc-skill-flow__map > svg,
  .rc-work-pass { display: none; }
  .rc-skills { grid-template-columns: 1fr; grid-template-rows: none; gap: 14px; height: auto; padding-left: 14px; background: linear-gradient(#58d9ec, #58d9ec) 3px 38px / 2px calc(100% - 76px) no-repeat; }
  .rc-skills li,
  .rc-skills li:nth-child(n) { grid-column: auto; grid-row: auto; min-height: 88px; }
  .rc-skills button { grid-template-columns: 68px minmax(0, 1fr); gap: 13px; min-height: 88px; padding: 10px 12px; }
  .rc-office-sign { width: 68px; height: 56px; }
  .rc-office-lamp { left: 16px; width: 64px; }
  .rc-skill-copy small { font-size: 10px; }
  .rc-skill-copy b { font-size: 16px; }
  .rc-skills li::before { position: absolute; top: 50%; left: -14px; z-index: 2; width: 8px; height: 8px; background: #dfe4ec; border: 2px solid #58d9ec; border-radius: 50%; content: ''; transform: translateY(-50%); }
  .rc-skills li.is-active::before { width: 12px; height: 12px; background: #58d9ec; box-shadow: 0 0 0 5px rgba(88,217,236,.18); }
  :global(.dark .rc-skills li::before) { background: #111722; }
  :global(.dark .rc-skills li.is-active::before) { background: #62deed; }
  .rc-programs { grid-template-columns: 1fr; gap: 13px; margin-top: 44px; }
  .rc-program { grid-template-columns: 112px 1fr; min-height: 240px; border-radius: 20px; }
  .rc-program__cover { padding: 15px; }
  .rc-program__cover > span { align-self: flex-start; font-size: 9px; line-height: 1.2; writing-mode: vertical-rl; }
  .rc-program__cover > b { font-size: 9px; }
  .rc-program__cover > strong { font-size: 47px; }
  .rc-program__cover img { width: 67px; height: 67px; }
  .rc-program__body { padding: 19px; }
  .rc-program__body small { font-size: 10px; }
  .rc-program__body h3 { margin: 20px 0 10px; font-size: 24px; }
  .rc-program__body p { font-size: 10.5px; line-height: 1.58; }
  .rc-program__body > b { padding-top: 14px; font-size: 10px; }
  .rc-program__workforce { gap: 5px; height: 72px; }
  .rc-program__workforce i { width: 20px; border-radius: 12px 12px 5px 5px; }
  .rc-program__workforce i:nth-child(1),
  .rc-program__workforce i:nth-child(3) { height: 40px; }
  .rc-program__workforce i:nth-child(2) { height: 63px; }
  .rc-note-marquee { margin-top: 44px; }
  .rc-note-marquee__group a { grid-template-columns: 66px minmax(210px, 270px) 18px; min-height: 68px; padding: 0 15px; }
  .rc-note-marquee__group a > span { display: none; }
  .rc-note-tabs { grid-template-columns: 1fr; }
  .rc-note-tabs button { min-height: 60px; padding: 0 16px; border-right: 0; border-bottom: 1px solid rgba(255,255,255,.14); }
  .rc-note-tabs button:last-child { border-bottom: 0; }
  .rc-note-panel { min-height: 0; padding: 20px; }
  .rc-note-panel > header { grid-template-columns: 1fr; gap: 18px; padding-bottom: 20px; }
  .rc-note-panel > header h3 { font-size: 31px; }
  .rc-note-panel > header a { width: 100%; min-width: 0; }
  .rc-note-panel li > a { grid-template-columns: 28px 1fr 18px; gap: 10px; min-height: 108px; padding: 18px 0; }
  .rc-note-panel li b { font-size: 14px; }
  .rc-note-panel li p { -webkit-line-clamp: 2; }
  .rc-ra-log { grid-template-columns: 1fr; }
  .rc-ra-log > header { padding: 0 18px; }
  .rc-ra-log > header > b { display: none; }
  .rc-ra-log__statement { grid-row: auto; min-height: 320px; padding: 28px 22px; border-right: 0; border-bottom: 1px solid rgba(255,255,255,.18); }
  .rc-ra-log__statement h3 { margin-top: 38px; font-size: 42px; }
  .rc-ra-log dl { padding: 20px 20px 0; }
  .rc-ra-log__cta { margin: 20px; }
  .rc-original-article { grid-template-columns: 1fr; gap: 22px; padding: 24px 20px; }
  .rc-original-article h3 { font-size: 19px; }
  .rc-original-article nav { grid-template-columns: 1fr; }
  .rc-site-footer__grid { grid-template-columns: 1fr 1fr; gap: 38px 22px; padding-block: 56px 44px; }
  .rc-site-footer__brand { grid-column: 1 / -1; }
  .rc-site-footer nav:last-child { grid-column: 1 / -1; }
  .rc-site-footer__legal { grid-template-columns: 1fr; gap: 14px; }
}

/* The research section ends with its own navigation rule; no spacer row before the footer. */
.rc-research { padding-bottom: 0; }

@media (max-width: 699px) {
  .rc-site-footer__owner { flex-wrap: wrap; white-space: normal; }
  .rc-codeflow-video__frame { margin-top: 38px; padding: 7px; border-radius: 18px; }
  .rc-codeflow-video__frame video { border-radius: 12px; }
  .rc-codeflow-video__meta { align-items: flex-start; flex-direction: column; }
  .rc-codeflow-video__meta nav { flex-wrap: wrap; }
}
</style>
