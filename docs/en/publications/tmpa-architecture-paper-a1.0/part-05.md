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

The current paper provides a proof sketch and executable fixture oracle, not a mechanized proof. The S1.0 C11 fixture enumerates declared permutations and the CodeFlowMu V1.8.0 product path records PASS for that fixed fixture. This is a product-level verdict for the declared bundle, not a proof over arbitrary graphs, encodings, filesystems, or hostile platforms.

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

The separately maintained [TMPA Core Specification S1.0](/en/publications/tmpa-core-specification-s1.0) is the sole normative source for the current C01–C14 criteria and all SHALL/MUST clauses. The [Implementation Case Report I1.0](/en/publications/implementation-case-i1.0) reports the current bounded S1.0 engineering-evidence baseline. I0.6–I0.8 remain immutable historical baselines for their earlier inputs and product revisions. This section evaluates the research questions without reproducing the specification.

## 7.1 Findings by Research Question

**Table 9. Findings, evidence, and inference boundaries by research question.**

| Research question | Finding and evidence | Boundary |
|---|---|---|
| RQ1: governance-state sufficiency | ordinary conversation and execution surfaces do not, by themselves, preserve enough explicit authority, lifecycle, conflict, and recovery state for deterministic governance reconstruction; supported by problem diagnosis, DR1–DR8, and object/reconstruction analysis | no comparative field experiment has measured failure rates against alternative architectures |
| RQ2: minimum architecture | stable carriers, single-writer streams, explicit authority and lifecycle, typed references, three-valued judgment, and source-preserving deterministic reconstruction form a coherent minimum contract; supported by invariants, counterexamples, the determinism proof sketch, and Core S1.0 | the proof is not mechanized, and minimality is an architectural argument rather than a universal lower-bound proof |
| RQ3: engineering feasibility and boundary | FCoP supplies the protocol profile; CodeFlowMu V1.8.0 executes its own product Reader against the exact S1.0 bundle with 14/14 PASS across 71 mandatory assertions; the archive locks source, inputs, commands, results, and integrity records; WP-13 supplies separate evidence-admission observations | all execution remains author-produced; independent adoption, comparative SME burden, cross-profile portability, and behavior outside the fixed bundle are not established |

The result is therefore strongest for architectural coherence and fixed-bundle implementation feasibility. It is weaker for organizational effectiveness and ecosystem generalization, which require independent, representative, and comparative evidence.

## 7.2 Conformance-Domain Summary

The current product result is summarized by architectural domain; exact criterion definitions remain in Core S1.0 §10.2.

**Table 10. CodeFlowMu V1.8.0 product results for the exact S1.0 bundle.**

| Domain | Criteria | Product-level result |
|---|---|---|
| object, immutability, provenance, and integrity | C01, C02, C03, C08 | 4 PASS |
| authority and lifecycle | C05, C06, C07 | 3 PASS |
| ordering, reference, and conflict | C04, C09, C10, C12 | 4 PASS |
| determinism, recovery, and history | C11, C13, C14 | 3 PASS |

This 14/14 result is a criterion-level product verdict for one exact input bundle and declared product revision. It is not a declaration of authenticated governance, correctness for arbitrary source sets, full protocol validity, or independent certification.

## 7.3 S1.0 Author-Run Product Baseline

I1.0 publishes `tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip`, whose outer SHA-256 is `9b92b06c3e46c8019362f55075be4ed066cb7a9c0d9859945b6c3b7de8840d04` [28]. The run fixes TMPA Core S1.0 at frozen candidate commit `942cbb097eb3d662662f96a2269818ec9d7ca2ed` and CodeFlowMu V1.8.0 at evidence commit `c1e1f724293e8048fc3a956b6f6df8cf83f54830`. The normative inputs are byte-identical to the frozen GitHub objects; their aggregate bundle digest is `sha256:f98764987760cdc8ac356b1265fc98485f33345e7d6ffc8575ccb059ddd34daa`, and the aggregate result digest is `sha256:0f0f642449db1853371861751a7a8ea36dce00013f53e32012a5e4dae45f4c39`.

The result envelope records `product_reader_called: true` and `reference_reader_called: false`. CodeFlowMu's internal TMPA Runtime suite passes 24/24 tests; Runtime records 1,522 passed / 0 failed / 1 skipped; Shell records 791/791; Protocol validation and type checking exit successfully; and the FCoP reference implementation locked at commit `da79dfefd99f597c9e422ce9edec22157f915a21` records 1,210 passed / 2 skipped. These supporting suite counts are context, not additional C01–C14 observations.

**Table 11. Product-level S1.0 verdicts for the I1.0 baseline.**

| Verdict | Criteria |
|---|---|
| PASS | C01, C02, C03, C04, C05, C06, C07, C08, C09, C10, C11, C12, C13, C14 |
| PARTIAL | none |
| NOT RUN | none |
| FAIL | none |

The archive contains 889 manifest-covered files, including exact inputs, product source, dependency locks, command records, raw results, pre-fix failures, remediation history, and a reduced clean-machine reproducer. Publication review recomputed all fourteen manifest digests, fourteen result digests, 71 mandatory assertions, the input digest, and aggregate result digest without discrepancy. This establishes package consistency and traceability; it does not constitute an independent product rerun or certification.

## 7.4 Interpretation: Closed Implementation Gaps, Open Validation Gap

The I0.6 baseline exposed missing product projection plus concrete C02 and C07 failures and unexecuted C08, C11, and C12 paths. I0.7 and I0.8 progressively closed those observed gaps. The I1.0 baseline rebinds the product path to the stable S1.0 machine identities, preserves the frozen candidate's historical product `NOT RUN` baseline, and registers the later CodeFlowMu V1.8.0 exact-version run separately. No historical verdict or criterion was weakened.

```text
exact S1.0 normative bytes
          ↓ hash verification
CodeFlowMu V1.8.0 product Reader
          ↓ C01–C14 execution
schema-valid 14/14 result
          ↓ publication
locked evidence archive + integrity manifest
```

**Figure 8. Product-evidence path established by I1.0.**

The dominant remaining gap has therefore moved from product projection and stable machine identity to validation independence and external scope. The result remains author-run, related-lineage, fixed-bundle demonstrated evidence. The CodeFlowMu evidence commit was local-only at capture, although the archive includes its source snapshot and patch. Independent reruns, independent adoption, alternative-profile implementations, representative SME deployment, comparative cost, and measurements of organizational outcomes remain necessary before broader claims are supportable. WP-13 remains a bounded evidence-gating case and does not establish S1.0 conformance or hallucination elimination.
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

The architecture and criteria are specified. FCoP supplies implementation evidence. The locked CodeFlowMu and WP-13 artifacts supply bounded demonstration evidence. XiaoDian is retained as author-reported provenance only; independent adoption is not established.

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
