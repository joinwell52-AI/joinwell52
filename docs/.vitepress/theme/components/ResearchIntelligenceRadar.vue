<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import intelligenceData from '../../generated/research-intelligence.json'
import p2StatusData from '../../generated/p2-special-study.json'

type Status = 'Waiting' | 'Running' | 'Completed' | 'Blocked' | 'Failed' | 'Skipped'
type PipelineResult = { id:string; label:string; label_zh:string; status:Status; due:number; checked:number; inaccessible:Array<{source:string;reason:string}>; failed:Array<{source:string;reason:string}>; signals:number; candidates:number; selected:number; rejected:number; coveragePercent:number; reason:string; reason_zh:string }
type ColumnResult = { id:string; label:string; label_zh:string; decision:'Waiting'|'Selected'|'No Selection'; signals:number; candidates:number; selectedItemId:string; selectedTitle:string; selectedTitle_zh:string; reason:string; reason_zh:string }
type Run = { date:string; status:Status; reason:string; reason_zh:string; pipelines:PipelineResult[]; columns:ColumnResult[] }
type Data = { today:string; timezone:string; registryVersion:string; effectiveDate:string; registryPath:string; currentRun:Run }
type P2ReviewStatus = 'No Report' | 'Pending' | 'Processed'
type P2Data = { objectCount:number; runCount:number; latestRun:null|{date:string;status:Status;due:number;resolved:number;selected:boolean}; review:{status:P2ReviewStatus;reports:number;pending:number;processed:number;latest:null|{date:string;status:'Pending'|'Processed';decision:string;reviewedAt:string}} }

const data = intelligenceData as Data
const p2 = p2StatusData as P2Data
const props = withDefaults(defineProps<{lang?:'en'|'zh'}>(), { lang:'en' })
const zh = computed(() => props.lang === 'zh')
const run = computed(() => data.currentRun)
const copy = computed(() => zh.value ? {
  kicker:'RESEARCH INTELLIGENCE SYSTEM V1.0', title:'研究情报雷达', lead:'AI 平台、GitHub 工程、论文与研究成果三条情报管线，共同服务数字员工、行业架构和开源工程三个板块。', pipelines:'三条情报管线', columns:'三栏选题结果', due:'应检查', checked:'已检查', inaccessible:'受限', signals:'信号', candidates:'候选', selected:'入选', noSelection:'未选题', waiting:'待执行', registry:'情报源明细', run:'今日扫描记录', effective:'生效日期', sourceNote:'完成标准是覆盖率和可追溯结果，不是强行找到一篇文章。', p2Title:'P2 专项研究', p2Note:'周任务只生成内部报告；雷达显示处理状态，正文在本地审稿中心查看。', reports:'报告', pendingReview:'待处理', processed:'已处理', latestReport:'最近报告', noReport:'无报告', reviewDecision:'审核结论', status:{Waiting:'待执行',Running:'运行中',Completed:'已完成',Blocked:'已阻塞',Failed:'失败',Skipped:'已跳过'}
} : {
  kicker:'RESEARCH INTELLIGENCE SYSTEM V1.0', title:'Research Intelligence Radar', lead:'AI Platform, GitHub Engineering, and Published Research intelligence jointly serve the Digital Employee, Industry Architecture, and Open-source Engineering columns.', pipelines:'Three Intelligence Pipelines', columns:'Three-Column Decisions', due:'Due', checked:'Checked', inaccessible:'Restricted', signals:'Signals', candidates:'Candidates', selected:'Selected', noSelection:'No Selection', waiting:'Waiting', registry:'Intelligence Sources', run:"Today's Scan Record", effective:'Effective', sourceNote:'Completion is measured by source coverage and traceable outcomes, not by forcing an article.', p2Title:'P2 Special Studies', p2Note:'The weekly task creates internal reports; the Radar shows workflow status while report bodies stay in the local review center.', reports:'Reports', pendingReview:'Pending', processed:'Processed', latestReport:'Latest report', noReport:'No report', reviewDecision:'Review decision', status:{Waiting:'Waiting',Running:'Running',Completed:'Completed',Blocked:'Blocked',Failed:'Failed',Skipped:'Skipped'}
})
const statusLabel = (status:Status) => copy.value.status[status]
const statusClass = (status:Status) => `s-${status.toLowerCase()}`
const pipelineName = (item:PipelineResult) => zh.value ? item.label_zh : item.label
const pipelineReason = (item:PipelineResult) => zh.value ? item.reason_zh : item.reason
const columnName = (item:ColumnResult) => zh.value ? item.label_zh : item.label
const columnReason = (item:ColumnResult) => zh.value ? item.reason_zh : item.reason
const columnTitle = (item:ColumnResult) => zh.value ? item.selectedTitle_zh : item.selectedTitle
const columnStatus = (item:ColumnResult) => item.decision === 'Selected' ? copy.value.selected : item.decision === 'No Selection' ? copy.value.noSelection : copy.value.waiting
const columnClass = (item:ColumnResult) => item.decision === 'Selected' ? 's-completed' : item.decision === 'No Selection' ? 's-skipped' : 's-waiting'
const repoUrl = (path:string) => `https://github.com/joinwell52-AI/joinwell52/blob/main/${path}`
const registryPage = computed(() => withBase(zh.value ? '/zh/runtime/intelligence-sources' : '/en/runtime/intelligence-sources'))
const runPath = computed(() => `research/intelligence/runs/${run.value.date.slice(0,4)}/${run.value.date.slice(5,7)}/${run.value.date}-intelligence.json`)
const p2Label = computed(() => p2.review.status === 'No Report' ? copy.value.noReport : p2.review.status === 'Pending' ? copy.value.pendingReview : copy.value.processed)
const p2Class = computed(() => p2.review.status === 'Pending' ? 's-waiting' : p2.review.status === 'Processed' ? 's-completed' : 's-skipped')
const reviewDecision = computed(() => {
  const labels:Record<string,string> = zh.value ? {
    'Approved Internal':'内部通过', 'Revision Required':'退回修改', 'Promote to Article Candidate':'转公开文章候选', 'Archived':'归档'
  } : {}
  return labels[p2.review.latest?.decision || ''] || p2.review.latest?.decision || '—'
})
</script>

