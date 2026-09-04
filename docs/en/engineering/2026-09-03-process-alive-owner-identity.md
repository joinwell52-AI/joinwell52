---
title: "The Process Is Alive. Is It Still the Original Executor?"
date: "2026-09-03"
published_date: "2026-09-04"
column: open-source-engineering
category: daily
article_type: experiment-report
edition: research-center
research_question: "Does an old execution record reliably identify the currently live process as its original owner?"
summary: "Codex's Windows process-identity changes highlight a distinction: a live PID is not necessarily the original executor. In a controlled CodeFlowMu comparison, writer locks recognized a timestamp contradiction while approval records retained executing."
cover: "/assets/covers/host-research-20260903-process-identity.png"
language: en
lifecycle: Published
publication_authorized: true
evidence_status: "Controlled durable-state reproduction on V2.2.6; no induced OS PID reuse or external execution"
---

<ArticleCover
  image="/assets/covers/host-research-20260903-process-identity.png"
  kicker="Open-source engineering · Controlled experiment"
  title="The Process Is Alive. Is It Still the Original Executor?"
  summary="A live PID does not establish executor identity. Two existing record paths interpret the same controlled timestamp contradiction differently."
  version="2026-09-03"
  languageHref="/zh/engineering/2026-09-03-process-alive-owner-identity"
  languageLabel="简体中文"
/>

<ArticleTableScroll language="en" />

# The Process Is Alive. Is It Still the Original Executor?

An Agent execution process exits. Later, the operating system assigns the same process number to another process.

When the old execution record is read again, the system checks the number. It is alive.

If recovery logic stops there, the record may continue to say “executing.” What it found was not the previous executor, but a process that happens to use that number now.

This is a scenario to guard against, not a production incident we claim occurred. What drew our attention was a change to managed Windows process identity in OpenAI Codex. Following that external change into CodeFlowMu revealed something more specific than a complete lack of protection: **the protection exists in one place, but the same semantics do not reach another execution record**.

## 1. Why does Codex preserve more than a PID?

Codex is OpenAI's coding Agent, and its app-server provides a runtime interface for clients. When such a service runs in the background, starting, stopping and upgrading it require knowing which process is being operated on.

