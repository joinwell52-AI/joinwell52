---
schema: "publication-candidate-article/v2"
title: "Why did the tool run when the setting said “always”?"
date: "2026-09-15"
published_date: "2026-09-15"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "Why did the tool run when the setting said “always”?"
summary: "An approval setting meant to make an AI ask first instead let its tool run. Testing the fix exposed a second question: what if the approval check gives no answer?"
cover: "/assets/execution-facts-20260915/approval-setting.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded pinned-source experiments; scope in article"
pageClass: "execution-facts-article"
---

<ArticleCover image="/assets/execution-facts-20260915/approval-setting.cover-v1.png" kicker="Open-source engineering · Experiments" title="Why did the tool run when the setting said “always”?" summary="An approval setting meant to make an AI ask first instead let its tool run. Testing the fix exposed a second question: what if the approval check gives no answer?" version="2026-09-15" languageHref="/zh/engineering/2026-09-15-approval-setting" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.execution-facts-article .vp-doc h1[id] { display: none; }</style>


# Why did the tool run when the setting said “always”?
Adding “ask me before acting” is supposed to give us another chance to check an AI's work. What should happen if that approval setting is broken?

A reasonable expectation is that the program stops and tells us what needs fixing.

Our experiment produced the opposite result. We put the text “always” into an approval setting, and the tool ran once. With the proposed fix, the same input raised an error and the tool did not run.

**How could a mistake in a setting intended to require approval turn into permission to act?**

## Clear meaning, invalid setting

The counterexample comes from [a proposed OpenAI Agents Python fix](https://github.com/openai/openai-agents-python/pull/5029) by DeepanshuPal. This library helps developers connect AI agents to tools.

We build a multi-agent collaboration system, so the boundary before an action matters to us. This source made that boundary testable: when an approval setting cannot be understood, does the program stop or continue?

The word “always” here is a value in program configuration, not an instruction typed into an AI chat. The problem is in the code deciding whether a tool may run, rather than a model choosing to ignore someone.

The setting accepts explicit yes/no values or a small function that decides whether approval is needed for the current action. The text “always” is not an accepted value. The old check did not report that mistake; it treated the setting as requiring no approval.

A person understands the word. That does not make it valid configuration—and invalid configuration should not silently acquire a meaning its author did not intend.

## Leave a record whenever the tool runs

We used a local tool that adds a record to an in-memory list each time it runs. A test program stood in for the AI service; the approval check and tool-call entry point used the project's actual code.

For the comparison, we changed only the approval method, keeping the surrounding code the same.

| Input | Original method | Proposed fix |
| --- | --- | --- |
| Explicitly no approval needed | Run once | Run once |
| Explicitly approval needed | Wait without running | Wait without running |
| Unaccepted text “always” | Run once | Error; do not run |
| Number 1, empty value, empty object—tested separately | Run once for each | Error; do not run for each |
| A function answers no / yes | Run / wait | Run / wait |
| The decision function gives no answer | Run once | **Still run once** |

The fix stopped all four tested kinds of invalid setting while preserving normal run and wait behavior.

The last row, however, opened another question.

## Does no answer mean no approval is needed?

A fixed setting is not always enough. Developers can supply a function that examines an action and answers whether it needs approval.

We deliberately made that function return no answer. The tool still ran with the proposed fix.

Providing a function was an accepted configuration format. But its empty result was converted to “no approval needed.” **An accepted setting does not necessarily produce a valid decision.**

![An invalid setting and a missing decision are different cases](/assets/execution-facts-20260915/approval-setting.figure.en.svg)

*Figure 1. Two mistakes reach different checks. Source: saved approval observations in sdk.json; the measured effect is a local tool invocation.*

We are not presenting this as a confirmed new vulnerability. The function was expected to return a Boolean, and we deliberately violated that contract. The observation makes a useful follow-up question more precise:

**If the approval function fails or forgets to answer, should execution validate its result instead of interpreting an empty answer as permission?**

We tested the missing answer. Exceptions and other failure cases still need separate experiments.

## Something practical to check

When testing an approval feature, add “the setting itself is broken” alongside “run” and “wait.” Inspect the tool's records as well as the error message to establish whether it actually stopped.

For developers: which component checks the decision function's answer, and which invalid results must be rejected? For users: would “This setting is invalid; the action was not performed,” together with an action record, make the situation clearer?

An approval mechanism needs a defined response when it cannot produce a valid answer, as well as a normal yes/no path.

<details>
<summary>Experiment details and reproduction</summary>

The candidate was b6c2cef, exercised through RealtimeSession._handle_tool_call. The comparison substituted only _function_needs_approval from fbf59a4: a single-method ablation, not two complete releases. The tool appended to a Python list; no live service request occurred.

Ten inputs ran in each of two modes. Invalid top-level needs_approval values were the string "always", integer 1, None, and an empty object. A callback returning None was a separate, deliberately out-of-contract input. The normal async callback returning false also retained its behavior.

The candidate passed the original 31 approval tests. The predecessor method produced 30 passes and one invalid-setting failure. We did not run the larger Realtime suite or verify a corresponding CodeFlowMu path.

[Pinned sources, probes, results, and reproduction instructions](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-15-execution-facts).

</details>
