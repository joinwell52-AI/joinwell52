---
schema: "research-analysis/v1"
id: "AN-20260805-14"
date: "2026-08-05"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260805-14"
column: "open-source-engineering"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260805-14-guardrail-session-ordering.md"
output_contract: "Research Object"
research_object: "Guardrail-Gated Persistence State Machine"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Guardrail-Gated Persistence State Machine

## Governed scope

This object consumes only the completed Reading Result for `Q-20260805-14`. It analyzes the demonstrated persistence branches and their architectural implications. It does not inspect additional code, propose a patch, write publication copy, or authorize release.

## Analysis

```yaml
analysis:
  observations:
    - The read commit defers normal non-stream final-turn persistence until output guardrails complete.
    - Passing output is saved after guardrail execution; tripped output retains selected tool evidence while withholding the rejected assistant message.
    - Guardrail infrastructure errors and cancellation intentionally persist the completed final turn for replayability before re-raising.
    - Resumed turns use a persisted-item count to avoid duplicating already-saved tool items.
    - The tests demonstrate ordering and item-retention semantics in fake-model and SimpleListSession scenarios, not atomic transactions with external stores or tools.
  cross_comparison:
    - "Guardrails complete before save" is not equivalent to "only accepted output is durable": error and cancellation branches preserve otherwise undelivered output.
    - A blocked message is not a rolled-back turn because executed tool calls and outputs may remain durable and external side effects may already exist.
    - Replayability and acceptance-only persistence are competing requirements; one normal conversation log cannot express both cleanly without state typing or quarantine.
    - Compared with the other same-day Reading Results, this mechanism governs the persistence boundary; the verifier governs completion acceptance, and the router governs model choice. Persistence must preserve evidence from both without converting provisional or rejected content into accepted business truth.
  discussion:
    - The structural change is the introduction of an explicit finalization decision before normal session persistence.
    - The likely causal benefit is preventing a provisional assistant message from entering the ordinary durable session and later appearing as accepted output after a guardrail tripwire.
    - The helper and retained-item policy also reveal that a turn is not one atomic semantic unit: message content, reasoning, tool calls, tool outputs and side effects have different retention obligations.
    - A robust runtime therefore needs typed durable channels or states: accepted conversational output, retained execution evidence, quarantined rejected output and replayable error/cancellation state.
    - The code fix improves ordering but does not solve the atomic gap between guardrail decision, storage commit and external side effects.
  research_judgment:
    - Agent runtimes should model finalization as a state machine, not a single save operation.
    - The minimum states are Provisional, GuardrailEvaluated, Accepted, BlockedWithRetainedEvidence, QuarantinedError, CancelledReplayable and Persisted.
    - Accepted user-visible output and forensic replay evidence should be stored or projected separately so error recovery cannot masquerade as approved conversation history.
    - Every consequential tool effect requires an idempotency or effect-receipt contract independent of message persistence.
    - The demonstrated implementation is a useful engineering pattern, not a general exactly-once or transactional guarantee.
  uncertainty:
    - Confidence is high that pre-guardrail final-message persistence is unsafe.
    - Confidence is high that retained tool evidence and accepted message output require different semantics.
    - Confidence is medium that the same helper pattern transfers to distributed stores.
    - Confidence is low that persisted-item counts alone remain correct across concurrent writers, multi-process resume or corrupted state.
  counter_evidence:
    - Tests use SimpleListSession and fake models.
    - No atomic coupling with storage or external tools is demonstrated.
    - Tool side effects are not rolled back.
    - Error and cancellation intentionally preserve unaccepted final output for replayability.
    - The change is one SDK implementation fix, not a protocol specification.
  engineering_impact:
    tmpa:
      - No TMPA Core modification is justified.
      - Portable semantics may include distinction among accepted, blocked, quarantined and replayable evidence states, plus conflict and authority rules.
    digital_employee:
      - A Digital Employee must not equate a persisted model message with an accepted work result.
      - Operation Nodes need separate outcome, side-effect receipt, verifier decision and user-visible response states.
      - Recovery policy must state whether blocked or errored content is quarantined, retained for audit or visible to the worker.
    codeflowmu:
      - Add an explicit FinalizationDecision event before accepted-output projection.
      - Store retained tool/effect evidence separately from accepted conversational output.
      - Use operation idempotency keys and effect receipts so resume can suppress duplicate consequential actions.
      - Record guardrail result, exception/cancellation branch, retained-item policy and prior persisted-item cursor.
      - Treat replayability records as quarantined evidence until a recovery or acceptance gate resolves them.
      - Test streamed/non-streamed, fresh/resumed, tripwire/error/cancel and crash-between-decision-and-write matrices against the real persistence adapter.
  limitations:
    - No CodeFlowMu or production storage experiment has been run.
    - No concurrent-writer, multi-process or cross-device resume test exists in the consumed Reading Result.
    - No privacy analysis determines whether rejected content or reasoning may be retained.
    - No compensation mechanism is derived for already-executed external effects.
  future_questions:
    - What atomic or recoverable boundary can connect guardrail decision, accepted-output projection and effect receipt?
    - Which rejected items are legally or operationally necessary for audit, and where should they be quarantined?
    - How should the runtime recover when persistence succeeds but the external effect receipt is missing, or vice versa?
    - Can existing CodeFlowMu append-only events reconstruct finalization without a second mutable session state machine?
    - What invariant replaces an in-memory persisted-item count across distributed resumes?
```

## Research judgment

The Production-relevant object is:

> Run finalization as a typed persistence state machine. Keep accepted output, retained execution evidence and replayable/quarantined failure material distinct, and make external effects independently idempotent.

This judgment is bounded by the demonstrated SDK tests and explicitly does not claim atomicity or exactly-once execution.

## Production input

Production may consume this Research Object to explain why guardrail ordering is necessary but insufficient. It must retain the exception/cancellation qualification, the absence of rollback and the distinction between session persistence and external-effect safety.

## Evidence boundary

- `research/reading/Q-20260805-14-guardrail-session-ordering.md`

No other source was consumed by this Analysis object.
