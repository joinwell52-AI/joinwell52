---
title: "从 SaaS 到 SaaW：当代码库开始“自己开发自己”"
date: "2026-08-10"
column: "industry-architecture"
category: "manifesto"
version: "V1.1"
summary: "从治理、TMPA、FCoP、Agent PC、CodeFlowMu 与 Self-Morphing 推导 SaaW，并以 Research Report Production Engine V1.3 作为真实工程锚点，区分已验证能力与研究前沿。"
item_id: "MANIFESTO-20260810-SAAW"
lifecycle: "Published"
cover: "/assets/covers/01-saaw-manifesto-cover-agent-worker.png"
visualization: "/assets/covers/02-saaw-governance-runtime-stack-fixed-v2.png"
visualization_2: "/assets/covers/03-saaw-self-morphing-loop-fixed-v2.png"
evidence_status: "Architecture-grounded + production-engine reference implementation"
citation_status: "TMPA V1.0 DOI and publication record linked"
editing_status: "Published V1.1 — full 23-section edition with TMPA V1.0 citation"
publication_authorized: true
outline: deep
---

# 从 SaaS 到 SaaW：当代码库开始“自己开发自己”
## 基于 TMPA 治理体系与 CodeFlowMu 实践的数字员工范式宣言

[English version](/en/industry/2026-08-10-saaw-software-as-an-agent-worker)

[![SaaW — Software as an Agent Worker](/assets/covers/01-saaw-manifesto-cover-agent-worker.png)](/assets/covers/01-saaw-manifesto-cover-agent-worker.png)

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

真正值得讨论的下一代软件，不应该只是更聪明的工具，而应该是：

**能够承担工作的软件。**

我们将这一范式称为：

> **SaaW — Software as an Agent Worker**

软件不再只是服务。

软件开始成为工作主体。

---

## 2. 从“购买工具”到“部署数字员工”

SaaW 的核心变化，不是简单地把 Agent 嵌入 SaaS。

它改变的是软件的基本交付单位。

SaaS 交付的是**功能**。

Copilot 交付的是**辅助**。

SaaW 交付的是**工作**。

一个真正的 SaaW，不应该只是一个拥有系统提示词的聊天机器人。

它必须具备接近真实岗位的结构：

- 明确的角色；
- 明确的岗位职责；
- 可执行的工作流；
- 可以调用的技能；
- 有边界的权限；
- 持续存在的工作状态；
- 可核验的工作证据；
- 可以恢复的运行环境；
- 明确的人类授权边界。

因此，我们对 SaaW 给出如下定义：

> **SaaW（Software as an Agent Worker）是一种将软件交付为数字工作主体的软件范式。它能够在明确的岗位职责、权限边界和治理规则下持续执行工作流程、调用业务工具、产生工作成果，并接受人类监督、审查和授权。**

于是，企业软件开始经历一条清晰的演化路径：

```text
SaaS
软件提供工具
        │
        ▼
Copilot
AI 辅助人类
        │
        ▼
Agent
AI 执行动作
        │
        ▼
SaaW
软件承担工作
```

真正的变化不是 AI 更聪明了，而是：

**软件的劳动属性发生了变化。**

---

## 3. 企业真正的难题：Trace（执行轨迹）≠ Governance（治理）

Agent 能够执行工具，并不意味着 Agent 可以进入企业生产环境。

> **“传统的 SaaS 和多智能体系统，本质上是一场精巧的幻觉：它们把业务事实死死铐在数据库的中央状态机和文件系统的拓扑结构上。一旦进程崩溃或目录微调，记忆与权限当场殉葬。** **真正的 SaaW 绝不依赖中央服务器的施舍。状态不因物理拓扑的变动而编码，事实永远独立于运行实例之外。”**

今天许多多智能体系统已经能够生成复杂的 Trace（执行轨迹）：谁调用了哪个工具，执行了哪个函数，产生了什么结果，模型经历了哪些步骤。

这些信息非常重要。

但：

> **Trace（执行轨迹）≠ Governance（治理）**

执行轨迹回答的是：**发生了什么？**

而企业真正需要回答的问题更多：谁授权了这项工作？谁接受了任务？哪一个对象代表正式的工作事实？谁提交了正式报告？谁执行了审查？谁作出了决策？当前状态是否合法？是否存在悬空引用？多个主体之间是否发生了尚未解决的冲突？系统崩溃之后，下一步究竟应该由谁继续？

这不是普通日志系统能够解决的问题。

这是一个**治理状态**问题。

如果这些问题没有答案，Agent 就很难真正承担岗位责任。

因此我们认为：

> **没有治理，就没有数字员工。**

