---
layout: home
pageClass: runtime-center-page
title: 数字研究员运营中心
description: 展示当天真实 Runtime 数据、三栏研究计划、动态班次总数、生产、发版、工作成果与 GitHub 证据。
outline: false
---

<script setup>
import legacyData from '../../.vitepress/generated/runtime-legacy-records.json'
import RuntimeOperationsCenterCurrent from '../../.vitepress/theme/components/RuntimeOperationsCenterCurrent.vue'
const showV5Intelligence = !legacyData.current
</script>

<RuntimeOperationsCenterCurrent lang="zh" />

<ResearchIntelligenceRadar v-if="showV5Intelligence" lang="zh" />
