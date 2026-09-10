# Q-20260910-02 — Self-Evolving Agent Procedures Need Held-Out Admission Before Structural Changes Become Active

- Runtime date: 2026-09-10 (Asia/Shanghai)
- Queue signal: SIG-20260910-004
- Primary research source: https://arxiv.org/html/2609.09153v1
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When an agent can modify the procedure that guides its own future execution, what evidence should separate the authority to propose a structural change from the authority to make that change active?

## Problem

Self-improving agents are often described as if “learning from experience” were a single operation. In practice, at least three things are different: observing execution, proposing a modification, and adopting the modified procedure as the new active state. If one model can perform all three without an independent acceptance boundary, a locally plausible change can silently become the next run's governing procedure.

Procedural Graphs is useful because it makes those states explicit. It externalizes procedural knowledge into an inspectable graph, lets an LLM refiner propose changes from execution traces, and then evaluates a structurally valid candidate on a held-out validation set before the candidate can replace the retained graph. Rejected candidates remain evidence but do not become active state.

The paper therefore provides a concrete self-evolution mechanism in which **proposal authority and adoption authority are distinct**, while also exposing an important limitation: the acceptance evidence is independent by data split, not by model identity or organizational role.

## Procedural Graph as an External Execution Substrate

A Procedural Graph is a directed attributed graph whose nodes represent abstract procedures such as tool functions, skills, reasoning steps, or task states. Directed edges represent admissible transitions. In the implementation, each edge can carry `condition`, `guidance`, and `pitfalls` attributes describing when the transition applies, how to proceed, and what to avoid.

This matters because the procedure does not live only inside model weights or a growing chat history. It becomes an explicit artifact that can be inspected, retrieved, versioned, mutated, accepted, rejected, and compared across runs.

The graph is still guidance rather than a hard state machine. The solver receives situational guidance derived from the graph but chooses its next action using its own reasoning. Procedural structure and model autonomy therefore coexist: the graph narrows and contextualizes what-to-do knowledge without fully determining the action sequence.

## Runtime Localization and Guidance

At inference time the graph is frozen. The framework exactly matches the agent's most recent procedure to a graph node, retrieves a directed neighborhood up to a configured hop distance, and gives that local subgraph plus the recent trajectory window and user query to a guidance model. The generated guidance is appended to the solver prompt.

The main configuration uses a two-hop neighborhood and a three-step recent trajectory window. If exact node matching fails, the framework falls back to the full graph. This fallback is useful for robustness but also weakens the claim that every action is constrained by a precisely localized procedural state: guidance remains soft and can become broader when localization fails.

The ablation study shows why locality matters. With Gemini 3.5 Flash, localized generative guidance outperforms raw full-graph injection and full-graph generative guidance on the tested MultiChallenge, GDPval, and ALFWorld subsets. Full-graph generative guidance is especially costly on ALFWorld and performs worse than the unguided baseline, while localized guidance reaches the best result in the three reported subsets. The lesson is not that more procedure context is always safer or better; procedural context itself must be scoped to the active state.

## Offline Self-Evolution Is a Four-Step State Transition

The self-evolution loop operates only between batches; the active graph remains fixed during each episode and test evaluation.

### 1. Diagnostic rollout

The retained graph runs on a training batch. The system stores trajectories and task scores, distinguishing high-scoring and low-scoring cases or, for binary tasks, successes and failures.

### 2. Feedback-driven mutation

An LLM refiner compares those traces and proposes a structured edit set. The implemented topological operations are **Add** and **Delete** for nodes and edges. Attribute revision uses the same interface by deleting an edge and re-adding it with modified attributes.

This produces a candidate graph, not yet an active graph.

### 3. Structural validation and held-out gating

The candidate first undergoes structural checks. Malformed edits, invalid node or relation types, missing endpoints, and some cycle conditions can reject a candidate before performance evaluation. The validator also requires a directed path from every node to some terminal node.

