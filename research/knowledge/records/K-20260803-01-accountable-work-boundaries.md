---
schema: "research-knowledge-record/v1"
id: "K-20260803-01"
date: "2026-08-03"
timezone: "Asia/Shanghai"
title: "Accountable Work Boundaries and Verifiable Completion"
status: "Knowledge"
evidence_status: "validated"
source_snapshot_commit: "e771ca0e8af1ad296c0640d65a953ec60b1390f5"
architecture_promotion: "not_authorized"
repository: "joinwell52-AI/joinwell52"
---

# Knowledge Record K-20260803-01

## Scope and admission rule

This Knowledge record uses the six Research OS Engine Production Test V1 publications that passed Source Discovery, Research Triage, Deep Reading, Research Analysis, Research Writing, Visualization, Evidence & Citation, Publication Editing, repository CI, merge to `main`, and direct main-branch verification.

The record connects those validated Research Notes to related internal architecture material, primary papers, official repositories, protocol specifications, TMPA, the Digital Employee architecture, and CodeFlowMu. It does not revise a publication, freeze a schema, or promote any object to Architecture.

### Evidence-validated source notes

| Source object | Type | Validated judgment consumed here |
|---|---|---|
| `docs/en/digital-employee/2026-08-02-computer-use-action-state-loop.md` | Daily Research | GUI work is an externally governed action–state loop; the model proposes while a runtime executes, observes, authorizes, records and verifies. |
| `docs/en/industry/2026-08-02-a2a-mcp-interoperability-boundaries.md` | Daily Research | A2A and MCP may overlap operationally but center different ownership and accountability boundaries. |
| `docs/en/engineering/2026-08-02-manager-handoff-ownership-models.md` | Daily Research | A manager subtask and a handoff are different responsibility operations and must be recorded as different events. |
| `docs/en/digital-employee/2026-08-02-osworld-execution-verification.md` | Academic Observation | Work should be evaluated from a reproducible initial state through an executable final-state contract. |
| `docs/en/industry/2026-08-02-nist-ai-rmf-operating-loop.md` | Academic Observation | Govern, Map, Measure and Manage become operational only through persistent context, evidence, authority, decision and feedback records. |
| `docs/en/engineering/2026-08-02-swe-bench-verified-quality.md` | Academic Observation | Task, environment, tests, evaluator and human adjudication are part of the engineering system that determines whether a completion judgment is trustworthy. |

Validation provenance:

- `research/production-tests/production-test-v1/REPORT.md`
- release commit `22927bbb77f7bd4a47150a6bb8c5f00ccf0b1bf1`
- production runtime and release-checklist finalization records under `research/production-tests/production-test-v1/`

## Knowledge graph

```text
Position and accountable owner
        │
        ├── issues authority and policy context
        ▼
WorkOrder admission and initial-state contract
        │
        ├── enters a typed work boundary
        ▼
Execution adapter or receiving actor
  ├─ computer operation
  ├─ MCP capability
  ├─ manager subtask
  ├─ handoff
  └─ A2A external delegation
        │
        ├── emits observations, artifacts and lifecycle facts
        ▼
Evidence Envelope
        │
        ├── supports a completion claim
        ▼
Independent Completion Verifier
        │
        ├── accept / reject / retry / compensate / escalate
        ▼
Governed outcome and feedback
```

This graph links three previously separate concerns:

1. **organizational governance** — Position, owner, authority, policy and risk context;
2. **runtime execution** — work boundary, operation type, state, retry, handoff and recovery;
3. **acceptance governance** — evidence, evaluator version, completion claim, independent verification and final authority.

## Recurring findings

### KF-01 — A model action, runtime execution and business completion are different facts

The computer-use note distinguishes proposed action, authorized action, executed action, resulting application state and completion judgment. OSWorld independently reinforces the same separation by binding a task to an initial state, action environment and executable evaluator.

Reusable insight:

```text
intent ≠ attempted operation ≠ observed state ≠ accepted outcome
```

CodeFlowMu should therefore never infer completion from a tool return, report text or last action alone.

### KF-02 — Work ownership and control ownership may diverge

The manager pattern keeps parent ownership with the manager while a specialist contributes bounded work. A handoff changes the active actor and may transfer responsibility. A2A delegates work to an independently operated Agent service, while the caller still owns local acceptance. MCP normally leaves the Host in control of the larger workflow.

