---
title: 行业架构观察周报 001 — 企业 Agent 治理控制面正在形成
date: '2026-08-02'
column: industry-architecture
category: weekly
summary: Workday、ServiceNow 与 Microsoft 正在形成相似的企业 Agent 治理控制面：统一发现和注册、明确 Owner、管理权限与生命周期、持续观察风险，并衡量成本与价值。
sources:
  - Workday Agent System of Record
  - ServiceNow AI Control Tower
  - Microsoft Agent 365
outline: deep
cover: "/assets/covers/enterprise-agent-governance-control-plane-cover-v2.jpg"
---

<ArticleCover
  image="/assets/covers/enterprise-agent-governance-control-plane-cover-v2.jpg"
  kicker="行业架构 · 观察周报 001"
  title="企业 Agent 治理控制面正在形成"
  summary="Workday、ServiceNow 与 Microsoft 的共同方向：发现、注册、治理、安全、观察与价值衡量。"
  version="IW001"
  status="发布于 2026-08-02"
  languageHref="/en/industry/2026-08-02-enterprise-agent-governance-control-plane"
  languageLabel="English"
/>

## Summary

本周最重要的行业架构信号，不是某个 Agent 的推理能力再次提高，而是企业开始建设位于模型、Agent Framework 和业务应用之上的统一治理控制面。

Workday 将 AI Agent 纳入混合劳动力的 System of Record；ServiceNow 将 AI Control Tower 扩展为发现、观察、治理、安全和衡量五个维度；Microsoft Agent 365 则通过 Agent Registry、Entra、Purview 和生命周期动作，把跨平台 Agent 纳入统一管理。

本报告的判断是：

> 企业 Agent 治理正在从分散的产品设置，演进为独立的控制平面。其核心对象不是 Prompt，而是可发现、可归属、可授权、可观察、可停用和可衡量的组织资产。

## Source

本周入选三组官方资料：

1. **Workday Agent System of Record（ASOR）**：提供统一 Agent 清单、生命周期、责任、权限、交互计量与价值分析。
2. **ServiceNow AI Control Tower**：把跨平台 AI 资产治理分为 Discover、Observe、Govern、Secure、Measure 五个维度。
3. **Microsoft Agent 365**：通过 Agent Registry、Registry Sync、Owner、访问治理、激活、阻断和退役，形成企业 Agent 管理面。

这些资料主要用于判断厂商公开的产品架构。厂商披露的客户规模、市场覆盖和价值提升属于厂商主张，不能替代独立实证。

## Weekly Highlights

### 1. Agent Registry 成为共同起点

三个体系都首先解决“组织里到底有哪些 Agent”。

- Workday ASOR 注册 Workday、客户和第三方 Agent；
- ServiceNow AI Control Tower 自动发现 Agent、模型、Identity、Workflow、MCP Server 和其他 AI 资产；
- Microsoft Agent Registry 可以同步外部 Agent 环境，形成集中可见性。

这说明企业 Agent 治理的第一步不是编排，而是资产发现与身份建立。

### 2. Owner 与生命周期进入正式治理

Workday 将 Agent 生命周期描述为 register、configure、activate、deactivate，并强调责任与问责。Microsoft 提供 Owner 分配、安装、激活、阻断、重新分配和删除等动作。ServiceNow 则把 AI Asset Owner、风险团队和 AI Steward 放进统一控制流程。

Agent 因此开始像服务账户、应用和员工岗位一样，拥有持续存在的治理状态。

### 3. 运行期观察替代一次性审核

ServiceNow 明确把持续观测、实时指标、行为 Trace 和告警放进控制面；Workday 通过 Agent Gateway 对交互进行管理和计量；Microsoft 将身份、数据与威胁防护延伸到 Agent。

治理正在从“上线前审批”转向“上线前验证 + 运行中持续判断”。

## Cross Analysis

### 三个平台的控制面能力矩阵

