# Q-20260810-03 — Serialized and bounded MCP lifecycle operations prevent races and indefinite hangs

- Runtime date: 2026-08-10
- Column: Open-source Engineering
- Source object: Q-20260810-03 / SIG-20260810-G-003
- Primary sources:
  - https://github.com/openai/openai-agents-python/pull/4340
  - https://github.com/openai/openai-agents-python/commit/7da5696020a82d7ee2546a557eb8990169e23815
  - https://github.com/openai/openai-agents-python/issues/4334
- Evidence class: Fact (merged implementation, issue reproduction, and regression tests)
- Stage: Skill 03 Deep Reading only

## Problem

`MCPServerManager` exposed `connect_all()`, `reconnect()`, and `cleanup_all()` as independently callable lifecycle operations. With `connect_in_parallel=True`, each server used a worker queue that exited after cleanup. Overlapping operations could enqueue commands after cleanup, leaving futures unresolved after the worker stopped; callers could therefore hang indefinitely and shared manager state could diverge between concurrent operations.

## Facts

1. Issue #4334 documents a reproducible overlap race among `connect_all()`, `reconnect()`, and `cleanup_all()` when parallel connection workers are enabled.
2. PR #4340 is merged as commit `7da5696020a82d7ee2546a557eb8990169e23815` and states that it supersedes an earlier approach and fixes lifecycle races by serializing public lifecycle operations.
3. `MCPServerManager` now owns one `asyncio.Lock` (`_lifecycle_lock`). Public `connect_all()`, `reconnect()`, and `cleanup_all()` acquire that lock before entering their internal implementations.
4. Cancellation while waiting for lifecycle ownership is governed by `suppress_cancelled_error`: when suppression is disabled, cancellation propagates; when enabled, the public call returns without entering the protected lifecycle operation.
5. Parallel cleanup uses a single `_cleanup_future` per worker. `cleanup()` creates the cleanup command once and then awaits it through `asyncio.shield`, so caller cancellation does not cancel the underlying cleanup ownership/work.
6. A worker in the stopping state is not immediately replaced. `_get_worker()` waits for the stopping worker to terminate, observes cleanup completion/failure, and discards it only when safe before creating a replacement.
7. Cleanup errors remain observable via `cleanup_error`. A worker with terminal cleanup failure is not silently treated as safely cleaned; connected-state bookkeeping is cleared so an unsafe replacement connection is not launched as though cleanup succeeded.
8. The manager's lifecycle timeouts are explicit and bounded by default: both `connect_timeout_seconds` and `cleanup_timeout_seconds` default to 10.0 seconds. Positive finite values are accepted; `None` disables the timeout; zero is rejected.
9. Regression tests cover overlapping cleanup calls, cleanup-versus-reconnect ordering, cancellation while waiting for the lifecycle lock, caller cancellation during parallel cleanup, and cleanup failure behavior.
10. In the overlapping cleanup/full-reconnect test, reconnect is expected to remain blocked until cleanup completes; only then may a new connection generation start.

## Mechanisms

### Manager-level lifecycle serialization

The lifecycle lock defines a single ownership boundary above per-server workers. Public lifecycle transitions can no longer mutate `_active_servers`, `failed_servers`, `_connected_servers`, and `_workers` concurrently. Internal helpers (`_connect_all`, `_reconnect`, `_cleanup_all`) execute only while their caller owns the manager-level lock.

### Cancellation-safe cleanup ownership

The first cleanup request creates `_cleanup_future` and queues one cleanup command. Subsequent cleanup callers await the same future. `asyncio.shield` prevents caller cancellation from cancelling the cleanup future, so cleanup remains owned by the worker and can finish even after the initiating caller is cancelled.

### Safe worker replacement

`is_stopping` distinguishes a worker that has accepted cleanup from one that is simply active. A later connect path waits for the stopping worker to exit rather than creating a second generation against the same server while cleanup is in flight.

### Bounded waits

Connect and cleanup calls default to 10-second lifecycle deadlines. This bounds server operations themselves. The lifecycle lock prevents overlapping state transitions; it does not magically make an operation fast, but the protected operation's connect/cleanup awaits are subject to configured timeouts unless the application explicitly disables them with `None`.

### Failure-preserving cleanup

A cleanup failure is retained rather than erased by worker removal. The manager can therefore distinguish a clean terminal worker from one whose cleanup failed, avoiding a false-safe replacement transition.

## Evidence

- Issue #4334 explains the pre-fix failure mode: commands could be queued behind cleanup after the worker had exited, leaving unresolved futures and incoherent shared state.
- PR #4340 states the intended fix: serialize lifecycle operations, keep task-affine cleanup alive across caller cancellation, preserve cleanup failures/timeouts, and add deterministic concurrency/cancellation regression coverage.
- Commit `7da56960...` adds `_lifecycle_lock`, `_cleanup_future`, shielded cleanup, stopping/error inspection, safe worker discard/replacement, and concurrency tests.
- The merged `manager.py` documents 10-second default connect/cleanup timeouts and permits `None` only as an explicit opt-out.

## Limitations

1. Serialization is manager-local. It coordinates callers sharing one `MCPServerManager` instance; it is not a distributed lock across processes or hosts.
2. Applications can set lifecycle timeouts to `None`, which intentionally removes the operation deadline; bounded waiting therefore depends on keeping finite timeout configuration.
3. A lifecycle lock serializes public transitions but can also make later transitions wait behind a slow operation. Liveness still depends on the protected operation eventually completing, timing out, or being cancelled according to policy.
4. The regression suite uses controlled fake servers for race/cancellation coverage. Real transports, subprocesses, OS signal handling, and framework shutdown order can introduce additional failure modes.
5. `suppress_cancelled_error=True` changes cancellation semantics for callers waiting on lifecycle ownership: the call may return the current active state or return from cleanup without acquiring the lock rather than raising cancellation. Applications must understand this policy.
6. Cleanup failure is intentionally preserved; recovery after a failed cleanup is therefore constrained rather than automatically replaced. That favors safety over aggressive reconnection but may require explicit operator/application handling.

## Comparisons

- **Per-server worker queue only:** preserves task affinity but did not prevent manager-level lifecycle operations from racing with one another.
- **Fail-fast overlap rejection:** would avoid races but force callers to implement their own retry/coordination semantics.
- **Manager lifecycle lock:** serializes public transitions while retaining the existing APIs and per-server task affinity.
- **Caller-owned cleanup task:** vulnerable to cancellation aborting ownership; the merged design shields one worker-owned cleanup future instead.

## Unresolved questions

1. Should waiting for `_lifecycle_lock` itself have an independent timeout so a caller can bound time spent behind a long but still-live lifecycle operation?
2. What telemetry exposes lock wait time, worker stopping state, cleanup timeout, and retained cleanup failures to production operators?
3. How should multiple process replicas coordinate lifecycle ownership when they share an external MCP endpoint or subprocess supervisor?
4. What is the intended recovery path after terminal cleanup failure: quarantine, operator intervention, process restart, or a future explicit force-replace API?
5. How does this manager interact with framework shutdown deadlines where the host may terminate the event loop before shielded cleanup completes?

## Reading boundary

This note records implementation facts, tested concurrency semantics, configuration boundaries, and unresolved engineering questions only. It does not yet recommend a generalized MCP governance design for CodeFlowMu; that belongs to Skill 04 Research Analysis.
