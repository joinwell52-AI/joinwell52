# Q-20260915-02 — Recovery Evidence Should Isolate Detection, Retry and Feedback Value

- Runtime date: 2026-09-15 (Asia/Shanghai)
- Queue signal: SIG-20260915-004
- Primary research source: https://arxiv.org/abs/2609.12746
- Evidence level: `primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When an executable Agent workflow fails, how much of recovery comes from detecting the failure and retrying with bounded correction, how much comes from richer reflection or feedback, and what does that evidence imply—or not imply—for general Agent recovery design?

## Primary Mechanism

LAST-CQ studies text-to-Cypher generation against live Neo4j databases and decomposes the workflow into five roles: deterministic schema parsing, initial generation, deterministic/live validation, correction, and execution. Validation uses `EXPLAIN` plus bounded live execution with `LIMIT 1`; when a failure occurs, the system parses the error, checks it against the schema, can optionally synthesize grounded feedback, and gives the correction stage one bounded retry.

This decomposition is important because the paper evaluates several counterfactual variants rather than treating “reflection” as one indivisible capability. It asks whether recovery comes from the existence of an execution-grounded failure signal and another attempt, or from the sophistication of the explanatory feedback supplied to that attempt.

## Benchmark and Protocol

The evaluation contains 2,471 queries executed against live databases and uses six LLM backbones. The full `LAST-CQ+DB` path is compared with an independently executed single-pass baseline, while several internal variants are counterfactually rescored from the same execution traces. The paper distinguishes these comparison identities explicitly, which prevents a counterfactual arm from being misreported as an independently rerun system.

The pipeline uses a bounded call budget: generation consumes one model call, correction consumes one model call when needed, and validation itself is mostly deterministic. The authors report an average of roughly 3.14–4.19 pipeline stages per query, while many of those stages do not invoke an LLM.

## Recovery Evidence

Across six models, the paper reports a **91.7% unweighted mean recovery rate** for single-pass failures that enter the correction path; the pooled recovery rate across failures is **93.8%**. This is strong evidence that execution-grounded failure detection plus a bounded retry can rescue a large share of initially failed queries in this environment.

The aggregate full-versus-no-refinement counterfactual comparison shows a 12.3% gain, but the more conservative comparison against the independently executed single-pass baseline is much smaller: overall exact-match rises from 0.4587 to 0.4729, about a 3.1% relative improvement. The paper explicitly treats the true effect as bounded between these comparison styles rather than claiming the larger counterfactual number as an uncontested end-to-end causal gain.

The result also varies by failure class. In the reported correction set, schema violations recover much more often than syntax or type-mismatch failures. This is evidence that “retry works” is not a uniform mechanism: the recoverability of a failure depends on whether the system can produce a useful, grounded correction target.

## Feedback-content Counterfactual

One of the most useful findings is that replacing grounded synthesized feedback with raw database errors changes aggregate exact-match by only about one percentage point. In this benchmark, the main value therefore appears to come from **detecting that the first attempt failed, routing into correction, and permitting another grounded attempt**, rather than from making the feedback narrative substantially more elaborate.

This does not prove that rich feedback is generally useless. Text-to-Cypher has unusually explicit executable feedback and a structured schema. In domains where the failure is ambiguous, latent or semantic rather than syntactic/executable, richer diagnostic reasoning may matter more. The evidence is specific to this environment.

## Equal-budget Parallel Sampling

The paper also compares bounded iterative correction with a Best-of-3 parallel-sampling baseline using three independently sampled candidates and choosing the first non-empty result. Despite a comparable generation budget, Best-of-3 degrades GLEU by about 10.8% for GPT-4o-mini and 11.4% for GPT-4o relative to single-pass, and remains below the execution-grounded recovery pipeline.

This supports a narrow engineering claim: **additional samples are not equivalent to a recovery loop when the loop has access to failure evidence from the target environment**. More attempts without causal feedback can spend the same budget while making selection harder or amplifying weak candidates.

## Correctness and Evaluation Boundary

The execution convention itself is deliberately imperfect. A non-empty database result is treated as a successful execution signal, but non-empty output is not the same as semantically correct output. The paper therefore combines execution outcomes with exact-match, GLEU and model-judge evaluation.

The judge is also not neutral ground truth. On a 122-example human calibration set, three-way agreement is 64.8% with Cohen's kappa 0.48; collapsing to valid/invalid raises agreement to 82.8% with kappa 0.59. The primary judge labels roughly nine percentage points more cases as at least partially correct than humans. The paper consequently treats judge-based corpus figures as optimistic rather than exact truth.

This matters for Runtime interpretation: a recovery loop can prove that a query became executable without proving that it became semantically correct, safe, authorized or free of harmful side effects.

## Failure-category Evidence

The appendix reports heterogeneous correction behavior across failure categories. Among 239 corrected queries, schema violations recover at about 88% of 75 cases, runtime errors at about 49% of 119 cases, syntax errors at 0 of 31 cases, and type mismatches at about 8% of 13 cases. The exact distribution makes the recovery mechanism more informative than a single overall percentage.

One backbone, DeepSeek, also shows a small regression in aggregate GLEU under the full pipeline despite a reported recovery rate above 90%. This is negative evidence against treating “many failures recovered” as equivalent to “the whole system improved on every quality metric.”

## The Recovery Boundary

The evidence supports keeping at least five identities separate:

1. **Failure detection** — whether the target environment can establish that the current attempt failed.
2. **Recovery routing** — whether the workflow enters a retry/correction path rather than terminating or blindly resampling.
3. **Correction content** — what information the next attempt receives about the failure.
4. **Retry budget** — how many sequential or parallel attempts are permitted and at what cost.
5. **Acceptance evidence** — what proves that the recovered result is actually good enough to keep.

LAST-CQ provides strong evidence that stages 1 and 2 can carry much of the recovery value in a structured executable domain. It does not justify collapsing stage 5 into “the retry returned something.”

## Safety, Authorization and Exactly-once Boundary

The paper's recovery mechanism does not address general external side-effect safety. Text-to-Cypher evaluation is controlled around database queries and validation; the authors separately note the need for query-level access controls and result-scope limits.

A production digital employee may fail after an external write already occurred. Retrying such a tool call can duplicate an effect unless the runtime has operation identity, idempotency, effect reconciliation or compensation. Therefore the paper supports a claim about **task recovery after observable failure**, not a claim that arbitrary Agent actions are safe to retry.

Likewise, successful correction does not supply business authorization. A worker still needs current authority for the target action, even if the previous attempt failed for a purely technical reason.

## Cost and Operational Evidence

The paper gives stage counts and bounded model-call structure, but it does not report a systematic per-call token accounting or a production latency study across multiple database engines. The limitations explicitly leave large-scale cost/latency and transfer beyond the evaluated Neo4j setting for future work.

The benchmark spans 16 domains but one database family, so cross-engine claims to Memgraph, SQL systems, APIs, browsers or general software tools remain unproved.

## Evidence Classes

### Fact

LAST-CQ evaluates 2,471 live-database queries across six backbones, uses execution-grounded validation and one bounded correction attempt, and reports high recovery of initial failures.

### Experimental Result

Counterfactual removal of sophisticated grounded feedback changes aggregate exact-match only slightly, while equal-budget parallel Best-of-3 sampling performs worse than the grounded iterative path on the reported models. Recovery success also differs sharply by failure category.

### Inference

Before adding complex reflection machinery, an Agent runtime should separately measure whether reliable failure detection plus a bounded retry already captures most recoverable cases. Recovery components should be evaluated causally rather than bundled into one “self-correction” feature.

### Unknown

The source does not establish recovery safety for state-changing external tools, exactly-once effects, authorization continuity, generalization beyond the evaluated database setting, or production token/latency cost at scale.

## Limits and Negative Evidence

- The environment is text-to-Cypher over Neo4j; transfer to other tool domains is not established.
- Some reported variants are counterfactual rescoring, not independently executed arms.
- Non-empty execution is only an operational signal, not semantic truth.
- The model judge is measurably optimistic relative to human calibration.
- Recovery rates differ sharply across failure classes; syntax and type-mismatch failures remain difficult.
- One model shows aggregate quality regression despite a high recovery percentage.
- No systematic per-call token accounting or broad production latency comparison is reported.
- The study does not prove idempotency, exactly-once behavior, effect rollback, compensation or business authorization.

## Unresolved Questions

1. Which failure classes in general Agent runtimes have deterministic enough signals to support cheap bounded retry?
2. When does richer diagnostic feedback materially outperform raw tool or environment errors?
3. What acceptance gate should follow a retry when execution success is weaker than semantic correctness?
4. How should retry policy change when the failed action may already have produced an external side effect?
5. Should recovery budgets be conditioned on failure class, effect risk and evidence freshness rather than fixed globally?
6. How should cost and latency be measured when deterministic validation replaces some LLM reflection calls?

## Reading Conclusion

The source-complete evidence supports a bounded conclusion: **in an executable structured domain, much of recovery value can come from reliable failure detection, explicit recovery routing and a bounded retry, while more elaborate feedback may add little and equal-budget parallel sampling may perform worse**. The result argues for causal measurement of recovery components before adding reflection complexity. It does not prove that arbitrary Agent actions are safe to retry, that recovered outputs are semantically correct, or that authorization and external effects remain valid. Recovery, acceptance, authorization and side-effect safety must remain separate evidence identities.

This Reading Note performs evidence extraction only. It does not execute Research Analysis, article writing, visualization, Production or Publication.
