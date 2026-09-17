---
date: "2026-09-17"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260917-01
column: digital-employee
article_type: technical-analysis
project_relevance: none
source_reading: "research/reading/Q-20260917-01-replayable-memory-execution-eligibility.md"
---

# Research Analysis — Replay Eligibility Is a Fresh Execution-Time Fact

## Research question

When a digital employee has a historically successful executable memory for a workflow, what current evidence should be required before that memory may execute again, and which later decisions must remain separate from replay admission?

## Research themes and subject kind

- Research themes: replayable memory; provenance; execution-time state; target rebinding; parameter contracts; lifecycle governance; external-effect safety.
- Subject kinds: `research-finding`, `architecture-mechanism`, `governance-problem`, `failure-mode`.
- Primary sample: EchoPath and its replay-memory repository, compatibility gates, target re-aiming and lifecycle controls.

The research subject is not whether trajectory reuse saves tokens. It is whether **historical success can remain merely provenance while current execution eligibility is recomputed from fresh evidence**.

## Evidence identities

### E1 — source-reported performance result

**Identity:** `source-reported-claim`.

**Claim:** EchoPath reports 145/159 matched second-pass tasks completed (91.2%), with median 20,370 tokens and 127.5 seconds, compared with 91.8% success, 586,386 median tokens and 315.7 seconds for the reported Synapse planning-augmentation baseline.

**Strength:** primary experimental evidence that validated replay can retain comparable reported completion while sharply reducing repeated planning cost in the studied GUI setting. **Independent:** false.

### E2 — source-reported retrieval result

**Identity:** `source-reported-claim`.

**Claim:** The retrieval stress test reports 100% correct recall while the active repository was synthetically enlarged from 159 to 659 memories.

**Strength:** direct evidence about candidate retrieval in the experiment, but not evidence that retrieval confers execution authority. **Independent:** false.

### E3 — source-reported admission mechanism

**Identity:** `public-fact`.

**Claim:** EchoPath separates semantic retrieval from replay compatibility using lifecycle state, artifact validation, reasoning viability, action-schema compatibility, state preconditions, flexible-input contracts and a compatibility threshold. Direct replay can be rejected when state, target or mutation constraints fail.

**Strength:** mechanism evidence from the primary source. **Independent:** false.

### E4 — source-reported execution-time diagnostics

**Identity:** `source-reported-claim`.

**Claim:** In the reported diagnostics, the state gate accepted 49 compatible starts and 46 partially changed starts while rejecting 39 incompatible starts; declared flexible substitutions were accepted 50/50 and mutations of non-flexible fields rejected 50/50. Target re-aiming also explicitly rejected ambiguous cases.

**Strength:** direct evidence that eligibility is recomputed and may change after the original successful run. **Independent:** false.

### E5 — source limitation

**Identity:** `public-fact`.

**Claim:** The study is a GUI replay study. It does not establish authorization correctness, idempotency, exactly-once external effects, safe money/message/database mutations, target ownership, or compensation after an unknown side effect.

**Strength:** explicit transfer boundary. **Independent:** false.

### E6 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** A reusable procedure should be treated as a versioned capability artifact whose eligibility is leased by fresh evidence. Historical success proves lineage and prior validity; it should not permanently grant current execution eligibility.

**Strength:** architectural synthesis from E1–E5. **Independent:** false.

### E7 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** Replay admission, business authorization and effect verification are separate gates. Passing a procedure-level compatibility check may justify invoking the procedure, but it must not silently authorize the business effect or assert that the effect occurred exactly once.

**Strength:** governance recommendation bounded by the source limitations. **Independent:** false.

### E8 — open question

**Identity:** `open-question`.

**Claim:** The evidence does not establish how replay eligibility should expire after application upgrades, executor-model changes, tool-version changes, identity changes, or uncertain external effects.

## Failure / Finding / Mechanism / Implication

### Failures

1. **Similarity-as-authority:** semantic retrieval is treated as sufficient permission to replay.
2. **Historical-success inheritance:** a procedure remains executable indefinitely because it once succeeded.
3. **Stale environment binding:** application, screen, state or tool versions drift while the replay artifact remains unchanged.
4. **Ambiguous target reuse:** old coordinates or labels are treated as current target identity without fresh binding evidence.
5. **Unbounded parameter mutation:** a replay template allows substitutions beyond fields explicitly validated as flexible.
6. **Business-authority collapse:** procedure compatibility is mistaken for permission to perform the real-world action now.
7. **Effect-verification collapse:** successful tool invocation is treated as proof that the intended external state occurred exactly once.

### Findings

The strongest evidence is the architecture of the admission path, reinforced by the diagnostic results. EchoPath does not make the retrieved memory executable merely because intent similarity is high. It checks lifecycle and validation state, action compatibility, current state, target evidence and parameter constraints, then rejects or repairs incompatible cases.

The reported diagnostics show why this distinction matters. Compatible, partially changed and incompatible starts do not collapse into one inherited replay state. Flexible inputs are an explicit contract, and ambiguous targets can revoke direct replay. Thus a memory's usefulness can persist while its immediate execution eligibility changes from run to run.

