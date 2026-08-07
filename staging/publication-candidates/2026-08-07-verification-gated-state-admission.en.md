---
schema: "publication-candidate-article/v1"
title: "Persistent Digital Employees Need Verification-Gated State Admission, Not Durable Memory Alone"
date: "2026-08-07"
column: "digital-employee"
category: "daily"
summary: "A long-running Digital Employee must separate the history it preserves from the state allowed to shape future work: evidence can be append-only, while reusable memory, completion verdicts, and assurance projections require explicit admission authority."
sources:
  - "research/analysis/Q-20260807-01-verification-gated-durable-state-admission.md"
  - "research/reading/Q-20260807-01-argus-verification-gated-runtime.md"
item_id: "Q-20260807-01"
lifecycle: "Publication Candidate"
source_research_object: "research/analysis/Q-20260807-01-verification-gated-durable-state-admission.md"
source_reading_result: "research/reading/Q-20260807-01-argus-verification-gated-runtime.md"
visualization: "staging/publication-candidates/2026-08-07-verification-gated-state-admission.svg"
visualization_decision: "Required — state-admission architecture diagram included; Research Center synthesis based on the cited Research Object"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: false
---

# Persistent Digital Employees Need Verification-Gated State Admission, Not Durable Memory Alone

Once a Digital Employee moves from a single interaction to long-running work, “remember more” is no longer a sufficient architecture. The hard question becomes: **what should be preserved as history, and what has actually earned the right to influence the next mission?**

The same-day Research Object argues for a stricter separation. Provider sessions may be disposable, while work identity, evidence, accepted state, unresolved decisions, and completion provenance remain durable. But persistence and admission must not be the same operation.

## Central judgment

**Durability is not authority.**

A model output, executor memory, reviewer judgment, or assurance object does not become future-runtime truth merely because it was written to disk. A persistent Digital Employee needs verification-gated state admission: preserve what happened first, then let evidence class and an explicit owner determine what may shape future work.

## Source

This candidate consumes only the Production-authorized `Q-20260807-01` Research Object. Production did not return to the Signal Pool or the Reading Result to perform new research. The Reading Result appears only as the evidence boundary and provenance path declared by the Research Object.

## Observation

The Research Object distinguishes several durable surfaces: a long-lived campaign or work identity, an append-only event timeline, evidence references, checkpoints, open questions, memories and skills, routes, task definitions, completion verdicts, and derived assurance or certification views.

The important distinction is not which objects are stored. It is which objects acquire future influence. Failed attempts and rejected routes can remain durable because they may help a later pivot, but they should not be silently folded into a success narrative. A reviewer verdict can be retained as evidence without automatically becoming the authority that closes a consequential stage.

The object also preserves an instructive contradiction: canonical campaign completion and a stored assurance snapshot diverged, with the assurance view still blocked after the campaign itself had completed. That is a reminder that **a durable projection can still be stale**. A dashboard or automation that treats a persisted assurance object as canonical may let yesterday’s view override today’s state.

## Comparison

| State surface | Primary purpose | Append-only? | Who may change future behavior? | Main risk |
|---|---|---:|---|---|
| Provider session | Temporary reasoning and tool context | No | It should not own long-term authority | Session loss and hidden context |
| Event and evidence history | Preserve what happened | Yes | History alone does not authorize reuse | Logged evidence remains unadjudicated |
| Reviewed checkpoint | Compact recovery surface | Versioned, not append-only | Policy-authorized owner | Omission or stale projection |
| Admitted reusable state | Define what future work may trust | Governed | Explicit owner + evidence gate | Bad memory becomes self-reinforcing |
| Assurance / certification projection | Operational or acceptance view | Recomputable | Must not override canonical workflow state | Stale projection becomes false authority |

The first four rows reflect mechanisms synthesized in the Research Object. “Admitted reusable state” is a Research Center engineering abstraction across those mechanisms, not a claim that the source implements a protocol object with that exact name.

## Discussion

This reframes “Digital Employee memory” as a governance problem rather than a storage feature.

First, a long-running worker needs two durability promises: **historical durability** and **authoritative durability**. Historical durability preserves execution, failure, evidence, and role judgments for replay. Authoritative durability restricts future work to state that passed an admission decision. Combining both inside a single memory store quietly turns “recorded” into “trusted.”

Second, completion should remain a provenance-bearing verdict rather than the final sentence emitted by the worker. Low-risk, bounded work may permit policy-defined self-review. Higher-consequence transitions may require independent QA, EVAL, or operator/ADMIN approval. The architecture should not impose one universal reviewer; it should make visible who has authority to close which state transition.

Third, a checkpoint is a recovery optimization, not a replacement for the event trail. It can accelerate the next execution step, but it must remain reconcilable with the complete evidence chain. The same applies to assurance dashboards and certification summaries: they should be treated as projections that can be recalculated against canonical workflow state.

## Engineering impact

For a Digital Employee runtime, model the long-lived unit as a WorkOrder or campaign identity that is independent from model sessions. Persist standing intent, current objective, constraints, verification criteria, and unresolved human decisions outside the provider transcript.

Maintain both an append-only execution/evidence tape and a smaller reviewed checkpoint used for recovery. Memory, skill, route, task-definition, and completion transitions should declare owners and evidence classes. Only admitted state should become an input to later missions.

For CodeFlowMu, FCoP-visible TASK/REPORT/REVIEW and event history should remain the shared fact surface while runtime checkpoints stay derived execution aids. Worker completion, QA verdict, EVAL observation, and ADMIN approval should not collapse into one boolean `done`. Recovery should resume from accepted state and unresolved decisions rather than requiring the original model session to survive.

## Boundaries and counter-evidence

The available evidence does not justify stronger claims. The reported startup-to-mature efficiency differences do not isolate the causal contribution of memory, review, routing, or task order. Independent Reviewer routing was not randomized and does not establish a universal false-acceptance rate. Verifier quality remains bounded by what the verifier can detect. And state admission cannot eliminate goal drift if the authorized decision-maker approves a poor tradeoff.

The defensible claim is therefore architectural: verification-gated admission improves the inspectability of what is allowed to persist as operational authority. It does not prove that durable memory always improves quality or that independent review is always superior.

## Future work

The next engineering question is a minimum admission contract that can distinguish proposed, evidenced, accepted, rejected, and superseded state. Different state classes should be tested against executable verification, independent QA, permitted self-review, and direct operator approval. Crash recovery also needs a transactional reconciliation strategy between canonical task state and derived assurance or checkpoint projections, plus prospective measurement of operator intervention and goal-drift correction.

## Visualization note

The visual separates Transient Session, Append-only Evidence, Reviewed Checkpoint, State Admission, and Future Work, while showing Assurance as a recomputable side projection. It is a Research Center architecture synthesis based on the Research Object and contains no unsupported quantitative data.

## Evidence and references

1. [Research Object — Verification-Gated Durable State Admission](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260807-01-verification-gated-durable-state-admission.md): the sole analytical input, including observations, research judgment, uncertainty, counter-evidence, and engineering impact.
2. [Reading Result — Argus verification-gated runtime](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260807-01-argus-verification-gated-runtime.md): the evidence boundary and provenance record declared by the Research Object; Production did not re-analyze this file.

> Editing status: bilingual structure aligned; state-layer terminology, the stale-assurance contradiction, uncertainty, and policy-dependent review boundary preserved; not published.
