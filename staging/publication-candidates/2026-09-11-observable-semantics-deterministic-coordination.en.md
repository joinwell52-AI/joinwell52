---
schema: publication-candidate-article/v2
title: "Deterministic Coordination Starts Where Semantics Become Observable"
date: '2026-09-11'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "当复合智能体系统用确定性机制替代生成式协调管理器时，什么证据足以证明局部可复现的单元选择可以承担全局业务含义？"
summary: "Deterministic coordination can remove arrival-order discretion and preserve unit-level provenance, but it carries business meaning only when work units, candidate admissibility, and coupling constraints are sufficiently observable. Reproducibility is not semantic correctness or authority."
cover: staging/publication-candidates/2026-09-11-observable-semantics-deterministic-coordination-cover.png
sources:
  - research/analysis/Q-20260911-02-observable-units-deterministic-coordination-boundary.md
---

![Precise units form a whole while a bright seam exposes unresolved coupling](staging/publication-candidates/2026-09-11-observable-semantics-deterministic-coordination-cover.png)

# Deterministic Coordination Starts Where Semantics Become Observable

Three agents fill different parts of one report. A track machine chooses the highest-scoring candidate for every field. The rule is fixed, the result does not depend on arrival order, and every selected value can be traced to its contributing agent.

The final report can still contradict itself. Revenue may use one definition, growth another time window, and the recommendation a third scope. Every local decision is reproducible and attributable while the whole remains semantically invalid.

The central argument is: **deterministic coordination may carry business meaning only when work-unit identity, candidate admissibility, and relevant coupling constraints are sufficiently observable. Reproducibility and provenance are valuable properties, but neither resolves hidden semantic responsibility.**

## Deterministic Selection Requires a Representation Contract

The same-day Research Object analyzes UnitBoost, a primary study of deterministic unit-level coordination. It represents a target output as identifiable units or slots, allows multiple proposals to supply values for the same unit, and applies a constrained fixed selection rule.

The actual first step is therefore not the selector. It is the representation contract. The system must know which unit a contribution belongs to, which candidates are comparable, and which conditions admit a candidate into selection. Deterministic machinery does not create those facts. It consumes an already explicit structure.

If a model silently invents unit boundaries on every run, the generative decision has merely moved upstream. The final merge can be identical for identical inputs while the input units change with each decomposition.

## What Order-Invariance Removes

Under its stated assumptions, the study's selection does not depend on proposal presentation or arrival order. That is valuable in a compound runtime. Network latency, worker speed, and scheduling order should not become accidental business semantics.

Order-invariance removes incidental scheduling discretion, not all uncertainty. Candidate values can be false. Scores can come from models. Admissibility constraints can omit a critical relationship. A fixed rule can choose the same wrong value every time.

The guarantee should be stated precisely: the same declared inputs and rule produce the same result. It is not that the result is therefore correct. Reproducibility improves audit and recovery only when input identity and rule coverage are also visible.

## Why Unit-Level Provenance Matters

When a result is assembled from identifiable units, the runtime can record which proposal supplied every selected value. That source mapping is clearer than a generative manager reading several complete answers and writing a new synthesis whose phrases blend multiple origins.

Provenance answers where this value came from. It does not establish that the value is true, safe, compatible with every other unit, or authorized for execution. Treating provenance as correctness merely gives a well-attributed error faster institutional trust.

A complete evidence chain should also preserve candidate version, score origin, admissibility judgment, selector version, and final assembly identity. Only then can a dispute replay the decision instead of inspecting an unexplained output.

## Residual Work Needs an Identity

After one selection round, units without satisfactory supply become residual work. The study reports that targeting true unresolved units in later rounds outperforms random targeting and rereading controls. Explicit residual state helps allocate additional effort.

For a durable runtime, the operational meaning is direct. Incomplete should be a stable set of unit identities, not a conversational impression. Recovery should rerun only the residual, while already closed units remain closed.

That requires an idempotency boundary. Each unit should distinguish unsupplied, candidate available, selected, validated, and committed. Otherwise a crash-time retry can duplicate external effects or turn no admissible value yet into the false conclusion that the whole task is complete.

## Coupling Determines Whether Local Results Compose

The strongest limit is cross-unit coupling. When one unit's correct value depends on another, independent selection can produce a collection of locally admissible and globally contradictory choices. The study measures this risk through repair cost and reports that stronger coupling erodes the mechanism's advantage.

Before admitting deterministic coordination, a system should therefore ask whether global constraints can be expressed as machine-checkable rules. If not, can repair cost be measured? At what threshold must the whole artifact move to semantic review?

Common couplings include shared time definitions, claim-evidence pairing, budget totals, sequential decision dependencies, and permission boundaries jointly determined by several fields. Passing a local validator does not prove that those relationships hold.

## A Minimum Coordination Contract

Auditable deterministic coordination should materialize at least these states.

| State | Observable content | Purpose |
|---|---|---|
| Unit identity | stable key, scope, independence assumption | define what is compared |
| Candidate supply | value, version, origin, production conditions | preserve selectable input |
| Admissibility evidence | types, constraints, check results | exclude ineligible candidates |
| Selection rule | fixed logic, version, tie behavior | make choice reproducible |
| Coupling evidence | global constraints, repair cost, risk | determine whether local choices compose |
| Residual identity | exact set of unresolved units | support later rounds and recovery |
| Semantic acceptance | whole-artifact coherence and responsibility | resolve meaning outside the contract |
| Execution authority | current target, scope, and effect permission | govern external action |

The last two do not disappear because the first six are complete. A track machine can materialize an explicit contract. It cannot gain unassigned semantic responsibility from a stable score.

## When Intelligent Management Must Remain

The study names negative conditions. Unit-level coordination loses its intended advantage when the task is effectively indivisible, unit identity is unavailable, every emitted unit creates unfavorable cost, or cross-unit coupling is too strong.

Open-ended research, negotiation, design, and strategy often contain these properties. Their value can depend on overall structure rather than independent slots. Forced decomposition hides the hard decision in unit creation, scoring, or later repair.

That does not require one unconstrained generative manager. A system can use whole-artifact constraint checks, a different-model review, or accountable human acceptance. The invariant is to acknowledge that remaining semantics are not fully observable to the deterministic contract.

## Evidence Boundaries of the Comparisons

Across held-out evaluations, the study reports that unit-level coordination outperforms the strongest single candidate and tested generative managers. Replacing only the management layer in six compound configurations also reports positive gains. Controls support residual targeting as one mechanism behind the result.

Those findings provide empirical support without proving that every system should remove generative coordination. The experiments do not establish exactly-once external effects, transaction rollback, call-time authorization, or distributed-worker recovery. Cost advantages also depend on endpoint economics.

The transferable lesson is not code beats models. It is a responsibility boundary: programs can own decisions whose inputs and compatibility conditions are completely observable; incomplete units, coupling, or business meaning must remain assigned to accountable intelligence.

## Boundaries and Open Questions

Open questions remain. How can a system prove that a unit decomposition is stable across retries and models? How should coupling be measured before selected units create external effects? Which global constraints are deterministic? What repair-cost threshold should trigger whole-artifact review? How should residual identity survive a crash? Can unit provenance extend through final external effect?

A practical baseline is available: **deterministic machinery should adjudicate only facts it can completely observe. Semantics hidden in decomposition, scoring, and coupling require an accountable intelligence or authority rather than a reproducible approximation presented as business truth.**

**Evidence and citation:**

- [UnitBoost primary study](https://arxiv.org/html/2609.09815v1)
