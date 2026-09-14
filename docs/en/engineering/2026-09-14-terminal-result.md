---
schema: "publication-candidate-article/v2"
title: "How Did an Opening Remark Become the Deliverable?"
date: "2026-09-14"
published_date: "2026-09-14"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "How Did an Opening Remark Become the Deliverable?"
summary: "Five original-script comparisons separate process exit, provider outcome, and artifact existence."
cover: "/assets/continuity-20260914/terminal-result.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded experiments on pinned sources; no live cloud validation"
pageClass: "continuity-contracts-article"
---

<ArticleCover image="/assets/continuity-20260914/terminal-result.cover-v1.png" kicker="Open-source engineering · Experiments" title="How Did an Opening Remark Become the Deliverable?" summary="Five original-script comparisons separate process exit, provider outcome, and artifact existence." version="2026-09-14" languageHref="/zh/engineering/2026-09-14-terminal-result" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.continuity-contracts-article .vp-doc h1[id] { display: none; }</style>

# How Did an Opening Remark Become the Deliverable?

The model says it will inspect the task. The process exits normally. A dispatcher finds nonempty text and publishes it as the result. A later inspection reveals that the text was merely the opening remark, before the work was done.

The provider had already reported an error. The dispatcher accepted a different, easier signal: process exit code zero.

Inspired by an anywhere-agents fix, we ran five before/after scenarios using its original dispatcher and a fixture CLI. Three failure scenarios violated their assertions on the predecessor and passed with the fix. Two normal or compatibility controls passed on both. The experiment asks how much “normal exit” actually establishes.

## An error event can still contain plausible text

anywhere-agents connects coding agents to parallel work and review. Yue Zhao's [dispatch fix](https://github.com/yzhao062/anywhere-agents/commit/3c94f459fa942727bbbf0a51ad1967d235096bc7) addresses Agy returning process exit zero after a quota limit while its final event says `ERROR` and includes opening narration.

The author reports incorrect publication in real dispatches. We did not repeat the historical 152-dispatch audit or exhaust a real Agy quota. We tested how the dispatcher interprets those inputs.

Pinned Python scripts ran as real subprocesses, consumed streamed events, and wrote temporary result files. The upstream CLI fixture supplied the provider behavior. Tests came from the fixed revision; the comparison used its parent revision's dispatcher.

| Input scenario | Predecessor satisfies assertion | Fixed implementation satisfies assertion |
| --- | --- | --- |
| Exit zero, ERROR, opening text | No | Yes: failure with FALLBACK |
| ERROR after a Worker wrote a result | No | Yes: file retained, run fails |
| ERROR followed by a result without status | No | Yes: prior error preserved |
| Explicit SUCCESS with response text | Yes | Yes |
| Response text without a status field | Yes | Yes: compatibility retained |

Passing means the assertion holds. The first three rows require failure to be reported correctly; they do not turn a failed task into a successful one.

![Process outcome, provider outcome, and retained artifact](/assets/continuity-20260914/terminal-result.figure.en.png)

*Figure 1. Boundaries observed by the original-script comparison. Source: this study's runs/dispatch.json and test logs; provider events came from the fixture CLI.*

## Keep the file without granting completion

A failure late in a run does not make an earlier artifact worthless. Deleting it loses evidence. Retaining it does not establish that the task succeeded.

The fix preserves a Worker-written result while returning failure. Two facts can coexist: material is available for inspection, and this run did not complete successfully. Independent verification must still decide whether the material meets the user's objective.

The third scenario concerns information loss within an event stream. A later event may contain fewer fields than an earlier one. Omitting status must not erase an explicit ERROR. The parser keeps the latest supplied status, error, and nonempty response separately. That establishes this missing-field behavior, not general correctness under arbitrary reordering or replay.

It would also be inaccurate to summarize the implementation as rejecting every non-SUCCESS case. Missing or blank status remains compatible with success. An explicit failure and an absent verdict are different evidence states. A useful follow-up question is whether downstream verification can distinguish compatibility-admitted output from provider-confirmed success.

## The next day's change moves upstream of dispatch

The following [quota-routing change](https://github.com/yzhao062/anywhere-agents/commit/050ee0bd91c5d05c28f6f6b7c196a8d222328a4b) reads model-group capacity before dispatch. An exhausted Claude/GPT group can fall back to Gemini. An exhausted Gemini group does not automatically escalate into the scarcer group. The actual selected model and fallback explanation are recorded.

We also ran seven upstream quota-policy unit tests: the tightest bucket, nonfinite values, a stale snapshot after failed refresh, reset time, an unreported group, model-name grouping, and disabling the gate. All passed, alongside four default, script, identifier, and terminal-helper checks. These use temporary caches and doubles; they do not measure live capacity, savings, or throughput.

One boundary matters: a group absent from the snapshot remains unknown and may still be tried. That is neither confirmed availability nor confirmed exhaustion. Admission needs to preserve the character of its evidence, and permission to start cannot replace the eventual completion decision.

For our CodeFlowMu/FCoP development review, this yields four checks: how the process ended, how the provider ended, where the artifact came from, and what independent verification concluded. Existing records should be mapped first; four distinctions do not require four new ledgers. We have not established the same defect in CodeFlowMu.

The [reproduction package](../research/evidence/2026-09-14-continuity-contracts) preserves failing comparisons, compatibility controls, source pins, and limitations. Materials are maintained in the [research repository](https://github.com/joinwell52-AI/joinwell52).
