# Q-20260817-03 — Compact command activity is a presentation layer over the full transcript

- Runtime date: 2026-08-17
- Column: Open-source Engineering
- Source object: Q-20260817-03
- Primary source: https://github.com/openai/codex/commit/1f41cc5d92722748e45cae9cecc6d883a4e7cbb1
- Evidence class: Fact for merged code/tests; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

Long agent sessions can flood a terminal UI with many short successful commands. Simply deleting or collapsing those entries would reduce noise at the cost of reconstructability. The merged change instead groups a bounded class of completed successful commands into a compact display while retaining their individual command/output transcript and preserving failures, interactions and unrelated active work as visible boundaries.

## Facts

1. The TUI groups consecutive successful commands whose source is `Agent` or `UnifiedExecStartup`.
2. The compact display renders a summary such as `Ran N commands` with an affordance to view the transcript.
3. The underlying `ExecCell` still retains the individual calls; tests read `transcript_lines` and confirm command text and output remain present even when the display is compact.
4. The implementation defines `MAX_GROUPED_COMMANDS` as 32.
5. A completed group flushes once it reaches 32 calls, but active calls are not flushed merely because the cell has reached the group bound.
6. A call source outside the groupable set prevents the completed cell from continuing as a compact group; manual/user shell activity therefore stays outside this successful-agent grouping rule.
7. Any failed call makes the completed group flush rather than continue silently aggregating successful and failed activity.
8. Non-completed command status is normalized to a non-zero exit result when needed, preventing cancellation/other non-success completion from being treated as an ordinary successful grouped command.
9. Completed command activity is flushed before interaction-visible content such as approval/elicitation boundaries and when other non-empty transcript cells are inserted.
10. Hook activity also forces completed command activity to flush at the appropriate boundary.
11. Replay handling applies the same grouping rules to agent and unified-exec-startup command items.
12. Replay tests verify that a completed command remains represented once rather than duplicating its start when rebuilding history.
13. Tests cover live grouping, replay grouping, full transcript preservation, failures, overlapping/running commands, interaction boundaries and the 32-command group limit.
14. Tests explicitly verify a compact two-command display while separately asserting that the transcript contains both original commands and outputs.
15. Overlapping active command coverage verifies that streamed output remains available while another command completes; compaction must not force unrelated active work into history prematurely.

## Mechanisms

### Source-bounded grouping

`ExecCell::is_groupable_source` returns true only for `Agent` and `UnifiedExecStartup`. Compaction is therefore a specific policy for successful automated command activity, not a generic rule over every command event.

### Success-gated continuation

A compact group continues only when its existing calls are groupable, completed and successful. A failure/non-groupable call becomes a flush boundary once active work is finished.

### Bounded aggregation

The cell caps a group at 32 completed calls. This bounds the amount of activity represented by one compact history item and creates predictable flush points during long command sequences.

### Display/transcript separation

The compact history line is not the authoritative detail representation. `display_lines` may show `Ran N commands`, while `transcript_lines` continues rendering each call and output. The tests directly exercise both views.

### Replay-aware reconstruction

Replay feeds completed agent/unified-exec startup items through grouping logic while avoiding duplicate command-start representation. This makes compact presentation reproducible when restoring a thread rather than only during a live session.

## Evidence

- `codex-rs/tui/src/exec_cell/model.rs` defines the 32-command bound, groupable command sources, continuation and flush conditions.
- `codex-rs/tui/src/exec_cell/render.rs` changes compact display behavior for multi-call cells while preserving transcript rendering.
- `codex-rs/tui/src/chatwidget/command_lifecycle.rs` manages completed/untracked unified-exec calls, failures and active-cell flush boundaries.
- `codex-rs/tui/src/chatwidget/replay.rs` applies grouping logic during thread-history replay.
- Chat-widget lifecycle paths flush completed command activity at interaction, hook and other transcript boundaries.
- Regression tests assert the compact `Ran 2 commands` / `Ran 32 commands` display separately from the retained per-command transcript and cover replay/overlap/failure cases.

## Limitations

1. The demonstrated preservation guarantee is inside the TUI transcript/history model exercised by these tests; it is not a general cryptographic or append-only audit log guarantee.
2. Transcript retention does not by itself prove external persistence durability, immutability, provenance or long-term archival.
3. The compact grouping policy is source-specific and success-specific; other event types follow their own rendering/lifecycle rules.
4. The 32-command limit bounds one group, not total session transcript size.
5. Replay correctness is tested for the implemented thread-item paths; it does not prove arbitrary historical data from incompatible versions can always reconstruct identically.
6. An operator can still choose not to open the transcript; compact display improves readability but does not ensure human review.
7. Preserving command/output text does not prove that every external side effect can be reconstructed from that text alone.

## Comparisons

- Dropping successful command details would make the UI quieter but destroy evidence needed to inspect what actually ran. The merged design changes presentation while retaining the detailed transcript representation.
- Rendering every successful command as a full history cell maximizes immediate visibility but creates operational noise. Bounded grouping keeps a short summary without discarding the detailed view.
- Unbounded grouping could hide too much activity behind one summary and complicate navigation. The fixed 32-command flush bound limits that compression scope.
- Applying live-only grouping would create a different view after restart. Replay-aware grouping preserves the same presentation principle when history is reconstructed.

## Unresolved questions

1. Where and how is the full transcript persisted beyond the in-memory/history-cell model, and what durability guarantees does that storage provide?
2. Are transcript records content-addressed or otherwise protected against later mutation when used for formal audit?
3. How are extremely large command outputs truncated, redacted or retained, and does compaction interact with those limits?
4. Can operators export the uncompressed transcript in a machine-verifiable form for incident analysis?
5. Should the compact summary expose failure-free duration, command categories or evidence counts without widening the grouping scope?
6. How should transcript compatibility be versioned so replay across TUI schema changes remains deterministic?

## Reading boundary

This note establishes the merged TUI mechanism: successful Agent and UnifiedExecStartup commands can be presented as bounded compact groups of up to 32 completed calls; failures, interactions and non-groupable activity create visibility/flush boundaries; the detailed per-command transcript is still rendered and tested; and replay follows the same grouping principle without duplicate starts. It does not establish an immutable audit log, complete side-effect reconstruction, or storage durability beyond the demonstrated transcript/history implementation. Those broader judgments belong to Skill 04 Analysis.
