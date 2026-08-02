<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import PortalHome from './PortalHome.vue'
import RuntimeCenter from './RuntimeCenter.vue'

const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })
const zh = computed(() => props.lang === 'zh')

const copy = computed(() => zh.value ? {
  switcher: 'EN',
  eyebrow: 'TMPA · 受治理的 AI 原生组织工作',
  title: '构建真正工作的',
  accent: '数字员工。',
  lead: 'joinwell52 Research Center 是一个开放研究与工程中心。我们研究 TMPA，持续发布研究笔记，并探索如何用文本驱动的方法，把 ChatGPT 等通用 AI 组织成有岗位、有技能、有流程、有记录、可治理的数字员工。',
  primary: '阅读 TMPA 论文', secondary: '浏览研究笔记', source: '查看开源仓库',
  thesis: '最终目标', thesisValue: '数字员工生产机',
  thesisNote: '不是再做一个聊天机器人，而是形成一套可复用的方法，用自然语言文本定义岗位、技能、工具、流程、权限和工作记录。AI 能理解，人也能理解。',
  theoryKicker: '理论基础', theoryTitle: 'TMPA 研究 AI 如何完成真实的组织工作',
  theoryLead: 'TMPA（Textual Multi-Agent Process Architecture）是一套面向受治理 AI 原生组织工作的架构理论与文本规范。它强调工作落地成文、组织先于编排、职责分离、相互约束，以及从持久证据中重建组织状态。',
  papers: [
    ['主论文 A0.4', 'TMPA Architecture Paper', '理论、研究问题、架构与证据边界'],
    ['核心规范 S0.3', 'TMPA Core Specification', '对象、角色、生命周期、重建与一致性要求'],
    ['实现案例 I0.3', 'Implementation Case', 'FCoP、CodeFlowMu 与小典 AI 的工程证据']
  ],
  factoryKicker: '工程方向', factoryTitle: '数字员工生产机',
  factoryLead: '我们的最终努力，是把通用 AI 转换为能够承担真实岗位工作的数字员工。底层模型提供通用智能；我们提供岗位定义、Skills、工具边界、工作流程、治理规则、运行调度、持久记录和发布验证。',
  formula: ['通用 AI', '岗位与职责', 'Skills 与工具', '文本工作流', '治理与记录', '数字员工'],
  appsKicker: '真实应用', appsTitle: '从三个工作场景验证这条路线',
  apps: [
    ['研究笔记生产机', 'Research Analyst（RA）', '目前基于 ChatGPT 的文本驱动应用。RA 按研究操作系统持续发现资料、阅读、分析、形成知识并发布研究笔记。', '查看研究笔记'],
    ['CodeFlowMu', 'PM · DEV · QA · OPS', '一个四人数字软件开发团队。它把岗位分工、Skills、工具、任务、审查、恢复和工程运行结合起来。', '查看 CodeFlowMu'],
    ['小典 AI', '业务数据分析师', '面向真实业务数据查询的数字员工，通过自然语言理解、SQL 生成、策略校验、执行和审计完成工作。', '查看案例']
  ],
  textKicker: '核心方法', textTitle: '文本驱动，而不是复杂流程编程',
  textLead: '研究笔记生产机当前没有复杂的软件工作流引擎。岗位说明、研究 Skills、研究队列、工作步骤、发布标准和运行记录都写成可读文本。ChatGPT 直接理解这些文本并执行，人也可以直接检查和修改。',
  textCards: [
    ['工作流就是文本', '不依赖 BPMN、专用 DSL 或大量流程代码。自然语言本身就是 AI 的原生工作界面。'],
    ['工作也落地成文', '任务、分析、知识、研究笔记、提交验证和运行记录都离开临时对话，成为持久对象。'],
    ['AI 与人共享同一界面', '同一份文本同时可被 AI 执行、被人阅读、被程序校验、被 GitHub 保存与审计。']
  ],
  notesKicker: '持续研究', notesTitle: '三个研究方向，三种发布节奏',
  notesLead: '研究中心持续研究数字员工、行业架构和开源工程，并通过每日研究、每周综合和学术观察持续更新。研究笔记由 RA 参与生产，公开记录其来源、过程和发布结果。',
  directions: ['数字员工', '行业架构', '开源工程'], rhythms: ['每日研究', '每周综合', '学术观察'],
  openKicker: '开放工程', openTitle: '这个仓库开源了什么？',
  openLead: '我们没有开源 ChatGPT 或底层大模型。开源的是把通用 AI 工程化为数字员工的方法、规范、流程、研究成果和网站实现。',
  openItems: [
    ['TMPA 研究成果', '主论文、核心规范、实现案例、版本记录与引用信息'],
    ['研究笔记', '数字员工、行业架构、开源工程的每日、每周与学术内容'],
    ['数字员工方法', '岗位、Skills、文本工作流、Research OS、Queue 与发布标准'],
    ['运行基础设施', 'Runtime Scheduler、Runtime Record、发布门禁、时间线与验证脚本'],
    ['网站源代码', 'VitePress 双语网站、索引、组件、样式与 GitHub Pages 工作流'],
    ['工程证据', 'FCoP、CodeFlowMu、小典 AI 的公开实现、案例和可审查记录']
  ],
  runtimeKicker: '透明运行', runtimeTitle: '运行中心记录 RA 做过的工作',
  runtimeLead: 'Runtime 不是研究中心的主角，而是数字员工的运行基础设施。它负责调度工作、生成记录、关联 GitHub 提交并验证正式发布，让读者看到 RA 在什么时候做了什么、产生了什么结果。'
} : {
  switcher: '中文',
  eyebrow: 'TMPA · GOVERNED AI-NATIVE ORGANIZATIONAL WORK',
  title: 'Building Digital', accent: 'Employees.',
  lead: 'joinwell52 Research Center is an open research and engineering center. We study TMPA, publish continuing research notes, and explore how text-driven methods can organize general AI such as ChatGPT into governed workers with roles, skills, processes, records, and durable responsibility.',
  primary: 'Read TMPA Paper', secondary: 'Browse Research Notes', source: 'View Open Source',
  thesis: 'Long-term direction', thesisValue: 'Digital Employee Factory',
  thesisNote: 'Not another chatbot, but a reusable method for defining roles, skills, tools, workflows, authority, and work records in natural-language text that both AI and people can understand.',
  theoryKicker: 'THEORY', theoryTitle: 'TMPA studies how AI performs real organizational work',
  theoryLead: 'TMPA (Textual Multi-Agent Process Architecture) is an architecture theory and textual specification for governed AI-native organizational work. It centers work-becomes-text, organization before orchestration, separation of responsibility, mutual constraint, and reconstruction from durable evidence.',
  papers: [
    ['Main Paper A0.4', 'TMPA Architecture Paper', 'Theory, research questions, architecture, and evidence boundaries'],
    ['Core Specification S0.3', 'TMPA Core Specification', 'Objects, roles, lifecycle, reconstruction, and conformance'],
    ['Implementation Case I0.3', 'Implementation Case', 'Engineering evidence from FCoP, CodeFlowMu, and XiaoDian AI']
  ],
  factoryKicker: 'ENGINEERING DIRECTION', factoryTitle: 'Digital Employee Factory',
  factoryLead: 'Our long-term effort is to turn general AI into digital workers that can hold real organizational roles. The model supplies general intelligence; we supply role definition, Skills, tool boundaries, textual workflows, governance, scheduling, durable records, and publication verification.',
  formula: ['General AI', 'Role & Duty', 'Skills & Tools', 'Text Workflow', 'Governance & Record', 'Digital Employee'],
  appsKicker: 'WORKING APPLICATIONS', appsTitle: 'Three work settings test the same direction',
  apps: [
    ['Research Note Factory', 'Research Analyst (RA)', 'A text-driven application currently implemented through ChatGPT. RA discovers, reads, analyzes, builds knowledge, and publishes research notes through the Research Operating System.', 'Browse notes'],
    ['CodeFlowMu', 'PM · DEV · QA · OPS', 'A four-role digital software development team combining role separation, Skills, tools, tasks, review, recovery, and engineering runtime.', 'View CodeFlowMu'],
    ['XiaoDian AI', 'Business Data Analyst', 'A digital worker for real business data queries using language understanding, SQL generation, policy checks, execution, and audit.', 'View case']
  ],
  textKicker: 'CORE METHOD', textTitle: 'Text-driven, not workflow-programming heavy',
  textLead: 'The current Research Note Factory does not depend on a complex workflow engine. Role descriptions, Research Skills, queues, steps, publication standards, and work records are written as readable text. ChatGPT can execute that text, while people can inspect and change it directly.',
  textCards: [
    ['The workflow is text', 'No mandatory BPMN, proprietary DSL, or large workflow codebase. Natural language is the native work interface of AI.'],
    ['The work becomes text', 'Tasks, analysis, knowledge, notes, commit verification, and runtime records leave transient sessions and become durable objects.'],
    ['One interface for AI and people', 'The same text can be executed by AI, read by people, validated by programs, and preserved and audited through GitHub.']
  ],
  notesKicker: 'CONTINUING RESEARCH', notesTitle: 'Three research directions, three publication rhythms',
  notesLead: 'The center studies Digital Employees, Industry Architecture, and Open-source Engineering through Daily Research, Weekly Synthesis, and Academic Observation. RA participates in producing these notes with visible sources, process, and publication records.',
  directions: ['Digital Employees', 'Industry Architecture', 'Open-source Engineering'], rhythms: ['Daily Research', 'Weekly Synthesis', 'Academic Observation'],
  openKicker: 'OPEN ENGINEERING', openTitle: 'What is open-sourced?',
  openLead: 'We do not open-source ChatGPT or the underlying foundation model. We open-source the methods, specifications, workflows, research outputs, runtime infrastructure, and website used to engineer general AI into digital employees.',
  openItems: [
    ['TMPA research', 'Architecture paper, Core specification, implementation case, versions, and citation metadata'],
    ['Research notes', 'Daily, weekly, and academic work across three research directions'],
    ['Digital employee method', 'Roles, Skills, textual workflows, Research OS, Queue, and publication standards'],
    ['Runtime infrastructure', 'Scheduler, Runtime Records, publication gate, timeline, and validation scripts'],
    ['Website source', 'Bilingual VitePress site, indexes, components, styles, and GitHub Pages workflows'],
    ['Engineering evidence', 'Inspectable implementations, cases, and records from FCoP, CodeFlowMu, and XiaoDian AI']
  ],
  runtimeKicker: 'OBSERVABLE OPERATION', runtimeTitle: 'The Runtime Center records the work performed by RA',
  runtimeLead: 'Runtime is infrastructure, not the center’s primary identity. It schedules work, produces records, links GitHub commits, and verifies official publication so readers can inspect what RA did, when it happened, and what it produced.'
})

