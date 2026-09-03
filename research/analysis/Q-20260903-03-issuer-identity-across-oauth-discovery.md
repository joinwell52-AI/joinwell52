---
date: "2026-09-03"
status: ReadyForProduction
production_input_authorized: true
queue_item: Q-20260903-03
column: open-source-engineering
article_type: comparative-study
project_relevance: none
source_reading: "research/reading/Q-20260903-03-mcp-oauth-issuer-binding.md"
---

# Research Analysis — Endpoint Discovery Must Not Redefine Credential Authority

## Research question

How should MCP clients preserve authorization-server identity across metadata discovery and authorization callbacks when valid URLs and responses can still belong to the wrong authority?

## Research themes and subject kind

- **Themes:** credential isolation; protocol identity; OAuth mix-up defense; call-time authorization
- **Subject kinds:** cross-sample-comparison; protocol-mechanism; failure-mode; engineering-insight
- **Samples:** MCP Python SDK commit d060b36; Gemini CLI commit 55b495d

## Research value

### Failure

Trusting the endpoint from which metadata or a callback arrives compresses location and authority into one proposition. An attacker or misconfiguration may lead the client to valid-looking metadata or an authorization response issued by a different server. State and PKCE do not by themselves prove which authorization server produced the response.

### Findings

Two independent maintainer implementations converged on issuer binding in the same window. The Python SDK checks discovered authorization-server metadata against the PRM-advertised or configured issuer and refuses token construction from mismatched metadata. Gemini CLI carries the expected issuer into its callback server and rejects missing or mismatched RFC 9207 `iss` values when an issuer is expected.

The implementations also reveal an interoperability contradiction: the Python main PRM path emphasizes exact/simple string comparison, while Gemini normalizes trailing slashes, host case and default ports. Both preserve query/tenant distinctions, but the ecosystem lacks one demonstrated cross-client comparison profile in today's evidence.

### Mechanism

Issuer identity should be selected before following indirection and rechecked at each authority-bearing occurrence: protected-resource metadata, authorization-server metadata, token endpoint selection and authorization response. Mismatch should invalidate cached metadata/tokens and fail closed rather than expose a permissive override.

### Implication

An MCP OAuth implementation should model issuer, resource and token audience as separate stable identities. A redirect or well-known document may locate an authority; it must not silently choose a new one.

## Evidence claims

### E1 — public-fact

**Claim:** The MCP Python SDK implementation derives or accepts an expected issuer, validates discovered metadata, clears mismatched state and refuses token requests built from another issuer.

**Source:** modelcontextprotocol/python-sdk commit d060b36e1d095ef6e93e07ba5d59bb69b2ad449a.

**Strength:** states. **Independent:** false; this is direct implementation evidence for that revision.

### E2 — public-fact

**Claim:** Gemini CLI validates RFC 9207 `iss` at the local callback, fails closed when expected issuer is missing or mismatched, rejects userinfo confusion and tests normalization behavior.

**Source:** google-gemini/gemini-cli commit 55b495d6db1794bf5b7f37a9bc03ebcab5103673.

**Strength:** states. **Independent:** false.

### E3 — our-observation

**Claim:** The two implementations address the same authority-confusion class at different occurrences and use non-identical issuer comparison semantics.

**Source:** comparison of E1 and E2.

**Strength:** observed. **Independent:** false.

### E4 — our-interpretation

**Claim:** MCP needs an occurrence-complete issuer-binding contract and a normative comparison profile so compatibility choices do not create inconsistent security boundaries.

**Source:** analytical inference from E1–E3.

**Strength:** supports. **Independent:** false.

## Cross-sample comparison

| Boundary | MCP Python SDK | Gemini CLI | Remaining obligation |
|---|---|---|---|
| Expected identity | PRM-advertised/configured issuer or legacy origin | Configured authorization-server issuer | Define who is authorized to configure it |
| Checked occurrence | Authorization-server metadata and token construction | Authorization callback `iss` | Cover the full flow, not one occurrence |
| Mismatch behavior | `OAuthFlowError`, clear mismatched metadata/tokens | Reject callback fail closed | Preserve auditable reason without leaking secrets |
| Comparison | Exact/simple comparison on main path | URL normalization with tenant distinctions | Establish cross-SDK normative semantics |
| Compatibility | Unconfigured issuer can follow discovery | No expected issuer can accept missing `iss` | Label reduced-assurance mode explicitly |

## Counterarguments and boundaries

Strict comparison can reject harmless deployment differences, while normalization can accidentally collapse distinct issuers if underspecified. The answer is not unconditional permissiveness; it is a normative comparison rule plus explicit migration diagnostics. Issuer binding also does not replace TLS, state, PKCE, redirect validation, token audience/resource binding or backend authorization.

## Bounded research judgment

Issuer binding is a necessary defense against authorization-server confusion across MCP OAuth discovery and callbacks. The stable engineering rule is identity-before-indirection: select the expected authority, bind every discovered artifact and response to it, and fail closed on downgrade or mismatch. The present evidence does not establish one complete or interoperable end-to-end profile.

## General implications

- Cache keys and token stores should include issuer identity.
- Issuer changes should invalidate registrations, metadata and tokens explicitly.
- Compatibility mode should be observable and lower-assurance, not silently equivalent.
- Logs should distinguish configuration mismatch, downgrade and suspected substitution.
- Cross-language test vectors should cover normalization, userinfo, tenant/query and legacy paths.

## Limitations and open questions

The evidence is merged implementation and tests, not a measured production incident or independent security evaluation. Open questions include a normative MCP comparison profile, how issuer and resource indicators compose, safe cached-token migration, and whether every grant type should require issuer-bound responses.

## Editorial recommendation

- **Article type:** comparative-study
- **Selected modules:** research-question; evidence; comparison; engineering-implications; counterarguments; limitations; open-questions
- **Ending module:** open-questions
- **Project relevance:** none