[![Trace 不等于 Governance：执行轨迹与治理状态的区别](/assets/covers/15-saaw-trace-vs-governance-v2.svg)](/assets/covers/15-saaw-trace-vs-governance-v2.svg)

*补充图：Trace 记录已经发生的执行事件；Governance 根据持久工作事实、规则、责任与授权重建合法状态。*

这正是 TMPA 存在的原因。

---

## 4. TMPA：让工作事实脱离 Agent 而存在

TMPA 试图解决的核心问题非常简单：

**当多个 Agent 和人类共同完成一个长期工作时，真正可信的工作状态到底存在于哪里？**

这是 TMPA 给出的形式化回答：

> **TMPA（Textual Multi-Agent Process Architecture，文本化多智能体流程架构）**：一种面向中小企业、最低基础设施条件的**文本消息多智能体异步流程架构**。其核心由四条相互关联的规则构成：**文本承载持久消息与状态；每个写者保持自己的局部串行流；多条串行流异步推进并形成并行协作；读端聚合现有证据，重建流程、责任、生命周期、冲突与审计状态。**

**本节与第 5—7 节逐条展开这四条规则：本节讨论文本承载持久消息与状态；第 5 节讨论单写者的局部串行流；第 6 节讨论多条串行流的异步并行协作；第 7 节讨论读端重建与问题集（Issue Set）。**

**截至 2026 年 8 月 11 日，TMPA 已进入 V1.0 稳定发布线：** [架构论文 A1.0](/zh/publications/tmpa-architecture-paper-a1.0)、[核心规范 S1.0](/zh/publications/tmpa-core-specification-s1.0) 与 [实施案例 I1.0](/zh/publications/implementation-case-i1.0) 已形成稳定三件套；I1.0 固定 **CodeFlowMu v1.8.0**，对 **S1.0** 的产品验证结果为 **14/14**。

[![TMPA 四条规则与事实重建](/assets/covers/16-saaw-tmpa-four-rules-v2.svg)](/assets/covers/16-saaw-tmpa-four-rules-v2.svg)

*补充图：每个主体只追加自己的事实，跨流引用形成偏序关系，Reader 聚合证据但不覆盖冲突。*

> **“当多个异构智能体与人类在同一个代码库里长期博弈时，最荒谬的事莫过于把可信状态托付给模型的挥发性记忆。** **TMPA 的底层铁律是：文本即事实。文件与目录的物理拓扑只负责合规投影，不可变的文本对象才是跨越周期的唯一硬通货。”**

重要工作事实被投射为普通、可移植的文本。

这些文本不是“聊天记录”，而是正式工作对象，例如 `Task`、`Acceptance`、`Report`、`Review`、`Decision`、`Correction`、`Issue`。

这些对象通过引用标识符形成因果关系。

于是，工作的事实不再只存在于某个 Agent 的记忆中。

Agent 可以退出，模型可以切换，进程可以重启，节点甚至可以暂时离线。

但已经成立的工作事实仍然存在。

这是 SaaW 能够持续运行的第一块地基。

---

## 5. 单写者（Single-Writer）：责任必须有明确来源

TMPA 的另一个核心原则是：

> **Single-Writer Serial Streams**

每一个 Agent 或人类责任主体都是独立的单写者。

这意味着，一个主体不去偷偷修改另一个主体已经写下的事实。

新的状态通过新的对象追加产生。

```text
TASK          任务
  │
  ▼
ACCEPTANCE    接受任务
  │
  ▼
REPORT        工作报告
  │
  ▼
REVIEW        审查
  │
  ▼
DECISION      正式决策
```

> **“企业级协同的毒瘤，在于‘谁都可以改状态’的混沌。** **在 TMPA 的单写者串行流中：每一个主体——无论人还是 Agent——都是绝对隔离的单写者。你只能追加自己的事实，休想污染他人的历史。** **责任不是靠数据库的事务锁‘算’出来的，而是由单写者不可篡改的引用链‘长’出来的。”**

这与许多传统工作流引擎有一个重要差别。

传统系统往往不断修改一个中央状态：

```text
status = pending
status = running
status = review
status = done
```

最后看到的是 `status = done`，但真正发生过的过程已经被覆盖。

TMPA 更关心的是：谁接受？谁提交？谁审核？谁批准？中间发生过什么争议？哪些事实后来被纠正？

状态不是被覆盖，而是被重构。

---

## 6. 异步世界不存在完美的全局时间线

真实的多智能体系统天然是异步的。

PM 在写计划，DEV 同时修改代码，QA 可能已经开始检查另一个模块，OPS 正在处理部署，人类主管可能晚几个小时才进行审批。

在这种环境中，如果系统强行构造一个完美的全局顺序 `1 → 2 → 3 → 4 → 5`，往往反而会掩盖真实发生的并发关系。

