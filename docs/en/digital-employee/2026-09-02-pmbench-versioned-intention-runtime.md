---
schema: "publication-candidate-article/v2"
title: "A Deferred Intention Is Not a Memory Entry"
date: "2026-09-02"
column: "digital-employee"
category: "academic"
article_type: "technical-analysis"
edition: "research-center"
research_question: "What runtime architecture is required when an agent must execute the latest valid deferred intention at the correct future cue rather than merely recall it?"
summary: "PM-Bench separates remembering an instruction from acting when it is actually due. Its results suggest that more monitoring alone is not enough; a long-running agent needs versioned intention state, an observation policy, due-state admission and durable effect evidence."
sources: "arXiv:2607.12385; genglinliu/PMBench @ e1093c470c8981daf522d4ef047a7c3a71e077d7; research/reading/A-20260902-01-pmbench-prospective-memory.md; research/analysis/A-20260902-01-pmbench-prospective-memory.md"
cover: "/assets/covers/academic-pmbench-versioned-intention-runtime.png"
---

<ArticleCover
  image="/assets/covers/academic-pmbench-versioned-intention-runtime.png"
  kicker="Digital Employee · Academic Observation 006"
  title="A Deferred Intention Is Not a Memory Entry"
  summary="Remembering a future task is not the same as having authority to execute it now."
  version="DE006"
  status="Academic Runtime V5 · 2026-09-02"
  languageHref="/zh/digital-employee/2026-09-02-pmbench-versioned-intention-runtime"
  languageLabel="中文"
/>

# A Deferred Intention Is Not a Memory Entry

A user says: “When the shipment arrives, send the confirmation.”

A long-context agent may remember this sentence perfectly for days. It can quote it back, explain what it means and keep it in a todo list. Yet none of those facts prove that the agent will do the right thing when the shipment actually arrives.

It can still fail in several ways. It may never check shipment status. It may send the confirmation before arrival. It may miss a reschedule. It may execute an instruction that was cancelled yesterday. Or it may retry after a network timeout and send the same confirmation twice.

Those are not all retrieval failures.

**PM-Bench: Evaluating Prospective Memory in LLM Agents**, introduced by Genglin Liu and Saadia Gabriel, makes this distinction measurable. Instead of asking only whether an agent can recall past information, PM-Bench asks whether it can carry a deferred intention through ongoing activity and execute it at the correct future time or environmental cue. The arXiv record was submitted on July 14, 2026 and lists the work as a COLM 2026 conference paper.

The narrower finding is already useful: **prospective memory is a separate agent capability from retrospective recall.** The engineering consequence we derive is stronger, and must be labeled as our own: a deferred intention should be a versioned runtime object whose future authority is evaluated against current evidence, not merely a string stored in memory.

## PM-Bench tests “remember to act,” not just “remember”

The benchmark simulates a seven-day week with 80 steps. The paper reports 83 task definitions, 81 scored executable tasks, including event-based and time-based tasks, regular and one-off tasks, cross-day tasks, and 11 updates covering cancellation, override and rescheduling.

The environment exposes channels such as clock, email, calendar, course portal, price tracker, bank balance, shipment status, laundry status, library hold, reservation waitlist and appointment portal. Some deferred intentions therefore cannot become actionable until the agent checks the relevant state.

That structure creates a distinction that production runtimes also need:

**active does not mean due.**

A task can be a valid future obligation and still provide zero authority to act at the current moment. PM-Bench formalizes a due set at each step: the currently valid tasks whose execution conditions are satisfied now.

This sounds simple. It is one of the most important boundaries in long-running agent design.

## A bigger memory can preserve the wrong intention perfectly

Prospective-memory failures are especially dangerous when the instruction changes.

Suppose the user first says “renew the reservation Friday morning,” then later reschedules it to Friday afternoon. A memory system that keeps both messages has succeeded at retention. A runtime that still treats the old version as executable has failed at authority.

Cancellation is even clearer. The old intention should remain in history because the system may need to explain what happened. But historical persistence must not imply current execution authority.

