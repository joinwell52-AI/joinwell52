---
title: "A Task Is in Review. Does That Mean Its Evidence Is Not Cross-Booked?"
date: '2026-08-27'
column: open-source-engineering
category: daily
article_type: engineering-case-study
edition: research-center
research_question: "When a task has reached review, can its execution receipt, report, and review record safely be assumed to belong to the same task?"
summary: "A ten-record historical slice contained four direct report-to-task links, four missing action keys, and two conflicts. Lifecycle location is not proof of evidence ownership."
sources: "/zh/research/evidence/2026-08-27-runtime-semantics-evidence-pack"
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
  title="A Task Is in Review. Does That Mean Its Evidence Is Not Cross-Booked?"
  summary="A ten-record historical slice contained four direct report-to-task links, four missing action keys, and two conflicts. Lifecycle location is not proof of evidence ownership."
  version="RSEM-20260827-02"
  status="Engineering Research · 2026-08-27"
  languageHref="/zh/engineering/2026-08-27-review-status-evidence-association"
  languageLabel="中文"
/>

# A Task Is in Review. Does That Mean Its Evidence Is Not Cross-Booked?

We expected a small historical check to be boring. For each report write, would the runtime action log and the report ledger point back to the same task?

There were only ten records. Four matched directly. Four had no task key in the action record. Two assigned the same report to different tasks in the two sources.

This is not an incident rate, and it is not a score for the system. It is a ten-row slice from a fixed historical revision. That small size is what makes the problem hard to ignore: if a reader chooses the more convenient source so that the page looks complete, a task shown as “in review” may be presenting someone else’s execution receipt as its own.

CodeFlowMu is the local multi-agent collaboration system we are developing. This ledger review is why R2, a read-only evidence-association diagnostic, has been approved to enter engineering implementation. Its purpose is not to invent another task state. Its purpose is to let a task page answer why a report and an execution record belong there.

## Do not start by calculating a success rate

The original data comes from one fixed historical commit. The check uses only explicit fields: the report ID and task ID in a `report.write` action, and the task ID for the same report ID in the report ledger. The publishable fixture replaces reports and tasks with `R01…R10` and `T01…T09`; it removes report bodies, absolute paths, session identifiers, timestamps, and agent text.

The rules are intentionally unsophisticated:

| Relationship between the two records | Count | Reader result |
| --- | ---: | --- |
| Both task IDs exist and are equal | 4 | `linked` |
| The action has no task ID | 4 | `missing` |
| Both exist but differ | 2 | `conflict` |

No filename similarity, nearby timestamp, author role, or model inference may repair the relationship. For `R08`, if the action says `T02` and the ledger says `T07`, “choose the latest one” makes the screen prettier but the evidence weaker.

The prototype reader has three regression assertions: preserve the 4/4/2 distribution; never produce a canonical task for a conflict; never infer a task for a missing key. All three pass. That does not establish that a report is truthful or that delivery was accepted. It establishes one narrower thing: the reader does not erase incomplete or contradictory provenance.

![Figure 1: Row-by-row association of ten reports](/assets/figures/2026-08-27-review-status-evidence-association-figure-1.svg)

*Figure 1. The fixed historical slice contains ten reports: four directly linked, four missing a key, and two in conflict. This is neither a failure rate nor a judgment of report content; it puts confirmed relations beside relations that must remain unresolved. Source: public candidate evidence pack R2.*

## Review is a location, not a parentage claim

In a file-based lifecycle, a task moves through `inbox → active → review → done → archive`. When a task is in `review`, that answers a formal location question: the task is at the review stage and its downstream actions follow the review rules.

It does not answer which task a report belongs to.

```text
Formal location: TASK-17 is in review

Evidence questions:
  Which attempt held this execution right?
  Which task and revision produced this action evidence?
  Can the REPORT return to that same attempt?
  Is an observation-only evaluation being mistaken for a review signature?
```

Confusing location with ownership creates two opposite errors. Review can hide a cross-booked report, or an evidence conflict can be allowed to overwrite the formal lifecycle. The useful display keeps both: the task remains in review, while evidence says “reconcile required.”

## A CrewAI change explains why process edges matter

In [CrewAI PR #7115](https://github.com/crewAIInc/crewAI/pull/7115), João Moura made a compact but revealing change: a deployment creation event is connected more explicitly to the UUID received after actual creation. The PR was merged on August 27, 2026. It is about CrewAI deployment analytics, not CodeFlowMu’s ledger, and it does not make our ten rows representative of anything else.

What it illuminates is the same engineering habit: request creation, successful creation, execution end, report arrival, review, and business acceptance are separate edges. Collapsing them into one completion value makes metrics neat and diagnosis fragile.

Moura’s [PR #7118](https://github.com/crewAIInc/crewAI/pull/7118) remains open. It proposes an ungated terminal event and duration for crew runs. It is an interesting direction, not a shipped CrewAI capability. Together, the two changes reinforce why “add one global success field” is not the answer to missing relationships.

## R2 is an X-ray, not another judge

R2 will read the facts already present in the system:

```text
TASK / revision
→ attempt / lease
→ run / managed job
→ action evidence
→ REPORT
→ REVIEW or evaluation observation
→ explicit business decision
```

Each edge accepts explicit stable keys only: task ID, attempt, lease, run ID, report ID, revision, or source digest. A missing key becomes “evidence needed”; incompatible sources become “reconcile required.” An evaluation may observe a problem, but it remains observation-only and cannot become a signature.

The planned task-detail entry is a persistent `⊕ Diagnosis` badge. It is quiet when relationships are linked, amber when evidence is missing, and orange-red when sources conflict. Its conflict message must be readable: “This report says task 003; the execution receipt says task 002. The system chose neither. A PM must inspect the sources and supplement, withdraw, or revise the record.”

R2 will not move lifecycle files, release a lease, restart an agent, approve or reject a task, or release QA. It makes a hidden discontinuity visible; the existing formal workflow handles any subsequent decision.

## Four questions for your own ten records

Before building a graph database or a dashboard, pick ten reports and ask:

1. Can every report return to one task and one revision?
2. Can it return to a specific attempt, lease, or managed execution?
3. Does the reader preserve disagreement rather than choose a plausible answer?
4. Can “an evaluator looked at it” be confused with “a reviewer signed it”?

The most valuable answer is often not “everything linked.” It is “some things did not link, and the system did not pretend they did.” Lifecycle says where work has arrived. Evidence association says whether the step stands on one accountable chain.

## Sources and limits

[CrewAI #7115](https://github.com/crewAIInc/crewAI/pull/7115) is merged; [CrewAI #7118](https://github.com/crewAIInc/crewAI/pull/7118) was open when checked on August 27, 2026. The [public evidence pack](/zh/research/evidence/2026-08-27-runtime-semantics-evidence-pack) contains all ten de-identified records, the rules, and an executable reader. The 4/4/2 result is not a defect rate or quality measure. R2 is approved for engineering implementation, but its reader, API, task-detail badge, and regressions are not yet a delivered CodeFlowMu feature.
