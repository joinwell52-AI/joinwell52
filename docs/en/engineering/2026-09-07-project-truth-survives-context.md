---
title: "Context Can Disappear; Project Truth Cannot"
date: '2026-09-07'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "当自主软件工作跨越多次调用甚至多天时，哪些制品与证据身份必须跨越每个上下文窗口持续存在，为什么验收不能继承实现者自己的完成声明？"
summary: "Long-horizon agent engineering does not primarily need an endless conversation. It needs durable candidate identity, artifact state, evidence state, and role authority. Acceptance belongs to the revision that was tested, and later changes can make earlier evidence stale."
sources:
  - research/analysis/Q-20260907-03-durable-project-truth-independent-acceptance.md
item_id: "Q-20260907-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-07-project-truth-survives-context-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-07-project-truth-survives-context-cover.png"
  kicker="Open-source Engineering · Daily Research"
  title="Context Can Disappear; Project Truth Cannot"
  summary="Long-horizon agent engineering does not primarily need an endless conversation. It needs durable candidate identity, artifact state, evidence state, and role authority. Acceptance belongs to the revision that was tested, and later changes can make earlier evidence stale."
  version="Q-20260907-03"
  status="Daily Runtime V5 · 2026-09-07"
  languageHref="/zh/engineering/2026-09-07-project-truth-survives-context"
  languageLabel="中文"
/>

# Context Can Disappear; Project Truth Cannot

A defect was tested, accepted, and closed yesterday. Another change lands today and the defect returns. Nothing contradictory happened: **yesterday's acceptance belonged to yesterday's candidate revision, not to the project forever.**

This is the continuity problem that long-horizon agent software work can hide behind a context window. A model may remember plans, recent failures, and test observations. Once the invocation ends, that memory can vanish. If the next agent receives only source code, it may have to infer unresolved obligations from implementation details. If it receives only a prose summary, it may not know which exact revision the claimed evidence actually tested.

The durable object therefore is not the full conversation. It is **project truth**: which candidate exists, what artifact state defines it, what evidence is valid for that candidate, and which role is authorized to act next.

## Conversational continuity is not project continuity

Larger context windows are useful. They help an agent see prior decisions, avoid repeated exploration, and preserve local reasoning that is hard to structure.

But context answers "What can the model see now?" It does not automatically answer four different questions:

- Which exact code revision was tested?
- Which behaviors were validated and which obligations remained unresolved?
- Did a later change touch the dependencies of those validation claims?
- Has the current planner, developer, or tester been re-admitted with the correct scope and authority?

If those facts exist only in narrative memory, a recovered agent can easily transform "someone previously said this passed" into "the current candidate still passes."

## A long-horizon study separates planning, development, and acceptance

The same-day research object examines the primary Harness-of-Harness study. Its loops invoke a Project Planner, Developer, and QA Tester separately, while artifact state and evidence state persist across loop boundaries as distinct forms of project memory.

Across GameCraft-Bench, FrontierSWE, and ProgramBench, the study reports three harness-model configurations improving by an average 52.25% after three iterations, with a reported maximum relative gain of 82.86% in the tested conditions. Those are configuration-specific research results, not universal productivity estimates.

The multi-day software case is more revealing for continuity. It spans more than 70 loops while retaining versioned code, issue history, and evidence packets. By Loop 70, 65 of 81 recorded issues were closed, 16 remained unresolved, and 17 issues had been reopened after later changes reintroduced previously validated failures.

Those reopened defects expose a simple rule: **acceptance has revision freshness.**

## Four identities make project truth recoverable

The evidence supports separating at least four identities that a context summary should not collapse.

**Candidate identity** answers which exact artifact revision is being planned, changed, tested, or accepted. Without it, test evidence attaches only to a vague project state.

**Artifact state** is the code, configuration, resources, and metadata that define what the candidate is. It tells the next role what currently exists.

**Evidence state** contains validated behaviors, unresolved failures, test observations, known failed approaches, and acceptance boundaries. Code alone cannot fully encode why an obligation remains open. Evidence without a candidate pointer cannot establish which implementation produced the observation.

**Role authority** defines the admitted inputs, permissions, and required outputs for Planner, Developer, and QA at each invocation. Resuming a session should not silently inherit the previous role's authority.

Together, these identities make project truth recoverable without preserving every reasoning token. The deterministic boundary can fix identities, permissions, required artifacts, and transitions while still allowing agents to choose local implementation methods.

## "Developer done" and "candidate accepted" are different facts

A developer reporting completion is an implementation claim. Candidate acceptance is a different fact: an independently admitted role or mechanism observed a fixed candidate under a defined contract and produced inspectable evidence.

Collapsing the two creates dangerous inheritance. The implementing invocation changes the code, promotes its own confidence into final completion, and a later invocation consumes that state as authoritative project truth.

Independent acceptance does not necessarily require a different model vendor. Separate invocations, frozen candidate inputs, scoped permissions, and candidate-bound evidence already create a meaningful execution boundary. But role separation alone does not prove statistical independence. Developer and QA can still share blind spots when they use the same model family, weak tests, or common assumptions.

High-risk claims may therefore require model diversity, deterministic tests, human review, or external evaluation.

## After a change, old evidence must answer a freshness question

A long-lived project should not treat `Closed` as a permanent property of an issue. A more accurate statement is: an issue was closed against a specific candidate, based on a specific evidence set.

When a later change touches behavior that evidence depends on, the system should invalidate or re-run the affected evidence. The brute-force strategy is to re-run everything after every change. A more selective system records dependencies between evidence and modules, interfaces, configuration, or behavior, then revalidates only what may have become stale.

This is why durable evidence cannot be only `PASS`. It needs candidate identity, observed property, execution environment, evidence location, and freshness dependencies. Otherwise the system knows only that something was green once, not whether the green light still means anything.

## Larger context still helps; it should not become the source of truth

The argument is not against long context. Rich context can improve local reasoning and reduce duplicated work. It is useful material for the agent.

It should not be the authoritative project record. Recovery should first restore candidate identity, unresolved obligations, evidence, and role authority, then reconstruct only the context needed for the next decision. Reversing that order asks model narration to carry responsibilities that belong in durable state.

More state is not automatically better either. A minimal checkpoint can retain the exact candidate, unresolved obligations, valid evidence, invalidation conditions, materially important failed approaches, and next-role authority. It does not need to archive every internal thought.

## Evidence boundary and open questions

The current evidence comes from author-reported primary research across selected benchmark families and one large multi-day case. It shows that this separated architecture can improve outcomes and preserve recoverable history in the examined settings. It does not establish production correctness, crash consistency, exactly-once external effects, security, or universal transfer to all software engineering work.

Open questions include the minimum sufficient acceptance packet; how to automatically determine which evidence becomes stale after a dependency change; when role separation is enough and when model or institutional diversity is required; how irreversible external effects should be reconciled with candidate identity; and how checkpoints can remain compact without losing the decision facts needed to avoid repeated failures.

Long-horizon agent engineering therefore needs a relationship more durable than an endless chat: **context may disappear between invocations; candidate and evidence identity must not. Implementation may keep changing; acceptance must always know what it accepted.**

**Evidence and sources:**

- [Harness-of-Harness: A Long-Horizon Software Engineering Study](https://arxiv.org/html/2609.01481v1)
