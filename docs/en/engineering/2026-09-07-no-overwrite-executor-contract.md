---
schema: publication-candidate-article/v2
title: "The Request Said “Do Not Overwrite.” Why Was the File Replaced?"
date: "2026-09-07"
published_date: "2026-09-07"
column: open-source-engineering
category: daily
article_type: engineering-case-study
edition: research-center
summary: "With the same no-overwrite flag, writing refused an existing destination while copying and moving replaced it. A controlled study separates recording a restriction, binding it to approval, and enforcing it."
cover: "/assets/last-check-boundary-20260907/01-no-overwrite-cover-v3.png"
language: en
lifecycle: Published
publication_authorized: true
evidence_status: "Controlled study complete; public-ingress applicability requires review; no fix implemented"
pageClass: last-check-boundary-article
---

<ArticleCover image="/assets/last-check-boundary-20260907/01-no-overwrite-cover-v3.png" kicker="Open-source Engineering · Controlled Study" title="The Request Said “Do Not Overwrite.” Why Was the File Replaced?" summary="With the same no-overwrite flag, writing refused an existing destination while copying and moving replaced it. A controlled study separates recording a restriction, binding it to approval, and enforcing it." version="2026-09-07" languageHref="/zh/engineering/2026-09-07-no-overwrite-executor-contract" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.last-check-boundary-article .vp-doc h1[id] { display: none; }</style>

