---
schema: "research-analysis/v1"
id: "AN-20260807-03"
date: "2026-08-07"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260807-03"
column: "open-source-engineering"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260807-03-deferred-environment-provisioning.md"
output_contract: "Research Object"
research_object: "Stable-Identity Provisioning Gate"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Stable-Identity Provisioning Gate for Deferred Agent Environments

## Governed scope

This object consumes only the completed Reading Result for `Q-20260807-03`. It performs Skill 04 Research Analysis and produces a Production-ready Research Object. It does not introduce unread material, claim fleet-level reliability, draft publication copy, or authorize release.

## Analysis

```yaml
analysis:
  observations:
    - The Reading Result shows the merged openai/codex change consolidating deferred environment state around two manager-level operations: provisioning-status reporting and explicit materialization.
    - Report-first and materialize-first flows converge on one stable provisioned environment identity, and the same Arc is retained across Pending, Ready or Failed state updates.
    - Ordinary environments and provisioned environments are separated structurally: reports to ordinary environments are ignored with Ok(None), while materialization against an ordinary environment returns a typed ProvisioningModeConflict and preserves the existing object.
    - Terminal lifecycle class is sticky: matching terminal reports may repeat, but Ready-to-Failed or Failed-to-Ready changes are rejected; Ready payload details can still be updated within the Ready class.
    - The removed DeferredEnvironmentRegistration Drop behavior eliminates an implicit abandonment-to-failure transition, leaving terminal-failure ownership to an explicit higher-level reporting path.
  cross_comparison:
    - Compared with the same-day Argus Reading Result, both designs preserve stable identity across transient execution and gate durable state transitions, but Argus gates semantic runtime memory/acceptance while this change gates environment readiness.
    - Compared with the same-day agentic-resource Reading Result, both designs reject one undifferentiated shared pool: the server architecture separates resource roles, while provisioning separates ordinary and provisioned environment modes and refuses unsafe reinterpretation.
    - All three same-day Reading Results distinguish canonical state from transient execution context: campaign versus provider session, logical workflow versus current placement, and environment identity versus current provisioning result.
    - The asymmetric ordinary-environment behavior shows that different commands can legitimately use different conflict semantics, but the operator/runtime needs an audit surface so ignored reports are not confused with accepted state transitions.
  discussion:
    - The structurally important mechanism is stable identity plus explicit lifecycle admission. Creating a new object for every readiness update would break references; allowing arbitrary replacement would blur provisioning mode and ownership.
    - Report/materialize order independence reduces race-sensitive lifecycle permutations: a status report can arrive before an explicit Pending object, while later materialization returns the same provisioned object rather than replacing it.
    - This is an in-process coordination contract, not durable distributed provisioning. The Reading Result establishes lock-protected state semantics and regression coverage, but not persistence across restart, cross-process consensus or exactly-once external side effects.
    - Removing Drop-triggered failure is architecturally cleaner because lifecycle transitions become explicit, but it creates a new obligation: some owner must detect disappeared provisioning work and emit a terminal failure or timeout decision.
    - For agent runtimes, the reusable pattern is to separate resource identity, lifecycle class, readiness payload and connection/use activation. Provisioning success should not implicitly start use, and use should not silently mutate provisioning truth.
  research_judgment:
    - Deferred agent resources should use a stable logical identity whose Pending/Ready/Failed lifecycle is changed through explicit typed reports, while materialization only establishes or returns the lifecycle object rather than replacing unrelated resources.
    - Report-first and materialize-first operations should converge idempotently on one lifecycle object, but mode conflicts must remain explicit so an ordinary resource cannot be silently reinterpreted as a provisioned one.
    - Eliminating implicit Drop-based failure requires an explicit lifecycle owner for timeout, abandonment and terminal-failure reporting; otherwise Pending can become an unowned indefinite state.
    - In-memory lifecycle correctness must be treated as a local mechanism, not proof of durable recovery or exactly-once distributed provisioning; production runtimes need persistent events or receipts above this manager contract.
  uncertainty:
    - Confidence is high that stable identity plus explicit report/materialize operations reduce lifecycle ambiguity and replacement races inside one process.
    - Confidence is medium that the exact asymmetric conflict semantics are appropriate for every caller because ignored reports can be operationally surprising without a separate diagnostic surface.
    - Confidence is low that the selected change alone establishes restart durability, distributed coordination or successful end-to-end remote environment connection under fleet failures.
  counter_evidence:
    - The regression tests establish intended local semantics but do not demonstrate successful production connection, restart recovery or multi-process races.
    - An ignored provisioning report to an ordinary environment returns success-like Ok(None), which can hide caller mistakes unless higher layers record a diagnostic or audit event.
    - Removing the registration-handle Drop failure removes one automatic abandonment signal; without higher-level timeout ownership, a provisioning attempt may remain unresolved.
    - Ready payloads remain mutable within the Ready class, so "idempotent Ready" does not mean the entire terminal payload is immutable.
  engineering_impact:
    tmpa:
      - No TMPA Core change is justified from this implementation-specific Reading Result.
      - Stable identity, typed lifecycle and explicit conflict semantics are useful implementation evidence, but persistence and distributed guarantees must be proven in Runtime before protocol promotion.
    digital_employee:
      - Treat remote browser, tool, sandbox or workspace environments as durable logical resource IDs with separate lifecycle state and use/connection activation.
      - Preserve Pending, Ready and Failed as explicit states with one owner responsible for timeout and abandonment after any implicit Drop mechanism is removed.
      - Require typed mode conflicts rather than silently replacing an already registered ordinary resource with deferred provisioning.
      - Record ignored or rejected provisioning reports as observable diagnostics when operator comprehension or auditability matters.
    codeflowmu:
      - Model worker/tool-environment provisioning as report-and-materialize rather than replacement/upsert APIs spread across multiple callers.
      - Keep environment identity stable while readiness changes so queued tasks and UI projections do not chase replaced objects.
      - Add durable FCoP/Runtime events or effect receipts above in-memory environment state if provisioning must survive restart or be reconciled across processes.
      - Separate provisioning completion from actual connection/use start, and make both transitions independently observable.
  limitations:
    - The analysis is bounded to the merged maintainer change, implementation and tests captured in the completed Reading Result.
    - The inspected EnvironmentManager state is process-local and does not establish durable persistence across restart.
    - The tests do not demonstrate successful end-to-end remote connection or cross-process exactly-once materialization.
    - Backward compatibility for downstream users of removed APIs is not established by the selected change.
  future_questions:
    - Which component should own timeout and terminal failure when provisioning work disappears without a Ready or Failed report?
    - Should ignored reports to ordinary environments always emit an audit event, and what severity distinguishes benign late reports from caller bugs?
    - What durable event/receipt layer is needed to recover Pending/Ready/Failed state after process restart without duplicating external provisioning side effects?
    - At what lifecycle point should mutable Ready payload fields such as capability roots become frozen or versioned?
```

## Research judgment

The Production-relevant object is:

> Use stable identity plus an explicit report-and-materialize lifecycle for deferred agent environments, make mode conflicts typed and observable, and place timeout/recovery durability above the in-process manager instead of mistaking local idempotence for distributed exactly-once provisioning.

This is an inference from the completed Reading Result and remains bounded by its local-code, regression-test and no-restart/no-fleet-evaluation limitations.

## Production input

Production may consume this Research Object to explain the report-and-materialize pattern. It must preserve the asymmetric ordinary-environment conflict behavior, the removed Drop-abandonment signal, the process-local limitation and the distinction between provisioning readiness and actual connection/use.

## Evidence boundary

- `research/reading/Q-20260807-03-deferred-environment-provisioning.md`

No other source was consumed by this Analysis object.
