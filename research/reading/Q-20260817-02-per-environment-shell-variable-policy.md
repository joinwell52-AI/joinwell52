# Q-20260817-02 — Shell-variable policy follows the selected execution environment

- Runtime date: 2026-08-17
- Column: Industry Architecture
- Source object: Q-20260817-02
- Primary source: https://github.com/openai/codex/commit/6c108912eeacabfc82723bf44f8a23f6e2f86585
- Evidence class: Fact for merged code/tests; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

A thread can select different execution environments across turns. If shell-variable inheritance keeps reading only the thread-global permission configuration, execution may use the right filesystem/permission environment while inheriting the wrong environment-variable policy. The merged change moves shell-environment policy ownership into each resolved `EnvironmentConfig` so the selected turn environment governs variable inheritance and explicit values.

## Facts

1. `EnvironmentConfig` now carries a `ShellEnvironmentPolicy` in addition to login-shell, permission-profile and selected-capability-root state.
2. The field is documented as controlling which environment variables shell commands may inherit.
3. `EnvironmentConfig` uses a custom debug representation that prints the shell-environment policy as `<redacted>` because the policy can contain explicit environment-variable values.
4. `SessionConfiguration` now stores `allow_login_shell` and `shell_environment_policy` directly and exposes an `inferred_environment_config()` that combines them with the current permission-profile snapshot when a resolved environment is not available.
5. Turn-environment construction and selection use this inferred configuration as the thread-level fallback.
6. `TurnEnvironment` exposes its resolved shell-environment policy to execution paths.
7. User shell execution calls `create_env` with the selected turn environment's policy instead of the thread-global permission policy, then injects session/apply-patch variables and applies explicit policy-set values.
8. Shell tool handling obtains explicit environment overrides from the selected turn environment's policy, not directly from turn-global configuration.
9. Shell-command construction similarly calls `create_env` with the selected turn environment policy.
10. Unified-exec process setup was changed from turn-global shell policy to the selected environment's policy for both inherited environment construction and explicit overrides.
11. Tests construct a selected environment whose policy intentionally differs from the thread-level policy and verify that the selected environment wins.
12. Test policies use `inherit: None`, `include_only` patterns and explicit `set` values to distinguish inherited-variable filtering from explicit overrides.
13. Unified-exec coverage verifies an output equivalent to `preserved:missing:missing`: the environment-owned explicit value survives while variables allowed only by the conflicting thread policy do not leak through.
14. The change is applied across regular shell commands, user shell tasks and unified exec rather than only one executor.

## Mechanisms

### Policy ownership in `EnvironmentConfig`

The execution environment now carries the policy needed to build its process environment. This couples filesystem/permission selection and shell-variable selection to the same resolved environment boundary rather than mixing environment-local execution with thread-global variable policy.

### Thread fallback through inferred environment config

When an environment does not provide a resolved configuration, the session constructs an inferred `EnvironmentConfig` from current session configuration. This preserves a deterministic fallback without reaching back into the original immutable config object for every execution.

### Inherit/filter then explicit environment values

The selected policy is passed into the existing environment construction path. Tests deliberately configure different inheritance/include patterns and explicit values so the observable result distinguishes variables inherited by policy from values explicitly supplied by the environment policy.

### Secret-aware observability boundary

Because the policy can embed explicit environment-variable values, `EnvironmentConfig` debug output redacts the entire shell-environment-policy field. The environment can own sensitive execution configuration without automatically exposing it through debug formatting.

## Evidence

- `codex-rs/protocol/src/environment.rs` adds `shell_environment_policy` to `EnvironmentConfig` and redacts it in Debug output.
- Session configuration code stores the policy and builds `inferred_environment_config()` for fallback use.
- `TurnEnvironment` exposes the selected environment policy.
- `codex-rs/core/src/tasks/user_shell.rs` uses the selected environment policy for user-shell environment construction and explicit values.
- Shell handlers use the selected environment policy for inherited environment generation and explicit overrides.
- `codex-rs/core/src/unified_exec/process_manager.rs` switches unified exec from turn-global policy to the selected environment policy.
- Shell and unified-exec tests use conflicting thread/environment policies to verify filtering and explicit-override behavior.

## Limitations

1. Shell-variable filtering is not complete process isolation. It does not by itself establish filesystem, network, credential, kernel or child-process isolation.
2. The policy protects inheritance/explicit environment construction only along the changed execution paths; it is not evidence that every external integration consumes the same environment builder.
3. Redacting the policy from `Debug` avoids one log exposure path but does not prove secrets cannot appear in command output, child-process diagnostics or other telemetry.
4. Explicit policy-set variables intentionally survive filtering, so policy correctness depends on who may populate `ShellEnvironmentPolicy.r#set`.
5. The inferred thread fallback is deterministic but still relies on correct session configuration when no resolved environment overrides it.
6. The tests demonstrate selected-environment precedence for concrete handlers and unified exec; they do not prove a general noninterference property between arbitrary environments.

## Comparisons

- Before the change, selecting an execution environment could still leave shell-variable policy sourced from thread-global configuration. The new design aligns variable-policy ownership with the selected environment.
- A single global shell-variable policy is simpler but cannot express environment-specific inheritance/secret boundaries when the same thread targets multiple environments.
- Passing raw environment maps per command would make ownership diffuse. Carrying a policy object in `EnvironmentConfig` provides one reusable source for multiple executors.

## Unresolved questions

1. What authority controls creation and mutation of per-environment `ShellEnvironmentPolicy`, especially explicit secret-like values?
2. Are environment-policy fingerprints persisted so a resumed turn can prove it used the same variable policy as the original attempt?
3. Should sensitive explicit variables be represented by references/handles rather than plaintext values inside the policy object?
4. Do MCP servers, hooks or other subprocess paths use the same selected-environment policy, or do they have separate environment ownership rules?
5. How should conflicts be surfaced when a command-level explicit environment map and an environment policy both define the same key?
6. What additional tests are needed to establish cross-environment non-leakage rather than only expected filtering on selected paths?

## Reading boundary

This note establishes a merged implementation boundary: resolved execution environments now own `ShellEnvironmentPolicy`; regular shell, user-shell and unified-exec paths consult the selected environment's policy, with a session-derived fallback when no resolved environment supplies one; tests demonstrate environment-specific filtering and preservation of explicit environment values, and debug output redacts the policy. It does not establish complete process isolation, secret non-disclosure across all outputs, or universal coverage of every subprocess path. Those broader judgments belong to Skill 04 Analysis.
