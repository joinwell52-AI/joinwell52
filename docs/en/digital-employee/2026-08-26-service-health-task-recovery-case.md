---
title: "The Service Is Up—Why Is the Task Still Undeliverable? From OpenHands to a Real Agent-Team Recovery Case"
date: '2026-08-26'
column: digital-employee
category: daily
article_type: case-study
edition: research-center
research_question: "When a session, attempt, or lease persists but a task has not reached an executable lifecycle state, how should a runtime stop unsafe dispatch and recover under bounded authority?"
summary: "From a public health-but-not-live incident slice to a bounded local lifecycle-recovery case: why health, activity, task state, and acceptance must be judged separately."
sources: "Public primary sources and the bounded scope of access-controlled first-party evidence are listed in the article."
project_relevance: case-evidence
item_id: "EBR-20260826-04"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-26-service-health-task-recovery-case-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-26-service-health-task-recovery-case-cover.png"
  kicker="Digital Employee · Engineering Research"
  title="The Service Is Up—Why Is the Task Still Undeliverable? From OpenHands to a Real Agent-Team Recovery Case"
  summary="Health, liveness, task lifecycle and formal acceptance are different facts; a real recovery case shows why an online green light is not deliverability."
  version="EBR-20260826-04"
  status="Engineering Research · 2026-08-26"
  languageHref="/zh/digital-employee/2026-08-26-service-health-task-recovery-case"
  languageLabel="中文"
/>

# The Service Is Up—Why Is the Task Still Undeliverable? From OpenHands to a Real Agent-Team Recovery Case

One browser-tool conversation close path was stuck for 8 hours and 21 minutes: `/health` still returned 200 and metadata remained readable, yet the conversation could neither close nor make progress. Treating “the service is up” as “the task will still be delivered” would let a scheduler send more work to an executor that can no longer advance.

