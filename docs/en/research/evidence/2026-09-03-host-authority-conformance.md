---
title: "Host Verification, Executor Identity, and Enterprise Execution: Evidence"
date: "2026-09-03"
language: "en"
---

# Host Verification, Executor Identity, and Enterprise Execution: Public Evidence Guide

[简体中文](/zh/research/evidence/2026-09-03-host-authority-conformance)

This package supports three articles dated September 3, 2026. The first two are controlled studies on a fixed baseline; the third is a product outlook grounded in official sources. **No remediation was implemented in this study. This is not independent QA or release acceptance.**

## Baseline and method

CodeFlowMu is our local multi-Agent collaboration system. The tested product was **V2.2.6**, commit `5c94d8c3b0147b779b17f620b811c6a17cc65288`, on Windows x64 with Node v24.16.0. The original before/after records have identical commits and empty worktree status. Publishing these articles did not modify product code.

E1 injected controlled results through existing registry, staging, and probe seams while using the real `HostAdmissionControlPlaneService.runTests` and persistence boundary. It did not launch real providers, install packages, approve synchronization, adopt Host updates, or start an SDK. Cursor/Codex are fixture Host labels—not evidence of defects in those products.

E2 used real OperationApproval prepare/approve, controlled durable records, a new service instance's get path, real OS process queries, and the existing writer-lock function. The year-2000 timestamp is synthetic. The study did not induce real OS PID reuse or restart the Runtime. **External executor calls: zero.**

## Claim → observation → limit

| Claim | Supporting data | What it supports—and does not |
|---|---|---|
| Empty results can still become VERIFIED | E1 empty; 2 Hosts × 2 rounds; progress 0/4 | Real service aggregation accepts an empty list; not evidence that a real provider failed to run |
| Incomplete, duplicate, and out-of-plan results also pass | E1 partial/duplicate/unknown-id plus empty; 16 counterexamples among 32 observations | Missing plan-completeness checks; not a production failure rate or successful authorization bypass |
| Full, BLOCKED, FAIL, and thrown-error controls behave as recorded | E1 full/blocked/failed/throws; 16 controls | Existing protections remain; the ADMIN synchronization gate still follows VERIFIED |
| The same live PID need not be the original executor | E2 reused-pid-fixture; executing in both rounds while the legacy writer-lock comparison detects stale | Synthetic old timestamp versus actual OS creation time; identity mismatch proves neither effect absence nor permission to retry |
| Existing regressions still pass | 7 groups × 2 rounds; 41 pass / 0 fail / 0 skip per round | Not 82 independent tests, nor evidence that the reported gaps were repaired |
| Enterprise execution can remain separate from cloud control | Official Cursor sources S4–S7 | Product boundaries and conditional forecasts; no deployment, cost, recovery-rate, or market benchmark |

The export preserves original row order, outcomes, states, rounds, timestamps, and counters. It removes absolute local paths, temporary directories, synthetic run/candidate IDs, execution commands, and full logs. OS process tokens are omitted while creation-time milliseconds remain available for the temporal comparison.

## Downloads and read-only verification

Save these files together and run `node check.mjs`. No dependencies are required. The checker does not access the network, write files, or launch a product or Agent.

- [E1: all 32 observations](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/observations-e1.json)
- [E2: all 6 observations](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/observations-e2.json)
- [Two rounds of seven regression groups](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/regressions.json)
- [External sources and fixed commits](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/sources.json)
- [Projection rules and original-file SHA-256 hashes](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/provenance.json)
- [Read-only check.mjs](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/check.mjs)
- [Public-file SHA-256 manifest](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/manifest.json)
- [English README](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/README.en.md) / [中文 README](https://joinwell52-ai.github.io/joinwell52/assets/evidence/2026-09-03-host-authority-conformance/README.zh.md)

Expected results:

```text
E1: 32 observations / 16 counterexamples
E2: 6 observations / 0 executor calls
Regression round 1: 41 pass / 0 fail / 0 skip
Regression round 2: 41 pass / 0 fail / 0 skip
```

The checker verifies scenario coverage, controls, per-round counts, states, the temporal contradiction, and file hashes. **It is not a public product reproducer for the original experiments.** Product source and full internal probes remain access-restricted; this package cannot independently establish the behavior of that restricted source. Hashes establish consistency relative to the manifest, not the truth or authenticity of an observation, and are not digital signatures. Readers can check whether the author's exported observations support the published numbers. Full product reproduction requires authorized access to the same baseline and internal probes.

## External sources and background

- [OpenHands software-agent-sdk #4834](https://github.com/OpenHands/software-agent-sdk/pull/4834): the software-development Agent SDK from OpenHands. The change exercises real-provider configuration construction without inference. It is not a CodeFlowMu completeness fix and should not be represented as coverage in every default CI job.
- [OpenAI Codex #42381](https://github.com/openai/codex/pull/42381) and [#42392](https://github.com/openai/codex/pull/42392): Codex is OpenAI's coding Agent. The changes provide external engineering comparisons for Windows process identity and successor readiness/handoff. They do not establish equivalent CodeFlowMu capabilities.
- [Cursor announcement](https://cursor.com/changelog/self-hosted-machines), [Self-Hosted Machines](https://cursor.com/docs/cloud-agent/self-hosted), [Team Pools](https://cursor.com/docs/cloud-agent/self-hosted/pool), and [Computer use](https://cursor.com/docs/cloud-agent/self-hosted/computer-use): Cursor is Anysphere's AI coding product. The September 2 update and documentation checked through September 3 support a cloud loop, enterprise workers, conditional workspace recovery, and human takeover—not “no outbound data” or a completely private Agent deployment.

Web documentation can change. The study cutoff is September 3, 2026; fixed PR merge SHAs are recorded in sources.json. This package does not republish third-party full text.

## Articles

1. [The Test Results Are Empty. Why Does the System Still Say “Verified”?](/en/engineering/2026-09-03-empty-test-results-verified)
2. [The Process Is Alive. Is It Still the Original Executor?](/en/engineering/2026-09-03-process-alive-owner-identity)
3. [When Agents Enter the Enterprise Network: What Do Cursor Self-Hosted Machines Change?](/en/digital-employee/2026-09-03-cursor-self-hosted-agent-outlook)
