---
layout: home
pageClass: runtime-center-page runtime-center-zh
title: 数字工场运营中心
description: 展示当天真实 Runtime 数据、三栏研究计划、动态班次总数、生产、发版、工作成果与 GitHub 证据。
outline: false
---

<script setup>
import RuntimeOperationsCenterCurrent from '../../.vitepress/theme/components/RuntimeOperationsCenterCurrent.vue'
import RuntimeShiftCollapse from '../../.vitepress/theme/components/RuntimeShiftCollapse.vue'
</script>

<RuntimeOperationsCenterCurrent lang="zh" />
<RuntimeShiftCollapse lang="zh" />

<ResearchIntelligenceRadar lang="zh" />

<style src="../../.vitepress/theme/runtime-operations.css"></style>
<style src="../../.vitepress/theme/runtime-card-alignment.css"></style>
<style src="../../.vitepress/theme/runtime-mobile-hardening.css"></style>

<style>
.dark .runtime-center-page .runtime-classic .column-digital-employee .column-head h3 {
  color: #e7e2ff;
  -webkit-text-fill-color: #e7e2ff;
}
.dark .runtime-center-page .runtime-classic .column-industry-architecture .column-head h3 {
  color: #72d6ff;
  -webkit-text-fill-color: #72d6ff;
}
.dark .runtime-center-page .runtime-classic .column-open-source-engineering .column-head h3 {
  color: #77e5a7;
  -webkit-text-fill-color: #77e5a7;
}
</style>
