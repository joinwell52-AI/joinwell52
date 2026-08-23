---
title: "多个 Agent 怎样真正组成团队？治理模型、文件状态机与工程轨道机"
date: '2026-08-22'
column: open-source-engineering
category: daily
article_type: architecture-explainer
edition: research-center
research_question: "TMPA、FCoP 与 CodeFlowMu 如何分工并连接成可治理的多 Agent 协作系统？"
summary: "多个模型会话不会自动组成团队。本文用一条真实可核验的协作链解释：TMPA 定义治理语义，FCoP 保存状态事实，CodeFlowMu 负责让任务沿工程轨道运行。"
item_id: "MANUAL-20260822-CODEFLOWMU-GOVERNANCE-RAIL"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-22-codeflowmu-governance-state-rail-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
sources:
  - research/manual-runs/2026-08-22-codeflowmu-rail-state-series-round1/02-source-register.md
  - research/manual-runs/2026-08-22-codeflowmu-rail-state-series-round1/02-fact-claim-matrices.md
---

<ArticleCover
  image="/assets/covers/daily-2026-08-22-codeflowmu-governance-state-rail-cover.png"
  kicker="开源工程 · 项目研究"
  title="多个 Agent 怎样真正组成团队？治理模型、文件状态机与工程轨道机"
  summary="多个模型会话不会自动组成团队。本文用一条可核验协作链解释：TMPA 定治理语义，FCoP 留状态事实，CodeFlowMu 负责工程执行。"
  version="MANUAL-20260822-CODEFLOWMU-GOVERNANCE-RAIL"
  status="Editorial &amp; Visual PASS · 2026-08-23"
  languageHref="/en/engineering/2026-08-22-codeflowmu-governance-state-rail"
  languageLabel="English"
/>

# 多个 Agent 怎样真正组成团队？治理模型、文件状态机与工程轨道机

设想一次并不罕见的多 Agent 交付：开发 Agent 说代码已经写完，测试 Agent 说用例已经通过，项目经理 Agent 也生成了总结；但当人问“这份测试报告对应哪一版代码、谁有权宣布任务完成、系统重启后从哪里继续”时，三个会话给出三套答案。

问题不在于 Agent 数量不够，而在于它们只是**同时回答**，还没有形成一支能交接、能追责、能恢复的团队。

本文的核心判断是：多 Agent 团队至少需要三层明确分工——**治理模型规定什么才算合法协作，文件状态机保存当前事实和迁移历史，工程轨道机负责派工、执行、观察与恢复。**读完后，你可以用同一张责任图检查自己的系统：哪里是规则，哪里是事实，哪里真正执行，最终决定又属于谁。

## 先看懂三个角色

这套体系中的三个名称并不是三个功能相近的框架。

| 层 | 在当前体系中的角色 | 负责什么 | 明确不负责什么 |
|---|---|---|---|
| TMPA | 治理模型 | 定义稳定身份、责任分离、生命周期、冲突保留和确定性重建要求 | 不启动模型，不规定文件夹，也不调度 Agent |
| FCoP | 文件状态机与协作协议 | 用 TASK、REPORT、ISSUE、REVIEW 等文件，以及路径和迁移事件表达协作事实 | 不选择执行者，不调用工具，不拥有重试与恢复策略 |
| CodeFlowMu | 工程轨道机 | 组织角色、建立会话、派发任务、检查能力、运行工具、观察报告并进行技术恢复 | 不定义 TMPA，也不能替 PM 或 ADMIN 作业务验收决定 |

一句话概括：**TMPA 定治理语义，FCoP 定状态事实，CodeFlowMu 让工作沿轨道运行。**

![TMPA 定义治理语义，FCoP 固定文件状态与事件，CodeFlowMu 负责工程执行](/assets/covers/daily-2026-08-22-codeflowmu-governance-state-rail-figure-1.svg)

*图 1：多 Agent 团队的三层分工。图中概括的是本文已核验的责任边界，不把协议或轨道机写成彼此替代的产品能力。来源：本文根据 TMPA 架构论文、FCoP v3 规范与 CodeFlowMu V1.9.7 候选证据整理。*

