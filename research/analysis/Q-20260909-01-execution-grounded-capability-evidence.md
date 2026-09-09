---
date: "2026-09-09"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260909-01
column: digital-employee
article_type: technical-analysis
project_relevance: none
source_reading: "research/reading/Q-20260909-01-execution-grounded-tool-graph-admission.md"
---

# Research Analysis — Reusable Tool Capability Needs Execution-Grounded, Fresh Evidence

## Research question

When an agent or digital employee composes tools into a reusable capability graph, what evidence is sufficient to treat an output-to-input binding as operationally usable, and what does successful execution still fail to prove?

## Evidence identity and research scope

The same-date Reading Note analyzes KOPA-Bench/EDGE, a primary research study over 145 expert-authored tasks, 2,318 live MCP-exposed public-API tools and a dynamic dependency-graph construction process. The study provides controlled before/after graph comparisons, training ablations, transfer checks and failure classification. These numerical and mechanism claims are treated as `source-reported-claim` evidence. The proposed runtime acceptance model below is `our-interpretation`; it is not independent validation of a production governance architecture.

The research subject is a **capability-admission mechanism + evidence-freshness problem + authority-boundary problem**. Schema compatibility and model plausibility can nominate a tool edge, but neither is strong enough to make that edge a durable operational capability.

## The key distinction: candidate compatibility versus admitted capability

EDGE itself prevents an overly simple interpretation. A dependency edge can enter the initial skeleton after retrieval and an LLM feasibility judgment; it does not need one live success first. Execution then changes the evidence attached to that hypothesis. Observed successes and failures update edge confidence, while structural failures are treated differently from environmental failures such as timeouts, rate limits or authorization errors.

The controlled result is material: the initial skeleton executes successfully 50.2% of the time, the converged graph reaches 62.7%, and later-pruned edges execute only 14.8%. The mechanism therefore supports a bounded proposition stronger than “schemas are noisy”: **live execution supplies information that interface descriptions and model judgment do not contain, and accumulated execution evidence can overturn an initially plausible edge.**

It does not support the opposite overclaim that every retained edge has been individually proven by one successful call. Some retained edges remain under-explored, and the evidence is tied to the observed endpoint, arguments, service state and environment.

## Composition semantics are part of capability evidence

A schema-compatible output-to-input pair can still be operationally ambiguous when the source returns a collection. The study reports that 81.2% of chained calls consume multi-record outputs, with median cardinality 27 and a maximum of 224,958 records. EDGE therefore distinguishes junction semantics such as sequential pass-through, fan-out and deterministic reduction instead of collapsing every edge into a scalar mapping.

This matters for a governed runtime because the evidence object should bind not only **which tools connect**, but **how the connection transforms business meaning**. Cardinality, selection, reduction and branching rules can alter downstream effects even when the field types are technically compatible.

## Evidence claims

### E1 — source-reported-claim

**Claim:** The execution success rate of the model-judged initial dependency skeleton is 50.2%, while the refined graph reaches 62.7%; later-pruned edges execute successfully only 14.8% of the time.

**Source:** https://arxiv.org/html/2609.05395v1, as fully captured in the same-date Reading Note.

**Strength:** reports. **Independent:** false.

### E2 — source-reported-claim

**Claim:** Live trials can overturn high model priors, and the method intentionally distinguishes structural failures from environmental failures when updating edge confidence.

**Source:** same primary study.

**Strength:** reports. **Independent:** false.

### E3 — source-reported-claim

**Claim:** 81.2% of chained calls consume multi-record outputs, requiring explicit composition semantics rather than a universal one-to-one edge interpretation.

**Source:** same primary study.

**Strength:** reports. **Independent:** false.

### E4 — our-observation

**Claim:** “Retained in an execution-grounded graph” and “universally proven capability” are different evidence identities; the former is contextual and confidence-bearing rather than a timeless Boolean fact.

**Source:** comparison of the graph-admission, posterior-update and under-exploration behavior described in E1–E3.

**Strength:** observed. **Independent:** false.

### E5 — our-interpretation

**Claim:** A reusable agent capability should be admitted only with a versioned evidence packet that binds tool identities, binding semantics, environment, trial history, failure class and freshness; capability evidence must remain separate from call-time authorization.

**Source:** bounded synthesis from E1–E4.

**Strength:** supports. **Independent:** false.

## A bounded capability-evidence packet

The research supports a minimal durable identity for reusable tool composition evidence: source and target tool/version; source output field and target input argument; observed schema/version; endpoint/environment identity; argument/default binding; cardinality and transformation semantics; trial count; success/failure history; structural versus environmental failure class; timestamp; confidence; and a freshness or revalidation rule.

This packet answers **“what evidence says this composition can work?”** It does not answer **“may this worker perform it now?”** Authorization, target binding, idempotency, transaction safety and effect governance remain separate gates. Treating execution evidence as permission would collapse capability and authority into one unsafe state.

## Bounded research judgment

**Reusable tool composition should be promoted from plausibility to operational capability through execution-grounded, provenance-bearing and refreshable evidence—not through schema matching or model confidence alone.** The evidence can be graded rather than binary, but it must be strong enough to distinguish persistent structural incompatibility from transient environmental noise and explicit enough to preserve composition semantics.

The strongest transferable implication is that capability graphs should age. A tool upgrade, schema change, endpoint change, credential context change or material shift in observed failure behavior can stale the evidence without deleting the historical fact that the edge once worked.

## Counterarguments, limits and unresolved questions

The source does not prove that every enterprise tool graph should use EDGE's exact Bayesian update rule, that public-API evidence transfers unchanged to transactional enterprise systems, or that a particular trial threshold is universally sufficient. The empirical domain is Korean public-sector APIs, and the linked repository still advertises the benchmark/corpus/checkpoints as forthcoming, limiting current public end-to-end reproduction.

Open questions include how to set risk-sensitive minimum trial histories; how to revalidate edges after tool/version/tenant changes; how to verify structural-versus-environmental failure classification when providers return ambiguous errors; and how to couple capability confidence to authorization without allowing either gate to substitute for the other.

## Editorial recommendation

- **Article type:** technical-analysis
- **Selected modules:** research-question; evidence; technical-analysis; architecture-implications; governance-implications; counterarguments; open-questions
- **Core proposition:** execution evidence should promote a tool edge from plausible to admitted capability, but capability evidence remains contextual, perishable and separate from authority
- **Project relevance:** none
