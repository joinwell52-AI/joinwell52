import { defineConfig } from 'vitepress'

const enSidebar = {
  '/en/runtime/': [{ text: 'Digital Researcher Operations', items: [
    { text: 'Operations Center V4', link: '/en/runtime/' },
    { text: 'Runtime Center V4 Guide', link: '/en/runtime/v4' },
    { text: 'Research Intelligence System', link: '/en/runtime/research-intelligence' },
    { text: 'Runtime Scheduler V1.0 Release', link: '/en/publications/research-runtime-scheduler-v1.0' },
    { text: 'Research Report Production Engine V1.0', link: '/en/publications/research-report-production-engine-v1.0' }
  ]}],
  '/en/research/': [{ text: 'Observation Notes', items: [
    { text: 'All Observation Notes', link: '/en/research/' },
    { text: 'Digital Employee', link: '/en/digital-employee/' },
    { text: 'Industry Architecture', link: '/en/industry/' },
    { text: 'Open-source Engineering', link: '/en/engineering/' }
  ]}],
  '/en/digital-employee/': [{ text: 'Digital Employee', items: [
    { text: 'Observation Notes', link: '/en/digital-employee/' },
    { text: 'Architecture V0.2', link: '/en/digital-employee/architecture' }
  ]}],
  '/en/industry/': [{ text: 'Industry Architecture', items: [
    { text: 'Observation Notes', link: '/en/industry/' }
  ]}],
  '/en/engineering/': [{ text: 'Open-source Engineering', items: [
    { text: 'Observation Notes', link: '/en/engineering/' }
  ]}],
  '/en/publications/': [{ text: 'Publication Center', items: [
    { text: 'Overview', link: '/en/publications/' },
    { text: 'Research Runtime Scheduler V1.0', link: '/en/publications/research-runtime-scheduler-v1.0' },
    { text: 'Research Report Production Engine V1.0', link: '/en/publications/research-report-production-engine-v1.0' },
    { text: 'TMPA Architecture Paper A0.5', link: '/en/publications/tmpa-architecture-paper-a0.5' },
    { text: 'TMPA Core Specification S0.4', link: '/en/publications/tmpa-core-specification-s0.4' },
    { text: 'Implementation Case I0.4', link: '/en/publications/implementation-case-i0.4' }
  ]}]
}

const zhSidebar = {
  '/zh/runtime/': [{ text: '数字研究员运营中心', items: [
    { text: '运营中心 V4', link: '/zh/runtime/' },
    { text: 'V4 运行规范', link: '/zh/runtime/v4' },
    { text: '研究情报系统 V1.0', link: '/zh/runtime/research-intelligence' },
    { text: 'Runtime Scheduler V1.0 发布', link: '/zh/publications/research-runtime-scheduler-v1.0' },
    { text: '研究报告生产机 V1.0', link: '/zh/publications/research-report-production-engine-v1.0' }
  ]}],
  '/zh/research/': [{ text: '观察笔记', items: [
    { text: '全部观察笔记', link: '/zh/research/' },
    { text: '数字员工', link: '/zh/digital-employee/' },
    { text: '行业架构', link: '/zh/industry/' },
    { text: '开源工程观察', link: '/zh/engineering/' }
  ]}],
  '/zh/digital-employee/': [{ text: '数字员工', items: [
    { text: '观察笔记', link: '/zh/digital-employee/' },
    { text: '纲领性架构 V0.2', link: '/zh/digital-employee/architecture' }
  ]}],
  '/zh/industry/': [{ text: '行业架构', items: [
    { text: '观察笔记', link: '/zh/industry/' }
  ]}],
  '/zh/engineering/': [{ text: '开源工程观察', items: [
    { text: '观察笔记', link: '/zh/engineering/' }
  ]}],
  '/zh/publications/': [{ text: '出版中心', items: [
    { text: '出版物总览', link: '/zh/publications/' },
    { text: 'Research Runtime Scheduler V1.0', link: '/zh/publications/research-runtime-scheduler-v1.0' },
    { text: '研究报告生产机 V1.0', link: '/zh/publications/research-report-production-engine-v1.0' },
    { text: 'TMPA 架构论文 A0.5', link: '/zh/publications/tmpa-architecture-paper-a0.5' },
    { text: 'TMPA 核心规范 S0.4', link: '/zh/publications/tmpa-core-specification-s0.4' },
    { text: '工程实现案例 I0.4', link: '/zh/publications/implementation-case-i0.4' }
  ]}]
}

