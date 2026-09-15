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
summary: "A setting that sounds stricter can bypass approval when its type is invalid. A bounded experiment follows the actual tool-call entry point."
cover: "/assets/execution-facts-20260915/approval-setting.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded pinned-source experiments; scope in article"
pageClass: "execution-facts-article"
---

<ArticleCover image="/assets/execution-facts-20260915/approval-setting.cover-v1.png" kicker="Open-source engineering · Experiments" title="Why did the tool run when the setting said “always”?" summary="A setting that sounds stricter can bypass approval when its type is invalid. A bounded experiment follows the actual tool-call entry point." version="2026-09-15" languageHref="/zh/engineering/2026-09-15-approval-setting" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.execution-facts-article .vp-doc h1[id] { display: none; }</style>

# Why did the tool run when the setting said “always”?

A developer wants a tool to ask for approval every time and sets its approval option to the string `"always"`. The intention seems clear. Yet the tool runs immediately.

This is a locally testable counterexample, not a production incident we experienced. It comes from [OpenAI Agents Python PR #5029](https://github.com/openai/openai-agents-python/pull/5029), submitted by DeepanshuPal. The SDK connects agents to tools; the affected path here is tool approval in a Realtime session.

We build a multi-agent collaboration system, so the boundary between running an action and waiting for a person's decision matters to us. This source reduced that boundary to a small, testable question: what happens when an approval setting cannot be interpreted?

## Understandable words, invalid configuration

The `needs_approval` setting accepts a Boolean or a callback that calculates whether approval is needed. The string `"always"` is neither.

The predecessor's Realtime path used a permissive check. An invalid setting fell through to “approval is not required.” The proposed change uses strict validation: an invalid type raises a configuration error before the tool runs.

The practical difference is whether an uninterpretable setting produces an action.

## Ten inputs through the actual entry point

We pinned candidate commit `b6c2cef` and exercised the real `RealtimeSession._handle_tool_call` entry point with a local recording tool. Its only effect was appending to a Python list. A recording model replaced the remote service.

For the comparison, we replaced only the approval method with its implementation from predecessor `fbf59a4`, keeping the rest of the candidate source. This is a **single-method ablation**, not a comparison of two complete releases.

| Input | Predecessor method | Candidate method |
| --- | --- | --- |
| `false` | One tool invocation | One tool invocation |
| `true` | No invocation; one pending approval | Same |
| String `"always"` | One invocation | UserError; no invocation |
| Integer `1`, `None`, empty object | One invocation for each | Error and no invocation for each |
| Callback returning false / true | Execute / wait | Execute / wait |
| Callback returning `None` | One invocation | Still one invocation |

The normal async callback returning false also retained its behavior. We ran the project's 31 approval tests: all passed with the candidate; replacing the method produced 30 passes and one failure for invalid configuration. We did not run the author's larger Realtime suite.

![The configuration type and callback result are separate validation boundaries](/assets/execution-facts-20260915/approval-setting.figure.en.svg)

*Figure 1. Setting types and callback outputs are different validation boundaries. Source: ten input cases in runs/sdk.json. This depicts local decisions, not live requests.*

## The last row opens another question

A callback is an accepted configuration object. But a Python callback that forgets to return a value produces `None`. In this tested version, that result is still converted to false, so the tool runs.

We are not presenting this as a confirmed additional vulnerability. The callback contract expects a Boolean; the missing return is deliberately outside that contract. It exposes two distinct checks: whether the configuration is an accepted object, and whether the result it computes is valid.

Where should that mistake surface—static checking and tests, or validation at the execution boundary too? If conversion remains permissive, how clearly is that contract communicated?

A useful experiment for another project is therefore to test an explicitly invalid value alongside normal execute and wait cases, then inspect whether the tool actually ran. A friendly error message alone does not establish that outcome.

For practitioners: would you permit an empty callback result to mean “no approval needed”? For users: what should the product show when its approval configuration is broken?

These observations cover a pinned Realtime entry point and a local recording effect. They do not establish behavior across every approval mode or remote connection, nor a corresponding CodeFlowMu defect. The [public evidence package](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-15-execution-facts) contains the probes, outputs, and verification instructions.
