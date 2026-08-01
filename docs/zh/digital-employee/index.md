<script setup>
import { ref, computed } from 'vue'

const active = ref('daily')
const selectedDate = ref('')

const groups = {
  daily: [
    { date: '2026-08-01', title: '公开研究中心与 GitHub Pages 架构', href: '../research/daily/2026-08-01' }
  ],
  weekly: [
    { date: '2026-08-01', title: '数字员工控制面与工作 Runtime', href: '../research/weekly/weekly-002' }
  ],
  papers: [
    { date: '2026-08-01', title: '数字员工相关学术与论文观察', href: '../research/papers/' }
  ]
}

const visibleItems = computed(() => {
  const items = groups[active.value] || []
  if (!selectedDate.value) return items
  return items.filter(item => item.date === selectedDate.value)
})
</script>

# 数字员工研究笔记

<div class="de-summary">
  <div><span>DIGITAL EMPLOYEE</span><h2>58 篇研究笔记</h2><p>岗位、职责、Work Catalog、Work Order、Workflow、Runtime、Governance、Evaluation 与 Knowledge。</p></div>
  <a href="./architecture">查看纲领性架构 V0.2 →</a>
</div>

<div class="de-counts">
  <button :class="{active:active==='daily'}" @click="active='daily'"><strong>46</strong><span>每日研究</span></button>
  <button :class="{active:active==='weekly'}" @click="active='weekly'"><strong>6</strong><span>每周综合</span></button>
  <button :class="{active:active==='papers'}" @click="active='papers'"><strong>6</strong><span>学术观察</span></button>
</div>

<div class="de-toolbar">
  <div>
    <b>{{ active === 'daily' ? '每日研究列表' : active === 'weekly' ? '每周综合列表' : '学术观察列表' }}</b>
    <span>默认按日期倒序</span>
  </div>
  <label>按日历查找 <input v-model="selectedDate" type="date"></label>
</div>

<div v-if="visibleItems.length" class="de-list">
  <a v-for="item in visibleItems" :key="item.href" :href="item.href">
    <time>{{ item.date }}</time>
    <div><h3>{{ item.title }}</h3><p>{{ active === 'daily' ? 'Daily Research Note' : active === 'weekly' ? 'Weekly Synthesis' : 'Academic Observation' }}</p></div>
    <span>→</span>
  </a>
</div>

<div v-else class="de-empty">
  该日期暂无研究笔记。清除日期后查看全部列表。
</div>

## 浏览结构

```text
数字员工（58）
  ├─ 每日研究（46）→ 按日期倒序列表
  ├─ 每周综合（6） → 按日期倒序列表
  └─ 学术观察（6） → 按日期倒序列表
```

研究笔记每天持续增加；稳定判断再升级为 Architecture、Specification、Paper 或 Publication。

<style scoped>
.de-summary{display:flex;justify-content:space-between;gap:24px;align-items:flex-end;margin:22px 0;padding:26px;border-radius:20px;background:linear-gradient(135deg,#091527,#12334d);color:#fff}.de-summary span{font-size:12px;letter-spacing:.12em;color:#78d9ed;font-weight:700}.de-summary h2{margin:9px 0 8px;font-size:30px}.de-summary p{margin:0;color:#cbd8e6}.de-summary a{flex:none;color:#fff;text-decoration:none;font-weight:700}.de-counts{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:20px 0}.de-counts button{display:flex;flex-direction:column;align-items:flex-start;padding:18px;border:1px solid var(--vp-c-divider);border-radius:16px;background:var(--vp-c-bg-soft);cursor:pointer;color:inherit}.de-counts button.active{border-color:var(--vp-c-brand-1);box-shadow:0 0 0 1px var(--vp-c-brand-1) inset}.de-counts strong{font-size:28px}.de-counts span{color:var(--vp-c-text-2)}.de-toolbar{display:flex;justify-content:space-between;gap:20px;align-items:center;margin:26px 0 12px}.de-toolbar>div{display:flex;flex-direction:column}.de-toolbar span{font-size:13px;color:var(--vp-c-text-2)}.de-toolbar label{font-size:13px;color:var(--vp-c-text-2)}.de-toolbar input{margin-left:8px;padding:8px 10px;border:1px solid var(--vp-c-divider);border-radius:10px;background:var(--vp-c-bg);color:inherit}.de-list{border-top:1px solid var(--vp-c-divider)}.de-list a{display:grid;grid-template-columns:110px 1fr auto;gap:18px;align-items:center;padding:20px 4px;border-bottom:1px solid var(--vp-c-divider);text-decoration:none!important;color:inherit!important}.de-list a:hover h3{color:var(--vp-c-brand-1)}.de-list time{font-variant-numeric:tabular-nums;color:var(--vp-c-text-2)}.de-list h3{margin:0 0 4px}.de-list p{margin:0;color:var(--vp-c-text-2);font-size:13px}.de-empty{padding:24px;border:1px dashed var(--vp-c-divider);border-radius:14px;color:var(--vp-c-text-2)}@media(max-width:720px){.de-summary{display:block;padding:22px}.de-summary a{display:block;margin-top:18px}.de-counts{grid-template-columns:1fr}.de-toolbar{align-items:flex-start;flex-direction:column}.de-list a{grid-template-columns:1fr auto}.de-list time{grid-column:1/-1}}
</style>
