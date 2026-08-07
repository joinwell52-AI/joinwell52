# Reading Record — Q-20260807-01 Role-owned durable runtime with verification-gated Digital Employee self-evolution

- **Queue item:** `Q-20260807-01`
- **Column:** Digital Employee
- **Selection status:** Selected
- **Priority:** P0
- **Skill invoked:** `Skill 03 — Deep Reading`
- **Operating date:** 2026-08-07 (Asia/Shanghai)
- **Primary source class:** Author technical report / primary research artifact

## Reading scope

This pass reads *Argus: A General-Purpose Agentic Runtime for Long-Horizon Reasoning — Verification-Guided Persistence, Pivoting, and Runtime Self-Evolution* as evidence about durable campaign state, bounded missions, role-owned authority, verification-gated state admission, completion verdicts, operator escalation and longitudinal evaluation. It records source claims and evidence without deciding how CodeFlowMu, FCoP or a Digital Employee runtime should adopt the design. No Research Analysis or article drafting is performed.

## Deep Reading output

```yaml
reading_notes:
  problem:
    - Long-horizon work can require changing an operational objective while preserving the standing user intent; without explicit evidence and authority, such a pivot is indistinguishable from goal drift.
    - Continuity fails when evidence disappears with provider-session context, acceptance fails when the executor declares its own completion, and experience fails when rejected routes are discarded with the final artifact.
    - The selected question is how a persistent runtime can preserve durable intent, divide work into bounded missions, assign explicit ownership, gate reusable state changes on evidence and pause when a decision belongs to an operator.

  facts:
    - Argus defines the long-lived object as a campaign with persistent identity and objective rather than a provider transcript.
    - Campaign work is divided into bounded missions with explicit outcomes; the scheduler assigns one mission at a time and advances at a clean mission boundary.
    - Mission assignment is described as transactional to prevent duplicate work under concurrency, and resumed execution is tied to persistent campaign identity.
    - Four model-driven roles divide authority: Manager anchors objective and campaign state; Planner selects work; Engineer implements and evaluates; Reviewer independently inspects artifacts and execution records when required or requested.
    - Engineer and Reviewer calls use fresh provider sessions. Cross-session continuity is carried by shared durable state including CHECKPOINT.md, evidence references, open questions, artifacts and an append-only event record.
    - The canonical timeline is a typed append-only trace; user interfaces are projections over that record.
    - Completion verdict provenance is explicit. Low-risk bounded work may use recorded Engineer self-review when policy permits; otherwise a fresh Reviewer issues done, continue or blocked, and stage-closing or policy-required independent review cannot be waived.
    - The report-level working contract separates standing intent, current operational objective, constraints and verification criteria, plus a distinct user-visible state for clarifications, priorities and unresolved questions.
    - Runtime self-evolution is explicitly fixed-model: model parameters remain unchanged while admitted memories, skills, verifiers, routing decisions, task definitions, rejected routes and other persistent state may change future missions.
    - Ownership is not uniform: memory and skill candidates are produced by an execution role and retained through an authorized commit path; routing is Manager-committed; task definitions are Planner-authored and scheduler-committed; stage checklists are Planner-owned with Reviewer feedback.
    - A candidate is not reusable merely because a role produced it. Admission requires the task-native evidence available for that surface plus an authorized owner decision.
    - The runtime can pause for operator-owned decisions; the public traces do not provide a measured zero-touch rate.

  research_results:
    - On 731 SWE-Bench Pro tasks, 466 used an independent Reviewer and 265 used Engineer self-review.
    - The independent Reviewer requested revision on 43 tasks; after another Engineer round, 34 later passed the official verifier and 22 completed the stricter independent-review rescue loop. A further 35 were reported blocked rather than complete.
    - The report states approximately 78% SWE-Bench Pro accuracy versus 59% for Direct Copilot at 1.41x aggregate tokens.
    - The startup-to-mature comparison reports 21% fewer solve input tokens and 15% less active workflow time per task in mature waves than startup waves.
    - Six paper-production campaigns reached submission-stage completion across 640 aggregate campaign-hours, 254 bounded missions, 576 Engineer rounds, 286 Reviewer revision verdicts, 89 session rolls and 16 Manager rollbacks.
    - The report explicitly states that manuscript completion does not establish venue acceptance, novelty or external peer review.
    - One paper-production campaign retained a stale blocked assurance snapshot after the canonical pipeline and final PDF were complete, exposing a synchronization inconsistency between derived certification state and canonical pipeline state.

  mechanisms:
    - The runtime separates control, execution and records planes so scheduling, work execution and record keeping have distinct surfaces.
    - A mission produces a trajectory and candidate state update; the responsible role checks artifacts and task-native evidence; the authorized owner commits, revises or rejects it; later missions retrieve only the retained state.
    - Review operates over the same actual artifact state and execution record rather than only an Engineer summary.
    - Full process history and a bounded reviewed checkpoint serve different purposes: the event tape preserves states, actions, measurements, failed branches and verdicts, while the checkpoint compresses decision-relevant state for the next mission.
    - Rejected routes can be retained as verified exclusions so later missions can avoid repeating them and can use their evidence when proposing a pivot.
    - Manager stage transitions can hold, advance or roll back; a Reviewer continue verdict routes work back to Engineer, while accepted or blocked outcomes return authority to Manager.
    - User or Manager authority is required for material contract refinement according to the report's distributed admission model; the analytical ManagerAdmit notation is explicitly not one atomic production API.

  evidence:
    - The full arXiv HTML report exposes the runtime architecture, role table, state-transition model, mission boundary semantics, verification-gated admission rules, evaluation methodology, results tables and explicit limitations.
    - Reviewer-intervention Table 11 records 466 independent reviews, 265 Engineer self-reviews, 43 revision requests, 34 official-verifier recoveries and 22 strict review-loop rescues.
    - The paper-production case records repeated rollbacks and session replacements and also exposes one stale assurance-state inconsistency rather than hiding it.
    - The report distinguishes benchmark-native results, model-generated review snapshots, external verifiers and qualitative internal-user observations instead of treating them as one evidence class.

  limitations:
    - User-guided pivots are not publicly evaluated in a prospective collaboration study; internal examples are qualitative motivation only.
    - Explicit authority and evidence reduce but do not eliminate goal drift: a Manager or operator can approve a poor tradeoff, and standing intent can omit tacit requirements.
    - The report-level contract projection spans several runtime surfaces rather than one atomic transaction.
    - Verification is only as sound as the property encoded by the test, formal checker, benchmark or model Reviewer; passing the current verifier does not prove the verifier is correct.
    - The startup-to-mature SWE-Bench Pro comparison is observational, follows one task order and does not isolate the causal contribution of memory, role separation, review or routing.
    - Reviewer routing is adaptive rather than randomized, so reviewer sensitivity and false-acceptance rate are not established by the reported run.
    - The seven benchmark arenas use different metrics, hardware and execution protocols and are not normalized into a universal score.
    - The six paper campaigns come from one shared research environment; review snapshots are model-generated, logging evolved across projects, and submission completion does not demonstrate paper acceptance, scientific novelty or superiority to human research teams.
    - A stale assurance snapshot in one completed paper pipeline demonstrates that derived certification state can lag canonical workflow state.

  comparisons:
    - The source contrasts durable campaign state with provider transcripts: provider sessions can be fresh each round while accepted evidence and next-step state survive independently.
    - The source distinguishes self-review from independent review by policy and risk rather than requiring independent Reviewer involvement on every low-risk mission.
    - The source distinguishes process evidence from final artifacts: failed branches and review decisions may carry future value even when they are absent from the final deliverable.
    - The source distinguishes fixed-model runtime self-evolution from model training; only runtime state and control policy change in the reported system.

  contradictions:
    - The report presents completion and assurance as governed surfaces, yet one paper campaign reaches canonical submission completion while a stored assurance object remains blocked. The authors treat this as a synchronization failure requiring reconciliation, not as evidence that the blocked verdict was equivalent to completion.
    - Mature-wave token and time reductions coexist with late difficult waves that rise again in both solve input and active time, so accumulated state is not shown to cause monotonic efficiency improvement.
    - Independent review redirects and rescues some work, but the current evidence does not establish that independent review is always superior because routing is adaptive and the compared tasks differ in difficulty and resource use.

  unresolved_questions:
    - How should a runtime make the standing intent and material contract refinements atomic enough that partially applied authority updates cannot leave inconsistent durable state?
    - Which state surfaces require independent review, official executable verification, permitted self-review or direct operator approval as risk changes?
    - How should an operator disagreement with Manager or Reviewer state be represented and rolled back without erasing the evidence that produced it?
    - What measured operator-intervention rate and clarification quality appear in prospective real-user studies?
    - Can matched frozen-state runs isolate the causal value of memory, skills, review and routing separately from task-order effects?
    - How should derived assurance views be reconciled transactionally with canonical campaign state so stale certification cannot be presented as current truth?
```

## Source traceability

1. arXiv record: `https://arxiv.org/abs/2608.05144`
2. Full primary HTML: `https://arxiv.org/html/2608.05144`
3. arXiv PDF: `https://arxiv.org/pdf/2608.05144`
4. Today's Research Plan: `research/runtime/plans/2026/08/2026-08-07-plan.json`
5. Skill 03: `research/skills/03-deep-reading.md`

## Reading gate decision

**Result:** Deep Reading completed from the full primary technical report. The Reading Result preserves role ownership, mission boundaries, completion-verdict provenance, verification-gated state admission, operator-owned decisions, longitudinal evidence and the report's explicit causal and certification limitations. No Research Analysis, architecture recommendation or article was produced.
