---
date: "2026-09-08"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260908-01
column: digital-employee
article_type: technical-analysis
project_relevance: none
source_reading: "research/reading/Q-20260908-01-memory-migration-semantic-portability.md"
---

# Research Analysis — Durable Memory Must Be Re-admitted After a Semantic Stack Change

## Research question

When a long-lived digital employee changes its model, reader, writer or embedding stack, what evidence is required before an existing durable memory store may become authoritative memory for the new runtime?

## Evidence identity and research scope

The same-date Reading Note analyzes one controlled primary study of memory portability across four representation classes, two writer/reader models, two embedding versions, directional model swaps, mixed versus full re-indexing, failure localization and recovery experiments. The study is strong for the narrow migration mechanism because it contains designed comparisons and exact-answer tests, but it remains a synthetic workload with one principal cross-family model pair. Its reported results are therefore treated as `source-reported-claim` evidence; the runtime design consequences below are `our-interpretation`, not independent validation of a general production architecture.

The research subject is a **governance-problem + architecture-mechanism + failure-mode**: physical continuity of stored bytes can survive while the semantic contract that made those bytes useful changes underneath them.

## What fails when durability is mistaken for continuity

A storage system can pass file-integrity, database-integrity, deserialization and vector-shape checks while the new runtime retrieves or interprets the stored facts differently. The study supplies two particularly useful counterexamples.

First, free-form NOTES are direction-dependent. Llama reading Qwen-written notes improves by about 9.91 percentage points relative to its own-note condition, while Qwen reading Llama-written notes drops by about 13.28 points. A symmetric average can therefore hide a harmful migration direction. Second, two embedding versions with the same 1024-dimensional vector shape are not semantically interchangeable: a 50/50 mixed index captures only part of the gain achieved by full re-embedding, with the full migration exceeding the mixed condition by about 6.95 percentage points in the reported comparison.

The failure is not simply “memory corruption.” The source localizes distinct losses in construction, retrieval/indexing and reader interpretation. That distinction matters operationally because each failure class requires a different repair path.

## Migration authority should be a separate state

The evidence supports separating at least four facts that are often collapsed into one “memory available” flag:

1. **Storage integrity** — the representation is physically present, parseable and internally well-formed.
2. **Semantic compatibility** — the exact migration direction `(producer/representation/embedder -> new reader/embedder)` passes source-grounded probes at an admitted threshold.
3. **Recovery feasibility** — a retained source or other provenance exists and the current repair procedure has itself been tested for this direction.
4. **Activation authority** — the new runtime is permitted to treat this generation of memory as authoritative after the previous three facts are satisfied and any policy constraints are checked.

This decomposition prevents a deterministic storage check from silently becoming a semantic or governance decision. A memory generation can be durable but quarantined; recoverable but not yet compatible; compatible for one reader direction but not another; or semantically acceptable while still barred by retention, privacy or authorization policy.

## Evidence claims

### E1 — source-reported-claim

**Claim:** Free-form NOTES exhibit strong directional swap asymmetry: one reported direction improves by about 9.91 percentage points while the reverse direction declines by about 13.28 points.

**Source:** https://arxiv.org/html/2609.05339v1, as fully captured in the same-date Reading Note.

**Strength:** reports. **Independent:** false.

### E2 — source-reported-claim

**Claim:** A mixed index built from two same-dimension embedding versions recovers only part of the gain from full re-embedding; the reported full-versus-mixed difference is about 6.95 percentage points.

**Source:** same primary study.

**Strength:** reports. **Independent:** false.

### E3 — source-reported-claim

**Claim:** Retaining raw source materially enables recovery in several tested conditions but does not guarantee repair across repair models; full RAG re-embedding is much more consistently recoverable in this workload than free-form NOTES repair.

**Source:** same primary study.

**Strength:** reports. **Independent:** false.

### E4 — our-observation

**Claim:** Storage shape and semantic compatibility are different evidence identities; matching dimensions or successful deserialization cannot answer whether the new stack preserves retrieval meaning.

**Source:** comparison of E1–E3 and the source's failure-localization experiments.

**Strength:** observed. **Independent:** false.

### E5 — our-interpretation

**Claim:** A governed digital employee should treat model/embedder changes as memory-migration transitions with directional re-admission, provenance and tested recovery evidence before old memory becomes authoritative.

**Source:** bounded synthesis from E1–E4.

**Strength:** supports. **Independent:** false.

## Minimal migration evidence packet

A reusable migration packet should bind the representation generation to its producer/consumer identities rather than merely to a storage schema. At minimum it should record representation and schema version, writer/reader model identity, embedder identity, migration direction, a fixed source-grounded semantic probe set, probe results, provenance to recoverable source where policy permits, the repair procedure/version, and the activation decision that admitted this generation.

For embedding migrations, mixed old/new semantic spaces should be isolated or explicitly versioned unless compatibility is demonstrated. The study does not prove that every mixed index is invalid; it does show that matching dimensionality is too weak to authorize a mixed authoritative store.

## Bounded research judgment

**Durable memory is not automatically portable memory, and portable memory is not automatically authorized active memory.** Model or embedding upgrades should cross a governed migration boundary that separately records storage integrity, directional semantic compatibility, recovery evidence and activation authority.

The strongest operational lesson is directionality. A global “format compatible” label is too coarse when `A -> B` and `B -> A` can behave differently. Evidence should attach to the exact migration tuple and become stale when a component that materially affects semantics changes.

## Counterarguments, limits and unresolved questions

The source does not establish that free-form memory is generally unsafe, that fixed-schema knowledge graphs are universally portable, or that raw-history retention should always be required. The workload is synthetic; the fixed KG schema is task-specific; privacy or retention policy may prohibit preserving raw history; and enterprise memory can include credentials, preferences, procedural state and external records whose migration semantics differ substantially.

Open questions include how small a semantic probe suite can remain while still detecting harmful direction-specific drift; how online systems should isolate partially migrated generations; how privacy-preserving recovery works when raw source cannot be retained; and whether activation authority should expire automatically after model, prompt, schema or embedder changes.

## Editorial recommendation

- **Article type:** technical-analysis
- **Selected modules:** research-question; migration-failure; directional-evidence; four-state-admission-model; recovery-boundary; counterarguments; open-questions
- **Core proposition:** physical persistence, semantic compatibility, recoverability and activation authority are four different states
- **Project relevance:** none
