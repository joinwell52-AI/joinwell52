---
title: Digital Employee Architecture V0.2
outline: deep
---

<ArticleCover
  image="/assets/covers/digital-employee.svg"
  kicker="Governing Architecture"
  title="Digital Employee Architecture V0.2"
  summary="A position-centric architecture connecting organizational responsibility, governed workflows, CodeFlowMu Runtime, TMPA work data and FCoP coordination."
  version="V0.2"
  status="Active governing baseline"
  languageHref="/zh/digital-employee/architecture"
  languageLabel="简体中文"
/>

## Executive definition

A Digital Employee is a persistent, software-defined organizational work unit. Externally it is represented by a **Position**; internally it is executed by a **managed work team**.

```text
Digital Employee
├── External contract: Position
└── Internal execution: Managed Work Team
```

A model, prompt, Agent session, workflow, script, avatar or tool may be an implementation component, but none alone defines a Digital Employee.

## Stable organizational contract

The stable layer contains:

- position purpose and responsibility;
- allowed and prohibited work;
- Work Catalog;
- authority and permission boundaries;
- completion contract;
- evidence requirements;
- evaluation and lifecycle policy.

The execution layer remains replaceable: Agent Providers, models, sessions, temporary teams, deterministic rules and tools may change without redefining the Position.

## Object hierarchy

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
- **Workflow** is a governed reusable method proven by real runs.
- **Operation Node** is the smallest business-meaningful and verifiable work unit.
- **Tool Call** is a low-level action and does not prove business success.
- **Outcome** is the governed business result.

## AI-native workflow

A Digital Employee must avoid two extremes:

```text
Everything fixed → degenerates into RPA
Only a goal prompt → degenerates into an uncontrolled Agent
```

The intended middle ground combines fixed responsibility, authority, state and completion contracts with adaptive AI planning inside those constraints, plus reconstructable evidence, verification, recovery and publication gates.

## Runtime boundary

**CodeFlowMu is the Digital Employee Runtime.** Cursor, Codex, OpenHands, model APIs and local models are replaceable Providers or adapters.

The Runtime is responsible for:

- Work Manager / PM;
- Agent registry and sessions;
- task dispatch and FCoP lifecycle;
- workflow interpretation and node execution;
- timeout, retry, checkpoint and recovery;
- TeamPolicy and completion gates;
- Event Outbox and TMPA projection;
- observability, human gates and evaluation.

## TMPA and FCoP

```text
TMPA       — AI work data and governance architecture
FCoP       — formal, coarse-grained coordination protocol
CodeFlowMu — Digital Employee development and work runtime
```

TMPA provides five unified work-data types: **Profile, Event, Message, Index and Knowledge**. FCoP manages formal responsibility handoffs through TASK, REPORT, ISSUE, REVIEW and lifecycle transitions.

Three recording levels remain distinct:

```text
Runtime Tool Trace  — debugging-level actions
TMPA Semantic Event — business-meaningful facts
FCoP Coordination   — formal responsibility handoffs
```

## Completion model

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

## Knowledge and learning

Experience does not directly overwrite formal knowledge.

```text
Run / Failure / EVAL
→ Knowledge or Workflow Candidate
→ Review and safe-data regression
→ Versioned publication
→ Governed Knowledge
```

## SME-first economics

Persistent does not mean an LLM consumes tokens continuously. What remains persistent is Position, identity, authority, work history, state, evidence, workflow versions, evaluation and cost records. Compute activates when work arrives.

## Decisive engineering proof

The architecture is proven only when the same CodeFlowMu Core can operate both the current Open Dev Team and a materially different business employee, such as the Saige short-rental Digital Employee, without adding business-specific role order or workflow logic to Core.

## Open agenda

- minimum formal schemas;
- WorkDataPort and Outbox interfaces;
- provider capability negotiation;
- credential isolation and revocation;
- workflow promotion criteria;
- verifier isolation;
- HOLD ownership and timeout;
- cost budgets and Registry requirements for SME deployments.
