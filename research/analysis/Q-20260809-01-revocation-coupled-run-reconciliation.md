---
schema: "research-analysis/v1"
id: "AN-20260809-01"
date: "2026-08-09"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260809-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260809-01-conversation-delete-run-cancellation.md"
output_contract: "Research Object"
research_object: "Revocation-Coupled Run Reconciliation"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Revocation-Coupled Run Reconciliation

## Governed scope

Skill 04 analysis using only the three completed 2026-08-09 Reading Results, with Q-20260809-01 as the primary Digital Employee object. No unread material or publication drafting is introduced.

## Analysis

```yaml
analysis:
  observations:
    - Conversation deletion now serializes against run admission on the same durable row lock and reconciles the full unsettled run set in the deletion transaction.
    - QUEUED and AWAITING_APPROVAL can be closed synchronously, while RUNNING remains cooperative because physical execution is outside the database transaction.
    - The implementation distinguishes semantic unsettled state from storage shortcuts such as finishedAt, which can be populated even when approval work remains unresolved.
  cross_comparison:
    - The workload-identity object similarly separates durable authority from short-lived execution credentials: authority revocation and execution mechanics are different layers.
    - The checkpoint-conformance object shows why durable correctness cannot be inferred from visible output alone; lifecycle state likewise needs explicit reconciliation rather than UI disappearance.
  discussion:
    - Deletion of a Digital Employee work context is best modeled as revocation of authority plus reconciliation of descendants, not merely removal of a visible container.
    - The same-lock pattern is structurally important because it makes admission and revocation mutually ordered; otherwise a new child run can be admitted during teardown.
    - Transactional lifecycle state cannot by itself prove a running worker has stopped. A separate lease/watchdog is therefore required for bounded physical convergence.
  research_judgment:
    - Digital Employee runtimes should couple destructive context transitions with child-work reconciliation under the same admission serialization boundary.
    - Durable lifecycle state must distinguish queued, authority-waiting and physically running work because their cancellation semantics differ.
    - A Running state requires a bounded lease or heartbeat contract; cooperative cancellation without stale-worker reconciliation is incomplete governance.
  engineering_impact:
    digital_employee:
      - Treat deletion/disablement as authority revocation followed by transactional reconciliation of unsettled child work.
      - Add worker lease expiry so durable cancellation can be reconciled with physical execution that fails to acknowledge stop intent.
    codeflowmu:
      - Keep scheduler slot state separate from evidence that a worker is actively progressing.
      - Record admission lock, cancellation intent, worker acknowledgement and lease expiry as distinct events.
    tmpa:
      - Use as research input on custody/revocation boundaries; no protocol change is justified from this single implementation.
  limitations:
    - Evidence is one merged Langfuse implementation, not a generic distributed exactly-once proof.
    - No bounded worker wind-down latency is established.
  future_questions:
    - What lease duration and heartbeat evidence should make Running authoritative?
    - When should stale physical work be fenced from committing after a replacement worker starts?
```

## Research judgment

A Digital Employee context deletion is an authority-revocation transaction, not a UI operation. Admission and teardown need one serialization boundary, and Running work additionally needs a lease/watchdog because durable cancellation does not prove physical termination.

## Evidence boundary

- `research/reading/Q-20260809-01-conversation-delete-run-cancellation.md`
- `research/reading/Q-20260809-02-workload-identity-exchange.md`
- `research/reading/Q-20260809-03-checkpoint-conformance-migration.md`
