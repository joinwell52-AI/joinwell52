# Q-20260828-02 — Managed Policy Refresh Must Fail Closed on Fresh Authority

- Runtime date: 2026-08-28 (Asia/Shanghai)
- Queue signal: SIG-20260828-025
- Primary source: https://github.com/github/copilot-cli/commit/4ab8707dbf12f8fc15e8bac2cb5c38d18341b494
- Evidence level: `official_release_note`
- Scope: GitHub Copilot CLI 1.0.81 managed-settings freshness, `forceRemoteSettingsRefresh`, stale-cache rejection and the documented undetermined-policy posture

## Problem

Enterprise managed settings are authorization inputs. A cached policy can improve availability, but when an administrator explicitly requires a fresh remote policy, reusing cached authority after refresh failure can silently preserve permissions that may already have been revoked. The safety question is therefore not merely whether a cache exists, but whether that cached policy is still admissible as authority under the current freshness requirement.

## Facts

The official Copilot CLI 1.0.81 changelog states that `forceRemoteSettingsRefresh` now fails closed. When the setting is in effect, the cached managed-settings policy is neither served through the normal one-hour fast path nor used through the documented 24-hour stale fallback after a failed fetch. A failed startup refresh therefore does not fall back to the cached policy.

Until a fresh managed policy is successfully fetched, the CLI applies a restrictive “undetermined-policy” posture. The release note explicitly names three consequences: non-default MCP servers are blocked, bypass-permissions mode cannot be enabled, and policy-gated plugin install/update mutations are blocked.

The same release note also expands the fail-closed boundary for plugin-marketplace operations: while forced refresh is unresolved, read-only marketplace operations such as list, browse and refresh fail closed rather than proceeding without the server-managed policy. This matters because even nominally read-only discovery can expose or act on policy-governed marketplace state whose admissibility depends on the unavailable authority source.

The changelog says the restrictive posture lasts until a fresh policy is fetched. It therefore establishes a freshness gate: cached policy is not accepted as authority under forced refresh, and affected capabilities remain restricted while current remote authority is unknown.

The selected source is a release-note commit, not the underlying implementation patch. It does not expose the exact cache key, fetch state machine, retry schedule, HTTP/error taxonomy, internal policy object or regression tests. Those implementation details are not inferable from the changelog and remain Unknown.

## Vendor Claims

GitHub's 1.0.81 release note claims that forced remote settings refresh now rejects both the one-hour cache fast path and the 24-hour stale fallback, blocks startup on unconfirmed policy rather than reverting to potentially stale cached authority, and applies the documented restrictive posture until a fresh policy is obtained. It also claims plugin marketplace operations covered by policy fail closed during that unresolved period.

These are official product-behavior claims. Because the selected commit modifies `changelog.md` rather than publishing the implementation, this Reading treats them as `official_release_note`, not as source-level proof of the internal mechanism.

## Mechanisms

1. **Freshness as an admission condition:** when `forceRemoteSettingsRefresh` is active, freshness becomes part of whether managed policy may authorize behavior.
2. **Cached-authority rejection:** both the one-hour fast-path cache and the 24-hour stale fallback are bypassed for authority decisions under forced refresh.
3. **Unknown is restrictive:** refresh failure yields an undetermined-policy posture rather than inheriting stale permissions.
4. **Capability-specific denial:** non-default MCP servers, bypass-permissions mode, and policy-gated plugin mutations are explicitly restricted while policy is unconfirmed.
5. **Marketplace fail-closed boundary:** policy-sensitive list/browse/refresh operations also refuse to proceed without current managed authority.
6. **Fresh-policy recovery:** the documented restrictive posture is temporary and ends when a fresh managed policy is fetched, rather than requiring permanent disablement.

## Evidence

Primary evidence is GitHub Copilot CLI commit `4ab8707dbf12f8fc15e8bac2cb5c38d18341b494`, which publishes the 1.0.81 changelog. The relevant release-note entry explicitly names `forceRemoteSettingsRefresh`, rejects cached-policy use in the one-hour and 24-hour paths, describes the undetermined-policy restrictions, and states that policy-gated plugin/marketplace operations fail closed until current managed policy can be confirmed.

The selected public repository search exposes the changelog entry but not implementation files for `forceRemoteSettingsRefresh` at this commit. The precise implementation therefore cannot be upgraded from release-note evidence to code-level fact in this Reading.

## Limitations

The release note does not prove that every action in Copilot CLI is disabled while policy is undetermined. Only the explicitly documented capability families should be treated as covered by this evidence.

“Fail closed” here is scoped to the forced managed-policy freshness path. It does not establish that every managed-settings fetch failure in every mode rejects cached state; the behavior when forced refresh is not enabled must not be generalized from this entry.

The exact definition of a “fresh policy” is not disclosed in the selected source: transport authentication, response validation, version/ETag rules, signature semantics, replay protection and server-side revision identity are Unknown.

The source does not disclose how retries, offline operation, partial settings, malformed responses or mid-session refresh races are internally represented. It also does not expose the regression-test matrix that proves those failure paths.

A restrictive undetermined-policy posture reduces stale-authority risk but can reduce availability. The release note does not quantify operational impact or provide a formal availability/safety trade-off analysis.

## Comparisons

A conventional resilient cache treats fetch failure as an availability event and serves the last known configuration. That model is appropriate for non-authoritative preferences but dangerous when freshness itself is an administrator requirement. Copilot's forced-refresh behavior changes the precedence rule: current authority is required; stale authority is not an acceptable substitute.

This is also different from deleting the cache. The key rule is not “no cached data may exist”; it is “cached managed policy may not be used as current authorization when fresh authority was explicitly required.” That distinction is useful for auditable agent systems because storage and authority can be separated.

## Unresolved Questions

- What exact remote response establishes a policy as fresh, and is freshness bound to an account, organization and policy revision?
- What retry/backoff and recovery behavior applies while the session is in the undetermined-policy posture?
- How are already-running MCP servers or plugin operations handled if managed policy becomes undetermined mid-session?
- Does the implementation persist a receipt explaining which capability was denied because freshness could not be proven?
- Are there policy operations outside the explicitly listed MCP, bypass-permissions and plugin/marketplace surfaces that share the same fail-closed gate?
- Which tests cover network errors, non-success responses, malformed policy payloads and policy changes during concurrent startup work?

## Reading Conclusion

Copilot CLI 1.0.81 documents a precise authorization principle: when enterprise configuration explicitly demands a fresh remote managed policy, cached policy is no longer admissible authority. The one-hour fast path and 24-hour stale fallback are skipped, selected policy-governed capabilities enter a restrictive undetermined state, and the restriction lasts until fresh authority is obtained. This is strong product-level evidence for stale-authority rejection, but the selected public source does not disclose the implementation or regression tests, so internal freshness identity and transition details remain Unknown.
