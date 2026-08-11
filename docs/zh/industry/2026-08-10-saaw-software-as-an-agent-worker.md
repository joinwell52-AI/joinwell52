---
title: "SaaW：Software as an Agent Worker——从 SaaS 到 SaaW"
date: "2026-08-10"
column: "industry-architecture"
category: "manifesto"
version: "V1.1"
summary: "从 Governance、TMPA、FCoP、Agent PC、CodeFlowMu、Self-Morphing 与 Digital Employee Runtime 推导 SaaW：软件从工具与服务走向可治理的数字工作主体。"
item_id: "MANIFESTO-20260810-SAAW"
lifecycle: "Published"
cover: "/assets/covers/saaw-manifesto-cover-approved.webp"
visualization: "/assets/covers/saaw-governance-stack.svg"
visualization_2: "/assets/covers/saaw-self-morphing-loop.svg"
evidence_status: "Architecture-grounded"
citation_status: "Internal publication mapping completed"
editing_status: "Published V1.1 — full 23-section edition"
publication_authorized: true
outline: deep
---

# SaaW: Software as an Agent Worker
## 从 SaaS 到 SaaW：当代码库开始“自己开发自己”

**基于 TMPA 治理体系与 CodeFlowMu 实践的数字员工范式宣言 · V1.1**

[English version](/en/industry/2026-08-10-saaw-software-as-an-agent-worker)

![SaaW — Software as an Agent Worker](/assets/covers/saaw-manifesto-cover-approved.webp)

> **作者 / 发布单位：** joinwell52 Research Center / CodeFlowMu Core Team  
> **理论与架构支撑：** TMPA Architecture Paper — TMPA-ARCH-A0.9  
> **规范性标准：** TMPA Core Specification — S0.6  
> **实证案例：** TMPA Implementation Case Report — I0.8  
> **核心工程载体：** CodeFlowMu / FCoP

---

## 1. SaaS 没有解决的最后一公里

过去二十年，SaaS 改变了软件的交付方式。

企业不再购买光盘，不再维护大量本地服务器，也不再为每一次版本升级付出高昂的部署成本。浏览器成为入口，云成为基础设施，订阅成为商业模式。

但有一件事几乎没有改变：

**人，仍然在操作软件。**

员工登录 ERP 查询数据，复制到 Excel；打开 CRM 补录客户信息；在财务系统里提交报销；在 OA 中审批；再把结果搬运到另一个系统。

企业拥有的软件越来越多，员工需要操作的软件也越来越多。

SaaS 解决了“软件如何交付”，却没有真正解决“工作由谁完成”。

Copilot 的出现迈出了下一步。

AI 开始进入软件界面，帮助人类写邮件、总结文档、生成代码、查询知识、辅助决策。

但 Copilot 的基本关系仍然没有改变：

**AI 给建议，人完成工作。**

人仍然要坐在屏幕前，点击按钮、切换系统、录入结果、处理异常。

真正值得讨论的下一代软件，不应该只是更聪明的工具。

而应该是：

**能够承担工作的软件。**

我们将这一范式称为：

# SaaW — Software as an Agent Worker

Software as an Agent Worker。

软件不再只是 Service。

软件开始成为 Worker。

---

## 2. 从“购买工具”到“部署数字员工”

SaaW 的核心变化，不是简单地把 Agent 嵌入 SaaS。

它改变的是软件的基本交付单位。

SaaS 交付的是：**Function。**

Copilot 交付的是：**Assistance。**

SaaW 交付的是：**Work。**

一个真正的 SaaW，不应该只是一个拥有系统 Prompt 的聊天机器人。

它必须具备接近真实岗位的结构：

- 明确的 Role；
- 明确的 Responsibilities；
- 可执行的 Workflow；
- 可以调用的 Skills；
- 有边界的 Permissions；
- 持续存在的 Work State；
- 可验证的 Evidence；
- 可以恢复的 Runtime；
- 明确的人类授权边界。

因此，我们对 SaaW 给出如下定义：

> **SaaW（Software as an Agent Worker）是一种将软件交付为数字工作主体的软件范式。它能够在明确的岗位职责、权限边界和治理规则下持续执行工作流程、调用业务工具、产生工作成果，并接受人类监督、审查和授权。**

