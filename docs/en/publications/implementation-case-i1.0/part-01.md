---
title: TMPA–FCoP–CodeFlowMu Implementation Case — Release I1.0
outline: deep
citation:
  work: TMPA Implementation Case
  identifier: TMPA-CASE-I1.0
  language: en
  metadata: /releases/tmpa/v1.0/metadata/implementation-case.en.cff
---

<ArticleCover
  image="/assets/covers/implementation-case.svg"
  kicker="Engineering Case"
  title="TMPA Implementation Case"
  summary="An exact-input TMPA Core S1.0 product run and locked public evidence package for CodeFlowMu V1.8.0."
  version="I1.0"
  status="Stable release · S1.0 product evidence · 14/14 PASS"
  languageHref="/zh/publications/implementation-case-i1.0"
  languageLabel="简体中文"
/>

# TMPA Implementation and Case Report

## TMPA Core S1.0, FCoP, CodeFlowMu V1.8.0, and retained field evidence

> **Document Version:** I1.0<br>
> **Status:** Official implementation and case report<br>
> **Normative Target:** [TMPA Core Specification S1.0](/en/publications/tmpa-core-specification-s1.0), frozen candidate commit `942cbb097eb3d662662f96a2269818ec9d7ca2ed`<br>
> **Product Under Test:** CodeFlowMu V1.8.0, evidence commit `c1e1f724293e8048fc3a956b6f6df8cf83f54830`<br>
> **Evidence Capture:** 2026-08-11, Asia/Shanghai<br>
> **Formal Evidence Package:** `tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip`<br>
> **Package SHA-256:** `9b92b06c3e46c8019362f55075be4ed066cb7a9c0d9859945b6c3b7de8840d04`

## Abstract

I1.0 evaluates CodeFlowMu V1.8.0 against all fourteen mandatory criteria in TMPA Core S1.0 using the exact bytes frozen by the normative candidate commit. The CodeFlowMu product path reports **14 PASS, 0 PARTIAL, 0 NOT RUN, and 0 FAIL**. The runner calls `GovernanceReader.readSync`; it does not call the TMPA Reference Reader. The input-bundle digest is `sha256:f98764987760cdc8ac356b1265fc98485f33345e7d6ffc8575ccb059ddd34daa`, and the result digest is `sha256:0f0f642449db1853371861751a7a8ea36dce00013f53e32012a5e4dae45f4c39`.

The evidence package fixes the S1.0 schemas, profiles, fixtures, product Adapter and Reader source, CodeFlowMu and FCoP revisions, dependency locks, raw command logs, pre-fix failures, final regression results, a reduced clean-machine reproducer, and a 889-entry SHA-256 manifest. The final regression record contains 24/24 TMPA Runtime tests, 1,522 passed / 0 failed / 1 skipped Runtime tests, 791/791 Shell tests, and 1,210 passed / 2 skipped FCoP reference-implementation tests.

The strongest supported conclusion is **author-run demonstrated product behavior for one exact implementation and one exact S1.0 bundle**. The result is not independent validation, third-party certification, universal conformance, proof of TMPA theory, proof of semantic truth, proof that hallucinations have been eliminated, or independent adoption.

# 1. Scope and Research Questions

I1.0 asks:

1. Does the CodeFlowMu V1.8.0 product Reader satisfy S1.0 C01–C14 against the exact frozen input bundle?
2. Can the source revision, product revision, input bundle, per-criterion results, regression runs, and evidence archive be traced without substituting the Reference Reader?
3. Does the evidence package preserve pre-fix results and demonstrate a clean reproducer without weakening the S1.0 criteria?
4. Which findings are demonstrated, and which conclusions remain unsupported?

The unit of judgment is a criterion-bound claim over a fixed bundle. Evidence maturity and conformance verdicts are reported separately:

| Evidence level | Meaning in I1.0 | Reached? |
|---|---|---:|
| Specified | S1.0 clauses, schemas, profiles, and C01–C14 define the required behavior | Yes |
| Implemented | CodeFlowMu V1.8.0 contains the corresponding Adapter, Reader, protocol, and governance mechanisms | Yes |
| Demonstrated | Author-run product and regression executions produced inspectable evidence | Yes, for the fixed bundle and revision |
| Independently Adopted | An unrelated organization adopted and independently validated the mechanism | No |

