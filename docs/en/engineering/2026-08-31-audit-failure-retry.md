---
title: "The Action Succeeded. Why Did It Run Again?"
date: '2026-08-31'
updated: '2026-08-31'
column: open-source-engineering
category: daily
article_type: engineering-case-study
edition: research-center
research_question: "When an action has taken effect but a later audit write fails, why can an Agent Runtime not decide to retry from failed alone?"
summary: "In an isolated fault experiment, the first local effect already existed when a completion-audit append reclassified the operation as failed. A later recovery in a new process created a second effect for a non-idempotent executor. Three executor controls show that execution state, effect fact, and retry eligibility are separate decisions."
sources: "/en/research/evidence/2026-08-31-runtime-continuity"
project_relevance: substantive-relationship
item_id: "RCR-20260831-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-31-audit-failure-retry-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

[中文](/zh/engineering/2026-08-31-audit-failure-retry)

<ArticleCover
  image="/assets/covers/daily-2026-08-31-audit-failure-retry-cover.png"
  kicker="Runtime Continuity Research · 01"
  title="The Action Succeeded. Why Did It Run Again?"
  summary="A completion-audit failure cannot reauthorize an already-observed action for safe retry."
  version="RCR-20260831-01"
  status="Engineering Case · 2026-08-31"
  languageHref="/zh/engineering/2026-08-31-audit-failure-retry"
  languageLabel="中文"
/>

# The Action Succeeded. Why Did It Run Again?

After recovery completed, the operation had returned to `succeeded`, but the local effect record contained two entries.

This was neither concurrency nor a double click. The first action had completed and produced one effect record. Its completion-audit append then failed, and the Runtime reclassified the already-completed action as `failed`. After the audit destination was restored, the first process exited, and a new process resumed the approved operation. A second effect appeared.

The question is not whether retry is useful. It is narrower: **when failure happens after the action, what evidence gives a Runtime permission to execute again?** The central proposition is that execution state, effect fact, and retry eligibility are three different concepts. `failed` is not evidence that an action did not happen; it cannot by itself mean retry eligible.

CodeFlowMu is a local multi-Agent collaboration system that we develop and maintain. Multiple role-bearing Agents work on engineering tasks while the Runtime manages sessions, tool execution, human approval, and result records. We are both the system developers and the researchers for this experiment. The focus is what an operation actually did and how recovery should proceed, not whether a model answered well.

This distinction matters to the person operating recovery. Seeing `failed`, they must decide whether to run the action again, repair a record, or stop and verify the effect. Treating a record failure as an action failure can repeat an action already performed. Forbidding recovery in every case can block work that could safely continue.

V2.1.2 already strengthened `write_task` submission idempotency, ordinary event projection, and skill-session binding. Those are different paths. Response loss asks whether the caller received a successful result; this study asks what happens when the Runtime itself observed a successful action and a later recording step reclassified it. The former primarily tests idempotent replay. The latter first tests how retry eligibility is decided.

## 1. Why audit failure creates a retry question

