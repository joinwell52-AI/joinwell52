import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { withBase } from 'vitepress'
import PortalHome from './components/PortalHome.vue'
import ArticleCover from './components/ArticleCover.vue'
import ResearchNotes from './components/ResearchNotes.vue'
import ResearchCategory from './components/ResearchCategory.vue'
import RuntimeCenter from './components/RuntimeCenter.vue'
import RuntimeOperationsCenter from './components/RuntimeOperationsCenter.vue'
import RuntimeOperationsCenterV4 from './components/RuntimeOperationsCenterV4.vue'
import ResearchIntelligenceRadar from './components/ResearchIntelligenceRadar.vue'
import ResearchCenterHome from './components/ResearchCenterHome.vue'
import GlobalBack from './components/GlobalBack.vue'
import './custom.css'
import './mobile-fix.css'
import './rvs.css'
import './portal-v5.css'
import './portal-v5-language.css'
import './article-cover.css'
import './production-engine-v1.3.css'
import './homepage-frame-fix.css'
import './column-palette-final.css'

const zhRuntimeText: Record<string, string> = {
  'RESEARCH RUNTIME CENTER · 运行控制平面': '工场运行中心 · 运行控制平面',
  'Research Runtime Center': '工场运行中心',
  'RESEARCH CENTER 3.0': '数字员工工场',
  '进入 Runtime Center': '进入工场运行中心',
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
  'Research Runtime Production': '研究运行生产',
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

function pairedLanguagePath() {
  if (typeof window === 'undefined') return withBase('/')

  const siteBase = withBase('/')
  const relative = window.location.pathname.startsWith(siteBase)
    ? window.location.pathname.slice(siteBase.length)
    : window.location.pathname.replace(/^\//, '')

  if (!relative || relative === 'index.html') return withBase('/zh/')
  if (relative === 'zh' || relative === 'zh/' || relative === 'zh/index.html') return withBase('/')
  if (relative.startsWith('zh/')) return withBase(`/en/${relative.slice(3)}`)
  if (relative === 'en' || relative === 'en/' || relative === 'en/index.html') return withBase('/zh/')
  if (relative.startsWith('en/')) return withBase(`/zh/${relative.slice(3)}`)
  return withBase('/zh/')
}

function enhanceLanguageRouting() {
  if (typeof document === 'undefined') return
  const target = pairedLanguagePath()
  document.querySelectorAll<HTMLAnchorElement>('.VPNavBarTranslations a, .VPNavScreenTranslations a').forEach((anchor) => {
    anchor.setAttribute('href', target)
  })
}

function reorderCapabilityCards() {
  if (typeof document === 'undefined') return

  const reorder = (rootSelector: string, selectors: string[], numberSelector?: string) => {
    document.querySelectorAll<HTMLElement>(rootSelector).forEach((root) => {
      selectors.forEach((selector, index) => {
        const card = root.querySelector<HTMLElement>(selector)
        if (!card) return
        root.appendChild(card)
        if (numberSelector) {
          const number = card.querySelector<HTMLElement>(numberSelector)
          if (number) number.textContent = String(index + 1).padStart(2, '0')
        }
      })
    })
  }

  reorder(
    '.rc-programs',
    ['.rc-program--tmpa', '.rc-program--fcop', '.rc-program--codeflow', '.rc-program--employee'],
    '.rc-program__cover > b'
  )
  reorder(
    '.rcv5-program-grid',
    ['.tmpa', '.fcop-program', '.codeflow', '.employee']
  )
}

function enhanceProductionEngineV13(chinese: boolean) {
  if (typeof document === 'undefined') return

  const releasePath = withBase(chinese
    ? '/zh/publications/research-report-production-engine-v1.3'
    : '/en/publications/research-report-production-engine-v1.3')

  document.querySelectorAll<HTMLAnchorElement>(
    '.rc-home a[href*="research-report-production-engine-v1.0"], .rcv5 a[href*="research-report-production-engine-v1.0"]'
  ).forEach((anchor) => anchor.setAttribute('href', releasePath))

  const replacements: Record<string, string> = chinese ? {
    '研究报告生产机 V1.0': '研究报告生产机 V1.3',
    '从数字员工 到运行与协议': '从理论与协议 到运行与产品',
    '工场生产数字员工；数字员工能力建立在 CodeFlowMu 与 FCoP 之上；其治理理论与规范边界记录在 TMPA 论文体系中。产品、工程与理论分别接受与自身相称的验证。': 'TMPA 固定理论与规范边界，FCoP 承载可重建的协同事实；CodeFlowMu 将其转化为数字员工开发与工作 Runtime，Digital Employee 是最终产品与交付层。'
  } : {
    'Research Report Production Engine V1.0': 'Research Report Production Engine V1.3',
    'From Digital Employee to Runtime and protocol': 'From theory and protocol to runtime and product',
    'The Works produces Digital Employees. Their capabilities are built on CodeFlowMu and FCoP, while the governing theory and specification boundaries are recorded independently in TMPA. Product, engineering, and theory are validated by standards appropriate to each layer.': 'TMPA fixes the theory and specification boundary; FCoP carries reconstructable coordination facts; CodeFlowMu turns them into a Digital Employee development and work Runtime; Digital Employee is the final product and delivery layer.'
  }

  document.querySelectorAll<HTMLElement>('.rc-home, .rcv5').forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let node = walker.nextNode()
    while (node) {
      const value = node.textContent || ''
      let replaced = value
      for (const [source, target] of Object.entries(replacements)) replaced = replaced.replaceAll(source, target)
      if (replaced !== value) node.textContent = replaced
      node = walker.nextNode()
    }
  })

  document.querySelectorAll<HTMLElement>('.rcv5-engine-version > strong, .rcv5-dashboard > div:first-child > b')
    .forEach((element) => { element.textContent = 'V1.3' })
}

