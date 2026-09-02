---
title: "An Agent Was Interrupted. When Is It Safe to Take Over the Same Task?"
date: "2026-09-01"
updated: "2026-09-02"
column: open-source-engineering
category: daily
article_type: engineering-case-study
research_question: "When FCoP task files and their five-bucket lifecycle survive, when may a new Agent take over the same task after a Runtime interruption?"
evidence_status: "Research complete; contract frozen; implementation and independent QA not claimed"
publication_authorized: true
edition: research-center
summary: "Surviving TASK files do not grant re-execution authority. RA-7/RA-8 reached the real Dispatcher recovery method with confirmed and unknown effects, yet both returned to inbox. The study separates admission, reconciliation, and hold while preserving normal rework."
sources: "/en/research/evidence/2026-09-01-interruption-research"
project_relevance: substantive-relationship
item_id: "RIR-20260901-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-01-interrupted-task-takeover-cover.png"
citation_status: "Completed"
editing_status: "Completed"
---

<ArticleCover
  image="/assets/covers/daily-2026-09-01-interrupted-task-takeover-cover.png"
  kicker="Interruption research · 01"
  title="An Agent Was Interrupted. When Is Same-Task Takeover Safe?"
  summary="Surviving TASK files do not grant re-execution authority. RA-7/RA-8 reached the real Dispatcher recovery method with confirmed and unknown effects, yet both returned to inbox. The study separates admission, reconciliation, and hold while preserving normal rework."
  version="RIR-20260901-01"
  status="Engineering research · contract frozen"
  languageHref="/zh/engineering/2026-09-01-interrupted-task-takeover"
  languageLabel="中文"
/>

# An Agent Was Interrupted. When Is It Safe to Take Over the Same Task?

An Agent disappears, but the FCoP TASK file, REPORTs, and lifecycle position remain. The obvious response is to hand the same files to another Agent and continue.

That is directionally right. Files preserve task identity and working context. They do not answer the dangerous question: **how far did the interrupted Agent get before it vanished?**

If it never started the action, a successor may be admitted to re-execute it. If it already changed an external system and only missed its closing report, repeating the action creates a second effect. If nobody can establish the fact, automatic execution substitutes a guess for evidence. This is not a study of creating another task or redispatching work. Its subject is the **same TASK** in FCoP's five buckets: after an interruption, who may take it over, and on what basis should the system re-execute, reconcile, or hold it for review?

CodeFlowMu is a local multi-Agent collaboration Runtime we develop. It uses FCoP TASK and REPORT files for engineering work, while managing Sessions, leases, dispatch, approvals, and evidence. We inspected real code and tests at the V2.1.2 baseline, commit `919c3b48`. The observations belong to that baseline. As of this public revision on 2026-09-02, the subsequent contract is frozen; this article does not claim implementation, independent-QA acceptance, or release.

## 1. External projects frame interruption as uncertainty

