# TMPA Core S0.4 Conformance Corpus

This directory is the public, executable corpus used by TMPA Implementation Case I0.4. It replaces the unavailable local-only archive described by I0.3.

## Scope

The corpus produces two separate results:

1. **Reference Reader result:** tests the author-produced S0.4 read-only implementation against synthetic, deterministic C01–C14 fixtures.
2. **Product-baseline result:** re-adjudicates the pinned I0.3 FCoP, CodeFlowMu, and XiaoDian AI evidence under the stricter S0.4 assertion and verdict rules.

The Reference Reader result does not convert itself into evidence that FCoP or CodeFlowMu is fully conformant. The product-baseline result is the product claim.

## Fixed run

```bash
npm install
TMPA_EXECUTED_AT=2026-08-03T20:00:00Z npm run tmpa:s0.4:conformance
```

The runner validates the four published S0.4 JSON Schemas, validates the lifecycle Profile, executes every reference fixture, evaluates the product-evidence assertions, applies the S0.4 verdict algorithm, and regenerates `artifacts/`.

## Results

| Track | PASS | PARTIAL | NOT RUN | FAIL | Aggregate |
|---|---:|---:|---:|---:|---|
| S0.4 Reference Reader | 14 | 0 | 0 | 0 | PASS |
| FCoP–CodeFlowMu product baseline | 1 | 9 | 4 | 0 | PARTIAL |

The product PASS is C14. C01–C07, C09, and C13 are PARTIAL. C08 and C10–C12 are NOT RUN at product-reader level. C06 was PASS in the S0.3 baseline but becomes PARTIAL under S0.4 because the preserved product evidence does not emit both required canonical outcomes: `ILLEGAL_TRANSITION`/`invalid` and `LIFECYCLE_UNDETERMINED`/`undetermined`.

## External evidence

- FCoP `3.2.4` commit `da79dfefd99f597c9e422ce9edec22157f915a21` was retrieved from the public repository and rerun: 1,137 passed, 2 skipped, 0 failed.
- CodeFlowMu `V1.2.3` commit `8f342d028eb66e77d135bea58fdbc7f2d0627e3b` is not present in the public `CodeFlowMu-open` history. A fresh product run is therefore NOT RUN; the corpus re-adjudicates preserved I0.3 evidence only.
- XiaoDian AI remains private field evidence and is not represented as a public reproducible build.

## Evidence maturity

- S0.4 Reference Reader: **implemented** and **demonstrated** by the authors.
- FCoP–CodeFlowMu product baseline: mixed implemented/demonstrated evidence with aggregate **PARTIAL** verdict.
- Independent adoption or validation: **not established**.

`artifacts/file-manifest.json` records the corpus files and digests. Each `artifacts/criteria/Cxx.json` preserves its executable manifest, expected assertions, actual Reference Reader output, product-evidence assertions, and both verdicts.
