---
date: "2026-09-14"
status: ReadyForProduction
production_input_authorized: true
publication_authorized: false
queue_item: Q-20260914-02
column: industry-architecture
article_type: research-interpretation
project_relevance: none
source_reading: "research/reading/Q-20260914-02-coordination-construct-reliability-evidence.md"
---

# Research Analysis — Team Reliability Is a Vector, Not One Score

## Research question

Which coordination obligations must be evaluated separately before aggregate task success can support a bounded claim that a multi-Agent team is reliable?

## Research themes and subject kind

- Research themes: construct-level coordination; allocation; ordering; mutual exclusion; handoff; reliability evidence; trajectory observability.
- Subject kinds: `benchmark-result`, `research-finding`, `architecture-mechanism`, `governance-problem`.
- Primary sample: CoCoBench with 897 oracle-validated executable tasks and 11 evaluated multimodal models.

The research subject is not the benchmark leaderboard. It is whether a team-level success scalar preserves the distinct operational truths needed to govern coordinated work.

## Evidence identities

### E1 — public research fact

**Identity:** `public-fact`.

**Claim:** CoCoBench defines 897 oracle-validated executable tasks across task allocation, sequential ordering, mutual exclusion and handoff, and evaluates 11 leading multimodal models.

**Source:** same-date source-complete Reading Note based on arXiv:2608.28266.

**Strength:** direct description of the primary study. **Independent:** false.

### E2 — research result

**Identity:** `source-reported-claim`.

**Claim:** The reported outcomes vary materially by coordination construct; strong aggregate task performance does not imply balanced competence across allocation, ordering, exclusion and handoff.

**Strength:** primary benchmark result inside the reported environment. It is not quantitative proof for enterprise or software teams. **Independent:** false.

### E3 — research result

**Identity:** `source-reported-claim`.

**Claim:** The study reports degradation as team size grows, benefit from centralized state aggregation, and only partial recovery from simple communication, with symbolic team-level planning remaining a major bottleneck under the high-level skill interface.

**Strength:** bounded experimental evidence for the study's evaluated setting. **Independent:** false.

### E4 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** Team reliability should be represented as a vector of separately evidenced coordination contracts. A safety-critical weak dimension must not be averaged away by a strong dimension.

**Strength:** architectural inference supported by E1–E3. **Independent:** false.

### E5 — our interpretation

**Identity:** `our-interpretation`.

**Claim:** A governed runtime needs stable event identities for ownership, prerequisites, exclusive resources and accepted handoffs so that a terminal artifact can be evaluated against the trajectory that produced it.

**Strength:** mechanism recommendation; not a direct implementation result from the benchmark. **Independent:** false.

### E6 — open question

**Identity:** `open-question`.

**Claim:** The source does not establish quantitative transfer from executable household activities to enterprise, software or long-lived digital-employee teams, nor does it determine recovery policy for each coordination violation.

## Failure / Finding / Mechanism / Implication

### Failures

1. **Duplicate allocation:** multiple agents spend capacity on the same unit while another unit remains unowned.
2. **Illegal ordering:** a dependent action begins before its prerequisite evidence exists.
3. **Exclusion violation:** concurrent actors mutate an exclusive resource or critical section.
4. **Broken handoff:** a producer marks work complete without receiver acceptance or state continuity.
5. **Scalar masking:** high end-task success hides a weak safety-critical construct.
6. **Unattributed coordination:** the final artifact is correct but the runtime cannot identify which protocol obligation was violated.
7. **Scale illusion:** reliability observed with two agents is assumed to persist as team size grows.

### Findings

The primary result is not merely that models differ. It is that coordination competence is construct-specific. Allocation, ordering, mutual exclusion and handoff encode different obligations and failure semantics. A team can succeed eventually while wasting work, violating prerequisites, contending for shared state or repairing a broken transfer manually.

Aggregate success therefore answers only whether a terminal goal was reached. It cannot by itself answer whether the team respected the coordination contracts required for safe repeatable operation.

