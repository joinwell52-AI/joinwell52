---
title: "From ‘Evidence Must Not Be Cross-Booked’ to Dynamic Diagnosis: How CodeFlowMu V2.0.4 Turned a Research Finding into an Engineering Capability"
date: '2026-08-27'
column: open-source-engineering
category: daily
article_type: engineering-case-study
edition: research-center
research_question: "How can a research finding about evidence ownership become a read-only, lifecycle-aware diagnostic through implementation, real-task calibration, and production validation?"
summary: "R2 began with ten historical REPORT records and one finding: lifecycle location does not prove evidence ownership. That principle entered CodeFlowMu, was calibrated against real task data during development, and became a dynamic evidence-association diagnostic in the formally released V2.0.4."
sources: "/en/research/evidence/2026-08-27-r2-v204-evidence-association"
project_relevance: first-party-research
item_id: "RSEM-20260827-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-27-review-status-evidence-association-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-27-review-status-evidence-association-cover.png"
  kicker="Open-Source Engineering · Engineering Research"
  title="From ‘Evidence Must Not Be Cross-Booked’ to Dynamic Diagnosis: How CodeFlowMu V2.0.4 Turned a Research Finding into an Engineering Capability"
  summary="This capability began as an evidence-ownership research question, moved through implementation and real-task calibration, and became a lifecycle-aware diagnostic in the formally released V2.0.4."
  version="RSEM-20260827-02"
  status="Engineering Research · 2026-08-27"
  languageHref="/zh/engineering/2026-08-27-review-status-evidence-association"
  languageLabel="中文"
/>

# From “Evidence Must Not Be Cross-Booked” to Dynamic Diagnosis: How CodeFlowMu V2.0.4 Turned a Research Finding into an Engineering Capability

R2 began with a small question: **if a task is already in `review`, can the system safely assume that its REPORT, execution record, and REVIEW all belong to the same accountability chain?**

We checked ten reports from one fixed historical slice. Four linked directly by explicit task key. Four lacked the action-side task key. Two assigned the same report to different tasks in two sources.

The `4 / 4 / 2` split was never a defect rate. It exposed a narrower principle:

> **Lifecycle location tells us where a task is. It does not prove who owns each piece of evidence around it.**

The valuable part came next. We turned that principle into a read-only diagnostic, calibrated its semantics against real task data during development, completed the engineering work, and shipped the capability in CodeFlowMu V2.0.4.

The path is therefore:

**research finding → engineering contract → real-task calibration → semantic convergence → formal release → live validation**.

## 1. The research origin: relationships must come from explicit facts

The historical check used only explicit fields: the task key attached to a REPORT write and the task key recorded for the same REPORT in the report ledger.

| Two-source relation | Output | What the reader must not do |
| --- | --- | --- |
| both task keys exist and match | `linked` | infer nothing extra |
| one side lacks the task key | `missing` | infer from filename, time, or role |
| both exist and disagree | `conflict` | choose the more convenient source |

The public fixture yields `linked = 4`, `missing = 4`, and `conflict = 2`.

The point is not the count. The point is that uncertainty remains visible rather than being cosmetically repaired.

That research result led to a more explicit evidence graph:

```text
TASK / revision
→ attempt
→ lease
→ execution
→ action evidence
→ REPORT
→ REVIEW / EVAL
→ business decision
```

Each edge must answer one narrow question: **why are these records allowed to be connected?**

## 2. The engineering translation: a diagnostic, not another state machine

R2 was implemented as a separate, read-only evidence-association diagnostic.

It asks whether:

- the current task revision links to a specific attempt;
- the attempt links to a lease;
- the attempt links to an execution;
- the execution links to terminal action evidence;
- the REPORT links to the current task;
- the REPORT links to the formal REVIEW;
- an EVAL, when present, has an explicit relationship to REVIEW.

The diagnostic reads formal sources and produces derived snapshots. It does not rewrite TASK, REPORT, REVIEW, attempt, lease, or lifecycle state.

