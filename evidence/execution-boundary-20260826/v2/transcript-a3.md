# A3 — Failure and delivery: sanitized source-faithful transcript

Source class: restricted report, issue, panel, mobile, and runtime evidence records. Brackets are redactions.

## Test records

```text
Targeted classification command — exit 0; tests 57, pass 57, fail 0,
duration 13654.4648 ms.

Follow-up semantic route regression — exit 0; tests 14, pass 14,
fail 0, duration 521.3741 ms.

Reports/issues/mobile/web-panel regression set — exit 0; tests 221,
pass 221, fail 0, duration 339815.6504 ms.

Earlier record-precedence run: 55/57. The defect was that superseded or
invalid final records were overshadowed by main-report rules. After the
repair, the precedence run was 57/57 and the follow-up semantic route was 14/14.
```

## Runtime and UI observations

```text
Controlled restart final health: ok=true; readiness=ready; Gateway=online;
writer lock=owned; project binding=true; version=[redacted].

Reports API metadata: source=ledger;
projection_rule_version=task-archive-lineage-v2;
retained_records_immutable=true.

Visible report page after refresh:
all reports=17; main-task reports=1; subtask reports=4; current records=0;
historical reports=12. The current root group contained five reports, and
current rows did not display as history.

Issues: six observed items were closed/resolved; one remained open;
default open-issue badge=1.
```

Interpretation limit: the snapshot shows the tested projection behavior; it does not prove every failure propagates losslessly through every future surface.
