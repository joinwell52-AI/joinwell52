---
date: "2026-09-16"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260916-01
column: digital-employee
article_type: technical-analysis
project_relevance: none
source_reading: "research/reading/Q-20260916-01-sustained-operational-completion-evidence.md"
---

# Research Analysis — Operational Completion Is an Evidence Vector, Not a Single Success Bit

## Research question

For a long-running digital employee working under time, resource and priority constraints, what evidence is required before the system may represent a work episode as operationally complete, even when the semantic answer itself appears correct?

## Research themes and subject kind

- Research themes: sustained completion; semantic correctness; required-action closure; timeliness; priority/fairness; episode closure; completion evidence.
- Subject kinds: `research-finding`, `governance-problem`, `architecture-mechanism`, `failure-mode`.
- Primary sample: Asclepius and its Continuous Execution Simulator / held-out evaluation.

The research subject is not whether one medical Agent is clinically better than another. It is whether **semantic correctness and operational completion must remain distinct, jointly inspectable evidence identities** in a long-lived digital employee.

## Evidence identities

### E1 — source-reported benchmark fact

**Identity:** `source-reported-claim`.

**Claim:** In the reported baseline, diagnostic quality is high at 4.39/5 while Critical Actions are much lower at 2.94/5; timeliness is 3.34/5 and disposition is 4.52/5.

**Strength:** direct evidence inside the paper's simulated sustained-work setting. **Independent:** false.

### E2 — source-reported held-out result

**Identity:** `source-reported-claim`.

**Claim:** The full Asclepius configuration reports Diagnosis 4.38/5, Critical Actions 3.67/5, Timeliness 3.79/5 and Disposition 4.54/5; on the held-out batch the Critical-action score improves by about 0.63 points, roughly 22%, with reported p=0.024.

**Strength:** bounded experimental evidence that a system can preserve semantic quality while materially improving another completion dimension. It is not production reliability proof. **Independent:** false.

### E3 — source-reported mechanism

**Identity:** `public-fact`.

**Claim:** The evaluated system combines trace-derived operating-manual evolution, external skills and isolated subagents inside a continuous simulator with evolving patients and resource constraints.

**Strength:** mechanism evidence for the tested harness. **Independent:** false.

### E4 — source limitation

**Identity:** `public-fact`.

**Claim:** The study is simulated, uses LLM grading, and reports one rollout per configuration/batch. It does not establish clinical safety, authorization correctness, exactly-once external effects or enterprise incident rates.

**Strength:** explicit boundary on transfer. **Independent:** false.

### E5 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** A consequential digital employee should represent completion as an evidence vector with at least separate identities for semantic result correctness, required-action closure, time/deadline satisfaction, priority/fairness obligations, and episode/effect closure. A positive value in one dimension must not silently fill another.

**Strength:** architectural synthesis from E1–E4 and the same-day Reading Note. **Independent:** false.

### E6 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** The minimum safe terminal rule is evidence closure, not score aggregation: every mandatory dimension must either have supporting evidence or remain explicitly unresolved/failed. A high average must not convert a missing critical-action proof into Completed.

**Strength:** governance recommendation; not a rule established by the paper. **Independent:** false.

### E7 — open question

**Identity:** `open-question`.

**Claim:** The evidence does not establish the right enterprise thresholds, who owns final acceptance, how external side effects should be reconciled, or how completion evidence should behave under concurrent workers and retries.

## Failure / Finding / Mechanism / Implication

### Failures

1. **Semantic-success collapse:** a correct recommendation is treated as proof that every required operational action was completed.
2. **Average-score masking:** strong dimensions compensate numerically for a missing mandatory action or missed deadline.
3. **Action-list ambiguity:** the runtime records that work was attempted but cannot identify which required actions are proven closed.
4. **Deadline erasure:** eventual success is represented as equivalent to on-time completion.
5. **Priority/fairness erasure:** aggregate throughput hides whether urgent or protected work was delayed disproportionately.
6. **Episode/effect ambiguity:** the Agent stops producing tokens and the runtime infers that the external work episode is terminal.
7. **Self-acceptance:** the same worker that performed the work also converts its own evidence into accepted completion without an independent acceptance rule.

### Findings

The strongest same-day evidence is the separation visible inside the reported metrics themselves. A baseline can be highly rated on Diagnosis while substantially weaker on Critical Actions and Timeliness. That is direct evidence against treating semantic correctness as an adequate proxy for sustained operational completion.

The held-out result adds a second point: the system can improve Critical Actions while largely preserving Diagnosis. The dimensions therefore are not merely alternative descriptions of one latent success variable; they can move differently under the same intervention.

This advances the earlier general completion-contract finding. The earlier result established that consequential completion needs independent evidence rather than a worker's own final-state claim. The present evidence adds a **long-horizon closure structure**: completion must remain decomposed across obligations that may fail independently under sustained contention.