That is why the feature is better understood as an X-ray than a judge.

## 3. Real-task calibration during development

Once the theory entered code, the important work was not to display more edges as quickly as possible. It was to determine which values were actually comparable and which relations were truly required at a given stage.

Real task `TASK-20260827-024` helped calibrate several rules during development.

First, values from different revision domains must not be compared as though they were the same business revision. A current-file digest can support caching and change detection without becoming a lifecycle revision.

Second, collaboration context must not become ownership. Parent-task references and linked-task metadata are useful context, but REPORT ownership requires direct stable keys.

Third, “not yet materialized in one store” is not the same as “execution absent.” When an attempt already carries a formal `session_id` and runtime receipts/events identify the execution, the diagnostic can project that execution read-only.

Fourth, when progress and final reports coexist, the current formal REPORT needs an explicit anchor. V2.0.4 uses `current_final_report_id` for that purpose.

These were normal engineering-calibration decisions for a new diagnostic capability. They narrowed the meaning of revision, ownership, execution, and current REPORT until the implementation matched the intended evidence contract.

## 4. V2.0.4 formal release: the same QA task changes diagnosis from `active` to `review`

After the feature was complete and V2.0.4 was formally released, we captured two local UI views of the same task:

`TASK-20260827-030-PM-to-QA`

The first screenshot shows the task in `active`. The second shows the same task in `review`.

These raw UI screenshots are first-party page evidence. The author will upload them separately into this article. Their value is that they show the same task changing stage while the diagnostic recomputes the evidence relationships accordingly.

### Stage A: `active` — no REPORT yet means not applicable

The visible summary is:

- linked: 4
- missing: 0
- conflict: 0
- observer-only: 0

The visible linked edges include:

- task revision → attempt
- attempt → lease
- attempt → execution
- execution → action evidence

No formal REPORT exists yet, so the REPORT edges are correctly **not applicable**, not missing:

- `REPORT → Task`: `not_applicable`
- `REPORT → REVIEW`: `not_applicable`

The crucial fact is `missing=0 / conflict=0`. At this stage, no REPORT is expected, so reporting a missing REPORT would itself be inaccurate.

### Stage B: `review` — REPORT relationships become linked when the evidence exists

After the same task enters `review`, the diagnostic recomputes the graph:

- attempt → lease: linked
- attempt → execution: linked
- execution → action evidence: linked
- REPORT → Task: linked
- REPORT → REVIEW: linked

The remaining EVAL edge is:

- `EVAL → REVIEW`: `not_applicable` / `eval_not_present`

That is also the correct result. This is a **QA task**. In the current workflow, EVAL belongs to the PM path, so this QA task is not expected to carry an EVAL report.

The pair therefore demonstrates a specific production capability:

> **Evidence requirements change with lifecycle stage and role, and the diagnostic changes with the formal facts instead of forcing every edge into linked or missing.**

## 5. `not_applicable` is a first-class semantic state

A useful agent-runtime diagnostic needs more than healthy/unhealthy.

Evidence requirements are stage- and role-dependent:

- while a task is active, a final REPORT may not yet be required;
- in review, REPORT and REVIEW relationships become relevant;
- a QA task may legitimately have no PM-path EVAL.

The diagnostic therefore distinguishes at least:

- `linked`: explicit stable keys establish the relation;
- `missing`: the current stage requires evidence that was not found;
- `conflict`: comparable explicit facts disagree;
- `not_applicable`: this stage or role does not require the relation;
- `observer_only`: an observation exists but carries no lifecycle authority.

This is not UI decoration. It is part of the semantic contract.

## 6. The most important boundary in the UI

The V2.0.4 task detail states:

> **This conclusion describes evidence relationships only. It does not mean the task has been delivered or verified successfully.**

That sentence prevents evidence association from becoming hidden adjudication.

