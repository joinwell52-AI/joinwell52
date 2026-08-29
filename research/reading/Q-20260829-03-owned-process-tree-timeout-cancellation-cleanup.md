# Q-20260829-03 — Bounded Command Lifetime Must Reach the Owned Process Tree

- Runtime date: 2026-08-29 (Asia/Shanghai)
- Queue signal: SIG-20260829-018
- Primary source: https://github.com/google/adk-python/commit/fa321f1b49f7bd961b58ad19fd8b8e6fa285b918
- Evidence level: `merged_maintainer_change`
- Scope: Google ADK Python `LocalEnvironment`, subprocess timeout/cancellation, POSIX process groups, output-pipe draining and descendant cleanup

## Problem

Killing only the direct subprocess on timeout does not bound the lifetime of a command that spawned children. A descendant can continue running after the parent is killed, and if it inherited stdout/stderr it can keep those pipes open. A cleanup path that then calls `communicate()` again can itself wait indefinitely, turning a nominal timeout into an unbounded teardown.

The ownership question is therefore twofold: which descendants belong to the command lifecycle, and how can timeout or caller cancellation close that lifecycle without the cleanup operation becoming another hang point?

## Facts

The merged ADK Python change launches local commands with `start_new_session=True`. On POSIX, this makes the command leader of a new session/process group, creating an operating-system boundary that can be signaled as a unit rather than targeting only the direct child process.

The implementation creates one `drain` future from `proc.communicate()` for the whole execution. The normal timeout wrapper awaits `asyncio.shield(drain)`, so the timeout does not cancel the underlying pipe-drain task. This avoids starting a second `communicate()` after the deadline while descendants may still hold inherited pipes open.

On `asyncio.TimeoutError`, `execute()` marks the result timed out and invokes `_kill_command`. On caller `CancelledError`, it invokes the same cleanup path before re-raising the cancellation. Timeout and cancellation therefore share lifecycle cleanup rather than allowing cancellation to bypass owned-process teardown.

`_kill_command` first identifies the process group by the command leader's PID. It sends SIGTERM to the process group when `os.killpg` exists and also calls `proc.terminate()` on the direct process. It then waits up to `_TERMINATE_GRACE_SECONDS`, currently five seconds, for the original drain task to finish.

If the drain is still open after the grace period, cleanup escalates to SIGKILL for the group and `proc.kill()` for the direct process, then waits another grace period. This escalation is unconditional with respect to the direct parent's exit because a descendant may ignore SIGTERM and continue holding the inherited output pipes.

If output is still not drained after the second bounded wait, the code assumes a descendant may have escaped the group, cancels the drain, logs a warning and returns empty output instead of blocking forever. This is an explicit boundedness trade-off: after the owned group has been terminated, output completeness is sacrificed if an escaped process still owns the pipe.

The signal helpers tolerate races. `proc.terminate()` and `proc.kill()` ignore `ProcessLookupError` when the process already exited; process-group signaling catches `OSError`. Cleanup therefore treats concurrent natural exit as a normal race rather than a fatal secondary failure.

The new tests create a shell command that starts a background heartbeat writer and then sleeps. The background process inherits stdout/stderr, reproducing the pipe-liveness failure mode. One test sets a 0.5-second execution timeout and additionally wraps the call in a 30-second test timeout, asserting that ADK returns as timed out and that the heartbeat stops changing. A second test cancels the calling task after the heartbeat is observed, asserts `CancelledError` is propagated, and again verifies the background writer has stopped.

Both process-tree tests are skipped when `os.killpg` is unavailable. The demonstrated whole-tree guarantee is therefore POSIX-process-group scoped, not a cross-platform claim.

## Vendor Claims

The commit is titled `fix(environment): terminate the whole process tree when a local command times out`. The implementation and tests directly support a bounded POSIX claim: commands run in their own process group, timeout and cancellation attempt graceful group termination before forced kill, and the tested background descendant no longer survives or holds cleanup open.

## Mechanisms

