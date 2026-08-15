# Q-20260815-03 — Live agent runs must own the lifetime of background tool tasks

- Runtime date: 2026-08-15
- Column: Open-source Engineering
- Source object: Q-20260815-03 / SIG-20260815-009
- Primary source: https://github.com/google/adk-python/commit/0088abbe6651da6a6c644cace087a79d6a674821
- Evidence class: Fact for merged code and tests; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

A live agent can launch streaming and non-blocking tools as background asyncio tasks. If those tasks are not owned by the agent run that created them, they can survive a handoff or teardown, continue writing responses into a queue now owned by another agent, retain stale input streams, and surface failures later as detached asyncio warnings. The selected change attaches those task lifetimes to `BaseLlmFlow.run_live` and performs bounded best-effort cancellation whenever that run ends.

## Facts

1. The change identifies two background task classes created by live execution: streaming-tool tasks in `active_streaming_tools` and non-blocking-tool tasks in `active_non_blocking_tool_tasks`.
2. Before this change, those tasks were not generally tied to the live agent run that started them; an explicit `stop_streaming` path was the main cancellation mechanism for a streaming tool.
3. A surviving task could continue feeding FunctionResponses into the shared live request queue after ownership had moved to another agent or after nobody was consuming the run.
4. A stale streaming-tool registry entry could also keep receiving duplicated live input because `_send_to_model` copies each live request into every registered active stream.
5. `run_live` now has a `finally` path that invokes `_stop_background_tool_tasks(invocation_context)`, so caller abandonment, normal connection termination and exceptions all enter the cleanup path.
6. The handoff path calls `_stop_background_tool_tasks` before the sub-agent takes over the live request queue, rather than waiting for the enclosing parent run to finish after the sub-agent returns.
7. When the model returns the ordinary `task_completed` tool response, the run returns and the same outer `finally` cleanup owns remaining background tasks.
8. `_stop_background_tool_tasks` collects the actual asyncio tasks referenced by both registries and filters to tasks that are not already done.
9. It sends `cancel()` to every pending background task.
10. It waits for cancellation for `_TOOL_SHUTDOWN_TIMEOUT_SECONDS`, set to 1.0 second in the selected change.
11. A task that ignores cancellation after that timeout is logged as still outliving its agent rather than blocking handoff or teardown indefinitely.
12. For tasks that stop, the helper retrieves unexpected task exceptions so they are logged in context instead of appearing later as unobserved-task warnings.
13. After the bounded wait, the helper clears `active_streaming_tools` even if a task ignored cancellation.
14. It likewise clears `active_non_blocking_tool_tasks`; normally a non-blocking tool removes its own registry entry in its `finally`, but cleanup handles cases where it did not reach that point.
15. Clearing a stale streaming registry is operationally important because `_send_to_model` would otherwise continue copying every subsequent live request into the orphaned stream.
16. A regression test installs deliberately cancellation-resistant streaming and non-blocking tasks, shortens the timeout, invokes cleanup, and verifies that both registries are empty even though the first cancellation can be ignored.
17. The same test explicitly owns final disposal of those deliberately resistant test tasks after the registry has released them, demonstrating that registry retirement and task termination are intentionally distinct facts.
18. A handoff regression test starts a streaming monitor under the root agent, transfers to a sub-agent, and has the sub-agent observe that the monitor task is already done before it uses the shared live queue.
19. That test also verifies monitor ticks stop at handoff rather than merely at total session shutdown.
20. Another handoff test verifies the stopped streaming tool is no longer registered while the user continues sending live audio under the sub-agent, preventing the old stream from accumulating those later requests.
21. A normal-turn-end regression test uses `task_completed` and verifies a streaming tool that would otherwise run indefinitely is done when the live stream ends and produces no further ticks afterward.
22. A caller-abandonment regression test stops consuming the live generator mid-stream and verifies that the streaming tool is still cancelled through generator teardown.
23. A non-blocking-tool regression test schedules a silent long-running lookup, ends the turn with `task_completed`, and verifies the tool receives `CancelledError`.
24. The commit message and implementation both define cancellation as best effort rather than a guarantee that every background coroutine stops inside the timeout.

## Mechanisms

### Run-scoped ownership