The external prompt came from [UniEmployee](https://github.com/zj-unicom-ai/UniEmployee), an enterprise digital-employee platform that composes employee roles, workflows, skills, knowledge, connectors, tools, and approvals. Its administration audit work separates audit-write failure from the business response. That is not a universal policy: some operations must stop when audit is unavailable, while others may safely preserve their business result. The useful question is which layer an audit exception changes. [UniEmployee #17](https://github.com/zj-unicom-ai/UniEmployee/pull/17)

We therefore inspected CodeFlowMu's `OperationApprovalService`, rather than proposing a generic transaction framework. The research is fixed at main commit `f0f42f01`; the V2.1.2 release worktree `919c3b48` has the same relevant source as tag `cb8869a3`. Source versions and hashes are in the [evidence package](/en/research/evidence/2026-08-31-runtime-continuity).

The service writes an operation record as JSON and then appends an audit event to JSONL. Atomic replacement of one JSON file does not make the record, audit file, and external action one transaction. The fault location determines what recovery may safely do.

## 2. Four fault locations are not one “execution failure”

The probe invokes the real product service. Its executor only appends a synthetic marker in an isolated directory; it does not push Git, create an issue, or call a remote system. The audit destination is turned into a directory at the original file path, so the actual append throws `EISDIR`.

| Probe | Fault location | What the caller sees | Persisted state | Effects already made |
|---|---|---|---|---:|
| P0 | Execute again after normal completion | `APPROVAL_ALREADY_CONSUMED` | succeeded | 1 |
| P1 | Approval record written; approval-audit append fails | error | approved | 0 |
| P2 | executing written; start-audit append fails | error | executing | 0 |
| P3 | effect complete; completion-audit append fails | error | failed | 1 |

The results agree on two fixed baselines. P0 is the necessary negative control: normal terminal success has a single-consumption guard. P3 does not imply that the approval service replays every action. [Captured probes](/assets/evidence/2026-08-31-runtime-continuity/fixtures/historical-probes.json)

P1 shows that an error response does not mean approval was never persisted. P2 shows that `executing` does not mean the effect happened. P3 is the dangerous case: the effect happened, yet the record entered a state that recovery could treat as executable again.

![One straight optical channel contains two cobalt effect markers separated by a narrow amber completion break.](/assets/figures/2026-08-31-audit-failure-retry-p3-cutaway.png)

*Figure 1. The P3 relationship. The first effect evidence exists before the completion-record break; recovery can create a second effect. The image does not replace the P0–P3 data. Source: RCR-20260831 de-identified E-A0/E-A1 captures.*

## 3. How one completion failure becomes a second effect

The source and captured state form one causal chain: an ADMIN approves the operation; the service persists `executing`; the executor creates a local effect and returns success evidence; the service persists `succeeded`; the completion-audit append fails in a `catch` shared with executor errors; the state becomes `failed`; recovery later accepts that still-approved failed operation and invokes the executor again without first treating the recorded first effect as a no-repeat condition.

The failed record still contains `kind=local-marker, observed_count=1`, and its independent effect snapshot contains `E1`. After recovery, the snapshot contains distinct `E1` and `E2` markers with the same synthetic `operation_key`. The state says failed while the first effect exists; recovery then makes another effect. [Restart capture](/assets/evidence/2026-08-31-runtime-continuity/fixtures/restart.json)

To exclude an in-memory-only explanation, fault and recovery run in separate Node processes through the real `ControlledExecutorRegistry` request recalculation and dispatch path.

| Executor control | Effects after fault | Effects after new-process recovery | Calls | Recovery result |
|---|---:|---:|---:|---|
| No dedupe, same request digest | 1 | 2 | 2 | succeeded |
| Stable operation-key dedupe, same digest | 1 | 1 | 2 | succeeded |
| Recalculated request with changed digest | 1 | 1 | 1 | `APPROVAL_STALE` |

The repeated run gives the same three relationships. This is not a production frequency estimate or a full executor survey. It does support the mechanism: a generic recovery layer may call again, but executor-side dedupe or a changed request digest can still prevent a second effect.

The more general result is:

> **`failed ≠ effect_absent ≠ retry_allowed`.**

`failed` says a control path did not complete normally. It does not prove that an external action never happened. Retry eligibility must combine request identity, effect evidence, and executor dedupe capability; it cannot be inferred from one terminal field.

That gives three different recovery outcomes. Re-execute only when the request identity remains valid and evidence says the effect is absent. Reconcile records or audit when an effect exists or a stable operation key can identify it. Stop for verification when the effect cannot be confirmed and the executor cannot safely dedupe. This is an evidence-backed design direction, not an already-delivered automatic-recovery feature.

## 4. Why a single audit-failure policy cannot be copied

[Paperclip](https://github.com/paperclipai/paperclip), an open-source platform for managing multi-Agent work, provides a useful contrast. Its task-drain change makes durable audit writes transactional. If the audit write fails, in-process drain state is rolled back only where no later concurrent mutation occurred; a generation counter prevents stale restoration from overwriting newer state. Activity publication happens after commit, and publication failure is logged rather than re-presenting a committed drain as HTTP 500. [Paperclip #12485](https://github.com/paperclipai/paperclip/pull/12485)

That code handles recoverable in-process drain state. It does not mean an already-sent issue, email, or payment can roll back with a local audit failure. External effects need their own evidence before retry.

## 5. Recheck and boundary

The [bilingual evidence guide](/en/research/evidence/2026-08-31-runtime-continuity) provides captured data, snapshots, checkers, and the product probe. Run `node check.mjs` in the downloaded evidence directory to verify public fixture consistency. Re-running the product service probe requires the fixed source and dependencies; the public package does not pretend that every reader can replay it.

The work includes 28 existing targeted tests as controls, not as a reliability score. It does not cover HTTP routes, real remote effects, power loss, or independent QA. To apply the method elsewhere, inject faults before action, after action, after result persistence, and during audit commit; then retry in a new process and count effects. The decisive question is not “was the last state failed?” but “did the prior call have an effect, and is calling again still safe?”

**The second run finally succeeded, but the first one had already succeeded too.**
