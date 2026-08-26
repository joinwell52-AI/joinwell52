# Research Analysis — A-20260826-01 MP-Bench failure attribution

- **Runtime date:** 2026-08-26
- **Source Reading:** `research/reading/A-20260826-01-mp-bench-failure-attribution.md`
- **Recommended article type:** `technical-analysis`
- **Project relevance:** `none`

## Research question

What architecture should a multi-agent runtime use when a failed execution supports several plausible causal explanations instead of one uniquely correct root cause?

## Evidence claims

### E1 — public-fact

**Claim:** MP-Bench contains 289 failed execution logs from 121 distinct MAS configurations, combining 169 hand-crafted and 120 automatically generated executions.

**Source:** arXiv:2603.25001v1, Section 4.1/4.2; Adobe Research dataset README.

**Strength:** states.

**Independent:** false. The paper and repository are primary/first-party sources.

### E2 — public-fact

**Claim:** Each MP-Bench instance is independently annotated by three screened experts at step level with a binary failure-inducing label, failure reason and ideal action.

**Source:** arXiv Sections 4.1.2–4.1.3; official dataset layout.

**Strength:** states.

**Independent:** false.

### E3 — source-reported-claim

**Claim:** Among steps identified as failure-inducing by at least one annotator, the paper reports 16.2% agreement by all three, 27.8% by exactly two and 56.1% by only one; pairwise disagreement can reach roughly 60%.

**Source:** arXiv Section 4.3.

**Strength:** reports.

**Independent:** false.

### E4 — public-fact

**Claim:** MP-Bench consolidates binary annotations into a consensus-rate ranking and evaluates predicted rankings using nDCG@K rather than requiring one oracle step.

**Source:** arXiv Sections 4.1.4 and 5.1.

**Strength:** states.

**Independent:** false.

### E5 — source-reported-claim

**Claim:** Table 3 reports that deterministic decoding (`τ=0`) is worse than at least one nonzero-temperature configuration for every model included in the temperature analysis, while performance is not monotonic from moderate to higher temperatures.

**Source:** arXiv Section 6.2.1.

**Strength:** reports.

**Independent:** false.

### E6 — source-reported-claim

**Claim:** Table 5 reports that the evaluated multi-LLM combinations outperform the listed single-model baselines under the paper's nDCG@5 protocol, with cross-family combinations among the strongest tested systems.

**Source:** arXiv Section 6.2.3.

**Strength:** reports.

**Independent:** false.

### E7 — our-observation

**Claim:** Table 4 contains an exception to the prose claim of consistent improvement with more samples: GPT-5.1 automatic-MAS nDCG changes from 0.7819 at N=3 to 0.7769 at N=10.

**Source:** direct comparison of Table 4 values in the primary paper.

**Strength:** observed.

**Independent:** false; this is a reading-level observation of the source itself.

### E8 — public-fact

**Claim:** The paper explicitly limits domain coverage and MAS framework diversity; the arXiv record identifies the manuscript as under review.

**Source:** arXiv abstract metadata and Section 8.

**Strength:** states.

**Independent:** false.

### E9 — our-observation

**Claim:** This Academic run found the paper and first-party repositories but did not identify an independent reproduction of the complete MP-Bench experimental results.

**Source:** 2026-08-26 governed research search.

**Strength:** observed.

**Independent:** false.

## What is actually new here

The paper's central contribution is not merely that experts disagree. It changes the *data type* of a failure diagnosis. Under a deterministic formulation, diagnosis behaves like a scalar label: one step is the root cause. Under MP-Bench, diagnosis is closer to a ranked set of explanations with associated rationales.

That change matters operationally because multi-agent failures often have causal depth. A downstream agent may make an obviously wrong action after an upstream agent supplied incomplete evidence; an orchestrator may have admitted a weak plan; a tool may have failed in a way another agent should have handled. Several of these can be actionable at once.

## Research judgment

**Bounded judgment:** MP-Bench provides primary evidence that single-label failure attribution is often too restrictive for multi-agent debugging and that multi-perspective rankings can better preserve ambiguity while still prioritizing salient failure points. The benchmark does not prove that any particular LLM ensemble identifies true causal roots in production systems.

The stronger architecture conclusion is our interpretation: **a governed multi-agent runtime should store failure attribution as a ranked diagnostic evidence set, not as a single mutable root-cause field.** It should keep observed trace facts separate from causal hypotheses, preserve the provenance and perspective behind each hypothesis, rank hypotheses by salience/consensus without mistaking agreement for independent proof, and allow a concrete repair decision to be made while causal uncertainty remains explicit.

## Four-layer diagnostic envelope

