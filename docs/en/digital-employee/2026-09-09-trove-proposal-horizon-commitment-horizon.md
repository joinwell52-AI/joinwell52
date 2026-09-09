---
schema: "publication-candidate-article/v2"
title: "A Plan Is Not a Commitment: What TROVE Changes About Agent Orchestration"
date: "2026-09-09"
column: "digital-employee"
category: "academic"
article_type: "technical-analysis"
edition: "research-center"
research_question: "When an agent can plan several future steps at once, how can it avoid turning an untested route into several steps of execution commitment?"
summary: "TROVE treats a multi-step path as a provisional route, commits one top-level skill, then Retains, Inserts, Replaces, or prunes the remainder from boundary outcomes. The broader lesson is bounded: planning may look farther ahead than execution commits, while external Effect Authority still requires separate governance."
sources: "arXiv:2609.05019; research/reading/A-20260909-01-trove-route-validation-editing.md; research/analysis/A-20260909-01-trove-route-validation-editing.md"
cover: "/assets/covers/academic-trove-proposal-commitment-horizon.png"
---

<ArticleCover
  image="/assets/covers/academic-trove-proposal-commitment-horizon.png"
  kicker="Digital Employee · Academic Observation 007"
  title="A Plan Is Not a Commitment"
  summary="An agent can plan several steps ahead. Why should execution still commit one observable boundary at a time?"
  version="DE007"
  status="Academic Runtime V5 · 2026-09-09"
  languageHref="/zh/digital-employee/2026-09-09-trove-proposal-horizon-commitment-horizon"
  languageLabel="中文"
/>

# A Plan Is Not a Commitment: What TROVE Changes About Agent Orchestration

Agents naturally plan ahead.

A route such as “draft, review, revise if needed, then format” can look perfectly sensible before execution begins. But the world changes as soon as the first step runs. The draft may already satisfy the task, making later verification redundant. Review may expose missing evidence, so formatting should no longer be next. A tool can return an unexpected artifact that makes the queued continuation inappropriate even though no call technically failed.

The important question is therefore not whether an agent can plan. It is **how much execution commitment a plan should receive before the outcomes that justify its later steps are observable**.

The paper **TROVE: Adaptive Agent Skill Orchestration via Trace-Grounded Route Validation and Editing**, submitted to arXiv on September 4, 2026, names the underlying problem **continuation invalidation**. New runtime evidence can make a previously reasonable suffix stale. TROVE's response is neither to replay a fixed workflow nor to regenerate the whole future after every step. It preserves completed work and edits only the unresolved continuation that new evidence actually invalidates.

The paper makes an unusually useful distinction: **the proposal horizon may span several skills, while the commitment horizon remains one top-level skill.**

An agent can look farther ahead than it commits.

## The route stays provisional after planning

TROVE first extracts reusable structure from evaluated workflow-search traces. Primitive operators become atomic skills with standardized inputs, outputs, execution status, and repeat constraints. Stable local fragments can become composite skills when their internal ordering and dependencies remain coherent enough to execute behind one outer boundary.

But outcome-dependent decisions are deliberately left exposed. If an intermediate result might change a later top-level choice, TROVE does not hide that choice inside a composite.

The paper reports a frozen registry of **10 atomic skills and 41 composite skills**, plus **244 executable transition edges**. At test time the initial planner proposes no more than four top-level skills, while online execution is bounded to six top-level skill calls.

The crucial control rule is that the route is **provisional intent**, not an already approved sequence. TROVE executes only its head. Once that skill finishes, the controller observes status, artifacts, and other routing-relevant signals before deciding what the pending suffix still means.

That produces two different lengths inside one orchestration:

```text
Proposal Horizon   -> may contain several future skills
Commitment Horizon -> currently one top-level skill
```

The difference is operational, not rhetorical.

## Runtime evidence gets more than two choices

Once a boundary outcome is available, TROVE uses revisions at different scopes.

**Retain** keeps the queued successor when it is still executable under the latest outcome. No new LLM routing call is needed simply because a boundary was crossed.

**Insert** adds a trace-supported local response when an immediate repair, test, or verification can fix the mismatch without changing the downstream objective. After that inserted skill executes, the old successor is checked again rather than automatically resumed.

**Replace** is used when graph evidence is absent or ambiguous, or the new state requires a broader change. An LLM replanner regenerates only the **unexecuted suffix**, while the completed prefix and its artifacts remain intact.

