---
schema: "publication-candidate-article/v2"
title: "The quota is exhausted. Why is the agent still retrying?"
date: "2026-09-17"
published_date: "2026-09-17"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "The quota is exhausted. Why is the agent still retrying?"
summary: "A provider can name the reset time while a recovery system sees only a failed turn. We trace the same message through two versions of the classifier."
cover: "/assets/control-intent-20260917/quota-behind-error-code.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded original-code experiments; scope in article"
pageClass: "control-intent-article"
---

<ArticleCover image="/assets/control-intent-20260917/quota-behind-error-code.cover-v1.png" kicker="Open-source engineering · Experimental research" title="The quota is exhausted. Why is the agent still retrying?" summary="A provider can name the reset time while a recovery system sees only a failed turn. We trace the same message through two versions of the classifier." version="2026-09-17" languageHref="/zh/engineering/2026-09-17-quota-behind-error-code" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.control-intent-article .vp-doc h1[id] { display: none; }</style>

# The quota is exhausted. Why is the agent still retrying?

The agent stops. Its provider says the quota is exhausted and gives a reset time for later that evening.

Then the task retries. The counter rises; the work goes nowhere. Which part of the message did the system fail to understand?

One possibility is that the provider supplied a cause, while the recovery system recorded only the stage that failed. “The warehouse is closed today” became “delivery failed,” so another delivery was scheduled.

## A failed turn is not a recovery decision

The source is [Paperclip #13549](https://github.com/paperclipai/paperclip/pull/13549), by electrumnz. Paperclip coordinates ongoing AI work, including recovery after failures.

The author reported 320 quota-related terminal runs in a production review, 186 carrying retry links, while quota reasons were missing. **Those are upstream-reported numbers. We did not access that production data or reproduce those 320 runs.** The PR remained open at our read.

It caught our attention because long-running tasks need more than a generic retry reflex. A temporary network failure, a missing credential and exhausted quota require different next steps.

The patch addresses one specific entry point: `acpx_turn_failed`, which identifies a failed turn. Previously, that entry point did not receive the quota check. The proposed change routes it through that classification.

## Same message, different answer

We extracted the original classifier block and parsing helpers from fixed revisions, then supplied nine inputs to both versions.

One input described exhausted session quota with a reset at 9:20 p.m. in Pacific/Auckland. We fixed the experiment clock at September 16, 2026, 04:50 UTC.

| Input | Before | Candidate |
| --- | --- | --- |
| Quota message through the failed-turn entry point | No classification | Provider quota; retry at 09:20 UTC |
| Quota message without a reset time | No classification | Provider quota; retry at 05:50 UTC |
| Ordinary socket failure | No classification | Still no classification |
| Missing key through the existing adapter-failure entry point | Configuration incomplete | Still configuration incomplete |

The first row shows the previously missed cause being recognized. The second uses a one-hour fallback from the experiment clock. **05:50 is not a reset time promised by the provider.**

“No classification” also does not prove that the complete system immediately retries; other handling may follow. We tested classification, not the scheduler or a live provider. These results cannot establish that a production retry storm has ended.

![Failure stage, quota cause and waiting time](/assets/control-intent-20260917/quota-behind-error-code.figure.en.svg)

*Figure 1. Source: author illustration from the original classifier outputs. The parsed 09:20 time and fallback 05:50 time have different evidential bases.*

## Recognizing words is not the same as understanding a sentence

Text matching provides a useful compatibility layer, with limits.

We deliberately supplied: “No quota exceeded. Socket failed.” The candidate still classified it as quota exhaustion and returned the one-hour fallback.

This synthetic probe does not establish that a real provider emits that wording, or that production has suffered such a misclassification. It shows the boundary of keyword recognition: the words can appear while the sentence denies the condition.

Another input used an invalid timezone and also fell back to a default wait. Two equally precise-looking retry timestamps may therefore mean different things: one was parsed from the provider’s message; another was estimated by the program.

Preserving the cause is useful. Preserving how the cause and time were obtained matters too. Otherwise a precise timestamp can suggest more certainty than its evidence supports.

## What should be investigated next?

Could adapters provide a structured cause and reset time, leaving text matching as a fallback? Can logs distinguish provider-supplied information, inferred information and a default wait? When a timezone cannot be interpreted, what should the interface tell the person waiting?

These are follow-up design and validation questions. We verified that adding the entry point changes the classifier output for the same quota message. Whether that output actually constrains later retries requires an experiment through the scheduler.

Users can contribute concrete observations as well. When the interface says “quota exhausted,” does the retry count keep increasing? Once the displayed reset time passes, does work resume or remain stuck? The message, timezone and occurrence time are much more useful evidence than “it failed again.”

<details>
<summary>Revisions and experimental boundary</summary>

Base: `d0b67bfe71277f5a5ad21c7a7b6cb7af09e2ccca`. Candidate: `688c994a95d6c447816c50b14e30745d8ea9e855`. Checked source anchors extract the original classifier block and its original parsing helpers. Nine inputs across two versions produce 18 observations, not 18 live provider calls.

Additional inputs cover a structured retryNotBefore value yielding 12:00 UTC, an unknown error code, an invalid timezone, and missing-key messages entering through different error codes. The negated sentence is deliberately synthetic.

We did not run the recovery scheduler, database scan, production account or model. [Results and reproduction scripts](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-17-control-intent). The experiment does not establish the same error path or quota-retry defect in CodeFlowMu.

</details>

[Research repository](https://github.com/joinwell52-AI/joinwell52)
