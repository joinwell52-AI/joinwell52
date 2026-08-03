---
title: TMPA–FCoP–CodeFlowMu Implementation Case — Draft I0.3
outline: deep
---

<ArticleCover
  image="/assets/covers/implementation-case.svg"
  kicker="Engineering Case"
  title="TMPA Implementation Case"
  summary="Engineering evidence from FCoP, CodeFlowMu and XiaoDian AI, including the pinned C01–C14 baseline."
  version="I0.3"
  status="Public working draft"
  languageHref="/zh/publications/implementation-case-i0.3"
  languageLabel="简体中文"
/>

# TMPA Implementation and Case Report

## FCoP, CodeFlowMu, XiaoDian AI, and the First C01–C14 Baseline

> **Document Version:** Draft I0.3  
> **Status:** Author-Produced Implementation and Case Report  
> **Historical Evidence Baseline:** TMPA Draft V1.0-R24<br>
> **Report Date:** 2026-07-31  
> **Editorial Revision Date:** 2026-08-02<br>
> **Conformance Corpus:** `tmpa-draft-v1-c01-c14-20260731`
> **Authority Boundary:** This report is evidentiary and non-normative. TMPA Core requirements are defined only by the GitHub Core Specification.

## Abstract

This report documents how TMPA emerged in engineering practice and how a defined subset is realized through FCoP, CodeFlowMu, and selected XiaoDian AI evidence. It separates product mechanisms, observed cases, and criterion-level conformance results.

FCoP realizes a project-visible coordination profile in which routed textual artifacts, lifecycle paths, atomic rename, append-only transition evidence, role bindings, reviews, issues, alerts, and inspection reports remain available outside transient sessions. CodeFlowMu adopts FCoP for persistent work identities, task/report flows, review gates, dependency waiting, recovery, and archival history. XiaoDian AI contributes pre-specification field evidence from a governed NL2SQL pipeline, including retained pass and rejection paths.

The first version-pinned C01–C14 corpus fixes FCoP `3.2.4` at commit `da79dfefd99f597c9e422ce9edec22157f915a21`, CodeFlowMu `V1.2.3` at commit `8f342d028eb66e77d135bea58fdbc7f2d0627e3b`, and selected XiaoDian evidence by SHA-256. It records 325 evidence-file hashes and reports **2 PASS, 8 PARTIAL, and 4 NOT RUN** at product level. No directly executed gating criterion failed, but this is not full conformance. The dominant gap is a unified read-only evidence-graph adapter.

# 1. Scope and Evidence Boundary

This report asks which TMPA mechanisms FCoP realizes, how CodeFlowMu uses them, what XiaoDian AI demonstrates, and what the first fixed-version C01–C14 execution established. It is evidentiary and nonnormative; the [TMPA Core Specification S0.3](/en/publications/tmpa-core-specification-s0.3) alone defines the requirements and canonical test meanings, while the [Architecture Paper A0.4](/en/publications/tmpa-architecture-paper-a0.4) explains the theory.

Evidence classes are **specified**, **implemented**, **demonstrated**, and **independently adopted**. Current evidence is strongest at the first three levels. Because the author is also the originator or principal developer of the evaluated systems, fixed versions and hashes are stated; PASS, PARTIAL, and NOT RUN remain separate; prerequisite failures are retained; fixture success is not converted into product conformance; and no independent-validation claim is made.

# 2. Engineering Lineage and Component Boundaries

```text
CURRENT CONCEPTUAL LAYERING
TMPA architecture → reusable FCoP protocol profile → CodeFlowMu and other applications

HISTORICAL LINEAGE
XiaoDian AI practice → original TMPA → FCoP extraction and maturation
                    → CodeFlowMu application → current TMPA formalization
```

FCoP realizes a defined file-based subset of TMPA. CodeFlowMu adopts FCoP as coordination and governance infrastructure. FCoP does not exhaust TMPA; CodeFlowMu does not define FCoP; XiaoDian AI is lineage and field evidence rather than a product-level TMPA reader.

Terminology follows Section 2 of the Core Specification. In particular, **governance object** is a semantic unit, **source artifact** is a physical observation, **governance reader** is the deterministic reconstruction stage, and `valid` / `invalid` / `undetermined` are the only semantic governance judgments. This report does not introduce alternative meanings.

FCoP uses ordinary filesystem artifacts and operating-system operations as a project-visible coordination surface. CodeFlowMu combines FCoP operations with agent sessions, runtime scheduling, role interfaces, business workflows, approval paths, recovery controls, and user-facing views. XiaoDian AI contributes permission, validation, NL2SQL, policy-gate, rejection, and audit evidence.

# 3. FCoP Engineering Realization

## 3.1 Durable Textual Message and State Surface

FCoP treats the project filesystem as a durable textual message and state surface: **files carry protocol, paths address state, and events replay transitions**. A routed `TASK-*` artifact serves as a stable work anchor; reports, reviews, issues, alerts, and decisions are separate linked artifacts; filenames carry routing metadata; lifecycle directories expose current state; atomic rename performs lifecycle movement; transition evidence records how state was reached; and artifacts remain inspectable after the originating session ends.

## 3.2 Agent-Visible Role Binding

Governed participation begins with an explicit role binding visible to the agent. It identifies active role, collaboration context, scope, permitted/prohibited actions, and independent review or escalation roles. This is operational protocol identity, not cryptographic or legal identity.

## 3.3 Lifecycle

```text
inbox → active → review → done → archive → history
           ↑        |
           └─ reject┘
```

| Action | Source | Target | Typical authority |
|---|---|---|---|
| `create_task` | — | `inbox` | task creator |
| `claim_task` | `inbox` | `active` | assigned executor |
| `submit_task` | `active` | `review` | responsible executor |
| `approve_task` | `review` | `done` | reviewer or approver |
| `reject_task` | `review` | `active` | reviewer |
| `finish_task` | `active` | `done` | profile-authorized role |
| `archive_task` | `done` | `archive` | archival authority |
| `archive_to_history` | `archive` | `history/...` | archival authority |

Path represents current state under the profile; transition evidence records history. Inconsistency is an issue, not silently repaired state.

## 3.4 Routing, Atomic Publication, and Recovery

A reference filename is `{TYPE}-{YYYYMMDD}-{NNN}-{SENDER}-to-{RECIPIENT}(-slug).md`. Filename is transport envelope; body and schema carry complete meaning. Atomic publication uses write-to-temporary and rename where supported. Recovery reconstructs task identity, current lifecycle, responsibility, linked evidence, unresolved dependencies, and issues from persistent artifacts rather than hidden session context.
