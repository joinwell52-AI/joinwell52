<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import PortalHome from './PortalHome.vue'
import RuntimeCenter from './RuntimeCenter.vue'

const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })
const zh = computed(() => props.lang === 'zh')
const copy = computed(() => zh.value ? {
  title: '一个由 Runtime 驱动的', accent: '数字研究中心。',
  lead: 'Research Runtime Scheduler V1.0 是 Research Operating System 的唯一正式调度器。每次数字研究员执行都被调度、观察、记录，并通过 GitHub Commit Verify 完成正式发布。',
  primary: '进入 Runtime Center', secondary: '查看 Scheduler V1.0', switcher: 'EN', runtime: '运行控制平面', record: '唯一运行事实源', worker: '数字研究员 Worker', verified: 'GitHub 验证发布'
} : {
  title: 'A Runtime-driven', accent: 'Digital Research Center.',
  lead: 'Research Runtime Scheduler V1.0 is the only formal scheduler of the Research Operating System. Every Digital Research Employee execution is scheduled, observable, recorded and closed through GitHub commit verification.',
  primary: 'Open Runtime Center', secondary: 'View Scheduler V1.0', switcher: '中文', runtime: 'Operational control plane', record: 'Single runtime record', worker: 'Digital Research Employee', verified: 'GitHub-verified release'
})
const runtimePath = computed(() => zh.value ? '/zh/runtime/' : '/en/runtime/')
const releasePath = computed(() => zh.value ? '/zh/publications/research-runtime-scheduler-v1.0' : '/en/publications/research-runtime-scheduler-v1.0')
const languagePath = computed(() => zh.value ? '/' : '/zh/')
</script>

<template>
  <div class="center-v3">
    <section class="hero">
      <div class="shell">
        <div class="copy">
          <nav><strong>{{ zh ? '中文' : 'EN' }}</strong><span>/</span><a :href="withBase(languagePath)">{{ copy.switcher }}</a></nav>
          <span class="eyebrow">RESEARCH CENTER 3.0 · RESEARCH RUNTIME CENTER</span>
          <h1>{{ copy.title }}<br><em>{{ copy.accent }}</em></h1>
          <p>{{ copy.lead }}</p>
          <div class="buttons"><a class="primary" :href="withBase(runtimePath)">{{ copy.primary }} ↗</a><a :href="withBase(releasePath)">{{ copy.secondary }} →</a></div>
          <div class="meta"><span>Runtime Scheduler V1.0</span><span>Runtime Record</span><span>GitHub First</span></div>
        </div>
        <div class="plane">
          <div class="plane-head"><span>RESEARCH RUNTIME CENTER</span><b>● RUNNING</b></div>
          <article><small>CONTROL PLANE</small><strong>Runtime Scheduler V1.0</strong><span>{{ copy.runtime }}</span></article>
          <i></i>
          <div class="workers"><span>ENGINE</span><span>QUEUE</span><span>KNOWLEDGE</span><span>ARCHITECTURE</span><span>PUBLICATION</span><span>WEEKLY</span><span>ACADEMIC</span></div>
          <i></i>
          <article class="record"><small>OBSERVABILITY</small><strong>Runtime Record</strong><span>{{ copy.record }}</span></article>
          <footer><span>{{ copy.worker }}</span><b>→</b><span>{{ copy.verified }}</span></footer>
        </div>
      </div>
    </section>
    <RuntimeCenter :lang="props.lang" compact />
    <div class="existing"><PortalHome :lang="props.lang" /></div>
  </div>
</template>

<style scoped>
.hero{position:relative;overflow:hidden;min-height:710px;color:#f7f8ff;background:radial-gradient(circle at 78% 25%,rgba(105,87,255,.32),transparent 36%),linear-gradient(rgba(139,124,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(139,124,255,.06) 1px,transparent 1px),#070a16;background-size:auto,54px 54px,54px 54px;border-bottom:1px solid rgba(148,163,184,.15)}.shell{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(420px,.85fr);gap:70px;align-items:center;width:min(1220px,calc(100% - 48px));min-height:710px;margin:auto;padding:88px 0 66px}.copy nav{display:flex;gap:9px;margin-bottom:32px;color:#8794aa;font:700 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace}.copy nav strong{color:#f0efff}.copy nav a{color:#9aa6bd;text-decoration:none}.eyebrow{display:block;margin-bottom:19px;color:#bcb4ff;font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.15em}.copy h1{margin:0;color:#f8f9ff;font-size:clamp(54px,6.2vw,88px);line-height:.98;letter-spacing:-.055em}.copy h1 em{color:#8979ff;font-style:normal}.copy>p{max-width:690px;margin:27px 0 0;color:#b8c1d3;font-size:18px;line-height:1.75}.buttons{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}.buttons a{padding:13px 18px;color:#d9d5ff;border:1px solid rgba(139,124,255,.3);border-radius:10px;font-weight:700;text-decoration:none}.buttons .primary{color:#080b18;background:#8b7cff;border-color:#8b7cff}.meta{display:flex;flex-wrap:wrap;gap:18px;margin-top:29px;color:#748198;font:600 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace}.meta span:before{content:'●';margin-right:7px;color:#5ee0ae}.plane{padding:24px;background:linear-gradient(150deg,rgba(20,27,51,.95),rgba(9,13,28,.95));border:1px solid rgba(148,163,184,.2);border-radius:22px;box-shadow:0 30px 100px rgba(0,0,0,.38)}.plane-head{display:flex;justify-content:space-between;margin-bottom:20px;color:#8c99b0;font:700 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.09em}.plane-head b{color:#6ee7b7}.plane article{padding:20px;background:rgba(7,11,25,.76);border:1px solid rgba(139,124,255,.27);border-radius:14px}.plane article.record{border-color:rgba(94,224,174,.3)}.plane small{display:block;color:#7f8ba1;font:700 9px/1 ui-monospace,SFMono-Regular,Menlo,monospace}.plane strong{display:block;margin-top:9px;color:#f4f5ff;font-size:20px}.plane article span{display:block;margin-top:5px;color:#909db2;font-size:12px}.plane>i{display:block;width:1px;height:22px;margin:auto;background:#8b7cff}.workers{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.workers span{padding:10px 5px;color:#aab5c8;background:rgba(15,21,40,.86);border:1px solid rgba(148,163,184,.14);border-radius:8px;font:700 8px/1 ui-monospace,SFMono-Regular,Menlo,monospace;text-align:center}.workers span:last-child{grid-column:2/4}.plane footer{display:flex;justify-content:center;gap:14px;margin-top:19px;color:#8390a6;font-size:11px}.plane footer b{color:#8b7cff}.existing :deep(.rcv5-hero),.existing :deep(.rcv5-dashboard),.existing :deep(.rcv5-os-section){display:none!important}.existing :deep(.rcv5-shell){padding-top:0}
@media(max-width:980px){.shell{grid-template-columns:1fr;gap:46px}.plane{max-width:620px}}
@media(max-width:640px){.shell{width:calc(100% - 36px);padding-top:56px}.copy h1{font-size:48px}.copy>p{font-size:15px}.plane{padding:17px}.workers{grid-template-columns:repeat(2,1fr)}.workers span:last-child{grid-column:1/-1}}
</style>
