# Research Runtime Worker Contracts V2

This document defines the worker obligations paired with Research Runtime Scheduler V2.0. The GitHub scheduler opens execution slots; the ChatGPT Digital Research Employee performs the work and closes each slot.

## Common completion requirements

Every worker must:

1. read the current Scheduler, Runtime Record and authoritative upstream artifacts;
2. perform only its assigned responsibility;
3. update its `task_<id>` status accurately;
4. append one `runtime-task-result/v1` block containing bilingual Input, Work Outcome, Output, Next, Metrics and Artifacts;
5. update the Runtime Log;
6. commit durable outputs when the task creates or changes them;
7. fetch and verify the resulting commit before reporting `Completed`.

`Skipped` means the worker ran and found no eligible output. It requires a bilingual reason and does not count as completed work.

## 09:00 — Research Runtime Engine

Advance eligible objects by exactly one governed lifecycle transition. Use the Skill required by the current state. Do not select a second active object merely to manufacture progress. Preserve evidence, blockers and next action.

## 10:00 — Research Runtime Queue

Discover official or primary-source signals, normalize and score candidates, update the canonical Queue, and write:

```text
research/runtime/plans/YYYY/MM/YYYY-MM-DD-plan.json
```

The plan must contain exactly three decisions:

- Digital Employee;
- Industry Architecture;
- Open-source Engineering.

For each column, select at most one primary object or explicitly record `No Selection` with the reason. Every selected Queue object must have one primary column. Queue must not write a publication.

## 11:00 — Research Runtime Knowledge

Admit only completed and evidence-validated Research Notes. Maintain knowledge records, relationships, recurring findings and architecture candidates. Do not treat a selected Queue object or Analysis record as a completed Research Note.

## Monday 12:00 — Research Runtime Architecture

Review evidence-backed architecture candidates and make one governed disposition. Do not execute Engine transitions and do not promote a single unsupported observation.

## 15:00 — Research Runtime Production

Read the Daily Research Plan, current Queue and eligible analyzed objects. For each eligible column object, execute:

```text
Skill 05 — Research Writing
Skill 06 — Visualization
Skill 07 — Evidence & Citation
Skill 08 — Publication Editing
```

Create complete Chinese and English reports, required visual assets, valid metadata and a candidate batch at:

```text
research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json
```

The output lifecycle is `Publication Candidate`. Production must not place the report into the public article directory and must not publish to the website.

When no object has passed all upstream gates, set Production to `Skipped`, record the exact blocker, and leave the candidate list empty.

## 20:00 — Research Runtime Publication

Read only the Publication Candidate batch. Release complete candidates by column, update public bilingual Markdown, metadata, indexes and website references, commit to GitHub, fetch the commit and verify the published paths.

Publication must not discover sources, perform analysis, write a new report or repair weak evidence. A failed candidate returns to Production or the relevant earlier stage.

## Sunday 20:30 — Research Runtime Weekly

Use the previous seven days of evidence-validated Daily Research Notes. Produce genuinely new cross-analysis, architecture judgment and engineering judgment. Do not concatenate Daily notes.

## Wednesday 10:00 — Research Runtime Academic

Select only papers, benchmarks, specifications, conferences or institutions. Execute the complete Research Skills pipeline and publish only after evidence and editing gates pass. Ordinary news is excluded.

## Operational limitation

The repository workflow schedules all eight slots. A separate ChatGPT automation must exist for the 15:00 Production worker; the GitHub cron alone cannot generate research prose. Until that worker is enabled, the Production slot remains `Waiting` rather than being manufactured as `Completed`.
