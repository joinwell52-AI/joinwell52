---
date: "2026-09-09"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260909-02
column: industry-architecture
article_type: comparative-study
project_relevance: none
source_reading: "research/reading/Q-20260909-02-execution-competence-evidentiary-judgment.md"
---

# Research Analysis — A Successful Agent Run Is Not Yet a Trustworthy Knowledge Decision

## Research question

When an agent can operate tools, execute analyses and produce polished research artifacts, what additional evidence is needed before its conclusion should be accepted as trustworthy organizational knowledge?

## Evidence identity and research scope

The same-date Reading Note analyzes TruthInsightBench V1.0, a primary benchmark study with 40 blind tasks across 10 scientific domains, 320 construction-time verification analyses and a 29-item evidence-centered evaluator. The study controls the base model across four agent scaffolds, enabling a bounded comparison between execution/documentation competence and evidentiary discipline. Reported scores and benchmark design are treated as `source-reported-claim` evidence. The organizational acceptance model below is `our-interpretation`, not independent validation of a universal enterprise governance rule.

The research subject is an **evaluation architecture + acceptance-gate problem**: task completion, artifact quality and even attached evidence can coexist with weak controls, robustness testing and falsification.

## The comparison does not support a simple harness leaderboard

Under the study's controlled configuration, Claude Code, Codex CLI, OpenScience and DeepSeek Harness use the same frozen DeepSeek-V4-Flash base model with thinking disabled. Their mean overall scores are close—60.27, 58.81, 59.03 and 58.40 respectively. The 1.87-point total spread, overlapping confidence intervals and corrected paired tests do not justify a strong claim that one scaffold is generally superior.

The more important result is the common profile across systems. Evidence Auditability reaches roughly 78–81% of available points and Novelty roughly 83–87%, while Control Testing is only about 11–16%, Robustness about 9–14%, Falsifiability about 29–33%, and Cross-dataset Generalization remains near zero. The shared weakness is therefore not simple inability to execute research workflows; it is a weak **evidence-challenge loop**.

## Why polished completion can still be epistemically weak

The benchmark gives zero credit to a control or robustness check that is merely proposed rather than executed. This is a useful governance distinction. A report can mention alternative explanations, controls or future tests and still fail to provide evidence that those alternatives were actually challenged.

Diagnostic tasks make the difference concrete. A technically valid analysis can surface an apparent pattern that disappears under an interpolation perturbation or fails to generalize from synthetic to real data. The tool use was competent; the judgment was incomplete because discriminating evidence was missing.

For organizational agents, this means `task completed`, `tool calls succeeded`, `report generated` and `evidence attached` should not collapse into one acceptance state.

## Evidence claims

### E1 — source-reported-claim

**Claim:** Four agent scaffolds using the same frozen base model achieve similar overall benchmark scores, with no statistically reliable corrected pairwise winner in the reported comparison.

**Source:** https://arxiv.org/html/2609.05079v2, as fully captured in the same-date Reading Note.

**Strength:** reports. **Independent:** false.

### E2 — source-reported-claim

**Claim:** Across scaffolds, Evidence Auditability and Novelty are comparatively strong while Control Testing, Robustness and Falsifiability are substantially weaker.

**Source:** same primary benchmark study.

**Strength:** reports. **Independent:** false.

### E3 — source-reported-claim

**Claim:** The evaluator awards zero to proposed-but-not-executed checks, explicitly separating stated intent from observed evidence-producing work.

**Source:** same primary benchmark study.

**Strength:** reports. **Independent:** false.

### E4 — our-observation

**Claim:** A technically successful run can demonstrate execution competence without demonstrating that the chosen conclusion survived plausible alternative explanations or perturbations.

**Source:** synthesis of the benchmark dimension profile and diagnostic trap tasks.

**Strength:** observed. **Independent:** false.

### E5 — our-interpretation

**Claim:** High-consequence knowledge work should expose separate acceptance states for execution competence and evidentiary judgment, with explicit challenge evidence required before analytical output is promoted to organizational authority.

**Source:** bounded synthesis from E1–E4.

**Strength:** supports. **Independent:** false.

## Two acceptance states, not one completion flag

A useful architecture separates at least two kinds of evidence.

**Execution competence** covers whether the worker obtained the required data, used tools correctly, ran the analysis, produced inspectable artifacts and followed process constraints.

**Evidentiary judgment** covers whether the conclusion is proportionate to the evidence, alternative explanations were tested, controls and robustness checks were actually executed, falsifying conditions were considered and generalization was bounded.

The first state can be high while the second remains weak. A system should therefore be able to say: “the analysis was executed correctly, but the conclusion is not yet accepted for consequential use.” This preserves useful work without granting epistemic authority that the evidence has not earned.

## The evaluator also needs governance

TruthInsightBench uses a frozen LLM evaluator for scale, but the study does not claim expert-equivalent judgment. That creates a second boundary: structured, repeatable AI evaluation is itself evidence, not ground truth. Calibration, disagreement analysis and human or independent-model review may be needed when evaluator conclusions carry high stakes.

The near-zero cross-dataset score also needs a bounded reading. The paper attributes it partly to benchmark-side constraints and the static single-phase protocol, not solely to agent weakness. This is exactly why evaluation dimensions should retain their measurement limitations instead of being promoted into universal capability labels.

## Bounded research judgment

**Execution competence and trustworthy evidentiary judgment are separate capabilities and should be accepted through separate gates.** Current agent scaffolds can perform substantial analytical work and produce auditable artifacts while still underperforming on controls, robustness and falsification. A governed knowledge-work runtime should therefore require evidence that a conclusion was actively challenged before allowing a successful analysis to become organizational authority.

This does not imply that every low-risk task needs an expensive independent review. The required challenge depth should scale with consequence, reversibility and evidence uncertainty. But the architecture should preserve the distinction even when policy chooses a lightweight gate.

## Counterarguments, limits and unresolved questions

The study uses one frozen mid-capability base model, one run per agent-task pair and retrospective frozen datasets; it does not establish that all current or future models share the same profile. Protocol blindness cannot rule out pretraining exposure, cross-dataset scoring is partly constrained by benchmark design, and the single LLM evaluator is not a proof of expert-equivalent judgment. Exact baseline reproduction is also limited by some non-public run details and original artifacts.

Open questions include which controls should become mandatory for high-risk business analysis; how to distinguish genuinely independent evidence from several analyses built on one assumption; when deterministic checks are enough versus when an independent model or human challenger is required; and how evaluator calibration should age as models, tools and domains change.

## Editorial recommendation

- **Article type:** comparative-study
- **Selected modules:** research-question; comparison; evidence; governance-implications; counterarguments; limitations; open-questions
- **Core proposition:** successful execution and polished evidence artifacts do not by themselves establish trustworthy analytical judgment
- **Project relevance:** none
