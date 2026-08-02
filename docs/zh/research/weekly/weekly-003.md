---
title: Weekly 003 — 所有权是智能体工作的控制平面
date: '2026-08-02'
column: digital-employee
category: weekly
summary: '对三篇经过证据验证的 Daily Research Notes 进行交叉分析后得出：可靠的智能体系统必须在每一个执行边界明确工作、控制、状态、权限、证据与完成的所有权。'
sources:
  - Digital Employee Daily 003 — 计算机操作需要可观测的动作—状态循环
  - Industry Architecture Daily 003 — A2A 与 MCP 定义不同的互操作边界
  - Open-source Engineering Daily 003 — Manager 编排与 Handoff 表达不同的所有权模型
outline: deep
---

<ArticleCover
  image="/assets/covers/weekly-003.svg"
  kicker="研究周报 · 003"
  title="所有权是智能体工作的控制平面"
  summary="可靠的 Agent 系统不只是传递动作，而是在每个边界明确所有权、权限、证据与完成判断。"
  version="W003"
  status="发布于 2026-08-02"
  languageHref="/en/research/weekly/weekly-003"
  languageLabel="English"
/>

## 证据范围

本期综合只使用 **2026-07-27 至 2026-08-02** 七天窗口内、已经通过证据验证的 Daily Research Notes。

共有三篇 Daily 笔记满足条件。三篇笔记均由 Research OS Engine Production Test V1 生产和验证，完整通过 Research Skills 流程，合并到 `main`，并从权威分支重新读取确认。

| 栏目 | 合格 Daily 笔记 | 本期使用的已验证判断 |
|---|---|---|
| 数字员工 | 计算机操作需要可观测的动作—状态循环 | 模型提出动作，外部 Runtime 执行、观察、治理并验证结果状态。 |
| 行业架构 | A2A 与 MCP 定义不同的互操作边界 | 协议选择应依据工作、状态、政策与完成权归属，而不是只比较功能数量。 |
| 开源工程观察 | Manager 编排与 Handoff 表达不同的所有权模型 | 专家调用和 Handoff 是不同操作，因为控制权与责任并不会以相同方式移动。 |

Academic Observation、较早的 Weekly 报告和未验证资料均未进入证据集。因此，本报告综合的是一个规模较小但内部一致、经过生产验证的 Daily 集合，而不是把它包装成广泛市场调查。

## 核心综合

三篇 Daily 笔记研究的是三个不同表面：

- GUI 执行；
- 协议互操作；
- 多 Agent 编排。

它们面对的底层架构问题却完全相同：

> **当系统只传递消息或动作，却没有保存谁拥有工作、谁控制执行、谁拥有状态、谁授予权限、谁可以声明完成、谁独立验证结果时，智能体工作就会失去治理基础。**

本期形成的新结论是：**所有权是智能体工作的控制平面。**

可靠的数字员工平台不能把计算机动作、MCP 调用、Manager 到专家的调用、Handoff 和 A2A 委派统一压扁成“工具调用”。它们是不同的工作边界，对应不同的所有权变化。

```text
Position + WorkOrder
        ↓
工作边界控制平面
  ├─ Computer Operation 边界
  ├─ Capability 边界（MCP）
  ├─ 内部委派边界
  ├─ Handoff 边界
  └─ 外部 Agent 边界（A2A）
        ↓
Evidence Envelope
        ↓
独立 Completion Verifier
        ↓
接受结果，或进入受治理恢复
```

*图：joinwell52 Research Center 基于三篇合格 Daily Research Notes 的综合。*

## 本周关键发现

1. **执行与完成是两个不同事实。** 点击成功、工具返回、专家回复或远程任务状态，都不自动等于业务结果完成。
2. **控制转移与工作贡献不是同一件事。** Manager 可以继续承担最终责任而让专家贡献；Handoff 可以改变当前 Owner；外部 Agent 可以拥有委派任务，但调用方仍拥有验收权。
3. **协议功能趋同不会消除语义边界。** MCP 与 A2A 都可以支持长任务，但仍然围绕不同的所有权关系组织。
4. **自治必须拆开定义。** 操作自治可以提高，但权限自治仍应受 Position Policy 与人类审批约束。
5. **证据必须穿过每一个边界。** 接收方不能只继承“已经成功”的叙述，而应收到足够支持独立验证的结构化 Evidence Envelope。

## 交叉分析

### 1. Computer Use 暴露动作—状态缺口

计算机操作 Daily 将以下五个事实拆开：

```text
提出动作
→ 获得授权的动作
→ 实际执行的动作
→ 应用结果状态
→ 完成判断
```

