---
schema: "publication-candidate-article/v2"
title: "Why Can an Empty History Still Reference an Old Conversation?"
date: "2026-09-14"
published_date: "2026-09-14"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "Why Can an Empty History Still Reference an Old Conversation?"
summary: "Five SDK comparisons and seven brief-selector inputs distinguish clearing history, invalidating references, and restoring the current objective."
cover: "/assets/continuity-20260914/clear-continuation.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded experiments on pinned sources; no live cloud validation"
pageClass: "continuity-contracts-article"
---

<ArticleCover image="/assets/continuity-20260914/clear-continuation.cover-v1.png" kicker="Open-source engineering · Experiments" title="Why Can an Empty History Still Reference an Old Conversation?" summary="Five SDK comparisons and seven brief-selector inputs distinguish clearing history, invalidating references, and restoring the current objective." version="2026-09-14" languageHref="/zh/engineering/2026-09-14-clear-continuation" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.continuity-contracts-article .vp-doc h1[id] { display: none; }</style>

# Why Can an Empty History Still Reference an Old Conversation?

A user clears a session. Reading its history returns an empty list. Yet the next context-compaction operation may still send an old response ID to the model service.

Deleting records and stopping references to them are separate operations. There is an additional complication: deletion can commit before cancellation or an error interrupts its acknowledgement. The caller sees failure after the underlying state has changed.

We ran five local comparisons around an OpenAI Agents SDK candidate fix. All passed on the pinned candidate. Replacing only its clear method with the predecessor produced four failures; the existing concurrency control still passed. This narrows the problem to reference invalidation rather than a general absence of concurrency protection.

## What exists outside the history list?

The SDK's compaction-session wrapper prepares shorter context through the OpenAI Responses compact endpoint. It can supply current items or continue from a previous response ID.

[PR #5000](https://github.com/openai/openai-agents-python/pull/5000) addresses references left behind by clearing. The old method already cleared a deferred-compaction pointer and incremented an internal mutation generation. It retained the current response ID and the last unstored response ID, however, allowing a later operation to refer to the old chain.

The PR remained open when read for this study. Our results concern pinned candidate source, not a general guarantee about a released version.

## Test the gap between deletion and acknowledgement

We used Python 3.12.10, the complete pinned SDK source, and original upstream tests. The remote compact endpoint was an `AsyncMock`: request arguments were observable, but no real OpenAI service was contacted. Four cases were added by the fix; one was an existing concurrency control.

| Scenario | Predecessor clear method | Candidate fix |
| --- | --- | --- |
| Normal clear must invalidate the old response chain | Fails | Passes |
| SQLite deletion commits, then the caller is cancelled | Fails | Passes |
| SQLite deletion commits, then acknowledgement raises | Fails | Passes |
| Auto compaction uses current input after clear | Fails | Passes |
| Clear waits for in-flight compaction and leaves empty history | Passes | Passes |

The two acknowledgement cases used a real temporary SQLite database. The test paused after `commit()`, then injected cancellation or an error before acknowledgement returned. It checked that history was empty, the lock was released, and the old response chain could not be reused. The fixed path also accepted a subsequent write and a new response ID.

![Cleared history and invalidated continuation references](/assets/continuity-20260914/clear-continuation.figure.en.png)

*Figure 1. The experiment's observation boundaries. Source: this study's runs/sdk.json and upstream-test logs; SQLite commits were real local operations and the compact endpoint was a test double.*

The predecessor failed assertions such as requiring rejection when no new response ID was supplied. That establishes the wrapper's continued use of an old reference path. It does not show a real remote server recovering deleted data.

## A generation counter does not clear a pointer

Adding a reset generation sounds like a natural remedy. This implementation already had a mutation generation and a mutation lock. The fifth control still passed when we substituted the old clear method.

The fix instead invalidates two omitted response pointers in both successful and exceptional cleanup. A generation tracks whether state changed; a pointer determines where a later request connects. The presence of the former does not establish invalidation of the latter.

For our own engineering review, the useful first step is to enumerate existing continuation references and inspect successful clear, cancellation, and failed acknowledgement for each. Tests should observe what the next consumer reads, not just how many history rows the interface displays.

## Another old relationship survives a resumed session

[Paperclip #13345](https://github.com/paperclipai/paperclip/pull/13345) concerns a different mismatch: the right provider conversation resumed, but the invocation omitted an edited task description and promoted an old comment as the objective.

We separately checked seven base/head inputs to its original brief selector. With a normalized-wake test double, two ordinary-resume inputs changed from the compact task identifier to the current full brief; fresh, assignment, recovery, and other controls retained their corresponding behavior. This tests selection and supporting helpers, not database objective selection or a real resumed provider run.

The two problems require different actions. Clearing in the SDK must sever invalid continuation references. Resuming in Paperclip must deliver current instructions into a conversation that remains valid. Their shared investigative method is to inspect what the next invocation actually uses.

Our next step is an inventory of existing history, response, deferred-work, and retry references in our own runtime: who consumes each, and who invalidates it? Successful clear, cancellation, and failed acknowledgement should be tested before deciding whether an additional generation mechanism is needed.

This study does not establish cross-process restart behavior, remote erasure, or general authorization revocation. It supplies a smaller acceptance question: after clearing, can the next consumer still obtain the old relationship?

The [evidence package](../research/evidence/2026-09-14-continuity-contracts) preserves five SDK comparisons and seven brief-selection conditions. Materials are maintained in the [research repository](https://github.com/joinwell52-AI/joinwell52).
