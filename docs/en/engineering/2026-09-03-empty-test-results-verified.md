---
title: 'The Test Results Are Empty. Why Does the System Still Say “Verified”?'
date: "2026-09-03"
published_date: "2026-09-04"
column: open-source-engineering
category: daily
article_type: experiment-report
edition: research-center
research_question: "Does the real Host admission service reject internal results that do not cover its test plan?"
summary: "A plan requires four tests, yet zero returned results can still produce VERIFIED. A controlled experiment through the real Host admission service shows why receiving no failure is not evidence of complete success."
cover: "/assets/host-research-20260903/cover-01-empty-evidence-v1.png"
language: en
lifecycle: Published
publication_authorized: true
evidence_status: "Controlled reproduction on V2.2.6; no remediation implemented in this study"
---

<ArticleCover
  image="/assets/host-research-20260903/cover-01-empty-evidence-v1.png"
  kicker="Open-source engineering · Controlled experiment"
  title="The Test Results Are Empty. Why Does the System Still Say “Verified”?"
  summary="A plan requires four tests, yet zero returned results can still produce VERIFIED. Receiving no failure is not evidence of complete success."
  version="2026-09-03"
  languageHref="/zh/engineering/2026-09-03-empty-test-results-verified"
  languageLabel="简体中文"
/>

<ArticleTableScroll language="en" />

# The Test Results Are Empty. Why Does the System Still Say “Verified”?

The test plan requires four checks. The probe returns an empty array.

We expected the system to stop and explain that the evidence was incomplete. Instead, its persisted records contained two contradictory sets of information: progress was `total=4, completed=0`, the test run was `PASS`, and the candidate admission decision was `VERIFIED`.

This was not an actual upgrade incident. It was a controlled experiment on CodeFlowMu, the local multi-Agent collaboration system we are developing. A Host here is the SDK or CLI that executes an Agent. The Host admission service assesses whether a candidate version meets integration requirements; it does not accept business deliverables.

The experiment did not prove that no real tests had executed. It established something narrower, and directly within this service's responsibility: **receiving no test results can still lead to a “verified” decision.**

The issue is not the color of the indicator. It is what makes that indicator justified.

## 1. External projects check whether declarations are true. We must also check the next boundary

The starting point was a change in OpenHands.

OpenHands is an open-source coding Agent project. Its Agent SDK integrates Agents, workspaces and execution providers. ACP, the Agent Client Protocol, provides communication between clients and Agent providers.

