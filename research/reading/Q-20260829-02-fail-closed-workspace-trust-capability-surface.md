# Q-20260829-02 — Fail-Closed Workspace Trust Shapes the Effective Capability Surface

- Runtime date: 2026-08-29 (Asia/Shanghai)
- Queue signal: SIG-20260829-021
- Primary source: https://github.com/google-gemini/gemini-cli/commit/0bd1d439751478771c45d3d0895a6a9760554bf4
- Evidence level: `merged_maintainer_change`
- Scope: Gemini CLI workspace trust resolution, restricted mode, unknown trust, MCP/policy/tool/telemetry configuration and effective capability reduction

## Problem

Workspace trust is unsafe if it is only a UI label while repository-controlled configuration can still expand executable capabilities. An unresolved trust state is especially important: treating `undefined` as effectively trusted turns missing authority evidence into permission. A restricted execution mode is also incomplete if it marks a workspace untrusted but still loads repository MCP servers, tool settings or policy paths.

The bounded architecture question is whether trust resolution directly changes the configuration admitted into the Runtime, and whether negative or uncertain trust fails closed before repository-provided capability definitions become effective.

## Facts

The merged Gemini CLI change gives environment-level restrictions the highest demonstrated precedence in `checkPathTrust`. If `GEMINI_RESTRICTED_MODE=true` or `GEMINI_CLI_TRUST_WORKSPACE=false`, the function returns `{ isTrusted: false, source: 'env' }`. An explicit `GEMINI_CLI_TRUST_WORKSPACE=true` returns trusted only after the restricted/untrusted check, so restricted mode cannot be overridden by the positive trust environment variable in this code path.

When folder trust is disabled, `checkPathTrust` deliberately returns trusted. When folder trust is enabled, the resolver next considers IDE workspace trust, then the trusted-folders file. Configuration errors in trusted-folders parsing are raised as `FatalConfigError`; malformed trust configuration is therefore not silently converted into trust. If no IDE/file decision exists, the resolver returns `isTrusted: undefined`.

`Config.isTrustedFolder()` was changed to recompute the trust result through `checkPathTrust`. An explicit negative result returns `false`. An environment-sourced result is authoritative. If no such decisive result exists, an explicitly supplied `trustedFolder` may be used; otherwise the final expression is `isTrusted ?? false`. The important uncertainty boundary is therefore explicit: an unresolved trust result becomes untrusted rather than trusted.

The CLI configuration load path now accepts the effective trust decision. When that path is untrusted, it constructs a sanitized settings value with `mcpServers`, `policyPaths`, `adminPolicyPaths`, `tools` and `telemetry` removed. The original settings object is not mutated; tests verify the original fields remain present while the produced `Config` and policy-engine inputs no longer expose those untrusted values.

The sanitized `safeMcpServers` value is used both when constructing policy settings and when constructing the main `Config`. This closes a split-brain path where policy evaluation might see one MCP surface while Runtime configuration sees another.

The tests cover both sides of the boundary. With `trusted=false`, MCP servers, policy paths, admin policy paths, tool settings and telemetry routing from the supplied settings are absent from the effective configuration/policy inputs. With `trusted=true`, those values are retained. Separate trust tests verify environment-forced untrusted state, restricted mode, positive environment trust and unresolved fallback behavior.

## Vendor Claims

The commit is titled `fix(core): enforce fail-closed workspace trust and filter mcpServers in restricted mode (#29099)`. The changed trust utility, `Config.isTrustedFolder()` logic, configuration sanitization and regression tests directly support a bounded claim: negative or unresolved trust is prevented from silently becoming a trusted workspace, and untrusted configuration cannot carry the demonstrated repository-controlled MCP/policy/tool/telemetry settings into the effective Runtime configuration.

## Mechanisms

1. **Restrictive environment precedence:** restricted mode and explicit false trust return untrusted before a positive trust environment variable is considered.
2. **Structured trust source:** the result records whether authority came from environment, IDE, file or remained unresolved.
3. **Fatal malformed trust configuration:** trusted-folder file errors abort rather than defaulting to trust.
4. **Unknown → false:** unresolved trust falls back to false in `Config.isTrustedFolder()`.
5. **Admission-to-capability coupling:** the trust decision is passed into configuration loading rather than remaining a display-only property.
6. **Untrusted settings sanitization:** MCP server definitions, policy paths, admin policy paths, tool settings and telemetry settings are removed from the effective settings object used to construct Runtime/policy configuration.
7. **Consistent MCP surface:** the same sanitized MCP value is passed to the policy engine and main configuration.
8. **Non-mutating reduction:** source settings are preserved while the admitted effective configuration is narrowed, making the trust boundary explicit rather than destructively rewriting the source object.
9. **Positive-path symmetry:** tests confirm trusted workspaces retain the same categories that are stripped in the untrusted path.

