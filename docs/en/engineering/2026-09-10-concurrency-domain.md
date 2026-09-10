---
schema: "publication-candidate-article/v2"
title: "The Concurrency Limit Is One. Why Can Two Tasks Still Run?"
date: "2026-09-10"
published_date: "2026-09-10"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "The Concurrency Limit Is One. Why Can Two Tasks Still Run?"
summary: "A controlled AG2 experiment separates a repaired per-loop limit from the different contract of an Agent-wide resource cap."
cover: "/assets/authority-scope-20260910/02-concurrency-domain.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded pinned-source seam experiments; not full-system validation"
pageClass: "authority-scope-article"
---

<ArticleCover image="/assets/authority-scope-20260910/02-concurrency-domain.cover-v1.png" kicker="Open-source Engineering · Experiments" title="The Concurrency Limit Is One. Why Can Two Tasks Still Run?" summary="A controlled AG2 experiment separates a repaired per-loop limit from the different contract of an Agent-wide resource cap." version="2026-09-10" languageHref="/zh/engineering/2026-09-10-concurrency-domain" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.authority-scope-article .vp-doc h1[id] { display: none; }</style>

# The Concurrency Limit Is One. Why Can Two Tasks Still Run?


An Agent is configured with `max_concurrency=1`. Two threads use it, and two subtasks run simultaneously. Has the configuration been violated?

If the limit belongs to the whole Agent, yes. If each event loop owns one slot, both tasks can run while respecting their respective limits.

That distinction matters when a limit protects an API account, a sandbox pool or a spending budget. Before evaluating whether a concurrency fix works, we need to identify the domain whose activity is being counted.

## Reproducing the actual defect

AG2 is an open-source framework for building and coordinating Agents. [PR #3243](https://github.com/ag2ai/ag2/pull/3243) changes the semaphore cache used when admitting subtasks. A semaphore supplies a limited number of slots: later coroutines wait when all slots are occupied, and a completed task releases its slot.

The earlier method stored one semaphore and its owning event loop on the Agent. When another loop arrived, it replaced the cached semaphore. Threads alternating between loops could keep replacing that reference while earlier tasks still occupied older semaphores.

We pinned the base and head source and executed the original `_spawn_subtask` method. The subtask body was a waiting counter, not a model call. Rather than relying on random scheduling, we arranged an explicit interleaving:

1. A1 enters on loop A and holds a slot.
2. B1 enters on loop B in another real OS thread.
3. While both remain active, A requests A2.
4. We record local and aggregate peaks, then release the tasks.

On the old method, A2 obtained a newly created slot. Loop A now had two active subtasks and the experiment had three overall. This violates even the narrower per-loop interpretation of a limit of one.

## Which peak becomes one after the fix?

The proposed implementation keeps a semaphore for each running event loop and protects lookup and creation with a thread lock. B no longer replaces A's entry. Under the same interleaving, A2 waits for A1 to release its slot.

| Revision and execution shape | Loop A peak | Loop B peak | Aggregate peak |
| --- | ---: | ---: | ---: |
| Base, one loop | 1 | 0 | 1 |
| Base, two loops | 2 | 1 | 3 |
| Proposed head, one loop | 1 | 0 | 1 |
| Proposed head, two loops | 1 | 1 | 2 |

We ran each configuration five times per round, across two rounds: forty controlled trials with identical outcomes and no exceptions. Recording both local and aggregate peaks makes the result precise. The proposed method repaired the per-loop limit; two loops still ran two subtasks in aggregate.

![Local and aggregate peaks from the same controlled experiment](/assets/authority-scope-20260910/02-concurrency-domain.figure.en.png)

*Figure 1. These are in-flight synthetic waiting subtasks, not measurements of model requests, throughput or cost. Source: saved rounds 1 and 2 of our pinned-source experiments.*

The upstream regression test explicitly targets the per-loop contract. An aggregate peak of two should therefore not be called a failed fix. It identifies a different guarantee that this patch does not provide.

## Turn the number into an acceptance contract

A limit intended to protect a real resource needs at least four definitions.

The first is its **scope**: loop, Agent, process, host or tenant. The second is its **admission authority**: which object or service can issue slots, and whether all relevant executors share it. The third is its **lifetime**: what task completion, process exit, lease expiry or manual cleanup means for an occupied slot. The fourth is its **uncertainty policy**: losing sight of an old task does not establish that the resource it held is free.

A user may select one to prevent two expensive tasks from using the same account simultaneously. A correct semaphore in each loop could still fail to satisfy that product requirement. Conversely, a product deliberately promising one task per loop should not silently impose cross-domain serialization in the name of safety and remove intended parallelism.

The design starts with the contract, followed by the appropriate lock, shared counter or lease. A lock around creation protects that operation. It does not automatically turn separate counters into a shared resource budget.

## What this experiment establishes

We did not run a complete AG2 Agent, toolchain or model service, and did not test multiple processes, hosts or tenants. Initialization was a version-matched fixture; the admission method itself came from pinned upstream source. The PR remained open at the time of our inspection.

The useful acceptance question is therefore not only “did the peak exceed the cap?” It is also **“within which domain did we count that peak?”** Without that domain, the limit is difficult both to implement and to review fairly.

[中文](/zh/engineering/2026-09-10-concurrency-domain) · [Methods, pinned revisions and raw results](/en/research/evidence/2026-09-10-authority-scope)
