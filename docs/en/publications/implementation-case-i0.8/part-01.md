---
title: TMPA–FCoP–CodeFlowMu Implementation Case — Draft I0.8
outline: deep
citation:
  work: TMPA Implementation Case
  identifier: TMPA-CASE-I0.8
  language: en
  metadata: /releases/tmpa/v1.0-rc1/metadata/implementation-case.en.cff
---

<ArticleCover
  image="/assets/covers/implementation-case.svg"
  kicker="Engineering Case"
  title="TMPA Implementation Case"
  summary="An exact-input TMPA Core S0.6 product run and self-contained public reproducer for CodeFlowMu V1.6.0."
  version="I0.8"
  status="S0.6 product evidence draft · 14/14 PASS"
  languageHref="/zh/publications/implementation-case-i0.8"
  languageLabel="简体中文"
/>

# TMPA Implementation and Case Report

## TMPA Core S0.6, FCoP, CodeFlowMu V1.6.0, and retained field evidence

> **Document Version:** Draft I0.8<br>
> **Status:** Author-produced implementation and case report<br>
> **Normative Target:** [TMPA Core Specification S0.6](/en/publications/tmpa-core-specification-s0.6), commit `8989657e8fde6d2e55d7606ae0adacac14fec760`<br>
> **Product Under Test:** CodeFlowMu V1.6.0, implementation commit `62440a526a99d2fe55019d8bb95ad2425569fcb4`<br>
> **Evidence Capture:** 2026-08-10, Asia/Shanghai<br>
> **Formal Evidence Package:** `tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip`<br>
> **Archive SHA-256:** `3c34514089f08f5957d806f900ab31af1cdae94c08f31a5da046f451b5884fe9`<br>
> **Authority Boundary:** This report is evidentiary and non-normative. Only the Core Specification defines TMPA requirements.

## Abstract

I0.8 evaluates CodeFlowMu V1.6.0 against all fourteen mandatory criteria in TMPA Core S0.6 using the exact raw-LF bytes fixed by the normative repository commit. The product-level result is **14 PASS, 0 PARTIAL, 0 NOT RUN, and 0 FAIL**. CodeFlowMu's product runner calls its own synchronous `GovernanceReader` and does not invoke the TMPA Reference Reader. The input bundle digest is `sha256:251914ee55922d20c9bd23943a4ff445bccaa5835e1fcc11b8562f3f384243fa`.

The engineering upgrade closes the observable S0.6 delta over the I0.7/S0.5 baseline: byte-identical observations retain every contributing source ID; high-risk approval requires a permitted decision-object type, a valid role assignment, an allowed role, an approval decision, and an independent actor when required; and every canonical sort uses locale-independent Unicode code-point order, including a regression over U+E000 and U+10000. CodeFlowMu's internal TMPA suite passes 23/23 tests, Runtime records 1,485 passed / 0 failed / 1 skipped, Shell records 777/777, and the locked FCoP reference implementation records 1,210 passed / 2 skipped.

The evidence archive includes a self-contained public reproducer. A clean `npm ci` and `npm test` run verifies the seven official S0.6 byte digests and executes the bundled CodeFlowMu product Reader with 14/14 PASS; no private CodeFlowMu checkout is required for this conformance slice. The strongest supportable claim remains **author-run demonstrated behavior under a fixed bundle**. The result is not independent certification, independent adoption, a proof for arbitrary inputs, or proof that AI hallucinations have been eliminated.

# 1. Scope and Research Questions

I0.8 asks:

1. Does the CodeFlowMu V1.6.0 product Reader satisfy S0.6 C01–C14 against one exact, fixed input bundle?
2. Are the three observable S0.6 changes—source provenance retention, complete human-approval authorization, and locale-independent ordering—implemented without regressing the S0.5 behavior demonstrated by I0.7?
3. Can the conformance slice be rerun without access to the private CodeFlowMu mother repository?
4. Which evidence remains author-local, and which conclusions remain unsupported?

The unit of judgment is a criterion-bound claim over a fixed bundle. The four evidence levels remain separate:

| Level | Meaning in I0.8 | Reached? |
|---|---|---:|
| Specified | Defined normatively by TMPA Core S0.6 | Yes |
| Implemented | A corresponding CodeFlowMu mechanism exists | Yes |
| Demonstrated | An execution produced inspectable evidence | Yes, for the fixed C01–C14 bundle |
| Independently Adopted | A separate organization adopted and validated the mechanism | No |

# 2. Architecture and Evidence Boundaries

```text
TMPA Architecture Paper
        ↓ theory guides engineering direction
TMPA Core S0.6
        ↓ fixes normative object, Reader, and conformance contract
FCoP protocol
        ↓ supplies the collaboration and evidence protocol
CodeFlowMu V1.6.0 execution and consumption layer
        ↓ product Reader, Runtime, roles, recovery, and audit
WP-13 and other bounded cases
```

TMPA theory guides the engineering direction of CodeFlowMu, while Core S0.6 fixes the normative behavior evaluated in this report. FCoP is the reusable collaboration and evidence protocol used by CodeFlowMu, not an application; `fcop` and `fcop-mcp` are reference implementations rather than the protocol itself. Consistent with CodeFlowMu's engineering architecture [7], CodeFlowMu is the application execution and consumption layer: it produces coordination facts, runs the Adapter and Reader, projects the governance graph, and lets recovery and governance gates consume the reconstructed result. WP-13 remains a bounded evidence-admission case. XiaoDian AI is retained as author-reported engineering lineage only and is excluded from the evaluated evidence; neither substitutes for the S0.6 product run.

Conceptual dependency and historical formation remain distinct:

```text
CURRENT GUIDANCE: TMPA theory → Core requirements → FCoP protocol
                                                  → CodeFlowMu engineering
HISTORICAL FEEDBACK: XiaoDian practice → early TMPA → FCoP extraction
                                           → CodeFlowMu implementation
FCoP + CodeFlowMu results → current TMPA formalization
```

Historical feedback explains how the theory matured; it does not invert the current authority relation. Product behavior may provide evidence or motivate a later revision, but it cannot redefine the current Core.

# 3. Fixed Sources and Evidence Design

| Source | Fixed identity | Role in I0.8 | Boundary |
|---|---|---|---|
| TMPA Core | S0.6, commit `8989657…` | Normative C01–C14 target | Specification, not product evidence |
| CodeFlowMu | V1.6.0, commit `62440a5…` | Product implementation under test | Local implementation commit; not represented as a public release |
| Public reproducer | 29 locked files | Public rerun of the conformance slice | Does not expose or reproduce the entire private product |
| FCoP reference implementation | commit `da79dfe…` | Locked dependency baseline | Test result is not proof of the abstract protocol |
| I0.7 | S0.5 / CodeFlowMu V1.4.1 | Historical regression baseline | Retained with its exact earlier meaning |
| WP-13 V3 | Previously published package | Evidence-gating field case | Not rerun and not promoted to a conformance proof |

The seven official S0.6 inputs—four schemas, canonicalization profile, lifecycle profile, and fixtures—are byte-identical to GitHub. The first submitted archive had Windows checkout-converted CRLF copies; publication preflight rejected it. The final archive uses raw Git blob bytes, reruns the product criteria, and regenerates every dependent digest instead of editing prior result JSON.
