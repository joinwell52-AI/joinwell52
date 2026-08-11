# TMPA Core S1.0 Stable Corpus

This directory is the public executable corpus for TMPA Core S1.0. It freezes the machine schemas, lifecycle and canonicalization profiles, author-produced Reference Reader, and C01–C14 fixtures as one exact-version bundle.

## Fixed run

```bash
npm ci
TMPA_EXECUTED_AT=2026-08-10T23:55:00Z npm run tmpa:s1.0:conformance
```

The runner compiles all four JSON Schemas, validates the lifecycle Profile, executes every Reference Reader fixture, evaluates the explicit product `NOT RUN` record, and regenerates `artifacts/` with deterministic manifests and digests.

## Results

| Track | PASS | PARTIAL | NOT RUN | FAIL | Aggregate |
|---|---:|---:|---:|---:|---|
| S1.0 Reference Reader | 14 | 0 | 0 | 0 | PASS |
| S1.0 product baseline | 0 | 0 | 14 | 0 | NOT RUN |

The table above is the immutable baseline produced by the frozen S1.0 candidate commit. Reference Reader PASS demonstrates only the tested reference paths; the baseline product row remains historical and is not rewritten.

A later external exact-version run is registered under `external-runs/20260811-codeflowmu-v1.8.0/`. CodeFlowMu V1.8.0 executed its product `GovernanceReader.readSync` against the candidate commit `942cbb097eb3d662662f96a2269818ec9d7ca2ed` and reported **14 PASS / 0 PARTIAL / 0 NOT RUN / 0 FAIL**. The evidence package is author-run demonstrated evidence, not independent validation or independent adoption.

## Stable-release continuity from S0.6

- S1.0 preserves the S0.6 normative behavior and promotes it to the stable publication line.
- Machine-readable identifiers and version constraints are reissued as S1.0 and are tested by the S1.0 Reference Reader.
- The S0.6 exact product run remains predecessor evidence and is not relabeled.
- The dated V1.8.0 registration is the first exact S1.0 product run; it is reported separately so the candidate baseline remains reproducible.

See `RELEASE-AUDIT.md` for the bilingual release audit and evidence boundary.
