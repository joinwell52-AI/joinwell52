---
schema: "research-analysis/v1"
id: "AN-20260808-01"
date: "2026-08-08"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260808-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260808-01-session-budget-governance.md"
output_contract: "Research Object"
research_object: "Pause-Preserving Budget Admission"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Pause-Preserving Budget Admission for Digital Employees

## Governed scope

This object performs Skill 04 using only the three completed same-day Reading Results, with `Q-20260808-01` as the primary column input. It introduces no unread material, publication copy, or release authorization.

## Analysis

```yaml
analysis:
  observations:
    - The primary Reading Result places budget enforcement before admission of each new model request rather than inside an already-running request.
    - `budget_reached` produces a durable idle/pause state: history and sandbox state are preserved, while already-started settlement work may still complete.
    - Enforcement uses exact unrounded list cost while the operator-visible usage value is rounded; therefore the visible number is not the exact enforcement quantity.
    - Multiagent threads share one session budget and can reach pause at different times because already-admitted requests are allowed to finish.
    - Raising or removing an authorized budget automatically resumes paused work, so policy state rather than an executor retry is the causal resume trigger.
  cross_comparison:
    - The managed-model Reading Result shows the same structural pattern at a different authority boundary: centrally managed policy becomes a runtime admission constraint instead of a client preference.
    - The gRPC Reading Result likewise separates lifecycle finality from semantic success; a paused session is not complete, and a protocol-completed execution can still carry application error text.
    - The budget's settle-only channel is analogous to a drain boundary: new generative work is blocked while obligations already admitted are allowed to reconcile.
    - A shared session cap simplifies one source of economic authority but couples otherwise independent threads unless a higher policy layer partitions accountability.
  discussion:
    - The important mechanism is cost-governed work admission, not cost reporting. Governance is effective because the runtime can refuse new model work without destroying the durable work identity.
    - Pause instead of termination creates a reversible authority boundary: an authorized policy change can reopen execution from preserved state.
    - The phrase hard budget must be interpreted narrowly as a hard boundary on admitting new model requests, not an exact invoice ceiling, because in-flight work can overshoot.
    - A Digital Employee needs separate state for budget policy, observed usage, admissible new work, settlement work, and durable work state; collapsing these into one `active` flag loses the reason and authority for suspension.
    - Per-role or fleet-wide economic accountability must be explicit above the session primitive when one shared cap is too coarse.
  research_judgment:
    - A managed Digital Employee should model budget exhaustion as a typed reversible admission state that blocks new generative work while preserving durable work state and permitting narrowly defined settlement actions.
    - Budget authority should attach to the long-lived WorkOrder/session identity and change only through an authorized policy owner; resume should be the consequence of an accepted policy transition, not an untracked worker retry.
    - Runtime evidence must distinguish exact enforcement accounting from rounded operator-facing usage and must not promise an exact final spend ceiling when already-admitted work can overshoot.
    - Per-role, department, or fleet economic controls should be explicit higher-level policy objects because a shared per-session cap does not provide independent thread budgets or cumulative deployment governance.
  uncertainty:
    - Confidence is high in the admission-versus-termination distinction because it is explicit in the completed first-party Reading Result.
    - Confidence is medium that pause-preserving budget governance transfers cleanly to heterogeneous Digital Employee roles because the source describes one managed-agent product rather than a cross-platform study.
    - Confidence is low about exactly-once event delivery, worst-case multi-thread convergence time, and organization-level cumulative budget behavior because those guarantees remain unresolved.
  counter_evidence:
    - The documented hard budget can overshoot due to already-admitted requests, so it is not evidence for an exact final-cost ceiling.
    - Public list cost can differ from negotiated billed spend, limiting direct use as an invoice-aligned financial control.
    - Multiagent sessions share one cap with no per-thread partition, so the mechanism does not independently govern role budgets.
    - Models without public list prices can make the budget unusable, with budget removal documented as the recovery path.
  engineering_impact:
    tmpa:
      - Treat this as research input on typed suspension, policy authority, and evidence boundaries; no TMPA Core change is justified from one product mechanism.
    digital_employee:
      - Add a durable budget-policy surface to WorkOrder/runtime state with explicit Active, BudgetPaused, and Resumable semantics rather than terminating work at the cap.
      - Preserve an allowlist for settlement actions that can close already-started obligations without admitting new model work.
      - Record policy owner, exact enforcement usage, rounded display usage, pause reason, and resume authorization separately.
      - Use higher-level role or organizational budget policy when one shared session cap is too coarse for accountability.
    codeflowmu:
      - Keep `unknown`, `running`, `waiting for authority`, and `completed` distinct; a budget pause must not be surfaced as failure or completion.
      - Implement budget governance first in Runtime/WorkOrder state and observation surfaces rather than expanding FCoP protocol semantics from this single case.
      - Recovery should reopen execution from accepted durable state after policy authorization without requiring reuse of the original provider session.
  limitations:
    - The analysis is bounded to completed same-day Reading Results and does not independently reproduce Claude Managed Agents behavior.
    - No organization-level cumulative budget primitive is established by the primary Reading Result.
    - Event retry, reconnect, and exactly-once guarantees are not demonstrated.
    - Transfer from product-specific list-cost accounting to SME operational budgets remains an inference.
  future_questions:
    - What minimum WorkOrder budget contract separates cap, exact consumed amount, displayed amount, settlement authority, and resume authority?
    - How should role-specific budgets compose with a shared WorkOrder budget without contradictory admission decisions?
    - What crash/reconnect tests are required to prove BudgetPaused state and settlement receipts survive partial failure?
    - Should CodeFlowMu expose budget pause as a dedicated operator-decision state or a generic policy-wait state with typed reason metadata?
```

## Research judgment

Treat budget exhaustion as pause-preserving work-admission governance: new generative work stops, accepted state survives, settlement remains possible, and only an authorized policy change reopens execution. Do not equate a hard admission gate with an exact final-cost ceiling.

## Production input

Production may consume this Research Object only with its overshoot, list-cost, shared-budget, and unresolved delivery-guarantee boundaries intact.

## Evidence boundary

- `research/reading/Q-20260808-01-session-budget-governance.md`
- `research/reading/Q-20260808-02-managed-model-auto-review.md`
- `research/reading/Q-20260808-03-code-mode-grpc-host-protocol.md`

No unread material was consumed.
