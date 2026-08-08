<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })
let observer: MutationObserver | undefined

function enhance() {
  if (typeof document === 'undefined') return
  document.querySelectorAll<HTMLElement>('.runtime-center-page .runtime-classic .shift-card').forEach((card) => {
    if (card.dataset.collapseReady === '1') return
    const hasDetails = card.querySelector('.result-grid, .metric-grid, .artifact-list')
    if (!hasDetails) return
    card.dataset.collapseReady = '1'
    card.classList.add('runtime-collapsible', 'is-collapsed')
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'runtime-detail-toggle'
    button.setAttribute('aria-expanded', 'false')
    const setLabel = (expanded: boolean) => {
      button.textContent = expanded
        ? (props.lang === 'zh' ? '收起详情 ↑' : 'Hide details ↑')
        : (props.lang === 'zh' ? '查看详情 ↓' : 'View details ↓')
    }
    setLabel(false)
    button.addEventListener('click', () => {
      const expanded = card.classList.toggle('is-expanded')
      card.classList.toggle('is-collapsed', !expanded)
      button.setAttribute('aria-expanded', String(expanded))
      setLabel(expanded)
    })
    const head = card.querySelector('.shift-head')
    if (head) head.insertAdjacentElement('afterend', button)
  })
}

onMounted(() => {
  enhance()
  observer = new MutationObserver(enhance)
  observer.observe(document.body, { childList: true, subtree: true })
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template><span class="runtime-collapse-enhancer" aria-hidden="true"></span></template>

<style>
.runtime-center-page .runtime-detail-toggle{display:inline-flex;align-items:center;justify-content:center;min-height:38px;margin-top:16px;padding:0 14px;color:var(--rt-link,var(--vp-c-brand-1));background:var(--rt-card-bg,var(--vp-c-bg));border:1px solid var(--rt-line,var(--vp-c-divider));border-radius:999px;font:760 13px/1 system-ui;cursor:pointer}
.runtime-center-page .runtime-collapsible.is-collapsed .result-grid,
.runtime-center-page .runtime-collapsible.is-collapsed .metric-grid,
.runtime-center-page .runtime-collapsible.is-collapsed .artifact-list{display:none!important}
.runtime-center-page .runtime-collapsible.is-expanded .runtime-detail-toggle{margin-bottom:2px}
@media(min-width:900px){.runtime-center-page .runtime-collapsible.is-collapsed .result-grid{display:grid!important}.runtime-center-page .runtime-collapsible.is-collapsed .metric-grid{display:flex!important}.runtime-center-page .runtime-collapsible.is-collapsed .artifact-list{display:flex!important}.runtime-center-page .runtime-detail-toggle{display:none}}
</style>