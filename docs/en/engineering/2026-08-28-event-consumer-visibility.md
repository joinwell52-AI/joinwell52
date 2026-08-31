---
title: "CodeFlowMu Engineering Record (III): An Event Happened — But Who Should See What? Designing a Safe Activity Projection Boundary"
date: '2026-08-28'
updated: '2026-08-31'
column: open-source-engineering
category: daily
article_type: comparative-technical-analysis
edition: research-center
research_question: "When internal Activity must retain complete facts, how should the Runtime ensure that ordinary consumers receive only contract-approved fields instead of inheriting the complete internal payload?"
summary: "Historical CodeFlowMu Activity data and a real query probe showed that complete internal payloads could cross an ordinary consumption boundary. V2.1.2 separates internal event storage from consumer projection and reconstructs ordinary Web Panel, Activity API and Analytics objects through server-side recursive allowlists. payload.raw, unknown fields and unknown nested values are hidden by default; independent QA observed the raw marker 0 times in the ordinary projection."
sources: "/en/research/evidence/2026-08-28-event-consumer-visibility"
project_relevance: substantive-relationship
item_id: "RBE-20260828-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-28-event-consumer-visibility-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-28-event-consumer-visibility-cover.png"
  kicker="CodeFlowMu Engineering Record · 03"
  title="An Event Happened — But Who Should See What? Designing a Safe Activity Projection Boundary"
  summary="Observability is not pass-through. Internal events may retain complete evidence, while ordinary consumers should receive only explicitly registered safe projections."
  version="RBE-20260828-02"
  status="Engineering Analysis · Revised 2026-08-31"
  languageHref="/zh/engineering/2026-08-28-event-consumer-visibility"
  languageLabel="中文"
/>

# CodeFlowMu Engineering Record (III): An Event Happened — But Who Should See What? Designing a Safe Activity Projection Boundary

An auditable Agent Runtime often cannot store only the small amount of information needed by a user interface.

Diagnostics may need original tool output, Host events, internal state and context. Failure analysis may require more facts than an ordinary panel should ever receive.

That immediately creates another boundary:

> **Are the facts the system must retain internally the same object that an ordinary consumer is entitled to receive?**

## What is CodeFlowMu, and why is Activity more than “logging”?

CodeFlowMu is a **local-first multi-agent collaboration and digital-employee runtime**. Agents with different responsibilities execute work continuously while the Runtime manages tasks, Sessions, tool calls, state transitions, recovery and audit evidence.

In such a system, Activity/Event data is not merely UI logging. It serves several roles at once: the Runtime needs to know what happened; EVAL and QA need evidence for review; diagnostics may need deeper Host or tool-native facts; Web Panel, ordinary APIs and Analytics need only the subset required for their own responsibilities.

CodeFlowMu therefore has to satisfy two requirements at the same time:

- **internal facts should remain sufficiently complete for recovery and audit;**
- **ordinary consumers should receive the minimum visibility required by their contract.**

That is the safe-projection boundary studied here.

If internal event objects and ordinary consumer objects are identical, observability easily turns into data pass-through. A new field entering an internal `payload` can unintentionally propagate through Activity API, Web Panel, Analytics or logging consumers.

Historical CodeFlowMu events contained raw payloads at scale, and a minimal first-party query probe later showed that a marker stored only in `payload.raw` could cross the ordinary Activity query boundary.

We do not describe that fact as proof of a data breach. Whether unauthorized access actually occurred depends on deployment, authentication, network reachability and access records. The narrower conclusion supported by first-party evidence is:

**the boundary between complete internal events and ordinary consumers lacked a structured, fail-closed field-projection contract.**

For historical data, probe results, version boundaries and public evidence, see [RBE-20260828-02](/en/research/evidence/2026-08-28-event-consumer-visibility).

## External research origin: a new event entering the bus should not automatically gain every old consumer

