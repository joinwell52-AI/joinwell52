---
schema: "publication-candidate-article/v2"
title: "Waiting Is a Runtime State, Not an Agent Loop"
date: "2026-08-19"
column: "digital-employee"
category: "academic"
article_type: "technical-analysis"
edition: "research-center"
research_question: "What architectural conclusion is actually supported by SentinelBench about long-running monitoring agents: is reliable waiting primarily a model capability, a polling strategy, or a runtime state that should be separated from continuous reasoning and action?"
summary: "SentinelBench provides primary evidence that monitoring is a distinct agent workload: condition-aware waiting can reduce cost and improve completion on long waits, but production monitoring still needs durable condition state, explicit admission and separately verified effects."
sources: "arXiv:2606.05342v2; Microsoft Research SentinelBench article; microsoft/sentinel_environments @ 0faca33cc58ea62e97a928b67cd3beec7176b408; research/reading/Q-20260804-11-sentinelbench-monitoring.md; research/analysis/Q-20260804-11-sentinelbench-monitoring.md"
cover: "/assets/covers/academic-sentinelbench-waiting-runtime.svg"
---

<ArticleCover
  image="/assets/covers/academic-sentinelbench-waiting-runtime.svg"
  kicker="Digital Employee · Academic Observation 004"
  title="Waiting Is a Runtime State"
  summary="A monitoring agent should preserve what it is waiting for independently of the model turn that happens to be awake."
  version="DA004"
  status="Academic Runtime V5 · 2026-08-19"
  languageHref="/zh/digital-employee/2026-08-19-sentinelbench-waiting-runtime"
  languageLabel="简体中文"
/>

# Waiting Is a Runtime State, Not an Agent Loop

Some agent jobs fail because the agent does too little. Monitoring jobs can fail because the agent does too much.

If the instruction is “tell me when a ticket appears,” “alert me when three more unread messages arrive,” or “act when a price crosses this threshold,” refreshing a page more aggressively does not make the external event happen sooner. A model that keeps reasoning, clicking and polling may spend more tokens, create more failure opportunities, and still give up before the condition becomes true.

That inversion is what makes Microsoft's 2026 **SentinelBench** useful. The benchmark is not primarily about making an agent think for longer. It makes **waiting itself** measurable. Its 100 tasks run across ten synthetic web environments whose state changes independently of the agent, and its evaluation tracks whether the task was completed, how quickly the agent reacted after the target event, and how much inference/tool work the run consumed. The paper and code are publicly available through [arXiv:2606.05342v2](https://arxiv.org/abs/2606.05342) and the [Microsoft sentinel_environments repository](https://github.com/microsoft/sentinel_environments).

The evidence supports a bounded engineering judgment: **monitoring should be represented as a runtime state, not improvised as a sequence of free-form agent turns.** SentinelBench does not prove a production monitoring architecture, but it makes the missing runtime boundaries unusually visible.

## Monitoring is not merely a long task

A conventional long-horizon agent benchmark usually assumes that progress comes from the agent doing something: open the application, inspect state, choose a tool, change the environment, repeat.

SentinelBench deliberately breaks that assumption. Once a scenario starts, scheduled events update the backing database and web interface on their own. The agent may need to notice a new email, a new job posting, a stock-price change, a calendar invitation, or another event that was not caused by its previous action. The benchmark therefore asks not only **what should the agent do next?**, but also **should it be doing anything yet?**

