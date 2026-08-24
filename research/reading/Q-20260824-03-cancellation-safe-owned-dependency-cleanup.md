# Q-20260824-03 — Cancellation-Safe Cleanup for Owned Sandbox Dependencies

- Runtime date: 2026-08-24 (Asia/Shanghai)
- Queue signal: SIG-20260824-004
- Primary source: https://github.com/openai/openai-agents-python/commit/72b2c670546942bdaaf66cc8d6b3a67d1a2fe5bc
- Evidence level: `merged_maintainer_change`
- Scope: OpenAI Agents SDK session-scoped sandbox dependency ownership, asynchronous close lifecycle, cancellation propagation and repeated-close idempotence

## Problem

A dependency container can own several lazily created sandbox resources. If closing one owned resource raises `asyncio.CancelledError` and that cancellation immediately aborts the container's close loop, later owned resources can remain open and internal ownership state can remain uncleared. At the same time, swallowing cancellation entirely would violate caller cancellation semantics.

## Facts

`Dependencies` is session-scoped. Sandbox clients clone configured bindings per created or resumed session so each session has its own cache and owned-resource lifecycle.

A factory binding has an `owns_result` flag. When such a factory produces a value, `_run_factory()` appends the value to `_owned_results`. Direct `bind_value()` bindings are not automatically added to that ownership list.

`aclose()` sets `_closed = True` and creates one `_close_task` the first time it is called. Later `aclose()` calls reuse and shield that same task rather than starting a second close operation.

`_close()` first cancels active factory tasks and gathers them with `return_exceptions=True`. It then walks `_owned_results` in reverse order, uses `id(value)` plus `seen_ids` to avoid closing the same owned object twice within the list, and calls `_close_best_effort()`.

The selected change adds a `cancellation` slot. When `_close_best_effort()` propagates `asyncio.CancelledError`, `_close()` remembers the first cancellation but continues closing all remaining owned results. Only after it clears `_pending`, `_active_tasks`, `_cache` and `_owned_results` does it re-raise the captured cancellation.

`_close_best_effort()` itself suppresses ordinary `Exception` failures from `aclose()` or `close()`. `asyncio.CancelledError` is not caught by those `except Exception` branches in the demonstrated Python runtime, allowing cancellation to reach the new outer handling logic.

The regression creates two owned values: one ordinary async closable and one whose `aclose()` raises `CancelledError`. The first `dependencies.aclose()` raises cancellation but both values have been closed exactly once. Calling `dependencies.aclose()` again raises the same close-task cancellation while both call counters remain at one.

## Vendor Claims

The maintainer change says owned dependency cleanup now finishes on cancellation. The implementation and regression directly support the narrower statement that a cancellation raised while closing one owned result no longer prevents remaining owned results from receiving their close attempt before cancellation is propagated.

## Mechanisms

1. **Session ownership:** only factory results marked `owns_result=True` enter the container-managed owned lifecycle.
2. **Single close task:** the first `aclose()` creates `_close_task`; repeated closes await that same task, preventing a second teardown pass.
3. **Active-task shutdown first:** in-flight factory tasks are cancelled and awaited before owned results are traversed.
4. **Identity deduplication:** reverse traversal uses `id(value)` so repeated references to the same owned object receive one close attempt within teardown.
5. **Deferred cancellation propagation:** the first `CancelledError` is captured, remaining owned values are still closed, internal collections are cleared, and only then is cancellation re-raised.
6. **Best-effort ordinary failures:** non-cancellation close exceptions are swallowed by `_close_best_effort()` rather than becoming terminal cleanup errors.

## Evidence

Primary evidence is merged maintainer commit `72b2c670546942bdaaf66cc8d6b3a67d1a2fe5bc` in `openai/openai-agents-python`.

`src/agents/sandbox/session/dependencies.py` shows the session-scoped binding model, `owns_result` registration, single `_close_task`, active-task cancellation, reverse owned-result traversal, identity deduplication, deferred cancellation and state clearing.

`tests/sandbox/test_dependencies.py` adds a closable that raises `CancelledError` and verifies that both the cancelling resource and an earlier owned resource receive one close call before cancellation is surfaced. A second container close surfaces cancellation again without incrementing either close counter.

## Limitations

The demonstrated exactly-once property is local to this container's close lifecycle and the tested owned object references. It is not distributed exactly-once semantics and says nothing about remote cleanup side effects performed by a resource's own close implementation.

Ordinary exceptions raised by dependency `aclose()` or `close()` are intentionally swallowed by `_close_best_effort()`. Therefore the mechanism prioritizes cleanup continuation and cancellation preservation, not complete failure visibility for every resource-close error.

Only factory results explicitly marked `owns_result=True` are container-owned. Bound shared values are outside this automatic cleanup contract.

Identity deduplication uses in-process Python object identity. It does not deduplicate two distinct wrapper objects that refer to the same external resource.

The first captured cancellation is re-raised after cleanup; the change does not aggregate multiple cancellation causes or prove rollback of partially completed remote operations.

## Comparisons

Before the patch, cancellation from one owned result escaped the close loop immediately, so later owned results and state clearing could be skipped. After the patch, cancellation becomes a deferred terminal signal: cleanup obligations are attempted first, then cancellation is propagated.

This resembles structured resource ownership: cancellation controls when the caller regains control, but an owner still executes its bounded teardown obligations before releasing that control.

## Unresolved Questions

- Should ordinary close failures be recorded or aggregated instead of being silently best-effort, especially for resources whose cleanup has security or cost implications?
- How should the container report multiple close failures together with cancellation without obscuring the original cancellation signal?
- Are external sandbox services designed so a repeated or interrupted close request is itself idempotent?
- Should ownership deduplication use a resource identity key in addition to Python object identity for wrappers around the same external dependency?

## Reading Conclusion

The selected Agents SDK change makes owned sandbox dependency cleanup cancellation-safe in a narrow, testable sense: cancellation from one owned close is remembered rather than immediately propagated, remaining owned resources still receive their close attempt, internal ownership state is cleared, and cancellation is then re-raised. Repeated `aclose()` calls reuse the same close task, so the demonstrated resources are not closed twice. This is an in-process ownership and teardown guarantee, not distributed exactly-once cleanup or full cleanup-failure observability.
