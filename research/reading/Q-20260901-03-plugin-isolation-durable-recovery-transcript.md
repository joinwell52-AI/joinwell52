# Q-20260901-03 — Plugin Isolation Needs a Durable Recovery Transcript Outside the Failed Process

- Runtime date: 2026-09-01 (Asia/Shanghai)
- Queue signal: SIG-20260901-010
- Primary source: https://arxiv.org/abs/2608.28553
- Evidence level: `peer_reviewed_or_primary_research`
- Scope: agent harness fault isolation, peer-process plugins, append-only transcripts, durable-before-visible settlement, idempotent call identity, crash recovery, external-effect limits

## Research Question

If an Agent Runtime isolates plugins and tools into peer processes so one component can fail independently, what execution state and effect identity must live outside those processes so a killed component can be resumed without repeating already-settled work?

## Problem

Process isolation narrows a crash boundary but does not by itself preserve task truth. If the only authoritative conversation, tool result or step state lives inside the process that dies, restarting the process can lose history, regenerate already-settled calls or force unrelated work to restart.

The selected research asks what has to be externalized before process isolation becomes a usable recovery mechanism rather than only a containment mechanism.

## Architecture

Logos separates the harness into peer processes connected by a cross-process bus. The router owns routing rather than application session truth. Agent/provider/tool peers can be mounted and removed independently.

The durable session source of truth is an append-only JSONL transcript. The transcript is intentionally described as owned by no process. Each session step is appended as it occurs, including round/input records, tool-use records, tool results and streamed model text. A model-facing message history is rebuilt as a projection of this raw transcript rather than being treated as the primary durable state.

This separation is important for recovery: a restarted agent process can reconstruct its represented session from the transcript without requiring the failed process's in-memory message list to survive.

## Transcript Invariants

The paper describes replay/rebuild invariants that make the append-only log more than an unstructured debug file:

- records must remain well-formed and ordered;
- record/call identifiers progress monotonically under the represented protocol;
- each tool use must pair with exactly one result in the reconstructed transcript;
- rebuilding the model projection must reproduce the message state presented to the model.

The raw transcript can retain long tool results even when the model projection is trimmed or transformed. That means the durable audit/recovery record is deliberately richer than the ephemeral context window presented to a model.

## Durable-Before-Visible Settlement

The paper's settlement ordering is the core recovery mechanism: a completed effect/result is appended to the durable transcript before the harness announces that result as visible downstream.

This creates a recovery anchor. If a process dies after the append but before the next consumer sees the announcement, the durable transcript can establish that the operation already settled. Recovery can rebuild state from that record rather than assuming the missing in-memory acknowledgement means the action never happened.

The pattern is narrower than a distributed transaction, but it reflects a general safety property: an externally visible completion should not outrun the durable evidence used to decide whether recovery may repeat the action.

## Call Identity and Delivery Semantics

Bus control messages are described as **at least once**, not exactly once. Duplicate delivery is handled through global call identifiers and idempotent pairing rather than through a claim that the transport itself never duplicates.

This distinction matters. The tested “no repeated effect” behavior is achieved by effect identity plus transcript settlement and replay logic under the represented fault model. It is not proof of exactly-once network delivery.

A disconnected node can re-register and replay. Duplicate registration is explicitly denied rather than silently accepted as a second owner of the same registered identity. This converts a possible split-brain ownership ambiguity into a visible conflict at the bus boundary.

## Fault-Isolation Results

The paper reports several controlled fault experiments.

A bus-hop microbenchmark reports a median of roughly 0.215 ms over 10,000 calls versus about 0.005 ms for the local comparison path. The authors contextualize that overhead against much larger model latency in their setup: about 177 ms to first token and about 1896.8 ms for full inference.

A concurrency experiment with 50, 100 and 200 callers covers 3,500 calls with no reported loss, duplicate pairing or misattribution under the tested conditions.

Router-kill experiments run 20 trials. The paper reports that peer nodes and sessions remain alive and reconnect, with median reconnect around 858 ms under the polling configuration.

Tool-kill experiments report explicit errors rather than silent success, with very small error-return latency in the test and remount on the order of 100 ms.

For end-to-end recovery, the paper reports 12/12 sessions resumed through the tested failure sequence and 80/80 crash-point trials across four selected kill boundaries without repeating the represented settled effect. Plugin removal and modification tests also complete in the reported evaluation, and the conformance set reports 3,500 paired calls with zero invariant violations.

These are Research Results for the testbed, not a guarantee for arbitrary distributed deployment.

## Recovery Versus Recalculation

The fault experiments distinguish “do not repeat a settled effect” from “do no repeated computation.”

In the paper's multi-harness fault example, six interim results are available, faults are caught and repaired, and six results are recomputed. The faulting session takes roughly 135 seconds while an unaffected session takes roughly 5 seconds in the described comparison.

Therefore recovery can still include expensive recomputation, model calls or error handling. The safety claim is about preserving settled effect identity within the tested boundary, not eliminating all repeated computation.

## Parallel Failure Domains

The peer-process structure allows unrelated sessions or plugins to avoid being frozen by another component's recovery.

In the paper's comparison with a single-process reference architecture, restoration of a failed dependency is serial and freezes unrelated work that shares the process. In Logos, separate peers and transcript shards allow sessions to reconstruct independently without coordinating a global in-process restart.

A separate contention test has two harnesses simultaneously claim a tool and demonstrates serialized ownership behavior in the tested case. The result supports explicit resource ownership under contention, although it does not establish a general distributed lock protocol.

## External-Effect Boundary

