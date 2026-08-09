---
title: TMPA–FCoP–CodeFlowMu Implementation Case — Draft I0.7
outline: deep
---

<ArticleCover
  image="/assets/covers/implementation-case.svg"
  kicker="Engineering Case"
  title="TMPA Implementation Case"
  summary="A locked CodeFlowMu V1.4.1 product run covering all TMPA Core S0.5 criteria, with retained WP-13 governance evidence."
  version="I0.7"
  status="S0.5 product evidence draft · 14/14 PASS"
  languageHref="/zh/publications/implementation-case-i0.7"
  languageLabel="简体中文"
/>

# TMPA Implementation and Case Report

## TMPA Core S0.5, FCoP 3.2.4, CodeFlowMu V1.4.1, and WP-13

> **Document Version:** Draft I0.7<br>
> **Status:** Author-produced implementation and case report<br>
> **Normative Target:** [TMPA Core Specification S0.5](/en/publications/tmpa-core-specification-s0.5)<br>
> **Product Under Test:** CodeFlowMu V1.4.1, commit `1cd403537136b3e915c4646cd306983eaca1d2ce`<br>
> **Evidence Capture:** 2026-08-09, Asia/Shanghai<br>
> **Formal Evidence Package:** `tmpa-i0.7-codeflowmu-v1.4.1-evidence-20260809.zip`<br>
> **Archive SHA-256:** `06f34ce7c6b5008b9adeedc45f68541ce5f3ecff6613c80ff3bb05a12fa61b34`<br>
> **Authority Boundary:** This report is evidentiary and non-normative. Only the Core Specification defines TMPA requirements.

## Abstract

I0.7 evaluates a public, commit-locked CodeFlowMu V1.4.1 source tree against all fourteen mandatory conformance criteria in TMPA Core S0.5. Under the fixed source and test bundle, the product matrix records **14 PASS, 0 PARTIAL, 0 NOT RUN, and 0 FAIL**. The external product fixture passes 15/15 assertions, CodeFlowMu's built-in TMPA suite passes 19/19 tests, Runtime records 1,446 passed / 0 failed / 1 skipped tests, Shell records 775/775, FCoP records 1,210 passed / 2 skipped tests, and the protocol and type-check tracks exit successfully.

The result upgrades the I0.6 local baseline and the retained CodeFlowMu V1.4.0 repair baseline. V1.4.0 produced 12 PASS / 2 FAIL because C06 did not keep lifecycle completion separate from independent acceptance and C12 allowed an unauthorized decision to clear a review conflict. V1.4.1 repairs those two boundaries without weakening C03 or C10. The V1.4.0 archive remains historical evidence and is not the formal I0.7 publication package.

The strongest supportable conclusion is **author-local demonstrated product conformance under a fixed bundle**. It is not independent certification, independent adoption, a formal proof for arbitrary inputs, or proof that multi-agent hallucinations have been eliminated. WP-13 remains a separate bounded case demonstrating evidence gating and role-separated review of an initially unverified completion claim.

# 1. Scope and Research Questions

I0.7 asks:

1. Does the locked CodeFlowMu V1.4.1 product run satisfy each mandatory S0.5 criterion C01–C14?
2. Do the V1.4.1 changes close the two V1.4.0 failures without collapsing distinct governance criteria?
3. How do TMPA, FCoP, CodeFlowMu, and WP-13 relate without confusing theory, protocol, application, and case evidence?
4. Which limits remain before the result can be called independently validated or adopted?

The unit of judgment is a criterion-bound claim over a fixed source and evidence bundle. Four maturity levels remain separate:

| Level | Meaning in I0.7 | Reached? |
|---|---|---:|
| Specified | Defined normatively by TMPA Core S0.5 | Yes |
| Implemented | A corresponding product mechanism exists | Yes |
| Demonstrated | An author-run execution produced inspectable evidence | Yes, for C01–C14 under this bundle |
| Independently Adopted | A separate organization adopted and validated the mechanism | No |

# 2. Architecture and Evidence Boundaries

```text
TMPA Architecture Paper
        ↓ theory and governance model
TMPA Core S0.5
        ↓ normative object, Reader, and conformance contract
FCoP protocol
        ↓ file-based coordination profile and reference implementation
CodeFlowMu application
        ↓ runtime, roles, workflow, recovery, and audit behavior
WP-13 bounded field case
```

TMPA is the architecture and governance theory. FCoP is a reusable file-based coordination protocol, not an application and not a package-installation claim. Its `fcop` and `fcop-mcp` packages are reference implementations of the protocol. CodeFlowMu is the downstream application evaluated here. WP-13 is one bounded workflow case inside that engineering lineage; it cannot stand in for the complete C01–C14 product run.

Conceptual dependency and historical development remain distinct:

```text
CONCEPTUAL: TMPA → FCoP → CodeFlowMu / other applications
HISTORICAL: XiaoDian practice → early TMPA → FCoP extraction
                                   → CodeFlowMu → current TMPA formalization
```

XiaoDian AI remains part of the engineering lineage and a candidate field-evidence source. I0.7 makes no new XiaoDian conformance claim because no XiaoDian S0.5 bundle was executed in this run.

# 3. Fixed Sources and Evidence Design

| Source | Fixed identity | Role in I0.7 | Boundary |
|---|---|---|---|
| TMPA Core | S0.5 | Normative C01–C14 target | Specification, not product evidence |
| CodeFlowMu | V1.4.1, commit `1cd403537136b3e915c4646cd306983eaca1d2ce` | Product under test | Publicly retrievable; clean detached checkout before initialization |
| FCoP | 3.2.4, commit `da79dfefd99f597c9e422ce9edec22157f915a21` | Protocol and reference baseline | Publicly retrievable clean checkout |
| External fixture | 15 mandatory assertions | Product-level C01–C14 evaluation | Fixed test construction, not arbitrary-input proof |
| WP-13 V3 | Previously published package | Multi-agent evidence-gating case | Separate author-produced case evidence |

The original local CodeFlowMu and FCoP worktrees were dirty but were not modified during evidence collection. Testing used detached, fixed checkouts. CodeFlowMu was clean before product initialization; initialization-generated files are separately recorded in `manifests/codeflowmu-post-initialization-status.txt`. No push, release, or tag occurred during evidence capture.

The formal public package is V1.4.1 plus its external SHA-256 file. The V1.4.0 package records the repair-before state—12 PASS / 2 FAIL—and is retained outside the formal I0.7 main package unless a reviewer requests a repair comparison.
