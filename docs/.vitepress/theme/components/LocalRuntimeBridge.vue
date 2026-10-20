<script setup lang="ts">
import {onMounted,onBeforeUnmount,ref,watch} from 'vue'
import RuntimeOperationsCenterClassic from './RuntimeOperationsCenterClassic.vue'
const props=withDefaults(defineProps<{lang?:'zh'|'en';date?:string}>(),{lang:'zh',date:''})
const emit=defineEmits<{(event:'selectDate',date:string):void}>()
const data=ref<any>(null),error=ref('')
let timer:ReturnType<typeof setInterval>|undefined
async function refresh(){try{const run=new URL(location.href).searchParams.get('run');const query=run?'?run='+encodeURIComponent(run):props.date?'?date='+encodeURIComponent(props.date):'';const r=await fetch('/api/local-classic'+query);if(!r.ok)throw Error('本地运行记录暂时无法读取');data.value=await r.json();error.value=''}catch(e:any){error.value=e.message}}
watch(()=>props.date,()=>{data.value=null;refresh()})
onMounted(()=>{refresh();timer=setInterval(refresh,5000)})
onBeforeUnmount(()=>{if(timer)clearInterval(timer)})
</script>
<template>
 <p v-if="data?.executionMode==='manual-all-tasks'" style="max-width:1240px;margin:16px auto;padding:16px 24px;background:var(--vp-c-bg-soft);border-radius:12px">本次手动补做全部 11 项任务并准备真实发布。周任务按今天实际执行记载；发现、选题、深读和实验分析复用今天已验证结果，保留原时间。下表列出原计划时间，实际执行时间见各项结果。</p>
 <RuntimeOperationsCenterClassic v-if="data?.runtime" :lang="props.lang" :selected-date="data.runtime.today" :today-date="data.calendar?.today||data.runtime.today" min-date="2026-09-18" :max-date="data.calendar?.today||data.runtime.today" :previous-date="data.calendar?.previous||''" :next-date="data.calendar?.next||''" :local-mode="true" :local-runtime="data.runtime" :local-intelligence="data.intelligence" :local-signals="data.signals" @select-date="date=>emit('selectDate',date)" @date-input="date=>emit('selectDate',date)" />
 <p v-else style="padding:40px;text-align:center">{{error||data?.notice||'正在读取本地研究结果…'}}</p>
</template>
