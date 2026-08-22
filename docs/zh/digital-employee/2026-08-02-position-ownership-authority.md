---
title: 数字员工每日观察 001 — Agent 能力之前，先有岗位、所有权与权限
date: '2026-08-02'
column: digital-employee
category: daily
summary: Workday、ServiceNow 与 Microsoft 正在把 AI 工作者从一次性 Agent 转变为具有持久所有权、明确岗位、有限权限与生命周期治理的组织对象。
cover: "/assets/covers/position-ownership-authority-cover-v2.jpg"
sources:
  - Workday Agent System of Record
  - ServiceNow Autonomous Workforce
  - Microsoft Agent 365
outline: deep
---

<ArticleCover
  image="/assets/covers/position-ownership-authority-cover-v2.jpg"
  kicker="数字员工 · 每日观察 001"
  title="Agent 能力之前，先有岗位、所有权与权限"
  summary="数字员工首先是具有岗位、责任所有者和有限权限的组织对象；Agent 能力只是被绑定在这一契约之下的执行资源。"
  version="DD001"
  status="Research Note · 2026-08-02"
  languageHref="/en/digital-employee/2026-08-02-position-ownership-authority"
  languageLabel="English"
/>

# 数字员工每日观察 001 — Agent 能力之前，先有岗位、所有权与权限

## Summary

当前企业数字劳动力产品最强的共同信号，并不是又出现了一个更强的推理模型，而是管理对象正在从“没有组织身份的 Agent”转向“受管理的组织对象”。

Workday 强调注册、负责人、角色、权限、生命周期、成本和价值；ServiceNow 把 AI Specialist 放进明确岗位、技能任务、权限、工作流政策和人工升级中；Microsoft Agent 365 则提供 Agent Registry、Owner 分配、访问治理、激活、阻断与退役机制。

本次研究判断是：

> 数字员工首先应由岗位、责任所有者和有限权限定义。Agent 能力只是被绑定在这一组织契约之下的执行资源。

## Source

### 入选的官方资料

1. **Workday Agent System of Record**：入选原因是它把 Agent 放入混合劳动力体系，并明确注册、问责、可见性、权限、分析和生命周期管理。
2. **ServiceNow Autonomous Workforce**：入选原因是它明确从通用 Agent 转向有岗位、有技能、有交付物、有权限和升级条件的 AI Specialist。
3. **Microsoft Agent 365 治理文档**：入选原因是它提供了具体管理动作，包括 Registry、Owner 分配、激活、阻断、政策、访问治理和生命周期管理。

这些都是厂商官方资料，可以用于判断产品方向与已公开的管理机制；其中性能、规模和采用率等厂商声明，不能在缺少独立验证时直接视为外部实证。

## Observation

### 1. 管理对象正在变成持久对象

Workday 将 Agent System of Record 描述为统一注册和管理第一方、第三方 Agent 的位置，其生命周期覆盖注册、配置、激活和停用。单次 Session 结束后，Agent 仍然作为组织资源存在。

Microsoft 同样提供 Agent Registry，以及安装、激活、阻断、重新分配 Owner 和删除等治理动作。这说明企业中的 Agent 已经不再只是代码或聊天 Session。

### 2. 所有权正在成为必填项

Workday 追问：谁负责这个 Agent、它是什么角色、成本是多少、是否创造价值。Microsoft 把没有 Owner 的 Agent 明确视为治理缺口，并提供 Owner 分配能力；Microsoft Entra 又进一步提供 Agent Sponsor 与生命周期工作流。

所以 Owner 不是装饰性元数据，而是权限审批、风险处置、持续改进、停用和问责的入口。

### 3. 明确岗位与工作范围正在替代通用自主性

ServiceNow 的 Autonomous Workforce 以 AI Specialist 为单位，例如一级服务台 AI Specialist。它们有特定岗位、技能、任务、交付要求、政策和升级条件。产品表达不是“一个 Agent 什么都能做”，而是“一个受治理的 Specialist 完成某一类组织工作”。

Workday 也强调 Role-based Agent Support，即围绕职责与权限定义 Agent。

### 4. 权限边界被显式化

ServiceNow 把自主执行与工作流政策、可追踪性和人工升级绑定。Microsoft 使用权限、政策、Access Package、阻断和最小权限控制。Workday 区分 Agent 以自身身份执行，还是代表某个用户执行，并强调精确的身份与权限控制。