这说明 Agent 不能同时成为自己 GUI 工作的唯一执行者和最终裁判。模型可以提出动作；Harness 可以执行；目标应用拥有实际业务状态；任务专用 Validator 决定目标结果是否真正成立。

隐藏的所有权问题并不是“谁点击了按钮”，而是：

- 谁拥有 WorkOrder；
- 谁被允许执行动作；
- 谁保存前状态与后状态；
- 谁负责重试或补偿；
- 谁有权关闭工作。

### 2. MCP 与 A2A 暴露服务边界缺口

协议 Daily 表明，功能列表不是可靠的架构选择依据。MCP 和 A2A 都可以具有能力、长任务、进度、取消与异步行为。

真正稳定的区别是责任关系：

- MCP 通常是在 Host 控制的工作流内暴露能力；
- A2A 通常是把有意义的一段工作委派给独立运行的 Agent 服务。

因此，Protocol Adapter 不应暗中决定工作模型。WorkOrder 与 Position Contract 应先决定这是能力调用还是责任委派，再选择传输协议。

### 3. Manager 与 Handoff 暴露责任转移缺口

编排 Daily 表明，Manager 调用专家时保留会话与完成所有权；Handoff 则改变当前 Agent，并可能转移后续责任。

因此，仅有 `from`、`to` 和自然语言消息不足以形成 Runtime 事实。系统必须记录操作类型：

```text
consult
assign_subtask
handoff
escalate
return
```

没有类型，Runtime 就无法可靠重建谁负责集成、谁应用最终 Guardrail、谁可以声明完成。

### 4. 统一边界矩阵

| 边界 | 边界后的工作 Owner | 控制 Owner | 状态 Owner | 完成声明者 | 验收验证者 |
|---|---|---|---|---|---|
| Computer Operation | 通常仍由本地 WorkOrder Owner 承担责任 | Execution Harness | 目标应用与 Runtime Evidence Store | 本地 Runtime 或 Worker | 任务 Validator / 人类 Gate |
| MCP Capability Call | Host 通常保留工作所有权 | Host 编排 Server Capability | Server Capability State 与 Host Workflow State | Host Workflow | Host 侧 Business Validator |
| Manager → Specialist | Manager 保留父工作所有权 | Manager | Manager Run 与 Specialist Subtask State | Specialist 声明子任务结果；Manager 声明父任务完成 | Manager、QA 或 Release Gate |
| Handoff | 接收 Agent 成为转移范围的当前 Owner | 接收 Agent，在 Runtime Policy 内运行 | 共享 Run State 与受治理 Context Transfer | 接收 Agent 对转移范围声明完成 | 明确的下游 Gate 或返回后的 Owner |
| A2A Delegated Task | 远程 Agent 拥有委派任务执行 | 远程 Agent Service | 远程 Task Lifecycle；调用方保留本地 WorkOrder State | 远程 Agent 报告 Task State 与 Artifact | 调用方 Acceptance Validator |

*表：joinwell52 Research Center 综合。*

矩阵揭示了一个反复出现的规则：**报告进度的一方，不一定是有权接受最终完成的一方。**

## 新架构判断：工作边界控制平面

Research Center 应在 Position 级工作与每一种执行 Adapter 之间建立 **Work Boundary Control Plane（工作边界控制平面）**。

它不是第二个 Workflow Engine，而是一个跨异构操作保存所有权语义与证据的层。

### 必要对象

1. **WorkBoundaryContract** —— 定义边界类型和允许的所有权变化。
2. **OwnershipLedger** —— 持久记录边界前后的所有权事实。
3. **AuthorityDecision** —— 记录政策判断与必要的人类批准。
4. **ContextPackage** —— 只转移接收方完成工作所必需的上下文。
5. **EvidenceEnvelope** —— 返回结构化观察、Artifact、状态引用与执行事实。
6. **CompletionVerifier** —— 独立判断 WorkOrder 结果是否可以接受。

### 建议 Contract

```yaml
work_boundary_contract:
  boundary_id:
  work_order_ref:
  boundary_type: capability_call | subtask | handoff | external_delegation | computer_operation
  from_actor_ref:
  to_actor_or_adapter_ref:
  work_scope:
  work_owner_before:
  work_owner_after:
  control_owner:
  state_owner:
  authority_source_ref:
  context_package_ref:
  expected_output_contract:
  evidence_envelope_contract:
  completion_claimant:
  completion_verifier:
  retry_owner:
  compensation_owner:
  return_or_escalation_condition:
```

### 边界不变量

