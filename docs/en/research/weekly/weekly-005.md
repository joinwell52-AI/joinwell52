---
title: Weekly 005 — Every Handoff Needs a Receipt
date: '2026-08-16'
column: digital-employee
category: weekly
article_type: research-brief
edition: research-center
research_question: 'What control invariant recurs when durable agent work crosses from one owner, policy, runtime state, or external system to another?'
summary: 'Twenty-one evidence-validated Daily Research notes converge on a new judgment: continuity, identity, authorization, execution, and external effects are different facts. Reliable agent systems need evidence-bearing handoff contracts at the boundaries between them.'
sources:
  - 2026-08-10 through 2026-08-16 Daily Runtime V5 publications
  - research/intelligence/p2-runs/2026/08/2026-08-16-p2-special.json
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
cover: '/assets/covers/weekly-005-cover-v2.png'
---

<ArticleCover
  image="/assets/covers/weekly-005-cover-v2.png"
  kicker="Weekly Research · 005"
  title="Every Handoff Needs a Receipt"
  summary="Identity, authority, execution, and effects must cross system boundaries as separate, evidence-bearing facts."
  version="W005"
  status="Published 2026-08-16"
  languageHref="/zh/research/weekly/weekly-005"
  languageLabel="简体中文"
/>

# Weekly 005 — Every Handoff Needs a Receipt

Last week’s synthesis argued that authority is a lifecycle rather than a static setting. This week’s evidence narrows that idea to the place where failures repeatedly become ambiguous: **the handoff**.

Across seven completed Daily Runtime days, 21 published research notes examined human approval, ordered work queues, connector actions, durable event identity, acceptance and persistence, policy amendments, asynchronous callbacks, resume capability reconstruction, remote session rebinding, bounded extension points, durable work identity, KPI decision rights, cancellation rollback, resumable trust gates, delegated-agent return contracts, background-tool ownership, occurrence-scoped authorization, pre-materialization reservation, and configuration precedence.

The mechanisms differ. The failure pattern does not.

> **A fact that survives one boundary is often mistaken for a stronger fact on the other side.**

A stored decision is mistaken for current authorization. A reserved ID is mistaken for an existing object. A reconnected session is mistaken for continued execution. A local cancellation is mistaken for external-effect closure. A deterministic configuration winner is mistaken for an authorized value. A provider submission is mistaken for a confirmed business outcome.

The weekly judgment is therefore:

> **Reliable agent systems need evidence-bearing handoff contracts. Every transfer of work, authority, identity, state, or effects must record what crossed the boundary, who owned it before and after, under which policy, and which downstream fact actually became true.**

## Evidence scope

The synthesis uses only the evidence-validated Daily Research released from **2026-08-10 through 2026-08-16**. All seven Daily Runtime records reached `publication = Completed`, yielding **21 eligible notes** across the three formal columns.

| Date | Digital Employee | Industry Architecture | Open-source Engineering |
|---|---|---|---|
| Aug 10 | Governed input admission | Authoritative-state cascade containment | Serialized tool lifecycle authority |
| Aug 11 | Ordered execution authority | Governed connector action handoff | Durable event identity and terminal evidence |
| Aug 12 | Acceptance vs. persistence | Consent and effective policy | Scoped callback concurrency |
| Aug 13 | Resume capability reconstruction | Session rebinding boundary | Bounded extension points |
| Aug 14 | Durable work identity vs. execution authority | KPI decision rights | Cancellation rollback vs. effects |
| Aug 15 | Resumable trust gates | Delegated-agent semantic return | Execution, routing, and effect ownership |
| Aug 16 | Occurrence-scoped authorization | Reservation vs. materialization | Configuration precedence and provenance |

This is a dense seven-day engineering sample, not evidence of market-wide adoption. The report identifies a repeated control problem across independently selected research objects; it does not claim that every agent platform implements the proposed abstraction.

The Weekly P2 lane also completed its first governed baseline across all six registered P2 objects. Because no prior P2 checkpoints existed, the run established comparison baselines rather than manufacturing change deltas; no P2 Special Study was triggered.

## The recurring mistake: continuity is promoted into authority

Long-running agent systems need continuity. They preserve work IDs, checkpoints, pending approvals, sessions, callbacks, configuration, and provider-side state so work can survive interruption.

The evidence this week shows why continuity is necessary but dangerous when its semantic strength is not bounded.

### State continuity is not authority continuity

The Digital Employee notes repeatedly separate a durable fact from permission to act on it.

A late human response can be durably attached to an exact pending occurrence, but that persistence does not prove who was authorized to approve it or whether a later external tool effect happened exactly once. A queued work item can remain present, but being scheduled or received does not grant execution authority. Persisted protocol state can survive restart, yet topology-derived or policy-derived capabilities may need reconstruction before execution resumes. A work identity can remain stable while dispatch admission or resumption authorization changes.

