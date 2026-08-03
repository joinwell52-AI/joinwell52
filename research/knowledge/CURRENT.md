# Research Knowledge — Current State

- **Repository:** `joinwell52-AI/joinwell52`
- **Operating system:** Research Operating System V2
- **Stage:** Knowledge
- **Last Knowledge Stage run:** 2026-08-03
- **Last Architecture Gate run:** 2026-08-03
- **Evidence rule:** only completed, evidence-validated Research Notes may create or extend a Knowledge record
- **Promotion rule:** architecture candidates remain at Knowledge until the Architecture Gate verifies their stated evidence threshold
- **Latest gate record:** `research/architecture/gates/2026-08-03-accountable-work-boundaries.md`

## Current Knowledge records

| ID | Knowledge object | Status | Validated inputs | Recurring findings | Architecture candidates | Record |
|---|---|---|---:|---:|---:|---|
| K-20260803-01 | Accountable Work Boundaries and Verifiable Completion | **Knowledge** | 6 | 7 | 5 | `research/knowledge/records/K-20260803-01-accountable-work-boundaries.md` |

## Active Knowledge links

```text
Position / owner / authority
→ WorkOrder and initial state
→ typed work boundary
→ execution evidence
→ completion claim
→ independent verification
→ accepted outcome or governed recovery
```

### Linked research objects

- Computer Use Daily 003 ↔ OSWorld Academic Observation 001
- A2A/MCP Daily 003 ↔ TMPA external protocol boundary and FCoP coordination scope
- Manager/Handoff Daily 003 ↔ CodeFlowMu PM orchestration, typed delegation and FCoP custody evidence
- NIST AI RMF Academic Observation 001 ↔ Position/WorkOrder governance context and authority decisions
- SWE-bench Verified Academic Observation 001 ↔ CodeFlowMu benchmark task admission, evaluator governance and completion evidence
- Weekly 003 ↔ WorkBoundaryContract, OwnershipLedger, EvidenceEnvelope and CompletionVerifier research queue

## Architecture candidates held at Knowledge

| Candidate | Name | Status | Main blocker | Promotion evidence required |
|---|---|---|---|---|
| AC-K003-01 | Work Boundary Control Plane | **Knowledge — returned for Analysis** | no completed Analysis record, minimal-invariant proof or four-path reconstruction experiment | complete Q-W003-01 Analysis, five-boundary comparison, four-path experiment design and projection mapping |
| AC-K003-02 | Evidence Envelope and Completion Verifier | Knowledge candidate | concrete evidence variants not yet tested | two executable validators that detect false-positive completion |
| AC-K003-03 | Human Authority Decision Node | Knowledge candidate | approval, enforcement and business authority are not yet separated | modeled approval/rejection/timeout/revocation/resume with idempotency |
| AC-K003-04 | Versioned Work Verification Contract | Knowledge candidate | deterministic versus human predicates unresolved | reproducible computer-use and engineering cases from frozen manifests |
| AC-K003-05 | Control Plane / Work Runtime Contract | Knowledge candidate | minimum SME-first contract not yet proven | read-only Open Dev Team projection plus one non-development case |

No candidate has been promoted to Architecture, Specification, Publication or Release.

## Architecture Gate result — 2026-08-03

The Gate reviewed all five candidates and selected `AC-K003-01` for a formal decision.

```yaml
architecture_gate:
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

The cross-source evidence is sufficient for an Analysis-stage comparison but not for an architecture decision. The candidate must compare five boundary types, identify a minimal invariant set, design a four-path reconstruction experiment, map facts across TMPA/FCoP/CodeFlowMu, and state falsification criteria before returning to the Gate.

## Source validation basis

The six input publications were validated by Research OS Engine Production Test V1. The production report records passage through all eight Research Skills, repository CI, correction of a real publication defect, merge to `main`, release-commit verification and direct main-file verification.

Primary provenance:

- `research/production-tests/production-test-v1/REPORT.md`
- `research/production-tests/production-test-v1/RUNTIME-RECORD.md`
- `research/production-tests/production-test-v1/RELEASE-CHECKLIST.md`
- release commit `22927bbb77f7bd4a47150a6bb8c5f00ccf0b1bf1`

## Lifecycle result — 2026-08-03

```yaml
knowledge_stage:
  reviewed_publications: 6
  accepted_validated_inputs: 6
  new_knowledge_objects: 1
  architecture_candidates: 5
  promoted_to_architecture: 0
  source_publications_modified: 0
  queue_items_advanced: 0
architecture_gate:
  candidates_reviewed: 5
  governed_decisions: 1
  returned_for_analysis: 1
  promoted_to_architecture: 0
  queue_transition_executed: 0
```

## Next action

The Research Runtime Engine retains Q-W003-01 in `Reading`. Its next eligible transition is `Reading → Analysis`, where it must produce the five-boundary comparison, minimal invariant classification, four-path experiment design, projection map and falsification criteria required by Gate `AG-20260803-01`.

The Architecture Gate must not reconsider AC-K003-01 until that Analysis record exists. Future Knowledge runs should append new records rather than silently rewriting source publications or converting hypotheses into architecture decisions.
