---
date: "2026-09-08"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260908-03
column: open-source-engineering
article_type: engineering-insight
project_relevance: none
source_reading: "research/reading/Q-20260908-03-gui-cli-shared-effect-provenance.md"
---

# Research Analysis — Business Effect Identity Should Survive GUI, CLI and Tool Surface Switches

## Research question

When one agent alternates among GUI gestures, CLI commands and tool/MCP calls that mutate the same underlying application state, what identity and evidence model is needed so the resulting business effect remains one auditable execution rather than several disconnected surface-specific stories?

## Research scope and evidence identity

The same-date Reading Note analyzes CUA-Universe, a primary benchmark and training environment rather than a production governance framework. Its relevant architectural mechanism is explicit: GUI and application-specific CLI actions operate over one persistent application state, while task trajectories retain heterogeneous observations and are judged with screenshots, command results and exported-artifact evidence.

The benchmark includes controlled GUI versus GUI+CLI comparisons, orchestration training ablations, transfer to an unseen MCP tool interface and human validation of its trajectory judge. Those reported results are `source-reported-claim` evidence. The effect-centered provenance model below is `our-interpretation`; the source does not claim to solve production authorization, idempotency, exactly-once execution or distributed external effects.

The research subject is an **architecture-mechanism + engineering failure-mode + governance-problem** around execution identity, evidence precedence and retry safety across control surfaces.

## The failure: interface boundaries can fracture one effect

A runtime that logs GUI work, terminal work and tool calls as separate business executions can lose the causal relationship among actions that jointly implement one requested effect. Several ambiguities follow:

- a CLI write may already have changed the authoritative file while the GUI still shows a stale pre-change view;
- a later GUI refresh may look like a new mutation even though it only reveals an earlier CLI effect;
- a retry may duplicate a successful effect if the system mistakes stale presentation state for command failure;
- surface-specific authorization checks may disagree even though multiple surfaces reach the same protected target;
- incident review may be unable to distinguish alternatives, retries and sequential parts of one composite execution.

The benchmark makes this concrete because both surfaces intentionally share state. Modality is an action surface, not a separate transaction domain.

## One effect chain, several evidence types

The evidence supports separating unification from flattening. A governed runtime should preserve one stable **execution/effect identity** across surface switches while retaining the identity of every individual action and observation.

A minimal cross-surface provenance chain needs at least:

1. **Execution identity** — a stable identifier for the requested business effect or governed action chain.
2. **Target and pre-state identity** — the workspace/application/artifact and state lineage being mutated.
3. **Surface action evidence** — exact GUI action, CLI/tool arguments, return status, observations and timestamps, without erasing which surface caused a mutation.
4. **Effect evidence** — an authoritative probe appropriate to the protected state: persisted artifact, application state API, filesystem/object revision, screenshot or another declared source of truth.
5. **Trajectory linkage** — links among actions, observations, retries and the final effect verdict so later audit can reconstruct the path.

This makes evidence **effect-centered** while keeping observations **surface-specific**.

## Evidence precedence must be explicit

CUA-Universe's verification pipeline combines screenshots, CLI output and exported-artifact evidence because the strongest evidence depends on what state is being judged. A screenshot can be authoritative for visible layout but stale for a file mutated by CLI. A command return code can prove that a command returned success but not necessarily that a remote irreversible effect committed. An exported artifact can prove persisted content while saying little about whether every intermediate action was authorized.

A production runtime therefore needs a declared evidence-precedence contract per effect class. The contract should answer which probe is authoritative when sources disagree and which disagreement means “presentation lag” versus “effect unknown.” Without that distinction, recovery and retry logic can turn epistemic uncertainty into duplicate side effects.

## Evidence claims

### E1 — source-reported-claim

**Claim:** CUA-Universe models GUI and CLI actions as operating over one persistent application state and records them in one task trajectory.

**Source:** https://arxiv.org/html/2609.05374v1, as fully captured in the same-date Reading Note.