共同方向已经很清楚：有价值的自主性，是边界内的权限，不是无限制行动。

## Discussion

### 岗位应当成为第一组织抽象

Agent 说明谁来执行；岗位说明组织为什么允许这个执行体存在。

岗位可以定义：

- 工作目的；
- 责任范围；
- 可接受的工作类型；
- 可使用的工具和数据；
- 决策权限；
- 升级义务；
- 服务要求；
- 责任所有者；
- 证据与评估要求。

这些定义可以在模型、Provider、Session 或具体实现发生变化时保持稳定。

```text
组织
  ↓ 定义
岗位
  ↓ 实例化为
数字员工
  ↓ 绑定
Agent Provider + Skill + Tool + Runtime
```

若从 Agent 和 Prompt 开始，只会得到一个技术上能执行的对象，却没有稳定的组织理由、边界和责任人。

### 数字员工不等于单个 Agent

当前产品多数仍把 Agent 作为治理单位，但它们提出的治理要求实际上指向更高层抽象。一个数字员工可以在不同时间使用不同模型、临时 Session、下属 Specialist Agent、工具和人工审批，但仍代表同一个岗位。

```text
数字员工 ≠ 模型 Session
数字员工 ≠ Prompt
数字员工 ≠ 单一 Agent 进程

数字员工 = 持久的组织工作身份
```

### 岗位与 Owner 必须分开表达

岗位定义“存在什么工作”；Owner 定义“谁对这个数字员工持续负责”。二者不能合并为一个字段，否则岗位调整、责任转移和跨团队治理会变得困难。

最小 Registry 研究投影可以包括：

```yaml
digital_employee:
  id:
  position_ref:
  organizational_owner:
  responsibility_scope:
  authority_policy_ref:
  allowed_work_catalog_ref:
  escalation_policy_ref:
  lifecycle_status:
  runtime_binding_refs:
  evaluation_summary_ref:
```

这只是研究投影，不是冻结实施 Schema。

## Engineering Impact

### TMPA

本研究笔记不直接修改 TMPA 正式出版物。作为研究输入，它强化了组织角色、权限、责任、事件历史与治理判断之间需要显式 Reference 的必要性。

### Digital Employee

岗位、Owner、责任和权限应成为一等架构对象。数字员工定义不应从模型或 Agent 框架开始。

### CodeFlowMu

现有 PM、DEV、QA、OPS 可以被视为早期岗位定义。未来 Digital Employee Registry 应投影：

- 岗位身份；
- 人类或组织 Owner；
- 可接受的 WorkOrder 类型；
- 允许的 Tool 与 Provider；
- 升级与完成权限；
- 生命周期与评估状态。

第一步应是对现有 Runtime 事实建立只读投影，而不是立刻重写派发行为。

## Future Work

1. 定义最小 Position Contract。
2. 分离 Position、Digital Employee Instance、Agent Provider 与 Session 标识。
3. 定义 Owner 转移对活动 WorkOrder 的影响。
4. 对照 Workday、ServiceNow、Microsoft 的岗位权限模型与 CodeFlowMu 当前 TeamPolicy、FCoP 责任模型。
5. 明确数字员工进入生产前需要哪些激活证据。

## References

1. Workday，**Agent System of Record**：https://www.workday.com/en-us/artificial-intelligence/agent-system-of-record.html
2. Workday，**The Workday Agent System of Record Is Now Generally Available**：https://blog.workday.com/en-us/managing-ai-powered-future-of-work.html
3. Workday，**Understanding AI agents**：https://www.workday.com/en-us/topics/ai/ai-agents.html
4. ServiceNow，**ServiceNow launches Autonomous Workforce that thinks and acts**：https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-launches-Autonomous-Workforce-that-thinks-and-acts-adds-Moveworks-to-the-ServiceNow-AI-Platform/default.aspx
5. Microsoft Learn，**Microsoft Agent 365 overview**：https://learn.microsoft.com/en-us/microsoft-agent-365/overview
6. Microsoft Learn，**Govern agents using Agent 365**：https://learn.microsoft.com/en-us/training/modules/agent-365-govern/
7. Microsoft Learn，**Governance and lifecycle actions for agents**：https://learn.microsoft.com/en-us/microsoft-365/admin/manage/agent-actions?view=o365-worldwide
8. Microsoft Learn，**Protect agent identities with Microsoft Entra**：https://learn.microsoft.com/en-us/microsoft-agent-365/admin/capabilities-entra
