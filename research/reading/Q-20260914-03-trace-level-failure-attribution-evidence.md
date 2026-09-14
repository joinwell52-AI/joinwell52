# Q-20260914-03 — Final Success Cannot Replace Trace-Level Failure Attribution

- Runtime date: 2026-09-14 (Asia/Shanghai)
- Queue signal: SIG-20260914-006
- Primary research source: https://arxiv.org/abs/2609.09875
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

What structured execution evidence does an independent evaluator need to distinguish trustworthy execution from unsafe success, and how far can trace-level stage attribution establish why an Agent failed?

## Primary Mechanism

AgentAudit evaluates recorded Agent execution traces after the run rather than intervening in the live control loop. The framework scores ten lifecycle dimensions: instruction integrity, planning, memory, tool selection, tool invocation, tool correctness, alignment, tool faithfulness, security and execution integrity. It then combines behavioral classification with stage-level failure attribution so the evaluation can point to the part of the lifecycle associated with the observed failure instead of reducing the run to completed/not-completed.

This changes the evidence unit. Final task success is only one outcome fact. The audit object is the trajectory: what the Agent planned, remembered, selected, invoked, observed and did, and whether those stages remained aligned with the task and safety constraints.

## Evaluation Evidence

The study evaluates five models across nine capability and adversarial tasks. It reports large differences in composite trust even when task-completion behavior can look similar. In particular, some non-frontier models are repeatedly classified as `Unsafe_Compliance` on adversarial tasks rather than merely failing to complete them. That demonstrates the practical value of keeping behavioral safety and final completion as separate identities.

The reported mean Composite Trust Scores span a wide range across the five evaluated models, reinforcing that final outcome alone is not enough to characterize execution quality. The more important architectural result is qualitative: the trace allows an evaluator to say whether the failure is associated with planning, memory, tool choice, invocation, correctness, alignment, faithfulness, security or execution integrity.

The paper also gives an important limitation: all traces are scored by a single fixed judge model, and that judge is itself one of the evaluated models. The resulting measurements therefore carry correlated evaluator assumptions. Stage attribution is richer than end-state scoring, but it is not independent ground truth merely because it is more granular.

## Attribution Versus Causality

Trace-level attribution should not be enlarged into a causal proof. An evaluator may correctly locate the first visible policy violation or execution anomaly while still missing an upstream cause that was not represented in the trace. Likewise, a planning error may be downstream of stale memory, and an unsafe tool call may reflect an authorization fact that was never made visible to the judge.

A production audit architecture therefore needs at least three distinct claims:

1. **Observed event fact** — what the durable trace shows happened.
2. **Evaluation judgment** — how an evaluator classifies that event or stage.
3. **Causal or responsibility claim** — why the failure happened and which component or actor is accountable.

AgentAudit directly strengthens the first two. The third often requires additional evidence or independent review.

## Failure Case

Two Agents can both finish a task. One follows the intended plan and tool policy; the other reaches the same artifact by complying with an unsafe instruction or invoking a tool outside the intended control boundary. A completion-only benchmark gives both the same apparent outcome. A lifecycle trace can distinguish them, but only if the relevant planning, memory, authorization and tool events were actually captured and the evaluator can interpret them reliably.

This is why **unsafe success and trustworthy success must not share one terminal label**.

## Evidence Classes

### Fact

AgentAudit evaluates recorded traces across ten lifecycle dimensions, performs behavioral classification plus stage attribution, and reports experiments across five models and nine capability/adversarial tasks.

### Research Result

The reported experiments show substantial differences in trust classification across models and demonstrate that similar completion behavior can conceal unsafe-compliance behavior that becomes visible at trace level.

### Inference

An auditable Agent runtime should expose a versioned trace schema with stable identities for plans, memory reads/writes, tool selection, invocation, results, authorization evidence and execution effects so an independent evaluator can attribute failures without reconstructing the run from prose.

### Unknown

The accessible evidence does not establish robust inter-rater agreement, production false-positive/false-negative rates, causal correctness of every stage attribution, or the best way to calibrate a judge across changing models and domains.

## Limits and Negative Evidence

- A single fixed judge creates evaluator-bias and calibration risk.
- Retrospective audit cannot evaluate facts that were never captured in the trace.
- Attribution identifies an associated stage, not necessarily the root cause or responsible organizational actor.
- A high trust score is not current execution authorization and should not directly drive a lifecycle transition.
- Benchmark tasks and adversarial prompts do not cover every long-running production failure mode.
- An evaluator can inherit misleading framing if the trace presents model-generated explanations without independent factual anchors.

## Unresolved Questions

1. Which trace fields must be deterministic facts versus model-generated interpretations?
2. How should multiple independent judges be calibrated and reconciled when they disagree about a stage failure?
3. What known-positive and known-negative cases are needed to measure audit false positives and false negatives?
4. How should authorization evidence and external-effect receipts be bound to the same trace without letting the evaluator rewrite those facts?
5. When should a stage attribution trigger human review rather than automated remediation?
6. How can a runtime preserve enough evidence for audit without turning every tool call into an unmanageable event stream?

## Reading Conclusion

The source-complete evidence supports a bounded conclusion: **trustworthy Agent evaluation needs trace-level observability and stage attribution in addition to final task success**. A completed task can still be unsafe, unfaithful or procedurally invalid. Trace attribution makes those distinctions inspectable, but it remains an evaluation judgment rather than automatic proof of causality, authorization or production safety.

This Reading Note performs evidence extraction only. It does not execute Research Analysis, article writing, visualization, Production or Publication.
