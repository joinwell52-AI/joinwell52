---
schema: "research-analysis/v1"
id: "AN-20260807-01"
date: "2026-08-07"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260807-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260807-01-argus-verification-gated-runtime.md"
output_contract: "Research Object"
research_object: "Verification-Gated Durable State Admission"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Verification-Gated Durable State Admission for Digital Employees

## Governed scope

This object consumes only the completed Reading Result for `Q-20260807-01`. It performs Skill 04 Research Analysis and produces a Production-ready Research Object. It does not introduce unread material, draft publication copy, change TMPA/FCoP protocol semantics, or authorize release.

## Analysis

```yaml
analysis:
  observations:
    - The Reading Result shows Argus treating the campaign rather than a provider transcript as the long-lived identity, while individual Engineer and Reviewer calls may start in fresh sessions.
    - Durable continuity is carried by explicit shared state: a typed append-only event timeline, evidence references, checkpoints, open questions, retained artifacts and role-owned state surfaces.
    - Reusable runtime self-evolution is fixed-model: memories, skills, verifiers, routes, task definitions and rejected routes may change future missions, but only after evidence and an authorized owner decision.
    - Completion provenance is role- and risk-sensitive: some bounded work can use recorded self-review, while policy-required stages require a fresh Reviewer and cannot waive independent review.
    - The evidence includes both productive review interventions and a stale assurance snapshot that lagged canonical campaign completion, demonstrating that derived certification state can diverge from authoritative workflow state.
  cross_comparison:
    - Compared with the same-day deferred-environment Reading Result, both designs separate stable identity from transient execution and make state transitions explicit, but Argus governs semantic work state while deferred provisioning governs resource readiness.
    - Compared with the same-day agentic-server Reading Result, Argus assigns authority by role and evidence class, whereas the server architecture assigns compute pools by runtime role and burst signature; both reject one uniform policy for heterogeneous roles.
    - The event tape plus reviewed checkpoint forms a control/history separation similar in spirit to a canonical state plus derived projection: the full trace preserves causality, while the checkpoint optimizes the next execution step.
    - The stale assurance inconsistency is structurally comparable to any cache or projection that can lag a canonical source of truth; therefore certification views must be reconcilable rather than treated as authority merely because they are durable.
  discussion:
    - The structurally important mechanism is not multi-agent review by itself; it is admission control over durable state. Execution can propose a state change, but future missions should consume it only after evidence and owner authority make it admissible.
    - This creates a causal chain from evidence to authorized state to later behavior: rejected routes and failed attempts remain useful only when they are retained with provenance rather than silently folded into a summary.
    - A Digital Employee therefore needs two different durability promises: preserve what happened, and preserve what is allowed to influence future work. An append-only history satisfies the first; reviewed checkpoints and typed state ownership satisfy the second.
    - Completion should remain a typed verdict rather than a boolean emitted by the executor. Policy can permit self-review for low-risk bounded work, but the authority that closes a consequential stage must be explicit and inspectable.
    - The same-day server and provisioning Reading Results reinforce a broader architectural pattern: stable identities and explicit role boundaries are useful only when their derived views, resource states and acceptance states can be reconciled against canonical truth.
  research_judgment:
    - A persistent Digital Employee should admit reusable state through a typed evidence-and-owner gate; model output or executor memory must not become future-runtime authority merely because it was generated or persisted.
    - Provider sessions should be disposable execution contexts, while campaign/work identity, evidence, accepted state and unresolved decisions remain durable outside the provider transcript.
    - Completion and stage transition should be modeled as provenance-bearing verdicts whose required reviewer or operator authority is selected by risk and policy, not by a universal self-review or universal reviewer rule.
    - Derived assurance or certification projections must be continuously reconcilable with canonical workflow state; a stale durable projection must never override the current authoritative state.
  uncertainty:
    - Confidence is high that separating durable campaign identity from provider sessions and gating reusable state with evidence improves auditability and recovery semantics.
    - Confidence is medium that the reported review and mature-wave efficiency effects transfer to heterogeneous enterprise Digital Employee roles because routing was adaptive and the longitudinal comparison was observational.
    - Confidence is low that the Reading Result establishes atomic multi-surface contract updates, low operator-intervention rates or immunity from goal drift when authorized humans or managers approve poor tradeoffs.
  counter_evidence:
    - The startup-to-mature efficiency comparison does not isolate the causal contribution of memory, review, routing or task order, and difficult later waves can become more expensive again.
    - Independent Reviewer routing was not randomized, so the evidence does not establish that independent review is universally superior or quantify its false-acceptance rate.
    - One paper campaign reached canonical completion while a stored assurance object remained blocked, proving that durable derived certification can become stale.
    - Verification quality is bounded by the verifier itself; passing a benchmark, test or model Reviewer does not prove that the encoded property is complete or correct.
  engineering_impact:
    tmpa:
      - No TMPA Core change is justified from this single Reading Result.
      - The case is useful as research input for separating observed events, admitted state and decision authority, but protocol changes should wait for repeated Runtime pressure.
    digital_employee:
      - Represent the long-lived unit as a WorkOrder or campaign identity independent of provider sessions and preserve explicit standing intent, current objective, constraints, verification criteria and unresolved operator decisions.
      - Maintain an append-only execution/evidence tape plus a smaller reviewed checkpoint used to resume work; do not replace one with the other.
      - Give memory, skill, route, task-definition and completion transitions explicit owners and evidence classes so future work consumes only admitted state.
      - Preserve rejected routes as attributable exclusions when their evidence is useful for future pivot decisions rather than discarding them with failed execution context.
    codeflowmu:
      - Keep FCoP-visible TASK/REPORT/REVIEW and event history as the shared fact surface while Runtime checkpoints remain derived execution aids.
      - Add typed completion provenance and policy-selected QA/EVAL/ADMIN gates instead of equating a worker completion message with stage closure.
      - Reconcile every derived assurance/status projection against canonical task state before presentation or automated transition.
      - Recovery should restore accepted durable state and open decisions without requiring reuse of the original model session.
  limitations:
    - The analysis is bounded to the completed Argus Reading Result and does not independently reproduce its benchmarks or inspect unread implementation details.
    - User-guided pivots and operator-intervention rates are not prospectively measured in the Reading Result.
    - The report-level contract is distributed across runtime surfaces rather than demonstrated as one atomic transaction.
    - Submission-stage paper completion is not external peer review, venue acceptance or proof of scientific superiority.
  future_questions:
    - What minimum admission contract can distinguish proposed, evidenced, accepted, rejected and superseded runtime state without making Digital Employee operation too heavy?
    - Which state classes require executable verification, independent QA, permitted self-review or direct operator approval as risk changes?
    - How should canonical task state and derived assurance/checkpoint projections be transactionally reconciled after crash or partial update?
    - What prospective user study can measure operator intervention, goal-drift correction and the causal contribution of memory, review and routing separately?
```

## Research judgment

The Production-relevant object is:

> Treat Digital Employee persistence as verification-gated state admission: provider sessions may be disposable, but reusable state, completion verdicts and future behavior must be anchored in durable evidence, explicit ownership and a canonical workflow state that derived assurance views cannot override.

This is an inference from the completed Reading Result and remains bounded by the adaptive-review, observational-efficiency and stale-assurance limitations recorded above.

## Production input

Production may consume this Research Object to explain governed persistence and runtime self-evolution. It must preserve the distinction between event history and admitted state, the policy-dependent review boundary, the stale assurance contradiction and the fact that reported efficiency changes are not causally isolated.

## Evidence boundary

- `research/reading/Q-20260807-01-argus-verification-gated-runtime.md`

No other source was consumed by this Analysis object.
