# Q-20260823-01 — HITL Resume Must Preserve FunctionResponse Authority

- Runtime date: 2026-08-23 (Asia/Shanghai)
- Queue signal: SIG-20260823-006
- Primary source: https://github.com/google/adk-python/commit/e753651b7df26febe00bde2cb043225e644cd207
- Evidence level: `merged_maintainer_change`
- Scope: Google ADK workflow-wrapped `LlmAgent` in `single_turn` mode when resuming with workflow `resume_inputs`

## Problem

A workflow node can pause for human-in-the-loop input and later rerun with the operator response reconstructed into `resume_inputs`. Before this change, the single-turn LLM wrapper also re-appended its original node input as a synthetic user event on every rerun. That new tail event could sit after the actual user `FunctionResponse`, so the resumed model view no longer treated the operator response as the authoritative latest user evidence and could re-enter the confirmation path indefinitely.

## Facts

`NodeRunner.run()` accepts an optional `resume_inputs` mapping and passes it into the child `Context`. During child-context creation, ADK scans the existing session event history with `_reconstruct_node_states()`. User-authored events containing a `FunctionResponse` whose id matches a previously recorded interrupt are unwrapped, optionally schema-validated, and stored in `resolved_responses`. Rehydrated responses are merged with explicitly supplied resume inputs, with explicit resume inputs taking precedence on key collision.

For workflow-wrapped `LlmAgent` nodes, `prepare_llm_agent_context()` copies the parent `resume_inputs` into the agent context. `prepare_llm_agent_input()` retains the legacy behavior of appending a synthetic user-role input only for `single_turn` agents, but now returns early whenever `ctx.resume_inputs` is non-empty. The same early return already applies when there is no node input or when the agent is not in `single_turn` mode.

The changed regression test creates a `single_turn` agent, pre-populates session history with the original user input, constructs a context with `resume_inputs={'worker@1': {'confirmed': True}}`, calls `prepare_llm_agent_input()`, and asserts that the session length does not increase and the original user input remains the latest event in that simplified fixture.

The commit message explicitly identifies HITL tool confirmation as the motivating failure mode: the duplicate synthetic user event shadowed the user's `FunctionResponse` and caused an infinite confirmation loop.

## Vendor Claims

The maintainer commit says the fix prevents duplicate synthetic user input during single-turn agent resumption and preserves the user's FunctionResponse as the effective resume evidence. The code directly supports the narrower mechanism: if any `resume_inputs` are present, the single-turn wrapper no longer appends the synthetic node-input event.

## Mechanisms

1. **Session-event rehydration:** workflow resume scans persisted session events and recognizes user `FunctionResponse` parts tied to known interrupt ids.
2. **Response reconstruction:** matched FunctionResponses are unwrapped, schema-validated when a response schema exists, and placed into `resolved_responses`.
3. **Resume-input propagation:** `NodeRunner` carries reconstructed and caller-supplied resume inputs into the child `Context`; `prepare_llm_agent_context()` preserves them for the wrapped LLM agent.
4. **Synthetic-input suppression:** `prepare_llm_agent_input()` now skips legacy user-event injection when `bool(ctx.resume_inputs)` is true.
5. **Scope guard:** the changed path is specifically the workflow wrapper's `single_turn` input-preparation behavior. Task-mode agents already use a separate leading-turn construction path and are not changed by this condition.

## Evidence

Primary evidence is merged maintainer commit `e753651b7df26febe00bde2cb043225e644cd207` in `google/adk-python`.

The changed production file is `src/google/adk/workflow/_llm_agent_wrapper.py`. The relevant resume state machinery is in `src/google/adk/workflow/_node_runner.py` and `src/google/adk/workflow/utils/_rehydration_utils.py`: matched user FunctionResponses become `resolved_responses`, then become child-context resume inputs.

The added unit test `test_single_turn_input_skipped_when_resuming` verifies that a non-empty `resume_inputs` mapping prevents a second synthetic user event from being appended on rerun.

## Limitations

The regression test does not build a complete live HITL confirmation loop containing a real tool-call FunctionResponse; it tests the decisive wrapper condition with a representative non-empty `resume_inputs` mapping. The commit message and rehydration path connect that condition to the FunctionResponse failure mode, but the new test itself is narrower than a full end-to-end HITL test.

The new condition checks whether *any* resume inputs exist, not whether a specific FunctionResponse id is present. That is intentionally broad suppression for resumed single-turn nodes, but the selected commit does not prove all possible resume-input shapes are semantically equivalent.

This change does not create exactly-once human approval, cryptographic operator identity, or general workflow rollback. It only prevents one synthetic-event overwrite/shadowing mechanism in the demonstrated resume path.

Session history remains the source used by rehydration. Correctness therefore still depends on interrupt ids, event authorship, persisted history, and response-schema handling being correct upstream.

## Comparisons

Compared with treating resume as a fresh invocation, this design preserves the prior session event stream and reconstructs resolved interrupt responses. Compared with deduplicating after an extra synthetic event has already been written, it avoids creating the conflicting event in the first place.

The mechanism is analogous to a monotonic evidence rule: once a workflow is resuming from an interrupt response, the wrapper must not insert a lower-authority synthetic copy of the original input ahead of the evidence the resume path is trying to consume.

## Unresolved Questions

- Is there an end-to-end regression test that exercises an actual long-running HITL tool call, persists the FunctionResponse, resumes the workflow, and proves the confirmation loop terminates?
- Can a non-empty `resume_inputs` mapping that is unrelated to the wrapped LLM node suppress a synthetic input that should otherwise be regenerated?
- How are conflicting reconstructed responses and explicitly supplied resume inputs audited when the explicit mapping overwrites a rehydrated key?
- Are there other single-turn input injection paths outside `prepare_llm_agent_input()` that can append a later synthetic user event during resume?

## Reading Conclusion

The defensible result is specific: ADK workflow resume reconstructs interrupt responses into `resume_inputs`, and the `single_turn` LLM wrapper now treats the presence of those resume inputs as a reason **not to append another synthetic user event**. This removes the demonstrated mechanism that could place synthetic input after the operator's FunctionResponse and re-trigger HITL confirmation. It is not a general proof of HITL authorization safety or exactly-once approval.
