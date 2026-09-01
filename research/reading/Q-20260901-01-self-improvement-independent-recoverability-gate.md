# Q-20260901-01 — Independent Recoverability Gate for Self-Improving Agents

- Runtime date: 2026-09-01 (Asia/Shanghai)
- Queue signal: SIG-20260901-011
- Primary source: https://arxiv.org/abs/2608.28363
- Evidence level: `peer_reviewed_or_primary_research`
- Scope: self-modifying agent harnesses, recovery semantics, counterfactual state evaluation, effect scope, admission gates, rollback limits

## Research Question

Before a self-improving Agent is allowed to make a capability-improving mutation permanent, what must an independent recovery gate prove so that “the new version works better” is not mistaken for “the new version is safe to adopt”?

## Problem

Self-improvement changes the usual deployment assumption. A candidate modification can improve task performance and still leave the harness unable to restore a previously valid state. If adoption is based only on forward capability, a successful change can silently consume the system's recovery margin.

The selected research therefore separates two propositions that are often collapsed in practice:

1. the mutation improves a forward objective;
2. the mutation remains recoverable across relevant counterfactual post-mutation states.

The second property cannot safely be delegated to the same mutation or to a self-reported “rollback succeeded” signal. It needs an independently checked recovery contract.

## Primary Study and Evaluation Object

EvoUndo evaluates recoverability-constrained self-evolution over 600 previously unseen one-shot self-evolution tasks. The unit under test is not only a generated patch; it is a tuple consisting of the forward mutation, captured recovery witness, recovery program/language and an observational equivalence contract.

The paper treats harness state as more than source text. Recovery targets can include configuration, prompt state, tool registry and routing, and in the richer recovery language also middleware sequences, event listeners, sandboxed files, managed sockets and ordered composition state.

This matters because a code diff that can be reverted syntactically may still be unable to reconstruct the operational state the harness had before the mutation.

## Core Research Results

The reported 600-task evaluation produces three important groups: 281 candidates are already admissible, 197 improve capability but fail recovery verification, and 122 are capability-inadequate.

The 197 capability-positive but recovery-defective candidates are the central counterexample. Under the original recovery representation, conventional repair methods recover 0/197 at the reported budget. A deterministic oracle recovers 48/197 when restricted to the simpler L0 recovery language. Extending the recovery calculus to the richer L1 language raises the oracle ceiling to 191/197.

The paper also reports that exact-address grounding can sharply improve the cases where the simpler language is already expressive enough: 38 of 48 such failures are recovered, or 79.2%. But specificity is not monotonically beneficial. In the richer L1 setting, one evaluated backbone drops from 142/143 recovered under D0 to 133/143 under D1 exact addressing, a reported decrease of 6.29 percentage points with Holm-corrected p=0.0117. The authors describe likely over-decomposition, sequence inversion and over-capture patterns, but do not claim a causal intervention proving those explanations. A Qwen replication preserves the grounding/expressivity benefit but does not reproduce the same negative interaction.

These results support a bounded conclusion: recovery language expressivity and state addressing are separate design variables. More precise diagnosis helps when the language can express the needed undo operation, but over-specific recovery plans can also constrain or mis-order a valid repair.

## Recovery Contract

EvoUndo models a candidate as a forward mutation plus a recovery witness, recovery program and equivalence contract. The mutation itself is held fixed while recovery is diagnosed or repaired; recovery work is not allowed to rewrite the forward change merely to make the rollback test easier.

A pre-state witness is captured before mutation. Recovery is later applied to a post-mutation state plus that witness. The recovered state is accepted only if it satisfies typed observational equivalence with the original pre-state under the declared observation contract.

This makes recoverability **relational**, not a property of a patch in isolation. It depends on:

- the pre-state witness;
- the distribution of post-mutation/counterfactual states;
- the effect surface actually modified;
- the recovery language available;
- the state addressing scheme;
- the observational equivalence contract and acceptance threshold.

A recovery procedure that works from one exact state therefore does not prove that the same mutation remains recoverable after subsequent legitimate state evolution.

## Independent Effect Verification

A key governance mechanism is that the candidate's own declared effect set is not trusted as the authority for recovery scope. The runtime independently derives effects from state snapshot differences and execution traces.

That prevents a defective or self-serving candidate from narrowing the recovery obligation by declaring only the easiest-to-undo subset of its effects.

The stronger adoption pattern is therefore not “candidate says it can undo itself.” It is:

1. freeze the forward mutation under evaluation;
2. capture a pre-mutation witness;
3. independently determine the mutation's material effect surface;
4. execute recovery across declared counterfactual states;
5. evaluate the recovered state with typed observational equivalence;
6. admit the mutation only when the recovery contract passes.

This separation creates an independent adoption gate between capability improvement and activation.

## Counterfactual State Requirement

The study explicitly evaluates recoverability after state changes rather than only immediately after mutation. That distinction exposes why common snapshot ideas can give a false sense of safety.

In the paper's controlled comparison, restoring a full snapshot succeeds 0/300 times when subsequent state changes matter because the snapshot clobbers changes that should survive. An effect-scoped snapshot succeeds 300/300 when there is no concurrent mutation but falls to 159/300 with one subsequent mutation. EvoUndo's synthesized selective recovery records 243/300 without concurrent mutation and 131/300 with one subsequent mutation in the reported comparison.

