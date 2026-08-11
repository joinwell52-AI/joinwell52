# Q-20260811-03 — Durable event identity and terminal-state evidence reduce ambiguous completion

- Runtime date: 2026-08-11
- Column: Open-source Engineering
- Source object: Q-20260811-03 / SIG-20260811-G-002
- Primary source: https://github.com/google/adk-python/commit/04b8b72709f6d17b503cf674c8ac1b89798f655e
- Evidence class: Fact from merged implementation and regression tests
- Stage: Skill 03 Deep Reading only

## Problem

Agent analytics can become unreliable when retries duplicate rows, stream acknowledgements are ambiguous, or terminal outcomes are represented only indirectly. The selected ADK change addresses two related evidence problems: stable event identity/delivery semantics for BigQuery analytics, and explicit terminal evidence for model and workflow-node completion or failure.

## Facts

1. The change adds an `event_id` field to the analytics schema and common event views.
2. `_log_event` assigns `uuid.uuid4().hex` to each emitted row before that row enters the asynchronous write path.
3. Tests verify that independently emitted rows receive distinct 32-character lowercase hexadecimal event IDs.
4. Retry tests verify that a BigQuery retry reuses the same already-created `event_id` for the retried row rather than generating a new identity.
5. The default delivery mode continues to rely on `event_id` as a query-time deduplication key; the new offset-based mode is opt-in.
6. `exactly_once_delivery` defaults to `False` and, when enabled, uses one loop-local committed stream with explicit offsets.
7. The writer tracks `_next_offset`, ambiguous-send state, desynchronization state, and a new `offset_conflict` drop counter.
8. On successful committed delivery, the next offset advances by the delivered row count.
9. If `AlreadyExists` occurs after an ambiguous send, the implementation treats that as confirmation of the retried batch at the same offset. If an occupied offset appears without a preceding ambiguous send, the stream is treated as desynchronized, the batch is counted as an offset conflict, and the stream is rotated.
10. `NotFound` and `OutOfRange` on the committed stream also desynchronize the stream and count the affected rows under `offset_conflict`.
11. Stream replacement is intentionally non-blocking with respect to finalizing the old stream. Failed replacement starts a 30-second rotation backoff; rows arriving during the backoff can be dropped.
12. The configuration documentation explicitly states that opt-in exactly-once delivery is not lossless: retry exhaustion, offset conflicts, replacement-stream failure, and the rotation backoff can all drop rows.
13. Final LLM responses can expose `finish_reason` and sanitized `error_message`. Partial streaming rows omit terminal finish metadata so one streamed turn does not double-count termination evidence.
14. Tests cover finish reasons including STOP, MAX_TOKENS, SAFETY, and MALFORMED_FUNCTION_CALL, and verify that terminal streaming metadata appears only on the final response row.
15. Final workflow-node results can emit `NODE_OUTPUT` and `NODE_ERROR` event types. Their views expose workflow identity fields such as node path, run ID, and parent run ID.
16. Tests verify that a function-node payload produces an identity-bearing `NODE_OUTPUT`, that state delta and node output can coexist as separate events, that node errors use the sanitized error column, and that both `NODE_ERROR` and `NODE_OUTPUT` are preserved when both exist.
17. Empty or message-delegated events do not automatically create extra `NODE_OUTPUT` rows.
18. Model finish/block diagnostics remain classified as `LLM_RESPONSE`; node terminal events are separated rather than overloading the model-response event type.

## Mechanisms

### Event identity before enqueue

Identity is assigned at row construction time before the queue/write/retry path. Because retry serializes and resends the same row, the ID survives ambiguous transport retries. This gives downstream queries a stable occurrence identifier even in the default mode where the storage layer itself may still accept duplicate physical rows.

### Opt-in committed-stream offsets

The optional delivery mode attaches an explicit offset to each batch on one loop-local committed stream. The local writer advances the offset only after delivery is confirmed. Ambiguous sends do not immediately advance local state; a later `AlreadyExists` at the same offset can confirm that the earlier append committed.

### Conflict isolation and stream rotation

An offset occupied without an ambiguous local send is treated as evidence that local offset assumptions are unsafe. Rather than guessing the next offset, the implementation marks the stream desynchronized, accounts for dropped rows, and rotates to a replacement committed stream. Replacement failure is bounded with a 30-second retry window rather than blocking the writer indefinitely.

### Explicit terminal evidence

LLM terminal metadata is projected only on final response rows, while workflow nodes get dedicated output/error events with node identity. This separates progressive model telemetry from terminal evidence and prevents partial SSE chunks from masquerading as multiple completions.

## Evidence

- Commit `04b8b727...` adds the schema/configuration, writer state machine, offset handling, event-ID creation, terminal LLM metadata, node event types, and tests in one implementation change.
- Regression tests explicitly verify event-ID uniqueness and retry stability, final-only finish metadata, workflow-node terminal event emission, and view/schema exposure.
- The configuration docstring in the implementation explicitly documents data-loss boundaries for opt-in committed-stream delivery.

## Limitations

1. The option name `exactly_once_delivery` is narrower than system-wide exactly-once semantics. The implementation itself documents row-loss cases and is scoped to one live processor/event loop and its committed stream.
2. The selected change does not establish durable offset recovery across process restart; the tracked offset and desynchronization state shown in the implementation are in-memory writer state.
3. Default mode does not prevent duplicate physical rows. It provides stable `event_id` values so duplicates from retries can be identified and deduplicated downstream.
4. Event IDs identify emitted analytics rows, not arbitrary external tool side effects or end-to-end business transactions.
5. A retry-exhausted or conflict-dropped event can still be missing from BigQuery even though the producing agent may have completed successfully.
6. `NODE_OUTPUT`/`NODE_ERROR` improve terminal observability but do not prove that every workflow implementation emits a semantically complete business outcome.
7. Sanitized error messages intentionally trade diagnostic detail for safer analytics storage; some root-cause information may remain outside this event stream.
8. Stream rotation consumes additional `CreateWriteStream` quota and can itself fail.

## Comparisons

- **No stable row identity:** transport retries can create indistinguishable duplicate analytics rows.
- **Stable `event_id` only:** duplicates remain possible at storage level but become identifiable for query-time deduplication.
- **Committed stream + explicit offsets:** narrows duplicate risk for ambiguous retries within the live writer, at the cost of stream state, conflict handling, rotation, quota, and explicit drop cases.
- **Implicit completion from generic events:** consumers must infer whether a model or workflow node actually terminated.
- **Explicit finish/node events:** terminal evidence becomes directly queryable while partial streaming rows remain non-terminal.

## Unresolved questions

1. How should offset state be reconstructed after a host crash or process restart without reintroducing ambiguity?
2. Is there a durable mapping between `event_id` and upstream ADK `Event` identity that survives analytics-plugin restarts?
3. What monitoring threshold should convert `offset_conflict`, retry-exhausted, or rotation-backoff drops into an operational alert?
4. How are analytics consumers expected to deduplicate default-mode rows by `event_id` across partitions or replay windows?
5. Do all workflow node types emit sufficient node identity to correlate `NODE_ERROR` and `NODE_OUTPUT` with one logical execution attempt?
6. What is the intended retention and privacy policy for sanitized terminal errors when they are used as governance evidence?

## Reading boundary

This note records implementation facts, retry/delivery mechanisms, explicit terminal evidence, data-loss boundaries, and unresolved questions only. It does not decide how TMPA, CodeFlowMu, or another runtime should adopt these mechanisms; that belongs to Skill 04 Research Analysis.
