---
title: "R2 → CodeFlowMu V2.0.4: Evidence-Association Engineering Pack"
date: '2026-08-27'
---

# R2 → CodeFlowMu V2.0.4: Evidence-Association Engineering Pack

Status: **Published**.

This page records a complete research-to-engineering loop. A fixed historical REPORT slice first exposed the fact that lifecycle location does not prove evidence ownership. R2 then became a read-only evidence-association diagnostic. The first live implementation produced false positives. After V2.0.4 tightened the semantics, a different real QA task provided a positive validation: as the same task moved from `active` to `review`, the diagnosis changed with the lifecycle and did not turn normal not-applicable edges into missing or conflict states within the visible evidence scope.

This is not product certification, and no diagnostic result is promoted into delivery or acceptance.

## 1. Research origin: ten historical REPORT records

Public artifacts:

- [ten deidentified REPORT association records](/assets/evidence/2026-08-27-r2-report-association-fixture.json)
- [public Reader](/assets/evidence/2026-08-27-r2-association-reader.mjs)
- [public check](/assets/evidence/2026-08-27-r2-association-reader-check.mjs)

The fixed sample yields `linked = 4`, `missing = 4`, and `conflict = 2`.

This is not a defect rate. It supports one research finding only: **location is not ownership proof; missing and conflicting evidence must not be repaired by inference.**

## 2. Engineering translation: R2 becomes a read-only association diagnostic

The V2.0.4 first-party implementation decomposes the evidence chain into explicit edges such as:

```text
TASK / revision → attempt → lease
                    └→ execution → action evidence
REPORT → Task
REPORT → REVIEW
EVAL → REVIEW
```

The diagnostic reads formal sources and produces a derived snapshot. Its API returns `diagnostic_only: true`. Reader failure does not change formal state, and the diagnostic queue is built from snapshots whose conflict count is greater than zero.

## 3. Counterexample scene: the first diagnostic produced false positives

Real task `TASK-20260827-024` exposed false positives involving revision mismatch, REPORT ownership, missing execution, and missing formal REVIEW.

The live review showed that the diagnostic semantics—not four simultaneous business failures—were responsible:

- values from different revision domains were compared as though they were equivalent;
- child-report parent/reference context was mistaken for direct ownership;
- an attempt already had a formal `session_id`, but a not-yet-materialized SessionStore record was treated as missing execution;
- when both progress and final reports existed, an older report could be selected against the current REVIEW.

V2.0.4 therefore tightened the contract: compare only explicit revisions from the same semantic domain; accept only direct stable keys for REPORT ownership; allow execution projection from formal runtime facts; anchor the current report with `current_final_report_id`; move diagnostic cache identity to schema 3 / `diag3:`.

The recomputed `TASK-20260827-024` scene selected `REPORT-20260827-028-PM-to-ADMIN` and its corresponding REVIEW and returned `linked=6 / missing=0 / conflict=0`.

## 4. Positive validation scene: the same QA task from `active` to `review`

Two first-party local screenshots show the same task:

`TASK-20260827-030-PM-to-QA`

This is a **QA task**. These screenshots are not a false-positive scene; they are a post-fix positive validation of V2.0.4.

Public structured artifacts:

- [active/review snapshots](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-snapshots.json)
- [two-stage consistency check](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-check.mjs)
- [same-task comparison figure](/assets/figures/2026-08-27-review-status-evidence-association-v204-dynamic.svg)

### `active`

Visible summary: `linked=4 / missing=0 / conflict=0 / observer_only=0`.

Visible linked edges include task revision→attempt, attempt→lease, attempt→execution, and execution→action evidence.

No formal REPORT exists yet, so the REPORT edges are correctly **not applicable**, not missing:

- `REPORT → Task`: `not_applicable` / `lifecycle_does_not_require_report`
- `REPORT → REVIEW`: `not_applicable` / `report_not_available`

The important result here is `missing=0 / conflict=0`: the absence of a REPORT is normal for this stage and is not reported as a defect.

### `review`

After the same task enters review, the formal REPORT and REVIEW exist and the graph correctly shows:

- attempt→lease: linked
- attempt→execution: linked
- execution→action evidence: linked
- REPORT→Task: linked
- REPORT→REVIEW: linked

`EVAL → REVIEW` remains:

- `not_applicable` / `eval_not_present`

That is also correct, not missing. This is a QA task; in the current workflow, EVAL is produced on the PM path, so this QA task is not expected to carry an EVAL report.

The pair therefore shows the intended dynamic behavior: REPORT edges remain not applicable while the task is active, become linked when review evidence appears, and the non-required EVAL edge stays not applicable.

Run:

```text
node 2026-08-27-r2-v204-dynamic-diagnostic-check.mjs
```

Expected:

```json
{"fixture":"first_party_ui_observation_transcript","same_task":true,"role":"QA","transition":"active_to_review","no_visible_false_positive":true,"status":"PASS"}
```

## 5. The critical adjudication boundary

The V2.0.4 UI states:

> **This conclusion describes evidence relationships only. It does not mean the task has been delivered or verified successfully.**

Therefore `REPORT → REVIEW = linked` establishes a stable-key relationship only. It does not establish REPORT truthfulness, REVIEW correctness, QA pass, ADMIN acceptance, or eligibility for `done`.

## 6. Public boundary

- The historical `4/4/2` result comes from one fixed ten-record slice.
- `TASK-20260827-024` is the first-implementation false-positive counterexample; `TASK-20260827-030-PM-to-QA` is the V2.0.4 post-fix positive validation. They must not be conflated.
- The V2.0.4 dynamic scene comes from two first-party local screenshots of the same task; the public artifact is a structured transcript that omits local absolute paths, instance identifiers, and unrelated console content.
- “No false positive” is scoped only to the visible edges and stage semantics in these screenshots. It is not certification of all tasks, lifecycle combinations, desktop paths, or PWA paths.
- CodeFlowMu V2.0.4 engineering notes still distinguish an engineering candidate from a formal RELEASED tag; this page does not cross that release boundary.
