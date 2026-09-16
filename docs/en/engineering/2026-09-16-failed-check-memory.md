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

An AI produces an answer. The service meant to check it fails. You see an error.

When you ask the next question, it is reasonable to expect that unfinished answer not to become established conversation history. **In our controlled comparison, the old logic raised an error and saved the answer anyway. The next model call received it.**

The problem was not forgetting. It was remembering an answer before its checks had finished.

## An error tells only part of the story

jbeckwith-oai reported and fixed this in [OpenAI Agents JS #1938](https://github.com/openai/openai-agents-js/pull/1938). The library connects models, tools, and conversations. An output guardrail can reject an answer, but the checking service can also fail before returning a verdict.

We study assistants that continue working across turns. This source interested us because a failed response is usually treated as a local interruption. Once an unchecked answer enters session history, its effect may continue. Testing only whether the run throws misses what the next run receives.

The old implementation already handled explicit rejection. This change addresses a check that could not finish.

## Run the next turn too

We pinned the source, made a scripted model emit a distinctive answer, and configured checks to pass, reject, throw, or combine one passing check with another that throws. We then ran a follow-up and inspected its actual model input.

The model was a test double; the runner and session handling were real SDK code. Streaming and non-streaming execution were crossed with MemorySession and an append-only session. Four combinations per verdict, across two versions, produced 32 observations.

| Check outcome | Old logic: answer replayed | Fixed logic: answer replayed |
| --- | --- | --- |
| All pass | 4/4 | 4/4 |
| Explicit rejection | 0/4 | 0/4 |
| Check throws | **4/4** | **0/4** |
| One passes, another throws | **4/4** | **0/4** |

These are constructed scenarios, not production incident rates. Each denominator of four represents two execution modes crossed with two session types.

Accepted answers still persisted. Previously saved answers and the current user question were retained in all 32 observations. We also ran the upstream test file: 71 tests passed. Those tests cover additional behavior, including tool outputs; adding their count to our observations would not produce a reliability score.

![Checks and conversation memory](/assets/current-context-20260916/failed-check-memory.figure.en.svg)

*Figure 1. A mechanism illustration derived from our inputs. A failed check differs from an explicit rejection, but neither establishes that the whole batch passed. Source: our pinned-source experiments and saved results; diagram by the authors.*

## A passing check cannot answer for a failed one

The last row matters. An answer may face several checks. One can approve while another cannot reach a conclusion.

The fixed code withheld that final answer from session history. This does not prove the answer was wrong. It means the required validation was incomplete.

The practical lesson is that **recording what a model said and admitting it into the next turn's working memory serve different purposes.** Diagnostic evidence can preserve an unsuccessful attempt. Automatically replayed history can influence later reasoning. A system needs to distinguish those uses.

Passing the configured checks is also not proof of real-world correctness. It establishes completion and acceptance under those checks, within their scope.

## What would a later check actually validate?

This patch does not implement delayed revalidation. That leaves a useful question: after the checking service recovers, which answer should it validate? If the answer has been regenerated or edited, which version owns the late verdict?

We did not test such a recovery path. The experiment suggests checking the binding between answer content, validation version, and conversation turn rather than trusting a late passing flag.

Developers can reproduce the basic test by making a guardrail throw, starting another turn, and inspecting the model input. Users can report a related symptom: a response marked as failed later reappears as something the assistant treats as already established. Such reports are leads to investigate, not verified conclusions.

<details>
<summary>Versions, method, and reproduction</summary>

The PR by jbeckwith-oai merged on 2026-09-15 UTC. We used candidate `457dfff8ce30d19ccbd4a3796ec482356dc19dfa` and the original `runner/guardrails.ts` from `8ac97dfedd0395beeb38edb0a17b83a9b89c3354`. This is the PR's only changed production module; the remaining candidate code was held constant.

The custom probe uses public `run`, ScriptedModel, MemorySession, and an append-only session, observing both persistence and subsequent model input. It does not use a live model API or external database, or establish correctness for every custom store. The mixed-check case establishes a failing batch, not a controlled temporal order of check completion.

[Pinned sources, saved observations, and runnable probes](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-16-current-context). This does not establish a corresponding CodeFlowMu defect.

</details>


[Research repository](https://github.com/joinwell52-AI/joinwell52)
