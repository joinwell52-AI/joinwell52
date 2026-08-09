| C12 | Conflict preservation | 9.9 | contradictory valid reviews remain visible and disputed until a new authorized resolution object is supplied |
| C13 | Recovery and parent-child closure | 9.10, 9.11 | a fresh reader reconstructs responsibility, lifecycle, unresolved dependencies, failure/recovery, and parent-child relations; open children produce `CHILD_WORK_OPEN`, without hidden runtime context |
| C14 | Post-acceptance terminal-history preservation | 9.2, 9.6, 9.11 | terminal/archive state follows required acceptance and archive authority, and all task, report, review, acceptance, and transition objects needed for reconstruction remain available |

The tests are behavioral. An implementation MAY use different storage, indexing, or execution mechanisms, but the observable conformance result must satisfy the same criteria.

## 10.3 Executable Test-Case Contract

Each executable test case SHALL publish a machine-readable manifest containing:

- a stable `test_case_id` and exactly one C01–C14 `criterion`;
- the Core, object-schema, output-schema, Profile, and registry versions and byte digests;
- explicit prerequisites;
- a source-fixture list containing `source_id`, repository-relative `path`, media type, and byte digest;
- assertions containing a stable assertion ID, target, operator, expected value, and mandatory flag;
- the expected canonical result digest;
- the runner identifier, command, execution environment, and any permutation method or seed;
- repository-relative paths for stdout, stderr, canonical output, and supporting evidence.

The runner SHALL preserve the exact input manifest, canonical result, exit status, stdout, stderr, and execution-environment identity. A test SHALL NOT depend on an unpinned network response, wall-clock ordering, filesystem enumeration order, or undeclared mutable state.

```json
{
  "test_case_id": "C06-illegal-transition-001",
  "criterion": "C06",
  "core_version": "S0.5",
  "inputs": [{"source_id": "transition-1", "path": "fixtures/C06/transition-1.json", "media_type": "application/json", "byte_digest": "sha256:<hex>"}],
  "assertions": [{"id": "state-unchanged", "target": "/nodes/work-1/state", "operator": "equals", "expected": "active", "mandatory": true}],
  "expected_result_digest": "sha256:<hex>",
  "runner": {"id": "tmpa-conformance", "version": "<version>", "command": "<command>"}
}
```

## 10.4 Verdict Algorithm and Conformance Claim

For each criterion, the runner SHALL assign exactly one verdict:

- **PASS:** every mandatory assertion executed and passed;
- **FAIL:** at least one mandatory assertion executed and failed;
- **PARTIAL:** at least one mandatory assertion executed and passed, none failed, and at least one did not execute;
- **NOT RUN:** no mandatory assertion executed, or a prerequisite prevented evaluation.

Infrastructure failure SHALL be recorded separately as `run_state: error` and produces `NOT RUN`, not PASS. The aggregate precedence is FAIL, PARTIAL, NOT RUN, then PASS: any FAIL makes the aggregate FAIL; with no FAIL, any PARTIAL makes it PARTIAL; with neither, any NOT RUN makes it NOT RUN; only all PASS yields PASS.

A product MAY claim **TMPA Core S0.5 Conformance** only when C01–C14 all report PASS against the same fixed input bundle and the complete evidence package is published. “No observed failure,” PARTIAL, NOT RUN, an earlier-Core result, or an unpublished result SHALL NOT be represented as full S0.5 conformance.

`specified`, `implemented`, `demonstrated`, and `independently adopted` describe evidence maturity and SHALL be reported separately from test verdicts. A demonstration by the authors does not establish independent adoption.

```json
{
  "core_version": "S0.5",
  "implementation": {"id": "<id>", "version": "<version>"},
  "criteria": [{"id": "C01", "verdict": "PASS", "manifest_digest": "sha256:<hex>", "result_digest": "sha256:<hex>"}],
  "aggregate_verdict": "PASS | FAIL | PARTIAL | NOT RUN",
  "evidence_level": "specified | implemented | demonstrated | independently_adopted"
}
```

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

## 11.4 S0.5 FCoP-Derived Closure Record

The 2026-08-05 S0.5 revision extends the S0.4 implementable baseline with protocol semantics extracted from the complete FCoP source set rather than from one application case. It separates lifecycle state from business acceptance; adds explicit parent-child work derivation, completion claims and evidence, role capability layers, risk and human-approval gates, reciprocity, failure/recovery actions, inspection findings, and drift handling; and extends Reader issues and C01–C14 accordingly.

