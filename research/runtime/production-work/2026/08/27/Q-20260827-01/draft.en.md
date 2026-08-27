---
schema: publication-candidate-article/v2
title: "Running Is an Evidence Claim, Not a Scheduler Event"
date: '2026-08-27'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "What evidence should a digital-employee runtime require before publishing an externally visible Running state?"
summary: "Claude Code 2.1.247 fixes a premature Running report on an affected self-hosted runner path. The incident shows that a state is an evidence claim to consumers: scheduling, claim, process startup and readiness should not collapse into one label."
cover: staging/publication-candidates/2026-08-27-running-is-an-evidence-claim-cover.png
sources:
  - research/analysis/Q-20260827-01-execution-readiness-before-running-state.md
---

![Running Is an Evidence Claim, Not a Scheduler Event cover](staging/publication-candidates/2026-08-27-running-is-an-evidence-claim-cover.png)

# Running Is an Evidence Claim, Not a Scheduler Event

A session can be scheduled before the process that will execute it exists. A process can exist before it has initialized, connected or become able to accept every relevant class of work. When a UI or automation acts on status, those distinctions cannot safely be compressed into a single Running label.

Anthropic's official Claude Code 2.1.247 release note describes a fix on an affected self-hosted runner path. Sessions could previously report running before Claude Code had started, which could cause the desktop app to issue a premature notification that Claude was waiting for input. The incident turns an abstract state-modeling problem into an observable failure: the control plane held scheduling intent while the consumer interpreted executable reality.

The defensible conclusion is: **an externally visible Running state should be published only after the runtime holds evidence sufficient for the execution-readiness semantics its consumers rely on. Scheduling, assignment and worker claim must remain distinguishable from readiness, and the disclosed process-start boundary is not proof of full health.**

## A status becomes an interface contract when it triggers behavior

If a label is used only inside a queue, calling assignment “running” may be a local naming choice. Once a desktop client sends a notification, monitoring computes duration, or another agent begins waiting for output, the state becomes a contract across components. It describes not only what the control plane did but what consumers may safely infer.

The defect here is a mismatch between evidence strength and external promise. The release note directly supports three bounded facts: the relevant version was published; an affected path could report running before process startup; and the fix prevents that premature ordering. It does not disclose whether the new gate is process creation, IPC establishment, a protocol handshake, a first heartbeat or another signal.

A runtime should therefore define state from the minimum fact its consumer needs, not from the earliest event the scheduler can observe. Internal “assigned” may be available early. User-facing “ready to execute” requires stronger evidence.

## Separate the facts consumers tend to collapse

A more truthful lifecycle can distinguish at least five levels:

1. Scheduled: work entered the plan, without an actual executor.
2. Claimed: a worker owns the opportunity, while its execution process may not yet exist.
3. Starting: the process or substrate is being established and may still fail initialization.
4. Running: the consumer-specific readiness threshold has been crossed.
5. Terminal: durable evidence supports success, failure, blockage or a governed skip.

The names need not be universal. The requirement is that each name bind to checkable evidence. A worker claim proves ownership, not process readiness. Process startup proves an ordering event, not successful dependency loading, authentication, network connection or availability of a particular capability.

A richer state model also improves diagnosis. Work stuck at Claimed points toward worker startup. Work stuck at Starting points toward initialization or handshake. If every stage projects as Running, operators see one long-lived label that explains neither real progress nor why a false notification escaped.

## Derive the readiness gate from the consumer promise

Readiness is not a context-free global boolean. A command-line client may need only a process capable of accepting input. A digital employee with tool access may also require identity, policy, dependencies and communication channels to be initialized. Different consumers can read different projections of the same internal state machine, but every projection needs an explicit evidence threshold.

Design the gate backward. What action will a consumer take after seeing Running? Which facts must already be true for that action to be justified? Which recorded event attests those facts? If the evidence is absent, preserve Claimed or Starting instead of filling the gap with an optimistic label.

Failure paths deserve the same discipline. A startup timeout should not briefly pass through Running before becoming Failed. A retry should not allow an old worker's state to contaminate a new execution epoch. Status events should bind to an execution identity, timestamp, evidence source and responsible component so recovery can distinguish fresh readiness from stale records.

## The boundary matters more than a louder conclusion

The current evidence is an official vendor release note, not an independent reproduction, source inspection or published regression test. It establishes a bounded ordering requirement: on the affected path, externally visible running must not precede Claude Code process startup.

It does not establish that process startup means fully initialized, healthy, connected or able to accept every class of work. Nor does it prove that every Claude Code lifecycle uses the same gate. Turning the fix into “process creation proves complete readiness” would repeat the same evidence-to-semantics error at a different boundary.

The most useful review question is therefore not “what is the label called?” It is: **which consumer takes which action from this state, and what verifiable evidence is strong enough to justify that action?** Without answers to both parts, the state remains control-plane intent rather than dependable runtime truth.

**Primary evidence:** [Claude Code 2.1.247 official release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.247). The source supports the affected-path defect and process-start ordering; it is not independent validation of a complete readiness model.
