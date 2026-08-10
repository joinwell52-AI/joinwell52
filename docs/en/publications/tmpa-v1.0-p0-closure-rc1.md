---
title: TMPA V1.0 P0 Closure Record - RC1
outline: deep
---

# TMPA V1.0 P0 Closure Record

**Record:** RC1  
**Date:** 2026-08-10  
**Reviewed baseline:** A0.9 / S0.6 / I0.8  
**Decision:** **P0-01 through P0-04 closed; ready for final promotion review.**

This record closes the four blockers identified by [Release Readiness Audit RA1](./tmpa-v1.0-release-readiness-audit). It does not itself promote the documents to V1.0, create a Git tag, mint a DOI or assert independent validation.

## Closure matrix

| Blocker | Closure | Evidence |
|---|---|---|
| P0-01 exact S0.6 product registration | Closed | Dated I0.8 external-run register fixes Core and implementation commits, package SHA-256, input-bundle digest, result digest and 14/14 verdict. The frozen 2026-08-09 `NOT RUN` record remains historical. |
| P0-02 implementation-source fixation | Closed by claim boundary | The live CodeFlowMu browser is illustrative only; reproducible claims use locked I0.8. XiaoDian is author-reported lineage only and is excluded from the evaluated corpus, RQ results and conformance claims. |
| P0-03 TMPA citation metadata | Closed for RC1 | Six language-specific CFF records, one BibTeX file and a release identity record align the three works and two language editions. DOI, ORCID and final license confirmation remain explicit promotion decisions. |
| P0-04 immutable dossier | Closed for RC1 | Six PDF artifacts, six Markdown sources, bilingual notes, build record, manifest, checksums and a downloadable ZIP were generated and verified. |

## Download

- [TMPA V1.0 RC1 publication dossier ZIP](/releases/tmpa/tmpa-v1.0-rc1-publication-dossier.zip)
- [ZIP SHA-256](https://joinwell52-ai.github.io/joinwell52/releases/tmpa/tmpa-v1.0-rc1-publication-dossier.zip.sha256)
- [RC1 manifest](/releases/tmpa/v1.0-rc1/MANIFEST.json)
- [RC1 checksums](https://joinwell52-ai.github.io/joinwell52/releases/tmpa/v1.0-rc1/SHA256SUMS)
- [English release notes](https://joinwell52-ai.github.io/joinwell52/releases/tmpa/v1.0-rc1/RELEASE-NOTES.en.md)
- [Chinese release notes](https://joinwell52-ai.github.io/joinwell52/releases/tmpa/v1.0-rc1/RELEASE-NOTES.zh.md)

The outer ZIP SHA-256 is:

```text
6575875a1af827cbfcdaa6f0ace0d8b6ad8e7f9fdf6cfc98022f80b6e74481ed
```

## Validation

- six PDFs rendered successfully, including CJK font verification;
- all 24 entries in `SHA256SUMS` passed;
- the outer ZIP checksum and ZIP integrity passed;
- all six CFF files parsed and retained required identity fields;
- `run.json`, `release.json`, `BUILD.json` and `MANIFEST.json` parsed as strict JSON;
- the exact I0.8 evidence archive remains separately available under the Implementation Case.

## Remaining promotion decisions

Before A1.0/S1.0/I1.0, tag and DOI creation, the author must explicitly confirm the public identity/ORCID, final license, Zenodo deposit structure and submission packaging. Until then, A0.9/S0.6/I0.8 remain the official versions.
