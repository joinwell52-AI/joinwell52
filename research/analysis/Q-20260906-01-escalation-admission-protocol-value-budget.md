---
date: "2026-09-06"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260906-01
column: digital-employee
article_type: technical-analysis
project_relevance: none
source_reading: "research/reading/Q-20260906-01-protocol-specific-escalation-routing.md"
---

# Research Analysis — Escalation Admission, Protocol Value, and Budget Need Separate Evidence

## Research question

When a digital employee appears likely to fail, what must a governed runtime know before it can safely move from “this path is risky” to “use this collaboration protocol now at this cost”?

## Research themes and subject kind

- **Themes:** multi-agent escalation; uncertainty; protocol routing; resource governance; budget admission; evidence identity
- **Subject kinds:** governance-problem; routing-mechanism; controlled-study interpretation; failure-mode
- **Sample:** cost-aware multi-agent reasoning study over matched OmniMath tasks with Baseline, Single, PER and Broadcast protocols

## Research value

### Failure

A single scalar confidence score can be asked to do three incompatible jobs: detect that the current path is likely to fail, choose which collaboration topology is likely to help, and justify the additional resource cost. The same score may be useful for the first decision while carrying very weak evidence for the second and no explicit authority for the third.

This creates two opposite governance failures. A conservative router can correctly detect uncertainty but under-escalate hard cases. An aggressive router can raise solve rate while repeatedly selecting expensive collaboration where the incremental value is small or absent. Treating “more agents” as a monotonic capability upgrade hides both failures.

### Findings

The same-date Reading reports a controlled study over 4,181 competition-level mathematics problems. For 4,151 parseable examples, a post-answer probe predicts baseline failure with 0.8847 AUROC and 0.895 AUPRC. Protocol-specific value prediction is far weaker: reported AUPRC is 0.1674 for PER-first value and 0.1041 for Broadcast-only value. The study also records substantial protocol cost differences and matched cases in which a more expensive topology does not dominate cheaper alternatives.

The evidence therefore supports a bounded distinction: identifying that a current answer is risky is materially easier in this setting than identifying which particular collaboration protocol will create enough incremental value. Cost is a third dimension because the measured protocols differ by orders of magnitude in token use in the study-specific setting.

### Mechanism

A governed escalation path should preserve three independently auditable decisions:

1. **Failure-risk admission** — evidence that the current execution deserves escalation consideration.
2. **Protocol-value routing** — evidence that a named candidate topology is expected to improve this particular task relative to available alternatives.
3. **Budget admission** — evidence that the expected incremental value is worth the admitted token, latency, compute or other operational budget.

These decisions may share features, but they should not silently share authority. A failure-risk receipt can open the escalation decision without pre-authorizing a particular topology. A protocol recommendation can rank candidates without itself granting an unbounded resource budget. Budget admission can cap expenditure without asserting that the cheapest option is adequate.

A useful runtime state transition is therefore:

```text
failure_risk_evidence
    -> escalation_consideration
protocol_value_evidence(task, candidate_protocol)
    -> candidate_ranking
budget_evidence(candidate_protocol, expected_cost, admitted_limit)
    -> execution_admission
```

If protocol-value evidence is weak, the runtime should retain an explicit uncertain state and apply a governed fallback rather than converting a high failure probability into automatic use of the most expensive topology.

### Implication

For digital employees, collaboration topology should be treated as an execution-policy choice rather than a binary “single agent versus multi-agent” feature. The runtime should make visible which evidence justified escalation, which evidence selected the protocol, and which policy admitted the cost. This also makes later evaluation more diagnostic: under-escalation, wrong-topology selection and budget overrun become different failure classes instead of one generic routing error.

## Evidence claims

### E1 — source-reported-claim

**Claim:** In the controlled OmniMath setting, baseline-failure prediction reaches 0.8847 AUROC and 0.895 AUPRC on 4,151 parseable examples.

**Source:** arXiv:2608.14927 as captured in the same-date Reading Note.

**Strength:** reports. **Independent:** false; primary-study evidence.

### E2 — source-reported-claim