The cleanup responsibility sits in `BaseLlmFlow.run_live`, the lifecycle that started the background tool work. The outer `finally` gives the run one owner for ordinary return, caller closure and exceptional termination.

### Pre-handoff revocation

Handoff is treated as an ownership transfer of the live request queue. The current agent cancels its background tools before the child agent starts consuming that queue, preventing old tools from addressing a model that did not issue their calls.

### Bounded cancellation

Cleanup cancels all pending tasks in both registries and waits at most one second. This bounds teardown latency but explicitly accepts that a cancellation-resistant task can still outlive the agent.

### Registry retirement

Regardless of whether every task cooperates, the run clears the registries. That stops the Runtime from treating orphaned work as current and, for streaming tools, prevents future user input from being copied into a stale stream.

### Exception ownership

Completed tasks are inspected for exceptions during cleanup. Retrieving those exceptions prevents detached asyncio warnings from becoming the only record of a background failure.

## Evidence

- `src/google/adk/flows/llm_flows/base_llm_flow.py` places cleanup before sub-agent handoff and in the outer `run_live` finally block, defines the two owned task classes, the one-second cancellation budget, exception retrieval and registry retirement.
- `tests/unittests/streaming/test_live_tool_shutdown.py` verifies registry cleanup under cancellation resistance, pre-handoff task termination, stale-stream removal, normal turn-end cleanup, caller-abandonment cleanup and non-blocking-task cancellation.
- The merged commit message explicitly identifies the former orphan-task failure mode and states that cancellation is best effort.

## Limitations

1. `asyncio.Task.cancel()` is cooperative. A task may catch or ignore `CancelledError`; after one second the Runtime logs and releases its registry ownership but does not forcibly terminate the coroutine.
2. Clearing a registry prevents future local routing to that task or stream but does not undo work the task already performed.
3. Cancellation of a local coroutine does not imply cancellation or rollback of an external HTTP request, database write, payment, message send, or other side effect already issued by the tool.
4. The mechanism therefore does not establish exactly-once tool execution, external compensation, transactional handoff, or distributed task revocation.
5. A cancellation-resistant task can still consume process resources after registry retirement until it eventually stops or the process exits.
6. The one-second timeout is an implementation constant, not a per-tool SLA or policy negotiated from tool semantics.
7. The tests exercise ADK's local asyncio/live-request architecture. They do not prove equivalent behavior for remote workers or tools whose execution lifetime is owned outside this process.
8. Exception retrieval improves observability for tasks that become done, but a still-running task's later failure may still occur outside the original run's active lifecycle.

## Comparisons

- Cancelling only at total invocation end is too late for handoff because the next agent can already own the shared live queue. This change performs cleanup before that ownership transfer.
- Waiting indefinitely for every tool to honor cancellation would make teardown itself hostage to a misbehaving tool. The one-second bound favors Runtime liveness while making residual work explicit through logging.
- Merely cancelling tasks without clearing stream registries would still let `_send_to_model` route future user inputs into stale queues. The change retires both execution tasks and registry membership.
- Registry removal alone would stop local routing but leave cooperative tasks running unnecessarily. The implementation first requests cancellation, then retires registry state after a bounded wait.

## Unresolved questions

1. Should different tool classes declare different teardown budgets or cancellation guarantees instead of sharing one fixed timeout?
2. How should the Runtime surface a cancellation-resistant task as durable operational state rather than only a warning log?
3. What compensation contract is needed for external effects that survive local coroutine cancellation?
4. Should a handoff be blocked when a high-risk tool refuses cancellation, or should the next agent run with an explicit residual-work hazard marker?
5. How can cancellation ownership extend across subprocesses, remote tool servers or durable job queues where `asyncio.Task.cancel()` is not the execution control surface?
6. What evidence should distinguish “registry ownership released” from “underlying effect definitely terminated” in production observability?

## Reading boundary

This note establishes the merged ADK engineering mechanism only: one live agent run owns its streaming and non-blocking background asyncio tasks; handoff cancels them before queue ownership moves; all run termination paths attempt bounded cancellation; completed-task exceptions are observed; and stale registries are retired even when a task ignores cancellation. It does not establish external side-effect rollback, forced termination, distributed revocation, or exactly-once cleanup. Those broader engineering judgments belong to Skill 04 Analysis.
