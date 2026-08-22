---
title: Open-source Engineering Weekly 002 — Agent Capability Is Being Packaged as Skills, Plugins, and Contracts
date: '2026-08-02'
column: open-source-engineering
category: weekly
summary: OpenHands, CrewAI, AutoGen, and LangGraph show that reusable agent capability is moving from hidden prompt text into explicit skills, plugins, tools, workflows, message contracts, and observable events.
sources:
  - OpenHands skills and plugins documentation
  - CrewAI agents, flows, and observability documentation
  - AutoGen teams, application stack, memory, and logging documentation
  - LangGraph runtime and human-in-the-loop documentation
outline: deep
cover: "/assets/covers/agent-capability-packaging-cover-v2.jpg"
---

<ArticleCover
  image="/assets/covers/agent-capability-packaging-cover-v2.jpg"
  kicker="Open-source Engineering · Weekly 002"
  title="Agent Capability Is Being Packaged as Skills, Plugins, and Contracts"
  summary="Reusable capability is moving out of hidden prompts and into explicit packages, interfaces, workflow nodes, and events."
  version="EW002"
  status="Published 2026-08-02"
  languageHref="/zh/engineering/2026-08-02-agent-capability-packaging"
  languageLabel="简体中文"
/>

## Summary

The second open-source engineering signal is a shift in how agent capability is represented. Early systems often embedded capability inside one long prompt plus an unrestricted tool list. Current systems increasingly package capability as explicit, inspectable components.

OpenHands uses skills, hooks, MCP configurations, specialized agents, commands, and plugins. CrewAI separates agents, tasks, tools, crews, flows, guardrails, memory, knowledge, and structured outputs. AutoGen separates AgentChat teams from the event-driven Core and requires application-defined message contracts. LangGraph treats nodes, state, edges, interrupts, and persistence as explicit orchestration components.

The Research Center judgment is:

> Reusable agent capability is becoming a governed package with a name, scope, activation rule, interface, version, runtime dependency, event surface, and evidence trail. A prompt fragment alone is not a sufficient skill contract.

## Source

The selected official sources cover four complementary engineering directions:

1. **OpenHands Skills and Plugins** — progressive disclosure through `SKILL.md`, always-on repository context, triggered skills, plugin packages, hooks, MCP servers, agents, and commands.
2. **CrewAI Agents and Flows** — role-oriented agents, tools, memory, knowledge, structured output, persistent flows, guardrails, callbacks, and observability.
3. **AutoGen Teams and Core** — team patterns, handoffs, event-driven runtime, message protocols, memory interfaces, state serialization, and structured logging.
4. **LangGraph orchestration** — explicit state, nodes, transitions, interrupts, persistence, and human decision points.

These sources reveal engineering patterns. They do not establish one universal standard for skill packaging.

## Weekly Highlights

### 1. Skills are moving from prompt text to loadable artifacts

OpenHands describes skills as specialized prompts with domain guidance and automated handling, but packages them as files with explicit loading behavior. Always-on context is separated from on-demand skills; keyword or agent-triggered activation supports progressive disclosure. Organization-, user-, and repository-level scopes are distinct.

This is more operationally useful than copying every instruction into every system prompt.

### 2. Plugins are becoming capability bundles

OpenHands plugins can combine skills, hooks, MCP configuration, specialized agents, and commands. The important engineering change is that a capability package can include both knowledge and runtime integration.

```text
Capability package
  ├── Skill instructions
  ├── Tool / MCP bindings
  ├── Lifecycle hooks
  ├── Specialized agent definitions
  ├── Commands
  └── Versioned package metadata
```

*Diagram: joinwell52 Research Center synthesis from OpenHands plugin documentation.*

### 3. Workflow systems are separating capability from orchestration

CrewAI distinguishes agents and their tools from Flows that route, persist, and resume work. LangGraph similarly separates node behavior from state and graph transitions. AutoGen separates agents from team patterns and from the event-driven runtime.

This allows the same skill or tool to be reused in different workflows without redefining the entire worker.

### 4. Message and event contracts are becoming important

AutoGen’s application stack requires developers to define message types as a behavior contract. AutoGen also separates trace logs from structured events. This is a strong signal that agent interaction needs machine-readable interfaces, not only conversational text.

