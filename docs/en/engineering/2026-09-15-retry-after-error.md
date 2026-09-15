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
summary: "After “submission failed,” is trying again safe? We made a tool save a record and then fail. The database revealed a distinction that an error message cannot show."
cover: "/assets/execution-facts-20260915/retry-after-error.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded pinned-source experiments; scope in article"
pageClass: "execution-facts-article"
---

<ArticleCover image="/assets/execution-facts-20260915/retry-after-error.cover-v1.png" kicker="Open-source engineering · Experiments" title="Why did an AI tool error leave an extra database row?" summary="After “submission failed,” is trying again safe? We made a tool save a record and then fail. The database revealed a distinction that an error message cannot show." version="2026-09-15" languageHref="/zh/engineering/2026-09-15-retry-after-error" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.execution-facts-article .vp-doc h1[id] { display: none; }</style>


# Why did an AI tool error leave an extra database row?
If a page says “submission failed,” would you try again?

Imagine that the first submission was saved, but the success message never made it back. Clicking again could perform the same action twice.

We tested that possibility with a local database, rather than real orders or payments. We deliberately made a tool save a record and then raise an error. The result was more surprising than expected: **with only one outer attempt allowed, two records appeared.**

Did failure mean the action never happened—or that it happened but the reply failed?

## How one attempt became two writes

The source was [a proposed CrewAI fix](https://github.com/crewAIInc/crewAI/pull/7458) by Ritiky23. CrewAI helps agents work together and use tools.

We are building a collaboration system too, so retry behavior matters to us. A tool can return an error after changing a file, database, or external service. This source supplied actual code through which we could count those actions.

The old implementation handled preparing arguments and running the tool inside the same error handler. If something failed, fallback handling called the tool again with the original arguments.

A fallback intended to help when argument preparation failed could therefore also repeat a tool that had already saved its result before raising an error.

The candidate separates the steps. Argument preparation retains its fallback, while an execution error no longer triggers that extra invocation.

## Compare attempts with saved records

Our test tool inserted and committed a row in SQLite, which stores a database in a local file, then deliberately raised an error.

Using the original tool-call methods with the same inputs produced:

| Scenario | Original: calls / saved records | Candidate: calls / saved records |
| --- | --- | --- |
| Save then error; at most one attempt | 2 / 2 | 1 / 1 |
| Save then error; at most three attempts | 6 / 6 | 3 / 3 |
| Normal success; at most three attempts | 1 / 1 | 1 / 1 |
| Argument-description lookup fails; tool then succeeds | 1 / 1 | 1 / 1 |

We checked both the synchronous and asynchronous implementations. Their results agreed.

The first row shows that the fix removed an extra call inside one attempt. The second shows that **three allowed attempts could still save three records**.

![A later error does not erase a record already saved](/assets/execution-facts-20260915/retry-after-error.figure.en.svg)

*Figure 1. Saving a record and returning a result are separate steps. Source: SQLite observations in crew.json. Six writes becoming three does not mean the action happened only once.*

The fix addresses a specific repeat. Making repeated business requests take effect only once requires something more: recognizing them as the same operation and finding its earlier result.

## Can we simply check before trying again?

That raises a natural follow-up: before repeating an action, would checking its history be enough?

Orca, an application for managing AI sessions, provided an adjacent example. In [this proposal](https://github.com/stablyai/orca/pull/20723), brennanb2025 addresses whether recovery can treat a message absent from history as never delivered.

We supplied the relevant code with the same empty-history input. The predecessor concluded “not delivered”; the candidate kept the answer unknown. In a separate case, the candidate also stopped requesting a new message identifier based on a rejection obtained during recovery.

Before absence is useful evidence, we need to know what the available records can establish. **No success record might mean no success—or an incomplete record.**

This experiment tested how code interprets inputs; it did not actually resend a message. Together with the database experiment, it shows why an error or an empty lookup cannot, by itself, justify repeating an action.

## Avoiding blind retries should not mean waiting forever

Keeping “we cannot tell yet” is more honest. But what happens to subsequent work if the system never resolves the uncertainty?

That is the most useful next experiment suggested by these results: save the effect, lose its reply, then restart the program. Can recovery use the same operation identifier to find the existing result rather than write again? If the result cannot be found, how can a user investigate or decide what happens next?

We have not run that complete scenario and cannot announce that it is solved.

For developers: who stores the operation's identifier and final result, and will they remain queryable after a restart? For users: if a failed-looking submission turns out to have succeeded, would a “check this submission” option help more than another “try again” button?

<details>
<summary>What each experiment actually covered</summary>

CrewAI was pinned at a328710 and 2ab3821. We extracted the four complete original use/ause/_use/_ause methods and retained their control flow. Tool selection, telemetry, caching, formatting, and other surrounding dependencies used doubles. SQLite file writes and commits were real. Four scenarios, two routes, and two versions produced 16 observations. There was no full CrewAI integration or real email, order, or payment.

Orca was pinned at 742a7ad and e6f789b. Complete production modules and their real imports processed five history/submission cases and five disposition cases per version: 20 observations. The two input groups were not joined into an actual send path. The empty-history case also set a consistent boundary and no turn in flight. A recovered rejection remained unconfirmed without requesting a fresh identity.

A limitation remains: an unmarked synthetic rejection with reason not_delivered still requested a new identity. We did not establish that a real producer creates this combination. Reviews concerning rejection reasons and mobile/orchestration consumers were not reproduced here. Nor did we verify eventual resolution of waiting after an unknown result.

[Sources, inputs, results, and reproduction instructions](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-15-execution-facts). These observations establish neither production incident frequency nor a corresponding CodeFlowMu defect.

</details>
