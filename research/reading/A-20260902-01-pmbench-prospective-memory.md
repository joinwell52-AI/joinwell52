# Deep Reading — A-20260902-01 PM-Bench prospective memory

- **Runtime date:** 2026-09-02
- **Research object:** A-20260902-01
- **Primary object:** *PM-Bench: Evaluating Prospective Memory in LLM Agents*
- **Primary paper:** arXiv:2607.12385, submitted 2026-07-14; arXiv metadata lists COLM 2026 publication
- **Authors:** Genglin Liu, Saadia Gabriel
- **Official code:** `genglinliu/PMBench` @ `e1093c470c8981daf522d4ef047a7c3a71e077d7`
- **Evidence identity:** primary research plus author-maintained implementation/results; not independent reproduction

## Research question

For long-running agents, is a delayed intention mainly a retrieval problem, or does reliable execution require a separate prospective-memory runtime that tracks current intention state, observes the right condition, admits action only when the current trigger is due, and records the resulting effect?

## What the paper changes

Most agent-memory evaluation asks whether past information can be retrieved. PM-Bench targets a different capability: whether an agent can remember **to act later**, at the right future time or environmental cue, while other activity continues. The distinction is operational. An agent may perfectly remember an instruction and still act too early, too late, after cancellation, after a reschedule, or without noticing the hidden state change that makes the instruction due.

PM-Bench therefore separates retrospective memory from prospective memory. The benchmark asks the agent repeatedly to continue an ongoing activity while deciding whether any deferred task is currently due. This turns memory into a timing, monitoring and state-update problem rather than a static recall question.

## Benchmark construction facts

The paper reports a deterministic seven-day simulated week with **80 steps** and **83 task definitions**, of which **81 are scored executable tasks**. The task set includes **57 event-based** and **26 time-based** tasks, **28 regular** and **55 non-regular** tasks, **15 channel-triggered** tasks, **7 cross-day** tasks and **11 task updates** consisting of cancellation, override and rescheduling cases.

The simulated environment exposes **11 state channels**, including clock, email, calendar, course portal, price tracker, bank balance, shipment status, laundry status, library hold, reservation waitlist and appointment portal. The benchmark also includes **74 lures**, which make indiscriminate acting costly.

Scenario generation uses a fixed seed and manual review. The paper describes structural and solvability checks and a perfect-play oracle that monitors the required channels and can complete all non-cancelled tasks. That design matters because it bounds one common confound: an agent should not be penalized for an impossible scenario.

## The key formal distinction: active is not due

At every step, PM-Bench defines a due set `D_t`: tasks that are still active and valid **and** whose current execution condition is satisfied. The agent can query environment channels and then act.

This creates four distinct failure surfaces:

1. **Intention retention:** the agent loses the deferred task entirely.
2. **Intention revision:** the agent fails to incorporate cancellation, override or rescheduling.
3. **Condition monitoring:** the agent does not query or notice the channel that determines whether a task is due.
4. **Action timing/content:** the agent acts outside the due set, misses a due action or executes the wrong content.

A larger context window can help with the first surface but does not, by itself, solve the other three.

## Eight models, eight scaffolds

The study reports **64 runs** formed by eight model backbones and eight agent configurations: single-agent baseline, todo ledger, optional heartbeat, automatic heartbeat at 60 minutes, automatic heartbeat at 30 minutes, hierarchical union-query with specialist subagents, majority replay and unanimous replay.

The main metric is set-level F1 over the due action set. This is a useful choice because precision-only rewards under-action and recall-only rewards indiscriminate action. PM-Bench also records false positives, misses, late actions, wrong-content actions, update violations, dependency violations and query behavior.

## Source-reported aggregate results

All numbers below are author-reported and were not independently reproduced in this run.

The paper's aggregate table reports:

- **Single baseline:** macro F1 60.0, precision 66.7, cross-day 44.6, update 37.5, 199 false positives, 106 queries.
- **Todo ledger:** macro F1 62.8, precision 73.2, cross-day 37.5, update 41.7, 134 false positives, 118 queries.
- **Optional heartbeat:** macro F1 **65.1**, precision 70.6, cross-day **50.0**, update 44.4, 178 false positives, 130 queries.
- **Auto heartbeat 60m:** macro F1 56.6, 422 false positives, 172 queries.
- **Auto heartbeat 30m:** macro F1 57.8, update **47.2**, 489 false positives, 203 queries.
- **Hierarchical union-query:** macro F1 45.2 with **1,661 queries**.
- **Majority replay:** macro F1 37.2 with 655 false positives and 1,661 queries.
- **Unanimous replay:** macro F1 35.3 with 279 false positives and 1,661 queries.

The strongest aggregate scaffold is therefore not the most aggressive monitor. More querying can increase both observation coverage and false-alarm pressure.

## No universal best scaffold

The paper also reports different best configurations by backbone. Examples include optional heartbeat for GPT-5.4, single baseline for GPT-5.3-Codex and Mistral Large, todo ledger for Llama3.3-70B and Mistral Small, auto-heartbeat 30 for Qwen3-32B, and optional heartbeat for Qwen3-8B.

