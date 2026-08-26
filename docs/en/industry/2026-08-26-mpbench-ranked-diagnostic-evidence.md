---
schema: "publication-candidate-article/v2"
title: "A Failed Multi-Agent Run Can Have More Than One Plausible Cause"
date: "2026-08-26"
column: "industry-architecture"
category: "academic"
article_type: "technical-analysis"
edition: "research-center"
research_question: "When one failed multi-agent execution supports several plausible causal explanations, should diagnosis force a single root-cause step or preserve a ranked set of hypotheses until evidence justifies a repair?"
summary: "MP-Bench makes attribution ambiguity measurable: screened experts frequently disagree about which step induced a multi-agent failure. The safer runtime pattern is to separate immutable trace facts, plural causal hypotheses, consensus/salience, and the eventual repair decision."
sources: "arXiv:2603.25001v1; adobe-research/multi-agent-eval-bench @ b8042d410850672ea5bee4b1031c6cde9028e099; yeonjun-in/MP-Bench; research/reading/A-20260826-01-mp-bench-failure-attribution.md; research/analysis/A-20260826-01-mp-bench-failure-attribution.md"
cover: "/assets/covers/academic-mpbench-ranked-diagnostic-evidence-cover-v2.png"
---

<ArticleCover
  image="/assets/covers/academic-mpbench-ranked-diagnostic-evidence-cover-v2.png"
  kicker="Industry Architecture · Academic Observation 005"
  title="A Failed Multi-Agent Run Can Have More Than One Plausible Cause"
  summary="Keep the trace factual, keep causal hypotheses plural, and make the repair decision explicit instead of turning one interpretation into a false certainty."
  version="IA005"
  status="Academic Runtime V5 · 2026-08-26"
  languageHref="/zh/industry/2026-08-26-mpbench-ranked-diagnostic-evidence"
  languageLabel="中文"
/>

# A Failed Multi-Agent Run Can Have More Than One Plausible Cause

A multi-agent execution trace can be perfectly stable while its explanation is not.

Agent A may have collected weak evidence. Agent B may have accepted it too easily. Agent C may have made the visible bad decision. The orchestrator may have failed to intervene. If the task ultimately fails, all four observations can be relevant — yet many debugging systems still insist on writing one value into a field called `rootCause`.

That compression is convenient. It can also destroy evidence.

A 2026 paper from KAIST and Adobe Research, **Rethinking Failure Attribution in Multi-Agent Systems: A Multi-Perspective Benchmark and Evaluation**, turns this problem into a benchmark. Its MP-Bench dataset does not assume that one failed trace has exactly one correct blame step. Instead, several experts annotate the same trace independently, and the benchmark preserves disagreement rather than erasing it.

The paper does not prove that every production incident has several equally valid causes. It does provide strong primary evidence for a narrower claim: **single-label failure attribution can be too restrictive for multi-agent systems.** The engineering consequence is important. A runtime should treat causal attribution as diagnostic evidence, not as an observed fact.

## The same trace, different reasonable diagnoses

MP-Bench contains **289 failed execution logs** from **121 distinct multi-agent configurations**. The paper reports 169 hand-crafted MAgenticOne executions and 120 automatically generated CaptainAgent executions, using tasks from GAIA and AssistantBench. Each failed trace is reviewed independently by three screened expert annotators.

For every step, each annotator records three things: whether the step is failure-inducing, why, and what the agent should ideally have done instead. The public Adobe Research dataset exposes those step-level annotations and rationales in JSON form.

The important result is not simply that annotators disagree. It is the size and shape of the disagreement.

Among steps that at least one annotator marked as failure-inducing, the authors report that only **16.2%** were marked by all three experts. **27.8%** were marked by exactly two. **56.1%** were marked by only one. Pairwise disagreement can reach roughly **60%** in the paper's analysis.

These are author-reported benchmark statistics; this Academic run did not independently reproduce the complete dataset analysis. But the released dataset structure and paper are enough to establish the benchmark's intended design: causal interpretation is allowed to remain plural.

This matters because a trace contains two very different kinds of information:

