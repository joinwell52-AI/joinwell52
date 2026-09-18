---
schema: "publication-candidate-article/v2"
title: "You approved the arguments. Did the tool execute the same ones?"
date: "2026-09-18"
published_date: "2026-09-18"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "Are the arguments inspected by conditional approval the arguments ultimately executed by the function?"
summary: "We ran the same six cases against OpenAI Agents Python v0.22.2 and v0.22.3 to see how defaults, coercion and validators affect the approval boundary."
cover: "/assets/context-authority-20260918/approval-arguments.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Pinned-version original-code comparison; boundaries stated in text"
pageClass: "context-authority-article"
---

<ArticleCover image="/assets/context-authority-20260918/approval-arguments.cover-v1.png" kicker="Open-source engineering · Version comparison" title="You approved the arguments. Did the tool execute the same ones?" summary="Defaults, coercion, and validators can change the actual action after a policy sees the request." version="2026-09-18" languageHref="/zh/research/2026-09-18-approval-saw-raw-tool-ran-prepared" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.context-authority-article .vp-doc h1[id] { display: none; }</style>

# You approved the arguments. Did the tool execute the same ones?

An agent is about to call a tool. The approval policy sees an empty object, `{}`, finds no protected target, and allows the call.

The function then receives `target="protected"`.

The agent did not swap the argument. An ordinary validation step supplied a default. The same separation can happen when a string `"1"` becomes integer `1`, or when an application validator normalizes `PROD` to `prod`.

That creates a precise governance question: **is the object being approved the object that will actually be executed?**

## Why we tested this

OpenAI Agents Python merged [PR #5066](https://github.com/openai/openai-agents-python/pull/5066) on September 17, 2026, then released v0.22.3. Maintainer Kazuhiro Sera explained that conditional approval callbacks could inspect arguments different from those used by the Python function. The new version prepares arguments first and requires manual approval when validation changes them.

The change turns an abstract governance concern into a testable path: raw JSON enters a tool, a schema interprets it, a policy decides, and a function creates an effect. Which representation reaches each stage?

We compared v0.22.2 and v0.22.3 instead of relying only on the fix description.

## Six cases through the real runner path

We pinned v0.22.2 at commit `83c737f` and v0.22.3 at `fdf21db`. Every case used the original `Runner`, decorated function tools, `ScriptedModel`, and tool execution path.

No live model or external write was involved. The probe recorded the callback input, whether manual approval interrupted the run, and the value received by the function body.

| Case | Raw arguments | Prepared arguments |
| --- | --- | --- |
| Unchanged safe target | `{"target":"safe"}` | Unchanged |
| Unchanged protected target | `{"target":"protected"}` | Unchanged |
| Omitted protected default | `{}` | `{"target":"protected"}` |
| Explicit integer | `{"count":1}` | Unchanged |
| String-to-integer coercion | `{"count":"1"}` | `{"count":1}` |
| Application validator | `{"environment":"PROD"}` | `{"environment":"prod"}` |

## Approval and execution could diverge in v0.22.2

Unchanged inputs behaved as expected: the safe target ran, while the protected target interrupted for approval.

The three transformed inputs exposed the gap:

- The conditional callback saw `{}` and allowed it; the function executed with the default `protected` target.
- The callback saw string `"1"`; the function received integer `1`.
- The callback saw `PROD`; the function received validator output `prod`.

The conditional callback did not inspect the complete object consumed by the function.

![Different handling of prepared arguments in v0.22.2 and v0.22.3](/assets/context-authority-20260918/approval-arguments.figure.en.svg)

*Figure 1: v0.22.2 lets the callback inspect raw input while the function consumes prepared input. v0.22.3 routes changed values to manual approval. The figure summarizes our six cases, not every possible schema behavior.*

## The new version draws a conservative boundary

In v0.22.3, unchanged arguments keep the prior conditional behavior. The safe target runs, and the protected target interrupts. Defaults, coercion, and application-level transformation all cause a manual approval interruption before the function executes.

This is more careful than merely moving the callback after validation. Sending transformed values into an existing callback could silently change an application's policy semantics. The new rule is: **use the existing conditional policy only when raw and prepared arguments can be shown to remain equivalent; otherwise return the decision to a person.**

We also ran the new upstream approval-argument test file in v0.22.3: all 108 tests passed.

## Approving a tool name is not enough

A verifiable approval needs at least four answers:

1. Which representation did the person or policy inspect?
2. Had schema defaults and validators already run?
3. Did the arguments still match the approved object immediately before execution?
4. After resuming a session, is the system continuing the same prepared action?

A dialog that says only “Allow deploy” does not tell the user whether the environment is raw `PROD`, normalized `prod`, or a default that was absent from the request. A stronger receipt binds authorization to a reproducible digest of the final action and invalidates the authorization when that action changes.

## Does CodeFlowMu need a change?

We inspected CodeFlowMu v2.1.2. Its approval service hashes a stable operation request, recomputes the digest before execution, and marks changed requests `stale`. It also binds an operation fingerprint, project, agent, task, thread, and role, and uses a one-time execution token. All 28 targeted approval-boundary tests passed.

Our development-review decision is therefore **do not implement a new change this round**. We found no local evidence of an approval/execution mismatch. The result belongs in the article and future review checklist; research evidence does not automatically become a development task.

## Questions the fix leaves open

- Should approval interfaces show only prepared arguments, or show raw input and a transformation diff?
- Can prepared values be reproduced when a validator depends on time, external state, or arbitrary application code?
- On resume, should a runtime prepare and compare again, or execute a saved prepared snapshot?
- If objects cannot be compared safely, is mandatory human approval sufficient, or should execution be refused?

For a non-specialist, the test is simpler: **after you click “approve,” can you state exactly which values the program will use and what it will do?** If not, the approval is still a button rather than execution evidence.

## Evidence

- [OpenAI Agents Python PR #5066](https://github.com/openai/openai-agents-python/pull/5066)
- [v0.22.3 release](https://github.com/openai/openai-agents-python/releases/tag/v0.22.3)
- [Public experiment record](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-18-context-authority)

