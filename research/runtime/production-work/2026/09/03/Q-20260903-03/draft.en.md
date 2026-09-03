---
schema: publication-candidate-article/v2
title: "Discovery Must Not Redefine Credential Authority"
date: '2026-09-03'
column: open-source-engineering
category: daily
article_type: comparative-study
edition: research-center
research_question: "当有效网址与响应仍可能属于错误的授权方时，MCP 客户端应如何在元数据发现和授权回调之间保持授权服务器身份？"
summary: "The MCP Python SDK and Gemini CLI independently added issuer binding at metadata and callback boundaries. Together they support identity-before-indirection while exposing issuer-comparison semantics as an unresolved interoperability boundary."
cover: staging/publication-candidates/2026-09-03-discovery-must-not-redefine-credential-authority-cover.png
sources:
  - research/analysis/Q-20260903-03-issuer-identity-across-oauth-discovery.md
---

![Discovery Must Not Redefine Credential Authority cover](staging/publication-candidates/2026-09-03-discovery-must-not-redefine-credential-authority-cover.png)

# Discovery Must Not Redefine Credential Authority

A client starts from protected-resource metadata and follows a discovery link to a perfectly valid authorization-server document. The URL resolves, the certificate is valid, the fields are well formed, and the later callback contains the right state value. Yet if those responses belong to another authorization server, the client may send registration information, an authorization code, or token requests to the wrong authority.

The failure comes from collapsing “where this response was found” and “who is authorized to issue credentials” into one proposition. Valid location and transport establish reachability, not the identity originally configured or advertised. State and PKCE constrain flow correlation and code redemption, but neither alone proves which authorization server produced the response.

Two independent open-source changes addressed the same confusion class at different occurrences. The MCP Python SDK compares discovered authorization-server metadata with an expected issuer and refuses to construct a token flow from mismatched metadata. Gemini CLI carries the expected issuer into its local callback server and, when an issuer is expected, rejects a missing or mismatched RFC 9207 issuer value.

This supports a bounded engineering judgment: **an MCP client should establish expected issuer identity before following discovery indirection and bind every authority-bearing artifact, endpoint decision, and response back to it. Discovery can locate an authority; it must not silently select a new one.**

## A Valid Endpoint Is Not the Expected Identity

OAuth discovery can traverse several documents and redirects before locating endpoints. That indirection supports flexible deployment, but it also creates more occurrences at which identity can be substituted. Malicious configuration, stale cache state, or an implementation defect can lead to another set of syntactically valid endpoints.

A secure implementation first fixes the expected identity. It may come from protected-resource metadata, explicit configuration, or a controlled compatibility rule. Whatever its source, the client should record who authorized the value and recheck it at every subsequent authority-bearing occurrence rather than let a later document overwrite the earlier trust decision.

Issuer, resource identity, and token audience should remain separate. An authorization server can serve multiple resources, and a resource can publish discovery information. Neither relation makes one identifier a substitute for another.

## The Fixes Cover Different Occurrences

The Python SDK implementation focuses on discovery. It derives or accepts an expected issuer, validates discovered server metadata, and clears or refuses mismatched state before token construction proceeds with another authority.

The Gemini CLI implementation focuses on the authorization callback. It carries expected issuer identity into the local callback handler and fails closed on missing or mismatched issuer values when one is expected, including tests against userinfo confusion.

These are complementary rather than duplicate fixes. Metadata validation alone can still leave a callback response unbound. Callback validation alone does not prevent earlier registration or token construction against the wrong endpoint. A stable contract should span protected-resource metadata, authorization-server metadata, endpoint selection, callback processing, and token storage.

## Comparison Semantics Are a Security Boundary

The implementations expose an interoperability tension. The Python main path emphasizes exact or simple string comparison. Gemini applies bounded URL normalization for trailing slashes, host case, and default ports while preserving query and tenant distinctions.

Overly strict comparison can reject harmless deployment variations. Overly broad normalization can collapse issuers that should remain distinct. If clients reach different conclusions for the same issuer representation, the ecosystem has inconsistent security boundaries.

The answer is not a generic ignore-mismatch switch. It is a normative comparison profile and cross-language test vectors. Tests should cover paths, trailing slashes, host case, default ports, userinfo, queries, tenant markers, internationalized domains, and legacy discovery paths. Every normalization rule should state what identity information it preserves or discards.

## Mismatch Must Invalidate Related State

Issuer change affects more than one comparison. A client may already cache metadata, dynamic registration, authorization state, and tokens. Reusing old cache entries after discovering a new identity can bypass an otherwise correct current check.

A mismatch or explicit issuer migration should therefore invalidate related registrations, metadata, and tokens while producing an auditable reason that does not leak secrets. A compatibility mode that permits an unconfigured issuer or missing issuer value should be labeled lower assurance, not presented as equivalent to strict mode.

Fail-closed behavior still needs migration diagnostics. Operators must distinguish configuration error, legitimate migration, downgrade, and suspected substitution without exposing authorization codes, tokens, or sensitive URL parameters.

## Issuer Binding Is Not Complete OAuth Security

Issuer binding does not replace TLS, state, PKCE, redirect validation, resource indicators, token audience checks, or backend authorization. It addresses one dimension: which authorization server produced authority-bearing information.

The evidence is merged implementation and tests, not measured incident reduction or independent security evaluation. It does not establish an occurrence-complete, interoperable MCP profile across every client and grant type.

Still, independent convergence yields a clear rule: **identity before indirection.** The client first selects whom it intends to trust, then binds every discovered authority-bearing artifact back to that identity. Any downgrade or mismatch must be explicit, auditable, and closed by default.

Open questions include normative normalization, composition of issuer and resource indicators, safe migration of cached tokens, and whether every grant type should carry an issuer-bound response. Until those conventions are shared, locally correct clients can still produce different trust boundaries.

**Implementation evidence:** [MCP Python SDK commit](https://github.com/modelcontextprotocol/python-sdk/commit/d060b36e1d095ef6e93e07ba5d59bb69b2ad449a); [Gemini CLI commit](https://github.com/google-gemini/gemini-cli/commit/55b495d6db1794bf5b7f37a9bc03ebcab5103673)
