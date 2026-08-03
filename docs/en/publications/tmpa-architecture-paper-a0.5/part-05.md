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
# 7. Evaluation Results

The separately maintained [TMPA Core Specification S0.4](/en/publications/tmpa-core-specification-s0.4) remains the sole normative source for C01–C14 and all SHALL/MUST clauses. Detailed engineering evidence and criterion verdicts belong to the [Implementation Case Report I0.4](/en/publications/implementation-case-i0.4). This section evaluates the research questions without reproducing the specification.

## 7.1 Findings by Research Question

| Research question | Finding and evidence | Boundary |
|---|---|---|
| RQ1: governance-state sufficiency | ordinary conversation and execution surfaces do not, by themselves, preserve enough explicit authority, lifecycle, conflict, and recovery state for deterministic governance reconstruction; supported by problem diagnosis, DR1–DR8, and object/reconstruction analysis | no comparative field experiment has measured failure rates against alternative architectures |
| RQ2: minimum architecture | stable carriers, single-writer streams, explicit authority and lifecycle, typed references, three-valued judgment, and source-preserving deterministic reconstruction form a coherent minimum contract; supported by invariants, counterexamples, the determinism proof sketch, and Core S0.4 | the proof is not mechanized, and minimality is an architectural argument rather than a universal lower-bound proof |
| RQ3: engineering feasibility and boundary | FCoP, CodeFlowMu, and XiaoDian provide bounded evidence that substantial parts of the contract can operate in project-visible infrastructure; supported by reference mapping, operational cases, and the pinned C01–C14 baseline | full conformance, independent adoption, comparative SME burden, and cross-profile portability are not established |

The result is therefore strongest for architectural coherence and bounded implementation feasibility. It is weaker for organizational effectiveness and ecosystem generalization, which require independent and comparative evidence.

## 7.2 Conformance-Domain Summary

The baseline is summarized by architectural domain; exact criterion definitions remain in Core S0.4 §10.2.

| Domain | Criteria | Product-level result |
|---|---|---|
| object, immutability, and integrity | C01, C02, C03, C08 | 3 PARTIAL; 1 NOT RUN |
| authority and lifecycle | C05, C06, C07 | 3 PARTIAL |
| ordering, reference, and conflict | C04, C09, C10, C12 | 2 PARTIAL; 2 NOT RUN |
| determinism, recovery, and history | C11, C13, C14 | 1 PASS; 1 PARTIAL; 1 NOT RUN |

These are product-level results for the pinned revisions, not a declaration of full Core, profile, or authenticated-governance conformance.

## 7.3 S0.4 Re-adjudication of the Pinned Baseline

I0.4 publishes the S0.4 corpus `tmpa-s0.4-fcop-codeflowmu-20260803` [28]. It retains the pinned FCoP package `3.2.4` commit `da79dfefd99f597c9e422ce9edec22157f915a21`, CodeFlowMu `V1.2.3` commit `8f342d028eb66e77d135bea58fdbc7f2d0627e3b`, and bounded XiaoDian evidence, but separates Reference Reader fixtures from product verdicts.

The FCoP commit was directly retrieved and selected suites reran with 1,137 passed, 2 skipped, and 0 failed. The CodeFlowMu commit was not retrievable from the public `CodeFlowMu-open` history, so no fresh CodeFlowMu product execution is claimed. The public S0.4 Reference Reader passes all 14 synthetic fixtures; those passes are not product passes.

The product-level verdicts are:

| Verdict | Criteria |
|---|---|
| PASS | C14 |
| PARTIAL | C01, C02, C03, C04, C05, C06, C07, C09, C13 |
| NOT RUN | C08, C10, C11, C12 |

No executed product criterion failed. That statement is limited to executed paths and is not “zero-failure full conformance.” C06 is PARTIAL under S0.4 because preserved product evidence does not emit both `ILLEGAL_TRANSITION`/`invalid` and `LIFECYCLE_UNDETERMINED`/`undetermined`.

## 7.4 Interpretation: Product Projection Gap

The nine partial verdicts share a dominant implementation gap. A generic S0.4 read-only Reference Reader now exists, while FCoP and CodeFlowMu do not expose maintained projection adapters that normalize their native evidence into:

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

Product projection would directly improve C03, C05, C09, and C13 and provide infrastructure for C04 and C07. It would also create the product execution path required by C10–C12. C01 still has schema-coverage gaps, C02 has a stricter immutability gap, C06 lacks complete canonical three-valued outputs, and C08 requires covered-content digest evidence.

The corpus and baseline are author-produced. The corpus is now public, but an independent rerun is still required before any independently validated claim.
# 8. Discussion, Limitations, and Threats to Validity

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