# 2. Architecture and Evidence Boundaries

The current guidance and implementation relation is:

```text
TMPA Architecture Paper A1.0
        ↓ provides the architecture theory and design direction
TMPA Core Specification S1.0
        ↓ fixes normative object, Reader, and conformance behavior
FCoP protocol
        ↓ supplies the file-based coordination and evidence profile
CodeFlowMu V1.8.0
        ↓ implements and consumes the Adapter/Reader result
bounded cases, governance gates, recovery, and audit views
```

TMPA is the theory and normative governance layer. FCoP is a reusable coordination protocol, not an application program. The `fcop` and `fcop-mcp` packages are reference implementations of FCoP rather than the protocol itself. CodeFlowMu is the engineering system guided by TMPA: it emits and consumes coordination evidence, projects FCoP artifacts into TMPA candidates, reconstructs a governance view, and lets workflow, review, recovery, and audit components consume the result.

Historical co-evolution is reported separately. XiaoDian AI, FCoP, CodeFlowMu, and TMPA share an author-controlled lineage; engineering feedback helped refine the present formalization. That lineage does not make an implementation a proof of the theory. WP-13 remains a bounded example of role-separated evidence admission and fact checking; it does not prove hallucination elimination and is not substituted for the S1.0 C01–C14 run.

# 3. Fixed Sources and Evidence Design

## 3.1 Locked identities

| Item | Fixed identity | Role in this report |
|---|---|---|
| TMPA Core | S1.0 candidate commit `942cbb097eb3d662662f96a2269818ec9d7ca2ed` | Normative input |
| CodeFlowMu | V1.8.0 evidence commit `c1e1f724293e8048fc3a956b6f6df8cf83f54830` | Product under test |
| CodeFlowMu protocol surface | V1.2.0 | Product schema and validator surface |
| FCoP reference implementation | commit `da79dfefd99f597c9e422ce9edec22157f915a21` | Locked dependency regression only |
| Product Reader | `GovernanceReader.readSync` | Required execution path |
| Product Adapter | `FcopSourceAdapter.projectFcopToTmpa` | FCoP-to-TMPA projection path |

The product run used an isolated, tracked-clean evidence worktree. The original CodeFlowMu mother worktree was observed as dirty and changing, so it was not used as the evidentiary execution root. The V1.8.0 evidence commit was local-only at capture time: it was not pushed, tagged, or released. The complete source snapshot and V1.7.0-to-V1.8.0 patch are therefore included in the evidence archive. This supports inspection of the tested source but does not turn the commit into a public CodeFlowMu release.

## 3.2 Fixed machine inputs

The run locks four S1.0 JSON Schemas plus the lifecycle Profile, canonicalization Profile, fixtures, and input bundle identity. The four published Schema hashes are:

| Schema | SHA-256 |
|---|---|
| Governance object | `a2829cd7149c3054a52886365f2293a23106b636b0c52799739bfabdab1ff4fa` |
| Lifecycle Profile | `481a61ac2485bbaf15d90e9c5a255ad9ce6a55971190f0fe404856be4b10f993` |
| Reader result | `4527df7096fe840b85b245e50d5cea576ff359d50a54d17c8873a7b4f458d431` |
| Conformance result | `4b1ecebf83e62d2aa1aff0e79a0cd0ea0a85fbc14a426d5fe873ab40aefdc2fe` |

## 3.3 Evidence construction

For each criterion, the product runner records a manifest, explicit mandatory assertions, product input invocations, canonical Reader output, assertion outcomes, a manifest digest, and a result digest. The aggregate result is validated against the S1.0 conformance-result Schema. Raw stdout, stderr, exit status, command, working directory, environment, dependency-lock digest, and remediation history are retained.

The frozen S1.0 candidate corpus also contains a historical product `NOT RUN` baseline. I1.0 does not rewrite it. The V1.8.0 product result is registered as a later external exact-version run so that candidate history and later evidence remain distinguishable.
