# Public evidence: interrupted-task takeover

Research: 2026-09-01. Public packaging: 2026-09-02. Tested baseline: `919c3b48cba31e376b45e60506fa14e4bbcfcb23`.

This bundle contains **transcriptions of preserved research records, a portable template of the original research fixture, and provenance**. No product test was rerun for this publication. The retained materials contain commands, aggregate results, and observation tables, not complete line-by-line stdout. No raw log is reconstructed and no author record is presented as independent QA.

## Files and claims

- `observations.json`: RA-4/RA-5, RA-7/RA-8, DC-1–DC-4; RUN-004's 57 pass / 0 fail / 0 skipped and seven test paths. Do not sum different suites into a reliability score.
- `sources.json`: baseline and dated primary-source verification. AG2 #3222 and Paperclip #12616 are merged; Paperclip remains experimental and default-off.
- `probe-template.ts.txt`: original research tests with only the machine-specific import root replaced by `__CODEFLOWMU_BASELINE__`. Assertions, synthetic values, and logic are unchanged. The historical input `quarantine` is preserved; the public frozen contract uses `hold_for_review`.
- `check.mjs`: validates recorded relationships and file hashes; it does not run the Runtime.
- `manifest.json`: SHA-256 inventory, not an independent witness.

## Public check

Download and extract the complete ZIP, then run:

```text
node check.mjs
```

Expected: PASS and exit code 0. This validates internal consistency and integrity relative to the manifest, not product behavior.

## Product rerun requires authorized source

A rerun requires the fixed baseline and installed dependencies. Verify the existing sole product root `D:\codeflowmu` read-only first. This bundle does not authorize checkout, overwriting local changes, or making another product copy. Stop on a version mismatch rather than calling a newer run a historical reproduction.

An authorized operator can replace the template import token with that verified root and save a research test file for the existing tsx environment. The fixture calls real SessionManager/Dispatcher paths with an in-memory SDK and synthetic FCoP artifacts in test-isolated directories. RA-7/RA-8 use supplied synthetic effect claims and zero backoff. RUN-004's file list is recorded in `observations.json`. Any rerun is a new experiment and must preserve its own raw output.

## Limits

No physical power loss, remote effect, browser E2E, or independent QA. Identical inbox restoration only shows that the tested path did not distinguish the supplied effect semantics; it does not establish production duplication. The 57 existing tests establish component boundaries, not formal frozen-contract IA-1–IA-12 or DC-1–DC-3 acceptance.
