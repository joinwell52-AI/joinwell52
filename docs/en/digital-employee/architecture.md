---
title: CodeFlowMu Digital Employee Production Machine Architecture V0.3.1 (Draft)
outline: deep
---

<ArticleCover
  image="/assets/covers/digital-employee.svg"
  kicker="Public Architecture Draft"
  title="CodeFlowMu Digital Employee Production Machine Architecture V0.3.1"
  summary="A configurable, recoverable and verifiable Digital Employee production architecture built on one CodeFlowMu canonical Runtime, with versioned position definitions, controlled deployment, FCoP durable facts, TMPA deterministic reconstruction, fact-checking and independent EVAL observation."
  version="V0.3.1 Draft"
  status="Public draft · non-normative"
  languageHref="/zh/digital-employee/architecture"
  languageLabel="简体中文"
/>

> **Document status:** This is a public architecture draft for discussion and engineering implementation. It is not part of TMPA Core S1.0 and does not claim that all target capabilities below are already present in the public CodeFlowMu product. “Running baseline” and “target capability” must remain distinct.

## Conclusion first

CodeFlowMu already operates as a **software-development Digital Employee**: externally it performs a software-development position; internally PM, DEV, QA and OPS collaborate, EVAL observes independently, and ADMIN retains final governance authority.

The next step is not to copy CodeFlowMu and create a separate “application Runtime,” nor to place more agents inside a hard-coded flow. The intended path is to:

1. preserve the current canonical Runtime, FCoP, TMPA Reader, fact-checking, recovery and approval chain;
2. add Digital Employee definition, validation, compilation, deployment and activation above that same kernel;
3. describe the current development team as the first configurable instance and prove behavioral equivalence in shadow mode;
4. produce a structurally different, non-development reference instance without modifying Core;
5. promote draft capabilities to product facts only after gates, controlled cutover and rollback evidence.

The central statement is:

> **CodeFlowMu is the track machine; agents supply intelligence. A Digital Employee appears externally as one position and operates internally as a multi-role team organized by a persistent PM authority identity.**

## A Digital Employee is not an agent

A Digital Employee is a persistent, software-defined organizational work unit accountable for a bounded class of outcomes.

```text
Digital Employee
├── External contract: Position
├── Internal governance: persistent PM authority identity
├── Internal execution: managed multi-role team
└── Runtime foundation: CodeFlowMu
```

A model, prompt, Agent session, workflow, script, avatar or tool is only an implementation component. None alone defines a Digital Employee.

A stable position contract includes at least:

- position purpose, responsibility and Work Catalog;
- role whitelist and separation of duties;
- allowed and prohibited work;
- capability, data, network and credential boundaries;
- AcceptanceContract and evidence requirements;
- fact-checking, independent verification and human-authority boundaries;
- scheduling, reporting, cost, recovery and lifecycle policies.

Models, providers, hosts, sessions, temporary workers and tools may change. The position definition, responsibility chain and durable facts must survive those changes.

## One kernel, not two Runtimes

**CodeFlowMu is the Digital Employee Runtime.** Cursor, Codex, OpenHands, model APIs and local models are replaceable providers, hosts or adapters.

A development Digital Employee and a business Digital Employee are not separate runtimes:

```text
One CodeFlowMu canonical Runtime
├── Development Digital Employee instance
├── Research-publication Digital Employee instance
└── Other enterprise position instances
```

Differences belong in `EmployeeDefinitionVersion`, `DeploymentRevision`, roles, skills, policies, Work Catalogs and external-system bindings—not in duplicated Core implementations.

The Digital Employee upgrade adds a **configurable definition and deployment layer**. It must not add:

- a second TASK, REPORT, REVIEW or ISSUE system;
- a second source of runtime truth;
- a second governance-decision outlet;
- an audit database parallel to Evidence Snapshot;
- a hidden lifecycle controlled by EVAL or UI.

## Five-layer architecture

