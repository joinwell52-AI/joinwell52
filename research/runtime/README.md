# Research Runtime Center V4 — Runtime Charter

**Project:** joinwell52 Research Center  
**Center version:** Research Center 3.0  
**Scheduler:** Research Runtime Scheduler V2.0  
**Operations Center:** V4.0  
**Research Intelligence Registry:** `research-intelligence-registry/v1`  
**Research Intelligence Run:** `research-intelligence-run/v1`  
**Task result contract:** `runtime-task-result/v1`  
**Column plan contract:** `runtime-column-plan/v1`  
**Publication Candidate contract:** `runtime-publication-candidate/v1`  
**Timezone:** `Asia/Shanghai`  
**System of record:** `joinwell52-AI/joinwell52`

## Charter

Research Runtime Center is the operational control plane of the Digital Research Employee.

V4 answers five operational questions:

1. **Which authoritative sources were scanned today?**
2. **What is each research column studying today?**
3. **What did every scheduled shift actually accomplish?**
4. **Which complete reports did the 15:00 Production shift create?**
5. **Which Publication Candidates were released and verified at 20:00?**

```text
Research Runtime Scheduler V2.0
        ↓
09:00 Engine
10:00 Research Intelligence + Queue + Three-Column Plan
11:00 Knowledge
12:00 Architecture (Monday)
15:00 Production
20:00 Publication
20:30 Weekly (Sunday)
10:00 Academic (Wednesday)
        ↓
Runtime Record + Intelligence Run + Task Work Results
        ↓
Publication Candidate
        ↓
GitHub Commit + Website + Commit Verify
        ↓
Digital Researcher Operations Center V4
```

## Three formal research columns

Every selected Queue object has exactly one primary column:

| Column | Scope |
|---|---|
| Digital Employee | Position, responsibility, workflow, runtime, governance, recovery, delivery and evaluation. |
| Industry Architecture | Major AI platform products, workspaces, agent operating models, control planes, permissions, connectors, enterprise controls and product boundaries. |
| Open-source Engineering | Runtimes, protocols, SDKs, tools, benchmarks, recovery, testing and observability engineering. |

The 10:00 Queue shift writes one explicit decision per column. A column is either:

- `Selected` with object, title, source, priority, lifecycle, reason and next action; or
- `No Selection` with the exact threshold, blocker or evidence gap.

The canonical contract is [`COLUMN-PLAN-SCHEMA.md`](./COLUMN-PLAN-SCHEMA.md).

## Research Intelligence System

Source channels and research columns are different dimensions.

Three intelligence pipelines all serve all three columns:

```text
Skill 01-P — AI Platform Change Intelligence
Skill 01-G — GitHub Engineering Intelligence
Skill 01-R — Published Research Intelligence
        ↓
Unified and deduplicated signal pool
        ↓
Skill 02 — Three-Column Research Triage
        ↓
Digital Employee / Industry Architecture / Open-source Engineering
```

### AI Platform Change Intelligence

The P0 daily platform set is fixed:

- OpenAI / ChatGPT / Codex;
- Anthropic / Claude / Claude Code;
- Google / Gemini;
- Cursor;
- GitHub Copilot;
- Microsoft Copilot Platform.

The worker checks official release notes, documentation, forums or communities, official repositories, status, enterprise-control and policy channels. An authentication-required community must be recorded as inaccessible rather than falsely reported as checked.

### GitHub Engineering Intelligence

GitHub is scanned through a controlled engineering radar rather than an impossible platform-wide crawl:

```text
70% fixed organization and repository watchlist
20% versioned topic × change-type queries
10% bounded new-project exploration
```

The worker scans incremental Releases, Tags, merged PRs, high-value Issues, Discussions, Security Advisories and architecture or benchmark files after the previous checkpoint.

### Published Research Intelligence

The worker scans papers, preprints, technical reports, benchmarks, datasets, system or model cards, standards and their associated code or evaluation artifacts. An abstract or vendor summary alone does not establish an engineering conclusion.

The authoritative source list is:

```text
research/intelligence/REGISTRY.json
```

The daily coverage and signal record is:

```text
research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json
```

A Queue task cannot be `Completed` after the Registry effective date without a completed Intelligence run and matching three-column decisions.

## Eight formal Runtime tasks