Reusable insight:

> Ownership is multidimensional. At minimum, the runtime must distinguish work owner, control owner, state owner, completion claimant and completion verifier.

### KF-03 — The party reporting progress must not automatically accept completion

Computer-use loops, remote A2A tasks, specialist reports and coding patches can all self-report success. OSWorld and SWE-bench Verified show why acceptance requires a separate evaluator whose environment, predicates and version are known.

Reusable insight:

```text
completion_claim
→ evidence_check
→ accept | reject | retry | compensate | escalate
```

This is a stronger and more reusable model than one terminal `done` flag.

### KF-04 — Authority is a durable lifecycle fact, not a prompt instruction

The computer-use note requires explicit human authority for consequential actions. NIST AI RMF requires accountable governance and management decisions tied to context and evidence. TMPA defines roles as governance authorities with permitted lifecycle actions and separation-of-duty constraints rather than persona labels.

Reusable insight:

> The applicable authority snapshot must be preserved with the run, including the approving role, scope, decision, validity and evidence references.

### KF-05 — Context transfer must be bounded and typed

Handoffs may forward history; remote delegation and capability calls cross trust boundaries; interface content may be untrusted. A complete transcript is therefore not a safe default context package.

Reusable insight:

A receiving actor should receive a versioned Context Package containing objective, accepted facts, authority snapshot, allowed tools and data, expected output, exclusions, evidence requirements, and return or escalation conditions.

### KF-06 — Evaluation artifacts are governed production objects

OSWorld and SWE-bench Verified both show that initial state, environment release, evaluator, tests and task curation determine the meaning of a result. NIST AI RMF adds the requirement that measurement must support an authorized management decision.

Reusable insight:

> Evaluators, benchmark manifests and validation predicates require versioning, review, provenance and lifecycle records; they are not incidental test utilities.

### KF-07 — Control Plane and Work Runtime are distinct but contract-bound

The active Digital Employee Architecture V0.2 separates the stable Position contract from replaceable execution providers and names CodeFlowMu as the Work Runtime. Related Daily research distinguishes fleet governance from per-WorkOrder execution.

Reusable insight:

The Control Plane should issue a bounded execution context; the Work Runtime should return structured lifecycle, evidence, cost, evaluation and unresolved-authority facts. Neither layer should silently redefine the other.

## Source-to-architecture links

### Primary papers, repositories and specifications

| Research source | External research object | Knowledge link |
|---|---|---|
| Computer-use Daily | OpenAI Computer use guide; Anthropic computer-use documentation | External harness, isolation, action authorization, fresh-state observation and high-impact approval belong to the Runtime boundary. |
| OSWorld Academic | OSWorld paper; `xlang-ai/OSWorld`; `xlang-ai/OSWorld-V2` | Reproducible initial state and executable final-state predicates provide the concrete verification model for computer-operation work. |
| A2A/MCP Daily | A2A Protocol v1.0 specification; MCP specification 2026-07-28 | Protocol selection follows accountability: independent delegated work versus Host-controlled capability integration. |
| Manager/Handoff Daily | OpenAI Agents SDK orchestration, handoff, guardrail and tracing documentation | Subtask, handoff, escalation and return require typed runtime events and distinct guardrail coverage. |
| NIST Academic | NIST AI RMF 1.0; AI RMF Playbook; NIST AI 600-1 | Governance context, measurement evidence and management decisions form a feedback loop around execution. |
| SWE-bench Academic | SWE-bench paper; `SWE-bench/SWE-bench`; SWE-bench Verified report | Acceptance quality depends on task validity, pinned environment, fair tests, evaluator correctness and human review. |

### TMPA links

The source notes align with the TMPA Core S0.3 distinction between semantic governance objects, physical source artifacts and reader-derived views.

| Knowledge requirement | TMPA Core connection | Open question |
|---|---|---|
| typed work-boundary event | governance object with document type, creator, responsible role, lifecycle and typed references | Should boundary semantics be a Core document type, a profile type, or a runtime projection? |
| authority snapshot | role assignment, permitted lifecycle actions and separation-of-duty validation | How should short-lived human approvals reference long-lived role assignments? |
| immutable evidence | published governance objects and source-preserving reconstruction | Which high-volume tool traces should be projected into semantic TMPA events rather than stored as governance objects? |
| completion claim and acceptance | separate document types must not overlap ambiguously in authority | Which profile defines claimant, verifier and final acceptance relations? |
| recovery and correction | new superseding, rejecting, qualifying or resolving objects rather than silent rewrite | How should retry and compensation preserve idempotency across external systems? |

