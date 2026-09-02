# Research Analysis — A-20260902-01 PM-Bench prospective memory

- **Runtime date:** 2026-09-02
- **Source Reading:** `research/reading/A-20260902-01-pmbench-prospective-memory.md`
- **Recommended article type:** `technical-analysis`
- **Project relevance:** `none`

## Research question

What runtime architecture follows from the evidence that a long-running agent can retain a deferred instruction yet still fail to execute the latest valid intention at the correct future cue?

## Evidence claims

### E1 — public-fact
**Claim:** PM-Bench evaluates prospective memory over a deterministic seven-day, 80-step simulated week with time-based, event-based, cross-day and update-sensitive tasks.
**Source:** arXiv:2607.12385; official repository.
**Strength:** states. **Independent:** false.

### E2 — public-fact
**Claim:** The benchmark distinguishes active tasks from the current due set and lets agents query state channels before acting.
**Source:** paper task formulation.
**Strength:** states. **Independent:** false.

### E3 — source-reported-claim
**Claim:** Across the reported aggregate configurations, optional heartbeat reaches the highest macro F1 (65.1), while more aggressive automatic/hierarchical monitoring performs more queries without achieving the highest F1.
**Source:** paper aggregate results.
**Strength:** reports. **Independent:** false.

### E4 — source-reported-claim
**Claim:** Auto-heartbeat 30 performs 203 queries and reports 489 false positives; hierarchical union-query performs 1,661 queries with aggregate F1 45.2.
**Source:** paper aggregate results and monitoring analysis.
**Strength:** reports. **Independent:** false.

### E5 — source-reported-claim
**Claim:** The best scaffold differs by backbone; no single strategy dominates all evaluated models.
**Source:** paper per-model results.
**Strength:** reports. **Independent:** false.

### E6 — source-reported-claim
**Claim:** No reported setup exceeds 50% on both cross-day and update-sensitive task performance; the best aggregate figures are 50.0% cross-day and 47.2% update-sensitive.
**Source:** paper aggregate results.
**Strength:** reports. **Independent:** false.

### E7 — public-fact
**Claim:** The task set contains explicit cancellation, override and rescheduling cases and hidden state channels that must sometimes be queried.
**Source:** paper benchmark construction; official repository.
**Strength:** states. **Independent:** false.

### E8 — our-observation
**Claim:** The paper and author-maintained repository are one evidence family; this run found no independent full reproduction of the headline results.
**Source:** governed 2026-09-02 research search.
**Strength:** observed. **Independent:** false.

## What is actually new here

PM-Bench changes the data type of “memory” for an agent. A deferred intention is not just a text record to retrieve. It has a lifecycle: created, possibly revised or cancelled, waiting on a time or event predicate, due, executed and completed. It also has an observation problem: some predicates are hidden until the runtime checks the relevant channel.

This lets us separate four questions that are often collapsed into “did the agent remember?”

1. What is the latest valid intention?
2. What environment state must be observed to know whether it is due?
3. Is action admitted now?
4. What effect actually occurred, and has it already occurred once?

## Research judgment

**Bounded judgment:** PM-Bench provides primary evidence that prospective memory remains difficult for current LLM agents and that additional reminders/monitoring do not uniformly solve the problem. It directly supports treating delayed-intention execution as distinct from retrospective retrieval.

The stronger architecture conclusion is ours: **a governed long-running agent should represent deferred intentions as versioned runtime objects whose observation, due-state admission and external effect are explicit and auditable.** Bigger context can preserve more text, but it cannot by itself guarantee current-version semantics, trigger observation, exactly-once admission or effect evidence.

## Four-boundary prospective-intention runtime

### 1. Versioned Intention State

A durable intention should bind:

- `intentionId` and `version`;
- current status: active, cancelled, superseded, due, completed;
- time/event trigger and timezone;
- dependencies and target;
- supersedes/superseded-by links;
- creation/update evidence.

The latest valid version is authoritative. A cancelled or superseded version may remain in history but cannot regain action authority merely because a model recalls it.

### 2. Observation Policy

Each intention declares the evidence required to evaluate its trigger. A runtime then decides whether that evidence comes from an event subscription, a scheduled poll, a user message or an explicit tool query.

Observation has cost and freshness. PM-Bench's results warn against a naive policy of “poll everything more often.” The runtime should allocate observation budget based on due risk, channel cost, required freshness and false-positive consequences.

### 3. Due / Action Admission

Before action, a deterministic admission check should bind the latest intention version to current trigger evidence:

```text
latest_version
AND status == active
AND trigger == satisfied_now
AND dependencies == satisfied
AND effect_not_already_committed
=> action_admitted
```

This is where active and due must remain separate. A valid future intention is not permission to act now.

### 4. Effect Evidence

The runtime should persist an external-effect receipt or equivalent provider evidence containing intention identity/version, admitted trigger evidence, action identity, provider result and completion state.

This boundary matters during retries. If the agent crashes after the provider accepted the action but before the model observes success, replaying the intention from memory must not create a second side effect.

## Why a todo list is insufficient

A ledger can improve intention retention and PM-Bench reports gains for some backbones. But a todo item normally says “remember this.” It does not necessarily specify current-version precedence, monitored evidence, due admission and effect identity.

A production digital employee therefore needs a runtime object richer than a note:

```text
memory_entry -> can help recall
intention_record -> governs future authority
observation_receipt -> proves trigger state
admission_receipt -> proves action was allowed now
effect_receipt -> proves what happened externally
```

## Counterarguments

### “A larger context window can keep the instruction alive.”

It can reduce some retention failures. PM-Bench specifically measures failures where due-state, hidden channels, rescheduling and false alarms matter; those are not guaranteed by text retention.

### “Just add a frequent heartbeat.”

The source-reported results do not support a universal heartbeat optimum. More frequent or broader monitoring can increase queries and false positives while lowering aggregate F1.

### “The model should decide when an intention is due.”

The model can interpret ambiguous natural-language conditions, but high-consequence action authority should not silently inherit from a transient interpretation. The runtime can preserve the model's interpretation while separately enforcing current version, dependencies, timing and duplicate-effect constraints.

## Operational implications

- Treat deferred instructions as lifecycle-bearing runtime records, not plain memory snippets.
- On cancel/override/reschedule, retire old authority while preserving history.
- Bind every hidden trigger to an explicit observation policy.
- Separate observation freshness from model context freshness.
- Require due-state admission before side effects.
- Bind action receipts to intention version for recovery and duplicate prevention.
- Evaluate retention, monitoring, admission and effect semantics separately.

## Limitations

- The four-boundary model is Research Center synthesis, not a PM-Bench architecture proposal.
- PM-Bench is synthetic and does not test crash recovery or exactly-once external side effects.
- Reported numerical results remain first-party and were not independently reproduced in this run.
- Benchmark publication status is not correctness proof.
- Enterprise triggers can involve permissions, calendars, queues and provider APIs not represented by the benchmark's controlled channels.

## Article recommendation

- **Type:** `technical-analysis`
- **Core proposition:** A deferred intention is a versioned runtime object, not merely a memory entry.
- **Original value:** a four-boundary model separating Intention State, Observation Policy, Due/Action Admission and Effect Evidence.
- **Project relevance:** `none`
- **Editorial recommendation:** PASS if the article keeps source-reported benchmark results distinct from the four-boundary Research Center synthesis.
