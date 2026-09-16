---
schema: "publication-candidate-article/v2"
title: "The check failed. Why did the AI remember the answer?"
date: "2026-09-16"
published_date: "2026-09-16"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "The check failed. Why did the AI remember the answer?"
summary: "A failed run can still leave an unchecked answer in the next conversation. A controlled experiment separates the error shown now from the history replayed later."
cover: "/assets/current-context-20260916/failed-check-memory.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded experiments on pinned source; scope in article"
pageClass: "current-context-article"
---

<ArticleCover image="/assets/current-context-20260916/failed-check-memory.cover-v1.png" kicker="Open-source engineering · Experiments" title="The check failed. Why did the AI remember the answer?" summary="A failed run can still leave an unchecked answer in the next conversation. A controlled experiment separates the error shown now from the history replayed later." version="2026-09-16" languageHref="/zh/engineering/2026-09-16-failed-check-memory" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.current-context-article .vp-doc h1[id] { display: none; }</style>

# The check failed. Why did the AI remember the answer?

Imagine using an AI assistant: it produces an answer, but the program meant to check that answer fails.

On your next question, you might expect the unchecked answer to stay out of the conversation. **In our controlled comparison, the old logic raised an error and saved the answer anyway. The next model call received it.**

The error ended the current attempt without keeping that answer out of the next one.

## What does “remember” mean here?

It means something specific: the application saves conversation history and sends some of it back to the model with the next question. We did not test model training or a chat product's long-term memory feature.

Once an unchecked answer enters that history, a later model call can receive it as context. An unconfirmed statement might then become a premise for another answer. That possible consequence motivated us; what our experiment directly established was whether the earlier answer was sent again.

The source was [OpenAI Agents JS #1938](https://github.com/openai/openai-agents-js/pull/1938), submitted by jbeckwith-oai. This library connects models, tools, and conversations. Developers can arrange checks on an answer: a check may pass, reject the answer, or fail before reaching a verdict.

The old implementation already handled “the check says no.” This patch addressed “the check could not finish.” For our research on assistants that keep working across turns, the important question was whether that interruption could leave something behind.

## Break the checker, then ask another question

Our test model always returned the same distinctive marker text. We made the checks pass, reject, throw an error, or combine one passing check with another that threw. Then we ran another turn and inspected the history actually sent to its model.

A script supplied the model's answers; real library code ran the conversation and handled storage. We used four execution/storage combinations and compared the old decision with the fixed one:

| Check outcome | Old logic: answer replayed | Fixed logic: answer replayed |
| --- | --- | --- |
| All pass | 4/4 | 4/4 |
| Explicit rejection | 0/4 | 0/4 |
| Check throws | **4/4** | **0/4** |
| One passes, another throws | **4/4** | **0/4** |

Four means two ways of returning an answer—streaming or all at once—crossed with two session-storage implementations. These are constructed cases, not production incident rates. Both versions together produced 32 observations.

The last two rows show the change: **an answer without completed validation was replayed under the old decision and withheld under the fix.** Passing answers still remained, as did previously accepted history and the current user question.

![Checks and conversation memory](/assets/current-context-20260916/failed-check-memory.figure.en.svg)

*Figure 1. Whether an answer reaches the next turn after a check fails. Source: our pinned-source experiments and saved observations; diagram by the authors. Counts describe constructed cases.*

## An unfinished check has not proved the answer wrong

A check can fail because its service is unavailable. That does not establish that the answer itself is bad. Equally, one passing check cannot supply the conclusion of another check that failed.

The fixed behavior preserves that distinction. It does not declare the answer disproved, and it does not automatically admit the answer as context for later work.

This suggests a practical design choice. An application can retain what the model produced to help diagnose a failed attempt, while keeping that record out of the next model call. **Retaining an attempt and admitting it into subsequent context need separate rules.**

Even completed checks establish acceptance only under their configured requirements. They do not guarantee real-world truth.

## When checking recovers, which answer should it check?

Suppose the service recovers after the answer has been regenerated or the user has changed the question. Which piece of content does a late “pass” actually approve?

Neither this patch nor our experiment implements deferred verification. The comparison nevertheless leads to a concrete design question: a future retry would need to associate answer content, conversation turn, and checking rules, so that an old verdict cannot be attached to a new answer.

Developers can start with a small experiment: make the checker throw, run another turn, and inspect what the model receives. Users can provide useful leads too: does an answer marked as failed later reappear as an already-established fact? Saving the surrounding conversation and error message gives an investigator more to work with than “the AI remembered incorrectly.”

<details>
<summary>For technical readers: versions, full method, and reproduction</summary>

The PR by jbeckwith-oai merged on 2026-09-15 UTC. Candidate: `457dfff8ce30d19ccbd4a3796ec482356dc19dfa`. The control replaces only `runner/guardrails.ts` with its exact predecessor from `8ac97dfedd0395beeb38edb0a17b83a9b89c3354`. This was the PR's only changed production module; other candidate code stayed constant.

The probe uses public `run`, ScriptedModel, MemorySession, and an append-only session. It observes both stored items and subsequent model input in streaming and non-streaming modes: four check outcomes × two run modes × two session types × two versions = 32 observations. The mixed-check case establishes a failing batch, not a controlled order of check completion.

We separately ran the corresponding upstream test file: 71 tests passed, including additional tool-output behavior. That count is not added to the custom observations as a reliability score. No live model service or external database was used, and correctness for every custom store is not established.

[Pinned source, saved observations, and runnable probes](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-16-current-context). This does not establish a corresponding CodeFlowMu defect.

</details>

[Research repository](https://github.com/joinwell52-AI/joinwell52)
