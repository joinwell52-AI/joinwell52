---
schema: "research-analysis/v1"
id: "AN-20260808-03"
date: "2026-08-08"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260808-03"
column: "open-source-engineering"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260808-03-code-mode-grpc-host-protocol.md"
output_contract: "Research Object"
research_object: "Correlated Multi-Stream Agent Host Contract"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Correlated Multi-Stream Agent Host Contract

## Governed scope

This object performs Skill 04 using only the three completed same-day Reading Results, with `Q-20260808-03` as the primary Open-source Engineering input. It introduces no unread host implementation, publication copy, or release authorization.

## Analysis

```yaml
analysis:
  observations:
    - The primary Reading Result defines a versioned `codex.code_mode.v1` gRPC boundary for session ownership, execution, waits, cancellation, termination, nested tool callbacks, notifications, and typed content results.
    - Control events, tool subscriptions, and tool-result completions intentionally use independent HTTP/2 streams to reduce head-of-line blocking, which makes cross-stream reordering a normal condition.
    - Client-chosen execution/wait identifiers, invocation identifiers, per-execution sequence numbers, and `CellClosed.final_tool_call_sequence` provide correlation and a drain watermark when total ordering is unavailable.
    - Dropping the OpenSession event stream closes the session and terminates active cells, so stream lifetime functions as a session lease.
    - Lifecycle completion and semantic success are distinct because `ExecutionCompleted` may still carry `error_text`, while RPC transport failure is another separate error surface.
  cross_comparison:
    - Session-budget governance also distinguishes admitting new work from draining already-admitted obligations; safe quiescence requires evidence that outstanding work has settled.
    - Managed-model policy supplies authority semantics that the gRPC transport contract itself does not define; transport versioning alone is not an authorization system.
    - The final sequence watermark is analogous to closure evidence: a client must not retire state merely because a close event arrived if lower-numbered callbacks may still be in flight.
    - Explicit CancelWait acknowledgement demonstrates a reusable race-control pattern: cancellation is not complete until the remote side confirms retirement of the old wait.
  discussion:
    - Splitting traffic across streams trades serialization simplicity for concurrency. Correctness then moves into correlation IDs, explicit outcome states, acknowledgements, and drain conditions rather than arrival order.
    - A session lease tied to a control stream is operationally simple and fail-closed, but it deliberately sacrifices transparent reconnect/resume unless a higher layer adds durable recovery semantics.
    - Package-level `v1` makes the wire namespace durable but is not equivalent to runtime feature negotiation; mixed-version compatibility still needs an explicit policy.
    - Lifecycle finality must remain separate from application success. An Agent platform must not map an outer `completed` token directly to successful work without inspecting nested result state and business evidence.
    - Reliable remote hosting also needs retry and idempotency contracts for mutating RPCs; the Reading Result explicitly leaves those guarantees unresolved.
  research_judgment:
    - A remote Agent host should treat cross-stream reordering as a first-class contract and recover safe local order through durable correlation identifiers, monotonic sequence evidence, and explicit drain watermarks.
    - Lifecycle completion must remain separate from semantic success and transport success; clients need typed outcome interpretation before promoting execution results into business completion.
    - Cancellation and termination should be acknowledgement-bearing state transitions, not local assumptions based on dropping a future or closing a UI action.
    - Package-level protocol versioning is necessary but insufficient for long-lived interoperability; retry/idempotency, authentication, and feature-negotiation contracts must be specified before treating the boundary as production-grade remote execution infrastructure.
  uncertainty:
    - Confidence is high in the stated wire-level lifecycle and ordering semantics because they are explicit in the completed protobuf Reading Result.
    - Confidence is medium that split streams improve end-to-end responsiveness under realistic CodeFlowMu loads because no concurrency benchmark or host implementation test is included in the selected change.
    - Confidence is low about reconnect, replay, idempotent retry, and authentication behavior because those mechanisms are outside the Reading Result.
  counter_evidence:
    - The selected change mainly defines protocol and bindings; it does not prove end-to-end behavior under real concurrent traffic.
    - Cross-stream concurrency intentionally removes a single total event order and therefore increases client reconciliation complexity.
    - Dropping the session stream terminates active cells, so stream-lease simplicity does not provide resumable disconnection semantics by itself.
    - `ExecutionCompleted.error_text` means outer lifecycle completion cannot be used as a semantic success signal.
  engineering_impact:
    tmpa:
      - Use the case as research input on typed lifecycle evidence and ordering boundaries; it does not justify turning TMPA or FCoP into a transport protocol.
    digital_employee:
      - If Digital Employees execute through remote hosts, preserve WorkOrder identity above host-session leases so provider or transport session loss does not erase durable job state.
      - Keep execution outcome, business verdict, and transport status as different state dimensions.
    codeflowmu:
      - If execution is externalized over RPC, separate high-volume tool payload traffic from control/event traffic while adding execution IDs, invocation IDs, sequence numbers, and closure watermarks.
      - Require explicit cancel acknowledgements and idempotency keys before retrying mutating remote calls after transport failure.
      - Keep FCoP as the shared behavioral/work protocol surface; do not overload it with gRPC transport ordering or connection-liveness semantics.
      - Reconcile a worker's `completed` lifecycle result with nested error fields and QA evidence before changing task acceptance state.
  limitations:
    - No authentication, authorization, or tenant-binding contract is established in the selected protobuf evidence.
    - No runtime version negotiation or compatibility handshake is specified.
    - Retryability and idempotency semantics for mutating RPCs are unresolved.
    - End-to-end concurrency and backpressure properties are not demonstrated by tests in the selected change.
  future_questions:
    - Which CodeFlowMu execution events require monotonic sequence numbers or closure watermarks when tools and control traffic are separated?
    - What reconnect model preserves WorkOrder continuity if a remote host session lease ends on stream loss?
    - Which mutating RPCs require idempotency keys and durable effect receipts before automated retry is safe?
    - How should protocol version negotiation and capability discovery be layered without coupling FCoP work semantics to transport details?
```

## Research judgment

Treat remote Agent execution as a correlated multi-stream contract: concurrency may reorder events, so safe finality must be reconstructed from identifiers, sequence evidence, acknowledgements, and typed outcomes rather than arrival order or an outer `completed` label.

## Production input

Production may consume this Research Object only with the missing authentication, negotiation, idempotency, and end-to-end concurrency evidence stated explicitly.

## Evidence boundary

- `research/reading/Q-20260808-01-session-budget-governance.md`
- `research/reading/Q-20260808-02-managed-model-auto-review.md`
- `research/reading/Q-20260808-03-code-mode-grpc-host-protocol.md`

No unread material was consumed.