No TMPA Core requirement is changed by this Knowledge record.

### Digital Employee links

Digital Employee Architecture V0.2 already defines:

- Position as the stable organizational contract;
- WorkOrder as a bounded request;
- Operation Node as the smallest business-meaningful and verifiable unit;
- CodeFlowMu as the Digital Employee Runtime;
- completion as a conjunction of business, runtime, coordination, publication, verification and human-authority states;
- experience promotion through candidate, review, regression and governed publication.

The validated notes strengthen four reusable additions for later architecture review:

1. a typed Work Boundary between Operation Node and heterogeneous execution adapters;
2. an immutable Authority Decision or authority snapshot reference;
3. an Evidence Envelope returned by every boundary;
4. an independent Completion Verifier bound to a versioned Work Verification Contract.

These are Knowledge-stage candidates only.

### CodeFlowMu links

The current CodeFlowMu direction can reuse existing mechanisms rather than replacing them:

| Existing mechanism | Knowledge interpretation | Required experiment |
|---|---|---|
| PM orchestration | manager retains parent work and integration ownership | compare a bounded DEV/QA subtask with an explicit ownership-transferring handoff |
| FCoP TASK / REPORT / REVIEW and lifecycle transitions | formal custody and coordination evidence | test whether current events can project work owner, control owner, claimant and verifier without changing FCoP Core |
| QA and EVAL | independent verification candidates | define executable final-state predicates and ensure the evaluator itself is reviewed |
| ADMIN approval | final or exceptional authority | represent approval, rejection, timeout and resume as durable lifecycle events |
| retry, HOLD, wake and recovery | recovery execution mechanisms | prove idempotency and no duplicate consequential action after resume |
| runtime logs and reports | source evidence | separate debugging traces from business-semantic events and formal governance objects |

## Architecture candidates

The following are created as **Architecture Candidates held at Knowledge**. None is an architecture decision, TMPA revision, frozen specification or implementation authorization.

### AC-K003-01 — Work Boundary Control Plane

**Candidate statement:** Introduce a semantic layer between WorkOrder/Operation Node and every execution adapter or receiving actor. It records boundary type and ownership transitions without becoming a second workflow engine.

**Evidence support:** all three validated Daily notes plus Weekly 003.

**Unresolved gate:** define the minimal invariant fields across computer operation, MCP capability, internal subtask, handoff and A2A delegation without flattening their semantics.

**Promotion requirement:** Q-W003-01 must complete Reading and Analysis; a four-path boundary experiment must show that the same invariant set improves reconstruction and recovery.

### AC-K003-02 — Evidence Envelope and Completion Verifier

**Candidate statement:** Every boundary returns structured observations, artifacts, state references and execution facts; a separately authorized verifier accepts or rejects the claimed outcome.

**Evidence support:** computer-use Daily, OSWorld Academic, SWE-bench Academic, NIST Academic and Weekly 003.

**Unresolved gate:** determine concrete variants for GUI state, capability result, specialist report, code patch and remote Agent artifact.

**Promotion requirement:** define at least two executable validators and demonstrate that they detect false-positive completion claims.

### AC-K003-03 — Human Authority Decision Node

**Candidate statement:** Consequential execution enters an explicit authority state with proposed action, context, decision role, result, expiry and resume semantics.

**Evidence support:** computer-use Daily, NIST Academic, TMPA role/authority model and the current completion conjunction in Digital Employee Architecture V0.2.

**Unresolved gate:** distinguish advisory review, policy enforcement, credential authorization and final business approval.

**Promotion requirement:** model approval, rejection, timeout, revocation and resumed execution, including duplicate-action prevention.

### AC-K003-04 — Versioned Work Verification Contract

**Candidate statement:** A WorkOrder binds initial-state assumptions, allowed actions, success predicates, forbidden side effects, evidence requirements, environment version and evaluator version.

**Evidence support:** OSWorld Academic and SWE-bench Academic, reinforced by computer-use and NIST evidence.

