# Research OS Engine Production Test V1

## Purpose

Validate that Research OS Engine can execute a governed research workflow and publish the result through the GitHub-first Research Center pipeline.

## Package

- 3 Daily Research objects, one per formal column
- 3 Academic Observations, one per formal column
- 12 bilingual Markdown publications
- 6 dedicated SVG covers
- Queue, Runtime Record, Production Report, File Manifest, Release Checklist
- Additive release: no existing file is modified or deleted

## Research objects

### Daily

1. Digital Employee — computer-use action/state loop
2. Industry Architecture — A2A and MCP interoperability boundaries
3. Open-source Engineering — manager orchestration and handoff ownership

### Academic

1. Digital Employee — OSWorld and execution-based verification
2. Industry Architecture — NIST AI RMF operating loop
3. Open-source Engineering — SWE-bench Verified and benchmark quality

## Required release gates

- changed files match the frozen manifest
- `npm install` succeeds
- `npm run docs:build` succeeds
- bilingual metadata and covers are discoverable by the existing Research Notes loader
- PR is squash-merged to `main`
- resulting commit and representative files are fetched from `main`
- final evidence is written to `REPORT.md`

## Safety and evidence boundaries

- primary sources are used throughout
- vendor documentation is not represented as independent proof
- historical benchmark results are labeled by study/version
- no TMPA publication content is changed
- no existing Research Center file is deleted
