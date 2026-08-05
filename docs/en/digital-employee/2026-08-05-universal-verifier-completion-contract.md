---
title: Digital Employee Academic Observation 002 — Completion Is a Claim, Not an Accepted State
date: '2026-08-05'
column: digital-employee
category: academic
summary: Microsoft Research’s Universal Verifier shows why a computer-use Digital Employee should submit separately inspectable process, outcome, failure and side-effect evidence before an independent authority accepts completion.
sources:
  - Microsoft Research and arXiv paper 2604.06240
  - Microsoft Research technical article
  - microsoft/fara Universal Verifier implementation
  - microsoft/CUAVerifierBench dataset card
outline: deep
---

<ArticleCover
  image="/assets/covers/academic-universal-verifier.svg"
  kicker="Digital Employee · Academic Observation 002"
  title="Completion Is a Claim, Not an Accepted State"
  summary="A worker may claim completion; an independent verifier and acceptance authority decide whether the claim becomes durable truth."
  version="DA002"
  status="Academic Runtime V5 · 2026-08-05"
  languageHref="/zh/digital-employee/2026-08-05-universal-verifier-completion-contract"
  languageLabel="简体中文"
/>

## Summary

Microsoft Research’s April 2026 preprint **The Art of Building Verifiers for Computer Use Agents** studies a difficult question at the center of computer-use automation: how can a system determine whether an Agent actually completed a task when the trajectory is long, visual, environment-dependent, and vulnerable to unsupported success claims?

The paper presents a **Universal Verifier** and a human-labeled benchmark, **CUAVerifierBench**. Its central design separates process quality from outcome attainment, distinguishes controllable from uncontrollable failures, builds task-specific non-overlapping rubrics, and retrieves screenshot evidence criterion by criterion instead of treating the last screen or the Agent’s final answer as sufficient proof.

The Research Center judgment is:

> Completion should enter a Digital Employee runtime as a versioned claim. It should become an accepted state only after independent process, outcome, failure and side-effect checks have been evaluated under an explicit authority policy.

This supports adopting a completion-evidence contract. It does **not** justify adopting Microsoft’s full verifier implementation wholesale, and it does not prove transactional safety, enterprise incident reduction, or reliability outside web computer-use tasks.

## Primary research object

The primary object is the paper, not an ordinary product announcement:

- **Title:** The Art of Building Verifiers for Computer Use Agents
- **Authors:** Corby Rosset, Pratyusha Sharma, Andrew Zhao, Miguel Gonzalez-Fernandez, Ahmed Awadallah
- **Institution:** Microsoft Research, with Browserbase participation
- **Release:** arXiv v1, 5 April 2026; Microsoft Research article published 21 April 2026
- **Open artifacts:** Universal Verifier implementation and CUAVerifierBench

The object entered the current Runtime queue as `Q-20260805-12`, originating from Published Research Intelligence signal `SIG-20260805-R-003`. It was selected because false-positive completion is a bounded governance problem for Digital Employees, TMPA evidence, and CodeFlowMu completion gates.

## What the Universal Verifier changes

A conventional task judge often tries to answer one binary question: **did the Agent succeed?** The paper argues that this compresses several different judgments into one label.

The Universal Verifier instead models verification as a structured output:

```text
process score
+ outcome decision
+ diagnostic failure report
= verifier judgment
```

### 1. Rubrics must be specific and non-overlapping

The rubric is generated from the task before the trajectory is shown to the scoring stage. This separation reduces the risk that criteria are invented to rationalize the Agent’s observed behavior.

The authors identify recurring rubric failures:

- **phantom criteria:** grading requirements the user never requested;
- **cascading penalties:** one upstream error causes repeated downstream deductions;
- **behavior-conditioned criteria:** criteria are adapted after seeing the trajectory;
- **unresolved conditional criteria:** mutually exclusive requirements remain active together.

The paper reports that improved rubric design accounted for roughly half of the observed Cohen’s kappa gain during iterative development. This matters because a powerful scorer cannot reliably repair a defective measurement contract downstream.

### 2. Process and outcome are independent signals

The process score evaluates how well the Agent executed applicable sub-goals. The outcome decision asks whether a reasonable user would regard the requested end state as achieved.

They may disagree legitimately:

- an Agent follows the correct process but is blocked by a CAPTCHA or unavailable inventory;
- an Agent reaches the requested outcome through an unexpected valid route;
- an Agent produces a plausible final answer but skipped required actions;
- an Agent completes the visible goal while causing an unsolicited side effect.

