# Q-20260903-03 — MCP OAuth Discovery Needs Issuer Binding

- Runtime date: 2026-09-03 (Asia/Shanghai)
- Queue signal: SIG-20260903-007
- Primary implementation A: https://github.com/modelcontextprotocol/python-sdk/commit/d060b36e1d095ef6e93e07ba5d59bb69b2ad449a
- Primary implementation B: https://github.com/google-gemini/gemini-cli/commit/55b495d6db1794bf5b7f37a9bc03ebcab5103673
- Evidence level: `merged_maintainer_change`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

Which authorization-server identity must remain invariant across protected-resource metadata, discovery, redirects and authorization responses so an MCP client cannot accept valid-looking OAuth material from the wrong authority?

## Problem

An OAuth flow can validate transport, state and endpoint syntax yet still bind the client to the wrong authorization server. This is an authority-confusion or mix-up problem: location alone is not identity. In MCP, the client may start from a resource server, follow `WWW-Authenticate` metadata, discover one or more authorization servers, fetch their metadata and later receive an authorization callback. Every indirection introduces an opportunity to substitute a different issuer.

Two independent maintainer changes on 2026-09-02 address different occurrences of this same identity problem. The MCP Python SDK binds discovered authorization-server metadata to the expected issuer on every discovery path. Gemini CLI implements RFC 9207 authorization-response issuer identification in its MCP OAuth callback.

## MCP Python SDK Mechanism

The Python SDK derives the expected issuer from the authorization server advertised by Protected Resource Metadata. On the legacy no-PRM path, it derives the resource server's origin because that is the authority whose well-known metadata is queried. Discovered authorization-server metadata must name the expected issuer or the flow raises `OAuthFlowError`.

The change adds a configurable issuer for client-credentials and private-key-JWT providers. When configured, the provider selects an advertised server matching that issuer, refuses to mint assertions or build token requests from metadata for another issuer, clears mismatched cached metadata and tokens, and restarts discovery rather than refreshing against the wrong server. The configured issuer must be an HTTP(S) URL.

The SDK documents string-based issuer comparison aligned with RFC 8414 and RFC 3986 simple string comparison. A trailing-slash mismatch normally fails; a compatibility allowance exists for the legacy origin path. There is no client-side override for inconsistent deployment metadata—the documented remediation is to fix the authorization server and protected-resource metadata.

## Gemini CLI Mechanism

Gemini CLI passes the expected authorization-server issuer into the local callback server. The callback now parses the RFC 9207 `iss` parameter in addition to `code` and `state`. If an expected issuer is configured, a missing `iss` is rejected fail-closed as a downgrade/mix-up risk; a mismatched `iss` is rejected before resolving the authorization response.

Its comparison normalizes host casing, default ports and trailing slashes, preserves query parameters and fragments to avoid conflating tenants, and rejects issuer URLs containing userinfo such as `attacker.example@trusted.example`. Tests cover identical values, trailing slashes, domain/path/query/fragment differences, default ports, userinfo spoofing, missing `iss`, mismatched `iss`, matching callbacks and compatibility when no expected issuer is configured.

The two implementations therefore protect different boundaries. Python SDK metadata binding answers “did discovery return metadata for the authority I intended?” Gemini callback binding answers “did the authorization response come from the authority that initiated this flow?” Both preserve the same principle: the issuer is a stable authority identity that must survive indirection.

## Reproducible Engineering Evidence

Both sources are merged maintainer changes with implementation and tests. The Python commit modifies provider selection, metadata validation, token clearing and multiple discovery paths. The Gemini commit modifies callback state, issuer comparison, fail-closed behavior and targeted tests. This is stronger than two announcements because the behavior and error cases are inspectable.

The evidence still establishes implementation conformance, not observed prevention of a production attack. No incident, red-team corpus or end-to-end cross-client benchmark in today's source set measures exploit rate before and after these changes.

## Contradictions and Compatibility Boundaries

The two clients do not use identical normalization rules. The Python SDK emphasizes exact/simple string comparison and treats even a trailing slash as mismatch on the main PRM path, while Gemini intentionally normalizes trailing slashes, host casing and default ports. Both can be internally defensible, but an ecosystem that does not define one comparison profile may produce interoperability failures or inconsistent acceptance.

Both clients preserve some compatibility when no issuer is configured. Gemini allows a callback without `iss` when there is no expected issuer; Python client-credentials providers use whichever server discovery returns when their optional issuer is omitted. Those paths are not equivalent to issuer-bound assurance and must not be described as protected by the same guarantee.

## Limits and Unknowns

- Merged code and tests do not prove deployed configuration correctness or complete OAuth security.
- Issuer binding does not replace `state`, PKCE, redirect-URI validation, TLS, client authentication or token audience/resource checks.
- The sources do not establish a single cross-language MCP issuer-normalization rule.
- A correctly matched but compromised authorization server remains trusted by this mechanism.
- Cached-token migration, multi-tenant issuer conventions and backwards compatibility may introduce operational failures not evaluated here.
- The Gemini change protects the authorization response; the Python change primarily protects metadata and token-endpoint selection. Neither alone covers every occurrence in the full flow.

## Unresolved Questions

1. Should MCP define one normative issuer comparison and normalization profile for all SDKs?
2. Must issuer binding be mandatory for every grant and legacy discovery path, or may compatibility mode remain explicit?
3. How should stored tokens and registrations be invalidated when expected issuer configuration changes?
4. Which evidence should be logged so operators can distinguish malicious substitution from harmless metadata mismatch?
5. How should issuer, resource and token audience be jointly bound in multi-tenant and chained MCP deployments?

## Reading Conclusion

The independent changes show genuine cross-implementation convergence on authority identity, but at different OAuth occurrences and with different comparison semantics. Analysis may conclude only that issuer binding is a necessary confused-authority defense across discovery and callback handling; it must preserve the distinction between metadata issuer, authorization-response issuer, token audience/resource and the broader OAuth security envelope.

