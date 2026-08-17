---
title: "An Agent Evaluation Should Ship More Than a Score"
date: '2026-08-17'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "What must an executable evaluation package contain to distinguish a genuinely reliable agent run from a final output that merely happens to pass?"
summary: "A release-grade agent evaluation needs two inspectable execution chains: the run being tested and the evaluator that interprets it. Package the scenario, environment, trace, effects, oracle, grader code, results, claim links, and evaluator limits so a passing score can be rerun, challenged, and bounded."
sources:
  - research/manual-runs/2026-08-17-high-quality-article-pipeline/03-reading-notes.md
  - research/manual-runs/2026-08-17-high-quality-article-pipeline/03-fact-claim-matrix.md
  - research/manual-runs/2026-08-17-high-quality-article-pipeline/03-analysis.md
item_id: "TP-20260817-04"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-17-executable-agent-evaluation-package-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-17-executable-agent-evaluation-package-cover.png"
  kicker="Open-source Engineering · Research Article"
  title="An Agent Evaluation Should Ship More Than a Score"
  summary="A release-grade agent evaluation needs two inspectable execution chains: the run being tested and the evaluator that interprets it. Package the scenario, environment, trace, effects, oracle, grader code, results, claim links, and evaluator limits so a passing score can be rerun, challenged, and bounded."
  version="TP-20260817-04"
  status="Independent Editorial PASS · 2026-08-17"
  languageHref="/zh/engineering/2026-08-17-executable-agent-evaluation-package"
  languageLabel="中文"
/>

# An Agent Evaluation Should Ship More Than a Score

Suppose a release check says `0.82 / PASS`. That looks decisive until someone asks four mundane questions: Did the grader actually run? Did it read the trace from this run? Did the agent change the intended target rather than merely turn the tests green? Which artifact supports the report's claim that the behavior was stable?

If the evaluation cannot answer those questions, 0.82 is a compressed signal, not release evidence.

Several independent studies published in 2026 expose different versions of this gap. Generated evaluator code may fail on its first execution. A passing patch may emerge from blind retries. An agent may complete an operation against the wrong target or at excessive scope. A score may reproduce even while the accompanying report describes an algorithm the code never implemented. A recent OpenAI audit also shows that noise can sit upstream in benchmark tasks and tests, not only in model output.

An [earlier Research Center analysis](/en/engineering/2026-08-02-swe-bench-verified-quality) established benchmark task, test, environment, and evaluator validity as necessary conditions for a meaningful score. This article starts after that gate: even with a valid upstream benchmark, a team must still show that the evaluator executed, consumed the intended artifacts, and kept its report within the evidence.

Those sources do not propose one shared standard. The contract below is a Research Center synthesis: **a release-grade evaluation should expose two execution chains—the agent run and the evaluator run—instead of shipping only the number at their end.**

## One pass label collapses at least five questions

A binary outcome commonly mixes together output correctness, process quality, action boundaries, evaluator execution, and report integrity. These are related, but they fail independently.

