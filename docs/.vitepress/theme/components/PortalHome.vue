<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })
const zh = computed(() => props.lang === 'zh')

const t = computed(() => zh.value ? {
  languageCurrent: '中文', languageOther: 'EN', languageLink: '/',
  eyebrow: '独立 · 工程驱动的 AI 研究',
  title1: '建设可治理的', title2: 'AI 工作系统。',
  intro: '研究 AI 工作数据、正式协作、数字员工与可落地多 Agent 系统；以 FCoP 和 CodeFlowMu 的真实工程证据为基础。',
  explore: '进入研究中心', publications: '阅读出版物',
  programsKicker: '01 / 研究计划', programsTitle: '官方研究计划', programsLead: '一个门户连接理论、协议、运行工程与最终应用方向。',
  hierarchyKicker: '02 / 研究地图', hierarchyTitle: '清晰的研究层级', hierarchyLead: '研究节奏、研究领域与成熟出版物保持分层，不再混在同一目录。',
  latestKicker: '03 / 最新研究', latestTitle: '最新研究', latestLead: '围绕数字劳动力控制面、Runtime 运行与治理架构的当前工作。',
  pubKicker: '04 / 出版中心', pubTitle: '版本化公开成果', pubLead: '论文、规范与工程案例均具有明确版本、状态、阅读与引用路径。',
  timelineKicker: '05 / 研究时间线', timelineTitle: '从每日观察，到正式发表',
  manifesto: '不要把 AI 包装成确定性。', manifesto2: '让不确定的智能进入可治理的工作系统。',
  switchText: 'Switch to English',
} : {
  languageCurrent: 'EN', languageOther: '中文', languageLink: '/zh/',
  eyebrow: 'INDEPENDENT · ENGINEERING-DRIVEN AI RESEARCH',
  title1: 'Building governed', title2: 'AI work systems.',
  intro: 'Research on AI work data, formal coordination, Digital Employees and practical multi-agent systems — grounded in FCoP and CodeFlowMu engineering evidence.',
  explore: 'Explore research', publications: 'Read publications',
  programsKicker: '01 / PROGRAMS', programsTitle: 'Official research programs', programsLead: 'One portal connecting theory, protocol, runtime engineering and the final application direction.',
  hierarchyKicker: '02 / RESEARCH MAP', hierarchyTitle: 'A clear research hierarchy', hierarchyLead: 'Research cadence, research domains and mature publications remain separate.',
  latestKicker: '03 / LATEST RESEARCH', latestTitle: 'Latest research', latestLead: 'Current work across workforce control, runtime operations and governance architecture.',
  pubKicker: '04 / PUBLICATION CENTER', pubTitle: 'Versioned public work', pubLead: 'Papers, specifications and case reports with explicit status, reading and citation paths.',
  timelineKicker: '05 / TIMELINE', timelineTitle: 'From observation to publication',
  manifesto: 'Do not pretend AI is deterministic.', manifesto2: 'Build systems that govern intelligent uncertainty.',
  switchText: '切换到简体中文',
})

