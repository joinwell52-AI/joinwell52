# Two successful saves, one missing update: evidence summary

[中文证据](00-report.md) · [English article](../../../docs/en/research/2026-11-03-atomic-write-lost-update.md)

## Source and claim map

| Claim | Evidence | Unsupported inference |
| --- | --- | --- |
| ADK moved stale-state checking inside its write lock | [Google ADK commit `bc0b41871699a70a3bf1169bb7e7ff91d2db5e31`](https://github.com/google/adk-python/commit/bc0b41871699a70a3bf1169bb7e7ff91d2db5e31) | CodeFlowMu had ADK's incident |
| A separate ADK shared-state write change remains under review | [Google ADK #7942](https://github.com/google/adk-python/pull/7942); author-reported concurrency tests, no live PostgreSQL/Redis E2E | The PR is merged or proves the behavior of one session file |
| A stale snapshot can replace a previous change through CodeFlowMu `SessionStore` while leaving a valid file | [Session probe](probe_session_write_boundary.mjs), pinned source blobs, observations below | A harmful race occurred in a real runtime |
| Two sequential FCoP report writes preserve two bodies | [FCoP control probe](probe_fcop_report_identity.py), observations below | Concurrent numbering, crash recovery, or product integration is proven |

## Pinned sources

- CodeFlowMu V3.0.152 commit `0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f`, observed on 2026-11-03. Git blobs: `SessionStore.ts` `8002807812f034fbb6814c5595aa7455dd379055`; `atomic-write.ts` `99c409b30fe90354097dbcc063c8d82fc952f65f`; `SessionManager.ts` `9363f0f892adacd89d1ddfbb5547a7c140d43097`. The public script uses only a local checkout and a temporary directory. If CodeFlowMu source access is restricted, readers cannot independently rerun that layer; publishing the script does not remove this limitation.
- FCoP commit `a964d0df8ea09f76e7d7f3257052c411105cfcdc`. The probe creates one synthetic task and two sequential reports in a temporary workspace.
- Both source worktrees had unrelated pre-existing modifications. This research did not edit product source; the blob IDs identify the examined file contents.

## Fixture, checks, and observed output

1. Save a synthetic session with tool count zero. A and B each load that same version.
2. A sets `runtime_recovery_status=managed_job_running`; B sets `tool_calls_count=1` on its old copy.
3. Save A, then B. Record both returns, readback, and final JSON parseability.
4. Control: reload B after A's save before changing the tool count.
5. In a separate FCoP workspace, create a task and two reports; read their paths, task references, and bodies.

| CodeFlowMu checkpoint | Recovery state | Tool calls | Result |
| --- | --- | ---: | --- |
| After A | `managed_job_running` | 0 | Save resolved |
| After B's old snapshot | Absent | 1 | Save resolved; valid JSON |
| After B reload control | `managed_job_running` | 1 | Save resolved; valid JSON |

FCoP control: both reports have distinct paths, cite the same task, and retain their separate bodies. **The probes are not a single integrated runtime test.** They compare the semantics of two storage objects.

Seventeen focused CodeFlowMu `SessionStore` and atomic-write tests passed. They cover ordinary read/write, corrupt files, and rename behavior, not stale-snapshot conflict handling. We have no production-incident sample or reproduced cancellation/natural-settlement race in `SessionManager`. The asynchronously interleavable source paths form the next hypothesis, not a confirmed failure.

## Reproduction and expected result

With access to the matching CodeFlowMu checkout, set `CODEFLOWMU_SOURCE_ROOT` to its root and run `node probe_session_write_boundary.mjs` under Node 24. Expect `stale_snapshot.after_B.recovery_status=null`, `tool_calls=1`, and both values present in `serialized_control`. For FCoP, run `PYTHONPATH=<FCoP checkout>/src python probe_fcop_report_identity.py`; expect the three booleans to be `true`. These are synthetic module/API probes, not a production trace or end-to-end acceptance test.

The next test should hold controlled `SessionManager` cancellation and natural settlement after the same read, release writes in each order, and inspect on-disk status, report reference, and both receipts. That test remains undone. This round has zero formal development review items and no product change.
