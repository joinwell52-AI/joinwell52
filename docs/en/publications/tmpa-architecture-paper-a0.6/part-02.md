The same source also records a transitional implementation: one `Pipeline` advanced roles sequentially through a shared `context: dict` and accumulated `trace: List[RoleMessage]` [25]. It therefore establishes the architectural origin, not present-day Core conformance. Immutable writer streams, source-preserving aggregation, deterministic reconstruction, explicit conflict states, and conformance requirements were developed later.

```text
XiaoDian AI business practice
          ↓ architecture abstraction
Original TMPA
          ↓ reusable file-coordination and review skeleton extracted
FCoP
          ↓ protocol, schema, package, MCP, governance, and audit evolution
CodeFlowMu adoption
          ↓ operational feedback
Current TMPA formalization
```

> **Practice revealed the problem; repeated engineering revealed the method; formalization elevated the method into theory.**

The present paper reunifies the original message-and-asynchrony model with the governance semantics matured through FCoP and CodeFlowMu, while avoiding retroactive claims about the early implementation.

## 1.4 Design Premises and Contributions

TMPA rests on four premises:

1. **Textual:** governance semantics have a canonical representation readable by people, AI systems, and validators.
2. **Multi-Agent:** execution, review, approval, and supervision remain attributable to separated authorities.
3. **Process:** governance covers the full lifecycle, including rejection, correction, recovery, and archival.
4. **Architecture:** the semantics remain stable across models, runtimes, languages, transports, and storage profiles.

These premises yield four operational commitments:

1. durable textual messages and state carriers;
2. one stable primary carrier per work item and one writer per published object;
3. local seriality with asynchronous multi-stream parallelism;
4. source-preserving aggregation followed by deterministic governance reconstruction.

> **Writers remain independent. Readers reconstruct the whole.**

TMPA does not claim isolated invention of append-only histories, lifecycle machines, provenance, signatures, or role-based authorization. Its contribution is their integration into a minimum-infrastructure process architecture with explicit task identity, responsibility order, lifecycle legality, review separation, conflict preservation, recovery, and machine-testable reader behavior.

The paper makes four contributions:

1. **Governed-work object model.** It separates a stable primary carrier from independently attributable reports, reviews, decisions, transitions, corrections, and recovery evidence.
2. **Multi-serial organizational architecture.** It combines locally ordered single-writer responsibility streams without forcing a global order, then reconstructs a partial-order work graph from their union.
3. **Deterministic governance contract.** It couples source-preserving aggregation with explicit authority, lifecycle, conflict, three-valued judgment, and canonical issue reconstruction.
4. **Evidence-bounded SME-first evaluation.** It separates architecture, FCoP protocol, reference implementation, downstream application, and case evidence; publishes C01–C14 results including failures; and identifies the empirical work still required for feasibility and adoption claims.

The paper does **not** contribute a new storage primitive, agent communication protocol, runtime orchestrator, identity provider, factual-verification method, or empirical proof of productivity. FCoP, CodeFlowMu, and XiaoDian are evidence sources and lineage artifacts; none defines TMPA or proves the theory.

The current TMPA–FCoP–CodeFlowMu relationship and the operational software stack are specified in Section 4.8; terminology is fixed in Section 1.5.

## 1.5 Terminology and Representation Stages

The paper fixes the following vocabulary so that semantic objects, physical storage, message behavior, and reconstructed views are not treated as interchangeable concepts.

| Canonical English term | Fixed Chinese equivalent | Fixed meaning | Not equivalent to |
|---|---|---|---|
| **governed work item** | **受治理工作项** | the task, request, decision, or process subject whose responsibility and lifecycle are being governed | one file, one session, or one runtime job |
| **primary carrier** | **主载体** | the stable governance object that anchors the identifier and minimum governing context of one work item | a mutable record that every participant edits |
| **governance object** | **治理对象** | one canonical semantic unit authored by one creator under one responsible role and one writer stream | its storage path, transport envelope, or derived view |
| **textual message** | **文本消息** | the communication function of a governance object when it transfers work, evidence, review, or decision semantics | a separate object class or an ephemeral queue message |
| **state carrier** | **状态载体** | the persistence function through which an object, transition record, or profile-defined location contributes declared or current state evidence | shared mutable application state |
| **source artifact** | **来源工件** | one physical representation or observation of evidence, such as a file, database row, object-store item, or received event | the semantic governance object after validation |
| **source candidate** | **来源候选** | one discovered source artifact presented to the aggregation stage, including malformed or conflicting observations | an accepted authoritative object |
| **canonical candidate set** | **规范候选集合** | the source-preserving, parsed, indexed, and deterministically normalized collection returned by aggregation | the final governance conclusion |
| **writer stream** | **写者流** | the locally ordered sequence of governance objects published by one attributable writer | a global event log or total timeline |
| **source aggregator** | **来源聚合器** | the stage that discovers, preserves, parses, indexes, and normalizes source candidates without deciding governance truth | the governance reader |
| **governance reader** | **治理 Reader** | the deterministic stage that applies a fixed profile to the canonical candidate set | the storage layer, orchestrator, or model runtime |
| **governance graph and issue set** | **治理图与问题集合** | the reconstructed partial-order process view and the canonical unresolved-condition output | the original source evidence or an imposed total order |

