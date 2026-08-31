---
title: Weekly 007 — Recovery Is Re-Admission
date: '2026-08-30'
column: digital-employee
category: weekly
article_type: research-brief
edition: research-center
research_question: 'When an agent runtime resumes from durable state, what must be re-established before continuity is allowed to become execution again?'
summary: 'Twenty-one evidence-validated Daily Research notes converge on one boundary: recovery is not restoration. Checkpoints, cached policy, reconstructed context, trusted paths and scheduler state can preserve useful evidence, but execution must be re-admitted against current authority, ownership, occurrence identity, lifecycle closure and replay integrity.'
sources:
  - 2026-08-24 through 2026-08-30 Daily Runtime V5 publications
  - research/intelligence/p2-runs/2026/08/2026-08-30-p2-special.json
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
cover: '/assets/covers/weekly-007-recovery-is-readmission-cover-v2.png'
---

<ArticleCover
  image="/assets/covers/weekly-007-recovery-is-readmission-cover-v2.png"
  kicker="Weekly Research · 007"
  title="Recovery Is Re-Admission"
  summary="Durable state can reconstruct continuity. It cannot grant current execution authority by itself."
  version="W007"
  status="Published 2026-08-30"
  languageHref="/zh/research/weekly/weekly-007"
  languageLabel="简体中文"
/>

# Weekly 007 — Recovery Is Re-Admission

A checkpoint survives. A session can be reconstructed. A cached policy still parses. A scheduler says a worker is running. A trusted path proves where a skill came from. A prior approval remains locally available.

Every one of those facts can be useful during recovery. None of them, by itself, answers the question that matters most:

> **May this execution continue now?**

Across 21 evidence-validated Daily Research notes published from August 24 through August 30, the same distinction appears in different mechanisms. State continuity and execution authority are separate control planes. A runtime that collapses them can recover the right bytes, the right identifiers and even the right history while still resuming the wrong work, under stale permissions, against the wrong occurrence, with incomplete ownership cleanup or with a checkpoint whose replay chain is no longer valid.

Last week’s synthesis argued that authority needs lineage. This week adds a stricter consequence:

> **Lineage can make state explainable, but recovery still needs a fresh admission decision.**

The weekly judgment is therefore:

> **Recovery should be modeled as re-admission. Durable state supplies evidence for reconstruction; current authority, ownership, occurrence identity, lifecycle closure, budget scope and replay integrity determine whether reconstructed state is allowed to become executable again.**

## Evidence scope

This synthesis uses only the seven Daily Runtime publication days from **2026-08-24 through 2026-08-30**, each with `publication = Completed`. The window contains **21 published Research Center notes**, three per day across Digital Employee, Industry Architecture and Open-source Engineering.

| Date | Digital Employee | Industry Architecture | Open-source Engineering |
|---|---|---|---|
| Aug 24 | Repeated failure is not new evidence | Instruction lineage is not authority | Cancellation ends waiting, not ownership |
| Aug 25 | Precedence is not configuration authority | A checkpoint is not permission to resume | Finding a resource is not owning it |
| Aug 26 | Foreground completion is not workflow completion | Permission authority belongs to the attachment | Copy the options, keep the client |
| Aug 27 | Running is an evidence claim | Authority context must be host-minted | A trusted path proves provenance, not approval |
| Aug 28 | Delegation budgets belong to the root objective | Cached policy is evidence, not current authority | Approval caches need an authorization identity |
| Aug 29 | Restoring context does not restore authority | Trust must change the executable surface | Timeouts must close the lifecycle they own |
| Aug 30 | A resume needs more than a checkpoint | Stronger-looking evidence does not make action safe | A durable checkpoint can still be unrecoverable |

The P2 lane separately checked all four due `biweekly-or-release` objects. All four resolved with no material post-checkpoint mechanism change; two monthly objects were not due because their August baseline already completed; no trigger reached 5; no full P2 Special Study ran. That lane therefore contributes a negative but useful fact: the week’s synthesis is driven by the validated Daily evidence, not by a newly triggered P2 study.

## The central mistake: treating reconstruction as authorization

Recovery systems often begin with a practical goal: avoid losing work. From that goal it is easy to build a chain of seemingly reasonable equivalences:

```text
state exists
→ state is recent
→ state is reconstructable
→ state is safe to resume
→ execution may continue
```

The week’s evidence breaks this chain in several places.

A durable Session append can have an uncertain commit outcome, so a checkpoint is not sufficient until authoritative history is reconciled. A reconstructed agent context can be complete enough to restore conversation continuity while still lacking current permission to execute. A DeltaChannel checkpoint can be durably stored while its seed snapshot, ordered writes, reducer identity or migration assumptions are no longer replay-valid. A cached policy can be readable while the system explicitly requires fresh remote authority. A previously trusted workspace can retain state while current trust should narrow the capability surface.