However, structural validation has limits. Matching action-node names to the actual tool catalog is a refiner-prompt requirement; the generic structural validator does not independently enforce tool-catalog membership. Passing structure checks is therefore not a complete execution-validity proof.

A structurally valid candidate is then evaluated on a validation set that is disjoint from the training data and from the final test set. The candidate becomes the retained graph only if its mean validation score **matches or exceeds** the current retained graph's cached validation score. A tie is accepted.

### 4. Rejection memory

Candidates that lower validation performance are not activated. Their proposed edits, candidate structure, diagnostic trajectories, and validation outcomes are retained as rejection memory and supplied as negative evidence to later refinement rounds. A rejected candidate never becomes the starting graph for the next round.

This is a strong state-model distinction: **rejected knowledge can remain observable without becoming executable authority.**

## Train, Validation, and Test Are Separated

The experimental design gives the acceptance gate a distinct held-out dataset. HotpotQA self-evolution uses 1,000 training, 1,000 validation, and 1,000 test examples. MultiChallenge uses separate training, validation, and test splits; EnterpriseArena's self-evolution study uses 20 episodes for each split. The validation set used by the gate does not overlap the test set.

The authors also avoid reporting the best test checkpoint found during search as the final result. In EnterpriseArena, an intermediate accepted checkpoint reached **95%** test survival, while the returned graph reached **85%**; the paper reports the returned graph and explicitly notes that selecting the best observed test result would amount to test-set selection.

This is important evidence hygiene. The held-out set controls adoption, while the test set remains evidence about the returned process rather than an oracle used to choose it.

## Acceptance Decisions Are Real and Non-Monotonic

The EnterpriseArena ten-round trace shows that self-evolution is not a monotonic “every proposal improves the graph” process.

The unguided baseline has **0%** full-horizon validation survival and a mean lifespan of 34.8 months. Round 1 discovers a sequential backbone and raises validation survival to **45%**. Round 2 adds durable note recall and reaches **80%**, while tool use falls sharply. Rounds 3 through 6 produce no committed update; one proposal fails structural verification before validation. Round 7 is accepted after pruning a branch, Round 8 reaches **90%** validation survival, and Round 10 is rejected because validation survival falls from 90% to **85%** and the mean validation enterprise score also declines.

The retained state therefore advances only on accepted evidence. The paper explicitly treats the round history as a search trace rather than a sequence of statistically decisive discoveries: with 20 validation episodes, one or two episodes can change an individual accept/reject outcome.

That caveat is critical for governance. A gate can be properly separated from proposal while still being noisy.

## Self-Evolution Can Repair a Bad Prior

The construction experiments show that a human-designed prior is not automatically authoritative or even helpful. On MultiChallenge, a hand-crafted expert graph reduced overall success from an unguided **87.50%** to **58.93%**. A single offline update lowered it further to **53.57%**. Iterative evolution with validation gating recovered to **92.86%**.

On HotpotQA, scratch plus online evolution reaches **78.79 F1**, outperforming the tested expert-initialized alternatives. The appendix also reports a MultiChallenge recovery in which an unsuitable prior begins at **54.0%** validation accuracy and is repaired toward roughly **93.9%** through pruning and restructuring.

The architectural implication is not that automated evolution is superior to human procedures. It is that **the provenance of a procedure does not prove its quality**. Human-authored, model-authored, and previously successful procedures all need evidence appropriate to the target environment before activation.

## Long-Horizon Guidance Changes Timing, Not Just Tool Count

EnterpriseArena runs up to 132 simulated months and includes three undisclosed crises. The Procedural Graph improves full-horizon survival for several model configurations: Claude Sonnet 4.6 rises from **44% to 58%**, Gemini 3.1 Pro from **6% to 34%**, and Grok 4.1 Fast from **26% to 40%**. Gemini 3.5 Flash still has 0% full-horizon survival under the compared main configurations, though mean lifespan improves.

The mechanism is not simply fewer tool calls. In some models tool calls increase while survival improves; in others redundant calls fall. The behavior that consistently tracks survival is earlier anticipatory financing before liquidity crises. The graph changes **which action is taken and when**, not merely how much the agent acts.

