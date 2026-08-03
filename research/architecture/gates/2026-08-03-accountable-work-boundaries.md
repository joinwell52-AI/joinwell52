---
schema: "research-architecture-gate/v1"
id: "AG-20260803-01"
date: "2026-08-03"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
knowledge_record: "K-20260803-01"
reviewed_candidates:
  - "AC-K003-01"
  - "AC-K003-02"
  - "AC-K003-03"
  - "AC-K003-04"
  - "AC-K003-05"
selected_candidate: "AC-K003-01"
decision: "return_for_analysis"
candidate_state_before: "Knowledge"
candidate_state_after: "Knowledge"
linked_queue_item: "Q-W003-01"
linked_queue_state: "Reading"
next_lifecycle_state: "Analysis"
evidence_status: "sufficient_for_analysis_not_architecture"
architecture_promotion: "denied"
specification_change: false
publication_change: false
---

# Architecture Gate AG-20260803-01

## Decision summary

The Architecture Gate reviewed all five evidence-backed candidates in `K-20260803-01` and selected one candidate for a governed decision:

```text
AC-K003-01 — Work Boundary Control Plane
Knowledge → Knowledge (retained)
Gate disposition: Return for additional Analysis
Linked research path: Q-W003-01 remains Reading
Next eligible Engine transition: Reading → Analysis
```

**No candidate advances to Architecture, Specification, Publication or Release in this gate run.**

The evidence is strong enough to justify a bounded Analysis-stage comparison, but it does not satisfy the candidate's published architecture-promotion threshold. The Gate therefore preserves the candidate at Knowledge and issues an Analysis requirement rather than converting a recurring finding into an architecture decision.

## Admission basis

The Gate admitted only source-traceable material already recorded by Research OS:

- `research/knowledge/records/K-20260803-01-accountable-work-boundaries.md`;
- `research/knowledge/CURRENT.md`;
- `research/reading/Q-W003-01-work-boundary-contract.md`;
- `research/queue/CURRENT.md`;
- the six evidence-validated Production Test V1 Research Notes referenced by the Knowledge record;
- `docs/en/digital-employee/architecture.md`;
- TMPA Core Specification S0.3;
- Weekly 003 and its verified runtime record.

No new vendor announcement, unsupported observation or unvalidated queue signal was used as architecture evidence.

## Candidate review

| Candidate | Evidence strength | Promotion requirement | Gate finding | Disposition |
|---|---|---|---|---|
| `AC-K003-01` Work Boundary Control Plane | Cross-supported by three validated Daily notes, Weekly 003, the Reading record, Digital Employee V0.2 and TMPA governance semantics | Complete Q-W003-01 Reading and Analysis; prove a minimal invariant set through a multi-path comparison | Reading is complete enough to open Analysis, but no Analysis record or four-path proof exists | **Return for Analysis; remain Knowledge** |
| `AC-K003-02` Evidence Envelope and Completion Verifier | Strong conceptual support from computer-use, OSWorld, SWE-bench, NIST and Weekly 003 | Two executable validators must detect false-positive completion | No executable validator result is recorded | Remain Knowledge |
| `AC-K003-03` Human Authority Decision Node | Supported by computer-use, NIST, TMPA role semantics and Digital Employee completion rules | Model approval, rejection, timeout, revocation and resume with idempotency | Authority categories and duplicate-action prevention remain unresolved | Remain Knowledge |
| `AC-K003-04` Versioned Work Verification Contract | Supported by OSWorld, SWE-bench and completion-evidence research | Reproducible computer-use and CodeFlowMu cases from frozen manifests | No paired reproducible cases exist | Remain Knowledge |
| `AC-K003-05` Control Plane / Work Runtime Contract | Supported by Digital Employee V0.2, control-plane research and NIST | Read-only Open Dev Team projection plus one non-development case | Neither required projection has been validated | Remain Knowledge |

## Why AC-K003-01 was selected

AC-K003-01 is the dependency-bearing candidate. The other four candidates require stable answers to at least some of the following questions:

- who owns the parent work;
- who controls the next action;
- who owns mutable runtime state;
- who may claim completion;
- who may verify and accept completion;
- who owns retry, compensation and escalation.

The Reading record already distinguishes computer operation, MCP capability calls, manager-to-specialist work, handoff and A2A delegation. That is enough to authorize systematic comparison. It is not enough to freeze fields, create a TMPA document type or authorize CodeFlowMu implementation.

## Architecture judgment

The Gate accepts the following as a **Knowledge-level recurring finding**:

> A work boundary must preserve accountable ownership, authority, evidence and completion facts across heterogeneous execution paths.

The Gate does **not** yet accept the stronger architecture claim that one universal `WorkBoundaryContract` and one `OwnershipLedger` schema are the correct implementation.

Three alternatives remain live and must be compared in Analysis:

1. one shared invariant envelope plus boundary-specific extensions;
2. separate typed contracts projected into one ownership view;
3. no new canonical object, using deterministic projection from existing WorkOrder, FCoP, TMPA and runtime events.

The Analysis must determine whether the candidate adds a necessary semantic layer or merely duplicates existing workflow and governance objects.

## Required Analysis package

Before this candidate can return to the Architecture Gate, `Q-W003-01` must produce an explicit Analysis record containing all of the following.

### 1. Five-boundary comparison

Compare the same ownership and acceptance questions across:

1. controlled computer operation;
2. MCP capability call;
3. manager-to-specialist subtask;
4. explicit handoff;
5. A2A external delegation.

### 2. Minimal invariant test

For each boundary, test whether the following proposed dimensions are necessary, derivable or inapplicable:

