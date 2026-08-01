import { defineConfig } from 'vitepress'

const zhSidebar = {
  '/research/': [
    {
      text: '研究中心',
      items: [
        { text: '研究总览', link: '/research/' },
        { text: '每日研究', link: '/research/daily/' },
        { text: '每周综合', link: '/research/weekly/' }
      ]
    },
    {
      text: '研究分类',
      items: [
        { text: '学术论文观察', link: '/research/papers/' },
        { text: '数字员工研究', link: '/digital-employee/' },
        { text: '行业架构研究', link: '/industry/' },
        { text: '开源工程观察', link: '/engineering/' }
      ]
    },
    {
      text: '近期研究',
      items: [
        { text: '2026-08-01 · 研究中心公开架构', link: '/research/daily/2026-08-01' },
        { text: 'Weekly 002 · 控制面与 Runtime', link: '/research/weekly/weekly-002' },
        { text: 'Weekly 001 · 从 Agent 到数字员工', link: '/research/weekly/weekly-001' }
      ]
    }
  ],
  '/digital-employee/': [
    {
      text: '数字员工研究',
      items: [
        { text: '研究总览', link: '/digital-employee/' },
        { text: '纲领性架构 V0.2', link: '/digital-employee/architecture' }
      ]
    },
    {
      text: '核心主题',
      items: [
        { text: '岗位与职责', link: '/digital-employee/#岗位与职责' },
        { text: '工作流与 Runtime', link: '/digital-employee/#工作流与-runtime' },
        { text: '治理与评估', link: '/digital-employee/#治理与评估' }
      ]
    }
  ],
  '/industry/': [
    {
      text: '行业架构研究',
      items: [
        { text: '行业版图', link: '/industry/' },
        { text: 'ServiceNow', link: '/industry/servicenow' },
        { text: 'Workday', link: '/industry/workday' }
      ]
    }
  ],
  '/engineering/': [
    {
      text: '开源工程观察',
      items: [
        { text: '工程版图', link: '/engineering/' },
        { text: 'OpenHands', link: '/engineering/openhands' }
      ]
    }
  ],
  '/publications/': [
    {
      text: '出版体系',
      items: [
        { text: '出版物总览', link: '/publications/' },
        { text: 'TMPA 架构论文 A0.3', link: '/publications/tmpa-architecture-paper-a0.3' },
        { text: 'TMPA 核心规范 S0.2', link: '/publications/tmpa-core-specification-s0.2' },
        { text: '工程实现案例 I0.2', link: '/publications/implementation-case-i0.2' }
      ]
    }
  ]
}

const enSidebar = {
  '/en/research/': [
    {
      text: 'Research Center',
      items: [
        { text: 'Overview', link: '/en/research/' },
        { text: 'Daily Research', link: '/en/research/daily/' },
        { text: 'Weekly Synthesis', link: '/en/research/weekly/' }
      ]
    },
    {
      text: 'Research Domains',
      items: [
        { text: 'Academic Papers', link: '/en/research/papers/' },
        { text: 'Digital Employees', link: '/en/digital-employee/' },
        { text: 'Industry Architecture', link: '/en/industry/' },
        { text: 'Open-source Engineering', link: '/en/engineering/' }
      ]
    }
  ],
  '/en/digital-employee/': [
    {
      text: 'Digital Employee',
      items: [
        { text: 'Overview', link: '/en/digital-employee/' },
        { text: 'Architecture V0.2', link: '/en/digital-employee/architecture' }
      ]
    }
  ],
  '/en/industry/': [
    {
      text: 'Industry Architecture',
      items: [
        { text: 'Landscape', link: '/en/industry/' },
        { text: 'ServiceNow', link: '/en/industry/servicenow' },
        { text: 'Workday', link: '/en/industry/workday' }
      ]
    }
  ],
  '/en/engineering/': [
    {
      text: 'Engineering Watch',
      items: [
        { text: 'Overview', link: '/en/engineering/' },
        { text: 'OpenHands', link: '/en/engineering/openhands' }
      ]
    }
  ],
  '/en/publications/': [
    {
      text: 'Publications',
      items: [
        { text: 'Overview', link: '/en/publications/' },
        { text: 'TMPA Architecture Paper A0.3', link: '/en/publications/tmpa-architecture-paper-a0.3' },
        { text: 'TMPA Core Specification S0.2', link: '/en/publications/tmpa-core-specification-s0.2' },
        { text: 'Implementation Case I0.2', link: '/en/publications/implementation-case-i0.2' }
      ]
    }
  ]
}

export default defineConfig({
  title: 'TMPA Research Center',
  description: 'Engineering-driven research on AI work governance and Digital Employees',
  base: '/joinwell52/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/joinwell52/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#080b18' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'TMPA Research Center' }],
    ['meta', { property: 'og:description', content: 'Governance Architecture for AI Work & Digital Employees' }],
    ['meta', { property: 'og:image', content: 'https://joinwell52-ai.github.io/joinwell52/og-cover.svg' }]
  ],
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'TMPA 研究中心',
      description: '面向 AI 工作治理与数字员工的工程驱动研究'
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'TMPA Research Center',
      description: 'Engineering-driven research on AI work governance and Digital Employees'
    }
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'TMPA',
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/joinwell52-AI/joinwell52' }],
    locales: {
      root: {
        label: '简体中文',
        selectText: '选择语言',
        nav: [
          {
            text: '研究',
            items: [
              { text: '研究总览', link: '/research/' },
              { text: '每日研究', link: '/research/daily/' },
              { text: '每周综合', link: '/research/weekly/' },
              { text: '学术论文观察', link: '/research/papers/' }
            ]
          },
          {
            text: '研究领域',
            items: [
              { text: '数字员工', link: '/digital-employee/' },
              { text: '行业架构', link: '/industry/' },
              { text: '开源工程', link: '/engineering/' }
            ]
          },
          { text: '出版物', link: '/publications/' },
          { text: '关于', link: '/about' }
        ],
        sidebar: zhSidebar,
        outline: { level: [2, 3], label: '本页目录' },
        lastUpdated: { text: '最后更新' },
        docFooter: { prev: '上一篇', next: '下一篇' },
        footer: {
          message: '独立、工程驱动、持续修订的公开研究',
          copyright: 'Copyright © 2026 joinwell52-AI'
        }
      },
      en: {
        label: 'English',
        selectText: 'Language',
        nav: [
          {
            text: 'Research',
            items: [
              { text: 'Overview', link: '/en/research/' },
              { text: 'Daily Research', link: '/en/research/daily/' },
              { text: 'Weekly Synthesis', link: '/en/research/weekly/' },
              { text: 'Academic Papers', link: '/en/research/papers/' }
            ]
          },
          {
            text: 'Domains',
            items: [
              { text: 'Digital Employees', link: '/en/digital-employee/' },
              { text: 'Industry Architecture', link: '/en/industry/' },
              { text: 'Open-source Engineering', link: '/en/engineering/' }
            ]
          },
          { text: 'Publications', link: '/en/publications/' },
          { text: 'About', link: '/en/about' }
        ],
        sidebar: enSidebar,
        outline: { level: [2, 3], label: 'On this page' },
        lastUpdated: { text: 'Last updated' },
        docFooter: { prev: 'Previous', next: 'Next' },
        footer: {
          message: 'Independent, engineering-driven, continuously revised research',
          copyright: 'Copyright © 2026 joinwell52-AI'
        }
      }
    }
  }
})
