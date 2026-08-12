---
schema: "publication-candidate-article/v2"
title: "Acceptance Is Not Persistence: The Missing Handoff State in Durable Agent Work"
date: "2026-08-12"
column: "digital-employee"
category: "daily"
article_type: "technical-analysis"
edition: "research-center"
research_question: "When queued intent is removed after Core acceptance rather than after persistence, what execution-authority and recovery boundary should a durable agent runtime expose?"
summary: "Acceptance can transfer execution authority before durable recovery evidence exists. Durable agent runtimes should expose those two boundaries separately."
sources: "research/analysis/Q-20260812-01-acceptance-persistence-handoff.md; research/reading/Q-20260812-01-acceptance-based-queued-work-admission.md"
cover: "./2026-08-12-acceptance-persistence-handoff-cover.svg"
---

![A luminous work token crossing from immediate acceptance toward a deeper durable record](./2026-08-12-acceptance-persistence-handoff-cover.svg)

# Acceptance Is Not Persistence: The Missing Handoff State in Durable Agent Work

A queue is often treated as the durable truth of work that still needs to happen. That assumption becomes unsafe once a runtime removes an item at **execution acceptance** rather than at **persistence completion**. The selected implementation change makes exactly that distinction visible: queued user input is admitted when Core accepts it as a new turn or steer, and the queue entry is then deleted. The later persistence path is downstream of that admission boundary. [Source basis: `research/analysis/Q-20260812-01-acceptance-persistence-handoff.md`]

## The handoff question

The useful question is not whether early acceptance is “better” than waiting for storage. It is: **what fact does each acknowledgement actually establish?**

The evidence supports a bounded answer. Core acceptance establishes that execution authority has moved into the runtime. Queue deletion therefore means “this work has been accepted for execution.” It does **not** establish that every downstream state transition is already durable, restart-safe, or exactly-once. The same source explicitly leaves end-to-end exactly-once processing, external-side-effect idempotency, and complete crash recovery outside its evidence boundary.

That difference matters for any long-lived agent or digital-worker runtime because failures do not respect component boundaries. A client can time out after the runtime has accepted work but before later durable evidence is available. A process can restart after queue ownership has been dropped. A downstream hook can stop work after admission without restoring the queue item. Those cases are not equivalent to “the work was never accepted.”

## Two acknowledgements, two meanings

A persistence-gated admission model waits until storage has recorded enough state before acknowledging the handoff. Its advantage is a stronger durable checkpoint at the cost of coupling admission latency and failure semantics to storage.

An acceptance-gated model moves the execution boundary earlier. That can make the runtime more responsive and better aligned with the actual moment at which Core takes responsibility. But it creates a second obligation: **the system must expose what durable evidence survives if failure happens after acceptance.**

The two events therefore answer different questions:

- **Accepted:** Who owns execution now?
- **Durably recorded:** What evidence survives restart or reconciliation?

Treating them as one overloaded state hides the interval between them. That interval is where ambiguous retries and duplicate execution claims are most likely to become governance problems.

## Where ambiguity enters

Consider a client that submits queued work and then loses the response. If the queue item is still present, retry logic can often reason from queue ownership. If Core already accepted and removed the item, the queue can no longer serve as the authoritative record of whether replay is safe.

At that point the runtime needs another source of truth. Without one, the client and scheduler may know that the queue no longer contains the request but still lack durable evidence about whether the accepted occurrence completed, stopped, or must be reconciled.

This is why “queue empty” must not be promoted into “work safely completed.” It establishes only the narrower fact that queue ownership has ended under the changed path. Any stronger claim would exceed the evidence.

## What a governed handoff should expose

A stronger durable design would make the handoff observable as at least two separate state transitions. One reasonable hypothesis is an **accepted-occurrence receipt** or equivalent record that survives the loss of queue ownership and carries a stable occurrence identity.

Such a receipt would not magically provide exactly-once execution. It would instead give recovery logic a durable object to reconcile against. The runtime could then distinguish “accepted but not yet durably progressed,” “accepted and durably recorded,” and later terminal outcomes without pretending they are the same fact.

This leads to three general engineering requirements:

1. schedulers and queues should expose demand, acceptance, and durable recovery evidence separately;
2. retry policy should name the authoritative state source after queue ownership transfers;
3. ambiguous retries should use occurrence identity or reconciliation evidence before claiming replay safety.

These are architecture recommendations derived from the observed handoff semantics, not source-established features.

## Boundaries of the evidence

The evidence covers one changed queued-user-message path and its documented tests. It does not define a universal agent queue protocol. It includes no independent failure-injection study, and it does not establish restart-safe deduplication or arbitrary external-side-effect rollback.

Waiting for persistence before admission can still be the correct choice in systems where durable storage is the intended handoff authority. Likewise, systems whose accepted work is naturally replayable may not need a separate durable receipt. The important point is not that one boundary is universally superior; it is that the system should not silently make one boundary stand in for the other.

## Questions a runtime still has to answer

Three questions remain open before a durable agent runtime can claim a complete recovery model: Which authoritative state drives replay after failure between acceptance and later persistence? Which occurrence identity survives ambiguous retries across process restarts? And should work that was accepted but later stopped by a downstream hook receive its own durable terminal event?

Until those questions are answered, the defensible conclusion is narrow but useful: **execution acceptance can legitimately transfer authority before durable completion evidence exists, and the runtime should model those facts separately.**