const base = (path: string) => withBase(path)
const p = (en: string, zhPath: string) => zh.value ? zhPath : en
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
            <span>Portal V5</span><span>2026.08.01</span><span>Engineering First</span>
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
        <div><b>04</b><span>{{ zh ? '核心研究计划' : 'Research programs' }}</span></div>
        <div><b>09</b><span>{{ zh ? '公开研究文章' : 'Public research notes' }}</span></div>
        <div><b>03</b><span>{{ zh ? '公开出版草稿' : 'Public drafts' }}</span></div>
        <div><b>V0.2</b><span>{{ zh ? '数字员工纲领基线' : 'Governing baseline' }}</span></div>
      </section>

      <section class="rcv5-section">
        <div class="rcv5-heading"><div><span>{{ t.programsKicker }}</span><h2>{{ t.programsTitle }}</h2><p>{{ t.programsLead }}</p></div></div>
        <div class="rcv5-program-grid">
          <a class="rcv5-program tmpa" :href="p('/en/publications/', '/zh/publications/')">
            <div class="rcv5-program-cover"><span>GOVERNANCE</span><strong>T○</strong><i></i></div>
            <div class="rcv5-program-body"><small>AI WORK DATA & GOVERNANCE</small><h3>TMPA</h3><p>{{ zh ? 'AI 工作数据与治理架构，覆盖 Profile、Event、Message、Index 与 Knowledge。' : 'AI work data and governance architecture across Profile, Event, Message, Index and Knowledge.' }}</p><b>{{ zh ? '研究与规范' : 'Research & specification' }} ↗</b></div>
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
        <div class="rcv5-heading"><div><span>{{ t.hierarchyKicker }}</span><h2>{{ t.hierarchyTitle }}</h2><p>{{ t.hierarchyLead }}</p></div></div>
        <div class="rcv5-taxonomy">
          <div class="rcv5-tax-card"><span>CADENCE</span><h3>{{ zh ? '研究节奏' : 'Research' }}</h3><a :href="p('/en/research/daily/', '/zh/research/daily/')"><b>{{ zh ? '每日研究' : 'Daily Research' }}</b><small>{{ zh ? '新证据与判断' : 'New evidence and decisions' }}</small></a><a :href="p('/en/research/weekly/', '/zh/research/weekly/')"><b>{{ zh ? '每周综合' : 'Weekly Synthesis' }}</b><small>{{ zh ? '跨来源综合判断' : 'Cross-source judgment' }}</small></a><a :href="p('/en/research/papers/', '/zh/research/papers/')"><b>{{ zh ? '学术论文观察' : 'Academic Paper Watch' }}</b><small>{{ zh ? '相关工作与文献' : 'Literature and related work' }}</small></a></div>
          <div class="rcv5-tax-card"><span>DOMAINS</span><h3>{{ zh ? '研究领域' : 'Research Domains' }}</h3><a :href="p('/en/digital-employee/', '/zh/digital-employee/')"><b>{{ zh ? '数字员工' : 'Digital Employees' }}</b><small>Position · Workflow · Runtime</small></a><a :href="p('/en/industry/', '/zh/industry/')"><b>{{ zh ? '行业架构' : 'Industry Architecture' }}</b><small>{{ zh ? '企业数字劳动力系统' : 'Enterprise workforce systems' }}</small></a><a :href="p('/en/engineering/', '/zh/engineering/')"><b>{{ zh ? '开源工程观察' : 'Engineering Watch' }}</b><small>{{ zh ? '可借鉴的工程机制' : 'Open-source mechanisms' }}</small></a></div>
          <div class="rcv5-tax-card"><span>OUTPUTS</span><h3>{{ zh ? '出版物' : 'Publications' }}</h3><a :href="p('/en/publications/', '/zh/publications/')"><b>{{ zh ? '论文' : 'Papers' }}</b><small>{{ zh ? '研究主张与评估' : 'Research claims and evaluation' }}</small></a><a :href="p('/en/publications/', '/zh/publications/')"><b>{{ zh ? '规范' : 'Specifications' }}</b><small>{{ zh ? '规范性契约' : 'Normative contracts' }}</small></a><a :href="p('/en/publications/', '/zh/publications/')"><b>{{ zh ? '工程案例' : 'Implementation Cases' }}</b><small>{{ zh ? '可追溯工程证据' : 'Engineering evidence' }}</small></a></div>
        </div>
      </section>

      <section class="rcv5-section">
        <div class="rcv5-heading"><div><span>{{ t.latestKicker }}</span><h2>{{ t.latestTitle }}</h2><p>{{ t.latestLead }}</p></div><a :href="p('/en/research/', '/zh/research/')">{{ zh ? '研究归档' : 'Research archive' }} →</a></div>
        <div class="rcv5-latest">
          <a class="rcv5-feature" :href="p('/en/research/weekly/weekly-002', '/zh/research/weekly/weekly-002')">
            <img :src="base('/assets/covers/weekly-002.svg')" alt="Weekly 002 cover">
            <div><span>FEATURED · WEEKLY 002</span><h3>{{ zh ? '数字员工控制面与工作 Runtime' : 'Digital Employee Control Plane and Work Runtime' }}</h3><p>{{ zh ? '从 Workday 与 OpenHands 出发，判断面向中小企业的轻量数字员工平台。' : 'What Workday and OpenHands reveal about a lightweight, SME-first platform.' }}</p><b>{{ zh ? '阅读报告' : 'Read report' }} ↗</b></div>
          </a>
          <div class="rcv5-side-research">
            <a :href="p('/en/industry/workday', '/zh/industry/workday')"><img :src="base('/assets/covers/workday.svg')" alt="Workday"><div><span>INDUSTRY</span><h3>Workday Agent System of Record</h3><p>{{ zh ? '所有权、生命周期、成本与合规。' : 'Ownership, lifecycle, cost and compliance.' }}</p></div></a>
            <a :href="p('/en/engineering/openhands', '/zh/engineering/openhands')"><img :src="base('/assets/covers/openhands.svg')" alt="OpenHands"><div><span>ENGINEERING</span><h3>OpenHands Agent Canvas</h3><p>{{ zh ? 'Skill、连接健康、自动化与操作体验。' : 'Skills, health, automation and operator experience.' }}</p></div></a>
          </div>
        </div>
      </section>

      <section class="rcv5-section">
        <div class="rcv5-heading"><div><span>{{ t.pubKicker }}</span><h2>{{ t.pubTitle }}</h2><p>{{ t.pubLead }}</p></div><a :href="p('/en/publications/', '/zh/publications/')">{{ zh ? '进入出版中心' : 'Publication center' }} →</a></div>
        <div class="rcv5-pubs">
          <a :href="p('/en/publications/tmpa-architecture-paper-a0.3', '/zh/publications/tmpa-architecture-paper-a0.3')"><img :src="base('/assets/covers/tmpa-paper.svg')" alt="TMPA Architecture Paper"><div><span>PAPER · A0.3</span><h3>TMPA Architecture Paper</h3><p>{{ zh ? '研究问题、设计贡献、评估与局限。' : 'Research framing, design contribution, evaluation and limitations.' }}</p><b>Read · Cite · Versions →</b></div></a>
          <a :href="p('/en/publications/tmpa-core-specification-s0.2', '/zh/publications/tmpa-core-specification-s0.2')"><img :src="base('/assets/covers/tmpa-spec.svg')" alt="TMPA Core Specification"><div><span>SPEC · S0.2</span><h3>TMPA Core Specification</h3><p>{{ zh ? '可实现契约与存储无关语义。' : 'Implementable contracts and storage-independent semantics.' }}</p><b>Read · Cite · Versions →</b></div></a>
          <a :href="p('/en/publications/implementation-case-i0.2', '/zh/publications/implementation-case-i0.2')"><img :src="base('/assets/covers/implementation-case.svg')" alt="Implementation Case"><div><span>CASE · I0.2</span><h3>Implementation Case Report</h3><p>{{ zh ? '生命周期、恢复、门禁与多角色闭环的工程证据。' : 'Evidence from lifecycle, recovery, gates and multi-role closure.' }}</p><b>Read · Cite · Versions →</b></div></a>
        </div>
      </section>

      <section class="rcv5-section">
        <div class="rcv5-heading"><div><span>{{ t.timelineKicker }}</span><h2>{{ t.timelineTitle }}</h2></div></div>
        <div class="rcv5-timeline">
          <div class="active"><i></i><span>NOW</span><h3>{{ zh ? '每日研究' : 'Daily research' }}</h3><p>{{ zh ? '论文、行业、GitHub 与工程事实。' : 'Evidence, papers, GitHub and industry.' }}</p></div>
          <div class="active"><i></i><span>WEEKLY</span><h3>{{ zh ? '综合分析' : 'Synthesis' }}</h3><p>{{ zh ? '形成判断并反哺架构。' : 'Judgment and architecture updates.' }}</p></div>
          <div><i></i><span>STABLE</span><h3>{{ zh ? '版本收口' : 'Version closure' }}</h3><p>{{ zh ? '图表、实验与引用。' : 'Figures, experiments and citations.' }}</p></div>
          <div><i></i><span>PUBLISH</span><h3>{{ zh ? '正式发布' : 'Formal release' }}</h3><p>{{ zh ? '预印本、DOI 与投稿。' : 'Preprint, DOI and venue submission.' }}</p></div>
        </div>
      </section>

      <section class="rcv5-manifesto"><span>ENGINEERING FIRST · EVIDENCE FIRST · CONTINUOUSLY REVISED</span><h2>{{ t.manifesto }}<br>{{ t.manifesto2 }}</h2><div><a :href="p('/en/digital-employee/architecture', '/zh/digital-employee/architecture')">{{ zh ? '阅读数字员工纲领性架构' : 'Read the Digital Employee architecture' }} ↗</a><a :href="t.languageLink">{{ t.switchText }} →</a></div></section>
    </div>
  </div>
</template>