于是，企业软件开始经历一条清晰的演化路径：

```text
SaaS
Software provides tools
        │
        ▼
Copilot
AI assists humans
        │
        ▼
Agent
AI executes actions
        │
        ▼
SaaW
Software performs work
```

真正的变化不是：AI 更聪明了。

而是：**软件的劳动属性发生了变化。**

---

## 3. 企业真正的难题：Trace 不等于 Governance

Agent 能够执行工具，并不意味着 Agent 可以进入企业生产环境。

今天许多 Multi-Agent 系统已经能够生成复杂的 Execution Trace：谁调用了哪个工具；执行了哪个函数；产生了什么结果；模型经历了哪些步骤。

这些信息非常重要。

但：

# Trace ≠ Governance

Execution Trace 回答的是：**发生了什么？**

而企业真正需要回答的问题更多：谁授权了这项工作？谁接受了任务？哪一个对象代表正式的工作事实？谁提交了 Report？谁执行了 Review？谁作出了 Decision？当前状态是否合法？是否存在悬空引用？多个主体之间是否发生了尚未解决的冲突？系统崩溃之后，下一步究竟应该由谁继续？

这不是普通日志系统能够解决的问题。

这是一个 Governance State 问题。

如果这些问题没有答案，Agent 就很难真正承担岗位责任。

因此我们认为：

> **无治理，不员工。**

这正是 TMPA 存在的原因。

---

## 4. TMPA：让工作事实脱离 Agent 而存在

TMPA，全称：**Textual Multi-Agent Process Architecture。**

它试图解决的核心问题非常简单：

**当多个 Agent 和人类共同完成一个长期工作时，真正可信的工作状态到底存在于哪里？**

传统 Agent 系统很容易把状态放进模型上下文、Runtime Memory、数据库中的内部状态、Broker、中央调度器，或者一个不断增长的 Conversation。

但所有这些方案都面临一个共同问题：**运行实例和工作事实绑得太紧。**

TMPA 选择了另一条路线。

# Text carries messages and state.

重要工作事实被投射到 Plain, portable text。

这些文本不是“聊天记录”，而是正式的工作对象，例如：Task、Acceptance、Report、Review、Decision、Correction、Issue。

这些对象通过 Reference Identifier 形成因果关系。

于是，工作的事实不再只存在于某个 Agent 的记忆中。

Agent 可以退出。模型可以切换。进程可以重启。节点甚至可以暂时离线。

但已经成立的工作事实仍然存在。

这是 SaaW 能够持续运行的第一块地基。

---

## 5. Single-Writer：责任必须有明确来源

TMPA 的另一个核心原则是：

# Single-Writer Serial Streams

每一个 Agent 或人类责任主体都是独立的 Single Writer。

这意味着：一个主体不去偷偷修改另一个主体已经写下的事实。

新的状态通过新的对象追加产生。

```text
TASK
  │
  ▼
ACCEPTANCE
  │
  ▼
REPORT
  │
  ▼
REVIEW
  │
  ▼
DECISION
```

每一个动作都拥有自己的作者和引用关系。

于是系统中的责任链不是靠“最终数据库状态”猜出来的，而是由事实本身形成。

这与许多传统 Workflow Engine 有一个重要差别。

传统系统往往不断修改一个中央状态：

```text
status = pending
status = running
status = review
status = done
```

最后看到的是 `status = done`，但真正发生过的过程已经被覆盖。

TMPA 更关心的是：谁接受？谁提交？谁审核？谁批准？中间发生过什么争议？哪些事实后来被纠正？

状态不是被覆盖。

而是被重构。

---

## 6. 异步世界不存在完美的全局时间线

真实的 Multi-Agent 系统天然是异步的。

PM 在写计划。DEV 同时修改代码。QA 可能已经开始检查另一个模块。OPS 正在处理部署。人类主管可能晚几个小时才进行审批。

在这种环境中，如果系统强行构造一个完美的全局顺序：`1 → 2 → 3 → 4 → 5`，往往反而会掩盖真实发生的并发关系。

TMPA 因此强调：

# Asynchronous Collaboration

不同的 Single-Writer Streams 可以独立推进。

写端不负责制造虚假的全局时序。

