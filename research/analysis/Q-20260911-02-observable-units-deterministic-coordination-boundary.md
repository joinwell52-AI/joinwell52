---
date: "2026-09-11"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260911-02
column: industry-architecture
article_type: technical-analysis
project_relevance: none
source_reading: "research/reading/Q-20260911-02-deterministic-unit-level-coordination.md"
---

# Research Analysis — Deterministic Coordination Needs Observable Units and Bounded Coupling

## Research question

When may a compound agent system safely replace a generative coordination manager with deterministic machinery, and what evidence is needed before a locally reproducible unit-level decision is allowed to carry global business meaning?

## Research themes and subject kind

- Research themes: multi-agent coordination; deterministic runtime boundaries; provenance; residual work; evidence and completion truth; policy enforcement; recovery.
- Subject kinds: `architecture-mechanism`, `research-finding`, `governance-problem`, `failure-mode`.
- Primary sample identity: UnitBoost, a primary study of deterministic unit-level coordination for compound AI systems.

The research subject is not “manager-free agents” as a product label. It is the boundary between **fully observable coordination state that deterministic code can adjudicate** and **coupled semantic state that still requires accountable intelligence or review**.

## Evidence identities

### E1 — source-reported-claim

**Claim:** UnitBoost represents the target output as identifiable units or slots, collects candidate values for those units, applies a constrained deterministic selection operator, records unit-level provenance and materializes unresolved units as residual work for later rounds.

**Source:** same-date source-complete Reading Note based on the UnitBoost primary study.

**Strength:** direct mechanism evidence. **Independent:** false.

### E2 — source-reported-claim

**Claim:** Under the paper's assumptions the deterministic selection is order-invariant, so incidental proposal presentation or arrival order does not determine the selected result.

**Strength:** direct reproducibility evidence for the merge operator. It does not prove semantic correctness of the selected value. **Independent:** false.

### E3 — source-reported-claim

**Claim:** Across held-out evaluations, UnitBoost reports gains of roughly 0.060–0.195 over the strongest single gold-label candidate and roughly 0.048–0.076 over generative managers; replacing only the management layer in six compound-system configurations reports improvements of 0.013–0.182, and a FanOutQA cell-level F1 example improves from 0.4778 to 0.5524.

**Strength:** primary comparative evidence that isolates the coordination layer across tested configurations. **Independent:** false.

### E4 — source-reported-claim

**Claim:** True residual targeting outperforms random-target and rereading controls, supporting explicit unresolved-unit state as a useful mechanism for allocating later rounds.

**Strength:** mechanism-specific experimental evidence. **Independent:** false.

### E5 — source-reported-claim

**Claim:** The paper explicitly identifies negative conditions: the advantage collapses when the task is effectively one indivisible unit, unit identity is unavailable, every emitted unit is charged, or cross-unit coupling creates substantial repair cost.

**Strength:** strong boundary evidence because the source tests where the proposed mechanism ceases to fit. **Independent:** false.

### E6 — our-interpretation

**Claim:** Deterministic coordination is appropriate only after the business state has been converted into observable identities, admissibility constraints and bounded coupling assumptions. Determinism can remove scheduling-order discretion and strengthen provenance, but it cannot resolve semantics that remain hidden in the decomposition or scoring inputs.

**Source:** bounded synthesis of E1–E5.

**Strength:** supports. **Independent:** false.

## Failure / Finding / Mechanism / Implication

### Failures

1. **Hidden-unit decomposition:** the system advertises deterministic coordination while a model silently chooses unstable unit boundaries differently on each run.
2. **Local-selection fallacy:** each unit is locally admissible or high-scoring but the assembled artifact violates cross-unit semantics.
3. **Provenance-equals-truth:** a selected value has a clear source proposal, so the runtime mistakes attribution for correctness or authority.
4. **Deterministic-overclaim:** an order-invariant selector is treated as inherently safe even though its inputs, scores or constraints are probabilistic or incomplete.
5. **Residual loss:** unresolved units are not durably materialized, so recovery confuses “not supplied yet” with “completed.”
6. **Coupling blindness:** strongly coupled units are committed independently and incompatibility is discovered only after downstream effects.
7. **Manager-free illusion:** generative discretion disappears from the final merge but reappears unacknowledged in unit discovery, scoring or admissibility classification.
8. **Effect-authority leakage:** deterministic assembly of a value is treated as permission to execute that value against an external target.

### Findings

The strongest finding is that **deterministic coordination has a representational precondition**. It works when the system can name the units being decided, compare candidate supply for the same unit and specify admissibility or compatibility constraints. The deterministic selector does not create that structure; it consumes it.

A second finding is that unit-level coordination improves provenance and reproducibility even when semantic uncertainty remains. The runtime can identify which proposal supplied each selected unit and remove proposal-order dependence from the merge. Those are valuable governance properties, but neither one proves truth or authorization.

A third finding is that residual work should be a first-class state rather than an implicit conversational notion. The reported controls support targeting only unresolved units in later rounds. For durable systems, the same principle means retries and recovery should preserve the exact residual instead of re-running completed units blindly.

A fourth finding is negative: increasing cross-unit coupling erodes the advantage of independent deterministic selection. The boundary is therefore not “code is safer than models,” but “code can adjudicate only facts whose decision inputs and compatibility conditions are sufficiently observable.”

### Mechanism

The evidence supports a deterministic coordination contract with these explicitly materialized states:

- **Unit identity:** stable key and scope for each independently selectable piece of work.
- **Candidate supply:** versioned candidate values plus provenance for each unit.
- **Admissibility evidence:** observable constraints that determine which candidates may enter selection.
- **Selection rule:** deterministic, order-invariant rule over declared inputs.
- **Coupling evidence:** explicit global constraints or measured repair cost that indicates whether local selections compose safely.
- **Residual identity:** durable set of units not yet satisfactorily supplied or resolved.
- **Final semantic acceptance:** separate gate when global coherence cannot be completely established by deterministic constraints.
- **Execution authorization:** separate call-time authority for external effects, never inferred merely from successful assembly.

Under this contract, deterministic code owns the decisions it can completely observe. When unit identity, admissibility or coupling remain semantic, the system should expose that uncertainty rather than pretending the track machine has enough facts to decide.

### Implication

For agent-native runtimes and multi-agent organizations, **determinism is strongest as a materializer of explicit contracts, not as a substitute for semantic responsibility**. A runtime may deterministically allocate, select, deduplicate or close work where identities and constraints are fully specified; unresolved meaning, coupled trade-offs and authorization remain with an accountable intelligence or authority layer.

This creates a practical division of labor: AI can generate candidate interpretations and solutions; deterministic machinery can enforce explicit state transitions and admissibility; a responsible reviewer or model can adjudicate the semantic remainder when the observable contract is incomplete.

## Comparisons and contradictions

UnitBoost directly contradicts the broad claim that a generative manager is always necessary for coordination. On tasks with stable units, admissible candidate supply and weak enough coupling, a deterministic unit operator can outperform tested generative managers while improving source attribution and removing proposal-order dependence.

It also contradicts the opposite broad claim that deterministic code should replace semantic managers everywhere. The paper's own negative conditions show that indivisible tasks, hidden units, unfavorable unit economics and strong coupling erase the mechanism's advantage. The stronger the semantic interaction between units, the less justified independent local selection becomes.

A second important distinction is **provenance versus validation**. Unit-level source mapping can prove where a selected value originated. It cannot prove that the value is true, safe, globally coherent or authorized. Provenance is evidence identity, not business authority.

## Bounded research judgment

**A compound-agent runtime should allow deterministic coordination to carry business meaning only when unit identity, candidate admissibility and the relevant coupling constraints are observable enough to make the decision contract complete; otherwise deterministic selection is merely reproducible approximation and must not be treated as semantic adjudication.**

Order-invariance is valuable because it removes accidental scheduling semantics. Unit provenance is valuable because it preserves attribution. Durable residual state is valuable because it makes later work and recovery explicit. None of these properties converts uncertain semantic inputs into verified truth.

The proper boundary is therefore not “AI decides” versus “program decides.” It is **complete observable contract versus unresolved semantic responsibility**. Deterministic machinery may decide the former; the latter must remain explicitly assigned to an accountable intelligence or authority rather than being hidden inside a score or decomposition heuristic.

## General implications

For governed digital employees and multi-agent systems:

- deterministic workflow logic should operate on stable task/unit identities rather than inferred conversational fragments;
- unit-boundary creation should be separately observable when it is model-generated;
- selected values should retain per-unit provenance through final artifact assembly;
- residual work should be durable and idempotent so retries do not duplicate already closed units;
- global constraints and coupling evidence should be checked before unit-level results create irreversible effects;
- high coupling or high repair cost should trigger escalation to whole-artifact semantic review;
- deterministic selection should never be confused with execution authorization; target, scope and permission remain separate control facts;
- claims that a system is “manager-free” should identify which semantic decisions were actually removed and which merely moved upstream.

## Limitations and counterarguments

UnitBoost is fresh primary research and independent replication is not yet established. The reported evaluations cover multiple compound-system configurations and include negative conditions, but they do not prove exactly-once external effects, transactional rollback, authorization safety or distributed-worker recovery.

The mechanism depends on meaningful unit identities. Many open-ended research, negotiation, design and strategy tasks do not naturally expose independent units. Even where units are syntactically identifiable, cross-unit semantics may remain strongly coupled and require global adjudication.

The deterministic selector also operates over candidate values and scores that may originate from models. Reproducible selection therefore does not make the overall system deterministic. Cost advantages depend on endpoint economics, and one reported negative condition explicitly removes the benefit when every emitted unit is charged.

Accordingly, the evidence supports deterministic unit-level coordination as a bounded architecture pattern, not a universal replacement for generative management.

## Open questions

1. What deterministic test is sufficient to prove that a proposed unit decomposition is stable across retries and models?
2. How should a runtime quantify coupling before independent unit selection is allowed to create downstream effects?
3. Which global constraints can be enforced deterministically, and which necessarily require semantic review?
4. When should measured repair cost automatically escalate from unit-level merge to whole-artifact adjudication?
5. How should residual identities survive crash recovery so unresolved work is neither duplicated nor silently dropped?
6. Can per-unit provenance be extended into an end-to-end evidence chain from source observation through selection to external effect?
7. How should deterministic coordination interact with different worker scopes and authorization boundaries?

## Editorial recommendation

- **Article type:** technical-analysis
- **Selected modules:** research-question; evidence-identities; unit-representation; deterministic-selection; provenance; residual-state; coupling-boundary; negative-conditions; deterministic-vs-semantic-responsibility; governance-implications; counterarguments; open-questions
- **Core proposition:** deterministic coordination is trustworthy only over observable units and complete constraints; reproducibility and provenance do not authorize a program to settle hidden semantic coupling
- **Project relevance:** none
