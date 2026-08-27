---
title: "From ‘Evidence Must Not Be Cross-Booked’ to Dynamic Diagnosis: How CodeFlowMu V2.0.4 Turned a Research Finding into an Engineering Capability"
date: '2026-08-27'
column: open-source-engineering
category: daily
article_type: engineering-case-study
edition: research-center
research_question: "How can a research finding about evidence ownership survive implementation, real-task counterexamples, false-positive repair, and lifecycle-aware recomputation without becoming a hidden business judge?"
summary: "R2 began with ten historical reports and one finding: lifecycle location does not prove evidence ownership. After live false-positive repair, CodeFlowMu V2.0.4 now recomputes the same QA task from active to review while correctly distinguishing linked evidence from stage-inapplicable evidence."
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
  summary="This capability did not start as a product feature. It started as an evidence-ownership problem, survived live false-positive correction, and became a lifecycle-aware, read-only diagnostic that still refuses to sign for delivery or acceptance."
  version="RSEM-20260827-02"
  status="Engineering Research · 2026-08-27"
  languageHref="/zh/engineering/2026-08-27-review-status-evidence-association"
  languageLabel="中文"
/>

# From “Evidence Must Not Be Cross-Booked” to Dynamic Diagnosis: How CodeFlowMu V2.0.4 Turned a Research Finding into an Engineering Capability

R2 began with a small question: **if a task is already in `review`, can the system safely assume that the nearby REPORT, execution receipt, and REVIEW all belong to the same accountability chain?**

We checked ten reports from one fixed historical slice. Four linked directly by explicit task key. Four were missing the action-side task key. Two assigned the same report to different tasks in two sources.

The `4 / 4 / 2` split was never a defect rate. It exposed a narrower principle:

> **Lifecycle location tells us where a task is. It does not prove who owns each piece of evidence around it.**

That would have remained a design principle if the work had stopped there. Instead, we implemented it in CodeFlowMu. The first live diagnostic then produced false positives on a real task. We changed the semantics. In V2.0.4, a different real QA task provided a clean positive validation: the same task moved from `active` to `review`, the evidence graph changed with the lifecycle, and normal not-applicable edges were not misreported as missing or conflict.

The full path is therefore:

**research finding → engineering implementation → live counterexample → semantic repair → positive validation**.

## 1. The original theory was a refusal to invent relationships

The ten-record historical check used only explicit fields: the task key attached to a REPORT write and the task key recorded for the same REPORT in the report ledger.

| Two-source relation | Output | What the reader must not do |
| --- | --- | --- |
| both task keys exist and match | `linked` | no inference needed |
| one side lacks the task key | `missing` | do not infer from filename, timestamp, or role |
| both exist and disagree | `conflict` | do not choose the more convenient source |

The public fixture therefore contains `linked = 4`, `missing = 4`, and `conflict = 2`.

Its important property is not the count. It is that the reader preserves uncertainty rather than cosmetically repairing it.

That became the conceptual shape of R2:

```text
TASK / revision
→ attempt / lease
→ execution
→ action evidence
→ REPORT
→ REVIEW / EVAL
→ business decision
```

Each edge has to answer a narrow question: **why are these two records allowed to be connected?**

## 2. The first implementation showed that a diagnostic can hallucinate too

Turning the theory into code did not prove that we had translated it correctly.

The first live evidence-association diagnostic produced false positives on `TASK-20260827-024`: task-to-attempt revision mismatch, REPORT ownership conflict, missing execution, and missing formal REVIEW.

The task did not actually contain four simultaneous business failures. The diagnostic had crossed semantic boundaries.

Three mistakes were especially instructive:

1. **Different revision domains were compared as if they were the same thing.** A digest derived from the current task file was compared directly with an attempt-time business revision.
2. **Collaboration context was treated as ownership.** Parent-task and linked-task references in a child REPORT were allowed to look like direct REPORT ownership.
3. **Not-yet-materialized state was treated as missing execution.** The attempt already had a formal `session_id` and runtime receipts/events existed, but a durable SessionStore record had not yet appeared.

A later live case also showed that when both progress and final reports exist, a diagnostic can choose the wrong REPORT unless the current formal report is explicitly anchored.

That produced a second lesson:

> **A tool that audits evidence can manufacture bad evidence if its own comparison semantics are too loose.**

## 3. V2.0.4 tightened what is allowed to count as a conflict

V2.0.4 changed the diagnostic in several important ways.

Revision mismatch is evaluated only when both sides expose comparable explicit revisions in the same semantic domain. The current-file digest remains useful for caching and change detection, but it no longer impersonates a business revision.

REPORT ownership accepts direct `task_id` / `source_task_id`. Parent-task references and general linked-task metadata do not become ownership.