真正的关系在 Reader 端通过 Reference、Causality、Transition、Responsibility 与 Governance Rule 进行重构。

最后得到的不是简单日志列表，而是一张 Partial-Order Graph。

```text
            ┌── DEV REPORT ──┐
TASK ───────┤                ├── REVIEW
            └── OPS REPORT ──┘
```

两个 Report 谁先写完并不是最重要的。

重要的是：它们都因果依赖于同一个 TASK，而 REVIEW 又依赖于这些工作事实。

这更接近真实组织的工作方式。

---

## 7. Issue Set：不要隐藏冲突

很多自动化系统喜欢追求一个“漂亮的最终状态”。冲突最好自动消失，错误最好自动修正，所有流程最终都显示绿色。

但真实组织不是这样的。

在企业工作中，两个角色可能意见冲突；引用可能不存在；状态可能非法跃迁；QA 可能否决 DEV；Report 可能缺少必要证据；Decision 可能没有合法前置条件。

TMPA 的目标不是让这些问题消失。

而是：**让问题成为正式事实。**

Reader 因此不仅重构 Process Graph，还需要重构 Issue Set，例如：

```text
dangling_reference
illegal_transition
unresolved_disagreement
missing_acceptance
conflicting_review
```

这是 SaaW 非常重要的一项能力。

因为企业真正需要的不是永远不会犯错的 AI——这种 AI 不存在。

企业真正需要的是：**即使 AI 犯错，系统也能够知道哪里出了问题，并把问题暴露给正确的人。**

---

## 8. Recoverability：数字员工必须能够“醒来继续工作”

SaaW 与普通 Chatbot 最大的差别之一，是时间尺度。

Chatbot 的典型生命周期可能只有几分钟，而真实工作可能持续数小时、数天、数周，甚至数月。

这意味着数字员工一定会遇到网络中断、SDK 超时、Agent 退出、Runtime 重启、模型上下文丢失、操作系统重启和软件升级。

如果每一次异常都意味着“重新告诉 AI 前面发生了什么”，那么它永远无法成为真正的员工。

因此 SaaW 必须具备：

# Recoverability

TMPA 的目标之一，就是让当前治理状态能够从持久化事实重新计算。

CodeFlowMu / FCoP 将这一思想进一步投射到文件系统。

当节点重新启动时，不需要假设原来的模型一定还记得，而是重新读取 TASK、ACCEPTANCE、REPORT、REVIEW、DECISION、ISSUE，然后重新推导：当前任务是谁负责？已经完成了什么？哪些结果已经被确认？哪些问题还没有解决？现在允许发生什么？下一步应该由谁行动？

于是恢复不再是恢复 Agent 的记忆，而是：

**重构工作的事实。**

---

## 9. CodeFlowMu：TMPA 从理论进入运行世界

如果说 TMPA 解决的是治理架构问题，那么 CodeFlowMu 解决的是另一个问题：这些 Agent 到底如何真正工作？

CodeFlowMu 的工程起点不是构造一个巨大的中央 Agent Runtime。

相反，它试图保持克制。

推理交给成熟模型生态。工具交给实际运行环境。

CodeFlowMu 集中解决工作编排、Agent Responsibility、生命周期、FCoP、Skill 调用、Report、Review、Human Decision、Recovery 与 Runtime Governance。

这形成一个非常重要的工程边界：

**CodeFlowMu 不需要重新发明 LLM。**

模型只是数字员工的大脑之一。

真正决定它能不能成为“员工”的，是外部工作结构。

---

## 10. FCoP：Filename as Protocol

CodeFlowMu 的一个核心工程选择，是 FCoP。

FCoP 将 Agent 协作的一部分治理关系直接投射到文件系统。

工作对象不是隐藏在某个中心服务器内部，它们能够以文件形式被观察。

文件名、目录、引用以及生命周期本身构成协议的一部分。

一个任务可以经历类似这样的生命周期：

```text
inbox
  │
  ▼
active
  │
  ▼
review
  │
  ▼
done
  │
  ▼
archive
```

状态迁移通过明确操作发生。

这带来一个极其朴素但重要的结果：

# Directory becomes observable state.

系统管理员、人类主管、Agent 和调试工具看到的，可以是同一组事实。