For a Digital Employee, this distinction prevents two opposite errors: accepting effort as completion, or treating an environment-caused blocker as evidence of worker misconduct.

### 3. Failure responsibility is a first-class result

The verifier separates factors under the Agent’s control from factors outside it.

Controllable failures include intent mismatch, reasoning errors, hallucinations, insufficient effort, execution mistakes, and invalid tool interaction. Uncontrollable failures include login walls without credentials, CAPTCHAs, infrastructure failure, unavailable entities, sold-out inventory, and the absence of matching results.

This classification is not merely explanatory. It affects process scoring, retry policy, escalation, and whether the system should improve the worker, repair the environment, request authority, or terminate the task.

### 4. Evidence retrieval is criterion-specific

Long trajectories can contain hundreds of screenshots. Passing all frames into one prompt produces a needle-in-a-haystack problem; inspecting only the last frames can miss critical evidence.

The Universal Verifier creates a screenshot-by-criterion relevance matrix. For each rubric criterion, it selects the most relevant screenshots, extracts evidence, resolves conditional criteria, performs a reality check, and then rescores the rubric. Screenshot evidence takes precedence over the Agent’s own completion statement.

This is an important architectural pattern: evidence should be indexed against claims, not merely accumulated in a chronological log.

![Completion claim, independent verifier, acceptance gate and accepted state](/assets/covers/academic-universal-verifier.svg)

*Diagram: joinwell52 Research Center synthesis of the paper’s verifier boundary and the proposed Digital Employee acceptance boundary.*

## Experimental evidence

The paper evaluates verifier–human agreement on two paper-era splits:

| Measure | Internal, n=140 | Browserbase OM2W, n=106 |
|---|---:|---:|
| Universal Verifier outcome Cohen’s κ | 0.64 | 0.58 |
| WebJudge outcome Cohen’s κ | 0.44 | 0.26 |
| WebVoyager outcome Cohen’s κ | 0.31 | 0.13 |
| Universal Verifier outcome false-positive rate | 0.01 | 0.08 |
| WebJudge outcome false-positive rate | 0.22 | 0.40 |
| WebVoyager outcome false-positive rate | 0.45 | 0.60 |
| Universal Verifier process Cohen’s κ | 0.59 | 0.43 |

The external false-positive rate is **8 percent**, so “near zero” must not be interpreted as literal zero. The result is nevertheless materially lower than the evaluated baselines.

The paper also upgrades baseline verifier backbones to GPT-5.2. A stronger model reduces false positives in some settings, but increases false negatives and produces only modest overall kappa improvement. The authors therefore attribute the main advantage to the verifier architecture rather than model substitution alone.

The Browserbase human inter-annotator ranges were reported as 0.53–0.57 for outcome and 0.36–0.45 for process. The Universal Verifier’s agreement falls within those ranges, which supports the bounded statement that it agrees with humans about as often as the annotators agree with one another. It does not establish that either humans or the verifier are an objective oracle.

### Version note

The paper reports an internal experimental split of 140 trajectories. The currently published Hugging Face dataset card lists 154 internal trajectories and 106 Browserbase trajectories. Results must therefore be bound to the exact paper, dataset configuration, split and release rather than described as timeless properties of “CUAVerifierBench.”

## Why the result is architectural

The paper’s most transferable insight is decomposition, not a specific prompt or model:

```text
worker claim
→ claim-specific evidence retrieval
→ process assessment
→ outcome readback
→ failure and side-effect classification
→ policy/authority decision
→ accepted completion receipt
```

A Digital Employee should not be both claimant and final acceptor. The worker may produce a completion claim, evidence references, and a proposed status. An independent verifier should evaluate those claims. A policy or authorized human should retain the ability to accept, reject, escalate, or leave the result undetermined.

This mirrors a separation-of-duties principle:

- **Worker:** performs the operation and submits evidence.
- **Verifier:** evaluates evidence against a versioned contract.
- **Acceptor:** applies business authority and risk policy.
- **Runtime:** records all judgments without erasing disagreement.

## Proposed completion evidence contract

A reusable runtime projection could be:

```yaml
completion_claim:
  claim_id:
  work_order_id:
  operation_node_id:
  claimant:
  requested_outcome:
  rubric_version:
  process_evidence_refs: []
  outcome_evidence_refs: []
  deterministic_checks: []
  learned_verifier_result:
  failure_class:
  controllability:
  side_effect_assessment:
  verifier_identity:
  verifier_version:
  acceptance_authority:
  acceptance_decision: accepted | rejected | escalated | undetermined
  accepted_at:
  completion_receipt_ref:
```

The portable contract should reference raw screenshots, traces and business-system readbacks rather than embedding all sensitive evidence directly. Retention, privacy and access controls belong to governed evidence storage.

## What should remain independent

A consequential Digital Employee runtime should compose at least three verification surfaces:

1. **Deterministic checks** — database readback, file hash, workflow status, balance, record existence, or application state.
2. **Learned verification** — trajectory interpretation, screenshot evidence, intent alignment, failure diagnosis, and side-effect detection.
3. **Human or policy acceptance** — authority for irreversible, ambiguous, regulated, or high-impact work.

These checks may disagree. The runtime should preserve the conflict instead of forcing an immediate binary answer. `Undetermined` or `Needs Human Acceptance` is safer than manufacturing `Completed`.

## Limitations and counter-evidence

The publication gate must retain the following boundaries:

- The source is an arXiv preprint and official research publication, not a final peer-reviewed archival result.
- The paper’s human-labeled datasets are small.
- The Browserbase split contains trajectories from one Agent, Fara-7B; transfer to other Agents is not established.
- The work is restricted to web computer-use trajectories.
- Human labels are judgments, not an objective completion oracle.
- The Universal Verifier is a large bundled system of code and prompts; independent transfer value is not proven for every component.
- The paper does not demonstrate rollback, compensation, idempotency, persistent-session recovery, delayed side-effect detection, or transactional guarantees.
- Cost, latency, privacy, screenshot retention, and enterprise access boundaries are not resolved.
- The current dataset card warns that the 106-task external corpus is relatively small and inherits Online-Mind2Web’s temporal and domain biases.

## Engineering impact

### TMPA

No TMPA Core change is justified by one paper. A profile or projection may later represent claimant, verifier, acceptor, evidence contract, process judgment, outcome judgment, failure class and conflicting decision. The portable protocol should carry references and deterministic semantics, not vendor-specific verifier prompts.

### Digital Employee

Each consequential Operation Node should emit a completion claim rather than directly writing accepted completion. Position and WorkOrder definitions should specify expected business outcome, verifier requirements, acceptance authority, prohibited side effects, retry policy and escalation rules.

Uncontrollable failure should remain distinct from worker failure. A correct process blocked by missing credentials or unavailable inventory is not successful work, but it is also not equivalent to hallucination or negligent execution.

### CodeFlowMu

The immediate engineering step is a durable **completion receipt projection**, not a general visual verifier. CodeFlowMu can first compose:

- deterministic post-action readback;
- versioned evidence references;
- optional learned verification;
- QA/EVAL or ADMIN acceptance;
- explicit conflict and escalation states;
- commit and artifact verification before terminal completion.

A worker’s last action, final message, or screenshot should never alone move a consequential task to `done`.

## Publication judgment

The evidence supports this bounded adoption:

> Adopt the separation pattern—claim, process evidence, outcome evidence, failure attribution, independent verification and authority-based acceptance. Do not treat the reported Universal Verifier as a universal production guarantee.

The paper provides strong evidence that binary self-reported completion is structurally inadequate. It provides medium-strength evidence that rubric-grounded visual verification can transfer into broader Digital Employee systems. It provides weak evidence about enterprise incident reduction, non-web work and transactional safety.

## References

1. Rosset et al., **The Art of Building Verifiers for Computer Use Agents**, arXiv: https://arxiv.org/abs/2604.06240
2. Full experimental HTML: https://arxiv.org/html/2604.06240
3. Microsoft Research publication: https://www.microsoft.com/en-us/research/publication/the-art-of-building-verifiers-for-computer-use-agents/
4. Microsoft Research technical article: https://www.microsoft.com/en-us/research/articles/the-art-of-building-verifiers-for-computer-use-agents/
5. Universal Verifier implementation and Fara repository: https://github.com/microsoft/fara
6. CUAVerifierBench dataset card: https://huggingface.co/datasets/microsoft/CUAVerifierBench
7. Runtime queue object: https://github.com/joinwell52-AI/joinwell52/blob/main/research/runtime/plans/2026/08/2026-08-05-plan.json
