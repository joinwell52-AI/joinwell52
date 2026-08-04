<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'

const route = useRoute()
const { isDark } = useData()

const siteBase = withBase('/')
const relativePath = computed(() => {
  const path = route.path.replace(/index\.html$/, '')
  if (path.startsWith(siteBase)) return `/${path.slice(siteBase.length)}`
  return path
})
const chinese = computed(() => relativePath.value === '/zh/' || relativePath.value.startsWith('/zh/'))
const normalizedPath = computed(() => {
  const path = relativePath.value
  return path.endsWith('/') ? path : `${path}/`
})
const homeLikePaths = [
  '/',
  '/zh/',
  '/en/',
  '/zh/preview/research-center-home/',
  '/en/preview/research-center-home/'
]
const visible = computed(() => !homeLikePaths.includes(normalizedPath.value))
const label = computed(() => chinese.value ? '返回上一页' : 'Back')
const zhPath = computed(() => {
  const path = normalizedPath.value
  if (path === '/' || path === '/en/') return withBase('/zh/')
  if (path.startsWith('/en/')) return withBase(`/zh/${path.slice(4)}`)
  if (path.startsWith('/zh/')) return withBase(path)
  return withBase('/zh/')
})
const enPath = computed(() => {
  const path = normalizedPath.value
  if (path === '/' || path === '/en/') return withBase('/')
  if (path === '/zh/') return withBase('/')
  if (path.startsWith('/zh/')) return withBase(`/en/${path.slice(4)}`)
  if (path.startsWith('/en/')) return withBase(path)
  return withBase('/')
})

function goBack() {
  if (typeof window === 'undefined') return

  if (window.history.length > 1) {
    window.history.back()
    return
  }

  window.location.assign(withBase(chinese.value ? '/zh/' : '/'))
}

function toggleAppearance() {
  isDark.value = !isDark.value
}
</script>

<template>
  <nav class="global-controls" :aria-label="chinese ? '语言与明暗风格' : 'Language and appearance'">
    <div class="global-language">
      <strong v-if="chinese">中文</strong><a v-else :href="zhPath">中文</a>
      <strong v-if="!chinese">EN</strong><a v-else :href="enPath">EN</a>
    </div>
    <button class="global-appearance" type="button" @click="toggleAppearance">
      <span aria-hidden="true">☀</span>
      <b>{{ isDark ? (chinese ? '暗色' : 'Dark') : (chinese ? '明亮' : 'Light') }}</b>
    </button>
    <a class="global-github" href="https://github.com/joinwell52-AI/joinwell52" aria-label="GitHub">◉</a>
  </nav>

  <button
    v-if="visible"
    class="global-back"
    type="button"
    :aria-label="label"
    @click="goBack"
  >
    <span class="global-back-arrow" aria-hidden="true">←</span>
    <span>{{ label }}</span>
  </button>
</template>

<style scoped>
:global(.rc-controls),
:global(.VPNavBarAppearance),
:global(.VPNavBarTranslations),
:global(.VPNavBarSocialLinks),
:global(.VPSocialLinks) {
  display: none !important;
}

:global(.VPNavBar .container) {
  width: min(1440px, calc(100% - 96px)) !important;
  max-width: none !important;
  margin-inline: auto !important;
  padding-inline: 0 !important;
}

:global(.VPNavBarTitle) {
  position: fixed !important;
  top: 0 !important;
  left: max(48px, calc((100vw - 1440px) / 2)) !important;
  z-index: 102 !important;
  width: auto !important;
  height: 64px !important;
  padding: 0 !important;
}

:global(.VPNavBarSearch) {
  position: fixed !important;
  top: 11px !important;
  left: max(252px, calc((100vw - 1440px) / 2 + 205px)) !important;
  z-index: 101 !important;
}

:global(html[lang='zh-CN'] .VPNavBarTitle .title) {
  position: relative !important;
  display: flex !important;
  align-items: flex-start !important;
  height: 64px !important;
  padding-top: 15px !important;
  color: transparent !important;
  font-size: 0 !important;
}

:global(html[lang='zh-CN'] .VPNavBarTitle .title span) {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  color: transparent !important;
  font-size: 0 !important;
}

