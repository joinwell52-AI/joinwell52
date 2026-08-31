---
title: "CodeFlowMu V2.1.2 Public Release Summary"
date: '2026-08-30'
updated: '2026-08-31'
column: research-evidence
category: evidence
article_type: release-summary
edition: research-center
summary: "CodeFlowMu V2.1.2 is a Runtime boundary-safety patch focused on persistent idempotency for task creation, safe projection for ordinary Activity consumers, and Runtime verification of skill Session identity. This page provides a publicly accessible release summary, validation results, scope and evidence entry points."
lifecycle: "Published"
publication_authorized: true
---

[中文版本](/zh/research/evidence/2026-08-30-codeflowmu-v2.1.2-public-release-summary)

# CodeFlowMu V2.1.2 Public Release Summary

> Release date: 2026-08-30  
> Release type: Runtime boundary-safety patch  
> Public summary updated: 2026-08-31

## What is CodeFlowMu?

CodeFlowMu is a **local-first multi-agent collaboration and digital-employee runtime**. It does more than call models: agents with distinct responsibilities such as PM, DEV, QA, OPS and EVAL work continuously inside controlled workspaces, while the Runtime manages task objects, Sessions, tool calls, Activity, recovery and audit evidence.

Systems of this kind must survive long-running work, repeated wakeups, process recovery, Host interruptions and concurrency. That makes questions such as “did the action already happen?”, “which real Session did this call belong to?” and “which fields should a consumer be allowed to see?” product-level runtime boundaries rather than logging details.

## One-sentence conclusion

V2.1.2 addresses three Runtime boundary problems:

1. **Persistent idempotency for task creation**: after response loss, concurrent retries or process recovery, the same stable business submission can recover the original creation result instead of creating a second TASK.
2. **Safe projection for ordinary Activity consumers**: internal events can retain complete diagnostic facts while Web Panel, Activity API and Analytics receive only recursively allowlisted projections.
3. **Runtime verification of skill Session identity**: a caller-supplied `session_id` is no longer treated as execution evidence until it is checked against Runtime SessionStore facts.

## 1. Task creation: from “retry after failure” to a recoverable creation contract

For callers that need strong idempotency, V2.1.2 adds a stable `client_submission_id`, canonical `request_digest`, a pre-creation reservation and a machine-readable creation receipt.

The core relation is:

`client_submission_id → request_digest → task_id / task_path → creation_result`

Retries with the same submission identity and the same request digest reuse the original result. Reusing the same submission identity with a different digest returns `conflict` and creates no additional TASK. The creation process is persisted as:

`reserved → task_created → committed`

This covers the window in which a TASK has already been persisted but the success response is lost, as well as intermediate-state recovery.

Key independent-QA observations:

- A2 response-loss retry: final TASK count 1; `task_id` unchanged; second call returned `reused / action_taken=false`.
- A4 eight-way concurrency: `created=1 / reused=7`; one authoritative `task_id`; final TASK count 1.

Public evidence: [Response Loss and Per-Tool Idempotency](/en/research/evidence/2026-08-28-response-loss-idempotency).

## 2. Activity: retaining internal evidence does not mean every consumer receives every field

V2.1.2 separates internal Activity fact objects from ordinary consumer objects.

Instead of copying a complete object and deleting a few known fields, the server reconstructs consumer-specific projections from recursive allowlists. `payload.raw`, unknown fields and unknown nested values are excluded from ordinary results by default. Approved relational fields such as task, thread, session, event and `projected_summary` remain available.

Raw internal events are still retained for explicitly authorized diagnostic paths. The change therefore establishes a consumer boundary rather than deleting diagnostic facts.

Key independent-QA B1 observations:

- a unique marker present only in raw appeared **0 times** in the ordinary projection;
- `raw_present=false`;
- event_type, task_id, session_id and `projected_summary` remained present.

