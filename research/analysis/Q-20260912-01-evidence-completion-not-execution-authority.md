---
date: "2026-09-12"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260912-01
column: digital-employee
article_type: technical-analysis
project_relevance: none
source_reading: "research/reading/Q-20260912-01-cross-substrate-authority-boundary.md"
---

# Research Analysis — Complete Evidence Is Not Execution Authority

## Research question

When the facts that determine whether an action is authorized live outside model-visible workspace and memory, which evidence must be exposed for useful planning, and which safety decision must still be enforced at the mutation boundary after the evidence is complete?

## Research themes and subject kind

- Research themes: cross-substrate authority; evidence completeness; call-time authorization; mutation-boundary enforcement; planner reliability; durable receipts; delegation security.
- Subject kinds: `governance-problem`, `research-finding`, `architecture-mechanism`, `failure-mode`, `prior-art-or-negative-result`.
- Primary sample: the Cross-Substrate Authority controlled study.
- Comparison sample: Bounded Agents and its stateful delegation chain.

The research subject is not a particular publication workflow. It is the separation between **evidence needed to interpret a state**, **a planner's proposed action**, and **authority to create an external effect**.

## Evidence identities

### E1 — research result

**Claim:** In the primary study's matched evidence-ablation experiment, authority-blind evidence produced 0/32 final semantic successes, while raw receipts and an information-equivalent typed relation each produced 32/32.

**Source:** same-date source-complete Reading Note based on arXiv:2609.08472.

**Strength:** direct controlled evidence that omitted authority facts can make correct interpretation impossible under the tested tasks. **Independent:** false.

### E2 — research result

**Claim:** The typed relation did not improve observed final-semantic planning accuracy over equal raw receipts in Experiment 1; both achieved 32/32.

**Strength:** negative evidence against attributing the improvement to typed packaging rather than information availability. **Independent:** false.

### E3 — research result

**Claim:** Evidence-complete planning remained unreliable in Experiment 2. Raw receipts produced 19/32 correct first actions; the typed relation produced 15/32, including 11/32 invalid or absent outputs and 6/16 unsafe crossed publication proposals.

**Strength:** direct controlled evidence that evidence presence does not make a probabilistic planner a reliable authorization mechanism. **Independent:** false.

### E4 — research result

**Claim:** Experiment 3 replayed the exact 32 typed-relation first-action intents with zero new model calls. A deterministic execution guard reduced unsafe crossed effects from six to zero and admitted all 12 valid authorized publish intents; four aligned rows still lacked a valid planner intent.

**Strength:** matched-intent evidence for the tested guard and predicates. It does not establish universal protection or availability. **Independent:** false.

### E5 — source-reported claim

**Claim:** The guard rechecks actor/session/attempt/artifact/scope, current workspace digest, terminal attempt state, downstream-use authorization and evidence generation immediately before mutation, then executes or records a durable hold.

**Strength:** direct mechanism evidence for the study implementation. **Independent:** false.

### E6 — source-reported claim

**Claim:** Bounded Agents carries signed delegated authority across a principal chain, narrows scope and budgets, accumulates prior actions, applies composition restrictions outside the model and binds high-impact approvals to exact action instances.

**Strength:** comparison evidence for stateful, infrastructure-level authorization. Its guarantees depend on serialized admission, complete restrictions and the paper's threat model. **Independent:** false.

### E7 — our interpretation

**Claim:** Evidence completion and execution authorization should be separate lifecycle facts. Evidence can make the planner's problem solvable; only a current, effect-local authority check can decide whether the proposed mutation is allowed.

**Source:** bounded synthesis of E1–E6.

**Strength:** supports. **Independent:** false.

## Failure / Finding / Mechanism / Implication

### Failures

1. **Observation aliasing:** two worlds are indistinguishable to the planner but require opposite safe actions because decisive authority exists on another substrate.
2. **Evidence-as-permission:** a complete receipt bundle is mistaken for authorization to execute rather than evidence to interpret.
3. **Typed-schema overclaim:** operationally useful structure is credited with semantic accuracy not shown by information-controlled comparison.
4. **Planner-only enforcement:** an unsafe but well-formed model intent proceeds directly to an irreversible effect.
5. **Artifact-authority collapse:** matching bytes are treated as sufficient even though actor, attempt, scope, action and evidence generation differ.
6. **Stale permit replay:** an earlier approval is reused after workspace, consumer scope, policy or execution epoch changes.
7. **Safe-block-as-success:** the guard prevented a dangerous effect, but the runtime reports business completion instead of an explicit hold.
8. **Availability repair by authorization layer:** a missing or invalid planner intent is silently replaced, confusing safety enforcement with task competence.
9. **Policy-opacity overconfidence:** a deterministic guard is assumed correct although its observable facts or restriction taxonomy may be incomplete.

### Findings

The strongest finding is that **authority evidence can be necessary for correct interpretation without being sufficient for safe execution**. Experiment 1 demonstrates the information boundary: when the decisive fact is omitted, correct behavior collapses; when the same fact is supplied as raw or typed evidence, the tested semantic task becomes solvable.

Experiment 2 establishes the second boundary. Even after the authority fact is available, the planner may ignore it, misapply it or fail to emit an executable intent. This prevents a governance design from treating “the model saw the policy” as a reliable authorization result.

Experiment 3 isolates the enforcement contribution. Because the intents are frozen, the safety improvement cannot be attributed to a better prompt or another model decision. The guard converts unsafe proposed actions into non-effects while admitting every valid authorized publish intent available in the fixed set. The remaining missing intents show that effect safety and task availability are different objectives.

