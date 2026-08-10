# Q-20260810-01 — Durable RunState resume preserves admitted input and execution evidence

- Runtime date: 2026-08-10
- Column: Digital Employee
- Source object: Q-20260810-01 / SIG-20260810-G-004
- Primary sources:
  - https://github.com/openai/openai-agents-python/pull/4325
  - https://github.com/openai/openai-agents-python/commit/7bf73afa47ac48c1efb599d0b1505cee994e74f5
  - https://github.com/openai/openai-agents-python/issues/4323
- Evidence class: Fact (merged implementation and maintainer-authored issue/PR)
- Stage: Skill 03 Deep Reading only

## Problem

A resumable agent run previously had no durable way to accept late input while preserving the same `RunState` boundary. Starting a new run could preserve Session history, but it changed the run boundary; `call_model_input_filter` could alter the next prepared request but did not itself make the new input durable across Session, serialized `RunState`, replay, and server-managed conversation ownership.

## Facts

1. PR #4325 is merged as commit `7bf73afa47ac48c1efb599d0b1505cee994e74f5` and adds durable pending input through `RunState.add_input()`.
2. Pending input is stored in `RunState`, survives serialization/deserialization, and is not admitted while an existing model request or tool execution is still active.
3. Admission occurs only immediately before the next model call, after unfinished work such as approval resolution and approved tool execution has completed.
4. The receiving agent's input guardrails and configured input guardrails run at this new admission boundary. A guardrail failure prevents the next model call and leaves the pending input recoverable rather than silently consuming it.
5. The implementation adds `InputItem` with a generated durable `input_id`, documented in code as an occurrence identifier for exactly-once conversation tracking.
6. The resume path copies `_pending_input` and `_current_step` when converting results back into state. Non-streaming results also preserve pending input/current-step data for later `RunState` reconstruction.
7. The runner records accepted-model-response and tool-progress state so a retry can continue without re-sending already admitted pending input or replaying completed side effects.
8. The PR states that streaming and non-streaming resume paths share the same pending-input behavior.
9. Terminal states that cannot reach another model call reject new pending input before mutation. A conversation strategy that cannot preserve required ordering/exactly-once semantics is expected to reject the operation rather than drop or duplicate input.

## Mechanisms

### Durable occurrence identity

`InputItem.input_id` is generated once and travels with the admitted item. The server-conversation path can therefore distinguish the occurrence of a late input from another content-identical input. The implementation changes prepared-item source tracking from content-only pairs to a structure that also carries source identity.

### Admission after unfinished work

The state keeps pending input separate until the next model-call boundary. The intended order is: resolve existing interruption/approval work, execute already-admitted tools, record their outputs, run guardrails for the newly pending input, admit it, then make the next model request.

### Checkpointed execution evidence

The resume path persists model responses, processed response state, generated/session items, current turn, and current step. The implementation also expands unsent tool-call tracking to `NextStepRunAgain`, so locally completed tool outputs that have not yet reached a server-managed conversation remain identifiable across resume/retry boundaries.

### Exactly-once scope

The primary sources define exactly-once at SDK-owned conversation/session admission boundaries: client Session persistence, normalized replay/state, and server-managed conversation deltas. This is not a claim of distributed exactly-once execution for arbitrary external tools.

## Evidence

- PR #4325 explicitly states: pending input is serialized with state, admitted before the next model request after unfinished work, guardrailed, and persisted exactly once across client-managed Sessions and server-managed conversations.
- Issue #4323 specifies the required ordering and acceptance tests, including no duplicate tool execution, serialization round-trip, exactly-once Session/server continuation, guardrail recovery, streaming/non-streaming equivalence, retry without duplicate admitted input, and terminal-state rejection.
- Commit `7bf73afa...` implements `InputItem`, pending-input state transfer, admission/commit helpers, current-step preservation, and retry/resume checkpoint handling.

## Limitations

1. The merged code and regression tests establish intended SDK behavior, not production reliability under arbitrary storage failures, process crashes, or distributed worker races.
2. Exactly-once is scoped to SDK-owned admission/conversation bookkeeping. External tool side effects still require their own idempotency or transactional boundary.
3. This mechanism does not support thread-safe injection into a live model request or live tool execution, and it is not an SDK-owned cross-thread message queue.
4. Arbitrary conversation history replacement and compaction are explicitly outside this feature.
5. Applications that do not need the same resumable `RunState` boundary can still use the simpler supported pattern: finish/cancel after a turn and start a new run with the same Session and late input.

## Comparisons

- **New run with same Session:** simpler and already supported, but creates a new run boundary and does not preserve the same resumed-run turn/trace state.
- **`call_model_input_filter`:** suitable for changing the next model payload, but by itself does not create a durable input occurrence across Session, replay, serialized state, and server conversation ownership.
- **Durable pending input:** preserves the existing resumable run boundary and adds an explicit admission point with identity, guardrails, ordering, and persistence semantics.

## Unresolved questions

1. What crash points between local admission, Session persistence, and server-conversation commit have been tested under real process termination rather than in-process exceptions?
2. What idempotency contract is expected of external tool implementations when a resumed run crosses a host/process boundary?
3. How will future serialized `RunState` schema versions preserve compatibility for new pending-input/checkpoint fields?
4. What observability surface exposes `input_id` and admission/checkpoint transitions to application-level audit logs?

## Reading boundary

This note records source facts, implementation mechanisms, limitations, and unresolved questions only. It does not decide how TMPA, CodeFlowMu, or a Digital Employee runtime should adopt the mechanism; that belongs to Skill 04 Research Analysis.
