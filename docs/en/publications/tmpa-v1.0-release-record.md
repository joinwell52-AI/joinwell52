---
title: TMPA V1.0 Release Record
outline: deep
---

# TMPA V1.0 Release Record

Release date: 2026-08-11

## Promotion decision

The TMPA publication system is promoted to V1.0 with the following official versions:

| Layer | Official version | Role |
|---|---:|---|
| Architecture Paper | A1.0 | Research theory and architecture |
| Core Specification | S1.0 | Normative objects, Reader behavior, and C01–C14 |
| Implementation Case | I1.0 | Author-run engineering evidence |

The GitHub repository `joinwell52-AI/joinwell52` is the single source of truth. Official revisions are represented by Git history. The final checksummed dossier is available at [TMPA V1.0 publication dossier](/releases/tmpa/tmpa-v1.0-publication-dossier.zip).

## Evidence admitted for promotion

CodeFlowMu V1.8.0 executes its product Reader against the exact S1.0 frozen-candidate bytes and records 14 PASS, 0 PARTIAL, 0 NOT RUN, and 0 FAIL across 71 mandatory assertions. The formal evidence archive SHA-256 is `9b92b06c3e46c8019362f55075be4ed066cb7a9c0d9859945b6c3b7de8840d04`.

The evidence is author-run and fixed-bundle. The CodeFlowMu evidence commit was local-only at capture, and the package includes its source snapshot and patch. Promotion does not assert independent validation, certification, universal conformance, theory proof, semantic truth, hallucination elimination, or independent adoption.

## Archival status

The repository release and Git tag establish the publication version. DOI minting is a separate archival-deposit action and remains pending. Earlier RA1, RC1, A0.x, S0.x, and I0.x records remain immutable publication history.
