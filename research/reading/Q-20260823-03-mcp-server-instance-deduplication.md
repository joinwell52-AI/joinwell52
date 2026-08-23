# Q-20260823-03 — Deduplicate MCP Servers Before Lifecycle Ownership

- Runtime date: 2026-08-23 (Asia/Shanghai)
- Queue signal: SIG-20260823-004
- Primary source: https://github.com/openai/openai-agents-python/commit/042d84a15c37bc6f66058dca3deda0311883db38
- Evidence level: `merged_maintainer_change`
- Scope: OpenAI Agents Python `MCPServerManager` in-process server collection and lifecycle ownership

## Problem

`MCPServerManager` owns connect, reconnect and cleanup operations for the servers passed to it. If the same server object appears more than once in the constructor input, treating each list entry as a separate owned resource can repeat lifecycle side effects against one underlying server: multiple connects, multiple cleanup calls, duplicate worker ownership, and confusing failure state.

## Facts

The selected change replaces `self._all_servers = list(servers)` with `self._all_servers = self._unique_servers(servers)` in `MCPServerManager.__init__()`. `active_servers` is initialized from that normalized list, so the manager's canonical lifecycle population is deduplicated before any connect or cleanup begins.

`_unique_servers()` iterates in input order, tracks previously seen server values in a `set[MCPServer]`, and appends only the first unseen server. It therefore preserves first-occurrence order.

The base `MCPServer` class does not define a custom `__eq__` implementation in the selected source. For normal instances using object equality/hash behavior, repeated references to the same object deduplicate by identity. More precisely, however, `_unique_servers()` uses Python set membership, so a subclass that supplies custom equality/hash semantics could also cause two distinct instances to compare as duplicates. The implementation should therefore be described as set/equality-based deduplication whose tested case is identical object reuse, not as an unconditional `is`-identity algorithm.

The new regression constructs one mocked MCP server, passes `[server, server]`, and asserts that `manager.all_servers == [server]`, `connect_all()` returns `[server]`, and both `server.connect` and `server.cleanup` are awaited exactly once.

The broader manager lifecycle uses `_all_servers` as the ordered canonical population. Sequential connect walks servers in order; `cleanup_all()` walks the list in reverse order. Reconnect and failure-cleanup paths also call `_unique_servers()` before operating on subsets, preventing repeated entries from being reintroduced during those internal transitions.

The manager serializes lifecycle mutations with `_lifecycle_lock`. Connect failures are recorded in `_failed_servers`, `_failed_server_set`, and `_errors`; strict mode can re-raise a connection error, while non-strict mode can retain a connected subset. Cleanup iterates all canonical servers and records ordinary cleanup errors rather than silently duplicating cleanup work.

## Vendor Claims

The maintainer commit is narrowly titled `fix(mcp): deduplicate managed servers` and the added test demonstrates the intended guarantee for a repeated server instance: the manager owns it once, connects it once and cleans it up once.

## Mechanisms

1. **Constructor normalization:** deduplicate the incoming iterable before establishing `_all_servers` and `_active_servers`.
2. **First-occurrence ordering:** the uniqueness helper keeps the first encountered representative and preserves original ordering among retained servers.
3. **Canonical lifecycle population:** connect and reverse-order cleanup operate on the normalized `_all_servers` list.
4. **Subset normalization:** reconnect/failure cleanup reuses `_unique_servers()` so repeated references do not reappear in retry paths.
5. **Serialized lifecycle mutation:** an async lock prevents concurrent manager lifecycle operations from racing over the same canonical server state.
6. **Explicit failure state:** failed and connected server sets plus the error map track lifecycle outcomes independently of list multiplicity.

## Evidence

Primary evidence is merged maintainer commit `042d84a15c37bc6f66058dca3deda0311883db38` in `openai/openai-agents-python`.

The production change is a one-line constructor normalization in `src/agents/mcp/manager.py`. The same file shows `_unique_servers()` implemented with a `seen` set and an ordered result list; connect, reconnect and cleanup paths consume this normalized state.

The added test `test_manager_owns_repeated_server_instance_once` verifies the key externally visible behavior for `[server, server]`: one managed entry, one successful connect and one cleanup.

## Limitations

The regression covers the exact same object passed twice. It does not test two distinct server objects with identical configuration. Such objects are normally retained separately unless their class equality/hash semantics make them compare equal.

The mechanism is entirely in-process. It does not coordinate lifecycle ownership across processes, hosts, containers, or multiple `MCPServerManager` instances.

One connect and one cleanup per canonical entry is not distributed exactly-once execution. A connect operation can still partially succeed and then fail; cleanup can fail or be cancelled; reconnect is intentionally allowed to invoke lifecycle methods again in later phases.

Deduplication does not determine whether two different server wrappers refer to the same remote MCP endpoint. Endpoint-level equivalence is outside the demonstrated mechanism.

## Comparisons

Compared with deduplicating by endpoint URL or configuration fingerprint, this approach avoids assuming semantic equivalence between independently constructed server wrappers. Its tested target is duplicate ownership caused by reusing the same server instance.

Compared with trying to suppress duplicate side effects inside `connect()` or `cleanup()`, normalization places the invariant at the manager ownership boundary: the resource collection is canonical before lifecycle operations start.

## Unresolved Questions

- Should `_unique_servers()` explicitly use object identity (`id()` / `is`) to make the ownership rule independent of subclass equality implementations?
- Are there real MCP server subclasses that implement custom equality or hashing and could therefore collapse distinct instances unexpectedly?
- Should separately constructed wrappers for the same remote endpoint ever be deduplicated, or is separate ownership intentional?
- How should lifecycle ownership be coordinated when the same server instance is accidentally handed to more than one manager?

## Reading Conclusion

The selected Agents SDK change establishes a useful in-process ownership invariant: `MCPServerManager` normalizes repeated server entries before adopting lifecycle responsibility, and the demonstrated same-instance duplicate is connected and cleaned up once. Ordering is preserved and internal retry/cleanup subsets reuse the same uniqueness helper. The guarantee is local manager ownership, not endpoint identity or distributed exactly-once lifecycle execution.
