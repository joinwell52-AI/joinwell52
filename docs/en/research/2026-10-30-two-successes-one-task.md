---
schema: "publication-candidate-article/v2"
title: "The report succeeded. The submit succeeded. Why is the task still open?"
date: "2026-10-30"
published_date: "2026-10-30"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "Can two successful calls for different tasks settle the current task's session?"
summary: "In a two-task control, A's report and B's submission both succeeded. A CodeFlowMu adapter settled A's session as done while the formal FCoP ledger still held A as active."
cover: "/assets/completion-evidence-20261030/two-successes.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Real FCoP 4 operations in temporary projects; private CodeFlowMu Google adapter module comparison; no live model or full UI"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/completion-evidence-20261030/two-successes.cover-v1.png" kicker="Engineering research · Completion and evidence" title="The report succeeded. The submit succeeded. Why is the task still open?" summary="In a two-task control, A's report and B's submission both succeeded. A CodeFlowMu adapter settled A's session as done while the formal FCoP ledger still held A as active." version="2026-10-30" languageHref="/zh/research/2026-10-30-two-successes-one-task" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# The report succeeded. The submit succeeded. Why is the task still open?

One worker has two assignments. They write the report for task A and successfully submit task B for review. If a runtime merely counts “report succeeded” and “submit succeeded,” it may conclude that **A's work session is complete**.

But A was never submitted. We tested exactly this distinction with two disposable tasks in our own system. One CodeFlowMu session-settlement path returned `done` for A, while FCoP, the formal task ledger, still recorded A as `active`. The adapter's `done` describes a **session outcome**, not FCoP's approved `done` lifecycle stage. Even with that distinction, the two layers disagree about whether this session handed off A.

## Why we looked at our own completion boundary

We did not replay someone else's bug. [Paperclip recently fixed a rejected completion report](https://github.com/paperclipai/paperclip/pull/18227): a provider ending normally must not replace a controller's rejection with a successful result. [Codex made recording completeness explicit](https://github.com/openai/codex/pull/58166), independently of the task's terminal outcome. These changes address different products and different failures. Together, they prompted a useful question for us: **which exact work item does each success prove?**

CodeFlowMu is our local multi-agent work system. It uses FCoP to keep formal tasks, reports, and lifecycle transitions. We asked whether its runtime could combine successful calls that belong to different tasks, and whether it could recover a formal report after process-local success flags disappear.

## Two green checks, two different owners

We pinned CodeFlowMu V3.0.129 and FCoP 4.0.5 source revisions and created two real FCoP tasks, A and B, in temporary directories. B already had its own valid report, and both controls wrote A's formal report. The only changed step was the submission: one control submitted A, while the other submitted B. We passed the real operation results through the existing CodeFlowMu Google adapter modules and observed their early-stop and session-settlement decisions.

| What actually happened | Write A, submit A | Write A, submit B |
| --- | --- | --- |
| Formal report for A returned by FCoP | 1 | 1 |
| Adapter's “write succeeded / submit succeeded” flags | Yes / yes | Yes / yes |
| Adapter's session settlement for A | `done` | `done` |
| A's formal FCoP task stage | `review` | `active` |

<figure>
  <img src="/assets/completion-evidence-20261030/two-successes.figure.en.svg" alt="Controlled comparison: writing and submitting A moves A to review; writing A but submitting B leaves A active, although both session settlements say done." />
  <figcaption>Controlled comparison. Read the session outcome and the formal task stage as separate facts.</figcaption>
</figure>

Neither success was a fabricated string. The report write and task submission succeeded through real FCoP operations. The adapter did not stop early when given only the report success or only the submit success; it stopped when the two were combined. **The mistake lies in treating successes for separate tasks as one completion certificate.** The tested runtime contract accumulates two booleans by tool name. Once both are true, it stops early and gives those flags priority during session settlement. The flags do not carry a common task ID or attempt ID, so they cannot establish that A was submitted.

## Without memory flags, the opposite error appears

We then removed the process-local success flags and asked the settlement module to rediscover A's report on disk. Both controls returned `blocked/no_valid_report`, even though FCoP's public query returned A's formal report in each case.

The mismatch is concrete. FCoP 4 stores reports as `REPORT-<UUID>.md` files and uses `subject_ref` to bind them to a task. The tested older finder first looks for a role suffix in the filename, then reads legacy relation fields. It does not use FCoP 4's formal report query. This creates two opposing blind spots in the same module path: **broad in-memory success flags can settle A when it was not submitted; without those flags, a formally recorded report can appear absent.**

FCoP itself did not confuse the tasks. It kept A `active` in the cross-task control and moved A to `review` in the same-task control. `review` means **handed to a reviewer**, not finally approved. The issue is in this runtime adapter's use of the ledger. Ten existing unit tests for the related modules passed, but none covered this cross-task and no-memory-flags comparison.

The experiment also leaves a design choice. Should one session be allowed to advance only its pinned task A, or may it work on both A and B? In the first design, a cross-task submission should be stopped at the call boundary. In the second, the runtime needs a separate outcome for each task, not one aggregate `done`. Our module probe did not establish which behavior the full live-model path permits, so neither design should be presented as an existing rule.

## What should count as a handoff?

Our proposed rule is that a session completion claim should identify **one task, one execution attempt, and one accepted report**, consistent with the formal lifecycle stage. After a restart, the runtime should obtain the report head and task stage through FCoP's public queries. If process-local flags conflict with the ledger, it should retain an “unverified” outcome rather than declare completion or invent a missing report. This is a **proposed contract, not an implemented feature**.

The experiment called real FCoP operations and the current CodeFlowMu Google adapter modules. It did not run a live model, full UI, or production task. It does not establish a deployed incident or a finding in other providers. The [English evidence summary and public FCoP control script](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-10-30-completion-evidence/00-report.en.md) state the method and limits; the private CodeFlowMu source is not in the public repository.

For engineers, the next question is where to enforce the binding: at each tool call, at settlement, or at both. For anyone who has seen an assistant say “done” while work remained open, the most useful detail is simpler: **which layer said done, and where was the actual deliverable?**
