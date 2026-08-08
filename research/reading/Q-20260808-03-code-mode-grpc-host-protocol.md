# Reading Record — Q-20260808-03 Versioned gRPC host protocol for agent code-mode sessions and executions

- **Queue item:** `Q-20260808-03`
- **Column:** Open-source Engineering
- **Selection status:** Selected
- **Priority:** P0
- **Skill invoked:** `Skill 03 — Deep Reading`
- **Operating date:** 2026-08-08 (Asia/Shanghai)
- **Primary source class:** Merged maintainer protocol implementation in `openai/codex`

## Reading scope

This pass reads merged Codex commit `8073dbb20bbd57f2acdc18708a95e8fbbfc8b91f` / PR #37510, with emphasis on the complete `codex.code_mode.v1` protobuf contract, generated Rust bindings and build integration. The bounded question is what lifecycle and concurrency semantics the versioned host protocol actually makes explicit for code-mode sessions, executions, waits, nested tool callbacks, notifications, results, cancellation and termination. The Reading Result records only the observable protocol and build evidence; it does not prescribe a CodeFlowMu implementation.

## Deep Reading output

```yaml
reading_notes:
  problem:
    - A code-execution agent host needs a stable boundary between a stateful execution runtime and the process that owns tools, approvals and session lifecycle.
    - Nested tool calls and large tool inputs/outputs can block unrelated control events if all traffic shares one serialized event channel, so the protocol needs independent concurrency paths and explicit correlation identifiers.
    - Wait cancellation and cell termination need explicit lifecycle messages; otherwise a canceled wait can race with a later wait and clients cannot reliably know whether a cell is live, missing, yielded, completed or terminated.

  facts:
    - PR #37510 is merged and its merge commit is `8073dbb20bbd57f2acdc18708a95e8fbbfc8b91f`, titled `Define the code-mode host gRPC protocol`.
    - The change introduces a protobuf package named `codex.code_mode.v1`, making the protocol namespace explicitly versioned at v1.
    - The `CodeModeHost` service exposes `OpenSession`, `CloseSession`, `SubscribeToToolCalls`, `CompleteToolCall`, `AcknowledgeNotification`, `Execute`, `Wait`, `CancelWait` and `Terminate` RPCs.
    - `OpenSession` returns a streaming `SessionEvent`. The protocol comment states that the first event is always `SessionOpened` and dropping this stream closes the session and terminates active cells.
    - A session can carry optional cell-execution limits for maximum yield time and maximum heap size.
    - `SessionEvent` can carry session-opened, tool-call-cancelled, notification, notification-cancelled and cell-closed events.
    - Tool callbacks use a separate server-streaming subscription. An empty tool-name filter matches all tools, and each invocation is routed to exactly one matching subscription even if filters overlap.
    - `ToolCall` carries `session_id`, client-chosen/correlated `execution_id`, `cell_id`, `invocation_id`, a runtime tool-call ID, tool name/kind, optional JSON input bytes and a per-execution sequence number starting at one.
    - Tool results are submitted through a separate unary `CompleteToolCall` RPC with success bytes or a failure message. The protocol comment says each result receives its own HTTP/2 stream so a large response does not block unrelated tool completions or session control events.
    - Tool-call cancellation is delivered on the session-control stream and may arrive before the corresponding `ToolCall` because control events and tool subscriptions are independent HTTP/2 streams.
    - Notifications are separate identified objects that carry notification ID, execution ID, cell ID, call ID and text. Clients explicitly acknowledge them through `AcknowledgeNotification`.
    - `CellClosed` includes `final_tool_call_sequence`; the protocol requires all lower tool-call sequence numbers to be observed before a client retires the cell.
    - `Execute` is server-streaming. Its comment states that it emits `ExecutionStarted` immediately and then exactly one `ExecutionOutcome` when execution yields, completes or is terminated.
    - `ExecuteRequest` includes session ID, a client-chosen execution ID, tool-call ID, source code, enabled tool definitions, optional yield time and optional max output tokens.
    - `ExecutionStarted` returns execution ID and server-assigned cell ID, while the client-chosen execution ID allows callbacks to be correlated even before cell admission is observed.
    - `Wait` is a unary RPC keyed by session ID, cell ID and a client-chosen wait ID. Its response distinguishes a live-cell outcome from a missing-cell outcome.
    - `CancelWait` explicitly acknowledges retirement of a canceled wait before another wait starts; this is stated as a race-control mechanism in the service comment.
    - `Terminate` targets a session/cell and returns the same `WaitResponse` shape used for cell state observation.
    - `ExecutionOutcome` carries content items and one of three protocol states: yielded, terminated or completed. Completion may include optional `error_text` rather than using a separate application-level failed variant.
    - Content results are typed as text, image or audio. Image content can carry a detail enum with auto, low, high and original values.
    - Tool definitions carry public name, namespaced tool name, description, function/freeform kind and optional input/output schema JSON bytes.
    - Cargo build integration uses vendored `protoc`, generates both tonic client and server bindings for every `src/grpc/*.proto`, and reruns generation when that directory changes.
    - Under Bazel, the change adds protobuf/rules-proto dependencies and registers a custom `prost` toolchain so generated code uses the workspace's prost/tonic runtime versions.
    - The Rust module exports Bazel-generated bindings under `cfg(codex_bazel)` and otherwise uses `tonic::include_proto!("codex.code_mode.v1")`, providing parallel Cargo and Bazel consumption paths.

  mechanisms:
    - Session ownership is represented as a lease on the `OpenSession` event stream: stream lifetime is coupled to session lifetime, while explicit `CloseSession` remains available as a control RPC.
    - The protocol splits control, callback and result traffic across independent HTTP/2 streams. This reduces head-of-line blocking but creates intentional cross-stream reordering that clients must reconcile with identifiers and sequence numbers.
    - Tool invocation routing separates subscription ownership from invocation completion: each invocation is assigned to exactly one matching subscription, then its result returns over a dedicated stream keyed by invocation ID.
    - Client-chosen execution IDs and wait IDs allow correlation to exist before server-side cell admission and allow a canceled wait to be retired explicitly before a replacement begins.
    - Per-execution tool-call sequence plus `CellClosed.final_tool_call_sequence` creates an observable drain condition for a cell, preventing a client from retiring it while lower-numbered callbacks may still be in flight.
    - The execution state machine is protocol-visible through started plus one outcome; yielded is not the same as completed, and termination is explicit.
    - Large nested tool inputs/outputs are intentionally kept off the main session event stream, making event-stream responsiveness an explicit design goal in the protocol comments.
    - Versioning is carried in the protobuf package name rather than through a runtime version-negotiation field in each request.
    - Build reproducibility is addressed by generating Rust client/server types through both Cargo and Bazel while aligning protobuf code generation to the repository's own prost/tonic versions.

  evidence:
    - The merged PR body explicitly states the introduction of the `codex.code_mode.v1` API, Rust tonic bindings and Bazel protobuf/prost build targets.
    - The full 257-line protobuf file defines all RPCs, request/response messages, event unions, identifiers, sequence fields, lifecycle comments and content types described in this Reading Result.
    - Protocol comments explicitly document stream-drop session termination, independent tool subscriptions, exactly-one subscription routing, per-result HTTP/2 streams, cross-stream cancellation reordering, immediate ExecutionStarted emission and CancelWait retirement.
    - `build.rs` selects vendored `protoc`, compiles all gRPC proto files, and enables both client and server generation.
    - The Bazel toolchain change exposes workspace prost and tonic runtime libraries instead of relying on rules_rs default versions.
    - `grpc/mod.rs` shows Cargo/Bazel consumers exporting the same `codex.code_mode.v1` generated API under different build configurations.

  limitations:
    - This change primarily defines the protocol contract and build bindings. The changed-file set does not add an end-to-end host implementation test suite proving every lifecycle, race and backpressure property under real concurrent traffic.
    - Authentication, authorization and transport identity are not defined in the protobuf messages shown here; those concerns may exist in a surrounding transport layer but are outside this protocol change's evidence boundary.
    - Package versioning is `v1`, but the schema does not expose feature negotiation, minimum/maximum peer versions or a handshake for compatible optional behavior.
    - The protocol documents exactly-one matching tool subscription but does not specify the arbitration algorithm when several overlapping subscriptions are eligible; fairness and deterministic selection are not established by the schema.
    - Cross-stream ordering is intentionally not total. Cancellation may precede the tool call it cancels, so clients require local reconciliation logic; the protobuf does not define how long unmatched cancellation state should be retained.
    - `ExecutionCompleted` can contain `error_text`, so application-level error completion is represented inside a completed outcome instead of a distinct failed state. Consumers must not assume `completed` means error-free solely from the outer variant.
    - RPC-level gRPC status failures are separate from `ExecutionOutcome`; the schema itself does not enumerate retryability, idempotency guarantees or canonical error classes for network/service failures.
    - `CloseSession` and dropping the OpenSession stream both imply session closure, but the protobuf does not spell out precedence or idempotency if both occur concurrently.
    - The schema exposes `Terminate` but does not state a graceful-shutdown interval or guarantee regarding in-flight tool callbacks at the moment termination is requested.
    - `WaitResponse` distinguishes live versus missing cells but does not encode why a cell is missing; clients may need out-of-band context to distinguish never-admitted, already-retired or session-closed cases.
    - JSON schemas for tool input/output are transported as raw bytes; the host protocol does not itself validate semantic compatibility between a tool definition and later callback payloads.

  comparisons:
    - Unlike one monolithic event stream, the protocol deliberately isolates large tool result traffic onto independent HTTP/2 streams and accepts the resulting cross-stream reordering as a client-visible condition.
    - Unlike server-generated execution identifiers only, the client supplies `execution_id`, allowing nested callbacks to be correlated before the `ExecutionStarted` event provides a cell ID.
    - Unlike implicit cancellation by dropping a future, wait cancellation has an explicit `CancelWait` acknowledgment before a subsequent wait is considered safe to start.
    - Unlike an unversioned internal Rust interface, the host boundary is expressed as protobuf package `codex.code_mode.v1` and generated into both client and server bindings.
    - Cargo and Bazel generation are deliberately kept aligned to common prost/tonic runtime versions, reducing build-system divergence at the wire-contract boundary.

  contradictions:
    - The PR describes the protocol as managing “executions” while `ExecutionCompleted` can still contain `error_text`; therefore semantic success and lifecycle completion are not identical. The schema resolves lifecycle completion separately from application success.
    - The service comment says `ExecutionStarted` is emitted immediately, yet callbacks may need correlation before that event is received; the protocol compensates by requiring a client-chosen execution ID in the request and echoing it in tool calls.
    - The protocol seeks independent-stream progress to avoid head-of-line blocking, but this also removes a single total event order. Sequence numbers and explicit comments are required to recover enough ordering for safe cell retirement.

  unresolved_questions:
    - What concrete server implementation enforces the exactly-one subscription routing rule, and how does it choose among overlapping subscribers under churn or reconnect?
    - What retry/idempotency contract applies to `CompleteToolCall`, `AcknowledgeNotification`, `CloseSession` and `Terminate` after transport failure?
    - Is there a replay or resume mechanism for a broken OpenSession event stream, or does stream loss always terminate the session by design?
    - How are authentication, authorization, tenant identity and per-tool capability restrictions bound to a gRPC connection/session outside this protobuf file?
    - What compatibility policy will govern future `codex.code_mode.v2` or additive v1 fields, and how will mixed-version peers negotiate behavior?
    - What end-to-end concurrency tests cover cancellation-before-call, large simultaneous tool results, cell close sequencing and canceled-wait retirement?
    - How should clients interpret `ExecutionCompleted.error_text` relative to gRPC transport errors and tool-level failures when deciding retry or finality?
```

## Source traceability

1. Merged commit: `https://github.com/openai/codex/commit/8073dbb20bbd57f2acdc18708a95e8fbbfc8b91f`
2. Pull request #37510: `https://github.com/openai/codex/pull/37510`
3. Complete protobuf contract: `codex-rs/code-mode-protocol/src/grpc/codex.code_mode.v1.proto` in PR #37510
4. Cargo protobuf generator: `codex-rs/code-mode-protocol/build.rs` in PR #37510
5. Cargo/Bazel generated binding export: `codex-rs/code-mode-protocol/src/grpc/mod.rs` in PR #37510
6. Bazel prost toolchain: `bazel/toolchains/prost/BUILD.bazel` in PR #37510
7. Today's Research Plan: `research/runtime/plans/2026/08/2026-08-08-plan.json`
8. Skill 03: `research/skills/03-deep-reading.md`

## Reading gate decision

**Result:** Deep Reading completed from the merged protocol definition and build integration. The Reading Result records session lease semantics, independent callback/result streams, cross-stream reordering, execution/wait correlation, cancellation and termination, content outcomes, versioned protobuf boundaries and Cargo/Bazel binding generation. It explicitly records missing evidence around authentication, version negotiation, retry/idempotency and end-to-end concurrency tests. No Research Analysis, implementation guidance or article was produced.
