# Q-20260826-01 — Detached Dynamic Work and Workflow Terminal Truth

- Runtime date: 2026-08-26 (Asia/Shanghai)
- Queue signal: SIG-20260826-014
- Primary source: https://github.com/google/adk-python/commit/34e13df41750fc5243a1cd42a86491ee5acdd876
- Evidence level: `merged_maintainer_change`
- Scope: Google ADK Workflow detached dynamic-node completion, error/interrupt propagation, in-flight tracking and regression boundaries

## Problem

A dynamic node can be started through `ctx.run_node()` inside an `asyncio` task without the parent awaiting that call. Before this change, such detached work could still be running when the static graph finished; its failure could be swallowed and its interrupt dropped, allowing the enclosing workflow to report success while delegated work had actually failed or requested human input.

## Facts

The workflow execute loop now obtains the remaining dynamic tasks after static work completes. If any are still in flight, it waits for them and then calls `_surface_detached_dynamic_outcome` before allowing the workflow to finish cleanly.

The outcome inspection skips cancelled tasks. For each remaining task it first checks a raised task exception; otherwise it inspects the returned child `Context`. A child `error` is copied to the enclosing context with its error-node path. A child with `interrupt_ids` is converted to a `RuntimeError`, because the patch explicitly treats a detached node as non-resumable.

When an error is found, the parent context receives `_error` and `_error_node_path`, `loop_state.error_shut_down` is set, and the scan returns. The implementation therefore uses first-bad-outcome semantics for the inspected task order rather than aggregating all failures.

Regression tests cover an in-flight detached failure, an in-flight detached interrupt, and an in-flight detached success. The patch also pins a deliberate limitation: a detached run that already completed before the graph-end inspection is not returned by the in-flight dynamic-task lookup and therefore cannot be distinguished from a run that was awaited and handled normally.

## Vendor Claims

The maintainer describes the fix as making a workflow fail when a detached dynamic node errors or interrupts. The changed execute-loop logic and explicit regression tests directly support that statement for detached runs that are still in flight at the graph-end inspection point.

## Mechanisms

1. **Post-static-work join:** remaining dynamic tasks are awaited before terminal workflow success is decided.
2. **Returned-context inspection:** normal standalone dynamic-node failures represented as `Context.error` are surfaced even when the task itself did not raise.
3. **Raised-exception preservation:** unexpected task exceptions are also promoted instead of being silently swallowed.
4. **Interrupt-to-error conversion:** an in-flight detached node requesting human input fails the workflow because this detached execution form cannot be resumed.
5. **First bad outcome wins:** the first inspected failure/interrupt sets enclosing workflow error state and stops further outcome selection.
6. **Explicit in-flight boundary:** only tasks still represented as dynamic in-flight work at graph completion are inspected by this mechanism.

## Evidence

Primary evidence is merged Google ADK maintainer commit `34e13df41750fc5243a1cd42a86491ee5acdd876`. It changes `src/google/adk/workflow/_workflow.py` and adds focused tests in `tests/unittests/workflow/test_workflow_dynamic_nodes.py`.

The evidence directly demonstrates that static graph completion is no longer sufficient for a clean terminal outcome when registered detached dynamic work remains in flight. The enclosing workflow waits for that work and incorporates its demonstrated failure/interrupt state into terminal truth.

## Limitations

This does not establish a general background-task protocol for every asynchronous task in ADK. It covers dynamic-node tasks tracked by this Workflow loop.

Cancelled detached tasks are skipped by the outcome surfacing routine, so this patch alone does not establish cancellation-as-failure semantics.

The commit explicitly documents that a detached run which finishes before graph-end inspection cannot be distinguished from an awaited/handled run. A sufficiently early detached failure can therefore remain outside this new terminal-truth check.

The implementation does not provide resumability for a detached interrupt; it converts that condition into an error and tells callers to await `ctx.run_node()` directly when resumability is needed.

## Comparisons

Before the fix, static graph completion could outrun detached delegated work and yield a false-success terminal state. After the fix, in-flight registered dynamic work participates in terminal truth through a join-and-inspect step. This is a stronger enclosing-workflow responsibility boundary, but only for the in-flight subset the runtime can still identify.

## Unresolved Questions

- Can completed detached runs be given a durable identity/state so early failures are distinguishable from explicitly awaited and handled work?
- Should cancelled detached runs contribute an explicit cancellation terminal outcome rather than being skipped?
- Is task-list iteration order sufficiently intentional for the current first-bad-outcome rule when multiple detached nodes fail concurrently?
- Should detached interrupts be prohibited at scheduling time rather than discovered only at terminal inspection?

## Reading Conclusion

The selected ADK change makes in-flight detached dynamic work part of the enclosing Workflow's terminal truth: graph completion waits for the tracked detached runs, and their failure or non-resumable interrupt prevents a false success. The defensible boundary is narrower than universal background-task correctness because cancelled tasks are skipped and detached runs that finish before the inspection point remain indistinguishable from awaited/handled runs.
