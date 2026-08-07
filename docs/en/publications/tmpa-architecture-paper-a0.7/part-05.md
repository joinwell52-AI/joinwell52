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

**Figure 7. Substrate-neutral canonical reconstruction procedure.**

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

**Table 8. Separation of integrity, authenticated identity, and factual truth.**

| Question | Required mechanism |
|---|---|
| Were these bytes changed? | digest or tamper-evident storage |
| Which authenticated principal signed them? | signature, key, and identity profile |
| Are the claims true? | independent verification or domain evidence |

TMPA must not claim the guarantee of a surrounding identity, policy, or cryptographic system unless the deployment actually verifies that evidence under the corresponding profile.
# 7. Evaluation Results

The separately maintained [TMPA Core Specification S0.5](/en/publications/tmpa-core-specification-s0.5) is the current sole normative source for C01–C14 and all SHALL/MUST clauses. The [Implementation Case Report I0.6](/en/publications/implementation-case-i0.6) reports the current bounded S0.5 engineering-evidence baseline; I0.5 remains the immutable S0.4 historical baseline. This section evaluates the research questions without reproducing the specification.

## 7.1 Findings by Research Question

**Table 9. Findings, evidence, and inference boundaries by research question.**

| Research question | Finding and evidence | Boundary |
|---|---|---|
| RQ1: governance-state sufficiency | ordinary conversation and execution surfaces do not, by themselves, preserve enough explicit authority, lifecycle, conflict, and recovery state for deterministic governance reconstruction; supported by problem diagnosis, DR1–DR8, and object/reconstruction analysis | no comparative field experiment has measured failure rates against alternative architectures |
| RQ2: minimum architecture | stable carriers, single-writer streams, explicit authority and lifecycle, typed references, three-valued judgment, and source-preserving deterministic reconstruction form a coherent minimum contract; supported by invariants, counterexamples, the determinism proof sketch, and Core S0.5 | the proof is not mechanized, and minimality is an architectural argument rather than a universal lower-bound proof |
| RQ3: engineering feasibility and boundary | FCoP, CodeFlowMu, and WP-13 provide bounded evidence that substantial parts of the contract can operate in project-visible infrastructure; supported by reference mapping, operational cases, and the pinned I0.6 C01–C14 baseline | two criteria fail, three were not run, eight remain partial, and independent adoption, comparative SME burden, and cross-profile portability are not established |

The result is therefore strongest for architectural coherence and bounded implementation feasibility. It is weaker for organizational effectiveness and ecosystem generalization, which require independent and comparative evidence.

## 7.2 Conformance-Domain Summary

The baseline is summarized by architectural domain; exact criterion definitions remain in Core S0.5 §10.2.

**Table 10. Product-level C01–C14 results by architectural domain.**

| Domain | Criteria | Product-level result |
|---|---|---|
| object, immutability, and integrity | C01, C02, C03, C08 | 1 FAIL; 2 PARTIAL; 1 NOT RUN |
| authority and lifecycle | C05, C06, C07 | 1 FAIL; 2 PARTIAL |
| ordering, reference, and conflict | C04, C09, C10, C12 | 3 PARTIAL; 1 NOT RUN |
| determinism, recovery, and history | C11, C13, C14 | 1 PASS; 1 PARTIAL; 1 NOT RUN |

These are product-level results for the pinned revisions, not a declaration of full Core, profile, or authenticated-governance conformance.

## 7.3 S0.5 Author-Run Product Baseline

I0.6 publishes the evidence package `tmpa-i0.6-local-evidence-20260806-v2` [28]. It pins FCoP tag `v3.2.5` commit `b3dc23439c6aaa6a6b3765655b87e5924e0257f9`, an isolated CodeFlowMu snapshot based on commit `c4ebc146cb8ef0409a4c9eb571a8f2432ade3bd0`, and the WP-13 V3 package. The CodeFlowMu source worktree was dirty and local-only, so the run is author-local evidence rather than a stable public reproduction baseline. XiaoDian had no fixed S0.5 package and was not run.

FCoP records 1,222 passed, 3 failed, and 2 skipped tests. CodeFlowMu records 8/8 Protocol fixtures, 1,420 passed / 1 failed / 1 skipped Runtime tests, 770/770 Shell tests, and successful type checks. The public S0.5 Reference Reader passes all 14 synthetic fixtures; those passes are not product passes.

The product-level verdicts are:

**Table 11. Product-level S0.5 verdicts for the I0.6 baseline.**

| Verdict | Criteria |
|---|---|
| PASS | C14 |
| PARTIAL | C01, C03, C04, C05, C06, C09, C10, C13 |
| NOT RUN | C08, C11, C12 |
| FAIL | C02, C07 |

The C02 failure records incomplete FCoP `parent` persistence/readback and release-surface closure. The C07 failure records a CodeFlowMu prompt-contract mismatch—readable `需 ADMIN/PM 人工裁定` versus the required test expression—not encoding damage. Both failures remain until corresponding fixes and full reruns.

## 7.4 Interpretation: Product Projection Gap

The eight partial verdicts share a dominant implementation gap. A generic S0.5 read-only Reference Reader exists, while FCoP and CodeFlowMu do not expose maintained projection adapters that normalize their native evidence into:

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

**Figure 8. Missing product-projection path identified by the I0.6 evaluation.**

Product projection would directly improve C03, C05, C09, and C13 and provide infrastructure for C04, C06, and C10. It would also create product execution paths for C11–C12. C01 still has schema-coverage gaps; C02 and C07 require failure-specific fixes; C08 requires covered-content digest evidence.

The corpus and baseline are author-produced. The corpus is now public, but an independent rerun is still required before any independently validated claim.
# 8. Discussion, Limitations, and Threats to Validity

TMPA's contribution is a process-governance contract, not a complete enterprise agent platform. It makes work identity, responsibility, review, lifecycle, conflict, and recovery explicit at publication time and reconstructs them from durable evidence. Author-run FCoP evidence indicates that a useful subset can operate in an ordinary project environment without a mandatory broker or coordination database.

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

**Table 12. Empirical program required to test the SME-first feasibility claim.**

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
