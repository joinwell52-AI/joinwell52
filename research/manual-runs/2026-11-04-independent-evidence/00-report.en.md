# 2026-11-04 Claims and independent evidence: experiment record

## Claim and provenance

We compared one synthetic PM report claiming “approved, tests PASSED” against CodeFlowMu's action observation and FCoP's separate REVIEW artifact. The prompt came from the still-open [SWE-bench #712](https://github.com/SWE-bench/SWE-bench/pull/712) and the unconfirmed reporter account in [Orkas #174](https://github.com/Orkas-AI/Orkas/issues/174). We did not reproduce either upstream failure.

Pinned source: [CodeFlowMu `0d2d4e7`](https://github.com/joinwell52-AI/codeflowmu/tree/0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f), `EvalObservationGenerator.ts` blob `f080b6c3e3836e537a780410e7ca4002c1822bd1`; [FCoP `a964d0df`](https://github.com/joinwell52-AI/FCoP/tree/a964d0df8ea09f76e7d7f3257052c411105cfcdc), `project.py` blob `d961c698b02a993e03c2da36b3c5bfc1fe35a430`.

## Reproducible probes

- [CodeFlowMu probe](probe_eval_claim_vs_action.mjs): set `CFM_ROOT` to the pinned CodeFlowMu checkout and run with its installed `tsx`. It calls `buildEvalObservationAnalysisFromRows()` directly; no agent runs.
- [FCoP probe](probe_fcop_report_vs_review.py): set `PYTHONPATH` to the pinned FCoP `src` directory and run with Python. It uses a disposable directory and the actual `Project` API.

The PM report body is identical in all three CodeFlowMu scenarios. Only the Action Evidence input changes.

| Action Evidence | Observed result | Decision |
| --- | --- | --- |
| None | Missing child-task evidence; high risk; zero successful processes | `draft`, `reviewed_by=null` |
| One failed test process, one product failure | High risk; report wording does not erase the failure | `draft` |
| One successful test process carrying a claim of 78 assertions | `successful_tests=null`; scope remains `outer_process_only` | `draft` |

In FCoP, the REPORT body contains `APPROVED`. Zero REVIEW files exist after that REPORT. A separate `write_review(... decision='needs_human')` creates one REVIEW file with the decision `needs_human`; the paths differ.

## Checks and limits

Existing CodeFlowMu EvalObservationGenerator tests passed **18/18** and FCoP `test_project_reviews.py` passed **26/26**. These regression suites do not replace the controlled comparison above.

All input is synthetic. There was no live agent, tool execution, external effect, or human approval. The CodeFlowMu probe enters at the row-analysis boundary, so it does not test whether upstream Action Evidence capture can be contaminated by stdout. The FCoP probe establishes artifact separation, not that the reviewer verified real effects. These observations neither validate SWE-bench's proposed fix nor establish what Orkas actually accessed or transmitted.
