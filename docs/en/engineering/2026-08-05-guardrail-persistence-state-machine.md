---
title: "Guardrails Need a Persistence State Machine, Not a Later Save Call"
date: '2026-08-05'
column: open-source-engineering
category: daily
summary: "Deferring final-message persistence until guardrails complete is necessary, but accepted output, retained tool evidence and replayable failure material still need different durable states."
item_id: Q-20260805-14
source_research_object: "research/analysis/Q-20260805-14-guardrail-session-ordering.md"
source_reading_result: "research/reading/Q-20260805-14-guardrail-session-ordering.md"
lifecycle: Published
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
outline: deep
---

<ArticleCover
  image="/assets/covers/daily-2026-08-05-guardrail-persistence-state-machine.svg"
  kicker="Open-source Engineering · Daily Research"
  title="Guardrails Need a Persistence State Machine, Not a Later Save Call"
  summary="Deferring final-message persistence until guardrails complete is necessary, but accepted output, retained tool evidence and replayable failure material still need different durable states."
  version="Q-20260805-14"
  status="Daily Runtime V5 · 2026-08-05"
  languageHref="/zh/engineering/2026-08-05-guardrail-persistence-state-machine"
  languageLabel="中文"
/>

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
