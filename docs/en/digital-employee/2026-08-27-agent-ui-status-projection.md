---
title: "What Does a Green Agent Status Actually Mean? What Sutando's Missing Collaborator Progress Reveals About Agent UI Projection Boundaries"
date: '2026-08-27'
column: digital-employee
category: daily
article_type: comparative-technical-analysis
edition: research-center
research_question: "Can viewer identity, gateway connectivity, session liveness, execution progress, report arrival, and lifecycle position be represented by one UI status?"
summary: "Starting from Sutando's missing collaborator progress, this study treats agent UI status as a projection contract: every label should declare its source, subject, freshness, evidentiary scope, and conflict behavior."
sources: "/en/research/evidence/2026-08-27-runtime-semantics-evidence-pack"
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
  title="What Does a Green Agent Status Actually Mean? What Sutando's Missing Collaborator Progress Reveals About Agent UI Projection Boundaries"
  summary="Status is not a source of truth; it is a projection of underlying facts. A reliable agent console should say where each status comes from, what object and time window it covers, and what it explicitly cannot establish."
  version="RSEM-20260827-03"
  status="Engineering Research · 2026-08-27"
  languageHref="/zh/digital-employee/2026-08-27-agent-ui-status-projection"
  languageLabel="中文"
/>

# What Does a Green Agent Status Actually Mean? What Sutando's Missing Collaborator Progress Reveals About Agent UI Projection Boundaries

A collaborator was doing real work in a live session and updating the system's progress file. The team still saw no progress.

The network was not down. The agent had started. Progress data existed. The failure came from a seemingly reasonable predicate: the UI asked whether the actor was the owner, and non-owners were excluded from progress streaming.

That is the public counterexample described in Sutando's open [PR #3432](https://github.com/sonichi/sutando/pull/3432). The original `should_stream_task()` gate allowed only owners. Its rationale was not absurd: ordinary non-owner team tasks run in a read-only sandbox, do not update `core-status.json`, and therefore have no live step to stream. The defect was that collaborators were an explicit exception to that execution model. They ran with normal capabilities and did write status, yet the UI still treated "not owner" as equivalent to "no live execution."

The error was therefore deeper than a missing progress bar. It was a **fact substitution**:

> **role / access identity was used as a proxy for execution placement and live progress existence.**

The proposed fix is small. `team + collaborator` changes from false to true; an ordinary team task remains false; owner remains true. Four regression cases cover the distinction. The author also preserves an important limitation: a real post-restart bridge round trip has not yet been witnessed, so the PR remained open when this article was checked.

That small defect exposes a larger design question:

> **When an agent console says online, executing, progressing, or completed, what fact is each label actually asserting?**

## 1. UI status is not a source of truth; it is a projection contract

Agent consoles often compress several lower-level facts into a single `status`. Those facts come from different sources, refer to different objects, and expire on different time windows:

| Fact axis | The question it actually answers | What it cannot substitute for |
| --- | --- | --- |
| Viewer authority | May this user read the information? | Where the task is executing |
| Gateway connectivity | Can this browser or phone reach the current runtime? | Whether a session is still live |
| Session liveness | Does this attempt have fresh, verifiable activity? | Whether the task will deliver successfully |
| Progress | Has the runtime received interpretable recent work progress? | Whether the work is correct |
| REPORT arrival | Has execution produced a formal report artifact? | Whether the report has been accepted |
| Lifecycle | Is the task in inbox / active / review / done? | Whether every associated evidence record is conflict-free |

These axes can be true independently, and they can disagree.

A gateway can be online while a managed job heartbeat is stale. A session can be completed while its formal REPORT has not arrived. A workflow can be `done` while an audit association remains in conflict. A viewer can be authorized to see a task without being its executor.

A reliable UI should therefore be modeled as:

**underlying fact → explicit projection rule → user-facing status**

not:

**user-facing color → inferred system truth**

The first model requires the UI to explain its evidence. The second turns green into an unbounded conclusion with no clear provenance.

## 2. Why the Sutando case is more than a progress bug

The immediate issue in #3432 is missing collaborator progress. The more general defect is a mismatch between predicates:

```text
access tier / owner identity
        ↓ incorrectly substituted for
execution placement / existence of live progress
```

The original rationale was valid for ordinary team tasks but was extended to a collaborator class that did not share the same execution path.

This kind of projection defect is common because many facts are highly correlated on the happy path: the owner is often the executor; an online gateway often accompanies a live session; a completed session often produces a report quickly; review often follows evidence aggregation.

But correlation is not identity. The most valuable tests deliberately break those correlations:

- non-owner, but a fresh live session exists;
- gateway online, but the job heartbeat is stale;
- session completed, but the formal REPORT is still missing;
- workflow `done`, but an evidence association remains conflicted.

Projection tests should therefore contain **counterexample combinations**, not only normal-path snapshots.

## 3. Our local audit: five session observations must remain distinct before presentation

Sutando's PR does not prove that our system contains the same collaborator defect. The useful response is not to map the bug onto another product by analogy, but to inspect our own read paths for collapsed semantics.

In the session-observation path we audited, five mutually exclusive outputs are disclosed:

```text
executing_with_progress
executing_without_fine_progress
session_without_live_execution
completed_waiting_report
technical_error
```

The decision order matters:

1. session `failed` or recovery state `session_lost` → `technical_error`;
2. session `completed` while the formal REPORT is not yet written → `completed_waiting_report`;
3. a non-`running` session is not projected as active execution;
4. `running` without live evidence → `session_without_live_execution`;
5. `running + live` is then split by whether fine-grained progress exists.

That structure rejects several tempting upgrades:

- no fine-grained progress ≠ execution failure;
- existence of a session record ≠ live execution;
- session completed ≠ formally delivered;
- technical error ≠ business rejection.

