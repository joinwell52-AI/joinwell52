<script setup lang="ts">
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
</script>

<template>
  <header class="article-v5-cover">
    <img :src="withBase(image)" :alt="title">
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
