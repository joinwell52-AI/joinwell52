# Q-20260830-01 — Nested HITL continuation identity across workflow and agent-tool boundaries

- Runtime date: 2026-08-30
- Column: Digital Employee
- Source object: Q-20260830-01
- Primary source: https://github.com/google/adk-python/commit/6d145180611956b2065704189517fd6a0ff1a063
- Evidence class: Reproducible Engineering Evidence / merged maintainer change
- Reading stage only; no Research Analysis or publication authorization.

## Research question

Which continuation state must remain durable and correctly bound so that a nested human-in-the-loop pause can resume the intended workflow/tool frame after intervening turns, without attaching the answer to the wrong call or incorrectly replaying work?

## Problem

A resumable agent may have more than one outstanding or historical tool interaction, including long-running calls and nested HITL prompts raised on sub-branches. A resume implementation that only inspects the last one or two events, or that matches a nested answer using a loose identifier test, can mistake an unanswered call for a completed one, pause forever, replay a call that already ran, or associate a human response with the wrong nested frame.

## Facts and mechanisms verified from the merged change

1. The change introduces an explicit `ResumeAction` state machine with `CONTINUE`, `PAUSE`, and `REPLAY_CALLS`, plus a `ResumeDecision` carrying the specific event to replay when required.
2. Branch-to-call matching parses the branch path into whole `run_id` components. A substring match is explicitly rejected by unit test; a branch belongs to a call only when the complete call id appears in the parsed branch identity.
3. Resume evaluation scans historical pause events rather than a fixed two-event window. Long-running tool ids are included in the awaited set, and a pause remains unresolved until all awaited ids are covered by responses.
4. The flow searches backward for the most recent tool-call event owned by the current flow, then finds an answer by exact response id, by response name when the response carries no id, or by a recognized HITL response located on the sub-branch opened by the original call.
5. A user-authored response on the branch opened by a call is treated differently from an unrelated branch or an agent-authored event. Tests cover both positive and negative branch cases.
6. When a nested HITL answer arrives on the sub-branch, the decision can become `REPLAY_CALLS` rather than `PAUSE`. The flow then reissues the relevant function calls using fresh event ids; the replay event is explicit, and a `REPLAY_CALLS` decision without an event raises an error.
7. The prior `base_llm_flow` behavior documented a known limitation: a long-running operation followed by multiple text events could place the actual pausing call outside the previous-two-events window. The new decision helper replaces that bounded lookback.
8. Tests cover unanswered/answered long-running calls, plain unanswered calls, id-less matching by tool name, branch-derived HITL answers, unrelated branches, parallel calls, replay-vs-pause behavior, and the missing replay-event invariant.
9. The same commit removes the skip from a nested multi-HITL workflow-as-tool test, providing end-to-end regression coverage for the previously unsupported path in addition to unit coverage of event matching.

## Evidence boundaries

- This is repository-level implementation and test evidence from a merged maintainer change. It supports the behavior of the changed ADK resume path; it is not independent validation of all HITL systems.
- `REPLAY_CALLS` deliberately re-executes a call when the event history indicates the call was not actually completed. The commit does not establish universal exactly-once external effects for arbitrary tools; correctness still depends on the observable event history and the tool's own effect semantics.
- The branch identity evidence proves how this implementation binds nested responses to calls. It does not authenticate the human principal who supplied the response or prove that the person was authorized to approve the underlying action.
- Fresh event ids on replay prevent reuse of the old event identity; they do not by themselves prove that an external side effect from a prior ambiguous execution never occurred.

## Failure and negative evidence preserved

- Fixed two-event resume windows are insufficient when the pausing call is older than intervening text events.
- Substring id matching can bind a branch to the wrong call when one id is contained inside another.
- A HITL response name alone is insufficient; the branch relationship matters.
- An id match with the wrong tool response name can signal that the target call still requires replay rather than being safely complete.
- Parallel calls require considering all call names/ids; matching only the first call can cause duplicate replay.

## Comparison

Compared with a simple checkpoint/resume model that restores only the latest state snapshot, this mechanism treats continuation as an event-identity problem: durable state is not enough unless the runtime can reconstruct which call is outstanding, which branch owns the human answer, and whether the next operation is pause, replay, or continue. This is a mechanism comparison, not a claim that ADK provides a complete authorization model.

## Unresolved questions for Analysis

- Should a governed digital employee model continuation authority as a first-class tuple such as `(workflow frame, call occurrence, branch identity, responder evidence, effect state)` rather than merely as resumable state?
- What external effect evidence is required before a replay decision is safe for non-idempotent tools?
- How should cancellation or abandonment invalidate an old nested approval so that a late response cannot attach to a no-longer-authoritative frame?
- What principal/approval evidence must accompany the branch-bound response if the resumed action is security-sensitive?
