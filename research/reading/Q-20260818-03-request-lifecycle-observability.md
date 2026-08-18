# Q-20260818-03 — Exec-server request tracing begins at queue receipt and closes on terminal outcome

- Runtime date: 2026-08-18
- Column: Open-source Engineering
- Source object: Q-20260818-03
- Primary source: https://github.com/openai/codex/commit/fd34ad7297d86ef8f679927db55a3c1d09735f55
- Evidence class: Fact for merged code/tests; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

If request telemetry starts only after a JSON-RPC request is admitted to a handler, queueing delay and pre-dispatch loss are invisible, and client-handled callbacks can lose a continuous trace across asynchronous queues. The merged change extends the observable request lifecycle backward to connection-queue receipt and forward through response handling or disconnect.

## Facts

1. `JsonRpcConnectionEvent` now has a `QueuedRequest` form carrying the parsed request, a tracing span and the `Instant` when the request was queued.
2. The queued-request constructor creates the inbound server span as soon as a JSON-RPC request is converted into a connection event, before dispatcher admission.
3. The span is named `codex.exec_server.request`, initially records `otel.kind=server`, an unknown route name, the request method and an empty result field.
4. If the request carries W3C trace context, the connection layer attempts to set that context as the new span's parent. Invalid trace carriers are ignored with a warning rather than trusted blindly.
5. The same request span is carried through the RPC client event path instead of creating a fresh span only after the event is consumed.
6. A regression test verifies that the inbound request span remains open while the event is queued and is exported only after the consumer receives and drops the carried span, demonstrating span ownership across the queue boundary.
7. The dispatcher receives the original `request_span` and `queued_at` timestamp along with the request.
8. Once a bounded route is resolved, the dispatcher records that route into the span's OpenTelemetry name rather than leaving raw/unbounded method-derived telemetry as the route label.
9. Unknown methods are normalized to the bounded `unknown` route for telemetry and complete with either `error` or `disconnected` depending on whether the error response can be sent.
10. For known routes, synchronous route-construction time is measured separately and excluded from the queue-duration metric.
11. The new histogram is named `exec_server_request_queue_duration_seconds` and measures time spent queued before execution/admission.
12. Queue duration is not recorded merely because a request is sitting in the inbound queue; a test holds admission permits and verifies the metric is absent until admission proceeds.
13. After admission, the histogram contains the queue-duration data point and uses a bounded route label.
14. The request span is instrumented around route execution, so route work runs under the same inbound span that began at receipt.
15. If the connection closes while the route is running or before a response can be sent, the span result and request-completion telemetry are recorded as `disconnected`.
16. Normal route response handling records the route-supplied result value on the same span and request-completion telemetry before the task closes.
17. Client-handled network-policy callbacks now carry the inbound request span into asynchronous handling rather than losing trace ownership at the client event queue.
18. `ClientRequestOutcome` defaults its result to `disconnected` and writes the final result to the span on drop, making abrupt loss of the handler path observable unless a more specific result is set first.
19. Client policy handling sets `error` for unsupported/error paths and `success` for handled responses, while cancellation caused by disconnection remains `disconnected`.
20. The asynchronous policy-decision task is instrumented with a clone of the request span, preserving the request trace while the callback is processed.
21. Tests assert that network-policy decisions execute inside `codex.exec_server.request` and that exported callback spans all have terminal results.
22. Regression tests require outcome coverage for completed, capacity-rejected and cancelled policy requests; the demonstrated labels include `success` and `disconnected`, with error paths explicitly set to `error` in the implementation.
23. The commit's tests also cover trace-parent propagation across server/client queues, request span lifetime and queue-duration telemetry.
24. The patch improves one exec-server request path; it does not claim complete causal tracing for all work spawned after the request or all external side effects.

## Mechanisms

### Span ownership begins at queue receipt

The connection layer creates the span and timestamp before the request is handed to downstream dispatch. Carrying both through queue events makes queue residence part of the observable request lifecycle rather than an unmeasured prelude.

### Parent context propagation with validation

When a request supplies a W3C trace carrier, the runtime attempts to attach it as the parent. Invalid carriers are ignored. This supports cross-process correlation without treating malformed remote trace metadata as authoritative structure.

### Bounded route naming

The span begins before route resolution, so its telemetry name starts as `unknown`. After the router resolves the request, the implementation records the bounded route name and uses that same bounded label for queue-duration telemetry. This avoids making arbitrary method strings a high-cardinality metric label.

