# Q-20260911-02 — Deterministic Coordination Helps Only When Work Units and Coupling Are Observable

- Runtime date: 2026-09-11 (Asia/Shanghai)
- Queue signal: SIG-20260911-005
- Primary research source: https://arxiv.org/html/2609.09815v1
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When can a compound agent system replace a generative manager with deterministic coordination, and what evidence is needed to know that independently selected units can be composed without losing semantic correctness?

## Problem

Multi-agent and compound AI systems often introduce a model-based manager to merge proposals, choose workers, or synthesize a final answer. That manager adds another generative decision layer and can become a bottleneck for reproducibility, provenance and cost. A natural alternative is deterministic selection: decompose the task into identifiable units, let multiple proposals supply candidate values, and use a fixed rule to assemble the admissible result.

UnitBoost studies this idea directly. It represents work as units or slots, gathers candidate contributions, applies a constrained deterministic selection operator, records provenance and sends only unresolved residual units into later rounds. The paper reports meaningful gains across several compound-system settings, but also identifies the exact boundary where the simplification breaks: if units are not observable, are indivisible, or are strongly coupled, independent deterministic selection loses its advantage.

The bounded runtime conclusion is therefore not “deterministic coordination is better than AI management.” It is that **deterministic coordination can replace generative management only over state whose units, admissibility conditions and coupling are sufficiently observable**.

## Unit-Level Representation

UnitBoost requires the target output to be represented as identifiable atomic units or slots. Different workers or proposals can then contribute candidate values for the same unit.

This representation changes the coordination problem. Instead of asking a manager model to read several whole candidate answers and generate another whole answer, the runtime can compare proposals at the unit level and construct a result from selected contributions.

The unit abstraction is therefore not a cosmetic implementation detail. It is the precondition that makes deterministic composition possible. If the task cannot expose meaningful units, the mechanism cannot simply infer them for free without reintroducing another semantic model judgment.

## Deterministic Constrained Selection

For each unit, the mechanism chooses among admissible candidate values using a constrained argmax-style selection rule. The final artifact is assembled from those selected unit values subject to the configured admissibility or compatibility constraints.

Under the paper's assumptions, the selection operator is order-invariant: the result should not depend on the incidental order in which proposals are presented. This is valuable for a runtime because worker scheduling order can otherwise become an accidental source of business semantics.

But order-invariance is a property of the deterministic merge rule, not a proof that the chosen value is semantically correct. A selector can reproducibly choose the wrong admissible candidate if the score or admissibility evidence is wrong.

## Provenance Is Native to the Merge

Because the final result is assembled from identifiable units, the system can record which proposal supplied the selected value for each unit. This provides a much clearer provenance path than a manager-generated synthesis that may blend several proposals into a new text without a precise source map.

The provenance proves **where the selected unit came from**. It does not prove that the selected unit is true, safe, authorized or globally compatible with every other unit. Provenance and correctness remain separate evidence identities.

For agent runtimes this is an important distinction: deterministic assembly can make attribution stronger even when semantic validation still requires an independent gate.

## Residual Construction and Later Rounds

After one selection round, unresolved or unsupported units form the residual. Later work can target only that residual rather than re-running the entire problem.

The paper reports that true residual targeting outperforms random-target and rereading controls, supporting the mechanism claim that explicitly exposing unfinished units helps compound systems allocate additional effort more effectively.

A label-free supply signal is also used to detect when another round is unlikely to add useful unit coverage. This lets the system stop after an unproductive round rather than repeatedly asking more workers for the same already-exhausted supply.

The runtime pattern is concrete:

1. identify units,
2. collect candidate supply,
3. deterministically select admissible values,
4. materialize the residual,
5. target later work only at the residual,
6. stop when new supply is exhausted.

This is closer to explicit work-state management than to an open-ended conversational manager.

## Held-Out Evaluation Results

