# Q-20260814-01 — Persistent thread queues separate durable work identity from dispatch authority

- Runtime date: 2026-08-14
- Column: Digital Employee
- Source object: Q-20260814-01 / SIG-20260814-G-001
- Primary source: https://github.com/openai/codex/commit/9341b38310c73957e1313eab3f7c4034689bdec9
- Evidence class: Fact for merged code and tests; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

A long-lived agent thread needs a durable place to retain user work that cannot start immediately, while still preserving explicit operator control and preventing interruption from silently becoming permission to continue. The source addresses this with an experimental persistent per-thread queue rather than by treating pending messages as transient in-memory turn input.

## Facts

1. The app-server protocol adds experimental `thread/queue/add`, `list`, `update`, `delete`, `reorder`, and `start` requests plus a `thread/queue/changed` notification.
2. Queue requests are capability-gated behind the experimental app-server handshake.
3. Each queued submission exposes both a queue item `id` and a `clientUserMessageId`; a missing client ID is generated before persistence.
4. Updating a queued item preserves its existing client message ID while replacing the payload.
5. Queue storage is backed by the thread-store queue abstraction rather than by the app-server connection, allowing queued state to outlive one server process.
6. The integration test `cold_thread_resume_dispatches_a_persisted_queued_submission` creates a thread, drops the first app-server process, queues work against the stored thread from a new process, resumes the thread, and verifies that the queued user message starts with the same client ID and content.
7. Queue list is ordered and paginated; the default/max list limits are inherited from the thread list processor.
8. Reorder requires the caller to provide every queued submission exactly once. Partial or duplicate reorder specifications are rejected.
9. The queue has a hard capacity of 100 submissions in the tested local store path.
10. Queue mutations emit `thread/queue/changed`; the notification contains the thread ID rather than embedding the whole queue.
11. Dispatch is serialized per thread through an async mutex, preventing concurrent enqueue/start/idle-dispatch paths from independently consuming the same head item.
12. Automatic dispatch always examines the first persisted queue record and calls Core `start_turn_if_idle`.
13. A queued item is deleted only after Core reports `Started`. If Core reports a not-submitted reason or returns an error, the item remains queued.
14. Invalid serialized queue records or non-user queue records are discarded with warnings instead of being submitted as turns.
15. Adding an item to a loaded thread may wake idle lifecycle processing, but the wake is suppressed when the thread's agent status is `Interrupted`.
16. The queue lifecycle contributor returns immediately for `ThreadIdleCause::Interrupted`; other idle causes are eligible for dispatch.
17. The commit changes failed-turn behavior: `ThreadIdleCause::Failed` is no longer treated like interruption, so a queued message may continue after a failed turn.
18. Core maps explicit interruption and budget-limited aborts to the `Interrupted` idle cause, preserving the queue rather than auto-dispatching it.
19. Tests verify that interruption preserves all queued submissions and that simply adding more queued work after interruption does not resume automatic dispatch.
20. `thread/queue/start` gives the operator an explicit resume path after interruption. With no item ID it starts the head; with an ID it can start a non-head item.
21. Explicit start requires the thread to be loaded and idle. Starting while an active or pending turn exists returns a busy error and leaves the queue unchanged.
22. Once an explicitly started queued turn completes, ordinary idle lifecycle processing can continue draining remaining queued work.
23. An ordinary new turn that matches queued content does not implicitly consume the queued item; queued work remains until the ordinary turn completes and lifecycle dispatch subsequently processes the queue.
24. The source validates user-input URLs, total text size, local attachment snapshots, archived/ephemeral thread restrictions, and direct-input restrictions for spawned sub-agents.

## Mechanisms

### Durable identity

The queue persists a serialized `TurnInput` under a stable queue item ID. A separate client message ID survives update and dispatch so the eventual turn can still be correlated to the original user submission.

### Dispatch authority at the Core boundary

Persistence does not itself authorize execution. The queue service attempts `start_turn_if_idle`, and only a returned `Started` state authorizes deletion of the persisted queue record. This separates durable pending work from execution admission.

### Per-thread serialization

