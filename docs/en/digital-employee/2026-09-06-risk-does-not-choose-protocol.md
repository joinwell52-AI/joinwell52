---
title: "Escalation Risk Does Not Choose the Protocol"
date: '2026-09-06'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "当数字员工看起来可能失败时，受治理的运行系统在从“当前路径有风险”转向“现在按此成本使用这个协作协议”之前，必须分别知道什么？"
summary: "A controlled study shows that detecting likely baseline failure is much easier than predicting which collaboration protocol adds value. Governed escalation should separate failure risk, protocol value, and budget admission."
sources:
  - research/analysis/Q-20260906-01-escalation-admission-protocol-value-budget.md
item_id: "Q-20260906-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-06-risk-does-not-choose-protocol-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-06-risk-does-not-choose-protocol-cover.png"
  kicker="Digital Employee · Daily Research"
  title="Escalation Risk Does Not Choose the Protocol"
  summary="A controlled study shows that detecting likely baseline failure is much easier than predicting which collaboration protocol adds value. Governed escalation should separate failure risk, protocol value, and budget admission."
  version="Q-20260906-01"
  status="Daily Runtime V5 · 2026-09-06"
  languageHref="/zh/digital-employee/2026-09-06-risk-does-not-choose-protocol"
  languageLabel="中文"
/>

# Escalation Risk Does Not Choose the Protocol

A digital employee concludes that its current answer is likely wrong and immediately broadcasts the task to more agents. The risk assessment may be correct while the escalation is still poorly governed: the expensive collaboration pattern may add less value than a cheaper alternative, and nobody may have authorized the extra cost.

The core proposition is: **failure-risk admission, protocol-specific value, and budget admission are separate evidence decisions. Detecting likely failure does not select a collaboration topology, and selecting a topology does not authorize its cost.**

## One Score Is Asked to Do Three Incompatible Jobs

A common router translates confidence below a threshold into “use more agents.” That move silently combines three questions:

1. Does the current execution deserve escalation consideration?
2. Which available collaboration protocol is likely to add value for this task?
3. Is that expected increment worth the token, latency, compute, tool, or human-review budget?

The decisions may share features, but they must not silently share authority. Risk evidence can open a selection process. Value evidence must bind a task, model, and named candidate protocol. Budget evidence answers whether the organization will pay for that expected increment.

## Controlled Evidence Exposes the Gap Between Risk and Protocol Choice

The primary study captured by the same-date Research Object compares a baseline, a single-agent enhancement, planner–executor–reviewer collaboration, and broadcast collaboration over 4,181 competition-level mathematics problems. On 4,151 parseable examples, a post-answer probe discriminates baseline failure with reported AUROC 0.8847 and AUPRC 0.895.

Predicting whether a particular protocol adds value is much harder. The study reports AUPRC 0.1674 for PER-first value and 0.1041 for Broadcast-only value. Matched outcomes also show that the more expensive topology does not dominate every task, while token use differs materially across protocols.

These figures describe the study setting, not enterprise thresholds. The post-answer probe also uses information that exists only after an initial answer, so it cannot prove equivalent pre-execution performance. The supported conclusion is narrower: strong evidence that an answer is risky does not substitute for protocol-specific value evidence.

## Three Evidence Receipts Make One Escalation

A governed transition can preserve three independent records:

| Decision | Minimum evidence | Authorized next step | What it does not prove |
|---|---|---|---|
| Failure-risk admission | Current path, risk model, calibration scope, freshness | Enter escalation consideration | A named protocol will help |
| Protocol-value routing | Task, model, candidates, expected increment | Rank or select a candidate | The cost is authorized |
| Budget admission | Expected cost, limits, value threshold, approving owner | Execute a bounded choice | The protocol is generally optimal |

When protocol-value evidence is weak, a runtime should not translate high failure probability into the most expensive default. It can preserve an explicit “high risk, uncertain protocol” state and apply a governed fallback: a cheap critique, human review, problem decomposition, or a stop.

The decomposition also improves incident diagnosis. Failure to escalate can be a risk-estimation error. Escalating to the wrong topology is a value-ranking error. Selecting a useful topology that exceeds limits is a budget-governance error. Those failure classes require different repairs.

## One Model May Decide Jointly; The Evidence Still Has Layers

A practical system may use one learned policy to optimize quality and cost jointly. That is a reasonable implementation choice. It does not erase the semantic distinctions.

Even if one model emits the decision, the durable record should explain which observations supported risk, what increment was expected from each candidate, and which cost function, cap, and approving principal admitted execution. Without those facts, a policy change cannot be diagnosed as better calibration, better protocol ranking, or merely a looser budget.

A fixed expensive protocol may also be rational in a safety-critical or extremely high-value domain. The study does not rule out that policy. It requires the organization to record “always broadcast” as an explicit resource decision, not as a technical conclusion implied by uncertainty alone.

## From a Binary Feature to an Auditable Execution Policy

A team can begin with four changes:

- Store whether to consider escalation separately from where to escalate.
- Bind protocol recommendations to the task distribution, model version, tool set, and candidate topology.
- Define separate budgets for tokens, latency, parallel tool use, and human review.
- Provide a deterministic fallback for uncertain protocol value and record why it stopped.

Evaluation should likewise distinguish under-escalation, over-escalation, wrong-protocol selection, and budget overrun. “Multi-agent” then becomes an explainable execution-policy choice instead of an overloaded capability switch.

## Evidence Boundary and Open Questions

The evidence comes from competition mathematics, one main solver family, and limited breadth checks. It does not prove transfer to software engineering, operations, or enterprise work. Study token counts are not product prices, and matched outcomes are not a complete stochastic characterization of repeated generation.

Open questions include which production-time features predict protocol value without outcome leakage; whether structured failure classes outperform scalar confidence; how to price latency, parallelism, external tools, and human review; whether a materially broader collaboration scope needs a new authorization receipt; and when calibration should expire after changes to the model, task distribution, or protocol family.

Until those questions are answered, the strongest default is not “more risk means more agents.” It is to require separate evidence for why escalation should be considered, why this protocol was selected, and why this cost is authorized now.

**Evidence and source:**

- [Cost-aware multi-agent routing primary study](https://arxiv.org/abs/2608.14927)
