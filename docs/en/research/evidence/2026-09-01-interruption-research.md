---
title: "Interrupted-Takeover Research: Evidence, Sources, and Verification Limits"
date: "2026-09-01"
updated: "2026-09-02"
---

# Interrupted-Takeover Research: Evidence, Sources, and Verification Limits

[中文](/zh/research/evidence/2026-09-01-interruption-research)

Companion to [same-TASK takeover](/en/engineering/2026-09-01-interrupted-task-takeover) and [decision-evidence continuity](/en/engineering/2026-09-01-decision-evidence-continuity). Research baseline: CodeFlowMu V2.1.2, `919c3b48cba31e376b45e60506fa14e4bbcfcb23`.

**This package publishes preserved research records, not raw output from a new product run.** Retained materials include the fixture, commands, result summaries, and observation tables—not complete line-by-line stdout. Transcriptions or a checker PASS cannot replace a product rerun, independent QA, or formal frozen-contract acceptance.

## 1. Download and check

[Complete ZIP](/assets/evidence/2026-09-01-interruption-research.zip) · [English README](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-01-interruption-research/README.en.md) · [中文说明](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-01-interruption-research/README.zh.md) · [Observations](/assets/evidence/2026-09-01-interruption-research/observations.json) · [Sources](/assets/evidence/2026-09-01-interruption-research/sources.json) · [Checker](/assets/evidence/2026-09-01-interruption-research/check.mjs) · [SHA-256 inventory](/assets/evidence/2026-09-01-interruption-research/manifest.json) · [Research fixture template](/assets/evidence/2026-09-01-interruption-research/probe-template.ts.txt)

Extract the complete ZIP and run:

```text
node check.mjs
```

Expected: PASS for preserved-data consistency and file hashes, exit code 0. It does not invoke the Runtime or establish that product behavior has been rerun.

## 2. Claim → record → limitation

| Evidence | Preserved observation | Supports | Does not support |
| --- | --- | --- | --- |
| RA-4 | checkpoint retained; direct second Session start yields SDK send=2 | direct start did not consume checkpoint | automatic Dispatcher duplication of a real effect |
| RA-5 | SESSION_LOST record not overwritten by late settle; zero new terminal events | existing terminal-record protection | universal external-effect epoch fencing |
| RA-7 / RA-8 | synthetic confirmed_exists / unknown claims both restore inbox at zero backoff; TASK identity retained | the real method does not distinguish those supplied semantics | production duplicate effects or incidence |
| DC-1 / DC-2 | receipt marker absent; denial remains failed / OPERATION_BOUNDARY_DENIED | missing generic receipt continuity; denial is not success | all specialized receipts are ineffective |
| DC-3 / DC-4 | a synthetic marker with an 8192-byte tail remains internal; three projections omit it and retain failure code/status | ordinary-consumer raw-text boundary | a complete internal retention, query, and integrity contract |
| RUN-004 | 7 test files: 57 pass / 0 fail / 0 skipped | existing recovery, fact-check, EVAL, and diagnostic boundaries | implemented interruption cases or end-to-end acceptance |

Research RA/DC labels are not the same set as formal frozen-contract IA/DC acceptance IDs. The historical fixture used `quarantine`; the later public contract uses `hold_for_review`. Historical input is preserved.

## 3. External sources checked on 2026-09-02

| Project | Primary source | Scope used here |
| --- | --- | --- |
| OpenAI Codex | [#41916](https://github.com/openai/codex/pull/41916), merged | reconnect without automatically resending uncertain input |
| OpenAI Codex | [#41936](https://github.com/openai/codex/pull/41936), merged | bounded failed-review diagnostics; omit oversized reviewer context |
| AG2 | [#3222](https://github.com/ag2ai/ag2/pull/3222), merged 2026-09-01 | durable history does not supply a cross-process lease |
| Orkas | [#53](https://github.com/Orkas-AI/Orkas/pull/53), merged | idempotent settlement of duplicate/late terminal events |
| Paperclip | [#12616](https://github.com/paperclipai/paperclip/pull/12616), merged 2026-09-01 | experimental default-off native runner, bound identity, receipts, result fencing; merge does not mean general enablement |

External sources motivate questions; they do not prove a CodeFlowMu capability or defect. Paperclip #12616 is not the OAuth connector-profile change.

## 4. Product reproduction is separate

A product rerun needs authorized access to the fixed source and dependencies. The sole existing product root is `D:\codeflowmu`; this bundle neither requires nor authorizes another repository copy or overwriting current work. Stop on a version mismatch rather than presenting a newer run as old-baseline evidence. An authorized operator may map the fixture's import token to verified source and use its existing tsx environment, preserving new raw output separately.

No physical power loss, real third-party effect, browser E2E, or independent QA was performed. The subsequent contract is frozen; implementation, formal IA-1–IA-12 / DC-1–DC-3, and independent-QA results are outside this package's claims.
