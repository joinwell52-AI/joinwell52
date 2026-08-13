---
title: "Trace ≠ Governance：从工作事实到 SaaW"
date: "2026-08-14"
column: "industry-architecture"
category: "visual-essay"
version: "V1.0"
summary: "从执行轨迹与治理的根本区别出发，解释 TMPA、FCoP、CodeFlowMu、元开发运行体、数字员工包与受治理 Self-Morphing 如何形成通向 SaaW 的工程链。"
item_id: "VISUAL-ESSAY-20260814-TRACE-GOVERNANCE-SAAW"
lifecycle: "Published"
cover: "/assets/covers/01-saaw-manifesto-cover-agent-worker.png"
visualization: "/assets/covers/16-saaw-tmpa-four-rules-v2.svg"
visualization_2: "/assets/covers/17-saaw-fcop-lifecycle-v2.svg"
visualization_3: "/assets/covers/18-saaw-codeflowmu-runtime-boundary-v2.svg"
visualization_4: "/assets/covers/19-saaw-governed-self-morphing-v2.svg"
evidence_status: "Derived from the published SaaW V1.1 manifesto and TMPA V1.0 publication line"
citation_status: "TMPA V1.0 DOI and public engineering repositories linked"
editing_status: "Published"
publication_authorized: true
outline: deep
---

# Trace ≠ Governance：从工作事实到 SaaW

## TMPA、FCoP、CodeFlowMu 与 Self-Morphing 的一条工程链

[阅读《从 SaaS 到 SaaW》23 节完整原文](/zh/industry/2026-08-10-saaw-software-as-an-agent-worker)

[English version](/en/industry/2026-08-14-trace-governance-saaw-visual-essay)

[![SaaW — Software as an Agent Worker](/assets/covers/01-saaw-manifesto-cover-agent-worker.png)](/assets/covers/01-saaw-manifesto-cover-agent-worker.png)

一个 Agent 调用了工具，修改了文件，最后返回 `completed`。

这说明什么？

它只能说明：**发生过一次执行。**

它不能自动证明：任务已经合法完成、测试已经确认、交付已经被审查、冲突已经解决，或者某个角色有权把任务推进到下一状态。

这正是长期 Agent 系统最容易忽略的架构分界：

> **Trace（执行轨迹）≠ Governance（治理）。**

[![Trace 不等于 Governance：执行轨迹与治理状态的区别](/assets/covers/15-saaw-trace-vs-governance-v2.svg)](/assets/covers/15-saaw-trace-vs-governance-v2.svg)

*图 1：Trace 记录事件；Governance 根据持久工作事实、规则、责任与授权重建合法状态。*

## 1. 执行轨迹为什么不够

轨迹适合回答：模型调用了什么工具、操作发生在什么时候、返回了什么结果。

但一项真实工作还需要回答另一组问题：

- 谁授权了任务？
- 谁正式接受了责任？
- 哪个产物代表正式交付？
- 测试结果是否可复核？
- 谁进行了独立审查？
- 当前生命周期状态是否合法？
- 冲突、缺口和悬空引用是否仍然存在？
- 进程重启后，应该由谁继续？

这些问题不是增加几行日志就能解决的。日志仍然只是系统事件；治理关心的是工作事实、责任关系和决策效力。

因此，构建数字员工的第一步，不是让 Agent 调用更多工具，而是让工作事实脱离 Agent 会话而存在。

## 2. TMPA：让工作事实可以重建

**TMPA（Textual Multi-Agent Process Architecture，文本化多智能体流程架构）**是一种面向中小企业、最低基础设施条件的文本消息多智能体异步流程架构。

它不是 Agent 调度器，也不是一个中央运行时。TMPA 讨论的是：多个 Agent 与人长期异步协作时，任务、责任、证据、冲突与审计状态如何成立。

其核心由四条相互关联的规则构成：

> **文本承载持久消息与状态；每个写者保持自己的局部串行流；多条串行流异步推进并形成并行协作；读端聚合现有证据，重建流程、责任、生命周期、冲突与审计状态。**

