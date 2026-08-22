---
title: "History Is Not a Transfer Contract"
date: '2026-08-20'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "Should cross-agent history be replayed as stored, or reconstructed as a policy-governed projection of mixed-trust local state?"
summary: "A locally valid session event is not automatically authorized for another agent. A same-day Google ADK fix shows why cross-agent context should be projected before rendering removes the semantic structure needed to identify sensitive control material."
sources:
  - research/analysis/Q-20260820-02-policy-enforcing-history-projection.md
item_id: "Q-20260820-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-20-history-is-not-transfer-contract-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-20-history-is-not-transfer-contract-cover-v2.png"
  kicker="Industry Architecture · Daily Research"
  title="History Is Not a Transfer Contract"
  summary="A locally valid session event is not automatically authorized for another agent. A same-day Google ADK fix shows why cross-agent context should be projected before rendering removes the semantic structure needed to identify sensitive control material."
  version="Q-20260820-02"
  status="Daily Runtime V5 · 2026-08-20"
  languageHref="/zh/industry/2026-08-20-history-is-not-transfer-contract"
  languageLabel="中文"
/>

# History Is Not a Transfer Contract

A session event can be legitimate evidence in one place and unauthorized disclosure in another. A local runtime may need to retain a credential-bearing control call for recovery or audit, while a remote agent has no authority to receive that payload. Replaying “the conversation so far” treats those two decisions as if they were the same.

A Google ADK change merged on 2026-08-20 exposes the problem in a concrete A2A path. `RemoteA2aAgent` reconstructs outbound messages from local session history. The fix removes credential-bearing request function calls from that outbound representation before other-agent rendering can flatten their structured arguments into ordinary text. The original local event remains intact, and non-secret siblings are preserved.

The mechanism supports a broader architectural rule: **cross-agent history should be a destination-specific policy projection of mixed-trust local state, not a transparent replay. The projection must occur while security-relevant structure still exists.**

## Retention authority and disclosure authority are different

A conventional conversation log suggests one canonical sequence that can be replayed wherever context is needed. Multi-agent systems break that assumption. Session state can contain user-visible text, tool calls, tool results, authentication control data, diagnostic evidence and internal orchestration events. These parts do not necessarily share one disclosure scope.

Deleting every sensitive event from local storage protects outbound sharing only by sacrificing recovery and audit evidence. Forwarding the complete event preserves fidelity but assumes that the destination belongs to the same trust domain. Neither choice expresses the actual requirement: keep the evidence locally while deriving only the context authorized for a particular peer.

The ADK fix implements this separation with a deep-copied outbound representation. Filtering changes the transferable view without mutating the original session event. It can remove a credential-bearing function-call part while retaining ordinary text siblings and permitted control material.

## Representation order is a security boundary

The timing of the scrub is not an implementation detail. Structured function calls still carry semantic identity: a known request-call name, nested `AuthConfig` shape and distinct sibling parts. Rendering for another agent may inline those arguments into text. Once that transformation occurs, the runtime has weaker evidence about which characters came from a credential field and which are ordinary conversation.

Pre-render filtering can therefore make a policy decision against typed structure. Post-render redaction must rediscover meaning from flattened text and is more likely to miss a secret or erase benign context.

The current detector combines known credential-call names with modeled nested shapes. Tests show that it preserves an ordinary top-level `auth_scheme` call, text siblings and the mock-auth prompt. This is better than deleting an entire event whenever one part looks suspicious. It is also deliberately bounded: name-and-shape inference is not a universal sensitivity system.

## A destination projection creates two useful views

The local view answers what the runtime must retain for audit, recovery and explanation. The outbound view answers what this destination is authorized to receive. Those views may be generated from the same event, but they need different schemas or at least different policy lenses.

An explicit projection stage also gives the handoff pipeline a governable location. It can run before serialization or natural-language rendering, record which policy decided the exclusion and produce an audit fact that material was intentionally withheld—without copying the secret into that audit record.

Longer term, sensitive control events should carry durable semantic and disclosure identity. That would reduce dependence on a central list of function names and payload shapes. Yet labels do not solve the problem automatically: every producer must assign them correctly, and every rendering, tracing and persistence transformation must preserve them.

## Scrubbing one path is not A2A confidentiality

The evidence covers one merged `RemoteA2aAgent` reconstruction path and its tests. It does not establish that every outbound adapter, retry path or future protocol transformation uses the same filter. It also does not authenticate the remote peer, encrypt the remaining message or protect secrets stored locally.

Selective projection is therefore a disclosure control, not a complete confidentiality system. Transport trust, peer authorization, local retention policy and diagnostic export remain separate boundaries.

The unresolved engineering question is how to make the projection mandatory and provable. Can every session-event part carry a disclosure label that survives rendering and persistence? How does a runtime demonstrate that all outbound adapters pass through the same projection point? What audit evidence proves intentional withholding without reproducing the withheld material? Treating history as a transfer contract hides these questions. Treating it as policy-governed source material makes them enforceable.

**Primary evidence:** [Google ADK Python merged commit 2aea8595](https://github.com/google/adk-python/commit/2aea8595fb1c5e0fddef7893a1985dc96dc82692). The public implementation and tests establish the bounded reconstruction behavior; they do not independently establish general A2A confidentiality.
