---
title: "What Turns Multiple Agents into a Team? Governance, a File State Machine, and an Engineering Rail"
date: '2026-08-22'
column: open-source-engineering
category: daily
article_type: architecture-explainer
edition: research-center
research_question: "How do TMPA, FCoP, and CodeFlowMu divide responsibility and connect into a governable multi-agent system?"
summary: "More model sessions do not automatically create a team. This article follows one accountable work item to show how TMPA defines governance semantics, FCoP externalizes state, and CodeFlowMu runs the engineering rail."
item_id: "MANUAL-20260822-CODEFLOWMU-GOVERNANCE-RAIL"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-22-codeflowmu-governance-state-rail-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
sources:
  - research/manual-runs/2026-08-22-codeflowmu-rail-state-series-round1/02-source-register.md
  - research/manual-runs/2026-08-22-codeflowmu-rail-state-series-round1/02-fact-claim-matrices.md
---

<ArticleCover
  image="/assets/covers/daily-2026-08-22-codeflowmu-governance-state-rail-cover.png"
  kicker="Open-source Engineering · Project Research"
  title="What Turns Multiple Agents into a Team? Governance, a File State Machine, and an Engineering Rail"
  summary="More sessions do not automatically create a team. TMPA sets governance semantics, FCoP preserves state facts, and CodeFlowMu performs engineering execution."
  version="MANUAL-20260822-CODEFLOWMU-GOVERNANCE-RAIL"
  status="Editorial &amp; Visual PASS · 2026-08-23"
  languageHref="/zh/engineering/2026-08-22-codeflowmu-governance-state-rail"
  languageLabel="中文"
/>

# What Turns Multiple Agents into a Team? Governance, a File State Machine, and an Engineering Rail

Imagine a multi-agent delivery in which the development agent says the code is done, the QA agent says the tests passed, and the PM agent produces a final summary. Then someone asks three basic questions: Which code revision did QA test? Who was authorized to accept the result? Where should the work resume after a process restart?

The three sessions return three different answers.

The problem is not a shortage of agents. The agents were answering in parallel, but they were not operating as an accountable team.

The central argument of this article is that a multi-agent team needs at least three distinct layers: **a governance model that defines legitimate collaboration, a file state machine that externalizes current facts and transition history, and an engineering rail that performs dispatch, execution, observation, and recovery.** By the end, you should be able to draw the same responsibility map for your own system and identify where policy, fact, execution, and final judgment actually live.

> [!NOTE]
> **Series order (1/3).** This article defines the three responsibility layers. [Part 2](./2026-08-22-agent-task-file-state-machine) examines the TASK file state machine, atomic transitions, and concurrency boundary. [Part 3](../digital-employee/2026-08-22-agent-rail-decision-boundary) separates mechanical rail behavior from decisions that belong to an agent, PM, or ADMIN. The three articles share one vocabulary and evidence boundary; none should be read alone as a complete implementation claim.

## Three layers, three different jobs

TMPA, FCoP, and CodeFlowMu are not three competing orchestration frameworks.

| Layer | Role in this system | What it owns | What it does not own |
|---|---|---|---|
| TMPA | Governance model | Stable identity, separation of responsibility, lifecycle legality, conflict preservation, deterministic reconstruction | Model execution, directories, or scheduling |
| FCoP | File state machine and coordination protocol | TASK, REPORT, ISSUE, and REVIEW artifacts; path-addressed state; transition events | Agent selection, tool execution, retry, or recovery policy |
| CodeFlowMu | Engineering rail | Roles, sessions, dispatch, capability checks, tool execution, observation, and technical recovery | The definition of TMPA or FCoP, or business acceptance on behalf of PM/ADMIN |

In compact form: **TMPA defines governance semantics; FCoP externalizes state facts; CodeFlowMu keeps work moving on an engineering rail.**

![TMPA defines governance semantics, FCoP fixes file state and events, and CodeFlowMu performs engineering execution](/assets/covers/daily-2026-08-22-codeflowmu-governance-state-rail-figure-1.svg)

*Figure 1. Three layers of responsibility for an agent team. The diagram summarizes the verified boundaries in this article; it does not turn the protocol or the rail into interchangeable product claims. Source: author synthesis from the TMPA Architecture Paper, the FCoP v3 specification, and the CodeFlowMu V1.9.7 candidate evidence.*

