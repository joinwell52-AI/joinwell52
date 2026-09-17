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

One possibility is that the provider supplied a cause, while the program recorded only “this step failed.” “The warehouse is closed today” became “delivery failed,” so another delivery was scheduled.

## Where did the cause get lost?

The source is [Paperclip #13549](https://github.com/paperclipai/paperclip/pull/13549), by electrumnz. Paperclip coordinates ongoing AI work, including recovery after failures.

The author reported 320 quota-related terminal runs in a production review, 186 carrying retry links, while quota reasons were missing. That is upstream evidence; we did not access the production data. It caught our attention because trying again may help a temporary network failure, while repeatedly trying before quota resets may achieve nothing.

To choose a next step, the program must first identify the cause. The patch adds a previously missed entry point: when a message arrives under a failed-turn error code, the classifier also checks it for quota information.

The question is therefore not just whether the provider explained the failure. **Did that explanation reach the code responsible for producing a waiting time?**

## Send the same sentence through again

We extracted the original classification code and parsing helpers from both revisions and supplied the same nine inputs. One described exhausted quota and specified when it would reset.

| Input | Before | Candidate |
| --- | --- | --- |
| Quota message with a reset time, through the failed-turn entry point | No classification | Quota recognized; reset time calculated from the message |
| Quota message without a reset time | No classification | Quota recognized; default one-hour wait |
| Ordinary socket failure | No classification | Still no classification |
| Missing key through the existing adapter-failure entry point | Configuration incomplete | Still configuration incomplete |

Both of the first two rows produce a time, but for different reasons. One comes from the provider's message; the other is a fallback used when information is missing.

That distinction matters to someone waiting. “Try again at this time” can sound like a promise that service will be available. **A default one-hour delay says when the program proposes to try again; it makes no such promise about the provider.**

![Similar-looking retry times can have different foundations](/assets/control-intent-20260917/quota-behind-error-code.figure.en.svg)

*Figure 1. Source: author illustration from the two original classifiers. Exact timestamps and timezone conversion remain in the experimental supplement.*

This verifies what the classifier returns. Whether the program arranging the next execution actually waits accordingly needs a further test. The table alone cannot establish that the complete retry problem is solved.

## A keyword can appear in a denial

We deliberately supplied this sentence:

> No quota exceeded. Socket failed.

The candidate still classified it as a quota problem and returned the default one-hour wait.

This was a constructed counterexample; we have no evidence that a real provider sends that wording. It demonstrates a limit of keyword matching: recognizing a word does not necessarily establish what the sentence means.

Another input supplied an invalid timezone and also triggered the fallback. An equally precise-looking time can therefore come from successful parsing or a backup rule. Preserving that distinction helps explain why the program waits as it does.

## A timestamp needs an explanation

A useful next direction is for provider adapters to pass an explicit cause and reset time, reducing reliance on prose. When inference or fallback is needed, its basis should remain available. That is a design direction; this experiment tested only the classifiers.

Users can help examine the next part of the chain. Save the original message and time, then record whether retries keep accumulating and whether work resumes when expected. Those observations help connect “cause recognized” to “execution actually waited.”

**When a tool says “wait until this time,” can it also tell you whether the provider supplied that time or the program estimated it?**

<details>
<summary>Revisions and experimental boundary</summary>

### Original detailed comparison

The experiment clock was September 16, 2026, 04:50 UTC. The message specified 21:20 Pacific/Auckland, parsed as 09:20 UTC. Without a reset time, the one-hour fallback yielded 05:50 UTC. The PR was open at our source read; that timestamped status does not claim it remains unchanged.

The newly included entry point is `acpx_turn_failed`. The output field `parsedResetTime` distinguishes a parsed reset from a fallback. “No classification” means this function returned null; it does not establish that all downstream handling immediately retries.

| Input | Before | Candidate |
| --- | --- | --- |
| Quota message through the failed-turn entry point | No classification | Provider quota; retry at 09:20 UTC |
| Quota message without a reset time | No classification | Provider quota; retry at 05:50 UTC |
| Ordinary socket failure | No classification | Still no classification |
| Missing key through the existing adapter-failure entry point | Configuration incomplete | Still configuration incomplete |

Base: `d0b67bfe71277f5a5ad21c7a7b6cb7af09e2ccca`. Candidate: `688c994a95d6c447816c50b14e30745d8ea9e855`. Checked source anchors extract the original classifier block and its original parsing helpers. Nine inputs across two versions produce 18 observations, not 18 live provider calls.

Additional inputs cover a structured retryNotBefore value yielding 12:00 UTC, an unknown error code, an invalid timezone, and missing-key messages entering through different error codes. The negated sentence is deliberately synthetic.

We did not run the recovery scheduler, database scan, production account or model. [Results and reproduction scripts](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-17-control-intent). The experiment does not establish the same error path or quota-retry defect in CodeFlowMu.

</details>

[Research repository](https://github.com/joinwell52-AI/joinwell52)
