---
title: "Delegation Budgets Belong to the Root Objective"
date: '2026-08-28'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "智能体委派工作后，资源消耗应由实际执行者还是授权工作的根目标承担预算责任？"
summary: "A merged OpenAI Codex change demonstrates shared root-objective accounting: descendants remain the origin of measured usage while the objective that authorized delegation owns the inherited budget charge. The mechanism closes a demonstrated escape without proving immediate revocation or generalized quotas."
sources:
  - research/analysis/Q-20260828-01-root-owned-delegation-resource-budget.md
item_id: "Q-20260828-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-28-delegation-budgets-belong-to-root-objective-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-28-delegation-budgets-belong-to-root-objective-cover-v2.png"
  kicker="Digital Employee · Daily Research"
  title="Delegation Budgets Belong to the Root Objective"
  summary="A merged OpenAI Codex change demonstrates shared root-objective accounting: descendants remain the origin of measured usage while the objective that authorized delegation owns the inherited budget charge. The mechanism closes a demonstrated escape without proving immediate revocation or generalized quotas."
  version="Q-20260828-01"
  status="Daily Runtime V5 · 2026-08-28"
  languageHref="/zh/digital-employee/2026-08-28-delegation-budgets-belong-to-root-objective"
  languageLabel="中文"
/>

# Delegation Budgets Belong to the Root Objective

When a digital employee splits one objective across three descendants, every worker can appear locally compliant while the user objective quietly spends far beyond its intended limit. If each delegation boundary resets ownership, delegation becomes a budget-escape mechanism rather than a coordination mechanism.

A merged OpenAI Codex maintainer change offers a source-level example of a different design. Token increments from child and nested-subagent work flow into shared root-goal accounting. The demonstrated behavior covers active and idle progress, an unloaded intermediate parent, root-goal replacement, and usage that arrives while a checkpoint is being recorded.

The bounded conclusion is that delegated consumption needs two linked identities. The worker remains the factual origin of measured use; the root objective that authorized the delegation remains the owner of the inherited charge. Correct accounting closes a concrete escape path, but it is not evidence that execution has been revoked.

## Delegation Creates Two Different Identities

Charging everything only to the root destroys diagnostic resolution. Operators can no longer tell which worker was expensive, which tool call produced a spike, or whether recursion caused the cost. Charging only the worker destroys governance continuity: one objective can keep creating new local accounts that each remain below a threshold.

A governed runtime therefore needs both views. Origin accounting answers where consumption occurred. Ownership accounting answers which authorization and budget made that work possible. The relationship between them should be durable enough to survive checkpointing and runtime reconstruction.

This distinction also improves operational decisions. An expensive worker does not necessarily make the overall objective unworthy; an expensive objective may reflect many ordinary descendants rather than one pathological worker. Optimization, throttling and termination belong at different layers, and the two-account model keeps those layers visible.

## Shared Root Accounting Closes the Demonstrated Escape

The important mechanism is not merely a recursive sum at the end of a root turn. Descendants publish deltas into shared root accounting as work progresses. That preserves inherited cost when an intermediate parent is unloaded and prevents idle descendants from disappearing simply because the root turn has not ended.

Checkpoint concurrency is the subtle case. A naive implementation can read a cumulative value and then advance the accounted position to the latest value. Usage that arrives between those operations may be erased as if it had already been charged. The merged change preserves post-snapshot increments so later accounting still sees them.

Root-goal replacement also requires an explicit rebase. A new objective should not silently inherit an old objective's unexplained budget history, while descendants that remain active must not lose their current ownership. The evidence supports a bounded but important rule: the delegation ledger follows the lifecycle of the authorizing objective, not merely the liveness of worker objects.

## Accounting Truth Is Not Execution Revocation

Combined root and descendant usage can move the root goal into a budget-limited state. That proves the accounting state reflects delegated consumption. It does not prove every descendant stopped synchronously. Cancelling an active tool can leave unsafe intermediate effects, and some systems may deliberately enforce limits only at safe lifecycle boundaries.

At least four facts should therefore remain distinct: measured resource deltas, inherited charges to the root, the budget-state transition, and revocation of execution authority. The first three cannot substitute for a receipt proving the fourth. A user-facing stopped state needs evidence of actual cancellation or denial of further admission.

Nor can token accounting be generalized automatically to money, network, memory, tool calls or wall-clock quotas. Those resources have different measurement points, reversibility and settlement semantics. The origin-versus-ownership principle may transfer; one token implementation does not become a universal quota system.

## What the Evidence Still Does Not Prove

The evidence is one merged implementation and its maintainer regression coverage, not an independent reproduction. It demonstrates shared root accounting across selected nesting, unloading and concurrency cases. It does not establish crash-durable consistency, cross-host coordination, distributed exactly-once charging, or immediate safe cancellation after exhaustion.

An engineering review should therefore ask more than whether the total is correct. Can descendant use be traced to its origin? Is the inherited charge bound to the authorizing objective? Can checkpointing lose concurrent deltas? Are new delegations denied after the limit? When and with what evidence does already-running work stop? Separate answers prevent accurate accounting from being overstated as complete execution control.

**Primary evidence:** [OpenAI Codex merged commit 4761851f](https://github.com/openai/codex/commit/4761851ff35c4ebdd35eb8801e1180a0a50fef60). The implementation and maintainer tests support the bounded shared-root token-accounting claim; they do not prove generalized quotas or immediate revocation.