[![TMPA 四条规则与事实重建](/assets/covers/16-saaw-tmpa-four-rules-v2.svg)](/assets/covers/16-saaw-tmpa-four-rules-v2.svg)

*图 2：每个主体只追加自己的事实；跨流引用形成偏序关系；Reader 聚合证据但不覆盖冲突。*

这里最关键的不是“用文本代替数据库”，而是两个更基本的原则：

第一，责任必须有明确来源。PM、DEV、QA 和人类决策者分别保持自己的局部事实流，不去修改另一个主体已经写下的历史。

第二，状态不是最后一个字段值。Reader 根据 `Task`、`Acceptance`、`Report`、`Review`、`Decision`、`Issue` 和 `Correction` 等对象重新计算当前状态。

于是，模型可以替换，进程可以重启，但已经成立的工作事实不会随会话一起消失。

## 3. FCoP：让治理语义进入项目协作

理论与规范需要一种可运行的协作表达。

**FCoP（File-based Coordination Protocol，文件驱动协作协议）是一种以文件系统为唯一同步原语的多智能体行为治理协议。**

FCoP 的项目可见 Profile 可以概括为：

- **目录即状态**：`inbox → active → review → done → archive`；
- **文件名即路由**：发送者、接收者、对象类型与序号共同表达身份；
- **内容即负载**：Markdown 与 frontmatter 承载任务、报告、引用和证据；
- **原子移动即同步**：生命周期迁移通过 `os.rename()` 完成。

[![FCoP 文件驱动生命周期与事实平面](/assets/covers/17-saaw-fcop-lifecycle-v2.svg)](/assets/covers/17-saaw-fcop-lifecycle-v2.svg)

*图 3：生命周期变化不是覆盖中央 status，而是移动项目可见工作对象；人、Agent、Reader 与运维工具观察同一事实平面。*

FCoP 的价值不只是“用文件传消息”。它让任务交接、报告、复核、决策、问题和恢复路径可以观察、引用和审计。

但边界也必须明确：FCoP 治理协作行为，不负责模型推理、进程调度、身份认证或资源分配，也不是完整的 Agent Runtime。

## 4. CodeFlowMu：让角色、工具和治理进入真实运行

如果说 TMPA 定义的是工作事实与治理语义，FCoP 提供项目可见的文件驱动协作协议，那么 **CodeFlowMu 解决的是这些语义和协议如何进入真实 Agent 运行世界。**

它的工程起点不是构造一个巨大的中央 Agent 运行体。

推理交给成熟模型生态；浏览器、API、CLI、MCP 和业务系统负责实际动作；CodeFlowMu 集中处理角色编排、责任边界、Skill 调用、生命周期、FCoP 接入、报告、审查、恢复与人类决策。

[![CodeFlowMu 工程运行边界](/assets/covers/18-saaw-codeflowmu-runtime-boundary-v2.svg)](/assets/covers/18-saaw-codeflowmu-runtime-boundary-v2.svg)

*图 4：模型负责推理，工具负责行动；CodeFlowMu 组织工作，FCoP 承载事实，TMPA 指导治理语义。*

因此，三者不是三个相似的产品：

| 层次 | 解决的问题 | 不负责什么 |
|---|---|---|
| TMPA | 什么工作事实可以成立和重建 | 不调度或执行工作 |
| FCoP | 这些事实如何进入项目可见协作 | 不是完整 Agent Runtime |
| CodeFlowMu | 角色、工具、协议和治理如何真实运行 | 不用运行事件替代业务决策 |

把边界分清，才能避免把“Agent 返回完成”误当成“组织已经接受交付”。

## 5. 元开发运行体：研发能力成为生产能力

CodeFlowMu 当前最值得关注的地方，不只是多个 Agent 可以一起开发软件。

> **更重要的是，这种研发能力本身可以成为下一代数字员工的生产能力。**

我们把这一形态称为 **元开发运行体（Meta-Development Runtime）**。

PM、DEV、QA、OPS 等角色不仅可以开发传统软件，还可以把岗位职责、工作流、Skill、权限、治理策略、验证规则、运行配置、恢复规则和人类决策门组合成：

