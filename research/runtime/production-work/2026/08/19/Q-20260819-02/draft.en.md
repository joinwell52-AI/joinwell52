---
schema: publication-candidate-article/v2
title: "User Delivery Is Not Model Reasoning Context"
date: '2026-08-19'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "How should a long-running agent system separate user-visible progress delivery from model reasoning context while preserving replayable delivery evidence?"
summary: "A user receiving a progress update does not mean the next model request should ingest the same text as synthetic assistant history. A same-day Codex change demonstrates a bounded mechanism: an asynchronous message remains a typed delivery record in protocol and history paths while its visible text is excluded from the next model context."
cover: staging/publication-candidates/2026-08-19-delivery-context-separation-cover.png
sources:
  - research/analysis/Q-20260819-02-delivery-context-separation.md
---

![User Delivery Is Not Model Reasoning Context cover](staging/publication-candidates/2026-08-19-delivery-context-separation-cover.png)

# User Delivery Is Not Model Reasoning Context

A long-running agent may need to tell the user, “The first stage is complete; I am continuing.” That message belongs in the user-visible history and may need to be auditable. But must the next model request read the same text as a synthetic assistant message? The answer is not automatically yes.

A Codex change merged on 2026-08-19 separates those questions. The new `send_user_message_async` tool is root-only and gated by feature state and model support. A valid call creates a typed `AgentMessage` item classified with `delivery=Async`, waits for local `ItemStarted` and `ItemCompleted` emission, returns `accepted=true` to the model, and lets the current turn continue. Integration tests also show that the visible text is not reinserted into the next model request as a synthetic assistant message. Protocol, app-server and thread-history paths still preserve the delivery classification.

The evidence supports an architectural conclusion: **the user-delivery plane and the model reasoning-context plane should be separate, but correlated through stable message identity and replayable metadata.**

## What the user saw is not the same as what the model reasoned over

User delivery records a communication fact: what the runtime attempted to show, to whom, when and through which delivery class. Model context records a reasoning fact: which information was intentionally admitted into a subsequent model request and could influence the next decision.

Collapsing both into one transcript creates errors in both directions. If every user-visible progress message automatically enters model context, runtime-authored updates may be misread as part of the model's earlier reasoning, consume context and encourage repetition. If the system avoids that pollution by discarding the message entirely, it loses replayable evidence of what the user was told.

Separate planes do not mean no history. They mean that history has more than one semantic role. A delivery record can remain durable without being interpreted as the next turn's model input.

## Local acceptance is not external delivery evidence

The `accepted=true` result in the same-day change has a narrow meaning: the handler accepted the call and completed the tested local item lifecycle emission. It is not an external transport receipt. It does not show that a user's device displayed the message, that the user acknowledged it, or that failed delivery will be retried.

That distinction matters to automated recovery. If a local tool success is recorded as “delivered,” monitoring and reconciliation begin from a false fact. A stronger state model separates at least:

- the tool call was accepted locally;
- the typed message item was emitted by the runtime;
- an external transport accepted it;
- a target client acknowledged it;
- the user read it, if such evidence exists and is appropriate to collect.

The current code directly supports bounded evidence for the first two and preserves a delivery classification. The later stages need their own protocols and receipts.

## Correlate with identity, not copied text

Once the planes are separate, the system still needs to connect a visible message to the work it described. A reusable design gives the message a stable identity and lets runtime items, transport attempts, client receipts and thread history refer to that identity.

An auditor can then reconstruct what the system told the user without implying that the model later reasoned over the same text. If later work genuinely needs the fact “the user received the first-stage result,” an explicit workflow-state or memory mechanism can admit that fact into context with provenance and scope. Accidental transcript echo is not the only way to preserve continuity.

The separation also helps compaction and recovery. Reasoning context can be trimmed according to model needs, while the delivery ledger follows audit and replay requirements. Identity links the records without forcing them to share the same retention policy.

## Separate planes do not create a reliable messaging system by themselves

The evidence comes from one merged implementation and its repository integration tests, not an independent study of end-to-end notification reliability. The demonstrated ordering is local to the handler, event and next-model-request path.

It does not establish global ordering across clients, cancellation, idempotent duplicate suppression, automatic retry, final user acknowledgement or exactly-once delivery. Typed history materialization also does not prove indefinite crash durability in every failure mode.

The correct boundary is therefore important. Context separation solves a semantic and evidence problem; reliable transport still requires its own state machine, receipts and recovery policy.

The remaining engineering questions belong in verifiable interfaces. Which component owns the final user-delivery receipt? How do retries retain the original message identity and suppress duplicates? When later reasoning truly needs a delivered fact, who may write it into memory or workflow state? An agent runtime can report progress without corrupting reasoning history only when those responsibilities remain explicit.

**Primary evidence:** [OpenAI Codex merged commit 71dbf72b](https://github.com/openai/codex/commit/71dbf72b0576f9e7be1ef28d275bc79ece6d4b6c). The code and repository tests are public primary-source evidence; they are not independent validation of end-to-end delivery reliability.
