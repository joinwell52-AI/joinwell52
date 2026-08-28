---
schema: publication-candidate-article/v2
title: "Cached Policy Is Evidence, Not Current Authority"
date: '2026-08-28'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "当系统明确要求最新远程权限时，缓存策略还能保留什么价值，又必须失去什么权力？"
summary: "GitHub Copilot CLI 1.0.81's official changelog separates cache readability from authority admissibility: stale policy may remain evidence, but it must not silently preserve governed capabilities while fresh remote authority is unresolved."
cover: staging/publication-candidates/2026-08-28-cached-policy-is-evidence-not-current-authority-cover.png
sources:
  - research/analysis/Q-20260828-02-fresh-authority-over-cache-availability.md
---

![Cached Policy Is Evidence, Not Current Authority cover](staging/publication-candidates/2026-08-28-cached-policy-is-evidence-not-current-authority-cover.png)

# Cached Policy Is Evidence, Not Current Authority

Enterprise systems often treat a cache hit as evidence that state remains valid. For presentation settings or performance data, that shortcut usually affects only freshness. When configuration decides whether a tool may execute, a plugin may change, or a safety restriction may be bypassed, readable stale data and continuing permission are categorically different facts.

GitHub Copilot CLI 1.0.81's official changelog provides a bounded case. When forced remote-settings refresh is enabled, neither the one-hour cache fast path nor the documented 24-hour stale fallback can substitute for fresh managed policy. Until fresh policy is successfully obtained, a named set of governed capabilities enters a restrictive posture.

The core proposition is that when the governing contract explicitly requires current remote authority, stale policy may remain stored evidence but must lose its power to authorize behavior. Inability to confirm freshness should become an explicit, scoped and recoverable restrictive authority state—not a silent return to the last permitted result.

## Cached Data Can Remain While Authority Expires

A cache can retain at least three kinds of value. It can show operators the last known configuration, preserve provenance and revision data, and support availability on surfaces that do not make authorization decisions. None of those values requires the object to continue approving actions.

Authority admission answers a different question: does the current governor still allow this capability? If remote policy may have revoked permission, an old copy cannot prove that revocation did not occur even when its format, contents and provenance remain intact. Interpreting file presence as permission continuity allows the cache layer to overrule the authorization layer.

Policy objects therefore need more than present or absent. They should carry provenance, revision identity, acquisition time, a current freshness judgment, and the capability scopes for which they remain admissible. Data lifecycle and authority lifecycle may reference the same object without sharing one boolean.

## Freshness Belongs to Evidence Admission

The important behavior in the selected contract is that forced refresh rejects both the normal fast path and stale fallback. This is not merely more aggressive networking. It changes the evidence threshold: only newly obtained remote policy can satisfy the authority condition required by the current action.

That distinction prevents hidden degradation. Automatically using the last permitted result after a network failure preserves apparent availability by converting unknown current authority into continuing permission. No new authoritative source supports that conversion, and no explicit risk acceptance occurred, so it is not neutral fault tolerance.

Stale policy remains worth preserving. It explains why the system made an earlier decision, supports difference analysis, and helps diagnose control-plane failure. Later execution, however, must read whether that evidence is currently admissible—not only what it says. Freshness becomes part of authorization evidence rather than cache performance metadata.

## Undetermined Must Be a Governed Authority State

The official note names a restrictive scope that includes non-default model-context-protocol servers, bypass-permissions mode, and selected policy-governed plugin and marketplace operations. Two boundaries matter: the posture applies to named capabilities, and the evidence is a product changelog rather than source code.

An auditable undetermined state needs at least four facts: which capabilities are restricted, why current authority cannot be confirmed, what event restores eligibility, and who may authorize an exception. Downstream consumers must not interpret it as unrestricted, and unrelated capability families should not inherit identical failure semantics without an explicit contract.

Recovery should also be observable. Successfully obtaining fresh policy can trigger a new eligibility decision. Waiting, restarting, or discovering that the stale object still parses cannot establish updated authority.

## Availability Exceptions Need Explicit Authority

Strict freshness reduces availability during remote control-plane failure. Some low-risk, read-only and reversible capabilities may justify a governed grace period. That period must define capability scope, risk, duration, audit and revocation conditions; a generic cache layer should not invent it automatically.

For high-impact writes, permission bypass or plugin mutation, the risk that stale policy preserves revoked authority can outweigh temporary unavailability. Fail-closed behavior is then not a cache defect. It is the system honestly reporting that current permission cannot be proved.

## Implementation Questions the Release Note Leaves Open

The selected source does not disclose which revision, account or organization identity defines freshness; how remote responses are authenticated; how retries work; how malformed payloads are handled; or what happens to already-running capabilities when policy becomes undetermined mid-session. The product contract supports the restrictive state, not a claim that undisclosed internals are secure.

A design review should still ask: which authority identity is policy evidence bound to? Can that identity change between fetch and use? Can a denial receipt distinguish stale authority from network and payload failure? Which capabilities allow grace, and who approves it? Those answers determine whether fresh policy is a verifiable authorization condition or only the name of a refresh operation.

**Evidence note:** [2026-08-28 Research Object](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260828-02-fresh-authority-over-cache-availability.md) provides a bounded analysis of the GitHub Copilot CLI 1.0.81 official changelog. The source supports named product behavior; it is not source-level proof of authentication or validation internals.
