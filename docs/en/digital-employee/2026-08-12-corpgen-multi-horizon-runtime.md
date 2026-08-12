---
schema: "publication-candidate-article/v2"
title: "Multi-Horizon Work Needs a Runtime, Not a Larger Context Window"
date: "2026-08-12"
column: "digital-employee"
category: "academic"
article_type: "technical-analysis"
edition: "research-center"
research_question: "What architectural claims are actually supported by CorpGen's published evidence for concurrent multi-horizon work, and which parts remain hypotheses for production Digital Employee runtimes?"
summary: "Microsoft Research's CorpGen study suggests that concurrent long-horizon agent work is best treated as an explicit scheduling, isolation, memory and evaluation problem rather than one ever-growing context, while its controlled benchmark leaves production reliability and independent validation unresolved."
sources: "arXiv:2602.14229; Microsoft Research CorpGen publication and technical article; research/reading/Q-20260803-09-corpgen-multi-horizon.md; research/analysis/Q-20260803-09-corpgen-multi-horizon.md"
cover: "/assets/covers/academic-corpgen-multi-horizon.svg"
---

<ArticleCover
  image="/assets/covers/academic-corpgen-multi-horizon.svg"
  kicker="Digital Employee · Academic Observation 003"
  title="Multi-Horizon Work Needs a Runtime"
  summary="Long-horizon work becomes a systems problem when many tasks coexist: ownership, scheduling, memory, failure and evidence have to become explicit runtime state."
  version="DA003"
  status="Academic Runtime V5 · 2026-08-12"
  languageHref="/zh/digital-employee/2026-08-12-corpgen-multi-horizon-runtime"
  languageLabel="简体中文"
/>

# Multi-Horizon Work Needs a Runtime, Not a Larger Context Window

A long task and many concurrent long tasks are not the same engineering problem.

A single agent can sometimes survive a longer assignment by receiving a larger context window, better summarization, or more capable models. But once dozens of tasks coexist, the runtime has to answer questions that token capacity alone cannot answer: Which task owns the next action? Which one is blocked? Which memory belongs to which objective? How should failures be bounded? What evidence is sufficient to say that one task is actually complete?

Microsoft Research's 2026 CorpGen paper, *Scaling Agents for Enterprise Multi-Horizon Task Execution*, is useful because it studies exactly this transition. The paper calls the setting **Multi-Horizon Task Execution (MHTE)** and evaluates an architecture that makes planning, task isolation, memory, retry behavior and evaluation explicit.

The evidence supports a bounded conclusion: **concurrent long-horizon work is a runtime-coordination problem, not merely a context-length problem.** The evidence does not establish that CorpGen itself is a production-ready enterprise Digital Employee runtime.

## What changes when work becomes a portfolio of tasks?

The paper's MHTE setting involves many simultaneous objectives rather than one uninterrupted trajectory. The authors describe workloads with dozens of concurrent tasks, commonly 10–30 or more operational steps per task, and aggregate horizons extending into hundreds or more than a thousand interactions.

That changes the failure surface. Context saturation is only one problem. Cross-task memory interference, dependency management, reprioritization, retries and task-local state become separate runtime concerns.

This distinction matters because a larger context window can preserve more history while still leaving the runtime without an explicit answer to a basic operational question: **what is the current state of each work item?**

A Digital Employee that manages a portfolio of work therefore needs more than conversational continuity. It needs durable task identity, scheduling state, bounded local context and evidence about outcomes.

## What the CorpGen evidence actually reports

The primary study evaluates CorpGen in controlled, OSWorld-derived office workloads. The authors combine tasks into higher-load sessions, including a 46-task condition with a six-hour execution cap.

In the paper's main high-load comparison, the authors report **15.2 aggregate completed tasks for CorpGen versus 4.3 for the stated UFO2 baseline**. That is roughly a 3.5× relative improvement under the tested configuration.

The absolute number matters as much as the relative gain. At the hardest reported load, most tasks are still not completed. The result is evidence of improved coordination under stress; it is not evidence that the workload has been solved.

The ablation evidence also matters. In the reported 100% load condition, adding the cognitive model and tools raises the aggregate completion result to 8.7, while adding experiential learning raises it to 15.2. The source therefore attributes a material part of the gain to reuse of prior successful experience, not only to hierarchy or memory structure.

These are **source-reported research results** from the authors' own controlled experiment. This run identified no independent reproduction of the full CorpGen result.

## The architecture is more transferable than the headline score

The strongest contribution is not the 3.5× number. It is the decomposition of long-horizon work into explicit runtime mechanisms.

### Hierarchical planning separates horizons

CorpGen distinguishes longer-horizon objectives, daily task planning and operational actions. Planning can be updated as events occur instead of being frozen into one plan at the beginning of a run.

This matters because reprioritization becomes a first-class scheduling action. A runtime can revise which task should advance without rewriting the entire history of every other task.

### Isolated task agents bound cross-task interference

Individual work items can execute in isolated agent contexts. This creates a cleaner ownership boundary around task-local context and reduces the chance that unrelated task histories contaminate one another.

The important idea is not that every task must have its own model instance. The important idea is that **ownership of active context should follow ownership of work**.

