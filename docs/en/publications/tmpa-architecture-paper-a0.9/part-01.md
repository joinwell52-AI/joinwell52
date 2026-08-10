---
title: TMPA Architecture Paper — Pre-Submission Review Draft A0.9
outline: deep
citation:
  work: TMPA Architecture Paper
  identifier: TMPA-ARCH-A0.9
  language: en
  metadata: /releases/tmpa/v1.0-rc1/metadata/architecture-paper.en.cff
---

<ArticleCover
  image="/assets/covers/tmpa-paper.svg"
  kicker="Research Paper"
  title="TMPA Architecture Paper"
  summary="An AI-native software architecture theory for governed multi-agent organizational work in SMEs."
  version="A0.9"
  status="Pre-submission review draft"
  languageHref="/zh/publications/tmpa-architecture-paper-a0.9"
  languageLabel="简体中文"
/>

# TMPA: Textual Multi-Agent Process Architecture

## An AI-Native Software Architecture Theory for Governed Multi-Agent Organizational Work in SMEs

> **Architecture Paper Draft:** A0.9<br>
> **Historical Source Baseline:** TMPA Draft V1.0-R23; theory aligned through R31<br>
> **Status:** Pre-Submission Review Draft<br>
> **Revision Date:** 2026-08-10<br>
> **Publication Authority:** This GitHub document is the authoritative TMPA architecture paper. The separately maintained TMPA Core Specification is normative; the Implementation Case Report is evidentiary and non-normative.

