---
schema: "research-analysis/v1"
id: "AN-20260810-01"
date: "2026-08-10"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260810-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260810-01-durable-runstate-pending-input.md"
output_contract: "Research Object"
research_object: "Governed Input Admission for Resumable Digital Employees"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Governed Input Admission for Resumable Digital Employees

## Governed scope

Skill 04 analysis using only the three completed 2026-08-10 Reading Results, with Q-20260810-01 as the primary Digital Employee object. No unread material, article drafting, or publication work is introduced.

## Analysis

```yaml
analysis:
  observations:
    - Durable pending input is kept outside the active model/tool step until the next model-call admission boundary, where guardrails run before the input becomes part of the resumed conversation.
    - A durable occurrence identifier travels with the admitted input, while accepted model responses, completed tool progress, current step, and pending input are checkpointed across resume paths.
    - The implementation explicitly limits exactly-once semantics to SDK-owned admission/conversation bookkeeping; arbitrary external tool side effects still need their own idempotency boundary.
  cross_comparison:
    - The trusted-state containment reading shows the same structural pattern at a different layer: correction quality improves when a worker receives an explicit authoritative state signal instead of attempting blind retry against ambiguous state.
    - The MCP lifecycle reading likewise serializes ownership transitions rather than allowing concurrent callers to infer safe ordering. Across all three objects, correctness comes from explicit state/admission boundaries more than from additional model reasoning.
  discussion:
    - A Digital Employee that can pause, receive human input, resume, call tools, and survive process boundaries needs a formal input-admission protocol. Treating late input as ordinary chat text obscures when it becomes authoritative and whether it has already been consumed.
    - Durable occurrence identity is structurally more important than content identity: two identical strings can be two legitimate user actions, while one action replayed twice must not become two admissions.
    - Guardrails belong at the admission boundary, before the next model call, because policy validation after mutation would make recovery ambiguous.
    - Checkpointing accepted model/tool progress is necessary but insufficient for external side effects. The runtime must pair admission identity with per-tool idempotency or transaction keys when execution crosses SDK ownership.
  research_judgment:
    - Digital Employee runtimes should model human/operator input as a governed admission event with durable occurrence identity, explicit acceptance state, policy validation, and checkpointed consumption evidence.
    - New input should not mutate an in-flight model request or tool execution. It should queue behind the current execution boundary and become authoritative only at a deterministic resume point.
    - Exactly-once claims must be scoped by ownership layer. Conversation admission can be exactly-once while external business actions remain at-least-once unless separately fenced or idempotent.
  engineering_impact:
    digital_employee:
      - Add an Input Admission Ledger with occurrence id, received-at, admitted-at, guardrail decision, consuming run/step, and final disposition.
      - Distinguish Received, Pending Admission, Admitted, Rejected/Recoverable, and Consumed rather than storing only chat history.
    codeflowmu:
      - Keep worker/run checkpoints and user/operator input as separate durable state until an explicit admission transition.
      - Propagate the admission occurrence id into tool-call idempotency keys where an external side effect can be retried after resume.
      - Expose admission/checkpoint events in the operation timeline so resume correctness is observable rather than inferred.
    tmpa:
      - Use the mechanism as research input for evidence-bearing custody/admission semantics; this single SDK implementation does not justify a protocol-level change by itself.
  limitations:
    - Evidence establishes intended SDK behavior and regression coverage, not distributed exactly-once execution under arbitrary crash/storage races.
    - The mechanism is not a cross-thread live message queue and does not permit safe mutation of an already-running model/tool call.
    - External side-effect correctness remains application-owned.
  future_questions:
    - What minimum event set should prove that one operator input was admitted exactly once across process restart?
    - Should input occurrence identity be propagated into every downstream tool action or only side-effecting calls?
    - How should expired, superseded, or withdrawn pending input be represented without erasing audit history?
```

## Research judgment

A resumable Digital Employee needs an **input admission boundary**, not merely persistent chat history. Late input becomes trustworthy only when a durable occurrence is policy-checked, admitted at a deterministic resume point, and linked to checkpointed execution evidence. This makes “received”, “accepted”, and “consumed” separately auditable and prevents resume semantics from silently duplicating operator intent.

## Evidence boundary

- `research/reading/Q-20260810-01-durable-runstate-pending-input.md`
- `research/reading/Q-20260810-02-trusted-state-cascade-containment.md`
- `research/reading/Q-20260810-03-mcp-lifecycle-serialization.md`
