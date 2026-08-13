---
schema: publication-candidate-article/v2
title: "A Reconnected Session Is Not Recovered Work"
date: '2026-08-13'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "What does a successful session rebind establish—and what does it not establish—after the underlying runtime service changes?"
summary: "A stable logical session can reopen a failed remote binding while the work already running on the old binding remains interrupted. Generation-scoped identity prevents the replacement host from inheriting stale cell authority, but it does not migrate lost execution."
sources: "research/analysis/Q-20260813-02-session-rebinding-boundary.md"
cover: "staging/publication-candidates/2026-08-13-session-rebinding-execution-continuity-cover.svg"
---

![A continuous luminous thread crosses a dark break and enters a new orbit, representing stable session identity across a replacement binding without pretending that interrupted work crossed the gap](staging/publication-candidates/2026-08-13-session-rebinding-execution-continuity-cover.svg)

# A Reconnected Session Is Not Recovered Work

When a remote runtime disappears and a client reconnects, the most tempting status message is also the most misleading: “the session recovered.” That phrase can describe at least two different outcomes. The logical session may be usable again for future operations, while work already executing on the failed binding has ended and will never continue.

The selected Codex gRPC code-mode change makes this distinction concrete. It keeps a stable public session object, replaces a stopped remote binding on demand, serializes concurrent attempts to open the replacement, and gives each binding a generation. The implementation restores later availability without claiming that old in-flight work migrated.

That boundary matters far beyond one transport. Any system that preserves a stable user-facing identity over replaceable workers, hosts or connections needs to say whether it recovered the **control surface**, the **execution**, the **result**, or only the ability to start new work.

## A stable session can outlive a failed binding

The public session in the examined implementation is not identical to one remote host session. It owns a replaceable binding. Before `execute`, `wait` or `terminate`, the client checks whether the current binding remains live. If it has stopped, the client may open a replacement binding to the same service endpoint.

This is a useful availability property: callers can retain the logical session instead of rebuilding every reference in the application. But the stable outer identity should not erase the lifecycle of the resource underneath it. The old binding and the new binding are different execution epochs.

A one-permit semaphore makes reopening single-flight. The first caller that observes the failure acquires the permit and opens the replacement. A later concurrent caller rechecks after acquiring the permit and reuses the already-published binding. The lock controls replacement creation; it does not globally serialize the cells that run after the replacement becomes available.

The source-backed evidence is the same-day Research Object, based on [OpenAI Codex commit `bde723a`](https://github.com/openai/codex/commit/bde723ae7dedc87754228a2476a7a4cfbf05b4b8) and [PR #38257](https://github.com/openai/codex/pull/38257). These are public primary-source implementation records, not independent validation of a general recovery architecture.

## Generation identity draws the epoch boundary

Reopening alone creates an identity problem. A replacement host may restart its local cell counter at `1`. If the public API exposes only that host-local number, an old reference to cell `1` can be mistaken for the replacement host's new cell `1`.

The selected design prevents that aliasing by assigning a generation to each binding. Generation one keeps the original public form; later bindings expose identifiers such as `g2:1`. The same mapping is applied to nested tool calls, notifications and cell-closed callbacks, so callback ownership follows the binding epoch instead of merely matching a recycled local number.

`wait` and `terminate` translate a public cell ID only when its generation matches the live binding. A stale generation is rejected rather than forwarded to the replacement host. This rejection is not a recovery failure. It is the mechanism that prevents a stale caller from controlling unrelated new work.

Generation identity therefore answers a narrow but important question: **which live binding epoch owns this reference?** It does not answer whether the old cell can be reconstructed, whether its side effects committed, or whether a result was lost.

## Rebinding restores future availability, not past execution

The integration test preserves the distinction instead of hiding it. The original host session is interrupted; the pending old wait ends and the old cell closes. A replacement host starts at the same endpoint. Two later executions complete under generation-two identities, while operations against the old generation are rejected.

This supports a bounded conclusion:

- the logical session remains useful after host replacement;
- replacement creation is coordinated;
- old and new cell identities are not confused;
- new work can run concurrently after the rebind;
- work already executing on the old host is interrupted rather than migrated.

Calling all of this “session recovery” without qualifiers would upgrade later availability into an unsupported execution-continuity claim. A clearer operational vocabulary would report at least `Rebound`, `Old Work Interrupted`, `New Work Admitted`, and—only when separately established—`Work Reconstructed` or `Result Recovered`.

## Recovery needs more than one status

A remote-session control plane should record the outcomes that operators actually need to distinguish.

**Logical identity.** Does the caller still address the same public session?

**Binding epoch.** Which live connection or host generation currently implements that session?

**Execution continuity.** Did an in-flight operation continue, restart, fail, or become unknown?

**Result continuity.** Is there durable evidence for the old operation's terminal result?

**Admission.** May a later operation start on the replacement binding?

These dimensions should not collapse into a single green badge. A stable session with a new binding and an unknown prior side effect is operationally very different from a session whose work was durably replayed and reconciled.

The same separation improves automation. A retry policy can admit new work after `Rebound` while holding any non-idempotent old operation for reconciliation. Telemetry can count host replacements separately from reconstructed work. User interfaces can explain that the workspace is available again without claiming that the interrupted command completed.

## What remains unrecovered

The implementation keeps generation state in the client process. The examined source does not establish durable generation identity across a client restart. It also does not recover results lost with the previous runtime service, prove bounded retry under repeated instability, or define a general transport-independent session protocol.

Globally unique remote resource identifiers could avoid local-number aliasing through another mechanism. A system with durable operation journals could reconstruct selected work after replacement. Those alternatives do not weaken the main judgment: whatever mechanism is chosen, rebinding and work recovery must remain separately observable.

The evidence supports an architectural discipline, not a universal implementation prescription. A replacement binding restores a path for future operations. It does not, by itself, carry old execution across the gap.

## Questions for a durable design

Three design questions remain open.

1. When must a binding generation become durable rather than process-local?
2. Which interrupted work classes may be reconstructed safely, and which require explicit reconciliation or human review?
3. How should the system report an operation whose remote host disappeared after a possible side effect but before a durable result?

Until those questions are answered, “reconnected” should stay exactly that: evidence that a new binding exists, not proof that the old work survived.

### References

- [OpenAI Codex commit `bde723ae`: generation-aware gRPC session recovery](https://github.com/openai/codex/commit/bde723ae7dedc87754228a2476a7a4cfbf05b4b8)
- [OpenAI Codex PR #38257](https://github.com/openai/codex/pull/38257)
- `research/reading/Q-20260813-02-generation-aware-grpc-session-recovery.md`
- `research/analysis/Q-20260813-02-session-rebinding-boundary.md`