### 1. Trace Facts

Immutable execution evidence: messages, tool calls, state changes, errors, receipts and timestamps. This layer should be replayable and should not embed causal language unless causality itself is directly observed.

### 2. Failure Hypotheses

A set of candidate explanations. Each hypothesis should include:

- blamed step / agent / boundary;
- rationale;
- perspective or diagnostic method;
- source trace references;
- evidence identity;
- confidence or support state;
- incompatible/compatible alternatives.

### 3. Consensus / Salience

A ranking layer captures which hypotheses deserve attention first. Signals can include expert agreement, repeated model agreement, cross-model agreement, deterministic rule checks, counter-evidence and severity. The key is to **not conflate consensus with independence**. Three outputs from the same model and prompt can be useful diversity evidence but remain one evidence family.

### 4. Repair Decision

Operations eventually need a concrete next action. Repair selection should be governed by expected risk, reversibility, blast radius and verification cost, not by pretending the diagnosis has become uniquely certain. A repair record should cite which hypotheses motivated it and what post-repair evidence would falsify or strengthen those hypotheses.

## Why this is stronger than a single root-cause label

A scalar root cause has three failure modes:

1. **Premature collapse:** uncertainty disappears before evidence justifies it.
2. **Diagnostic overwriting:** later investigators replace the previous explanation, losing provenance.
3. **Repair/causality confusion:** a repair that works is treated as proof that its motivating hypothesis was uniquely correct.

A ranked evidence set avoids all three. It is compatible with deterministic safety gates: the system can still deny a risky action when any high-salience hypothesis points to compromised authorization, even if the precise causal story remains disputed.

## Counterarguments

### “Debugging needs one root cause or nobody can act.”

A repair can be singular without the diagnosis being singular. Incident response routinely chooses the safest reversible intervention before every causal question is settled. The important requirement is to record the decision boundary and verification plan.

### “Multiple model samples are just noise.”

They can be. MP-Bench's temperature results show that stochasticity can help expose alternative perspectives, but higher temperature is not monotonically better. Diversity should therefore be treated as a hypothesis-generation mechanism, not as a truth guarantee.

### “Consensus ranking solves the problem by itself.”

No. Consensus estimates perspective convergence, not causal correctness. Correlated agents, shared prompts or shared source errors can create strong agreement without independent evidence. Runtime evidence identity must remain a separate dimension.

## Operational implications

- Do not write `rootCause = step_17` as the only durable diagnosis for a complex MAS failure.
- Persist immutable trace evidence before causal analysis.
- Store each hypothesis append-only with provenance and counter-evidence.
- Track `consensus` and `independence` separately.
- Permit a repair decision to reference multiple hypotheses.
- Require post-repair evidence; a successful retry can reduce uncertainty without proving a unique cause.
- Preserve alternative explanations for recurrence analysis and benchmark learning.

## Visual argument

The article should contrast a collapsing funnel—many trace signals forced into one root-cause label—with a governed diagnostic stack that keeps trace facts at the base, several ranked hypotheses in the middle, and one bounded repair decision at the top. The visual must show that *plural diagnosis and singular action are compatible*.

## Limitations

- MP-Bench covers general-purpose assistant tasks rather than specialized production domains.
- Framework diversity is limited by the quality-first annotation design.
- The paper's LLM-assisted consolidation and judge choices remain part of the measurement system.
- The paper is under review and this run did not find an independent full reproduction.
- The official Adobe dataset is licensed for non-commercial research use; this analysis does not imply permission for product use.
- Multi-perspective attribution may increase diagnostic cost and can surface contradictory hypotheses that still require human or deterministic arbitration for high-risk decisions.

## Open questions

1. How should evidence identity be represented when multiple diagnostic agents share one model family?
2. What threshold should promote a hypothesis from “plausible” to “operationally decisive”?
3. How should a runtime detect correlated consensus caused by a shared hallucination or faulty source?
4. Can deterministic graph constraints eliminate impossible hypotheses before LLM attribution?
5. What post-repair evidence is sufficient to update causal belief without rewriting history?
6. How does this model perform on software-engineering and enterprise digital-employee incidents?

## Article recommendation

- **Type:** `technical-analysis`
- **Core proposition:** Failure attribution should be represented as a ranked diagnostic evidence set, not a single root-cause label.
- **Original value:** a four-layer diagnostic envelope separating facts, hypotheses, consensus/salience and repair decisions.
- **Project relevance:** `none`
- **Editorial recommendation:** PASS, provided the article clearly labels the four-layer envelope as Research Center synthesis and preserves the first-party / non-independent evidence boundary.
