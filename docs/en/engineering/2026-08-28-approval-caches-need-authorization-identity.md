---
title: "Approval Caches Need an Authorization Identity"
date: '2026-08-28'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "可复用的审批证据应绑定什么身份，才能在授权撤销后立即失效，而不是只依赖时间新鲜度？"
summary: "A merged OpenAI Codex Guardian v2 change binds cached low-risk results to authorization versions and revalidates them before fast approval. It closes a demonstrated concurrent-revocation race, but only for the authority facts represented by the version tuple."
sources:
  - research/analysis/Q-20260828-03-approval-cache-bound-to-authorization-version.md
item_id: "Q-20260828-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-28-approval-caches-need-authorization-identity-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-28-approval-caches-need-authorization-identity-cover.png"
  kicker="Open-source Engineering · Daily Research"
  title="Approval Caches Need an Authorization Identity"
  summary="A merged OpenAI Codex Guardian v2 change binds cached low-risk results to authorization versions and revalidates them before fast approval. It closes a demonstrated concurrent-revocation race, but only for the authority facts represented by the version tuple."
  version="Q-20260828-03"
  status="Daily Runtime V5 · 2026-08-28"
  languageHref="/zh/engineering/2026-08-28-approval-caches-need-authorization-identity"
  languageLabel="中文"
/>

# Approval Caches Need an Authorization Identity

A low-risk classification can be only seconds old and match the action exactly. It still may be stale if the user revoked authority, conversation history was rewritten, or the root task's authorization context changed during those seconds. Time freshness cannot establish that permission remains the same.

A merged OpenAI Codex Guardian v2 maintainer change demonstrates a stricter cache boundary. Successful low-risk results record a local authorization version, and worker threads may also record a root authorization version. Immediately before fast approval, the system recomputes current authorization. Any mismatch marks the cached result stale and returns the action to review.

The core proposition is that a cached approval result is evidence produced under an authorization identity, not a permission that remains valid because the action matches and the result is recent. The identity must be revalidated at consumption. Even then, equality proves continuity only for the authority dimensions represented by the version.

## Why Recent Approval Evidence Can Still Be Stale

Typical approval caches store an action, parameters, a risk score and creation time. Those fields answer whether this is the same action and whether the result is recent enough. They do not answer whether the governing conditions that allowed the result still hold. Revocation can occur inside the time window without changing the action.

Time staleness and authorization staleness are therefore independent dimensions. A result can be fresh in time and identical in action while expired in authority. Shortening the cache lifetime reduces exposure but cannot close the logical gap.

Eliminating caches entirely is conservative, but it discards the latency and cost benefit of classification and review reuse. A more useful design identifies the facts that define authorization continuity and invalidates evidence when those facts change, rather than flushing on every event or trusting time alone.

## Bind Approval Evidence to Authorization Identity

The selected implementation constructs an authorization version from history-rewrite generation, genuine user-message count and successful host-produced user-input response count. Worker threads may also carry the root task's authorization identity. The tuple is not the approval decision; it describes the authority context in which that evidence was produced.

A cache hit therefore needs several conditions: the action still matches, the risk result remains usable, time conditions hold, and recorded local and root authorization identities still equal the current identities. When they differ, the system does not reinterpret the old low-risk judgment as current permission. It records authorization change and returns to the ordinary review path.

This enables selective invalidation. Events that do not change represented authority facts need not flush everything. History rewrites, user messages or host-input results that do affect authority advance the version. The result is more precise than global invalidation and more meaningful than a time-only key.

## Concurrent Revocation Makes Use-Time Revalidation Necessary

Recording the version only when classification starts is insufficient. Authorization may be revoked while the classifier runs. A late low-risk result can then enter the cache, and a consumer that trusts the recorded pre-revocation context would turn old evidence into post-revocation execution authority.

Maintainer regression coverage exercises that race: authorization changes in flight, the low-risk result completes, and fast approval refuses to consume it. The decisive check sits at the consumption point, where evidence is about to become execution authority.

Use-time revalidation is not automatically an atomic effect boundary. Authorization can change again after the check but before the tool effect. Higher-risk actions may require revalidation and admission to share one atomic commit boundary or may need an effect-time check. The selected evidence closes the demonstrated cache race, not every possible revocation race.

## Version Equality Proves Only Encoded Authority Facts

An authorization version is only as complete as its inputs. If external enterprise policy, tool configuration, organization membership or remote principal identity is omitted, version equality cannot prove those facts are unchanged. A well-structured number can still create confidence beyond its coverage.

Whenever a new authority-bearing input is added, engineers should review the version schema. Does the fact enter local identity, root identity or a separate validity component? Can cached evidence preserve provenance across resume, fork and process recovery? Does external audit require an immutable digest or signed receipt?

The evidence is one merged implementation and maintainer tests, not an independent benchmark. It does not prove classifier correctness, downstream tool correctness or distributed principal binding. It establishes a strong but bounded engineering rule: before reusing approval evidence, prove that the authorization identity under which it was produced is still current.

**Primary evidence:** [OpenAI Codex merged commit 035295b4](https://github.com/openai/codex/commit/035295b46ee4a5962d0e01a66a888d5bf5da4de4). The implementation and concurrency regression support authorization-version binding and use-time revalidation; they do not prove that the tuple covers every authority fact.
