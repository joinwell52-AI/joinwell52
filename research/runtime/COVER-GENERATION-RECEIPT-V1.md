# Isolated Article Cover Generation Contract V1

## Purpose

Article Cover image generation is executed outside the Research Runtime Production conversation. Production owns article writing, Cover Brief creation, candidate assembly and every final gate. The isolated cover worker owns only one article-cover generation request at a time.

This boundary exists because a cloud image tool can absorb surrounding conversation context even when the immediate image prompt is article-only. The isolated worker invocation therefore must not receive Runtime, Scheduler, recovery, checkpoint, GitHub, completion-report, batch, dashboard or other control-plane narrative.

## Canonical paths

For one eligible Research Object:

```text
research/runtime/production-work/YYYY/MM/DD/<itemId>/cover-brief.json
research/runtime/production-work/YYYY/MM/DD/<itemId>/accepted-cover.png|webp|jpg|jpeg
research/runtime/production-work/YYYY/MM/DD/<itemId>/cover-generation-receipt.json
```

The accepted cover is a pre-candidate Production asset. Production copies the verified raster bytes into the candidate's canonical `staging/publication-candidates/...-cover.*` path only when it assembles the atomic candidate bundle.

## Article Cover Brief

The brief uses `article-cover-brief/v1` and is persisted by Production before image generation. It contains only article-level visual semantics plus destination metadata:

```json
{
  "schema": "article-cover-brief/v1",
  "runDate": "YYYY-MM-DD",
  "itemId": "Q-...",
  "briefId": "YYYY-MM-DD:Q-...:cover-v1",
  "sanitizedPrompt": "Positive article-only physical scene plus rich editorial art direction.",
  "reviewExclusions": ["post-generation review criteria only"],
  "acceptedAssetPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../accepted-cover.png",
  "receiptPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../cover-generation-receipt.json"
}
```

`sanitizedPrompt` contains one dominant visual metaphor plus hero subject, environment, foreground/midground/background depth, camera framing, refined material language, cinematic key/rim/volumetric lighting, restrained palette, atmospheric depth, sophisticated technology-editorial composition, intentional negative space and thumbnail-scale focal clarity. Review exclusions are never appended to the image prompt.

## Isolated worker input boundary

The isolated cover worker is a separate invocation/context. For one article it may read only:

1. that article's `cover-brief.json`;
2. this contract;
3. the minimum destination metadata already inside the brief.

It must not read the Runtime record, Production result, recovery history, Scheduler, Worker Control, generated Production Prompt, article body, another article's brief, batch metadata, GitHub status or any completion/report text before image generation.

The image tool receives exactly the positive `sanitizedPrompt`. The worker may inspect the resulting image and retry within the governed attempt limit, but retry text must remain a newly composed positive article scene and must not describe the failed output or surrounding Runtime context.

## Receipt contract

After accepting a real raster image, the isolated worker persists `cover-generation-receipt/v1`:

```json
{
  "schema": "cover-generation-receipt/v1",
  "status": "Accepted",
  "workerContext": "isolated-cover-worker",
  "runDate": "YYYY-MM-DD",
  "itemId": "Q-...",
  "briefId": "YYYY-MM-DD:Q-...:cover-v1",
  "briefPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../cover-brief.json",
  "briefSha256": "64 lowercase hex characters",
  "sanitizedPrompt": "Exact positive prompt actually sent to image generation.",
  "generationAttempts": 1,
  "acceptedAssetPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../accepted-cover.png",
  "assetSha256": "64 lowercase hex characters",
  "semanticReview": "PASS",
  "editorialThumbnailReview": "PASS",
  "createdAt": "ISO-8601 timestamp"
}
```

The receipt and accepted asset are committed and remotely verified before Production consumes them.

## Production consumption gate

For Production dates on or after 2026-08-15, a cover cannot pass merely because a raster file exists. Production must verify all of the following:

- brief, receipt and accepted asset belong to the same `runDate` and `itemId`;
- `briefId` matches exactly and is date-bound;
- `briefSha256` equals the current Cover Brief bytes;
- receipt `sanitizedPrompt` equals the brief's positive `sanitizedPrompt` and contains no Runtime/control/exclusion contamination;
- `generationAttempts` is within the governed 1..3 range;
- `semanticReview=PASS` and `editorialThumbnailReview=PASS`;
- accepted asset is a real PNG, JPEG or WebP under the same item's Production-work directory;
- `assetSha256` equals the accepted asset bytes;
- the candidate cover copied by Production is byte-identical to the accepted asset;
- receipt and candidate cover are bound into Production result/checkpoint artifacts.

Stale, prior-date, unmatched, non-raster, missing or failed receipts are rejected. No prose claim can substitute for the receipt.

## Authority boundary

A receipt proves only that the isolated cover worker accepted one article-specific raster asset under this contract. It does not complete Production. Production still owns Research Value, Independence, Evidence, Structure, Language, Bilingual Consistency, Cover, Inline Visual, Layout, candidate-bundle, validator and terminal-proof gates.

Inline Figures remain optional `0..N` article-body assets and are not part of this isolated Article Cover contract.

## Production preparation bundle

The 15:00 Production Preparation wake persists `research/runtime/production-work/YYYY/MM/DD/prepared-bundle.json` using `production-prepared-bundle/v1`. It contains the complete same-date semantic Production decision before raster covers exist: one item per eligible Research Object, pre-candidate Chinese and English draft paths, final staging article/cover paths, current Cover Brief and expected Receipt paths, complete candidate metadata with all non-cover gates decided by Production Preparation, and a meaningful `resultBase`. Production then persists checkpoint node `awaiting-isolated-covers` and leaves the formal Production shift open.

## Deterministic cover finalization

After all required same-date receipts are durable, `.github/workflows/research-production-cover-finalization.yml` runs `scripts/runtime-production-cover-finalize.mjs`. The script performs no research or writing. It validates every current brief/receipt/asset binding, copies the already-prepared bilingual drafts and accepted raster bytes into final staging paths, creates the completed candidate batch, advances the checkpoint to `validators-passed`, writes the prepared Production result as `Completed`, and creates the governed Production completion request. The workflow runs bundle, layout, editorial, Production proof and Runtime validators before committing. The existing Shift Finalization workflow then persists the terminal transition and remote verification. No additional ChatGPT wake is used.
