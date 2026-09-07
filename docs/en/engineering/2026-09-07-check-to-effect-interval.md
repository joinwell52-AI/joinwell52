---
schema: publication-candidate-article/v2
title: "The Check Passed. What Still Has to Hold When the Agent Acts?"
date: "2026-09-07"
published_date: "2026-09-07"
column: open-source-engineering
category: daily
article_type: comparative-engineering-analysis
edition: research-center
summary: "A source change before approval validation was refused. A change injected afterward reached the real copy executor. The comparison separates what a check binds from what keeps those facts true until execution."
cover: "/assets/last-check-boundary-20260907/02-check-to-effect-cover-v1.png"
language: en
lifecycle: Published
publication_authorized: true
evidence_status: "Controlled timing study complete; production concurrency and ingress reachability unverified"
pageClass: last-check-boundary-article
---

<ArticleCover image="/assets/last-check-boundary-20260907/02-check-to-effect-cover-v1.png" kicker="Open-source Engineering · Controlled Study" title="The Check Passed. What Still Has to Hold When the Agent Acts?" summary="A source change before approval validation was refused. A change injected afterward reached the real copy executor. The comparison separates what a check binds from what keeps those facts true until execution." version="2026-09-07" languageHref="/zh/engineering/2026-09-07-check-to-effect-interval" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.last-check-boundary-article .vp-doc h1[id] { display: none; }</style>