| Layer | Authoritative content | Explicit non-responsibility |
|---|---|---|
| FCoP reality protocol | TASK, REPORT, REVIEW, ISSUE, lifecycle, relationships and evidence ownership | Agent scheduling, model selection, business workflows |
| TMPA Reader governance | Asynchronous deterministic reconstruction over visible facts, retaining gaps, disputes and partial order | Writing FCoP facts or accepting work for PM/ADMIN |
| CodeFlowMu Runtime | Session, Run, attempt, lease, Host, Switchboard, gates, recovery and canonical snapshot | Hard-coding an industry position or workflow |
| Digital Employee definition and deployment | Position, team, responsibility, skills, capabilities, negative lists, acceptance, reporting and trigger policies | Creating a second fact, task or lifecycle system |
| Digital Employee instance | One real position running in one project and deployment | Redefining or contaminating generic Core |

The layers cooperate through an asynchronous fact-reconstruction loop. They are not a synchronous pipeline that requires every agent to remain online.

## Core objects and fact ownership

### Definition, deployment and activation

- `EmployeeDefinitionVersion`: an immutable, addressable position definition describing what the employee is, what it may do and what counts as completion.
- `DeploymentRevision`: binds a definition to workers, hosts, providers, projects, schedulers and capability grants.
- `DefinitionApprovalReceipt`: records ADMIN approval of the definition and its authority boundary.
- `ActivationReceipt`: records that a deployment revision may run in shadow or active mode.
- `SecurityPolicyOverrideReceipt`: may only monotonically tighten a live security boundary; it cannot expand authority as a “hotfix.”

These receipts are evidence of governance actions. They are not a new state machine and cannot independently declare a TASK done or archived.

### Work and execution

- A formal `WorkOrder` is carried by an **FCoP TASK**; no parallel WorkOrder database is introduced.
- One TASK may have multiple `Run` records. Rework, recovery, host migration and retries retain their own session/run/attempt/lease identity.
- `WorkContextCapsule` is a read-only input compiled by the track machine for one Session, binding task, definition, deployment, prompt, skills, tools, policies, fact snapshot and gates.
- `ReportEnvelope` is the structured entry to a formal REPORT. It cannot overwrite the source object when it conflicts with durable facts.

## Persistent PM, bounded Sessions

PM is a **persistent logical authority identity**, not an LLM Session that never exits.

```text
FCoP durable facts + canonical snapshot
→ track machine compiles WorkContextCapsule
→ PM Session N performs one bounded turn of work
→ new formal facts are appended
→ Reader reconstructs deterministically
→ PM Session N+1 continues
```

Therefore:

- Sessions may end, compact, recover or move to another Host;
- PM position identity, responsibility and decision attribution remain continuous;
- concurrent Sessions require non-conflicting task-local leases;
- sub-agents produce advisory outputs by default and cannot silently acquire PM, FCoP or privileged tool authority;
- the track machine assembles order, context, skills, tool surface and gates instead of entrusting state to model memory.

## AI-native workflow and execution safety

A Digital Employee must avoid two extremes:

```text
Everything hard-coded → degenerates into RPA
Only a goal prompt → degenerates into an uncontrolled agent
```

The intended middle ground keeps position, responsibility, authority, state and completion contracts stable; allows AI to plan within those boundaries; executes deterministic rules in programs; retains reconstructable evidence; and supports recovery, review and human gates.

Every execution role is constrained by two layers:

1. **Capability Envelope / Sandbox Boundary:** default-deny limits over tools, paths, network, credentials, resources and side effects.
2. **Negative List / Contextual Business Rule:** behavior that may be technically possible but remains prohibited for this position and task.

Semantic quality requirements belong in AcceptanceContract or quality gates, not in permission controls. Replacing a model cannot compensate for missing responsibility, evidence or safety boundaries.

## Facts, evidence, observation and decisions

A Digital Employee separates four mechanisms:

| Mechanism | Primary executor | Product | Final business-decision authority |
|---|---|---|---|
| Deterministic fact-checking | CodeFlowMu program and registered fact sources | Match, gap, conflict, staleness and evidence chain | None |
| Agent execution or research | Specialist role agents | REPORT, deliverables, citations and tool evidence | None |
| Independent verification / EVAL | Independent agent or verifier | Counterevidence, structural risk and observation | None |
| Business acceptance | PM or ADMIN | approve, reject, rework, done, archive | Yes, within formal authority |

