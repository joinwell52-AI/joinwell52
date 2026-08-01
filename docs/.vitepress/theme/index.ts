import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { withBase } from 'vitepress'
import PortalHome from './components/PortalHome.vue'
import ArticleCover from './components/ArticleCover.vue'
import './custom.css'
import './mobile-fix.css'
import './rvs.css'
import './portal-v5.css'
import './article-cover.css'

function fixPortalLinks() {
  if (typeof document === 'undefined') return
  const siteBase = withBase('/')
  document.querySelectorAll<HTMLAnchorElement>('.rcv5 a[href^="/"]').forEach((anchor) => {
    const href = anchor.getAttribute('href') || ''
    if (href && !href.startsWith(siteBase)) anchor.setAttribute('href', withBase(href))
  })
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('PortalHome', PortalHome)
    app.component('ArticleCover', ArticleCover)

    if (typeof window !== 'undefined') {
      const apply = () => window.requestAnimationFrame(fixPortalLinks)
      window.setTimeout(apply, 0)
      router.onAfterRouteChanged = apply
    }
  }
} satisfies Theme
