import{_ as s,a as n,b as p,c as e,d as l,e as t}from"./chunks/19-saaw-governed-self-morphing-v2.CtEM6EK-.js";import{_ as o,a as i}from"./chunks/03-saaw-self-morphing-loop-fixed-v2.B34zYvEG.js";import{_ as c,o as r,c as g,a2 as d}from"./chunks/framework.Cm6XCzck.js";const x=JSON.parse('{"title":"从 SaaS 到 SaaW：当代码库开始“自己开发自己”","description":"","frontmatter":{"title":"从 SaaS 到 SaaW：当代码库开始“自己开发自己”","date":"2026-08-10","column":"industry-architecture","category":"manifesto","version":"V1.1","summary":"从治理、TMPA、FCoP、Agent PC、CodeFlowMu 与 Self-Morphing 推导 SaaW，并以 Research Report Production Engine V1.3 作为真实工程锚点，区分已验证能力与研究前沿。","item_id":"MANIFESTO-20260810-SAAW","lifecycle":"Published","cover":"/assets/covers/01-saaw-manifesto-cover-agent-worker.png","visualization":"/assets/covers/02-saaw-governance-runtime-stack-fixed-v2.png","visualization_2":"/assets/covers/03-saaw-self-morphing-loop-fixed-v2.png","evidence_status":"Architecture-grounded + production-engine reference implementation","citation_status":"TMPA V1.0 DOI and publication record linked","editing_status":"Published V1.1 — full 23-section edition with TMPA V1.0 citation","publication_authorized":true,"outline":"deep"},"headers":[],"relativePath":"zh/industry/2026-08-10-saaw-software-as-an-agent-worker.md","filePath":"zh/industry/2026-08-10-saaw-software-as-an-agent-worker.md","lastUpdated":1786643477000}'),h={name:"zh/industry/2026-08-10-saaw-software-as-an-agent-worker.md"};function u(b,a,v,k,m,P){return r(),g("div",null,[...a[0]||(a[0]=[d('<h1 id="从-saas-到-saaw-当代码库开始-自己开发自己" tabindex="-1">从 SaaS 到 SaaW：当代码库开始“自己开发自己” <a class="header-anchor" href="#从-saas-到-saaw-当代码库开始-自己开发自己" aria-label="Permalink to &quot;从 SaaS 到 SaaW：当代码库开始“自己开发自己”&quot;">​</a></h1><h2 id="基于-tmpa-治理体系与-codeflowmu-实践的数字员工范式宣言" tabindex="-1">基于 TMPA 治理体系与 CodeFlowMu 实践的数字员工范式宣言 <a class="header-anchor" href="#基于-tmpa-治理体系与-codeflowmu-实践的数字员工范式宣言" aria-label="Permalink to &quot;基于 TMPA 治理体系与 CodeFlowMu 实践的数字员工范式宣言&quot;">​</a></h2><p><a href="/joinwell52/en/industry/2026-08-10-saaw-software-as-an-agent-worker">English version</a></p><p><a href="/joinwell52/assets/covers/01-saaw-manifesto-cover-agent-worker.png"><img src="'+s+`" alt="SaaW — Software as an Agent Worker"></a></p><hr><h2 id="_1-saas-没有解决的最后一公里" tabindex="-1">1. SaaS 没有解决的最后一公里 <a class="header-anchor" href="#_1-saas-没有解决的最后一公里" aria-label="Permalink to &quot;1. SaaS 没有解决的最后一公里&quot;">​</a></h2><p>过去二十年，SaaS 改变了软件的交付方式。</p><p>企业不再购买光盘，不再维护大量本地服务器，也不再为每一次版本升级付出高昂的部署成本。浏览器成为入口，云成为基础设施，订阅成为商业模式。</p><p>但有一件事几乎没有改变：</p><p><strong>人，仍然在操作软件。</strong></p><p>员工登录 ERP 查询数据，复制到 Excel；打开 CRM 补录客户信息；在财务系统里提交报销；在 OA 中审批；再把结果搬运到另一个系统。</p><p>企业拥有的软件越来越多，员工需要操作的软件也越来越多。</p><p>SaaS 解决了“软件如何交付”，却没有真正解决“工作由谁完成”。</p><p>Copilot 的出现迈出了下一步。</p><p>AI 开始进入软件界面，帮助人类写邮件、总结文档、生成代码、查询知识、辅助决策。</p><p>但 Copilot 的基本关系仍然没有改变：</p><p><strong>AI 给建议，人完成工作。</strong></p><p>人仍然要坐在屏幕前，点击按钮、切换系统、录入结果、处理异常。</p><p>真正值得讨论的下一代软件，不应该只是更聪明的工具，而应该是：</p><p><strong>能够承担工作的软件。</strong></p><p>我们将这一范式称为：</p><blockquote><p><strong>SaaW — Software as an Agent Worker</strong></p></blockquote><p>软件不再只是服务。</p><p>软件开始成为工作主体。</p><hr><h2 id="_2-从-购买工具-到-部署数字员工" tabindex="-1">2. 从“购买工具”到“部署数字员工” <a class="header-anchor" href="#_2-从-购买工具-到-部署数字员工" aria-label="Permalink to &quot;2. 从“购买工具”到“部署数字员工”&quot;">​</a></h2><p>SaaW 的核心变化，不是简单地把 Agent 嵌入 SaaS。</p><p>它改变的是软件的基本交付单位。</p><p>SaaS 交付的是<strong>功能</strong>。</p><p>Copilot 交付的是<strong>辅助</strong>。</p><p>SaaW 交付的是<strong>工作</strong>。</p><p>一个真正的 SaaW，不应该只是一个拥有系统提示词的聊天机器人。</p><p>它必须具备接近真实岗位的结构：</p><ul><li>明确的角色；</li><li>明确的岗位职责；</li><li>可执行的工作流；</li><li>可以调用的技能；</li><li>有边界的权限；</li><li>持续存在的工作状态；</li><li>可核验的工作证据；</li><li>可以恢复的运行环境；</li><li>明确的人类授权边界。</li></ul><p>因此，我们对 SaaW 给出如下定义：</p><blockquote><p><strong>SaaW（Software as an Agent Worker）是一种将软件交付为数字工作主体的软件范式。它能够在明确的岗位职责、权限边界和治理规则下持续执行工作流程、调用业务工具、产生工作成果，并接受人类监督、审查和授权。</strong></p></blockquote><p>于是，企业软件开始经历一条清晰的演化路径：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SaaS</span></span>
<span class="line"><span>软件提供工具</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Copilot</span></span>
<span class="line"><span>AI 辅助人类</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Agent</span></span>
<span class="line"><span>AI 执行动作</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>SaaW</span></span>
<span class="line"><span>软件承担工作</span></span></code></pre></div><p>真正的变化不是 AI 更聪明了，而是：</p><p><strong>软件的劳动属性发生了变化。</strong></p><hr><h2 id="_3-企业真正的难题-trace-执行轨迹-governance-治理" tabindex="-1">3. 企业真正的难题：Trace（执行轨迹）≠ Governance（治理） <a class="header-anchor" href="#_3-企业真正的难题-trace-执行轨迹-governance-治理" aria-label="Permalink to &quot;3. 企业真正的难题：Trace（执行轨迹）≠ Governance（治理）&quot;">​</a></h2><p>Agent 能够执行工具，并不意味着 Agent 可以进入企业生产环境。</p><blockquote><p><strong>“传统的 SaaS 和多智能体系统，本质上是一场精巧的幻觉：它们把业务事实死死铐在数据库的中央状态机和文件系统的拓扑结构上。一旦进程崩溃或目录微调，记忆与权限当场殉葬。</strong> <strong>真正的 SaaW 绝不依赖中央服务器的施舍。状态不因物理拓扑的变动而编码，事实永远独立于运行实例之外。”</strong></p></blockquote><p>今天许多多智能体系统已经能够生成复杂的 Trace（执行轨迹）：谁调用了哪个工具，执行了哪个函数，产生了什么结果，模型经历了哪些步骤。</p><p>这些信息非常重要。</p><p>但：</p><blockquote><p><strong>Trace（执行轨迹）≠ Governance（治理）</strong></p></blockquote><p>执行轨迹回答的是：<strong>发生了什么？</strong></p><p>而企业真正需要回答的问题更多：谁授权了这项工作？谁接受了任务？哪一个对象代表正式的工作事实？谁提交了正式报告？谁执行了审查？谁作出了决策？当前状态是否合法？是否存在悬空引用？多个主体之间是否发生了尚未解决的冲突？系统崩溃之后，下一步究竟应该由谁继续？</p><p>这不是普通日志系统能够解决的问题。</p><p>这是一个<strong>治理状态</strong>问题。</p><p>如果这些问题没有答案，Agent 就很难真正承担岗位责任。</p><p>因此我们认为：</p><blockquote><p><strong>没有治理，就没有数字员工。</strong></p></blockquote><p><a href="/joinwell52/assets/covers/15-saaw-trace-vs-governance-v2.svg"><img src="`+n+'" alt="Trace 不等于 Governance：执行轨迹与治理状态的区别"></a></p><p><em>补充图：Trace 记录已经发生的执行事件；Governance 根据持久工作事实、规则、责任与授权重建合法状态。</em></p><p>这正是 TMPA 存在的原因。</p><hr><h2 id="_4-tmpa-让工作事实脱离-agent-而存在" tabindex="-1">4. TMPA：让工作事实脱离 Agent 而存在 <a class="header-anchor" href="#_4-tmpa-让工作事实脱离-agent-而存在" aria-label="Permalink to &quot;4. TMPA：让工作事实脱离 Agent 而存在&quot;">​</a></h2><p>TMPA 试图解决的核心问题非常简单：</p><p><strong>当多个 Agent 和人类共同完成一个长期工作时，真正可信的工作状态到底存在于哪里？</strong></p><p>这是 TMPA 给出的形式化回答：</p><blockquote><p><strong>TMPA（Textual Multi-Agent Process Architecture，文本化多智能体流程架构）</strong>：一种面向中小企业、最低基础设施条件的<strong>文本消息多智能体异步流程架构</strong>。其核心由四条相互关联的规则构成：<strong>文本承载持久消息与状态；每个写者保持自己的局部串行流；多条串行流异步推进并形成并行协作；读端聚合现有证据，重建流程、责任、生命周期、冲突与审计状态。</strong></p></blockquote><p><strong>本节与第 5—7 节逐条展开这四条规则：本节讨论文本承载持久消息与状态；第 5 节讨论单写者的局部串行流；第 6 节讨论多条串行流的异步并行协作；第 7 节讨论读端重建与问题集（Issue Set）。</strong></p><p><strong>截至 2026 年 8 月 11 日，TMPA 已进入 V1.0 稳定发布线：</strong> <a href="/joinwell52/zh/publications/tmpa-architecture-paper-a1.0">架构论文 A1.0</a>、<a href="/joinwell52/zh/publications/tmpa-core-specification-s1.0">核心规范 S1.0</a> 与 <a href="/joinwell52/zh/publications/implementation-case-i1.0">实施案例 I1.0</a> 已形成稳定三件套；I1.0 固定 <strong>CodeFlowMu v1.8.0</strong>，对 <strong>S1.0</strong> 的产品验证结果为 <strong>14/14</strong>。</p><p><a href="/joinwell52/assets/covers/16-saaw-tmpa-four-rules-v2.svg"><img src="'+p+`" alt="TMPA 四条规则与事实重建"></a></p><p><em>补充图：每个主体只追加自己的事实，跨流引用形成偏序关系，Reader 聚合证据但不覆盖冲突。</em></p><blockquote><p><strong>“当多个异构智能体与人类在同一个代码库里长期博弈时，最荒谬的事莫过于把可信状态托付给模型的挥发性记忆。</strong> <strong>TMPA 的底层铁律是：文本即事实。文件与目录的物理拓扑只负责合规投影，不可变的文本对象才是跨越周期的唯一硬通货。”</strong></p></blockquote><p>重要工作事实被投射为普通、可移植的文本。</p><p>这些文本不是“聊天记录”，而是正式工作对象，例如 <code>Task</code>、<code>Acceptance</code>、<code>Report</code>、<code>Review</code>、<code>Decision</code>、<code>Correction</code>、<code>Issue</code>。</p><p>这些对象通过引用标识符形成因果关系。</p><p>于是，工作的事实不再只存在于某个 Agent 的记忆中。</p><p>Agent 可以退出，模型可以切换，进程可以重启，节点甚至可以暂时离线。</p><p>但已经成立的工作事实仍然存在。</p><p>这是 SaaW 能够持续运行的第一块地基。</p><hr><h2 id="_5-单写者-single-writer-责任必须有明确来源" tabindex="-1">5. 单写者（Single-Writer）：责任必须有明确来源 <a class="header-anchor" href="#_5-单写者-single-writer-责任必须有明确来源" aria-label="Permalink to &quot;5. 单写者（Single-Writer）：责任必须有明确来源&quot;">​</a></h2><p>TMPA 的另一个核心原则是：</p><blockquote><p><strong>Single-Writer Serial Streams</strong></p></blockquote><p>每一个 Agent 或人类责任主体都是独立的单写者。</p><p>这意味着，一个主体不去偷偷修改另一个主体已经写下的事实。</p><p>新的状态通过新的对象追加产生。</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>TASK          任务</span></span>
<span class="line"><span>  │</span></span>
<span class="line"><span>  ▼</span></span>
<span class="line"><span>ACCEPTANCE    接受任务</span></span>
<span class="line"><span>  │</span></span>
<span class="line"><span>  ▼</span></span>
<span class="line"><span>REPORT        工作报告</span></span>
<span class="line"><span>  │</span></span>
<span class="line"><span>  ▼</span></span>
<span class="line"><span>REVIEW        审查</span></span>
<span class="line"><span>  │</span></span>
<span class="line"><span>  ▼</span></span>
<span class="line"><span>DECISION      正式决策</span></span></code></pre></div><blockquote><p><strong>“企业级协同的毒瘤，在于‘谁都可以改状态’的混沌。</strong> <strong>在 TMPA 的单写者串行流中：每一个主体——无论人还是 Agent——都是绝对隔离的单写者。你只能追加自己的事实，休想污染他人的历史。</strong> <strong>责任不是靠数据库的事务锁‘算’出来的，而是由单写者不可篡改的引用链‘长’出来的。”</strong></p></blockquote><p>这与许多传统工作流引擎有一个重要差别。</p><p>传统系统往往不断修改一个中央状态：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>status = pending</span></span>
<span class="line"><span>status = running</span></span>
<span class="line"><span>status = review</span></span>
<span class="line"><span>status = done</span></span></code></pre></div><p>最后看到的是 <code>status = done</code>，但真正发生过的过程已经被覆盖。</p><p>TMPA 更关心的是：谁接受？谁提交？谁审核？谁批准？中间发生过什么争议？哪些事实后来被纠正？</p><p>状态不是被覆盖，而是被重构。</p><hr><h2 id="_6-异步世界不存在完美的全局时间线" tabindex="-1">6. 异步世界不存在完美的全局时间线 <a class="header-anchor" href="#_6-异步世界不存在完美的全局时间线" aria-label="Permalink to &quot;6. 异步世界不存在完美的全局时间线&quot;">​</a></h2><p>真实的多智能体系统天然是异步的。</p><p>PM 在写计划，DEV 同时修改代码，QA 可能已经开始检查另一个模块，OPS 正在处理部署，人类主管可能晚几个小时才进行审批。</p><p>在这种环境中，如果系统强行构造一个完美的全局顺序 <code>1 → 2 → 3 → 4 → 5</code>，往往反而会掩盖真实发生的并发关系。</p><p>TMPA 因此强调<strong>异步协作（Asynchronous Collaboration）</strong>。</p><blockquote><p><strong>“企图在异步的多智能体世界里强行捏造一条全局统一的时间线，是架构上的自大。</strong> <strong>写端只管无锁追加，偏序图在读端动态重建。没有中央调度器的瞎指挥，多智能体在本地文本流中天然错落、野蛮生长，这才是高并发数字劳动的残酷真相。”</strong></p></blockquote><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>                  ┌── DEV REPORT / 开发报告 ──┐</span></span>
<span class="line"><span>TASK / 任务 ──────┤                           ├── REVIEW / 审查</span></span>
<span class="line"><span>                  └── OPS REPORT / 运维报告 ──┘</span></span></code></pre></div><p>两个 Report 谁先写完并不是最重要的。</p><p>重要的是，它们都因果依赖于同一个 TASK，而 REVIEW 又依赖于这些工作事实。</p><p>这更接近真实组织的工作方式。</p><hr><h2 id="_7-问题集-issue-set-不要隐藏冲突" tabindex="-1">7. 问题集（Issue Set）：不要隐藏冲突 <a class="header-anchor" href="#_7-问题集-issue-set-不要隐藏冲突" aria-label="Permalink to &quot;7. 问题集（Issue Set）：不要隐藏冲突&quot;">​</a></h2><p>很多自动化系统喜欢追求一个“漂亮的最终状态”：冲突最好自动消失，错误最好自动修正，所有流程最终都显示绿色。</p><p>但真实组织不是这样的。</p><p>在企业工作中，两个角色可能意见冲突；引用可能不存在；状态可能非法跃迁；QA 可能否决 DEV；Report 可能缺少必要证据；Decision 可能没有合法前置条件。</p><p>TMPA 的目标不是让这些问题消失，而是：</p><p><strong>让问题成为正式事实。</strong></p><p>这里的关键不只是“列出错误”，而是<strong>读端重建</strong>。写端不负责偷偷消解冲突，也不把到达顺序冒充治理顺序；Reader 聚合当前可用证据，重建流程、责任、生命周期、冲突与审计状态。**问题集（Issue Set）**就是其中对冲突、缺口和非法状态的正式表达。</p><blockquote><p><strong>TMPA 不承诺冲突不会发生；它要求冲突不能被隐藏。</strong></p></blockquote><p>因此，Reader 不仅重构流程图，还需要重构问题集，例如：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dangling_reference</span></span>
<span class="line"><span>illegal_transition</span></span>
<span class="line"><span>unresolved_disagreement</span></span>
<span class="line"><span>missing_acceptance</span></span>
<span class="line"><span>conflicting_review</span></span></code></pre></div><p>这是 SaaW 非常重要的一项能力。</p><p>因为企业真正需要的不是永远不会犯错的 AI——这种 AI 不存在。</p><p>企业真正需要的是：<strong>即使 AI 犯错，系统也能够知道哪里出了问题，并把问题暴露给正确的人。</strong></p><hr><h2 id="_8-可恢复性-recoverability-数字员工必须能够-醒来继续工作" tabindex="-1">8. 可恢复性（Recoverability）：数字员工必须能够“醒来继续工作” <a class="header-anchor" href="#_8-可恢复性-recoverability-数字员工必须能够-醒来继续工作" aria-label="Permalink to &quot;8. 可恢复性（Recoverability）：数字员工必须能够“醒来继续工作”&quot;">​</a></h2><p>SaaW 与普通聊天机器人最大的差别之一，是时间尺度。</p><p>聊天机器人的典型生命周期可能只有几分钟，而真实工作可能持续数小时、数天、数周，甚至数月。</p><p>这意味着数字员工一定会遇到网络中断、SDK 超时、Agent 退出、运行体重启、模型上下文丢失、操作系统重启和软件升级。</p><p>如果每一次异常都意味着“重新告诉 AI 前面发生了什么”，那么它永远无法成为真正的员工。</p><p>因此 SaaW 必须具备<strong>可恢复性（Recoverability）</strong>。</p><p>TMPA 的目标之一，就是让当前治理状态能够从持久化事实重新计算。</p><p>CodeFlowMu / FCoP 将这一思想进一步投射到文件系统。</p><p>当节点重新启动时，不需要假设原来的模型一定还记得，而是重新读取 <code>TASK</code>、<code>ACCEPTANCE</code>、<code>REPORT</code>、<code>REVIEW</code>、<code>DECISION</code>、<code>ISSUE</code>，然后重新推导：当前任务是谁负责？已经完成了什么？哪些结果已经被确认？哪些问题还没有解决？现在允许发生什么？下一步应该由谁行动？</p><p>于是恢复不再是恢复 Agent 的记忆，而是：</p><p><strong>重构工作的事实。</strong></p><hr><h3 id="一个数字研究员的一天-research-report-production-engine-v1-3" tabindex="-1">一个数字研究员的一天：Research Report Production Engine V1.3 <a class="header-anchor" href="#一个数字研究员的一天-research-report-production-engine-v1-3" aria-label="Permalink to &quot;一个数字研究员的一天：Research Report Production Engine V1.3&quot;">​</a></h3><p>我们不再虚构一个岗位。下面就是 <strong>Research Report Production Engine V1.3</strong> 作为“数字研究员”的真实一天。</p><p><strong>09:00 · 研究发现</strong><br> 数字研究员开始当天工作，扫描新的研究信号、工程变化和待研究问题，判断哪些内容值得进入研究视野。<br><strong>产出：信号池（Signal Pool）。</strong></p><p><strong>10:00 · 研究队列</strong><br> 它从信号池中筛选当天真正要推进的研究对象，确定优先级和研究方向。不是看到什么就写什么，而是先决定“今天研究什么”。<br><strong>产出：今日研究计划（Today&#39;s Research Plan）。</strong></p><p><strong>11:00 · 研究阅读</strong><br> 围绕当天选定的研究对象读取论文、规范、工程记录、代码、测试结果和已有材料，整理可用证据，同时明确还缺什么。<br><strong>产出：阅读结果（Reading Result）。</strong></p><p><strong>13:00 · 研究分析</strong><br> 把上午获得的材料转化为判断：哪些事实成立，哪些只是推断，哪里存在争议，边界条件是什么，接下来应该形成什么研究结论。<br><strong>产出：研究对象（Research Object）。</strong></p><p><strong>15:00 · 研究生产</strong><br> 数字研究员开始把研究对象加工成正式工作成果：组织文章结构、写报告、核对证据、补充必要的图表和可视化，形成可以进入发布审查的候选版本。<br><strong>产出：发布候选稿（Publication Candidate）。</strong></p><p><strong>20:00 · 正式发布</strong><br> 候选稿满足发布条件后进入正式发布：写入 GitHub、生成网站页面、完成提交验证与发布确认；如果存在必须由人承担责任的事项，就停在授权边界等待人工决定。<br><strong>产出：正式发布的研究成果。</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>09:00 研究发现      → 信号池</span></span>
<span class="line"><span>10:00 研究队列      → 今日研究计划</span></span>
<span class="line"><span>11:00 研究阅读      → 阅读结果</span></span>
<span class="line"><span>13:00 研究分析      → 研究对象</span></span>
<span class="line"><span>15:00 研究生产      → 发布候选稿</span></span>
<span class="line"><span>20:00 正式发布      → GitHub 入库 + 网站发布 + 提交验证 + Release</span></span></code></pre></div><p>这就是一个数字研究员的一天：<strong>它不是回答一次问题，而是在固定职责和工作节奏下，持续完成研究工作。</strong></p><hr><h2 id="_9-fcop-文件驱动协作协议" tabindex="-1">9. FCoP：文件驱动协作协议 <a class="header-anchor" href="#_9-fcop-文件驱动协作协议" aria-label="Permalink to &quot;9. FCoP：文件驱动协作协议&quot;">​</a></h2><p><strong>FCoP（File-based Coordination Protocol，文件驱动协作协议）是一种以文件系统为唯一同步原语的多智能体行为治理协议。</strong></p><p>它的核心不变式是 <strong>Filename as Protocol</strong>。在项目可见的文件系统 Profile 中：</p><ul><li><strong>目录即状态</strong>：<code>_lifecycle/{inbox,active,review,done,archive}/</code>；</li><li><strong>文件名即路由</strong>：发送者、接收者、类型与序号共同表达工作对象的来源、去向与身份；</li><li><strong>内容即负载</strong>：Markdown 正文与 YAML frontmatter 承载任务、报告、问题、引用和治理事实；</li><li><strong><code>os.rename()</code> 是唯一同步操作</strong>：生命周期迁移依靠文件系统原子移动，而不是协调数据库、消息 Broker 或中心锁服务。</li></ul><p>一个任务的生命周期因此可以直接被观察：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>inbox      收件箱 / 待领取</span></span>
<span class="line"><span>  │</span></span>
<span class="line"><span>  ▼</span></span>
<span class="line"><span>active     执行中</span></span>
<span class="line"><span>  │</span></span>
<span class="line"><span>  ▼</span></span>
<span class="line"><span>review     待审查</span></span>
<span class="line"><span>  │</span></span>
<span class="line"><span>  ▼</span></span>
<span class="line"><span>done       已完成</span></span>
<span class="line"><span>  │</span></span>
<span class="line"><span>  ▼</span></span>
<span class="line"><span>archive    已归档</span></span></code></pre></div><p><a href="/joinwell52/assets/covers/17-saaw-fcop-lifecycle-v2.svg"><img src="`+e+`" alt="FCoP 文件驱动生命周期与事实平面"></a></p><p><em>补充图：生命周期变化通过项目可见工作对象表达；人、Agent、Reader 与运维工具观察同一事实平面。</em></p><p>FCoP 治理的是 <strong>Agent 的协作行为</strong>：任务如何交接、结果如何报告、问题如何提出、能力边界如何声明，以及这些行为如何留下事件语义、失败边界与可审计证据。</p><p><strong>FCoP 不治理执行运行时。</strong> 调度、进程管理、模型会话、资源分配、身份认证和运行节点管理不属于协议本身的职责。</p><p>从 TMPA 的实现关系看，FCoP 是一种<strong>项目可见的文件系统 Profile</strong>。它不强制要求协调数据库、消息 Broker 或企业级控制平面，但也不会单独提供经过验证的企业身份、强角色隔离、防篡改存储或拜占庭容错。这与 TMPA 的 <strong>SME-first，而非 SME-only</strong> 边界一致：更大规模的部署可以增加数据库、对象存储、事件服务、身份系统和控制平面，而不改变协议所承载的治理语义。</p><p>更重要的是，<strong>FCoP 协议、工具包、适配职责、参考实现和运行环境不是同一个东西。</strong> 随着 TMPA V1.0 正式发布，这套运行关系已经冻结到 <strong>A1.0 / S1.0 / I1.0</strong> 稳定发布线。运行栈可以直接写成：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>应用层 / Application Runtime</span></span>
<span class="line"><span>CodeFlowMu / Cursor / Claude Desktop</span></span>
<span class="line"><span>                │</span></span>
<span class="line"><span>                ▼</span></span>
<span class="line"><span>主机适配层 / Host Adapter Layer</span></span>
<span class="line"><span>fcop-mcp / host bridges</span></span>
<span class="line"><span>                │</span></span>
<span class="line"><span>                ▼</span></span>
<span class="line"><span>★ FCoP 协议层 / FCoP Protocol Layer ★</span></span>
<span class="line"><span>行为治理 / 交接 / 报告 / 审查 / 能力边界</span></span>
<span class="line"><span>事件语义 / 失败边界 / 可审计性</span></span>
<span class="line"><span>                │</span></span>
<span class="line"><span>                ▼</span></span>
<span class="line"><span>参考实现 / Reference Implementation</span></span>
<span class="line"><span>fcop（Python library）</span></span>
<span class="line"><span>                │</span></span>
<span class="line"><span>                ▼</span></span>
<span class="line"><span>执行基座 / Execution Substrate</span></span>
<span class="line"><span>LLM APIs / MCP tools / 文件系统 / 进程管理 / 操作系统</span></span></code></pre></div><p>因此：</p><ul><li><code>fcop</code> 是发布在 PyPI 上的 Python Package，也是 <strong>FCoP 的参考实现</strong>；CLI 能力由 <code>fcop</code> 提供；</li><li><code>fcop-mcp</code> 是发布在 PyPI 上的 FCoP MCP 工具包；在运行栈中承担<strong>主机适配职责</strong>，把 FCoP 能力暴露给实际宿主；</li><li><strong>CodeFlowMu 是使用 FCoP 作为协作协议的应用 / 运行系统。</strong></li><li>TMPA 不属于这个运行栈中的某一层，它提供的是这套栈试图实现的上位治理语义与架构指导。</li></ul><p>这也解释了为什么“目录即状态”如此重要：系统管理员、人类主管、Agent 和调试工具可以观察同一组项目事实，而不必先进入一个隐藏的中央协调状态。</p><hr><h2 id="_10-codeflowmu-从协议进入真实运行世界" tabindex="-1">10. CodeFlowMu：从协议进入真实运行世界 <a class="header-anchor" href="#_10-codeflowmu-从协议进入真实运行世界" aria-label="Permalink to &quot;10. CodeFlowMu：从协议进入真实运行世界&quot;">​</a></h2><p>如果说 TMPA 定义的是工作事实与治理语义，FCoP 提供项目可见的文件驱动协作协议，那么 <strong>CodeFlowMu 解决的是这些语义和协议如何进入真实 Agent 运行世界。</strong></p><p>CodeFlowMu 的工程起点不是构造一个巨大的中央 Agent 运行体。</p><p>相反，它试图保持克制：推理交给成熟模型生态，工具交给实际运行环境，而自身集中解决工作编排、Agent 责任边界、生命周期、FCoP 接入、Skill 调用、报告、审查、人类决策、恢复与运行治理。</p><p>这形成一个非常重要的工程边界：</p><p><strong>CodeFlowMu 不需要重新发明 LLM，也不重新定义 FCoP。</strong></p><p>模型只是数字员工“大脑”的一部分；FCoP 是其采用的协作协议；真正决定数字员工能不能持续承担工作的是外部工作结构、运行环境和治理闭环。</p><p><a href="/joinwell52/assets/covers/02-saaw-governance-runtime-stack-fixed-v2.png"><img src="`+o+'" alt="SaaW 治理与运行架构：SaaW、CodeFlowMu、FCoP 与 TMPA"></a></p><p><em>图 1：SaaW 治理与运行架构。TMPA 提供工作事实与治理架构，FCoP 提供文件驱动协作协议，CodeFlowMu 承担工程运行，SaaW 描述最终的软件交付范式。</em></p><p><a href="/joinwell52/assets/covers/18-saaw-codeflowmu-runtime-boundary-v2.svg"><img src="'+l+`" alt="CodeFlowMu 工程运行边界"></a></p><p><em>补充图：模型负责推理，工具负责行动；CodeFlowMu 组织工作，FCoP 承载事实，TMPA 指导治理语义。</em></p><hr><h2 id="_11-agent-pc-真正的数字员工需要一台-电脑" tabindex="-1">11. Agent PC：真正的数字员工需要一台“电脑” <a class="header-anchor" href="#_11-agent-pc-真正的数字员工需要一台-电脑" aria-label="Permalink to &quot;11. Agent PC：真正的数字员工需要一台“电脑”&quot;">​</a></h2><p>如果 SaaW 是工作主体，那么它就必须拥有工作环境。</p><p>我们把这一运行节点称为：</p><blockquote><p><strong>Agent PC</strong></p></blockquote><p>它并不一定是一台传统意义上的物理电脑，而代表一个数字员工拥有的独立运行环境。</p><p>其中包括推理能力、Skill、工作流、凭据、运行环境、文件、治理规则与外部系统。</p><p>它可以使用浏览器、API、CLI、脚本、MCP、企业内部服务和受控自动化接口。</p><p>于是 Agent 不再只是：</p><p><code>提示 → 响应</code></p><p>而变成：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>任务</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>推理</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>调用 Skill</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>操作业务系统</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>观察结果</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>生成证据</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>继续 / 报告 / 升级处理</span></span></code></pre></div><p>这才是真正的数字员工运行循环。</p><hr><h2 id="_12-非侵入式数字员工-让-ai-使用软件-而不是绕过软件" tabindex="-1">12. 非侵入式数字员工：让 AI 使用软件，而不是绕过软件 <a class="header-anchor" href="#_12-非侵入式数字员工-让-ai-使用软件-而不是绕过软件" aria-label="Permalink to &quot;12. 非侵入式数字员工：让 AI 使用软件，而不是绕过软件&quot;">​</a></h2><p>企业自动化最危险的诱惑之一，是让 AI 直接修改数据库。</p><p>这看起来非常高效。</p><p>但真实企业系统并不是简单的增删改查（CRUD）。</p><p>一个字段背后可能存在状态机、触发器、存储过程、权限规则、财务约束、工作流、审计轨迹与外部系统联动。</p><p>直接改表，相当于绕过企业几十年积累下来的业务边界。</p><p>因此 SaaW 更值得探索的路径是：</p><p><strong>AI 操作业务系统，而不是绕过业务系统。</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Agent / 智能体</span></span>
<span class="line"><span>  │</span></span>
<span class="line"><span>  ├── API / 接口</span></span>
<span class="line"><span>  ├── Browser / 浏览器</span></span>
<span class="line"><span>  ├── CLI / 命令行</span></span>
<span class="line"><span>  ├── Hook / 受控钩子</span></span>
<span class="line"><span>  └── Approved Automation / 受控自动化</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Existing ERP / CRM / Business System</span></span>
<span class="line"><span>既有 ERP / CRM / 业务系统</span></span></code></pre></div><p>这样做的意义并不是保证“永远不会出错”，而是让错误尽量发生在已有业务规则可以观察、拒绝、审计和回滚的边界内。</p><p>这才是企业级 AI 自动化真正需要的工程态度。</p><hr><h2 id="_13-从代码中重新发现企业-sop" tabindex="-1">13. 从代码中重新发现企业 SOP <a class="header-anchor" href="#_13-从代码中重新发现企业-sop" aria-label="Permalink to &quot;13. 从代码中重新发现企业 SOP&quot;">​</a></h2><p>遗留软件还有一个经常被低估的价值：</p><p><strong>代码本身就是企业知识。</strong></p><p>大量企业流程并没有完整 SOP 文档。</p><p>真正的规则隐藏在 API、控制器、表单、校验规则、状态迁移、权限检查、批处理脚本、数据库结构与配置中。</p><p>因此 CodeFlowMu 的一个重要演进方向，是让元开发团队能够分析现有系统，帮助重新提取：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>现有代码</span></span>
<span class="line"><span>      │</span></span>
<span class="line"><span>      ▼</span></span>
<span class="line"><span>业务规则</span></span>
<span class="line"><span>      │</span></span>
<span class="line"><span>      ▼</span></span>
<span class="line"><span>工作流</span></span>
<span class="line"><span>      │</span></span>
<span class="line"><span>      ▼</span></span>
<span class="line"><span>SOP</span></span>
<span class="line"><span>      │</span></span>
<span class="line"><span>      ▼</span></span>
<span class="line"><span>数字员工 Skill</span></span></code></pre></div><p>但这并不意味着“扫描代码 = 自动理解整个企业”。</p><p>真实 SOP 还可能来自文档、人工说明、API 规范、操作录像、岗位说明书、政策规则与业务专家反馈。</p><p>代码只是其中极其重要的一种事实来源。</p><p>更严谨地说，这条路径应该被理解为：</p><blockquote><p><strong>企业证据 → 候选 SOP → 验证 → 受治理工作流</strong></p></blockquote><p>AI 的价值，是让这些分散知识能够被低成本地重新结构化；而候选 SOP 只有经过业务验证、工程测试、治理检查或人类授权，才能升级为数字员工可执行的正式工作流。</p><hr><h2 id="_14-codeflowmu-的第二形态-元开发运行体-meta-development-runtime" tabindex="-1">14. CodeFlowMu 的第二形态：元开发运行体（Meta-Development Runtime） <a class="header-anchor" href="#_14-codeflowmu-的第二形态-元开发运行体-meta-development-runtime" aria-label="Permalink to &quot;14. CodeFlowMu 的第二形态：元开发运行体（Meta-Development Runtime）&quot;">​</a></h2><p>CodeFlowMu 当前最值得关注的地方，不只是多个 Agent 可以一起开发软件。</p><p>更重要的是，这种研发能力本身可以成为下一代数字员工的生产能力。</p><p>我们把这一形态称为<strong>元开发运行体（Meta-Development Runtime）</strong>。</p><p>初始 CodeFlowMu 可以表现为一个四角色开发团队：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>┌─────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│        CodeFlowMu Meta Team / 元开发团队            │</span></span>
<span class="line"><span>│                                                     │</span></span>
<span class="line"><span>│ PM / 项目经理   DEV / 开发   QA / 质量验证   OPS / 运维 │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────┘</span></span></code></pre></div><p>他们拥有各自的责任边界。</p><p>PM 理解需求、拆解工作、组织协作。</p><p>DEV 实现代码、Skill、Hook 和工作流。</p><p>QA 验证业务结果与工程结果。</p><p>OPS 负责运行环境、恢复、部署和生命周期。</p><p>这是 CodeFlowMu 的<strong>元开发模式</strong>。</p><p>它的产物，不一定只是传统软件，还可以是：</p><p><strong>数字员工包（Digital Employee Package）。</strong></p><hr><h2 id="_15-数字员工包-digital-employee-package-让数字员工成为可工程化产品" tabindex="-1">15. 数字员工包（Digital Employee Package）：让数字员工成为可工程化产品 <a class="header-anchor" href="#_15-数字员工包-digital-employee-package-让数字员工成为可工程化产品" aria-label="Permalink to &quot;15. 数字员工包（Digital Employee Package）：让数字员工成为可工程化产品&quot;">​</a></h2><p>一个数字员工真正可以部署之前，需要被工程化描述。</p><p>一个完整的数字员工包通常至少包括：</p><ul><li>角色；</li><li>岗位职责；</li><li>工作流；</li><li>Skill；</li><li>权限；</li><li>治理策略；</li><li>验证规则；</li><li>运行配置；</li><li>恢复规则；</li><li>人类决策门。</li></ul><p>于是数字员工第一次开始像一个真正的软件产品一样：可以定义、可以开发、可以测试、可以版本化、可以部署、可以升级、可以回滚。</p><p>这也是 SaaW 与“写一个 Agent 提示词”之间最根本的区别之一。</p><hr><h3 id="现实工程锚点-这篇-saaw-宣言本身就是案例" tabindex="-1">现实工程锚点：这篇 SaaW 宣言本身就是案例 <a class="header-anchor" href="#现实工程锚点-这篇-saaw-宣言本身就是案例" aria-label="Permalink to &quot;现实工程锚点：这篇 SaaW 宣言本身就是案例&quot;">​</a></h3><p>这里存在一个很重要的递归关系。</p><p>我们不是先写一篇文章宣称 SaaW 存在，再寻找一个虚构案例证明它。<strong>我们用已经运行的 Research Report Production Engine V1.3 来解释 SaaW，而这篇 SaaW 宣言本身，又成为这台研究生产机所管理、审查和发布的研究成果。</strong></p><p>研究生产链可以写成：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Research Question      研究问题</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>Research Object        研究对象</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>Evidence / Reading     证据 / 阅读</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>Analysis               分析</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>Report                 报告</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>Evidence Gate          证据门</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>Visualization          可视化</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>Human Authorization    人类授权</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>Publication            发布</span></span></code></pre></div><p>而把同一条链换成 SaaW 的语言，就是：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>角色 → 工作流 → Skill → 工作状态 → 工作证据</span></span>
<span class="line"><span>    → 治理 → 人类授权 → 工作结果</span></span></code></pre></div><p>两条链描述的不是两套系统，而是同一个事实：软件开始在明确职责、证据规则和授权边界下承担持续工作。</p><blockquote><p><strong>这不是 AI 写作工具，而是一个受治理的研究型数字员工。</strong><br><strong>This is not an AI writing tool. It is a governed research worker.</strong></p></blockquote><hr><h2 id="_16-self-morphing-当代码库开始-自己开发自己" tabindex="-1">16. Self-Morphing：当代码库开始“自己开发自己” <a class="header-anchor" href="#_16-self-morphing-当代码库开始-自己开发自己" aria-label="Permalink to &quot;16. Self-Morphing：当代码库开始“自己开发自己”&quot;">​</a></h2><p>现在，我们来到整篇文章最重要的部分。</p><blockquote><p><strong>Self-Morphing</strong></p></blockquote><p>这个词很容易被误解。</p><p>它不是 Agent 随意修改自己的源代码，更不是 AI 无限制地自我复制。</p><p>Self-Morphing 真正值得讨论的含义是：</p><blockquote><p><strong>一个数字员工运行系统，利用自身的软件开发能力，构造、验证并部署新的数字员工形态。</strong></p></blockquote><p><a href="/joinwell52/assets/covers/03-saaw-self-morphing-loop-fixed-v2.png"><img src="`+i+'" alt="Self-Morphing：从元开发运行体到数字员工履职闭环"></a></p><p><em>图 2：Self-Morphing 的受治理闭环。开发、验证、授权、部署、履职与工作证据进入同一个可恢复、可追踪的生命周期。</em></p><p><a href="/joinwell52/assets/covers/19-saaw-governed-self-morphing-v2.svg"><img src="'+t+`" alt="受治理的元开发与 Self-Morphing 闭环"></a></p><p><em>补充图：生产证据可以进入元开发，但元开发不能在线改写生产运行体；验证与授权决定能否部署，并始终保留回滚路径。</em></p><p>其完整过程应该是：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Meta-Dev Runtime              元开发运行体</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Analyze Existing Work         分析现有工作</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Develop Worker Package        开发数字员工包</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Validate                      验证</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Human / Governance Decision   人类 / 治理决策</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Deploy                        部署</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Domain Worker Runtime         领域数字员工运行体</span></span></code></pre></div><p>例如：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PM / DEV / QA / OPS           元开发团队</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        │ 开发</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Finance Worker Package        财务数字员工包</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Invoice Agent                 发票处理智能体</span></span>
<span class="line"><span>ERP Entry Agent               ERP 录入智能体</span></span>
<span class="line"><span>Compliance Agent              合规智能体</span></span>
<span class="line"><span>Archive Agent                 归档智能体</span></span></code></pre></div><p>或者：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PM / DEV / QA / OPS           元开发团队</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Contract Worker Package       合同数字员工包</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Risk Analysis Agent           风险分析智能体</span></span>
<span class="line"><span>Signing Agent                 签署智能体</span></span>
<span class="line"><span>Compliance Agent              合规智能体</span></span>
<span class="line"><span>Archive Agent                 归档智能体</span></span></code></pre></div><p>过去的软件开发模型是：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>人类</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>开发软件</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>人类使用软件</span></span></code></pre></div><p>而 Self-Morphing 开始出现：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>AI 开发团队</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>开发数字员工</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>数字员工承担工作</span></span></code></pre></div><p>然后更加重要的一步出现：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>数字员工履职</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>工作证据 / 问题</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>开发输入</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>下一版本数字员工</span></span></code></pre></div><p>于是软件开发与软件履职第一次形成闭环：</p><blockquote><p><strong>开发 → 验证 → 部署 → 工作 → 观察 → 改进</strong></p></blockquote><p>这就是“代码库开始自己开发自己”真正值得研究的含义。</p><hr><h2 id="_17-从开发运行体到工作运行体" tabindex="-1">17. 从开发运行体到工作运行体 <a class="header-anchor" href="#_17-从开发运行体到工作运行体" aria-label="Permalink to &quot;17. 从开发运行体到工作运行体&quot;">​</a></h2><p>传统软件世界存在非常明确的边界：研发系统负责开发，生产系统负责运行，用户负责工作。</p><p>SaaW 正在让这三者重新组合。</p><p>CodeFlowMu 的长期方向可以被表达为：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Development Runtime          开发运行体</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Digital Employee Package     数字员工包</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Work Runtime                 工作运行体</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Work Evidence                工作证据</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span>Development Runtime          回到开发运行体</span></span></code></pre></div><p>这不是简单的 DevOps。</p><p>DevOps 连接的是开发与部署。</p><p>SaaW 进一步连接的是：</p><p><strong>开发与工作。</strong></p><p>这可能成为 AI 原生软件与传统软件最大的分水岭之一。</p><hr><h2 id="_18-人类并没有消失-而是离开了操作层" tabindex="-1">18. 人类并没有消失，而是离开了操作层 <a class="header-anchor" href="#_18-人类并没有消失-而是离开了操作层" aria-label="Permalink to &quot;18. 人类并没有消失，而是离开了操作层&quot;">​</a></h2><p>数字员工的出现并不意味着把人类排除在工作闭环之外。</p><p>恰恰相反。</p><p>真正安全的 SaaW 必须明确：哪些事情 Agent 可以在授权范围内自主完成，哪些事情必须由人作出决定。</p><p><strong>在 SaaS 模式中，人通常处于软件操作层；在 SaaW 模式中，人逐渐转向监督与最终授权层。</strong></p><p>查询、整理、校验、生成报告、内部同步等低风险工作可以高度自动化。</p><p>而对于大额付款、合同最终签署、权限提升、不可逆数据操作和重要公开发布，系统应该进入明确的人类决策门。</p><p>更准确地说：</p><blockquote><p><strong>人处在授权边界（Human at the Authority Boundary）。</strong></p></blockquote><hr><h2 id="_19-pwa-数字员工团队的移动控制面" tabindex="-1">19. PWA：数字员工团队的移动控制面 <a class="header-anchor" href="#_19-pwa-数字员工团队的移动控制面" aria-label="Permalink to &quot;19. PWA：数字员工团队的移动控制面&quot;">​</a></h2><p>CodeFlowMu 的 PWA 因此并不是简单的手机网页。</p><p>它代表的是数字员工团队的<strong>人类控制面（Human Control Plane）</strong>。</p><p>管理者可以通过移动端查看当前任务、Agent 状态、报告、审查、问题、待决事项、恢复状态与工作结果。</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SaaW Runtime        SaaW 运行体</span></span>
<span class="line"><span>      │</span></span>
<span class="line"><span>      ▼</span></span>
<span class="line"><span>工作报告</span></span>
<span class="line"><span>      │</span></span>
<span class="line"><span>      ▼</span></span>
<span class="line"><span>FCoP / TMPA 工作事实</span></span>
<span class="line"><span>      │</span></span>
<span class="line"><span>      ▼</span></span>
<span class="line"><span>Reader              状态读取器</span></span>
<span class="line"><span>      │</span></span>
<span class="line"><span>      ▼</span></span>
<span class="line"><span>Mobile PWA          移动控制面</span></span>
<span class="line"><span>      │</span></span>
<span class="line"><span>      ▼</span></span>
<span class="line"><span>人类批准 / 驳回</span></span>
<span class="line"><span>      │</span></span>
<span class="line"><span>      ▼</span></span>
<span class="line"><span>正式决策</span></span>
<span class="line"><span>      │</span></span>
<span class="line"><span>      ▼</span></span>
<span class="line"><span>SaaW Runtime        SaaW 运行体继续工作</span></span></code></pre></div><p>这里最重要的一点是：批准并不是一个普通的界面点击事件。</p><p>点击只是界面。</p><p>真正发生的是：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>人类决策</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>治理事实</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>状态迁移</span></span></code></pre></div><p>授权因此进入正式工作历史。</p><p>这才是真正意义上的<strong>人类在环治理（Human-in-the-Loop Governance）</strong>。</p><hr><h2 id="_20-一个数字员工-不应该依赖一个永不掉线的模型会话" tabindex="-1">20. 一个数字员工，不应该依赖一个永不掉线的模型会话 <a class="header-anchor" href="#_20-一个数字员工-不应该依赖一个永不掉线的模型会话" aria-label="Permalink to &quot;20. 一个数字员工，不应该依赖一个永不掉线的模型会话&quot;">​</a></h2><p>今天大量 Agent 产品隐含着一个危险假设：模型会话一直存在。</p><p>但真实世界不会这样。</p><p>模型会超时，上下文会溢出，Gateway 会失败，Agent 会崩溃，软件会升级，服务器会重启。</p><p>所以真正的 SaaW 必须遵守一个非常重要的原则：</p><blockquote><p><strong>Agent 可以替换，工作事实不能丢失。</strong></p></blockquote><p>Agent 可以换，模型可以换，SDK 可以换，运行体可以重启。</p><p>但已经成立的工作事实不能因此消失。</p><p>这也是 TMPA、FCoP 与 CodeFlowMu 真正共同指向的地方：</p><p><strong>把智能从“会话连续性”中解放出来，把工作的连续性建立在可持久化事实之上。</strong></p><p>这可能是构建长期数字员工最重要的架构原则之一。</p><hr><h2 id="_21-saaw-改变的不是-ai-而是软件经济学" tabindex="-1">21. SaaW 改变的不是 AI，而是软件经济学 <a class="header-anchor" href="#_21-saaw-改变的不是-ai-而是软件经济学" aria-label="Permalink to &quot;21. SaaW 改变的不是 AI，而是软件经济学&quot;">​</a></h2><p>最终，SaaW 讨论的并不只是一个新的 Agent 框架。</p><p>它可能意味着软件经济模型发生变化。</p><p>SaaS 的商业逻辑是：企业购买软件能力，然后继续配备员工完成工作。</p><p>SaaW 的商业逻辑可能变成：企业部署数字工作能力，工作结果第一次开始成为软件交付的一部分。</p><p>因此：</p><p><strong>SaaS 卖能力。</strong><br><strong>SaaW 交付工作。</strong></p><p>企业未来购买的可能不再只是 CRM，而是客户运营数字团队；不再只是财务系统，而是财务处理数字员工；不再只是合同管理平台，而是合同审查与履约数字团队。</p><p>软件市场可能从<strong>软件市场</strong>逐渐扩展到：</p><blockquote><p><strong>数字劳动力市场</strong></p></blockquote><p>这才是 SaaW 真正巨大的想象空间。</p><hr><h2 id="_22-saaw-不是一个新的聊天框" tabindex="-1">22. SaaW 不是一个新的聊天框 <a class="header-anchor" href="#_22-saaw-不是一个新的聊天框" aria-label="Permalink to &quot;22. SaaW 不是一个新的聊天框&quot;">​</a></h2><p>我们最终想表达的其实只有一句话：</p><p><strong>数字员工不是更聪明的聊天机器人。</strong></p><p>它必须拥有工作职责、工作环境、工具、权限、状态、治理、证据、恢复能力，以及人类授权边界。</p><p>TMPA 研究：这些工作事实如何成立。</p><p>FCoP 研究：这些协作关系如何以极轻量方式投射。</p><p>CodeFlowMu 研究：这些 Agent 如何真正组成团队并持续工作。</p><p>Agent PC 提供：数字员工的工作环境。</p><p>PWA 提供：人类管理数字员工的控制面。</p><p>而 SaaW 则给这一整套变化一个更高层的名字：</p><blockquote><p><strong>Software as an Agent Worker</strong></p></blockquote><hr><h2 id="_23-从-saas-到-saaw" tabindex="-1">23. 从 SaaS 到 SaaW <a class="header-anchor" href="#_23-从-saas-到-saaw" aria-label="Permalink to &quot;23. 从 SaaS 到 SaaW&quot;">​</a></h2><p>过去四十年，软件一直在回答一个问题：</p><blockquote><p><strong>我们怎样让人更高效地工作？</strong></p></blockquote><p>AI 原生软件开始面对另一个问题：</p><blockquote><p><strong>哪些工作可以由软件本身完成？</strong></p></blockquote><p>这并不意味着软件将取代所有人。</p><p>真正发生的变化可能更加深刻：人逐渐从重复的软件操作中退出，Agent 进入操作层，人进入治理层。</p><p>于是：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SaaS</span></span>
<span class="line"><span>人操作软件</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>Copilot</span></span>
<span class="line"><span>人与 AI 协同操作</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>SaaW</span></span>
<span class="line"><span>AI 承担工作</span></span>
<span class="line"><span>人负责治理与授权</span></span></code></pre></div><p>而当能够开发数字员工的系统，又开始利用自身能力开发下一代数字员工：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>AI 开发数字员工</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>数字员工承担工作</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>工作产生证据</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>证据驱动下一轮开发</span></span>
<span class="line"><span>        ↓</span></span>
<span class="line"><span>AI 开发下一代数字员工</span></span></code></pre></div><p>一个过去不存在的软件生命周期开始形成。</p><h3 id="已验证-today" tabindex="-1">已验证（Today） <a class="header-anchor" href="#已验证-today" aria-label="Permalink to &quot;已验证（Today）&quot;">​</a></h3><p>为了不把研究方向包装成已经完成的产品能力，需要把今天已经存在的工程事实单独列出来：</p><ul><li>FCoP 的文件驱动生命周期、任务移交、报告与问题机制；</li><li>PM / DEV / QA / OPS 四角色 Agent 的实际协作闭环；</li><li><code>Report</code>、<code>Review</code>、<code>Decision</code> 以及人类审批链路；</li><li>PWA 人类控制面与待决事项处理；</li><li>运行中断后的恢复治理；</li><li>TMPA Reader、规范测试与工作事实重构；</li><li>CodeFlowMu 的真实工程协作案例；</li><li>Research Report Production Engine V1.3 从研究任务到受治理发布的生产链路。</li></ul><h3 id="正在探索-next" tabindex="-1">正在探索（Next） <a class="header-anchor" href="#正在探索-next" aria-label="Permalink to &quot;正在探索（Next）&quot;">​</a></h3><p>仍处在研究、标准化或更大规模工程验证阶段的包括：</p><ul><li>数字员工包（Digital Employee Package）的标准化；</li><li>Agent PC 的标准化；</li><li>面向具体岗位的工作运行体；</li><li>从遗留系统与企业证据中提取候选 SOP；</li><li>从元开发运行体到领域数字员工运行体的转换；</li><li>受治理的 Self-Morphing 闭环。</li></ul><p>这个区分不是保守，而是可信度的一部分：<strong>已经验证的能力用证据说话，正在探索的能力保留为研究命题。</strong> Self-Morphing 的意义，也正因为它建立在已经存在的治理、恢复、工作事实与工程运行能力之上。</p><p>这就是 CodeFlowMu 正在探索的方向。</p><p>不是再造一个多智能体框架。</p><p>而是：</p><blockquote><p><strong>构造一套能够开发、运行、治理、恢复并持续演化数字员工的软件基础设施。</strong></p></blockquote><p>这也是我们提出 SaaW 的真正原因。</p><blockquote><p><strong>SaaW — Software as an Agent Worker</strong></p></blockquote><p>软件曾经是工具。</p><p>后来成为服务。</p><p>现在，它正在开始工作。</p><p><strong>从软件市场到数字劳动力市场。</strong></p><hr><blockquote><p><strong>作者 / 发布单位：</strong> joinwell52 Research Center / CodeFlowMu Core Team</p><p><strong>理论与架构支撑：</strong> TMPA Architecture Paper — <strong>A1.0</strong></p><p><strong>规范性标准：</strong> TMPA Core Specification — <strong>S1.0</strong></p><p><strong>工程实施案例（作者运行的工程证据）：</strong> TMPA–FCoP–CodeFlowMu Implementation Case — <strong>I1.0（CodeFlowMu v1.8.0 · S1.0 C01–C14 14/14 PASS）</strong></p><p><strong>正式出版：</strong> TMPA V1.0 Publication System，2026-08-11</p><p><strong>DOI：</strong> <a href="https://doi.org/10.5281/zenodo.21888488" target="_blank" rel="noreferrer">10.5281/zenodo.21888488</a></p><p><strong>发布记录：</strong> <a href="/joinwell52/zh/publications/tmpa-v1.0-release-record">TMPA V1.0 正式发布记录</a></p><p><strong>核心工程载体：</strong> CodeFlowMu / FCoP</p></blockquote><blockquote><p><strong>V1.1 边界说明：</strong> 本文是一篇面向 AI 原生软件、多智能体工程与企业数字员工方向的技术宣言。SaaW、Self-Morphing、数字员工运行体等概念既包含现有架构与工程实践，也包含正在持续验证的研究方向；具体能力边界以对应版本的公开规范、测试与实现证据为准。</p></blockquote>`,368)])])}const f=c(h,[["render",u]]);export{x as __pageData,f as default};
