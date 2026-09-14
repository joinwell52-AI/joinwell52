---
date: "2026-09-14"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260914-03
column: open-source-engineering
article_type: research-interpretation
project_relevance: none
source_reading: "research/reading/Q-20260914-03-trace-level-failure-attribution-evidence.md"
---

# Research Analysis — Trace Attribution Is Evidence, Not Causality

## Research question

What structured execution evidence does an independent evaluator need to distinguish trustworthy execution from unsafe success, and what can stage-level trace attribution establish without being enlarged into proof of root cause, authorization or production safety?

## Research themes and subject kind

- Research themes: trace-level observability; failure attribution; evaluator independence; unsafe success; causal limits; audit evidence.
- Subject kinds: `research-finding`, `benchmark-result`, `governance-problem`, `architecture-mechanism`.
- Primary sample: AgentAudit lifecycle trace evaluation across five models and nine capability/adversarial tasks.

The research subject is not one audit score. It is the boundary between an observed execution event, an evaluator's classification and a causal or responsibility claim.

## Evidence identities

### E1 — public research fact

**Identity:** `public-fact`.

**Claim:** AgentAudit evaluates recorded traces across ten lifecycle dimensions: instruction integrity, planning, memory, tool selection, tool invocation, tool correctness, alignment, tool faithfulness, security and execution integrity.

**Source:** same-date source-complete Reading Note based on arXiv:2609.09875.

**Strength:** direct framework description. **Independent:** false.

### E2 — research result

**Identity:** `source-reported-claim`.

**Claim:** Across five models and nine capability/adversarial tasks, the reported evaluations reveal substantial differences in trust classification, including unsafe compliance that final task completion alone would not expose.

**Strength:** primary study result for the evaluated tasks and judge configuration. **Independent:** false.

### E3 — negative evidence

**Identity:** `source-reported-claim`.

**Claim:** All traces are scored by one fixed judge model, which is also among the evaluated models, so measurements share correlated evaluator assumptions and calibration risk.

**Strength:** explicit limitation of the study. **Independent:** false.

### E4 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** A trustworthy audit must keep observed event facts, evaluation judgments and causal/responsibility claims as separate evidence layers.

**Strength:** architectural inference supported by E1–E3. **Independent:** false.

### E5 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** Stable trace identities for plans, memory access, tool selection, invocation, results, authorization and external effects let an evaluator locate the first visible violation without granting it authority to rewrite durable facts.

**Strength:** bounded design recommendation; not directly benchmarked as a production protocol. **Independent:** false.

### E6 — open question

**Identity:** `open-question`.

**Claim:** The accessible evidence does not establish robust inter-rater agreement, production false-positive/false-negative rates, causal correctness of every attribution or calibration across changing models and domains.

## Failure / Finding / Mechanism / Implication

### Failures

1. **Completion-only evaluation:** two runs receive the same score although one violated policy or used an unsafe tool path.
2. **Unsafe success:** the intended artifact exists, but the trajectory includes unauthorized or unfaithful behavior.
3. **Unobservable cause:** a relevant memory, authorization or external fact was never captured, so the evaluator attributes the first visible anomaly rather than the true upstream cause.
4. **Judge monoculture:** one evaluator's systematic bias appears as objective stage truth.
5. **Attribution escalation:** an associated stage is reported as the root cause or responsible actor without corroborating evidence.
6. **Score-as-authority:** a high trust score is treated as current permission to advance a lifecycle state.
7. **Model explanation contamination:** generated rationales are stored beside event facts without clear identity boundaries.

### Findings

Final task success is too coarse to characterize trustworthy execution. The primary study's lifecycle decomposition makes unsafe compliance and stage-associated problems visible even when end-task behavior looks similar.

The trace changes the unit of evidence from an outcome to a trajectory. It can preserve what the Agent planned, remembered, selected, invoked and observed, and it gives the evaluator a structured surface for classification.

Granularity, however, is not independence. A single fixed judge creates correlated assumptions. A trace can also omit the very fact needed for causal explanation. Stage attribution should therefore be treated as a bounded judgment about visible evidence, not automatic ground truth.