TMPA 因此强调**异步协作（Asynchronous Collaboration）**。

> **“企图在异步的多智能体世界里强行捏造一条全局统一的时间线，是架构上的自大。** **写端只管无锁追加，偏序图在读端动态重建。没有中央调度器的瞎指挥，多智能体在本地文本流中天然错落、野蛮生长，这才是高并发数字劳动的残酷真相。”**

```text
                  ┌── DEV REPORT / 开发报告 ──┐
TASK / 任务 ──────┤                           ├── REVIEW / 审查
                  └── OPS REPORT / 运维报告 ──┘
```

两个 Report 谁先写完并不是最重要的。

重要的是，它们都因果依赖于同一个 TASK，而 REVIEW 又依赖于这些工作事实。

这更接近真实组织的工作方式。

---

## 7. 问题集（Issue Set）：不要隐藏冲突

很多自动化系统喜欢追求一个“漂亮的最终状态”：冲突最好自动消失，错误最好自动修正，所有流程最终都显示绿色。

但真实组织不是这样的。

在企业工作中，两个角色可能意见冲突；引用可能不存在；状态可能非法跃迁；QA 可能否决 DEV；Report 可能缺少必要证据；Decision 可能没有合法前置条件。

TMPA 的目标不是让这些问题消失，而是：

**让问题成为正式事实。**

这里的关键不只是“列出错误”，而是**读端重建**。写端不负责偷偷消解冲突，也不把到达顺序冒充治理顺序；Reader 聚合当前可用证据，重建流程、责任、生命周期、冲突与审计状态。**问题集（Issue Set）**就是其中对冲突、缺口和非法状态的正式表达。

> **TMPA 不承诺冲突不会发生；它要求冲突不能被隐藏。**

因此，Reader 不仅重构流程图，还需要重构问题集，例如：

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

## 8. 可恢复性（Recoverability）：数字员工必须能够“醒来继续工作”

SaaW 与普通聊天机器人最大的差别之一，是时间尺度。

聊天机器人的典型生命周期可能只有几分钟，而真实工作可能持续数小时、数天、数周，甚至数月。

这意味着数字员工一定会遇到网络中断、SDK 超时、Agent 退出、运行体重启、模型上下文丢失、操作系统重启和软件升级。

如果每一次异常都意味着“重新告诉 AI 前面发生了什么”，那么它永远无法成为真正的员工。

因此 SaaW 必须具备**可恢复性（Recoverability）**。

TMPA 的目标之一，就是让当前治理状态能够从持久化事实重新计算。

CodeFlowMu / FCoP 将这一思想进一步投射到文件系统。

当节点重新启动时，不需要假设原来的模型一定还记得，而是重新读取 `TASK`、`ACCEPTANCE`、`REPORT`、`REVIEW`、`DECISION`、`ISSUE`，然后重新推导：当前任务是谁负责？已经完成了什么？哪些结果已经被确认？哪些问题还没有解决？现在允许发生什么？下一步应该由谁行动？

于是恢复不再是恢复 Agent 的记忆，而是：

**重构工作的事实。**

---


### 一个数字研究员的一天：Research Report Production Engine V1.3

我们不再虚构一个岗位。下面就是 **Research Report Production Engine V1.3** 作为“数字研究员”的真实一天。

**09:00 · 研究发现**  
数字研究员开始当天工作，扫描新的研究信号、工程变化和待研究问题，判断哪些内容值得进入研究视野。  
**产出：信号池（Signal Pool）。**

**10:00 · 研究队列**  
它从信号池中筛选当天真正要推进的研究对象，确定优先级和研究方向。不是看到什么就写什么，而是先决定“今天研究什么”。  
**产出：今日研究计划（Today's Research Plan）。**

**11:00 · 研究阅读**  
围绕当天选定的研究对象读取论文、规范、工程记录、代码、测试结果和已有材料，整理可用证据，同时明确还缺什么。  
**产出：阅读结果（Reading Result）。**

**13:00 · 研究分析**  
把上午获得的材料转化为判断：哪些事实成立，哪些只是推断，哪里存在争议，边界条件是什么，接下来应该形成什么研究结论。  
**产出：研究对象（Research Object）。**

**15:00 · 研究生产**  
数字研究员开始把研究对象加工成正式工作成果：组织文章结构、写报告、核对证据、补充必要的图表和可视化，形成可以进入发布审查的候选版本。  
**产出：发布候选稿（Publication Candidate）。**

**20:00 · 正式发布**  
候选稿满足发布条件后进入正式发布：写入 GitHub、生成网站页面、完成提交验证与发布确认；如果存在必须由人承担责任的事项，就停在授权边界等待人工决定。  
**产出：正式发布的研究成果。**

