# Q-20260825-02 — Resumed Sessions Must Reconcile Uncertain Durable Writes Before New Model Calls

- Runtime date: 2026-08-25 (Asia/Shanghai)
- Queue signal: SIG-20260825-012
- Primary source: https://github.com/openai/openai-agents-python/commit/40f0d9fccbe03bf704e4ef044c7c81b807e594da
- Evidence level: `merged_maintainer_change`
- Scope: OpenAI Agents SDK resumable Session writes, pending-write persistence, history fingerprints, replay avoidance and fail-closed ambiguity handling

## Problem

A durable Session append can fail after the backend has already committed the write but before the caller receives a successful acknowledgement. If a resumed run simply retries the append, it can duplicate already-persisted history; if it assumes the failed call committed, it can silently lose history when the backend actually did not persist it. New model execution must therefore resolve the uncertain write before consuming the Session again.

## Facts

The selected Agents SDK change persists a `_pending_session_write` in `RunState`, including the target session identity, a deep-copied item batch, a `before` history fingerprint when known, and the persisted-item count. The state is included in run-state copying and serialization.

Both resumed non-streaming and streaming execution reconcile this pending write before the next model call. This ordering makes unresolved durable history a precondition to model execution rather than a background repair.

Reconciliation reads authoritative Session history and compares stable SHA-256 item fingerprints. The expected committed state is the recorded `before` tail followed by the pending item fingerprints. If the observed history exactly matches that expected state, the SDK treats the write as already committed and does not append it again.

If the observed history is still unchanged from the recorded `before` state, the pending items can be appended. If the observed tail is neither clearly committed nor clearly unchanged, the state is ambiguous and the code raises a `UserError` instead of guessing or replaying a completed tool action.

The first unresolved attempt can capture a `before` fingerprint from the current authoritative tail before appending. A local `_session_write_in_progress` guard prevents overlapping reconciliation inside the same run-state instance.

## Vendor Claims

The maintainer change states that failed resumed Session writes are recovered before later model calls. The persistent pending-write state, authoritative-history comparison, append/no-append branches and fail-closed ambiguity path directly support that claim.

## Mechanisms

1. **Durable pending intent:** the resumable RunState records the exact outstanding Session append instead of losing the uncertainty at process interruption.
2. **Authoritative reread:** recovery asks the Session backend what is actually present rather than trusting the prior exception outcome.
3. **Stable history fingerprints:** item digests provide an exact comparison between the pre-write tail, pending batch and observed tail.
4. **Three-way decision:** already committed means no replay; unchanged means append; changed/ambiguous means fail closed.
5. **Pre-model reconciliation:** pending persistence is resolved before resumed model execution, preventing the model from running against an unresolved history boundary.
6. **Replay protection at tool boundary:** the ambiguity branch explicitly avoids silently rerunning work whose side effects may already have occurred.
7. **Local concurrency guard:** one restored state instance avoids concurrent pending-write reconciliation within that process.

## Evidence

Primary evidence is merged maintainer commit `40f0d9fccbe03bf704e4ef044c7c81b807e594da` in `openai/openai-agents-python`.

The patch extends RunState serialization/copy behavior with pending Session-write metadata and adds `resume_pending_session_write(...)` before resumed execution. Its comparison logic computes stable digests for the authoritative Session tail and distinguishes committed, unchanged and ambiguous observations.

The implementation documentation also states an important negative fact: the Session interface has no distributed compare-and-swap or backend identity contract. Independently restored copies therefore require caller-side serialization rather than relying on this helper as a distributed lock.

## Limitations

This is not distributed exactly-once Session persistence. The algorithm reconciles one resumable append against one authoritative Session history but does not provide a cross-process CAS primitive.

The local `_session_write_in_progress` guard only coordinates the current state instance. Independently restored copies can race unless the application serializes them.

The ambiguous branch does not attempt fuzzy matching, history surgery or automatic conflict merging. It deliberately fails closed and requires the application to repair the original Session.

Fingerprint equality proves equality of the serialized comparison representation used by the SDK; it does not prove transactional atomicity of arbitrary external tool side effects associated with the items.

## Comparisons

A blind retry treats transport failure as proof of non-commit and risks duplication. A blind skip treats the same failure as proof of commit and risks data loss. This patch instead models the failure as an uncertain durable state and resolves it by rereading authoritative history.

The pattern resembles write-ahead recovery more than generic retry: persist intent, inspect durable state after interruption, classify the outcome, then either complete, accept, or stop on ambiguity before continuing higher-level execution.

## Unresolved Questions

- Should future Session backends expose a revision/CAS token so reconciliation can become atomic across independently restored workers?
- How are very large histories fingerprinted efficiently without repeatedly rereading long tails?
- Can an application safely distinguish concurrent legitimate history extension from corruption and provide a governed merge path?
- Should pending-write identity include backend/session implementation identity in addition to the logical session ID?

## Reading Conclusion

The selected Agents SDK change makes unresolved Session persistence an explicit resumable state and requires it to be reconciled before new model execution. Exact history fingerprints distinguish an already-committed append from an unchanged history, while any other observation fails closed instead of replaying uncertain work. The defensible conclusion is bounded recovery for a resumable Session append, not distributed exactly-once persistence or transactional rollback of external side effects.
