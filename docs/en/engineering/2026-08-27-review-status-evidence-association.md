---
title: "From ‘Evidence Must Not Be Cross-Booked’ to Dynamic Diagnosis: How CodeFlowMu V2.0.4 Turned a Research Finding into an Engineering Capability"
date: '2026-08-27'
column: open-source-engineering
category: daily
article_type: engineering-case-study
edition: research-center
research_question: "How can a research finding about evidence ownership survive implementation, real-task counterexamples, false-positive repair, and lifecycle-aware recomputation without becoming a hidden business judge?"
summary: "R2 began with ten historical reports and one finding: lifecycle location does not prove evidence ownership. That principle entered CodeFlowMu, failed against real-task edge cases, was corrected in V2.0.4, and now recomputes evidence relationships as the same task moves from active to review."
sources: "/en/research/evidence/2026-08-27-runtime-semantics-evidence-pack"
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
  summary="This capability did not start as a product feature. It started as an evidence-ownership problem, failed against real tasks, and became a lifecycle-aware, read-only diagnostic that still refuses to sign for delivery or acceptance."
  version="RSEM-20260827-02"
  status="Engineering Research · 2026-08-27"
  languageHref="/zh/engineering/2026-08-27-review-status-evidence-association"
  languageLabel="中文"
/>

# From “Evidence Must Not Be Cross-Booked” to Dynamic Diagnosis: How CodeFlowMu V2.0.4 Turned a Research Finding into an Engineering Capability

R2 began as a small research question: **if a task is already in `review`, can the system safely assume that the nearby REPORT, execution receipt, and REVIEW belong to the same accountability chain?**

We checked ten reports from one fixed historical slice. Four linked directly by explicit task key. Four were missing the action-side task key. Two assigned the same report to different tasks in two sources.

The `4 / 4 / 2` split was never a defect rate. Its value was conceptual:

> **Lifecycle location tells us where a task is. It does not prove who owns each piece of evidence around it.**

That would have been an ordinary research conclusion if the work had stopped there. Instead, we implemented the principle in CodeFlowMu. Real tasks then showed that the first diagnostic could itself produce false positives. We changed the semantics, re-ran the evidence, and by V2.0.4 the same task could move from `active` to `review` while its evidence graph recomputed accordingly.

The interesting result is therefore not a dashboard card. It is a full loop:

**research finding → engineering implementation → live counterexample → semantic repair → revalidation**.

## 1. The original theory was a refusal to invent relationships

The historical ten-record check used only explicit fields: the task key attached to a REPORT write and the task key recorded for the same REPORT in the report ledger.

The rule was deliberately unhelpful to anyone who wanted a perfectly complete screen:

| Two-source relation | Output | What the reader must not do |
| --- | --- | --- |
| both task keys exist and match | `linked` | no inference needed |
| one side lacks the task key | `missing` | do not infer from filename, timestamp, or role |
| both exist and disagree | `conflict` | do not choose the more convenient source |

The published fixture therefore contains `linked = 4`, `missing = 4`, and `conflict = 2`.

The important property is not the count. It is that the reader preserves uncertainty instead of cosmetically repairing it.

That became the theoretical shape of R2:

```text
TASK / revision
→ attempt / lease
→ execution
→ action evidence
→ REPORT
→ REVIEW / EVAL
→ business decision
```

Each edge has to answer a very specific question: **why are these two records allowed to be connected?**

## 2. The first implementation revealed that a diagnostic can hallucinate too

Turning the theory into code did not prove that we had translated it correctly.

After the first evidence-association diagnostic entered the product line, real task `TASK-20260827-024` produced four alarming findings: task-to-attempt revision mismatch, REPORT ownership conflict, missing execution, and missing formal REVIEW.

The live scene did not actually contain four independent failures. The diagnostic itself had crossed semantic boundaries.

Three mistakes were especially instructive:

1. **Comparing values from different revision domains.** A digest derived from the current task file was compared directly with an attempt-time business revision even though they did not carry the same semantics.
2. **Treating collaboration context as ownership.** A child report can mention its parent task or carry linked-task references. Those are useful context, but they are not a substitute for direct report ownership.
3. **Treating “not yet materialized here” as “execution missing.”** The attempt already had a formal `session_id`, and runtime receipts/events existed, but a durable SessionStore record had not yet appeared. The first reader turned that storage timing gap into `execution_not_found`.

That gave us a second research lesson:

> **A tool that audits evidence can manufacture bad evidence if its own comparison semantics are too loose.**

V2.0.4 was therefore not optimized to “find more problems.” It was optimized to require stronger eligibility before anything could be called a conflict.