[AgentLens](https://arxiv.org/abs/2605.12925) examined 2,614 OpenHands trajectories. For 47 SWE-bench Verified tasks with enough passing trajectories to construct process references, the authors built a 1,815-trajectory evaluation subset. It contained 1,136 passing trajectories, and 10.7% of those were classified as Lucky Passes: regression cycles, blind retries, missing verification, or badly ordered exploration, implementation, and verification. Ranking by process quality rather than pass rate moved some models by as many as five positions.

That does not make process quality a better ground truth than functional tests. The authors explicitly position it as a complementary diagnostic. A high process score can still accompany an incorrect or insecure patch, and fixed weights can penalize legitimate exploration. The narrower finding matters: an outcome-only label cannot tell us how the outcome was obtained.

[UnderSpecBench](https://arxiv.org/abs/2607.02294) captures another kind of false comfort. Its 69 task families produce 2,208 prompt variants that manipulate intent clarity, target certainty, and blast radius. Runs take place in isolated, network-restricted containers. Deterministic side-effect oracles distinguish Safe Success from Wrong Target and OverScope. Across five agent–model configurations, 55.8% to 67.8% of acted runs violated at least one action boundary; runs that did not act, clarified, refused, or deferred are outside that denominator. Target ambiguity was the dominant driver, while blast-radius wording barely reduced the propensity to act.

Those rates are not production incident estimates. The benchmark intentionally stresses autonomous, no-confirmation execution, and each task encodes one intended safe action that may omit defensible alternatives. Human gates and richer organizational context change the operating conditions. The mechanism still matters: a completion-only grader can award success to a change made against the wrong object or through an overly broad control surface.

## The evaluator is software, too

Teams routinely version the agent, tool adapters, and environment while treating the grader as a transparent function. The EvalAgent study makes that assumption difficult to defend.

[An Empirical Study of Automating Agent Evaluation](https://arxiv.org/abs/2605.11378) evaluated generated assessment code for 20 agents. It introduced `Eval@1`: whether an evaluator executes successfully and produces substantive, non-vacuous results on the first attempt. With Sonnet 4.5 as the evaluator backbone, the single-turn B1 baseline reached 17.5% Eval@1 and EvalAgent reached 65.0%. In a separate blinded expert comparison of EvalAgent against B4 (Agent-Twostage), 79.5% of dimension-level judgments preferred EvalAgent; that figure is not a comparison against B1. Yet 65% also means roughly one third of generated evaluators still required debugging. The experiments used Claude-family models, and 20 agents cannot represent every agent class.

The durable lesson is not the winner. It is the object being measured: **an evaluator must itself be executed, tested, and bounded.** A plan can name five metrics while the code computes three. Exit code zero can accompany an unread input. A JSON result can contain a constant score, an empty aggregate, or a keyword heuristic that never examines the behavior it claims to grade.

The first-party [Agent-EvalKit repository](https://github.com/awslabs/Agent-EvalKit) materializes the paper's pipeline as evaluation planning, test scenarios, instrumentation, traces, executable evaluator code, and a report. It is implementation evidence from the same source identity, not an independent replication. Its useful engineering property is the delivery shape: reviewers can follow a claim in the report back to the code and inputs that produced it.

## A reproducible score can support a false story

[ScientistOne](https://arxiv.org/abs/2605.26340) separates score verification, specification violations, reference existence, and method–code alignment. Across 75 papers generated by five systems on five systems-optimization tasks, baseline hallucinated-reference rates reached 21%, score verification passed in as few as 42% of papers, and method–code alignment ranged from 20% to 80%. In that experiment, ScientistOne reported zero hallucinated references out of 337 bibliography entries, 12 of 12 score-verification passes, and 14 of 15 method–code alignment passes.

Those figures belong to a systems-optimization benchmark, not autonomous research in general. Reference existence is weaker than claim entailment. Automated reviewers do not replace domain experts, and the audit did not systematically bound false negatives. Two cases are especially instructive. One submission reproduced its score by exploiting a correspondence check the evaluator did not perform. Another nearly reproduced its score while its paper described an algorithm absent from the code.

Recomputing the same number therefore verifies only part of the grading chain. It does not establish that the task is valid, the implementation matches the intended method, or the prose accurately represents the artifacts.

OpenAI's July 2026 audit, [Separating signal from noise in coding evaluations](https://openai.com/index/separating-signal-from-noise-coding-evaluations/), pushes the inspection boundary farther upstream. An automated filter considered task instructions, model attempts, and grading tests and flagged 286 potentially problematic tasks. Investigator agents with repository and environment access then performed repeated audits, followed by researcher judgment. A separate human campaign assigned five trained engineers to each reviewed task; they inspected the visible problem statement, tests, and gold/reference solution, then escalated disagreements and low-confidence cases. This is not a universal artifact schema, but it demonstrates why tasks, tests, gold/reference solutions, and adjudication belong in an evaluation's evidence surface.

## The score is produced by two execution chains

Put the findings together and two different programs become visible.

The **agent execution chain** is:

`scenario and boundaries → environment and versions → agent/model identity → actions and tool calls → external effects → final output`

It answers what the agent did, under which conditions, to which target, at what scope, and how the final state arose.

The **evaluator execution chain** is:

`evaluation plan → fixtures/data → trace or result input → oracle/rubric → evaluator code and dependencies → evaluator run → per-case results → report claims`

It answers who interpreted the run, under which rule and version; whether the evaluator executed; whether it consumed the intended artifacts; whether its outputs were non-vacuous; and whether the report stayed within the evidence.

This two-chain model is our synthesis, not a standard validated by any one paper. Its practical advantage is fault localization. “The eval failed” becomes a tractable diagnosis: invalid scenario, environment drift, missing trace, narrow oracle, broken evaluator, vacuous aggregation, or a report that outruns its artifacts.

## Eight artifacts create a reviewable surface

The two chains can be packaged without adopting a particular vendor:

| Artifact | Question it must answer | Failure hidden when absent |
|---|---|---|
| Scenario contract | What counts as success, which target is authorized, which effects are forbidden, and what alternatives are acceptable? | Wrong-target or over-scoped action receives credit |
| Environment identity | Which code, model, harness, tools, data, and external services were used? | Scores cannot be compared or rerun |
| Trace and effects | Which observable actions and state changes occurred? | Lucky passes, blind retries, and boundary violations disappear |
| Oracle or rubric | Which facts are deterministic checks and which require semantic judgment? | An incomplete test masquerades as complete truth |
| Evaluator and dependencies | Is the grader executable, and which input schema does it consume? | Plan–code drift and dependency drift remain invisible |
| Raw results | What were each case's outputs, errors, exit status, and component verdicts? | An aggregate score cannot be diagnosed |
| Claim links | Which artifact supports each release-relevant number and statement? | A real score can anchor a false narrative |
| Meta-evaluation and limits | How was the evaluator tested, and where are its known false positives, false negatives, and scope boundaries? | Grader blind spots are mistaken for agent capability |

A plain directory is enough to make the contract concrete:

```text
eval-package/
  manifest.json
  scenario/contract.yaml
  environment/lock.json
  runs/<run_id>/{trace.jsonl,effects.json,result.json}
  evaluator/{grader.py,requirements.lock,tests/}
  results/{per-case.json,summary.json}
  claims/claim-links.json
  review/{meta-evaluation.md,limitations.md}
```

The manifest should bind a stable `scenario_id` and `run_id` to the agent version, evaluator version, inputs, and artifact hashes. It should also use precise reproducibility language. `Rerunnable` means the package can execute again in a declared environment. `Replayable` means a saved trace can be graded again. `Bitwise reproducible` is a much stronger claim. A fixed seed does not erase nondeterminism from hosted models, concurrency, time, networks, or external APIs.

Existing open-source projects supply useful pieces. [agentevals](https://github.com/agentevals-dev/agentevals) can repeatedly score recorded OpenTelemetry traces and package dependencies with custom evaluators; its own documentation says the current tool is not optimized for long-running coding-agent traces with nonstandard telemetry. [TraceCore](https://github.com/justindobbs/Tracecore) includes spec, runtime, task, artifact, budget, and replay identities in a verifiable bundle. These are engineering examples, not evidence that the eight-artifact contract is already an industry standard.

## In CI, test the evaluator before trusting its verdict

A minimal admission sequence should fail closed in this order:

1. Validate the manifest, stable identities, versions, hashes, and required artifacts. Stop on an input mismatch.
2. Run evaluator fixtures in isolation. Normal, malformed, and empty inputs must produce the expected structured outcomes.
3. Execute the evaluator and inspect its exit status, component results, and aggregation. Reject constant scores, empty sets, and unconsumed inputs.
4. Check authorized targets, prohibited effects, and observed state changes separately from the final functional result.
5. Preserve outcome and process diagnostics as separate dimensions. A process anomaly can trigger review without automatically rejecting a valid novel path.
6. Require an artifact link for every number and claim used to approve release. Partial support must remain partial in the report.
7. Escalate to human review when risk is high, semantic graders disagree, or evaluator scope is uncertain.

Risk tiers are more defensible than “retain everything.” A local, side-effect-free regression may need only a manifest, versions, results, and failure logs. An agent that modifies a shared repository, production traffic, payments, or external messages warrants action traces, separate effect records, permission evidence, and a human sign-off.

Nor does the package require hidden chain-of-thought. Reviewers need observable actions, tool inputs and outputs, state transitions, and decision records required by the operating contract. Sensitive traces should be minimized, redacted, access-controlled, and governed by retention periods. Evidence quality is not a license for unlimited collection.

## What the package does not prove

Eight artifacts do not guarantee a reliable agent. A deterministic oracle can be too narrow. A semantic rubric can be unstable. Human reviewers can miss defects. A complete package cannot eliminate data contamination, unknown attacks, or incomplete tests. Trace retention also adds cost and can expose user data or credentials.

What the package offers is a more honest failure boundary. Instead of arguing whether 0.82 is “high enough,” a team can determine whether the run crossed a boundary, whether the evaluator worked, whether the aggregate has component evidence, whether the report exceeds that evidence, and which remaining judgment belongs to a person.

Five questions remain empirical: Which artifacts provide the most value at each risk tier? How should teams measure an evaluator's false-positive and false-negative rates over time? What is the minimum sufficient trace under privacy constraints? Can a claim-to-artifact schema transfer across coding, operations, research, and service agents? And who independently evaluates the evaluator so it does not share the agent's blind spots?

Release approval does not need another decimal place. It needs an evidence path that can be rerun, challenged, and rejected. Keep the score in the summary—but ship the package that gives the score meaning.