A capability is operationally incomplete when other components cannot determine:

- what input it accepts;
- what output it promises;
- what events it emits;
- what errors or holds it can return;
- what authority it requires;
- how it is versioned.

## Cross Analysis

### Capability representation matrix

| Dimension | OpenHands | CrewAI | AutoGen | LangGraph |
|---|---|---|---|---|
| Primary capability unit | Skill / plugin / agent / command | Agent / tool / task / crew | Agent / team / message handler | Node / runnable / graph |
| Activation | Always-on, user-triggered, keyword or agent-selected | Task/process/flow invocation | Runtime messages, team selection, handoff | Edge, condition, interrupt, command |
| Tool integration | Plugin and MCP configuration | Agent tools and integration tools | Tool-capable agents and extensions | Tool nodes and application code |
| State | Conversation and workspace context | Flow and crew state | Agent/team state and memory protocol | Explicit graph state and checkpoints |
| Interface contract | Skill format and plugin structure | Structured task inputs/outputs and Pydantic models | Message protocol and event types | State schema and node transition contract |
| Observability | Runtime/plugin logs and hooks | Traces, callbacks, monitoring | Trace and structured event loggers | State history and tracing integration |
| Distribution | Registry/repository packages | Project packages and managed platform | Python components and distributed runtime | Libraries, deployment, and runtime services |

**Note:** This comparison describes documented abstractions, not feature parity or quality.

### Proposed minimum Skill Contract

```yaml
skill:
  id:
  version:
  purpose:
  activation:
  input_contract:
  output_contract:
  allowed_tools:
  required_authority:
  runtime_dependencies:
  emitted_events:
  failure_states:
  evidence_requirements:
  owner:
```

This is a Research Center synthesis, not a frozen product schema.

## New Architecture Judgment

1. **Skill should be an explicit artifact.** Hidden prompt content cannot be reliably discovered, versioned, activated, or audited.
2. **Capability and workflow should be separate.** A skill describes what can be done; a workflow determines when and in what sequence it is used.
3. **A plugin may bind knowledge to runtime infrastructure.** This is powerful but expands the security and review boundary.
4. **Message and event contracts are necessary for multi-agent composition.** Free-form text alone is insufficient for dependable orchestration.
5. **Activation state must be observable.** Installed, loaded, selected, executed, and verified are different states.

## Engineering Impact

### TMPA

This report does not change TMPA publications. As research input, it supports explicit references among Role, Authority, Message, Event, Lifecycle, and Integrity for capability activation and execution.

### Digital Employee

A Digital Employee should own a governed capability catalog. Each skill should have scope, version, owner, authority requirements, runtime bindings, evidence expectations, and evaluation history.

### CodeFlowMu

CodeFlowMu currently loads skills and exposes tool usage, but the product should distinguish:

```text
available
→ installed
→ activated
→ invoked
→ completed
→ verified
```

The Runtime should record which version of a skill was active for each WorkOrder and which structured events and evidence were produced.

## Next Week Research

1. Compare AgentSkills, Claude Code plugins, MCP servers, and framework-specific tools.
2. Define a portable Skill Contract for CodeFlowMu.
3. Examine signature, trust, and permission models for third-party capability packages.
4. Test whether one skill can operate consistently across different Agent providers.

## References

1. OpenHands, **Skills overview**: https://docs.openhands.dev/overview/skills
2. OpenHands, **Organization and User Skills**: https://docs.openhands.dev/overview/skills/org
3. OpenHands, **Adding New Skills**: https://docs.openhands.dev/overview/skills/adding
4. OpenHands, **Plugins**: https://docs.openhands.dev/sdk/guides/plugins
5. CrewAI, **Documentation**: https://docs.crewai.com/
6. CrewAI, **CrewAI AMP**: https://docs.crewai.com/enterprise/introduction
7. Microsoft AutoGen, **Teams**: https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/teams.html
8. Microsoft AutoGen, **Application Stack**: https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/core-concepts/application-stack.html
9. Microsoft AutoGen, **Memory and RAG**: https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/memory.html
10. Microsoft AutoGen, **Logging**: https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/framework/logging.html
11. LangChain, **LangGraph overview**: https://docs.langchain.com/oss/python/langgraph/overview
