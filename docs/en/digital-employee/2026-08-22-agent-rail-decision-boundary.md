---
title: "How Can an Agent Team Work Autonomously? The Rail as a Service for Dispatch, Recovery, and Judgment"
date: '2026-08-22'
column: digital-employee
category: daily
article_type: engineering-judgment
edition: research-center
research_question: "How can an agent team work autonomously within authorized tasks, and which coordination services should a rail provide without deciding for agents, PMs, or ADMIN?"
summary: "Agents should advance work autonomously within explicit responsibilities. The rail supplies dispatch, facts, audit, and technical recovery, while limiting hard denial to a frozen negative list rather than becoming an unauthorized manager."
item_id: "MANUAL-20260822-AGENT-RAIL-BOUNDARY"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-22-agent-rail-decision-boundary-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
sources:
  - research/manual-runs/2026-08-22-codeflowmu-rail-state-series-round1/02-source-register.md
  - research/manual-runs/2026-08-22-codeflowmu-rail-state-series-round1/02-fact-claim-matrices.md
---

<ArticleCover
  image="/assets/covers/daily-2026-08-22-agent-rail-decision-boundary-cover.png"
  kicker="Digital Employee · Project Research"
  title="How Can an Agent Team Work Autonomously? The Rail as a Service for Dispatch, Recovery, and Judgment"
  summary="Agents advance autonomously within explicit authority; the rail serves dispatch, facts, and technical recovery. Scope, acceptance, rework, and final conclusions remain with an authorized agent, PM, or ADMIN."
  version="MANUAL-20260822-AGENT-RAIL-BOUNDARY"
  status="Editorial &amp; Visual PASS · 2026-08-23"
  languageHref="/zh/digital-employee/2026-08-22-agent-rail-decision-boundary"
  languageLabel="中文"
/>

# How Can an Agent Team Work Autonomously? The Rail as a Service for Dispatch, Recovery, and Judgment

The point of an agent team is not to wait for a central controller to decide every next move. It is to keep advancing work that its members can complete within clear task, role, and authority boundaries. A rail should be a service layer: it tells the team what can be claimed, where facts reside, when dependencies release, and how interrupted execution can recover. It must not replace an agent's professional judgment or a PM's or ADMIN's business decision.

Multi-agent systems fail in two opposite ways.

With no rail service, tasks move through chat, two agents start the same work, reports lose their upstream binding, and a process crash leaves nobody able to distinguish retry from stop. Each agent appears free, but the team cannot coordinate reliably.

With an overpowered rail service, a classifier decides that a plan is “incomplete” and blocks PM dispatch. A temporarily missing artifact becomes a terminal failure. A fixed retry limit silently turns technical backoff into a business decision. The service layer has displaced accountable people and deprived agents of legitimate room to act.

A sound engineering rail must avoid both extremes: **let agents act autonomously within authorized tasks; automate facts, dispatch, audit, and technical recovery as a service; and reserve hard denial for a closed, reviewable set of mechanical conditions. Scope, acceptance, rework, and final conclusions remain with an accountable agent, PM, or ADMIN.** The CodeFlowMu V1.9.7 candidate is a useful bounded case because that responsibility boundary is the center of its current change.

## A rail serves autonomous collaboration; it is neither the state machine nor the PM

The file state machine answers where a task is now and how it moved. The rail answers which role receives the work, which session runs, whether a capability is available, when a dependency releases, and how technical execution is recovered.

The rail is also not a project manager or a manager above the agents. A PM interprets requirements, chooses an execution route, evaluates evidence, and decides whether to accept or rework. An executing agent must likewise plan, implement, and submit evidence within its authorized task and tool boundary. Those judgments contain business or professional meaning. They cannot be derived safely from file presence, elapsed minutes, retry count, or classifier score alone.

Autonomy is not unconstrained behavior. It is **independent progress within a visible task contract, role capability, current revision, and evidence requirements**. The rail makes those constraints and coordination facts reliable services, so agents do not have to guess whether work is claimed, a dependency is met, or an old session remains valid. It may not inflate that service role into deciding the team's goal or conclusion.

NIST's [AI RMF 1.0](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10) places governance, defined roles, and human oversight across the AI lifecycle. It does not define an engineering rail, but it offers an independent reference point: automation must operate inside an explicit responsibility structure.

## Separate autonomous agent action from rail services