## 3. V2.0.4 tightened the definition of a conflict

Several changes in V2.0.4 matter because they narrow what the diagnostic is allowed to claim.

Revision mismatch is now evaluated only when both sides expose an explicit revision in the same semantic domain. The current-file digest may still support caching and change detection, but it no longer impersonates a business revision.

REPORT ownership accepts direct `task_id` / `source_task_id`. Parent-task references and general linked-task metadata do not become ownership.

When a dispatch attempt already carries a formal `session_id`, the reader can construct a read-only execution projection from runtime facts even if a persistent SessionStore record has not yet been materialized.

When a task contains both progress reports and a final report, the diagnostic uses the task’s `current_final_report_id` as the formal anchor. On the `TASK-20260827-024` scene, that moved the reader away from an older progress report and onto `REPORT-20260827-028-PM-to-ADMIN` and its actual REVIEW; the recomputed scene returned to `linked=6 / missing=0 / conflict=0`.

The diagnostic snapshot also moved to schema 3 and `diag3:` signatures so old `diag1:` / `diag2:` false positives would not remain visible as current work.

The principle is worth stating plainly:

> **A diagnostic should reduce false positives by improving its evidence anchors, not by expanding inference.**

## 4. The clearest proof of engineering is that the same task changes diagnosis as its lifecycle changes

We then captured two first-party local UI screenshots of the same task:

`TASK-20260827-030-PM-to-QA`

The first screenshot shows the task in `active`. The second shows the same task after it enters `review`.

That pair makes the implementation much more interesting than a static “diagnosis panel.” It shows a relationship projection being recomputed against the task’s current formal stage and available evidence.

![Figure 2: The same task recomputes its evidence relationships from active to review](/assets/figures/2026-08-27-review-status-evidence-association-v204-dynamic.svg)

*Figure 2. Structured from two local CodeFlowMu V2.0.4 screenshots of the same task. The public figure omits local absolute paths, instance nonce, and unrelated console text. The underlying transcript and a public consistency check are available below.*

### Stage A: `active` — no REPORT is not the same as a missing REPORT

In the `active` screenshot, the visible summary is:

- linked: 4
- missing: 0
- conflict: 0
- observer-only: 0

The visible linked edges are:

- task revision → attempt
- attempt → lease
- attempt → execution
- execution → action evidence

The REPORT edges are not red and are not missing:

- `REPORT → Task`: **not applicable**, `lifecycle_does_not_require_report`
- `REPORT → REVIEW`: **not applicable**, `report_not_available`

This distinction is operationally important. If the diagnostic called those edges missing, it would create work for evidence that the current stage does not yet require.

### Stage B: `review` — the REPORT edges appear when the formal facts appear

The same task later enters `review`. The second screenshot shows the diagnostic recomputing the graph:

- attempt → lease: linked
- attempt → execution: linked
- execution → action evidence: linked
- REPORT → Task: linked
- REPORT → REVIEW: linked

At the same time:

- `EVAL → REVIEW`: **not applicable**, `eval_not_present`

Again, absence is not automatically a defect. If this flow did not produce an EVAL, the reader should not manufacture one simply to make the graph complete.

The review-stage UI also exposes two practical operations:

- copy reconciliation summary
- recheck evidence association

The latter maps to `refresh=1`: the API can bypass the cached diagnostic and re-read current formal facts without mutating TASK, REPORT, REVIEW, lease, or lifecycle state.

That is the engineering distinction between a dynamic diagnostic and a static detail page.

## 5. `not_applicable` is a first-class state, not a softer version of missing

Agent runtimes need more than a binary healthy/unhealthy diagnostic because evidence requirements are stage-dependent.

A final REPORT may be irrelevant while a task is actively executing. It may become required once the task reaches review. An EVAL may not exist at all in a particular review path. The correct question is therefore not only “did we find the evidence?” but also “is this edge currently required?”

V2.0.4’s relationship semantics distinguish at least:

- `linked`: explicit stable keys establish the relationship;
- `missing`: the current stage expects evidence that could not be found;
- `conflict`: comparable explicit facts disagree;
- `not_applicable`: this stage or object does not currently require the relation;
- `observer_only`: an observation exists but carries no lifecycle authority.

That is not UI decoration. It is an anti-false-positive contract.

## 6. The most important sentence in the UI is not “linked”

The task detail explicitly states:

> **This conclusion describes evidence relationships only. It does not mean the task has been delivered or verified successfully.**

That sentence preserves the boundary between evidence association and business adjudication.