[Open full-resolution cover](https://joinwell52-ai.github.io/joinwell52/assets/last-check-boundary-20260907/01-no-overwrite-cover-v3.png)

# The Request Said “Do Not Overwrite.” Why Was the File Replaced?

We put a no-overwrite restriction into a file-operation request. The approval record preserved it.

The destination was replaced anyway.

This was a controlled experiment with synthetic files, not a customer data-loss incident. The useful surprise was the comparison: with `overwrite=false`, writing refused an existing destination, but copying and moving succeeded and replaced its contents.

The approval record alone suggested that the restriction was explicit. The completion receipt alone suggested that the operation worked. Only when we compared both with the resulting bytes did the question become unavoidable: **which component actually enforced “do not overwrite”?**

## 1. Following a parameter all the way to the file

CodeFlowMu is a local multi-agent collaboration system we are developing. It organizes work through task files, execution sessions, and evidence. Its controlled workspace operations construct a concrete request, obtain one-time approval, check the request at execution, and delegate to a filesystem executor.

Our question was not whether approval could be bypassed. It was whether a restriction already inside the approval chain retained its meaning at the final operation.

The experiment used the real request builder, approval service, and filesystem executor. Each scenario created synthetic files in a fresh isolated directory and received a research-only administrative approval through the service. We did not invoke the live panel or let an agent touch business files.

At source commit `c008d9db91a21136fc61a4f60314e22db395d5d2`, we ran four scenarios twice:

| Scenario | Restriction | Result, identical in both rounds | Filesystem observation |
| --- | --- | --- | --- |
| Write to an absent destination | No overwrite | Succeeded | New contents written |
| Write to an existing destination | No overwrite | Refused; operation recorded as failed | Original contents preserved |
| Copy to an existing destination | No overwrite | Succeeded | Destination replaced; source retained |
| Move to an existing destination | No overwrite | Succeeded | Destination replaced; source moved |

The second row is essential. The write executor already has a working protection; the copy and move results do not justify saying that every file operation ignores overwrite constraints. The first row matters too: refusing more operations is not inherently correct. A legitimate new file should still be created.

These eight observations establish a difference between tested interfaces, not a production incident rate.

![Observed write, copy and move outcomes with the same no-overwrite flag](/assets/last-check-boundary-20260907/01-executor-comparison.en.png)

*Figure 1. Explanatory rendering of E0–E3, two rounds each, retaining both the legitimate-creation and refusal controls. This is not an experiment screenshot; Source: formal controlled-study records; see the [evidence notes](/en/research/evidence/2026-09-07-last-check-effect-boundary).*

[Open full-resolution figure](https://joinwell52-ai.github.io/joinwell52/assets/last-check-boundary-20260907/01-executor-comparison.en.png)

## 2. The restriction survived. Its enforcement did not follow every branch

We traced the parameter through the code. The shared workspace input includes `overwrite`; the builder puts it in the approval request, and reconstruction from the approval record preserves it. Both copy and move records retained `false`.

The result was therefore not caused by a model omitting the flag, or by transmission turning false into true.

The difference appears in the final executor:

- The write branch checks whether the destination exists and overwrite is explicitly forbidden. It raises `target_exists_and_overwrite_is_false` and preserves the bytes.
- The copy branch calls the file-copy operation without using that flag in the branch.
- The move branch calls the rename operation without using it either.

On the tested Windows system, the latter two operations replaced the destination. We read the actual result; this is not an inference based only on function names.

An approval digest can establish that an execution request matches its approved representation. It cannot, by itself, establish that the executor implements every restriction in that representation. A faithfully stored field does not enforce itself.

We also distinguished callback entry from operation outcome. The refused write entered the callback, then its exception was recorded as a failed operation. Copy and move were recorded as successful. A research process exiting normally is not proof that every product contract passed acceptance.

## 3. A “create file” proposal raises a related question

OpenAI Agents SDK is a library for building agent applications. In its still-open [PR #4893](https://github.com/openai/openai-agents-python/pull/4893), an author reports a create operation replacing an existing file and proposes an absence check. We did not independently rerun that work.

That restriction comes from the operation’s definition; ours comes from an explicit request parameter. Both ask whether the effect promised to the caller is enforced where the file changes. Neither implies that all write operations should become create-only.

A separate, also-open [PR #4894](https://github.com/openai/openai-agents-python/pull/4894) addresses delimiters inside mount-option inputs. It is a reminder that validating a permission and preserving a parameter’s meaning are separate responsibilities.

External cases illuminate the question. They neither reproduce our result nor prove that our product shares their complete failure paths.

## 4. Fix the executor—or first narrow the interface?

The tempting next step is to add a condition. Before choosing that implementation, we need to settle the contract: **which operations is no-overwrite supposed to constrain?**

If the product contract applies it to write, copy, and move, the latter branches need to enforce it with an appropriate filesystem operation. If the guarantee must also hold under concurrency, sequential checks are insufficient evidence; the interval between checking and writing needs its own tests.

If the flag is write-only, copy and move should reject it as inapplicable, or use input types that prevent the ambiguity. Silently accepting it into an approval record invites callers to rely on a restriction that does nothing.

We confirmed reproducible behavior at the internal controlled-request boundary. Static inspection also found the executor registrations wired to the shared preparation and execution functions. We have not completed the public-ingress investigation: which callers can pass the flag, how the interface presents it, and whether it is formally specified as a shared restriction.

This warrants a narrow contract review. It is not a demonstrated live privilege bypass, and no fix has been implemented. The study did not change product code or authorize a new general-purpose permission framework.

## 5. Test how restrictions fail, not just whether approval succeeds

For each important restriction, record where it enters, where approval binds it, which executor branches consume it, what rejection looks like, and whether the original object remains unchanged.

Tests should come in pairs: a legitimate case that completes, and a prohibited case that is refused without producing the forbidden effect. Checking only an error string can miss another false protection: modifying the file first and reporting an error afterward.

Test each operation mode separately. A positive write test does not cover copy and move. Shared input types do not establish shared enforcement.

**Recording a restriction creates an audit trail. Enforcing it creates the capability a caller can actually rely on.**

## Evidence and limits

This article uses E0–E3, twice each, from the formal dataset. The companion article uses different rows from the same research batch. The [English evidence guide](/en/research/evidence/2026-09-07-last-check-effect-boundary), [de-identified observations](https://joinwell52-ai.github.io/joinwell52/assets/last-check-boundary-20260907/evidence/observations.json), and [Chinese guide](/zh/research/evidence/2026-09-07-last-check-effect-boundary) are publicly provided with this article.

All files were synthetic and isolated. There is no production loss-rate sample, live HTTP/panel/agent end-to-end test, or multi-process overwrite-race test. Findings are bounded by the pinned source and Windows environment. Record-integrity checks are not product reruns or independent QA. No repair, merge, or release is claimed.
