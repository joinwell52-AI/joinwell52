---
title: "Detection Does Not Mean the Threat Is Contained"
date: '2026-09-17'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "当一个长期运行的多智能体环境已经识别并警告了对抗性事件时，还需要哪些持久证据，才能证明威胁已经被控制、清除并恢复，而不只是被发现？"
summary: "Persistent multi-agent experiments show that a system can recognize and warn about an adversarial event while harmful content continues to execute, persist, and propagate. Closure requires separate proof of detection, containment, eradication, and recovery."
sources:
  - research/analysis/Q-20260917-02-detection-is-not-containment.md
item_id: "Q-20260917-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-17-detection-not-threat-containment-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-17-detection-not-threat-containment-cover.png"
  kicker="Industry Architecture · Daily Research"
  title="Detection Does Not Mean the Threat Is Contained"
  summary="Persistent multi-agent experiments show that a system can recognize and warn about an adversarial event while harmful content continues to execute, persist, and propagate. Closure requires separate proof of detection, containment, eradication, and recovery."
  version="Q-20260917-02"
  status="Daily Runtime V5 · 2026-09-17"
  languageHref="/zh/industry/2026-09-17-detection-not-threat-containment"
  languageLabel="中文"
/>

# Detection Does Not Mean the Threat Is Contained

A security system detects a malicious link, warns every agent, and marks the incident handled. Yet agents continue to interact with it, hostile material enters long-term memory, and the old link reappears in retrieval two days later. The warning proves that the risk was seen. It does not prove that the risk stopped producing effects.

This distinction is easy to miss in a one-shot conversation. Long-running multi-agent environments preserve memory, share institutions, and hand work to later participants. An adversarial input can survive after the original message disappears through summaries, plans, caches, and external state. Detection must therefore remain separate from containment, eradication, and recovery.

## Risk Can Keep Growing After the Alert

The same-date Research Object examines Emergence World Study 2. The study constructs eight persistent multi-agent worlds with ten agents each, totaling more than 850,000 model calls and nearly 50 billion tokens. Agents operate across durable memory, shared institutions, and continuing events rather than isolated short sessions.

The longitudinal setting matters because it permits delayed effects. Hostile content can be received, stored, and retrieved by a different agent in a later task. A single-turn evaluation that inspects only the immediate response may treat an unobserved propagation path as absent.

These worlds remain experimental. They are not replicas of every enterprise deployment. But they directly demonstrate how persistent state changes the meaning of a security terminal state.

## Every World Warned, Yet Defense Remained Incomplete

The Research Object records that all seven exposed worlds issued warnings, while none achieved complete defense across the three stress events. The best phishing result met five of six criteria; the best misinformation result met three of six. Only one world satisfied all five memory-breach criteria.

The transferable point is not a vendor ranking. It is the separation between warning behavior and defensive outcome. A system can correctly recognize danger and produce a reasonable alert while still executing, storing, or propagating material along other paths.

Detection success should close only the detection phase. A single incident boolean allows strong recognition evidence to hide unfinished containment and eradication work.

## Execution, Persistence, and Propagation Are Different Paths

In one reported world, agents recognized and warned about a malicious link, yet all ten still interacted with it. The Research Object records 151 execution operations among 602 interface interactions, and the old link was retrieved again roughly 46 hours later.

Other worlds stored payloads in long-term memory or propagated hostile content inline from agent to agent. Security response must therefore track at least three paths:

- **Execution:** whether hostile instructions triggered tools or external actions.
- **Persistence:** whether a payload or derivative entered memory, caches, indexes, or plans.
- **Propagation:** whether content moved through messages, handoffs, shared documents, or institutions.

Blocking one path does not close the other two. Deleting the original message cannot reverse an external action or remove every derived state.

## Security Response Needs Four Separate Facts

A governable incident record should preserve four stages:

1. **Detection:** what was identified, with evidence and confidence boundary.
2. **Containment:** which entry points, actors, permissions, and propagation channels were isolated.
3. **Eradication:** which original and derived copies were located, removed, revoked, or compensated.
4. **Recovery:** which trusted baseline was restored and which critical invariants were revalidated.

Each can succeed, fail, or remain unknown independently. Detection may complete before containment. Containment may hold while one long-term memory copy remains. Eradication actions may run without proving that trusted behavior has returned.

The terminal rule should be conjunctive over mandatory facts. Strong evidence for one stage cannot numerically compensate for missing proof in another.

## A Trusted Role Does Not Clean Contaminated Provenance

Persistent contamination is dangerous because it crosses trust boundaries. A trusted agent may cite a summary derived from hostile memory. A later recipient sees the trusted sender and overlooks the adversarial origin.

The answer is not a higher trust label for the role. It is contamination lineage. Each payload, derivative summary, memory record, handoff message, and external effect should retain source, parent, transformation, time, scope, and disposition.

Lineage also supports targeted eradication. A system can traverse from known contaminated roots to derived items while preserving branches whose coverage cannot be proven as unknown.

## Recovery Is a Durable-State Closure Task

Recovery is not a process restart or a few normal-looking model outputs. It must rebuild permitted state from a trusted baseline and prove that old contamination cannot re-enter active paths.

A minimal recovery contract can:

- freeze incident scope and known contaminated roots;
- suspend high-risk authority and cross-actor propagation;
- enumerate and mark original and derived state;
- revoke credentials, compensate effects, and remove or quarantine copies;
- rebuild required state from a trusted snapshot;
- verify critical invariants and test old payload re-entry;
- require an independent acceptor to record unresolved items and residual constraints.

If a persistent medium cannot be enumerated, the system cannot claim global cleanliness. It may claim containment within a bounded scope, but the evidence boundary must remain explicit.

## Preserve Unknown When Global Cleanliness Cannot Be Proved

Real systems rarely prove every derived state at once. Index updates lag, caches replicate asynchronously, and external services may not expose complete audit histories.

Under that uncertainty, safer actions include reducing authority, quarantining an affected namespace, extending observation, or escalating to a person. Unknown is not rhetorical failure. It is a security fact that must remain durable.

Normal behavior after restart also does not prove that prior contamination is absent. Validation must target known attack paths, critical invariants, and external effects rather than a few superficially normal answers.

## Boundaries and Open Questions

The evidence comes from experimental worlds with designed stress events, evaluation criteria, and model combinations. It does not show that every real attack, vendor configuration, or enterprise institution will behave identically. The four-stage contract and contamination lineage are architectural interpretations of the findings.

Open questions include how provenance survives repeated summarization, what constitutes sufficient eradication when external state cannot be enumerated, who owns a unified incident identity across vendors, how to order revocation, memory deletion, and index rebuilding, and which independent authority should accept recovery sufficiency.

The bounded conclusion is: **detection proves that a system saw the risk. An incident should reach a terminal state only after propagation is contained, persistent contamination is eradicated, external effects are handled, and recovery from a trusted baseline is verified.**

**Evidence and source:**

- [Emergence World Study 2: Longitudinal Safety Evaluation in Persistent Multi-Agent Environments](https://arxiv.org/abs/2609.17320), 2026.
