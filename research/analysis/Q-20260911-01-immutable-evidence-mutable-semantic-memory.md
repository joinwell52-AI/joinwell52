---
date: "2026-09-11"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260911-01
column: digital-employee
article_type: technical-analysis
project_relevance: none
source_reading: "research/reading/Q-20260911-01-immutable-evidence-relational-memory.md"
---

# Research Analysis — Long-Lived Memory Needs Immutable Evidence Beneath Mutable Semantic Views

## Research question

When a long-lived agent continuously updates what it remembers, which state should be immutable, which state may be reinterpreted, and what must remain recoverable so that a mistaken semantic judgment cannot silently rewrite the evidence history that future decisions depend on?

## Research themes and subject kind

- Research themes: long-term memory; evidence and completion truth; audit and provenance; recovery authority; context isolation; state migration; policy boundaries.
- Subject kinds: `architecture-mechanism`, `governance-problem`, `failure-mode`, `research-finding`.
- Primary sample identity: ROAM, a primary study of relation-aware, non-destructive long-term agent memory.

The research subject is not one memory benchmark or one paper implementation. It is the separation of **source observation, semantic relation judgment, active retrieval view and recovery evidence**.

## Evidence identities

### E1 — source-reported-claim

**Claim:** ROAM stores incoming observations as immutable atomic records and does not rewrite the original atomic text when later observations are classified as equivalent, more specific, less specific or contradictory.

**Source:** same-date source-complete Reading Note based on the ROAM primary study.

**Strength:** direct architecture evidence. It supports non-destructive preservation of source observations. **Independent:** false.

### E2 — source-reported-claim

**Claim:** The memory manager classifies relations as Independent, Equivalent, Old→New, New→Old or Contradictory, then applies deterministic precedence `contradictory > old-to-new > equivalent > new-to-old > independent` to state transition after the semantic label has been produced.

**Strength:** direct mechanism evidence. It proves deterministic transition after classification, not objective correctness of the classifier. **Independent:** false.

### E3 — source-reported-claim

**Claim:** Equivalent, superseding and contradictory updates change Primary/Evidence roles while retaining the underlying atomic records; answer-time retrieval primarily uses active Primary/fused views rather than exposing every preserved record equally.

**Strength:** direct evidence that storage preservation and active retrieval authority are distinct properties. **Independent:** false.

### E4 — source-reported-claim

**Claim:** The reported evaluation covers LongMemEval (500 questions), MEME-Post (694 post-change questions) and LongMemEval Controlled (470 annotated items with confounder counts N={0,2,4,6,8}); the Gemma-4-12B-manager configuration reports controlled scores 87.2 / 81.5 / 78.3 / 76.2 / 71.3, plus 63.0 on LongMemEval and 38.9 on MEME-Post.

**Strength:** primary experimental evidence for tested memory-QA behavior and robustness under increasing confounders. It is not production reliability evidence. **Independent:** false.

### E5 — source-reported-claim

**Claim:** Ablations indicate that relation-aware management, non-destructive state organization and retrieval/fusion choices materially contribute to the reported performance rather than the result being only an end-to-end correlation.

**Strength:** mechanism-supporting experimental evidence. **Independent:** false.

### E6 — our-interpretation

**Claim:** Preserving source bytes while allowing a probabilistic relation classifier to change the active Primary is best understood as a separation between evidence authority and retrieval authority. The architecture reduces the cost of a bad semantic judgment because the evidence substrate remains recoverable, but it does not make the active view authoritative truth.

**Source:** bounded synthesis of E1–E5.

**Strength:** supports. **Independent:** false.

## Failure / Finding / Mechanism / Implication

### Failures

1. **Source overwrite:** a later summary or relation judgment replaces the only durable copy of an earlier observation.
2. **Active-view overclaim:** the currently selected Primary is treated as objective truth even though its role was assigned by a probabilistic semantic classifier.
3. **Preserved-but-invisible evidence:** a record survives on disk but cannot be surfaced during dispute, recovery or model migration because default retrieval only exposes the active view.
4. **Fusion without provenance:** a compact fused representation survives while the identities of the atomic records and the relation decision that produced it are lost.
5. **Stale-classification authority:** a relation judgment made under an older model, prompt, policy or schema remains active after the conditions that produced it have changed.
6. **Memory-to-authority leakage:** a remembered statement such as “approved” or “revoked” is mistaken for current execution authorization instead of being rechecked against the responsible authority.
7. **Recovery-from-view only:** restore reconstructs the latest synthesized view but not the evidence history needed to re-evaluate that view.

### Findings

The strongest finding is that **non-destructive storage and mutable semantics are compatible but must be modeled as different state identities**. ROAM demonstrates a concrete way to preserve immutable atomic observations while allowing a model-mediated relation manager to update which records are Primary, Evidence or part of a fused retrieval view.

A second finding is that deterministic transition logic does not eliminate semantic uncertainty. Once a relation label exists, a fixed precedence rule can make the state update inspectable and reproducible. But the relation label itself remains a semantic judgment and can be wrong. Deterministic state transition and trustworthy adjudication are therefore separate properties.

A third finding is that “stored” is too weak a memory-integrity predicate. A preserved record may be demoted from ordinary retrieval and therefore lose answer-time influence even though audit recovery remains possible. Storage presence, semantic role and retrieval eligibility should not be collapsed into one Boolean.

