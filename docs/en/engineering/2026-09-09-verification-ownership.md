---
schema: "publication-candidate-article/v2"
title: "The Verification Claim Was Denied. Why Was Its Completion Still Attempted?"
date: "2026-09-09"
published_date: "2026-09-09"
column: "open-source-engineering"
category: "daily"
article_type: "comparative-engineering-analysis"
edition: "research-center"
research_question: "The Verification Claim Was Denied. Why Was Its Completion Still Attempted?"
summary: "Six experiments against an upstream verification tool separate request identity, execution, and the authority to finish a request."
cover: "/assets/verification-evidence-20260909/02-verification-ownership.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded experiments; not independent QA; dependency substitutions disclosed"
pageClass: "verification-evidence-article"
sources:
  - "https://github.com/Runfusion/Fusion/pull/3590"
---

<ArticleCover image="/assets/verification-evidence-20260909/02-verification-ownership.png" kicker="Engineering · Experimental research" title="The Verification Claim Was Denied. Why Was Its Completion Still Attempted?" summary="Six experiments against an upstream verification tool separate request identity, execution, and the authority to finish a request." version="2026-09-09" languageHref="/zh/engineering/2026-09-09-verification-ownership" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.verification-evidence-article .vp-doc h1[id] { display: none; }</style>

# The Verification Claim Was Denied. Why Was Its Completion Still Attempted?

A verification request is already running. Another executor receives its ID, together with a negative claim result. Two questions follow: can the second executor continue running its own command, and can it attach that result to the first request?

Our isolated experiment observed the second behavior at a tool boundary: the unclaimed branch executed the current command and invoked the completion callback with the existing request ID. Persistence was a fixture, so this does not establish an actual database update.

## Persistence makes the question possible

Fusion is an open-source project for organizing agent development work. [PR #3590](https://github.com/Runfusion/Fusion/pull/3590) proposes write-ahead verification records, bounded execution, and stale-running recovery. We inspected the still-unmerged commit `b5d75aba5e7cdc145921113a1b069db95fa781f7`.

A request must survive before a recovery process can inspect it. But its existence leaves another obligation: the stored work, executed command, and authorized completer must correspond.

Following the returned request ID exposed where that correspondence needs attention.

## One identifier, several responsibilities

The tool saves `request.requestId` before handling `claimed=false`. That branch warns, but neither stops execution nor clears the saved ID. It then runs the current `effectiveCommand`. The completion helper checks that persistence and a nonempty ID exist before calling `finish`.

Allowing an untracked check to proceed may be a deliberate availability choice. Sending its outcome to a different in-flight request requires a separate justification.

The inspected storage completion function matches task, request ID, and running state. This identifies a database integration question; reading the condition does not test transaction isolation or concurrent ownership.

## Six experiments through the original tool

We loaded the complete upstream module, erased TypeScript types, and supplied explicit dependency seams. The actual `createRunVerificationTool().execute()` ran. Queue admission was immediate, persistence was controlled, and the sandbox seam executed a harmless `node --version` child process.

| Condition | Execute calls | Finish calls | Observation |
| --- | ---: | ---: | --- |
| Fresh request | 1 | 1 | Persist, execute, finish |
| Claimed response identifies another command's request | 1 | 1 | Current command; existing request ID |
| Existing running request, claimed=false | 1 | 1 | Completion still attempted |
| Upsert throws | 1 | 0 | Tool reports execution success |
| Runner throws | 1 | 1 | Failed completion attempted, error rethrown |
| Finish throws | 1 | 1 | Tool still reports execution success |

![Figure: schematic of the saved observations discussed above. Arrows show the stated processing relationship, not a runtime screenshot. Source: accompanying experimental evidence.](/assets/verification-evidence-20260909/verification-ownership-figure.en.svg)

*Figure 1. schematic of the saved observations discussed above. Arrows show the stated processing relationship, not a runtime screenshot. Source: accompanying experimental evidence.*


Two independent process runs agreed. The runner-error control prevents an overstatement: ordinary failure settlement exists. The issue is how particular ownership and persistence failures constrain later callbacks.

A callback count measures an attempted operation. Our fixture accepting it is not proof that PostgreSQL accepted an incorrect update.

## Execution success and recorded success

Continuing after write-ahead failure exposes a real design choice: should a useful check stop whenever recording is unavailable? Either answer needs an explicit contract. If execution continues, callers should distinguish “the command succeeded” from “its outcome is durably recorded.”

Likewise, failure to persist a successful result is not automatically a reason to rerun the command. Recovery may need to resubmit evidence, provided that evidence still belongs to the same work and authorized attempt.

Review three relationships: whether claim failure revokes completion authority; whether the claimed work matches the executed command; and whether execution and persistence outcomes remain independently visible.

Possible designs include rejecting incompatible claims, executing the claimed request's command, or creating a separate request. A completion capability or attempt identity may be appropriate, but this study does not freeze that interface.

These are upstream findings, not a demonstrated CodeFlowMu defect. We did not run Fusion's database, full queue, or startup recovery. The [evidence guide](https://joinwell52-ai.github.io/joinwell52/en/research/evidence/2026-09-09-verification-evidence) records exactly which dependencies were replaced.

Persisting a request lets a system remember that work exists. Checking completion authority lets it justify which later result belongs to that work.