### Mechanism

A reusable completion record can expose the following evidence identities without adopting the medical benchmark itself.

**Semantic result evidence**

- what substantive conclusion/output was produced;
- evidence or verifier supporting correctness;
- uncertainty and scope.

**Required-action closure**

- versioned required-action set;
- per-action state and evidence reference;
- explicit unresolved/omitted actions.

**Temporal closure**

- due time / service objective;
- actual completion time;
- lateness or missed-window state.

**Priority / fairness closure**

- declared priority or protected ordering rule;
- whether higher-priority obligations were displaced;
- any fairness/triage exception and its evidence.

**Episode / effect closure**

- external state proving the intended effect is present, absent, compensated or still unknown;
- retry/duplicate-effect state when applicable.

**Acceptance identity**

- which rule or responsible authority accepted the evidence package;
- what mandatory dimensions were required;
- which dimensions were not applicable rather than silently missing.

The terminal decision should be conjunctive over mandatory evidence identities, not a model-generated narrative and not a weighted average. Optional quality metrics may still be useful, but they must not overwrite missing closure facts.

### Implication

For digital employees, “Completed” should mean **the declared obligation set is evidence-closed**, not merely that the worker produced a plausible answer or stopped running. This is especially important for long-lived roles where timing, handoffs, resource contention and side effects accumulate across many episodes.

A system can therefore distinguish several truths at once: the semantic answer was good; a required action was missed; the deadline was exceeded; the external effect remains unknown; the worker is no longer running. None of those facts should be forced into one status before the acceptance rule decides what terminal business result they imply.

## Comparison and contradictions

Earlier completion research emphasized independent verification of process, outcome and failure class. Today's evidence is compatible with that architecture but makes the operational decomposition more concrete. A generic outcome verifier can still overstate success if it does not know the required-action set, timing obligations or priority constraints.

The Asclepius scores are not themselves a universal completion schema. They are domain-specific measures, and the medical simulator supplies task structure that many enterprise systems would need to define explicitly. The generalizable result is the **non-equivalence of completion dimensions**, not the literal adoption of Diagnosis/Critical Actions/Timeliness/Disposition fields.

A counterargument is that a single aggregate KPI is operationally simpler. That is true for reporting, but unsafe as the canonical fact when one omitted action or unknown external effect is disqualifying. Aggregation belongs above the evidence layer, after mandatory closure conditions are preserved.

## Bounded research judgment

**A consequential digital employee should close work through a versioned completion-evidence vector, not a single success bit. Semantic correctness, required-action closure, timeliness, priority/fairness obligations and episode/effect closure should remain independently observable; every mandatory dimension must be proven or explicitly remain unresolved before the runtime can represent the business episode as Completed.**

The primary evidence directly supports the narrower claim that semantic quality and sustained operational completion can diverge under long-horizon constraints. The exact enterprise evidence schema, thresholds and acceptance authority remain architectural choices requiring further validation.

## General implications

- define a versioned obligation set before consequential work is accepted;
- keep semantic result quality separate from action completion and timing;
- prohibit averages from masking missing mandatory evidence;
- preserve unresolved/unknown as a first-class state;
- distinguish worker termination from episode completion;
- bind retries to external-effect evidence rather than worker memory;
- preserve priority/fairness violations even when the final output looks correct;
- let an independent acceptance rule convert the evidence vector into a business terminal state.

## Limitations and counterarguments

The source is a simulated healthcare environment, not an enterprise digital-employee deployment. LLM grading, limited rollout counts and domain-specific critical-action definitions restrict transfer. The evidence does not establish exactly-once effects, production authorization, human-review thresholds, privacy controls or long-term fairness guarantees.

A stronger evidence contract also increases instrumentation and review cost. Low-risk tasks may reasonably use fewer mandatory dimensions. The important requirement is that the reduced contract be explicit rather than produced by silently collapsing distinct facts.

## Open questions

1. Which digital-employee work classes require per-action closure rather than outcome-only verification?
2. Who owns the authoritative required-action set when work changes during execution?
3. How should deadlines and priority exceptions be represented without turning every schedule miss into total failure?
4. What external evidence proves episode closure when a tool call may have an unknown side effect?
5. How should handoffs preserve partially closed evidence vectors across workers?
6. Which completion dimensions can be deterministically checked and which require semantic or human evaluation?
7. What benchmark can jointly test correctness, action closure, timeliness, fairness and recovery under sustained contention?

## Editorial recommendation

- **Article type:** technical-analysis
- **Selected modules:** research-question; metric-separation; held-out-evidence; completion-evidence-vector; mandatory-closure-rule; comparison-with-verifiable-completion; limitations; open-questions
- **Core proposition:** operational completion is evidence closure across independently failing obligations, not a single success bit inferred from a good answer or a stopped worker
- **Project relevance:** none
