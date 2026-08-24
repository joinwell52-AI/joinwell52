# Q-20260824-01 — Streaming Input-Guardrail Precedence When Max-Turn Failure Also Occurs

- Runtime date: 2026-08-24 (Asia/Shanghai)
- Queue signal: SIG-20260824-005
- Primary source: https://github.com/openai/openai-agents-python/commit/1a55d70d8e28769bd2c3eb85eaf6fe501864ced8
- Evidence level: `merged_maintainer_change`
- Scope: OpenAI Agents SDK `RunResultStreaming` error-state lifecycle, input-guardrail tripwire handling, max-turn failure and deterministic regression coverage

## Problem

A streaming run can exceed its turn limit while an input guardrail is resolving. If the run has already captured an `InputGuardrailTripwireTriggered` but a later cleanup/final error check recreates `MaxTurnsExceeded`, the safety exception can be replaced before the caller observes it. That changes which failure reaches the caller even though the guardrail did trip.

## Facts

`RunResultStreaming` stores terminal/error candidates in `_stored_exception` and initializes `_max_turns_handled` to `False`.

In `_check_errors()`, max-turn handling runs before draining completed input-guardrail results. When `current_turn > max_turns` and `_max_turns_handled` is false, the method creates `MaxTurnsExceeded`, attaches run data, stores it, and — after this change — immediately sets `_max_turns_handled = True`.

The same `_check_errors()` call then drains `_input_guardrail_queue`. A tripped input guardrail constructs `InputGuardrailTripwireTriggered`, attaches run data and stores that exception. Therefore, when both conditions are visible in the same check, the guardrail exception is the later stored exception.

`stream_events()` performs another `_check_errors()` after awaiting the run loop in its `finally` path. Before this fix, the default max-turn path did not mark max turns handled, so that later check could create a fresh `MaxTurnsExceeded` again and overwrite a guardrail exception that had already been captured. The patch adds the missing handled-state transition at the point the default max-turn exception is first stored.

The regression test does not rely on a timing sleep. It uses an `asyncio.Event` set by the `max_turns` error-handler hook at the moment the run loop has actually established `current_turn > max_turns`; the guardrail waits on that event before returning a tripwire. The test then consumes the stream and asserts the surfaced exception is `InputGuardrailTripwireTriggered` and not `MaxTurnsExceeded`.

## Vendor Claims

The maintainer change states that max turns no longer clobbers an already-tripped input-guardrail exception in streaming. The changed state transition and deterministic regression test directly support that bounded claim.

## Mechanisms

1. **Single-use max-turn state:** `_max_turns_handled` prevents repeated creation of the same max-turn failure after the default path has already recorded it.
2. **Ordered error check:** max-turn state is evaluated first, then completed input-guardrail results are drained, so a tripwire visible in that check replaces the max-turn candidate.
3. **Final-check stability:** because max turns is now marked handled immediately, the unconditional later `_check_errors()` in stream cleanup cannot recreate `MaxTurnsExceeded` and clobber the stored tripwire.
4. **Deterministic concurrency test:** an event synchronizes the guardrail with the exact max-turn boundary, avoiding CI-sensitive sleep ordering.
5. **Caller-visible result:** after stream cleanup, `stream_events()` raises the final `_stored_exception`, so preserving the stored tripwire directly determines what the caller catches.

## Evidence

Primary evidence is merged maintainer commit `1a55d70d8e28769bd2c3eb85eaf6fe501864ced8` in `openai/openai-agents-python`.

The production change is one state transition in `src/agents/result.py`: `_max_turns_handled = True` is set immediately after the default `MaxTurnsExceeded` is stored.

The surrounding `RunResultStreaming` implementation confirms `_max_turns_handled` starts false, `_check_errors()` is invoked again after the run loop settles, input-guardrail tripwires overwrite the current stored exception when drained, and the final stored exception is what `stream_events()` raises.

The regression test `test_max_turns_does_not_clobber_input_guardrail_tripwire` forces max-turn state to become true before the guardrail resolves and verifies the caller still receives `InputGuardrailTripwireTriggered`.

## Limitations

This change proves a narrow precedence rule between the demonstrated streaming input-guardrail tripwire and repeated default max-turn handling. It is not a general exception-arbitration policy for every failure type in the SDK.

Later checks for run-loop or guardrail-task exceptions also assign `_stored_exception`. The selected change does not establish a global priority lattice across every possible concurrent exception.

The regression covers the documented streaming path and the tested `run_in_parallel` default. It does not prove identical behavior for every custom runner integration, output guardrail, tool guardrail or external cancellation combination.

The fix preserves which exception is surfaced; it does not by itself provide rollback of external tool side effects, transactional execution, or distributed safety semantics.

## Comparisons

Before the patch, max-turn state behaved like a repeatable write: every later error check could recreate the same limit failure. After the patch, max-turn handling becomes a one-time state transition, allowing a subsequently captured guardrail tripwire to remain stable through final cleanup.

This resembles precedence handling in event-driven control systems: once a lower-priority terminal condition has been consumed, it should not be regenerated later and erase a more specific safety condition that was already observed.

## Unresolved Questions

- Is there an explicit documented precedence policy for run-loop exceptions, input/output/tool guardrails, cancellation and execution-limit errors beyond this regression?
- Should `_stored_exception` eventually become a structured arbitration mechanism rather than last-writer state?
- Are equivalent max-turn/guardrail races covered in non-streaming execution paths?
- Should telemetry retain both concurrent failure facts even when only one exception is surfaced to the caller?

## Reading Conclusion

The selected Agents SDK change fixes a specific streaming error-state bug: once the default max-turn failure is recorded, it is now marked handled, so a later input-guardrail tripwire cannot be erased by a fresh max-turn exception during final error checking. A deterministic concurrency regression proves the demonstrated ordering. The defensible conclusion is this bounded precedence fix, not a universal safety-exception hierarchy or transactional guarantee.
