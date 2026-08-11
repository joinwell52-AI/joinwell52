# Digital Employee Works

> **A governed, downloadable production line for verifiable Digital Employee work**

**English** · [简体中文](./README.zh-CN.md)

[![Digital Employee Works](https://img.shields.io/badge/Digital_Employee-Works-1f6feb?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/)
[![Runtime](https://img.shields.io/badge/Runtime_Center-V5.0-7c6cff?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/en/runtime/)
[![Scheduler](https://img.shields.io/badge/Runtime_Scheduler-V3.0-2563eb?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/en/runtime/v5)
[![Digital Researcher](https://img.shields.io/badge/Research_Report_Production_Engine-V1.3-6d5dfc?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/en/publications/research-report-production-engine-v1.3)
[![Intelligence](https://img.shields.io/badge/Research_Intelligence-V1.0-16a34a?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/en/runtime/research-intelligence)

## Download

- [Download the current source ZIP](https://github.com/joinwell52-AI/joinwell52/archive/refs/heads/main.zip)
- [Open the GitHub repository](https://github.com/joinwell52-AI/joinwell52)
- [Read the V5.0 Runtime Guide](./docs/en/runtime/v5.md)
- [Read the V1.3 Quick Start](./docs/en/publications/research-report-production-engine-v1.3-quickstart.md)

No APK, EXE, or conventional installer is required. The repository is the distribution: it contains the skills, source registry, Runtime contracts, scheduling configuration, validators, website source, and operating evidence. Actual research execution uses the operator’s own ChatGPT and GitHub environment.

## Current architecture

```text
Research Intelligence System V1.0
        ↓
Research Runtime Center V5.0
        ↓
Daily / Weekly / Academic / Research Program Runtime
        ↓
Research Report Production Engine V1.3
        ↓
GitHub + Website + Commit Verify
```

Research Runtime Center V5.0 is the frozen architecture baseline. Scheduler V3.0 defines four independent Runtime systems and nine formal tasks. Long-term Program work no longer enters Daily Runtime.

## Four independent Runtime systems

### Daily Runtime

```text
09:00 Discovery → Signal Pool
10:00 Queue → Today's Research Plan
11:00 Reading → Reading Result
13:00 Analysis → Research Object
15:00 Production → Publication Candidate
20:00 Publication → GitHub + Website + Commit Verify + Release
```

Daily makes an explicit `Selected` or `No Selection` decision for each column:

- **Digital Employee**;
- **Industry Architecture**;
- **Open-source Engineering**.

### Weekly Runtime

Runs Sunday at 20:30. It synthesizes the previous seven days of evidence-validated Daily Research into new Trend, Architecture, Engineering and Prediction judgments. It must not copy or concatenate Daily articles.

### Academic Runtime

Runs Wednesday at 16:00. It accepts only Paper, Benchmark, Specification and Institution objects. Ordinary news is excluded.

### Research Program Runtime

Runs Monday at 12:00. It advances the independent queues, lifecycles, reviews and publications of:

- TMPA;
- FCoP;
- CodeFlowMu;
- Digital Employee;
- Research Operating System.

Program work never consumes a Daily stage or Daily column slot.

## Research Skills V2.0

```text
01 Research Intelligence Discovery
02 Three-Column Research Triage
03 Deep Reading
04 Research Analysis
05 Research Writing
06 Research Visualization
07 Evidence & Citation
08 Publication Editing
```

The article is not the execution unit. The Skill is the execution unit. V5 binds Skills to explicit stage inputs and outputs: Reading consumes selected objects, Analysis consumes Reading Results, Production consumes Research Objects, and Publication consumes complete Publication Candidates only.

## Research Intelligence System V1.0

Skill 01 dispatches three intelligence pipelines:

1. **AI Platform Change Intelligence**;
2. **GitHub Engineering Intelligence**;
3. **Published Research Intelligence**.

All three pipelines serve all three Daily columns. Discovery produces the same-day Signal Pool; Queue performs the column decisions.

## Work outcomes, not status slogans

Every terminal shift reports:

```text
Input
Work Result
Output
Next
Metrics
Evidence
Artifacts
```

A trigger is not completion evidence. Without actual ChatGPT worker execution, the task remains `Waiting`, `Blocked`, or `Failed`.

## Authoritative Runtime artifacts

```text
research/runtime/SCHEDULER.json
research/runtime/records/daily/YYYY/MM/YYYY-MM-DD-daily-runtime.json
research/runtime/records/weekly/YYYY/MM/YYYY-MM-DD-weekly-runtime.json
research/runtime/records/academic/YYYY/MM/YYYY-MM-DD-academic-runtime.json
research/runtime/records/program/YYYY/MM/YYYY-MM-DD-program-runtime.json
research/intelligence/REGISTRY.json
research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json
```

V4 Markdown records remain frozen historical evidence. V5 does not rewrite them.

## Product and engineering hierarchy

```text
TMPA + FCoP
      ↓
CodeFlowMu + Digital Employee
```

- **TMPA:** independent theory and specification layer;
- **FCoP:** file-based coordination protocol;
- **CodeFlowMu:** Digital Employee development and work Runtime;
- **Digital Employee:** the product and delivery layer.

## Current formal releases

### Digital Researcher and Runtime

- [Research Runtime Center V5.0](./docs/en/runtime/v5.md)
- [Daily Runtime](./docs/en/runtime/daily.md)
- [Weekly Runtime](./docs/en/runtime/weekly.md)
- [Academic Runtime](./docs/en/runtime/academic.md)
- [Research Program Runtime](./docs/en/runtime/program.md)
- [Research Report Production Engine V1.3](./docs/en/publications/research-report-production-engine-v1.3.md)
- [Research Intelligence System V1.0](./docs/en/runtime/research-intelligence.md)

### TMPA

- [TMPA Architecture Paper A1.0](./docs/en/publications/tmpa-architecture-paper-a1.0.md)
- [TMPA Core Specification S1.0](./docs/en/publications/tmpa-core-specification-s1.0.md)
- [TMPA–FCoP–CodeFlowMu Implementation Case I1.0](./docs/en/publications/implementation-case-i1.0.md)

## Repository structure

```text
.
├── docs/                         # bilingual VitePress site
├── research/
│   ├── intelligence/             # source registry and daily signal records
│   ├── runtime/                  # Scheduler V3, four record families and worker contracts
│   ├── skills/                   # Research Skills V2.0 and intelligence profiles
│   ├── production-tests/         # production evidence
│   └── releases/                 # formal release records
├── scripts/                      # validators and website-data generators
├── .github/workflows/            # Scheduler V3, validation and Pages deployment
├── LICENSE.md
├── CITATION.cff
├── README.zh-CN.md
└── README.md
```

## Freeze rule

After V5.0, the four-system separation, Daily six-stage sequence and Scheduler V3 task identities are frozen. Future work focuses on source quality, worker effectiveness, metrics, UX, evidence quality and publication quality.

## Core principles

> **A Digital Employee is not a chatbot. It is a persistent worker with a position, responsibilities, skills, workflow, standards, authority boundaries, and verifiable work products.**

> **Research Runtime—not an individual automation task—is the operational control plane.**

> **Production creates complete reports; Publication releases them.**

## Author

**Zhu Wei / 朱卫 · joinwell52-AI**  
Independent Researcher

Digital Employee Works: https://joinwell52-ai.github.io/joinwell52/
