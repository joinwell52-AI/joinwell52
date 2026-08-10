---
title: "SaaW：Software as an Agent Worker——从 SaaS 到数字员工"
date: "2026-08-10"
column: "industry-architecture"
category: "manifesto"
summary: "SaaW 将软件的交付单位从功能与助手推进到可承担岗位职责的数字工作主体；TMPA、FCoP 与 CodeFlowMu 分别提供治理架构、轻量协作协议与数字员工开发/运行载体。"
item_id: "MANIFESTO-20260810-SAAW"
lifecycle: "Published"
cover: "/assets/covers/saaw-manifesto-cover.svg"
visualization: "/assets/covers/saaw-governance-stack.svg"
visualization_2: "/assets/covers/saaw-self-morphing-loop.svg"
visualization_decision: "Required — one manifesto cover and two explanatory architecture figures"
evidence_status: "Architecture-grounded"
citation_status: "Internal publication mapping completed"
editing_status: "Published"
publication_authorized: true
outline: deep
---

# SaaW: Software as an Agent Worker
## 从 SaaS 到 SaaW：当代码库开始“自己开发自己”

**基于 TMPA 治理体系与 CodeFlowMu 实践的数字员工范式宣言**

[English version](/en/industry/2026-08-10-saaw-software-as-an-agent-worker)

![SaaW — Software as an Agent Worker](/assets/covers/saaw-manifesto-cover.svg)

> **作者 / 发布单位：** joinwell52 Research Center / CodeFlowMu Core Team  
> **理论与架构：** [TMPA Architecture Paper A0.9](/zh/publications/tmpa-architecture-paper-a0.9)  
> **规范性标准：** [TMPA Core Specification S0.6](/zh/publications/tmpa-core-specification-s0.6)  
> **工程实证：** [TMPA Implementation Case Report I0.8](/zh/publications/implementation-case-i0.8)  
> **核心工程载体：** CodeFlowMu / FCoP

## 1. SaaS 改变了软件交付，却没有改变“谁在工作”

过去二十年，SaaS 改变了企业获得软件的方式。部署迁移到云端，升级变成持续服务，浏览器成为统一入口，企业得以用更低的基础设施成本获得越来越多的软件能力。

但企业劳动的底层关系并没有随之改变：**软件提供工具，人负责完成工作。**

员工仍然需要登录 ERP、CRM、财务系统、OA 和行业软件，查询、复制、判断、录入、提交、审批和归档。系统越来越多，跨系统搬运也越来越多。SaaS 解决了“软件怎样交付”，却没有真正解决“工作由谁完成”。

Copilot 向前推进了一步。AI 可以总结、生成、解释和建议，但多数 Copilot 仍然围绕人类操作员设计：AI 给出答案，人把答案转成业务动作。

我们认为，AI Native Software 的下一步不是再增加一个更聪明的输入框，而是让软件本身开始承担被授权的工作。

我们把这一范式称为：

# SaaW — Software as an Agent Worker

SaaS 的基本交付单位是 **Capability**；Copilot 交付 **Assistance**；SaaW 则开始交付 **Work**。

一个真正的 SaaW 不是一个换了名字的 Chatbot，也不是一个拥有长 Prompt 的通用 Agent。它必须拥有岗位意义上的结构：Role、Responsibilities、Workflow、Skills、Permissions、Work State、Evidence、Recovery，以及 Human Decision Gates。

因此，我们给 SaaW 一个严格定义：

> **SaaW（Software as an Agent Worker）是一种将软件交付为数字工作主体的软件范式。它能够在明确的岗位职责、权限边界和治理规则下持续执行工作流程、调用业务工具、产生可核验的工作成果，并接受人类监督、审查与授权。**

软件曾经是工具，后来成为服务。现在，软件开始成为 Worker。

## 2. 企业级 Agent 的真正分水岭：Trace 不等于 Governance

今天的 Agent Framework 已经可以留下非常丰富的 Execution Trace：哪个 Agent 调用了什么工具、模型返回了什么、任务经过了哪些步骤。

这些信息重要，但它们并不等于企业真正需要的 Governance State。

Trace 回答“发生了什么”；Governance 必须进一步回答：谁授权？谁接受？谁负责？哪个对象代表正式事实？谁提交了 Report？谁执行了 Review？谁作出了 Decision？当前状态是否合法？冲突是否解决？系统中断之后由谁继续？

