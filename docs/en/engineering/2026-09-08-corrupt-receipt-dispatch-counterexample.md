---
schema: "publication-candidate-article/v2"
title: "The Receipt Was Corrupted. Why Didn't the Task Start Again?"
date: "2026-09-08"
published_date: "2026-09-08"
column: "open-source-engineering"
category: "daily"
article_type: "engineering-case-study"
edition: "research-center"
research_question: "The Receipt Was Corrupted. Why Didn't the Task Start Again?"
summary: "Corrupting a receipt caused another executor callback, but the real dispatch chain did not start a second execution. Two rounds of counterexamples separate read anomalies, repeated calls, execution attempts and external effects."
cover: "/assets/principal-receipt-20260908/02-receipt-retry-cover-v2.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded research complete; public record checks; not independent QA; no development authorized"
source_commit: "c008d9db91a21136fc61a4f60314e22db395d5d2"
pageClass: "principal-receipt-article"
sources:
  - "https://github.com/stablyai/orca/pull/19399"
---

<ArticleCover image="/assets/principal-receipt-20260908/02-receipt-retry-cover-v2.png" kicker="Open-source engineering · Controlled research" title="The Receipt Was Corrupted. Why Didn't the Task Start Again?" summary="Corrupting a receipt caused another executor callback, but the real dispatch chain did not start a second execution. Two rounds of counterexamples separate read anomalies, repeated calls, execution attempts and external effects." version="2026-09-08" languageHref="/zh/engineering/2026-09-08-corrupt-receipt-dispatch-counterexample" languageLabel="简体中文" />

<ArticleTableScroll language="en" />

<style>.principal-receipt-article .vp-doc h1[id] { display: none; }</style>

