import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { withBase } from 'vitepress'
import PortalHome from './components/PortalHome.vue'
import ArticleCover from './components/ArticleCover.vue'
import './custom.css'
import './mobile-fix.css'
import './rvs.css'
import './portal-v5.css'
import './portal-v5-language.css'
import './article-cover.css'

function enhancePortal() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return

  const siteBase = withBase('/')

  // Ensure dynamic portal links include the GitHub Pages project base path.
  document.querySelectorAll<HTMLAnchorElement>('.rcv5 a[href^="/"]').forEach((anchor) => {
    const href = anchor.getAttribute('href') || ''
    if (href && !href.startsWith(siteBase)) anchor.setAttribute('href', withBase(href))
  })

  // Place an explicit language selector inside the first screen, in addition
  // to the standard VitePress language menu in the navigation bar.
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
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('PortalHome', PortalHome)
    app.component('ArticleCover', ArticleCover)

    if (typeof window !== 'undefined') {
      const apply = () => window.requestAnimationFrame(enhancePortal)
      window.setTimeout(apply, 0)
      window.setTimeout(apply, 160)
      router.onAfterRouteChange = apply
    }
  }
} satisfies Theme
