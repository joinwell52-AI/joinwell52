import { defineConfig } from 'vitepress'

const enSidebar = {
  '/en/research/': [
    { text: 'Research', items: [
      { text: 'Overview', link: '/en/research/' },
      { text: 'Daily Research', link: '/en/research/daily/' },
      { text: 'Weekly Synthesis', link: '/en/research/weekly/' },
      { text: 'Academic Paper Watch', link: '/en/research/papers/' }
    ]},
    { text: 'Current Research', items: [
      { text: 'Weekly 002 · Control Plane & Runtime', link: '/en/research/weekly/weekly-002' },
      { text: 'Weekly 001 · From Agents to Digital Employees', link: '/en/research/weekly/weekly-001' }
    ]}
  ],
  '/en/digital-employee/': [{ text: 'Digital Employee', items: [
    { text: 'Overview', link: '/en/digital-employee/' },
    { text: 'Architecture V0.2', link: '/en/digital-employee/architecture' }
  ]}],
  '/en/industry/': [{ text: 'Industry Architecture', items: [
    { text: 'Landscape', link: '/en/industry/' },
    { text: 'ServiceNow', link: '/en/industry/servicenow' },
    { text: 'Workday', link: '/en/industry/workday' }
  ]}],
  '/en/engineering/': [{ text: 'Engineering Watch', items: [
    { text: 'Overview', link: '/en/engineering/' },
    { text: 'OpenHands', link: '/en/engineering/openhands' }
  ]}],
  '/en/publications/': [{ text: 'Publication Center', items: [
    { text: 'Overview', link: '/en/publications/' },
    { text: 'TMPA Architecture Paper A0.3', link: '/en/publications/tmpa-architecture-paper-a0.3' },
    { text: 'TMPA Core Specification S0.2', link: '/en/publications/tmpa-core-specification-s0.2' },
    { text: 'Implementation Case I0.2', link: '/en/publications/implementation-case-i0.2' }
  ]}]
}

const zhSidebar = {
  '/zh/research/': [
    { text: '研究', items: [
      { text: '研究总览', link: '/zh/research/' },
      { text: '每日研究', link: '/zh/research/daily/' },
      { text: '每周综合', link: '/zh/research/weekly/' },
      { text: '学术论文观察', link: '/zh/research/papers/' }
    ]},
    { text: '近期研究', items: [
      { text: 'Weekly 002 · 控制面与 Runtime', link: '/zh/research/weekly/weekly-002' },
      { text: 'Weekly 001 · 从 Agent 到数字员工', link: '/zh/research/weekly/weekly-001' }
    ]}
  ],
  '/zh/digital-employee/': [{ text: '数字员工', items: [
    { text: '研究总览', link: '/zh/digital-employee/' },
    { text: '纲领性架构 V0.2', link: '/zh/digital-employee/architecture' }
  ]}],
  '/zh/industry/': [{ text: '行业架构', items: [
    { text: '行业版图', link: '/zh/industry/' },
    { text: 'ServiceNow', link: '/zh/industry/servicenow' },
    { text: 'Workday', link: '/zh/industry/workday' }
  ]}],
  '/zh/engineering/': [{ text: '开源工程观察', items: [
    { text: '工程版图', link: '/zh/engineering/' },
    { text: 'OpenHands', link: '/zh/engineering/openhands' }
  ]}],
  '/zh/publications/': [{ text: '出版中心', items: [
    { text: '出版物总览', link: '/zh/publications/' },
    { text: 'TMPA 架构论文 A0.3', link: '/zh/publications/tmpa-architecture-paper-a0.3' },
    { text: 'TMPA 核心规范 S0.2', link: '/zh/publications/tmpa-core-specification-s0.2' },
    { text: '工程实现案例 I0.2', link: '/zh/publications/implementation-case-i0.2' }
  ]}]
}

export default defineConfig({
  title: 'joinwell52 Research Center',
  description: 'Independent engineering-driven research on AI work, governance and Digital Employees',
  base: '/joinwell52/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/joinwell52/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#080b18' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'joinwell52 Research Center' }],
    ['meta', { property: 'og:description', content: 'AI Work · Governance · Digital Employees' }],
    ['meta', { property: 'og:image', content: 'https://joinwell52-ai.github.io/joinwell52/og-cover.svg' }]
  ],
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'joinwell52 Research Center',
      description: 'Independent engineering-driven research on AI work, governance and Digital Employees'
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'joinwell52 研究中心',
      description: '面向 AI 工作、治理与数字员工的独立工程研究'
    }
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Research Center',
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/joinwell52-AI/joinwell52' }],
    locales: {
      root: {
        label: 'English',
        selectText: 'Language',
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Research', items: [
            { text: 'Research Overview', link: '/en/research/' },
            { text: 'Daily Research', link: '/en/research/daily/' },
            { text: 'Weekly Synthesis', link: '/en/research/weekly/' },
            { text: 'Academic Paper Watch', link: '/en/research/papers/' }
          ]},
          { text: 'Domains', items: [
            { text: 'Digital Employees', link: '/en/digital-employee/' },
            { text: 'Industry Architecture', link: '/en/industry/' },
            { text: 'Engineering Watch', link: '/en/engineering/' }
          ]},
          { text: 'Publications', link: '/en/publications/' },
          { text: 'Programs', items: [
            { text: 'TMPA', link: '/en/publications/' },
            { text: 'FCoP Official Site', link: 'https://joinwell52-ai.github.io/FCoP/' },
            { text: 'CodeFlowMu', link: 'https://github.com/joinwell52-AI/CodeFlowMu-open' },
            { text: 'Digital Employee', link: '/en/digital-employee/architecture' }
          ]},
          { text: 'About', link: '/en/about' }
        ],
        sidebar: enSidebar,
        outline: { level: [2, 3], label: 'On this page' },
        lastUpdated: { text: 'Last updated' },
        docFooter: { prev: 'Previous', next: 'Next' },
        footer: { message: 'Engineering first · Evidence first · Continuously revised', copyright: 'Copyright © 2026 joinwell52-AI' }
      },
      zh: {
        label: '简体中文',
        selectText: '语言',
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '研究', items: [
            { text: '研究总览', link: '/zh/research/' },
            { text: '每日研究', link: '/zh/research/daily/' },
            { text: '每周综合', link: '/zh/research/weekly/' },
            { text: '学术论文观察', link: '/zh/research/papers/' }
          ]},
          { text: '研究领域', items: [
            { text: '数字员工', link: '/zh/digital-employee/' },
            { text: '行业架构', link: '/zh/industry/' },
            { text: '开源工程观察', link: '/zh/engineering/' }
          ]},
          { text: '出版物', link: '/zh/publications/' },
          { text: '研究计划', items: [
            { text: 'TMPA', link: '/zh/publications/' },
            { text: 'FCoP 官网', link: 'https://joinwell52-ai.github.io/FCoP/' },
            { text: 'CodeFlowMu', link: 'https://github.com/joinwell52-AI/CodeFlowMu-open' },
            { text: '数字员工', link: '/zh/digital-employee/architecture' }
          ]},
          { text: '关于', link: '/zh/about' }
        ],
        sidebar: zhSidebar,
        outline: { level: [2, 3], label: '本页目录' },
        lastUpdated: { text: '最后更新' },
        docFooter: { prev: '上一篇', next: '下一篇' },
        footer: { message: '工程优先 · 证据优先 · 持续修订', copyright: 'Copyright © 2026 joinwell52-AI' }
      }
    }
  }
})
