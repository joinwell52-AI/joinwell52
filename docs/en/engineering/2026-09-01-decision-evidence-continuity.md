---
title: "You Have Fact Checks, Diagnostics, and EVAL. What Still Connects an Interrupted Task Takeover?"
date: "2026-09-01"
updated: "2026-09-02"
column: open-source-engineering
category: daily
article_type: comparative-engineering-analysis
research_question: "How can an interrupted same-TASK takeover link current authority, fact checks, diagnostics, and EVAL observation without granting any observer extra power?"
evidence_status: "Research complete; contract frozen; implementation and independent QA not claimed"
publication_authorized: true
edition: research-center
summary: "57 existing tests support four correctly separated capabilities, not a completed takeover evidence chain. Stable case identity links the prior attempt, effect facts, current authority, and disposition while keeping observation references and raw-text access bounded."
sources: "/en/research/evidence/2026-09-01-interruption-research"
project_relevance: substantive-relationship
item_id: "RIR-20260901-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-01-decision-evidence-continuity-cover.png"
citation_status: "Completed"
editing_status: "Completed"
---

<ArticleCover
  image="/assets/covers/daily-2026-09-01-decision-evidence-continuity-cover.png"
  kicker="Interruption research · 02"
  title="Fact Checks, Diagnostics, and EVAL Exist. What Still Connects Takeover?"
  summary="57 existing tests support four correctly separated capabilities, not a completed takeover evidence chain. Stable case identity links the prior attempt, effect facts, current authority, and disposition while keeping observation references and raw-text access bounded."
  version="RIR-20260901-02"
  status="Engineering research · contract frozen"
  languageHref="/zh/engineering/2026-09-01-decision-evidence-continuity"
  languageLabel="中文"
/>

# You Have Fact Checks, Diagnostics, and EVAL. What Still Connects an Interrupted Task Takeover?

An interrupted Runtime task can appear information-rich: a TASK file, Session and lease records, fact checking, diagnostic panels, and EVAL observation reports already exist.

Yet a successor Agent may still be unable to answer a simple question: **which current decision admits this disposition?**

Putting every log on one page does not create authority. Giving EVAL a detailed observation report must not give it dispatch power. The missing piece is not another report. It is a constrained decision-evidence chain that connects an interrupted attempt, effect facts, current authority, and the successor Session while keeping fact checking, diagnostics, and EVAL inside their own boundaries.

CodeFlowMu is a local multi-Agent collaboration Runtime we develop. FCoP TASKs, REPORTs, and a five-bucket lifecycle organize engineering work. This article inspects real V2.1.2 modules and tests at commit `919c3b48`. The observations belong to that baseline; the subsequent takeover contract is frozen. This article describes its required connection, not a claim of implementation, independent-QA acceptance, or release.

## 1. Two external reminders: inspectable does not mean allowed to continue

