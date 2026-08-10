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

The separately maintained [TMPA Core Specification S0.6](/en/publications/tmpa-core-specification-s0.6) is the sole normative source for the current C01–C14 criteria and all SHALL/MUST clauses. The [Implementation Case Report I0.8](/en/publications/implementation-case-i0.8) reports the current bounded S0.6 engineering-evidence baseline. I0.6 and I0.7 remain immutable historical baselines for their earlier inputs and product revisions. This section evaluates the research questions without reproducing the specification.

## 7.1 Findings by Research Question

**Table 9. Findings, evidence, and inference boundaries by research question.**

| Research question | Finding and evidence | Boundary |
|---|---|---|
| RQ1: governance-state sufficiency | ordinary conversation and execution surfaces do not, by themselves, preserve enough explicit authority, lifecycle, conflict, and recovery state for deterministic governance reconstruction; supported by problem diagnosis, DR1–DR8, and object/reconstruction analysis | no comparative field experiment has measured failure rates against alternative architectures |
| RQ2: minimum architecture | stable carriers, single-writer streams, explicit authority and lifecycle, typed references, three-valued judgment, and source-preserving deterministic reconstruction form a coherent minimum contract; supported by invariants, counterexamples, the determinism proof sketch, and Core S0.6 | the proof is not mechanized, and minimality is an architectural argument rather than a universal lower-bound proof |
| RQ3: engineering feasibility and boundary | FCoP supplies the protocol profile; CodeFlowMu V1.6.0 executes its own product Reader against the exact S0.6 bundle with 14/14 PASS; a public reproducer verifies the normative hashes and reruns the slice; WP-13 supplies separate evidence-admission observations | all execution remains author-produced; independent adoption, comparative SME burden, cross-profile portability, and behavior outside the fixed bundle are not established |

The result is therefore strongest for architectural coherence and fixed-bundle implementation feasibility. It is weaker for organizational effectiveness and ecosystem generalization, which require independent, representative, and comparative evidence.

## 7.2 Conformance-Domain Summary

The current product result is summarized by architectural domain; exact criterion definitions remain in Core S0.6 §10.2.

**Table 10. CodeFlowMu V1.6.0 product results for the exact S0.6 bundle.**

| Domain | Criteria | Product-level result |
|---|---|---|
| object, immutability, provenance, and integrity | C01, C02, C03, C08 | 4 PASS |
| authority and lifecycle | C05, C06, C07 | 3 PASS |
| ordering, reference, and conflict | C04, C09, C10, C12 | 4 PASS |
| determinism, recovery, and history | C11, C13, C14 | 3 PASS |

This 14/14 result is a criterion-level product verdict for one exact input bundle and declared product revision. It is not a declaration of authenticated governance, correctness for arbitrary source sets, full protocol validity, or independent certification.

## 7.3 S0.6 Author-Run Product Baseline

I0.8 publishes `tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip`, whose outer SHA-256 is `3c34514089f08f5957d806f900ab31af1cdae94c08f31a5da046f451b5884fe9` [28]. The run fixes TMPA Core S0.6 at commit `8989657e8fde6d2e55d7606ae0adacac14fec760` and CodeFlowMu V1.6.0 at implementation commit `62440a526a99d2fe55019d8bb95ad2425569fcb4`. All seven normative inputs are byte-identical to the GitHub objects; their aggregate bundle digest is `sha256:251914ee55922d20c9bd23943a4ff445bccaa5835e1fcc11b8562f3f384243fa`.

The result envelope records `product_reader_called: true` and `reference_reader_called: false`. CodeFlowMu's internal TMPA suite passes 23/23 tests; Protocol records 5 valid and 3 expected-invalid fixtures; Runtime records 1,485 passed / 0 failed / 1 skipped; Shell records 777/777; type checks pass; and the FCoP reference implementation locked at commit `da79dfefd99f597c9e422ce9edec22157f915a21` records 1,210 passed / 2 skipped. These supporting suite counts are context, not additional C01–C14 observations.

**Table 11. Product-level S0.6 verdicts for the I0.8 baseline.**

| Verdict | Criteria |
|---|---|
| PASS | C01, C02, C03, C04, C05, C06, C07, C08, C09, C10, C11, C12, C13, C14 |
| PARTIAL | none |
| NOT RUN | none |
| FAIL | none |

The archive contains a 29-file self-contained public reproducer. In a clean environment, `npm ci` and `npm test` first verify the seven upstream hashes and then execute the bundled CodeFlowMu product Reader with 14/14 PASS. This closes the absence of a public conformance-slice rerun path; it does not publish the full private CodeFlowMu application or constitute an independent rerun.

## 7.4 Interpretation: Closed Implementation Gaps, Open Validation Gap

The I0.6 baseline exposed missing product projection plus concrete C02 and C07 failures and unexecuted C08, C11, and C12 paths. The I0.8 baseline closes those observed implementation gaps for the fixed S0.6 bundle. It also exercises the S0.6 changes most visible at the architecture boundary: C03 retains all contributing source identifiers when byte-identical observations aggregate; C07 requires an authorized approval object, valid assignment, permitted role, approval decision, and independence when configured; C11 uses locale-independent Unicode code-point order.

```text
exact S0.6 normative bytes
          ↓ hash verification
CodeFlowMu V1.6.0 product Reader
          ↓ C01–C14 execution
schema-valid 14/14 result
          ↓ publication
evidence archive + public reproducer
```

**Figure 8. Product-evidence path established by I0.8.**

The dominant remaining gap has therefore moved from product projection to validation independence and external scope. The result remains author-run and fixed-bundle demonstrated evidence. Independent reruns, independent adoption, alternative-profile implementations, representative SME deployment, comparative cost, and measurements of organizational outcomes remain necessary before broader claims are supportable. WP-13 remains a bounded evidence-gating case and does not establish S0.6 conformance or hallucination elimination.
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