- boundary type and version;
- parent WorkOrder and Operation Node;
- work owner before and after;
- control owner before and after;
- state owner;
- authority source or decision reference;
- expected output and exclusions;
- evidence contract;
- completion claimant;
- completion verifier and final acceptor;
- retry, timeout, compensation and escalation owner;
- return condition;
- idempotency key and duplicate-action rule.

### 3. Four-path reconstruction experiment design

Define a bounded experiment for at least four materially different paths:

- manager subtask without ownership transfer;
- handoff with explicit active-ownership transfer;
- controlled computer operation with retained WorkOrder ownership;
- external delegation with remote execution and local acceptance.

MCP capability execution must be retained as a non-transfer control case even if it is not one of the four implementation paths.

### 4. Projection comparison

For every proposed field, identify whether it should be:

- a TMPA Core semantic;
- a TMPA profile semantic;
- an FCoP coordination fact;
- a CodeFlowMu runtime event;
- a derived read model;
- or excluded as debugging-only trace data.

### 5. Falsification criteria

The Analysis must reject or narrow AC-K003-01 if:

- existing records reconstruct the required ownership facts without ambiguity;
- the proposed layer becomes a second workflow engine;
- one invariant schema erases essential differences between contribution, capability use, handoff and external delegation;
- recovery cannot prevent duplicate consequential actions;
- or verifier/acceptor separation cannot be represented without circular authority.

## Affected architecture surfaces

### TMPA

**Current impact:** no Core change and no new normative document type.

Potential future impact is limited to determining whether work-boundary and ownership facts belong in a TMPA profile, are projected from existing governance objects, or require a future Core revision. Any future proposal must preserve:

- role and authority semantics;
- lifecycle legality and separation of duties;
- immutable evidence and conflict preservation;
- `valid`, `invalid` and `undetermined` governance judgments;
- deterministic reconstruction from persistent source evidence;
- Core/profile separation and versioned conformance evidence.

The Gate explicitly rejects treating a runtime implementation convenience as a TMPA Core requirement.

### Digital Employee

**Current impact:** the candidate may refine the boundary between `Operation Node` and replaceable execution adapters, but it does not alter the Position-centric architecture.

The Analysis must preserve:

- Position as the stable organizational contract;
- WorkOrder as the bounded request;
- Operation Node as the smallest business-meaningful and verifiable unit;
- CodeFlowMu as the Work Runtime;
- the distinction between Tool Call, Run and governed Outcome;
- the completion conjunction across business, runtime, coordination, publication, verification and human-authority states.

A future architecture decision may introduce a typed execution-boundary contract, but it must not move organizational authority into a provider adapter or model session.

### CodeFlowMu

**Current impact:** no implementation authorization.

The required experiment should reuse current mechanisms before adding new Core structures:

- PM orchestration for retained parent ownership;
- explicit handoff events for transferred active ownership;
- FCoP TASK, REPORT, REVIEW and lifecycle evidence;
- QA/EVAL as candidate independent verification;
- ADMIN approval as final or exceptional authority;
- timeout, HOLD, retry, wake and recovery paths;
- runtime logs as source evidence, separated from semantic events and formal governance objects.

The Analysis must test whether deterministic projections from these mechanisms are sufficient. A new ledger is justified only when the existing evidence cannot reconstruct ownership and acceptance without ambiguity.

## Unresolved risks

1. **Second workflow engine:** a boundary control layer may duplicate WorkOrder, FCoP and runtime state machines.
2. **Schema flattening:** one schema may erase the difference between contribution, capability execution, handoff and external delegation.
3. **Authority conflation:** work owner, credential authority, policy enforcer, completion verifier and business acceptor may be incorrectly collapsed.
4. **Nested-boundary ambiguity:** parent, child and acceptance ownership may diverge across multiple levels.
5. **Duplicate consequential action:** retry, resume or compensation may repeat an external side effect.
6. **Evidence over-collection:** immutable evidence requirements may capture unnecessary sensitive interface or business data.
7. **Verifier circularity:** the actor that performs work may indirectly control its own verifier or evaluator version.
8. **Protocol overreach:** A2A or MCP transport features may be mistaken for organizational accountability semantics.
9. **TMPA scope creep:** runtime projection details may be promoted prematurely into portable Core requirements.
10. **Unproven portability:** the model may fit the Open Dev Team but fail for a materially different Digital Employee.

## Governed lifecycle result

```yaml
architecture_gate:
  reviewed_candidates: 5
  selected_for_decision: AC-K003-01
  decision: return_for_analysis
  candidate_transition: Knowledge -> Knowledge
  architecture_promotions: 0
  specification_promotions: 0
  publication_promotions: 0
  linked_queue_item: Q-W003-01
  linked_queue_state_after_gate: Reading
  next_eligible_engine_transition: Reading -> Analysis
  source_notes_modified: 0
```

The Gate records the required next lifecycle state but does not execute the Engine transition. The single execution engine remains responsible for moving `Q-W003-01` from `Reading` to `Analysis` in a later governed run.

## Next gate condition

AC-K003-01 may be reviewed again only after:

- an Analysis record completes the five-boundary comparison;
- the minimal invariant set is explicit;
- a four-path reconstruction experiment is designed with falsification criteria;
- TMPA, FCoP and CodeFlowMu projection boundaries are mapped;
- and unresolved authority, idempotency and verifier-separation risks are either resolved or made testable.

Until then, the authoritative state is:

```text
AC-K003-01: Knowledge
Q-W003-01: Reading
Architecture promotion: denied
Next lifecycle target: Analysis
```