function enhanceImplementationCaseI07(chinese: boolean) {
  if (typeof document === 'undefined') return

  const casePath = withBase(chinese
    ? '/zh/publications/implementation-case-i0.7'
    : '/en/publications/implementation-case-i0.7')

  document.querySelectorAll<HTMLAnchorElement>(
    '.rc-home a[href*="implementation-case-i0.5"], .rcv5 a[href*="implementation-case-i0.5"], .rc-home a[href*="implementation-case-i0.6"], .rcv5 a[href*="implementation-case-i0.6"]'
  ).forEach((anchor) => anchor.setAttribute('href', casePath))

  const replacements: Record<string, string> = chinese ? {
    'I0.5': 'I0.7',
    'I0.6': 'I0.7',
    'WP-13 多 Agent 事实复核': 'V1.4.1 · C01–C14 14/14',
    'S0.5 作者运行产品证据与 WP-13 治理案例': 'V1.4.1 · C01–C14 14/14'
  } : {
    'I0.5': 'I0.7',
    'I0.6': 'I0.7',
    'WP-13 multi-agent fact check': 'V1.4.1 · C01–C14 14/14',
    'S0.5 author-run product evidence and the WP-13 governance case': 'V1.4.1 · C01–C14 14/14'
  }

  document.querySelectorAll<HTMLElement>('.rc-home, .rcv5').forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let node = walker.nextNode()
    while (node) {
      const value = node.textContent || ''
      let replaced = value
      for (const [source, target] of Object.entries(replacements)) replaced = replaced.replaceAll(source, target)
      if (replaced !== value) node.textContent = replaced
      node = walker.nextNode()
    }
  })
}

function enhancePortal() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return

  const siteBase = withBase('/')
  const chinese = window.location.pathname.includes(`${siteBase}zh/`)

  document.querySelectorAll<HTMLElement>('.VPNavBarTitle .title span').forEach((title) => {
    title.textContent = chinese ? '数字员工工场' : 'Digital Employee Works'
  })

  document.querySelectorAll<HTMLAnchorElement>('.rcv5 a[href^="/"]').forEach((anchor) => {
    const href = anchor.getAttribute('href') || ''
    if (href && !href.startsWith(siteBase)) anchor.setAttribute('href', withBase(href))
  })

  document.querySelectorAll<HTMLAnchorElement>('.runtime-v4 .hero-actions a').forEach((anchor) => {
    anchor.setAttribute('href', withBase(chinese ? '/zh/runtime/v4' : '/en/runtime/v4'))
  })

  const heroCopy = document.querySelector<HTMLElement>('.rcv5 .rcv5-hero-copy')
  if (heroCopy && !heroCopy.querySelector('.rcv5-language-switch')) {
    const switcher = document.createElement('nav')
    switcher.className = 'rcv5-language-switch'
    switcher.setAttribute('aria-label', chinese ? '语言选择' : 'Language selection')

    const otherHref = chinese ? withBase('/') : withBase('/zh/')
    switcher.innerHTML = chinese
      ? `<strong>中文</strong><span>/</span><a href="${otherHref}">EN</a>`
      : `<strong>EN</strong><span>/</span><a href="${otherHref}">中文</a>`

    heroCopy.prepend(switcher)
  }

  reorderCapabilityCards()
  enhanceProductionEngineV13(chinese)
  enhanceImplementationCaseI07(chinese)
  enhanceLanguageRouting()
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
    app.component('RuntimeOperationsCenter', RuntimeOperationsCenter)
    app.component('RuntimeOperationsCenterV4', RuntimeOperationsCenterV4)
    app.component('ResearchIntelligenceRadar', ResearchIntelligenceRadar)
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
