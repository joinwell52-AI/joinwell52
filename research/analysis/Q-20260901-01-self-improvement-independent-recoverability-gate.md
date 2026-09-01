# Research Analysis — Q-20260901-01 Independent Recoverability Gate for Self-Improving Agents

- **Runtime date:** 2026-09-01
- **Source Reading:** `research/reading/Q-20260901-01-self-improvement-independent-recoverability-gate.md`
- **Research themes:** agent governance; self-improvement; recovery authority; evidence and completion truth
- **Subject kind:** governance-problem; architecture-mechanism; research-finding
- **Recommended article type:** `technical-analysis`
- **Selected modules:** `research-question`, `evidence`, `technical-analysis`, `governance-implications`, `limitations`, `open-questions`
- **Project relevance:** `none`

## Research question

What evidence should a governed digital-employee runtime require before a capability-improving self-modification is allowed to become active, when forward improvement and recoverability can diverge?

## Evidence claims

### E1 — source-reported-claim

**Claim:** EvoUndo reports 600 previously unseen one-shot self-evolution tasks, with 281 already admissible candidates, 197 candidates that improve the forward capability objective but fail recovery verification, and 122 capability-inadequate candidates.

**Source:** 2026-09-01 Reading Note for arXiv:2608.28363.

**Strength:** reports.

**Independent:** false. This is primary research evidence from the evaluated system, not an independent production reproduction.

### E2 — source-reported-claim

**Claim:** Under the reported evaluation, conventional repair approaches recover 0/197 of the capability-positive recovery failures at the stated budget; a deterministic oracle reaches 48/197 under the simpler L0 recovery language and 191/197 after extending the recovery calculus to L1.

**Source:** same Reading Note / primary study.

**Strength:** reports.

**Independent:** false.

### E3 — public-fact

**Claim:** The study models recovery as a relation over a frozen forward mutation, a pre-state witness, an independently derived effect surface, a recovery program/language, counterfactual post-mutation states, and a typed observational-equivalence contract.

**Source:** same Reading Note / primary study architecture.

**Strength:** states.

**Independent:** false.

### E4 — source-reported-claim

**Claim:** The paper reports that full-snapshot restoration can destroy legitimate later state: in its controlled comparison, full snapshot succeeds 0/300 when subsequent state changes matter; effect-scoped snapshot recovery also degrades under a subsequent overlapping mutation.

**Source:** same Reading Note / primary study.

**Strength:** reports.

**Independent:** false.

### E5 — source-reported-claim

**Claim:** Exact-address grounding is not monotonically beneficial across all tested conditions: it strongly helps one limited-language regime but reduces recovery for one reported L1/backbone condition, and the same negative interaction is not reproduced in the Qwen replication.

**Source:** same Reading Note / primary study.

**Strength:** reports.

**Independent:** false.

### E6 — our-observation

**Claim:** The 197 capability-positive but recovery-defective candidates are a direct counterexample to a single admission predicate such as “the modification improves the objective and passes ordinary forward tests.”

**Source:** comparison of the study’s reported capability and recovery partitions in the same-day Reading Result.

**Strength:** observed.

**Independent:** false.

## Failure / finding / mechanism / implication

### Failure

A self-improving worker can make a change that is beneficial under the forward objective while simultaneously weakening or destroying the system’s ability to return to an acceptable earlier state. If activation treats forward capability success as sufficient evidence, the system can consume recovery margin without exposing that loss at the admission boundary.

A second failure is evidentiary: the mutating component can understate what it changed. If recovery scope is derived only from the candidate’s own declaration, a defective or self-serving candidate can narrow the obligation to the easiest-to-undo subset of effects.

### Finding

The same primary study separates capability and recoverability empirically rather than treating recovery as an implementation convenience. Its strongest bounded result is not that one particular recovery language is universally best; it is that capability-positive candidates can remain recovery-defective, and that recovery success depends on state evolution, effect scope, recovery expressivity, addressing, and the acceptance equivalence used by the verifier.

### Mechanism

The useful governance mechanism is an **independent recoverability admission bundle**. Before activation, the runtime binds a candidate mutation to:

1. a stable mutation identity;
2. a pre-mutation witness;
3. an effect surface derived independently of the candidate’s self-report;
4. a declared recovery mechanism/version;
5. relevant counterfactual post-mutation states;
6. an observational-equivalence contract;
7. a verifier result covering that exact bundle.