**Author:** Zhu Wei, joinwell52 Research Center<br>
**Public correspondence:** [joinwell52-AI/joinwell52](https://github.com/joinwell52-AI/joinwell52)<br>
**Document identifier:** TMPA-ARCH-A0.9<br>
**Review note:** This public author-identified version requires anonymization if submitted to a double-blind venue.
# Abstract

Large language models are moving from isolated question answering into long-running, tool-using, and multi-agent execution. Tool traces and conversation histories may show what occurred, but they do not by themselves establish authorized responsibility, legal lifecycle transitions, independent review, or recoverable governance state.

This paper presents **TMPA (Textual Multi-Agent Process Architecture)**, an SME-first, minimal-infrastructure **textual-message multi-agent asynchronous process architecture**. Its core has four linked rules: **text carries durable messages and state; each writer preserves a local serial stream; multiple streams progress asynchronously to form parallel collaboration; and readers aggregate the available evidence and reconstruct process, responsibility, lifecycle, conflict, and audit state**. One stable primary carrier anchors each governed work item; subsequent reports, reviews, decisions, and corrections remain separate single-writer objects. Reconstruction preserves concurrency and unresolved conflict rather than imposing an artificial total order.

FCoP is the project-visible filesystem profile examined in this paper. It requires no mandatory coordination database, broker, or enterprise control plane, but it also does not by itself provide verified enterprise identity, strong role isolation, tamper-resistant storage, or Byzantine resilience. TMPA is therefore **SME-first, not SME-only**: larger implementations may preserve the same semantics through databases, object stores, event services, identity systems, and control planes.

In the current publication architecture, **TMPA theory guides the engineering direction of CodeFlowMu**. The Core Specification turns that theory into normative objects, Reader behavior, and conformance criteria; FCoP carries the file-based coordination protocol; and CodeFlowMu implements the governed roles, workflows, review, recovery, and audit mechanisms in a running engineering system. This guidance relation is distinct from the historical feedback through which FCoP and CodeFlowMu also helped refine the later formalization.

Following established design-science methodology [34], [35], the study diagnoses the governance-state problem, derives design requirements, constructs the TMPA artifact, demonstrates it through the FCoP protocol profile and downstream cases, and evaluates both architectural invariants and version-pinned C01–C14 evidence. The contribution is an integrated governance architecture—not a new storage primitive, runtime, or truth oracle—and the evaluation is deliberately claim-bounded. Against the exact TMPA Core S0.6 bundle, the CodeFlowMu V1.6.0 product Reader records **14 PASS, 0 PARTIAL, 0 NOT RUN, and 0 FAIL**; the separate S0.6 Reference Reader also passes 14 synthetic criteria. A self-contained public reproducer verifies the seven normative input hashes and reruns the product slice without the private mother repository. These results strengthen implementation feasibility, but remain author-run evidence; low-resource performance, adoption cost, comparison baselines, representative use, and independent reproduction remain open empirical requirements.

**Keywords:** AI governance, agentic AI, multi-agent systems, SMEs, minimal infrastructure, textual messages, primary carrier, single-writer streams, asynchronous collaboration, deterministic reconstruction, lifecycle, role separation, provenance, auditability, recoverability, FCoP, CodeFlowMu

---
# 1. Introduction

Large language models have transformed artificial intelligence from isolated reasoning systems into execution systems that use tools, modify files, query databases, operate business software, and collaborate over long-running tasks. Correct output remains necessary, but deployable systems must also preserve the authority, responsibility, and evidence surrounding that output.

A governed multi-agent system must answer who authorized and accepted work, which object represented it, which evidence was produced, who reviewed and decided, whether transitions were legal, and whether the process can be reconstructed after interruption. Logs, chats, workflow states, and business records may contribute evidence, but they do not automatically define an authoritative governance state.

**TMPA (Textual Multi-Agent Process Architecture)** addresses this gap without governing how agents think or replacing agent frameworks, identity providers, runtime gateways, transports, or storage systems. It defines a cross-platform process-responsibility contract through four operational statements:

> **Text carries messages and state.**<br>
> **Each writer preserves its own serial stream.**<br>
> **Multiple serial streams progress asynchronously to form parallel collaboration.**<br>
> **Readers aggregate the streams and reconstruct process and governance state.**

One stable primary carrier anchors each governed task. Acceptance, reports, reviews, decisions, corrections, and recovery evidence are independently authored objects linked by explicit references. The write side is locally serial and single-writer; the system is asynchronously parallel; the read side reconstructs a partial-order graph and issue set.

The paper uses three orientation views:

```text
HISTORICAL CO-EVOLUTION
business practice → early TMPA method → FCoP extraction and maturation
                  → CodeFlowMu engineering implementation
FCoP + CodeFlowMu implementation feedback → current TMPA formalization

CURRENT GUIDANCE AND IMPLEMENTATION
TMPA theory and architecture
        ↓ formalized as normative behavior by
TMPA Core Specification
        ↓ projected through a file-based coordination profile
FCoP protocol
        ↓ used to implement governed work in
CodeFlowMu engineering system

END-TO-END PROCESS
write: primary carrier → single-writer streams → asynchronous composition
read:  source aggregation → governance reader → process graph + issue set
```

**Figure 1. TMPA orientation map: historical lineage, current layering, and operational reconstruction.**

The lineage explains origin and feedback; the guidance relation explains present authority and implementation direction; and the process view explains operation. Historical feedback does not reverse current authority: FCoP does not exhaust TMPA, CodeFlowMu does not define FCoP or TMPA, and the original March 2026 pipeline did not already satisfy the current Core Specification.

One optional application context, specified separately in Section 8.3, is a persistent AI work role sometimes described in industry as a **digital employee**. Throughout this paper, that label denotes only an engineering work identity that accepts delegated work, uses tools, and submits results across sessions; it does **not** imply legal employment, personhood, consciousness, human intention, or replacement of accountable human or organizational principals.

## 1.1 Paper Type and Research Questions

This paper is a design-science and systems-architecture study. The designed artifact is TMPA; the companion Core Specification defines its normative behavior, while this paper explains the problem, theory, design logic, and evaluation. The primary environment is an SME or small team in which governance must begin without assuming a dedicated agent platform, coordination database, message broker, enterprise identity plane, or specialist operations team. FCoP provides the protocol profile, while CodeFlowMu is the engineering system developed under TMPA guidance and evaluated as a bounded implementation. The study does not claim a representative benchmark, production-scale validation, or superiority over enterprise governance platforms.

The paper addresses three research questions:

- **RQ1 — Governance-state sufficiency:** Which information is missing when chats, shared folders, execution traces, and ordinary task states are used as the record of multi-agent organizational work, and why does that prevent authoritative responsibility and recovery?
- **RQ2 — Minimum architecture:** Which substrate-independent objects, authority relations, lifecycle rules, ordering constraints, conflict semantics, and read-side operations are minimally necessary to reconstruct governed multi-agent work without a mandatory coordination database, broker, or control plane?
- **RQ3 — Engineering feasibility and boundary:** To what extent do the FCoP profile, the pinned CodeFlowMu product evidence, WP-13, and the C01–C14 corpus demonstrate those properties, and which feasibility claims remain unsupported?

A0.9 answers RQ1 through evidence-gap analysis and RQ2 through the TMPA object, stream, authority, lifecycle, and reconstruction model. RQ3 receives a stronger but still bounded answer: CodeFlowMu V1.6.0 calls its own product Reader against the exact S0.6 inputs and records 14/14 product PASS, while a self-contained public reproducer makes that conformance slice inspectable [28]. The result is demonstrated under a fixed bundle, not independently adopted or certified. The WP-13 case separately shows why a completed agent trajectory is not automatically admissible governance evidence [36]. Quantified setup burden, low-resource performance, broader fault recovery, comparison baselines, representative use, and third-party reproduction remain unfinished evidence.

**Table 1. Research claims, supporting evidence, and prohibited inference.**

| Claim | Strongest support in this study | Inference not permitted |
|---|---|---|
| ordinary execution records are insufficient for governance reconstruction | problem analysis, DR1–DR8, failure and counterexample reasoning | that every chat, workflow, or event system necessarily fails |
| the TMPA object–stream–reader model is internally coherent | explicit invariants, lifecycle and authority model, determinism proof sketch, Core S0.6 | a universal mathematical proof of minimality |
| a file-based protocol and a TMPA-guided engineering system can realize a substantial subset | FCoP mapping, exact-input CodeFlowMu V1.6.0 product run, and public reproducer | conformance beyond the fixed S0.6 bundle, protocol validity inferred from package tests, or independent adoption |
| governed multi-agent cases can retain and qualify contested completion claims | CodeFlowMu and WP-13 evidence chains | elimination of hallucination, causal performance improvement, or independent adoption |

This matrix is the governing interpretation of the paper's contribution claims. Later implementation detail cannot enlarge a claim beyond the corresponding evidence and boundary shown here.

## 1.2 Target Environment and Design Constraints

The primary environment is an SME or small team that needs governed AI collaboration but lacks some combination of a dedicated agent platform, coordination database, message broker, enterprise agent identity infrastructure, and specialist operations staff. This scope is defined by capability constraints, not employee count alone.

The 2026 OECD D4SME Survey reports uneven strategic and secure AI integration among more than 2,000 SMEs across 12 OECD countries, with time, maintenance cost, and skills gaps remaining material obstacles [23]. Singapore's IMDA reported 2024 AI adoption of 14.5% among SMEs versus 62.5% among non-SMEs [24]. These sources do not establish demand for TMPA specifically; they support the broader problem of responsible AI integration under constrained organizational capacity.

The design constraints lead to the following chain:

```text
limited infrastructure and operations capacity
                    ↓
no mandatory database, broker, cluster, or control plane
                    ↓
one governed task → one stable primary textual carrier
                    ↓
locally serial single-writer responsibility streams
                    ↓
independent streams progress asynchronously
                    ↓
source aggregation → governance reconstruction
                    ↓
recoverable process, responsibility, and audit state
```

**Figure 2. Derivation of the minimum-infrastructure design constraints.**

> **Text-carried, locally serial, asynchronously parallel, deterministically reconstructed.**

The primary profile is asynchronous project-local collaboration, not distributed consensus or multi-datacenter execution. Participants need not be online together, and evidence may arrive late; the reader exposes the authoritative, partial, disputed, or quarantined view supported by the currently available set. Database-backed and enterprise profiles remain possible, but identity federation, replication, high availability, and cross-domain enforcement are outside the present validation scope.

## 1.3 Design Origin and Evolution

The author's private XiaoDian project archive reports that an early form of TMPA appeared in a March 2026 multi-role architecture plan under the name **Text-Message Multi-AI Parallel Architecture** [25]. Because that source has no fixed public snapshot, it is retained only as author-reported design lineage and is excluded from the evaluated corpus, RQ results, and conformance claims.
