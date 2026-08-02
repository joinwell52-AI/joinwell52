# Runtime Record Schema V1.0

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

## Required body

Every record must contain a `Runtime Summary` and an append-only `Runtime Log` table:

```markdown
| Time | Runtime | Event | Status | Detail |
|---|---|---|---|---|
| HH:MM | Research Runtime ... | Runtime Started | Running | ... |
```

Corrections are preserved through Git history; past rows must not be silently rewritten to manufacture success.

## Completion gate

A publication Runtime is `Completed` only when its output exists, metadata is valid, the GitHub commit exists, the commit and output paths have been directly verified, all publication statuses are `Completed`, and the final Runtime Log event is present.

A scheduler trigger without worker execution remains `Waiting`. A generated document without commit verification remains `Running`, `Blocked` or `Failed` according to the actual condition.

## Dashboard projection

The website may derive latest status, today’s tasks, task states, Timeline, History, GitHub, publication, queue and engine status. It must not contain an independently maintained status list.
