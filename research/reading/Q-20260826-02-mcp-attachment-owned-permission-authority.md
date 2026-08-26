# Q-20260826-02 — Attachment-Owned MCP Permission Authority Across Runtime Refresh

- Runtime date: 2026-08-26 (Asia/Shanghai)
- Queue signal: SIG-20260826-012
- Primary source: https://github.com/openai/codex/commit/4213b38f3c555049bf6f494065698a3dfe587c16
- Evidence level: `merged_maintainer_change`
- Scope: OpenAI Codex MCP per-server permission profiles, attachment resolution, call/elicitation rejection, runtime refresh and threadless-operation defaults

## Problem

MCP servers attached to executor environments can have an authority owner that differs from the thread-wide sandbox profile. If a runtime refresh or tool preparation falls back to thread authority, the server may gain permissions its attachment owner did not grant or lose the authority required to make a valid call.

## Facts

The change adds `server_permission_profiles: HashMap<String, PermissionProfile>` to `McpConfig`. `set_server_permission_profiles` resolves enabled runtime servers against the published attachment/environment permissions and stores an explicit profile only when authority can be resolved.

`permission_profile_for_server` retrieves the profile by server name. `PreparedMcpCall::new` now returns `Option<Self>` and refuses to prepare a call if the server has no published permission profile. Once prepared, `PreparedMcpCall::permission_profile()` reads the server-owned profile from the immutable captured config, with an unreachable assertion documenting that prepared calls must retain that authority.

The patch changes approval, elicitation and sandbox-related consumers to use server-specific authority rather than a single thread-wide profile. Tests update configurations with per-server profiles and exercise attachment authority changes, disabled/unresolved attachments, restricted tool calls and refresh behavior.

For app discovery and resource reads that occur without an active thread, `for_threadless_operations` creates an explicit default permission profile both at the config level and for enabled servers. This avoids silently inheriting active-thread execution authority for threadless reads.

The commit also materializes workspace roots from `PathUri` values so the permission profile uses the path convention of remote executor environments.

## Vendor Claims

The maintainer states that attached MCP servers must retain their owner's permission profile instead of inheriting thread-wide sandbox authority, including after runtime refresh. The per-server map, call-preparation guard and refresh/elicitation tests directly support this bounded MCP-runtime claim.

## Mechanisms

1. **Per-server published authority:** runtime configuration stores an explicit permission profile keyed by enabled MCP server.
2. **Attachment-resolution gate:** unresolved or unavailable server authority produces no map entry rather than falling back to a broader thread profile.
3. **Preparation-time rejection:** an MCP call is not prepared unless the target server has resolvable published authority.
4. **Immutable call capture:** prepared calls retain the runtime config/connection snapshot from which their server authority was validated.
5. **Server-owned downstream decisions:** approval, elicitation and sandbox metadata consume the server profile rather than assuming thread-wide authority.
6. **Refresh-aware replacement:** new runtime configurations can publish changed server profiles while already-prepared calls retain their captured authority; tests exercise this lifecycle distinction.
7. **Threadless explicit default:** discovery/resource operations without a thread receive a deliberately constructed default profile instead of incidental thread execution power.

## Evidence

Primary evidence is merged OpenAI Codex maintainer commit `4213b38f3c555049bf6f494065698a3dfe587c16`. The patch changes MCP binding/configuration, connection/runtime consumers and a broad regression suite. The code explicitly documents `server_permission_profiles` as server permissions where unresolved or unavailable servers have no entry.

The evidence supports an ownership-preservation conclusion: demonstrated MCP operations use the permission authority published for the server's attachment, and missing authority is a rejection condition rather than permission widening.

## Limitations

This is not proof that every Codex capability has attachment-scoped authority. The demonstrated contract is MCP server runtime/binding behavior.

The presence of a `PermissionProfile` does not itself prove the correctness of the upstream attachment-to-profile resolver or every policy value that may populate that profile.

Threadless operations intentionally receive a default profile; the selected change does not prove that the default is appropriate for every possible future threadless MCP operation.

Captured authority across refresh is lifecycle consistency, not distributed revocation. A call already prepared from an older immutable runtime snapshot can retain its captured profile while a newly published runtime has different authority.

## Comparisons

A thread-wide permission model makes runtime authority convenient but conflates execution context with resource ownership. The changed design moves the demonstrated MCP boundary toward capability attachment: authority is resolved when the runtime is published, attached to the server identity, required during call preparation and reused by downstream permission-sensitive operations.

## Unresolved Questions

- What exact revocation semantics apply to already-prepared calls when an attachment's authority is reduced during a refresh?
- How are conflicting environment/attachment permission contributions resolved before `set_server_permission_profiles` stores the final profile?
- Are server-profile changes surfaced in audit telemetry with enough identity to explain an approval or rejection later?
- Which future threadless operations, if any, should require a narrower profile than the current explicit default?

## Reading Conclusion

The selected Codex change establishes a concrete MCP authority-ownership boundary: enabled servers receive explicit published permission profiles derived from their attachment context, unresolved authority blocks preparation, and approval/elicitation/sandbox decisions reuse the server-owned profile across the demonstrated runtime lifecycle. The conclusion should remain bounded to this MCP attachment/runtime contract rather than being generalized into universal capability revocation or authorization correctness.
