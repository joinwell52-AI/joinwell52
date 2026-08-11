---
schema: "research-analysis/v1"
id: "AN-20260811-03"
date: "2026-08-11"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260811-03"
column: "open-source-engineering"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260811-03-durable-event-identity-terminal-evidence.md"
output_contract: "Research Object"
research_object: "Durable Event Identity and Terminal Evidence for Agent Operations"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Durable Event Identity and Terminal Evidence for Agent Operations

## Governed scope

Skill 04 analysis using only the completed 2026-08-11 Reading Results, with Q-20260811-03 as the primary Open-source Engineering object. No unread material, article drafting, visualization, or publication work is introduced.

## Analysis

```yaml
analysis:
  observations:
    - Google ADK assigns a stable event_id before asynchronous enqueue, and retries reuse that same identity rather than minting a new one.
    - Default delivery can still create duplicate physical rows; event_id provides a durable deduplication key rather than storage-level exactly-once delivery.
    - The opt-in committed-stream mode uses explicit offsets, but the implementation documents conflict, retry-exhaustion, rotation-failure, and backoff paths that can drop rows.
    - Final LLM termination metadata is emitted only on the final response row, while workflow nodes receive explicit NODE_OUTPUT and NODE_ERROR terminal events carrying node/run identity.
    - Offset state and desynchronization tracking shown in the implementation are process-local; restart-safe offset reconstruction is not established.
  cross_comparison:
    - The ordered-work reading shows that queued intent needs a later claim before execution; stable event identity gives that claim and its later terminal outcome a durable occurrence reference.
    - The connector-handoff reading shows that an external transaction needs a provider-confirmed receipt; terminal evidence must name the authoritative system rather than relying on an internal agent completion signal.
  discussion:
    - Identity and delivery guarantee are different engineering properties. A stable occurrence id can make retries and duplicates reconcilable even when the transport or sink cannot provide lossless exactly-once behavior.
    - Terminal evidence should be explicit and typed. Inferring completion from the last generic log line is weaker than emitting a dedicated success/error event tied to the same execution identity.
    - Exactly-once terminology must be scoped to the layer that owns the guarantee. A writer can reduce duplicate appends while still dropping rows; an analytics event can be unique while the business side effect it describes is retried separately.
    - Operational governance therefore needs both positive terminal evidence and loss/ambiguity counters. A quiet event stream is not proof that nothing failed if rows may be dropped during retries or stream recovery.
  research_judgment:
    - Agent runtimes should allocate durable occurrence identity before asynchronous handoff, reuse that identity across retries, and preserve explicit terminal success/error evidence for the same logical execution.
    - Deduplication identity should be treated as a reconciliation primitive, not as proof of exactly-once execution or lossless delivery.
    - Runtime observability should expose ambiguity and drop states as first-class governance evidence, especially when transport recovery can intentionally discard work rather than block indefinitely.
  engineering_impact:
    digital_employee:
      - Assign one durable occurrence id to each work item, action attempt, or evidence event before it enters an asynchronous queue or connector boundary.
      - Emit explicit terminal events for worker/task success, failure, cancellation, and externally handed-off outcomes rather than inferring closure from silence.
      - Track duplicate, retry-exhausted, conflict, and dropped-event counters as operational health signals.
    codeflowmu:
      - Add stable event ids to Runtime timeline/report/evidence records and preserve them across retry/recovery paths.
      - Separate physical event delivery from logical occurrence identity so duplicate files/rows can be reconciled without claiming stronger delivery semantics than exist.
      - Introduce typed terminal evidence for TASK/worker/tool transitions and retain failure metadata even when a recovery path later succeeds.
    tmpa:
      - Use this implementation as research input for evidence identity, append-only transition provenance, and explicit terminal-state semantics. The single analytics implementation does not establish end-to-end exactly-once guarantees suitable for protocol-level claims.
  limitations:
    - The opt-in delivery path is explicitly not lossless and remains scoped to one live writer/committed stream.
    - Durable offset recovery across process restart is not established.
    - event_id identifies analytics occurrences, not arbitrary external business transactions or tool side effects.
    - Explicit NODE_OUTPUT/NODE_ERROR improves observability but does not prove semantic completeness of every workflow result.
  future_questions:
    - What identity hierarchy should connect Runtime task, worker claim, tool/action attempt, and emitted evidence without conflating them?
    - Which terminal events must be durable before a Process Manager may release the next ordered task?
    - How should restart recovery reconcile in-memory offset state with durable event identity?
    - What alert thresholds should turn duplicate/conflict/drop counters into a governed recovery decision?
```

## Research judgment

A trustworthy agent runtime needs **durable occurrence identity plus explicit terminal evidence**. Identity must be created before asynchronous handoff and reused across retries; completion or failure must then be represented by a typed terminal event tied to that identity. This enables reconciliation under duplicate or ambiguous delivery without overstating exactly-once semantics beyond the layer that actually guarantees them.

## Evidence boundary

- `research/reading/Q-20260811-01-ordered-local-work-queue.md`
- `research/reading/Q-20260811-02-restaurant-reservation-action-handoff.md`
- `research/reading/Q-20260811-03-durable-event-identity-terminal-evidence.md`