- 任何边界都不得隐式改变工作所有权。
- Completion Claim 不得自动成为 Accepted Outcome。
- Context Transfer 必须遵循最小权限，并排除陈旧或不可信内容。
- 在执行后果性动作前，必须明确 Retry 与 Compensation Owner。
- Protocol Adapter 可以传输工作，但不能重新定义 Position Authority 或 WorkOrder Lifecycle。
- 恢复运行必须证明不会重复执行后果性动作。

## 发现的矛盾

### 自治与权限

Computer Use 与远程委派提高操作自治，但组织中的后果性动作仍然需要受限权限。把更多工具访问等同于更高权限，是概念错误。

**解决方向：** 在 Position 和 WorkBoundaryContract 中分别记录 Operational Capability 与 Decision Authority。

### 协议功能趋同与语义分化

MCP Tasks 与 A2A Tasks 在传输层可能越来越相似，但前者通常服务于 Host 控制的能力集成，后者表示独立 Agent 协作。

**解决方向：** 先选择工作模型，再选择协议；不能因为存在异步 Task Handle 就推断责任关系。

### 中央控制与编排瓶颈

Manager 模式提供统一政策与集成，但中央 Manager 可能变慢、上下文过重，或扭曲专家结果。Handoff 降低中央瓶颈，却可能使政策与完成责任碎片化。

**解决方向：** 对边界清晰、需要聚合的工作保持 Manager Ownership；只有在转移范围、权限、返回条件和 Verifier 明确时才允许 Handoff。

### 丰富上下文与最小权限

Handoff 与远程协作受益于上下文连续性，但安全执行要求尽量减少敏感、陈旧或被 Prompt Injection 污染的内容。

**解决方向：** 默认使用受治理的 ContextPackage，而不是转发完整 Transcript。

### 自我报告成功与独立验证

远程 Agent、专家或 Computer Use Loop 都可以报告成功，但调用方仍需证明业务状态正确、持久地发生了变化。

**解决方向：** 完成应是两步协议：先 `claim`，再 `accept` 或 `reject`。

## 尚未解决的问题

1. 哪些所有权维度应进入 TMPA 核心对象，哪些只应作为 Runtime Projection？
2. 一个 EvidenceEnvelope 能否覆盖 GUI 状态、MCP 工具结果、专家报告与 A2A Artifact，而不变得过度抽象？
3. Handoff 链不返回原 Manager 时，父 WorkOrder 应如何结束？
4. 哪些 Validator 必须确定性执行，哪些场景可以接受人类判断作为验证？
5. 外部 Agent 边界中的重复提交、超时、取消与补偿应如何表示？
6. 远程 A2A Agent 内部调用 MCP 工具时，人类批准应在哪一层强制执行并保存证据？
7. 怎样的证据保留策略能够支持审计，同时控制隐私与存储风险？

## 工程判断

CodeFlowMu 下一阶段不应从大范围增加 A2A、MCP 或无限制 Computer Use 开始。

最高杠杆的工程顺序是：

### Phase 0——语义基础

1. 增加 Typed Delegation 与 Boundary Event Model。
2. 增加 `work_owner`、`control_owner`、`completion_claimant`、`completion_verifier` Projection。
3. 定义 EvidenceEnvelope 与 CompletionVerifier 接口。
4. 在适用流程中增加明确的 `waiting_human_authority`、`claim_submitted`、`verification_failed`、`accepted` 状态。

### Phase 1——受控 Adapter

1. 用前状态、后状态、审批和确定性验证封装一个本地 Computer Operation 案例。
2. 封装一个有边界的 MCP Capability Call，且不转移父工作所有权。
3. 使用同一个 WorkBoundaryContract，实现一个 Manager→Specialist Subtask 和一个显式 Handoff。
4. 模拟一个 A2A 风格外部委派，包含远程 Task State 与本地 Acceptance Gate。

### Phase 2——比较实验

使用同一个有边界业务任务运行四条路径：

```text
manager subtask
handoff
MCP capability
A2A delegation
```

比较：

- 所有权清晰度；
- 转移的上下文；
- Retry 行为；
- Evidence 质量；
- Final-state Verification；
- 中断后的恢复；
- 重复执行后果性动作的风险。

只有当这些语义稳定后，CodeFlowMu 才应增加通用协议桥或完整 Digital Employee Studio。

## 对 Research Center 架构的影响

### TMPA

本报告不修改 TMPA 正式出版物。它为以下概念的分离提供研究输入：

- 工作分配；
- 消息转移；
- Custody；
- Authority Transfer；
- Execution Control；
- Evidence Custody；
- Completion Claim；
- Completion Acceptance。

