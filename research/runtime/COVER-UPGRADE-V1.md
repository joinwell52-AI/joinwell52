# Cover Upgrade Contract V1

## Status

This is a non-blocking post-Production quality contract. It is not a Production gate.

## Preconditions

- same-date Production is already durably `Completed`;
- the same-date `runtime-publication-candidate/v2` batch exists;
- the candidate already references a valid baseline PNG at `coverPath`.

## Upgrade rule

The 16:00 worker processes one article at a time. It may read the candidate identity, title, optional same-date Article Cover Brief and exact canonical `coverPath`. Before image generation, the effective image request contains only the positive article-specific visual scene.

An upgrade is accepted only if the generated asset is a real PNG/JPEG/WebP, clearly represents the article, is suitable at thumbnail scale, and is materially better than the current baseline. The worker then normalizes/persists the accepted raster to the exact existing canonical `coverPath` and verifies the durable bytes on `main`.

If generation, semantic review, technical validation, persistence or verification fails, the worker leaves the baseline file unchanged. It must not modify Production status/result, reopen Production, create a Production completion request, or make Publication ineligible.

## Receipt

A successful replacement may write `cover-upgrade-receipt/v1` under `research/runtime/cover-upgrades/YYYY/MM/DD/<itemId>.json` with: runDate, itemId, candidateBatchPath, coverPath, previousAssetSha256, upgradedAssetSha256, briefId when available, generationAttempts, semanticReview=PASS, editorialThumbnailReview=PASS, and createdAt.

The receipt is audit evidence only. Publication uses the current bytes at the candidate's canonical `coverPath` whether or not a receipt exists.
