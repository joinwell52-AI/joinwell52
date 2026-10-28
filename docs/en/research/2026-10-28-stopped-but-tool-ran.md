---
schema: "publication-candidate-article/v2"
title: "The AI stopped. Why did a queued tool still start?"
date: "2026-10-28"
published_date: "2026-10-28"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "The AI stopped. Why did a queued tool still start?"
summary: "Reporting a failure does not necessarily stop execution. We ran the same 16 controlled schedules against OpenAI Agents Python before and after its fix."
cover: "/assets/execution-boundaries-20261028/stopped-but-tool-ran.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Pinned source; local before-and-after replay of upstream regression tests"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/execution-boundaries-20261028/stopped-but-tool-ran.cover-v1.png" kicker="Open-source engineering · Controlled comparison" title="The AI stopped. Why did a queued tool still start?" summary="Reporting a failure does not necessarily stop execution. We ran the same 16 controlled schedules against OpenAI Agents Python before and after its fix." version="2026-10-28" languageHref="/zh/research/2026-10-28-stopped-but-tool-ran" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# The AI stopped. Why did a queued tool still start?

Imagine asking an AI assistant to inspect some material, organize files, and then take an action. A check fails during the first step. The assistant reports that the task has failed and execution has stopped.

That sounds reassuring. But a second tool may already be running, while a third is waiting in a queue. **Reporting a failure** and **preventing the next action** are different events. For an agent that can call external tools, the time between them matters more than the final message.

## Why we followed this change

Among the [18 engineering developments we collected on October 28](https://joinwell52-ai.github.io/joinwell52/en/runtime/daily-intelligence/2026-10-28), [OpenAI Agents Python PR #5446](https://github.com/openai/openai-agents-python/pull/5446) describes a precise gap. A function-tool failure had already been selected as the run's error. While previously completed output was being finalized, a queued native tool could still proceed. A parallel input guardrail rejection created a related stopping boundary.

Our question was: **When does “stop” actually reach the execution queue?** Pinned code on both sides of the fix and a common test make that question testable.

## Separating “reported error” from “stopped action”

We did not call a real model or let tools change real files or network resources. The upstream regression test uses a `ScriptedModel` to emit a known sequence of tool calls. Synthetic custom and local shell tools record whether they start and receive cancellation. The test controls the moment when one tool is active, another is queued, and a function failure is selected.

We ran the same test against the pre-fix commit [`a91f0bfe`](https://github.com/openai/openai-agents-python/tree/a91f0bfe013a63ce0ad8935c8c2d25047d249002) and merge commit [`cd26bbbc`](https://github.com/openai/openai-agents-python/tree/cd26bbbc52847845fde73b9952b51e62e2bcbdc0). It combines two tool kinds, streaming or non-streaming, rejected or accepted input, and cleanup with or without an error: 16 controlled schedules.

| Source | Result across 16 schedules | What the result means |
| --- | --- | --- |
| Before the fix | **16/16 failed** | The active native tool did not receive the expected cancellation during this window. |
| Merge commit | **16/16 passed** | In the same schedules, the active tool was cancelled and the queued call stayed behind the stopping boundary. |

We also ran both related test files at the merge commit: **84/84 passed**. This does not mean 84 real-world situations are safe; it means those regression checks passed. All 16 pre-fix failures reached the same cancellation assertion. We printed the module path to verify that the old-source run actually loaded the old source.

![A selected function failure cancels an active tool and keeps a queued call behind the boundary](/assets/execution-boundaries-20261028/stopped-but-tool-ran.figure.en.svg)

*Figure: the controlled schedule we tested. It does not imply rollback of a tool action already completed elsewhere.*

## What changed, and what did not

The fix makes a selected failure visible to other tool execution: active native tools receive cancellation, and their queue stops releasing new calls. It still gives already completed output a bounded finalization window. A cancellation requested by the caller takes priority.

This suggests three different promises: **stop new work, cancel active work, and undo an external side effect**. Our controlled test supports the first two within its specified schedules. It cannot show that a remote service reverses an action already submitted. We did not check which packaged release includes the merged PR.

If an agent handles real work for you, a concrete question is: after a failed check or a stop request, can it tell you which calls never started, which had already started, and which may still have an uncertain external outcome?

For engineers, the next question is how a run record should represent the interval between external submission and cancellation, so a resumed agent knows which effects need human verification. For users, have you seen a task shown as stopped while a file or remote state still changed? The sequence of events is more informative than the label “stopped.”

See the [public experiment report](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-10-28-execution-boundaries/00-report.md) for pinned versions, commands, and limits. This was a **local replay of an upstream regression test against old and fixed source**, not a production incident reproduction. [Research repository](https://github.com/joinwell52-AI/joinwell52)
