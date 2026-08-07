The formation of the Agentic AI Foundation reflects the growth of interoperability infrastructure around MCP and related projects [6]. Interoperability, however, is not the same as governance. Kang and Diponegoro analyze MCP, A2A, ACP, ANP, and ERC-8004 against membership, deliberation, voting, dissent preservation, human escalation, and audit/replay requirements, finding that no surveyed protocol expresses a complete governance model [27]. TMPA addresses a narrower subset—work responsibility, lifecycle, review, conflict, and recovery—rather than full community governance.

Open Challenges in Multi-Agent Security emphasizes that collusion, cascading effects, stealth, and oversight failure can emerge at the interaction level even when individual components appear secure [26]. TMPA can preserve attributable evidence and unresolved disagreement for investigation, but it is not a collusion detector.

## 3.3 Direct Research Neighbors

**Auditable Agents** separates accountability, auditability, and auditing, and evaluates action recoverability, lifecycle coverage, policy checkability, responsibility attribution, and evidence integrity [17]. TMPA is complementary: it specifies the durable work objects and process reconstruction on which those dimensions can be evaluated.

The IETF agent-audit architecture similarly treats delegation and interactions as auditable events [18]. TMPA can supply a project-local or platform-neutral representation of such events but does not standardize network transport.

**Authorization Propagation in Multi-Agent AI Systems** identifies transitive delegation, aggregation inference, and temporal validity as unresolved authorization problems [20]. TMPA records assignments and responsibility transitions but does not define a complete recursive delegation calculus.

**Policies on Paths** argues that runtime governance may depend on the partial execution path rather than static access rules [21]. TMPA preserves process paths as evidence; it does not itself block actions during execution.

**Proof-Carrying Agent Actions** binds high-value actions to decision-time certificates, approvals, and replay-ready proof [29]. PCAA centers the action decision; TMPA centers the longer governed work item and its reports, reviews, conflicts, corrections, and recovery. A TMPA profile may reference PCAA certificates as execution evidence.

**AGENTSAFE** combines risk classification, semantic telemetry, dynamic authorization, interruptibility, anomaly detection, cryptographic tracing, and organizational controls [30]. TMPA chooses a different minimum baseline: readable canonical text and deterministic reconstruction are mandatory, while cryptographic identity and stronger integrity controls are optional named profiles.

**Why Do Multi-Agent LLM Systems Fail?** derives failure categories from a large trace corpus [22]. TMPA improves observability of responsibility, review, conflict, and recovery, but this paper does not claim reduced failure rates.

**From Trajectories to Evidence** argues that completed research-agent trajectories require qualification before they become auditable experimental records [36]. TMPA reaches the same boundary from process governance: an execution claim becomes admissible only through attributable objects, required evidence, independent review, lifecycle-valid decisions, and retained exceptions. TMPA does not provide domain truth verification; it governs how claims and their verification evidence are admitted and reconstructed.

The incremental contribution is therefore not a new storage primitive or a complete control plane. It is the combination of a durable textual message/state plane, one-task-one-primary-carrier, local single-writer streams, asynchronous composition, source-preserving aggregation, and deterministic read-side governance reconstruction under a minimum-infrastructure profile.

## 3.4 Comparative Synthesis and Research Gap

The related work falls into five neighboring lines. Their boundaries clarify the gap addressed by TMPA:

**Table 5. Comparative positioning against neighboring research lines.**

