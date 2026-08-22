---
title: "Deleting a Digital Employee Context Must Revoke Authority and Reconcile Unsettled Work"
date: '2026-08-09'
column: digital-employee
category: daily
summary: "Deleting a Conversation, WorkOrder or other durable work context cannot be reduced to hiding an object from the UI. A governed runtime treats deletion as authority revocation, reconciles all unsettled child work under the same serialization boundary used for admission, and uses worker leases to bound physical execution that has already escaped the database transaction."
item_id: Q-20260809-01
source_research_object: "research/analysis/Q-20260809-01-revocation-coupled-run-reconciliation.md"
source_reading_result: "research/reading/Q-20260809-01-conversation-delete-run-cancellation.md"
lifecycle: Published
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
outline: deep
cover: "/assets/covers/daily-2026-08-09-revocation-coupled-run-reconciliation-cover-v2.jpg"
---

<ArticleCover
  image="/assets/covers/daily-2026-08-09-revocation-coupled-run-reconciliation-cover-v2.jpg"
  kicker="Digital Employee · Daily Research"
  title="Deleting a Digital Employee Context Must Revoke Authority and Reconcile Unsettled Work"
  summary="Deleting a Conversation, WorkOrder or other durable work context cannot be reduced to hiding an object from the UI. A governed runtime treats deletion as authority revocation, reconciles all unsettled child work under the same serialization boundary used for admission, and uses worker leases to bound physical execution that has already escaped the database transaction."
  version="Q-20260809-01"
  status="Daily Runtime V5 · 2026-08-09"
  languageHref="/zh/digital-employee/2026-08-09-revocation-coupled-run-reconciliation"
  languageLabel="中文"
/>
# Deleting a Digital Employee Context Must Revoke Authority and Reconcile Unsettled Work

As Digital Employees take on longer-lived and recoverable work, deleting a Conversation, WorkOrder or business session stops being an ordinary interface operation. The object may disappear from a list immediately while queued tasks, approval waits, running workers and occupied execution slots remain alive.

## Central judgment

**Deleting a durable work context is an authority-revocation event followed by governed reconciliation of every unsettled child task.**

The strongest mechanism is not a cleanup scan that runs after deletion. Admission and revocation should share one durable serialization boundary. That boundary prevents a new child run from slipping through a race during teardown and becoming work that the operator can no longer see or control.

The sole analytical input for this article is the `Q-20260809-01` Research Object. Production did not return to the Signal Pool or introduce a new research object.

## Source

This article is based on [Research Object — Revocation-Coupled Run Reconciliation](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260809-01-revocation-coupled-run-reconciliation.md). Its evidence trail leads to [Reading Result — Conversation Delete Run Cancellation](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260809-01-conversation-delete-run-cancellation.md).

The Reading Result records a merged implementation in which conversation deletion handles unsettled runs under the same conversation-row lock used for run admission. This article does not promote that implementation into a generic exactly-once proof for distributed cancellation.

## Observation

The Research Object separates three states that a single “cancel” control can easily collapse:

- `QUEUED`: no physical worker is executing, so the durable run can be closed synchronously;
- `AWAITING_APPROVAL`: the run remains operationally unsettled even when a storage field such as `finishedAt` has already been populated;
- `RUNNING`: the transaction can record cancellation intent, but execution outside the transaction can only wind down cooperatively.

This is why the unsettled set should be defined by business lifecycle semantics rather than a convenient storage predicate.

## Mechanism comparison

| Approach | Blocks concurrent admission | Covers approval waits | Proves a running worker stopped | Orphan-work risk |
|---|---:|---:|---:|---:|
| UI-only hiding | No | No | No | High |
| Asynchronous post-delete scan | Unreliable | Depends on predicate | No | Medium to high |
| Revocation and reconciliation under one lock | Yes | Yes | Records intent only | Low, but lease still required |
| Same lock plus worker lease/watchdog | Yes | Yes | Governs convergence after lease expiry | Lowest |

The table is a Research Center synthesis based on the Research Object. It does not claim that the selected implementation already ships a complete generic worker-lease system.

## Discussion

A shared lock establishes an explicit order. Either a run is admitted first and the revocation transaction observes and reconciles it, or revocation completes first and later admission observes the deleted context and is rejected. Without that order, deletion and admission can both succeed independently.

A database transaction, however, governs durable state rather than physical execution. A worker may already be running on another machine, inside a browser, through an MCP server or against an external tool. Writing `cancelRequestedAt` does not prove that physical work stopped, nor does it guarantee that a late side effect will never arrive.

A complete mechanism therefore needs a worker lease:

```text
authority revoked
→ cancellation intent persisted
→ worker acknowledges within lease
→ otherwise lease expires
→ stale worker is fenced
→ governed recovery may take over
```

This is a defining difference between deleting a record and revoking a Digital Employee work context. The latter must reconcile delegated execution capability, not only stored data.

## Engineering impact

A Digital Employee runtime should preserve separate events for context revocation, unsettled-set discovery, synchronous closure of queued/approval work, cancellation intent for running workers, worker acknowledgement or lease expiry, slot release and rejection of stale late results.

For CodeFlowMu, “execution slot opened” must not remain sufficient evidence that a worker is actively progressing. Authoritative Running requires a claim, heartbeat, bounded lease and terminal result.

## Boundaries and uncertainty

The available evidence does not establish a maximum wind-down time for a running worker. It also does not prove exactly-once physical termination under network partition, or define compensation for side effects already emitted to external systems.

The correct conclusion is therefore not that one transaction solves cancellation. **The transaction makes authority and durable state consistent; a lease/watchdog makes physical execution converge within a governed bound.**

## Future work

The next engineering questions are how to set lease durations by task class, how to fence stale workers after a replacement starts, how to record compensation for external side effects, and how operator surfaces should distinguish “cancellation requested,” “worker stopped,” and “lease expired.”

## Visualization note

The visual shows admission and context revocation sharing one row lock, followed by state-specific treatment of queued/approval work and running workers. The lease watchdog is a Research Center completion of the mechanism, not a capability already demonstrated by the selected source.

## Evidence and references

1. [Research Object — Revocation-Coupled Run Reconciliation](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260809-01-revocation-coupled-run-reconciliation.md): sole analytical input.
2. [Reading Result — Conversation Delete Run Cancellation](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260809-01-conversation-delete-run-cancellation.md): traceability for implementation facts, limitations and unresolved questions.
