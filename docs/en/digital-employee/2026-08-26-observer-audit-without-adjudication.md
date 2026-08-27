---
title: "Seeing a Problem Is Not Authority to Decide: Why Agent Auditing Must Be Separated from Formal Acceptance"
date: '2026-08-26'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "How can an agent discover risk, preserve evidence, and alert a responsible role without having those observations automatically become acceptance, rejection, or lifecycle decisions?"
summary: "Starting from a real CodeFlowMu EVAL projection defect and comparing it with Anywhere Agents' advisory audit, this study separates observation, attention, formal adjudication, and lifecycle writes."
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
  title="Seeing a Problem Is Not Authority to Decide: Why Agent Auditing Must Be Separated from Formal Acceptance"
  summary="An audit agent may discover problems, preserve evidence, and alert a responsible role. Those capabilities must not silently become authority to approve, reject, or move task lifecycle state."
  version="EBR-20260826-02"
  status="Engineering Research · 2026-08-26"
  languageHref="/zh/digital-employee/2026-08-26-observer-audit-without-adjudication"
  languageLabel="中文"
/>

# Seeing a Problem Is Not Authority to Decide: Why Agent Auditing Must Be Separated from Formal Acceptance

**An agent's ability to discover a problem does not give it authority to decide whether a delivery passes or fails. Observation is evidence input; adjudication is governance authority. If a runtime connects both to the same interface or UI path, an observer can quietly become an approver without ever being granted that responsibility.**

## Start with the actual failure

**CodeFlowMu is a locally run multi-agent collaboration system that uses tasks, roles, gates, reports, and approvals to organize agent work into an execution chain that can be traced, recovered, and verified.**

Within that system, EVAL is used for fact checking: it reads evidence, identifies contradictions, and records observations. Formal acceptance belongs to authorized review roles. Those responsibilities are supposed to remain separate.

One real path showed that the separation had broken down. An EVAL report existed on a task whose lifecycle was already complete, but the governance snapshot projected it as `acceptance=pending / formal_report_requires_acceptance`. The panel then routed that report into a wait-for-PM acceptance state. If approval was repeated, the request could still reach the ordinary approval path and only then fail with HTTP 409 because the task was already done.

The more important detail is that the baseline tests were green when this defect existed: **7/7 governance-kernel tests and 4/4 panel terminal-status tests passed.** The system had tests; they simply did not cover the user path where an observation acquired formal acceptance semantics.

That turns the incident from a labeling bug into an authority-boundary bug:

> **EVAL had observation authority, but projection and API routing attached adjudication semantics to it.**

---

## 1. An agent system needs at least four distinct powers

Human teams already distinguish finding a problem from signing a decision. Durable agent systems need that separation in schemas and interfaces rather than relying on prompt wording.

| Layer | Question | Legitimate effect | Must not silently do |
|---|---|---|---|
| Observation | What was found? | Preserve facts, contradictions, and evidence references | Change the business conclusion |
| Attention | Who should look? | Create an actionable signal for a responsible role | Upgrade risk directly into rejection |
| Formal adjudication | Is this delivery accepted? | Accept, return, or reject with accountable reasoning | Pretend to be the underlying execution fact |
| Lifecycle write | What state does the task enter? | Apply an already authorized decision | Decide on its own whether the content is “good enough” |

These layers can reference one another, but they cannot impersonate one another.

**Observation is not approval. Attention is not rejection. A lifecycle write is not a business judgment.**

If a fact-checking report becomes “awaiting acceptance” merely because it lives in a report collection, the system has confused a data-shape similarity with an authority equivalence.

---

## 2. The dangerous escalation can happen in projection, not in the agent

Many authorization failures do not begin with an agent deliberately exceeding its role. The extra power is added later by projection or routing.

That is what happened here. EVAL wrote an observation. The governance snapshot supplied “formal acceptance required.” The panel routed the record into a wait-for-PM state. Ordinary approve/reject handling became reachable.

The escalation can be compressed into one line:

**EVAL observation → projected as formal report → shown as awaiting acceptance → ordinary decision path reachable → lifecycle boundary blurred**

No individual step looks dramatic. Most of them resemble harmless component reuse. In combination, however, an observational artifact gains a business consequence it was never supposed to carry.

This leads to a broader engineering rule:

> **Role authority must survive projection, API routing, and state transition—not just the agent prompt or role definition.**

If the backend says EVAL is non-adjudicatory while the UI still exposes an approval path, non-adjudication has not actually been implemented.

---

## 3. The repair was not “hide the button”; it removed adjudication semantics from the observation

The important change was not cosmetic. The EVAL report was reclassified as **an observation already recorded, not a delivery awaiting formal acceptance**.

After the repair, repeated approval or rejection of an EVAL report returns:

`no_change / already_observed`

The strings matter less than the invariants behind them:

- `action_taken=false`;
- no new business decision is created;
- no lifecycle action is triggered;
- the lifecycle task file remains byte-identical;
- ordinary DEV, QA, and OPS report acceptance remains unchanged.

The system can therefore say:

> “This observation has already been recorded.”

It cannot smuggle in:

> “Therefore the task is approved.”

or:

> “Therefore the task is rejected.”

The repair trail is more informative than a single final green check:

| Check | Result | What the result actually establishes |
|---|---:|---|
| Governance kernel | 8 / 8 | EVAL no longer requires formal acceptance |
| Panel terminal-state rules | 6 / 6 | EVAL is projected separately from ordinary pending acceptance |
| Web Panel / API | 109 / 109 | repeated approve/reject produces audited no-change |
| EVAL display closeout | 18 / 18 | historical conflict can remain visible without manufacturing a current decision |

These figures do not prove that every future UI, plugin, or extension lacks a bypass. They do support the bounded conclusion for the named paths: **an observation may be acknowledged repeatedly without acquiring the power to move task lifecycle state.**

---

## 4. Non-adjudication does not mean default allow

There is another subtle trap.

Once we decide that the Runtime should not make business judgments, a tempting implementation is: deny a small set of explicit bad conditions and `default allow` everything else.

That sounds neutral. It is not.

The moment the Runtime says “allow,” it has answered a business question:

> **May this work proceed now?**

CodeFlowMu's engineering record contains a proposal for negative-list-only default allow that was BLOCKED before product-code modification. The public A2 evidence records the same case as `default-allow-proposal`: considered, then stopped during boundary review.

That makes non-adjudication more precise:

> **Non-adjudication is not always saying Yes. It is deciding only facts for which the system actually owns mechanical decision authority.**

Identity mismatch, a closed root task, or a clearly missing required authorization can be hard gates. Whether a design is good enough, whether a report should be accepted, or whether a risk is sufficient to reject a delivery belongs to an accountable review role.

A mature supporting runtime therefore needs more than:

**ALLOW / DENY**

It also needs concepts such as:

**OBSERVE / ATTENTION / REVIEW REQUIRED**

so that “I found a problem” cannot silently become “I have authority to decide it.”

---

## 5. Anywhere Agents provides an independent external comparison

Yue Zhao's Anywhere Agents commit `53bd8fa`, dated 2026-08-25, addresses a different but structurally similar boundary.

Its writing-style guards had been relying heavily on file extensions and therefore scanned two very different kinds of text: prose an agent was actually authoring, and dispatch prompts or review output it was merely carrying. The author reports 2,227 advisory lines across 34 session transcripts. Some text under scratch directories belonged to the review loop itself; rewriting it as if it were authored prose would change instructions or falsify carried history.

The commit introduces an `agent-io` scope for carried text and keeps the style audit **advisory only**. More importantly for this article, the audit is deliberately kept beside the formal review loop rather than inside its verdict path: it always exits 0, and its findings stay out of the reviewer prompt, Round history, and final verdict. It therefore cannot hold the review loop open or sign the review result by itself.

This is not the same implementation or business layer as CodeFlowMu.

**Anywhere Agents:** authored / carried boundary → advisory audit does not become verdict

**CodeFlowMu:** observation / delivery boundary → EVAL does not become formal acceptance or lifecycle decision

The shared structural choice is narrower:

> **Audit information may be deep and useful, but whether it has business effect must be governed by a separate authority boundary.**

The Anywhere Agents commit does not validate CodeFlowMu, and CodeFlowMu's A2 evidence does not establish that the Anywhere Agents approach generalizes to every agent system. The comparison is about architecture: **an observation can inform a decision without becoming the decision itself.**

---

## 6. Why this matters more for digital employees