| Category | Typical question | Correct division of responsibility |
|---|---|---|
| Fact service | Does a report exist? What is the current revision? | The rail records and exposes it; agents use it to continue their work |
| Advisory service | Is evidence probably incomplete? Would another test help? | The rail explains the concern and suggests an action; an authorized agent or PM decides |
| Mechanical negative | Is identity conflicting, scope unauthorized, task terminal, execution duplicate, or an explicit dependency pending? | The rail denies the current operation and preserves evidence; it does not close business work |
| Business decision | Should QA be dispatched? Is the result acceptable? Is more rework worth doing? | Hand the decision to an authorized agent, PM, or ADMIN |

![The automation boundary: facts, advice, mechanical denials, and business decisions belong to different actors](/assets/covers/daily-2026-08-22-agent-rail-decision-boundary-figure-1.svg)

*Figure 1. The automation boundary. A mechanical denial applies to the current action; timeout, backoff, and retry must not silently become business conclusions. Source: author synthesis from CodeFlowMu V1.9.7 candidate evidence and NIST AI RMF 1.0.*

The dangerous transition is from advisory to mechanical denial. “An attachment is missing” is a fact gap. It becomes a precondition for a specific operation only when the formal task contract or an authorized decision makes it one. Otherwise, the Runtime should report the gap to the PM rather than close the work.

## How V1.9.7 encodes the boundary

The CodeFlowMu V1.9.7 rail-assistance contract exposes four dispositions:

```ts
type RailAssistanceDisposition =
  | "neutral"
  | "unknown_reconcile"
  | "waiting_dependency"
  | "negative_list_denied";
```

- `neutral`: facts are available, but the rail issues no allow/deny verdict;
- `unknown_reconcile`: sources are missing or conflicting and require reconciliation;
- `waiting_dependency`: an explicit dependency in the formal TASK is pending;
- `negative_list_denied`: a frozen mechanical condition rejects the current operation.

The result also names `decision_owner` as AGENT, PM, or ADMIN. The governance snapshot fixes:

```ts
business_decision: null
```

Together, these details create a testable boundary. The rail can supply facts and command surfaces without smuggling a business verdict into the snapshot.

`unknown_reconcile` and `negative_list_denied` are not the same category. The former means sources are missing or conflicting and must be reconciled; the rail can return uncertain facts, recommended actions, and the next decision owner. The latter means a frozen mechanical condition requires rejection of the current operation. The inspected V1.9.7 contract permits mechanical waiting only for explicit dependencies and hard denial only for its frozen negative list. It would therefore be inaccurate to call `unknown_reconcile` an existing automatic freeze, PM notification, or rollback mechanism. If a high-risk downstream operation must stop on conflict, its basis has to be a formal TASK prerequisite, a frozen mechanical rule, or an explicit PM/ADMIN decision; the system may not use a heuristic to select a conflicting branch.

The excerpts come from the private CodeFlowMu parent implementation at fixed commit `2c901972`, not from CodeFlowMu Open. This narrow interface contract is shown so readers can inspect the architectural boundary—what the rail may and may not return. It neither opens the full implementation nor constitutes product evidence that the public can reproduce.

## Why mechanical denials must be closed and reviewable

The current V1.9.7 contract limits mechanical denial to a closed, reviewable set of conditions:

1. an explicit ADMIN or authority decision that denies the current operation;
2. an authorization-scope mismatch;
3. an inconsistency in the canonical task-identity fields defined by the contract;
4. a terminal task state;
5. duplicate execution;
6. an explicit TASK dependency that remains pending;
7. an integrity or safety error.

These conditions share one property: they can be reviewed from deterministic facts without asking the Runtime to decide whether a plan is intelligent or a result is good enough. Item 3 cannot be hidden behind the vague phrase “real conflict”: a concrete contract must name the compared fields, their canonicalization, and the outcome of a mismatch. Bound task, root-task, thread, and revision fields can, for example, be part of that comparison. Missing fields, an undefined comparison rule, or contradictory facts belong in `unknown_reconcile`, not in a pretended mechanical denial. The inspected material discloses those command bindings but not a complete composite-identity predicate, so this article does not present one as an exhaustively verified algorithm.

A source conflict normally enters `unknown_reconcile` first; it is not automatically inserted into the negative list. Only if it satisfies a deterministic predicate already written into the contract—such as a mismatch in defined identity fields, a scope mismatch, or an explicit decision forbidding the current operation—may the rail turn the **current operation** into `negative_list_denied`. Otherwise it preserves the conflict and asks an authorized actor to reconcile it.

