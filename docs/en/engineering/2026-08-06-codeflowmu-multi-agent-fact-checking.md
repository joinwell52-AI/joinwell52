---
title: "One Agent Said ‘Done.’ The Team Refused to Believe It."
date: '2026-08-06'
column: open-source-engineering
category: daily
summary: "Hallucination may be unavoidable, but a role-separated multi-agent team can stop one agent's unsupported claim from becoming system fact."
item_id: WP13-CODEFLOWMU-FACT-CHECK
lifecycle: Published
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
outline: deep
---

<ArticleCover
  image="/assets/covers/wp13-codeflowmu-fact-check-cover-en.svg"
  kicker="Open-source Engineering · CodeFlowMu Field Case"
  title="One Agent Said ‘Done.’ The Team Refused to Believe It."
  summary="Hallucination may be unavoidable. A real multi-agent team uses independent roles and external facts to stop unsupported claims from acquiring system authority."
  version="WP-13"
  status="Field Case · 2026-08-06"
  languageHref="/zh/engineering/2026-08-06-codeflowmu-multi-agent-fact-checking"
  languageLabel="中文"
/>

# One Agent Said “Done.” The Team Refused to Believe It.

At 1:06 PM, a DEV subexecution returned `completed`.

Its summary looked polished. It described the implementation, the tests, the commit, and the remaining gaps. It looked like the kind of result a project manager could forward to QA without thinking twice.

But the same raw event contained three very different statements:

> The shell command returned no exit status, so its result is unknown — do not assume it ran or succeeded.
>
> Test results summary: Unconfirmed in this session.
>
> Commit SHA: Not available here.

On one side: “done.”

On the other: no confirmed command result, no confirmed tests, and no commit SHA.

This is one of the most dangerous failure modes in agentic software engineering. A model-generated uncertainty was about to become an organizational fact.

If PM had accepted the summary, QA would have received a delivery that did not yet exist. If QA had merely repeated DEV’s conclusion, the claim could have propagated into task status, reports, acceptance, and release.

That did not happen in WP-13.

The team refused to believe the agent.

## Hallucination happens inside one agent. Failure happens when the team treats it as fact.

Most conversations about hallucination prevention focus on making the model smarter: a larger model, a stronger prompt, another reflection pass, or a second model that reviews the first one.

Those techniques help, but they still depend on the same basic idea: ask a language model to correct a language model.

CodeFlowMu takes a different approach.

A multi-agent system is not several models taking turns writing. It is a team with distinct jobs, authority, and handoff boundaries:

- DEV implements the task and may make mistakes;
- PM decides whether delivery facts satisfy the task contract;
- QA re-verifies the result as a separate role;
- Runtime handles wake-up, scheduling, recovery, UI, and live activity streams, but should not replace business judgment;
- FCoP externalizes TASKs, REPORTs, REVIEWs, states, and events into a protocol surface that every role can inspect.

The goal is not to make hallucination impossible.

The goal is to make sure that a hallucination produced by one role cannot automatically acquire system authority.

> **Agents may be wrong. The organization must not make them right by default.**

## The live scene: while DEV was still reasoning, PM was already checking reality

The image below is not a reconstructed flowchart. It is a screenshot from the CodeFlowMu operating interface during the incident.

The left side shows the PM-facing task and fact-checking conversation. The right and lower areas preserve the live agent activity stream and visible reasoning summaries: files being inspected, tools being called, implementation scope being discussed, and status changing in real time.

![CodeFlowMu live scene: PM fact-check and agent activity stream](/assets/covers/wp13-codeflowmu-fact-check-live.png)

PM did not ask, “Are you sure you are done?”

A second confirmation from the same execution path would still be another language claim.

Instead, PM asked a different question:

> **Do the external facts prove that WP-13 is complete?**

Around 1:08 PM, the answer was no.

PM found that:

- no formal DEV REPORT existed;
- Git HEAD still pointed to the previous work package;
- required WP-13 test files were missing;
- Shell repeatedly returned `no exit status`;
- the subexecution itself admitted that tests were unconfirmed and the SHA was unavailable.

PM’s decision was immediate:

**Do not dispatch QA. Do not close the task. Do not create a duplicate replacement task. Continue the original task.**

That decision is the heart of the case. PM was not “a smarter writing agent.” PM was a different role with different authority, checking different facts.

## Five role actions turned a “done” claim back into a verifiable delivery

