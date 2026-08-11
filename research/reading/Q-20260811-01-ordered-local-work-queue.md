# Q-20260811-01 — Ordered local work queues separate scheduled intent from execution authority

- Runtime date: 2026-08-11
- Column: Digital Employee
- Source object: Q-20260811-01 / SIG-20260811-G-007
- Primary source: https://github.com/github/copilot-cli/commit/ef627e1baad937d3c8da45f8a5541c6fc3c97b6a
- Evidence class: Fact for released behavior stated by the maintainer changelog; Unknown for undisclosed implementation details
- Stage: Skill 03 Deep Reading only

## Problem

Copilot CLI 1.0.79 addresses a runtime problem that appears whenever an interactive agent accepts new intent while another task is still executing: arrival time and execution authority are not the same thing. Without an explicit queue, a new prompt, shell command, or command-like action can compete with the current task, be lost, or force ad-hoc cancellation. The same release also exposes multiple concurrent sessions, making the boundary between per-session ordering and cross-session concurrency important.

## Facts

1. Version 1.0.79 states that prompts, shell commands, and supported slash commands in local sessions can be queued to run in order after the current task finishes.
2. The release separately states that multiple concurrent sessions can be managed from the Sessions tab and sidebar.
3. The queue statement is explicitly scoped to local sessions. The changelog does not claim one global queue across all sessions.
4. The release exposes an in-flight steering state as `pending` with `ctrl+c` available to cancel it.
5. A sandbox that cannot start an MCP server now fails in seconds instead of stalling the session. Sandbox startup failures for both MCP and language servers identify the sandbox as the cause and describe how to fix or opt out.
6. `/sandbox policy` displays effective sandbox paths, denials, and network access.
7. The sandbox configuration UI also distinguishes settings controlled by enterprise policy from user-controlled settings, including policy-enforced proxy behavior and allow-auto-only behavior.
8. The same release adds `/worktree new` for starting a new session in a new worktree, reinforcing that session identity and workspace isolation are explicit runtime concepts.

## Mechanisms established by the source

### Ordered admission after current work

The strongest documented mechanism is an admission rule rather than a timer rule: queueable intent waits until the current task finishes, then runs in order. This separates the fact that work has arrived from the authority to execute it.

### Session-local ordering with cross-session concurrency

The changelog simultaneously documents ordered queues in local sessions and management of multiple concurrent sessions. The bounded reading is therefore that ordering is at least session-local while concurrency can exist across sessions. The source does not establish a repository-wide or account-wide global serialization policy.

### Bounded startup failure

MCP and language-server startup failures caused by the sandbox are changed from indefinite stall behavior to failure within seconds. This establishes a bounded-failure design goal, but the release note does not disclose the exact timeout value, retry policy, or whether every MCP transport shares the same bound.

### Effective-policy observability

`/sandbox policy` exposes the effective paths, denials, and network access rather than only configuration intent. This is operationally significant because a worker can inspect the policy actually applied to execution, including managed restrictions that may differ from user settings.

## Evidence

- GitHub Copilot CLI changelog commit `ef627e1...` is the maintainer-published release record for 1.0.79 dated 2026-08-10.
- The same release record contains the queueing, multiple-session, MCP bounded-startup, pending/cancel display, and effective sandbox-policy statements in one version boundary.

## Limitations

1. The selected primary source is a release changelog, not implementation code for the queue. It establishes released behavior but does not expose the internal queue data structure, scheduler, persistence format, or locking strategy.
2. The source does not state whether queued items survive process restart, CLI crash, terminal disconnect, or session history reload.
3. It does not define queue capacity, priority, deduplication, starvation behavior, or whether a failed queued item blocks later queued work.
4. `ctrl+c to cancel` is documented for in-flight steering prompts; the changelog does not establish identical cancellation semantics for every queued prompt, shell command, or slash command.
5. “Supported slash commands” is not enumerated in the selected source.
6. “Fails in seconds” is bounded qualitatively, but no exact timeout, retry count, or failure-state machine is disclosed.
7. Multiple concurrent sessions are documented, but the source does not define ordering or resource arbitration between sessions.

## Comparisons

- **Direct immediate execution:** arrival and authority collapse into one event, increasing the risk of competing work during a live task.
- **Session-local ordered queue:** accepts intent while preserving a single current-task authority boundary, then admits queued work sequentially.
- **Multiple sessions:** permits concurrency by creating explicit session boundaries rather than making one session internally concurrent.
- **Unbounded MCP startup:** can hold the execution lane indefinitely; the 1.0.79 behavior converts this into a bounded failure visible to the operator.

## Unresolved questions

1. Is queued work persisted durably enough to survive process restart or is it memory/session-local only?
2. Does completion mean model-turn completion, tool completion, full task terminal state, or another internal boundary before the next queue item is admitted?
3. What happens to later queue items when the current task fails or is cancelled?
4. Are shell commands and slash commands captured as immutable queue entries or re-resolved against session state at execution time?
5. What is the exact MCP startup timeout and retry policy?
6. How are concurrent sessions prevented from contending over the same filesystem/worktree or external side effects?
7. Which sandbox-policy fields are exposed as effective state to automation or telemetry, beyond the interactive `/sandbox policy` UI?

## Reading boundary

This note records maintainer-stated runtime behavior, bounded mechanisms, limitations, and unknowns only. It does not decide how a Digital Employee runtime should implement its own queue, lease, or process manager; that belongs to Skill 04 Research Analysis.