For a runtime, this reinforces that procedural structure is effect-relevant state. Changing a transition graph can change the timing and ordering of consequential actions even if the same tool catalog and model remain in place. Activating a new graph is therefore closer to deploying a new control policy than to editing a harmless note.

## Held-Out Does Not Mean Fully Independent

The Queue question asks whether validation is independent of the proposing model. The paper provides only a partial yes.

The **data** used for the validation gate are independent of the training trajectories that drive the edit proposal, and the final test set is separately held out. That is meaningful independence and prevents direct acceptance on the same examples used to propose the change.

But the **model identity** is not independent. The paper states that the solver, guidance model, and offline refiner always use the same underlying LLM in each configuration. Thus the candidate is proposed by an LLM and its validation score is produced by running a solver built on the same underlying LLM family. Some task metrics are deterministic, while others rely on benchmark-specific evaluators, including LLM judging in MultiChallenge.

The acceptance gate is therefore best described as **held-out evidence separation**, not independent organizational adjudication. Correlated model weaknesses can survive a disjoint dataset.

## Comparison with Independent QA

The September 7 Harness-of-Harness Reading separated Planner, Developer, and QA invocations around a fixed software candidate and preserved artifact state separately from evidence state. That object was about whether implementation completion can be accepted independently and remain recoverable across long software projects.

Procedural Graphs addresses a different layer. The object being changed is the **execution procedure itself**. The refiner can alter topology and transition attributes that will guide later runs. Its candidate must therefore pass an admission gate before it becomes active.

Together, the two sources suggest two separate acceptance patterns:

- **Candidate artifact acceptance:** did this version of the produced work satisfy its requirements?
- **Procedure activation acceptance:** may this changed mechanism govern future work at all?

A system that self-improves needs both. Passing QA on one output does not prove that the procedure producing it should become the new global default.

## A Bounded Activation Contract for Self-Modifying Procedures

The evidence supports the following architecture inference.

### Stable candidate identity

A proposed procedure change should exist as a candidate artifact with a version or content identity before evaluation. The active procedure must remain unchanged while the candidate is being tested.

### Structural admissibility

Deterministic checks should reject malformed or impossible structures before expensive model evaluation. This is necessary but not sufficient; the PG validator itself illustrates how structural checks can omit semantic constraints such as tool-catalog membership.

### Held-out behavioral evidence

Acceptance should consume examples or environments not used to generate the proposal. The evaluation set, metric, and current baseline must be fixed before the candidate is scored.

### Explicit adoption decision

A candidate should not become active simply because an LLM proposed it or because it improved the training trajectory. The retained active identity changes only after the configured acceptance rule is satisfied.

### Durable rejection evidence

Failed proposals should remain available as evidence so the system can avoid cycling through equivalent modifications, but they must not accidentally become executable state during recovery.

### Freshness and rollback

The active state should preserve the prior accepted version so a later evaluation, environment change, or production incident can invalidate and roll back the new procedure. The paper rolls back rejected candidates during search; it does not define a production rollback protocol, so that last step remains an engineering inference rather than a demonstrated result.

## Benchmark Improvement Is Not Production Safety

The PG gate accepts a candidate when mean held-out validation performance does not decrease. That is a performance criterion, not a safety theorem. A candidate may tie on the measured score while changing unmeasured behavior; a small validation split may miss rare failures; and the same underlying model can reproduce correlated errors across proposal and validation.

The benchmark domains include question answering, multi-turn dialogue, professional tasks, embodied execution, customer service, function calling, and long-horizon financial simulation. This breadth strengthens the claim that explicit procedural guidance can help across heterogeneous tasks, but it does not establish that the same gate is sufficient for production deployments with irreversible effects, legal constraints, security boundaries, or heterogeneous organizations.

For high-impact systems, the acceptance function may need multiple dimensions: capability, safety invariants, authorization behavior, recovery, resource limits, regression checks, and independent review. “Validation score did not decrease” should be treated as one evidence channel, not universal adoption authority.

