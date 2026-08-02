# Research OS Engine Production Test V1 — Release Checklist

## Content gate

- [x] Three Daily Research objects selected and completed.
- [x] Three Academic Observation objects selected and completed.
- [x] Six English notes created.
- [x] Six Simplified Chinese notes created.
- [x] Six dedicated covers created.
- [x] Every note includes a meaningful diagram, model, or evidence table.
- [x] Facts, source claims, and Research Center judgments are separated.
- [x] Limitations and Future Work are explicit.

## Metadata gate

- [x] `date` is valid.
- [x] `column` uses an accepted formal value.
- [x] `category` is `daily` or `academic`.
- [x] `summary` is present.
- [x] `sources` are present.
- [x] English and Chinese language links are paired.
- [x] Cover paths are present.

## Evidence gate

- [x] Primary sources are listed directly.
- [x] Vendor documentation is not represented as independent proof.
- [x] Historical benchmark figures are labeled by study/version.
- [x] Queue decisions are recorded.
- [x] Runtime sequence and branch commits are recorded.
- [x] File manifest is frozen.

## Repository gate

- [x] Production branch created from `main`.
- [x] Release package is additive.
- [x] Existing dynamic loader supports the metadata.
- [x] Pull-request validation workflow exists.
- [ ] Pull request opened.
- [ ] VitePress build passes.
- [ ] Changed files match the manifest.
- [ ] Squash merge to `main` succeeds.
- [ ] Main commit is fetched and verified.
- [ ] Published files are fetched from `main`.
- [ ] GitHub Pages deployment is observed or its pending boundary is recorded.

Unchecked items are completed at the publication gate and recorded in `REPORT.md`.