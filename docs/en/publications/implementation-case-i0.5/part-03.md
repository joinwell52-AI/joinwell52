# 7. Criterion-Level Results

The test names and meanings below are direct references to Core Specification Section 10.2; this report records only product evidence and remaining gaps.

| ID | Canonical test name | Verdict | Product evidence and remaining gap |
|---|---|---|---|
| C01 | Schema validation | PARTIAL | FCoP and CodeFlowMu provide schemas and validation paths, but complete TMPA canonical-object coverage and all negative format cases are not yet exposed through one Core validator. |
| C02 | Primary-carrier and single-writer immutability | PARTIAL | Separate artifacts and correction evidence exist; stricter immutable-object and one-primary-carrier observation remains incomplete. |
| C03 | Duplicate object identity | PARTIAL | Duplicate and conflict mechanisms exist locally, but a canonical same-ID/different-content quarantine view is not exposed end to end. |
| C04 | Serial-stream continuity and asynchronous progress | PARTIAL | Local ordering, dependency waiting, and asynchronous progress are implemented; one canonical partial-order graph and stream-gap issue set are not yet emitted. |
| C05 | Role authority | PARTIAL | Role, capability, and operation gates exist; all failures are not yet normalized into one authoritative TMPA issue model. |
| C06 | Lifecycle legality | PARTIAL | Direct lifecycle tests cover illegal and unauthorized transitions, but the product evidence does not yet emit both required canonical outputs: `ILLEGAL_TRANSITION`/`invalid` and `LIFECYCLE_UNDETERMINED`/`undetermined`. |
| C07 | Separation of duties | PARTIAL | Separate reports and reviews plus review gates exist, but complete identity-level separation and exception-object handling are not fully demonstrated. |
| C08 | Integrity tampering | NOT RUN | Fixture oracle exists; product covered-content digest verification and canonical tamper reader were not executed. |
| C09 | Missing reference | PARTIAL | Missing dependencies can block work, but the complete `undetermined`/partial graph propagation and canonical issue output remain incomplete. |
| C10 | Prohibited cycle | NOT RUN | Prohibited-cycle fixture exists; product graph reader capable of quarantining only the affected subgraph was not available. |
| C11 | Aggregation and reconstruction determinism | NOT RUN | The fixture oracle produced byte-equivalent output across 24 permutations; no product-level canonical graph-plus-issue serializer was available. |
| C12 | Conflict preservation | NOT RUN | Conflict-preservation fixture exists; product-level deterministic disputed/`undetermined` view and authorized resolution path were not executed as one criterion. |
| C13 | Recovery | PARTIAL | Restart and recovery mechanisms exist, but no unified fresh reader reconstructs all responsibility, lifecycle, dependency, and issue state. |
| C14 | Terminal-history preservation | PASS | Direct archive/history tests preserve terminal state, transitions, prior reports, reviews, and task evidence. |

The separate S0.4 Reference Reader track passes all 14 synthetic fixture assertions. Those results validate the executable interpretation and deterministic runner, not the products listed in the table.

# 8. Product Projection Gap

The publication repository now contains a generic S0.4 read-only Reference Reader. The dominant product gap is therefore narrower and more concrete: neither pinned product has a maintained projection adapter that converts its native artifacts into the S0.4 source-object surface consumed by that reader.

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

FCoP and CodeFlowMu already provide substantial write-side and local-control mechanisms: separate artifacts, atomic publication, role checks, lifecycle gates, dependency blocking, archive preservation, and restart recovery. Product-specific projection would directly improve C03, C05, C09, and C13, provide infrastructure for C04/C07, and create the product execution path required by C10–C12. C01 still has schema-coverage gaps; C02 has a stricter immutability gap; C06 lacks the complete canonical three-valued output pair; C08 requires covered-content digest evidence. CodeFlowMu additionally needs a publicly retrievable pinned source or reproduction package.

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

The S0.4 Reference Reader demonstrates this three-valued flow on synthetic fixtures. Current CodeFlowMu behavior includes human-attention and waiting states, but product normalization into the Core judgment/view model remains an implementation target rather than a fully demonstrated product claim.

