---
title: "Why an Audit Agent Cannot Sign for the Team: From Anywhere Agents to Observational Fact Checking"
date: '2026-08-26'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "How can an audit agent leave traceable observations without taking formal review and acceptance authority?"
summary: "Starting with the design error of automatic rejection from an observation, this article separates observation writes, lifecycle writes, and formal sign-off using Anywhere Agents and a bounded first-party EVAL route."
sources: "Public primary sources and the bounded scope of access-controlled first-party evidence are listed in the article."
project_relevance: case-evidence
item_id: "EBR-20260826-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-26-observer-audit-without-adjudication-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-26-observer-audit-without-adjudication-cover.png"
  kicker="Digital Employee · Engineering Research"
  title="Why an Audit Agent Cannot Sign for the Team: From Anywhere Agents to Observational Fact Checking"
  summary="An observational audit may retain deep evidence, but it cannot alter lifecycle state or make a formal acceptance decision."
  version="EBR-20260826-02"
  status="Engineering Research · 2026-08-26"
  languageHref="/zh/digital-employee/2026-08-26-observer-audit-without-adjudication"
  languageLabel="中文"
/>

# Why an Audit Agent Cannot Sign for the Team: From Anywhere Agents to Observational Fact Checking

Across 34 Anywhere Agents session transcripts, a style guard repeatedly advised on two different kinds of text: prose an agent was authoring, and prompts or review output it was merely carrying. The commit author reports 2,227 advisories. If those advisories could directly mark a task rejected, an observer with no delivery context would be signing for the team.

The project’s answer is not to remove auditing but to keep it beside control: carried text receives an Agent I/O scope, while the advisory audit does not enter reviewer prompts, round history, or the final verdict and does not block the review loop. Starting from that real audit-noise scene, this article proposes an inspectable separation: **the audit agent writes an observation; a review role reads it and signs; controlled lifecycle actions alone change task state.** Teams can use the resulting three-power check on their own risk scanners, evaluators, and fact-checking agents.

## Three powers must not share one pen

| Power | What it should do | What it must not do |
| --- | --- | --- |
| Observation write | preserve findings, provenance, rule version, and evidence references | mark a task done, rejected, or closed |
| Lifecycle write | move claim, execution, and review through controlled actions | decide whether content is acceptable |
| Formal sign-off | accept, return, or adjudicate against task requirements and evidence | pretend to have performed the underlying work |

The point is not that auditing is read-only. A useful observer often writes an artifact so a later review can inspect risk and evidence. The boundary is that it writes a **citable observation**, not a surrogate for `approved`, `rejected`, or `done`.

## A public implementation that keeps observation beside control

[A public Anywhere Agents commit](https://github.com/yzhao062/anywhere-agents/commit/53bd8fa43c7339ae9958c03c55434fac7baddaf3) addresses a related problem: a style guard had conflated content an agent authored with prompts and other agents’ review output that it merely carried. The change marks carried text with an Agent I/O scope and keeps the style audit advisory: findings do not enter reviewer prompts, round history, or final verdicts, and they do not block the review loop.

The point here is not the commit’s local counts. It is the structural choice: **observational information can reduce noise and provide evidence without turning itself into a control command.** The author’s session sample, advisory count, and filtering results are preserved in the source note as source-reported measurements, not independently replicated evidence.

| Source-reported audit data | Value | What it does not establish |
| --- | ---: | --- |
| Session transcripts | 34 | universal agent behaviour |
| Advisories | 2,227 | audit accuracy |
| Historical → relevant findings | 359 → 2 | the same noise reduction in another project |

![Historical and relevant findings in one advisory-audit filter](/assets/covers/2026-08-26-advisory-audit-filtering.svg)

*Figure 1. One source-reported Anywhere Agents change. The calculated 359→2 reduction is 99.4%, but it describes that filter, not system-wide audit accuracy. Source: Anywhere Agents commit `53bd8fa43c73`, accessed 2026-08-26.*

## Input markers cannot become a universal pass

The output side must not adjudicate without authority; the input side must not trust labels without verification. A path marker such as `agent-io` may explain whether text is authored or carried. It cannot by itself authorize a real write. For its deny gate, Anywhere Agents resolves symlinks and trusts the marker only under a temporary root containing no repository. Otherwise an agent could create a look-alike directory inside the repository and masquerade as carried text to bypass a rule.

That completes the boundary at both ends: provenance labels help explanation and audit; controlled authority governs real writes; an observer sends findings to the signer rather than changing the conclusion itself.

## EVAL observes; REVIEW signs

The inspected CodeFlowMu private route makes this one-way relationship explicit:

```text
EVAL writes observations and evidence bundles
        ↓ as input
REVIEW applies task requirements and signs acceptance, return, or adjudication
        ↓
controlled lifecycle actions record formal state
```

The EVAL route separates observations from programmatic evidence bundles. A bundle is not an acceptance conclusion, not an administrative approval, and does not mutate the task lifecycle; an observation requires an EVAL ID and session/run provenance. Targeted tests exclude intervention reports containing adjudicatory verbs such as approve, reject, rework, hold, or close from EVAL scoring; a review gate yields an attention observation, not a close decision.

This supports a limited conclusion: on the route inspected, EVAL preserves facts while REVIEW holds sign-off authority. It does not prove that no UI, plug-in, or future extension creates a bypass, or that an auditing model is always correct.

## Our view: observation should become deeper while authority becomes narrower

Anywhere Agents distinguishes carried text from authored material and keeps its audit beside, rather than inside, the main loop. That is worth carrying forward. Our view is that provenance can be refined into authored, carried, observed, and generated, travelling with tool calls and agent handoffs so risk has an explainable origin; those labels must not independently authorize a write. CodeFlowMu’s EVAL route supplies bounded implementation evidence for the other half: observation and evidence bundles can be deep, while `drives_lifecycle: false` remains a hard boundary and only REVIEW plus controlled lifecycle actions can complete formal acceptance.

## A three-second check

When an audit agent reports high risk, ask:

1. Did it write an observation artifact, or did it directly mutate task state?
2. Does the observation carry provenance, rule version, and evidence references that formal review can revisit?
3. Who can accept or return the delivery, and can that role see the original observation and record why it was adopted or not adopted?

Total isolation hides risk. Automatic sign-off disguises uncertain analysis as a definite decision. The workable boundary is visible, traceable, discussable observation—and accountable authority for the signature.

That leaves a useful question for the original author: should authored, carried, observed, and generated become explicit provenance types that travel with tool calls and agent handoffs, rather than remaining only a filesystem-boundary marker? Whatever the answer, such labels should aid audit explanation—not independently authorize a write.

### Sources

- [Anywhere Agents commit `53bd8fa`: Agent I/O scope and advisory style audit](https://github.com/yzhao062/anywhere-agents/commit/53bd8fa43c7339ae9958c03c55434fac7baddaf3), accessed 2026-08-26. The author reports 34 session transcripts, 2,227 advisories, and a reduction from 359 historical findings to two relevant ones; not independently replicated here.
- CodeFlowMu private EVAL implementation and targeted tests; access-controlled first-party evidence, not an independent audit.
