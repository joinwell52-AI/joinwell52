<p align="center">
  <img src="./docs/public/assets/readme/tmpa-readme-hero.svg" alt="TMPA — Textual Multi-Agent Process Architecture" width="100%">
</p>

<p align="center">
  <strong>AI agents can produce results. Production systems must prove who was responsible, what was accepted, and why.</strong>
</p>

<p align="center">
  <a href="https://joinwell52-ai.github.io/CodeFlowMu-open/"><strong>CodeFlowMu Open (Historical)</strong></a>
  ·
  <a href="https://joinwell52-ai.github.io/FCoP/"><strong>Explore FCoP</strong></a>
  ·
  <a href="https://joinwell52-ai.github.io/joinwell52/"><strong>Explore the research site</strong></a>
  ·
  <a href="./README.zh-CN.md"><strong>简体中文</strong></a>
</p>

<p align="center">
  <a href="https://github.com/joinwell52-AI/joinwell52/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/joinwell52-AI/joinwell52?style=for-the-badge&logo=github&label=Star"></a>
  <a href="https://github.com/joinwell52-AI/joinwell52/releases/tag/tmpa-v1.0"><img alt="TMPA V1.0 Release" src="https://img.shields.io/badge/release-TMPA%20V1.0-2563eb?style=for-the-badge"></a>
  <a href="https://doi.org/10.5281/zenodo.21888488"><img alt="DOI" src="https://img.shields.io/badge/DOI-10.5281%2Fzenodo.21888488-1682D4?style=for-the-badge"></a>
  <a href="https://doi.org/10.17605/OSF.IO/2JVQD"><img alt="TMPA OSF DOI 10.17605/OSF.IO/2JVQD" src="https://img.shields.io/badge/OSF_DOI-10.17605%2FOSF.IO%2F2JVQD-2F80ED?style=for-the-badge&logo=osf&logoColor=white"></a>
  <a href="https://doi.org/10.5281/zenodo.20457285"><img alt="FCoP DOI" src="https://img.shields.io/badge/FCoP_DOI-10.5281%2Fzenodo.20457285-1682D4?style=for-the-badge"></a>
  <a href="https://doi.org/10.17605/OSF.IO/92NWM"><img alt="FCoP OSF DOI 10.17605/OSF.IO/92NWM" src="https://img.shields.io/badge/OSF_DOI-10.17605%2FOSF.IO%2F92NWM-2F80ED?style=for-the-badge&logo=osf&logoColor=white"></a>
  <a href="./CITATION.cff"><img alt="Cite this repository" src="https://img.shields.io/badge/citation-CITATION.cff-8b5cf6?style=for-the-badge"></a>
  <a href="https://joinwell52-ai.github.io/joinwell52/en/publications/tmpa-core-specification-s1.0"><img alt="TMPA Core S1.0" src="https://img.shields.io/badge/Core-S1.0-7c3aed?style=for-the-badge"></a>
  <a href="https://joinwell52-ai.github.io/joinwell52/en/publications/implementation-case-i1.0"><img alt="Implementation I1.0" src="https://img.shields.io/badge/CodeFlowMu-14%2F14_PASS-15803d?style=for-the-badge"></a>
</p>

## Open-science citation records