The performance result adds a separate point: execution-level reuse can be economically meaningful. The architecture therefore cannot solve safety by simply refusing all replay. It needs a bounded admission layer that preserves reuse value while making current eligibility inspectable.

### Mechanism

A durable replayable-procedure record can preserve six distinct identities.

**Memory artifact identity**

- stable memory/procedure ID;
- source trajectory or attempt ID;
- producing executor/tool/environment versions;
- content and action-schema digest;
- lineage, branch, repair, merge, deprecation and quarantine state.

**Validation identity**

- validator/evaluator identity;
- validation epoch and evidence references;
- supported action primitives;
- approved state contract and flexible parameter schema.

**Current compatibility evidence**

- current application/tool identity and version;
- state-precondition observations;
- current target-binding evidence;
- ambiguity/confidence signals;
- current parameter values checked against the flexible-input contract.

**Replay admission**

- decision: admitted / repair-required / rejected;
- evidence generation used by the decision;
- expiry or freshness boundary;
- reason for denial or fallback.

**Business authorization**

- actor/role and consumer scope;
- current action authority;
- target ownership/scope;
- approval generation or policy version.

**Effect verification**

- idempotency or operation identity where available;
- authoritative postcondition probe;
- effect state such as present / absent / compensated / unknown;
- retry eligibility derived from effect evidence rather than worker memory.

The key architecture is that the first four can make a replayable procedure executable while the last two can still deny or withhold a consequential external action.

### Implication

A digital employee should not store “successful workflow” as a permanent executable truth. It should store a reusable artifact plus the evidence necessary to **re-qualify that artifact for this run**. The more consequential the effect, the more important it is that replay admission cannot substitute for business authorization or effect reconciliation.

This creates a practical separation between efficiency and authority: retrieval decides what may be useful; compatibility decides what can be instantiated; authorization decides what may have effect; verification decides what actually happened.

## Comparison and contradictions

A common memory architecture treats retrieved procedures as trusted few-shot context and lets a planner decide whether to follow them. EchoPath is stronger on one narrow dimension because the replay object has explicit admission and state contracts. But its GUI compatibility layer is not a complete business-governance layer.

A counterargument is that a sufficiently capable planner can notice stale context and re-plan. That may improve success, but it makes eligibility depend on model judgment and loses a durable denial reason. Explicit compatibility evidence is valuable precisely because it can remain inspectable when the planner is wrong.

Another counterargument is that aggressive invalidation defeats the economics of reusable memory. The source results suggest the opposite design goal: keep reusable artifacts durable, but make eligibility a fresh fact. Deprecation and quarantine need not delete lineage or learning value.

## Bounded research judgment

**Replay eligibility is a fresh execution-time fact, not a permanent property inherited from semantic similarity or historical success. A durable digital employee should bind reusable procedures to provenance and validation, then recompute current compatibility from environment state, target evidence and declared parameter contracts. Passing that gate may admit procedure execution, but business authorization and external-effect verification must remain independent facts.**

The primary evidence directly supports the first half of this judgment in a GUI setting. The separation from business authorization and effect verification is a bounded architectural implication required by what the study does not test.

## General implications

- store executable memory as a versioned artifact with lineage rather than free-form recollection;
- separate candidate retrieval from execution admission;
- give validation evidence an epoch and invalidate it explicitly when relevant dependencies change;
- bind replay to current target/state evidence instead of historical coordinates;
- permit only declared flexible substitutions;
- preserve ambiguity as a denial/repair state rather than forcing a guess;
- keep replay admission distinct from call-time business authorization;
- make uncertain external effects block blind retry until authoritative reconciliation occurs;
- preserve rejected/quarantined memories for audit and repair without exposing them as active capabilities.

## Limitations and counterarguments

The evidence comes from GUI-agent replay and does not establish enterprise production prevalence or complete external-effect safety. Visual-state checks can false-reject legitimate replay, and first-pass acquisition still depends on a capable agent. Broader application drift, localization, credentials, concurrent actors and irreversible effects require evidence beyond the reported experiments.

A richer contract also increases instrumentation cost. Low-risk read-only procedures may justifiably use a lighter admission policy. The core requirement is to make the reduced evidence contract explicit rather than allowing semantic similarity to become implicit authority.

## Open questions

1. Which environment/tool changes should automatically expire replay validation?
2. Should executor-model changes require re-validation even when the action schema is unchanged?
3. How should target identity be bound in multi-user applications where identical labels refer to different principals or records?
4. What external-effect APIs can expose operation identity and authoritative postconditions for safe recovery?
5. How should a repaired memory preserve old lineage while proving the repair applies to a new validation epoch?
6. Which replay denials can be deterministic, and which require semantic or human adjudication?
7. How should organizations measure useful replay rate, unnecessary rejection rate and unsafe admission separately?

## Editorial recommendation

- **Article type:** technical-analysis
- **Selected modules:** research-question; evidence-identities; replay-admission-mechanism; execution-time-eligibility; authorization-separation; failure-modes; limitations; open-questions
- **Core proposition:** a successful procedure should persist as a reusable artifact, while its right to execute is re-earned from fresh evidence on every consequential run
- **Project relevance:** none
