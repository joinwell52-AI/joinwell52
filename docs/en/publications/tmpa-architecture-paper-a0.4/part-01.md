---
title: TMPA Architecture Paper — Draft A0.4
outline: deep
---

<ArticleCover
  image="/assets/covers/tmpa-paper.svg"
  kicker="Research Paper"
  title="TMPA Architecture Paper"
  summary="An AI-native software architecture theory for governed multi-agent organizational work in SMEs."
  version="A0.4"
  status="Public working draft"
  languageHref="/zh/publications/tmpa-architecture-paper-a0.4"
  languageLabel="简体中文"
/>

# TMPA: Textual Multi-Agent Process Architecture

## An AI-Native Software Architecture Theory for Governed Multi-Agent Organizational Work in SMEs

> **Architecture Paper Draft:** A0.4  
> **Historical Source Baseline:** TMPA Draft V1.0-R23; theory aligned through R31
> **Status:** Publication Working Draft  
> **Revision Date:** 2026-07-31  
> **Publication Authority:** This GitHub document is the authoritative TMPA architecture paper. The separately maintained TMPA Core Specification is normative; the Implementation Case Report is evidentiary and non-normative.
# Abstract

Large language models are moving from isolated question answering into long-running, tool-using, and multi-agent execution. Tool traces and conversation histories may show what occurred, but they do not by themselves establish authorized responsibility, legal lifecycle transitions, independent review, or recoverable governance state.

This paper presents **TMPA (Textual Multi-Agent Process Architecture)**, an SME-first, minimal-infrastructure **textual-message multi-agent asynchronous process architecture**. Its core has four linked rules: **text carries durable messages and state; each writer preserves a local serial stream; multiple streams progress asynchronously to form parallel collaboration; and readers aggregate the available evidence and reconstruct process, responsibility, lifecycle, conflict, and audit state**. One stable primary carrier anchors each governed work item; subsequent reports, reviews, decisions, and corrections remain separate single-writer objects. Reconstruction preserves concurrency and unresolved conflict rather than imposing an artificial total order.

FCoP is the project-visible filesystem profile examined in this paper. It requires no mandatory coordination database, broker, or enterprise control plane, but it also does not by itself provide verified enterprise identity, strong role isolation, tamper-resistant storage, or Byzantine resilience. TMPA is therefore **SME-first, not SME-only**: larger implementations may preserve the same semantics through databases, object stores, event services, identity systems, and control planes.

TMPA originated in March 2026 as **Text-Message Multi-AI Parallel Architecture** within a multi-role business system; FCoP was later extracted and matured as a reusable protocol, then adopted by CodeFlowMu. The present paper formalizes that lineage as a design-science contribution with normative objects, invariants, reader behavior, threat boundaries, and conformance criteria. In an initial author-run, version-pinned C01–C14 baseline, **two criteria pass, eight remain partial, and four were not run at product-reader level**. No criterion with a direct gating test failed in that run, but this is not equivalent to full execution or independent validation. All 14 fixture oracles match their internal expected outputs. Evidence remains separated into **specified**, **implemented**, **demonstrated**, and **independently adopted** levels; low-resource performance, adoption cost, interoperability, stronger security, and independent reproduction remain empirical requirements.

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

CURRENT CONCEPTUAL RELATION
TMPA architecture → reusable FCoP protocol subset → downstream applications

END-TO-END PROCESS
write: primary carrier → single-writer streams → asynchronous composition
read:  source aggregation → governance reader → process graph + issue set
```

The lineage explains origin, the conceptual relation explains present boundaries, and the process view explains operation. None implies that FCoP exhausts TMPA, CodeFlowMu defines FCoP, or the original March 2026 pipeline already satisfied the current Core specification.

One optional application context, specified separately in Section 11.6, is a persistent AI work role sometimes described in industry as a **digital employee**. Throughout this paper, that label denotes only an engineering work identity that accepts delegated work, uses tools, and submits results across sessions; it does **not** imply legal employment, personhood, consciousness, human intention, or replacement of accountable human or organizational principals.

## 1.1 Paper Type and Research Questions

This paper is organized as a design-science and systems-architecture study. The designed artifact is TMPA; the embedded schema, lifecycle rules, reader semantics, and conformance criteria state how the artifact can be inspected and tested. The primary design environment is an SME or small-team setting in which governance must begin without assuming a dedicated agent platform, coordination database, message broker, enterprise identity plane, or specialist operations team. FCoP and CodeFlowMu provide implementation and demonstration evidence, but the current paper does not claim a representative benchmark, production-scale validation, or superiority over enterprise governance platforms.

The paper addresses three research questions:

- **RQ1 — SME governance gap:** Why are chats, shared folders, execution traces, and ordinary task states insufficient to establish an authoritative and recoverable governance state for multi-agent work in organizations with limited AI infrastructure?
- **RQ2 — Minimum asynchronous process structure:** In the absence of a dedicated coordination database, message broker, and agent control plane, which minimum properties must still hold for durable textual messages and state, one-task-one-primary-carrier, single-writer serial streams, asynchronous multi-stream progress, role attribution, lifecycle legality, review separation, conflict preservation, deterministic reconstruction, and recovery?
- **RQ3 — Feasibility of the lightweight profile:** Can FCoP realize this complete message-flow architecture through one task carrier, independently authored textual artifacts, asynchronous project-local workers, source-preserving aggregation, and deterministic governance reading on resource-constrained servers while keeping deployment, use, and maintenance burden appropriate for the target SME environment?

The current draft answers RQ1 and the structural part of RQ2 through architectural analysis and normative requirements, then reports a first pinned C01–C14 baseline in which two criteria pass, eight remain partial, and four were not run at product-reader level [28]. No directly executed gating criterion failed, but the run does not constitute complete conformance. RQ3 is addressed through engineering artifacts, selected executable suites, and bounded cases while quantified setup burden, low-resource performance, broader fault recovery, comparison baselines, and third-party reproduction remain unfinished evidence.

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
