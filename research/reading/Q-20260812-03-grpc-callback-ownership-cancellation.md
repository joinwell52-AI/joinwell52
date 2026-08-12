# Q-20260812-03 — gRPC callback runtime makes nested tool ownership, cancellation and concurrency explicit

- Runtime date: 2026-08-12
- Column: Open-source Engineering
- Source object: Q-20260812-03 / SIG-20260812-G-004
- Primary source: https://github.com/openai/codex/commit/ba2fb483197a6b428b8c6d999d192bb056c64ae7
- Evidence class: Fact for changed code and tests; Inference only where explicitly labeled
- Stage: Skill 03 Deep Reading only

## Problem

Nested tool execution over a remote code-mode host introduces a second asynchronous runtime inside the primary agent turn. Without explicit ownership, callbacks can be delivered to the wrong cell or session, outlive the work that created them, block unrelated sessions, or leave the remote host waiting forever after cancellation. The selected Codex change adds host-to-session callback forwarding plus state and tests that define ownership, cancellation, boundedness and concurrency rules for this gRPC path.

## Facts

1. Each gRPC code-mode session subscribes to nested tool calls and forwards tool invocations and notifications to that session's delegate.
2. Tool completion is sent back through the host; the change includes explicit handling for oversized tool results and errors rather than treating arbitrary payload size as unbounded.
3. Callback state tracks ownership by execution/cell and validates callback identifiers before admission.
4. A nested tool call is rejected when the requested tool is not enabled for the execution. The state checks the tool name and tool kind against the execution's enabled-tool map.
5. Pending delegate work is bounded by `MAX_PENDING_DELEGATE_CALLS`; further tool or notification callbacks are rejected after the combined pending limit is reached.
6. Recent callback identities are bounded separately with `MAX_RECENT_CALLBACK_IDS = 4_096`, preventing unbounded retention of historical callback identifiers.
7. Notification call IDs must match the execution that owns them, and callbacks cannot claim another execution's cell.
8. Callback work carries `CancellationToken` ownership. Tool delegates receive a child token, and cancellation races are handled explicitly with `tokio::select!`.
9. A tool delegate that cancels itself returns an error without hanging the session; synchronous delegate panic paths are also covered by tests so callbacks are not orphaned and the session is not automatically closed by that panic.
10. Completed cells and terminated cells have different cleanup semantics: the maintainer description states completed cells drain notifications, while terminated cells cancel them; session shutdown revokes outstanding callback work.
11. Closed/cancelled callback admission is handled without forwarding new work to the delegate. Rejected notifications are dropped with a warning rather than admitted as valid work.
12. Callback completion itself observes cancellation, so a cancelled invocation can avoid sending a stale completion back to the host.
13. Identifier size is validated using gRPC protocol bounds. Tests cover oversized execution call IDs, callback IDs and notification IDs.
14. Notification text and tool output/error handling are bounded; tests include oversized notification text and oversized tool results/errors, including UTF-8-safe truncation behavior for notification text.
15. The change explicitly avoids serializing independent callbacks or sessions. An integration test named `large_unary_tool_completion_does_not_block_an_independent_session` verifies that a large completion in one session does not block unrelated session work.
16. Tests also cover completion ordering, malformed callbacks, cancellation, delegate panic, concurrent work and independent session yield limits.

## Mechanisms established by the source

### Execution-scoped callback ownership

An execution registers the cells and enabled tools that belong to it. Callback admission checks that the callback's call ID, cell identity and tool definition align with that execution. This turns callback routing from best-effort message delivery into an ownership check.

### Explicit cancellation capability

Each active callback receives a cancellation token tied to its runtime ownership. Cancellation can therefore flow from cell termination or session shutdown into delegate work and into the completion path. The tool delegate receives a child token rather than a detached future with no revocation channel.

### Different closure semantics for completion and termination

The source distinguishes clean completion from forced termination. A completed cell may still need already-started notification callbacks to drain; a terminated cell cancels outstanding work. This avoids treating every cell closure as either "wait forever" or "drop immediately."

