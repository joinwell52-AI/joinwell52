---
title: Research Report Production Engine V1.3 Quick Start
outline: deep
---

# Research Report Production Engine V1.3 Quick Start

## 1. Download

### Download ZIP

[Download the current source ZIP](https://github.com/joinwell52-AI/joinwell52/archive/refs/heads/main.zip)

Extract it and enter the `joinwell52` directory.

### Use Git

```bash
git clone https://github.com/joinwell52-AI/joinwell52.git
cd joinwell52
```

## 2. What the download contains

```text
research/skills/
  Research Skills V2.0 and the three intelligence profiles

research/intelligence/
  AI Platform, GitHub Engineering, and Published Research source registry

research/runtime/
  Scheduler, Worker Contract, Runtime Record, column-plan, and candidate specifications

scripts/
  Runtime, Research Intelligence, and website data validators

.github/workflows/
  GitHub scheduling, validation, and Pages deployment workflows

docs/
  Bilingual VitePress website
```

## 3. Prerequisites

The website and validators require:

- Git;
- Node.js 22;
- npm;
- a writable GitHub repository;
- a ChatGPT environment for the actual research work.

## 4. Install dependencies and validate

```bash
npm install
npm run intelligence:validate
npm run runtime:validate
npm run docs:build
```

When these commands pass, the source registry, Runtime records, three-column plan, Publication Candidate batch, and website satisfy the current repository contracts.

## 5. Preview the website locally

```bash
npm run docs:dev
```

Or:

```bash
npm run docs:build
npm run docs:preview
```

## 6. Configure your three research columns

The default definitions live in:

```text
research/runtime/SCHEDULER.json
research/intelligence/REGISTRY.json
```

The default columns are:

- Digital Employee;
- Industry Architecture;
- Open-source Engineering.

You may replace the labels, research questions, and sources, but preserve these rules:

- every selected object has exactly one primary column;
- every column receives `Selected` or `No Selection` each day;
- non-selection records coverage and a concrete reason.

## 7. Configure source intelligence

Edit:

```text
research/intelligence/REGISTRY.json
```

It contains:

- OpenAI, Claude, Gemini, Cursor, GitHub Copilot, and Microsoft Copilot Platform;
- controlled GitHub organizations, repositories, and query topics;
- arXiv, OpenReview, AI research labs, conferences, and publication sources;
- evidence levels, scan frequency, and cross-pipeline deduplication rules.

## 8. Create the workers in ChatGPT

The GitHub workflow opens execution slots; it does not independently complete research writing.

Use this file to create the corresponding ChatGPT workers:

```text
research/runtime/WORKER-PROMPTS-V2.md
```

Formal shifts:

```text
09:00 Engine
10:00 Queue + Research Intelligence
11:00 Knowledge
Monday 12:00 Architecture
15:00 Production
20:00 Publication
Sunday 20:30 Weekly
Wednesday 10:00 Academic
```

Every worker must:

1. read the authoritative upstream artifacts;
2. execute only its assigned responsibility;
3. write a structured work-outcome report;
4. update the Runtime Log;
5. commit durable outputs;
6. fetch the Git commit and verify the result.

## 9. Run 10:00 intelligence and three-column triage

The Queue worker executes:

```text
Skill 01-P AI Platform Change Intelligence
Skill 01-G GitHub Engineering Intelligence
Skill 01-R Published Research Intelligence
↓
Cross-source deduplication
↓
Skill 02 Three-Column Research Triage
```

Outputs:

```text
research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json
research/runtime/plans/YYYY/MM/YYYY-MM-DD-plan.json
```

## 10. Run 15:00 complete-report production

The Production worker reads eligible research objects and executes:

```text
Skill 05 Research Writing
→ Skill 06 Visualization
→ Skill 07 Evidence & Citation
→ Skill 08 Publication Editing
```

It creates complete bilingual Publication Candidates at:

```text
research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json
```

Production does not place the report in the public article directory.

## 11. Run the 20:00 release shift

The Publication worker consumes complete candidates only:

```text
Publication Candidate
→ public bilingual Markdown
→ metadata / indexes / website
→ GitHub Commit
→ Commit Verify
→ Release
```

It must not search for new sources, repeat analysis, or write an article from scratch at 20:00.

## 12. Inspect operations

Operations Center path:

```text
/en/runtime/
```

It reports:

- coverage of all three intelligence pipelines;
- topic decisions for all three research columns;
- actual work outcomes for every scheduled shift;
- 15:00 Publication Candidates;
- 20:00 release results;
- Runtime Records and GitHub verification.

## 13. Important boundaries

- ChatGPT performs the actual worker execution;
- a GitHub Actions trigger does not prove that work completed;
- Queue cannot formally complete without a complete intelligence run;
- Publication cannot release without a complete Publication Candidate;
- a result without a Runtime Record and Commit Verify is not an official output;
- the repository is publicly downloadable, while reproduction, adaptation, redistribution, and commercial use follow the current `LICENSE.md`.

## Return to the product page

[Research Report Production Engine V1.3](./research-report-production-engine-v1.3)
