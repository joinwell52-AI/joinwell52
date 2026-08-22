# Q-20260822-02 — Monotonic Remote Network Policy Composition

- Runtime date: 2026-08-22 (Asia/Shanghai)
- Queue signal: SIG-20260822-014
- Primary source: https://github.com/openai/codex/commit/f580dd886fe57259168c0afc0e3e7820942eed14
- Evidence level: `merged_maintainer_change`
- Scope: OpenAI Codex remote execution network-policy enforcement

## Problem

A remote execution environment can carry attachment-owned traffic restrictions while the controller, permission profile and prior reviewed network decisions impose other constraints. A naïve merge can accidentally expand capability: an owner allowlist might erase controller denies, a saved approval might bypass a strict owner policy, or sandbox escalation might escape the environment owner's network ceiling.

## Facts

The change makes `EnvironmentConfig.network_policy` enforceable for remote execution rather than rejecting every configured policy. `EnvironmentNetworkPolicy` intentionally covers traffic restrictions—domain rules, Unix-socket rules, upstream proxy use, local binding and a strict managed-allowlist flag—while proxy enablement, listeners, network mode, MITM and credentials stay outside attachment-owned policy.

`EnvironmentNetworkPolicy::apply_to()` replaces soft domain grants with owner rules but restores inherited controller domain denies afterward. Unix-socket permissions are intersected: controller denies take priority, socket grants survive only when compatible with both sides, and “allow all sockets” is effective only when both inherited and owner policy permit it. `allow_upstream_proxy` and `allow_local_binding` are combined with logical AND.

`NetworkProxySpec::for_environment()` starts from the controller recomputed for the selected permission profile, or from an executor-side managed proxy when there is no controller. It rejects an environment policy if managed network enforcement is disabled or if a present controller proxy is disabled.

A fixed controller allowlist remains a ceiling. A strict attachment policy (`managed_allowed_domains_only`) also makes allowlist misses hard-deny. Saved network grants from execution policy are applied only when expansion remains reviewable; saved denies are always applied. Owner/protected denies are restored after saved decisions so an earlier grant cannot erase them. The resulting policy is validated against controller constraints before use.

Strict attachment allowlists disable the fallback approval decider, while reviewable policies can use network approval. Tool orchestration rejects a request for escalated sandbox permissions when that escalation would bypass an attachment-owned network policy.

The commit adds tests for policy composition, owner and controller denial preservation, strict versus reviewable allowlists, scoped remote proxy behavior, network approvals/denials, offline execution, unsupported authority and escalation rejection.

## Vendor Claims

The commit states that remote environment network policy is now composed with controller constraints and saved decisions while preserving inherited denials, keeping strict allowlists non-expandable and preventing sandbox escalation from bypassing owner policy. The implementation and tests directly demonstrate these claims for the changed network-policy path.

## Mechanisms

1. **Owner/controller separation:** attachment policy is a portable traffic-policy subset, not authority over proxy runtime settings.
2. **Deny restoration:** inherited controller domain denies and protected denies are re-applied after owner rules and saved decisions.
3. **Socket intersection:** Unix-socket grants require compatibility; deny wins over allow-all.
4. **Boolean intersection:** upstream-proxy and local-binding permissions require both controller and owner approval.
5. **Fixed-ceiling detection:** controller hard-deny allowlists and explicitly non-expandable constraints prevent later allow expansion.
6. **Saved-decision scoping:** cached grants extend only reviewable policy; saved denies remain admissible and owner denies are restored last.
7. **Approval-path suppression:** strict attachment allowlists remove the fallback network approval decider.
8. **Escalation rejection:** tool orchestration rejects sandbox escalation when it would bypass an attachment-owned network policy.
9. **Post-merge validation:** effective proxy configuration is checked against managed constraints before execution.

## Evidence

Primary evidence is merged maintainer commit `f580dd886fe57259168c0afc0e3e7820942eed14`. The changed `environment_policy.rs` explicitly preserves inherited domain/socket denials and intersects permissive booleans. `network_proxy_spec.rs` defines merge order, fixed-allowlist behavior and saved-decision handling. Tests exercise disabled-controller rejection, preserved denies, strict external profiles, wildcard/constraint rejection and scoped approval behavior.

## Limitations

This is not proof that every remote-execution capability is monotonically non-expandable. The demonstrated composition concerns network traffic policy and the related sandbox-escalation path.

The owner policy itself is accepted only within the represented fields. Other capabilities—filesystem, process privileges, credentials, tool availability or application-level authorization—have separate enforcement paths.

Reviewable policies can intentionally gain network access through approved/saved grants when the controller permits expansion. “Monotonic” therefore means fixed ceilings and denials are not erased; it does not mean effective access can never increase after a legitimate review decision.

The design depends on correct normalization and validation of domains/socket paths and on the controller constraints accurately representing the intended ceiling.

## Comparisons

A union-based merge of allowlists is unsafe because any participant can widen capability. This implementation instead uses asymmetric composition: grants are conditional and sometimes replaceable, while protected denies are restored and strict ceilings suppress approval-based expansion. It resembles capability intersection for fixed constraints plus a separately governed review channel for explicitly expandable policy.

## Unresolved Questions

- What persistence scope and invalidation rules govern saved network decisions across environment identities, commands and policy revisions?
- Are domain normalization, wildcard and DNS-rebinding behaviors covered strongly enough to preserve the intended deny ceiling at runtime?
- How are controller constraint changes reconciled with already-running execution-scoped proxies?
- Do all remote execution tool runtimes pass through the same environment policy and escalation checks, including future tool types?

## Reading Conclusion

The defensible result is that this Codex change implements a **network-specific, multi-owner constraint composition** where inherited denials and strict allowlists remain ceilings, saved grants are admitted only on reviewable paths, and sandbox escalation cannot bypass attachment-owned network policy. It should not be generalized into a claim that all remote-execution permissions are non-expandable.
