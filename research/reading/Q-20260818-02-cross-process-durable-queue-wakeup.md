# Q-20260818-02 — Durable thread queues detect cross-process writes and retry wakeups independently

- Runtime date: 2026-08-18
- Column: Industry Architecture
- Source object: Q-20260818-02
- Primary source: https://github.com/openai/codex/commit/eeb82a156d1b3944dca4234c3043296529ec5837
- Evidence class: Fact for merged code/tests; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

A durable queue stored in SQLite can be modified through a different connection or process while a thread is already loaded and idle. Persistence alone does not wake that in-memory thread. Without an external-change detector and per-thread retry ownership, queued work can remain durable but undispatched, or a blocked queue can stall unrelated queues.

## Facts

1. The merged change adds a background watcher when the queue extension is installed.
2. The watcher checks SQLite change state on a fixed 10-second interval.
3. `QueueStore::change_version` is backed by SQLite `PRAGMA data_version`, using a retained connection so the runtime can cheaply notice writes committed through another connection.
4. The queue store adds durable per-thread revisions and a `changes_since(revision, thread_ids)` query that returns changed loaded thread IDs with their revisions.
5. Existing queues are migrated with revision backfill; revision tracking is updated for queue inserts, updates and deletes.
6. The watcher maintains both a last observed SQLite data version and a last observed durable queue revision.
7. When SQLite's data version has not changed and there are no newly loaded or resumed threads, the watcher skips the more expensive queue-change lookup.
8. When the data version changes, the watcher queries queue revisions only for currently loaded thread IDs and advances its observed revision to the latest returned revision.
9. Newly created or resumed threads are explicitly reconsidered. Created-thread events are collected, and `on_thread_resume` records resumed thread IDs so their durable queues can be scanned from revision zero even if SQLite's global data version did not change during that runtime's observation window.
10. If the thread-created broadcast receiver reports lag, the watcher falls back to the manager's full loaded-thread ID list rather than assuming no threads were created.
11. Changed thread IDs are deduplicated before dispatch work is spawned.
12. The watcher keeps at most one active watcher-dispatch task per thread in its `dispatches` map; a still-running task suppresses a duplicate watcher task for the same thread.
13. Per-thread watcher tasks check whether the thread is in a state that should not be awakened (`Running`, `Interrupted`, `Shutdown` or `NotFound`) and exit in those cases.
14. For an eligible loaded thread, the task checks whether at least one queued item exists. If the queue is empty it exits; otherwise it calls the existing wake path.
15. If a queue check or wake attempt does not resolve the pending work, the per-thread watcher task sleeps 10 seconds and tries that thread again. This is a fixed retry interval in the demonstrated implementation, not exponential backoff.
16. Separate changed threads receive separate spawned dispatch tasks, so a blocked or repeatedly failing wake on one thread does not serialize all watcher progress behind that thread.
17. Existing queue dispatch locking and queue semantics remain responsible for thread-local dispatch serialization; the watcher is a discovery/wakeup mechanism rather than a new distributed transaction protocol.
18. Regression coverage includes cross-runtime writes, local edits to externally written items, independent dispatch of another thread, failed-wake retry, resumed-thread discovery, migration backfill, and revision changes after updates and deletes.
19. The revision tests demonstrate that `changes_since` can identify a thread after enqueue, produce a later revision after update, include another newly loaded thread, and report the original thread as changed again after deletion.
20. The commit does not claim distributed exactly-once delivery, consensus or a cross-host lease protocol.

## Mechanisms

### Two-level change detection

SQLite `PRAGMA data_version` is used as an inexpensive coarse signal that another connection changed the database. Durable per-thread queue revisions then identify which loaded queues changed. This avoids treating every poll as a full rescan while retaining a persistent per-thread change identity.

### Loaded/resumed thread reconciliation

A thread can become relevant without a new SQLite change occurring after the watcher starts observing. The watcher therefore also tracks newly created and explicitly resumed threads and scans their revisions from zero. This separates database-change detection from in-memory lifecycle discovery.

### Independent per-thread retry ownership

