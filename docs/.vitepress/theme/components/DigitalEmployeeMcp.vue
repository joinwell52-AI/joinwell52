<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ lang: 'en' | 'zh' }>()
const zh = computed(() => props.lang === 'zh')
const bxp = 'https://github.com/joinwell52-AI/BoundaryXP'
const paperRelease = `${bxp}/releases/tag/paper-v1.2-r23`
const paperPdf = `${bxp}/releases/download/paper-v1.2-r23/BoundaryXP-manuscript`
</script>

<template>
  <section id="mcp-tools" class="mcp-tools" aria-labelledby="mcp-tools-title">
    <header>
      <h3 id="mcp-tools-title">{{ zh ? '数字员工的三个 MCP 工具' : 'Three MCP tools for digital employees' }}</h3>
      <p>{{ zh ? '按需组合任务边界核验、扫码登录与人工核对。三个工具均可独立接入。' : 'Combine task boundary checks, QR sign-in, and human review as needed. Each tool can be installed independently.' }}</p>
    </header>

    <div class="mcp-grid">
      <article class="mcp-card mcp-feature">
        <div>
          <h4>BoundaryXP <span>· BXP</span></h4>
          <p>{{ zh ? '核验 AI 任务边界。用 7+1 关联表示把任务要求和子任务连回原文证据，由确定性核心核验，给出越界、未越界或信息不足的结果。' : 'Check an AI task’s boundaries. BoundaryXP links requirements and subtasks to source evidence through a 7+1 representation, then runs deterministic checks and reports violations, within-bounds results, or missing information.' }}</p>
          <div class="mcp-links">
            <a :href="zh ? `${bxp}/blob/main/README.zh-CN.md` : bxp">{{ zh ? '项目与安装' : 'Project & setup' }}</a>
            <a href="https://www.npmjs.com/package/boundaryxp-mcp">boundaryxp-mcp</a>
            <a href="https://boundaryxp-workbench-demo.joinwell52.chatgpt.site/">{{ zh ? '交互演示' : 'Interactive demo' }}</a>
          </div>
        </div>
        <div id="boundaryxp-paper" class="mcp-paper">
          <h4>{{ zh ? 'BoundaryXP 论文与研究材料' : 'BoundaryXP paper and research materials' }}</h4>
          <p><strong>{{ zh ? '《BXP：基于 7+1 关联表示的人工智能任务边界判定方法》' : 'BXP: A Method for AI Task Boundary Verification Using a 7+1 Relational Representation' }}</strong></p>
          <p>{{ zh ? '朱卫 · 2026 年预印本 · 中文 r23／英文 v1.2' : 'Wei Zhu · 2026 preprint · English v1.2 / Chinese r23' }}</p>
          <div class="mcp-links">
            <a :href="`${paperPdf}.${zh ? 'zh-CN' : 'en'}.pdf`">{{ zh ? '中文 PDF' : 'English PDF' }}</a>
            <a :href="`${paperPdf}.${zh ? 'en' : 'zh-CN'}.pdf`">{{ zh ? 'English PDF' : '中文 PDF' }}</a>
            <a href="https://doi.org/10.5281/zenodo.24072738">DOI 10.5281/zenodo.24072738</a>
            <a :href="paperRelease">{{ zh ? '研究材料与校验值' : 'Research materials & checksums' }}</a>
          </div>
        </div>
      </article>

      <article class="mcp-card">
        <h4>{{ zh ? '即页' : 'Instant Page MCP' }} <span>· {{ zh ? 'Instant Page MCP' : 'IPM' }}</span></h4>
        <p>{{ zh ? '为当前任务生成登记、查询选择或可编辑的核对页。人提交后，宿主读回经校验的结果。' : 'Generate a task-specific registration, selection, or editable review page. The host reads back the validated submission.' }}</p>
        <div class="mcp-links">
          <a :href="zh ? 'https://github.com/joinwell52-AI/instant-page-mcp#readme' : 'https://github.com/joinwell52-AI/instant-page-mcp/blob/main/README.en.md'">{{ zh ? '项目与安装' : 'Project & setup' }}</a>
          <a href="https://www.npmjs.com/package/instant-page-mcp">instant-page-mcp</a>
        </div>
      </article>

      <article class="mcp-card">
        <h4>{{ zh ? '自动扫码助手' : 'Auto QR Assistant' }} <span>· AQR</span></h4>
        <p>{{ zh ? '在 Windows 上操作安卓 App，并通过已连接的手机为支持的网页或电脑客户端扫码登录。' : 'Control Android apps from Windows and use a connected phone to scan login QR codes for supported websites or desktop apps.' }}</p>
        <div class="mcp-links">
          <a :href="zh ? 'https://github.com/joinwell52-AI/AQR-D#readme' : 'https://github.com/joinwell52-AI/AQR-D#english'">{{ zh ? '项目与安装' : 'Project & setup' }}</a>
          <a href="https://www.npmjs.com/package/aqr-mcp">aqr-mcp</a>
          <a href="https://github.com/joinwell52-AI/AQR-D/releases">{{ zh ? 'Windows 下载' : 'Windows download' }}</a>
          <a href="https://joinwell52-ai.github.io/AQR-D/" target="_blank" rel="noopener">{{ zh ? '演示视频' : 'Demo video' }}</a>
        </div>
      </article>
    </div>

    <p class="mcp-example"><strong>{{ zh ? '示例 · 车辆资料登记' : 'Example · Vehicle records' }}</strong> {{ zh ? '宿主先用 BoundaryXP 核对任务允许做什么。若受支持的业务网站需要扫码，调用 AQR 登录。需要人核对识别结果时，用即页生成可编辑的表单，再把确认后的字段读回当前任务。' : 'The host uses BoundaryXP to check what the task permits. If a supported site requires QR sign-in, the host calls AQR. When a person needs to review extracted fields, the host uses Instant Page to generate an editable form and reads the confirmed values back into the task.' }}</p>
  </section>
