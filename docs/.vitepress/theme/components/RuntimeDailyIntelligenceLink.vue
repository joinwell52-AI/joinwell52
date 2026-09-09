<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })
const zh = computed(() => props.lang === 'zh')
const href = computed(() => withBase(zh.value
  ? '/zh/runtime/daily-intelligence/'
  : '/en/runtime/daily-intelligence/'))
const label = computed(() => zh.value ? '每日动态' : 'Daily Intelligence')
</script>

<template>
  <Teleport to=".runtime-classic .hero-actions">
    <a class="runtime-daily-intelligence-link" :href="href">{{ label }} →</a>
  </Teleport>
</template>

<style>
.runtime-daily-intelligence-link {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  color: var(--rt-link) !important;
  background: color-mix(in srgb, var(--rt-accent) 8%, var(--rt-card-bg));
  border: 1px solid color-mix(in srgb, var(--rt-accent) 28%, transparent);
  border-radius: 999px;
  font-size: 14px !important;
  font-weight: 820 !important;
  white-space: nowrap;
  transition: transform .16s ease, border-color .16s ease, background .16s ease;
}
.runtime-daily-intelligence-link:hover {
  transform: translateY(-1px);
  background: color-mix(in srgb, var(--rt-accent) 13%, var(--rt-card-bg));
  border-color: color-mix(in srgb, var(--rt-accent) 42%, transparent);
}
</style>
