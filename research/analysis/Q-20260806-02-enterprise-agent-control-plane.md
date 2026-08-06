---
schema: "research-analysis/v1"
id: "AN-20260806-02"
date: "2026-08-06"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260806-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260806-02-enterprise-agent-control-plane.md"
output_contract: "Research Object"
research_object: "Enterprise Agent Control-Plane Decision Envelope"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Enterprise Agent Control-Plane Decision Envelope

## Governed scope

This object consumes only the completed Reading Result for `Q-20260806-02`. It performs Skill 04 Research Analysis and produces a Production-ready Research Object. It does not introduce unread material, independently validate vendor security claims, draft publication copy, or authorize release.

## Analysis

```yaml
analysis:
  observations:
    - The Reading Result groups organization policy distribution, tool permissions, operating-system sandboxing, marketplace controls, model fallback disclosure and session resume into one enterprise coding-agent control surface.
    - Official documentation gives managed settings highest precedence, yet the release reports execution paths that previously bypassed a managed bypass-disable policy and a workflow sandbox boundary.
    - Permission prompts and sandboxing operate at different layers: permissions govern tools broadly, while the OS sandbox contains Bash and child processes.
    - Restricted subagent-model fallback is made visible, but the source does not establish authorization or equivalence for the substituted parent model.
    - Resume fixes show that continuity depends on restoring working directory, background-agent and policy-relevant context, not merely conversation text.
  cross_comparison:
    - Policy configuration expresses intended authority; enforcement-path conformance determines whether that authority is real.
    - A fallback warning is an observability event, not a policy decision receipt and not proof that the fallback model is acceptable.
    - Session resume is analogous to semantic rollout migration in the same-day engineering Reading Result: both require restoration of operational meaning rather than byte or text continuity alone.
    - The revisable-DAG Reading Result governs what work becomes ready; this control-plane object governs whether an otherwise ready execution path is permitted and under which policy version.
  discussion:
    - The structural lesson is that an enterprise agent control plane is distributed across configuration authority, local enforcement points, process containment, model selection and restored session state.
    - The contradictions in the Reading Result show why highest-precedence configuration cannot be treated as proof of universal enforcement: every workflow, agent, skill, command, child process and resume path must pass through equivalent checks.
    - Model fallback changes the execution identity and may alter cost, residency, capability and safety properties; therefore it belongs inside the authorization decision, not only in operator telemetry.
    - A resumed session should carry a verifiable context manifest containing policy version, working directory, model identity, sandbox state and outstanding effects.
    - For SMEs, the reusable architecture is a compact decision envelope and enforcement receipt rather than a large centralized policy platform.
  research_judgment:
    - Enterprise agent governance requires a versioned decision envelope that binds policy provenance, principal, requested capability, model identity, sandbox mode and resume context to each consequential execution.
    - Managed-setting precedence is necessary but insufficient; each enforcement point must emit evidence that the same effective policy was applied or explicitly fail closed.
    - Model fallback must be an authorizable transition with recorded reason and changed properties, not merely a warning after substitution.
    - Session recovery is valid only when the restored execution context is semantically equivalent or differences are surfaced for re-authorization.
  uncertainty:
    - Confidence is high that policy authority and enforcement completeness are distinct architectural concerns.
    - Confidence is medium that one decision-envelope pattern can span marketplace, tools, sandbox, model and resume paths without excessive coupling.
    - Confidence is low about the real exploitability, affected-version range and production incident reduction because the fixes are vendor claims without independent validation in the Reading Result.
  counter_evidence:
    - The source package contains no independent security advisory, exploit reproduction or platform-by-platform regression matrix.
    - Current documentation may not exactly represent the implementation state at release time.
    - A fallback warning does not prove that fallback was authorized or operationally equivalent.
    - The release provides no quantitative reliability, latency, incident or operational-cost measurements.
  engineering_impact:
    tmpa:
      - No TMPA Core change is justified.
      - Candidate profile semantics are policy version, principal, requested capability, enforcement point, decision, fallback transition, sandbox availability and resume-context digest.
    digital_employee:
      - Position and WorkOrder should resolve into an effective policy snapshot before consequential operations begin.
      - Each Operation Node should receive a decision envelope and return an enforcement receipt naming the policy version and actual execution identity.
      - Model substitution, unavailable sandbox and resumed-context drift should be explicit transitions requiring configured allow, deny or escalation behavior.
      - Human-facing permission prompts should complement, not replace, lower-level containment and organization policy.
    codeflowmu:
      - Add a policy-resolution projection separated from FCoP lifecycle state.
      - Persist requested versus actual model, sandbox mode, permission decision and policy provenance in operation evidence.
      - On resume, compare a stored context manifest with the restored runtime and block or escalate material drift.
      - Test every role, skill, subagent, workflow, command and resume path against the same policy invariants.
  limitations:
    - The analysis relies on official release notes and documentation and does not independently reproduce any bypass.
    - No unified transaction or audit implementation spanning all control surfaces is described by the Reading Result.
    - Platform-specific sandbox behavior and fail-open or fail-closed outcomes remain incomplete.
    - The operational cost of decision envelopes and receipts has not been measured.
  future_questions:
    - Which policy decisions must be centralized and which may be cached locally with verifiable provenance?
    - What property changes make a model fallback require explicit re-authorization?
    - How should a runtime prove that every execution path used the same effective policy version?
    - What resume-context differences are harmless, and which must block continued work?
```

## Research judgment

The Production-relevant object is:

> Enterprise agent governance is a chain of versioned decisions and enforcement receipts across policy, permissions, sandbox, model identity and restored context; configuration precedence alone is not a sufficient control plane.

This judgment is an inference from the completed Reading Result and preserves the vendor-claim and independent-validation limitations.

## Production input

Production may consume this Research Object to explain the architecture of enterprise agent governance. It must preserve the distinction between documented policy and proven enforcement, and it must not present the named fixes as independently verified security results.

## Evidence boundary

- `research/reading/Q-20260806-02-enterprise-agent-control-plane.md`

No other source was consumed by this Analysis object.
