<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })
const zh = computed(() => props.lang === 'zh')
const c = computed(() => zh.value ? {
  switcher:'EN', eyebrow:'TMPA · 数字员工生产机', title:'把通用 AI，变成', accent:'真正工作的数字员工。',
  lead:'一个开放的研究与工程项目：用 TMPA、文本工作流、Skills、治理和持久记录，把 ChatGPT 等通用 AI 组织成可承担真实岗位工作的数字员工。',
  paper:'阅读 TMPA', apps:'查看应用', github:'GitHub',
  transform:'从通用智能到组织工作', transformLead:'模型提供智能。我们提供岗位、技能、工具、流程、权限、证据和持续责任。',
  appsTitle:'三个真实应用', appsLead:'不是概念演示，而是三个不同岗位方向。',
  appItems:[
    ['研究笔记生产机','Research Analyst（RA）','基于 ChatGPT 的文本驱动数字研究员，持续发布每日、每周与学术研究笔记。'],
    ['CodeFlowMu','PM · DEV · QA · OPS','由四个岗位组成的数字软件开发团队，承担真实的软件产品开发工作。'],
    ['小典 AI','业务数据分析师','理解业务问题、生成并校验 SQL、执行查询、解释结果并保留审计记录。']
  ],
  textTitle:'工作流就是文本。', textLead:'没有复杂 BPMN，没有专用 DSL，也不依赖庞大的流程代码。岗位、Skills、Queue、工作步骤、规范和记录都写成文本。AI 能理解，人也能理解。',
  textTags:['人可读','AI 可执行','程序可校验','GitHub 可保存'],
  tmpaTitle:'TMPA：理论、规范与实现', tmpaLead:'TMPA 研究受治理的 AI 原生组织工作，强调工作落地成文、组织先于编排、职责分离、相互约束和可重建的组织状态。',
  papers:[['A0.4','主论文'],['S0.3','核心规范'],['I0.3','实现案例']],
  researchTitle:'持续研究', researchLead:'数字员工 · 行业架构 · 开源工程', rhythms:['每日研究','每周综合','学术观察'],
  openTitle:'全部开源，持续运行。', openLead:'开源的是理论、方法、文本工作流、研究笔记、运行记录、网站和工程证据；不是 ChatGPT 或底层大模型。',
  runtime:'幕后运行记录', runtimeLead:'查看 RA 的调度、工作日志、GitHub 提交与发布验证。'
} : {
  switcher:'中文', eyebrow:'TMPA · DIGITAL EMPLOYEE FACTORY', title:'Turn General AI into', accent:'Digital Employees.',
  lead:'An open research and engineering project using TMPA, textual workflows, Skills, governance, and durable records to organize general AI such as ChatGPT into workers that can hold real organizational roles.',
  paper:'Read TMPA', apps:'See Applications', github:'GitHub',
  transform:'From general intelligence to organizational work', transformLead:'The model supplies intelligence. We supply roles, skills, tools, process, authority, evidence, and durable responsibility.',
  appsTitle:'Three Working Applications', appsLead:'Not concept demos, but three distinct work roles.',
  appItems:[
    ['Research Note Factory','Research Analyst (RA)','A ChatGPT-powered, text-driven digital researcher publishing daily, weekly, and academic research notes.'],
    ['CodeFlowMu','PM · DEV · QA · OPS','A four-role digital software development team performing real product-development work.'],
    ['XiaoDian AI','Business Data Analyst','Understands business questions, generates and validates SQL, executes queries, explains results, and preserves audit evidence.']
  ],
  textTitle:'The workflow is text.', textLead:'No complex BPMN, proprietary DSL, or large workflow codebase. Roles, Skills, queues, procedures, standards, and records are written as text that both AI and people can understand.',
  textTags:['Human-readable','AI-executable','Machine-validatable','GitHub-preserved'],
  tmpaTitle:'TMPA: Theory, Specification, Implementation', tmpaLead:'TMPA studies governed AI-native organizational work through work-becomes-text, organization before orchestration, separation of duties, mutual constraint, and reconstructable organizational state.',
  papers:[['A0.4','Main Paper'],['S0.3','Core Specification'],['I0.3','Implementation Case']],
  researchTitle:'Continuing Research', researchLead:'Digital Employees · Industry Architecture · Open-source Engineering', rhythms:['Daily Research','Weekly Synthesis','Academic Observation'],
  openTitle:'Open source. Continuously running.', openLead:'What is open-sourced is the theory, methods, textual workflows, research notes, runtime records, website, and engineering evidence—not ChatGPT or the underlying foundation model.',
  runtime:'Behind the scenes', runtimeLead:'Inspect RA scheduling, work logs, GitHub commits, and publication verification.'
})
const languagePath = computed(() => zh.value ? '/' : '/zh/')
const p = computed(() => ({
  paper: zh.value ? '/zh/publications/tmpa-architecture-paper-a0.4' : '/en/publications/tmpa-architecture-paper-a0.4',
  publications: zh.value ? '/zh/publications/' : '/en/publications/',
  notes: zh.value ? '/zh/research-notes/' : '/en/research-notes/',
  runtime: zh.value ? '/zh/runtime/' : '/en/runtime/'
}))
</script>