Across the reported held-out evaluations, UnitBoost outperforms the strongest single gold-label candidate by roughly **0.060 to 0.195** and generative managers by roughly **0.048 to 0.076**, depending on the benchmark/configuration.

The paper also replaces only the management layer in six compound-system configurations and reports improvements ranging from **0.013 to 0.182**. This is useful mechanism evidence because it isolates coordination from the rest of the system rather than comparing completely different stacks.

On FanOutQA, the reported cell-level F1 example improves from **0.4778 to 0.5524** under the UnitBoost-style coordination path.

These results support the claim that unit-level deterministic coordination can improve tested compound systems when the task exposes suitable decomposition. They do not establish that deterministic coordination universally dominates generative synthesis.

## The Negative Conditions Define the Boundary

The paper explicitly identifies conditions where the mechanism does not provide its intended benefit.

### One indivisible unit

If the task is effectively one atomic unit, there is nothing to compose across proposals. Unit-level coordination collapses back toward selecting one whole candidate.

### Unit identity is unavailable

If the system cannot tell what unit a contribution refers to, deterministic composition lacks a stable key for comparison and assembly.

### Every emitted unit is charged

When the endpoint charges for every emitted unit, decomposing and collecting redundant unit supply can remove the efficiency advantage.

These negative conditions are important because they prevent a broad “replace all managers with deterministic code” interpretation. The mechanism depends on a representational contract that many tasks may not satisfy.

## Cross-Unit Coupling Is the Harder Limit

The stronger limitation is semantic coupling between units. UnitBoost measures coupling through a repair-cost construction: if selecting units independently creates inconsistencies that require substantial cross-unit repair, the independence assumption is breaking down.

As coupling increases, the benefit of independent unit selection erodes and can disappear. This is exactly where a deterministic per-unit argmax can be locally correct yet globally incoherent.

For runtime architecture, coupling should therefore be treated as an observable risk dimension rather than an afterthought. Before replacing a generative manager, the system needs evidence that the selected units can be composed with bounded repair cost or that explicit global constraints capture the important dependencies.

A decomposition that is syntactically visible but semantically coupled is not truly independent work.

## “Manager-Free” Does Not Mean “Model-Free”

The paper removes the generative manager from the merge/control path. Other model-mediated stages can still produce proposals, scores or task interpretations.

Therefore the result should be described carefully: UnitBoost shows that **a specific generative coordination function can be replaced by a deterministic unit-level mechanism** under suitable conditions. It does not show that the overall compound system becomes deterministic or free of model judgment.

This matters for governance. A deterministic selector downstream of probabilistic proposal generation still inherits uncertainty from those proposals and from any learned scoring or semantic admissibility signals.

## Order-Invariance Is Not Semantic Correctness

Order-invariant selection removes one class of accidental nondeterminism: proposal arrival or presentation order should not change the selected result under the stated assumptions.

That is valuable, but it should not be confused with correctness. The same wrong evidence can produce the same wrong answer every time. Determinism converts an unstable decision into a reproducible decision; it does not automatically validate the decision.

A governed runtime therefore needs separate checks for:

- unit identity,
- candidate provenance,
- admissibility,
- selection score or rule,
- cross-unit constraints,
- repair/coupling cost,
- and final semantic acceptance.

## Implication for Agent-Native Coordination

UnitBoost supports a useful division of labor between AI and deterministic machinery.

AI is useful where the system must generate candidate solutions, interpret unstructured inputs or reason about semantics. Deterministic coordination becomes attractive after the business state has been converted into observable units with explicit constraints and provenance.

This gives a concrete answer to the broader architecture question of what a “track machine” or deterministic runtime should decide: it can safely materialize and select over facts whose full decision inputs are observable and contractually defined. It should not pretend to settle semantic questions that remain hidden inside coupled, unstructured work.

The evidence therefore supports a boundary rather than a universal preference: **deterministic programs should own decisions that can be completely observed and specified; unresolved semantic judgment should stay with the accountable intelligence/authority layer.**

## Provenance Does Not Grant Authority