| Work | Zenodo DOI | OSF DOI |
|---|---|---|
| **TMPA** | [10.5281/zenodo.21888488](https://doi.org/10.5281/zenodo.21888488) | [10.17605/OSF.IO/2JVQD](https://doi.org/10.17605/OSF.IO/2JVQD) |
| **FCoP** | [10.5281/zenodo.20457285](https://doi.org/10.5281/zenodo.20457285) | [10.17605/OSF.IO/92NWM](https://doi.org/10.17605/OSF.IO/92NWM) |

The Zenodo DOI records the citable release archive; the OSF Registration is the immutable, timestamped open-science snapshot.

## CodeFlowMu product overview

<p align="center">
  <a href="https://joinwell52-ai.github.io/joinwell52/assets/video/codeflowmu-product-intro-zh.mp4?v=21-role-matrix">
    <img src="./docs/public/assets/video/codeflowmu-product-intro-zh-poster.jpg?v=20-rolefix-cover" alt="CodeFlowMu product overview: TMPA theory, FCoP protocol, and CodeFlowMu runtime" width="920">
  </a>
</p>

<p align="center">
  <a href="https://joinwell52-ai.github.io/joinwell52/assets/video/codeflowmu-product-teaser-zh.mp4">
    <img src="https://img.shields.io/badge/12%20sec%20Teaser-Play%20Now-0ea5e9?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch 12-second teaser">
  </a>
  <a href="https://joinwell52-ai.github.io/joinwell52/assets/video/codeflowmu-product-intro-zh.mp4?v=21-role-matrix">
    <img src="https://img.shields.io/badge/60%20sec%20Film-Watch%20Now-22c55e?style=for-the-badge&logo=videocam&logoColor=white" alt="Watch 60-second product film">
  </a>
  <br>
  <sub>Real PC and mobile captures · Chinese narration · multi-agent execution · final human approval</sub>
</p>

---

# TMPA

**TMPA (Textual Multi-Agent Process Architecture)** is a vendor-neutral governance architecture for long-running work performed by AI agents and humans. It moves durable work facts out of volatile model memory, preserves responsibility across asynchronous execution, and reconstructs lifecycle, authority, conflict, and audit state from inspectable evidence.

This repository is TMPA's public research, specification, executable conformance, and evidence base. [**CodeFlowMu Open**](https://github.com/joinwell52-AI/CodeFlowMu-open) ([site](https://joinwell52-ai.github.io/CodeFlowMu-open/)) is the **frozen historical open-source edition**, preserved at **V1.2.29-open** for engineering history, reproducibility, and research reference. It is not the current CodeFlowMu product distribution path. [**FCoP**](https://github.com/joinwell52-AI/FCoP) ([site](https://joinwell52-ai.github.io/FCoP/)) is the MIT-licensed file-based behavior-governance protocol used across this engineering lineage.

> If you are building agents that must survive restarts, handoffs, disputes, review, and real organizational accountability, this repository is for you. **Star it to follow stable specifications, executable examples, and evidence-backed releases.**

## Start here

| I want to… | Best entry point |
|---|---|
| Inspect the historical open-source implementation | [GitHub](https://github.com/joinwell52-AI/CodeFlowMu-open) · [Historical site](https://joinwell52-ai.github.io/CodeFlowMu-open/) — frozen at V1.2.29-open; not the current product distribution path |
| Add file-based coordination to agents | [GitHub](https://github.com/joinwell52-AI/FCoP) · [Protocol site](https://joinwell52-ai.github.io/FCoP/) — Python package, MCP server, and protocol |
| Understand the idea in five minutes | [Why TMPA exists](#trace-is-not-governance) |
| Browse the complete project visually | [Open Digital Employee Works →](https://joinwell52-ai.github.io/joinwell52/) |
| Read the stable theory and specification | [Architecture A1.0](https://joinwell52-ai.github.io/joinwell52/en/publications/tmpa-architecture-paper-a1.0) · [Core S1.0](https://joinwell52-ai.github.io/joinwell52/en/publications/tmpa-core-specification-s1.0) |
| Run something now | [Execute the S1.0 Reference Reader](#run-the-reference-reader) |
| Inspect the engineering claim | [Implementation Case I1.0](https://joinwell52-ai.github.io/joinwell52/en/publications/implementation-case-i1.0) · [Evidence package](./docs/public/evidence/tmpa/i1.0/) |
| Cite the work | [TMPA DOI](https://doi.org/10.5281/zenodo.21888488) · [TMPA OSF DOI](https://doi.org/10.17605/OSF.IO/2JVQD) · [FCoP DOI](https://doi.org/10.5281/zenodo.20457285) · [FCoP OSF DOI](https://doi.org/10.17605/OSF.IO/92NWM) · [`CITATION.cff`](./CITATION.cff) |

## Three public repositories, one system

| Repository | Primary job | GitHub | Website |
|---|---|---|---|
| **TMPA / joinwell52** | Theory, specification, conformance, research, and evidence | [Source & Star](https://github.com/joinwell52-AI/joinwell52) | [Digital Employee Works](https://joinwell52-ai.github.io/joinwell52/) |
| **FCoP** | File-based behavior-governance protocol, Python package, and MCP server | [Source & Star](https://github.com/joinwell52-AI/FCoP) | [FCoP site](https://joinwell52-ai.github.io/FCoP/) |
| **CodeFlowMu Open** | Historical open-source implementation and reproducibility record | [Source & Star](https://github.com/joinwell52-AI/CodeFlowMu-open) | [Historical site](https://joinwell52-ai.github.io/CodeFlowMu-open/) |

Each repository has one clear reason to be discovered and starred: **TMPA explains and specifies; FCoP makes coordination reusable; CodeFlowMu Open preserves the historical public implementation that connected these ideas in a working product.** The current CodeFlowMu product line is developed separately and is not represented by the frozen open repository.

## Engineering origin: Xiaodian AI

The problem framing behind TMPA, FCoP, and CodeFlowMu did not begin with a paper definition. It grew out of engineering an enterprise AI application, **Xiaodian AI**. That work exposed two connected problems. The first was “who develops enterprise AI?”: one agent could not reliably own requirements, development, deployment, and acceptance, leading toward PM / DEV / OPS / QA, TASK / REPORT / ISSUE, and “files as protocol.” The second was “how should enterprise AI work inside a business?”: permission, query, analysis, action, and audit could not all be entrusted to one model; responsibilities had to be separated and inspectable facts retained. The first stream later developed into FCoP and CodeFlowMu; the second informed TMPA and the digital-employee architecture. They now meet again in the governed digital-employee production machine.

> **Current public boundary:** The [Xiaodian AI PWA Demo](https://demo.chedian.cc/) is now public for hands-on exploration; its source code and production systems remain private. The demo is a public experience entry point, not evidence of TMPA S1.0 conformance, independent validation, production readiness, or elimination of hallucinations.

## Historical CodeFlowMu Open implementation

[CodeFlowMu Open](https://github.com/joinwell52-AI/CodeFlowMu-open) preserves the last open-source edition of the local application with its [historical product site](https://joinwell52-ai.github.io/CodeFlowMu-open/), PC Panel, Mobile PWA, project isolation, approval gates, FCoP work artifacts, and the fixed execution team `PM / DEV / OPS / QA`. `EVAL` observes delivery quality and risk independently.

> **Historical boundary:** CodeFlowMu Open was frozen on **2026-08-22** at **V1.2.29-open**. The commands below are retained only for reproducibility and historical use. They are not the installation path for the current closed-source CodeFlowMu product line.

```bat
cd /d D:\
git clone https://github.com/joinwell52-AI/CodeFlowMu-open.git
cd CodeFlowMu-open
START-CODEFLOWMU-OPEN.bat
```

<p align="center">
  <a href="https://github.com/joinwell52-AI/CodeFlowMu-open#real-product-screens">
    <img src="https://raw.githubusercontent.com/joinwell52-AI/CodeFlowMu-open/main/docs/images/pc/V1.2.6/en/pc-dashboard-V1.2.6-en.png" alt="CodeFlowMu Open real product dashboard" width="920">
  </a>
</p>

<p align="center"><sub>Historical product capture · open the frozen repository for the preserved PC/PWA walkthrough.</sub></p>

## Trace is not governance

Agent traces tell you what ran. Production governance must answer a harder set of questions.

| Execution trace | Governance state |
|---|---|
| A tool returned success | Was the result independently accepted? |
| A model said “done” | Is there sufficient completion evidence? |
| A workflow reached its final node | Was the lifecycle transition legal? |
| A log contains an actor name | Did that actor have authority? |
| Events have timestamps | Can conflict and concurrency be reconstructed without inventing a false order? |

TMPA treats work as durable governance objects rather than facts trapped inside a chat, process, or model session.

## The architecture in one view

```text
Architecture Paper A1.0       theory and design direction
            ↓
Core Specification S1.0      normative objects, lifecycle, Reader, C01–C14
            ↓
FCoP                         file-based coordination and evidence profile
            ↓
CodeFlowMu V1.8.0            product Adapter and Governance Reader
            ↓
Implementation Case I1.0     bounded, inspectable engineering evidence
            ↓
Digital Employee apps        governed work in real production contexts
```

The direction matters. The architecture explains the theory; Core defines normative behavior; [FCoP](https://github.com/joinwell52-AI/FCoP) supplies a protocol profile; [CodeFlowMu Open](https://github.com/joinwell52-AI/CodeFlowMu-open) preserves the historical public implementation, while the current CodeFlowMu product line is developed separately; the case report states only what the exact-version evidence demonstrates.

### Four connected rules

1. **Text carries durable messages and state.** Work facts remain portable and inspectable outside any model session.
2. **Each writer owns a local serial stream.** One actor cannot silently rewrite another actor's history.
3. **Multiple streams advance asynchronously.** Collaboration preserves partial order and real concurrency.
4. **The Reader reconstructs governance state.** Available evidence becomes lifecycle, responsibility, conflicts, judgments, and an explicit Issue Set.

TMPA Core is storage-neutral. Files, database rows, object-store items, or events may carry the same governance semantics.

## Run the Reference Reader

The repository includes the complete TMPA Core S1.0 machine schemas, fixtures, profiles, author-produced Reference Reader, and C01–C14 runner.

Requirements: **Node.js 20+**.

```bash
git clone https://github.com/joinwell52-AI/joinwell52.git
cd joinwell52
npm ci
npm run demo
npm run tmpa:s1.0:conformance
```

`npm run demo` shows one delivery rejected because the developer reviews its own `done` claim, then accepted after independent QA evidence is added. This is a small TMPA specification demo; the historical public CodeFlowMu implementation is preserved in [CodeFlowMu Open](https://github.com/joinwell52-AI/CodeFlowMu-open), while the current product line is separate.

Expected reference result:

```text
PASS 14  ·  PARTIAL 0  ·  NOT RUN 0  ·  FAIL 0
```

This proves the frozen reference paths behave as tested. It is separate from the registered CodeFlowMu product run and is not independent certification. Read the [conformance notes](./research/conformance/tmpa-core-s1.0/README.md) before interpreting the result.

## Stable V1.0 publication set

| Publication | What it answers | Read online | Artifact |
|---|---|---|---|
| **Architecture Paper A1.0** | Why agent work needs a governance-state architecture | [Web](https://joinwell52-ai.github.io/joinwell52/en/publications/tmpa-architecture-paper-a1.0) | [PDF](./docs/public/releases/tmpa/v1.0/artifacts/tmpa-architecture-paper-a1.0-en.pdf) |
| **Core Specification S1.0** | What objects, authority, lifecycle, Reader behavior, and conformance require | [Web](https://joinwell52-ai.github.io/joinwell52/en/publications/tmpa-core-specification-s1.0) | [PDF](./docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-en.pdf) |
| **Implementation Case I1.0** | What CodeFlowMu V1.8.0 demonstrated against the exact S1.0 bundle | [Web](https://joinwell52-ai.github.io/joinwell52/en/publications/implementation-case-i1.0) | [PDF](./docs/public/releases/tmpa/v1.0/artifacts/tmpa-implementation-case-i1.0-en.pdf) |

The complete checksummed bilingual dossier, citation metadata, manifest, and release notes live in [`docs/public/releases/tmpa/v1.0/`](./docs/public/releases/tmpa/v1.0/). Permanent archive: [Zenodo 21888488](https://zenodo.org/records/21888488).

## Engineering evidence snapshot

I1.0 evaluates the actual CodeFlowMu V1.8.0 product path—`GovernanceReader.readSync`—against the frozen TMPA Core S1.0 bundle.

| Evidence item | Recorded result |
|---|---:|
| S1.0 criteria | **14 PASS / 0 PARTIAL / 0 NOT RUN / 0 FAIL** |
| Mandatory assertions | **71 / 71 passed and recomputed** |
| CodeFlowMu TMPA Runtime suite | **24 passed / 0 failed** |
| CodeFlowMu Runtime full suite | **1,522 passed / 0 failed / 1 skipped** |
| CodeFlowMu Shell coverage | **791 passed / 0 failed** |
| Locked FCoP reference implementation | **1,210 passed / 2 skipped** |
| Evidence integrity | **889 files covered by the internal SHA-256 manifest** |

Inspect the [exact-version registration](./research/conformance/tmpa-core-s1.0/external-runs/20260811-codeflowmu-v1.8.0/) or download the [locked evidence archive](./docs/public/evidence/tmpa/i1.0/tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip) and its [SHA-256](./docs/public/evidence/tmpa/i1.0/tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip.sha256).

> **Claim boundary:** this is author-run evidence for one exact implementation revision and one exact input bundle. It is not independent certification, universal conformance, proof of semantic truth, or proof that hallucinations have been eliminated.

## Public access and open-source status

Transparency matters more than an attractive label:

| Component | Available in this repository? | Current status |
|---|---:|---|
| TMPA papers, specifications, diagrams, and research | Yes | Publicly readable and citable |
| S1.0 schemas, fixtures, runner, and Reference Reader | Yes | Source-visible and executable |
| CodeFlowMu conformance evidence | Yes | Frozen evidence and exact-version registration |
| [FCoP GitHub](https://github.com/joinwell52-AI/FCoP) · [Site](https://joinwell52-ai.github.io/FCoP/) | Separate repository | MIT-licensed protocol, Python package, and MCP server |
| [CodeFlowMu Open GitHub](https://github.com/joinwell52-AI/CodeFlowMu-open) · [Site](https://joinwell52-ai.github.io/CodeFlowMu-open/) | Separate repository | MIT-licensed historical open implementation; frozen at V1.2.29-open |

The TMPA research content in this repository uses the terms in [`LICENSE.md`](./LICENSE.md). The two software repositories above carry their own MIT licenses. Their licenses and product boundaries are intentionally separate from the TMPA publication license.

## Research and production system

Beyond the stable TMPA line, this repository contains a governed research production environment: source intelligence, Daily/Weekly/Academic/Program runtimes, research skills, publication gates, validators, and the VitePress site.

### Recommended articles and external publication record

Pinned articles can be registered here before external publication, then updated in the same row with each platform URL. The regular external-publication log starts on **2026-08-12**; earlier history is not backfilled. Chinese, English, and platform links for the same article stay together in one row. There are now **eight registered external channels**: **CSDN, DEV Community, Cursor Forum, OpenAI Developer Community, Codex GitHub Discussions, Zenodo, Juejin, and X**. CSDN, DEV, and Juejin carry republished articles; X carries short research summaries with attribution; Cursor Forum, OpenAI Developer Community, and Codex GitHub Discussions support technical discussion; Zenodo provides research archiving and discovery. Links marked “technical discussion” are standalone question threads, not full-article republications.

| # | Article | Published versions | Summary |
|---:|---|---|---|
| 📌 | **From SaaS to SaaW: When a Codebase Starts “Developing Itself”** | [Research Center 中文](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-10-saaw-software-as-an-agent-worker) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/industry/2026-08-10-saaw-software-as-an-agent-worker) | Derives SaaW from governance, TMPA, FCoP, Agent PC, CodeFlowMu, and Self-Morphing while separating verified capabilities from the research frontier. |
| 01 | **Trace Is Not Governance: From Work Facts to SaaW** | [Research Center 中文](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-14-trace-governance-saaw-visual-essay) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/industry/2026-08-14-trace-governance-saaw-visual-essay) · [CSDN 中文](https://blog.csdn.net/m0_51507544/article/details/163735963) · [Juejin 中文](https://juejin.cn/spost/7673436957741105167) · [DEV English](https://dev.to/joinwell52/trace-is-not-governance-from-work-facts-to-saaw-im4) · [Cursor Forum English](https://forum.cursor.com/t/trace-is-not-governance-from-work-facts-to-saaw/168318) | Starts from the boundary between Trace and Governance, then connects TMPA, FCoP, CodeFlowMu, the Meta-Development Runtime, and governed Self-Morphing into an engineering path toward SaaW. |
| 02 | **One Agent Said “Done.” Why Didn't the Team Release It?** | [Research Center 中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-08-06-codeflowmu-multi-agent-fact-checking) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-08-06-codeflowmu-multi-agent-fact-checking) · [CSDN 中文](https://blog.csdn.net/m0_51507544/article/details/163676669) · [Juejin 中文](https://juejin.cn/post/7672981090315976756) · [DEV English](https://dev.to/joinwell52/one-agent-said-done-why-didnt-the-team-release-it-518j) | Shows how DEV, subexecution, PM, and QA rebuilt disk, Git, report, and test evidence before accepting a completion claim. |
| 03 | **Agent Capabilities Are Being Packaged as Skills, Plugins, and Contracts** | [Research Center 中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-08-02-agent-capability-packaging) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-08-02-agent-capability-packaging) · [CSDN 中文](https://blog.csdn.net/m0_51507544/article/details/163677686) · [DEV English](https://dev.to/joinwell52/open-source-engineering-weekly-002-agent-capability-is-being-packaged-as-skills-plugins-and-1db5) | Reusable agent capability is moving from hidden prompts toward inspectable skills, plugins, interfaces, workflow nodes, events, and minimum capability contracts. |
| 04 | **Durable Agent Runtime Is Becoming the Baseline** | [Research Center 中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-08-02-durable-agent-runtime) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-08-02-durable-agent-runtime) · [CSDN 中文](https://blog.csdn.net/m0_51507544/article/details/163677784) · [DEV English](https://dev.to/joinwell52/open-source-engineering-weekly-001-durable-agent-runtime-is-becoming-the-baseline-2oim) | LangGraph, OpenHands, CrewAI, and AutoGen show that durable state, interruption, recovery, isolation, observability, and explicit completion control are becoming runtime fundamentals. |
| 05 | **A Checkpoint Is Not Permission to Resume** | [Research Center 中文](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-25-checkpoint-not-permission-to-resume) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/industry/2026-08-25-checkpoint-not-permission-to-resume) · [OpenAI API · full research article](https://community.openai.com/t/a-checkpoint-is-not-permission-to-resume/1393735) | Analyzes uncertain Session writes, authoritative-history reconciliation, and continuation authority, retaining the multi-worker and external-effect limitations. |
| 06 | **Approval Caches Need an Authorization Identity** | [Research Center 中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-08-28-approval-caches-need-authorization-identity) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-08-28-approval-caches-need-authorization-identity) · [OpenAI Forum · Codex · full research article](https://community.openai.com/t/approval-caches-need-an-authorization-identity/1393740) · [Codex General · full research article](https://github.com/openai/codex/discussions/41780) | Analyzes authorization identity and use-time revalidation using Guardian implementation and concurrency regression evidence, including version-input and effect-time limitations. |
| 07 | **Response Loss and Durable Task-Creation Idempotency** | [Research Center 中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-08-28-response-loss-idempotency) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-08-28-response-loss-idempotency) · [CSDN 中文](https://blog.csdn.net/m0_51507544/article/details/164213813) · [Juejin 中文](https://juejin.cn/post/7679985418771677222) · [DEV English](https://dev.to/joinwell52/the-task-was-created-but-the-response-was-lost-making-agent-retries-idempotent-4n6g) | Connects a historical response-loss experiment to V2.1.2 submission identities, canonical digests, durable recovery receipts, and independent retry/concurrency QA. |
| 08 | **Session Identity Is a Verified Binding, Not a Caller Claim** | [Research Center 中文](https://joinwell52-ai.github.io/joinwell52/zh/digital-employee/2026-08-28-skill-session-evidence) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/digital-employee/2026-08-28-skill-session-evidence) · [CSDN 中文](https://blog.csdn.net/m0_51507544/article/details/164214279) · [Juejin 中文](https://juejin.cn/post/7680002145984020489) · [DEV English](https://dev.to/joinwell52/a-session-id-in-a-log-is-not-proof-verifying-agent-skill-invocation-identity-5e47) | Explains SessionStore verification, invalid claims and legitimate sessionless calls while keeping invocation evidence separate from accepted engineering results. |
| 09 | **Safe Activity Projections for Runtime Consumers** | [Research Center 中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-08-28-event-consumer-visibility) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-08-28-event-consumer-visibility) · [CSDN 中文](https://blog.csdn.net/m0_51507544/article/details/164214563) · [Juejin 中文](https://juejin.cn/post/7679986697707044910) · [DEV English](https://dev.to/joinwell52/stop-returning-internal-event-objects-safe-projections-for-agent-runtime-consumers-2ajj) | Uses a live-query marker and independent QA to verify recursive server-bound projections, preserving required fields and internal audit evidence. |
| 10 | **Is Cursor Becoming the iOS for Agents?** | [Research Center 中文](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-09-03-cursor-agent-ios) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/industry/2026-09-03-cursor-agent-ios) · [Cursor Forum · original discussion](https://forum.cursor.com/t/is-cursor-becoming-the-ios-for-agents/170531) · [DEV English](https://dev.to/joinwell52/is-cursor-becoming-the-ios-for-agents-124h) · [CSDN 中文](https://blog.csdn.net/m0_51507544/article/details/164365110) · [掘金 中文](https://juejin.cn/post/7681487789833895974) · [知乎 中文](https://zhuanlan.zhihu.com/p/2079194386542473332) | Explores Cursor's platform direction through self-hosted machines, long-lived agents and subscriptions, distinguishing generic agent capabilities from enterprise-specific digital employees. |
| 11 | **The Test Results Are Empty. Why Does the System Still Say Verified?** | [Research Center 中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-09-03-empty-test-results-verified) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-09-03-empty-test-results-verified) · [DEV English](https://dev.to/joinwell52/the-test-results-are-empty-why-does-the-system-still-say-verified-2e04) · [CSDN 中文](https://blog.csdn.net/m0_51507544/article/details/164365303) · [掘金 中文](https://juejin.cn/post/7681462243145793562) | Separates empty test results from successful verification and examines evidence completeness in an agent verification chain. |
| 12 | **The Process Is Alive. Is It Still the Original Executor?** | [Research Center 中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-09-03-process-alive-owner-identity) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-09-03-process-alive-owner-identity) · [DEV English](https://dev.to/joinwell52/the-process-is-alive-is-it-still-the-original-executor-2an8) · [CSDN 中文](https://blog.csdn.net/m0_51507544/article/details/164366411) · [掘金 中文](https://juejin.cn/post/7681330790684917806) | Distinguishes process liveness, executor identity and valid ownership before interruption recovery. |
| 13 | **You Approved One Command. Why Did Another Pass? An Experiment in Agent Authorization Identity** | [Research Center 中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-09-04-approval-operation-identity) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-09-04-approval-operation-identity) · [DEV English](https://dev.to/joinwell52/you-approved-one-command-why-did-another-pass-an-experiment-in-agent-authorization-identity-3poh) · [掘金 中文](https://juejin.cn/post/7681580786830983209) · [CSDN 中文 — submitted, pending review](https://blog.csdn.net/m0_51507544/article/details/164377469) | Examines whether an approval digest reliably binds the approved command to the action actually executed. |
| 14 | **MIIT Document No. 414 Explained: From Model Supply to Application Delivery** | [Research Center 中文](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-09-04-miit-414-ai-application-delivery) · [Research Center English](https://joinwell52-ai.github.io/joinwell52/en/industry/2026-09-04-miit-414-ai-application-delivery) · [DEV English](https://dev.to/joinwell52/miit-document-no-414-explained-from-model-supply-to-application-delivery-37m9) · [掘金 中文](https://juejin.cn/post/7681481330958385215) · [知乎 中文](https://zhuanlan.zhihu.com/p/2079380092044710469) · [CSDN 中文 — submitted, pending review](https://blog.csdn.net/m0_51507544/article/details/164377809) | Explains how the policy and its five annexes organize service providers, resource pools, delivery teams and evaluation for sustained AI application delivery. |

Additional reference: [Digital Employee Production Machine Architecture V0.3.1 Draft](https://joinwell52-ai.github.io/joinwell52/en/digital-employee/architecture).

These outputs may interpret TMPA or inform future work, but they do not override Core S1.0.

## Repository map

```text
.
├── docs/
│   ├── en/ and zh/                  bilingual research site
│   └── public/
│       ├── spec/tmpa/s1.0/          machine-readable contracts
│       ├── releases/tmpa/v1.0/      checksummed publication dossier
│       └── evidence/tmpa/i1.0/      locked CodeFlowMu evidence
├── research/
│   ├── conformance/tmpa-core-s1.0/  Reference Reader, fixtures, results
│   ├── runtime/                      governed execution records
│   ├── intelligence/                 source registry and research signals
│   └── skills/                       staged research work contracts
├── scripts/                          validation, projection, and site tooling
└── .github/workflows/                validation, scheduling, Pages deployment
```

## Contribute, cite, and follow

- Research and contribution policy: [`CONTRIBUTING.md`](./CONTRIBUTING.md) · [`RESEARCH-GOVERNANCE.md`](./RESEARCH-GOVERNANCE.md)
- Citation metadata: [`CITATION.cff`](./CITATION.cff) · [V1.0 metadata](./docs/public/releases/tmpa/v1.0/metadata/)
- Rights and permitted use: [`LICENSE.md`](./LICENSE.md)
- Questions and proposals: [open an issue](https://github.com/joinwell52-AI/joinwell52/issues)

If this work helps you reason about accountable AI work, [**give the repository a Star**](https://github.com/joinwell52-AI/joinwell52) and share the specific artifact you found useful.

---

<p align="center">
  <strong>Zhu Wei / 朱卫 · joinwell52-AI</strong><br>
  <br>
  <a href="https://joinwell52-ai.github.io/joinwell52/">Digital Employee Works</a>
  ·
  <a href="https://doi.org/10.5281/zenodo.21888488">Zenodo DOI</a>
  ·
  <a href="./README.zh-CN.md">中文 README</a>
</p>
