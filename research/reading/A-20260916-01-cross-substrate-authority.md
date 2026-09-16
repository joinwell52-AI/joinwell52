# Deep Reading — Beyond Agent Harnesses: Cross-Substrate Authority for Multi-Agent Systems

- **Item:** A-20260916-01
- **Runtime date:** 2026-09-16
- **Primary object:** *Beyond Agent Harnesses: Cross-Substrate Authority for Multi-Agent Systems*
- **Authors:** Yang Li, Sergey Volkov, Hai Liu, Zongsi Xu, Xiyu Chen, Tuo Zhou, Dian Shao, Hao Sun, Ye Lu
- **Primary source:** arXiv:2609.08472, first posted 2026-09-08
- **Object type:** systems / agent-governance research paper
- **Evidence status:** primary-source reading complete; no independent full reproduction located in this run
- **Claim discipline:** all numerical results below are source-reported unless explicitly marked as Research Center synthesis

## 1. Research question

The paper studies a narrow but consequential problem in multi-agent systems: **can two worlds expose the same planner-visible files, Git state and memory while still requiring opposite safe actions because authorization lives somewhere else?**

Its answer is yes. The paper names this the **cross-substrate authority gap**. Workspace bytes, model-visible memory, durable execution-attempt state and downstream-use authorization can live in separate substrates. If the decision-critical authority state is omitted from the planner observation, identical observations can correspond to different correct actions.

The paper is therefore not mainly about whether a model can “understand permissions.” It asks where authority facts must be represented and where they must be enforced.

## 2. Core model

For an agent attempt, the paper defines an immutable consistency view:

`V^a = <W^a, M^a, E^a, R^a>`

where:

- `W` is workspace state,
- `M` is the model-visible memory snapshot,
- `E` is external evidence,
- `R` is attempt and downstream-use authorization state.

A refresh creates a versioned successor view. The key point is that an action may be admissible only when the policy-relevant components belong to a validated relation.

The paper then defines a minimal decision relation that binds:

- actor and attempt identity,
- session and consumer scope,
- input/workspace digest,
- artifact digest,
- authorized action scope,
- terminal attempt state,
- downstream-use authorization state,
- evidence generation/version.

This is stronger than “the model saw a permission note.” It binds an authority fact to particular actors, attempts, bytes, scopes and evidence freshness.

## 3. Observation-aliasing proposition

The paper formalizes a simple but useful proposition. If two worlds expose the same planner observation `O`, but one requires `publish` and the other requires `block`, a deterministic authority-blind policy must return the same action in both worlds and therefore be wrong in at least one.

Always blocking can be safe but is not useful because it unnecessarily blocks the authorized world.

This proposition matters because it separates a model-quality problem from an information-boundary problem. If the observation does not contain the fact that distinguishes the worlds, no amount of deterministic reasoning over that observation can recover the missing state.

## 4. Experimental structure

The paper uses **CrossAgentVersionBench-Micro**, two controlled mini-benchmark families built with real Git lineage, durable execution receipts and deterministic oracles.

### Experiment 1 — what resolves authority-blind coding?

The design crosses four held-out semantic templates, two model routes, two lineage directions, two external publication states and four evidence arms, producing 128 target executions across 32 matched strata.

The arms are:

- `G0`: identity-bound Git commits, but the candidate artifact is not available by construction.
- `C0`: candidate generations and neutral context are visible, but the external authority fact is omitted.
- `R0`: canonical raw attempt/input/artifact/publication receipts are added.
- `W0`: the same admitted primitives are represented as a typed relation.

The main result reported by the authors is stark:

- G0 final semantic success: 0/32
- C0 final semantic success: 0/32
- R0 final semantic success: 32/32
- W0 final semantic success: 32/32

The R0–C0 contrast identifies the missing external authority fact as the important difference. W0 does not show an observed final-semantic advantage over equal raw information in this experiment.

### Experiment 2 — can the planner safely publish?

The second experiment tests an observation-equivalent shared worktree. The final files, ordinary Git/worktree evidence, visible memory and policy-relevant workspace digest are held fixed while writer-to-scope authorization differs between aligned and crossed worlds.

Across 96 planning calls, the authors report:

- GM0 first-action correctness: 14/32
- R0 first-action correctness: 19/32
- W0 first-action correctness: 15/32
- GM0 unsafe publication in crossed worlds: 12/16
- R0 unsafe publication: 9/16
- W0 unsafe publication: 6/16
- W0 invalid or absent outputs: 11/32

The model split is important. A lower unsafe-publish count can coexist with missing or invalid actions. The paper therefore separates safety, availability and decision quality rather than collapsing them into one score.

### Experiment 3 — can execution-time enforcement stop fixed unsafe intents?

The third experiment is the strongest causal isolation in the paper. It freezes the exact 32 W0 first-action intents from Experiment 2 and makes **zero additional model calls**. Only the execution-time validator changes.

