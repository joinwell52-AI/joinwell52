# Digital Employee Works

> **A governed production line for verifiable Digital Employee work**

**English** · [简体中文](./README.zh-CN.md)

[![Digital Employee Works](https://img.shields.io/badge/Digital_Employee-Works-1f6feb?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/)
[![Runtime](https://img.shields.io/badge/Research_Runtime_Scheduler-V1.0-7c6cff?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/en/publications/research-runtime-scheduler-v1.0)
[![Digital Research Employee](https://img.shields.io/badge/Research_Report_Production_Engine-V1.0-6d5dfc?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/en/publications/research-report-production-engine-v1.0)
[![Status](https://img.shields.io/badge/Runtime_Record-Required-16a34a?style=for-the-badge)](./research/runtime/README.md)

## Digital Employee Works

Digital Employee Works continuously produces verifiable Digital Employee work through one formal execution control plane. CodeFlowMu and FCoP provide the engineering foundation; TMPA remains an independently evidenced theory and specification layer.

```text
Research Operating System
  defines the work lifecycle
        ↓
Research Runtime Center
  schedules, observes, records and verifies execution
        ↓
Research Report Production Engine V1.0
  performs the Digital Research Employee / Research Analyst position
        ↓
Research Skills + Research Queue + Runtime Knowledge
        ↓
GitHub Commit + Commit Verify
        ↓
Observation Notes, runtime evidence, specifications and formal releases
```

Research Runtime Scheduler V1.0 is the only formal scheduler of the Research Operating System. Individual automations are Runtime workers; they are not independent control planes.

- [Research Runtime Center](https://joinwell52-ai.github.io/joinwell52/en/runtime/)
- [Research Runtime Scheduler V1.0 release](./docs/en/publications/research-runtime-scheduler-v1.0.md)
- [Runtime Charter](./research/runtime/README.md)
- [Runtime Record schema](./research/runtime/RUNTIME-RECORD-SCHEMA.md)
- [Research Report Production Engine V1.0](./docs/en/publications/research-report-production-engine-v1.0.md)
- [Production Test V1](./research/production-tests/production-test-v1/REPORT.md)

## Runtime architecture

```text
Research Runtime Center
        ↓
Runtime Scheduler V1.0
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
GitHub
        ↓
Digital Employee Works Website
```

Seven formal Runtime tasks are defined in [`research/runtime/SCHEDULER.json`](./research/runtime/SCHEDULER.json):

| Runtime | Schedule (`Asia/Shanghai`) | Responsibility |
|---|---|---|
| Research Runtime Engine | Daily 09:00 | Advance the Research OS state machine. |
| Research Runtime Queue | Daily 10:00 | Maintain discovery, candidates, priority and queue lifecycle. |
| Research Runtime Knowledge | Daily 11:00 | Maintain knowledge, related notes and architecture candidates. |
| Research Runtime Architecture | Monday 12:00 | Perform architecture and lifecycle review. |
| Research Runtime Publication | Daily 20:00 | Publish Daily Research and verify the GitHub commit. |
| Research Runtime Weekly | Sunday 20:30 | Create new synthesis and engineering judgment. |
| Research Runtime Academic | Wednesday 10:00 | Publish research on papers, benchmarks, specifications and institutions. |

The task draft used the phrase “six tasks” but explicitly defined seven. Digital Employee Works adopts all seven production responsibilities.

## Runtime Record — execution truth

Every formal execution writes one daily record:

```text
research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md
```

The record contains start and end time, duration, task status, output, lifecycle, Queue and Engine state, publication state, GitHub commit, Commit Verify and an append-only Runtime Log.

Exactly six Runtime statuses are allowed:

```text
Running · Completed · Blocked · Failed · Skipped · Waiting
```

The website Runtime Dashboard, Today’s Tasks, Timeline, History and status panels are generated from Runtime Records. They are not manually maintained.

## Runtime publication gate

```text
Research Runtime
→ Publication Candidate
→ Runtime Record
→ GitHub Commit
→ Commit Verify
→ Official Publication
```

A formal publication pull request without a Runtime Record fails the Runtime Gate.

> **Every official Publication must be executed by Research Runtime and produce a Runtime Record. A publication without a Runtime Record is not an official runtime output.**

## Digital Research Employee

Research Report Production Engine V1.0 is the Digital Research Employee execution capability:

```yaml
position: Research Analyst
worker: Digital Research Employee
platform: ChatGPT
work_system: Research Operating System
control_plane: Research Runtime Center
scheduler: Research Runtime Scheduler V1.0
skills: 8 Research Skills
queue: Research Queue
output: Research Notes and formal publications
system_of_record: GitHub
```

Its governed work path is:

```text
Source Discovery
→ Research Triage
→ Deep Reading
→ Research Analysis
→ Research Writing
→ Research Visualization
→ Evidence & Citation
→ Publication Editing
→ GitHub PR / CI / main verification
→ Runtime Record closure
```

Production Test V1 produced three Daily Research objects, three Academic Observations, twelve bilingual Markdown publications, six dedicated covers and a complete GitHub publication record. The first CI build detected a real YAML defect; the defect was corrected and the second build passed before merge.

## Single source of truth

This repository is the authoritative production database, runtime record, observation archive, and publication history of Digital Employee Works.

Git commits, diffs, pull requests, CI results, tags and releases provide the authoritative history. Generated text is not a formal result until it passes the applicable Runtime and publication gates.

The former ChatGPT Library `/TMPA` folder is a deprecated read-only migration archive and must not receive new revisions.

- [Research governance](./RESEARCH-GOVERNANCE.md)
- [Single-source migration record](./MIGRATION-SINGLE-SOURCE.md)

## Current publication set

### Runtime and Digital Employee capabilities

- [Research Runtime Scheduler — V1.0](./docs/en/publications/research-runtime-scheduler-v1.0.md) — Runtime Control Plane
- [Research Report Production Engine — V1.0](./docs/en/publications/research-report-production-engine-v1.0.md) — Production Verified

### TMPA

- [TMPA Architecture Paper — A0.5](./docs/en/publications/tmpa-architecture-paper-a0.5.md)
- [TMPA Core Specification — S0.4](./docs/en/publications/tmpa-core-specification-s0.4.md)
- [TMPA–FCoP–CodeFlowMu Implementation Case — I0.4](./docs/en/publications/implementation-case-i0.4.md)
- [Publication Center](https://joinwell52-ai.github.io/joinwell52/en/publications/)

## Observation Notes model

Observation Notes retain the historical `Research Note` schema name for compatibility and are organized by two independent metadata dimensions:

```yaml
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
date: YYYY-MM-DD
```

The website reads metadata directly from GitHub Markdown and generates column counts, category counts, newest-first lists and calendar filtering. No second research database or manually maintained article list is used.

- [Digital Employee](https://joinwell52-ai.github.io/joinwell52/en/digital-employee/)
- [Industry Architecture](https://joinwell52-ai.github.io/joinwell52/en/industry/)
- [Open-source Engineering](https://joinwell52-ai.github.io/joinwell52/en/engineering/)

## Product, engineering and theory layers

- **Digital Employee:** the product and delivery layer.
- **CodeFlowMu / FCoP:** the runtime and protocol engineering layer.
- **TMPA:** the independent governance theory and specification layer.
- **Digital Employee:** governed, position-oriented digital workforce.

## Repository structure

```text
.
├── docs/
│   ├── index.md
│   ├── en/
│   ├── zh/
│   ├── .vitepress/theme/
│   └── public/assets/covers/
├── research/
│   ├── runtime/
│   ├── skills/
│   ├── production-tests/
│   └── releases/
├── scripts/runtime-center.mjs
├── .github/workflows/
├── RESEARCH-GOVERNANCE.md
├── MIGRATION-SINGLE-SOURCE.md
├── CITATION.cff
├── README.zh-CN.md
└── README.md
```

## Core principles

> **A Digital Employee is not a chatbot. It is a persistent worker with a position, responsibilities, skills, workflow, standards, authority boundaries and verifiable work products.**

> **Research Runtime—not individual automation tasks—is the operational control plane of the Digital Research Employee.**

## Author

**Zhu Wei / 朱卫 · joinwell52-AI**  
Independent Researcher

Digital Employee Works: https://joinwell52-ai.github.io/joinwell52/
