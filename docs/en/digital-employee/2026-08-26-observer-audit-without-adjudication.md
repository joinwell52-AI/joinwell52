---
title: "Seeing a Problem Is Not Authority to Decide: Agent Audit and Adjudication Boundaries Through the Lens of Anywhere Agents"
date: '2026-08-26'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "How can an agent discover risk, preserve evidence, and alert a responsible role without allowing those observations to become blocking, approval, rejection, or lifecycle authority?"
summary: "Starting from a real CodeFlowMu EVAL projection defect, this study compares Yue Zhao's Anywhere Agents design for advisory audits, agent-io scope, and review-loop isolation with task-level separation between observation and adjudication."
sources: "Public primary sources and the bounded scope of access-controlled first-party evidence are listed in the article."
project_relevance: case-evidence
item_id: "EBR-20260826-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-26-observer-audit-without-adjudication-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-26-observer-audit-without-adjudication-cover.png"
  kicker="Digital Employee · Engineering Research"
  title="Seeing a Problem Is Not Authority to Decide: Agent Audit and Adjudication Boundaries Through the Lens of Anywhere Agents"
  summary="Observation can be deep and operationally useful. Whether it may block, approve, reject, or mutate lifecycle state must remain a separate authority boundary."
  version="EBR-20260826-02"
  status="Engineering Research · 2026-08-26"
  languageHref="/zh/digital-employee/2026-08-26-observer-audit-without-adjudication"
  languageLabel="中文"
/>

# Seeing a Problem Is Not Authority to Decide: Agent Audit and Adjudication Boundaries Through the Lens of Anywhere Agents

**An agent's ability to find a problem does not give it authority to decide whether a delivery passes or fails. Observation is evidence input; adjudication is governance authority. A reliable audit system therefore has to specify not only what an audit can detect, but also what consequences an audit result is allowed to cause.**

We recently repaired a real EVAL path in CodeFlowMu. We then read further into Yue Zhao's Anywhere Agents issue #35, commit `53bd8fa`, and the corresponding `style-audit.py`. The two engineering paths address different problems, yet converge on a similar boundary: **an observation may be visible, persistent, and influential without automatically acquiring the power to block, approve, reject, or mutate lifecycle state.**

**CodeFlowMu is a locally run multi-agent collaboration system that uses tasks, roles, gates, reports, and approvals to organize agent work into an execution chain that can be traced, recovered, and verified.** The narrow question here is not whether audit agents should be useful. It is: **who is authorized to turn an observation into a business consequence?**

## This is not an accidental overlap

Our interest in this line of work predates the present Anywhere Agents comparison. TMPA already cites **“Auditable Agents”** by Yi Nian, Aojie Yuan, Haiyue Zhang, Jiate Li, and Yue Zhao (arXiv:2604.05485) as reference [17]. That paper studies agent auditability. Yue Zhao's current public projects continue along a closely related engineering line.

`GRADE` represents an agent run as two graph layers: execution order and what each step depended on, while distinguishing observed, declared, and inferred dependency evidence. `auditable` pushes further into decision records and recovery: it captures the state a decision relied on, replays the decision against live state, and can route rollback when the original preconditions no longer hold. `awesome-auditable-ai` states the auditability goal directly: a system should be able to establish what an agent did, what it relied on, why it acted, and whether the action was right.

These projects are not one implementation lineage with CodeFlowMu or TMPA, and we do not treat any of them as feature evidence for our own system. The research overlap is nevertheless substantial: **execution logs alone are not enough; an auditable agent system also needs dependency, provenance, responsibility, and decision boundaries.** TMPA emphasizes multi-agent task governance and responsibility structure. CodeFlowMu operationalizes those questions through long-running tasks, gates, reports, and approvals. Yue Zhao's recent work approaches adjacent questions through run graphs, dependency structure, audit trails, replay / recovery, and practical agent tooling.

That is why Anywhere Agents appears here not because one commit merely “looks like CodeFlowMu,” but because it provides a concrete engineering slice of a research line we have already been following: **how auditability can become stronger while adjudication authority remains explicitly bounded.**

