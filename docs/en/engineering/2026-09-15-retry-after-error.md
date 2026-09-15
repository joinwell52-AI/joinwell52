---
schema: "publication-candidate-article/v2"
title: "Why did an AI tool error leave an extra database row?"
date: "2026-09-15"
published_date: "2026-09-15"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "Why did an AI tool error leave an extra database row?"
summary: "One attempt produced two writes; after the fix, three attempts still produced three. Two bounded experiments separate errors from evidence that nothing happened."
cover: "/assets/execution-facts-20260915/retry-after-error.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded pinned-source experiments; scope in article"
pageClass: "execution-facts-article"
---

<ArticleCover image="/assets/execution-facts-20260915/retry-after-error.cover-v1.png" kicker="Open-source engineering · Experiments" title="Why did an AI tool error leave an extra database row?" summary="One attempt produced two writes; after the fix, three attempts still produced three. Two bounded experiments separate errors from evidence that nothing happened." version="2026-09-15" languageHref="/zh/engineering/2026-09-15-retry-after-error" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.execution-facts-article .vp-doc h1[id] { display: none; }</style>

# Why did an AI tool error leave an extra database row?

A tool call failed, yet the database contained two new rows.

We deliberately created that condition: write a row to a temporary SQLite database, commit it, then raise an exception. With the outer attempt limit set to one, we expected one committed row and an error. The predecessor CrewAI code invoked the tool twice and committed two rows.

The proposed fix reduced that to one invocation and one row. Increasing the attempt limit to three then produced three rows with the candidate.

Both observations matter.

## A second invocation inside one attempt

CrewAI organizes agents and their tools. [PR #7458](https://github.com/crewAIInc/crewAI/pull/7458), submitted by Ritiky23, narrows an exception handler around tool invocation.

We study this boundary because we are building a collaboration system too: retry behavior can change files, databases, or external services. Looking only at a returned error can miss an effect that has already happened.

The predecessor placed argument filtering and tool execution inside one `try`. If either failed, its exception handler called the tool again with the original arguments. A fallback intended for argument handling could therefore repeat an operation that had already committed an effect.

The candidate keeps fallback handling around argument filtering and moves execution outside it.

## Count committed rows

We extracted four complete, unchanged tool-usage methods from predecessor `a328710` and candidate `2ab3821`. Tool selection, telemetry, cache behavior, and other surrounding dependencies used doubles. The synthetic tool committed to an actual temporary SQLite file.

Sync and async paths produced the same counts:

| Scenario | Predecessor: calls / committed rows | Candidate: calls / committed rows |
| --- | --- | --- |
| Commit then error; one allowed attempt | 2 / 2 | 1 / 1 |
| Commit then error; three allowed attempts | 6 / 6 | 3 / 3 |
| Success; three allowed attempts | 1 / 1 | 1 / 1 |
| Schema lookup fails; tool then succeeds | 1 / 1 | 1 / 1 |

These are 16 observations across four scenarios, two routes, and two versions. They are not a full CrewAI integration test.

**The candidate removes an unintended repeat within each attempt. It does not make the outer retries business-idempotent.**

![A committed effect can precede a failed response](/assets/execution-facts-20260915/retry-after-error.figure.en.svg)

*Figure 1. Commit and response are separate events. Source: SQLite observations in runs/crew.json and pinned control flow. Six writes becoming three does not mean one business effect.*

## Does an empty history make resending safe?

Orca, an application for managing AI sessions and execution, exposes an adjacent question. In [PR #20723](https://github.com/stablyai/orca/pull/20723), brennanb2025 changes how recovery treats a message absent from session history.

We bundled pinned production modules and their real local imports, then supplied synthetic records. There was no live AI process or actual resend.

For an unknown submission with empty history, a consistent boundary flag, and no turn in flight, the predecessor returned rejected/not-delivered. The candidate kept the result unknown.

In a separate input case, a rejection marked as recovered previously queued the entry and requested a fresh message identity. The candidate retained an unconfirmed entry without requesting a new identity. An unmarked rejection still requested a fresh identity; our synthetic reason was `not_delivered`. That combination is a module input, not proof that a real send path produces it.

That does not prove delivery. It means this empty history cannot prove non-delivery. A resend under a fresh identity could also evade deduplication tied to the original one.

These were separate experiments, not an end-to-end integration: CrewAI covered invocation control flow and actual local writes; Orca covered reconciliation and shared desktop outbox disposition with synthetic inputs. Reviews on the Orca PR also raise rejection-reason restrictions and mobile/orchestration consumers. We did not reproduce those broader paths and do not claim app-wide protection against resending.

## Unknown needs a way out

Keeping uncertainty has a cost. Orca's candidate path can leave subsequent operations waiting. We did not verify eventual automatic resolution.

The resulting design question is what evidence permits a retry. An operation safe to repeat, an operation whose prior receipt can be queried under a stable identity, and an operation with an unknowable effect need different treatment. Neither PR establishes a universal exactly-once mechanism.

For engineers: when the write commits but its receipt is lost, which component retains the stable business identity and can query the existing result? For users: have you seen a submission reported as failed, then discovered it had succeeded after refreshing? What verification option would have helped?

The [public experiment package](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-15-execution-facts) preserves the counts, arguments, counterexamples, and pinned sources. These results establish neither production incident frequency nor a corresponding CodeFlowMu defect.
