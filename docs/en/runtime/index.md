---
layout: home
pageClass: runtime-center-page runtime-center-en
title: Digital Works Operations Center
description: Today's authentic Runtime data, ordered recovery progress, three-column plan, dynamic shift total, production, release, work results and GitHub evidence.
outline: false
---

<script setup>
import RuntimeOperationsCenterCurrent from '../../.vitepress/theme/components/RuntimeOperationsCenterCurrent.vue'
import RuntimePrestartState from '../../.vitepress/theme/components/RuntimePrestartState.vue'
import RuntimeRecoveryProgress from '../../.vitepress/theme/components/RuntimeRecoveryProgress.vue'
import RuntimeShiftCollapse from '../../.vitepress/theme/components/RuntimeShiftCollapse.vue'
</script>

<RuntimePrestartState lang="en" />
<RuntimeRecoveryProgress lang="en" />
<RuntimeOperationsCenterCurrent lang="en" />
<RuntimeShiftCollapse lang="en" />

<ResearchIntelligenceRadar lang="en" />

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