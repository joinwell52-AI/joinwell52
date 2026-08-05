---
schema: "publication-candidate-article/v1"
date: "2026-08-05"
column: "open-source-engineering"
item_id: "Q-20260805-14"
lifecycle: "Publication Candidate"
source_research_object: "research/analysis/Q-20260805-14-guardrail-session-ordering.md"
source_reading_result: "research/reading/Q-20260805-14-guardrail-session-ordering.md"
visualization: "staging/publication-candidates/2026-08-05-guardrail-persistence-state-machine.svg"
visualization_decision: "Required — architecture diagram included"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: false
---

# Guardrails Need a Persistence State Machine, Not a Later Save Call

Deferring final-message persistence until guardrails complete is necessary, but accepted output, retained tool evidence and replayable failure material still need different durable states.

## Core judgment

Finalization is a typed state machine, not one save operation.

## Why this is not a point feature

A blocked assistant message does not imply a rolled-back turn: tool calls, tool outputs and external effects may already exist. Error and cancellation paths may intentionally retain otherwise undelivered output for replayability. One undifferentiated conversation log cannot safely represent accepted truth and forensic evidence at the same time.

## Minimum deployable architecture

Model Provisional, GuardrailEvaluated, Accepted, BlockedWithRetainedEvidence, QuarantinedError, CancelledReplayable and Persisted states. Store accepted output separately from retained execution evidence. Give every consequential external effect an idempotency key and effect receipt independent of message persistence.

## Boundaries and counter-evidence

The demonstrated tests use fake models and a simple list session. They do not prove atomic storage, rollback, exactly-once effects, concurrent-writer safety or correctness across distributed resume.

## Engineering conclusion

Introduce an explicit FinalizationDecision before accepted-output projection, quarantine replay evidence, and test crash boundaries against the real persistence adapter and effect system.

## Visualization note

The diagram represents control boundaries and state relationships. It does not present experimental results or invent quantitative comparisons absent from the Research Object.

## Evidence and citations

1. [Research Object](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260805-14-guardrail-session-ordering.md): the sole analytical input, including judgments, uncertainty, counter-evidence and engineering implications.
2. [Reading Result](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260805-14-guardrail-session-ordering.md): the evidence boundary and source-trace record behind the Research Object.

> Editing status: bilingual structure, evidence checks, qualification preservation, title and column consistency are complete; this candidate is not published.
