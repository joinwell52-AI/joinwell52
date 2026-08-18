---
schema: publication-candidate-article/v2
title: "A Closed Trace Is Not an Effect Receipt"
date: '2026-08-18'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "What can a request trace prove when it covers queue receipt through a terminal operational outcome, and what evidence must remain separate for external effects?"
summary: "Request lifecycle telemetry can reconstruct queue receipt, admission, execution and terminal transport outcome, but it should not be used as a substitute for external-effect evidence. A same-day Codex change strengthens the request trace while making the remaining evidence boundary easier to see."
cover: research/runtime/production-work/2026/08/18/Q-20260818-03/baseline-cover.png
sources:
  - research/analysis/Q-20260818-03-lifecycle-telemetry-effect-certainty.md
---

![A Closed Trace Is Not an Effect Receipt cover](research/runtime/production-work/2026/08/18/Q-20260818-03/baseline-cover.png)

# A Closed Trace Is Not an Effect Receipt

A request trace can end cleanly while the world outside the runtime remains uncertain. The span may record `disconnected`, the handler may be gone, and the request lifecycle may be fully observable—yet an external service could already have committed the side effect before the connection disappeared.

That is not a tracing failure. It is an evidence-boundary problem.

A merged Codex exec-server change on 2026-08-18 makes the request lifecycle substantially more reconstructable. The inbound span and queue timestamp are created when the connection queue receives the request, optional W3C parent context is validated, the same span travels through server/client queues and route execution, queue duration is recorded after admission with a bounded route label, and terminal outcomes include success, error and disconnected.

Those are useful operational facts. They support a broader engineering judgment only if one distinction stays explicit: **request-lifecycle telemetry and external-effect certainty are different evidence planes.**

## Tracing from queue receipt closes an important blind spot

Handler-only tracing starts too late. It cannot explain how long a request waited before execution, whether the connection layer saw it, or whether the request disappeared before dispatcher admission.

Creating span ownership at connection-queue receipt changes that boundary. The same request identity now covers pre-admission waiting, route execution and response/disconnect handling. Queue latency is emitted only after admission, so the metric has a defined measurement boundary rather than treating “sitting in the queue” as an already-recorded completion fact.

The implementation also normalizes route labels to control metric cardinality. A trace can keep request detail while a histogram uses bounded route identity. That separation is an operational design choice: per-request evidence and fleet-level metrics do not have to expose the same dimensions.

## Terminal telemetry says what happened to the instrumented path

The changed request span carries an explicit terminal operational result. Server-side paths set result values for completion and error conditions; client-handled callbacks use an outcome guard that defaults unresolved termination to `disconnected` unless a more specific result is recorded first.

This reduces a common observability gap: cancelled or abruptly lost work no longer disappears from the telemetry simply because no success response was sent.

But `disconnected` is a statement about the request path. It can tell an operator that the instrumented lifecycle ended without a normal response. It cannot answer whether an external database committed, a remote API accepted a mutation, a message reached a broker, or a tool changed the outside world before the disconnect.

A closed span is therefore **request evidence**, not automatically an **effect receipt**.

## External effects need their own authoritative identity

When a request can create effects outside the runtime, stronger certainty usually comes from the system that owns those effects: a transaction ID, idempotency key, commit receipt, durable job identity, broker offset, external operation record or an equivalent authoritative signal.

The practical model is two linked evidence planes:

1. **Lifecycle telemetry** explains what happened to the request inside the runtime: receipt, queueing, admission, execution and terminal transport outcome.
2. **Effect evidence** establishes what the side-effect-owning system accepted, committed, rejected, compensated or still considers unknown.

The two should share stable correlation identity, but they should not be collapsed into one `success` or `failure` field. A transport-level success can coexist with a later business failure; a transport disconnect can coexist with a committed external effect.

This is especially important for recovery. If the request is disconnected and authoritative effect evidence cannot prove either absence or commitment, the correct next state may be **unknown + reconciliation**, not automatic retry and not automatic success.

## Better telemetry does not create stronger guarantees by itself

The selected implementation does not authenticate the caller. W3C parent context is correlation metadata, not an authorization credential. The evidence also does not establish that every descendant task keeps the inbound trace, that every emitted span survives exporter loss, that external effects are exactly-once, or that a disconnect can be rolled back.

For fully local operations that are transactionally coupled to the request handler, request completion may closely approximate effect completion. But that coupling is itself the reason the inference is safe. Once work crosses an external boundary or can outlive the response path, the effect state requires separate evidence.

This produces a useful operational rule: **close the request trace when the request path ends; do not close the effect question until the effect-owning system supplies enough evidence.** If the two disagree or one side is unknown, preserve the disagreement and reconcile it.

The next design questions are therefore concrete. Which stable effect identity should accompany external tool calls? Which detached tasks intentionally outlive the request? How should request outcomes map to effect states such as committed, rejected, unknown and compensated? What retention guarantees are required before telemetry becomes formal audit evidence rather than short-lived debugging data?

Stronger tracing makes these questions easier to ask. It does not make them disappear.

**Primary evidence:** [OpenAI Codex merged commit fd34ad72](https://github.com/openai/codex/commit/fd34ad7297d86ef8f679927db55a3c1d09735f55). The implementation and repository tests are public primary-source evidence; they do not independently establish complete causal tracing, exactly-once external effects or durable audit retention.
