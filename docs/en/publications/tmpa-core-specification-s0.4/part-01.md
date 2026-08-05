---
title: TMPA Core Specification — Implementation Draft S0.4
outline: deep
---

<ArticleCover
  image="/assets/covers/tmpa-spec.svg"
  kicker="Normative Specification"
  title="TMPA Core Specification"
  summary="Normative object, lifecycle, authority, three-valued judgment and deterministic reconstruction requirements."
  version="S0.4"
  status="Implementation-ready working draft"
  languageHref="/zh/publications/tmpa-core-specification-s0.4"
  languageLabel="简体中文"
/>

# TMPA Core Specification

## Textual Multi-Agent Process Architecture — Core Objects, Reader Semantics, and Conformance

> **Specification Version:** Draft S0.4<br>
> **Historical Extraction Baseline:** TMPA Draft V1.0-R24; current specification maintained directly in this GitHub document<br>
> **Status:** Implementation-Ready Normative Draft<br>
> **Extraction Date:** 2026-07-31  
> **Editorial Revision Date:** 2026-08-03<br>
> **Authority:** This GitHub document is the sole normative source for TMPA Core S0.4. The Architecture Paper is theoretical and the Implementation Case Report is evidentiary; neither may redefine this specification.

---

# 1. Status, Scope, and Conformance Boundary

This document defines the vendor-neutral TMPA Core. It fixes the canonical governance object model, single-writer and lifecycle semantics, source aggregation, deterministic governance reconstruction, three-valued judgment algebra, reader output contract, trust assumptions, normative requirements, and C01–C14 conformance behavior.

TMPA Core governs process-responsibility evidence. It does not prescribe a model runtime, scheduler, storage engine, message transport, database, filesystem layout, identity provider, key-management system, or enterprise control plane. A profile may bind those mechanisms, but it MUST preserve the Core semantics and MUST identify every additional assumption or guarantee.

This draft separates three kinds of text:

- **normative requirements:** Sections 9 and 10, using the terms defined in Section 9.1;
- **architectural and algorithmic definitions required to interpret the normative clauses:** Sections 2–8;
- **informative extraction and traceability notes:** Section 11 and Appendix A.

The following are outside TMPA Core unless a named profile adds them: authenticated enterprise identity, credential issuance, recursive delegation, runtime admission control, protected or tamper-resistant storage, distributed consensus, semantic truth verification, Byzantine resilience, legal certification, and jurisdiction-specific compliance.

A conforming implementation MAY use files, database rows, object-store objects, or events as source artifacts. It MUST NOT claim conformance merely because it stores Markdown, produces logs, or implements a workflow state machine. Conformance is behavioral and depends on the observable object, lifecycle, reconstruction, conflict, recovery, and test requirements in Sections 9 and 10.

The publication contract is fixed across the three maintained documents: the [Architecture Paper A0.5](/en/publications/tmpa-architecture-paper-a0.5) explains the theory, this Core Specification defines normative behavior, and the [Implementation Case Report I0.5](/en/publications/implementation-case-i0.5) reports bounded engineering evidence. Their current conceptual layering and historical lineage are distinct:

```text
CURRENT CONCEPTUAL LAYERING
TMPA architecture → reusable FCoP protocol profile → CodeFlowMu and other applications

HISTORICAL LINEAGE
XiaoDian AI practice → original TMPA → FCoP extraction and maturation
                    → CodeFlowMu application → current TMPA formalization
```

FCoP realizes a defined file-based subset of TMPA; CodeFlowMu adopts FCoP as coordination and governance infrastructure. Neither FCoP nor CodeFlowMu defines or exhausts TMPA Core.

---

# 2. Terminology and Representation Stages

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

The three semantic judgments are also fixed across all documents: `valid` (**有效**) means the applicable evidence and rules establish acceptance; `invalid` (**无效**) means the rules establish rejection or violation; `undetermined` (**未确定**) means evidence is incomplete, conflicting, or awaiting an authorized resolution. View labels such as authoritative, quarantined, partial, disputed, and pending_human explain the presentation reason; they are not additional semantic values.

A single canonical governance object may be realized by different physical profiles. In FCoP, its source artifact is ordinarily a file plus path and event evidence; another profile may use a row, object, or event. Conversely, two source artifacts that declare the same object identifier but contain different canonical content are not two harmless copies: they are conflicting candidates that must be retained and evaluated under the profile. Throughout the architecture and normative chapters, **object** refers to the semantic unit, **artifact** to a physical or published engineering representation, and **view** to a reader-derived result.

---

# 3. Core Architecture Model

TMPA defines governance semantics, not a runtime component. Its architecture specifies which governance facts must be represented, how responsibility and lifecycle are expressed, and how independent evidence is reconstructed into an authoritative view. Storage, transport, scheduling, and model behavior remain implementation concerns unless a TMPA profile explicitly binds them.

## 3.1 Governance Object

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

## 3.2 Document-Type Registries

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

## 3.3 Role and Authority Model

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

## 3.4 Lifecycle Model

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

## 3.5 Textual Messages, Single-Writer Streams, and Asynchronous Parallelism

TMPA's write plane combines a stable work carrier, single-writer objects, local seriality, and asynchronous composition.

For every governed task or work item `t`, a task-oriented profile defines one stable primary carrier `c_t`. The carrier establishes the identifier and minimum governing context of the work. Acceptance, execution reports, reviews, decisions, corrections, and recovery records are separate objects that reference `c_t`; they do not become additional mutable copies of the task. “One task, one carrier” therefore means one stable primary reference point, not one document that every participant edits.
