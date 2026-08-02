---
title: Industry Architecture Daily 003 — A2A and MCP Define Different Interoperability Boundaries
date: '2026-08-02'
column: industry-architecture
category: daily
summary: A2A v1.0 and the MCP 2026-07-28 specification overlap in operational features but still govern different trust boundaries: collaboration between independent agents versus access to tools, context, and capabilities.
sources:
  - A2A Protocol v1.0 documentation and specification
  - Model Context Protocol specification 2026-07-28
outline: deep
---

<ArticleCover
  image="/assets/covers/daily-a2a-mcp-boundaries.svg"
  kicker="Industry Architecture · Daily 003"
  title="A2A and MCP Define Different Interoperability Boundaries"
  summary="Agent-to-agent collaboration and agent-to-capability integration are complementary boundaries, not interchangeable protocol labels."
  version="ID003"
  status="Production Test V1 · 2026-08-02"
  languageHref="/zh/industry/2026-08-02-a2a-mcp-interoperability-boundaries"
  languageLabel="简体中文"
/>

## Summary

A2A Protocol v1.0 and the current Model Context Protocol specification are both becoming richer. A2A supports discovery, authenticated interaction, task lifecycle, messages, artifacts, streaming, polling, webhooks, and multiple protocol bindings. MCP supports host–client–server connections, resources, prompts, tools, elicitation, progress, cancellation, error reporting, and optional extensions for asynchronous tasks and skills.

The expanding feature sets can make the protocols appear interchangeable. Their architectural center, however, remains different.

The Research Center judgment is:

> A2A governs collaboration with an independently operated Agent whose internal implementation may remain opaque. MCP governs how an LLM application discovers and invokes externally provided context and capabilities. The decisive boundary is not whether both can run a long task; it is who owns the work, state, policy, and completion judgment on the other side.

A production system may use both: A2A between autonomous services and MCP inside one service to reach tools, data, or packaged skills.

## Source

### Selected primary material

1. **A2A Protocol v1.0 documentation and specification** — selected because v1.0 is the first stable, production-oriented version and explicitly explains that A2A is for agent-to-agent communication, not a sub-agent or tool-call protocol and not a replacement for MCP.
2. **Model Context Protocol specification dated 2026-07-28** — selected because it is the current authoritative protocol definition and documents the host/client/server model, capability negotiation, resources, prompts, tools, elicitation, and optional extensions.

The protocols are community standards under active development. This note records their documented architecture at the cited versions; implementations may support only a subset.

## Observation

### 1. A2A treats the remote side as an Agent service

A2A centers on an Agent Card and an interaction model built from Message, Part, Task, TaskStatus, TaskState, and Artifact. A client discovers a remote Agent’s capabilities, chooses a supported interface, authenticates, and requests work without requiring access to the remote Agent’s internal memory, framework, or tools.

The remote side can own a durable task lifecycle and return progress or artifacts through synchronous response, polling, streaming, or push notification.

This is a service-to-service collaboration boundary.

### 2. MCP treats the remote side as a provider of context and capability

MCP centers on a Host application, Clients inside that Host, and Servers that expose Resources, Prompts, and Tools. The current specification also includes utilities and opt-in extensions such as Tasks, Skills over MCP, and MCP Apps.

The Host remains responsible for user consent, tool authorization, model interaction, and how server-provided capabilities participate in the larger workflow.

This is an application-to-capability integration boundary.

### 3. Long-running tasks do not erase the distinction

The current MCP specification includes an optional Tasks extension with durable handles, polling, and mid-flight input. A2A also has durable Tasks and asynchronous delivery. Therefore, “A2A is async while MCP is only synchronous tool calling” is no longer an accurate distinction.

The deeper distinction is control ownership:

| Question | A2A default center | MCP default center |
|---|---|---|
| What is discovered? | Independent Agent and its skills/interfaces | Server-provided resources, prompts, tools, extensions |
| Who owns remote execution? | Remote Agent service | MCP Server capability, orchestrated by Host |
| Primary interaction object | Message, Task, Artifact | JSON-RPC request/response/notification around capabilities |
| Internal implementation visibility | May remain opaque | Capability contract is exposed to Host |
| Typical authority boundary | Peer service or organizational boundary | Tool/data integration boundary inside an application |
| Completion ownership | Remote Agent reports task state and artifacts; caller still verifies | Host composes tool results into its own workflow judgment |

*Table: joinwell52 Research Center synthesis from the A2A and MCP specifications.*