These are not variations of “persistence failed.” Persistence often succeeded. The failure is stronger: **persistence answered the wrong question**.

A recovery boundary needs at least two proofs:

```text
Reconstruction proof: Can the prior state be rebuilt faithfully?
Admission proof: May that rebuilt state execute under current conditions?
```

The first is about continuity. The second is about authority.

## Checkpoints are candidate evidence, not continuation tokens

Three notes sharpen this distinction directly.

### Uncertain persistence must be reconciled before resume

The Aug 25 Industry Architecture note studies a Session append whose durable commit status is unknown after interruption. The safe response is not blind replay and not optimistic continuation. The uncertainty itself becomes durable recovery state, and model execution waits until authoritative history is reconciled.

This creates a useful invariant:

```text
unknown commit outcome
≠ safe retry
≠ safe continue
```

The runtime first resolves what actually became durable, then decides what to do next.

### Restored context is not restored authority

The Aug 29 Digital Employee note makes the separation explicit. A full state snapshot can be eligible for context reconstruction, but reconstruction evidence does not become current execution permission.

A resumed worker may know exactly what it was doing and still be unauthorized to keep doing it because the policy epoch changed, the principal changed, the workspace lost trust, a grant was revoked, a budget was exhausted, or the original occurrence is no longer live.

This suggests a practical rule:

> **Restore descriptive state before restoring executable state.**

The runtime may rebuild history, memory and local variables first. Tools, privileged capabilities and pending side effects should materialize only after a fresh admission decision.

### Durable does not mean replayable

The Aug 30 engineering note adds a deeper checkpoint problem. Delta-style persistence can turn a checkpoint into a reference graph: a seed snapshot plus an ordered write chain interpreted by a reducer. Every blob can be durable and the checkpoint can still be unrecoverable if one referenced element disappears or if replay semantics drift.

Recovery therefore needs a replay-integrity proof, not merely storage existence:

```text
seed reachable
+ write chain complete and ordered
+ reducer identity compatible
+ migration valid
= reconstructable checkpoint
```

Only after that proof does current execution admission even become relevant.

## Current authority must dominate stale but useful evidence

The second cluster of Daily evidence concerns authority freshness.

### Configuration precedence cannot override security ownership

The Aug 25 Digital Employee note shows a security-sensitive broker becoming authoritative for credential-provider state. Ordinary configuration precedence is not enough because a lower-trust project layer can otherwise regain control merely by winning a merge rule.

The safe architecture removes protected inputs from the lower-trust layer rather than giving them a lower priority.

This is a recovery lesson too. When state is reconstructed from layered configuration, the runtime must ask not only which value wins, but **which layer is allowed to supply this class of value at all**.

### Cached policy can remain evidence without remaining authority

The Aug 28 Industry Architecture note makes a precise distinction: stale policy may still be readable and diagnostically useful while being inadmissible for governed capability decisions when fresh remote policy is required.

This avoids a common availability shortcut:

```text
fresh authority unavailable
→ use last known policy
→ silently preserve capability
```

A safer system can preserve the cache as evidence while contracting the executable surface until current authority is resolved.

### Trust should change what can execute

The Aug 29 Industry Architecture note shows workspace trust becoming an admission filter rather than a UI label. Restrictive signals win, unresolved trust becomes false, malformed trust configuration fails, and effective configuration is narrowed before capabilities materialize.

This provides a general recovery pattern:

> **Re-admission should happen before capability materialization, not after a recovered worker has already received the old tool surface.**

### Authority evidence should be minted by the authority owner

The Aug 27 Industry Architecture note adds provenance. Caller-supplied copies of access context are removed; the host verifies current account access and injects authority context only when the required predicates hold.

This matters during recovery because state often contains serialized representations of prior grants. Replaying those representations must not recreate the grant. Current authority evidence should be re-issued by the component that owns the authority decision.

## Recovery also needs occurrence and owner identity

Even with current policy, a runtime can resume the wrong instance of the right work.

### Nested HITL needs compound continuation identity

The Aug 30 Digital Employee note shows that a restored human-in-the-loop response must bind to more than a checkpoint. The runtime needs the workflow frame, the specific call occurrence and the branch before deciding whether to continue, pause or replay.

This prevents a response from being valid merely because it looks semantically appropriate to a nearby resumed state.

A useful continuation key resembles:

```text
workflow_frame
+ occurrence_id
+ branch_identity
+ current_authorization
```

