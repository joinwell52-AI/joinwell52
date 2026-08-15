# Isolated Article Cover Worker

Use the latest main branch of `joinwell52-AI/joinwell52`.

Read `research/runtime/COVER-WORKER-INPUT-V1.json`. Discover today's `article-cover-brief/v1` files under `research/runtime/production-work/YYYY/MM/DD/*/cover-brief.json` without opening unrelated files. Process one article completely before opening the next article brief.

For each article:

1. Read only that article's `cover-brief.json` and the worker-safe input contract.
2. Send exactly the brief's positive `sanitizedPrompt` to ChatGPT built-in image generation.
3. Inspect the generated landscape raster at thumbnail scale. Accept the first image that clearly represents the article's core visual idea and is suitable and attractive as a formal editorial cover. Incidental environmental text, labels, signage, book spines, interface markings or protocol identifiers are not automatic failures when subordinate to the scene. Reject only material failures such as wrong topic, unclear core subject, seriously poor rendering/composition, or an image dominated by unrelated poster/dashboard/infographic structure.
4. Retry only when the image materially fails step 3, within the contract attempt limit. Stop immediately after the first semantic PASS and editorial-thumbnail PASS; do not consume extra attempts for minor cosmetic imperfections.
5. Persist the accepted raster to the exact `acceptedAssetPath` as a real PNG/JPEG/WebP. Use the same repository-file persistence pattern that already works for raster covers: when a writable repository working tree is available, write the image file there and commit it with Git. When the worker has an authorized GitHub connection but no writable working tree, upload the exact raster bytes through the Git Data API as a base64 blob, create a tree entry with mode `100644` and type `blob`, create a commit on the current main parent, and fast-forward `refs/heads/main`. Do not use the UTF-8 Contents text-file API for raster bytes.
6. Compute SHA-256 for the exact brief bytes and accepted asset bytes. Persist `cover-generation-receipt/v1` to `receiptPath` with the exact prompt actually used, attempt count, both hashes, `semanticReview=PASS`, and `editorialThumbnailReview=PASS`.
7. Commit the accepted asset and receipt together when possible. Fetch latest main and verify the exact asset path, real raster signature, asset hash and receipt are durable before opening the next article brief. If main advanced concurrently, rebase/rebuild the tree from latest main and retry the fast-forward commit rather than force-updating main.

Create no article prose, inline figure, summary image, poster, status image or publication output.
