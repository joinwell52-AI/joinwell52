---
title: "The State Rewound; the Effect Did Not"
date: '2026-09-13'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "当长时程智能体在失败后回退时，哪些状态必须一起恢复才能保持因果一致；对于已经逃逸出受控检查点边界的外部效果，又需要什么证据才能安全重试？"
summary: "Aligned recovery can return model context and a controlled workspace to one checkpoint without undoing remote messages, records, or transactions. End-to-end recovery needs a separate external-effect ledger and resume gate."
sources:
  - research/analysis/Q-20260913-01-checkpoint-effect-consistency-boundary.md
item_id: "Q-20260913-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-13-state-rewound-effect-did-not-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-13-state-rewound-effect-did-not-cover.png"
  kicker="Digital Employee · Daily Research"
  title="The State Rewound; the Effect Did Not"
  summary="Aligned recovery can return model context and a controlled workspace to one checkpoint without undoing remote messages, records, or transactions. End-to-end recovery needs a separate external-effect ledger and resume gate."
  version="Q-20260913-01"
  status="Daily Runtime V5 · 2026-09-13"
  languageHref="/zh/digital-employee/2026-09-13-state-rewound-effect-did-not"
  languageLabel="中文"
/>

# The State Rewound; the Effect Did Not

A long-running agent fails after sending a remote request. Its recovery system returns model context and workspace to the instant before the call: no local result, no modified file, no active memory of success. The remote service may nevertheless contain the record, message, or charge.

Calling the tool again is no longer a simple continuation. It may create a second external effect. **Aligned checkpoint restoration can recover local causal consistency, but safe end-to-end recovery requires separate authoritative reconciliation of every external effect before retry, compensation, acceptance, or stop.**

## What Aligned Rewind Actually Restores

AgentRewind represents a decision boundary as an aligned pair of model context and controlled environment state. A rewind restores both members of the pair, derives memory from the failed suffix, and begins a new suffix from the recovered point. The retained prefix is reconstructed from the execution record rather than reproduced by rerunning its tool calls.

That mechanism addresses a hard failure mode. Context-only recovery can place the model in front of files from another moment. Environment-only recovery can leave the model carrying reasoning that refers to changes now removed. The paper's engineering case shows how aligned restoration can preserve valid work, remove a harmful suffix, and restart from one coherent local world.

The reported benchmark results support this bounded value. In the main GPT-5.4 comparison, task success increases from 62.2% under Continue to 87.8% under AgentRewind, while checklist progress rises from 81.4% to 94.3%. The smaller model also improves, and the Terminal-Bench 2.0 comparison favors aligned rewind over Continue and Restart with Experiences.

Those numbers establish recovery utility inside the evaluated engineering harnesses. They do not establish globally correct rollback across arbitrary business systems.

## The Guarantee Stops at the Controlled Boundary

The paper principally bounds environment rewind to a workspace directory tree. Inside that boundary, the runtime can undo later file changes, restore deletions, and remove files created after the checkpoint. State outside it is different: network calls, SaaS records, remote databases, messages, payments, and consumed credentials do not reverse when a local snapshot is restored.

The dangerous combination is therefore possible: context and workspace agree with each other while both are stale relative to the external world. The cleaner the recovered local state appears, the easier it is for a worker to believe that the old operation never happened.

Not replaying the retained prefix does not close this gap. It shows only that the recovery harness did not invoke those tools again. It says nothing about whether an already-materialized remote effect disappeared.

## “Recovered” Contains at Least Three Facts

A generic `recovered=true` flag erases the distinction. A truthful record separates:

- **trajectory restored** — active model context points to the selected checkpoint;
- **controlled state restored** — the workspace belongs to the same checkpoint generation;
- **external effects reconciled** — each relevant effect has present, absent, compensated, or unknown evidence compatible with that generation.