### Tiered memory avoids chronological replay

The architecture separates working memory, structured long-term memory and semantic retrieval. It retrieves relevant state instead of replaying an ever-growing chronological transcript into every decision.

That is a runtime policy choice. Memory is not simply “more context”; it is a governed decision about what state remains active, what is stored durably and what is retrieved for a specific task.

### Retry and skip make failure schedulable

The implementation bounds repeated failure instead of allowing one task to consume the entire run indefinitely. After bounded unsuccessful attempts, work can be skipped and recorded as failed.

For a multi-task worker, this is essential. `Retrying`, `Blocked`, `Failed` and `Skipped` are not cosmetic labels. They determine whether unrelated work can continue.

### Experiential learning reuses successful work

CorpGen can retrieve prior successful trajectories for similar tasks. The mechanism uses semantic retrieval rather than updating model parameters during the run.

This is useful, but it also complicates interpretation of the experiment: some of the reported gain may depend on reusable experience from the task distribution. The result should not be reduced to “hierarchy alone solves long-horizon work.”

## Completion evidence is a separate problem from action history

One of the paper's most useful methodological observations concerns evaluation.

For office tasks, the durable output artifact can sometimes tell us more about completion than the action trace. A document, spreadsheet or other resulting state can be inspected directly instead of judging whether a long sequence of clicks merely looked plausible.

The paper reports a small meta-evaluation in which artifact-based judgments aligned with human judgments much more often than screenshot/action-trace-only evidence. But that comparison covered only **11 task executions**. The roughly 90% versus 40% agreement figures should therefore remain bound to that tiny evaluation rather than be treated as a universal law.

The broader lesson is narrower and more defensible: **completion evidence should be attached to the requested outcome, not inferred only from worker activity.**

That still leaves important cases unresolved. An artifact may exist while a harmful side effect also occurred. A file can be correct while the wrong account was used. A business record can be created while authorization was missing. Outcome evidence and authority evidence are not the same thing.

## Engineering implications for long-running agent systems

The CorpGen evidence suggests six runtime design consequences that apply beyond the specific implementation.

First, **task identity should be durable state**. If an item cannot be identified independently of prompt text, it cannot be safely reprioritized, retried or audited across a long run.

Second, **concurrency should be partitioned by ownership**. Task-local state should be isolated enough that one workstream does not silently mutate the reasoning context of another.

Third, **memory needs an explicit lifecycle**. Working context, durable state and semantic retrieval serve different purposes and should not collapse into one undifferentiated transcript.

Fourth, **failure needs scheduling semantics**. A worker should be able to say that one task is blocked or exhausted while other eligible tasks continue.

Fifth, **completion should prefer durable outcome evidence where possible**. Action traces remain useful for diagnosis, but activity is not completion.

Sixth, **relative improvement and absolute completion should always be reported together**. A system can be several times better than a baseline and still be far from reliable enough for unattended consequential work.

## Where the evidence stops

The paper is a primary research source, not independent validation of its own architecture. Several boundaries remain important.

The benchmark is constructed from controlled OSWorld Office tasks rather than longitudinal real-company work. The reported sessions are high-load and hours-long, but the main evaluation is not a multi-day deployment with credential expiry, human interruptions, changing permissions or organizational policy changes.

The study does not establish restart-safe exactly-once work semantics, transaction rollback, compensation for side effects, conflict control when concurrent tasks modify the same external resource, or an independent business acceptance authority.

The authors also identify limits around GUI reliability, state assumptions, compute overhead and the absence of ground-truth real corporate behavioral data.

None of these limitations erase the engineering value of the experiment. They define what the experiment is evidence for.

## What should be tested next?

The next research step is not to ask whether one model can handle even more tokens. It is to test the runtime boundaries that the paper makes visible.

Can task identity and ownership survive process restart without duplicate consequential actions? Can a scheduler preserve fairness while priorities change continuously? Can isolated task contexts coordinate safely when they touch the same external resource? Can artifact-based completion evidence detect delayed or hidden side effects? Do the same coordination gains reproduce independently on non-OSWorld enterprise workloads?

Those questions separate a promising multi-horizon research architecture from a production Digital Employee runtime.

The useful conclusion is therefore precise: **when work becomes a portfolio, the runtime must carry the portfolio as state.** Context length can help an agent remember more. It cannot replace ownership, scheduling, bounded failure, durable memory and outcome evidence.

## References

1. Microsoft Research / arXiv, **Scaling Agents for Enterprise Multi-Horizon Task Execution**, arXiv:2602.14229 — https://arxiv.org/abs/2602.14229
2. Full paper HTML — https://arxiv.org/html/2602.14229
3. Microsoft Research, **CorpGen: Scaling agents for enterprise multi-horizon task execution** — https://www.microsoft.com/en-us/research/blog/corpgen-scaling-agents-for-enterprise-multi-horizon-task-execution/
4. Governed Deep Reading — `research/reading/Q-20260803-09-corpgen-multi-horizon.md`
5. Governed Research Analysis — `research/analysis/Q-20260803-09-corpgen-multi-horizon.md`