In [Windows lifecycle PR #42381](https://github.com/openai/codex/pull/42381), process management uses a Windows process handle and creation time in addition to a PID. It rechecks identity before termination, avoiding confusion with a later process that reused the number. The subsequently merged [upgrade handoff PR #42392](https://github.com/openai/codex/pull/42392) also addresses successor readiness and ownership handoff. These are merged source changes, not a claim that we tested every released form of them.

The important relation is not exclusively a Windows trick: a PID is a locator, not a permanent identity. Once a long-lived Agent system writes a number to disk, its next read crosses time. The same number does not establish continuity of responsibility.

Learning from an external project does not mean copying a daemon. First, we had to ask whether CodeFlowMu already addressed this problem.

## 2. An answer already exists locally, but not in every record

CodeFlowMu is the local multi-Agent collaboration system we are developing. This source inspection and experiment were fixed at V2.2.6, commit `5c94d8c3b0147b779b17f620b811c6a17cc65288`.

Its Runtime writer lock already protects process identity. The lock prevents multiple instances from owning the same write scope; its owner is the process holding the lock.

On Windows, `runtime-process-identity.ts` queries actual process creation time and produces an identity token that retains time precision. `runtimeLockOwnerIsStale()` does more than check liveness: when a creation token exists it compares tokens. For legacy locks without that token, it checks a temporal contradiction—if the current process was born after the lock was acquired, it cannot be the original owner. Missing permission or unavailable identity does not automatically establish that the original owner is dead.

This finding ruled out an overbroad article premise: we cannot say CodeFlowMu uses only PIDs and has no process-identity protection.

Another path is the operation approval service. It stores an approved action's execution record, including `executing`, an executor PID and a start time. When reading the record, it attempts to identify an interrupted executor. The central condition is:

```typescript
record.status === "executing" &&
record.execution.executor_pid !== process.pid &&
!isProcessAlive(record.execution.executor_pid)
```

When that condition holds, the service changes the record to `partial_failed` and asks for inspection of the target outcome. Unlike the writer lock, this recovery logic does not compare process creation identity. If the saved PID equals the current process's PID, even this death check is skipped.

The components have different responsibilities and need not produce identical states. But they share a prerequisite question: **can this old record still be attributed to the process currently found under that number?**

## 3. We did not wait for real PID reuse

We did not repeatedly create processes until the operating system reassigned a particular number. Nor did we interrupt a real business operation.

The experiment created isolated approval records through the actual `OperationApprovalService.prepare()` and `approve()` methods. It then controlled the saved execution state, PID and start time. A new service instance read the record through the real `get()` method, triggering its recovery judgment. The executor was never called.

For comparison, we used the real operating-system process probe and supplied the same PID and controlled timestamp to the existing writer-lock function. This constructed a **legacy lock record without a process-start token**, exercising the compatibility check for a process born after the record. It did not invent two different tokens merely to obtain a predetermined mismatch.

Three input types were each repeated twice in fresh isolated directories:

| Controlled record | Approval state after reading | Writer-lock judgment for the same owner time conditions |
|---|---|---|
| Current PID, current start time | executing | Not stale |
| A PID confirmed absent by the OS | partial_failed; inspect outcome | Stale |
| Old start time, currently live current-process PID | **Still executing** | **Stale** |

The third row is decisive. The fixture assigns a start time in 2000; the actual process was created during this experiment. The writer-lock function recognizes the contradiction, while the approval read path retains `executing`.

[![The same controlled PID and old timestamp produce different judgments](https://joinwell52-ai.github.io/joinwell52/assets/host-research-20260903/figure-02-process-identity-en.png)](https://joinwell52-ai.github.io/joinwell52/assets/host-research-20260903/figure-02-process-identity-en.png)

*Figure 1. A synthetic old record compared with actual OS creation metadata. This is not a production PID-reuse incident. Detecting an owner mismatch does not establish an absent effect or permission to retry. Click for the full-resolution image.*

The year 2000 is an intentionally constructed test value, not a historical log. We model the visible state of an old record encountering a current same-number process; **we did not induce an OS PID-reuse event**. Creating another service object also does not restart the Runtime process. The two rounds test repeatability of the controlled method, not cross-process restart reliability.

The comparison itself also needs a limit. We mapped the approval start time into the synthetic old lock's acquisition time to test the same temporal contradiction. We did not establish that production contains a real approval and a real writer lock with exactly matching timestamps.

Inputs, real OS metadata and outputs are covered by E2 in the [evidence guide](/en/research/evidence/2026-09-03-host-authority-conformance). External executor calls were zero in all six observations.

## 4. Failure to recognize interruption is not proof of duplicate execution

The result supports a narrow conclusion: the current approval execution record's recovery judgment distinguishes process generations less strongly than the existing writer-lock judgment. Under the constructed old-record condition, it can retain `executing` despite time evidence sufficient to reject the original owner's identity.

This may affect a user's judgment about whether to keep waiting for that executor. But our experiment did not establish that the system then initiated another action, terminated an unrelated process, or accumulated any particular number of long-running production records.

The negative control in the second row matters. When the PID really is absent, the existing service recognizes interruption and explicitly asks for outcome inspection. Recovery handling exists. The gap is distinguishing a live PID from the original process identity.

The relevant existing regressions—four process-identity tests, nine writer-lock tests and fifteen operation-approval tests—all passed twice. Existing protections are not merely designs on paper, but passing tests cannot guarantee an untested handoff condition. These are subsets of the 41-test regression selection, not extra tests to add to a new “system reliability” total.

## 5. An invalid owner still does not authorize a retry

The most dangerous fix would be to detect the missing original executor and immediately hand the action to another Agent to run again.

The old process may have completed the external action but failed to finish recording it. Process identity helps establish who still owns execution responsibility. It cannot determine whether a remote commit, file change or message send occurred.

Four questions must remain separate:

- **Liveness:** does this process number currently identify a process?
- **Identity:** is it the executor named by the record?
- **Effect facts:** did the original action occur?
- **Current authority:** is that action still permitted now?

Answering the first two does not automatically answer the last two.

This also applies to CodeFlowMu's FCoP file coordination. A TASK file and its lifecycle location preserve task identity and business context. File persistence alone cannot establish that an interrupted action never happened. The recovery-admission contract discussed earlier can connect with this identity research, but a newer version number does not turn all proposed components into delivered capabilities.

A direction worth review is to bind long-lived execution-owner records to a verifiable process generation, distinguishing match, mismatch and unknown. Reuse the existing identity mechanism where possible instead of inventing another PID check with slightly different semantics.

For old records, the current process's creation time must not be backfilled as the original executor's identity. That would turn missing evidence into a fabricated verification. Preserve unknown when reliable metadata is absent. Once interruption is recognized, continue to inspect effects rather than convert identity failure into reexecution permission.

These remain engineering proposals after research. This study changed no product code, performed no real side-effect recovery, and constitutes neither independent QA nor development authorization.

The external Codex change was valuable precisely because it led to a more specific question: is the same identity fact interpreted consistently by every record that depends on it?

**A process number still in use does not mean the old responsibility still has an owner.**