The common boundary is:

```text
historical fact
≠ admitted state
≠ current execution authority
```

### Logical continuity is not execution continuity

The Industry Architecture notes expose the same split across systems.

A connector can observe availability without being authorized to act. An authorization can exist without evidence that a provider accepted the request. A provider can accept a request without establishing the final system-of-record outcome. A remote session can be rebound and become usable again without proving interrupted work migrated or continued. A reserved thread or object ID can provide stable correlation before materialization without proving the remote object exists.

A useful sequence is:

```text
intent
→ eligibility
→ authorization
→ submission
→ materialization / execution
→ confirmed outcome
→ custody
```

Collapsing any two adjacent steps makes recovery and audit ambiguous.

### Local finality is not external-effect finality

Open-source Engineering adds the most operational version of the problem.

A serialized lifecycle lock can make local connector transitions deterministic while external effects still need separate idempotency. Scoped cancellation can restore local request state while provider-side effects continue. Retiring a registry entry can revoke routing ownership without proving the worker stopped. Deduplication keys can reduce duplicate processing without proving end-to-end exactly-once delivery. Configuration precedence can deterministically choose a value without proving the value was authorized or where it came from.

This is the practical boundary:

```text
local state settled
≠ remote work settled
≠ external effect settled
```

## A new abstraction: the Evidence-Bearing Handoff Contract

The week’s 21 notes support a reusable architecture abstraction: an **Evidence-Bearing Handoff Contract**.

It is not a new transport protocol. It is a control model for transitions where one component can no longer safely infer another component’s state.

```text
1. Occurrence / Work Identity
        ↓
2. Intent and Eligibility
        ↓
3. Authority Decision
        ↓
4. Claim and Ownership Epoch
        ↓
5. Materialization / Actual Execution
        ↓
6. Effect Evidence
        ↓
7. Semantic Terminal Result
        ↓
8. Custody / Acceptance / Reconciliation
```

Each arrow is a handoff. Each handoff needs evidence strong enough for the next owner to know what it may assume—and what it may not.

### 1. Identity must name the exact occurrence

Durable identifiers are most useful when they identify one concrete occurrence rather than a broad class of work.

This week’s approval and event-identity research points in the same direction: a sticky policy for “this tool” and a decision for “this exact call” are different facts. A task name and a delegated occurrence are different facts. A session and a generation of that session are different facts.

The handoff contract should preserve an occurrence identity before asynchronous delivery, retry, pause, or delegation can create ambiguity.

### 2. Authority needs its own evidence

Identity proves what is being discussed, not whether it may execute.

An authority decision should identify the decision source, applicable policy version, principal or role when available, scope, expiry or occurrence boundary, and any conditions that must be revalidated. Human confirmation text alone is not proof of confirmer authority. A configuration value winning precedence is not proof that the value is permitted.

### 3. Ownership must be explicit and epoch-scoped

Handoffs create periods when an old and a new owner can both appear plausible.

Session rebinding, worker replacement, tool lifecycle restart, background-task routing, and callback cleanup all benefit from an ownership epoch or generation. The old owner needs to be fenced from claiming fresh authority once the new owner takes over.

This does not solve external idempotency, but it makes local ownership reconstructible.

### 4. Materialization needs evidence separate from reservation

Pre-allocation is useful. It lets a host correlate work before a remote system returns the final object.

But a reservation is only a promise about identity space. The handoff contract should separately record whether materialization occurred, which remote identity became authoritative, and whether an abandoned reservation needs cleanup or reconciliation.

### 5. Effects need their own settlement model

The most consequential handoff is from agent/runtime state into the external world.

After a tool call, payment, booking, deployment, message send, file mutation, or other side effect, retry safety cannot be inferred from local rollback. The runtime needs effect evidence: an external idempotency key, provider receipt, state readback, compensation record, or explicit unresolved status.

Exactly-once should be stated only when the entire effect path supports it. Local locks and deduplication are not enough.

### 6. Terminal results need semantic meaning

Transport completion is not business completion.

A delegated agent returning a closed stream, a callback ending, or a provider request finishing does not tell the caller whether the intended task succeeded. A semantic return contract should distinguish successful completion, rejection, cancellation, partial completion, ambiguous outcome, and recoverable failure.

The caller should not have to infer business meaning from transport state.

## Why receipts matter more than traces at handoff boundaries

A trace is excellent for reconstructing a path. It may show that component A called component B, which called provider C.

A handoff receipt answers a different question: **what right or fact did the next owner receive?**