The paper explicitly excludes arbitrary outward side effects from the strongest recovery guarantee. A real payment or other external action that escapes the represented transcript/tool boundary is not automatically undone or reconstructed by restarting a plugin.

For such effects the paper points toward withholding an external commit until safe settlement or using compensation. That means the transcript can prove what the harness recorded, but it is not automatically an atomic commit log for every third-party system.

This is the most important limit on interpreting “no repeated effects.” It is valid only for effects whose identity and settlement are inside the tested protocol boundary or are otherwise made idempotent. An irreversible external action without a shared idempotency/commit contract remains outside the demonstrated guarantee.

## Deployment and Trust Boundary

The reported deployment is principally one-machine/trusted-network oriented, including loopback/private-grid configurations. The bus admission model assumes reviewed code is mounted into the environment. The transcript is plaintext in the described design.

The router remains a process and therefore a failure point, although reducing it to routing-only state narrows what is lost when it dies. The paper treats multi-machine partition semantics and broader provider sets as future work.

The single-source transcript form is an architectural choice, not proof that one physical file or one storage node is sufficient for high-availability production use.

## Comparisons

The paper includes a native single-process reference path subjected to comparable faults. That comparison supports the failure-domain argument: in-process dependency restoration can stall unrelated sessions, whereas peer processes can be restarted while other peers remain alive.

The work also places itself near workflow engines and agent protocols, but this Reading does not treat those literature comparisons as independent reproductions. The strongest direct comparison evidence is the same-study single-process fault path.

The architecture resembles event sourcing in that an append-only durable record is projected into current state, and it resembles idempotent RPC designs in its use of stable call identifiers. The paper does not claim a full database transaction log, consensus protocol or universal event-sourcing framework.

## Evidence Identity

The source is primary research. Architecture descriptions, protocol invariants, reported fault experiments and measured timings are treated as Research Results or directly stated source facts.

The broader statement that governed Agent runtimes should externalize recovery truth outside the worker failure domain is a Research Center inference from those mechanisms and results.

The finding should not be upgraded to “Logos proves exactly-once agents.” The bus explicitly uses at-least-once control delivery, while idempotent call identity and durable settlement provide the tested duplication defense.

## Contradictions and Negative Evidence

Isolation does not eliminate shared infrastructure. A router still exists, and cross-machine partitions are not solved by the demonstrated one-machine reconnect behavior.

“No repeated effect” does not mean no repeated work. Fault recovery can recompute intermediate results and can be dramatically slower than the unaffected path.

An append-only transcript does not itself make third-party side effects atomic. Outward irreversible effects remain outside the strongest guarantee unless separately withheld, keyed or compensated.

At-least-once control delivery means duplicate messages remain part of the protocol model. Safety depends on identity and idempotent settlement rather than transport uniqueness.

A plaintext transcript that is sufficiently rich to reconstruct a session also becomes a security and confidentiality asset. Recovery durability increases the amount of durable sensitive state that needs access control and retention policy.

## Limitations

The reported fault and concurrency experiments are bounded to the evaluated harness, machines, process model and selected kill points.

The paper does not establish Byzantine fault tolerance, distributed consensus, partition tolerance across multiple machines or exactly-once delivery.

The transcript is a single logical source of truth in the design; replication, compaction, corruption recovery and long-term storage growth are not the main evaluated problem.

External side effects without a protocol-level effect identity remain outside the recovery guarantee.

Trust assumes controlled mounting/review of peer code and does not constitute a hostile multi-tenant isolation proof.

Provider-side nondeterminism and recomputation cost can still alter timing and resource consumption even when the represented settled effects are not duplicated.

## Bounded Implication for Analysis

The evidence supports separating **worker state** from **recovery truth**. If a component is expected to be disposable, the facts needed to determine what already happened must not live only inside that component.

A governed Runtime using this pattern would need durable identities for session/run, process/plugin instance, call/effect, transcript position, result settlement and ownership generation. The safe recovery decision would ask whether an effect with that identity is already durably settled before allowing replay or re-execution.

For external actions, the Runtime would still need an additional commit discipline such as a provider idempotency key, transactional outbox, withheld commit, receipt check or explicit compensation. The transcript is necessary recovery evidence but is not sufficient atomicity for arbitrary outside systems.

This Reading therefore supports **bounded idempotent recovery across isolated process failures**, not universal exactly-once Agent execution.

## Unresolved Questions

- How should transcript records bind to third-party idempotency keys or external receipts for irreversible actions?
- What happens if a process dies between the external effect and the durable transcript append?
- Should durable-before-visible settlement be extended with an outbox/inbox protocol for networked tools?
- How should transcript compaction preserve the evidence required for later duplicate detection and audit?
- What replication or consensus mechanism is required when the transcript itself must survive machine loss?
- How should process/plugin ownership generations prevent an old peer from reconnecting after a new owner has already been admitted?
- How should sensitive tool outputs be encrypted or redacted without destroying deterministic recovery evidence?
- Which computations are safe to redo and which effects must be strictly deduplicated?
- How should reconnect logic distinguish transient disconnect, partition and permanent ownership transfer?

## Reading Conclusion

Logos shows that process-level plugin isolation becomes materially more useful when session truth is externalized into an append-only transcript outside the process failure domain. The tested recovery path combines that transcript with durable-before-visible settlement, global call identity, idempotent pairing and explicit duplicate-registration handling. Under the evaluated one-machine fault boundaries, sessions can resume through process kills without repeating the represented settled effect, while unrelated peers remain live. The evidence does not establish universal exactly-once execution: control delivery is at least once, recovery may recompute work, arbitrary outward effects are outside the strongest guarantee, and multi-machine partition semantics remain open.