确定性重建应保存每次变化，而不是只根据消息顺序或文件移动进行推断。

### Digital Employee

Position 定义应声明：

- 可以接受哪些工作；
- 可以调用哪些能力；
- 可以委派哪些工作；
- 哪些权限无需批准即可行使；
- 可以操作哪些应用和账户；
- 可以披露哪些上下文；
- 可以声明哪些完成；
- 可以最终批准哪些结果。

这使数字员工从一个有名字的 Agent 变成可问责的组织工作者。

### CodeFlowMu

CodeFlowMu 现有 PM 模式应继续作为默认 Manager Model：PM 负责分解、集成与父任务完成。DEV、QA、OPS 默认贡献有边界工作，除非显式 Handoff 改变所有权。

Runtime 应显示：

```text
current work owner
active control owner
contributors
pending subtask owners
decision authority
release authority
completion claimant
completion verifier
last ownership transition
```

FCoP 生命周期转换仍然是有价值的 Custody Evidence，但不能把文件移动单独视为完整所有权模型。

## Queue 重新排序

| Queue 项 | 优先级 | 建议转换 | 原因 |
|---|---:|---|---|
| WorkBoundaryContract 与 OwnershipLedger | P0 | Candidate → Selected → Architecture Definition | GUI、MCP、A2A、Manager 与 Handoff 的共同前置条件。 |
| CompletionVerifier 与 EvidenceEnvelope | P0 | Candidate → Selected | 三篇合格 Daily 均揭示完成或证据缺口。 |
| Human Authority Lifecycle Node | P0 | Candidate → Selected | 后果性动作需要持久审批与恢复语义。 |
| Comparative Boundary Experiment | P1 | Candidate → Queue | 用一个任务跨四种工作模型验证架构。 |
| A2A–FCoP External Bridge | P2 | Queue → Hold | 应等待所有权与验收语义稳定。 |
| General MCP Skills/Tasks Integration | P2 | Queue → Hold | Capability Transport 不应早于 Host 侧 Work Contract。 |
| Unrestricted Computer-use Runtime | P2 | Queue → Hold | 应先从受控本地应用与可执行 Validator 开始。 |
| Full Digital Employee Studio | P3 | Backlog 保持 Backlog | Registry 和 UI 扩展应晚于 Runtime 语义验证。 |

## 生命周期转换

三篇源 Daily 笔记从 `published` 转换为 `synthesized`，并将 Weekly 003 记录为综合消费者。

```text
Daily 003 source objects
published
→ synthesis_selected
→ cross_analyzed
→ synthesized_in: weekly-003

Weekly 003
candidate
→ selected
→ cross_analysis_complete
→ architecture_judgment_complete
→ engineering_judgment_complete
→ publication_editing_complete
→ published
→ commit_verified
```

这些转换不会重新打开或改写原 Daily 出版物，只记录 Daily Evidence 已被更高层综合流程消费。

## 下周研究

1. 起草 WorkBoundaryContract V0.1 研究 Schema，暂不冻结为 TMPA 对象。
2. 定义最小 EvidenceEnvelope，并为 GUI、Capability Call、Specialist Result、Remote Agent Artifact 提供具体变体。
3. 设计四路径比较实验与一个确定性 Final-state Validator。
4. 定义 Human Approval、Timeout、Cancellation、Retry、Compensation 转换。
5. 测试现有 FCoP Custody Event 能否在不修改协议的前提下投影 Proposed OwnershipLedger。

## 结论

本周三篇经过验证的 Daily 观察收敛为一个工程原则：

> **Agent 治理的核心不是更聪明地路由，而是在工作、控制、状态、权限、证据或完成发生移动的每个边界，保存可问责的所有权。**

实践结论也很明确：CodeFlowMu 应先建立 Work Boundary Control Plane，再扩展协议覆盖与计算机操作自治。

## 参考资料

1. [Digital Employee Daily 003 — 计算机操作需要可观测的动作—状态循环](../../digital-employee/2026-08-02-computer-use-action-state-loop)
2. [Industry Architecture Daily 003 — A2A 与 MCP 定义不同的互操作边界](../../industry/2026-08-02-a2a-mcp-interoperability-boundaries)
3. [Open-source Engineering Daily 003 — Manager 编排与 Handoff 表达不同的所有权模型](../../engineering/2026-08-02-manager-handoff-ownership-models)
4. [Research OS Engine Production Test V1——证据验证记录](../../../../research/production-tests/production-test-v1/REPORT.md)