这种分层与通用来源模型并不冲突。W3C 的 [PROV-O](https://www.w3.org/TR/prov-o/) 也把实体、活动和承担责任的主体分开表达，并通过生成、使用、归属和委派关系建立来源链。它没有验证 TMPA 或 CodeFlowMu，但提供了一个独立参照：结果、过程与责任不应压成同一个“完成”字段。

## 第一层：TMPA 先规定什么叫“团队协作”

[TMPA 架构论文 A1.0](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-architecture-paper-a1.0-zh.md) 给出的基本运行思路是：文本承载消息与状态；每个写者保持自己的局部串行流；多条流异步推进；Reader（治理读取器）聚合来源并重建流程与问题。

它解决的不是“怎样让模型更聪明”，而是几个更基础的问题：

- 哪个稳定对象代表这项工作？
- 谁写了任务、报告、复核和决定？
- 一项状态迁移是否符合角色权限和生命周期？
- 两份来源互相冲突时，系统是保留冲突，还是随便选一份？
- 原进程消失后，现有证据能否重建工作关系？

[TMPA Core Specification S1.0](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-zh.md) 把这些问题收敛为可检查的对象和 Reader 行为。它特别强调稳定主载体、单写者对象、显式引用、角色权限和冲突保留。

这意味着一个团队任务不能只存在于某段聊天里。任务需要稳定身份；开发报告和测试复核应由各自角色写入独立对象；接受决定也不能由执行者在自己的报告中顺手完成。

TMPA 提供的是法理和一致性要求。至于这些对象放在文件、数据库还是对象存储中，它并不强制。

## 第二层：FCoP 把抽象治理投影成可见状态

FCoP 选择文件系统作为一种项目可见的协议载体。它当前的教学句是：

> 文件承载协议，路径标记状态，事件重放迁移。

一张任务可以位于以下生命周期目录之一：

```text
inbox → active → review → done → archive
          ↑        │
          └─打回───┘
          └──直接完成──→ done
```

路径回答“任务现在在哪里”；只追加的迁移事件回答“它怎样走到这里”。TASK 是派工信封，REPORT 是执行回执，ISSUE 是阻塞或风险记录，REVIEW 是独立治理判断。详细规则见 [FCoP v3 当前规范](https://github.com/joinwell52-AI/FCoP/blob/main/spec/fcop-v3-spec.zh.md)。

这种做法的工程价值不是“文件天然可靠”，而是事实容易观察：人、Agent 和脚本可以在同一个项目目录中看到任务、状态和证据，不必先理解某个私有数据库。

但 FCoP 的边界同样重要。它规定 `active → review` 是合法迁移，却不会决定由谁在几点执行；它定义 REPORT 的格式，却不会启动模型；它要求同一生命周期根处于一致文件系统边界，却不提供跨主机共识。

这里有一个容易混淆的并发边界。REPORT 与 REVIEW 是独立工件，分别写入自己的信封，因而不应共同覆盖同一份报告；但两个调用者争抢同一 TASK 的生命周期迁移，仍然是同一个竞争问题。FCoP 的规则不是“谁写完 REPORT 就自动搬动任务”，而是只有 L1 生命周期工具才能改 `_lifecycle/` 拓扑：`claim_task` 把 `inbox` 移到 `active`，`submit_task` 才把 `active` 移到 `review`。标准模式在同一文件系统边界内把追加事件后的内容写入目标目录临时文件、持久化，再以 `rename` 发布目标文件，随后才清理源文件；这使目标发布具有原子可见的提交点，却不等于存在全局锁，也不自动解决两个并发领取者或跨主机写者。后一类场景必须由生命周期工具拒绝/保留冲突，或在 FCoP 之外增加一致性层。

因此，TMPA 的“单写者对象”是一条责任与来源约束，不是“文件系统已经替你上锁”的同义词；也不能把“每个 Agent 写自己的目录”当成当前 FCoP 的既定保证。

所以，文件状态机仍然需要一个真正运行工作的系统。

## 第三层：CodeFlowMu 把状态机变成运行中的协作轨道

CodeFlowMu 是这一体系里的工程运行系统。它把角色、会话、任务、工具、报告和恢复连接起来，让 FCoP 中静态可见的协作对象真正产生动作。

在 V1.9.7 候选母版中，治理事实内核把 Runtime 事实轴（运行时事实）、Lifecycle（生命周期）、Report（报告）、Evidence（证据）、Dependency（依赖）和 Acceptance（验收）等维度分别保存。快照中的 `business_decision` 固定为空，表示内核可以计算和归一化事实，但不生成业务决定。

轨道辅助合同也把“谁决定”写进接口。以下是固定提交 `2c901972` 中与本文论点直接相关的等价字段节选；为便于阅读，原代码的类型别名已内联：

```ts
export interface RailAssistanceResult {
  disposition: "neutral" | "unknown_reconcile"
    | "waiting_dependency" | "negative_list_denied";
  decision_owner: "AGENT" | "PM" | "ADMIN";
  facts: string[];
  advisories: string[];
  suggested_actions: string[];
}
```

这段代码表达的不是一个界面标签，而是一条产品边界：轨道可以提供事实、提醒和建议，也可以在明确依赖或冻结负面条件下暂停当前动作；但业务决定必须带着明确主体返回。

四种处置应当这样理解：

- `neutral`：当前事实可用，轨道不替任何角色给出允许或拒绝结论；
- `waiting_dependency`：正式 TASK 中的显式前置依赖尚未满足，当前动作可以等待；
- `negative_list_denied`：命中冻结负面条件，例如作用域、身份或终态冲突，当前动作必须拒绝；
- `unknown_reconcile`：现有来源无法归一为一份可用上下文，需要对账。它的要点不是“系统已经决定失败”，而是模型不得把缺失或冲突事实脑补成验收结论；后续由 `decision_owner` 所指的 Agent、PM 或 ADMIN 判断怎样补证、重试或裁决。

当前合同并没有把 `unknown_reconcile` 写成一套固定的自动回滚、自动熔断或通知流程；这些属于调用方和运行时策略，不能从这个枚举本身推导出来。

同一版本还使用精确的角色工具清单检查 Agent 能否调用某项工具，并让 PM 的任务命令经过统一命令内核，核对任务身份、作用域、当前修订和防重复流水号。这些机制让“谁在什么任务里做什么”进入确定性软件边界，而不是只依赖提示词自律。

需要强调：角色工具门禁只检查规范工具身份与活动能力，它自己不解析所有命令副作用，也不等于操作系统沙箱。当前母版源码是私有的；本文只公开足以解释合同的短摘录，不把私有代码写成可公开复现的第三方证据。

## 一项任务怎样穿过三层

用“为现有系统增加 CSV 导出”作为贯穿示例，可以看到三层并不是三套平行文档。

| 阶段 | 输入 | 责任主体 | 输出 | 阻断条件 |
|---|---|---|---|---|
| 建立工作 | 已批准的需求与验收条件 | PM / ADMIN | 稳定根任务与责任边界 | 身份或授权范围不成立 |
| 创建任务 | 任务接收者、依赖、交付物 | FCoP L1 `create_task` | 位于 `inbox` 的 TASK 文件 | 信封或路径不合规 |
| 领取并绑定执行 | `inbox` 中的 TASK、身份与角色能力 | 获得权限的 Agent 显式调用 FCoP L1 `claim_task`；CodeFlowMu 在外围建立或调度任务上下文 | TASK 迁入 `active`，并附带 `inbox → active` 事件；任务绑定到 Agent 会话 | 依赖未完成、重复执行、角色能力缺失或迁移冲突 |
| 执行 | `active` TASK、代码与测试环境 | DEV / QA Agent 与 CodeFlowMu Runtime | 代码、测试原始输出与执行说明 | 工具能力或任务作用域不成立 |
| 写入执行回执 | 代码、测试原始输出与执行说明 | 执行者显式调用 FCoP `write_report` | 分别归属的 REPORT；例如 DEV 与 QA 各自写入独立信封，不互相覆盖；TASK 仍位于 `active` | 报告身份或证据冲突 |
| 提交任务进入审查 | `active` TASK 与已经写入的执行回执 | 执行者显式调用 FCoP L1 `submit_task` | TASK 迁入 `review`，并追加 `active → review` 事件 | 迁移冲突或提交前置条件不成立 |
| 重建事实 | TASK、REPORT、生命周期和来源 | 治理 Reader / 事实内核 | 可检查的任务快照与问题集合 | 来源缺失时只能输出不确定，不能猜 |
| 验收 | `review` TASK、当前版本、报告和证据 | PM / ADMIN 显式调用 `approve_task` 或 `reject_task` | 进入 `done`，或退回 `active` 返工；独立 REVIEW 仍是另一种治理工件 | 决定主体无权或绑定版本已变化 |

这里最容易被忽略的是最后两步。开发 Agent 交回 REPORT，只证明“它提交了这份结果”；事实内核看到报告，也只证明“存在一份归属明确的回执”。是否满足产品要求，仍由拥有验收权的主体决定。

表中用的是遵循 FCoP 边界的集成方式：运行时可以提供任务机会、会话和能力检查，却不能把“派发”偷换成它替 Agent 领取任务；`write_report` 产生 REPORT，也不会自动触发 `active → review`。生命周期位置只由显式 L1 调用改变。

NIST 的 [AI RMF 1.0](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10) 把治理视为贯穿 AI 生命周期的横向职能，并要求明确人机配置中的角色、责任与监督流程。它不规定本文的三层架构，但支持同一个通用判断：治理不是系统完成后的附加页面，而应进入完整运行链。

## 分层并不意味着永远使用文件

这套方法最容易被误读成“所有多 Agent 系统都应该使用本地文件”。这不是 TMPA 或本文的结论。

在一个项目根、单一一致文件系统和可控写者边界内，FCoP 的可见性和低基础设施成本很有价值。进入多主机并发、网络文件系统、跨信任域和强一致要求后，实现需要额外的一致性层，甚至采用数据库或事件服务。TMPA 的治理语义仍可保留，文件 Profile 却不必保留。

另一个反例是低风险、一次性的协作。如果三个 Agent 只做不产生外部副作用的头脑风暴，完整任务状态机可能得不偿失。治理成本应与任务持续时间、并发冲突、可逆性和验收责任相匹配。

## 用七个问题检查自己的系统

1. 每项工作是否有独立于模型会话的稳定身份？
2. 当前状态、历史事件、执行报告和验收决定是否分开？
3. 每个报告能否追溯到任务、执行轮次和责任角色？
4. 两个来源冲突时，系统会保留冲突还是静默覆盖？
5. 协议层或运行时是否越权替业务角色承担了验收、返工或最终结论？
6. 运行时是否只做机械校验和执行，而把验收留给有权主体？
7. 原会话或进程消失后，能否从持久对象重建未完成工作？

如果这七问只有“我们在提示词里要求 Agent 注意”作为答案，那么你拥有的仍是多个会话，而不是一支受治理的 Agent 团队。

当前证据也必须保持边界。[TMPA Implementation Case I1.0](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-implementation-case-i1.0-zh.md) 记录的是 CodeFlowMu V1.8.0 产品 Reader 在固定 S1.0 Bundle 上的作者运行结果；V1.9.7 候选版本则有新的母版源码、回归和实机重启记录。版本文件和实机进程显示 V1.9.7，不等于发版说明中的正式 `RELEASED`；最终版本决定仍属于 ADMIN。两组证据共同支持有边界的工程可行性，却都不是第三方认证或跨平台普遍证明。

下一步验证应拆成公开与受限两条轨。公开轨不依赖某个私有 Runtime：用已发布的 [TMPA S1.0 符合性工件与 Reference Reader](https://github.com/joinwell52-AI/joinwell52/tree/main/research/conformance/tmpa-core-s1.0)，配合 FCoP 规范和参考工具，对固定 TASK、REPORT、REVIEW 注入来源冲突，检查身份、来源与冲突保留能否被一致重建。它能验证协议与治理语义，不能替代 CodeFlowMu 的私有轨道机验证。受限轨则由获准访问 V1.9.7 候选母版的独立环境，针对旧修订命令、任务争抢和 Runtime 重启复跑运行时测试；在没有公开复现包前，外部读者不能自行复现这一产品层结论。

真正值得复用的不是三个项目名，而是这条责任线：**治理模型规定合法性，状态机保存事实，轨道机执行和恢复，有权的人或角色完成最终裁决。**

## 资料与证据边界

本系列如何区分公开规范、私有代码摘录、第一方运行记录与独立资料，见[《如何阅读数字员工工场的工程证据》](../methodology/evidence-boundaries)。以下来源仍只支持本篇明确写出的主张。

- [TMPA 架构论文 A1.0](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-architecture-paper-a1.0-zh.md)、[TMPA Core S1.0](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-zh.md) 与 [FCoP v3](https://github.com/joinwell52-AI/FCoP/blob/main/spec/fcop-v3-spec.zh.md)：支持本文对本研究的治理对象、文件工件和生命周期语义的描述；不构成对任何私有运行时的公开复现证明。
- [W3C PROV-O](https://www.w3.org/TR/prov-o/)：提供实体、活动与责任主体分离建模的独立参照；不规定 TMPA 或 FCoP 的具体目录和信封格式。
- [NIST AI RMF 1.0](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10)：支持“治理、角色责任与监督应贯穿生命周期”的通用背景；不认可或认证本文的三层实现。
- 文中 V1.9.7 运行时数据来自第一方受控证据包，仅支持所述固定 Windows 环境、代码和测试集合上的受测行为。访问日期：2026-08-23。
