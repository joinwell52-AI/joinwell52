# Q-20260912-01 — Planner-Visible Context Is Not an Authorization Boundary When Authority Lives Across Substrates

- Runtime date: 2026-09-12 (Asia/Shanghai)
- Queue signal: SIG-20260912-004
- Primary research source: https://arxiv.org/html/2609.08472
- Comparison source: https://arxiv.org/html/2608.15888v1
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When the facts that determine whether an action is authorized live partly outside model-visible workspace and memory, which evidence must be exposed to planning, and which safety decision must remain enforced at the actual mutation boundary even after the evidence is made complete?

## Problem

A long-lived agent can hold an apparently coherent workspace and memory while the authority needed to use the resulting artifact is stored elsewhere: in a runtime, approval service, execution registry or durable receipt. In that setting, two worlds can have byte-identical files and equivalent planner-visible memory but require opposite safe actions. The primary paper names this the **cross-substrate authority gap**.

The central distinction is between three different mechanisms that are easy to collapse into one:

1. preserving or retrieving the authority evidence needed to interpret the current state;
2. asking a probabilistic planner to reason correctly from that evidence;
3. enforcing the resulting action at the boundary where an external effect would actually occur.

The experiments deliberately separate those three layers.

## Primary Study Design

The paper uses two controlled benchmark families built from real Git lineage, durable agent execution attempts and deterministic oracles. It evaluates two model routes and three experiments.

The authority relation binds actor/attempt identity, consumer scope, input/workspace digest, artifact digest, authorized action scope, terminal attempt state, downstream-use authorization state and an evidence generation/version. The paper treats semantic correctness separately from this authority relation.

The trust model is bounded: the harness authenticates its allocated actor/session identifier and appends terminal receipts; the governance store preserves lifecycle and downstream-use authorization state; Git/SHA-256 identify observed bytes; and the fixed evaluator rereads the workspace and applies policy. The experiments do not model a malicious host, compromised authority database, forged actor credentials or broken hashes.

## Experiment 1 — Missing Authority Evidence Creates an Observation-Aliasing Failure

Experiment 1 crosses four held-out semantic templates, two model routes, two lineage directions, two external publication states and four evidence arms, producing 32 matched strata and 128 target executions.

The key arms are:

- `C0`: candidate artifacts and neutral context are visible, but the authority fact is omitted.
- `R0`: the same context plus canonical raw attempt/input/artifact/publication receipts.
- `W0`: the same admitted authority primitives represented as an independently validated typed relation.

The primary outcome is final semantic success. The results are decisive about the missing-information question:

- C0: **0/32** final semantic success.
- R0: **32/32** final semantic success.
- W0: **32/32** final semantic success.

The R0–C0 contrast has 32 favorable and zero unfavorable discordant pairs. Raw receipts therefore supply the decision-relevant fact missing from authority-blind evidence. The typed relation does **not** show an observed final-semantic planning advantage over equal raw information: W0 and R0 both reach 32/32.

This is an important negative result. A typed schema may improve validation, integration, enforcement, recovery and audit, but the experiment does not support the stronger claim that typed packaging itself makes a planner semantically more accurate when the underlying information is held equal.

## Experiment 2 — Evidence Completion Does Not Make Planning Reliably Safe

Experiment 2 constructs aligned and crossed worlds with the same final worktree, ordinary Git/worktree evidence, scope digest and visible memory. Only the writer-to-scope authority binding changes the correct action.

Across 96 provider calls:

- ordinary workspace-visible evidence (`GM0`) produces **12/16 unsafe publication decisions** in crossed worlds;
- raw receipts (`R0`) achieve **19/32** correct first actions overall;
- typed relation (`W0`) achieves **15/32** correct first actions and has **11/32 invalid or absent outputs**;
- W0 still proposes **6/16 unsafe publications** in crossed cases.

The model split matters: one route often fails to emit a valid intent, while another parses reliably but still proposes unsafe publication. This means “the planner saw the authority fact” and “the planner produced a safe executable decision” are distinct properties.

The study therefore does not support moving authorization into model reasoning merely because the model has better memory or a typed authority object.

## Experiment 3 — Fixed-Intent Execution Guard Separates Decision Quality from Effect Safety

Experiment 3 freezes the exact 32 W0 first-action intents from Experiment 2 and makes **zero additional model calls**. Only the execution-time validator changes.

The guard validates actor/session/attempt/artifact/scope, rechecks the policy-relevant workspace digest immediately before mutation, and either executes the effect or records a persistent hold without mutation.

On the fixed matrix:

- W0 contains **6/16 unsafe crossed publication intents**;
- with the execution guard, unsafe effects become **0/16**;
- all **12/12 valid authorized publish intents** are permitted and executed;
- there are **0/12 guard denials** among those valid authorized intents.

Four aligned rows lacked a valid planner intent; the guard cannot manufacture availability when the model fails to produce an executable action. The experiment therefore supports a narrower claim: the deterministic operator prevented the unsafe **fixed intents** it was asked to validate. It does not prove that planning becomes reliable or that all future deployment attacks are covered.

## Artifact Identity, Authority Identity and Freshness

The primary paper's minimal relation explicitly separates artifact bytes from authorization state. A content digest answers which bytes are present. A downstream-use permit additionally binds who acted, which execution attempt produced the material, for which consumer scope, whether that attempt is terminal, what downstream action is authorized and which evidence generation is current.

This matters because a receipt can become stale even when the artifact digest still matches. Reusing a prior authorization across a different consumer scope, attempt, workspace generation or downstream action is therefore a different failure from ordinary content drift.