A single canonical governance object may be realized by different physical profiles. In FCoP, its source artifact is ordinarily a file plus path and event evidence; another profile may use a row, object, or event. Conversely, two source artifacts that declare the same object identifier but contain different canonical content are not two harmless copies: they are conflicting candidates that must be retained and evaluated under the profile. Throughout the architecture and normative chapters, **object** refers to the semantic unit, **artifact** to a physical or published engineering representation, and **view** to a reader-derived result.

---
# 2. Problem Definition and Design Requirements

TMPA begins from a distinction between **execution evidence** and **governance evidence**. A runtime trace may prove that a tool call occurred; it does not necessarily prove that the caller was authorized, that an accountable role accepted the work, that the output was independently reviewed, or that a later approval referred to the exact reviewed result. A chat transcript may preserve discussion but still lack stable object identity, lifecycle legality, conflict handling, and deterministic reconstruction. A workflow engine may record node completion while keeping its authoritative state inside an implementation-specific database.

The architecture therefore distinguishes four states:

| State category | Primary question |
|---|---|
| execution state | What is the runtime doing? |
| interaction state | What did participants exchange? |
| business state | What does the application currently consider true? |
| governance state | Which responsibilities, transitions, decisions, conflicts, and evidence are authoritative? |

TMPA specifies the fourth category while permitting references to the other three.

Text is selected as the canonical interchange form because it can be interpreted by humans, language models, validators, version-control tools, backup systems, and replacement runtimes. “Textual” does not require Markdown files: a conforming deployment may use a database, object store, or event service, provided that the complete governance meaning has a canonical textual representation.

Responsibility separation is equally central. A nominally multi-agent system does not establish independent governance when one identity plans, executes, reviews, approves, and certifies the same work. TMPA therefore treats roles as scoped authorities rather than prompt labels. Lifecycle is also explicit: governed work moves through profile-defined states; legal transitions, transition authorities, rejected transitions, rework, and terminal history must remain observable.

The minimum-infrastructure problem is:

> How can a small organization obtain attributable, reviewable, recoverable, and machine-checkable multi-agent governance without assuming a dedicated coordination database, message broker, enterprise control plane, or specialist governance team?

The answer is not “files instead of databases” in isolation. It is a complete process structure in which canonical text carries messages and state, one stable primary carrier identifies each governed work item, each writer publishes through a local serial stream, independent streams progress asynchronously, and a reader reconstructs the process graph and issue set.

The target is minimum infrastructure, not zero discipline. Protected storage, declared identity assumptions, backups, permissions, validation, and recovery procedures remain necessary. OECD and IMDA evidence supports the broader observation that SMEs face persistent time, skill, maintenance, and adoption-capacity constraints; it does not establish demand for TMPA specifically [23], [24].

The problem yields eight traceable requirements:

| ID | Requirement |
|---|---|
| DR1 | durable canonical textual representation |
| DR2 | stable work identity and single-writer evidence |
| DR3 | locally ordered streams with asynchronous composition |
| DR4 | explicit authority, review separation, and lifecycle legality |
| DR5 | source-preserving aggregation and deterministic reconstruction |
| DR6 | preservation of conflict, invalid evidence, and partial state |
| DR7 | recovery from persistent governance evidence |
| DR8 | minimum mandatory infrastructure with explicit assurance boundaries |

DR1–DR7 define the governance semantics. DR8 constrains the deployment claim: TMPA minimizes required coordination infrastructure but does not inherit guarantees from identity, security, consensus, or control-plane systems that are not actually deployed.
# 3. Related Work and Positioning

TMPA occupies the process-responsibility layer between agent execution and enterprise governance. MCP and A2A address tool use and agent interoperability [1], [2]; identity systems establish principals and delegated authority [19]; gateways and policy engines govern runtime admission; observability and control-plane products inventory agents and collect telemetry. TMPA does not replace these layers. It consumes their identifiers, policy decisions, traces, and artifacts, then represents governed work, review, rejection, recovery, and responsibility in a reconstructable form.

## 3.1 Architectural Antecedents

Event sourcing and CQRS contribute append-oriented history and the separation of write representations from read models [4]. Git demonstrates immutable content-addressed objects and explicit history [5]. W3C PROV supplies entities, activities, agents, and derivation relations [3]. Lamport established happened-before ordering without assuming a single physical clock [32], while Chandy and Lamport showed how a consistent global state can be determined in a distributed system [33]. TMPA does not claim these foundations as novel. It applies partial-order reasoning and reconstructable global views to a narrower governance problem: one primary carrier per work item, single-writer responsibility streams, explicit lifecycle authority, separation of duties, conflict preservation, and a deterministic governance reader.

The architecture is not equivalent to chat, a shared folder, an ADR collection, a workflow engine, or a single global event log. These mechanisms may store relevant evidence, but they do not by themselves define which object is authoritative, whether an action was in scope, whether a review was independent, or how contradictory evidence remains visible.

## 3.2 Interoperability and Governance Gaps
