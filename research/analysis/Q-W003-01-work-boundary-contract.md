---
schema: "research-analysis/v1"
id: "AN-20260804-01"
date: "2026-08-04"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-W003-01"
research_object: "WorkBoundaryContract and OwnershipLedger"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
evidence_status: "validated-source-package"
next_state: "Research Note"
next_state_authorized: false
publication_authorized: false
---

# Research Analysis — Q-W003-01 WorkBoundaryContract and OwnershipLedger

## Governed transition

This record executes exactly one Research OS lifecycle transition:

```text
Q-W003-01
Reading → Analysis
```

The transition is authorized by the completed Reading record and by Architecture Gate `AG-20260803-01`, which found the source package sufficient for Analysis but insufficient for Architecture. No Research Note, Architecture, Specification, Publication or Release is created in this run.

## Skill invocation

**Invoked:** `Skill 04 — Research Analysis`

The analysis preserves the required separation between observation, discussion, research judgment and engineering impact. Every judgment below is traceable to the validated source package or is explicitly marked as an inference.

## Evidence package

Primary governed inputs:

1. `research/reading/Q-W003-01-work-boundary-contract.md`
2. `research/architecture/gates/2026-08-03-accountable-work-boundaries.md`
3. `docs/en/research/weekly/weekly-003.md`
4. `docs/en/digital-employee/2026-08-02-computer-use-action-state-loop.md`
5. `docs/en/industry/2026-08-02-a2a-mcp-interoperability-boundaries.md`
6. `docs/en/engineering/2026-08-02-manager-handoff-ownership-models.md`
7. `research/production-tests/production-test-v1/REPORT.md`
8. `research/production-tests/production-test-v1/RUNTIME-RECORD.md`

No new external source is introduced. The three Daily notes and Weekly 003 were previously passed through the complete Research Skills pipeline and commit verification.

## Analysis

```yaml
analysis:
  observations:
    - Five boundary types share a need for explicit work identity, operation type, expected output, evidence, completion claim and independent acceptance.
    - They do not share the same ownership transition: computer operation, MCP capability use and manager subtask normally retain parent ownership; handoff transfers active ownership for a bounded scope; A2A delegates remote execution while local acceptance may remain with the caller.
    - A single state_owner field is insufficient because authoritative business state, remote task state and local evidence state can belong to different systems.
    - Progress reporting, completion claiming, verification and final acceptance are distinct responsibilities.
    - Retry and resume are governance operations when an external side effect may be repeated.
  cross_comparison:
    - controlled computer operation
    - MCP capability call
    - manager-to-specialist subtask
    - explicit handoff
    - A2A external delegation
  discussion:
    - A minimal shared invariant envelope is plausible, but boundary-specific extensions remain necessary.
    - Existing WorkOrder, FCoP and runtime events may provide part of the required facts, but the current evidence does not prove deterministic reconstruction across all five paths.
    - The candidate must remain a research hypothesis until a reconstruction experiment tests whether a new canonical object adds information rather than duplicating the workflow engine.
  research_judgment:
    - The evidence supports a typed boundary-analysis model, not yet a universal normative WorkBoundaryContract schema.
    - The strongest current hypothesis is one minimal shared invariant envelope plus typed boundary extensions and derived ownership views.
    - OwnershipLedger should remain a derived-view hypothesis unless experiments show that existing append-only events cannot reconstruct ownership and acceptance without ambiguity.
  engineering_impact:
    - TMPA Core is unchanged; possible future placement is a profile semantic or deterministic projection.
    - Digital Employee Position and WorkOrder remain the authority and scope anchors.
    - CodeFlowMu should first instrument and reconstruct current PM, handoff, FCoP, QA/EVAL, ADMIN and recovery paths before adding a second state machine.
  limitations:
    - No four-path execution experiment has been run.
    - No executable validator has tested false-positive completion.
    - Nested delegation, cancellation, timeout, privacy and duplicate-action handling remain unresolved.
  future_questions:
    - Can existing records reconstruct all ownership dimensions deterministically?
    - Which fields are portable governance semantics and which are runtime-specific projections?
    - What is the minimum evidence needed to prevent self-acceptance and duplicate consequential action?
```

## 1. Five-boundary comparison

