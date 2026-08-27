---
title: "R2 → CodeFlowMu V2.0.4: Evidence-Association Engineering Pack"
date: '2026-08-27'
---

# R2 → CodeFlowMu V2.0.4: Evidence-Association Engineering Pack

Status: **Published**.

This page records one complete research-to-engineering loop. A fixed historical REPORT slice first exposed the fact that lifecycle location does not prove evidence ownership. R2 then became a read-only evidence-association diagnostic. Real tasks exposed false positives in the first implementation. After V2.0.4 tightened the semantics, the same task could move from `active` to `review` and have its evidence relationships recomputed from the formal facts available at each stage.

This is not product certification, and no diagnostic result is promoted into delivery or acceptance.

## 1. Research origin: ten historical REPORT records

Public artifacts:

- [ten deidentified REPORT association records](/assets/evidence/2026-08-27-r2-report-association-fixture.json)
- [public Reader](/assets/evidence/2026-08-27-r2-association-reader.mjs)
- [public check](/assets/evidence/2026-08-27-r2-association-reader-check.mjs)

The fixed sample yields `linked = 4`, `missing = 4`, and `conflict = 2`.

This is not a defect rate. It supports one research finding only: **location is not ownership proof; missing and conflicting evidence must not be repaired by inference.**

Run:

```text
node 2026-08-27-r2-association-reader-check.mjs
```

Expected:

```json
{"fixture":"deidentified_historical_association","counts":{"linked":4,"missing":4,"conflict":2},"status":"PASS"}
```

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

The public article does not reproduce private production source. This page discloses only the semantics required to verify the article's claims.

## 3. Live counterexample: the first diagnostic produced false positives

Real task `TASK-20260827-024` exposed false positives involving revision mismatch, REPORT ownership, missing execution, and missing formal REVIEW.

The live review showed that the diagnostic semantics—not four simultaneous business failures—were responsible:

- values from different revision domains were compared as though they were equivalent;
- child-report parent/reference context was mistaken for direct ownership;
- an attempt already had a formal `session_id`, but a not-yet-materialized SessionStore record was treated as missing execution;
- when both progress and final reports existed, an older report could be selected against the current REVIEW.

V2.0.4 therefore tightened the contract: compare only explicit revisions from the same semantic domain; accept only direct stable keys for REPORT ownership; allow execution projection from formal runtime facts; anchor the current report with `current_final_report_id`; move diagnostic cache identity to schema 3 / `diag3:`.

The recomputed `TASK-20260827-024` scene selected `REPORT-20260827-028-PM-to-ADMIN` and its corresponding REVIEW and returned `linked=6 / missing=0 / conflict=0`.

## 4. Same task, two stages: V2.0.4 dynamic diagnosis

Two first-party local screenshots show the same task:

`TASK-20260827-030-PM-to-QA`

Public structured artifacts:

- [active/review snapshots](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-snapshots.json)
- [two-stage consistency check](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-check.mjs)
- [same-task comparison figure](/assets/figures/2026-08-27-review-status-evidence-association-v204-dynamic.svg)

### `active`

Visible summary: `linked=4 / missing=0 / conflict=0 / observer_only=0`.

Visible linked edges include task revision→attempt, attempt→lease, attempt→execution, and execution→action evidence.

The REPORT edges are not missing:

- `REPORT → Task`: `not_applicable` / `lifecycle_does_not_require_report`
- `REPORT → REVIEW`: `not_applicable` / `report_not_available`

### `review`

After the same task enters review, the visible graph shows:

- attempt→lease: linked
- attempt→execution: linked
- execution→action evidence: linked
- REPORT→Task: linked
- REPORT→REVIEW: linked
- EVAL→REVIEW: `not_applicable` / `eval_not_present`

The UI also exposes copy-reconciliation-summary and refresh-evidence-association actions. Refresh recomputes the diagnostic without driving lifecycle state.

Run:

```text
node 2026-08-27-r2-v204-dynamic-diagnostic-check.mjs
```

Expected:

```json
{"fixture":"first_party_ui_observation_transcript","same_task":true,"transition":"active_to_review","status":"PASS"}
```

## 5. The critical adjudication boundary

The V2.0.4 UI states:

> **This conclusion describes evidence relationships only. It does not mean the task has been delivered or verified successfully.**

Therefore `REPORT → REVIEW = linked` establishes a stable-key relationship only. It does not establish REPORT truthfulness, REVIEW correctness, QA pass, ADMIN acceptance, or eligibility for `done`.

## 6. Public boundary

- The historical `4/4/2` result comes from one fixed ten-record slice.
- The V2.0.4 dynamic scene comes from two first-party local screenshots of the same task; the public artifact is a structured transcript that omits local absolute paths, instance identifiers, and unrelated console content.
- The evidence supports the claim that a research finding entered real engineering and survived counterexample-driven repair. It does not certify all tasks, lifecycle combinations, desktop paths, or PWA paths.
- CodeFlowMu V2.0.4 engineering notes still distinguish an engineering candidate from a formal RELEASED tag; this page does not cross that release boundary.