### Queue time separated from route setup

The dispatcher retains the original queue timestamp and measures synchronous route construction separately. The queue histogram therefore represents pre-execution waiting rather than silently including route setup work.

### Terminal result ownership

The request span remains live through handler and response handling. Server-side dispatch explicitly records error/disconnect/result values; client-handled callbacks use a small outcome guard whose drop behavior defaults unresolved termination to `disconnected`. This reduces paths where a span could end without a terminal result.

## Evidence

- Connection code converts inbound JSON-RPC requests into `QueuedRequest { request, request_span, queued_at }` at receipt.
- The span accepts validated W3C parent context and is carried through `RpcClientEvent::Request`.
- Dispatcher code receives the same span/timestamp, records route identity, queue duration and terminal result.
- Telemetry adds `exec_server_request_queue_duration_seconds` with a bounded route dimension.
- Queue-duration tests verify no premature metric while admission is blocked and a histogram point after admission.
- Span-lifetime tests verify the span remains open until the queued event is consumed.
- Network-policy callback tests verify the inbound span survives the client queue and that completed/rejected/cancelled requests receive terminal outcomes.

## Limitations

1. The demonstrated trace boundary is the changed exec-server request and network-policy callback path; it is not proof of end-to-end tracing across every process, tool, subprocess or external service.
2. W3C trace context supports correlation but does not authenticate the caller. A valid-looking trace parent is not an authorization credential.
3. Bounded route labels intentionally trade detail for safe cardinality; requests normalized to the same route cannot be distinguished by that metric dimension alone.
4. Queue-duration telemetry measures the interval defined by this connection/dispatcher pipeline; it is not total user-perceived latency before the message reaches the server or after a response leaves it.
5. Synchronous route setup is deliberately excluded from queue duration and therefore must be observed elsewhere if it becomes a latency problem.
6. `disconnected` is a terminal observability outcome, not evidence about whether an external side effect may already have occurred before the connection was lost.
7. The outcome taxonomy shown in this patch is operational telemetry. It does not establish business-level success, idempotency or exactly-once semantics.
8. A span that closes cleanly proves telemetry lifecycle completion, not complete causal capture of every descendant task.
9. The tests are regression tests for the implemented path and do not establish trace completeness under every transport failure or exporter outage.
10. In-memory/exporter tests validate span behavior in the test environment; the patch does not prove downstream production observability backends retain every emitted span.

## Comparisons

- Starting a span only at handler execution misses queue delay. Creating it at connection receipt makes pre-dispatch waiting measurable.
- Using raw request methods as metric labels offers detail but risks unbounded cardinality. The merged implementation resolves to bounded route names for queue telemetry.
- Creating a second client-side span after dispatch would fragment one inbound request lifecycle. Carrying the original span through the queue preserves ownership across asynchronous handling.
- Recording only successful completions creates survivorship bias. Defaulting unresolved callback outcomes to `disconnected` and setting error/success explicitly gives cancelled and failed paths terminal observability too.

## Unresolved questions

1. Which descendant tasks intentionally remain children of the inbound request span after the response is sent, and which are detached?
2. Are request IDs, process IDs or other correlation identifiers recorded alongside trace IDs for audit/debug workflows that do not have a trace backend?
3. How are spans sampled, exported and retained in production, especially under overload or exporter failure?
4. Is there a separate metric for route-setup duration now that it is excluded from queue latency?
5. How does the request outcome taxonomy map to protocol error codes and application-level failures for operators?
6. Could a disconnected request have completed an external side effect, and if so, what separate evidence distinguishes that state?
7. Are all alternate exec-server transports funneled through `JsonRpcConnectionEvent::message`, or are there paths where the request span is intentionally absent?
8. What cardinality guarantees define the router's bounded route names, and are they centrally validated?

## Reading boundary

This note establishes a merged, tested observability mechanism: an exec-server request span is created at inbound queue receipt, optionally linked to validated W3C parent context, carried through dispatch/client queues, paired with queue-duration telemetry after admission, and closed with terminal operational outcomes including error or disconnect. The mechanism improves reconstructability for the demonstrated request path. It does not establish complete causal tracing, authentication, exactly-once behavior, external-side-effect rollback or guaranteed telemetry retention. Those broader judgments belong to Skill 04 Analysis.
