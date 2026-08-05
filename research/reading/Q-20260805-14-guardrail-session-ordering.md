# Reading Record — Q-20260805-14 Persist governed session state only after output guardrails complete

- **Queue item:** `Q-20260805-14`
- **Column:** Open-source Engineering
- **Selection status:** Selected
- **Priority:** P0
- **Skill invoked:** `Skill 03 — Deep Reading`
- **Operating date:** 2026-08-05 (Asia/Shanghai)
- **Primary source class:** merged maintainer commit and tests in `openai/openai-agents-python`

## Reading scope

This pass reads commit `69e26269f52a1fde684154376d77e5a21b507c19`, including its implementation changes and tests. It identifies the actual persistence ordering, the special handling of blocked output, error and cancellation paths, and the limits of the demonstrated guarantee. It does not prescribe a CodeFlowMu transaction design.

## Deep Reading output

```yaml
reading_notes:
  problem:
    - Before this fix, the non-streamed runner could persist final-turn output before output guardrails completed.
    - A later guardrail rejection could therefore leave a durable assistant message that the governed run was not permitted to deliver.
    - Resumed runs add a second risk: already-persisted tool items may be duplicated or omitted when the final turn is saved after guardrail evaluation.

  facts:
    - The commit message is "fix: defer non-stream session saves until output guardrails (#4184)".
    - The main non-streamed finalization path no longer saves a `NextStepFinalOutput` turn before running output guardrails.
    - A new helper, `save_final_turn_items_after_guardrails`, performs the deferred save.
    - The helper exits when session persistence is disabled, no items exist or input guardrails have already triggered.
    - For resumed state with a positive persisted-item count, the helper calls `save_resumed_turn_items` and updates the persisted count.
    - For a fresh final turn, the helper calls `save_result_to_session` after the guardrail path determines which items may be retained.
    - Tests were added or expanded in `tests/test_agent_runner.py` and `tests/test_agent_runner_streamed.py`.

  vendor_claims: []

  mechanisms:
    - When output guardrails pass, the final-turn items are persisted after guardrail execution.
    - When `OutputGuardrailTripwireTriggered` is raised, the runner filters the turn through `_retained_items_for_blocked_output`, saves only retained items and re-raises the tripwire.
    - A rejected assistant message is withheld, while already-executed tool-call and tool-output records can be retained.
    - When the guardrail raises an arbitrary exception or the task is cancelled, the completed final turn is persisted for replayability before the exception or cancellation is re-raised.
    - Resumed-turn persistence uses the previous persisted-item count so tool items already saved before interruption are not written again.
    - Reasoning associated with a rejected message is removed, while reasoning associated with retained tool execution can remain with that retained record.

  evidence:
    - A synchronous tripwire test asserts that the session contains the user item but not the rejected assistant message.
    - Guardrail-error and cancellation tests assert that the final assistant message remains in the session for replayability.
    - A resumed final-output test asserts that an accepted assistant message is persisted exactly once.
    - Resumed final-tool tests cover both passing and tripped output guardrails and assert one ordered record of each tool call and output.
    - Streamed and non-streamed tests now share blocked-message and mixed final-turn expectations.
    - Mixed final-turn tests assert that executed tool records remain durable even when the accompanying assistant message is rejected.

  limitations:
    - The tests use fake models and `SimpleListSession`; they do not establish transactional behavior for external databases, networked stores or concurrent writers.
    - The change does not show atomic coupling between guardrail completion and the storage commit; a crash can still occur between those operations.
    - Tool side effects are not rolled back when the final assistant message is blocked.
    - The commit does not define compensation, idempotency or exactly-once guarantees for external tools.
    - Error and cancellation paths intentionally persist an unaccepted final message, so the invariant is not "persist only accepted output".
    - No evidence is provided for multi-process resume, cross-device sessions, storage isolation levels or corrupted persisted counts.
    - The change is an implementation fix in one SDK and is not a general protocol specification.

  comparisons:
    - The pre-fix non-streamed path could durably represent provisional output; the fixed normal path durably represents output only after guardrail execution.
    - A guardrail tripwire and a guardrail infrastructure error have different persistence semantics: the former withholds the message, while the latter preserves it for replayability.
    - Textual output and irreversible tool execution are treated differently: rejected text can be removed, but completed tool history remains evidence of work already performed.
    - Streamed and non-streamed behavior is brought closer for blocked final output, but the commit does not prove identical behavior for every interruption or storage failure.

  contradictions:
    - The selected title "only after output guardrails complete" is accurate for timing in the normal final-output path, but it must not be expanded to "only after guardrails accept" because exception and cancellation paths persist the final turn.
    - A blocked output is not equivalent to a rolled-back turn: retained tool calls and outputs show that side effects may already have happened.
    - Durable replayability and strict acceptance-only persistence are competing goals in the explicit error and cancellation branches.

  unresolved_questions:
    - Should a runtime store rejected or guardrail-error output in a separate quarantined evidence channel rather than the normal conversational session?
    - What atomic boundary can couple output-guardrail decision, durable session write and external side-effect evidence?
    - How should retries identify and suppress duplicate tool effects after cancellation between execution and persistence?
    - Which retained items are required for audit, and which could expose blocked content or sensitive reasoning?
    - How should a distributed runtime verify the integrity of `_current_turn_persisted_item_count` across processes and resumes?
    - What recovery state should be presented to the user when a guardrail infrastructure error preserves an otherwise undelivered final message?
```

## Source traceability

1. Merged maintainer commit: `https://github.com/openai/openai-agents-python/commit/69e26269f52a1fde684154376d77e5a21b507c19`
2. Main runner change: `src/agents/run.py`
3. Deferred persistence helper: `src/agents/run_internal/agent_runner_helpers.py`
4. Non-streamed and resume tests: `tests/test_agent_runner.py`
5. Streamed/non-streamed blocked-output tests: `tests/test_agent_runner_streamed.py`
6. Today's Research Plan: `research/runtime/plans/2026/08/2026-08-05-plan.json`

## Reading gate decision

**Result:** Deep Reading completed. The exact persistence branches, tests and qualification of the ordering invariant are available for later Analysis. No transaction architecture, patch proposal or article was produced.
