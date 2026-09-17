---
schema: "publication-candidate-article/v2"
title: "No reply. Will retrying launch a second AI agent?"
date: "2026-09-17"
published_date: "2026-09-17"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "No reply. Will retrying launch a second AI agent?"
summary: "The action may have happened even when its reply disappears. A real-file experiment separates replaying a recorded result from refusing an uncertain retry."
cover: "/assets/control-intent-20260917/retry-without-second-launch.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded original-code experiments; scope in article"
pageClass: "control-intent-article"
---

<ArticleCover image="/assets/control-intent-20260917/retry-without-second-launch.cover-v1.png" kicker="Open-source engineering · Experimental research" title="No reply. Will retrying launch a second AI agent?" summary="The action may have happened even when its reply disappears. A real-file experiment separates replaying a recorded result from refusing an uncertain retry." version="2026-09-17" languageHref="/zh/engineering/2026-09-17-retry-without-second-launch" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.control-intent-article .vp-doc h1[id] { display: none; }</style>

# No reply. Will retrying launch a second AI agent?

You tap “Start agent” on your phone. A few seconds pass. Nothing answers.

Should you tap again? If the first request never arrived, that seems sensible. If the computer already created a workspace and started the agent, but its reply disappeared, another tap could create a second job.

**No reply does not mean no action.** Sometimes the safest answer is “we cannot determine the outcome yet.”

## Give the operation an identity

The inspiration is [Orca #21106](https://github.com/stablyai/orca/pull/21106), by brennanb2025. Orca connects remote devices with computers running AI agents. This change adds durable records for launch operations so a repeated request can recover an existing result.

We were interested because launching an agent can create directories, sessions and subsequent work. A duplicate launch is more consequential than a repeated sentence.

An operation ID works a little like a collection number. Bring back the same number and the computer checks its records before opening a new order. It also checks who supplied the number and whether the request still contains the same task.

At our read, the PR had merged on September 17 UTC. Its description explicitly says that no shipped client yet sends the outer operation ID. This is host-side groundwork, not evidence that every phone retry already uses it.

## Throw away the first reply

We ran the original durable store and launch-admission code with real temporary files. We saved a synthetic successful result, discarded the initial response, then retried with the same operation identity.

| Controlled situation | Observed result |
| --- | --- |
| Success was saved but the reply was discarded | Replayed the same saved result |
| Store reopened in the same process | Replayed the saved result |
| Same operation ID, changed task | Rejected as a conflict |
| Same paired device, rotated bearer token | Replayed the existing result |
| Operation claimed, final result missing | Refused another execution; outcome stayed unknown |
| Eight concurrent admissions for one operation | One execution admission; seven unknown refusals |

The first rows show that a result can be recovered from the record. The changed-task row shows why a number cannot be reused indiscriminately. The final rows introduce the harder question: why can a system remember a request and still be unable to continue it?

![Recorded outcomes can be replayed; uncertain outcomes must not be guessed](/assets/control-intent-20260917/retry-without-second-launch.figure.en.svg)

*Figure 1. Source: author illustration from the real-file experiment. “Claimed” and “settled” are different records. No real agent or mobile interface ran in this probe.*

## “Unknown” can be an honest, useful answer

Suppose the computer records “I will execute this,” then loses contact before saving the outcome. That record alone cannot say whether work never began, partly finished, or completed without a final write.

Executing again may duplicate work. Reporting success may leave a person waiting for something that never happened.

The tested admission function preserves uncertainty. Our eight-request experiment stops at that boundary. A higher-level handler can join live work; we did not run that handler. Seven admission refusals therefore do not mean seven user retries fail in the complete product.

Reopening a file store is also not a process-crash test. We did not simulate power loss, actual workspace creation, or a service restart. What we verified is precise: saved outcomes can be replayed, while an unfinished claim does not become permission to execute again merely because the same number returns.

## After preventing duplication, help the person recover

Avoiding a second action solves one problem. It leaves another: what should the user do now?

For technical readers, the next question is how an unknown outcome can be investigated. Can the system inspect live work or partially created resources, then support recovery or human intervention? How should that evidence remain tied to the original operation and paired device without turning an inspection into another launch?

The source already describes uncertainty and broader recovery boundaries. Our experiment makes the tradeoff tangible: preventing duplication and providing a usable recovery path are separate pieces of work.

For everyone using these tools, the wording matters. After a silent click, does the interface say “not started,” “still running,” or “unable to confirm”? Those messages lead people to very different decisions.

<details>
<summary>Fixed revision, scope and complete observations</summary>

Revision: `d60ff2db02bf2b6c6ac4fd39c179c9854409d2a4`. We executed the complete original durableAgentSessionRecordStore plus admitAgentLaunchOperation, fingerprint and registry logic with real temporary files and proper-lockfile.

The 11 observations also cover caller partitioning between paired devices, replay of recorded failures, missing paired identity for remote callers, and an expired previously unseen operation ID. Bearer rotation retained the same paired-device identity.

The concurrent test stops at admission; the higher-level live-join handler was not exercised. Reopening occurred within one process. Saved launch outcomes were synthetic: no real workspace, model or mobile call was created.

[Results and reproduction scripts](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-17-control-intent). These observations do not establish a duplicate-launch defect or missing idempotency protection in CodeFlowMu.

</details>

[Research repository](https://github.com/joinwell52-AI/joinwell52)
