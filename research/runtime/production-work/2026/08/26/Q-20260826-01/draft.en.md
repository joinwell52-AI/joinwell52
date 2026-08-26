---
schema: publication-candidate-article/v2
title: "Foreground Completion Is Not Workflow Completion"
date: '2026-08-26'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "When a digital-employee workflow launches detached work, what evidence should determine whether the parent workflow is actually terminal?"
summary: "A merged Google ADK change makes tracked in-flight detached dynamic work participate in parent terminal truth. The pattern is ownership-based: parent success waits for owned outcomes, without claiming remote-effect certainty or distributed exactly-once behavior."
cover: staging/publication-candidates/2026-08-26-foreground-completion-not-workflow-completion-cover.png
sources:
  - research/analysis/Q-20260826-01-detached-work-parent-terminal-accounting.md
---

![Foreground Completion Is Not Workflow Completion cover](staging/publication-candidates/2026-08-26-foreground-completion-not-workflow-completion-cover.png)

# Foreground Completion Is Not Workflow Completion

An agent workflow can reach the end of its visible path while work it launched is still running. If the runtime calls that state successful, the problem is deeper than a missing `await`: the system has confused foreground completion with the terminal truth of all work the workflow still owns.

A Google ADK maintainer change merged on 2026-08-25 addresses a bounded version of that failure. After static graph work ends, the workflow now finds tracked dynamic tasks that remain in flight, waits for them, and inspects their outcomes before allowing a clean finish. A raised exception, an error returned in a child context, or an interrupt from a detached execution form that cannot be resumed can turn the enclosing workflow into an error instead of a false success.

The design lesson is: **detached work remains part of parent terminal truth until it becomes terminal under that parent or is explicitly transferred to another governed owner.** A background label, spawn acknowledgement or foreground return is not terminal evidence.

## The real defect is missing ownership accounting

“Fire and forget” describes control flow, not responsibility. The parent may stop waiting on the call stack while still owning the result. Without an explicit record of that ownership, the runtime has no principled way to decide whether the parent is complete, cancellable or still exposed to a late failure.

The selected change strengthens the demonstrated boundary in three steps. It keeps dynamic work visible as in-flight state, adds a join after static work completes, and surfaces a bad detached outcome into the enclosing context. Focused tests cover an in-flight detached success, failure and interrupt. Together, those elements make parent success a decision over owned work rather than a side effect of the foreground function returning.

This also explains why occurrence identity matters. Cancellation, inspection and terminal filtering must refer to the same detached execution, not merely to a task type or command name. A useful registry therefore needs at least an occurrence identifier, an owner, a lifecycle state and the evidence that closed that state.

## A terminal barrier needs an ownership-transfer rule

Not every background task should keep its originator alive forever. Long-running work may be deliberately transferred to a queue, service or another durable run. But that is an ownership change, not an automatic consequence of detachment.

The parent should be allowed to close only after the handoff identifies the new owner and records enough evidence to reconcile responsibility later. Otherwise “detached” becomes a loophole through which terminal responsibility silently disappears.

The opposite risk is liveness. A task that never reaches a terminal state can hold the parent open indefinitely. Timeouts, cancellation and administrative reconciliation therefore need distinct outcomes. Treating a timeout as success would restore the original false-truth problem; treating every cancellation as an ordinary error may also erase important operator intent.

## Local task closure is not external-effect certainty

The evidence is narrower than a general background-work protocol. The ADK path inspects dynamic tasks that are still represented as in flight at graph completion. Cancelled tasks are skipped, and a detached run that finished before the inspection point cannot be distinguished by this mechanism from one that was awaited and handled normally.

Even a correctly terminal local task does not prove that a remote side effect committed, rolled back or occurred exactly once. Nor does an in-memory registry prove that ownership survives process loss. Those guarantees require separate persistence, idempotency and reconciliation contracts.

The defensible conclusion is therefore precise: the demonstrated join-and-inspect mechanism prevents one class of false success for tracked in-flight detached dynamic work. It improves workflow terminal truth without proving crash durability, universal background-task coverage or distributed exactly-once execution.

## What remains operationally unresolved

Runtime designers still need answers for ownership handoff, cancelled detached work, multiple concurrent failures and crash recovery. In particular, a recovered parent must not infer completion merely because its in-memory task list is empty. It needs durable evidence about which occurrences it owned and how each was closed or transferred.

That is the broader engineering agenda: make terminal success an auditable statement about responsibility, not a convenient timestamp emitted when the visible path ran out of steps.

**Primary evidence:** [Google ADK merged commit 34e13df4](https://github.com/google/adk-python/commit/34e13df41750fc5243a1cd42a86491ee5acdd876). The implementation and focused regressions support the bounded in-flight terminal-accounting claim; they are not independent validation of distributed execution guarantees.
