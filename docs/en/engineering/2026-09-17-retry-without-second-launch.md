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

Should you tap again? If the first request never arrived, that seems sensible. If the computer already began acting but its reply disappeared, another tap could create a second job.

Imagine two agents modifying separate copies of the files, leaving you to choose which work to keep. Duplicate work may also consume additional resources. These are possible consequences, not incidents observed in our experiment. They explain why the silent click matters: **no reply is not evidence that nothing happened.**

## Look up the original operation

The inspiration is [Orca #21106](https://github.com/stablyai/orca/pull/21106), by brennanb2025. Orca connects remote devices, such as phones, with computers running AI agents. This change saves launch records to a file so a retry can recover an existing result.

We were interested because starting an agent may also create a workspace and a session. Repeated words can be ignored; two jobs may keep producing consequences.

The mechanism gives each launch an operation number. The first request and its retry use the same number, allowing the computer to look up the original record. In code, this is the operation ID. The check also considers the caller and task contents, so an old number cannot silently stand for a different request.

One distinction carries the design: **“I accepted this operation” and “I completed this launch” need separate records.**

## What does the record contain when a retry arrives?

We ran the original code that stores these records and decides whether a launch may proceed, using real temporary files. We saved a synthetic successful result, discarded the initial response, then returned with the same operation number.

“Successful result” here means the result of launching, such as which workspace was returned. It does not mean the agent finished its subsequent assignment. No real agent ran in our probe.

| Controlled situation | What the retry returned |
| --- | --- |
| Launch success saved, reply discarded | The same saved result |
| Operation accepted, final outcome missing | Unknown; another execution was refused |
| Same number, different task contents | Conflict: this is not the original request |

The first row shows why keeping records helps: a lost reply does not erase a saved result. The third shows why numbers cannot be reused indiscriminately. The second is harder to accept—if the operation was recorded, why can it not simply continue?

![The same number returns: is the record complete?](/assets/control-intent-20260917/retry-without-second-launch.figure.en.svg)

*Figure 1. Source: author illustration from the real-file experiment. Completion here concerns the launch operation; successful outcomes were synthetic.*

## What happened after acceptance?

Suppose the computer records “I will execute this,” then loses contact before saving an outcome. That record alone allows at least three explanations: work never began, partly happened, or the launch finished without its final result being written.

An accepted operation therefore cannot be translated directly into either “not done” or “successful.” Executing again might duplicate work; declaring success might leave someone waiting for a job that does not exist.

The tested code preserves that uncertainty. Receiving the same number again does not issue another execution permission. We also reopened the store in the same process and could still recover saved results. That is not a test of complete recovery after power loss or a process crash.

At our read, the change had merged on September 17 UTC, but shipped clients did not yet supply the required outer operation ID. The source also explicitly leaves broader recovery outside this change. Our experiment explains how this record layer handles retries; it cannot establish protection for every tap in the mobile product.

## An uncertain answer still needs a next step

Preventing a duplicate action matters. The person waiting still needs to decide whether to wait, inspect the work, or seek help.

Our experiment points toward evidence gathering: the original operation number, any still-running task and any resources already created could help reduce guesswork. Those are directions for future design and validation. We did not implement inspection or recovery.

Users can contribute a concrete timeline: what the interface said when the reply was missing, what they did next, and whether they later discovered work already running. That helps distinguish an action that never happened from a reply that never arrived.

**When a system can only say “unable to confirm,” what evidence should it provide so a person can confidently choose the next step?**

<details>
<summary>Fixed revision, scope and complete observations</summary>

### Original detailed comparison

Admission is the check that permits execution to begin. The eight-request result below concerns this layer only. The higher-level handler joins live work; it was not exercised, so seven refusals cannot be read as seven failed user retries.

| Controlled situation | Observed result |
| --- | --- |
| Success was saved but the reply was discarded | Replayed the same saved result |
| Store reopened in the same process | Replayed the saved result |
| Same operation ID, changed task | Rejected as a conflict |
| Same paired device, rotated bearer token | Replayed the existing result |
| Operation claimed, final result missing | Refused another execution; outcome stayed unknown |
| Eight concurrent admissions for one operation | One execution admission; seven unknown refusals |

Revision: `d60ff2db02bf2b6c6ac4fd39c179c9854409d2a4`. We executed the complete original durableAgentSessionRecordStore plus admitAgentLaunchOperation, fingerprint and registry logic with real temporary files and proper-lockfile.

The 11 observations also cover caller partitioning between paired devices, replay of recorded failures, missing paired identity for remote callers, and an expired previously unseen operation ID. Bearer rotation retained the same paired-device identity.

The concurrent test stops at admission; the higher-level live-join handler was not exercised. Reopening occurred within one process. Saved launch outcomes were synthetic: no real workspace, model or mobile call was created.

[Results and reproduction scripts](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-17-control-intent). These observations do not establish a duplicate-launch defect or missing idempotency protection in CodeFlowMu.

</details>

[Research repository](https://github.com/joinwell52-AI/joinwell52)
