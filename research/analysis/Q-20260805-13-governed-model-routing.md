---
schema: "research-analysis/v1"
id: "AN-20260805-13"
date: "2026-08-05"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260805-13"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260805-13-governed-model-routing.md"
output_contract: "Research Object"
research_object: "Governed Routing Decision Envelope"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Governed Routing Decision Envelope for Enterprise Agent Runtimes

## Governed scope

This object consumes only the completed Reading Result for `Q-20260805-13`. It performs architecture analysis of disclosed routing and governance surfaces. It does not introduce new vendor research, rank products, draft publication copy, or authorize deployment.

## Analysis

```yaml
analysis:
  observations:
    - Cursor Router classifies each request by task type and complexity, then selects within an optimization mode of Intelligence, Balance or Cost.
    - Administrators can control enablement, allowed modes, defaults, underlying model allow/block lists, Auto enforcement and whether the routed model is shown.
    - The classifier, confidence, thresholds, candidate-set construction, fallback order, outage behavior and immutable per-request audit record are not publicly specified.
    - Public cost and quality claims do not include a reproducible evaluation protocol, task mix, confidence interval or route-error rate.
    - Model retirement evidence in the Reading Result shows that durable references in defaults, managed configurations, custom Agents and schedules still require explicit migration.
  cross_comparison:
    - Router preference is an optimization decision; enterprise policy is an eligibility and authority boundary. Conflating them lets an optimizer silently redefine governance.
    - Allow/block lists constrain the candidate pool, but do not define what happens when the pool is empty, unavailable, retired or incompatible with the selected mode.
    - A hidden routed-model label reduces user-visible traceability even when administrative controls exist.
    - Compared with the other same-day Reading Results, routing governs pre-execution resource selection; completion verification governs post-execution claims; guardrail/session ordering governs durable representation. These are three distinct control points and should not be collapsed into one "smart runtime" decision.
  discussion:
    - The structurally important pattern is a policy-bounded optimizer, not automatic model selection by itself.
    - The likely causal path for cost savings is task classification plus access to a heterogeneous model pool, but the Reading Result does not establish how much comes from classification quality, model price dispersion, workload mix or policy relaxation.
    - Enterprise architecture therefore needs explicit precedence and failure semantics outside the opaque routing model.
    - A regulated or auditable runtime cannot treat “right model for the job” as a sufficient control objective because correctness, cost, residency, provider approval, retention, capability and retirement may conflict.
    - For SMEs, a smaller deterministic policy/routing table may be more reusable and auditable than a sophisticated opaque classifier; learned routing can be introduced only after route evidence and evaluation exist.
  research_judgment:
    - Task-aware routing should be modeled as an execution optimization subordinate to a versioned policy decision, never as the source of authority.
    - Every routed request should produce a durable Route Decision Envelope containing policy version, classified task class, eligible and excluded candidates, selected model/version, optimization objective, estimated cost/latency, fallback or exception reason and disclosure mode.
    - Policy precedence, empty-pool behavior, outage fallback and retirement migration must be explicit runtime contracts rather than undocumented router behavior.
    - The disclosed controls support the feasibility of governed routing, but the evidence is insufficient to validate routing quality or endorse a particular vendor algorithm.
  uncertainty:
    - Confidence is high that routing and policy must be separate planes.
    - Confidence is medium that per-request task classification can improve cost-quality allocation in a stable model pool.
    - Confidence is low regarding the magnitude and portability of published savings because the evaluation protocol is undisclosed.
  counter_evidence:
    - Public sources do not expose classifier inputs beyond task type and complexity, confidence or thresholds.
    - Cost and frontier-quality claims are not independently reproducible from the disclosed material.
    - Blocking a required price-efficient model may degrade or disable intended mode behavior.
    - Model retirement demonstrates that routing does not eliminate configuration migration obligations.
  engineering_impact:
    tmpa:
      - No TMPA Core change is justified.
      - Portable governance semantics may include policy source, decision authority, conflict preservation and auditable justification, while model-specific routing mechanics remain outside Core.
    digital_employee:
      - Position and WorkOrder policy should define allowed providers, models, data classes, budget, latency, capability and disclosure requirements.
      - A Digital Employee may request an optimization objective but must not expand its eligible model pool or override organizational policy.
      - Scheduled and long-lived employees need retirement-aware dependency inventory and migration review.
    codeflowmu:
      - Separate Policy Plane, Routing Plane, Execution Plane and Audit Projection.
      - Persist one Route Decision Envelope per model invocation, including fallback and exclusion reasons.
      - Define deterministic precedence among organization, team, position, WorkOrder and user constraints.
      - Fail closed or escalate when no eligible candidate exists; do not silently widen policy.
      - Build replayable routing evaluation from recorded decisions before introducing learned routing.
  limitations:
    - No router implementation, trace dataset or route-quality benchmark was available in the Reading Result.
    - No residency, privacy, provider-contract or regulated-industry test was performed.
    - No experiment measured behavior under outage, model retirement, empty candidate pool or conflicting policies.
    - The analysis does not compare vendor quality or recommend procurement.
  future_questions:
    - What is the minimal precedence lattice for organization, team, Position, WorkOrder, user and router preferences?
    - Which route facts must be immutable for audit and cost attribution?
    - How should the runtime detect quality regression after model or price changes?
    - What migration gate is required before a retired model reference is rewritten in scheduled work?
    - Can a deterministic rules router cover most SME workloads before a learned classifier is justified?
```

## Research judgment

The Production-relevant object is:

> Governed routing is a policy-bounded optimization service. Its output must be an auditable route decision, not an invisible override of organizational authority.

This is an architectural inference from the completed Reading Result. It does not validate the undisclosed router algorithm or published savings claims.

## Production input

Production may consume this Research Object to describe the four-plane architecture and the missing contracts around precedence, fallback, audit and retirement. It must preserve the uncertainty around classifier quality and cost claims and must not present vendor statements as independently proven outcomes.

## Evidence boundary

- `research/reading/Q-20260805-13-governed-model-routing.md`

No other source was consumed by this Analysis object.
