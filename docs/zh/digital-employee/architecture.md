---
title: CodeFlowMu 数字员工生产机架构 V0.3.1（草案）
outline: deep
---

<ArticleCover
  image="/assets/covers/digital-employee.svg"
  kicker="公开架构草案"
  title="CodeFlowMu 数字员工生产机架构 V0.3.1"
  summary="在同一个 CodeFlowMu canonical Runtime 内核之上，以可版本化的岗位定义、部署激活、FCoP 持久事实、TMPA 确定性重建、事实核查与 EVAL 旁观，生产可配置、可恢复、可验证的数字员工。"
  version="V0.3.1 Draft"
  status="公开草案 · 非稳定规范"
  languageHref="/en/digital-employee/architecture"
  languageLabel="English"
/>

> **文档状态：**这是面向讨论与工程实施的公开架构草案，不是 TMPA Core S1.0 的组成部分，也不代表以下目标能力已经全部进入 CodeFlowMu 公开产品。文中“已运行”和“目标能力”必须分开理解。

## 结论先行

CodeFlowMu 当前已经是一台能够工作的**软件开发数字员工**：对外承担软件开发岗位，对内由 PM、DEV、QA、OPS 等角色协作，EVAL 独立旁观，ADMIN 保留最终治理权。

下一步不是复制 CodeFlowMu 再开发一套“应用 Runtime”，也不是把更多 Agent 塞进固定流程。正确方向是：

1. 保留现有 canonical Runtime、FCoP、TMPA Reader、事实核查、恢复与审批主链；
2. 在同一内核之上增加数字员工定义、校验、编译、部署和激活能力；
3. 先把现有开发团队描述为第一个可配置实例，并通过 shadow 对照证明行为等价；
4. 再生产一个非开发型参照实例，证明 Core 不依赖固定行业角色和流程；
5. 只有经过 Gate、切换与回滚验证的能力，才能从草案成为产品事实。

本架构的核心表达是：

> **CodeFlowMu 是轨道机，Agent 提供智能；数字员工对外是一个岗位，对内是一支由持久 PM 权责主体组织的多角色团队。**

## 一个数字员工不是一个 Agent

数字员工是组织内部一个由软件定义、长期存在、对结果负责的工作单元。

```text
数字员工
├── 对外契约：岗位（Position）
├── 对内治理：持久 PM 权责主体
├── 对内执行：受管理的多角色团队
└── 运行基础：CodeFlowMu Runtime
```

模型、Prompt、Agent Session、工作流、脚本、拟人形象和工具都只是实现组件。任何一个都不能单独定义数字员工。

稳定的岗位契约至少包括：

- 岗位使命、职责和 Work Catalog；
- 角色白名单与职责分离；
- 允许和禁止事项；
- Capability、数据、网络与凭据边界；
- AcceptanceContract 与证据要求；
- 事实核查、独立验证和人工权力边界；
- 调度、报告、成本、恢复和生命周期政策。

模型、Provider、Host、Session、临时执行者和工具可以替换，但岗位定义、责任链和持久事实不能随之消失。

## 一个内核，而不是两个 Runtime

**CodeFlowMu 本身就是数字员工 Runtime。** Cursor、Codex、OpenHands、模型 API 和本地模型属于可替换 Provider、Host 或 Adapter。

“开发数字员工”和“业务数字员工”不是两套运行体：

```text
同一个 CodeFlowMu canonical Runtime
├── 开发数字员工实例
├── 研究报告数字员工实例
└── 其他企业岗位实例
```

差异属于 `EmployeeDefinitionVersion`、`DeploymentRevision`、角色、Skills、Policy、Work Catalog 和外部系统绑定，不应写入两套 Core。

数字员工升级增加的是**可配置定义与部署层**，不能新增：

- 第二套 TASK、REPORT、REVIEW、ISSUE；
- 第二个运行状态真相；
- 第二个 Governance 决策出口；
- 与 Evidence Snapshot 平行的审计数据库；
- 由 EVAL 或界面维护的隐含生命周期。

## 五层架构