const languagePath = computed(() => zh.value ? '/' : '/zh/')
const paths = computed(() => ({
  paper: zh.value ? '/zh/publications/tmpa-architecture-paper-a0.4' : '/en/publications/tmpa-architecture-paper-a0.4',
  notes: zh.value ? '/zh/research-notes/' : '/en/research-notes/',
  publications: zh.value ? '/zh/publications/' : '/en/publications/',
  runtime: zh.value ? '/zh/runtime/' : '/en/runtime/'
}))
</script>

<template>
  <div class="home-v4">
    <section class="hero dark-section">
      <div class="shell hero-grid">
        <div class="hero-copy">
          <nav class="language"><strong>{{ zh ? '中文' : 'EN' }}</strong><span>/</span><a :href="withBase(languagePath)">{{ copy.switcher }}</a></nav>
          <span class="kicker">{{ copy.eyebrow }}</span>
          <h1>{{ copy.title }}<br><em>{{ copy.accent }}</em></h1>
          <p>{{ copy.lead }}</p>
          <div class="buttons">
            <a class="primary" :href="withBase(paths.paper)">{{ copy.primary }} ↗</a>
            <a :href="withBase(paths.notes)">{{ copy.secondary }} →</a>
            <a href="https://github.com/joinwell52-AI/joinwell52">{{ copy.source }} ↗</a>
          </div>
        </div>
        <aside class="thesis-card">
          <small>{{ copy.thesis }}</small>
          <strong>{{ copy.thesisValue }}</strong>
          <p>{{ copy.thesisNote }}</p>
          <div class="factory-flow"><span>AI</span><i>+</i><span>TEXT</span><i>+</i><span>ORGANIZATION</span><b>→</b><em>DIGITAL EMPLOYEE</em></div>
        </aside>
      </div>
    </section>

    <section class="section light-section">
      <div class="shell">
        <span class="section-kicker">{{ copy.theoryKicker }}</span>
        <div class="section-head"><h2>{{ copy.theoryTitle }}</h2><p>{{ copy.theoryLead }}</p></div>
        <div class="paper-grid">
          <a v-for="(paper, index) in copy.papers" :key="paper[0]" :href="withBase(index === 0 ? paths.paper : paths.publications)">
            <small>0{{ index + 1 }}</small><h3>{{ paper[0] }}</h3><strong>{{ paper[1] }}</strong><p>{{ paper[2] }}</p><b>→</b>
          </a>
        </div>
      </div>
    </section>

    <section class="section dark-section">
      <div class="shell">
        <span class="section-kicker">{{ copy.factoryKicker }}</span>
        <div class="section-head"><h2>{{ copy.factoryTitle }}</h2><p>{{ copy.factoryLead }}</p></div>
        <div class="formula">
          <template v-for="(item, index) in copy.formula" :key="item"><span>{{ item }}</span><i v-if="index < copy.formula.length - 1">→</i></template>
        </div>
      </div>
    </section>

    <section class="section light-section">
      <div class="shell">
        <span class="section-kicker">{{ copy.appsKicker }}</span>
        <div class="section-head"><h2>{{ copy.appsTitle }}</h2></div>
        <div class="app-grid">
          <article v-for="(app, index) in copy.apps" :key="app[0]">
            <small>0{{ index + 1 }}</small><h3>{{ app[0] }}</h3><strong>{{ app[1] }}</strong><p>{{ app[2] }}</p>
            <a v-if="index === 0" :href="withBase(paths.notes)">{{ app[3] }} →</a>
            <a v-else-if="index === 1" href="https://github.com/joinwell52-AI/CodeFlowMu-open">{{ app[3] }} ↗</a>
            <a v-else href="https://demo.chedian.cc/">{{ app[3] }} ↗</a>
          </article>
        </div>
      </div>
    </section>

    <section class="section text-section dark-section">
      <div class="shell text-layout">
        <div><span class="section-kicker">{{ copy.textKicker }}</span><h2>{{ copy.textTitle }}</h2><p>{{ copy.textLead }}</p></div>
        <div class="text-cards"><article v-for="card in copy.textCards" :key="card[0]"><h3>{{ card[0] }}</h3><p>{{ card[1] }}</p></article></div>
      </div>
    </section>

    <section class="section light-section notes-intro">
      <div class="shell">
        <span class="section-kicker">{{ copy.notesKicker }}</span>
        <div class="section-head"><h2>{{ copy.notesTitle }}</h2><p>{{ copy.notesLead }}</p></div>
        <div class="taxonomies"><div><span v-for="item in copy.directions" :key="item">{{ item }}</span></div><b>×</b><div><span v-for="item in copy.rhythms" :key="item">{{ item }}</span></div></div>
      </div>
    </section>

    <div class="existing"><PortalHome :lang="props.lang" /></div>

    <section class="section open-section light-section">
      <div class="shell">
        <span class="section-kicker">{{ copy.openKicker }}</span>
        <div class="section-head"><h2>{{ copy.openTitle }}</h2><p>{{ copy.openLead }}</p></div>
        <div class="open-grid"><article v-for="(item, index) in copy.openItems" :key="item[0]"><small>0{{ index + 1 }}</small><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p></article></div>
      </div>
    </section>

    <section class="runtime-intro dark-section"><div class="shell"><span class="section-kicker">{{ copy.runtimeKicker }}</span><div class="section-head"><h2>{{ copy.runtimeTitle }}</h2><p>{{ copy.runtimeLead }}</p></div><a class="runtime-link" :href="withBase(paths.runtime)">{{ zh ? '进入研究运行中心' : 'Open Runtime Center' }} →</a></div></section>
    <RuntimeCenter :lang="props.lang" compact />
  </div>
