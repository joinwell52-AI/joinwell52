# TMPA — Textual Multi-Agent Process Architecture

> **A governance architecture for production-grade multi-agent work**

**English** · [简体中文](./README.zh-CN.md)

[![Architecture A1.0](https://img.shields.io/badge/TMPA-Architecture_A1.0-2563eb?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/en/publications/tmpa-architecture-paper-a1.0)
[![Core S1.0](https://img.shields.io/badge/TMPA-Core_S1.0-7c3aed?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/en/publications/tmpa-core-specification-s1.0)
[![Implementation I1.0](https://img.shields.io/badge/CodeFlowMu-I1.0_14%2F14_PASS-15803d?style=for-the-badge)](https://joinwell52-ai.github.io/joinwell52/en/publications/implementation-case-i1.0)

TMPA is a vendor-neutral architecture and specification for governing long-running work performed by heterogeneous AI agents and humans. It moves durable work facts out of volatile model memory and into inspectable objects, preserves responsibility across asynchronous execution, and reconstructs lifecycle, authority, conflict, and audit state from available evidence.

This repository is the public research, specification, conformance, and evidence base for TMPA. **CodeFlowMu** is its primary engineering demonstration. The Digital Researcher and the articles it publishes are derived research infrastructure and discourse—not the repository's primary identity and not normative sources for TMPA.

## Start with the stable V1.0 publication set

| Publication | Role | Read online | Release artifact |
|---|---|---|---|
| **Architecture Paper A1.0** | Explains the governance-state problem and the architectural theory | [Web](https://joinwell52-ai.github.io/joinwell52/en/publications/tmpa-architecture-paper-a1.0) | [PDF](./docs/public/releases/tmpa/v1.0/artifacts/tmpa-architecture-paper-a1.0-en.pdf) |
| **Core Specification S1.0** | Defines normative objects, lifecycle, authority, Reader behavior, and C01–C14 | [Web](https://joinwell52-ai.github.io/joinwell52/en/publications/tmpa-core-specification-s1.0) | [PDF](./docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-en.pdf) |
| **Implementation Case I1.0** | Reports bounded CodeFlowMu V1.8.0 product evidence against S1.0 | [Web](https://joinwell52-ai.github.io/joinwell52/en/publications/implementation-case-i1.0) | [PDF](./docs/public/releases/tmpa/v1.0/artifacts/tmpa-implementation-case-i1.0-en.pdf) |

The checksummed bilingual publication dossier, citation metadata, manifest, and release notes are in [`docs/public/releases/tmpa/v1.0/`](./docs/public/releases/tmpa/v1.0/).

## Why TMPA exists

Modern agent systems can produce rich execution traces: prompts, tool calls, outputs, and timestamps. Those records answer **what ran**. Production governance must also answer:

- Who accepted responsibility and who had authority to approve?
- Which object is the authoritative work fact?
- Is the claimed lifecycle transition legal?
- Which evidence is missing, conflicting, invalid, or still awaiting a human decision?
- Can the current state be reconstructed after an agent exits, a model changes, or a runtime restarts?

That is why **Trace ≠ Governance**. TMPA is not another general-purpose agent framework and does not treat logs, Markdown storage, or a workflow state machine as proof of governance. It defines observable governance behavior that implementations can be tested against.

## The four connected rules

1. **Text carries durable messages and state.** Work facts are portable, inspectable objects rather than facts trapped in a model session or process instance.
2. **Each writer owns a local serial stream.** Single-writer semantics preserve provenance and prevent one actor from silently rewriting another actor's history.
3. **Multiple streams advance asynchronously.** Collaboration retains partial-order and concurrency semantics instead of inventing a false global timeline.
4. **The Reader reconstructs governance state.** It aggregates available evidence to derive process, responsibility, lifecycle, conflicts, three-valued judgments, and an explicit Issue Set.

TMPA Core is storage-neutral: a conforming implementation may use files, database rows, object-store objects, or events. **FCoP** supplies a file-based coordination and evidence profile; **CodeFlowMu** implements and consumes that projection in a working engineering system.

## From theory to engineering evidence

```text
TMPA Architecture Paper A1.0
        ↓ architecture theory and design direction
TMPA Core Specification S1.0
        ↓ normative object, Reader, and conformance behavior
FCoP
        ↓ file-based coordination and evidence profile
CodeFlowMu V1.8.0
        ↓ product Adapter and Governance Reader
Implementation Case I1.0
        ↓ bounded, inspectable engineering evidence
Digital Employee and Research Runtime applications
```

The dependency direction matters: A1.0 states the theory; S1.0 is the normative authority; FCoP supplies a reusable coordination protocol; CodeFlowMu implements and consumes the governance projection; I1.0 reports what was demonstrated. An implementation can support or challenge the theory, but it cannot silently redefine the specification.

## CodeFlowMu engineering demonstration

I1.0 evaluates the CodeFlowMu V1.8.0 product Reader against the exact, frozen TMPA Core S1.0 bundle. The product path invokes `GovernanceReader.readSync`; it does not substitute the TMPA Reference Reader.

| Evidence item | Recorded result |
|---|---:|
| S1.0 criteria | **14 PASS / 0 PARTIAL / 0 NOT RUN / 0 FAIL** |
| Mandatory assertions | **71 / 71 passed and recomputed** |
| CodeFlowMu TMPA Runtime suite | **24 passed / 0 failed** |
| CodeFlowMu Runtime full suite | **1,522 passed / 0 failed / 1 skipped** |
| CodeFlowMu Shell coverage | **791 passed / 0 failed** |
| Locked FCoP reference implementation | **1,210 passed / 2 skipped** |
| Evidence integrity | **889 files covered by the internal SHA-256 manifest** |

Evidence entry points:

- [Implementation Case I1.0 source](./docs/en/publications/implementation-case-i1.0.md)
- [S1.0 conformance workspace and release audit](./research/conformance/tmpa-core-s1.0/)
- [Registered CodeFlowMu V1.8.0 exact-version run](./research/conformance/tmpa-core-s1.0/external-runs/20260811-codeflowmu-v1.8.0/)
- [Locked evidence archive](./docs/public/evidence/tmpa/i1.0/tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip) · [SHA-256](./docs/public/evidence/tmpa/i1.0/tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip.sha256)

**Claim boundary:** this is author-run, demonstrated behavior for one exact implementation revision and one exact S1.0 input bundle. It is not independent certification, universal conformance, proof of TMPA theory, proof of semantic truth, hallucination elimination, or independent adoption.

## Machine-readable specification and reproducibility

Published S1.0 machine contracts:

- [Governance Object Schema](./docs/public/spec/tmpa/s1.0/governance-object.schema.json)
- [Lifecycle Profile Schema](./docs/public/spec/tmpa/s1.0/lifecycle-profile.schema.json)
- [Reader Result Schema](./docs/public/spec/tmpa/s1.0/reader-result.schema.json)
- [Conformance Result Schema](./docs/public/spec/tmpa/s1.0/conformance-result.schema.json)

Run the author-produced S1.0 Reference Reader suite locally with Node.js 20 or later:

```bash
npm ci
npm run tmpa:s1.0:conformance
```

The Reference Reader result and the separately registered CodeFlowMu product result are distinct evidence tracks. See the [conformance README](./research/conformance/tmpa-core-s1.0/README.md) before interpreting either result.

## Research infrastructure and derived outputs

The repository also contains a governed research production system: Research Intelligence, Daily/Weekly/Academic/Program Runtimes, Research Skills, publication gates, and verification scripts. These components provide a living environment in which governance ideas can be exercised and research can be published.

The Digital Researcher's daily articles are **derived outputs of that environment**. They may interpret TMPA, connect it to industry change, or propose new research directions, but they do not define conformance and cannot override S1.0.

- [SaaW: Software as an Agent Worker](https://joinwell52-ai.github.io/joinwell52/en/industry/2026-08-10-saaw-software-as-an-agent-worker) — an industry manifesto connecting the shift from SaaS to software as a governed work actor with TMPA and CodeFlowMu.
- [Research Runtime Center V5.0](./docs/en/runtime/v5.md) — the operating system for the Digital Researcher and its publication workflows.
- [Research Report Production Engine V1.3](./docs/en/publications/research-report-production-engine-v1.3.md) — the report-production implementation built on that Runtime.

Use the Architecture Paper and Core Specification for authoritative TMPA claims; use I1.0 and the evidence packages for engineering claims; treat essays and manifestos as research discourse.

## Repository map

```text
.
├── docs/
│   ├── en/ and zh/                  # bilingual research site sources
│   └── public/
│       ├── spec/tmpa/s1.0/          # machine-readable normative contracts
│       ├── releases/tmpa/v1.0/      # checksummed bilingual publication dossier
│       └── evidence/tmpa/i1.0/      # locked CodeFlowMu evidence package
├── research/
│   ├── conformance/tmpa-core-s1.0/  # Reference Reader, fixtures, results, audits
│   ├── runtime/                      # governed research execution records
│   ├── intelligence/                 # source registry and research signals
│   └── skills/                       # staged research work contracts
├── scripts/                          # validation, projection, and site tooling
└── .github/workflows/                # validation, scheduling, and Pages deployment
```

## Citation, rights, and contribution

- Citation metadata: [`CITATION.cff`](./CITATION.cff) and the per-publication CFF/BibTeX files in the [V1.0 dossier](./docs/public/releases/tmpa/v1.0/metadata/)
- Rights and permitted use: [`LICENSE.md`](./LICENSE.md)
- Research and contribution policy: [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`RESEARCH-GOVERNANCE.md`](./RESEARCH-GOVERNANCE.md)

## Author

**Zhu Wei / 朱卫 · joinwell52-AI**  
Independent Researcher

Research site: [joinwell52-ai.github.io/joinwell52](https://joinwell52-ai.github.io/joinwell52/)
