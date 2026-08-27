---
title: "R2 → CodeFlowMu V2.0.4: Evidence-Association Engineering Pack"
date: '2026-08-27'
---

# R2 → CodeFlowMu V2.0.4: Evidence-Association Engineering Pack

Status: **Published**.

This page records a complete research-to-engineering path. A fixed historical REPORT slice first established that lifecycle location does not prove evidence ownership. R2 was then implemented as a read-only evidence-association diagnostic. Real task data was used during development to calibrate revision semantics, REPORT ownership, execution projection, and the formal final-REPORT anchor. The completed capability entered the formally released CodeFlowMu V2.0.4 and was then observed on the same QA task across `active → review`.

This is not product certification, and no evidence-association result is promoted into delivery or acceptance.

## 1. Research origin: ten historical REPORT records

Public artifacts:

- [ten deidentified REPORT association records](/assets/evidence/2026-08-27-r2-report-association-fixture.json)
- [public Reader](/assets/evidence/2026-08-27-r2-association-reader.mjs)
- [public check](/assets/evidence/2026-08-27-r2-association-reader-check.mjs)

The fixed sample yields `linked = 4`, `missing = 4`, and `conflict = 2`.

This is not a defect rate. It supports one research finding: **location is not ownership proof, and missing or conflicting evidence must not be repaired by inference.**

## 2. Engineering translation: R2 becomes a read-only association diagnostic

The V2.0.4 first-party implementation decomposes the chain into explicit edges such as:

```text
TASK / revision → attempt → lease
                    └→ execution → action evidence
REPORT → Task
REPORT → REVIEW
EVAL → REVIEW
```

The diagnostic reads formal sources and produces a derived snapshot. Its API returns `diagnostic_only: true`. Reader failure does not change formal state, and the diagnostic queue is built from real conflict snapshots rather than every absent or not-applicable edge.

## 3. Real-task calibration during development

`TASK-20260827-024` is used here as a development-stage calibration case, not as a released-product failure case.

The live task data helped tighten several contracts:

- values from different revision domains must not be compared as one business revision;
- parent-task and linked-task context must not automatically become direct REPORT ownership;
- when an attempt already has a formal `session_id` and matching runtime facts, one not-yet-materialized store must not by itself define execution absence;
- when progress and final reports coexist, `current_final_report_id` provides the current formal REPORT anchor;
- diagnostic cache identity moved to schema 3 / `diag3:` so current semantics are recomputed consistently.

These are normal engineering-convergence decisions for a new diagnostic capability: define what is comparable, what establishes a relation, and what must remain unknown or not applicable.

## 4. V2.0.4 formal-release live validation: the same QA task from `active` to `review`

Two local UI views show the same task:

`TASK-20260827-030-PM-to-QA`

This is a **QA task** and a first-party observation of the completed V2.0.4 capability after formal release.

Public structured artifacts:

- [active/review snapshots](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-snapshots.json)
- [two-stage consistency check](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-check.mjs)

The author will add the raw UI screenshots separately as first-party page evidence.

### `active`

Visible summary: `linked=4 / missing=0 / conflict=0 / observer_only=0`.

Visible linked edges include task revision→attempt, attempt→lease, attempt→execution, and execution→action evidence.

No formal REPORT exists yet, so the REPORT edges are correctly **not applicable**, not missing:

- `REPORT → Task`: `not_applicable` / `lifecycle_does_not_require_report`
- `REPORT → REVIEW`: `not_applicable` / `report_not_available`

The important result is `missing=0 / conflict=0`: no REPORT is normal at this stage.

### `review`

After the same task enters review, the formal REPORT and REVIEW exist and the graph correctly shows:

- attempt→lease: linked
- attempt→execution: linked
- execution→action evidence: linked
- REPORT→Task: linked
- REPORT→REVIEW: linked

`EVAL → REVIEW` remains:

- `not_applicable` / `eval_not_present`

That is also correct, not missing. This is a QA task; in the current workflow EVAL belongs to the PM path, so this QA task is not expected to carry an EVAL report.

The pair therefore shows the intended dynamic behavior: evidence requirements change with lifecycle stage and role, and the diagnostic changes with the formal facts rather than forcing every edge into linked or missing.

## 5. The critical adjudication boundary

The V2.0.4 UI states:

> **This conclusion describes evidence relationships only. It does not mean the task has been delivered or verified successfully.**

Therefore `REPORT → REVIEW = linked` establishes a stable-key relationship only. It does not establish REPORT truthfulness, REVIEW correctness, QA pass, ADMIN acceptance, or eligibility for `done`.

## 6. Public boundary

- The historical `4/4/2` result comes from one fixed ten-record slice.
- `TASK-20260827-024` is used only for development-stage semantic calibration, not as a released-product failure narrative.
- `TASK-20260827-030-PM-to-QA` is a first-party V2.0.4 same-task `active → review` observation after the capability was formally released.
- The raw UI screenshots will be added separately by the author; the current structured artifacts preserve stage, visible edge status, and reason code.
- The evidence supports the disclosed research-to-engineering path and dynamic diagnostic semantics. It does not certify all tasks, lifecycle combinations, desktop paths, or PWA paths.