In [PR #4834](https://github.com/OpenHands/software-agent-sdk/pull/4834), maintainers went beyond inspecting registry declarations: they launched real providers, read identity, version and session configuration, and actually set a model and checked the returned value. The problem was an upstream change that a static support list could miss. The PR was merged when checked on September 3.

That test has limits. It uses placeholder credentials and does not send an inference turn. It cannot establish a real account's model entitlement or prove task completion. The live tests also have separate triggering arrangements; they do not run on every default test invocation. [Test and CI details](https://github.com/OpenHands/software-agent-sdk/pull/4834)

Our takeaway was not simply to add a live probe. Inspection of the current CodeFlowMu baseline showed existing real Cursor SDK send probes and Codex CLI inference and schema checks. Proposing to build real probes from scratch would ignore existing engineering capability.

The question worth pursuing was downstream: **even if the probe is real, can its consumer mistake incomplete evidence for complete success?**

OpenHands checks whether providers fulfill their declarations. This article checks whether a consumer fulfills its verification contract. Those are related, but different, defects. Our experiment cannot be used to attribute the same problem to OpenHands.

## 2. The error occurs when results are aggregated

We fixed the baseline at CodeFlowMu V2.2.6, commit `5c94d8c3b0147b779b17f620b811c6a17cc65288`. The entry point was the Shell's actual `HostAdmissionControlPlaneService`, not a separate demonstration validator.

The service discovers candidate versions, builds a test plan, calls a probe, and saves the run and admission states. Each of the two Hosts has four defined test IDs. Cursor's plan covers supply chain, type exports, Agent listing and a real send. Codex's covers supply chain, CLI version, four schema groups and a real inference turn.

The plan exists. The problem is how `runTests()` interprets the returned set:

```typescript
const status = results.some(item => item.status === "FAIL")
  ? "FAIL"
  : results.some(item => item.status === "BLOCKED")
    ? "BLOCKED"
    : "PASS";
```

This code answers: “Do any of the returned entries indicate failure or a block?”

It does not answer: “Have all required entries returned correctly?”

An empty array contains neither `FAIL` nor `BLOCKED`, so it becomes `PASS`. The service then writes `VERIFIED` for the candidate and sets completed progress to `results.length`. That explains how `0/4` and verification success coexist.

At least three judgments must remain distinct: the returned list contains no failures; the planned evidence is complete; the candidate qualifies for admission. This aggregation path promotes the first directly into the last.

[![Empty evidence still becomes PASS and VERIFIED](https://joinwell52-ai.github.io/joinwell52/assets/host-research-20260903/figure-01-evidence-completeness-en.png)](https://joinwell52-ai.github.io/joinwell52/assets/host-research-20260903/figure-01-evidence-completeness-en.png)

*Figure 1. Result reception and aggregation in the controlled experiment. The four checks illustrate the Cursor plan. An empty receipt set does not mean that no real probe executed. The proposed improvement is not implemented. Click the figure for the full-resolution image.*

Source locations, baseline digests and per-round observations are described in the [public evidence guide](/en/research/evidence/2026-09-03-host-authority-conformance). Its package contains de-identified observations and a read-only checker, not a fresh product run. Full internal logs and local machine paths are not published.

## 3. More than an empty-array edge case: four counterexamples expose a set-completeness gap

To distinguish an empty-array special case from a plan-completeness problem, we kept the real service fixed and varied the internal probe results it received.

The experiment used existing injection seams: candidate discovery returned controlled registry information, artifact staging performed no installation, and the probe returned a specified list. Product code still performed the decision, state transitions and persistence. We did not launch a cloud model, adopt the candidate or synchronize an update.

For each Host, we tested eight input types, repeating each twice in separate temporary directories. Both Hosts and both rounds produced these results:

| Internal probe return | Run / candidate decision | Interpretation |
|---|---|---|
| Each of the four planned IDs returns PASS once | PASS / VERIFIED | Complete-success control |
| Empty array | PASS / VERIFIED | All results missing, yet accepted |
| One planned ID returns PASS | PASS / VERIFIED | Three results missing, yet accepted |
| The same planned ID returns PASS four times | PASS / VERIFIED | Sufficient count, insufficient coverage |
| One unregistered ID returns PASS | PASS / VERIFIED | Unrelated evidence substitutes for the plan |
| A complete set contains BLOCKED | BLOCKED / PENDING | Blocking control works |
| A complete set contains FAIL | FAIL / PENDING | Failure control works |
| The callback throws | Exception; candidate does not become VERIFIED | Exception is not disguised as success |

There were **16 distinct input combinations and 32 observations**. Four incorrect-acceptance classes appeared in both Hosts and both rounds, giving 16 counterexamples. This is not a 50% system failure rate: we selected the scenarios deliberately rather than sampling production requests.

The controls also constrain the conclusion. The service recognizes explicitly returned failures and blocks. It would be wrong to say that it ignores every failure. The gap is that **it has not established that the evidence it was supposed to receive actually arrived**.

Duplicate IDs are particularly instructive. Rejecting an empty array and requiring `results.length === plan.tests.length` would still accept the fourth row. Four copies of one receipt do not establish four different checks.

## 4. Why can existing tests pass while this still happens?

Before adding the negative probes, we reran seven relevant existing test groups: 41 tests per round, with both rounds yielding `41 pass / 0 fail / 0 skip`. They covered process identity, writer locks, approvals, fact checks, the admission runner and the Host control plane.

That count establishes only that those selected cases passed on the fixed baseline. It is neither full-product acceptance nor a reliability percentage.

The difference is the boundary under test. The Runtime library's admission runner and the Shell control plane that aggregates candidate results are separate components. Registration and execution tests for the former cannot prove that the latter's result set exactly matches its plan. Nor can a normal successful Shell flow establish rejection of missing, duplicate or unrelated results.

That is why this class of problem is worth studying. A team may already have test plans, real probes, audit records and green regressions, while omitting one contract at a component handoff: **the consumer must verify that the evidence covers the question it asked**.

The source also shows that the Web Panel's real test route calls this service, and a later synchronization check reads the run's `PASS` and the candidate's `VERIFIED`. It is not an unused demonstration function. However, synchronization still has a separate ADMIN confirmation gate. We did not call the HTTP synchronization endpoint and cannot expand the result into an unauthorized automatic production update.

Likewise, internal callback injection is an experimental technique, not an arbitrary parameter exposed to remote callers. We established a consumer decision gap under incomplete internal results, not an external attack chain.

## 5. The fix is not a different array method

Replacing `some(FAIL)` with `every(PASS)` sounds more positive, but `every()` also returns true for an empty array. The decision must be grounded in what was required to be proven, not merely in what happened to return.

A narrow rule worth engineering review is to take the frozen test plan as authoritative, check the result for every required ID, and only then decide whether the candidate passes.

Missing entries cannot pass. Unknown IDs cannot compensate for missing ones. Duplicate IDs cannot increase coverage. Duplicate receipts need an explicit distinction between idempotent retransmission of one immutable result and two conflicting results; array length alone is not a completion count. Final evidence should also bind to the current run, candidate and applicable test standard, so old results cannot answer a new question.

If a plan legitimately allows zero required checks, an explicit non-applicability rule should explain that outcome. An empty array should not silently mean success. These are review proposals, not implemented and accepted new capabilities.

The experiment does not tell us how often default providers return incomplete lists in production. It has no production incident population. It answers a smaller, definite question: **how does this consumer decide when an incomplete list reaches it?**

The next step should therefore target this aggregation boundary and its regression tests, without turning the finding into a rewrite of the Host system or counting a proposed fix as a delivery.

A verification receipt requires complete evidence of success.

**Receiving no failure establishes only that no failure was received.**
