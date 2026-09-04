---
title: "Evidence: approval scope and operation identity"
outline: deep
---

<ArticleTableScroll language="en" />

# Companion evidence: approval scope and operation identity

For the [English article](/en/engineering/2026-09-04-approval-operation-identity). [中文说明](/zh/research/evidence/2026-09-04-approval-operation-identity). Nature: **public companion records of controlled experiments; neither a fix receipt nor independent QA.**

## Reading the evidence

This package is a de-identified extract of recorded research, not a substitute for rerunning it. All observations use CodeFlowMu commit `fdadbed489129455437f25202a03bae6e0c2e822`, dated September 4, 2026.

| Article claim | Record location | Check and expected observation | Scope |
|---|---|---|---|
| Existing protections pass twice | `observations.json → baseline_tests` | 31 tests/passes per run; no failures/skips; exit 0 | Four selected files, not full acceptance |
| Changed branch consumes approval | `approval_matrix`, different-target | ALLOW and consumed twice; replay reports APPROVAL_ALREADY_CONSUMED | Actual Native gate; no command execution |
| Registered wake session fails to match | `approval_matrix`, delivered-resume | REQUIRE_APPROVAL twice; authorization available | Controlled session input, not complete successor admission |
| Four Git mutations keep the digests | `field_comparisons`, branch/remote/force/delete | Equal fingerprints and digests, empty request differences, twice each | Digest boundary, not consumption/execution of all variants |
| Nested Session changes the digest | `field_comparisons`, new-session | Equal fingerprint, unequal digest; removing nested Session in memory restores equality | Causal isolation, not a product patch |
| Codex resolution accepts a changed branch | `codex_resolution`, changed-branch | allow=true and consumed twice; same-command is the control | Real local function, not a live app-server test |
| Identical task text does not replace a dependency | `lineage_controls` | Six cases, two repetitions; actual matches expected | FCoP gate branches, not complete graph recovery |

## Sources and checks

- [Observations](https://joinwell52-ai.github.io/joinwell52/assets/approval-identity-20260904/evidence/observations.json): per-round results, including four retained assertion failures.
- [Source references](https://joinwell52-ai.github.io/joinwell52/assets/approval-identity-20260904/evidence/sources.json): Codex PR metadata and fixed CodeFlowMu file hashes.
- [Integrity manifest](https://joinwell52-ai.github.io/joinwell52/assets/approval-identity-20260904/evidence/manifest.json): hashes of articles, bilingual guides, and data.
- [Reader/checker](https://joinwell52-ai.github.io/joinwell52/assets/approval-identity-20260904/evidence/check-evidence.mjs): run `node check-evidence.mjs`.

The checker validates file integrity, scenario sets, controls, and comparisons used by the article. Its expected message is `RECORDED EVIDENCE CONSISTENT; PRODUCT COUNTEREXAMPLES REMAIN`. That means the claims match the records, **not that the product passes**.

The complete E1 research probe exited 1 because two expectation violations each occurred twice. This package preserves that fact. The causal collector's exit 0 means collection completed. The 31 regression tests, 22 approval inputs, 14 field comparisons, four resolution observations, and 12 lineage observations are different sets, not a reliability percentage.

## De-identification

Projects, tasks, and commands were already isolated synthetic fixtures, not customer incidents. Export replaces local fixture paths with stable `<SYNTHETIC_FIXTURE_...>` labels and omits process numbers. Order, repetitions, timestamps, input semantics, outcomes, failures, and original digests remain. Labels are not executable paths.

**The operation digests are original observed values. They cannot be recomputed from path-redacted JSON.** The checker verifies recorded equality/inequality relationships and references to original file hashes. Reproducing product behavior requires the original research scripts, fixed source, and dependencies. This reader is not the product experiment runner and does not establish causation or real network execution by itself.

Failures were not removed. Equal force/delete digests were not promoted to claims of Git execution. Research-tool API mistakes, a spec/TAP counter correction, and incomplete debugging rounds are excluded from the counted dataset; limitations are retained in [section 6 of the article](/en/engineering/2026-09-04-approval-operation-identity) and the original research record. This package contains only completed rounds cited by the article.

No real push, cloud-model call, live takeover, power-loss recovery, or independent QA was performed. Both article languages and evidence guides use the same machine-readable dataset.

## Offline check

[Download the complete companion ZIP](https://joinwell52-ai.github.io/joinwell52/assets/approval-identity-20260904/approval-identity-evidence.zip), extract it, enter the evidence directory and run `node check-evidence.mjs`. Keep the complete directory structure; downloading the script alone is insufficient for the integrity check.
