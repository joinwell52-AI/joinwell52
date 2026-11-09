# When a background agent finishes, who tells the supervisor?

This is a bounded engineering experiment run on 2026-11-09, not an end-to-end reliability certification of LangChain or CodeFlowMu.

## Sources and pinned subjects

| Subject | Fixed source | Entry exercised |
| --- | --- | --- |
| Research question | [LangChain article, 2026-11-05](https://www.langchain.com/blog/agents-are-going-async) | Separate responsive supervision from long-running workers. |
| Reference implementation | [async-deep-agents `6cafef62`](https://github.com/langchain-ai/async-deep-agents/tree/6cafef62b2783a3d16edacd7df151ad1a33ee7a5) | Real Python `CompletionNotifierMiddleware`, deterministic substitute for remote client. |
| Our engineering comparison | [CodeFlowMu-open `ed5634c7`](https://github.com/joinwell52-AI/CodeFlowMu-open/tree/ed5634c718b9e238c44bb70851020c9793546fe6) | Existing report intake, late report, and PM planner tests. |
| Protocol boundary | [FCoP 3.0 specification](https://github.com/joinwell52-AI/FCoP/blob/main/spec/fcop-3.0-spec.md) | Source review of file-based state, transition events, and Runtime boundary. |

The reference README describes completion notification as optional wiring. The worker graph examples leave it commented out. We did not find a LICENSE file in that checkout; we exercised its code path without incorporating it into a product.

## Experiment 1: real notifier, substituted remote client

Script: [probe_completion_notifier.py](./probe_completion_notifier.py), SHA-256 `54476c402a56483c0fe05a69702d5337203068a4ec71d869e8f43c824521b1da`. The imported upstream module has SHA-256 `e281ac801452742c69371f319a35ded34faf1778a077d912f07a05d362b0b13a`. Only third-party imports and `runs.create` were substituted. The actual upstream middleware class and methods ran.

To rerun, clone the pinned upstream commit to `async-deep-agents/` beside the script and run `python probe_completion_notifier.py`; alternatively set `ASYNC_DEEP_AGENTS_CHECKOUT`. No model key or hosted deployment is required.

| Controlled condition | Two completion callbacks on one instance | Observation |
| --- | --- | --- |
| Parent IDs present, delivery succeeds | One transport attempt, `_notified=true` | Parent run receives a synthetic `role=user` message without a structured `job_id`. |
| Parent IDs present, transport raises | One transport attempt, `_notified=true` | Warning is logged; the second callback does not retry. |
| Parent thread ID missing | Zero attempts, `_notified=false` | No delivery is attempted. |

This establishes local behavior of the reference module under controlled inputs. It does not show what a hosted LangGraph service might reconcile, nor that a product task result was lost. The README already leaves notification error handling to the adopting application.

## Experiment 2: CodeFlowMu report intake boundary

From `packages/codeflowmu-runtime` at the pinned CodeFlowMu-open commit:

```text
node --import tsx --test src/scheduler/__tests__/ReportDispatcher.test.ts src/pm/__tests__/lateReportIntake.test.ts src/pm/__tests__/PmGovernancePlanner.test.ts
```

**19/19 passed.** The existing tests cover waking PM from worker REPORTs, queueing and deduplicating while PM is busy, one durable wake audit record, one PM session for a same-thread batch, idempotent late-report intake, and avoiding review when no report exists. These are component tests, not a real-model, UI, process-crash, or network-disconnect acceptance run.

## Judgment and limit

Worker output, notification delivery, and supervisor acceptance are distinct states. The reference notifier's in-memory flag can diverge from delivery. CodeFlowMu's tests show an existing durable-report-driven intake path. The subjects and test boundaries differ; the former's failure is not evidence of the same defect in the latter. FCoP defines task state and transition events, not Runtime message delivery.

A useful next falsification test would pause PM on a human approval, write a worker REPORT, fail one wake attempt, restart Runtime, and inspect report rediscovery, deduplication, and the unchanged approval question. **We did not run that end-to-end test** and have not confirmed a CodeFlowMu development issue.
