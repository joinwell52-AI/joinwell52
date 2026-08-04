# Runtime Record Schema V2.0

## Canonical path

```text
research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md
```

The filename date, frontmatter `date` and `Asia/Shanghai` operating date must match.

## Required frontmatter for Scheduler V2.0

```yaml
---
schema: "research-runtime-record/v1"
runtime_version: "2.0"
center_version: "3.0"
result_contract: "runtime-task-result/v1"
plan_contract: "runtime-column-plan/v1"
plan_path: "research/runtime/plans/YYYY/MM/YYYY-MM-DD-plan.json"
candidate_contract: "runtime-publication-candidate/v1"
candidate_path: "research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json"
date: "YYYY-MM-DD"
timezone: "Asia/Shanghai"
overall_status: "Running | Completed | Blocked | Failed | Skipped | Waiting"
latest_task: "Research Runtime ..."
start_time: "HH:MM"
end_time: "HH:MM"
duration: "HH:MM:SS"
github_repository: "joinwell52-AI/joinwell52"
github_commit: "full SHA or pending"
github_status: "Running | Completed | Blocked | Failed | Skipped | Waiting"
commit_verify: "Running | Completed | Blocked | Failed | Skipped | Waiting"
publication_status: "Running | Completed | Blocked | Failed | Skipped | Waiting"
queue_status: "Running | Completed | Blocked | Failed | Skipped | Waiting"
engine_status: "Running | Completed | Blocked | Failed | Skipped | Waiting"
lifecycle: "current lifecycle or transition"
output: "bounded execution output"
task_engine: "..."
task_queue: "..."
task_knowledge: "..."
task_architecture: "..."
task_production: "..."
task_publication: "..."
task_weekly: "..."
task_academic: "..."
---
```

All status-bearing fields use exactly the six Runtime statuses. `pending` is allowed only for commit fields, never as a status.

Historical Scheduler V1.0 records remain readable. Records created or upgraded under Scheduler V2.0 contain the plan, candidate and Production fields.

## Required body

Every record contains:

1. `Runtime Summary`;
2. zero or more structured `runtime-result` blocks;
3. an append-only `Runtime Log` table.

```markdown
## Runtime Task Results

```runtime-result
{
  "task": "production",
  "status": "Completed",
  "input": "Eligible analyzed objects assigned to the three columns.",
  "input_zh": "已分配到三个栏目的合格分析对象。",
  "summary": "Created one complete bilingual Publication Candidate.",
  "summary_zh": "生成 1 份完整的中英文出版候选。",
  "output": "Chinese and English Markdown, visualization, evidence validation, editing result and candidate batch.",
  "output_zh": "中英文 Markdown、配图、证据校验、编辑结果与出版候选批次。",
  "next": "Wait for the 20:00 Publication release shift.",
  "next_zh": "等待 20:00 发布班次发版。",
  "reason": "",
  "reason_zh": "",
  "metrics": [
    { "label": "Publication Candidates", "label_zh": "出版候选", "value": "1" }
  ],
  "artifacts": [
    {
      "label": "Candidate batch",
      "label_zh": "出版候选批次",
      "path": "research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json"
    }
  ]
}
```

## Runtime Log

| Time | Runtime | Event | Status | Detail |
|---|---|---|---|---|
| HH:MM | Research Runtime ... | Runtime Started | Running | ... |
```

Corrections remain visible through Git history; past events must not be silently rewritten to manufacture success.

## Task-result contract

Each scheduled task that reaches a terminal status—`Completed`, `Skipped`, `Blocked` or `Failed`—must have exactly one `runtime-result` block.

The block reports:

- actual input;
- actual work outcome;
- durable output;
- next governed action;
- bounded metrics;
- artifacts and GitHub evidence;
- bilingual reason when `Skipped`.

The result status must match `task_<id>`.

`Waiting` and `Running` tasks do not require a completed result block.

## Three-column plan link

`plan_path` points to the authoritative daily decisions for:

- Digital Employee;
- Industry Architecture;
- Open-source Engineering.

Queue is complete only after this plan exists and every column has `Selected` or `No Selection` with a reason.

## Production completion gate

`task_production: Completed` requires:

- at least one candidate in the candidate batch;
- complete Chinese and English reports;
- completed writing, visualization, evidence and citation validation, and publication editing;
- lifecycle `Publication Candidate`;
- no public release yet.

When no object is eligible, Production is `Skipped`, the candidate list is empty, and the result states the exact upstream blocker.

## Publication completion gate

`task_publication: Completed` requires:

- one or more complete Publication Candidates;
- public bilingual files and metadata;
- updated indexes and website surfaces;
- GitHub commit;
- commit and path verification;
- Released lifecycle result.

Publication must not perform new research, substantive writing or evidence repair. A failed candidate returns to Production or an earlier research stage.

## Daily completion calculation

Only `Completed` tasks count toward completion:

```text
completion rate = Completed scheduled tasks ÷ all scheduled tasks
```

`Waiting` and `Running` are unfinished. `Blocked`, `Failed` and `Skipped` are terminal but not completed. If every task is terminal but at least one is not `Completed`, the day ends incomplete.

## Website projection

The V4 Operations Center derives:

- the three-column Daily Research Plan;
- scheduled shifts and completion rate;
- every task’s structured work outcome;
- the 15:00 Publication Candidate batch;
- the 20:00 release result;
- Runtime Record, GitHub commit and verification;
- work log and recent operating history.

The website must not maintain a second hand-edited plan, candidate or result list.