# 10. WP-13: Multi-Agent Evidence Gating under Uncertain Tool Results

## 10.1 Research Question and Unit of Observation

WP-13 records a field event with direct relevance to TMPA three-valued governance. A subexecution produced a completion-meaning summary after its tool lifecycle ended, while the same raw event retained `no exit status`, unconfirmed tests, and an unavailable commit SHA. The research question is not why a model produced an inaccurate sentence. It is:

> When an agent claim and persistent work facts do not close, can multi-agent governance prevent the unverified claim from entering the authoritative delivery chain?

The observation window is 2026-08-05 12:59–13:11 (Asia/Shanghai). The public evidence set preserves two tasks, DEV and QA reports, the raw subexecution JSONL, a 300-line runtime excerpt, a Git patch and manifest, five QA JSON files, a session transcript, and explicit boundary notes. It is author-produced engineering evidence, not a third-party audit.

## 10.2 From Unconfirmed Claim to Reviewable Delivery

| Stage | Observable fact | Governance result |
|---|---|---|
| DEV subexecution | the tool event ended, but inner commands lacked confirmed exit status; tests and SHA were unconfirmed | tool completion did not establish business completion |
| PM fact check | no formal DEV report, required test files absent, and Git HEAD still at the previous work package | no release, no QA dispatch, and no duplicate task |
| Same-task recovery | after tool-channel recovery, DEV completed implementation, tests, commit `609571dd…`, and `REPORT-037` | delivery acquired externally checkable facts |
| Role-separated QA | `QA-01` reran 27 tests, typecheck, and diff check against `DEV-01` delivery | 27/27 PASS; typecheck 0; diff check 0 |

This chain does not show that the model ceased making errors. It demonstrates **governance-layer containment**: natural-language claims remain candidate evidence, and they do not change authoritative delivery state until task, report, Git, and test facts close.

## 10.3 TMPA Three-Valued Interpretation

In a retrospective S0.4 analysis of observation time `τ₀`, the conclusion "WP-13 is complete" should not be `valid`, because mandatory evidence was absent or unreadable. It should not automatically be `invalid`, because the implementation itself had not yet been proven to violate acceptance rules. The appropriate semantic value is `undetermined`, with a `partial` operational view; PM waits for evidence and does not release.

This is an analytical S0.4 projection of field evidence, not a claim that CodeFlowMu emitted a canonical Reader envelope at the time. The native system did not publish `LIFECYCLE_UNDETERMINED`, a canonical issue set, and a three-valued result bound to a fixed profile. The case therefore does not upgrade C06 to PASS.

## 10.4 TMPA to FCoP to CodeFlowMu

| Layer | Realization in this case |
|---|---|
| TMPA | separates claims, evidence, and authoritative judgment; incomplete mandatory evidence remains `undetermined` |
| FCoP | TASK is the stable primary carrier, REPORT is published separately, and `references`/`depends_on` retain task-report relations |
| CodeFlowMu | runtime records tool events and task state; PM performs business fact checking; DEV resumes the original task; QA verifies under a separate role |

| Evidence dimension | Specified | Implemented | Demonstrated | Independently Adopted |
|---|---|---|---|---|
| three-valued judgment under incomplete evidence | S0.4 | local waiting/review controls exist | WP-13 retrospective analysis | no |
| persistent TASK/REPORT fact chain | FCoP profile | yes | yes | no |
| DEV–PM–QA separation of duties | S0.4/FCoP profile | yes | `DEV-01`/PM/`QA-01` | no |
| same-task recovery and evidence completion | S0.4 recovery objective | yes | yes | no |
| WP-13 product projection adapter and canonical Reader output | S0.4 | no | no | no |

## 10.5 Contribution to C01–C14 Evidence

