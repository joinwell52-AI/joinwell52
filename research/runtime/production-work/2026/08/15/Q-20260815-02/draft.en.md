---
schema: publication-candidate-article/v2
title: "Delegated Agent Work Needs a Return Contract, Not Just a Transport"
date: '2026-08-15'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "What must a multi-agent architecture make explicit so a delegated remote task can pause, resume, finish and return control without confusing transport termination with successful work?"
summary: "Reliable delegation needs two first-class contracts: a stable identity for the exact delegated occurrence and a semantic finish contract for what counts as successful completion. A recent ADK task-mode implementation demonstrates how one scope can span pause/resume recovery and terminal matching, while leaving interoperability, authorization and side-effect recovery as separate problems."
cover: staging/publication-candidates/2026-08-15-delegated-agent-return-contract-cover.png
sources:
  - research/analysis/Q-20260815-02-delegation-lifecycle-semantic-return-contract.md
  - research/reading/Q-20260815-02-native-a2a-task-delegation-finish-terminal-boundary.md
---

# Delegated Agent Work Needs a Return Contract, Not Just a Transport

Multi-agent delegation is easy to describe at the messaging layer: one agent sends work to another, waits, and later receives something back. The difficult part begins when the remote task can pause, resume, fail, be canceled, or survive long enough that the parent must reconstruct what is still active.

At that point, “the connection ended” is not a sufficient completion rule. A closed stream can mean success, failure, cancellation, timeout, or simple loss of contact. Reliable delegation therefore needs two different contracts: **which exact delegated occurrence is this?** and **what result is strong enough to close it successfully?**

The 2026-08-15 research object examined Google ADK task-mode implementation, documentation, and tests. The evidence is bounded maintainer evidence rather than an independent benchmark of multi-agent architectures. Within that scope, the implementation offers a coherent local answer: reuse one delegation identity through lifecycle recovery, then require explicit semantic finish evidence before control returns as success.

## One identity should survive the delegated lifecycle

In the selected mechanism, the coordinator FunctionCall identity becomes the isolation scope for the delegated task. The same scope is used to reconstruct delegated history, identify a paused active task, filter sibling activity, and find the matching terminal output.

That reuse matters. A lifecycle becomes harder to reason about when delegation start, pause state, resume state, terminal result, and parent correlation all invent unrelated identifiers. One stable occurrence identity creates a single answer to the question “which delegated job are we talking about?”

For a durable agent architecture, the general rule is straightforward: the occurrence identity that starts delegated work should survive pause/resume and remain attached to terminal evidence. New transport sessions may appear, but the business occurrence should not silently change identity because a connection was recreated.

## A semantic finish is stronger than end-of-stream

The second contract is about closure. The selected ADK mechanism uses an explicit `finish_task` FunctionResponse. Its output must satisfy the declared output schema. Validation errors remain non-terminal, while remote FAILED, CANCELED, and transport failures are mapped to failed terminal semantics before control returns to the parent.

This separation avoids a common ambiguity. Transport tells the parent whether a communication channel is still open. Semantic finish evidence tells the parent whether the delegated work produced the kind of result that the contract recognizes as completion.

A stream can stop without producing a valid result. Conversely, a valid result can be recorded before later transport noise appears. Treating the two as separate facts makes recovery more defensible.

Schema validation still has a boundary. It confirms that the result has the expected structure; it does not prove that the result is factually correct, current, authorized, or safe. The output schema is a return contract, not a truth oracle.

## Recovery should reason from closure evidence, not event recency

The selected Runner uses a two-pass recovery strategy. It first identifies scopes already closed by terminal finish evidence, then searches backward for the latest unresolved scope. That is stronger than assuming the newest event belongs to the newest active task.

Long-lived histories can contain events after a task has already completed. A single backward scan can therefore reopen something that is already closed. Explicit terminal evidence provides a lifecycle fact that can be evaluated independently of later history noise.

The transferable principle is that recovery should ask, “Which scopes have authoritative closure evidence?” before asking, “Which recent scope looks active?” Event recency is useful, but it should not override a durable terminal fact.

## Delegation needs both lifecycle and return semantics

A stronger delegated-work chain can be expressed as:

**delegation occurrence identity → scoped lifecycle → semantic terminal evidence → return of control**.

The occurrence identity prevents unrelated work from being merged. The scoped lifecycle allows pause and resume without losing the job. Semantic terminal evidence distinguishes success from transport termination. Return of control happens only after the terminal class is known.

This is particularly important when a parent agent may continue with different logic after success, failure, or cancellation. If all three collapse into “remote call ended,” the parent loses the information needed to make a governed next decision.

## Cross-framework composition requires more contracts

The selected mechanism remains specific to ADK. A custom remote server must implement compatible finish semantics. Output schemas are not automatically negotiated. The isolation scope is not a cryptographic trust boundary. Failure mapping does not compensate external effects that may already have occurred.

These limitations become important when delegation crosses framework or organizational boundaries. Two systems need to agree on at least four things before their local guarantees compose cleanly: occurrence identity, finish semantics, output schema, and authorization.

Without that agreement, both sides can be internally correct while disagreeing about whether the same job is active, complete, failed, or even addressed to the right authority.

## Architecture implications

For multi-agent systems, a delegated task should have a stable occurrence identity that survives recovery. Protocol transport status and business task status should be represented separately. Terminal evidence should close scopes explicitly. Failure and cancellation should return control without being rewritten as success. Compensation for already-produced side effects should remain a separate mechanism.

For small stateless calls, this machinery may be unnecessary; request/response semantics can be enough. The architectural overhead should match the lifecycle complexity and risk of the delegated work.

## Limits of the evidence

The evidence covers one ADK task-mode implementation and its tests and documentation. It does not establish cryptographic delegation identity, cross-framework semantic agreement, durable remote-state consistency, deadline or lease policy, or exactly-once delivery.

A schema-valid `finish_task` output is semantic terminal evidence inside the local contract. It is not independent proof that the underlying result is true, authorized, or free of external side effects.

## Open questions

How should a delegation occurrence identity be carried and authenticated across heterogeneous A2A implementations? Can finish semantics and output schemas be negotiated through agent metadata rather than manually mirrored? And what durable evidence is needed when the remote task has already created external effects but the parent never receives the final response?

The deeper lesson is that delegation is not complete when messages stop. It is complete only when the system can identify the exact delegated occurrence, classify its terminal meaning, and return control with evidence strong enough for the next decision.
