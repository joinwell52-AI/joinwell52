---
title: 行业架构观察周报 002 — 企业软件正从记录系统走向执行系统
date: '2026-08-02'
column: industry-architecture
category: weekly
summary: Oracle、Salesforce 与 ServiceNow 正把 Agent 嵌入业务对象、工作流、权限、审批与审计，使企业软件从被动记录工作转向主动执行受治理结果。
sources:
  - Oracle Fusion Agentic Applications and AI Agent Studio
  - Salesforce Agentforce
  - ServiceNow Autonomous Workforce
outline: deep
cover: "/assets/covers/systems-of-record-to-execution-cover-v2.jpg"
---

<ArticleCover
  image="/assets/covers/systems-of-record-to-execution-cover-v2.jpg"
  kicker="行业架构 · 观察周报 002"
  title="企业软件正从记录系统走向执行系统"
  summary="Oracle、Salesforce 与 ServiceNow 正把 Agent 嵌入业务对象、工作流、权限、审批与审计。"
  version="IW002"
  status="发布于 2026-08-02"
  languageHref="/en/industry/2026-08-02-from-systems-of-record-to-systems-of-execution"
  languageLabel="English"
/>

## Summary

传统企业软件的核心职责是记录：客户、员工、财务、资产、流程状态和交易历史。Agentic Enterprise Software 正在增加第二种职责：在相同的数据、权限和工作流环境中主动执行工作。

Oracle 将 Fusion Agentic Applications 定义为由专门 Agent 团队支撑、能够使用 Fusion 业务对象、工作流、政策、审批和日志动作完成结果的应用；Salesforce Agentforce 将数据、业务逻辑、Skill、Workflow 与 Agent 执行整合为数字劳动力平台；ServiceNow Autonomous Workforce 则以有岗位、有权限和治理边界的 AI Specialist 执行端到端企业流程。

本报告的判断是：

> 企业软件不会被一个脱离业务系统的通用 Agent 层简单替代。更可能的方向，是 System of Record 与受治理的 System of Execution 在同一事务环境中结合。

## Source

本周入选三类官方材料：

1. **Oracle Fusion Agentic Applications / AI Agent Studio**：重点是 Agent 团队原生运行在 Fusion Applications 内部，继承业务对象、权限、工作流、审批与审计。
2. **Salesforce Agentforce**：重点是 Agent 使用 Data 360、CRM Metadata、Skill、Flow 和业务逻辑采取行动。
3. **ServiceNow Autonomous Workforce**：重点是 AI Specialist 以明确岗位、权限、政策、Trace 和人工升级完成端到端工作。

厂商对“第一”“无限劳动力”“全面自主”等市场语言不作为研究结论。本报告只分析其公开架构机制。

## Weekly Highlights

### 1. Agent 正在进入交易系统内部

Oracle 明确反对把 Agent 作为企业系统外部的附加层。Fusion Agentic Applications 直接针对 Fusion 业务对象、工作流、工具、政策和审批执行，并继承现有安全与审计。

Salesforce 也把 Agentforce 建立在企业数据、Metadata、Flow 和既有应用逻辑之上。ServiceNow 则把 AI Specialist 接入其工作流与企业记录系统。

行业正在从“Agent 调用几个 API”走向“Agent 成为业务系统内受治理的执行主体”。

### 2. 产品单位从 Agent 变成 Agentic Application 或 Workforce

Oracle 最新表达不是单个 Agent，而是由专门 Agent 团队、用户体验、Workflow、Tool、Policy、Approval 与 Runtime Asset 共同构成的 Agentic Application。

ServiceNow 使用 Autonomous Workforce 与 AI Specialist；Salesforce 使用 Digital Labor Platform。共同变化是：市场开始销售可完成业务结果的系统，而不是一个抽象 Agent Framework。

### 3. 确定性流程与概率智能开始组合

三个体系都没有把全部执行权交给模型：

- Oracle 保留业务对象、角色权限、审批和可审计动作；
- Salesforce 强调 Hybrid Reasoning、Flow、业务逻辑与安全；
- ServiceNow 将 AI Specialist 放入确定性 Workflow、政策和人工升级。

概率智能负责理解与判断，确定性系统负责权限、状态、交易和完成边界。

## Cross Analysis

### 三类企业执行平台对照

| 架构维度 | Oracle Fusion Agentic Applications | Salesforce Agentforce | ServiceNow Autonomous Workforce |
|---|---|---|---|
| 主要定位 | Fusion 内原生 Agentic Application | 企业数字劳动力平台 | 企业 AI Specialist 劳动力 |
| 核心数据上下文 | Fusion 业务对象、知识、API | Data 360、CRM 数据与 Metadata | ServiceNow 数据、CMDB、企业连接 |
| 工作执行 | Agent 团队 + Workflow + Tool | Reasoning + Skill + Flow + Action | Specialist + 确定性 Workflow |
| 权限基础 | Fusion Role-Based Access | Salesforce Trust、权限与业务逻辑 | Scope、Authority、Policy、Escalation |
| 人工介入 | 审批与业务流程节点 | Flow 与业务规则中的人工步骤 | 明确人工升级条件 |
| 审计与观察 | Logged Actions、Validation、Auditability | Observability、Security、业务记录 | Trace、Control Tower、Workflow History |
| 第三方连接 | Connector、API、第三方 Agent | 外部系统、MuleSoft 与开放连接 | 跨云、模型和系统编排 |
| 主要优势 | 事务系统原生执行 | CRM、数据和自动化整合 | Workflow、IT 治理和运行控制 |

