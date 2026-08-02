---
title: Weekly 003 — Ownership Is the Control Plane of Agentic Work
date: '2026-08-02'
column: digital-employee
category: weekly
summary: 'Cross-analysis of three evidence-validated Daily Research Notes concludes that reliable agentic systems must explicitly assign work, control, state, authority, evidence, and completion ownership at every execution boundary.'
sources:
  - Digital Employee Daily 003 — Computer Use Requires an Observable Action–State Loop
  - Industry Architecture Daily 003 — A2A and MCP Define Different Interoperability Boundaries
  - Open-source Engineering Daily 003 — Manager Orchestration and Handoffs Encode Different Ownership Models
outline: deep
---

<ArticleCover
  image="/assets/covers/weekly-003.svg"
  kicker="Weekly Research · 003"
  title="Ownership Is the Control Plane of Agentic Work"
  summary="Reliable Agent systems do not merely route actions. They make ownership, authority, evidence, and completion explicit at every boundary."
  version="W003"
  status="Published 2026-08-02"
  languageHref="/zh/research/weekly/weekly-003"
  languageLabel="简体中文"
/>

## Evidence scope

This synthesis uses only evidence-validated Daily Research Notes published during the seven-day window **2026-07-27 through 2026-08-02**.

Exactly three Daily notes met the eligibility rule. All three were produced and verified by Research OS Engine Production Test V1, passed the complete Research Skills pipeline, were merged to `main`, and were re-read from the authoritative branch.

| Column | Eligible Daily note | Validated judgment used in this synthesis |
|---|---|---|
| Digital Employee | Computer Use Requires an Observable Action–State Loop | A model proposes actions; an external runtime executes, observes, governs, and verifies the resulting state. |
| Industry Architecture | A2A and MCP Define Different Interoperability Boundaries | Protocol choice should follow ownership of work, state, policy, and completion—not feature count alone. |
| Open-source Engineering | Manager Orchestration and Handoffs Encode Different Ownership Models | Specialist calls and handoffs are different operations because control and responsibility do not move in the same way. |

Academic Observations, older Weekly reports, and unvalidated source material were excluded from the evidence base. This report therefore synthesizes a small but coherent set of production-verified Daily observations rather than pretending to represent a broad market survey.

## Executive synthesis

The three Daily notes examine different surfaces:

- GUI execution;
- protocol interoperability;
- multi-Agent orchestration.

Their common architectural problem is the same:

> **Agentic systems fail when they move messages or actions without preserving who owns the work, who controls execution, who owns state, who grants authority, who may claim completion, and who independently verifies the outcome.**

The new weekly conclusion is that **ownership is the control plane of agentic work**.

A reliable Digital Employee platform should not treat computer actions, MCP calls, manager-to-specialist calls, handoffs, and A2A delegation as interchangeable “tool use.” Each is a different work boundary with a different ownership transition.

```text
Position + WorkOrder
        ↓
Work Boundary Control Plane
  ├─ Computer Operation boundary
  ├─ Capability boundary (MCP)
  ├─ Internal delegation boundary
  ├─ Handoff boundary
  └─ External Agent boundary (A2A)
        ↓
Evidence Envelope
        ↓
Independent Completion Verifier
        ↓
Accepted outcome or governed recovery
```

*Diagram: joinwell52 Research Center synthesis from the three eligible Daily Research Notes.*

## Weekly highlights

1. **Execution and completion are separate facts.** A successful click, tool return, specialist response, or remote task state is not automatically a completed business outcome.
2. **Control transfer and work contribution are different.** A manager may retain responsibility while a specialist contributes; a handoff may change the active owner; an external Agent may own a delegated task while the caller still owns acceptance.
3. **Protocol convergence does not remove semantic boundaries.** MCP and A2A can both support long-running operations, but they still center different ownership relationships.
4. **Autonomy must be decomposed.** Operational autonomy can increase while authority autonomy remains bounded by Position policy and human approval.
5. **Evidence must cross every boundary.** The receiving side should not inherit a narrative claim of success; it should receive a structured evidence envelope sufficient for independent validation.

## Cross Analysis

### 1. Computer use exposes the action–state gap