As the list grows, business preference tends to disguise itself as infrastructure fact. “The plan has fewer than three steps,” “no ISSUE was filed first,” and “the run exceeded ten minutes” may be useful warnings. None universally implies that the task should stop. A PM or ADMIN may write a condition into a task during creation, revision, or formal approval; they must not turn a new preference into a mechanical block at runtime and thereby create a back door through the service layer. The rail only checks conditions already frozen in the contract or an explicit decision.

## What the rail should automate

### Bind identity and scope

A task command should bind task, root, thread, round, and revision. Commands against a stale revision, capabilities mounted for another task, or different business intents sharing one idempotency key should be rejected before effect.

### Enforce role/tool capability

Development, QA, operations, and review roles should not share one mutable tool surface. V1.9.7 checks canonical tool identity and active capability. On the inspected PM task-mutation path, requests enter the shared TaskCommandKernel, so identity, scope, and duplicate-prevention checks execute on that path. That evidence does not exhaust every legacy or alternative endpoint. Proving that no bypass exists would also require an endpoint inventory, static scans, and rejection tests for bypass paths.

This is tool admission, not complete effect analysis. Path escape, command parameters, and operating-system privileges still require lower-level policy and sandbox controls.

Tool admission should not depend on a static role alone. An engineering design should apply a separate operation policy to lifecycle stage, current revision, and action target: once a task is in `review` or a terminal state, a request by the executor to keep writing code should be rechecked for a still-explicit, valid rework or execution entry point. The inspected V1.9.7 evidence proves canonical tool ID, active capability, task scope, and revision checks; it does not prove that every tool has unified dynamic contraction across `active`, `review`, and `done`. This is a policy and test to add, not a feature this article claims is complete.

### Queue and release explicit dependencies

When a QA task explicitly depends on a DEV child, the rail may keep QA waiting until the upstream contract is satisfied. The hold comes from a reviewable TASK edge, not a classifier's interpretation of prose.

Consider the contrast. If QA starts simply because it sees an old-round DEV report, it can treat a previous output as input to the current task. A sound contract binds the QA task to a specific upstream task and its current revision; before that dependency is satisfied, it returns `waiting_dependency` rather than launching QA. Only when completion evidence matches the bound version does the rail release the edge. This is a design example of a reviewable dependency; it is not a claim that V1.9.7 has tests for every report–revision matching combination.

### Preserve technical facts for long jobs

Work that must outlive a session, survive Runtime restart, expose continuous logs, or support precise cancellation can use the optional managed-command service. V1.9.7 also states that short tests and builds may use native host command tools. The absence of managed-command tools must not be treated as proof that an agent cannot work or submit a REPORT.

### Wake and recover without declaring a business outcome

The rail may wake an eligible agent, restore a recoverable session, retry a deterministic technical step, and add cooldown or audit after repeated failures. Counts and time windows are useful for throttling and operator attention. They should not silently become permanent business blocks.

A good recovery result says what was observed, what was repaired mechanically, what remains unknown, and who should decide next. It does not announce project failure on behalf of the PM.

Timeout must also be treated as a technical fact, not a business verdict. V1.9.7's optional managed-command service can retain long-job state, continuous logs, bounded waits, and precisely authorized cancellation. That supports recording that a session or tool call exceeded its expected window; it does not prove that every session already has a heartbeat, automatic diagnosis, or PM notification. A sound follow-on policy records timeout in session or job evidence, exposes retry, takeover, or termination choices to the decision owner, and avoids silently promoting technical timeout into Task Failure.

## A three-second boundary test

Suppose a QA REPORT arrives without the raw compatibility log named in the task.

An overreaching implementation does this:

```text
Runtime sees missing attachment
→ marks the root task failed
→ permanently blocks PM consolidation
```

A bounded implementation distinguishes two cases:

```text
If the formal TASK, at creation, revision, or formal approval, has already written “this log is required for acceptance” as a frozen deterministic prerequisite:
→ record the evidence gap and reject this acceptance attempt
→ PM decides whether to retest, rework, or change the contract

If the log is only a classifier recommendation:
→ expose the gap and the recommendation
→ PM decides based on risk and available evidence
```

The first branch is a contract-design illustration, not a claim that V1.9.7 automatically turns every missing attachment into a denial. If the current interface has no pre-frozen predicate, the correct behavior remains to record the evidence gap and hand the decision to PM.

