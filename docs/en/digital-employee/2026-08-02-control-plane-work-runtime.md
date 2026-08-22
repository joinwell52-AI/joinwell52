---
title: Digital Employee Daily 002 — Control Plane and Work Runtime Are Different Systems
date: '2026-08-02'
column: digital-employee
category: daily
summary: Workday, ServiceNow, and Microsoft separate fleet governance from task execution, indicating that a Digital Employee platform needs both a control plane and a work runtime.
cover: "/assets/covers/daily-2026-08-02-control-plane-work-runtime-cover.png"
sources:
  - Workday Agent System of Record and Agent Gateway
  - ServiceNow AI Control Tower and Autonomous Workforce
  - Microsoft Agent 365
outline: deep
---

<ArticleCover
  image="/assets/covers/daily-2026-08-02-control-plane-work-runtime-cover.png"
  kicker="Digital Employee · Daily 002"
  title="Control Plane and Work Runtime Are Different Systems"
  summary="One system governs identity, ownership, and admission while another advances concrete work; they require separate models joined by a bounded contract."
  version="DD002"
  status="Research Note · 2026-08-02"
  languageHref="/zh/digital-employee/2026-08-02-control-plane-work-runtime"
  languageLabel="简体中文"
/>

# Digital Employee Daily 002 — Control Plane and Work Runtime Are Different Systems

## Summary

Current enterprise products are converging on two distinct system responsibilities.

The first is a **control plane**: inventory, identity, ownership, policy, access, lifecycle, risk, cost, observability, and compliance across many Agents.

The second is a **work runtime**: accepting work, planning, executing workflow steps, invoking tools, maintaining state, escalating, recovering, producing evidence, and deciding whether work is complete.

Workday Agent System of Record, ServiceNow AI Control Tower, and Microsoft Agent 365 are strongest in the first layer. ServiceNow Autonomous Workforce and existing Agent runtimes expose parts of the second.

The research judgment is:

> A Digital Employee platform requires both layers, but they must remain separately modeled. Governance inventory cannot substitute for work execution, and an Agent runtime cannot substitute for organizational governance.

## Source

### Selected official material

1. **Workday Agent System of Record and Agent Gateway** — selected for its cross-provider registry, lifecycle, identity permissioning, interaction metering, analytics, cost, and accountability model.
2. **ServiceNow AI Control Tower** — selected because it explicitly organizes governance into discovery, observation, governance, security, and measurement across Agents, models, workflows, identities, and MCP servers.
3. **ServiceNow Autonomous Workforce** — selected because it connects AI Specialists to deterministic workflows, policies, traceability, human escalation, and end-to-end work execution.
4. **Microsoft Agent 365** — selected for registry, Agent Map, lifecycle, owner, access governance, security, and compliance controls across first-party and external Agents.

These sources show product architecture and vendor direction. They do not by themselves prove that one architecture is universally sufficient or economically appropriate for SMEs.

## Observation

### 1. Enterprise governance is becoming cross-provider

Workday states that first-party and third-party Agents can be registered and monitored through the Agent System of Record and Agent Gateway. Microsoft Agent Registry can synchronize external environments. ServiceNow AI Control Tower inventories first-party and third-party Agents, models, identities, workflows, and MCP servers.

The governance layer therefore sits above an individual Agent framework or model provider.

### 2. The control plane manages lifecycle and risk, not individual task logic

Across the three platforms, control-plane functions include:

- registration and discovery;
- owner assignment;
- identity and permissions;
- activation, blocking, deactivation, and retirement;
- policy and compliance;
- runtime monitoring;
- cost and value measurement;
- inventory and relationship maps.

These functions answer: *What is deployed, who owns it, what may it access, is it healthy, and should it remain active?*

They do not fully answer: *How should this WorkOrder be decomposed, executed, recovered, verified, and closed?*

### 3. Work execution needs deterministic workflow structure

ServiceNow explicitly contrasts probabilistic models with enterprise demand for deterministic outcomes. Its AI Specialists operate through established workflows, use organizational knowledge, follow policies, produce traceable actions, and escalate when human authority is needed.

This indicates that the execution layer needs more than an Agent identity. It needs state transitions, operation contracts, evidence, escalation, recovery, and completion gates.

### 4. Observability exists at two levels

The control plane observes fleet-level facts: inventory, security posture, performance, cost, and policy conformance.

The work runtime must observe work-level facts: current WorkOrder, active operation, session state, tool result, retry, checkpoint, evidence, review, and completion status.

Combining both into one undifferentiated log would make operational diagnosis and governance judgment harder.

## Discussion

### Proposed separation

