---
schema: "publication-candidate-article/v2"
title: "An Agent Is Not an Authority Boundary: What Cross-Substrate Failures Reveal"
date: "2026-09-16"
column: "digital-employee"
category: "academic"
article_type: "technical-analysis"
edition: "research-center"
research_question: "When files, visible memory and ordinary workspace evidence look the same, what additional authority state must survive until a consequential agent action becomes an effect?"
summary: "A new controlled study shows that identical planner-visible workspaces can require opposite safe publication decisions when actor-attempt authorization lives elsewhere. Its most important result is not that models reason perfectly once permissions are shown, but that execution-time authority checks can stop fixed unsafe intents without changing the model's plan."
sources: "arXiv:2609.08472; research/reading/A-20260916-01-cross-substrate-authority.md; research/analysis/A-20260916-01-cross-substrate-authority.md"
cover: "/assets/covers/academic-cross-substrate-authority-boundary.svg"
---

<ArticleCover
  image="/assets/covers/academic-cross-substrate-authority-boundary.svg"
  kicker="Digital Employee · Academic Observation 008"
  title="An Agent Is Not an Authority Boundary"
  summary="The model may see the files. It may even see the permission. What decides whether the next mutation is actually authorized?"
  version="DE008"
  status="Academic Runtime V5 · 2026-09-16"
  languageHref="/zh/digital-employee/2026-09-16-cross-substrate-authority-boundary"
  languageLabel="中文"
/>

# An Agent Is Not an Authority Boundary: What Cross-Substrate Failures Reveal

Two agent runs can end with the same files.

They can expose the same Git diff, the same visible memory, and the same candidate artifact. One should be published. The other should be blocked.

If that sounds contradictory, the missing fact is not in the files at all.

The paper **Beyond Agent Harnesses: Cross-Substrate Authority for Multi-Agent Systems**, first posted to arXiv on September 8, 2026, studies exactly this case. Its central claim is that multi-agent systems can develop a **cross-substrate authority gap**: the planner sees workspace and memory state, while the authorization that determines whether a downstream effect is allowed lives in another runtime, registry, or approval service.

That distinction is easy to miss because modern agent systems are very good at making everything look like context. A policy can be pasted into a system prompt. An approval can be summarized into memory. A shared file can record who supposedly changed it. Yet none of those representations necessarily proves that **this actor, in this execution attempt, is currently authorized to cause this effect on these bytes for this consumer scope**.

The important boundary may therefore be somewhere other than the model session itself.

## Same bytes, opposite correct actions

The paper's motivating construction is deliberately uncomfortable.

Imagine two coding agents modifying a shared policy file and its consumer. In both worlds, the downstream agent sees byte-identical final files, the same uncommitted Git evidence, and the same visible memory.

In the **aligned** world, each writer was authorized for its assigned scope. Publication is allowed.

In the **crossed** world, the writers were swapped across scopes. The final bytes happen to be the same, but the artifact must be held for reconciliation.

The planner-visible observation is identical while the correct action changes.

The authors formalize this as an observation-aliasing problem: if two worlds expose the same observation `O` but require opposite actions, a deterministic policy that only sees `O` must emit the same answer in both and therefore fail in at least one. Always blocking is safe but produces an unnecessary block in the authorized world.

This is not primarily a model-intelligence result. It is an **information-boundary result**.

If the fact that distinguishes two worlds is not present in the observation, better reasoning over that same observation cannot reconstruct the missing fact.

## Authority is not a property of “the agent”

A common abstraction is to ask whether an agent is authorized.

That is often too coarse.

The paper instead represents a decision relation that binds several facts together: actor and attempt identity, session and consumer scope, input and artifact hashes, authorized action scope, terminal attempt state, downstream-use authorization, and an evidence generation.

The point is relational.

```text
not:
    agent_A = authorized

but closer to:
    actor A
    + attempt 17
    + artifact hash H
    + consumer scope S
    + action "publish"
    + terminal state
    + downstream authorization
    + evidence generation G
    = admissible relation
```

The same agent may be authorized for one scope and not another. The same bytes may be publishable under one attempt lineage and blocked under another. A previously valid approval may become stale after the workspace changes or an authorization generation advances.

This is why “the agent had permission” is a weak audit statement unless permission is bound to the thing that actually happened.

## The paper separates three different problems

One of the paper's strengths is that it does not treat “show the model the permission” and “enforce the permission” as the same mechanism.

Its three experiments form a useful progression.

### Experiment 1: supply the missing authority fact

The first experiment uses four held-out semantic templates, two model routes, two lineage directions, two external publication states, and four evidence arms, for 128 target executions across 32 matched strata.

The authors report:

- Git-only control `G0`: **0/32** final semantic success
- candidate evidence without the authority fact `C0`: **0/32**
- canonical raw authority receipts `R0`: **32/32**
- the same admitted primitives packaged as a typed relation `W0`: **32/32**

These are source-reported results; this Academic run did not independently reproduce them.

The most useful interpretation is narrower than “typed governance solves the problem.” The `R0`–`C0` contrast shows that the missing external authority fact resolves the constructed ambiguity. The typed `W0` representation shows no observed final-semantic improvement over equal raw authority information in this experiment.

The information matters more than the packaging.

### Experiment 2: planning is still unreliable

The second experiment asks whether planners can safely decide whether to publish an observation-equivalent shared worktree.

Across **96 planning calls**, the paper reports first-action correctness of **14/32** for ordinary workspace evidence, **19/32** with raw receipts, and **15/32** with the typed relation.

In crossed worlds, unsafe publication is reported at **12/16**, **9/16**, and **6/16** respectively.

But the last number is not a simple victory: the typed-relation arm also contains **11/32 invalid or absent outputs**. The model split is especially revealing. One route avoids unsafe publication partly because many rows do not produce a valid intent; another route parses the relation but still proposes unsafe publication in several crossed cases.

That is why a single “safety score” is misleading.

A planner can be conservative because it understands the rule, or because it fails to act. A system can block unsafe effects while also blocking too much. Decision quality, unsafe-effect rate, unnecessary block rate, and missing-intent rate are different measurements.

### Experiment 3: keep the model intent fixed

The third experiment is the most important for architecture.

The researchers take the exact **32 first-action intents** from the typed-relation arm in Experiment 2 and replay them with **zero new model calls**. The model does not get another chance to reason. Only the execution-time validator changes.

The paper reports that those fixed intents contain six unsafe crossed-world publication requests. With the execution guard in place, all six become safe non-effects. At the same time, all **12/12 valid authorized publish intents** are allowed, with **0/12** denials among that valid-intent set.

Within this fixed matrix, the effect changes without changing the model's intention.

That is the critical distinction.

## Planner evidence and effect authority are different layers

A prompt can say:

> Publish only when the current actor is authorized for the artifact's scope.

The model can read that rule. It can even repeat it perfectly.

But a prompt is still part of the planner's observation. It does not, by itself, make the effect boundary enforce the rule.

The paper's experiments motivate a two-part design:

```text
planning-time:
    expose authority evidence
    let the model reason and explain

execution-time:
    validate the actor / attempt / artifact / scope relation
    recheck policy-relevant bytes
    admit or deny the mutation
```

The first layer improves informed judgment.

The second layer determines whether a proposed action becomes an effect.

This is not an argument against agent intelligence. It is an argument for giving intelligence a boundary it does not need to impersonate.

## Research Center synthesis: four substrates before one effect

The following diagram is **Research Center synthesis**, not a figure reproduced from the paper and not an architecture standard claimed by its authors.

![Conceptual synthesis of planner context, workspace bytes, durable attempt/provenance, authority state, and the mutation boundary.](/assets/figures/academic-cross-substrate-authority-layers.svg)

A useful production model separates four substrates.

### 1. Planner-visible context

This is what the model can reason over: task instructions, memory, retrieved facts, policy text, tool results, and possibly authority receipts.

Its job is to support judgment.

### 2. Workspace and artifact bytes

This answers a different question: what material currently exists?

A content digest can prove which bytes were observed. It does not necessarily prove who was authorized to produce or publish them.

### 3. Durable attempt and provenance state

This binds work to an execution occurrence: which attempt ran, whether it reached a terminal state, what inputs it used, and which artifact it produced.

Without this layer, a shared workspace can erase the relation between material and the execution that produced it.

### 4. Authority state

This answers whether the particular actor-attempt-artifact-scope relation is currently permitted to cross into a downstream effect.

The final mutation boundary should consume the relevant relation, not infer it from a conversational summary.

The resulting principle is simple:

> **Evidence may be visible to the model before an action, but authority must still survive until the action becomes real.**

## Git can be enough — when Git actually carries the authority

This paper should not be reduced to “Git is insufficient.”

The authors explicitly preserve an important negative control: authenticated commits can carry the needed authority relation when their metadata is authoritative for downstream use.

If a commit reliably binds actor, attempt, scope, artifact, and the relevant approval state, Git can be the authority boundary.

Cross-substrate governance becomes necessary when some required fact remains elsewhere: an approval service, a task runtime, a revocation registry, a mutable evidence generation, or an uncommitted shared workspace.

So the better question is not:

> Git or an Agentic OS?

It is:

> **Where does the authoritative relation live, and can the downstream effect validate it without guessing?**