1. **Owned process-group boundary:** `start_new_session=True` isolates the spawned command into its own POSIX session/process group.
2. **Single pipe-drain future:** one `communicate()` task owns stdout/stderr collection for the execution lifecycle.
3. **Shielded timeout:** the deadline stops waiting on the drain without cancelling that drain task.
4. **Shared timeout/cancellation teardown:** both timeout and caller cancellation invoke `_kill_command`.
5. **Graceful-first group termination:** SIGTERM reaches the process group and direct process before escalation.
6. **Bounded grace period:** cleanup waits a fixed five seconds for process exit and pipe closure.
7. **Forced group escalation:** SIGKILL is sent when descendants keep the drain alive after SIGTERM.
8. **Race-tolerant direct-process operations:** already-exited processes do not turn cleanup into a failure.
9. **Bounded escaped-descendant handling:** after the second grace period, the drain is cancelled and output is abandoned rather than allowing teardown to hang indefinitely.
10. **Behavioral descendant test:** a real background heartbeat process proves the covered descendant stops after both timeout and cancellation.

## Evidence

Primary evidence is merged Google ADK Python maintainer commit `fa321f1b49f7bd961b58ad19fd8b8e6fa285b918`.

`src/google/adk/environment/_local_environment.py` adds process-group/session creation, the persistent drain future, timeout/cancellation cleanup sharing, `_signal_group`, `_terminate`, `_kill`, and `_kill_command` with SIGTERM → bounded wait → SIGKILL → bounded wait semantics.

`tests/unittests/environment/test_local_environment.py` adds `TestExecuteTimeout`. Its background shell heartbeat holds inherited output descriptors open, covering the historical failure mode where killing only the parent could leave cleanup blocked. The timeout test verifies both timely return and descendant termination; the cancellation test verifies descendant cleanup before cancellation propagation completes.

## Limitations

The whole-process-tree result is demonstrated only where POSIX process groups are available. The tests explicitly skip when `os.killpg` is missing. On platforms without process-group signaling, the fallback `proc.terminate()` / `proc.kill()` targets the direct process and does not establish equivalent descendant cleanup.

A descendant can deliberately create its own session/process group and escape the group owned by the original command. The implementation acknowledges this case: if such a process keeps output pipes open after both grace periods, ADK abandons the drain rather than claiming it killed the escaped descendant.

Therefore “whole process tree” should be read as the command-owned POSIX process group in the demonstrated implementation, not as a proof that every transitive OS process can always be found and killed.

The bounded fallback may return empty stdout/stderr after giving up on a stuck drain. It prioritizes lifecycle termination over complete output capture. Callers that require forensic-complete output need a separate contract.

The tests use a shell background child that remains in the command's group. They do not cover daemonization, double-fork, nested sessions, Windows Job Objects, container namespaces or remote execution.

SIGTERM handling is cooperative. A descendant may perform arbitrary work during the five-second grace period before SIGKILL. The change bounds that grace window but does not make termination instantaneous.

## Comparisons

Direct-child kill models ownership as one PID. That is insufficient for tools or digital workers because a command can delegate work to children whose lifetime still belongs to the original invocation. Process-group ownership gives the Runtime a stronger lifecycle unit.

Calling `communicate()` again after timeout treats pipe draining as a new operation, but the inherited descriptors may be held by surviving descendants. Keeping one shielded drain task ties output collection to the same lifecycle and allows termination to close the pipes naturally when possible.

An unbounded “wait until every pipe closes” cleanup maximizes output completeness but defeats the original deadline. The changed design imposes a second-order deadline on cleanup itself and explicitly accepts output loss if ownership cannot be fully enforced.

## Unresolved Questions

- What equivalent ownership primitive should ADK use on Windows—Job Objects, process-tree enumeration, or another host abstraction?
- Should escaped descendants be detected and reported as a distinct terminal condition instead of only logging and returning empty output?
- Is five seconds the right fixed grace period for all command classes, or should it be policy/configuration driven?
- Should the execution result expose whether SIGTERM was sufficient, SIGKILL was required, or pipe draining was abandoned?
- How should resource accounting include descendants during the grace period and after a process escapes the owned group?
- Can remote/container environments provide a comparable ownership boundary so the same bounded-execution contract applies beyond local POSIX processes?

## Reading Conclusion

The ADK change upgrades local command timeout from direct-PID termination to a bounded lifecycle around the command's owned POSIX process group. The command starts in a new session, one shielded drain task owns output collection, timeout and cancellation share cleanup, and teardown escalates from SIGTERM to SIGKILL under fixed grace periods. Tests prove the covered background descendant stops and no longer keeps timeout/cancellation hanging. The guarantee is intentionally narrower than arbitrary OS process-tree termination: non-POSIX platforms and descendants that escape the group remain outside the demonstrated cleanup boundary, and boundedness can take precedence over complete output capture.