```text
09:00 研究发现      → 信号池
10:00 研究队列      → 今日研究计划
11:00 研究阅读      → 阅读结果
13:00 研究分析      → 研究对象
15:00 研究生产      → 发布候选稿
20:00 正式发布      → GitHub 入库 + 网站发布 + 提交验证 + Release
```

这就是一个数字研究员的一天：**它不是回答一次问题，而是在固定职责和工作节奏下，持续完成研究工作。**


---

## 9. FCoP：文件驱动协作协议

**FCoP（File-based Coordination Protocol，文件驱动协作协议）是一种以文件系统为唯一同步原语的多智能体行为治理协议。**

它的核心不变式是 **Filename as Protocol**。在项目可见的文件系统 Profile 中：

- **目录即状态**：`_lifecycle/{inbox,active,review,done,archive}/`；
- **文件名即路由**：发送者、接收者、类型与序号共同表达工作对象的来源、去向与身份；
- **内容即负载**：Markdown 正文与 YAML frontmatter 承载任务、报告、问题、引用和治理事实；
- **`os.rename()` 是唯一同步操作**：生命周期迁移依靠文件系统原子移动，而不是协调数据库、消息 Broker 或中心锁服务。

一个任务的生命周期因此可以直接被观察：

```text
inbox      收件箱 / 待领取
  │
  ▼
active     执行中
  │
  ▼
review     待审查
  │
  ▼
done       已完成
  │
  ▼
archive    已归档
```

[![FCoP 文件驱动生命周期与事实平面](/assets/covers/17-saaw-fcop-lifecycle-v2.svg)](/assets/covers/17-saaw-fcop-lifecycle-v2.svg)

*补充图：生命周期变化通过项目可见工作对象表达；人、Agent、Reader 与运维工具观察同一事实平面。*

FCoP 治理的是 **Agent 的协作行为**：任务如何交接、结果如何报告、问题如何提出、能力边界如何声明，以及这些行为如何留下事件语义、失败边界与可审计证据。

**FCoP 不治理执行运行时。** 调度、进程管理、模型会话、资源分配、身份认证和运行节点管理不属于协议本身的职责。

从 TMPA 的实现关系看，FCoP 是一种**项目可见的文件系统 Profile**。它不强制要求协调数据库、消息 Broker 或企业级控制平面，但也不会单独提供经过验证的企业身份、强角色隔离、防篡改存储或拜占庭容错。这与 TMPA 的 **SME-first，而非 SME-only** 边界一致：更大规模的部署可以增加数据库、对象存储、事件服务、身份系统和控制平面，而不改变协议所承载的治理语义。

更重要的是，**FCoP 协议、工具包、适配职责、参考实现和运行环境不是同一个东西。** 随着 TMPA V1.0 正式发布，这套运行关系已经冻结到 **A1.0 / S1.0 / I1.0** 稳定发布线。运行栈可以直接写成：

```text
应用层 / Application Runtime
CodeFlowMu / Cursor / Claude Desktop
                │
                ▼
主机适配层 / Host Adapter Layer
fcop-mcp / host bridges
                │
                ▼
★ FCoP 协议层 / FCoP Protocol Layer ★
行为治理 / 交接 / 报告 / 审查 / 能力边界
事件语义 / 失败边界 / 可审计性
                │
                ▼
参考实现 / Reference Implementation
fcop（Python library）
                │
                ▼
执行基座 / Execution Substrate
LLM APIs / MCP tools / 文件系统 / 进程管理 / 操作系统
```

因此：

- `fcop` 是发布在 PyPI 上的 Python Package，也是 **FCoP 的参考实现**；CLI 能力由 `fcop` 提供；
- `fcop-mcp` 是发布在 PyPI 上的 FCoP MCP 工具包；在运行栈中承担**主机适配职责**，把 FCoP 能力暴露给实际宿主；
- **CodeFlowMu 是使用 FCoP 作为协作协议的应用 / 运行系统。**
- TMPA 不属于这个运行栈中的某一层，它提供的是这套栈试图实现的上位治理语义与架构指导。

这也解释了为什么“目录即状态”如此重要：系统管理员、人类主管、Agent 和调试工具可以观察同一组项目事实，而不必先进入一个隐藏的中央协调状态。

---

## 10. CodeFlowMu：从协议进入真实运行世界

如果说 TMPA 定义的是工作事实与治理语义，FCoP 提供项目可见的文件驱动协作协议，那么 **CodeFlowMu 解决的是这些语义和协议如何进入真实 Agent 运行世界。**

CodeFlowMu 的工程起点不是构造一个巨大的中央 Agent 运行体。

