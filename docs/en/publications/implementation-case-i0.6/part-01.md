---
title: TMPA–FCoP–CodeFlowMu Implementation Case — Draft I0.6
outline: deep
---

<ArticleCover
  image="/assets/covers/implementation-case.svg"
  kicker="Engineering Case"
  title="TMPA Implementation Case"
  summary="An S0.5 author-run engineering evidence baseline across the Reference Reader, FCoP, CodeFlowMu, and WP-13."
  version="I0.6"
  status="S0.5 engineering evidence draft"
  languageHref="/zh/publications/implementation-case-i0.6"
  languageLabel="简体中文"
/>

# TMPA Implementation and Case Report

## S0.5 Reference Reader, FCoP v3.2.5, CodeFlowMu Local Snapshot, and WP-13

> **Document Version:** Draft I0.6<br>
> **Status:** Author-produced implementation and case report<br>
> **Normative Target:** [TMPA Core Specification S0.5](/en/publications/tmpa-core-specification-s0.5)<br>
> **Historical Baseline:** I0.5 preserves the S0.4 corpus and WP-13 publication package<br>
> **Evidence Capture:** 2026-08-07, Asia/Shanghai<br>
> **Evidence Package:** `tmpa-i0.6-local-evidence-20260806-v2`<br>
> **Authority Boundary:** This report is evidentiary and non-normative. Only the Core Specification defines TMPA requirements.

## Abstract

I0.6 is the first Implementation Case revision to evaluate fresh product evidence against TMPA Core S0.5. It combines four deliberately separate tracks: the S0.5 Reference Reader, the FCoP v3.2.5 protocol reference implementation, an isolated byte-for-byte snapshot of a local CodeFlowMu worktree, and the previously published WP-13 multi-agent evidence-gating case. XiaoDian AI remains lineage and candidate field evidence; no fixed XiaoDian S0.5 package was run.

The S0.5 Reference Reader passes **14/14** author-produced synthetic criteria. Product evidence does not inherit those results. The product-level matrix is **1 PASS, 8 PARTIAL, 3 NOT RUN, and 2 FAIL**: C14 passes; C02 and C07 fail; C01, C03–C06, C09, C10, and C13 are partial; C08, C11, and C12 were not run. FCoP records 1,222 passed, 3 failed, and 2 skipped tests. CodeFlowMu records 8/8 protocol fixtures, 1,420 passed / 1 failed / 1 skipped Runtime tests, 770/770 Shell tests, and successful type checks for Protocol, Runtime, and Shell.

The evidence therefore supports implementation and author-demonstrated behavior, not complete S0.5 conformance, independent validation, or independent adoption. Failures are retained as evidence. WP-13 demonstrates governance containment of an unverified completion claim; it does not prove that a model ceased to hallucinate.

# 1. Scope and Research Questions

This report asks:

1. Can the S0.5 normative interpretation be executed deterministically by the published Reference Reader?
2. Which S0.5 criteria have current product-level evidence in FCoP and CodeFlowMu?
3. Where do observed product behaviors still diverge from the Core contract?
4. What does WP-13 demonstrate about multi-agent evidence gating under uncertain tool results?

The unit of judgment is a criterion-bound evidence claim, not a product reputation claim. The report uses four maturity labels without collapsing them:

| Level | Meaning in I0.6 |
|---|---|
| Specified | Defined by TMPA Core S0.5 |
| Implemented | A corresponding mechanism exists in code or protocol artifacts |
| Demonstrated | An author-run execution produced inspectable evidence |
| Independently Adopted | A separate organization adopted and validated the mechanism |

No I0.6 claim reaches independently adopted.

# 2. Architecture and Component Boundaries

```text
TMPA Architecture
       ↓ normative contract
TMPA Core S0.5
       ↓ reusable protocol profile
FCoP protocol
       ↓ reference implementation
fcop / fcop-mcp
       ↓ downstream adoption
CodeFlowMu application and WP-13 workflow
```

TMPA is the governance architecture. FCoP is a reusable protocol profile, not an application and not a `pip install` product claim. The `fcop` and `fcop-mcp` packages are reference implementations of that protocol. CodeFlowMu is a downstream application that uses FCoP concepts and operations for persistent roles, tasks, reports, reviews, recovery, and audit surfaces. WP-13 is one bounded CodeFlowMu field case. XiaoDian AI belongs to the engineering lineage but was not executed as an S0.5 product input in this run.

Conceptual layering and historical lineage remain distinct:

```text
CONCEPTUAL: TMPA → FCoP → CodeFlowMu / other applications
HISTORICAL: XiaoDian practice → early TMPA → FCoP extraction
                                   → CodeFlowMu → current TMPA formalization
```

# 3. Evidence Design and Fixed Sources

The V2 package preserves commands, environments, stdout/stderr logs, structured summaries, a criterion matrix, source inventory, privacy-redaction report, and SHA-256 manifest. V2 corrects a narrative error in V1 without rerunning or altering any raw product log.

| Source | Fixed identity | Evidence role | Boundary |
|---|---|---|---|
| TMPA publication | Commit `653e7ba0…` | S0.5 schemas, fixtures, and Reference Reader | Author implementation |
| FCoP | Tag `v3.2.5`, commit `b3dc2343…` | Protocol and clean detached reference implementation | Public fixed source |
| CodeFlowMu | Base `c4ebc146…`, version `0.3.0-alpha` | Isolated product/test snapshot | Dirty local source: 39 modified and 47 untracked files |
| WP-13 | Commit `609571dd…`, V3 ZIP SHA-256 `5b5eda30…` | Multi-agent fact-check field case | Author-produced, role-separated QA; not third-party validation |
| XiaoDian AI | No fixed S0.5 package | Lineage and candidate case | NOT RUN |

The CodeFlowMu snapshot is byte-for-byte isolated from the working tree for execution, but it is not a stable public release. It can support author-run local evidence only.

# 4. FCoP and CodeFlowMu Engineering Mapping

FCoP provides project-visible coordination through routed textual objects, lifecycle paths, atomic publication, append-only transitions, explicit roles, independent reports and reviews, issues, alerts, and history. Its project-visible model supports reconstruction outside a transient agent session.

CodeFlowMu adds application runtime behavior: persistent work identities, PM/DEV/QA/OPS role interfaces, skill and tool invocation, workflow scheduling, review gates, dependency waiting, recovery, approval boundaries, and user-facing operational views. These application mechanisms may implement or demonstrate parts of S0.5, but they do not redefine the FCoP protocol or TMPA Core criteria.

The principal common gap is a maintained product projection that converts native artifacts into the complete S0.5 governance-object and Reader-result surface. Without that projection, local controls may work while canonical objects, issue codes, three-valued judgments, and deterministic aggregate views remain incomplete.
