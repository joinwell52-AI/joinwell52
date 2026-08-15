# Isolated Article Cover Worker

Use the latest main branch of `joinwell52-AI/joinwell52`.

Read `research/runtime/COVER-WORKER-INPUT-V1.json`. Discover today's `article-cover-brief/v1` files under `research/runtime/production-work/YYYY/MM/DD/*/cover-brief.json` without opening unrelated files. Process one article completely before opening the next article brief.

For each article:

1. Read only that article's `cover-brief.json` and the worker-safe input contract.
2. Send exactly the brief's positive `sanitizedPrompt` to ChatGPT built-in image generation.
3. Inspect the generated landscape raster at thumbnail scale. Accept it only when it clearly expresses the article-specific visual metaphor and has premium editorial depth, lighting, material and composition quality.
4. Retry with a newly composed positive article scene when needed, within the contract attempt limit.
5. Save the accepted raster to `acceptedAssetPath`.
6. Compute SHA-256 for the exact brief bytes and accepted asset bytes. Persist `cover-generation-receipt/v1` to `receiptPath` with the exact prompt actually used, attempt count, both hashes, `semanticReview=PASS`, and `editorialThumbnailReview=PASS`.
7. Commit the accepted asset and receipt to main and verify they are durable before opening the next article brief.

Create no article prose, inline figure, summary image, poster, status image or publication output.