The task set makes this distinction concrete. According to the [primary paper](https://arxiv.org/html/2606.05342v2), SentinelBench contains 20 no-operation tasks; the other 80 are divided between active and passive tasks, and between absolute and relative conditions. These are not cosmetic labels.

A passive task can be satisfied mainly by detecting that a condition has become true. An active task may require opening conversations, inspecting hidden details, or changing application state after detection. An absolute condition can often be judged from the current state. A relative condition — “three more unread alerts than there are now” — requires preserving a baseline across time.

The no-operation cases are especially important. In those tasks the target condition never becomes true. The correct result is to keep monitoring until the window ends without inventing a success event. That gives the benchmark a failure mode many ordinary agent evaluations miss: **premature completion is itself an error.**

## The benchmark separates activity from outcome

SentinelBench's released harness does not simply ask whether the agent's final message sounds plausible. The scenario includes a database query used to evaluate the resulting state. The server also records when the agent signals completion relative to the target condition. The [repository README](https://github.com/microsoft/sentinel_environments) describes ordinary success as requiring both a truthy scenario evaluation and completion at or after the condition time; no-op scenarios require the agent never to signal completion.

This is a useful methodological choice because detection and effect are different things.

An agent can correctly notice that a matching job appeared but fail to apply. It can detect an email but alert the user too early. It can confidently say that nothing happened when the monitoring window is still open. A long action trace may look diligent while the requested business state is wrong.

That suggests a general evaluation rule for monitoring systems: **worker activity is evidence about process, not proof of completion.** The requested external condition and the requested downstream effect need their own evidence.

## `wait_for` changes where the waiting work lives

The paper compares two browser-agent configurations. One gives the agent a conventional `sleep(time)` tool. The other gives it a purpose-built `wait_for(condition, timeout)` tool.

The important difference is not that one function name is better than another. It is where the monitoring state lives.

With `sleep`, the model decides how long to pause, wakes up, observes the page, reasons again, and may repeat the cycle. The condition itself remains largely embedded in the agent trajectory.

With the evaluated `wait_for`, the condition and timeout become explicit tool arguments. The prototype captures a textual baseline of the page, checks for new page-state differences, suppresses diff blocks it has already evaluated, rate-limits LLM checks, periodically reloads the page, and performs a final forced check when the timeout expires. Appendix D of the paper specifies adaptive intervals rather than calling the model on every one-second observation loop.

That implementation is still polling. It is not a webhook, a durable event stream, or a production notification service. But architecturally it separates three things that a free-running agent loop tends to collapse:

- **condition state** — what the worker is waiting for;
- **observation policy** — how the environment is sampled;
- **reasoning invocation** — when a new observation is important enough to ask the model.

Once those are separate, the observation mechanism can change without rewriting the user intent. A browser diff, database watch, provider webhook or event stream could all, in principle, feed the same higher-level condition contract.

## The baseline is a trade-off, not a theorem

The authors' reported results are useful precisely because they do **not** reduce to “condition-aware waiting wins every metric.” These are source-reported research results from the authors' own controlled benchmark; this Academic run did not identify an independent reproduction of the complete baseline.

For the default-duration GPT-5.4 condition, the paper reports overall success of **0.75 with `wait_for` versus 0.68 with `sleep`**. Median per-task API cost is reported as **$0.23 versus $1.17**, and the median tool-call count as **6 versus 19.5**.

The longer experiment sharpens the cost difference. With `speed_factor = 0.25`, tasks can extend to about forty minutes. The authors report **69 successful tasks with `wait_for` versus 56 with `sleep`**, while median API cost is **$0.48 versus $4.65** — a reported 9.7× difference.

But reaction time moves the other way in that GPT-5.4 comparison: the reported median is **54.8 seconds with `wait_for` versus 38.9 seconds with `sleep`** in the stretched-duration setting. The default-duration GPT-5.4 result shows the same direction: `wait_for` is somewhat slower on median reaction time even while it costs less and completes more tasks.

That is not a weakness in the benchmark. It is the point. Monitoring quality is not one scalar. It includes at least:

- completion reliability;
- premature-success and missed-event risk;
- reaction latency;
- inference and tool cost;
- correctness of any consequential side effect.

A five-second polling loop may react quickly and be wasteful. A heavily backed-off monitor may be cheap and miss a short-lived event. The runtime therefore needs an explicit service objective for the job rather than one universal polling cadence.

## A production monitor needs four boundaries

SentinelBench does not publish the following contract. It is the Research Center's synthesis from the benchmark design, the released implementation and the limitations the authors state.

| Boundary | Runtime question | Evidence needed |
|---|---|---|
| **Condition state** | What exactly are we waiting for? | Stable monitor identity, predicate, baseline/reference state, scope and expiry |
| **Observation policy** | How will we notice change? | Source, mechanism, cadence/backoff, latency target, cost/rate-limit budget |
| **Condition admission** | Is the condition sufficiently satisfied to proceed? | Observed state, predicate decision, uncertainty and authority to advance |
| **Effect evidence** | Did the requested notification/action actually happen? | External acceptance, action/notification identity, deduplication and terminal result |

This decomposition matters because the four layers fail differently.

A process can restart and lose the baseline while the observation mechanism remains healthy. A page watcher can detect a change that does not actually satisfy the user's condition. A condition can be correctly admitted while the downstream notification never reaches its sink. The requested action can succeed twice because the monitor does not remember that it already acted on the same occurrence.

Calling all of these “the agent is monitoring” hides the failure location. Treating them as separate runtime state makes recovery and audit possible.

### Relative conditions make durable state unavoidable

SentinelBench's relative tasks expose this cleanly. “Alert me at 100 likes” can be evaluated from one snapshot. “Alert me after 100 more likes” needs a reference value from the start of the monitoring episode.

If that baseline exists only in transient model context, a crash or context reset changes the meaning of the task. A production monitor therefore needs a durable condition identity and reference state independent of whichever model turn happens to be awake.

### No-op needs a governed terminal outcome

A no-op task is not a task where “nothing happened and the worker forgot to work.” It is a task where the condition did not occur within the governed window, and no consequential action was authorized.

That distinction is operationally important. A runtime should be able to close a monitor as `ConditionNotMet`, `Expired`, or another explicit outcome without forcing the agent to fabricate an event merely to produce a conventional success message.

### Detection is not delivery

The benchmark's database-state evaluation also points toward a second separation: **condition detection is not external effect evidence**.

A monitor that notices a qualifying event has not yet proved that a message was delivered, an order was accepted, a ticket was created, or a business record reached the correct system. For consequential monitoring, the effect needs its own durable identity and acknowledgement/evidence surface.

## Where the evidence stops

The paper is careful about several boundaries.

Event timing is artificial. Target times are generated inside a controlled simulation rather than sampled from real service distributions. The ten environments are lightweight synthetic facsimiles, not production websites, and the authors explicitly note that untested trajectories may expose errors or missing behavior.

Most success criteria are objective. Subjective conditions such as “alert me when an urgent bug appears” remain underexplored. Most target conditions are persistent once true; ephemeral conditions — where an opportunity exists only briefly — are a harder future case identified by the paper.

The evaluated `wait_for` tool is also a prototype over page text and periodic reloads. SentinelBench does not establish crash-safe monitor restoration, exactly-once notification or action, credential renewal, cross-monitor rate-limit arbitration, repeated-occurrence identity, or transactional compensation for side effects.

And publication is not validation. The paper, Microsoft Research article and open-source repository establish provenance, inspectability and a reproducible benchmark package. They do not by themselves establish that the reported baseline generalizes to production monitoring agents.

## What should be tested next?

The next useful experiment is not simply to run a longer sleep.

A production-oriented evaluation should interrupt a monitor mid-wait, restart the worker, and ask whether the exact same condition identity and baseline can be reconstructed without duplicate action. It should include ephemeral conditions whose value disappears if reaction is too slow. It should include subjective admission where a model decision needs auditable evidence rather than a numeric threshold. It should run many monitors against shared credentials and rate limits. And it should compare browser polling with provider-native events while holding the condition and effect contracts constant.

Those tests would answer a question SentinelBench intentionally leaves open: can the measurable advantages of condition-aware waiting survive the failure modes of a real long-running runtime?

The current evidence already supports a more modest architectural shift. **An agent should not have to keep thinking merely to keep waiting.** The monitor's condition, observation policy and completion evidence should persist as runtime state; model reasoning should be invoked when the runtime has new evidence or a governed decision to make.

That is a narrower claim than “event-driven agents solve monitoring.” It is also a much more useful one to engineer against.

## Evidence and sources

1. Matheus Kunzler Maldaner et al., **SentinelBench: A Benchmark for Long-Running Monitoring Agents**, arXiv:2606.05342v2, June 5, 2026 — https://arxiv.org/abs/2606.05342
2. Full paper HTML — https://arxiv.org/html/2606.05342v2
3. Microsoft Research, **SentinelBench, a Benchmark for Long-Running Monitoring Agents**, June 8, 2026 — https://www.microsoft.com/en-us/research/articles/sentinelbench-a-benchmark-for-long-running-monitoring-agents/
4. Microsoft, **sentinel_environments**, inspected at commit `0faca33cc58ea62e97a928b67cd3beec7176b408` — https://github.com/microsoft/sentinel_environments
5. Governed Deep Reading — `research/reading/Q-20260804-11-sentinelbench-monitoring.md`
6. Governed Research Analysis — `research/analysis/Q-20260804-11-sentinelbench-monitoring.md`

**Evidence boundary:** items 1–4 are the authors' primary paper, official article and first-party released implementation. They are public primary sources, not independent reproduction. The architecture proposed in this article is explicitly a Research Center interpretation derived from those sources.