**Unresolved gate:** determine which predicates can be deterministic and where governed human judgment is required.

**Promotion requirement:** one controlled computer-use case and one CodeFlowMu engineering case must be reproducible from frozen manifests.

### AC-K003-05 — Control Plane / Work Runtime Contract

**Candidate statement:** The Control Plane issues a versioned execution context; CodeFlowMu returns structured execution, evidence, evaluation, cost and unresolved-authority facts.

**Evidence support:** Digital Employee Architecture V0.2, Position/ownership research, control-plane/work-runtime research and NIST Academic.

**Unresolved gate:** define the minimum contract without building an enterprise-scale registry before one complete Digital Employee lifecycle is proven.

**Promotion requirement:** implement a read-only projection for the current Open Dev Team and validate it against one non-development Digital Employee case.

## Contradictions and boundaries

1. **More operational autonomy does not imply more organizational authority.** Capability and authority must remain separate.
2. **Protocol feature convergence does not imply accountability convergence.** Task handles alone do not define who owns work or accepts completion.
3. **Rich context improves continuity but increases privilege and injection risk.** Context packages require explicit inclusion and exclusion rules.
4. **Central managers improve integration but can become bottlenecks.** Handoffs reduce central load but require explicit ownership, guardrails and return conditions.
5. **Executable evaluators strengthen evidence but can encode invalid assumptions.** Evaluators need review, positive controls, negative controls and versioning.
6. **TMPA reconstruction can preserve governance facts but does not itself execute runtime policy or verify semantic truth.** Runtime enforcement and independent validation remain separate concerns.

## Lifecycle result

```yaml
knowledge_stage:
  input_objects: 6
  validated_inputs: 6
  knowledge_records_created: 1
  recurring_findings: 7
  architecture_candidates_created: 5
  architecture_promotions: 0
  specification_changes: 0
  publication_changes: 0
  source_notes_modified: 0
```

The source Research Notes remain immutable publications. This record is a new Knowledge object that references them; it does not rewrite their conclusions or advance Q-W003-01 beyond `Reading`.

## Next governed actions

1. Research Runtime Engine continues Q-W003-01 from `Reading` only when its five-boundary comparison is sufficient for `Analysis`.
2. Research Architecture Gate may review AC-K003-01 through AC-K003-05, but must retain them at Knowledge until their individual promotion requirements are met.
3. CodeFlowMu experiments should begin with a controlled local application and a bounded manager/subtask case, not broad A2A, MCP or unrestricted computer-use integration.
4. Future Knowledge runs should add links only from newly evidence-validated Research Notes or from formal Reading/Analysis records with explicit provenance.

## Source trace

### Validated publication files

- `docs/en/digital-employee/2026-08-02-computer-use-action-state-loop.md`
- `docs/en/industry/2026-08-02-a2a-mcp-interoperability-boundaries.md`
- `docs/en/engineering/2026-08-02-manager-handoff-ownership-models.md`
- `docs/en/digital-employee/2026-08-02-osworld-execution-verification.md`
- `docs/en/industry/2026-08-02-nist-ai-rmf-operating-loop.md`
- `docs/en/engineering/2026-08-02-swe-bench-verified-quality.md`

### Internal architecture and governance files

- `docs/en/research/weekly/weekly-003.md`
- `docs/en/digital-employee/architecture.md`
- `docs/en/digital-employee/2026-08-02-position-ownership-authority.md`
- `docs/en/digital-employee/2026-08-02-control-plane-work-runtime.md`
- `docs/en/publications/tmpa-core-specification-s0.3.md`
- `docs/en/publications/tmpa-core-specification-s0.3/part-01.md`
- `research/reading/Q-W003-01-work-boundary-contract.md`
- `research/queue/CURRENT.md`
- `research/production-tests/production-test-v1/REPORT.md`

### External source objects inherited from validated notes

- OpenAI Computer use guide
- Anthropic Computer use documentation
- OSWorld paper and official repositories
- A2A Protocol v1.0 documentation and specification
- Model Context Protocol specification 2026-07-28
- OpenAI Agents SDK orchestration, handoff, guardrail and tracing documentation
- NIST AI RMF 1.0, AI RMF Playbook and NIST AI 600-1
- SWE-bench paper, official repository/evaluation harness and SWE-bench Verified report
