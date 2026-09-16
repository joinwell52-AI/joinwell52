---
date: "2026-09-16"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260916-03
column: open-source-engineering
article_type: technical-analysis
project_relevance: none
source_reading: "research/reading/Q-20260916-03-skill-routing-runtime-boundary.md"
---

# Research Analysis — Skill Routing Is Selection Evidence, Not Execution Authority

## Research question

If an Agent runtime selects skills on demand instead of permanently preloading them, what can a correct routing decision actually prove, and which downstream facts must remain separate before the system may execute or declare success?

## Research themes and subject kind

- Research themes: skill routing; runtime selection; context efficiency; attribution; skill versioning; execution authority; outcome evidence.
- Subject kinds: `research-finding`, `architecture-mechanism`, `governance-problem`, `failure-mode`.
- Primary sample: The Router Within / Gavel and its SkillTraj evaluation.

The research subject is not whether one router benchmark score is high enough for production. It is whether **skill selection can become a separately observable runtime decision without being confused with permission to execute or proof that execution succeeded**.

## Evidence identities

### E1 — source-reported routing result

**Identity:** `source-reported-claim`.

**Claim:** In the reported Qwen3-32B setting, Gavel reaches 90.9% Correct-skill Trigger on the evaluated skill-use task.

**Strength:** direct benchmark evidence for routing accuracy under the tested setup. **Independent:** false.

### E2 — source-reported transfer result

**Identity:** `source-reported-claim`.

**Claim:** SkillTraj contains 372 trajectories across four scenarios, and the reported method remains strong across the evaluated routing/skill-use settings rather than only one static benchmark.

**Strength:** bounded transfer evidence for the router as a reusable component. **Independent:** false.

### E3 — source-reported mechanism

**Identity:** `public-fact`.

**Claim:** The system uses a lightweight hidden-state glance, a skill bank and an explicit routing/adjudication layer to decide which skill material should be loaded instead of keeping all skill metadata permanently in context.

**Strength:** direct mechanism evidence for selective loading. **Independent:** false.

### E4 — source limitation

**Identity:** `public-fact`.

**Claim:** Correct routing in the reported benchmark does not establish downstream task completion, tool authorization, external-effect safety, skill quality, policy compliance or exactly-once execution.

**Strength:** explicit boundary drawn from the same-day Reading Note and benchmark scope. **Independent:** false.

### E5 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** Skill routing should be represented as an attributable selection-plane event that binds request/context identity, router decision, confidence or adjudication evidence, and the exact loaded skill versions. It should not itself create permission to invoke a tool or mutate external state.

**Strength:** architectural synthesis from E1–E4. **Independent:** false.

### E6 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** The runtime should preserve at least three distinct facts after routing: `selected skill`, `authorized operation`, and `observed outcome`. These facts may agree, conflict or remain unknown independently.

**Strength:** governance recommendation; not a schema standardized by the source. **Independent:** false.

### E7 — open question

**Identity:** `open-question`.

**Claim:** The evidence does not establish routing reliability under rapidly changing skill catalogs, adversarial skill descriptions, cross-role authorization, concurrent version updates or long-running enterprise sessions.

## Failure / Finding / Mechanism / Implication

### Failures

1. **Permanent-preload saturation:** every skill is injected into context whether relevant or not, increasing context cost and ambiguity.
2. **Route-as-authority:** selecting a relevant skill is treated as permission to execute all operations exposed by that skill.
3. **Skill-name aliasing:** routing records only a human-readable skill name and loses the exact version/content identity that was loaded.
4. **Outcome collapse:** a correct route is counted as task success even when execution later fails or is denied.
5. **Authorization collapse:** skill metadata contains tool instructions and the runtime interprets those instructions as authority rather than advice.
6. **Stale-catalog routing:** a decision references a skill version that changed before execution.
7. **Opaque fallback:** routing failure silently falls back to a broad/default skill set, preventing attribution of why the later behavior occurred.
8. **Multi-skill composition ambiguity:** several individually reasonable skills combine into an operation whose permissions or effects are not independently checked.

### Findings

The primary evidence supports treating routing as a genuine runtime component rather than a prompt-construction convenience. Its decision can be measured independently, calibrated, compared across scenarios and integrated with an actual agent harness. That makes the selection event an engineering object worth recording.

The same evidence also defines what routing does not prove. A high Correct-skill Trigger rate is evidence that the system chose the intended skill under the benchmark labels. It says nothing about whether the selected skill is authorized for the current actor, whether a tool call is allowed now, whether the skill's instructions are correct, or whether the external task eventually completes.

This advances the earlier skill-compression/routing work by making the runtime boundary explicit. The important architectural move is not merely “load fewer tokens”; it is **turn skill selection into a versioned, attributable decision plane whose output is consumed by—but does not replace—authorization and execution**.

