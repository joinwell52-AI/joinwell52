---
title: "Don’t Trust an All-Green Demo: How Fault Injection Exposes an Unreliable AI Agent Dispatcher"
date: '2026-08-19'
column: open-source-engineering
category: daily
article_type: project-research
edition: research-center
research_question: "How should an AI agent dispatcher be tested through governance invariants, fault locations, and observable verdicts?"
summary: "Reliability tests should combine one rule that must survive, one injected fault, and one observable verdict instead of treating a successful UI path as proof."
item_id: "MANUAL-20260819-FAULT-INJECTION"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-19-agent-dispatch-fault-injection-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
sources:
  - research/manual-runs/2026-08-19-guided-article-pipeline-round1/02-source-register.md
  - research/manual-runs/2026-08-19-guided-article-pipeline-round1/02-fact-claim-matrices.md
  - research/manual-runs/2026-08-19-guided-article-pipeline-round1/02-article-briefs.md
  - research/manual-runs/2026-08-19-guided-article-pipeline-round1/02-experiment-run-log.md
  - research/manual-runs/2026-08-19-guided-article-pipeline-round1/03-independent-final-package-review-round2.md
---

<ArticleCover
  image="/assets/covers/daily-2026-08-19-agent-dispatch-fault-injection-cover.png"
  kicker="Open-source Engineering · Project Research"
  title="Don’t Trust an All-Green Demo: How Fault Injection Exposes an Unreliable AI Agent Dispatcher"
  summary="Reliability tests should combine one rule that must survive, one injected fault, and one observable verdict instead of treating a successful UI path as proof."
  version="MANUAL-20260819-FAULT-INJECTION"
  status="Independent Editorial PASS · 2026-08-19"
  languageHref="/zh/engineering/2026-08-19-agent-dispatch-fault-injection"
  languageLabel="中文"
/>

# Don’t Trust an All-Green Demo: How Fault Injection Exposes an Unreliable AI Agent Dispatcher

**Series map:** begin with [the long-requirement work graph](/en/engineering/2026-08-19-taskbook-to-task-graph). This article asks what remains true after a fault; finish with [local execution and mobile control](/en/digital-employee/2026-08-19-local-runtime-mobile-control).


## In ten seconds

Organize reliability tests as **one rule that must never break × one injected fault × one observable verdict**. The article delivers six defensive rules, four fault families, and a 12-case checklist that can become a Runtime test plan.

The easiest multi-agent demo is a happy path: create a TASK, let an agent claim it, write a REPORT, and show “done” in the UI.

One successful run says almost nothing about the harder system. What happens when a watcher emits the same file event twice? If the dispatch record is durable but the model session never starts, will restart launch duplicate work? If one task appears in both `active/` and `review/`, which location wins? If a dependency prevents a test from running, does the dashboard still say PASS?

Reliability testing begins with facts that must survive every interleaving, not with buttons on a page.

> **Do not only ask whether the workflow completed. Ask which invariants remain true when failure lands on every commit boundary.**

## Start from protocol invariants without repeating the protocol tutorial

[FCoP v3](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/spec/fcop-v3-spec.md) defines TASK, REPORT, ISSUE, and REVIEW artifacts, plus the collaboration semantics in which location represents current state and events preserve transition history. The previous article, [“Files, Paths, and Events: Implementing and Testing the FCoP Collaboration State Machine”](/en/engineering/2026-08-18-fcop-file-state-machine), covers protocol transitions and atomic commit in full; here they are only inputs to Runtime testing. [ADR-0038](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/adr/ADR-0038-fcop-boundary-charter.md) narrows the boundary: the protocol externalizes and coordinates work; it does not execute tasks or own model sessions and global orchestration.

CodeFlowMu Runtime owns file observation, task parsing, dependency checks, agent selection, session startup, dispatch commit, and recovery. Testing therefore needs layers:

| Layer | What it must establish | Typical failure |
|---|---|---|
| Protocol/artifact | Identity, provenance, legal state, history, authority | Duplicate identity, illegal transition, history gap |
| Storage commit | No partial canonical write; bounded recovery | Temp residue, rename failure, weak durability |
| Runtime observation | Repeated events and reconciliation do not duplicate effects | Watcher jitter, missed event, double scan |
| Dispatch/session | Dependencies, busy state, two-phase dispatch, crash recovery | Double dispatch, orphan session |
| Governance | A REPORT does not confer acceptance; failures remain visible | Self-approval, NOT RUN reported as PASS |

A single end-to-end test collapses these layers. When it fails, “the workflow did not finish” cannot tell you whether the defect belongs to protocol semantics, storage, observation, or the session host.

![The layered relationship among TMPA governance semantics, the FCoP file-protocol projection, CodeFlowMu runtime responsibility, and fault evidence](/assets/covers/daily-2026-08-19-governance-to-fault-testing-en.png)

*Figure 1. TMPA defines what should hold, FCoP specifies how it is expressed, and CodeFlowMu implements how it runs. TMPA C01–C14 conformance evidence and this article's 12 product-fault scenarios cannot substitute for one another. Source: TMPA Core S1.0, FCoP v3, current CodeFlowMu code, and the 2026-08-19 experiment record.*

