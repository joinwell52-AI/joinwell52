# Q-20260822-03 — Account-Scoped Plugin Cache Reconciliation with Generation Guards

- Runtime date: 2026-08-22 (Asia/Shanghai)
- Queue signal: SIG-20260822-007
- Primary source: https://github.com/openai/codex/commit/e6a3877e95788b52c3aa5e9a143dba87f04720dc
- Evidence level: `merged_maintainer_change`
- Scope: OpenAI Codex remote installed-plugin and loaded-plugin cache lifecycle

## Problem

Remote installed-plugin state is fetched asynchronously while direct installs, uninstalls, authentication changes and background reconciliation can mutate the same local cache tree. Without identity scoping and concurrency control, an in-flight snapshot from account A or an older refresh can overwrite newer state, while an incomplete authoritative snapshot can make a still-installed plugin look stale and trigger destructive cache removal.

## Facts

The change introduces `RemoteInstalledPluginsAuthIdentity`, derived from authentication mode, account ID, ChatGPT user ID and workspace-account status. This identity is added to both remote installed-plugin cache state and the loaded-plugin cache key. Cache reads and publication check that the snapshot identity still matches current authentication.

Remote installed-plugin cache state now carries a monotonically changing `generation`, optional `reconciliation_generation`, `needs_effective_plugins_refresh`, account identity and optional plugin snapshot. Account changes invalidate the previous identity and bump generation, so older in-flight work cannot publish into the new account's cache.

A single-per-cache-root semaphore gate serializes full installed-bundle sync, reconciliation and direct remote plugin installs/uninstalls. Direct installation holds the shared gate through the backend mutation; a mutation marker remains through downstream setup so a later sync cannot prune the just-materialized bundle. Uninstall uses the same gate and mutation marker.

Reconciliation uses generation checks before publication. A reconcile pass records its generation; publication is rejected if the generation or auth identity no longer matches. Abandoning/cancelling a reconcile clears the active reconciliation generation, bumps generation and sets `needs_effective_plugins_refresh` so the retry notifies consumers after any partial bundle mutations.

The remote installed snapshot is validated completely before downloads, publication or stale cleanup. Every fetched row must canonicalize to a valid local cache key. If any row cannot be validated, the pass returns an error before destructive cleanup. For an individually valid installed plugin whose bundle validation/download/materialization fails, its installed metadata is still retained in the snapshot so it is not misclassified as uninstalled.

Stale cache cleanup occurs only after the validated snapshot has been converted into the complete installed-name set. It also skips cache entries with a direct mutation currently in flight.

The commit adds regression coverage for account changes during plugin loading, incomplete snapshots, refresh/reconciliation races and reconciliation cancellation recovery, as well as coordination with direct install/uninstall.

## Vendor Claims

The commit claims that remote plugin snapshots are account-scoped, reconciliation is serialized with direct mutations, cache generations reject stale overwrite, and the complete snapshot is validated before destructive changes. The changed manager, app-server mutation paths, sync implementation and tests directly support those scoped claims.

## Mechanisms

1. **Composite account identity:** cache identity includes auth mode, account ID, ChatGPT user ID and workspace-account status rather than relying on a process-global plugin snapshot.
2. **Identity-aware cache keys:** loaded-plugin results are keyed by current auth identity as well as plugin configuration.
3. **Generation guard:** every invalidation/reconciliation transition advances a generation; stale work can publish only if its expected generation still matches.
4. **Reconciliation epoch:** `reconciliation_generation` distinguishes the currently authorized reconcile pass from ordinary refresh publication.
5. **Shared cache-root semaphore:** full sync, reconcile, direct install and uninstall share one serialized mutation boundary, with a bounded wait timeout.
6. **In-flight mutation marker:** direct per-plugin mutations remain protected from stale-pruning logic even after the broader gate can be released.
7. **Validate-before-destroy:** the authoritative `/installed` response is fully canonicalized before any download or stale deletion is allowed.
8. **Metadata retention on materialization failure:** a valid installed row remains in installed metadata even when its local bundle cannot be materialized.
9. **Cancellation recovery:** abandoned reconciliation marks consumer refresh as necessary and invalidates the cancelled generation before retry.

## Evidence

Primary evidence is merged maintainer commit `e6a3877e95788b52c3aa5e9a143dba87f04720dc`. `manager.rs` adds account identity, generation/reconciliation state and the shared synchronization guard. App-server install/uninstall paths acquire the same guard. `remote_installed_plugin_sync.rs` validates the complete fetched snapshot before downloads and stale cleanup, retains valid installed metadata across materialization failures, and skips cache deletion when a direct mutation marker is active.

The commit's test additions explicitly cover account changes during loading, incomplete snapshots, refresh/reconcile races and cancellation recovery.

## Limitations

This is not a database transaction and does not establish exactly-once semantics. Network calls and filesystem mutations can still fail; the design detects stale publication and coordinates retries rather than atomically rolling back every side effect.

The generation counter is process/cache-state coordination. It does not by itself coordinate independent processes unless they share the same higher-level cache/mutation mechanism.

Retaining metadata after materialization failure prevents false uninstall inference, but the plugin can still be unavailable locally until a later successful materialization.

The semaphore serializes the represented cache-root operations; it does not prove that every possible filesystem writer outside these paths participates in the gate.

## Comparisons

Compared with a simple TTL or last-write-wins cache, this design binds cache validity to principal identity and causal generation. Compared with holding a global lock around every plugin action indefinitely, it combines a coarse serialized reconciliation boundary with per-plugin mutation markers so stale cleanup is constrained without claiming full transactional rollback.

## Unresolved Questions

- How are generation and identity transitions handled across process restart, where in-memory coordination state is reconstructed?
- Are there external/plugin-manager writers that can mutate the same cache tree without acquiring the shared gate or mutation marker?
- What retry/backoff policy follows `LockTimeout` or `Superseded`, and can persistent churn starve reconciliation?
- How is local consumer state repaired if cancellation occurs after some bundles change but before cache publication, beyond the `needs_effective_plugins_refresh` signal?

## Reading Conclusion

The defensible result is that Codex now combines **principal scoping, serialized cache mutation, generation-based stale-publication rejection and validate-before-destroy** for the remote installed-plugin lifecycle. This materially reduces cross-account contamination and stale-refresh races, but it is not a general transactional or exactly-once guarantee.
