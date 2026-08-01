import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import PortalHome from './components/PortalHome.vue'
import './custom.css'
import './mobile-fix.css'
import './rvs.css'
import './portal-v5.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PortalHome', PortalHome)
  }
} satisfies Theme
