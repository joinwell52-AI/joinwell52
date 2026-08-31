---
title: "CodeFlowMu Engineering Record (II): Session Identity Cannot Be Self-Asserted — Building a Verifiable Execution-Evidence Boundary"
date: '2026-08-28'
updated: '2026-08-31'
column: digital-employee
category: daily
article_type: engineering-analysis
edition: research-center
research_question: "When a skill invocation carries a session_id, how should the Runtime distinguish a caller claim, authoritative Session facts, and auditable execution evidence?"
summary: "Historical CodeFlowMu skill journals exposed a deeper problem than a missing field: even when a session_id is present, it cannot become trusted execution evidence merely because the caller supplied it. V2.1.2 makes the Runtime verify ordinary skill calls against SessionStore across task, thread, session, agent and caller, with verified, sessionless/not_applicable and invalid_claim distinguishing trusted binding, legitimate no-session operation and unsupported identity claims."
sources: "/en/research/evidence/2026-08-28-skill-session-evidence"
project_relevance: substantive-relationship
item_id: "RBE-20260828-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-28-skill-session-evidence-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-28-skill-session-evidence-cover.png"
  kicker="CodeFlowMu Engineering Record · 02"
  title="Session Identity Cannot Be Self-Asserted — Building a Verifiable Execution-Evidence Boundary"
  summary="Seeing a session_id in a log only proves that someone wrote that string. Turning it into execution evidence requires the Runtime to check its own authoritative Session facts."
  version="RBE-20260828-03"
  status="Engineering Analysis · Revised 2026-08-31"
  languageHref="/zh/digital-employee/2026-08-28-skill-session-evidence"
  languageLabel="中文"
/>

# CodeFlowMu Engineering Record (II): Session Identity Cannot Be Self-Asserted — Building a Verifiable Execution-Evidence Boundary

A skill-invocation log can look complete: task identifier, skill name, `outcome=ok`, timestamp and even an integrity digest.

But one additional question can expose the evidence boundary immediately:

**Which real Agent Session did this invocation actually belong to?**

## What is CodeFlowMu, and why does Session identity become core evidence?

CodeFlowMu is a **local-first multi-agent collaboration and digital-employee runtime**. Different role agents execute work continuously inside controlled workspaces, while the Runtime maintains task objects, threads, Sessions, tool calls, Activity, recovery state and audit evidence.

In this kind of system, one TASK does not map to one model call. It may pass through first execution, crash recovery, rework, re-verification and handoff across different agents and different Sessions. `task_id` alone is therefore not enough to answer which concrete execution produced a particular action.

Session identity is not merely a chat-context label. It is a Runtime fact used to distinguish execution rounds, recovery boundaries and audit attribution.

The obvious implementation seems simple: let the caller include `session_id` and persist it in the journal.

That is still not enough.

A non-empty `session_id` is first a **caller claim**. It may refer to the correct Session, an ended Session, a Session for another task or Agent, or an identifier that the Runtime has never registered. If the system upgrades any non-empty string into a trusted binding, the audit record can become stronger than the underlying facts.

CodeFlowMu first encountered this as a Session-propagation gap in historical invocation records. The deeper design review then showed that the real problem was not merely a missing field. It was the absence of an **authority boundary for execution identity**.

V2.1.2 puts that boundary in the Runtime: a claimed Session identity is checked against SessionStore before the journal records `verified`, `sessionless/not_applicable`, or `invalid_claim` evidence semantics.

For the historical profile, version boundary and public evidence, see [RBE-20260828-03](/en/research/evidence/2026-08-28-skill-session-evidence).

## External research origin: configuration existence is not the same as entering the current Session

