---
schema: publication-candidate-article/v2
title: "A Dynamic Integration Needs Five Boundaries, Not One Permission Switch"
date: '2026-08-13'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "How should an extensible tool runtime keep a dynamic local integration bounded and reviewable?"
summary: "A local helper that produces dynamic MCP HTTP headers is governed across scope, ownership, lifetime, resource use and observability. The useful pattern is not the helper itself, but treating dynamic integration as an explicit extension point with several independent boundaries."
sources: "research/analysis/Q-20260813-03-extension-boundary.md"
cover: "staging/publication-candidates/2026-08-13-bounded-extension-point-cover.svg"
---

![A luminous integration core is held inside five distinct translucent boundaries, suggesting that extensibility is admitted only through several independent constraints](staging/publication-candidates/2026-08-13-bounded-extension-point-cover.svg)

# A Dynamic Integration Needs Five Boundaries, Not One Permission Switch

An extensible tool runtime often begins with a small request: run one local helper and use its output to decorate outbound requests. The code may look like configuration glue. The security and reliability surface is much larger.

The selected Codex implementation allows a local helper to supply dynamic HTTP headers for a streamable-HTTP MCP connection. Around that capability it establishes several separate controls: local-context admission, managed-policy checks, origin scoping, reserved-header ownership, bounded execution, process cleanup, cached materialization, redirect stopping and redacted inspection.

The important engineering lesson is not “shell helpers are safe.” The evidence does not support that claim. It is that a dynamic integration should be represented as an **explicitly bounded extension point**, not as an ordinary string-valued setting protected by one allow/deny switch.

## One feature crosses several trust domains

The helper sits between local process execution and remote HTTP traffic. It can consume local environment and working-directory context, produce values that may be sensitive, influence network requests, interact with OAuth startup, and leave behind child processes if cancellation is poorly handled.

Each part of that path asks a different governance question:

- **Scope:** where is the extension allowed to run and where may its output apply?
- **Ownership:** which request fields belong to the helper, and which remain owned by OAuth or MCP?
- **Lifetime:** when is the helper evaluated, cached, refreshed or discarded?
- **Resource bounds:** how long may it run, how much output may it produce, and what happens to child work?
- **Observability:** what may operators inspect without exposing the command or returned secrets?

Treating all five as one boolean would hide the difference between “the integration is configured,” “the helper may execute here,” and “this particular request may carry the resolved output.”

