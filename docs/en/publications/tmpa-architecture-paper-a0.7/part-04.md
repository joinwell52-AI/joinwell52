Aggregation does not decide which claim is true, silently repair a conflict, invent missing evidence, or convert arrival order into governance order. Its purpose is to construct the complete canonical candidate set `C_τ` available to the governance reader while retaining the provenance of every source candidate.

Let `P` be a fixed rule profile containing schemas, type rules, role assignments, lifecycle rules, relation semantics, canonicalization rules, conflict policy, and output-normalization rules. The governance reader then computes:

`R_P(C_τ) = (G_τ, I_τ)`

where `G_τ` is the canonical reconstructed partial-order process and governance graph and `I_τ` is the canonical issue set. `G_τ` represents workflow progress, responsibility, lifecycle, review, approval, rejection, recovery, and audit relations while preserving local stream order, explicit cross-stream dependencies, and concurrency among incomparable objects. It is not an authoritative total timeline.

For brevity, later sections may write `R_P(O)` for the composed pipeline `R_P(A(O))`. The primary determinism requirement is permutation invariance. For every permutation `π` of the same canonical candidate collection:

`R_P(A(π(O))) = R_P(A(O))`

The equality applies to canonical serialization of both `G` and `I`, not to incidental in-memory order or diagnostic formatting. Delayed arrival changes the currently available set and may legitimately change a view from partial to authoritative or disputed; different enumeration orders of the same set must not change the result.

**Determinism proposition.** Let `O` be a finite source multiset and `P` a fixed profile. Assume that: (1) source normalization is a pure function of source identity and covered bytes; (2) duplicate classification, validation, authority checks, lifecycle checks, and issue identifiers are functions of canonical object values and `P`; (3) graph edges are derived only from within-stream sequence and profile-declared relations; and (4) graph and issue serialization use published deterministic ordering and tie-break rules. Under these conditions, the composed operation `R_P(A(O))` is invariant to source enumeration order.

**Proof sketch.** Aggregation maps any enumeration of `O` to the same canonical indexed candidate multiset because indexing and duplicate classification depend on canonical source values rather than discovery position. Per-object validation is order-independent. Set-level checks—duplicate identifiers, stream gaps, missing references, prohibited cycles, authority conflicts, and lifecycle conflicts—are computed over the same canonical sets and relations. The accepted node set and directed edge set are therefore identical for every permutation. Canonical issue identifiers and deterministic ordering produce the same `I`; canonical graph serialization and a stable tie-break used only for representing incomparable nodes produce the same serialized `G`. Consequently, every permutation yields byte-equivalent canonical outputs. This argument establishes permutation invariance under the stated profile contract; it does not prove semantic truth, profile correctness, resistance to compromised trust roots, or equality across different evidence sets. A mechanized proof and executable corpus remain required for stronger assurance.

A reconstructed subject or subgraph is classified as:

- **authoritative** when required evidence is valid and no unresolved integrity, authority, lifecycle, ordering, or required-reference issue affects the conclusion;
- **partial** when required evidence is missing or a stream or dependency is incomplete;
- **disputed** when multiple valid but incompatible governance claims remain unresolved;
- **quarantined** when a profile-defined integrity, identity, duplicate-ID, or prohibited-cycle condition excludes the affected evidence from authoritative reconstruction.

Authentication is an orthogonal assurance label. An object or view may be structurally authoritative under TMPA Core while remaining unauthenticated under a stronger identity profile; it must not then be presented as authenticated integrity.

TMPA requires **conflict preservation**: valid contradictory objects remain represented until a new authorized resolution object exists. It also requires **evidence preservation under extension**: adding candidate evidence does not erase prior source evidence. TMPA does not assume monotonicity of governance status under arbitrary set extension, because newly added valid evidence may legitimately change a previously authoritative view into a partial, disputed, or quarantined one.

Read-side reconstruction is therefore not the whole architecture; it is the stage that converts durable textual messages and asynchronous serial streams into a coherent process and governance result. A deterministic topological serialization may be generated for interchange or display, but that serialization does not add governance order between incomparable nodes. C11 operationalizes source-aggregation and reconstruction determinism; C03, C04, C09, C10, and C12 exercise identity, ordering, dependency, cycle, and conflict-preservation behavior. A mechanized proof of the full reconstruction properties remains future work.

## 4.7 Integrity and Signature Evidence

TMPA separates three properties that are often conflated:

1. **Attribution:** an object declares a creator and responsible role.
2. **Integrity:** modification of a published object can be detected.
3. **Authenticated integrity:** the object is cryptographically bound to a verified identity or key.

