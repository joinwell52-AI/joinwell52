---
schema: publication-candidate-article/v2
title: "OAuth Refresh Can Succeed Before Persistence Fails"
date: '2026-08-19'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "What state should an OAuth client expose when the authorization server has issued refreshed credentials but local durable persistence fails afterward?"
summary: "Remote refresh success and local persistence failure can both be true. A same-day MCP TypeScript SDK change separates them from one catch path and keeps the storage fault visible. That preserves evidence needed for recovery, but it does not provide rollback or distributed atomicity."
cover: staging/publication-candidates/2026-08-19-oauth-refresh-split-commit-cover-v2.png
sources:
  - research/analysis/Q-20260819-03-oauth-refresh-split-commit.md
---

![OAuth Refresh Can Succeed Before Persistence Fails cover](staging/publication-candidates/2026-08-19-oauth-refresh-split-commit-cover-v2.png)

# OAuth Refresh Can Succeed Before Persistence Fails

The authorization server has returned a new access token and refresh token. The client then attempts to save them and receives “disk full.” Did authentication succeed or fail?

A single boolean answer loses the most important fact. Remote authority may have advanced while local durable state did not. Classifying that condition as an ordinary refresh failure and automatically redirecting to authorization is not only inaccurate; under some token-rotation policies it can hide a credential break that is difficult to recover.

A change merged into the MCP TypeScript SDK on 2026-08-19 corrects this boundary. Before the change, `refreshAuthorization` and `provider.saveTokens` shared a `catch` path, allowing selected exceptions to fall through to a new authorization request. After the change, only the remote refresh call remains inside the guarded refresh block. `saveTokens` runs after remote success, and its rejection propagates. A regression test obtains fresh tokens, forces persistence to fail with “disk full,” expects authentication to reject with that same error, and verifies that authorization redirect is not called.

The evidence supports a bounded reliability conclusion: **when remote issuance and local persistence are separate operations, OAuth refresh is a split-commit workflow. Local failure after remote success is partial success and must remain visible.**

## The two operations commit in different authority planes

The remote exchange changes the credential state recognized by the authorization server. Local persistence determines whether the client can recover those credentials after a crash, restart or later request.

They happen in sequence but do not share an atomic commit. Once the remote call returns success, the server has completed its side of the operation. A later storage failure cannot make that remote success un-happen. If the server rotates refresh tokens, the previously stored token may no longer be usable.

The resulting state is not simply “authentication failed.” It is a mismatch between commit points: remote committed, local not durably committed. Safe recovery must begin from that state fact.

## The catch boundary is part of the reliability model

Exception handling often looks like implementation cleanup, but here the scope of a `catch` determines whether the system can preserve which side succeeded.

When remote exchange and local storage share one failure branch, a `saveTokens` rejection may be handled as a refresh error. The system sees only that “something failed during refresh,” rather than “new credentials exist but were not made durable.” An automatic authorization redirect can then cover the partial state with a new flow.

The same-day change preserves the semantic boundary. Refresh-request failures retain refresh-specific handling. Persistence failure propagates as persistence failure. The regression test demonstrates that the tested storage fault no longer silently becomes a redirect.

This is more than a better error string. It preserves the evidence classification needed for recovery decisions.

## Visibility is a prerequisite for recovery, not recovery itself

Propagating the storage error lets the caller know that remote exchange succeeded but local durability was not established. The caller can then choose a bounded retry, switch to safe storage, stop and alert an operator, or enter explicit reconciliation according to deployment policy.

Visibility does not repair the split state by itself. The current change adds no automatic persistence retry and defines no standard recovery object carrying the fresh credentials. If a token provider can partially write, the caller still needs to know whether the operation was atomic, merely accepted or durably committed.

A stronger provider contract could advertise:

- atomic replacement support;
- whether success includes durable acknowledgement;
- whether retry after failure is safe;
- whether partial writes are possible;
- which non-secret state evidence recovery requires.

Those capabilities cannot be inferred universally from a method named `saveTokens`.

## Error propagation is not transactionality

The evidence comes from one merged SDK change and repository tests, not an independent OAuth reliability benchmark. Server-side consequences depend on the authorization server's policy; refresh-token rotation is not universal.

The change does not create a distributed transaction between the authorization server and local storage. It cannot roll back server issuance and does not guarantee exactly-once persistence. Even if the local provider performs an atomic replace, the remote and local systems still do not share one commit protocol.

The accurate conclusion is narrower: the fault is correctly classified and remains visible, so safe recovery has the evidence it needs. Rollback, retry, coordination and operator handling still require separate design.

The remaining questions belong in interface contracts rather than operational guesswork. Should the SDK expose a structured partial-success error recording that remote issuance completed while local durability failed? How can token providers advertise atomicity, durable acknowledgement and safe-retry capability in machine-readable form? How should headless deployments alert operators before the next restart reveals that credentials were never persisted? Recovery can start from reality only when “which side committed?” is a first-class fact.

**Primary evidence:** [MCP TypeScript SDK merged commit 3924de99](https://github.com/modelcontextprotocol/typescript-sdk/commit/3924de99df834302d89f5997a1b64ca268282284). The code and repository tests are public primary-source evidence; they are not independent validation of distributed transactionality, rollback or universal token-rotation behavior.