The existing production chain remains intact:

```text
Action Evidence
→ Execution Provenance
→ ReviewEvidenceResolver / Evidence Snapshot
→ AcceptanceContract + ReviewFactGate
→ fact-check REVIEW (observation only)
→ PM / ADMIN business decision
```

`GovernanceFactKernel` remains the canonical projection kernel for governance facts, with `business_decision` unset. The sole production-state outlet is not delegated to a Panel, EVAL or any agent.

A Runtime process ending, a tool returning success or an agent saying “done” cannot independently prove business completion. Formal completion is evaluated per applicable AcceptanceContract, evidence, FCoP lifecycle, independent acceptance and human authority. `publication_state` applies only to work types that actually publish; it is not a universal completion condition.

## Evidence Lineage: a horizontal enhancement inside one snapshot

V0.3.1 proposes an optional `EvidenceLineageProjection` inside the existing Evidence Snapshot. It is not a separate “decision-dependency audit layer”; it is a disposable, deterministically rebuildable projection of the same evidence snapshot.

```text
Execution layer: what the agent did
Dependency layer: which actions, resource versions, claims and acceptance items support the current conclusion
```

The intended upgrade is:

> **Fact-checking moves from “does evidence exist?” to “does the evidence chain support the current conclusion?” EVAL moves from “is the summary complete?” to “are the dependency structure and systemic risk reasonable?”**

Dependency sources are classified as:

- `observed`: directly captured at Action Evidence and tool boundaries with immutable resource versions;
- `declared`: stated by AcceptanceContract or formal REPORT and checked against actual nodes;
- `inferred`: derived from rules or graph structure, usable for EVAL risk observation but never sufficient alone for deterministic failure or approval.

Fact-checking and EVAL must consume the same Evidence Snapshot, `TargetStateManifest`, typed graph, complete `findings[]` and graph digest. `summary_state` is an overview only. Conflict, staleness and gaps may coexist and must not be erased by one summary value.

Target resource scope comes only from explicit bounded selectors in the compiled AcceptanceContract. EVAL, Panel, Builder and REPORT authors cannot expand or shrink it ad hoc, and the system cannot fall back to scanning the whole workspace.

### Fact-check boundary

Fact-checking evaluates each acceptance item as:

- `verified`: the deterministic evidence chain is complete;
- `gap`: an execution version, supporting event or intermediate relationship is missing;
- `conflict`: hard sources disagree or graph integrity fails;
- `stale`: the target resource changed after evidence was produced;
- `not_applicable`: the contract explicitly excludes resource-level dependency verification.

These states explain evidence. They do not automatically approve or reject the business result.

### EVAL boundary

EVAL may observe:

- dependency completeness;
- downstream impact of a failure or gap;
- critical evidence nodes;
- nearest deterministic and probable breakpoints;
- cross-role and cross-report structural risk.

EVAL remains `internal_only` and `drives_lifecycle: false`. Only a registered critical rule followed by hard-evidence verification may escalate through the existing ISSUE / governance-hold path. Graph ranking, risk scores, inferred edges and summary state have no blocking authority by themselves.

