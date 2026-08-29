# Q-20260829-01 — Surviving Full Baseline for Nested-Agent Context Reconstruction

- Runtime date: 2026-08-29 (Asia/Shanghai)
- Queue signal: SIG-20260829-012
- Primary source: https://github.com/openai/codex/commit/f9cdc90c2c4d38cd557deb933e592f0032a5ea6e
- Evidence level: `merged_maintainer_change`
- Scope: OpenAI Codex rollout reconstruction, nested-agent forks, full world-state baselines, compaction boundaries, previous-turn settings and reference context

## Problem

A nested Agent can be forked from persisted rollout history after the parent task message has been removed by the fork operation. If reconstruction treats only surviving user messages as authoritative context baselines, the child can lose developer settings and reference context that were already installed and persisted. The opposite repair is also dangerous: accepting any nearby context fragment can resurrect partial, superseded or pre-compaction state.

The bounded question is therefore not simply whether context should be inherited. It is which persisted artifact is strong enough to re-establish parent-turn context after a fork, while preserving the history/rollback boundary and rejecting incomplete or obsolete snapshots.

## Facts

The merged Codex change modifies `finalize_active_segment` in rollout reconstruction. An active segment is now considered to have a context baseline when either it already counts as a user turn or it contains an eligible full `WorldState` snapshot within the segment's surviving compaction boundary.

This new `has_context_baseline` predicate does not turn a context-only segment into a user turn. The code separately preserves `counts_as_user_turn` for history rollback semantics while allowing the full world-state snapshot to establish context provenance. That separation matters: context recovery can succeed without inventing a user message that no longer survives the fork.

When `previous_turn_settings` have not yet been recovered, the newest surviving segment that satisfies the context-baseline predicate may provide them. The same broader baseline rule is applied to `reference_context_item`: a surviving context baseline may restore reference context, while an explicit surviving clear state remains meaningful.

The implementation deliberately rejects weaker evidence. The new tests cover a bare `TurnContext`, a `WorldState` patch without a full snapshot, and a full snapshot that is no longer eligible because of compaction. None of those cases is allowed to seed the previous-turn/reference-context baseline merely because some context-like data exists.

The resumed-history test is parameterized so the same baseline restoration is exercised both when the segment contains a normal user message and when the fork has removed that task message. It serializes and deserializes the rollout representation before reconstruction, so the assertion covers persisted history rather than only an in-memory fork.

The subagent integration suite adds nested root → child → grandchild cases across legacy and paginated history modes, across full-history, last-turn and no-history parent fork choices, and after compaction. The grandchild checks that the intended developer instructions and environment context are inherited once rather than disappearing or being duplicated through repeated reconstruction.

## Vendor Claims

The maintainer describes the change as preserving context baselines across nested Agent forks: a surviving full world-state snapshot can restore prior turn settings and reference context even when the associated user message is removed, while partial snapshots and full snapshots superseded by compaction are ignored.

The changed reconstruction predicate and the new persisted-history and nested-agent test matrix directly support that bounded claim.

## Mechanisms

1. **Separate history identity from context authority:** a segment may establish a context baseline without being counted as a user turn for rollback.
2. **Full-snapshot qualification:** context-only recovery requires an eligible full world-state snapshot, not just a `TurnContext` record or a patch.
3. **Compaction boundary:** snapshots that no longer survive the applicable compacted history cannot re-establish parent context.
4. **First-valid restoration:** previous-turn settings are populated only while the reconstruction accumulator has no newer accepted value.
5. **Reference-context restoration:** the same qualifying baseline can restore the reference-context item, while an explicit clear remains distinct from never-set state.
6. **Persisted representation test:** the baseline case is round-tripped through serialization before reconstruction.
7. **Nested-fork integration:** root/child/grandchild tests cover multiple history modes and compaction, checking that inherited context arrives exactly once.
8. **Negative qualification tests:** bare context, patch-only state and compacted-away full snapshots do not gain baseline authority.

## Evidence

Primary evidence is merged OpenAI Codex maintainer commit `f9cdc90c2c4d38cd557deb933e592f0032a5ea6e`, titled `Preserve context baselines across nested agent forks (#41424)`.

The central implementation file is `codex-rs/core/src/session/rollout_reconstruction.rs`. It introduces the full-world-state alternative in the context-baseline predicate and uses that predicate when restoring previous-turn settings and reference context.

`codex-rs/core/src/session/rollout_reconstruction_tests.rs` adds the persisted-history baseline case and negative cases for bare context, patch-only state and a snapshot made ineligible by compaction.

`codex-rs/core/tests/suite/subagent_notifications.rs` adds nested root/child/grandchild integration coverage across legacy and paginated history modes and compacted histories, asserting inherited context continuity through forks.

## Limitations

A full world-state snapshot is treated as sufficient reconstruction evidence only within the demonstrated rollout model. The change does not cryptographically authenticate who produced the snapshot, nor does it prove that every field inside an accepted snapshot is semantically correct.

The mechanism restores context continuity; it is not by itself an authorization protocol. Developer instructions and reference context may influence later behavior, but the selected change does not establish that those values are permission grants or that they should bypass an independent call-time authorization check.

The compaction rule prevents demonstrated superseded snapshots from seeding the baseline, but this Reading does not prove all possible corruption, concurrent-write or cross-process replay cases are detected.

The integration matrix proves inheritance through the covered nested forks and history modes. It does not establish arbitrary-depth distributed Agent lineage, cross-host exactly-once reconstruction or signed provenance.

A qualifying full snapshot can preserve stale information if the snapshot was already wrong at creation time. The repair defines which persisted state is authoritative enough for reconstruction; it does not validate the truth of every reconstructed value.

## Comparisons

Restoring only from surviving user turns is too strict for nested forks because the fork may intentionally remove the task message while the installed context remains the correct baseline. Restoring from any context fragment is too weak because a patch or obsolete snapshot can be incomplete or stale.

The selected change uses a middle boundary: a surviving full world-state snapshot can carry context authority without changing user-turn history semantics. That is a useful pattern for durable digital-worker recovery: lifecycle/history identity and state-reconstruction authority can be related without being identical.

## Unresolved Questions

- Does each accepted full world-state snapshot carry enough lineage metadata to audit which parent execution established it?
- Could concurrent persistence produce two apparently surviving full baselines, and if so what deterministic ordering selects the authoritative one?
- Which context fields should be treated as reconstructable state versus permissions that require fresh call-time authorization?
- How are schema migrations handled when an old full snapshot is resumed by a newer Runtime version?
- Should a reconstructed baseline carry an explicit freshness or generation identifier so downstream tools can distinguish inherited state from newly confirmed state?
- What recovery behavior applies if the full snapshot is structurally valid but a referenced external resource has been revoked or disappeared?

## Reading Conclusion

The Codex change makes nested-Agent context reconstruction depend on a stronger persisted boundary than message presence alone. A context-only segment may restore previous-turn settings and reference context when an eligible surviving full world-state snapshot proves a complete baseline, while bare context, patch-only state and compaction-superseded snapshots remain insufficient. The important architectural distinction is that context authority for reconstruction is separated from user-turn identity for rollback. This improves bounded recovery correctness without turning the snapshot into a universal authorization, truth or distributed-provenance guarantee.
