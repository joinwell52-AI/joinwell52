---
title: "Failures Must Not Be Hidden Behind a Green Check: What CrewAI Shows About Keeping Technical Failure Separate from Delivery Conclusions"
date: '2026-08-26'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "How can a runtime record a technical failure truthfully without converting it automatically into a business delivery conclusion?"
summary: "Separates tool outcomes, delivery evidence, and formal acceptance using CrewAI's public fixes and bounded first-party runtime records."
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
  title="Failures Must Not Be Hidden Behind a Green Check: What CrewAI Shows About Keeping Technical Failure Separate from Delivery Conclusions"
  summary="Technical failure, task evidence and formal acceptance need separate records; a green check cannot erase a fault or sign a business conclusion."
  version="EBR-20260826-03"
  status="Engineering Research · 2026-08-26"
  languageHref="/zh/digital-employee/2026-08-26-agent-failure-and-delivery-boundary"
  languageLabel="中文"
/>

# Failures Must Not Be Hidden Behind a Green Check: What CrewAI Shows About Keeping Technical Failure Separate from Delivery Conclusions

In a CrewAI failure-semantics repair, the team found a counterintuitive scene: a failed task passed through `close_span()` and its trace was still written as `OK`. The PR authors report roughly 240 million task executions across about 13 months with a zero monthly `error_count`; they describe another path in which a task failure without a crew could be popped without being closed or exported. The failure had not vanished. It had been covered by green.

[PR #7073](https://github.com/crewAIInc/crewAI/pull/7073) repairs that path by sending failure through an error path and retaining `error_type`. Those figures are the PR’s own context, not independently verified results in this article. The implementation records an exception class rather than an exception message, reducing the risk that prompts, paths, or credentials leak into traces. Starting from that real scene, this article asks the other half of the question: how can a runtime acknowledge technical failure without turning every timeout, cancellation, or rejection into “business task failed”?

[PR #7079](https://github.com/crewAIInc/crewAI/pull/7079) makes a related distinction: framework-internal flows such as routing and memory recall should not be mistaken for user automation. It preserves an observable, blockable boundary for standalone `Agent.kickoff()` that owns the root execution. These are the two currently merged public fixes.

One related direction is worth watching but must stay outside the current-capability claim. The still-open [PR #7067](https://github.com/crewAIInc/crewAI/pull/7067) proposes typed MCP authentication failures that retain HTTP status and adds 72 MCP tests. It shows that finer-grained failure attribution is being discussed; it is not a mature, merged CrewAI feature.

## One “done” must not hide three facts

| Layer | Question | Appropriate examples |
| --- | --- | --- |
| Technical action | What happened to this tool call or job? | completed, failed, cancelled, orphaned |
| Delivery evidence | What artifacts support or challenge delivery? | REPORT, test log, change summary, missing evidence |
| Formal acceptance | Did an authorized role accept that evidence? | accepted, returned, rejected, pending adjudication |

The layers may influence one another, but none may impersonate another. A build failure must remain a failure. A successful exit creates evidence, not acceptance. Cancellation and timeout are initially technical facts: they should create diagnosis, retry, or takeover options—not a silent declaration of business failure.

## Why failures disappear

Failure can be lost through ordinary-looking mechanisms: a logger that fails to persist, a retry that overwrites the original error, a UI showing only the last status, or a framework-internal action treated as a user operation. Each can turn an auditable negative fact into a clean but false green check.

CrewAI repairs a false green in the telemetry chain: when failure occurs, the trace must not say success. Carrying that principle into a private runtime requires one more step—persisting tool-failure type, delivery evidence, and formal acceptance as separate facts. Otherwise a failure visible to observability can still be flattened again by task governance or a UI projection.

The CodeFlowMu private implementation reviewed here provides limited but useful evidence of a different approach. Its Action Evidence adapter maps `failed` and `error` to failed; managed commands classify failure as `none`, `expected_rejection`, `authority_rejection`, `environment`, or `product`; calls that are still running are not prematurely written as terminal. A separate observer records report writes to avoid duplication. But the Evidence logger is best-effort: a logging failure only warns and does not halt the original call. Absence of a log therefore cannot mean that a call never happened or succeeded.

A historical managed-job snapshot contains 21 records: 9 completed, 2 failed, and 10 running. The failed records retain `MANAGED_COMMAND_WRAPPER_EXITED_WITHOUT_RESULT`. That shows failure classification exists in this historical slice; it is not a global failure rate or a substitute for end-to-end tool-failure → REPORT → REVIEW → UI verification.

![State categories in a historical managed-job snapshot](/assets/covers/2026-08-26-managed-job-snapshot.svg)

*Figure 1. 21 first-party managed-job records in one historical snapshot. “Running” describes state at capture time, not eventual outcome. Source: access-controlled CodeFlowMu managed-job snapshot, accessed 2026-08-26.*

## Use a three-column incident view

| Technical terminal state | Delivery evidence | Formal conclusion |
| --- | --- | --- |
| `cancel_failed` | cancellation request and process diagnostics preserved | undecided; hand to task owner |
| `failed: authority_rejection` | rejection reason and action digest | not a delivery rejection; reauthorization may be possible |
| `completed` | test report and change are inspectable | still requires REVIEW/ADMIN acceptance |

This view makes room for recovery without rewriting history. A runtime should make failure observable, attributable, and replayable. It should not turn its own visibility of failure into a business conclusion.

## Our view: retain the failure; reach the conclusion later

CrewAI’s fixes show that an `OK` in telemetry cannot overwrite a real failure, and internal framework activity must not impersonate a user-business action. Our view is that a runtime must carry this rule into the delivery chain: failure, cancellation, and orphaned work remain technical facts first; a `REPORT` records evidence; `REVIEW` and human acceptance produce a business conclusion. CodeFlowMu’s historical snapshot of 21 managed jobs and its failure taxonomy show that this distinction exists in the material inspected, but they do not establish a complete failure → REPORT → REVIEW → UI chain. The article therefore argues for completing the chain rather than presenting the current snapshot as a universal closure.

One question for CrewAI follows from its separation of internal flows and root execution boundaries: can traces also retain boundary provenance explaining why a governance hook was intentionally skipped? That is a question for further work, not a feature claimed by this article.

### Sources

- [CrewAI PR #7073: error tracing for failed tasks](https://github.com/crewAIInc/crewAI/pull/7073), accessed 2026-08-26.
- [CrewAI PR #7079: skip interception hooks on CrewAI-internal flows](https://github.com/crewAIInc/crewAI/pull/7079), accessed 2026-08-26.
- [CrewAI PR #7067: proposed typed MCP authentication failures](https://github.com/crewAIInc/crewAI/pull/7067), open PR, accessed 2026-08-26.
- CodeFlowMu private Action Evidence, managed-command snapshot, and report-projection material; access-controlled first-party evidence.
