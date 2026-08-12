# Q-20260803-09 — Research Analysis: Multi-Horizon Work Needs a Runtime, Not a Larger Context Window

- **Runtime family:** Academic
- **Run date:** 2026-08-12
- **Primary reading:** `research/reading/Q-20260803-09-corpgen-multi-horizon.md`
- **Article type:** `technical-analysis`
- **Project relevance:** `none`

## Research question

What architectural claims are actually supported by CorpGen's published evidence for concurrent multi-horizon work, and which parts remain hypotheses for production Digital Employee runtimes?

## Evidence claims

### C1 — public-fact

**Claim:** The paper defines a workload with dozens of concurrent tasks and aggregate horizons substantially longer than a single office task, and evaluates a 46-task high-load condition in a controlled OSWorld-derived environment.

**Source:** arXiv 2602.14229 and Microsoft Research publication materials.

**Strength:** states.

**Independent:** false.

### C2 — source-reported-claim

**Claim:** The authors report that their full CorpGen configuration completes 15.2 tasks at the 46-task load versus 4.3 for the stated UFO2 baseline, with the largest ablation gain appearing after experiential learning is introduced.

**Source:** arXiv 2602.14229 experiment tables.

**Strength:** reports.

**Independent:** false.

### C3 — source-reported-claim

**Claim:** CorpGen's architecture uses hierarchical planning, isolated task-agent contexts, tiered memory, adaptive summarization and retrieval of prior successful experience.

**Source:** arXiv 2602.14229 architecture and implementation sections.

**Strength:** reports.

**Independent:** false.

### C4 — our-interpretation

**Claim:** The evidence is consistent with treating multi-horizon enterprise work as a coordination-runtime problem in which task identity, isolation, scheduling, bounded memory and evaluation must be explicit state rather than implicit prompt context.

**Source:** synthesis of C1–C3 plus reported load degradation and failure analysis.

**Strength:** supports.

**Independent:** false.

### C5 — our-interpretation

**Claim:** Durable output artifacts are a promising completion-evidence surface, but the paper's artifact-versus-trace agreement result is too small and too specific to support a general claim that artifact checks alone are sufficient.

**Source:** paper's artifact-evaluation discussion and 11-execution meta-evaluation scope.

**Strength:** suggests.

**Independent:** false.

### C6 — open-question

**Claim:** It remains unresolved how the architecture behaves across multi-day restart, authority changes, conflicting external side effects, delayed failures and independent enterprise replication.

**Source:** paper limitations plus missing evidence.

**Strength:** open-question.

**Independent:** false.

## Observations

The important change in perspective is that “long horizon” is not only a token-length problem. Once multiple tasks coexist, the runtime must continuously answer different questions: which task owns an action, what task is blocked, what state should be recalled, what may be skipped, and which durable evidence shows that a task actually reached its business outcome.

The paper's strongest architectural contribution is therefore decomposition. Hierarchical planning handles competing horizons; isolated agents bound cross-task interference; tiered memory separates durable knowledge from active context; bounded retry/skip prevents one task from monopolizing the run; artifact-oriented evaluation moves completion judgment toward durable outputs instead of only action traces.

## Comparison

A single monolithic context can preserve conversational continuity but does not by itself define task ownership, fairness, retry policy or recovery semantics. CorpGen makes several of these concerns explicit, which is closer to an operating runtime than to a prompt strategy.

However, the paper does not demonstrate production-grade process restart, transactional side-effect control or independent acceptance authority. Those concerns should remain separate from the demonstrated scheduling and memory mechanisms.

## Counterarguments

A strong foundation model with a much larger context window could reduce some memory-pressure failures without the complexity of hierarchical runtime state. The paper does not isolate every architecture component against every modern long-context alternative. Also, experiential retrieval may encode considerable task-specific advantage, so not all improvement can be attributed to general runtime structure.

The controlled benchmark itself may overstate transferability: concatenated OSWorld Office tasks create a useful stress test, but they are not the same as real organizational work with changing permissions, human interruptions, asynchronous dependencies and business-system constraints.

## Bounded research judgment

**CorpGen provides credible first-party experimental evidence that high-concurrency, long-horizon agent work benefits from explicit runtime structure rather than treating all work as one growing context. The most transferable design pattern is not a specific benchmark score but a four-part boundary: task identity and scheduling, context isolation, bounded memory/retry, and durable outcome evaluation.**

This judgment remains bounded. The evidence does not establish production readiness, independent validation, exactly-once work semantics or transactional enterprise safety.

## General implications

1. **Task identity should be durable runtime state.** A task cannot be safely retried, reprioritized or audited if its identity exists only in prompt text.
2. **Concurrency should be partitioned by ownership.** Isolation reduces cross-task memory interference and makes local failure easier to contain.
3. **Memory should be selective and tiered.** Long-running workers need explicit retrieval and summarization policy rather than unlimited chronological replay.
4. **Failure must have bounded scheduling semantics.** Retry, skip, blocked and failed should be explicit states so one stalled task does not freeze unrelated work.
5. **Completion should prefer durable outcome evidence.** Artifact readback is often more meaningful than action-trace plausibility, but it must be combined with side-effect and authority checks where consequences matter.
6. **Absolute throughput matters alongside relative improvement.** A 3.5× relative gain can coexist with low absolute completion at the hardest load; both must be reported.

## Project relevance

- **Status:** none
- **Projects:** []
- **Rationale:** The research question and conclusions are about multi-horizon agent runtimes generally. No TMPA, FCoP or CodeFlowMu mapping is required for the argument to stand.

## Limitations

- Primary evidence is first-party research from the system's authors.
- The main benchmark is controlled and synthetic rather than a real enterprise longitudinal deployment.
- The artifact-evaluation meta-study is very small.
- No independent reproduction was identified in this run.
- The evidence does not establish multi-day persistence, restart reconciliation, external transaction safety, cross-user authority or regulated-work compliance.

## Open questions

- What minimal durable task state is necessary for restart-safe multi-horizon work?
- Which scheduling policies preserve fairness when priorities change continuously?
- How should task-local isolation interact with shared external resources?
- What evidence contract distinguishes “agent stopped,” “artifact exists,” “business outcome accepted,” and “side effects reconciled”?
- Can the architecture's gains be reproduced independently on non-OSWorld enterprise workloads?

## Selected article modules

1. `research-question`
2. `context`
3. `evidence`
4. `technical-analysis`
5. `engineering-implications`
6. `limitations`
7. `open-questions`

Ending module: `open-questions`.
