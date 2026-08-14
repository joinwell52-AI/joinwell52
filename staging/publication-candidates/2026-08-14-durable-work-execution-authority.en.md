---
schema: publication-candidate-article/v2
title: "Durable Work Is Not Execution Authority"
date: '2026-08-14'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "How should long-lived digital employees preserve pending work across interruption and restart without turning persistence itself into permission to execute?"
summary: "Durable queues solve only one reliability problem: preserving work identity. Safe autonomous resumption requires separate execution admission, explicit resumption authorization, and additional ownership and side-effect safeguards."
cover: staging/publication-candidates/2026-08-14-durable-work-execution-authority-cover.png
sources:
  - research/analysis/Q-20260814-01-durable-work-identity-execution-authority.md
  - research/reading/Q-20260814-01-persistent-thread-queue-dispatch-boundary.md
---

![Durable work and execution authority cover](staging/publication-candidates/2026-08-14-durable-work-execution-authority-cover.png)

# Durable Work Is Not Execution Authority

A long-lived digital employee has a deceptively simple reliability problem: what happens to pending work when the process is interrupted, the user disconnects, or the worker restarts? The obvious answer is persistence. Put the work in durable storage and recover it later.

That answer is necessary, but incomplete. A durable record establishes that work **exists**. It does not establish that a worker is **allowed to execute it now**.

The 2026-08-14 research object examined a merged per-thread queue implementation in Codex. The implementation gives queued submissions stable identity, persists them by thread, and retains them until the core has actually accepted a turn. It also deliberately suppresses automatic dispatch after an interruption and provides an explicit operator-controlled resume path. These are bounded implementation facts, not proof of a universal digital-employee architecture. They nevertheless expose a useful engineering separation.

## Three facts that should not collapse into one

A reliable agent runtime needs to distinguish at least three facts.

First, **work identity**: the pending job exists, has a stable identity, and survives a session or process boundary. Second, **execution admission**: a dispatcher has determined that the job may be consumed by a worker under current conditions. Third, **resumption authorization**: a prior pause, interruption, budget stop, or policy stop has been explicitly cleared according to the relevant rule.

Persistence solves the first problem. It cannot silently solve the second or third.

The selected implementation makes this distinction visible in two mechanisms. A queued item is deleted only after the core reports that execution has started, narrowing the loss window that would exist if the queue record were removed before admission. Separately, an interrupted thread is not treated as ordinary idleness: automatic dispatch is suppressed until an explicit start action clears the policy boundary.

The important point is not the particular queue API. It is that **storage state and permission state remain different kinds of state**.

## Why “resume everything when idle” is unsafe

A throughput-oriented scheduler can treat every idle worker as available and drain its queue immediately. That policy is attractive because it minimizes latency and keeps capacity busy. But it erases the distinction between “nothing is executing” and “continuation is authorized.”

Those states are not equivalent after an operator stop, a safety interruption, a budget limit, or a policy decision. In those cases, pending work may need to remain durable precisely because it must *not* run yet.

This is also why failure classification belongs in dispatch policy rather than storage. Some failures may legitimately allow automatic continuation. Others may require human or policy authorization. A queue should not infer the answer merely from the fact that a record is present and a worker is idle.

## Deletion after admission is stronger, but not exactly-once

The examined mechanism also illustrates a second boundary. Keeping a durable item until the execution core returns `Started` is safer than deleting it first. It means the queue remains authoritative until a concrete admission event occurs.

But that does not establish exactly-once completion. A crash can still happen after admission and before durable completion. If external tools, APIs, files, or other systems have already been affected, replaying the work may repeat a side effect.

The research evidence therefore supports only a local conclusion: deletion-after-admission improves the handoff boundary. It does not prove distributed ownership, cross-process exclusion, or idempotent external effects.

## What changes in a multi-worker runtime

The selected queue uses in-process serialization. That is meaningful inside one process, but it does not answer what happens when multiple workers or hosts can consume the same durable queue.

At that point, a runtime needs an additional ownership mechanism: a lease, fencing token, transactional claim, or another form of cross-process exclusivity. Stable work identity is still useful, but it does not tell the system which worker currently owns execution authority.

The same separation applies to recovery. A restart may reconstruct the durable work record while still lacking reliable evidence about whether a previous worker crossed the admission boundary or produced an external effect. Recovery therefore needs evidence beyond the queue itself.

## Engineering implication: model authority explicitly

For long-lived digital employees, a safer contract is:

**work exists → execution is admitted → resumption is authorized → effects are reconciled → completion is durable**.

Not every system needs a heavyweight workflow engine to implement that contract. A single-process, low-risk assistant may reasonably choose a simpler queue and automatic drain. The coordination mechanism should match the risk and concurrency model.

What should remain invariant is the semantic boundary. Persistence should not be treated as an execution permit. Idleness should not be treated as resumption consent. Local serialization should not be described as distributed ownership. And a successful execution start should not be described as exactly-once completion.

## Operational implications

This separation has practical consequences for runtime design and observability. Work records should retain stable identity independently of user interfaces and worker sessions. Admission events should be explicit and auditable. Pause and interruption states should carry a resumption rule rather than collapse into a generic idle state. Multi-worker systems should record ownership or lease evidence. Recovery should preserve enough information to determine whether an external effect may already have occurred.

These requirements are less about adding more states than about preventing one state from carrying authority it does not actually possess.

## Limits of the evidence

The evidence here comes from one experimental Codex per-thread queue implementation and its tests. It is public implementation evidence, but not independent validation of a general digital-employee scheduler. The source does not establish distributed consensus, cross-process exclusion, priorities, deadlines, dependency scheduling, service-level policies, or exactly-once external effects.

The useful result is therefore bounded: the implementation demonstrates a strong local version of the separation between durable work identity, execution admission, and resumption authorization. The additional layers required for distributed ownership and side-effect-safe recovery remain open engineering problems.

## Open questions

When multiple workers can consume one thread, what lease and fencing model is sufficient? Which failure classes should resume automatically, and which should require explicit authorization? What evidence must survive between execution admission and durable completion so that recovery does not repeat an external side effect?

Those questions begin where durable persistence ends. That boundary is precisely why persistence should be treated as a reliability primitive—not as permission to act.
