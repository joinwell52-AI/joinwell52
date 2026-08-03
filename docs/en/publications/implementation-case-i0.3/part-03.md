# 7. Criterion-Level Results

The test names and meanings below are direct references to Core Specification Section 10.2; this report records only product evidence and remaining gaps.

| ID | Canonical test name | Verdict | Product evidence and remaining gap |
|---|---|---|---|
| C01 | Schema validation | PARTIAL | FCoP and CodeFlowMu provide schemas and validation paths, but complete TMPA canonical-object coverage and all negative format cases are not yet exposed through one Core validator. |
| C02 | Primary-carrier and single-writer immutability | PARTIAL | Separate artifacts and correction evidence exist; stricter immutable-object and one-primary-carrier observation remains incomplete. |
| C03 | Duplicate object identity | PARTIAL | Duplicate and conflict mechanisms exist locally, but a canonical same-ID/different-content quarantine view is not exposed end to end. |
| C04 | Serial-stream continuity and asynchronous progress | PARTIAL | Local ordering, dependency waiting, and asynchronous progress are implemented; one canonical partial-order graph and stream-gap issue set are not yet emitted. |
| C05 | Role authority | PARTIAL | Role, capability, and operation gates exist; all failures are not yet normalized into one authoritative TMPA issue model. |
| C06 | Lifecycle legality | PASS | Direct lifecycle tests show illegal or unauthorized transitions remain observable and do not change authoritative state. |
| C07 | Separation of duties | PARTIAL | Separate reports and reviews plus review gates exist, but complete identity-level separation and exception-object handling are not fully demonstrated. |
| C08 | Integrity tampering | NOT RUN | Fixture oracle exists; product covered-content digest verification and canonical tamper reader were not executed. |
| C09 | Missing reference | PARTIAL | Missing dependencies can block work, but the complete `undetermined`/partial graph propagation and canonical issue output remain incomplete. |
| C10 | Prohibited cycle | NOT RUN | Prohibited-cycle fixture exists; product graph reader capable of quarantining only the affected subgraph was not available. |
| C11 | Aggregation and reconstruction determinism | NOT RUN | The fixture oracle produced byte-equivalent output across 24 permutations; no product-level canonical graph-plus-issue serializer was available. |
| C12 | Conflict preservation | NOT RUN | Conflict-preservation fixture exists; product-level deterministic disputed/`undetermined` view and authorized resolution path were not executed as one criterion. |
| C13 | Recovery | PARTIAL | Restart and recovery mechanisms exist, but no unified fresh reader reconstructs all responsibility, lifecycle, dependency, and issue state. |
| C14 | Terminal-history preservation | PASS | Direct archive/history tests preserve terminal state, transitions, prior reports, reviews, and task evidence. |

All 14 fixture oracles matched their expected outputs. Fixture consistency is necessary for the corpus but does not substitute for product execution.

# 8. Shared Read-Side Gap

The dominant common cause of the PARTIAL and NOT RUN verdicts is the absence of a unified read-only evidence-graph adapter:

```text
source artifacts
      ↓
source candidates with retained provenance
      ↓
canonical candidate set
      ↓
partial-order process and responsibility graph
      ↓
canonical issue set
      ↓
valid / invalid / undetermined judgment
      ↓
authoritative / quarantined / partial / disputed / pending_human view
```

FCoP and CodeFlowMu already provide substantial write-side and local-control mechanisms: separate artifacts, atomic publication, role checks, lifecycle gates, dependency blocking, archive preservation, and restart recovery. The missing adapter would directly improve C03, C05, C09, and C13, provide infrastructure for C04/C07, and create the product execution path required by C10–C12. C01 still has schema-coverage gaps; C02 has a stricter immutability gap; C08 requires a covered-content digest reader.

# 9. Three-Valued Governance in the Worked Flow

TMPA distinguishes semantic judgment from view classification:

| Semantic judgment | View classification | Meaning |
|---|---|---|
| `valid` | authoritative | required evidence and rules establish the conclusion |
| `invalid` | quarantined or rejected | a deterministic violation excludes the affected evidence or action |
| `undetermined` | partial | required evidence is missing or incomplete |
| `undetermined` | disputed | valid evidence conflicts and no authorized resolution exists |
| `undetermined` | pending_human | the applicable profile requires a human decision |

A representative review flow is:

```text
TASK → REPORT → QA REVIEW(needs_human)
                       ↓
          judgment: undetermined
          view: pending_human
          lifecycle: blocked_pending_resolution
                       ↓
              ADMIN DECISION
             ↙              ↘
        approve             reject
          ↓                   ↓
        valid              invalid
```

The `needs_human` state remains present in the graph and queryable. It is not prematurely represented as done, approved, failed, or rejected. Any downstream object that depends on the unresolved review remains `undetermined` until an authorized decision object is added.

Current CodeFlowMu behavior includes human-attention and waiting states, but complete normalization into this TMPA Core judgment/view model remains an implementation target rather than a fully demonstrated product claim.

# 10. Reproducibility and Limitations

The corpus pins implementations, selected field evidence, environment, commands, logs, fixtures, and hashes. It still requires a stable public archive, release checksum, one-command independent setup, and third-party rerun.

The baseline does not establish representative SME performance, comparative deployment cost, broad fault tolerance, independent adoption, factual truth of participant claims, authenticated identity, protected storage, or Byzantine resilience. Product and case evidence remain author-produced. The public demonstration and private data-producing system are not asserted to be one reproducible public build.

Required next measurements include installation dependencies and time, first-team startup, CPU/memory/storage growth, reconstruction under delayed and permuted evidence, controlled interruption and restart, conflict and missing-reference injection, human inspectability, adoption burden, and comparison against chat/shared-folder/simple-workflow baselines.

# 11. Engineering Roadmap

1. Implement a read-only evidence-graph adapter without changing existing write behavior.
2. Emit canonical candidate, graph, issue, and three-valued judgment outputs.
3. Execute product-level C08/C10/C11/C12.
4. Complete partial observation surfaces for C01–C05, C07, C09, and C13.
5. Publish the conformance corpus with checksums and reproduction instructions.
6. Measure low-resource deployment, restart, and incremental reconstruction.
7. Obtain an independent rerun and record all differences.

# 12. Evidence Statement

This report provides versioned engineering evidence, not independent validation. Its strongest result is a reproducible boundary statement: at the pinned revisions and selected test paths, C06 and C14 pass; eight criteria have meaningful but incomplete product evidence; four criteria have fixture oracles but no product-reader execution path; no directly executed gating criterion failed. Stronger claims require the missing read-side adapter, broader experiments, and independent reproduction.