The exact fields vary by runtime, but the principle is stable: **continuation authority belongs to a specific live occurrence, not to a generic recovered prompt or task label.**

### Permission authority belongs to the attachment

The Aug 26 Industry Architecture note binds MCP permission profiles to enabled server attachments. This reduces ambiguity about which context owns connected-tool authority and narrows refresh scope.

During recovery, this means permission state should be rebuilt from current attachments rather than copied from an old global cache. The attachment identity is part of the authority boundary.

### Delegation budgets belong to the root objective

The Aug 28 Digital Employee note brings resource accounting into the same model. Descendants remain the source of measured usage, but the root objective that authorized delegation owns the inherited budget charge.

If a recovered child worker receives a fresh local budget without the root objective’s consumed usage, recovery silently expands authority through accounting reset.

So resource state must also survive or be re-admitted at the correct ownership level.

## Lifecycle closure is a prerequisite for safe recovery

A third cluster shows that recovery cannot be correct when the previous execution’s lifecycle remains ambiguous.

### Cancellation ends waiting, not ownership

The Aug 24 engineering note distinguishes the caller’s cancellation signal from the owner’s cleanup obligations. Cancellation during teardown is deferred long enough for bounded local cleanup, then re-raised.

This gives recovery a clean handoff condition: before a replacement worker assumes ownership, the prior owner’s local resources should be either durably transferred or explicitly closed.

### Foreground completion is not workflow completion

The Aug 26 Digital Employee note extends terminal truth to tracked detached work. Parent success waits for owned in-flight outcomes instead of treating foreground return as full workflow completion.

A recovery controller therefore cannot decide “the old worker is gone, so the work is over.” It must know what work the old worker still owned and whether that ownership reached a terminal state.

### Timeouts must close the lifecycle they own

The Aug 29 engineering note applies the same rule to process groups. Timeout and cancellation share bounded cleanup across the owned process group rather than terminating only the direct PID.

This is important for Agent runtimes with shells, browsers, MCP servers or subprocess tools: **recovery without owner-scoped cleanup can create duplicate side effects from surviving descendants.**

### Running is an evidence claim

The Aug 27 Digital Employee note ties the cluster together. A scheduler event should not be enough to publish `Running`. Scheduling, claim, process startup and readiness are different facts.

The same logic applies after recovery: a recovery slot or reconstructed checkpoint should not produce `Running` until there is fresh evidence that a worker has actually claimed the occurrence and reached the runtime’s declared readiness boundary.

## Repeated, trusted and polished evidence can still be the wrong evidence

Two notes prevent the recovery model from turning into “collect more evidence.”

The Aug 24 Digital Employee note shows a generic terminal condition being regenerated late and overwriting a more specific safety failure. Repetition is not freshness. An older, weaker condition does not become more authoritative because it is observed again during cleanup.

The Aug 27 engineering note shows that a trusted path can prove invocation provenance without proving that the invoked content is safe or currently approved. Provenance and authorization remain separate evidence identities.

The Aug 30 Industry Architecture note goes further: in a preprint covering twelve frontier models, professional evidence displays increased action commitment even on aleatorically unknowable questions, while fabricated and real panels had similar reported effects and stated belief barely moved.

The implication for recovery is important:

> **A recovery gate should qualify action from inspectable control evidence, not from how complete, recent, trusted-looking or persuasive the recovered state appears.**

Evidence quality matters, but only when the evidence supports the proposition being decided.

## A reusable control model: the Recovery Admission Envelope

The week supports a compact model for governed continuation.

A recovered execution can be represented as a candidate envelope:

```text
RecoveryCandidate = {
  reconstructable_state,
  state_lineage,
  current_authority,
  owner_identity,
  occurrence_identity,
  lifecycle_closure,
  budget_scope,
  replay_integrity,
  evidence_freshness
}
```

The admission decision is then:

```text
reconstruct
→ verify replay integrity
→ resolve prior ownership/lifecycle
→ refresh current authority
→ bind owner + occurrence + branch
→ restore budget and capability scope
→ materialize executable surface
→ claim fresh execution
→ Running
```

The dangerous alternative is shorter:

```text
checkpoint exists
→ load
→ Running
```

The difference between those two flows is the difference between **continuity** and **governed continuity**.

Not every runtime needs every field literally. A low-risk read-only assistant may use a lighter envelope. A system that can write code, send messages, mutate enterprise records, invoke remote tools or maintain long-running digital-employee state needs stronger evidence because recovery can duplicate or revive consequential authority.

## What changed relative to last week

