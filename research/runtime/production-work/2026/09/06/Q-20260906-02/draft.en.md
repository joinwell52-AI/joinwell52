---
schema: publication-candidate-article/v2
title: "Recovery Is a Trajectory, Not a Boolean"
date: '2026-09-06'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "如果“网络最终恢复”可以与严重的中间扰动、累积负担或对不同阶段作用相反的协调政策同时存在，分布式智能体系统必须测量什么？"
summary: "A system being healthy now does not prove that it behaved resiliently during disruption. Distributed-agent resilience must preserve separate evidence for degradation, containment, restoration, cumulative burden, terminal state, and authoritative mutation."
cover: staging/publication-candidates/2026-09-06-recovery-is-a-trajectory-cover.png
sources:
  - research/analysis/Q-20260906-02-phase-indexed-resilience-governance.md
---

![Recovery Is a Trajectory, Not a Boolean cover](staging/publication-candidates/2026-09-06-recovery-is-a-trajectory-cover.png)

# Recovery Is a Trajectory, Not a Boolean

At the end of an incident, service returns to green. If the record preserves only that terminal state, the system appears to have met its resilience objective—even if it experienced prolonged loss of control, severe unmet demand, costly detours, or a coordination policy that improved an early phase while worsening full restoration.

The core proposition is: **resilience is a phase-indexed lifecycle rather than a terminal Boolean. Degradation, containment, restoration, cumulative burden, and authoritative state mutation require distinct evidence even when the final state is recovered.**

## What a Green Terminal State Deletes

“Where is the system now?” and “how did it get here?” are different questions. A recovered flag cannot show:

- when and how quickly service degraded;
- whether dangerous propagation was contained soon enough;
- when partial and full capability returned;
- how much delay, shortage, cost, or other harm accumulated;
- which authority could establish that the environment had changed.

If an organization governs containment time or cumulative loss, a healthy terminal state can coexist with a failed resilience objective. Later good state must not overwrite intermediate bad evidence.

## A Simulation of More Than Five Thousand Agents Separates the Phases

The primary study examined by the same-date Research Object models a supply network with 5,076 autonomous nodes. Nodes may propose and negotiate actions, while the simulation environment retains authority over allocation, feasibility, and state commit. That boundary matters: an agent proposal is not world state. It becomes a measurable network mutation only after environmental constraints accept and commit it.

The study does not use eventual recovery as its only outcome. It distinguishes initial degradation, containment or partial stabilization, restoration, and full recovery with cumulative burden. Reported outcomes can diverge across phases: faster early stabilization does not guarantee better later restoration or lower cumulative disruption, and higher trust is not uniformly beneficial under the examined conditions.

This is agent-based simulation evidence, not incident evidence from a deployed enterprise system. The 5,076-agent scale demonstrates breadth inside the model, not production scalability. A centralized simulation authority also cannot be copied directly into a multi-firm supply network.

## One Incident Needs Five Evidence Families

A minimal resilience record can preserve five propositions under one incident identity:

| Evidence | Question answered | Example stop condition |
|---|---|---|
| Degradation | What failed, and how fast? | Critical dependency impairment exceeds policy |
| Containment | Did propagation slow soon enough? | Risk continues spreading to new nodes |
| Restoration | How and when did capability return? | Recovery quality or speed is insufficient |
| Cumulative burden | What total harm accrued? | Unmet demand or cost exceeds limit |
| Terminal state | Where is the system now? | Target capability has not been established |

The facts share an incident identity but must not overwrite one another. Terminal evidence closes the lifecycle. Cumulative burden evaluates its cost. Containment evidence asks whether the most dangerous interval was controlled. One field cannot answer the other four propositions.

Coordination and trust policies should also bind to named phases. If a policy helps containment but delays full restoration, the team faces an explicit trade-off rather than the false global statement that it “improved resilience.”

## Proposal Authority and Environment-Mutation Authority Must Stay Separate

A multi-agent system must also identify who can change the world being measured. Local agents can observe, negotiate, and propose actions, but their output remains a proposal until it crosses feasibility, constraint, or ownership gates.

The study uses the simulator as a centralized authority. A real enterprise may distribute authority across firms, contracts, inventory systems, and physical facilities. The reusable lesson is not “always use a central simulator.” It is narrower: proposal, constraint validation, state commit, and observation certification need distinguishable ownership.

Otherwise, a system can report “the agent planned a transfer” as “the goods moved” and calculate recovery against a fictional environment state.

## Simple Indicators May Remain; Phase Facts Must Not Disappear

Operations teams need a quickly readable health indicator. That counterargument is valid. Aggregation is not the problem; erasing dimensions that the organization actually governs is.

An interface may show one status if the underlying phase evidence remains queryable and policy identifies dimensions that a terminal state cannot cancel. A system can be green now while retaining “containment objective failed” and “cumulative-loss limit exceeded.” An aggregate that averages away a severe policy breach has lost its governance meaning.

A team can begin with three rules: a recovery event cannot delete earlier phases; each phase has its own time and harm thresholds; every environment mutation records both the proposing actor and the authoritative committer.

## Evidence Boundary and Open Questions

The study does not establish universal resilience thresholds or prove that one trust level is generally optimal. Simulation topology, demand, behavior rules, and centralized feasibility authority shape its outcomes. Real environments add human, safety, financial, legal, and reputational consequences that should not be compressed casually into one opaque score.

Open questions include who certifies state across organizations; how conflicting authorities create an auditable fact; how policies should be compared when phase objectives compete; how technical service, financial loss, and legal exposure can be joined without losing identity; and what evidence is required before a simulation-derived pattern becomes production policy.

“Eventually recovered” remains important. It answers only the last question. A trustworthy resilience claim must preserve the trajectory to that endpoint and identify who had authority to change the world along the way.

**Evidence and source:**

- [Primary study of phase-specific supply-network resilience](https://link.springer.com/article/10.1007/s10479-026-07406-4)