`REPORT → REVIEW = linked` establishes only that the current formal REPORT and REVIEW are connected by the relevant stable keys.

It does not establish that:

- the REPORT is truthful;
- the REVIEW conclusion is correct;
- QA has passed;
- ADMIN accepted delivery;
- the task is eligible for `done`.

Evidence association is an observation layer. Delivery and acceptance remain separate decisions.

## 7. Two practical actions make it an engineering tool

The review-stage UI also exposes:

- **copy reconciliation summary**;
- **recheck evidence association**.

The first helps operators carry the current relationship state into further review without reconstructing it from logs.

The second forces the diagnostic to reread current formal facts and recompute the snapshot rather than treating cached output as permanent truth.

Neither action changes formal lifecycle state.

That is why V2.0.4 adds more than a task-detail view. It adds an operational evidence-association diagnostic.

## 8. Why this is a genuine research-to-engineering case

The sequence matters:

**Step 1 — historical research.** Ten reports yielded `4 linked / 4 missing / 2 conflict` and the finding that lifecycle position is not evidence ownership.

**Step 2 — engineering contract.** TASK, attempt, lease, execution, action, REPORT, REVIEW, and EVAL became explicit relationship edges.

**Step 3 — real-task calibration during development.** We refined which revisions can be compared, which keys establish REPORT ownership, how execution may be projected, and how the current final REPORT is anchored.

**Step 4 — formal V2.0.4 release.** The diagnostic became a shipped product capability.

**Step 5 — live lifecycle validation.** The same QA task moved from `active` to `review`: REPORT edges were correctly not applicable before the report existed, became linked when review evidence appeared, and EVAL remained not applicable because this QA path does not require it.

That is the research value: **the theory survived contact with the real data model, lifecycle, roles, and runtime state required to become a usable product capability.**

## 9. Public verification

The complete [R2 → CodeFlowMu V2.0.4 engineering evidence pack](/en/research/evidence/2026-08-27-r2-v204-evidence-association) is published separately.

The historical research artifacts remain public:

- [ten deidentified REPORT association records](/assets/evidence/2026-08-27-r2-report-association-fixture.json)
- [public association Reader](/assets/evidence/2026-08-27-r2-association-reader.mjs)
- [public check](/assets/evidence/2026-08-27-r2-association-reader-check.mjs)

The V2.0.4 live comparison also has a structured transcript and consistency check:

- [active/review dynamic diagnostic snapshots](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-snapshots.json)
- [dynamic snapshot consistency check](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-check.mjs)

The raw screenshots will be added separately by the author as first-party UI evidence. The structured artifacts preserve the stage, visible edges, statuses, and reason codes in machine-checkable form.

## Conclusion

R2 began by asking whether REPORTs could be cross-booked.

By V2.0.4, the more useful question is:

**Can the runtime keep answering, as the task changes stage, which evidence relationships are established, which are absent, and which are simply not applicable?**

The two views of the same QA task show that it can:

- no REPORT during `active` → correctly not applicable;
- REPORT and REVIEW present in `review` → linked;
- no PM-path EVAL on this QA task → correctly not applicable;
- evidence association remains separate from delivery and acceptance.

> **An evidence diagnostic is not a static status label. It continuously answers which relationships can be proven from the formal facts that exist now.**

That is the engineering capability the original research finding became.

---

## Sources and evidence boundary

- The historical `4 / 4 / 2` result comes from one fixed ten-report deidentified slice. It is not a defect rate or system-wide quality measure.
- `TASK-20260827-024` is used only as a development-stage calibration case for evidence semantics and formal anchors; this article does not present normal development work as a released-product failure.
- `TASK-20260827-030-PM-to-QA` is a first-party V2.0.4 same-task `active → review` observation used to demonstrate stage- and role-aware dynamic diagnosis.
- Claims remain scoped to the disclosed tasks, visible edges, and published artifacts rather than all tasks or all desktop/PWA paths.
