# 4. Executed Test Baseline

The formal product command was `npm run test:tmpa:s1.0`. It executed the CodeFlowMu product Reader against the fixed bundle and produced the following aggregate:

```text
TMPA Core: S1.0
Implementation: CodeFlowMu V1.8.0
Product Reader called: true
Reference Reader called: false
PASS: 14
PARTIAL: 0
NOT RUN: 0
FAIL: 0
Aggregate: PASS
```

The S1.0 Reference Reader separately reports 14/14 PASS. Its result validates the author-produced reference path; it is not counted as a CodeFlowMu product result.

# 5. C01–C14 Product Results

| Criterion | Tested behavior | Mandatory assertions | Result |
|---|---|---:|---:|
| C01 | Schema validation and rejection of invalid shapes | 3 | PASS |
| C02 | Primary-carrier and single-writer immutability | 5 | PASS |
| C03 | Duplicate identity handling with source provenance | 5 | PASS |
| C04 | Per-stream continuity and asynchronous progress | 4 | PASS |
| C05 | Role authority evaluation | 5 | PASS |
| C06 | Lifecycle legality and state preservation | 9 | PASS |
| C07 | Separation of duties and human approval authorization | 10 | PASS |
| C08 | Integrity tampering detection | 3 | PASS |
| C09 | Missing-reference treatment | 4 | PASS |
| C10 | Prohibited-cycle detection | 4 | PASS |
| C11 | Aggregation and reconstruction determinism | 4 | PASS |
| C12 | Conflict preservation and explicit resolution | 5 | PASS |
| C13 | Recovery behavior | 5 | PASS |
| C14 | Terminal-history preservation | 5 | PASS |

The 71 recorded assertions were recomputed during publication review. All manifest digests, actual-result digests, input-bundle digest, and the aggregate conformance-result digest matched the package records.

# 6. S0.6 to S1.0 Engineering Delta

## 6.1 Stable machine identity

S1.0 reissues the reviewed S0.6 behavior under stable S1.0 schema identifiers, Profile identities, canonicalization identity, and executable corpus paths. CodeFlowMu V1.8.0 binds its validator and Reader to those identities rather than treating an older-Core result as evidence for S1.0.

## 6.2 Product-level projection

The product runner imports the exact S1.0 bundle, validates the lifecycle Profile through the CodeFlowMu protocol surface, creates the CodeFlowMu `GovernanceReader`, and passes FCoP-derived source candidates through the product path. The Reference Reader module is retained in the bundle for traceability but is not imported or called by the product runner.

## 6.3 Regression alignment without criterion weakening

The retained pre-fix Runtime run reported 1,520 passed, 2 failed, and 1 skipped. The failures were stale expectations for V1.7 wording and for the distinction between QA execution completion and a failing business verdict. Tests were aligned to the already implemented contract; no S1.0 schema, fixture, mandatory assertion, Reader behavior, or pass criterion was weakened.

A later isolated wake-endpoint failure passed five immediate repetitions. One full run also stalled in `TaskDispatcher.test.ts`; the exact child process was terminated, and a bounded audit then reported 29 passed / 0 failed. These records remain in the package rather than being erased.

# 7. Regression and Reproducer Results

| Surface | Final result | Interpretation |
|---|---:|---|
| CodeFlowMu TMPA Runtime suite | 24 passed / 0 failed | Product Reader unit and integration surface |
| CodeFlowMu Runtime full suite | 1,522 passed / 0 failed / 1 skipped | Final full run |
| Runtime batched coverage | 207/207 files; 1,522 passed / 0 failed / 1 skipped | Exact file coverage confirmation |
| CodeFlowMu Shell batched coverage | 791 passed / 0 failed | Exact 8-batch execution |
| Protocol validation and typecheck | exit 0 | Schema and validator surface |
| FCoP locked reference implementation | 1,210 passed / 2 skipped | Dependency regression; not a substitute for product Reader |
| Reduced clean-machine reproducer | 14/14 PASS | `npm ci` plus exact S1.0 product runner |

The reproducer initially excluded an entire Protocol schemas directory and therefore also removed the required S1.0 schemas. That reduced-scope attempt is retained as a failure. The corrected reproducer excludes only unrelated legacy material, retains `schemas/tmpa`, installs from the lock file, and executes the same product runner successfully.

# 8. Retained WP-13 Evidence-Gating Case

WP-13 is retained as a field-oriented example of multi-agent fact checking with executor/reviewer separation, evidence admission, audit records, and explicit lifecycle boundaries. Its evidence package supports the bounded conclusion that development completed and role-separated QA passed for the captured task state. It also records that later task snapshots were still `review` and `pending`, that a scheduled date was advanced without a separately located approval artifact, and that runtime binding and signed checksums were outside the package boundary.

WP-13 illustrates why TMPA separates execution evidence, review evidence, authorization, lifecycle state, and publication claims. It is not one of the S1.0 C01–C14 product fixtures. It does not prove the theory, independently validate CodeFlowMu, or prove that multi-agent systems cannot hallucinate.