## 1. A real defect: 7 / 7 and 4 / 4 were green while the authority boundary was still wrong

CodeFlowMu uses EVAL for fact checking: inspect evidence, identify contradictions, and record observations. Formal acceptance belongs to an authorized review role. Those responsibilities are intended to remain separate.

A real path violated that separation. An EVAL report existed on a task whose lifecycle was already complete, yet the governance snapshot projected it as `acceptance=pending / formal_report_requires_acceptance`. The panel then placed it into a wait-for-PM acceptance state. Repeating approval could still reach the ordinary approval path, only to fail with HTTP 409 because the task was already done.

The more important detail is that the baseline was still green: **7 / 7 governance-kernel tests and 4 / 4 panel terminal-status tests passed.** The defect was therefore not “no tests.” The tests did not cover the deeper authority-propagation path:

**EVAL writes an observation → projection interprets it as a formal delivery → UI exposes pending-acceptance semantics → approve / reject becomes reachable**

The dangerous escalation did not begin with an agent deliberately exceeding its role. **Projection, API routing, and UI semantics added authority later.** A role boundary that exists only in a prompt or role description, but disappears in state projection and write paths, is not an implemented boundary.

## 2. Durable agent systems need at least four distinct powers

| Layer | Question | Legitimate effect | Must not silently do |
|---|---|---|---|
| Observation | What was found? | Preserve facts, contradictions, evidence references | Change the business conclusion |
| Attention | Who should look? | Create an actionable signal | Upgrade risk directly into rejection |
| Formal adjudication | Is this delivery accepted? | Accept, return, or reject with accountable reasoning | Pretend to be the underlying execution fact |
| Lifecycle write | What state does the task enter? | Apply an already authorized decision | Decide on its own whether content is “good enough” |

These layers can reference one another, but they cannot impersonate one another. **Observation is not approval. Attention is not rejection. A lifecycle write is not a business judgment.**

The repair therefore did not stop at hiding a button. At the data and API boundary, an EVAL report became “observation recorded; formal acceptance not applicable.” Repeated approve or reject returns `no_change / already_observed` while preserving several invariants: `action_taken=false`, no business decision, no lifecycle action, a byte-identical lifecycle task file, and unchanged acceptance requirements for ordinary DEV, QA, and OPS reports.

The repaired paths were verified separately: governance kernel **8 / 8**, panel terminal-state rules **6 / 6**, Web Panel / API **109 / 109**, and EVAL display closeout **18 / 18**. These numbers do not prove that every future UI, plugin, or integration lacks a bypass. They support a narrower claim: **on the named paths, an observation may be acknowledged without acquiring adjudication authority through a repeated request.**

## 3. The interesting part of Anywhere Agents is not merely “advisory only”

Anywhere Agents issue #35 began with a different engineering failure mode. Its writing-style audit was optional and partly reconstructed by each reviewer. Some semantic rules depended on hand-written `grep`; an observed shell-locale failure caused a grep to match nothing, making “the audit failed to run” look indistinguishable from “the prose is clean.”

The initial direction was straightforward: ship a deterministic script, trigger it from content rather than operator choice, and surface a `Style status` with verification-like discipline. But calibration revealed a second problem: **if mechanical style findings are injected into the formal review loop, an advisory can quietly become a requirement.** In one long session, review prompts themselves reportedly drew seven to twelve RULE-12 findings. RULE-12 flags sentences over thirty words and has no stable fixed point: splitting one sentence can create another long sentence. If each prose edit creates a diff and another review round, mechanical findings can keep an otherwise acceptable review open.

The maintainer constraint that followed is unusually clear:

> **The style audit must be visible, but it must never be able to hold the review loop open.**

The constraint is implemented structurally rather than left as prose. The audit runs at fixed points outside the round loop—pre-flight before Round 1, or report-only after PASS. Normal audit outcomes do not block through exit status. Findings stay out of reviewer prompts, Round history, and the final verdict. `CLEAN`, `FINDINGS: N`, `SKIPPED`, and `FAILED` can all be observable without their values becoming verdict authority.

