---
title: "A Checkpoint Is Not a Recovery Contract"
date: '2026-09-03'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "检查点必须绑定哪些要素，才能让长期运行的数字员工恢复为同一项可问责工作，而不是只从旧文件状态重新开始？"
summary: "Aligned agent-context and workspace checkpoints improve recovery for long-horizon work, but they do not undo network or service effects. Accountable resumption also needs occurrence-bound authority, policy identity, and an external-effect ledger."
sources:
  - research/analysis/Q-20260903-01-aligned-checkpoint-recovery-boundary.md
item_id: "Q-20260903-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-03-a-checkpoint-is-not-a-recovery-contract-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-03-a-checkpoint-is-not-a-recovery-contract-cover.png"
  kicker="Digital Employee · Daily Research"
  title="A Checkpoint Is Not a Recovery Contract"
  summary="Aligned agent-context and workspace checkpoints improve recovery for long-horizon work, but they do not undo network or service effects. Accountable resumption also needs occurrence-bound authority, policy identity, and an external-effect ledger."
  version="Q-20260903-01"
  status="Daily Runtime V5 · 2026-09-03"
  languageHref="/zh/digital-employee/2026-09-03-a-checkpoint-is-not-a-recovery-contract"
  languageLabel="中文"
/>

# A Checkpoint Is Not a Recovery Contract

A digital employee sends a customer notification and then fails. The system rewinds both its context and workspace to the moment before the send. Files and reasoning state now agree, but the notification has not disappeared from the recipient's inbox. If the recovered run sends again, a technically successful rewind creates a duplicate real-world effect.

This exposes two propositions that are often collapsed: whether state can be restored, and whether the same accountable work may resume. A checkpoint addresses the first. The second also requires evidence about the work occurrence, current authority, and effects outside the snapshot boundary.

A primary study of long-horizon engineering tasks proposes aligned rewind of agent context and a controlled workspace. Across 82 tasks, the paper reports higher task success and checklist progress than continuing or restarting with prior experience. Component ablations report complementary value from environment rewind, context rewind, and rewind memory. The paper also states an important boundary: the workspace can be rolled back, while network requests, external-service calls, and external runtime state are not undone.

That supports a bounded judgment: **aligned checkpoints are an important recovery mechanism, but not a complete recovery contract. Accountable resumption must also bind the checkpoint to the interrupted occurrence, current recovery authority, policy version, and an external-effect ledger.**

## Aligned Rewind Repairs Internal Causal Mismatch

Restoring files without restoring context leaves the worker reasoning from observations of a later state. Restoring context without restoring files presents that reasoning with a future workspace. Either split can make a resumed suffix causally inconsistent.

Aligned rewind makes the agent context and controlled environment point to the same causal position. Retaining a valid execution prefix and failure memory can preserve progress that a complete restart would discard and prevent continued action on an invalid state.

The reported results support this mechanism within the evaluated engineering setting. The study lists higher task success and checklist progress for aligned rewind than for continuing execution. Those figures remain source-reported, benchmark-bounded results, not a universal guarantee for enterprise workflows.

## Effects Outside the Snapshot Do Not Rewind

A directory snapshot cannot retract a sent message, remove a cloud resource, reverse a payment, or withdraw a human approval. Even a call that appeared to fail may already have changed an external system. A recovered worker that sees only local state can mistake a completed action for an unperformed one.

Recovery therefore needs an effect boundary. Every consequential external action should record its work-occurrence identity, stable request identity, external receipt, known outcome, retry semantics, compensation path, and unresolved state. The ledger need not retain sensitive payloads, but it must distinguish not attempted, committed, outcome unknown, and compensated.

This record does not prove every action safe. Its narrower purpose is to prevent a state rewind from erasing the fact that an effect occurred. For a non-idempotent action, an unknown outcome should block automatic replay.

## Recovery Must Regain Authority

Even a complete effect record does not mean the recovering principal is still authorized. The task may have been cancelled, access revoked, policy changed, or a replacement worker may not be allowed to see secret-bearing context in the old checkpoint.

Recovery admission therefore needs five bindings: selected checkpoint, interrupted execution epoch, current recovery principal, applicable policy version, and state of effects beyond the checkpoint boundary. They should share one stable work-occurrence identity. Recovery is not old authority thawed from a snapshot; it is a new decision under current conditions.

After admission, the resumed suffix should receive a new epoch identity while retaining links to the prior epoch, checkpoint, and authorization decision. That preserves continuity without collapsing two executions into one unauditable record.

## A Ledger Does Not Replace Idempotency or Compensation

An external-effect ledger supplies facts. It does not make a payment retryable or retract an email. The execution layer still needs stable idempotency keys, effect queries, compensation actions, or explicit human acceptance.

A fully local coding workspace may have no consequential effects outside versioned storage, and a lighter contract can be reasonable there. That is a deployment assumption to record, not a conclusion to generalize to messaging, cloud administration, or approvals.

Nor should a recovery contract promise exactly-once execution unless external systems provide sufficient transaction and receipt guarantees. A more defensible objective is that known effects are not repeated, unknown effects are not silently replayed, and unreconcilable cases enter an explicit human gate.

## Evidence Boundary and Open Questions

The evidence is one primary study of controlled engineering work. It does not establish enterprise durability, secret isolation, or safe recovery for arbitrary tools, and it does not evaluate the full contract proposed here. That contract is a governance design inferred from the aligned-rewind mechanism and its explicit boundary.

Open questions remain: who may select a rewind point; how adverse evidence survives rollback; how receipts bind to execution epochs; what policy change turns recovery into a new work occurrence; and how access to secret-bearing context is reauthorized for a new principal.

A checkpoint tells the system where to restore. A recovery contract must additionally answer who is restoring, under which current authority, which effects crossed the rollback boundary, and whether continuing would repeat an action in the real world.

**Primary source:** [AgentRewind and MettleBench](https://arxiv.org/abs/2608.14380)
