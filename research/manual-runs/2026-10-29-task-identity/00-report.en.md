# Same task ID. Is it still the same work? — Controlled experiment record

Date: 2026-10-29. This packet supports the [English article](../../../docs/en/research/2026-10-29-same-task-id-different-work.md). [中文记录](00-report.md).

## Sources and scope

- External prompts: [agent-claimcheck](https://github.com/B0yko/agent-claimcheck) compares success claims with tool receipts and state probes; [Beads #7931](https://github.com/gastownhall/beads/pull/7931) retains retired identities on a specific cleanup path. Their tests are not counted as our experiments.
- Pinned local code: [FCoP](https://github.com/joinwell52-AI/FCoP/tree/f1aa3348a9a64475caba8036dcc23e83f5080c7c) `f1aa3348a9a64475caba8036dcc23e83f5080c7c` (package 4.0.5) and [CodeFlowMu-open](https://github.com/joinwell52-AI/CodeFlowMu-open/tree/7230419396722fc5df4b6f1c725f9205a4a81a38) `7230419396722fc5df4b6f1c725f9205a4a81a38`. The FCoP API under test is `fcop.compatibility.v3`. CodeFlowMu-open is a **frozen historical public edition**, not the current private product.
- Tasks, reports, and actions were synthetic and confined to temporary projects. No real delivery, remote Git push, online approval, or business side effect was exercised.

## Chain A: one task, different execution sessions

The FCoP v3 compatibility API created a real task and a `status: done` report. Its frontmatter contained a task reference but no `session_id` or `run_id`. In the controlled CodeFlowMu action log, the old session ran `npm test` at 10:00 with exit code 0; the new session wrote a completion report at 11:00 without running a test.

| Comparison | Observed result |
| --- | --- |
| Aggregate evidence by task ID only | `pass / evidence_verified`; selected the old session's test |
| Bind the report to the new session | `needs_admin / session_evidence_gap` |
| Start evidence window after the old test | `fail / missing_test_evidence` |
| Send the actual FCoP report through `ReportActionResolver` | No session field; `outcome=reconciled`, Review verdict=`pass` |

A separate `review_check` probe returned `ok=true` for a matching report when the named artifact was present, absent, or contained `FAIL`; a wrong task ID yielded `task_id_mismatch`. This entry checks association and textual conditions; it is **not** the later fact gate. The experiment does not establish that the old test was invalid for the new delivery. Legitimate inheritance needs explicit applicability rules.

## Chain B: ID reuse after deep archival

Using FCoP 4.0.5's **v3 compatibility API**, we created the sole task of the day, `TASK-20261029-001`, closed it, moved it into `history/YYYY-MM-DD/`, and created a different task that day.

| Observation | Result |
| --- | --- |
| First task file | Still present in history |
| Second task ID | Also `TASK-20261029-001` |
| Ordinary `read_task(old ID)` | New task, `Second delivery` |
| `read_history_task(old ID)` | Old task, `First delivery` |
| Late report addressed to old ID | File refers to the same number; no external side effect tested |
| CodeFlowMu-open `TaskIdentityAllocator` with historic `001` | Allocated `002`; did not reuse |

FCoP 4.0's native Core uses UUID task identities; this compatibility result does not apply to the native Core. CodeFlowMu-open's own allocator scans history, so we cannot say every CodeFlowMu creation path reuses the number.

## Reproduction

The six scripts in this directory are public versions of the probes. They use and clean up temporary directories. Git, Python/uv, Node 24, and pnpm are required. From this directory:

```text
git clone https://github.com/joinwell52-AI/FCoP.git external/FCoP-current
git -C external/FCoP-current checkout f1aa3348a9a64475caba8036dcc23e83f5080c7c
git clone https://github.com/joinwell52-AI/CodeFlowMu-open.git external/CodeFlowMu-current
git -C external/CodeFlowMu-current checkout 7230419396722fc5df4b6f1c725f9205a4a81a38
```

Run `uv sync --no-dev` in `external/FCoP-current`, then `pnpm install --ignore-scripts --no-frozen-lockfile --lockfile=false` in `external/CodeFlowMu-current/packages/codeflowmu-runtime`. Return to this directory and run:

```text
uv run --project external/FCoP-current python probe_fcop_history_identity.py
node --experimental-transform-types probe_own_evidence_binding.ts
node --experimental-transform-types probe_own_review_gate.ts
node --experimental-transform-types probe_codeflowmu_task_id.ts
node --experimental-transform-types probe_fcop_to_codeflowmu.ts
```

`create_fcop_fixture.py` is invoked by the final script. Temporary paths and hashes can vary; compare the fields in the tables above. Relevant source: FCoP `src/fcop/compatibility/v3/project.py` (`write_task`, `write_report`, `archive_to_history`); CodeFlowMu-open `src/review/ReviewEvidenceResolver.ts`, `ReviewFactGate.ts`, `src/scheduler/ReportActionResolver.ts`, and `TaskIdentityAllocator.ts`.

## Limits and next question

Together the comparisons show that a task number alone cannot answer which job, execution, and evidence a record belongs to along the tested paths. They do not establish a production misapproval, a real late retry, or current private CodeFlowMu behavior. Next we need an explicit rule for when earlier evidence may be inherited and a check of identity reservation across all compatibility write paths. A development review requires separate product need, benefit, cost, and decision evidence.
