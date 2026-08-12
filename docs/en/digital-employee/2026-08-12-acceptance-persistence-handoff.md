---
title: "After the Queue Entry Disappears: Who Can Prove the Work Still Exists?"
date: "2026-08-12"
column: "digital-employee"
category: "daily"
article_type: "technical-analysis"
edition: "research-center"
research_question: "When queued intent is removed after Core acceptance rather than after persistence, what execution-authority and recovery boundary should a durable agent runtime expose?"
summary: "Queue deletion can establish that the execution layer took custody; it cannot also establish that recovery evidence was persisted. The missing design object is a reconstructable handoff between those facts."
sources: "https://github.com/openai/codex/commit/da2803c73cd366b5e01ffe8d0e5f7d396247f827; research/analysis/Q-20260812-01-acceptance-persistence-handoff.md; research/reading/Q-20260812-01-acceptance-based-queued-work-admission.md"
item_id: "Q-20260812-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-12-acceptance-persistence-handoff.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-12-acceptance-persistence-handoff.png"
  kicker="Digital Employee · Daily Research"
  title="After the Queue Entry Disappears: Who Can Prove the Work Still Exists?"
  summary="Queue deletion can establish that the execution layer took custody; it cannot also establish that recovery evidence was persisted. The missing design object is a reconstructable handoff between those facts."
  version="Q-20260812-01"
  status="Daily Runtime V5 · 2026-08-12"
  languageHref="/zh/digital-employee/2026-08-12-acceptance-persistence-handoff"
  languageLabel="中文"
/>

# After the Queue Entry Disappears: Who Can Prove the Work Still Exists?

A queued input is accepted by Core and immediately removed from the queue. A few milliseconds later, the process crashes.

After restart, the queue is empty, no later durable record exists, and the client knows only that its request timed out. The hardest question is not yet whether to retry. It is more basic: **what surviving fact proves who took custody of this work?**

That is the gap hidden when acceptance and persistence are compressed into one status. The selected [OpenAI Codex change](https://github.com/openai/codex/commit/da2803c73cd366b5e01ffe8d0e5f7d396247f827) supports two narrow facts: queued input is admitted when Core accepts it, and the Queue Entry is then deleted. It does not establish restart-safe exactly-once processing or rollback for arbitrary external effects.

## Cut the path at three failure points

Start with a crash rather than a vocabulary of states:

| Moment | What is established | What is not established |
|---|---|---|
| Queue Entry still exists | The system retains demand for execution | No execution owner has necessarily accepted responsibility |
| Core accepted; Queue Entry deleted | Execution responsibility transferred | Restart-surviving execution evidence may not yet exist |
| A later record was persisted | At least one recovery or reconciliation fact can survive | End-to-end exactly-once still does not follow |

These moments are not percentages on a completion bar. They answer whether demand exists, whether responsibility transferred, and whether evidence survives failure. Calling the second row “completed” makes an empty queue carry a claim it cannot support.

## Custody transfers; correctness does not

Core acceptance draws a useful responsibility boundary. From that point, the client or upstream queue should no longer treat the work as unowned. Earlier acknowledgement may also reduce storage-coupled admission delay.

But custody is not correctness. A downstream hook can stop the work, the process can exit before a durable record is written, and an external operation can remain outcome-ambiguous. Recovery can no longer rely on the deleted Queue Entry, yet it cannot infer success from queue absence.

The important design object is therefore not another Boolean. It is a reconstructable **work occurrence**: who accepted it, which submission was accepted, the last verified event, and the evidence a successor must use.

## A receipt can narrow ambiguity, not abolish it

One testable hypothesis is to persist an Accepted-occurrence Receipt, with stable occurrence identity, before or while destructive queue ownership is released.

Such a receipt can turn “the queue is empty and nothing is known” into “this occurrence was accepted and its later outcome requires reconciliation.” It can distinguish never accepted, accepted without later progress, durably recorded, and terminal work.

It cannot create exactly-once semantics by itself. A crash after an external effect but before terminal persistence still requires an idempotency key, an external read-back, or compensation. For naturally replayable work, the state cost of a receipt may exceed the ambiguity it removes. Earlier acceptance is not universally better than persistence-gated admission; they choose different latency, state, and recovery costs.

## How this design should be falsified

The next step is fault injection, not more status names. Terminate the process before Core acceptance, after queue deletion, around receipt persistence, and on both sides of an external effect. Then reconstruct the occurrence using only durable facts.

If recovery cannot distinguish never accepted from accepted-but-lost, the receipt is still written too late. If occurrence identity survives but the external effect remains unknowable, the missing contract is effect idempotency and read-back—not another queue state. If naturally replayable work recovers without ambiguity, the receipt should not become a universal requirement.

The bounded conclusion is deliberately falsifiable: **execution acceptance may transfer custody, but a durable runtime needs separate surviving evidence that reconstructs that transfer; even that evidence does not prove the work ran only once.**

### Evidence and sources

- **What the source shows:** the selected Codex implementation deletes the Queue Entry after Core admission. The public commit is checkable first-party evidence, not independent validation.
- **What the source does not establish:** restart-safe exactly-once behavior, global effect idempotency, and complete crash recovery remain unproven.
- **What this article proposes testing:** implement an Accepted-occurrence Receipt and use fault injection to determine whether it reduces recovery ambiguity.

**References:**

- OpenAI Codex, 11 August 2026, [`da2803c` — Simplify queued user message admission](https://github.com/openai/codex/commit/da2803c73cd366b5e01ffe8d0e5f7d396247f827), code commit with tests changed in the same commit boundary.
