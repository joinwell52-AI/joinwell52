---
schema: "publication-candidate-article/v2"
title: "Same task ID. Is it still the same work?"
date: "2026-10-29"
published_date: "2026-10-29"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "Same task ID. Is it still the same work?"
summary: "An old test supports a new report; a new task receives a previously archived ID. Two FCoP and CodeFlowMu experiments ask what actually binds identity to evidence."
cover: "/assets/task-identity-20261029/same-id.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Pinned public source; controlled FCoP v3 compatibility and CodeFlowMu-open project probes"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/task-identity-20261029/same-id.cover-v1.png" kicker="Open-source engineering · Local comparison" title="Same task ID. Is it still the same work?" summary="An old test supports a new report; a new task receives a previously archived ID. Two FCoP and CodeFlowMu experiments ask what actually binds identity to evidence." version="2026-10-29" languageHref="/zh/research/2026-10-29-same-task-id-different-work" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# Same task ID. Is it still the same work?

An AI team receives a job numbered `001`. When an executor submits a report, the reviewer uses that number to find the test result, deliverable, and history. Matching numbers appear to connect the evidence.

We tried two controlled comparisons in temporary projects. In one, **a new session's completion report was supported by a test from an older session**. In the other, **a new task received the ID of a task already moved into deep history**. Neither is a known production incident. Together they make a precise question unavoidable: a number helps us find records, but does it prove that those records belong to **this instance of work**?

## Two outside projects prompted a check of our own

[agent-claimcheck](https://github.com/B0yko/agent-claimcheck) is an open-source tool for checking an agent's success claims against tool receipts and environment state probes. Claims it cannot verify are left for human review. It reminds us that **“done” is a claim that needs evidence**. [Beads](https://github.com/gastownhall/beads) is a persistent task and dependency tracker for coding agents. Its [PR #7931](https://github.com/gastownhall/beads/pull/7931) retains old identities on a specific cleanup path so a late operation cannot treat a retired ID as fresh.

These projects do not study the same implementation. One illuminates evidence for a claim; the other illuminates identity after cleanup. Their intersection matters to us because we use two adjacent systems: **FCoP** records an AI team's tasks and reports as files; **CodeFlowMu** coordinates execution, collects action evidence, and handles review. What does a task ID promise when it crosses that boundary?

The experiments below pin the public source available on October 29, 2026: FCoP 4.0.5's **v3 compatibility API** and the public `main` branch of CodeFlowMu-open. CodeFlowMu-open is a frozen historical public edition; it does not represent the current private product. We do not present either outside project's tests as our own results.

## Boundary one: the task stayed the same, but the execution did not

First, we used FCoP's compatibility API to create a real task and completion report. The report cites the task and says `status: done`, but it has **no session or run identifier**. That is the file the API currently emits.

We then supplied CodeFlowMu with a controlled action history. An older session ran `npm test` at 10:00 with exit code 0. A new session wrote a report at 11:00 claiming that this delivery passed its test. The new session did not run a test. We passed the FCoP-generated report through CodeFlowMu's report-processing entry point.

| Report input | Fact-check result | Subsequent handling |
| --- | --- | --- |
| Original FCoP report: task ID, no session binding | `pass` | Proceeds toward review |
| Same report explicitly bound to the new session | `needs_admin` | Held for human reconciliation |

The old test is not necessarily invalid. A team may reasonably reuse it if the code, environment, and acceptance conditions still apply and someone explicitly accepts that inheritance. The experiment shows a narrower boundary: **without a session binding, the tested path aggregates action evidence by task ID; the report itself cannot distinguish legitimate inheritance from a coincidental match to older work.** Once the new session is bound explicitly, its missing test becomes a visible uncertainty.

CodeFlowMu also has two distinct checks here. `review_check` can check whether a report refers to the right task, but it does not read the contents of a deliverable named in the report. Fact checking occurs later in the report-processing path. We exercised that cross-project path for the table above; a single check function's `ok` does not mean the business outcome was approved.

![The task ID matches, but inheritance between the old session's action and the new report is unspecified](/assets/task-identity-20261029/same-id.figure.en.svg)

*Figure: evidence association in the first controlled experiment. “Unresolved” names an engineering question, not a finding that a real delivery was wrongly approved.*

## Boundary two: the work changed, but the number did not

Next we tested the identity of the task itself. FCoP's v3 compatibility API can move a closed task into date-sharded deep history. In a temporary project with one task created that day, we made `TASK-20261029-001`, archived it, moved it into history, and created a different task on the same day.

The new task received `TASK-20261029-001` again. The old file still existed. A normal task lookup by that ID returned the **new task**, while a history lookup returned the **old task**. A late report containing only that ID cannot identify which generation of work it intended to answer. We wrote such a report, but **we did not observe a real external side effect from a late retry**.

This result has a strict scope. It concerns the **v3 compatibility API** retained in FCoP 4.0.5. FCoP 4.0's native Core uses UUID task identities, so the compatibility result cannot be attributed to its native mechanism. CodeFlowMu-open's own task ID allocator scans history: with `001` in history, our comparison returned `002`. We therefore cannot claim that all CodeFlowMu task-creation paths reuse IDs.

## One question behind both observations

In the first experiment, the **logical task stayed the same but the execution session changed**. In the second, the **logical task changed while the visible ID was reused**. These are different mechanisms. They present the reviewer with the same question: when two records share a `task_id`, what else establishes that the evidence proves the work now under review?

Three practical checks follow:

1. **Which job is this?** After archival or migration, is the old identity still reserved, or is there a different job with the same label?
2. **Which execution produced it?** Which session or run produced the report and the supporting action?
3. **How was earlier evidence inherited?** If it may be reused, who accepted its scope, and what changes would invalidate it?

These checks are **research questions raised by the experiments**, not a protocol we have implemented. A possible design may need a stable task identity, an execution instance, and an explicit evidence-inheritance record. Before choosing a format, we need to examine FCoP compatibility writes, every relevant CodeFlowMu creation path, and the distribution of reports in real projects.

If your agents handle real work, one check is available now: when the system says “tests passed, task complete,” ask **which execution produced the test for this delivery**. If the answer is only the same task number, the evidence chain is not yet fully explained. For engineers, the harder follow-up is when an older test may legitimately be inherited—and how little identity data must survive long-term archival to prevent mistaken reuse without retaining content forever.

Pinned revisions, reproduction scripts, observed results, and limits are in the [English experiment report](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-10-29-task-identity/00-report.en.md). These are controlled temporary-project comparisons. We have not measured incidence in real projects or observed an online misapproval or duplicate execution. [Research repository](https://github.com/joinwell52-AI/joinwell52)
