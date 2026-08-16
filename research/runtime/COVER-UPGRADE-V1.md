# Cover Upgrade Contract V1

## Status

This is a non-blocking post-Production quality contract. It is not a Production gate.

## Preconditions

- same-date Production is already durably `Completed`;
- the same-date `runtime-publication-candidate/v2` batch exists;
- the candidate already references a valid baseline PNG at `coverPath`.

## Execution architecture

The 16:00 Cover Upgrade wake is a controller wake. The controller must not call image generation directly.

For every eligible same-date candidate, the controller creates exactly one fresh isolated Article Cover Image Job. Each job handles exactly one article and follows `research/runtime/COVER-UPGRADE-ARTICLE-JOB-V1.json`.

A single ChatGPT image-generation context must never process two different articles. An Article Cover Image Job must never reuse another article's generated image, prompt, brief, retry history or visual context.

If the platform cannot create a fresh isolated Article Cover Image Job, do not fall back to in-controller or multi-article image generation. Preserve the current baseline for that article.

## Article-specific visual input

Prefer the candidate's valid same-date Article Cover Brief when it exists.

If the same-date Article Cover Brief is absent, that absence alone does not cancel the upgrade attempt. Derive one concise positive visual brief only from this article's own candidate title, subtitle/research question and same-date Research Object identity.

Before image generation, the effective image handoff contains only positive article-specific visual semantics: article title, core proposition, one unique visual metaphor, hero subject, environment/composition, palette/lighting/material/depth direction and the landscape editorial-cover requirement.

The image handoff must not contain Runtime state, Scheduler/control text, repository or GitHub details, worker/controller identity, Cover Upgrade task language, baseline/replacement wording, verification/status language, report/dashboard/before-after/receipt/evidence wording, another article's content, or prior failed prompts/images.

## Upgrade rule

An upgrade is accepted only if the generated asset is a real PNG/JPEG/WebP, clearly represents the article, is suitable at thumbnail scale, and is materially better than the current baseline.

The accepted asset must be the original generated raster file, not a conversation preview, UI thumbnail, screenshot, report composite or downscaled derivative. Before persistence, decode the actual file and verify width >= 1536, height >= 864 and aspect ratio approximately 16:9 (absolute ratio error <= 0.02). A smaller preview must be rejected even when it looks semantically correct.

## Binary persistence bridge

Accepted raster bytes must be persisted through the GitHub Git Data API bridge, not through a UTF-8 contents write and not through an external image host:

1. obtain the original generated image as a real conversation/library file and materialize/read its raw bytes;
2. decode and verify the real raster dimensions and format before upload; reject previews/thumbnails smaller than the upgrade minimum;
3. normalize only when needed to a web-safe raster that still satisfies width >= 1536, height >= 864 and approximately 16:9, then encode the exact bytes as Base64;
4. call GitHub `create_blob` with `encoding=base64` to create a real binary blob;
5. fetch latest `main` immediately before commit construction;
6. create a tree based on the latest main tree with exactly the candidate's canonical `coverPath` pointing at the new binary blob (`mode=100644`, `type=blob`);
7. create a single fast-forward commit on the latest main parent and update `refs/heads/main` without force;
8. fetch the canonical `coverPath` from `main` with Base64 encoding and verify that its Git blob SHA equals the accepted blob SHA; decode the fetched bytes again and verify valid raster format, width >= 1536, height >= 864 and approximately 16:9;
9. only after that remote byte-and-dimension verification may the worker record the upgrade as successful and write the optional receipt.

The bridge must never write Base64 text into a `.png`, `.jpg`, `.jpeg` or `.webp` path. A generated report image, dashboard, poster, claimed SHA written inside an image, chat text, local file, preview/thumbnail, unattached blob, unreferenced tree or unpushed commit is not persistence evidence.

If main advances between fetch and ref update, do not force. Re-fetch latest main and rebuild the tree/commit or preserve the baseline and stop that article according to the bounded attempt policy.

If generation, semantic review, technical validation, persistence or verification fails, the worker leaves the baseline file unchanged. It must not modify Production status/result, reopen Production, create a Production completion request, or make Publication ineligible.

## Released-article synchronization

If the candidate has already been publicly released for the same run date, resolve that released item's exact public cover path from the same-date `runtime-publication-release/v1` manifest. Update the canonical staging `coverPath` and the exact public cover path to the same accepted binary blob in one fast-forward tree/commit. Do not modify article prose, indexes, Runtime terminal state or unrelated public assets. Verify both paths from latest main before reporting the upgrade durable.

The public cover path must therefore resolve to the exact same verified full-resolution blob as the staging `coverPath`; Publication or post-publication synchronization must never substitute a generated preview or independently downscaled copy.

## Receipt

A successful replacement may write `cover-upgrade-receipt/v1` under `research/runtime/cover-upgrades/YYYY/MM/DD/<itemId>.json` with: runDate, itemId, candidateBatchPath, coverPath, previousAssetSha256, upgradedAssetSha256, upgradedGitBlobSha, briefId when available, generationAttempts, semanticReview=PASS, editorialThumbnailReview=PASS, width, height, persistenceBridge=`github-git-data-base64-blob`, executionMode=`fresh-article-job`, and createdAt.

The receipt is audit evidence only. Publication uses the current bytes at the candidate's canonical `coverPath` whether or not a receipt exists.
