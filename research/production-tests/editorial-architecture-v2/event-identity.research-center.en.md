---
schema: publication-candidate-article/v2
title: "Stable Event Identity Is a Reconciliation Primitive, Not Exactly-Once Delivery"
date: "2026-08-11"
column: open-source-engineering
category: daily
article_type: technical-analysis
edition: research-center
research_question: "What does a stable event identity guarantee across asynchronous retries, and what does it leave unproven?"
summary: "Reusing one occurrence identity across retries improves reconciliation without proving lossless or exactly-once execution."
---

# Stable Event Identity Is a Reconciliation Primitive, Not Exactly-Once Delivery

## One identity, several delivery attempts

A merged analytics implementation assigns an event identifier before asynchronous handoff and reuses that identifier when delivery is retried. This preserves the identity of the logical occurrence even when the transport makes several physical attempts. Consumers can reconcile duplicates around one occurrence, but the identifier alone does not prevent duplicate rows or duplicate external side effects.

Typed terminal events add a second property: the same logical execution can close with explicit success or error evidence. Progressive telemetry and terminal outcome should remain different evidence classes.

## Where the implementation evidence stops

The implementation describes bounded retry exhaustion, offset conflict, stream desynchronization, and possible row loss. Its local offset state is not demonstrated as restart-safe. Those limits matter because an occurrence identity does not create a lossless transport, and transport deduplication does not create exactly-once business execution.

The evidence is a merged third-party implementation and its tests. It supports the documented mechanism; it does not independently validate a universal runtime rule.

## A mechanism still needing tests

Crash tests are still needed between identifier allocation, enqueue, physical send, provider acceptance, and terminal-event persistence. A useful next experiment would keep logical occurrence identity, delivery-attempt identity, and business-transaction identity separate, then test which ambiguity survives each crash point.

Sources: merged Google ADK commit and the 2026-08-11 Research Object.
