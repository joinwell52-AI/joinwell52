---
title: 'Weekly 009 — Completion Must Be Typed: One Green Check Cannot Close the Whole System'
date: '2026-09-13'
column: digital-employee
category: weekly
article_type: research-brief
edition: research-center
research_question: 'When an agent system reports completed, recovered, verified, or audited, how do we identify which uncertainty was actually closed and which state must remain independently open?'
summary: 'Fourteen published Daily Research notes from September 7 through 13 repeatedly show that a local terminal state cannot be promoted into a global terminal state. This brief proposes Typed Closure: State, Authority, Effect, and Coverage need separate closure evidence, while Unknown must remain a valid durable state.'
sources:
  - 2026-09-07 through 2026-09-13 Daily Runtime V5 evidence-validated publications
  - research/intelligence/p2-runs/2026/09/2026-09-13-p2-special.json
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
cover: '/assets/covers/weekly-009-typed-closure-cover-v2.webp'
---

<ArticleCover
  image="/assets/covers/weekly-009-typed-closure-cover-v2.webp"
  kicker="Weekly Research · 009"
  title="Completion Must Be Typed: One Green Check Cannot Close the Whole System"
  summary="State, authority, external effects, and coverage each need their own terminal evidence."
  version="W009"
  status="Published 2026-09-13"
  languageHref="/zh/research/weekly/weekly-009"
  languageLabel="中文"
/>

# Weekly 009 — Completion Must Be Typed: One Green Check Cannot Close the Whole System

An agent has been restored to an earlier checkpoint. Is recovery complete? An audit reached its terminal state. Is coverage sufficient? A report passed generation and review checks. Has its conclusion been independently challenged? A tool call returned successfully. Has its external effect actually been established?

This week's Daily Research approached these questions from very different systems and repeatedly reached the same answer: **the most visible green state is not enough.**

From September 7 through 13, the Research Center published fourteen Daily Research notes covering multi-agent governance, memory migration, team coordination, cross-boundary side effects, tool execution evidence, independent review, procedures and authority, durable state, checkpoint recovery, and large-scale auditing. They are not rewrites of one topic. Yet they expose one recurring structural failure:

> **A system closes one kind of uncertainty and silently treats every related uncertainty as closed.**

Weekly 008 argued that authority is a relation rather than an object attribute. This week pushes the distinction further. **Completion itself should not be compressed into an untyped Boolean.** A reliable runtime needs to know which fact has reached closure and which fact remains unknown.

## Evidence window: seven dates, six published days, fourteen research notes

This synthesis checked Daily Runtime evidence from **September 7 through September 13, 2026**. Publication has durable `Completed` results for September 7, 8, 9, 10, 12, and 13, producing **14** Research Center notes. On September 11, Discovery, Queue, Reading, Analysis, and Production are complete, but Publication remains `Running` in the current authoritative Runtime record. No September 11 unpublished candidate is therefore treated as published evidence in this brief.

| Date | Published research | Reusable boundary |
|---|---|---|
| 9/7 | Local Safety Does Not Close the Path; Visibility Is Not Enforcement; Project Truth Survives Context | Local safety, visibility, and context continuity cannot substitute for an end-to-end execution closure |
| 9/8 | Memory Must Be Readmitted; Role Match Is Not Team Fit; One Effect Across Surfaces | Stored data, role matching, and interface consistency each require separate semantic, coordination, or effect evidence |
| 9/9 | Tool Edge Needs Execution Evidence; Finished Report Needs Challenge Evidence | A tool boundary needs occurrence evidence; report completion does not establish challenge completion |
| 9/10 | Second Model Is Not Independent Control; Proposed Procedure Is Not Active Authority | Another model call is not automatically independent review; a procedure's existence is not active authority |
| 9/11 | Not counted as published evidence | Publication is not closed in the authoritative Runtime record |
| 9/12 | Evidence Complete Is Not Execution Authority; Retained State Needs Current Authority | Complete evidence and retained state still do not substitute for current execution admission |
| 9/13 | State Rewound, Effect Did Not; Audit Completion Is Not Coverage Assurance | Local rollback does not reverse remote effects; audit termination does not prove adequate coverage |

The September 11 gap is itself consistent with the thesis: the passage of calendar time does not authorize us to rewrite an unfinished Publication state into a completed one. Evidence windows have boundaries too.

## What exactly did `Completed` close?

