# Production Actions Bridge V1

## Purpose

ChatGPT scheduled tasks can access GitHub files and Actions without owning a shell. Production must therefore support a GitHub-native path instead of treating missing local command execution as a terminal capability failure.

The bridge has two governed request modes:

- `materialize-item`: generate the deterministic baseline PNG, calculate SHA-256 values and persist one `Ready` checkpoint item;
- `stage-batch`: atomically promote a complete three-item work bundle into canonical staging, run every required validator and advance the checkpoint to `validators-passed`.

The canonical request directory is:

`research/runtime/production-action-requests/`

Every request uses `runtime-production-action-request/v1`. A request is a command to GitHub Actions, not execution evidence. The Worker must wait for `Research Runtime Production Actions Bridge V1`, fetch the resulting `main`, and verify the checkpoint and exact artifact paths before continuing.

## Item materialization request

```json
{
  "schema": "runtime-production-action-request/v1",
  "mode": "materialize-item",
  "date": "YYYY-MM-DD",
  "timezone": "Asia/Shanghai",
  "task": "production",
  "sourceCommit": "40-character main commit",
  "promptIdentity": {
    "path": "research/runtime/worker-prompts/generated/production.prompt.md",
    "version": "2.13.0",
    "sha256": "64-character SHA-256"
  },
  "item": {
    "itemId": "Q-YYYYMMDD-01",
    "column": "digital-employee",
    "title": "English title",
    "articleBriefPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../article-brief.json",
    "argumentArchitecturePath": "research/runtime/production-work/YYYY/MM/DD/Q-.../argument-architecture.json",
    "figurePlanPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../figure-plan.json",
    "zhDraftPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../draft.zh.md",
    "enDraftPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../draft.en.md",
    "baselineCoverPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../baseline-cover.png"
  },
  "orderedItemIds": ["Q-YYYYMMDD-01", "Q-YYYYMMDD-02", "Q-YYYYMMDD-03"]
}
```

The five text artifacts and the request must already be durable on `main`. The baseline PNG and hashes are produced by Actions. `orderedItemIds` fixes checkpoint order and determines `nextItemId`.

## Batch staging request

```json
{
  "schema": "runtime-production-action-request/v1",
  "mode": "stage-batch",
  "date": "YYYY-MM-DD",
  "timezone": "Asia/Shanghai",
  "task": "production",
  "sourceCommit": "40-character main commit",
  "promptIdentity": {
    "path": "research/runtime/worker-prompts/generated/production.prompt.md",
    "version": "2.13.0",
    "sha256": "64-character SHA-256"
  },
  "candidateBatchSource": "research/runtime/production-work/YYYY/MM/DD/candidate-batch.json",
  "candidateBatchTarget": "research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json"
}
```

The source batch must be a complete `runtime-publication-candidate/v2` document. Its three candidates must correspond exactly to the three `Ready` checkpoint items. The bridge copies each verified work draft and baseline cover to the candidate's declared canonical `zhPath`, `enPath` and `coverPath`, writes the canonical candidate batch, runs:

- `runtime:production:checkpoint`;
- `publication:bundle:staged`;
- `publication:layout:validate`;
- `publication:editorial:validate`;
- `runtime:validate`.

Only after all validators pass may the workflow set checkpoint node `validators-passed` and commit the canonical bundle to `main`.

## Safety boundary

- A GitHub API-only Worker may write article work only under `production-work` and requests only under `production-action-requests`.
- It must not write partial members directly to canonical staging.
- The Actions Bridge never executes Publication and never changes a Runtime task to `Completed`.
- Production terminal completion still requires a same-date `runtime-shift-completion-request/v1` and successful `Research Runtime Shift Finalization V2.1`.
- A failed Actions run leaves the prior fetched-main checkpoint and candidate surfaces authoritative.
