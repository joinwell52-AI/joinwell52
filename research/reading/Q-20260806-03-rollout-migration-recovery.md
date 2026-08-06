# Reading Record — Q-20260806-03 Semantic rollout migration and recoverable publication

- **Queue item:** `Q-20260806-03`
- **Column:** Open-source Engineering
- **Selection status:** Selected
- **Priority:** P0
- **Skill invoked:** `Skill 03 — Deep Reading`
- **Operating date:** 2026-08-06 (Asia/Shanghai)
- **Primary source class:** Merged maintainer pull request, commit diff, implementation source and tests

## Reading scope

This pass reads OpenAI Codex commit `aac9f842473ac6a05d417dd76ce8b89bdb3b707d` and merged PR #37191 as evidence about semantic replay, rollback planning, subagent-history boundaries, staged publication, journaling and crash recovery during legacy rollout migration. It records the implementation and its limits without performing Research Analysis or drafting an article.

## Deep Reading output

```yaml
reading_notes:
  problem:
    - Legacy rollout files can contain historical rollbacks, compaction checkpoints, late lifecycle events and subagent copies of parent history.
    - Copying records verbatim into a new storage form can change the conversation visible after resume, alter model context and retain duplicated parent history in child rollouts.
    - Migration spans rollout files and SQLite metadata, so a crash can occur after one side is published but before the other is complete.

  facts:
    - PR #37191 was merged into openai/codex as commit aac9f842473ac6a05d417dd76ce8b89bdb3b707d.
    - The change adds explicit rollback planning, rollback replay and subagent migration modules.
    - Migration scans both active and archived session roots and preserves compressed or archived storage form and location.
    - The reverse JSONL scanner gains a configurable maximum record size and discards oversized records without buffering them.
    - The migration maximum rollout-line size is 16 MiB.
    - Migration outcomes include Eligible, Migrated, AlreadyPaginated, SkippedEmpty, SkippedBusy and Failed.
    - Dry-run mode, writer-lock coordination and recovery of pending migrations are present in the implementation.
    - The change adds tests for rollback and compaction combinations, subagent replay bounds, archived and compressed rollouts, recovery, concurrent maintenance and damaged JSONL input.

  mechanisms:
    - RollbackPlanner assigns parsed records to logical user-turn boundaries rather than treating rollback as deletion of a physical file suffix.
    - Explicit turn identifiers attach late completion and lifecycle records to the turn they belong to, allowing surviving records to remain visible even if later turns are rolled back.
    - ThreadRolledBack events are consumed by the migration plan and are not retained as visible migrated records.
    - Compaction frames preserve or trim replacement history; when required for cold resume, a surviving compaction can be retained with an empty replacement history as the replay anchor.
    - Subagent migration reverse-scans for a safe model-context checkpoint and returns the smallest bounded replay it can prove sufficient.
    - If a bounded subagent replay cannot be proven safe, the caller falls back to a complete tolerant replay.
    - The migrated subagent SessionMeta is rewritten with subagent_history_start_ordinal so copied parent context is not projected as child turns.
    - Publication uses temporary staged paths, flush and sync operations, rename, parent-directory synchronization and a durable .pending journal.
    - The journal bridges the interval between publishing JSONL and completing SQLite metadata and is removed only after both sides are complete.

  evidence:
    - The merged PR body explicitly identifies rollback, compaction and copied subagent history as semantic-migration risks.
    - rollback_plan.rs contains record-to-boundary ownership, targeted lifecycle assignment, rollback application and compaction-anchor logic.
    - subagent.rs documents and implements bounded reverse replay with a full tolerant-replay fallback.
    - publish.rs states that the .pending journal is the durable handoff between rollout publication and SQLite completion.
    - rewrite_subagent_history_boundary writes a temporary head, copies the remaining rollout, flushes, syncs and renames it over the staged path.
    - ReverseJsonlScanner tests show oversized records being skipped while surrounding valid records remain readable.

  limitations:
    - The evidence is a merged maintainer change and its tests; it does not include production-fleet migration metrics, independent validation or measured data-loss probability.
    - Tolerating malformed or oversized records can preserve migration progress while omitting data; the source does not prove that every damaged history remains semantically complete.
    - Bounded subagent replay is conditional; failure to prove a safe boundary falls back to full replay and can retain duplication and cost.
    - The journal coordinates local rollout and SQLite phases but is not a general distributed transaction across remote services or filesystems.
    - Rename, fsync and parent-directory durability assumptions depend on operating-system and filesystem behavior not fully established by the selected source package.
    - The 16 MiB limit is an engineering threshold rather than a semantic correctness guarantee.
    - The sources do not report migration throughput, recovery time, live-writer contention rates or behavior at fleet scale.

  comparisons:
    - Verbatim physical copying preserves bytes but can break logical semantics; the selected implementation performs semantic canonicalization and replay instead.
    - A single atomic rename can publish one file, but the complete migration crosses JSONL and SQLite; the durable journal supplies recoverability rather than making the whole operation one atomic transaction.
    - Excluding all subagent rollouts avoids complexity but loses useful history; replaying all copied parent context preserves too much. The bounded replay attempts a proven suffix and otherwise chooses the conservative full replay.
    - A physical suffix rollback is simpler but fails when late events target older surviving turns; logical ownership by turn ID handles that ordering case.

  contradictions:
    - The change is described as preserving legacy semantics, but malformed, partial or oversized input may be skipped or fail, so preservation is conditional on what can be parsed and reconstructed.
    - The selected object is described as atomic migration, but atomicity applies to staged file publication; the full JSONL-plus-SQLite transition is recoverable through journaling rather than globally atomic.
    - Archived and compressed storage form is retained, while the logical contents may still be canonicalized, replayed and rewritten.

  unresolved_questions:
    - What invariant or checksum proves that the resumed model context is semantically equivalent before and after migration?
    - How are skipped malformed or oversized records surfaced to operators, and when should they block publication rather than permit partial migration?
    - What crash points are covered across file rename, directory sync, journal persistence and SQLite commit on every supported platform?
    - Can the writer-lock and pending-journal design prevent two processes from recovering or publishing the same thread concurrently?
    - How are migration versions and idempotency recorded so a future migration can distinguish already canonicalized history from partially transformed history?
    - What operational metrics are needed to evaluate throughput, contention, fallback frequency and semantic-drift incidents at fleet scale?
```

## Source traceability

1. Merged commit: `https://github.com/openai/codex/commit/aac9f842473ac6a05d417dd76ce8b89bdb3b707d`
2. Merged pull request: `https://github.com/openai/codex/pull/37191`
3. Rollback planner: `https://github.com/openai/codex/blob/aac9f842473ac6a05d417dd76ce8b89bdb3b707d/codex-rs/thread-store/src/local/rollout_migration/rollback_plan.rs`
4. Subagent bounded replay: `https://github.com/openai/codex/blob/aac9f842473ac6a05d417dd76ce8b89bdb3b707d/codex-rs/thread-store/src/local/rollout_migration/subagent.rs`
5. Publication and journal helpers: `https://github.com/openai/codex/blob/aac9f842473ac6a05d417dd76ce8b89bdb3b707d/codex-rs/thread-store/src/local/rollout_migration/publish.rs`
6. Today's Research Plan: `research/runtime/plans/2026/08/2026-08-06-plan.json`
7. Skill 03: `research/skills/03-deep-reading.md`

## Reading gate decision

**Result:** Deep Reading completed. The merged source package provides implementation-level evidence for logical rollback replay, bounded subagent history, staged publication and journaled recovery, while leaving production-scale guarantees unresolved. No Research Analysis, engineering recommendation or article was produced.
