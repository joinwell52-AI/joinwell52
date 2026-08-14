# Q-20260814-03 — Cancellation rollback is scoped to the whole prompt request, not the current continuation turn

- Runtime date: 2026-08-14
- Column: Open-source Engineering
- Source object: Q-20260814-03 / SIG-20260814-G-010
- Primary source: https://github.com/google-gemini/gemini-cli/commit/783f6cb494aedf3e7276d02e76f32f63a27551a0
- Evidence class: Fact for merged code and regression test; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

A multi-turn logical request can span an initial user/model exchange and one or more continuation calls carrying tool/function responses. Rolling back only the continuation call after cancellation can leave earlier parts of the same logical request in chat history even though the overall request was aborted. The selected change introduces a prompt-scoped rollback baseline so cancellation can restore the chat to the state before that logical request began.

## Facts

1. `GeminiChat` adds three pieces of prompt-scoped state: `lastPromptId`, `promptOriginalHistoryLength`, and `promptOriginalTokenCount`.
2. `sendMessageStream` still records a per-call `historyLengthBefore` and `baselinePromptTokenCount`, but now also establishes a broader baseline tied to `prompt_id`.
3. When a new `prompt_id` differs from the previous one, the previous prompt baseline is cleared before the new prompt establishes its own original history/token position.
4. For the first call carrying a prompt ID, `promptOriginalHistoryLength` is set to the current agent-history length and `promptOriginalTokenCount` to the current last-prompt token count.
5. Continuation calls using the same prompt ID retain that original baseline rather than replacing it with the continuation's immediate pre-call history length.
6. The method already serializes sends through `this.sendPromise`, so a later call waits for the previous message stream to finish before entering the next send operation on the same `GeminiChat` instance.
7. Function responses are recorded as synthetic user messages with durable IDs and linear history; therefore a continuation can add history that belongs to the same logical prompt request.
8. The outer stream error handler now classifies cancellation broadly when the abort signal is set, `isAbortError(error)` is true, or the error name is `CanceledError` or `FatalCancellationError`.
9. If the error is classified as aborted and an original prompt baseline exists, `agentHistory.rollback(originalLength)` removes history added since the beginning of the logical prompt request, not merely since the current continuation call.
10. After rollback, `chatRecordingService.updateMessagesFromHistory(this.agentHistory.get())` synchronizes the recorded message view with the truncated agent history.
11. The prior prompt token count is restored when an original token baseline exists.
12. After cancellation rollback, all three prompt-scoped fields are cleared, preventing the aborted request boundary from being reused by the next request.
13. Non-cancellation errors retain narrower pre-existing behavior: when the current input is not an original function response, history rolls back only to `historyLengthBefore` and the current call's token baseline.
14. The new regression test starts an initial user prompt under one prompt ID, consumes a successful model response, and verifies that two history entries were added.
15. The test then sends a continuation under the same prompt ID containing a `functionResponse` whose payload says the tool result was successful.
16. During the continuation stream, a partial model response is yielded, the abort controller is triggered, and an error is thrown.
17. The test consumes the continuation until it rejects and then asserts that `agentHistory.length` returns all the way to the original pre-prompt length, removing the initial user/model exchange as well as the continuation history.
18. The commit changes only `geminiChat.ts` and its regression test; it does not add a compensating transaction to the scheduler, tool runtime, filesystem, network services or external APIs.
19. The rollback target is therefore local chat/request state represented by `agentHistory`, the synchronized chat recording, and `lastPromptTokenCount`.
20. A tool/function side effect that already occurred before its function response is supplied is not reversed by this code. The test's `functionResponse` may describe success, but the source contains no external rollback mechanism.
21. The boundary is keyed by `prompt_id`. Calls that intentionally share a prompt ID are treated as one rollback scope; a different prompt ID starts a new scope.
22. Successful continuations do not clear the original prompt baseline immediately. The baseline remains available across same-ID continuations and is reset when a different prompt ID begins or when cancellation aborts the request.

## Mechanisms

### Prompt-scoped transaction marker