[Full-resolution cover](https://joinwell52-ai.github.io/joinwell52/assets/principal-receipt-20260908/02-receipt-retry-cover-v2.png)

# The Receipt Was Corrupted. Why Didn't the Task Start Again?

We deliberately corrupted a command's completion record and submitted the same command again. The system did call the function responsible for execution a second time.

But do two function calls necessarily start the task twice? Once we connected the function to the product's actual dispatcher, the answer was no. The simulated execution interface still started only once, leaving one execution-attempt record.

Counting function calls alone could easily lead to a premature conclusion of duplicate task execution.

We call that function the execution callback below. The simulated interface replaces the SDK through which the runtime connects to a model. It simulates a start in memory, without a real model, payment, email or code push.

**Another callback is not another start. Another start is not, by itself, evidence of a duplicated external effect.**

This is not an account of a production duplicate-dispatch incident. It is how counterexamples made us withdraw a premature engineering conclusion.

## 1. Why can a receipt affect the next execution?

CodeFlowMu is our local multi-agent collaboration system. FCoP organizes task identity and business records; the runtime handles dispatch, sessions and technical execution.

When a user asks to retry a task, the system must both handle the command and record its processing. A response may be lost or a process restarted. On seeing the same request later, the system must distinguish a new command from one already handled.

An idempotency key identifies the same intent. A command receipt is typically recorded as `pending` while being processed, then appended as `completed` when a result exists. Receiving the same key again can return the old result instead of repeating the operation.

We first inspected selected historical files to avoid mistaking event counts for incidents.

| Historical sample read September 8 | Count |
| --- | ---: |
| Task-command receipt rows | 10 |
| Distinct idempotency keys | 5 |
| Pending / completed | 5 / 5 |
| Malformed / exactly duplicated rows | 0 / 0 |

The records were from September 5. Ten rows represented state events for five commands, not five duplicate dispatches. They did not contain the corruption later injected by the experiment.

We therefore asked in isolated fixtures: **if a completion receipt can no longer be read, how does the system judge the same retry request?**

## 2. First round: the bytes remain, but the readable state moves backward

The current receipt reader searches lines in reverse order. It skips an unparseable line or a record with an unrecognized schema version, continuing to a readable match.

This tolerates unrelated bad lines, but it also means that a damaged completion may reveal an older pending receipt. If both target records are unreadable, the reader may return `null`: no usable record found.

Neither the inspected code nor the experiment showed the reader deleting original bytes. The difference concerns the evidence available to the caller, not what remains on disk.

To isolate this behavior, we used the real command kernel and receipt store, a fixed governance snapshot permitting retry, and a counting executor. Each retry created a new kernel instance so the previous instance's memory cache could not supply the answer.

Read the table for three patterns first: **intact receipts allow replay; damaged target receipts can lead to another call; downstream deduplication can still coalesce the effect.** The other controls test the conditions under which those statements hold.

| Controlled condition | Second read or handling result | Cumulative callbacks / synthetic effects |
| --- | --- | ---: |
| Intact completion | Reuses completed result | 1 / 1 |
| Unrelated malformed line only | Still reuses target completion | 1 / 1 |
| Damaged completion, intact pending | Enters callback again | 2 / 2 |
| Both target receipts damaged | No usable receipt; enters callback again | 2 / 2 |
| Both damaged, current revision changed | Rejects stale revision | 1 / 1 |
| Reader explicitly throws | Store unavailable; no further call | 1 / 1 |
| Completion changed to unsupported version | Finds older pending; enters callback again | 2 / 2 |
| Damaged completion, intact pending, revision changed | Detects state advance; no further call | 1 / 1 |
| Damaged completion, executor deduplicates same key | Callback repeats; effect is coalesced | 2 / 1 |

The explicit reader error was an injected counterexample, not a claim that the current reader reports corruption this way. The unsupported version was also synthetic. The last row's deduplication set lived in the experiment's memory, not a durable database.

The first-round conclusion therefore stops at the call boundary: **without an explicit read-anomaly signal, the real kernel can call the executor again; whether the effect repeats depends on that executor.** The existing kernel already permits retries from pending when the revision is unchanged, expecting downstream work to coalesce under the same key.

## 3. Second round: measure whether another execution actually starts

Instead of merely incrementing a counter, the second-round callback entered the product's actual task-starting flow. Components responsible for dispatch, attempt persistence, task lifecycle and sessions all came from the current product implementation.

A fixed governance snapshot permitted retry so the request could reach that layer. The final execution interface was still the in-memory substitute described above. We did not issue a request through the web interface: research code passed the same key and dispatch arguments following the web service's retry logic. This exercised actual dispatch components, not the entire web entrance end to end.

This answers a narrower question closer to execution: **does the real dispatch chain turn the repeated call into another attempt and another SDK start?**

Every scenario first confirmed that an execution started, then damaged isolated receipts and performed the second step. Counts include that first execution. **Look first for two outcomes: original-key scenarios did not start again; the new-key control could start.** The intervening rows distinguish cancellation, revision changes and concurrency.

| Scenario | Change | Second result | Cumulative SDK starts / attempts |
| --- | --- | --- | ---: |
| I0 | Intact receipts | Receipt-level replay | 1 / 1 |
| I1 | Completion corrupted | Already dispatched | 1 / 1 |
| I2 | Both target receipts corrupted | Already dispatched | 1 / 1 |
| I3 | I2, new process reads original disk state | Already dispatched | 1 / 1 |
| I4 | I2, cancel original session, retry original key | Already dispatched | 1 / 1 |
| I5 | I2, governance revision changed | Kernel rejects stale revision | 1 / 1 |
| I6 | I2, eight kernels concurrently call one dispatcher | All eight return already dispatched | 1 / 1 |
| I7 | Cancel, then use a new command key | New attempt and start | 2 / 2 |

![I2 repeats the callback without a second SDK start; I7 changes the command key and creates another attempt.](/assets/principal-receipt-20260908/02-callback-versus-start.en.svg)

*Figure 1. Cumulative counts include the first execution. The protection layers listed are not a claim that I2 traversed every check. Synthetic SDK starts are not external effects. Source: [formal I2/I7 observations and boundaries](/en/research/evidence/2026-09-08-principal-receipt).*

[Open full-size figure](https://joinwell52-ai.github.io/joinwell52/assets/principal-receipt-20260908/02-callback-versus-start.en.svg)

I1 and I2 correct the most dangerous extrapolation from round one. The receipt could no longer tell the kernel that processing had completed, but session and lease evidence still told the dispatcher not to start again.

I4 adds that cancelling a session does not turn the same command into a new one. Actual reconciliation moved the old attempt to a terminal state. The same key continued to reuse that attempt without another start. Here, the internal phrase “already dispatched” must not be translated as “the old process is still running.”

I7 is an essential control. Without it, readers could suspect the system simply never executes anything. With a different key, the new command allowed by synthetic governance created a second attempt. That is not a same-key duplicate effect, and it does not mean changing a key grants human authority. We did not test the complete authentication and approval interface.

## 4. The second start was not stopped by one all-powerful receipt

The source explains the observations.

First, the dispatcher checks sessions and active execution leases for the current task and round. A lease describes execution occupancy: who holds which attempt for a task. It is not a business conclusion that the task is complete. Existing sessions or active occupancy should not naturally grant another start merely because dispatch is entered again.

Second, the attempt store reuses records by idempotency key. `offer()` finds or proposes an attempt; `claim()` tries to acquire occupancy. These are not equivalent to “one call, one start.” Terminal attempts and conflicting leases have their own rejection conditions.

Finally, one dispatcher serializes redispatch for the same task. Preventing duplicate attempt records alone would not prevent two flows from simultaneously changing task placement. I6 therefore tests the single-instance protection around the larger operation.

I3 exposes a detail worth explaining. The new process has no old in-memory running handle, but the session list still reads a durable `running` record, and the lease remains. This conservatively blocks a second start. **It does not establish that the original executor is alive or that work has recovered.**

We did not run full startup recovery or simulate hardware power loss. “The new process retained existing occupancy evidence” accurately describes the result. “Power-loss recovery passed” would not.

## 5. Why external log repair cannot be imported as a local defect

One starting point was Orca's session-log repair proposal. It addresses a different risk: repair deleting log content after a damaged position, while provider-side conversation history cannot reconstruct the application's own receipts.

At the September 8 research snapshot, the proposal was still a draft. It preserves the original log, publishes the readable prefix as a new generation, and restricts writes for unsupported versions. This was not a released capability independently verified by us. [Orca #19399](https://github.com/stablyai/orca/pull/19399)

The two cases are not equivalent. Orca's proposal removes destructive repair; the reader in our experiment did not delete original text. The common concern is that recovery needs its own evidence. Reopening a conversation, or having the model remember it, does not establish that recovery's decision evidence stayed unchanged.

Nor do all local stores skip bad input. The inspected single-record session store distinguishes missing files from corrupt ones. Corrupt operation approvals return an explicit error. These readers also preserve the original bytes. Such counterexamples prevent generalizing one JSONL reader into a claim that the whole system treats corruption as absence.

## 6. The engineering question is read health, not a verdict of duplicate execution

The second round did not remove the read-layer anomaly. A damaged completion can still leave the caller seeing only an older pending receipt or no usable record, without knowing that corruption lies behind that answer.

Existing execution protections held in the tested scenarios, so the review question should be narrower: can the read result express both which record was found and whether reading was healthy? Should absence, corruption and unsupported versions carry distinct diagnostics? Which commands should those diagnostics affect, and which signals should support explanation or reconciliation only?

This does not immediately prescribe stopping the whole system for one bad line. Unrelated damage, a usable target receipt, version compatibility and actual execution occupancy need separate handling. A blanket block could cut off recovery paths that already work.

A reusable research method is to count each layer: original bytes retained, result read, callback entries, attempts created, executions started and external effects produced. Make conclusions only about the layer actually measured.

**Reliability research is not about proving a problem as quickly as possible. It is about locating the problem where a counterexample from the next layer can no longer overturn it.**

Here, the callback arrived twice without starting the task again. Preserve the protections that worked; clarify the read anomaly that remains unexpressed.

## Research and evidence boundaries

The fixed first-party source was `c008d9db91a21136fc61a4f60314e22db395d5d2`, examined September 8. Round one contained 18 module controls. Round two contained eight dispatch scenarios and four identity probes. Each set had two formal runs. This article uses related subsets, not repetition counts as incident samples or a reliability percentage.

All corruption was injected into isolated fixtures. Kernel, store, dispatch and session components were real; governance inputs and SDK were synthetic. No real external effects were tested. Eight-way concurrency shared one dispatcher in one process. The cross-process case was sequential handoff, not a cross-process write-lock test. Hardware power loss, all commands, all execution platforms and independent QA remain outside scope.

[English evidence guide](/en/research/evidence/2026-09-08-principal-receipt) · [Chinese guide](/zh/research/evidence/2026-09-08-principal-receipt). Sanitized per-run observations, source hashes, aggregate history and a record checker are public. The checker verifies saved observations, not a fresh execution of the product. Original operational records, complete before/after fixtures and full product replay remain access-restricted. The research changed no product code and authorized no recovery implementation.
