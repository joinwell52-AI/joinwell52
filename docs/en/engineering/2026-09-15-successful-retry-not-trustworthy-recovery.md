---
title: "A Successful Retry Does Not Prove Trustworthy Recovery"
date: '2026-09-15'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "智能体工作流在首次失败后恢复时，必须分别保存哪些事实，才能证明恢复有效、正确且安全，而不只是后来一次尝试成功？"
summary: "A structured benchmark shows that reliable failure signals plus one bounded correction can recover many initial failures, while richer feedback adds little in that setting. A later success still cannot prove semantic correctness, safe external effects, or continuing authority; recovery needs phase-specific evidence."
sources:
  - research/analysis/Q-20260915-02-phase-separated-recovery-evidence.md
item_id: "Q-20260915-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-15-successful-retry-not-trustworthy-recovery-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-15-successful-retry-not-trustworthy-recovery-cover.png"
  kicker="Open-source Engineering · Daily Research"
  title="A Successful Retry Does Not Prove Trustworthy Recovery"
  summary="A structured benchmark shows that reliable failure signals plus one bounded correction can recover many initial failures, while richer feedback adds little in that setting. A later success still cannot prove semantic correctness, safe external effects, or continuing authority; recovery needs phase-specific evidence."
  version="Q-20260915-02"
  status="Daily Runtime V5 · 2026-09-15"
  languageHref="/zh/engineering/2026-09-15-successful-retry-not-trustworthy-recovery"
  languageLabel="中文"
/>

# A Successful Retry Does Not Prove Trustworthy Recovery

An agent calls an external tool and times out. The second call returns successfully, so the runtime marks the task recovered. But did the first call already change the external system? Is the second result semantically correct? Does the original business authorization still hold at retry time? One success flag cannot answer those questions.

Recovery is not merely another attempt after failure. It is a path whose detection, routing, correction, budget, acceptance, and external-effect reconciliation need separate evidence. A terminal label may summarize those facts; it must not replace them.

## What the Benchmark Actually Measures

The same-date Research Object examines LAST-CQ, a benchmark for recovering text-to-Cypher work. It covers 2,471 queries executed against live Neo4j databases across six model backbones.

The pipeline deterministically parses the schema before initial generation. Validation uses an explain step and bounded execution. When the environment detects a failure, the system parses the error, can optionally synthesize richer grounded feedback, and gives a correction stage one bounded retry before execution.

That decomposition makes component comparisons possible. The paper reports a 91.7% unweighted mean recovery rate across the six backbones for initial failures entering correction and a 93.8% pooled recovery rate. This is strong but bounded evidence: in a structured executable setting with explicit failure signals, one environment-grounded correction can rescue many failed first attempts.

## Richer Reflection Added Little Here

The most useful ablation asks which component produced the gain. Replacing synthesized grounded feedback with raw database errors changes aggregate exact match by only about one percentage point.

In this benchmark, much of the value appears to come from three simpler events: the target environment establishes that the first attempt failed, the workflow routes into correction, and the system permits another evidence-grounded attempt. A longer explanatory narrative is not the dominant contributor.

That does not show that reflection is useless. Text-to-query work has explicit schemas and executable errors. Browser, negotiation, and planning failures are often latent or semantic. The useful engineering order is to measure a raw-error-plus-bounded-retry baseline first, then require richer diagnosis to demonstrate incremental benefit.

## More Attempts Are Not the Same Mechanism

The study also compares the iterative path with an equal-budget parallel three-sample strategy. The additional candidates are not connected by target-environment failure evidence, and the reported result is worse than the execution-grounded recovery path.

The relevant distinction is not only sequential versus parallel. It is information structure. Correction knows where and how the previous attempt failed; independent sampling merely increases candidate count. Similar call budgets do not create equivalent recovery mechanisms.

A recovery budget should therefore preserve the attempt number, maximum count, sequential or parallel strategy, time and cost limits, and the reason to continue. Without those facts, operators can see that three calls were used but cannot tell whether the budget purchased new evidence or more guesses.

## Six Recovery Identities Must Stay Separate

An auditable recovery record needs six phases:

- **failure detection** — which operation failed, which environment or verifier detected it, and the raw evidence;
- **recovery routing** — whether policy selected retry, repair, compensation, escalation, abandonment, or human review;
- **correction input** — which facts came from the environment, which were model interpretation, and the provenance of additions;
- **retry budget** — the attempt index, maximum, strategy, and cost or time boundary;
- **acceptance evidence** — execution, semantic, policy, and safety checks, their evaluators, and residual uncertainty;
- **effect reconciliation** — whether the earlier attempt's external effect is absent, present, compensated, or unknown.

A recovered status is only a summary of these facts. A later success cannot retroactively establish that initial detection was correct or erase an earlier effect that may already have happened.

## Executable Is Not Correct

The study itself supplies important negative evidence: a non-empty result is not semantic correctness. It combines execution outcomes with exact match, text similarity, and model-judge assessment, and reports that the model judge is optimistic relative to human calibration.

Recovery is also highly heterogeneous by failure class. Schema violations recover much more often than syntax and type failures. One backbone can have a high failure-recovery percentage while slightly regressing on another aggregate quality metric. A single percentage hides those differences.

Acceptance must therefore match risk. Executability can be one useful signal for a query, but a result that informs a consequential decision needs semantic checks, permission boundaries, and recorded uncertainty. A tool returning content proves that a call ended; it does not prove that the result deserves adoption.

## Effect Reconciliation Comes Before Replay

A database-query benchmark does not prove that arbitrary external actions are safe to retry. A production agent may have sent a message, created an order, or changed a record before the timeout reached the runtime. Treating timeout as proof of no effect can duplicate the action.

For state-changing tools, effect reconciliation should precede replay. Stable operation identities, idempotency keys, external receipts, and compensation mechanisms can narrow an unknown outcome into an inspectable state. When the effect remains unknown, escalation or stopping is safer than blind repetition.

Business authority must also be re-read rather than inherited. The target, recipient, amount, approval, or policy may change during a failure. A recovery route addresses technical failure; the action boundary still requires current authority.

## Recovery Policy Follows Failure Class

Low-risk, read-only operations with observable failure and strong acceptance can admit one inexpensive bounded retry. Deterministic faults such as a missing schema element or invalid parameter may require correction before repetition. Semantically ambiguous outputs need stronger acceptance. Unknown side effects should route first to reconciliation, compensation, or human decision.

This is more involved than a universal “retry three times” rule, but it preserves the conditions that actually determine safety: whether failure is observable, correction is grounded, acceptance is strong, prior effects occurred, and authority remains current.

## Boundaries and Open Questions

The evidence is text-to-Cypher over Neo4j. Explicit schemas and executable feedback make errors more observable than in general tools. Some variants are counterfactual rescoring of existing traces, and the model judge is not ground truth. The study does not establish universal transfer across database engines, browsers, or side-effecting interfaces, nor does it systematically measure production latency and token cost.

Open questions remain. Which failure classes are deterministic enough for automatic retry? How should a runtime catch executable but semantically wrong recovery? When does richer diagnosis justify its cost? What evidence is sufficient when prior effects are unknown? How should retry budgets vary with cost and risk?

The bounded conclusion is: **reliable detection, explicit routing, and one environment-grounded correction may capture much of the recoverable value in a structured domain. Trustworthy recovery must still prove acceptance, external effects, and current authority separately. A second success is one fact in the recovery path, not proof of the whole path.**

**Evidence and source:**

- [LAST-CQ paper and execution-grounded recovery experiments](https://arxiv.org/abs/2609.12746), 2026.
