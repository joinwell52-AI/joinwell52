---
schema: publication-candidate-article/v2
title: "You Clicked Cancel. Which Step Did It Actually Cancel? An Agent Execution-Boundary Experiment"
date: "2026-09-06"
published_date: "2026-09-07"
column: open-source-engineering
category: daily
article_type: engineering-case-study
edition: research-center
summary: "Requesting cancellation, accepting it, and preventing an action are different facts. Controlled tests of a real approval service and session adapter separate existing protections from an untested host-queue window."
cover: "/assets/execution-artifacts-20260906/01-cancellation-cover-v2.png"
language: en
lifecycle: Published
publication_authorized: true
evidence_status: "Controlled study complete; no new product defect or development authorization"
pageClass: execution-artifacts-article
---

<ArticleCover image="/assets/execution-artifacts-20260906/01-cancellation-cover-v2.png" kicker="Open-source Engineering · Controlled Study" title="You Clicked Cancel. Which Step Did It Actually Cancel? An Agent Execution-Boundary Experiment" summary="Requesting cancellation, accepting it, and preventing an action are different facts. Controlled tests of a real approval service and session adapter separate existing protections from an untested host-queue window." version="2026-09-06" languageHref="/zh/engineering/2026-09-06-cancellation-execution-boundary" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.execution-artifacts-article .vp-doc h1[id] { display: none; }</style>

[View full-resolution cover](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/01-cancellation-cover-v2.png)

# You Clicked Cancel. Which Step Did It Actually Cancel? An Agent Execution-Boundary Experiment

One unsettling moment with an AI assistant editing your files is changing your mind while it still says it is working.

You click Cancel. Should it stop starting new actions, immediately terminate the running command, or restore a partially written file? If the write has already begun, should it stop halfway or finish and then stop?

These are different promises. A cancellation button can express a clear user intention, but clicking it alone does not prove the executor accepted the request—or that an external action has not happened.

Our recent experiment produced a sequence that was easy to misread: the executor waited, we requested cancellation, and the file was subsequently written. From that sequence alone, “it executed after cancellation” sounds plausible. Reading the receipt changed the conclusion: **the cancellation request had never been accepted.**

This is not a report of a cancellation vulnerability we have fixed. It is an investigation into tracing “I asked it to stop” to “this particular step actually stopped.”

## 1. A window worth investigating: how much waiting follows the check?

OpenHands is an open-source project for software-development agents. Its SDK supplies capabilities such as tool execution. An agent here is an AI assistant that can act through tools, rather than merely produce conversational answers.

