---
title: "A Successful Replay Is Not a Standing Right to Execute"
date: '2026-09-17'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "当一个数字员工曾经成功执行过一条可复用记忆时，下一次重放需要哪些新鲜证据，才能证明它仍然适用于当前状态、仍获业务授权，并且其外部效果可以被安全核对？"
summary: "Executable memory can reduce the cost of repeated work, but historical success creates only a replay candidate. Every run must reprove compatibility, business authority, and external effect state."
sources:
  - research/analysis/Q-20260917-01-replay-eligibility-is-a-fresh-execution-time-fact.md
item_id: "Q-20260917-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-17-successful-replay-not-standing-execution-right-cover-v2.webp"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-17-successful-replay-not-standing-execution-right-cover-v2.webp"
  kicker="Digital Employee · Daily Research"
  title="A Successful Replay Is Not a Standing Right to Execute"
  summary="Executable memory can reduce the cost of repeated work, but historical success creates only a replay candidate. Every run must reprove compatibility, business authority, and external effect state."
  version="Q-20260917-01"
  status="Daily Runtime V5 · 2026-09-17"
  languageHref="/zh/digital-employee/2026-09-17-successful-replay-not-standing-execution-right"
  languageLabel="中文"
/>

# A Successful Replay Is Not a Standing Right to Execute

An operational memory completed a task yesterday. Today, a similar request arrives, retrieval assigns a high similarity score, and the system prepares to replay the old procedure. The shortcut is attractive, but it compresses three different questions into one: can this artifact still run in the current environment, may this actor run it now, and how will the system prove what happened outside the model?

Historical success is valuable. It can turn expensive exploration into reusable capability. But a successful trace is not a permanent pass. Tool versions, page structure, account state, target resources, and authority can change. A timeout may also conceal an effect that already occurred. Reliable replay keeps candidate discovery, execution eligibility, business authorization, and effect reconciliation separate.

## Replay Is Worth Keeping Because It Reduces Repeated Cost

The same-date Research Object examines EchoPath's executable-memory evaluation. For 145 second-pass tasks matched with their first-pass tasks, the paper reports 91.2 percent completion, close to a comparison method's 91.8 percent. Median usage is about 20,370 tokens versus about 586,386, and median time is about 127.5 seconds versus about 315.7 seconds.

Those figures support a useful conclusion: compiling successful trajectories into executable memories can materially reduce the cost of repeated problem solving. A production system should not discard reuse merely because governance is difficult.

The evidence establishes reuse value within the tested tasks and metrics. It does not grant perpetual eligibility across every tool, account, or effectful operation.

## Similarity Finds a Candidate, Not Permission

The paper also reports a retrieval stress test in which the memory bank expands from 159 to 659 memories while recall remains 100 percent. The result supports the ability to recover the right candidate from a larger collection.

Recall answers which memory may be relevant. It does not answer whether that memory should run now. Two requests can be semantically close while referring to different accounts, budgets, regions, or tool schemas.

Similarity should therefore stop at the candidate layer. It may trigger downstream checks, but it must not generate authority. Connecting a retrieval score directly to an effectful tool call lets textual resemblance substitute for current facts.

## Eligibility Must Be Reproved for This Run

EchoPath's admission mechanism checks lifecycle, artifact, reasoning, action schema, state, and flexible inputs. The Research Object records 49 compatible and 46 partially compatible state cases accepted, while 39 incompatible cases were rejected. It also records 50 of 50 allowed flexible substitutions accepted and 50 of 50 mutations to non-flexible fields rejected.

These results support a stricter design principle: eligibility is an execution-time fact. The runtime must rebind the exact memory version, tool or interface schema, required state, permitted substitutions, and current task boundary.

Partial compatibility should not become silent success. The record needs to say which differences remain allowed, which fields must come from the new request, and which changes invalidate the memory. If the system cannot prove those facts, the correct state is refusal or governed escalation.

## An Auditable Replay Chain Needs Six Identities

A minimal replay record should connect at least six identities:

- **Request identity:** who asked for what outcome against which resource.
- **Memory identity:** the exact executable-memory version and its successful origin.
- **Action identity:** the tool schema and argument structure to be invoked.
- **State identity:** the environment snapshot checked for this run.
- **Authorization identity:** the policy decision allowing an actor, purpose, scope, and time.
- **Effect identity:** the business key used to reconcile the external change.

These fields are not ornamental logs. They answer operational questions after failure. A schema upgrade identifies memories that should expire. A revoked permission can be compared with the decision actually used. A suspected duplicate can be reconciled through an effect identity instead of another blind call.

## Compatibility Can Pass While Business Authority Fails

The replay gates in the study primarily establish technical fit: the artifact exists, state satisfies prerequisites, the action schema matches, and input changes remain permitted. They do not establish enterprise business authorization.

Authorization must separately answer who the actor is, what purpose is allowed, which operations and resources are in scope, what limit applies, and when the decision expires. A payment procedure may remain technically replayable while a changed limit, frozen account, or revoked approval forbids execution.

Authority must bind the current action, not merely the memory. A memory is procedural material, not a source of power. Even its author does not confer the original permissions on every later user.

## A Successful Call Does Not Prove a Single Effect

A successful tool response proves only that an interface returned something. A network timeout can occur after the external system writes state. A retry can create a second effect. Even a success response may fail the business postcondition.

Effect reconciliation must therefore remain independent of the call result. For an effectful operation, preserve a business idempotency key, expected effect, external resource version, and reconciliation result. If effect state is unknown, inspect external facts before choosing retry, compensation, or human handling.

Historical traces cannot replace this step. They can show how to call the tool; they cannot prove that this order, account, or resource reached the intended state.

## A Minimal Replay Contract

A practical contract can use five steps:

1. Retrieve candidates with similarity and structural constraints, without granting authority.
2. Re-evaluate the exact memory version, action schema, current state, and allowed substitutions.
3. Obtain fresh authorization for actor, purpose, scope, limits, time, and target resource.
4. Execute with an effect identity and an idempotency or compensation strategy.
5. Reconcile external facts and preserve success, failure, or unknown in the evidence package.

Any missing mandatory fact should remain unknown or fail closed. Replay may be faster, but speed cannot come from deleting the checks that make reuse safe.

## Boundaries and Open Questions

The evidence comes from graphical-interface tasks and the study's evaluation environment. It does not establish enterprise authorization correctness, exactly-once effects, privacy boundaries, or cross-organization revocation propagation. The contract proposed here is an architectural interpretation of the findings, not a production guarantee directly tested by the paper.

Open questions include how fresh a state snapshot must be for different risk levels, how much schema change should expire a memory, how quickly revocation reaches caches, how concurrent replays share business idempotency keys, and which effects can be reconciled automatically rather than by a responsible person.

The bounded conclusion is: **historical success is worth reusing, but eligibility must be reproved in the present. Replay admission, business authorization, and effect verification should remain separate, auditable evidence chains.**

**Evidence and source:**

- [EchoPath: Verified Executable Memory for Long-Horizon Computer-Use Agents](https://arxiv.org/abs/2609.16635), 2026.