这降低了 Multi-Agent 系统最危险的一种复杂度：隐藏状态。

---

## 11. Agent PC：真正的数字员工需要一台“电脑”

如果 SaaW 是 Worker，那么 Worker 必须有工作环境。

我们把这一运行节点称为：

# Agent PC

它并不一定是一台传统意义上的物理电脑，而代表一个数字员工拥有的独立运行环境。

其中包括 Reasoning、Skills、Workflow、Credentials、Runtime、Files、Governance 与 External Systems。

它可以使用 Browser、API、CLI、Script、MCP、企业内部服务和受控 Automation Hook。

于是 Agent 不再只是：

`Prompt → Response`

而变成：

```text
Task
 ↓
Reason
 ↓
Use Skill
 ↓
Operate System
 ↓
Observe Result
 ↓
Produce Evidence
 ↓
Continue / Report / Escalate
```

这才是真正的数字员工运行循环。

---

## 12. 非侵入式数字员工：让 AI 使用软件，而不是绕过软件

企业自动化最危险的诱惑之一，是让 AI 直接修改数据库。

这看起来非常高效。

但真实企业系统并不是简单的 CRUD。

一个字段背后可能存在状态机、Trigger、Stored Procedure、权限规则、财务约束、Workflow、Audit Trail 与外部系统联动。

直接改表，相当于绕过企业几十年积累下来的业务边界。

因此 SaaW 更值得探索的路径是：

**AI 操作业务系统，而不是绕过业务系统。**

```text
Agent
  │
  ├── API
  ├── Browser
  ├── CLI
  ├── Hook
  └── Approved Automation
        │
        ▼
Existing ERP / CRM / Business System
```

这样做的意义并不是保证“永远不会出错”，而是让错误尽量发生在已有业务规则可以观察、拒绝、审计和回滚的边界内。

这才是企业级 AI 自动化真正需要的工程态度。

---

## 13. 从代码中重新发现企业 SOP

Legacy Software 还有一个经常被低估的价值：

**代码本身就是企业知识。**

大量企业流程并没有完整 SOP 文档。

真正的规则隐藏在 API、Controller、Form、Validation、State Transition、Permission Check、Batch Script、Database Schema 与 Configuration 中。

因此 CodeFlowMu 的一个重要演进方向，是让 Meta-Development Team 能够分析现有系统，帮助重新提取：

```text
Existing Code
      │
      ▼
Business Rules
      │
      ▼
Workflow
      │
      ▼
SOP
      │
      ▼
Digital Employee Skills
```

但这并不意味着“扫描代码 = 自动理解整个企业”。

真实 SOP 还可能来自文档、人工说明、API Specification、操作录像、岗位说明书、Policy 与业务专家反馈。

代码只是其中极其重要的一种事实来源。

更严谨地说，这条路径应该被理解为：

# Enterprise Evidence → Candidate SOP → Validation → Governed Workflow

AI 的价值，是第一次让这些分散知识能够被低成本地重新结构化；而 Candidate SOP 只有经过业务验证、工程测试、治理检查或人类授权，才能升级为数字员工可执行的正式 Workflow。

---

## 14. CodeFlowMu 的第二形态：Meta-Development Runtime

CodeFlowMu 当前最值得关注的地方，不只是多个 Agent 可以一起开发软件。

更重要的是：这种研发能力本身可以成为下一代数字员工的生产能力。

初始 CodeFlowMu 可以表现为一个四角色开发团队：

```text
┌───────────────────────────────┐
│      CodeFlowMu Meta Team     │
│                               │
│ PM        DEV       QA    OPS │
└───────────────────────────────┘
```

他们拥有各自的责任边界。

PM 理解需求、拆解工作、组织协作。

DEV 实现代码、Skill、Hook 和 Workflow。

QA 验证业务结果与工程结果。

OPS 负责运行环境、恢复、部署和生命周期。

这是：

# Meta-Dev Mode

它的产物，不一定只是传统软件。

还可以是 Digital Employee Package。

---

## 15. Digital Employee Package

一个数字员工真正可以部署之前，需要被工程化描述。

一个完整的 Worker Package 至少可能包含 Role、Responsibilities、Workflow、Skills、Permissions、Policies、Validation Rules、Runtime Configuration、Recovery Rules 与 Human Decision Gates。

