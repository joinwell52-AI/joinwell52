# Publication Center

Digital Employee Works publishes versioned Runtime capabilities, Digital Employee capabilities, papers, specifications, and engineering case reports. GitHub is the single source of truth; a revision is official only after the applicable Runtime Gate, Git commit, and commit verification.

## Current operating system

| Type | Document | Current version | Status |
|---|---|---:|---|
| Research Runtime Center | [Operations Center](../runtime/) | **V5.0** | Frozen architecture / Running operations |
| Runtime scheduler | [Research Runtime Center V5.0 specification](../runtime/v5) | **Scheduler V3.0** | Active / Dependency-aware recovery |
| Research intelligence | [Research Intelligence System](../runtime/research-intelligence) | V1.0 | Active |

V5 defines four independent Runtime systems. Daily owns Discovery, Queue, Reading, Analysis, Production and Publication. Sunday adds 20:30 Weekly, so Sunday has seven formal same-day tasks. Scheduler uses durable Runtime facts for dependency gates, overdue catch-up and governed Blocked recovery.

## Digital Researcher capability

| Type | Document | Version | Status |
|---|---|---:|---|
| Digital Employee capability | [Research Report Production Engine](./research-report-production-engine-v2.0) | **V2.0** | **Current Capability Release** |
| Usage guide | [V2.0 Quick Start](./research-report-production-engine-v2.0-quickstart) | V2.0 | Downloadable |
| Historical capability | [Research Report Production Engine V1.3](./research-report-production-engine-v1.3) | V1.3 | Historical Release |

V2.0 upgrades the system from a time-triggered research line to a dependency-driven, catch-up capable, recoverable and self-validating Digital Research Employee Runtime. GitHub cron is a wake-up signal; `SCHEDULER.json + Runtime Records` determine due work. The system enforces stage order, recovers the oldest runnable missed shift, reopens dependency-blocked work after its prerequisite completes, and validates Runtime V5 plus the human-readable Markdown ledger after control-plane changes. The 2026-08-09 Reading miss and Analysis Blocked incident is its first production Recovery Case.

Download:

- [Download the current source ZIP](https://github.com/joinwell52-AI/joinwell52/archive/refs/heads/main.zip)
- [Open the GitHub repository](https://github.com/joinwell52-AI/joinwell52)

V1.0 remains the historical baseline for the first Production Test: [legacy compatibility entry](./research-report-production-engine-v1.0).

## TMPA publication set

| Type | Document | Version | Status |
|---|---|---:|---|
| Paper | [TMPA Architecture Paper](./tmpa-architecture-paper-a0.9) | A0.9 | Pre-submission review draft; current TMPA → Core → FCoP → CodeFlowMu guidance relation finalized |
| Specification | [TMPA Core Specification](./tmpa-core-specification-s0.6) | S0.6 | Release Candidate; Reference Reader 14/14 PASS; CodeFlowMu V1.6.0 product run 14/14 PASS (author-run) |
| Case report | [TMPA–FCoP–CodeFlowMu Implementation Case](./implementation-case-i0.8) | I0.8 | Exact-version S0.6 CodeFlowMu V1.6.0 evidence: C01–C14 14/14 author-run PASS; public reproducer included; WP-13 retained as a bounded case |

The TMPA publication suite is an independent theory layer. High-frequency Observation Notes do not automatically become paper evidence; long-term TMPA work runs through Research Program Runtime, not Daily Runtime.

```text
Daily Discovery
→ Three-Column Queue
→ Deep Reading
→ Research Analysis
→ Publication Candidate
→ bilingual publication
→ GitHub Commit
→ CI / Commit Verify
→ Pages build
→ Digital Employee Works
```

Until a stable release or DOI exists, citations should include author, title, explicit version, repository URL, and access date.
