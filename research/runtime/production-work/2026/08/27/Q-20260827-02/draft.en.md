---
schema: publication-candidate-article/v2
title: "Authority Context Must Be Minted by the Host"
date: '2026-08-27'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "智能体平台应如何把账户权限证据传给工具，同时避免请求方伪造、扩大或继续使用过期权限？"
summary: "A merged OpenAI Codex change demonstrates a bounded authority-evidence broker: the host removes caller copies, verifies current account access, injects context only when every capability predicate holds, and contracts unverifiable state to a non-authorizing result."
cover: staging/publication-candidates/2026-08-27-authority-context-must-be-host-minted-cover.png
sources:
  - research/analysis/Q-20260827-02-host-minted-capability-scoped-access-evidence.md
---

![Authority Context Must Be Minted by the Host cover](staging/publication-candidates/2026-08-27-authority-context-must-be-host-minted-cover.png)

# Authority Context Must Be Minted by the Host

If a tool call can attach metadata saying “I hold this entitlement,” and the platform accepts that metadata as authorization evidence, the requester becomes both claimant and beneficiary. A formal field name does not cure the circular authority path.

A merged OpenAI Codex maintainer change provides an inspectable counterexample. On a specific local plugin MCP path, the host does not trust caller-provided openai/entitlementContext. It removes that value, queries access state using the current ChatGPT account identity, and attaches a host-produced result only when several eligibility conditions all hold. Verification failure, account switching or invalid provider data contracts the result to unknown with empty grants.

The architectural conclusion is: **authority-bearing access context should be minted by the host that can verify the governing identity, should replace caller-supplied copies, and should cross only an explicitly qualified capability edge. Unverifiable state must collapse to a non-authorizing result, while correct downstream enforcement remains a separate obligation.**

## The requester cannot issue its own authority evidence

Identity and authorization data are often carried as ordinary request metadata, but their trust directions differ. Ordinary parameters describe what a caller wants. Authority evidence explains why the platform may allow it. When the latter comes from the caller, it has no source independent of the request it is supposed to justify.

The selected implementation removes the caller's entitlement field before producing either a verified or unknown host result. This simple ordering establishes the crucial boundary: a capability may express a need, but it may not mint the evidence that says it is entitled to exercise that need.

The host is appropriate not because “the host is trusted” is a sufficient slogan, but because it owns access to the current authentication channel, account identity and platform policy lookup. Authority context should therefore not be a freely forwarded dictionary. It is a derived fact with an issuer, identity version, verification window and operating scope.

## Capability scope is a conjunction, not a feature flag

The change does not use one broad switch to decide injection. The public implementation requires all of the following: the tool explicitly requests the entitlement; the server belongs to an installed or selected plugin; the environment is the local default; origin is stdio; the tool is annotated read-only; and arguments are absent or an empty object.

Each predicate answers a different question: who supplied the capability, which boundary carries the call, whether the action can mutate state, and whether the request shape remains inside the reviewed case. If one property changes, the original evidence should not silently widen to cover the new operation.

A restrictive conjunction can reject legitimate remote tools, parameterized reads or mutations. That is a functional cost, but the remedy is not silent predicate weakening. A new case needs a new contract that states its additional risk, authority source, argument constraints, audit record and failure semantics. Scope is part of authorization evidence, not a filter applied after injection.

## Identity continuity and failure semantics determine freshness

Users can switch accounts during a long-running session, and organization policy can change. Reading authority once at session creation can leave later calls carrying evidence for an identity that no longer governs them.

The public code bounds the lookup to 2.5 seconds, disables redirects, caps the response at 1 MiB, and checks account identity before and after the request. Unsupported authentication, request error, timeout, malformed or inconsistent data, and account switching all produce host-generated unknown with empty grants rather than falling back to a positive caller assertion.

The security value closes only when both directions agree. The producer must contract on uncertainty. The consumer must treat unknown and empty grants as non-authorizing. If a receiver interprets unknown as unrestricted or falls back to an unverified source, upstream fail-closed production no longer protects the decision.

## Better provenance is not complete authorization

The demonstrated mechanism supports a precise claim. On one Codex local plugin MCP path, the host produces entitlement context, strips caller copies, limits injection through multiple predicates, and contracts verification failure. Inspectable implementation and maintainer tests provide stronger mechanism evidence than a product claim alone.

It does not prove that every downstream plugin enforces the fields correctly. It does not prove that provider-side policy is correct. Nor does it turn advisory metadata into a credential, capability token or cryptographic proof. The mechanism is a narrow authority-evidence broker, not a complete authorization system.

An audit-ready implementation should answer at least four questions: who issued this context; which predicates qualified this call; which identity version and time window the lookup bound; and how the receiver interprets verified, unknown and empty grants. Only when those records form a reviewable chain does authority metadata stop being an unverified self-assertion under another name.

**Primary evidence:** [OpenAI Codex merged commit ae357e72](https://github.com/openai/codex/commit/ae357e7250402af7c3bbede18a46cc565a7670d4). The implementation and maintainer tests support the bounded host-minting, capability-scope and fail-closed mechanism; they are not independent validation of end-to-end authorization correctness.
