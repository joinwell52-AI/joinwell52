# Q-20260819-01 — Child-agent roles may customize behavior but must not expand parent authority

- Runtime date: 2026-08-19
- Column: Digital Employee
- Source object: Q-20260819-01
- Primary source: https://github.com/openai/codex/commit/1a6e07a4febcc0ecfa04464f5e95cb47144cd746
- Evidence class: Fact for merged code/tests; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

A child-agent role is useful only if it can specialize behavior without becoming a second authority channel. If a role file can replace approval policy, sandbox policy, provider routing, MCP servers, endpoints or other parent-owned controls, delegation can silently become privilege expansion. The merged Codex change narrows role application to a typed set of behavioral overrides and capability reductions while preserving the parent-derived authority configuration.

## Facts

1. The merged change describes the design goal explicitly: agent roles may customize a child agent but must not expand authority or replace provider configuration inherited from the parent session.
2. Role application is now projected into a typed `AgentRoleOverrides` object rather than treating arbitrary role TOML as an unrestricted high-precedence configuration layer.
3. The mutable role fields in that projection are developer instructions, model, model reasoning effort, model reasoning summary, model verbosity, personality, service tier, selected feature disables and selected skill disables.
4. Feature handling is reduction-oriented. The role projection only records `false` for a bounded set of capabilities including ShellTool, Apps, Personality, Plugins, MemoryTool and RequestPermissionsTool.
5. Skill handling is also reduction-oriented: enabled entries are removed from the projected override, and `max_context_tokens` is not carried through as a role-controlled override.
6. The next child configuration is built by cloning the parent-derived `Config` and selectively applying only the bounded role fields.
7. Tests assert that parent permissions, model-provider identity and full provider configuration, approval reviewer, MCP servers, ChatGPT base URL and notification configuration remain unchanged after applying a hostile role configuration.
8. The projected role layer is tested not to contain authority-bearing keys such as `model_provider`, `approval_policy`, `sandbox_mode`, `notify`, `apps` or `mcp_servers`.
9. Managed feature requirements remain effective even when the role attempts to disable capabilities; the role cannot use its layer to escape the parent/managed requirement system.
10. User role files are read through the sensitive-file path and symlinked role files are rejected; the regression test expects a symlinked custom role to fail as unavailable.
11. The same bounded `apply_role_to_config` path is used for the multi-agent implementation and for resumed agents.
12. Resume tests assert that a cold-reloaded worker inherits the resumed parent’s complete model-provider configuration, and a modified role file cannot redirect resumed model requests to a newly supplied provider endpoint.
13. Model choice itself remains role-mutable. The authority invariant therefore is not “child config equals parent config”; it is “only the declared behavioral subset may differ, while parent-owned authority and routing fields remain outside role control.”

## Maintainer claims

The commit message claims authority preservation, managed feature enforcement, symlink rejection, provider inheritance and equivalent bounded-role handling for resumed agents. These claims are directly backed by merged implementation and regression tests in the same change. They should still be scoped to the demonstrated Codex configuration boundary rather than treated as a proof of complete delegation security.

## Mechanisms

### Typed projection instead of unrestricted configuration merge

The role file is parsed, but only values represented by `AgentRoleOverrides` are projected into the role layer. This changes the trust boundary: unsupported keys may exist in the source role TOML, but they do not become writable child configuration merely because they appear in a high-precedence file.

### Parent-clone plus selective mutation

`build_next_config` begins from a clone of the already derived parent configuration and mutates the permitted role fields. Authority-bearing fields therefore survive by construction unless they are explicitly part of the typed override set.

### Monotonic capability reduction

For sensitive feature and skill controls, the role path accepts reductions but not enabling expansion. This is a monotonicity rule: specialization can remove some capabilities from the inherited set but does not obtain a second channel to turn on additional privileged facilities.

### Managed requirements remain above the role layer

The implementation keeps managed feature requirements effective while applying role reductions. A child role therefore cannot reinterpret a managed requirement as merely another local preference.

### Resume uses the same bounded path

The cold-resume regression closes a lifecycle gap: restoring an existing worker does not reintroduce the former unrestricted role merge. Provider inheritance is rechecked after reload, and a role-file edit attempting provider redirection is shown not to move resumed requests.

### Symlink rejection narrows role-file provenance

Rejecting symlinked user role files prevents a configured role path from transparently resolving through a link to another file. This is a filesystem trust-boundary hardening for role configuration, not a general filesystem sandbox.

## Evidence

- The role module comment was changed from applying generic configuration layers to applying bounded agent-role overrides.
- `AgentRoleOverrides` enumerates the behavioral and reduction fields that may be projected from a role.
- Authority-preservation tests compare the resulting child against the parent for permissions, provider configuration, approval reviewer, MCP servers, base URL and notifications.
- Role-layer tests verify authority-bearing keys are absent from the projected layer.
- Managed-feature tests verify role application respects externally required feature state.
- A Unix regression test rejects a symlinked role file.
- Multi-agent resume tests verify provider inheritance after cold reload and verify that editing the role to point at a redirected provider does not redirect resumed requests.

## Limitations

1. The demonstrated guarantee is a Codex configuration-layer invariant, not end-to-end proof that a delegated agent can never cause a larger external effect than its parent intended.
2. A role may still change model behavior, instructions, personality and selected service/model settings. Those behavioral changes can affect decisions even though authority-bearing configuration remains inherited.
3. Capability reduction is proven only for the feature and skill fields handled by this code. This note does not claim a complete capability lattice for every Codex subsystem.
4. Preserving MCP server configuration does not prove that every MCP tool call is authorized correctly at runtime or that external MCP servers are safe.
5. Provider inheritance prevents this demonstrated role-based routing substitution; it does not authenticate the provider or prove network-endpoint integrity beyond the inherited configuration.
6. Symlink rejection applies to the role-file loading path shown here; it is not a general guarantee against all path or filesystem attacks.
7. Tests cover the merged paths and selected invariants, not every future field that may be added to `Config` or every agent lifecycle.

## Comparisons

- An unrestricted high-precedence role layer is flexible but creates a parallel authority plane. The new typed projection makes role specialization narrower and auditable.
- Copying the entire parent configuration without allowing any role changes would preserve authority but remove useful specialization. The merged design instead permits a named behavioral subset plus reductions.
- Relying only on spawn-time checks leaves resume as a potential privilege-regression path. Reusing the same bounded application path and testing cold resume makes the lifecycle invariant stronger.

## Unresolved questions

1. Is there a machine-readable invariant or schema test that will fail when a newly added authority-bearing `Config` field is accidentally introduced into role overrides later?
2. How are runtime tool permissions and external side effects tied back to the inherited configuration after model behavior changes?
3. Are role files signed, versioned or otherwise provenance-bound beyond the symlink restriction?
4. Can administrators express an explicit maximum capability set for a role in a form that is independently auditable from the child’s effective configuration?
5. Does every future resume/fork/migration path call the same bounded role application function, or can another reconstruction path bypass it?
6. How should monitoring surface the exact delta between parent authority, child behavior overrides and child capability reductions?

## Reading boundary

This note establishes a merged and tested configuration mechanism: Codex projects agent roles into a bounded set of behavioral overrides and capability reductions, preserves parent-owned permission/provider/MCP/routing controls, respects managed feature requirements, rejects symlinked user role files, and applies the same bounded path to resumed agents. It does not establish complete delegation security, external-side-effect containment, provider authenticity or a universal capability model. Those broader judgments belong to Skill 04 Analysis.
