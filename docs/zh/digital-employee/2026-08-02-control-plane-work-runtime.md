---
title: 数字员工每日研究 002 — 控制面与工作 Runtime 是两个不同系统
date: '2026-08-02'
column: digital-employee
category: daily
summary: Workday、ServiceNow 与 Microsoft 正在把跨 Agent 治理和具体工作执行拆成两个层次，数字员工平台因此需要控制面与工作 Runtime。
sources:
  - Workday Agent System of Record and Agent Gateway
  - ServiceNow AI Control Tower and Autonomous Workforce
  - Microsoft Agent 365
outline: deep
---

# 数字员工每日研究 002 — 控制面与工作 Runtime 是两个不同系统

## Summary

当前企业产品正在逐渐形成两类不同的系统职责。

第一类是**控制面**：负责跨 Agent 的资产清单、身份、Owner、政策、访问、生命周期、风险、成本、可观测与合规。

第二类是**工作 Runtime**：负责接收工作、制定计划、执行工作流节点、调用工具、维护状态、升级、恢复、产出证据，以及判断工作是否完成。

Workday Agent System of Record、ServiceNow AI Control Tower 和 Microsoft Agent 365 更强地覆盖第一层；ServiceNow Autonomous Workforce 以及现有 Agent Runtime 则展示了第二层的一部分。

本次研究判断是：

> 数字员工平台必须同时具备控制面与工作 Runtime，但二者必须分开建模。治理资产清单不能替代工作执行，Agent Runtime 也不能替代组织治理。

## Source

### 入选的官方资料

1. **Workday Agent System of Record 与 Agent Gateway**：入选原因是其跨 Provider Registry、生命周期、身份权限、交互计量、分析、成本与问责模型。
2. **ServiceNow AI Control Tower**：入选原因是它把跨 Agent、模型、Workflow、Identity 和 MCP Server 的治理明确拆分为 Discover、Observe、Govern、Secure、Measure。
3. **ServiceNow Autonomous Workforce**：入选原因是它把 AI Specialist 接入确定性工作流、政策、Trace、人工升级和端到端执行。
4. **Microsoft Agent 365**：入选原因是它提供 Registry、Agent Map、生命周期、Owner、访问治理、安全和合规能力，并覆盖第一方与外部 Agent。

这些资料可以用于判断产品架构和厂商方向，但不能单独证明某种架构对所有组织都足够，也不能证明其成本结构适合中小企业。

## Observation

### 1. 企业治理正在跨越单一 Provider

Workday 表示第一方与第三方 Agent 都可以进入 Agent System of Record，并通过 Agent Gateway 被管理与计量。Microsoft Agent Registry 可以同步外部环境。ServiceNow AI Control Tower 则盘点第一方和第三方 Agent、模型、Identity、Workflow 和 MCP Server。

因此，治理层正在位于单一 Agent 框架或模型 Provider 之上。

### 2. 控制面管理生命周期与风险，不管理具体任务逻辑

三类平台共同覆盖的控制面能力包括：

- 注册与发现；
- Owner 分配；
- 身份与权限；
- 激活、阻断、停用和退役；
- 政策与合规；
- Runtime 监控；
- 成本与价值度量；
- Inventory 与关系图。

它们回答的是：部署了什么、谁负责、能访问什么、是否健康、是否应继续运行。

但它们没有完整回答：一个 WorkOrder 应如何拆分、执行、恢复、验证和关闭。

### 3. 工作执行需要确定性的工作流结构

ServiceNow 明确区分概率模型与企业对确定性结果的要求。其 AI Specialist 通过既有 Workflow 执行，使用组织知识，遵循政策，产生可追踪动作，并在需要人类权威时升级。

这说明执行层需要的不只是 Agent Identity，还需要状态迁移、Operation Contract、证据、升级、恢复与完成门禁。

### 4. 可观测性存在两个层次

控制面观察的是 Fleet 级事实：资产清单、安全姿态、性能、成本和政策一致性。

工作 Runtime 观察的是 Work 级事实：当前 WorkOrder、活动 Operation、Session 状态、Tool Result、Retry、Checkpoint、Evidence、Review 与 Completion Status。

如果把二者混为一套无差别日志，运营诊断和治理判断都会更困难。

## Discussion

### 建议的两层结构

```text
数字员工控制面
  身份
  岗位与 Owner
  Registry
  权限与访问政策
  Provider 与 Tool Binding
  生命周期
  Fleet Health
  成本与评估
  合规与审计视图

数字员工工作 Runtime
  WorkOrder Intake
  Plan 与 Workflow
  Operation Node
  Session 与 Tool
  Checkpoint 与 Retry
  Escalation 与 Recovery
  Evidence Production
  Review 与 Completion Gate
```

控制面判断某个执行身份是否被允许、是否适合继续运行；工作 Runtime 决定一项具体工作怎样推进。

### 为什么任何一层都不能替代另一层

