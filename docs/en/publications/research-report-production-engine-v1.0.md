---
title: Research Report Production Engine V1.0
description: A production-verified Digital Research Employee built on ChatGPT and operated through Research OS, Research Skills, Research Queue, and a GitHub-first publication workflow.
outline: deep
---

<ArticleCover
  image="/assets/covers/research-report-production-engine-v1.svg"
  kicker="Digital Employee Works · Capability Release"
  title="Research Report Production Engine V1.0"
  summary="A production-verified Digital Research Employee built on ChatGPT."
  version="V1.0"
  status="Released 2026-08-02 · Production Verified"
  languageHref="/zh/publications/research-report-production-engine-v1.0"
  languageLabel="简体中文"
/>

## Release statement

**Research Report Production Engine V1.0** is the first production-verified Digital Research Employee released by Digital Employee Works.

Its Chinese name is **研究报告生产机 V1.0**.

It is a ChatGPT application capability organized as a real position rather than a one-time prompt. It receives research work, applies governed Research Skills, maintains a Research Queue, produces bilingual Research Notes, publishes through GitHub, and preserves evidence of how the work moved from source discovery to release.

> The product is not “AI that writes articles.” It is a Digital Research Employee with a position, responsibilities, skills, workflow, standards, authority boundaries, and verifiable work products.

### Boundary of TMPA adoption

This product adopts the **single-writer lifecycle-governance subset of TMPA**. Each formal object has one writer; work passes through explicit lifecycle states and gates; sources, process records, failed-build corrections, Git commits, and publication records form a reconstructable evidence chain; and a Reader can recover the work state from durable records.

It is not a multi-agent collaboration case and does not exercise the multi-writer role separation required by TMPA DR4. Executor/reviewer separation is not a conformance condition for this single-writer scenario. The product can therefore serve as a reference instantiation of TMPA lifecycle governance, evidence retention, and reconstruction semantics, but **it is not evidence that every TMPA mechanism or multi-agent claim has been validated**.

The site now presents its high-frequency outputs as “Observation Notes.” The historical `Research Note` label remains in schemas and production records for compatibility; it does not assert that each Observation Note contributes new academic knowledge.

### Release metadata

| Field | Value |
|---|---|
| Product | Research Report Production Engine |
| Chinese name | 研究报告生产机 |
| Version | V1.0 |
| Product type | ChatGPT application · Digital Research Employee |
| Position | Research Analyst / Digital Research Employee |
| Operating model | Research Operating System V2 |
| Publication model | GitHub First |
| Release status | Production Verified |
| Release date | 2026-08-02 |
| Author and owner | Zhu Wei / 朱卫 · joinwell52-AI |

## From theory to practice

The release connects a complete path from research theory to a working Digital Employee.

```text
Research Operating System
  defines how research should run
        ↓
Research Skills
  define reusable research capabilities
        ↓
Research Queue
  governs intake, selection, priority and status
        ↓
Research OS Engine
  advances work through controlled lifecycle states
        ↓
Research Report Production Engine
  performs the Research Analyst position
        ↓
GitHub
  preserves the authoritative publication and evidence history
        ↓
Digital Employee Works website
  presents the published research from repository metadata
```

### 1. Research Operating System — the theory

Research OS begins with a simple rejection: research is not article generation.

A research result should pass through a governed process:

```text
Signal
→ Candidate
→ Research Queue
→ Selected
→ Reading
→ Analysis
→ Research Note
→ Knowledge
→ Architecture
→ Specification
→ Publication
→ Release
```

The process separates source facts from interpretation, preserves evidence, and prevents a newly discovered signal from becoming a publication without research.

### 2. Research Skills — the capability layer

V1.0 operates through eight formal skills:

1. Source Discovery;
2. Research Triage;
3. Deep Reading;
4. Research Analysis;
5. Research Writing;
6. Research Visualization;
7. Evidence & Citation;
8. Publication Editing.

These skills are the execution units. Article generation is only one downstream output of the skill pipeline.

### 3. Research Queue — the work layer

The Queue converts discovery into managed work.

```text
Source
→ Candidate
→ Score and priority
→ Selected / Deferred / Rejected
→ Research lifecycle
```

A candidate is evaluated for Digital Employee, TMPA, CodeFlowMu, Engineering, Innovation, Official Source, and overall Research Value. Discovery alone does not authorize publication.

### 4. Research OS Engine — the execution layer

The Engine reads lifecycle state, invokes the required skill, records blockers, and permits only governed transitions. Evidence failure returns an item to research rather than allowing a weak publication to pass.

### 5. Research Report Production Engine — the employee

The product packages the system into an understandable organizational role:

```text
Position: Research Analyst
Worker: Digital Research Employee
Platform: ChatGPT
Work system: Research OS
Skills: 8 Research Skills
Work queue: Research Queue
Output: Research Notes and formal publications
System of record: GitHub
```

## Position and responsibilities

### Position

**Research Analyst / Digital Research Employee**

### Primary responsibility

Continuously discover, study, analyze, write, verify, and publish research relevant to Digital Employee, Industry Architecture, Open-source Engineering, TMPA, and CodeFlowMu.

### Standard work

```text
Discover sources
→ register candidates
→ triage research value
→ read primary material
→ separate facts and claims
→ form research judgment
→ write bilingual Research Notes
→ create meaningful visual evidence
→ validate references and metadata
→ publish through GitHub
→ verify the commit and build gate
```

### Authority boundaries

The Digital Research Employee may, when authorized by the repository owner:

- discover and read public sources;
- maintain the Research Queue;
- create and edit Research Notes;
- create visual assets and metadata;
- create Git branches and pull requests;
- respond to CI defects;
- commit and merge validated publications;
- verify files from the authoritative branch.

