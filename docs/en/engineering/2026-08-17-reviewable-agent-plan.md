---
title: "Don't Let the Agent Code Yet—and Don't Trust Its Plan Blindly"
date: '2026-08-17'
column: open-source-engineering
category: daily
article_type: technical-analysis
edition: research-center
research_question: "How can a reviewable planning artifact reduce requirement omissions in complex coding-agent tasks without turning a flawed plan into a new source of authority?"
summary: "Complex agent work benefits from planning, but a plan is not a new source of truth. It must trace back to the original requirements, real code locations, and verification methods—and record execution drift—or a polished bad plan can be worse than no plan."
sources:
  - research/manual-runs/2026-08-17-high-quality-article-pipeline/10-forum-demand-discovery-2026-08-18.md
  - research/manual-runs/2026-08-17-high-quality-article-pipeline/11-two-topic-deep-reading-and-fact-matrix.md
  - research/manual-runs/2026-08-17-high-quality-article-pipeline/12-two-topic-article-briefs.md
item_id: "MANUAL-20260817-PLAN"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-17-reviewable-agent-plan-cover.webp"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-17-reviewable-agent-plan-cover.webp"
  kicker="Open-source Engineering · Research Article"
  title="Don't Let the Agent Code Yet—and Don't Trust Its Plan Blindly"
  summary="Complex agent work benefits from planning, but a plan is not a new source of truth. It must trace back to the original requirements, real code locations, and verification methods—and record execution drift—or a polished bad plan can be worse than no plan."
  version="MANUAL-20260817-PLAN"
  status="Independent Editorial PASS · 2026-08-18"
  languageHref="/zh/engineering/2026-08-17-reviewable-agent-plan"
  languageLabel="中文"
/>


# Don't Let the Agent Code Yet—and Don't Trust Its Plan Blindly

Coding agents fail in two familiar ways on large tasks.

In the first, an agent receives “refactor the authentication flow” and starts editing immediately. Two hours later, some tests pass, but the audit log, migration compatibility, and one edge path were never implemented.

The second failure looks more disciplined. The agent produces a polished plan and a human approves it. Unfortunately, the plan misunderstood an authorization boundary in its first step. Every downstream agent follows it faithfully, turning one mistaken interpretation into coordinated changes across modules and tests.

The important question is not simply whether planning happens before coding. It is: **what authority does the plan acquire once it exists?**

## The evidence supports planning—but not “any plan is better”

Cursor's official agent guidance describes Plan Mode as a four-stage process: research the codebase, ask clarifying questions, produce a detailed plan with file paths and code references, and wait for approval. It also says that quick or familiar changes may not need a detailed plan. [[1]](https://cursor.com/blog/agent-best-practices)