:global(html[lang='zh-CN'] .VPNavBarTitle .title span::before) {
  content: '数字员工' !important;
  display: inline-block !important;
  color: transparent !important;
  background: linear-gradient(105deg, #101827 0%, #334765 46%, #5e51ef 78%, #20aac2 100%) !important;
  background-clip: text !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  font-family: "Microsoft YaHei UI", "PingFang SC", "Noto Sans SC", sans-serif !important;
  font-size: 21px !important;
  font-weight: 950 !important;
  line-height: 28px !important;
  letter-spacing: -.065em !important;
}

:global(html[lang='zh-CN'] .VPNavBarTitle .title span::after) {
  content: '工场' !important;
  display: inline-grid !important;
  width: 28px !important;
  height: 28px !important;
  place-items: center !important;
  color: #fff !important;
  background: linear-gradient(145deg, #6758f6 0%, #3f72df 62%, #21afc2 100%) !important;
  -webkit-text-fill-color: #fff !important;
  border-radius: 7px !important;
  box-shadow: 0 6px 15px rgba(67,73,208,.24), inset 0 0 0 1px rgba(255,255,255,.18) !important;
  font-family: "Microsoft YaHei UI", "PingFang SC", "Noto Sans SC", sans-serif !important;
  font-size: 9px !important;
  font-weight: 900 !important;
  line-height: 1 !important;
}

:global(html[lang='zh-CN'] .VPNavBarTitle .title::after) {
  content: 'DIGITAL EMPLOYEE WORKS' !important;
  position: absolute !important;
  top: 45px !important;
  left: 1px !important;
  color: #7a879d !important;
  -webkit-text-fill-color: #7a879d !important;
  font: 800 6.5px/1 ui-sans-serif, system-ui, sans-serif !important;
  letter-spacing: .16em !important;
}

:global(html:not([lang='zh-CN']) .VPNavBarTitle .title) {
  display: flex !important;
  align-items: center !important;
  height: 64px !important;
  max-width: 190px !important;
  overflow: hidden !important;
  color: var(--vp-c-text-1) !important;
  font-size: 14.5px !important;
  font-weight: 850 !important;
  letter-spacing: -.04em !important;
  white-space: nowrap !important;
}

.global-controls {
  position: fixed;
  top: 11px;
  right: max(48px, calc((100vw - 1440px) / 2));
  z-index: 110;
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 42px;
  padding: 4px;
  color: #172039;
  background: rgba(255,255,255,.96);
  border: 1px solid #dfe4ee;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(16,25,54,.12);
  backdrop-filter: blur(16px);
}

.global-language {
  display: grid;
  grid-template-columns: repeat(2, minmax(44px, auto));
  align-items: center;
  padding-right: 4px;
  border-right: 1px solid #dfe4ee;
  font: 760 12px/1 ui-sans-serif, system-ui, sans-serif;
}

.global-language strong,
.global-language a {
  display: grid;
  min-height: 32px;
  padding: 0 10px;
  place-items: center;
  border-radius: 18px;
  text-decoration: none;
}

.global-language strong { color: #fff; background: #121a34; }
.global-language a { color: #4c5670; }
.global-appearance { display: flex; align-items: center; gap: 6px; min-height: 32px; padding: 0 11px; color: #242d45; background: transparent; border: 0; border-radius: 18px; cursor: pointer; font: 760 12px/1 ui-sans-serif, system-ui, sans-serif; }
.global-github { display: grid; width: 34px; height: 34px; place-items: center; color: #505866; border-left: 1px solid #dfe4ee; text-decoration: none; font-size: 18px; }

:global(.dark) .global-controls { color: #fff; background: rgba(14,19,38,.96); border-color: rgba(255,255,255,.14); }
:global(.dark) .global-language { border-right-color: rgba(255,255,255,.14); }
:global(.dark) .global-language strong { color: #11182e; background: #fff; }
:global(.dark) .global-language a,
:global(.dark) .global-appearance,
:global(.dark) .global-github { color: #d5dcef; }

.global-back {
  position: fixed;
  top: calc(var(--vp-nav-height, 64px) + 14px);
  left: max(16px, calc((100vw - 1440px) / 2));
  z-index: 24;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 38px;
  padding: 8px 13px;
  color: var(--vp-c-text-1);
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, .12);
  backdrop-filter: blur(14px);
  cursor: pointer;
  font: 600 13px/1 var(--vp-font-family-base);
}

.global-back:hover { color: var(--vp-c-brand-1); background: var(--vp-c-bg-soft); border-color: var(--vp-c-brand-1); transform: translateX(-2px); }
.global-back:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
.global-back-arrow { font-size: 18px; line-height: 1; }

@media (max-width: 960px) {
  :global(.VPNavBarTitle) { left: 16px !important; }
  :global(.VPNavBarSearch) { position: static !important; }
  .global-controls { right: 14px; }
  .global-github { display: none; }
  .global-back { top: calc(var(--vp-nav-height, 64px) + 10px); left: 12px; min-height: 36px; padding: 7px 11px; font-size: 12px; }
}

@media (max-width: 699px) {
  .global-controls { top: 66px; }
}

@media print {
  .global-back,
  .global-controls { display: none; }
}
</style>