### Mechanism

The evidence supports a governed memory contract with at least four durable identities:

- **Observation identity:** immutable source record plus contextual metadata and provenance.
- **Relation-decision identity:** the semantic classification, including model/prompt/version and decision provenance.
- **Active-view identity:** the current Primary/fused representation used by ordinary retrieval.
- **Evidence-history identity:** preserved records and prior relation transitions that can be surfaced for audit, reclassification and recovery.

A fifth useful identity is **retrieval-policy identity**: the rule that determines when Evidence records may re-enter context during dispute, migration, contradiction review or recovery.

Under this model, semantic updates may change the active view without mutating the evidence substrate. Reclassification can create a new active identity while retaining the previous relation decision as history. A migration can selectively re-evaluate relation decisions made by an older model without reconstructing source evidence from compressed summaries.

### Implication

For long-lived digital employees, **evidence should be harder to mutate than interpretation**. Semantic memory can evolve, but source observations and the provenance of transformations should remain separately addressable so that a later model, reviewer or recovery process can disagree with the earlier interpretation without needing to recreate history.

This is a recovery and audit property, not a claim that relational memory makes authorization safe. High-impact permissions, target identity and organizational truth still require their own authoritative sources and execution-time enforcement.

## Comparisons and contradictions

The architecture creates an important contrast between **non-destructive storage** and **non-destructive semantics**. ROAM is non-destructive at the atomic-record layer, yet it deliberately changes which representation is active at retrieval time. A contradiction can therefore preserve both historical statements while still preferring one as current Primary.

That contradicts a common simplification: “if the old fact is still stored, nothing was lost.” From a governed runtime perspective, influence can be lost without bytes being deleted. A demoted Evidence record may not participate in normal answer generation unless an explicit audit or recovery path surfaces it.

The reported benchmarks also create a useful boundary. Improved long-term memory QA supports the mechanism under tested workloads, but it cannot be promoted into evidence that remembered permissions, identities or policy facts are authoritative. Memory quality and authorization validity are different evaluation domains.

## Bounded research judgment

**A governed long-term memory system should treat immutable source observations, semantic relation judgments and active retrieval views as separate state identities; semantic updates may replace the active view, but they should not erase or silently rewrite the evidence from which that view was derived.**

The strongest architectural value is recoverability: when a semantic classifier is wrong, the runtime can reclassify or rebuild the active view from preserved evidence rather than trusting the previous model's summary as the only surviving truth.

This judgment does not imply that every memory record must remain in ordinary context, nor that immutable storage alone guarantees correctness. Efficient retrieval can continue to filter and fuse. The requirement is that pruning answer-time context must not become destruction of audit/recovery evidence, and that the system can distinguish “not currently retrieved” from “no longer exists.”

## General implications

For agent runtimes and digital-employee systems:

- source observations should have stable identities independent of model-generated summaries;
- relation decisions should carry model/prompt/version provenance and be re-evaluable after material model or policy changes;
- active retrieval views should be versioned and rebuildable from evidence rather than becoming the sole truth source;
- audit mode should be able to surface demoted Evidence without forcing all evidence into ordinary context;
- contradiction handling should distinguish temporal supersession from simultaneous source disagreement;
- recovery should restore evidence history and relation provenance, not only the latest compacted view;
- remembered authorization statements should be treated as evidence inputs, not execution authority, unless the responsible authority source says otherwise.

## Limitations and counterarguments

ROAM is fresh primary research and independent replication is not yet established. Its experiments focus on memory question answering, controlled confounders and retrieval behavior rather than irreversible tool effects, organizational adjudication, distributed consistency or security policy.

The relation classifier remains fallible. The paper shows that non-destructive state organization can reduce the cost of a semantic mistake, not that the active view is always factually correct. Preserving atomic records also has storage and management costs, and not every runtime needs all historical evidence in hot retrieval.

The reported benchmark and ablation results support relation-aware non-destructive memory under tested workloads. They do not establish exactly-once ingestion, concurrent-writer semantics, crash consistency across hosts, universal latency superiority or a complete authorization architecture.

## Open questions

1. Which relation decisions should be invalidated automatically after a model, policy or schema change?
2. What minimum provenance is needed to reproduce why one record became Primary and another Evidence?
3. How should audit retrieval expose demoted evidence without overwhelming normal context budgets?
4. Can deterministic invariants reject impossible relation transitions before model-generated semantics alter the active view?
5. How should concurrent contradictory observations be ordered so retries cannot silently reverse the current Primary?
6. Which remembered facts are acceptable evidence for authorization, and which must always be refreshed from an external authority source?
7. What recovery contract proves that an active view was rebuilt from the same immutable evidence set after migration?

## Editorial recommendation

- **Article type:** technical-analysis
- **Selected modules:** research-question; evidence-identities; memory-state-separation; relation-transition-mechanism; retrieval-authority; failure-modes; recovery-and-migration; benchmark-boundaries; governance-implications; counterarguments; open-questions
- **Core proposition:** long-lived agent memory should make evidence harder to mutate than interpretation; immutable observations, semantic relation judgments and active retrieval views need separate identities so a wrong model judgment remains reversible
- **Project relevance:** none
