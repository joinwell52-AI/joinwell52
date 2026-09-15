---
date: "2026-09-15"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260915-02
column: open-source-engineering
article_type: engineering-insight
project_relevance: none
source_reading: "research/reading/Q-20260915-02-detection-retry-recovery-attribution.md"
---

# Research Analysis — Recovery Needs Phase-specific Evidence, Not One Success Rate

## Research question

When an Agent workflow recovers after an initial failure, which facts must remain separate before the system can claim that recovery was effective, correct and safe rather than merely successful on a later attempt?

## Research themes and subject kind

- Research themes: failure detection; recovery routing; bounded retry; feedback value; acceptance evidence; retry budget; side-effect safety; authorization continuity.
- Subject kinds: `benchmark-result`, `research-finding`, `architecture-mechanism`, `failure-mode`.
- Primary sample: LAST-CQ with 2,471 live-database queries across six model backbones.

The research subject is not whether retry is useful. It is whether **detection, correction, acceptance and effect safety can be measured and governed as different phases** instead of being compressed into a single recovery percentage.

## Evidence identities

### E1 — public research fact

**Identity:** `public-fact`.

**Claim:** LAST-CQ decomposes text-to-Cypher work into deterministic schema parsing, initial generation, execution-grounded validation, correction and execution, with one bounded correction attempt after detected failure.

**Source:** same-date source-complete Reading Note based on arXiv:2609.12746.

**Strength:** direct description of the primary study. **Independent:** false.

### E2 — recovery result

**Identity:** `source-reported-claim`.

**Claim:** Across six evaluated backbones, the paper reports a 91.7% unweighted mean recovery rate for single-pass failures entering correction and a 93.8% pooled recovery rate.

**Strength:** strong bounded evidence that execution-grounded failure detection plus explicit correction routing can rescue many initial failures in this structured environment. **Independent:** false.

### E3 — feedback ablation

**Identity:** `source-reported-claim`.

**Claim:** Replacing synthesized grounded feedback with raw database errors changes aggregate exact-match only slightly, while the study attributes much of the observed recovery value to detecting failure, entering correction and permitting another grounded attempt.

**Strength:** causal evidence inside the benchmark that richer feedback narrative is not the dominant contributor there; not a general claim for ambiguous semantic failures. **Independent:** false.

### E4 — equal-budget comparison

**Identity:** `source-reported-claim`.

**Claim:** Equal-budget Best-of-3 parallel sampling performs worse than the execution-grounded iterative path on the reported models, showing that extra attempts are not equivalent to a recovery loop that receives target-environment failure evidence.

**Strength:** bounded comparative evidence for the evaluated generation/selection setup. **Independent:** false.

### E5 — acceptance limitation

**Identity:** `public-fact`.

**Claim:** Non-empty execution is not semantic correctness, and the model judge is measurably optimistic relative to human calibration. Recovery rates also vary sharply by failure category, and one backbone can show high recovery while aggregate quality still regresses on another metric.

**Strength:** direct negative evidence against treating retry success as comprehensive quality proof. **Independent:** false.

### E6 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** A governed recovery record should preserve separate evidence for `failure detection`, `recovery routing`, `correction input`, `retry budget`, `acceptance`, and `external effect reconciliation`. A later successful attempt cannot retroactively prove that every earlier phase was correct.

**Strength:** architectural inference supported by E1–E5. **Independent:** false.

### E7 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** Recovery policy should be conditioned on failure class and effect risk. Observable, side-effect-free failures can admit cheap bounded retry; ambiguous or state-changing failures require stronger acceptance and effect evidence before replay.

**Strength:** engineering judgment consistent with the benchmark's heterogeneous failure recovery and explicit scope limits. **Independent:** false.

### E8 — open question

**Identity:** `open-question`.

**Claim:** The study does not establish exactly-once behavior, idempotency, compensation, business authorization continuity or cross-domain transfer to browsers, APIs and general state-changing tools.

## Failure / Finding / Mechanism / Implication

### Failures

1. **Detection-success collapse:** a later successful output is treated as proof that the system correctly identified the original failure.
2. **Retry-success collapse:** a retry that executes is treated as proof of semantic correctness.
3. **Reflection inflation:** richer explanatory text is assumed to be the causal source of recovery without component-level evidence.
4. **Budget blindness:** sequential correction and parallel resampling are counted as equivalent because they consume a similar number of model calls.
5. **Failure-class blindness:** a global retry policy ignores that schema, runtime, syntax and type errors have very different observed recoverability.
6. **Effect duplication:** the first attempt may already have changed an external system, but the retry policy assumes failure means no effect occurred.
7. **Authorization carryover:** technical failure and retry are assumed to preserve current business authority automatically.
8. **Acceptance weakness:** execution success substitutes for a stronger semantic or safety acceptance gate.

### Findings

LAST-CQ provides unusually useful evidence because it separates components of the recovery loop rather than presenting “self-correction” as one opaque capability. In its structured database setting, a large share of failed first attempts can be recovered after execution-grounded detection and one bounded correction attempt.

The feedback ablation narrows the causal interpretation. Elaborate synthesized feedback is not necessary to obtain most of the reported aggregate benefit in this environment; raw target-environment error information is nearly as effective. The engineering consequence is not “reflection is useless.” It is that recovery mechanisms should be measured component by component before a runtime pays complexity and latency for richer reasoning loops.

