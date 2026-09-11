# Q-20260911-01 — Long-Term Agent Memory Needs Immutable Evidence Beneath Mutable Semantic Views

- Runtime date: 2026-09-11 (Asia/Shanghai)
- Queue signal: SIG-20260911-007
- Primary research source: https://arxiv.org/html/2609.09778v1
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When an agent updates long-term memory as new observations arrive, what should remain immutable, what may change semantically, and what evidence is needed to recover from a mistaken relation judgment without rewriting history?

## Problem

Long-lived agents need to incorporate duplicates, refinements and contradictions without letting every new interpretation overwrite the evidence that produced the old state. A memory system therefore has at least two different responsibilities: preserving what was originally observed and deciding which representation should be active for current retrieval.

ROAM is useful because it separates these layers explicitly. Incoming observations are stored as immutable atomic records, while a relation-aware manager assigns semantic relations and changes the active Primary/Evidence organization used for retrieval. The resulting architecture is non-destructive at the atomic-record layer, but it is not semantically neutral: a mistaken relation decision can change which record is exposed by default retrieval even though the original observation remains stored.

The bounded runtime question is therefore not simply whether memory is persistent. It is whether **source evidence, semantic judgment, active retrieval authority and recovery history remain distinguishable states**.

## Immutable Atomic Records

ROAM stores each incoming observation as an atomic record with its text and contextual metadata. The underlying atomic text is not rewritten when later observations arrive. That design matters because a contradiction or refinement does not destroy the earlier source statement; the earlier record can remain available as evidence even after its role in the active memory view changes.

This gives the system a recoverable substrate. If a later semantic relation judgment proves wrong, the original records still exist and can in principle be reclassified or re-fused without reconstructing them from a model summary.

However, immutability is only one layer of the contract. The memory manager still determines which atomic records become Primary and which become Evidence, so preservation of bytes does not guarantee preservation of answer-time influence.

## Relation Taxonomy and Deterministic Precedence

The manager classifies a new observation against relevant existing memory using five relation types:

- `Independent`
- `Equivalent`
- `Old→New`, where the new observation is a more specific or updated form
- `New→Old`, where the existing observation remains the more specific or preferred form
- `Contradictory`

When multiple relation labels are available, the implementation applies a deterministic precedence ordering:

`contradictory > old-to-new > equivalent > new-to-old > independent`

The deterministic transition rule makes the state update inspectable and reproducible after the semantic classification has been made. It does **not** make the classification itself objectively true. The LLM-based relation classifier remains a semantic judgment component, and an incorrect label can still cause the wrong record to become active.

This distinction is important for agent runtimes: deterministic state transition and trustworthy semantic adjudication are different properties.

## Primary and Evidence Are Different Memory Roles

ROAM changes role/state rather than rewriting the original observation.

### Equivalent

When two observations are considered equivalent, the earliest matching Primary is retained and the duplicate becomes Evidence. This reduces redundant active context while preserving provenance that the same fact was observed again.

### Old→New

When the new observation is judged to supersede or refine the old one, the new record becomes Primary and the older one moves to Evidence.

### New→Old

When the new observation is less specific than an existing Primary, the earlier Primary remains active and the new record is retained as Evidence.

### Contradictory

When a new observation contradicts an existing Primary, the new record becomes current Primary while the old record remains Evidence. The fused representation can preserve the temporal relationship rather than erasing the older state.

This architecture therefore separates **what happened in the evidence stream** from **what the memory currently presents as the preferred answer-time representation**.

## Retrieval Uses an Active View, Not the Whole Archive Equally

Answer generation primarily retrieves from the active Primary views rather than treating every atomic observation as equally eligible context. Relation-aware filtering and fusion are part of the mechanism that improves context efficiency and benchmark performance.

That means a record can remain durably stored yet become inactive in normal retrieval. Calling the architecture non-destructive is accurate at the atomic-record layer, but it would be an overclaim to infer that every preserved observation remains equally visible to the model at answer time.