OpenHands SDK [proposal #4866](https://github.com/OpenHands/software-agent-sdk/pull/4866) examined a concrete sequence: check cancellation before executing a tool, then wait for a resource lock. If cancellation occurs during that wait, will the tool still be invoked after the lock becomes available? The proposal added another check after acquisition. As checked on September 6, 2026, it was closed without merging; the author said it would be refiled with corrected evidence. It is a research lead, not an upstream incident independently reproduced here or a delivered fix.

The valuable question is: **if a check and an action are separated by waiting, does the earlier decision still hold?**

A tool might need an environment occupied by another task. Being allowed when it enters a queue does not establish that it should still run when its turn arrives. But before diagnosing a defect, we need to know what the cancellation endpoint promises to revoke, whether the request succeeded, and which layer owns the wait.

We therefore tested the existing boundaries before adding another check to our system.

## 2. First counterexample: execution after a deadline is not necessarily expired authorization

CodeFlowMu is the local multi-agent collaboration system we are developing. It organizes work around task files, execution sessions, and evidence. This study used source baseline `c008d9db91a21136fc61a4f60314e22db395d5d2`, invoking the real approval service in isolated synthetic directories. We did not cancel users' live tasks or change product code.

We began with the ordinary path: approve an exact file operation, execute once, and try to replay it. In both rounds, the first execution succeeded and produced one file effect. Replay returned `APPROVAL_ALREADY_CONSUMED`: the approval had already been consumed.

Next came time. We used the service's injectable clock to set a 30-second pending-review deadline, rather than relying on random delays to produce a race.

| Scenario | Observed result, matching in both rounds | Supported conclusion |
| --- | --- | --- |
| Cancel before approval, then try execution | Cancellation accepted; execution rejected; 0 file effects | Pending-approval cancellation is protected |
| Leave the request unapproved beyond 30 seconds | Expired; approval rejected; 0 file effects | The pending-review deadline works |
| Approve before the deadline, execute at second 31 | Succeeded; 1 file effect | Identify what the deadline governs before reporting a defect |

The third row looks suspicious: `expires_at` says second 30, so why is execution allowed at second 31?

The first row also needs its premise preserved: the request had not been approved, so the execution attempt did not use an issued token. It checks pending cancellation and rejection of unapproved execution, not revocation of an already approved token.

The source provides a clear answer to the timing question: this deadline governs **waiting for approval**. An existing test explicitly requires an approved token to remain usable beyond the pending-review deadline. A token is the approval credential presented at execution; its expiration rules must be read from its actual contract.

The observation is therefore not an authorization-expiry bypass. A pending-review deadline is not a universal execution deadline after approval.

If a product later needs “even an approved action must not run after ten minutes,” that is another rule to define and verify. We cannot assign an unpromised meaning to a field and then label its implementation a vulnerability.

## 3. Second counterexample: why was cancellation rejected while the executor waited?

The more revealing experiment inserted a controllable waiting point after the approval service entered its executor callback—the point where the service hands control to concrete execution code. We held the callback at a barrier, requested cancellation, and released the barrier.

The condition matters: the research script injected the wait. The local file executor under test uses synchronous file operations. This did not reproduce an OpenHands-style resource-lock queue in the product.

| Scenario | Cancellation receipt | Final file effects | Interpretation |
| --- | --- | --- | --- |
| Enter callback, wait, request cancellation, release | `APPROVAL_NOT_PENDING`; rejected | 1 | Not successful cancellation followed by execution |
| Same wait; research callback checks its own abort flag after release | Cancellation still rejected | 0; callback throws | Demonstrates the timing of a check, not a new product capability |
| Write effect first; request cancellation while waiting to finish | Rejected | The existing 1 effect remains | A later request is not automatic rollback |

Each scenario used a fresh fixture in each of two rounds; results matched.

![Cancellation receipts versus file effects in three controlled scenarios](/assets/execution-artifacts-20260906/01-cancellation-inline-en-v1.png)

*Figure 1. A1, A4, and A5. The extra abort check in the third row belongs only to the research callback. Waiting is not a real product resource queue; the pending-approval scenario has no issued token. Source: this study's controlled observations; AI-generated explanatory illustration.*

[View full-resolution figure](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/01-cancellation-inline-en-v1.png)

Why did cancellation fail in the first scenario? After validating approval state, token, and request digest, the service records `executing` and invokes the callback. Its cancellation endpoint accepts only approvals that are still pending.

Thus `executing` during the wait does not prove the file was already written. But `APPROVAL_NOT_PENDING` does establish that this approval-cancellation request failed. Both facts must survive the analysis.

The second scenario is a deliberate mechanism control: after waiting, the research callback observes its abort flag and skips the real file executor. It shows that the location of a check can change the outcome. It does not establish that the product already performs that check, or that valid authorization was successfully revoked.

That is the dividing line in this study: **a cancellation request is not evidence of cancellation acceptance; entering an executor is not evidence that its effect has happened.**

## 4. A new topic should not erase existing protections

The approval service is not the entire chain. CodeFlowMu also has session adapters that connect to coding agents, receive requests, handle approval replies, and end sessions.

We tested our Codex session adapter using the real `CodexAppServerRunHandle` class attached to an in-memory fake process transport. We did not start actual Codex or execute terminal tools.

There was one observation point: whether a final approval reply was sent.

| Scenario | Approval replies actually sent per round |
| --- | --- |
| Normal request, not cancelled before replying | 1 |
| Request received; session cancelled before asynchronous resolution returns | 0 |
| Late request arrives after session cancellation | 0 |

All three scenarios ran twice. They demonstrate protection against late replies after session termination at the tested adapter boundary. It would be wrong to say the system has no final check at all.

But not sending a reply is different from preventing tool execution inside a real host—the program actually running the agent and its tools. If a reply has already been delivered and the tool then waits for a resource, the rules for that window still need testing in the particular host.

A correct local adapter cannot guarantee another process's behavior. Equally, an upstream concern cannot erase the protections already verified locally.

## 5. What evidence should cancellation leave?

For a follow-up study of a real tool queue, the most discriminating record is not a final `cancelled` label. It is an aligned timeline:

> Cancellation request arrives → accepted or rejected receipt → waiting ends → final validity check → real action begins → effect and completion.

This is a proposed experiment, not a unified interface implemented in this study.

Each point answers a different question. Acceptance specifies the promise. The actual start point shows whether that promise could take effect in time. Effect evidence identifies anything still requiring reconciliation or remediation. An external action that already occurred needs separately defined compensation; stopping later computation cannot make it never have happened.

An engineering team should first check three things:

- Does the interface turn “requesting cancellation” into “stopped” prematurely?
- Does each cancellation endpoint address pending approval, an entire session, or an active operation?
- For resource waiting, can we show that the check runs after the wait and before the action, not merely at function entry?

This study did not establish a CodeFlowMu defect in which successfully accepted cancellation is followed by tool startup. It established why existing protections, interface responsibilities, and untested windows must be separated before deciding what to test next—or whether new development is warranted.

**Reliable cancellation is not about making every component display “cancelled.” It is about explaining where the request was accepted, which step it prevented, and which facts it did not change.**

## Evidence and scope

This article uses seven approval scenarios and three adapter scenarios, each run twice. These are not production-incident statistics or a security accuracy benchmark. Two existing test files also ran in separate processes twice, with 39 passing tests, 0 failures, and 0 skips per round. Adding those counts does not create an end-to-end guarantee.

The [bilingual evidence companion](/en/research/evidence/2026-09-06-execution-artifact-continuity) provides all exported observations, provenance, two baseline logs, adapted research probes, and an integrity checker. Local paths and process IDs are removed; outcomes and ordering are retained. The adapter's normal scenario ends in cancellation only because of test cleanup, not because normal execution failed. Checking the published records does not rerun the product; running the probes additionally requires authorized access to the fixed CodeFlowMu source and its dependencies.

Real resource queues, OS process termination, reversal of external effects, and real tool behavior after authorization changes remain outside the verified scope. Publication adds no new product experiment.
