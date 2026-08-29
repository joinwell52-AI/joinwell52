---
schema: publication-candidate-article/v2
title: "Restoring Context Does Not Restore Authority"
date: '2026-08-29'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "可恢复智能体应如何区分上下文重建权与当前执行权？"
summary: "A merged OpenAI Codex change shows how an eligible full state snapshot can restore context continuity. That reconstruction evidence does not automatically become current permission: reliable recovery needs separate gates for completeness, lineage, and present authorization."
cover: staging/publication-candidates/2026-08-29-restoring-context-does-not-restore-authority-cover.png
sources:
  - research/analysis/Q-20260829-01-reconstruction-authority-separate-from-execution-authority.md
---

![Restoring Context Does Not Restore Authority cover](staging/publication-candidates/2026-08-29-restoring-context-does-not-restore-authority-cover.png)

# Restoring Context Does Not Restore Authority

Resumable agents have an authority problem hidden inside a continuity feature. A durable state object may be good enough to answer “where did this work stop?” while remaining unable to answer “what is allowed now?” If a runtime collapses those questions, persistence becomes an implicit permission channel.

A merged OpenAI Codex change provides a concrete case. After a nested-agent fork, the associated task message may no longer survive. The runtime can nevertheless restore previous-turn settings and reference context from an eligible, surviving, full WorldState snapshot. Bare TurnContext, patch-only state, and full snapshots superseded by compaction are rejected as baselines.

The central proposition is simple: **reconstruction authority and execution authority must remain separate. Reconstruction chooses which persisted evidence may restore continuity; execution authorization decides whether current policy allows restored state to shape capabilities or effects.**

## What Evidence Is Strong Enough for Continuity

Requiring a surviving user message for every restoration looks conservative, but it discards valid continuity after a fork intentionally removes that message. Admitting arbitrary fragments has the opposite defect: a partial patch or superseded state can masquerade as a complete world.

A qualified full snapshot creates a middle boundary. It must represent a complete baseline, remain inside the surviving lineage, and not have been invalidated by later compaction. The negative tests matter as much as the positive restoration because they define which evidence does not gain reconstruction authority.

This boundary answers a continuity question. It shows that the runtime neither invented a missing task nor promoted a fragment into a world. It does not show that every restored field is still true today.

## Why Reconstruction Eligibility Is Not Permission

Restored preferences, references, and work progress are usually context. A field becomes authority-bearing when it can change tools, credential scope, identity, or external effects. At that point, structural completeness and surviving lineage are not enough.

An administrator may revoke a capability after the snapshot was created. A resource may disappear, or a credential may become narrower. The demonstrated compaction boundary says that state remains eligible inside one history model; it cannot substitute for checking present external policy and resources.

Recovery therefore needs two gates. The first validates completeness and lineage and decides whether reconstruction is legitimate. The second rebinds only permission-bearing restored fields to current policy and resource state. This preserves legitimate continuity without allowing old state to inherit new authority.

## Audit Three Identities Separately

A truthful recovery receipt should identify the baseline that established context, its lineage or generation, and the current authorization decision that allowed particular restored fields to influence execution.

A single “recovery succeeded” flag cannot distinguish missing state, stale lineage, and revoked permission. Writing the authorization result back into the original snapshot would also contaminate historical evidence. A safer design leaves the baseline immutable and emits a separate, time-bound policy decision.

Schema migrations need the same discipline. A conversion may fill a new structure, but it should not silently upgrade permission semantics. Newly introduced authority-bearing fields should be evaluated against current policy.

## What the Evidence Does Not Prove

The evidence is one merged implementation and its maintainer regression matrix, without independent reproduction. It does not authenticate the snapshot author, establish cross-host consistency, or cover concurrent corruption, replay, and external-resource revocation.

Those limits do not erase the demonstrated mechanism; they narrow the terminal claim. A runtime may say that an eligible baseline restored context. It may say that restored fields are authorized for current execution only after a second gate emits fresh evidence.

## Open Questions

Implementers still need to decide which fields require fresh authorization, how generation identity survives schema migrations, and what typed evidence should be returned when a structurally valid snapshot names a revoked resource. The durable rule is: **continuity comes from persisted evidence; execution authority comes from a current decision. One cannot stand in for the other.**

**Primary evidence:** [merged OpenAI Codex commit f9cdc90c](https://github.com/openai/codex/commit/f9cdc90c2c4d38cd557deb933e592f0032a5ea6e). The implementation and tests support a bounded context-reconstruction conclusion, not general authorization safety.
