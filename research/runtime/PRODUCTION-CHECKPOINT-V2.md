# Production Checkpoint Contract V2

## Purpose

Production is longer than a single reliable unattended ChatGPT task window. A Worker must therefore persist article-level progress before assembling the atomic Publication Candidate batch.

The canonical path is:

`research/runtime/checkpoints/YYYY/MM/YYYY-MM-DD-production.json`

New Production work on or after `2026-08-17` uses `runtime-production-checkpoint/v2`.

## Checkpoint model

The checkpoint contains one ordered item for every same-date Production-authorized Research Object:

```json
{
  "schema": "runtime-production-checkpoint/v2",
  "runDate": "YYYY-MM-DD",
  "node": "article-progress-persisted",
  "status": "Running",
  "promptIdentity": {
    "path": "research/runtime/worker-prompts/generated/production.prompt.md",
    "version": "2.12.0",
    "sha256": "..."
  },
  "items": [
    {
      "itemId": "Q-YYYYMMDD-01",
      "status": "Ready",
      "articleBriefPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../article-brief.json",
      "argumentArchitecturePath": "research/runtime/production-work/YYYY/MM/DD/Q-.../argument-architecture.json",
      "figurePlanPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../figure-plan.json",
      "zhDraftPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../draft.zh.md",
      "enDraftPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../draft.en.md",
      "baselineCoverPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../baseline-cover.png",
      "artifactHashes": {
        "research/runtime/production-work/.../article-brief.json": "sha256",
        "research/runtime/production-work/.../argument-architecture.json": "sha256"
      },
      "persistedAt": "ISO-8601"
    }
  ],
  "nextItemId": "Q-YYYYMMDD-02",
  "sourceCommit": "40-character commit SHA",
  "updatedAt": "ISO-8601"
}
```

Allowed item states are `Waiting`, `Planning`, and `Ready`. `Ready` means all six declared work artifacts exist, belong to the same date and item, and their SHA-256 values match the checkpoint.

## Durable execution rule

For each item, Production performs the following bounded segment:

1. create and validate Article Brief, Argument Architecture and Figure Plan;
2. write the Chinese and English pre-candidate drafts;
3. generate the deterministic baseline PNG into the item work directory;
4. calculate artifact hashes;
5. update the checkpoint item to `Ready`;
6. commit the work directory and checkpoint to `main`, fetch `main`, and verify both before starting the next item.

The Worker must stop before its admitted time budget expires. A non-terminal stop with at least one durable `Ready` item is recoverable progress, not completion.

## Recovery

Recovery reads only the same-date checkpoint from fetched `main`. It verifies every `Ready` item's paths and hashes, skips those items, and resumes at `nextItemId`.

Chat text, a local draft, an unverified commit, an empty control commit, or `Worker Claimed` alone is not article progress.

## Atomic candidate boundary

The `production-work` directory is checkpoint workspace and is not a Publication Candidate. Only after every item is `Ready` may Production copy the verified work artifacts into their canonical staging paths, create the completed same-date candidate batch, run all gates, and commit the final candidate bundle atomically.

The checkpoint workspace may be committed incrementally. Public or staging candidate visibility still begins only with the final completed batch commit.