The computer-use Daily note separates five facts:

```text
proposed action
→ authorized action
→ executed action
→ resulting application state
→ completion judgment
```

This shows why an Agent cannot be the sole authority over its own GUI work. The model can propose; the harness can execute; the target application owns the resulting business state; and a task-specific validator must decide whether the desired outcome actually holds.

The hidden ownership question is not “who clicked?” It is:

- who owns the WorkOrder;
- who is permitted to act;
- who records pre-state and post-state;
- who can retry or compensate;
- who may close the work.

### 2. MCP and A2A expose the service-boundary gap

The protocol Daily note shows that feature lists are an unreliable basis for architecture. Both MCP and A2A can expose capabilities, long-running operations, progress, cancellation, and asynchronous behavior.

The durable distinction is accountability:

- MCP normally exposes a capability inside a Host-controlled workflow;
- A2A normally delegates meaningful work to an independently operated Agent service.

Therefore a protocol adapter must not silently decide the work model. The WorkOrder and Position contract should decide whether the operation is a capability invocation or an accountable delegation before transport is selected.

### 3. Manager and handoff expose the responsibility-transfer gap

The orchestration Daily note shows that a manager calling a specialist retains conversational and completion ownership, while a handoff changes the active Agent and may transfer downstream responsibility.

This means that `from`, `to`, and a text message are insufficient runtime facts. The system must record the operation type:

```text
consult
assign_subtask
handoff
escalate
return
```

Without that type, the runtime cannot reliably reconstruct who owns integration, who applies final guardrails, or who may declare completion.

### 4. Unified boundary matrix

| Boundary | Work owner after boundary | Control owner | State owner | Completion claimant | Acceptance verifier |
|---|---|---|---|---|---|
| Computer operation | Local WorkOrder owner usually remains accountable | Execution harness | Target application plus runtime evidence store | Local runtime or worker | Task-specific validator / human gate |
| MCP capability call | Host usually retains work ownership | Host orchestrates the server capability | Server capability state plus Host workflow state | Host workflow | Host-side business validator |
| Manager → specialist call | Manager retains parent work ownership | Manager | Manager run plus specialist subtask state | Specialist claims subtask result; manager claims parent completion | Manager, QA, or release gate |
| Handoff | Receiving Agent becomes active owner for the transferred scope | Receiving Agent within runtime policy | Shared run state with governed context transfer | Receiving Agent for the transferred scope | Defined downstream gate or returning owner |
| A2A delegated task | Remote Agent owns delegated task execution | Remote Agent service | Remote task lifecycle; caller retains local WorkOrder state | Remote Agent reports task state and artifacts | Caller-side acceptance validator |

*Table: joinwell52 Research Center synthesis.*

The matrix reveals a recurring rule: **the party that reports progress is not necessarily the party authorized to accept completion**.

## New architecture judgment: Work Boundary Control Plane

The Research Center should add a **Work Boundary Control Plane** between Position-level work and every execution adapter.

This is not a second workflow engine. It is a semantic and evidence layer that preserves ownership across heterogeneous operations.

### Required objects

1. **WorkBoundaryContract** — defines the type and allowed ownership transition.
2. **OwnershipLedger** — records durable before/after ownership facts.
3. **AuthorityDecision** — records policy and human approval where required.
4. **ContextPackage** — transfers only the context necessary for the receiving boundary.
5. **EvidenceEnvelope** — returns structured observations, artifacts, state references, and execution facts.
6. **CompletionVerifier** — independently decides whether the WorkOrder outcome is acceptable.

### Proposed contract

```yaml
work_boundary_contract:
  boundary_id:
  work_order_ref:
  boundary_type: capability_call | subtask | handoff | external_delegation | computer_operation
  from_actor_ref:
  to_actor_or_adapter_ref:
  work_scope:
  work_owner_before:
  work_owner_after:
  control_owner:
  state_owner:
  authority_source_ref:
  context_package_ref:
  expected_output_contract:
  evidence_envelope_contract:
  completion_claimant:
  completion_verifier:
  retry_owner:
  compensation_owner:
  return_or_escalation_condition:
```

### Boundary invariants

