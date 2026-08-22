---
title: Open-source Engineering Daily 003 — Manager Orchestration and Handoffs Encode Different Ownership Models
date: '2026-08-02'
column: open-source-engineering
category: daily
summary: OpenAI Agents SDK distinguishes manager-style specialist calls from handoffs that transfer active control, showing that multi-agent design must model ownership and authority rather than treating every delegation as the same tool call.
sources:
  - OpenAI Agents SDK agent orchestration documentation
  - OpenAI Agents SDK handoffs, guardrails, and tracing documentation
outline: deep
cover: "/assets/covers/manager-handoff-ownership-models-cover-v2.jpg"
---

<ArticleCover
  image="/assets/covers/manager-handoff-ownership-models-cover-v2.jpg"
  kicker="Open-source Engineering · Daily 003"
  title="Manager Orchestration and Handoffs Encode Different Ownership Models"
  summary="Calling a specialist while retaining control is not the same operation as transferring the active conversation and responsibility."
  version="ED003"
  status="Production Test V1 · 2026-08-02"
  languageHref="/zh/engineering/2026-08-02-manager-handoff-ownership-models"
  languageLabel="简体中文"
/>

## Summary

The OpenAI Agents SDK presents two common multi-agent composition patterns.

In the **manager pattern**, one Agent retains the user-facing conversation and calls specialist Agents as tools. The manager combines their outputs and remains responsible for the final answer.

In the **handoff pattern**, a triage or current Agent transfers control to a specialist. The specialist becomes the active Agent, receives conversation history unless it is filtered, and produces the downstream response.

The Research Center judgment is:

> Manager calls and handoffs are not stylistic alternatives. They encode different ownership, authority, context, guardrail, and completion models. A reliable multi-agent runtime must record which one occurred.

Treating both as generic “delegation” hides the most important operational fact: who owns the work after the boundary is crossed.

## Source

### Selected primary material

1. **OpenAI Agents SDK Agent orchestration and Agents documentation** — selected because it explicitly contrasts Agents-as-tools with handoffs and explains when a central manager should retain control.
2. **Handoffs documentation** — selected because it defines transfer behavior, history forwarding, input filters, handoff metadata, and the fact that handoffs remain inside one run.
3. **Guardrails documentation** — selected because it exposes different validation boundaries for initial input, final output, function tools, hosted tools, and handoffs.
4. **Tracing documentation** — selected because it records Agent spans, generations, function calls, guardrails, and handoffs as distinct runtime events.

These documents define SDK behavior. The architecture judgment below generalizes from the documented mechanisms; it is not a claim that one SDK pattern is universally best.

## Observation

### 1. A manager retains conversational and completion ownership

When a specialist is exposed through `Agent.as_tool()`, the manager invokes it for a bounded subtask. The specialist returns a result to the manager. The manager remains the active Agent, chooses whether more work is needed, composes the response, and owns the final user-facing output.

```text
User
  ↓
Manager Agent
  ├── call Specialist A as tool
  ├── call Specialist B as tool
  └── integrate and answer
```

This pattern is appropriate when one component must enforce a common policy, combine multiple findings, preserve one voice, or remain accountable for completion.

### 2. A handoff transfers the active role

A handoff is presented to the model as a transfer operation such as `transfer_to_refund_agent`. When invoked, the receiving Agent takes over the conversation. It normally receives prior conversation history, although input filters or nested-history settings can alter what is forwarded.

```text
User
  ↓
Triage Agent
  ↓ handoff event
Specialist Agent becomes active
  ↓
Specialist responds and owns the next turn
```

A handoff therefore changes the active instruction set, available tools, contextual view, and responsibility for the final output.

### 3. Validation boundaries differ

The SDK documentation highlights several boundaries that matter operationally:

- input guardrails apply to the first Agent in a chain;
- output guardrails apply to the Agent producing the final output;
- function-tool guardrails can run around every function-tool invocation;
- handoffs use the handoff pipeline rather than the normal function-tool guardrail pipeline;
- hosted and built-in execution tools have their own safety and control considerations.

A system that assumes “every delegation is covered by the same guardrail” can therefore create unprotected transitions.

### 4. Tracing treats the operations as distinct events

The Agents SDK records function calls and handoffs in different trace spans. This is not merely an observability convenience. It reflects different runtime semantics: a function result returns to the caller, while a handoff changes the active Agent path.

## Discussion

### Ownership comparison

