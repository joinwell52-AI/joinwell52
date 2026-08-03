<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'

defineProps<{
  image: string
  kicker: string
  title: string
  summary?: string
  version?: string
  status?: string
  languageHref?: string
  languageLabel?: string
}>()

const localLink = (path?: string) => path ? withBase(path) : '#'
const coverShape = ref<'portrait' | 'landscape' | 'square' | 'pending'>('pending')

function detectCoverShape(event: Event) {
  const image = event.currentTarget as HTMLImageElement
  const ratio = image.naturalWidth / image.naturalHeight
  coverShape.value = ratio < .9 ? 'portrait' : ratio > 1.1 ? 'landscape' : 'square'
}
</script>

<template>
  <header class="article-v5-cover" :class="`article-v5-cover--${coverShape}`">
    <img :src="withBase(image)" :alt="title" @load="detectCoverShape">
    <div class="article-v5-meta">
      <span>{{ kicker }}</span>
      <h1>{{ title }}</h1>
      <p v-if="summary">{{ summary }}</p>
      <div>
        <b v-if="version">{{ version }}</b>
        <i v-if="status">{{ status }}</i>
        <a v-if="languageHref" :href="localLink(languageHref)">{{ languageLabel }} →</a>
      </div>
    </div>
  </header>
</template>