[Open full-resolution cover](https://joinwell52-ai.github.io/joinwell52/assets/last-check-boundary-20260907/02-check-to-effect-cover-v1.png)

# The Check Passed. What Still Has to Hold When the Agent Acts?

When a file operation is approved, its source contains A. Must it still contain A when the executor reads it?

That sounds like a filesystem detail, but agents routinely cross delays: approval, queuing, resource availability, and execution. If an object or condition changes along the way, what does an earlier successful check still permit?

A natural response is to check again, closer to execution. That is useful, but incomplete without another question: **what was checked, and what can change between that check and the actual effect?**

We compared external proposals for start admission and exact file updates with a controlled timing experiment using CodeFlowMu’s real approval service and file executor. We did not reproduce a production concurrency incident. The post-check change was explicitly injected by the research code.

## 1. “Before execution” can refer to different objects

Paperclip is an open-source system for organizing agent work and runs. Its still-open [PR #12949](https://github.com/paperclipai/paperclip/pull/12949) proposes capacity admission after a run is claimed but before adapter startup. Observation and enforcement modes have different effects. This remains proposed functionality, not a delivered guarantee.

A capacity decision about starting a run is not authorization for every later file operation inside that run. Those operations have their own objects and conditions.

[GitHub MCP Server Draft PR #3232](https://github.com/github/github-mcp-server/pull/3232) operates at another level: a particular repository file change. MCP exposes external operations as agent tools; this proposal binds an exact text update to expected branch and file-object identifiers.

The distinction is not a ranking of which project is safer. One concerns a run’s startup conditions; the other concerns a concrete repository mutation. Calling both a “gate” can hide their different responsibilities.

## 2. Moving the source change across the check

CodeFlowMu is a local multi-agent collaboration system we are developing. Its controlled file-operation requests include workspace and task identity, plus source and destination snapshots. Before execution, the current request is rebuilt and its digest is compared with the approved request. The digest is a fingerprint of the structured input, not a lock on the underlying file.

Earlier work had already shown that a changed destination can invalidate approval. Here we asked a different question: does changing source contents at different times produce the same outcome?

Using real components at commit `c008d9db91a21136fc61a4f60314e22db395d5d2`, we ran two copying scenarios. Both began with an existing destination and explicitly allowed overwrite. Overwrite was therefore not the disputed condition; the difference was when the source changed relative to digest validation.

| Comparison | When the source changed | Result, identical in both rounds | Filesystem effect |
| --- | --- | --- | --- |
| Before validation | After approval, before rebuilding and checking the current request | `APPROVAL_STALE`; execution callback entered zero times | Original destination preserved |
| After validation | Inside the research callback after approval validation, before calling the real executor | Recorded as succeeded; callback entered once | Destination received changed source contents |

The intervention in the second row is important. We did not observe a real user winning a race. After the approval service entered its execution callback, research code changed a synthetic source file, then called the existing product copy function. That point was deliberately controlled by the probe; we have not established equivalent control through an online interface.

The first row supports an existing protection. The second establishes behavior of the tested function composition under an injected sequence. Neither establishes who could change the source in a deployment, which ingress permits the same interleaving, or its likelihood.

![E4 refuses a pre-check source change; E5 copies bytes changed by a post-check research injection](/assets/last-check-boundary-20260907/02-check-timing.en.png)

*Figure 1. E4/E5 timing comparison, two rounds each, with overwrite allowed in both. E5 explicitly injects the change after validation; it is not a reproduced production race. Source: formal controlled-study records; see the [evidence notes](/en/research/evidence/2026-09-07-last-check-effect-boundary).*

[Open full-resolution figure](https://joinwell52-ai.github.io/joinwell52/assets/last-check-boundary-20260907/02-check-timing.en.png)

## 3. The digest was correct—for the input it described

The approval service receives a current request and compares its digest with the approved one. On a match it records execution as in progress, then invokes the executor callback. The copy executor subsequently reads the source path.

In the first scenario, rebuilding the request observes the changed source snapshot. Validation rejects it before callback entry.

In the second, validation has already completed. The executor opens the same path, but the bytes there have changed. The approved source snapshot identifies `source-before`; the destination contains `source-after`, with a different digest. Both formal rounds produced that result.

There is no need to suppose a hash failure. The digest correctly describes the checked representation; it cannot prevent the mutable object behind that representation from changing afterward.

This is the time relationship studied under TOCTOU—time of check to time of use. Naming that relationship does not establish an exploitable race in a production path. **A snapshot describes facts; it does not freeze them by itself.**

Likewise, publishing a destination through a temporary file and rename can address one class of write-publication problem. It does not independently establish that the source bytes are still the approved ones.

## 4. Preconditions need a corresponding commit rule

The GitHub proposal connects expected identifiers with commit construction and a non-forced branch update. That is more specific than a preflight warning. However, rejecting non-fast-forward updates is not proof of strict compare-and-swap behavior under every branch movement or rewind. The author also reports not running the complete Go suite in their environment; we performed no remote integration rerun. Its result already includes before/after identifiers. The downstream question is whether callers preserve and bind that receipt. [Proposal and limitations](https://github.com/github/github-mcp-server/pull/3232)

Paperclip raises a separate applicability question: reattaching work already started is not the same as admitting a new start. Capacity should also correspond to the provider and model actually selected. Those issues appear in the [proposal’s review discussion](https://github.com/paperclipai/paperclip/pull/12949); we did not independently rerun its recovery or database-concurrency scenarios.

These designs illuminate our experiment without validating it on our behalf. A Git branch update is not a local copy; capacity admission is not operation approval. The common question is narrower: **do validation, execution, and commit still refer to the same object and conditions?**

## 5. Investigate the remaining interval before building a framework

Adding another check is not automatically sufficient: a change can occur after that check too, and different resources need different mechanisms.

First establish:

1. **What was approved?** A path, exact bytes, a version, or a combination?
2. **What does the effect consume?** Bound data, or a fresh read of a mutable path or configuration?
3. **What preserves the condition through commit?** Exclusive ownership, a conditional update, an immutable object, or only a prior observation?
4. **What happens when conditions change?** Zero-effect refusal, partial effects, and insufficient evidence are different outcomes.

A real-ingress experiment should include unchanged input, changes before checking, and changes after checking. Record source/destination digests, actual invocations, and receipts. Legitimate operations must still work. A refusal should be checked against resulting bytes, not merely an error message.

Our present result supports further investigation of the registered call path and filesystem competition. It does not authorize a general transaction engine or establish a live race vulnerability. Where a host, storage system, or executor already provides conditional-commit guarantees, investigate reuse before duplicating them.

**Reliable execution requires more than “we checked before acting.” It requires an explanation of why the checked conditions still hold when the effect occurs.**

## Evidence and limits

This article uses E4/E5, twice each: four observations. Together with the companion article’s E0–E3, they make one twelve-observation formal batch. The [English evidence guide](/en/research/evidence/2026-09-07-last-check-effect-boundary), [de-identified observations](https://joinwell52-ai.github.io/joinwell52/assets/last-check-boundary-20260907/evidence/observations.json), and [Chinese guide](/zh/research/evidence/2026-09-07-last-check-effect-boundary) are publicly provided with this article.

The pilot also used no-overwrite in the timing cases, mixing two questions. The formal rerun allowed overwrite in both, isolating the timing comparison. Pilot records were retained but excluded from formal counts.

This is a Windows study of real product components with injected ordering—not live HTTP, panel, agent, multi-process contention, or remote GitHub mutation. Checking the records is distinct from rerunning the product. The writing stage performed no additional product experiment, code modification, independent QA, or repair.