| Dimension | Controlled computer operation | MCP capability call | Manager → specialist subtask | Explicit handoff | A2A external delegation |
|---|---|---|---|---|---|
| Boundary meaning | Runtime executes a proposed GUI action against an application | Host invokes a typed capability exposed by a server | Parent owner requests bounded contribution | Active responsibility transfers for a declared scope | Caller delegates meaningful work to an independently operated Agent service |
| Parent work owner after boundary | Usually unchanged | Usually Host / parent workflow | Manager remains parent owner | May change for transferred scope | Caller retains local WorkOrder and acceptance ownership; remote Agent owns delegated execution |
| Active control owner | Execution harness within policy | Host orchestrator, with server controlling capability internals | Manager | Receiving Agent within policy | Remote Agent service for delegated task |
| Authoritative business state | Target application | Host workflow plus capability result; external system if mutated | Parent workflow | Shared run / receiving workflow | Remote task and artifact state plus caller-side local state |
| Evidence state | Runtime evidence store | Host and server records | Parent record plus specialist report | Shared run and handoff event | Remote artifacts/status plus caller-side receipt and verification |
| Completion claimant | Worker/runtime may claim operation success | Host workflow may claim capability success | Specialist claims subtask; manager claims parent completion | Receiving Agent claims transferred scope | Remote Agent reports task state/artifacts |
| Completion verifier | Task-specific validator or human gate | Host-side business validator | Manager, QA or release gate | Defined downstream gate or returning owner | Caller-side acceptance validator |
| Ownership transfer default | No | No | No | Yes, for explicit scope | Execution ownership yes; final acceptance usually no |
| Main failure if flattened | Last click treated as business completion | Tool result treated as accountable work completion | Contribution treated as parent closure | Transfer hidden as generic tool call | Remote self-report treated as local acceptance |

### Observation

The shared problem is not transport. It is preserving who owns work, control, state, authority, evidence, completion claims and acceptance when execution crosses a boundary.

### Discussion

The matrix falsifies the idea that all boundaries can be represented as the same generic “tool call.” It also falsifies the opposite idea that every boundary requires a completely unrelated model. Several facts recur, while ownership-transfer and state-authority rules differ.

### Research judgment

**Inference from the validated comparison:** a common envelope is justified only for recurrent invariants; the operation-specific semantics must remain typed extensions. A universal flat schema would erase the distinction between contribution, capability invocation, active handoff and external accountable delegation.

## 2. Minimal invariant test

The Architecture Gate required every proposed dimension to be classified as necessary, derivable or inapplicable.

| Proposed dimension | Classification | Analysis rationale |
|---|---|---|
| Boundary type and version | **Necessary** | Without a typed operation, contribution, handoff, capability use and external delegation cannot be reconstructed reliably. |
| Parent WorkOrder and Operation Node | **Necessary reference** | Binds the boundary to the organizational request and smallest verifiable business unit; exact object names may remain Digital Employee / CodeFlowMu-specific. |
| Work owner before and after | **Necessary semantic; may be derived only when proof is deterministic** | Required to distinguish retained responsibility from transfer. Event order alone is insufficient when nested or remote work exists. |
| Control owner before and after | **Necessary for active execution boundaries** | Needed to determine who may choose the next action and apply runtime policy. |
| State owner | **Must be split, not kept as one flat field** | At minimum distinguish authoritative business state, execution/task state and evidence custody. |
| Authority source or decision reference | **Necessary for consequential or restricted actions; optional reference for pre-authorized low-risk work** | Authority cannot be inferred from model access or tool availability. |
| Expected output and exclusions | **Necessary** | Defines what success means and what the receiving party must not do. |
| Evidence contract | **Necessary** | Required for independent verification and deterministic reconstruction. |
| Completion claimant | **Necessary** | The actor reporting success must be identifiable. |
| Completion verifier and final acceptor | **Necessary; may be the same role only when policy explicitly permits it** | Prevents self-acceptance and separates technical validation from business release authority. |
| Retry owner | **Necessary when retry is possible** | Determines who may repeat work and under which evidence. |
| Timeout, compensation and escalation owner | **Typed extension** | Not every boundary supports all three, but any supported recovery path must declare ownership. |
| Return condition | **Necessary for subtask, handoff and delegation; inapplicable only to terminal local operations** | Defines how control or evidence returns to the parent path. |
| Idempotency key and duplicate-action rule | **Necessary for consequential or replayable external effects** | A resumed run must prove it will not repeat a side effect. Pure read-only work may use an explicit `not_required` classification. |

