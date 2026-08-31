---
title: "Timeouts Must Close the Lifecycle They Own"
date: '2026-08-29'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "当一次工具调用派生后代进程时，超时应拥有并终结什么生命周期边界？"
summary: "A merged Google ADK Python change demonstrates a bounded process lifecycle: each invocation owns a process group, timeout and cancellation share cleanup, and teardown has graceful and forced limits. It proves bounded cleanup of the owned group, not disappearance of arbitrary process trees or external effects."
sources:
  - research/analysis/Q-20260829-03-bounded-lifecycle-ownership-beyond-direct-pid.md
item_id: "Q-20260829-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-29-timeouts-must-close-the-lifecycle-they-own-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-29-timeouts-must-close-the-lifecycle-they-own-cover-v2.png"
  kicker="Open-source Engineering · Daily Research"
  title="Timeouts Must Close the Lifecycle They Own"
  summary="A merged Google ADK Python change demonstrates a bounded process lifecycle: each invocation owns a process group, timeout and cancellation share cleanup, and teardown has graceful and forced limits. It proves bounded cleanup of the owned group, not disappearance of arbitrary process trees or external effects."
  version="Q-20260829-03"
  status="Daily Runtime V5 · 2026-08-29"
  languageHref="/zh/engineering/2026-08-29-timeouts-must-close-the-lifecycle-they-own"
  languageLabel="中文"
/>

# Timeouts Must Close the Lifecycle They Own

A command can be reported as timed out while its caller still never returns. The direct child may have exited, but a descendant can keep an output pipe open. Cleanup waits for complete output, so the timeout ends one process identity without ending the lifecycle owned by the invocation.

A merged Google ADK Python change demonstrates a concrete local-host pattern. The command starts in a new POSIX session and process group, and one shielded output-drain task spans the lifecycle. Timeout and caller cancellation share cleanup: send SIGTERM, wait for a bounded grace period, send SIGKILL if necessary, wait again, and abandon a still-stuck drain rather than blocking forever.

The central proposition is: **bounded execution should follow lifecycle ownership rather than direct-process identity. Terminal evidence must describe what happened to the owned process domain without inflating bounded cleanup into a claim that every descendant and external effect is gone.**

## Expand Ownership Beyond the Direct Process

A tool invocation may delegate work to several descendants. If the runtime owns only the PID initially returned by an API, delegation becomes a responsibility gap: descendants can continue using resources or holding descriptors after the parent exits.

A process group better approximates the real local responsibility. It places the process domain created by one invocation behind a boundary that can receive signals as a unit. In the covered tests, a background heartbeat descendant stops after both timeout and cancellation, closing the demonstrated escape.

A process group is still not an abstract “whole process tree.” A descendant can create a new session and escape. Remote jobs, containers, and external services do not obey local group signals. The portable principle is an explicit ownership domain, not one host mechanism presented as a universal answer.

## Cleanup Needs Its Own Deadline

Timing out the main command is insufficient. If teardown waits without limit for pipes, locks, or graceful exit, the user-facing deadline is false. Cleanup needs its own bounds and escalation policy.

One shielded drain matters because starting another read operation on timeout would create competing consumers and risk loss, duplication, or races. Keeping one output owner while timeout and cancellation reuse the same teardown path gives both terminal causes the same resource responsibility.

Graceful termination followed by forced termination gives processes a short opportunity to release resources. Abandoning output after the second bounded wait explicitly prefers lifecycle boundedness over forensic completeness. It is not lossless; it is an explainable tradeoff.

## Cancellation Does Not Abandon Owned Work

Caller cancellation is often implemented as an immediate rethrow. If the parent coroutine leaves before cleanup, subprocesses become ownerless resources. A safer order performs bounded teardown first and then propagates cancellation. Control flow may be cancelled without silently discarding lifecycle responsibility.

Intentionally long-lived services are an exception, but they require an explicit ownership handoff. A handoff receipt should say who took responsibility, under what authority, and how termination works. A detached process without that evidence is a leak or uncertain residual, not a legitimate service.

## Report What the Terminal Evidence Proves

A useful timeout receipt can distinguish direct-process exit, owned-group termination, forced escalation, output abandonment, and uncertainty about resources that escaped the ownership domain.

This layered language avoids two errors. It does not translate “command timed out” into “all work stopped.” It also does not erase the proven fact that owned-group cleanup was bounded merely because arbitrary descendants cannot be ruled out.

## Scope of the Mechanism

The evidence is one merged implementation and its maintainer tests, and the guarantee exists only where POSIX process-group signaling is supported. It does not cover Windows Job Objects, containers, remote jobs, daemon handoff, or distributed external-effect rollback. Output after forced termination may be incomplete.

A cross-platform runtime should therefore select an equivalent ownership abstraction: a process group locally, perhaps a Job Object, container identity, or remote lease elsewhere. Mechanisms differ; responsibility should not. **A deadline must govern the work an invocation actually owns, and its completion receipt may claim only the boundary covered by evidence.**

**Primary evidence:** [merged Google ADK Python commit fa321f1b](https://github.com/google/adk-python/commit/fa321f1b49f7bd961b58ad19fd8b8e6fa285b918). The implementation supports bounded local process-group cleanup, not universal process-tree or external-effect termination.