</template>

<style scoped>
.mcp-tools { margin-top: clamp(40px, 6vw, 76px); color: var(--rc-ink); scroll-margin-top: 84px; }
.mcp-tools header h3 { margin: 0; font-size: clamp(26px, 3.2vw, 38px); line-height: 1.15; }
.mcp-tools p { margin: 8px 0 0; color: var(--rc-muted); font-size: 15px; line-height: 1.65; }
.mcp-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 20px; }
.mcp-card { min-width: 0; padding: clamp(16px, 2.5vw, 28px); background: var(--rc-paper); border: 1px solid var(--rc-line); border-radius: 18px; }
.mcp-card h4 { margin: 0; font-size: 20px; line-height: 1.25; }
.mcp-card h4 span { color: var(--rc-muted); font-size: 14px; }
.mcp-feature { display: grid; grid-column: 1 / -1; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; border-color: var(--rc-signal); }
.mcp-feature > div:first-child h4 { font-size: clamp(25px, 3vw, 33px); }
.mcp-paper { min-width: 0; padding-inline-start: 24px; border-inline-start: 1px solid var(--rc-line); scroll-margin-top: 84px; }
.mcp-paper strong, .mcp-example strong { color: var(--rc-ink); }
.mcp-links { display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: 14px; }
.mcp-links a { color: var(--rc-signal); font-size: 14px; font-weight: 650; text-decoration: underline; text-underline-offset: 3px; overflow-wrap: anywhere; }
.mcp-tools .mcp-example { margin-top: 16px; }
.mcp-example strong { display: block; }

@media (max-width: 699px) {
  .mcp-grid, .mcp-feature { grid-template-columns: minmax(0, 1fr); }
  .mcp-paper { padding: 16px 0 0; border-inline-start: 0; border-top: 1px solid var(--rc-line); }
}
</style>