A per-thread dispatch mutex surrounds enqueue/start and idle-dispatch critical sections. The mechanism narrows duplicate-consumption races without requiring a global queue lock across unrelated threads.

### Interruption as an explicit pause state

`Interrupted` is the one idle cause that bypasses automatic queue dispatch. Explicit interruption and budget-limited aborts therefore preserve pending work. Resumption requires a later eligible lifecycle event or an explicit `thread/queue/start` action.

### Lightweight observability

Mutation notifications communicate that the queue changed while clients obtain the authoritative ordered contents through `thread/queue/list`. This avoids making a notification payload itself the state source.

## Evidence

- `app-server/src/request_processors/thread_queue_processor.rs` defines queue APIs, thread eligibility checks, explicit start behavior and API identity mapping.
- `ext/queue/src/service.rs` defines persisted queue operations, per-thread dispatch locks, automatic dispatch, interruption gating and deletion-after-start semantics.
- `core/src/tasks/lifecycle.rs` converts the current session state into an idle cause and prevents lifecycle dispatch while a turn or trigger-turn mailbox work is active.
- `app-server/tests/suite/v2/thread_queue.rs` covers experimental gating, CRUD, identity preservation, reorder integrity, pagination, capacity, notification behavior, cold-thread resume, interruption pause, explicit start and busy-start preservation.
- `ext/queue/tests/queue_service.rs` in the merged change verifies that failed idle processing can dispatch queued work while interrupted idle processing preserves it.

## Limitations

1. The APIs are explicitly experimental; the selected source does not establish a stable public compatibility contract.
2. Persistence is scoped to the repository's thread-store/queue-store implementation. It does not establish distributed queue replication or multi-node consensus semantics.
3. The per-thread mutex serializes dispatch only inside the running service process; the source does not prove cross-process mutual exclusion for concurrent writers.
4. Deleting a queue record after Core reports `Started` does not prove exactly-once completion of model/tool side effects after a later crash.
5. Failed turns are eligible for automatic continuation. Whether every failure class should permit autonomous progression is a policy question not resolved by this mechanism.
6. Interruption is a deliberate pause, but a later eligible lifecycle event or explicit operator start can resume processing; the queue is not a permanent stop state.
7. The queue capacity and local storage behavior are implementation limits, not a general digital-employee workload model.
8. Queue change notifications identify the thread only; a client must re-read state and handle races between notification and list.
9. The selected source does not define task priorities, deadlines, dependencies, SLA policy or cross-thread scheduling.

## Comparisons

- A transient input buffer can defer a turn but cannot provide the demonstrated restart/cold-resume persistence and stable submission identity.
- Auto-dispatch on every idle condition would conflate interruption with permission to continue; the selected implementation makes interruption a pause boundary.
- Removing a queue item before Core accepts the turn would create a loss window. This implementation removes it only after `start_turn_if_idle` returns `Started`.
- Treating a normal user turn as implicit queue acknowledgement would couple content equality to work identity; the tests intentionally keep queued identity separate.

## Unresolved questions

1. What cross-process or distributed lease is required if multiple app-server instances can operate on the same durable thread queue?
2. Should failure classes be policy-addressable instead of all non-interrupted idle causes being eligible for auto-dispatch?
3. How should a digital employee expose deadlines, priority, dependency and cancellation semantics without weakening stable queue identity?
4. What recovery evidence is needed when Core accepted a queued turn but the process crashes before its completion is durable?
5. Should interruption carry an explicit reason and resumption authorization token so operators can distinguish manual pause, budget exhaustion and policy stop?
6. How should queue-change consumers detect missed notifications and reconcile against authoritative persisted state?

## Reading boundary

This note establishes only the merged Codex mechanism: durable per-thread queued submissions retain stable identity, queue mutations are explicit and observable, dispatch is serialized per thread, Core idle admission controls removal, completed or failed idle states may advance FIFO work, and interruption/budget-limited abort preserves the queue until later authorized resumption. Broader digital-employee scheduling, exactly-once guarantees, distributed coordination and responsibility policy belong to Skill 04 Analysis.
