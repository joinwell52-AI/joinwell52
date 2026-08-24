---
schema: publication-candidate-article/v2
title: "A Repeated Failure Is Not New Evidence"
date: '2026-08-24'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "When an agent runtime observes several terminal conditions asynchronously, how should it prevent a generic condition from being regenerated later and erasing more specific safety evidence?"
summary: "A merged OpenAI Agents Python fix shows why terminal conditions need consumption state, not last-writer exception storage. Preserving a guardrail tripwire through final cleanup improves error fidelity but does not define every priority or protect external effects."
cover: staging/publication-candidates/2026-08-24-repeated-failure-not-new-evidence-cover.png
sources:
  - research/analysis/Q-20260824-01-terminal-condition-consumption-precedence.md
---

![A Repeated Failure Is Not New Evidence cover](staging/publication-candidates/2026-08-24-repeated-failure-not-new-evidence-cover.png)

# A Repeated Failure Is Not New Evidence

A streaming agent exceeds its turn limit while an input guardrail is still resolving. The runtime first records the generic limit failure, then captures the guardrail tripwire. During final cleanup, however, it evaluates the same turn limit again and overwrites the safety exception. The last write wins—even though it contains older, less specific information.

An OpenAI Agents Python change merged on 2026-08-24 fixes that race by setting `_max_turns_handled = True` when the default `MaxTurnsExceeded` is first stored. A deterministic regression forces the turn-limit condition to happen before the guardrail resolves and still verifies that the caller receives `InputGuardrailTripwireTriggered`.

The broader lesson is bounded but important: **condition recurrence is not new evidence.** Once a generic terminal condition has participated in arbitration, replaying it during finalization should not erase more specific safety evidence observed afterward. This stabilizes the surfaced exception; it does not create a universal priority hierarchy or undo external effects.

## Last-writer storage confuses time with meaning

One mutable exception slot is easy to implement. Every checker writes the error it sees, and the final value is raised. Under concurrency, that simplicity gives late execution paths semantic power they may not deserve. Cleanup can recreate a condition already considered and make it look like a new outcome.

In the selected streaming path, `_check_errors()` examines max-turn state before draining completed input-guardrail results. When both are visible in one check, the max-turn candidate is stored first and the tripwire later. That ordering is deliberate enough to surface the safety event. Before the patch, the final `_check_errors()` could recreate the turn-limit exception because the condition had never been marked handled.

The defect is therefore not only exception selection. It is condition lifecycle: an observed and materialized predicate remained repeatable. Its second appearance carried no new fact, yet last-writer storage treated it as fresh authority.

## Consumption state makes the narrow rule explicit

Setting the handled flag at first materialization converts max turns from a repeatable predicate into a consumed fact. The runtime still knows the limit was exceeded, but that particular condition cannot re-enter arbitration merely because another cleanup phase evaluates the same state.

This is not the same as saying guardrails always outrank limits. The regression proves one scoped rule: after the generic limit candidate has been consumed, its replay cannot clobber the later input-guardrail tripwire. A different runtime could define a different policy, but the policy should be explicit rather than an accident of finalization order.

The regression's `asyncio.Event` is as important as the one-line state transition. It synchronizes the guardrail on the causal boundary where max turns has actually been established. Timing sleeps might pass or fail with scheduler load; causal synchronization proves the intended ordering deterministically.

## Preserve facts separately from the surfaced outcome

A caller may need one exception, while operators need the complete set of facts. The turn limit was exceeded. The input guardrail tripped. One condition was consumed. One exception was surfaced. These are related but not interchangeable records.

A more general arbitration model could store observed terminal conditions as structured entries with identity, observation time, consumption state and policy precedence. It could then select a caller-visible outcome without deleting the others from telemetry. Such a model becomes useful as output guardrails, tool guardrails, cancellation and run-loop failures join the race.

The selected patch does not implement that full structure. Handled flags may remain the right low-cost choice for a small number of conditions. The architectural requirement is narrower: do not let a repeat evaluation masquerade as new evidence, and do not erase concurrent facts simply because the API surfaces one exception.

## Exception fidelity is not effect safety

Surfacing the guardrail tripwire tells the caller which safety condition won this arbitration. It says nothing about tool calls or external effects that may have started before the tripwire became visible. No rollback, compensation or transaction protocol follows from preserving the exception slot.

That boundary matters for digital employees. A runtime should record terminal-condition observation, arbitration and external-effect state independently. If an action already crossed an external boundary, effect receipts and reconciliation—not exception precedence—must establish what happened.

The next tests should cover causal races among input, output and tool guardrails, cancellation, run-loop failures and limits. They should also assert that telemetry retains all observed facts. Until such evidence exists, the defensible claim remains specific: the demonstrated max-turn replay no longer erases the input-guardrail tripwire during final streaming cleanup.

**Primary evidence:** [OpenAI Agents Python merged commit 1a55d70d](https://github.com/openai/openai-agents-python/commit/1a55d70d8e28769bd2c3eb85eaf6fe501864ced8). The implementation and regression support this bounded precedence repair; they are not independent proof of a universal exception hierarchy or external-effect safety.
