# A4 — Service health and recovery: sanitized source-faithful transcript

Source class: restricted recovery directive, governance-delivery audit, repair evidence, and test records. Brackets are redactions.

## Bounded recovery chain

```text
An effective directive granted PM a limited scope: repair lifecycle
transition, wake-up, and report-gate behavior; add regression evidence;
recover or redispatch two stalled downstream items; do not release QA until
the required DEV and OPS terminal reports exist.

The directive was delivered to PM and continuation was recorded as success.
Two downstream dispatches were recorded. The QA item moved from inbox to
active at 14:48:25+08:00; the OPS and DEV terminal reports were submitted at
14:48:42+08:00 and 14:49:37+08:00 respectively.

This record deliberately retains the discrepancy: physical timestamp order
alone does not establish that the QA release's causal precondition was met,
nor does it alone prove a violation.
```

## Repair verification

```text
Lifecycle-governor test — exit 0; 16 tests, 16 pass, 0 fail.
Notable assertion: non-activatable stage and multiple physical projection
fail-closed regressions passed.

Task-dispatcher test — exit 0; 46 tests, 46 pass, 0 fail.
Notable assertion: lifecycle activation failure starts no TASK_BOUND Session
and leaves no active lease.

YAML fallback lifecycle — exit 0; 4 tests, 4 pass, 0 fail.
PM core and routing — exit 0; 7 tests, 7 pass, 0 fail.
Runtime typecheck — exit 0; no errors.
PM rail-fault-recovery skill manifest validation — exit 0; stable manifest
and referenced package present.
```

Interpretation limit: one authorized recovery case and named tests cannot establish that all runtime faults are recoverable through the same path.