### Mechanism

A governed audit architecture can preserve three non-interchangeable layers:

**Observed-event layer**

- immutable event identity and timestamp;
- actor, model, tool and target identity;
- request and result digest;
- authorization or policy evidence actually presented;
- external-effect receipt where applicable.

**Evaluation layer**

- evaluator identity, model/version and prompt;
- trace schema version and examined event range;
- per-dimension classification and confidence;
- known-positive and known-negative calibration cases;
- disagreement and adjudication records.

**Causal/responsibility layer**

- explicit hypothesis or reviewed finding;
- supporting and contradicting evidence;
- missing variables and alternative causes;
- human or independent reviewer identity when required;
- bounded remediation decision.

The evaluation layer may reference observed events but must not mutate them. Multiple judges or deterministic rules can provide additional perspectives, but disagreement should remain visible rather than averaged into false certainty.

### Implication

For auditable Agent runtimes, a terminal state should report both outcome and execution quality. “Completed” says the result exists; it does not say the process was authorized, faithful or safe.

Stage attribution is valuable because it narrows investigation and remediation. It should trigger further review or targeted controls, not automatically assign organizational blame or authorize a lifecycle transition.

## Comparison and contradictions

Completion-only benchmarks are simple and reproducible, but they merge trustworthy success, unsafe success and lucky recovery. AgentAudit's trace dimensions contradict the assumption that one terminal bit is enough.

A granular audit can still be overtrusted. The single-judge limitation shows why more fields do not automatically create independent truth. Independence depends on evaluator identity, calibration, alternative hypotheses and access to authoritative external facts.

Retrospective evaluation also cannot recover evidence that was never captured. Better judgment cannot compensate for an incomplete trace.

## Bounded research judgment

**Trace-level observability and stage attribution are necessary to distinguish unsafe success from trustworthy execution, but attribution is an evaluation judgment, not proof of root cause, current authorization or production safety. A governed audit must preserve observed events, evaluator judgments and causal/responsibility claims as separate durable identities.**

The claim is strongest for tool-using agents whose planning, memory and external actions can be durably recorded. It remains bounded by trace completeness and evaluator calibration.

## General implications

- version the trace schema and preserve stable event identities;
- capture authorization evidence and external-effect receipts beside the relevant action;
- separate event facts from model-generated explanations;
- record evaluator identity, prompt, version and examined trace range;
- calibrate against known-positive and known-negative cases;
- retain disagreement between independent judges;
- treat stage attribution as an investigation input, not automatic blame;
- never convert a trust score into current execution authority;
- pair terminal outcome with faithfulness, safety and process-validity evidence.

## Limitations and counterarguments

Rich tracing increases cost, storage and privacy risk. The runtime should capture the minimum evidence needed for the task's risk class and protect sensitive inputs. Redaction, however, must preserve the identities required to understand what was evaluated.

Multiple evaluators do not guarantee independence if they share training data, prompts or framing. Deterministic checks can anchor some facts, but semantic violations may still require human or model judgment.

The study's model and task sample is small relative to production diversity. Its quantitative trust scores should not be generalized beyond the reported evaluation.

## Open questions

1. Which trace fields must be immutable facts rather than generated interpretation?
2. What calibration set exposes judge bias for a given domain?
3. How should conflicting stage attributions be reconciled without hiding disagreement?
4. What false-positive and false-negative rates are acceptable before automated remediation?
5. When must a human reviewer approve a causal or responsibility claim?
6. How can trace evidence remain inspectable while protecting credentials and personal data?
7. What minimum external-effect evidence is needed to evaluate unsafe success?

## Editorial recommendation

- **Article type:** research-interpretation
- **Selected modules:** research-question; unsafe-success-case; ten-dimension-evidence; three-layer-audit-model; attribution-versus-causality; evaluator-limit; engineering-implications; limitations; open-questions
- **Core proposition:** a trace can show where a visible failure emerged, but cannot by itself prove why it happened
- **Project relevance:** none
