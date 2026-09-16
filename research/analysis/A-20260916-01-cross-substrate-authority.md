# Research Analysis — Agent Is Not an Authority Boundary

- **Item:** A-20260916-01
- **Runtime date:** 2026-09-16
- **Primary evidence:** arXiv:2609.08472
- **Evidence level:** primary research + controlled experiments; no independent full reproduction located
- **Analysis type:** architecture and governance interpretation

## Executive finding

The paper *Beyond Agent Harnesses: Cross-Substrate Authority for Multi-Agent Systems* makes a narrow systems argument with broad architectural implications: **planner-visible state can be complete relative to the workspace and still be incomplete relative to authority**.

Its experiments separate three questions that are often collapsed:

1. Does the planner have the relevant authority evidence?
2. Does the planner interpret that evidence correctly?
3. Does the runtime independently enforce authority before a consequential effect?

The paper's strongest result is not that a typed relation makes models reason reliably. In fact, the planning results are explicitly mixed. The strongest result is the matched-intent enforcement experiment: fixed model intents that include unsafe publish requests are stopped by an execution-time guard, while the valid authorized intents in that fixed matrix are allowed.

That suggests an engineering principle: **use models to reason about authority, but do not require model reasoning to be the final mechanism that creates authority.**

## 1. Four states that should not be collapsed

A durable agent system should distinguish at least four state families.

### A. Artifact state

What bytes exist now? Which files, diffs or generated artifacts are present?

This can often be represented well by a workspace and content hashes.

### B. Provenance / attempt state

Which execution attempt produced which bytes? Did that attempt reach a terminal state? What inputs did it bind?

A shared workspace alone may not preserve this relation, especially before a commit or after multiple actors have mutated the same worktree.

### C. Decision state

What judgment did the agent or organization make based on available evidence?

This can be model-generated, deterministic, human-approved or mixed.

### D. Authority state

Is this actor/attempt/scope currently permitted to turn the artifact into a downstream effect?

This can live in a registry, runtime, approval record or other control substrate.

A system can have the same artifact bytes and the same visible memory while D differs. That is the paper's central construction.

## 2. Why “just put the permission in context” is insufficient

Planner exposure is useful. The paper's first experiment shows that when the missing authority fact is supplied as raw receipts or a typed relation, the semantic task becomes solvable in the controlled coding matrix.

But Experiment 2 shows why exposure alone is not an enforcement strategy. Even with more explicit authority evidence, first-action planning remains imperfect and model-dependent.

This matters for prompt-centric governance. A system prompt can state:

> only publish if actor X is authorized for scope Y.

The model can still ignore, misparse or inconsistently apply that instruction. The problem is not that prompts are useless. The problem is that **a prompt is an observation and reasoning mechanism, not a mutation boundary**.

## 3. The mutation boundary is where governance becomes operational

The matched-intent experiment isolates the role of an execution guard. It does not ask a better model to reconsider. It passes the same intent through a validator that rechecks the actor/session/attempt/artifact/scope relation and the current scope digest.

Within the fixed experimental matrix, this converts unsafe intents into safe non-effects.

That is a different category of control from planner guidance:

```text
Planner:
  "I think publish is appropriate."

Runtime:
  "Does this exact actor/attempt/artifact/scope relation currently authorize publish?"

Effect:
  occurs only if the runtime check admits it.
```

This split lets model intelligence remain useful without making model compliance the sole security or governance boundary.

## 4. Git is conditional infrastructure, not the villain

A shallow reading would conclude “Git cannot solve agent authority.” The paper is more precise.

Git can carry enough authority when authenticated commits bind the relevant actor, attempt, scope and artifact, and when those facts are themselves authoritative for downstream use.

Cross-substrate governance becomes necessary when the decision requires facts outside the Git-visible world: external approval, task-level scope, execution-attempt terminality, mutable authorization generations, or shared uncommitted workspace provenance.

So the architecture question is not Git versus an Agentic OS. It is:

> **Where does the authoritative relation live, and can the downstream mutation validate it without guessing?**

## 5. Why this matters for multi-agent systems

Multi-agent systems amplify attribution ambiguity.

A shared file does not necessarily tell a downstream worker:

- which role was authorized to produce it,
- whether the relevant attempt actually finished,
- whether another agent replaced its bytes later,
- whether approval was revoked after generation,
- whether the consumer scope is the same scope for which the artifact was approved.

The temptation is to infer these facts from chat history or final files. The paper demonstrates why that inference can be underdetermined by construction.

This suggests that formal collaboration protocols should preserve more than content. They should preserve **actor–attempt–artifact–scope relations** as durable facts.

## 6. Research Center synthesis: authority should travel as a relation

Our synthesis is to treat authority as a relation rather than an attribute attached to “the agent.”

Bad abstraction:

```text
agent_A.is_authorized = true
```

More useful abstraction:

```text
permit = {
  actor,
  attempt,
  consumer_scope,
  input_digest,
  artifact_digest,
  action_scope,
  attempt_terminal_state,
  downstream_authorization,
  evidence_generation
}
```

This does not require adopting the paper's exact schema. The important shift is relational: authorization is meaningful only with respect to **who, which attempt, which bytes, which action, which consumer scope and which evidence version**.

The same agent can be authorized for one effect and unauthorized for another. The same artifact can be publishable under one execution lineage and blocked under another.

## 7. Safety and availability need separate metrics

The paper usefully keeps unsafe publication, correct first action, unknown output and unnecessary block separate.

That matters because a system can look “safe” by refusing everything. A model route can also show fewer unsafe effects simply because it fails to produce valid actions.

A production governance dashboard should therefore avoid one aggregate “safety score.” It should separately report:

- unsafe effect rate,
- authorized-effect pass rate,
- unnecessary blocks,
- invalid/missing intents,
- recovery-required cases,
- evidence freshness failures.

A deterministic guard can improve effect safety while planner availability remains poor. Those are different problems owned by different layers.

## 8. Boundaries of the current evidence

The paper's controlled construction is valuable precisely because it isolates one mechanism. The same narrowness limits extrapolation.

We should not claim:

- that cross-substrate authority failures dominate production incidents,
- that the benchmark reflects enterprise prevalence,
- that the guard architecture is complete security,
- that authority databases cannot themselves be attacked,
- that all business decisions can be reduced to deterministic permits.

The experiments assume trusted host and authority components. A malicious host could require cryptographic or hardware-backed mechanisms not evaluated here.

## 9. Product and protocol implications

Without tying the article to a specific implementation, the research suggests several requirements for durable digital work systems:

1. **Do not infer authorization solely from final content.**
2. **Record terminal execution attempts durably.**
3. **Bind artifacts to the attempts and inputs that produced them.**
4. **Version authorization/evidence state so stale permits are visible.**
5. **Recheck policy-relevant bytes immediately before consequential mutation.**
6. **Separate planner explanation from enforcement.**
7. **Make denials durable events, not invisible tool failures.**
8. **Preserve the distinction between completion and downstream-use approval.**

This is a natural extension of “files are facts” only if the files themselves preserve the relevant authority relation. Otherwise, a file is merely one substrate among several.

## 10. Editorial thesis

The public article should avoid turning the paper into a slogan like “agents need an OS.” The more durable lesson is narrower and more useful:

> **An Agent is a reasoner and actor, but it is not automatically the boundary that grants an effect. Authority belongs to a verifiable relation between actor, attempt, artifact, scope and current authorization state.**

The strongest narrative sequence is:

- same bytes can require opposite decisions,
- missing authority cannot be reasoned out of an identical observation,
- exposing evidence helps but planning remains unreliable,
- execution-time validation changes effects without changing the model intent,
- therefore authority must survive until the mutation boundary.

## 11. Counterarguments

### “A sufficiently capable model can follow the rule.”

Capability can improve planning quality, but the paper intentionally separates model intent from enforcement. If correctness at the effect boundary depends entirely on model compliance, planner error and enforcement failure become the same failure mode.

### “Just isolate each agent in its own Git branch.”

Isolation can solve many provenance and concurrency problems. It does not automatically encode external approval, revocation, consumer scope or mutable downstream-use authority. When Git metadata itself is authoritative and complete, the paper explicitly allows Git to be sufficient.

### “Always require human approval.”

Human approval can be appropriate for high-risk effects, but it should still be a durable authority fact bound to scope/artifact/evidence version. A human click stored without those bindings can become stale or ambiguous too.

### “A deterministic guard cannot understand semantic business context.”

Correct. The claim is not that every judgment should be deterministic. The guard should enforce those authority predicates that the system can make explicit. Semantic judgment may remain model or human work upstream.

## 12. Publication decision

**Publishable as Academic Observation 008**, with a strict evidence boundary:

- quantitative findings attributed to the paper,
- no claim of independent reproduction,
- secondary commentary labeled as commentary,
- the “authority as relation / mutation-boundary” architecture explicitly labeled Research Center synthesis,
- no claim that Git is categorically insufficient,
- no claim that the paper proves production prevalence.

## Sources

1. Yang Li et al., *Beyond Agent Harnesses: Cross-Substrate Authority for Multi-Agent Systems*, arXiv:2609.08472, 2026-09-08. https://arxiv.org/abs/2609.08472
2. Full paper HTML. https://arxiv.org/html/2609.08472
3. Brian Jin, “Fresh Context Is Not Enough: An Agent Action Needs a Valid Chain Back to Its Decision,” DEV Community, 2026-09-11. https://dev.to/kikashy/fresh-context-is-not-enough-an-agent-action-needs-a-valid-chain-back-to-its-decision-1afk
