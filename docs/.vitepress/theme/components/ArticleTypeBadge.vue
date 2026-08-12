<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { articleTypes } from './article-types'

const { frontmatter, page } = useData()
const type = computed(() => articleTypes[String(frontmatter.value.article_type || '')])
const chinese = computed(() => page.value.relativePath.startsWith('zh/'))
</script>

<template>
  <div v-if="type" class="article-type-badge" aria-label="Article type">
    <strong>{{ chinese ? type.zh : type.en }}</strong>
    <span>{{ chinese ? type.en : type.zh }}</span>
  </div>
</template>

<style scoped>
.article-type-badge{display:inline-flex;align-items:center;gap:8px;margin:0 0 18px;padding:6px 11px;border:1px solid color-mix(in srgb,var(--vp-c-brand-1) 42%,transparent);border-radius:999px;background:var(--vp-c-brand-soft);color:var(--vp-c-brand-1);font-size:12px;line-height:1.2}.article-type-badge strong{font-weight:800}.article-type-badge span{color:var(--vp-c-text-2);font-size:10px;font-weight:650}
</style>
