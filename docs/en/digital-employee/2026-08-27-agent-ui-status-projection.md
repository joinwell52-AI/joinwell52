---
title: "What Does a Green Agent Status Actually Mean?"
date: '2026-08-27'
column: digital-employee
category: daily
article_type: comparative-technical-analysis
edition: research-center
research_question: "Can viewer identity, gateway connectivity, session liveness, execution progress, report arrival, and lifecycle position be represented by one UI status?"
summary: "A Sutando collaborator-progress bug and a local projection audit show why an agent console must not use one green state as a substitute for distinct sources of truth."
sources: "/zh/research/evidence/2026-08-27-runtime-semantics-evidence-pack"
project_relevance: first-party-research
item_id: "RSEM-20260827-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-27-agent-ui-status-projection-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-27-agent-ui-status-projection-cover.png"
  kicker="Digital Employee · Engineering Research"
  title="What Does a Green Agent Status Actually Mean?"
  summary="A Sutando collaborator-progress bug and a local projection audit show why an agent console must not use one green state as a substitute for distinct sources of truth."
  version="RSEM-20260827-03"
  status="Engineering Research · 2026-08-27"
  languageHref="/zh/digital-employee/2026-08-27-agent-ui-status-projection"
  languageLabel="中文"
/>

# What Does a Green Agent Status Actually Mean?

A collaborator was doing real work in a live session and updating the system’s progress file. The team still saw no progress at all.

This is the concrete bug described in Sutando’s open [PR #3432](https://github.com/sonichi/sutando/pull/3432). The old `should_stream_task()` gate returned true only for an owner. Its rationale sounded sensible: ordinary non-owner team work runs in a read-only sandbox, does not update `core-status.json`, and therefore has no live step to stream. But collaborators were an explicit exception. They ran with normal capabilities and did write the status file. The UI substituted “not an owner” for “has no live work,” and hid a real execution.

The proposed change is tellingly small. `team + collaborator` changes from false to true; a regular team task remains false; an owner remains true. Four regression cases cover that distinction. The author also says a real bridge restart and end-to-end witness still need to happen, so the PR remains an open proposal rather than a completed production claim.

The larger question applies well beyond this one bug: **what fact does a green status actually represent?**

## A single status is often asked to answer six questions

| UI phrase | The question it should answer | A misleading substitute |
| --- | --- | --- |
| Gateway online | Can this browser or phone reach the local runtime? | An agent is actively working |
| Session live | Does this attempt have fresh, verifiable activity? | The task will deliver |
| Progress visible | Has the runtime received interpretable progress? | The work is correct or complete |
| Completed, awaiting report | The execution ended but a formal report has not arrived | Delivery has been accepted |
| In review / done | Where is the task in its formal lifecycle? | Every related record belongs to it |
| Visible to this user | Is this user allowed to read it? | Where or whether it executes |

Any two of these can be true independently. A connected gateway can show a stale job. A live session can lack fine-grained progress. A completed session can still be waiting for its report. A task can be done while an audit record remains in conflict. A viewer’s role determines visibility; it should not be used as a proxy for execution placement.

![Figure 1: How five runtime facts project into UI status](/assets/figures/2026-08-27-agent-ui-status-projection-figure-1.svg)

*Figure 1. Connection, execution, progress, report arrival, and technical error come from distinct facts. A page can show each separately; it should not translate any green light into “the task has been delivered.” Source: public candidate evidence pack R3.*

## Our question was narrower than “do we have the same bug?”

CodeFlowMu is the local multi-agent collaboration system we are developing. Sutando’s PR does not establish the same defect in CodeFlowMu, and our review did not find a local case of a live collaborator hidden merely for being a non-owner.

Instead of declaring victory, we audited the read paths we could substantiate. The panel’s session observer already distinguishes five outputs:

```text
executing_with_progress
executing_without_fine_progress
session_without_live_execution
completed_waiting_report
technical_error
```

The names matter less than the separation. A live session without fine-grained progress is not a failure. A completed session waiting for a report is not accepted delivery. A technical error is a technical diagnosis, not automatically a business failure.

We ran one existing pure classification fixture for these five cases. It passed **1/1** in the current worktree. That establishes only that this narrow classifier was executed against its fixture; the worktree contained existing uncommitted changes, so this is not a V2.0.2 release regression and not certification of every desktop, mobile, or permission path.

It is still a useful baseline: liveness, progress, report arrival, and technical error can be separated before the UI turns them into language and colour.

## When sources disagree, a clean page is not the goal

Projection failures are not limited to hiding work. A different failure occurs when several sources disagree and the page silently chooses the nicest one.

In the CodeFlowMu paths examined so far, a missing or conflicting canonical workflow becomes `projection_conflict`; the task list does not infer lifecycle from runtime, reports, or acceptance. The mobile gateway compares runtime, disk configuration, and context identity; if identities disagree, it refuses to publish an online state. Existing fixtures also preserve a useful combination: formal workflow can remain `done` while an evidence conflict stays visible on a separate axis.

That is intentionally less magical. Lifecycle answers the lifecycle question. Evidence answers the evidence question. Letting either overwrite the other destroys the trail a human needs to investigate.

## Give every green light a definition card

The practical design rule is not “add more statuses.” It is to require every UI status to state four things:

| Required declaration | Example |
| --- | --- |
| Source | Gateway online comes from aligned runtime, disk, and context identity—not from a report. |
| What it establishes | The current connection path is available. |
| What it does not establish | No claim about a session heartbeat or delivery acceptance. |
| Conflict behaviour | Show conflict or unknown; do not fall back to green. |

Then turn those declarations into combinations that can fail in tests:

- A non-owner viewer has permission to read and a fresh local session exists. Is progress still visible?
- The gateway is online but a managed job heartbeat is stale. Does the screen falsely say the task is running?
- Formal workflow is done but evidence association conflicts. Can both facts remain visible?
- Disk and runtime identity differ. Does a remote page continue presenting the old instance as current?

These tests do not require a new global state machine. They require each condition to keep its job: authority controls reading; role controls responsibility; sandbox controls capability; liveness controls observable activity; lifecycle controls formal location.

Good agent consoles should remain simple. Simplicity, however, is not achieved by turning several facts into a single reassuring signal. The Sutando case shows how a correct rule can hide real work when applied to the wrong condition. The local audit gives us a testable starting point, not a claim that every projection path is already correct.

The next time a console says “online” or “executing,” ask one question: online or executing according to which source, for which object, and over which time window? If the UI cannot answer, the green light is doing too much.

## Sources and limits

[Sutando #3432](https://github.com/sonichi/sutando/pull/3432) was open when checked on August 27, 2026. It supplies a public counterexample to using access tier as a proxy for execution placement; it does not prove a CodeFlowMu bug. The [public evidence pack](/zh/research/evidence/2026-08-27-runtime-semantics-evidence-pack) contains the five observation contracts and projection counterexample matrix. First-party evidence supports the described read-path baseline, not a complete audit of all UI, PWA, or authorization filters.
