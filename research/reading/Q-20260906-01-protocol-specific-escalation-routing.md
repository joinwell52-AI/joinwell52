# Q-20260906-01 — Multi-Agent Escalation Needs Protocol-Specific Value and Cost Routing

- Runtime date: 2026-09-06 (Asia/Shanghai)
- Queue signal: SIG-20260906-006
- Primary research source: https://arxiv.org/abs/2608.14927
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When a digital employee appears likely to fail on its current path, is one failure-risk score sufficient to decide whether and how to escalate into multi-agent collaboration, or must failure admission, collaboration topology and cost budget be governed separately?

## Problem

A common escalation design is binary: estimate whether the current agent is likely to fail and, above a threshold, “add more agents.” The selected research directly tests why that collapses several different decisions. It holds the underlying solver fixed and runs the same tasks under multiple collaboration protocols, so it can distinguish three questions that a single confidence score tends to merge:

1. Is the baseline answer likely to be wrong?
2. If collaboration is warranted, which protocol is likely to improve this particular task?
3. Is the expected improvement worth the additional token cost?

The paper's central evidence is that the first question is substantially easier to predict than the second. A strong failure detector is therefore useful for admission, but it is not a reliable protocol selector.

## Experimental Design

The main controlled setting uses 4,181 competition-level mathematics problems from OmniMath and compares four protocols while keeping the solver fixed:

- **Baseline** — direct single-agent solving.
- **Single** — single-agent self-correction/refinement.
- **PER** — a planner–executor–reviewer collaboration structure.
- **Broadcast** — broader multi-agent deliberation.

The study records matched solve outcomes and token use across protocols. Its principal routing experiments split the OmniMath set into train/validation/test partitions and evaluate held-out routing. The retrospective oracle is not a deployable policy; it is an upper-bound reference that knows which protocol succeeded after all outcomes have been observed.

The breadth checks repeat the protocol comparison across additional mathematics/science benchmarks and a second solver family. This supports the claim that protocol value is task-dependent, but the authors do not present it as a universal law across arbitrary digital work.

## Failure-Risk Prediction Is Stronger Than Protocol-Value Prediction

The post-answer probe receives the problem, metadata and the baseline answer, but not the hidden gold answer, internal reasoning trace or realized outcomes of the alternative protocols. On 4,151 parseable OmniMath examples, baseline failure prediction reaches **0.8847 AUROC** with **0.895 AUPRC**.

That is useful for deciding whether the baseline deserves additional scrutiny. But protocol-specific value prediction is much weaker. The reported AUPRC is **0.1674 for PER-first value** and **0.1041 for Broadcast-only value**. Predicting that “some collaboration may help” is easier than predicting which expensive collaboration structure will pay off.

The distinction matters operationally. A router can correctly infer that the current solution is risky while still escalating into a protocol that adds cost without adding enough value, or selecting a cheaper protocol when the harder case needed a more capable topology.

## Solve–Cost Trade-off

The paper explicitly tracks token cost rather than reporting solve rate alone. In the main held-out comparison, more aggressive routers generally raise solve rate but also increase token consumption and over-escalation. Conservative routers save cost but under-escalate cases that would benefit from collaboration.

The protocol ordering itself is also economically meaningful: Baseline is cheapest, then Single, then PER, then Broadcast. The appendix gives approximate per-example token scales of roughly 18K, 48K, 402K and 622K respectively for the four protocol families in the measured setting. These are study-specific values, not product pricing, but they show why “collaborate whenever uncertain” is not a free decision.

A pre-answer same-model confidence gate provides a useful intermediate result. It can improve over unconditional baseline execution at much lower cost than always using the most expensive protocol, but it still cannot determine whether PER, Broadcast or no additional collaboration is the best choice for a given task.

## Protocol Profiles Are Task-Dependent

Broadcast is the strongest fixed protocol in most—but not all—reported benchmark/solver settings. In at least one breadth setting, PER exceeds Broadcast. The matched outcomes also contain cases where a protocol succeeds only after Baseline and Single fail, and cases where the expensive protocol does not dominate cheaper alternatives pointwise.

This is important because it rejects a simple hierarchy in which “more agents” is always better. Protocols are different coordination structures, not merely increasing quantities of the same resource. Their value depends on the task, the solver and the failure mode.