于是数字员工第一次开始像一个真正的软件产品一样：可以定义；可以开发；可以测试；可以版本化；可以部署；可以升级；可以回滚。

这也是 SaaW 与“写一个 Agent Prompt”之间最根本的区别之一。

---

## 16. Self-Morphing：当代码库开始“自己开发自己”

现在，我们来到整篇文章最重要的部分。

# Self-Morphing

这个词很容易被误解。

它不是 Agent 随意修改自己的源代码，更不是 AI 无限制地自我复制。

Self-Morphing 真正值得讨论的含义是：

> **一个数字员工运行系统，利用自身的软件开发能力，构造、验证并部署新的数字员工形态。**

其完整过程应该是：

```text
Meta-Dev Runtime
        │
        ▼
Analyze Existing Work
        │
        ▼
Develop Worker Package
        │
        ▼
Validate
        │
        ▼
Human / Governance Decision
        │
        ▼
Deploy
        │
        ▼
Domain Worker Runtime
```

例如：

```text
PM / DEV / QA / OPS
        │
        │ develop
        ▼
Finance Worker Package
        │
        ▼
Invoice Agent
ERP Entry Agent
Compliance Agent
Archive Agent
```

或者：

```text
PM / DEV / QA / OPS
        │
        ▼
Contract Worker Package
        │
        ▼
Risk Analysis Agent
Signing Agent
Compliance Agent
Archive Agent
```

过去的软件开发模型是：

```text
Human
  ↓
builds Software
  ↓
Human uses Software
```

而 Self-Morphing 开始出现：

```text
AI Development Team
        ↓
builds Digital Worker
        ↓
Digital Worker performs Work
```

然后更加重要的一步出现：

```text
Worker performs Work
        │
        ▼
Evidence / Issues
        │
        ▼
Development Input
        │
        ▼
Next Worker Version
```

于是软件开发与软件履职第一次形成闭环：

# Develop → Validate → Deploy → Work → Observe → Improve

这就是“代码库开始自己开发自己”真正值得研究的含义。

---

## 17. 从 Development Runtime 到 Work Runtime

传统软件世界存在非常明确的边界：研发系统负责开发，生产系统负责运行，用户负责工作。

SaaW 正在让这三者重新组合。

CodeFlowMu 的长期方向可以被表达为：

```text
Development Runtime
        │
        ▼
Digital Employee Package
        │
        ▼
Work Runtime
        │
        ▼
Work Evidence
        │
        ▼
Development Runtime
```

这不是简单的 DevOps。

DevOps 连接的是 Development 与 Deployment。

SaaW 进一步连接：

**Development 与 Work。**

这可能成为 AI Native Software 与传统软件最大的分水岭之一。

---

## 18. 人类并没有消失，而是离开了操作层

数字员工的出现并不意味着 Human-Out-of-the-Loop。

恰恰相反。

真正安全的 SaaW 必须明确哪些事情 Agent 可以自主完成，以及哪些事情必须由人决定。

人在 SaaS 中通常是 Operator。

人在 SaaW 中逐渐变成 Supervisor / Authorizer。

例如，查询、整理、校验、生成报告、内部同步等低风险工作可以高度自动化。

而对于大额付款、合同最终签署、权限提升、不可逆数据操作、重要公开发布，系统应该进入 Decision Gate。

更准确地说：

# Human at the Authority Boundary.

---

## 19. PWA：数字员工团队的移动控制面

CodeFlowMu 的 PWA 因此并不是简单的手机网页。

它代表的是：

# Human Control Plane

管理者可以通过移动端查看当前 Task、Agent 状态、Report、Review、Issue、Waiting Decision、Recovery State 与工作结果。

```text
SaaW Runtime
      │
      ▼
Report
      │
      ▼
FCoP / TMPA Facts
      │
      ▼
Reader
      │
      ▼
Mobile PWA
      │
      ▼
Human Approve / Reject
      │
      ▼
Decision
      │
      ▼
SaaW Runtime continues
```

这里最重要的一点是：Approve 不是一个普通 UI 点击事件。

点击只是界面。

真正发生的是：

```text
Human Decision
        ↓
Governance Fact
        ↓
State Transition
```

授权因此进入正式工作历史。