The equal-budget sampling result strengthens that point. More attempts without causal failure evidence can perform worse than a smaller number of attempts connected by a grounded correction path.

At the same time, the study's acceptance boundary prevents overclaiming. Executability, exact-match, text-similarity and model-judge assessment are different evidence identities. A high recovery rate can coexist with quality regression on another metric or with failure classes that remain almost unrecoverable.

### Mechanism

A governed runtime can materialize a **phase-separated recovery record**.

**Detection evidence**

- failed operation/attempt identity;
- verifier/environment that detected failure;
- raw failure evidence;
- confidence and observability boundary.

**Recovery-routing decision**

- retry, repair, compensate, escalate, abandon or request human review;
- policy version;
- failure-class identity;
- authority for the chosen recovery mode.

**Correction input**

- raw error/environment evidence;
- optional synthesized diagnosis or reflection;
- provenance of every added fact;
- explicit distinction between observed error and model interpretation.

**Retry budget**

- attempt number and maximum;
- sequential versus parallel strategy;
- cost/time budget;
- reason for further attempts.

**Acceptance evidence**

- execution result;
- semantic correctness check where available;
- policy/safety gate;
- evaluator identity and uncertainty.

**Effect reconciliation**

- operation identity;
- whether the prior attempt produced an external effect: `Absent`, `Present`, `Compensated` or `Unknown`;
- idempotency key or effect receipt when supported;
- compensation or human decision when effects are uncertain.

A terminal `Recovered` status should summarize these facts, not replace them.

### Implication

The cheapest useful recovery loop may be simpler than a full reflection architecture when the environment already exposes high-quality failure evidence. Runtimes should therefore establish the detection and acceptance contracts first, measure how much one bounded retry recovers, and add richer diagnosis only for failure classes where evidence shows additional value.

For consequential tools, the ordering changes. Effect reconciliation and current authorization may be prerequisites to retry rather than post-hoc logging. A system that can correct a query is not thereby authorized to replay an external write.

## Comparison and contradictions

A common assumption is that more reasoning between attempts should monotonically improve recovery. The feedback ablation contradicts that assumption in this structured domain: richer grounded feedback changes aggregate exact-match only slightly.

Another assumption is that a larger sampling budget is a substitute for feedback. The equal-budget Best-of-3 comparison contradicts that too. Attempts linked by causal environment evidence can outperform independent extra samples.

But the benchmark also contradicts an overly optimistic retry narrative. Recovery differs dramatically by failure class, and a high failure-recovery percentage does not guarantee improved aggregate quality on every backbone or metric.

The safest generalization is therefore structural: **measure recovery phases separately and preserve their evidence identities**. The absolute recovery percentages should remain bounded to the evaluated text-to-Cypher setting.

## Bounded research judgment

**Agent recovery should be represented as a sequence of separately evidenced phases: detection, recovery routing, correction, retry budget, acceptance and effect reconciliation. In structured executable domains, reliable failure signals plus one bounded grounded retry may capture much of the recoverable value; richer reflection should earn its complexity through measured incremental benefit.**

This judgment does not authorize blind retries. State-changing or ambiguous failures require explicit evidence about prior effects and current authority before replay.

## General implications

- benchmark detection quality separately from retry success;
- stratify recovery by failure class instead of publishing one global percentage;
- compare raw-environment feedback with synthesized reasoning before adding reflection complexity;
- keep sequential correction distinct from equal-budget parallel sampling;
- use an acceptance gate stronger than “the tool returned something” when semantics matter;
- bind every attempt to a stable operation identity;
- require effect reconciliation before retrying state-changing actions when the prior effect is uncertain;
- re-check business authorization at the action boundary rather than inheriting it from the failed attempt;
- preserve model/evaluator uncertainty instead of promoting a recovery label into proof of correctness.

## Limitations and counterarguments

The primary evidence is text-to-Cypher over Neo4j. Its explicit schema and executable validation make failures more observable than many browser, document, negotiation or planning tasks. Richer diagnostic reasoning may provide more value when errors are latent or semantic.

Some variants are counterfactual rescoring rather than independently executed systems. The model judge is not ground truth, and cross-engine, production latency and token-cost evidence are incomplete. The study also does not model arbitrary side-effecting tools or exactly-once recovery.

Phase-separated telemetry adds state and implementation cost. For low-risk, read-only tools a simpler retry policy may be sufficient. The stronger contract matters when failures can create duplicate effects, change authority, or produce plausible-but-wrong outputs.

## Open questions

1. Which failure classes have deterministic enough evidence for automatic bounded retry?
2. What acceptance checks best detect executable-but-semantically-wrong recovery?
3. When does synthesized diagnosis provide measurable incremental value beyond raw environment errors?
4. How should retry budgets vary with failure class, cost and effect risk?
5. What evidence is sufficient to classify a previous external effect as absent versus unknown?
6. How should recovery telemetry represent uncertain causal attribution without blocking useful automation?

## Editorial recommendation

- **Article type:** engineering-insight
- **Selected modules:** research-question; benchmark-evidence; recovery-component-ablation; phase-separated-recovery-record; side-effect-boundary; comparison; limitations; open-questions
- **Core proposition:** recovery is a sequence of separately evidenced phases, and richer reflection should be justified by measured incremental value
- **Project relevance:** none
