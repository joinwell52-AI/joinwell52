import { defineConfig } from 'vitepress'

const enSidebar = {
  '/en/runtime/': [{ text: 'Research Runtime Center V5.0', items: [
    { text: 'Operations Center V5.0', link: '/en/runtime/' },
    { text: 'Daily Runtime', link: '/en/runtime/daily' },
    { text: 'Weekly Runtime', link: '/en/runtime/weekly' },
    { text: 'Academic Runtime', link: '/en/runtime/academic' },
    { text: 'Research Program Runtime', link: '/en/runtime/program' },
    { text: 'V5.0 Frozen Runtime Guide', link: '/en/runtime/v5' },
    { text: 'Research Intelligence System', link: '/en/runtime/research-intelligence' },
    { text: 'Runtime Center V4 History', link: '/en/runtime/v4' },
    { text: 'Research Report Production Engine V1.3', link: '/en/publications/research-report-production-engine-v1.3' },
    { text: 'Runtime Scheduler V1.0 Historical Release', link: '/en/publications/research-runtime-scheduler-v1.0' }
  ]}],
  '/en/research/': [{ text: 'Observation Notes', items: [
    { text: 'All Observation Notes', link: '/en/research/' },
    { text: 'Digital Employee', link: '/en/digital-employee/' },
    { text: 'Industry Architecture', link: '/en/industry/' },
    { text: 'Open-source Engineering', link: '/en/engineering/' }
  ]}],
  '/en/digital-employee/': [{ text: 'Digital Employee', items: [
    { text: 'Observation Notes', link: '/en/digital-employee/' },
    { text: 'Architecture V0.2', link: '/en/digital-employee/architecture' },
    { text: 'Research Report Production Engine V1.3', link: '/en/publications/research-report-production-engine-v1.3' }
  ]}],
  '/en/industry/': [{ text: 'Industry Architecture', items: [
    { text: 'Observation Notes', link: '/en/industry/' },
    { text: 'Research Intelligence System', link: '/en/runtime/research-intelligence' }
  ]}],
  '/en/engineering/': [{ text: 'Open-source Engineering', items: [
    { text: 'Observation Notes', link: '/en/engineering/' },
    { text: 'Research Intelligence System', link: '/en/runtime/research-intelligence' }
  ]}],
  '/en/publications/': [{ text: 'Publication Center', items: [
    { text: 'Overview', link: '/en/publications/' },
    { text: 'Research Report Production Engine V1.3', link: '/en/publications/research-report-production-engine-v1.3' },
    { text: 'V1.3 Quick Start', link: '/en/publications/research-report-production-engine-v1.3-quickstart' },
    { text: 'Research Runtime Center V5.0', link: '/en/runtime/v5' },
    { text: 'Research Intelligence System V1.0', link: '/en/runtime/research-intelligence' },
    { text: 'Research Runtime Scheduler V1.0 History', link: '/en/publications/research-runtime-scheduler-v1.0' },
    { text: 'TMPA Architecture Paper A0.7', link: '/en/publications/tmpa-architecture-paper-a0.7' },
    { text: 'TMPA Core Specification S0.6', link: '/en/publications/tmpa-core-specification-s0.6' },
    { text: 'Implementation Case I0.8', link: '/en/publications/implementation-case-i0.8' }
  ]}]
}