### Minimal shared invariant envelope — analysis hypothesis

```yaml
boundary_invariant:
  boundary_id:
  boundary_type:
  boundary_version:
  parent_work_order_ref:
  operation_node_ref:
  scope:
  work_owner_before:
  work_owner_after:
  control_owner_before:
  control_owner_after:
  authority_ref:
  expected_output_contract:
  exclusions:
  evidence_contract_ref:
  completion_claimant:
  completion_verifier:
  final_acceptor:
  return_or_terminal_condition:
  duplicate_action_rule:
```

Typed extensions may add application state references, MCP request/result identifiers, specialist subtask records, handoff context packages, A2A Task/Artifact identifiers, timeout, cancellation, compensation and remote retry semantics.

This is an **Analysis-stage hypothesis**, not a specification.

## 3. Alternative model comparison

### Alternative A — one universal contract and one canonical ledger

**Benefit:** uniform query and audit surface.

**Risk:** becomes a second workflow engine, duplicates WorkOrder/FCoP/runtime state, and flattens boundary differences.

**Current finding:** not supported.

### Alternative B — separate typed contracts projected into one ownership view

**Benefit:** preserves boundary semantics while supporting a common read model.

**Risk:** schema proliferation and inconsistent field meanings.

**Current finding:** viable.

### Alternative C — no new canonical contract; derive everything from existing events

**Benefit:** minimal new machinery and lower scope risk.

**Risk:** ambiguous reconstruction if events omit operation type, before/after owners, authority or verifier facts.

**Current finding:** must be tested before any new ledger is authorized.

### Research judgment

The leading hypothesis is a constrained form of Alternative B:

> Use a minimal shared invariant envelope, attach typed boundary extensions, and generate an Ownership View from append-only events. Do not authorize a new canonical OwnershipLedger until deterministic reconstruction from existing records has failed under controlled tests.

## 4. Four-path reconstruction experiment design

### Bounded business case

Use one controlled local business application with a seeded record and an executable final-state validator. The task is:

```text
Locate customer case C-1042, update the approved status field from Pending Review to Verified,
attach the supplied evidence reference, and return a durable completion receipt.
```

The environment must provide a known initial state, a unique operation key, readback verification, reset capability and an audit log.

### Path A — manager subtask without ownership transfer

- PM retains parent WorkOrder ownership.
- Specialist prepares or performs the bounded update as an assigned subtask.
- Specialist submits evidence and a subtask completion claim.
- PM integrates; QA or validator verifies; PM/ADMIN retains parent acceptance authority.

### Path B — explicit handoff with active-ownership transfer

- PM records a typed handoff for the operation scope.
- Receiving Agent becomes active work and control owner for the transferred scope.
- Context package, authority, return condition and verifier are explicit.
- The experiment tests whether parent and transferred-scope ownership can be reconstructed independently.

### Path C — controlled computer operation with retained WorkOrder ownership

- Local owner retains the WorkOrder.
- Computer-use adapter executes the GUI operation in an isolated environment.
- Pre-state, proposed action, policy decision, execution result, post-state and validator result are recorded.
- Resume after an injected interruption must not repeat the update.

### Path D — external delegation with remote execution and local acceptance

- Caller records an external delegation contract.
- Remote service owns the delegated execution and returns task state plus artifact/receipt.
- Caller reads back the authoritative business state and performs local acceptance.
- The experiment tests whether remote `completed` can be rejected locally when the final state is wrong.

### Non-transfer control — MCP capability call

- The Host invokes a bounded update capability.
- Host retains parent work ownership and final acceptance.
- Server result is treated as capability evidence, not an independent work acceptance.

### Required measurements

1. Can current owner, active controller, claimant, verifier and final acceptor be reconstructed after every event?
2. Can the system distinguish contribution from ownership transfer?
3. Does an interruption and resume repeat the consequential action?
4. Does a false remote or specialist success claim fail the independent validator?
5. Can the complete result be reconstructed from persistent evidence without reading conversational narrative?
6. Which proposed invariant fields were never used, and which missing fields caused ambiguity?

### Pass condition

A path passes only when ownership and acceptance are reconstructed deterministically, final business state is independently validated, and retry/resume does not duplicate the update.

## 5. Projection comparison

The following placement is provisional and must be validated by the experiment.

