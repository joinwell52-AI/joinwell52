# October 28, 2026 | A queued tool after failure, and a history with a missing event

[中文版实验报告](./00-report.md)

This report follows the [18 developments in the October 28 daily digest](https://joinwell52-ai.github.io/joinwell52/en/runtime/daily-intelligence/2026-10-28). The digest collected sources; it did not run experiments. We selected two changes with pinned source before and after a fix, then ran the same upstream regression tests against both revisions. The other 16 groups are not presented as tested here.

## Experiment 1: does a selected failure stop queued native tools?

The source is [OpenAI Agents Python PR #5446](https://github.com/openai/openai-agents-python/pull/5446). We compared the [parent commit `a91f0bfe`](https://github.com/openai/openai-agents-python/tree/a91f0bfe013a63ce0ad8935c8c2d25047d249002) with the [merge commit `cd26bbbc`](https://github.com/openai/openai-agents-python/tree/cd26bbbc52847845fde73b9952b51e62e2bcbdc0). We ran the [same regression test added by the fix](https://github.com/openai/openai-agents-python/blob/cd26bbbc52847845fde73b9952b51e62e2bcbdc0/tests/test_native_tool_failure_history.py#L438) against both source trees. The old-source run printed its imported module path to verify that it had not silently loaded the fixed code.

The test uses `ScriptedModel`, `SQLiteSession`, and synthetic custom and local-shell tools to control event ordering. It combines two tool kinds, streaming on or off, input rejection on or off, and cleanup error on or off: **16 cases**. No live model, shell command, network mutation, or production session was involved.

| Source | Result | Direct observation |
| --- | --- | --- |
| Parent commit | **16/16 failed** | Every case failed at the assertion that the active native tool had received cancellation. |
| Merge commit | **16/16 passed** | In the same controlled schedules, the active tool was cancelled and a queued call did not advance. |
| Merge commit, two related test files | **84/84 passed** | Focused regression coverage passed; this does not establish general production safety. |

We used Windows, Python 3.13.13, and the upstream `uv.lock` via `uv sync --group dev --no-default-groups`. The focused command was:

```text
python -m pytest tests/test_native_tool_failure_history.py -k test_selected_function_failure_stops_queued_native_invocations -q -o addopts=
```

For the parent run, the fixed-version test file was reused while `sys.path` pointed first to the parent `src` tree. This is a **local before/after replay of an upstream regression test**, not an independently discovered production incident. It supports the cancellation and queue boundary under these synthetic schedules. It does not show that a remote operation already submitted can be rolled back. The PR was merged; we did not verify inclusion in a particular package release.

## Experiment 2: can a damaged event log remain readable without hiding the gap?

The source is [OpenHands SDK PR #6197](https://github.com/OpenHands/software-agent-sdk/pull/6197). We compared the [parent commit `acd96e6f`](https://github.com/OpenHands/software-agent-sdk/tree/acd96e6fa424c02432304395b9208f99be24b54d) with the [merge commit `ded5fa5e`](https://github.com/OpenHands/software-agent-sdk/tree/ded5fa5e76ff9b7b4ff622a8df2ed20335e10652). Five parameterized cases from the [fixed-version event-store tests](https://github.com/OpenHands/software-agent-sdk/blob/ded5fa5e76ff9b7b4ff622a8df2ed20335e10652/tests/sdk/conversation/test_event_store.py) were run against both trees and against a later main commit, `46b1fa5c`. The imported SDK path was printed for the before/after runs.

The test store is `InMemoryFileStore`. It simulates a missing middle or first event file, checks whether surviving events can be indexed, checks that original sequence numbers are not reused, checks a branch with a missing parent, and checks warning behavior. It does not damage real files or run a deployed server.

| Source | Result | Direct observation |
| --- | --- | --- |
| Parent commit | **5/5 failed** | A gap stopped later survivors from being indexed; a branch lookup could fail. The old version also had no `get_seq` method. |
| Merge commit | **5/5 passed** | Survivors remained readable, the original disk sequence retained a gap, a new event received a new number, and missing-parent traversal warned. |
| Later main commit | **5/5 passed** | This small controlled set did not regress in that revision; release inclusion was not checked. |

For a concrete example, start with on-disk sequence numbers `0, 1, 2, 3` and delete event `1`. The surviving events can be displayed at dense positions `0, 1, 2`, but their original numbers remain `0, 2, 3`. The next append receives `4`, rather than reusing the missing `1`. **Readable again does not mean historically complete.** Bridging a branch path does not reconstruct the lost content.

The workspace dependencies were installed with `uv sync --group dev --no-default-groups`. The focused test selection was:

```text
python -m pytest tests/sdk/conversation/test_event_store.py -k "test_log_survives_missing_middle_file or test_seq_is_the_on_disk_index_and_survives_a_reload or test_path_to_root_bridges_a_missing_ancestor or test_lost_event_file_is_reported_once" -q -o addopts=
```

For the before/merge comparison, the same fixed-version test file was reused and `sys.path` selected the corresponding `openhands-sdk` tree. These results do not cover real disk damage, concurrent writers, a full conversation service, or whether a higher-level verifier receives a machine-readable damaged-history signal. The PR was merged; a specific packaged release was not verified.

## Independent probe: cancellation and an accepted remote operation

We added a [synthetic remote probe](./probe-stop-receipt.py) through the merge commit's real `Runner` and `CustomTool`. An active call handed a request to a separately scheduled worker before a function failure was selected. At the stopping point, the active call had received cancellation and the queued call had not started, but the worker had accepted the request. After the local run ended, releasing that worker still let it commit. The two snapshots are in the [saved result](./probe-stop-receipt.result.json).

The worker is an intentionally detached coroutine in the same Python process. There was no HTTP request or production mutation. This is a constructed counterexample to equating local cancellation with a known external outcome, not a new OpenAI framework defect or a measured incident rate.

## Independent probe: two views of a real local file gap

The [disk-gap probe](./probe-disk-gap.py) used the merge commit's `EventLog` with `LocalFileStore`. It wrote four JSON files in a temporary directory, deleted file sequence 1, and loaded through a new store instance. All survivors were readable. Their list positions were `0,1,2`, while `get_seq` returned `0,2,3`; loading emitted a missing-file warning. The [saved result](./probe-disk-gap.result.json) records both views and the surviving IDs. This goes beyond the upstream in-memory test by exercising local file deletion, but not a production disk failure or higher-level conversation recovery.

Both scripts contain assertions and can be rerun against the pinned merge source and its development dependencies. Verify the imported source path and save any new observation separately rather than overwriting this round's result.

## What remains open

The before-and-after results and two independent probes answer narrow engineering questions without claiming framework-wide guarantees. We did not run the Paperclip handover or Paradev viewer-credential paths from the digest. We also did not establish a corresponding CodeFlowMu product issue or complete a product-specific cost and benefit review; **zero items entered formal development review** in this round.

Two questions remain: how should an agent record and later reconcile an accepted external action whose outcome is uncertain when cancellation arrives, and how should a resumed verifier receive a machine-readable damaged-history signal? The probes show why these questions matter; they do not test the proposed consumer behavior.