`prompt_id` serves as the logical request identity. The first call establishes the pre-request history/token baseline; subsequent calls with the same ID inherit that boundary.

### Whole-request rollback on cancellation

Cancellation restores `agentHistory` to the prompt's original length rather than the current continuation's start. This removes partial model output, tool-response history and earlier model/user history from the same logical request.

### Recording synchronization

Rollback is followed by `updateMessagesFromHistory`, so the persistent/recording representation is rewritten from the surviving agent history rather than retaining removed chat messages in the ordinary message view.

### Token-accounting restoration

The request also snapshots and restores `lastPromptTokenCount`, keeping token accounting aligned with the restored history boundary.

### Cancellation-class normalization

The code recognizes several cancellation forms instead of relying on one error type. The abort signal itself is sufficient to select full prompt rollback.

## Evidence

- `packages/core/src/core/geminiChat.ts` defines the prompt identity/baseline fields, baseline establishment, cancellation classification, whole-request rollback, recording synchronization and token restoration.
- `packages/core/src/core/geminiChat.test.ts` adds a regression that proves a successful first exchange plus a later aborted function-response continuation returns history to the state before the original prompt.
- The merged change contains only those two files, tightly bounding what is and is not recovered.

## Limitations

1. The change provides history/request rollback, not a distributed transaction across model calls, tools, files, databases or external services.
2. Tool side effects that occurred before cancellation remain outside this rollback boundary; the code only removes their function-response representation from chat history.
3. Exactly-once execution is not established. A caller retrying the logical request after rollback must separately reason about already-executed external work.
4. Correct scoping depends on correct `prompt_id` usage. Reusing one ID across unrelated work could make the rollback scope too broad; changing IDs inside one logical request could make it too narrow.
5. The selected regression covers one initial exchange plus one function-response continuation. It does not exhaustively test arbitrary nesting depth, multiple tool continuations, parallel tool effects or process restart.
6. The prompt-scoped baseline is in-memory `GeminiChat` state. The selected change does not demonstrate restoration of that transaction boundary after process restart.
7. Non-cancellation stream/API failures retain different rollback semantics, so 'request-level transaction' is not a universal error policy.
8. `chatRecordingService.updateMessagesFromHistory` synchronizes recorded messages but does not prove that every telemetry, audit or external logging sink removes already-emitted events.
9. A partial model response may already have been streamed to a UI or consumer before rollback; this code cannot retract what an external consumer has observed.

## Comparisons

- Per-call rollback restores only the current continuation boundary and can leave earlier turns from an aborted logical request. The new prompt baseline deliberately spans those continuations.
- A database transaction can atomically undo data mutations under one storage authority; this mechanism has no equivalent authority over external tool effects.
- Compensating actions could reverse some external effects after cancellation, but the selected source implements no compensation layer.
- Idempotency keys could reduce duplicate external effects when retrying after cancellation; `prompt_id` here is a history rollback key, not proven external idempotency metadata.

## Unresolved questions

1. Should prompt-level rollback metadata itself be durable so a process restart can preserve the same cancellation boundary?
2. How should tool executions publish idempotency or compensation metadata so a retried prompt does not repeat already-completed external effects?
3. Which non-cancellation failures should also trigger whole-request rollback rather than the current narrower behavior?
4. Should streamed partial output be explicitly marked invalidated after rollback for downstream consumers that already observed it?
5. What invariant guarantees that one logical request always reuses one prompt ID and unrelated requests never reuse it?
6. How should parallel or nested tool execution interact with a single linear history rollback baseline?
7. Which audit records should remain immutable even when user-visible chat history is rolled back?

## Reading boundary

This note establishes only the merged Gemini CLI mechanism: calls sharing one prompt ID retain a pre-request history/token baseline, recognized cancellation restores local chat state to that baseline, recording state is synchronized, token accounting is restored and the prompt boundary is cleared. The source does not roll back external side effects, guarantee exactly-once retries, make the request transaction durable across restart or define a general compensation protocol. Those questions belong to Skill 04 Analysis.