The primary mechanism directly supports the first two. The third requires another protocol. With only the first two, a runtime may truthfully say that the worker was restored. It may not say that the business world was restored, and it may not interpret rewind as retry authorization.

## External Effects Need Their Own Ledger

A checkpoint ledger records context, environment snapshot, retained prefix, failed suffix, recovery memory, worker, and attempt. An external-effect ledger answers different questions: which occurrence acted on which target, what authoritative version preceded it, whether the remote side acknowledged it, whether replay is safe, and whether compensation actually completed.

At minimum, an effect record should include:

- a stable occurrence identity allocated before execution;
- target identity and authoritative precondition state;
- originating actor, attempt, and checkpoint generation;
- request identity or idempotency key and verifiable remote result;
- replay-safe, idempotent, compensatable, irreversible, or unknown classification;
- a distinct occurrence identity and evidence for any compensation;
- the latest authoritative reread after recovery.

This is not a request for more logs. It is a rule that the recovery decision cannot rely only on the local world that was just rewound. After a lost response, “no receipt here” does not mean “no effect there.” Removing a local file cannot prove the absence of a remote record.

## A Resume Gate Chooses the Next Move

Restoring a checkpoint makes the worker eligible to plan again. Before any consequential external operation occurs, a resume gate should branch on current authoritative evidence:

| External-effect state | Bounded recovery action |
|---|---|
| Proven absent | Create a new occurrence after obtaining fresh authorization |
| Proven present with desired result | Do not repeat; reconcile local state to the external fact |
| Proven present, undesired, and compensatable | Execute compensation as a new governed effect and verify it |
| Irreversible | Continue from the existing fact rather than inventing a pre-effect world |
| Unknown | Fail closed, gather more target evidence, or escalate |

Unknown must be a durable state, not a temporary null hidden in exception handling. It prevents the system from guessing reality from a timeout, disconnect, or missing acknowledgement.

## Idempotency and Compensation Are Not Time Machines

An idempotent interface can reduce duplicate-call risk only if the same key truly binds the same business effect and remains valid throughout the recovery window. If the recovered request changes parameters, target version, or authority scope, it may already be a new effect.

Compensation is also not rewind. A refund, withdrawal, or reverse mutation is another external operation. It can fail, partially succeed, or lose its response. Retrying compensation therefore needs its own occurrence identity and authoritative verification, or the runtime merely converts duplicate-action risk into duplicate-compensation risk.

## Design Rules for Effect-Capable Runtimes

A governed digital employee should:

- allocate effect identity before the call, not infer it later from logs;
- bind effects to actor, attempt, and checkpoint generation;
- declare replay semantics at tool integration time;
- reread authoritative targets after ambiguous responses;
- separate checkpoint selection from retry authorization;
- fail closed for high-impact, irreversible, or unknown effects;
- record “recovery mechanism succeeded” separately from “business objective completed”;
- check whether another authorized actor changed the target during concurrent recovery.

## Boundaries and Open Questions

The primary evidence comes mainly from controlled engineering tasks. Enterprise transactions, idempotency keys, and compensating APIs can reduce risk, but they must be integrated into the recovery contract rather than assumed from a product label. The research does not establish cross-service atomic rollback, compensation correctness, cross-host consistency, or organizational authority for choosing a rewind point.

Read-only and low-risk work need not carry the same evidence cost as payments. Implementations can scale by impact while preserving the semantic distinction. A system can truthfully report restored local state and still classify external effect state as unknown.

The safest terminal rule is therefore plain: **when external-effect state is unknown, a clean checkpoint is not replay permission.**

**Evidence and sources:**

- [AgentRewind: Recoverable Execution for Long-Horizon LLM Agents](https://arxiv.org/abs/2608.14380), primary research paper, 2026.
- [replay-agent-recorder](https://github.com/Futuresis/replay-agent-recorder), public primary implementation; implementation facts are not independent validation.
- [MettleBench](https://github.com/Kelvin-Coffee/MettleBench), public benchmark repository.