这就是我们的第一个判断：

> **无治理，不员工。**

如果一个 Agent 只能运行，却不能解释责任、授权、合法状态和恢复条件，它仍然更像一个自动化程序，而不是一个能够进入组织结构的数字员工。

## 3. TMPA：让工作事实脱离 Agent 会话而存在

TMPA（Textual Multi-Agent Process Architecture）研究的核心问题是：在多个 Agent 与人类共同工作的长期流程中，可信工作状态应该存在于哪里？

TMPA 的回答不是把一切继续塞进模型上下文，而是让重要事实成为可持久化、可引用、可重建的文本对象。

Task、Acceptance、Report、Review、Decision、Correction、Issue，不只是聊天内容，而是工作事实。

### Text carries messages and state

Plain, portable text 承载消息与状态。Agent 可以退出、模型可以切换、Runtime 可以重启，但已经成立的工作事实不应该随某个会话消失。

### Single-Writer Serial Streams

每个责任主体维护自己的串行写入流。新的工作状态通过新对象形成，而不是由多个角色不断覆写同一个不可解释的中央状态。

这让“谁写下了什么事实”成为协议本身的一部分。

### Asynchronous Collaboration

真实组织天然异步。PM、DEV、QA、OPS 可以并行推进，写端无需伪造一条绝对全局时间线。

### Deterministic Reconstruction

Reader 在读端依据 Reference、Causality、Transition 与 Governance Rule 重构 Partial-Order Graph，同时形成 Issue Set，用来暴露悬空引用、非法跃迁、未解决冲突等问题。

关键不是制造一张漂亮的全绿流程图，而是让系统能够确定地回答：**现在到底发生了什么，什么仍未解决。**

## 4. 从 TMPA 到 FCoP，再到 CodeFlowMu

SaaW 不是某一层技术的别名。它需要理论、协议和运行体各自承担不同责任。

![SaaW Governance & Runtime Stack](/assets/covers/saaw-governance-stack.svg)

**TMPA** 研究工作事实、责任、授权、状态重建与治理边界。

**FCoP** 将其中一部分协作关系投射为极轻量、可观察的文件协议，让生命周期、报告、问题、责任交接和状态迁移能够直接出现在文件系统中。

**CodeFlowMu** 则承担工程运行：Agent 编排、Skill 调用、生命周期、Review、Human Decision、Recovery、Agent PC 与 PWA 控制面。

而 **SaaW** 位于更高一层：它描述企业最终部署和获得的是什么——不是一个聊天能力，而是一个能够承担工作的数字主体。

这四者不是同义词，也不应该互相吞并。

## 5. FCoP：把隐藏协作状态变成可观察状态

CodeFlowMu 的一个关键工程选择是 FCoP。

FCoP 不要求所有 Agent 围绕一个复杂中央消息系统“聊天”。工作对象通过文件、目录、引用和原子生命周期迁移表达协作关系。

一个任务可以经历 inbox → active → review → done → archive。Report 与 Issue 作为可追踪工作对象留下，责任可以通过明确的交接和引用推导。

这带来一个非常朴素、但对多 Agent 工程很重要的结果：

> **Directory becomes observable state.**

人类主管、Agent、诊断器和运维工具面对的可以是同一组可观察事实，而不是四套彼此不同的隐藏内存。

这也是 Recoverability 的基础之一。

## 6. Recoverability：数字员工必须能够“醒来继续工作”

Chatbot 的生命周期可以只有几分钟，真实岗位却可能持续数小时、数天甚至数月。

因此数字员工一定会遇到网络中断、SDK 超时、Agent 退出、上下文丢失、系统重启和软件升级。

如果每一次异常后都需要重新告诉 AI“之前发生了什么”，它就无法成为稳定的 Worker。

SaaW 必须具备 Recoverability。

CodeFlowMu / FCoP 的路线不是赌模型记忆永远连续，而是重新读取持久化工作事实，再推导当前状态：谁在负责、什么已经完成、哪些结果已经批准、什么 Issue 仍然存在、下一步允许谁做什么。

因此恢复的对象不是“某个 Agent 的脑内记忆”，而是：

> **工作的事实。**

一个值得长期运行的数字员工系统应该遵守：

# Agent is replaceable. Work facts are not.