This supports a bounded conclusion: prospective-memory support is not a single wrapper that uniformly improves every model. The useful scaffold depends on how a model balances intention retention, observation, timing and false positives.

## Monitoring is necessary but expensive

The channel-level analysis is especially relevant to long-running agent runtimes.

Automatic heartbeat at 30 minutes reports the highest aggregate clock-monitoring rate among the listed scaffolds and more hidden-channel monitoring than simpler configurations, but it also produces **489 false positives** and does not achieve the best macro F1. The hierarchical setup performs **1,661 queries** yet has weak hidden-channel hit rates and lower aggregate performance.

The lesson is not that monitoring is bad. It is that **monitoring frequency, channel selection and action admission are separate control variables**. Polling every channel frequently can consume budget and increase action opportunities without making the agent better at deciding what is actually due.

## Cross-day and update-sensitive tasks remain hard

The paper reports that no configuration exceeds 50% on both cross-day and update-sensitive task accuracy. The strongest cross-day aggregate result is 50.0% and the strongest update-sensitive result is 47.2%.

These categories stress different lifecycle risks:

- cross-day tasks test whether an intention survives intervening activity and time;
- updates test whether a stale intention is retired rather than executed after cancellation, override or rescheduling.

A system that stores every instruction faithfully but does not version its current intention state can therefore be confidently wrong.

## Qualitative failure patterns

The paper's examples show several recurrent mechanisms:

- an immediate salient task is completed while its cross-day companion is forgotten;
- a rescheduled one-off task remains missed even after the agent checks the clock because the routine task dominates attention;
- a hidden-channel condition is never discovered because the agent never queries the relevant environment state.

These failures are useful because they separate “instruction exists in context” from “runtime executes the latest valid intention at the correct boundary.”

## Evidence quality and limitations

1. **First-party evidence.** The paper and `genglinliu/PMBench` repository are one research artifact family. The repository corroborates released code, scenarios and result files but is not an independent reproduction.
2. **No independent full reproduction found.** This governed run did not identify a separate team reproducing the complete headline results.
3. **Synthetic environment.** Seven simulated days and controlled state channels improve measurement but do not prove production readiness in enterprise environments.
4. **Model/scaffold dependence.** The reported ranking of scaffolds varies by backbone; benchmark averages should not be converted into universal deployment rules.
5. **Safety boundary.** Benchmark performance is not safety certification for high-stakes scheduling or autonomous side effects.
6. **Publication status is not correctness proof.** COLM publication improves visibility and review context but does not independently validate the numerical claims.

## Research Center observations

### Observation A — prospective memory is an action-timing problem, not only retrieval

The benchmark makes “remembering the task” and “executing the task when currently due” observably different. A reliable runtime therefore needs explicit intention state and due-state evaluation.

### Observation B — stale intentions need lifecycle semantics

Cancellation, override and rescheduling require a current-version rule. Keeping an old reminder in memory is not harmless; it can become a wrong side effect.

### Observation C — observation policy is a budgeted runtime decision

More monitoring can improve opportunities to notice triggers, but PM-Bench shows that more queries do not guarantee higher task F1 and can correlate with many false positives. A runtime should choose what to observe and when, rather than equating heartbeat frequency with reliability.

### Observation D — action admission should bind to current evidence

Before executing a deferred intention, the runtime should prove that the latest valid intention version is active, the current trigger is satisfied, dependencies hold and the effect has not already been committed.

## Proposed four-boundary prospective-intention runtime

This is a Research Center synthesis, not a PM-Bench author claim:

1. **Versioned Intention State** — current instruction identity, version, status, schedule/trigger, dependencies and supersession history.
2. **Observation Policy** — which state channel should be checked, at what cadence, with what cost and freshness requirement.
3. **Due / Action Admission** — deterministic proof that the latest valid intention is active and due now; stale or superseded intentions fail closed.
4. **Effect Evidence** — durable receipt of what was executed, when and against which intention version, supporting exactly-once/recovery semantics.

The model turns prospective memory from a hidden model behavior into a runtime boundary that can be inspected and tested.

## Open questions

- How should an observation scheduler allocate monitoring budget across many deferred intentions?
- Which triggers can be event-driven instead of polled?
- How should intention updates invalidate already-materialized schedules or leases?
- What evidence is sufficient to prevent duplicate effects after a crash between action and acknowledgement?
- How should a runtime distinguish a model forgetting an intention from the runtime failing to surface the right due intention?
- What independent production benchmark could test the same lifecycle on real digital-employee workflows?

## Source trace

1. Genglin Liu and Saadia Gabriel, *PM-Bench: Evaluating Prospective Memory in LLM Agents*, arXiv:2607.12385, 2026-07-14 — https://arxiv.org/abs/2607.12385
2. Full paper HTML — https://arxiv.org/html/2607.12385
3. Official repository `genglinliu/PMBench`, inspected at `e1093c470c8981daf522d4ef047a7c3a71e077d7` — https://github.com/genglinliu/PMBench