| Dimension | Manager / Agent as tool | Handoff |
|---|---|---|
| Active conversational owner | Manager remains active | Specialist becomes active |
| Specialist scope | Bounded subtask | Ongoing turn or workflow responsibility |
| Final response owner | Manager | Receiving specialist |
| Context flow | Structured call input plus local context chosen by manager | Conversation history by default, configurable through filters |
| Shared policy point | Central manager can consistently apply policy | Policy must remain valid across receiving Agent and transition |
| Best fit | Research, calculation, review, bounded expertise, aggregation | Triage, domain transfer, direct specialist interaction |
| Main risk | Manager becomes bottleneck or distorts specialist output | Ownership transfer becomes implicit or loses required context |

*Table: joinwell52 Research Center synthesis from OpenAI Agents SDK documentation.*

### Delegation needs an explicit operation type

A multi-agent task record should not contain only `from` and `to`. It should state why the other Agent is involved and whether responsibility changes.

```yaml
delegation_event:
  type: consult | assign_subtask | handoff | escalate | return
  from_actor:
  to_actor:
  work_scope:
  authority_snapshot_ref:
  context_package_ref:
  expected_output_contract:
  completion_owner_before:
  completion_owner_after:
  guardrail_profile_ref:
  evidence_refs:
```

This structure prevents a “specialist call” from silently becoming a transfer of authority.

### A handoff is not the same as creating a child task

A child task can be executed asynchronously while the parent owner retains responsibility for integration and closure. A handoff normally transfers the active conversational role. These can be combined, but they should not be conflated.

For example:

- PM asks QA for a bounded verification report: **subtask/consult**, PM retains final ownership.
- ADMIN transfers an operational incident to OPS with authority to manage recovery: **handoff or assignment**, ownership may change.
- QA finds a policy exception and returns it to ADMIN: **escalation**, decision authority changes but execution ownership may remain.

The runtime must represent these distinctions rather than inferring them from natural-language messages.

### Context transfer is a governed package

Forwarding the entire conversation is convenient but may expose unnecessary data, stale instructions, or untrusted tool outputs. A production handoff should construct a context package containing:

- task identity and objective;
- accepted facts and evidence references;
- unresolved questions;
- authority and policy snapshot;
- allowed tools and data scope;
- expected output contract;
- explicit exclusions;
- return or escalation condition.

The receiving Agent should not have to reconstruct authority from a long transcript.

### Completion must follow ownership

When a manager retains ownership, a specialist’s success means “subtask result returned,” not “parent work completed.” When a handoff transfers ownership, completion gates, output validation, and release authority must move or be reattached explicitly.

This is the difference between an orchestration graph that merely routes text and one that governs work.

## Engineering Impact

### TMPA

This note does not edit TMPA publications. It supplies research input for separating Message Transfer, Work Assignment, Authority Transfer, Custody, and Completion Ownership. A deterministic reconstruction should show not only who acted, but whether the interaction was a consultation, subtask, handoff, escalation, or return.

### Digital Employee

Digital Employee Position definitions should state:

- which work can be accepted directly;
- which specialists may be consulted;
- which work may be handed off;
- which authority can transfer;
- who remains accountable for final completion;
- what context and evidence must accompany the transfer.

A Digital Employee platform should display current work owner separately from contributors.

### CodeFlowMu

CodeFlowMu’s PM pattern is naturally close to manager orchestration: PM decomposes work, invokes DEV/QA/OPS, integrates evidence, and reports to ADMIN. This should remain the default for bounded specialist work.

Handoff should be reserved for explicit responsibility transfer. The runtime should add a typed delegation event and show:

```text
current owner
contributors
pending subtask owners
decision authority
release authority
last handoff or return event
```

FCoP lifecycle transitions can preserve custody, but the product should not infer orchestration semantics solely from file movement. The task metadata and runtime event should state the operation type.

## Future Work

1. Add typed delegation semantics to the Research OS and CodeFlowMu runtime models.
2. Define a minimal Context Package for handoff and escalation.
3. Test manager, parallel subtask, sequential handoff, and return-to-manager patterns on the same development task.
4. Verify guardrail coverage at every boundary, including hosted tools and handoffs.
5. Compare trace evidence with FCoP lifecycle events and reports.
6. Define which Agent may declare parent completion after a handoff chain.

## References

1. OpenAI Agents SDK, **Agent orchestration**: https://openai.github.io/openai-agents-python/multi_agent/
2. OpenAI Agents SDK, **Agents**: https://openai.github.io/openai-agents-python/agents/
3. OpenAI Agents SDK, **Handoffs**: https://openai.github.io/openai-agents-python/handoffs/
4. OpenAI Agents SDK, **Guardrails**: https://openai.github.io/openai-agents-python/guardrails/
5. OpenAI Agents SDK, **Tracing**: https://openai.github.io/openai-agents-python/tracing/