## 7. Agent PC：真正的数字员工需要自己的工作环境

如果 SaaW 是 Worker，那么它就不能只存在于一个对话窗口。

CodeFlowMu 将这种工作节点进一步抽象为 **Agent PC**：一个给数字员工使用的运行环境。

它可以包含推理通道、Skill、Browser、API、CLI、Script、Credential、Workflow、文件系统和治理规则。模型提供推理能力，但工作并不在模型内部完成，而是在受控环境中通过真实工具完成。

数字员工的循环因此从 Prompt → Response 变成：

**Task → Reason → Use Skill → Operate System → Observe Result → Produce Evidence → Continue / Report / Escalate。**

这才接近一个真正的工作主体。

## 8. AI 应该操作企业软件，而不是绕过企业软件

企业 AI 自动化最危险的诱惑之一，是让 Agent 直接读写业务数据库。

真实 ERP/CRM 并不是几张 CRUD 表。字段背后可能存在状态机、Trigger、Stored Procedure、审批链、权限规则、外部联动与 Audit Trail。直接改表可能绕过企业多年积累下来的业务安全边界。

SaaW 更适合探索非侵入式路径：让 Agent 使用已经被授权的 API、Browser、CLI、Hook 或 Automation Skill，尽量通过现有业务系统完成工作。

这并不意味着 Agent 永远不会犯错，而是让错误尽可能发生在已有系统能够观察、拒绝、审计和回滚的边界内。

企业需要的不是“绝不犯错的 AI”，而是**错误可见、责任可追、状态可恢复、风险可阻断的 AI Worker**。

## 9. 从代码中重新发现企业 SOP

Legacy Software 还有一个经常被忽视的价值：代码本身就是企业知识的一部分。

真实业务规则可能散落在 API、Controller、Form Validation、State Transition、Permission Check、Batch Script、Configuration 和 Database Schema 中。

LLM 与 Agent 第一次让这些分散知识有机会被低成本地重新提取和结构化。因此，CodeFlowMu 的一个重要演进方向，是由 Meta-Development Team 分析现有代码、接口、文档、岗位说明与人工反馈，逐步生成 Workflow、Skill 与验证规则。

但“扫描代码”不是魔法，也不是 SaaW 成立的必要条件。

SOP 可以来自代码，也可以来自文档、API Specification、岗位说明书、业务专家、人工示范和政策规则。代码只是重要输入之一。

## 10. Meta-Dev Runtime：数字员工生产数字员工

CodeFlowMu 当前最值得继续推进的能力，不只是“多个 Agent 一起开发软件”，而是让研发团队本身成为数字员工的生产 Runtime。

其初始形态可以是 PM、DEV、QA、OPS 四角色团队。

PM 负责理解目标、拆解职责和组织工作；DEV 实现 Skill、Hook 与 Workflow；QA 验证业务与工程结果；OPS 负责环境、运行、恢复与生命周期。

这个团队可以被视为 **Meta-Dev Runtime**。

它的产物不再局限于传统应用，而可以是一个 **Digital Employee Package**，其中包含 Role、Responsibilities、Workflow、Skills、Permissions、Policies、Validation Rules、Runtime Configuration、Recovery Rules 与 Human Decision Gates。

数字员工于是第一次像传统软件一样，可以被定义、开发、测试、版本化、部署、升级和回滚。

## 11. Self-Morphing：当代码库开始“自己开发自己”

Self-Morphing 是本文最容易被误读、也最值得严格定义的概念。

它不是 Agent 无限制修改自身源代码，也不是让系统绕过验证自我复制。

它指的是：

> **一个数字员工开发与运行系统，能够利用自身的软件开发能力，构造、验证并部署新的数字员工形态。**

![Self-Morphing Digital Employee Loop](/assets/covers/saaw-self-morphing-loop.svg)

因此，一个受治理的 Self-Morphing 链路应该是：

**Meta-Dev Runtime → Analyze Work → Develop Worker Package → Validate → Governance / Human Decision → Deploy → Domain Worker Runtime。**

而领域 Worker 在真实履职中产生 Report、Issue、Result 和新的能力缺口，这些工作证据又成为下一轮开发输入。

于是形成：

# Develop → Validate → Deploy → Work → Observe → Improve

