# Evidence: restriction enforcement and the check-to-effect interval

Status: authorized by the user for public release with the articles on 2026-09-07. Chinese and English explanations refer to the same records. A package-check PASS is not product acceptance.

## Evidence chain

[Claims](claims.json) → [source provenance](sources.json) → [de-identified observations](observations.json) → this interpretation guide → [record checker](check-records.mjs) → [file hashes](manifest.json).

The formal data was generated on 2026-09-07 at 07:35:09 UTC against product commit `c008d9db91a21136fc61a4f60314e22db395d5d2`. E0–E5 each have two rounds. Article one uses E0–E3 (eight observations), article two E4/E5 (four). The pilot is excluded; these are not two separate twelve-observation studies.

## Reading the fields

| Field | Meaning |
| --- | --- |
| id / round | Scenario and repetition, each with a fresh synthetic directory |
| record_overwrite | Flag actually retained in the approval record, not an assumed UI configuration |
| status / error | Operation outcome, not the research process exit code |
| callback_calls | Executor callback entries, not a count of filesystem effects |
| target_bytes / target_digest | Synthetic bytes read after execution and their SHA-256 |
| source_exists | Post-operation source-path existence; E0/E1 never create a source file |
| approved_source_digest | Approved source snapshot digest; null when no source exists in the scenario |
| after_evidence | Evidence returned by the executor; failed cases have none, and move reports moved rather than a fabricated copy-style digest |
| injection | Explicit researcher-induced source change inside E5's callback; null otherwise |

old-target, new-target, source-before, and source-after are the actual synthetic test strings. They are not replacements for undisclosed production file contents.

De-identification removes random fixture directories and absolute paths. Executor evidence uses source.txt/target.txt instead. Every formal row, status, error, byte string, digest, callback count, and injection label is retained. Approval fixture identities/tokens are not included. The original record's hash supports internal tracing, not independent verification of an unavailable original.

## Checking records without executing the product

Run `node check-records.mjs` in this directory. It verifies twelve uniquely identified observations, repeatability of selected fields, byte digests, E4's zero callbacks, E5's digest mismatch, and the manifest files. Expected output: `EVIDENCE_RECORD_CHECK_PASS`.

That check preserves E1's failure, E4's stale rejection, and E2/E3's anomalous successes. It does not turn those outcomes into product acceptance.

## Rerunning the actual experiment

The research harness is `probe-effects.mjs` in the parent research directory. It needs authorized access to product source and dependencies. This public package does not copy the product or claim that the record checker re-executes it.

Protocol in an authorized engineering environment: pin the stated commit; create isolated directories; construct requests with the real builder; use OperationApprovalService.prepare/approve/execute and the real executeWorkspaceOperation. E0–E3 disallow overwrite; E4/E5 permit it. E4 changes the source before rebuilding the current request. E5 changes it inside the research callback after approval validation. Read files and approval outcomes separately, using fresh directories in each round. Never run these scenarios on live approvals or business files.

Original research artifacts remain available locally for review. Publishing a portable harness requires a separate path/dependency accessibility check. This is not live end-to-end, multi-process contention, power-loss recovery, or independent QA evidence. No real accounts or remote-service effects were involved.

## Source and scope limits

sources.json pins thirteen PR observations, including timestamps, base/head revisions, and merge state. Archiving them does not constitute independent testing. The articles mainly use Agents SDK #4893/#4894, Paperclip #12949, and GitHub MCP #3232; all were unmerged at the recorded time, the last one a Draft.

The fourth source_files entry—the executor registry—was inspected statically. The first three tested files retained their original hashes throughout the experiment. Git stores LF and the working copies use CRLF; content matches after newline normalization. Raw-byte inequality is not reported as a product change.

[中文说明](README.zh.md)
