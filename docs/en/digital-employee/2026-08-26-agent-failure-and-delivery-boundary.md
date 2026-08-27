---
title: "A Green Check Describes the Present: What CrewAI's Failure-Telemetry Fix Reveals About Agent Delivery Boundaries"
date: '2026-08-26'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "How can technical failure, current delivery state, formal acceptance, and historical evidence remain simultaneously visible without one layer impersonating another?"
summary: "Starting from CrewAI's task-failure telemetry repair and a CodeFlowMu report-projection defect, this study argues that technical outcomes, delivery evidence, current state, formal acceptance, and history must remain distinct records."
sources: "Public primary sources and the bounded scope of access-controlled first-party evidence are listed in the article."
project_relevance: case-evidence
item_id: "EBR-20260826-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-26-agent-failure-and-delivery-boundary-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-26-agent-failure-and-delivery-boundary-cover.png"
  kicker="Digital Employee · Engineering Research"
  title="A Green Check Describes the Present: What CrewAI's Failure-Telemetry Fix Reveals About Agent Delivery Boundaries"
  summary="A later success must not rewrite an earlier failure, and a current delivery view must not erase history. Execution facts, evidence, and acceptance need separate ledgers."
  version="EBR-20260826-03"
  status="Engineering Research · 2026-08-26"
  languageHref="/zh/digital-employee/2026-08-26-agent-failure-and-delivery-boundary"
  languageLabel="中文"
/>

# A Green Check Describes the Present: What CrewAI's Failure-Telemetry Fix Reveals About Agent Delivery Boundaries

If an agent task ends with a green “completed” state, does that prove nothing failed along the way?

No.

If one tool call fails, does that prove the business task failed?

Also no.

**CodeFlowMu is a locally run multi-agent collaboration system that uses tasks, roles, gates, reports, and approvals to organize agent work into an execution chain that can be traced, recovered, and verified.**

In a system like this, the dangerous failure mode is not simply that something goes wrong. It is that several different kinds of truth are flattened into one status: a technical error becomes a business rejection; a later retry overwrites the earlier failure; a current report hides a returned or superseded one; a green check gradually comes to mean “nothing bad ever happened.”

This article is not about making the interface greener. It is about allowing different facts to remain true at the same time.

## Bottom line: three boundaries must not collapse

An auditable agent runtime needs to preserve at least three inequalities:

- **technical failure ≠ delivery rejection**: a technical failure is first an execution fact; it does not automatically mean the business delivery was rejected;
- **successful action ≠ accepted delivery**: a zero exit code, passing test, or generated report creates evidence, not formal acceptance;
- **current state ≠ history**: the current state may change, but earlier failures, returns, replacements, and resolved records must not disappear with it.

Once those distinctions are compressed into one `status`, a particularly difficult class of bug appears: the UI looks coherent while the audit chain is already false.

## A concrete CrewAI failure: the task failed, but telemetry said OK