That separates two questions that are often collapsed:

> **“Did the audit run, and is its result visible?” is one question. “May that result block the process?” is another.**

## 4. The `agent-io` detail: stronger consequences require stronger trust boundaries

Commit `53bd8fa` adds another useful distinction. The writing-style guards had largely scoped by file extension, so prose an agent was authoring and text it was merely carrying—dispatch prompts, captured review output—could be treated alike. The author reports 2,227 advisory lines across 34 session transcripts, with substantial prose-extension traffic in scratch areas used by the review loop.

One part of the repair lets callers mark carried text under `agent-io`. But not every guard gives that marker the same trust:

| Anywhere Agents behavior | Cost of a false exemption | Trust placed in `agent-io` |
|---|---|---|
| Advisory message | At worst, one advisory is missed | Marker can be trusted relatively broadly |
| Deny gate | A real writing restriction could be bypassed | Marker is accepted only under a temporary root containing no repository, after symlink resolution |

The more general principle matters more than the directory name:

> **The stronger the consequence, the stronger the authorization and evidence threshold should be.**

If a marker only decides whether to print another advisory, a mistaken exemption has limited effect. If the same marker can bypass a deny gate, it cannot become a one-token escape hatch. The commit explicitly considers the possibility of a path such as `repo/agent-io/proposal.md` masquerading as carried text to evade a real prose restriction.

The same evidence discipline appears in `style-audit.py`. It audits the **staged blob**, not the working tree, because filtering working-tree content with staged line numbers can both miss what is actually being committed and attribute unstaged content to the commit. The change reports a reduction from 359 whole-file historical findings to two findings on changed lines. Those are source-reported engineering measurements, not an independently reproduced accuracy result. The stronger point is methodological: **the object being audited should be the object actually under review.**

## 5. Two independent paths converge on consequence separation

CodeFlowMu's defect occurs in task governance; Anywhere Agents is working at writing guards and review-loop semantics. They are not the same implementation, and neither validates the other. But their structures can be compared without forcing equivalence:

| Anywhere Agents | CodeFlowMu |
|---|---|
| Style audit produces findings | EVAL produces observations |
| Audit result is visible but does not enter verdict | Observation is recorded but is not formal acceptance |
| `Style status` may exist while its value does not gate PASS | `already_observed / no_change` creates no business decision |
| Higher-consequence deny gate demands a stronger `agent-io` trust boundary | accept / reject / lifecycle writes demand stronger formal authority |
| staged blob + changed-line scoping keeps audit object aligned | byte-identical lifecycle file proves observer action did not mutate task state |

CodeFlowMu also encountered a related trap: if the Runtime should not adjudicate business quality, should everything outside a short negative list be `default allow`? That proposal was BLOCKED before product-code change. The reason is the same: **default allow is still an adjudication.** Non-adjudication does not mean always saying Yes; it means making decisions only over facts for which the system actually owns mechanical authority.

A mature supporting layer therefore needs more than `ALLOW / DENY`. It also needs concepts such as `OBSERVE / ATTENTION / REVIEW REQUIRED`, keeping “I found a problem” orthogonal to “I am authorized to decide it.”

## 6. A next question: can provenance travel while remaining orthogonal to authority?

Anywhere Agents already distinguishes text the agent **authored** from text it **carried** at a concrete engineering boundary. CodeFlowMu is distinguishing what was **observed** from what was **formally decided**. A useful next question is not how to give observers more power, but how to make evidence relationships more explicit without coupling provenance to authority.

Could provenance types such as `authored / carried / observed / generated` travel across tool calls, agent handoffs, and review chains while remaining orthogonal to the authority to block, approve, reject, or mutate state?

For CodeFlowMu, a more complete responsibility chain could become:

**observation → cited by a formal review → adopted / partially adopted / rejected by reviewer → formal decision → controlled lifecycle write**

rather than:

**observation → state change**

The first structure preserves audit value and accountable authority. The second looks more autonomous while erasing the most important governance boundary.

## Conclusion: the stronger the audit, the clearer its non-authority should be

