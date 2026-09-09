---
schema: publication-candidate-article/v2
title: "A Finished Report Is Not Yet a Trustworthy Conclusion"
date: '2026-09-09'
column: industry-architecture
category: daily
article_type: comparative-study
edition: research-center
research_question: "当智能体能够操作工具、执行分析并生成完整研究成果时，在把它的结论接受为可信的组织知识之前，还需要哪些额外证据？"
summary: "TruthInsightBench finds that four agent scaffolds using the same model can produce comparatively auditable and novel work while sharing weak control testing, robustness, and falsifiability. Organizations should preserve two acceptance states: the analysis may be correctly executed, while its conclusion still waits for challenge evidence before becoming organizational authority."
cover: staging/publication-candidates/2026-09-09-finished-report-needs-challenge-evidence-cover.png
sources:
  - research/analysis/Q-20260909-02-evidence-challenge-gated-knowledge-trust.md
---

![A completed report held between an evidence ring and a separate challenge ring](staging/publication-candidates/2026-09-09-finished-report-needs-challenge-evidence-cover.png)

# A Finished Report Is Not Yet a Trustworthy Conclusion

A research agent obtains the required data, calls the analysis tools correctly, generates figures, cites sources, and delivers a polished report. Every step is traceable. The files can be recomputed. The task appears complete.

Then a reasonable interpolation change removes the main pattern. A transfer from synthetic to real data fails to reproduce the relationship. The execution may be technically competent, yet the conclusion lacks evidence that discriminates between plausible explanations.

This is not an argument against agents doing research. Separating capabilities is what lets an organization preserve useful completed work without prematurely converting an unchallenged judgment into a decision premise.

The central argument is: **execution competence and trustworthy evidentiary judgment are separate acceptance states. For consequential knowledge work, a polished result should become organizational authority only after controls, robustness, falsification, and bounded-generalization checks have actually produced evidence.**

## Close Overall Scores Hide a Shared Weakness

The same-day Research Object examines TruthInsightBench V1.0. The study uses 40 blind tasks across 10 scientific domains, 320 construction-time verification analyses, and a 29-item evidence-centered evaluator. To reduce base-model confounding, four agent scaffolds use the same frozen model with thinking disabled.

The reported mean overall scores are 60.27, 58.81, 59.03, and 58.40. The total spread is only 1.87 points. Confidence intervals overlap, and corrected paired tests do not establish a stable winner.

A headline declaring one scaffold generally superior would therefore exceed the evidence. The shared capability profile is more useful: different execution shells reach similar totals and show weakness in similar dimensions. For an organization choosing architecture, swapping the scaffold alone may not supply the missing evidentiary discipline.

## Auditability Is Not Challenge Evidence

Across the four systems, Evidence Auditability reaches roughly 78–81% of available points and Novelty roughly 83–87%. The agents can run analyses, preserve artifacts, and expose the material behind their reasoning. Those capabilities matter because an untraceable conclusion cannot even enter serious review.

Control Testing, however, is only about 11–16%; Robustness about 9–14%; and Falsifiability about 29–33%. Cross-dataset Generalization remains near zero. The striking tension is that **evidence is visible, but it has not been sufficiently challenged**.

Auditability answers what was done, which material was used, and what result appeared. Challenge evidence asks different questions. Does the conclusion survive a reasonable alternative method? Does it disappear after controlling for a confounder? Does it transfer to another dataset? What observation would make the system retract the claim?

These states cannot be merged. Complete sources and polished figures make review possible. They do not substitute for a review that actually ran.

## A Correct Run Can Support a Weak Conclusion

The benchmark explicitly distinguishes proposing a control or robustness check from executing it. Proposed-but-unexecuted checks receive no credit. This is a useful governance rule: intent is not effect, and a plan is not evidence.

A technically correct pipeline can still stop at an insufficient judgment. The code may run as specified. The figure may faithfully represent the current data. The report may describe its output accurately. Yet the central pattern may depend on an interpolation choice or exist only in a synthetic sample. The problem is not necessarily tool-use failure. It is the absence of observations that discriminate among competing explanations.

Task completed, tool calls succeeded, artifacts are auditable, and conclusion is trustworthy are at least four different facts. The first three can be true while the fourth is still waiting.

## Two Acceptance States

Organizations can formalize two separate states for knowledge work.

**Execution competence acceptance** asks whether the required data was obtained, tools were used correctly, the analysis is reproducible, key parameters and artifacts were preserved, and scope and permission constraints were followed.

**Evidentiary judgment acceptance** asks whether claim strength is proportionate, alternative explanations were actually tested, key results survived perturbations, falsifying conditions were considered, generalization was bounded, and allegedly independent evidence is genuinely independent in actor and assumption.

The separation enables a valuable terminal statement: the analysis was executed correctly and is reviewable, but its conclusion is not yet admitted for consequential use. That state is neither failure nor an indefinite running condition. The artifacts can enter a research layer and await further challenge; only the second gate promotes them into the authoritative layer used by policy, product, or investment decisions.

## Challenge Depth Should Follow Consequence

Two states do not imply expensive independent review for every low-risk summary. Governance depth should rise with the consequence of error, the reversibility of action, and evidence uncertainty.

| Use context | Minimum challenge evidence | Appropriate status |
|---|---|---|
| Low-risk exploration | basic reproduction, source check, obvious alternatives | research lead |
| Reversible operational advice | at least one control or perturbation, parameter sensitivity | restricted advice |
| High-cost decision | multiple robustness checks, counterfactual or external data | decision candidate |
| Irreversible or high-consequence decision | independent challenger, explicit falsification rule, accountable sign-off | admitted organizational knowledge |

The invariant is that a check must produce an observation. Writing that more research is needed cannot be counted as robustness evidence. A reviewer clicking seen cannot prove that an alternative explanation was tested.

Challenge artifacts should also preserve their relationship to the original claim: what proposition was challenged, what variation was introduced, and whether the result supported, weakened, or overturned it. Otherwise additional tests become attachments that cannot change the decision.

## An Evaluator Is Evidence, Not Ground Truth

TruthInsightBench uses a frozen large-language-model evaluator to score many artifacts consistently. Structured, repeatable AI evaluation is more auditable than an improvised impression, but the study does not establish expert-equivalent judgment.

That creates a second governance boundary. The evaluator's score is itself an evidence object. A durable record should identify evaluator version, prompt, readable inputs, calibration sample, disagreement with human judgments, and domain limits. Consequential conclusions may require a human or independent-model challenger, but another model provides independent evidence only when its assumptions, inputs, or evaluative perspective are meaningfully independent.

The near-zero cross-dataset score also needs bounded interpretation. The paper attributes part of it to benchmark constraints and a static single-phase protocol, not solely to agent weakness. A measurement with limits should not be promoted into a permanent capability label.

## Boundaries and Open Questions

The study uses one frozen mid-capability base model, one run per agent-task pair, and retrospective frozen datasets. It does not establish that every current or future model shares the profile, and protocol blindness cannot exclude pretraining exposure. A single LLM evaluator is not proof of expert equivalence.

Open questions remain. Which controls should be mandatory for high-risk business analysis? How should a system detect false independence when several reports share one assumption? When are deterministic checks enough, and when is an independent model or human challenger necessary? How quickly should challenge evidence expire after model, tool, or data change? How should a conclusion be downgraded when it is weakened but not falsified?

A practical rule is available now: **correctly executed analysis deserves preservation, but only evidence that has survived challenge proportional to risk deserves organizational adoption.**

**Evidence and citation:**

- [TruthInsightBench V1.0 primary study](https://arxiv.org/html/2609.05079v2)
