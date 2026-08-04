# Runtime Record Schema V1.1

## Canonical path

```text
research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md
```

The filename date, frontmatter `date` and `Asia/Shanghai` operating date must match.

## Required frontmatter

```yaml
---
schema: "research-runtime-record/v1"
runtime_version: "1.0"
center_version: "3.0"
result_contract: "runtime-task-result/v1"
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
task_publication: "..."
task_weekly: "..."
task_academic: "..."
---
```

All status-bearing fields use exactly the six Runtime statuses. `pending` is allowed only for `github_commit`, never as a status.

Legacy records without `result_contract` remain readable. New and upgraded records use `runtime-task-result/v1` and must satisfy the task-result completion gate below.

## Required body

Every record contains:

1. `Runtime Summary`;
2. zero or more structured `runtime-result` blocks;
3. an append-only `Runtime Log` table.

```markdown
## Runtime Task Results

```runtime-result
{
  "task": "queue",
  "status": "Completed",
  "input": "Current Queue and official source signals.",
  "input_zh": "当前研究队列与官方来源信号。",
  "summary": "Registered six signals and selected one qualified candidate.",
  "summary_zh": "登记 6 个信号并选出 1 个合格候选。",
  "output": "Signal register, queue history and canonical Queue update.",
  "output_zh": "信号登记、队列历史与权威队列更新。",
  "next": "Wait for Engine allocation and begin Deep Reading.",
  "next_zh": "等待引擎分配，并从深度阅读开始。",
  "reason": "",
  "reason_zh": "",
  "metrics": [
    { "label": "Signals", "label_zh": "信号", "value": "6" }
  ],
  "artifacts": [
    {
      "label": "Signal register",
      "label_zh": "信号登记",
      "path": "research/queue/signals/YYYY-MM-DD.md",
      "commit": "full SHA"
    }
  ]
}
```

## Runtime Log

| Time | Runtime | Event | Status | Detail |
|---|---|---|---|---|
| HH:MM | Research Runtime ... | Runtime Started | Running | ... |
```

Corrections are preserved through Git history; past rows must not be silently rewritten to manufacture success.

## Task-result contract

Each scheduled task that reaches a terminal status—`Completed`, `Skipped`, `Blocked` or `Failed`—must have exactly one `runtime-result` block.

A task-result block must report:

- `input` / `input_zh`: what the task actually read or received;
- `summary` / `summary_zh`: the work outcome, not merely the action performed;
- `output` / `output_zh`: durable files, decisions, publications or verified facts produced;
- `next` / `next_zh`: the next governed action;
- `metrics`: bounded result counts or decisions, each with English and Chinese labels;
- `artifacts`: paths, commits or external evidence links, each with English and Chinese labels;
- `reason` / `reason_zh`: mandatory when the status is `Skipped`.

The block status must match the corresponding `task_<id>` frontmatter status. A terminal task without a task-result block fails Runtime validation.

`Waiting` and `Running` tasks do not require a completed task-result block. The Operations Center displays them as pending or active work.

## Completion gate

A publication Runtime is `Completed` only when its output exists, metadata is valid, the GitHub commit exists, the commit and output paths have been directly verified, all publication statuses are `Completed`, the structured task result exists, and the final Runtime Log event is present.

A publication eligibility check that finds no eligible note is `Skipped`, not `Completed`. Its task result must state the reason and the next governed action. `Skipped` does not count toward the daily completion rate.

A scheduler trigger without worker execution remains `Waiting`. A generated document without commit verification remains `Running`, `Blocked` or `Failed` according to the actual condition.

## Dashboard projection

The website derives the following from the Scheduler and Runtime Records:

- today’s scheduled tasks and completion rate;
- each task’s status;
- each task’s input, work outcome, output, next action, metrics and artifacts;
- GitHub commit and verification evidence;
- work log and recent daily work reports.

The website must not maintain a second, hand-edited task-result list.
