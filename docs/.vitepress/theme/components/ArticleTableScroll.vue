<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from 'vue'

const props = defineProps<{ language: 'zh' | 'en' }>()
const anchor = ref<HTMLElement>()
const prefix = useId()
const cleanups: Array<() => void> = []

// Opt in per article. Keep the rendered tables and their native touch scrolling.
onMounted(() => {
  const root = anchor.value?.closest('.vp-doc')
  root?.querySelectorAll<HTMLTableElement>('table').forEach((table, index) => {
    const previousId = table.getAttribute('id')
    const previousTabindex = table.getAttribute('tabindex')
    const id = previousId || `article-table-${prefix}-${index + 1}`
    const control = document.createElement('label')
    control.className = 'article-table-control'
    control.hidden = true
    const hint = document.createElement('span')
    hint.textContent = props.language === 'zh'
      ? '左右拖动，查看完整表格'
      : 'Drag left or right to view the full table'
    const slider = document.createElement('input')
    slider.type = 'range'
    slider.min = '0'
    slider.max = '100'
    slider.step = '0.1'
    slider.value = '0'
    slider.setAttribute('aria-controls', id)
    slider.setAttribute('aria-label', props.language === 'zh'
      ? `表格 ${index + 1} 横向滚动位置`
      : `Table ${index + 1} horizontal scroll position`)
    control.append(hint, slider)
    table.id = id
    table.classList.add('article-scroll-table')
    table.after(control)

    const sync = () => {
      const maximum = Math.max(0, table.scrollWidth - table.clientWidth)
      const percent = maximum <= 1 ? 0 : maximum - table.scrollLeft <= 1
        ? 100 : Math.min(100, Math.max(0, table.scrollLeft / maximum * 100))
      control.hidden = maximum <= 1
      slider.disabled = maximum <= 1
      slider.value = String(percent)
      slider.setAttribute('aria-valuetext', `${Math.round(percent)}%`)
      table.tabIndex = maximum > 1 ? 0 : -1
    }
    const move = () => {
      table.scrollLeft = Number(slider.value) / 100 * (table.scrollWidth - table.clientWidth)
      sync()
    }
    slider.addEventListener('input', move)
    table.addEventListener('scroll', sync, { passive: true })
    const resize = new ResizeObserver(sync)
    resize.observe(table)
    // Fonts and wrapped cell contents can resize without changing the table viewport.
    Array.from(table.children).forEach((section) => resize.observe(section))
    sync()

    cleanups.push(() => {
      resize.disconnect()
      slider.removeEventListener('input', move)
      table.removeEventListener('scroll', sync)
      control.remove()
      table.classList.remove('article-scroll-table')
      if (previousId === null) table.removeAttribute('id')
      else table.setAttribute('id', previousId)
      if (previousTabindex === null) table.removeAttribute('tabindex')
      else table.setAttribute('tabindex', previousTabindex)
    })
  })
})

onBeforeUnmount(() => cleanups.forEach((cleanup) => cleanup()))
</script>

<template>
  <span ref="anchor" hidden aria-hidden="true"></span>
</template>

<style>
.VPDoc .vp-doc table.article-scroll-table {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
}
.article-table-control { display: none; }

@media (max-width: 767px) {
  .VPDoc .vp-doc table.article-scroll-table { scrollbar-width: none; }
  .VPDoc .vp-doc table.article-scroll-table::-webkit-scrollbar { display: none; }
  .VPDoc .vp-doc table.article-scroll-table th,
  .VPDoc .vp-doc table.article-scroll-table td {
    min-width: 7.5rem;
  }
  .article-table-control:not([hidden]) {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: -8px 0 24px;
    padding: 8px 12px 2px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-2);
    font-size: 12px;
    line-height: 1.5;
  }
  .article-table-control input {
    display: block;
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    min-width: 0;
    height: 44px;
    margin: 0;
    background: transparent;
    cursor: ew-resize;
    touch-action: pan-y;
  }
  .article-table-control input::-webkit-slider-runnable-track {
    height: 8px;
    border-radius: 8px;
    background: var(--vp-c-divider);
  }
  .article-table-control input::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 44px;
    height: 18px;
    margin-top: -5px;
    border: 0;
    border-radius: 9px;
    background: var(--vp-c-brand-1);
  }
  .article-table-control input::-moz-range-track {
    height: 8px;
    border-radius: 8px;
    background: var(--vp-c-divider);
  }
  .article-table-control input::-moz-range-thumb {
    width: 44px;
    height: 18px;
    border: 0;
    border-radius: 9px;
    background: var(--vp-c-brand-1);
  }
  .article-table-control input:focus-visible,
  .VPDoc .vp-doc table.article-scroll-table:focus-visible {
    outline: 2px solid var(--vp-c-brand-1);
    outline-offset: 3px;
  }
}
@media print {
  .article-table-control { display: none !important; }
}
</style>