Each changed thread gets its own asynchronous watcher-dispatch task. A thread whose wake remains blocked can retry on the fixed interval without preventing other changed threads from being dispatched. The `dispatches` map prevents duplicate watcher loops for one thread while preserving cross-thread independence.

### Durable revisions across mutations

Revision ownership is tied to the durable queue and changes on insert, update and delete. The migration backfill gives pre-existing queues a revision baseline so the mechanism is usable across schema upgrade rather than only for newly created queues.

## Evidence

- Queue extension installation spawns `QueuedItemService::watch_external_messages`.
- The watcher polls every 10 seconds, reads `change_version`, queries `changes_since`, incorporates newly loaded/resumed threads, and spawns per-thread dispatch loops.
- SQLite queue storage implements change detection with `PRAGMA data_version` and durable thread revisions.
- Queue-store tests cover revision backfill and revision changes for updates/deletes.
- Lifecycle tests cover externally changed queues dispatching independently and retrying failed wakeups.
- The commit's own description explicitly states the goal that one blocked queue must not stall unrelated queues.

## Limitations

1. Detection is polling-based, so an external write is not guaranteed to wake an idle thread immediately; the demonstrated polling/retry interval is 10 seconds.
2. SQLite `data_version` is a change detector, not an identity of the exact write or writer. Per-thread revisions narrow the changed set but do not provide distributed authorship or causality.
3. The watcher concerns loaded/resumed threads known to one process. It is not a general distributed scheduler for threads that are absent from every runtime.
4. A per-thread watcher task exits for several agent states and relies on other lifecycle mechanisms to handle those states correctly.
5. A fixed retry interval is demonstrated; there is no evidence here of adaptive/exponential backoff, jitter or fleet-level load shaping.
6. Independent watcher tasks isolate blocked queues at the wake/retry layer, but this does not prove that all downstream shared resources are isolated from head-of-line blocking.
7. Durable revision changes show that a queue mutated; they are not an exactly-once execution token and do not prove that an item cannot be attempted more than once after crashes or races.
8. The change uses one SQLite-backed persistence domain. It does not establish equivalent semantics for a remote database, multi-primary store or partitioned cluster.
9. Existing FIFO tests establish queue ordering in the tested implementation, but the new watcher itself is not a global total-order protocol across different thread queues.
10. The tests are repository regression tests, not an external reliability benchmark under process crashes, network partitions or large-scale concurrency.

## Comparisons

- A purely in-memory wake signal is low latency but cannot discover writes made while another process owns the persistent queue. The merged design combines durable state with polling-based reconciliation.
- Polling every loaded queue on every interval would be simpler but more expensive. The two-level data-version/revision design first asks whether the database changed and then which loaded queues changed.
- A single global retry loop could let one blocked thread delay all other work. Per-thread watcher tasks preserve independent retry progress.
- A message-broker push notification could reduce polling latency, but the merged mechanism stays within the SQLite persistence architecture and therefore does not require a separate broker.

## Unresolved questions

1. What latency and database-load tradeoff led to the fixed 10-second polling interval, and is it configurable in production?
2. What happens after a process crashes between noticing a revision and successfully starting the queued turn?
3. Which existing queue/turn identities prevent or tolerate duplicate execution after crash recovery?
4. Can durable revisions grow without bound, and what maintenance or compaction semantics apply?
5. How are multiple runtimes prevented from simultaneously waking and attempting the same thread when they observe the same external change?
6. What fairness properties exist across many changed threads when the runtime is saturated?
7. Are revision reads and queue-item reads performed under an isolation level that can produce benign false positives or missed transitions under unusual SQLite timing?
8. How would this architecture map to a non-SQLite persistence layer where `PRAGMA data_version` has no equivalent?

## Reading boundary

This note establishes a merged, tested architecture for SQLite-backed durable thread queues: a runtime detects cross-connection changes with SQLite data version, narrows them with durable per-thread revisions, reconciles newly loaded/resumed threads, and runs independent fixed-interval wake/retry tasks so one blocked queue does not stall unrelated queues. It does not establish distributed exactly-once execution, consensus, global ordering across threads, zero-latency notification or crash-proof duplicate suppression. Those broader judgments belong to Skill 04 Analysis.