| 层 | 权威内容 | 明确不承担 |
|---|---|---|
| FCoP 现实协议层 | TASK、REPORT、REVIEW、ISSUE、生命周期、关系和证据归属 | Agent 调度、模型选择、业务工作流 |
| TMPA Reader 治理层 | 对可见事实作异步、确定性重建，保留争议、缺口与偏序 | 代替 FCoP 写事实，替 PM/ADMIN 验收 |
| CodeFlowMu Runtime 层 | Session、Run、attempt、lease、Host、Switchboard、Gate、恢复和 canonical snapshot | 写死某个行业岗位或行业流程 |
| 数字员工定义与部署层 | 岗位、团队、职责、Skills、Capability、负面清单、验收、报告和触发策略 | 新建第二套事实、任务或生命周期 |
| 数字员工实例层 | 某个实际岗位在某项目和部署中的运行 | 反向定义或污染通用 Core |

这些层通过异步事实回路协作，而不是构成一个要求所有 Agent 同时在线的同步流水线。

## 核心对象与事实归属

### 定义、部署与激活

- `EmployeeDefinitionVersion`：不可变、可寻址的岗位定义，说明“这个员工是什么、能做什么、怎样才算完成”。
- `DeploymentRevision`：把定义绑定到 Worker、Host、Provider、项目、调度器和能力授权。
- `DefinitionApprovalReceipt`：记录 ADMIN 对定义及权力边界的批准。
- `ActivationReceipt`：记录某个部署修订取得 shadow 或 active 运行资格。
- `SecurityPolicyOverrideReceipt`：只允许运行中的安全边界单调收紧，不能借热修复扩大权限。

这些回执是治理行为的证据，不是新的状态机，也不能自行表达 TASK 已经 done 或 archive。

### 工作与执行

- 正式 `WorkOrder` 由 **FCoP TASK** 承载，不再建立一套 WorkOrder 数据库。
- 一个 TASK 可以对应多个 `Run`；返工、恢复、Host 切换和重试必须保留各自的 session/run/attempt/lease。
- `WorkContextCapsule` 是轨道机针对一次 Session 编译的只读输入，绑定当前任务、定义、部署、Prompt、Skills、Tools、Policy、事实快照和 Gate。
- `ReportEnvelope` 是正式 REPORT 的结构化入口；与磁盘正式事实冲突时不能覆盖源对象。

## 持久 PM 与有界 Session

PM 是一个**持久的逻辑权责主体**，不是永远不退出的大模型 Session。

```text
FCoP 持久事实 + canonical snapshot
→ 轨道机编译 WorkContextCapsule
→ PM Session N 执行一轮工作
→ 写入新的正式事实
→ Reader 确定性重建
→ PM Session N+1 接续
```

因此：

- Session 可以结束、压缩、恢复或更换 Host；
- PM 的岗位身份、责任链和决定归属保持连续；
- 并发 Session 必须持有互不冲突的 task-local lease；
- 子 Agent 默认只提供 advisory 输出，不能暗中取得 PM、FCoP 或高权限 Tool authority；
- 轨道机负责次序、上下文、Skills、Tool Surface 与 Gate 的装配，不把可信状态交给模型记忆。

## AI 原生工作流与安全边界

数字员工必须避免两个极端：

```text
一切写死 → 退化为 RPA
只给目标 → 退化为失控 Agent
```

正确中间态是：岗位、职责、权限、状态和完成契约稳定；AI 在边界内动态规划；程序执行确定性规则；全过程保留可重建证据，并支持恢复、复核和人工门禁。

每个执行角色同时受两层约束：

1. **Capability Envelope / Sandbox Boundary**：default-deny，限制 Tool、路径、网络、凭据、资源和副作用；
2. **Negative List / Contextual Business Rule**：限制“即使技术上能做，也不应在当前岗位和任务中做”的行为。

语义质量要求进入 AcceptanceContract 或质量 Gate，不能冒充操作权限。更换模型也不能替代缺失的职责、证据或安全边界。

## 事实、证据、旁观与决定

数字员工必须区分四类机制：

| 机制 | 主要执行者 | 产物 | 最终业务决定权 |
|---|---|---|---|
| 确定性事实核查 | CodeFlowMu 程序和已注册事实源 | 匹配、缺口、冲突、失效与证据链 | 无 |
| Agent 执行/研究 | 专业角色 Agent | REPORT、产物、引用和工具证据 | 无 |
| 独立验证 / EVAL | 独立 Agent 或 verifier | 反证、结构风险、旁观意见 | 无 |
| 业务验收 | PM 或 ADMIN | approve、reject、rework、done、archive | 按正式授权拥有 |