> **数字员工包（Digital Employee Package）：让数字员工成为可工程化产品。**

它使岗位能力可以像软件一样被定义、开发、测试、版本化、部署、升级和回滚。

## 6. Self-Morphing：受治理地“自己开发自己”

**Self-Morphing** 不是让生产环境中的 Agent 任意重写自己，也不是无限递归地制造 Agent。

它描述的是一个严格隔离并可回滚的改进闭环：生产运行产生工作证据；证据暴露能力缺口；元开发运行体设计改进并生成新版本数字员工包；新版本经过隔离验证和明确授权后，才允许进入下一轮工作。

[![受治理的元开发与 Self-Morphing 闭环](/assets/covers/19-saaw-governed-self-morphing-v2.svg)](/assets/covers/19-saaw-governed-self-morphing-v2.svg)

*图 5：证据可以进入元开发，但元开发不能在线改写生产运行体；验证与授权决定能否部署，并始终保留回滚路径。*

完整循环是：

> **工作 → 证据 → 发现缺口 → 开发改进 → 隔离验证 → 人类或治理授权 → 部署 → 新一轮工作**

如果变更来源不可追踪、测试不可复现、部署未经授权、运行版本不可识别，或者失败后无法回滚，那么所谓“自我演化”就只是不可审计的自动改写。

## 7. 人类没有消失，而是离开了操作层

SaaW 并不意味着把人从系统里删除。

低风险、可逆、策略内的查询、整理、验证、报告和同步，可以逐步由数字员工执行；外部发布、不可逆修改、资金、凭证、隐私和策略例外，则必须停在人类授权边界之前。

人不再负责每一次点击和信息搬运，而是负责：

- 设定目标与权限边界；
- 处理冲突和异常；
- 审查关键证据；
- 批准、拒绝或要求返工；
- 对高影响后果承担最终责任。

在 SaaS 中，人通常停留在软件操作层；在 SaaW 中，人逐渐进入治理和最终授权层。

## 8. SaaW：软件开始承担工作

**SaaW（Software as an Agent Worker）**是整条变化的上位名称：软件不再只是被人操作的功能集合，而开始在明确的岗位职责、权限边界和治理规则下持续承担工作。

它不是新的聊天框，也不是只增加一个 Agent。一个真正的数字工作主体需要角色、环境、Skill、权限、状态、治理、证据、恢复能力和人类授权边界。

这里仍然需要区分已经验证的能力与研究方向。

当前可以公开检查的工程基础包括 TMPA V1.0 的架构论文、核心规范和实施案例，FCoP 的文件驱动协议与实现，以及 CodeFlowMu 的开放工程运行环境。实施案例固定 CodeFlowMu v1.8.0，并记录对 TMPA S1.0 的 **14/14** 验证结果。

标准化数字员工包、标准化 Agent PC、领域工作运行体和更广泛的 Self-Morphing，仍然属于研究与后续工程验证范围。

## 结语

从 Agent 系统到数字员工，最关键的变化并不是模型更像人，而是工作开始拥有独立于模型会话的事实、责任、证据、恢复和授权结构。

> **TMPA 让工作事实成立，FCoP 让协作事实可见，CodeFlowMu 让它们进入真实运行；元开发运行体再把运行证据生产为数字员工包，并通过受治理的 Self-Morphing 持续改进，最终指向 SaaW。**

软件曾经是工具。  
后来成为服务。  
现在，它正在开始工作。

> **从软件市场到数字劳动力市场。**

---

- **完整原文：** [从 SaaS 到 SaaW：当代码库开始“自己开发自己”](/zh/industry/2026-08-10-saaw-software-as-an-agent-worker)
- **TMPA V1.0 DOI：** [10.5281/zenodo.21888488](https://doi.org/10.5281/zenodo.21888488)
- **FCoP：** [GitHub Repository](https://github.com/joinwell52-AI/FCoP)
- **CodeFlowMu：** [Open Engineering Runtime](https://github.com/joinwell52-AI/CodeFlowMu-open)
- **版本状态：** V1.0 · 已发布