An audit agent does not become weak because it lacks the final signature. It can inspect evidence deeply, expose contradictions, retain provenance, raise risk, and change what an accountable reviewer ultimately decides. What needs separation is the consequence: **an observation must not automatically inherit business authority.**

What is particularly useful in Anywhere Agents issue #35 and commit `53bd8fa` is that the work did not stop at “make the style audit run reliably.” It continued to ask how to make the audit visible without allowing it to control the review loop. CodeFlowMu's EVAL defect exposes the same class of risk from another direction: even when the observer itself lacks approval authority, projection, UI, and API routing can attach adjudication semantics later.

The shared lesson is therefore narrower than “audits should be advisory”:

> **Audit is not a weaker form of adjudication. It is a separate evidence channel.**

> **Seeing a problem is not authority to decide it. The stronger the consequence, the stricter the authority and evidence boundary should be.**

---

## Public evidence

- [**A2 baseline, repair, and repeated-operation trace (CSV)**](/evidence/execution-boundary-20260826/v2/case-a2-observer-semantic-trace.csv)
- [**A2 sanitized test transcript (GitHub)**](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/transcript-a2.md)
- [**Claim-to-evidence map (GitHub)**](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/claim-evidence-map.csv)
- [**Public, sanitized four-case Execution Boundary evidence note**](/zh/digital-employee/2026-08-26-execution-boundary-evidence-data)

## Sources and evidence boundary

### Public Yue Zhao research and engineering context

- [**“Auditable Agents”**](https://arxiv.org/abs/2604.05485), Yi Nian, Aojie Yuan, Haiyue Zhang, Jiate Li, and Yue Zhao, 2026. TMPA already cites this work as reference [17]. It is used here to establish continuity of research interest, not to imply that subsequent repositories are direct implementations of the paper.
- [**GRADE**](https://github.com/yzhao062/grade): used as background for execution / dependency two-layer run representation and observed / declared / inferred dependency evidence.
- [**auditable**](https://github.com/yzhao062/auditable): used as background for decision dependency capture, live-state replay, and rollback.
- [**Awesome Auditable AI**](https://github.com/yzhao062/awesome-auditable-ai): used as background for the public auditability / reliability problem map.
- [**Anywhere Agents issue #35**](https://github.com/yzhao062/anywhere-agents/issues/35): used for the design evolution from optional hand-rolled audit to deterministic scripting, and the later discussion of `Style status`, review-body injection, and review-loop blocking risk.
- [**Anywhere Agents commit `53bd8fa`**](https://github.com/yzhao062/anywhere-agents/commit/53bd8fa43c7339ae9958c03c55434fac7baddaf3), 2026-08-25: used for `agent-io` scope, different trust depth between advisory and deny behavior, and the construction that keeps advisory findings out of reviewer prompts, Round history, and final verdict.
- [**`style-audit.py` at the referenced commit**](https://github.com/yzhao062/anywhere-agents/blob/53bd8fa43c7339ae9958c03c55434fac7baddaf3/skills/implement-review/scripts/style-audit.py): used to verify staged-blob auditing, changed-line scoping, and the “advisory by construction” rationale.

Figures such as 34 session transcripts, 2,227 advisory lines, and 359→2 findings are measurements reported by the Anywhere Agents author in the cited issue / commit. They were not independently reproduced here and are not treated as universal accuracy or effectiveness metrics.

### CodeFlowMu

The CodeFlowMu claims are limited to the named paths covered by the public A2 evidence. That record supports that the 7 / 7 and 4 / 4 baselines did not cover the observed defect; after repair, governance was 8 / 8, panel rules 6 / 6, Web Panel / API 109 / 109, and EVAL closeout 18 / 18. Repeated EVAL approve / reject creates no business decision, performs no lifecycle action, and leaves the lifecycle task file unchanged.

This evidence **does not prove** that every future UI, plugin, or external integration lacks a bypass; it does not establish that EVAL observations are always correct; and it does not show that a complete provenance / responsibility chain is already implemented. Raw logs, task contents, and local machine paths are not public. Conclusions should be read with the corresponding version, test sets, and evidence boundary.