![The five-stage WP-13 fact-checking sequence](/assets/covers/wp13-codeflowmu-fact-check-process-en.svg)

### Act 1: DEV lost certainty at the tool boundary

Part of the implementation existed, but Edit, Shell, and Read calls repeatedly returned abnormal or incomplete status. The key problem was not merely that a tool failed. The tool could not provide a reliable exit status.

In engineering, there is a hard boundary between `unknown` and `success`.

No exit status means a command cannot be assumed to have run. No output means tests cannot be assumed to have passed. No commit means the work has not become a traceable delivery.

### Act 2: Subexecution produced a completion-like narrative

The subexecution was not malicious. It attempted to continue the work and produced a technically coherent plan.

But when tools could not confirm results, it still organized partial information into a narrative that sounded complete.

That is one of the strongest capabilities of language models — and one of the most dangerous in an execution system:

**they can turn incomplete and conflicting evidence into a coherent story.**

Coherence is not closure.

### Act 3: PM blocked the story from acquiring business authority

PM did not run a magical hallucination classifier. PM checked four external fact classes:

| Claim to prove | Fact source |
|---|---|
| Code actually exists | Files and disk diff |
| Delivery is traceable | Git commit |
| DEV formally handed off work | FCoP REPORT |
| Task contract is satisfied | Tests and typecheck |

None of the four evidence chains was complete, so PM refused release.

This is the key distinction: another role did not merely offer another opinion. It made a fact judgment under a different responsibility.

### Act 4: DEV completed the real delivery on the original task

After the tool channel recovered, DEV continued `TASK-20260805-019` instead of creating a new task that would hide the failure history.

Real artifacts then appeared:

- commit `609571ddb22d1fbb2bfb5e54692c07beeef4cf23`;
- 12 WP-13 files;
- `1230 insertions / 452 deletions`;
- formal `REPORT-20260805-037-DEV-to-PM.md`;
- observation tests: 3/3 PASS;
- activity-buffer + project-graph tests: 10/10 PASS;
- root-fault + log-center regression: 14/14 PASS;
- runtime typecheck: exit 0;
- production Active remained disabled;
- no real TaskDispatcher delivery path was changed.

Only then did “done” stop depending on DEV’s wording.

### Act 5: QA trusted neither DEV nor PM — it trusted re-execution

At 1:09 PM, after verifying the REPORT and commit, PM dispatched `TASK-20260805-020` to QA.

QA did not rewrite the DEV report. It reran the evidence checks in a separate role. At 1:11 PM, the live activity stream recorded the first completion statement backed by independent execution:

> All tests passed, 27/27. DEV’s reported 3+10+14=27 matches the actual result.

The final QA evidence included:

- 27/27 tests passed;
- typecheck exit 0;
- `git diff --check` exit 0;
- no TaskDispatcher changes in the commit;
- `production_active` remained false.

This was **role-separated QA verification**, not an external third-party audit. But it was enough to break the single-agent pattern of self-claim, self-approval, and self-closure.

## This was not “FCoP automatically detecting hallucination”

The easiest misunderstanding is to imagine that FCoP acted like a hallucination detector and discovered that DEV was lying.

It did not.

FCoP does not understand the business goal of WP-13, run tests, or judge whether a sentence is true. It is closer to a shared protocol surface for multi-agent work:

- TASK externalizes what should be done;
- REPORT externalizes what an agent claims it did;
- REVIEW externalizes who judged what, and on which basis;
- file location represents current state;
- append-only `transitions:` preserve the past;
- filenames expose identity, type, and routing to both humans and agents.

**FCoP does not think for the roles. It gives the roles a common set of facts to think with.**

In this case, PM could say no because missing REPORTs, state location, event history, and engineering evidence were inspectable outside DEV’s hidden context.

## Reading the FCoP repository changes how this case should be described

### 1. FCoP means Filesystem Coordination Protocol

“Filename as Protocol” is not the expansion of FCoP. It is the protocol’s core invariant.

The current FCoP formulation is:

> **Files carry protocol. Paths address state. Events replay transitions.**

That statement explains why WP-13 was reviewable:

- DEV’s “done” was a language claim;
- TASKs, REPORTs, paths, and events were externalized facts;
- PM and QA could inspect the same surface instead of trusting DEV’s private narrative.

### 2. FCoP is a behavioral governance protocol layer

The repository positions FCoP as the **behavior governance protocol layer** for multi-agent systems. It defines how agents report behavior, how results are reviewed, and how actions remain auditable inside capability boundaries.

