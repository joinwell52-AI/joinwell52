---
schema: publication-candidate-article/v2
title: "Capability Gain Is Not Recovery Authority"
date: '2026-09-01'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "当自我改进带来的能力提升与可恢复性可能分离时，受治理数字员工运行体在允许修改生效前应要求什么证据？"
summary: "A self-evolution study evaluates capability improvement separately from recovery and reports 197 mutations that improve the forward objective but fail recovery verification. A governed digital employee should not treat a positive forward test as activation authority; the frozen mutation, effect surface, counterfactual states, equivalence contract, and verifier result need an independent evidence bundle."
cover: staging/publication-candidates/2026-09-01-capability-gain-is-not-recovery-authority-cover.png
sources:
  - research/analysis/Q-20260901-01-self-improvement-independent-recoverability-gate.md
---

![Capability Gain Is Not Recovery Authority cover](staging/publication-candidates/2026-09-01-capability-gain-is-not-recovery-authority-cover.png)

# Capability Gain Is Not Recovery Authority

A digital employee changes its own tool-selection logic. The new version performs better on the target task and passes ordinary forward tests, so the system prepares to activate it. The harder question arrives only then: if the change later causes harm, can the system return to an acceptable state without destroying other valid changes?

Capability improvement asks whether the new version can do the work better. Recoverability qualification asks whether the system can reverse the mutation under later state evolution while preserving state the mutation does not own. The questions are related, but evidence for one does not establish the other.

EvoUndo evaluates that separation directly. Among 281 candidates admitted to its capability-and-recovery evaluation, the study reports 197 mutations that improve the forward objective but fail recovery verification. The central governance lesson is not that one recovery language is universal. It is that **capability qualification and recoverability qualification must be independent adoption gates.**

## Forward Success Can Hide Recovery Failure

The study covers 600 previously unseen one-shot self-evolution tasks. It reports 281 candidates entering capability and recovery evaluation, 197 capability-positive candidates with defective recovery, and 122 capability-inadequate candidates. A positive forward result plainly does not make the recovery obligation disappear.

At the reported budget, conventional repair approaches recover none of the 197 recovery failures. A deterministic oracle recovers 48 under the simpler L0 recovery language and 191 after the recovery calculus is extended to L1. These values should not be extrapolated into production rates, but they show that recovery depends on expression, state conditions, and the acceptance contract—not merely on whether an old version exists.

A positive forward test can justify further evaluation. It should not independently authorize activation. Otherwise, “better at the task now” is silently rewritten as “safe to undo later.”

## Recovery Is a Relation, Not a Snapshot

Recovery is not simply time travel. It asks whether a recovery action for a frozen mutation, evaluated against a pre-state witness, effect surface, post-mutation state, and acceptance relation, produces an allowed state.

Legitimate later changes make this distinction concrete. Suppose a mutation owns configuration field A, and a separate trusted process later changes field B. Restoring an old whole-state snapshot may fix A while erasing the authoritative new B. In the study’s controlled comparison, full-snapshot restoration succeeds 0/300 when later state must remain; effect-scoped snapshot recovery also degrades when a later mutation overlaps the original effect surface.

The recovery boundary therefore follows effect ownership as well as time. A useful contract must say which state belongs to the mutation, which subsequent changes remain authoritative, and what observations make the recovered state acceptably equivalent.

## Freeze the Mutation Before Diagnosing Recovery

If a recovery failure lets the modifying worker quietly revise the candidate and submit a new “rollback works” result, the second result refers to a different object. The evidence no longer supports activation of the original mutation.

The study’s useful causal boundary is to freeze the forward mutation while diagnosing its recovery obligation. The verification object includes a stable mutation identity, a pre-state witness, an effect surface, a recovery mechanism and version, counterfactual post-mutation states, and typed observational equivalence.

The effect surface cannot be defined only by the candidate’s own declaration. The proposer knows the intended change, but can omit material side effects. A control plane needs an independent derivation of the important effect surface; otherwise a defective candidate can make recovery appear easier by narrowing its own obligation.

## Four Authorities Should Not Collapse into One

A self-improvement lifecycle contains at least four distinct authorities.

The modifying worker has proposal authority over a candidate. A forward evaluator produces capability evidence. A recovery verifier produces recoverability evidence. A lifecycle gate holds activation authority and decides whether the mutation can enter the active version.

If one actor defines the effect surface, evaluates recovery, and approves activation, the independent gate is nominal. Separating the roles preserves the value of capability improvement without letting it endorse an unproved recovery property.

This does not require one universal organization chart. It requires a non-circular decision basis: activation must consume recovery evidence that is not defined solely by the candidate’s own account.

## Activation Must Bind an Exact Recovery Bundle

An auditable activation receipt should not merely say “rollback verified.” It should bind:

- the stable identity of the frozen mutation;
- the pre-mutation state witness;
- an independently derived material effect surface;
- the recovery mechanism and version;
- counterfactual tests covering relevant state drift;
- the observational-equivalence contract;
- the verifier result for that exact combination.

If any material member changes, the old result cannot silently migrate to the “latest candidate.” Continued surrounding-state drift also needs an explicit rule for certificate expiry and re-verification.

Irreversible external effects require a separate discipline. Payments, messages, or third-party writes may be compensable rather than undoable. Recovery synthesis is not exactly-once execution and cannot replace provider receipts, idempotency keys, or transactional commit evidence.

## Evidence Boundary and Open Questions

The evidence comes from one primary research system and a controlled benchmark, not an independent production reproduction. Its state surface is a harness-managed abstraction; it does not cover arbitrary enterprise systems, distributed transactions, long-running concurrent mutations, or a compromised verifier. Some recovery interactions are also model-dependent, so no single configuration can be declared universally optimal.

The bounded conclusion is nevertheless clear: **successful self-improvement is not recovery authority. Activation becomes supportable only when the exact mutation is bound to an independently verified recovery evidence bundle.**

Open questions include effect ownership under overlapping workers, qualification of irreversible third-party effects, certificate invalidation under state drift, and final authority when capability and recovery evaluators disagree.

**Primary evidence:** [EvoUndo: Making Self-Evolution Reversible with Recovery as a First-Class Property](https://arxiv.org/abs/2608.28363)
