---
schema: publication-candidate-article/v2
title: "Delegation Is a Stateful Authorization Program"
date: '2026-09-03'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "当有害结果可能由委派链上多个单独获准的调用组合而成时，企业多智能体运行时应如何约束委派权限？"
summary: "Static permission sets describe maximum actions but cannot enforce scope attenuation, cumulative budgets, or multi-step compositions across delegation. A runtime should treat the session as a stateful authorization program and atomically evaluate principal-chain and action-history state before effects."
cover: staging/publication-candidates/2026-09-03-delegation-is-a-stateful-authorization-program-cover.png
sources:
  - research/analysis/Q-20260903-02-principal-chain-composition-closure.md
---

![Delegation Is a Stateful Authorization Program cover](staging/publication-candidates/2026-09-03-delegation-is-a-stateful-authorization-program-cover.png)

# Delegation Is a Stateful Authorization Program

One sub-agent is allowed to read a customer file. Another call is allowed to send a summary to an external address. Each call may satisfy a static role policy, yet their composition exfiltrates data. A runtime that asks only “is this action allowed?” cannot see what outcome the action history is completing.

Delegated authority therefore cannot be just a permission list attached to each agent. It must also record who delegated what task, which scope narrowed at every hop, how much budget has been consumed, which actions already occurred, and whether the next call completes a prohibited composition.

A primary paper proposes an Agentic Principal Chain for this purpose. It represents delegation as an infrastructure-held signed session envelope and evaluates the mechanism over 3,154 instances. The paper reports zero observed data-stealing success across 544 covered InjecAgent cases and zero exfiltration in relevant compromised-model cohorts. It also reports an 8.6 percentage-point pair-weighted utility reduction under interactive enforcement. Most revealingly, removing one required composition pair produced a 39.9% data-stealing rate.

The results support a bounded architectural judgment: **multi-agent delegation should execute as a stateful authorization program. Authority narrows monotonically across the principal chain, budgets and action history accumulate, and composition closure is checked atomically before effects.**

## Static Permissions Describe a Ceiling, Not the Task

Role- and attribute-based controls typically describe the maximum resources and actions available to a principal. A delegated task is usually narrower: read only this record set, produce a summary for this ticket, and do not transmit source material externally.

If a child inherits the parent's maximum permissions, it may remain formally in role while drifting from delegated intent. Multi-hop delegation compounds the gap. Every node can appear locally authorized while the chain collectively acquires more capability than the originating task required.

The runtime therefore needs the delegation chain as first-class evidence. Each hop should identify parent and child principals, narrowed resource and action scope, data boundary, budget, expiry, and restrictions that accumulate. A later hop may operate only inside the intersection and may narrow further, never expand it.

## The Session Envelope Holds Program State

The reported session envelope includes ordered principals, cumulative budgets, prior actions, predeclared intent, exact approval tokens, and evidence commitments. A gateway evaluates conjunctive conditions before forwarding a tool call; the constrained model does not get to interpret or rewrite the boundary itself.

This turns authority from a static set into state that evolves with execution. Once a call is admitted, budget and action history must update before the next decision sees the prefix. When concurrent agents spend from one budget, admission and update require serialization or equivalent atomic semantics. Otherwise, two calls can both pass against a stale balance.

Infrastructure-held state matters for the same reason. If the model can edit its own history, classifications, or restrictions, the policy sits inside the component it is intended to constrain.

## Composition Closure Constrains Accumulated Outcomes

Harm is not always a single action. Reading sensitive data and sending externally can each be legitimate; their occurrence in one session creates the risk. Composition closure maps calls to action classes and denies a new call when adding its class would complete a prohibited pair or ordered tuple.

This is not merely keyword filtering. Policy authors must define relationships among resources, action classes, and prohibited outcomes. Classifiers must map concrete tool calls correctly. The gateway must complete the check before the effect. A gap at any layer narrows the guarantee.

The reported exfiltration after removing one composition pair shows that policy coverage is part of the mechanism's qualification, not incidental configuration. Operators should continuously test coverage, classification drift, and mappings for new tools rather than merely confirm that the gateway process is running.

## Blocking Has a Utility Cost

Strict control rejects some legitimate work, requires more approvals, and can add latency. The reported utility reduction makes this cost part of the design, not a footnote. Maximum blocking should not be the sole objective.

A useful scorecard includes blocking of covered harmful compositions, uncovered single-action harm, legitimate completion, human approval burden, decision latency, classification errors, and policy-maintenance cost. Different domains may choose different thresholds, but the autonomy traded away should remain visible.

Backend authorization also remains necessary. A principal-chain mechanism can narrow delegation within a session, while each resource server must still enforce its own policy. Transport security, credential protection, and parameter-level constraints are separate obligations.

## Recovery and Cross-Session Composition Remain Open

A stateful authorization program must preserve consumed budget and prior-action history through recovery. If a worker can clear history by creating a “new session,” recovery becomes a route around composition policy. A recovery epoch should explicitly inherit relevant state or close the previous session through an auditable decision.

Cross-session composition is harder. Two separately compliant tickets may jointly create harm. Keeping all history globally is expensive and conflicts with minimization; inspecting only one session can miss long-range accumulation. Which effects need cross-session memory remains a policy boundary rather than a solved mechanism.

## Evidence Boundary

The evidence is a primary preprint without independent reproduction and uses authored policies. It does not establish complete classification, an uncompromised gateway, or coverage of every parameter misuse, principal compromise, or cross-session composition. Strong blocking in the paper applies to behavior that policy covers and classification recognizes.

Even within that boundary, the architectural principle is clear. Delegation is not permission copying. It is execution of an authorization program that keeps narrowing scope, accumulates state, and decides against history. The trusted boundary is not an agent's self-description; it is the verifiable, atomic admission decision before an effect.

**Primary source:** [Bounded Agents and the Agentic Principal Chain](https://arxiv.org/abs/2608.15888)
