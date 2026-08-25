---
title: "Finding a Resource Is Not Owning It"
date: '2026-08-25'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "When a mutable runtime resource can move or change between discovery and lock acquisition, which observations remain trustworthy once the migration actually obtains authority to act?"
summary: "A merged Codex rollout-migration change treats paths and pre-lock observations as provisional. Correct mutation requires post-authority rediscovery and reread, while busy contention and terminal failure remain distinct lifecycle facts."
sources:
  - research/analysis/Q-20260825-03-post-authority-resource-revalidation.md
item_id: "Q-20260825-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-25-finding-resource-not-owning-it-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-25-finding-resource-not-owning-it-cover-v2.png"
  kicker="Open-source Engineering · Daily Research"
  title="Finding a Resource Is Not Owning It"
  summary="A merged Codex rollout-migration change treats paths and pre-lock observations as provisional. Correct mutation requires post-authority rediscovery and reread, while busy contention and terminal failure remain distinct lifecycle facts."
  version="Q-20260825-03"
  status="Daily Runtime V5 · 2026-08-25"
  languageHref="/zh/engineering/2026-08-25-finding-resource-not-owning-it"
  languageLabel="中文"
/>

# Finding a Resource Is Not Owning It

A migration discovers a rollout file, reads its metadata and decides it is empty. Before the worker obtains the writer lock, another process appends data or archive maintenance moves the file to a compressed path. The original observation was accurate when made and unsafe when used.

A Codex maintainer change merged on 2026-08-25 hardens this boundary. Startup migration can rediscover rollout paths, reread apparently empty rollouts while holding the writer lock, retry path resolution after movement, and keep lock contention as a recoverable busy outcome. Terminal failures remain separate and require deliberate recovery.

The general engineering lesson is: **discovery is provisional evidence, not execution authority.** When a resource can change between observation and ownership, correctness requires revalidating identity, location and decision-relevant state after authority is acquired and before mutation begins.

## A path is a locator, not a durable identity

Snapshot-style migration often combines discovery and decision. It finds a filename, reads state and carries both forward as though the resource remained still. Concurrent writers, archive jobs and compressors break that assumption without making the original discovery “wrong.” The locator simply expired.

The selected change represents input as fresh discovery or a known path set and adds rediscovery helpers. If metadata read encounters `NotFound`, the migration resolves the rollout's current path and tries again. If the file moves after metadata was read but before lock acquisition, the post-lock path check can rediscover it again.

This only works because the system has a logical notion of the rollout that survives supported suffix or location transitions. That identity is the durable subject; the pathname is one current way to reach it. Systems that use a path itself as identity cannot distinguish legitimate movement from replacement.

## Authority changes which observations can justify mutation

Writer ownership does more than prevent a simultaneous write. It defines the point after which the worker may form a mutation decision from current state. Facts observed before that point are hints when concurrent mutation is possible.

The apparently empty rollout illustrates the rule. A writer may create a path before making `SessionMeta` durable. Treating the first empty read as final can permanently skip real work. The hardened migration acquires the writer lock and rereads before concluding that there is nothing to migrate.

Post-authority revalidation should cover every fact that can change the decision: logical identity, current locator, relevant metadata and—where appropriate—a revision or content hash. It need not reread immutable facts. The design obligation is to identify which observations can go stale before the claim becomes valid.

This closes a time-of-check/time-of-use gap at the demonstrated local boundary. It does not make the entire filesystem transactional.

## Busy and failed are different lifecycle facts

A worker that cannot acquire the writer lock has not failed the migration logic; it has not received authority to attempt the migration. Classifying that outcome as busy preserves eligibility for a later startup when the active writer has finished.

A terminal failure says something different: authority was obtained or work was attempted, but migration could not complete. Recording that outcome separately preserves accountability and permits an explicit repair path. Allowing the global cursor to move prevents one broken rollout from freezing unrelated progress, but it does not repair the failed object.

One retry boolean cannot represent these facts honestly. A governed state machine should distinguish busy, attempted-and-failed, completed and intentionally skipped. Repeated busy outcomes also need visibility, backoff and escalation; otherwise “retryable” can become invisible starvation.

## Local recovery is not a distributed migration protocol

The evidence comes from one local file-backed lifecycle and concurrency-focused regression coverage. A local writer lock does not establish exclusion across machines or arbitrary external storage. Rediscovery does not provide consensus, filesystem transactions or generic exactly-once migration.

Identity can also remain ambiguous. If two paths satisfy the rediscovery convention, a worker needs stronger evidence before choosing one. Revision tokens, metadata generations or content hashes may be necessary where logical identity alone cannot rule out replacement.

The useful claim remains bounded: at a mutable local resource boundary, post-authority reread and rediscovery prevent stale pre-lock observations from silently controlling mutation. The next questions are how identity survives every supported transition, when repeated busy state escalates, and what evidence permits a terminal migration to re-enter execution.

**Primary evidence:** [Codex merged commit 465eafac](https://github.com/openai/codex/commit/465eafacbc2db4ff828cd6d18ed8f25d22e48f53). The implementation and tests support this local post-authority revalidation pattern, not distributed locking or general exactly-once migration.
