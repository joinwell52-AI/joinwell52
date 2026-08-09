---
title: Research Report Production Engine V2.0
description: A recoverable Digital Research Employee production system built on Runtime Center V5, Scheduler V3.0, dependency-aware recovery, self-checks and GitHub First.
outline: deep
---

<ArticleCover
  image="/assets/covers/research-report-production-engine-v1.svg"
  kicker="Digital Employee Factory · Current Capability Release"
  title="Research Report Production Engine V2.0"
  summary="A dependency-driven, catch-up capable, recoverable and self-validating Digital Research Employee Runtime."
  version="V2.0"
  status="2026-08-09 · Current Capability Release"
  languageHref="/zh/publications/research-report-production-engine-v2.0"
  languageLabel="中文"
/>

## Definition

**Research Report Production Engine V2.0** is a GitHub-first Digital Research Employee Runtime whose research work is performed by ChatGPT workers. GitHub cron is a wake-up signal, not the source of operational truth. `SCHEDULER.json + Runtime Records` determine what is actually due. The runtime can detect missed shifts, recover from the earliest dependency-ready stage, reopen dependency-blocked work after its prerequisite completes, and validate both machine records and human-readable ledgers after state transitions.

## Why V2.0

V1.x established a real production line spanning intelligence discovery, three-column triage, research skills, 15:00 Production, 20:00 Publication and GitHub Commit Verify. V2.0 addresses a different problem: **how that production line remains correct when scheduling is delayed, historical results are heterogeneous, dependencies are incomplete, or a stage becomes blocked.**

```text
V1.x: time-triggered production line
              ↓
V2.0: dependency-driven recoverable runtime
```

A cron occurrence is no longer treated as task truth, and a later stage may not jump over an incomplete prerequisite merely because its clock time has arrived.

## Formal Daily Runtime

```text
09:00 Discovery → Signal Pool
10:00 Queue → Today's Research Plan
11:00 Reading → Reading Result
13:00 Analysis → Research Object
15:00 Production → Publication Candidate
20:00 Publication → GitHub + Website + Commit Verify + Release
```

Sunday adds a seventh task:

```text
20:30 Weekly → Weekly Synthesis
```

A Sunday operational ledger therefore contains **7 tasks**.

## Cron is a wake-up signal

Each Scheduler heartbeat re-derives work from durable facts:

```text
SCHEDULER.json
+ Runtime Records
+ current Asia/Shanghai time
        ↓
due shifts
+ durable statuses
+ completed prerequisites
+ dependency-blocked shifts now ready
        ↓
open only the oldest runnable overdue shift
```

The heartbeat minutes are offset from top-of-hour congestion. Missing one or more heartbeats delays work but does not expire it.

## Strict dependency order

```text
Discovery
→ Queue
→ Reading
→ Analysis
→ Production
→ Publication
→ Weekly (Sunday)
```

Queue requires completed Discovery; Reading requires completed Queue; Analysis requires completed Reading; Production requires completed Analysis; Publication requires completed Production; Sunday Weekly requires completed Publication. A due time never overrides these gates.

## Recoverable Blocked state

A dependency-caused Blocked result records its prerequisite explicitly, for example:

```json
{
  "status": "Blocked",
  "blockedBy": "reading"
}
```

After `reading` becomes `Completed`, Scheduler may use the governed `reopen-blocked` path to reopen Analysis. Ordinary Blocked states and Completed, Failed or Skipped work are not arbitrarily reopened.

## Ordered catch-up

Recovery follows this algorithm:

1. enumerate today's tasks whose formal time has arrived;
2. read durable status for each task;
3. exclude Running, Completed, Failed and Skipped;
4. allow Waiting only when its prerequisite is Completed;
5. allow Blocked only when it is dependency-blocked and that dependency is now Completed;
6. sort by formal schedule time;
7. open **one oldest runnable shift per heartbeat**;
8. let later heartbeats continue catch-up.

This prevents a multi-hour outage from reopening Reading, Analysis and Production concurrently.

## Self-check loop

Every opened or recovered slot must pass:

```text
Runtime V5 validate
→ Markdown ledger render
→ Markdown ledger validate
→ durable Git commit
→ fetch / ancestor verify
→ taskStatus == Running verify
→ Execution Slot Opened event verify
```

Terminal results still obey `runtime-shift-result/v2`: Input, Work Result, Output, Next, Metrics, Evidence and Artifacts. Runtime V5 accepts the legitimate flat bilingual and structured V5 result forms already present in the repository so historical valid results cannot break the scheduler control plane.

## Human-readable ledger as an inspection surface

Machine JSON is authoritative; same-day Markdown is mandatory. Projection must correctly handle structured narratives, legacy metric names, string evidence/artifacts and object evidence/artifacts. `[object Object]`, fake Evidence placeholders, machine/Markdown status divergence, or missing start/terminal/Commit Verify events are projection failures.

## 2026-08-09 Recovery Case

On Sunday 2026-08-09, seven tasks were due. Discovery and Queue completed, but Reading was not opened correctly. Analysis later opened while Reading was incomplete and correctly produced a Blocked result. Investigation found a long gap in scheduled heartbeats, an incompatibility between Runtime V5 validation and already-valid structured shift results, a permanent-terminal interpretation of dependency Blocked, and a Markdown projection defect that rendered structured Queue results as `[object Object]`.

The recovery introduced result-contract compatibility, reopened Reading, marked Analysis with `blockedBy: reading`, added dependency gates and dependency-ready Blocked retry, repaired Markdown projection, and removed one-time hotfix machinery after the permanent implementation was installed.

The V2.0 recovery principle is therefore: **restore facts first, restore the earliest dependency next, validate, then advance.**

## Runtime families

V2.0 retains Runtime Center V5's four-family boundary: Daily, Weekly, Academic and Research Program Runtime. Program work does not consume Daily stages or column slots. Academic remains independent on Wednesday 16:00 and Program on Monday 12:00.

## Authoritative files

```text
research/runtime/SCHEDULER.json
research/runtime/records/{family}/YYYY/MM/*.json
research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md
research/runtime/plans/YYYY/MM/YYYY-MM-DD-plan.json
scripts/runtime-v5.mjs
scripts/runtime-markdown.mjs
.github/workflows/research-runtime-scheduler.yml
```

## Download and validate

```bash
git clone https://github.com/joinwell52-AI/joinwell52.git
cd joinwell52
npm install
npm run runtime:validate
npm run docs:build
```

Operational truth should be read from Runtime Center and the day's Markdown ledger, not inferred solely from whether an Actions run is green.

## V1.3 and V2.0

V1.3 remains a historical capability release. V2.0 is the new Current Capability Release.

| Version | Runtime model |
|---|---|
| V1.3 | Research Intelligence + scheduled research production line |
| **V2.0** | **dependency-driven + overdue catch-up + Blocked recovery + self-validating Runtime** |

## Conclusion

Reliability is not the promise that an external timer will always fire on time. It is the ability to reconstruct from durable facts what has completed, what is missing, what may run next, and how recovery itself is verified.
