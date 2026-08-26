# Deep Reading — A-20260826-01 MP-Bench multi-perspective failure attribution

- **Runtime date:** 2026-08-26
- **Research object:** A-20260826-01
- **Primary object:** *Rethinking Failure Attribution in Multi-Agent Systems: A Multi-Perspective Benchmark and Evaluation*
- **Primary paper:** arXiv:2603.25001v1, submitted 2026-03-26
- **Authors / institutions:** Yeonjun In et al.; KAIST and Adobe Research
- **Official dataset:** `adobe-research/multi-agent-eval-bench` @ `b8042d410850672ea5bee4b1031c6cde9028e099`
- **Paper code link:** `yeonjun-in/MP-Bench`
- **Evidence identity:** primary research plus first-party public repository evidence; not independent reproduction

## Research question

When a multi-agent execution fails, should diagnosis force a single root-cause step, or should the runtime preserve several plausible causal interpretations and rank them by evidence and consensus before choosing a repair?

## What the paper changes

The paper challenges a common benchmark assumption: that a failed multi-agent trace has one uniquely correct failure-inducing step. Its task formulation instead represents failure attribution as a set of plausible `(failure step, rationale)` pairs. Different attributions may be simultaneously valid because different analysts can hold different, still-reasonable expectations about the correct execution trajectory.

This is not merely a philosophical point. A deterministic benchmark can mark a reasonable diagnosis wrong when it does not match the one selected oracle label. MP-Bench therefore changes both annotation and evaluation: multiple experts annotate each trace independently, and predictions are compared as ranked multi-perspective outputs rather than as a single-class answer.

## Dataset construction facts

The paper reports:

- **289 failed execution logs** drawn from **121 distinct MAS configurations**.
- **169 hand-crafted** MAS executions using MAgenticOne, averaging about **33 interaction steps**.
- **120 automatically generated** executions using CaptainAgent, averaging about **8 interaction steps**.
- Tasks come from **GAIA** and **AssistantBench**.
- Each instance receives independent annotations from **three expert annotators**.
- Every step is labeled with: a binary failure-inducing decision, a free-text failure reason, and an ideal action.
- Annotators were screened through technical interviews and held-out annotation test cases.
- The authors report approximately **346 expert-hours** of annotation work in total.

The public Adobe Research dataset repository mirrors the three annotators in separate directory trees and exposes per-instance JSON records containing source trace links, step labels, failure categories/reasons and ideal actions. The repository README states 289 execution logs, 121 configurations and three expert annotators, consistent with the paper. It is first-party corroboration of the released artifact, not independent validation of the paper's conclusions.

## The ambiguity signal is large

The paper's annotation analysis is the strongest evidence for the multi-perspective premise. Among steps identified as failure-inducing by at least one annotator:

- **16.2%** are labeled failure-inducing by all three annotators;
- **27.8%** are labeled by exactly two;
- **56.1%** are labeled by only one.

The authors also report pairwise inter-annotator disagreement reaching roughly **60%** in some comparisons. This means much of the diagnostic surface is perspective-dependent even among screened experts.

The important boundary is that disagreement does not prove every explanation is equally good. MP-Bench retains a notion of salience: steps are ranked by consensus rate. A step marked by all three annotators is treated as more perspective-invariant and therefore more urgent for debugging than a step marked by only one.

## Consolidation and evaluation

For binary failure labels, MP-Bench computes an annotator consensus rate and ranks failure-inducing steps accordingly. Only steps labeled by at least one annotator enter the ranking.

For free-text failure reasons and ideal actions, the authors use LLM-assisted consolidation. GPT-5.1 is the primary consolidation model; GPT-4.1 and Claude-Sonnet-4.5 are used in robustness analyses. The prompt is intended to cover annotator rationales without adding new information.

The failure-step ranking is evaluated using **nDCG@K**, so errors near the top of the diagnostic priority list matter more than lower-ranked disagreements. Attribution reasoning is separately evaluated with an LLM-as-a-Judge protocol, primarily GPT-5.1, on consistency with human judgments, grounding in the trace, explanatory adequacy and reasonableness of proposed actions. Alternative judges are used in sensitivity analyses.

This design is valuable but not neutral ground truth. Human consensus, LLM consolidation and LLM judging are all choices in the evaluation pipeline. They should be treated as a carefully engineered measurement system, not as an oracle for causality.

## Source-reported experimental results

All numbers below are author-reported research results, not independently reproduced in this Academic run.

### Multi-perspective attribution performance

With the default setup of three samples (`N=3`) and temperature `τ=1.0`, Table 2 reports nDCG@5 (exponential gain) for hand-crafted / automatic MAS traces including:

- GPT-4.1: **0.4313 / 0.6755**
- GPT-5.1: **0.3747 / 0.7844**
- o3-mini: **0.4367 / 0.3944**
- Claude-Sonnet-4.5: **0.4397 / 0.7894**
- Qwen3-8B: **0.2944 / 0.6681**
- GPT-oss-120B: **0.4245 / 0.7030**

The paper contrasts these results with prior deterministic formulations and argues that evaluation assumptions explain part of the apparent weakness of LLM failure attribution.

### Sampling diversity

Table 3 reports that deterministic decoding (`τ=0`) is worse than at least one nonzero-temperature setting for all models included in that analysis. However, performance does **not** increase monotonically with temperature from 0.3 to 1.0. The useful conclusion is therefore narrower than “higher temperature is better”: some stochasticity can expose alternative perspectives, while excessive randomness is not guaranteed to help.