`REPORT → REVIEW = linked` establishes only that the task’s current formal REPORT and REVIEW are connected by the relevant stable keys.

It does not establish that:

- the REPORT is truthful;
- the REVIEW conclusion is correct;
- QA has passed;
- ADMIN accepted delivery;
- the task is eligible for `done`.

The implementation reinforces that separation. The HTTP mount returns `diagnostic_only: true`; a reader failure reports that the diagnosis is temporarily unavailable without changing formal state; and the queue is built from snapshots whose `conflict` count is greater than zero rather than from every missing or not-applicable edge.

The diagnostic is intentionally an X-ray, not a judge.

## 7. Why this is a real research-to-engineering case

R2’s evolution is worth preserving because it did not follow the usual “feature first, explanation later” pattern.

**Step 1 — historical research.** Ten reports yielded `4 linked / 4 missing / 2 conflict` and the finding that lifecycle position is not evidence ownership.

**Step 2 — engineering translation.** We built an explicit, read-only graph across task, attempt, lease, execution, action, report, review, and evaluation evidence.

**Step 3 — the live system refuted parts of the first implementation.** `TASK-20260827-024` exposed cross-domain revision comparison, incorrect report ownership, and storage-timing false positives.

**Step 4 — the counterexample changed the implementation semantics.** V2.0.4 tightened revision eligibility, report ownership, execution projection, final-report anchoring, and diagnostic cache identity.

**Step 5 — return to live operation.** `TASK-20260827-030-PM-to-QA` moved from `active` to `review`, and the same diagnostic changed from “REPORT edges not applicable” to “REPORT → Task / REVIEW linked” while EVAL remained not applicable.

That is the part that makes this more than a feature story:

> **Theory was not merely implemented. The implementation was allowed to produce counterevidence that changed the theory’s operational form.**

## 8. Public verification now covers both the original research slice and the V2.0.4 dynamic scene

The original R2 artifacts remain public because they explain where the research finding came from:

- [ten deidentified REPORT association records](/assets/evidence/2026-08-27-r2-report-association-fixture.json)
- [public association Reader](/assets/evidence/2026-08-27-r2-association-reader.mjs)
- [public check](/assets/evidence/2026-08-27-r2-association-reader-check.mjs)

The V2.0.4 follow-up adds a structured transcript of the same task across two lifecycle stages:

- [active/review dynamic diagnostic snapshots](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-snapshots.json)
- [dynamic snapshot consistency check](/assets/evidence/2026-08-27-r2-v204-dynamic-diagnostic-check.mjs)

Run:

```text
node 2026-08-27-r2-v204-dynamic-diagnostic-check.mjs
```

Expected output:

```json
{"fixture":"first_party_ui_observation_transcript","same_task":true,"transition":"active_to_review","status":"PASS"}
```

The public transcript is derived from two first-party local screenshots of the same task. It deliberately excludes local absolute paths, instance identifiers, and unrelated console content. It is evidence for the disclosed dynamic semantics, not end-to-end certification of all CodeFlowMu tasks or UI paths.

## Conclusion: the strongest engineering capability is often one that survived being disproved by its own first implementation

R2 started by asking whether REPORTs could be cross-booked.

Once the diagnostic became real, a harder question appeared: **how does the diagnostic prove that it is not cross-booking evidence itself?**

V2.0.4 is valuable because it answers that question with narrower semantics rather than more automation. Relationships require comparable formal facts. Stage-inapplicable evidence is not reported as missing. Conflicts require explicit disagreement. The diagnostic remains read-only. And even a fully linked graph does not become delivery acceptance.

The two screenshots of one task moving from `active` to `review` make that contract concrete:

> **An evidence diagnostic is not a static status label. It continuously answers which relationships can be proven from the formal facts that exist now.**

That is the engineering capability the original research finding eventually became.

---

## Sources and evidence boundary

- The historical `4 / 4 / 2` result comes from one fixed ten-report deidentified slice. It is not a defect rate or system-wide quality measure.
- CodeFlowMu V2.0.4 engineering records describe the false positives observed on `TASK-20260827-024` and the subsequent changes to revision semantics, REPORT ownership, execution projection, `current_final_report_id`, and diagnostic schema. This article describes that engineering evolution without treating an engineering-candidate state as a formal release tag.
- The `TASK-20260827-030-PM-to-QA` active/review comparison comes from two first-party local screenshots of the same task. The public artifact is a structured transcript rather than the raw local screenshots.
- The evidence supports the disclosed research-to-engineering loop and dynamic diagnostic semantics. It does not certify every task, lifecycle combination, desktop path, or PWA path.
