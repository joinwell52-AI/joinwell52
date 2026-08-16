# Q-20260816-02 — Reserved thread identity lets host metadata exist before thread materialization

- Runtime date: 2026-08-16
- Column: Industry Architecture
- Source object: Q-20260816-02
- Primary source: https://github.com/openai/codex/commit/fcdae21073bac8613b3418047fc3e2a3e15cb6f0
- Evidence class: Fact for merged code/tests; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

A host may need to attach its own metadata to an execution object before Core has fully created that object. Without an identity that exists before materialization, the host either waits until creation finishes or keeps an external correlation that can race with startup. The selected Codex change introduces a reserved thread identity and a bounded pending-metadata lifecycle so host-owned state can be associated before the first durable thread metadata update.

## Facts

1. `ThreadManager::reserve_thread_id()` allocates a thread ID before thread startup.
2. `StartThreadOptions` gains `reserved_thread_id`; new, cleared and forked histories may use that reserved identity instead of generating another ID.
3. Supplying a reserved ID while resuming an existing thread is rejected as an invalid request. Resume continues to derive identity from the resumed conversation.
4. Normal ID generation remains available when no reserved ID is supplied; tests verify reserving one ID does not change the semantics of later generated IDs.
5. The `ThreadStore` interface gains staging/removal operations for host-owned metadata associated with a reserved ID.
6. The local thread store keeps staged metadata in a pending registry keyed by thread ID.
7. Staging requires the state database. A store without the state database rejects pending metadata rather than silently degrading to an untracked in-memory promise.
8. Staging rejects a `rollout_path` override. The host staging channel therefore cannot preassign that materialization-owned path through this patch.
9. On metadata update, the store locks pending metadata for the thread, clones the staged patch, then merges the observed update into that staged patch before applying it.
10. The staged values therefore participate in the first successful metadata update, while values supplied by the actual update can supersede overlapping staged fields according to `ThreadMetadataPatch.merge` semantics.
11. Tests show a staged name/provider combined with an observed model update persists the staged fields and the observed update rather than dropping either side.
12. Rollout-compatible metadata such as memory mode is carried into the materialized session metadata and tested through the rollout path.
13. After a successful metadata update path consumes the pending patch, the pending registry entry is removed.
14. Removal occurs on multiple successful-return paths, including updates that do not require rollout compatibility, so consumed pending state is not left behind merely because the update took a shorter persistence path.
15. An unmaterialized live thread that shuts down clears pending metadata when no rollout was created.
16. Discarding a live thread also clears pending metadata.
17. If checking rollout existence fails during shutdown, the implementation conservatively preserves pending metadata rather than deleting it on uncertain materialization evidence.
18. Lock ordering was changed so pending-metadata and live-writer coordination does not deadlock during rollout-compatible updates; a dedicated regression test covers this case.
19. Tests cover persistence, merge behavior, rollout-compatible metadata, cleanup on idle shutdown/discard, missing state DB, invalid rollout-path staging and consumption of pending state.

## Mechanisms

### Pre-materialization identity reservation

The host reserves the same `ThreadId` that Core will later use for a new thread. This creates a stable correlation point before session creation without creating a second alias that must later be reconciled.

### Host-owned pending registry

Metadata is staged against the reserved identity in a dedicated pending registry. It is explicitly described as host-owned state and remains separate from the fully materialized thread record until a real metadata update occurs.

### Merge at first durable update

When Core performs the first successful metadata update, the store begins with the staged patch and merges the observed update into it. This allows pre-start metadata to survive while still allowing actual startup observations to fill or override fields as the patch merge rules require.

### Consume-or-clean lifecycle

Pending metadata is removed after successful consumption, after discard, and after shutdown when no rollout materialized. If the store cannot prove that no rollout exists, it preserves pending state rather than destroying possibly needed metadata.

## Evidence

- Commit description explicitly states the goal: associate host-owned state with a thread before Core starts it.
- `StartThreadOptions` and `ThreadManager::reserve_thread_id()` implement identity reservation and reject reserved IDs on resume.
- `ThreadStore` / `LocalThreadStore` add pending metadata staging and removal.
- `update_thread_metadata` locks the pending entry, merges staged and observed patches, and removes pending state after successful consumption.
- live-writer shutdown/discard paths clear unmaterialized pending metadata.
- regression tests cover merge/persistence, rollout compatibility, cleanup, state-db requirement, invalid rollout-path staging and deadlock avoidance.

## Limitations

1. The reserved identity mechanism is scoped to Codex threads; it is not evidence for a general distributed object-reservation protocol.
2. Pending metadata requires the local store's state database and is not guaranteed by every possible `ThreadStore` implementation.
3. The patch does not make staged metadata immutable or authoritative over later observed metadata; merge semantics intentionally allow the actual update to participate.
4. Rejecting `rollout_path` means not every piece of thread metadata is host-stageable before materialization.
5. Cleanup is local lifecycle hygiene, not a distributed garbage-collection guarantee across crashed hosts or replicated stores.
6. Preserving pending state when rollout existence cannot be checked avoids destructive cleanup but can leave stale state requiring later reconciliation.
7. Reserving an ID establishes correlation, not proof that the thread will eventually materialize successfully.

## Comparisons

- Generating identity only after startup forces the host to maintain a temporary correlation and creates a handoff point. Reserving the final thread ID removes that identity translation.
- Persisting staged metadata directly as if the thread already existed would conflate reservation with materialization. The pending registry keeps those states separate until the first real update.
- Unconditionally deleting pending state at shutdown would risk losing host metadata when materialization status is uncertain. The implementation deletes only when it can establish the relevant cleanup condition.

## Unresolved questions

1. Should pending metadata have an explicit TTL or recovery sweep after host crashes?
2. Which metadata fields are host-owned, Core-owned or mergeable, and should those ownership rules be machine-declared rather than implicit in patch semantics?
3. How should reserved-but-never-started IDs be audited or reclaimed in long-lived state databases?
4. What concurrency guarantees are required if multiple host components stage metadata for the same reserved ID?
5. Should materialization emit a durable event that explicitly closes the reservation phase for external observers?

## Reading boundary

This note establishes the merged Codex mechanism only: a host can reserve a new thread ID, stage bounded metadata against that identity before Core starts the thread, merge it into the first successful metadata update, and clean pending state on consumption or unmaterialized termination. It does not establish a cross-system reservation protocol, distributed transaction, immutable metadata ownership, or guaranteed materialization. Those broader architectural judgments belong to Skill 04 Analysis.
