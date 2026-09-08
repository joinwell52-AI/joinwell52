---
title: "Role Match Is Not Team Fit"
date: '2026-09-08'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "当一个智能体被替换、故障转移或调入另一支团队时，怎样区分“能做这个角色”与“能适配这支团队已经形成的协作方式”？"
summary: "A controlled study reports that role-matched swaps preserve much task outcome while raising communication cost per unit of progress by roughly 16–63%, with coordination efficiency recovering later than task score. Reliable replacement needs separate evidence for role qualification, team fit, state scope, and recovery activation."
sources:
  - research/analysis/Q-20260908-02-replacement-coordination-admission.md
item_id: "Q-20260908-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-08-role-match-is-not-team-fit-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-08-role-match-is-not-team-fit-cover.png"
  kicker="Industry Architecture · Daily Research"
  title="Role Match Is Not Team Fit"
  summary="A controlled study reports that role-matched swaps preserve much task outcome while raising communication cost per unit of progress by roughly 16–63%, with coordination efficiency recovering later than task score. Reliable replacement needs separate evidence for role qualification, team fit, state scope, and recovery activation."
  version="Q-20260908-02"
  status="Daily Runtime V5 · 2026-09-08"
  languageHref="/zh/industry/2026-09-08-role-match-is-not-team-fit"
  languageLabel="中文"
/>

# Role Match Is Not Team Fit

A digital worker disappears, and the runtime immediately installs a backup with the same model, role, and tool permissions. The task still completes, so failover is marked successful.

The team may still be paying a hidden price. Members repeat conventions, coordination messages multiply, handoffs lengthen, and dependencies that once felt implicit must be rebuilt. The output has recovered; the team has not.

A controlled study captured by the same-date Research Object provides a direct counterexample to agent fungibility. **Role-matched agents are not automatically interchangeable.** In the reported settings, cross-team swaps preserve much task performance while increasing communication cost per unit of progress by roughly 16–63%. Task score also tends to recover before coordination efficiency.

The core proposition is: **role and capability qualification do not establish destination-team compatibility. Replacement activation requires separate evidence for coordination fit, carried-state scope, and recovery of both outcome and coordination efficiency.**

## The Same Role Can Still Arrive as an Outsider

A formal role describes only part of operational capability: who plans, who executes, and which tools are available. Long-running collaboration also creates relationship state that is not fully encoded in a role definition—how requests are abbreviated, when review is volunteered, who supplies context first, who converges after failure, and which messages assume shared history.

The controlled study holds the base model and formal role constant while swapping experienced agents between independently formed teams. That design removes an obvious explanation for disruption. The newcomer is not simply weaker or assigned the wrong job; its experience belongs to another coordination history.

Team capability is therefore not just the sum of member capabilities. Qualification answers whether an agent can do the job. Admission to a specific team asks whether it can perform within that team's current relationships and rhythms.

## The Task Survives While the Cost Changes

The study compares intact teams, placebo replacements, cross-team swaps, state-cleared swaps, amnesia, and naive entrants. It reports that role-matched swaps preserve much task outcome while raising communication cost per unit of progress by about 16–63%.

A monitor that observes only final output can miss this loss. The artifact appears, the answer is correct, or the business target is met, so recovery closes. Team members may have needed substantially more messaging, retries, waiting, and clarification to hold that outcome.

The source also reports stronger partner specificity with greater coordination coupling and longer shared formation history. Swapping the more coordination-central seat carries a larger penalty. Extra messages need not come from the newcomer; incumbents may communicate more because their expectations no longer match. The changed object is the relationship graph, not only one worker.

## Four Gates Decide Whether Replacement Becomes Active

A governed replacement can preserve four related but non-equivalent decisions.

| Gate | Question | Typical evidence |
|---|---|---|
| Role and capability admission | Can the entrant perform the formal function and use required tools? | Capability tests, permission scope, role contract |
| Team coordination admission | Does it fit the destination team's current conventions and dependencies? | Team version, coordination probes, handoff rehearsal |
| State-scope admission | Which knowledge transfers, and which relationship state must be cleared or quarantined? | State origin, subject, team, and seat scope |
| Recovery and activation admission | Have outcome and coordination both stabilized enough to activate the entrant? | Quality, message cost, latency, retries, observation window |

One implementation may perform all checks in a single function. Its evidence should not collapse into “replacement passed.” Without separate identities, later diagnosis cannot distinguish inadequate capability, stale team assumptions, wrongly inherited relationship state, or an observation window closed too early.

The destination team also needs an identity or version boundary. Evidence collected before a material change in membership, leadership, protocol, or division of work may already be stale.

## Handoff Is Not Copy as Much State as Possible

Replacement is often framed as maximizing context transfer. The study exposes the opposite risk: experience from the donor team may encode expectations about old partners, and copying it into the destination team can turn an old relationship into a false present fact.

A useful handoff packet distinguishes at least:

- task or domain knowledge that remains valid independent of teammates;
- current destination-team conventions, interfaces, and handoff expectations;
- donor-team relationship state that applies only to particular partners or seats.

The third category must not silently become authoritative. It may be cleared, quarantined, relabeled, or re-admitted after destination-team testing. The goal is not minimum inheritance; it is explicit scope for every inherited state.

State-clearing conditions in the study reduce some stale-relationship effects, but they do not establish that all coordination knowledge lives in explicit notes. Production systems may distribute convention across messages, prompts, caches, tool habits, and incumbent expectations. Scope review therefore includes the relationship, not only the incoming agent's memory.

## Restoring Output and Restoring the Team Are Different Events

The reported recovery curves diverge. Task score moves toward baseline sooner, while coordination efficiency recovers more slowly. In higher-coupling conditions, output has substantially recovered while communication cost per progress remains elevated.

This suggests a stronger failover state model. A runtime may first record “service outcome restored” and continue under bounded conditions. “Team operation restored” remains open until message volume, latency, retries, human intervention, or other agreed process measures stabilize.

Seats need not share one threshold. Coordination-central workers, critical handoff owners, or principals with broader authority may require stricter fit evidence and a longer observation window. The study does not supply universal thresholds. It shows why a role label cannot replace the decision.

## One Policy Can Implement the Checks; Evidence Still Needs Separate Accounts

A production system may train one replacement policy that jointly considers output quality and communication cost. That is a legitimate implementation choice. Audit semantics still need separation.

When performance degrades, an owner must know whether capability admission was wrong, the team version was stale, state scope was too broad, or recovery closed too early. Compressing all evidence into one score simplifies the interface while destroying the information needed for recovery and improvement.

In a critical incident, an organization may explicitly accept temporary coordination cost to restore essential service quickly. The important step is to record that acceptance with an owner and time boundary, rather than infer that the cost does not exist because the final task completed.

## Evidence Boundary and Open Questions

The study uses dyadic teams and benchmark tasks, with short formation histories and explicit partner notes that may amplify some effects. Its communication-cost measure is not directly equivalent to enterprise token spend, business latency, human interruption, or risk. It does not test credential transfer, authority transfer, external side effects, or crash-time failover.

Open questions include how to derive a destination-team version from live trajectories; how to measure fit in teams larger than two; which relationship memories should survive emergency replacement; how long compatibility evidence remains fresh; whether central seats need independent admission criteria; and how to distinguish temporary assimilation from persistent mismatch.

Until broader evidence exists, the safest default is: **replacing a role can be fast; admitting a teammate cannot rely on role matching alone.**

**Evidence and source:**

- [Primary study of agent interchangeability](https://arxiv.org/html/2609.05279v1)