The external comparison is [OpenHands SDK PR #4689](https://github.com/OpenHands/software-agent-sdk/pull/4689), which addressed `StreamingDeltaEvent` being delivered by default to consumers that did not need it.

Different consumers shared one event bus, but their responsibilities differed: ordinary event subscriptions, auto-title generation, Webhooks, Telemetry and WebSocket clients did not need the same granularity. Token-level streaming deltas were genuinely needed by WebSocket consumers, yet generic subscription behavior caused other consumers to inherit the new event type automatically.

The PR reported this end-to-end contrast:

| Metric | Before | After |
| --- | ---: | ---: |
| HTTP POST | 41 | 1 |
| Webhook-delivered events | 201 | 3 |
| `StreamingDeltaEvent` among them | 198 | 0 |

The **41 → 1** result belongs to the OpenHands test, not to CodeFlowMu performance.

The broader lesson is a consumer-boundary principle:

**Adding an event capability to a shared bus should not automatically expand the visibility of every existing consumer.**

OpenHands addressed which consumers receive an event type. CodeFlowMu later encountered the adjacent question: even when a consumer is entitled to receive an Activity, **should it receive every field of that event?**

The former is an event-subscription boundary. The latter is a field-visibility boundary.

## Historical data: raw was common, but that alone does not prove current exposure

The CodeFlowMu historical profile covered 27 JSONL files and 20,440 parseable rows:

| Dataset | Rows | With `payload.raw` | Share |
| --- | ---: | ---: | ---: |
| Runtime | 2,743 | 1,474 | 53.7% |
| Analytics | 17,697 | 16,828 | 95.1% |
| Total | 20,440 | 18,302 | 89.5% |

These numbers are easy to overread.

They establish only that **raw payloads were common in historical artifacts spanning different implementation phases**.

They do not prove that a particular current V2.0.4, V2.1.1 or V2.1.2 query endpoint returns those fields, and they do not prove that an unauthorized user actually read them.

A later subset also provides an important counterexample: 681 Analytics rows from August 10 and 12 had `payload.raw=0`. Some paths had already improved, but that still did not establish a fail-closed field contract across all consumers.

Storage history answers “what did the system keep?”

To evaluate the consumer boundary, we needed a second question:

**What does an ordinary query actually return?**

## A marker that exists only in raw isolates the problem at the query boundary

To avoid inferring current behavior directly from historical files, the first-party experiment used a minimal query probe.

A unique marker was placed only inside `payload.raw`, then exercised through the real ActivityBuffer path:

`ActivityBuffer.push() → ActivityBuffer.query() → serialize → marker check`

On the tested V2.0.4 path, the serialized ordinary query still contained the marker. A pre-fix rerun on V2.1.1 baseline `36e5c83b` confirmed the same behavior.

That result is enough to establish one concrete fact:

**field minimization was not mechanically enforced at that ordinary query boundary.**

It still does not prove unauthorized access occurred.

The gap becomes clearer when responsibilities are separated into three layers:

- **producer**: creates a complete internal event;
- **internal storage**: decides which raw facts should be retained for diagnostics and audit;
- **consumer boundary**: decides which fields a given consumer should actually receive.

Retaining raw internally is not inherently wrong. The risk appears when the third layer has no independent contract and “visible internally” silently becomes “visible to ordinary consumers.”

## Engineering judgment: observability is not copying the same object everywhere

Many systems begin with Activity/Event as a debugging feature. The simplest implementation is to construct one complete object and return it to whoever asks.

As the system grows, that design creates hidden coupling:

1. Panel begins depending on one internal field;
2. Analytics reads another unregistered field;
3. a new Host adds nested payload structure;
4. a log center reuses the complete object for convenience;
5. nobody can safely remove raw because it is unclear which consumer has begun depending on it.

The event bus has effectively turned the Runtime's internal data structure into a public API.

V2.1.2 therefore adopts a more basic rule before attempting to classify every value as sensitive or non-sensitive:

> **The internal event is the fact object. The consumer receives a projection object. They are not the same data contract.**

This turns minimization from an ad hoc content filter into an architectural boundary.

## Why a blacklist is insufficient: future unknown fields do not register themselves

A common fix looks like this:

`copy(event.payload) → delete raw → delete secret → delete prompt`

It can work for fields known today.

But a blacklist has no knowledge of tomorrow's `payload.debug.original`, a new Host's `native_payload`, a new event type, or another nested layer of raw data. Unknown fields can cross the boundary until someone notices and adds another delete rule.

V2.1.2 therefore reverses the model and uses a **recursive allowlist**:

- for known events, reconstruct only registered fields;
- new top-level fields are absent until explicitly registered;
- new nested fields are absent until explicitly registered;
- unknown event types do not pass unknown payloads through and keep only the allowed public envelope;
- `payload.raw` is not part of ordinary consumer projection;
- each consumer gets a new projection object rather than a shared reference to a more privileged internal object.

This is fail-closed visibility semantics.

When the system does not know whether a new field belongs in an ordinary consumer contract, the default answer is not “send it first.” The default is “do not expose it until the contract explicitly expands.”

## V2.1.2: determine the consumer on the server, then reconstruct by contract

An allowlist only matters if the consumer identity is itself trustworthy.

If a client can simply send `?consumer=internal_debug` and upgrade itself to a privileged projection, field rules do not provide a meaningful boundary.

V2.1.2 therefore binds ordinary consumer policy at server entry points. The delivered scope covers Web Panel, Activity API and Analytics-style ordinary consumers. Analytics and log-center consumption follow the same safe-projection principle so that tightening one path does not leave a raw-object bypass through another.

The core flow is:

`internal Activity → server-bound consumer identity → event-type rule → recursive safe projection → consumer object`

| Consumer path | Preserve | Deny by default |
| --- | --- | --- |
| Web Panel | registered status, role, task, session, event and controlled summaries | `payload.raw`, unknown fields, unknown nested values |
| Activity API | approved envelope and event-specific payload projection | complete internal payload and unregistered extensions |
| Analytics / log consumption | registered structured fields needed for analysis and diagnosis | raw-object pass-through and data outside the consumer contract |

Approved relational fields such as task, thread, session, event and `projected_summary` remain available.

That matters: the goal of safe projection is not to make events empty. It is to retain the minimum structured facts a consumer needs to perform its job.

Raw internal events are not deleted. Explicitly authorized diagnostics can still use them through internal paths; ordinary API and analytics consumers receive projections.

That is how complete internal evidence and least-visible ordinary consumption can coexist.

![V2.1.2 server-side recursive projections for three ordinary consumers](/assets/figures/2026-08-28-event-consumer-projection.en.svg)

*Figure 1: V2.1.2 separates complete internal events from ordinary consumer projections. Unknown event payloads, unregistered fields and unknown nested values do not enter the result by default. Source: [RBE-20260828-02](/en/research/evidence/2026-08-28-event-consumer-visibility).*

## The first regression failed: minimization can also delete what the system genuinely needs

Safe projection does not mean “fewer fields is always better.”

After the first pruning implementation, the targeted Shell regression was **19 pass / 1 fail**. One semantic warning that the log center should have displayed dropped from 1 to 0.

The repair was not to restore raw. The first projection had removed a diagnostic state signal that was genuinely needed and could be safely derived.

The final projection explicitly derived and allowed only:

`ok / code / summary_blocked_reason / projection_status`

The targeted rerun reached **20/20** without restoring full summary/raw pass-through.

This failed intermediate result is valuable evidence because it blocks another overbroad claim:

**“The more fields you delete, the safer the system becomes.”**

If minimization prevents Panel or diagnostics from seeing a real failure signal, the system may expose less data while also becoming less diagnosable.

A mature projection contract has to test both directions: prohibited fields really do not leave the boundary, and the status, relation keys and warnings required by the consumer still survive.

## Safe projection is not a sensitive-content classifier

V2.1.2 establishes structural visibility boundaries. It is not a model that understands whether every possible string is semantically sensitive.

Recursive allowlisting ensures that unregistered fields, unknown nested values and raw do not automatically cross an ordinary boundary when internal objects evolve.

But if a producer writes inappropriate content into a string field that is already approved by the consumer contract, the projector does not magically infer that the string contains a secret.

Responsibilities remain separate:

- producers must obey content contracts;
- the projector enforces structural minimization and fail-closed handling of unknown fields;
- authentication/authorization decides who may call a consumer endpoint;
- network/deployment boundaries decide whether an endpoint is reachable;
- internal diagnostic authorization decides who may read complete raw events.

Those layers do not prove one another.

The engineering claim is therefore “ordinary consumers no longer inherit complete internal payloads by default,” not “the entire Runtime can never disclose information.”

## Independent QA: the raw marker must disappear while correlation facts remain

Independent QA B1 constructed a unique marker present only in raw and checked the ordinary projection.

| Check | Independent QA result |
| --- | --- |
| raw-marker occurrences in ordinary projection | **0** |
| `raw_present` | `false` |
| event count | 1 |
| event_type / task_id / session_id | preserved and matched input |
| `projected_summary` | controlled summary preserved |

The scenario validates both sides of the contract:

1. the prohibited raw marker did not cross the ordinary consumer boundary;
2. pruning did not destroy the necessary correlation facts.

Unknown events, new nested fields, per-consumer object isolation, server-side consumer selection and Analytics persistence also have targeted tests.

B1 still must not be expanded into a claim that real LAN/Gateway clients, every deployment mode and every future event have all received independent validation. It independently validates a critical boundary in the tested ordinary-projection contract.

## What this means for a digital-employee runtime

Activity visibility is not only a privacy concern. It directly affects whether an Agent Runtime can evolve safely.

If every consumer reads the complete internal object, any new Host, Tool or Agent field can accidentally change Panel rendering, Analytics counts, log volume, API schemas, downstream dependencies and information-exposure surface.

That makes internal implementation difficult to evolve because an internal field change can silently become a public-interface change.

Safe projection also provides **decoupling**.

Internal events can gain richer diagnostic facts while ordinary consumers receive new fields only after explicit registration. “The Runtime knows more” no longer automatically means “every downstream consumer receives more.”

For a long-running digital-employee system that continually adds Hosts, Tools and Agents, that default non-propagation matters.

Mature observability is not “everything is visible everywhere.” It is:

**each consumer can see the facts required for its responsibility, and cannot see internal state for which it has no contract basis.**

## From engineering patch to formal version

CodeFlowMu V2.1.2 completed the private mother Runtime/Shell release on 2026-08-30. Activity safe projection shipped together with persistent task idempotency and Session identity verification as one Runtime boundary-safety patch.

Public articles do not send readers to inaccessible private CodeFlowMu repository links. Publicly reviewable version facts, sanitized B1 results, compatibility and residual risks are available in the [public evidence pack](/en/research/evidence/2026-08-28-event-consumer-visibility) and the [V2.1.2 Public Release Summary](/en/research/evidence/2026-08-30-codeflowmu-v2.1.2-public-release-summary).

Final release validation recorded:

- Runtime: **1842 pass / 0 fail / 1 skip**;
- Shell: **1037 pass / 0 fail / 0 skip**;
- V2.1.1 and V2.1.2 same-protocol critical matrices, ten consecutive rounds each: Runtime **1630/1630**, Shell **550/550**;
- typecheck, Shell build, installer contract, rules and version consistency passed.

R1/R2 failure evidence remains preserved rather than overwritten by the final R3 pass, including lockfile issues, the independent Open Edition build boundary and the over-pruning regression described above.

The release does not include an independent Open Dev Team Edition and does not pretend that real browser profiles, LAN/Gateway deployments or user production projects were covered by the fixtures. The Windows symlink-permission skip and existing dependency warnings remain explicit.

## A review checklist for other Agent Runtimes

When reviewing Event / Activity consumer boundaries, ask:

1. Are internal storage objects and ordinary consumer objects the same structure?
2. Is consumer identity bound by the server, or can a caller self-assert a more privileged consumer?
3. Is projection recursive allowlisting, or full-object copy followed by a short denylist?
4. Are new event types and nested fields hidden by default until registered?
5. Are raw tool output and Host-private structures restricted to explicitly authorized diagnostic paths?
6. Are necessary task/thread/session/event correlation facts still preserved?
7. Do Analytics, logging, Panel and API follow the same safe-projection principle, or do bypasses remain?
8. Does each consumer receive an independent object rather than a shared reference to a privileged internal object?
9. Does QA test both “prohibited field count = 0” and “required fields still exist”?
10. Are internal-data existence, ordinary-interface visibility and real unauthorized access kept as three distinct claims?

These questions tell us much more than simply asking whether `raw` was deleted.

## Engineering conclusion

The OpenHands case showed one consumer principle: **a new event type should not automatically inherit every old subscriber.**

CodeFlowMu's first-party experiment exposed the adjacent field-level problem: **even when a consumer is entitled to receive an event, it should not automatically inherit every internal field of that event.**

V2.1.2 turns that principle into a Runtime contract:

**internal events preserve facts; the server determines consumer identity; recursive allowlists produce safe projections; unknown fields fail closed; raw events remain only behind authorized diagnostic boundaries.**

This does not weaken observability. It upgrades observability from “copy internal state” to “expose evidence by responsibility.”

The event happened — that is one fact.

Who should be allowed to see which parts of it is another fact that must be designed and validated independently.

## Evidence scope and primary sources

- [Historical data, old query probe, V2.1.2 engineering update and public release evidence](/en/research/evidence/2026-08-28-event-consumer-visibility): historical JSON fixture, Reader and check validate frozen material; the public page also maps sanitized implementation facts, B1 independent QA, release gates and residual risks.
- [OpenHands SDK PR #4689](https://github.com/OpenHands/software-agent-sdk/pull/4689): provides the external consumer-subscription case with 41 → 1 POSTs; it is not evidence for CodeFlowMu's field-projection implementation or acceptance.
- CodeFlowMu V2.1.2 implementation, independent-QA and raw release logs remain in the restricted private mother repository; this public article does not expose inaccessible private links as reader-facing evidence.
- The existence of complete internal data does not prove unauthorized access occurred. This article does not claim that the entire Runtime has eliminated all information risk or that real-network deployments, future unknown consumers or independent Open Edition were included in this validation.