“自己开发自己”的真正含义，不是代码获得生命，而是**软件开发生命周期与软件履职生命周期开始连接成递归闭环**。

这也是 CodeFlowMu 从开发团队运行体走向数字员工运行体时最重要的工程命题。

## 12. PWA：人类从 Operator 变成 Supervisor

SaaW 并不意味着消除人类。

它改变的是人在系统中的位置。

在 SaaS 中，人通常是 Operator；在 SaaW 中，人逐渐成为目标设定者、Supervisor 和最终 Authorizer。

CodeFlowMu 的移动 PWA 因此不只是一个手机界面，而是数字员工团队的人类控制面。管理者可以查看 Task、Agent 状态、Report、Review、Issue、Recovery State 与 Waiting Decision。

对于低风险、规则明确的工作，Worker 可以自动推进；对于合同最终签署、大额付款、权限升级、不可逆业务操作和重要外部发布，则应该进入 Decision Gate。

最重要的是：Approve 不能只是一瞬间的 UI Event。

Human Decision 必须变成持久化治理事实，再驱动合法的 State Transition。

这才是真正意义上的 Human-in-the-Loop。

## 13. 从 Development Runtime 到 Work Runtime

传统软件把开发、部署和工作分开：研发团队开发软件，运维部署软件，业务员工使用软件。

SaaW 正在重新组合这三个生命周期。

CodeFlowMu 所探索的闭环可以表达为：

**Development Runtime → Digital Employee Package → Work Runtime → Work Evidence → Development Runtime。**

这不是简单的 DevOps。

DevOps 连接 Development 与 Deployment；SaaW 进一步尝试连接 **Development 与 Work**。

当工作证据能够直接进入下一轮能力开发，软件就不再只是一个静态工具，而开始成为一个持续生产、运行和改进数字员工的系统。

## 14. SaaW 改变的最终是软件经济学

SaaS 的商业逻辑是企业购买软件能力，然后继续配置员工完成工作。

SaaW 的商业逻辑则可能变成：企业部署被治理的数字工作能力，软件交付的一部分开始从 Feature 转向 Work Outcome。

企业未来购买的可能不只是 CRM，而是客户运营数字团队；不只是财务系统，而是财务处理数字员工；不只是合同管理软件，而是合同审查、签署与履约数字团队。

这意味着软件市场可能从单纯的 Software Market 向 Digital Labor Market 延伸。

SaaW 的价值因此不在于发明一个新的 Agent 名词，而在于提出一个新的软件问题：

> **如果软件能够承担岗位职责，那么企业应该如何定义、开发、验证、部署、治理和升级这种“软件员工”？**

TMPA、FCoP 与 CodeFlowMu 正是在不同层次回答这个问题。

## 15. 结语：软件开始工作

过去的软件一直在回答：怎样让人更高效地工作？

AI Native Software 开始面对另一个问题：哪些工作可以由软件本身完成？

我们的判断不是“人将从系统中消失”，而是角色开始迁移：Agent 进入操作层，人进入治理层。

**SaaS：Human operates Software。**  
**Copilot：Human operates with AI。**  
**SaaW：AI performs Work; Human governs AI。**

而当能够开发数字员工的系统，又开始利用自己的研发能力开发下一代 Worker，一个新的递归生命周期出现：

**AI develops Worker → Worker performs Work → Work produces Evidence → Evidence drives Development → AI develops next Worker。**

这就是 CodeFlowMu 正在探索的方向。

不是再造一个 Multi-Agent Framework。

而是：

> **构造一套能够开发、运行、治理、恢复并持续演化数字员工的软件基础设施。**

# SaaW — Software as an Agent Worker

软件曾经是工具。

后来成为服务。

现在，它开始工作。

---

**joinwell52 Research Center**  
**CodeFlowMu Core Team**

**TMPA Architecture Paper A0.9 · TMPA Core Specification S0.6 · TMPA Implementation Case Report I0.8 · CodeFlowMu / FCoP**

> **边界说明：** 本文是一篇 AI Native Software、Multi-Agent Engineering 与数字员工方向的技术宣言。TMPA/FCoP/CodeFlowMu 的已发布规范与工程能力按对应版本文档为准；Self-Morphing、Digital Employee Package 与 Development Runtime → Work Runtime 闭环同时包含正在推进的工程方向，不应被解读为无约束自修改或已经完成的全自动企业部署能力。