| Research line | Principal contribution | TMPA relation and boundary |
|---|---|---|
| MCP and A2A [1], [2] | interoperable context, capability, task, and message exchange for tool or agent interaction | TMPA may reference these interactions but defines longer-lived responsibility, review, conflict, and recovery evidence |
| W3C PROV, event sourcing, and CQRS [3], [4] | derivation, append-oriented event history, and read-model construction | TMPA specializes these mechanisms into governed work identity, authority, lifecycle legality, and deterministic issue reconstruction |
| Auditable Agents and the IETF audit architecture [17], [18] | accountability dimensions, distributed audit records, context, and later investigation | TMPA provides a substrate-neutral governed-work graph but does not define network audit-context propagation or attestation |
| authorization propagation, path policies, and proof-carrying actions [20], [21], [29] | decision-time authorization and runtime enforcement for delegated paths or certified actions | TMPA preserves the authorized work process and its outcomes; it does not replace execution-time mediation |
| NIST AI RMF and AGENTSAFE [30], [31] | organizational risk identification, controls, monitoring, assurance, and accountability | TMPA is a narrower evidence architecture that can support such programs but does not constitute a complete risk-management framework |
| distributed ordering and snapshots [32], [33] | causality without a global clock and consistent global-state observation | TMPA specializes partial-order reconstruction for governance evidence; it does not provide consensus or distributed snapshot transport |
| multi-agent failure and evidence qualification [22], [36] | failure taxonomies and conversion of execution trajectories into auditable records | TMPA specifies admission, review, lifecycle, and reconstruction semantics but does not verify domain truth |

No reviewed neighbor combines all of the following as one minimal-infrastructure process contract: a stable primary carrier, single-writer responsibility streams, asynchronous composition without a forced total order, explicit authority and lifecycle semantics, preservation of invalid and conflicting evidence, and deterministic reconstruction of both a governance graph and an issue set. This is the specific research gap claimed by A0.7. The claim is architectural and comparative; it is not a priority claim over every possible unpublished or proprietary system.

# 4. TMPA Architecture

TMPA defines governance semantics, not a runtime component. Its architecture specifies which governance facts must be represented, how responsibility and lifecycle are expressed, and how independent evidence is reconstructed into an authoritative view. Storage, transport, scheduling, and model behavior remain implementation concerns unless a TMPA profile explicitly binds them.

## 4.1 Governance Object

A **governance object** is the smallest independently attributable semantic unit in TMPA. It may represent a task, report, review, approval, issue, lifecycle transition, role assignment, recovery action, or another document type published by a protocol profile. The object is distinct from its physical **source artifact**: FCoP may encode it as a file and path observation, while another profile may use a database row, object-store item, or event.

The terms **textual message** and **state carrier** describe functions of an object rather than additional object classes. An object acts as a textual message when it transfers governed work or evidence, and it acts as a state carrier when its content, transition evidence, or profile-defined location contributes to lifecycle reconstruction.

Every governance object contains or identifies:

- a stable object identifier;
- a document type;
- one creator identity;
- one responsible role;
- a stream identifier and sequence number;
- a creation time;
- a lifecycle profile and declared state;
- typed references to related objects;
- canonical textual content;
- integrity evidence.

A published governance object is immutable. Correction does not erase or rewrite the original object; it creates a new object that supersedes, rejects, qualifies, or resolves the earlier one. Multiple byte-identical source observations may refer to the same object without changing its meaning; the same identifier paired with different canonical content is a conflict, not an update.

The lifecycle state declared by an object is the state associated with that object under its profile at publication. The current authoritative state of governed work is reconstructed from the valid object set, accepted transitions, and profile rules. It is not obtained by mutating an earlier published object or by selecting the most recent timestamp.

## 4.2 Document Types

TMPA Core does not impose a universal business-document taxonomy. Each implementation profile instead publishes a finite document-type registry.

Each registry entry defines:

- the type name and version;
- the governance responsibility represented by the type;
- permitted creator roles;
- required fields;
- permitted reference relations;
- the applicable lifecycle profile;
- validation rules.

Document types must not overlap ambiguously in authority. An execution report, for example, does not implicitly serve as its own independent review or approval. When a deployment permits an exception to separation of duties, the exception and its approving authority must be represented explicitly.

## 4.3 Role and Authority Model

A TMPA role is a governance authority with a defined scope. It is not merely a prompt label or natural-language persona.

Each role definition identifies:

- a stable role identifier;
- permitted object types;
- permitted lifecycle actions;
- separation-of-duty constraints;
- the authority that assigns the role;
- the assignment's validity period and revocation state.