For a governed runtime, this creates a useful four-way distinction:

1. **Observation identity** — the immutable record of what was received.
2. **Semantic relation judgment** — the classification connecting that record to existing memory.
3. **Active retrieval view** — the current Primary/fused representation used by default.
4. **Evidence history** — records retained for audit, reclassification and recovery even when inactive.

A recovery mechanism that restores only the active view but not the underlying evidence history would lose an important part of the state.

## Evaluation Scope

The paper evaluates the mechanism on long-term memory question answering rather than on authorization or organizational truth.

The reported datasets include:

- **LongMemEval**, 500 questions.
- **MEME-Post**, 694 post-change questions designed around memory updates.
- **LongMemEval Controlled**, 470 annotated items with increasing confounder counts `N={0,2,4,6,8}`.

The comparisons include append-all memory and managed-memory baselines such as Mem0 and an EverMemOS-style implementation. The experiments isolate the effect of relation-aware management, non-destructive storage and retrieval/fusion choices.

For the ROAM configuration using a Gemma-4-12B manager, the paper reports LongMemEval Controlled scores of **87.2 / 81.5 / 78.3 / 76.2 / 71.3** as confounders increase, plus **63.0** on LongMemEval and **38.9** on MEME-Post. The Qwen3.5-9B manager reports **59.8** on LongMemEval and **33.1** on MEME-Post; Qwen3-8B reports **58.6** and **31.6**, respectively.

These results support the claim that explicit relation-aware, non-destructive memory management can improve tested long-context memory QA. They do not prove that the resulting active memory state is always factually correct.

## Ablations and Mechanism Evidence

The ablations indicate that both relation-aware management and the non-destructive architecture contribute to performance, while retrieval filtering/fusion also matters. This is stronger evidence than a single end-to-end score because the paper tests whether the proposed state organization itself contributes to the result.

At the same time, the relation classifier remains fallible. The system can preserve the original observation and still make a bad active-state choice. The architecture therefore reduces the cost of a semantic mistake by preserving recoverable evidence; it does not eliminate the possibility of a semantic mistake.

That is a meaningful governance property. A system can be designed so that a model judgment is **reversible because the underlying source record survives**, even when the judgment itself is probabilistic.

## Context Budget, Storage and Latency

The appendices examine management-token consumption and context-budget sensitivity, showing that the approach is designed to control active memory rather than simply append every observation indefinitely. The paper also discusses storage and management overhead.

The evidence is sufficient to support a bounded efficiency claim about active-context management under the tested workloads. It is not sufficient to claim a universal production wall-clock latency advantage across arbitrary agent workloads, storage backends or retrieval infrastructures.

## Non-Destructive Storage Is Not Non-Destructive Semantics

The most important boundary is that ROAM preserves the atomic source record while allowing the semantic view to change.

Suppose an important observation is incorrectly classified as a duplicate or as superseded. The record can remain safely stored as Evidence, yet ordinary retrieval may no longer expose it as a Primary. From the perspective of audit and recovery, the information survives. From the perspective of the next model invocation, its influence can still be reduced or hidden.

Therefore a governed long-term memory system should not use a single Boolean such as `stored=true` to represent memory integrity. At minimum, it should preserve separate facts for:

- immutable source presence,
- relation-classification identity and provenance,
- current Primary/Evidence role,
- active retrieval eligibility,
- fused-view identity,
- and a recovery path that can re-evaluate prior judgments.

## Implication for Long-Lived Agent State

The paper supports a useful runtime inference: **primary evidence should be harder to mutate than semantic interpretation**.

A durable agent memory can allow model-generated semantic views to evolve while retaining the original observation as a separately addressable artifact. This makes later audit, model migration and reclassification possible without trusting the previous model's compressed interpretation as the only remaining truth.

