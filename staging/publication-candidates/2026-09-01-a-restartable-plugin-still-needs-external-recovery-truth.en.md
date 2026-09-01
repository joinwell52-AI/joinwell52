---
schema: publication-candidate-article/v2
title: "A Restartable Plugin Still Needs External Recovery Truth"
date: '2026-09-01'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "在进程隔离能够支持可信恢复之前，哪些持久状态必须存在于可丢弃插件或工作进程之外？"
summary: "Moving a plugin into its own process limits the crash boundary but does not reveal whether an operation already happened. Trustworthy recovery also needs session truth, stable effect identity, settlement order, and ownership generations outside the worker process; external effects beyond that protocol boundary require provider receipts, idempotency evidence, or compensation."
cover: staging/publication-candidates/2026-09-01-a-restartable-plugin-still-needs-external-recovery-truth-cover.png
sources:
  - research/analysis/Q-20260901-03-plugin-isolation-durable-recovery-transcript.md
---

![A Restartable Plugin Still Needs External Recovery Truth cover](staging/publication-candidates/2026-09-01-a-restartable-plugin-still-needs-external-recovery-truth-cover.png)

# A Restartable Plugin Still Needs External Recovery Truth

A plugin process crashes after invoking an external tool. A replacement starts quickly: memory is clean, connections return, and the task re-enters the queue. The new process does not know which state the old call reached. It may never have started, it may have executed while its acknowledgement was lost, or it may already have completed and settled.

Those states can look identical from the replacement process, yet they demand different decisions. The first may run, the second needs reconciliation, and the third generally must not replay. If the decision facts disappear with the failed process, isolation has reduced the blast radius without creating trustworthy recovery.

Logos makes this boundary explicit. It places session truth in an append-only durable transcript outside its peer processes, connects requests and results through stable call identity, and persists represented settlement before announcing completion downstream. Its bounded lesson is: **a process may be replaceable, but the authority to decide replay must survive outside that process’s failure domain.**

## Isolation Limits Failure but Does Not Reconstruct History

A separate process can prevent one plugin crash from taking down the entire harness. It can also let the host terminate an unresponsive component and recreate execution capacity. Those are real fault-isolation benefits.

Restarting restores the ability to compute. It does not restore knowledge of what already happened. If session context, call identity, and settlement state live only in the old process, the replacement cannot distinguish a safe retry from a duplicate effect.

A plugin is therefore not safely disposable merely because it can be relaunched. The replacement must reconstruct its session and determine replay eligibility from durable evidence independent of the process being replaced.

## Three Similar Crash States Need Different Decisions

The ambiguous failure window contains at least three cases.

A call may fail before sending and produce no effect. The external target may execute while the success acknowledgement is lost. Or the harness may receive the result and expose it downstream as an official completion.

Retrying all three cases can duplicate a payment, message, or deployment. Refusing all three can permanently lose work that never ran. Recovery needs enough durable truth to decide differently for each state.

The reported protocol uses at-least-once control delivery rather than assuming every message arrives once. Stable global call identifiers and idempotent request/result pairing absorb duplicate delivery. Safety comes from logical identity and settlement rules, not a transport promise of uniqueness.

## Put Recovery Truth Outside the Worker

Trustworthy recovery needs a fact plane outside the worker failure domain with at least four responsibilities.

First, session truth: an append-only durable transcript stores complete events while model-visible context is only a projection. Second, effect identity: calls and results carry stable identifiers across restarts and reconnects. Third, settlement order: represented completion becomes durable before downstream visibility. Fourth, ownership generation: when a new instance takes over a logical role, a stale process cannot silently return as a second owner.

Together, these facts answer who owns the work, what has settled, and what may replay. A plugin becomes genuinely replaceable only when those answers survive elsewhere.

That is why a recovery transcript is more than a debug log. A normal log helps later observation. Recovery truth participates directly in replay authorization, so its order, identity, durability, and completeness must meet a control-evidence standard.

## Durable Before Visible Creates a Replay Boundary

Durable-before-visible settlement establishes a clear boundary: once the system lets a downstream component rely on completion, the corresponding settlement fact already exists in recoverable storage. After restart, the new process can read the stable call identity, see that the represented effect settled, and suppress a second logical effect.

The study reports 12/12 sessions resumed through its tested failure sequence, 80/80 trials across four selected crash boundaries without repeating the represented settled effect, and zero pairing-invariant violations in a 3,500-call conformance set. These are system-reported results under controlled conditions, not an independent production reproduction.

Not repeating the represented effect does not mean no work repeats. One reported failure path recomputes six interim results and is substantially slower. Recovery can tolerate duplicate control messages and repeated computation while preserving one settlement for the same logical effect.

## External Effects Need Their Own Receipts

Transcript authority has a precise boundary. It can establish what the harness recorded. It is not automatically atomic with every external system.

The dangerous window is: an external payment, message, or deployment commits; the plugin crashes; the local settlement append never becomes durable. The transcript shows no completion, but running again creates a second real-world effect. Process isolation and an internal log cannot close that window alone.

Safe handling requires evidence at the external effect boundary: a provider idempotency key, transactional outbox/inbox, receipt reconciliation, withheld commit, or compensation. The runtime’s stable effect identity should bind to provider evidence instead of expanding a local “settled” record into a claim of global exactly-once execution.

Likewise, an append-only transcript on one machine does not solve machine loss, network partitions, or replicated ownership. Replication, consensus, corruption recovery, and key governance remain separate mechanisms.

## Evidence Boundary and Open Questions

The evidence comes from one primary research system. Fault experiments cover selected process-kill boundaries, and the deployment is principally one-machine or trusted-network oriented. The study does not establish hostile multi-tenant isolation, Byzantine tolerance, distributed consensus, or atomicity for arbitrary external effects. Transcript compaction, replication, corruption recovery, and long-term privacy governance are also outside its central validation.

The bounded conclusion remains useful: **fault isolation answers where failure can occur; recovery truth answers what the system is authorized to do afterward. A restartable plugin has a trustworthy replay boundary only when session truth, effect identity, settlement order, and ownership generation survive outside it.**

Open questions include reconciliation of provider commits with missing local appends, evidence-preserving transcript compaction, deterministic exclusion of stale owners, durability through machine loss, and encryption of sensitive sessions without breaking recovery semantics.

**Primary evidence:** [Logos: Building Durable and Recoverable Agent Harnesses through Process Isolation](https://arxiv.org/abs/2608.28553)