## Failure Modes for a Self-Evolving Runtime

### Proposal-equals-adoption

A refiner writes directly into the active procedure, so there is no fixed candidate to test or reject.

### Training-loop overfit

The same trajectories that motivated the mutation are used to declare the mutation successful.

### Structural-pass overclaim

A graph passes syntax and reachability checks and is treated as semantically executable even though important environment constraints were never checked.

### Model-independence illusion

A disjoint validation set is described as fully independent even though proposal, guidance, and solver share the same underlying model and may share blind spots.

### Metric monoculture

A candidate preserves one mean benchmark score while degrading an unmeasured safety, latency, cost, authorization, or rare-event property.

### Rejected-state leakage

A rejected candidate remains in history but is accidentally restored as active state after recovery or compaction.

### Test-set selection

The system repeatedly examines test performance and activates whichever candidate looks best, converting the test set into another optimization target.

### Permanent acceptance

A procedure accepted under one environment or model version remains active after dependencies, tools, policies, or data distributions change without fresh validation.

## Evidence Strength

This is strong primary research evidence for **externalized procedural state plus held-out-gated self-evolution**. The study evaluates seven benchmark families, four LLMs in the main comparisons, multiple construction strategies, ablations, long-horizon simulation, explicit train/validation/test separation, rejected candidates, structural failures, and round-by-round rollback decisions. It also demonstrates that a flawed expert prior can be repaired and that not every proposed mutation is accepted.

The strongest support is for separating retained active procedure state from candidate mutation state and for requiring evidence outside the proposal-generating training batch before adoption. The evidence is weaker for claims of organizational independence, safety, production rollback, or transfer across unseen tool interfaces and operational environments.

## Limits and Unknowns

- The paper is a fresh primary preprint and independent replication is not yet established.
- Solver, guidance model, and refiner share the same underlying LLM in each configuration; held-out data do not remove correlated model failure.
- Several validation decisions use small samples; the authors explicitly caution against reading individual rounds as significance tests.
- Acceptance is based on benchmark score preservation or improvement, not a general safety or governance contract.
- The generic structural validator does not independently enforce every semantic constraint, including tool-catalog membership.
- Guidance is soft rather than a hard execution state machine, so the solver can still choose actions outside what a strict workflow engine might enforce.
- Localized guidance falls back to the full graph when matching fails, creating a broader context path whose production failure semantics are not deeply studied.
- The experiments do not establish exactly-once mutation, crash consistency, concurrent refiner safety, signed adoption authority, or production rollback after an accepted graph causes harm.
- Transfer across model versions, solvers, tool interfaces, and changing organizations remains future work.

## Unresolved Questions

1. What additional acceptance dimensions are required when a self-modified procedure can trigger irreversible external effects?
2. Should high-impact procedure activation require a validator based on a different model, deterministic tests, or a human/organizational authority in addition to held-out data?
3. How should a runtime prove that the candidate evaluated is byte-for-byte the procedure later activated?
4. How should acceptance evidence expire when the model, tool catalog, policy, data distribution, or environment changes?
5. What is the correct rollback contract after a previously accepted procedure causes a production incident?
6. How should rejected candidates remain available as negative evidence without becoming restorable executable state?
7. Can a multi-metric gate prevent a candidate from trading rare but severe failures for small average benchmark gains?

## Reading Conclusion

The selected evidence supports a bounded conclusion: **a self-evolving agent should be allowed to propose procedural change more freely than it is allowed to activate procedural change.** Procedural Graphs makes that separation concrete by freezing the active graph during execution, generating candidate mutations from training traces, structurally checking them, evaluating them on disjoint held-out validation data, and retaining only candidates that preserve or improve the configured score while recording rejected proposals as negative evidence. For an agent-native runtime, that is a useful minimum pattern for self-improvement governance. It is not yet a complete production-safety contract: held-out validation is independent by dataset, not by model or organizational authority, and benchmark improvement does not prove authorization safety, rollback correctness, or rare-event resilience.