When a dispatch attempt already carries a formal `session_id`, the reader can construct a read-only execution projection from runtime facts even if a persistent SessionStore record has not yet been materialized.

When a task has both progress reports and a final report, the diagnostic uses `current_final_report_id` as the formal anchor. On `TASK-20260827-024`, the corrected reader selected `REPORT-20260827-028-PM-to-ADMIN` and its actual REVIEW; the recomputed scene returned `linked=6 / missing=0 / conflict=0`.

The diagnostic snapshot also moved to schema 3 and `diag3:` signatures so old `diag1:` / `diag2:` false positives would not remain visible as current work.

The engineering principle is deliberately conservative:

> **Reduce false positives by improving evidence anchors, not by expanding inference.**

## 4. Post-fix positive validation: the same QA task moves from `active` to `review` with accurate diagnosis

This section must be kept separate from the previous false-positive case. The two screenshots below are **not a defect scene**. They are a post-fix V2.0.4 validation of another real task:

`TASK-20260827-030-PM-to-QA`

The first screenshot shows the task in `active`. The second shows the same task in `review`.

The pair demonstrates that the diagnostic is not a static task-detail panel. It recomputes evidence relationships from the task’s current lifecycle and currently available formal evidence. Within the visible edges, the stage transition is accurate and no normal not-applicable condition is promoted into a missing or conflict state.

![Figure 2: The same task recomputes its evidence relationships from active to review](/assets/figures/2026-08-27-review-status-evidence-association-v204-dynamic.svg)

*Figure 2. Structured from two local CodeFlowMu V2.0.4 screenshots of the same task. The public figure omits local absolute paths, instance nonce, and unrelated console text. Source: first-party local runtime observation.*

### Stage A: `active` — no REPORT yet is correctly not applicable

The visible summary is:

- linked: 4
- missing: 0
- conflict: 0
- observer-only: 0

The visible linked edges are:

- task revision → attempt
- attempt → lease
- attempt → execution
- execution → action evidence

No formal REPORT exists yet. Therefore the REPORT edges are correctly reported as not applicable rather than missing:

- `REPORT → Task`: `not_applicable` / `lifecycle_does_not_require_report`
- `REPORT → REVIEW`: `not_applicable` / `report_not_available`

The important result is exactly `missing=0 / conflict=0`. At this stage, the absence of a REPORT is normal workflow state, not missing evidence.

### Stage B: `review` — REPORT relationships become linked when the evidence exists

After the same task enters `review`, the diagnostic recomputes the graph:

- attempt → lease: linked
- attempt → execution: linked
- execution → action evidence: linked
- REPORT → Task: linked
- REPORT → REVIEW: linked

The remaining EVAL edge is:

- `EVAL → REVIEW`: `not_applicable` / `eval_not_present`

That is also the correct result, not a missing-evidence exception. This is a **QA task**. In the current workflow, EVAL is produced on the PM path, so this QA task is not expected to carry an EVAL report.

The two screenshots therefore show a clean stage-aware transition:

- while the task is active, REPORT evidence is not yet required and is correctly marked not applicable;
- once the task reaches review, REPORT → Task and REPORT → REVIEW become linked;
- EVAL remains not applicable because this QA task does not require it.

That is the stronger point: **the diagnostic changes because the formal evidence requirements change, not because the UI is merely repainting a status.**

The review-stage UI also exposes two practical operations:

- copy reconciliation summary;
- recheck evidence association.

The latter maps to `refresh=1`: it bypasses the cached diagnostic and re-reads current formal facts without mutating TASK, REPORT, REVIEW, lease, or lifecycle state.

## 5. `not_applicable` is a first-class semantic state

Agent runtimes need more than healthy/unhealthy because evidence requirements are stage- and role-dependent.

A final REPORT is not required while this task is still actively executing. It becomes relevant when the task reaches review. An EVAL is not required on this QA task because the current EVAL path belongs to PM work.

The diagnostic therefore distinguishes at least:

- `linked`: explicit stable keys establish the relation;
- `missing`: the current stage requires evidence that could not be found;
- `conflict`: comparable explicit facts disagree;
- `not_applicable`: this stage or role does not require the relation;
- `observer_only`: an observation exists but carries no lifecycle authority.

This is not UI decoration. It is an anti-false-positive contract.

If `not_applicable` is collapsed into `missing`, the diagnostic manufactures work. If `observer_only` is collapsed into “reviewed,” the diagnostic manufactures authority.

## 6. The most important sentence in the UI is not “linked”

The task detail states:

> **This conclusion describes evidence relationships only. It does not mean the task has been delivered or verified successfully.**

That sentence preserves the boundary between evidence association and business adjudication.

`REPORT → REVIEW = linked` establishes only that the task’s current formal REPORT and REVIEW are connected by the relevant stable keys.

It does not establish that:

- the REPORT is truthful;
- the REVIEW conclusion is correct;
- QA has passed;
- ADMIN accepted delivery;
- the task is eligible for `done`.

The implementation reinforces that separation. The HTTP mount returns `diagnostic_only: true`; a reader failure reports that diagnosis is temporarily unavailable without changing formal state; and the diagnostic queue is built from snapshots whose conflict count is greater than zero rather than from every missing or not-applicable edge.

The diagnostic is intentionally an X-ray, not a judge.

## 7. Why this is a genuine research-to-engineering case

R2 did not follow the usual “feature first, explanation later” pattern.

**Step 1 — historical research.** Ten reports yielded `4 linked / 4 missing / 2 conflict` and the finding that lifecycle position is not evidence ownership.

**Step 2 — engineering translation.** We built an explicit read-only graph across task, attempt, lease, execution, action, report, review, and evaluation evidence.

**Step 3 — live counterexample.** `TASK-20260827-024` showed that the first implementation could create false positives through cross-domain revision comparison, incorrect REPORT ownership, and storage-timing assumptions.

**Step 4 — semantic repair.** V2.0.4 tightened revision eligibility, report ownership, execution projection, final-report anchoring, and diagnostic cache identity.

**Step 5 — positive live validation.** `TASK-20260827-030-PM-to-QA` moved from `active` to `review`. REPORT edges were correctly not applicable before the report existed, became linked once review evidence existed, and EVAL remained correctly not applicable because this QA task does not require an EVAL report.

That is the core research value:

> **Theory was not merely implemented. The first implementation was allowed to produce counterevidence, the operational theory was corrected, and a later live case validated the correction.**

## 8. Public verification covers both the historical finding and the V2.0.4 positive validation

The complete [R2 → CodeFlowMu V2.0.4 engineering evidence pack](/en/research/evidence/2026-08-27-r2-v204-evidence-association) is published separately.

The original R2 artifacts remain public because they show where the research finding came from:

- [ten deidentified REPORT association records](/assets/evidence/2026-08-27-r2-report-association-fixture.json)
- [public association Reader](/assets/evidence/2026-08-27-r2-association-reader.mjs)
- [public check](/assets/evidence/2026-08-27-r2-association-reader-check.mjs)

The V2.0.4 follow-up adds a structured transcript of the same QA task across two lifecycle stages:

- [active/review dynamic diagnostic snapshots](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-snapshots.json)
- [dynamic snapshot consistency check](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-check.mjs)

Run:

```text
node 2026-08-27-r2-v204-dynamic-diagnostic-check.mjs
```

Expected output:

```json
{"fixture":"first_party_ui_observation_transcript","same_task":true,"role":"QA","transition":"active_to_review","no_visible_false_positive":true,"status":"PASS"}
```

The public transcript is derived from two first-party local screenshots of the same task. It excludes local absolute paths, instance identifiers, and unrelated console content. The “no visible false positive” statement is scoped to the edges and lifecycle semantics shown in these screenshots; it is not end-to-end certification of all CodeFlowMu tasks or UI paths.

## Conclusion: the strongest engineering capability is one that survived both refutation and revalidation

R2 started by asking whether REPORTs could be cross-booked.

Once the diagnostic became real, a harder question appeared: **how does the diagnostic prove that it is not cross-booking evidence itself?**

V2.0.4 answers by narrowing its semantics rather than expanding automation. Relationships require comparable formal facts. Stage- or role-inapplicable evidence is not reported as missing. Conflicts require explicit disagreement. The diagnostic remains read-only. And even a fully linked graph does not become delivery acceptance.

The two screenshots of one QA task moving from `active` to `review` provide the post-fix positive evidence: **the state transition is accurate, no visible false positive appears, required relationships emerge when they should, and non-required relationships remain explicitly not applicable.**

> **An evidence diagnostic is not a static status label. It continuously answers, as accurately as the formal facts allow, which relationships can be proven now.**

That is the engineering capability the original research finding eventually became.

---

## Sources and evidence boundary

- The historical `4 / 4 / 2` result comes from one fixed ten-report deidentified slice. It is not a defect rate or system-wide quality measure.
- `TASK-20260827-024` is the first-implementation false-positive counterexample; `TASK-20260827-030-PM-to-QA` is the V2.0.4 post-fix positive validation. They are different scenes and serve different evidentiary roles.
- The active/review comparison comes from two first-party local screenshots of the same QA task. The public artifact is a structured transcript rather than the raw local screenshots.
- “No false positive” is scoped only to the visible edges and stage/role semantics in those screenshots. It does not certify every task, lifecycle combination, desktop path, or PWA path.
- CodeFlowMu V2.0.4 engineering records still distinguish an engineering candidate from a formal RELEASED tag; this article does not cross that release boundary.
