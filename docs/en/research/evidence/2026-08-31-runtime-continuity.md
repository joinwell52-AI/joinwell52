---
title: "RCR-20260831 Public Evidence: Runtime Continuity and Admissible Evidence"
date: '2026-08-31'
column: research-evidence
category: evidence
article_type: evidence-pack
edition: research-center
summary: "De-identified captured data, a Reader, checkers, and provenance for three Runtime-continuity studies: retry eligibility, cross-session authority and attribution, and time-bounded evidence admissibility."
lifecycle: "Published"
publication_authorized: true
---

[中文](/zh/research/evidence/2026-08-31-runtime-continuity)

# RCR-20260831 | Runtime Continuity Evidence Package

Status: public review and reproducibility package. All identifiers are synthetic. It contains no real task ledger, credentials, signing keys, or product source.

This package supports three articles:

1. [Retry eligibility after an audit failure](/en/engineering/2026-08-31-audit-failure-retry)
2. [Cross-session authority, execution principal, and attribution](/en/engineering/2026-08-31-session-principal-continuity)
3. [Admissible evidence at Runtime decision time](/en/engineering/2026-08-31-audit-evidence-admissibility)

## Two recheck layers

**Public captured data and Reader.** Requires Node.js only, with no network or product dependency. It checks article counts, four time cutoffs, and four negative controls.

**Product behavior replay.** Requires authorized access to the fixed CodeFlowMu source and installed dependencies. The probe uses real services but only a local synthetic executor. It does not test real HTTP, Git, issues, payments, or provider-account switching.

Download the following files into one directory and run:

- [Checker](/assets/evidence/2026-08-31-runtime-continuity/check.mjs)
- [Reader](/assets/evidence/2026-08-31-runtime-continuity/reader.mjs)
- [Manifest checker](/assets/evidence/2026-08-31-runtime-continuity/check-manifest.mjs)
- [Timeline fixture](/assets/evidence/2026-08-31-runtime-continuity/fixtures/timeline.json) (the remaining fixtures are in the same directory)
- [Provenance](/assets/evidence/2026-08-31-runtime-continuity/provenance.json)
- [Manifest](/assets/evidence/2026-08-31-runtime-continuity/manifest.json)

```text
node check.mjs
node check-manifest.mjs
```

Expected exit code is 0. The public checker confirms three cross-process recovery controls, eleven authority-consumption cases, eight skill-binding cases, eight Reader cases, and the CatchBench PRE count of 1,187 configurations. These sets must not be added together as a reliability score, detection accuracy, or online benefit.

## Claim → provenance → fixture → check

| Evidence | Supported claim | Public artifact | What it proves and does not prove |
|---|---|---|---|
| E-A0 | P0–P3 differ by audit-fault location | [historical probes](/assets/evidence/2026-08-31-runtime-continuity/fixtures/historical-probes.json) | P3 preserves a first effect while being written failed; not incident frequency |
| E-A1 | New-process recovery depends on dedupe and digest | [restart](/assets/evidence/2026-08-31-runtime-continuity/fixtures/restart.json) | no dedupe 1→2, stable key 1→1, changed digest rejects; not all production executors |
| E-B1 | Session change alone does not invalidate matching approval | [authorization](/assets/evidence/2026-08-31-runtime-continuity/fixtures/authorization.json) | eleven conditions and two paths that cannot consume twice; not trusted external identity entry points |
| E-B2 | Session binding distinguishes verified, invalid, and sessionless claims | [session binding](/assets/evidence/2026-08-31-runtime-continuity/fixtures/session-binding.json) | 2 verified, 5 invalid_claim, 1 not_applicable; public package has no HMAC key |
| E-C0 | CatchBench PRE totals and source distribution | [raw output](/assets/evidence/2026-08-31-runtime-continuity/fixtures/catchbench-pre.log) | fixed PRE output and 1,187 configurations; not a fresh model call or CodeFlowMu score |
| E-C1 | Proposition, ownership, cutoff, and integrity change admissibility | [timeline](/assets/evidence/2026-08-31-runtime-continuity/fixtures/timeline.json) | Reader executes 4 normal and 4 negative controls; not a product auditor or statistical accuracy |

## Read contract and limits

The public Reader fixes a proposition, admits artifacts with the correct owner at or before the cutoff whose content matches the manifest, and then reads the latest allowed effect snapshot. It evaluates admissible evidence rather than every log. `unknown` is not `false`; `not_observed` is not “will never happen.”

The byte-identical product probe, [reproduce-product.mts](/assets/evidence/2026-08-31-runtime-continuity/reproduce-product.mts), is included but requires source fixed at `f0f42f01c8f6d55bfe3d32e108f607841a2900d9` and an isolated research output directory.

The same researcher ran these experiments. There is no independent QA, blind evaluation, production incident frequency, real provider-account escalation result, or online early-warning claim. The manifest detects silent change relative to this package; it is not independent attestation.
