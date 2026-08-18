---
title: "Persistence Is Not a Wake-Up Mechanism"
date: '2026-08-18'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "Why is durable storage insufficient to guarantee that persisted agent work will be noticed and resumed by a live runtime?"
summary: "Persistence and reconciliation are different responsibilities. A same-day Codex queue change shows one practical design: detect cross-connection changes coarsely, identify changed queues with durable revisions, reconcile created or resumed objects separately, and give each affected thread its own retry ownership. None of this proves exactly-once execution or distributed exclusivity."
sources:
  - research/analysis/Q-20260818-02-persistence-reconciliation-separation.md
item_id: "Q-20260818-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-18-persistence-reconciliation-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-18-persistence-reconciliation-cover.png"
  kicker="Industry Architecture · Daily Research"
  title="Persistence Is Not a Wake-Up Mechanism"
  summary="Persistence and reconciliation are different responsibilities. A same-day Codex queue change shows one practical design: detect cross-connection changes coarsely, identify changed queues with durable revisions, reconcile created or resumed objects separately, and give each affected thread its own retry ownership. None of this proves exactly-once execution or distributed exclusivity."
  version="Q-20260818-02"
  status="Daily Runtime V5 · 2026-08-18"
  languageHref="/zh/industry/2026-08-18-persistence-reconciliation"
  languageLabel="中文"
/>

# Persistence Is Not a Wake-Up Mechanism

A task can be perfectly durable and still never run. The bytes survive, the queue entry is intact, and the system can recover the state after a restart—yet an already-running worker may have no reason to look again after another process changes that state.

That gap separates **persistence** from **reconciliation**. Persistence answers whether work survives. Reconciliation answers how a live runtime discovers that surviving work has become relevant and attempts progress.

A merged Codex change on 2026-08-18 provides a concrete SQLite-backed example. The queue watcher uses `PRAGMA data_version` as a coarse signal that another connection committed a write, durable per-thread revisions to identify which loaded queues changed, explicit reconciliation for created or resumed threads, and separate per-thread retry tasks so one blocked wake does not serialize unrelated queues.

The implementation does not claim distributed exactly-once execution. Its value is more basic and more reusable: it shows the responsibilities a durable system still needs after storage has done its job.

## Durable state can remain dormant

An in-memory wake signal works only while the producer and consumer share the same live process and notification path. Once a queue can be modified through another connection or process, the persistent store becomes a source of truth that may change outside the worker's immediate view.

SQLite's `data_version` gives the watcher an inexpensive answer to “did another connection change this database?” It does not identify the exact write, actor or affected queue. That is why the implementation adds durable per-thread revisions and a `changes_since` query. The first signal is coarse; the second narrows the changed set to loaded objects.

This two-level pattern is useful beyond SQLite:

- a store-level signal says **something may have changed**;
- an object-level identity says **which durable work changed**;
- a reconciliation step decides **whether that work is now actionable**.

The revision is evidence of change, not evidence of execution. Treating it as a work token would collapse discovery and ownership into one mechanism.

## Reconciliation also has a lifecycle problem

Database changes are not the only way an object becomes relevant. A thread can be newly loaded or explicitly resumed after the underlying data was already written. If the runtime watches only fresh global store mutations, that thread can miss its chance to be examined.

The Codex watcher therefore treats created and resumed threads as separate reconciliation inputs. It can scan them from revision zero even when the global database-change signal has not moved in the current observation window. If its created-thread broadcast receiver lags, it can fall back to the manager's loaded-thread list.

This is a subtle but important distinction: **external-change detection and local lifecycle discovery are different triggers for the same reconciliation responsibility.** A durable-work design needs to name both.

## Retry ownership should be narrow

Discovery alone does not provide liveness if one failed wake can monopolize the recovery loop. The demonstrated design spawns a watcher-dispatch task per changed thread and keeps at most one active watcher task for that thread. If the queue still contains work and the wake attempt cannot resolve it, that thread sleeps for a fixed 10 seconds and tries again.

The fixed interval is an implementation choice, not a demonstrated optimum. The architectural point is the ownership boundary. A blocked thread owns its own retry delay; it does not hold a single global retry loop in front of unrelated changed queues.

At scale, independent retries can create another problem: concurrent pressure. Backoff, jitter, fairness, admission and load shedding may still be necessary. Isolation at the wake layer does not prove isolation at every downstream resource.

## Reconciliation is not exclusive execution

The most important boundary appears after a successful wake. Durable revisions can tell a runtime that work changed. A watcher can rediscover an eligible thread and ask the existing execution path to resume it. None of those facts prove that a second runtime did not observe the same change and make the same attempt.

Systems that require stronger guarantees need another layer: a claim or lease, an idempotency identity, transactional fencing, or an equivalent ownership contract. Exactly-once behavior, consensus and global ordering are not consequences of a good reconciliation loop.

This distinction changes how durability should be designed. Instead of one vague promise—“the queue is persistent”—the system can state several testable contracts:

1. **Persistence:** work state survives process loss.
2. **Change identity:** durable mutations can be located at object scope.
3. **Reconciliation:** a live runtime can rediscover relevant work after external changes and lifecycle transitions.
4. **Retry ownership:** one failing object cannot indefinitely stall unrelated rediscovery.
5. **Execution ownership:** if required, a separate claim/idempotency layer prevents unsafe duplicate effects.

Only the first four are illuminated by the selected change. The fifth remains an explicit engineering question.

A durable task is therefore not finished when it reaches disk. Durability becomes operationally useful only when the system also specifies who notices it, how resumed objects re-enter the scan, who owns a failed wake, and what separate mechanism prevents duplicate execution where that matters.

**Primary evidence:** [OpenAI Codex merged commit eeb82a15](https://github.com/openai/codex/commit/eeb82a156d1b3944dca4234c3043296529ec5837). The implementation and repository tests are public primary-source evidence; they do not establish independent multi-process reliability or distributed exactly-once behavior.