The reduced Gemma-3 actor subset reinforces the caution: the alternative actor changes both solve profile and router behavior, and a router can achieve acceptable solve rates while substantially over-escalating. This is a scope check, not a full cross-model replication.

## Routing Failure Modes

### Risk-to-topology collapse

A failure detector identifies likely baseline failure but is treated as if it also identifies the best collaboration topology. The study shows those are different prediction problems.

### Solve-only optimization

A router maximizes solve rate without explicit budget accounting and therefore selects high-cost collaboration in cases where the incremental gain is small or absent.

### Cost-only conservatism

A router minimizes token use and leaves solvable hard cases under-escalated.

### Static “more agents is better” policy

A fixed expensive protocol is assumed to dominate because it has more participants or communication. Matched outcomes show task-dependent reversals and no pointwise dominance.

### Retrospective-oracle leakage

A system treats the study's oracle as if it were a deployable predictor. The oracle observes realized protocol outcomes and is only an upper-bound reference.

## Governance Mechanism Suggested by the Evidence

A bounded digital-employee routing design should separate at least three state transitions:

1. **Failure-risk admission** — decide whether the current execution is sufficiently risky to justify considering escalation.
2. **Protocol-specific routing** — estimate the value of candidate collaboration structures for this task rather than equating risk with one predetermined topology.
3. **Budget admission** — compare expected benefit with an explicit token/cost budget and define a deterministic fallback when evidence is insufficient.

This is an inference from the controlled study, not a protocol specified by the authors. The evidence supports separating the decisions; it does not determine the exact thresholds or cost function for an enterprise digital-employee runtime.

## Evidence Strength

The selected source is a primary controlled study with matched task-level protocol runs, explicit token accounting, held-out routing evaluation, breadth checks and a reproducibility archive containing anonymized protocol traces and outcome labels. That makes it strong evidence for the distinction between failure-risk prediction and protocol-value routing within the studied benchmark family.

The paper also reports parsing and data-quality details rather than hiding them. Thirty post-answer probe records are excluded as unparseable. The pre-answer confidence parser initially succeeds on only 310/423 examples; manual recovery raises usable coverage to 329/423, while truncation and HTTP 429 errors account for much of the missingness. Missing predictions are therefore not assumed to be random.

## Limits and Unknowns

- The main study is mathematics with one primary solver and targeted breadth checks. It does not prove that the same AUROC, AUPRC or token thresholds transfer to software engineering, operations, research or enterprise workflows.
- Each problem/protocol condition is one deterministic realization in the main matched dataset, so the study does not measure full stochastic variance from repeated generations.
- Token count is not a complete operational cost model. Latency, dollars, energy, parallel resource contention and human-review cost are separate dimensions.
- The retrospective oracle is an aggregate upper bound and cannot be implemented without outcome leakage.
- The weaker protocol-value probes do not prove that protocol routing is impossible; they show that the tested signals and routers make it materially harder than baseline failure detection.
- The reduced alternative-actor experiment is a scope check rather than a full replication of every router configuration.
- The study establishes correlations and predictive performance, not a causal theory explaining why a particular collaboration topology succeeds on each task.
- Competition-level problem solving is much narrower than a long-running digital employee with persistent state, tool authority, irreversible effects and organizational responsibilities.

## Unresolved Questions

1. Which runtime evidence should be available to a production router without leaking gold outcomes or privileged evaluator state?
2. Can protocol value be predicted from structured failure modes—missing knowledge, verification uncertainty, planning depth, tool dependency—more reliably than from one scalar confidence score?
3. How should a digital-employee runtime price latency, parallelism, external tool calls and human review in addition to tokens?
4. Should expensive multi-agent collaboration require its own authorization receipt when it changes resource or organizational scope?
5. How should routing be recalibrated when models, tools, task distributions or collaboration protocols change?

## Reading Conclusion

The selected evidence supports a bounded conclusion: **failure-risk admission, collaboration-topology selection and cost admission are different decisions.** A post-answer probe can rank baseline failure well while remaining much weaker at predicting which specific multi-agent protocol will add value. More aggressive collaboration can increase solve rate while creating substantial token cost and over-escalation, and no protocol dominates every task. Analysis may therefore treat “add more agents” as an incomplete control policy and examine a three-stage routing boundary—risk admission, protocol-specific value, and budget—without generalizing the paper's benchmark-specific metrics into universal digital-employee thresholds.