Weekly 006 proposed provenance-preserving admission across state transformations. Weekly 007 asks what happens when the transformation is discontinuous: crash, timeout, cancellation, checkpoint restore, policy refresh, worker replacement or human-resume.

The relationship is:

```text
lineage tells us what survived
reconstruction tells us what can be rebuilt
re-admission tells us what may execute now
```

These are complementary, not interchangeable.

A runtime can have excellent lineage and fail re-admission by restoring a revoked tool grant. It can have current permission and fail reconstruction because a delta checkpoint lost its seed. It can have both and still duplicate work because the old process group or detached task was never closed. It can close the lifecycle correctly and still attach a human answer to the wrong occurrence.

Reliable recovery therefore needs a conjunction of proofs rather than one universal “resume token.”

## Tensions the model does not eliminate

### Fresh authority versus availability

Current policy may be temporarily unreachable. High-assurance operations should often contract capabilities, but fully fail-closed behavior can make low-risk work unnecessarily unavailable. Systems need explicit rules for which operations may use bounded stale evidence and which require fresh authority.

### Strong occurrence identity versus migration

Strict binding makes replay safer but can complicate legitimate workflow migration. A restarted orchestrator may need to map old occurrence identities into a new execution epoch. That mapping itself should be an auditable authority transition, not an implicit string rewrite.

### Cleanup completeness versus bounded recovery time

Waiting forever for perfect remote cleanup defeats recovery. The practical target is bounded ownership closure: record what was locally closed, what remains uncertain, and which external effects require reconciliation before replay.

### Replay integrity versus storage cost

Self-contained snapshots simplify recovery but cost more storage; delta chains are efficient but introduce dependency and migration risk. The right compaction strategy depends on how expensive an unrecoverable checkpoint is relative to storage and verification cost.

### Root accounting versus elastic delegation

Shared budgets prevent descendants from escaping limits, but some systems legitimately reallocate resources during recovery. Such expansion should be a fresh grant owned by the root objective, not an accidental reset caused by worker replacement.

## Predictions

These are Research Center interpretations of recurring evidence, not claims made by any one source.

1. **Resume protocols will expose explicit re-admission states.** `Restored`, `Reconciled`, `Admitted`, `Claimed` and `Running` will increasingly be separate states.
2. **Checkpoint formats will carry replay dependencies.** Seed identity, reducer/version identity, ordered-write completeness and migration status will become inspectable recovery metadata.
3. **Policy caches will become non-authorizing by default for high-risk capabilities.** They will remain diagnostic evidence but will not silently preserve privileged execution.
4. **Worker leases will become evidence-bearing.** A stale `Running` record will need heartbeat, claim freshness or checkpoint progress rather than only a long maximum-runtime window.
5. **HITL continuation will become occurrence-bound.** Human responses will bind to workflow frame and call occurrence, with authorization checked separately.
6. **Delegated resource budgets will survive worker replacement at the objective level.** Recovery will not reset descendant usage merely because execution moved to a new worker.
7. **Lifecycle recovery will reconcile owned descendants before replay.** Process groups, detached tasks and remote side effects will increasingly appear in recovery records.

## Open questions

- What is the minimum Recovery Admission Envelope that can be standardized across Agent runtimes?
- Which authority facts must always be refreshed, and which may use bounded stale evidence?
- How should a runtime prove that an old execution epoch is sufficiently closed before granting a new one?
- Can checkpoint replay integrity be verified incrementally without reconstructing the full state on every recovery?
- How should human approvals migrate when a workflow occurrence is intentionally replaced?
- What evidence should downgrade a stale `Running` state to recoverable `Waiting` before a maximum runtime expires?
- How should remote side effects be reconciled when local ownership closes but external completion remains unknowable?

## Weekly judgment

The week does not support the simple slogan that better persistence makes agents reliable. Persistence is necessary, but it preserves only what was written. Reliability requires deciding whether preserved state is still complete, attributable, owned, replayable and authorized.

The stronger design rule is:

> **Never let recovered state authorize its own continuation. Reconstruct first, then independently re-admit execution from current evidence.**

That rule connects checkpoints, policy caches, workspace trust, host-minted access context, approval caches, delegated budgets, cancellation cleanup, detached work, process timeouts, HITL resume and honest `Running` state. It turns recovery from a storage feature into a governed execution boundary.

## Evidence map

The synthesis is grounded in the 21 published Daily Research notes listed in the evidence table above and the completed P2 check record at `research/intelligence/p2-runs/2026/08/2026-08-30-p2-special.json`. The Daily notes retain their own primary-source citations and bounded claims; this Weekly brief synthesizes those validated findings rather than replacing their source-level evidence.