That principle is especially relevant when agent context is compacted or moved across model versions. The state that must survive is not merely a synthesized note; it includes the source observations and the provenance of the transformations that made one view active.

## Boundary with Authorization and Organizational Truth

ROAM is a memory-QA study. Its successful retrieval behavior cannot be generalized into proof that an agent has correct authorization, correct target identity, or correct organizational facts.

A relation classifier deciding that a new memory supersedes an old one is not the same as an authority deciding that a permission has been revoked. A fused temporal view is not a signed authorization record. A high memory-QA score is not evidence that irreversible external effects are safely governed.

For high-impact systems, memory may help recover the evidence needed for an authorization decision, but the authorization decision should still be made by the responsible authority and enforced by the execution boundary.

## Failure Modes for a Governed Memory Runtime

### Source overwrite

A new interpretation replaces the only stored copy of the prior observation, making later audit or reclassification impossible.

### Primary-state overclaim

The current Primary is treated as objective truth even though it is the output of a probabilistic semantic classifier.

### Preserved-but-invisible evidence

Evidence remains on disk but ordinary retrieval cannot surface it during dispute, recovery or model migration.

### Fusion without provenance

A concise fused view survives but the identities of the underlying atomic records and the relation decision are lost.

### Classification freshness failure

A relation judgment made under an older model, policy or environment remains permanently active after the conditions that justified it have changed.

### Memory-to-authority leakage

A remembered statement such as “approved” or “revoked” is treated as execution authorization without checking the current authoritative source.

## Evidence Strength

This is strong primary research evidence for non-destructive atomic memory combined with relation-aware active-state management. The study includes multiple benchmarks, controlled confounders, several manager models, baseline comparisons and ablations that expose the contribution of the architecture.

The strongest supported claim is that preserving atomic records while changing Primary/Evidence roles can improve recoverability and memory-QA performance relative to simpler management strategies. The evidence is weaker for claims about production reliability, security policy, authorization correctness, distributed consistency or organizational truth.

## Limits and Unknowns

- The work is fresh primary research and independent replication is not yet established.
- Relation labels are semantic judgments and can be wrong even when state transitions are deterministic.
- Preserving an atomic record does not guarantee that the record is visible in default retrieval after demotion to Evidence.
- The benchmarks test memory question answering, not irreversible tool effects, permissions, compliance or organizational adjudication.
- The paper does not establish a universal wall-clock latency advantage across production storage and retrieval stacks.
- Concurrent writers, exactly-once ingestion, crash consistency and cross-host recovery are outside the central experimental proof.
- The study does not by itself define how long a semantic relation judgment should remain fresh after model or policy changes.

## Unresolved Questions

1. Should every semantic relation decision carry the model/prompt/version identity that produced it so a later migration can selectively re-evaluate old judgments?
2. What retrieval mode must expose demoted Evidence during audit or dispute without flooding normal answer-time context?
3. How should a runtime invalidate or refresh relation judgments after model, policy or schema changes?
4. Can a deterministic verifier detect impossible semantic transitions before a model-generated relation changes the active Primary?
5. How should contradictory memories distinguish temporal change from simultaneous source disagreement?
6. Which memory facts may be used as evidence for authorization, and which must always be re-read from an external authority source?
7. How should concurrent observations be ordered so a crash or retry cannot silently reverse which record becomes current Primary?

## Reading Conclusion

The selected evidence supports a bounded conclusion: **long-term agent memory should preserve the original observation more durably than it preserves the model's current interpretation of that observation.** ROAM demonstrates one concrete mechanism: immutable atomic records remain available while a relation-aware manager changes Primary/Evidence roles and constructs an active retrieval view. This improves memory management under the tested workloads and makes semantic updates more recoverable, but it does not make the active view infallible. For an agent-native runtime, immutable evidence, semantic judgment, active retrieval authority and recovery history should remain separate state identities.

This Reading Note performs evidence extraction only. It does not execute Research Analysis, article writing, visualization, Production or Publication.