This is not invented drama. [OpenHands software-agent-sdk PR #4548](https://github.com/OpenHands/software-agent-sdk/pull/4548) describes a production browser-tool conversation shutdown stuck for 8 hours 21 minutes while `/health` and metadata still returned 200 and conversation-event requests could not open. It establishes one small but important slice: **service health is not session liveness.** This article places that slice beside a real CodeFlowMu recovery record in which a worker could be woken before a necessary lifecycle migration, then gives four checks: service health, activity, task state, and finally deliverable acceptance.

With those checks, a team can decide whether to stop dispatch, recover a session, or return the decision to an accountable owner when an agent task is “up but not delivering.”

## One green light cannot answer four questions

| Fact to check | What it really answers | Common mistake |
| --- | --- | --- |
| Service health | Does the process or API respond? | treating 200 as completed work |
| Session/job activity | Are heartbeat, progress age, call deadline, and cancellation results plausible? | treating an existing session as productive work |
| Task lifecycle | Is the task unique, legal, and dispatchable? | waking a worker because a page says in progress |
| Formal acceptance | Do the report and review meet release conditions? | treating recovery as delivery acceptance |

The four facts are not interchangeable. Health is an entry check. Activity answers whether work is still advancing. Lifecycle answers whether another action is legal. Acceptance answers whether the result can be delivered. The rail/runtime serves the agent team by checking technical prerequisites, stopping unsafe dispatch, and preserving diagnosis and recovery paths; it does not announce that the business task is complete.

## The external incident illuminates liveness only

PR #4548 was submitted by AaronAbuUsama and merged by neubig on 2026-08-25. It changes `AsyncExecutor.close()` to cancel remaining work and wait at most ten seconds; on timeout it emits a warning and abandons the daemon thread. The discussion also says a subsequently merged per-conversation lifecycle lock limits a stuck close to one conversation.

That is the scope described by the PR. It does not establish correct task transitions, a complete report, or a fix for every OpenHands fault; it certainly does not establish the same root cause in CodeFlowMu. Its only role here is to make one question unavoidable even when health checks pass: is this particular conversation or job still advancing?

## How the local recovery walks through the four questions

CodeFlowMu’s access-controlled private evidence package records a recovery on 2026-08-25. The fault was not the OpenHands shutdown issue. It was a local path that could wake a worker before a required lifecycle migration. An effective governance directive gave PM narrowly bounded authority to repair migration, wake, and REPORT gates; add regression and evidence verification; recover or re-dispatch two stalled downstream tasks; and keep QA locked until genuine DEV and OPS terminal receipts existed.

Mapped to the four checks, this is more than an internal log:

| Recovery check | What the case records | What it does not establish |
| --- | --- | --- |
| Service health | it does not treat a health response as recovery or acceptance evidence | full component health diagnostics at that time |
| Session/job activity | it treats “stalled” work as something to recover or re-dispatch, not as business failure | complete heartbeat and cancellation chains for every session |
| Task lifecycle | it repairs migration and wake gates before subsequent dispatch | that every state defect has been eliminated |
| Formal acceptance | it contracts QA release on DEV and OPS terminal receipts | that current fields prove the prerequisite order |

![Recovery evidence coverage by fact axis](/assets/covers/2026-08-26-recovery-evidence-coverage.svg)

*Figure 1. Evidence scope, not a system-maturity score. The 3/3 and 5/5 results are two first-party regression sets; current fields do not prove acceptance causality. Source: access-controlled CodeFlowMu 2026-08-25 recovery-case evidence bundle, accessed 2026-08-26.*

The package preserves a repair commit, a sanitised replay fixture, and regression results: case regression 3/3, existing governance-routing regression 5/5, and a passing TypeScript check. This first-party material supports one bounded statement: the recovery path was recorded and replayed in the tested fixture. It is neither evidence that every fault self-heals nor independent validation.

## Design reflection: state presence is not causal order

The most important finding is not an all-green conclusion but an audit gap. In the extract, QA’s `released_at` precedes the `submitted_at` values of two upstream reports; the fixture only asserts that terminal states exist, not their causal order.

That does not itself prove a gate bypass. Clocks may be unsynchronised, write time may differ from logical event time, or the extract may omit relevant semantics. It does rule out a stronger claim: those physical timestamps cannot prove that QA was released after the upstream receipts.

The next version should make causality checkable. Every release needs to reference the report or review events satisfying its prerequisites and carry a monotonic logical sequence or version precondition. Wall-clock time remains useful for diagnosis, but not as the only judge of causality across processes and devices.

## Our view: the rail owns recovery boundaries, not delivery decisions

The OpenHands incident separates health from liveness; our recovery case further separates liveness, lifecycle, and acceptance. Our view is that the rail’s most useful role is not to decide whether an agent team has completed a project. It stops unsafe dispatch during a fault, preserves diagnosis, bounds recovery authority, and returns the next business choice to PM, ADMIN, or a formal reviewer. The 2026-08-25 directive, repair, and regression material show that such a bounded recovery was actually performed; the causal gap in QA time fields also shows why recovery records need logical-event links rather than one undifferentiated green state.

## Six checks before recovery

1. Is the task uniquely projected at its canonical path and in a legal executable state?
2. Do the current attempt and time-bounded execution right still belong to the correct agent, and have expiry or conflicts been reconciled?
3. What do heartbeats, progress age, and cancellation results say about the session, child process, and long job?
4. Is the execution report bound to the correct task and revision rather than a leftover run?
5. Does every release reference its prerequisite events and logical sequence instead of merely comparing wall-clock timestamps?
6. Does recovery authority cover only this technical action while an authorized role retains every business-release decision?

This is not a heavy control system. It is the minimum needed to prevent an up-but-undeliverable runtime from producing more unsafe actions and misleading evidence.

The OpenHands incident also raises a useful question: beyond process-level health, should readiness include lifecycle-progress signals such as bounded executor age and stuck conversation leases? This article does not answer for that project; it identifies a recovery-design direction worth checking.

### Sources

- [OpenHands software-agent-sdk PR #4548: bounded `AsyncExecutor.close()`](https://github.com/OpenHands/software-agent-sdk/pull/4548), merged 2026-08-25; accessed 2026-08-26. The 8-hour-21-minute incident and repair behavior are source-reported, not independently reproduced here.
- CodeFlowMu private recovery case `GOVERNANCE-SYSTEM-RECOVERY-20260825-001`, effective governance directive, repair commit, and regression fixture; access-controlled first-party evidence, not independent validation.