</template>

<style scoped>
.home-v4{--ink:#111322;--muted:#647087;--violet:#7868ff;--dark:#070a16;--line:rgba(24,31,54,.13);overflow:hidden}.shell{width:min(1220px,calc(100% - 48px));margin:auto}.dark-section{color:#f7f8ff;background:#070a16}.light-section{color:var(--ink);background:#f7f8fc}.hero{background:radial-gradient(circle at 80% 20%,rgba(113,92,255,.34),transparent 36%),linear-gradient(rgba(139,124,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(139,124,255,.055) 1px,transparent 1px),#070a16;background-size:auto,54px 54px,54px 54px}.hero-grid{display:grid;grid-template-columns:minmax(0,1.12fr) minmax(380px,.88fr);gap:70px;align-items:center;min-height:735px;padding:88px 0 70px}.language{display:flex;gap:9px;margin-bottom:32px;color:#8794aa;font:700 12px/1 ui-monospace,monospace}.language strong{color:#fff}.language a{color:#9aa6bd;text-decoration:none}.kicker,.section-kicker{display:block;color:#bcb4ff;font:700 11px/1.2 ui-monospace,monospace;letter-spacing:.15em;text-transform:uppercase}.hero h1{margin:20px 0 0;font-size:clamp(58px,7vw,98px);line-height:.94;letter-spacing:-.06em}.hero h1 em{color:#8d7fff;font-style:normal}.hero-copy>p{max-width:760px;margin:28px 0 0;color:#b9c2d3;font-size:18px;line-height:1.75}.buttons{display:flex;flex-wrap:wrap;gap:12px;margin-top:34px}.buttons a,.runtime-link{padding:13px 17px;color:#dcd8ff;border:1px solid rgba(139,124,255,.34);border-radius:10px;font-weight:750;text-decoration:none}.buttons .primary{color:#090c18;background:#8b7cff;border-color:#8b7cff}.thesis-card{padding:30px;background:linear-gradient(145deg,rgba(22,29,55,.96),rgba(10,14,30,.95));border:1px solid rgba(148,163,184,.2);border-radius:24px;box-shadow:0 35px 110px rgba(0,0,0,.38)}.thesis-card small{color:#8f9bb0;font:700 10px/1 ui-monospace,monospace;letter-spacing:.13em;text-transform:uppercase}.thesis-card>strong{display:block;margin-top:15px;color:#f6f7ff;font-size:34px;line-height:1.08}.thesis-card>p{margin:18px 0 26px;color:#aeb8cb;line-height:1.7}.factory-flow{display:grid;grid-template-columns:1fr auto 1fr auto 1.2fr;gap:8px;align-items:center}.factory-flow span,.factory-flow em{padding:11px 7px;border:1px solid rgba(139,124,255,.25);border-radius:9px;color:#bfc7d8;background:rgba(8,12,27,.75);font:700 9px/1.2 ui-monospace,monospace;text-align:center}.factory-flow em{grid-column:1/-1;color:#83e6ba;border-color:rgba(94,224,174,.28);font-style:normal}.factory-flow i,.factory-flow b{color:#8b7cff;text-align:center}.section{padding:92px 0}.section-kicker{color:#7768df}.section-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(360px,.72fr);gap:70px;align-items:end;margin-top:17px}.section-head h2,.text-layout h2{margin:0;font-size:clamp(38px,5vw,66px);line-height:1.02;letter-spacing:-.05em}.section-head p,.text-layout>div>p{margin:0;color:var(--muted);font-size:16px;line-height:1.75}.dark-section .section-head p,.dark-section .text-layout>div>p{color:#aeb8cb}.paper-grid,.app-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:42px}.paper-grid a,.app-grid article,.open-grid article{position:relative;padding:25px;border:1px solid var(--line);border-radius:18px;background:#fff;text-decoration:none}.paper-grid small,.app-grid small,.open-grid small{color:#7868ff;font:700 11px/1 ui-monospace,monospace}.paper-grid h3,.app-grid h3,.open-grid h3{margin:20px 0 8px;color:var(--ink);font-size:21px}.paper-grid strong,.app-grid strong{color:#5d6680;font-size:12px}.paper-grid p,.app-grid p,.open-grid p{color:#6d778d;line-height:1.6}.paper-grid b{position:absolute;right:24px;bottom:22px;color:#7868ff}.formula{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-top:46px}.formula span{padding:15px 18px;border:1px solid rgba(139,124,255,.25);border-radius:12px;background:rgba(255,255,255,.045);color:#d9dcf0;font-weight:750}.formula i{color:#8b7cff}.app-grid article a{display:inline-block;margin-top:10px;color:#6958df;font-weight:750;text-decoration:none}.text-section{background:radial-gradient(circle at 15% 20%,rgba(69,190,173,.14),transparent 30%),#070a16}.text-layout{display:grid;grid-template-columns:.85fr 1.15fr;gap:80px}.text-cards{display:grid;gap:12px}.text-cards article{padding:24px;border:1px solid rgba(148,163,184,.16);border-radius:16px;background:rgba(255,255,255,.04)}.text-cards h3{margin:0;color:#f3f5ff}.text-cards p{margin:9px 0 0;color:#9eabc0;line-height:1.65}.taxonomies{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:25px;margin-top:42px}.taxonomies>div{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.taxonomies span{padding:16px;border:1px solid var(--line);border-radius:12px;background:#fff;text-align:center;font-weight:750}.taxonomies b{color:#7868ff;font-size:24px}.existing :deep(.rcv5-hero),.existing :deep(.rcv5-dashboard),.existing :deep(.rcv5-os-section){display:none!important}.existing :deep(.rcv5-shell){padding-top:30px}.open-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:40px}.runtime-intro{padding:90px 0 36px}.runtime-intro .section-head{margin-bottom:30px}.runtime-link{display:inline-block}
@media(max-width:980px){.hero-grid,.section-head,.text-layout{grid-template-columns:1fr}.hero-grid{gap:48px}.paper-grid,.app-grid,.open-grid{grid-template-columns:1fr 1fr}.section-head{gap:18px}.taxonomies{grid-template-columns:1fr}.taxonomies b{display:none}}
@media(max-width:640px){.shell{width:calc(100% - 36px)}.hero-grid{padding:58px 0}.hero h1{font-size:52px}.hero-copy>p{font-size:15px}.section{padding:68px 0}.paper-grid,.app-grid,.open-grid{grid-template-columns:1fr}.factory-flow{grid-template-columns:1fr}.factory-flow i,.factory-flow b{transform:rotate(90deg)}.taxonomies>div{grid-template-columns:1fr}.section-head h2,.text-layout h2{font-size:39px}}
</style>