This separation also has an independent conceptual reference point. The W3C [PROV-O Recommendation](https://www.w3.org/TR/prov-o/) models entities, activities, and responsible agents separately, then connects them through generation, use, attribution, and delegation. PROV-O does not validate TMPA or CodeFlowMu. It does support a broader design lesson: an outcome, the activity that produced it, and the actor responsible for it should not collapse into one `done` flag.

## TMPA defines what accountable teamwork means

The [TMPA Architecture Paper A1.0](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-architecture-paper-a1.0-en.md) describes four operating ideas: text carries durable messages and state; each writer maintains a locally serial stream; multiple streams advance asynchronously; and a governance reader aggregates sources to reconstruct process and unresolved issues.

This is not a theory of how to make a model more intelligent. It addresses more basic questions:

- What stable object represents the work?
- Who authored the task, report, review, and decision?
- Was a lifecycle transition legal for that role?
- When two sources conflict, does the system preserve the conflict or silently choose one?
- Can responsibility and unfinished work be reconstructed after the original process disappears?

The [TMPA Core Specification S1.0](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-en.md) turns these ideas into testable objects and reader behavior. Stable primary carriers, single-writer objects, explicit references, role authority, and conflict preservation are central to that contract.

A governed team task therefore cannot exist only inside a chat transcript. The work needs a stable identity. Development evidence and QA review should remain attributable to their respective writers. Acceptance cannot be inserted casually into the executor's own report.

TMPA supplies the governance semantics. It does not require those objects to be stored in files rather than a database or object store.

## FCoP projects governance into visible state

FCoP uses the filesystem as a project-visible protocol substrate. Its current teaching statement is:

> Files carry protocol. Paths address state. Events replay transitions.

A task occupies one lifecycle location:

```text
inbox → active → review → done → archive
          ↑        │
          └ reject ┘
          └── finish ──→ done
```

The path answers where the task is now. Append-only transition events explain how it got there. A TASK carries work intent, a REPORT carries an execution return, an ISSUE records a blocker or risk, and a REVIEW records an independent governance judgment. The exact current rules are in the [FCoP v3 specification](https://github.com/joinwell52-AI/FCoP/blob/main/spec/fcop-v3-spec.md).

The advantage is not that files are inherently reliable. It is that the state is inspectable by people, agents, and scripts without first decoding a private application database.

The boundary matters just as much. FCoP can declare `active → review` a legal transition, but it does not decide who should execute it or when. It defines a REPORT contract but does not start a model. It assumes one consistent filesystem boundary for a lifecycle root; it does not provide multi-host consensus.

There is an important concurrency boundary here. REPORT and REVIEW are separate artifacts, so they should not compete to overwrite the same report. Two callers competing to move the same TASK through its lifecycle are still competing, however. FCoP does not say that producing a REPORT automatically moves a task. Only L1 lifecycle tools may mutate `_lifecycle/`: `claim_task` moves `inbox` to `active`, and `submit_task` moves `active` to `review`. Within one filesystem boundary, the standard pattern writes event-augmented content to a temporary file in the destination directory, persists it, publishes the destination through `rename`, and only then removes the source. That gives destination publication an atomically visible commit point. It is not a global lock, and it does not automatically solve two concurrent claimants or multi-host writers.

`rename` must therefore not run bare as a multi-claimant arbitration mechanism. If a future deployment supports independent Runtimes competing for the same TASK, its claim entry point needs a separate non-replaceable exclusive reservation or atomic compare-and-swap. Checking `expected_revision` before `rename` alone leaves a check-to-effect window and cannot guarantee exclusive claim. The primitive must be validated for its target host and filesystem. The current local-first, single-Runtime deployment does not claim to support shared-workspace contention or provide its stress test; this is an admission requirement for a future extension, not a claim about V1.9.7.

TMPA's “single-writer object” is therefore a responsibility-and-provenance constraint, not a synonym for “the filesystem has already locked it.” Nor is “each agent writes its own directory” a current FCoP guarantee.

A visible state machine still needs a system that performs the work.

## CodeFlowMu turns the state machine into a running rail

CodeFlowMu is the engineering runtime in this stack. It connects roles, sessions, tasks, tools, reports, and recovery so that static coordination artifacts lead to controlled action.

In the V1.9.7 candidate parent implementation, the governance fact kernel keeps runtime facts, lifecycle, report, evidence, dependency, and acceptance as separate axes. Its canonical snapshot sets `business_decision` to `null`: the kernel may normalize facts and project available commands, but it does not manufacture a business verdict.

The rail-assistance contract also makes the decision owner explicit. The following is an equivalent narrow excerpt from the parent repository at fixed commit `2c901972`; the original type alias has been inlined for readability:

```ts
export interface RailAssistanceResult {
  disposition: "neutral" | "unknown_reconcile"
    | "waiting_dependency" | "negative_list_denied";
  decision_owner: "AGENT" | "PM" | "ADMIN";
  facts: string[];
  advisories: string[];
  suggested_actions: string[];
}
```

This is more than a UI label. The rail can return facts, cautions, and suggested actions. It can hold an operation for an explicit dependency or a frozen negative-list condition. A business judgment still comes back with an accountable owner.

The four dispositions have distinct meanings:

- `neutral`: current facts are usable; the rail does not issue an allow-or-deny verdict for any role;
- `waiting_dependency`: an explicit prerequisite in the formal TASK is not satisfied, so the current operation may wait;
- `negative_list_denied`: a frozen negative condition—such as a scope, identity, or terminal-state conflict—requires rejection of the current operation;
- `unknown_reconcile`: available sources cannot yet be normalized into one usable context and must be reconciled. It does not mean the system has decided failure. A model must not turn missing or conflicting facts into an acceptance verdict; the Agent, PM, or ADMIN named by `decision_owner` decides how to obtain evidence, retry, or adjudicate.

The current contract does not define `unknown_reconcile` as a fixed automatic rollback, circuit-breaker, quarantine queue, or notification flow. Those are caller and runtime policies; they cannot be inferred from this enum alone. If a high-risk downstream action cannot continue while sources conflict, the contract must explicitly make completed reconciliation a prerequisite, so the downstream action returns `waiting_dependency`; if an operation must be rejected, it must meet a pre-frozen deterministic condition. An enum name alone cannot promote unknown state into automatic quarantine or failure.

The dual-stage path conflict in Part 2, sources that cannot be normalized, and incomplete identity fields all enter this same `unknown_reconcile` disposition; they are not three parallel recovery mechanisms. A shared enum still does not make the operating mechanism complete. Unattended reconciliation needs at least a `reconcile_owner`, trigger reason, canonical task identity and revision, `opened_at`, a deadline, escalation route, and permitted terminal outcomes. A reconciling task must not keep waking a model and burning tokens. The V1.9.7 evidence does not establish a unified implementation of those fields, SLA, notification, or circuit breaker, so they remain admission requirements rather than current product claims.

The same version applies exact role/tool capability checks and routes PM task mutations through a shared task-command kernel. That kernel verifies task identity, scope, revision, and an idempotency key—a stable identifier used to coalesce transport retries of one business intent. These are deterministic software boundaries around who may act on which task; they are not prompt-based etiquette.

One cross-layer contract is still necessary: **the dependency graph is a governance-bearing artifact, not ordinary execution data.** An executing agent may report that an edge is wrong and propose a change, but it may not rewrite an existing TASK dependency merely because it is running. Dependency creation or mutation belongs to PM, ADMIN, or an actor explicitly delegated by the active governance policy. The change must create a new task revision, rerun identity, scope, and cycle checks, and preserve who changed which edge under which policy version. The inspected material does not prove that every dynamic dependency write path already enforces this contract, so the series does not claim that V1.9.7 has completed it.

### How governance reaches implementation

TMPA rules cannot remain only in a paper, and they should not dissolve into untraceable `if` statements inside CodeFlowMu. The sound engineering boundary is a **versioned governance policy bundle** that names its policy ID, version, content digest, supported Runtime range, role and scope predicates, identity canonicalization, dependency-mutation authority, mechanical denial predicates, migration requirements, and rollback conditions. Every rail result should record the policy version it actually consumed.

Updateable does not mean silently hot-swappable in the middle of a run. One task round binds a stable policy. A new policy becomes effective only at a declared boundary after validation and ADMIN authorization. A concurrency patch follows the same rule: an exclusive reservation or compare-and-swap prevents two winners, while mapping a failed reservation to wait, denial, or reconciliation is governance semantics. An emergency fix may disable multi-claimant operation or contract the deployment to one Runtime. Changing who obtains execution authority or adding a mechanical denial requires the policy bundle and evidence matrix to change before the implementation does.

The capability gate is not a complete sandbox. Its own source states that it checks canonical tool identity and active capability, not every command effect. It can be a compliance filter for a collaboration contract; it cannot substitute for host-appropriate operating-system isolation such as restricted accounts, filesystem permissions, containers, or platform-native process isolation. If an agent has host access that can bypass the application layer, the gate alone cannot stop it from changing out-of-scope files or starting an unauthorized command. Treating a governance contract as a security sandbox is an architectural error. The inspected material does not prove that CodeFlowMu has deployed those isolation controls uniformly. The parent repository is private, so this article reproduces only the short contract required to explain the claim. It does not present private source as independently reproducible public evidence.

## One work item across all three layers

Consider a request to add CSV export to an existing product.

| Stage | Input | Accountable actor | Output | Wait condition | Hard-denial condition | Reconcile / unknown |
|---|---|---|---|---|---|---|
| Establish work | Approved requirement and acceptance criteria | PM / ADMIN | Stable root task and authority boundary | — | Invalid identity or authority scope | — |
| Create task | Recipient, dependencies, deliverables | FCoP L1 `create_task` | TASK in `inbox` | — | Invalid envelope or lifecycle location | — |
| Claim and bind execution | TASK in `inbox`, identity, and role capability | An authorized agent explicitly invokes FCoP L1 `claim_task`; CodeFlowMu may establish or schedule task context around it | TASK moves to `active` with an `inbox → active` event; the task is bound to an agent session | Explicit dependency pending → `waiting_dependency` | Duplicate execution or missing role capability → reject this claim | Transition conflict → preserve and reconcile |
| Execute | `active` TASK, code, and test environment | DEV / QA agent with CodeFlowMu Runtime | Code, raw test output, and execution explanation | — | Invalid tool capability or task scope | — |
| Write execution return | Code, raw test output, and execution explanation | Executor explicitly invokes FCoP `write_report` | Attributable REPORT objects; for example, DEV and QA each write an independent envelope rather than overwriting one another; TASK remains in `active` | — | — | Report identity or evidence conflict |
| Submit task for review | `active` TASK and an already-written execution return | Executor explicitly invokes FCoP L1 `submit_task` | TASK moves to `review` with an `active → review` event | — | An explicit submission precondition is unmet | Transition conflict → preserve and reconcile |
| Reconstruct facts | TASK, REPORT, lifecycle, provenance | Governance reader / fact kernel | Inspectable task snapshot and issue set | — | — | Missing or conflicting sources → `unknown_reconcile` |
| Accept or rework | TASK in `review`, current revision, reports, and evidence | PM / ADMIN explicitly invokes `approve_task` or `reject_task` | Move to `done`, or return to `active` for rework; an independent REVIEW remains a separate governance artifact | — | Wrong authority or stale target revision | — |

The last two stages are easy to compress incorrectly. A developer REPORT establishes that the developer submitted a result. The fact kernel observing that REPORT establishes that an attributable return exists. Neither fact decides whether the product requirement has been met.

The table describes an integration that respects the FCoP boundary. A runtime may provide work opportunity, sessions, and capability checks, but it must not turn “dispatch” into claiming on an agent's behalf. `write_report` produces a REPORT but does not automatically trigger `active → review`; only an explicit L1 call changes lifecycle location.

NIST's [AI RMF 1.0](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10) treats governance as a cross-cutting lifecycle function and calls for explicit roles, responsibilities, and human oversight in human-AI configurations. It does not prescribe this three-layer architecture. It supports the general judgment that governance belongs inside the operating lifecycle, not on a dashboard added after completion.

## Layering does not mean every system should use files

This architecture is sometimes misread as a universal claim that all multi-agent systems should coordinate through local files. Neither TMPA nor this article makes that claim.

Within one project root, one consistent filesystem, and a controlled writer boundary, the inspectability and low infrastructure cost of an FCoP profile are valuable. Multi-host writers, relaxed network filesystems, cross-trust-domain operation, or strong consistency requirements need an additional consistency layer and may be better served by a database or event service. The TMPA governance semantics may remain useful even when the file profile does not.

There is also a simpler counterexample. If three agents are brainstorming in a low-risk, one-off session with no external effects, a complete governed lifecycle may cost more than it saves. Governance depth should track duration, conflict risk, reversibility, and acceptance responsibility.

## What remains between one Runtime and concurrent production

“Not currently supported” cannot be the permanent answer to concurrency. A candid roadmap separates consistency boundaries:

| Stage | Target topology | New admission evidence required |
|---|---|---|
| Current | One machine, one project root, one Runtime writer | Restart recovery, root binding, writer lock, and existing regression |
| Next | Multiple processes competing for one task on one host | Non-replaceable claim, zero loser-side effects, lease/reclamation, contention stress, and fault injection |
| Later | Multiple Runtimes sharing one local filesystem | Exclusive canonical-task claim, policy-version agreement, preserved write conflict, repeatable recovery |
| Multi-host | Network filesystem or cross-trust domain | A separate consistency profile, failure model, and authority model; local `rename` results cannot simply be carried over |

CodeFlowMu's digital-employee direction will encounter multi-instance production. Crossing that boundary requires a new protocol profile, policy version, and test evidence—not merely removing the words “local-first.”

## Seven questions for your architecture

1. Does each work item have a stable identity independent of a model session?
2. Are current state, history, execution return, and acceptance separate facts?
3. Can each report be traced to a task, attempt, and accountable role?
4. Does the system preserve conflicts rather than overwrite them silently?
5. Has the protocol layer or runtime overreached by taking acceptance, rework, or a final conclusion away from the accountable business role?
6. Does the runtime enforce mechanical boundaries while leaving acceptance to an authorized actor?
7. Can unfinished work be reconstructed after the original session or process disappears?

If the answer to these questions is only “the prompt tells the agents to be careful,” the system still has multiple sessions, not a governed team.

Evidence boundaries remain important. The [TMPA Implementation Case I1.0](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-implementation-case-i1.0-en.md) records an author-run CodeFlowMu V1.8.0 product reader against a fixed S1.0 bundle. The V1.9.7 candidate has separate current-source, regression, and live-restart evidence. Version files and the live process report V1.9.7, but that does not make the release note's candidate status a final `RELEASED` decision; ADMIN still owns that decision. Together these records support bounded engineering feasibility; neither is third-party certification or a universal cross-platform proof.

The next validation step has two tracks. The public track must not depend on a private runtime: use the published [TMPA S1.0 conformance artifacts and reference reader](https://github.com/joinwell52-AI/joinwell52/tree/main/research/conformance/tmpa-core-s1.0) together with the FCoP specification and reference tools. Inject source conflicts into fixed TASK, REPORT, and REVIEW artifacts, then check whether identity, provenance, and conflict preservation reconstruct consistently. That tests governance and protocol semantics; it does not replace verification of CodeFlowMu's private rail. The restricted track is for an independent environment authorized to access the V1.9.7 candidate parent implementation: replay stale-revision commands, task contention, and Runtime restart tests. Until a public reproducer exists, outside readers cannot reproduce the product-level conclusion themselves.

The reusable lesson is not the three project names. It is the chain of responsibility: **the governance model defines legitimacy, the state machine preserves facts, the rail executes and recovers, and an accountable actor makes the final judgment.**

## Sources and evidence boundaries

For how this series distinguishes public specifications, private code excerpts, first-party execution records, and independent material, see [How to Read Engineering Evidence at the Digital Employee Works](../methodology/evidence-boundaries). The sources below still support only the specific claims stated in this article.

- [TMPA Architecture Paper A1.0](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-architecture-paper-a1.0-en.md), [TMPA Core S1.0](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-en.md), and the [FCoP 3.0 specification](https://github.com/joinwell52-AI/FCoP/blob/main/spec/fcop-3.0-spec.md) support the account of this research's governance objects, file artifacts, and lifecycle semantics; they do not constitute public reproduction of a private runtime.
- [W3C PROV-O](https://www.w3.org/TR/prov-o/) is an independent reference for separating entities, activities, and responsible agents. It does not specify TMPA/FCoP paths or envelopes.
- [NIST AI RMF 1.0](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10) supports the general governance context of roles and oversight throughout the lifecycle. It neither endorses nor certifies this implementation.
- V1.9.7 runtime figures are first-party, controlled evidence and support only the recorded Windows environment, code, and test set. Accessed 2026-08-23.