相反，它试图保持克制：推理交给成熟模型生态，工具交给实际运行环境，而自身集中解决工作编排、Agent 责任边界、生命周期、FCoP 接入、Skill 调用、报告、审查、人类决策、恢复与运行治理。

这形成一个非常重要的工程边界：

**CodeFlowMu 不需要重新发明 LLM，也不重新定义 FCoP。**

模型只是数字员工“大脑”的一部分；FCoP 是其采用的协作协议；真正决定数字员工能不能持续承担工作的是外部工作结构、运行环境和治理闭环。

[![SaaW 治理与运行架构：SaaW、CodeFlowMu、FCoP 与 TMPA](/assets/covers/02-saaw-governance-runtime-stack-fixed-v2.png)](/assets/covers/02-saaw-governance-runtime-stack-fixed-v2.png)

*图 1：SaaW 治理与运行架构。TMPA 提供工作事实与治理架构，FCoP 提供文件驱动协作协议，CodeFlowMu 承担工程运行，SaaW 描述最终的软件交付范式。*

[![CodeFlowMu 工程运行边界](/assets/covers/18-saaw-codeflowmu-runtime-boundary-v2.svg)](/assets/covers/18-saaw-codeflowmu-runtime-boundary-v2.svg)

*补充图：模型负责推理，工具负责行动；CodeFlowMu 组织工作，FCoP 承载事实，TMPA 指导治理语义。*

---

## 11. Agent PC：真正的数字员工需要一台“电脑”

如果 SaaW 是工作主体，那么它就必须拥有工作环境。

我们把这一运行节点称为：

> **Agent PC**

它并不一定是一台传统意义上的物理电脑，而代表一个数字员工拥有的独立运行环境。

其中包括推理能力、Skill、工作流、凭据、运行环境、文件、治理规则与外部系统。

它可以使用浏览器、API、CLI、脚本、MCP、企业内部服务和受控自动化接口。

于是 Agent 不再只是：

`提示 → 响应`

而变成：

```text
任务
 ↓
推理
 ↓
调用 Skill
 ↓
操作业务系统
 ↓
观察结果
 ↓
生成证据
 ↓
继续 / 报告 / 升级处理
```

这才是真正的数字员工运行循环。

---

## 12. 非侵入式数字员工：让 AI 使用软件，而不是绕过软件

企业自动化最危险的诱惑之一，是让 AI 直接修改数据库。

这看起来非常高效。

但真实企业系统并不是简单的增删改查（CRUD）。

一个字段背后可能存在状态机、触发器、存储过程、权限规则、财务约束、工作流、审计轨迹与外部系统联动。

直接改表，相当于绕过企业几十年积累下来的业务边界。

因此 SaaW 更值得探索的路径是：

**AI 操作业务系统，而不是绕过业务系统。**

```text
Agent / 智能体
  │
  ├── API / 接口
  ├── Browser / 浏览器
  ├── CLI / 命令行
  ├── Hook / 受控钩子
  └── Approved Automation / 受控自动化
        │
        ▼
Existing ERP / CRM / Business System
既有 ERP / CRM / 业务系统
```

这样做的意义并不是保证“永远不会出错”，而是让错误尽量发生在已有业务规则可以观察、拒绝、审计和回滚的边界内。

这才是企业级 AI 自动化真正需要的工程态度。

---

## 13. 从代码中重新发现企业 SOP

遗留软件还有一个经常被低估的价值：

**代码本身就是企业知识。**

大量企业流程并没有完整 SOP 文档。

真正的规则隐藏在 API、控制器、表单、校验规则、状态迁移、权限检查、批处理脚本、数据库结构与配置中。

因此 CodeFlowMu 的一个重要演进方向，是让元开发团队能够分析现有系统，帮助重新提取：

```text
现有代码
      │
      ▼
业务规则
      │
      ▼
工作流
      │
      ▼
SOP
      │
      ▼
数字员工 Skill
```

但这并不意味着“扫描代码 = 自动理解整个企业”。

真实 SOP 还可能来自文档、人工说明、API 规范、操作录像、岗位说明书、政策规则与业务专家反馈。

代码只是其中极其重要的一种事实来源。

更严谨地说，这条路径应该被理解为：

> **企业证据 → 候选 SOP → 验证 → 受治理工作流**

AI 的价值，是让这些分散知识能够被低成本地重新结构化；而候选 SOP 只有经过业务验证、工程测试、治理检查或人类授权，才能升级为数字员工可执行的正式工作流。

---

## 14. CodeFlowMu 的第二形态：元开发运行体（Meta-Development Runtime）

CodeFlowMu 当前最值得关注的地方，不只是多个 Agent 可以一起开发软件。

更重要的是，这种研发能力本身可以成为下一代数字员工的生产能力。