这才是真正意义上的 Human-in-the-Loop。

---

## 20. 一个数字员工，不应该依赖一个永不掉线的模型会话

今天大量 Agent 产品隐含着一个危险假设：模型会话一直存在。

但真实世界不会这样。

模型会超时。上下文会溢出。Gateway 会失败。Agent 会崩溃。软件会升级。服务器会重启。

所以真正的 SaaW 必须遵守一个非常重要的原则：

# Agent is replaceable. Work facts are not.

Agent 可以换。模型可以换。SDK 可以换。Runtime 可以重启。

但已经成立的工作事实不能因此消失。

这也是 TMPA、FCoP 与 CodeFlowMu 真正共同指向的地方：

**把智能从“会话连续性”中解放出来，把工作的连续性建立在可持久化事实之上。**

这可能是构建长期数字员工最重要的架构原则之一。

---

## 21. SaaW 改变的不是 AI，而是软件经济学

最终，SaaW 讨论的并不只是一个新的 Agent Framework。

它可能意味着软件经济模型发生变化。

SaaS 的商业逻辑是：企业购买软件能力，然后继续配置员工。

SaaW 的商业逻辑可能变成：企业部署数字工作能力，结果第一次开始成为软件交付的一部分。

因此：

**SaaS 卖 Capability。**  
**SaaW 交付 Work。**

企业未来购买的可能不再只是 CRM，而是客户运营数字团队；不再只是财务系统，而是财务处理数字员工；不再只是合同管理平台，而是合同审查与履约数字团队。

软件市场可能从 Software Market 逐渐扩展到：

# Digital Labor Market

这才是 SaaW 真正巨大的想象空间。

---

## 22. SaaW 不是一个新的聊天框

我们最终想表达的其实只有一句话：

**数字员工不是更聪明的 Chatbot。**

它必须拥有工作职责、工作环境、工具、权限、状态、治理、证据、恢复能力，以及人类授权边界。

TMPA 研究：这些工作事实如何成立。

FCoP 研究：这些协作关系如何以极轻量方式投射。

CodeFlowMu 研究：这些 Agent 如何真正组成团队并持续工作。

Agent PC 提供：数字员工的工作环境。

PWA 提供：人类管理数字员工的控制面。

而 SaaW 则给这一整套变化一个更高层的名字：

# Software as an Agent Worker

---

## 23. 从 SaaS 到 SaaW

过去四十年，软件一直在回答一个问题：

> **我们怎样让人更高效地工作？**

AI Native Software 可能开始回答另一个问题：

> **哪些工作可以由软件本身完成？**

这并不意味着软件将取代所有人。

真正发生的变化可能更加深刻：人逐渐从重复的软件操作中退出，Agent 进入操作层，人进入治理层。

于是：

```text
SaaS
Human operates Software
        ↓
Copilot
Human operates with AI
        ↓
SaaW
AI performs Work
Human governs AI
```

而当能够开发数字员工的系统，又开始利用自身能力开发下一代数字员工：

```text
AI develops Worker
        ↓
Worker performs Work
        ↓
Work produces Evidence
        ↓
Evidence drives Development
        ↓
AI develops next Worker
```

一个过去不存在的软件生命周期开始形成。

这就是 CodeFlowMu 正在探索的方向。

不是再造一个 Multi-Agent Framework。

而是：

> **构造一套能够开发、运行、治理和持续演化数字员工的软件基础设施。**

这也是我们提出 SaaW 的真正原因。

# SaaW — Software as an Agent Worker

软件曾经是工具。

后来成为服务。

现在，它正在开始工作。

**从软件市场到数字劳动力市场。**

---

**joinwell52 Research Center**  
**CodeFlowMu Core Team**

**TMPA Architecture Paper A0.9 · TMPA Core Specification S0.6 · TMPA Implementation Case Report I0.8 · CodeFlowMu / FCoP**

> **V1.1 边界说明：** 本文是一篇面向 AI Native Software、Multi-Agent Engineering 与企业数字员工方向的技术宣言。SaaW、Self-Morphing、Digital Employee Runtime 等概念既包含现有架构与工程实践，也包含正在持续验证的研究方向；具体能力边界以对应版本的公开规范、测试与实现证据为准。