The forward mutation remains frozen while the recovery obligation is diagnosed. This prevents “repairing rollback” by quietly changing the candidate being evaluated.

### Implication

For governed digital employees, **capability admission and recoverability admission should be separate gates with separate evidence identities**. A capability-positive result may justify continued evaluation, but it should not itself authorize activation when the system’s rollback/recovery contract is unproved.

This is stronger than a generic “keep a snapshot” rule. Recovery is relational: it must preserve authoritative later state that is outside the mutation’s effect ownership, and its evidence must remain tied to the exact mutation/effect/equivalence bundle that was tested.

## Research judgment

**Bounded judgment:** The same-day primary research provides strong evidence against treating successful self-improvement as self-authenticating adoption evidence. In the evaluated benchmark, forward improvement and recovery verification diverge materially. A governed self-improvement lifecycle should therefore require independently derived recovery evidence before activation and should bind that evidence to the exact mutation and recovery contract evaluated.

The evidence does **not** establish that every digital employee must use EvoUndo’s recovery representation, that synthesized compensation is preferable to transactional recovery, or that arbitrary external side effects can be undone. It establishes a narrower governance requirement: **recoverability is an independently testable admission property and must not be inferred from capability gain or a worker’s self-reported rollback success.**

## Why an independent gate matters

The independence requirement is not decorative separation of duties. The party proposing a mutation has an informational and incentive asymmetry: it knows the intended change, but its own effect declaration can be incomplete. The verifier must therefore derive at least the material effect surface and acceptance relation from a control plane that is not defined solely by the candidate being admitted.

This leads to an important authority distinction:

- the self-improving worker may have **proposal authority** over a candidate mutation;
- a forward evaluator may provide **capability evidence**;
- a recovery verifier provides **recoverability evidence**;
- a separate lifecycle gate grants **activation authority** only when the required evidence bundle is complete.

Collapsing those roles makes a positive forward test do work it cannot evidentially support.

## Counterarguments

### “If the new version passes tests, rollback is only an operational concern.”

The reported 197 capability-positive recovery failures directly contradict that assumption inside the study’s test domain. Recovery affects whether a modification can be safely adopted under later uncertainty; it is therefore part of admission, not merely incident response.

### “A full snapshot solves recovery more reliably than synthesis.”

The benchmark shows why this is not generally valid in an evolving state space: restoring an old whole-state image can erase later changes that should remain authoritative. The correct recovery boundary depends on effect ownership, not only historical time.

### “More exact effect addressing should always improve recovery.”

The reported results do not support monotonicity. More precise addressing helps one regime and harms one richer-language/backbone condition. Precision can constrain an invalid plan, but it can also over-decompose or mis-order a valid one.

## General implications

- Self-improvement should use a two-gate lifecycle: forward capability qualification and independent recoverability qualification.
- Recovery evidence should carry stable identities for mutation, witness, effect surface, recovery mechanism, counterfactual test set, equivalence contract, and verifier result.
- Activation should bind to that verified bundle rather than to “latest candidate” or a generic approval.
- The recovery verifier should not rely solely on the candidate’s declared effect set.
- Recovery tests should include state evolution; immediate rollback from one exact state is insufficient evidence for later recoverability.
- External irreversible effects require a separate effect/commit discipline. Recovery synthesis should not be presented as exactly-once execution or distributed transactionality.

## Limitations

- The evidence is one primary research system and benchmark, not independent production validation.
- The evaluated state surface is a harness-managed abstraction, not arbitrary enterprise or third-party state.
- Irreversible external writes, distributed transactions, long-horizon multi-worker overlap, and verifier compromise remain outside the demonstrated guarantee.
- The study does not compare its mechanism against a full WAL/ARIES implementation and does not establish that synthesized recovery should replace transactional protocols.
- Some recovery interactions are model/backbone dependent, so mechanism-level conclusions must remain bounded.

## Open questions

1. How should a recovery gate represent irreversible third-party effects that can only be compensated, not undone?
2. What is the authoritative effect surface when several workers mutate overlapping state concurrently?
3. When surrounding state drifts, what event should invalidate an earlier recoverability certificate and force re-verification?
4. How should activation authority be resolved when capability and recovery evaluators disagree?
5. Can the recovery mechanism itself become a privilege-escalation path if it can rewrite protected state?

## Project-relevance test

**Status:** `none`.

The conclusion stands without TMPA, FCoP or CodeFlowMu. No first-party project is required as evidence for the external research judgment, so no project mapping is forced in this Analysis.