## Six defensive rules worth encoding first

Regardless of language or storage engine, start with six rules that a fault must never be allowed to break:

1. **A task identity never means two jobs:** duplicates are reported, not overwritten.
2. **A task cannot have split-state personality:** two current locations are preserved as a conflict, not resolved by traversal order.
3. **History is an append-only ledger:** rejection, failure, retry, and recovery remain visible.
4. **Every model call is attributable:** it maps to a task version, execution attempt, time-bounded claim, and host decision.
5. **No permit, no start:** unmet dependencies, a busy agent, or an unapproved gate prevents session startup.
6. **Restart never guesses:** persistent artifacts and explicit execution records decide retry, rework, continue, or stop.

[TMPA Core S1.0](https://joinwell52-ai.github.io/joinwell52/en/publications/tmpa-core-specification-s1.0) supplies the identity, state, conflict, history, and recovery baseline. CodeFlowMu adds product responsibilities for watchers, dependencies, dispatch attempts, sessions, and time-bounded claims. The combination produces the Runtime test coordinates; the product-specific half is not a Core requirement.

Core also requires a deterministic Reader to produce a byte-equivalent canonical result for the same final source set and fixed Profile. Determinism here does not mean every timeline is identical. It means directory traversal order cannot change the governance verdict when the evidence is the same.

## Why file coordination still needs governance semantics

Putting Markdown files in directories is a storage technique, not a reliability model. A filesystem still permits duplicate sources, concurrent writers, torn updates, ambiguous locations, and evidence that disappears under an overwrite. The useful question is not “Can agents exchange files?” but “Which facts must remain true when those exchanges fail?”

TMPA Core supplies five constraints that give the file projection engineering meaning:

1. **Stable identity and provenance.** A governed object needs a stable identity, source relation, and accountable role. Two sources declaring the same task identity are a conflict to preserve, not an invitation to let the last writer win.
2. **Lifecycle and acceptance stay separate.** A task location may represent its current collaboration state, while a REPORT records an execution claim and an authorized decision records acceptance. One field called `done` cannot safely compress all three.
3. **Published objects are immutable; history remains reconstructable.** Rejection, failure, retry, and recovery append new evidence. They do not rewrite the past into a cleaner story.
4. **Conflict is a result.** When readers find two current locations or incompatible sources, they report the ambiguity and stop the affected transition. Traversal order, confidence, or a model guess must not silently manufacture consensus.
5. **Recovery comes from durable evidence.** A fresh reader must rebuild responsibility, lifecycle, unresolved dependencies, failures, and recovery relations without access to the previous agent's hidden reasoning.

FCoP projects part of those semantics into TASK, REPORT, ISSUE, REVIEW, lifecycle locations, and transition events. CodeFlowMu then assumes the product responsibilities that a protocol does not: observing files, checking dependencies, managing attempts and sessions, enforcing time-bounded authority, and choosing a recovery policy.

That hierarchy also limits what a test result proves. TMPA C01–C14 check conformance behavior for an exact Core bundle. The 12 scenarios later in this article target concrete CodeFlowMu storage, observation, dispatch, and test-oracle failures. Neither suite can stand in for the other, and the 12 scenarios are a test plan—not a claim that all twelve already pass.

## Storage faults: atomic rename is a commit point, not a universal guarantee

A common file commit is: write a uniquely named temporary file, flush its contents, then replace/rename the destination. POSIX `rename()` provides atomic name replacement under its defined conditions, which makes it useful as an observable commit point.

Keep the boundary narrow:

- Do not assume atomicity across mounts.
- `fsync(file)` is not automatically durable directory metadata after power loss.
- Windows sharing, antivirus scanning, or transient path disappearance can yield EPERM/ENOENT.
- A successful rename does not make downstream business effects exactly-once.
- A file lock does not automatically eliminate deadlock or every race.

On 2026-08-19, we ran the current CodeFlowMu [atomic-write test file](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/_internal/__tests__/atomic-write.test.ts) in the local working copy: **9 tests passed**. That supports the limited claim that the tested temp-file, replacement, and bounded-retry branches passed in this environment. It does not support “safe on every filesystem” or “exactly-once execution.”

A useful harness places faults between storage steps:

```ts
// Illustrative interface, not a published CodeFlowMu API.
await scenario({ seed: 42017 })
  .given(taskIn("active", "TASK-001"))
  .inject("after-temp-write", error("EPERM"), { times: 2 })
  .inject("after-replace-before-source-unlink", crash())
  .restartRuntime()
  .expect(oneCanonicalLocation("TASK-001"))
  .expect(historyExplainsCurrentState("TASK-001"))
  .expect(noUnboundedRetry());
```

The API shape is unimportant. The seed, injection point, error count, restart, and final verdict must be reproducible.

## Event faults: a watcher notification is not a business fact

Filesystem watchers may duplicate, merge, reorder, or miss transient notifications. A watcher event should therefore mean “re-read durable facts,” not “dispatch one task.”

Test duplicate observation paths together: emit two identical watcher events while periodic reconciliation finds the same TASK. Multiple observations are acceptable; only one constrained business commit is. The implementation may use a deduplication key, task revision, dispatch-intent record, or idempotent store. The test should specify the result rather than turn one lock design into a standard.

Also test a missed event: suppress the watcher completely and run reconciliation. The persistent task must still be discovered. Otherwise an optimization has quietly become the only fact-ingestion path.

## Dispatch faults: test attempt and lease commit boundaries

CodeFlowMu's current [`DispatchAttemptStore`](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/scheduler/DispatchAttemptStore.ts) persists `offered`, `claimed`, `running`, and terminal states, together with attempt, lease, session ID, and idempotency key. The existing `TaskDispatcher.twoPhaseDispatch.test.ts` mainly covers trusted and unknown routes, repeated holds, dependency blocking, explicit release, and `session_started`. It does **not** directly inject the two crash windows below.

The commit sequence that still needs fault injection is:

1. Persist an intent bound to task revision, target agent, and rationale.
2. Start the model session.
3. Commit the external session identity or a failure record.

The target contract is: after a crash following step 1, restart sees “attempt without session”; after session startup but before step 3, external session identity or an idempotency key prevents a blind second launch. These are test requirements in this article, not a claim that the current crash paths have already been verified.

This is still not exactly-once. For external APIs, Git pushes, payments, or other irreversible effects, a more realistic contract is at-least-once attempt, domain idempotency key, visible duplicates, and human-decidable recovery.

Busy agents and dependencies are fault inputs too. An unknown TASK source, a busy target agent, an incomplete parent, an unapproved gate, and simultaneous explicit wake plus automatic scan must all be tested instead of excluded by fixtures.

## PASS, FAIL, and NOT RUN are different facts

Our current rerun produced a more useful record than an all-green screenshot. Exact commands, environment, exit codes, and raw output are preserved in the [experiment run log](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-08-19-guided-article-pipeline-round1/02-experiment-run-log.md):

- Atomic-write tests: 9/9 passed.
- LAN address tests: 5/5 passed.
- Long-horizon planning tests did not load because `yaml` was missing.
- Two-phase dispatch tests did not load because `@cursor/sdk` was missing.
- The open-edition mobile-publication boundary test ran and failed because current permission semantics no longer match the older test contract. Exact identifiers and the raw assertion diff remain in the experiment log; the public engineering lesson is that implementation, user-facing permission language, and regression tests must move together.

Under Core S1.0, an environment or infrastructure failure that prevents the test body from running is **NOT RUN**, not PASS and not automatically a product FAIL. The PWA case is a genuine executed **FAIL**, but its semantic classification remains open: did the implementation intentionally migrate the contract and leave a stale test, or did it diverge from the approved contract? A test detects drift; it does not possess product authority to choose the contract.

> **A trustworthy test system must expose product defects, test-environment gaps, and stale tests as distinct conditions.**

## A minimum 12-case fault-injection set

| # | Scenario | Minimum verdict |
|---|---|---|
| 1 | Two sources declare one TASK ID | Report conflict; do not overwrite |
| 2 | One TASK exists in two lifecycle directories | Preserve the dual-location conflict |
| 3 | Crash during temp write | Canonical file remains readable; temp can be cleaned |
| 4 | Repeated EPERM/ENOENT on replace | Bounded retry; final failure remains visible |
| 5 | Duplicate watcher event | Repeat observation, not business commit |
| 6 | Missed watcher event; reconciliation only | Durable task is eventually found |
| 7 | Target agent is busy | No double dispatch; record the block |
| 8 | Dependency or gate is unmet | Do not start a session |
| 9 | Crash after dispatch intent | Restart recognizes intent without session |
| 10 | Crash after session start, before commit | Avoid blind duplicate start through identity/idempotency |
| 11 | REPORT is replayed | Preserve history; do not upgrade acceptance |
| 12 | Test dependency is missing | Report NOT RUN with environment evidence |

Twelve is not an official specification number or a certification suite. It is a minimum transition from demo testing to engineering testing. Performance, load, longevity, security, cross-platform, cross-filesystem, and real-process termination tests still remain.

The public [FoundationDB testing material](https://apple.github.io/foundationdb/testing.html) shows the mature version of the idea: deterministic simulation, fault injection, and reproducible seeds can turn rare interleavings into repeatable experiments. Its results do not transfer to CodeFlowMu. Its method does: random exploration can be broad, but failure reproduction must be narrow.

The purpose of testing a file-based multi-agent Runtime is not to prove that “files are reliable.” It is to prove that when files, events, processes, and agents can all fail, the system can still explain the current facts, incomplete actions, and the next authority allowed to decide.

## Primary sources

- [TMPA Core Specification S1.0](https://joinwell52-ai.github.io/joinwell52/en/publications/tmpa-core-specification-s1.0)
- [Implementation Case I1.0](https://joinwell52-ai.github.io/joinwell52/en/publications/implementation-case-i1.0)
- [FCoP v3 specification](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/spec/fcop-v3-spec.md)
- [POSIX rename](https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html)
- [FoundationDB Simulation and Testing](https://apple.github.io/foundationdb/testing.html)
