# Q-20260815-02 — Native A2A task mode makes delegation scope and terminal control explicit

- Runtime date: 2026-08-15
- Column: Industry Architecture
- Source object: Q-20260815-02 / SIG-20260815-008
- Primary source: https://github.com/google/adk-python/commit/72f3ff5cfb11fdf7432c6c2faa01befcc350ad7e
- Evidence class: Fact for merged code, documentation and tests; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

A remote agent used as a delegated sub-task needs a narrower contract than ordinary agent transfer. The parent must know which history belongs to one delegation, how the remote agent declares completion, how output returns to the parent, and how remote failures release control without being mistaken for success. The selected change adds an explicit `task` mode to `RemoteA2aAgent` and aligns local task scope, remote A2A task state, and ADK `finish_task` semantics.

## Facts

1. `RemoteA2aAgent` now accepts `mode="task"`; `None` remains the default transfer-target behavior.
2. In task mode the remote agent is designed to run as a sub-agent of a parent `LlmAgent`, with the parent retaining the broader conversation and regaining control when the delegated task terminates.
3. The task-mode contract requires the remote side to produce a terminal `finish_task` FunctionResponse. Native ADK task-mode agents provide this automatically; a custom A2A server must implement the compatible terminal response contract itself.
4. The client `output_schema` must mirror the remote task agent's output schema for correct output unwrapping.
5. `FinishTaskTool` declares a dedicated `finish_task` function and injects instructions telling the model not to call it prematurely and to call it alone after the delegated task is complete.
6. `FinishTaskTool` validates output against the agent's output schema. Validation errors return an error payload and are non-terminal, allowing the model to retry.
7. A successful finish-tool response is identified by the exact result `Task completed.`; a generated failure terminal uses `Task failed.`.
8. `is_finish_task_terminal_fr()` treats only those success/failure result values as terminal, so an ordinary validation-error FunctionResponse does not close the task scope.
9. In task mode, `RemoteA2aAgent` uses `ctx.isolation_scope` as the task scope.
10. When reconstructing remote history, it includes events in the current isolation scope plus the coordinator FunctionCall whose ID equals that scope, then stops at that triggering call because older history is outside the delegated task lifetime.
11. Events belonging to other task scopes are ignored.
12. If task mode reaches the root of history without finding the triggering FunctionCall or a previous stateful turn boundary, it raises an error; the implementation explicitly says workflow-path scopes are not supported for this FC-delegation path.
13. Sibling coordinator function calls whose IDs do not match the task scope and were not emitted by the remote agent are skipped when building the remote request.
14. Function responses not belonging to remote-agent calls are converted to text in task mode rather than forwarded as foreign tool FunctionResponses, avoiding A2A validation conflicts.
15. Credential-bearing function responses are never forwarded while reconstructing the request.
16. The Runner has a two-pass `_find_active_task_scope()` algorithm. Pass 1 finds scopes closed by terminal `finish_task` success/failure responses; pass 2 walks backward to find the latest scope not in that closed set.
17. The two-pass design avoids falsely treating a finished scope as active when later status or duplicate events appear after the terminal response.
18. On user resumption, the Runner can recover the active task's `isolation_scope` and `invocation_id`, allowing the new user response to continue the paused delegated task rather than starting an unrelated invocation.
19. When a terminal `finish_task` response arrives from the remote task, `RemoteA2aAgent` searches session history inside the same isolation scope for the matching finish-task FunctionCall ID and extracts its arguments.
20. Those arguments are unwrapped according to `output_schema` and assigned to `event.output`; the event is yielded so the parent can capture the semantic task output.
21. After terminal finish-task handling, task control is marked for release and the stream returns early, ignoring legacy duplicate terminal FunctionResponses that might follow.
22. If the remote A2A task reports `FAILED` or `CANCELED`, task mode creates explicit failure/error events, generates a terminal failed `finish_task` event, releases control, and does not attempt to present the remote failure as a successful task output.
23. HTTP/A2A request errors also set task error state; in the task-mode `finally` path a failed finish-task event is synthesized before the local agent state is marked `end_of_agent=True`.
24. `TaskResultAggregator` records the strongest observed task state while rewriting intermediate status updates to `WORKING`; for backward-compatible A2A versions it also clears a legacy `final` flag on those intermediate updates so a client does not terminate before the true final event.
25. The executor publishes a final `COMPLETED` A2A status only when the aggregator remains in working state with a usable final status message; otherwise it publishes the aggregator's resolved final state, preserving failure/input/auth semantics.
26. The repository's new task-mode guide states that `RemoteA2aAgent(mode="task")` is for sub-agent delegation, not direct `transfer_to_agent` targeting, and is not supported as a Workflow graph node.

## Mechanisms

### Delegation-scope identity

The coordinator FunctionCall ID becomes the isolation scope for one delegated task. That identity is reused when reconstructing history, finding active paused tasks, filtering sibling calls, matching terminal output, and resuming user interaction.

### Two-pass active-scope recovery

