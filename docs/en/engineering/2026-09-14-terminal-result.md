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
summary: "The AI said it would get started. How did that become the finished result? A controlled comparison traces a misleading success signal."
cover: "/assets/continuity-20260914/terminal-result.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded experiments on pinned sources; no live cloud validation"
pageClass: "continuity-contracts-article"
---

<ArticleCover image="/assets/continuity-20260914/terminal-result.cover-v1.png" kicker="Open-source engineering · Experiments" title="How Did an Opening Remark Become the Deliverable?" summary="The AI said it would get started. How did that become the finished result? A controlled comparison traces a misleading success signal." version="2026-09-14" languageHref="/zh/engineering/2026-09-14-terminal-result" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.continuity-contracts-article .vp-doc h1[id] { display: none; }</style>

# How Did an Opening Remark Become the Deliverable?

“I'll take a look.”

If a colleague replied with that sentence, you would probably keep waiting. Yet in a fault reported by an open-source AI dispatch project, this kind of opening text ended up in a result file, ready to be treated as the deliverable.

More surprisingly, the AI service had already reported an error. The program collecting the result trusted another signal: a normal process exit.

The report came from anywhere-agents, a toolkit that assigns work to coding assistants and collects their output. Its fix prompted us to compare the original dispatcher before and after the change. **If the work was unfinished, why didn't the program handling the result catch it?**

This caught our attention because we are developing CodeFlowMu, a system for collaboration among AI assistants. At a handoff, the next stage needs to know whether it has a result ready for verification or output from unfinished work. This source narrowed that concern to a concrete conflict: the exit code reported success while the service response reported failure. It also supplied code before and after the fix, with tests, allowing us to investigate which decision went wrong instead of merely advising people to check results.

## It found text, but trusted the wrong success signal

An AI call often passes through several programs. A dispatcher starts a command-line tool. That tool contacts the AI service and passes its response back.

When the tool exits, it returns a number called an exit code. Zero normally signals success. But if the dispatcher checks only that number, it can miss a more specific failure inside the response.

Yue Zhao's [fix](https://github.com/yzhao062/anywhere-agents/commit/3c94f459fa942727bbbf0a51ad1967d235096bc7) addresses precisely that mismatch: after hitting a quota limit, Agy could return exit code zero while its terminal event reported `ERROR` and included opening narration. The old dispatcher followed the normal-exit, nonempty-text path and wrote that narration to the result file.

Two reassuring observations hid the problem: the process had ended, and there was text to collect.

That gave us a focused experiment. Keep the exit code at zero, but supply an explicit error in the response. Can the dispatcher recognize it?

## Give both versions the same bad news

We used the project's original test tool to simulate AI responses and ran both dispatcher versions through the same scenarios. Process execution, event reading, and temporary-file writes happened locally. The AI responses came from a test double so we could control their contents.

Three cases deliberately supplied errors. Two controls checked normal success and compatibility with older response formats:

| Scenario supplied to the dispatcher | Does the predecessor behave as expected? | After the fix |
| --- | --- | --- |
| Exit zero, error response, opening text | No | Reports failure and leaves a fallback marker |
| Error after the worker has written a result file | No | Retains the file while reporting run failure |
| Error followed by a result message without status | No | Preserves the earlier error |
| Explicit success with result text | Yes | Still passes |
| Text without a status field | Yes, under the compatibility rule | Compatibility success is retained |

The first three tests failed on the predecessor and passed with the fix. Passing here means the program correctly acknowledges failure.

The last row matters too. The fix does not reject every older response that omits status. Explicit success and admission through a compatibility rule remain different kinds of evidence; neither should be silently described as the other.

![Process outcome, provider outcome, and retained artifact](/assets/continuity-20260914/terminal-result.figure.en.png)

*Figure 1. One run can leave evidence at several levels. Source: this study's runs/dispatch.json and original test logs; provider events were simulated by the test tool.*

## Why keep a file from a failed run?

The second test asks something beyond error detection. What if the assistant writes a file before the run fails?

Deleting it discards work that may still be useful. Treating it as a finished deliverable may send an incomplete result onward. The fix keeps both facts visible: the file exists, and the run failed.

Those facts can coexist. Whoever takes over has material to inspect, but still needs to establish whether it meets the request. File existence answers whether there is something to examine, not whether it is correct or complete.

The third test exposes another subtlety: the last message need not be the most informative one. If an earlier event explicitly reports failure, a later event without status should not erase it. The parser preserves the latest supplied status, error, and nonempty text separately, preventing a missing field from overwriting known information.

Both changes remove an unsupported inference from the dispatcher's decision.

## What should “done” make us check?

The experiment suggests separating a broad completion claim into a few practical questions:

- **Did execution succeed?** Check the AI service's reported outcome as well as the outer process exit code.
- **What was actually produced?** Opening narration, intermediate notes, and a finished result are all nonempty text.
- **Does it meet the request?** Even a successful run with a file still needs its result checked against the user's objective.

For users, a completion notice followed only by “Next, I will…” is a reason to inspect further. For developers, explicit errors, leftover files, and missing status fields make useful inputs to a result-handling test.

One question remains for discussion: could downstream checks be told when a response was admitted for compatibility without an explicit success status? That is a design question prompted by the experiment, not a demonstrated new defect. Nor have these results established the same problem in CodeFlowMu.
This question comes from the table's last two rows: explicit success and missing status both allow output to proceed in the tested path, but on different evidence. If downstream verification sees only a pass, can it distinguish them? A next investigation could check whether that distinction reaches the consumer and whether it should affect verification. These experiments have not answered those questions.

<details>
<summary>Further reading: can checking quota prevent this failure?</summary>

A subsequent [quota-routing change](https://github.com/yzhao062/anywhere-agents/commit/050ee0bd91c5d05c28f6f6b7c196a8d222328a4b) reads model-group quota snapshots before dispatch. An exhausted Claude/GPT group can fall back to Gemini; exhausted Gemini does not automatically switch into the scarcer group. The selected model and fallback explanation are recorded.

We ran seven original quota-policy unit tests covering the tightest bucket, nonfinite values, stale snapshots after failed refresh, reset times, unreported groups, model-name grouping, and disabling the check. All passed, alongside four helper checks. These used temporary caches and doubles, not live quota, cost, or throughput measurements.

A group absent from the snapshot may still be tried. Its capacity is unknown, not confirmed available. An early check helps choose a path, but permission to start and successful completion still require separate decisions.

</details>

**Scope and reproduction.** We tested how pinned source interprets specified inputs. We did not repeat the author's historical 152-dispatch audit or exhaust a real service quota; arbitrary event reordering and replay are outside these tests. The five before/after cases, quota checks, source pins, and original logs are in the [evidence package](../research/evidence/2026-09-14-continuity-contracts), maintained in the [research repository](https://github.com/joinwell52-AI/joinwell52).

Have you seen a tool report completion, only to open the result and find it still describing what it plans to do? What first alerted you? If you build these tools, how do you distinguish explicit success from compatibility admission, and does that distinction change downstream verification in practice?