The source map from unit to proposal is useful evidence, but it does not authorize the selected unit to create an external effect. A worker may supply a value with perfect provenance and still lack permission to change the target resource.

Likewise, the deterministic merge may build a coherent artifact while some unit contains unsafe or unauthorized content. For high-impact systems, execution authorization remains a separate call-time decision bound to current target, scope and policy facts.

UnitBoost therefore informs coordination and evidence architecture, not a complete authorization architecture.

## Failure Modes for a Governed Compound Runtime

### Hidden-unit decomposition

The system claims deterministic coordination while a model silently decides the unit boundaries differently on each run.

### Local-selection fallacy

Each unit is selected optimally under its local score but the assembled result violates cross-unit semantics.

### Provenance-equals-truth

A selected unit has clear origin, so the runtime treats it as correct without checking the underlying evidence.

### Deterministic-overclaim

Order-invariant code is treated as inherently safer even though its inputs are probabilistic or its objective is incomplete.

### Residual loss

Unresolved units are not durably materialized, so recovery mistakes “not yet supplied” for “completed.”

### Coupling blindness

The runtime decomposes strongly coupled work and notices inconsistency only after external effects have already been committed.

### Manager-free illusion

A generative merge step is removed, but equivalent semantic discretion is merely moved into proposal scoring, unit identification or admissibility classification.

## Evidence Strength

This is strong primary research evidence for deterministic unit-level coordination under explicit decomposition assumptions. The paper evaluates held-out benchmarks, multiple compound-system configurations, management-layer replacement, residual targeting controls and negative conditions, and it studies cross-unit coupling rather than reporting only favorable aggregate scores.

The strongest support is for using deterministic selection when unit identity, admissibility and weak coupling are observable. The evidence is weaker for tasks with globally coupled semantics, irreversible external effects, hidden unit boundaries or authorization requirements.

## Limits and Unknowns

- The work is fresh primary research and independent replication is not yet established.
- The mechanism assumes meaningful unit identities can be exposed; many open-ended tasks do not naturally satisfy that assumption.
- Deterministic selection does not prove semantic correctness of the selected candidate values.
- Increasing cross-unit coupling erodes the mechanism's advantage and can require global repair.
- Provenance identifies the source proposal but does not establish truth, safety or authorization.
- The study does not establish exactly-once external effects, transactional rollback, call-time authorization or recovery across distributed workers.
- Cost advantages depend on endpoint and unit-emission economics; one reported negative condition explicitly removes the benefit when every unit is charged.
- “Manager-free” coordination still operates over model-generated or model-scored inputs in the broader system.

## Unresolved Questions

1. What deterministic test can establish that a task's unit decomposition is stable enough to admit unit-level coordination?
2. How should a runtime quantify coupling before committing selected units to irreversible effects?
3. When should high repair cost force escalation from deterministic merge to an accountable semantic reviewer?
4. Can unit provenance be extended into an end-to-end evidence chain from source observation through selected value to final effect?
5. How should residual state survive retries so unfinished units are not duplicated or silently dropped?
6. What admission rule separates globally constrained units that are still safe to compose from tasks that require whole-artifact adjudication?
7. How should deterministic coordination interact with authorization when workers have different scopes or target permissions?

## Reading Conclusion

The selected evidence supports a bounded conclusion: **deterministic coordination is a strong replacement for generative management only where the runtime can observe stable work units, explicit admissibility constraints and sufficiently weak coupling.** UnitBoost demonstrates that unit-level selection can improve compound-system performance, make provenance explicit, target residual work and remove proposal-order dependence. Its negative conditions and coupling analysis are equally important: deterministic selection can be reproducibly wrong when the decomposition hides global semantics. For an agent-native runtime, unit identity, provenance, residual state and coupling evidence should be explicit before deterministic coordination is allowed to carry business meaning.

This Reading Note performs evidence extraction only. It does not execute Research Analysis, article writing, visualization, Production or Publication.