The source-backed basis is [OpenAI Codex commit `379cb68`](https://github.com/openai/codex/commit/379cb68444057c721b6c8fa0bd610b7c6ecb9824) and [PR #38245](https://github.com/openai/codex/pull/38245), as captured in the same-day Reading Result and Research Object. These are public primary-source implementation records; they do not independently validate every deployment of a local helper.

## Scope: local admission is narrower than configuration presence

The field is accepted only for streamable-HTTP MCP configuration. Stdio configuration rejects it, and pairing it with a non-local environment ID is rejected during parsing. Runtime application adds another check: a managed-disabled server or a server that is not effectively local does not run the helper.

That layered decision is useful. Parsing validates the declared shape; runtime policy validates the effective context. Neither should be mistaken for the other.

The output is also origin-scoped. Helper headers apply only when the request URL has the same origin as the configured MCP server. Cross-origin requests pass through without the helper output. For requests using helper headers, redirects are stopped so a later hop cannot silently carry the values elsewhere.

Scope is therefore more than “local process.” It includes the configuration kind, effective environment, managed policy, destination origin and redirect behavior.

## Ownership: an extension may supplement a protocol without taking it over

Dynamic headers can replace same-name configured non-reserved headers, but they cannot claim protocol- or authentication-owned fields such as `Authorization`, `Host`, `Content-Type` or `Mcp-Session-Id`. The helper output must be a JSON object of string keys and values; duplicate, case-insensitive duplicate, invalid and reserved names are rejected.

This is a strong ownership boundary. The extension can supply gateway-specific material while OAuth remains responsible for its own authorization header and MCP retains its session and transport fields.

Without this separation, “custom headers” becomes an authority-escalation surface. A helper intended to add one gateway token could replace the protocol's authentication, forge a session identifier or alter content interpretation. Ownership rules make the extension additive rather than sovereign.

## Lifetime: caching is a contract, including cached failure

The helper result is represented as a shared future. Concurrent requests in one provider context share a single execution. Success is cached, and failure is cached as well. A later request does not silently rerun a helper that already failed.

This avoids per-request process churn and inconsistent credentials within one connection context. It also creates an explicit limitation: the implementation does not refresh the helper output after a 401 or 403, because those statuses may belong to OAuth challenges and reconnecting can discard MCP session state.

Caching is not merely an optimization. It defines the credential and failure lifetime. A production contract should make that lifetime inspectable and decide how deliberate refresh differs from automatic retry.

## Resource bounds: cancellation must own the process tree

The helper has a ten-second execution limit and a 64 KiB stdout limit. It starts with a cleared environment, receives only the repository's permitted MCP subprocess environment, and runs in a resolved local working directory. On Unix it uses its own process group; on Windows it is placed in a containment job. Dropping the helper process terminates contained work instead of leaving it detached.

These mechanisms do not prove that an arbitrary configured command is trustworthy. They narrow the damage and lifecycle ambiguity of executing it. Timeout without process-tree ownership would still allow a grandchild to survive; output validation without an output bound would still expose memory pressure; environment clearing without destination scope would still allow network leakage.

The controls work as a set because they cover different failure modes.

## Observability: show the state without revealing the secret path

CLI inspection renders the configured helper command as `<redacted>`. Validation errors reject invalid values without echoing secret content. At the same time, over-redaction can make operations impossible to diagnose.

A reviewable design should expose non-sensitive facts such as whether a helper is configured, whether it was admitted, whether resolution succeeded, when the cached result was established, which destination scope applies, and which bounded failure class occurred. It should not print the command text or returned header values by default.

The selected source does not provide a durable audit model. That gap is important. Redaction protects ordinary inspection, while auditability asks how to retain enough evidence to explain a failure later without persisting credentials.

## Five boundaries form one extension contract

The reusable pattern is a contract with independent fields rather than a single `enabled` bit:

1. **Scope declaration:** transport, local/remote context, managed-policy decision and destination origin.
2. **Ownership declaration:** fields the extension may supply and fields reserved to the host protocol.
3. **Lifetime declaration:** evaluation moment, cache scope, refresh policy and failure reuse.
4. **Resource declaration:** timeout, output limit, environment, working directory and cleanup ownership.
5. **Observability declaration:** safe status, redaction rules and audit metadata.

These fields make design review more precise. A reviewer can approve origin scoping while rejecting an unbounded refresh policy, or accept process containment while requiring a structured executable/argument form instead of one shell command string.

## What the implementation does not establish

The evidence covers one local streamable-HTTP MCP path. It does not establish a universal credential-injection protocol, remote-environment safety, durable auditability or trustworthiness of arbitrary helpers. The command may remain visible through local process or configuration inspection even though CLI output is redacted. Cached values can expire, and the source intentionally has no rejection-driven refresh.

The bounded conclusion is therefore architectural: dynamic integrations should expose separate scope, ownership, lifetime, resource and observability boundaries. Whether a particular integration is safe still depends on the helper, host policy, deployment and threat model.

## Open engineering questions

- What explicit, session-preserving refresh event should replace automatic rerun after 401/403?
- Which non-sensitive execution facts should become durable audit evidence?
- Can a structured executable-and-arguments declaration reduce shell ambiguity without losing deployment flexibility?
- What proof should be required before allowing safe same-origin redirects?

Extensibility becomes reviewable when those questions have named places in the contract. A permission switch can open the door; it cannot describe the room, the owner, the clock, the budget or the audit trail.

### References

- [OpenAI Codex commit `379cb684`: constrained dynamic MCP HTTP-header helper](https://github.com/openai/codex/commit/379cb68444057c721b6c8fa0bd610b7c6ecb9824)
- [OpenAI Codex PR #38245](https://github.com/openai/codex/pull/38245)
- `research/reading/Q-20260813-03-constrained-mcp-http-header-helper.md`
- `research/analysis/Q-20260813-03-extension-boundary.md`