### More samples

For hand-crafted traces, increasing `N` from 3 to 10 improves nDCG@5 for every model in Table 4. For automatic traces, most models improve, but GPT-5.1 changes from **0.7819** at `N=3` to **0.7769** at `N=10`. The text describes consistent improvement broadly, but the table itself contains this exception. A bounded reading should preserve the table-level nuance rather than repeat the stronger prose claim unqualified.

### Cross-model diversity

Table 5 reports that tested multi-LLM combinations outperform the listed single-model baselines in both hand-crafted and automatic settings. The strongest tested automatic score is **0.8228** for the GPT-5.1 + GPT-oss-120B + Claude-Sonnet-4.5 combination; the strongest tested hand-crafted score is **0.4960** for GPT-4.1 + GPT-oss-120B + Claude-Sonnet-4.5.

The authors interpret this as evidence that different model families contribute complementary diagnostic perspectives. Again, this is a result within MP-Bench's own evaluation protocol, not proof that model diversity improves every real debugging system.

## Mechanisms that matter

### 1. Facts and explanations are different objects

An execution trace can be immutable while its causal interpretation remains plural. The action, tool output and error are trace facts; “this step caused the failure” is a diagnostic hypothesis. Collapsing the two encourages a system to treat one explanation as if it were directly observed.

### 2. Multiple hypotheses need prioritization, not flattening

MP-Bench does not stop at “many answers are possible.” It converts agreement into a ranking. That suggests a useful engineering distinction between preserving multiple hypotheses and deciding which deserves investigation first.

### 3. Diagnosis and repair are different decisions

Several causal explanations may remain plausible while an operator still chooses one concrete mitigation. A system can preserve causal uncertainty while making a singular repair decision based on severity, reversibility, cost and the evidence available.

### 4. Diversity is diagnostic input, not truth

Different samples or models can surface different explanations, but diversity alone is not evidence that an explanation is correct. A governed system needs provenance for each hypothesis and must distinguish repeated agreement from independent evidence.

## Evidence quality and limitations

1. **Primary-source only.** This run found the paper and official public repositories but did not identify an independent reproduction of MP-Bench's complete headline results.
2. **Under review.** The arXiv record states the paper is under review; publication status does not validate the findings.
3. **Limited domains.** The benchmark focuses on general-purpose assistant tasks and explicitly leaves specialized scientific, software-engineering and creative domains for future work.
4. **Limited framework diversity.** The quality-first expert process constrains benchmark scale and the diversity of MAS frameworks.
5. **Consensus is not causality.** Three annotators agreeing is useful diagnostic evidence, not a formal causal proof.
6. **LLM-assisted measurement.** Free-text consolidation and reasoning evaluation depend on LLM choices, even though the authors report stable relative rankings across alternative consolidation/judge configurations.
7. **License boundary.** The Adobe Research dataset repository states that the dataset is restricted to non-commercial research use. Any product integration would require separate licensing analysis.

## Research Center observations

### Observation A — root cause can be a hypothesis set

For multi-agent systems, a better diagnostic record can preserve several candidate causes with provenance, rationale and confidence rather than overwriting uncertainty with a single label.

### Observation B — consensus and independence are not interchangeable

Three model samples agreeing is not equivalent to three independent evidence sources agreeing. Consensus should capture *perspective convergence*; evidence identity should separately capture whether those perspectives rely on the same underlying model, prompt, trace or source.

### Observation C — the repair plane can be deterministic while diagnosis remains plural

Operations need a next action, but they do not need to pretend causal ambiguity has disappeared. The runtime can rank hypotheses, select a bounded repair, record why that repair was chosen, and retain the alternative hypotheses for later evidence.

## Proposed diagnostic evidence envelope

This is a Research Center synthesis, not a claim made by the MP-Bench authors:

1. **Trace Facts** — immutable observed actions, tool calls, outputs and state transitions.
2. **Failure Hypotheses** — one or more causal explanations, each with perspective and provenance.
3. **Consensus / Salience** — ranking signals describing convergence and urgency without erasing disagreement.
4. **Repair Decision** — one governed action chosen from the current evidence, with reversible/irreversible risk and verification requirements.

The envelope prevents three common category errors: treating a hypothesis as a fact, treating consensus as independent validation, and treating a chosen repair as proof that one root cause was uniquely correct.

## Open questions

- How should diagnostic hypotheses inherit evidence identity when several models share the same trace and prompt?
- When should a high-consensus hypothesis be promoted to a stronger causal claim?
- How should systems represent mutually compatible versus mutually exclusive failure hypotheses?
- Can repair selection be optimized under causal uncertainty without forcing a single root-cause label?
- How well does multi-perspective attribution transfer to software engineering, scientific agents and long-running digital employees?
- What independent reproduction would be sufficient to validate MP-Bench's sampling and multi-model findings?

## Source trace

1. Yeonjun In et al., *Rethinking Failure Attribution in Multi-Agent Systems: A Multi-Perspective Benchmark and Evaluation*, arXiv:2603.25001v1, 2026-03-26 — https://arxiv.org/abs/2603.25001
2. Full paper HTML — https://arxiv.org/html/2603.25001
3. Adobe Research, `adobe-research/multi-agent-eval-bench`, inspected at `b8042d410850672ea5bee4b1031c6cde9028e099` — https://github.com/adobe-research/multi-agent-eval-bench
4. Paper-linked code repository — https://github.com/yeonjun-in/MP-Bench