TMPA Core requires attribution and integrity evidence. A deployment may claim authenticated integrity only when it applies a trusted identity, signature, and key-management profile.

An integrity record identifies:

- the canonicalization profile;
- the hash algorithm;
- the content digest;
- predecessor or referenced digests when required by the profile;
- an optional signature algorithm;
- an optional key identifier;
- an optional signature value.

A role label is not a cryptographic signature. A digest without a trusted identity binding can detect modification but cannot prove who created the object. A valid signature proves origin and integrity under the deployed trust model; it does not prove that the signed content is semantically true.

## 4.8 Conceptual Relation, Historical Lineage, and Operational Stack

The orientation map in Section 1 distinguishes historical lineage, current conceptual relation, and end-to-end operation. This section fixes the software boundary:

```text
TMPA architecture
        ↓ reusable FCoP protocol profile realizing a defined subset
FCoP
        ↓ adopted as coordination and governance infrastructure by
CodeFlowMu and other applications
```

**Figure 4. Current conceptual relationship among TMPA, FCoP, and downstream applications.**

FCoP is independently specified and implemented; CodeFlowMu is a downstream adopter. Neither defines the broader TMPA architecture.

The operational FCoP stack is:

```text
Application Layer          CodeFlowMu / Cursor / Claude Desktop
Host Adapter Layer         fcop-mcp / fcop-cli / host bridges
FCoP Protocol Layer        collaboration / reporting / review /
                           capability governance / events / audit
Reference Implementation   fcop Python library
Execution Substrate        LLM APIs / MCP tools / filesystem /
                           process manager / operating system
```

**Figure 5. Operational FCoP stack and its separation from TMPA theory.**

TMPA is not a runtime component in this stack. The `fcop` package is the reference implementation of FCoP; CodeFlowMu is a broader application environment. This separation preserves both historical accuracy and conformance boundaries.

---
# 5. Research Design and Evaluation Method

This work is a design-science architecture study following the artifact-centered guidance of Hevner et al. and the problem-to-communication sequence of Peffers et al. [34], [35]. It constructs a governance artifact, examines its internal properties, instantiates it through a reference profile, and evaluates bounded engineering evidence. It is not a causal trial, a performance benchmark, or a claim of ecosystem adoption.

## 5.1 Design-Science Procedure

The study follows six linked stages:

**Table 6. Design-science procedure and research-question traceability.**

| Stage | Research operation | Output and research question |
|---|---|---|
| problem diagnosis | analyze coordination gaps in chats, logs, workflows, and the XiaoDian lineage | DR1–DR8; RQ1 |
| objectives for a solution | derive minimum-infrastructure, responsibility, lifecycle, conflict, and reconstruction requirements | DR1–DR8; RQ1–RQ2 |
| artifact construction | define objects, streams, authority, lifecycle, and reconstruction rules | TMPA architecture; RQ2 |
| demonstration | map the FCoP protocol and bounded CodeFlowMu, XiaoDian, and WP-13 paths to TMPA concepts | implementation feasibility; RQ3 |
| evaluation | examine invariants and counterexamples; execute the Reference Reader and product evidence matrix | structural and bounded engineering results; RQ1–RQ3 |
| communication | publish versioned paper, specification, implementation report, fixtures, and evidence boundaries | reproducible review surface |

The units of analysis are a governance object, a governed work item, a reconstructed view, and a deployment profile. These units prevent product features, individual files, and architecture-level claims from being treated as interchangeable evidence.

## 5.2 Evidence and Claim Protocol

Evidence is classified as **specified**, **implemented**, **demonstrated**, or **independently adopted**. Conformance evidence additionally records fixed source revisions, evidence hashes, execution prerequisites, expected and actual outputs, and one of four product verdicts: PASS, PARTIAL, NOT RUN, or FAIL. A fixture-oracle match is reported separately from product execution.

This protocol limits three common inference errors. Historical artifacts are not retroactively presented as purpose-built conformance tests; prerequisite failures are not converted into passes or product failures; and author-produced cases are not treated as independent adoption. The procedure supports structural and implementation-feasibility claims, but it does not support causal claims about productivity, cost, reliability, or organizational outcomes.

## 5.3 FCoP as Reference Instantiation

FCoP (File-based Coordination Protocol) is the reference profile used to examine whether TMPA semantics can be realized on an ordinary project-visible filesystem. The conceptual relation is:

```text
TMPA architecture → reusable FCoP protocol profile → CodeFlowMu and other applications
```

