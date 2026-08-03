import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { withBase } from 'vitepress'
import PortalHome from './components/PortalHome.vue'
import ArticleCover from './components/ArticleCover.vue'
import ResearchNotes from './components/ResearchNotes.vue'
import ResearchCategory from './components/ResearchCategory.vue'
import RuntimeCenter from './components/RuntimeCenter.vue'
import ResearchCenterHome from './components/ResearchCenterHome.vue'
import GlobalBack from './components/GlobalBack.vue'
import './custom.css'
import './mobile-fix.css'
import './rvs.css'
import './portal-v5.css'
import './portal-v5-language.css'
import './article-cover.css'

const zhRuntimeText: Record<string, string> = {
  'RESEARCH RUNTIME CENTER · 运行控制平面': '研究运行中心 · 运行控制平面',
  'Research Runtime Center': '研究运行中心',
  'RESEARCH CENTER 3.0': '研究中心 3.0',
  '进入 Runtime Center': '进入研究运行中心',
  '查看 Runtime Charter': '查看运行章程',
  'Runtime Timeline': '运行时间线',
  '七个正式 Runtime 任务': '七个正式运行任务',
  'Runtime History': '运行历史',
  'Runtime Status': '运行状态',
  'GitHub Status': 'GitHub 状态',
  'Publication Status': '发布状态',
  'Queue Status': '队列状态',
  'Engine Status': '引擎状态',
  '数据来源：Runtime Record': '数据来源：运行记录',
  'Scheduler Manifest · Single Source': '调度清单 · 唯一事实源',
  'Runtime Gate': '运行发布门禁',
  'Candidate · Priority · Lifecycle': '候选 · 优先级 · 生命周期',
  'Signal → Release': '信号 → 发布',
  'Commit pending': '等待提交',
  'Running': '运行中',
  'Completed': '已完成',
  'Blocked': '已阻塞',
  'Failed': '失败',
  'Skipped': '已跳过',
  'Waiting': '等待中',
  'Research Runtime Engine': '研究运行引擎',
  'Research Runtime Queue': '研究运行队列',
  'Research Runtime Knowledge': '研究运行知识',
  'Research Runtime Architecture': '研究运行架构评审',
  'Research Runtime Publication': '研究运行每日发布',
  'Research Runtime Weekly': '研究运行每周综合',
  'Research Runtime Academic': '研究运行学术研究',
  'Research Runtime Scheduler': '研究运行调度器',
  'Research Runtime Scheduler V1.0 Upgrade': '研究运行调度器 V1.0 升级',
  'Research OS lifecycle state': '研究操作系统生命周期状态',
  'Research Queue': '研究队列',
  'Runtime Knowledge': '运行知识',
  'Architecture decisions': '架构决策',
  'Daily Publication': '每日研究发布',
  'Weekly Publication': '每周综合发布',
  'Academic Publication': '学术研究发布',
  'Runtime Started': '运行开始',
  'Runtime Artifacts Generated': '运行产物已生成',
  'Pull Request Validation': '拉取请求验证',
  'GitHub Commit': 'GitHub 提交',
  'Commit Verify': '提交验证',
  'Runtime Completed': '运行完成'
}

function localizeChineseRuntime() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return
  const siteBase = withBase('/')
  if (!window.location.pathname.includes(`${siteBase}zh/`)) return

  document.querySelectorAll<HTMLElement>('.center-v3, .runtime').forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let node = walker.nextNode()
    while (node) {
      const value = node.textContent?.trim() || ''
      if (zhRuntimeText[value]) node.textContent = node.textContent!.replace(value, zhRuntimeText[value])
      node = walker.nextNode()
    }
  })
}

function enhancePortal() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return

  const siteBase = withBase('/')

  document.querySelectorAll<HTMLAnchorElement>('.rcv5 a[href^="/"]').forEach((anchor) => {
    const href = anchor.getAttribute('href') || ''
    if (href && !href.startsWith(siteBase)) anchor.setAttribute('href', withBase(href))
  })

  const heroCopy = document.querySelector<HTMLElement>('.rcv5 .rcv5-hero-copy')
  if (heroCopy && !heroCopy.querySelector('.rcv5-language-switch')) {
    const chinese = window.location.pathname.includes(`${siteBase}zh/`)
    const switcher = document.createElement('nav')
    switcher.className = 'rcv5-language-switch'
    switcher.setAttribute('aria-label', chinese ? '语言选择' : 'Language selection')

    const otherHref = chinese ? withBase('/') : withBase('/zh/')
    switcher.innerHTML = chinese
      ? `<strong>中文</strong><span>/</span><a href="${otherHref}">EN</a>`
      : `<strong>EN</strong><span>/</span><a href="${otherHref}">中文</a>`

    heroCopy.prepend(switcher)
  }

  localizeChineseRuntime()
}

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'layout-top': () => h(GlobalBack)
  }),
  enhanceApp({ app, router }) {
    app.component('PortalHome', PortalHome)
    app.component('ArticleCover', ArticleCover)
    app.component('ResearchNotes', ResearchNotes)
    app.component('ResearchCategory', ResearchCategory)
    app.component('RuntimeCenter', RuntimeCenter)
    app.component('ResearchCenterHome', ResearchCenterHome)

    if (typeof window !== 'undefined') {
      const apply = () => window.requestAnimationFrame(enhancePortal)
      window.setTimeout(apply, 0)
      window.setTimeout(apply, 160)
      window.setTimeout(apply, 420)
      router.onAfterRouteChange = apply
    }
  }
} satisfies Theme
