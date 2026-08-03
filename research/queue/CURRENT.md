# Research Queue — Current State

- **Repository:** `joinwell52-AI/joinwell52`
- **Operating system:** Research Operating System V2
- **Execution engine:** Research Runtime Engine
- **Last governed Engine transition:** 2026-08-03
- **Lifecycle:** `Signal → Candidate → Queue → Selected → Reading → Analysis → Research Note → Knowledge → Architecture → Specification → Publication → Release`

## Queue policy

Each Engine run may advance an eligible item by exactly one lifecycle transition. No item may skip a stage. Evidence insufficiency returns an item to `Queue` with a blocker and explicit next action.

The latest queue priorities originate from Weekly 003 and its commit-verified run record. Historical labels such as `Hold` and `Backlog` are preserved here as `Queue` entries with blockers because they are scheduling decisions, not additional Research OS lifecycle states.

## Current queue

| ID | Research object | Priority | Current state | Evidence basis | Blocker | Next governed action |
|---|---|---:|---|---|---|---|
| Q-W003-01 | WorkBoundaryContract and OwnershipLedger | P0 | **Reading** | Weekly 003 plus three evidence-validated Daily 003 notes | None at Reading entry | Perform boundary-field comparison and decide `Reading → Analysis` in a later Engine run. |
| Q-W003-02 | CompletionVerifier and EvidenceEnvelope | P0 | Selected | Weekly 003 queue decision and completion/evidence gaps across all three Daily notes | Minimal ownership dimensions should be stabilized first | Open a bounded Deep Reading package after Q-W003-01 establishes the boundary baseline. |
| Q-W003-03 | Human authority lifecycle node | P0 | Selected | Weekly 003 autonomy-versus-authority contradiction | Authority fields and ownership transition semantics remain coupled to Q-W003-01 | Open Deep Reading focused on approval, resume, timeout, and rejection evidence. |
| Q-W003-04 | Comparative boundary experiment | P1 | Queue | Weekly 003 engineering sequence | Experiment contract depends on Q-W003-01 through Q-W003-03 | Refine scope after the semantic objects reach Analysis. |
| Q-W003-05 | A2A–FCoP external bridge | P2 | Queue | Weekly 003 reprioritization | Ownership and acceptance semantics are not stable | Remain queued; reconsider after boundary contract analysis. |
| Q-W003-06 | General MCP skills/tasks integration | P2 | Queue | Weekly 003 reprioritization | Host-side work contract is not stable | Remain queued; do not start implementation research. |
| Q-W003-07 | Unrestricted computer-use runtime | P2 | Queue | Weekly 003 reprioritization | Controlled local case and deterministic validator are not defined | Remain queued; begin only with a bounded application case. |
| Q-W003-08 | Full Digital Employee Studio | P3 | Queue | Weekly 003 reprioritization | Runtime semantic proof is incomplete | Remain queued until the control-plane model is tested. |

## Governed transition — 2026-08-03

```yaml
transition:
  item_id: Q-W003-01
  item: WorkBoundaryContract and OwnershipLedger
  priority: P0
  from: Selected
  to: Reading
  skill: Skill 03 — Deep Reading
  reading_record: research/reading/Q-W003-01-work-boundary-contract.md
  evidence_added: false
  source_trace_preserved: true
  publication_created: false
  stages_skipped: false
  decision: advance
```

### Selection rationale

Q-W003-01 was advanced before the other P0 items because Weekly 003 explicitly identifies it as the shared prerequisite for computer operation, MCP, A2A, manager orchestration, handoff, completion verification, and human authority semantics.

Only this item advanced. All other entries retain their prior lifecycle state.

## Source trace

- `docs/en/research/weekly/weekly-003.md`
- `docs/zh/research/weekly/weekly-003.md`
- `research/weekly-synthesis/2026-08-02/RUN-RECORD.md`
- `research/production-tests/production-test-v1/REPORT.md`
- `research/production-tests/production-test-v1/RUNTIME-RECORD.md`
- `research/reading/Q-W003-01-work-boundary-contract.md`

## Next Engine action

On the next eligible Engine run, Q-W003-01 may move from `Reading` to `Analysis` only when the reading record is checked against the five boundary types and the minimal invariant set can be stated without unsupported implementation assumptions. Otherwise it must return to `Queue` with a specific evidence request.
