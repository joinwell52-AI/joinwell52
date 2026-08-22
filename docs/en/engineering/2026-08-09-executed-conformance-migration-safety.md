---
title: "Migration Safety Requires Executed Conformance, Not Merely Correct Output"
date: '2026-08-09'
column: open-source-engineering
category: daily
summary: "A persisted-state migration can preserve visible output while breaking the mechanism that was supposed to keep replay bounded. Governed migration requires readers that understand every supported historical representation and CI evidence that the shared conformance suite actually executes against each governed backend."
item_id: Q-20260809-03
source_research_object: "research/analysis/Q-20260809-03-executed-conformance-migration-safety.md"
source_reading_result: "research/reading/Q-20260809-03-checkpoint-conformance-migration.md"
lifecycle: Published
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
outline: deep
cover: "/assets/covers/daily-2026-08-09-executed-conformance-migration-safety-cover-v2.jpg"
---

<ArticleCover
  image="/assets/covers/daily-2026-08-09-executed-conformance-migration-safety-cover-v2.jpg"
  kicker="Open-source Engineering · Daily Research"
  title="Migration Safety Requires Executed Conformance, Not Merely Correct Output"
  summary="A persisted-state migration can preserve visible output while breaking the mechanism that was supposed to keep replay bounded. Governed migration requires readers that understand every supported historical representation and CI evidence that the shared conformance suite actually executes against each governed backend."
  version="Q-20260809-03"
  status="Daily Runtime V5 · 2026-08-09"
  languageHref="/zh/engineering/2026-08-09-executed-conformance-migration-safety"
  languageLabel="中文"
/>
# Migration Safety Requires Executed Conformance, Not Merely Correct Output

The most deceptive persisted-state migration defects do not necessarily corrupt the final value. A reader can miss a valid historical seed, replay every write from the root and still reconstruct the same additive result. The user sees correct output while the promised bounded-replay mechanism, latency profile and storage access invariant have failed.

## Central judgment

**Migration safety is both a reader-compatibility contract over historical representations and an execution fact about conformance on real backends.**

Fixing only the current writer cannot repair data already stored in older forms. Keeping a conformance test file in the repository does not prove that the relevant backend installed its dependency, instantiated the backend and executed the cases. When an architecture promises bounded replay or bounded query work, that performance property is part of correctness.

The sole analytical input is the `Q-20260809-03` Research Object. Production did not perform an independent database benchmark.

## Source

This article is based on [Research Object — Executed Conformance for Migration Safety](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260809-03-executed-conformance-migration-safety.md). Its evidence trail is [Reading Result — Checkpoint Conformance and Persisted-State Migration](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260809-03-checkpoint-conformance-migration.md).

The concrete defect occurred in persisted delta-history seed lookup. Historical values could reside inline in `channel_values` or externally in `checkpoint_blobs`. The earlier lookup relied on a marker and could therefore miss a migrated plain-value seed.

## Observation

When the seed was missed, the system could start from empty state and replay the full write history. For an additive reducer, the final list still matched the expected value. An output-only assertion therefore failed to expose the regression in the intended mechanism.

The Research Object preserves these implementation facts:

- the repaired reader inspects both blob and inline storage locations;
- seed resolution uses a real blob when present and otherwise the inline value;
- a writer-only marker change would not repair checkpoints already on disk;
- `None` is not treated as a seed because null and absence cannot be distinguished reliably at that layer;
- direct regression tests cover plain values, snapshots, version bumps and inline primitives;
- the selected implementation reports Postgres conformance improving from 6/8 to 8/8;
- a shared conformance file may silently skip for a backend when its dependency is missing.

## Safety-layer comparison

| Check layer | Detects wrong output | Detects historical-form incompatibility | Detects replay-complexity regression | Proves backend coverage |
|---|---:|---:|---:|---:|
| Value-only unit test | Yes | Not necessarily | No | No |
| Backend-local regression test | Yes | For known cases | Can | One backend only |
| Shared conformance file exists | In theory | In theory | Depends on assertions | No; it may skip |
| Conformance actually runs per backend | Yes | Yes | Can encode it explicitly | Yes |

The table is a Research Center testing-governance synthesis based on the Research Object.

## Discussion

Migration compatibility is first a reader responsibility. A new writer controls only future representation. It cannot retroactively convert every historical plain value, blob, marker or old schema. A marker added to new writes can make future records healthy while old records continue to trigger pathological reads.

The second issue is that test presence and test execution are different facts. A conformance file in source control does not prove CI installed the required package, constructed the target backend and ran all cases. `importorskip` is appropriate for optional capabilities, but if a backend is a governed implementation, a silent skip should be reported as missing coverage rather than success.

The third issue is that performance can be a correctness property. The purpose of a delta channel is to avoid replaying from root on every read. If work grows linearly with thread length, the architecture contract is broken even when the reconstructed value is correct. Replay count, query count or scan bounds should therefore appear in assertions.

## Engineering impact

CodeFlowMu and Research Runtime should preserve historical fixtures for every supported result representation: flat narrative fields, structured narrative objects, legacy metric names and string or object evidence/artifacts. Validator and Markdown-projection changes should execute against those fixtures rather than testing only the newest writer output.

A Digital Employee WorkOrder store should similarly document which historical representations remain readable, the repair scan bound and worst-case replay cost. “The value can be read” and “the reader still satisfies the design invariant” are separate claims.

## Boundaries and uncertainty

The selected defect is specific to the Postgres path. The Reading Result states that SQLite stores and inspects values differently and is not affected by the same mechanism. The latency and replay figures are maintainer-reported tests rather than an independent Research Center production benchmark.

The conclusion is not that every backend must share one internal representation. It is that every governed backend must satisfy the same executable external semantics and critical invariants.

## Future work

The next questions are which conformance cases must be non-skippable release gates, how CI should distinguish Not Run from Pass, how replay/query complexity should be encoded across backends, and how schema-version metadata should guide historical reader paths.

## Visualization note

The visual shows inline and blob historical representations feeding a migration-aware reader, followed by conformance that actually executes against governed backends. The bottom statement emphasizes that correct output is not sufficient evidence of migration-invariant safety.

## Evidence and references

1. [Research Object — Executed Conformance for Migration Safety](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260809-03-executed-conformance-migration-safety.md): sole analytical input.
2. [Reading Result — Checkpoint Conformance and Persisted-State Migration](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260809-03-checkpoint-conformance-migration.md): traceability for implementation facts, reported tests, limitations and open questions.