Traditional software often compresses a process into a few terminal states such as `success`, `failed`, or `done`. Inside a deterministic and closed boundary, that can be sufficient because the program knows what it observed and where its effects live.

Agent systems routinely cross model context, filesystems, remote APIs, approval chains, memory stores, audit corpora, and human responsibility boundaries. A module reaching a terminal state can only establish closure for the class of fact that module is able and authorized to observe.

This week's research can be organized into four frequently confused closure types:

```text
State Closure
Authority Closure
Effect Closure
Coverage Closure
```

They interact, but none is a substitute for another.

## State Closure: stable state does not mean admitted state

September 8's memory-migration research provides a clean counterexample. Old memory can remain byte-complete, parseable, and even dimensionally compatible after a model, writer, reader, or embedding change, while the semantic contract has changed.

"The data still exists" is therefore a State Closure fact. To make that memory authoritative in a new runtime, the system still needs semantic-compatibility evidence, a recovery path, and an activation decision.

The September 12 retained-state study generalizes the boundary: **persistence establishes continuity, not current authority.** State may survive a restart, but a change in policy, target, principal, or occurrence can require fresh admission before the retained state may drive another action.

A runtime should therefore resist collapsing everything into:

```text
state = restored
```

It may need to preserve:

```text
state_integrity = closed
semantic_compatibility = ?
authority = ?
```

Those question marks are not software defects. They are facts the system has not yet obtained.

## Authority Closure: a procedure, an approving model, or a complete evidence bundle is not active permission

Two September 10 studies show the distinction from different directions.

The first asks why a second model is not automatically an independent control. If it consumes the same narrative, shares the same information path, or lacks an independent responsibility boundary, an additional model call produces another judgment, not necessarily independent supervision.

The second asks why a proposed procedure is not active authority. A policy or procedure can be complete on paper, while activation still depends on who may adopt it, what targets it governs, when it takes effect, and which policy epoch recognizes it.

September 12's Evidence Complete Is Not Execution Authority adds a third form: even a complete evidence bundle does not let a system jump from "the evidence is sufficient" to "the action may execute." Evidence supports a decision; it is not the decision itself.

Authority Closure answers a deliberately narrow question:

> May this principal, under the current policy and occurrence, execute this action against this target now?

That is not the same state as report completion, procedure existence, or model agreement.

## Effect Closure: internal state can go backward while the world does not

September 13's State Rewound, Effect Did Not exposes one of the most dangerous closure errors.

Aligned checkpoints can restore model context and a controlled workspace to the same historical point. That is valuable recovery. But a network request, remote database write, message, payment, or consumed resource may already have escaped the checkpoint boundary.

The system can therefore look internally clean while being externally inconsistent:

```text
local_state = before_call
remote_effect = already_happened
```

If the runtime observes only State Closure, the next call may be mistaken for a first execution. Safe recovery requires separate Effect Closure evidence: the original effect is proved absent, proved present and acceptable, verified as compensated, irreversible, or still unknown.

This suggests a separate effect ledger carrying occurrence identity, target, request identity, idempotency key, remote receipt, compensation identity, and a current authoritative read. **A missing response is not proof that the effect did not happen; rolling back a local file is not proof that a remote fact was reversed.**

## Coverage Closure: the audit finished, but did it look everywhere it claimed to cover?

Audit Completion Is Not Coverage Assurance studies a different system with the same structure.

An audit may terminate without runtime errors and still miss relevant evidence that never entered its search scope. `Completed` proves completion of the configured process; it cannot prove that the evidence universe was adequately covered.

Coverage Closure needs durable facts of its own: source and time boundaries, funnel identity, stage counts, known-positive recall, rejected-sample evidence, unreadable records, semantic-review identity, and what an independent reviewer actually completed.

This also explains September 9's Finished Report Needs Challenge Evidence. A report can close its writing state while the status of adversarial testing, alternative explanations, and independent challenge remains separate.

A more truthful audit result may be:

```text
execution = completed
coverage = bounded
residual_unknown = explicit
```

rather than an unsupported `coverage = complete`.

## Why one global status creates semantic escalation

Compressing these closures into `done=true` creates three recurring errors.

First is **scope expansion**: evidence about a local boundary is silently promoted into evidence about the whole system. A local safety check passes, therefore the entire path is called safe.

Second is **responsibility drift**: a component that merely records state starts making decisions that belong to an authority owner, effect reconciler, or audit reviewer.

