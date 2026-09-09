# Q-20260909-02 — Scientific-Agent Evaluation Must Separate Execution Competence from Evidentiary Judgment

- Runtime date: 2026-09-09 (Asia/Shanghai)
- Queue signal: SIG-20260909-005
- Primary research source: https://arxiv.org/html/2609.05079v2
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When an agent can successfully operate tools, run analyses and produce technically polished research artifacts, what additional evidence is required before treating its conclusions as trustworthy knowledge rather than merely competent execution?

## Problem

Agent evaluation often collapses two different questions: **can the system execute a research workflow?** and **did it form a defensible scientific judgment from the evidence?** A system can load data, write code, generate plots and document a result while still failing to test controls, probe robustness, seek falsifying evidence or demonstrate that the claim generalizes beyond one dataset.

TruthInsightBench is useful because it evaluates open-ended scientific discovery without giving the agent the source paper's conclusions and weights evidence quality much more heavily than task completion or rhetorical plausibility. The resulting profile shows that agent harnesses can be comparatively competent at execution and documentation while remaining much weaker at adversarial evidentiary reasoning.

For digital employees, the broader question is organizational: a worker that can complete a procedure and produce a coherent report has demonstrated **execution competence**, not automatically **decision authority** or **truth-quality**. Evaluation must preserve that separation.

## Evidence Base

TruthInsightBench V1.0 contains **40 blind tasks** drawn from **40 peer-reviewed studies** across **10 scientific domains**. The underlying studies were published from 2018 through 2024. A task is admitted only when the data are interpretable and the benchmark builders can recover at least two main results while also defining controls or perturbation analyses that test the finding space.

Each task undergoes eight construction-time verification analyses: two re-derivations of main results plus six perturbation analyses. Across the benchmark this yields **320 construction-time checks**. The agent receives a neutral research objective, frozen data and metadata, and a literature cutoff, while the source identity, source conclusions, evaluator references and decision criteria remain hidden during the run.

The blindness is explicitly protocol-level. The paper does not claim that a pretrained model could never have encountered the original study during pretraining.

## Discovery Is Not Defined as Matching a Hidden Answer

The benchmark does not require the agent to rediscover one predetermined sentence. It treats scientific discovery as an open-ended evidence problem. A claim is judged through evidence quality, robustness, controls, cross-dataset generalization, novelty and falsifiability.

The source study is used only as one bounded reference after execution. Convergence with the hidden source contributes a small post-run bonus; it is neither necessary nor sufficient for a high main score. This design matters because an agent could correctly challenge the original study or derive a different well-supported result and still deserve credit.

That makes the benchmark more relevant to digital knowledge work than a simple answer-key test. The question is not whether an agent repeated an expected conclusion, but whether the conclusion it selected is auditable and survives attempts to break it.

## The 29-Item Evaluator Separates Evidence Dimensions

The benchmark uses a **29-item evaluator** grouped into six dimensions. Each item receives 0, 0.5 or 1, and proposed-but-not-executed checks receive zero. The weighted dimensions are:

- **Evidence Auditability — 45 points**
- **Robustness — 15 points**
- **Control Testing — 15 points**
- **Cross-dataset Generalization — 10 points**
- **Novelty — 10 points**
- **Falsifiability — 5 points**

Evidence Auditability is intentionally dominant. The benchmark therefore rewards whether the agent actually grounds a claim in inspectable analyses and artifacts rather than whether it merely states that a check should be done.

The overall task score gives most of its evidence-quality weight to the two strongest semantically distinct discoveries. This prevents a long list of weak claims from overwhelming a small number of well-supported findings.

## Controlled Harness Comparison

The baseline study holds the underlying model constant and varies the agent scaffold. Four systems use the same frozen **DeepSeek-V4-Flash** base model with thinking disabled:

- Claude Code 2.1.220
- Codex CLI 0.149.0
- OpenScience 2.0.1
- DeepSeek Harness 0.1.0rc7

A frozen GLM-5.1-W4A8 evaluator, also with thinking disabled, scores the outputs. Each system runs all 40 tasks once, producing 160 agent-task units and hundreds of reported discoveries.

Mean overall scores are close: **Claude Code 60.27**, **OpenScience 59.03**, **Codex CLI 58.81**, and **DeepSeek Harness 58.40**. The total spread is only 1.87 points, confidence intervals overlap, and paired Wilcoxon tests do not identify a statistically reliable pairwise winner after correction.

This is important because the benchmark does **not** support a strong leaderboard claim that one of these harnesses is generally superior. Its more informative result is the shared evidence profile across systems.

## The Shared Weakness Is Evidentiary Discipline

Across the four scaffolds, Evidence Auditability is relatively strong at roughly **78–81%** of available points, and Novelty is also high at roughly **83–87%**. But the same agents score much lower on the dimensions that require active challenge of their own conclusions:

- **Control Testing: about 11–16%**
- **Robustness: about 9–14%**
- **Falsifiability: about 29–33%**
- **Cross-dataset Generalization: near zero**

The agents are therefore capable of producing multiple semantically distinct findings and documenting supporting evidence, yet they rarely run the controls and perturbations needed to distinguish a stable scientific effect from an artifact, confound or overfit observation.

This is a stronger and more precise statement than “agents are bad at science.” They show meaningful execution capability. What is missing is a systematic **evidence-challenge loop**.

## Trap Tasks Expose the Difference Between Analysis and Judgment

The benchmark contains diagnostic cases where correct tool use is not enough.

In one chemistry task, apparently meaningful spikes can be artifacts of numerical interpolation. A trustworthy analysis must compare interpolation methods and perturb interpolation nodes rather than accepting the first visually convincing pattern.

