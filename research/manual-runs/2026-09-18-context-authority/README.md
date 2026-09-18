# Context recovered, authority re-proved — 2026-09-18

This package records two bounded experiments behind the bilingual articles published on 2026-09-18.

## Experiment A: conditional approval and prepared arguments

- Upstream: `openai/openai-agents-python` [PR #5066](https://github.com/openai/openai-agents-python/pull/5066)
- Before: tag `v0.22.2`, commit `83c737fd0b8d9a53bd39fa2a0856070417bb0bd3`
- After: tag `v0.22.3`, commit `fdf21db62c303a3db54b0dfbee82de2141fa2799`
- Path: original `Runner`, decorated tool, `ScriptedModel`, and tool execution code
- Boundary: no live model and no external effect

| Case | v0.22.2 | v0.22.3 |
| --- | --- | --- |
| Unchanged safe value | conditional callback, executes | conditional callback, executes |
| Unchanged protected value | approval interruption | approval interruption |
| Omitted value defaults to protected | callback sees `{}`, function executes `protected` | manual approval, no execution |
| Explicit integer | conditional callback, executes | conditional callback, executes |
| String coerced to integer | callback sees string, function receives integer | manual approval, no execution |
| Application validator transforms value | callback sees `PROD`, function receives `prod` | manual approval, no execution |

The v0.22.3 upstream file `tests/test_function_tool_approval_arguments.py` also passed all 108 tests in 3.88 seconds.

## Experiment B: secret transport and command-line visibility

- Platform: Microsoft Windows NT 10.0.26200.0
- Observer: `Win32_Process.CommandLine` under the same account
- Input: synthetic token only
- Boundary: command-line visibility only; this is not a Linux `/proc` reproduction and does not claim that env or stdin are inaccessible through other channels

| Transport | Synthetic token visible in command line |
| --- | --- |
| argv | yes |
| child environment | no |
| stdin | no |

## CodeFlowMu development review

No development item was opened. CodeFlowMu v2.1.2 recomputes a stable operation digest before execution and rejects changed requests as stale; its inspected process-launch paths did not place API keys in argv. Twenty-eight targeted approval-boundary tests passed. These results justify a review checklist and public explanation, not a speculative implementation task.

## Files

- `probe_approval_arguments.py`: version-comparison probe
- `probe_process_visibility.ps1`: Windows observer harness
- `process_visibility_worker.py`: synthetic child process
- `results-summary.json`: compact machine-readable results