```text
Digital Employee Control Plane
  identity
  Position and owner
  registry
  authority and access policy
  provider and tool bindings
  lifecycle
  fleet health
  cost and evaluation
  compliance and audit views

Digital Employee Work Runtime
  WorkOrder intake
  plan and workflow
  operation nodes
  sessions and tools
  checkpoint and retry
  escalation and recovery
  evidence production
  review and completion gates
```

The control plane decides whether an execution identity is allowed and fit to operate. The work runtime decides how a specific unit of work progresses.

### Why one layer cannot replace the other

A registry without a runtime can list and govern Agents but cannot reliably complete organizational work.

A runtime without a control plane can execute tasks but cannot answer basic enterprise questions about ownership, lifecycle, sprawl, access, cost, policy, and retirement.

Therefore:

```text
Governed Digital Employee Platform
= Control Plane
+ Work Runtime
+ explicit contract between them
```

### The contract between layers matters most

The control plane should issue a bounded execution context to the runtime:

```yaml
execution_context:
  digital_employee_id:
  position_ref:
  work_order_ref:
  authority_snapshot_ref:
  allowed_tool_refs:
  provider_binding_ref:
  cost_policy_ref:
  evidence_policy_ref:
  escalation_policy_ref:
```

The runtime should return structured facts:

```yaml
execution_result:
  lifecycle_events:
  tool_and_session_events:
  evidence_refs:
  cost_usage_ref:
  evaluation_ref:
  completion_judgment:
  unresolved_escalations:
```

This allows governance to remain stable even when runtime implementations change.

### SME-first implication

Workday, ServiceNow, and Microsoft assume substantial enterprise infrastructure. CodeFlowMu should not reproduce a large control tower before proving one complete Digital Employee lifecycle.

The SME-first minimum should be:

- a small persistent registry;
- explicit owner and Position;
- tool/provider bindings;
- lightweight policy checks;
- runtime health and recovery view;
- evidence and cost projection;
- human authority for activation, exception, and release.

## Engineering Impact

### TMPA

No direct TMPA publication edit is made. This note supplies research input for separating governance records from operational execution while preserving references that allow later deterministic reconstruction.

### Digital Employee

The architecture should explicitly define Control Plane and Work Runtime as separate layers connected by stable contracts. Position and lifecycle belong primarily to the control plane; WorkOrder execution and evidence production belong primarily to the runtime.

### CodeFlowMu

CodeFlowMu already contains much of the Work Runtime layer:

- PM orchestration;
- task and report lifecycle;
- Session management;
- skills and tools;
- retry, HOLD, wake, and recovery mechanisms;
- FCoP coordination;
- evidence and completion gates.

The next safe step is not to replace this runtime. It is to add a lightweight read-only Control Plane projection above it:

1. register the current Open Dev Team as a Digital Employee;
2. register PM, DEV, QA, and OPS Position definitions;
3. expose provider, tool, Session, lifecycle, cost, and health bindings;
4. preserve existing runtime behavior during validation;
5. later make policy checks enforceable at WorkOrder admission and tool invocation boundaries.

## Future Work

1. Define the minimal Control Plane data model.
2. Map every current CodeFlowMu runtime fact to either Control Plane or Work Runtime.
3. Define the admission contract from Registry to WorkOrder.
4. Define which policy snapshot must be preserved for audit and replay.
5. Compare fleet-level observability with task-level observability.
6. Validate the two-layer model with a non-development Digital Employee use case.

## References

1. Workday, **Agent System of Record**: https://www.workday.com/en-us/artificial-intelligence/agent-system-of-record.html
2. Workday, **The Workday Agent System of Record Is Now Generally Available**: https://blog.workday.com/en-us/managing-ai-powered-future-of-work.html
3. Workday, **CIO Buyer Guide to an AI-ready HR and Finance Platform**: https://www.workday.com/en-us/topics/it/cio-buyers-guide.html
4. ServiceNow, **AI Control Tower**: https://www.servicenow.com/products/ai-control-tower.html
5. ServiceNow, **ServiceNow expands AI Control Tower**: https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-expands-AI-Control-Tower-to-discover-observe-govern-secure-and-measure-AI-deployed-across-any-system-in-the-enterprise/default.aspx
6. ServiceNow, **ServiceNow launches Autonomous Workforce that thinks and acts**: https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-launches-Autonomous-Workforce-that-thinks-and-acts-adds-Moveworks-to-the-ServiceNow-AI-Platform/default.aspx
7. Microsoft, **Microsoft Agent 365**: https://www.microsoft.com/microsoft-agent-365
8. Microsoft Learn, **Microsoft Agent 365 overview**: https://learn.microsoft.com/en-us/microsoft-agent-365/overview
9. Microsoft Learn, **Registry sync in the Microsoft 365 agent registry**: https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-registry
10. Microsoft Learn, **Manage the agent lifecycle**: https://learn.microsoft.com/en-us/agents/center-of-excellence/agent-lifecycle