CodeFlowMu will implement this capability independently in TypeScript, without an external Python runtime or second decision system. The execution/dependency dual representation, source classification and basic graph analysis are design references to [GRADE](https://github.com/yzhao062/grade/tree/3839a57ac165d58a807fce0a3ff38346732ee936) and [auditable v0.2.0](https://github.com/yzhao062/auditable/tree/v0.2.0); their performance claims are not inherited.

## Skills, Knowledge and governed learning

| Object | Purpose |
|---|---|
| Position | Long-term responsibility and accountability |
| Work Skill | Stable method and delivery constraints for one role and work class |
| Method Skill | Reusable analysis, writing, testing and verification method |
| Tool Capability | An ability type that may be requested; actual grants remain bounded by Capability Envelope |
| Knowledge | Business facts, rules, terms, pages and system knowledge |
| Policy | Authority, capability, negative-list, evidence and acceptance boundaries |
| Prompt | A short-lived projection compiled for one TASK from the objects above |

Experience from one Run cannot directly overwrite formal Skills, Knowledge, Workflows or Policies:

```text
Run / Failure / EVAL
→ Candidate
→ independent review and safe-data regression
→ versioned approval
→ governed Skill / Knowledge / Workflow / Policy
```

## Running foundation and target capabilities

| Scope | Current public assessment |
|---|---|
| FCoP TASK/REPORT/REVIEW/ISSUE, current development team, Session/Run/recovery, fact-checking and EVAL chain | Supported by running and engineering evidence, bounded to exact versions and evidence packages |
| Governance Fact Kernel, Evidence Snapshot, AcceptanceContract and ReviewFactGate | Observed in the private product line; not public source or proof of general correctness |
| Generic EmployeeDefinition, Deployment, Activation and definition-driven Context Capsule | V0.3.1 target capability requiring implementation and gates |
| Evidence Lineage, TargetStateManifest, resource-version staleness and graph-structured EVAL | WP-14 target capability; not a current public-product claim |
| Cross-domain Digital Employee production machine | Must be demonstrated through development-team bootstrap and at least one non-development reference instance |

## Bootstrap and engineering proof

Credible bootstrap does not mean a live process rewrites itself:

```text
Pin a parent version and evidence
→ develop configurable capability on an isolated branch
→ describe and reproduce the current development team
→ shadow comparison
→ controlled cutover with rollback retained
→ new development Digital Employee builds a later version
→ produce a non-development reference instance
```

The decisive proof is not “more agents.” It is:

> **The same CodeFlowMu Core can operate both a software-development Digital Employee and a structurally different business or research Digital Employee without encoding business-specific role order and workflow logic in Core.**

The research-publication Digital Employee is the first candidate reference instance. A reference instance is not the generic engine itself.

## Engineering origin and public boundary

The problem framing grew from engineering the Xiaodian AI enterprise application. One stream asked “who develops enterprise AI?” and led toward multi-role development, FCoP and CodeFlowMu. The other asked “how should enterprise AI enter business operations under governance?” and led toward TMPA and the Digital Employee architecture. The streams now meet again in the Digital Employee production machine.

The [Xiaodian AI PWA Demo](https://demo.chedian.cc) is now public for hands-on exploration; its source code and production systems remain private. The demo is a public experience entry point, not public evidence of TMPA S1.0 conformance, independent validation, production readiness or product generality.

## SME-first economics

Persistent does not mean an LLM consumes tokens continuously. Position, identity, authority, tasks, work history, state, evidence, deployment versions, evaluation and cost records persist. Compute activates when work arrives.

## Implementation path

V0.3.1 separates engineering into fourteen work packages, grouped as:

1. definition, identity, schemas and effective FCoP contract;
2. development-team self-description, role policy and separation of duties;
3. definition validation, deployment compilation, activation and Gate Registry;
4. WorkContextCapsule and prompt/skill/tool assembly;
5. asynchronous routing, PM continuity, Switchboard shadow and duplicate-delivery prevention;
6. default-deny tool boundaries, credential isolation and security hotfixes;
7. periodic reporting, research-publication reference instance and revision migration;
8. exclusive cutover, legacy-path retirement and rollback;
9. WP-14: Evidence Lineage enhancement for fact-checking and EVAL.

Work packages remain governed through the current FCoP TASK/REPORT/REVIEW chain. This draft is not execution authority and cannot replace ADMIN definition approval, activation or cutover decisions.

## Validation still required after this draft

- implementation-level freeze of generic definition and deployment schemas;
- capability and tool enforcement across supported hosts and operating systems;
- credential isolation, revocation and side-effect normalization;
- PM backpressure, long-task-tree migration and successor Sessions;
- Workflow/Knowledge promotion rules and regression datasets;
- Evidence Lineage shadow compatibility, cross-platform determinism and scale limits;
- behavioral-equivalence migration of the development Digital Employee;
- complete non-development reference run without modifying Core;
- active cutover, rollback and removal of legacy production authority.

A target may be promoted from “architecture” to “implemented capability” only after its corresponding gates and evidence are complete.