The source boundary is explicit. FCoP is a protocol and reference profile. Its normative inputs are the version-pinned FCoP specification, rules, schemas, and architecture decisions. The `fcop` and `fcop-mcp` Python packages are a reference implementation used to test selected protocol projections; installing or testing those packages is not “installing FCoP,” and their test status does not by itself determine whether the protocol is valid.

The author-produced S0.5 Reference Reader passes all fourteen S0.5 fixtures. A separate rerun of the FCoP v3.2.5 reference implementation recorded 1,222 passed, 2 skipped, and 3 failed tests; the failures concern preservation and public-surface exposure of the optional `parent` field. The product baseline is therefore FAIL for the executed C02 S0.5 assertion. This is a bounded reference-implementation consistency finding, not a failure of the FCoP protocol and not full S0.5 product conformance.

S0.4 and its I0.5 conformance corpus remain immutable historical baselines. They SHALL NOT be relabeled as S0.5 evidence. I0.6 supplies a separate author-run S0.5 evidence record and retains all product FAIL, PARTIAL, and NOT RUN results. I0.7 supplies a newer fixed CodeFlowMu V1.4.1 run with 14/14 author-local product PASS while preserving the I0.6 and V1.4.0 repair-before records as history. S0.5 changes observable schema, Reader output, and criterion meanings, so every S0.5 product claim requires its own fixed S0.5 run.

---

# Appendix A. Historical Source Traceability (Informative)

| Core specification content | Historical source section | Current treatment |
|---|---|---|
| terminology and representation stages | Section 1.5 | retained and renumbered |
| governance objects, roles, lifecycle, streams, aggregation, integrity | Sections 4.1–4.7 | retained and renumbered |
| canonical schema, encoding, reader algorithm, conflict handling | Sections 6.1–6.2 and 6.5–6.6 | retained; FCoP mapping and product example excluded |
| threat model and security boundaries | Chapter 8 | retained and renumbered |
| normative Core clauses | Chapter 9 | retained with original 9.x identifiers |
| conformance levels and C01–C14 | Sections 10.1–10.2 | retained with original identifiers |
| fixture and result-reporting requirements | Section 10.5 | retained; current product baseline removed |
| compliance crosswalk boundary | Section 10.6 | retained |

The Architecture Paper may summarize this specification but cannot redefine it. The Implementation Case Report may provide evidence against these clauses but cannot change their meaning. The historical combined draft records provenance only and has no current editorial or normative authority. All S0.5 and later normative changes are maintained directly in this GitHub Core Specification and represented by Git history.

# Appendix B. FCoP Source Crosswalk (Informative)

| S0.5 concern | Version-pinned FCoP source | TMPA Core treatment |
|---|---|---|
| protocol object, document and event vocabulary | `spec/fcop-v3-spec.md` and `spec/fcop-v3-spec.zh.md`; repository tag `v3.2.5` | projected into governance objects, typed references, writer streams, and source-preserving Reader input |
| role boundaries and collaboration-cycle rules | `AGENTS.md`, rules line `3.2.5` | declared capability and enforced authority remain separate; acceptance and separation-of-duty decisions require attributable evidence |
| machine-readable carriers and validation | `spec/schemas/` | informs S0.5 object/profile schemas but does not replace TMPA Core schema validation |
| lifecycle, atomic transition, recovery and audit decisions | FCoP specification and applicable ADRs | formalized as lifecycle state, business acceptance, failure/recovery actions, inspection findings, and deterministic history reconstruction |
| parent-child work derivation and closure | FCoP v3.2.5 `parent` protocol surface | represented by `governed_work.parent_id`, parent-child rollup, and `CHILD_WORK_OPEN` |
| executable software | `fcop` and `fcop-mcp` packages | treated only as the FCoP reference implementation; package tests are implementation evidence, not the protocol itself |
| downstream use | CodeFlowMu and bounded XiaoDian AI/WP-13 evidence | treated as application evidence in the Implementation Case Report, never as proof of the theory or definition of the protocol |

The crosswalk is a traceability aid, not an incorporation by reference. Where FCoP and TMPA use different abstractions, this Core specification controls TMPA meaning; where an application or reference implementation diverges from its protocol source, the divergence is reported as implementation evidence rather than silently changing either specification.