If the task is already complete, the pending suffix is discarded.

This creates a useful engineering asymmetry: **new evidence should invalidate only the future it actually contradicts; it should not erase a past that has already been established.**

## What the evaluation supports

TROVE is evaluated on six public benchmarks: HumanEval and MBPP for code, DROP and HotpotQA for question answering, and MATH and GSM8K for mathematical reasoning. The paper uses DeepSeek-V4-Flash, GPT-4o-mini, and Qwen3-8B and compares with AFlow, MaAS, and LAS where their released implementations support the setting.

Workflow search, controller configuration, trace collection, composite-skill construction, and transition-memory construction use training partitions. The corresponding structures are frozen before held-out test evaluation. Reported online time includes planning, skill execution, route validation, and runtime replanning, but it **excludes** one-time offline workflow search, controller training, registry construction, and trace distillation.

Every numerical result below is source-reported; this Academic run did not independently reproduce the experiments.

Across **18 backbone–benchmark settings**, TROVE reports the best or tied-best task score in **15** and the shortest online time in **16**. Across the six DeepSeek-V4-Flash test partitions, it reports **13.45M online tokens versus 21.11M for AFlow**, a 36.3% aggregate reduction. That saving is not uniform: TROVE uses more tokens on DROP and HotpotQA, while other tasks drive the aggregate reduction.

The evidence therefore supports a quality/online-efficiency result within the tested settings, not a universal statement that adaptive routing always uses fewer tokens.

## A high route-edit rate does not necessarily mean repeated failure

The route-adaptation analysis is particularly instructive.

With DeepSeek-V4-Flash, the realized route differs from its initial proposal on **54.20%** of HumanEval samples, but only 5.87% on MBPP, 7.75% on DROP, and 2.88% on HotpotQA. MATH and GSM8K reach **98.97% and 100%** route changes.

Read mechanically, the math figures could look like near-constant correction. The paper explains a different mechanism: a composite answer often completes the task early, so the rest of the proposed route is simply pruned.

A route edit can therefore mean at least three different things:

1. **Correction** — an observed outcome invalidates the old continuation.
2. **Early completion** — success makes future steps unnecessary.
3. **Stability** — the original continuation remains valid, so no edit is needed.

A production observability layer should distinguish these cases. “Route edits per task” is not, by itself, a reliability metric.

## The ablation shows why skill boundaries matter

The paper's ablation uses Qwen3-8B on HumanEval.

Full TROVE reports 92.37% accuracy in 24.36 minutes. Removing all offline structure gives 77.86% and 33.62 minutes. Removing composite skills gives 78.63% and 33.30 minutes. Removing Insert gives 82.44% and 39.10 minutes. Removing Replace retains 90.84% accuracy but increases time to 40.15 minutes.

This one setting cannot establish a universal granularity rule. It does show why a composite skill is more than a packaging optimization. The boundary decides which internal decisions are hidden and which outcomes remain visible to the outer controller before the next commitment.

If boundaries are too fine, routing cost and decision variance can rise. If they are too coarse, an outcome that should change a later choice may arrive only after that choice has already been buried inside a larger unit.

A practical skill-design question follows: **which local decisions are stable enough to encapsulate, and which outcomes must remain visible before the next commitment?**

## A broader synthesis: Proposal / Boundary / Commitment / Effect

The following model is **Research Center synthesis**. It is inspired by TROVE's mechanism but is not an architecture proposed or validated by the paper's authors.

![Proposal Horizon, Boundary Evidence, Commitment Horizon, and a separate Effect Authority gate.](/assets/figures/academic-trove-proposal-commitment-boundary.svg)

### 1. Proposal Horizon

A model or planner may maintain a multi-step future route. That ability is useful: future structure helps coordination, resource reasoning, and coherent search.

But its identity should remain explicit. A proposal is a **candidate future**, not a collection of already-made execution decisions.

### 2. Boundary Evidence

After each committed top-level skill, the runtime should bind the latest outcome to the executed prefix: status, produced artifacts, goal-completion evidence, and repetition or no-progress signals.

A future step should not remain valid merely because it appeared in an earlier plan.

### 3. Commitment Horizon

Only the next unit re-admitted against current evidence becomes execution commitment.

The rule can be summarized simply:

> **Planning length may be long; execution commitment should be incremental.**

This preserves model intelligence without requiring the runtime to trust an entire route generated before its future premises were observable.

### 4. Effect Authority

A further boundary is required for something TROVE does not claim to solve.

A skill can be the logically correct next step in a route and still lack authority to send an email, modify a database, place an order, make a payment, or invoke another provider with an external side effect.

Before crossing into the external world, a governed runtime still needs something like:

```text
continuation_valid
AND call_authorized
AND duplicate_effect_prevented
=> external effect may execute
```

Route validation answers whether the next step remains appropriate for the task state. Authorization answers whether this specific call may occur. Idempotency and effect evidence answer whether the outside world has already observed the effect.

Treating these propositions as equivalent would turn a useful orchestration mechanism into a claim it does not support.

## Preserving the prefix is not crash recovery

TROVE's preservation of completed prefixes and artifacts is valuable because route revision does not automatically replay completed orchestration work.

For real side effects, however, that is not sufficient.

Suppose a top-level skill successfully submits an order to a provider but the success response is lost before the agent sees it. After a crash, “preserve the prefix” does not prove whether the order occurred, and “replace the suffix” does not prove that another call would be safe.

That is why this article keeps **Effect Authority / Effect Evidence** separate. TROVE provides evidence about continuation control. Exactly-once behavior, provider receipts, and ambiguous-effect recovery require additional mechanisms.

## The evidence boundary matters

The current paper covers six benchmarks, three backbones, and specific baseline implementations. LAS is comparable only in six code settings. Its online-time metric explicitly omits offline search and distillation costs.

This run did not locate an author-released TROVE implementation repository or an independent full reproduction of the headline results. All quantitative claims in this article therefore remain **source-reported**.

That does not make the orchestration problem less important. It helps keep two levels distinct:

- **Directly supported by the paper:** provisional routes, one-step commitment, Retain / Insert / Replace, preservation of completed prefixes, and the reported quality/online-efficiency behavior in the authors' evaluation.
- **Synthesized here:** a governed digital-employee runtime should separate Proposal, Boundary Evidence, Commitment, and Effect Authority, with external-effect gates remaining outside route validity.

The first is a research result. The second is an engineering judgment.

## One rule worth carrying into production

The article's practical rule is not “agents should replan often.” It is:

**Do not let a future plan inherit future execution authority all at once.**

A runtime can preserve the full proposal while placing only the next top-level unit into current commitment. After each unit, new evidence decides what remains of the future. Established past work stays preserved; a stale suffix is revised; a completed goal stops the route.

For cheap, reversible internal computation, the commitment boundary may be wider. For expensive, irreversible, or externally effectful actions, it should be stricter.

TROVE is therefore interesting for more than a new workflow algorithm. It makes a long-running-agent distinction unusually concrete: **a plan is a statement about a possible future; a commitment is a decision about what may execute now. They should not be the same data type.**

## What remains open

Production systems still need answers to harder questions. How should composite-skill boundaries be selected? Which route-validity checks can be deterministic contracts rather than LLM decisions? How should a recovered prefix reconcile with provider effect receipts after a crash? How fresh must evidence be before a long-retained suffix may execute? And how should offline workflow-search and trace-distillation cost be counted against online savings in long-running work?

Those require new runtime experiments rather than extrapolation from the current six benchmarks.

## Sources and evidence boundary

1. Tianxing Wang, Mingming Zhao, Shuai Huang, Huiyang Xu, Chaoyue Niu, Shengzhong Liu, Fan Wu, **TROVE: Adaptive Agent Skill Orchestration via Trace-Grounded Route Validation and Editing**, arXiv:2609.05019v1, 2026-09-04 — https://arxiv.org/abs/2609.05019
2. Full paper HTML — https://arxiv.org/html/2609.05019
3. Governed Deep Reading — `research/reading/A-20260909-01-trove-route-validation-editing.md`
4. Governed Research Analysis — `research/analysis/A-20260909-01-trove-route-validation-editing.md`

**Evidence boundary:** the paper is the primary evidence for this Academic object. Experimental numbers are treated as source-reported and were not independently reproduced in this run. The Proposal / Boundary Evidence / Commitment / Effect model is explicitly Research Center synthesis; route validity is not presented as equivalent to authorization, exactly-once effects, or rollback safety.