const zhSidebar = {
  '/zh/runtime/': [{ text: 'Research Runtime Center V5.0', items: [
    { text: '运营中心 V5.0', link: '/zh/runtime/' },
    { text: 'Daily Runtime', link: '/zh/runtime/daily' },
    { text: 'Weekly Runtime', link: '/zh/runtime/weekly' },
    { text: 'Academic Runtime', link: '/zh/runtime/academic' },
    { text: 'Research Program Runtime', link: '/zh/runtime/program' },
    { text: 'V5.0 冻结运行规范', link: '/zh/runtime/v5' },
    { text: '研究情报系统 V1.0', link: '/zh/runtime/research-intelligence' },
    { text: 'Runtime Center V4 历史', link: '/zh/runtime/v4' },
    { text: '研究报告生产机 V1.3', link: '/zh/publications/research-report-production-engine-v1.3' },
    { text: 'Runtime Scheduler V1.0 历史发布', link: '/zh/publications/research-runtime-scheduler-v1.0' }
  ]}],
  '/zh/research/': [{ text: '观察笔记', items: [
    { text: '全部观察笔记', link: '/zh/research/' },
    { text: '数字员工', link: '/zh/digital-employee/' },
    { text: '行业架构', link: '/zh/industry/' },
    { text: '开源工程观察', link: '/zh/engineering/' }
  ]}],
  '/zh/digital-employee/': [{ text: '数字员工', items: [
    { text: '观察笔记', link: '/zh/digital-employee/' },
    { text: '纲领性架构 V0.2', link: '/zh/digital-employee/architecture' },
    { text: '研究报告生产机 V1.3', link: '/zh/publications/research-report-production-engine-v1.3' }
  ]}],
  '/zh/industry/': [{ text: '行业架构', items: [
    { text: '观察笔记', link: '/zh/industry/' },
    { text: '研究情报系统', link: '/zh/runtime/research-intelligence' }
  ]}],
  '/zh/engineering/': [{ text: '开源工程观察', items: [
    { text: '观察笔记', link: '/zh/engineering/' },
    { text: '研究情报系统', link: '/zh/runtime/research-intelligence' }
  ]}],
  '/zh/publications/': [{ text: '出版中心', items: [
    { text: '出版物总览', link: '/zh/publications/' },
    { text: '研究报告生产机 V1.3', link: '/zh/publications/research-report-production-engine-v1.3' },
    { text: 'V1.3 快速开始', link: '/zh/publications/research-report-production-engine-v1.3-quickstart' },
    { text: 'Research Runtime Center V5.0', link: '/zh/runtime/v5' },
    { text: '研究情报系统 V1.0', link: '/zh/runtime/research-intelligence' },
    { text: 'Runtime Scheduler V1.0 历史发布', link: '/zh/publications/research-runtime-scheduler-v1.0' },
    { text: 'TMPA 架构论文 A0.7', link: '/zh/publications/tmpa-architecture-paper-a0.7' },
    { text: 'TMPA 核心规范 S0.6', link: '/zh/publications/tmpa-core-specification-s0.6' },
    { text: '工程实现案例 I0.8', link: '/zh/publications/implementation-case-i0.8' }
  ]}]
}

export default defineConfig({
  title: 'Digital Employee Works',
  description: 'Digital Employee Works — turning general-purpose AI into Digital Employees with positions, responsibilities, skills, workflows, and verifiable work results',
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
      description: 'Turn general-purpose AI into Digital Employees with positions, responsibilities, skills, workflows, and verifiable work results'
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: '数字员工工场',
      description: '让通用 AI 成为数字员工，让 AI 拥有岗位、职责、技能和工作流程，持续完成真实任务，并留下可核验的工作成果'
    }
  },
  themeConfig: {
    siteTitle: 'Digital Employee Works',
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/joinwell52-AI/joinwell52' }],
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
            { text: 'TMPA', link: '/en/publications/tmpa-architecture-paper-a0.7' },
            { text: 'FCoP Official Site', link: 'https://joinwell52-ai.github.io/FCoP/' },
            { text: 'CodeFlowMu', link: 'https://github.com/joinwell52-AI/CodeFlowMu-open' },
            { text: 'Research Report Production Engine V1.3', link: '/en/publications/research-report-production-engine-v1.3' },
            { text: 'Digital Employee Architecture', link: '/en/digital-employee/architecture' },
            { text: 'Research Runtime Center V5.0', link: '/en/runtime/' }
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
            { text: 'TMPA', link: '/zh/publications/tmpa-architecture-paper-a0.7' },
            { text: 'FCoP 官网', link: 'https://joinwell52-ai.github.io/FCoP/' },
            { text: 'CodeFlowMu', link: 'https://github.com/joinwell52-AI/CodeFlowMu-open' },
            { text: '研究报告生产机 V1.3', link: '/zh/publications/research-report-production-engine-v1.3' },
            { text: '数字员工纲领性架构', link: '/zh/digital-employee/architecture' },
            { text: 'Research Runtime Center V5.0', link: '/zh/runtime/' }
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