## Evidence

Primary evidence is merged Gemini CLI maintainer commit `0bd1d439751478771c45d3d0895a6a9760554bf4`.

`packages/core/src/utils/trust.ts` establishes the trust-source precedence. Restricted mode or explicit negative environment trust yields an environment-sourced false result. Folder-trust-disabled mode is an explicit product decision to trust; otherwise IDE and trusted-folder-file sources are consulted, and absence of a decision returns `undefined`.

`packages/core/src/config/config.ts` changes `Config.isTrustedFolder()` so an explicit false dominates, environment trust remains authoritative, and unresolved state ultimately falls back to false.

`packages/cli/src/config/config.ts` sanitizes the settings used for untrusted configuration, removing `mcpServers`, `policyPaths`, `adminPolicyPaths`, `tools` and `telemetry`, and uses the sanitized MCP value consistently in policy and Runtime configuration.

The added trust-evaluation and configuration tests verify environment/restricted-mode decisions, unknown-state failure closed, untrusted capability removal, trusted retention, and preservation of the original source settings object.

## Limitations

The capability reduction occurs in the demonstrated configuration-loading path. This Reading does not prove that an already-running MCP process or tool connection is dynamically terminated if workspace trust changes after initialization.

`isFolderTrustEnabled=false` is an explicit configured trust mode and returns trusted; the system is therefore not universally fail-closed against every administrator-selected trust policy. The fail-closed conclusion applies to uncertainty and demonstrated untrusted/restricted signals within the enabled trust model.

The sanitization removes the demonstrated settings categories from the supplied settings value. It does not prove that every possible capability source in Gemini CLI is represented by those fields, or that built-in tools, extensions, environment credentials and host-level permissions are all disabled.

The commit prevents untrusted repository settings from shaping the demonstrated MCP/policy/tool/telemetry surface. It does not prove that the contents of a trusted workspace are safe, that an MCP server definition is benign, or that policy rules themselves are correct.

The trust result is a local Runtime decision, not a signed authorization receipt. There is no demonstrated cross-host principal binding or cryptographic proof that another component evaluated the same workspace state.

## Comparisons

A UI-only trust badge can communicate risk while still leaving the executable surface unchanged. This change instead connects the admission decision to the configuration that can create tools, MCP servers and policy behavior.

Fail-open uncertainty would map `undefined` to trusted and make absence of evidence equivalent to permission. The new fallback maps unresolved trust to false. Malformed trusted-folder configuration is handled separately as fatal error, preserving the distinction between unknown, explicitly denied and invalid configuration.

Blanket process shutdown would be stronger than configuration filtering but would solve a different lifecycle problem. The selected change is primarily an admission-time surface reduction: do not construct the untrusted capability surface in the first place.

## Unresolved Questions

- If trust changes from true to false during a live session, which already-materialized MCP connections, tools and policy objects are revoked or rebuilt?
- Are extension-provided or host-provided capabilities governed by the same workspace-trust decision, or by separate authority domains?
- Can workspace trust be versioned so a tool invocation proves which trust decision admitted its capability surface?
- Which configuration layers are represented by the `settings` value that is sanitized, and can higher-precedence user/admin sources be distinguished from repository-controlled fields at this boundary?
- Should telemetry be independently governable from executable tool capability, or is stripping both under untrusted workspace the intended product contract?
- What audit evidence records the transition from unresolved/untrusted to trusted, especially in long-lived resumed sessions?

## Reading Conclusion

The Gemini CLI change turns workspace trust into an execution-surface boundary rather than a presentation flag. Restricted mode and explicit negative trust dominate; malformed trust configuration fails; unresolved trust falls back to false; and the untrusted load path removes the demonstrated MCP, policy, tool and telemetry settings before constructing effective Runtime configuration. This is a concrete fail-closed pattern: uncertain authority reduces capability until trust is positively established. The evidence is strongest for configuration-time admission and does not prove universal live revocation, complete capability coverage or that trusted content is intrinsically safe.
