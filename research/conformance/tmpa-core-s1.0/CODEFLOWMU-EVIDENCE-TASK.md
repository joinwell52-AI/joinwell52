# TASK — CodeFlowMu × TMPA Core S1.0 final evidence run

## Goal

Run CodeFlowMu against the exact TMPA Core S1.0 evidence-candidate bundle and produce the locked product evidence required for Implementation Case I1.0.

## Immutable input

- Repository: `joinwell52-AI/joinwell52`
- Branch: `agent/tmpa-s1.0-evidence-candidate`
- Normative candidate commit: `942cbb097eb3d662662f96a2269818ec9d7ca2ed`
- Core version: `S1.0`
- Reference result: `14 PASS / 0 FAIL`

Machine-readable schema SHA-256:

| File | SHA-256 |
|---|---|
| `governance-object.schema.json` | `a2829cd7149c3054a52886365f2293a23106b636b0c52799739bfabdab1ff4fa` |
| `lifecycle-profile.schema.json` | `481a61ac2485bbaf15d90e9c5a255ad9ce6a55971190f0fe404856be4b10f993` |
| `reader-result.schema.json` | `4527df7096fe840b85b245e50d5cea576ff359d50a54d17c8873a7b4f458d431` |
| `conformance-result.schema.json` | `4b1ecebf83e62d2aa1aff0e79a0cd0ea0a85fbc14a426d5fe873ab40aefdc2fe` |

Do not substitute `main`, S0.6 files, copied editor files, or regenerated inputs for this commit.

## Required execution

1. Record the CodeFlowMu repository path, current commit, intended release version, dirty-worktree state, Node/npm/OS and dependency lock digests.
2. Import the exact S1.0 schemas, profiles, fixtures and C01–C14 definitions from the immutable input commit.
3. Run CodeFlowMu's product Adapter/Reader path for C01–C14. The product Reader must be called; the TMPA Reference Reader must not be used as a substitute.
4. Run the relevant TMPA, protocol, Runtime and Shell regression suites. Preserve raw stdout/stderr and exit codes.
5. If a criterion fails, fix the product implementation without weakening S1.0, rerun, and retain the pre-fix result as history.
6. Verify canonical input hashes, bundle digest, result digest, manifest integrity and clean-machine reproducer.

## Acceptance gate

- C01–C14: `14 PASS / 0 PARTIAL / 0 NOT RUN / 0 FAIL`.
- Exact S1.0 candidate commit and all input hashes are recorded.
- CodeFlowMu version and implementation commit are fixed.
- FCoP protocol/reference implementation versions are fixed separately.
- `Specified / Implemented / Demonstrated / Independently Adopted` remain distinct.
- No claim of independent validation, universal conformance, theory proof, or hallucination elimination.

## Deliverables

Create:

```text
tmpa-i1.0-codeflowmu-<version>-s1.0-evidence-20260810.zip
tmpa-i1.0-codeflowmu-<version>-s1.0-evidence-20260810.zip.sha256
```

The ZIP must contain README, run identity, input manifest and hashes, raw C01–C14 results, aggregate result, test logs, environment record, CodeFlowMu/FCoP revision records, relevant patch/diff, reproducer instructions, internal manifest and SHA-256 checksums.

Return the two files to the TMPA publication maintainer. Do not edit A1.0/S1.0/I1.0 publication pages, create the TMPA V1.0 tag, or claim DOI/public release from the CodeFlowMu worktree.
