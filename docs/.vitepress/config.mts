import { defineConfig } from 'vitepress'

const enSidebar = {
  '/en/runtime/': [{ text: 'Research Runtime Center', items: [
    { text: 'Runtime Dashboard', link: '/en/runtime/' },
    { text: 'Runtime Scheduler V1.0', link: '/en/publications/research-runtime-scheduler-v1.0' },
    { text: 'Research Report Production Engine V1.0', link: '/en/publications/research-report-production-engine-v1.0' }
  ]}],
  '/en/research/': [{ text: 'Research Notes', items: [
    { text: 'All Research Notes', link: '/en/research/' },
    { text: 'Digital Employee', link: '/en/digital-employee/' },
    { text: 'Industry Architecture', link: '/en/industry/' },
    { text: 'Open-source Engineering', link: '/en/engineering/' }
  ]}],
  '/en/digital-employee/': [{ text: 'Digital Employee', items: [
    { text: 'Research Notes', link: '/en/digital-employee/' },
    { text: 'Architecture V0.2', link: '/en/digital-employee/architecture' }
  ]}],
  '/en/industry/': [{ text: 'Industry Architecture', items: [
    { text: 'Research Notes', link: '/en/industry/' }
  ]}],
  '/en/engineering/': [{ text: 'Open-source Engineering', items: [
    { text: 'Research Notes', link: '/en/engineering/' }
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
  '/zh/runtime/': [{ text: 'Research Runtime Center', items: [
    { text: 'Runtime Dashboard', link: '/zh/runtime/' },
    { text: 'Runtime Scheduler V1.0', link: '/zh/publications/research-runtime-scheduler-v1.0' },
    { text: '研究报告生产机 V1.0', link: '/zh/publications/research-report-production-engine-v1.0' }
  ]}],
  '/zh/research/': [{ text: '研究笔记', items: [
    { text: '全部研究笔记', link: '/zh/research/' },
    { text: '数字员工', link: '/zh/digital-employee/' },
    { text: '行业架构', link: '/zh/industry/' },
    { text: '开源工程观察', link: '/zh/engineering/' }
  ]}],
  '/zh/digital-employee/': [{ text: '数字员工', items: [
    { text: '研究笔记', link: '/zh/digital-employee/' },
    { text: '纲领性架构 V0.2', link: '/zh/digital-employee/architecture' }
  ]}],
  '/zh/industry/': [{ text: '行业架构', items: [
    { text: '研究笔记', link: '/zh/industry/' }
  ]}],
  '/zh/engineering/': [{ text: '开源工程观察', items: [
    { text: '研究笔记', link: '/zh/engineering/' }
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
  title: 'JOINWELL52 Research Center',
  description: 'JOINWELL52 Research Center — a Runtime-governed AI Research Center powered by a production-verified Digital Research Employee',
  base: '/joinwell52/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/joinwell52/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#080b18' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'JOINWELL52 Research Center' }],
    ['meta', { property: 'og:description', content: 'Research Runtime Center · Runtime Scheduler V1.0 · Digital Research Employee · GitHub First' }],
    ['meta', { property: 'og:image', content: 'https://joinwell52-ai.github.io/joinwell52/og-cover.svg' }]
  ],
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'JOINWELL52 Research Center',
      description: 'JOINWELL52 Research Center — a Runtime-governed AI Research Center powered by a production-verified Digital Research Employee'
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'JOINWELL52 研究中心',
      description: 'JOINWELL52 研究中心——由 Runtime 统一治理、由经过生产验证的数字研究员持续运行的 AI 研究中心'
    }
  },
  themeConfig: {
    logo: '/logo.svg?v=tmpa-20260803-3',
    siteTitle: 'JOINWELL52 Research Center',
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/joinwell52-AI/joinwell52' }],
    // VitePress 1.6 accepts a boolean here. Exact paired-document links are
    // applied by the theme after navigation; SSR falls back to valid locale
    // roots instead of emitting broken `/zh/en/...` paths.
    i18nRouting: false,
    locales: {
      root: {
        label: 'English',
        siteTitle: 'JOINWELL52 Research Center',
        selectText: 'Language',
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Runtime Center', link: '/en/runtime/' },
          { text: 'Research Notes', link: '/en/research/' },
          { text: 'Publications', link: '/en/publications/' },
          { text: 'Programs', items: [
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
        footer: { message: 'Research Runtime Center · GitHub First · Production-verified Digital Research Employee', copyright: 'Copyright © 2026 joinwell52-AI' }
      },
      zh: {
        label: '简体中文',
        siteTitle: 'JOINWELL52 研究中心',
        selectText: '语言',
        nav: [
          { text: '首页', link: '/zh/' },
          { text: 'Runtime Center', link: '/zh/runtime/' },
          { text: '研究笔记', link: '/zh/research/' },
          { text: '出版物', link: '/zh/publications/' },
          { text: '研究计划', items: [
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
        footer: { message: 'Research Runtime Center · GitHub First · 经过生产验证的数字研究员', copyright: 'Copyright © 2026 joinwell52-AI' }
      }
    }
  }
})
