---
layout: home
pageClass: runtime-center-page
title: Digital Researcher Operations Center
description: Today's authentic Runtime data, three-column plan, dynamic shift total, production, release, work results and GitHub evidence.
outline: false
---

<script setup>
import legacyData from '../../.vitepress/generated/runtime-legacy-records.json'
import RuntimeOperationsCenterCurrent from '../../.vitepress/theme/components/RuntimeOperationsCenterCurrent.vue'
const showV5Intelligence = !legacyData.current
</script>

<RuntimeOperationsCenterCurrent lang="en" />

<ResearchIntelligenceRadar v-if="showV5Intelligence" lang="en" />
