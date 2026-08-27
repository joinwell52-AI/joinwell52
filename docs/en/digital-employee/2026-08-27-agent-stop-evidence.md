---
title: "You Cancelled the Agent. Did Its Child Processes Actually Stop?"
date: '2026-08-27'
column: digital-employee
category: daily
article_type: engineering-analysis
edition: research-center
research_question: "Can a cancellation request, a root-process exit, and proven execution-tree containment be represented by one stopped state?"
summary: "A real external corpus with missing result files and a deliberately narrow Windows probe show why cancellation is an action record, not proof that an agent execution tree is gone."
sources: "/zh/research/evidence/2026-08-27-runtime-semantics-evidence-pack"
project_relevance: first-party-research
item_id: "RSEM-20260827-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-27-agent-stop-evidence-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-27-agent-stop-evidence-cover.png"
  kicker="Digital Employee · Engineering Research"
  title="You Cancelled the Agent. Did Its Child Processes Actually Stop?"
  summary="A real external corpus with missing result files and a deliberately narrow Windows probe show why cancellation is an action record, not proof that an agent execution tree is gone."
  version="RSEM-20260827-01"
  status="Engineering Research · 2026-08-27"
  languageHref="/zh/digital-employee/2026-08-27-agent-stop-evidence"
  languageLabel="中文"
/>

# You Cancelled the Agent. Did Its Child Processes Actually Stop?

Some agent failures become invisible the moment a dashboard stops spinning. A task has been cancelled. Its output tail is still on disk. A result path is recorded, but the file is no longer there. The tempting response is to send the work to another agent.

That can be the moment two executions begin writing into the same workspace.

An Anywhere Agents maintenance change by Yue Zhao began with a concrete version of this situation: 27 work units had recorded result paths whose result files were gone, while 24.3 MiB of tail output remained available for inspection. The implementation did not collapse those units into “recoverable” or “failed.” It separated the state of the recorded path from the state of the result itself. A permission error, an I/O error, and an absent file were deliberately different observations; only an actual `FileNotFoundError` could label a target as missing. The [commit](https://github.com/yzhao062/anywhere-agents/commit/570c89f4c4bfa03bc5cea0a43a7fcf9fef0261ab) states the discipline plainly: a failed observation must not become an outcome.

That made us reconsider what a Cancel button should mean in CodeFlowMu, the local multi-agent collaboration system we are developing. Before showing “stopped,” what has the runtime actually seen?

## One button, several different facts

Suppose a development agent is running a build when its input is superseded. A manager cancels the run. The runtime requests termination; the wrapper process exits; a direct child may exit too; a result file may stop changing; the task may later receive permission for a new attempt.

Those are not one event.

| What happened | What it establishes | What it does not establish |
| --- | --- | --- |
| A cancellation was recorded | The runtime attempted to stop this attempt | The operating system stopped every process |
| The wrapper PID disappeared | The known outer process exited | Descendants, file handles, and ports are gone |
| A direct child disappeared | One observed child exited | No escaped descendant is still running |
| A result path cannot be read | The result cannot currently be obtained there | No other copy exists or will be written |
| A new attempt is allowed | A formal rule or owner permits another run | The previous execution tree was fully cleaned up |

![Figure 1: What one cancellation actually establishes](/assets/figures/2026-08-27-agent-stop-evidence-figure-1.svg)

*Figure 1. A cancellation request, outer-process exit, and direct-child exit are separately observable facts. Together they define the scope of this Windows probe; they do not prove containment of every descendant. Source: public candidate evidence pack R1.*

The final distinction matters most. A decision to resume work is a scheduling and business decision. Process containment is an operating-system fact.

## Why a missing root process is still weak evidence

[Anywhere Agents Issue #29](https://github.com/yzhao062/anywhere-agents/issues/29) makes the problem harder in a useful way. It documents four increasingly strict orphan-reaping approaches. First, a signal had been sent; then the recorded root was gone; then the process group was empty; finally repeated snapshots appeared to converge. Each claim was defeated by a narrower live counterexample: a descendant could ignore a signal, leave a process group, or be created between observations.

The issue therefore argues for kernel-backed containment at dispatch time. Its point is not that a runtime should never try to stop work. It is that PID, parent links, and process groups alone do not justify a tree-wide “reaped” claim. The issue is open and concerns Anywhere Agents, not CodeFlowMu. Still, it captures a broadly relevant distinction: **not seeing a process is not the same capability as proving it is gone.**

## What our Windows probe actually found

CodeFlowMu’s managed-command records already keep separate task and root-task identifiers, attempts, leases, wrapper and child PIDs, heartbeats, cancellation requests, and cancellation outcomes. Its Windows cancellation path invokes `taskkill /PID <pid> /T /F`.

We did not translate that call into a containment guarantee. Instead, in a fresh isolated temporary directory, we created a wrapper and one long-lived direct child, ran that same `taskkill /T /F` path against the wrapper, and checked both PIDs. The result was **1/1 PASS**: the wrapper and the direct child were both observed to exit.

This settles one narrow question on this Windows host: `/T` did not kill only the outer process in this two-level sample. It does not settle whether a child can escape the relationship, what happens with deeper descendants or different privileges, or whether containers and remote workers are covered. Our code reading also found no Windows Job Object implementation or equivalent kernel-backed containment fixture.

Separately, an existing managed-command fixture simulated two hours of silence, 101 observations, and restart recovery after index loss. It also passed **1/1**. That test answers a different question: silence must not be silently rewritten as death.

## Hand the next agent evidence, not a reassuring label

The useful output of cancellation is a small handoff record:

```text
Cancellation request: sent
Outer process: observed exited
Known direct child: observed exited
Tree containment: not verified
Result file: unavailable / still to be checked
Next attempt: requires the existing retry rule or an owner decision
```

“Not verified” is neither a failure nor an evasion. It prevents a costly fiction: treating an unknown scene as clean, then starting another agent in the same workspace.

Local-first engineering does not require pretending to solve distributed process management. CodeFlowMu’s current scope is one local workspace and one controlled runtime. Its local dispatch path has a lease-conflict fixture that prevents two agents on that path from holding the active execution lease for the same task. That is not a guarantee for two independent runtimes, a network filesystem, or arbitrary process trees.

The next valuable work is not a louder Cancelled badge. It is a set of counterexamples: a wrapper that dies while its child continues; a child that leaves its original process relationship; and a cancellation that races with a still-writing result and a re-dispatch request. Each should leave the same trace: what the system observed, what remained unknown, and what it consequently allowed.

## Sources and limits

The external case is Yue Zhao’s [Anywhere Agents commit 570c89f](https://github.com/yzhao062/anywhere-agents/commit/570c89f4c4bfa03bc5cea0a43a7fcf9fef0261ab) and its open [Issue #29](https://github.com/yzhao062/anywhere-agents/issues/29). The [public evidence pack](/zh/research/evidence/2026-08-27-runtime-semantics-evidence-pack) gives the Windows probe contract and its de-identified output. The first-party material supports only the stated controlled scope; it does not prove kernel-backed containment in CodeFlowMu or guarantee that arbitrary Windows process trees are reaped.