CrewAI merged [PR #7073](https://github.com/crewAIInc/crewAI/pull/7073) in August 2026 to repair a direct false-green telemetry path. A task-failure event had been routed through the normal task-ended path, where `close_span()` marked the span `StatusCode.OK`. A separate crew-less failure path could also remove a span without correctly ending and exporting it.

The repair routes task failure through an error path, records `StatusCode.ERROR`, and retains a constrained `error_type`. The PR deliberately records the exception type rather than the exception message, reducing the chance that prompts, paths, or credentials are copied into telemetry.

The important lesson is broader than CrewAI:

> **A technical failure that occurred must remain recorded as a failure. A later recovery must not rewrite the earlier event as success.**

But that principle covers only the execution layer. If a runtime then converts every tool failure directly into “business task failed,” it creates a different category error. Timeouts, environment faults, authority rejections, cancellation, or lost processes may require retry, takeover, or reauthorization. They are execution facts first. Their effect on delivery has to be decided by task evidence and acceptance rules later.

## CodeFlowMu exposed the other half: a correct present must not displace history

The public CodeFlowMu A3 evidence is not a tool-error taxonomy. It concerns the **projection of reports and ISSUE records into a current view**.

The first record-precedence run passed only **55 / 57** checks. Two superseded or invalid final records could still be selected by the rule that chose the current main report. The data had not disappeared; the projection had put historical records in the wrong place.

After the repair, the same collection reached **57 / 57**. A follow-up semantic route regression passed **14 / 14**, and the Reports / Issues / Mobile / Web Panel integration set passed **221 / 221**. These figures verify the named paths only; they are not evidence that every future failure will propagate losslessly through the entire system.

A controlled runtime snapshot recorded the following projection:

| Projection | Observed count | What it means |
| --- | ---: | --- |
| Current root report | 1 | the report currently selected for the root task |
| Current subtask reports | 4 | currently visible reports in the task chain |
| Historical reports | 12 | retained and traceable, but not presented as current conclusions |
| Resolved ISSUE records | 6 | closed historical problems whose records remain present |
| Open ISSUE records | 1 | one issue still requiring current attention |

The evidence supports a narrow but important claim:

> **A correct current view must not be manufactured by deleting, hiding, or misclassifying history.**

A green check can describe the current projection. It cannot truthfully mean “there was never a failure,” “nothing was returned,” or “no record was ever superseded.”

## Why these two cases are really about the same boundary

CrewAI #7073 and CodeFlowMu A3 operate at different layers: one concerns telemetry, the other task/report projection. Neither implementation validates the other. But both expose the same data-governance risk: **a later state overwrites the truth of an earlier event.**

A more robust agent system should keep at least four kinds of facts separate:

| Layer | Question | Typical records |
| --- | --- | --- |
| Execution fact | What happened to this tool call or job? | completed / failed / cancelled / timeout |
| Delivery evidence | What inspectable material did the work produce? | REPORT, test result, change summary, artifact |
| Formal acceptance | Did an authorized role accept that evidence? | accepted / returned / rejected / pending |
| Current projection and history | What should be shown now, and what happened before? | current / superseded / historical / resolved / open |

The layers may reference one another. They must not overwrite one another.

For example:

`tool failed → retry succeeded → report submitted → review accepted`

That chain can legitimately end in a business-level “completed” state, while the initial technical failure remains part of the record. The reverse is also true: `tool succeeded` describes one execution result. Without delivery evidence or formal acceptance, it cannot promote itself into “task delivered.”

## CrewAI #7079 adds a neighboring question: whose action was this?

Another merged CrewAI repair, [PR #7079](https://github.com/crewAIInc/crewAI/pull/7079), separates framework-internal Flows from execution boundaries actually owned by the caller. Internal routing and memory-recall machinery no longer automatically receives the same interception treatment as a user-requested business action, while standalone `Agent.kickoff()` remains observable and blockable when it owns the execution boundary.

This is not a direct implementation analogue for CodeFlowMu A3. It adds a prerequisite to the same engineering problem: before classifying an event as success or failure, the runtime must know **whether the event belongs to the user's business execution or to internal framework machinery**. If provenance is wrong, failure metrics, delivery conclusions, and governance decisions will all inherit the error.

## What should a green check actually require?

If “completed” is treated as the final projection shown on a task page, it should satisfy at least these constraints:

1. **failure is not rewritten**: later recovery may resolve a failure, but it must not erase the original technical event;
2. **execution does not impersonate acceptance**: a zero exit code, passing tests, or a generated file cannot sign off a business delivery by itself;
3. **the present does not consume history**: superseded, returned, invalidated, and resolved records remain traceable;
4. **the projection has provenance**: the system can explain why this report or ISSUE count is current by referring back to a ledger and lineage rule;
5. **internal machinery does not impersonate business action**: framework-internal routing, memory, and Flow activity remain distinguishable from the execution the caller actually requested.

Under those conditions, “completed” is not a color. It is a current conclusion projected from multiple preserved facts.

## Conclusion: a trustworthy system does not eliminate red; it prevents green from rewriting it

Failures are normal in agent systems. Networks break. Commands fail. Reports are returned. Conclusions are superseded. Historical ISSUEs are resolved while new ones remain open.

The dangerous shortcut is to flatten all of those facts into one binary success/failure label.

A stronger runtime does the opposite: **the execution layer preserves failure truthfully, the delivery layer preserves evidence, the acceptance layer makes the business decision, the projection layer says what should be shown now, and history remains intact underneath.**

The most accurate meaning of a green check is therefore not “nothing went wrong.” It is:

> **Given the preserved history and the evidence currently in force, the system has enough grounds to project this task as complete now.**

That is the boundary a “completed” state should carry in a digital-employee runtime.

## Public evidence: what A3 actually proves

The first A3 record-precedence run was **55 / 57** because superseded or invalid final records could still win the current main-report selection. After repair it became **57 / 57**; the follow-up semantic route check was **14 / 14**, and the Reports / Issues / Mobile / Web Panel integration set was **221 / 221**.

The controlled snapshot contained one current root report, four current subtask reports, twelve historical reports, six resolved ISSUE records, and one open ISSUE. This evidence supports two claims: a green current view must not erase history, and a record-precedence defect was observed before the passing repair. It **does not prove** that every technical failure propagates through REPORT, REVIEW, and every UI surface, and it is not a global failure-rate measurement.

- [A3 report-projection trace (CSV)](/evidence/execution-boundary-20260826/v2/case-a3-projection-precedence-trace.csv)
- [A3 sanitized test and runtime transcript (GitHub)](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/transcript-a3.md)
- [Claim-to-evidence map (GitHub)](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/claim-evidence-map.csv)

### Sources and evidence boundary

- [CrewAI PR #7073](https://github.com/crewAIInc/crewAI/pull/7073): `fix(events): record task failures as failures, not as successes`, merged 2026-08-25. This article uses only its public implementation facts about routing task failures through ERROR semantics and retaining a constrained `error_type`.
- [CrewAI PR #7079](https://github.com/crewAIInc/crewAI/pull/7079): `fix: skip interception hooks on crewai-internal flows`, merged 2026-08-25. It is used only as a neighboring example of separating internal machinery from caller-owned execution boundaries.
- The scope, runtime snapshot, and non-generalization limits for the CodeFlowMu A3 evidence are documented in the [public redacted four-case evidence note](/zh/digital-employee/2026-08-26-execution-boundary-evidence-data). Raw logs, task bodies, and local machine paths are not public.