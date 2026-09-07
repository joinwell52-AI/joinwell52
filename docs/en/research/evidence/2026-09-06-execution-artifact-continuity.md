---
title: "Evidence: Cancellation Boundaries and Artifact Continuity"
outline: deep
---

<ArticleTableScroll language="en" />

# Evidence: cancellation boundaries and artifact continuity

Publication of this bilingual study and evidence was authorized on 2026-09-07. The experiments ran on 2026-09-06 at CodeFlowMu baseline `c008d9db91a21136fc61a4f60314e22db395d5d2`. This is not security certification, independent QA, or development authorization.

[中文](/zh/research/evidence/2026-09-06-execution-artifact-continuity) · [Download full evidence ZIP](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/execution-artifact-evidence.zip) · [Full English guide](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/README.en.md)

## Articles

- [You Clicked Cancel. Which Step Did It Actually Cancel?](/en/engineering/2026-09-06-cancellation-execution-boundary)
- [The File Was Written Successfully. Why Check the Artifact Again?](/en/engineering/2026-09-06-workspace-artifact-continuity)

## Claim mapping

| Records | Observations | Required qualification |
| --- | --- | --- |
| A0–A3 | Single consumption, pending cancellation and expiry; approved execution at second 31 | The 30-second deadline governs review, not all approved-token use; A1 has no issued token |
| A4–A6 | Cancellation rejected while waiting; a research abort check prevents writing; an existing effect remains | Not successful revocation followed by execution; the barrier is injected |
| Three adapter scenarios | Per round: one normal reply, zero replies in either cancellation case | Real local adapter with fake process transport; not a real host's post-lock check |
| B0–B3 | Stable same-request digest; changed target rejected; another workspace or task changes operation digest | Existing object binding, not a new defect or newly developed feature |
| B4 | New-process digest matches; historical success coexists with original-path absence after rename | Three points for one file; no deletion, power loss, or business acceptance |

Twelve service/workspace scenarios and three adapter scenarios each ran twice: 30 observations, not 30 distinct scenarios or an accuracy score. Two existing test files ran in separate processes twice, with 39 pass / 0 fail / 0 skip per round. Both original baseline logs are retained in redacted form.

## Verification and rerunning

Extract the complete ZIP, enter evidence, and run `node check.mjs`. It checks the 30 exported observations, two baseline logs, and file hashes. It verifies existing records rather than rerunning the product.

`probe-boundaries.mjs` and `probe-adapter.mjs` are configurable copies of the executed research scripts. Hardcoded source paths become `CODEFLOWMU_SOURCE_ROOT`; the adapter creates its fixture directory for standalone use. Execution still requires authorized access to the fixed CodeFlowMu source, dependencies, and a TypeScript loader. See the bilingual guide. Product source, real tokens, and operational ledgers are not distributed. Readers without source access can check public records but cannot claim a product rerun.

## Integrity and redaction

All scenarios, rounds, outcomes, error codes, and effect counts are retained. Machine paths and child PIDs are removed. Original-record hashes and before/after checks for seven product source files are in provenance.json. Hashes identify records and detect changes relative to the manifest; they are not independent signatures or correctness proofs.

The normal adapter scenario ends in cancelled only during cleanup; kill_calls counts fake-process calls. B1's intervening bytes and B4's preserved bytes were reread during editorial review without inventing new original-observation fields. Raw local fixtures and operational configuration are withheld.

OpenHands #4866 and Paperclip #12901 versions/statuses are study-date snapshots. Neither upstream experiments nor the paid Daytona suite were independently rerun. Publication adds no real-host, authorization-revocation, remote-sync, power-loss, or PM/QA acceptance experiment.

## Individual files

- [observations.json](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/observations.json)
- [provenance.json](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/provenance.json)
- [Baseline round 1](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/baseline-1.log) · [Round 2](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/baseline-2.log)
- [Checker](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/check.mjs) · [Manifest](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/manifest.json)
- [Approval/workspace probe](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/probe-boundaries.mjs) · [Adapter probe](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/probe-adapter.mjs)
- [README 中文](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/README.zh.md) · [README English](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/evidence/README.en.md)
