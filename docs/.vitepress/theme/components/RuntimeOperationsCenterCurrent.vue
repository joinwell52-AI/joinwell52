<script setup lang="ts">
import { computed } from 'vue'
import legacyData from '../../generated/runtime-legacy-records.json'
import RuntimeOperationsCenterClassic from './RuntimeOperationsCenterClassic.vue'
import RuntimeOperationsCenterLegacy from './RuntimeOperationsCenterLegacy.vue'

type Lang = 'en' | 'zh'
type LegacyData = { current: unknown | null }

const props = withDefaults(defineProps<{ lang?: Lang }>(), { lang: 'en' })
const legacy = legacyData as LegacyData
const useLegacy = computed(() => Boolean(legacy.current))
</script>

<template>
  <RuntimeOperationsCenterLegacy v-if="useLegacy" :lang="props.lang" />
  <RuntimeOperationsCenterClassic v-else :lang="props.lang" />
</template>