现有生产主链保持不变：

```text
Action Evidence
→ Execution Provenance
→ ReviewEvidenceResolver / Evidence Snapshot
→ AcceptanceContract + ReviewFactGate
→ fact-check REVIEW（observation only）
→ PM / ADMIN 业务决定
```

`GovernanceFactKernel` 继续是治理事实的 canonical 投影内核，`business_decision` 保持为空；唯一生产状态出口不交给 Panel、EVAL 或任何 Agent。

Runtime 进程结束、工具返回成功或 Agent 声称“完成”，都不能单独证明业务正确完成。正式完成必须逐项满足适用的 AcceptanceContract、证据、FCoP 生命周期、独立验收和人工 authority。`publication_state` 只属于确实需要发布的工作类型，不是所有数字员工的通用完成条件。

## Evidence Lineage：同一证据快照的横向增强

V0.3.1 计划在现有 Evidence Snapshot 内增加可选的 `EvidenceLineageProjection`。它不是新的“决策依赖审计层”，而是同一证据快照的可丢弃、可重建派生投影。

```text
执行层：Agent 做了什么
依赖层：哪些动作、资源版本、声明和验收项共同支撑当前结论
```

目标升级是：

> **事实核查从“证据是否存在”提升到“证据链是否支持当前结论”；EVAL 从“汇总是否完整”提升到“依赖结构和系统性风险是否合理”。**

依赖来源分为：

- `observed`：由 Action Evidence、Tool 边界和不可变资源版本直接观察；
- `declared`：由 AcceptanceContract 或正式 REPORT 声明，并需与实际节点核对；
- `inferred`：由规则或图结构推断，只能用于 EVAL 风险旁观，不能单独形成确定性失败或审批依据。

事实核查与 EVAL 必须消费同一 Evidence Snapshot、`TargetStateManifest`、typed graph、完整 `findings[]` 和 graph digest。`summary_state` 只用于概览；冲突、失效和缺口可以同时存在，不能被单值摘要抹掉。

目标资源范围只能来自已编译 AcceptanceContract 中显式、有限的 selector。EVAL、Panel、Builder 和 REPORT 作者无权临时扩张或缩小范围，也不得退化为扫描整个工作区。

### 事实核查边界

事实核查逐 acceptance item 判断：

- `verified`：确定性证据链完整；
- `gap`：缺少执行版本、支撑事件或中间关系；
- `conflict`：硬来源矛盾或图完整性失败；
- `stale`：证据形成后目标资源版本已变化；
- `not_applicable`：合同明确不需要资源级依赖验证。

这些状态解释证据，不自动批准或驳回业务结果。

### EVAL 边界

EVAL 可以旁观：

- 依赖是否完整；
- 失败或缺口的下游影响范围；
- 关键证据节点；
- 最近的确定性断点和可能断点；
- 跨角色、跨报告的结构性风险。

EVAL 继续保持 `internal_only`、`drives_lifecycle: false`。只有命中已登记的 critical 规则并完成硬证据核对时，才能沿既有 ISSUE / governance hold 路径升级；图排序、风险分数、推断边和 summary 本身没有阻塞权。

