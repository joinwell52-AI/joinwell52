---
title: Research Runtime Scheduler V1.0
description: The first formal release record of Research Runtime Scheduler; the current operating baseline is Scheduler V2.0 and Runtime Center V4.
outline: deep
---

<ArticleCover
  image="/assets/covers/research-runtime-scheduler-v1.svg"
  kicker="Digital Employee Works · Historical Runtime Release"
  title="Research Runtime Scheduler V1.0"
  summary="The first formal scheduler and operational control-plane release of the Research Operating System."
  version="V1.0"
  status="Released 2026-08-02 · Historical Release"
  languageHref="/zh/publications/research-runtime-scheduler-v1.0"
  languageLabel="简体中文"
/>

::: info Current operating baseline
The current formal operating system has advanced to:

- **Research Runtime Center V4**;
- **Research Runtime Scheduler V2.0**;
- **Research Report Production Engine V1.3**;
- **Research Intelligence System V1.0**;
- eight formal Runtime tasks, including daily Production at 15:00;
- release-only Publication at 20:00 for complete candidates.

[Read the current V4 Runtime specification →](/en/runtime/v4)  
[Read Research Report Production Engine V1.3 →](./research-report-production-engine-v1.3)
:::

## Historical significance of V1.0

Research Runtime Scheduler V1.0 first established Research Runtime Center as the formal operational control plane of the Research Operating System.

It established these principles:

- Research Runtime—not an individual automation task—is the Digital Researcher’s operational control plane;
- the GitHub scheduler opens execution slots and must not manufacture completion facts;
- every formal execution writes a Runtime Record;
- exactly six statuses are allowed: `Running`, `Completed`, `Blocked`, `Failed`, `Skipped`, and `Waiting`;
- formal publication requires a GitHub commit and Commit Verify;
- a publication without a Runtime Record is not an official runtime output.

## V1.0 release metadata

| Field | Value |
|---|---|
| Capability | Research Runtime Scheduler |
| Historical version | V1.0 |
| Release date | 2026-08-02 |
| Timezone | `Asia/Shanghai` |
| Digital Researcher at release | Research Report Production Engine V1.0 |
| Current Digital Researcher | [Research Report Production Engine V1.3](./research-report-production-engine-v1.3) |
| System of record | GitHub repository `joinwell52-AI/joinwell52` |
| Runtime Record | `research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md` |

## The seven V1.0 tasks

V1.0 used seven formal tasks: Engine, Queue, Knowledge, Architecture, Publication, Weekly, and Academic.

It did not yet contain a separate 15:00 Production shift. Writing, visualization, evidence work, and publication editing therefore had not been organized as an independent afternoon production stage.

## From V1.0 to V2.0

Scheduler V2.0 adds and clarifies:

```text
09:00 Engine
10:00 Queue + Research Intelligence + three-column decisions
11:00 Knowledge
Monday 12:00 Architecture
15:00 Production → complete Publication Candidate
20:00 Publication → GitHub + website + Commit Verify
Sunday 20:30 Weekly
Wednesday 10:00 Academic
```

It also introduces:

- three source-intelligence pipelines;
- separate decisions for three research columns;
- structured work outcomes for every scheduled task;
- the three-column Daily Research Plan;
- Publication Candidate batches;
- an automatically generated Operations Center.

## V1.0 Runtime Gate

```text
Research Runtime
→ Runtime Record
→ GitHub Commit
→ Commit Verify
→ Official Publication
```

V2.0 extends this gate by making the Production Candidate the formal handoff object between 15:00 and 20:00.

## Current authoritative implementation

- [Research Runtime Center V4](../runtime/v4)
- [Research Intelligence System V1.0](../runtime/research-intelligence)
- [Runtime Charter](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/README.md)
- [Scheduler V2.0 Manifest](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/SCHEDULER.json)
- [Worker Contracts V2](https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/WORKER-PROMPTS-V2.md)
- [V1.0 Historical Release Record](https://github.com/joinwell52-AI/joinwell52/blob/main/research/releases/research-runtime-scheduler-v1.0/RELEASE.md)