In a human team, when QA, an auditor, or a fact checker writes “there is a problem here,” people usually understand that this is not yet the final business decision.

Agent systems do not inherit that social distinction automatically.

Without an explicit schema/API/UI boundary, an observation can travel through automation as:

**risk found → automatic reject → lifecycle transition → task closed**

No single component may look obviously malicious or even obviously wrong. The systemic failure is that **nothing stops observation from crossing into adjudication.**

A durable digital-employee runtime therefore needs to preserve at least three distinct facts:

**observation fact → formal decision → lifecycle result**

They may reference one another, but each should retain its own author, evidence, and authority source. That lets an auditor answer:

- Who discovered the problem?
- Who actually made the decision?
- Which observations informed that decision?
- Which controlled action changed task state?
- If the observation is later shown to be wrong, can the business decision be reviewed separately?

That is a much stronger governance record than a single `approved=true` or `risk=high` flag.

---

## 7. The next step is not a stronger EVAL; it is a clearer evidence relationship

This repair establishes a negative boundary: **EVAL must not obtain business decision authority through ordinary approve/reject handling.**

It does not prove that a complete audit-governance model already exists. The next research step is to make observations more traceable without expanding their authority.

A future observation record, for example, could link:

- observation ID;
- observer and run;
- inspected subject;
- rule or factual source;
- supporting evidence;
- the formal review that cited it;
- whether the reviewer adopted, partially adopted, or rejected it;
- the controlled lifecycle action that ultimately followed.

The responsibility chain then becomes:

**observation → reviewed → formal decision → state change**

rather than:

**observation → state change**

The latter looks more autonomous. In practice, it removes the most important accountability boundary.

---

## Conclusion: the most important audit capability may not be “being right”

Why should an audit agent not sign for the team?

Because its first responsibility is to increase visibility, not to expand authority.

A strong observer may find contradictions, preserve evidence, identify risk, and sometimes see more detail than the final decision-maker. Whether a delivery is accepted, however, is a different responsibility. Separating the two does not weaken the agent; it protects the collaboration system's accountability.

The lesson from this case is therefore not “audit agents must be read-only.” It is narrower and more useful:

> **Observations may write evidence; they must not automatically write conclusions.**

> **Seeing a problem is not authority to decide it. Being able to alert is not the same as being able to sign.**

In a digital-employee system, the most dangerous failure may not be one incorrect model judgment. It may be an unaccountable component quietly acquiring the ability to change business state.

---

## Public evidence

- [**A2 baseline, repair, and repeated-operation trace (CSV)**](/evidence/execution-boundary-20260826/v2/case-a2-observer-semantic-trace.csv)
- [**A2 sanitized test transcript (GitHub)**](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/transcript-a2.md)
- [**Claim-to-evidence map (GitHub)**](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/execution-boundary-20260826/v2/claim-evidence-map.csv)
- [**Public, sanitized four-case Execution Boundary evidence note**](/zh/digital-employee/2026-08-26-execution-boundary-evidence-data)

## Sources and evidence boundary

### Anywhere Agents

- [**Yue Zhao / Anywhere Agents commit `53bd8fa`**](https://github.com/yzhao062/anywhere-agents/commit/53bd8fa43c7339ae9958c03c55434fac7baddaf3), reviewed 2026-08-26. This article cites its Agent I/O scope and advisory-audit design: carried text is distinguished from authored text, advisory findings stay out of the reviewer prompt, Round history, and final verdict, and the audit is constructed not to block the review loop. Counts such as 34 session transcripts, 2,227 advisory lines, and 359→2 findings are source-reported and were not independently reproduced here.

### CodeFlowMu

The CodeFlowMu claims in this article are limited to the named paths covered by the public A2 evidence. The record supports that the 7/7 and 4/4 baselines did not cover the observed defect; after the repair, governance was 8/8, panel rules 6/6, Web Panel/API 109/109, and EVAL closeout 18/18. Repeated EVAL approve/reject returns audited no-change, creates no business decision, performs no lifecycle action, and leaves the lifecycle task file unchanged.

This evidence **does not prove** that every future UI, plugin, or external integration lacks a bypass; it does not establish that EVAL observations are always correct; and it does not show that a complete provenance or responsibility chain is already implemented.

Raw logs, task contents, and local machine paths are not public. Conclusions should be read together with the corresponding version, test sets, and evidence boundary.
