---
schema: "publication-candidate-article/v2"
title: "Concurrency Should Not Start With a Lock: The Smallest Safe Unit for Nested Callbacks"
date: "2026-08-12"
column: "open-source-engineering"
category: "daily"
article_type: "engineering-insight"
edition: "research-center"
research_question: "How can a nested asynchronous tool runtime preserve ownership, cancellation and bounded failure without globally serializing independent sessions?"
summary: "Safe callback concurrency starts with four boundaries—ownership, lifetime, capacity, and isolation—not with a choice of lock. Once work crosses a process boundary, those local boundaries must become a durably reconstructable protocol."
sources: "https://github.com/openai/codex/commit/ba2fb483197a6b428b8c6d999d192bb056c64ae7; research/analysis/Q-20260812-03-scoped-callback-concurrency.md; research/reading/Q-20260812-03-grpc-callback-ownership-cancellation.md"
cover: "./2026-08-12-scoped-callback-concurrency-cover.png"
---

![Three enclosed industrial shuttle tracks advance in parallel through one space, visible to one another but unable to block one another](./2026-08-12-scoped-callback-concurrency-cover.png)

*Cover: original Research Center editorial visual. Concurrency comes from identifiable, terminable lanes—not from forcing every job through one lock.*

# Concurrency Should Not Start With a Lock: The Smallest Safe Unit for Nested Callbacks

A remote session is halfway through a long operation when it calls back into a host tool. The callback is in flight when the user terminates the cell. At the same moment, an independent session submits a small query.

If the first design question is “which lock should protect this code?”, the two problems are easily coupled: a callback whose owner has disappeared keeps waiting, while the independent session stalls behind a large request. A better starting point is: **who owns this callback, how long may it live, how much capacity may it consume, and can its wait cross a session boundary?**

The selected [OpenAI Codex change](https://github.com/openai/codex/commit/ba2fb483197a6b428b8c6d999d192bb056c64ae7) forwards gRPC code-mode callbacks to session delegates and exposes several concrete boundaries: cell ownership and enabled tools are checked before admission; a cancellation token links work to execution lifetime; pending delegate calls and recent callback IDs are bounded; and a test verifies that a large unary completion does not block an independent session. These facts support transferable engineering criteria. They do not establish cross-process exactly-once behavior, durable recovery, or rollback of external effects.

## Turn “where should this return?” into “who still owns it?”

A callback ID can correlate a message. It cannot prove that the receiver still has authority to process it. A safe callback should also be bound to a session, an execution or cell, the enabled tool set, and the current cancellation scope.

The routing table is therefore more than `id -> promise`. It behaves like a short-lived capability lease: a result may re-enter only while the execution that created it is still receptive and the requested tool remains inside its capability envelope. If the cell has ended, the session has been replaced, or authorization has been withdrawn, a late network response must not resurrect the old execution.

## A safe unit needs four boundaries

| Boundary | What it constrains | Typical failure when missing |
|---|---|---|
| Ownership | Which session and cell own the callback | A result enters the wrong execution, or an orphan is accepted |
| Lifetime | When to cancel, drain, or reject late results | Work survives termination or stale results revive |
| Capacity | Pending count, identifier, and payload limits | One session exhausts memory or scheduler capacity |
| Isolation | Whether one wait can block unrelated sessions | A large completion creates global head-of-line blocking |

Together, these boundaries define the smallest safe unit. A lock may protect state inside that unit; it cannot replace ownership validation, and it does not automatically provide cancellation, backpressure, or session isolation.

## A global lock taxes unrelated work

The simplest implementation keeps every callback in one global map behind one lock. It often looks correct under light tests, but it turns unrelated sessions into a shared failure domain: slow decoding, a large result, notification under lock, or cleanup can queue everyone behind one path.

A safer structure partitions state by session or execution, holds locks only long enough to locate and validate ownership, and moves payload transfer, delegate execution, and completion notification outside the critical section. The source's independent-session non-blocking test is worth preserving because it tests an isolation promise, not merely a throughput number.

## “Ended” is not one state

A cell that is no longer running can mean at least two things. After normal completion, already-admitted notifications may need to drain so their results are observed. After forced termination, cancellation should propagate and stop outstanding work. Treating both cases as simple deletion either loses completed results or leaves orphaned tasks.

A shutdown protocol should therefore distinguish: reject new callbacks, drain admitted callbacks, cancel unfinished callbacks, reject late results, and release identity records. A bound on recently seen IDs is not cosmetic; it creates a finite window between duplicate detection, late delivery, and unbounded memory growth.

## Local ownership stops being enough across a process boundary

In-memory sessions, tokens, and callback IDs can protect a single process lifetime. They cannot answer identity after a restart. If the process dies after an external tool acts but before completion is recorded, the new runtime cannot know whether to retry, query, or compensate.

The answer is not to persist the local map verbatim. The protocol must be upgraded: give the execution occurrence and external effect stable identities, record verifiable admission and completion events, and require an idempotency key, read-back, or compensation path from the external tool. This is a further design hypothesis. The selected change does not prove those properties, so local concurrency safety must not be presented as distributed reliability.

## Portable review criteria

Five counterexample tests expose the boundary: deliver a result after cell termination; return a very large completion from one session; exhaust pending callback capacity; reuse an old callback ID; and kill the process after an external effect but before its completion record.

The first four test ownership, lifetime, capacity, and isolation. The last reveals when the problem has become a durable protocol problem. An implementation that proves only the absence of data races, but cannot state the outcome of these tests, is not yet a safe agent callback runtime.

The durable conclusion is deliberately narrow: **concurrency safety begins by making each callback an owned, expiring, bounded unit that cannot stall its neighbors. Once it crosses a process boundary, persistent facts must prove which occurrence it was.**

### Evidence and sources

- **What the source shows:** the selected Codex path includes ownership checks, cancellation propagation, capacity bounds, and an independent-session non-blocking test. Same-change tests remain first-party evidence, not independent validation.
- **What the source does not establish:** cross-process recovery, exactly-once execution, and rollback of external effects.
- **What this article proposes testing:** stable execution identity, durable events, and external idempotency or read-back under fault injection and restart.

**References:**

- OpenAI Codex, [`ba2fb48` — Forward gRPC code-mode callbacks to session delegates](https://github.com/openai/codex/commit/ba2fb483197a6b428b8c6d999d192bb056c64ae7), code change and tests in the same commit.