- No boundary may change work ownership implicitly.
- A completion claim must not automatically become an accepted outcome.
- Context transfer must follow least privilege and exclude stale or untrusted material.
- Retry and compensation ownership must be declared before consequential execution.
- Protocol adapters may transport work but may not redefine Position authority or WorkOrder lifecycle semantics.
- A resumed run must prove that it will not duplicate a consequential action.

## Contradictions identified

### Autonomy versus authority

Computer use and remote delegation increase operational autonomy, but consequential organizational actions still require bounded authority. Treating more tool access as more authority is a category error.

**Resolution direction:** represent operational capability and decision authority as separate fields in the Position and WorkBoundaryContract.

### Protocol convergence versus semantic divergence

MCP Tasks and A2A Tasks may look increasingly similar at the transport level. Yet one normally serves Host-controlled capability integration while the other represents independent Agent collaboration.

**Resolution direction:** select the work model first, then the protocol. Do not infer accountability from the presence of an asynchronous task handle.

### Central control versus orchestration bottlenecks

The manager pattern provides consistent policy and integration, but a central manager can become slow, context-heavy, or distort specialist results. Handoffs reduce the central bottleneck but can fragment policy and completion ownership.

**Resolution direction:** retain manager ownership for bounded, aggregative work; permit handoff only when the transferred scope, authority, return condition, and verifier are explicit.

### Rich context versus least privilege

Handoffs and remote collaboration benefit from context continuity, while safe execution requires minimizing sensitive, stale, or prompt-injected material.

**Resolution direction:** use a governed ContextPackage rather than forwarding the complete transcript by default.

### Self-reported success versus independent verification

A remote Agent, specialist, or computer-use loop can report success. The caller still needs proof that the business state changed correctly and durably.

**Resolution direction:** completion is a two-step protocol: `claim` followed by `accept` or `reject`.

## Unresolved questions

1. Which ownership dimensions belong in TMPA core objects, and which should remain runtime projections?
2. Can one EvidenceEnvelope cover GUI state, MCP tool results, specialist reports, and A2A artifacts without becoming too generic?
3. How should a parent WorkOrder behave when a handoff chain does not return to the original manager?
4. Which validators must be deterministic, and where is human judgment an accepted verification mechanism?
5. How should duplicate submission, timeout, cancellation, and compensation be represented across external Agent boundaries?
6. When a remote A2A Agent internally uses MCP tools, where should human approval be enforced and evidenced?
7. What evidence retention policy is sufficient for audit while minimizing privacy and storage risk?

## Engineering judgment

The next CodeFlowMu milestone should **not** begin by adding broad A2A, MCP, or unrestricted computer-use support.

The highest-leverage engineering sequence is:

### Phase 0 — semantic foundation

1. Add a typed delegation and boundary event model.
2. Add `work_owner`, `control_owner`, `completion_claimant`, and `completion_verifier` projections.
3. Define EvidenceEnvelope and CompletionVerifier interfaces.
4. Add explicit `waiting_human_authority`, `claim_submitted`, `verification_failed`, and `accepted` lifecycle states where applicable.

### Phase 1 — controlled adapters

1. Wrap one local computer-operation case with pre-state, post-state, approval, and deterministic validation.
2. Wrap one bounded MCP capability call without transferring parent work ownership.
3. Implement one manager-to-specialist subtask and one explicit handoff using the same WorkBoundaryContract.
4. Simulate one A2A-style external delegation with a remote task state and local acceptance gate.

### Phase 2 — comparative experiment

Execute the same bounded business task through four paths:

```text
manager subtask
handoff
MCP capability
A2A delegation
```

Compare:

- ownership clarity;
- context transferred;
- retry behavior;
- evidence quality;
- final-state verification;
- recovery after interruption;
- risk of duplicate consequential action.

Only after these semantics are stable should CodeFlowMu add general protocol bridges or a full Digital Employee Studio.

## Impact on the Research Center architecture

### TMPA

This report does not modify TMPA publications. It supplies research input for separating:

- work assignment;
- message transfer;
- custody;
- authority transfer;
- execution control;
- evidence custody;
- completion claim;
- completion acceptance.

