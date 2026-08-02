# Research Runtime Center — Runtime Charter V1.0

**Project:** joinwell52 Research Center  
**Center version:** Research Center 3.0  
**Scheduler:** Research Runtime Scheduler V1.0  
**Timezone:** `Asia/Shanghai`  
**System of record:** `joinwell52-AI/joinwell52`

## Charter

Research Runtime Center is the operational control plane of the Research Operating System.

Research OS defines how research should move. Research Runtime schedules execution, opens an execution slot, records status and events, verifies GitHub publication, and closes the lifecycle.

```text
Research Runtime Center
        ↓
Research Runtime Scheduler V1.0
        ↓
Engine / Queue / Knowledge / Architecture
        ↓
Publication / Weekly / Academic
        ↓
Runtime Record
        ↓
GitHub Commit + Commit Verify
        ↓
Research Center 3.0
```

No formal automation exists outside Research Runtime. Historical names such as “Research OS task”, “Queue task”, “Weekly automation” and “Publication task” are not formal scheduler names.

## Seven formal Runtime tasks

The original task draft said “six” while explicitly defining seven tasks. This Charter and the machine-readable scheduler resolve the inconsistency in favor of the seven defined responsibilities.

| Formal name | Schedule (`Asia/Shanghai`) | Responsibility | Boundary |
|---|---|---|---|
| Research Runtime Engine | Daily 09:00 | Advance the Research OS state machine from Signal to Release. | The only Research OS Engine. |
| Research Runtime Queue | Daily 10:00 | Maintain discovery, candidates, priority, selection, rejection and queue lifecycle. | Must not publish directly. |
| Research Runtime Knowledge | Daily 11:00 | Maintain Knowledge Graph, related notes, architecture candidates, observations and engineering insights. | Must not publish directly. |
| Research Runtime Architecture | Monday 12:00 | Decide architecture, specification, publication candidates and lifecycle. | Architecture review only. |
| Research Runtime Publication | Daily 20:00 | Publish Daily Research, metadata, website integration, GitHub commit and commit verification. | Must not research directly; must use completed knowledge and Research Skills. |
| Research Runtime Weekly | Sunday 20:30 | Produce cross-analysis, architecture judgment, engineering judgment and Weekly publication. | Must not copy Daily Research. |
| Research Runtime Academic | Wednesday 10:00 | Publish research about papers, benchmarks, specifications, conferences and institutions. | Must not publish ordinary news. |

The authoritative machine-readable definition is [`SCHEDULER.json`](./SCHEDULER.json).

## Scheduler and worker boundary

The control plane separates two facts:

1. **Scheduler trigger:** GitHub Actions executes the canonical cron schedule and creates or updates the daily Runtime Record with a `Waiting` execution slot.
2. **Digital Research Employee worker:** the corresponding ChatGPT Runtime task performs the research, writes outputs, commits them, verifies the commit, and closes the Runtime Record.

A trigger is not evidence that research completed. If the worker does not run or cannot verify the result, the state remains `Waiting`, `Blocked` or `Failed`. The scheduler must never manufacture `Completed`.

On Wednesday at 10:00, Runtime Queue and Runtime Academic share one cron trigger. The scheduler creates both slots while preserving separate responsibilities and statuses.

## Lifecycle and status

```text
Signal → Candidate → Queue → Selected → Reading → Analysis
→ Knowledge → Architecture → Specification → Publication → Release
```

Exactly six statuses are allowed:

`Running` · `Completed` · `Blocked` · `Failed` · `Skipped` · `Waiting`

Started, GitHub Commit, Commit Verify and Published are events, not additional statuses.

## Runtime Record

Every formal execution writes to:

```text
research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md
```

Runtime Record is the single source of truth for Runtime Status, Today’s Tasks, Timeline, History, Runtime Log, GitHub Status, Publication Status, Queue Status and Engine Status. Dashboard values must never be hand-edited. The exact contract is defined in [`RUNTIME-RECORD-SCHEMA.md`](./RUNTIME-RECORD-SCHEMA.md).

`scripts/runtime-center.mjs` validates records, creates scheduled slots, updates execution status, generates website data and enforces the publication gate. The website projection is generated at build time from Runtime Records.

## Runtime Gate

```text
Research Runtime
→ Publication Candidate
→ Runtime Record
→ GitHub Commit
→ Commit Verify
→ Runtime Record closure
→ Official Publication
```

A formal publication pull request without a changed Runtime Record fails validation.

> Every official Publication shall be executed by Research Runtime and produce a Runtime Record. Any publication without a Runtime Record is not considered an official runtime output.

## Final principles

> Research Runtime is the only execution scheduler of the Research Operating System.

> Every Digital Research Employee execution shall be scheduled, observable, recorded and verifiable through the Runtime Center.

> Research Runtime—not individual automation tasks—is the operational control plane of the Digital Research Employee.
