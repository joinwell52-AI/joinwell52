---
title: "A Successful Rerun Does Not Prove the Repair"
date: '2026-08-31'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "受治理智能体运行体在恢复实验中必须固定什么、允许改变什么，才能支持因果修复，而不只是一次幸运重跑？"
summary: "A study of 536 confirmed failures across three multi-agent frameworks reports that unguided reruns often reproduce failure but rarely repair it. Controlled replay freezes a failed logical prefix, rejects divergence, and resumes live execution after an explicit intervention anchor; external state remains a separate validity gate."
sources:
  - research/analysis/Q-20260831-03-controlled-replay-causal-repair-validity.md
item_id: "Q-20260831-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-31-a-successful-rerun-does-not-prove-the-repair-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-31-a-successful-rerun-does-not-prove-the-repair-cover.png"
  kicker="Open-source Engineering · Daily Research"
  title="A Successful Rerun Does Not Prove the Repair"
  summary="A study of 536 confirmed failures across three multi-agent frameworks reports that unguided reruns often reproduce failure but rarely repair it. Controlled replay freezes a failed logical prefix, rejects divergence, and resumes live execution after an explicit intervention anchor; external state remains a separate validity gate."
  version="Q-20260831-03"
  status="Daily Runtime V5 · 2026-08-31"
  languageHref="/zh/engineering/2026-08-31-a-successful-rerun-does-not-prove-the-repair"
  languageLabel="中文"
/>

# A Successful Rerun Does Not Prove the Repair

An agent task fails. An engineer changes the suspected defect, reruns the task, and it passes. The repair appears effective, but the second execution also changed model sampling, tool returns, scheduling, and intermediate decisions. Did the fix change the outcome, or did the system draw a luckier trajectory?

That distinction determines what a recovery test can prove. A rerun asks whether another attempt can succeed. Controlled replay asks whether changing one designated intervention against the same represented failed prefix changes the suffix. A causal repair claim needs stronger evidence that the change addressed the original failure mechanism.

A primary study analyzes 536 confirmed failures across AG2, CrewAI, and Magentic-One. It supports a bounded engineering proposition: **rerun success is resampling evidence. Causal repair requires an authoritative failed logical prefix, fail-closed divergence detection, an explicit intervention anchor, and separate qualification of external state required by the live suffix.**

## Rerun Changes Too Many Variables at Once

The study begins with 600 initial task-system executions over 200 tasks and retains 536 evaluator-confirmed failures. On the first attempt, unguided rerun reproduces the same failure 67.97% of the time, while controlled replay reaches 80.78%. By the third attempt, the reported rates are 41.42% and 52.43%.

More importantly, failure reproduction and task repair are different outcomes. Unguided rerun repairs only 6.90% of failed tasks at pass@3. It often reaches a similar failure again, yet rarely establishes that a particular repair mechanism worked.

Full reruns remain useful for availability, stochastic success probability, and end-to-end pass rate. If the objective is repair validation, however, the experiment must reduce the number of variables that move together.

## Turn the Failed Prefix into a Versioned Test Fixture

Controlled replay freezes an authoritative represented failed prefix. Each boundary event validates its position and canonicalized request. At the first material divergence, the experiment stops instead of pretending it is still reproducing the same case.

Matched prefix events can return recorded boundary results, keeping represented state before the intervention stable. At an explicit intervention anchor, the runtime switches back to live execution and permits the repair to influence the suffix.

The anchor is the causal boundary. Everything before it is evidence to hold fixed; everything after it may respond to the change. Without an anchor, “we changed only this” cannot be audited. Without fail-closed divergence, a changed prefix can be misclassified as the same repair experiment.

## Targeted Intervention Produces More Informative Evidence

For single-attempt intervention, the paper reports 1.31% repair when choosing the last node, 3.73% with random targeting, and 20.15% with symptom-driven suspicious-node targeting. The 20.15% result combines target selection and repair guidance, so it cannot isolate every component. It nevertheless shows the value of controlled experimentation: changing an interpretable location produces more useful causal evidence than resampling the full trajectory.

Controlled replay is not an automatic repair solution. A 20.15% repair rate still leaves most failures unresolved. Replay infrastructure improves the test condition; it does not guarantee success.

## Logical Equality Does Not Recreate the External World

The paper reports 100% content-hash exactness for the represented logical prefix under its captured-state assumptions. That guarantee applies to recorded and represented events. It is not arbitrary physical replay of a distributed system.

Suppose a prefix tool call paid an invoice, sent a message, or changed a remote record. Returning the recorded “success” result during replay does not recreate the side effect. Re-executing the tool may duplicate it. The logical prefix can match perfectly while external state required by the live suffix differs.

Causal repair therefore needs two independent validity gates. The first verifies that the logical prefix matches the failed fixture. The second verifies that external state has been restored, compensated, safely re-executed, or checkpointed for the suffix. Missing either gate supports only a weaker conclusion.

## Three Operations Need Three Receipts

A governed runtime should represent rerun, controlled replay, and causal repair separately. A rerun receipt records the new trajectory and final outcome. A replay receipt binds failed-trace version, event order, divergence checks, and intervention anchor. A repair receipt additionally records the repair hypothesis, live-suffix outcome, and external-state qualification.

This separation prevents a common reporting error: turning “it passed later” into “the defect was repaired.” The former is an outcome fact. The latter is a causal claim that must state what stayed fixed, what changed, and whether external prerequisites remained valid.

## Evidence Boundary and Open Questions

The study covers three multi-agent frameworks and selected browser and assistant tasks. Parts of the classification pipeline use an automated evaluator, and the main evaluation uses one hosted model configuration. It does not establish provider-version invariance or capture every scheduling, network-timing, or external-side-effect boundary.

Open questions include which model, tool, human, and delivery boundaries must be captured; which canonicalization ignores harmless differences without accepting material change; what external-state contract permits reuse of recorded tool success; and how multiple repair hypotheses can share one frozen prefix without cross-experiment contamination.

The precise conclusion is: **rerun tells us whether the system can find success; controlled replay tests a designated change. Only when logical-prefix and external-state validity both hold can suffix success support a causal repair claim.**

**Primary evidence:** [Repair or Resample? Rethinking Failure Debugging in LLM Multi-Agent Systems](https://arxiv.org/abs/2608.25920)
