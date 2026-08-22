---
schema: publication-candidate-article/v2
title: "Approval Must Name the Approver"
date: '2026-08-21'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "In agent systems where a human approval can be relayed through multiple transports, what evidence should establish approval authority without confusing the delivery channel with the approving principal?"
summary: "A transport can tell an agent system how an approval-shaped message arrived, but not who had authority to approve the exact action. A same-day Google ADK revert exposes why channel gating can be both overbroad and incomplete."
cover: staging/publication-candidates/2026-08-21-approval-must-name-approver-cover-v2.png
sources:
  - research/analysis/Q-20260821-02-principal-bound-approval-authority.md
---

![Approval Must Name the Approver cover](staging/publication-candidates/2026-08-21-approval-must-name-approver-cover-v2.png)

# Approval Must Name the Approver

A confirmation reaches an agent over A2A. Was it supplied by a peer trying to manufacture human consent, or by the legitimate operator whose decision happened to travel through that relay? A transport marker can distinguish the route. It cannot answer the authorization question.

Google ADK confronted this mismatch in a change merged on 2026-08-21. An earlier mitigation rejected tool confirmations whenever A2A metadata was present. The selected commit reverts that guard: it had blocked legitimate operator approval carried over A2A while leaving equivalent confirmation-shaped input reachable through other ingress, including HTTP paths described by the issue reporter. The underlying issue was explicitly reopened, and the shown confirmation path received no replacement principal identifier, signature, credential or verifier.

The useful conclusion is not that transport metadata has no security value. It is narrower: **human approval must bind an authenticated approving principal to the exact pending action. Transport provenance is supporting context, not authority.**

## A route is not an actor

The reverted mitigation used `a2a_metadata` as a trust proxy. Review had made the marker unconditional for A2A requests, even when protocol metadata was empty. Confirmation processing then returned early whenever the marker existed. The rule was deterministic and easy to test, but it classified the route rather than the person or service authorized to decide.

That difference produces two errors. A legitimate operator may use a local interface, a hosted relay or an A2A-served agent to send the same approval. Blocking the A2A route rejects the operator even when identity and policy would otherwise permit the action. Conversely, a non-operator may reach an accepted endpoint and construct user-role, confirmation-shaped input. Allowing the route does not make that actor authorized.

Protocol roles have the same limitation. A message labeled `user` expresses a semantic role in a conversation model. It does not prove that the sender is the human principal assigned to approve a particular tool call.

## The guard was both overbroad and incomplete

The selected revert restores functional confirmation flow by removing the A2A-marker early return. It also changes request conversion back so empty A2A metadata does not create a synthetic marker. Tests that expected A2A confirmations to be ignored were removed with the guard.

This is evidence of disciplined issue governance, not evidence that authorization is fixed. The maintainers explicitly reopened the underlying issue. The reporter's confused-deputy analysis and reproduction description remain primary issue evidence; this Research Center analysis did not independently execute the exploit. The state of every ADK deployment, authentication layer and exposed endpoint is also outside what the selected commit establishes.

The failure pattern is nevertheless general. A channel block can reduce one path in a threat model, but if the trusted action shape remains available through another ingress, it does not establish who approved. And if legitimate principals can use the blocked channel, the mitigation also removes valid functionality.

## Make approval a principal-bound object

A portable approval contract should preserve at least four bindings:

- authenticated evidence for the approving principal, carried or resolved end to end;
- stable identity for the exact pending tool call, parameters and expected effect;
- the scope or policy under which that principal may authorize the action;
- freshness evidence such as a nonce, expiry or session binding that prevents replay.

Transport remains useful in this record. It can contribute risk context, determine which verifier is required and support audit reconstruction. It simply cannot substitute for the principal field. Session, relay, protocol role and authorization policy should be recorded as separate facts.

This also constrains intermediaries. A relay may faithfully deliver an approval without gaining authority to synthesize a new one. That requires end-to-end attribution: the system verifies evidence tied to the original approver and pending action rather than trusting that any message emerging from the relay has inherited the operator's authority.

## The revert leaves the design open

The selected commit is a revert, not a replacement security mechanism. It demonstrates that the previous proxy answered the wrong question and that legitimate flow had to be restored. It does not reveal which principal representation ADK will use, how approval will bind to call parameters, or how replay will be prevented across local UI, A2A, HTTP and hosted relays.

Those gaps define the next regression matrix. Tests should distinguish forged role metadata from authenticated approval, alternate ingress from the same principal, replay from fresh consent and legitimate relay from authority delegation. Deployment guidance must also state which server endpoints authenticate callers and what protection `require_confirmation` can and cannot provide without principal binding.

An approval is not authoritative because it arrived through a favored channel or carries the right conversational role. It is authoritative only when the system can name and verify the approver, bind that authority to the precise pending effect and show that the decision is still fresh.

**Primary evidence:** [Google ADK revert commit 9a32eba1](https://github.com/google/adk-python/commit/9a32eba1e271981fd079bdee489b9159c6ecc72a), [issue #6461](https://github.com/google/adk-python/issues/6461), and [reverted PR #6462](https://github.com/google/adk-python/pull/6462). The issue's threat reproduction is reporter evidence and was not independently reproduced in this analysis.
