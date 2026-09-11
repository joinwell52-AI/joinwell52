---
schema: "publication-candidate-article/v2"
title: "The Result Exists. Why Did the Agent Fail to Deliver It?"
date: "2026-09-11"
published_date: "2026-09-11"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "The Result Exists. Why Did the Agent Fail to Deliver It?"
summary: "Ten original SDK regressions and a predecessor-helper ablation show why final text cannot prove complete result delivery."
cover: "/assets/current-authority-20260911/result-delivery.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded pinned-source experiments; no real cloud validation"
pageClass: "current-authority-article"
---

<ArticleCover image="/assets/current-authority-20260911/result-delivery.cover-v1.png" kicker="Open-source Engineering · Experiments" title="The Result Exists. Why Did the Agent Fail to Deliver It?" summary="Ten original SDK regressions and a predecessor-helper ablation show why final text cannot prove complete result delivery." version="2026-09-11" languageHref="/zh/engineering/2026-09-11-result-delivery" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.current-authority-article .vp-doc h1[id] { display: none; }</style>

# The Result Exists. Why Did the Agent Fail to Deliver It?

In a controlled resume experiment, the agent returned `done`. A check of the final text would have accepted the run. Inspecting the next model input revealed a missing tool result.

The result had already been produced before the interruption. It could even survive serialization with the run state. During recovery, however, its local existence was mistaken for prior delivery, so it was omitted from the next request.

We ran ten relevant upstream regressions against pinned OpenAI Agents SDK code. All passed with the fix. Replacing only the responsible helper with its predecessor made all ten fail. The experiment asks a practical question: when an agent produces a result, what evidence says the next participant received it?

## Two calls, one approval pause

The Agents SDK connects model responses, tool execution, and saved run state. A response may contain several tool calls, some requiring human approval—a human-in-the-loop, or HITL, interruption.

[Upstream fix #4947](https://github.com/openai/openai-agents-python/pull/4947) concerns a mixed response: one call requires approval, while another names an unregistered tool. The runner produces a local error for the missing tool, then pauses for the other call. Under server-managed continuation, recovery could omit that error output.

An error output is still part of the conversation. It answers a particular call and tells the model that the requested operation did not run. Keeping an error in local state does not complete that handoff.

The approved tool may subsequently execute, and the model may produce plausible final text. Progress can therefore look normal while a different call remains unanswered in the prepared input.

## Measure the next input

We pinned commit `3f9397f035a891ce3623723eb0c2181847006fc9` and ran its ten added regressions with Python 3.12.10. The SDK runner, approval handling, serialization, recovery, and input preparation executed normally. The model was the upstream `ScriptedModel`, which emits predefined responses and records inputs. No real OpenAI service was called.

The comparison was a single-helper ablation, not a comparison of two complete releases. In a separate process, we replaced only the code of the helper that identifies unsent results with its implementation from `83c737fd0b8d9a53bd39fa2a0856070417bb0bd3`. All other SDK code and tests stayed identical.

| Original regression executed locally | Cases | Fixed implementation | Predecessor-helper ablation |
| --- | ---: | --- | --- |
| Two continuation modes × live/JSON state × streamed/non-streamed | 8 | All pass | Missing-tool output absent in all |
| Two staged approvals | 1 | Three outputs, each once | Missing-tool output absent |
| Interrupted state without a pending run for the missing tool | 1 | Unsent output preserved | Output incorrectly classified as delivered |

The eight-case matrix covers `conversation_id` and `auto_previous_response_id`. We did not separately run the complete Runner path with an explicitly supplied `previous_response_id`; the tracker-level case uses that field at a different observation boundary.

The failure location matters. In all eight matrix cases, the assertion that final output equals `done` had already passed. Only the later assertion over delivered call IDs detected the missing `call-missing`. Correct final text was insufficient evidence of complete handoff.

![Result pairing under the fixed implementation and predecessor-helper ablation](/assets/current-authority-20260911/result-delivery.figure.en.png)

*Figure 1. Result pairing in the controlled experiment. Source: this study's runs/sdk.json and ScriptedModel inputs; not acknowledgements of consumption by a real service.*

## Persistence does not decide delivery ownership

Recovery cannot simply resend every local item. A server-managed conversation may already own some items. The runner must separate those from local outputs still needing delivery.

The old helper inspected pending tool-run groups. A missing tool had already received a locally synthesized error and left no ordinary pending execution in those groups. Enumerating only pending work therefore missed an existing but unsent result. Serializing state did not restore the missing classification.

The fix draws candidate call IDs from the latest model response while retaining prior ownership checks. Our ablation supports that causal explanation: restoring the old helper alone brought back the missing call across the same test paths.

This case did not require a new delivery database. Existing response records contained the necessary facts. Before introducing another ledger, determine whether the current records can answer the ownership question correctly.

## Where “once” actually holds

The staged-approval test approves one call, resumes into another interruption without a model request, then approves the second call. Its assertion requires each of the three outputs to appear once in the subsequent scripted-model input.

That is a useful recovery property. It does not establish general exactly-once delivery under network failure. We did not simulate a request reaching a server while its acknowledgement was lost, verify server persistence or consumption, or prove that an external tool effect occurred only once.

[Paperclip's audit-boundary document](https://github.com/paperclipai/paperclip/blob/4e08ff2365dcd563e4e960edb3cb2e879d47238f/doc/BOARD-API-KEY-AUDIT-BOUNDARY.md) addresses a different boundary: database transactions cannot roll back external effects, and ambiguous acknowledgements require durable intent and idempotency handling. It is a useful comparison, not another property established by this experiment.

Produced, persisted, delivered, and consumed are distinct facts. An implementation may derive them from existing records rather than storing four new flags. It still needs to preserve the distinction.

## One more acceptance check for resume

Start with a small counterexample in your own runtime: one call waits for approval while another produces a local success or error. Save and restore the state, then inspect call/output pairing in the next actual input. Stage two approvals and check for premature requests or duplicate outputs.

For CodeFlowMu/FCoP, this is now an input to development review: first map existing task records, call IDs, and delivery records to these facts. This study did not establish a corresponding product defect or authorize a new ledger implementation.

Final text remains a useful output. A successful recovery also needs evidence that the results owed to the next step actually entered it.

The [evidence package](../research/evidence/2026-09-11-current-authority) contains reproduction steps, passing and failing observations, source pins, and limitations. Materials are maintained in the [research repository](https://github.com/joinwell52-AI/joinwell52).
