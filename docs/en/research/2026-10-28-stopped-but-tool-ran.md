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
summary: "A 16-case comparison opens a larger question: when an AI says it stopped, what facts should it provide about queued work, active calls, and external effects?"
cover: "/assets/execution-boundaries-20261028/stopped-but-tool-ran.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Pinned source; upstream before-and-after replay and independent synthetic remote probe"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/execution-boundaries-20261028/stopped-but-tool-ran.cover-v1.png" kicker="Open-source engineering · Controlled comparison" title="The AI stopped. Why did a queued tool still start?" summary="A 16-case comparison opens a larger question: when an AI says it stopped, what facts should it provide about queued work, active calls, and external effects?" version="2026-10-28" languageHref="/zh/research/2026-10-28-stopped-but-tool-ran" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# The AI stopped. Why did a queued tool still start?

Imagine asking an AI assistant to inspect some material, organize files, and then take an action. A check fails during the first step. The assistant reports that the task has failed and execution has stopped.

That sounds reassuring. But a second tool may already be running, while a third is waiting in a queue. **Reporting a failure** and **preventing the next action** are different events. For an agent that can call external tools, the time between them matters more than the final message.

The deeper question in this article is: **what evidence would make “stopped” a trustworthy claim?** One status label cannot describe queued work, in-flight calls, and operations already sent to an outside system. We first test the execution queue, then place that result in the larger engineering problem.

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

## A second counterexample: a remote outcome can outlive cancellation

That comparison answers whether a queued call starts. It does not answer what happens to an action already handed to an external system. We built a separate probe through the merge commit's real `Runner` and tool entry point. An active tool gives a request to a **synthetic delayed remote worker** before a function failure is selected. The worker is a separately scheduled task in the same process, not a network service.

At the failure point, the active tool had received cancellation and the queued call had not started. Yet the worker had accepted the request. We released it only after the local run ended, and it still committed. This did not uncover a new OpenAI SDK bug. It establishes a narrower boundary: **a local stop status cannot answer for the final outcome of a request already accepted elsewhere.** The [probe and two state snapshots](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-10-28-execution-boundaries) are public.

![A selected function failure cancels an active tool and keeps a queued call behind the boundary](/assets/execution-boundaries-20261028/stopped-but-tool-ran.figure.en.svg)

*Figure: the controlled schedule we tested. It does not imply rollback of a tool action already completed elsewhere.*

## From cancellation to a checkable stop record

The fix makes a selected failure visible to other tool execution: active native tools receive cancellation, and their queue stops releasing new calls. It still gives already completed output a bounded finalization window. A cancellation requested by the caller takes priority.

The direct observation is that, in these controlled schedules, a selected failure no longer leaves the active and queued native work on the old path. A more complete stop record needs to answer three separate questions:

1. **Was the queue closed?** Could a late message, retry, or next tool call restart work? The [Codex 0.165.0 release notes](https://github.com/openai/codex/releases/tag/rust-v0.165.0) describe a fix for queued agent messages restarting work after an interrupt. That is an upstream release fact from another project, not something we retested here.
2. **Where did the active call end?** Cancelling a Python task need not mean its underlying executor has stopped. The [AG2 1.2.2 release notes](https://github.com/ag2ai/ag2/releases/tag/v1.2.2) explicitly caution that a synchronous tool worker may keep running after a timeout and may have side effects. Our synthetic tools observed cancellation signals; they cannot stand in for a real worker.
3. **Was the external outcome resolved?** The synthetic probe shows that an accepted request may commit after local cancellation. [Paperclip's handover implementation](https://github.com/paperclipai/paperclip/pull/17439) pauses uncertain mutations for later verification. It offers a useful comparison; we did not run Paperclip's handover path.

These three questions are an **engineering judgment drawn from our two bounded probes and three separately sourced changes**. They are not a protocol validated against a real network service. Cancellation itself does not reverse an external effect. PR #5446 was merged; we did not verify its inclusion in a specific package release.

A minimal stop record worth discussing would distinguish calls that never started, calls that received cancellation but have not confirmed completion, and calls whose external outcome remains unknown. Each needs a time and tool identity. A resumed agent could then see which work needs no replay and which external state must be checked first. We have not implemented or tested this record format.

If an agent handles real work for you, a concrete question is: after a failed check or a stop request, can it tell you which calls never started, which had already started, and which may still have an uncertain external outcome?

A next experiment should replace the synthetic worker with an independently queryable service and inspect the record given to a resumed agent. This probe did not test recovery. Engineers can debate who should reconcile the uncertain outcome: the tool, the runtime, or the application. Users may recognize the symptom too: a task says it stopped, yet a file or remote state changes later. The event sequence is more informative than the label.

See the [public experiment report](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-10-28-execution-boundaries/00-report.en.md) for pinned versions, independent probe, commands, and limits. This round combines a local before-and-after replay with a synthetic counterexample, not a production incident reproduction. [Research repository](https://github.com/joinwell52-AI/joinwell52)