### Mechanism

A governed on-demand skill path can preserve the following identities.

**Request / context identity**

- task or operation identity;
- relevant bounded context digest;
- actor/role and execution epoch;
- applicable policy generation.

**Skill catalog identity**

- catalog/version digest;
- candidate skill IDs and exact content/version hashes;
- eligibility filters applied before semantic routing.

**Routing decision identity**

- selected skill or explicit no-skill result;
- router/model/version;
- confidence, ranking or adjudication evidence when available;
- timestamp and request binding.

**Loaded-skill identity**

- exact versions actually inserted into the worker context;
- load order/composition;
- any transformation or truncation between catalog and context.

**Authorization identity**

- exact proposed operation/tool/target;
- current permission/approval decision;
- call-time policy facts independent of the router.

**Outcome identity**

- execution result;
- external-effect evidence;
- completion/acceptance state;
- failure or block reason.

The router can reduce the candidate context. It cannot manufacture missing execution permission, and its correctness should not be backfilled from a successful outcome or vice versa.

### Implication

A modular Agent runtime can use routing to keep skills out of permanent context while still making skill use auditable. The key is to make the router's decision durable enough to answer: which skill version was selected, why was it available, which version was actually loaded, what operation did the worker subsequently propose, who authorized that operation, and what happened afterward?

This creates a cleaner failure taxonomy. `route wrong`, `skill stale`, `operation unauthorized`, `tool failed`, `effect unknown`, and `business incomplete` can be separate states instead of one undifferentiated Agent failure.

## Comparison and contradictions

Earlier work on skill compression showed that routing can reduce context overhead, but a compression view alone can obscure governance. Today's evidence supports a stronger interpretation: routing is an observable selection plane. That plane can improve relevance and cost while leaving authorization and completion to different evidence owners.

The opposite architecture—preload every skill—can simplify selection because no explicit router decision is needed. For small static skill sets that may be reasonable. The trade-off is that the runtime loses an explicit point at which to record eligibility, version choice and selection rationale, while context competition may increase.

A high router benchmark score also should not be converted into a blanket trust score for downstream execution. Routing labels generally evaluate relevance, not authority or effect safety. These are different objective functions.

## Bounded research judgment

**Skill routing should be treated as a versioned, attributable runtime selection event. It may decide which skill material becomes available to the worker, but it must remain separate from call-time execution authorization and from downstream outcome/acceptance evidence. Correct routing proves selection quality under the tested labels; it does not prove that the selected operation is permitted, safe or complete.**

The primary evidence supports selective loading and independent evaluation of the router. It does not establish a production authorization protocol or long-horizon enterprise reliability.

## General implications

- move large skill catalogs out of permanent prompt context when on-demand routing is viable;
- version the catalog and exact skill content selected for each execution epoch;
- preserve explicit no-skill / ambiguous-route outcomes rather than silently loading everything;
- separate skill eligibility from semantic routing;
- separate semantic routing from call-time authorization;
- bind authorization to the exact later operation/target rather than the selected skill name;
- preserve downstream result/effect evidence independently from route correctness;
- make multi-skill composition visible as its own decision rather than an opaque prompt concatenation;
- re-route when catalog/version or relevant bounded context changes materially.

## Limitations and counterarguments

The reported benchmark is finite and curated, with 372 SkillTraj trajectories and specific models/scenarios. Correct-skill labels do not cover every enterprise ambiguity, and the study does not establish adversarial robustness of skill descriptions, permission safety, cross-role isolation or long-duration catalog churn.

Explicit routing adds another model/decision surface that can fail. For small systems, static explicit skill attachment may be simpler and more reliable. The architectural recommendation therefore concerns systems where skill count, context cost or dynamic eligibility justify a separate selector.

## Open questions

1. Should deterministic eligibility filtering happen before semantic routing, after it, or both?
2. How should router confidence interact with a human or manager approval threshold?
3. What invalidates a routing decision when a skill version changes before execution?
4. How should several routed skills compose without implicitly combining their permissions?
5. What evidence should be retained when the router selects no skill or multiple ambiguous candidates?
6. Can routing benchmarks incorporate authorization and downstream completion without collapsing those identities?
7. How should recovery decide whether to reuse a previous route or route again after partial execution?

## Editorial recommendation

- **Article type:** technical-analysis
- **Selected modules:** research-question; routing-benchmark-evidence; selective-loading-mechanism; routing-decision-identity; skill-version-binding; authorization-separation; outcome-separation; limitations; open-questions
- **Core proposition:** skill routing is an attributable selection plane; it chooses context, not permission, and its correctness must remain separate from execution authority and completion evidence
- **Project relevance:** none