只有 Registry、没有 Runtime，可以列出和治理 Agent，却不能可靠完成组织工作。

只有 Runtime、没有控制面，可以执行任务，却无法回答 Owner、生命周期、Agent Sprawl、访问、成本、政策和退役等企业问题。

因此：

```text
受治理的数字员工平台
= 控制面
+ 工作 Runtime
+ 二者之间的明确契约
```

### 两层之间的契约最关键

控制面应向 Runtime 下发有边界的执行上下文：

```yaml
execution_context:
  digital_employee_id:
  position_ref:
  work_order_ref:
  authority_snapshot_ref:
  allowed_tool_refs:
  provider_binding_ref:
  cost_policy_ref:
  evidence_policy_ref:
  escalation_policy_ref:
```

Runtime 应返回结构化事实：

```yaml
execution_result:
  lifecycle_events:
  tool_and_session_events:
  evidence_refs:
  cost_usage_ref:
  evaluation_ref:
  completion_judgment:
  unresolved_escalations:
```

这样，即使 Runtime 的实现发生变化，治理层仍然可以保持稳定。

### SME-first 的含义

Workday、ServiceNow 与 Microsoft 都假设企业已经拥有相当重的基础设施。CodeFlowMu 不应在验证一个完整数字员工生命周期之前，先复制一套大型 Control Tower。

面向中小企业的最小完整系统应包括：

- 小型持久 Registry；
- 明确 Owner 与 Position；
- Tool / Provider Binding；
- 轻量政策检查；
- Runtime Health 与 Recovery View；
- Evidence 与 Cost Projection；
- 人类保留激活、例外和发布权威。

## Engineering Impact

### TMPA

本研究笔记不直接修改 TMPA 正式出版物。它提供的研究输入是：治理记录与运营执行应分层，同时必须通过 Reference 保持可重建关系。

### Digital Employee

架构应明确把 Control Plane 与 Work Runtime 定义为两个层次，并通过稳定契约连接。Position 与 Lifecycle 主要属于控制面；WorkOrder 执行与 Evidence Production 主要属于 Runtime。

### CodeFlowMu

CodeFlowMu 已经包含大量 Work Runtime 能力：

- PM 编排；
- Task 与 Report 生命周期；
- Session 管理；
- Skill 与 Tool；
- Retry、HOLD、Wake 与 Recovery；
- FCoP 协作；
- Evidence 与 Completion Gate。

下一步安全做法不是替换现有 Runtime，而是在其上方增加轻量、只读的 Control Plane Projection：

1. 把当前 Open Dev Team 注册为第一个数字员工；
2. 注册 PM、DEV、QA、OPS 的岗位定义；
3. 展示 Provider、Tool、Session、Lifecycle、Cost 和 Health Binding；
4. 验证期间保持现有 Runtime 行为不变；
5. 后续再把政策检查放到 WorkOrder Admission 和 Tool Invocation 边界。

## Future Work

1. 定义最小 Control Plane 数据模型。
2. 把现有 CodeFlowMu Runtime 事实逐项归类为 Control Plane 或 Work Runtime。
3. 定义 Registry 到 WorkOrder 的 Admission Contract。
4. 定义审计和回放必须保存的 Policy Snapshot。
5. 比较 Fleet-level Observability 与 Task-level Observability。
6. 使用一个非开发类数字员工案例验证两层模型。

## References

1. Workday，**Agent System of Record**：https://www.workday.com/en-us/artificial-intelligence/agent-system-of-record.html
2. Workday，**The Workday Agent System of Record Is Now Generally Available**：https://blog.workday.com/en-us/managing-ai-powered-future-of-work.html
3. Workday，**CIO Buyer Guide to an AI-ready HR and Finance Platform**：https://www.workday.com/en-us/topics/it/cio-buyers-guide.html
4. ServiceNow，**AI Control Tower**：https://www.servicenow.com/products/ai-control-tower.html
5. ServiceNow，**ServiceNow expands AI Control Tower**：https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-expands-AI-Control-Tower-to-discover-observe-govern-secure-and-measure-AI-deployed-across-any-system-in-the-enterprise/default.aspx
6. ServiceNow，**ServiceNow launches Autonomous Workforce that thinks and acts**：https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-launches-Autonomous-Workforce-that-thinks-and-acts-adds-Moveworks-to-the-ServiceNow-AI-Platform/default.aspx
7. Microsoft，**Microsoft Agent 365**：https://www.microsoft.com/microsoft-agent-365
8. Microsoft Learn，**Microsoft Agent 365 overview**：https://learn.microsoft.com/en-us/microsoft-agent-365/overview
9. Microsoft Learn，**Registry sync in the Microsoft 365 agent registry**：https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-registry
10. Microsoft Learn，**Manage the agent lifecycle**：https://learn.microsoft.com/en-us/agents/center-of-excellence/agent-lifecycle