A deterministic reconstruction should preserve each transition rather than infer it from message order or file movement alone.

### Digital Employee

A Position definition should declare:

- work it may accept;
- capabilities it may invoke;
- work it may delegate;
- authority it may exercise without approval;
- applications and accounts it may operate;
- context it may disclose;
- completion it may claim;
- outcomes it may finally approve.

This turns the Digital Employee from a named Agent into an accountable organizational worker.

### CodeFlowMu

CodeFlowMu’s existing PM pattern should remain the default manager model: PM owns decomposition, integration, and parent completion. DEV, QA, and OPS contribute bounded work unless an explicit handoff changes ownership.

The runtime should expose:

```text
current work owner
active control owner
contributors
pending subtask owners
decision authority
release authority
completion claimant
completion verifier
last ownership transition
```

FCoP lifecycle transitions remain useful custody evidence, but file movement alone should not be treated as the complete ownership model.

## Queue reprioritization

| Queue item | Priority | Recommended transition | Reason |
|---|---:|---|---|
| WorkBoundaryContract and OwnershipLedger | P0 | Candidate → Selected → Architecture Definition | It is the shared prerequisite for GUI, MCP, A2A, manager, and handoff execution. |
| CompletionVerifier and EvidenceEnvelope | P0 | Candidate → Selected | Every eligible Daily note identifies a completion or evidence gap. |
| Human authority lifecycle node | P0 | Candidate → Selected | Consequential actions need durable approval and resume semantics. |
| Comparative boundary experiment | P1 | Candidate → Queue | Validates the architecture using one task across four work models. |
| A2A–FCoP external bridge | P2 | Queue → Hold | Mapping should wait until ownership and acceptance semantics are stable. |
| General MCP skills/tasks integration | P2 | Queue → Hold | Capability transport should not precede the Host-side work contract. |
| Unrestricted computer-use runtime | P2 | Queue → Hold | Start with a controlled local application and executable validator. |
| Full Digital Employee Studio | P3 | Backlog remains Backlog | Registry and UI expansion should follow runtime semantic proof. |

## Lifecycle transitions

The three source Daily notes transition from `published` to `synthesized`, with Weekly 003 recorded as the synthesis consumer.

```text
Daily 003 source objects
published
→ synthesis_selected
→ cross_analyzed
→ synthesized_in: weekly-003

Weekly 003
candidate
→ selected
→ cross_analysis_complete
→ architecture_judgment_complete
→ engineering_judgment_complete
→ publication_editing_complete
→ published
→ commit_verified
```

These transitions do not reopen or revise the original Daily publications. They record that the Daily evidence has been consumed by a higher synthesis layer.

## Next week research

1. Draft WorkBoundaryContract V0.1 as a research schema, not yet a frozen TMPA object.
2. Define a minimal EvidenceEnvelope with concrete variants for GUI, capability call, specialist result, and remote Agent artifact.
3. Design the four-path comparative experiment and one deterministic final-state validator.
4. Specify human approval, timeout, cancellation, retry, and compensation transitions.
5. Test whether current FCoP custody events can project the proposed OwnershipLedger without protocol changes.

## Conclusion

The week’s three validated Daily observations converge on a single engineering principle:

> **The core of Agent governance is not routing intelligence. It is preserving accountable ownership across every boundary where work, control, state, authority, evidence, or completion may move.**

The practical consequence is clear: CodeFlowMu should establish the Work Boundary Control Plane before expanding protocol coverage or computer-operation autonomy.

## References

1. [Digital Employee Daily 003 — Computer Use Requires an Observable Action–State Loop](../../digital-employee/2026-08-02-computer-use-action-state-loop)
2. [Industry Architecture Daily 003 — A2A and MCP Define Different Interoperability Boundaries](../../industry/2026-08-02-a2a-mcp-interoperability-boundaries)
3. [Open-source Engineering Daily 003 — Manager Orchestration and Handoffs Encode Different Ownership Models](../../engineering/2026-08-02-manager-handoff-ownership-models)
4. [Research OS Engine Production Test V1 — evidence validation record](https://github.com/joinwell52-AI/joinwell52/blob/main/research/production-tests/production-test-v1/REPORT.md)