In one physics task, a synthetic network slowdown appears interesting but must be checked against real network data before it can support a broader conclusion.

These cases reveal a common failure mode for knowledge workers: the agent can execute a valid analysis that generates evidence for a claim but does not ask whether an alternative mechanism could generate the same observation. The missing step is not more tool fluency; it is **discriminating evidence**.

## Cross-Dataset Generalization Needs Careful Interpretation

The near-zero cross-dataset score should not be attributed entirely to agent weakness. The paper identifies three contributing causes:

1. a benchmark-side floor because some tasks do not provide a natural independent dataset;
2. a genuine agent-discipline gap, because agents seldom seek external confirmation even when it is possible;
3. the single-phase static protocol, which undermeasures longitudinal validation that would naturally occur later in real research.

This is an important evidence boundary. The benchmark strongly supports a weakness in controls and robustness, but cross-dataset generalization is partly constrained by benchmark design.

## Execution Competence Is Not Evidentiary Authority

A bounded architecture inference is that an organizational agent should expose at least two separate acceptance states:

### Execution competence

Evidence that the worker can perform the required operations: obtain data, use tools, run code, generate artifacts, follow process constraints and produce a reproducible trace.

### Evidentiary judgment

Evidence that the worker selected conclusions proportionate to the data, tested plausible alternatives, ran controls, probed robustness, identified conditions that would falsify the claim and bounded generalization.

These states can diverge. A technically successful run can remain weak as a decision input. Conversely, a cautious worker may correctly report that evidence is insufficient even when that produces less impressive output.

For digital employees, the acceptance gate should therefore avoid treating “task completed,” “report generated,” “tool calls succeeded,” or even “evidence attached” as equivalent to a trustworthy decision.

## Evaluation Itself Must Remain Governed

TruthInsightBench uses a frozen LLM judge for scalable evaluation, but the authors explicitly do not claim equivalence to expert scientific judgment. They report expert calibration and plan further judge validation. This prevents a second collapse: **AI evaluator output is not automatically ground truth simply because it is structured and repeatable.**

The released repository is materially stronger than a paper-only artifact. It contains the 40-task benchmark data, agent adapters, evaluator code, specification files, provenance records and validation tooling. However, the paper also states that some exact internally frozen details of the reported baseline runs—such as system-specific prompts, resource/network/failure rules and the original run artifacts—are not all public. The public repository supports benchmark execution and evaluator inspection, but it does not by itself establish byte-for-byte reproduction of every baseline run reported in the paper.

## Failure Modes for a Digital Knowledge Worker

### Completion-quality collapse

A report is accepted because the workflow finished and the artifact is polished, even though the main conclusion was never challenged.

### Evidence-volume substitution

Many citations, plots or analyses are mistaken for stronger evidence even when they all depend on the same assumption or dataset.

### Proposed-test credit

The worker says that controls or robustness checks should be run and receives implicit credit without actually executing them.

### Self-confirmation loop

The same agent proposes the hypothesis, selects the analysis, interprets the output and declares success without an independent challenge path.

### Benchmark-answer fixation

Evaluation rewards similarity to an expected conclusion rather than the quality of the evidence chain, discouraging legitimate contradiction of prior work.

### Generalization overclaim

A result from one frozen dataset is written as a broad law without external replication or an explicit generalization boundary.

### Evaluator-authority collapse

A model-generated score is treated as final truth rather than one evidence source with its own calibration and failure modes.

## Evidence Strength

This is strong primary benchmark evidence for a **cross-harness execution-versus-evidentiary-quality gap** under a controlled shared-model configuration. The 40 blind tasks, explicit evidence rubric, construction-time verification, paired harness design, statistical comparison and diagnostic tasks support the conclusion that current scientific-agent scaffolds can execute substantial workflows while still underperforming on controls, robustness and falsification.

It is not evidence that the four harnesses are equivalent in all settings, that one overall score predicts production knowledge-worker quality, or that the benchmark demonstrates recursive self-improvement. The paper explicitly warns against these extrapolations.

## Limits and Unknowns

- The study uses one frozen mid-capability base model and one run per agent-task pair; it does not estimate full run-to-run variance in claim selection.
- The tasks are retrospective frozen-data discovery, not first-in-world discovery with live experimental iteration.
- Protocol blindness cannot prove absence of pretraining exposure to source studies.
- Cross-dataset scoring is partly constrained by task and protocol structure.
- A single frozen LLM evaluator is a scalability mechanism, not a proof of expert-equivalent judgment.
- Exact system-level baseline reproduction is limited by non-public run details and missing original run artifacts.
- Results from open, reproducible scientific data should not be directly generalized to every commercial or operational knowledge-work domain.

## Unresolved Questions

1. What minimum independent evidence should be required before a digital employee's analytical conclusion can drive a consequential business decision?
2. Should control testing, robustness and falsifiability be mandatory gates for high-risk knowledge work rather than optional quality dimensions?
3. How can an evaluation runtime distinguish genuinely independent evidence from several analyses derived from the same underlying assumption?
4. When should a second model or human reviewer challenge the conclusion, and when can deterministic tests provide sufficient opposition?
5. How should evidence-quality scores remain calibrated as models, tools and domain data change without letting the evaluator become an unreviewed authority?

## Reading Conclusion

The selected evidence supports a bounded conclusion: **competent execution and trustworthy evidentiary judgment are separate capabilities.** TruthInsightBench shows that several agent scaffolds using the same base model can run substantial scientific workflows, produce auditable evidence and generate novel claims while still rarely performing the controls, robustness checks and falsification attempts that would justify stronger trust in those claims. A governed digital-employee runtime should therefore preserve separate evidence for task execution and conclusion quality, and it should require explicit challenge evidence before converting a technically successful analysis into organizational authority.
