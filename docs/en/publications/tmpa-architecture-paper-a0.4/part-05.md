  parse and canonicalize candidates
  validate schemas, identifiers, types, and integrity evidence
  preserve duplicate observations and conflicting candidates
  group valid objects by writer stream and check local sequence
  construct edges from sequence, references, lifecycle, and profile relations
  validate role authority, separation of duties, and lifecycle legality
  detect missing references, prohibited cycles, and unresolved conflict
  derive lifecycle, responsibility, review, and recovery state
  emit canonical graph and issue set
```

The procedure does not silently “repair” invalid evidence. A malformed object, illegal transition, missing reference, duplicate identifier with different content, or contradictory review remains observable through the issue set. A later authorized resolution may change the authoritative interpretation without erasing the earlier evidence.

## 6.1 Determinism

Let \(S\) be a fixed final set of source candidates and \(P\) a fixed profile. The reader is deterministic when every enumeration or delivery permutation of \(S\) produces the same canonical candidate set, graph, statuses, and issue set.

This is a set-based requirement, not a claim that every intermediate view is complete. Before all evidence arrives, the reader may report partial or disputed state. Once the available source set is identical, output must be invariant to discovery order.

The proof obligation follows from four constraints:

- canonicalization and validation depend on candidate content and profile rules, not enumeration order;
- within-stream order is derived from explicit sequence evidence;
- cross-stream order is derived from explicit references and lifecycle relations;
- conflicts are preserved as sets and issues rather than resolved by “last arrival wins.”

The current paper provides a proof sketch and executable fixture oracle, not a mechanized proof. The C11 fixture enumerates 24 permutations and obtains byte-equivalent oracle output, but the pinned products do not yet expose the complete canonical graph-and-issue serializer required for a product-level C11 verdict.

## 6.2 Integrity, Identity, and Truth

Digest and signature evidence must be interpreted narrowly. A digest can reveal covered-byte modification. A verified signature can bind bytes to a key under an external trust model. Neither proves that the signed statement is factually correct.

A malicious, compromised, or mistaken participant can publish a schema-valid, lifecycle-valid, digest-consistent, and even correctly signed report whose claims are false. TMPA Core can identify the object, preserve it, test its declared authority, and relate it to independent review; factual verification requires tool receipts, reproducible outputs, independent data sources, or domain-specific validation outside Core.

This distinction produces three separate questions:

| Question | Required mechanism |
|---|---|
| Were these bytes changed? | digest or tamper-evident storage |
| Which authenticated principal signed them? | signature, key, and identity profile |
| Are the claims true? | independent verification or domain evidence |

TMPA must not claim the guarantee of a surrounding identity, policy, or cryptographic system unless the deployment actually verifies that evidence under the corresponding profile.
# 7. Core Summary and Conformance

The separately maintained [TMPA Core Specification S0.3](/en/publications/tmpa-core-specification-s0.3) is the sole normative source for C01–C14 and all SHALL/MUST clauses. This architecture paper summarizes that contract without redefining it; engineering verdicts belong to the [Implementation Case Report I0.3](/en/publications/implementation-case-i0.3).

A Core-conforming implementation must provide:

- canonical textual governance objects and a finite type registry;
- stable identifiers and profile-defined lifecycle rules;
- single-writer publication and non-destructive correction;
- role assignment and authority validation;
- source-preserving aggregation;
- deterministic reconstruction of graph, lifecycle, responsibility, conflict, and issues;
- explicit treatment of invalid, partial, disputed, and quarantined evidence;
- declared integrity, identity, and storage assumptions.

Conformance is evaluated at multiple levels. **Core conformance** tests the architecture semantics. A **profile conformance** claim adds profile-specific encoding and lifecycle rules. **Authenticated governance conformance** additionally requires verified identity and signature policy. A product may satisfy some criteria partially without claiming full Core conformance.

## 7.1 C01–C14 Criteria

| ID | Canonical test name | Architecture-level observable requirement |
|---|---|---|
| C01 | Schema validation | canonical objects and invalid-schema cases are handled consistently |
| C02 | Primary-carrier and single-writer immutability | single-writer publication and correction preserve prior evidence |
| C03 | Duplicate object identity | duplicate identifiers with different content remain conflicted and non-authoritative |
| C04 | Serial-stream continuity and asynchronous progress | local sequence faults do not invent a global total order or block unrelated streams |
| C05 | Role authority | out-of-scope actions fail closed and produce governance issues |
| C06 | Lifecycle legality | illegal lifecycle transitions are rejected without changing authoritative state |
| C07 | Separation of duties | review separation is enforced or an authorized exception is recorded |
| C08 | Integrity tampering | tampering of covered content is detected |
| C09 | Missing reference | required missing references produce an `undetermined` partial or blocked state |
| C10 | Prohibited cycle | prohibited cycles are detected while unaffected subgraphs remain usable |
| C11 | Aggregation and reconstruction determinism | equal source sets produce byte-equivalent canonical graph and issue output across permutations |
| C12 | Conflict preservation | contradictory valid evidence remains disputed and `undetermined` until an authorized resolution |
| C13 | Recovery | a fresh reader reconstructs responsibility, lifecycle, dependencies, and issues |
| C14 | Terminal-history preservation | terminal state, transitions, and prior evidence remain recoverable |

## 7.2 First Pinned Baseline

The first consolidated corpus was executed on 31 July 2026 under identifier `tmpa-draft-v1-c01-c14-20260731` [28]. It pins FCoP package `3.2.4` at commit `da79dfefd99f597c9e422ce9edec22157f915a21`, CodeFlowMu `V1.2.3` at commit `8f342d028eb66e77d135bea58fdbc7f2d0627e3b`, and selected XiaoDian evidence by commit or SHA-256. The inventory records 325 evidence files.

Selected runs reported 222 FCoP tests and 73 CodeFlowMu tests passing. Four XiaoDian report-auditor tests passed as non-gating field evidence. One isolated CodeFlowMu identity test and one XiaoDian guardrail suite were not run because their prerequisites could not be prepared; these prerequisite failures were retained rather than converted into criterion failures or passes.

The product-level verdicts are:

| Verdict | Criteria |
|---|---|
| PASS | C06, C14 |
| PARTIAL | C01, C02, C03, C04, C05, C07, C09, C13 |
| NOT RUN | C08, C10, C11, C12 |

No criterion with a direct gating test failed in the run. That statement is limited to executed paths and is not “zero-failure full conformance.” All 14 fixture oracles matched expected outputs, but fixture consistency does not substitute for product execution.

The eight partial verdicts share a dominant implementation gap. FCoP and CodeFlowMu already provide substantial write-side and local-control mechanisms—separate artifacts, atomic publication, role checks, lifecycle gates, dependency blocking, archive preservation, and restart recovery—but do not expose one read-only adapter that normalizes all evidence into:

```text
source candidates
      ↓
