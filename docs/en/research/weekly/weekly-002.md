---
title: Weekly 002 — Digital Employee Control Plane and Work Runtime
date: '2026-08-01'
column: digital-employee
category: weekly
summary: A synthesis of Workday Agent System of Record, OpenHands Agent Canvas, and the engineering direction of CodeFlowMu.
outline: deep
---

<ArticleCover
  image="/assets/covers/weekly-002.svg"
  kicker="Weekly Research · 002"
  title="Digital Employee Control Plane and Work Runtime"
  summary="A synthesis of Workday Agent System of Record, OpenHands Agent Canvas, and the engineering direction of CodeFlowMu."
  version="W002"
  status="Published 2026-08-01"
  languageHref="/zh/research/weekly/weekly-002"
  languageLabel="简体中文"
/>

## Executive synthesis

The second weekly report moves from defining a Digital Employee to separating two system layers:

```text
Digital Employee Control Plane
  identity, ownership, Position, authority, Registry,
  lifecycle, policy, cost, telemetry and evaluation

Digital Employee Work Runtime
  WorkOrder, planning, workflow, sessions, tools,
  checkpoint, recovery, evidence and completion
```

Enterprise platforms tend to provide strong workforce control but depend on heavy infrastructure. Agent frameworks provide execution primitives but usually lack organizational ownership, completion authority and lifecycle governance. CodeFlowMu should connect a lightweight control plane to its existing work runtime.

## Workday as the control-plane benchmark

Workday Agent System of Record treats Agents as governed enterprise resources. The important fields are not only model name and prompt, but also:

- organizational owner;
- role and skills;
- authority and data access;
- provider and deployment;
- usage, telemetry and work history;
- cost and value;
- compliance and lifecycle.

The engineering lesson is persistent identity. A Digital Employee must survive provider changes, temporary sessions and individual runs.

## OpenHands as the operator-workspace benchmark

OpenHands Agent Canvas demonstrates the operational layer required around an Agent:

- visible skills and plugins;
- connection-health diagnostics;
- startup and runtime logs;
- local, remote and hosted execution;
- manual, scheduled and event-triggered automation;
- an operator-facing workspace.

CodeFlowMu should learn these mechanisms without changing its primary abstraction from Position to generic Agent workspace.

## Target architecture for CodeFlowMu

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

### Control plane

- PositionRegistry;
- DigitalEmployeeRegistry;
- ownership and organizational placement;
- TeamPolicy and authority;
- provider, tool and credential bindings;
- lifecycle and version;
- cost, SLA and evaluation records;
- compliance and audit views.

### Work runtime

- PM as the current Work Manager;
- WorkOrder, Plan and Workflow;
- Operation Nodes;
- SessionManager and TaskDispatcher;
- Browser, Windows, Source and API tools;
- checkpoint, retry and recovery;
- Event Outbox and TMPA projection;
- FCoP coordination;
- business and publication completion gates.

## SME-first constraint

The goal is not to reproduce an enterprise AI control tower. The minimum coherent product should remain local-first or small-service deployable, provider-independent, cost-aware, human-governed and capable of exporting evidence.

## Recommended engineering sequence

1. Project the current Open Dev Team as the first registered Digital Employee.
2. Add owner, Position, version, provider, allowed tools, lifecycle state and cost policy as a read-only Registry projection.
3. Keep current PM/FCoP/Runtime behavior unchanged while the projection is validated.
4. Unify provider, tool, session, HOLD and recovery health in one console.
5. Validate the model with the Saige short-rental Digital Employee before building a full Studio.

## Conclusion

The emerging system category is not “a framework with more Agents.” It is:

> **A governed workforce control plane connected to a reliable AI work runtime.**

CodeFlowMu’s opportunity is to implement the lightweight, engineering-driven SME version of this category.