The authors report that the W0 intents include six unsafe crossed-world publication intents. With the W1 enforcement operator:

- all 6 unsafe intents become safe non-effects,
- all 12 valid authorized publish intents are allowed,
- 0 of those 12 valid intents are denied.

Because the model intent is held fixed, the difference is attributable to the execution-time enforcement operator within this experimental matrix.

## 5. What the paper directly supports

The paper directly supports the following bounded conclusions:

1. Planner-visible workspace and memory can omit decision-critical authorization state.
2. Raw authority evidence can resolve an authority-blind task when the missing fact is supplied.
3. Exposing typed authority information to a planner does not make planning behavior reliably correct across the tested models.
4. In the fixed matched-intent experiment, an execution-time authority guard prevents the tested unsafe effects without denying the tested valid authorized intents.
5. Git can be sufficient when authenticated Git metadata itself carries the full authoritative relation required for downstream use; cross-substrate governance is needed when authorization remains external to Git/workspace state.

## 6. What the paper does not establish

The evaluation is controlled and intentionally small. It does **not** establish:

- the real-world prevalence of cross-substrate authority failures,
- end-to-end security against malicious hosts,
- security when the authority store itself is compromised,
- cryptographic actor authentication,
- broad generalization across many agent architectures and production domains,
- that one particular typed schema is universally optimal,
- that deterministic guards solve semantic business judgment,
- that every multi-agent workflow needs an “Agentic OS.”

Experiment 3 replays 32 previously generated intents. It demonstrates a mechanism on a fixed matrix; it does not estimate deployment incidence.

## 7. Trust boundary

The paper explicitly trusts:

- the harness to authenticate allocated actor/session identifiers and append terminal receipts,
- the governance store to preserve lifecycle and authorization state,
- Git and SHA-256 to identify observed bytes,
- the operator/evaluator to re-read the workspace and apply the fixed policy.

It assumes a nonmalicious host, authentic actor credentials, an uncompromised authority database and collision-resistant hashes.

That boundary should be preserved when interpreting the results. The study is about **authorization consistency under trusted-component assumptions**, not a complete adversarial security model.

## 8. Research Center synthesis

The following is our synthesis, not an author claim.

The paper suggests a useful architectural separation:

```text
Planner-visible context
        |
        v
Workspace / artifact bytes
        |
        v
Durable attempt + provenance state
        |
        v
Authority state
        |
        v
Mutation / publication boundary
```

The practical lesson is not merely “give the model more context.” It is:

> **A fact becoming visible to a planner is not the same thing as that fact being enforced at the point where an effect becomes real.**

A well-governed runtime can expose authority evidence for planning while still requiring a deterministic or otherwise independently validated permit immediately before a consequential mutation.

This also gives a sharper interpretation of Git. Git is not inherently “insufficient.” It is sufficient when its authenticated metadata is itself the authoritative carrier of actor, attempt, scope and artifact relation for the downstream effect. The cross-substrate problem begins when part of the required authority remains outside the Git-visible world.

## 9. Relationship to prior research

The paper positions itself next to work on:

- shared-memory governance and provenance,
- stale-write / concurrency control,
- provenance standards,
- supply-chain attestations,
- durable action logs,
- OS-inspired agent systems.

Its novelty boundary is narrower: it holds final bytes fixed and asks whether **actor-attempt-scope authority for downstream publication** survives across substrates.

That is materially different from stale-write rejection. Both writes can succeed and the final bytes can be identical while the correct publication decision still differs.

## 10. Independent verification status

This run found secondary explainers discussing the paper, including a September 11 DEV Community article that places the authority problem next to stale-plan and evidence-governance issues. That is contextual discussion, not an independent experimental reproduction.

No independent full reproduction of the paper's headline experimental results was located in this run.

## 11. Publication-worthy insight

The article should center one distinction:

**Agent identity is not automatically an authority boundary.**

A model session can be coherent, a shared workspace can be current, and Git can accurately identify bytes, yet the system can still lack the external fact that authorizes those bytes to cross into a downstream effect.

The most important engineering boundary is therefore not “where the model ends.” It is **where a proposed action becomes an effect**, and whether the evidence authorizing that effect still binds the current actor, attempt, scope and bytes.

## Sources

1. Yang Li et al., *Beyond Agent Harnesses: Cross-Substrate Authority for Multi-Agent Systems*, arXiv:2609.08472, 2026-09-08. https://arxiv.org/abs/2609.08472
2. Full paper HTML. https://arxiv.org/html/2609.08472
3. Brian Jin, “Fresh Context Is Not Enough: An Agent Action Needs a Valid Chain Back to Its Decision,” DEV Community, 2026-09-11. https://dev.to/kikashy/fresh-context-is-not-enough-an-agent-action-needs-a-valid-chain-back-to-its-decision-1afk

**Evidence boundary:** source-reported quantitative results are not independent reproductions. The architectural separation in Section 8 is Research Center synthesis.