我们把这一形态称为**元开发运行体（Meta-Development Runtime）**。

初始 CodeFlowMu 可以表现为一个四角色开发团队：

```text
┌─────────────────────────────────────────────────────┐
│        CodeFlowMu Meta Team / 元开发团队            │
│                                                     │
│ PM / 项目经理   DEV / 开发   QA / 质量验证   OPS / 运维 │
└─────────────────────────────────────────────────────┘
```

他们拥有各自的责任边界。

PM 理解需求、拆解工作、组织协作。

DEV 实现代码、Skill、Hook 和工作流。

QA 验证业务结果与工程结果。

OPS 负责运行环境、恢复、部署和生命周期。

这是 CodeFlowMu 的**元开发模式**。

它的产物，不一定只是传统软件，还可以是：

**数字员工包（Digital Employee Package）。**

---

## 15. 数字员工包（Digital Employee Package）：让数字员工成为可工程化产品

一个数字员工真正可以部署之前，需要被工程化描述。

一个完整的数字员工包通常至少包括：

- 角色；
- 岗位职责；
- 工作流；
- Skill；
- 权限；
- 治理策略；
- 验证规则；
- 运行配置；
- 恢复规则；
- 人类决策门。

于是数字员工第一次开始像一个真正的软件产品一样：可以定义、可以开发、可以测试、可以版本化、可以部署、可以升级、可以回滚。

这也是 SaaW 与“写一个 Agent 提示词”之间最根本的区别之一。

---


### 现实工程锚点：这篇 SaaW 宣言本身就是案例

这里存在一个很重要的递归关系。

我们不是先写一篇文章宣称 SaaW 存在，再寻找一个虚构案例证明它。**我们用已经运行的 Research Report Production Engine V1.3 来解释 SaaW，而这篇 SaaW 宣言本身，又成为这台研究生产机所管理、审查和发布的研究成果。**

研究生产链可以写成：

```text
Research Question      研究问题
        ↓
Research Object        研究对象
        ↓
Evidence / Reading     证据 / 阅读
        ↓
Analysis               分析
        ↓
Report                 报告
        ↓
Evidence Gate          证据门
        ↓
Visualization          可视化
        ↓
Human Authorization    人类授权
        ↓
Publication            发布
```

而把同一条链换成 SaaW 的语言，就是：

```text
角色 → 工作流 → Skill → 工作状态 → 工作证据
    → 治理 → 人类授权 → 工作结果
```

两条链描述的不是两套系统，而是同一个事实：软件开始在明确职责、证据规则和授权边界下承担持续工作。

> **这不是 AI 写作工具，而是一个受治理的研究型数字员工。**  
> **This is not an AI writing tool. It is a governed research worker.**


---

## 16. Self-Morphing：当代码库开始“自己开发自己”

现在，我们来到整篇文章最重要的部分。

> **Self-Morphing**

这个词很容易被误解。

它不是 Agent 随意修改自己的源代码，更不是 AI 无限制地自我复制。

Self-Morphing 真正值得讨论的含义是：

> **一个数字员工运行系统，利用自身的软件开发能力，构造、验证并部署新的数字员工形态。**

[![Self-Morphing：从元开发运行体到数字员工履职闭环](/assets/covers/03-saaw-self-morphing-loop-fixed-v2.png)](/assets/covers/03-saaw-self-morphing-loop-fixed-v2.png)

*图 2：Self-Morphing 的受治理闭环。开发、验证、授权、部署、履职与工作证据进入同一个可恢复、可追踪的生命周期。*

[![受治理的元开发与 Self-Morphing 闭环](/assets/covers/19-saaw-governed-self-morphing-v2.svg)](/assets/covers/19-saaw-governed-self-morphing-v2.svg)

*补充图：生产证据可以进入元开发，但元开发不能在线改写生产运行体；验证与授权决定能否部署，并始终保留回滚路径。*

其完整过程应该是：

```text
Meta-Dev Runtime              元开发运行体
        │
        ▼
Analyze Existing Work         分析现有工作
        │
        ▼
Develop Worker Package        开发数字员工包
        │
        ▼
Validate                      验证
        │
        ▼
Human / Governance Decision   人类 / 治理决策
        │
        ▼
Deploy                        部署
        │
        ▼
Domain Worker Runtime         领域数字员工运行体
```

例如：

```text
PM / DEV / QA / OPS           元开发团队
        │
        │ 开发
        ▼
Finance Worker Package        财务数字员工包
        │
        ▼
Invoice Agent                 发票处理智能体
ERP Entry Agent               ERP 录入智能体
Compliance Agent              合规智能体
Archive Agent                 归档智能体
```

或者：

