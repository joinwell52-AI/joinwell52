---
schema: publication-candidate-article/v2
title: "Memory May Revise Interpretation, Not Evidence"
date: '2026-09-11'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "当长寿命智能体持续更新记忆时，哪些状态应保持不可变，哪些状态可以重新解释，又必须保留什么恢复证据，才能避免错误语义判断悄悄改写未来决策所依赖的证据历史？"
summary: "Long-lived memory must evolve without letting a later semantic judgment overwrite its evidence. Separate immutable observations, relation decisions, active retrieval views, and recoverable history so an interpretation can be reversed without reconstructing facts from summaries."
cover: staging/publication-candidates/2026-09-11-memory-interpretation-not-evidence-cover.png
sources:
  - research/analysis/Q-20260911-01-immutable-evidence-mutable-semantic-memory.md
---

![Stable evidence crystals remain beneath a changing semantic surface](staging/publication-candidates/2026-09-11-memory-interpretation-not-evidence-cover.png)

# Memory May Revise Interpretation, Not Evidence

A digital employee first records that a customer approved a plan. Later it receives a narrower statement: approval applies only to a test environment. To save context, the system fuses both observations into one compact summary. A month later, the model, prompt, and policy have changed, yet the old summary is the only object ordinary retrieval returns.

The risk is not merely that the summary might be inaccurate. If the source observations and the relation decision that produced it were overwritten, a later reviewer can suspect an error but cannot re-adjudicate from the evidence.

The central argument is: **long-lived memory should make evidence harder to mutate than interpretation. Source observations, relation decisions, active retrieval views, and recoverable evidence history require separate identities. Semantics may evolve without silently rewriting their provenance.**

## What Non-Destructive Storage Protects

The same-day Research Object analyzes ROAM, a primary study of relation-aware, non-destructive long-term memory. Incoming observations are stored as immutable atomic records. When later observations are classified as equivalent, more specific, less specific, or contradictory, the original atomic text is preserved while relations and active roles change.

The first benefit is contestability. A model can decide today that one observation supersedes another. A different model tomorrow can revisit the same source records and disagree. A mistaken relation does not become an irrecoverable historical fact simply because it once entered the primary retrieval view.

Immutable does not mean that every record must always occupy hot context. It means that sources remain individually addressable, transformations can refer back to their inputs, and recovery does not have to infer history from a compressed conclusion.

## Deterministic Transition Is Not Semantic Truth

The study's memory manager first assigns a semantic relation and then applies a fixed precedence rule to update state. Once labels such as contradictory, old-to-new, or equivalent exist, deterministic machinery makes role transitions reproducible.

That property matters, but it is easy to overclaim. The rule guarantees how state changes given a label. It does not prove the label correct. Relation classification still depends on model judgment and can vary with prompt wording, model version, context, or ambiguity.

A governed record therefore needs two kinds of provenance. It should say which deterministic transition rule ran, and it should preserve which model, prompt, inputs, and rationale produced the semantic label. Otherwise the visible transition is reproducible while the disputed semantic step disappears upstream.

## A Stored Record Can Lose Influence

Non-destructive storage retains atomic records, but ordinary answer-time retrieval primarily favors current primary or fused views. A demoted evidence record can remain on disk while losing influence over normal responses.

Stored is therefore too weak a predicate. Governance needs to distinguish at least three questions:

- Do the bytes still exist?
- Is the record currently primary, evidence, or historical state?
- Which retrieval policy allows it to re-enter context?

A system that checks only the first question can claim nothing was lost while discoverability and influence have disappeared. If dispute, migration, and recovery paths cannot surface demoted evidence, preservation becomes nominal rather than operational.

## Four Identities Make Error Recoverable

A governed memory contract needs at least four core identities.

| Identity | Persisted content | Purpose |
|---|---|---|
| Observation | source text, time, origin, context | preserve the evidence substrate |
| Relation decision | label, model, prompt, inputs, rationale | explain how interpretation was created |
| Active view | primary or fused representation used in ordinary retrieval | control context efficiency |
| Evidence history | demoted records and prior transitions | support audit, reclassification, and recovery |

A fifth identity, retrieval policy, explains when evidence can return. A new contradiction, model migration, policy change, accountable challenge, or recovery exercise should expose relevant atomic records and relation history instead of returning only the current summary.

Under this model, a semantic update creates a new active view without mutating the evidence layer. Migration to a new model can selectively revisit old relation decisions rather than reconstructing source history from already fused prose.

## Memory Decisions Need Freshness

Relation judgments are not timeless. A model upgrade, prompt revision, changed business vocabulary, or new authorization policy can invalidate the basis for an old classification. Records once treated as equivalent may need separation. An apparent supersession may turn out to describe another time or environment.

Relation decisions should therefore bind their production conditions and carry expiry rules. Expiry does not delete the old decision. It means the active view must be rebuilt while the prior decision becomes history.

Rebuilding also needs an input-set proof. Only by naming the immutable observations used can the runtime verify that migration omitted nothing or that concurrent contradictions were not reordered incorrectly.

## Remembered Approval Is Not Current Authority

This architecture must not convert a remembered approval into execution permission. A record may accurately describe an earlier approval while target, scope, accountable principal, and time window have changed.

Memory can supply evidence to an authorization process. Current effect authority must still come from the responsible source at execution time. Otherwise even perfect historical memory confuses past truth with present permission.

The same boundary applies to identity, policy, and completion claims. Retrieval can surface a statement, but memory alone does not adjudicate authoritative external state.

## What the Benchmarks Establish

The study reports improvements across long-term memory question-answering datasets and controlled confounder settings. Ablations also indicate that relation-aware management, non-destructive state organization, and retrieval choices each contribute to the reported behavior.

Those findings provide empirical support for the tested mechanism. They do not prove distributed write consistency, cross-host recovery, irreversible tool safety, or organizational authorization. The work studies memory organization and retrieval, not an entire production governance system.

The transferable conclusion is state separation and recoverability, not a universal reliability claim derived from benchmark gains.

## Boundaries and Open Questions

Immutable storage imposes capacity, indexing, privacy, and retention costs. Not every record should survive forever. Deletion obligations, retention periods, and access control require separate policy. Relation classification can also remain wrong; preserving evidence reduces repair cost but does not guarantee that the active view is true.

Open questions remain. Which relation decisions should expire after a model or policy change? What minimum provenance makes classification reproducible? How should audit retrieval expose demoted evidence without overwhelming ordinary context? Which accepted ordering governs concurrent contradictions? How can recovery prove that a rebuilt view used the same evidence set? Which remembered facts may inform authorization but never become authority directly?

**Evidence and citation:**

- [ROAM primary study](https://arxiv.org/html/2609.10283v1)
