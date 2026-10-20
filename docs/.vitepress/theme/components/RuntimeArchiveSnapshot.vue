<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import snapshot from '../../generated/runtime-v6-public-snapshot.json'
import RuntimeOperationsCenterCurrent from './RuntimeOperationsCenterCurrent.vue'
import LocalRuntimeBridge from './LocalRuntimeBridge.vue'
const props=withDefaults(defineProps<{lang?:'zh'|'en'}>(),{lang:'en'})
const zh=computed(()=>props.lang==='zh')
const taskNames:Record<string,string>={discovery:'信息发现',queue:'分类选题',reading:'深度阅读',analysis:'研究分析',production:'内容生产与正式题图',publication:'成果发布',weekly:'每周综合与 P2 检查',academic:'学术观察',program:'长期项目研究','deadline-check':'超时检查与恢复',scorecard:'文章观察评分'}
const statusNames:Record<string,string>={Completed:'已完成',Running:'执行中',Waiting:'待执行',Failed:'失败',Blocked:'受阻',Skipped:'已跳过'}
const requested=ref('')
const local=ref(false)
const cutoff='2026-09-18'
const mode=computed(()=>!requested.value?'snapshot':requested.value<=cutoff?'archive':requested.value===snapshot.snapshotDate?'snapshot':!snapshot.startDate||requested.value<snapshot.startDate?'interval':'snapshot')
onMounted(()=>{requested.value=new URLSearchParams(window.location.search).get('date')||'';local.value=['127.0.0.1','localhost'].includes(window.location.hostname)})
function selectDate(value:string){requested.value=value;const url=new URL(window.location.href);if(value)url.searchParams.set('date',value);else url.searchParams.delete('date');window.history.replaceState({},'',url)}
function choose(event:Event){selectDate((event.target as HTMLInputElement).value)}
</script>
<template>
  <LocalRuntimeBridge v-if="local&&(!requested||requested>='2026-09-30')" :lang="props.lang" :date="requested" @select-date="selectDate" />
  <main v-else class="archive-snapshot">
    <header><small>V5 Archive / V6 Public Snapshot</small><h1>{{zh?'研究运行公开档案':'Public Research Runtime Archive'}}</h1><p>{{zh?'公开快照：此页面不是实时控制面。本地 Runtime 为唯一运行权威。':'Public Snapshot: This page is not a live control plane. The local Runtime is the sole execution authority.'}}</p><label>{{zh?'选择档案日期':'Archive date'}} <input type="date" :value="requested" @change="choose"></label> <button @click="selectDate('')">{{zh?'最近公开快照':'Latest public snapshot'}}</button></header>
    <section v-if="mode==='interval'" class="interval"><h2>{{zh?'Runtime 迁移区间':'Runtime migration interval'}}</h2><p>{{requested}}</p><p>{{zh?'该日期没有发布权威的公开 Runtime 记录。':'No authoritative public Runtime record was published for this date.'}}</p></section>
    <section v-else-if="mode==='archive'"><p>{{zh?'V5 历史档案，最后正式公开运行日：2026-09-18。':'V5 historical archive; last formal public runtime date: 2026-09-18.'}}</p><RuntimeOperationsCenterCurrent :key="requested" :lang="props.lang" /></section>
    <section v-else class="snapshot"><h2>{{zh?'公开快照':'Public Snapshot'}}</h2><p>{{zh?'快照日期':'Snapshot date'}}: {{snapshot.snapshotDate || '—'}} · {{snapshot.timezone}}</p><p>{{zh?'仅随已验证公开成果更新，不能据此判断当前本地执行器或调度器状态。':'Updated only with verified public releases. It does not report the current Worker or Scheduler state.'}}</p><div v-if="Object.keys(snapshot.dailyPublicStatuses).length"><table><thead><tr><th>{{zh?'公开任务':'Public task'}}</th><th>{{zh?'快照状态':'Snapshot status'}}</th></tr></thead><tbody><tr v-for="(status,task) in snapshot.dailyPublicStatuses" :key="task"><td>{{zh ? taskNames[task] || task : task}}</td><td>{{zh ? statusNames[status] || status : status}}</td></tr></tbody></table></div><p v-else>{{zh?'V6 尚无正式运行成果随公开发布附带归档。':'No formal V6 runtime outcome has accompanied a public release yet.'}}</p></section>
  </main>
</template>
<style scoped>.archive-snapshot{max-width:1240px;margin:auto;padding:36px 20px}header,.snapshot,.interval{padding:28px;border:1px solid var(--vp-c-divider);border-radius:18px;margin:16px 0;background:var(--vp-c-bg-soft)}header small{color:var(--vp-c-brand-1);font-weight:700}input,button{padding:8px;margin-top:12px;border:1px solid var(--vp-c-divider);border-radius:6px}table{width:100%;border-collapse:collapse}td,th{padding:12px;text-align:left;border-bottom:1px solid var(--vp-c-divider)}</style>
