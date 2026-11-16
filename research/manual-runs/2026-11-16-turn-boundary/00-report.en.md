# Queued input and a handoff result: bounded experiment

Date: 2026-11-16. Source: [AG2 PR #3639](https://github.com/ag2ai/ag2/pull/3639), by coder-abu, merged. The change leaves input queued during a turn for the next turn on the same stream when a final tool result or client handoff forces the current turn to end. The upstream PR also calls out adapters that create a new stream per request; this experiment does not establish delivery behavior for them.

## Pinned sources and method

- AG2 v1.3.2 at `bf76b9cb6607936a7c240b1efc1811d8bd422de6`; comparison parent `3399e3ef2e339f6c64f7fc8d27eaed09662846a4`.
- The [public probe](probe_turn.py) runs the current AG2 module and substitutes only the pre-fix `_execute_turn` function body for the old comparison. AG2 `TestConfig` supplies a scripted model; no live model or credentials are used. A final tool returns `Ticket escalated.` while `What about my order?` is queued when its result event arrives.
- With the checkout pinned to v1.3.2 and the parent available, run `python probe_turn.py PATH_TO_AG2_CHECKOUT` in an environment where that checkout is installed. A shallow clone can obtain the parent with `git fetch --no-tags --depth=1 origin 3399e3ef2e339f6c64f7fc8d27eaed09662846a4`. We reran this public probe locally and it passed.
- Three actual upstream target tests also passed: final tool result, client handoff followed by resume, and ordinary mid-turn input. Their source is the pinned [AG2 test file](https://github.com/ag2ai/ag2/blob/bf76b9cb6607936a7c240b1efc1811d8bd422de6/test/agent/test_run.py).

| Comparison | Final reply for this turn | Scripted model calls |
| --- | --- | ---: |
| Pre-fix function on the current remaining runtime | `Your order shipped.` | 2 |
| Current v1.3.2 function and runtime | `Ticket escalated.` | 1 |

The structured [result](turn-results.json) describes a local function-level causal comparison, **not** a full old-release compatibility run. We did not test a real provider rejecting an unanswered client call or the A2A/AG-UI new-stream adapters.

## CodeFlowMu comparison

CodeFlowMu V3.0.152 at `0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f`. A local probe crossed its current `NativeHostProcess.steer` method. If the process had already ended, the result was `not_live`, with zero stdin writes. If it ended during a write with no native delivery receipt, the result was `unknown`; the input was saved, and repeating the request retained `unknown` with one total stdin write. Twenty-seven relevant coordination/delivery regression tests passed. Two full integration cases stopped at the trusted-admin test prerequisite `TEST_ADMIN_TOKEN_REQUIRED`; they were not counted as passed.

This product evidence supports a local distinction between saved input and confirmed native delivery. It does **not** prove the model consumed that input, that every live Host uses AG2's turn semantics, or that CodeFlowMu has the upstream defect. Formal FCoP TASK/REPORT/acceptance facts are separate from a Host conversation turn.

## Decision

No CodeFlowMu change, AG2 dependency, or formal development review item was justified. A future trusted-Host experiment should compare input during work, at handoff, and after exit, recording reply, delivery receipt, model calls, and new attempts. Conditional verification effort: 0.5–1 engineering day if that environment already exists; this is a research estimate, not an implementation schedule.

The upstream probe and results are public. CodeFlowMu source and its product test environment are access restricted, so the product part is reported with its limits. These test counts are not an end-to-end reliability percentage.