That is more precise than calling it a file-based ticket system.

FCoP asks questions such as:

- What did the agent claim to do?
- How can another role verify it?
- Where is the authoritative current state?
- Is the transition history preserved?
- Are review and capability boundaries explicit?

### 3. FCoP is Agent POSIX, not Agent OS

The Boundary Charter is explicit:

> **FCoP is Agent POSIX, not Agent OS.**

It describes, externalizes, and coordinates. It does not execute, own, or orchestrate.

| FCoP is responsible for | FCoP is not responsible for |
|---|---|
| State semantics and legal transitions | LLM invocation and tool execution |
| TASK / REPORT / REVIEW file contracts | Waking agents and scheduling queues |
| Externalized event formats | Retry policy, heartbeat, and TTL |
| Audit and append-only history | Deciding which agent executes now |
| Capability declaration and review semantics | Concrete sandbox, process, and permission enforcement |

Therefore, this article should not say that FCoP scheduled PM, DEV, and QA to prevent hallucination.

The accurate statement is:

> **FCoP provided an observable, auditable, governable protocol surface. CodeFlowMu, as the application and Runtime, organized roles, woke agents, displayed the live scene, and enabled PM and QA to make judgments on that surface.**

### 4. CodeFlowMu is where FCoP becomes a working application

CodeFlowMu is not another name for FCoP.

It is a multi-agent development tool built on the FCoP protocol. It turns protocol semantics into an actual working team: PM, DEV, QA, OPS, and other roles have separate responsibilities; tasks move through lifecycles; execution appears in a live activity stream; failures can recover; and results can be handed off and reviewed.

The relationship can be summarized as:

```text
CodeFlowMu: makes work happen
FCoP: makes what happened reportable, reviewable, and auditable
```

Or, using the Boundary Charter’s stricter language:

```text
CodeFlowMu: Application / Runtime / Scheduler / UI
FCoP: Identity + Location + Event + Behavior Governance
```

That is why WP-13 is both a **CodeFlowMu application case** and an **FCoP field evidence case**.

It does not prove that a protocol can decide truth on behalf of people or agents. It proves that, when a team works through a shared protocol surface, one role’s unsupported claim does not easily overwrite facts available to other roles.

## The real value of multi-agent systems is organizational veto power

Imagine adding a Reviewer Agent that receives DEV’s answer:

> DEV: The task is complete.
>
> Reviewer: Looks reasonable. Approved.

That is still not a team. It is two models evaluating the same narrative.

Real role separation requires at least three properties:

1. **Different responsibilities** — DEV delivers, PM judges, QA verifies;
2. **Different fact sources** — every role cannot rely on the same natural-language summary;
3. **Different authority** — DEV cannot approve itself, QA cannot redefine PM’s task goal, and Runtime cannot replace business judgment.

FCoP provides the shared fact surface for the second property. CodeFlowMu provides the team and runtime boundaries for the first and third.

The key to hallucination prevention is therefore not the number of agents. It is the organizational structure.

> **Without role boundaries, multi-agent means multiple answers. With roles, fact sources, and authority boundaries, it becomes a team.**

## Hallucination may be unavoidable. Becoming organizational fact is not.

The most important result of this case is not the 27/27 test count. It is this boundary:

```text
model-generated completion claim
        ≠
protocol completion state
        ≠
business acceptance
```

Each transition requires different evidence and different roles.

### A tool call ending is not work completion

A tool returning `completed` proves at most that one invocation lifecycle ended. Without an exit status, the result remains `unknown`.

### Work completion is not business acceptance

Code, commit, REPORT, and tests may establish a DEV delivery. Acceptance still requires PM and QA to judge the task contract.

### Protocol state does not replace business judgment

In FCoP, path is the NOW truth and events preserve PAST transitions. But even `done` must not be casually reinterpreted as “the product has received final human approval.” Protocol semantics and business authority must remain precise.

## What should this case change? Improve the Runtime before expanding the protocol.

The FCoP repository includes another important principle: the protocol has entered a **Runtime Absorption Era**. New protocol mechanisms should come from demonstrated runtime pressure, not from a desire for theoretical completeness.

WP-13 first exposed CodeFlowMu Runtime problems:

- `no exit status` was not preserved clearly enough as `unknown`;
- subexecution completion and business completion could be visually confused;
- evidence contracts should be attached more explicitly to tasks;
- PM fact-check decisions need a lightweight immutable record;
- QA must remain role-separated and rerun verification.

