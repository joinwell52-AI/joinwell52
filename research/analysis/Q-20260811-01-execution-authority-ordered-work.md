---
schema: "research-analysis/v1"
id: "AN-20260811-01"
date: "2026-08-11"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260811-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260811-01-ordered-local-work-queue.md"
output_contract: "Research Object"
research_object: "Execution Authority for Ordered Digital Employee Work"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Execution Authority for Ordered Digital Employee Work

## Governed scope

Skill 04 analysis using only the completed 2026-08-11 Reading Results, with Q-20260811-01 as the primary Digital Employee object. No unread material, article drafting, visualization, or publication work is introduced.

## Analysis

```yaml
analysis:
  observations:
    - Copilot CLI 1.0.79 documents that new prompts, shell commands, and supported slash commands can arrive while a current local-session task is executing, but they wait and run in order only after the current task finishes.
    - The same release separately supports multiple concurrent sessions, so ordering is explicitly bounded by session identity rather than asserted as one global queue.
    - The release also turns MCP and language-server sandbox startup stalls into bounded failures measured in seconds and exposes effective sandbox policy to the operator.
    - The selected source does not establish queue persistence, capacity, deduplication, crash recovery, failure propagation, or cross-session resource arbitration.
  cross_comparison:
    - The reservation reading separates recommendation arrival from action eligibility and later transaction authority; work can be visible before it is authorized to transact.
    - The analytics reading separates event creation from delivery confirmation and separates progressive telemetry from terminal evidence. Across all three objects, arrival, authority, execution, and completion are distinct states rather than one overloaded status.
  discussion:
    - A Digital Employee runtime should not treat scheduled time, incoming intent, or queue presence as execution authority. Those facts establish demand, not permission to mutate the current execution lane.
    - Session-local ordering is a useful architectural boundary because it permits concurrency only through explicit identities. This is safer than allowing one worker/session to become internally concurrent without a deterministic ownership rule.
    - A queue alone is not sufficient governance. The runtime also needs a claim/lease boundary, terminal evidence for the current item, and a bounded failure rule so one startup dependency cannot hold the lane forever.
    - The source does not prove durable queue semantics. Therefore a Digital Employee design may borrow the ordering principle without assuming Copilot CLI provides restart-safe or exactly-once queue processing.
  research_judgment:
    - Digital Employee runtimes should separate Scheduled or Received intent from Execution Authority. A queued work item becomes executable only after the current lane reaches a governed terminal boundary and the next item is explicitly claimed.
    - Concurrency should be introduced by explicit execution identities such as sessions, workers, or workspaces, while each identity preserves deterministic local ordering unless a stronger synchronization contract exists.
    - Runtime dependencies that can block lane acquisition or startup should be bounded by timeout and surfaced as explicit failure evidence rather than indefinite Running state.
  engineering_impact:
    digital_employee:
      - Model work states at minimum as Received or Scheduled, Queued, Claimed, Running, and Terminal, with the transition to Claimed representing execution authority.
      - Keep per-employee or per-session queues ordered and require explicit identity before allowing parallel lanes.
      - Add bounded startup/claim leases and expose effective execution policy, not only configured intent.
    codeflowmu:
      - Treat scheduler triggers and ADMIN/PM task arrival as wake or queue facts; only the Process Manager may grant one worker execution authority for a governed lane.
      - Persist Worker Claimed and terminal evidence separately from task creation time so UI does not confuse scheduled work with live work.
      - Preserve explicit workspace/session identity when parallel agents are allowed to avoid accidental contention over the same side effects.
    tmpa:
      - Use the mechanism as research input for distinguishing intent, custody, execution authority, and terminal evidence. The changelog-level evidence does not by itself justify a protocol-level queue or persistence rule.
  limitations:
    - The primary evidence is a maintainer changelog rather than queue implementation code.
    - Queue durability, crash recovery, capacity, priority, starvation behavior, and failed-item semantics remain unknown.
    - The release does not define cross-session filesystem or external-side-effect arbitration.
  future_questions:
    - What durable event proves that a queued item obtained execution authority exactly once after restart?
    - Should one Digital Employee have one global ordered lane or multiple role/workspace-scoped lanes?
    - What terminal states release the next queued item after failure, cancellation, or partial tool side effects?
    - Which startup dependencies require independent timeout and retry policies before a worker claim is considered valid?
```

## Research judgment

A robust Digital Employee runtime needs an explicit **execution-authority boundary**. Scheduled time or queued arrival proves that work exists; it does not prove that the work may execute. One ordered lane should advance only when the current item reaches a governed terminal state and the next item is explicitly claimed, while concurrency is introduced through explicit session/worker identities rather than hidden overlap inside one lane.

## Evidence boundary

- `research/reading/Q-20260811-01-ordered-local-work-queue.md`
- `research/reading/Q-20260811-02-restaurant-reservation-action-handoff.md`
- `research/reading/Q-20260811-03-durable-event-identity-terminal-evidence.md`
