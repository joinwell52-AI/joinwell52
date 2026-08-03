---
title: TMPA Architecture Paper — Academic Draft A0.5
outline: deep
---

<ArticleCover
  image="/assets/covers/tmpa-paper.svg"
  kicker="Research Paper"
  title="TMPA Architecture Paper"
  summary="An AI-native software architecture theory for governed multi-agent organizational work in SMEs."
  version="A0.5"
  status="Academic working draft"
  languageHref="/zh/publications/tmpa-architecture-paper-a0.5"
  languageLabel="简体中文"
/>

# TMPA: Textual Multi-Agent Process Architecture

## An AI-Native Software Architecture Theory for Governed Multi-Agent Organizational Work in SMEs

> **Architecture Paper Draft:** A0.5<br>
> **Historical Source Baseline:** TMPA Draft V1.0-R23; theory aligned through R31<br>
> **Status:** Academic Working Draft<br>
> **Revision Date:** 2026-08-03<br>
> **Publication Authority:** This GitHub document is the authoritative TMPA architecture paper. The separately maintained TMPA Core Specification is normative; the Implementation Case Report is evidentiary and non-normative.
# Abstract

Large language models are moving from isolated question answering into long-running, tool-using, and multi-agent execution. Tool traces and conversation histories may show what occurred, but they do not by themselves establish authorized responsibility, legal lifecycle transitions, independent review, or recoverable governance state.

This paper presents **TMPA (Textual Multi-Agent Process Architecture)**, an SME-first, minimal-infrastructure **textual-message multi-agent asynchronous process architecture**. Its core has four linked rules: **text carries durable messages and state; each writer preserves a local serial stream; multiple streams progress asynchronously to form parallel collaboration; and readers aggregate the available evidence and reconstruct process, responsibility, lifecycle, conflict, and audit state**. One stable primary carrier anchors each governed work item; subsequent reports, reviews, decisions, and corrections remain separate single-writer objects. Reconstruction preserves concurrency and unresolved conflict rather than imposing an artificial total order.

FCoP is the project-visible filesystem profile examined in this paper. It requires no mandatory coordination database, broker, or enterprise control plane, but it also does not by itself provide verified enterprise identity, strong role isolation, tamper-resistant storage, or Byzantine resilience. TMPA is therefore **SME-first, not SME-only**: larger implementations may preserve the same semantics through databases, object stores, event services, identity systems, and control planes.

The study follows a design-science method: it derives requirements from the governance gap and engineering lineage, constructs the TMPA artifact, analyzes its invariants and threat boundaries, maps the artifact to the FCoP reference profile, and evaluates bounded CodeFlowMu and XiaoDian AI evidence through a version-pinned C01–C14 corpus. The contribution is the integrated architecture—not a new storage primitive—and the evaluation is deliberately claim-bounded. Under the I0.4/S0.4 re-adjudication, **one product criterion passes, nine remain partial, and four were not run at product-reader level**; the separate Reference Reader passes 14 synthetic criteria. No executed product criterion failed, but that is not full conformance or independent validation. The evidence supports structural feasibility while low-resource performance, adoption cost, comparison baselines, broader fault recovery, and third-party reproduction remain open empirical requirements.

**Keywords:** AI governance, agentic AI, multi-agent systems, SMEs, minimal infrastructure, textual messages, primary carrier, single-writer streams, asynchronous collaboration, deterministic reconstruction, lifecycle, role separation, provenance, auditability, recoverability, FCoP, CodeFlowMu

---
# 1. Introduction

Large language models have transformed artificial intelligence from isolated reasoning systems into execution systems that use tools, modify files, query databases, operate business software, and collaborate over long-running tasks. Correct output remains necessary, but deployable systems must also preserve the authority, responsibility, and evidence surrounding that output.

A governed multi-agent system must answer who authorized and accepted work, which object represented it, which evidence was produced, who reviewed and decided, whether transitions were legal, and whether the process can be reconstructed after interruption. Logs, chats, workflow states, and business records may contribute evidence, but they do not automatically define an authoritative governance state.

**TMPA (Textual Multi-Agent Process Architecture)** addresses this gap without governing how agents think or replacing agent frameworks, identity providers, runtime gateways, transports, or storage systems. It defines a cross-platform process-responsibility contract through four operational statements:

> **Text carries messages and state.**  
> **Each writer preserves its own serial stream.**  
> **Multiple serial streams progress asynchronously to form parallel collaboration.**  
> **Readers aggregate the streams and reconstruct process and governance state.**

One stable primary carrier anchors each governed task. Acceptance, reports, reviews, decisions, corrections, and recovery evidence are independently authored objects linked by explicit references. The write side is locally serial and single-writer; the system is asynchronously parallel; the read side reconstructs a partial-order graph and issue set.

The paper uses three orientation views:

```text
DESIGN-SCIENCE LINEAGE
business practice → original TMPA → FCoP extraction and maturation
                  → CodeFlowMu application → current TMPA formalization

CURRENT CONCEPTUAL LAYERING
TMPA architecture → reusable FCoP protocol profile → CodeFlowMu and other applications

END-TO-END PROCESS
write: primary carrier → single-writer streams → asynchronous composition
read:  source aggregation → governance reader → process graph + issue set
```

The lineage explains origin, the conceptual relation explains present boundaries, and the process view explains operation. None implies that FCoP exhausts TMPA, CodeFlowMu defines FCoP, or the original March 2026 pipeline already satisfied the current Core specification.

One optional application context, specified separately in Section 8.3, is a persistent AI work role sometimes described in industry as a **digital employee**. Throughout this paper, that label denotes only an engineering work identity that accepts delegated work, uses tools, and submits results across sessions; it does **not** imply legal employment, personhood, consciousness, human intention, or replacement of accountable human or organizational principals.

## 1.1 Paper Type and Research Questions

This paper is a design-science and systems-architecture study. The designed artifact is TMPA; the companion Core Specification defines its normative behavior, while this paper explains the problem, theory, design logic, and evaluation. The primary environment is an SME or small team in which governance must begin without assuming a dedicated agent platform, coordination database, message broker, enterprise identity plane, or specialist operations team. FCoP and CodeFlowMu provide implementation and demonstration evidence, but the study does not claim a representative benchmark, production-scale validation, or superiority over enterprise governance platforms.

The paper addresses three research questions:

- **RQ1 — Governance-state sufficiency:** Which information is missing when chats, shared folders, execution traces, and ordinary task states are used as the record of multi-agent organizational work, and why does that prevent authoritative responsibility and recovery?
- **RQ2 — Minimum architecture:** Which substrate-independent objects, authority relations, lifecycle rules, ordering constraints, conflict semantics, and read-side operations are minimally necessary to reconstruct governed multi-agent work without a mandatory coordination database, broker, or control plane?
- **RQ3 — Engineering feasibility and boundary:** To what extent do the FCoP profile, CodeFlowMu, XiaoDian AI, and the pinned C01–C14 corpus demonstrate those properties, and which feasibility claims remain unsupported?

A0.5 answers RQ1 through evidence-gap analysis and RQ2 through the TMPA object, stream, authority, lifecycle, and reconstruction model. RQ3 receives only a bounded answer: the reference profile and cases establish partial feasibility, while the I0.4/S0.4 baseline reports one PASS, nine PARTIAL, and four NOT RUN product-level criteria [28]. Quantified setup burden, low-resource performance, broader fault recovery, comparison baselines, representative use, and third-party reproduction remain unfinished evidence.

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

> **Text-carried, locally serial, asynchronously parallel, deterministically reconstructed.**

The primary profile is asynchronous project-local collaboration, not distributed consensus or multi-datacenter execution. Participants need not be online together, and evidence may arrive late; the reader exposes the authoritative, partial, disputed, or quarantined view supported by the currently available set. Database-backed and enterprise profiles remain possible, but identity federation, replication, high availability, and cross-domain enforcement are outside the present validation scope.

## 1.3 Design Origin and Evolution

TMPA first appeared on 21 March 2026 in Section 7.0 of the archived multi-role architecture plan as **Text-Message Multi-AI Parallel Architecture** [25]. The original design joined one-task-one-carrier, files or objects as messages, asynchronous AI requests, independent task lines, role pipelines, permission checks, and audit traces.