Forum guides for larger projects converge on similar practices: short sessions, Git checkpoints, explicit goals, an implementation plan, and tests that keep success criteria visible. [[2]](https://forum.cursor.com/t/an-idiots-guide-to-bigger-projects/23646) These posts establish demand for a practical workflow. They do not establish an effect size.

More useful evidence comes from the 2025 [E2EDevBench study](https://arxiv.org/abs/2511.04064). The authors selected 50 Python projects from PyPI across 2024 Q1 to 2025 Q1. The projects averaged 19.2 source files, 2,011.5 lines of code, and 119.7 tests. On one SWE-Agent-based toolchain, they compared three sequential workflows using Gemini 2.5 Pro and Flash. [[3]](https://arxiv.org/abs/2511.04064)

The best individual configuration, Developer-Tester with Pro, implemented 53.50% of requirements. Averaged by workflow, Developer-Tester reached 49.48%, Single Agent reached 45.72%, and the apparently more structured Designer-Developer-Tester workflow reached only 27.71%. [[3]](https://arxiv.org/abs/2511.04064)

That result rules out a simplistic conclusion: adding a planning role and a design document does not automatically make an agent system more reliable.

## A bad plan becomes dangerous when it replaces the requirement

Why did the Designer-Developer-Tester workflow perform so poorly? After inspecting trajectories, the authors propose a mechanism. The Developer receives a design document that appears authoritative, so it prioritizes that plan over direct engagement with the original requirements—even though the requirements remain in context. A flawed design is then propagated faithfully into implementation. [[3]](https://arxiv.org/abs/2511.04064)

This is the authors' interpretation, not a causal experiment that independently randomized plan quality. Extra handoffs, context compression, or the workflow prompts could explain part of the gap. But the result exposes a concrete engineering failure mode: **authority inversion**.

The original requirement should remain the canonical input. A plan is a derived interpretation and execution proposal. Once the derived artifact becomes easier to read and more formal than its source, agents and reviewers may silently treat it as the higher authority. The system then executes coherently while moving away from user intent.

Human teams have the same problem with design documents. The difference is that an agent is exceptionally good at carrying a clear plan forward. One upstream omission therefore gains a larger propagation radius.

## Many failures begin before code generation

E2EDevBench also analyzed 1,000 unimplemented requirements sampled from the 50 projects, the Pro model, and all three workflows. The authors used LLM pre-annotation followed by human refinement. Within that sample, Task Planning accounted for 55.8% of root causes: requirement omission 27.9%, requirement misinterpretation 22.2%, and architectural design flaws 5.6%. Task Execution accounted for 38.6%, and Task Verification for 5.7%. [[3]](https://arxiv.org/abs/2511.04064)

These figures must not be generalized into “55.8% of all coding-agent failures come from planning.” The experiment used two Gemini models and medium-sized Python projects reconstructed from requirement documents. It is not the same as a migration or refactor inside an established enterprise monorepo. Evaluation also depended on a Test Migration Agent and an LLM judge.

The narrower lesson is still valuable. Better code generation alone may not repair the most common upstream failures in this setting. An agent can produce syntactically correct, locally tested code while completely omitting a requirement that never made it into the working plan.

A 79-page observational study, [AI Agents and Higher-Order Work](https://suproteem.is/assets/files/agents.pdf), provides a different signal. The author examined 119,960 users matched to professional characteristics across 1,000 firms using Cursor; the message-intent subsample covered 399 firms. Plan intent appeared in about 4.21% of first messages. One standard deviation of additional work experience—about seven years—was associated with a 0.45 percentage-point increase in Plan rate, roughly 11% relative to that base rate. [[4]](https://ssrn.com/abstract=5713646)

This is not evidence that planning caused better output. The intent classifier did not receive a reported independent human accuracy audit, the regressions had low R-squared values, and task selection could influence experience, planning, and acceptance together. The defensible interpretation is smaller: more experienced users were more likely to seek alignment before execution.

## A plan should be a six-part review contract

What a complex task needs is not a fluent implementation essay. It needs a derived artifact designed to expose mistakes. A minimal Plan Contract can contain six sections:

```yaml
requirements_map:
  - requirement_id: R1
    source: exact issue/spec location
    interpretation: reviewable statement of what the agent thinks R1 means
    planned_steps: [S1, S3]

code_map:
  - step_id: S1
    files_or_symbols: [real paths or symbols]
    evidence: search results, call graph, or existing tests

dependencies_and_risks:
  - migrations, external APIs, permissions, concurrency, rollback

verification:
  - test, static check, or human acceptance criterion for each requirement

non_goals:
  - what this task will not change, and why

execution_delta:
  - deviations, new findings, and whether re-approval is required
```

This contract has three important properties.

First, every requirement must trace to work and verification. “Update the service layer and add tests” is not sufficient. A reviewer should be able to see where each source requirement lands. An unmapped requirement is an omission discovered before code exists.

Second, code locations need evidence. Paths, symbols, and dependencies should come from repository exploration, not from guessing based on the issue title. This is why Cursor's guidance explicitly asks for file paths and code references. [[1]](https://cursor.com/blog/agent-best-practices)

Third, the plan must never eclipse the original requirement. Developers, testers, and reviewers should retain the canonical source alongside the plan. If they conflict, the system should return to the source and re-plan—not continue merely because an approval already exists.

## Human approval is not a sufficient gate

Polished prose is easy to skim and approve. A real plan review should ask:

- Does every original requirement have a destination?
- Does every high-risk step have evidence and a verification method?
- Has the plan introduced scope the source never authorized?
- Does the tester derive acceptance from the original requirements, not only from the plan?
- When execution discovers a new fact, is the deviation visible and does it trigger re-review?

This is also why the plan belongs in a reviewable repository artifact rather than only in a chat history that may later be summarized. It should be diffable, commentable, versioned, and tied to a code baseline.

## Not every change needs the heavy gate

Planning has a coordination cost. A low-risk, one-line fix at a known location with an obvious test may need only a one-sentence goal, one target, and one verification command. Requiring a six-part contract for every edit turns control into paperwork.

The stronger gate belongs on cross-module changes, migrations, authorization changes, public API modifications, hard-to-reverse operations, and tasks where one omitted requirement can make “tests passed” a misleading completion signal.

## What remains unproven

The six-part Plan Contract is our synthesis from product behavior, a controlled experiment, and an observational study. No independent study has yet measured how much this exact structure reduces omission in real large repositories. A useful next experiment would compare no plan, free-form planning, and traceable planning on requirement completion, rework, review time, and cost.

The existing evidence is already enough to reject two unsafe extremes: letting an agent start a complex task with immediate code edits, and letting it obey an unchecked plan as if that plan were the requirement itself.

A plan is valuable not because it makes the agent look organized, but because it gives the team one last chance to find the wrong interpretation before the repository embodies it.

## Sources

1. [Cursor: Best practices for coding with agents](https://cursor.com/blog/agent-best-practices)
2. [Cursor Forum: An Idiot's Guide To Bigger Projects](https://forum.cursor.com/t/an-idiots-guide-to-bigger-projects/23646)
3. [Benchmarking and Studying the LLM-based Agent System in End-to-End Software Development](https://arxiv.org/abs/2511.04064)
4. [AI Agents and Higher-Order Work: author-hosted PDF](https://suproteem.is/assets/files/agents.pdf); [SSRN record](https://ssrn.com/abstract=5713646)

