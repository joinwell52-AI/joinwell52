<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'

const route = useRoute()

const chinese = computed(() => route.path === '/zh/' || route.path.startsWith('/zh/'))
const normalizedPath = computed(() => {
  const path = route.path.replace(/index\.html$/, '')
  return path.endsWith('/') ? path : `${path}/`
})
const visible = computed(() => !['/', '/zh/', '/en/'].includes(normalizedPath.value))
const label = computed(() => chinese.value ? '返回上一页' : 'Back')

function goBack() {
  if (typeof window === 'undefined') return

  if (window.history.length > 1) {
    window.history.back()
    return
  }

  window.location.assign(withBase(chinese.value ? '/zh/' : '/'))
}
</script>

<template>
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
  transition: border-color .18s ease, color .18s ease, background .18s ease, transform .18s ease;
}

.global-back:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
  transform: translateX(-2px);
}

.global-back:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.global-back-arrow {
  font-size: 18px;
  line-height: 1;
}

@media (max-width: 960px) {
  .global-back {
    top: calc(var(--vp-nav-height, 64px) + 10px);
    left: 12px;
    min-height: 36px;
    padding: 7px 11px;
    font-size: 12px;
  }
}

@media (max-width: 420px) {
  .global-back {
    gap: 5px;
    padding-inline: 10px;
  }
}

@media print {
  .global-back { display: none; }
}
</style>