The comparison adds a temporal dimension. Authorization may depend not only on the current request but also on inherited scope, cumulative budget and prior actions. An effect-local guard therefore needs an authoritative, versioned state relation rather than a remembered sentence or static capability list.

### Mechanism

The evidence supports an execution contract with separate identities:

- **artifact identity:** exact bytes or external object being acted upon;
- **evidence identity:** receipts that bind actor, attempt, scope, artifact, terminal state and evidence generation;
- **planner observation identity:** the authority evidence actually exposed to the model;
- **intent identity:** the exact proposed action and target occurrence;
- **authorization identity:** current decision authorizing that intent under the relevant scope and policy;
- **mutation-boundary check:** deterministic reread and comparison immediately before effect;
- **hold identity:** durable record that an intent was denied without mutation;
- **outcome identity:** completion, failure, block or partial result recorded separately from the authorization decision.

The planner may interpret incomplete or conflicting evidence and propose a course of action. It must not manufacture the missing authority fact. The executor must bind current authority to the exact intent, target and occurrence; a permit for a different artifact, consumer, attempt or generation is not reusable.

### Implication

For governed digital employees, **memory can carry authority evidence but cannot be the authority**. An execution-capable system needs current, independently observable authorization state at the location where the effect can still be stopped.

This also changes completion semantics. A safe denial is successful enforcement but not successful business completion. The runtime should preserve both facts: the guard worked, and the requested result was not produced.

## Comparisons and contradictions

The primary study and Bounded Agents converge on infrastructure enforcement outside the model, but they address different problems. Cross-substrate authority asks what happens when the decisive fact is hidden from planning and then tests a matched-intent mutation guard. Bounded Agents asks how delegated authority is narrowed and composed across principals and prior actions.

Typed authority improves validation, integration and audit, but Experiment 1 contradicts the claim that typed packaging alone improves planning when information is held equal. Deterministic enforcement also does not imply correct policy. Bounded Agents reports residual direct harm under incomplete composition restrictions, while the primary study explicitly trusts its authority store and actor allocation.

The evidence therefore rejects two symmetrical simplifications:

- “better context is enough” fails because evidence-complete planning remains unsafe;
- “a deterministic guard is automatically right” fails because the guard's facts, policy and threat model can be incomplete.

## Bounded research judgment

**A governed agent should expose enough cross-substrate authority evidence for the planner to form a useful intent, but it should never infer execution permission from evidence completeness or model interpretation. Every safety-critical effect should be admitted by a current, deterministic mutation-boundary check bound to the exact actor, attempt, artifact, target, action scope and evidence generation.**

This judgment is strongest for effects that are irreversible, externally visible, costly or security-sensitive. Lower-risk actions may justify simpler controls, but the system should still state which source owns authority and how staleness is detected.

The guard's PASS or HOLD is not the whole task result. PASS permits the effect; it does not prove semantic correctness. HOLD prevents the effect; it does not mean the business objective was completed. Those distinctions must survive audit and recovery.

## General implications

For agent runtimes and multi-agent organizations:

- preserve authority receipts outside mutable conversational memory;
- expose the decision-relevant subset to planning without treating exposure as permission;
- bind authorization to a specific action occurrence and current target digest;
- recheck policy-relevant state immediately before mutation;
- persist denials as non-effects with explicit reasons and state generations;
- distinguish artifact validity, evidence completeness, planner quality, execution authorization and business completion;
- carry cumulative scope and prior-action state across delegation rather than cloning a parent's capability set;
- make retry rules depend on whether an external effect is proven absent, proven present or unknown;
- audit the guard's observation completeness and policy coverage, not only whether its code path is deterministic.

## Limitations and counterarguments

The primary evidence uses controlled publication/code scenarios, two model routes and fixed matrices. It does not establish prevalence across arbitrary tools, organizations or multi-agent deployments. The guard trusts the authority database, actor/session allocation and cryptographic identities; compromise at those layers is outside the result.

The Bounded Agents comparison uses its own policy language, attack benchmarks and threat assumptions. Its reported utility costs and residual direct harm show that external authorization can reduce risk without solving policy completeness.

Providing every authority fact to the planner may be unnecessary or harmful to context efficiency. Some facts can remain enforcement-only if the planner can still propose a useful bounded intent. The design question is therefore not maximal disclosure, but sufficient planner evidence plus complete enforcement evidence.

## Open questions

1. Which authority facts must be planner-visible, and which can remain enforcement-only?
2. How should a permit bind a multi-step effect whose target changes during execution?
3. What event increments the evidence generation and invalidates an earlier permit?
4. How should concurrent agents reserve authority so two individually valid intents do not create a jointly unsafe result?
5. How can the authority store and policy evaluator be independently attested?
6. Which recovery path should follow a safe hold caused by a missing planner intent?
7. How should cross-session delegation retain prior-action composition history?
8. What evidence proves that a guard actually observed every policy-relevant substrate?

## Editorial recommendation

- **Article type:** technical-analysis
- **Selected modules:** research-question; three-state-boundary; evidence-ablation; planner-failure; fixed-intent-guard; authority-identity; hold-versus-completion; delegation-comparison; policy-completeness-boundary; governance-implications; limitations; open-questions
- **Core proposition:** complete authority evidence can make planning possible but cannot authorize execution; a current intent-bound mutation guard must separately decide whether the effect may occur
- **Project relevance:** none
