---
title: "Stable Identity Does Not Authorize a Destination"
date: '2026-09-06'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "当持久智能体状态被恢复到重建或不同的目的地时，即使逻辑智能体或工作流身份保持稳定，系统仍必须重新验证什么？"
summary: "Stable logical identity can attribute durable state to the right principal, but it cannot prove that a new workspace is compatible or grant present execution permission. Safe recovery separately verifies identity, continuity, destination, and authority."
sources:
  - research/analysis/Q-20260906-03-principal-identity-destination-authority.md
item_id: "Q-20260906-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-06-stable-identity-does-not-authorize-destination-editorial-v2.webp"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-06-stable-identity-does-not-authorize-destination-editorial-v2.webp"
  kicker="Open-source Engineering · Daily Research"
  title="Stable Identity Does Not Authorize a Destination"
  summary="Stable logical identity can attribute durable state to the right principal, but it cannot prove that a new workspace is compatible or grant present execution permission. Safe recovery separately verifies identity, continuity, destination, and authority."
  version="Q-20260906-03"
  status="Daily Runtime V5 · 2026-09-06"
  languageHref="/zh/engineering/2026-09-06-stable-identity-does-not-authorize-destination"
  languageLabel="中文"
/>

# Stable Identity Does Not Authorize a Destination

Durable state is restored to the correct logical agent, and every stored checksum matches. The system then allows that agent to continue inside a different workspace. Correct attribution proves whose state this is. It does not prove that the destination may host it, or that the principal may perform these actions there now.

The core proposition is: **stable principal identity enables trustworthy state attribution but does not grant destination or execution authority. Safe resume separately proves identity, continuity, current destination compatibility, and current permission.**

## Stable Identity Solves Attribution, Not Permission

A restore path faces two opposite errors. When names are duplicated, sessions are transient, or targets disappear, state can bind to the wrong principal. Even when the principal mapping is correct, destination trust, configuration, instructions, permissions, or current work state may have changed.

Treating restore as deserialization collapses both errors into “load succeeded.” A stronger design makes “find the correct principal” necessary but not sufficient.

## Two Implementations Expose Complementary Boundaries

The same-date Research Object compares two merged open-source implementations.

An OpenAI Agents SDK maintainer change derives stable restoration identity from the agent graph, disambiguates duplicate names, and avoids promoting transient bound-session objects into durable principal identity. In the covered identity-aware restore path, a required target that cannot be resolved fails closed instead of silently binding to a convenient substitute.

A separate OpenAI Codex maintainer change handles managed-worktree restore and ownership. It does not admit the destination from source identity alone. The covered path re-evaluates source-to-destination trust compatibility, destination configuration and state, active or queued disqualifiers, projected developer instructions, permission profile, and session facts.

The first sample strengthens “whose state is this?” The second strengthens “may this place accept it now?” They are separate repositories maintained by the same organization, not independent-vendor replication. They support a pattern in the examined code paths, not a cross-industry standard.

## Four Gates Decide Whether Resume Is Admitted

A governed restore can expose four auditable gates:

| Gate | Core question | Example failure |
|---|---|---|
| Principal identity | Which logical agent or workflow owns the state? | Duplicate target or missing mapping |
| State continuity | Is the saved state, lineage, and resumable context valid? | Broken lineage or incompatible version |
| Destination compatibility | May the current workspace, session, or environment host it? | Trust or configuration mismatch |
| Execution authority | What may this principal do here now? | Expired permission, changed scope, instruction conflict |

Resume enters execution only when all four hold. Stable identity can make restoration deterministic without making it permissive. A trusted destination cannot repair a wrong principal or broken lineage.

Denials should preserve their identity. “Principal unresolved,” “state discontinuous,” “destination incompatible,” and “not authorized now” require different remediation. If every case returns “restore failed,” operators may add retries that hide an authority problem.

## Workspaces, Sessions, and Forks Are Re-admission Boundaries

A destination can change independently while durable state sleeps. Repository configuration may be updated. Trust level may change. New work may enter the queue. Permissions may narrow. Developer instructions may project differently. Another owner may occupy the original session.

Workspace migration, session reconstruction, and agent fork should therefore trigger destination-sensitive re-admission. Slowly changing facts may be cached, but the cache needs a freshness rule. A cache without version, time, or change triggers merely moves stale authority into recovery.

Forking deserves special attention. A child agent may inherit task context or part of a state lineage without inheriting approvals that belonged only to the parent. State continuity and authority continuity are different propositions.

## One Function May Perform the Checks; Evidence Cannot Collapse

A small, single-process, tightly controlled application may reasonably perform all four checks in one restore function. The proposition does not demand four services or four network calls. It demands distinguishable evidence semantics.

The function should return an auditable decision reason and record the checked principal, state version, destination identity, configuration, and permission version. An interface may show only “resumable” or “denied”; the control record must still answer which gate failed and whether new evidence permits another attempt.

Another counterargument is cost: destination checks on every migration can be expensive. Risk-proportionate policy is reasonable. A read-only resume and a resume that can mutate external systems may use different thresholds. Reducing checks must be an explicit policy choice, not an authority inference from successful state loading.

## External Effects Need Their Own Caution

The four gates establish current resume admission. They do not establish whether an earlier external action occurred exactly once. A request emitted before a checkpoint may have succeeded, remained in flight, or produced an unknown outcome.

External-effect identity, idempotency keys, reconciliation, and compensation evidence therefore remain separate from state restoration. Reconstructing memory cannot prove the result of a payment, deployment, message, or remote write. When a previous outcome is unknown, the system should query or reconcile before deciding to continue, compensate, or stop.

## Evidence Boundary and Open Questions

The two samples do not establish a universal portable agent identity, human authentication, legal authorization, distributed exactly-once execution, or coverage of every restoration path. Stable graph identity may itself become stale after topology change. Destination evidence also decays when it lacks freshness binding.

Open questions include how principal identity survives model or graph change; which destination facts belong in a freshness identity; how cross-vendor runtimes exchange lineage without exchanging permission; how authority should narrow across fork or migration; and what evidence is required when a prior external effect remains uncertain.

The safest engineering rule is simple: treat recovery as re-admission. Prove whose state it is, then prove continuity, destination compatibility, and the principal's current permission to execute there.

**Evidence and sources:**

- [OpenAI Agents SDK stable graph identity implementation](https://github.com/openai/openai-agents-python/commit/4a11d20d126ebc844e362ae3abfe13b775dbaee3)
- [OpenAI Codex managed-worktree destination re-admission implementation](https://github.com/openai/codex/commit/f6976ab0369921a59e23416083587149807d8f93)