One targeted first-party source test contains **five classification assertions**. The earlier shorthand "1/1" meant that one test case passed; it was a poor way to communicate the evidence because it could be mistaken for coverage of only one status. The more faithful statement is: **one targeted test case exercises five disclosed classifications.**

## 4. The public evidence can now be rerun rather than merely read

To move the central R3 claim out of private source code and prose-only description, we published three deidentified artifacts:

- [R3 five-case session-observation fixture](/assets/evidence/2026-08-27-r3-ui-status-projection-fixture.json)
- [R3 UI projection reader](/assets/evidence/2026-08-27-r3-ui-status-projection-reader.mjs)
- [R3 check script](/assets/evidence/2026-08-27-r3-ui-status-projection-check.mjs)

The fixture contains five inputs, one for each disclosed semantic class. The public reader reproduces the disclosed decision order. The check script compares `actual === expected` for all five records and verifies the per-class counts.

Run:

```text
node 2026-08-27-r3-ui-status-projection-check.mjs
```

Expected output:

```json
{"fixture":"deidentified_runtime_session_observation","assertions":5,"status":"PASS"}
```

The boundary matters: **the public reader is an independent reproducer of the disclosed contract, not the private production source. The five public assertions are not end-to-end certification of desktop UI, PWA, authorization filters, or the complete delivery path.**

What publication adds is inspectability. A reader no longer has to trust the statement that five states exist; the inputs and classification logic can be checked directly.

## 5. Conflict should be a first-class output, not noise the UI is required to eliminate

A second projection failure happens when sources disagree and the interface silently chooses the most reassuring answer.

We prefer the opposite rule: **source disagreement is itself a fact worth preserving.**

In the audited paths, for example:

- a missing or conflicting canonical workflow can produce `projection_conflict` rather than having lifecycle inferred from runtime, REPORT, or acceptance fields;
- a gateway is not published as online when runtime, disk configuration, and context identity disagree;
- a workflow can remain `done` while an evidence conflict remains visible on a separate axis.

The principle is simple:

> **certainty on one fact axis must not erase uncertainty on another.**

`done` answers the lifecycle question. `evidence conflict` answers the evidence-association question. Flattening the two into one status loses information whether the final color is green or red.

## 6. Every green status should declare at least five things

A status implemented as only color + text invites components to keep combining unrelated booleans. A stronger design treats each status as a small projection contract with at least these declarations:

| Declaration | Example |
| --- | --- |
| Source | `Gateway online` comes from aligned runtime / disk / context identity, not from a REPORT |
| Subject | Does the status describe a gateway, session, task, or report? |
| Freshness | Which time window or version makes the status valid? |
| Establishes / does not establish | Connection is available; no claim that a session is live or delivery accepted |
| Conflict policy | On source disagreement, return conflict / unknown rather than default green |

Once those declarations exist, "wrong color" bugs become testable semantic questions:

- the viewer is not owner, but has read authority and a fresh local session exists: is progress incorrectly hidden?
- gateway online + stale job heartbeat: can the screen show connection health and execution loss separately?
- session completed + REPORT missing: does the projection stop at waiting-report rather than completed-delivery?
- workflow `done` + evidence conflict: can both facts remain visible?
- runtime and disk instance identity differ: does the remote page keep presenting the stale instance as current?

These tests do not require a larger global state machine. They require one discipline: **each condition should answer only the question for which it has evidence.**

## 7. Green is not a conclusion; it is a bounded projection

Good agent consoles should be simple. Users should not need to read internal traces to understand the system at a glance.

But simplicity is not achieved by compressing six fact axes into one universal green state. Sutando's collaborator bug is a compact example of the danger: a rationale can be correct for one execution class and still hide real work when applied to the wrong object.

Our local evidence supports a bounded conclusion only: session liveness, progress, REPORT waiting, and technical error can be separated before presentation; conflict can remain visible as a distinct axis; and the disclosed classification contract can be tested and publicly reproduced. It does **not** support the stronger claim that every UI, PWA, and authorization combination is already correct.

So the useful question when a console says "online" or "executing" is not merely whether the status is green. It is:

> **Which source produced this status, what object does it describe, over what time window is it valid, what does it establish, and what is it explicitly not allowed to establish?**

If the interface cannot answer those questions, the status is exercising more authority than its evidence warrants.

---

## Public evidence

- [Runtime semantics three-article public evidence pack](/en/research/evidence/2026-08-27-runtime-semantics-evidence-pack)
- [R3 five-case session-observation fixture](/assets/evidence/2026-08-27-r3-ui-status-projection-fixture.json)
- [R3 UI projection reader](/assets/evidence/2026-08-27-r3-ui-status-projection-reader.mjs)
- [R3 check script](/assets/evidence/2026-08-27-r3-ui-status-projection-check.mjs)

## Sources and evidence boundary

- [Sutando PR #3432](https://github.com/sonichi/sutando/pull/3432) was still open when checked. This article uses it only as a public counterexample showing that access tier / role identity cannot safely stand in for execution placement / live-progress existence. The four regression cases are author-reported, and the author explicitly states that a post-restart bridge round trip has not yet been witnessed; this article therefore does not describe the fix as fully production-verified.
- First-party R3 evidence supports the five disclosed session-observation semantics, the corresponding targeted source assertions, and the public deidentified reproducer. The public reader reproduces the disclosed contract rather than publishing private product source, and it does not certify every Web Panel, desktop, PWA, viewer-authority, or permission-filter path.
- The article's central claim is about **projection boundaries**: viewer authority, gateway connectivity, session liveness, progress, REPORT arrival, lifecycle, and evidence conflict should retain separate provenance and semantics. It is not an overall reliability judgment on Sutando or CodeFlowMu.