**说明：** 此表为官方公开架构能力的定性整理，不是性能或市场份额评测。

### 从记录到执行的架构变化

```text
传统 System of Record
  数据 + 业务对象 + 权限 + 交易历史
                    ↓
            Agentic Execution Layer
  Reasoning + Skill + Tool + Workflow + Agent Team
                    ↓
         Governed Business Outcome
  Approval + Transaction + Evidence + Audit + Recovery
```

*图示：joinwell52 Research Center 综合 Oracle、Salesforce、ServiceNow 官方资料整理。*

### 结构化能力数据说明

| 可观察结构 | Oracle | Salesforce | ServiceNow |
|---|---:|---:|---:|
| 明确提到业务数据 / 对象 | 1 | 1 | 1 |
| 明确提到 Workflow / Flow | 1 | 1 | 1 |
| 明确提到权限或安全继承 | 1 | 1 | 1 |
| 明确提到人工审批 / 升级 | 1 | 1 | 1 |
| 明确提到审计 / 观察 | 1 | 1 | 1 |
| 明确支持多 Agent / 专门角色 | 1 | 1 | 1 |

`1` 表示官方材料明确公开该结构，不表示实现深度相同，也不代表独立验证通过。该表用于说明三种平台在关键企业执行构件上的结构性趋同。

## New Architecture Judgment

### 1. 企业 Agent 的长期壁垒在业务上下文，不只在模型

企业执行依赖长期积累的业务对象、角色权限、政策、审批、交易历史和审计。如果 Agent 脱离这些上下文，就必须重新构建整套企业控制结构。

### 2. Agentic Application 将比通用 Agent 更接近可购买产品

组织购买的是“完成招聘、审批采购、处理服务请求、推进销售流程”，而不是“拥有更多 Agent”。Agentic Application 以结果、流程和责任为边界，更容易形成真实产品。

### 3. System of Execution 必须保留确定性外壳

AI 可以提出计划、选择工具和处理例外，但权限、状态迁移、审批、交易提交、证据和完成判断仍需要确定性控制。

### 4. 原生集成与开放运行存在张力

原生平台提供最强上下文、安全和审计，但容易形成厂商绑定。开放 Runtime 更灵活，却必须自行解决身份、业务对象、权限、恢复和审计。面向中小企业的系统需要在两者之间找到最小可行平衡。

## Engineering Impact

### TMPA

本报告不直接修改 TMPA 出版物。它提供了一个重要研究输入：企业执行不只是 Message 或 Tool Call，而是围绕 Authority、Lifecycle、Reference、Event、Evidence 和 Governance Judgment 形成可重建工作记录。

### Digital Employee

数字员工应被包装为面向岗位和业务结果的 Agentic Work Application，而不是裸 Agent。最小组成包括：

```text
Position
+ Work Catalog
+ Workflow
+ Runtime
+ Tool / Skill
+ Authority
+ Human Escalation
+ Evidence / Evaluation
```

### CodeFlowMu

CodeFlowMu 的机会不是复制 Oracle、Salesforce 或 ServiceNow 的大型业务平台，而是提供独立、轻量、SME-first 的工作 Runtime，把外部业务系统、浏览器、Windows 操作和 API 统一纳入 WorkOrder、恢复、证据和完成门禁。

## Next Week Research

1. 研究 SAP Joule Agents 与 Microsoft Copilot Studio 的 Agentic Application 模式。
2. 比较原生事务系统和外置 Runtime 的恢复能力。
3. 定义 Agentic Application 的最小可移植契约。
4. 研究业务完成与 Agent 自报完成之间的差异。

## References

1. Oracle, **Oracle Introduces Fusion Agentic Applications**: https://www.oracle.com/uk/news/announcement/oracle-introduces-fusion-agentic-applications-2026-03-24/
2. Oracle, **AI-Native Builder Experience for Fusion Agentic Applications**: https://www.oracle.com/europe/news/announcement/oracle-introduces-ai-native-builder-experience-2026-07-14/
3. Oracle Documentation, **Overview of AI Agent Studio**: https://docs.oracle.com/en/cloud/saas/fusion-ai/26c/aiaas/overview.html
4. Oracle Documentation, **Key Capabilities of AI Agent Studio**: https://docs.oracle.com/en/cloud/saas/fusion-ai/26b/aiaas/key-capabilities.html
5. Salesforce, **Agentforce 360 Platform**: https://www.salesforce.com/platform/agentforce-platform
6. Salesforce, **Introducing Agentforce 2.0**: https://www.salesforce.com/news/press-releases/2024/12/17/agentforce-2-0-announcement/
7. ServiceNow, **Autonomous Workforce**: https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-launches-Autonomous-Workforce-that-thinks-and-acts-adds-Moveworks-to-the-ServiceNow-AI-Platform/default.aspx
8. ServiceNow, **AI Control Tower**: https://www.servicenow.com/products/ai-control-tower.html
