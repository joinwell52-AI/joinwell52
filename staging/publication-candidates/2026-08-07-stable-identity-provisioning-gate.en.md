---
schema: "publication-candidate-article/v1"
title: "Deferred Agent Environments Need Stable Identity, Not Replacement-Based Provisioning"
date: "2026-08-07"
column: "open-source-engineering"
category: "daily"
summary: "Deferred environments should converge report-first and materialize-first flows on one stable logical identity with explicit Pending, Ready, and Failed states. Local idempotence reduces ambiguity but does not prove restart durability or distributed exactly-once provisioning."
sources:
  - "research/analysis/Q-20260807-03-stable-identity-provisioning-gate.md"
  - "research/reading/Q-20260807-03-deferred-environment-provisioning.md"
item_id: "Q-20260807-03"
lifecycle: "Publication Candidate"
source_research_object: "research/analysis/Q-20260807-03-stable-identity-provisioning-gate.md"
source_reading_result: "research/reading/Q-20260807-03-deferred-environment-provisioning.md"
visualization: "staging/publication-candidates/2026-08-07-stable-identity-provisioning-gate.svg"
visualization_decision: "Required — stable-identity provisioning lifecycle diagram included; Research Center synthesis based on the cited Research Object"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: false
---

# Deferred Agent Environments Need Stable Identity, Not Replacement-Based Provisioning

Agent runtimes increasingly depend on resources that must be referenced before they are usable: remote sandboxes, browser environments, workspaces, or tool containers may exist logically while still Pending and become Ready or Failed later.

The dangerous API pattern is not simply “slow provisioning.” It is replacing the resource object every time lifecycle state changes. Once identity drifts, queued tasks, UI projections, references, and audit records must chase a new object, increasing race and reconciliation risk.

The same-day Research Object points to a cleaner pattern: stable identity plus an explicit report-and-materialize lifecycle.

## Central judgment

**Provisioning state should change; resource identity should not.**

Pending, Ready, and Failed are lifecycle classes of one logical resource. A `report` operation submits status. A `materialize` operation establishes or returns the provisioned lifecycle object. Report-first and materialize-first flows should converge on the same identity rather than using replacement/upsert semantics to overwrite earlier objects.

This local idempotence is useful, but its boundary matters: a lock-protected in-process manager does not establish crash durability, multi-process consensus, or exactly-once external provisioning.

## Source

This candidate consumes only the Production-authorized `Q-20260807-03` Research Object. Production did not return to the Signal Pool or Reading Result for new research and did not add new external facts. The Reading Result is retained only as the evidence boundary and provenance path declared by the Research Object.

## Observation

The Research Object preserves five mechanisms.

First, deferred-environment state is consolidated around two manager-level operations: provisioning-status reporting and explicit materialization. Callers no longer need multiple independent upsert paths to express the same lifecycle.

Second, report-first and materialize-first behavior converges on one stable provisioned environment identity. Pending, Ready, or Failed updates do not force queued tasks to follow a replacement object.

Third, ordinary environments and provisioned environments are structurally distinct. A provisioning report to an ordinary environment is ignored as `Ok(None)`, while materialization against an ordinary environment returns a typed `ProvisioningModeConflict` and preserves the existing object. That asymmetry may be intentional, but without an audit surface `Ok(None)` can look like an accepted state transition to the caller.

Fourth, terminal lifecycle class is sticky. Ready cannot flip to Failed and Failed cannot flip to Ready, while matching terminal reports may repeat idempotently. However, Ready payload details remain mutable within the Ready class, so “idempotent Ready” is not equivalent to a completely immutable terminal record.

Fifth, removing a registration-handle Drop behavior eliminates an implicit abandonment-to-failure transition. That makes lifecycle ownership more explicit, but it also removes one automatic signal that provisioning work disappeared. Timeout and terminal-failure ownership must move to a named higher-level component.

## Comparison

