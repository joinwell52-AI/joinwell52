---
title: Industry Architecture Weekly 001 — The Enterprise Agent Governance Control Plane Is Taking Shape
date: '2026-08-02'
column: industry-architecture
category: weekly
summary: Workday, ServiceNow, and Microsoft are converging on a common enterprise Agent governance control plane: discover and register assets, assign owners, manage authority and lifecycle, observe runtime risk, and measure cost and value.
sources:
  - Workday Agent System of Record
  - ServiceNow AI Control Tower
  - Microsoft Agent 365
outline: deep
---

<ArticleCover
  image="/assets/covers/industry-weekly-001.svg"
  kicker="Industry Architecture · Weekly 001"
  title="The Enterprise Agent Governance Control Plane Is Taking Shape"
  summary="Workday, ServiceNow, and Microsoft converge on discovery, registry, governance, security, observation, and value measurement."
  version="IW001"
  status="Published 2026-08-02"
  languageHref="/zh/industry/2026-08-02-enterprise-agent-governance-control-plane"
  languageLabel="简体中文"
/>

## Summary

The strongest industry architecture signal this week is not another improvement in model reasoning. It is the emergence of an enterprise control plane above models, Agent frameworks, and business applications.

Workday places AI Agents inside a blended-workforce System of Record. ServiceNow expands AI Control Tower across five dimensions—Discover, Observe, Govern, Secure, and Measure. Microsoft Agent 365 combines Agent Registry, Entra, Purview, and lifecycle actions to manage Agents across environments.

This report’s judgment is:

> Enterprise Agent governance is moving from scattered product settings into a distinct control plane. Its primary object is not a prompt, but an organizational asset that can be discovered, owned, authorized, observed, blocked, retired, and measured.

## Source

Three groups of official materials were selected:

1. **Workday Agent System of Record (ASOR):** unified inventory, lifecycle, accountability, permissions, interaction metering, and value analytics.
2. **ServiceNow AI Control Tower:** cross-platform AI asset governance across Discover, Observe, Govern, Secure, and Measure.
3. **Microsoft Agent 365:** Agent Registry, registry sync, ownership, access governance, activation, blocking, and retirement.

These sources support analysis of publicly described product architecture. Vendor claims about scale, market coverage, or business outcomes remain vendor claims unless independently verified.

## Weekly Highlights

### 1. Agent Registry is becoming the common starting point

All three systems first address a basic question: which Agents exist inside the organization?

- Workday ASOR registers Workday, customer-built, and third-party Agents;
- ServiceNow discovers Agents, models, identities, workflows, MCP servers, and other AI assets;
- Microsoft Agent Registry can synchronize external Agent environments into one governance view.

The first step in enterprise Agent governance is therefore not orchestration. It is asset discovery and identity establishment.

### 2. Ownership and lifecycle are becoming formal governance data

Workday describes a lifecycle of register, configure, activate, and deactivate, while emphasizing responsibility and accountability. Microsoft supports ownership assignment, installation, activation, blocking, reassignment, and deletion. ServiceNow places AI asset owners, stewards, and risk teams inside a shared governance process.

Agents are beginning to resemble service accounts, applications, and organizational positions: persistent assets with governed state.

### 3. Runtime observation is replacing one-time review

ServiceNow explicitly includes continuous observation, live metrics, behavior traces, and alerts. Workday’s Agent Gateway manages and meters interactions. Microsoft extends identity, data, and threat protection to Agents.

Governance is shifting from pre-deployment approval toward pre-deployment validation plus continuous runtime judgment.

## Cross Analysis

### Control-plane capability matrix