It must not:

- invent sources, citations, measurements, or engineering evidence;
- convert vendor claims into independently verified facts;
- skip Research Queue, Evidence, or Publication Editing gates;
- bypass a failed repository build;
- claim that a website deployment completed without direct evidence;
- silently modify TMPA formal publications from an unrelated research workflow.

## Production architecture

```text
Scheduler / Human work request
            ↓
Research Queue
            ↓
Research OS Engine
            ↓
Research Skills 01–08
            ↓
Research Note Standard
            ↓
GitHub branch
            ↓
Pull Request and VitePress CI
            ↓
main branch
            ↓
GitHub Pages and Research Center
```

GitHub is not a backup destination. It is the authoritative work and publication layer. Markdown, metadata, commits, pull requests, CI results, and diffs form the durable operating record.

## Production Test V1

V1.0 is released after a real production test, not only a design review.

### Test package

The production test created:

- 3 Daily Research objects;
- 3 Academic Observation objects;
- 6 English Research Notes;
- 6 Simplified Chinese Research Notes;
- 6 dedicated SVG covers;
- 5 production governance records;
- 23 additive files;
- 3,105 added lines;
- 0 deletions.

The six research objects covered all three formal columns:

| Column | Daily Research | Academic Observation |
|---|---|---|
| Digital Employee | Computer-use action–state loop | OSWorld and execution verification |
| Industry Architecture | A2A and MCP interoperability boundaries | NIST AI RMF operating loop |
| Open-source Engineering | Manager orchestration and handoff ownership | SWE-bench Verified and benchmark quality |

### Real publication failure and recovery

The first pull-request build failed because an English YAML Frontmatter summary contained an unquoted colon. VitePress rejected the publication package.

The Engine did not bypass the gate. The metadata defect was corrected, a second CI run was triggered, and the VitePress build passed before merge.

This failure is part of the release evidence. It demonstrates that Publication Editing and repository CI operate as real controls rather than descriptive promises.

### Verified publication chain

```text
Production branch
→ Pull Request #8
→ CI failure detected
→ YAML defect corrected
→ second CI build passed
→ squash merge to main
→ release commit fetched
→ representative files re-read from main
```

Production Test release commit:

```text
22927bbb77f7bd4a47150a6bb8c5f00ccf0b1bf1
```

## What V1.0 proves

V1.0 proves that, in an active ChatGPT application execution:

1. Research Skills can operate as a coordinated production pipeline.
2. Daily Research and Academic Observation can be produced as distinct research workflows.
3. A Digital Research Employee can maintain bilingual publication quality.
4. GitHub branch, PR, CI, correction, merge, and commit verification can form one traceable release chain.
5. Invalid metadata can be blocked by a real build gate and corrected before release.
6. The output can be discovered by the Research Center directly from Markdown metadata.

## Current validation boundary

Two claims remain intentionally separate from the V1.0 production verdict:

### Scheduled unattended execution

Daily, Weekly, Academic, Queue, Knowledge, and Architecture automations are configured. V1.0 does not yet use an unattended scheduled run as its primary production evidence. A future acceptance record should show a scheduled task independently triggering, performing research, writing GitHub, and verifying the resulting commit without an active interactive execution session.

### External live-page observation

The repository contains a GitHub Pages workflow triggered by pushes to `main`. The production test directly verified publication to `main` and the pre-merge VitePress build. An external Pages refresh should continue to be recorded as its own deployment observation rather than inferred from the source commit.

These boundaries do not reduce the verified Research-to-GitHub capability. They prevent the release from claiming evidence that was not directly observed.

## Relationship to the wider system

### Research Operating System

Defines the research philosophy, lifecycle, skills, queue, workflows, evidence, automation, and publication rules.

### Research Report Production Engine

Turns Research OS into a working Digital Research Employee and a recognizable product.

### TMPA

Provides the broader governance research for persistent roles, authority, events, lifecycle, evidence, integrity, and deterministic reconstruction of AI work.

### CodeFlowMu

Is the developing Digital Employee engineering and work runtime. The Research Report Production Engine is currently a ChatGPT application case; its operating lessons can later inform a more general Digital Employee runtime.

## Official evidence

- [Production Test V1 Report](https://github.com/joinwell52-AI/joinwell52/blob/main/research/production-tests/production-test-v1/REPORT.md)
- [Runtime Record](https://github.com/joinwell52-AI/joinwell52/blob/main/research/production-tests/production-test-v1/RUNTIME-RECORD.md)
- [Release Checklist](https://github.com/joinwell52-AI/joinwell52/blob/main/research/production-tests/production-test-v1/RELEASE-CHECKLIST.md)
- [Frozen File Manifest](https://github.com/joinwell52-AI/joinwell52/blob/main/research/production-tests/production-test-v1/FILE-MANIFEST.md)
- [Production Pull Request #8](https://github.com/joinwell52-AI/joinwell52/pull/8)
- [Production release commit](https://github.com/joinwell52-AI/joinwell52/commit/22927bbb77f7bd4a47150a6bb8c5f00ccf0b1bf1)
- [Research Skills](https://github.com/joinwell52-AI/joinwell52/tree/main/research/skills)

## Formal positioning

> **Research Report Production Engine is a production-verified Digital Research Employee built on ChatGPT. It performs a defined Research Analyst position through Research OS, Research Skills, Research Queue, evidence governance, and a GitHub-first publication workflow.**

The corresponding Research Center principle is:

> **A Digital Employee is not a chatbot. It is a persistent worker with a position, responsibilities, skills, workflow, standards, authority boundaries, and verifiable work products.**
