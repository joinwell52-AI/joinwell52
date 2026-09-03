# Q-20260903-02 — Delegation Needs Principal-Chain and Composition Authorization

- Runtime date: 2026-09-03 (Asia/Shanghai)
- Queue signal: SIG-20260903-010
- Primary source: https://arxiv.org/abs/2608.15888
- Implementation and data: linked by the paper from its arXiv record
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

How can an enterprise multi-agent runtime make delegated authority transitive but non-expansive while rejecting a sequence of individually permitted actions that composes into a prohibited outcome?

## Problem and Threat Model

*Bounded Agents: Delegation Security for Multi-Agent AI Systems* argues that prompt injection becomes consequential only through available authority. Static session permissions and isolated per-call checks miss three agent-specific failures: an action can violate delegated intent while remaining in scope, a sub-agent can receive or exercise non-attenuated authority, and multiple allowed actions can compose into exfiltration or another prohibited effect.

The Agentic Principal Chain (APC) models a human, orchestrator, sub-agents and tool endpoint as distinct principals in one session. The threat model allows indirect prompt injection, full compromise of one principal, scope probing and influence throughout the session. It treats model output, retrieved content, tool output, sub-agent messages and natural-language instructions as untrusted data. Its trusted computing base includes identity, policy decision/enforcement, signed policy, approval service and an append-only evidence store; compromise of that base and cross-session operation are outside the formal guarantee.

## Authorization Mechanism

An authorization scope contains permitted resources, actions and data classifications plus prohibited action compositions. Delegation computes the intersection of permissions while accumulating restrictions. A six-field budget limits depth, blast radius, irreversible effects, sensitivity, cross-domain composition and compute cost; ceilings can only decrease, and consumed budget is inherited as a floor.

The session-level state also preserves prior action types and their order. Pairwise composition restrictions prevent two action classes from co-occurring; ordered `k`-tuples catch staged paths where no individual pair is prohibited. A pre-declared intent specification may further restrict resources and actions but cannot widen scope. The gateway evaluates every call using six conjunctive conditions: identity binding; scope, composition and budget; task/policy/parameter context binding; exact single-use approval binding for high-impact actions; evidence-sink availability; and intent binding.

Enforcement sits outside the model at a tool or MCP gateway. Missing or unverifiable authority fails closed. Evidence is committed before action admission; if the sink is unavailable the action is denied. Backend authorization remains necessary—APC is an additional session-scoped layer, not a replacement for OAuth, RBAC, ABAC or service-side policy.

## Formal Results and Assumptions

Blast Radius Monotonicity follows only when scope narrows, budget consumption is cumulative and infrastructure assigns consistent blast scores. The reachable blast radius cannot increase at a deeper delegation hop, but the theorem permits it to remain flat unless configured attenuation makes it strictly decrease.

Composition Soundness is conditional. The prohibited-restriction set must cover at least one required pair or ordered tuple for every prohibited outcome, admission must be serialized across concurrent agents, and the effective restriction set must remain static during the session. The paper quantifies specification sensitivity: removing one required pair raises InjecAgent data-stealing attack success from 0% to 39.9%. The guarantee is therefore sound relative to a complete policy, not a proof that operators can enumerate every harmful composition.

## Evaluation Findings

The paper reports 3,154 evaluation instances: 99 delegation-chain cases at depths 2–8, 1,054 InjecAgent cases, 400 ASB cases, 949 live AgentDojo utility pairs, 609 compromised-model AgentDojo pairs and 43 adaptive variants. APC blocked all 544 InjecAgent data-stealing cases and reported 0% exfiltration under the compromised-model AgentDojo cohorts across four domains.

Intent binding reduced reported destruction from 38.6% to 4.0% and manipulation from 90.5% to 12.1%, but single-action harmful behavior within allowed scope remained outside APC's boundary and showed a 60.4% residual in the summarized attack taxonomy. Interactive approval reduced, but did not remove, utility loss: the pair-weighted aggregate was 8.6 percentage points below baseline across 949 AgentDojo task-injection pairs; strict mode was 13.9 points lower. Reported authorization latency was 0.24 ms at the 99th percentile on one idle Windows laptop using a single-threaded Python reference implementation.

The authors' compromised-model protocol inserts the benchmark's ground-truth attack call after the first legitimate call. This usefully isolates infrastructure enforcement from model robustness, but it is not the same as measuring every adaptive real-world agent strategy.

## Contradictions and Negative Evidence

The same evidence that supports APC also limits it. Domain deployment requires action classifiers, resource mappings, intent-parser terms and explicit pair/tuple authoring. Action-class granularity produces residual failures: if a send-to-attacker operation is mapped to a generic internal-sharing class, the correct restriction cannot fire. Session splitting can evade a per-session composition rule and is explicitly admitted in the adaptive-attack table.

The append-only hash chain makes interior tampering detectable, but tail truncation is not detectable without an independently anchored head or a genuinely append-only store. The paper also leaves parameter-level misuse, a trusted-gateway compromise, multi-principal compromise and the correctness of one allowed in-scope action outside its security boundary.

## Limits and Unknowns

- The work is a primary preprint by an independent researcher, not independent replication or deployment validation.
- Formal soundness is conditional on policy completeness and serialized admission.
- Utility results depend on benchmark-specific classifiers and simulated approval behavior.
- Latency was measured on an idle reference environment and does not establish distributed gateway throughput.
- OAuth/OBO identity and grants still need application-specific mapping into APC principals and scopes.
- Cross-session composition and organization-wide cumulative effects require a broader state boundary.

## Unresolved Questions

1. Who authors and continuously validates the action taxonomy and prohibited composition set?
2. How is serialized admission implemented without becoming a throughput bottleneck across concurrent sub-agents?
3. What authority may revise policy mid-session without invalidating the static-set soundness assumption?
4. How should session state compose across retries, recovery epochs and delegated work that survives one orchestrator process?
5. Which evidence anchor makes tail truncation and cross-session policy evasion detectable?

## Reading Conclusion

The paper provides a concrete, testable architecture for non-expansive delegation and sequence-aware authorization, with strong results inside its stated threat model. Its guarantees depend on complete restrictions, correct classification, serialized admission and a trusted external enforcement plane. Analysis may treat principal-chain narrowing and composition checks as valuable architecture mechanisms, but not as a complete proof of agent security or universal prompt-injection resistance.