For a governed agent runtime, `artifact_valid=true` and `action_authorized=true` should not be the same state variable.

## Comparison — Stateful Delegation Reaches the Same Boundary from a Different Problem

`Bounded Agents` studies a different but complementary authorization problem. Its Agentic Principal Chain carries a signed session-level authorization state across a principal chain, narrows scope and budgets at every delegation hop, accumulates prior-action state and checks prohibited action compositions outside the model.

Important mechanisms include:

- authority scope is narrowed by set intersection while restrictions accumulate by union;
- child delegation cannot widen inherited authority;
- cumulative budget consumption is inherited, so reachable blast radius is non-increasing under the theorem's assumptions;
- composition closure evaluates proposed actions against prior session actions, not as isolated requests;
- intent is pre-declared by the session initiator rather than inferred from model behavior;
- evidence-sink availability is a precondition for action admission;
- high-impact approval tokens are bound to the exact action instance and are single-use/expiring.

The evaluation gives useful supporting evidence for infrastructure-level authorization. Under its compromised-model protocol, AgentDojo exfiltration falls to 0% in all four domains and all 544 InjecAgent data-stealing cases are blocked. But the limits are material: single-action misuse within authorized scope remains outside composition closure; direct harm remains 60.4% in the InjecAgent static evaluation under complete composition restrictions; utility decreases in several AgentDojo suites; session splitting is explicitly admitted because composition state is per-session; policy completeness, serialized admission and action taxonomy quality are assumptions; production deployment data is absent.

This comparison strengthens the architectural pattern without proving equivalence. The cross-substrate paper asks what happens when decisive authority evidence is outside planner observation. Bounded Agents asks how delegated authority can be narrowed and evaluated across stateful action histories. Both place final enforcement in infrastructure outside the model.

## Failures and Negative Evidence

### Authority-blind observational equivalence

Identical planner-visible state can require opposite safe actions. No deterministic planner policy over that observation can be correct in both worlds.

### Evidence-present but planner-wrong

Raw or typed authority evidence can be present and still be ignored, misread or converted into an invalid/missing action.

### Typed-representation overclaim

The typed relation is useful operationally, but Experiment 1 does not show a planning-accuracy gain over equal raw receipts.

### Guard cannot repair missing intent

The execution guard prevents unsafe effects among supplied intents. It cannot turn a missing/invalid planner intent into a useful action.

### Trusted-authority assumption

The main experiment trusts actor allocation, authority storage and hashes. Compromise of that control plane is outside the demonstrated guarantee.

### Deployment-generalization limit

The paper uses controlled publication/code scenarios and fixed matrices. Broader tool classes, parent–subagent chains, multi-tenant policy composition and real production prevalence remain open.

### Stateful-delegation residuals

The comparison paper shows that authorization policies themselves can be incomplete or coarsely classified. External enforcement is not automatically correct merely because it is deterministic; its observable facts and policy coverage must be adequate.

## Evidence Classes

### Fact

The primary study uses real Git lineage, durable execution receipts, fixed deterministic oracles and two model routes; its Experiment 1/2/3 denominators and results are directly reported in the paper.

### Research Result

Missing authority evidence accounts for the Experiment 1 semantic-success gap; planning remains unreliable after authority evidence is exposed; a matched-intent guard prevents all six unsafe fixed intents from becoming effects while admitting all twelve valid authorized publish intents.

### Inference

A governed agent runtime should preserve authority evidence as a separately versioned substrate and enforce safety-critical mutation with a deterministic boundary check whose inputs are independently observable.

### Unknown

The evidence does not establish universal attack prevalence, end-to-end security under a compromised authority database, or that one typed authority schema is optimal across arbitrary organizations and tools.

## Implications for Governed Digital Employees

A useful architecture needs at least four separately identifiable states:

1. **artifact state** — what bytes or external object currently exist;
2. **evidence state** — which durable observations/receipts bind actor, attempt, scope and artifact;
3. **planner state** — what evidence the model has actually been shown and how it interprets it;
4. **execution-authority state** — whether the requested effect is currently allowed at the mutation boundary.

The model may assist with semantic judgment, but the authority needed for a high-impact effect should not be reconstructed from remembered prose. The executor should reread current authoritative state, bind it to the exact target/action occurrence and fail closed when required evidence is missing or stale.

## Unresolved Questions

1. Which authority facts must be in model context for useful planning, and which can remain enforcement-only?
2. How should an execution permit bind a multi-step effect whose target changes between planning and mutation?
3. What generation/freshness rule invalidates a previously valid authority relation after policy or organizational state changes?
4. How should concurrent agents serialize or atomically reserve authority so a guard does not pass two individually valid but jointly unsafe actions?
5. Can the authority database itself be independently attested without making the planner trust a second opaque control plane?
6. When a planner emits no valid intent, which recovery path preserves safety without silently converting a safe block into task success?
7. How should cross-session delegation/state be linked so session splitting cannot reset composition history?

## Reading Conclusion

The source-complete evidence supports a bounded conclusion: **evidence completeness and execution authorization are separate layers**. Making cross-substrate authority visible can repair an otherwise impossible interpretation problem, but it does not make probabilistic planning reliably safe. The strongest evidence for effect safety in the study comes from a deterministic guard that validates current authority and workspace binding at the mutation boundary on the exact same model-generated intent. This does not make every deterministic policy correct; it means safety-critical authorization should be implemented where the policy-relevant facts are observable and where an unsafe proposed effect can still be stopped.

This Reading Note performs evidence extraction only. It does not execute Research Analysis, article writing, visualization, Production or Publication.
