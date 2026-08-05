# TMPA Core S0.5 Conformance Corpus

This directory is the public, executable S0.5 corpus derived from the complete FCoP protocol repository at tag v3.2.5 and the preserved CodeFlowMu/XiaoDian evidence. It keeps protocol sources separate from the `fcop` / `fcop-mcp` reference implementation and is separate from the S0.4 corpus reported by Implementation Case I0.5.

## Scope

The corpus produces two separate results:

1. **Reference Reader result:** tests the author-produced S0.5 read-only implementation against synthetic, deterministic C01–C14 fixtures.
2. **Product-baseline result:** evaluates the pinned `fcop` / `fcop-mcp` v3.2.5 reference implementation together with the preserved CodeFlowMu and XiaoDian AI evidence under the stricter S0.5 assertion and verdict rules.

The Reference Reader result does not convert itself into evidence that FCoP or CodeFlowMu is fully conformant. The product-baseline result is the product claim.

## Fixed run

```bash
npm install
TMPA_EXECUTED_AT=2026-08-05T09:00:00Z npm run tmpa:s0.5:conformance
```

The runner validates the four published S0.5 JSON Schemas, validates the lifecycle Profile, executes every reference fixture, evaluates the product-evidence assertions, applies the S0.5 verdict algorithm, and regenerates `artifacts/`.

## Results

| Track | PASS | PARTIAL | NOT RUN | FAIL | Aggregate |
|---|---:|---:|---:|---:|---|
| S0.5 Reference Reader | 14 | 0 | 0 | 0 | PASS |
| FCoP–CodeFlowMu product baseline | 1 | 8 | 4 | 1 | FAIL |

The product PASS is C14. C02 is FAIL because the executed `fcop` / `fcop-mcp` v3.2.5 parent-field roundtrip test failed. C01, C03–C07, C09, and C13 are PARTIAL. C08 and C10–C12 are NOT RUN at product-reader level. The aggregate is therefore FAIL even though most tested reference-implementation paths passed. This is an implementation finding, not a failure of the FCoP protocol.

## External evidence

- FCoP protocol repository tag `v3.2.5`, commit `b3dc23439c6aaa6a6b3765655b87e5924e0257f9`, was retrieved. Its `fcop` and `fcop-mcp` reference-implementation tests were rerun: 1,222 passed, 2 skipped, 3 failed. The failures are the parent-field readback test and two reference-implementation API/MCP surface snapshots that omitted the new optional `parent` parameter.
- CodeFlowMu `V1.2.3` commit `8f342d028eb66e77d135bea58fdbc7f2d0627e3b` is not present in the public `CodeFlowMu-open` history. A fresh product run is therefore NOT RUN; the corpus re-adjudicates preserved I0.3 evidence only.
- XiaoDian AI remains private field evidence and is not represented as a public reproducible build.

## Evidence maturity

- S0.5 Reference Reader: **implemented** and **demonstrated** by the authors.
- FCoP-reference-implementation–CodeFlowMu product baseline: mixed implemented/demonstrated evidence with aggregate **FAIL** verdict because one executed mandatory S0.5 assertion failed.
- Independent adoption or validation: **not established**.

`artifacts/file-manifest.json` records the corpus files and digests. Each `artifacts/criteria/Cxx.json` preserves its executable manifest, expected assertions, actual Reference Reader output, product-evidence assertions, and both verdicts.
