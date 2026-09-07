---
date: "2026-09-07"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260907-03
column: open-source-engineering
article_type: research-methodology
project_relevance: none
source_reading: "research/reading/Q-20260907-03-independent-qa-recoverable-project-state.md"
---

# Research Analysis — Context Is Disposable, Project Truth Is Not

## Research question

When autonomous software work spans many invocations or days, which artifact and evidence identities must survive every context window, and why must acceptance remain independent from the implementing claim?

## Research themes and subject kind

- **Themes:** long-horizon agent engineering; durable artifact state; evidence continuity; independent QA; candidate identity; validation freshness
- **Subject kinds:** architecture-mechanism; research-finding; governance-problem; benchmark interpretation
- **Sample:** Harness-of-Harness experiments across three benchmark families and a multi-day software project

## Research value

### Failure

A context window can remember a plan, recent failures, and test observations. When the invocation ends, that memory disappears. If the next agent receives only source code, it must infer unresolved requirements and prior reasoning from implementation details. If it receives only a prose summary, it may not know which artifact revision the claimed evidence tested.

This creates several failures: repeated repair, forgotten defects, regression of previously validated behavior, acceptance inherited by a changed candidate, and implementation confidence mistaken for independent completion evidence. The common error is to treat conversational continuity as project continuity.

### Findings

The same-date Reading Note examines a primary Harness-of-Harness study. Its loops separate Project Planner, Developer, and QA Tester into distinct role invocations. Artifact state and evidence state cross loop boundaries independently. The Planner selects a coherent increment, the Developer modifies the candidate, and QA observes a fixed candidate rather than accepting the Developer's self-description.

Across GameCraft-Bench, FrontierSWE, and ProgramBench, three harness–model pairs report an average 52.25% relative gain after three iterations, with a reported maximum of 82.86% in the tested conditions. These are configuration-specific benchmark results, not universal productivity estimates.

A multi-day game-development case spans more than 70 loops and preserves source revisions, issues, and evidence packets. By Loop 70, 65 of 81 recorded issues were closed, 16 remained unresolved, and 17 had been reopened after later changes broke previously validated behavior. The reopened defects are especially important: acceptance belongs to a candidate revision and can become stale.

### Mechanism

Recoverable project truth has at least four identities:

1. **Candidate identity:** the exact artifact revision being planned, changed, tested, or accepted.
2. **Artifact state:** source, configuration, resources, and metadata that define what the candidate is.
3. **Evidence state:** validated behavior, unresolved failures, test observations, known failed approaches, and acceptance boundaries bound to the candidate.
4. **Role authority:** the scoped input, permissions, and output contract for Planner, Developer, and QA after every invocation is admitted.

Artifact and evidence state are complementary. Code cannot fully encode why an issue remains open or which behavior was tested. Evidence without the candidate cannot prove which implementation produced the observation.

The deterministic boundary belongs around inputs, permissions, required artifacts, candidate bindings, and transitions—not around the model's internal reasoning path. Agents may choose local implementation methods while the runtime keeps project truth inspectable.

### Implication

`Developer reports done` and `candidate accepted` should be different transitions. The first is an implementation claim. The second references observations produced against an immutable candidate identity by a role that did not implement that candidate in the same invocation.

Role independence does not necessarily require a different model vendor. Separate invocations, scoped permissions, frozen inputs, and candidate-bound evidence create a meaningful execution boundary even when the underlying model family is shared. Correlated model error remains a limitation and may justify diversity for high-risk claims.

Freshness must also be explicit. A later change that touches a validated behavior should invalidate or re-run affected evidence. “Closed” is not a permanent property of the issue across all future revisions.

## Evidence claims

### E1 — independent-evidence

**Claim:** The primary study separates planning, development, and QA role invocations and carries artifact state and evidence state independently across loops.

**Source:** https://arxiv.org/html/2609.01481v1

**Strength:** reports. **Independent:** true. **Independent actor:** the Harness-of-Harness study authors.

### E2 — source-reported-claim

**Claim:** Across three benchmark families and three harness–model pairs, the study reports an average 52.25% relative gain after three iterations and a maximum of 82.86% in the tested configurations.

**Source:** same primary study.

**Strength:** reports. **Independent:** false.

### E3 — source-reported-claim

**Claim:** The multi-day case preserves versioned project and testing history and records 17 issues reopened after later regressions by Loop 70.

**Source:** same primary study and case evidence.

**Strength:** reports. **Independent:** false.

### E4 — our-observation

**Claim:** Artifact state and evidence state answer different continuity questions, and a prose summary without an exact candidate pointer cannot establish acceptance identity.

**Source:** analytical comparison of the study's state and role model.

**Strength:** observed. **Independent:** false.

### E5 — our-interpretation

**Claim:** Long-horizon agent engineering should bind acceptance to a fixed candidate and independent evidence, then re-admit role authority and revalidate freshness after change.

**Source:** bounded engineering synthesis from E1–E4.

**Strength:** supports. **Independent:** false.

## Contradictions and counterarguments

Using the same model for Developer and QA can preserve correlated blind spots. Role separation is evidence hygiene, not proof of independence. High-risk properties may require different models, human review, deterministic tests, or external evaluation.

More loops and more evidence do not automatically improve quality. Weak tests can repeatedly validate the wrong proposition, and issue counts do not measure importance. The runtime should optimize for decision-relevant evidence rather than raw volume.

Durable state also creates maintenance cost. A minimal checkpoint should keep the exact candidate identity, unresolved obligations, validated claims, evidence paths, freshness dependencies, and next role authority. It need not preserve every conversational token.

## Bounded research judgment

The strongest reusable conclusion is: **a context window is disposable, but project truth must be durable and independently testable.** Long-horizon work requires a stable candidate identity, separate artifact and evidence state, independent acceptance, and freshness rules after change.

The reported benchmark gains and multi-day case show that this architecture can improve outcomes and preserve history in the examined settings. They do not prove production correctness, crash consistency, exactly-once effects, universal transfer, or sufficient independence from role separation alone.

## General implications

- Bind every test, defect, acceptance, and regression to an exact candidate revision.
- Persist unresolved obligations and validated behaviors outside model context.
- Separate Planner, Developer, and QA permissions and required outputs.
- Do not let the implementing invocation approve its own completion.
- Reopen or re-test evidence when later changes affect its dependencies.
- Preserve failed approaches when they materially constrain the next plan.
- Re-admit role authority after session, workspace, or recovery transitions.
- Track external effects separately when their prior outcome is uncertain.

## Limitations and open questions

The study is author-reported primary research across selected benchmarks and one large case. Independent replication is still needed. Benchmark reward and game-quality measures do not prove security, maintainability, or production readiness. The framework does not by itself establish atomic recovery or exactly-once external effects.

Open questions include the minimum acceptance packet; automatic evidence invalidation after dependency change; when model/vendor diversity is required; which history belongs in structured state; how irreversible effects are reconciled; and how checkpoints can remain small without losing the decisions needed to avoid repeated failures.

## Editorial recommendation

- **Article type:** research-methodology
- **Selected modules:** long-horizon-failure; harness-evidence; state-separation; independent-acceptance; freshness-after-change; counterarguments; limitations; open-questions
- **Ending module:** open-questions
- **Project relevance:** none