**Claim:** Protocol-specific value prediction is substantially weaker in the reported experiments, with AUPRC 0.1674 for PER-first value and 0.1041 for Broadcast-only value.

**Source:** same primary study.

**Strength:** reports. **Independent:** false.

### E3 — source-reported-claim

**Claim:** More aggressive routing generally trades higher solve rates for higher token consumption and over-escalation, while conservative routing saves cost but leaves some beneficial escalations unused.

**Source:** same primary study and matched protocol outcomes summarized by Reading.

**Strength:** reports. **Independent:** false.

### E4 — public-fact

**Claim:** The study compares Baseline, Single, planner–executor–reviewer collaboration, and Broadcast while holding the underlying solver fixed in its main matched dataset, and its retrospective oracle observes realized outcomes and is therefore not a deployable router.

**Source:** study design captured in the same-date Reading Note.

**Strength:** states. **Independent:** false.

### E5 — our-observation

**Claim:** The evidence separates three questions that a single confidence score cannot be assumed to answer with the same quality: whether to consider escalation, which topology has incremental value, and whether its cost is admissible.

**Source:** analytical comparison of E1–E4.

**Strength:** observed. **Independent:** false.

### E6 — our-interpretation

**Claim:** A governed runtime should assign separate evidence identities to failure-risk admission, protocol-value routing and budget admission, and should fail visibly into a bounded fallback when protocol-value evidence is insufficient.

**Source:** bounded synthesis from the controlled evidence.

**Strength:** supports. **Independent:** false.

## Contradictions and counterarguments

A practical router may combine all three decisions in one learned policy. That implementation choice does not remove the governance distinction. Even a unified model should expose enough evidence to determine whether a failure came from risk estimation, candidate ranking or budget policy.

One could also argue that an expensive fixed protocol is acceptable when quality dominates cost. The study does not rule out that policy for a bounded high-value domain. It does show that the policy should be explicit: “always Broadcast” is a resource-governance decision, not a conclusion implied merely by uncertainty.

The strongest failure detector in the study is post-answer and therefore benefits from information unavailable before the initial answer exists. It cannot be treated as proof that a production pre-execution router can achieve the same discrimination.

## Bounded research judgment

The strongest reusable conclusion is: **failure-risk admission, protocol-specific collaboration value, and budget admission are separate evidence problems.** A high-confidence prediction that the current path will fail does not establish which multi-agent protocol will help, and a protocol predicted to help does not by itself authorize its cost.

The primary study makes this distinction visible with matched protocol outcomes and explicit token accounting. It does not establish universal routing thresholds, enterprise cost functions, causal explanations for topology success, or a production-ready collaboration policy.

## General implications

- Record escalation risk separately from protocol recommendation.
- Bind protocol recommendations to a task/model/protocol identity rather than treating “multi-agent” as one homogeneous capability.
- Require explicit budget admission for expensive collaboration.
- Define a deterministic fallback for weak protocol-value evidence.
- Evaluate under-escalation, wrong-topology routing and resource overrun as separate failure modes.
- Recalibrate routing when the model, task distribution, tools or protocol family changes.
- Keep human-review cost, latency and external tool cost separate from token count when moving beyond the study setting.

## Limitations and open questions

The evidence is an arXiv primary-research preprint centered on competition-level mathematics, one principal solver family and targeted breadth checks. It does not prove transfer to software engineering, operations, research or enterprise workflows. Reported token counts are study-specific and are not product prices. Each matched condition does not provide a complete stochastic characterization of repeated generations, and the retrospective oracle uses outcome information unavailable to a real router.

Open questions include which production-time features predict protocol-specific value without outcome leakage, whether structured failure classes outperform scalar confidence, how to price latency/parallelism/tool calls/human review, and when escalation into a materially broader collaboration scope should require its own authorization receipt.

## Editorial recommendation

- **Article type:** technical-analysis
- **Selected modules:** research-question; controlled-evidence; mechanism; failure-modes; governance-implications; counterarguments; limitations; open-questions
- **Ending module:** open-questions
- **Project relevance:** none
