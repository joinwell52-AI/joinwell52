# Reading Record — Q-20260809-03 Checkpoint conformance and persisted-state migration defects

- **Queue item:** `Q-20260809-03`
- **Column:** Open-source Engineering
- **Selection status:** Selected
- **Priority:** P0
- **Skill invoked:** `Skill 03 — Deep Reading`
- **Operating date:** 2026-08-09 (Asia/Shanghai)
- **Primary source class:** merged maintainer implementation, regression tests and conformance evidence

## Reading scope

This pass reads LangGraph commit `d569e18f4bd78b7652cb88c84b8dd098057e4f7d`. The bounded question is how persisted delta-history migration failed, why normal correctness tests did not expose it, how seed lookup was corrected, and what the commit itself says about conformance coverage across backends.

## Deep Reading output

```yaml
reading_notes:
  problem:
    - Persisted checkpoints split channel values between inline `channel_values` and `checkpoint_blobs` depending on value shape.
    - Stage-1 seed detection relied on a marker left by `_DeltaSnapshot`, so migrated plain values could be invisible even though they were durable and valid.
    - Replaying from root still reconstructed correct additive values, hiding the migration defect as a performance/correctness-of-mechanism problem rather than an obvious output corruption.

  facts:
    - Before the fix, migrated threads could fail to find an existing seed, walk to the root and replay every historical write on every read.
    - The commit reports replay counts of 3→1 for a 2-turn thread, 7→1 for 6 turns, and 21→1 for 20 turns after the fix.
    - Reported read latency becomes approximately flat at ~0.6 ms for those tested lengths after the change.
    - Stage 1 now checks both storage locations: existence of a non-empty blob row and the inline value for the same channel/version.
    - The blob predicate matches the `checkpoint_blobs` primary key dimensions and is bounded by the existing 1024-row history page.
    - Reading existing storage was chosen over writing new markers because changing future writes would not repair already-persisted migrated checkpoints.
    - Seed resolution prefers an actual blob when present and otherwise uses the inline value, which also distinguishes inline boolean `true` from the `_DeltaSnapshot` marker case.
    - `None` is intentionally not considered a seed because JSON null cannot distinguish “stored null” from absence at this layer.
    - Regression tests cover blob-stored plain values, `_DeltaSnapshot`, version bumps without storage, inline primitives and inline `True` versus marker semantics.
    - The commit reports Postgres tests passing on PG15 and PG16 and delta-channel conformance against `AsyncPostgresSaver` improving from 6/8 to 8/8.
    - The author explicitly notes that generic conformance was effectively wired only to `InMemorySaver`; SQLite's conformance test silently skipped when the conformance package was absent.
    - The commit argues that wiring the shared conformance suite to SQLite and Postgres would have caught the defect earlier.

  mechanisms:
    - Migration compatibility requires readers to understand all historical storage representations, not merely the representation emitted by the latest writer.
    - Seed detection is a persisted-state contract: a false negative may preserve final values while violating the intended bounded-replay invariant.
    - Cross-backend conformance is valuable when it asserts semantic invariants over a shared saver interface rather than only backend-local unit behavior.
    - A skipped conformance test is operationally different from a passing test; dependency wiring is therefore part of the test contract.

  limitations:
    - The selected commit repairs the Postgres path; SQLite is explicitly described as unaffected by this particular bug because it stores and inspects channel values differently.
    - The performance figures are maintainer-reported test results for the described cases, not an independent benchmark across production workloads.
    - The commit does not add the desired permanent Postgres conformance runner because that would require a new dev dependency and maintainer sign-off.
    - A single conformance suite cannot guarantee coverage of backend-specific persistence behavior unless the backend is actually wired into and executing that suite.

  contradictions:
    - Values remained correct despite the migration defect, so output-only tests could suggest the system was healthy while the intended delta-replay invariant was broken.
    - A conformance test file existed for SQLite, yet `importorskip` meant it could silently not run. File presence therefore did not equal conformance coverage.

  unresolved_questions:
    - Should CI fail rather than skip when a formally required conformance dependency is missing?
    - Which persistence invariants should be cross-backend contract tests versus backend-local regression tests?
    - Can replay-count or query-count invariants be encoded directly so future migrations cannot regress to root replay while preserving output correctness?
    - How should schema/storage-version metadata expose historical representation changes to readers?
```

## Source traceability

1. LangGraph merged commit: `https://github.com/langchain-ai/langgraph/commit/d569e18f4bd78b7652cb88c84b8dd098057e4f7d`
2. Today's Research Plan: `research/runtime/plans/2026/08/2026-08-09-plan.json`
3. Skill 03: `research/skills/03-deep-reading.md`

## Reading gate decision

**Result:** Deep Reading completed. The change demonstrates that durable-state migrations can violate an intended persistence invariant while leaving reconstructed values apparently correct, and that backend conformance only protects the system when the relevant backend actually executes the shared suite. No broader engineering recommendation or article was produced in Reading.