## What V1.9.7 actually verified

The first-party candidate packet `V1.9.7-RAIL-ASSISTANCE-RC-20260822-001` for candidate code `9e4c6e6a` records the following. The packet distinguishes parent-source checks, candidate-code regression, and controlled restart loading; it should not be compressed into a claim that every result came from one identical evidence node:

- 10 consecutive passes of the fixed critical scenarios, with Runtime at 115/115 in each round;
- Runtime full regression at 1706/1706;
- Shell full regression at 936/936;
- passing Runtime typecheck, Shell production build, REPORT identity, and version-consistency checks;
- a controlled restart after which the process loaded V1.9.7, reported `health=ok`, and retained an online gateway, ownership of the single-writer lock by the current process, and a consistent project-root binding.

These figures are totals from test sets at different levels. They cannot be added together or read as equal coverage of all four rail-assistance dispositions. The available packet does not record the number of direct cases for `neutral`, `unknown_reconcile`, `waiting_dependency`, and `negative_list_denied`; this article therefore does not use 115, 1706, or 936 to claim complete validation of those boundaries. The next evidence packet should list named cases, expected dispositions, and observed results for each state.

This article does not use CodeFlowMu Open source or Open-edition test counts as product evidence.

The numbers support only the tested paths on the recorded Windows workstation, candidate code, and fixed test set. Parent-source checks, code regression, and restart loading are separate evidence nodes in the packet. They are not penetration testing, independent reproduction, formal verification, or a cross-platform reliability claim. The packet also preserves failures discovered in earlier change checks instead of overwriting them with final-release checks.

Version status requires the same care. The version files and live process report V1.9.7, while the release note still calls it a candidate and reserves final `RELEASED` authority for ADMIN. The rail should not release on behalf of ADMIN, and an article should not rewrite that boundary either.

## Residual risks

First, the frozen negative list is an engineering contract, not a complete threat model. Prompt injection, parameter escape, supply-chain risk, and external effects still require deeper security controls.

Second, one canonical fact kernel does not prove that every legacy endpoint consumes it. Regression tests and static scans reduce the risk of old adjudication paths returning; they cannot prevent future parallel classifiers from being introduced.

Third, technical recovery does not validate a business result. Restoring a process, recovering logs, or redelivering a REPORT does not replace content review or ADMIN judgment for high-impact action.

Fourth, the evidence is first-party. Stronger conclusions require independent reproduction, more crash points, multiple host and filesystem environments, and observation of real long-running teams.

## Audit your own rail

For each automation rule, answer:

1. What source produces the fact?
2. When evidence is missing, does the system say “unknown” or guess?
3. Is the output advice, or does it stop an operation?
4. If it stops, is the reason on a short frozen mechanical list?
5. Does it stop only the current operation, or does it close the business task?
6. Who owns the final decision, and is that decision bound to the current revision?
7. Do retry, cooldown, timeout, and recovery change only technical state rather than silently decide a business outcome?
8. Is there a test proving that classifier scores, elapsed time, and artifact gaps cannot silently become business verdicts?

The value of a rail is not that it decides everything for agents. It lets each agent work more autonomously within the right boundary while giving the team stable facts, controlled motion, and recoverable execution. **The more reliable the rail becomes, the clearer both agent autonomy and the ownership of business judgment should be.**

## Sources and evidence boundaries

For how this series distinguishes public specifications, private code excerpts, first-party execution records, and independent material, see [How to Read Engineering Evidence at the Digital Employee Works](../methodology/evidence-boundaries). The sources below still support only the specific claims stated in this article.

- [NIST AI RMF 1.0](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10) supports the general context of governance, accountable roles, and human oversight across an AI lifecycle. It neither defines an engineering rail nor certifies CodeFlowMu.
- [OWASP AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html) supports the general security need for explicit authorization, least privilege, and isolation around agent tool calls. It does not prove that every tool policy here is complete.
- [W3C PROV-O](https://www.w3.org/TR/prov-o/) is an independent provenance-modeling reference for separating facts, activities, and responsible agents. It does not prescribe this article's business-decision or recovery policy.
- V1.9.7 figures, interface excerpts, and controlled-restart observations are first-party candidate evidence, limited to the tested paths named here. They are not penetration testing, third-party reproduction, or cross-platform conclusions. Accessed 2026-08-23.