### Bounded admission and payloads

The callback runtime bounds pending delegate calls, recent callback IDs, identifier sizes and output/error/notification payloads. These checks put limits at the protocol/runtime boundary instead of assuming the delegate or remote host will behave benignly.

### Concurrent sessions without a global callback lock

The change allows independent callbacks and sessions to progress concurrently. The large-unary-completion test is important because it verifies the architecture does not gain safety by globally serializing unrelated session work.

### Panic containment

Synchronous delegate panics and asynchronous callback failure are caught around the delegate boundary. The runtime converts panic/failure into bounded callback outcomes rather than allowing a single nested callback to orphan state or collapse the whole gRPC session path.

## Evidence

- Commit `ba2fb483197a6b428b8c6d999d192bb056c64ae7` is a 1,761-line change focused on forwarding gRPC code-mode callbacks and defining their lifecycle.
- The maintainer description explicitly names callback forwarding, bounded results/errors, ownership, cancellation, completed-versus-terminated cell behavior, shutdown revocation, validation and non-serialization of independent callbacks/sessions.
- Session-state changes enforce enabled-tool checks and `MAX_PENDING_DELEGATE_CALLS`, and retain a bounded set of recent callback identifiers.
- Integration/state tests cover cross-execution cell ownership, identifier bounds, delegate self-cancellation, synchronous delegate panic, notification cancellation, oversized payloads and independent-session progress.

## Limitations

1. The selected source is specifically the gRPC code-mode session/host path. It does not establish identical callback semantics for every Codex tool transport.
2. The commit demonstrates bounded result/error handling but the reading should not infer universal payload limits for other transports or APIs.
3. A bounded pending-callback count prevents unbounded in-memory admission, but the source does not establish fairness or priority among callbacks near the limit.
4. Cancellation is cooperative across token-aware work. The source does not prove that arbitrary external side effects already issued by a delegate can be rolled back.
5. Ownership validation is runtime identity validation, not authorization of the underlying external tool side effect.
6. Keeping 4,096 recent callback IDs bounds memory, but once identifiers age out, the selected source alone does not establish any durable cross-restart duplicate-callback protection.
7. The tests demonstrate independent-session progress in covered scenarios; they do not prove absence of all shared-resource contention in production.
8. Notification dropping after rejection is visible through warnings in the changed path, but the source does not establish durable audit retention for every rejected callback.

## Comparisons

- **Detached callback futures:** simple but hard to cancel, attribute, or drain safely when cells and sessions end.
- **Global callback serialization:** simplifies ordering but allows one slow completion to stall unrelated sessions.
- **Execution-owned callbacks with per-callback cancellation:** preserves local safety boundaries while allowing independent sessions to remain concurrent.
- **Unbounded callback admission:** risks memory growth and callback storms; the changed runtime rejects work after an explicit pending limit.

## Unresolved questions

1. Are callback IDs or execution ownership records persisted anywhere durable enough to support process-restart recovery, or are they intentionally in-memory session state?
2. What is the exact protocol-level maximum for tool result payloads, and how is truncation signaled to the caller so data loss is distinguishable from a naturally short result?
3. What fairness policy applies when many concurrent callbacks approach `MAX_PENDING_DELEGATE_CALLS`?
4. How are callbacks reconciled when network failure occurs after the delegate finishes but before the host receives completion?
5. Can a retried remote callback be recognized after its ID falls out of the bounded recent-ID set?
6. Which callback failures are surfaced to the parent agent turn versus only logged at the code-mode session boundary?
7. Are external tool side effects expected to implement their own idempotency when callback completion is ambiguous?

## Reading boundary

This note establishes the ownership, validation, cancellation, boundedness, cleanup and concurrency mechanisms in the selected gRPC code-mode callback implementation. It does not choose a generalized callback protocol for CodeFlowMu or infer durable exactly-once semantics; those are Skill 04 analysis questions.
