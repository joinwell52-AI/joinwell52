# Reading Record — Q-20260809-01 Transactional cancellation of unsettled agent runs when a conversation is deleted

- **Queue item:** `Q-20260809-01`
- **Column:** Digital Employee
- **Selection status:** Selected
- **Priority:** P0
- **Skill invoked:** `Skill 03 — Deep Reading`
- **Operating date:** 2026-08-09 (Asia/Shanghai)
- **Primary source class:** merged maintainer implementation, commit rationale and tests

## Reading scope

This pass reads Langfuse commit `ee5e0f15fb5146548968bd9474cdc31d301b98d1` as an implementation object. The bounded question is how conversation deletion interacts with queued, approval-waiting and running agent work, which lock serializes admission and deletion, and which lifecycle guarantees are actually evidenced by the change. No architecture recommendation or article drafting is performed.

## Deep Reading output

```yaml
reading_notes:
  problem:
    - Soft-deleting a conversation while an unsettled agent run still exists can orphan work that the user can no longer reach.
    - An orphaned run can retain a worker or execution slot until a later timeout, so deletion must reconcile run lifecycle rather than only hide the conversation.
    - Admission and deletion race unless both operations serialize against the same durable lock boundary.

  facts:
    - The commit explicitly states that the previous `deleteConversation` path soft-deleted regardless of run state and could leave an orphaned run occupying a worker and a per-user slot.
    - Deletion now cancels rather than refuses when unsettled work exists.
    - Cancellation and deletion are performed in one transaction under the same conversation-row lock used by `createQueuedRun`, closing the race where a run could otherwise be admitted concurrently with deletion.
    - The persistence layer separates `lockConversationRow` from the higher-level `lockConversation`; the latter additionally rejects a conversation whose `deletedAt` is already set.
    - The cancellation mapping is shared with the existing `requestRunCancellation` semantics instead of introducing a second status interpretation.
    - `QUEUED` and `AWAITING_APPROVAL` runs are closed synchronously because no worker is actively executing them.
    - `RUNNING` cancellation is cooperative: deletion records cancellation intent and the worker is expected to observe `cancelRequestedAt` and wind down.
    - The sweep uses the full unsettled status set rather than `finishedAt: null`, because an approval-waiting run may already have `finishedAt` populated while still requiring user action.
    - Tests were added for deletion/admission races and lifecycle behavior, including preventing a new run from being admitted after the conversation is deleted.

  mechanisms:
    - Conversation row locking becomes the serialization point for both work admission and destructive lifecycle transition.
    - Deletion is interpreted as revocation of the work context; unsettled child work is reconciled inside the same transaction.
    - Non-running states can be terminally closed immediately, while running work uses cooperative cancellation because execution is already outside the database transaction.
    - The distinction between active-run statuses and unsettled-run statuses is intentional: one set answers worker occupancy, the other answers whether lifecycle work still requires reconciliation.

  limitations:
    - Transactional cancellation cannot synchronously prove that a RUNNING worker has physically stopped; that part is cooperative and occurs after the database transaction.
    - The commit does not establish a bounded maximum wind-down latency after `cancelRequestedAt` is written.
    - The evidence covers Langfuse's in-app agent implementation; it is not a generic exactly-once cancellation proof for arbitrary distributed workers.
    - Network partitions or a permanently failed worker could still require separate stale-worker recovery beyond this transaction.

  contradictions:
    - “Cancel when deleted” is atomic for durable lifecycle state, but not for physical execution of already-running code. The source resolves this by explicitly describing RUNNING cancellation as cooperative.
    - A predicate based on `finishedAt` would appear to identify unfinished work, yet approval-waiting work can have that field set; the implementation therefore uses semantic run states instead of a storage shortcut.

  unresolved_questions:
    - What watchdog reconciles a RUNNING worker that never observes `cancelRequestedAt`?
    - Is slot release tied to durable cancellation state or to confirmed worker termination?
    - How are externally started side effects handled when conversation deletion occurs during RUNNING work?
```

## Source traceability

1. Langfuse merged commit: `https://github.com/langfuse/langfuse/commit/ee5e0f15fb5146548968bd9474cdc31d301b98d1`
2. Today's Research Plan: `research/runtime/plans/2026/08/2026-08-09-plan.json`
3. Skill 03: `research/skills/03-deep-reading.md`

## Reading gate decision

**Result:** Deep Reading completed. The evidence supports a concrete lifecycle pattern: serialize deletion and admission on the same durable row lock, reconcile the full unsettled run set transactionally, and distinguish synchronous closure from cooperative cancellation for already-running workers. The record does not claim synchronous worker termination or generic exactly-once cancellation.