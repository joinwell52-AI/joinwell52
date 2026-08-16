---
schema: publication-candidate-article/v2
title: "Durable Agent Approval Needs an Occurrence Boundary"
date: '2026-08-16'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "How should a durable agent runtime represent one human decision for one concrete tool-call occurrence when a broader sticky authorization default already exists?"
summary: "Durable approval is safer when a broad policy default and a narrow occurrence-scoped exception are persisted as different facts. Exact call identity can preserve one decision across resume, but it does not establish approver identity, policy provenance, or exactly-once external effects."
cover: staging/publication-candidates/2026-08-16-occurrence-scoped-authorization-cover.png
sources:
  - research/analysis/Q-20260816-01-occurrence-scoped-authorization-state.md
---

![Durable Agent Approval Needs an Occurrence Boundary cover](staging/publication-candidates/2026-08-16-occurrence-scoped-authorization-cover.png)

# Durable Agent Approval Needs an Occurrence Boundary

A durable agent can pause on a tool call, wait for a human decision, serialize its state, restart, and later continue. That continuity creates a deceptively simple question: what exactly did the human authorize?

A broad tool-level rule and a one-time exception are not the same fact. If a user approves one concrete invocation while a sticky default still rejects other calls of the same tool, changing the default would silently widen the human decision. A more precise model keeps the broad rule intact and records a narrow exception against the exact pending occurrence.

The 2026-08-16 Research Object examined a merged OpenAI Agents Python change in which exact approved or rejected call IDs are resolved before sticky defaults. Regression and serialization evidence show that an exact exception can survive resume together with the broader default, and that reversing an exact decision removes the opposite exact record rather than accumulating contradictory state. The evidence is bounded implementation evidence from maintainer code and tests; it is not an independent evaluation of enterprise authorization.

## A durable decision needs a narrow object

The first architectural benefit of occurrence-scoped state is scope control. A sticky policy such as “approve this tool” or “reject this tool” is intentionally reusable. An exact-call exception has a different meaning: “for this recorded occurrence, use this decision.”

That distinction matters most during recovery. If the exception disappears after restart, the resumed system may fall back to a broader rule and change the effective authorization. If the system rewrites the broad rule to preserve one exception, it may unintentionally affect sibling calls. Persisting both layers avoids those two failure modes.

The selected implementation also handles reversal explicitly. When an exact call changes from approved to rejected, or the reverse, the opposite exact entry is removed. This is a useful state invariant: one occurrence should not carry two contradictory terminal decisions at once.

But the exact call ID answers only one question: **which invocation is this decision about?** It does not establish who made the decision, whether that actor had authority, whether the call identifier is cryptographically trustworthy across trust domains, or whether the external effect happened exactly once.

## Separate the decision from the actor and the effect

For durable digital work, authorization is stronger when four facts remain separable:

**default policy → occurrence-scoped decision → actor/authority evidence → external-effect evidence**.

The default policy defines the reusable rule. The occurrence-scoped decision records a bounded exception for a concrete pending action. Actor and authority evidence explain who supplied that exception and under which policy or role. External-effect evidence records what actually happened after authorization.

These layers have different lifetimes and different proof requirements. A persisted approval can remain valid across a restart while the identity provider that authenticated the approver lives outside the agent SDK. Likewise, a correct authorization record does not prove that a payment, message, deployment, or other external side effect was executed exactly once.

This separation also makes audit records easier to interpret. “Approval restored from state” should not be conflated with “approver identity verified” or “effect completed.” A governance system can record all three, but it should not infer one from another.

For higher-risk tools, a durable exception should also be bound to an action fingerprint that can be rechecked on resume. Tool identity, arguments, tool version, and governing policy are plausible fingerprint inputs. If a material part changes, the safer behavior is to invalidate or re-admit the exception rather than replay an old decision onto changed work. That is an architectural interpretation from the Research Object, not a behavior established by the selected SDK patch.

## What this mechanism does not establish

The implementation evidence does not authenticate the approver. It does not establish role policy, cryptographic provenance, globally unique or unforgeable call identifiers, or finality of external effects. It also does not show that occurrence-scoped approval is the right complexity level for every workload.

A low-risk single-user agent may reasonably let the surrounding application own identity and authorization. In a tightly controlled environment, a stable call ID plus a durable exact decision may be sufficient if the tool arguments and policy cannot change between pause and resume.

The architectural lesson is therefore not “every agent must implement a full authorization stack.” It is narrower: **do not let one durable decision silently stand in for several different kinds of evidence**.

## Open questions for high-risk resumable actions

What actor, role, and policy evidence should be persisted beside a high-risk exact-call decision? Which fields should be immutable in an action fingerprint? How should an imported state prove that occurrence identifiers and approval records were not forged or replayed across trust domains?

Durability makes a decision resumable. It does not automatically make that decision authentic, authorized, or final. The occurrence boundary is the right place to preserve scope; the rest of the trust chain still needs its own evidence.