An object’s `role` field declares the authority under which the creator acted; it does not create that authority. A reader validates the claim against an active role assignment and the applicable policy profile.

A participant may occupy more than one role only when the implementation profile explicitly permits the combination. A deployment claiming independent review must prohibit the same identity from acting as both executor and reviewer for the same governed result unless a recorded and authorized exception applies.

In an enterprise identity profile, the logical role is bound separately to a verifiable agent or workload identity, the human or organizational principal that remains accountable, the credential used for the action, the delegation source and scope, and the validity or revocation state. TMPA Core records and validates the governance claim; it does not issue credentials or enforce recursive permission attenuation.

## 4.4 Lifecycle Model

A lifecycle profile consists of:

- a finite state set `S`;
- an initial state `s0`;
- a terminal-state set `F`;
- an action set `A`;
- a transition relation `T ⊆ S × A × S`;
- an authorization function `Auth(role, action, object)`;
- a validation function `Valid(object, transition)`.

A transition is accepted only when:

1. its source state matches the current authoritative state;
2. the transition is defined by `T`;
3. the initiating role is authorized;
4. required references and preconditions are satisfied;
5. the transition evidence passes schema and integrity validation.

An illegal or unauthorized transition does not alter the authoritative lifecycle state. The attempt remains observable through a rejection, issue, alert, or equivalent profile-defined record rather than being silently discarded or repaired.

## 4.5 Textual Messages, Single-Writer Streams, and Asynchronous Parallelism

TMPA's write plane combines a stable work carrier, single-writer objects, local seriality, and asynchronous composition.

For every governed task or work item `t`, a task-oriented profile defines one stable primary carrier `c_t`. The carrier establishes the identifier and minimum governing context of the work. Acceptance, execution reports, reviews, decisions, corrections, and recovery records are separate objects that reference `c_t`; they do not become additional mutable copies of the task. “One task, one carrier” therefore means one stable primary reference point, not one document that every participant edits.

Let `A` be the set of responsible writers. Every published object has exactly one writer, and each writer `a ∈ A` publishes an independently attributable serial stream:

`S_a = ⟨o_{a,1}, o_{a,2}, ..., o_{a,n}⟩`

The sequence inside `S_a` is authoritative local order. Every object has a positive sequence number, and `(stream_id, sequence)` identifies its position within that writer's responsibility history. Creation time is informative but not authoritative for stream order.

At observation time `τ`, the available candidate collection may contain different prefixes of different streams:

`O_τ = ⋃_{a ∈ A} prefix(S_a, k_a(τ))`

The functions `k_a(τ)` need not advance together. One participant may publish a task while another is offline; a report may appear before an independent review; several writers may progress concurrently. This is how multiple serial streams form asynchronous parallelism. TMPA does not require all participants to share a clock, remain online together, or commit to one global event log.

Within-stream predecessor relations provide local order. Explicit references and profile-defined lifecycle dependencies provide cross-stream causal edges. If two objects have neither a within-stream relation nor a profile-defined cross-stream dependency, they remain concurrent and incomparable.

Single-writer objects and separate responsibility streams remove the primary **semantic** shared-write conflict: several agents do not compete to edit one authoritative record. They do not eliminate every storage-level contention, filesystem race, or infrastructure failure; profiles must still define atomic publication, duplicate handling, and recovery behavior.

The write model can be summarized as:

> **One task has one primary carrier. One writer owns each published object. Each writer remains serial. Multiple streams progress asynchronously to form parallel collaboration.**

## 4.6 Read-Side Aggregation and Governance Reconstruction

TMPA's read plane has two conceptually separate stages: **source aggregation** and **governance reconstruction**.

Let `O_τ` be the finite collection of source candidates visible at observation time `τ`. A source-preserving aggregator `A` discovers source artifacts, retains source identity and bytes, parses candidate envelopes, indexes identifiers and references, and applies deterministic normalization needed by the reader:

`C_τ = A(O_τ)`