The exact numbers should not be generalized beyond the benchmark, but the failure mechanism is important: rollback must distinguish mutation-owned effects from legitimate later state. Replacing the whole world with an old snapshot can be semantically wrong even if it restores the target component.

## Controlled and Natural Failure Evidence

The paper separates deliberately defective recovery tasks from naturally emerging failures.

For 120 controlled defective cases whose recoverability is known, typed diagnosis identifies the defect in 114/120 cases and prescriptive diagnosis in 117/120; strict regeneration solves only 4/120 in the reported setup.

For the 197 natural capability-positive recovery failures, generic/raw/typed/prescriptive repair representations initially recover 0/197 at the reported budget, while a strict regeneration baseline reaches 6/197. This is materially harder than correcting hand-constructed local defects and is evidence against assuming that a generic “ask the model to repair rollback” loop is sufficient.

## Comparisons

The paper's own baselines provide the most direct comparison evidence for this Reading.

A full snapshot treats recovery as state replacement. It is simple but can erase legitimate later changes.

An effect-scoped snapshot is more selective and works perfectly in the study's no-concurrent-mutation case, yet degrades when later changes overlap the same surface.

EvoUndo treats recovery as a synthesized state transformation constrained by independently derived effects and observational equivalence. It gains expressivity but still degrades under overlapping subsequent changes.

The paper explicitly does not implement or evaluate WAL/ARIES-style transactional recovery. Therefore the results should not be represented as a comparison against mature database logging or as proof that recovery synthesis replaces transactional commit protocols.

## Contradictions and Negative Evidence

The strongest negative result is that forward capability improvement does not imply recoverability: 197 candidates improve capability and still fail the recovery gate.

The second negative result is that full-state restoration can be incorrect in an evolving system. Recovery that “returns to the past” may destroy changes that occurred after the mutation and should remain authoritative.

The third is that more exact diagnostic addressing is not universally better. Exact addressing substantially helps one limited-language regime but harms one rich-language/backbone combination, and the paper does not establish a universal causal explanation for that interaction.

Finally, even the richer recovery calculus does not recover every case. The oracle reaches 191/197 rather than 197/197, so expressivity and search remain bounded.

## Evidence Identity

The source is a primary research preprint and its benchmark/measurements are treated here as **Research Results**, not independent production validation.

Directly described algorithms, task counts, recovery-language definitions, equivalence checks and reported benchmark outcomes are source-backed facts about the study.

The statement that a production digital employee should place an independent adoption gate between self-modification and activation is a Research Center inference from those results. The paper supports the need to separate forward improvement from recoverability; it does not specify a universal enterprise control-plane implementation.

## Limitations

The evaluation is a constructed self-evolution benchmark, not a long-lived production deployment with arbitrary human, network and external-service effects.

The tested state surfaces are harness-managed abstractions. Irreversible external actions, third-party systems, distributed transactions and cross-organization side effects are not shown to be recoverable by this mechanism.

The study evaluates bounded counterfactual state changes, not unconstrained concurrent multi-worker mutation over long horizons.

The independent verifier is assumed to be trustworthy enough to compute effects and observational equivalence. The paper does not solve verifier compromise or a malicious host that lies about the state it presents to the verifier.

The evaluation does not implement WAL/ARIES and therefore does not establish equivalence to transactional logging, exactly-once side-effect commitment or distributed consensus.

The negative D1/L1 interaction is model/backbone dependent in the reported evidence and is not reproduced in the same form across all evaluated models.

## Bounded Implication for Analysis

The evidence supports treating self-improvement as a two-gate lifecycle rather than a single “tests passed” event. A candidate may pass a capability gate and still be inadmissible because its recovery semantics are unproved.

A governed Runtime evaluating self-modification would need durable identities for at least the mutation version, pre-state witness, independently observed effect set, recovery program/language version, counterfactual test set, observational equivalence contract and verifier result. Activation should bind to that exact verified bundle, not to a generic approval of “the latest improvement.”

This Reading does not establish that every digital employee must use EvoUndo's representation, nor that recovery synthesis is preferable to transactional design. It establishes a narrower requirement: **recoverability is an independently testable property and should not be inferred from capability improvement or self-reported rollback success.**

## Unresolved Questions

- How should the gate handle irreversible external actions such as messages, purchases, deployments or third-party writes?
- What is the right recovery witness when several workers mutate overlapping state concurrently?
- Should recovery verification use an append-only effect journal, transactional outbox, snapshots, synthesized compensations, or a combination?
- How should the observational equivalence contract distinguish harmless representation differences from authority- or security-relevant changes?
- How frequently must recoverability be revalidated as the surrounding state distribution drifts?
- What authority is allowed to approve activation if the independent verifier and the self-modifying worker disagree?
- How should the system react when a candidate is capability-positive but recoverable only under a richer language or more privileged recovery mechanism?
- Can a recovery mechanism itself become a privilege-escalation path if it is allowed to rewrite protected state?

## Reading Conclusion

EvoUndo provides a strong counterexample to capability-only adoption. In its 600-task evaluation, 197 self-modifications improve the forward objective while failing recovery verification. The study's main engineering contribution is to turn rollback into an independently checked relational contract over a frozen mutation, pre-state witness, independently derived effect surface, counterfactual post-states and typed observational equivalence. The evidence supports a separate recoverability gate before self-improvement becomes active. It does not prove universal rollback, distributed exactly-once recovery or safe handling of arbitrary irreversible external effects.
