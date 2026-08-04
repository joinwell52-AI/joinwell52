---
title: Research Runtime Center V4
publication: specification
document_version: V4.0
status: Released
language: en
updated: 2026-08-04
---

# Research Runtime Center V4

## A complete daily production line for the Digital Researcher

Research Runtime Center V4 upgrades Research Center automation into an observable, reportable, and verifiable Digital Researcher production line:

```text
09:00  Research Runtime Engine
10:00  Research Runtime Queue + Three-Column Research Plan
11:00  Research Runtime Knowledge
15:00  Research Runtime Production
20:00  Research Runtime Publication
```

Architecture runs Monday at 12:00; Weekly runs Sunday at 20:30; Academic runs Wednesday at 10:00.

## Three defining changes in V4

### 1. Separate topic decisions for all three columns

Research Runtime Queue no longer reports only a Queue ID. It must make a separate daily decision for:

- **Digital Employee**;
- **Industry Architecture**;
- **Open-source Engineering**.

Every column reports a selected topic or `No Selection`, the decision rationale, primary source, priority, lifecycle state, and next action.

The authoritative plan is written to:

```text
research/runtime/plans/YYYY/MM/YYYY-MM-DD-plan.json
```

### 2. A new 15:00 Production shift

Research Runtime Production executes:

```text
Skill 05 — Research Writing
→ Skill 06 — Visualization
→ Skill 07 — Evidence & Citation
→ Skill 08 — Publication Editing
```

Its output is a complete **Publication Candidate**, not an unfinished draft. The candidate requires complete Chinese and English reports, valid metadata, column assignment, a visualization decision, verified evidence and citations, and completed publication editing.

The authoritative batch is written to:

```text
research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json
```

### 3. The 20:00 shift performs release only

Research Runtime Publication consumes complete Publication Candidates and performs:

- public Chinese and English article output;
- metadata, index, and website updates;
- GitHub commit creation;
- direct commit and path verification;
- lifecycle transition to Release.

The release shift must not discover new sources, analyze the topic, write a complete report, or repair weak evidence.

## Eight formal Runtime tasks

| Runtime | Schedule | Formal work outcome |
|---|---:|---|
| Research Runtime Engine | Daily 09:00 | One governed lifecycle transition and durable research artifact |
| Research Runtime Queue | Daily 10:00 | Research Queue and three-column Daily Research Plan |
| Research Runtime Knowledge | Daily 11:00 | Knowledge admission, relationships, and architecture candidates |
| Research Runtime Architecture | Monday 12:00 | Architecture and lifecycle disposition |
| **Research Runtime Production** | **Daily 15:00** | **Complete bilingual Publication Candidates** |
| Research Runtime Publication | Daily 20:00 | Verified GitHub and website release |
| Research Runtime Weekly | Sunday 20:30 | New weekly synthesis and engineering judgment |
| Research Runtime Academic | Wednesday 10:00 | Research on papers, benchmarks, specifications, conferences, and institutions |

## Operations Center projection

The V4 Operations Center presents the Digital Researcher’s work in this order:

1. today’s three-column research plan;
2. each scheduled task’s input, work outcome, output, next action, and evidence;
3. Publication Candidates created at 15:00;
4. the 20:00 Release result;
5. Runtime Record, GitHub commit, Commit Verify, and work log;
6. recent operational history.

The page does not maintain a second hand-edited dataset. All information comes from the Scheduler, Runtime Record, Column Plan, and Candidate Batch.

## Completion calculation

Only `Completed` counts toward the completion rate:

```text
completion rate = Completed tasks ÷ scheduled tasks
```

`Skipped` means that the task actually ran but found no eligible output. It requires a reason and does not count as completed.

## Scheduler and worker boundary

The GitHub Scheduler opens execution slots and initializes runtime artifacts. The ChatGPT-powered Digital Researcher worker performs the actual research writing, visualization, citation validation, and publication editing.

Therefore:

> A scheduled trigger is not evidence of completed work.

Without worker execution and verified outcomes, the task remains `Waiting`, `Blocked`, or `Failed`; the system must not manufacture `Completed`.

## Governing principles

> All three research columns receive an explicit daily topic decision.

> The afternoon shift produces the complete report; the evening shift performs release only.

> Every scheduled task reports its actual work outcome, not merely its execution status.

> A publication without a Runtime Record and Commit Verify is not an official runtime output.
