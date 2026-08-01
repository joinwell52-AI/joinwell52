# joinwell52 Research Center

> **Independent Research on AI Work, Governance and Digital Employees**

**English** · [简体中文](./README.zh-CN.md)

[![Research Site](https://img.shields.io/badge/Research_Site-Research_OS-1f6feb?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/)
[![Status](https://img.shields.io/badge/Status-Active_Research-16a34a?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/en/research/)
[![中文](https://img.shields.io/badge/Language-简体中文-7c3aed?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/zh/)

## Single Source of Truth

This GitHub repository is the **only authoritative research database** of the joinwell52 Research Center. All papers, specifications, engineering reports, research notes, assets and website pages are maintained directly here. Git commits, diffs, tags, releases, issues and pull requests provide the authoritative history.

The former ChatGPT Library `/TMPA` folder is a deprecated read-only migration archive and must not receive new paper revisions.

- [Research governance](./RESEARCH-GOVERNANCE.md)
- [Single-source migration record](./MIGRATION-SINGLE-SOURCE.md)

## Current TMPA Publication Set

- [TMPA Architecture Paper — A0.4](./docs/en/publications/tmpa-architecture-paper-a0.4.md)
- [TMPA Core Specification — S0.3](./docs/en/publications/tmpa-core-specification-s0.3.md)
- [TMPA–FCoP–CodeFlowMu Implementation Case — I0.3](./docs/en/publications/implementation-case-i0.3.md)
- [Publication Center](https://joinwell52-ai.github.io/joinwell52/en/publications/)

## Positioning

joinwell52 Research Center is an independent, engineering-driven research portal focused on:

- AI work data and governance;
- formal multi-Agent coordination;
- Digital Employee architecture;
- AI software engineering and runtime systems;
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

**Research Notes is the only research entry point.** Every research article carries three required metadata fields:

```yaml
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
date: YYYY-MM-DD
```

The website reads this metadata directly from GitHub Markdown and automatically generates column counts, category counts, newest-first lists and calendar filtering. No second database or manually maintained article list is used.

### Three research columns

- [Digital Employee](https://joinwell52-ai.github.io/joinwell52/en/digital-employee/)
- [Industry Architecture](https://joinwell52-ai.github.io/joinwell52/en/industry/)
- [Open-source Engineering](https://joinwell52-ai.github.io/joinwell52/en/engineering/)

## Entry Points

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
├── .github/workflows/
├── RESEARCH-GOVERNANCE.md
├── MIGRATION-SINGLE-SOURCE.md
├── CITATION.cff
├── README.zh-CN.md
└── README.md
```

## Author

**Zhu Wei / 朱卫 · joinwell52-AI**  
Independent Researcher

Research Portal: https://joinwell52-ai.github.io/joinwell52/
