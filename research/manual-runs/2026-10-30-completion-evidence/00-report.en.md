# Do two successes belong to the same task? Controlled evidence

[中文记录](00-report.md) · [English article](../../../docs/en/research/2026-10-30-two-successes-one-task.md)

## Sources and question

[Paperclip #18227](https://github.com/paperclipai/paperclip/pull/18227) prevents a rejected completion from being replaced by a successful provider terminal. [Codex #58166](https://github.com/openai/codex/pull/58166) records trace completeness separately from task outcome. They prompted our question about **which task a success belongs to**. Neither PR establishes a CodeFlowMu defect.

Our question: in CodeFlowMu's Google adapter, what happens when a successful `write_report` belongs to task A but a successful `submit_task` belongs to task B? Can the adapter rediscover A's formal FCoP 4 report when process-local success flags are absent?

## Pinned method

- FCoP 4.0.5 source commit `f1aa3348a9a64475caba8036dcc23e83f5080c7c`. The public [FCoP control script](probe_fcop_control.py) uses real `Project` operations in disposable directories.
- Private CodeFlowMu V3.0.129 source commit `c600e74d5d72253657593a37077e856fe6c7fba6`. Local probes called its Google contract-state, report-lookup, and session-settlement functions. The private source and full local integration script are not in this repository; **readers cannot independently rerun that layer**.
- Same-task control: write A's formal report, then submit A. Cross-task control: write A's report, then submit B. Both FCoP operations really succeeded before their outputs were classified by the local CodeFlowMu functions. A separate call omitted process-local success flags.
- No live model, full UI, external service, production task, or side effect was involved.

## Results

| Checkpoint | Same task | Cross task |
| --- | --- | --- |
| Formal report for A via FCoP public query | 1 | 1 |
| Successful report write and submit | A + A | A + B |
| Old CodeFlowMu disk lookup finds A's report | No | No |
| Two tool-success flags | Both `true` | Both `true` |
| Early stop and session settlement for A | Stop, `done` | Stop, `done` |
| A's formal FCoP task stage | `review` | `active` |
| Settlement without process-local flags | `blocked/no_valid_report` | `blocked/no_valid_report` |

FCoP 4 uses a `fcop/reports/REPORT-<UUID>.md` path and `subject_ref`. The tested old CodeFlowMu finder filters first for a role suffix such as `-DEV-to-PM`, then checks legacy relationship fields, so it did not rediscover this formally queryable report. The contract-state function instead accumulates success booleans by tool name without binding them to one `task_id` and `attempt_id`. In the cross-task control, the **session settlement** returned `done` although A's formal TASK remained `active`. Session `done` is not the FCoP `done` lifecycle stage.

Ten existing unit tests for the two adapter modules passed, but did not cover this cross-task or recovery comparison.

## Limits and next checks

This verifies the **Google adapter module path under controlled inputs**. It does not establish that a live model naturally submits another task, that a UI necessarily displays the task as completed, that other providers share the issue, or that a production incident occurred. The public script reproduces the FCoP stage distinction; the private layer is documented only by bounded inputs and outcomes. Next checks should bind success to task and attempt, reconcile via FCoP's public report and lifecycle queries, then run an end-to-end Google, restart, and UI qualification in a separate product task.
