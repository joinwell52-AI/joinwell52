# Q-20260813-03 — Dynamic MCP HTTP headers are supplied through a constrained local helper boundary

- Runtime date: 2026-08-13
- Column: Open-source Engineering
- Source object: Q-20260813-03 / SIG-20260813-G-004
- Primary source: https://github.com/openai/codex/commit/379cb68444057c721b6c8fa0bd610b7c6ecb9824
- Supporting primary record: https://github.com/openai/codex/pull/38245
- Evidence class: Fact for changed code and tests; inference only where labeled
- Stage: Skill 03 Deep Reading only

## Problem

Some local streamable-HTTP MCP deployments need short-lived or externally generated gateway headers in addition to normal MCP or OAuth authentication. An unconstrained command-to-header bridge could leak credentials across origins, override protocol-owned headers, inherit ambient secrets, run without bounds, or expose the helper command through CLI inspection.

## Facts

1. The change adds `http_headers_helper` only to streamable-HTTP MCP configuration; stdio configuration rejects it.
2. An empty helper command is rejected. A helper paired with a non-local environment ID is also rejected during configuration parsing.
3. `apply_http_headers_helper` additionally rejects execution when the server is disabled by managed requirements or when the effective server is not local.
4. The helper is wrapped around the selected HTTP client for MCP startup and standalone OAuth login paths.
5. `HttpHeadersProvider` stores the helper result as a shared future, so the helper runs once for that provider/connection context and the result is cached across requests.
6. A helper failure is cached as well; a later request does not silently rerun a helper that already failed.
7. The source explicitly does not refresh helper headers in response to HTTP 401/403 because those statuses may be OAuth challenges and reconnecting can lose MCP session state.
8. Helper headers are applied only when the request URL has the same origin as the configured MCP server URL. Cross-origin requests pass through without running or applying the helper.
9. For same-origin requests using helper headers, redirect policy is changed to `Stop`, preventing a later redirect hop from carrying helper headers elsewhere.
10. Helper headers replace same-name configured headers, but the parser rejects reserved protocol/authentication headers including `Authorization`, `Host`, `Content-Type`, `Mcp-Session-Id` and other transport-owned names.
11. The helper output must be a JSON object whose keys and values are strings. Exact duplicate keys are detected before ordinary map collapsing, and case-insensitive duplicates are rejected by the parsed header map.
12. Invalid header names and values are rejected without echoing the secret value in the validation error.
13. The helper has a 10-second execution limit and a 64 KiB stdout limit.
14. On Unix it runs in its own process group; on Windows it runs in a containment job. Dropping the helper process terminates contained work rather than leaving it detached.
15. The helper starts with a cleared environment and only the repository's MCP subprocess environment policy is reintroduced; ambient arbitrary variables are not inherited.
16. The helper runs in the resolved local process working directory. The command itself is ordinary configuration and may be visible in local process metadata, so the source comments direct credentials to JSON output rather than command text.
17. CLI `mcp list` and `mcp get` surfaces render configured helper commands as `<redacted>` rather than printing the command text.
18. Tests verify one shared invocation across concurrent requests, cached failure, cancellation behavior, origin isolation, redirect stopping, local working directory/environment behavior and process cleanup.
19. OAuth tests verify that gateway helper headers are present during OAuth discovery/token refresh and MCP initialization, while OAuth `Authorization` remains owned by the OAuth path.
20. A managed-requirements test verifies that a disabled server returns an error before the helper is run.

## Mechanisms

### Origin-bound decoration

The wrapper computes the configured server origin and applies helper headers only to that origin. Same-origin redirects are currently stopped as well, avoiding accidental credential forwarding through redirect handling.

### Cached per-provider materialization

The helper output is represented as a shared asynchronous result. Concurrent requests share one execution, and both success and failure become the provider's cached outcome.

### Header ownership separation

Dynamic helper headers can supplement transport requests but cannot claim reserved headers such as `Authorization` or MCP session/protocol headers. Existing same-name non-reserved configured headers are replaced by helper values.

### Bounded local execution

The helper receives a local cwd, sanitized environment, bounded execution time and bounded stdout. Process-group/job containment gives drop/cancellation a concrete cleanup boundary.

### Configuration and policy gates

The field is not accepted for stdio or remote environments, and runtime application refuses managed-disabled servers. CLI inspection redacts the configured command.

## Evidence

- `rmcp-client/src/http_headers.rs` defines the origin check, redirect stop, shared cached result, parser, reserved-header list, process containment, timeout and output limit.
- `codex-mcp/src/runtime.rs` centralizes local/managed policy checks and applies the wrapper to the resolved HTTP client.
- `config/src/mcp_types.rs` validates transport type, non-empty helper text and local environment use.
- Helper tests cover cached invocation/failure, cancellation, environment/cwd, origin isolation and redirects.
- OAuth startup tests cover discovery, refresh-token exchange and initialization with helper gateway headers.
- PR #38245 states the intended scope is local streamable-HTTP MCP startup/OAuth plus redaction and bounded execution.

## Limitations

1. Helper output is cached for the provider lifetime; the source intentionally does not implement rejection-driven credential refresh.
2. Stopping redirects is stricter than following same-origin redirects. The code carries a TODO for safe same-origin redirect support later.
3. The command may still be visible through local process/config inspection; only CLI display is redacted.
4. The source does not make helper output durable, auditable or recoverable after process restart.
5. Local process containment and environment clearing reduce exposure but do not prove that an arbitrary configured helper command itself is trustworthy.
6. This mechanism is limited to local streamable-HTTP MCP servers; it does not establish a general credential-injection protocol for remote execution environments.
7. Allowing `Proxy-Authorization` is deliberate for gateway/IAP scenarios, but the selected source does not establish policy for every proxy deployment.

## Comparisons

- Static configured headers are simple but cannot obtain fresh external credentials at connection time.
- Arbitrary header injection without ownership rules could overwrite OAuth/MCP protocol headers or leak across redirects.
- Running a helper on every request would increase process churn and inconsistency; the selected implementation caches one result per provider context.
- The selected design uses a local, bounded, origin-scoped helper that supplements but does not own core authentication/protocol headers.

## Unresolved questions

1. What explicit refresh mechanism should be used when a cached gateway credential legitimately expires during a long-lived MCP session?
2. Should safe same-origin redirects eventually preserve helper headers, and what redirect proof is required?
3. Should helper execution/result metadata be auditable without persisting secrets?
4. Should the helper boundary expose a structured executable/argument form rather than one shell command string?
5. How should administrators distinguish helper failure from OAuth failure in user-facing diagnostics without exposing sensitive output?

## Reading boundary

This note establishes only the source-backed local streamable-HTTP MCP helper boundary: one bounded local helper execution supplies cached non-reserved headers, headers are origin-scoped, redirects are stopped, local/managed policy is checked, and the command is redacted from CLI inspection. General credential architecture or security guarantees beyond this path belong to Skill 04 Analysis.
