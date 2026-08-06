---
schema: "publication-candidate-article/v1"
title: "Agent History Migration Must Preserve Semantics, Not Just Files"
date: "2026-08-06"
column: "open-source-engineering"
category: "daily"
summary: "Rollback, compaction, and late lifecycle events can make physical record order diverge from logical session boundaries; reliable migration must reconstruct semantics before journaled, idempotent publication and recovery."
sources:
  - "research/analysis/Q-20260806-03-rollout-migration-recovery.md"
  - "research/reading/Q-20260806-03-rollout-migration-recovery.md"
item_id: "Q-20260806-03"
lifecycle: "Publication Candidate"
source_research_object: "research/analysis/Q-20260806-03-rollout-migration-recovery.md"
source_reading_result: "research/reading/Q-20260806-03-rollout-migration-recovery.md"
visualization: "staging/publication-candidates/2026-08-06-semantic-migration-recovery.svg"
visualization_decision: "Required — semantic migration and journaled recovery lifecycle included"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: false
---

# Agent History Migration Must Preserve Semantics, Not Just Files

Agent rollout records may contain rollback, compaction, copied parent history, and late lifecycle events. Physical order can therefore diverge from logical session meaning. Line-by-line copying may preserve bytes while restoring the wrong visible history.

## Central judgment

**Agent-history migration should be defined as a versioned semantic transformation, not a file-format conversion.** The transformation needs explicit invariants, logical boundaries, and degraded items. Publication across JSONL and SQLite should use a durable journal and idempotent phases, and the result should be called recoverable unless a true global atomic boundary is proven.

## Source

The sole analytical input is the Research Object authorized for Production. Production did not re-read the implementation change to create new analysis and does not promote one maintainer change and its tests into a fleet-scale guarantee.

## Observation

The Research Object identifies four mechanisms: assign records by logical turn ownership; consume rollback events while preserving required compaction anchors; use bounded reverse replay only when a safe checkpoint can be proven, otherwise fall back to complete tolerant replay; and publish files with flush, sync, and rename while a pending journal bridges the non-atomic interval between JSONL publication and SQLite completion.

## Comparison

| Method | What it preserves | Primary guarantee | Explicit boundary |
|---|---|---|---|
| Verbatim copy | Bytes and physical order | File content is not rewritten | Logical visible history may be wrong |
| Semantic replay | Turn ownership, rollback, compaction, and subagent boundaries | Intended session meaning is reconstructed | Depends on invariants and tolerant policy |
| Atomic rename | Publication of one file | Readers observe the old or new file | Does not cover a multi-store transaction |
| Journaled recovery | Intent and phases across JSONL and SQLite | A crash can be completed or repaired | Recoverable protocol, not distributed atomicity |

The table separates byte preservation, semantic restoration, single-file atomicity, and cross-store recoverability instead of treating them as one guarantee.

## Discussion

Reliable migration should separate semantic canonicalization from durable publication. Logical turn ownership handles late records that a physical suffix deletion could remove incorrectly. The pending journal preserves cross-store transition intent so a recoverer can complete or repair the operation idempotently; it does not create a global transaction that the system does not possess.

Bounded replay must also be an optimization under proof. It can reduce work only when a safe checkpoint is established. Otherwise, complete tolerant replay is the conservative fallback. That fallback may add cost or preserve duplication, but it is safer than aggressive trimming at an uncertain boundary.

## Engineering impact

For CodeFlowMu, migration can be divided into Prepare, Transform, Validate, Publish, Complete, and Recover phases with idempotency keys. Any logical transition spanning multiple stores or projections should have a durable pending journal.

A migration manifest should contain source and target versions, record counts, logical-boundary decisions, skipped items, fallback path, journal phase, and verification results. FCoP append-only history and current lifecycle truth remain authoritative; derived indexes and Runtime projections may be rebuilt without rewriting protocol history.

## Boundaries and counter-evidence

The evidence is one merged maintainer change and its tests, not independent or fleet-scale validation. Malformed or oversized records may be skipped or fail; rename, fsync, and directory synchronization are platform dependent; the journal is not a distributed transaction; and the source provides no throughput, recovery-time, contention, or production data-loss metrics.

## Future work

Future work should define comparable invariants for model-visible context before and after migration, decide when malformed input must block instead of degrade, coordinate concurrent writers and recoverers, and make throughput, fallback, and recovery metrics part of release gates.

## Visualization note

The visual separates Prepare through Recover from the pending journal, JSONL, and SQLite. It is a Research Center lifecycle synthesis based on the Research Object and does not claim global cross-store atomicity.

## Evidence and references

1. [Research Object](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260806-03-rollout-migration-recovery.md): the sole analytical input, including semantic-migration judgment, recoverability boundaries, counter-evidence, and engineering impact.
2. [Reading Result](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260806-03-rollout-migration-recovery.md): the evidence boundary and source-traceability record declared by the Research Object; this candidate does not re-analyze it.

> Editing status: bilingual structure, the distinction between atomic and recoverable, abnormal-record handling, and platform limitations were checked; not published.