| 能力维度 | Workday ASOR | ServiceNow AI Control Tower | Microsoft Agent 365 |
|---|---|---|---|
| 统一清单 / Registry | 第一方、第三方 Agent | Agent、模型、Identity、Workflow、MCP 等 | 第一方与外部 Agent Registry |
| Owner / 责任 | 强调角色、责任与问责 | AI Asset Owner、Steward 与风险流程 | Owner 分配与重新分配 |
| 生命周期 | 注册、配置、激活、停用 | 发现、评估、治理与处置 | 安装、激活、阻断、删除 |
| 权限与身份 | 精确身份与权限，Agent Gateway | Identity Access Governance、最小权限、Kill Switch | Entra 身份、Access Package、策略 |
| 运行观察 | Interaction Metering 与 Analytics | Runtime Trace、指标、告警与行为观察 | Agent Map、风险与安全监控 |
| 成本与价值 | 成本、影响与动态 ROI | 成本跟踪与 ROI Dashboard | 重点偏治理、安全与合规 |
| 主要组织入口 | HCM / Finance / Blended Workforce | IT Governance / CMDB / Workflow | Microsoft 365 / Entra / Purview |

**说明：** 表格依据三家官方公开能力整理，不代表独立性能评测，也不表示各项能力成熟度相同。

### 控制面共同结构

```text
企业中的 Agent、模型与运行环境
              ↓
      Discover / Register
              ↓
 Identity + Owner + Position
              ↓
 Policy + Access + Lifecycle
              ↓
 Observe + Risk + Cost + Value
              ↓
  Block / Retire / Improve / Audit
```

*图示：joinwell52 Research Center 根据官方资料整理。*

### 控制面不等于工作 Runtime

三家平台都在加强治理，但控制面主要回答：

- 有哪些 Agent；
- 谁负责；
- 有什么权限；
- 是否合规；
- 当前风险、成本和价值如何；
- 是否应该激活、阻断或退役。

它并不完整回答某个 WorkOrder 如何被拆解、执行、恢复、举证和完成。因此，控制面与工作 Runtime 应分开建模，通过稳定契约连接。

## New Architecture Judgment

本周形成四个架构判断：

1. **Agent Registry 将成为企业 AI 基础设施。** 没有清单就无法治理跨平台 Agent。
2. **Owner 是治理链的入口。** Owner 连接审批、权限、风险处置、成本和停用责任。
3. **身份与权限必须独立于模型 Provider。** Agent 可能更换模型与运行环境，但组织身份不能随 Session 消失。
4. **持续观察将成为正式治理条件。** 静态合规文件不能替代运行时 Trace、行为和风险状态。

## Engineering Impact

### TMPA

本报告不直接修改 TMPA 正式文档。作为研究输入，它强化了 Profile、Authority、Lifecycle、Event、Integrity 与 Governance Judgment 之间必须存在可追溯 Reference 的必要性。

### Digital Employee

数字员工控制面至少需要：

- Registry；
- Position 与 Owner；
- Authority Policy；
- Lifecycle；
- Provider / Tool Binding；
- Runtime Health；
- Cost / Value / Evaluation；
- Audit 与处置动作。

### CodeFlowMu

CodeFlowMu 当前具备较强的 Work Runtime 事实，但缺少独立控制面。合理顺序是先建立只读 Registry 投影，再逐步加入 Owner、生命周期、权限和健康处置，而不是重写现有任务执行链。

## Next Week Research

1. 对照 SAP、Oracle、Salesforce 的 Agent Builder 与运行治理。
2. 研究控制面和 Runtime 之间的最小接口。
3. 比较企业平台中的 Kill Switch、人工升级和恢复策略。
4. 继续验证中小企业是否需要完整 Control Tower，或只需要最小治理平面。

## References

1. Workday, **Agent System of Record**: https://www.workday.com/en-us/artificial-intelligence/agent-system-of-record.html
2. Workday, **The Workday Agent System of Record Is Now Generally Available**: https://blog.workday.com/en-us/managing-ai-powered-future-of-work.html
3. Workday, **What are AI agents?**: https://www.workday.com/en-us/topics/ai/ai-agents.html
4. ServiceNow, **AI Control Tower**: https://www.servicenow.com/products/ai-control-tower.html
5. ServiceNow, **AI Control Tower expands across the enterprise**: https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-expands-AI-Control-Tower-to-discover-observe-govern-secure-and-measure-AI-deployed-across-any-system-in-the-enterprise/default.aspx
6. Microsoft Learn, **Microsoft Agent 365 overview**: https://learn.microsoft.com/en-us/microsoft-agent-365/overview
7. Microsoft Learn, **Registry sync in the Microsoft 365 agent registry**: https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-registry
8. Microsoft Learn, **Govern agents using Agent 365**: https://learn.microsoft.com/en-us/training/modules/agent-365-govern/
