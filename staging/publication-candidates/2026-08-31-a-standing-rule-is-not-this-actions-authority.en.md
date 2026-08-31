---
schema: publication-candidate-article/v2
title: "A Standing Rule Is Not This Action’s Authority"
date: '2026-08-31'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "数字员工如何复用长期权限偏好，同时避免把偏好静默变成某次具体后果性行动的最终授权？"
summary: "A 113-participant study reports that reusable consequence policies reduce prompts while changing overreach blocking, and that 114 of 140 authored rules preserve a later Ask decision. A safer design treats standing decision routing and concrete action authority as separate governance objects."
cover: staging/publication-candidates/2026-08-31-a-standing-rule-is-not-this-actions-authority-cover.png
sources:
  - research/analysis/Q-20260831-01-standing-policy-separate-from-occurrence-authority.md
---

![A Standing Rule Is Not This Action’s Authority cover](staging/publication-candidates/2026-08-31-a-standing-rule-is-not-this-actions-authority-cover.png)

# A Standing Rule Is Not This Action’s Authority

A digital employee remembers a standing preference: a familiar class of low-risk operation can usually proceed automatically. Weeks later, a superficially similar action appears with a different target, amount, or data sensitivity. If the system sees only “permission exists,” it may silently turn an old preference into final authority for this occurrence.

That is the dangerous compression in standing permission systems. A rule can reduce interruptions and route future actions, but it does not inherently answer whether this action, against this target, under current conditions, has been authorized.

A 113-participant primary study compared per-action human-in-the-loop approval, automatic supervision, and user-authored consequence policies. Its most useful lesson is not that one interface wins. It is that **standing policy and occurrence authority should be separate governance objects.**

## Fewer Prompts Do Not Establish Equivalent Protection

Participants supervised the same scripted 18-action workday, including seven researcher-designated overreach actions. The paper reports raw overreach blocking of 59.6% for per-action approval, 53.9% for the automatic condition, and 39.6% for the policy condition. Required-action completion remained high in all three.

The policy interface reduced prompts, but the protection outcome also changed. The adjusted difference between per-action approval and policy was reported as 20.1 percentage points, with a 95% confidence interval spanning 8.1 to 32.1 percentage points in favor of per-action approval. That does not prove that every action needs fresh approval. It does rule out using fewer interruptions as a proxy for equal protection.

Interaction cost and overreach control are different metrics. A product may optimize the first, but it cannot substitute it for the second.

## The Most Common Authored Rule Was “Ask Me Then”

Participants authored 140 consequence-category rules. Of those, 114 selected Ask—81.4% of the rules. Among 245 overreach occurrences in the policy condition, 199 were routed to Ask; users then approved 133 and denied 66.

This distribution matters. Participants did not mainly use policy authoring to eliminate future approval. They encoded a reusable instruction to ask again when a matching occurrence appeared. The policy acted as a routing object, selecting Allow, Ask, or Never for future cases.

Ask is therefore not a configuration failure or temporary state waiting for automation to erase it. It is an explicit governance choice: reuse the preference, preserve the concrete commitment decision.

## Two Objects Answer Two Different Questions

A standing policy answers: “How should future actions in this class normally be routed?” An occurrence commitment answers: “Is this proposed effect authorized now?”

The first needs policy author, version, consequence class, scope, expiry, and revocation state. The second needs concrete action identity, target, material parameters, matched policy version, final decision, and decision evidence. Collapsing them into one permission bit destroys when the decision was made, what it covered, and whether it remains valid.

The study’s main supervision comparison used a fixed researcher-checked action-to-consequence mapping. That improves experimental clarity, but it also exposes a production concern: real classifiers are uncertain. When category matching has low confidence, preserving Ask is more truthful than allowing an ambiguous match to inherit stronger authority.

## Standing Allow Needs Its Own Authority Basis

Separating the objects does not imply universal per-action approval. A sufficiently narrow standing Allow may be appropriate for low-risk, bounded, repetitive effects. Its authority, however, comes from explicit scope and current validity—not merely from being durable preference state.

A governed Allow should identify the normalized effect class, permitted targets, amount or frequency bounds, data-sensitivity limits, expiry, and revocation semantics. If a user revokes the policy, prepared but unexecuted actions need an explicit rule. Patterns learned from repeated approvals may improve routing or propose a new policy; they should not silently escalate into permanent authority.

## Audit Must Reconstruct This Decision

When an action is disputed, the audit record should show more than a generic policy. It should reconstruct which policy version was used, which consequence class matched, what concrete action and target were proposed, who made the final decision, and whether that decision remained valid at execution time.

That separates “what the user usually prefers” from “what the user has authorized.” The first improves experience. The second bears responsibility for execution. They are related, but neither can impersonate the other.

## Evidence Boundary and Open Questions

The evidence comes from one scripted simulated-workday study with 113 online US participants. Its consequence taxonomy is coarse, and it supplies neither production incident rates nor independent replication. It supports a structural separation between standing policy and occurrence authority, not one universal approval threshold.

Open questions include which consequence classes qualify for bounded standing Allow, whether commitment should bind a tool call or a normalized effect digest, how revocation applies to queued actions, and how systems can learn preferences without silently enlarging authority.

The strongest conclusion is not “always ask.” It is: **let standing policy route; let occurrence commitment authorize. Whenever the decision remains open until runtime, persist and audit those two forms of evidence separately.**

**Primary evidence:** [Do User-Authored Permission Policies Improve Protection Against AI Agent Overreach?](https://arxiv.org/abs/2608.27443)
