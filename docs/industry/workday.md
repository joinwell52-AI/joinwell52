---
title: Workday Agent System of Record — Architecture Analysis
outline: deep
---

# Workday Agent System of Record / Workday Agent 记录系统架构分析

## Positioning / 定位

Workday Agent System of Record (ASOR) provides a unified management and record layer for enterprise Agents, whether they are built by Workday, customers or partners.

Workday Agent System of Record 为企业内不同来源的 Agent 提供统一管理与记录层。它更接近数字劳动力控制面，而不是完整的工作执行 Runtime。

## Core management model / 核心管理模型

ASOR focuses on:

- ownership and organizational placement;
- role and skills;
- usage and observability;
- security and data access;
- cost and ROI;
- compliance and conformance;
- lifecycle and improvement;
- interaction telemetry.

Its strongest idea is that Agents should be governed with employee-like discipline and measured as investments rather than treated as invisible API calls.

## Architectural interpretation / 架构解读

```text
Agent or AI worker
        ↓ registered as
Persistent workforce record
        ├── owner
        ├── role and skills
        ├── authority and access
        ├── provider and deployment
        ├── telemetry and work history
        ├── cost and value
        ├── compliance
        └── lifecycle
```

This is a **control-plane** model. Execution may happen elsewhere, but the enterprise maintains durable identity, ownership and accountability.

## Strengths / 优势

1. Cross-provider visibility.
2. Persistent ownership and organizational placement.
3. Cost and ROI as governance data.
4. Lifecycle and compliance management.
5. Workforce-level telemetry rather than isolated Agent logs.

## Limitations / 局限

- It does not by itself define how a WorkOrder is planned, executed, recovered and proven complete.
- Its primary audience is a large enterprise with Workday infrastructure.
- “Agent” remains the recorded technical object; a stable Position contract may still need another layer.

## Lessons for CodeFlowMu / 对 CodeFlowMu 的启发

CodeFlowMu needs a **Digital Employee Registry** able to answer:

- Which Digital Employees exist?
- What Position does each one represent?
- Who owns it?
- What work may it accept?
- Which Providers, tools and credentials are bound?
- What is its current status?
- What has it completed?
- What did it cost?
- Is it operating within policy?

The Registry should remain separate from temporary Agent sessions. One persistent Digital Employee may use different providers and sessions over time.

## Proposed minimal registry / 建议最小名册

```yaml
digital_employee:
  id:
  position_ref:
  organizational_owner:
  runtime_deployment:
  team_policy_ref:
  provider_bindings:
  allowed_tool_refs:
  credential_refs:
  version:
  lifecycle_status:
  current_work_refs:
  cost_policy_ref:
  evaluation_summary_ref:
  evidence_index_ref:
```

This is a research projection, not a frozen implementation schema.

## TMPA relevance / 对 TMPA 的意义

Workday confirms that Profile, Index, Event and governance metadata must remain persistent across sessions. TMPA can supply portable work-data semantics, while CodeFlowMu supplies the execution Runtime.

## Strategic judgment / 战略判断

Workday is the strongest current benchmark for the **Digital Workforce Control Plane**. CodeFlowMu should combine a much lighter registry with its existing PM, FCoP and runtime execution capabilities.
