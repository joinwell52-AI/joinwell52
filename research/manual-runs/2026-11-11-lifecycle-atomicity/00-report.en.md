# 2026-11-11: Task transition record, file move, and caller receipt

## Question and provenance

[Paperclip #20674](https://github.com/paperclipai/paperclip/pull/20674) stores the document revision and idempotency receipt for its protected `write_document` operation in one database transaction. That prompted a question about recovery evidence in our file-based task transitions. We did not run Paperclip, and its local guarantee is not a claim about arbitrary tools.

The tested code is [CodeFlowMu-open `ed5634c`](https://github.com/joinwell52-AI/CodeFlowMu-open/tree/ed5634c718b9e238c44bb70851020c9793546fe6). On November 11, the remote `origin/main` was `7230419`; the tested `LifecycleStateMachine.ts` was unchanged from the pinned local commit. We called the real `LifecycleKernel.submitReview`. CodeFlowMu runs multi-agent work; FCoP files store task location and transition history. We did not run the FCoP Python SDK in this experiment.

## Method and reproduction

The [probe](probe.mjs) creates an `active` task in an isolated temporary directory. A regular file blocks the target `review/` directory. The submission writes metadata and a transition, then fails with `EEXIST` while creating the destination. We remove the obstruction and retry the same task/report request. Finally, we simulate a lost successful response by sending the same request again. The probe cleans up its temporary directory and does not modify product source.

```text
cd <CodeFlowMu-open>/packages/codeflowmu-runtime
node --import tsx <joinwell52>/research/manual-runs/2026-11-11-lifecycle-atomicity/probe.mjs <absolute-CodeFlowMu-open-path>
node --import tsx --test src/lifecycle/__tests__/LifecycleStateMachine.test.ts
```

| Point | Caller result | Physical folder | Metadata state | review_status | Transitions |
| --- | --- | --- | --- | --- | ---: |
| Destination blocked | `EEXIST` | active | review | pending | 1 |
| Obstruction removed; same request retried | success: active → review | review | review | pending | 1 |
| Success response assumed lost; request retried | `expected state active, got review` | review | review | pending | 1 |

The last transition in each read has `action: submit_review` and references the same `REPORT-20261111-001-OPS-to-PM`. No duplicate transition was recorded in this path. Targeted lifecycle tests passed **28/28** locally; they test normal and other repeat-call conditions, not the injected destination failure.

## Claim-to-source map and limits

- **Record precedes move:** [`TransitionRecorder.append`](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/lifecycle/TransitionRecorder.ts) writes target state and event. [`submitReview` and `moveTask`](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/lifecycle/LifecycleStateMachine.ts) then write review fields and move the file. The first probe row observes the intermediate state.
- **Same request after removing the obstruction:** the second call completes the move with one transition entry. This is a bounded retry result, not an exactly-once claim for all operations.
- **Response lost after success:** the third call rejects because the starting stage is already review. Task location and metadata can confirm the current stage, but that error alone cannot prove the previous attempt did nothing or attribute the move to one particular request.
- **Write lease:** the tested `LifecycleKernel` serializes project writes. We have not established a transaction across the separate file writes and move.

The obstruction is an isolated fault injection, not a real hard kill or network failure. We did not test a live model, UI, deployment, or affected users. The public script reproduces a local boundary, not full end-to-end reachability. A next experiment should bind a queryable result to `taskId + reportId + attemptId`, then test intermediate states and competing authorized requests.