The external comparison comes from [OpenHands PR #16971](https://github.com/OpenHands/OpenHands/pull/16971), `fix(api): auto-load workspace hooks on conversation start`.

In the original 2026-08-28 research record it was still an open proposal, so this article preserves that historical status instead of rewriting it as an already-shipped OpenHands capability.

The proposal addressed a configuration-boundary problem: `.openhands/hooks.json` could exist in the workspace, yet Agent Canvas conversation startup did not automatically carry that configuration into the current conversation. The proposed path loaded hook configuration at conversation admission and made its presence observable through session state and actual `HookExecutionEvent` records.

The engineering lesson for us was broader than hooks:

**A resource can exist, enter a Session, be invoked, and produce a correct result — those are four different facts.**

OpenHands was dealing with an earlier boundary: `configuration exists → did it enter this conversation?`

CodeFlowMu's issue sits later: `an invocation was observed → which authoritative Session owns this record?`

They are adjacent problems, not the same bug and not the same implementation.

## Historical break: the Runtime knew the Session, but persistent evidence lost it

On the ordinary Playbook-reading path of CodeFlowMu V2.0.4 fixed commit `2ba1ad9b`, the Runtime already received agent, session, task and thread context. It could detect SDK tool reads of skill files and used `session_id + skill_id` for short-term deduplication.

But the final `recordSkillInvocation()` persistence path continued task and thread context while dropping Session identity from the journal.

The propagation break was therefore explicit:

`Runtime knows Session → Session is used for short-term handling → persistent evidence loses Session attribution`

A frozen historical sample through 2026-08-12 contained 59 invocation records:

| Correlation field | Present | Missing | Missing rate |
| --- | ---: | ---: | ---: |
| `task_id` | 49 | 10 | 16.9% |
| `session_id` | 0 | 59 | 100.0% |
| `thread_key` | 42 | 17 | 28.8% |
| `agent_id` | 15 | 44 | 74.6% |
| `integrity` | 59 | 0 | 0% |

These 59 records are a frozen historical sample, not a statement about every version, every skill entry point or production frequency. They establish a narrower fact: **the persisted records could have valid integrity fields while still being unable to reconstruct trusted Session attribution from the record alone.**

That distinction matters. Integrity does not prove identity truth.

A record can be provably unchanged since persistence while still containing an incorrect or unsupported identity claim. Integrity proves stability of the record; it does not prove the original identity was authoritative.

## A counterexample inside the same system: the goal was not “add session everywhere”

Not every CodeFlowMu skill-evidence path had the same evidence strength.

The same fixed version contained a stronger planning-evidence entry point, `pm.record_planning_skill_evidence`, that compared request context against Runtime-owned task, session, caller and thread facts before persisting planning evidence.

| Record type | What it could already prove | What it still could not prove |
| --- | --- | --- |
| Ordinary Skill / Playbook invocation record | A skill read was observed with partial task context | Trusted Session attribution could not be reconstructed |
| Formal planning-skill evidence | task/thread/session/caller were checked against Runtime authority | It still could not prove code, tests or final business results were correct |

So the engineering target could not honestly be stated as “the Skill Framework lacks Session support.”

The real target was:

**Give ordinary invocation evidence an explicit identity-source level instead of promoting caller-supplied fields directly into Runtime facts.**

That is the boundary between log collection and evidence engineering.

## Why persisting `session_id` verbatim can create false evidence

Suppose a request carries:

`session_id = session-042`

The system still needs to know at least:

1. whether `session-042` exists in the current Runtime SessionStore;
2. whether it belongs to the current `task_id`;
3. whether it belongs to the current `thread_key`;
4. whether the recorded Agent matches the invoking Agent;
5. whether the current caller may attribute the action to that Session, and whether the Session state is acceptable.

If none of those are checked, a string that merely looks like a Session ID can be persisted as if it were a verified binding. EVAL, recovery logic, audit panels and ADMIN views would then consume **system-packaged false strong evidence** rather than weak evidence.

That is more dangerous than a missing field. A blank field tells downstream consumers “we do not know.” An unverified value presented as trusted tells them “the Runtime knows which execution this was,” even when it does not.

V2.1.2 therefore follows a simple rule:

> **A claim may be recorded, but only a claim the Runtime itself can verify may become an execution-identity fact.**

## V2.1.2: Session identity returns to Runtime authority

V2.1.2 no longer treats a caller-supplied `session_id` as trusted execution evidence. The Runtime reads SessionStore and checks the available context across:

- `task_id`;
- `thread_key`;
- `session_id`;
- agent;
- caller;
- Session existence and acceptable state.

The journal now records explicit evidence semantics rather than a vague “has Session / no Session” split:

| Condition | Persisted semantics | Audit meaning |
| --- | --- | --- |
| SessionStore record exists and identity/context match | `session_binding=verified` | Runtime-authoritative Session facts support this invocation attribution |
| The operation is legitimately sessionless by design and Runtime records the reason | `sessionless/not_applicable` | No Session is a valid semantic state rather than an omitted field |
| Session is unregistered, state is unacceptable, or agent/caller/task/thread disagree | `session_binding=invalid_claim` | Preserve an unsupported claim as negative audit evidence; do not promote it to verified identity |

These states separate three situations that used to be easy to conflate:

**binding really succeeded; the operation legitimately needs no Session; someone claimed a binding the Runtime cannot support.**

`invalid_claim` must not be silently erased.

If the Runtime simply converts an invalid Session claim into `session_id=null`, later auditing can see only “no Session” and loses the fact that someone actually claimed a specific Session and failed verification. V2.1.2 therefore preserves the invalid claim as a negative fact.

Negative evidence is still evidence.

## Why `invalid_claim` must not be auto-corrected

Agent systems create a strong temptation to “helpfully” repair identity. If a caller supplies the wrong Session and the Runtime can guess which one it probably meant, why not rewrite it?

For execution evidence, that would be dangerous.

The moment the system replaces an unsupported identity with “the most likely one,” it stops being a fact recorder and becomes an identity inference engine. The audit chain then loses the distinction between the original claim, the authoritative fact and whether they actually matched.

The safer sequence is:

`claim → authority verification → evidence state`

not:

`claim → best guess → pretend verified`

If a later workflow needs recovery, rebinding or human correction, that should create a new, separately traceable governance action rather than rewriting the meaning of historical invocation evidence.

## task, thread, session, agent and caller are not interchangeable

These identity keys answer different questions:

| Identity key | Question answered |
| --- | --- |
| `task_id` | Which business task did this execution serve? |
| `thread_key` | Which collaboration or causal chain contained it? |
| `session_id` | Which concrete execution Session did it belong to? |
| agent | Which execution role / Agent performed the action? |
| caller | Who initiated this invocation? |

One task can pass through initial execution, crash recovery, rework and re-verification across several Sessions. One thread can span several roles and task phases.

`task_id` cannot prove Session identity. `thread_key` cannot prove Session identity either. And a self-asserted Session cannot override contradictions in task, thread, agent or caller.

The V2.1.2 boundary puts these dimensions back under one Runtime authority check.

## Identity truth and record integrity are different proofs

The invocation journal already had integrity mechanisms; Session engineering does not replace them.

- **SessionStore verification** asks whether the identity claim matches Runtime-authoritative Session facts.
- **journal integrity verification** asks whether the persisted record remains verifiably unchanged.

An invalid Session claim with a valid integrity digest is still only “an incorrect claim preserved intact.” Conversely, a previously `verified` record that is later altered still needs integrity verification to detect tampering.

The two proofs cannot substitute for one another.

That is a key difference between evidence systems and ordinary logs: **more fields do not automatically mean stronger evidence; the authority source of each field matters.**

![Four different facts behind “the skill is active”](/assets/figures/2026-08-28-skill-session-evidence-chain.en.svg)

*Figure 1: Configuration existence, Session loading, invocation, and result verification are separate evidence layers. V2.1.2 adds Runtime-verified persistent Session attribution for ordinary invocations; it does not replace result verification. Source: [RBE-20260828-03](/en/research/evidence/2026-08-28-skill-session-evidence).*

## Independent QA: verify one real SessionStore binding chain

Independent QA did not merely check whether a new `session_id` field appeared in the journal.

C1 first created a real SessionStore registration, invoked the ordinary skill-read path, then read the persistent journal and checked identity plus integrity.

| Check | Result |
| --- | --- |
| Corresponding Session exists in SessionStore | found |
| Persisted journal records for the call | 1 |
| task / thread / session | 3/3 matched expected input |
| agent / caller | matched expectation |
| `session_binding` | `verified` |
| `binding_reason` | `runtime_session_store_match` |
| `evidence_source` | `sdk_tool_call` |
| integrity verification | passed |

The evidence boundary still matters. C1 proves a complete positive binding chain for one real valid Session. Forged/unregistered Session, legitimate sessionless behavior, cross-Session distinction and same-Session deduplication are covered by targeted failure/boundary tests; one C1 case cannot independently stand in for every branch.

The historical 59 records without Session identity are not automatically upgraded to `verified` because a new version was released. If there is no reliable source from which to recover an old identity, it remains unknown. Refusing to guess historical identity is itself part of evidence discipline.

## `verified` proves execution attribution, not correctness of the work

Suppose a journal record has the correct task, thread, Session and Agent/caller, plus `session_binding=verified` and `outcome=ok`.

What it proves is narrower:

**The Runtime has evidence that this skill invocation occurred under that verified identity combination and that the invocation itself completed according to the interface semantics.**

It still does not prove:

- the skill advice was correct;
- the Agent fully followed the skill;
- the code change was correct;
- test coverage was sufficient;
- a REPORT conclusion was valid;
- QA should PASS;
- PM or ADMIN should approve.

A more complete evidence ladder remains:

`available → recommended/bound → invoked → identity_verified → result_verified`

The last layer still requires code diff, tool output, runtime artifacts, tests, REPORT, REVIEW, EVAL and QA/PM governance evidence.

V2.1.2 strengthens **truth of invocation attribution**. It does not give the Runtime business-adjudication authority.

## What this means for a digital-employee runtime

Session identity may look like a small logging field, but in a long-running digital-employee system it determines whether later automation can be trusted:

- after a crash, can recovery distinguish a call from the old Session and one from the new recovery Session?
- during EVAL review, can a behavior be attributed to the correct execution round?
- in multi-agent work, can actions on the same task be separated by Agent and Session?
- when ADMIN reviews evidence, will a caller claim be falsely presented as “Runtime verified”?
- can later diagnostics or monitoring reason from verified execution identity rather than guessing from timestamps?

If Session is merely an optional string, increasing automation also increases the cost of misattribution.

The principle established here is therefore broader than “better logging”:

**Execution identity belongs to Runtime authority, not to caller self-assertion.**

## From engineering patch to formal version

CodeFlowMu V2.1.2 completed the private mother Runtime/Shell release on 2026-08-30. Session identity verification shipped together with persistent task idempotency and Activity safe projection as one Runtime boundary-safety patch.

Public articles do not point readers to inaccessible private CodeFlowMu repository links. Publicly reviewable version facts, sanitized C1 results, compatibility and residual risks are available in the [public evidence pack](/en/research/evidence/2026-08-28-skill-session-evidence) and the [V2.1.2 Public Release Summary](/en/research/evidence/2026-08-30-codeflowmu-v2.1.2-public-release-summary).

Final release validation recorded:

- Runtime: **1842 pass / 0 fail / 1 skip**;
- Shell: **1037 pass / 0 fail / 0 skip**;
- V2.1.1 and V2.1.2 same-protocol critical scenarios, ten consecutive rounds each: Runtime **1630/1630**, Shell **550/550**;
- typecheck, Shell build, installer contract, rules and version consistency passed.

These numbers describe the overall V2.1.2 release test set. They are not a “Session evidence trust rate,” and they do not prove coverage of every Host, real LAN/Gateway deployment, browser profile or user production project.

The release targets the private mother Runtime/Shell. It does not include an independent Open Dev Team Edition, and it requires no migration of existing TASK, REPORT, Session or Activity files.

## A review checklist for other Agent Runtimes

When an Agent system records Skill, Tool, Hook or MCP invocations, ask:

1. Is `session_id` caller-supplied, or derived from an authoritative Runtime registration?
2. Is Session checked together with task, thread, agent, caller and state?
3. Are “legitimately no Session” and “incorrect Session claim” represented differently?
4. Is an invalid claim preserved as negative audit evidence instead of being silently deleted or guessed into a replacement?
5. Are identity verification and log integrity treated as distinct proofs?
6. Do task/thread/session keep separate semantics rather than substituting for each other?
7. Do UI, EVAL and recovery logic treat only `verified` as verified attribution?
8. Is invocation success still separated from engineering-result and business-result validation?
9. Do historical records with missing identity remain unknown rather than being inferred for cosmetic completeness?

These questions reveal much more about trustworthy execution evidence than “does the log have a Session field?”

## Engineering conclusion

The most important change in this CodeFlowMu engineering record is not that the skill journal gained another ID.

It is the establishment of three evidence levels:

**The caller may make an identity claim. The Runtime verifies it. Only a verified identity may become trusted execution evidence.**

Legitimate sessionless operations need their own semantics. Unsupported claims must remain visible as negative facts. Only then can recovery, EVAL, auditing and governance build on verifiable identity rather than on a field that merely looks plausible.

For a digital-employee runtime, Session is not contextual decoration and not a label the caller can define by fiat.

It is the evidence boundary for answering:

**Which real execution did this action actually belong to?**

## Evidence scope and primary sources

- [Historical profile, mixed evidence sample, V2.1.2 engineering update and public release evidence](/en/research/evidence/2026-08-28-skill-session-evidence): historical fixture, Reader and check validate frozen material; the public page also maps sanitized implementation facts, C1 independent QA, release gates and residual risks.
- [OpenHands PR #16971](https://github.com/OpenHands/OpenHands/pull/16971): recorded in the 2026-08-28 research as an open proposal; it provides the adjacent problem model of configuration entering a Session, not CodeFlowMu source code or delivery proof.
- CodeFlowMu V2.1.2 implementation, independent-QA and raw release logs remain in the restricted private mother repository; this public article does not expose inaccessible private links as reader-facing evidence.
- This article does not prove that skill advice was correct, that an Agent fully followed a skill, that invocation evidence replaces result acceptance, or that historical Session identities can be safely inferred and backfilled.