These should be addressed first in CodeFlowMu’s Runtime, UI, status projection, and regression tests.

Only when multiple independent runtimes demonstrate that the existing FCoP file contract cannot express a necessary fact should protocol expansion be considered.

That restraint matters. If every application issue adds a field, state, or automated judgment to the protocol, FCoP will quickly grow from Agent POSIX into another Agent OS.

## Engineering requirements for multi-agent development tools

WP-13 leaves several direct requirements for CodeFlowMu and other agent platforms:

- make `unknown` a first-class state; missing exit status must never collapse into success;
- attach typed evidence contracts to tasks because code, UI, documentation, and operations work require different completion evidence;
- Runtime may surface `report_missing`, `commit_unreachable`, and `evidence_incomplete`, but should not manufacture business truth for PM;
- continue the original task after tool recovery instead of creating duplicate histories;
- keep QA separate from the executor and require actual reruns;
- preserve reachable TASK, REPORT, REVIEW, and event histories;
- add a regression case where subexecution returns `completed` without exit status, commit, or REPORT.

## Conclusion: a team allows an agent to be wrong without allowing the error to pass

WP-13 eventually passed 27 tests. That matters.

But the more important moment happened before the tests: one agent had already said “done,” and the system did not convert that confidence into success.

PM checked facts and said no.

DEV returned to the original task and completed the real delivery.

QA reran the evidence and only then returned PASS.

FCoP did not think for them or schedule them.

It did something more fundamental: it kept tasks, reports, states, and events outside any one agent’s private narrative.

CodeFlowMu placed those protocol facts inside a team with real role separation, giving different roles the authority to continue, reject, and verify.

> **A single agent tries to be right. A multi-agent team must remain reliable even when one agent is wrong.**

Hallucination may be unavoidable.

But when FCoP provides a shared fact surface, CodeFlowMu provides roles and a live runtime, and PM, DEV, and QA possess real functional separation, hallucination can remain a local error instead of becoming an incorrect delivery.

That may be the most practical and valuable form of “hallucination prevention” multi-agent systems can offer.

---

## Download the complete evidence package

This article is not a story reconstructed from memory. The original TASKs, DEV and QA REPORTs, Runtime JSONL, session excerpts, test results, commit patch, screenshots, and integrity manifest have been packaged for offline review.

- [Download the WP-13 multi-agent fact-checking evidence package (ZIP)](https://raw.githubusercontent.com/joinwell52-AI/joinwell52/main/docs/public/evidence/wp13-multi-agent-fact-checking/wp13-multi-agent-fact-check-publication-evidence-v3.zip)
- [View the attachment location on GitHub](https://github.com/joinwell52-AI/joinwell52/blob/main/docs/public/evidence/wp13-multi-agent-fact-checking/wp13-multi-agent-fact-check-publication-evidence-v3.zip)
- SHA-256: `5b5eda3034c822f13421783244b1d0c76a9fa79950bfad0ce61bb8d2e404131c`

The package supports review of the claims in this article, subject to the evidence boundary below: it demonstrates that DEV later produced a real delivery and received role-separated QA PASS. It does not establish external third-party certification, and it does not reinterpret the snapshot’s `review / pending` state as final business approval.

## FCoP references

- [FCoP repository: filesystem-driven agent coordination protocol](https://github.com/joinwell52-AI/FCoP)
- [Current FCoP v3 specification: files carry protocol, paths address state, events replay transitions](https://github.com/joinwell52-AI/FCoP/blob/main/spec/fcop-v3-spec.md)
- [ADR-0029: FCoP behavioral governance charter](https://github.com/joinwell52-AI/FCoP/blob/main/adr/ADR-0029-fcop-behavior-governance-charter.md)
- [ADR-0038: FCoP Boundary Charter — Agent POSIX, not Agent OS](https://github.com/joinwell52-AI/FCoP/blob/main/adr/ADR-0038-fcop-boundary-charter.md)
- [ADR-0039: Runtime Absorption Era](https://github.com/joinwell52-AI/FCoP/blob/main/adr/ADR-0039-fcop-freeze-discipline-and-runtime-absorption-era.md)

## Evidence boundary

This article is based on the WP-13 publication evidence package. The case demonstrates that DEV later produced a real delivery and received role-separated QA PASS. At the evidence snapshot, TASK-019 and TASK-020 remained `review / pending`; this article does not claim final PM approval or terminal task closure. QA was role-separated verification, not external third-party certification.
