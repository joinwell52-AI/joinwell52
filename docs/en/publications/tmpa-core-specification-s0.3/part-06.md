| C12 | Conflict preservation | 9.9 | contradictory valid reviews remain visible and disputed until a new authorized resolution object is supplied |
| C13 | Recovery | 9.10 | a fresh reader reconstructs current responsibility, lifecycle status, unresolved dependencies, and issue state from persistent governance evidence without hidden runtime context |
| C14 | Terminal-history preservation | 9.2, 9.6 | transition to a terminal or archival state preserves the prior objects and transitions required to reconstruct the complete governed history |

The tests are behavioral. An implementation MAY use different storage, indexing, or execution mechanisms, but the observable conformance result must satisfy the same criteria.

## 10.5 Test Fixtures and Result Reporting

The conformance package SHOULD publish:

- valid TMPA Core object fixtures;
- valid FCoP `TASK`, `REPORT`, `ISSUE`, and `REVIEW` fixtures derived from the published schemas;
- invalid schema and format fixtures;
- illegal and unauthorized transition fixtures;
- unauthorized role and separation-of-duty fixtures;
- broken digest and signature fixtures;
- duplicate-ID, duplicate-sequence, and sequence-gap fixtures;
- missing-reference and prohibited-cycle fixtures;
- parallel conflicting-review fixtures;
- controlled interruption and recovery snapshots;
- terminal-history or archival-preservation fixtures;
- expected canonical aggregated candidate sets, reconstructed process/governance graphs or views, and issue sets.

Each executable fixture set SHOULD identify:

- the TMPA schema version;
- the profile and rule-set version;
- the reader implementation and version;
- the canonicalization profile;
- input object identifiers and digests;
- expected accepted, partial, disputed, quarantined, and rejected identifiers;
- expected canonical view and issue-set outputs;
- permutation method, seed, and tested permutation count where applicable;
- runner command, execution date, and result.

A pipeline passes C11 only when the aggregator produces the expected canonical candidate set and canonical serialization of both the reconstructed process/governance graph or view and issue set matches the expected fixture for every tested enumeration and delivery permutation of the same final source set. Differences in non-canonical logging or internal data structure order do not constitute a failure unless they alter the canonical output.

## 10.6 Compliance Crosswalks

TMPA provides technical controls, not automatic legal certification. A deployment MAY map TMPA fields and tests to external requirements, including:

- organizational accountability;
- logging and record retention;
- human oversight;
- identity and authorization;
- separation of duties;
- incident investigation;
- evidence integrity.

The crosswalk SHALL identify whether each external requirement is fully supported, partially supported, unsupported, or outside TMPA scope. It SHALL also identify the external identity, policy, retention, and security systems on which the mapping depends.

A global interoperability profile and a jurisdiction-specific compliance profile are separate deliverables. For example, mapping FCoP artifacts to A2A tasks is an interoperability problem; mapping TMPA evidence to a national or sectoral regulation is a compliance problem. The two may share governance objects, but neither should be claimed on the basis of the other.


---

# 11. Profile, Versioning, and Publication Rules

## 11.1 Core and Profile Separation

TMPA Core defines portable governance semantics. A profile MAY add document types, lifecycle profiles, storage mappings, identity bindings, integrity policies, or application-specific rules. A profile MUST identify its version, MUST state which Core conformance level it claims, and MUST NOT weaken a Core MUST while continuing to claim the affected conformance level.

A profile-specific artifact is not automatically a canonical Core object. The profile MUST define a deterministic projection from source artifacts into source candidates, canonical objects, governance graph nodes and edges, and issue-set entries.

## 11.2 Versioning

Changes that alter required fields, authority semantics, lifecycle legality, canonicalization, reader output, issue classification, or C01–C14 pass criteria require a new Core version. Editorial clarification that does not alter observable behavior MAY retain the current Core version but SHOULD be recorded in a changelog.

Conformance reports MUST identify the exact Core version, profile version, reader implementation, canonicalization profile, fixtures, source revision, and execution environment.

## 11.3 Publication and Evidence Boundary

Publication of a specification establishes the **specified** evidence level. Executable code may establish **implemented** behavior for tested paths. A bounded run may establish **demonstrated** behavior. None of those establishes independent adoption or validation without an external implementation, rerun, or organizational reliance.

The first author-produced C01–C14 corpus is maintained as a separate empirical artifact rather than embedded in this Core specification. Product verdicts and case evidence belong in the implementation and case report; the normative criterion meanings remain defined here.

---

# Appendix A. Source Traceability (Informative)

| Core specification content | Combined-master source | Extraction treatment |
|---|---|---|
| terminology and representation stages | Section 1.5 | retained and renumbered |
| governance objects, roles, lifecycle, streams, aggregation, integrity | Sections 4.1–4.7 | retained and renumbered |
| canonical schema, encoding, reader algorithm, conflict handling | Sections 6.1–6.2 and 6.5–6.6 | retained; FCoP mapping and product example excluded |
| threat model and security boundaries | Chapter 8 | retained and renumbered |
| normative Core clauses | Chapter 9 | retained with original 9.x identifiers |
| conformance levels and C01–C14 | Sections 10.1–10.2 | retained with original identifiers |
| fixture and result-reporting requirements | Section 10.5 | retained; current product baseline removed |
| compliance crosswalk boundary | Section 10.6 | retained |

The architecture paper may summarize this specification but cannot redefine it. The implementation and case report may provide evidence against these clauses but cannot change their meaning. Until TMPA Core V1.0 is frozen, normative changes are made in the combined master and regenerated into this derivative.


## S0.3 Consolidated Theory Alignment

The Core specification incorporates the R26–R29 theoretical boundary: textual protocol execution may be performed by probabilistic agents, while conformance and governance conclusions require deterministic validation. This specification therefore defines delegated authority, lifecycle validation, and governance judgment independently from model interpretation.

Governance judgments use three semantic values: `valid`, `invalid`, and `undetermined`. Implementations MUST preserve unresolved states rather than forcing incomplete or conflicting evidence into binary conclusions.


## S0.3 Governance Judgment Semantics

TMPA Core defines three semantic governance judgments:

- `valid`: required evidence and applicable governance rules establish acceptance.
- `invalid`: applicable rules establish rejection or violation.
- `undetermined`: evidence is incomplete, conflicting, or awaiting resolution; no binary conclusion is permitted.

Implementations MUST preserve `undetermined` states and MUST NOT convert unresolved evidence into `valid` or `invalid` without an authorized resolution object.

If a governance object depends on another object whose judgment is `undetermined`, the dependent judgment SHALL remain `undetermined` until resolution.

View classifications are derived presentations, not additional semantic values: authoritative corresponds to valid; quarantined corresponds to invalid; partial, disputed, and pending_human represent different causes of undetermined.
