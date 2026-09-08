---
date: "2026-09-08"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260908-02
column: industry-architecture
article_type: technical-analysis
project_relevance: none
source_reading: "research/reading/Q-20260908-02-agent-replacement-coordination-compatibility.md"
---

# Research Analysis — A Replacement Agent Needs Team Re-admission, Not Just Role Qualification

## Research question

When an agent is replaced, failed over or moved into another team, what evidence is required to distinguish “can perform the role” from “can operate compatibly inside this destination team's learned coordination system”?

## Why the role label is an incomplete identity

The same-date controlled study holds the base model and formal role constant while swapping agents between independently formed teams. That design removes a common explanation for poor replacement behavior: the newcomer is not simply a weaker model or an agent with the wrong formal job. It is an experienced agent whose experience belongs to another coordination history.

The source compares Intact, Placebo, Swap, Swap-cleared, Amnesia and Naive conditions. It therefore supplies designed evidence about replacement disruption, partner-specific state and recovery rather than only observational anecdotes. The reported findings remain `source-reported-claim` evidence from one primary study; the admission architecture below is `our-interpretation` and should not be read as a universal enterprise replacement standard.

The research subject is a **governance-problem + architecture-mechanism + cross-sample-comparison** around worker fungibility, handoff scope and recovery truth.

## Functional compatibility and coordination compatibility separate

Role-matched swaps preserve much of the task outcome while communication cost per unit of progress increases by roughly 16–63% across reported settings. This creates a direct counterexample to a simple staffing rule such as:

```text
same model + same role + same tools = interchangeable worker
```

The stronger bounded statement is:

```text
role/capability compatibility != destination-team coordination compatibility
```

The study also shows that the two recovery curves can diverge. Task score returns close to baseline earlier than coordination efficiency; in the reported high-coupling condition, communication cost remains elevated after task score has substantially recovered. A health gate that closes replacement recovery when “the work still completes” therefore observes only one dimension of recovery.

## Replacement authority should bind to a destination-team version

A replacement decision can be decomposed into four admission questions:

1. **Role/capability admission** — can the incoming agent perform the nominal function and use the required tools?
2. **Coordination admission** — is it compatible with the destination team's current conventions, dependencies and expected handoffs?
3. **State-scope admission** — which carried state is task-valid, which is relationship-specific, and which donor-team state must be cleared, quarantined or relabeled?
4. **Recovery/activation admission** — after the swap, have both outcome and coordination metrics stabilized sufficiently for the newcomer to become the authoritative active worker?

The destination team itself needs an identity or freshness boundary. Compatibility evidence collected before a substantial change in membership, leadership, protocol or formation history can become stale even if the incoming agent has not changed.

## Evidence claims

### E1 — source-reported-claim

**Claim:** Role-matched swaps in the controlled study preserve much task performance while increasing communication cost per unit of progress by approximately 16–63%.

**Source:** https://arxiv.org/html/2609.05279v1, as fully captured in the same-date Reading Note.

**Strength:** reports. **Independent:** false.

### E2 — source-reported-claim

**Claim:** Partner specificity rises with coordination coupling and with longer team formation history in the reported ablations, showing that accumulated coordination conventions can increase non-fungibility.

**Source:** same primary study.

**Strength:** reports. **Independent:** false.

### E3 — source-reported-claim

**Claim:** Replacing the more coordination-central seat produces a larger reported penalty, and many extra coordination messages can be emitted by the incumbent rather than by the swapped agent.

**Source:** same primary study.

**Strength:** reports. **Independent:** false.

### E4 — source-reported-claim

**Claim:** Task outcome recovers earlier than coordination efficiency after replacement in the reported settings.

**Source:** same primary study.

**Strength:** reports. **Independent:** false.

### E5 — our-observation

**Claim:** Replacement failure can manifest as a relationship mismatch rather than an individual-worker defect; therefore attribution to the newcomer alone is incomplete.

**Source:** comparison of swap, amnesia, seat-centrality and recovery evidence.

**Strength:** observed. **Independent:** false.

### E6 — our-interpretation

**Claim:** Governed failover should bind activation to destination-team compatibility and a probationary recovery window, while relationship-specific state is re-admitted rather than blindly inherited.

**Source:** bounded synthesis from E1–E5.

**Strength:** supports. **Independent:** false.

## Handoff needs scoped state, not maximal state

The study's notebook conditions make an important negative point: more inherited memory is not automatically safer. An experienced outsider can bring partner expectations learned in the donor team, while the destination team has learned different conventions. Clearing some relationship-specific state can therefore reduce stale-context effects, although the experiment does not prove that all coordination knowledge is localized in the explicit notes.

A practical handoff package should separate at least:

- task/domain knowledge that remains valid independent of teammate identity;
- destination-team conventions and current protocol expectations;
- donor-team relationship state that must not silently become authoritative in the new team;
- the team/version/seat identity under which each convention was observed;
- post-swap evidence about both task outcome and coordination cost.

This makes state inheritance a scoped decision rather than a bulk copy operation.

## Bounded research judgment

**A role-qualified replacement is not yet a team-qualified replacement.** In long-lived multi-agent organizations, activation should require evidence about the exact destination team's coordination state, the centrality of the seat being replaced, the scope of inherited relationship state, and recovery across both task outcome and coordination efficiency.

The evidence is sufficient to reject role labels as proof of worker fungibility. It is not sufficient to prescribe one universal communication-cost threshold or one enterprise probation duration.

## Architectural implications

A governed multi-agent runtime should keep capability qualification and team assimilation as separate facts. Replacement records should name the outgoing principal, incoming principal, destination-team identity/version, role seat, carried-state scopes, cleared/quarantined scopes, admission evidence and recovery window. Monitoring should attribute coordination degradation to the changed relationship graph, not only to the replacement worker.

This also changes failover semantics: fast restoration of task completion can be a temporary recovery state, while full operational recovery remains open until coordination cost, retries, latency or other agreed process metrics stabilize.

## Limits and open questions

The study uses dyadic teams and benchmark tasks, not enterprise organizations. Formation histories are short, explicit partner-note headings may channel the effect, and benchmark communication cost is not equivalent to production latency, token spend, human interruption or business risk. The study does not test credential transfer, authority transfer, external side effects or crash-time failover.

Open questions include how to derive team-version identity from live execution traces; how to measure coordination compatibility in teams larger than two; which relationship-specific memories should survive an emergency failover; how long compatibility evidence remains fresh; and whether high-centrality seats require stricter replacement admission than ordinary workers.

## Editorial recommendation

- **Article type:** technical-analysis
- **Selected modules:** research-question; interchangeability-experiment; functional-vs-coordination-compatibility; scoped-handoff-state; recovery-criteria; architecture-implications; limitations; open-questions
- **Core proposition:** role qualification and destination-team qualification are separate admission gates
- **Project relevance:** none