| Design | Identity | Lifecycle update | Conflict behavior | Recovery boundary |
|---|---|---|---|---|
| Replacement / upsert | State change may replace the object | Distributed across callers | Semantics can be overwritten | Tasks and references chase new objects |
| Stable identity + report/materialize | One logical resource ID | Explicit Pending / Ready / Failed reports | Typed mode conflict; some reports may be ignored | Better in-process race and order behavior |
| Durable production extension | Stable resource ID + persistent event/receipt | Local state plus durable transition record | Conflicts and ignored reports are auditable | Restart reconciliation is possible but external effects still need idempotency |

The first two rows summarize the Research Object. The third is a Research Center production-runtime extension, not a capability established by the analyzed implementation.

## Discussion

The reusable architecture is to separate four concepts: **resource identity, lifecycle class, readiness payload, and connection/use activation.**

Identity should stay stable because tasks and UI surfaces need a durable reference. Lifecycle class should be explicit because Pending, Ready, and Failed have different control meaning. Readiness payload may be versioned because endpoints, capability roots, or metadata can still be refined. Connection/use should be modeled separately again, because “the environment is Ready” does not mean “a task has connected and started using it.”

Order independence also matters. A status report may arrive before an explicit Pending object. If both operations eventually converge on the same identity, callers do not have to manufacture correctness through retry order.

But local idempotence cannot substitute for distributed durability. After a process restart, without a durable event, effect receipt, or external idempotency key, the runtime may not know whether a provisioning side effect already happened. Re-materializing can therefore create a second real resource even if the in-memory manager had perfect idempotence before the crash.

## Engineering impact

For Digital Employees, remote browser, sandbox, workspace, and tool environments should have durable logical resource IDs. Provisioning completion and connection/use start should be separate observable transitions so Ready does not silently imply Active.

A named runtime owner must control timeout and abandonment. Once Drop no longer turns a disappeared registration into Failed, the owner needs to detect an orphaned Pending state and emit an explicit terminal verdict.

For CodeFlowMu, worker/tool-environment provisioning should converge on report-and-materialize operations rather than caller-specific replacement/upsert APIs. A durable FCoP/Runtime layer above the manager can record append-only provisioning events, effect receipts, and recovery reconciliation. Ignored reports to ordinary environments should also create a diagnostic when operator comprehension or auditability matters, allowing the system to distinguish a benign late report from a caller bug.

## Boundaries and counter-evidence

The evidence establishes local manager semantics and regression coverage. It does not demonstrate restart recovery, multi-process races, successful remote connection, fleet-level reliability, or exactly-once external effects.

`Ok(None)` may hide a caller error. Removing Drop-based failure can leave Pending unowned if no timeout controller exists. Ready payload remains mutable within the Ready class. Backward compatibility for downstream users of removed APIs is also not established by this Research Object.

The defensible conclusion is therefore narrower: stable identity and explicit lifecycle admission reduce local ambiguity. They do not prove that distributed provisioning is solved.

## Future work

Four questions remain: which component owns timeout and terminal failure; whether ignored reports should always emit an audit event and at what severity; what durable event/receipt layer can recover Pending/Ready/Failed after restart without duplicating external effects; and which Ready payload fields should become frozen or versioned at which lifecycle point.

## Visualization note

The visual centers one Stable Resource ID, shows report-first and materialize-first flows converging on Pending/Ready/Failed, and separates Connection/Use from provisioning truth. A lower durable event/receipt layer is explicitly labeled as a production extension rather than a capability proven by the source.

## Evidence and references

1. [Research Object — Stable-Identity Provisioning Gate](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260807-03-stable-identity-provisioning-gate.md): the sole analytical input, including lifecycle semantics, uncertainty, counter-evidence, and engineering impact.
2. [Reading Result — Deferred environment provisioning](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260807-03-deferred-environment-provisioning.md): the evidence boundary and provenance record declared by the Research Object; Production did not re-analyze this file.

> Editing status: bilingual structure aligned; asymmetric ordinary-environment conflict behavior, removal of the Drop abandonment signal, process-local limitations, and the separation of provisioning from use preserved; not published.