PM-Bench includes cancellation, override and rescheduling cases precisely because prospective behavior depends on maintaining the current intention, not simply retaining more text.

This gives us a useful rule:

> **History should be appendable; authority should be versioned.**

The old instruction can remain visible for audit. Only the latest valid version may become due.

## More heartbeat is not the same as more reliability

PM-Bench evaluates eight agent configurations across eight model backbones. These include a single-agent baseline, todo ledger, optional heartbeat, automatic heartbeats, a hierarchical specialist design and replay-based ensembles.

The paper's aggregate results are important because they resist a tempting shortcut.

The optional-heartbeat configuration reports the highest aggregate macro F1, **65.1**. A 30-minute automatic heartbeat performs more queries but reports **489 false positives** and a lower aggregate macro F1 of **57.8**. The hierarchical union-query setup performs **1,661 queries** yet reports aggregate macro F1 of **45.2**.

These are author-reported benchmark results; this Academic run did not independently reproduce them. They do not prove that fewer checks are always better. They support a narrower point: **polling more often is not a substitute for deciding what to observe, when to observe it and what evidence is sufficient to act.**

A digital employee that checks every connector every few minutes may look vigilant while wasting tokens, tool calls and provider quota. Worse, every observation creates another opportunity for premature or duplicate action if admission is weak.

Monitoring therefore needs its own policy.

## No scaffold wins for every model

The paper also reports different best configurations for different backbones. Optional heartbeat is strongest for some tested models; a plain single-agent baseline is strongest for others; a todo ledger or automatic heartbeat wins elsewhere.

That variation matters. It means we should not turn “prospective memory” into one universal prompt wrapper.

A good runtime can instead externalize the stable part of the problem — intention identity, version, observation, due-state proof and effect evidence — while still allowing different models to use different reasoning strategies inside that boundary.

The model can remain intelligent. The future authority should become inspectable.

## Cross-day and update-sensitive tasks expose the lifecycle

PM-Bench reports that no tested setup exceeds 50% on both cross-day and update-sensitive task performance. Its strongest aggregate cross-day result is 50.0%; its strongest update-sensitive result is 47.2%.

Again, these are source-reported figures, not independent reproduction. But the two categories reveal different failure mechanisms.

A cross-day task asks whether an intention survives intervening activity. An update-sensitive task asks whether the system can retire stale authority after cancellation, override or rescheduling.

The first looks like memory persistence. The second is unmistakably lifecycle control.

A system can therefore be excellent at remembering and still be unsafe at acting.

## A four-boundary prospective-intention runtime

The following architecture is a **Research Center synthesis** inspired by PM-Bench. It is not an architecture proposed or validated by the paper.

![Four-boundary prospective-intention runtime: intention state, observation policy, due/action admission and effect evidence.](/assets/figures/academic-pmbench-four-boundary-intention-runtime.svg)

### 1. Versioned Intention State

A deferred intention should have a durable identity and version, not only natural-language text.

At minimum, keep its current status, trigger, timezone, dependencies, target and supersession history. Cancellation should close authority. Rescheduling should create or advance a version. Completion should be durable.

The important asymmetry is deliberate: **old versions remain auditable but cannot become executable again just because the model recalls them.**

### 2. Observation Policy

The runtime must know what evidence can make the intention due.

A calendar event can be event-driven. A shipment may require provider notification or polling. A price threshold may require a fresh market observation. A human reply may arrive through an inbox webhook.

Each trigger therefore needs an observation policy: source, cadence or subscription, freshness, cost and evidence identity.

This is where the PM-Bench monitoring results become useful. The right question is not “how often should the model wake up?” but “what evidence is required to decide this intention, and what is the cheapest reliable way to obtain it?”

### 3. Due / Action Admission

Before any side effect, check the current intention against current evidence.

A minimal rule looks like this:

```text
latest_version
AND status == active
AND trigger == satisfied_now
AND dependencies == satisfied
AND effect_not_already_committed
=> action_admitted
```

This boundary prevents a common semantic collapse: active future work becoming present permission.

