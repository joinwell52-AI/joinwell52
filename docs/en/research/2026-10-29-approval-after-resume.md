---
schema: "publication-candidate-article/v2"
title: "Approved once. Can the AI resume in a new session?"
date: "2026-10-29"
published_date: "2026-10-29"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "How can the same Agent resume one approved operation in a new session without extending its scope?"
summary: "An exact operation was approved, but a resumed Agent was asked to seek approval again. A two-layer CodeFlowMu comparison makes the ownership of an approval a testable question."
cover: "/assets/approval-resume-20261029/approval-after-resume.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Pinned private source; temporary-project approval-record and native tool comparisons; no remote operation"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/approval-resume-20261029/approval-after-resume.cover-v1.png" kicker="Engineering research · Recovery and authority" title="Approved once. Can the AI resume in a new session?" summary="An exact operation was approved, but a resumed Agent was asked to seek approval again. A two-layer CodeFlowMu comparison makes the ownership of an approval a testable question." version="2026-10-29" languageHref="/zh/research/2026-10-29-approval-after-resume" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# Approved once. Can the AI resume in a new session?

An AI assistant is about to push a specific branch. You inspect the target and approve that operation. Then its execution session ends unexpectedly. The assistant resumes in a new session and requests **the very same operation**.

Two outcomes would be troubling. The old approval might follow the new session without checking who or what changed. Or the system might forget the approved scope and ask you to press the same button repeatedly. A precise recovery rule needs both sides: **a different actor, task, or target should be stopped; a legitimate retry by the same actor should retain its one approved opportunity.**

In current CodeFlowMu source, the second half proved harder than it sounds.

## Why three upstream changes brought us back to our own approval path

We did not try to reproduce another project's bug. [Codex's per-chat MCP leases](https://github.com/openai/codex/pull/57978) separate a shared connection from the identity of each chat using it. [OpenAI Agents JS's client-owned environment preparation](https://github.com/openai/openai-agents-js/pull/2085) preserves the owner of environment resolution across resume. [Paperclip's durable write recovery](https://github.com/paperclipai/paperclip/pull/17960) retains the original account, task, and request key; an account change cancels the old work. Together they raise a question: **when execution continues, who is now acting, and which authorization still applies?**

CodeFlowMu has its own approved Agent retry path. We narrowed the question to a testable boundary: an approval names an Agent, a task, and one specific operation. After the session changes, how does the system decide whether the incoming request is still that operation?

## Two layers answered differently

We pinned a current private CodeFlowMu source revision and created controlled requests in a temporary directory. The example request was `git push origin main` by DEV-01 for TASK-1. We called only the approval decision path: **no Git command ran and no remote service was contacted**. After an ADMIN approval, we compared the approval-record API with the native tool gate that handles real tool requests.

| Retry condition | Approval-record API | Native tool gate |
| --- | --- | --- |
| Original session 1, exact approved operation | Available | Allowed once |
| New session 2, named as the decision's wake target | Cross-session continuation is intended by the API | Requires approval again |
| New session 3, same Agent, task, and operation | Can consume the approval once | Requires approval again |
| Different Agent, task, or command target | No match | Still requires approval |

After the original session consumed the approval, a second use was rejected. The existing approval module's tests also passed **15/15**, including a test stating that an approved Agent retry survives a resumed Session. The interesting discrepancy is therefore between **the record API exercised by that test** and **the request built by the actual native tool gate**.

![The record API and native tool gate disagree about an exact operation in a new session](/assets/approval-resume-20261029/approval-after-resume.figure.en.svg)

*Figure: decisions from the temporary-project probe. This diagram does not represent a Git push that actually occurred.*

## How the approved operation lost its match

The record API computes an operation digest while excluding the session ID at the top level of the request. That leaves room for the same Agent to resume in a new session. It still checks Agent, task, project, operation fingerprint, and scope, and marks the authorization consumed after one use. That is a sensible intent.

The native tool gate, however, also places the session ID inside a **nested snapshot of operation facts**. When a new session rebuilds the request, the operation fingerprint remains the same, but the snapshot changes and so does the overall operation digest. Candidate matching requires both digest and fingerprint to match. The already approved record is therefore not found. Even session 2, which the decision named as its wake target, was asked for approval again; session 1 could consume it.

This is **not evidence of an authorization bypass**. Along the tested path, a legitimate continuation is blocked again. Simply deleting all session information would be careless: session identity matters for audit and accountability. The engineering question is which fields define the **approved operation**, and which describe **the particular execution that carried it out**.

## Toward an approval that can move without expanding

Our experiment covers pinned source, temporary files, the approval record, and the native tool decision. **We did not observe a customer incident or test real Host takeover, account switching, credential rotation, or remote outcomes.** The current product source is private. The [public evidence summary](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-10-29-resume-approval/00-report.en.md) gives the method, result table, and limits; it cannot let readers rerun the private Runtime.

Three questions remain:

1. **Who owns the approval?** Is a session the authorized subject, or a replaceable execution carrier? If the same Agent resumes twice, how is its current identity proved again?
2. **What exactly was approved?** Target, content, task, and project must still match. If the Host, account, or credential owner changes, which gate requires a fresh decision?
3. **What happened before recovery?** If a request reached a remote service and its receipt was lost, consuming an approval once does not prove the remote effect happened once. Recovery must verify the outcome before replaying.

For users, both “approved” and “please approve again” deserve the same follow-up: **is this a legitimate continuation of the exact operation, or has its scope changed?** For engineers, the challenge is to let an approval survive recovery without turning it into a pass that works for a different actor or target. [Research repository](https://github.com/joinwell52-AI/joinwell52)
