---
title: OpenHands Agent Canvas — Engineering Analysis
outline: deep
---

# OpenHands Agent Canvas / OpenHands 工程分析

## Engineering direction / 工程方向

OpenHands is evolving from a coding Agent project toward an operator-facing Agent workspace. Agent Canvas emphasizes self-hosting, skills and plugins, connection health, desktop packaging, automation triggers and multi-environment execution.

OpenHands 正从 Coding Agent 演进为面向操作者的 Agent 工作空间。Agent Canvas 强化自托管、Skill/Plugin、连接健康、桌面封装、自动触发与多环境执行。

## Runtime pattern / Runtime 模式

```text
Agent Harness
  + Skills and Plugins
  + Connection Health
  + Local / Remote Runtime
  + Manual / Scheduled / Event Trigger
  + Operator Console
```

The important lesson is that long-running AI work requires more than model capability. It needs deployment visibility, restartability, health state, tool packaging and human operation.

## Capabilities worth tracking / 值得跟踪的能力

- explicit skill installation and activation;
- plugin-content visibility;
- connection-health diagnostics;
- startup logs;
- desktop experience;
- scheduled and event-triggered automation;
- local, hosted and enterprise runtime options.

## What CodeFlowMu should learn / CodeFlowMu 应学习

1. **Connection health as a first-class state.** Provider and tool failures should be visible and actionable.
2. **Activation lifecycle.** Installing a Skill is different from activating and validating it.
3. **Operator diagnostics.** Startup, session and recovery logs should be understandable without reading raw runtime files.
4. **Multiple trigger modes.** Manual, scheduled and event-driven work should share one WorkOrder model.
5. **Self-hosted deployment.** SME adoption benefits from a local-first path.

## What CodeFlowMu should not copy / 不应照搬

- Agent workspace as the primary product abstraction;
- feature breadth without Position, ownership and completion contracts;
- coding-centric assumptions inside the general Core;
- one UI trying to expose every low-level backend concept.

## Differentiation / 差异化

```text
OpenHands primary abstraction:
Agent workspace and automation

CodeFlowMu target abstraction:
Position + WorkOrder + governed workflow + Runtime + evidence
```

OpenHands can potentially become an Agent Provider or execution harness beneath CodeFlowMu. The organizational Position, TeamPolicy, FCoP responsibility, TMPA evidence and completion gates should remain stable above it.

## Recommended CodeFlowMu response / 建议响应

- unify provider, tool, session and Agent health in the runtime console;
- expose restart, retry, release, switch-provider and recovery actions;
- display which Skill and version were actually loaded;
- retain semantic business events separately from low-level logs;
- avoid scheduling development solely to match OpenHands release lists.

## Strategic judgment / 战略判断

OpenHands is a high-value engineering benchmark for Agent operations. It is not yet a substitute for the Position-centric Digital Employee architecture pursued by CodeFlowMu.