<template>
  <section class="intel-radar">
    <div class="intel-shell">
      <header>
        <div><span class="kicker">{{ copy.kicker }}</span><h2>{{ copy.title }}</h2><p>{{ copy.lead }}</p></div>
        <div class="meta"><b :class="statusClass(run.status)">{{ statusLabel(run.status) }}</b><span>{{ run.date }} · {{ data.timezone }}</span></div>
      </header>
      <section class="panel">
        <div class="section-title"><h3>{{ copy.pipelines }}</h3><small>{{ copy.sourceNote }}</small></div>
        <div class="pipeline-grid">
          <article v-for="item in run.pipelines" :key="item.id">
            <div class="card-head"><div><small>{{ item.id.toUpperCase() }}</small><h4>{{ pipelineName(item) }}</h4></div><b :class="statusClass(item.status)">{{ statusLabel(item.status) }}</b></div>
            <div class="coverage"><span><strong>{{ item.checked }}</strong>{{ copy.checked }}</span><span><strong>{{ item.due }}</strong>{{ copy.due }}</span><span><strong>{{ item.inaccessible.length + item.failed.length }}</strong>{{ copy.inaccessible }}</span></div>
            <div class="bar"><i :style="{width:`${item.coveragePercent}%`}"></i></div>
            <div class="metrics"><span><strong>{{ item.signals }}</strong>{{ copy.signals }}</span><span><strong>{{ item.candidates }}</strong>{{ copy.candidates }}</span><span><strong>{{ item.selected }}</strong>{{ copy.selected }}</span></div>
            <p>{{ pipelineReason(item) }}</p>
          </article>
        </div>
      </section>
      <section class="panel p2-radar-panel">
        <div class="section-title"><h3>{{ copy.p2Title }}</h3><b :class="p2Class">{{ p2Label }}</b></div>
        <p class="p2-note">{{ copy.p2Note }}</p>
        <div class="p2-status-grid">
          <span><strong>{{ p2.review.reports }}</strong>{{ copy.reports }}</span>
          <span><strong>{{ p2.review.pending }}</strong>{{ copy.pendingReview }}</span>
          <span><strong>{{ p2.review.processed }}</strong>{{ copy.processed }}</span>
          <span><strong>{{ p2.review.latest?.date || '—' }}</strong>{{ copy.latestReport }}</span>
          <span v-if="p2.review.latest?.status === 'Processed'"><strong>{{ reviewDecision }}</strong>{{ copy.reviewDecision }}</span>
        </div>
      </section>
      <section class="panel columns-panel">
        <div class="section-title"><h3>{{ copy.columns }}</h3><small>{{ copy.effective }} · {{ data.effectiveDate }}</small></div>
        <div class="column-grid">
          <article v-for="item in run.columns" :key="item.id" :class="`column-${item.id}`">
            <div class="card-head"><div><small>{{ item.id.replaceAll('-',' ').toUpperCase() }}</small><h4>{{ columnName(item) }}</h4></div><b :class="columnClass(item)">{{ columnStatus(item) }}</b></div>
            <h5 v-if="item.decision === 'Selected'">{{ item.selectedItemId }} · {{ columnTitle(item) }}</h5>
            <p>{{ columnReason(item) }}</p>
            <div class="metrics"><span><strong>{{ item.signals }}</strong>{{ copy.signals }}</span><span><strong>{{ item.candidates }}</strong>{{ copy.candidates }}</span></div>
          </article>
        </div>
      </section>
      <footer><a :href="registryPage">{{ copy.registry }} ↗</a><a :href="repoUrl(runPath)">{{ copy.run }} ↗</a></footer>
    </div>
  </section>
</template>
