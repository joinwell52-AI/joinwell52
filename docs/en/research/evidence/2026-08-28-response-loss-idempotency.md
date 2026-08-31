---
title: "A1 Public Evidence Pack: Response Loss and Per-Tool Idempotency"
date: '2026-08-28'
updated: '2026-08-31'
column: research-evidence
category: evidence
article_type: evidence-pack
edition: research-center
summary: "Preserves the V2.0.4 response-loss historical contrast and adds sources and boundaries for the V2.1.2 creation-receipt implementation, independent QA and formal release."
lifecycle: "Published"
publication_authorized: true
---

[中文版本](/zh/research/evidence/2026-08-28-response-loss-idempotency)

# A1 | Response Loss and Per-Tool Idempotency

## Claim

Under the same V2.0.4 fault window — “the action was persisted, then the success response was lost” — the tested `write_report` path reused the existing report, while the tested task-creation path produced a second task. This is a historical result, not current V2.1.2 behavior; the newer engineering result is documented below.

## Re-runnable public attachments

The Reader/check below replays consistency assertions over frozen JSON material. It does not call the private Runtime and does not replace product fault injection. To preserve historical auditability, the attachments and their digests are not rewritten as V2.1.2 output.

- [Sanitized fixture](/assets/evidence/2026-08-28-runtime-boundary/A1-response-loss-fixture.json)
- [Reader](/assets/evidence/2026-08-28-runtime-boundary/A1-response-loss-reader.mjs)
- [Check script](/assets/evidence/2026-08-28-runtime-boundary/A1-response-loss-check.mjs)
- [Attachment SHA-256 manifest](/assets/evidence/2026-08-28-runtime-boundary/MANIFEST.txt)

Download the three files into the same directory and run:

```text
node A1-response-loss-check.mjs
```

Expected output:

```json
{"evidence_id":"RBE-20260828-A1","report_objects_after_retry":1,"task_objects_after_retry":2,"status":"PASS"}
```

## Source and boundary

The original targeted experiment ran against CodeFlowMu V2.0.4 fixed commit `2ba1ad9baf27077861b6a20e5815b4175f0a81c6`. The public fixture replaces task identifiers, paths and body text while preserving the same commit declaration and final object-count relation.

It does not provide production incidence, cover untested tools, or by itself prove that the later creation-receipt implementation exists.

## 2026-08-30: V2.1.2 delivered update

A pre-fix rerun on V2.1.1 fixed commit `36e5c83b` confirmed that the task-creation gap still existed while the `write_report` protection still held. Implementation commit `3302ca61` added a persistent receipt, the `write-task-v1` semantic digest, `reserved → task_created → committed` recovery, typed conflict handling, legacy compatibility and read-only stale-reservation diagnostics.

Independent QA on `64f633ac` observed:

| Scenario | Observation |
| --- | --- |
| A2 response-loss retry | TASK count 1; same task_id; second call `reused / action_taken=false` |
| A4 eight-way concurrency | `created=1 / reused=7`; one task_id; TASK count 1 |

A2/A4 are internal acceptance scenario identifiers, not the numbering scheme of this A1 public evidence pack. Process restart, digest conflict and intermediate-state recovery have separate targeted development records and are not automatically proven by those two independent-QA cases.

## Sources for the newer claims and review visibility

| Claim | First-party source | Visibility |
| --- | --- | --- |
| Pre-fix reproduction, receipt implementation and development regression | `RUNTIME-BOUNDARY-20260830-001`: phase0, targeted and full-regression records | Restricted mother-repository material |
| A2/A4 independent results | `RUNTIME-BOUNDARY-QA-20260830-001`: independent-qa records | Restricted mother-repository material |
| Release tests passed | `V2.1.2-R3`; Runtime 1842 pass / 0 fail / 1 skip, Shell 1037 pass / 0 fail | Restricted mother-repository material |
| Tag, artifacts and formal release | `V2.1.2-PUBLICATION-20260830-001`; tagged source `cb8869a3`, main `919c3b48` after receipt | First-party release receipt, 2026-08-30 |

The [CodeFlowMu V2.1.2 Public Release Summary](/en/research/evidence/2026-08-30-codeflowmu-v2.1.2-public-release-summary) consolidates publicly citable version facts, the three Runtime boundary changes, final validation, compatibility and remaining limitations. Complete source code, raw QA logs and release receipts remain restricted first-party material and are not public reading links. This page also does not present the historical fixture pack as a new-version end-to-end reproduction kit.

The new guarantee requires the caller to reuse a stable `client_submission_id` with the same semantic digest. Legacy calls without an ID remain compatible but do not receive the stronger cross-response-loss/process guarantee. Formal release also does not imply that any particular online instance has already upgraded, and it does not include Open Edition.

The Windows symlink-permission skip, existing dependency-audit warnings, Python targeted-fixture SDK environment warning, and untested real LAN/Gateway and production-project scope remain explicit. Failed R1/R2 release evidence was not overwritten by the final R3 pass.
