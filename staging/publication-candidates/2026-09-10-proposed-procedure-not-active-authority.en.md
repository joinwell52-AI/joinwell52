---
schema: publication-candidate-article/v2
title: "A Proposed Procedure Is Not Yet Active Authority"
date: '2026-09-10'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "当智能体可以修改将指导未来执行的流程时，什么证据与状态隔离应决定一个提议的结构变化能否成为生效流程？"
summary: "The right to propose a better procedure is not the right to activate it. Self-evolving systems need stable candidate identity, evidence separated from proposal generation, explicit adoption, durable rejection, expiry, and rollback."
cover: staging/publication-candidates/2026-09-10-proposed-procedure-not-active-authority-cover.png
sources:
  - research/analysis/Q-20260910-02-evidence-gated-self-evolving-procedure-adoption.md
---

![A provisional form approaches an evidence threshold while active structure remains anchored](staging/publication-candidates/2026-09-10-proposed-procedure-not-active-authority-cover.png)

# A Proposed Procedure Is Not Yet Active Authority

After completing a task, an agent sees that its procedure took an unnecessary detour. It removes one step, adds a shortcut, and saves the revised structure for the next run. The change looks coherent and may genuinely improve efficiency.

But the system has done more than preserve a lesson. A procedure changes the ordering of future actions, tool selection, stopping conditions, and side effects. The right to propose that change is not the right to let it govern future work.

The central argument is: **a self-evolving procedure must remain candidate control state until an explicit adoption gate evaluates evidence not used to generate the proposal. The active procedure needs a separate, stable identity until that gate passes.**

## Procedure Change Is Control Deployment

A note can inform later reasoning. Procedure state directly shapes behavior. It determines when a tool is called, what evidence is observed first, whether failure causes another attempt, and which condition closes the task. A procedure change can widen the effect surface even when the model and tool catalog remain fixed.

For that reason, modifying a procedure is closer to deploying a policy than editing prose. The highest-risk design lets the refiner overwrite active state directly. The system cannot freeze candidate identity, and it cannot prove that the object later evaluated is the object eventually activated.

The first boundary is simple: keep the current active identity frozen during execution. New structures created offline enter a candidate space. The proposer may explore freely, but proposal does not carry activation authority.

## Why Held-Out Evidence Matters

The same-day Research Object analyzes Procedural Graphs, a primary study that externalizes procedural knowledge as a directed attributed graph. The retained graph stays fixed during each inference episode. Between batches, an offline refiner generates a candidate that must pass structural checks and behavioral validation.

The validation examples are disjoint from the training trajectories that generated the mutation, and they are also separate from the final test set. A candidate replaces the retained graph only when mean validation performance matches or exceeds the baseline. The important feature is not one score. It is the evidence relationship: **the material that causes a change cannot be the complete evidence authorizing that change.**

This separation prevents the system from treating improvement on the motivating examples as self-validating deployment proof. A proposed improvement becomes an object that can be rejected, not an automatically effective self-description.

## Rejection Is a Normal Outcome

The reported search trace is non-monotonic. Some rounds produce no committed update. One proposal fails structural validation. Another candidate is rejected when validation survival falls from ninety percent to eighty-five percent. Rejected candidates can remain as negative evidence without becoming the next active graph.

A self-evolving system that records only the final successful upgrade loses some of its most useful governance evidence. No-op rounds, malformed structures, and behavioral regressions show the boundary of the search process.

Rejected state should be durable but non-executable. It can inform later proposals, yet recovery, caching, or rollback must not confuse it with a previously accepted version. Otherwise preserving negative evidence creates a side door for activation.

## Data Separation Is Not Adjudicator Independence

Held-out samples create real evidence separation, but not complete independence. In the reported configurations, solving, guidance, and offline refinement can use the same underlying language model. Disjoint datasets reduce direct reuse of proposal-generating examples while shared model blind spots may remain.

Mean task performance also observes only the dimensions encoded by the metric. Rare authorization failures, irreversible effects, recovery regressions, or cost explosions can be diluted by ordinary successes. Structural validation catches explicit formation and reachability defects, but it does not prove that every semantic or safety constraint holds.

Two types of independence should remain distinct. Data independence asks whether acceptance evidence comes from the same examples that caused the proposal. Adjudicator independence asks whether evaluation can reveal systematic failures the proposer is unlikely to see. High-impact procedures often need both.

## What a Minimum Adoption Contract Binds

An auditable activation decision should bind at least these facts.

- Candidate identity: fixed content digest, version, generation provenance, and parent.
- Active identity: unchanged until adoption completes and never aliased to a mutable candidate pointer.
- Structural evidence: validator version, results, and explicitly uncovered constraints.
- Behavioral evidence: validation examples, metric, baseline, failures, and uncertainty.
- Decision authority: the person or mechanism allowed to move a candidate into active state.
- Freshness: the model, tool, policy, and environment changes that expire prior evidence.
- Rollback target: the previously accepted identity restored after an incident.
- Rejection record: a visible failed candidate that never receives execution authority.

The activation itself should be atomic. The system either continues to reference the old active identity or, after every gate passes, references the exact candidate that was evaluated. It cannot test one artifact and activate a later mutable descendant.

## Passing the Gate Is Not Permanent Proof

A common objection says that any candidate with a non-decreasing held-out score should be activated automatically. For low-risk, reversible settings with strong metric coverage, that rule can be a useful minimum. It is not a universal safety proof.

The validation set may be small. The benchmark may observe average completion while missing rare severe outcomes. The evaluator may share the proposer's model-level bias. Tool catalogs, permission policies, and operating environments also change, making old adoption evidence stale.

A more faithful lifecycle includes candidate, evaluating, rejected, adopted, stale, and revoked. Historical acceptance remains a fact, but it does not automatically become current authority after its dependencies change.

## Boundaries and Open Questions

Procedural Graphs is recent primary research and does not prove that its exact mechanism fits every production system. The experiments do not establish concurrent-refiner safety, crash-consistent activation, signed adoption authority, or cross-system rollback after incidents. Structural validation also does not enforce every semantic constraint.

The supported conclusion is a minimum architecture boundary: separate candidate from active state, evaluate evidence not used to generate the proposal, keep rejected state non-executable, and bind acceptance to freshness and rollback. It does not support authorizing any high-impact procedure merely because average performance did not decline.

Open questions remain. Which safety and authorization dimensions must join task performance? When should admission require a different model, deterministic validator, or accountable human authority? How can a runtime prove byte-for-byte identity between the candidate evaluated and the object activated? What model, tool, policy, or environment changes expire evidence? After an incident, how should rollback and re-adoption remain one verifiable trajectory?

**Evidence and citation:**

- [Procedural Graphs primary study](https://arxiv.org/html/2609.09153v1)
