# Q-20260812-01 — Acceptance-based queued work admission separates execution acceptance from persistence

- Runtime date: 2026-08-12
- Column: Digital Employee
- Source object: Q-20260812-01 / SIG-20260812-G-001
- Primary source: https://github.com/openai/codex/commit/da2803c73cd366b5e01ffe8d0e5f7d396247f827
- Evidence class: Fact for changed code, maintainer change description and tests; Inference only where explicitly labeled
- Stage: Skill 03 Deep Reading only

## Problem

A durable work queue needs an unambiguous boundary for when queued user intent stops being pending and becomes accepted execution work. The selected Codex change removes the previous requirement that queued-message admission wait for rollout persistence. Instead, admission resolves when Core accepts the submitted user input as either a new turn or a steer. This changes which failures belong to admission and when a durable queue entry can be deleted.

## Facts

1. The maintainer change description states that user-message admission now resolves when Core accepts the input as a new turn or a steer, without waiting for rollout persistence.
2. The change removes persistence-specific and prompt-hook-specific admission errors, including `RejectedByHook`, `TaskEndedBeforePersistence`, and `PersistenceFailed` from the admission path.
3. `submit_user_input_and_wait_for_admission` still checks execution capacity before registering and submitting the input. A session-loop termination while waiting now maps to `InternalAgentDied` rather than a persistence-specific admission failure.
4. The pending-admission registration is simplified: it is keyed by submission identity rather than carrying client-id plus persistence-state bookkeeping for the admission lifecycle.
5. The prior synchronous persistence branch in `record_pending_input` is removed. Recording the user prompt and additional contexts remains, but admission acknowledgement is no longer coupled to `flush_rollout()` success.
6. Queue-service behavior changes from conditional deletion after special hook rejection handling to deletion after successful Core admission. The code awaits admission and then calls `delete_locked(thread_id, queued_item_id)`.
7. The maintainer description explicitly says this deletion also applies to messages that are subsequently stopped by a prompt hook.
8. The previous queue-drain special case that treated `RejectedByHook` as a reason to delete and continue is removed because prompt-hook rejection is no longer an admission failure class.
9. Tests are updated around concurrent admission and queue-service behavior to assert acceptance-based admission instead of persistence-based admission.

## Mechanisms established by the source

### Execution-capacity gate precedes admission registration

The request does not become admitted merely because it exists in a durable queue. The path first calls the agent-control execution-capacity check. Only after that gate succeeds is a submission identity created, pending admission registered, and the input sent to the session loop. This preserves a distinction between queued intent and an input Core is prepared to process.

### Admission resolves at Core acceptance

The central state-machine change is that admission becomes an execution-level acknowledgement. A new turn or steer accepted by Core resolves the admission future. Rollout persistence is downstream of that boundary rather than a precondition for admission success.

### Queue deletion follows successful admission

For queued-item service, the durable queue entry is deleted after the admission future returns successfully. The queue therefore represents work not yet accepted by Core, not work whose initial input is guaranteed to have been durably flushed to rollout storage.

### Prompt-hook stop is downstream of admission

The source explicitly preserves the possibility that a prompt hook stops a message after Core has already accepted it. Because that is now downstream of admission, the queue item has already been removed and the admission result is not retroactively turned into a rejection.

### Persistence failure no longer defines admission failure

The previous path synchronously flushed rollout state when admission was waiting for persistence, propagated `PersistenceFailed`, and could stop turn processing. Those admission-specific persistence mechanics are removed. This does not prove that persistence is unimportant or absent elsewhere; it establishes only that admission no longer waits for that persistence confirmation.

## Evidence

- Commit `da2803c73cd366b5e01ffe8d0e5f7d396247f827` states the new acceptance-based admission contract and changes the relevant Codex thread, session, hook, admission and queued-item code paths.
- The queue-service diff shows `delete_locked(...)` immediately after successful admission, replacing the earlier branch that only specially deleted on hook rejection among admission failures.
- The session/hook diff removes synchronous rollout-flush acknowledgement from the admission path and removes hook/persistence-specific admission error variants.
- Updated concurrent-admission and queue-service tests are part of the same commit boundary.

## Limitations

1. The change does not establish end-to-end exactly-once execution. It defines when a queued message is considered admitted and removed from this queue.
2. Because queue deletion occurs after Core acceptance rather than after rollout persistence, the selected source alone does not prove what recovery guarantees exist if the process fails after acceptance but before later persistence completes.
3. The source does not establish whether all user-input entry points share the same durable queue; it covers the changed queued-user-message admission path.
4. It does not define a global idempotency key for external side effects, tool calls, or downstream application writes.
5. A successful admission does not mean a prompt hook, model turn, tool sequence, or task later completes successfully.
6. `InternalAgentDied` covers session-loop termination while waiting for admission, but the selected diff does not define all recovery behavior after that error.
7. The commit removes client-id-driven persistence admission bookkeeping; it does not by itself prove that client IDs are unused elsewhere for deduplication or tracing.

## Comparisons

- **Persistence-gated admission:** queue ownership transfers only after the initial input is durably flushed; persistence failure remains an admission failure.
- **Acceptance-gated admission:** queue ownership transfers when Core accepts the input; persistence and prompt-hook outcomes are downstream execution concerns.
- **Arrival-only semantics:** would delete work merely because it was submitted to the runtime; the changed code is stronger than that because execution-capacity and Core acceptance still precede successful admission.

## Unresolved questions

1. What durable recovery mechanism covers the interval after successful Core admission and queue deletion but before the accepted input is durably reflected in rollout state?
2. If Core accepts an input and a prompt hook then stops the turn, what durable evidence identifies that accepted-but-stopped outcome for later auditing?
3. Are accepted queued messages replayable after process crash, and if so from which state source rather than the original queue entry?
4. What idempotency or occurrence identity prevents an external retry from creating duplicate accepted work after an ambiguous client-side timeout?
5. Does steer admission have the same recovery guarantees as new-turn admission when the active turn terminates concurrently?
6. Which component owns retry policy after `InternalAgentDied` while a submission waits for admission?

## Reading boundary

This note establishes the changed admission, deletion, persistence and prompt-hook boundaries visible in the selected Codex commit. It does not decide whether a Digital Employee runtime should adopt acceptance-gated admission, persistence-gated admission, or a two-phase protocol; that judgment belongs to Skill 04 Research Analysis.