**Figure 6. Reference-instantiation path used in the engineering evaluation.**

FCoP is not identical to TMPA. It realizes a file-based subset through named textual artifacts, lifecycle directories, append-oriented transition evidence, schemas, runtime tools, and adapters [7]–[12]. CodeFlowMu is a downstream application that uses FCoP concepts in a persistent multi-role development environment [13].

**Table 7. Mapping from the FCoP protocol profile to TMPA concepts.**

| FCoP element | TMPA interpretation |
|---|---|
| artifact identifier or filename stem | stable transport-visible object identity |
| `sender` and `recipient` | declared writer and intended responsibility transfer |
| lifecycle path and `transitions` | profile-defined state and transition evidence |
| `references`, `ref_task`, `subject_ref` | typed causal or governance links |
| `REVIEW` plus approval evidence | independent verdict and decision |
| `supersedes` | correction without destructive rewrite |
| archive/history | retained terminal evidence |

Under this profile, one task has one stable transport-visible carrier; reports, reviews, issues, approvals, and corrections remain separate artifacts. Writers publish independently, while readers inspect the available source set. The published runtime specification, schemas, packages, adapters, governance middleware, ADRs, and documentation establish implementation and distribution paths, not broad adoption [8]–[16].

## 5.4 Case and Corpus Procedure

The historical lineage is XiaoDian AI → FCoP → CodeFlowMu. XiaoDian exposed the need to preserve acceptance, execution, review, rejection, and audit evidence across model sessions [25]. FCoP extracted the reusable coordination and review skeleton; CodeFlowMu supplied a larger persistent-work application.

The public CodeFlowMu demonstration includes task, report, review, issue, lifecycle, and audit views [13]. A worked NL2SQL case separates execution from review: an executor produces a report, while a reviewer checks authorization, schema use, read-only constraints, tenant isolation, joins, enumerations, and result reasonableness. This demonstrates the intended object chain; it is not a representative production benchmark.

Because some engineering evidence predates the C01–C14 labels, the consolidated corpus maps selected tests and artifacts to fixed criterion fixtures [28]. The evaluation has two tracks. The **analytical track** examines invariants, counterexamples, equal-input determinism, illegal transitions, conflicts, and three-valued judgments. The **engineering track** locks versions and environment; inventories and hashes evidence; maps artifacts and tests to each criterion; retains expected and actual outputs; assigns product verdicts without hiding unmet prerequisites; and reports fixture consistency separately from product behavior. The WP-13 path is treated as evidence-admission behavior, not as proof that an agent no longer hallucinates [36].

The resulting evidence supports bounded structural feasibility: durable project-visible coordination, role-separated review, lifecycle gates, archive preservation, and restart-related recovery. It does not establish lower comparative cost, representative SME performance, independent adoption, portability across deployment profiles, or complete TMPA Core conformance.

## 5.5 Evidence Dependence and Analysis Boundary

The cases are **not independent replications**. TMPA, FCoP, CodeFlowMu, XiaoDian, the Reference Reader, and the C01–C14 mapping share an author and an engineering lineage. FCoP and CodeFlowMu evidence therefore tests projection and implementation paths inside one related ecosystem; aggregating their test counts does not increase the number of independent observations.

The evidence set was selected for traceability to the current architecture and for availability of inspectable artifacts, not through random sampling. The analysis uses descriptive counts, invariant checks, counterexamples, and artifact tracing; it performs no null-hypothesis test, effect-size estimate, or causal comparison. Negative results, dirty-worktree status, unmet prerequisites, and NOT RUN criteria remain in the reported baseline to reduce favorable-outcome selection.

The submission-level unit of inference is consequently limited to: (a) architectural coherence under the stated assumptions; (b) execution of identified mechanisms in pinned author-controlled artifacts; and (c) bounded demonstration of evidence admission, role separation, recovery, and audit behavior. Organizational effectiveness, lower cost, reliability improvement, and general adoption remain hypotheses for independent study.
# 6. Canonical Reconstruction Contract

A TMPA implementation may store evidence in different substrates, but it must expose a canonical textual projection sufficient for deterministic reconstruction. The reader receives a set of **source candidates**, not a trusted ordered log. It parses and validates candidates, preserves duplicate observations, distinguishes conflicting content under the same identifier, applies profile rules, and emits:

1. a canonical candidate set;
2. a partial-order process and responsibility graph;
3. an authoritative issue set;
4. statuses such as authoritative, partial, disputed, quarantined, or rejected.

A conforming reconstruction procedure performs the following logical steps:

```text
RECONSTRUCT(source_candidates, profile):