```text
PM / DEV / QA / OPS           元开发团队
        │
        ▼
Contract Worker Package       合同数字员工包
        │
        ▼
Risk Analysis Agent           风险分析智能体
Signing Agent                 签署智能体
Compliance Agent              合规智能体
Archive Agent                 归档智能体
```

过去的软件开发模型是：

```text
人类
  ↓
开发软件
  ↓
人类使用软件
```

而 Self-Morphing 开始出现：

```text
AI 开发团队
        ↓
开发数字员工
        ↓
数字员工承担工作
```

然后更加重要的一步出现：

```text
数字员工履职
        │
        ▼
工作证据 / 问题
        │
        ▼
开发输入
        │
        ▼
下一版本数字员工
```

于是软件开发与软件履职第一次形成闭环：

> **开发 → 验证 → 部署 → 工作 → 观察 → 改进**

这就是“代码库开始自己开发自己”真正值得研究的含义。

---

## 17. 从开发运行体到工作运行体

传统软件世界存在非常明确的边界：研发系统负责开发，生产系统负责运行，用户负责工作。

SaaW 正在让这三者重新组合。

CodeFlowMu 的长期方向可以被表达为：

```text
Development Runtime          开发运行体
        │
        ▼
Digital Employee Package     数字员工包
        │
        ▼
Work Runtime                 工作运行体
        │
        ▼
Work Evidence                工作证据
        │
        ▼
Development Runtime          回到开发运行体
```

这不是简单的 DevOps。

DevOps 连接的是开发与部署。

SaaW 进一步连接的是：

**开发与工作。**

这可能成为 AI 原生软件与传统软件最大的分水岭之一。

---

## 18. 人类并没有消失，而是离开了操作层

数字员工的出现并不意味着把人类排除在工作闭环之外。

恰恰相反。

真正安全的 SaaW 必须明确：哪些事情 Agent 可以在授权范围内自主完成，哪些事情必须由人作出决定。

**在 SaaS 模式中，人通常处于软件操作层；在 SaaW 模式中，人逐渐转向监督与最终授权层。**

查询、整理、校验、生成报告、内部同步等低风险工作可以高度自动化。

而对于大额付款、合同最终签署、权限提升、不可逆数据操作和重要公开发布，系统应该进入明确的人类决策门。

更准确地说：

> **人处在授权边界（Human at the Authority Boundary）。**

---

## 19. PWA：数字员工团队的移动控制面

CodeFlowMu 的 PWA 因此并不是简单的手机网页。

它代表的是数字员工团队的**人类控制面（Human Control Plane）**。

管理者可以通过移动端查看当前任务、Agent 状态、报告、审查、问题、待决事项、恢复状态与工作结果。

```text
SaaW Runtime        SaaW 运行体
      │
      ▼
工作报告
      │
      ▼
FCoP / TMPA 工作事实
      │
      ▼
Reader              状态读取器
      │
      ▼
Mobile PWA          移动控制面
      │
      ▼
人类批准 / 驳回
      │
      ▼
正式决策
      │
      ▼
SaaW Runtime        SaaW 运行体继续工作
```

这里最重要的一点是：批准并不是一个普通的界面点击事件。

点击只是界面。

真正发生的是：

```text
人类决策
        ↓
治理事实
        ↓
状态迁移
```

授权因此进入正式工作历史。

这才是真正意义上的**人类在环治理（Human-in-the-Loop Governance）**。

---

## 20. 一个数字员工，不应该依赖一个永不掉线的模型会话

今天大量 Agent 产品隐含着一个危险假设：模型会话一直存在。

但真实世界不会这样。

模型会超时，上下文会溢出，Gateway 会失败，Agent 会崩溃，软件会升级，服务器会重启。

所以真正的 SaaW 必须遵守一个非常重要的原则：

> **Agent 可以替换，工作事实不能丢失。**

Agent 可以换，模型可以换，SDK 可以换，运行体可以重启。

但已经成立的工作事实不能因此消失。

这也是 TMPA、FCoP 与 CodeFlowMu 真正共同指向的地方：

**把智能从“会话连续性”中解放出来，把工作的连续性建立在可持久化事实之上。**

这可能是构建长期数字员工最重要的架构原则之一。

---

## 21. SaaW 改变的不是 AI，而是软件经济学

最终，SaaW 讨论的并不只是一个新的 Agent 框架。

它可能意味着软件经济模型发生变化。

SaaS 的商业逻辑是：企业购买软件能力，然后继续配备员工完成工作。

SaaW 的商业逻辑可能变成：企业部署数字工作能力，工作结果第一次开始成为软件交付的一部分。

因此：

**SaaS 卖能力。**  
**SaaW 交付工作。**

