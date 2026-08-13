<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { articleTypes } from './article-types'
import { editorialLevel } from './editorial-rating'
import scorecard from '../../generated/editorial-scorecard.json'

const { frontmatter, page } = useData()
const type = computed(() => articleTypes[String(frontmatter.value.article_type || '')])
const chinese = computed(() => page.value.relativePath.startsWith('zh/'))
const canonicalPath = computed(() => {
  const path = page.value.relativePath
    .replace(/^(?:zh|en)\//, '/')
    .replace(/\.md$/, '')
    .replace(/\/index$/, '')
  return path || '/'
})
const rating = computed(() => scorecard.items.find(item => item.path === canonicalPath.value))
const ratingLevel = computed(() => editorialLevel(rating.value?.score ?? null))
const ratingLabel = computed(() => rating.value
  ? (chinese.value ? rating.value.publicLabel : rating.value.publicLabel_en)
  : (chinese.value ? '待周评' : 'Awaiting weekly review'))
</script>

<template>
  <div v-if="type || rating" class="article-badges">
    <div v-if="type" class="article-type-badge" aria-label="Article type">
      <strong>{{ chinese ? type.zh : type.en }}</strong>
      <span>{{ chinese ? type.en : type.zh }}</span>
    </div>
    <div class="article-score-badge" :class="[`rating-${ratingLevel}`, { pending: !rating }]" aria-label="Weekly editorial rating">
      <strong>{{ ratingLabel }}</strong>
      <span v-if="rating">{{ rating.score }} / 100</span>
    </div>
  </div>
</template>

<style scoped>
.article-badges{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 18px}.article-type-badge,.article-score-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 11px;border:1px solid color-mix(in srgb,var(--vp-c-brand-1) 42%,transparent);border-radius:999px;background:var(--vp-c-brand-soft);color:var(--vp-c-brand-1);font-size:12px;line-height:1.2}.article-type-badge strong,.article-score-badge strong{font-weight:800}.article-type-badge span,.article-score-badge span{color:currentColor;font-size:10px;font-weight:650;opacity:.78}.article-score-badge.rating-benchmark{border-color:rgba(249,115,22,.58);background:rgba(249,115,22,.13);color:#c2410c}.article-score-badge.rating-excellent{border-color:rgba(242,201,76,.62);background:rgba(242,201,76,.14);color:#c28a00}.article-score-badge.rating-quality{border-color:rgba(94,234,212,.52);background:rgba(94,234,212,.12);color:#159c91}.article-score-badge.rating-passing{border-color:rgba(96,165,250,.5);background:rgba(96,165,250,.11);color:#347bd1}.article-score-badge.rating-foundation{border-color:rgba(148,163,184,.46);background:rgba(148,163,184,.1);color:#64748b}.article-score-badge.pending{border-style:dashed;color:var(--vp-c-text-2)}:global(.dark .article-score-badge.rating-benchmark){color:#fb923c}:global(.dark .article-score-badge.rating-excellent){color:#f2c94c}:global(.dark .article-score-badge.rating-quality){color:#5eead4}:global(.dark .article-score-badge.rating-passing){color:#7db8ff}:global(.dark .article-score-badge.rating-foundation){color:#aab6c7}
</style>