本能力由 CodeFlowMu 使用 TypeScript 独立实现，不引入外部 Python 运行时或第二套决策系统。执行/依赖双层表示、来源分级和基础图分析属于对 [GRADE](https://github.com/yzhao062/grade/tree/3839a57ac165d58a807fce0a3ff38346732ee936) 与 [auditable v0.2.0](https://github.com/yzhao062/auditable/tree/v0.2.0) 的设计参考，不继承其性能结论。

## Skills、Knowledge 与受治理进化

| 对象 | 作用 |
|---|---|
| Position | 长期负责什么、向谁负责 |
| Work Skill | 某角色完成某类工作的稳定方法与交付约束 |
| Method Skill | 可复用的分析、写作、测试和验证方法 |
| Tool Capability | 可申请的能力类型；实际发放受 Capability Envelope 限制 |
| Knowledge | 业务事实、规则、术语、页面和系统知识 |
| Policy | 权责、Capability、负面清单、证据和验收边界 |
| Prompt | 上述对象针对一次 TASK 的短期编译投影 |

一次 Run 的经验不能直接覆盖正式 Skill、Knowledge、Workflow 或 Policy：

```text
Run / Failure / EVAL
→ Candidate
→ 独立复核与安全数据回归
→ 版本化批准
→ 受治理的 Skill / Knowledge / Workflow / Policy
```

## 已运行底座与目标能力

| 范围 | 当前公开判断 |
|---|---|
| FCoP TASK/REPORT/REVIEW/ISSUE、现有开发团队、Session/Run/恢复、事实核查与 EVAL 主链 | 已有运行与工程证据，但只对精确版本和证据包负责 |
| Governance Fact Kernel、Evidence Snapshot、AcceptanceContract、ReviewFactGate | 私有产品线已有实现观察；不等于公开源码或普遍正确性证明 |
| 通用 EmployeeDefinition、Deployment、Activation、definition-driven Context Capsule | V0.3.1 目标能力，尚需工程实施与 Gate |
| Evidence Lineage、TargetStateManifest、资源版本失效和图结构 EVAL | WP-14 目标能力，尚未作为公开产品现状声明 |
| 跨行业数字员工生产机 | 必须由开发团队自举和至少一个非开发参照实例共同证明 |

## 自举与工程证明

可信自举不是让运行中的程序直接修改自己，而是：

```text
固定母版本与证据
→ 独立分支开发可配置能力
→ 用定义复现现有开发团队
→ shadow 对照
→ 受控切换并保留回滚
→ 新开发数字员工开发下一版本
→ 生产非开发型参照实例
```

决定性证明不是“Agent 数量更多”，而是：

> **同一个 CodeFlowMu Core 在不写入业务专用角色顺序和流程逻辑的前提下，既能运行软件开发数字员工，也能运行结构显著不同的业务或研究数字员工。**

研究报告生产数字员工是第一候选参照实例，但参照实例不是通用引擎本身。

## 工程来源与公开边界

本架构的问题意识来自企业 AI 应用小典 AI 的工程实践：一条线追问“谁来开发企业 AI”，逐步形成多角色开发团队、FCoP 与 CodeFlowMu；另一条线追问“企业 AI 如何受治理地进入业务”，进入 TMPA 与数字员工架构。两条线现在在数字员工生产机中重新汇合。

小典 AI 的 [PWA Demo](https://demo.chedian.cc) 已开放，供读者进行交互体验；源码与生产系统仍不公开。Demo 只是公开体验入口，不代表 TMPA S1.0 符合性、独立验证、生产可用性或产品通用性的公开证明。

## 面向中小企业的经济性

“持久数字员工”不意味着模型持续消耗 Token。持久的是岗位、身份、权限、任务、工作历史、状态、证据、部署版本、评估和成本记录；计算资源在工作到达时按需激活。

## 实施路线

V0.3.1 将工程拆分为 14 个工作包，主要分为：

1. 定义、身份、Schema 与有效 FCoP 合同；
2. 开发团队自描述、角色政策与职责分离；
3. 定义校验、部署编译、激活和 Gate Registry；
4. WorkContextCapsule、Prompt/Skill/Tool 装配；
5. 异步路由、PM 连续体、Switchboard shadow 与双发防护；
6. default-deny Tool 边界、凭据隔离和安全热修复；
7. 周期报告、研究报告参照实例与跨修订迁移；
8. 独占切换、旧路径退役与回滚；
9. WP-14：事实核查和 EVAL 的 Evidence Lineage 增强。

工作包必须继续通过现有 FCoP TASK/REPORT/REVIEW 主线实施。本草案本身不是执行授权，也不能替代 ADMIN 的定义批准、激活或切换决定。

## 草案之后仍需验证

- 通用定义和部署 Schema 的实现级冻结；
- 不同 Host/OS 的 Capability 与 Tool enforcement；
- 凭据隔离、撤销和副作用归一化；
- PM 背压、长任务树迁移和 successor Session；
- Workflow/Knowledge 晋级标准与回归数据；
- Evidence Lineage 的 shadow 兼容、跨平台确定性和性能上限；
- 开发数字员工的行为等价迁移；
- 非开发参照实例在不修改 Core 前提下的完整运行；
- active 切换、回滚和旧路径退出生产权。

只有对应 Gate 和证据完成后，相关条目才能从“架构目标”升级为“已实现能力”。
