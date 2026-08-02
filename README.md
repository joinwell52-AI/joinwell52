# joinwell52 Research Center 2.0

> **A continuously operating AI Research Center powered by a Digital Research Employee**

**English** · [简体中文](./README.zh-CN.md)

[![Research Site](https://img.shields.io/badge/Research_Center-2.0-1f6feb?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/)
[![Engine](https://img.shields.io/badge/Research_Report_Production_Engine-V1.0-6d5dfc?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/en/publications/research-report-production-engine-v1.0)
[![Status](https://img.shields.io/badge/Status-Production_Verified-16a34a?style=for-the-badge)](https://github.com/joinwell52-AI/joinwell52/blob/main/research/production-tests/production-test-v1/REPORT.md)
[![中文](https://img.shields.io/badge/Language-简体中文-7c3aed?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/)

## Research Center 2.0

joinwell52 Research Center is no longer positioned as a research website alone. It is a continuously operating research system.

```text
Research Operating System
        ↓
Research Report Production Engine
        ↓
Digital Research Employee on ChatGPT
        ↓
Research Queue + Research Skills
        ↓
GitHub-first publication
        ↓
Research Notes, architecture and formal releases
```

The core execution capability is **Research Report Production Engine V1.0（研究报告生产机 V1.0）**: a production-verified Digital Research Employee built on ChatGPT and organized around a real Research Analyst position.

- [Formal V1.0 release](./docs/en/publications/research-report-production-engine-v1.0.md)
- [简体中文正式发布](./docs/zh/publications/research-report-production-engine-v1.0.md)
- [Production Test V1](./research/production-tests/production-test-v1/REPORT.md)
- [Runtime Record](./research/production-tests/production-test-v1/RUNTIME-RECORD.md)
- [Release record](./research/releases/research-report-production-engine-v1.0/RELEASE.md)

## Single Source of Truth

This GitHub repository is the **only authoritative research database and publication history** of the joinwell52 Research Center. Papers, specifications, capability releases, engineering reports, research notes, operating records, assets and website pages are maintained directly here.

Git commits, diffs, pull requests, CI results, tags and releases provide the authoritative history. A research product is not official merely because text was generated; it becomes official after the required publication gates and Git commit.

The former ChatGPT Library `/TMPA` folder is a deprecated read-only migration archive and must not receive new revisions.

- [Research governance](./RESEARCH-GOVERNANCE.md)
- [Single-source migration record](./MIGRATION-SINGLE-SOURCE.md)

## Current Publication Set

### Digital Employee capability

- [Research Report Production Engine — V1.0](./docs/en/publications/research-report-production-engine-v1.0.md) — Production Verified

### TMPA

- [TMPA Architecture Paper — A0.4](./docs/en/publications/tmpa-architecture-paper-a0.4.md)
- [TMPA Core Specification — S0.3](./docs/en/publications/tmpa-core-specification-s0.3.md)
- [TMPA–FCoP–CodeFlowMu Implementation Case — I0.3](./docs/en/publications/implementation-case-i0.3.md)
- [Publication Center](https://joinwell52-ai.github.io/joinwell52/en/publications/)

## Digital Research Employee

The Research Report Production Engine is defined as a position-based worker:

```yaml
position: Research Analyst
worker: Digital Research Employee
platform: ChatGPT
work_system: Research Operating System
skills: 8 Research Skills
queue: Research Queue
output: Research Notes and formal publications
system_of_record: GitHub
```

Its standard work is:

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
```

Production Test V1 produced three Daily Research objects and three Academic Observations, twelve bilingual Markdown publications, six dedicated covers and a complete GitHub publication record. The first CI build detected a real YAML defect; the defect was corrected and the second build passed before merge.

## Positioning

Research Center is not a news site, a blog or a passive paper archive. It is a process-driven AI research operation focused on:

- Digital Employee positions, workflows, runtime, governance and evaluation;
- enterprise and industry architecture for AI work;
- open-source Agent engineering and runtime systems;
- TMPA work data and governance architecture;
- FCoP formal coordination;
- CodeFlowMu Digital Employee engineering;
- deployable AI work systems for SMEs.

## Core Research Programs

### TMPA
**AI work data and governance architecture**  
[Research and publications →](https://joinwell52-ai.github.io/joinwell52/en/publications/)

### FCoP
**Formal coordination and responsibility protocol**  
[FCoP official site →](https://joinwell52-ai.github.io/FCoP/)

### CodeFlowMu
**Digital Employee development and work runtime**  
[GitHub repository →](https://github.com/joinwell52-AI/CodeFlowMu-open)

### Digital Employee
**Governed, position-oriented digital workforce**  
[Governing architecture →](https://joinwell52-ai.github.io/joinwell52/en/digital-employee/architecture)

## Research Notes Model

Research Notes are the continuously growing research outputs. Every research article carries required metadata:

```yaml
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
date: YYYY-MM-DD
```

The website reads metadata directly from GitHub Markdown and generates column counts, category counts, newest-first lists and calendar filtering. No second research database or manually maintained article list is used.

### Three research columns

- [Digital Employee](https://joinwell52-ai.github.io/joinwell52/en/digital-employee/)
- [Industry Architecture](https://joinwell52-ai.github.io/joinwell52/en/industry/)
- [Open-source Engineering](https://joinwell52-ai.github.io/joinwell52/en/engineering/)

## Entry Points

- [Research Center 2.0](https://joinwell52-ai.github.io/joinwell52/)
- [Research Report Production Engine V1.0](https://joinwell52-ai.github.io/joinwell52/en/publications/research-report-production-engine-v1.0)
- [Research Notes](https://joinwell52-ai.github.io/joinwell52/en/research/)
- [Publication Center](https://joinwell52-ai.github.io/joinwell52/en/publications/)

## Language Policy

- English is the default language of the Portal and repository README;
- Chinese Portal: `/zh/`;
- English and Chinese publications are maintained as separate documents;
- paired publications preserve topic, version, status, publication date and language-switch links;
- no official revision is delivered without a Git commit.

## Repository Structure

```text
.
├── docs/
│   ├── index.md
│   ├── en/
│   ├── zh/
│   ├── .vitepress/theme/
│   └── public/assets/covers/
├── research/
│   ├── skills/
│   ├── production-tests/
│   └── releases/
├── .github/workflows/
├── RESEARCH-GOVERNANCE.md
├── MIGRATION-SINGLE-SOURCE.md
├── CITATION.cff
├── README.zh-CN.md
└── README.md
```

## Core principle

> **A Digital Employee is not a chatbot. It is a persistent worker with a position, responsibilities, skills, workflow, standards, authority boundaries and verifiable work products.**

## Author

**Zhu Wei / 朱卫 · joinwell52-AI**  
Independent Researcher

Research Center: https://joinwell52-ai.github.io/joinwell52/
