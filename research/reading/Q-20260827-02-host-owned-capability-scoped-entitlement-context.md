# Q-20260827-02 — Host-Owned, Capability-Scoped Verified Access Context

- Runtime date: 2026-08-27 (Asia/Shanghai)
- Queue signal: SIG-20260827-008
- Primary source: https://github.com/openai/codex/commit/ae357e7250402af7c3bbede18a46cc565a7670d4
- Evidence level: `merged_maintainer_change`
- Scope: OpenAI Codex verified ChatGPT account access, MCP metadata injection, plugin provenance, capability predicates, timeout/failure behavior and caller-context rejection

## Problem

Identity- or account-derived access metadata becomes dangerous if an untrusted caller can supply it, if it propagates to arbitrary tools, or if it remains valid after account identity changes. A safe boundary needs both an authority owner that can verify the account and a narrow capability edge where the verified context may be attached.

## Facts

The merged Codex change adds host-owned `openai/entitlementContext` metadata for the `cyber_trusted_access` entitlement. `TrustedAccessContext` is created only for ChatGPT/ChatGPT-token authentication and obtains the current account-bound access state from `GET /accounts/verified_access` using host-owned authentication headers.

Before attaching context, the code checks a conjunction of capability predicates: the tool must explicitly request `cyber_trusted_access`; the MCP server must belong to an installed or selected plugin; arguments must be absent or an empty object; the server must use the local default environment; its origin must be stdio; and the tool annotation must declare `readOnlyHint == true`. Calls outside that conjunction keep their original metadata and do not receive the verified context through this path.

`add_context` removes any caller-supplied `openai/entitlementContext` before verification. It then performs the access lookup under a 2.5-second timeout. Failure, timeout, invalid/malformed provider data, unsupported authentication, missing identity, or an identity mismatch maps to a host-generated `unknown` status with no grants rather than retaining caller-provided authority.

The verifier binds the lookup to the identity captured when the runtime context was created. It checks account ID, ChatGPT user ID, workspace-account status and FedRAMP-account status before the request, and checks the cached current auth again after the response. If the account changes during lookup, the result is discarded.

The HTTP request disables redirects, limits the verified-access response body to 1 MiB, requires HTTP 200 and requires exactly one `cyber` program. Only enumerated program states, grant levels and grant sources are accepted. `individual` grant sources are projected as `user`; `organization` as `current_account`.

The maintainer tests cover eligible installed/selected plugin cases and negative paths including unowned servers, remote/HTTP servers, mutable or argument-bearing tools, API-key auth, undeclared entitlement requests, direct-call caller metadata, account switching and malformed/oversized responses.

## Vendor Claims

The commit states that verified ChatGPT access should be attached only when an installed or selected plugin explicitly requests it from a local, read-only stdio tool with no arguments; direct caller-supplied entitlement context must be rejected; unverifiable or account-changing lookups must degrade to `unknown`; and lookup time counts against the tool-call timeout. The implementation and tests directly support those bounded claims.

## Mechanisms

1. **Host-owned identity lookup:** the authority-bearing metadata is produced by Codex from current ChatGPT authentication rather than accepted from the MCP caller.
2. **Capability conjunction:** plugin ownership/selection, local environment, stdio transport, read-only annotation, zero arguments and explicit entitlement declaration are all required before injection.
3. **Caller-context replacement:** an existing `openai/entitlementContext` key is removed before the host writes a verified or `unknown` result.
4. **Identity continuity check:** account/user/workspace/FedRAMP identity is compared before and after lookup to reject results acquired across an account switch.
5. **Bounded verification:** the lookup is constrained by a 2.5-second timeout, no redirects and a 1 MiB response cap.
6. **Fail-closed projection:** unsupported authentication, request errors, invalid response structure or inconsistent program/grant states produce `unknown` with empty grants instead of privilege widening.
7. **Narrow metadata propagation:** ineligible MCP calls bypass `add_context`, and integration tests exercise negative provenance/transport/mutability/argument/auth cases.

## Evidence

Primary evidence is merged OpenAI Codex maintainer commit `ae357e7250402af7c3bbede18a46cc565a7670d4`, including the new `codex-rs/codex-mcp/src/trusted_access.rs`, unit tests and app-server/core integration coverage.

The source code directly exposes the eligibility predicate, the 2.5-second deadline, identity checks, caller metadata removal, HTTP constraints, response parser and fail-closed `unknown` projection. This is stronger than a release-note-only claim because the security-relevant branch conditions are inspectable.

## Limitations

The metadata is described in code as advisory entitlement metadata. This change does not by itself prove that every downstream plugin enforces `cyber_trusted_access` correctly or that the entitlement is a complete authorization system.

A host-generated `unknown` value is safer than trusting caller metadata, but the security effect still depends on receivers treating `unknown` as non-authorizing.

The implementation proves a specific Codex local plugin MCP boundary. It does not establish a universal identity design for all MCP transports, remote servers, argument-bearing tools or other entitlement types.

The selected evidence does not prove cryptographic freshness of the provider response beyond the authenticated request and identity continuity checks, nor does it expose independent server-side policy logic behind `/accounts/verified_access`.

## Comparisons

Passing caller-declared entitlement fields through an MCP request would conflate data supplied by the requesting capability with evidence issued by the account authority. The changed design moves the evidence boundary into the host: Codex verifies current account state, strips untrusted copies, and injects only at an explicitly qualified plugin/tool edge. This resembles a capability-scoped credential broker rather than a generic metadata passthrough.

## Unresolved Questions

- Which downstream component consumes `cyber_trusted_access`, and is `unknown` uniformly non-authorizing there?
- Are verified-access responses cached anywhere outside this per-call path, and if so what freshness/revocation semantics apply?
- How are organization-level policy changes reflected when the account identity remains stable during a long-running session?
- Will future entitlement types reuse the same narrow predicate or require independent eligibility contracts?
- Is the 2.5-second lookup always fully charged against the same outer MCP timeout budget under every call path?

## Reading Conclusion

The Codex change demonstrates a concrete identity-authority boundary: verified account access is host-produced, account-bound, timeout-bounded and stripped of caller forgery, then attached only to a narrowly qualified local read-only plugin MCP call. Unverifiable conditions collapse to `unknown` rather than privilege widening. The conclusion is intentionally limited to this demonstrated Codex entitlement-context path and does not claim universal MCP authorization correctness.