A useful receipt may include:

```text
occurrence_id
from_owner
to_owner
policy_version
authority_scope
claim_epoch
materialized_identity
effect_reference
terminal_semantics
provenance
```

Not every transition needs every field. The invariant is that the receiver should not silently promote a weaker upstream fact into a stronger downstream assumption.

This is where the week extends last week’s Authority Lifecycle Control Plane. Last week established that authority changes over time. This week shows the implementation pressure point: **authority becomes unreliable when transitions cross ownership boundaries without typed evidence.**

## Contradictions the handoff model does not eliminate

### Stronger evidence versus higher latency

Revalidating policy, reading back external effects, and waiting for provider-confirmed outcomes can increase latency.

The answer cannot be “verify everything synchronously.” Systems need explicit rules for which evidence may be cached, which operations can proceed optimistically, and which consequential transitions require fresh confirmation.

### Stable identity versus abandoned state

Pre-reserved identities help correlation and retry, but they can accumulate abandoned objects or stale intent.

Stable identity therefore needs abandonment and reconciliation semantics, not only creation semantics.

### Concurrency versus ownership clarity

Global serialization simplifies correctness but destroys useful parallelism. Pure concurrency maximizes throughput but makes ownership ambiguous.

The better target is scoped ownership: independent sessions or occurrences can run concurrently while each occurrence has one authoritative transition owner at a time.

### Durable approval versus revocable policy

Persisting an exact approval enables resume. Policy may change before resume.

The system needs to distinguish the historical decision from whether current policy still admits that decision. Durability should preserve provenance, not freeze authority forever.

### Local cancellation versus irreversible effects

Cancellation can reliably stop local waiting and still arrive too late to stop a remote side effect.

A complete cancellation contract therefore needs effect settlement and compensation boundaries. “Cancelled” without that evidence is often only a local statement.

## Predictions

These are Research Center interpretations from the repeated mechanisms, not claims made by the underlying Daily sources.

1. **Occurrence-scoped authorization will become more common.** Broad defaults will remain useful, but consequential exceptions will increasingly bind to exact tool calls, delegated tasks, reservations, or execution epochs.
2. **Agent runtimes will expose ownership epochs.** Session generation, worker lease, callback scope, and routing generation will converge on explicit fencing semantics.
3. **Reservation and materialization will separate in APIs.** Systems that create work asynchronously will expose pre-materialization IDs without pretending those IDs prove remote existence.
4. **Cancellation will gain effect-settlement states.** Runtimes will distinguish locally cancelled, provider cancellation requested, provider cancellation confirmed, effect observed, and compensation required.
5. **Configuration systems will expose provenance graphs.** Knowing which value won will be insufficient for security-sensitive settings; systems will need to show the source layer, authority, and override chain.
6. **Audit surfaces will shift from event logs toward handoff receipts.** The important question will be less “what calls happened?” and more “what fact and authority crossed each boundary?”

## Open questions

- What is the minimal interoperable handoff receipt that remains useful across agents, tools, connectors, and remote providers?
- Which handoff evidence must be durable, and which can remain transient telemetry?
- How should an old owner be fenced when a session, worker, or routing identity is rebound?
- When can a persisted approval be reused, and which policy changes force re-admission?
- How should a runtime represent an effect whose provider outcome remains ambiguous after timeout?
- Can reservation cleanup be made deterministic without turning pre-materialization coordination into a distributed transaction?
- How much provenance should be exposed for security-sensitive configuration without overwhelming operators?
- Which terminal states should be standardized across delegated-agent protocols, and which must remain task-specific?

## Next-week research priorities

The evidence suggests three useful tests rather than a larger conceptual vocabulary.

**First, model one exact handoff end to end.** Choose a consequential tool occurrence and record identity, authorization, claim, provider submission, effect evidence, semantic result, and final custody as separate facts. The goal is to find where current systems still infer one state from another.

**Second, test recovery under ownership replacement.** Interrupt a worker or remote session, rebind a new owner, then inject a late result from the old owner. The acceptance criterion is not merely correct final output; it is proof that stale authority was fenced and any external effect remained reconcilable.

**Third, test cancellation after effect uncertainty.** Cancel after provider submission but before confirmation. The runtime should represent uncertainty honestly rather than converting timeout into a clean cancellation claim.

The emerging direction is precise: durable agent systems do not need one magical global status. They need boundaries that refuse to blur different truths.

A request can exist without authority. Authority can exist without execution. Execution can occur without a confirmed external effect. A remote effect can occur without local knowledge. A stable identity can survive all of these transitions without making any of them equivalent.

**Every handoff needs a receipt because every handoff is where one fact is most likely to be mistaken for another.**