企业未来购买的可能不再只是 CRM，而是客户运营数字团队；不再只是财务系统，而是财务处理数字员工；不再只是合同管理平台，而是合同审查与履约数字团队。

软件市场可能从**软件市场**逐渐扩展到：

> **数字劳动力市场**

这才是 SaaW 真正巨大的想象空间。

---

## 22. SaaW 不是一个新的聊天框

我们最终想表达的其实只有一句话：

**数字员工不是更聪明的聊天机器人。**

它必须拥有工作职责、工作环境、工具、权限、状态、治理、证据、恢复能力，以及人类授权边界。

TMPA 研究：这些工作事实如何成立。

FCoP 研究：这些协作关系如何以极轻量方式投射。

CodeFlowMu 研究：这些 Agent 如何真正组成团队并持续工作。

Agent PC 提供：数字员工的工作环境。

PWA 提供：人类管理数字员工的控制面。

而 SaaW 则给这一整套变化一个更高层的名字：

> **Software as an Agent Worker**

---

## 23. 从 SaaS 到 SaaW

过去四十年，软件一直在回答一个问题：

> **我们怎样让人更高效地工作？**

AI 原生软件开始面对另一个问题：

> **哪些工作可以由软件本身完成？**

这并不意味着软件将取代所有人。

真正发生的变化可能更加深刻：人逐渐从重复的软件操作中退出，Agent 进入操作层，人进入治理层。

于是：

```text
SaaS
人操作软件
        ↓
Copilot
人与 AI 协同操作
        ↓
SaaW
AI 承担工作
人负责治理与授权
```

而当能够开发数字员工的系统，又开始利用自身能力开发下一代数字员工：

```text
AI 开发数字员工
        ↓
数字员工承担工作
        ↓
工作产生证据
        ↓
证据驱动下一轮开发
        ↓
AI 开发下一代数字员工
```

一个过去不存在的软件生命周期开始形成。



### 已验证（Today）

为了不把研究方向包装成已经完成的产品能力，需要把今天已经存在的工程事实单独列出来：

- FCoP 的文件驱动生命周期、任务移交、报告与问题机制；
- PM / DEV / QA / OPS 四角色 Agent 的实际协作闭环；
- `Report`、`Review`、`Decision` 以及人类审批链路；
- PWA 人类控制面与待决事项处理；
- 运行中断后的恢复治理；
- TMPA Reader、规范测试与工作事实重构；
- CodeFlowMu 的真实工程协作案例；
- Research Report Production Engine V1.3 从研究任务到受治理发布的生产链路。

### 正在探索（Next）

仍处在研究、标准化或更大规模工程验证阶段的包括：

- 数字员工包（Digital Employee Package）的标准化；
- Agent PC 的标准化；
- 面向具体岗位的工作运行体；
- 从遗留系统与企业证据中提取候选 SOP；
- 从元开发运行体到领域数字员工运行体的转换；
- 受治理的 Self-Morphing 闭环。

这个区分不是保守，而是可信度的一部分：**已经验证的能力用证据说话，正在探索的能力保留为研究命题。** Self-Morphing 的意义，也正因为它建立在已经存在的治理、恢复、工作事实与工程运行能力之上。


这就是 CodeFlowMu 正在探索的方向。

不是再造一个多智能体框架。

而是：

> **构造一套能够开发、运行、治理、恢复并持续演化数字员工的软件基础设施。**

这也是我们提出 SaaW 的真正原因。

> **SaaW — Software as an Agent Worker**

软件曾经是工具。

后来成为服务。

现在，它正在开始工作。

**从软件市场到数字劳动力市场。**

---

> **作者 / 发布单位：** joinwell52 Research Center / CodeFlowMu Core Team
>
> **理论与架构支撑：** TMPA Architecture Paper — **A1.0**
>
> **规范性标准：** TMPA Core Specification — **S1.0**
>
> **工程实施案例（作者运行的工程证据）：** TMPA–FCoP–CodeFlowMu Implementation Case — **I1.0（CodeFlowMu v1.8.0 · S1.0 C01–C14 14/14 PASS）**
>
> **正式出版：** TMPA V1.0 Publication System，2026-08-11
>
> **DOI：** [10.5281/zenodo.21888488](https://doi.org/10.5281/zenodo.21888488)
>
> **发布记录：** [TMPA V1.0 正式发布记录](/zh/publications/tmpa-v1.0-release-record)
>
> **核心工程载体：** CodeFlowMu / FCoP

> **V1.1 边界说明：** 本文是一篇面向 AI 原生软件、多智能体工程与企业数字员工方向的技术宣言。SaaW、Self-Morphing、数字员工运行体等概念既包含现有架构与工程实践，也包含正在持续验证的研究方向；具体能力边界以对应版本的公开规范、测试与实现证据为准。
