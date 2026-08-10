---
title: TMPA V1.0 Release Readiness Audit — RA1
type: release-audit
domain: TMPA
version: RA1
status: blocked
source: github-main
outline: deep
---

# TMPA V1.0 Release Readiness Audit

**Audit date:** 2026-08-10  
**Frozen audit baseline:** `8e01c275062244d4978539f86399853f2e35b0e5`  
**Versions reviewed:** Main Paper A0.9 · Core Specification S0.6 · Implementation Case I0.8  
**Promotion decision:** **BLOCKED**

The three-document system is coherent enough to enter release remediation, and its current engineering evidence passes. It is not yet ready to be relabeled A1.0, S1.0 and I1.0. The blockers are release-governance and archival gaps, not a failed TMPA theory claim or a failed C01–C14 product run.

No V1.0 version label, Git tag, DOI or stable-release claim SHALL be issued until every P0 item below is closed in Git history.

## 1. Scope and decision model

This audit checks the GitHub single source of truth only. It does not treat a local editor folder, ChatGPT Library, unpublished working directory or historical copy as an official source.

| Gate | Result | Finding |
|---|---|---|
| Three-document separation | PASS | A0.9 is theory, S0.6 is normative specification, and I0.8 is bounded engineering evidence. |
| English/Chinese structural parity | PASS | Matching heading counts: Main 17 H1 / 35 H2; Core 14 H1 / 54 H2; Case 16 H1 / 6 H2. |
| Terminology and guidance chain | PASS | The current relation is consistently stated as TMPA theory → Core requirements → FCoP coordination protocol → CodeFlowMu implementation evidence. |
| Core criteria integrity | PASS | Both languages contain C01–C14; the Reference Reader passes 14/14. |
| Product evidence integrity | PASS | CodeFlowMu V1.6.0 against S0.6 reports 14 PASS, 0 PARTIAL, 0 NOT RUN and 0 FAIL. |
| Evidence archive integrity | PASS | ZIP checksum and archive integrity pass; the public reproducer contains 195 entries. |
| Reference identity sample | PASS | Nine high-change arXiv records were checked against their live records; identifier and title pairs match. |
| Release dossier consistency | BLOCKED | The frozen S0.6 audit and informative Core text still state that no S0.6 product run exists. |
| Archival source fixation | BLOCKED | The CodeFlowMu browser evidence and XiaoDian AI archive are not yet fixed as stable public submission artifacts. |
| V1.0 publication package | BLOCKED | TMPA-specific citation metadata, author identifiers, release manifest, release notes and submission artifacts are incomplete. |

The final decision is therefore **BLOCKED for V1.0 promotion**, while the current A0.9/S0.6/I0.8 engineering baseline remains valid.

## 2. Reproducibility record

### 2.1 S0.6 Reference Reader

`npm run tmpa:s0.6:conformance` completed with **14/14 PASS**. The result digest was:

```text
sha256:210ae9ca94235a4886cb67e633769d0709a7ae9fe54771226eee528d067a1c51
```

Its product track is an intentionally frozen historical `NOT RUN` baseline. That history SHALL remain unchanged; I0.8 must instead be registered as a later, external exact-version product run.

### 2.2 I0.8 public evidence package

Audited artifact:

- [I0.8 CodeFlowMu V1.6.0 / S0.6 evidence ZIP](/evidence/tmpa/i0.8/tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip)

The adjacent file `tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip.sha256` records the checksum below.

Verified archive digest:

```text
3c34514089f08f5957d806f900ab31af1cdae94c08f31a5da046f451b5884fe9
```

`sha256sum -c`, ZIP integrity, the seven canonical LF input checks and the product runner all passed. The product runner returned:

```text
aggregate: PASS
PASS: 14
PARTIAL: 0
NOT RUN: 0
FAIL: 0
product_reader_called: true
reference_reader_called: false
input_bundle_digest: sha256:251914ee55922d20c9bd23943a4ff445bccaa5835e1fcc11b8562f3f384243fa
result_digest: sha256:f16ab28e694003a25ba83cb9c94e85d757860201caca2f489f32e4d1ca3cc7f2
```

The packaged `tsx` launcher could not open its temporary IPC socket inside this review sandbox (`EPERM`). After dependency installation from the canonical npm registry and successful input verification, the same TypeScript runner was executed with Node's type-stripping mode and produced the recorded result above. This is an environment limitation, not a failed conformance assertion; an unrestricted clean-machine rerun remains part of release packaging.

## 3. P0 blockers

### P0-01 — Register the later S0.6 product run

The historical S0.6 release audit and informative Core text still say that no exact S0.6 product evidence exists. Preserve the frozen Reference Reader record, add a dated external-run registration for I0.8, and remove the now-stale prospective wording from both Core language editions.

**Closure evidence:** bilingual Core correction, external-run manifest entry, exact evidence path, checksum, execution identity and a Git commit.

### P0-02 — Freeze the cited implementation sources

Main Paper reference [13] says the CodeFlowMu browser build and dataset identity still need fixation. Reference [25] says XiaoDian AI requires a fixed public or archival snapshot before external submission. Either publish immutable snapshots with commit/tag and archive identifiers, or narrow/remove the dependent submission claims.

**Closure evidence:** stable public URLs, repository commit/tag identities, archive checksums and explicit claim boundaries.

### P0-03 — Create TMPA-specific citation metadata

The repository-level `CITATION.cff` describes joinwell52 Research Center 3.0, not the TMPA three-document release. Each V1.0 document needs a canonical title, author list, affiliation, version, release date, repository URL, license, preferred citation and DOI field. English and Chinese editions must point to the same work identity while retaining independent language metadata.

**Closure evidence:** validated TMPA CFF/BibTeX metadata and synchronized document frontmatter.

### P0-04 — Build the immutable V1.0 release package

The repository has web Markdown but no complete TMPA V1.0 release dossier. Produce submission-ready artifacts, a file manifest with SHA-256 values, bilingual release notes and a reproducible build record. The final tag must be created only from the reviewed commit.

**Closure evidence:** reproducible paper artifacts, manifest, checksums, release notes, clean CI and the reviewed release commit. Tag and DOI creation occur after the package passes review.

## 4. P1 release decisions

These require the author's explicit confirmation before public release:

1. canonical author name, affiliation, public contact address and ORCID;
2. the license for papers, specification and evidence artifacts—the current repository notice is all-rights-reserved with limited academic reading and citation permission;
3. Zenodo deposit structure and DOI backfill sequence;
4. submission venue packaging, including any venue-specific anonymous or source archive.

## 5. Findings that do not block a bounded V1.0

Independent rerun, independent adoption, comparative baselines, representative SME operating-cost measurements and broader low-resource performance remain open research work. They do not block V1.0 if the documents continue to label the current result as author-run, avoid generalizing one implementation into proof of the theory, and preserve `Specified / Implemented / Demonstrated / Independently Adopted` as distinct states.

## 6. Promotion rule and next gate

The publication cards remain **A0.9 / S0.6 / I0.8**. Phase 5.2 should close P0-01 through P0-04 without changing those labels. After the closure commit passes bilingual checks, conformance verification, evidence checksum verification and site build, a final promotion review may authorize **A1.0 / S1.0 / I1.0**, the release tag and archival deposit.

This audit itself is an official revision only after its Git commit is present on the default branch.