The model may help interpret ambiguous language, but the runtime should still bind the resulting interpretation to a version and an evidence snapshot before granting authority.

### 4. Effect Evidence

The system must record what actually happened externally.

An effect receipt can bind the intention ID and version, the admission evidence, the action identity, provider response and completion state. This is not part of PM-Bench's synthetic evaluation; it is an additional production requirement.

Why add it? Because prospective execution and recovery meet at exactly this boundary. If an API call succeeds but the agent crashes before seeing the response, “remembering the intention” on restart can cause a duplicate side effect. The runtime needs provider-effect evidence to decide whether retry is safe.

## A todo list helps, but it is not the whole contract

PM-Bench reports that a todo ledger improves aggregate performance relative to the single baseline. That is useful evidence that explicit task state can help.

But a todo item normally answers “what should I remember?” A production intention record must also answer:

- which version is current;
- which observation proves the trigger;
- whether the action is due now;
- whether dependencies are satisfied;
- whether the external effect already occurred.

That difference is why prospective memory belongs partly in the model and partly in the runtime.

## What PM-Bench supports — and what it does not

The paper and its official repository provide primary evidence for several bounded claims:

- prospective memory can be evaluated separately from retrospective recall;
- delayed tasks with hidden triggers, cross-day persistence and updates remain difficult for the tested agents;
- no single scaffold dominates all evaluated model backbones;
- more monitoring queries do not automatically produce the best aggregate outcome.

They do **not** establish:

- that our four-boundary runtime is the uniquely correct architecture;
- exactly-once semantics for real external providers;
- that PM-Bench scores predict enterprise safety;
- that a particular heartbeat cadence is universally optimal;
- independent reproduction of the source-reported headline results.

The paper and `genglinliu/PMBench` repository are the same primary research family. This run found no independent full reproduction. COLM publication is publication evidence, not correctness proof.

## The operational rule

A long-running digital employee should not treat “I remember the instruction” as permission to act.

The safer structure is:

```text
memory          -> helps the model recall
intention state -> identifies the latest valid future obligation
observation     -> proves the current trigger state
due admission   -> grants authority for this moment
effect evidence -> proves what happened externally
```

This makes prospective behavior inspectable. When the agent misses a task, we can ask whether it lost the intention, failed to observe the trigger, mis-evaluated due state or failed at execution. When it acts incorrectly, we can ask whether it used a stale version, admitted too early or replayed an already-completed effect.

That is a better failure model than saying simply, “the agent forgot.”

## What remains open

PM-Bench creates a controlled testbed, but production systems still need answers to harder questions. How should observation budget be scheduled across thousands of deferred intentions? Which triggers should use events rather than polling? How should schedule materializations be invalidated after rescheduling? What provider evidence is sufficient to prevent duplicate effects after ambiguous timeouts? How should a runtime separate a model-memory failure from a scheduler or connector failure?

Those questions point to the next evaluation step: not a larger memory benchmark, but a runtime benchmark that injects cancellation, rescheduling, delayed provider acknowledgements, crashes and retries.

Until then, the practical conclusion is bounded but strong: **a deferred intention is not merely something an agent should remember. It is future authority, and future authority needs a lifecycle.**

## Sources and evidence boundary

1. Genglin Liu and Saadia Gabriel, **PM-Bench: Evaluating Prospective Memory in LLM Agents**, arXiv:2607.12385, 2026-07-14 — https://arxiv.org/abs/2607.12385
2. Full paper HTML — https://arxiv.org/html/2607.12385
3. Official repository **genglinliu/PMBench**, inspected at `e1093c470c8981daf522d4ef047a7c3a71e077d7` — https://github.com/genglinliu/PMBench
4. Governed Deep Reading — `research/reading/A-20260902-01-pmbench-prospective-memory.md`
5. Governed Research Analysis — `research/analysis/A-20260902-01-pmbench-prospective-memory.md`

**Evidence boundary:** Items 1–3 are primary/first-party research artifacts. Numerical results are source-reported and were not independently reproduced in this run. The four-boundary prospective-intention runtime is explicitly Research Center synthesis rather than a PM-Bench author claim.
