import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'TMPA Research Center',
  description: 'Engineering-driven research on AI work governance and Digital Employees',
  lang: 'zh-CN',
  base: '/joinwell52/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/joinwell52/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#11183b' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'TMPA Research Center' }],
    ['meta', { property: 'og:description', content: 'Governance Architecture for AI Work & Digital Employees' }],
    ['meta', { property: 'og:image', content: 'https://joinwell52-ai.github.io/joinwell52/og-cover.svg' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'TMPA Research Center',
    nav: [
      { text: '研究', link: '/research/' },
      { text: '数字员工', link: '/digital-employee/' },
      { text: '行业', link: '/industry/' },
      { text: '工程观察', link: '/engineering/' },
      { text: '出版物', link: '/publications/' },
      { text: 'English', link: '/en/' }
    ],
    sidebar: {
      '/research/': [
        { text: '研究动态', items: [
          { text: '研究总览', link: '/research/' },
          { text: '每日研究', link: '/research/daily/' },
          { text: '每周研究', link: '/research/weekly/' }
        ]},
        { text: '每日报告', items: [
          { text: '2026-08-01 · Research Center 上线设计', link: '/research/daily/2026-08-01' }
        ]},
        { text: '周报', items: [
          { text: 'Weekly 002', link: '/research/weekly/weekly-002' },
          { text: 'Weekly 001', link: '/research/weekly/weekly-001' }
        ]}
      ],
      '/digital-employee/': [
        { text: '数字员工', items: [
          { text: '研究总览', link: '/digital-employee/' },
          { text: '纲领性架构 V0.2', link: '/digital-employee/architecture' }
        ]}
      ],
      '/industry/': [
        { text: '行业研究', items: [
          { text: '行业版图', link: '/industry/' },
          { text: 'ServiceNow', link: '/industry/servicenow' },
          { text: 'Workday', link: '/industry/workday' }
        ]}
      ],
      '/engineering/': [
        { text: '工程观察', items: [
          { text: '工程版图', link: '/engineering/' },
          { text: 'OpenHands', link: '/engineering/openhands' }
        ]}
      ],
      '/publications/': [
        { text: '出版物', items: [
          { text: '出版物总览', link: '/publications/' },
          { text: 'TMPA Architecture Paper A0.3', link: '/publications/tmpa-architecture-paper-a0.3' },
          { text: 'TMPA Core Specification S0.2', link: '/publications/tmpa-core-specification-s0.2' },
          { text: 'Implementation Case I0.2', link: '/publications/implementation-case-i0.2' }
        ]}
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/joinwell52-AI/joinwell52' }
    ],
    search: { provider: 'local' },
    outline: { level: [2, 3], label: '本页目录' },
    lastUpdated: { text: '最后更新' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    footer: {
      message: 'Independent engineering-driven research / 独立工程驱动研究',
      copyright: 'Copyright © 2026 joinwell52-AI'
    }
  },
  locales: {
    root: { label: '简体中文', lang: 'zh-CN' },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Research', link: '/research/' },
          { text: 'Digital Employee', link: '/digital-employee/' },
          { text: 'Industry', link: '/industry/' },
          { text: 'Engineering', link: '/engineering/' },
          { text: 'Publications', link: '/publications/' },
          { text: '中文', link: '/' }
        ],
        outline: { label: 'On this page' },
        lastUpdated: { text: 'Last updated' },
        docFooter: { prev: 'Previous', next: 'Next' }
      }
    }
  }
})