[OpenAI Codex](https://github.com/openai/codex) is OpenAI's open-source coding Agent. Its [#41936](https://github.com/openai/codex/pull/41936) retains bounded diagnostic evidence for Guardian failed reviews. Its lesson is not that more failure logs are always better; a failure decision itself needs a queryable record with defined limits.

[Paperclip](https://github.com/paperclipai/paperclip) is an open-source multi-Agent team-management platform. Its [#12616](https://github.com/paperclipai/paperclip/pull/12616) was merged on 2026-09-01 and retains a default-off experimental design that proposes binding a native run to company, issue, run, coordinator, receipt, idempotency, and result fencing. It makes run provenance and receipt binding worth studying. Merged and default-off does not mean universally enabled, nor is this runner design an architecture to transplant into CodeFlowMu recovery.

Together they raise a narrow question: a recovered action should explain its decision source, but **the existence of an old decision does not prove that a new action remains authorized.**

## 2. CodeFlowMu already has four correctly separated capabilities

We ran 57 related tests over technical recovery, fact checking, EVAL, and evidence association: `57 pass / 0 fail / 0 skipped`. This is not a composite reliability score. Each set belongs to a different layer and proves only that layer’s role.

| Layer | What current evidence establishes | What it deliberately does not do |
| --- | --- | --- |
| Technical takeover | `recoverTaskExecution` checks a `technical_recover` governance snapshot, revalidates revision, uses a recovery fence, and stops before wake if a live Session or changed revision appears | It does not infer that an effect occurred, or convert historical authority into a new re-execution grant |
| Fact checking | `FactCheckDecisionService` records reasoned, idempotent PM/ADMIN decisions on a REVIEW; hard identity, authorization, and integrity violations cannot be overridden as evidence exceptions | It does not move TASK/ISSUE/lifecycle files or wake an Agent |
| EVAL | It emits internal observation/evidence bundles; tests show it does not create a TASK or move lifecycle, and its records have `drives_lifecycle=false` | It does not make a business decision or become an authorization source |
| Evidence association | It links task, attempt, action, report, and review with stable keys; diagnostic caches are rebuildable and do not mutate lifecycle facts | A successful link does not authorize an action |

This separation is a strength. FCoP fact checking answers whether evidence and contracts stand. EVAL observes and identifies gaps. Diagnostics explain correlation conflicts. PM/ADMIN retains business decisions, and the Runtime retains technical wake.

A separate controlled probe adds a concrete contrast. An authorization-receipt marker supplied in Session context was absent from the persisted record, while denial remained `OPERATION_BOUNDARY_DENIED`. A synthetic error marker with an 8192-byte tail remained in the internal terminal event, yet Web Panel, Activity API, and Analytics projections all omitted it while retaining failure code and status. The former exposes a generic Session reference gap; the latter demonstrates an existing ordinary-consumer boundary. They must not be collapsed into “no audit,” or added to the 57 tests as a reliability score. See the [preserved observations and fixture](/en/research/evidence/2026-09-01-interruption-research).

## 3. The break: the four capabilities have no common interruption case

The technical takeover path currently reads governance snapshots, attempts/leases, revisions, and wake conditions. It does not yet form a takeover record that can stably cite current authority, a fact-check result where one exists, and relevant observation evidence. The missing connection is not to put EVAL or diagnostics into dispatch; it is to let a takeover cite those materials when relevant while preserving their read-only boundaries.

The system can consequently answer many local questions correctly: whether the old Session is live; whether the lifecycle allows technical recovery; whether PM or ADMIN decided a REVIEW; whether EVAL found a reporting gap; and whether task, attempt, report, and review correlate by stable key.

It cannot yet produce one complete, traceable explanation for a takeover:

```text
original TASK (same bucket)
  → interrupted attempt and old lease
  → verified effect fact + current authority
  → takeover decision at the current revision (optional fact-check/diagnostic references)
  → successor Session or reconcile/hold disposition
  → EVAL observation and constrained query view
```

This is not a shortage of prose, nor is it a problem with `task_id` identity. **The same interruption takeover lacks a stable case identity and reference chain.** The same TASK needs a referenceable interruption case so every record can establish that it concerns the same interruption, task round, and successor.

## 4. What a takeover record may cite—and what it must never authorize

CodeFlowMu already has reusable contract shapes. `TaskScopeGrant` and `TaskCommandReceipt` carry `task_id`, `root_task_id`, `thread_key`, `round_id`, `expected_revision`, `authorization_ref`, an idempotency key, and expiry. They describe current technical authority, not approval for a specific external operation. Source alignment further separates successor/wake-scoped `TaskScopeGrant` from `OperationApprovalService` or a qualified equivalent executor, which checks operation authority at the actual tool-call boundary without advance consumption. We did not establish that ordinary Session takeover consumes this full structure, so field presence cannot be presented as completed continuity.

Three concepts must remain separate:

```text
historical receipt
→ explains why the original execution occurred

current authority
→ establishes whether re-execution is permitted at the current revision/round

interruption case / admission record
→ records the facts, decisions, and evidence used for this takeover
```

The frozen contract does not create a second authorization system. It requires a case with its own immutable identity. This is a reading summary, not the full schema:

```text
interruption_case
  = case_id + task_id + interrupted_task_revision
  + interrupted_attempt_id + prior owner/lease identity + interrupted_at

case references
  = evaluated_task_revision + current_authority_ref + effect_fact_ref
  + admission_result + disposition|null
  + decision_revision + supersedes_revision? + decided_at
  + fact_check_ref? + diagnosis_ref? + eval_observation_ref?
  + successor_session_id?
```

Source alignment distinguishes two leases: `SessionLeaseStore` uses an owner Session and TTL without a stable `lease_id`; `DispatchAttemptStore.ExecutionLease` has its own lease ID. A case must not treat them as the same field. Nor should a case manufacture an observation artifact just to fill a field: optional references are recorded only when they actually participate in the case.

Four limits are essential:

1. **A historical receipt explains origin only.** It may explain why the TASK originally began, but cannot automatically authorize today’s external action.
2. **Current authority is necessary for `reexecute`, but not sufficient.** It must bind the current revision and round; a verified effect-absent fact and valid successor ownership are also required. A confirmed or unknown effect must not manufacture re-execution authority.
3. **Observation artifacts may be cited but cannot execute.** EVAL, diagnostics, and fact checks provide references, summaries, digests, state, and reason codes—not wake or dispatch capabilities.
4. **Raw text remains behind existing boundaries.** Large context, private EVAL bodies, and raw diagnostic text stay out of ordinary association output and remain readable only through the existing authorized paths.

That is decision-evidence continuity: not a receipt replacing business judgement, but each new judgement being traceable to the facts and current authority it used.

![Fact Checks, Diagnostics, and EVAL Exist. What Still Connects Takeover?](/assets/figures/2026-09-01-decision-evidence-continuity.en.png)

*Figure 1. Decision-evidence references. Historical receipts explain origin; current authority and effect facts support admission. Fact checks, diagnostics, and EVAL provide references only when relevant, never dispatch power. Source: RUN-004's 57 existing tests and the frozen contract; dashed lines are optional references, not execution commands.*

[Open full-resolution figure](/assets/figures/2026-09-01-decision-evidence-continuity.en.png)

## 5. Keep the two studies distinct; join them only in acceptance

The interruption-admission study asks what happened to the original effect. This study asks how that fact and the takeover decision are correctly attributed. Combining them into a generic “recovery feature test” hides two different failures: a system can know the effect happened but lack current authority, or have authority while lacking evidence about the effect.

Joint acceptance must therefore cover at least these cases:

| Case | Required linkage | Prohibited result |
| --- | --- | --- |
| Effect absent, safe re-execution | successor can trace current grant/decision, original attempt, and fact basis | re-execution on an expired receipt or only a thread string |
| Effect confirmed | case cites reconciliation conclusion and evidence | waking a successor to repeat the action |
| Effect unknown | case cites the hold owner and constrained evidence | automatic execution merely because the session is `recoverable` |
| Late old-owner settle | case retains diagnostics and rejects stale write | overwriting successor authority |
| EVAL/diagnostic finding | observation is citable and queryable | EVAL moving a bucket, diagnostics directly authorizing, or raw text leakage |

These are future implementation acceptance conditions, not end-to-end capabilities already passed by V2.1.2.

## 6. Why this matters more than another recovery Agent

Adding an Agent that summarizes logs cannot solve evidence ownership, current authority, or raw-text boundaries by itself. It may summarize more fluently while mixing another attempt’s logs, evidence created only after the decision point, or an expired grant into the current takeover.

One implementation precondition is equally important: the decision-evidence chain cannot live only behind one Recover button. Every UI, API, or scheduler entrypoint handling a technical-interruption successor must converge on one recovery admission. Normal authorized rework, reassignment, and new-round retry are not interruption recovery; a server-side classifier distinguishes mixed-purpose entries from durable state. Otherwise, one complete evidence path can be bypassed by another route that ignores current authority and effect facts.

Provider capabilities can still be reused. A platform’s session state and tool receipts can become evidence inputs. CodeFlowMu need not rebuild Codex, AG2, or Paperclip session products; it needs to preserve clear, auditable boundaries between the FCoP TASK, five buckets, current authority, and business disposition.

The important result is therefore not “we lack an Agent platform feature.” It is this: **four correctly separated components need one same-TASK, auditable, non-privileged interruption-takeover reference chain.**

The takeover contract is now frozen: historical receipts explain origin; current recovery authority is separate from applicable operation authority; EVAL and diagnostics remain optional references. `successor_started`, or `reconciled` backed by a controlled completion reference, may resolve the case without deleting history. `hold_for_review` and `not_admitted` leave it open. Persistence, concurrency, crash recovery, and formal IA/DC acceptance still require implementation and independent QA; the 57 existing tests cannot replace them.

Companion reading: [Interrupted same-TASK takeover](./2026-09-01-interrupted-task-takeover) · [Bilingual evidence notes](/en/research/evidence/2026-09-01-interruption-research).