| Capability | Workday ASOR | ServiceNow AI Control Tower | Microsoft Agent 365 |
|---|---|---|---|
| Unified inventory / registry | First- and third-party Agents | Agents, models, identities, workflows, MCP assets | First-party and external Agent Registry |
| Ownership / accountability | Role, responsibility, accountability | AI asset owners, stewards, risk processes | Owner assignment and reassignment |
| Lifecycle | Register, configure, activate, deactivate | Discover, assess, govern, remediate | Install, activate, block, delete |
| Identity and authority | Precise identity and permissions; Agent Gateway | Identity access governance, least privilege, kill switch | Entra identities, access packages, policy |
| Runtime observation | Interaction metering and analytics | Runtime traces, metrics, alerts, behavior observation | Agent Map plus security and risk monitoring |
| Cost and value | Cost, impact, dynamic ROI | Cost tracking and ROI dashboards | Stronger emphasis on governance, security, compliance |
| Primary enterprise anchor | HCM, finance, blended workforce | IT governance, CMDB, workflow | Microsoft 365, Entra, Purview |

**Note:** This table is synthesized from official capability descriptions. It is not an independent benchmark and does not imply equal maturity across columns.

### Shared control-plane structure

```text
Agents, models, and runtime environments
                 ↓
         Discover / Register
                 ↓
    Identity + Owner + Position
                 ↓
    Policy + Access + Lifecycle
                 ↓
   Observe + Risk + Cost + Value
                 ↓
 Block / Retire / Improve / Audit
```

*Diagram: joinwell52 Research Center synthesis from official materials.*

### A control plane is not a work runtime

The control plane answers:

- Which Agents exist?
- Who owns them?
- What authority do they have?
- Are they compliant?
- What are their current risk, cost, and value states?
- Should they be activated, blocked, or retired?

It does not fully explain how a WorkOrder is decomposed, executed, recovered, evidenced, and completed. The control plane and work runtime should therefore be modeled separately and connected through a stable contract.

## New Architecture Judgment

Four judgments emerge this week:

1. **Agent Registry will become enterprise AI infrastructure.** Cross-platform governance is impossible without an authoritative inventory.
2. **Owner is the entry point to the governance chain.** Ownership connects approval, access, risk response, cost, and retirement responsibility.
3. **Identity and authority must remain independent of model provider.** Models and runtimes may change while organizational identity persists.
4. **Continuous observation will become a formal governance condition.** Static compliance records cannot replace runtime traces and behavioral state.

## Engineering Impact

### TMPA

This report does not modify TMPA publications. As research input, it reinforces the need for traceable references among Profile, Authority, Lifecycle, Event, Integrity, and Governance Judgment.

### Digital Employee

A minimum Digital Employee control plane requires Registry, Position and Owner, Authority Policy, Lifecycle, provider and tool bindings, runtime health, cost/value/evaluation, audit, and remediation actions.

### CodeFlowMu

CodeFlowMu already exposes substantial work-runtime facts but lacks a distinct control plane. The prudent sequence is to build a read-only Registry projection first, then add ownership, lifecycle, authority, and health remediation without rewriting the existing execution chain.

## Next Week Research

1. Compare SAP, Oracle, and Salesforce Agent builders and runtime governance.
2. Define the minimum contract between control plane and runtime.
3. Compare kill switches, human escalation, and recovery policies.
4. Test whether SMEs need a full Control Tower or a minimal governance plane.

## References

1. Workday, **Agent System of Record**: https://www.workday.com/en-us/artificial-intelligence/agent-system-of-record.html
2. Workday, **The Workday Agent System of Record Is Now Generally Available**: https://blog.workday.com/en-us/managing-ai-powered-future-of-work.html
3. Workday, **What are AI agents?**: https://www.workday.com/en-us/topics/ai/ai-agents.html
4. ServiceNow, **AI Control Tower**: https://www.servicenow.com/products/ai-control-tower.html
5. ServiceNow, **AI Control Tower expands across the enterprise**: https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-expands-AI-Control-Tower-to-discover-observe-govern-secure-and-measure-AI-deployed-across-any-system-in-the-enterprise/default.aspx
6. Microsoft Learn, **Microsoft Agent 365 overview**: https://learn.microsoft.com/en-us/microsoft-agent-365/overview
7. Microsoft Learn, **Registry sync in the Microsoft 365 agent registry**: https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-registry
8. Microsoft Learn, **Govern agents using Agent 365**: https://learn.microsoft.com/en-us/training/modules/agent-365-govern/
