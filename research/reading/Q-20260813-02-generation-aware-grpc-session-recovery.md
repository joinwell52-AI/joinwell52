# Q-20260813-02 — Generation-aware recovery rebinds cached gRPC code-mode sessions

- Runtime date: 2026-08-13
- Column: Industry Architecture
- Source object: Q-20260813-02 / SIG-20260813-G-003
- Primary source: https://github.com/openai/codex/commit/bde723ae7dedc87754228a2476a7a4cfbf05b4b8
- Supporting primary record: https://github.com/openai/codex/pull/38257
- Evidence class: Fact for changed code and tests; inference only where labeled
- Stage: Skill 03 Deep Reading only

## Problem

A cached code-mode session may remain in the client after its remote gRPC host has stopped. Reusing the old binding leaves callers attached to stopped state; opening a new host session without changing identity can also make old and new host-local cell IDs ambiguous.

## Facts

1. The change makes the provider return a `ReconnectableSession` containing a replaceable underlying `GrpcCodeModeSession` binding.
2. `ReconnectInner` retains the provider, delegate and execution limits, an optional binding, a one-permit semaphore, a generation counter and coordinated shutdown state.
3. `execute`, `wait` and `terminate` all call `get_or_open_binding()` first.
4. A binding is live only while its underlying session has not entered its stopped state.
5. If no live binding exists, the one-permit semaphore serializes reopening. After obtaining the permit, the caller rechecks whether another caller already published a live binding.
6. The old binding is closed before a replacement is opened.
7. Each binding receives an increasing in-process generation number starting at 1.
8. Generation 1 preserves original cell IDs. Later generations expose public IDs such as `g2:1`.
9. `GenerationDelegate` rewrites nested tool-call, notification and cell-closed callback IDs into the same generation-aware public form.
10. `wait` and `terminate` translate a public cell ID back to the current host-local ID only when its generation matches the current binding.
11. A stale generation is rejected with `cell belongs to a stale code-mode host generation` instead of being sent to the replacement host.
12. Shutdown participates in waiting for the opening permit and in opening a replacement, and a newly opened binding is not published after shutdown has begun.
13. The integration test interrupts the original host session, verifies the pending old wait ends and the old cell closes, then starts a replacement host at the same endpoint.
14. Two concurrent executions after replacement complete with `g2:1` and `g2:2`, showing reconnection is serialized without globally serializing later cell execution.
15. The test verifies generation-aware nested tool callbacks and notifications, normal wait/terminate for a generation-2 cell, and rejection of wait/terminate for the old generation-1 cell.
16. The same commit also accepts `unix://` and `unix:` endpoint forms on Unix, which is a separate transport compatibility change.

## Mechanisms

### Reconnect-on-use

The public session survives host replacement while its remote binding can be reopened. Recovery happens when a later session operation observes that the old binding is no longer live.

### Single-flight reopening

A one-permit semaphore prevents simultaneous callers from opening multiple replacement sessions. Rechecking after permit acquisition lets later callers reuse the binding opened by the first caller.

### Generation-scoped identity

A replacement host may restart its local cell numbering. Public generation prefixes prevent the new host's cell `1` from being confused with the old host's cell `1`.

### Generation-aware callbacks

The delegate wrapper applies the same generation mapping to tool callbacks, notifications and closure events, keeping callback ownership aligned with the public cell identity.

### Recovery/shutdown coordination

The replacement-binding path checks shutdown before waiting, after acquiring the permit and before publishing the new binding. Recovery therefore does not publish a fresh session after shutdown has taken ownership.

## Evidence

- `reconnect.rs` implements replaceable bindings, single-flight reopening, generation assignment and shutdown coordination.
- `generation.rs` implements public/remote ID translation and response/callback rewriting.
- `grpc_session/mod.rs` constructs `ReconnectableSession` and opens raw gRPC bindings underneath it.
- The host-restart integration test covers interrupted old work, concurrent post-restart execution, generation-aware callbacks and stale-cell rejection.

## Limitations

1. Recovery opens a new remote session; it does not migrate the previous host's in-memory cell execution.
2. A wait already active against the old host ends with an error rather than transparently continuing on the replacement.
3. Generation state is in client-process memory; this source does not establish durable generation identity across a client-process restart.
4. Stale-cell rejection prevents misrouting but does not recover results lost with the old host.
5. The covered tests do not establish fairness or bounded retry behavior under repeated host instability.
6. The evidence is specific to Codex gRPC code-mode sessions, not every remote-session transport.

## Comparisons

- A permanent binding becomes unusable after host loss.
- Reopening without generation identity risks old/new cell aliasing.
- Independent concurrent reopening risks duplicate remote sessions.
- The selected design combines a stable public session, single-flight rebinding and generation-scoped cell identity.

## Unresolved questions

1. Should generation identity become durable if client-process restart recovery is required later?
2. What retry or backoff policy applies when a replacement host remains unavailable?
3. Can any old-cell work be reconstructed, or is interruption the intended boundary after host loss?
4. How should telemetry distinguish first opening from recovery opening?

## Reading boundary

This note establishes only the source-backed gRPC code-mode mechanism: a cached session can reopen a stopped binding, concurrent reopen attempts are single-flight, and generation-scoped IDs prevent stale cells from controlling replacement-host cells. Broader architectural conclusions belong to Skill 04 Analysis.