canonical candidate set
      ↓
process and responsibility graph
      ↓
authoritative issue set
      ↓
authoritative / partial / disputed / quarantined view
```

This adapter would directly improve C03, C05, C09, and C13 and provide infrastructure for C04 and C07. It would also create the product execution path required by C10–C12. C01 still has schema-coverage gaps, C02 has a stricter immutability gap, and C08 requires a covered-content digest reader.

The baseline is author-produced. A stable public archive and an independent rerun are required before any independently validated claim.
# 8. Discussion and Limitations

TMPA's contribution is a process-governance contract, not a complete enterprise agent platform. It makes work identity, responsibility, review, lifecycle, conflict, and recovery explicit at publication time and reconstructs them from durable evidence. FCoP demonstrates that a useful subset can operate in an ordinary project environment without a mandatory broker or coordination database.

The architecture does not replace:

- enterprise IAM, credential issuance, or key management;
- runtime gateways, policy engines, or admission control;
- model evaluation and factual verification;
- OTel, SIEM, CMDB, GRC, or enterprise agent inventory;
- database transactions, distributed consensus, or Byzantine fault tolerance;
- legal compliance programs.

These systems may supply identifiers, policy decisions, execution receipts, and protected storage to TMPA. Their guarantees remain external unless verified and referenced.

## 8.1 Evidence Maturity

The paper separates four claim levels:

1. **specified** — a rule, schema, or criterion is published;
2. **implemented** — code executes the rule;
3. **demonstrated** — an operational case exhibits the behavior;
4. **independently adopted** — an external system relies on and validates it.

The architecture and criteria are specified. FCoP supplies implementation evidence. CodeFlowMu and XiaoDian supply bounded demonstration evidence. Independent adoption is not established.

The author is also the originator and principal developer of the evaluated systems. This gives access to detailed artifacts but creates self-evaluation and selection risk. The corpus therefore labels author-produced evidence, non-gating field evidence, fixture-only oracle results, and product-level verdicts separately.

## 8.2 SME-First Claim

“SME-first” is an operational scope, not a claim that every SME has the same needs or that TMPA is unsuitable for larger organizations. The lightweight profile assumes limited platform and operations capacity. Larger deployments may preserve the same semantics through databases, object stores, identity systems, replication, and enterprise control planes.

The decisive empirical question remains whether the benefits justify the discipline and resource cost. Required measurements include:

| Experiment | Required evidence |
|---|---|
| deployment burden | dependencies, installation steps, setup time, first-team time, backup, migration |
| reconstruction | delayed and permuted streams, intermediate partial state, byte-equivalent final output |
| fault and recovery | duplicates, illegal transitions, missing references, tampering, restart, recovery time |
| human inspectability | ability to identify ownership, missing evidence, review status, and next responsibility |
| adoption discipline | onboarding, bypass, correction, fallback to chat, perceived burden, continued use |
| representative workload | latency, CPU, memory, storage growth, conflict rate, and recovery time |

The current corpus provides a normalized baseline but not these complete measurements.

## 8.3 Digital Employee Profile and Privacy

The term **digital employee** is used only as an engineering label for a persistent AI work role. It does not assert employment status, legal personality, consciousness, human intention, autonomous organizational authority, or replacement of an accountable human or organization.

A future profile may define job scope, acceptance of delegated work, handoff, suspension, reassignment, and retirement. These are application semantics, not changes to Core.

Textual governance improves inspectability but may expose sensitive information. Deployments should minimize content, separate secrets from governance metadata, apply access control and encryption, and define retention and erasure procedures. Immutability of governance history does not require public readability of sensitive payloads.