That formulation is much more portable.

## “Completed” and “approved for downstream use” are not synonyms

Another useful distinction in the paper's relation is the separation between an attempt's terminal state and downstream-use authorization.

An agent may successfully complete a task without its output being approved for publication.

A review can approve an artifact and later be invalidated by workspace drift.

A publishable artifact can remain identical while the actor attempting to publish it changes.

Collapsing these states into one boolean such as `done=true` creates exactly the kind of ambiguity the paper is designed to expose.

For durable agent work, at least these questions should remain independent:

```text
Did the work finish?
Which attempt produced these bytes?
Are these still the same bytes?
Was downstream use approved?
For which actor and scope?
Is that approval still current?
```

A lifecycle state answers only part of the story.

## The paper is not a complete security model

The evidence boundary matters.

The experiments are controlled mini-benchmarks over two four-template families and two model routes. Experiment 3 reuses 32 previously generated intents. The authors explicitly say that deployment prevalence requires a separate sampling design.

The study also assumes a nonmalicious host, authentic actor credentials, an uncompromised authority database, and collision-resistant hashes.

It does not solve:

- malicious-host compromise,
- stolen actor credentials,
- cryptographic identity at scale,
- multi-tenant policy composition,
- semantic business judgment,
- every possible concurrency or recovery failure.

The result is strongest when read as a mechanism study: **when authority state is decision-critical and hidden outside the planner-visible substrate, exposing it helps resolve ambiguity, but reliable downstream effects still benefit from an independently validated execution boundary.**

That is already a substantial result. It does not need to become a universal security claim.

## Safety and availability should be reported separately

The planning experiment also offers a measurement lesson.

A system that denies every action can produce zero unsafe publications. That does not make it useful.

A model that emits no valid action in difficult cases may appear safer on one denominator while failing availability on another.

Production dashboards should therefore separate at least:

- unsafe effects,
- valid authorized effects admitted,
- unnecessary blocks,
- invalid or missing intents,
- stale-evidence denials,
- recovery-required cases.

This is a healthier pattern than one composite “agent safety” number.

It also helps locate responsibility. Planner quality and execution enforcement can improve independently.

## A practical rule for digital work

The paper's practical lesson can be stated without adopting any particular operating-system metaphor:

**Do not make the agent session itself the proof that an effect is authorized.**

Let the model reason about evidence. Let it propose actions. Let it explain why a publication, database write, handoff, or external call appears justified.

But before a consequential mutation crosses the boundary, make the system answer a more exact question:

> Does the current, validated relation still authorize **this actor, this attempt, this artifact, this action, for this consumer scope, under this evidence version**?

If the answer cannot be established, the system should preserve the uncertainty as a block or reconciliation state rather than manufacture authority from context.

That is different from distrusting the model.

It is recognizing that **reasoning and authorization are different jobs**.

## What remains open

The next research questions are not small.

How should authority relations work across organizations? How should revocation propagate when artifacts have already been handed off? When can a signed Git commit substitute for an external registry? Which predicates should be deterministic, and which require human or model judgment? How should a recovered runtime prove that a prior external effect did or did not occur? How should an authority store itself be audited or replicated?

Those questions extend beyond this paper's fixed experiments.

But the current work makes one design mistake harder to defend: treating a coherent model context as if it were also the final authority boundary.

The agent can know.

The workspace can match.

The plan can make sense.

And the effect can still be unauthorized.

## Sources and evidence boundary

1. Yang Li, Sergey Volkov, Hai Liu, Zongsi Xu, Xiyu Chen, Tuo Zhou, Dian Shao, Hao Sun, Ye Lu, **Beyond Agent Harnesses: Cross-Substrate Authority for Multi-Agent Systems**, arXiv:2609.08472, first posted 2026-09-08 — https://arxiv.org/abs/2609.08472
2. Full paper HTML — https://arxiv.org/html/2609.08472
3. Brian Jin, **Fresh Context Is Not Enough: An Agent Action Needs a Valid Chain Back to Its Decision**, DEV Community, 2026-09-11 — https://dev.to/kikashy/fresh-context-is-not-enough-an-agent-action-needs-a-valid-chain-back-to-its-decision-1afk
4. Governed Deep Reading — `research/reading/A-20260916-01-cross-substrate-authority.md`
5. Governed Research Analysis — `research/analysis/A-20260916-01-cross-substrate-authority.md`

**Evidence boundary:** the arXiv paper is the primary evidence for this Academic object. All experimental counts are treated as source-reported and were not independently reproduced in this run. The four-substrate model and the “authority as a relation that survives to the mutation boundary” framing are Research Center synthesis. The secondary DEV Community article is contextual commentary, not an independent reproduction.
