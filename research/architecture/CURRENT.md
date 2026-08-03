# Research Architecture — Current State

- **Repository:** `joinwell52-AI/joinwell52`
- **Operating system:** Research Operating System V2
- **Gate:** Research Architecture Gate
- **Last gate run:** 2026-08-03
- **Authoritative decision record:** `research/architecture/gates/2026-08-03-accountable-work-boundaries.md`
- **Architecture promotion rule:** a recurring finding is not an architecture decision until its candidate-specific evidence threshold is satisfied

## Current architecture state

No new Architecture, Specification, Publication or Release object was authorized by the 2026-08-03 gate.

| Candidate | Current state | Gate decision | Linked research path | Next lifecycle target |
|---|---|---|---|---|
| `AC-K003-01` Work Boundary Control Plane | **Knowledge** | Return for additional Analysis | `Q-W003-01` remains `Reading` | `Analysis` |
| `AC-K003-02` Evidence Envelope and Completion Verifier | Knowledge | Hold: executable validator evidence missing | `Q-W003-02` Selected | Reading after ownership baseline |
| `AC-K003-03` Human Authority Decision Node | Knowledge | Hold: authority-state and idempotency model missing | `Q-W003-03` Selected | Reading after ownership baseline |
| `AC-K003-04` Versioned Work Verification Contract | Knowledge | Hold: paired reproducible cases missing | no independent active item | Queue/experiment design |
| `AC-K003-05` Control Plane / Work Runtime Contract | Knowledge | Hold: two-domain projection proof missing | `Q-W003-08` Queue dependency | Queue until runtime proof |

## Formal gate decision

```yaml
gate_id: AG-20260803-01
reviewed_candidates: 5
selected_candidate: AC-K003-01
decision: return_for_analysis
candidate_state_before: Knowledge
candidate_state_after: Knowledge
linked_queue_item: Q-W003-01
linked_queue_state_after_gate: Reading
next_eligible_engine_transition: Reading -> Analysis
architecture_promotions: 0
specification_promotions: 0
publication_promotions: 0
```

The Gate determined that the cross-source evidence supports a bounded Analysis-stage comparison, but the published promotion threshold is not met. In particular, there is no completed Analysis record, minimal invariant proof, four-path reconstruction experiment, or demonstrated projection boundary across TMPA, FCoP and CodeFlowMu.

## Required Analysis before reconsideration

The next Analysis package must:

1. compare computer operation, MCP capability, manager subtask, explicit handoff and A2A delegation;
2. classify proposed boundary fields as necessary, derivable or inapplicable;
3. design a four-path reconstruction experiment with an MCP non-transfer control case;
4. map every fact to TMPA Core, TMPA profile, FCoP, CodeFlowMu runtime event, derived view or debugging trace;
5. include falsification criteria for schema duplication, semantic flattening, circular authority and duplicate consequential action.

## Affected components

### TMPA

No Core change is authorized. Future work must preserve Core/profile separation, role and authority semantics, separation of duties, immutable evidence, deterministic reconstruction, conflict preservation and `undetermined` judgments.

### Digital Employee

No governing-baseline change is authorized. The candidate may later refine the boundary between Operation Node and execution adapters, but Position authority, WorkOrder scope, CodeFlowMu Runtime responsibility and the conjunctive completion model remain unchanged.

### CodeFlowMu

No implementation change is authorized. The Analysis must first test whether PM orchestration, handoff events, FCoP lifecycle evidence, QA/EVAL, ADMIN authority and recovery records can deterministically project the required ownership and acceptance facts.

## Current authoritative status

```text
Knowledge record: K-20260803-01
Selected gate candidate: AC-K003-01
Candidate state: Knowledge
Architecture decision: Not authorized
Next governed research state: Analysis
Engine transition executed by this gate: None
```