Third is **erasure of unknowns**: the runtime loses the ability to distinguish "proved absent" from "not observed," or "effect did not happen" from "effect status unknown."

Agent runtimes need fewer ambiguous green icons and more precise meanings for each one.

## A practical Typed Closure Envelope

The week's evidence supports a simple engineering abstraction: preserve a **Typed Closure Envelope** for consequential work instead of a single terminal bit.

```text
TypedClosure {
  state:     Open | Closed | Unknown
  authority: Open | Closed | Unknown
  effect:    Open | Closed | Unknown
  coverage:  Open | Closed | Bounded | Unknown

  evidence_refs[]
  policy_epoch
  occurrence_id
  updated_at
}
```

The same mechanism should not close all four dimensions. Each dimension should be closed by a mechanism that can observe the relevant facts and carries responsibility for that boundary:

- State is supported by persistence and consistency evidence.
- Authority is decided by the current authorization boundary and accountable authority holder.
- Effect is established from authoritative target evidence or governed compensation.
- Coverage is supported by scope, funnel, sampling, known-positive, and independent-review evidence.

Not every task needs all four dimensions. The principle is narrower: **one closure type must not be silently reinterpreted as another.**

## Unknown must be allowed to persist

Agent systems often treat Unknown as an exception that should quickly be collapsed into True or False. This week's recovery and audit evidence shows why that can be unsafe.

After an external call times out, the side effect may be unknown. After an audit funnel ends, residual relevant records may be unknown. After a model migration, semantic equivalence of old memory may be unknown.

Without enough evidence, these states should remain Unknown. Unknown can trigger more evidence gathering, human adjudication, a reduced operating scope, or fail-closed behavior. It should not be guessed away merely because an API wants a Boolean.

**Preserving Unknown is itself a governance capability.**

## P2: no manufactured special study this week

Four `biweekly-or-release` P2 objects were due this week: agent-audit, Aegis, agent-style, and cs-paper-checklist. Their main/release identities are unchanged from the September 6 checkpoints, so all four close as `No Material Change`. The two monthly objects completed their September full reviews on September 6 and are not due again this week.

Coverage is **4/4 due objects resolved, zero objects at or above the trigger threshold of 5, and zero full Special Studies started.** This is not missing output; it is the checkpoint mechanism doing its job. Without new primary-source change, the system does not manufacture repeat research.

## The next question is not more statuses; it is transition contracts

Typed Closure is an engineering abstraction synthesized from this week's evidence, not a generally validated standard. The next useful tests concern transitions between the states:

- Which changes must reopen Authority after State has closed?
- How long may Effect remain Unknown before a human decision is required instead of another automated retry?
- At what risk level is Bounded Coverage sufficient for a business decision?
- Does adding a new source automatically invalidate an older Coverage closure?
- What information separation and responsibility separation make a second review genuinely independent?
- When multiple agents close different dimensions, who proves that they refer to the same occurrence?

Without transition contracts, Typed Closure would eventually become another collection of labels.

The week's most useful conclusion is therefore not that systems need more status fields. It is more precise:

> **Completion is meaningful only when the system says what was completed.**

A system may have restored state without restoring authority. It may have completed an audit without completing coverage assurance. It may have completed a report without completing independent challenge. It may have returned to an old checkpoint without reversing an external effect.

Separating those facts prevents one local green check from pretending that the whole world is closed.

## Evidence entry points

- [9/7: Visibility Is Not Enforcement](/en/industry/2026-09-07-visibility-is-not-enforcement)
- [9/8: Memory Must Be Readmitted](/en/digital-employee/2026-09-08-memory-must-be-readmitted)
- [9/9: Tool Edge Needs Execution Evidence](/en/digital-employee/2026-09-09-tool-edge-needs-execution-evidence)
- [9/10: Second Model Is Not Independent Control](/en/digital-employee/2026-09-10-second-model-not-independent-control)
- [9/12: Evidence Complete Is Not Execution Authority](/en/digital-employee/2026-09-12-evidence-complete-not-execution-authority)
- [9/13: State Rewound, Effect Did Not](/en/digital-employee/2026-09-13-state-rewound-effect-did-not)
- [9/13: Audit Completion Is Not Coverage Assurance](/en/industry/2026-09-13-audit-completion-not-coverage-assurance)
- P2 check record: `research/intelligence/p2-runs/2026/09/2026-09-13-p2-special.json`