export default defineConfig({
  title: 'Digital Employee Works',
  description: 'Digital Employee Works — continuously producing verifiable Digital Employee work through a governed runtime',
  base: '/joinwell52/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/joinwell52/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#080b18' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Digital Employee Works' }],
    ['meta', { property: 'og:description', content: 'Digital Employee production · CodeFlowMu and FCoP engineering · independent TMPA theory · GitHub First' }],
    ['meta', { property: 'og:image', content: 'https://joinwell52-ai.github.io/joinwell52/og-cover.svg' }]
  ],
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'Digital Employee Works',
      description: 'A governed production line for verifiable Digital Employee work, observation notes, runtime evidence and formal publications'
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: '数字员工工场',
      description: '数字员工工场——持续生产可核验的数字员工工作成果，公开运行证据、观察笔记与独立 TMPA 论文体系'
    }
  },
  themeConfig: {
    siteTitle: 'Digital Employee Works',
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/joinwell52-AI/joinwell52' }],
    // VitePress 1.6 accepts a boolean here. Exact paired-document links are
    // applied by the theme after navigation; SSR falls back to valid locale
    // roots instead of emitting broken `/zh/en/...` paths.
    i18nRouting: false,
    locales: {
      root: {
        label: 'English',
        siteTitle: 'Digital Employee Works',
        selectText: 'Language',
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Factory Runtime', link: '/en/runtime/' },
          { text: 'Observation Notes', link: '/en/research/' },
          { text: 'Theory & Publications', link: '/en/publications/' },
          { text: 'Product Stack', items: [
            { text: 'Research Operating System', link: '/en/publications/research-runtime-scheduler-v1.0' },
            { text: 'TMPA', link: '/en/publications/' },
            { text: 'FCoP Official Site', link: 'https://joinwell52-ai.github.io/FCoP/' },
            { text: 'CodeFlowMu', link: 'https://github.com/joinwell52-AI/CodeFlowMu-open' },
            { text: 'Digital Employee Architecture', link: '/en/digital-employee/architecture' }
          ]},
          { text: 'About', link: '/en/about' }
        ],
        sidebar: enSidebar,
        outline: { level: [2, 3], label: 'On this page' },
        lastUpdated: { text: 'Last updated' },
        docFooter: { prev: 'Previous', next: 'Next' },
        footer: { message: 'Digital Employee Works · GitHub First · Production verified', copyright: 'Copyright © 2026 joinwell52-AI' }
      },
      zh: {
        label: '简体中文',
        siteTitle: '数字员工工场',
        selectText: '语言',
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '运行中心', link: '/zh/runtime/' },
          { text: '观察笔记', link: '/zh/research/' },
          { text: '理论与出版', link: '/zh/publications/' },
          { text: '能力体系', items: [
            { text: 'Research Operating System', link: '/zh/publications/research-runtime-scheduler-v1.0' },
            { text: 'TMPA', link: '/zh/publications/' },
            { text: 'FCoP 官网', link: 'https://joinwell52-ai.github.io/FCoP/' },
            { text: 'CodeFlowMu', link: 'https://github.com/joinwell52-AI/CodeFlowMu-open' },
            { text: '数字员工纲领性架构', link: '/zh/digital-employee/architecture' }
          ]},
          { text: '关于', link: '/zh/about' }
        ],
        sidebar: zhSidebar,
        outline: { level: [2, 3], label: '本页目录' },
        lastUpdated: { text: '最后更新' },
        docFooter: { prev: '上一篇', next: '下一篇' },
        footer: { message: '数字员工工场 · GitHub First · 生产验证通过', copyright: 'Copyright © 2026 joinwell52-AI' }
      }
    }
  }
})