**Strength:** reports. **Independent:** false.

### E2 — source-reported-claim

**Claim:** In controlled comparisons, trained hybrid orchestration materially outperforms merely exposing GUI+CLI surfaces to the base model; interface availability alone does not reproduce the result.

**Source:** same primary study.

**Strength:** reports. **Independent:** false.

### E3 — source-reported-claim

**Claim:** The benchmark's trajectory verifier combines screenshots, CLI output and exported-artifact evidence, and its VLM judge shows high agreement with human labels on the reported validation sample while retaining known false negatives and model-scoring limitations.

**Source:** same primary study.

**Strength:** reports. **Independent:** false.

### E4 — our-observation

**Claim:** When GUI and CLI share state, surface-local freshness can diverge from authoritative-state freshness; therefore interface-local observations cannot independently define effect identity.

**Source:** comparison of the shared-state architecture, stale-GUI behavior and heterogeneous verifier evidence.

**Strength:** observed. **Independent:** false.

### E5 — our-interpretation

**Claim:** Governed runtimes should bind GUI, CLI and tool/MCP actions that serve one requested mutation to one effect/provenance chain, while keeping authorization, idempotency and external-effect completion as separate evidence gates.

**Source:** bounded engineering synthesis from E1–E4.

**Strength:** supports. **Independent:** false.

## Unified provenance is not unified authority

A single provenance chain solves an identity and audit problem; it does not by itself grant permission. Authorization should bind to the protected target/effect and the principal's current authority, even when several surfaces can reach that target. Likewise, a final successful artifact does not prove exactly-once execution, and a unified trajectory does not prove that an external SaaS/payment/network effect committed once and only once.

This separation is crucial:

```text
shared execution identity
!= authorization evidence
!= idempotency/effect identity
!= commit evidence
!= recovery authority
```

These facts may reference the same execution, but one must not be inferred from another.

## Bounded research judgment

**Control-surface changes should not create new business execution identities when the actions continue one mutation over the same target state.** GUI, CLI and MCP/tool evidence should remain distinguishable observations inside one effect-centered provenance chain, and terminal success should rely on an explicit authoritative-state probe appropriate to the effect.

The benchmark supplies strong evidence for the shared-state and heterogeneous-verification mechanism. It does not establish production-grade authorization, exactly-once semantics, causal completeness or external-effect safety. Those remain separate runtime contracts.

## Engineering implications

Cross-surface runtimes should carry a stable effect ID through modality changes; bind actions to a target/pre-state lineage; represent stale presentation state explicitly rather than as failure; record retries as retries of the same intended effect; define evidence precedence by effect class; and preserve enough linkage for later audit without flattening every surface into a single undifferentiated log.

For unknown external effects, the system should prefer an explicit `effect-unknown` or equivalent recoverable state over assuming that an unrefreshed GUI or missing local observation means no mutation occurred.

## Limits and open questions

CUA-Universe runs in controlled reproducible VMs, mostly within single applications, and uses a VLM judge rather than deterministic verification for every task. It does not model credentials, compensation, transaction commits, distributed races, irreversible remote effects or per-action policy enforcement. Reported efficiency and success gains should not be generalized unchanged to enterprise desktops or browser automation.

Open questions include how one effect ID should span browser/desktop/API surfaces across process restarts; which state probe becomes authoritative when file, API and UI disagree; how much trajectory evidence can be compacted without losing causal links; how idempotency keys should attach to cross-surface retries; and how authorization should be evaluated when two surfaces expose different capability granularity over the same protected object.

## Editorial recommendation

- **Article type:** engineering-insight
- **Selected modules:** research-question; shared-state-mechanism; fractured-audit-failure; effect-centered-provenance; evidence-precedence; authorization-and-idempotency-boundary; engineering-implications; open-questions
- **Core proposition:** execution/effect identity should be surface-invariant, while evidence and authority remain explicitly typed
- **Project relevance:** none
