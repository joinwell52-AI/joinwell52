import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import PortalHome from './components/PortalHome.vue'
import ArticleCover from './components/ArticleCover.vue'
import './custom.css'
import './mobile-fix.css'
import './rvs.css'
import './portal-v5.css'
import './article-cover.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PortalHome', PortalHome)
    app.component('ArticleCover', ArticleCover)
  }
} satisfies Theme