| Formal name | Schedule (`Asia/Shanghai`) | Work outcome | Boundary |
|---|---:|---|---|
| Research Runtime Engine | Daily 09:00 | One governed lifecycle transition and durable research artifact. | No stage skipping or direct publication. |
| Research Runtime Queue | Daily 10:00 | Three intelligence scans, unified signal pool, Queue decision and three-column Daily Research Plan. | No incomplete source coverage, direct publication or unassigned selected object. |
| Research Runtime Knowledge | Daily 11:00 | Knowledge admission, links and architecture candidates. | Only completed evidence-validated Research Notes may enter Knowledge. |
| Research Runtime Architecture | Monday 12:00 | Architecture disposition and lifecycle decision. | No decision from a single unsupported observation. |
| **Research Runtime Production** | **Daily 15:00** | **Complete bilingual Publication Candidates.** | No direct publication; no writing from an unvalidated signal. |
| Research Runtime Publication | Daily 20:00 | Released bilingual articles, indexes, website and verified GitHub commit. | No new research, substantive writing or evidence repair. |
| Research Runtime Weekly | Sunday 20:30 | New weekly synthesis and engineering judgment. | Must not copy or concatenate Daily notes. |
| Research Runtime Academic | Wednesday 10:00 | Formal paper, benchmark, specification or institution research. | Ordinary news is excluded. |

The authoritative machine-readable definition is [`SCHEDULER.json`](./SCHEDULER.json).

## Daily production rhythm

```text
Morning research
09:00 Engine
→ 10:00 Intelligence Discovery + Queue + Three-Column Triage
→ 11:00 Knowledge

Afternoon production
15:00 Writing → Visualization → Evidence & Citation → Publication Editing
      → Publication Candidate

Evening release
20:00 Candidate → bilingual public paths → metadata → indexes → website
      → GitHub Commit → Commit Verify → Release
```

### 15:00 is not a draft shift

The Production shift produces a **complete report**:

- full Chinese Markdown;
- full English Markdown;
- valid metadata and column assignment;
- required visualization or an explicit no-visual decision;
- checked evidence and citations;
- completed publication editing.

Its lifecycle is `Publication Candidate`. The report is complete but not yet released.

The exact contract is [`PUBLICATION-CANDIDATE-SCHEMA.md`](./PUBLICATION-CANDIDATE-SCHEMA.md).

### 20:00 is release only

Publication consumes the candidate batch. It must not discover sources, perform Analysis, write a new report or repair weak evidence. A candidate that fails the release gate returns to Production or an earlier research stage.

## Scheduler and worker boundary

The control plane separates two facts:

1. **GitHub scheduler:** opens the canonical execution slot and initializes Runtime and Research Intelligence artifacts.
2. **ChatGPT Digital Research Employee worker:** performs the work, writes the result, commits durable outputs, verifies the commit and closes the slot.

A GitHub cron trigger is not evidence that research completed. Without worker execution, the task remains `Waiting`, `Blocked` or `Failed`.

The eight worker contracts are defined in [`WORKER-PROMPTS-V2.md`](./WORKER-PROMPTS-V2.md).

## Runtime artifacts

### Runtime Record

```text
research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md
```

Contains task statuses, structured work-result blocks, append-only events and GitHub verification.

### Research Intelligence Run

```text
research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json
```

Contains all three pipeline coverage results, inaccessible or failed sources, normalized signals and the three column decisions.

### Daily Research Plan

```text
research/runtime/plans/YYYY/MM/YYYY-MM-DD-plan.json
```

Contains the three column decisions produced by Queue and must agree with the Intelligence run.

### Publication Candidate batch

```text
research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json
```

Contains complete reports produced at 15:00 and consumed at 20:00.

The website is generated from these artifacts. It must not maintain a second hand-edited source, status, topic or candidate list.

## Mandatory task work report

A terminal task must report:

```text
Input
→ Work Outcome
→ Durable Output
→ Next Governed Action
→ Metrics
→ Artifacts and GitHub Evidence
```

`Skipped` means the worker actually ran but produced no eligible output. It must explain the reason and does not count toward daily completion.

## Runtime Gate

```text
Research Intelligence
→ Selected Research Object
→ Publication Candidate
→ Runtime Record + Task Result
→ Public bilingual files
→ GitHub Commit
→ Commit Verify
→ Release
```

A formal publication without a Runtime Record is not an official runtime output.

## Final principles

> Research Runtime is the only formal execution scheduler of the Research Operating System.

> All three intelligence pipelines serve all three research columns.

> Source coverage, source failure and no-selection reasons must remain observable.

> Production creates complete Publication Candidates; Publication releases them.

> Every scheduled shift must report its actual work outcome, not merely its execution status.

> Every Digital Research Employee execution shall be scheduled, observable, recorded and verifiable through Research Runtime Center V4.