<template>
  <main class="product-home">
    <section class="hero">
      <div class="orb orb-a"></div><div class="orb orb-b"></div>
      <div class="wrap hero-inner">
        <nav class="lang"><strong>{{ zh ? '中文' : 'EN' }}</strong><span>/</span><a :href="withBase(languagePath)">{{ c.switcher }}</a></nav>
        <span class="eyebrow">{{ c.eyebrow }}</span>
        <h1>{{ c.title }}<br><em>{{ c.accent }}</em></h1>
        <p>{{ c.lead }}</p>
        <div class="actions">
          <a class="primary" :href="withBase(p.paper)">{{ c.paper }} ↗</a>
          <a :href="withBase('#applications')">{{ c.apps }} ↓</a>
          <a href="https://github.com/joinwell52-AI/joinwell52">{{ c.github }} ↗</a>
        </div>
        <div class="signal"><span>GENERAL AI</span><i>→</i><b>TMPA + TEXT + SKILLS</b><i>→</i><strong>DIGITAL EMPLOYEE</strong></div>
      </div>
    </section>

    <section class="panel transform">
      <div class="wrap split">
        <div><span class="mini">01</span><h2>{{ c.transform }}</h2></div>
        <p>{{ c.transformLead }}</p>
      </div>
    </section>

    <section id="applications" class="panel apps-section">
      <div class="wrap">
        <span class="mini">02</span><h2>{{ c.appsTitle }}</h2><p class="intro">{{ c.appsLead }}</p>
        <div class="apps">
          <article v-for="(item,index) in c.appItems" :key="item[0]" :class="`app app-${index+1}`">
            <small>0{{ index+1 }}</small><h3>{{ item[0] }}</h3><strong>{{ item[1] }}</strong><p>{{ item[2] }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="panel text-section">
      <div class="wrap text-grid">
        <div><span class="mini">03</span><h2>{{ c.textTitle }}</h2><p>{{ c.textLead }}</p></div>
        <div class="text-stack"><span v-for="tag in c.textTags" :key="tag">{{ tag }}</span></div>
      </div>
    </section>

    <section class="panel tmpa-section">
      <div class="wrap">
        <span class="mini">04</span><h2>{{ c.tmpaTitle }}</h2><p class="intro">{{ c.tmpaLead }}</p>
        <div class="papers">
          <a v-for="(paper,index) in c.papers" :key="paper[0]" :href="withBase(index===0 ? p.paper : p.publications)"><b>{{ paper[0] }}</b><span>{{ paper[1] }}</span><i>↗</i></a>
        </div>
      </div>
    </section>

    <section class="panel research-section">
      <div class="wrap research-grid">
        <div><span class="mini">05</span><h2>{{ c.researchTitle }}</h2><p>{{ c.researchLead }}</p></div>
        <div class="rhythms"><a v-for="item in c.rhythms" :key="item" :href="withBase(p.notes)">{{ item }} <span>→</span></a></div>
      </div>
    </section>

    <section class="panel final-section">
      <div class="wrap final-grid">
        <div><span class="mini">06</span><h2>{{ c.openTitle }}</h2><p>{{ c.openLead }}</p></div>
        <div class="final-links"><a href="https://github.com/joinwell52-AI/joinwell52">GitHub ↗</a><a :href="withBase(p.runtime)">{{ c.runtime }} →<small>{{ c.runtimeLead }}</small></a></div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.product-home{--bg:#07080d;--ink:#f7f7fb;--muted:#a8adba;--line:rgba(255,255,255,.12);--violet:#9b8cff;--cyan:#67d8ff;background:var(--bg);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.wrap{width:min(1180px,calc(100% - 48px));margin:auto}.hero{position:relative;isolation:isolate;min-height:760px;overflow:hidden;background:radial-gradient(circle at 50% -10%,rgba(132,105,255,.22),transparent 40%),linear-gradient(180deg,#080912,#07080d)}.hero:after{content:'';position:absolute;inset:0;z-index:-2;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(to bottom,#000,transparent 80%)}.orb{position:absolute;z-index:-1;border-radius:50%;filter:blur(80px);opacity:.4}.orb-a{width:420px;height:420px;right:-80px;top:80px;background:#6b5cff}.orb-b{width:340px;height:340px;left:-100px;bottom:20px;background:#007ea8}.hero-inner{display:flex;min-height:760px;flex-direction:column;justify-content:center;padding:72px 0 54px}.lang{display:flex;gap:9px;margin-bottom:36px;color:#747b8b;font:700 12px/1 ui-monospace,monospace}.lang a{color:#9ea5b6;text-decoration:none}.eyebrow,.mini{display:block;color:#a99cff;font:700 12px/1.2 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase}.hero h1{max-width:980px;margin:22px 0 0;font-size:clamp(58px,8.2vw,118px);line-height:.91;letter-spacing:-.07em}.hero h1 em{color:transparent;background:linear-gradient(90deg,#fff 10%,#9b8cff 55%,#67d8ff);background-clip:text;font-style:normal}.hero p{max-width:780px;margin:30px 0 0;color:#b9beca;font-size:19px;line-height:1.75}.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:34px}.actions a{padding:13px 18px;color:#e8e9f0;border:1px solid var(--line);border-radius:999px;text-decoration:none;font-weight:750;transition:.25s}.actions a:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.3)}.actions .primary{color:#090a0f;background:#fff;border-color:#fff}.signal{display:flex;flex-wrap:wrap;align-items:center;gap:16px;margin-top:76px;color:#737b8e;font:700 11px/1 ui-monospace,monospace;letter-spacing:.08em}.signal b{color:#aea5ff}.signal strong{color:#e9ebf4}.panel{padding:108px 0;border-top:1px solid var(--line)}.panel h2{max-width:850px;margin:18px 0 0;font-size:clamp(42px,5.5vw,78px);line-height:1;letter-spacing:-.055em}.panel p{color:var(--muted);font-size:17px;line-height:1.7}.split,.research-grid,.final-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:80px;align-items:end}.split>p{max-width:520px;margin:0}.apps-section{background:#0c0e15}.intro{max-width:700px;margin:24px 0 0}.apps{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:44px}.app{min-height:330px;padding:28px;border:1px solid var(--line);border-radius:26px;background:linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.018));transition:.3s}.app:hover{transform:translateY(-7px);border-color:rgba(255,255,255,.26)}.app small{color:#747b8c;font:700 11px/1 ui-monospace,monospace}.app h3{margin:50px 0 8px;font-size:31px;letter-spacing:-.035em}.app strong{color:#a99cff;font-size:14px}.app p{margin-top:22px;font-size:15px}.app-1{box-shadow:inset 0 1px 0 rgba(155,140,255,.3)}.app-2{box-shadow:inset 0 1px 0 rgba(103,216,255,.3)}.app-3{box-shadow:inset 0 1px 0 rgba(115,239,183,.3)}.text-section{background:linear-gradient(180deg,#11131b,#0b0d13)}.text-grid{display:grid;grid-template-columns:1fr 1fr;gap:90px;align-items:center}.text-grid p{max-width:620px;margin-top:28px}.text-stack{display:grid;gap:12px}.text-stack span{padding:20px 22px;border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.035);font-size:18px;font-weight:750}.papers{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:42px}.papers a{display:grid;grid-template-columns:auto 1fr auto;gap:16px;align-items:center;padding:24px;color:#eef0f5;border:1px solid var(--line);border-radius:18px;text-decoration:none;transition:.25s}.papers a:hover{background:rgba(255,255,255,.05);transform:translateY(-3px)}.papers b{font-size:22px}.papers span{color:#a8adba}.papers i{font-style:normal}.research-section{background:#f3f2f8;color:#101116}.research-section .mini{color:#6c59d7}.research-section p{color:#666b76}.rhythms{display:grid;gap:10px}.rhythms a{display:flex;justify-content:space-between;padding:18px 0;color:#11131a;border-bottom:1px solid rgba(0,0,0,.16);font-size:21px;font-weight:800;text-decoration:none}.final-section{background:linear-gradient(135deg,#19152d,#0d111a)}.final-links{display:grid;gap:12px}.final-links a{display:block;padding:20px 22px;color:#fff;border:1px solid var(--line);border-radius:18px;text-decoration:none;font-weight:800}.final-links small{display:block;margin-top:8px;color:#9ea5b6;font-weight:500;line-height:1.5}
@media(max-width:900px){.split,.research-grid,.final-grid,.text-grid{grid-template-columns:1fr;gap:38px}.apps,.papers{grid-template-columns:1fr}.hero{min-height:680px}.hero-inner{min-height:680px}.panel{padding:82px 0}.app{min-height:auto}.signal{margin-top:54px}}
@media(max-width:640px){.wrap{width:calc(100% - 34px)}.hero h1{font-size:52px}.hero p{font-size:16px}.panel{padding:68px 0}.panel h2{font-size:42px}.actions a{width:100%;text-align:center}.signal{gap:10px;font-size:9px}.papers a{grid-template-columns:auto 1fr}.papers i{display:none}}
</style>