[OpenAI Codex](https://github.com/openai/codex) is OpenAI's open-source coding Agent. Its [#41916](https://github.com/openai/codex/pull/41916) resumes an active thread after reconnecting, while holding possibly submitted or uncertain input for manual review instead of automatically resending it. Reconnecting does not prove that an action did not happen.

[AG2](https://github.com/ag2ai/ag2) is an open-source multi-Agent framework. Its merged [#3222](https://github.com/ag2ai/ag2/pull/3222) makes durable conversation history loadable across connections and processes while explicitly not providing a cross-process lease. Readable history and safe ownership transfer are different properties.

Orkas is an open-source multi-model chat application. Its [#53](https://github.com/Orkas-AI/Orkas/pull/53) treats duplicate terminal/process events as replay and accepts finalization only once. More recovery channels also mean late writes from an old executor must be controlled.

These projects are neither dependencies nor proof of a CodeFlowMu defect. They narrow the question to a testable claim: **an interruption is initially a technical fact, not business proof that the original action failed.**

## 2. TASK identity survives; an in-memory Session does not

Once FCoP artifacts are durable, the original TASK does not become a new task merely because an Agent process disappeared. A successor should retain the same `task_id`, path, thread lineage, and lifecycle position. It must not create a second TASK or disguise the original as a fresh dispatch.

The old Session's memory, SDK connection, and local execution handle may nevertheless be gone. The Runtime must first settle execution ownership: first check managed external work and prior ownership. Retain a live owner without creating a successor; handle an old lease only under existing reclamation conditions, then evaluate admission.

V2.1.2 already has meaningful protections. `reconcileLostSessions` retains a live managed job and its lease instead of granting another dispatch opportunity; records with no live handle converge to `SESSION_LOST`. Another probe confirmed that when a successor has taken over after restart, a late settle from the old Session cannot overwrite the reconciled record. These protections should remain.

The question is therefore not whether the old Agent can be revived. It is whether the old executor may still write, whether a successor may start, and what is known about the original effect.

## 3. `recoverable` is not proof that no action occurred

The current Runtime has a technical path that labels an unsettled Session `recoverable`: for example, a Session is incomplete and no REPORT exists, so the queue may suggest recovery. That is useful for saying that the Runtime needs to handle an interruption. It does not establish whether an external action occurred.

We therefore did not assume a real payment, email, or Issue had been duplicated. A controlled probe entered the Dispatcher’s ordinary recovery method, fixed its backoff to zero, and isolated only its recovery decision:

| Case | Synthetic event's effect claim | Proposed safe action | Observed current state |
| --- | --- | --- | --- |
| RA-7 | effect confirmed | `reconcile_only` | restored to inbox |
| RA-8 | effect unknown | `hold_for_review` | restored to the same inbox state |

Two semantically different inputs reached the same automatic pre-recovery state. The path did not consume `operation_fingerprint`, `operation_outcome`, `retry_policy`, or `next_safe_action`. This does not prove a production duplicate side effect. It proves a narrower engineering break: **ordinary post-interruption recovery does not yet use effect facts as an admission input.**

The wording matters. Some current implementation names and queue states use `failed`, but the entry condition studied here is not `failed`. An unexpected shutdown, lost process, expired lease, or unfinished closeout is first `interrupted`. Translating it immediately into “the action failed, so re-execution is allowed” skips the fact that needs confirmation most.

```text
technical interruption ≠ effect absent ≠ safe to re-execute
```

RA-7/RA-8 supply synthetic event claims, not facts queried from a real external system. The preserved observations, research fixture, and limits are in the [evidence package](/en/research/evidence/2026-09-01-interruption-research).

## 4. Before takeover, establish whether the action happened

This does not add another task pool outside the five buckets. It is a controlled confirmation on the same TASK:

```text
interruption
  → check live external work and prior ownership
  → block takeover while ownership is still valid
  → confirm the effect fact
  → re-execute / reconcile / hold for review
```

There is first an admission precondition:

- If external work is live or prior ownership is still valid, record `not_admitted`, retain the owner, and create no successor. Valid ownership does not prove that an external action is running; the blocking reason and effect fact remain separate.

Only after the original execution is no longer live can the three admission dispositions apply:

- If the effect is confirmed absent, a successor may `reexecute` the same TASK only with current authority, verified effect facts, and valid successor ownership.
- If the effect is confirmed, do not repeat it; reconcile the REPORT, audit, or result.
- If the effect is unknown, block automatic execution and use the existing FCoP fact-check and review responsibility chain.

Separately, if an old owner finalizes late, reject it as a separate fencing event while retaining a diagnostic trace; it must not change the current admission disposition.

`unknown` is not a failure. For a read-only operation or an executor with a stable idempotency key, confirmation may be quick. For an external operation that cannot be queried or safely deduplicated, it is the honest safe result.

![An Agent Was Interrupted. When Is Same-Task Takeover Safe?](/assets/figures/2026-09-01-interrupted-task-takeover.en.png)

*Figure 1. A summary of the frozen admission contract, not an implemented V2.1.2 flow. Live work or valid prior ownership blocks takeover first; effect facts then select a disposition. Late old-owner writes are fenced separately. Source: RUN-002 and contract Rev.2; limitations are in the evidence notes.*

[Open full-resolution figure](/assets/figures/2026-09-01-interrupted-task-takeover.en.png)

## 5. Reuse existing capabilities within a frozen, narrow contract

CodeFlowMu need not rebuild every Agent platform. Providers can supply session recovery, execution state, and tool receipts. CodeFlowMu continues to own same-TASK leases, the FCoP lifecycle, fact checking, and final disposition.

Its existing `recoverTaskExecution` path already has governance snapshots, revision revalidation, a recovery fence, and a live-Session block. The next step is not a large “Recovery Epoch Framework.” It is the frozen narrow contract at the technical-interruption boundary. The following is a design requirement, not a baseline capability:

```text
input = current TASK/attempt/lease identity
      + verified effect fact
      + authority valid for the current revision

disposition = reexecute | reconcile_only | hold_for_review

late old-owner finalization = stale-owner fencing event (does not supersede the disposition)
```

`hold_for_review` is a takeover disposition, not a sixth lifecycle bucket. It needs a defined display, block, and re-admission owner within the existing five buckets.

More importantly, this decision cannot hang from one UI button or one recovery route. Every UI, API, or background path handling a technical-interruption successor must traverse the same recovery-admission contract. Normal PM/ADMIN-authorized rework, reassignment, and new-round retry retain their existing paths without creating an interruption case. A server-side classifier distinguishes mixed-purpose entries from durable state; callers cannot label themselves exempt. `startSession` itself must not infer that re-execution is safe. Otherwise, one repaired recovery path can still be bypassed by another.

## 6. Evidence boundary and next step

This study reran Session/lease, Dispatcher, governance, fact-check, EVAL, and evidence-association paths. A companion study asks how a takeover decision can remain traceable without granting diagnostics or EVAL the power to dispatch. The two studies cannot substitute for each other: one establishes effect facts; the other establishes authority and evidence continuity.

We did not simulate a physical power loss, run a browser end-to-end flow, or create a real external side effect. RA-7 and RA-8 fixed backoff to observe the recovery decision. The result cannot provide a production duplication rate or support the claim that CodeFlowMu already duplicates external actions. It supports the more useful conclusion: **FCoP files keep task identity continuous after an Agent interruption; task identity continuity does not make execution authority continuous. Before another Agent can safely take over the same TASK, the Runtime must establish the prior effect fact and revalidate current execution authority.**

The frozen contract distinguishes two re-execution branches. Trusted no-start evidence yields `none_verified`, requiring current recovery authority and successor ownership. Repeating an identified `single_verified` operation additionally requires operation binding and available operation authority. Uninterpretable evidence and unclassified multiple operations remain on hold. IA-1–IA-12, DC-1–DC-3, and independent QA are subsequent implementation acceptance, not research results.

Companion reading: [Decision-evidence continuity](./2026-09-01-decision-evidence-continuity) · [Bilingual evidence notes](/en/research/evidence/2026-09-01-interruption-research).
