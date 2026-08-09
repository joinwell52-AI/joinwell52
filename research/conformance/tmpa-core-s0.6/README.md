# TMPA Core S0.6 Release-Candidate Corpus

This directory is the public executable corpus for TMPA Core S0.6. It freezes the machine schemas, lifecycle and canonicalization profiles, author-produced Reference Reader, and C01–C14 fixtures as one exact-version bundle.

## Fixed run

```bash
npm ci
TMPA_EXECUTED_AT=2026-08-09T23:55:00Z npm run tmpa:s0.6:conformance
```

The runner compiles all four JSON Schemas, validates the lifecycle Profile, executes every Reference Reader fixture, evaluates the explicit product `NOT RUN` record, and regenerates `artifacts/` with deterministic manifests and digests.

## Results

| Track | PASS | PARTIAL | NOT RUN | FAIL | Aggregate |
|---|---:|---:|---:|---:|---|
| S0.6 Reference Reader | 14 | 0 | 0 | 0 | PASS |
| S0.6 product baseline | 0 | 0 | 14 | 0 | NOT RUN |

Reference Reader PASS demonstrates only the tested S0.6 paths. It does not establish product conformance or independent validation. I0.7 and CodeFlowMu V1.4.1 remain S0.5 author-run evidence and are not relabeled.

## Release-candidate deltas from S0.5

- Byte-identical observations project one node while retaining every contributing `source_id`.
- Human approval requires a permitted object type, an assigned authorized role, and an independent actor when the Profile requires one.
- Canonical object-key, identifier, node, edge, issue, and retained-source ordering uses Unicode code-point order, not locale-sensitive collation.
- The canonicalization Profile is a separate machine-readable input with its own version and digest.
- C03, C07, and C11 include regression assertions for these behaviors.

See `RELEASE-AUDIT.md` for the bilingual release audit and evidence boundary.
