---
title: Digital Employee Architecture V0.2
outline: deep
---

# Digital Employee Architecture V0.2 / 数字员工架构 V0.2

> Governing architecture baseline / 纲领性架构基线  
> Status: Active Research Baseline / 状态：现行研究基线  
> Updated: 2026-07-31

## Executive definition / 核心定义

A Digital Employee is a persistent, software-defined organizational work unit. Externally it is represented by a **Position**; internally it is executed by a **managed work team**.

数字员工是组织内部一个由软件定义、持久存在的工作单元：对外表现为**岗位（Position）**，对内由**受管理的工作团队（Managed Work Team）**执行。

```text
Digital Employee
├── External contract: Position
└── Internal execution: Managed Work Team

数字员工
├── 对外契约：岗位
└── 对内执行：受管理工作团队
```

A model, prompt, Agent session, workflow, script, avatar, or tool may be an implementation component, but none alone defines a Digital Employee.

模型、Prompt、Agent 会话、工作流、脚本、拟人形象或工具都可以成为实现组件，但任何一个都不足以单独定义数字员工。

## Stable organizational contract / 稳定组织契约

The stable layer contains:

- position purpose and responsibility;
- allowed and prohibited work;
- Work Catalog;
- authority and permission boundaries;
- completion contract;
- evidence requirements;
- evaluation and lifecycle policy.

稳定层包括：岗位使命与职责、允许与禁止事项、工作目录、权限边界、完成契约、证据要求、评估与生命周期政策。

The execution layer remains replaceable:

- Agent and model providers;
- sessions and temporary teams;
- deterministic rules;
- Browser, Windows, API, source and file tools;
- runtime deployment strategy.

即使底层模型、Agent Provider、Session、工具或执行策略更换，岗位契约仍应保持有效。

## Object hierarchy / 对象分层

```text
Position
  → Work Catalog
    → WorkOrder
      → Plan
        ↔ Workflow
          → Operation Node
            → Semantic Action Plan
              → Tool Call
                → Run
                  → Outcome
```

- **Position** defines long-term responsibility.
- **WorkOrder** is one bounded request.
- **Plan** describes how this instance will be handled.
- **Workflow** is a governed, reusable method proven by real runs.
- **Operation Node** is the smallest business-meaningful and verifiable work unit.
- **Tool Call** is a low-level action and does not prove business success.
- **Outcome** is the governed business result.

岗位定义长期职责；WorkOrder 表示本次工作；Plan 是本次方案；Workflow 是经真实运行验证的可复用方法；Operation Node 是可验证的业务工作单元；Tool Call 只是底层动作；Outcome 才是受治理的业务结果。

## AI-native workflow / AI 原生工作流

A Digital Employee must avoid two extremes:

```text
Everything fixed → degenerates into RPA
Only a goal prompt → degenerates into an uncontrolled Agent
```

The intended middle ground is:

```text
Fixed boundaries, authority, state and completion contracts
+
Adaptive AI planning and execution inside those constraints
+
Reconstructable evidence, verification, recovery and publication gates
```

正确中间态是：固定职责、权限、状态与完成契约；AI 在约束内自主规划和执行；全过程留下可重建证据，并具有验证、恢复和发布门禁。

## Runtime boundary / Runtime 边界

**CodeFlowMu is the Digital Employee Runtime.** Cursor, Codex, OpenHands, model APIs and local models are replaceable Providers or adapters.

**CodeFlowMu 本身才是数字员工 Runtime。** Cursor、Codex、OpenHands、模型 API 与本地模型属于可替换 Provider 或 Adapter。

CodeFlowMu Runtime is responsible for:

- Work Manager / PM;
- Agent registry and sessions;
- task dispatch and FCoP lifecycle;
- workflow interpretation and node execution;
- timeout, retry, checkpoint and recovery;
- TeamPolicy and completion gates;
- Event Outbox and TMPA projection;
- observability, human gates and evaluation.

## TMPA and FCoP / TMPA 与 FCoP

```text
TMPA
  AI work data and governance architecture

FCoP
  Formal, coarse-grained coordination and responsibility protocol

CodeFlowMu
  Digital Employee development and work runtime
```

TMPA provides five unified work-data types: **Profile, Event, Message, Index, Knowledge**. It governs source, writer, time, version, evidence, verification, publication and knowledge promotion.

FCoP manages formal responsibility handoffs through TASK, REPORT, ISSUE, REVIEW and lifecycle transitions. It should not record every click or tool call.

Three recording levels remain distinct:

```text
Runtime Tool Trace     — debugging-level actions
TMPA Semantic Event    — business-meaningful facts
FCoP Coordination      — formal responsibility handoffs
```

## Completion model / 完成模型

A Runtime process finishing does not prove business correctness. Formal completion is a conjunction:

```yaml
completion:
  business_state: criteria_satisfied
  runtime_state: completed
  coordination_state: done
  publication_state: final
  verification_state: passed
  human_authority_state: satisfied_or_not_required
```

## Knowledge and learning / 知识与进化

Work experience does not directly overwrite formal knowledge.

```text
Run / Failure / EVAL
→ Knowledge or Workflow Candidate
→ Review and safe-data regression
→ Versioned publication
→ Governed Knowledge
```

自我学习必须采用候选、复核、回归、版本化与可回滚机制，避免把一次偶然经验固化成正式规则。

## SME-first economics / 中小企业优先与经济性

Persistent does not mean an LLM consumes tokens continuously. What remains persistent is the Position, identity, authority, work history, state, evidence, workflow versions, evaluation and cost records. Compute activates when work arrives.

评估应包括业务完成率、质量、证据完整度、返工、恢复、人工介入、API/Token 成本、节点成本与实际创造价值。

## Decisive engineering proof / 决定性工程证明

The architecture is proven only when the same CodeFlowMu Core can run both:

1. the existing Open Dev Team as a Software Development Digital Employee; and
2. a materially different business employee such as the Saige short-rental Digital Employee,

without adding business-specific role and workflow logic to Core.

只有同一 Core 能在不写入业务专用 Core 逻辑的前提下，同时运行软件开发岗位与赛格短租岗位，CodeFlowMu 才真正跨过“多 Agent 开发团队”到“数字员工引擎”的门槛。

## Open agenda / 待讨论议题

- minimum formal fields for Position, WorkOrder, Workflow, Node, Run and Outcome;
- WorkDataPort and Outbox interfaces;
- Provider capability negotiation and fallback;
- credential isolation and revocation;
- workflow promotion criteria;
- verifier isolation requirements;
- HOLD ownership and timeout;
- cost budgets and Registry requirements for SME deployments.

这些议题将通过工程证据、实施实验与显式版本更新逐项收口。
