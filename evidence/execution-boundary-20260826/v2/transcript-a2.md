# A2 — Observer audit: sanitized source-faithful transcript

Source class: restricted governance, panel, and web-panel evidence records. Brackets are redactions.

## Baseline that passed but did not cover the defect

```text
Baseline command 1: governance kernel test — exit 0; 7 tests, 7 pass, 0 fail.
Baseline command 2: panel terminal-status test — exit 0; 4 tests, 4 pass, 0 fail.

Uncovered observation: an EVAL report existed on a completed lifecycle task,
but the governance snapshot projected acceptance=pending /
formal_report_requires_acceptance. The panel routed that EVAL report through
the wait-for-PM display. Repeating PM approval reached ordinary approval and
returned a technical 409 because the EVAL task was already done.
```

## Candidate verification

```text
Governance kernel test — exit 0; 8 tests, 8 pass, 0 fail.
Panel terminal-status test — exit 0; 6 tests, 6 pass, 0 fail.
Web-panel test — exit 0; 109 tests, 109 pass, 0 fail.

Key assertion: repeated EVAL approval returns no_change/already_observed,
action_taken=false, no business decision, no lifecycle action, and the
lifecycle task file is byte-identical.

EVAL display closeout test — exit 0; 18 tests, 18 pass, 0 fail.
Runtime typecheck and shell build — exit 0.
```

Interpretation limit: these checks establish the boundary in named paths; they do not prove every future user interface or plugin lacks a bypass.
