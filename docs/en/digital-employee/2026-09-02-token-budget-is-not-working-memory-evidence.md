---
title: "Token Budget Is Not Working-Memory Evidence"
date: '2026-09-02'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "长期运行的数字员工应如何证明其工作记忆有效，而不是只证明没有超过令牌预算？"
summary: "A primary study of 55 coding-agent trajectories separates stored state, delivered context, management work, and task/process outcome. The split shows why equal budgets need not deliver equal information and why final success cannot substitute for evidence about the memory path."
sources:
  - research/analysis/Q-20260902-01-working-memory-four-layer-evaluation.md
item_id: "Q-20260902-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-02-token-budget-is-not-working-memory-evidence-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-02-token-budget-is-not-working-memory-evidence-cover.png"
  kicker="Digital Employee · Daily Research"
  title="Token Budget Is Not Working-Memory Evidence"
  summary="A primary study of 55 coding-agent trajectories separates stored state, delivered context, management work, and task/process outcome. The split shows why equal budgets need not deliver equal information and why final success cannot substitute for evidence about the memory path."
  version="Q-20260902-01"
  status="Daily Runtime V5 · 2026-09-02"
  languageHref="/zh/digital-employee/2026-09-02-token-budget-is-not-working-memory-evidence"
  languageLabel="中文"
/>

# Token Budget Is Not Working-Memory Evidence

Two digital employees stay within the same context limit. One receives the constraint that matters before execution. The other retains a large amount of related history but misses that constraint, repeatedly compressing and retrieving along the way. If the dashboard reports only “within budget” and “task completed,” the runs may appear equally healthy.

The budget is useful, but it answers a capacity question. It does not reveal what was stored, what actually reached a particular execution, what management work was required, or whether apparent success concealed stale or missing memory.

A primary study of 55 archived coding-agent trajectories separates working-memory evaluation into four layers: stored state, delivered context, management work, and task/process outcome. The paper reports semantic differences among memory objects, unequal delivery and management cost under nominally equal budgets, and calibration improvements that do not always transfer to held-out tasks.

That supports a bounded governance judgment: **long-running digital employees need layered, occurrence-bound memory evidence; capacity and final outcome cannot stand in for the four layers.**

## Equal Budgets Can Deliver Different Information

A context window or token limit describes how much the system can carry. It does not identify what a given execution actually received. A constraint may exist in storage while retrieval, selection, or compression fails to deliver it when needed.

This makes “the memory existed” and “the execution could use it” different claims. The first needs stored-state evidence. The second needs a delivery record bound to the occurrence. A total token count cannot explain whether a defect came from failed persistence, retrieval, lossy compression, or selection that excluded the right object.

Management cost is another independent surface. Two runs may deliver comparable material while spending very different amounts of time and tokens retrieving, summarizing, and rewriting it. Hiding that work behind the final prompt length creates an efficiency claim with an incomplete denominator.

## Four Layers Support Four Different Claims

Stored state records what persisted at a point in time. Delivered context records what an occurrence could actually see. Management work records the resources spent retrieving, selecting, compressing, and rewriting. Task and process outcome record whether the work completed and whether its constraints were met.

The purpose of the split is not to manufacture more metrics. It is to prevent evidentiary substitution. “Present in storage” does not establish “visible at execution.” A short prompt does not establish low management cost. Task completion does not establish that the memory path was correct.

An auditable system therefore needs at least the memory-object identity and type, the policy version that transformed it, the retained representation, the representation delivered at execution, the management cost, and the associated process outcome. Privacy or scale may require summaries or hashes, but the system should state which layer was compressed, what information was lost, and which claims remain supportable.

## A New Policy Cannot Inherit an Old Qualification

The paper's negative transfer result is important. It does not show that one policy fails universally. It does rule out a common shortcut: allowing a new policy to inherit qualification merely because it descends from an earlier one.

Adaptive memory changes retention, compression, or retrieval rules. It can therefore change both delivered information and management cost. Each emitted policy needs a new identity, with validation evidence bound to that version and the distribution actually evaluated. Material changes in task type, tool set, information sensitivity, or run length should not silently borrow authority from prior calibration.

This is more consequential than an ordinary configuration update. Memory policy controls the premises available to future reasoning and the context that recovery must reconstruct.

## Final Success Cannot Replace Process Evidence

A task can succeed despite missing a critical object, or succeed only after large hidden management work. A failure may also have a cause unrelated to memory. Outcome-only evaluation collapses these distinct paths.

A more reliable evaluation asks separately whether storage matched its claim, whether execution received the necessary context, whether management cost stayed within bounds, and whether process and outcome met task requirements. When governance needs all four propositions, all four evidence surfaces must be present.

This accounting improves recovery as well. After an interruption, the system needs more than a task position. It needs the memory-policy version, what had already been delivered, and whether the recovered occurrence still lies within the same evidentiary boundary.

## The Evidence Boundary Remains Narrow

The empirical corpus concerns coding-agent trajectories, not arbitrary enterprise digital employees. It does not establish identity security, call authorization, durable persistence, effect idempotency, or safety for irreversible actions. Nor does it identify one memory strategy that dominates across workloads.

Its defensible conclusion is more specific: working-memory evaluation cannot be reduced to nominal capacity or final success, and policy qualification should be rebuilt against the new version, actual delivery behavior, and applicable distribution.

The open problems are operational: how to prove delivery without retaining sensitive full context, how to sample evidence across thousands of occurrences, which distribution changes require revalidation, and how memory-policy rollback should remain separate from recovery of external task effects.

**Primary source:** [Measure Before You Manage: Evaluating Agent Working Memory in Coding Agents](https://arxiv.org/abs/2608.31057)