The benchmark's executable environment and oracle-defined task structure make these distinctions observable. That strengthens the evidence relative to free-form qualitative claims, while still leaving transfer to other domains unresolved.

### Mechanism

A governed coordination record can expose four independent contract surfaces:

**Allocation contract**

- unit-of-work identity;
- owner identity and lease;
- duplication policy;
- reassignment or abandonment event.

**Ordering contract**

- prerequisite graph or sequence constraint;
- evidence that each dependency closed;
- actual start and completion events;
- violation and recovery decision.

**Mutual-exclusion contract**

- exclusive resource identity;
- lock or reservation holder;
- acquisition, renewal and release events;
- concurrent-access detection.

**Handoff contract**

- producer, receiver and payload/state identity;
- handoff offer and acceptance;
- preconditions and completeness evidence;
- timeout, rejection and recovery path.

Each construct receives its own PASS/FAIL/UNKNOWN result. Any aggregate score must preserve the vector and apply guardrails so a failure in a critical dimension cannot be diluted.

### Implication

For multi-Agent organizations, “team completed the task” should be treated as a result fact, not a comprehensive reliability proof. Admission, monitoring and post-run review should test the coordination obligations most relevant to the task's risk.

Some obligations can be enforced deterministically when facts are observable—for example exclusive ownership of a repository path or database row. Others, such as semantic completeness of a handoff, may require model or human judgment. Their evidence identities should remain distinct.

## Comparison and contradictions

A scalar metric is attractive because it is easy to rank, optimize and communicate. The benchmark contradicts the assumption that this compression is harmless. Operationally distinct failures can produce the same terminal result.

Centralized state aggregation improves shared truth but does not automatically solve every coordination construct. Communication can reduce information gaps while leaving exclusion or ordering rules unenforced. Better messaging is therefore not equivalent to a coordination contract.

The household setting offers strong executability and oracle validation but weak direct transfer to enterprise environments. The safest generalization is structural: separate obligations need separate evidence. Quantitative model rankings should remain bounded to the study.

## Bounded research judgment

**Multi-Agent reliability should be represented as a vector of allocation, ordering, mutual-exclusion and handoff evidence. Aggregate task success may summarize outcomes, but it cannot authorize a claim of reliable coordination unless every task-relevant critical construct has independently satisfied its contract.**

This judgment does not require every system to implement exactly four dimensions. It requires the runtime to preserve whichever coordination constructs have different failure semantics instead of collapsing them into one score.

## General implications

- define task-relevant coordination contracts before execution;
- preserve stable owner, prerequisite, resource and handoff identities;
- make receiver acceptance explicit rather than inferred from producer completion;
- prevent safety-critical dimensions from being averaged away;
- test team-size scaling separately from small-team success;
- choose deterministic enforcement where complete facts are observable;
- keep model judgments separate from durable coordination events;
- report terminal outcome and coordination-vector evidence side by side.

## Limitations and counterarguments

The benchmark uses household activities and high-level skills. Software repositories, enterprise systems and organizations have different resource models, authorization layers and failure costs. The evidence does not justify importing its absolute scores or thresholds.

A vector can become unwieldy. Systems should select only task-relevant constructs, but simplification must not erase a distinct safety obligation. Some coordination failures may also be causally linked; separate scoring should not prevent analysis of those dependencies.

## Open questions

1. What minimal event schema supports post-run scoring of each construct?
2. Which coordination dimensions are mandatory for high-impact digital-employee work?
3. How should UNKNOWN in one critical dimension affect terminal acceptance?
4. When should handoff completeness require human review?
5. How should construct weights change with team size and task risk?
6. Can coordination vectors be compared across domains without hiding domain-specific obligations?

## Editorial recommendation

- **Article type:** research-interpretation
- **Selected modules:** research-question; benchmark-evidence; four-construct-comparison; failure-semantics; coordination-contract-vector; deterministic-versus-semantic-enforcement; limits; open-questions
- **Core proposition:** final task success is an outcome fact, while team reliability requires construct-level evidence
- **Project relevance:** none
