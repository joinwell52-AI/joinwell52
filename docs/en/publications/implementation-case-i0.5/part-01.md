---
title: TMPA–FCoP–CodeFlowMu Implementation Case — Draft I0.5
outline: deep
---

<ArticleCover
  image="/assets/covers/implementation-case.svg"
  kicker="Engineering Case"
  title="TMPA Implementation Case"
  summary="The S0.4 engineering baseline and a WP-13 multi-agent evidence-gating and fact-checking case."
  version="I0.5"
  status="S0.4 engineering evidence draft"
  languageHref="/zh/publications/implementation-case-i0.5"
  languageLabel="简体中文"
/>

# TMPA Implementation and Case Report

## S0.4 Reference Reader, FCoP, CodeFlowMu, and the WP-13 Multi-Agent Fact Check

> **Document Version:** Draft I0.5<br>
> **Status:** Author-Produced Implementation and Case Report<br>
> **Normative Target:** TMPA Core S0.4<br>
> **Historical Evidence Baseline:** I0.3 / S0.3 corpus<br>
> **Report and Execution Date:** 2026-08-03; WP-13 case observed 2026-08-05<br>
> **Conformance Corpus:** `tmpa-s0.4-fcop-codeflowmu-20260803`<br>
> **Authority Boundary:** This report is evidentiary and non-normative. TMPA Core requirements are defined only by the GitHub Core Specification.

## Abstract

This report advances the implementation case from an unavailable S0.3-era archive to a public, executable S0.4 corpus. I0.5 retains the I0.4 Reference Reader, C01–C14 fixtures, manifests, result envelopes, product-evidence assertions, and one-command runner, and adds the WP-13 field case. In that case, a subexecution produced a completion-meaning claim without confirmed exit status, tests, commit, or formal report. PM withheld release on persistent facts; DEV then completed the same task after tool recovery, followed by role-separated QA.

The FCoP protocol defines a project-visible coordination profile in which routed textual artifacts, lifecycle paths, atomic rename, append-only transition evidence, role bindings, reviews, issues, alerts, and inspection reports remain available outside transient sessions. Its reference implementation provides bounded executable evidence for those rules. CodeFlowMu adopts the protocol for persistent work identities, task/report flows, review gates, dependency waiting, recovery, and archival history. XiaoDian AI contributes pre-specification field evidence from a governed NL2SQL pipeline, including retained pass and rejection paths.

The S0.4 Reference Reader reports **14 PASS** against its author-produced synthetic fixture suite. The separately evaluated FCoP–CodeFlowMu product baseline remains **1 PASS, 9 PARTIAL, 4 NOT RUN, and 0 FAIL**, with aggregate verdict `PARTIAL`. WP-13 strengthens author-produced `demonstrated` evidence related to C04, C06, C07, and C13, but it did not execute a new S0.4 product-reader criterion. The verdicts are therefore not relabeled, and no independent-validation claim is made.

# 1. Scope and Evidence Boundary

This report asks what the S0.4 Reference Reader implements, what the fixed product evidence demonstrates, and which S0.4 product requirements remained unexecuted. It is evidentiary and nonnormative. Its verdicts are preserved against the historical S0.4 target; the current [TMPA Core Specification S0.5](/en/publications/tmpa-core-specification-s0.5) defines current requirements and canonical test meanings, and I0.5 does not claim S0.5 conformance. The [Architecture Paper A0.5](/en/publications/tmpa-architecture-paper-a0.5) explains the theory.

Evidence classes remain **specified**, **implemented**, **demonstrated**, and **independently adopted**. The Reference Reader is implemented and author-demonstrated. The product baseline contains mixed implemented/demonstrated evidence and remains `PARTIAL`. Fixture success is not converted into FCoP or CodeFlowMu product conformance, and no independent-adoption or independent-validation claim is made.

# 2. Engineering Lineage and Component Boundaries

```text
CURRENT CONCEPTUAL LAYERING
TMPA architecture → reusable FCoP protocol profile → CodeFlowMu and other applications

HISTORICAL LINEAGE
XiaoDian AI practice → original TMPA → FCoP extraction and maturation
                    → CodeFlowMu application → current TMPA formalization
```

FCoP defines a protocol profile over a file-based subset of TMPA semantics. The `fcop` and `fcop-mcp` packages are its reference implementation; CodeFlowMu is a downstream application that adopts the protocol as coordination and governance infrastructure. FCoP does not exhaust TMPA; CodeFlowMu does not define FCoP; XiaoDian AI is lineage and field evidence rather than a product-level TMPA reader.

Terminology follows Section 2 of the Core Specification. In particular, **governance object** is a semantic unit, **source artifact** is a physical observation, **governance reader** is the deterministic reconstruction stage, and `valid` / `invalid` / `undetermined` are the only semantic governance judgments. This report does not introduce alternative meanings.

FCoP uses ordinary filesystem artifacts and operating-system operations as a project-visible coordination surface. CodeFlowMu combines FCoP operations with agent sessions, runtime scheduling, role interfaces, business workflows, approval paths, recovery controls, and user-facing views. XiaoDian AI contributes permission, validation, NL2SQL, policy-gate, rejection, and audit evidence.

# 3. FCoP Protocol and Reference-Implementation Evidence

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
