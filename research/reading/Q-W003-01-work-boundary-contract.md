# Reading Record — Q-W003-01 WorkBoundaryContract and OwnershipLedger

- **Queue item:** `Q-W003-01`
- **Research object:** WorkBoundaryContract and OwnershipLedger
- **Priority:** P0
- **Lifecycle transition opened:** `Selected → Reading`
- **Skill invoked:** `Skill 03 — Deep Reading`
- **Operating date:** 2026-08-03 (Asia/Shanghai)
- **Source policy:** use only previously evidence-validated Research Center publications and their verified production records; introduce no new external source in this transition.

## Reading scope

This reading pass examines whether the ownership and boundary conclusions in Weekly 003 are sufficiently explicit to support a later Analysis-stage architecture judgment. It does not freeze a TMPA object, publish a specification, or advance the item beyond `Reading`.

## Authoritative source package

1. `docs/en/research/weekly/weekly-003.md`
2. `docs/zh/research/weekly/weekly-003.md`
3. `research/weekly-synthesis/2026-08-02/RUN-RECORD.md`
4. `docs/en/digital-employee/2026-08-02-computer-use-action-state-loop.md`
5. `docs/en/industry/2026-08-02-a2a-mcp-interoperability-boundaries.md`
6. `docs/en/engineering/2026-08-02-manager-handoff-ownership-models.md`
7. `research/production-tests/production-test-v1/REPORT.md`
8. `research/production-tests/production-test-v1/RUNTIME-RECORD.md`

The three Daily notes were previously recorded as having passed Queue, Reading, Analysis, Research Writing, Visualization, Evidence & Citation, Publication Editing, merge, and main-branch verification. Weekly 003 was separately published and commit-verified.

## Deep Reading output

```yaml
reading_notes:
  problem:
    - Agentic work crosses computer-operation, capability-call, subtask, handoff, and external-delegation boundaries.
    - Existing transport or message records do not by themselves prove who owns work, control, state, authority, evidence, completion claims, or acceptance.
    - The research question is whether one minimal boundary contract plus an append-only ownership ledger can preserve these facts without becoming a second workflow engine.

  facts:
    - Weekly 003 was synthesized from exactly three evidence-validated Daily Research Notes in the 2026-07-27 through 2026-08-02 window.
    - The Daily notes distinguish action from resulting state, capability invocation from delegated work, and manager contribution from handoff ownership transfer.
    - The Weekly publication defines six proposed objects: WorkBoundaryContract, OwnershipLedger, AuthorityDecision, ContextPackage, EvidenceEnvelope, and CompletionVerifier.
    - The Weekly run record assigns WorkBoundaryContract and OwnershipLedger P0 priority and identifies them as the shared prerequisite for GUI, MCP, A2A, manager, and handoff execution.

  vendor_claims: []

  mechanisms:
    - WorkBoundaryContract declares the boundary type, before-and-after work ownership, control owner, state owner, authority source, expected output, evidence contract, completion claimant, completion verifier, retry owner, compensation owner, and return or escalation condition.
    - OwnershipLedger records durable ownership facts before and after a boundary event.
    - A completion claim remains separate from acceptance by an independent verifier.
    - Protocol adapters transport operations but do not redefine Position authority or WorkOrder lifecycle semantics.

  evidence:
    - Weekly 003 boundary matrix compares computer operation, MCP capability call, manager-to-specialist work, handoff, and A2A delegation.
    - Weekly 003 queue reprioritization and run record preserve the P0 decision and its rationale.
    - Production Test V1 records the source Daily notes as evidence-validated and commit-verified.
    - No new external evidence was added during this Engine transition.

  limitations:
    - The evidence base is intentionally small: three Daily notes and one Weekly synthesis.
    - The proposed contract has not yet been tested against a concrete four-path comparative experiment.
    - The boundary fields have not been mapped to frozen TMPA core objects.
    - The relationship between FCoP custody events and a complete OwnershipLedger remains untested.
    - Evidence retention, privacy, cancellation, timeout, compensation, and duplicate-action semantics are unresolved.

  comparisons:
    - Computer operation usually retains local WorkOrder ownership while execution is delegated to a harness.
    - MCP capability calls usually retain Host-level work ownership.
    - Manager-to-specialist calls retain manager ownership of the parent result.
    - Handoffs may transfer active ownership for a bounded scope.
    - A2A delegation can move execution ownership to a remote Agent while local acceptance ownership remains with the caller.

  unresolved_questions:
    - Which ownership dimensions belong in TMPA core objects and which remain runtime projections?
    - Can the same contract represent contribution without ownership transfer and explicit handoff without ambiguity?
    - What is the minimum append-only event set required to reconstruct ownership deterministically?
    - How should nested boundaries project parent, child, and acceptance ownership?
    - Which completion verifiers must be deterministic and where is human judgment permitted?
    - Can current FCoP lifecycle evidence project an OwnershipLedger without changing the protocol?
```

## Reading gate decision

**Result:** `Reading` opened and the source package is sufficient for a future Analysis-stage comparison.

The item is not advanced to `Analysis` in this run. The next governed action is to test the proposed fields against the five boundary types, identify the minimal invariant set, and produce an explicit Analysis record.

## Evidence boundary

This record is a lifecycle and reading artifact. It is not a publication, specification, TMPA revision, or claim that the proposed architecture has been experimentally validated.
