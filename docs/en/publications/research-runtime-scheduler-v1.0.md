---
title: Research Runtime Scheduler V1.0
description: The formal execution scheduler and operational control plane of Research Center 3.0.
outline: deep
---

<ArticleCover
  image="/assets/covers/research-runtime-scheduler-v1.svg"
  kicker="Research Center 3.0 · Runtime Release"
  title="Research Runtime Scheduler V1.0"
  summary="The only formal scheduler, observability layer and publication gate of the Research Operating System."
  version="V1.0"
  status="Released 2026-08-02 · Runtime Control Plane"
  languageHref="/zh/publications/research-runtime-scheduler-v1.0"
  languageLabel="简体中文"
/>

## Release statement

**Research Runtime Scheduler V1.0** establishes **Research Runtime Center** as the operational control plane of Research Center 3.0.

Research OS still defines how research work should move. The Runtime Scheduler decides when formal work is opened, records what actually happened, exposes the state through a generated dashboard, and requires GitHub commit verification before a publication can be considered an official runtime output.

> Research Runtime—not individual automation tasks—is the operational control plane of the Digital Research Employee.

## Release metadata

| Field | Value |
|---|---|
| Capability | Research Runtime Scheduler |
| Version | V1.0 |
| Research Center | 3.0 |
| Runtime timezone | `Asia/Shanghai` |
| Digital Research Employee | Research Report Production Engine V1.0 on ChatGPT |
| System of record | GitHub repository `joinwell52-AI/joinwell52` |
| Runtime record | `research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md` |
| Release date | 2026-08-02 |

## Runtime architecture

```text
Research Runtime Center
        ↓
Research Runtime Scheduler
        ↓
Runtime Engine
        ↓
Runtime Queue
        ↓
Runtime Knowledge
        ↓
Runtime Architecture
        ↓
Runtime Publication / Weekly / Academic
        ↓
Runtime Record
        ↓
GitHub Commit + Commit Verify
        ↓
Research Center
```

The scheduler opens governed execution slots. The corresponding ChatGPT Runtime worker performs the research. A trigger does not count as completion: without output and verification, the Runtime remains Waiting, Blocked or Failed.

## Seven formal tasks

The task proposal contained a numerical inconsistency: it said “six” but explicitly defined seven responsibilities. V1.0 adopts all seven.

| Runtime | Schedule (`Asia/Shanghai`) | Formal responsibility |
|---|---|---|
| Research Runtime Engine | Daily 09:00 | Advance the Research OS state machine. |
| Research Runtime Queue | Daily 10:00 | Maintain source discovery, candidates, priority and queue lifecycle; no direct publication. |
| Research Runtime Knowledge | Daily 11:00 | Maintain knowledge, related notes, observations and architecture candidates; no direct publication. |
| Research Runtime Architecture | Monday 12:00 | Make architecture, specification, publication-candidate and lifecycle decisions. |
| Research Runtime Publication | Daily 20:00 | Publish Daily Research from completed inputs and Research Skills; perform commit verification. |
| Research Runtime Weekly | Sunday 20:30 | Produce a new synthesis and engineering judgment; never copy Daily Research. |
| Research Runtime Academic | Wednesday 10:00 | Publish research about papers, benchmarks, specifications, conferences and institutions; exclude ordinary news. |

Runtime Queue and Runtime Academic intentionally share Wednesday 10:00. One scheduler trigger opens both slots, while each task preserves an independent status and output boundary.

## Runtime Record

Runtime Record is the single source of truth for every scheduled execution.

It contains start and end time, duration, task, GitHub repository, commit, status, output, lifecycle, queue state, publication state, commit verification and append-only log events. Exactly six statuses are allowed:

```text
Running · Completed · Blocked · Failed · Skipped · Waiting
```

The website does not maintain a second dashboard database. At build time, the Runtime engine validates the Markdown records and generates the dashboard projection.

## Runtime Center website

Research Center 3.0 adds a generated Runtime Center with:

- Runtime Status;
- Today’s Tasks;
- Runtime Timeline;
- Runtime History;
- Latest Runtime;
- Runtime Log;
- GitHub Status;
- Publication Status;
- Queue Status;
- Engine Status.

[Open Research Runtime Center →](/en/runtime/)

## Runtime Gate

```text
Research Runtime
→ Publication Candidate
→ Runtime Record
→ GitHub Commit
→ Commit Verify
→ Official Publication
```

The pull-request validation workflow rejects formal publication changes that do not include a Runtime Record.

## Highest engineering constraint

> Every official Publication shall be executed by Research Runtime and produce a Runtime Record. Any publication without a Runtime Record is not considered an official runtime output.

## Authoritative implementation

- [Runtime Charter](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/README.md)
- [Scheduler manifest](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/SCHEDULER.json)
- [Runtime Record schema](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/RUNTIME-RECORD-SCHEMA.md)
- [Release record](https://github.com/joinwell52-AI/joinwell52/blob/main/research/releases/research-runtime-scheduler-v1.0/RELEASE.md)
