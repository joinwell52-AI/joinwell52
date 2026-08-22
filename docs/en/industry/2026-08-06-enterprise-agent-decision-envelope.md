---
title: "Enterprise Agent Control Planes Need Decision Envelopes, Not Configuration Precedence Alone"
date: '2026-08-06'
column: industry-architecture
category: daily
summary: "Managed settings can express organizational intent, but enterprise agent governance must bind policy provenance, principal, capability, model, sandbox, and resumed context to each consequential execution and collect enforcement receipts."
item_id: Q-20260806-02
source_research_object: "research/analysis/Q-20260806-02-enterprise-agent-control-plane.md"
source_reading_result: "research/reading/Q-20260806-02-enterprise-agent-control-plane.md"
lifecycle: Published
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
outline: deep
cover: "/assets/covers/daily-2026-08-06-enterprise-agent-decision-envelope-cover-v2.jpg"
---

<ArticleCover
  image="/assets/covers/daily-2026-08-06-enterprise-agent-decision-envelope-cover-v2.jpg"
  kicker="Industry Architecture · Daily Research"
  title="Enterprise Agent Control Planes Need Decision Envelopes, Not Configuration Precedence Alone"
  summary="Managed settings can express organizational intent, but enterprise agent governance must bind policy provenance, principal, capability, model, sandbox, and resumed context to each consequential execution and collect enforcement receipts."
  version="Q-20260806-02"
  status="Daily Runtime V5 · 2026-08-06"
  languageHref="/zh/industry/2026-08-06-enterprise-agent-decision-envelope"
  languageLabel="中文"
/>
# Enterprise Agent Control Planes Need Decision Envelopes, Not Configuration Precedence Alone

Enterprise coding-agent governance is distributed across managed settings, tool permissions, operating-system sandboxing, model selection, and session resume. Configuration can declare whose policy has priority, but it cannot by itself prove that every execution path applied the same policy.

## Central judgment

**An enterprise agent control plane should issue a versioned decision envelope for each consequential execution and require an enforcement receipt from the execution point.** The envelope should bind policy provenance, principal, requested capability, actual model, sandbox mode, and resumed context.

## Source

This candidate consumes only the Research Object authorized for Production. Its evidence boundary is the completed same-day Reading Result. Production did not reproduce a security bypass and does not upgrade vendor fix notes into independently validated results.

## Observation

The Research Object places organization policy distribution, permission prompts, OS sandboxing, model fallback, and session resume inside one architecture problem. It also preserves a contradiction: official documentation gives managed settings the highest precedence, while release notes describe execution paths that had bypassed a managed disable policy or workflow sandbox boundary. Configuration authority and enforcement-path conformance are therefore separate concerns.

## Comparison

| Control surface | Intended policy | Required execution evidence | What the current evidence does not establish |
|---|---|---|---|
| Managed settings | Organization policy and precedence | Effective policy version and provenance | Every path enforced the same policy |
| Tool permissions | Whether a class of tools is allowed | Request, decision, actor, and reason | Complete coverage of child processes and bypass paths |
| OS sandbox | System boundary for Bash and child processes | Actual sandbox mode and failure behavior | Cross-platform equivalence and universal fail-closed behavior |
| Model fallback | Substitution of execution identity | Requested model, actual model, reason, and property changes | Authorization and semantic equivalence of the fallback |
| Session resume | Continuation of prior work | Working directory, policy, model, sandbox, and outstanding-effect manifest | Full semantic equivalence to the original context |

Each row distinguishes documented intent, the evidence a runtime should emit, and unknowns. Vendor statements are not treated as independent validation.

## Discussion

Highest-precedence configuration is necessary, but it is not a complete control plane. Agents, skills, workflows, commands, child processes, and resume paths can become separate enforcement points. The control plane must prove that each point applied the same effective policy or fail closed when it cannot.

Model fallback should not be reduced to a warning. A changed model can alter cost, residency, capability, and safety properties, so substitution belongs inside the authorization decision. Session resume likewise restores more than conversation text: it restores working directory, policy version, actual model, sandbox state, and unresolved effects.

## Engineering impact

For enterprise Digital Employees, Position and WorkOrder should resolve into an effective policy snapshot before consequential work begins. Each Operation Node should receive a decision envelope and return a receipt naming the actual execution identity and policy version. Model substitution, sandbox unavailability, and resumed-context drift should enter configured allow, deny, or escalation paths.

For CodeFlowMu, policy resolution should be a projection separate from FCoP lifecycle state. Requested and actual model, sandbox mode, permission decision, and policy provenance should be durable operation evidence. Resume should compare a stored context manifest with the restored runtime and block or escalate material drift.

## Boundaries and counter-evidence

The evidence consists of official release notes and documentation, not an independent advisory, exploit reproduction, platform regression matrix, or measured incident reduction. Current documentation may also differ from the implementation state at release time. This candidate presents an architectural judgment, not an independently proven security result.

## Future work

Further work should determine which decisions must remain centralized, which may be cached with verifiable provenance, which model-property changes require re-authorization, how every execution path proves policy-version conformance, and which resume differences must block continued work.

## Visualization note

The visual centers the decision envelope and links policy, principal and capability, model, sandbox, and resumed context to enforcement receipts. It is a Research Center architecture synthesis based on the Research Object.

## Evidence and references

1. [Research Object](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260806-02-enterprise-agent-control-plane.md): the sole analytical input, explicitly separating documented policy, enforcement conformance, and independent-validation gaps.
2. [Reading Result](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260806-02-enterprise-agent-control-plane.md): the evidence boundary and source-traceability record declared by the Research Object; this candidate does not re-research it.