| Criterion | Incremental WP-13 evidence | I0.5 verdict effect |
|---|---|---|
| C04 | TASK-019 → REPORT-037 → TASK-020 → REPORT-038 plus runtime events form a traceable serial chain | strengthens demonstrated evidence; remains PARTIAL |
| C06 | authoritative delivery state does not advance while mandatory evidence is insufficient | no canonical issue code or Reader result; remains PARTIAL |
| C07 | DEV delivery, PM fact checking, and QA verification occur under separate work roles | field demonstration of role separation; authenticated identity and exception objects remain missing, so PARTIAL |
| C09 | required report, commit, and test evidence is missing at the intermediate observation | supports incomplete-evidence analysis but emits no canonical `MISSING_REFERENCE`; remains PARTIAL |
| C13 | after tool recovery, the original task continues and adds Git, report, and QA evidence | strengthens recovery evidence; no fresh-reader equivalence, so PARTIAL |
| C08/C11/C12 | unsigned checksums, raw/readable projection comparison, and retained conflicting claims are supporting materials | do not substitute for product-criterion execution; remain NOT RUN |

The case adds no adjudicable evidence for the remaining criteria. I0.5 therefore preserves the I0.4 aggregate product result and does not relabel prior unexecuted criteria.

## 10.6 Evidence Boundaries

- QA is role-separated verification, not external third-party independent validation.
- `dev-report-037.md` and `qa-report-038.md` retain `runtime_bound: False`; they are not runtime-authenticated evidence.
- At the evidence snapshot endpoint, TASK-019 and TASK-020 are both `review / pending`. The package establishes DEV delivery and role-separated QA PASS, not terminal approval or archive within the snapshot.
- Same-bundle unsigned checksums establish only internal consistency, not publisher identity, source authenticity, or a trusted timestamp.
- The case demonstrates containment of an unverified completion claim, not prevention or elimination of all model hallucinations.

The complete byte-preserved package is downloadable as [WP-13 Publication Evidence V3](/evidence/tmpa/i0.5/wp13-multi-agent-fact-check-publication-evidence-v3.zip), with outer SHA-256 `5b5eda3034c822f13421783244b1d0c76a9fa79950bfad0ce61bb8d2e404131c`.

# 11. Reproducibility and Limitations

The S0.4 corpus is now public at a stable repository path and includes one-command execution, schemas, profile, fixtures, assertions, outputs, logs, and SHA-256 manifests. Repeated local executions with the fixed execution timestamp produce byte-identical artifacts. The FCoP commit was independently retrieved within this maintenance run and its selected test suites reran successfully; the CodeFlowMu commit was unavailable from the public repository. No third party has rerun or independently validated the corpus.

The baseline does not establish representative SME performance, comparative deployment cost, broad fault tolerance, independent adoption, factual truth of participant claims, authenticated identity, protected storage, or Byzantine resilience. Product and case evidence remain author-produced. The public demonstration and private data-producing system are not asserted to be one reproducible public build.

Required next measurements include installation dependencies and time, first-team startup, CPU/memory/storage growth, reconstruction under delayed and permuted evidence, controlled interruption and restart, conflict and missing-reference injection, human inspectability, adoption burden, and comparison against chat/shared-folder/simple-workflow baselines.

# 12. Engineering Roadmap

1. Implement maintained FCoP and CodeFlowMu projection adapters without changing existing write behavior.
2. Publish or otherwise make the pinned CodeFlowMu source and reproduction package retrievable.
3. Execute product-level C08, C10, C11, and C12.
4. Emit the missing canonical outputs for C01–C07, C09, and C13, including both C06 three-valued branches.
5. Measure low-resource deployment, restart, and incremental reconstruction.
6. Obtain an independent rerun and record all differences.

# 13. Evidence Statement

This report provides versioned engineering evidence, not independent validation. Its strongest results are bounded: the public S0.4 Reference Reader passes 14 of 14 synthetic criteria; the pinned product baseline has C14 PASS, nine PARTIAL verdicts, four NOT RUN verdicts, and no observed FAIL. Zero FAIL does not mean complete conformance because four product criteria were not executed and nine remain incomplete. Stronger claims require product projection, CodeFlowMu reproducibility, broader experiments, and independent reproduction.