- **what happened** — messages, tool calls, outputs, state transitions and errors;
- **what those events caused** — an interpretation of the failure mechanism.

The first can often be replayed. The second may remain contested.

## MP-Bench does not replace one answer with chaos

Preserving several explanations does not mean every explanation receives equal weight.

MP-Bench converts expert labels into a **consensus-rate ranking**. A step marked as failure-inducing by all three annotators ranks above a step marked by one. The benchmark then evaluates predicted rankings with nDCG rather than asking whether a model matched one oracle step exactly.

That is a useful design move. It separates two questions that a single-label system mixes together:

1. **Which causal hypotheses remain plausible?**
2. **Which of them deserve attention first?**

A plural diagnosis can still produce an ordered debugging queue.

The same distinction appears in the paper's model experiments. The authors sample failure attributions multiple times and aggregate them into rankings. They report that deterministic decoding is generally less effective than allowing some stochasticity, while higher temperature is not monotonically better. They also report strong results from tested combinations of different model families.

Those findings are useful, but they need a boundary. Model diversity is not independent causal evidence. Three models can agree because they share the same trace, prompt convention or mistaken assumption. Diversity can generate hypotheses; it does not certify them.

There is another source-reading nuance worth preserving. The paper states that increasing the number of samples consistently improves performance. Table 4 is almost consistent with that description, but not entirely: for GPT-5.1 on automatic MAS traces, nDCG@5 changes from **0.7819 at N=3** to **0.7769 at N=10**. The broader result can still be useful without turning it into a universal law.

## A diagnostic runtime needs four different objects

The following model is a Research Center synthesis derived from MP-Bench's design. It is **not** a contract proposed by the paper.

![Diagnostic evidence envelope: trace facts support plural hypotheses, which are ranked before a governed repair decision.](/assets/figures/academic-mpbench-diagnostic-evidence-envelope.svg)

### 1. Trace Facts

Start with immutable execution evidence: agent messages, tool inputs and outputs, external receipts, state transitions, policy decisions, timestamps and errors.

This layer should answer **what happened** without prematurely answering **why the whole task failed**. If a tool returned HTTP 403, that is a fact. “The access restriction was the root cause” is already a hypothesis.

A replayable trace gives every later diagnosis the same substrate. Without it, a system can rewrite history every time a new explanation appears.

### 2. Failure Hypotheses

Store causal explanations as first-class records rather than overwriting one `rootCause` string.

A useful hypothesis should carry at least:

- the implicated step, agent or boundary;
- its rationale;
- the perspective or diagnostic method that produced it;
- references to supporting trace evidence;
- counter-evidence;
- evidence identity;
- confidence or support state;
- relationships to compatible or mutually exclusive hypotheses.

This makes disagreement inspectable. It also allows a later deterministic check, new external evidence or human review to strengthen one explanation without deleting the others.

### 3. Consensus / Salience

Now rank the hypotheses.

Consensus can matter: three independent experts pointing to the same step is different from one speculative interpretation. Severity matters too. A low-confidence hypothesis involving authorization bypass may deserve attention before a high-confidence cosmetic failure.

But **consensus and independence must stay separate**.

Three samples from one model are three perspectives, not three independent evidence sources. Three agents all reading the same fabricated source can agree perfectly and still be wrong. A governed runtime should therefore track at least two axes:

- **perspective convergence** — how many diagnostic paths support the hypothesis;
- **evidence independence** — whether those paths depend on genuinely different evidence families.

MP-Bench directly motivates the first axis. The second is an engineering requirement we add to avoid turning agreement into false verification.

### 4. Repair Decision

Operations eventually need one next action.

This is where systems often force the diagnosis to become singular: “We can only make one repair, therefore there must be one root cause.” That does not follow.

A repair decision can be singular while causality remains plural. The system can choose the safest reversible intervention because it addresses two high-salience hypotheses at low cost. It can record why that repair was authorized and what evidence must be collected afterward.

If the repair works, that is new evidence. It does not automatically prove that its motivating hypothesis was the unique cause.

## Plural diagnosis can make action more disciplined, not less

Consider a failed research-agent run:

- one hypothesis says the search agent accepted a low-quality source;
- another says the analysis agent overstated what the source supported;
- a third says the publication gate failed to detect the overclaim.

A scalar root-cause field forces someone to choose. A diagnostic evidence set can preserve all three and still decide that the lowest-risk repair is to tighten the publication evidence gate first, because that change blocks the harmful outcome regardless of which upstream explanation later proves most important.

That is not indecision. It is separating **causal belief** from **risk control**.

This separation is especially useful in multi-agent systems because failures can propagate. The visible error is often downstream of the first weak state transition, and the first weak transition may itself have been recoverable. “Who caused it?” and “where should we intervene?” are related questions, not identical ones.

## What MP-Bench actually supports — and what it does not

The paper provides concrete primary-source evidence for several points:

- screened experts can disagree substantially about failure-inducing steps in the same MAS trace;
- a ranking-based evaluation can preserve that disagreement while prioritizing high-consensus steps;
- the paper's tested LLM systems can produce useful multi-perspective rankings under its protocol;
- stochastic and cross-model diversity can affect benchmark performance.

It does **not** establish:

- that every real incident has multiple valid root causes;
- that expert consensus proves causal truth;
- that a multi-LLM ensemble is universally the best production diagnostician;
- that its LLM-assisted consolidation and judging are neutral measurement primitives;
- that the reported results generalize to software engineering, scientific agents or enterprise digital employees;
- crash-safe or exactly-once semantics for a production diagnostic runtime.

The benchmark is also deliberately quality-first rather than broad. The authors identify domain coverage and MAS framework diversity as limitations. The arXiv record says the paper is under review. This run found first-party paper and repository evidence but did not identify an independent reproduction of the complete experimental results.

The official Adobe Research dataset repository also carries a non-commercial research license. The existence of open code or data should not be read as permission for commercial product integration.

## The operational rule: do not let explanation overwrite evidence

A robust failure record can therefore look less like this:

```text
rootCause = "Agent C, step 17"
```

and more like this:

```text
trace_facts      = immutable
failure_hypotheses = append-only, provenance-aware
consensus        = ranked, not truth-equivalent
repair_decision  = explicit, bounded, verifiable
```

That structure creates a useful asymmetry: **facts become harder to rewrite, while hypotheses remain easy to revise.**

For multi-agent reliability, that is the right direction. The system should become more certain only when new evidence justifies it — not because a schema demanded one value.

## What remains open

MP-Bench makes attribution ambiguity measurable, but several hard production questions remain.

How should a runtime detect correlated consensus when several diagnostic agents share one model family? What evidence is strong enough to promote a plausible hypothesis into an operationally decisive one? Can deterministic dependency graphs eliminate impossible explanations before LLM analysis? How should post-repair evidence update causal belief without rewriting the historical record?

Most importantly, the next benchmark should test whether multi-perspective diagnosis actually improves repair quality on real, high-consequence multi-agent incidents — not only whether its rankings align with expert annotations.

Until then, the useful lesson is narrower and still important: **one failed run does not require one causal story. Preserve the evidence first; choose the repair second.**

## Sources and evidence boundary

1. Yeonjun In et al., **Rethinking Failure Attribution in Multi-Agent Systems: A Multi-Perspective Benchmark and Evaluation**, arXiv:2603.25001v1, 2026-03-26 — https://arxiv.org/abs/2603.25001
2. Full paper HTML — https://arxiv.org/html/2603.25001
3. Adobe Research, **multi-agent-eval-bench**, inspected at `b8042d410850672ea5bee4b1031c6cde9028e099` — https://github.com/adobe-research/multi-agent-eval-bench
4. Paper-linked code repository — https://github.com/yeonjun-in/MP-Bench
5. Governed Deep Reading — `research/reading/A-20260826-01-mp-bench-failure-attribution.md`
6. Governed Research Analysis — `research/analysis/A-20260826-01-mp-bench-failure-attribution.md`

**Evidence boundary:** Items 1–4 are the paper and first-party research/code artifacts. They support public facts and source-reported results but do not constitute independent reproduction. The four-layer diagnostic evidence envelope is explicitly a Research Center interpretation built on that evidence.