| Fact | Provisional placement | Reason |
|---|---|---|
| Role, authority source, separation of claimant/verifier/acceptor | TMPA profile candidate; no Core change | Portable governance meaning, but current evidence is insufficient for Core normalization. |
| Lifecycle legality, immutable evidence, conflict and `undetermined` judgment | Existing TMPA Core semantics | Already governing principles; no new boundary object required. |
| Boundary type and ownership-transfer declaration | TMPA profile or interoperable runtime contract candidate | May need portability across Digital Employee runtimes. |
| Position, WorkOrder, Operation Node | Digital Employee architecture | Organizational and business-work anchors. |
| TASK/REPORT/REVIEW custody and lifecycle transitions | FCoP coordination facts | Durable internal team evidence, but not the complete ownership model. |
| Proposed action, tool call, handoff event, remote task update, retry, timeout | CodeFlowMu runtime events | Execution-specific facts. |
| Current owner, contributors, pending subtask owners, claimant/verifier status | Derived read model | Should be reconstructed from source events rather than become another writable state machine. |
| Screenshots, raw traces and verbose model context | Evidence or debugging store under retention policy | Not all trace data is a portable governance semantic. |

### Research judgment

No evidence currently justifies moving runtime adapter details into TMPA Core. The safest direction is to preserve portable governance semantics at the profile level and keep execution mechanics in versioned runtime events, with deterministic derived views.

## 6. Falsification criteria

AC-K003-01 must be rejected, narrowed or returned to Reading if any of the following is observed:

1. Existing WorkOrder, FCoP and runtime records reconstruct all required ownership and acceptance facts without ambiguity across all paths; in that case, no new canonical contract or ledger is needed.
2. The proposed boundary layer owns scheduling, lifecycle progression or mutable workflow state; in that case, it has become a second workflow engine.
3. One invariant schema cannot preserve the distinction between capability invocation, contribution, handoff and external delegation.
4. Resume, retry or compensation cannot prove that a consequential side effect will not be duplicated.
5. The completion claimant can select, modify or bypass its own verifier without an independent authority event.
6. Evidence requirements force unnecessary collection of sensitive application state when a smaller proof is sufficient.
7. The model works only for the Open Dev Team and fails a materially different Digital Employee case.

## 7. Engineering impact

### TMPA

- No Core modification is authorized.
- Preserve Core/profile separation, deterministic reconstruction, separation of duties, immutable evidence, conflict preservation and three-valued governance judgment.
- The experiment should determine whether boundary semantics are a profile, a projection or unnecessary duplication.

### Digital Employee

- Position remains the stable organizational contract.
- WorkOrder remains the bounded request.
- Operation Node remains the smallest business-meaningful and verifiable unit.
- Operational capability and organizational authority remain separate.
- Completion remains a conjunction of business state, runtime state, coordination evidence, verification and required human authority.

### CodeFlowMu

- No implementation authorization for a new ledger or control plane is granted.
- Instrument current PM orchestration, explicit handoff, FCoP custody, QA/EVAL, ADMIN authority and recovery events.
- Build the Ownership View as a read-only projection first.
- Add new canonical events only where the reconstruction experiment demonstrates an actual information gap.

## 8. Status, blockers and next action

```yaml
status:
  queue_item: Q-W003-01
  state_before: Reading
  state_after: Analysis
  analysis_skill: completed
  evidence_traceability: preserved
  research_note_created: false
  architecture_promoted: false
  specification_created: false
  publication_created: false

blockers:
  - Four-path reconstruction experiment has not been executed.
  - Existing-event sufficiency has not been tested.
  - Duplicate-action prevention has not been demonstrated.
  - Verifier independence has not been tested with a false-positive claim.
  - Portability beyond the Open Dev Team has not been tested.

next_action:
  lifecycle_target: Research Note
  authorized_now: false
  requirement: Execute and record the reconstruction experiment, then decide whether the Analysis supports a bounded Research Note or requires return to Reading/Queue.
```

## Lifecycle decision

The evidence threshold for `Reading → Analysis` is met because the source package supports a systematic five-boundary comparison, explicit invariant classification, alternative-model analysis, experiment design, projection mapping and falsification criteria.

The evidence threshold for `Analysis → Research Note` is **not** yet met. The item remains in `Analysis` until the reconstruction experiment produces source-traceable results.