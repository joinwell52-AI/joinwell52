# Cover Upgrade Contract V1

## Status

This is a non-blocking post-Production quality contract. It is not a Production gate.

## Preconditions

- same-date Production is already durably `Completed`;
- the same-date `runtime-publication-candidate/v2` batch exists;
- the candidate already references a valid baseline PNG at `coverPath`.

## Upgrade rule

The 16:00 worker processes one article at a time. It may read the candidate identity, title, optional same-date Article Cover Brief and exact canonical `coverPath`. Before image generation, the effective image request contains only the positive article-specific visual scene.

An upgrade is accepted only if the generated asset is a real PNG/JPEG/WebP, clearly represents the article, is suitable at thumbnail scale, and is materially better than the current baseline.

## Binary persistence bridge

Accepted raster bytes must be persisted through the GitHub Git Data API bridge, not through a UTF-8 contents write and not through an external image host:

1. obtain the generated image as a real conversation/library file and materialize/read its raw bytes;
2. normalize to a web-safe raster when needed and encode the exact bytes as Base64;
3. call GitHub `create_blob` with `encoding=base64` to create a real binary blob;
4. fetch latest `main` immediately before commit construction;
5. create a tree based on the latest main tree with exactly the candidate's canonical `coverPath` pointing at the new binary blob (`mode=100644`, `type=blob`);
6. create a single fast-forward commit on the latest main parent and update `refs/heads/main` without force;
7. fetch the canonical `coverPath` from `main` with Base64 encoding and verify that its Git blob SHA equals the accepted blob SHA and that the decoded bytes are a valid raster;
8. only after that verification may the worker record the upgrade as successful and write the optional receipt.

The bridge must never write Base64 text into a `.png`, `.jpg`, `.jpeg` or `.webp` path. A generated report image, dashboard, poster, claimed SHA written inside an image, chat text, local file, unattached blob, unreferenced tree or unpushed commit is not persistence evidence.

If main advances between fetch and ref update, do not force. Re-fetch latest main and rebuild the tree/commit or preserve the baseline and stop that article according to the bounded attempt policy.

If generation, semantic review, technical validation, persistence or verification fails, the worker leaves the baseline file unchanged. It must not modify Production status/result, reopen Production, create a Production completion request, or make Publication ineligible.

## Receipt

A successful replacement may write `cover-upgrade-receipt/v1` under `research/runtime/cover-upgrades/YYYY/MM/DD/<itemId>.json` with: runDate, itemId, candidateBatchPath, coverPath, previousAssetSha256, upgradedAssetSha256, upgradedGitBlobSha, briefId when available, generationAttempts, semanticReview=PASS, editorialThumbnailReview=PASS, persistenceBridge=`github-git-data-base64-blob`, and createdAt.

The receipt is audit evidence only. Publication uses the current bytes at the candidate's canonical `coverPath` whether or not a receipt exists.
