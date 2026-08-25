---
title: "Creation Provenance Should Survive Resume"
date: '2026-08-23'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "For durable agent work that can be created, forked and resumed, which provenance properties should remain stable across continuation, and which lifecycle transitions may establish a new local provenance identity?"
summary: "Creation source and derivation lineage answer different questions. A durable thread should preserve its origin across resume, while a fork may adopt a new local classification; neither field should be mistaken for authenticated authority."
sources:
  - research/analysis/Q-20260823-02-creation-provenance-continuity.md
item_id: "Q-20260823-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-23-creation-provenance-survives-resume-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-23-creation-provenance-survives-resume-cover-v2.png"
  kicker="Industry Architecture · Daily Research"
  title="Creation Provenance Should Survive Resume"
  summary="Creation source and derivation lineage answer different questions. A durable thread should preserve its origin across resume, while a fork may adopt a new local classification; neither field should be mistaken for authenticated authority."
  version="Q-20260823-02"
  status="Daily Runtime V5 · 2026-08-23"
  languageHref="/zh/industry/2026-08-23-creation-provenance-survives-resume"
  languageLabel="中文"
/>

# Creation Provenance Should Survive Resume

If a thread was created by an automated review feature last week, does it become “user work” because a different client resumes it today? If a fork starts a new specialized job, must it pretend to have the same local role as its parent? These are not naming details. They determine whether a durable execution history remains interpretable after repeated lifecycle transitions.

A Codex change merged on 2026-08-23 makes one design explicit. New exec threads persist a source classification. A fork can carry its own source while retaining parent lineage. The inspected TypeScript resume path deliberately does not forward a new `threadSource` when a `threadId` already exists. Together, those behaviors support a two-axis model: **creation source should remain stable through continuation, while derivation is recorded separately from the new object's local classification.**

The result improves provenance, not authorization. The source can be an application-selected string, so persistence does not authenticate whoever or whatever supplied it.

## Resume should not relabel origin

Resume re-enters an existing durable work identity. If every caller can replace the source from its current defaults, provenance becomes a report about the latest invocation rather than the object's creation event. The same thread could appear to change origin whenever a new SDK, feature or operator continues it.

The Codex protocol represents `User`, `Subagent`, `Feature(String)` and `MemoryConsolidation`. A new exec thread receives the chosen classification, defaulting to `User` when none is provided. In the TypeScript SDK, however, the source flag is added only when no existing thread ID is present. A regression passes a deliberately conflicting value during resume and verifies that it is not forwarded.

This is a continuation invariant at one documented handoff. It does not establish absolute immutability across every lower-level app-server route. Still, it locates the right default: continuing an object should not rewrite how the object began.

Operationally, durable systems should declare which metadata belongs to creation and which may change during continuation. A field with no lifecycle scope is eventually governed by whichever caller writes last.

## Fork creates a second provenance axis

Fork is not resume. It creates a new durable object derived from an existing one. The merged tests show a source thread with one classification and a fork with another, while `forked_from_id` and history-base metadata retain the parent relationship.

That separation avoids forcing two questions into one label:

- What local role or producer created this object?
- From which earlier object and history was it derived?

A fork used for an automated review can truthfully identify that local purpose even when its parent began as user work. Parent lineage preserves the derivation. Copying only the parent's source would hide the fork's role; replacing lineage with the new source would hide its ancestry.

This pattern generalizes to durable jobs, agent sessions and replayable workflows. Continuation-stable metadata and derivation metadata should be modeled as different facts, with explicit transitions for creation, resume, fork and any later governed repair.

## A durable label still needs a trust binding

Codex accepts arbitrary non-reserved strings as `Feature(String)`. That openness is useful for product provenance, but it means the label is application-controlled. A caller allowed to create a thread can select a feature name; the field does not prove that the caller is that feature, that a human approved it or that a policy grants it special access.

Security-sensitive decisions therefore need another binding: an authenticated principal, an attested producer, a policy decision or a signed event that states how much trust the provenance deserves. Source classification can help select records, reconstruct history and route telemetry. It should remain informational until that independent evidence exists.

The same separation applies to persistence. A label surviving resume is not an immutable audit ledger. Retention, tamper resistance and governed correction require explicit mechanisms. Durability answers whether the value remains available, not whether the value was truthful or authorized.

## Compatibility defaults are interpretations

Missing historical source is interpreted as `User` for backward compatibility. That is practical for code paths expecting a value, but it is not direct evidence that a user created every historical thread. Analytics or audit systems should be able to distinguish “recorded as User at creation” from “source absent, interpreted as User by compatibility policy.”

Correction needs the same discipline. An administrator may legitimately repair a wrong creation label, but overwriting it without recording who changed what and why destroys the evidence needed to evaluate the correction. A repairable field can still be continuation-stable if repair is an explicit governed transition rather than ordinary resume behavior.

The architecture test is concise: for every durable metadata field, specify whether it is creation-scoped, continuation-stable, derivation-scoped or administratively repairable. Then state the trust evidence required before that field participates in authorization. Without those declarations, provenance will drift toward convenience, and convenience will eventually be mistaken for authority.

**Primary evidence:** [OpenAI Codex merged commit a73485dc](https://github.com/openai/codex/commit/a73485dc76e5b2d31d28109a57f6876f4e1dcc24). The code and tests support the scoped create, fork and TypeScript resume behavior described here; they do not independently validate a universal provenance or authorization model.