The Runner first records scopes already closed by a semantic terminal finish response, then searches backward for the most recent remaining scope. This separates event ordering from lifecycle truth and avoids reopening a completed task merely because later events exist in its history.

### Explicit finish contract

Task completion is not inferred from the end of an A2A stream or from arbitrary text. The remote task must produce a semantically terminal `finish_task` response whose payload passes the declared output schema. Validation errors remain inside the task loop rather than becoming false completion.

### Output handback

The local proxy finds the matching finish-task call within the same isolation scope, unwraps its arguments into `event.output`, yields that semantic event, and marks the remote sub-agent ended so the parent coordinator regains control.

### Failure-to-terminal mapping

Remote FAILED/CANCELED states and transport failures are converted into explicit error plus failed finish-task semantics. The A2A task aggregator separately protects final-state ordering by preventing intermediate updates from carrying terminal meaning before the resolved final status is emitted.

## Evidence

- `docs/guides/agents/remote_a2a_agent/task.md` documents tool-based sub-agent delegation, scoped history, multi-turn pause/resume, explicit finish-task completion, default-vs-task differences, and task-mode limitations.
- `src/google/adk/agents/remote_a2a_agent.py` defines `mode="task"`, isolation-scope history reconstruction, sibling filtering, matching finish-output recovery, terminal/failure handling and control release.
- `src/google/adk/agents/llm/task/_finish_task_tool.py` defines finish-tool schema validation and the exact success/failure terminal FunctionResponse semantics.
- `src/google/adk/runners.py` implements two-pass active task-scope recovery for paused task resumption.
- `src/google/adk/a2a/executor/task_result_aggregator.py` protects final-state aggregation and clears legacy premature-final flags on intermediate events.
- `src/google/adk/a2a/executor/a2a_agent_executor.py` publishes working updates and then maps the aggregated task state into the true final A2A status.
- The merged change also adds/updates executor, RemoteA2aAgent, runner and workflow regression tests covering these task-mode paths.

## Limitations

1. Task mode is an ADK implementation contract. It does not establish interoperability with arbitrary A2A frameworks unless the remote endpoint implements compatible task and finish semantics.
2. A custom remote server must manually produce the expected `finish_task` FunctionResponse contract; protocol-level A2A completion alone is not equivalent to ADK task-mode semantic completion.
3. The client and remote output schemas must align. The mechanism does not negotiate or prove schema compatibility automatically.
4. Isolation scope limits the history ADK forwards for the delegated task, but it is not a cryptographic confidentiality boundary and does not prove the remote service cannot correlate requests using its own state or metadata.
5. The selected implementation explicitly excludes `RemoteA2aAgent(mode="task")` as a Workflow graph node and excludes direct `transfer_to_agent` targeting.
6. A remote task may pause for human input; the source demonstrates lifecycle routing but does not establish deadlines, lease expiry, business SLA or human-approval authorization policy.
7. Mapping FAILED/CANCELED and transport errors to failed task semantics releases local control, but it does not compensate external effects already produced by the remote agent.
8. Explicit finish semantics do not provide exactly-once execution or delivery guarantees across network retries, server crashes, or replicated remote workers.
9. Session/context reuse depends on A2A server behavior; scoped local reconstruction does not by itself prove durable remote-state consistency.

## Comparisons

- Default `RemoteA2aAgent` behavior is a transfer/peer interaction using broader session history and stream completion. Task mode instead makes the remote agent a callable delegated unit with an explicit return-to-parent boundary.
- Treating end-of-stream as completion would conflate network termination, failure and successful work. `finish_task` creates a separate semantic completion event.
- A one-pass backward search for paused scope can be confused by events written after a terminal response. The two-pass runner first establishes which scopes are already closed.
- Forwarding the entire coordinator history would blur delegation boundaries. Task mode reconstructs from the triggering FunctionCall and same isolation scope while excluding sibling task activity.

## Unresolved questions

1. How should task-mode scope identity be propagated or signed across heterogeneous A2A implementations so both sides agree on the same delegated occurrence?
2. What durable retry/idempotency contract is required when a parent loses the terminal response after the remote task already produced external effects?
3. Should output-schema compatibility be negotiated through the Agent Card instead of manually mirrored on the client?
4. How should deadlines, cancellation authority and lease expiry be represented for a task that pauses for human input across multiple turns?
5. What audit evidence should prove that a remote terminal output belongs to the exact delegation and remote identity expected by the parent?
6. Can the isolation-scope model be generalized to workflow graphs without losing the FunctionCall-based lifetime boundary that task mode currently relies on?

## Reading boundary

This note establishes the merged ADK task-mode mechanism only: a coordinator FunctionCall defines one isolation-scoped remote delegation; the Runner recovers paused scopes using terminal finish-task evidence; the remote task must produce an output-schema-valid semantic `finish_task`; the local proxy unwraps that output and returns control; failures/cancellation/transport errors map to explicit failed terminal semantics. It does not establish cross-framework interoperability, cryptographic delegation identity, durable delivery, exactly-once external effects, or general workflow-node support. Those broader architecture judgments belong to Skill 04 Analysis.