Public evidence: [Event Consumer Visibility](/en/research/evidence/2026-08-28-event-consumer-visibility).

## 3. Session: identity claims must return to Runtime authority

V2.1.2 no longer upgrades a caller-supplied `session_id` directly into trusted execution identity. The Runtime checks SessionStore against:

- task_id;
- thread_key;
- session_id;
- agent;
- caller;
- whether the Session exists and is in an acceptable state.

The resulting evidence semantics are explicit:

- `verified`: Runtime-authoritative Session facts support the binding;
- `sessionless/not_applicable`: the operation is legitimately sessionless by design and has a Runtime reason;
- `invalid_claim`: the Session claim conflicts with Runtime facts and is preserved as a negative audit fact rather than upgraded into trusted evidence.

Independent QA C1 used an actual SessionStore registration and verified consistency across task/thread/session/agent/caller, with journal integrity verification passing.

Public evidence: [Skill and Session Evidence Chain](/en/research/evidence/2026-08-28-skill-session-evidence).

## Release validation

Final V2.1.2 release validation recorded:

- Runtime: **1842 pass / 0 fail / 1 skip**;
- Shell: **1037 pass / 0 fail / 0 skip**;
- V2.1.1 and V2.1.2 same-protocol critical matrices, each repeated for 10 rounds: Runtime **1630/1630**, Shell **550/550**;
- typecheck, Shell build, installer contract, rules and version consistency all passed.

These are actual results for the release test sets. They are not a “reliability rate”, “security rate” or “evidence trust rate”. Earlier failed release attempts remain part of the record, including field over-pruning, lockfile issues and the independent Open Edition build boundary.

## Versions and compatibility

- CodeFlowMu: V2.1.2
- Runtime: V2.1.2
- Shell: V2.1.2
- Protocol: V1.1.1 (unchanged)
- Mobile PWA / Service Worker cache: V1.0.75 (unchanged)
- Mobile API: V1.3.4 (unchanged)
- Gateway: V1.0.12 (unchanged)

No data migration is required. Existing TASK, REPORT, Session and Activity files do not need bulk rewriting.

Legacy callers that omit `client_submission_id` continue to use the legacy creation path, but they do not receive strong idempotency across response loss and process recovery. Ordinary Activity consumers that previously depended on unregistered raw/unknown fields must migrate to public projected fields. Consumers of skill invocation evidence must also stop treating the mere presence of a `session_id` string as equivalent to `verified`.

## What this release does not claim

V2.1.2 does not prove that:

- every Agent tool is safe to retry;
- every Host, real LAN/Gateway deployment, browser profile or production project has been covered;
- the entire Runtime is free of all information-disclosure risk;
- `session_binding=verified` proves that skill advice, code or task results are correct;
- Open Dev Team Edition has been released in sync.

The one Windows symlink permission skip, existing dependency warnings, some environment warnings and uncovered real-deployment scopes remain explicitly recorded.

## About source code and original release material

The current CodeFlowMu product mother repository is private. V2.1.2 implementation source, complete independent-QA logs, R3 release logs and release receipts are restricted first-party material and are not used as public reading links.

This page exists to expose the **version facts, validation results, scope and limitations** directly relevant to the public research articles in a stable, publicly accessible form. Public evidence pages also provide sanitized fixtures, readers/checks or source mappings. They are not presented as a substitute capable of fully rerunning the private Runtime.

## Related articles

- [Engineering Record I: After Response Loss, Reliable Retry Starts with a Persistent Idempotency Boundary](/en/engineering/2026-08-28-response-loss-idempotency)
- [Engineering Record II: Session Identity Cannot Be Self-Asserted — Building a Verifiable Execution-Evidence Boundary](/en/digital-employee/2026-08-28-skill-session-evidence)
- [Engineering Record III: An Event Happened — But Who Should See What? Designing Safe Activity Projection](/en/engineering/2026-08-28-event-consumer-visibility)
