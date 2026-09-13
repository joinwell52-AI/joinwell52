# Execution boundaries and artifact continuity: public evidence

Study: 2026-09-06. Publication authorized: 2026-09-07. Fixed CodeFlowMu baseline: `c008d9db91a21136fc61a4f60314e22db395d5d2`. This is not security certification, independent QA, or development authorization.

[中文](README.zh.md) · [All observations](observations.json) · [Versions and original-record hashes](provenance.json)

## Claims, observations, and limits

| ID | Matching observations in two rounds | Scope |
| --- | --- | --- |
| A0 | 1 effect; replay rejected | Single consumption at the tested boundary |
| A1 | Pending cancellation accepted; 0 effects | No token had been issued; not revocation of approved authorization |
| A2 | Pending request expires; approval rejected | Pending-review deadline |
| A3 | Review deadline at second 30; successful execution at second 31 | Intended approved-token behavior, not expiry bypass |
| A4 | Cancel rejected while callback waits; 1 effect after release | APPROVAL_NOT_PENDING, not successful cancellation |
| A5 | Cancel still rejected; research-only abort check prevents effect | Not a newly implemented product guard |
| A6 | Effect happens before rejected cancellation during completion | 1 effect remains; not rollback |
| B0 | Same request, same digest | Within a fixture; different rounds have different directories and need not have identical hashes |
| B1 | Changed target yields APPROVAL_STALE, 0 effects | Recomputed input; not an end-to-end guarantee against all concurrent changes |
| B2 | Same content, another workspace: different operation digest | Content identity does not replace location |
| B3 | Another task: different operation digest | Task binding |
| B4 | New-process digest matches; rename preserves bytes while original path is absent and history stays successful | Three points for one artifact; no power-loss, remote-sync, or acceptance test |
| Adapter normal | 1 approval reply per round | Real adapter, fake process transport |
| Adapter cancel-during-async-resolution | 0 replies per round | Final-send protection, not a real host's post-lock guard |
| Adapter request-after-cancel | 0 replies per round | Late-request protection, not OS process termination |

Twelve service/workspace scenarios × two rounds = 24 observations. Three adapter scenarios × two rounds = six observations. Not 30 distinct scenarios or a security accuracy metric. Two existing test files ran twice, with 39 pass / 0 fail / 0 skip per round. Counts are not combined into product coverage.

## Check published records

Download and extract the full ZIP, enter the evidence directory, and run:

```sh
node check.mjs
```

Only Node is required. It checks all 30 exported observations, controls, baseline logs, and file hashes. It does not invoke a model, rerun the product, or write to product directories. Hashes detect changes relative to this manifest; they are not external signature authentication.

## Rerun product probes

Product source is not included. You need authorized access to the fixed source baseline and its installed dependencies, including the existing tsx loader. Set `CODEFLOWMU_SOURCE_ROOT`, then use, for example:

```sh
CODEFLOWMU_SOURCE_ROOT=/path/to/authorized/source node --import /path/to/authorized/source/node_modules/tsx/dist/loader.mjs probe-boundaries.mjs
CODEFLOWMU_SOURCE_ROOT=/path/to/authorized/source node --import /path/to/authorized/source/node_modules/tsx/dist/loader.mjs probe-adapter.mjs
```

These are POSIX-shell examples. On Windows use the equivalent environment-variable setup and a file-URL loader path; resolve the loader against your actual dependency installation. The original study ran on Windows, not as cross-platform acceptance.

The public probes are mechanically adapted from the executed scripts: hardcoded product paths become environment-configured dynamic imports, and the adapter probe creates its fixtures directory for standalone use. New runs write separate fixtures/results rather than overwrite observations.json. Publication syntax-checked the adapted scripts; it did not run them as a new product experiment.

## Redaction, provenance, and counterevidence

- Every scenario, round, state, error code, effect count, content/request digest, and observation time is retained. Machine paths and child PIDs are removed. No raw operational ledger, approval token, user configuration, or product source copy is published.
- Original JSON, probe, and baseline-log hashes are in provenance.json. They neither reconstruct withheld originals nor substitute for independent execution.
- Before/after checks for seven source files are recorded in product_files. The original product workspace had existing runtime-data changes; it was not claimed to be wholly clean.
- Editorial checks reread B1's intervening bytes and B4's preserved bytes locally. We did not add a fictitious original-record field to B1's exported JSON. Original fixture directories are not published.
- The normal adapter case ends in cancelled during cleanup. kill_calls counts fake-process method calls, not OS termination.
- Initial path/wildcard diagnostic errors were corrected before proceeding. They were not counted as experiment failures; experiment failures were not removed to create green results. The final observation records contain no unexpected_error.
- OpenHands #4866 was closed without merging, with the author planning corrected evidence. Paperclip #12901 was merged. These are 2026-09-06 source snapshots, not continuous monitoring. We did not independently run upstream experiments or the paid Daytona suite.

## What remains unproven

No real host resource queue, live-task cancellation, real tool execution after authorization revocation, OS termination, power loss, remote sandbox deletion/sync, concurrent branch merge, production incident rate, or PM/QA business acceptance was tested. Neither article establishes a new product defect, completed fix, or development authorization.
