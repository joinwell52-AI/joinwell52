---
title: Weekly 002 — Digital Employee Control Plane and Work Runtime
outline: deep
---

# Weekly 002 / 研究周报第 002 期

> **Digital Employee Control Plane and Work Runtime**  
> **数字员工控制面与工作 Runtime 的分层**  
> Published: 2026-08-01

## Executive synthesis / 核心综合

The second issue moves from the basic definition of Digital Employee to a stronger engineering distinction:

```text
Digital Employee Control Plane
  identity, ownership, Position, authority, Registry,
  lifecycle, policy, cost, telemetry and evaluation

Digital Employee Work Runtime
  WorkOrder, planning, workflow, sessions, tools,
  checkpoint, recovery, evidence and completion
```

第二期研究将数字员工平台拆分为两个互补层次：控制面负责身份、所有权、岗位、权限、名册、生命周期、政策、成本与评估；工作 Runtime 负责接单、规划、工作流、Session、工具、恢复、证据与完成。

This separation is important because enterprise platforms often provide strong workforce control without an open lightweight work runtime, while Agent frameworks provide execution primitives without organizational control.

## Workday: control-plane benchmark / Workday：控制面对标

Workday Agent System of Record is the strongest current signal for workforce management. It treats Agents as governed enterprise resources and records:

- organizational owner;
- role and skills;
- usage and observability;
- security and data access;
- cost and ROI;
- compliance and conformance;
- lifecycle and improvement.

The lesson is not to copy Workday's enterprise stack. It is to make persistent identity, ownership, policy and economics first-class objects.

## OpenHands: operator workspace benchmark / OpenHands：操作工作空间对标

OpenHands Agent Canvas provides a useful engineering benchmark for:

- self-hosted Agent operation;
- skill and plugin visibility;
- connection health;
- manual, scheduled and event-triggered automation;
- desktop and operator console experience.

Its primary abstraction remains an Agent workspace. CodeFlowMu should learn the operational mechanisms while maintaining a Position-centric product model.

## Architectural judgment / 架构判断

```text
Organization
    ↓ defines
Position
    ↓ registered in
Digital Employee Control Plane
    ↓ issues
WorkOrder
    ↓ executed by
CodeFlowMu Work Runtime
    ↓ uses
Agent Providers + Tools + Rules + Humans
    ↓ produces
TMPA / FCoP governed Outcome
```

The Control Plane should not become a second execution engine. The Runtime should not silently own organizational policy. They exchange stable contracts.

## CodeFlowMu target / CodeFlowMu 目标结构

### Control plane

- PositionRegistry;
- DigitalEmployeeRegistry;
- owner and organizational placement;
- TeamPolicy and authority;
- credentials and access references;
- lifecycle and version;
- provider bindings;
- cost, SLA and evaluation records;
- compliance and audit views.

### Work runtime

- current PM as Work Manager;
- WorkOrder and Plan;
- WorkflowCatalog and OperationNodeCatalog;
- SessionManager and TaskDispatcher;
- Browser/Windows/Source/API tool ports;
- Checkpoint, retry and recovery;
- Event Outbox and TMPA Adapter;
- FCoP coordination;
- Business and Publication Completion Gates.

## SME-first constraint / SME-first 约束

Enterprise systems prove that governance is necessary, but their infrastructure is too heavy for many small organizations. CodeFlowMu should implement a coherent minimum:

- file-native or small-service deployment;
- a small number of persistent concepts;
- provider independence;
- explicit cost budgets;
- human authority without a large control-tower team;
- exportable evidence and indexes.

## Recommended engineering tasks / 建议工程任务

1. Define a minimal Position Registry view using existing Agent and Edition data.
2. Add ownership, status, version, provider, allowed tools and cost-policy fields as an experimental projection.
3. Keep existing PM/FCoP/Runtime behavior unchanged while the control-plane projection is validated.
4. Expose health, active work, HOLD, recovery and provider failure in one runtime console.
5. Use Open Dev Team as the first registered Digital Employee.
6. Validate the model with the Saige short-rental employee before building a full Studio.

## Research conclusion / 研究结论

The competitive space is no longer simply “which framework has more Agents.” The emerging system category is:

> **A governed workforce control plane connected to a reliable AI work runtime.**

CodeFlowMu's opportunity is to provide the lightweight, engineering-driven SME version of that category.
