# Q-20260825-01 — Credential Broker Isolation from Project Shell Configuration

- Runtime date: 2026-08-25 (Asia/Shanghai)
- Queue signal: SIG-20260825-013
- Primary source: https://github.com/openai/codex/commit/fd1bf50410623cb25dec8e172ba8ae3ec679397a
- Evidence level: `merged_maintainer_change`
- Scope: Codex project-config loading while credential brokering is effectively enabled, provider environment isolation, shell-startup settings and regression coverage

## Problem

Credential brokering is supposed to mediate credential-provider state outside normal project configuration. If repository-owned configuration can still inject provider environment variables or redirect shell startup behavior while the broker is active, a project can influence the environment from which brokered credentials are resolved or commands are initialized.

## Facts

The selected Codex change introduces an explicit credential-broker state with `Unconfigured`, `Disabled` and `Enabled` branches and applies effective network requirements before project-layer sanitization.

When the broker is effectively `Enabled`, the loader removes project-level `features.shell_snapshot`, removes `shell_environment_policy.experimental_use_profile`, and filters protected entries from `shell_environment_policy.set`. The protected set includes `ZDOTDIR`, `BASH_ENV`, credential-broker provider environment keys recognized by the broker helper, and trusted-binding keys.

The same patch keeps a distinct disabled branch. Regression coverage demonstrates that when credential brokering is disabled, ordinary project shell settings remain available rather than being globally stripped. The tests cover project values including shell snapshot/profile settings and environment entries such as `GH_HOST`, `OPENAI_BASE_URL`, `ZDOTDIR` and `BASH_ENV`.

Broker state is not a static repository flag. The loader derives the effective state in conjunction with network/proxy requirements, so the project-layer sanitization is tied to whether credential brokering is actually active for the effective configuration.

## Vendor Claims

The maintainer change describes the goal as preventing project configuration from influencing credential-provider environment variables or shell startup behavior while credentials are brokered. The changed loader branches and regression tests directly support that bounded statement.

## Mechanisms

1. **Explicit broker lifecycle state:** configuration loading distinguishes unconfigured, disabled and enabled broker states instead of treating credential brokering as an implicit boolean side effect.
2. **Effective-policy-first ordering:** network/proxy requirements are resolved before deciding whether project configuration needs broker-specific hardening.
3. **Project-layer suppression while enabled:** shell snapshotting, profile-based startup and protected environment variables are removed from the project-controlled layer when the broker is active.
4. **Provider-key filtering:** environment keys recognized as credential-provider or trusted-binding inputs are filtered rather than merely documented as sensitive.
5. **Disabled-path preservation:** the patch does not erase legitimate project shell configuration when brokering is not active, reducing the risk of turning a security boundary into a global behavior change.
6. **Regression tests on both branches:** tests exercise active and disabled broker behavior and specific protected startup/environment settings.

## Evidence

Primary evidence is merged maintainer commit `fd1bf50410623cb25dec8e172ba8ae3ec679397a` in `openai/codex`.

The patch changes Codex configuration-loader logic around local/project layers and credential-broker state. It removes broker-sensitive project settings only in the effective enabled branch and contains regression cases demonstrating both suppression and preservation behavior.

The evidence supports a configuration-boundary conclusion: repository-owned settings cannot use the demonstrated project layer to alter the protected provider/shell-startup inputs while the broker is enabled.

## Limitations

This is not proof that every credential-related value in Codex is isolated from all configuration sources. The selected change is specifically about project-controlled configuration and the enumerated shell/provider inputs.

It does not establish that host, user, managed-policy or process-level environment sources cannot affect broker behavior. Those layers have different ownership and precedence rules outside the demonstrated patch.

The filtered key set is implementation-defined. The evidence does not justify claiming that arbitrary future provider variables are automatically protected unless they are recognized by the broker helper or added to the protected set.

The change also does not make shell execution transactional, prevent all secret disclosure after a credential is legitimately issued, or prove end-to-end credential non-exfiltration.

## Comparisons

Without the enabled-state sanitization, a repository could participate in configuring shell startup or protected provider inputs through the same project layer used for ordinary developer preferences. With the change, that layer becomes monotonic at the broker boundary: when credential brokering owns those inputs, project configuration can no longer widen or redirect the demonstrated provider/startup state.

This is closer to an ownership transfer than a generic denylist. The important property is that broker-owned state is removed from the project-controlled decision surface only while the broker is actually authoritative.

## Unresolved Questions

- Which configuration layers above project scope are intentionally allowed to influence broker provider state, and how is that authority documented?
- How are newly introduced credential-provider environment keys enrolled into the protected-key classifier?
- Are resume/reload paths guaranteed to recompute the effective broker state before reapplying project configuration?
- Is there telemetry that records which project settings were suppressed without exposing their sensitive values?

## Reading Conclusion

The selected Codex change establishes a narrow but meaningful authority boundary: when credential brokering is effectively enabled, project configuration is prevented from controlling the demonstrated provider environment and shell-startup inputs, while the disabled branch preserves ordinary project behavior. The defensible conclusion is project-layer isolation for the protected broker-owned inputs, not universal credential isolation across every configuration source or execution phase.