### 4. Both protocols require security outside the schema alone

A2A defines authentication and authorization expectations around Agent endpoints and advertised security schemes. MCP emphasizes explicit user consent, data privacy, cautious treatment of tool descriptions, and authorization flows.

Neither protocol can, by itself, decide whether a business action is appropriate. Organizational authority, policy, evidence, and release gates remain application responsibilities.

## Discussion

### Three interoperability layers

A useful architecture separates three layers rather than choosing one protocol for everything:

```text
Layer 1 — Internal orchestration
  roles, sub-agents, workflow nodes, local messages, state machine

Layer 2 — Capability integration
  MCP resources, prompts, tools, skills, tasks, apps

Layer 3 — Independent Agent collaboration
  A2A discovery, messages, tasks, artifacts, remote lifecycle
```

*Diagram: joinwell52 Research Center synthesis.*

Internal orchestration does not automatically need A2A. A manager calling a bounded specialist inside one runtime may be better represented by native workflow constructs. MCP is appropriate when the runtime needs a typed capability or data source. A2A becomes relevant when the other side is independently deployed, independently governed, and expected to own a meaningful unit of work.

### Protocol selection should follow accountability

The wrong question is: “Which protocol has more features?”

The better questions are:

1. Is the remote party a tool/capability or an accountable worker/service?
2. Who owns task state and retry?
3. Who is authorized to interpret completion?
4. Which side retains conversation and workflow control?
5. What evidence must cross the boundary?
6. Can the remote implementation remain opaque?

These questions determine the protocol boundary more reliably than transport or message shape.

### FCoP occupies a different operating scale

FCoP coordinates roles through durable filesystem artifacts and lifecycle transitions. It is primarily an internal coordination and governance mechanism for a known team and shared workspace.

A2A addresses communication between independent Agent systems over network interfaces. MCP exposes tools and context to an LLM application. FCoP should therefore not be relabeled as either protocol.

A future bridge could map selected FCoP tasks and reports to A2A Tasks and Artifacts at an external boundary while preserving FCoP as the internal system of record. Similarly, individual CodeFlowMu skills or data services could be exposed through MCP without changing internal custody rules.

### Avoid protocol flattening

If every specialist is presented as a tool, organizational ownership and independent task state may disappear. If every tool is presented as an Agent, integration becomes unnecessarily heavy and accountability becomes ambiguous.

The architecture should preserve the semantic difference between:

```text
invoke a capability
assign accountable work
transfer conversational control
coordinate an internal role
```

These are related operations, but they are not the same operation.

## Engineering Impact

### TMPA

This note does not directly modify TMPA publications. It provides research input for distinguishing Actor, Role, Message, Task, Artifact, Authority, and external Protocol Boundary. Deterministic reconstruction should preserve which system owned each lifecycle transition and completion claim.

### Digital Employee

A Digital Employee platform should expose two separate integration surfaces:

- a capability surface for tools, data, prompts, and packaged skills;
- a work-delegation surface for independently governed Digital Employees or external Agent services.

The Position and WorkOrder contracts should determine which surface is valid for a given operation.

### CodeFlowMu

CodeFlowMu should maintain the following mapping as a research hypothesis:

```text
FCoP / native runtime → internal team coordination
MCP                  → tool, data, and skill integration
A2A                  → external Agent-service collaboration
```

The first engineering experiment should not add all protocols at once. It should select one bounded external task, define identical evidence and completion requirements, implement an MCP capability version and an A2A delegated-work version, and compare ownership, recovery, observability, and auditability.

## Future Work

1. Build an explicit protocol-selection decision record.
2. Compare A2A Task states with FCoP lifecycle states without forcing one-to-one equivalence.
3. Examine MCP Tasks and Skills extensions in the 2026-07-28 specification.
4. Define the evidence envelope required when a remote Agent returns an Artifact.
5. Test authentication, cancellation, retry, timeout, and duplicate-submission behavior across both protocols.
6. Determine where human approval belongs when an A2A Agent internally uses MCP tools.

## References

1. A2A Protocol, **A2A Protocol home**: https://a2a-protocol.org/latest/
2. A2A Protocol, **Specification**: https://a2a-protocol.org/latest/specification/
3. A2A Protocol, **A2A Protocol Ships v1.0**: https://a2a-protocol.org/latest/announcing-1.0/
4. Model Context Protocol, **Specification 2026-07-28**: https://modelcontextprotocol.io/specification/2026-07-28
